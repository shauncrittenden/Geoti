function Ti(){
	//this.begin = '1945/06/01 00:00:00';
	this.begin = '1957/06/01 00:00:00';
	this.end = '2009/12/29 00:00:00';
	this.current = this.begin;
	this.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	//this.rate = 36.5; // 36.5 / 36.2916456 approx 1 month a second
	this.rate = 50;
	
	this.init();
}

Ti.prototype.init = function(){
	var self = this,
		start = Date.parse(self.begin),
		$y = $('#y'),
		$m = $('#m'),
		$d = $('#d');
		
	console.log(self.pad(start.getDate(),2));
		
	// initialize clock
	$y.html(start.getFullYear());
	$m.html(self.months[start.getMonth()]);
	$d.html(self.pad(start.getDate(),2));
};

Ti.prototype.pad = function(number, digits){
	var s = number + "";
	while (s.length < digits) s = "0" + s;	
	return s;
};

Ti.prototype.init_montage = function(callback){
	var self = this,
		start = Date.parse(self.begin),
		end = Date.parse(self.end),
		current = Date.parse(self.current),
		$y = $('#y'),
		$m = $('#m'),
		$d = $('#d'),
		count = 0;
	
	var timer = setInterval(function(){	
		$y.html(current.getFullYear());
		$m.html(self.months[current.getMonth()]);
		$d.html(self.pad(current.getDate(),2));
		
		callback.call( this, current.getDate(), current.getMonth(), current.getFullYear() );
		
		// increment
		current = current.add({day:1});
		
		// check if we are past end point and clear if so
		if(current.compareTo(end) == 1){
			clearInterval(timer);
		}
	}, self.rate);
};

Ti.prototype.display_time = function() {
	
};