import { useState, useEffect } from 'react';
import { MOCK_DATA } from '../services/dashboard.service';

export const useWidgets = (refreshInterval: number = 5, isLive: boolean = true) => {
  const [timeseriesData, setTimeseriesData] = useState(MOCK_DATA.timeseries);
  const [segmentData] = useState(MOCK_DATA.segments);
  const [heatmapData, setHeatmapData] = useState(MOCK_DATA.heatmap);
  const [scatterplotData, setScatterplotData] = useState(MOCK_DATA.scatterplot);
  const [kpiRevenue, setKpiRevenue] = useState(110300);
  const [kpiMargin, setKpiMargin] = useState(15.6);
  const [kpiLoad, setKpiLoad] = useState(72);
  const [isWebSocketActive, setIsWebSocketActive] = useState(false);

  useEffect(() => {
    if (!isLive) return;

    // Simulate active high-speed live stream feeds
    setIsWebSocketActive(true);

    const interval = setInterval(() => {
      // Simulate real-time metric volatility with minor positive bias
      setKpiRevenue((prev) => {
        const diff = (Math.random() - 0.4) * 850;
        return Math.round(prev + diff);
      });

      setKpiMargin((prev) => {
        const diff = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.max(5, Math.min(45, prev + diff)).toFixed(2));
      });

      setKpiLoad((prev) => {
        const diff = Math.round((Math.random() - 0.5) * 6);
        return Math.max(10, Math.min(100, prev + diff));
      });

      // Volatile first line of timeseries data to look lively
      setTimeseriesData((prev) => {
        return prev.map((item, idx) => {
          if (idx === prev.length - 1) {
            const shift = (Math.random() - 0.4) * 1500;
            return {
              ...item,
              revenue: Math.round(item.revenue + shift)
            };
          }
          return item;
        });
      });

      // Scatterplot random data points shifts (representing live bid ads fluctuations)
      setScatterplotData((prev) => {
        return prev.map((item) => {
          const shiftSpend = Math.round((Math.random() - 0.5) * 50);
          const shiftClicks = Math.round((Math.random() - 0.5) * 12);
          return {
            ...item,
            spend: Math.max(500, item.spend + shiftSpend),
            clicks: Math.max(50, item.clicks + shiftClicks)
          };
        });
      });

      // Heatmap dynamic load shifts
      setHeatmapData((prev) => {
        return prev.map((item) => {
          const shiftLoad = Math.round((Math.random() - 0.5) * 8);
          return {
            ...item,
            load: Math.max(5, Math.min(100, item.load + shiftLoad))
          };
        });
      });
    }, refreshInterval * 1000);

    return () => {
      clearInterval(interval);
      setIsWebSocketActive(false);
    };
  }, [refreshInterval, isLive]);

  return {
    timeseriesData,
    segmentData,
    heatmapData,
    scatterplotData,
    kpiRevenue: `$${kpiRevenue.toLocaleString()}`,
    kpiMargin: `${kpiMargin}%`,
    kpiLoad: `${kpiLoad}%`,
    isWebSocketActive
  };
};
export default useWidgets;
