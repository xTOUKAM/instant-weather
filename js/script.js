const apiUrlGeo = 'https://geo.api.gouv.fr/communes?codePostal=';
const token = 'b05f0cb126dfe4edd5d71b72ee1d429986f8569870242d37e56f6f7d6a199e10';
const apiUrlMeteo = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=`;

const communeSelect = document.getElementById('communeSelect');
const getWeatherButton = document.getElementById('getWeatherButton');
const postalCode = document.getElementById('postalCode');
const daysSelect = document.getElementById('daysSelect');
const forecastContainer = document.querySelector('.forecast-container');

// Récupération des checkboxes
const checkLatitude = document.getElementById('checkLatitude');
const checkLongitude = document.getElementById('checkLongitude');
const checkAltitude = document.getElementById('checkAltitude');
const checkWind = document.getElementById('checkWind');
const checkDirection = document.getElementById('checkDiection');

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

    // Obtenir l'icône en fonction du temps
    const weatherIcon = getWeatherIcon(day);

    // Contenu de base
    let cardContent = `
        <div class="forecast-header">
            <div class="day">${label}</div>
        </div>
        <div class="forecast-content">
            <div class="weather-icon">
                ${weatherIcon} <!-- Ajout de l'icône météo -->
            </div>
            <div class="degree">
                <div class="num">Max: ${day.tmax}°C</div>
                <div class="num">Min: ${day.tmin}°C</div>
            </div>
            <span>
                <img src="images/icons8-parapluie-48.png" alt="" width="30">
                ${day.probarain}% probabilité de pluie
            </span>
            <span>
                <img src="images/icons/icons8-soleil-48.png" alt="" width="30">
                ${day.sun_hours}h d'ensoleillement
            </span>
    `;

    // Ajout des données supplémentaires si les cases sont cochées (comme avant)
    if (checkLatitude.checked) {
        cardContent += `<span>Latitude: ${day.latitude}°</span>`;
    }
    if (checkLongitude.checked) {
        cardContent += `<span>Longitude: ${day.longitude}°</span>`;
    }
    if (checkAltitude.checked) {
        cardContent += `<span>Cumul de pluie: ${day.rr10}mm</span>`;
    }
    if (checkWind.checked) {
        cardContent += `<span>Vent: ${day.wind10m} km/h</span>`;
    }
    if (checkDirection.checked) {
        cardContent += `<span>Direction du vent: ${day.dirwind10m}°</span>`;
    }

    cardContent += `</div>`;
    card.innerHTML = cardContent;

    return card;
}

// Fonction pour afficher les émoticones en fonction du temps du jour
function getWeatherIcon(weather) {
    switch (true) {
        case (weather.probarain > 60):
            return '<img src="images/icons/icon-9.svg" alt="Image de pluie">'; // Pluie
        case (weather.tmax >= 25):
            return '<img src="images/icons/icon-2.svg" alt="Image de beau temps">'; // Beau temps, chaud
        case (weather.probarain > 30 && weather.probarain <= 60):
            return '<img src="images/icons/icon-4.svg" alt="Images averses">'; // Averses
        case (weather.tmin < 0):
            return '<img src="images/icons/icon-14.svg" alt="Image nuage plus flocon">'; // Neige ou froid
        case (weather.wind10m > 50):
            return '<img src="images/icons/icon-8.svg" alt="Image de vent fort">'; // Vent fort
        default:
            return '<img src="images/icons/icon-3.svg" alt="Image de nuage avec météo variable">'; // Nuageux, météo variable
    }
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
