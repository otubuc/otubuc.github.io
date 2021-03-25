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
        if(towns[i].name == "Preston") {
        let eventspreston = document.createElement("section");
        let sp = document.createElement("div");      
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        let p3 = document.createElement("p");
        let p4 = document.createElement("p");

        eventspreston.setAttribute('class', 'events');
      p1.setAttribute('class', 'par1')
      p1.textContent = "Upcoming Events:";
      sp.setAttribute('class', 'linea');
      p2.textContent = towns[i].events[0];
      p3.textContent = towns[i].events[1];
      p4.textContent = towns[i].events[2];

      eventspreston.appendChild(p1);
      eventspreston.appendChild(sp);
      eventspreston.appendChild(p2);
      eventspreston.appendChild(p3);
      eventspreston.appendChild(p4);

      document.querySelector("div.eventspreston").appendChild(eventspreston);
        }
    }
  });