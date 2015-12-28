# owm-interface.js

This is an interface for the OpenWeatherMap API, designed to make it easier to plug-and-play the API without having to
manually perform API calls and parsing

Installation
------------
* owm-interface.js requires jQuery (mostly for calling the OWM API).
* Include owm-interface.js in your html file.
```html
<script src="owm-interface.js"></script>
```

Usage
-----
To use owm-interface, you must first initialize it with your API key from OpenWeatherMap.
```javascript
// init(api key, units: imperial or metric)
OWM.init('my-api-key', 'imperial');
```

Each querying function requires some parameters and a callback function to be executed on a successful API call.

#### Querying current conditions:
```javascript
// queryByZip('current', zipcode, country, callback function)
OWM.queryByZip('current', '12345', 'us', function(result){
    console.log('Temperature: ' + result.temperature);
});
// queryByCoord('current', latitude, longitude, callback function)
OWM.queryByCoord('current', '50', '50', function(result){
    console.log('Temperature: ' + result.temperature);
});
// queryById('current', OWM city ID, callback function)
OWM.queryById('current', '123456', function(result){
    console.log('Temperature: ' + result.temperature);
});
```
Response format:
```
{ name: 'City Name',
  conditions: 'snow' (lowercase, parseable conditions),
  readableConditions: 'Snow' (Capitalized, human-readable conditions),
  temperature: 40 (current temperature in requested units),
  pressure: 1000 (atmospheric pressure in hPa),
  humidity: 80 (percentage),
  windSpeed: 5 (current wind speed in requested units),
  windDirection: 140 (current wind direction in degrees),
  windDirectionText: 'NW' (human-readable),
  cloudiness: 25 (percentage),
  rainVolume: 3 (rain volume in last 3 hours),
  snowVolume: 0 (snow volume in last 3 hours),
  time: 1451190000 (Unix timestamp of data)
}
```

#### Querying forecast data:
```javascript
// queryByZip('forecast', zipcode, country, callback function)
OWM.queryByZip('forecast', '12345', 'us', function(result){
    console.log('Temperature: ' + result.temperature);
});
// queryByCoord('forecast', latitude, longitude, callback function)
OWM.queryByCoord('forecast', '50', '50', function(result){
    console.log('Temperature: ' + result.temperature);
});
// queryById('forecast', OWM city ID, callback function)
OWM.queryById('forecast', '123456', function(result){
    console.log('Temperature: ' + result.temperature);
});
```
Response format:
```
{ name: 'City Name',
  data: [
    {
      time: 1451196000 (Unix timestamp of this 3-hour period),
      conditions: 'light rain' (lowercase, parseable conditions),
      readableConditions: 'Rain' (Capitalized, human-readable conditions),
      temperature: 40 (forecast temperature in requested units),
      pressure: 1000 (atmospheric pressure in hPa),
      humidity: 80 (percentage),
      windSpeed: 5 (forecast wind speed in requested units),
      windDirection: 140 (forecast wind direction in degrees),
      windDirectionText: 'NW' (human-readable),
      cloudiness: 25 (percentage),
      rainVolume: 3 (rain volume prediction in this 3 hour period),
      snowVolume: 0 (snow volume prediction in this 3 hour period)
    },
    {
      time: 1451206800,
      conditions: 'light rain',
      ...
    },
    ...
  ] 
}
```

You can also perform your own custom queries on the API by using the 'query' function.  
You must provide the correct request type and parameters as required in the OWM API.
(i.e. http://api.openweathermap.org/data/2.5/weather?zip=94040,us has type='weather', zip='94040,us')   
This function does not format the response in any way so you get exactly what OWM returns from the API call.
```javascript
// query(request type, parameters, callback function)
OWM.query('weather', {zip: '12345,us'}, function(result){
    // work with OWM response
});
OWM.query('forecast', {id: '123456'}, function(result){
    // work with OWM response
});
```

Version
----

0.1