import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './_router';
import store from './_store';
import vuetify from './plugins/vuetify';
import VueToast from 'vue-toast-notification';
import VModal from 'vue-js-modal';
import '@/assets/style/main.scss';
import i18n from './i18n';

Vue.config.productionTip = false;
Vue.use(VModal);
Vue.use(VueToast, { position: 'top', duration: 2500 });

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
