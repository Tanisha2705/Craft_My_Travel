from datetime import datetime

from flask import Blueprint, jsonify, request

from auth_utils import generate_token, token_required
from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    name = (data.get("name") or username).strip()
    phone = (data.get("phone") or "").strip()

    if not username or not email or not password:
        return jsonify({"error": "Username, email and password are required."}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long."}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "A user with that username or email already exists."}), 409

    user = User(username=username, email=email, name=name, phone=phone)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Account created successfully.", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    user.last_login = datetime.utcnow()
    db.session.commit()

    token = generate_token(user)
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@token_required
def me(current_user):
    return jsonify({"user": current_user.to_dict()})
