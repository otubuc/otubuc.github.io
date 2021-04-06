class WeatherWidget {
    constructor(div, options = { units: 'metric', location: false }) {
        this.DEBUG = true;
        this.container = div;
        this.options = options;
        this.buildWidget();
        this.refresh();
        setInterval(this.refresh.bind(this), 1800000); // Refresh every 30 minutes
    }

    buildWidget() {
        const container = document.createElement('div');
        const loadingSpinner = document.createElement('div');

        // Left Pane
        const leftPane = document.createElement('div');
        const temperatureContainer = document.createElement('div');
        const temperatureValue = document.createElement('div');
        const temperatureUnit = document.createElement('span');
        const windContainer = document.createElement('div');
        const windDirectionContainer = document.createElement('div');
        const windIcon = document.createElement('icon');
        const windDirection = document.createElement('span');
        const windSpeed = document.createElement('div');
        const windInfo = document.createElement('span');
        const aqiContainer = document.createElement('div');
        const aqiValue = document.createElement('div');
        const aqiUnit = document.createElement('span');

        container.className = 'weather_container';
        loadingSpinner.className = 'weather_loading_spinner';
        leftPane.className = 'weather_left_pane';
        temperatureContainer.className = 'weather_temp';
        temperatureValue.className = 'weather_temp_value odometer';
        temperatureUnit.className = 'weather_temp_unit';
        windContainer.className = 'weather_wind';
        windDirectionContainer.className = 'weather_wind_direction_container';
        windIcon.className = 'weather_wind_icon';
        windDirection.className = 'weather_wind_direction';
        windSpeed.className = 'weather_wind_speed odometer';
        windInfo.className = 'weather_wind_unit';
        aqiContainer.className = 'weather_aqi';
        aqiValue.className = 'weather_aqi_value odometer';
        aqiUnit.className = 'weather_aqi_unit';


        temperatureContainer.appendChild(temperatureValue);
        temperatureContainer.appendChild(temperatureUnit);
        windDirectionContainer.appendChild(windIcon);
        windDirectionContainer.appendChild(windDirection);
        windContainer.appendChild(windDirectionContainer);
        windContainer.appendChild(windSpeed);
        windContainer.appendChild(windInfo);
        aqiContainer.appendChild(aqiValue);
        aqiContainer.appendChild(aqiUnit);
        leftPane.appendChild(temperatureContainer);
        leftPane.appendChild(windContainer);
        leftPane.appendChild(aqiContainer);

        // Right pane
        const rightPane = document.createElement('div');
        const icon = document.createElement('div');
        const location = document.createElement('div');
        const forecast = document.createElement('div');

        rightPane.className = 'weather_right_pane';
        icon.className = 'weather_icon';
        location.className = 'weather_location';
        forecast.className = 'weather_forecast';
        for (let i = 0; i < 5; i++) {
            let forecastDay = document.createElement('div');
            let dayName = document.createElement('div');
            let dayIcon = document.createElement('div');
            let dayMaxTemp = document.createElement('div');
            let dayMinTemp = document.createElement('div');


            forecastDay.className = 'weather_forecast_day_container';
            dayName.className = 'weather_forecast_day weather_forecast_day_' + (i + 1);
            dayIcon.className = 'weather_forecast_icon';
            dayMaxTemp.className = 'weather_forecast_max_temp';
            dayMinTemp.className = 'weather_forecast_min_temp';


            forecastDay.appendChild(dayName);
            forecastDay.appendChild(dayIcon);
            forecastDay.appendChild(dayMaxTemp);
            forecastDay.appendChild(dayMinTemp);

            forecast.appendChild(forecastDay);
        }

        rightPane.appendChild(icon);
        rightPane.appendChild(location);
        rightPane.appendChild(forecast);

        // Set metric or imperial units
        const useMetric = (this.options.units == 'metric') ? true : false;
        const speedUnit = (useMetric) ? 'km/h' : 'mph';
        const tempUnit = (useMetric) ? '&#0176;C' : '&#0176;F';
        windIcon.innerHTML = 'Ù';
        temperatureUnit.innerHTML = tempUnit;
        windInfo.innerHTML = speedUnit;

        // Merge into container and append to document
        container.appendChild(loadingSpinner);
        container.appendChild(leftPane);
        container.appendChild(rightPane);
        this.container.appendChild(container);

        // Save references to class
        this.div = { temperature: temperatureContainer, wind: windContainer, aqi: aqiContainer, icon: icon, location: location, forecast: forecast, spinner: loadingSpinner };

        this.loadIcons();
        this.loadFonts();
    }

    refresh() {
        if (!this.location) this.hideElements(true);

        if (this.options.location) {
            this.hideElements(false);
            this.updateWeatherData();
        } else {
            this.getLocation();
        }
    }

    getLocation() {
        if (navigator.geolocation) {

            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    // On resolve
                    (position) => {
                        this.setLocation(position);
                        this.hideElements(false);
                        resolve();
                    },
                    // On reject
                    () => {
                        this.hideElements(false);
                        this.div.location.innerHTML = "Could not retrieve your location.";
                        reject();
                    });
            });

            navigator.geolocation.getCurrentPosition(this.setLocation.bind(this));
        } else {
            this.div.location.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    setLocation(position) {
        this.location = position;
        this.updateWeatherData();
    }

    hideElements(hideElements) {
        const visibility = (hideElements) ? 'hidden' : '';
        if (hideElements) {
            this.div.spinner.style.display = '';
        } else {
            this.div.spinner.style.display = 'none';
        }
        this.div.temperature.style.visibility = visibility;
        this.div.wind.style.visibility = visibility;
        this.div.aqi.style.visibility = visibility;
        this.div.wind.style.visibility = visibility;
        this.div.icon.style.visibility = visibility;
        this.div.location.style.visibility = visibility;
        this.div.forecast.style.visibility = visibility;
    }

    updateWeatherData() {
        let data;

        const weatherData = this.getWeatherData('weather');
        const forecastData = this.getWeatherData('forecast');
        const AQIData = this.getAQIData();

        Promise.all([weatherData, forecastData, AQIData]).then((values) => {
            data = values[0];
            data.forecast = this.parseForecast(values[1]);
            data.aqi = values[2];

            if (this.DEBUG) console.log(data);

            this.updateWeatherWidget(data);
        });
    }

    getWeatherData(type) {
        // Types are 'weather' or 'forecast'
        return new Promise((resolve, reject) => {
            const APIKey = 'fb642b9f9b21d1388c41237d1516c877';
            const APIUrl = 'https://api.openweathermap.org/data/2.5/' +
                type + '?';
            const units = this.options.units;

            let location;
            if (this.options.location) {
                location = 'q=' + this.options.location;
            } else {
                location = 'lat=' + this.location.coords.latitude +
                    '&lon=' + this.location.coords.longitude;
            }

            const url = APIUrl + location +
                '&units=' + units +
                '&APPID=' + APIKey;

            if (this.DEBUG) console.log('API Url: ', url);

            this.getJSON(url).then((json) => {
                resolve(json);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    getAQIData() {
        return new Promise((resolve, reject) => {
            const APIKey = 'ead448b4dc160b4a3719b42c0290e4fde9f20d64';
            const APIUrl = 'https://api.waqi.info/feed/';

            let location;
            if (this.options.location) {
                location = this.options.location;
            } else {
                location = 'geo:' + this.location.coords.latitude +
                    ';' + this.location.coords.longitude;
            }

            const url = APIUrl + location + '/?token=' + APIKey;

            if (this.DEBUG) console.log('AQI Url: ', url);

            this.getJSON(url).then((json) => {
                resolve(json);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    parseForecast(data) {
        // Parses forecast data (40 entries for every 3 hours) into 5 entries (one for each day)
        let forecast = [];
        for (let i = 0; i < 5; i++) {
            forecast[i] = data.list[(i * 8)];
        }

        return forecast;
    }

    // DEBUG FUNCTION
    getRandomizedWeatherDEBUG() {
            let data = JSON.parse('{"coord":{"lon":7.491302,"lat":9.072264},"weather":[{"id":310,"main":"Drizzle","description":"light intensity drizzle rain","icon":"09n"},{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"base":"stations","main":{"temp":278.89,"pressure":989,"humidity":100,"temp_min":277.15,"temp_max":280.15},"visibility":7000,"wind":{"speed":7.2,"deg":170},"clouds":{"all":90},"dt":1513185900,"sys":{"type":1,"id":5204,"message":0.0025,"country":"NL","sunrise":1513150992,"sunset":1513178822},"id":2753201,"name":"Jordaan","cod":200}')
            data.wind.speed = Math.random() * 20;
            data.wind.deg = Math.floor(Math.random() * 360);
            data.main.temp = Math.random() * 200;
            data.main.temp_min = Math.random() * 200;
            data.main.temp_max = Math.random() * 200;
            data.aqi.data.aqi = 99;
            data.aqi.data.dominentpol = 'pm25';

            data.weather[0].main = ['Sunny', 'Cloudy', 'Cloudy', 'Cloudy'][Math.floor(Math.random() * 2)]
            return data;
        }
        // END DEBUG FUNCTION

    updateWeatherWidget(data) {
        // data.name
        // data.main.temp
        // data.main.temp_max
        // data.main.temp_min
        // data.main.pressure
        // data.main.humidity
        // data.clouds.all
        // data.coord.lat/lon
        // data.dt (e.g. date in seconds since 1/1/1970)
        // data.sys.country
        // data.sys.sunrise
        // data.sys.sunset
        // data.visibility
        // data.weather[0].description (e.g. "light rain)
        // data.weather[0].icon
        // data.weather[0].main (e.g. "Rain", "Sunny")
        // data.wind.speed
        // data.wind.deg

        // Set metric or imperial units
        const useMetric = (this.options.units == 'metric') ? true : false;
        const speedUnit = (useMetric) ? 'km/h' : 'mph';
        const tempUnit = (useMetric) ? '&#0176;C' : '&#0176;F';

        // Rotate icon to direction of wind
        const degree = data.wind.deg;
        const windIcon = this.div.wind.childNodes[0].childNodes[0];
        windIcon.style.webkitTransform = 'rotate(' + degree + 'deg)';
        windIcon.style.mozTransform = 'rotate(' + degree + 'deg)';
        windIcon.style.msTransform = 'rotate(' + degree + 'deg)';
        windIcon.style.oTransform = 'rotate(' + degree + 'deg)';
        windIcon.style.transform = 'rotate(' + degree + 'deg)';

        // Wind speed direction
        // N = -22.5 NE = 22.5-67.5 E = 67.5-112.5
        let direction = 'N';
        if (degree > 22.5 && degree <= 67.5) {
            direction = 'NE';
        } else if (degree > 67.5 && degree <= 112.5) {
            direction = 'E';
        } else if (degree > 112.5 && degree <= 157.5) {
            direction = 'SE';
        } else if (degree > 157.5 && degree <= 202.5) {
            direction = 'S';
        } else if (degree > 202.5 && degree <= 247.5) {
            direction = 'SW';
        } else if (degree > 247.5 && degree <= 292.5) {
            direction = 'W';
        } else if (degree > 292.5 && degree <= 337.5) {
            direction = 'NW';
        }

        // Temperature value
        this.div.temperature.childNodes[0].innerHTML = Math.round(data.main.temp);

        // Wind Speed
        this.div.wind.childNodes[1].innerHTML = data.wind.speed;

        // Wind Direction
        this.div.wind.childNodes[0].childNodes[1].innerHTML = direction;

        // AQI information
        this.div.aqi.childNodes[0].innerHTML = data.aqi.data.aqi;
        this.div.aqi.childNodes[1].innerHTML = (data.aqi.data.dominentpol) ? data.aqi.data.dominentpol : 'pm25';

        // Set animation based on weather type
        let icon = this.icons[data.weather[0].main.toLowerCase()];
        if (icon == undefined) {
            icon = data.weather[0].main.toLowerCase();
        }
        this.div.icon.innerHTML = icon;

        // Display 7 day forecast
        for (let i = 0; i < 5; i++) {
            let element = this.div.forecast.childNodes[i];

            // Set date
            element.childNodes[0].innerHTML = data.forecast[i].dt_txt.slice(5, 10);

            // Set icon
            let icon = this.icons[data.forecast[i].weather[0].main.toLowerCase()];
            if (icon == undefined) {
                icon = data.forecast[i].weather[0].main.toLowerCase();
            }

            element.childNodes[1].innerHTML = icon;

            // Set temperature
            element.childNodes[2].innerHTML = Math.round(data.forecast[i].main.temp_max) + tempUnit;
            element.childNodes[3].innerHTML = Math.round(data.forecast[i].main.temp_min) + tempUnit;
        }


        // Set location of weather information (City, Country)
        this.div.location.innerHTML = data.name + ', ' + data.sys.country;
    }

    getJSON(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);

            // On succeed - parse JSON and resolve promise
            xhr.onload = (e) => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const res = xhr.responseText;
                        resolve(JSON.parse(res));
                    } else {
                        reject(xhr.statusText);
                    }
                }
            }

            // If an error occurs, return the error and reject promise
            xhr.onerror = (e) => {
                console.error(xhr.statusText);
            };
            xhr.send(null);
        });
    }

    loadFonts() {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css?family=Roboto|Shrikhand';
        link.media = 'all';
        head.appendChild(link);
    }

    loadIcons() {
        // Weather Icons
        this.icons = {};
        this.icons.cloudy = '<svg id="cloudy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 478 349.67"> <g id="sunbeams"> <g id="sb9" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="389.76" y="215.21" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(676.31 -121.46) rotate(96.1)"/> </g> <g id="sb8" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="413.12" y="121.4" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(486.79 -264.68) rotate(75)"/> </g> <g id="sb7" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="359.31" y="111.71" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(243.52 -229.99) rotate(51.1)"/> </g> <g id="sb6" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="334.65" y="18.62" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(86.25 -157.7) rotate(30)"/> </g> <g id="sb5" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="264.59" y="60.05" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(10.88 -27.95) rotate(6.1)"/> </g> <g id="sb4" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="206.49" y="1.44" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(-9.67 56.36) rotate(-15)"/> </g> <g id="sb3" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="161.08" y="90.51" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(-38.03 129.28) rotate(-38.9)"/> </g> <g id="sb2" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <rect x="103.72" y="79.92" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(-70.94 163.89) rotate(-60)"/> </g> <g id="sb1" class="sb"> <rect x="252.48" y="228.24" width="0.01" height="0.01"/> <path d="M115.65,210.53a31.61,31.61,0,0,0-7.09,5.19c-.07,0-21.33-2.21-21.33-2.21a3,3,0,0,1,.31-5.94l.33,0Z"/> </g> </g> <path id="sun" d="M347.77,228.2a95.24,95.24,0,0,1-5.05,30.7,85.29,85.29,0,0,0-30.14,2.36S283,202.43,208.4,223.85c-4-8.83-22.19-22.32-46.52-24.61a95.2,95.2,0,0,1,185.89,29Z"/> <path id="cloud" d="M438.71,339.3a9.94,9.94,0,0,1-6.32,9.91L92,349.09l-85.14.12C-5.62,346.15,1,319.72,17.13,320.46,7.7,309.26,24.46,272.76,59.7,272c-5.14-15.42,25.69-47.71,40.36-38.17A72,72,0,0,1,110,221.77a61.34,61.34,0,0,1,6-5.19l.19-.14a59.05,59.05,0,0,1,7.91-5c11.63-6.11,24.2-7.69,35.91-6.6,24.33,2.29,45,16.18,45.74,25.32,72.66-24.22,105,36.7,105,36.7,42.29-12.56,79.81,9,81.1,27.45,18-4.54,33.72,18.68,27,27.11a20.09,20.09,0,0,1,17.62,10.18A16.38,16.38,0,0,1,438.71,339.3Z"/></svg>';
        this.icons.sunny = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 462 462"> <g id="sunny-icon"> <circle id="sun" cx="231" cy="232.01" r="95.28"/> <g id="ssunbeams"> <rect id="ssb16" class="ssb" x="311.86" y="94.9" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(138.19 -165.25) rotate(37.17)"/> <rect id="ssb15" class="ssb" x="274.06" y="9.51" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(31 -73.74) rotate(16.06)"/> <rect id="ssb14" class="ssb" x="210.14" y="67.58" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(-11.03 29.93) rotate(-7.83)"/> <rect id="ssb13" class="ssb" x="148.19" y="23.7" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(-23.33 83.91) rotate(-28.94)"/> <rect id="ssb12" class="ssb" x="118.9" y="120.19" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(-69.83 155.77) rotate(-52.83)"/> <rect id="ssb11" class="ssb" x="69.22" y="122.74" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(-126.88 203.83) rotate(-73.94)"/> <rect id="ssb10" class="ssb" x="91.58" y="221.91" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(-140.12 377.61) rotate(-97.83)"/> <rect id="ssb9" class="ssb" x="83.41" y="248.61" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(-145.27 538.47) rotate(-118.94)"/> <rect id="ssb8" class="ssb" x="144.19" y="313.15" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(58.34 701.88) rotate(-142.83)"/> <rect id="ssb7" class="ssb" x="182.45" y="327.58" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(254.96 818.06) rotate(-163.94)"/> <rect id="ssb6" class="ssb" x="245.91" y="340.47" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(545.65 699.55) rotate(172.17)"/> <rect id="ssb5" class="ssb" x="308.32" y="313.38" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(765.63 556.14) rotate(151.06)"/> <rect id="ssb4" class="ssb" x="337.15" y="287.86" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(797.3 235.62) rotate(127.17)"/> <rect id="ssb3" class="ssb" x="387.29" y="214.35" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(764.92 -20.12) rotate(106.06)"/> <rect id="ssb2" class="ssb" x="364.47" y="186.14" width="5.95" height="55.96" rx="2.98" ry="2.98" transform="translate(529.5 -179.07) rotate(82.17)"/> <rect id="ssb1" class="ssb" x="373.1" y="88.48" width="5.49" height="126.93" rx="2.5" ry="2.5" transform="translate(326.97 -250.5) rotate(61.06)"/> </g> </g></svg>';
        this.icons.clouds = '<svg id="clouds-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -50 461 330.21"><path id="right-cloud" d="M450,218.67c1,0-277.33-1.34-277.33-.67-4-13,7.64-22.9,24.66-28.33-3.06-11.31,12.53-22.77,23.34-20.34,1-20.63,17.74-29.17,32-26.66,7.77-19.61,20.44-28.61,43.33-23.34,19.64-20.29,41.39-16.55,62,3,17.85-2.91,25,8.62,27.33,17.34,16.7,1.75,28,6.13,36.34,24.33,19.44,2.95,28.62,16.5,28,32C459.59,202.7,460.19,213,450,218.67Z"/><path id="left-cloud" d="M193.33,185.67c-3.06-11.31,12.53-22.77,23.34-20.34,1-19.3,15.66-28,29.22-27C225,111.31,197.31,118.89,188,126c-7.08-25.73-35.4-33-54-17.33,0-13.67-36-44-65.33-8.67C53.42,97.79,38.14,116.46,40,127.33c-19.8,6.07-22.6,26.77-21.33,33.34-17.34,8.66-14.26,33.84,8.66,29.66l154.22.34A63.9,63.9,0,0,1,193.33,185.67Z"/><path id="top-cloud" d="M137,101c18.35-15.2,45.33-6.33,52.31,18.55,10.16-7.59,47.36-11.83,61.7,17,7.67-19,22.27-28.5,44.86-23.4,19.38-19.62,40.84-16,61.17,2.91a31.58,31.58,0,0,1,7.63-.35c-3.71-11.09-13.41-23-27.87-23.39,3.87-14.85-11.13-33.35-26.41-31.29-6.89-21.15-31.56-24.65-39.22-23.76C255.25,39.1,241.72,50.48,241.24,58c-47.54-19.86-68.7,30.08-68.7,30.08-16.18-6-31.28-2.48-41.21,4.52C134.32,96.2,136,98.5,137,101Z"/></svg>';
        this.icons.thunderstorm = '<svg id="thunderstorm-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 478 349.67"><path id="cloud" d="M6.36,155.64a11.37,11.37,0,0,0,6.69,11.27l360.68-.13,90.21.13c13.22-3.48,6.21-33.54-10.88-32.7,10-12.74-7.77-54.26-45.11-55.12,5.45-17.54-27.22-54.27-42.76-43.42A80.89,80.89,0,0,0,354.65,22a66.71,66.71,0,0,0-6.35-5.9l-.21-.16a62.09,62.09,0,0,0-8.38-5.69c-12.32-6.95-25.64-8.74-38-7.5C275.88,5.3,254,21.1,253.2,31.5,176.21,4,141.94,73.24,141.94,73.24,97.13,59,57.37,83.48,56,104.47,36.94,99.3,20.28,125.71,27.4,135.3A21.07,21.07,0,0,0,8.73,146.88,19.53,19.53,0,0,0,6.36,155.64Z"/><polygon id="thunderbolt2" points="329.37 173.5 296 173 278 239 290 236.67 268 302.33 280.67 296.67 260.67 347 304.67 278.33 290 282.67 322.67 212.67 312.67 214.67 329.37 173.5"/><polygon id="thunderbolt1" points="267.23 173.71 242.26 173.33 231.67 224.03 243.02 221 225.62 275.47 234.7 272.45 212 336 248.32 257.31 240.75 258.83 261.94 206.62 255.13 207.38 267.23 173.71"/><g id="lightning-highlight"><path d="M244.06,130.46c-17.06,8.53-63.7,14.6-73.93-25.21-5.69,23.32,25,37,25,37-25-1.14-48.91-27.87-51.18-32.42-1.71,5.4,15.92,33,17.06,34.12-39.59,17.4-76.35-1.32-89.86-13.65,10.24,24.46,25,26.73,25,26.17-3.82,4.64-42.08,11.94-62.56-8C40.46,160.42,46.14,165,46.14,165l406.08-.57a21.53,21.53,0,0,0,9.1-21.61c0-1.14-4.55,19.9-36.4,4.55,10.24-1.14,22.75-12,26.16-20.48-39.81,31.28-71.66,19.91-71.66,19.91s27.3-10.24,23.89-33.56c-38.68,37.54-76.21,26.73-76.21,26.73S359,126.86,359,89.33c-5.69,22.18-50.05,50-64.84,31.84C270.22,147.34,254.3,144.11,244.06,130.46Z"/><path d="M323.31,84.78c-17.45,32.6-45.88,34.5-65.6,9.85C283.49,101.84,307,97.48,323.31,84.78Z"/><path d="M244.82,80.61c-3,24.83-26.92,32.22-44.74,13.46C219.79,101.53,231.92,100.14,244.82,80.61Z"/></g></svg>';
        this.icons.fog = '<svg version="1.1" id="fog-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 478 349.7" xml:space="preserve"><g id="fog-right"><path d="M-189,196.7c35.1-29.4,64.6-38.6,89.4-36.3c40.4,3.7,51.1,36,89.4,36c40.5,0,49-36,89.4-36c40.5,0,49,36,89.4,36s48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c38.3,0,49,32.3,89.4,36c27.7,2.5,57.5-9.5,89.4-36"/><path d="M-270,62.3c35.1-29.4,64.6-38.6,89.4-36.3c40.4,3.7,51.1,36,89.4,36c40.5,0,49-36,89.4-36c40.5,0,49,36,89.4,36s48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c38.3,0,49,32.3,89.4,36c27.7,2.5,57.5-9.5,89.4-36"/><path d="M-108,322.7c35.1-29.4,64.6-38.6,89.4-36.3c40.4,3.7,51.1,36,89.4,36c40.5,0,49-36,89.4-36c40.5,0,49,36,89.4,36s48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c40.4,0,48.9,36,89.4,36c40.4,0,48.9-36,89.4-36c38.3,0,49,32.3,89.4,36c27.7,2.5,57.5-9.5,89.4-36"/></g><g id="fog-left"><path d="M576,259.7c-35.1-29.4-64.6-38.6-89.4-36.3c-40.4,3.7-51.1,36-89.4,36c-40.5,0-49-36-89.4-36c-40.5,0-49,36-89.4,36s-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-38.3,0-49,32.3-89.4,36c-27.7,2.5-57.5-9.5-89.4-36"/><path d="M657,125.3c-35.1-29.4-64.6-38.6-89.4-36.3c-40.4,3.7-51.1,36-89.4,36c-40.5,0-49-36-89.4-36c-40.5,0-49,36-89.4,36S250.5,89,210,89c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-40.4,0-48.9,36-89.4,36c-40.4,0-48.9-36-89.4-36c-38.3,0-49,32.3-89.4,36c-27.7,2.5-57.5-9.5-89.4-36"/></g></svg>';
        this.icons.mist = this.icons.fog;

        // Placeholders
        this.icons.rain = this.icons.cloudy;
        this.icons.snow = this.icons.cloudy;
        this.icons.clear = this.icons.cloudy;
        this.icons.drizzle = this.icons.cloudy;
    }
}


// Initialize Widgets on page
//*
//const weatherWidget = new WeatherWidget(document.getElementById('weather_widget'));

//const iconDiv = document.getElementById('icon-showcase');
//for (var key in weatherWidget.icons) {
//let newIcon = document.createElement('div');
//newIcon.innerHTML = weatherWidget.icons[key];
//iconDiv.appendChild(newIcon);
//}


const weatherWidgetAbuja = new WeatherWidget(document.getElementById('weather_widget_abuja'), { units: 'metric', location: 'abuja' });