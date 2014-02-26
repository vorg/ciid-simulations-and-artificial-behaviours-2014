function Flame() { 
	this.factor = 0.005;
	this.total = 0;
	this.totalWind = 0;
	this.wind=0;
	this.isBlowingWest = false;

	var c = new Path.Circle(new Point(200,100),50);	
	var t = new Path.RegularPolygon(new Point(200,50),3,50);

	this.fire = c.unite(t);
	this.fire.position = view.center;
		
	
	this.flicky = function() {
		this.fire.shear(this.factor,0,this.fire.segments[0].point);
		this.total += this.factor;

		//oscillate shear
		if (this.total > 0.02){
			this.factor = -0.005;
		}
		if (this.total < -0.02) {
			this.factor = 0.005;
		}
	}	
	
	this.windFlicker = function() {
		
		this.fire.shear(-this.wind,0,this.fire.segments[0].point);
		this.totalWind += this.wind;
	
		if (!this.isBlowingWest) {
		if (this.totalWind > 0) {
			this.wind -= 0.001;
		}
		else {
			this.wind = 0;
		}
	}
	else{if (this.totalWind < 0) {
			this.wind += 0.001;
		}
		else {
			this.wind = 0;
		}
		}
	}
	
	this.onMouseMoveFlame = function(event) {
	 this.wind = Math.max(Math.min( event.delta.x/view.size.width,.05),-.05);
   	 if (this.wind > 0) {
   		 if (this.totalWind > 0) {
		 
   		 this.isBlowingWest = false;}
   		 else {
   			 this.isBlowingWest = true;
   		 }
   	 }
   	 else {
   		 if (this.totalWind > 0) 
   		 { this.isBlowingWest = false;}
   		 else {
   		 this.isBlowingWest = true;
   	 }
   	 }
	
	}
	
	
}

var candleHeight= 300;
var candle = new Path.Rectangle(new Point(0,0),new Size(100,candleHeight));
candle.position = view.center + [0,candleHeight/2+85];
candle.fillColor = 'white';
var flame1 = new Flame(); 
flame1.fire.fillColor='orange';
var flame2 = new Flame(); 
flame2.fire.scale(.5);
flame2.fire.position = new Point(view.center.x,view.center.y+flame1.fire.bounds.height/4);
flame2.fire.fillColor='yellow';

function onFrame() {
	flame1.flicky() ;
	flame1.windFlicker();
	flame2.flicky() ;
	flame2.windFlicker();
}

function onMouseMove(event) {

	flame1.onMouseMoveFlame(event);
	flame2.onMouseMoveFlame(event);

}