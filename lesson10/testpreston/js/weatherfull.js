const apiURL =
  "https://api.openweathermap.org/data/2.5/weather?id=5604473&appid=5604473&appid=e9d5401ed9f7451f4f1190a8ee68704b&units=imperial";
fetch(apiURL)
  .then((response) => response.json())
  .then((jsObject) => {
    console.log(jsObject);
    document.getElementById("wcurrent").textContent = jsObject.weather[0].main + " " + jsObject.main.temp
    document.getElementById("high").textContent = jsObject.main.temp_max;
    document.querySelector('#humidity').textContent = jsObject.main.humidity;
    document.querySelector('#wspeed').textContent = jsObject.wind.speed;
    document.querySelector('#wchill').textContent = windChill(jsObject.main.temp, jsObject.wind.speed); 
    
    function windChill(tempF, speed) {
  
      let winch = 35.74 + 0.6215 * tempF - 35.75 * (Math.pow(speed, 0.16)) + 0.4275 * tempF * (Math.pow(speed, 0.16));
      return winch.toFixed(2) + "°" + "F";
    }
        
    /*const imagesrc = "https://openweathermap.org/img/w/" + jsObject.weather[0].icon + ".png"; // note the concatenation
    const desc = jsObject.weather[0].description; // note how we reference the weather array
    document.getElementById("imagesrc").textContent = imagesrc; // informational specification only
    document.getElementById("icon").setAttribute("src", imagesrc); // focus on the setAttribute() method
    document.getElementById("icon").setAttribute("alt", desc);
    document.getElementById("current-temp").textContent = jsObject.main.temp;*/
  });