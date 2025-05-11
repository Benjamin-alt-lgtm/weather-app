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
    clear: 'img/Temperature-removebg-preview.png',
    clouds: 'img/Cloud-removebg-preview.png',
    rain: 'img/Rain-removebg-preview.png',
    snow: 'img/snow-removebg-preview.png',
    thunderstorm: 'img/thunderstorm-removebg-preview.png',
    mist: 'img/mist-removebg-preview.png',
    drizzle: 'img/Rain-removebg-preview.png', // Added drizzle
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
    let iconKey = 'clear';
    if (condition.includes('cloud')) iconKey = 'clouds';
    else if (condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle')) iconKey = 'rain';
    else if (condition.includes('snow')) iconKey = 'snow';
    else if (condition.includes('thunder')) iconKey = 'thunderstorm';
    else if (condition.includes('fog') || condition.includes('mist')) iconKey = 'mist';

    weatherIcon.src = weatherIcons[iconKey] || weatherIcons.clear;
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