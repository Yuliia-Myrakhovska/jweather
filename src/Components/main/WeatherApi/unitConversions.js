
export const round = (number) => {
  return Math.round(number);
};

export const convertTemperature = (value, toUnit) => {
  if (toUnit === "°C") {
    return round((value - 32) * 5/9); 
  } else {
    return round(value); 
  }
};

export const convertLength = (value, toUnit) => {
  if (toUnit === "км") {
    return round(value * 1.60934); 
  } else if (toUnit === "м") {
    return round(value * 1609.34); 
  } else {
    return round(value); 
  }
};

export const convertPressure = (value, toUnit) => {
  if (toUnit === "мм") {
    return round(value * 0.750062); 
  } else {
    return round(value); 
  }
};

export const convertSpeed = (value, toUnit) => {
  if (toUnit === "км/ч") {
    return round(value * 1.60934); 
  } else if (toUnit === "м/с") {
    return round(value * 0.44704); 
  } else {
    return round(value); 
  }
};