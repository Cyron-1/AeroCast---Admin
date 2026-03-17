// Mock data for AQI Dashboard

export interface ForecastData {
  date: string;
  predictedAQI: number;
  actualAQI?: number;
  pm10?: number;
  alert?: string;
}

export interface HistoricalData {
  date: string;
  aqi: number;
  pm10: number;
  aqiLag1: number;
  aqiLag2: number;
  aqiRollMean3: number;
  aqiRollStd3: number;
  dayOfWeek: string;
  month: string;
}

export interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
  lastTrained: string;
}

// Generate forecast data for next 14 days
export function generateForecastData(): ForecastData[] {
  const data: ForecastData[] = [];
  const startDate = new Date(2025, 11, 28); // March 16, 2026
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic AQI values (between 20-180)
    const baseAQI = 60 + Math.sin(i / 3) * 30;
    const noise = Math.random() * 20 - 10;
    const predictedAQI = Math.round(Math.max(20, Math.min(180, baseAQI + noise)));
    
    // Some days have actual AQI (past forecasts)
    const actualAQI = i < 5 ? Math.round(predictedAQI + (Math.random() * 10 - 5)) : undefined;
    
    // PM10 simulation
    const pm10 = Math.round(predictedAQI * 0.6 + Math.random() * 10);
    
    // Alert if AQI exceeds threshold
    const alert = predictedAQI > 100 ? 'Unhealthy for sensitive groups' : undefined;
    
    data.push({
      date: date.toISOString().split('T')[0],
      predictedAQI,
      actualAQI,
      pm10,
      alert,
    });
  }
  
  return data;
}

// Generate historical data for past 90 days
export function generateHistoricalData(): HistoricalData[] {
  const data: HistoricalData[] = [];
  const endDate = new Date(2025, 12, 1); // March 15, 2026
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    
    // Generate realistic AQI trend
    const trend = 70 + Math.sin(i / 10) * 25;
    const noise = Math.random() * 15 - 7.5;
    const aqi = Math.round(Math.max(15, Math.min(170, trend + noise)));
    
    const pm10 = Math.round(aqi * 0.6 + Math.random() * 8);
    const aqiLag1 = i < 89 ? data[data.length - 1]?.aqi || aqi : aqi;
    const aqiLag2 = i < 88 ? data[data.length - 2]?.aqi || aqi : aqi;
    
    // Calculate rolling mean and std (simplified)
    let aqiRollMean3 = aqi;
    let aqiRollStd3 = 5;
    
    if (data.length >= 2) {
      const recent = [data[data.length - 1].aqi, data[data.length - 2].aqi, aqi];
      aqiRollMean3 = Math.round(recent.reduce((a, b) => a + b) / 3);
      const variance = recent.reduce((sum, val) => sum + Math.pow(val - aqiRollMean3, 2), 0) / 3;
      aqiRollStd3 = Math.round(Math.sqrt(variance) * 10) / 10;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      aqi,
      pm10,
      aqiLag1,
      aqiLag2,
      aqiRollMean3,
      aqiRollStd3,
      dayOfWeek: daysOfWeek[date.getDay()],
      month: months[date.getMonth()],
    });
  }
  
  return data;
}

// Generate model performance data
export function generateModelPerformanceData() {
  const forecastData = generateForecastData();
  const performanceData = forecastData.filter(d => d.actualAQI !== undefined).map(d => ({
    date: d.date,
    actual: d.actualAQI!,
    predicted: d.predictedAQI,
    residual: d.actualAQI! - d.predictedAQI,
  }));
  
  return performanceData;
}

// Model metrics
export const modelMetrics: ModelMetrics = {
  rmse: 8.3,
  mae: 6.2,
  r2: 0.89,
  lastTrained: '2025-12-31',
};

// Feature importance data
export const featureImportance = [
  { feature: 'AQI_lag1', importance: 0.35 },
  { feature: 'PM10', importance: 0.28 },
  { feature: 'AQI_lag2', importance: 0.18 },
  { feature: 'AQI_roll_mean3', importance: 0.12 },
  { feature: 'Day of Week', importance: 0.04 },
  { feature: 'AQI_roll_std3', importance: 0.03 },
];

// Get AQI color based on value
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10b981'; // Green - Good
  if (aqi <= 100) return '#fbbf24'; // Yellow - Moderate
  if (aqi <= 150) return '#f97316'; // Orange - Unhealthy for sensitive
  if (aqi <= 200) return '#ef4444'; // Red - Unhealthy
  return '#991b1b'; // Dark red - Very unhealthy
}

// Get AQI category
export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy';
}
