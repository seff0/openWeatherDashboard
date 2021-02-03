$(document).ready(function () {
  function getWeather(city) {
    var lat = 0;
    var lon = 0;

    var apiKey = "96cbbd7612177aab78d3de0dcd536826";

    var query1URL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;

    $.ajax({
      url: query1URL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var city = response.name;
      $(".city").text(city);

      var cityIcon = response.weather[0].icon;
      $(".cityIcon").attr("src", "Assets/icons/" + cityIcon + ".png");

      var tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
      $(".temp").html("Temperature (F): " + tempF);

      $(".humidity").html("Humidity: " + response.main.humidity);

      $(".windSpd").html("Wind speed (m/s): " + response.wind.speed);

      lat = parseInt(response.coord.lat);
      lon = parseInt(response.coord.lon);

      var query2URL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=minutely,hourly&appid=" +
        apiKey;

      $.ajax({
        url: query2URL,
        method: "GET",
      }).then(function (response2) {
        console.log(response2);
        let unix_timestamp = response2.current.dt;
        var date = new Date(unix_timestamp * 1000).toLocaleDateString("en-US");
        $(".currentDate").html(date);

        var indexNum = parseInt(response2.current.uvi);
        console.log(indexNum);
        if (indexNum > 7) {
          $(".UVI").addClass("btn-danger");
        } else if (indexNum > 2) {
          $(".UVI").addClass("btn-warning");
        } else {
          $(".UVI").addClass("btn-success");
        }
        $(".UVI").html("UV Index: " + indexNum);

        var forecast = response2.daily;

        for (i = 0; i < 5; i++) {
          let unix_timestamp = forecast[i].dt;
          var date = new Date(unix_timestamp * 1000).toLocaleDateString(
            "en-US"
          );
          $("." + [i] + "forecastDate").html(date);
          var tempF = ((forecast[i].temp.max - 273.15) * 1.8 + 32).toFixed(1);
          $("." + [i] + "forecastTemp").html(tempF + "° F");
          $("." + [i] + "forecastHumidity").html(
            forecast[i].humidity + "% humidity"
          );
          var selectedIcon = forecast[i].weather[0].icon;
          $("." + [i] + "forecastIcon").attr(
            "src",
            "Assets/icons/" + selectedIcon + ".png"
          );
        }
      });
    });
  }

  function load() {
    var citiesStored = JSON.parse(localStorage.getItem("cities"));
    if (citiesStored) {
      $.each(citiesStored, function (i) {
        var city = citiesStored[i];
        var newLi = $("<li>");
        newLi.addClass("list-group-item cityLi");
        newLi.text(city);
        $(".list-group").prepend(newLi);
      });
    }
  }

  function store(city) {
    var citiesStored = JSON.parse(localStorage.getItem("cities"));
    if (!citiesStored) {
      citiesStored = [];
    }
    if (citiesStored.includes(city) === false) {
      citiesStored.push(city);
    }
    localStorage.setItem("cities", JSON.stringify(citiesStored));
  }

  $("#search-btn").on("click", function (event) {
    event.preventDefault();

    var city = $("#user-search").val();
    var newLi = $("<li>");
    newLi.addClass("list-group-item cityLi");
    newLi.text(city);
    $(".list-group").prepend(newLi);

    store(city);
    getWeather(city);
  });

  $(document).on("click", ".cityLi", function () {
    var city = $(this).text();
    getWeather(city);
  });

  load();
  getWeather($(".cityLi").first()[0].innerHTML);
});
