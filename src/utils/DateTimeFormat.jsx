export const formatDate = (dateString, locale = 'th-TH') => {
  if (!dateString) return '';

  const validDate = new Date(dateString);
  if (isNaN(validDate.getTime())) {
    throw new RangeError('Invalid time value');
  }

  const options = {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat(locale, options).format(validDate);
};

export const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}.${minutes}`;
};

export const convertTHBtoLAK = (thbAmount) => {
  const exchangeRate = 629.77;
  return thbAmount * exchangeRate;
}

export const getLocalStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage item "${key}":`, error);
    return defaultValue;
  }
};

export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
  }
};

export function formatLaosPhone(phoneNumber) {
  if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
    const formattedNumber = '+856 ' + phoneNumber.slice(1, 3) + ' ' + phoneNumber.slice(3, 6) + ' ' + phoneNumber.slice(6);
    return formattedNumber;
  } else {
    return phoneNumber;
  }
}
