from flask import Blueprint, jsonify, request

from extensions import db
from itinerary_service import build_itinerary, list_curated_destinations
from models import ItineraryRequest

itinerary_bp = Blueprint("itinerary", __name__)


def _log_request(destination, people, days, budget, preferences, source):
    try:
        db.session.add(ItineraryRequest(
            destination=destination,
            people=people,
            days=days,
            budget=budget,
            preferences=", ".join(preferences) if preferences else None,
            source=source,
        ))
        db.session.commit()
    except Exception:
        db.session.rollback()  # Logging must never break the actual response.


@itinerary_bp.route("/generate", methods=["POST"])
def generate_itinerary():
    """Generate a trip schedule from the full trip-planning form.

    Body: { destination, people, days, budget, preferences: [] }
    """
    data = request.get_json(silent=True) or {}
    destination = (data.get("destination") or "").strip()
    days = data.get("days")
    people = data.get("people") or data.get("group_size")
    budget = data.get("budget")
    preferences = data.get("preferences") or []

    if not destination:
        return jsonify({"error": "destination is required."}), 400
    try:
        days = int(days)
        if days <= 0:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "days must be a positive integer."}), 400

    schedule, source = build_itinerary(destination, days, preferences)
    _log_request(destination, people, days, budget, preferences, source)

    return jsonify({
        "destination": destination,
        "days": days,
        "source": source,  # 'curated' or 'generated'
        "schedule": schedule,
    })


@itinerary_bp.route("/<destination>/<int:days>", methods=["GET"])
def get_itinerary(destination, days):
    """Direct fetch used by the Schedule page: GET /api/itinerary/goa/5"""
    preferences = request.args.get("preferences", "")
    preferences_list = [p for p in preferences.split(",") if p]

    schedule, source = build_itinerary(destination, days, preferences_list)
    _log_request(destination, None, days, None, preferences_list, source)

    return jsonify({
        "destination": destination,
        "days": days,
        "source": source,
        "schedule": schedule,
    })


@itinerary_bp.route("/destinations", methods=["GET"])
def get_destinations():
    """List every destination/day combo that has a curated itinerary."""
    return jsonify({"destinations": list_curated_destinations()})
