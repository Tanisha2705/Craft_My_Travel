"""
Itinerary generation.

Two tiers:
1. Curated  -> hand-written day-by-day plans stored as JSON in backend/data/.
               These are used whenever we have a file for the requested
               destination + number of days (e.g. "goa" + 5 -> data/goa5.json).
2. Generated -> a lightweight, preference-aware fallback so the app can
               still produce a reasonable plan for ANY destination/day
               combination that doesn't have a curated file.
"""
import json
import os
import re

DATA_DIR = os.path.join(os.path.abspath(os.path.dirname(__file__)), "data")

# Activity templates keyed by preference. Each generated day pulls a couple
# of these in based on what the user selected, so the fallback itinerary
# still feels tailored instead of totally generic.
PREFERENCE_ACTIVITIES = {
    "must-see attractions": "Visit the most iconic landmarks and photo spots in {dest}.",
    "hidden gems": "Wander off the main tourist trail to discover a lesser-known spot in {dest}.",
    "himalayan treks": "Head out for a scenic trek or nature walk near {dest}.",
    "arts & theatre": "Catch a local art gallery, museum, or live performance in {dest}.",
    "snow sports": "Try a snow/adventure sport typical of the {dest} region.",
    "local cuisine": "Sample signature local dishes at a well-loved restaurant in {dest}.",
    "cultural landmarks": "Explore a temple, fort, or heritage site that tells the story of {dest}.",
    "adventure and sports": "Get the adrenaline going with an outdoor adventure activity in {dest}.",
    "culture": "Immerse yourself in the local culture — markets, music, or a neighbourhood walk in {dest}.",
}

DEFAULT_ACTIVITIES = [
    "Morning: Free time to relax or explore the neighbourhood around your stay.",
    "Afternoon: Visit a top-rated local attraction in {dest}.",
    "Evening: Enjoy dinner at a well-reviewed local restaurant.",
]

FALLBACK_IMAGE_SEED = "https://picsum.photos/seed/{seed}/600/400"


def _slugify(destination: str) -> str:
    return re.sub(r"\s+", "_", destination.strip().lower())


def get_curated_itinerary(destination: str, days: int):
    """Return the hand-authored itinerary for this destination/day combo, or None."""
    filename = f"{_slugify(destination)}{days}.json"
    path = os.path.join(DATA_DIR, filename)
    if not os.path.isfile(path):
        return None
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def list_curated_destinations():
    """Return the list of destination/day combos that have curated data."""
    combos = []
    if not os.path.isdir(DATA_DIR):
        return combos
    for fname in sorted(os.listdir(DATA_DIR)):
        match = re.match(r"^([a-z_]+?)(\d+)\.json$", fname)
        if match:
            combos.append({"destination": match.group(1), "days": int(match.group(2))})
    return combos


def generate_fallback_itinerary(destination: str, days: int, preferences=None):
    """Build a simple but preference-aware itinerary when no curated file exists."""
    preferences = preferences or []
    normalized_prefs = [p.lower() for p in preferences]
    matched = [
        PREFERENCE_ACTIVITIES[p] for p in normalized_prefs if p in PREFERENCE_ACTIVITIES
    ]

    schedule = []
    for day_num in range(1, max(int(days), 1) + 1):
        if matched:
            # Rotate through matched preference activities across days.
            activity = matched[(day_num - 1) % len(matched)].format(dest=destination)
            activities = [
                f"Morning: {activity}",
                DEFAULT_ACTIVITIES[1].format(dest=destination),
                DEFAULT_ACTIVITIES[2],
            ]
        else:
            activities = [a.format(dest=destination) for a in DEFAULT_ACTIVITIES]

        schedule.append({
            "day": f"Day {day_num}: Discover {destination.title()}",
            "image": FALLBACK_IMAGE_SEED.format(seed=f"{_slugify(destination)}-{day_num}"),
            "activities": activities,
        })

    return schedule


def build_itinerary(destination: str, days: int, preferences=None):
    """Public entry point: try curated data first, else generate one."""
    curated = get_curated_itinerary(destination, days)
    if curated is not None:
        return curated, "curated"
    return generate_fallback_itinerary(destination, days, preferences), "generated"
