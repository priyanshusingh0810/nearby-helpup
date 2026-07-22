import React, { useEffect, useState } from 'react';
import { fetchWeather, getWeatherInfo } from '../../services/weather';
import type { WeatherData } from '../../services/weather';
import GlassCard from '../common/GlassCard';
import { 
  Sun, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  CloudFog,
  Wind
} from 'lucide-react';

interface WeatherWidgetProps {
  lat: number | null;
  lon: number | null;
  locationName?: string;
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lat, lon, locationName, className = '' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      if (!lat || !lon) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchWeather(lat, lon);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Could not fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [lat, lon]);

  if (!lat || !lon) {
    return null;
  }

  if (loading) {
    return (
      <GlassCard className={`p-4 flex items-center justify-center animate-pulse h-[90px] ${className}`}>
        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
      </GlassCard>
    );
  }

  if (error || !weather) {
    return (
      <GlassCard className={`p-4 flex items-center justify-center h-[90px] ${className}`}>
        <span className="text-xs text-slate-400">{error || 'Weather unavailable'}</span>
      </GlassCard>
    );
  }

  const weatherInfo = getWeatherInfo(weather.weathercode, weather.is_day);

  // Dynamically select the icon component based on the mapped string
  const renderIcon = () => {
    const props = { className: "h-10 w-10 text-indigo-500" };
    switch (weatherInfo.icon) {
      case 'Sun': return <Sun {...props} className="h-10 w-10 text-amber-500" />;
      case 'Moon': return <Moon {...props} className="h-10 w-10 text-indigo-400" />;
      case 'Cloud': return <Cloud {...props} className="h-10 w-10 text-slate-400" />;
      case 'CloudSun': return <CloudSun {...props} className="h-10 w-10 text-amber-400" />;
      case 'CloudRain': return <CloudRain {...props} className="h-10 w-10 text-blue-400" />;
      case 'CloudSnow': return <CloudSnow {...props} className="h-10 w-10 text-sky-200" />;
      case 'CloudLightning': return <CloudLightning {...props} className="h-10 w-10 text-purple-500" />;
      case 'CloudDrizzle': return <CloudDrizzle {...props} className="h-10 w-10 text-cyan-400" />;
      case 'CloudFog': return <CloudFog {...props} className="h-10 w-10 text-slate-300" />;
      default: return <Cloud {...props} className="h-10 w-10 text-slate-400" />;
    }
  };

  return (
    <GlassCard className={`p-4 flex items-center justify-between border-slate-100/50 ${className}`}>
      <div className="flex items-center gap-4">
        {renderIcon()}
        <div className="flex flex-col">
          <div className="flex items-end gap-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {Math.round(weather.temperature)}°
            </span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-0.5">
            {weatherInfo.text}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex flex-col items-end">
           <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
             {locationName ? locationName.split(',')[0] : 'Current'}
           </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
          <Wind className="h-3 w-3" />
          <span>{weather.windspeed} km/h</span>
        </div>
      </div>
    </GlassCard>
  );
};
