const cityInput = document.getElementById("search-box");
const searchButton = document.getElementById("search-btn");
const currentLocationButton = document.getElementById("current-btn");
const themeButton = document.querySelector(".theme");
const mainBackground = document.querySelector(".main-background");
const allTextElements = mainBackground.querySelectorAll("*");

//Get city name from user
const getCityCordinates = (coords = null) => {
  let API_URL;
  
  if (coords) {
    API_URL = `https://mi-linux.wlv.ac.uk/~2411782/my-api2.php?lat=${coords.latitude}&lon=${coords.longitude}`;
  } else {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    API_URL = `https://mi-linux.wlv.ac.uk/~2411782/my-api2.php?city=${cityName}`;
  }

  // Getting weather details from MySQL    
  fetch(API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then(response => {
        displayWeatherData(response);
      })
      .catch(error => {
        console.error('Error fetching city weather:', error);
        alert("An Error Occurred while getting City Weather information!");
      });
};

// Function to display weather data on the page
const displayWeatherData = (response) => {
  if (!response) return;

  const iconCode = response.weather_icon;
  const weatherImage = document.getElementById('weather-img');
  weatherImage.src = 'https://openweathermap.org/img/wn/' + iconCode + '@4x.png';
  document.getElementById('cloud-type').innerHTML = response.weather_description;
  document.getElementById('city-temp').innerHTML = response.weather_temperature + ' &#8451';
  document.getElementById('feel-like').innerHTML = response.weather_temperature_feels + ' &#8451';
  document.getElementById('humidity-persentage').innerHTML = response.weather_humidity + ' %';
  document.getElementById('visibility-dist').innerHTML = response.weather_visibility + ' m';
  document.getElementById('pressure').innerHTML = response.weather_pressure + ' hPa';
  document.getElementById('wind-speed').innerHTML = response.weather_wind + ' m/s';
  document.getElementById('current-date').innerHTML = response.weather_when;
  document.getElementById('city-name').innerHTML = response.city;
  const lat = response.weather_lat;
  const lon = response.weather_lon;
  getWeatherDetails(lat, lon);
};


//Getting 5 days weather forecast with Lattitute and Longtitude from MySQL Table
const getWeatherDetails = (lat, lon) => {
  const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=218b1c3e21a59ad965a97bfcb3fe7236';

  fetch(WEATHER_API_URL)
  .then(res => res.json())
  .then(data => {
    const fiveDayForecast = data.list;
    const uniqueForecastDays = {};

    fiveDayForecast.forEach(forecast => {
      const date = forecast.dt_txt.split(' ')[0];
      if (!uniqueForecastDays[date]) {
        uniqueForecastDays[date] = forecast;
      }
    });

    const daysData = Object.values(uniqueForecastDays);

    daysData.slice(0,4).forEach((forecast, index) => {
      const dateElement = document.getElementById(`get-date${index + 1}`);
      const weatherElement = document.getElementById(`get-weather${index + 1}`);
      const feelElement = document.getElementById(`get-feel${index + 1}`);
      const tempElement = document.getElementById(`get-temp${index + 1}`);

      if (dateElement && weatherElement && feelElement && tempElement) {
        const iconCode = forecast.weather[0].icon;
        const dateArray = forecast.dt_txt.split(" ");
        const abbreviatedDayOfWeek = new Date(dateArray[0]).toLocaleString('en-US', { weekday: 'short' }).substring(0, 3);

        dateElement.innerHTML = dateArray[0] + " " + abbreviatedDayOfWeek;
        weatherElement.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        feelElement.innerHTML = forecast.weather[0].description;
        tempElement.innerHTML = (forecast.main.temp - 273.15).toFixed(2);
      } else {
        console.error(`One or more elements with ID 'get-date${index + 1}', 'get-weather${index + 1}', 'get-feel${index + 1}', or 'get-temp${index + 1}' not found.`);
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching Weather Forecast:", error);
    alert("An Error Occurred while fetching Weather Forecast!");
  });

}

searchButton.addEventListener("click", () => {
    getCityCordinates();
});


// Event listener for the "Enter" keypress in cityInput
cityInput.addEventListener("keypress", function (event) {
if (event.key === "Enter") {
    event.preventDefault();
    getCityCordinates();
}
});

//Getting Current location cordinates and saved to SQL
function getCurrentLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // Add a call to fetch 5-day weather details using these coordinates
      getWeatherDetails(lat, lon);
    },
    (error) => {
      console.error("Error getting current location:", error);
      alert("Unable to retrieve current location.");
    }
  );
} else {
  alert("Geolocation is not supported by your browser.");
}
};

currentLocationButton.addEventListener("click", getCurrentLocation);


//Toggle dark mode
const toggleDarkMode = () => {
    const isDarkMode = mainBackground.classList.contains("dark-mode");

    if (isDarkMode) {
        mainBackground.classList.remove("dark-mode");
        mainBackground.style.backgroundColor = "rgba(32,43,59,0.4)"; 
        mainBackground.style.color = "#000000"; 
        allTextElements.forEach(element => {
            element.style.color = "#000000"; 
        });
    } else {
        mainBackground.classList.add("dark-mode");
        mainBackground.style.backgroundColor = "rgb(11,19,30)"; 
        mainBackground.style.color = "#ffffff"; 
        allTextElements.forEach(element => {
          element.style.color = "#ffffff"; 
      });

    }
};

themeButton.addEventListener("click", toggleDarkMode);


