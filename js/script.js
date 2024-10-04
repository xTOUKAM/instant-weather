
const apiUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
let postalCode = document.getElementById('postalCode').value;
let url = apiUrl + postalCode;

async function getCommuneByCP() {
    try {
        const response = await fetch(url);
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
        })
    } else {
        alert("Aucune commune avec ce code postal !");
    }
}


