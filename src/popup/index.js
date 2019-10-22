import Vue from 'vue'
import {
  Button,
  Card,
} from 'element-ui'
import AppComponent from './App/App.vue'


Vue.component('app-component', AppComponent)

Vue.use(Button)
Vue.use(Card)

new Vue({
  el: '#app',
  render: (createElement) => createElement(AppComponent),
})
