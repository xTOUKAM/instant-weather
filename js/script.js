
const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
let postalCode = document.getElementById('postalCode');

async function getCommuneByCP(postalCode) {
    let getUrlForCP = apiUrl+postalCode.value;
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
    if(data.length > 1) {
        data.forEach(commune => {
            let addingCommune = document.createElement('option');
                addingCommune.value = commune.code;
                addingCommune.textContent = commune.nom;
                communeSelect.appendChild(addingCommune);
        });
    }
}

postalCode.addEventListener("input", async () => {
    let postalCodeValue = postalCode.value;

    if (/^\d{5}$/.test(postalCodeValue)) {
        try {
            let data = await getCommuneByCP(postalCode);
            displayCommunes(data);
            console.log(postalCodeValue);
            console.log(data);
        } catch(err) {
            console.log("Erreur survenue lors de l'affichage des noms de communes : " + err.message);
        }
    }
})


