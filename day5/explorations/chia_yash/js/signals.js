function Signal() {
  this.data = [];
  this.currentIndex = 0;
  this.minValue = 0;
  this.maxValue = 0;
  this.avgValue = 0;
  this.avgNormalizedValue = 0;
}

Signal.prototype.update = function(time) {
  this.currentIndex = Math.floor(this.data.length * time / 60) % this.data.length;

  var prevRawValue = this.data[Math.max(0, this.currentIndex-1)].value;
  var rawValue = this.data[this.currentIndex].value;
  var rawDelta = rawValue - prevRawValue;

  var value = (rawValue - this.minValue)/(this.maxValue - this.minValue);
  var prevValue = (prevRawValue - this.minValue)/(this.maxValue - this.minValue);
  var delta = value - prevValue;

  var currentData = this.data[this.currentIndex];
  for(var propName in currentData) {
    this[propName] = currentData[propName];
  }

  this.value = value;
  this.delta = delta;
  this.avgValue = (this.avgValue*50 + value)/51;

  if (this.checkEvent) {
    this.checkEvent();
  }
}

Signal.prototype.getValue = function(t) {
  var index = Math.floor(this.data.length * t);
  var rawValue = this.data[index].value;
  var value = (rawValue - this.minValue)/(this.maxValue - this.minValue);
  return value;
}

function BitcoinSignal() {
  Signal.call(this);
  Signals.Data.Bitcoin.forEach(function(dayInfo, dayInfoIndex) {
    var date = new Date(dayInfo[0]*1000);
    var value = dayInfo[3];

    if (date.getDate() == 25) {
      if (value < this.minValue || this.data.length == 0) this.minValue = value;
      if (value > this.maxValue || this.data.length == 0) this.maxValue = value;
      this.data.push({
        date: date,
        price: value,
        value: value
      });
    }
  }.bind(this));

  this.update(0);
}

BitcoinSignal.prototype = new Signal();

function GlucoseSignal() {
  Signal.call(this);

  var s = 10*288;
  Signals.Data.Glucose = Signals.Data.Glucose.slice(s, s+500);
  Signals.Data.Carbs = Signals.Data.Carbs.slice(s, s+500);

  Signals.Data.Glucose.forEach(function(value, valueIndex) {
    if (valueIndex < 288) {
      if (value < this.minValue || this.data.length == 0) this.minValue = value;
      if (value > this.maxValue || this.data.length == 0) this.maxValue = value;
      this.data.push({
        carbs: Signals.Data.Carbs[valueIndex],
        level: Signals.Data.Glucose[valueIndex],
        value: value
      });
    }
  }.bind(this));


  this.update(0);
}

GlucoseSignal.prototype = new Signal();

GlucoseSignal.prototype.checkEvent = function() {
  if (this.data[this.currentIndex].carbs > 0) {
    if (this.firedIndex != this.currentIndex) {
      this.firedIndex = this.currentIndex;
      if (this.onFood) {
        this.onFood(this.data[this.currentIndex].carbs);
      }
    }
  }
}

function WeatherSignal() {
  Signal.call(this);

  Signals.Data.Weather.forEach(function(conditions, valueIndex) {
    var value = conditions.speed;
    if (value < this.minValue || this.data.length == 0) this.minValue = value;
    if (value > this.maxValue || this.data.length == 0) this.maxValue = value;
    this.data.push({
      windSpeed: conditions.speed,
      windDirection: conditions.direction,
      temperature: conditions.temp,
      time: conditions.direction,
      value: value
    });
  }.bind(this));


  this.update(0);
}

WeatherSignal.prototype = new Signal();

function EmailSignal() {
  Signal.call(this);

  Signals.Data.Emails.forEach(function(value, valueIndex) {
    if (value < this.minValue || this.data.length == 0) this.minValue = value;
    if (value > this.maxValue || this.data.length == 0) this.maxValue = value;
    this.data.push({
      count: value,
      value: value
    });
  }.bind(this));


  this.update(0);
}

EmailSignal.prototype = new Signal();

EmailSignal.prototype.checkEvent = function() {
  if (this.data[this.currentIndex].value > 0) {
    if (this.firedIndex != this.currentIndex) {
      this.firedIndex = this.currentIndex;
      if (this.onEmail) {
        this.onEmail(this.data[this.currentIndex].count);
      }
    }
  }
}