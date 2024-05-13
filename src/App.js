// JSX
import "./css/App.css";
import React, { useEffect, useState } from "react";
import Header from "./Components/Header";
import Current from "./Components/aside/Current";
import CitiLike from "./Components/aside/CitiLike";
import Gear from "./Components/aside/Gear";
import WeatherInfo from "./Components/main/WeatherInfo";
import SelectedLocations from "./Components/main/SelectedLocations";
import { useTheme } from "./hooks/use-theme"; 
import getCoordinatesByCity from "./Components/main/WeatherApi/getCoordinatesByCity";
import GearInfo from "./Components/GearInfo";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

function App() {
  const { theme, handleThemeChange } = useTheme()
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1200);
  const [currentRoute, setCurrentRoute] = useState("/");
  const [refreshWeather, setRefreshWeather] = useState(false);

  useEffect(() => {
    
    handleThemeChange(theme);
    getCoordinatesByCity()
      .then(() => {
        handleRefreshWeather();
        const interval = setInterval(
          handleRefreshWeather,
          60 * 60 * 1000
        );

        return () => {
          clearInterval(interval);
        };
      })
      .catch((error) => {
        console.error("Error getting coordinates:", error);
      });

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleRefreshWeather = () => {
    setRefreshWeather((prevState) => !prevState);
  };

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 1200);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <Router>
      <>
        <Header onRefreshWeather={handleRefreshWeather} />

        <div className="container">
          <aside className="sidebar">
            <nav>
              <Link to="/">
                <Current onRefreshWeather={handleRefreshWeather} />
              </Link>
              {!isSmallScreen && (
                <ul className="nav__list">
                  <Link to="/selectedlocations">
                    <CitiLike />
                  </Link>
                  <Link to="/settings">
                    <Gear />
                  </Link>
                </ul>
              )}
              {isSmallScreen && (
                <button className="panel-toggle" onClick={togglePanel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="icon-panel bi bi-justify"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </button>
              )}
            </nav>
          </aside>

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={<WeatherInfo />}
              />
              <Route
                exact
                path="/selectedlocations"
                element={
                  <SelectedLocations onRefreshWeather={handleRefreshWeather} />
                }
              />
              <Route
                exact
                path="/settings"
                element={<GearInfo />}
              />
            </Routes>
          </main>
        </div>

        {isPanelOpen && isSmallScreen && (
          <div
            className={`fullscreen-panel-nav ${
              isPanelOpen && isSmallScreen ? "active" : ""
            }`}
          >
            <div className="panel">
              <button className="close-button" onClick={togglePanel}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="icon-panel bi bi-text-left"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
                  />
                </svg>
              </button>
              <div className="panel-content">
                <ul className="nav__list">
                  <li>
                    <Link
                      onClick={() => {
                        togglePanel();
                        setCurrentRoute("/selectedlocations");
                      }}
                      to="/selectedlocations"
                    >
                      <CitiLike />
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        togglePanel();
                        setCurrentRoute("/settings");
                      }}
                      to="/settings"
                    >
                      <Gear />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </>
    </Router>
  );
}

export default App;
