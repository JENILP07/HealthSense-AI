import requests
import json

url = "http://localhost:8000/predict"

payload = {
    "age": 60,
    "gender": 2,
    "height": 165,
    "weight": 90,
    "ap_hi": 160,
    "ap_lo": 100,
    "cholesterol": 3,
    "gluc": 3,
    "smoke": 1,
    "alco": 0,
    "active": 0
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
except Exception as e:
    print("Failed:", e)
