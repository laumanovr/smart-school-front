import Vue from 'vue';
import Vuex from 'vuex';
import { account } from './account.module';
import { scheduleWeek } from './schedule-week.module';
import { location } from './location.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    scheduleWeek,
    location
  }
})
