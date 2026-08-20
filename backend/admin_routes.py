from flask import Blueprint, current_app, jsonify, request

from auth_utils import admin_required
from extensions import db
from models import ItineraryRequest, User

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_users(current_user):
    users = User.query.order_by(User.id).all()
    return jsonify({"users": [u.to_dict() for u in users]})


@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@admin_required
def edit_user(current_user, user_id):
    data = request.get_json(silent=True) or {}
    user = User.query.get_or_404(user_id)

    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.name = data.get("name", user.name)
    user.phone = data.get("phone", user.phone)

    db.session.commit()
    return jsonify({"message": "User updated.", "user": user.to_dict()})


@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@admin_required
def delete_user(current_user, user_id):
    if user_id == current_user.id:
        return jsonify({"error": "You cannot delete your own account while logged in."}), 400

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted."})


@admin_bp.route("/users/<int:user_id>/toggle-admin", methods=["POST"])
@admin_required
def toggle_admin(current_user, user_id):
    user = User.query.get_or_404(user_id)
    user.is_admin = not user.is_admin
    db.session.commit()
    return jsonify({"message": f"{user.username} admin status set to {user.is_admin}.", "user": user.to_dict()})


@admin_bp.route("/itinerary-requests", methods=["GET"])
@admin_required
def get_itinerary_requests(current_user):
    """Simple analytics feed: what have visitors been searching for?"""
    requests_ = ItineraryRequest.query.order_by(ItineraryRequest.created_at.desc()).limit(200).all()
    return jsonify({"requests": [r.to_dict() for r in requests_]})


@admin_bp.route("/fetch-pois", methods=["POST"])
@admin_required
def fetch_pois(current_user):
    """Optional: pull live points-of-interest for a destination (requires API keys)."""
    if not current_app.config.get("FOURSQUARE_API_KEY"):
        return jsonify({
            "error": "FOURSQUARE_API_KEY is not configured on the server. "
                     "Add it to backend/.env to enable live POI fetching."
        }), 400

    data = request.get_json(silent=True) or {}
    destination = (data.get("destination") or "").strip()
    if not destination:
        return jsonify({"error": "destination is required."}), 400

    from fetcher import fetch_and_store  # imported lazily; requires `requests`

    stored = fetch_and_store(destination)
    return jsonify({"message": f"Stored {stored} new places for {destination}."})
