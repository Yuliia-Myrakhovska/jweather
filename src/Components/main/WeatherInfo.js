import React, { useEffect, useState } from 'react';
import CityInfo from "./WeatherInfo/CityInfo";
import Description from "./WeatherInfo/Description";
import DetailedWeather from "./WeatherInfo/DetailedWeather";
import WeatherHour from "./WeatherInfo/WeatherHour";
import WeatherDays from "./WeatherInfo/WeatherDays";

import '../../css/weather.css';

function WeatherInfo({ refresh }) {
  const [isLoading, setIsLoading] = useState(true); 

  const handleCityLoaded = (loaded) => {
    setIsLoading(!loaded); 
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [refresh]);
  
  return (
    <>
      {isLoading ? ( 
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div> 
      ) : ( 
        <>
          <div className="weather-info__wrapper">
            <div>
            <CityInfo onCityLoaded={handleCityLoaded} />
              {/* <CityInfo /> */}
              <Description  />
            </div>
            <DetailedWeather />
          </div>
          <WeatherHour />
          <WeatherDays />
        </>
       )} 
    </>
  );
}

export default WeatherInfo;
