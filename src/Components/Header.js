import React, { useState, useEffect } from "react";
import "../css/header.css";
import windyWeatherIcon from "../img/icons8-ветреная-погода-48.png";
import getCoordinatesByCity from "./main/WeatherApi/getCoordinatesByCity";
import { useNavigate } from "react-router-dom";

function Header({ onRefreshWeather }) {
  const [city, setCity] = useState({ cityName: "", lat: "", lon: "" });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [similarCities, setSimilarCities] = useState([]);
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  const language = settings.language;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
    setCity({ cityName: "", lat: "", lon: "" });
    setSimilarCities([]);
  };

  const handleChange = async (event) => {
    const inputValue = event.target.value;
    setCity({ ...city, cityName: inputValue });
    if (inputValue.trim() !== "") {
      try {
        setTimeout(async () => {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${inputValue}&format=jsonv2&&limit5&accept-language=${language}&addressdetails=1&namedetails=1&dedupe=1&featureType=city`
          );
          const data = await response.json();
          if (data.length) {
            const filteredCities = data.filter(
              (city) => city.namedetails && city.namedetails[`name:${language}`]
            );
            setSimilarCities(filteredCities);
          } else {
            setSimilarCities([]);
          }
        }, 300);
      } catch (error) {
        console.error("Error fetching similar cities:", error);
      }
    } else {
      setSimilarCities([]);
    }
  };
  const getCityName = (city, lang) => {
    let cityName = "";
    if (city.namedetails && city.namedetails[`name:${lang}`]) {
      cityName = city.namedetails[`name:${lang}`];
    } else {
      cityName = city.name;
    }

    let regionOrState = city.address.region || city.address.state || "";

    let district = city.address.district ? `, ${city.address.district}` : "";

    return {
      cityName: `${cityName}, ${city.address.country}`,
      regionAndDistrict: `${regionOrState}${district}`,
    };
  };

  const handleItemClick = async (event, city) => {
    event.preventDefault();
    setCity({ cityName: "", lat: "", lon: "" });
    setIsPanelOpen(false);
    setSimilarCities([]);

    if (city.cityName.trim() !== "" && city.countryName.trim() !== "") {
      try {
        const coordinates = await getCoordinatesByCity(city.lat, city.lon);
        if (coordinates) {
          navigate("/");
          onRefreshWeather(coordinates);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__wrapper">
          <div className="header__data">
            <div className="header__logo">
              <div className="header__logo-img">
                <img
                  className="header__logo-icon"
                  src={windyWeatherIcon}
                  alt="Ветреная погода"
                />
              </div>
              <div className="header__logo-title">
                <a className="header__logo-title-text" href="#">
                  JWeather
                </a>
              </div>
            </div>
            {!isSmallScreen && (
              <div className="header__search" style={{ position: "relative" }}>
                <form className="form">
                  <label htmlFor="search">
                    <input
                      className="input"
                      type="text"
                      id="search"
                      value={city.cityName}
                      onChange={handleChange}
                      autoComplete="off"
                      placeholder="Введите название города"
                    />
                    <div
                      className="fancy-bg"
                      style={{
                        borderBottomLeftRadius:
                          similarCities.length > 0 ? "0" : "30px",
                        borderBottomRightRadius:
                          similarCities.length > 0 ? "0" : "30px",
                      }}
                    ></div>
                    <button className="search" type="submit">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr"
                        >
                          <g>
                            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                          </g>
                        </svg>
                      </svg>
                    </button>
                  </label>
                </form>
                {similarCities.length > 0 && (
                  <ul
                    className="panel-list"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 999,
                    }}
                  >
                    {similarCities.map((city) => (
                      <li
                        className="panel-list-item"
                        key={city.place_id}
                        onClick={(event) =>
                          handleItemClick(event, {
                            cityName: getCityName(city, language).cityName,
                            countryName: city.address.country,
                            lat: city.lat,
                            lon: city.lon,
                          })
                        }
                      >
                        <div className="panel-list-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="icon-panel-tel bi bi-geo-alt"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                          </svg>
                        </div>
                        <div className="panel-list-text">
                          <p className="item-title">
                            {getCityName(city, language).cityName}
                          </p>
                          <p className="item-subtitle">
                            {getCityName(city, language).regionAndDistrict}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {isSmallScreen && (
              <button className="search-button-tel" onClick={togglePanel}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="r-14j79pv r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-4wgw6l r-f727ji r-bnwqim r-1plcrui r-lrvibr"
                  >
                    <g>
                      <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                  </svg>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {isPanelOpen && isSmallScreen && (
        <div
          className={`fullscreen-panel ${
            isPanelOpen && isSmallScreen ? "active" : ""
          }`}
        >
          <div className="panel-up">
            <button className="close-button" onClick={togglePanel}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="icon-panel-tel bi bi-arrow-left-short"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                />
              </svg>
            </button>
            <form className="panel-content">
              <input
                className="input-panel"
                type="text"
                id="search"
                value={city.cityName}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Введите название города"
              />
            </form>
          </div>
          <hr className="panel-divider" />
          <ul className="panel-list">
            {similarCities.map((city) => (
              <li
                className="panel-list-item"
                key={city.place_id}
                onClick={(event) =>
                  handleItemClick(event, {
                    cityName: getCityName(city, language).cityName,
                    countryName: city.address.country,
                    lat: city.lat,
                    lon: city.lon,
                  })
                }
              >
                <div className="panel-list-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="icon-panel-tel bi bi-geo-alt"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  </svg>
                </div>
                <div className="panel-list-text">
                  <p className="item-title">
                    {getCityName(city, language).cityName}
                  </p>
                  <p className="item-subtitle">
                    {getCityName(city, language).regionAndDistrict}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Header;
