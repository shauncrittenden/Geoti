function Geo(fixture){
	this.db = fixture;
	this.mapStyles = [
		{ featureType: "poi",            elementType: "geometry", stylers: [{ visibility: "off" }] },
		{ featureType: "all",            elementType: "labels",   stylers: [{ visibility: "off" }] },
		{ featureType: "road",           elementType: "all",      stylers: [{ visibility: "off" }] },
		{ featureType: "water",          elementType: "labels",   stylers: [{ visibility: "off" }] },
		{ featureType: "administrative", elementType: "all",      stylers: [{ visibility: "off" }] },
		{ featureType: "transit",        elementType: "all",      stylers: [{ visibility: "off" }] },
		{ featureType: "landscape",      elementType: "all",
			stylers: [
				{ hue: "#141b23" }, //#656f71
				{ saturation: 10 }, // -78
				{ lightness: -90 }, // -55
			]
		},
		{ featureType: "water", elementType: "all",
			stylers: [
				{ hue: "#1d2732" }, //{ hue: "#1d2732" },
				{ saturation: -42 },
				{ lightness: -79 }//,
				//{ visibility: "off" }
			]
		}
	];
	this.markers = [];
	this.clear_delay = 300;

	this.init_map();
}

Geo.prototype.init_map = function(callback){
	var t = this,
		loc = new google.maps.LatLng(50, 0),
		mapOptions = {
			scrollwheel: false,
			navigationControl: false,
			draggable: true,
			scaleControl: false,
			streetViewControl: false,
			printControl: false,
			zoom: 2,
			center: loc,
			mapTypeControlOptions: {
			mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'hiphop']
			}
		};
	
	// initialize map
	t.map = new google.maps.Map(document.getElementById("map"),mapOptions);
	
	// set styles with map
	var theMap = new google.maps.StyledMapType(t.mapStyles);
	t.map.mapTypes.set('mymap', theMap);
	t.map.setMapTypeId('mymap');
	t.set_bounds();
	
	t.visual_covers();
	
	//t.plot_marker(24.75585080425469, -69.78515625, "z-index test");
	
	//t.get_user_location();
	
	//t.plot_all();
	
	//t.plot_marker(33.6753,-106.4747,"test");
	//t.plot_marker(0,0,"0,0 Test Marker");
	
	mapClick = google.maps.event.addListener(t.map, 'click', function(e) {
        $('#debug').text(e.latLng.Ma + ', ' + e.latLng.Na);
    });
	
};

Geo.prototype.visual_covers = function(){
	var t = this;
	
	// antartica cover
	t.drawRect(
		new google.maps.LatLngBounds(new google.maps.LatLng(-60,-179.99999999999), new google.maps.LatLng(-100,180)),
		'#1e2833'
		,1
	);

	// prime meridian
	t.drawRect(new google.maps.LatLngBounds(new google.maps.LatLng(-90,-0.2), new google.maps.LatLng(90,0.2)),'#12171e',.2);
	
	// equator
	t.drawRect(new google.maps.LatLngBounds(new google.maps.LatLng(-0.2,-179.9), new google.maps.LatLng(0.2,179.9)),'#12171e',.2);
	
	/*
	t.drawLine({
		color: '#ff0000',
		coords: [
			new google.maps.LatLng(0, 160),
			new google.maps.LatLng(0, -160)
        ]
	});
	*/
};


Geo.prototype.drawLine = function(a){
	var t = this,
		coords = a.coords;
		
	var line = new google.maps.Polyline({
		path: coords,
		strokeColor: a.color,
		strokeOpacity: 1,
		strokeWeight: 1
	});
	
	line.setMap(t.map);
};


Geo.prototype.drawRect = function(coords, fill, opacity){
	var t = this,
		shape,
		shapeCoords = coords;
	
	shape = new google.maps.Rectangle({
		bounds: coords,
		strokeColor: fill,
		strokeOpacity: 0,
		strokeWeight: 0,
		fillColor: fill,
		fillOpacity: opacity,
		clickable: false
	});
	
	shape.setMap(t.map);
};


Geo.prototype.drawPoly = function(coords, fill, opacity){
	var t = this,
		shape;
	
	shape = new google.maps.Polygon({
		paths: coords,
		strokeColor: fill,
		strokeOpacity: 0,
		strokeWeight: 0,
		fillColor: fill,
		fillOpacity: opacity,
		clickable: false
	});
	
	shape.setMap(t.map);
};


