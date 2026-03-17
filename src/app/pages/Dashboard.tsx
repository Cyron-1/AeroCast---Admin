import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Download, Settings, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MetricCard } from '../components/MetricCard';
import { generateForecastData, getAQIColor, getAQICategory } from '../utils/mockData';

interface ForecastItem {
  date: string;
  predicted_aqi: number;
  actual_aqi?: number;
  pm10?: number;
}

export function Dashboard() {
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [showPredicted, setShowPredicted] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [loading, setLoading] = useState(true);

  // Calculate key metrics
  const latestForecastDate = forecastData[forecastData.length - 1]?.date || 'N/A';
  const predictedValues = forecastData.map(d => d.predicted_aqi || 0);
  const minAQI = Math.min(...predictedValues);
  const maxAQI = Math.max(...predictedValues);
  const avgAQI = Math.round(predictedValues.reduce((sum, d) => sum + d, 0) / predictedValues.length);

  useEffect(() => {
    fetch("http://localhost:5000/api/forecast")
      .then(res => res.json())
      .then(data => {
        setForecastData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch forecast data:", err);
        setLoading(false);
      });
  }, []);

  // Export function
  const exportCSV = () => {
    const headers = ['Date', 'Predicted AQI', 'Actual AQI', 'PM10'];
    const rows = forecastData.map(d => [
      d.date,
      d.predicted_aqi,
      d.actual_aqi || 'N/A',
      d.pm10 || 'N/A',
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forecast_data.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor AQI forecasts and key performance metrics</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <Link
            to="/forecast-config"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Settings className="w-4 h-4" />
            Configure Forecast
          </Link>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Latest Forecast</p>
              </div>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-1">
                {new Date(latestForecastDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">14-day forecast period</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200">AQI Range</p>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">{avgAQI}</p>
                <span className="text-sm text-purple-700 dark:text-purple-300">avg</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-purple-700 dark:text-purple-300">
                <span className="flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4" />
                  {minAQI}
                </span>
                <span className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />
                  {maxAQI}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-900 dark:text-green-200">Model Performance</p>
              </div>
              <p className="text-2xl font-semibold text-green-900 dark:text-green-100 mb-1">RMSE 8.3</p>
              <p className="text-sm text-green-700 dark:text-green-300">MAE: 6.2 | R²: 0.89</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AQI Forecast Trend</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Predicted vs actual air quality index over time</p>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={showPredicted}
                onChange={(e) => setShowPredicted(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                Predicted AQI
              </span>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="checkbox"
                checked={showActual}
                onChange={(e) => setShowActual(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
              />
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-600"></span>
                Actual AQI
              </span>
            </label>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              label={{ value: 'AQI', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 500 } }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value: number, name: string) => [value, name === 'predicted_aqi' ? 'Predicted' : 'Actual']}
            />
            <Legend />
            {showPredicted && (
              <Line
                type="monotone"
                dataKey="predicted_aqi"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                name="Predicted AQI"
              />
            )}
            {showActual && (
              <Line
                type="monotone"
                dataKey="actual_aqi"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7 }}
                name="Actual AQI"
                connectNulls={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Forecast Details</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete forecast data for the next 14 days</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Predicted AQI
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actual AQI
                </th>
                <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  PM10
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {forecastData.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(row.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm">
                    <span
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{
                        backgroundColor: `${getAQIColor(row.predicted_aqi)}15`,
                        color: getAQIColor(row.predicted_aqi),
                        border: `2px solid ${getAQIColor(row.predicted_aqi)}30`,
                      }}
                    >
                      {row.predicted_aqi} - {getAQICategory(row.predicted_aqi)}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {row.actual_aqi ? (
                      <span
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold"
                        style={{
                          backgroundColor: `${getAQIColor(row.actual_aqi)}15`,
                          color: getAQIColor(row.actual_aqi),
                          border: `2px solid ${getAQIColor(row.actual_aqi)}30`,
                        }}
                      >
                        {row.actual_aqi}
                      </span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {row.pm10 ? (
                      <span className="text-gray-900 dark:text-gray-100">{row.pm10} µg/m³</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}