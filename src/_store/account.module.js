import { userService } from '@/_services/user.service'
import router from '@/_router'

const user = JSON.parse(localStorage.getItem('user'))

const state = {
  user: user ? user : {}
}

const actions = {
  login ({ commit }, data) {
    userService.login(data).then(res => {
        localStorage.setItem('user', JSON.stringify(res));
        commit('SET_USER', res);
        router.push('/super-admin');
    }).catch(err => console.log(err));
  },
  logout ({ commit }) {
    userService.logout();
    commit('REMOVE_USER');
  }
}

const mutations = {
  SET_USER (state, data) {
    state.user = data;
  },
  REMOVE_USER (state) {
    state.user = null;
  }
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
