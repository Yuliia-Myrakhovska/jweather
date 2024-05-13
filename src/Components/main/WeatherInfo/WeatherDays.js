import React, { useState, useEffect, useRef } from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.css";
import { getNext7DaysForecast } from '../../../proxy/weatherProxy';


function WeatherDays() {
  const allNext7DaysForecast = getNext7DaysForecast();
  const [next7DaysForecast, setNext7DaysForecast] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(null);
  const [selectedButton, setSelectedButton] = useState(7); 

  const swiperRef = useRef(null);

  useEffect(() => {
    if (allNext7DaysForecast) {
      setNext7DaysForecast(allNext7DaysForecast.slice(0, selectedButton));
    }
  }, [allNext7DaysForecast, selectedButton]);

  useEffect(() => {
    const updateSwiper = () => {
      swiperRef.current = new Swiper(".swiper-container-day", {
        slidesPerView: 3,
        // spaceBetween: 10,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        breakpoints: {
          980: { slidesPerView: 5 },
          1024: { slidesPerView: 7 },
        },
        allowTouchMove: true, 
        on: {
        reachEnd: function () {
          this.allowSlideNext = false;
        }
      }
      });

      const hourSwiper = new Swiper(".swiper-container-hour-fordays", {
        slidesPerView: 3,
        // spaceBetween: 5,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true,
        },
        breakpoints: {
          360: { slidesPerView: 2 },
          460: { slidesPerView: 3 },
          980: { slidesPerView: 5 },
          1024: { slidesPerView: 8 },
        },
      });

      return () => {
        if (swiperRef.current) {
          swiperRef.current.destroy();
        }
        if (hourSwiper) {
          hourSwiper.destroy();
        }
      };
    };

    updateSwiper();
  }, [next7DaysForecast]);

  useEffect(() => {
    const updateScrollbarVisibility = () => {
      const swiperScrollbar = document.querySelector(".swiper-scrollbar");
      if (window.innerWidth < 400 && swiperScrollbar) {
        swiperScrollbar.style.display = "block";
      } else if (swiperScrollbar) {
        swiperScrollbar.style.display = "none";
      }
    };

    updateScrollbarVisibility();
    window.addEventListener("resize", updateScrollbarVisibility);

    return () => {
      window.removeEventListener("resize", updateScrollbarVisibility);
    };
  }, []);

  useEffect(() => {
    if (next7DaysForecast && next7DaysForecast.length > 0) {
      handleSlideClick(next7DaysForecast[0], 0);
    }
  }, [next7DaysForecast]);

 const handleSlideClick = (day, index) => {
  setSelectedDate(day.dateInWords);
  setSelectedSlideIndex(index);
  if (swiperRef.current) {
    swiperRef.current.slideTo(index);
  }
};

