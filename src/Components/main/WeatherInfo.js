import React, { useEffect, useState } from "react";
import CityInfo from "./WeatherInfo/CityInfo";
import Description from "./WeatherInfo/Description";
import DetailedWeather from "./WeatherInfo/DetailedWeather";
import WeatherHour from "./WeatherInfo/WeatherHour";
import WeatherDays from "./WeatherInfo/WeatherDays";

import "../../css/weather.css";

function WeatherInfo({ refresh }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCityLoaded = (loaded) => {
    if (!loaded) {
      setHasError(true);
      setErrorMessage("Не удалось загрузить данные о городе.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    // Проверяем, есть ли выбранный город в локальном хранилище
    const selectedCityFromLocalStorage = JSON.parse(
      localStorage.getItem("selectedCities")
    );

    if (selectedCityFromLocalStorage) {
      console.log(selectedCityFromLocalStorage);
      setSelectedCity(selectedCityFromLocalStorage);
      setIsLoading(false); // Если есть выбранный город, показываем погоду сразу
    } else {
      // Если город не выбран, пробуем получить геолокацию
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Здесь вы можете использовать широту и долготу для получения данных о погоде
            console.log("Местоположение:", position.coords);
            setIsLoading(false);
          },
          (error) => {
            // Обработка ошибок геолокации
            setHasError(true);
            setErrorMessage(
              error.code === 1
                ? "Доступ к местоположению отключён. Разрешите доступ в настройках браузера."
                : "Не удалось определить местоположение. Проверьте настройки."
            );
            setIsLoading(false);
          }
        );
      } else {
        setHasError(true);
        setErrorMessage("Ваш браузер не поддерживает геолокацию.");
        setIsLoading(false);
      }
    }
  }, [refresh]);

  if (isLoading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  if (hasError) {
    return <div className="error-message">{errorMessage}</div>;
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
