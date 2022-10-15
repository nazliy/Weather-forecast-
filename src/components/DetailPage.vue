<template>
    <section>
       <div class="box">
            <div class="header" >
                 <h3>{{params}}</h3>
                 <i class="icon-heart" :class="[state ? 'active' : ' ']" @click="addFavorite($event)" :data-name=params></i>
            </div>    
            <div class="underline"></div>
       </div>
       <ul class="weather-list">
            <li v-for="(item, index) in dayList "  :key="index" >
               <div class="detail-date">                   
                    {{getDay(item[0].dt_txt)}}
                </div>
               <div class="list-icon">
                    <div v-for="(i, index) in item"  :key="index">
                        <div>{{getHour(i.dt_txt)}}</div>
                        <div class="detail-icon" :class="weatherIcon(i.weather[0].main)" ></div>
                        <div class="list-temp">{{Math.round(i.main.temp)}}°C</div>
                    </div>                    
               </div>
            </li>
       </ul>
     
       <div  :class="[modal ? 'modal modal-active' : 'modal']" >
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Favori Listesi/Düzenle</h3>
                    <button  class="close" @click="Close()" >&times;</button>
                </div>
                <div class="modal-body">
                   <ul class="favorite-list">
                    <li v-for="(item, index) in favorite2" :key="index">
                        <span>{{item.cityName}}</span>
                        <i class="icon-heart" :class="[item.status ? 'active' : ' ']" @click="favoriteList(index)" ></i>                      
                    </li>                
                   </ul>
                </div>
                <div class="modal-footer">
                    <i>2'den fazla favoriye listesi oluşturamazsınız...</i>
                </div>
            </div>
        </div>
    </section>
    
</template>

<script>
import {useRoute} from 'vue-router'
export default{
   name: "DetailPage",
   props:{
        array:{
            type: Array,
            requred:true
        },
        country:{
            type: Array,
            requred:true
        },
        weatherIcon:Function
    },
    data(){
        return {           
            params : '',
            list : {},
            day: [],         
            state : false,            
            nowday :[],
            dayList :[],
            modal : false,
            favorite2:[]            
        }
    },
    methods :{
        fetchWeather() {
           fetch(`${process.env.VUE_APP_BASE_URL}forecast?q=${this.params}&units=metric&appid=${process.env.VUE_APP_KEY}`)
            .then(res => {
              return res.json();
            })
            .then(data => {  
                this.list = data.list
                this.filter(this.list)
                return data
            }).catch( e => console.log(e))         
        },
        addFavorite(e){

            if(!this.favorite2.length){
                for(const i in this.country){
                    this.favorite2.push({
                        cityName : this.country[i],
                        status: false
                    })
                }
            }   
         
            const favoriteItem = this.favorite2.filter(item => {
                if(item.status == true ){
                    return item
                }
            })

            if(!e.target.classList.contains('active') && favoriteItem.length<2 ){
                this.state = true
                const favoriteActive =  this.favorite2.find(item =>  item.cityName === this.params)
                favoriteActive.status = true
            }else if(e.target.classList.contains('active')){
                this.state = false
                const favoriteActive =  this.favorite2.find(item =>  item.cityName === this.params)
                favoriteActive.status = false
            }else{
                this.openModal()
            }
            
        },
        Close(){
            this.modal = false;
            this.onload()
        },
        openModal(){
             this.modal=true
        },
        favoriteList(index){
            const favoriteItem = this.favorite2.filter(item => {
                if(item.status == true ){
                    return item
                }
            })

            if(this.favorite2[index].status){
                this.favorite2[index].status = !this.favorite2[index].status
            }else if(!this.favorite2[index].status && favoriteItem.length<2){
                this.favorite2[index].status = !this.favorite2[index].status
            }
        },    
        filter(data){  

            let dayData = []
            for(let x=0; x<5; x++){
                data.filter((item ) => {
                if(this.day[x] === new Date(item.dt_txt).getDate())
                    {                
                        this.nowday.push(item)
                    }
                    dayData[x] = this.nowday          
                })              
                this.nowday = []              
            }      
      
            for(let x=0; x<5; x++){
                this.dayList.push(dayData[x])
            }
            console.log(this.dayList)

            return data
        },
        getDay(dayy){
        
            const ydate = new Date(dayy)            
            let yday = ydate.getDate()

            if( yday < 10 ){
                yday = `0${yday}`
            }
            let ymonth = ydate.getMonth() + 1
            if( ymonth < 10 ){
                ymonth = `0${ymonth}`
            }
            const yyear = ydate.getFullYear()
            return `${yday}.${ymonth}.${yyear}`
        },
        getHour(yhour){
            let hour = new Date(yhour).getUTCHours()
            if(hour<10){
                hour = `0${hour}`
            }
            hour = `${hour}:00`
            return hour
        },
        onload(){
            const initFavorite = localStorage.getItem('city');
            const favorite = JSON.parse(initFavorite ? initFavorite : '[]');
            console.log(favorite);
            this.favorite2 = favorite;
        
                if(localStorage.getItem('city')){
                    this.favorite2.filter(item => {
                    if(item.status === true){
                        if(item.cityName === this.params){
                            this.state= true
                        }
                    }
                })
            }
        },
        fiveDay(){
            for(let i=0; i<5; i++){
                const newDate = new Date(Date.now()+i*24*60*60*1000);
                let day = newDate.getDate();
                this.day.push(day)
            }
        },
    },
    mounted(){    
        const route = useRoute();
        this.params = route.params.name;       
        this.fetchWeather(); 
        this.onload()
        this.fiveDay()
    }, 
    watch: {        
        favorite2:{
            deep:true,
            handler(){
               const favorite = this.favorite2;
                localStorage.setItem('city', JSON.stringify(favorite))
            }
        }
    }
}
</script>

