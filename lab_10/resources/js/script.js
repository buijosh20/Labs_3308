//helper functions
var dayOfWeek = "";
function formatDate(date, month, year)
{
  month = (month.length < 2) ? ('0' + month) : month;
  date = (date.length < 2)? ('0' + date) : date;
  return [year,month,date].join('-');
}
function getDayofWeek(date, month, year){
  var week_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  dayOfWeek =  week_names[new Date([month,date,year].join('-')).getDay()];
  return dayOfWeek
}
function getFarenheitTemp(temp){
  return (9*temp/5)+32;
}

//run when the document object model is ready for javascript code to execute
$(document).ready(function() {
  var url ='https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=39.742043,-104.991531&forecast_days=5&hourly=1&interval=3'; //Place your weatherstack API Call Here - access_key to be used: 5bc82451636190abd9d7afe6fe9b20b5

  $.ajax({url:url, dataType:"jsonp"}).then(function(data) {
    // console.log(data);//Review all of the data returned
		// console.log("Current Temp: " + data.current.temperature);//View Today's Temp
    // console.log("Future Forecast: " + data.forecast['2020-11-04'].maxtemp);//View Today's Temp
    var current_time = new Date(data.location.localtime);//Retrieve the current timestamp
		// console.log(current_time.getDay());

    /*
      Read the current weather information from the data point values [https://weatherstack.com/documentation] to
      update the webpage for today's weather:
      1. image_today : This should display an image for today's weather.
               This will use the icon that is returned by the API. You will be looking for the weather_icons key in the response.
      */
        var image = data.current.weather_icons; // Grabs the current weather icon
        document.getElementById("image_today").src = image; // Changes the weather icon source image

      /*
      2. location: This should be appended to the heading. For eg: "Today's Weather Forecast - Boulder"
      */
        var location = data.location.name;
        document.getElementById("heading").innerHTML = "Today's Weather Forecast - "; // Changes HTML header

        headerParent = document.getElementById("heading");
        headerParent.append(location); // Appends the location of the weather to the header
        // console.log(headerParent);

      /*
      3. temp_today : This will be updated to match the current temperature. Use the getFarenheitTemp to convert the temperature from celsius to farenheit.
      */
        var temperature = data.current.temperature; // Get the temperature from API
        var tempFahrenheit = getFarenheitTemp(temperature); // Convert temperature from C to F
        document.getElementById("temp_today").innerHTML = tempFahrenheit + " F";
        // console.log(tempFahrenheit);
      /*
      4. thermometer_inner : Modify the height of the thermometer to match the current temperature. This means if the
                   current temperature is 32 F, then the thermometer will have a height of 32%.  Please note,
                   this thermometer has a lower boundary of 0 and upper boundary of 100.
       */
       if(tempFahrenheit > 100){
        document.getElementById("thermometer_inner").style.height = 100 + "%";
      } else if (tempFahrenheit < 0) {
        document.getElementById("thermometer_inner").style.height = 0 + "%";
      } else{
         document.getElementById("thermometer_inner").style.height = tempFahrenheit + "%";
      }

      // EXTRA CREDIT - CHANGE COLOR OF THERMOMETER AS TEMPERATURE CHANGES
      if(tempFahrenheit > 85){
        document.getElementById("thermometer_inner").style.background = 'red';
      }else if (tempFahrenheit < 65){
        document.getElementById("thermometer_inner").style.background = 'blue';
      }
       /*
      5. precip_today : This will be updated to match the current probability for precipitation. Be sure to check the unit of the value returned and append that to the value displayed.
      */
      var precipitation = data.current.precip;
      document.getElementById("precip_today").textContent = precipitation + "%";
      /*
      6. humidity_today : This will be updated to match the current humidity percentage (make sure this is listed as a
                percentage %)
      */
      var humidity = data.current.humidity;
      document.getElementById("humidity_today").textContent = humidity + "%";
      /*
      7. wind_today : This will be updated to match the current wind speed.
      */
      var wind = data.current.wind_speed;
      document.getElementById("humidity_today").textContent = wind + " km/h";
      /*
      8. summary_today: This will be updated to match the current summary for the day's weather.
      */
      // var sum = "The weather today has a "
      var description = data.current.weather_descriptions
      document.getElementById("summary_today").textContent = description
      /*
    */
    //helper function - to be used to get the key for each of the 5 days in the future when creating cards for forecasting weather
    function getKey(i){
        var week_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
        dayOfWeek=week_names[new Date(Object.keys(data.forecast)[i]).getDay()];
        return data.forecast[Object.keys(data.forecast)[i]];
    }
    /* Process the daily forecast for the next 5 days */

    fiveDay = document.getElementById("5_day_forecast")
    // console.log(getKey(1));

  for(var i=0; i<5; i++){
    var date = (getKey(i).date).split("-"); // Gets the date then splits the date from YYYY-MM-DD to YYYY,MM,DD
    var weekday = getDayofWeek(date[2],date[1],date[0]) // Date is an array with year in index 0, month in index 1, and day for index 2
    var temperatureHigh = getKey(i).maxtemp // Max temp
    var temperatureLow = getKey(i).mintemp // Min temp
    var sunrise = getKey(i).astro.sunrise // Sunrise
    var sunset = getKey(i).astro.sunset // Sunset

    var cardContainer = document.getElementById('5_day_forecast');

    // OUTER DIV
    var outerDiv = document.createElement('div');
    outerDiv.style.width = '20%'

    // CREATES INITIAL CARD DIV
    var card = document.createElement('div');
    card.className = 'card';

    // CREATES CARD BODY
    var cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // CREATES CARD HEADER FOR THE WEEKDAY
    var title = document.createElement('h5');
    title.className = 'card-title';
    title.innerHTML = weekday;

    // TEMPERATURE HIGH
    var tempHigh = document.createElement('p');
    tempHigh.className = 'card-text';
    tempHigh.innerHTML = 'High: ' + temperatureHigh;

    // TEMPERATURE LOW
    var tempLow = document.createElement('p');
    tempLow.className = 'card-text';
    tempLow.innerHTML = 'Low: ' + temperatureLow;

    // SUNRISE
    var rise = document.createElement('p');
    rise.className = 'card-text';
    rise.innerHTML = 'Sunrise: ' + sunrise;

    // SUNSET
    var set = document.createElement('p');
    set.className = 'card-text';
    set.innerHTML = 'Sunset: ' + sunset;


    // CARD BODY APPENDS WEEKDAY, TEMPERATURES
    cardBody.appendChild(title);
    cardBody.appendChild(tempHigh);
    cardBody.appendChild(tempLow);
    cardBody.appendChild(rise);
    cardBody.appendChild(set);

    // CARD CLASS THEN APPENDS THE CARD BODY
    card.appendChild(cardBody);

    // OUTER DIV THEN APPENDS THE CARD
    outerDiv.appendChild(card);

    // APPENDS TO THE HTML FILE BY ID
    cardContainer.appendChild(outerDiv);

  }
    /*
      For the next 5 days you'll need to add a new card listing:
        1. The day of the week
        2. The temperature high
        3. The temperature low
        4. Sunrise
        5. Sunset

      Each card should use the following format:
      <div style="width: 20%;">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title"><!-- List Day of the Week Here --></h5>
            <p class="card-text">High:<!--List Temperature High --> <br>
              Low: <!-- List Temperature Low --><br>
              Sunrise: <!-- List Time of Sunrise --><br>
              Sunset: <!-- List Time of Sunset --></p>
          </div>
        </div>
      </div>

      <Hint1 - To access the forecast data> You need to make sure to carefully see the JSON response to see how to access the forecast data. While creating the key to access forecast data make sure to convert it into a string using the toString() method.

      <Hint2 - To add the cards to the HTML> - Make sure to use string concatenation to add the html code for the daily weather cards.  This should
      be set to the innerHTML for the 5_day_forecast.
    */
  })
});
