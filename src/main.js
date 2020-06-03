import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import store from '@/store/index'

import router from '@/route.js'

import '@/tools/permission' // permission control

Vue.use(ElementUI)
Vue.use(VueRouter)

Vue.config.productionTip = false
,
new Vue({
  router:router,
  store:store,
  render: h => h(App),
}).$mount('#app')
