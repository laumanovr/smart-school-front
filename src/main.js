import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './_router'
import store from './_store'
import vuetify from './plugins/vuetify'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

Vue.config.productionTip = false
Vue.use(VueToast, { position: 'top', duration: 3000 });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
