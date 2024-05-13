import React from "react";
import { getCurrentWeather } from '../../../proxy/weatherProxy';

function Description() {
  const weatherInfo = getCurrentWeather();

  return (
    <>
      {getCurrentWeather() && (
        <div class="weather__description">
          <div class="precipitation__description">{weatherInfo.conditions}</div>
          <div class="weather__description-info">{weatherInfo.description}</div>
        </div>
      )}
    </>
  );
}

export default Description;