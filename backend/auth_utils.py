from datetime import datetime, timezone
from functools import wraps

import jwt
from flask import current_app, jsonify, request

from models import User


def generate_token(user: User) -> str:
    payload = {
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) + current_app.config["JWT_EXPIRES_DELTA"],
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")


def _extract_token() -> str | None:
    header = request.headers.get("Authorization", "")
    if not header:
        return None
    # Support both "Bearer <token>" and a bare "<token>" for convenience.
    parts = header.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return header


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = _extract_token()
        if not token:
            return jsonify({"error": "Authentication token is missing."}), 401
        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if current_user is None:
                return jsonify({"error": "User no longer exists."}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401
        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        if not current_user.is_admin:
            return jsonify({"error": "Admin privileges required."}), 403
        return f(current_user, *args, **kwargs)

    return decorated
