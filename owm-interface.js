var OWM = {
  apiKey: null,
  url: 'http://api.openweathermap.org/data/2.5/',
  units: 'imperial',
  ready: true,
  checkValidity: function(){
    if(!window.jQuery){
      console.error('OWM: jQuery is not loaded!');
      this.ready = false;
    }
    if(!this.apiKey){
      console.error('OWM: Missing API key!');
      this.ready = false;
    }
    if(this.apiKey && window.jQuery){
      this.ready = true;
    }
  },
  init: function(apiKey, units){
    if(!apiKey){
      console.error('OWM: Missing OpenWeatherMap API Key when calling "init"');
      return;
    }
    this.apiKey = apiKey;
    if(units) this.units = units;
  },
  filterResponse: function(response, type) {
    var filtered;
    var directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    if(type === 'forecast'){
      var windDirectionText;
      var wind = response['wind']['deg'] + 22.5;
      if(wind >= 360) wind -= 360;
      windDirectionText = directions[Math.floor(wind / 45)];
      filtered = {
        name: response['name'],
        conditions: response['weather']['description'],
        readableConditions: response['weather']['main'],
        temperature: response['main']['temp'],
        pressure: response['main']['pressure'],
        humidity: response['main']['humidity'],
        windSpeed: response['wind']['speed'],
        windDirection: response['wind']['deg'],
        windDirectionText: windDirectionText,
        cloudiness: response['clouds']['all'],
        rainVolume: response['rain']['3h'],
        snowVolume: response['snow']['3h'],
        time: response['dt']
      }
    }
    if(type === 'current'){
      filtered = {
        name: response['city']['name'],
        data: []
      };
      response['list'].forEach(function(period){
        var windDirectionText, entry;
        var wind = response['wind']['deg'] + 22.5;
        if(wind >= 360) wind -= 360;
        windDirectionText = directions[Math.floor(wind / 45)];
        entry = {
          time: response['dt'],
          conditions: response['weather']['description'],
          readableConditions: response['weather']['main'],
          temperature: response['main']['temp'],
          pressure: response['main']['pressure'],
          humidity: response['main']['humidity'],
          windSpeed: response['wind']['speed'],
          windDirection: response['wind']['deg'],
          windDirectionText: windDirectionText,
          cloudiness: response['clouds']['all'],
          rainVolume: response['rain']['3h'],
          snowVolume: response['snow']['3h']
        }
        filtered['data'].push(entry);
      });
    }
    return filtered;
  },
  queryById: function(type, id, country, callback){
    if(!type || !id || !country) console.error('OWM: Missing parameters when calling "queryById"');
    this.checkValidity();
    if(this.ready){
      var req;
      if(type === 'current'){ req = 'weather'; }
      else if(type === 'forecast'){ req = 'forecast'; }
      else { console.error('OWM: Invalid query type "'+ type + '" provided in "queryById"'); return; }
      var queryURL = this.url + req + '?id=' + id;
      queryURL += '&units=' + this.units + '&APPID=' + this.apiKey;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(that.filterResponse(response, type));
      });
    }
  },
  queryByZip: function(type, zipcode, country, callback){
    if(!type || !zipcode || !country) console.error('OWM: Missing parameters when calling "queryByZip"');
    this.checkValidity();
    if(this.ready){
      var req;
      if(type === 'current'){ req = 'weather'; }
      else if(type === 'forecast'){ req = 'forecast'; }
      else { console.error('OWM: Invalid query type "'+ type + '" provided in "queryByZip"'); return; }
      var queryURL = this.url + req + '?zip=' + zipcode + ',' + country;
      queryURL += '&units=' + this.units + '&APPID=' + this.apiKey;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(that.filterResponse(response, type));
      });
    }
  },
  queryByCoord: function(type, latitude, longitude, callback){
    if(!type || !longitude || !latitude) console.error('OWM: Missing parameters when calling "queryByCoord"');
    this.checkValidity();
    if(this.ready){
      var req;
      if(type === 'current'){ req = 'weather'; }
      else if(type === 'forecast'){ req = 'forecast'; }
      else { console.error('OWM: Invalid query type "'+ type + '" provided in "queryByCoord"'); return; }
      var queryURL = this.url + req + '?lat=' + latitude + '&lon=' + longitude;
      queryURL += '&units=' + this.units + '&APPID=' + this.apiKey;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(this.filterResponse(response, type));
      });
    }
  },
  query: function(type, params, callback){
    if(!type) console.error('OWM: Missing request type when calling "query"');
    if(!params) console.error('OWM: Missing request parameters list when calling "query"');
    this.checkValidity();
    if(this.ready){
      var queryString = '';
      var queryURL = this.url + type + '?';
      Object.keys(params).forEach(function(key){
        this.updateQuery(queryString, key, params[key]);
      });
      queryURL += queryString;
      $.get(queryURL, function(response){
        console.log(response);
        callback(response);
      });
    }
  },
  updateQuery: function(query, key, value) {
    var regex = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var sep = query.indexOf('?') !== -1 ? "&" : "?";
    if(query.match(regex)) {
      return query.replace(regex, '$1' + key + "=" + value + '$2');
    } else {
      return query + sep + key + "=" + value;
    }
  }
};