const apiURL =
    "https://api.openweathermap.org/data/2.5/weather?id=2352778&cityid=2352778&appid=e9d5401ed9f7451f4f1190a8ee68704b&units=metric";
fetch(apiURL)
    .then((response) => response.json())
    .then((jsObject) => {
        //console.log(jsObject);
        document.getElementById("wcurrent").textContent = jsObject.weather[0].main + " " + jsObject.main.temp
        document.getElementById("high").textContent = jsObject.main.temp_max;
        document.querySelector('#humidity').textContent = jsObject.main.humidity;
        document.querySelector('#wspeed').textContent = jsObject.wind.speed;
        document.querySelector('#wchill').textContent = windChill(jsObject.main.temp, jsObject.wind.speed);

        function windChill(tempF, speed) {

            let winch = 35.74 + 0.6215 * tempF - 35.75 * (Math.pow(speed, 0.16)) + 0.4275 * tempF * (Math.pow(speed, 0.16));
            return winch.toFixed(2) + "°" + "C";
        }

    });