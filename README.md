Simulations and Artificial Behaviours
=====================================

Workshop at [CIID](http://ciid.dk), Copenhagen, February 2014 by [David Gauthier](http://gauthiier.info) & [Marcin Ignac](http://marcinignac.com)

This workshop investigates the potential of software as ground for design observations, explorations and artistic utterances. It focuses on concepts and techniques of computer simulations and artificial behaviour modelling, that is, the ways computation may be used to impart machines with anthropomorphic and naturalistic traits, character, actions and reactions. 


## Day 4: Signals

Include signals library

	<script type="text/javascript" src="js/signals-data.js"></script>
	<script type="text/javascript" src="js/signals.js"></script>

### Bitcoin
	
**Properties:**

`value` - bitcoin price level (0..1)  
`avgValue` - avg bitcoin price level (0..1)  
`delta` - bitcoin price level change (-1..1)  
`price` - bitcoin price in US dollars

**Events:**

*None*


**Example:**

	var bitcoin = new BitcoinSignal();
		
	function onFrame(event) {
		bitcoin.update(event.time)
		console.log(bitcoin.value);
		console.log(bitcoin.avgValue);
		console.log(bitcoin.delta);
		console.log(bitcoin.price);
	}
	
### Email
	
**Properties:**

`value` - new email level (0..1)  
`avgValue` - avg new email level (0..1)  
`delta` - new email level change (-1..1)  
`count` - number of new emails

**Events:**

`onEmail` - fired when new email arrives


**Example:**

	var email = new EmailSignal();

	email.onEmail = function(count) {
		console.log('You've got a message!')
	}
		
	function onFrame(event) {
		email.update(event.time)
		console.log(email.value);
		console.log(email.avgValue);
		console.log(email.delta);
		console.log(email.count);
		
	}

### Glucose
	
Properties:

`value` - glucose level (0..1)  
`avgValue` - avg glucose level (0..1)   
`delta` - glucose level change (-1..1)    
`level` - glucose level (raw data)  
`carbs` - carbohydrates level (food) (raw data)

Events:

`onFood` - fired when patient eats food

Example:


	var glucose = new GlucoseSignal();

	glucose.onFood = function(carbs) {
		console.log('mniam mniam!')
	}
	
	function onFrame(event) {
		glucose.update(event.time)
		console.log(glucose.value);
		console.log(glucose.avgValue);
		console.log(glucose.delta);
		console.log(glucose.level);
	}

### Weather

Properties:

`value` - wind speed level (0..1)  
`avgValue` - avg wind speed level (0..1)   
`delta` - wind speed level change (-1..1)    
`windSpeed` - wind speed  
`windDirection` - wind direction  
`temperature` - temperature  

Events:

*none*

Example:


	var weather = new WeatherSignal();
	
	function onFrame(event) {
		weather.update(event.time)
		console.log(weather.value);
		console.log(weather.avgValue);
		console.log(weather.delta);
		console.log(weather.windSpeed);
		console.log(weather.windDirection);
		console.log(weather.temperature);
	}

### Results day5

**Assertive**

[![assertive_bitcoin_henriette_Claudia](day5/explorations/gif/assertive_bitcoin_henriette_Claudia.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/assertive_bitcoin_henriette_Claudia.html)
[![assertive_glucose_paula_francesca](day5/explorations/gif/assertive_glucose_paula_francesca.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/assertive_glucose_paula_francesca.html)
[![assertive_wind_julian_anders](day5/explorations/gif/assertive_wind_julian_anders.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/assertive_wind_julian_anders.html)

**Attention seeking**

[![attention_email_angelia_peter](day5/explorations/gif/attention_email_angelia_peter.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/attention_email_angelia_peter.html)
[![attention_email_julian_anders](day5/explorations/gif/attention_email_julian_anders.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/attention_email_julian_anders.html)
[![attentionseeking_temprature_hisangLin_arunima](day5/explorations/gif/attentionseeking_temprature_hisangLin_arunima.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/attentionseeking_temprature_hisangLin_arunima.html)

**Exuberant**

[![dramatic_email_haz_martino](day5/explorations/gif/dramatic_email_haz_martino.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/dramatic_email_haz_martino.html)
[![exhuberant_weather_arun_kaitlyn](day5/explorations/gif/exhuberant_weather_arun_kaitlyn.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exhuberant_weather_arun_kaitlyn.html)
[![exuberant_Weather_Chiayu_Yash](day5/explorations/gif/exuberant_Weather_Chiayu_Yash.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_Weather_Chiayu_Yash.html)
[![exuberant_bloodglucose_hisangLin_arunima](day5/explorations/gif/exuberant_bloodglucose_hisangLin_arunima.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_bloodglucose_hisangLin_arunima.html)
[![exuberant_email_claudia_henriette](day5/explorations/gif/exuberant_email_claudia_henriette.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_email_claudia_henriette.html)
[![exuberant_glucose_Myoung_Samantha](day5/explorations/gif/exuberant_glucose_Myoung_Samantha.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_glucose_Myoung_Samantha.html)
[![exuberant_temp_Amalia_Bethany](day5/explorations/gif/exuberant_temp_Amalia_Bethany.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_temp_Amalia_Bethany.html)
[![exuberant_wind_angelisa_peter](day5/explorations/gif/exuberant_wind_angelisa_peter.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/exuberant_wind_angelisa_peter.html)

**Vivacious**

[![vivacious_bitcoin_Samer_Simon](day5/explorations/gif/vivacious_bitcoin_Samer_Simon.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_bitcoin_Samer_Simon.html)
[![vivacious_bitcoin_paula_francesca](day5/explorations/gif/vivacious_bitcoin_paula_francesca.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_bitcoin_paula_francesca.html)
[![vivacious_email_Samer_Simon](day5/explorations/gif/vivacious_email_Samer_Simon.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_email_Samer_Simon.html)
[![vivacious_email_bethany_amalia](day5/explorations/gif/vivacious_email_bethany_amalia.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_email_bethany_amalia.html)
[![vivacious_glucose_arun_kaitlyn](day5/explorations/gif/vivacious_glucose_arun_kaitlyn.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_glucose_arun_kaitlyn.html)
[![vivacious_glucose_yash_chiayu](day5/explorations/gif/vivacious_glucose_yash_chiayu.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_glucose_yash_chiayu.html)
[![vivacious_temp_haz_martino](day5/explorations/gif/vivacious_temp_haz_martino.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_temp_haz_martino.html)
[![vivacious_weather_Myoung_Samantha](day5/explorations/gif/vivacious_weather_Myoung_Samantha.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivacious_weather_Myoung_Samantha.html)
[![vivaciuos_weather_saurabh_akarsh.html](day5/explorations/gif/vivaciuos_weather_saurabh_akarsh.html.gif)](https://rawgithub.com/vorg/ciid-simulations-and-artificial-behaviours-2014/master/day5/explorations/vivaciuos_weather_saurabh_akarsh.html.html)

