import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Play, Plus, Trash2, Loader2 } from 'lucide-react';

interface KnownAQIRow {
  date: string;
  aqi: number;
}

export function ForecastConfig() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('2026-03-16');
  const [endDate, setEndDate] = useState('2026-03-29');
  const [knownAQI, setKnownAQI] = useState<KnownAQIRow[]>([
    { date: '2026-03-16', aqi: 65 },
    { date: '2026-03-17', aqi: 72 },
  ]);
  const [pmMean, setPmMean] = useState(45.2);
  const [pmStd, setPmStd] = useState(12.5);
  const [useRealPM10, setUseRealPM10] = useState(false);
  const [nEstimators, setNEstimators] = useState(100);
  const [learningRate, setLearningRate] = useState(0.1);
  const [maxDepth, setMaxDepth] = useState(7);
  const [numLeaves, setNumLeaves] = useState(31);
  const [loading, setLoading] = useState(false);

  const addKnownAQI = () => {
    setKnownAQI([...knownAQI, { date: '', aqi: 0 }]);
  };

  const removeKnownAQI = (index: number) => {
    setKnownAQI(knownAQI.filter((_, i) => i !== index));
  };

  const updateKnownAQI = (index: number, field: 'date' | 'aqi', value: string | number) => {
    const updated = [...knownAQI];
    updated[index] = { ...updated[index], [field]: value };
    setKnownAQI(updated);
  };

  const runForecast = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    navigate('/');
  };

  // Validation
  const isValid = () => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) return false;
    const daysDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff > 14) return false;
    return true;
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Forecast Configuration</h1>
        <p className="text-gray-600 dark:text-gray-400">Define parameters to generate AQI forecasts</p>
      </div>

      {/* Forecast Date Range */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Forecast Date Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Maximum 14 days forecast period
        </p>
      </div>

      {/* Known AQI Inputs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Known AQI Values</h2>
          <button
            onClick={addKnownAQI}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>
        <div className="space-y-3">
          {knownAQI.map((row, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="date"
                  value={row.date}
                  onChange={(e) => updateKnownAQI(idx, 'date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={row.aqi}
                  onChange={(e) => updateKnownAQI(idx, 'aqi', Number(e.target.value))}
                  placeholder="AQI Value"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                onClick={() => removeKnownAQI(idx)}
                className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PM10 Simulation Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">PM10 Simulation Configuration</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mean PM10
              </label>
              <input
                type="number"
                value={pmMean}
                onChange={(e) => setPmMean(Number(e.target.value))}
                step="0.1"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Standard Deviation PM10
              </label>
              <input
                type="number"
                value={pmStd}
                onChange={(e) => setPmStd(Number(e.target.value))}
                step="0.1"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <input
              type="checkbox"
              id="useRealPM10"
              checked={useRealPM10}
              onChange={(e) => setUseRealPM10(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="useRealPM10" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Use real PM10 data if available
            </label>
          </div>
        </div>
      </div>

      {/* Model Hyperparameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Model Hyperparameters (Optional)</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              n_estimators: <span className="text-blue-600 dark:text-blue-400 font-semibold">{nEstimators}</span>
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={nEstimators}
              onChange={(e) => setNEstimators(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>50</span>
              <span>200</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              learning_rate: <span className="text-blue-600 dark:text-blue-400 font-semibold">{learningRate}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.3"
              step="0.01"
              value={learningRate}
              onChange={(e) => setLearningRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0.01</span>
              <span>0.30</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              max_depth: <span className="text-blue-600 dark:text-blue-400 font-semibold">{maxDepth}</span>
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>3</span>
              <span>15</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              num_leaves: <span className="text-blue-600 dark:text-blue-400 font-semibold">{numLeaves}</span>
            </label>
            <input
              type="range"
              min="15"
              max="63"
              value={numLeaves}
              onChange={(e) => setNumLeaves(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>15</span>
              <span>63</span>
            </div>
          </div>
        </div>
      </div>

      {/* Run Forecast Button */}
      <div className="flex gap-4 items-center">
        <button
          onClick={runForecast}
          disabled={!isValid() || loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Forecast...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Forecast
            </>
          )}
        </button>
        {!isValid() && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            Please ensure start date is before end date and period is max 14 days
          </p>
        )}
      </div>
    </div>
  );
}