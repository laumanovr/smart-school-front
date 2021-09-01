<template>
    <div class="nav">
        <div class="logo">
            <img src="@/assets/images/landing/logo2.png" alt="logo2">
        </div>
        <div class="menu" id="showMenu" ref="showMenu">
            <i class="fa fa-close" @click="RemoveMenu"></i>
            <ul class="navbar-nav ml-auto" ref="showul">
                <li class="nav-item">
                    <router-link :to="{name:'home'}" class="link" :class="{'active': $route.name == 'home'}">
                        Главная
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{name:'about'}" class="link" :class="{'active': $route.name == 'about'}">
                        О проекте
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="{name:'opportunity'}" class="link"
                                 :class="{'active': $route.name == 'opportunity'}">
                        Возможности
                    </router-link>
                </li>
<!--                <li class="nav-item">-->
<!--                    <router-link :to="{name:'support'}" class="link" :class="{'active': $route.name == 'support'}">-->
<!--                        Поддержка-->
<!--                    </router-link>-->
<!--                </li>-->
                <!--<li  class="nav-item">-->
                <!--<router-link :to="{name:'registration'}" class="link" :class="{'active': $route.name == 'home'}">-->
                <!--Регистрация-->
                <!--</router-link>-->
                <!--</li>-->
            </ul>
            <router-link :to="{name:'login'}" class="sign">
                Войти <img src="@/assets/images/landing/next.svg" alt="next ">
            </router-link>
        </div>
        <i class="fa fa-bars" @click="ShowMenu"></i>
    </div>

</template>

<script>
    export default {
        name: "navbar",
        data() {
            return {
                activeItem: ''
            }
        },
        methods: {
            ShowMenu() {
                this.$refs.showMenu.style.visibility = "visible";
                console.log(this.$refs.showMenu.style.right)
            },
            RemoveMenu() {
                this.$refs.showMenu.style.visibility = "hidden ";
                console.log(this.$refs.showMenu.style.right)
            }
        },
    }
</script>

<style scoped>
    .nav {
        box-sizing: border-box;
        width: 100%;
        padding: 56px 80px 50px 80px;
        margin-right: auto;
        margin-left: auto;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    .logo {
        display: inline-block;
        margin: 0;
        padding: 0;
    }

    /*Войти буттон*/
    .sign {
        border: none;
        padding: 20px 24px;
        border-radius: 50px;
        background: #FFFFFF;
        box-shadow: 0 5px 25px rgba(75, 93, 104, 0.1);
        font-weight: bold;
        font-size: 16px;
        text-decoration: none;
        margin-left: 20px;
    }

    .sign:hover {
        border: 1px solid #167ce9;
    }

    .sign img {
        margin-left: 15px;
        background: #FFFFFF;
    }

    .sign:hover a {
    }

    .sign a {
        text-decoration: none;
        color: #212353;
        padding: 10px;
    }

    .menu {
    }

    .navbar-nav {
        box-sizing: border-box;
        display: inline;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }

    ul {
        box-sizing: border-box;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }

    li {
        display: list-item;
        text-align: -webkit-match-parent;
    }

    .nav-item .active, li a:hover {
        color: #167ce9;
    }

    .ml-auto {
        margin-left: auto !important;
    }

    .nav-item {
        margin: 0;
        list-style: none;
        display: inline-block;
        padding: 42px 0;
    }

    .nav-item a {
        font-family: Helvetica;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 160%;
        text-decoration: none;
        text-align: center;
        color: #4B5D68;
        padding-right: 25px;
        margin: 0;
        box-sizing: border-box;
        padding-left: 25px;
    }

    .nav .fa {
        display: none;
    }

    @media (max-width: 1216px) {
        .nav {
            max-width: 1200px;
            width: 100%;
            padding-left: 50px;
            padding-top: 30px;
            padding-bottom: 50px;
            padding-right: 40px;
        }

        .nav-item a {
            padding-right: 10px;
            padding-left: 10px;
        }

        .menu {
            flex-basis: auto;
        }

    }

    @media (max-width: 992px) {
        .fa-bars {
            position: absolute;
            right: 30px;
            background: #1122c4;
        }

        .nav .fa {
            display: block;
            color: #fff;
            margin: 15px 25px;
            font-size: 22px;
            cursor: pointer;
        }

        .menu {
            height: 100vh;
            width: 200px;
            background: linear-gradient(180deg, #563ae5 0%, #339DFA 100%);
            top: 0;
            right: 0;
            position: absolute;
            visibility: hidden;
            text-align: left;
            z-index: 2;
        }

        .nav-item {
            padding: 15px 15px;
        }

        .navbar-nav li {
            display: block;
            text-align: left;
        }

        .navbar-nav li:hover {
            color: #073c76;
        }

        .nav-item .active, menu ul a {
            color: #073c76;
        }

        .menu ul a {
            line-height: normal;
            color: white;
            font-weight: 800;
            font-size: 20px;

        }

        .menu .sign {
            float: none;
            margin-left: 20px;
            margin-top: 15px;
        }

        .nav .fa {
            display: block;

        }
    }

    @media (max-width: 700px) {
        .fa-bars {
            position: absolute;
            right: 30px;
            background: #1122c4;
        }

        .nav .fa {
            display: block;
            color: #fff;
            margin: 15px 25px;
            font-size: 22px;
            cursor: pointer;
        }

        .menu {
            height: 100vh;
            width: 200px;
            background: linear-gradient(180deg, #563ae5 0%, #339DFA 100%);
            top: 0;
            right: 0;
            position: absolute;
            visibility: hidden;
            text-align: left;
            z-index: 2;
        }

        .nav-item {
            padding: 15px 15px;
        }

        .navbar-nav li {
            display: block;
            text-align: left;
        }

        .menu ul a {
            line-height: normal;
        }

        .menu .sign {
            float: none;
            margin-left: 20px;
            margin-top: 15px;
        }

        .nav .fa {
            display: block;

        }
    }
</style>
