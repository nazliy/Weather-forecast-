
<template>
  <main>
      <router-view :array="array" :weatherIcon="weatherIcon"></router-view>         
  </main>
</template>

<script>

export default {
    name: "App",
    data() {
        return {
            weather: [],
            land: navigator.language.split("-")[0],
            country: ["İstanbul", "London", "Paris", "Tokyo", "Dublin"],
            array : [],
            icon:'',
            sunny: 'sunny',
            cloudy : 'cloudy',
            rain : 'rain',
            partlyCloudy : 'partly-cloudy',
            thunderstorm :'thunderstorm',
            drizzle : 'drizzle',
            snow : 'snow',
            mist : 'mist',
            nanIcon :'',
        };
    },
   
   
    methods: {
      fetchWeather() {
          
          this.country.forEach((element ,index)  => {
            fetch(`${process.env.VUE_APP_BASE_URL}weather?q=${element}&lang=${this.land}&units=metric&appid=${process.env.VUE_APP_KEY}`)
            .then(res => {
              return res.json();
            })
            .then(data => {             
              this.weather = {
                id : index,
                data : data
              }
              this.array.push(this.weather)          
              return data
            })
          });            
        },
        weatherIcon(icon) {
          
            if(icon == 'Clear'){
                return this.sunny
            }
            else if(icon == 'Clouds'){
                
                return this.cloudy
            }
            else if(icon == 'Rain'){
                return this.rain
            }
            else if(icon == 'Thunderstorm'){
                return this.thunderstorm
            }
            else if(icon == 'Drizzle'){
                return this.drizzle
            }
            else if(icon == 'Snow'){
                return this.snow
            }
            else if(icon == 'Fog' || icon == 'Mist'  ){
                return this.mist
            }
            else {
                return this.nanIcon
            }
    }
    },
    created() {
         this.fetchWeather();
    }
   
}
</script>

<style>
@import './assets/scss/styles.scss';
</style>
