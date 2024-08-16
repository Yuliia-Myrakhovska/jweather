import React, { useEffect, useState } from 'react';
import CityInfo from "./WeatherInfo/CityInfo";
import Description from "./WeatherInfo/Description";
import DetailedWeather from "./WeatherInfo/DetailedWeather";
import WeatherHour from "./WeatherInfo/WeatherHour";
import WeatherDays from "./WeatherInfo/WeatherDays";

import '../../css/weather.css';

function WeatherInfo({ refresh }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleCityLoaded = (loaded) => {
    if (!loaded) {
      setHasError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="error-message">
        Нет доступных данных о погоде
      </div>
    );
  }

  return (
    <>
      <div className="weather-info__wrapper">
        <div>
          <CityInfo onCityLoaded={handleCityLoaded} />
          <Description />
        </div>
        <DetailedWeather />
      </div>
      <WeatherHour />
      <WeatherDays />
    </>
  );
}

export default WeatherInfo;