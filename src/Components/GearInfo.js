import React, { useState, useEffect } from "react";
import "../css/gear.css";

import { useTheme } from "../hooks/use-theme"; 

function GearInfo() {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [temperatureUnit, setTemperatureUnit] = useState("");
  const [lengthUnit, setLengthUnit] = useState("");
  const [pressureUnit, setPressureUnit] = useState("");
  const [speedUnit, setSpeedUnit] = useState("");
  const [language, setLanguage] = useState("");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");

  const { theme, handleThemeChange: toggleTheme } = useTheme(); 

  const openModal = (metric) => {
    setSelectedMetric(metric);
  };

  const openThemeModal = () => {
    setIsThemeModalOpen(true);
  };

  const closeThemeModal = () => {
    setIsThemeModalOpen(false);
  };

  useEffect(() => {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setTemperatureUnit(parsedSettings.temperatureUnit);
      setLengthUnit(parsedSettings.lengthUnit);
      setPressureUnit(parsedSettings.pressureUnit);
      setSpeedUnit(parsedSettings.speedUnit);
      setLanguage(parsedSettings.language || "ru");
      setSelectedTheme(parsedSettings.theme || "light");
      toggleTheme(parsedSettings.theme || "light");
    } else {
      setTemperatureUnit("°F");
      setLengthUnit("мили");
      setPressureUnit("мб");
      setSpeedUnit("миль/ч");
      setLanguage("uk");
      setSelectedTheme("light");
      toggleTheme("light");
      localStorage.setItem(
        "settings",
        JSON.stringify({
          temperatureUnit: "°F",
          lengthUnit: "мили",
          pressureUnit: "мб",
          speedUnit: "миль/ч",
          language: "ru",
          theme: "light",
        })
      );
    }
  }, []);

  const handleUnitChange = (metric, unit) => {
    switch (metric) {
      case "temperature":
        setTemperatureUnit(unit);
        break;
      case "length":
        setLengthUnit(unit);
        break;
      case "pressure":
        setPressureUnit(unit);
        break;
      case "speed":
        setSpeedUnit(unit);
        break;
      default:
        break;
    }

    localStorage.setItem(
      "settings",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")),
        [`${metric}Unit`]: unit,
        theme: selectedTheme,
      })
    );
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme); 
    localStorage.setItem(
      "settings",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("settings")),
        theme: theme,
      })
    );
    toggleTheme(theme);
  };

  const getUnitLabel = (metric) => {
    switch (metric) {
      case "temperature":
        return temperatureUnit;
      case "length":
        return lengthUnit;
      case "pressure":
        return pressureUnit;
      case "speed":
        return speedUnit;
      default:
        return "";
    }
  };

  return (
    <>
      <h1 class="settings-name-heading">Настройки</h1>
      <hr class="line" />

      <div className="theme-settings">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-mask"
          viewBox="0 0 16 16"
        >
          <path d="M6.225 1.227A7.5 7.5 0 0 1 10.5 8a7.5 7.5 0 0 1-4.275 6.773 7 7 0 1 0 0-13.546zM4.187.966a8 8 0 1 1 7.627 14.069A8 8 0 0 1 4.186.964z" />
        </svg>
        <h2 className="settings-name-subtitle">Изменить тему</h2>
      </div>
      <div class="settings-themeChange">
        <div class="themeChange-wrapper" onClick={openThemeModal}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-cursor-fill"
            viewBox="0 0 16 16"
          >
            <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
          </svg>
          <div class="theme-title">Выберите тему</div>
        </div>
        <span class="theme-item">
          {selectedTheme === "light"
            ? "Светлая"
            : "Темная"}
        </span>
      </div>
      {isThemeModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeThemeModal}>
              &times;
            </span>
            <h3 class="modal-title">Выберите тему:</h3>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="light"
                name="theme"
                value="light"
                checked={selectedTheme === "light"}
                onChange={() => handleThemeChange("light")}
              />
              <label htmlFor="light">Светлая</label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="dark"
                checked={selectedTheme === "dark"}
                onChange={() => handleThemeChange("dark")}
              />
              <label htmlFor="dark">Темная</label>
            </div>
          </div>
        </div>
      )}

      <div className="metric-settings">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-cloudy-fill"
          viewBox="0 0 16 16"
        >
          <path d="M13.405 7.027a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 13H13a3 3 0 0 0 .405-5.973z" />
        </svg>
        <h2 className="settings-name-subtitle">Метрики</h2>
      </div>

      <ul>
        <li className="metric-item" onClick={() => openModal("temperature")}>
          <div class="metric-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cursor-fill"
              viewBox="0 0 16 16"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
            </svg>
            <div className="metric-name">Температура</div>
          </div>
          <div className="metric-unit">{getUnitLabel("temperature")}</div>
        </li>
        <li className="metric-item" onClick={() => openModal("length")}>
          <div class="metric-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cursor-fill"
              viewBox="0 0 16 16"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
            </svg>
            <div className="metric-name">Длина</div>
          </div>
          <div className="metric-unit">{getUnitLabel("length")}</div>
        </li>
        <li className="metric-item" onClick={() => openModal("pressure")}>
          <div class="metric-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cursor-fill"
              viewBox="0 0 16 16"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
            </svg>
            <div className="metric-name">Давление</div>
          </div>
          <div className="metric-unit">{getUnitLabel("pressure")}</div>
        </li>
        <li className="metric-item" onClick={() => openModal("speed")}>
          <div class="metric-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-cursor-fill"
              viewBox="0 0 16 16"
            >
              <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
            </svg>
            <div className="metric-name">Скорость</div>
          </div>
          <div className="metric-unit">{getUnitLabel("speed")}</div>
        </li>
      </ul>
      {selectedMetric === "temperature" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMetric(null)}>
              &times;
            </span>
            <h3 class="modal-title">Температура</h3>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="°C"
                name="temperature"
                value="°C"
                checked={temperatureUnit === "°C"}
                onChange={() => handleUnitChange("temperature", "°C")}
              />
              <label htmlFor="°C">
                °C
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="°F"
                name="temperature"
                value="°F"
                checked={temperatureUnit === "°F"}
                onChange={() => handleUnitChange("temperature", "°F")}
              />
              <label htmlFor="°F">
                °F
              </label>
            </div>
          </div>
        </div>
      )}
      {selectedMetric === "length" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMetric(null)}>
              &times;
            </span>
            <h3 class="modal-title">Длина</h3>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Meters"
                name="length"
                value="м"
                checked={lengthUnit === "м"}
                onChange={() => handleUnitChange("length", "м")}
              />
              <label htmlFor="Meters">
                м
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Kilometers"
                name="length"
                value="км"
                checked={lengthUnit === "км"}
                onChange={() => handleUnitChange("length", "км")}
              />
              <label htmlFor="Kilometers">
               км
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Miles"
                name="length"
                value="мили"
                checked={lengthUnit === "мили"}
                onChange={() => handleUnitChange("length", "мили")}
              />
              <label htmlFor="Miles">
                мили
              </label>
            </div>
          </div>
        </div>
      )}
      {selectedMetric === "pressure" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMetric(null)}>
              &times;
            </span>
            <h3 class="modal-title">Давление</h3>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Millimeters_Mercury"
                name="pressure"
                value="мм"
                checked={pressureUnit === "мм"}
                onChange={() =>
                  handleUnitChange("pressure", "мм")
                }
              />
              <label htmlFor="Millimeters_Mercury">
                мм
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Millibars"
                name="pressure"
                value="мб"
                checked={pressureUnit === "мб"}
                onChange={() => handleUnitChange("pressure", "мб")}
              />
              <label htmlFor="Millibars">
                мб
              </label>
            </div>
          </div>
        </div>
      )}
      {selectedMetric === "speed" && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMetric(null)}>
              &times;
            </span>
            <h3 class="modal-title">Скорость</h3>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Meters_Second"
                name="speed"
                value="м/с"
                checked={speedUnit === "м/с"}
                onChange={() => handleUnitChange("speed", "м/с")}
              />
              <label htmlFor="Meters_Second">
                м/с
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Kilometers_Hour"
                name="speed"
                value="км/ч"
                checked={speedUnit === "км/ч"}
                onChange={() =>
                  handleUnitChange("speed", "км/ч")
                }
              />
              <label htmlFor="Kilometers_Hour">
                км/ч
              </label>
            </div>
            <div class="modal-item-wraper">
              <input
                type="radio"
                id="Miles_Houres"
                name="speed"
                value="миль/ч"
                checked={speedUnit === "миль/ч"}
                onChange={() => handleUnitChange("speed", "миль/ч")}
              />
              <label htmlFor="Miles_Houres">
                миль/ч
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GearInfo;
