const requestURL = 'https://byui-cit230.github.io/weather/data/towndata.json';
fetch(requestURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (jsonObject) {
    
    const towns = jsonObject['towns'];
    for (let i = 0; i < towns.length; i++ ) {
        let card = document.createElement('section');
        let container = document.createElement('div');
        let h2 = document.createElement('h2');
        let h4 = document.createElement('h4');
        let p = document.createElement('p');
        let image =document.createElement('img');

        h2.textContent = towns[i].name;
        h4.textContent = towns[i].motto;
        
        p.textContent =  'Year founded:' + towns[i].yearFounded + ' ' + 'Population: ' + towns[i].currentPopulation + " " + 
        'averageRainfall: ' + towns[i].averageRainfall + ' ';
       
       
        let src =`img/${towns[i].photo}`;
        image.setAttribute('src', src);
        image.setAttribute('alt',"photo " + towns[i].name);
        image.setAttribute('class', "left");
      

        container.appendChild(h2);
        container.appendChild(h4);
        container.appendChild(p);
       card.appendChild(container);
        card.appendChild(image);
        card.setAttribute('class',"town");
        container.setAttribute('class', "data");
        if(i%2==0){
            image.setAttribute('class', "right");
            container.setAttribute('class', "data2");

        }

        document.querySelector('div.towns').appendChild(card);
}
  });
 