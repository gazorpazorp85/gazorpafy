import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import * as rxjs from 'rxjs';
import VueRx from 'vue-rx';

import './styles/global.scss'

Vue.config.productionTip = false
Vue.use(VueRx, rxjs)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
