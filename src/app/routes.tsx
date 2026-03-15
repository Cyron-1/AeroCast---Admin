import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { ForecastConfig } from "./pages/ForecastConfig";
import { HistoricalData } from "./pages/HistoricalData";
import { ModelMetrics } from "./pages/ModelMetrics";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "forecast-config", Component: ForecastConfig },
      { path: "historical-data", Component: HistoricalData },
      { path: "model-metrics", Component: ModelMetrics },
    ],
  },
]);
