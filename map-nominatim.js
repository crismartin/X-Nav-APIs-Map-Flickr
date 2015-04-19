function addrSearch() {
    var inp = document.getElementById("addr");
    
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
	var items = [];
	coords = [];
	$.each(data, function(key, val) {
	    coords.push({"lat": val.lat,
			 "lon": val.lon,
			 "type": val.type
			}
		       );
	    items.push(
		"<li id=\"" + key + "\">" + val.display_name + "</li>"
	    );
	});
	$('#results').empty();
	if (items.length != 0) {
	    $('<p>', { html: "Search results:" }).appendTo('#results');
	    $('<ul/>', {
		'class': 'my-new-list',
		html: items.join('')
	    }).appendTo('#results');
	} else {
	    $('<p>', { html: "No results found" }).appendTo('#results');
	}
	$('<p>', { html: "<button id='close' type='button'>Close</button>" }).appendTo('#results');
	$('#results').on('click', 'li', chooseAddr);
	$("#close").click(removeResults);
    });    

    fotoSearch();
}


function fotoSearch() {
	var inp = document.getElementById("addr");	
	removeFotos();
	console.log(inp.value);

	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
	$.getJSON( flickerAPI, {
		tags: inp.value,
		tagmode: "any",
		format: "json"
	}).done(function( data ) {
		$.each( data.items, function( i, item ) {
	        $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
	        if ( i === 3 ) {
	          return false;
	        }
	      });
	});
};

function removeFotos() {
    $("#images").empty();
}

function removeResults() {
    $("#results").empty();
}

function chooseAddr() {
    var coord = coords[$(this).index()];
		       
    var location = new L.LatLng(coord.lat, coord.lon);
    map.panTo(location);

    if (coord.type == 'city' || coord.type == 'administrative') {
	map.setZoom(10);
    } else {
	map.setZoom(14);
    }
}


$(document).ready(function() {

    $("div#search button").click(addrSearch);

    // Create a map in the "map" div
    map = L.map('map');
    // Add an OpenStreetMap tile layer
    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(map);
    // Add a MapQuest map
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
	attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
    }).addTo(map);

    // Show lat and long at cliked (event) point, with a popup
    var popup = L.popup();
    function showPopUp(e) {
	popup
            .setLatLng(e.latlng)
            .setContent("Coordinates: " + e.latlng.toString())
            .openOn(map);
    }
    // Subscribe to the "click" event
    map.on('click', showPopUp);

    // Show a circle around current location
    function onLocationFound(e) {
	var radius = e.accuracy / 2;
	L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius +
		       " meters from this point<br/>" +
		       "Coordinates: " + e.latlng.toString())
	    .openPopup();
	L.circle(e.latlng, radius).addTo(map);
    }
    // Subscribe to the "location found" event
    map.on('locationfound', onLocationFound);

    // Show alert if geolocation failed
    function onLocationError(e) {
	alert(e.message);
    }
    // Subscribe to the "location error" event
    map.on('locationerror', onLocationError);

    // Set the view to current location
    map.locate({setView: true, maxZoom: 16});        
});
