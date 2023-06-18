var apiKey = "aa5e670bb5114654ea08830ff27af01a"
var savedSearches = [];
var cityName;
var savedSearchHistory;


// previous searches
var searchHistoryList = function (cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

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

    if (savedSearches.length > 0) {
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // add city to saved
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // reset
    $('#search-input').val("");

};

// saved history to search
var loadSearchHistory = function () {
    var savedSearchHistory = localStorage.getItem("savedSearches");
    savedSearches = JSON.parse(savedSearchHistory);


    // if no previous searches
    if (!savedSearchHistory) {
        // console.log("no search history"); 
        // return false; 
    }

    // if (savedSearchHistory) {
    //     savedSearchHistory = []; 
    // }


    // savedSearchHistory(); 
    // savedSearchHistory = parseInt(savedSearchHistory); 

    for (var i = 0; i < savedSearches.length; i++) {
        searchHistoryList(savedSearches[i]);
    }

};

var currentWeatherSection = function (cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityLon = data.coord.lon;
            var cityLat = data.coord.lat;
            // console.log(data); 

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // get response from one call api and turn it into objects
                .then(function (response) {
                    return response.json();
                })
                // get data from response and apply them to the current weather section
                .then(function (data) {
                    searchHistoryList(cityName);

                    // add current weather container with border to page
                    var currentWeatherContainer = $("#current-weather-container");
                    currentWeatherContainer.addClass("current-weather-container");

                    // add city name, date, and weather icon to current weather section title
                    var currentTitle = $("#current-title");
                    var currentDay = dayjs().format("M/DD/YYYY");
                    // var currentDay = moment().format("M/D/YYYY"); 
                    currentTitle.text(`${cityName} (${currentDay})`);
                    var currentIcon = $("#current-weather-icon");
                    currentIcon.addClass("current-weather-icon");
                    var currentIconCode = data.weather[0].icon;
                    currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

                    // add current temperature to page
                    var currentTemperature = $("#current-temperature");
                    currentTemperature.text("Temperature: " + data.main.temp + " \u00B0F");

                    // add current humidity to page
                    var currentHumidity = $("#current-humidity");
                    currentHumidity.text("Humidity: " + data.main.humidity + "%");

                    // add current wind speed to page
                    var currentWindSpeed = $("#current-wind-speed");
                    currentWindSpeed.text("Wind Speed: " + data.wind.speed + " MPH");

                })
        })
        .catch(function (err) {
            // reset search input
            $("#search-input").val("");
            // alert user that there was an error
            alert(
              "We could not find the city you searched for. Try searching for a valid city."
            );
          });
      };
      var fiveDayForecastSection = function (cityName) {
        // get and use data from open weather current weather api end point
        fetch(https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}
        )
          // get response and turn it into objects
          .then(function (response) {
            console.log(response);
            return response.json();
          })
          .then(function (data) {
            // get city's longitude and latitude
            var cityLon = data.coord.lon;
            var cityLat = data.coord.lat;
            fetch(
              https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}
            )
              // get response from one call api and turn it into objects
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                console.log(data);
                // add 5 day forecast title
                var futureForecastTitle = $("#future-forecast-title");
                futureForecastTitle.text("5-Day Forecast:");
                // using data from response, set up each day of 5 day forecast
                for (var i = 1; i <= 6; i++) {
                  console.log(i);
                  // add class to future cards to create card containers
                  var futureCard = $(".future-card");
                  futureCard.addClass("future-card-details");
                  // console.log(futureCard);
                  // add date to 5 day forecast
                  var futureDate = $("#future-date-" + i);
                  date = dayjs().add(i, "d").format("M/DD/YYYY");
                  // date = moment().add(i, "d").format("M/D/YYYY");
                  futureDate.text(date);
                  // add icon to 5 day forecast
                  var futureIcon = $(#future-icon-${[i]});
                  futureIcon.addClass("future-icon");
                  var futureIconCode = data.list[i].weather[0].icon;
                  futureIcon.attr(
                    "src",
                    https://openweathermap.org/img/wn/${futureIconCode}@2x.png
                  );

                  // add temp to 5 day forecast
                  var futureTemp = $(#future-temp-${[i]});
                  futureTemp.text(`Temp: " + data.list[i].main.temp + " \u00B0F``);
                  console.log(futureTemp);
                  // console.log(futureTemp);

                  // TO DO: add wind speed to 5 day forecast
                  // var futureWindSpeed = $("#future-wind-speed" + i);
                  // futureWindSpeed.text("Wind-Speed: " + data.list[i].windSpeed + )

                  // add humidity to 5 day forecast
                  var futureHumidity = $(#future-humidity-${[i]});
                  futureHumidity.text(
                    "Humidity: " + data.list[i].main.humidity + "%"
                  );
                  // console.log(futureHumidity);
                }
              });
          });
      };
      // called when the search form is submitted
      $("#search-form").on("submit", function (e) {
        e.preventDefault();
        // get name of city searched
        var cityName = $("#search-input").val();
        if (cityName === "" || cityName == null) {
          //send alert if search input is empty when submitted
          alert("Please enter name of city.");
          e.preventDefault();
        } else {
          // if cityName is valid, add it to search history list and display its weather conditions
          currentWeatherSection(cityName);
          fiveDayForecastSection(cityName);
        }
      });
      // called when a search history entry is clicked
      $("#search-history-container").on("click", "p", function () {
        // get text (city name) of entry and pass it as a parameter to display weather conditions
        var previousCityName = $(this).text();
        currentWeatherSection(previousCityName);
        fiveDayForecastSection(previousCityName);
        //
          var previousCityClicked = $(this);
        previousCityClicked.remove();
      });
      // loadSearchHistory();