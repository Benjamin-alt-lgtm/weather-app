// DOM elements
const input = document.getElementById('input');
const btn = document.getElementById('btn');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.querySelector('.temperature');
const cityName = document.querySelector('.city');
const humidity = document.querySelector('.humidity-value');
const windSpeed = document.querySelector('.windspeed-value');
const errorMessage = document.getElementById('error-message');

const apiKey = 'a40ba12a728a45423ccbb447cd9b50c9'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const weatherIcons = {
    clear: 'img/Temperature-removebg-preview.png', // For Clear
    clouds: 'img/Cloud-removebg-preview.png',     // For Clouds
    rain: 'img/Rain-removebg-preview.png',       // For Rain
    drizzle: 'img/Rain-removebg-preview.png',    // For Drizzle
    snow: 'img/snow-removebg-preview.png',       // For Snow
    thunderstorm: 'img/thunderstorm-removebg-preview.png', // For Thunderstorm
    mist: 'img/mist-removebg-preview.png',       // For Mist, Fog, Haze, Smoke, etc.
};

// Show loading state
function showLoading() {
    temperature.textContent = '--°C';
    cityName.textContent = '--';
    humidity.textContent = '--%';
    windSpeed.textContent = '-- km/h';
    weatherIcon.src = weatherIcons.clear;
    errorMessage.classList.add('hidden');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Fetch weather data
async function fetchWeather(city) {
    try {
        showLoading();
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found or invalid request');
        }
        const weatherData = await response.json();
        updateWeatherUI(weatherData, city);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Could not fetch weather data. Please check the city name.');
    }
}

// Update UI with weather data
function updateWeatherUI(weatherData, cityNameValue) {
    if (!weatherData) return;

    // Update city name
    cityName.textContent = cityNameValue;

    // Update temperature
    const tempC = Math.round(weatherData.main.temp);
    temperature.textContent = `${tempC}°C`;

    // Update humidity
    humidity.textContent = `${weatherData.main.humidity}%`;

    // Update wind speed
    const windSpeedKmh = Math.round(weatherData.wind.speed * 3.6);
    windSpeed.textContent = `${windSpeedKmh} km/h`;

    // Update weather icon based on condition
    const condition = weatherData.weather[0].main.toLowerCase();
    console.log('Weather condition:', condition);
    console.log('Weather description:', weatherData.weather[0].description);
    let iconKey;

    if (condition === 'clear' || condition === 'haze' || condition === 'dust' || tempC > 25) {
        iconKey = 'clear';
    } else if (condition === 'clouds') {
        iconKey = 'clouds';
    } else if (condition === 'rain' || condition === 'drizzle') {
        iconKey = condition;
    } else if (condition === 'snow') {
        iconKey = 'snow';
    } else if (condition === 'thunderstorm') {
        iconKey = 'thunderstorm';
    } else if (['mist', 'fog', 'smoke'].includes(condition)) {
        iconKey = 'mist';
    } else {
        iconKey = 'clear'; // Fallback
    }

    console.log('Selected iconKey:', iconKey);
    console.log('Icon path:', weatherIcons[iconKey]);
    weatherIcon.src = weatherIcons[iconKey] || 'img/Temperature-removebg-preview.png';
    weatherIcon.alt = weatherData.weather[0].description;
}

// Event listener for button click
btn.addEventListener('click', () => {
    const city = input.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

// Event listener for Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = input.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError('Please enter a city name');
        }
    }
});

// Initial fetch for default city
fetchWeather('Jos');