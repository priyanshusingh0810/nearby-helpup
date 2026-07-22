export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
  time: string;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  // Using Open-Meteo free API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data = await response.json();
  return data.current_weather;
};

// Map WMO weather codes to string descriptions and lucide icon names
// Reference: https://open-meteo.com/en/docs
export const getWeatherInfo = (code: number, isDay: number = 1) => {
  const codes: Record<number, { text: string, icon: string }> = {
    0: { text: 'Clear sky', icon: isDay ? 'Sun' : 'Moon' },
    1: { text: 'Mainly clear', icon: isDay ? 'Sun' : 'Moon' },
    2: { text: 'Partly cloudy', icon: 'CloudSun' },
    3: { text: 'Overcast', icon: 'Cloud' },
    45: { text: 'Fog', icon: 'CloudFog' },
    48: { text: 'Depositing rime fog', icon: 'CloudFog' },
    51: { text: 'Light drizzle', icon: 'CloudDrizzle' },
    53: { text: 'Moderate drizzle', icon: 'CloudDrizzle' },
    55: { text: 'Dense drizzle', icon: 'CloudDrizzle' },
    56: { text: 'Light freezing drizzle', icon: 'CloudSnow' },
    57: { text: 'Dense freezing drizzle', icon: 'CloudSnow' },
    61: { text: 'Slight rain', icon: 'CloudRain' },
    63: { text: 'Moderate rain', icon: 'CloudRain' },
    65: { text: 'Heavy rain', icon: 'CloudRain' },
    66: { text: 'Light freezing rain', icon: 'CloudSnow' },
    67: { text: 'Heavy freezing rain', icon: 'CloudSnow' },
    71: { text: 'Slight snow fall', icon: 'CloudSnow' },
    73: { text: 'Moderate snow fall', icon: 'CloudSnow' },
    75: { text: 'Heavy snow fall', icon: 'CloudSnow' },
    77: { text: 'Snow grains', icon: 'CloudSnow' },
    80: { text: 'Slight rain showers', icon: 'CloudRain' },
    81: { text: 'Moderate rain showers', icon: 'CloudRain' },
    82: { text: 'Violent rain showers', icon: 'CloudLightning' },
    85: { text: 'Slight snow showers', icon: 'CloudSnow' },
    86: { text: 'Heavy snow showers', icon: 'CloudSnow' },
    95: { text: 'Thunderstorm', icon: 'CloudLightning' },
    96: { text: 'Thunderstorm with slight hail', icon: 'CloudLightning' },
    99: { text: 'Thunderstorm with heavy hail', icon: 'CloudLightning' },
  };

  return codes[code] || { text: 'Unknown', icon: 'Cloud' };
};
