//  Timeline.js v0.1 / 2011-05-01
//  A compact JavaScript animation library with a GUI timeline for fast editing.
//  by Marcin Ignac (http://marcinignac.com)
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

var Timeline = function() {
  this.name = "Global";
  this.anims = [];
	this.time = 0;
	this.totalTime = 0;
	this.loopCount = 0;
	this.loopMode = 0;
	this.playing = true;
  this.verbose = false;
	var self = this;
	//setInterval(function() {
  //  self.update();
	//}, 1000/30);
};

Timeline.currentInstance = null;

Timeline.getGlobalInstance = function() {
	if (!Timeline.globalInstance) {
		Timeline.globalInstance = new Timeline();
	}
	return Timeline.globalInstance;
};

Timeline.prevTime = Date.now();
Timeline.update = function() {
  var now = Date.now();
  delta = (now - Timeline.prevTime)/1000;
  Timeline.prevTime = now;
  Timeline.getGlobalInstance().update()
}

//Possible values of n:
//-1 infinite loop
//0  play forever without looping, continue increasing time even after last animation
//1  play once and stop at the time the last animation finishes
//>1 loop n-times
Timeline.prototype.loop = function(n) {
  this.loopMode = n;
};

Timeline.prototype.stop = function() {
  this.playing = false;
  this.time = 0;
  this.prevTime = this.time - 1/30; //FIXME 1/30
};

Timeline.prototype.pause = function() {
  this.playing = false;
};

Timeline.prototype.play = function() {
  this.playing = true;
};

Timeline.prototype.preUpdate = function() {
  //placeholder for hooks like GUI rendering
};

Timeline.prototype.update = function(deltaTime) {
  deltaTime = deltaTime || 1/30;
  this.preUpdate();

  if (this.playing) {
    this.totalTime += deltaTime;
    this.prevTime = this.time;
    this.time += deltaTime;
  }

  if (this.loopMode !== 0) {
    var animationEnd = this.findAnimationEnd();
    if (this.time > animationEnd) {
      this.loopCount++;
      this.time = 0;
      for(var i=0; i<this.anims.length; i++) {
        this.anims[i].hasStarted = false;
      }
    }
    if (this.loopMode == -1) {
      //loop infinitely
      for(var i=0; i<this.anims.length; i++) {
        this.anims[i].hasStarted = false;
      }
    }
    else {
      if (this.loopCount >= this.loopMode) {
        this.playing = false;
      }
    }
  }

  this.applyValues();
};

Timeline.prototype.findAnimationEnd = function() {
  var endTime = 0;
  for(var i=0; i<this.anims.length; i++) {
    if (this.anims[i].endTime > endTime) {
      endTime = this.anims[i].endTime;
    }
  }
  return endTime;
};

Timeline.prototype.getValue = function(obj, name) {
  if (name == 'rotation') {
    if (typeof(obj._timelineRotation) == 'undefined') {
      obj._timelineRotation = obj.rotation || 0;
    }
    return obj._timelineRotation;
  }
  else if (name == 'scale') {
    if (typeof(obj._timelineScale) == 'undefined') {
      obj._timelineScale = 1;
    }
    return obj._timelineScale;
  }
  else {
   return obj[name];
  }
}

Timeline.prototype.setValue = function(obj, name, value) {
  if (name == 'rotation') {
    obj.rotate(value - obj._timelineRotation);
    obj._timelineRotation = value;
  }
  else if (name == 'scale') {
    obj.scale(value/obj._timelineScale)
    obj._timelineScale = value;
  }
  else {
    obj[name] = value;
  }
}

Timeline.prototype.applyValues = function() {
  for(var i=0; i<this.anims.length; i++) {
    var propertyAnim = this.anims[i];
    if (this.time < propertyAnim.startTime) {
      continue;
    }
    if (this.time >= propertyAnim.startTime && !propertyAnim.hasStarted) {
      propertyAnim.startValue = this.getValue(propertyAnim.target, propertyAnim.propertyName)
      propertyAnim.hasStarted = true;
      if (propertyAnim.parent.onStartCallback) {
        propertyAnim.parent.onStartCallback(propertyAnim);
      }
    }
    var t = (this.time - propertyAnim.startTime)/(propertyAnim.endTime - propertyAnim.startTime);
    t = Math.max(0, Math.min(t, 1));
    t = propertyAnim.easing(t);

    var value = propertyAnim.startValue + (propertyAnim.endValue - propertyAnim.startValue) * t;

    this.setValue(propertyAnim.target, propertyAnim.propertyName, value);

    if (propertyAnim.parent.onUpdateCallback) {
      propertyAnim.parent.onUpdateCallback(propertyAnim);
    }

    if (this.time >= propertyAnim.endTime && !propertyAnim.hasEnded) {
      propertyAnim.hasEnded = true;
      if (propertyAnim.parent.onEndCallback) {
        propertyAnim.parent.onEndCallback(propertyAnim);
      }
    }

    if (t == 1) {
      if (this.loopMode == 0) {
        this.anims.splice(i, 1);
        i--;
      }
    }
  }
};

//--------------------------------------------------------------------

Timeline.Anim = function(name, target, timeline) {
	this.startTime = 0;
	this.endTime = 0;
	this.time = 0;
	this.propertyAnims = [];
  this.hasStarted = false;
  this.hasEnded = false;
  this.onStartCallbackCalled = false;
  this.onEndCallbackCalled = false;
  this.onUpdateCallbackCalled = false;

	this.name = name;
	this.target = target;
	this.timeline = timeline;
}

