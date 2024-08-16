import React from "react";
import { getCurrentWeather } from '../../../proxy/weatherProxy';

function Description() {
  const weatherInfo = getCurrentWeather();

  return (
    <>
      {getCurrentWeather() && (
        <div className="weather__description">
          <div className="precipitation__description">{weatherInfo.conditions}</div>
          <div className="weather__description-info">{weatherInfo.description}</div>
        </div>
      )}
    </>
  );
}

export default Description;