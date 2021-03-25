const apiURL = 'https://api.openweathermap.org/data/2.5/weather?id=5678757&units=imperial&appid=e9d5401ed9f7451f4f1190a8ee68704b';
fetch(apiURL)
  .then((response) => response.json())
  .then((res) => {
    // console.log("return", res);
    document.getElementById('current').textContent = res.weather[0].main;
    document.getElementById('temperature').textContent = Math.round(res.main.temp) + ' °F';
    document.getElementById('humidity').textContent = res.main.humidity;
    document.getElementById('speed').textContent = Math.round(res.wind.speed);
    

    let temp = parseFloat(document.getElementById("temperature").innerHTML);
    let speed = parseFloat(document.getElementById("speed").innerHTML);
     
    if (temp <= 50 && speed >= 3) {
      let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    
      wc = document.getElementById("displayWindChill").innerHTML =
        Math.round(wc) + ' °F';
    } 
    
    else {
      wc = "N/A";

      document.getElementById("displayWindChill").innerHTML = wc;
    }  

    
});




const URL = 'https://api.openweathermap.org/data/2.5/forecast?id=5678757&appid=e9d5401ed9f7451f4f1190a8ee68704b&units=imperial';
fetch(URL)
  .then((response) => response.json())
  .then((res) => {
    const dayofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const fiveDays = res.list.filter((element) =>
      element.dt_txt.includes("18:00:00")
    );

    for (let i = 0; i < fiveDays.length; i++ ) {
        let d = new Date(fiveDays[i].dt_txt);
        let forecast_item = document.createElement('div');
        let day = document.createElement('div');
        let image =document.createElement('img');
        let forecastTemp = document.createElement('div');

        forecast_item.classList.add("forecast-item");

        image.setAttribute('src', 'https://openweathermap.org/img/w/' + fiveDays[i].weather[0].icon + '.png');
        day.textContent = dayofWeek[d.getDay()];
        forecastTemp.textContent = Math.round(fiveDays[i].main.temp_max) + ' °F';

        forecast_item.appendChild(day);
        forecast_item.appendChild(image);
        forecast_item.appendChild(forecastTemp);
 

        document.querySelector('div.forecast-container').appendChild(forecast_item);
    } 
    
  })