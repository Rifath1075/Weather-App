// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		//this.setState({backGround: "../../assets/backgrounds/design1-iphone.png" });
		// button display state
		this.fetchWeatherData();
		this.setState({onlyCurrent:true});
		this.setState({settings: false})
		this.setState({dailyTArr:["null"]});
		this.setState({dailyWSArr:["null"]});
		this.setState({dailyWDArr:["null"]});
		this.setState({dailyIArr:["null"]});
		this.setState({hourlyTArr:["null"]});
		this.setState({hourlyWSArr:["null"]});
		this.setState({hourlyWDArr:["null"]});
		this.setState({hourlyIArr:["null"]});
		this.setState({hourlyTimeArr:["null"]});
		this.setState({dailyTimeArr:["null"]});
		this.setState({future: true});

	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		this.setState({future:true});
		this.fetchWeatherData2();
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=714232075f13f00b76a74b1b6fc46eca";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	//a call to fetch future weather data
	fetchWeatherData2 = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "https://api.openweathermap.org/data/2.5/onecall?lat=51.508&lon=-0.126&units=metric&appid=714232075f13f00b76a74b1b6fc46eca";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse2,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}

	//Calculates direction from degree obtained via api
	//needs bounds to be fixed
	degdirec = (degree) => {
		if(degree<22.5 && degree>337.5){
			return "N";
		}
		else if(degree>=22.5 && degree<67.5){
			return "NE"
		}
		else if(degree>67.5 && degree<112.5){
			return "E"
		}
		else if(degree>=112.5 && degree<157.5){
			return "SE"
		}
		else if(degree>157.5 && degree<202.5){
			return "S"
		}
		else if(degree>=202.5 && degree<247.5){
			return "SW"
		}
		else if(degree>247.5 && degree<292.5){
			return "W"
		}
		else if(degree>=292.5 && degree<337.5){
			return "NW"
		}
	}

	//converts speed data from m/s to mph
	//make return values round to 1dp
	speedConversion = (speed) => {
		return(
			Math.round(speed * 2.237)
			//add *2.237 so it returns mph instead of m/s
		);
	}

	timeConversion = (unix) => {
		const compdateformat = new Date(unix * 1000)

		const hours = compdateformat.getHours() // 10 AM
		return(
			hours+":00"
		)
	}

	getDay = (timestamp) => {
	var day = new Date(timestamp * 1000);
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var finalDay = days[day.getDay()];
	return finalDay;
}

	ShowFutureHourly = () => {
		const days = [1,2,3,4,5,6]

		const showIcons = []
		const showTime = []
		const showTemp = []
		const showWindD = []
		const showSpeed = []

		for(const number of days){
			showIcons.push(<td> <img src = {this.state.hourlyIArr[number]}/></td>)
		}
		for(const number of days){
			showTime.push(<td>{this.timeConversion(this.state.hourlyTimeArr[number])}</td>)
		}
		for(const number of days){
			showTemp.push(<td>{Math.round(this.state.hourlyTArr[number])}°</td>)
		}
		for(const number of days){
			showWindD.push(<td>{this.degdirec(this.state.hourlyWDArr[number])}</td>)
		}
		for(const number of days){
			showSpeed.push(<td>{this.speedConversion(this.state.hourlyWSArr[number])}</td>)
		}
		return(
			<div>
				<table class={style.hourlyTable}>
					<tr>
						{showTime}
					</tr>
					<tr>
						{showIcons}
					</tr>
					<tr>
						{showTemp}
					</tr>
					<tr>
						{showWindD}
					</tr>
					<tr>
						{showSpeed}
					</tr>
				</table>
			</div>
		);
	}

	//creates table for weather in upcoming days
	//convert the data from unix to human date and place in table replacing the DAY1 text etc
	ShowFutureDaily = () => {
		const days = [1,2,3,4]

		const showFutureData = []

		for(const number of days){
			showFutureData.push(<tr>
				<td>
					{this.getDay(this.state.dailyTimeArr[number])}
				</td>
				<td>
					{Math.round(this.state.dailyTArr[number])}
				</td>
				<td>
					<img src = {this.state.dailyIArr[number]}/>
				</td>
				<td>
					{this.speedConversion(this.state.dailyWSArr[number])}mph

				</td>
				<td>
					{this.degdirec(this.state.dailyWDArr[number])}
				</td>
			</tr>)
		}
		return(
			<div>
				<table class={style.dailyTable}>
					<tr>
						<td>
							Day
						</td>
						<td>
							Temperature
						</td>
						<td>

						</td>
						<td>
							Speed
						</td>
						<td>
							Direction
						</td>
					</tr>
					{showFutureData}
				</table>
			</div>
		);
	}
