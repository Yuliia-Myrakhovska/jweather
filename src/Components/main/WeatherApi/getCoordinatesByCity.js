import { getWeatherInfo } from './getWeatherInfo';
import { setCurrentWeather, setNext7DaysForecast, setweatherEvery2Hours, setCoordinates } from '../../../proxy/weatherProxy';

const getCoordinatesByCity = async (latitude = null, longitude = null) => {
  try {

    if (!latitude || !longitude) {
      const position = await getCurrentPosition();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }

    localStorage.setItem('cityCoordinates', JSON.stringify({ latitude, longitude }));

    const { currentWeather, next7DaysForecast, weatherEvery2Hours } = await getWeatherInfo();
    setCurrentWeather(currentWeather);
    setNext7DaysForecast(next7DaysForecast);
    setweatherEvery2Hours(weatherEvery2Hours);

    const coordinates = { latitude, longitude };
    setCoordinates(coordinates);

    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

export default getCoordinatesByCity;