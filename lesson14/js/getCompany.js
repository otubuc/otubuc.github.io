fetch('https//github.com/otubuc/otubuc.github.io/blob/master/lesson14/lib/company.json', {
    method: "POST",
    headers: [
        ["Content-Type", "application/json"],
        ["Content-Type", "text/plain"]
    ],
    credentials: "include",
    body: JSON.stringify('1: 6')
});
Access - Control - Allow - Origin;
';'
"*"
https //github.com/otubuc/otubuc.github.io/blob/master/lesson14/lib/company.json
const requestURL = 'https://github.com/otubuc/otubuc.github.io/blob/master/lesson14/lib/company.json';
fetch(requestURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonObject) {

        const company = jsonObject['company'];
        for (let i = 0; i < company.length; i++) {
            let card = document.createElement('section');
            let container = document.createElement('div');
            let h2 = document.createElement('h2');
            let h4 = document.createElement('h4');
            let p = document.createElement('p');
            let image = document.createElement('img');

            h2.textContent = company[i].name;
            h4.textContent = company[i].address;

            p.textContent = 'services:' + company[i].services + ' ' + 'telephone: ' + company[i].telephone + " " +
                'email: ' + company[i].email + ' '
            'website:' + company[i].website + ' ';


            let src = `images/${company[i].photo}`;
            image.setAttribute('src', src);
            image.setAttribute('alt', "photo " + company[i].name);
            image.setAttribute('class', "left");


            container.appendChild(h2);
            container.appendChild(h4);
            container.appendChild(p);
            card.appendChild(container);
            card.appendChild(image);
            card.setAttribute('class', "company");
            container.setAttribute('class', "data");
            if (i % 2 == 0) {
                image.setAttribute('class', "right");
                container.setAttribute('class', "data2");

            }

            document.querySelector('div.company').appendChild(card);
        }
    });