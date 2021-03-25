const upcomingURL =
  "https://byui-cit230.github.io/weather/data/towndata.json";

fetch(upcomingURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonObject) {
    console.table(jsonObject); // temporary checking for valid response and data parsing
    const towns = jsonObject["towns"];
    for (let i = 0; i < towns.length; i++) {
        if(towns[i].name == "Fish Haven") {
        let efishhaven = document.createElement("section");
        let sp = document.createElement("div");      
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        let p3 = document.createElement("p");
        let p4 = document.createElement("p");
        let p5 = document.createElement("p");

        efishhaven.setAttribute('class', 'events');
      p1.setAttribute('class', 'par1')
      p1.textContent = "Upcoming Events:";
      sp.setAttribute('class', 'linea');
      p2.textContent = towns[i].events[0];
      p3.textContent = towns[i].events[1];
      p4.textContent = towns[i].events[2];
      p5.textContent = towns[i].events[3];

      efishhaven.appendChild(p1);
      efishhaven.appendChild(sp);
      efishhaven.appendChild(p2);
      efishhaven.appendChild(p3);
      efishhaven.appendChild(p4);
      efishhaven.appendChild(p5);

      document.querySelector("div.efishhaven").appendChild(efishhaven);
        }
    }
  });