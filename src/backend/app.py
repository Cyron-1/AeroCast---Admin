from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import joblib
from forecast import generate_forecast  # Your forecast logic

app = Flask(__name__)
CORS(app)

# Load model and historical data
model = joblib.load("./model/aqi_model.pkl")
history = pd.read_csv("./data/air_quality_cleaned_all_2019_2025.csv")

print("Model and dataset loaded")


# Get precomputed forecast (optional)
@app.route("/api/forecast", methods=["GET"])
def get_forecast():
    forecast_df = pd.read_csv("./data/aqi_forecast_jan1_7_2026.csv")
    data = forecast_df.to_dict(orient="records")
    return jsonify(data)


# Generate forecast dynamically
@app.route("/api/run-forecast", methods=["POST"])
def run_forecast():
    params = request.json

    start_date = params["start_date"]
    end_date = params["end_date"]
    known_aqi = params["known_aqi"]

    # Call generate_forecast with only the arguments it accepts
    forecast = generate_forecast(start_date, end_date, known_aqi)

    return jsonify(forecast)


# Historical data endpoint
@app.route("/api/historical", methods=["GET"])
def historical_data():
    return jsonify(history.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True)