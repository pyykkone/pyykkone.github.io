// Global variables

var markersLayer;
var map;
var markers;


// Functions


function initMap(x=65,y=25) { 

	map = L.map('mapContainer');
	
	// NOTE: Layer is created here!
	var markers = [];
//	markersLayer = new L.LayerGroup(); 
	markersLayer = new L.featureGroup(); 
	//markersLayer.on('click',alert('markerclick'))
	
	
	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data Â© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15, attribution: osmAttrib});		
	
	// start the map in Pasila
	map.setView(new L.LatLng(x,y),5);
	map.addLayer(osm);

	//map.on('click', onMapClick);
}




// MarkerClick 

t=[];
function markerClick(markerID) {
	
	// Get marker info by ID
	marker=enviromentalPermits.filter(function(x) { return(x['asiaID']==markerID) })[0];
	
	

	console.log(marker)
	$('#infoContainer').html('<ul id="permitInfo"></ul>')
//	$('<table id="permitInfoTable"></table>').insertAfter('')
	//$('<thead><tr><th>Asia</th></tr><tr><th></thead>').appendTo('#permitInfo')
	list='<li>'+ marker['asia'] + '</li>';
	list+='<li>'+ marker['type'] + '</li>';
	//list+='<li>'+ marker['luvanMyontaja'] + '</li>';
	list+='<li>'+ marker['hakija'] + '</li>';
	
	$('#permitInfo').hide().append(list).fadeIn('slow');
	
}



function mapPermits(permits) {
	
	// Clear previous mappings
	markersLayer.clearLayers();
	
	
	permits.forEach(function(item,index) { 
		popUpString="Luvan haltija: "+item['asia']+"<br>";
		popUpString+="Tyyppi: "+item['type']+"<br>";
		popUpString+="Myöntäjä: "+item['luvanMyontaja']+"<br>";
		
		y=item['lon']//[0];		
		x=item['lat']//[1];
		//marker=L.marker([x, y],riseOnHover=true ).bindPopup(popUpString)
		marker=L.marker([x, y],riseOnHover=true ).bindPopup(popUpString)
		.on('mouseover',   function() { markerClick(item['asiaID']) })
		markersLayer.addLayer(marker); 
	});
	
	markersLayer.addTo(map);
	
	
}


// jQuery

$(document).ready(function() {
	
	// Init leafletmap
	initMap();
	
	// Load permits from example .js file by adding a script element to document
	/*
	$(document.createElement('script'))
		.attr('src', '/temp/example_permitdata.js')
		.appendTo('head');
	*/
	
	// Plot permits on map 
	mapPermits(enviromentalPermits);
	
	
	
});