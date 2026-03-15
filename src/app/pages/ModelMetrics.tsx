import { CheckCircle, AlertCircle, Download } from 'lucide-react';
import { BarChart, Bar, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { MetricCard } from '../components/MetricCard';
import { modelMetrics, featureImportance, generateModelPerformanceData } from '../utils/mockData';

export function ModelMetrics() {
  const performanceData = generateModelPerformanceData();

  // Calculate if accuracy is acceptable
  const isAccuracyGood = modelMetrics.rmse < 10 && modelMetrics.mae < 8;

  const exportReport = () => {
    const report = `
Model Performance Report
Generated: ${new Date().toLocaleDateString()}

Metrics:
- RMSE: ${modelMetrics.rmse}
- MAE: ${modelMetrics.mae}
- R²: ${modelMetrics.r2}
- Last Trained: ${modelMetrics.lastTrained}

Feature Importance:
${featureImportance.map(f => `- ${f.feature}: ${(f.importance * 100).toFixed(1)}%`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'model_metrics_report.txt';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Model Monitoring & Metrics</h1>
        <p className="text-gray-600 dark:text-gray-400">Evaluate model performance and feature importance</p>
      </div>

      {/* Model Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl p-6 shadow-lg ${isAccuracyGood ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border border-green-200 dark:border-green-700/50' : 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border border-red-200 dark:border-red-700/50'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RMSE</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{modelMetrics.rmse}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Root Mean Square Error</p>
            </div>
            <div className={`p-3 rounded-lg ${isAccuracyGood ? 'bg-green-200 dark:bg-green-700/50' : 'bg-red-200 dark:bg-red-700/50'}`}>
              {isAccuracyGood ? (
                <CheckCircle className={`w-6 h-6 ${isAccuracyGood ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`} />
              ) : (
                <AlertCircle className={`w-6 h-6 ${isAccuracyGood ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`} />
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700/50 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MAE</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{modelMetrics.mae}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mean Absolute Error</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl border border-purple-200 dark:border-purple-700/50 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">R² Score</p>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{modelMetrics.r2}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Coefficient of Determination</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl border border-amber-200 dark:border-amber-700/50 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Trained</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {new Date(modelMetrics.lastTrained).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Model training date</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div className={`rounded-xl p-5 ${isAccuracyGood ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-2 border-green-300 dark:border-green-700' : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-300 dark:border-red-700'} shadow-md`}>
        <div className="flex items-center gap-3">
          {isAccuracyGood ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          )}
          <p className={`text-sm font-semibold ${isAccuracyGood ? 'text-green-900 dark:text-green-200' : 'text-red-900 dark:text-red-200'}`}>
            {isAccuracyGood 
              ? 'Model accuracy is within acceptable range'
              : 'Model accuracy may need improvement - consider retraining'
            }
          </p>
        </div>
      </div>

      {/* Actual vs Predicted Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Actual vs Predicted AQI</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Compare model predictions against actual observed values</p>
        </div>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'AQI', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 500 } }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelFormatter={(value) => `Date: ${value}`}
              formatter={(value: number, name: string) => {
                if (name === 'residual') {
                  return [`${value > 0 ? '+' : ''}${value}`, 'Residual'];
                }
                return [value, name === 'actual' ? 'Actual AQI' : 'Predicted AQI'];
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              name="Actual AQI"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              name="Predicted AQI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Residual Scatter Plot */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Residual Analysis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize prediction errors across different AQI levels</p>
        </div>
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="predicted" 
              name="Predicted AQI"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Predicted AQI', position: 'insideBottom', offset: -5, style: { fill: '#6b7280', fontWeight: 500 } }}
            />
            <YAxis 
              dataKey="residual"
              name="Residual"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Residual (Actual - Predicted)', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontWeight: 500 } }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number, name: string) => [value, name === 'predicted' ? 'Predicted AQI' : 'Residual']}
            />
            <Scatter name="Residuals" data={performanceData} fill="#6366f1">
              {performanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.residual > 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Importance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Feature Importance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">LightGBM model feature importance scores</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={featureImportance}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis 
              type="category"
              dataKey="feature"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
              labelFormatter={(label) => `Feature: ${label}`}
            />
            <Bar dataKey="importance" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">
            <strong>Key Insight:</strong> AQI_lag1 and PM10 are the most influential features, accounting for 63% of the model's predictive power.
          </p>
        </div>
      </div>

      {/* Export Button */}
      <div>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download Metrics Report
        </button>
      </div>
    </div>
  );
}