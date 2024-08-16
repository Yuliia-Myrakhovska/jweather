import React, { useState, useEffect } from "react";
import { getCurrentWeather, getCoordinates } from '../../../proxy/weatherProxy';


function CityInfo({ onCityLoaded }) {
  const [currentDate, setCurrentDate] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [cityCoordinates, setCityCoordinates] = useState({});
  const [selectedCities, setSelectedCities] = useState([]);
  const [starClicked, setStarClicked] = useState(false);
  const [cityName, setCityName] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  
  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  const temperatureUnit = settings.temperatureUnit;
  const language = settings.language;

  useEffect(() => {
    const now = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    setCurrentDate(
      now
        .toLocaleDateString(`${language}-UA`, options)
        .replace(/^\w/, (c) => c.toUpperCase())
    );
  }, [language]);

  useEffect(() => {
    const cities = JSON.parse(localStorage.getItem('selectedCities')) || [];
    setSelectedCities(cities);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 

      try {
        const weatherData = getCurrentWeather();
        if (weatherData) {
          setWeatherInfo(weatherData);
        }
        
        const coordinatesData = getCoordinates();
        if (coordinatesData) {
          setCityCoordinates(coordinatesData);
        }
        
        if (cityCoordinates.latitude && cityCoordinates.longitude) {
          const isCitySelected = selectedCities.some(city =>
            city.latitude === cityCoordinates.latitude && city.longitude === cityCoordinates.longitude
          );
          setStarClicked(isCitySelected);

          const cityName = await getCityNameByCoordinates(cityCoordinates.latitude, cityCoordinates.longitude);
          
          setTimeout(() => {
            onCityLoaded(true);
          }, 1);
          setCityName(cityName);
        }
      } catch (error) {
        console.error('Error fetching city data:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [cityCoordinates, selectedCities, onCityLoaded]);

  const handleStarClick = () => {
    const cityData = {
      latitude: cityCoordinates.latitude,
      longitude: cityCoordinates.longitude
    };

    const storedCities = JSON.parse(localStorage.getItem('selectedCities')) || [];

    const cityIndex = storedCities.findIndex(city =>
      city.latitude === cityData.latitude && city.longitude === cityData.longitude
    );

    if (cityIndex === -1) {
      const updatedCities = [...storedCities, cityData];
      localStorage.setItem('selectedCities', JSON.stringify(updatedCities));
      setStarClicked(true);
    } else {
      const updatedCities = storedCities.filter((_, index) => index !== cityIndex);
      localStorage.setItem('selectedCities', JSON.stringify(updatedCities));
      setStarClicked(false);
    }
  };

  const getCityNameByCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${language}&addressdetails=1`);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      const city = data.address.city;
      const country = data.address.country;
      const village = data.address.village;
      const regionOrState = data.address.region || data.address.state || "";
      const town = data.address.town;

      let cityName = "";

      if (city) {
        cityName += `${city}, `;
      } else if (town) {
        cityName += `${town}, `;
      } else if (village) {
        cityName += `${village}, `;
      }

      if (regionOrState !== "") {
        cityName += `${regionOrState}, `;
      }

      cityName += `${country}`;
      cityName = cityName.replace(/,\s*$/, '');

      return cityName;
    } catch (error) {
      console.error('Error fetching city name by coordinates:', error);
      return null;
    }
  };

  return (
    <>
      {weatherInfo && getCurrentWeather() && getCoordinates() && (
        <div className="weather-info-city">
          <div className="icon-right" onClick={handleStarClick}>
            {starClicked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="weather-info-icon bi bi-star-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="weather-info-icon bi bi-star"
                viewBox="0 0 16 16"
              >
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
              </svg>
            )}
          </div>
          <div className="weather-icon-temp">
            <div className="weather-info-deck">
              <div className="weather-temp">{weatherInfo.temp}{temperatureUnit}</div>
            </div>
            <img
              className="weather-icon"
              src={require(`../../../img/icon/${weatherInfo.icon}.svg`)}
              alt="weather-icon"
            />
          </div>
          <div className="city-info__wrapper">
            <div className="city-info-day">
              <svg
                className="city-info-icon bi bi-calendar-event-fill"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
              </svg>
              <span>{currentDate}</span>
            </div>
            <div className="city-info-loc">
              <svg
                className="city-info-icon bi bi-geo-alt-fill"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
              </svg>
              <span>{cityName}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CityInfo;
