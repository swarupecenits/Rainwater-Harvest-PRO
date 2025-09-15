import React, { useState, useEffect } from 'react';
import { fetchWeatherApi } from 'openmeteo';
import { useNavigate } from 'react-router-dom';
import { DropletIcon, CloudRainIcon, FileTextIcon, BookOpenIcon, MapIcon, BarChart2Icon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useTranslation } from "react-i18next";

const Dashboard: React.FC = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [city, setCity] = useState('');
   const [userName, setUserName] = useState<string>('');

  // Rainfall chart data state
  const [rainfallChartData, setRainfallChartData] = useState<{ time: Date[]; precipitation: number[]; rain: number[]; showers: number[] } | null>(null);

    // Fetch user info from backend
useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // ⬅️ get token from localStorage
      if (!token) return; // user not logged in

      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // ⬅️ attach token
          }
        });
        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setUserName(data.fullName || 'User');
      } catch (err) {
        console.error('Error fetching user:', err);
        setUserName('User');
      }
    };

    fetchUser();
  }, []); // empty dependency → runs once on mount

  // Fetch rainfall chart data for user's location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const params = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        hourly: [
          "precipitation",
          "rain",
          "showers"
        ]
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];
      const utcOffsetSeconds = response.utcOffsetSeconds();
      const hourly = response.hourly();
      const time = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      );
      setRainfallChartData({
        time,
        precipitation: hourly.variables(0)?.valuesArray() ?? [],
        rain: hourly.variables(1)?.valuesArray() ?? [],
        showers: hourly.variables(2)?.valuesArray() ?? []
      });
    });
  }, []);
  const fetchWeatherByCity = async (e: React.FormEvent) => {
    e.preventDefault();
    setWeatherLoading(true);
    setWeatherError(null);
    setWeather(null);
    try {
      // Get lat/lon from city name
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error('City not found');
      const lat = geoData[0].lat;
      const lon = geoData[0].lon;
      // Fetch detailed weather from Open-Meteo
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,cloud_cover_high,cloud_cover_low,cloud_cover,cloud_cover_mid,wind_speed_180m,wind_direction_120m,wind_direction_180m,wind_direction_10m,wind_speed_80m,wind_speed_120m,temperature_120m,temperature_180m,soil_moisture_9_to_27cm,soil_moisture_1_to_3cm,soil_moisture_0_to_1cm,soil_temperature_54cm,soil_temperature_18cm,soil_temperature_6cm,soil_temperature_0cm,soil_moisture_3_to_9cm,temperature_80m,wind_gusts_10m,wind_direction_80m,wind_speed_10m,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,snowfall,snow_depth,precipitation_probability,pressure_msl,surface_pressure`);
      const weatherData = await weatherRes.json();
      setWeather({
        city: geoData[0].display_name,
        lat,
        lon,
        hourly: weatherData.hourly,
        time: weatherData.hourly?.time?.[0] || '',
      });
    } catch (err: any) {
      setWeatherError(err.message || 'Error fetching weather');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Search by user location
  const fetchWeatherByLocation = () => {
    setWeatherLoading(true);
    setWeatherError(null);
    setWeather(null);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const lat = coords.latitude;
        const lon = coords.longitude;
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,showers,cloud_cover_high,cloud_cover_low,cloud_cover,cloud_cover_mid,wind_speed_180m,wind_direction_120m,wind_direction_180m,wind_direction_10m,wind_speed_80m,wind_speed_120m,temperature_120m,temperature_180m,soil_moisture_9_to_27cm,soil_moisture_1_to_3cm,soil_moisture_0_to_1cm,soil_temperature_54cm,soil_temperature_18cm,soil_temperature_6cm,soil_temperature_0cm,soil_moisture_3_to_9cm,temperature_80m,wind_gusts_10m,wind_direction_80m,wind_speed_10m,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,snowfall,snow_depth,precipitation_probability,pressure_msl,surface_pressure`);
        const weatherData = await weatherRes.json();
        setWeather({
          city: `Lat: ${lat}, Lon: ${lon}`,
          lat,
          lon,
          hourly: weatherData.hourly,
          time: weatherData.hourly?.time?.[0] || '',
        });
      } catch (err: any) {
        setWeatherError(err.message || 'Error fetching weather');
      } finally {
        setWeatherLoading(false);
      }
    }, (err) => {
      setWeatherLoading(false);
      setWeatherError('Location access denied');
    });
  };
  const quickActions = [
    {
      title: t("quickActions.startAssessment"),
      icon: <DropletIcon className="h-8 w-8 text-blue-600" />,
      description: t("quickActions.startAssessmentDesc"),
      action: () => navigate('/assessment'),
      color: 'bg-blue-50'
    },
    {
      title:t("quickActions.myReports"),
      icon: <FileTextIcon className="h-8 w-8 text-green-600" />,
      description:t("quickActions.myReportsDesc"),
      action: () => navigate('/reports'),
      color: 'bg-green-50'
    },
    {
      title: t("quickActions.localRainfall"),
      icon: <CloudRainIcon className="h-8 w-8 text-cyan-600" />,
      description:t("quickActions.localRainfallDesc"),
      action: () =>navigate('/map'),
      color: 'bg-cyan-50'
    },
    {
      title: t("quickActions.knowledgeHub"),
      icon: <BookOpenIcon className="h-8 w-8 text-purple-600" />,
      description:t("quickActions.knowledgeHubDesc"),
      action: () => navigate('/knowledge'),
      color: 'bg-purple-50'
    }
  ];
  return <MainLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">
       {t("welcome")} {userName} !
      </h1>
      <p className="text-gray-600">
        {t("subtitle")}
      </p>
    </div>
    {/* Weather Search Section */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{t("currentWeather")}</h2>
      <Card className="p-4 sm:p-6">
        <form onSubmit={fetchWeatherByCity} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="border rounded px-3 py-2 flex-1 min-w-0"
          />
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{t("search")}</Button>
            <Button type="button" variant="outline" onClick={fetchWeatherByLocation} className="w-full sm:w-auto">{t("useLocation")}</Button>
          </div>
        </form>
        {weatherLoading && <div className="text-blue-600">{t("loadingWeather")}</div>}
        {weatherError && <div className="text-red-600">{weatherError}</div>}
        {weather && weather.hourly && (
          <div className="mt-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold">{weather.city}</h3>
              <div className="text-gray-600">Lat: {weather.lat}, Lon: {weather.lon}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Temperature (2 m) */}
              <div><div className="text-sm text-gray-500">Temperature (2 m)</div><div className="text-xl font-bold">{weather.hourly.temperature_2m?.[0]}°C</div></div>
              {/* Relative Humidity (2 m) */}
              <div><div className="text-sm text-gray-500">Relative Humidity (2 m)</div><div className="text-xl font-bold">{weather.hourly.relative_humidity_2m?.[0]}%</div></div>
              {/* Dewpoint (2 m) */}
              <div><div className="text-sm text-gray-500">Dewpoint (2 m)</div><div className="text-xl font-bold">{weather.hourly.dew_point_2m?.[0]}°C</div></div>
              {/* Apparent Temperature */}
              <div><div className="text-sm text-gray-500">Apparent Temperature</div><div className="text-xl font-bold">{weather.hourly.apparent_temperature?.[0]}°C</div></div>
              {/* Precipitation Probability */}
              <div><div className="text-sm text-gray-500">Precipitation Probability</div><div className="text-xl font-bold">{weather.hourly.precipitation_probability?.[0]}%</div></div>
              {/* Precipitation (rain + showers + snow) */}
              <div><div className="text-sm text-gray-500">Precipitation</div><div className="text-xl font-bold">{weather.hourly.precipitation?.[0]} mm</div></div>
              {/* Rain */}
              <div><div className="text-sm text-gray-500">Rain</div><div className="text-xl font-bold">{weather.hourly.rain?.[0]} mm</div></div>
              {/* Showers */}
              <div><div className="text-sm text-gray-500">Showers</div><div className="text-xl font-bold">{weather.hourly.showers?.[0]} mm</div></div>
              {/* Snowfall */}
              <div><div className="text-sm text-gray-500">Snowfall</div><div className="text-xl font-bold">{weather.hourly.snowfall?.[0]} mm</div></div>
              {/* Snow Depth */}
              <div><div className="text-sm text-gray-500">Snow Depth</div><div className="text-xl font-bold">{weather.hourly.snow_depth?.[0]} mm</div></div>
              {/* Weather code */}
              <div><div className="text-sm text-gray-500">Weather Code</div><div className="text-xl font-bold">{weather.hourly.weather_code?.[0]}</div></div>
              {/* Sealevel Pressure */}
              <div><div className="text-sm text-gray-500">Sealevel Pressure</div><div className="text-xl font-bold">{weather.hourly.pressure_msl?.[0]} hPa</div></div>
              {/* Surface Pressure */}
              <div><div className="text-sm text-gray-500">Surface Pressure</div><div className="text-xl font-bold">{weather.hourly.surface_pressure?.[0]} hPa</div></div>
              {/* Cloud cover Total */}
              <div><div className="text-sm text-gray-500">Cloud Cover Total</div><div className="text-xl font-bold">{weather.hourly.cloud_cover?.[0]}%</div></div>
              {/* Cloud cover Low */}
              <div><div className="text-sm text-gray-500">Cloud Cover Low</div><div className="text-xl font-bold">{weather.hourly.cloud_cover_low?.[0]}%</div></div>
              {/* Cloud cover Mid */}
              <div><div className="text-sm text-gray-500">Cloud Cover Mid</div><div className="text-xl font-bold">{weather.hourly.cloud_cover_mid?.[0]}%</div></div>
              {/* Cloud cover High */}
              <div><div className="text-sm text-gray-500">Cloud Cover High</div><div className="text-xl font-bold">{weather.hourly.cloud_cover_high?.[0]}%</div></div>
              {/* Visibility */}
              <div><div className="text-sm text-gray-500">Visibility</div><div className="text-xl font-bold">{weather.hourly.visibility?.[0]} m</div></div>
              {/* Evapotranspiration */}
              <div><div className="text-sm text-gray-500">Evapotranspiration</div><div className="text-xl font-bold">{weather.hourly.evapotranspiration?.[0]} mm</div></div>
              {/* Reference Evapotranspiration (ET₀) */}
              <div><div className="text-sm text-gray-500">Reference ET₀</div><div className="text-xl font-bold">{weather.hourly.et0_fao_evapotranspiration?.[0]} mm</div></div>
              {/* Vapour Pressure Deficit */}
              <div><div className="text-sm text-gray-500">Vapour Pressure Deficit</div><div className="text-xl font-bold">{weather.hourly.vapour_pressure_deficit?.[0]} hPa</div></div>
              {/* Wind Speed (10 m) */}
              <div><div className="text-sm text-gray-500">Wind Speed (10 m)</div><div className="text-xl font-bold">{weather.hourly.wind_speed_10m?.[0]} m/s</div></div>
              {/* Wind Speed (80 m) */}
              <div><div className="text-sm text-gray-500">Wind Speed (80 m)</div><div className="text-xl font-bold">{weather.hourly.wind_speed_80m?.[0]} m/s</div></div>
              {/* Wind Speed (120 m) */}
              <div><div className="text-sm text-gray-500">Wind Speed (120 m)</div><div className="text-xl font-bold">{weather.hourly.wind_speed_120m?.[0]} m/s</div></div>
              {/* Wind Speed (180 m) */}
              <div><div className="text-sm text-gray-500">Wind Speed (180 m)</div><div className="text-xl font-bold">{weather.hourly.wind_speed_180m?.[0]} m/s</div></div>
              {/* Wind Direction (10 m) */}
              <div><div className="text-sm text-gray-500">Wind Direction (10 m)</div><div className="text-xl font-bold">{weather.hourly.wind_direction_10m?.[0]}°</div></div>
              {/* Wind Direction (80 m) */}
              <div><div className="text-sm text-gray-500">Wind Direction (80 m)</div><div className="text-xl font-bold">{weather.hourly.wind_direction_80m?.[0]}°</div></div>
              {/* Wind Direction (120 m) */}
              <div><div className="text-sm text-gray-500">Wind Direction (120 m)</div><div className="text-xl font-bold">{weather.hourly.wind_direction_120m?.[0]}°</div></div>
              {/* Wind Direction (180 m) */}
              <div><div className="text-sm text-gray-500">Wind Direction (180 m)</div><div className="text-xl font-bold">{weather.hourly.wind_direction_180m?.[0]}°</div></div>
              {/* Wind Gusts (10 m) */}
              <div><div className="text-sm text-gray-500">Wind Gusts (10 m)</div><div className="text-xl font-bold">{weather.hourly.wind_gusts_10m?.[0]} m/s</div></div>
              {/* Temperature (80 m) */}
              <div><div className="text-sm text-gray-500">Temperature (80 m)</div><div className="text-xl font-bold">{weather.hourly.temperature_80m?.[0]}°C</div></div>
              {/* Temperature (120 m) */}
              <div><div className="text-sm text-gray-500">Temperature (120 m)</div><div className="text-xl font-bold">{weather.hourly.temperature_120m?.[0]}°C</div></div>
              {/* Temperature (180 m) */}
              <div><div className="text-sm text-gray-500">Temperature (180 m)</div><div className="text-xl font-bold">{weather.hourly.temperature_180m?.[0]}°C</div></div>
              {/* Soil Temperature (0 cm) */}
              <div><div className="text-sm text-gray-500">Soil Temperature (0 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_temperature_0cm?.[0]}°C</div></div>
              {/* Soil Temperature (6 cm) */}
              <div><div className="text-sm text-gray-500">Soil Temperature (6 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_temperature_6cm?.[0]}°C</div></div>
              {/* Soil Temperature (18 cm) */}
              <div><div className="text-sm text-gray-500">Soil Temperature (18 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_temperature_18cm?.[0]}°C</div></div>
              {/* Soil Temperature (54 cm) */}
              <div><div className="text-sm text-gray-500">Soil Temperature (54 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_temperature_54cm?.[0]}°C</div></div>
              {/* Soil Moisture (0-1 cm) */}
              <div><div className="text-sm text-gray-500">Soil Moisture (0-1 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_moisture_0_to_1cm?.[0]}</div></div>
              {/* Soil Moisture (1-3 cm) */}
              <div><div className="text-sm text-gray-500">Soil Moisture (1-3 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_moisture_1_to_3cm?.[0]}</div></div>
              {/* Soil Moisture (3-9 cm) */}
              <div><div className="text-sm text-gray-500">Soil Moisture (3-9 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_moisture_3_to_9cm?.[0]}</div></div>
              {/* Soil Moisture (9-27 cm) */}
              <div><div className="text-sm text-gray-500">Soil Moisture (9-27 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_moisture_9_to_27cm?.[0]}</div></div>
              {/* Soil Moisture (27-81 cm) */}
              <div><div className="text-sm text-gray-500">Soil Moisture (27-81 cm)</div><div className="text-xl font-bold">{weather.hourly.soil_moisture_27_to_81cm?.[0]}</div></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Time: {weather.time}</div>
          </div>
        )}
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {quickActions.map((action, index) => <Card key={index} className="flex items-start p-6 hover:shadow-md transition-all cursor-pointer" onClick={action.action}>
        <div className={`p-4 rounded-lg mr-4 ${action.color}`}>
          {action.icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
          <p className="text-gray-600">{action.description}</p>
        </div>
      </Card>)}
    </div>
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{t("mapPreview")}</h2>
      <Card className="overflow-hidden">
        <div className="bg-gray-100 h-64 relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
          }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <Button variant="primary" onClick={() => navigate('/map')} icon={<MapIcon size={16} />}>
              {t("exploreGIS")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("rainfallPatterns")}</h2>
        <Card className="h-64 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t("rainfallChartTitle")}</h3>
            <span className="text-sm text-gray-500">{t("today")}</span>
          </div>
          <div className="relative h-48">
            {rainfallChartData ? (
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-40">
                {rainfallChartData.time.slice(0, 12).map((t, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-6 bg-blue-400 rounded-t-sm mb-1" style={{ height: `${Math.round(rainfallChartData.precipitation[i] * 10)}px` }}></div>
                    <div className="w-6 bg-cyan-400 rounded-t-sm mb-1" style={{ height: `${Math.round(rainfallChartData.rain[i] * 10)}px` }}></div>
                    <div className="w-6 bg-purple-400 rounded-t-sm" style={{ height: `${Math.round(rainfallChartData.showers[i] * 10)}px` }}></div>
                    <span className="text-xs mt-1 text-gray-600">{t.getHours()}:00</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">{t("chartLegend")}</div>
        </Card>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">{t("potentialSavings")}</h2>
        <Card className="h-64 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium">{t("estimatedSavings")}</h3>
            <BarChart2Icon className="text-green-600" />
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-full mb-3">
              <DropletIcon className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">14,500</h3>
            <p className="text-gray-600">{t("litersPerYear")}</p>
            <div className="mt-4 text-sm text-gray-600">
              {t("completeAssessment")}
            </div>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>;
};
export default Dashboard;