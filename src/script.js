const element = document.getElementById('navbar');
const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    element.classList.toggle('navbar-dark');
    element.classList.toggle('bg-dark');
});

const input = document.getElementById('city');
const baseUrl = 'https://bestweatherapp-nine.vercel.app';

input.addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submitbtn").click();
    }city
});

function getWeather() {
    const city = document.getElementById('city').value;

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

function displayWeather(data) {

    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const cityInfo = document.getElementById('city-name');
    const celsius = document.getElementById('celsius');

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

        console.log(iconCode);

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


        const backgroundClassName = imageMap.get(iconCode);
        const element = document.getElementById("card");

        for(className of imageMap.values()) {
            element.classList.remove(className);
        }

        element.classList.add(backgroundClassName);

        if(interval != null) {
            clearInterval(interval);
        }
        displayCurrentTimeInTimezone(timezone);
        interval = setInterval(() => displayCurrentTimeInTimezone(timezone), 1000) 

        showCard();


        document.getElementById('city').value='';

        
    }

}

function displayCurrentTimeInTimezone(timezone) {
    const now = new Date();
    currentOffset = now.getTimezoneOffset();
    const date = new Date(now.getTime() + (60 * 1000 * currentOffset) + (1000 * timezone))

    const formatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateInfo = document.getElementById('date');
    dateInfo.innerHTML = date.toLocaleDateString('en-GB', formatOptions);

    const [numbers, suffix] = date.toLocaleTimeString('en-US').split(' ');

    const timeInfo = document.getElementById('time');
    timeInfo.innerHTML = numbers;

    const suffixInfo = document.getElementById('suffix');
    suffixInfo.innerHTML = suffix;
 }

function showCard() {
    const card = document.getElementById('card');
    card.style = "display: block !important";
}