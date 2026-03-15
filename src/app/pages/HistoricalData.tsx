import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateHistoricalData, getAQIColor } from '../utils/mockData';

export function HistoricalData() {
  const [startDate, setStartDate] = useState('2025-12-15');
  const [endDate, setEndDate] = useState('2026-03-15');
  const [showAQI, setShowAQI] = useState(true);
  const [showPM10, setShowPM10] = useState(false);
  const [showRollMean, setShowRollMean] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'aqi' | 'pm10'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const historicalData = generateHistoricalData();

  // Filter data by date range
  const filteredData = historicalData.filter(d => {
    const date = new Date(d.date);
    return date >= new Date(startDate) && date <= new Date(endDate);
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'aqi') {
      comparison = a.aqi - b.aqi;
    } else if (sortField === 'pm10') {
      comparison = a.pm10 - b.pm10;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const exportCSV = () => {
    const headers = ['Date', 'AQI', 'PM10', 'AQI_lag1', 'AQI_lag2', 'AQI_roll_mean3', 'AQI_roll_std3', 'Day of Week', 'Month'];
    const rows = sortedData.map(d => [
      d.date,
      d.aqi,
      d.pm10,
      d.aqiLag1,
      d.aqiLag2,
      d.aqiRollMean3,
      d.aqiRollStd3,
      d.dayOfWeek,
      d.month,
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'historical_data.csv';
    a.click();
  };

  const handleSort = (field: 'date' | 'aqi' | 'pm10') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Historical Data Explorer</h1>
        <p className="text-gray-600 dark:text-gray-400">Analyze past AQI and PM10 trends</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters & Display Options</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              checked={showAQI}
              onChange={(e) => setShowAQI(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              Show AQI
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              checked={showPM10}
              onChange={(e) => setShowPM10(e.target.checked)}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              Show PM10
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer px-3 py-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
            <input
              type="checkbox"
              checked={showRollMean}
              onChange={(e) => setShowRollMean(e.target.checked)}
              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              Show Rolling Mean
            </span>
          </label>
        </div>
      </div>

      {/* Line Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AQI & PM10 Trends</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Historical air quality data visualization</p>
        </div>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Value', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 500 } }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelFormatter={(value) => `Date: ${value}`}
            />
            <Legend />
            {showAQI && (
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name="AQI"
              />
            )}
            {showPM10 && (
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="PM10"
              />
            )}
            {showRollMean && (
              <Line
                type="monotone"
                dataKey="aqiRollMean3"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="AQI Rolling Mean (3-day)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Historical Data Table</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed records with computed features</p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th 
                  onClick={() => handleSort('date')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('aqi')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  AQI {sortField === 'aqi' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  onClick={() => handleSort('pm10')}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  PM10 {sortField === 'pm10' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  AQI Lag 1
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  AQI Lag 2
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Roll Mean 3
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Roll Std 3
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Day
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {sortedData.slice(0, 50).map((row, idx) => (
                <tr
                  key={idx}
                  className={row.aqi > 100 ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(row.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold"
                      style={{
                        backgroundColor: `${getAQIColor(row.aqi)}15`,
                        color: getAQIColor(row.aqi),
                        border: `2px solid ${getAQIColor(row.aqi)}30`,
                      }}
                    >
                      {row.aqi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.pm10}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{row.aqiLag1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{row.aqiLag2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{row.aqiRollMean3}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{row.aqiRollStd3}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{row.dayOfWeek}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length > 50 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400">
            Showing first 50 of {sortedData.length} records
          </div>
        )}
      </div>
    </div>
  );
}