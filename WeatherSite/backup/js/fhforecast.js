const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=5585010&appid=e9d5401ed9f7451f4f1190a8ee68704b&units=imperial";
fetch(forecastURL)
    .then((response) => response.json())
    .then((jsObject) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let c = 0;
        jsObject.list.forEach(element => {
            
            const hour = element.dt_txt.substring(11, 13);
            
            if (hour == "18") {
               
                let fct = document.createElement("section");
                let h2 = document.createElement("h2");
                let h3 = document.createElement("h3");
                let image = document.createElement("img");

                fct.setAttribute('class', 'tab');
                h2.textContent = days[c];
                h3.textContent = element.main.temp + " \u00B0F";
                image.setAttribute("src", "https://openweathermap.org/img/w/" + jsObject.list[c].weather[0].icon + ".png");
                image.setAttribute("alt", jsObject.list[c].weather[0].description);
                c += 1;
               

                fct.appendChild(h2);
                fct.appendChild(image);
                fct.appendChild(h3);

                document.querySelector("div.fc").appendChild(fct);
            }
        });
    });