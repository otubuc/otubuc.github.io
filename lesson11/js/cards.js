const requestURL = 'https:////byui-cit230.github.io/weather/data/towndata.json';
fetch(requestURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonObject) {
        // console.table(jsonObject);  // temporary checking for valid response and data parsing
        const towns = jsonObject['towns'];
        towns.forEach(town => {
            if (town.name == "Preston" || town.name == "Soda Springs" || town.name == "Fish Haven") {
                let card = document.createElement('article')
                let div = document.createElement('div')
                let h2 = document.createElement('h2');
                let h3 = document.createElement('h3');
                let p1 = document.createElement('p');
                let p2 = document.createElement('p');
                let p3 = document.createElement('p');
                let image = document.createElement('img');

                div.setAttribute('class', 'tInfo')
                h2.textContent = town.name;
                h2.setAttribute('class', 'tName');
                h3.textContent = town.motto;
                h3.setAttribute('class', 'tMoto');
                p1.textContent = "Year Founded: " + town.yearFounded;
                p2.textContent = "Population: " + town.currentPopulation;
                p3.textContent = "Average Rain Fall: " + town.averageRainfall;
                image.setAttribute('src', `images/${town.photo}`);
                image.setAttribute('alt', town.name);

                div.appendChild(h2);
                div.appendChild(h3);
                div.appendChild(p1);
                div.appendChild(p2);
                div.appendChild(p3);
                card.appendChild(div);
                card.appendChild(image);

                document.querySelector('div.cards').appendChild(card);
            }
        });

    });