import os
import random
import time
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from openai import OpenAI

# Load API keys from .env
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "https://yarynkaaaa.github.io",  # production site (origin has no path)
    "http://localhost:5173",         # local development
])

MAX_TOPIC_LENGTH = 80

# One shared OpenAI client: no repeated setup, short timeout, no retries
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client = (
    OpenAI(api_key=OPENAI_API_KEY, timeout=20.0, max_retries=0)
    if OPENAI_API_KEY
    else None
)

# Topic categories: aliases, fallback quotes and the Unsplash search query
CATEGORIES = {
    "success": {
        "aliases": ["success", "succeed", "achievement"],
        "image_query": "success achievement mountain summit",
        "quotes": [
            "Great things begin with one small step taken today.",
            "Don't fear moving slowly. Fear standing still.",
            "Your persistence today is your success tomorrow.",
            "Success isn't a finish line. It's the decision to keep going.",
        ],
    },
    "education": {
        "aliases": ["education", "learning", "learn", "study"],
        "image_query": "studying books library",
        "quotes": [
            "Every new day is a chance to be wiser than yesterday.",
            "Knowledge opens doors you never knew existed.",
            "Don't fear mistakes: each one brings you closer to mastery.",
            "Curiosity is the quiet engine of every great mind.",
        ],
    },
    "friendship": {
        "aliases": ["friendship", "friend"],
        "image_query": "friends together sunset",
        "quotes": [
            "True friendship makes happy moments brighter and hard ones lighter.",
            "A friend is someone beside whom you can simply be yourself.",
            "The greatest treasures can't be bought. They're the honest people beside you.",
            "Good friends are the family you choose for yourself.",
        ],
    },
    "love": {
        "aliases": ["love", "romance", "romantic"],
        "image_query": "love romantic nature",
        "quotes": [
            "Love begins where the heart finds peace.",
            "Real feelings live not in words, but in actions.",
            "To love is to see beauty in the most ordinary moments.",
            "Love grows quietly, in the small things you do every day.",
        ],
    },
    "dreams": {
        "aliases": ["dream", "dreams", "ambition"],
        "image_query": "dreams inspiration sky clouds",
        "quotes": [
            "Don't give up on a dream just because the road is hard.",
            "Dreams become reality the moment you start to act.",
            "Allow yourself to dream big and move forward boldly.",
            "A dream with a plan is the beginning of a future.",
        ],
    },
    "life": {
        "aliases": ["life", "living"],
        "image_query": "beautiful life nature forest",
        "quotes": [
            "Life doesn't ask you to be perfect. It asks you to be real.",
            "Even after the darkest night, the dawn comes.",
            "Treasure the small moments. They add up to great happiness.",
            "Every day is a blank page. Write something you're proud of.",
        ],
    },
}

# Unsplash search query for each backdrop style shown on the site
# (the keys must match the ids in the frontend file src/data/backdrops.js)
STYLE_QUERIES = {
    "nature": "foggy forest",
    "mountains": "mountains blue hour",
    "sunset": "sunset lake",
    "abstract": "abstract purple light",
    "minimalist": "minimalist interior warm light",
    "autumn-street": "moody autumn street",
}

PHOTO_CACHE = {}  # style -> (timestamp, photos)
PHOTO_CACHE_TTL = 3600  # seconds; keeps us well under Unsplash rate limits


def find_category(topic):
    """Return the matching category for a topic, or None."""
    normalized = topic.lower().strip()
    for category in CATEGORIES.values():
        if any(alias in normalized for alias in category["aliases"]):
            return category
    return None


def local_quote(topic, previous=""):
    """Pick a quote from the local library, avoiding the previous one."""
    category = find_category(topic)
    if category:
        pool = category["quotes"]
    else:
        pool = [q for c in CATEGORIES.values() for q in c["quotes"]]

    options = [q for q in pool if q != previous] or pool
    return random.choice(options)


def clean_topic(raw, default="success"):
    topic = str(raw or "").strip()[:MAX_TOPIC_LENGTH]
    return topic or default


def format_photo(photo):
    """Reduce an Unsplash photo object to the fields the frontend needs."""
    return {
        "id": photo["id"],
        "image": photo["urls"]["regular"],
        "photographer": photo["user"]["name"],
        "photographer_url": (
            photo["user"]["links"]["html"]
            + "?utm_source=InspireMe&utm_medium=referral"
        ),
        "unsplash_url": (
            photo["links"]["html"]
            + "?utm_source=InspireMe&utm_medium=referral"
        ),
    }


