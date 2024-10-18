const apiUrlGeo = 'https://geo.api.gouv.fr/communes?codePostal=';
const token = 'b05f0cb126dfe4edd5d71b72ee1d429986f8569870242d37e56f6f7d6a199e10';
const apiUrlMeteo = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=`;

const communeSelect = document.getElementById('communeSelect');
const getWeatherButton = document.getElementById('getWeatherButton');
const postalCode = document.getElementById('postalCode');
const daysSelect = document.getElementById('daysSelect');
const forecastContainer = document.querySelector('.forecast-container');

// Récupère la commune en fonction du code postal
async function getCommuneByCP(postalCode) {
    const getUrlForCP = `${apiUrlGeo}${postalCode.value}`;
    try {
        const response = await fetch(getUrlForCP);
        return await response.json();
    } catch (err) {
        console.error(`Erreur lors de l'envoi de la requête à l'API : ${err}`);
    }
}

// Affiche la liste des communes
function displayCommunes(data) {
    communeSelect.innerHTML = "";
    const fragment = document.createDocumentFragment();

    if (data.length) {
        communeSelect.style.display = 'block';
        getWeatherButton.style.display = 'block';

        data.forEach(commune => {
            const option = document.createElement('option');
            option.value = commune.code;
            option.textContent = commune.nom;
            fragment.appendChild(option);
        });

        communeSelect.appendChild(fragment);
    } else {
        postalCode.value = "";
        communeSelect.style.display = 'none';
        getWeatherButton.style.display = 'none';
    }
}

// Récupère et affiche la météo
async function getWeather(communeValue) {
    const getUrlForMeteo = `${apiUrlMeteo}${communeValue}`;
    try {
        const response = await fetch(getUrlForMeteo);
        return await response.json();
    } catch (err) {
        console.error(`Erreur lors de l'envoi de la requête à l'API : ${err}`);
    }
}

// Fonction pour récupérer le jour de la semaine en fonction d'une date
function getDayOfWeek(dateString) {
    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
}

// Met à jour l'affichage de la météo
function updateWeatherDisplay(data) {
    const { forecast } = data;
    const numDays = parseInt(daysSelect.value);
    const locationName = communeSelect.options[communeSelect.selectedIndex].text;

    const fragment = document.createDocumentFragment();

    // Affichage du jour actuel (aujourd'hui)
    fragment.appendChild(createWeatherCard(forecast[0], 'Aujourd\'hui'));

    // Affichage des jours suivants
    for (let i = 1; i < numDays; i++) {
        // Récupérer la date du jour en question
        const dayOfWeek = getDayOfWeek(forecast[i].datetime);
        fragment.appendChild(createWeatherCard(forecast[i], dayOfWeek));
    }

    // Remplacer le contenu
    forecastContainer.innerHTML = '';
    forecastContainer.appendChild(fragment);
}


// Crée une carte météo pour un jour donné
function createWeatherCard(day, label) {
    const card = document.createElement('div');
    card.classList.add('forecast');

    card.innerHTML = `
        <div class="forecast-header">
            <div class="day">${label}</div>
        </div>
        <div class="forecast-content">
            <div class="degree">
                <div class="num">Max: ${day.tmin}°C</div>
                <div class="num">Min: ${day.tmax}°C</div>
            </div>
            <span>
                <img src="images/icons8-parapluie-48.png" alt="" width="30">
                ${day.probarain}%
            </span>
            <span>
                <img src="images/icons/icons8-soleil-48.png" alt="" width="30">
                ${day.sun_hours}h
            </span>
        </div>
    `;

    return card;
}

// Gestion de l'entrée du code postal
postalCode.addEventListener("input", async () => {
    const postalCodeValue = postalCode.value;
    if (/^\d{5}$/.test(postalCodeValue)) {
        try {
            const data = await getCommuneByCP(postalCode);
            displayCommunes(data);
        } catch (err) {
            console.error(`Erreur survenue lors de l'affichage des noms de communes : ${err.message}`);
        }
    }
});

// Gestion de l'affichage de la météo
getWeatherButton.addEventListener('click', async () => {
    const communeValue = communeSelect.value;
    try {
        const data = await getWeather(communeValue);
        updateWeatherDisplay(data);
    } catch (err) {
        console.error(`Erreur lors de l'envoi de la requête à l'API : ${err}`);
    }
});
