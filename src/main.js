import './assets/scss/style.scss'
import './assets/scss/main.scss'
import Vue from 'vue'
import VueTouch from 'vue-touch'
import App from './App.vue'

Vue.use(VueTouch, {name: 'v-touch'})
VueTouch.config.swipe = {
  threshold: 100
}
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
