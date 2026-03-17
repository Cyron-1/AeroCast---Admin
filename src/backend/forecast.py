import pandas as pd
import numpy as np
import joblib
import lightgbm as lgb

# Load model once

model = joblib.load("model/aqi_model.pkl")

def generate_forecast(start_date, end_date, known_aqi=None, seed=42):
    """
    Generates AQI forecast for the given date range.
    
    Parameters:
        start_date (str): Start date in 'YYYY-MM-DD' format
        end_date (str): End date in 'YYYY-MM-DD' format
        known_aqi (dict): Optional dict of known AQI {date_str: value} to anchor predictions
        seed (int): Random seed for PM10 simulation (default: 42)
        
    Returns:
        List[dict]: Forecast with 'date' and 'predicted_aqi'
    """
    # Load and sort historical data
    history = pd.read_csv("data/air_quality_cleaned_all_2019_2025.csv")
    history['date'] = pd.to_datetime(history['date'])
    history = history.sort_values('date').reset_index(drop=True)

    # Create future dates
    future_dates = pd.date_range(start=start_date, end=end_date)
    forecast_df = pd.DataFrame({"date": future_dates})

    # PM10 simulation
    pm10_mean = history['pm10'].mean()
    pm10_std = history['pm10'].std()
    np.random.seed(seed)
    forecast_df["pm10"] = np.random.normal(pm10_mean, pm10_std, len(forecast_df))

    # Initialize lags from historical data
    lag3 = history['aqi'].iloc[-3]
    lag2 = history['aqi'].iloc[-2]
    lag1 = history['aqi'].iloc[-1]

    predictions = []

    # Forecast recursively
    for i, row in forecast_df.iterrows():
        date_str = row['date'].strftime("%Y-%m-%d")

        # Use known AQI if available
        if known_aqi and date_str in known_aqi:
            pred = known_aqi[date_str]
        else:
            features_row = pd.DataFrame({
                'pm10':[row['pm10']],
                'lag1':[lag1],
                'lag2':[lag2],
                'lag3':[lag3],
                'aqi_roll_mean3':[np.mean([lag1, lag2, lag3])],
                'aqi_roll_std_3':[np.std([lag1, lag2, lag3], ddof=0)],
                'aqi_change':[lag1 - lag2],
                'month':[row['date'].month],
                'day_of_week':[row['date'].dayofweek],
                'is_weekday':[1 if row['date'].dayofweek < 5 else 0]
            })

            # Ensure column order matches model training
            features_order = [
                'pm10','lag1','lag2','lag3',
                'aqi_roll_mean3','aqi_roll_std_3',
                'aqi_change','month','day_of_week','is_weekday'
            ]
            features_row = pd.DataFrame({col: features_row[col] for col in features_order})

            # Predict AQI
            pred = model.predict(features_row)[0]

        predictions.append(float(pred))

        # Shift lags for next day
        lag3, lag2, lag1 = lag2, lag1, pred

    forecast_df['predicted_aqi'] = predictions
    return forecast_df.to_dict(orient="records")