/*
	bgHandler = (image) =>{
		this.setState({ backGround: image });

	}
*/
	settBar = () => {

		//const bg1 = "../../assets/backgrounds/clear-iphone.png";
		//const bg2 = "../../assets/backgrounds/rain-ipad.png";

		const action1 = () =>{
			document.getElementById("container").style.backgroundImage = "url('../../assets/backgrounds/clear-iphone.jpg')";
		}
		const action2 = () =>{
			document.getElementById("container").style.backgroundImage = "url('../../assets/backgrounds/rain-ipad.jpg')";
		}
		const action3 = () =>{
			document.getElementById("container").style.backgroundImage = "url('../../assets/backgrounds/design1-iphone.png')";
		}

		return(
			<div class = {style.bgChange}>
				<h2>Settings</h2>
				<button class= {style.bgButtons} onClick={action1} >Change Background 1</button>
				<br/>
				<button class= {style.bgButtons} onClick={action2} >Change Background 2</button>
				<br/>
				<button class= {style.bgButtons} onClick={action3}>Change Background 3</button>
			</div>
		)
	}
	//shows homepage
	showHome = () =>{
		this.setState({future:true})
		this.setState({onlyCurrent:true})
		this.setState({settings: false})
	}

	//shows current data only
	currentOnly = () =>{
		this.setState({future:false});
		this.setState({onlyCurrent : true});
		var iconLink = this.state.dailyIArr[0];
		$(style.city).addClass(style.cityOnly)

	}

	//shows settings
	showSettings = () =>{
		this.setState({settings:true})
		this.setState({future:false})
		this.setState({onlyCurrent:false})

	}

	// the main render method for the iphone component
	render() {
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		const futureHourly = this.ShowFutureHourly();
		const futureDaily = this.ShowFutureDaily();
		const settingsTab = this.settBar();
		var iconLink = this.state.dailyIArr[0];
		// display all weather data
		return (
			<div class={ style.container }>
				<div class={ style.header }>
					<div>
						{this.state.settings ? <button id={style.settIcon} onClick={this.showHome} ><img src = "..\..\assets\icons\favicon.png"></img></button>: <button id={style.settIcon} onClick={this.showSettings}><img src= "..\..\assets\icons\justification.png" ></img></button>}
					</div>
					<div>
						{this.state.settings ? settingsTab:null}
					</div>
					<div class={ style.city }>{ this.state.locate }</div>
					<div class={ style.conditions }>{ this.state.cond }</div>
					<span class={style.imgStyle}><img src={iconLink}></img></span>
					<span class={ tempStyles }>{ Math.round(this.state.temp)}°c</span>
					<div class={ style.windstyle}>{ Math.round(this.state.speed) } mph</div>
					<div class={ style.windstyle }>{this.degdirec(this.state.degree)}</div>
				</div>
				<div>
					{this.state.future ? <button id={style.dropDown} onClick={ this.currentOnly }><img src = "..\..\assets\icons\arrowDown.png"></img></button>: null}
				</div>
				<div class={ style.details }></div>
				<div>
					{this.state.future? futureHourly:null}
				</div>
				<div>
					{this.state.future? futureDaily:null}
				</div>
				<div>
					{this.state.future? null: <button id={style.dropDown} onClick={this.showHome} ><img src = "..\..\assets\icons\arrowUp.png"></img></button>}
				</div>

			</div>
			//function below shows actual degree.
			//<div class={ style.city }>{ this.state.degree }</div>
		);
	}

	parseResponse = (parsed_json) => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		var windspeed = parsed_json['wind']['speed'];
		var winddeg = parsed_json['wind']['deg'];

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond : conditions,
			speed : windspeed,
			degree : winddeg
		});
	}

	//gets future data from another api different to api fetching current data
	parseResponse2 = (parsed_json) => {
		var dailyTemp = [];
		var dailySpeed = [];
		var dailyDegree = [];
		var dailyIcon = [];
		var dailyIconLink=[];
		var hourlyTemp = [];
		var hourlySpeed = [];
		var hourlyDegree = [];
		var hourlyIcon = [];
		var hourlyIconLink= [];
		var dailyTime=[];
		var hourlyTime=[];

		//storing data fetched into arrays 	for daily data
		// I have stored the time data for the data. It is stored in Unix form(dailyTime)
		for (let i = 0; i < 7; i++) {
			dailyTemp.push(parsed_json['daily'][i]['temp']['day']);
			dailySpeed.push(parsed_json['daily'][i]['wind_speed']);
		 	dailyDegree.push(parsed_json['daily'][i]['wind_deg']);
			dailyIcon.push(parsed_json['daily'][i]['weather']['0']['icon']);
			dailyIconLink.push("http://openweathermap.org/img/wn/"+dailyIcon[i]+"@2x.png");
			dailyTime.push(parsed_json['daily'][i]['dt']);

		}
		// storing data into fetched arrays for hourly data
		// I have stored the time data for the data. It is stored in Unix form(hourlyTime)
		for (let i =0; i<24; i++){
			hourlyTemp.push(parsed_json['hourly'][i]['temp']);
			hourlySpeed.push(parsed_json['hourly'][i]['wind_speed']);
			hourlyDegree.push(parsed_json['hourly'][i]['wind_deg']);
			hourlyIcon.push(parsed_json['hourly'][i]['weather']['0']['icon']);
			hourlyIconLink.push("http://openweathermap.org/img/wn/"+hourlyIcon[i]+"@2x.png");
			hourlyTime.push(parsed_json['hourly'][i]['dt']);
		}

		// set states for fields so they could be rendered later on
		this.setState({
			dailyTArr : dailyTemp,
			dailyWSArr : dailySpeed,
			dailyWDArr : dailyDegree,
			dailyIArr :  dailyIconLink,
			hourlyTArr : hourlyTemp,
			hourlyWSArr : hourlySpeed,
			hourlyWDArr : hourlyDegree,
			hourlyIArr : hourlyIconLink,
			//use these arrays to use time data
			dailyTimeArr : dailyTime,
			hourlyTimeArr : hourlyTime

		});
	}
}