//delay, properties, duration, easing
Timeline.Anim.prototype.to = function() {
  var args = [];
  for(var i=0; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  var delay;
  var properties;
  var duration;
  var easing;

  if (typeof(args[0]) == "number") {
    delay = args.shift();
  }
  else {
    delay = 0;
  }

  if (typeof(args[0]) == "object") {
    properties = args.shift();
  }
  else {
    properties = {};
  }

  if (typeof(args[0]) == "number") {
    duration = args.shift();
  }
  else {
    duration = 1;
  }

  if (typeof(args[0]) == "function") {
    easing = args.shift();
  }
  else {
    easing = Timeline.Easing.Linear.EaseNone;
  }

  for(var propertyName in properties) {
		this.timeline.anims.push({
      hasStarted: false,
      timeline: this.timeline,
      targetName: this.name,
      target: this.target,
			propertyName: propertyName,
			endValue: properties[propertyName],
			delay: delay,
			startTime: this.timeline.time + delay + this.endTime,
			endTime: this.timeline.time + delay + this.endTime + duration,
			easing: easing,
      parent: this
		});
	}
	this.endTime += delay + duration;
	return this;
};

Timeline.Anim.prototype.onStart = function(callback) {
  var self = this;
  this.onStartCallback = function() {
    if (!self.onStartCallbackCalled) {
     callback();
    }
  };
  return this;
}

Timeline.Anim.prototype.onUpdate = function(callback) {
  var self = this;
  this.onUpdateCallback = function() {
     callback();
  };
  return this;
}

Timeline.Anim.prototype.onEnd = function(callback) {
  var self = this;
  this.onEndCallback = function() {
    if (!self.onEndCallbackCalled) {
     callback();
    }
  };
  return this;
}

Timeline.anim = function(targetName, targetObject, parentTimeline) {
  var args = [];
  for(var i=0; i<arguments.length; i++) {
    args.push(arguments[i]);
  }
  var name;
  var target;
  var timeline;

  if (typeof(args[0]) == "string") {
    name = args.shift();
  }

  if (typeof(args[0]) == "object") {
    target = args.shift();
  }
  else {
    target = {};
  }

  if (typeof(args[0]) == "object") {
    timeline = args.shift();
  }
  else {
    timeline = Timeline.getGlobalInstance();
  }

  return new Timeline.Anim(name, target, timeline);
}

//--------------------------------------------------------------------

Timeline.Easing = { Linear: {}, Quadratic: {}, Cubic: {}, Quartic: {}, Quintic: {}, Sinusoidal: {}, Exponential: {}, Circular: {}, Elastic: {}, Back: {}, Bounce: {} };

Timeline.Easing.Linear.EaseNone = function ( k ) {
	return k;
};

Timeline.Easing.Quadratic.EaseIn = function ( k ) {
	return k * k;
};

Timeline.Easing.Quadratic.EaseOut = function ( k ) {
	return - k * ( k - 2 );
};

Timeline.Easing.Quadratic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
	return - 0.5 * ( --k * ( k - 2 ) - 1 );
};

Timeline.Easing.Cubic.EaseIn = function ( k ) {
	return k * k * k;
};

Timeline.Easing.Cubic.EaseOut = function ( k ) {
	return --k * k * k + 1;
};

Timeline.Easing.Cubic.EaseInOut = function ( k ) {
	if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
	return 0.5 * ( ( k -= 2 ) * k * k + 2 );
};

Timeline.Easing.Elastic.EaseIn = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
};

Timeline.Easing.Elastic.EaseOut = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
	if ( !a || a < 1 ) { a = 1; s = p / 4; }
	else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
	return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
};

Timeline.Easing.Elastic.EaseInOut = function( k ) {
	var s, a = 0.1, p = 0.4;
	if ( k === 0 ) return 0; if ( k == 1 ) return 1; if ( !p ) p = 0.3;
        if ( !a || a < 1 ) { a = 1; s = p / 4; }
        else s = p / ( 2 * Math.PI ) * Math.asin( 1 / a );
        if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
};

Timeline.Easing.Back.EaseIn = function( k ) {
	var s = 1.70158;
	return k * k * ( ( s + 1 ) * k - s );
};

Timeline.Easing.Back.EaseOut = function( k ) {
	var s = 1.70158;
	return ( k = k - 1 ) * k * ( ( s + 1 ) * k + s ) + 1;
};

Timeline.Easing.Back.EaseInOut = function( k ) {
	var s = 1.70158 * 1.525;
	if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
	return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
};

Timeline.Easing.Bounce.EaseIn = function( k ) {
	return 1 - Timeline.Easing.Bounce.EaseOut( 1 - k );
};

Timeline.Easing.Bounce.EaseOut = function( k ) {
	if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
		return 7.5625 * k * k;
	} else if ( k < ( 2 / 2.75 ) ) {
		return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
	} else if ( k < ( 2.5 / 2.75 ) ) {
		return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
	} else {
		return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
	}
};

Timeline.Easing.Bounce.EaseInOut = function( k ) {
	if ( k < 0.5 ) return Timeline.Easing.Bounce.EaseIn( k * 2 ) * 0.5;
	return Timeline.Easing.Bounce.EaseOut( k * 2 - 1 ) * 0.5 + 0.5;
};

Timeline.easingFunctionToString = function( f ) {
  for(var name in Timeline.easingMap) {
    if (Timeline.easingMap[name] == f) {
      return name;
    }
  }
};

Timeline.stringToEasingFunction = function( name ) {
  return Timeline.easingMap[name];
};

Timeline.easingMap = {
};

for(var easingFunctionFamilyName in Timeline.Easing) {
  var easingFunctionFamily = Timeline.Easing[easingFunctionFamilyName];
  for(var easingFunctionName in easingFunctionFamily) {
    Timeline.easingMap[easingFunctionFamilyName + "." + easingFunctionName] = easingFunctionFamily[easingFunctionName];
  }
}