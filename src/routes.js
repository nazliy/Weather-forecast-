import { createRouter, createWebHistory } from "vue-router";
import DetailPage from './components/DetailPage.vue'
import CardWeather from './components/CardWeather.vue'

const routes = [
    {
        name:'CardWeather',
        path:'/',
        component:CardWeather,
    },
    {
        name:'DetailPage',
        path:'/detail/:name',
        component:DetailPage,
        props:dynamic,
     
        
    }
];



function dynamic(){
    const country = ["İstanbul", "Londra", "Paris", "Tokyo", "Dublin"];

    return{
        country
    }
}

const router = createRouter({
    history:createWebHistory(),
    routes
});

export default router;

