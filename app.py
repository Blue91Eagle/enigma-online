import os

from flask import Flask, render_template, request, jsonify
from enigma_cipher import encrypt, decrypt

app = Flask(__name__,
            template_folder='templates', static_folder='static')


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/encrypt")
def api_encrypt():
    data = request.get_json(force=True)

    try:
        settings = {
            "key": data.get("key", ""),
            "rotor1": int(data.get("rotor1", 3)),
            "rotor2": int(data.get("rotor2", 7)),
            "rotor3": int(data.get("rotor3", 11)),
            "start_positions": data.get("start_positions", "AAA"),
            "plugboard": data.get("plugboard", ""),
        }

        text = data.get("text", "")
        result = encrypt(text, **settings)

        return jsonify({
            "ok": True,
            "result": result
        })

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": str(e)
        }), 400


@app.post("/api/decrypt")
def api_decrypt():
    data = request.get_json(force=True)

    try:
        settings = {
            "key": data.get("key", ""),
            "rotor1": int(data.get("rotor1", 3)),
            "rotor2": int(data.get("rotor2", 7)),
            "rotor3": int(data.get("rotor3", 11)),
            "start_positions": data.get("start_positions", "AAA"),
            "plugboard": data.get("plugboard", ""),
        }

        text = data.get("text", "")
        result = decrypt(text, **settings)

        return jsonify({
            "ok": True,
            "result": result
        })

    except Exception as e:
        return jsonify({
            "ok": False,
            "error": "Internal service error"
        }), 400


import os
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