Geo.prototype.set_bounds = function(){
	var t = this,
		allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60,-100), new google.maps.LatLng(72,100));
	
	google.maps.event.addListener(t.map,'center_changed',function() { checkBounds(); });

	function checkBounds() {    
	    if(! allowedBounds.contains(t.map.getCenter())) {
			var C = t.map.getCenter();
			var X = C.lng();
			var Y = C.lat();
			
			var AmaxX = allowedBounds.getNorthEast().lng();
			var AmaxY = allowedBounds.getNorthEast().lat();
			var AminX = allowedBounds.getSouthWest().lng();
			var AminY = allowedBounds.getSouthWest().lat();
			
			if (X < AminX) {X = AminX;}
			if (X > AmaxX) {X = AmaxX;}
			if (Y < AminY) {Y = AminY;}
			if (Y > AmaxY) {Y = AmaxY;}
			
			t.map.setCenter(new google.maps.LatLng(Y,X));
	     }
	}	
};

Geo.prototype.plot_marker = function(lat, lon, message){
	var t = this,
		coords = new google.maps.LatLng(lat, lon),
		image = new google.maps.MarkerImage(
			'assets/i/marker.png',
			new google.maps.Size(17, 22), // dimension
			new google.maps.Point(0, 0), // origin
			new google.maps.Point(8, 21) // offset
		),
		shadow = new google.maps.MarkerImage('assets/i/shadow.png',
			new google.maps.Size(35, 22), // dimension
			new google.maps.Point(0, 0), // origin
			new google.maps.Point(2, 14) // offset
		),
		shape = {
			coord: [1,1, 1,20, 18,20, 18, 1],
			type: 'poly'
		}; // clickable area
	
	var marker = new google.maps.Marker({
		position: coords, 
		map: t.map, 
		icon: image,
		shape: shape,
		shadow: shadow,
		title: message
	});
	
	/*google.maps.event.addListener(marker, 'click', function() {
	    console.log(message);
	    var infoBox = new InfoBox({latlng: marker.getPosition(), map: map, message: message});
	});
	*/
	
	var delayWipe = window.setTimeout(function(){
		marker.setMap(null);
	},t.clear_delay);
	
	//beep();

	this.markers.push(marker);

};



Geo.prototype.plot_match = function(day, month, year){
	var t = this;;
	
	// this.clear_markers();
	
	if (day == 1) {
		tick();
	}
	
	$(t.db).each(function(i,o){
		var eDay = o.date.substr(8,2),
			eMonth = o.date.substr(5,2),
			eYear = o.date.substr(0,4);
		
		if ( month == parseInt(eMonth,10) && year == parseInt(eYear,10) && day == parseInt(eDay,10) ) {
			//console.log(o.name , o.date, o.latitude + ' ' + o.longitude);
			
			$('#log ol').append('<li>' + o.name + ' : ' + month + '/' + day + '/' + year + '</li>');
			
			// scroll to bottom of log
			var nHeight = $('#log ol').prop("scrollHeight");
			console.log(nHeight);
			$('#log ol').stop(true,true).animate({scrollTop : nHeight},500);
			
			beep();
			
			t.plot_marker(o.latitude, o.longitude, o.name);
				
		}
	});
};



Geo.prototype.plot_all = function(){
	var t = this;
	
	$(t.db).each(function(i,o){
		var eDay = o.date.substr(8,2),
			eMonth = o.date.substr(5,2),
			eYear = o.date.substr(0,4);
			
		t.plot_marker(o.latitude, o.longitude, o.name);
		
		$('#log ol').append('<li>' + o.name + ' : ' + eMonth + '/' + eDay + '/' + eYear + '</li>');
	});
};



Geo.prototype.get_user_location = function(){
	var lat = '',
		lon = '',
		s = this;
	
	try {
		navigator.geolocation.getCurrentPosition(function(pos){
			lat = pos.coords.latitude;
			lon = pos.coords.longitude;
			
			s.plot_marker(lat,lon,'User Location');
	    });
	} catch (e) {
		alert('there was an issue getting your current location.');
	};
	
};



Geo.prototype.clear_markers = function() {

	var self = this;
	
	if (self.markers) {
		for (i in self.markers) {
			self.markers[i].setMap(null);
		}
	}
};