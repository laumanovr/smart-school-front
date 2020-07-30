import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#339DFA',
        secondary: '#b0bec5',
        accent: '#339DFA',
        error: '#b71c1c'
      }
    }
  },
  icons: {
    iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    values: {
      chevronDown: 'mdi-chevron-down'
    }
  },
})
