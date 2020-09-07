import Vue from 'vue'
import Vuex from 'vuex'
import { account } from '@/_store/account.module'
import { scheduleWeek } from "@/_store/schedule-week.module";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    scheduleWeek
  }
})