const handleSlideForward = () => {
  if (swiperRef.current) {
    if (selectedSlideIndex === 0) {
      swiperRef.current.slideNext(); 
    } else {
      swiperRef.current.slideTo(selectedSlideIndex - 1); 
    }
  }
};


  const changeDisplayedDays = (numDays) => {
    if (allNext7DaysForecast) {
      setNext7DaysForecast(allNext7DaysForecast.slice(0, numDays));
      setSelectedDate(null);
      setSelectedSlideIndex(null); 
      setSelectedButton(numDays); 
      handleSlideClick(allNext7DaysForecast[0], 0);
    }
  };

  const settings = JSON.parse(localStorage.getItem('settings')) || {};
  const temperatureUnit = settings.temperatureUnit;
  const pressureUnit = settings.pressureUnit;
  const speedUnit = settings.speedUnit;

  return (
    <>
      
      {getNext7DaysForecast() && (
        <>
          <div className="display-buttons">
        <button className={`buttons ${selectedButton === 7 ? 'selected-buttons' : ''}`} onClick={() => changeDisplayedDays(7)}>7 дней</button>
        <button className={`buttons ${selectedButton === 10 ? 'selected-buttons' : ''}`} onClick={() => changeDisplayedDays(10)}>10 дней</button>
        <button className={`buttons ${selectedButton === 14 ? 'selected-buttons' : ''}`} onClick={() => changeDisplayedDays(14)}>14 дней</button>
      </div>
          <div className="day-weather__wrapper">
            <div className="swiper-container swiper-container-day">
              <div className="swiper-wrapper">
                {next7DaysForecast &&
                  next7DaysForecast.map((day, index) => (
                    <div
                      key={index}
                      className={`day-weather-info swiper-slide day-slide ${selectedSlideIndex === index ? 'selected' : ''}`}
                      onClick={() => handleSlideClick(day, index)}
                      style={{ borderBottom: selectedSlideIndex === index ? 'none' : '1px solid var(--decoration-color)' }}
                    >
                      <div className="day">{day.dayOfWeek}</div>
                      <div className="date">{day.dateInWords}</div>
                      <div className="image-block">
                        <img
                          className="weather-icon icon-day"
                          src={require(`../../../img/icon/${day.icon}.svg`)}
                          alt=""
                        />
                      </div>
                      <div className="temperatures">
                        <span>{day.minTemp}{temperatureUnit}</span>
                        <span>...</span>
                        <span>{day.maxTemp}{temperatureUnit}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        <div className="info-day">
            {selectedDate && (
              <>
                <div className="date-blocday">{selectedDate}</div>
                <div className="weather-day-forecast">
                  <div class="column column-metric__wrapper">
                    <div class="column-empty"></div>
                    <div class="column-metric">
                      <div class="metric-title">Температура, {temperatureUnit}</div>
                      <svg
                        class="metric-icon bi bi-thermometer-half"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415" />
                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1" />
                      </svg>
                    </div>
                    <div class="column-metric">
                      <div class="metric-title">Ощущается, {temperatureUnit}</div>
                      <svg
                        class="metric-icon bi bi-thermometer-half"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415" />
                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1" />
                      </svg>
                    </div>
                    <div class="column-metric">
                      <div class="metric-title">Давление, {pressureUnit}</div>
                      <svg
                        class="metric-icon bi bi-water"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M.036 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65m0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 12.964a.5.5 0 0 1-.278-.65" />
                      </svg>
                    </div>
                    <div class="column-metric">
                      <div class="metric-title">Влажность, %</div>
                      <svg
                        class="metric-icon bi bi-moisture"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                      </svg>
                    </div>
                    <div class="column-metric">
                      <div class="metric-title">Ветер, {speedUnit}</div>
                      <svg
                        class="metric-icon bi bi-wind"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5" />
                      </svg>
                    </div>
                    <div class="column-metric">
                      <div class="metric-title">Осадки, %</div>
                      <svg
                        class="metric-icon bi bi-droplet-fill"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13" />
                      </svg>
                    </div>
                  </div>
                  <div className="swiper-container-wrapper">
                    <div className="swiper-container swiper-container-hour-fordays">
                      <div className="swiper-wrapper">
                        {selectedSlideIndex !== null && next7DaysForecast[selectedSlideIndex].hourlyWeather.map((hourData, index) => (
                          <div
                            key={index}
                            className="swiper-slide swiper-slide-hour column"
                          >
                            <div className="time">{hourData.time}</div>
                            <div className="time-weather-img">
                              <img className="weather-icon-hour" src={require(`../../../img/icon/${hourData.icon}.svg`)} alt="" />
                            </div>
                            <div className="metric-text">{hourData.temp}</div>
                            <div className="metric-text">{hourData.feelslike}</div>
                            <div className="metric-text">{hourData.pressure}</div>
                            <div className="metric-text">{hourData.humidity}</div>
                            <div className="metric-text">{hourData.windspeed}</div>
                            <div className="metric-text">{hourData.precipprob}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
          )}
        </div>

        </>
      )}
    </>
  );
}
export default WeatherDays;