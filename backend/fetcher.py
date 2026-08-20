"""
Optional enrichment: pull real points-of-interest for a destination from the
Foursquare Places API, a short description from Wikipedia, and a photo from
Unsplash, then store them in the local `pois` table.

This is entirely optional — the app works fully without it, using the
curated JSON itineraries and the generic fallback generator instead.
To enable it, set FOURSQUARE_API_KEY / UNSPLASH_ACCESS_KEY in backend/.env
and call POST /api/admin/fetch-pois as an admin user.
"""
import os

import requests
from flask import current_app

from extensions import db
from models import POI


def _foursquare_key() -> str:
    return current_app.config.get("FOURSQUARE_API_KEY") or os.getenv("FOURSQUARE_API_KEY", "")


def _unsplash_key() -> str:
    return current_app.config.get("UNSPLASH_ACCESS_KEY") or os.getenv("UNSPLASH_ACCESS_KEY", "")


def search_places(destination: str, limit: int = 20) -> dict:
    key = _foursquare_key()
    if not key:
        return {"results": []}

    url = "https://api.foursquare.com/v3/places/search"
    headers = {"Accept": "application/json", "Authorization": key}
    params = {"near": destination, "limit": limit}
    resp = requests.get(url, headers=headers, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()


def get_wikipedia_summary(name: str) -> str:
    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{name.replace(' ', '_')}"
        resp = requests.get(url, timeout=10)
        if resp.ok:
            return resp.json().get("extract", "")
    except requests.RequestException:
        pass
    return ""


def get_unsplash_image(name: str) -> str:
    key = _unsplash_key()
    if not key:
        return ""
    try:
        url = "https://api.unsplash.com/photos/random"
        resp = requests.get(url, params={"query": name, "client_id": key}, timeout=10)
        if resp.ok:
            return resp.json().get("urls", {}).get("regular", "")
    except requests.RequestException:
        pass
    return ""


def fetch_and_store(destination: str) -> int:
    """Fetch POIs for a destination and upsert them into the database.

    Returns the number of newly stored places.
    """
    data = search_places(destination)
    stored = 0

    for place in data.get("results", []):
        fsq_id = place.get("fsq_id")
        if fsq_id and POI.query.filter_by(fsq_id=fsq_id).first():
            continue

        name = place.get("name", "Unknown")
        coords = place.get("geocodes", {}).get("main", {})
        category = (place.get("categories") or [{}])[0].get("name", "")

        poi = POI(
            fsq_id=fsq_id,
            name=name,
            description=get_wikipedia_summary(name),
            image_url=get_unsplash_image(name),
            category=category,
            lat=coords.get("latitude"),
            lon=coords.get("longitude"),
            destination=destination,
        )
        db.session.add(poi)
        stored += 1

    db.session.commit()
    return stored
