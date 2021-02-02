$(document).ready(function () {
  var apiKey = "96cbbd7612177aab78d3de0dcd536826";

  $("#search-btn").on("click", function (event) {
    event.preventDefault();
    var city = $("#user-search").val();
    console.log(city);
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
    });
  });
});
