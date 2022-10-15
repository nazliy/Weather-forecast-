<template>
   <div>
        <div class="title">
            <h3>Weather</h3>
            <div class="underline"></div>
        </div>   
     
        <section class="cards">     
            <div class="card" v-for="item in array"  :key="item.id" >          
                <router-link :to="{ path: `/detail/${item.data.name}`}" >
                    <div class="card-city">
                        <div class="city">{{item.data.name}}</div>
                        <div class="country">{{item.data.sys.country}}</div>
                        <div class="date">{{getDate()}}</div>
                    </div>
                    <div class="card-mid">
                        <div class="temp">{{ Math.round(item.data.main.temp)}}°C </div>
                        <div class="weather-icon" :class="weatherIcon(item.data.weather[0].main)"></div>
                        <div class="weather">{{item.data.weather[0].description}}</div>
                    </div>
                </router-link>
            </div>
        </section> 
    </div>     
</template>

<script>


export default {
    name: 'CardWeather',    
    props:{
        array:{
            type: Array,
            requred:true
        },
        weatherIcon:Function
    },
    data() {
        return{
         
        }
    },   
    methods :{
        getDate(){
            let date = new Date();
            let day = date.getDate();
            if(day<10){
                day = `0${day}`
            }
            let month = date.getMonth() + 1;
            if(month<10){
                month = `0${month}`
            }
            const year = date.getFullYear();
            return `${day}.${month}.${year}`
        }
    },
}
</script>


