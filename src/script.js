const navBar = document.getElementById('navbar');
const checkboxMode = document.getElementById('checkbox-mode');

checkboxMode.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    navBar.classList.toggle('navbar-dark');
    navBar.classList.toggle('bg-dark');
});

const cityInput = document.getElementById('city');
const citySubmitButton = document.getElementById('submit-button');

const baseUrl = 'https://bestweatherapp-nine.vercel.app';

cityInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        citySubmitButton.click();
    }
});

function getWeather() {
    const city = cityInput.value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `${baseUrl}/api/getWeather?city=${city}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

let interval = null;

const imageMap = new Map([
    ['01d', 'sunny'],
    ['02d', 'sunny-cloud'],
    ['03d', 'cloudy'],
    ['04d', 'cloudy'],
    ['09d', 'rainy'],
    ['10d', 'rainy-day'],
    ['11d', 'thunderstorm'],
    ['13d', 'snowy'],
    ['50d', 'foggy'],
    ['01n', 'moon'],
    ['02n', 'night-cloud'],
    ['03n', 'cloudy'],
    ['04n', 'cloudy'],
    ['09n', 'rainy'],
    ['10n', 'rainy-night'],
    ['11n', 'thunderstorm'],
    ['13n', 'snowy'],
    ['50n', 'foggy']
]);

const tempDivInfo = document.getElementById('temp-div');
const weatherInfoDiv = document.getElementById('weather-info');
const cityInfo = document.getElementById('city-name');
const celsius = document.getElementById('celsius');
const card = document.getElementById('card');

function displayWeather(data) {

    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';
    cityInfo.innerHTML = '';
    celsius.innerHTML = '';
    if (data.cod == '404') {
        weatherInfoDiv.innerHTML = '<p>city not found.</p>';
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const timezone = data.timezone;
        const iconCode = data.weather[0].icon;

        tempDivInfo.innerHTML = temperature;
        weatherInfoDiv.innerHTML = description;
        cityInfo.innerHTML = cityName;
        celsius.innerHTML = '&#176;';

        const backgroundClassName = imageMap.get(iconCode);

        for (className of imageMap.values()) {
            card.classList.remove(className);
        }

        card.classList.add(backgroundClassName);

        if (interval != null) {
            clearInterval(interval);
        }
        displayCurrentTimeInTimezone(timezone);
        interval = setInterval(() => displayCurrentTimeInTimezone(timezone), 1000)

        showCard();

        cityInput.value = '';
    }

}

const dateInfo = document.getElementById('date');
const timeInfo = document.getElementById('time');
const suffixInfo = document.getElementById('suffix');

function displayCurrentTimeInTimezone(timezone) {
    const now = new Date();
    const currentOffset = now.getTimezoneOffset();
    const date = new Date(now.getTime() + (60 * 1000 * currentOffset) + (1000 * timezone));

    const formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateInfo.innerHTML = date.toLocaleDateString('en-GB', formatOptions);

    const [numbers, suffix] = date.toLocaleTimeString('en-US').split(' ');

    timeInfo.innerHTML = numbers;

    suffixInfo.innerHTML = suffix;
}

function showCard() {
    card.style = 'display: block !important';
}