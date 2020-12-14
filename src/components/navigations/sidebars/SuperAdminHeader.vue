<template>
  <div class="super-admin-header">
    <div class="super-admin-header__logo">
      <img :src="require('../../../assets/images/logo.svg')">
    </div>
    <div class="super-admin-header__info">
      <div class="super-admin-header__title">
	      <slot name="title">No title</slot>
      </div>
        <v-select
            class="select-lang"
            :items="languages"
            item-text="title"
            item-value="code"
            v-model="currentLang"
            @change="changeLang"
        />
      <div class="super-admin-header__user-info">
        <span>
	        <div>
		        <slot name="userName"></slot>
	        </div>
	        <div><slot name="roleName"></slot></div>
        </span>
        <span><img src="../../../assets/images/user.svg" alt=""></span>
        <span style="cursor: pointer">
	        <img src="../../../assets/images/icons/chevron-down.svg" alt="">
        </span>
        <span class="divider"></span>
        <span style="cursor: pointer"><img src="../../../assets/images/icons/ring-bell.svg"></span>
         <span style="cursor: pointer" @click="systemLogout"><img src="../../../assets/images/icons/logout.svg"></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    name: 'SuperAdminHeader',
    data() {
        return {
            currentLang: '',
            languages: [
                {title: 'РУ', code: 'ru'},
                {title: 'КГ', code: 'kg'},
            ]
        }
    },
    mounted() {
        const selectedLang = JSON.parse(window.localStorage.getItem('schoolLang'));
//        this.currentLang = selectedLang ? selectedLang : 'ru';
        if (selectedLang) {
            if (selectedLang === 'kg') {
                this.currentLang = selectedLang;
            } else {
                this.currentLang = 'ru';
                window.localStorage.setItem('schoolLang', 'ru');
            }
        } else {
            this.currentLang = 'ru';
        }
        this.$root.$i18n.locale = this.currentLang;
    },
    methods: {
        ...mapActions('account', [ 'login', 'logout' ]),
        systemLogout() {
            this.logout();
            this.$router.push('/login');
        },

        changeLang(lang) {
            window.localStorage.setItem('schoolLang', JSON.stringify(lang));
            this.$router.go(0);
        }
    }
}
</script>

<style lang="scss">
  .super-admin-header {
    height: 76px;
    background: #FFFFFF;
    width: 100%;
    display: flex;
    font-family: Helvetica,sans-serif;
    font-style: normal;
    font-weight: normal;

    &__logo {
      background: linear-gradient(180deg, #4A27F3 0%, #34A0FF 100%);
      flex-basis: 96px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 96px);
    }
    &__title {
      color: rgba(29, 25, 76, 0.75);
      font-family: Open Sans,sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 119%;
      margin-left: 25px;
    }
    &__user-info {
      display: flex;
      align-items: center;
      margin-right: 40px;

      > span {
        display: block;

        &.divider {
          border: 1px solid #EFF4F7;
          transform: rotate(90deg);
          width: 52px;
          height: 0;
        }
      }
      span:nth-child(2) {
        margin: 0 20px;
      }
      span:nth-child(5) {
        margin: 0 20px 0 0;
      }

      > span:first-child {
        div:first-child {
          font-size: 14px;
          line-height: 16px;
          text-align: right;
          letter-spacing: 0.01em;
          color: #000000;
        }
        div:last-child {
          font-size: 12px;
          line-height: 14px;
          text-align: right;
          letter-spacing: 0.01em;
          color: #A6ACBE;
        }
      }
    }
    .select-lang {
        max-width: 55px;
        .v-input__slot:before {
            content: none;
        }
    }
  }
</style>
