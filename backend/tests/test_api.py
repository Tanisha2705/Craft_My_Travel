import os
import sys
import tempfile

import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(tempfile.gettempdir(), "test_travel.db")

from app import create_app  # noqa: E402
from extensions import db  # noqa: E402


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client
    with app.app_context():
        db.session.remove()
        db.drop_all()


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_signup_and_login(client):
    signup = client.post("/api/signup", json={
        "username": "traveller1",
        "email": "traveller1@example.com",
        "password": "secret123",
        "name": "Traveller One",
    })
    assert signup.status_code == 201

    login = client.post("/api/login", json={
        "email": "traveller1@example.com",
        "password": "secret123",
    })
    assert login.status_code == 200
    assert "token" in login.get_json()


def test_login_rejects_bad_password(client):
    client.post("/api/signup", json={
        "username": "traveller2",
        "email": "traveller2@example.com",
        "password": "secret123",
    })
    login = client.post("/api/login", json={
        "email": "traveller2@example.com",
        "password": "wrong",
    })
    assert login.status_code == 401


def test_curated_itinerary(client):
    res = client.get("/api/itinerary/goa/5")
    assert res.status_code == 200
    body = res.get_json()
    assert body["source"] == "curated"
    assert len(body["schedule"]) == 5


def test_generated_fallback_itinerary(client):
    res = client.get("/api/itinerary/atlantis/3")
    assert res.status_code == 200
    body = res.get_json()
    assert body["source"] == "generated"
    assert len(body["schedule"]) == 3


def test_admin_users_requires_auth(client):
    res = client.get("/api/admin/users")
    assert res.status_code == 401


def test_admin_login_and_list_users(client):
    login = client.post("/api/login", json={
        "email": "admin@craftmytravel.com",
        "password": "admin123",
    })
    assert login.status_code == 200
    token = login.get_json()["token"]

    res = client.get("/api/admin/users", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert "users" in res.get_json()
