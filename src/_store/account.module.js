import { userService } from '@/_services/user.service'
import router from '@/_router'

const user = JSON.parse(localStorage.getItem('user'))

const roles = [
  {
    code: 'ROLE_SUPER_ADMIN',
    url: '/super-admin'
  },
  {
    code: 'ROLE_ADMIN',
    url: '/school-admin'
  }
]

const state = {
  user: user ? user : {}
}

const actions = {
  login ({ commit }, data) {
    userService.login(data).then(res => {
        localStorage.setItem('user', JSON.stringify(res));
        commit('SET_USER', res);
        const role = roles.find(i => i.code === res.roles[0].code)
        router.push(role.url);
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
