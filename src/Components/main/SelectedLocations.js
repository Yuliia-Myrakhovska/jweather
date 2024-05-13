import React, { useEffect, useState } from "react";
import "../../css/location.css";
import { useNavigate } from "react-router-dom";
import getCoordinatesByCity from "./WeatherApi/getCoordinatesByCity";

function SelectedLocations({ onRefreshWeather }) {
  const navigate = useNavigate();
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  const language = settings.language;
  const [selectedCities, setSelectedCities] = useState(
    JSON.parse(localStorage.getItem("selectedCities")) || []
  );
  const [isLoading, setIsLoading] = useState(true);

  const getCityNameByCoordinates = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=${language}&addressdetails=1`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      const city = data.address.city;
      const country = data.address.country;
      const village = data.address.village;
      const regionOrState = data.address.region
        ? data.address.region
        : data.address.state;
      const town = data.address.town;

      if (city) {
        return `${city}, ${regionOrState}, ${country}`;
      } else if (town) {
        return `${town}, ${regionOrState}, ${country}`;
      } else {
        return `${village}, ${regionOrState}, ${country}`;
      }
    } catch (error) {
      console.error("Error fetching city name by coordinates:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCityNames = async () => {
      try {
        const updatedCities = await Promise.all(
          selectedCities.map(async (city) => {
            const cityName = await getCityNameByCoordinates(
              city.latitude,
              city.longitude
            );
            return {
              ...city,
              cityName: cityName,
            };
          })
        );
        setSelectedCities(updatedCities);
      } catch (error) {
        console.error("Error fetching city names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityNames();
  }, []);

  const handleRemoveCity = (index) => {
    const updatedCities = [...selectedCities];
    updatedCities.splice(index, 1);
    setSelectedCities(updatedCities);
    localStorage.setItem("selectedCities", JSON.stringify(updatedCities));
  };

  const handleItemClick = async (lat, lon) => {
    navigate("/");
    await getCoordinatesByCity(lat, lon);
    onRefreshWeather();
  };

  if (isLoading) {
    return (
      <div class="loader-wrapper">
        <div class="loader"></div>
      </div>
    );
  }

  return (
    <>
      <div className="city-name-heading">Выбранные локации</div>
      <hr className="line" />
      {selectedCities.length === 0 && (
        <div className="no-cities-message">Нет выбранных городов</div>
      )}
      {selectedCities.map((location, index) => (
        <div className="city-wrapper" key={index}>
          <div className="city-info">
            <div className="city-name-wrapper">
              <div className="city-name">{location.cityName}</div>
              <div
                className="star-icon"
                onClick={() => handleRemoveCity(index)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="icon bi bi-star-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
              </div>
            </div>
            <div
              className="link-wrapper"
              onClick={() =>
                handleItemClick(location.latitude, location.longitude)
              }
            >
              <svg
                className="link-calendar bi bi-arrow-right"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SelectedLocations;
