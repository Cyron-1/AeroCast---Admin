A. Dashboard / Home Page

Purpose: Provide a high-level overview of AQI forecasts and key metrics.

Sections & Components:

Header / Navigation

Logo / project name (e.g., “AQI Research Dashboard”)

Navigation links: Dashboard | Forecast Config | Historical Data | Model Metrics

Key Metric Cards

Latest Forecast Date: Shows the most recent forecast date.

Forecasted AQI Summary: Min, Max, Avg AQI for the forecast period.

Model Accuracy: RMSE & MAE of latest predictions.

Alerts Count: Number of days forecasted to exceed AQI threshold.

Component Layout: Horizontal cards at top of page, 3–4 per row.

Forecast Line Chart

X-axis: Date

Y-axis: AQI

Lines:

Predicted AQI (marker: circle)

Actual AQI (if known, marker: cross)

Interactive features:

Hover to show exact AQI value

Toggle lines on/off

Forecast Table

Columns: Date | Predicted AQI | Known AQI (if available) | PM10 (simulated or actual) | Notes/Alerts

Features:

Sort by date or AQI value

Highlight rows exceeding AQI threshold

Pagination if needed

Footer / Quick Actions

Buttons:

Export Forecast CSV

Go to Forecast Config

B. Forecast Configuration Page

Purpose: Allow the researcher to define parameters for the AQI forecast.

Sections & Components:

Forecast Date Range

Two date pickers: Start Date, End Date

Validation: Start < End, max 14 days (or configurable)

Known AQI Inputs

Interactive table or form:

Columns: Date | AQI Value

Default pre-filled if known AQI exists

Ability to add/remove rows

PM10 Simulation Configuration

Input fields:

Mean PM10 (default = historical mean)

Std deviation PM10 (default = historical std)

Option: Use real PM10 if available (toggle switch)

Model Hyperparameters (optional)

Sliders or numeric inputs for:

n_estimators

learning_rate

max_depth

num_leaves

Default values = current model settings

Run Forecast Button

On click:

Sends parameters to backend via API (/forecast)

Shows loading spinner while forecast is generated

Once completed, redirects to Dashboard or displays results below

Forecast Preview (Optional)

Shows table preview of upcoming forecast

Allows researcher to adjust parameters before finalizing

C. Historical Data Explorer Page

Purpose: Enable researchers to analyze past AQI and PM10 data.

Sections & Components:

Date Range Filter

Two date pickers (Start & End)

Default = last 3 months

Feature Filters

Select which features to plot: AQI, PM10, AQI rolling mean, AQI rolling std

Optionally filter by day of week or month

Line Charts

Multiple charts stacked or tabbed:

AQI Over Time: Line chart, shows trend

PM10 Over Time: Optional second chart

AQI Rolling Mean / Std: Optional chart to show trend vs variability

Interactive: Zoom, pan, hover tooltips

Data Table

Columns: Date | AQI | PM10 | AQI_lag1 | AQI_lag2 | AQI_roll_mean3 | AQI_roll_std_3 | Day of Week | Month

Features:

Sortable, filterable

Highlight AQI exceeding threshold

Option to export CSV

Alert Overlay / Highlight

Days exceeding AQI threshold are highlighted in charts and tables

D. Model Monitoring / Metrics Page

Purpose: Evaluate the trained model’s performance and understand feature importance.

Sections & Components:

Model Performance Cards

RMSE, MAE, R² (if applicable)

Last trained date / dataset used

Visual indicator: green if accuracy is acceptable, red if error high

Actual vs Predicted Chart

X-axis: Date

Y-axis: AQI

Two lines: Actual AQI vs Predicted AQI

Hover to see residual (Actual - Predicted)

Residual Scatter Plot

X-axis: Predicted AQI

Y-axis: Residual

Helps visualize if model is biased at high/low AQI

Feature Importance

Bar chart showing importance scores from LightGBM

Helps researchers understand which factors influence AQI most (e.g., lag1, lag2, PM10)

Export Metrics

Button to download metrics report (CSV or PDF)

Page Flow

Dashboard/Home → overview & quick insights

Forecast Config → define forecast parameters → run forecast → returns to Dashboard

Historical Data Explorer → explore past data, trends, and patterns

Model Monitoring → analyze model accuracy and feature importance

Additional Notes

Keep charts interactive (hover tooltips, zoom)

Use color coding for AQI severity levels (green = good, yellow = moderate, red = unhealthy)

Ensure responsive layout for tables and charts