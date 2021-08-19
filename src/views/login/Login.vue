<template>
    <div class="login-container">
        <!--<router-link to="/" class="home-btn">-->
            <!--<img src="@/assets/images/landing/next.svg" class="left" alt="next">-->
            <!--<span class="to-home-page">На главную</span>-->
        <!--</router-link>-->
        <div class="login-page">
            <PreLoader v-if="isLoading"/>
            <div class="login-page__images">
                <div>
                    <img src="../../assets/images/background-image.svg">
                </div>
                <div class="globus-container">
                    <img src="../../assets/images/globus.svg" width="120">
                </div>
            </div>
            <div class="login-page__form">
                <div class="login-with-esi" @click="loginWithESI">Войти через ЕСИА</div>
                <div class="login-page__form__head">
                    Войти
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="login-page__form__item">
                        <label>Логин</label>
                        <input
                            v-model="username"
                            name="username"
                            placeholder="Ваш логин"
                        >
                    </div>
                    <div class="login-page__form__item">
                        <label>Пароль</label>
                        <input
                            v-model="password"
                            placeholder="Ваш пароль"
                            type="password"
                        >
                    </div>
                    <div>
                        <div class="login-page__form__item center top-mg">
                            <button>ВОЙТИ</button>
                        </div>
                        <div class="login-page__form__item center">
                        </div>
                    </div>
                    <div class="login-page__form__footer">
                        <!--<div>Забыли пароль?</div>-->
                        <!--<div>Регистрация</div>-->
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import PreLoader from '@/components/preloader/PreLoader';
import EsiaService from '@/_services/esia.service';

export default {
    components: {
        PreLoader
    },
	data () {
		return {
		    isLoading: false,
			username: '',
			password: '',
		};
	},
    computed: {
        ...mapState('account', ['onError'])
    },
    beforeCreate() {
        const isInitial = window.sessionStorage.getItem('isInitial');
        if (!isInitial) {
            window.location.reload();
            window.sessionStorage.setItem('isInitial', true);
        }
    },
	methods: {
		...mapActions('account', [ 'login', 'logout' ]),
		handleSubmit() {
			const { username, password } = this;
			if (username && password) {
			    this.isLoading = true;
				this.login({ username, password });
			}
		},

        loginWithESI() {
            this.isLoading = true;
            EsiaService.authenticateWithESI().then((res) => {
                if (res.url.includes('ReturnUrl')) {
                    window.location.href = res.url;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        }
	},
    watch: {
        onError(message) {
            if (message) {
                this.isLoading = false;
                this.$toast.error('Неправильный логин или пароль!');
                this.$store.state.account.onError = '';
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
.login-container {
    position: relative;
    background: linear-gradient(180deg, #F6FAFD 0%, #FFFFFF 19.4%);
    .home-btn {
        position: absolute;
        top: 10px;
        left: 12px;
        background: #fff;
        padding: 6px 12px;
        border-radius: 50px;
        border: 1px solid #eee;
        cursor: pointer;
        text-decoration: none;
        .left {
            transform: rotate(180deg);
            margin-right: 8px;
        }
        .to-home-page {
            background: #fff;
            font-size: 18px;
        }
        &:hover {
            border-color: royalblue;
        }
    }
}
.login-page {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(180deg, #F6FAFD 0%, #FFFFFF 19.4%);
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100vh;
  &__images {
    div:first-child {
      margin-bottom: 100px;
    }
  }
  &__form {
    width: 540px;
    max-height: 667px;
    padding: 3rem;
    background: #FFFFFF;
    box-shadow: 5px 10px 50px rgba(16, 112, 177, 0.2);
    form {
      height: 100%;
    }
    &__head {
      font-weight: 500;
      font-size: 24px;
      line-height: 160%;
      color: #4B5D68;
    }
    &__item {
      letter-spacing: 0.04em;
      font-size: 16px;
      line-height: 30px;
      margin: 30px 0;
      input {
        width: 428px;
        border: 1px solid rgba(#356EAD, 0.4);
        box-sizing: border-box;
        border-radius: 10px;
        height: 51px;
        padding: 0 20px;
        font-weight: 300;
        color: #1F3F68;
        &::placeholder {
          color: rgba(#1F3F68, 0.2);
        }
      }
      label {
        color: rgba(#1F3F68, 0.8);
      }
      button {
        width: 344px;
        height: 52px;
        line-height: 26px;
        font-weight: 500;
        color: #FFFFFF;
        background: linear-gradient(180deg, #166EFF 0%, #281AC8 100%, #281AC8 100%);
        /* shadow1 */
        box-shadow: 5px 20px 50px rgba(16, 112, 177, 0.2);
        border-radius: 10px;
        &.cancel-btn {
          background: none;
          box-shadow: none;
          border-radius: 0;
          color: #1466ED;
          line-height: 26px;
        }
      }
      &.center {
        display: flex;
        justify-content: center;
        margin: 10px 0;
      }
      &.top-mg {
        margin-top: 40px;
      }
    }
    &__footer {
      display: flex;
      justify-content: space-between;
      color: #1466ED;
      font-weight: normal;
      font-size: 14px;
      line-height: 30px;
    }
    .login-with-esi {
        text-align: center;
        transform: translateY(-30px);
        /*color: #4B5D68;*/
        color: transparent;
        cursor: pointer;
    }
  }
}
.globus-container {
  position: absolute;
  left: 35px;
  bottom: 8%;
}
</style>
