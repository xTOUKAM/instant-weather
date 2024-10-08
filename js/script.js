
const apiUrlGeo = 'https://geo.api.gouv.fr/communes?codePostal=';
const token = 'b05f0cb126dfe4edd5d71b72ee1d429986f8569870242d37e56f6f7d6a199e10';
const apiUrlMeteo = 'https://api.meteo-concept.com/api/forecast/daily?token='+ token +'&insee=35238';
const communeSelect = document.getElementById('communeSelect');
let postalCode = document.getElementById('postalCode');

async function getCommuneByCP(postalCode) {
    let getUrlForCP = apiUrlGeo+postalCode.value;
    try {
        const response = await fetch(getUrlForCP);
        console.log(getUrlForCP);
        const data = await response.json();
        return data;
    } catch(err) {
        console.log("Erreur lors de l'envoie de la requête à l'API : " + err);
    }
}

function displayCommunes(data) {
    communeSelect.innerHTML = "";
    if(data.length >= 1) {
        communeSelect.style.display = 'block';
        data.forEach(commune => {
            let addingCommune = document.createElement('option');
                addingCommune.value = commune.code;
                addingCommune.textContent = commune.nom;
                communeSelect.appendChild(addingCommune);
        });
    }

    if(data.length === 0) {
        postalCode.value = "";
        communeSelect.style.display = 'none';
    }
}

postalCode.addEventListener("input", async () => {
    let postalCodeValue = postalCode.value;

    if (/^\d{5}$/.test(postalCodeValue)) {
        try {
            let data = await getCommuneByCP(postalCode);
            displayCommunes(data);
        } catch(err) {
            console.log("Erreur survenue lors de l'affichage des noms de communes : " + err.message);
        }
    }
})




