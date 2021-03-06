// Global variables

var markersLayer;
var map;
var markers;

var help;


// Functions


function initMap(x=65.5,y=25,zoomLevel=5) { 

	map = L.map('mapContainer');
	
	// NOTE: Layer is created here!
	var markers = [];
//	markersLayer = new L.LayerGroup(); 
	markersLayer = new L.featureGroup(); 
	//markersLayer.on('click',alert('markerclick'))
	
	
	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 1, maxZoom: 15, attribution: osmAttrib});		
	
	// start the map in Pasila
	map.setView(new L.LatLng(x,y),zoomLevel);
	map.addLayer(osm);

	//map.on('click', onMapClick);
}






// MarkerClick 


function markerClick(markerID) {
	
	// Get marker info by ID
	marker=enviromentalPermits.filter(function(x) { return(x['rowID']==markerID) })[0];
	
	// Get names of properties of marker
	
	props = Object.getOwnPropertyNames(marker);
	
	
	
	props = props.filter(function(x) { return(x!='lon' & x!='lat' & x!='rowID' & x!='searchString' ) })
	
	// Get rid of weird lat
	props = props.filter(function(x) { return( !(x.substr(0,3)=='lat' & x.length==4 )) })

	// Add each property to list 
	

	$('#infoContainer').html('<ul id="permitInfo"></ul>');
	
	for (var i=0;i<props.length;i++) {
		
		
		list = '<li>'+ marker[props[i]] + '</li>';
		
		$('#permitInfo').append(list)
		
		
	}
	$('#permitInfo').hide().fadeIn('slow');
	
	
	
//	$('<table id="permitInfoTable"></table>').insertAfter('')
	//$('<thead><tr><th>Asia</th></tr><tr><th></thead>').appendTo('#permitInfo')
	//list='<li>'+ marker['nimi'] + '</li>';
	//list+='<li>'+ marker['kayntiosoite'] + '</li>';
	//list+='<li>'+ marker['luvanMyontaja'] + '</li>';
	//list+='<li>' + 'Kuntakoodi: ' + marker['kuntakoodi'] + '</li>';
	//list+='<li>' + 'Koordinaatit: ' + marker['lon']+', '+marker['lat'] + '</li>';
	
	//list+='<li>'+ '<a href="https://tietopalvelu.ahtp.fi/Lupa/Lisatiedot.aspx?Asia_ID=' + marker['rowID'] +'" target="_blank">Luvan tiedot</a>' + '</li>'
	
	//$('#permitInfo').hide().append(list).fadeIn('slow');
	
}



function mapPermits(permits) {
	
	// Clear previous mappings
	markersLayer.clearLayers();
	
	
	permits.forEach(function(item,index) { 
		//popUpString="Nimi: "+item['nimi']+"<br>";
		//popUpString+="Osoite: "+item['kayntiosoite']+"<br>";
		//popUpString+='Lon, lat: ' +item['lon']+', '+item['lat']+  "<br>";
		
		popUpString="Longitude: "+item['lon']+"<br>";
		popUpString+="Latitude: "+item['lat']+"<br>";
		
		y=item['lon']//[0];		
		x=item['lat']//[1];
		
		marker=L.marker([x, y],riseOnHover=true ).bindPopup(popUpString)
		.on('mouseover',   function() { markerClick(item['rowID']);  })
		
		marker['rowId'] = item['rowID'];
		markersLayer.addLayer(marker); 
	});
	
	markersLayer.addTo(map);
	
	
}

// CSV-parser



