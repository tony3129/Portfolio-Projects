//TODO: MOVE API KEY TO privateInfo.env, let server.js handle serving to security
const apiKey = 'fe9cfda4708a09daeff4e9e029f9e325'
const apiURL = 'https://api.openweathermap.org/data/2.5/weather';

//variables to extract information and add information later
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('weatherSubmit');
const locationElement = document.getElementById('location');
const tempElement = document.getElementById('temp');
const descElement = document.getElementById('desc');

searchBtn.addEventListener('click',()=>{
    const location = locationInput.value;
    if(location){
        fetchWeather(location);
    }
});

function fetchWeather(location){
    const url = `${apiURL}?q=${location}&appid=${apiKey}&units=metric`;

    //send req to OpenWeather, and process the response in json format
    fetch(url).then(response =>{
        if(!response.ok){
            locationElement.textContent = 'Invalid City Name, please check the spelling';
            tempElement.textContent = '';
            descElement.textContent = '';
            throw new Error('City not found');
        }
        return response.json();
    }).then(data =>{
        //take information and show it
        locationElement.textContent = data.name;
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        descElement.textContent = data.weather[0].description;
    }).catch(err =>{
        console.log('Error fetching weather: ' + err)
    });
}