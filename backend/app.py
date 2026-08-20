from flask import Flask, jsonify
from flask_cors import CORS

from admin_routes import admin_bp
from auth_routes import auth_bp
from config import Config
from extensions import db
from itinerary_routes import itinerary_bp
from models import User


def seed_default_admin(app: Flask) -> None:
    """Create a default admin account on first run, if one doesn't exist yet."""
    with app.app_context():
        admin = User.query.filter_by(username=app.config["DEFAULT_ADMIN_USERNAME"]).first()
        if admin:
            return
        admin = User(
            username=app.config["DEFAULT_ADMIN_USERNAME"],
            email=app.config["DEFAULT_ADMIN_EMAIL"],
            name="Administrator",
            is_admin=True,
        )
        admin.set_password(app.config["DEFAULT_ADMIN_PASSWORD"])
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Default admin created -> {app.config['DEFAULT_ADMIN_EMAIL']} / "
              f"{app.config['DEFAULT_ADMIN_PASSWORD']} (change this password!)")


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    origins = app.config["CORS_ORIGINS"]
    origins = "*" if origins == "*" else [o.strip() for o in origins.split(",")]
    CORS(app, resources={r"/api/*": {"origins": origins}})

    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(itinerary_bp, url_prefix="/api/itinerary")

    with app.app_context():
        db.create_all()
    seed_default_admin(app)

    @app.route("/")
    def home():
        return jsonify({
            "status": "ok",
            "message": "CraftMyTravel API is running.",
            "docs": "See README.md for the full endpoint list.",
        })

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not found."}), 404

    @app.errorhandler(500)
    def server_error(_e):
        return jsonify({"error": "Internal server error."}), 500

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5050)
