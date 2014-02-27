Simulations and Artificial Behaviours
=====================================

Workshop at [CIID](http://ciid.dk), Copenhagen, February 2014 by [David Gauthier](http://gauthiier.info) & [Marcin Ignac](http://marcinignac.com)


## Signals

Include signals library

	<script type="text/javascript" src="js/signals-data.js"></script>
	<script type="text/javascript" src="js/signals.js"></script>

### Bitcoin
	
**Properties:**

`value` - bitcoin price level
`avgValue` - avg bitcoin price level
`delta` - bitcoin price level change
`price` - bitcoin price in US dollars

**Events:**

*None*


**Example:**

```javascript
var bitcoin = new BitcoinSignal();
	
function onFrame(event) {
	bitcoin.update(event.time)
	console.log(bitcoin.value);
	console.log(bitcoin.avgTime);
	console.log(bitcoin.delta);
	console.log(bitcoin.price);
}
```

### Glucose
	
Properties:

`value` - glucose level  
`avgValue` - avg glucose level  
`delta` - glucose level change  
`level` - glucose level (raw data)  
`carbs` - carbohydrates level (food) (raw data)

Events:

`onFood` - fired when patient eats food

Example:


	var glucose = new GlucoseSignal();
	
	function onFrame(event) {
		glucose.update(event.time)
		console.log(glucose.value);
		console.log(glucose.avgTime);
		console.log(glucose.delta);
		console.log(glucose.level);
		glucose.onFood = function(carbs) {
			console.log('mniam mniam!')
		}
	}


