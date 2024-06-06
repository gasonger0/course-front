import { createApp } from 'vue'
import './style.css'
import Login from './components/login.vue'

if (document.querySelector("#login") != null) {
    createApp(Login).mount('#login')
}
if (document.querySelector("#todo") != null) {
    createApp(Login).mount('#todo')
}