function parsiCSV(textRaw) {
	
	// Split into rows
	rows = textRaw.split("\n");	
	
	// List columns assuming to first line is a header line
	cols = rows[0].split(';');
	//cols = cols.map(function(x) { return(x.replace('\n','')) })
	
	// Log rows vs column
	console.log('Rivej�: ' +  rows.length);
	console.log('Sarakkeita: ' +  cols.length);
	
	// Drop quotation marks if used in data
	cols = cols.map(function(x) { return(x.replace(/"/g,'')) });
    rows = rows.map(function(x) { return(x.replace(/"/g,'')) });
	
    // Create an array of objects (one row = one object)
	output = rows.map(function(x,mapIndex) {

		// Empty object
		rtrn = {}
		
		rtrn['searchString'] = '';
		
		// Add cols
		for (var i=0;i<cols.length;i++) {
				
				// Add properties to object from each column
				rtrn[cols[i]] = x.split(';')[i];
				
				// Add property to search string enabling the search
				rtrn['searchString'] += x.split(';')[i];
				
				
				// Convert coordinates to numbers
				if (cols[i]=='lon') {					
					rtrn['lon'] = Number(x.split(';')[i]);
				}
				// This due to the fact that the last column gets quotes around it perhaps due to row change
				if (cols[i].substr(0,3)=='lat') {
					
					rtrn['lat'] = Number(x.split(';')[i]);
					
				}
				if (cols[i].substr(0,3)=='lon') {
					
					rtrn['lon'] = Number(x.split(';')[i]);
					
				}
				
		}
		// Add id based on index to identity each marker
		rtrn['rowID'] = mapIndex;
		
		
		return(rtrn);
	 });

	// Drop first of array as is object derived of columns
	output.shift();
	
	// Drop last of array as it is an empty row due to a row change
	output.splice(-1,1)

	// Return objects
	return(output)
	
}


// Conversion from EPSG3067 to WGS84

function coordConversion(x,y) {
	
	// -3.04805394167 * ( 0.00000947239 * pkoord)
	// 18.01485463946 * ( 0.00001792491 * ikoord)
	
	x =  -3.04805394167 + ( 0.00000947239 * x);
	y = 18.01485463946  + ( 0.00001792491 * y);
	
	return({ x: x,y: y});
	
}




// jQuery

$(document).ready(function() {
	
	// Init leafletmap
	initMap();
	
	
	// Choose WGS84 initially
	
	$('#coord_WGS84').addClass('selected');
	
	// Add event listener
	
	$('.checkbox').bind( "click", function(e) {  
	
		$('.selected').removeClass('selected');
		$( this ).toggleClass( "selected" ); 
		
		if ( $(this).attr('id')  ) {
			
			//alert('Koordinaatit konvertoidaan WGS84-muotoon seuraavalla kaavalla:');
			
		}
		
	});
	// Add eventlistener to searchbox
	
	//$('#searchBox').click( function(x) { console.log('this!'); $(this).attr('value')=''; });
	
	
	$('#searchBox').keydown(function(e) {
						if (e['keyCode']==13) { // Enter
							console.log('KEY DOWN');
							hakusana = $(this)[0].value.toLowerCase();
							
							
							// Search
							tulokset = enviromentalPermits.filter(function(x) { return(x['searchString'].toLowerCase().indexOf(hakusana)>-1) });
							// Get ids of results
							tulokset = tulokset.map(function(x) { return(x['rowID']) })
							
							help = tulokset;
							
							console.log(tulokset.length);
							if (tulokset.length==0) { 
								alert('No permits found');
							};

							map.eachLayer(function(x){
								
											//if (x.rowId==tulokset[0].rowID) { x.openPopup()  }
											if (tulokset.indexOf(x.rowId)>-1) {
												x.openPopup();
												//x.valueOf()._icon.style.fill = 'green';
											}
										});
							
							
							markerClick(tulokset[0]);
							
						}
	})
	
	
	//enviromentalPermits.filter(function(x) { return(x['dnro'].indexOf(hakusana)>-1) })
	
	enviromentalPermits=[];
	
	
	// Plot permits on map 
	// mapPermits(enviromentalPermits);
	
     // Add event listerner to file input
	var fileInput = document.getElementById('fileInput');
    
	fileInput.addEventListener('change', function(e) {
		
		var file = fileInput.files[0];

			var reader = new FileReader();

			reader.onload = function(e) {
			
				enviromentalPermits=parsiCSV(reader.result);
				
				
				//  Coord conversion if necessary
				if ( $('.selected').attr('id') == 'coord_EPSG3067') {
					alert('Koordinaatit konvertoidaan WGS84-muotoon seuraavilla kaavoilla: 	\n -3.04805394167 + ( 0.00000947239 * pkoord) \n	18.01485463946 + ( 0.00001792491 * ikoord)');
					
					for (var i=0;i<enviromentalPermits.length;i++) {
						
						tmp = coordConversion( enviromentalPermits[i].lat, enviromentalPermits[i].lon );
						
						enviromentalPermits[i].lat = tmp.x;
						enviromentalPermits[i].lon = tmp.y;
						
						
					}
					

				}				
				// Set map focus based on mean of lon & lat
				
				lon_mean = enviromentalPermits.map(function(x) { return(x['lon']) }).reduce(function(x,y) {  return x+y; }) / enviromentalPermits.length;
				lat_mean = enviromentalPermits.map(function(x) { return(x['lat']) }).reduce(function(x,y) {  return x+y; }) / enviromentalPermits.length
				
				// Set view 
				zoomLevel = 8;
				map.setView(new L.LatLng(lat_mean,lon_mean),zoomLevel);
				
				mapPermits(enviromentalPermits);
			}

			reader.readAsText(file,"ISO-8859-1");	

	});
	
});