const userWeatherTab = document.querySelector('#your-weather-btn');
const searchWeatherTab = document.querySelector('#search-weather-btn');
const locAccessBtn = document.querySelector('#loc-access-btn');
const searchCityFrom = document.querySelector('#search-city');
const cityInput = document.querySelector('#input-city');
const searchBtn = document.querySelector('#search-btn');








const locationComponent = document.querySelector('#loc-permission-container');
const searchComponent = document.querySelector('#search-city');
const lodingComponent = document.querySelector('#loding-container');
const userWeatherComponent = document.querySelector('#user-location-weather');


let currentTab = userWeatherTab;
const API_key = 'bed75e020fa2b8173f656cf89e84fbb1';



currentTab.classList.add('current-tab');

getFromSessionStorage();



function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('current-tab');
        currentTab = clickedTab;
        currentTab.classList.add('current-tab');
    }

    if(clickedTab == userWeatherTab){
        searchComponent.classList.remove('active');
        userWeatherComponent.classList.remove('active');
        getFromSessionStorage();    
    }else{       
        locationComponent.classList.remove('active');
        userWeatherComponent.classList.remove('active');
        searchComponent.classList.add('active');
    }
}



userWeatherTab.addEventListener('click', ()=>{
    switchTab(userWeatherTab);
    userWeatherComponent.style.top = '10%';
});
searchWeatherTab.addEventListener('click', ()=>{
    switchTab(searchWeatherTab);
    userWeatherComponent.style.top = '20%';
});


function getFromSessionStorage(){
    const locationCordinates = sessionStorage.getItem('user-cordinates');

    if(!locationCordinates){
        locationComponent.classList.add('active');
    }else{
        const cordinates = JSON.parse(locationCordinates);
        fetchUserWeatherInfo(cordinates);
    }
} 

async function fetchUserWeatherInfo(cordinates){
    const {lat, lon} = cordinates;

    locationComponent.classList.remove('active');
    lodingComponent.classList.add('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();

        lodingComponent.classList.remove('active');
        userWeatherComponent.classList.add('active');

        renderWeatherInfo(data);

    }catch(err){
        lodingComponent.classList.remove('active');

        alert('Please Refresh your page');
    }
}


function renderWeatherInfo(weatherInfo){


    const cityName = document.querySelector('#city-text');
    const countryFlag = document.querySelector('#country-img');
    const weatherDiscription = document.querySelector('#current-weather-text');
    const weatherIcon = document.querySelector('#current-weather-img');
    const temp = document.querySelector('#temp');
    const windSpeed = document.querySelector('#windspeed');
    const humidity = document.querySelector('#humidity');
    const cloud = document.querySelector('#cloud');
    
    cityName.innerHTML = weatherInfo?.name; 
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDiscription.innerHTML = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    if(weatherInfo?.main?.temp > 273){
        let temprature = weatherInfo?.main?.temp;
        temprature -= 273;
        let tempInStr = temprature.toString();
        let i=0;
        let newTemp = '';
        while(i<4){
            newTemp += tempInStr[i];
            i++;
        }
        temp.innerHTML = `${newTemp} °C`;
    }else{
        temp.innerHTML = `${weatherInfo?.main?.temp} °C`;
    }
    windSpeed.innerHTML = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerHTML = `${weatherInfo?.main?.humidity}%`;
    cloud.innerHTML = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert('No geolocation supported');
    }
}

function showPosition(position){
    const userCordinats = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-cordinates", JSON.stringify(userCordinats));

    fetchUserWeatherInfo(userCordinats);
}


locAccessBtn.addEventListener('click', getLocation);

searchCityFrom.addEventListener('submit', (e)=>{
    e.preventDefault();

    let cityInputName = cityInput.value;

    if(cityInputName === ''){
        return;
    }else{
        fetchWeatherByCity(cityInputName);
    }
});

async function fetchWeatherByCity(city){
    lodingComponent.classList.add('active');
    userWeatherComponent.classList.remove('active');
    locationComponent.classList.remove('active');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`); 
        const data = await response.json();
        lodingComponent.classList.remove('active');
        userWeatherComponent.classList.add('active'); 
        renderWeatherInfo(data);


    } catch (err) {
        alert('Error',err);
    }
}
