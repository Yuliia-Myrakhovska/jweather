let currentWeather = null;
let next7DaysForecast = null;
let weatherEvery2Hours = null;
let coordinates = null;

export const setCurrentWeather = (data) => {
  currentWeather = data;
};

export const setNext7DaysForecast = (data) => {
  next7DaysForecast = data;
};

export const getCurrentWeather = () => {
  return currentWeather;
};

export const getNext7DaysForecast = () => {
  return next7DaysForecast;
};

export const setweatherEvery2Hours = (data) => {
  weatherEvery2Hours = data;
};

export const getweatherEvery2Hours = () => {
  return weatherEvery2Hours;
};

export const setCoordinates = (data) => {
  coordinates = data;
};

export const getCoordinates = () => {
  return coordinates;
};