<style  scoped lang="scss">
    
.weather-list-in{
    display: flex;
    li{
        display: flex;
        flex-direction: column;
    }
}

.weather-list { 
    margin-top: 50px; 
    li{
        display: flex;   
      justify-content:space-between; 
      padding: 15px 20px;
      border:1px solid #ddd;
      align-items: center;
      background: -webkit-linear-gradient(360deg, #dee1e1 10%, #f4f4f4 360%);
       /* Chrome 10+, Saf5.1+ */ background: -moz-linear-gradient(360deg, #dee1e1 10%, #f4f4f4 360%);
        /* FF3.6+ */ background: linear-gradient(360deg, #dee1e1 10%, #f4f4f4 360%); /* W3C */
    }
}

.box{
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-items: center;
    text-align: center;
}
.detail-tep{
    display: inline-block;
    font-size: 52px;
    font-weight: 700;
    text-shadow: 1px 3px rgb(0 0 0 / 25%);
    background-color: rgb(255, 255, 255, 0.25);
    box-shadow: rgb(0, 0, 0, 0.25);
}
.list-icon{
    display: flex;
    align-items: center;
    span{
        margin:0 8px
    }
    div>div{
        padding: 0 40px ; 
        font-style: italic;
    }
    div{
        text-align: center;
    }
}
.detail-icon {
    width: 50px;
    height: 50px;
    background-position: center center;
    text-align: center;
    margin: 0 auto;
    background-repeat: no-repeat;
    background-size: 100%;
}
.detail-date{ 
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    width: 20%;
    text-align: center;
    background: #888;
    color: #fff;
}
.list-temp{
    display: inline-block;
    font-size: 21px;
    font-weight: 600;
    text-shadow: 0px 1px rgb(0 0 0 / 25%);
}
.favorite-list {
   li{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 5px;
    padding-top: 5px;
    &:last-child{
        border-bottom:none ;
    }
    span{
        font-size: 26px;
    }
   }
}
.header{ 
display: flex;
 text-align: center;
 justify-content: center;
    h3{
        padding: 0 20px;
    }
}

.icon-heart{
    font-size: 30px;
    cursor: pointer;
 }
.active {
     color:#f00;
}

.modal {
    display: none; 
    position: fixed; 
    z-index: 1; 
    padding-top: 100px; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4); 
    .modal-content{
        background-color: #fefefe;
        margin: auto;
        padding: 40px;
        border: 1px solid #888;
        width: 60%;
        border-radius: 5px;
        .modal-header{
        display: flex;   
        justify-content: center;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 15px;
        position: relative;
      } 
       .modal-body{
        margin-top: 25px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
        padding: 0 80px 15px;
     }   
      .modal-footer{ 
       display: flex;   
       justify-content: center;    
    } 
    }
    
}
    
.close {
    font-size: 40px;
    font-weight: bold;
    border: none;
    background: none;
    position: absolute;
    right: -25px;
    top: -35px;
    &:hover,&:focus{
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }
}

.modal-active{ 
    display: block;
}

@media screen and (max-width:1200px) {
    .weather-list {
        li{
            display: block;
        }
    }
    .detail-date{
        width: 100%;
        margin-bottom: 25px;
    }
    .list-icon{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px,1fr));
        gap: 3px;
    }
    .list-icon{
        div>div{
            padding: 0 20px ; font-style: italic;
        }
    }

}

</style>