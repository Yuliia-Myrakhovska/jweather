import axios from "axios";
import {
  convertTemperature,
  convertLength,
  convertPressure,
  convertSpeed,
  round,
} from "./unitConversions";

const apiKey = "YBHEFJJ99B5QK84B3GZQYJRRY";

export const getWeatherInfo = async () => {
  try {
    const cityCoordinates = JSON.parse(localStorage.getItem("cityCoordinates"));

    if (
      cityCoordinates &&
      cityCoordinates.latitude &&
      cityCoordinates.longitude
    ) {
      const latitude = cityCoordinates.latitude;
      const longitude = cityCoordinates.longitude;
      const settings = JSON.parse(localStorage.getItem("settings")) || {};
      const language = settings.language;

      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=us&key=${apiKey}&lang=${language}`
      );

      if (response.status === 200) {
        const weatherData = response.data;
        const currentDateTime = new Date();
        const localCurrentDate = new Date(
          currentDateTime.getTime() -
            currentDateTime.getTimezoneOffset() * 60000
        );
        const currentDate = localCurrentDate.toISOString().slice(0, 10);
        console.log("Current Date (Local):", currentDate);

        const todayData = weatherData.days.find(
          (day) => day.datetime === currentDate
        );
        const currentConditions = weatherData.currentConditions;

        if (todayData && currentConditions) {
          const formatTime = (timeString) => {
            const timeParts = timeString.split(":");
            const hours = timeParts[0];
            const minutes = timeParts[1];
            return `${hours}:${minutes}`;
          };

          const settings = JSON.parse(localStorage.getItem("settings"));

          const currentWeather = {
            tempmin: convertTemperature(
              todayData.tempmin,
              settings.temperatureUnit
            ),
            tempmax: convertTemperature(
              todayData.tempmax,
              settings.temperatureUnit
            ),
            description: todayData.description,
            temp: convertTemperature(
              currentConditions.temp,
              settings.temperatureUnit
            ),
            feelslike: convertTemperature(
              currentConditions.feelslike,
              settings.temperatureUnit
            ),
            uvindex: currentConditions.uvindex,
            sunrise: formatTime(currentConditions.sunrise),
            sunset: formatTime(currentConditions.sunset),
            windspeed: convertSpeed(
              currentConditions.windspeed,
              settings.speedUnit
            ),
            pressure: convertPressure(
              currentConditions.pressure,
              settings.pressureUnit
            ),
            humidity: round(currentConditions.humidity),
            visibility: convertLength(
              currentConditions.visibility,
              settings.lengthUnit
            ),
            cloudcover: round(currentConditions.cloudcover),
            precipprob: round(currentConditions.precipprob),
            conditions: currentConditions.conditions,
            icon: currentConditions.icon,
          };

          const daysOfWeek = [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
          ];

          const next7DaysForecast = weatherData.days
            .slice(1, 15)
            .map((dayData) => ({
              dayOfWeek: daysOfWeek[new Date(dayData.datetime).getDay()],
              dateInWords: new Date(dayData.datetime).toLocaleDateString(
                `${language}-UA`,
                {
                  day: "numeric",
                  month: "long",
                }
              ),
              minTemp: convertTemperature(
                dayData.tempmin,
                settings.temperatureUnit
              ),
              maxTemp: convertTemperature(
                dayData.tempmax,
                settings.temperatureUnit
              ),
              icon: dayData.icon,
              hourlyWeather: dayData.hours
                .filter((hour, index) => index % 3 === 0)
                .map((hour) => ({
                  time: formatTime(hour.datetime),
                  temp: convertTemperature(hour.temp, settings.temperatureUnit),
                  feelslike: convertTemperature(
                    hour.feelslike,
                    settings.temperatureUnit
                  ),
                  windspeed: convertSpeed(hour.windspeed, settings.speedUnit),
                  pressure: convertPressure(
                    hour.pressure,
                    settings.pressureUnit
                  ),
                  humidity: round(hour.humidity),
                  precipprob: round(hour.precipprob),
                  icon: hour.icon,
                })),
            }));

          const weatherEvery2Hours = todayData.hours
            .filter((hour) => parseInt(hour.datetime.split(":")[0]) % 2 === 0)
            .map((hour) => {
              const timeParts = hour.datetime.split(":");
              const formattedTime = `${timeParts[0]}:${timeParts[1]}`;

              return {
                time: formattedTime,
                temp: convertTemperature(hour.temp, settings.temperatureUnit),
                feelslike: convertTemperature(
                  hour.feelslike,
                  settings.temperatureUnit
                ),
                windspeed: convertSpeed(hour.windspeed, settings.speedUnit),
                pressure: convertPressure(hour.pressure, settings.pressureUnit),
                humidity: round(hour.humidity),
                precipprob: round(hour.precipprob),
                icon: hour.icon,
              };
            });

          return { currentWeather, next7DaysForecast, weatherEvery2Hours };
        }
      }
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
