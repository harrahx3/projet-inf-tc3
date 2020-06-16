

// Création d'une carte dans la balise div "map",
// et position de la vue sur un point donné et un niveau de zoom
var map = L.map('map').setView([45.775, -102], 3.2);

// Ajout d'une couche de dalles OpenStreetMap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map);

// Fonction appelée au chargement de la page
function load_data () {

  // objet pour l'envoi d'une requête Ajax
  var xhr = new XMLHttpRequest();

  // fonction appelée lorsque la réponse à la requête (liste des lieux insolites) sera arrivée
  xhr.onload = function() {

    // transformation des données renvoyées par le serveur
    // responseText est du type string, data est une liste
    var data = JSON.parse(this.responseText);

    // boucle sur les lieux
    for ( n = 0; n < data.length; n++ ) {
      // insertion d'un marqueur à la position du lieu,
      // attachement d'une popup, capture de l'événement 'clic'
      // ajout d'une propriété personnalisée au marqueur
      L.marker([data[n].lat,data[n].lon]).addTo(map)
       .bindPopup(data[n].name)
       .addEventListener('click', OnMarkerClick)
       .idnum = data[n].id;
    }
  };

  // Envoi de la requête Ajax pour la récupération de la liste des lieux insolites
  xhr.open('GET','/location',true);
  xhr.send();
}

// Fonction appelée lors d'un clic sur un marqueur
function OnMarkerClick (e) {

  // objet pour l'envoi d'une requête Ajax
  var xhr = new XMLHttpRequest();

  // fonction appelée lorsque la réponse à la requête (description d'un lieu insolite) sera arrivée
  xhr.onload = function() {

    // transformation des données renvoyées par le serveur
    // responseText est du type string, data est un objet
    var data = JSON.parse(this.responseText);

    // affichage dans la zone 'description' du nom (reprise dans le popup)
    // et de la description récupérée par l'appel au serveur
    $("#desc_title").html('<b><i>' + e.target.getPopup().getContent() + '</i></b>');
    description.innerHTML = data.desc;
  };

  // Le numéro du lieu est récupéré via la propriété personnalisée du marqueur
  var idnum = e.target.idnum

  // Envoi de la requête Ajax pour la récupération de la description du lieu de numéro idnum
  xhr.open('GET','/description/'+idnum,true);
  xhr.send();
  $(".card").show();
}

function onMapClick(e) {
  $(".card").hide();
  //alert("You clicked the map at " + e.latlng);
}

map.on('click', onMapClick);

$(".card").hide();
//$("h1").hide();
