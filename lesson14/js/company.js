const requestURL = "https://github.com/otubuc/otubuc.github.io/blob/master/company.json";

fetch(requestURL)
    .then(function(response) {
        return response.json();
    })

.then(function(jsonObject) {
    // check for json object
    // console.table(jsonObject);

    const company = jsonObject['company'];

    // loop through the array
    for (let i = 0; i < company.length; i++) {
        // declare each variable
        let card = document.createElement('section');
        let h2 = document.createElement('h3');
        let services = document.createElement('h5');
        let address = document.createElement('p');
        let website = document.createElement('p');
        let email = document.createElement('p');
        let image = document.createElement('images');
        let textd = document.createElement('div')

        // What each card will have, contatenation of the strings, declaring classes to make CSS easier
        if (company[i].name == 'Cambridge Prep School' || company[i].name == 'MTN Nigeria Limited' || company[i].name == 'Next cash & carry' || company[i].name == 'Zenith Bank PLC' || company[i].name == 'Regent Primary School' || company[i].name == 'Ethel Ventures Limited' || company[i].name == 'Oxford Manor College' || company[i].name == 'Chicken Republic' || company[i].name == 'CloudTen Telecoms') {
            console.log(company[i].photo);

            h2.textContent = company[i].name;
            services.textContent = "Company Services:" + " " + company[i].services;
            website.textContent = "Year Established:" + " " + company[i].website;
            email.textContent = "email address:" + " " + company[i].email;
            telephone.textContent = "company telephone:" + " " + company[i].telephone;
            image.setAttribute('src', `images/${company[i].photo}`);
            image.setAttribute('alt', company[i].name);
            image.setAttribute('class', 'companyimg');
            card.setAttribute('class', "home_sect");
            textd.setAttribute('class', 'home_company_text');

            // build the display by updating as I loop through. Use an "if" statement to select just the towns I want.
            // if (towns[i].name == 'Preston'|| towns[i].name == 'Fish Haven' || towns[i].name == 'Soda Springs') {
            card.appendChild(textd);
            textd.appendChild(h2);
            textd.appendChild(services);
            textd.appendChild(website);
            textd.appendChild(email);
            textd.appendChild(telephone);
            card.appendChild(image);
        } else {
            card.setAttribute('class', 'home_hide');
        }

        document.querySelector('div.company_div').appendChild(card);
    }
});