def search_unsplash(query, per_page):
    """Search Unsplash and return formatted photos. Raises on failure."""
    access_key = os.getenv("UNSPLASH_ACCESS_KEY")
    if not access_key:
        raise RuntimeError("UNSPLASH_ACCESS_KEY is missing")

    response = requests.get(
        "https://api.unsplash.com/search/photos",
        headers={"Authorization": f"Client-ID {access_key}"},
        params={
            "query": query,
            "per_page": per_page,
            "orientation": "landscape",
            "content_filter": "high",
        },
        timeout=15,
    )
    response.raise_for_status()
    return [format_photo(p) for p in response.json().get("results", [])]


def fetch_style_photos(style):
    """Return a cached list of photos for a backdrop style."""
    cached = PHOTO_CACHE.get(style)
    if cached and time.time() - cached[0] < PHOTO_CACHE_TTL:
        return cached[1]

    photos = search_unsplash(STYLE_QUERIES[style], per_page=30)
    PHOTO_CACHE[style] = (time.time(), photos)
    return photos


@app.route("/")
def home():
    return "InspireMe backend is running!"


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


# Generate a motivational quote
@app.route("/api/generate", methods=["POST"])
def generate_quote():
    started = time.perf_counter()
    data = request.get_json(silent=True) or {}
    topic = clean_topic(data.get("topic"))
    previous = str(data.get("previous", "")).strip()[:300]

    try:
        if openai_client is None:
            raise ValueError("OPENAI_API_KEY is missing")

        prompt = f"Write a motivational quote about: {topic}"
        if previous:
            prompt += f'\nIt must be clearly different from this one: "{previous}"'

        response = openai_client.responses.create(
            model="gpt-4.1-mini",
            instructions=(
                "You are the quote generator for InspireMe. "
                "Write one short, original and beautiful motivational quote "
                "in English only, one or two sentences, under 25 words. "
                "Reply with the quote only, without quotation marks."
            ),
            input=prompt,
            max_output_tokens=60,
        )

        quote = response.output_text.strip().strip('"').strip()
        if not quote:
            raise ValueError("Empty response from OpenAI")

        app.logger.info("Quote generated by AI in %.2fs", time.perf_counter() - started)
        return jsonify({"topic": topic, "quote": quote, "source": "AI"})

    except Exception as exc:
        app.logger.exception("OpenAI request failed, using local quote")
        return jsonify({
            "topic": topic,
            "quote": local_quote(topic, previous),
            "source": "local",
            "error": type(exc).__name__,  # temporary, for debugging; remove later
        })


# Search photos on Unsplash by topic
@app.route("/api/images", methods=["GET"])
def search_images():
    topic = clean_topic(request.args.get("topic"))

    category = find_category(topic)
    query = category["image_query"] if category else topic

    try:
        results = search_unsplash(query, per_page=6)
    except RuntimeError:
        return jsonify({"error": "Unsplash API key is missing"}), 500
    except requests.RequestException:
        app.logger.exception("Unsplash request failed")
        return jsonify({"error": "Could not fetch photos from Unsplash"}), 502

    return jsonify({"topic": topic, "images": results, "total": len(results)})


# One random photo for a backdrop style (used by the postcard editor)
@app.route("/api/backdrop", methods=["GET"])
def random_backdrop():
    style = request.args.get("style", "")
    exclude = request.args.get("exclude", "")

    if style not in STYLE_QUERIES:
        return jsonify({"error": "Unknown style"}), 400

    try:
        photos = fetch_style_photos(style)
    except Exception:
        app.logger.exception("Could not load photos for style %s", style)
        return jsonify({"error": "Could not load photos"}), 502

    # Avoid showing the same photo twice in a row
    options = [p for p in photos if p["id"] != exclude] or photos
    if not options:
        return jsonify({"error": "No photos found"}), 404

    return jsonify(random.choice(options))


# Proxy for Unsplash images (so exporting to PNG isn't blocked by CORS)
@app.route("/api/image-proxy", methods=["GET"])
def image_proxy():
    url = request.args.get("url", "")
    parsed = urlparse(url)

    if parsed.scheme != "https" or parsed.hostname != "images.unsplash.com":
        return jsonify({"error": "Only images.unsplash.com URLs are allowed"}), 400

    try:
        upstream = requests.get(url, timeout=15)
        upstream.raise_for_status()
    except requests.RequestException:
        app.logger.exception("Image proxy failed")
        return jsonify({"error": "Could not load the image"}), 502

    return Response(
        upstream.content,
        mimetype=upstream.headers.get("Content-Type", "image/jpeg"),
        headers={"Cache-Control": "public, max-age=86400"},
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)