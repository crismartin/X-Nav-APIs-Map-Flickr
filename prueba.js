// create a map in the "map" div, set the view to a given place and zoom
$(document).ready(function() {

	var map = L.map('map').setView([40.2838, -3.8215], 17);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	
	// add a marker in the given location, attach some popup content to it and open the popup
	L.geoJson(features).addTo(map)
	    .bindPopup('Aulario III')
	    .openPopup();
});
