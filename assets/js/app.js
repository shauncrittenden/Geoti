function Geoti(){
	this.fixture = new Fixture();
	this.ti  = new Ti();
	this.geo = new Geo(this.fixture.nuclear);
	this.init();
}

Geoti.prototype.init = function() {
	this.events();
	//this.ui();
};

Geoti.prototype.events = function() {
	var self = this,
		$header = $('header:eq(0)'),
		$watch = $('#play'),
		$discuss = $('#discuss'),
		discussOpen = false;
	
	// watch
	$watch.click(function(e){ e.preventDefault();
		self.ti.init_montage(function(day, month, year ){
			self.geo.plot_match(day, month, year);
		});
	});
	
	// discuss
	$discuss.click(function(e){ e.preventDefault();
		var $comments = $('article#comments');
		
		if (discussOpen) {
			$comments.fadeOut('fast');
			$header.removeClass('over');
			discussOpen = false;
		} else {
			$comments.fadeIn('fast');
			$header.addClass('over');
			discussOpen = true;
		}
	});
	
};


Geoti.prototype.ui = function() {
	var brandSlides = $('h2 span');
	
	brandSlides.animate({
		width: '0px'
	},'fast');
};


$(function(){
	var geoti = new Geoti();
});

/*

function Geoti(){
	
	
	this.begin = '1945/06/01 00:00:00';
	this.end = '1951/12/29 00:00:00';
	this.current = this.begin;
	this.markers = [];
	this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	
	
	// initialize
	this.init_map();

};

Geoti.prototype.init_map = function(){
	
	var self = this,
		loc = new google.maps.LatLng(40, 0),
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
	map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
	
	// set styles
	var theMap = new google.maps.StyledMapType(self.mapStyles);
	map.mapTypes.set('mymap', theMap);
	map.setMapTypeId('mymap');
	
	this.visual_covers();
	this.set_user_location();
	this.set_bounds();
	
};


Geoti.prototype.visual_covers = function(){
	
	// antartica cover
	this.drawRect(
		new google.maps.LatLngBounds(new google.maps.LatLng(-60,-179.99999999999), new google.maps.LatLng(-100,180)),
		'#1e2833'
		,1
	);


	//this.drawPoly([
	//		new google.maps.LatLng(-90, -0.2), 
	//		new google.maps.LatLng(-90, 0.2),
	//		new google.maps.LatLng(90, 0.2), 
	//		new google.maps.LatLng(90, -0.2)
	//	],
	//	'#000000',
	//	.2
	//);

	// prime meridian
	//this.drawRect(new google.maps.LatLngBounds(new google.maps.LatLng(-90,-0.2), new google.maps.LatLng(90,0.2)),'#ffffff',1);
	
	// equator
	//this.drawRect(new google.maps.LatLngBounds(new google.maps.LatLng(-0.2,-179.9), new google.maps.LatLng(0.2,179.9)),'#ffffff',1);
	
};


Geoti.prototype.drawRect = function(coords, fill, opacity){
	
	var shape,
		shapeCoords = coords;

	
	//shape = new google.maps.Polygon({
	//	paths: shapeCoords,
	//	strokeColor: fill,
	//	strokeOpacity: 0,
	//	strokeWeight: 0,
	//	fillColor: fill, //1d2732
	//	fillOpacity: opacity,
	//	clickable: false
	//});
	
	shape = new google.maps.Rectangle({
		bounds: coords,
		strokeColor: fill,
		strokeOpacity: 0,
		strokeWeight: 0,
		fillColor: fill, //1d2732
		fillOpacity: opacity,
		clickable: false
	});
	
	shape.setMap(map);
	
};


Geoti.prototype.set_user_location = function(){
	
	var lat = '',
		lon = '',
		self = this;
	
	try {
		
		navigator.geolocation.getCurrentPosition(function(pos){
			lat = pos.coords.latitude;
			lon = pos.coords.longitude;
			var userLocation = new google.maps.LatLng(lat, lon);	    	
			var marker = new google.maps.Marker({
				position: userLocation, 
				map: map, 
				title:"userlocation",
				icon: "_/i/user.png"
			});
			
			google.maps.event.addListener(marker, 'click', function() {
			    self.init_montage();
			});
			
	    });
		
	} catch (e) {
	
		alert('there was an issue getting your current location.');
		
	};
	
};


Geoti.prototype.set_bounds = function(){
	
	var allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(-60,-100), new google.maps.LatLng(72,100));
	
	google.maps.event.addListener(map,'center_changed',function() { checkBounds(); });

	function checkBounds() {    
	    if(! allowedBounds.contains(map.getCenter())) {
			var C = map.getCenter();
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
			
			map.setCenter(new google.maps.LatLng(Y,X));
	     }
	}
	
};


Geoti.prototype.clear_markers = function() {

	var self = this;
	
	if (self.markers) {
		for (i in self.markers) {
			self.markers[i].setMap(null);
		}
	}
};


Geoti.prototype.plot_data = function(day, month, year){
	
	var self = this;
	
	// this.clear_markers();
	
	if (day == 1)
		tick();
	
	$(this.db).each(function(i,o){
		//console.log(o.name , o.date, o.latitude + ' ' + o.longitude);
		
		var eDay = o.date.substr(8,2),
			eMonth = o.date.substr(5,2),
			eYear = o.date.substr(0,4);
		
		//console.log(eDay);
		//console.log(month, year, parseInt(eMonth), parseInt(eYear));
		//console.log(Mm.months[month]);
		
		if ( month == parseInt(eMonth,10) && year == parseInt(eYear,10) && day == parseInt(eDay,10) ) {
		
			$('ol').append('<li>' + o.name + ' ' + self.current + '</li>');
			
			var dataEvent = new google.maps.LatLng(o.latitude, o.longitude);
		
			var marker = new google.maps.Marker({
				position: dataEvent, 
				map: map, 
				title: o.name,
				icon: '_/i/nuclear.png'
			});
			
			beep();
			
			self.markers.push(marker);
			
		}
		
	});
	
};


Geoti.prototype.init_montage = function(){
	
	var self = this,
		start = Date.parse(self.begin),
		end = Date.parse(self.end),
		current = Date.parse(self.current);
		$clock = $('.clock'),
		count = 0;
		
	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
	
	var timer = setInterval(function(){
	
		var out = self.months[current.getMonth()] + ' ' + pad(current.getDate(),2) + ' ' + current.getFullYear();
		$clock.html(out);
		
		self.plot_data(current.getDate(), current.getMonth(), current.getFullYear() );
		
		// increment
		current = current.add({day:1});
		
		// check if we are past end point and clear if so
		if(current.compareTo(end) == 1){
			console.log('end it!!!');
			clearInterval(timer);
		}

	},36.2916456);
	
};


$(function() {
	window.geoti = new Geoti();
});
*/