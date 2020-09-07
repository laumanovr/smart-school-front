import Vue from 'vue'
import App from './App.vue'
import '@/assets/style/main.scss';
import './registerServiceWorker'
import router from './_router'
import store from './_store'
import vuetify from './plugins/vuetify'
import VueToast from 'vue-toast-notification';
import VModal from 'vue-js-modal';

import {
    MdDatepicker,
    MdButton,
    MdCheckbox,
    MdField,
    MdTable,
    MdRadio,
    MdList,
    MdMenu,
    MdSwitch,
    MdContent,
    MdRipple,
} from '../node_modules/vue-material/dist/components';

import i18n from './i18n'

Vue.config.productionTip = false;
Vue.use(VModal);
Vue.use(VueToast, { position: 'top', duration: 2500 });
Vue.use(MdDatepicker);
Vue.use(MdButton);
Vue.use(MdCheckbox);
Vue.use(MdField);
Vue.use(MdTable);
Vue.use(MdRadio);
Vue.use(MdList);
Vue.use(MdMenu);
Vue.use(MdSwitch);
Vue.use(MdContent);
Vue.use(MdRipple);
Vue.material.locale.dateFormat = 'dd.MM.yyyy';

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
