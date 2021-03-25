const requestURL = "https://byui-cit230.github.io/weather/data/towndata.json";

fetch(requestURL)
    .then(function (response) {
        return response.json();
    })

.then(function (jsonObject) {
    // check for json object
    // console.table(jsonObject);

const towns = jsonObject['towns'];
    
// loop through the array
for (let i=0; i < towns.length; i++) {
    // declare each variable
    let card = document.createElement('section');
    let h2 = document.createElement('h3');
    let motto = document.createElement('h5');
    let year = document.createElement('p');
    let pop = document.createElement('p');
    let rain = document.createElement('p');
    let image = document.createElement('img');
    let textd = document.createElement('div')
    
    // What each card will have, contatenation of the strings, declaring classes to make CSS easier
    if (towns[i].name == 'Preston'|| towns[i].name == 'Fish Haven' || towns[i].name == 'Soda Springs') {
        console.log(towns[i].photo);
    
    h2.textContent = towns[i].name;
    motto.textContent = "Town Motto:" + " " + towns[i].motto;    
    year.textContent = "Year Established:" + " " + towns[i].yearFounded;
    pop.textContent = "Current Population:" + " " + towns[i].currentPopulation;
    rain.textContent = "Annual Rainfall:" + " " +  towns[i].averageRainfall;
    image.setAttribute('src', `images/${towns[i].photo}`);
    image.setAttribute('alt', towns[i].name);
    image.setAttribute('class', 'townimg');
    card.setAttribute('class', "home_sect" );
    textd.setAttribute('class', 'home_town_text');

    // build the display by updating as I loop through. Use an "if" statement to select just the towns I want.
    // if (towns[i].name == 'Preston'|| towns[i].name == 'Fish Haven' || towns[i].name == 'Soda Springs') {
        card.appendChild(textd);
        textd.appendChild(h2);
        textd.appendChild(motto);
        textd.appendChild(year);
        textd.appendChild(pop);
        textd.appendChild(rain);
        card.appendChild(image);}

    else {
        card.setAttribute('class', 'home_hide');
    }
        
     document.querySelector('div.town_div').appendChild(card);
}
});
