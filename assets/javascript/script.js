var apiKey = "aa5e670bb5114654ea08830ff27af01a"
var savedSearches = []; 
var cityName; 
var savedSearchHistory; 


// previous searches
var searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove(); 

}

// CITY NAME ENTER TEXT
var searchHistoryEntry = $("<p>")
searchHistoryEntry.addClass("past-search"); 
searchHistoryEntry.text(cityName); 

// entry box
var searchEntryContainer = $("<div>"); 
searchEntryContainer.addClass("past-search-container"); 

// add entry
searchEntryContainer.append(searchHistoryEntry); 

// add entry to search history
var searchHistoryContainerEL = $("#search-history-container"); 
searchHistoryContainerEL.append(searchEntryContainer); 

if(savedSearches.length > 0) {
    var previousSavedSearches = localStorage.getItem("savedSearches"); 
    savedSearches = JSON.parse(previousSavedSearches); 
}

// add city to saved
savedSearches.push(cityName); 
localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

// reset
$('#search-input').val(""); 

// }; 

// saved history to search
var loadSearchHistory = function() {
    var savedSearchHistory = localStorage.getItem("savedSearches"); 

}

// if no previous searches
if (!savedSearchHistory) {
    console.log("no search history"); 
    // return false; 
}

savedSearchHistory = JSON.parse(savedSearchHistory); 

for (var i = 0; i < savedSearchHistory.length; i++) {
    searchHistoryList(savedSearchHIstory[i]); 
}

// }; 

var currentWeatherSection = function(cityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}')
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        var cityLon = response.coord.lon; 
        var cityLat = response.coord.lat; 

// code from https://github.com/jmrendon48/weather-dashboard-6
fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
// get response from one call api and turn it into objects
.then(function(response) {
    return response.json();
})
// get data from response and apply them to the current weather section
.then(function(response){
    searchHistoryList(cityName);

    // add current weather container with border to page
    var currentWeatherContainer = $("#current-weather-container");
    currentWeatherContainer.addClass("current-weather-container");

    // add city name, date, and weather icon to current weather section title
    var currentTitle = $("#current-title");
    var currentDay = moment().format("M/D/YYYY");
    currentTitle.text(`${cityName} (${currentDay})`);
    var currentIcon = $("#current-weather-icon");
    currentIcon.addClass("current-weather-icon");
    var currentIconCode = response.current.weather[0].icon;
    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

    // add current temperature to page
    var currentTemperature = $("#current-temperature");
    currentTemperature.text("Temperature: " + response.current.temp + " \u00B0F");

    // add current humidity to page
    var currentHumidity = $("#current-humidity");
    currentHumidity.text("Humidity: " + response.current.humidity + "%");

    // add current wind speed to page
    var currentWindSpeed = $("#current-wind-speed");
    currentWindSpeed.text("Wind Speed: " + response.current.wind_speed + " MPH");

    // add uv index to page
    var currentUvIndex = $("#current-uv-index");
    currentUvIndex.text("UV Index: ");
    var currentNumber = $("#current-number");
    currentNumber.text(response.current.uvi);

    // add appropriate background color to current uv index number
    if (response.current.uvi <= 2) {
        currentNumber.addClass("favorable");
    } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
        currentNumber.addClass("moderate");
    } else {
        currentNumber.addClass("severe");
    }
})
})
.catch(function(err) {
// reset search input
$("#search-input").val("");

// alert user that there was an error
alert("We could not find the city you searched for. Try searching for a valid city.");
});
};

var fiveDayForecastSection = function(cityName) {
// get and use data from open weather current weather api end point
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
// get response and turn it into objects
.then(function(response) {
return response.json();
})
.then(function(response) {
// get city's longitude and latitude
var cityLon = response.coord.lon;
var cityLat = response.coord.lat;

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
// get response from one call api and turn it into objects
.then(function(response) {
    return response.json();
})
.then(function(response) {
    console.log(response);

    // add 5 day forecast title
    var futureForecastTitle = $("#future-forecast-title");
    futureForecastTitle.text("5-Day Forecast:")

    // using data from response, set up each day of 5 day forecast
    for (var i = 1; i <= 5; i++) {
        // add class to future cards to create card containers
        var futureCard = $(".future-card");
        futureCard.addClass("future-card-details");

        // add date to 5 day forecast
        var futureDate = $("#future-date-" + i);
        date = moment().add(i, "d").format("M/D/YYYY");
        futureDate.text(date);

        // add icon to 5 day forecast
        var futureIcon = $("#future-icon-" + i);
        futureIcon.addClass("future-icon");
        var futureIconCode = response.daily[i].weather[0].icon;
        futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

        // add temp to 5 day forecast
        var futureTemp = $("#future-temp-" + i);
        futureTemp.text("Temp: " + response.daily[i].temp.day + " \u00B0F");

        // add humidity to 5 day forecast
        var futureHumidity = $("#future-humidity-" + i);
        futureHumidity.text("Humidity: " + response.daily[i].humidity + "%");
    }
})
})
};

// called when the search form is submitted
$("#search-form").click("submit", function() {
event.preventDefault();

// get name of city searched
var cityName = $("#search-input").val();

if (cityName === "" || cityName == null) {
//send alert if search input is empty when submitted
alert("Please enter name of city.");
event.preventDefault();
} else {
// if cityName is valid, add it to search history list and display its weather conditions
currentWeatherSection(cityName);
fiveDayForecastSection(cityName);
}
});

// called when a search history entry is clicked
$("#search-history-container").on("click", "p", function() {
// get text (city name) of entry and pass it as a parameter to display weather conditions
var previousCityName = $(this).text();
currentWeatherSection(previousCityName);
fiveDayForecastSection(previousCityName);

//
var previousCityClicked = $(this);
previousCityClicked.remove();
});

loadSearchHistory();
