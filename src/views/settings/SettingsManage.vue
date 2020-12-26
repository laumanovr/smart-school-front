<template>
    <div class="settings-manage">
        <SuperAdminHeader>
            <template v-slot:title>~</template>
            <template v-slot:userName v-if="userProfile.user">
                {{ userProfile.user.firstName}} {{ userProfile.user.lastName }}
            </template>
            <template v-slot:roleName>Настройки</template>
        </SuperAdminHeader>
        <div class="settings-manage__container">
            <Sidebar :role="roleObj[userProfile.role[0].code]"/>
            <div class="settings-manage__body">
                <div class="settings-manage__main">
                    <div class="header-title">
                        <h3>Настройки</h3>
                    </div>
                    <div class="menu-selections">
                        <router-link to="/user-settings" class="selection" :class="{'active': $route.name == 'changePassword'}">Смена пароля</router-link>
                        <router-link :to="{name: 'userProfile'}" class="selection" :class="{'active': $route.name == 'userProfile'}">Профиль</router-link>
                    </div>
                    <div class="menu-content">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader';
    import Sidebar from '@/components/navigations/sidebars/Sidebar';

    export default {
        components: {Sidebar, SuperAdminHeader},
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            }
        },
        data() {
            return {
                roleObj: {
                    'ROLE_SUPER_ADMIN': 'superAdmin',
                    'ROLE_ADMIN': 'schoolAdmin',
                    'ROLE_INSTRUCTOR': 'instructor',
                    'ROLE_RAYON_HEADER': 'rayonHead',
                    'ROLE_DIRECTOR': 'director'
                }
            }
        },
    }
</script>

<style lang="scss">
    .settings-manage {
        margin-bottom: 50px;
        background: #f8f8fb;
        &__container {
            display: flex;
        }
        &__body {
            width: calc(100% - 100px);
            margin-left: 100px;
            min-height: 88vh;
        }
        &__main {
            margin: 0 30px;
        }
        .super-admin-sidebar {
            position: fixed;
            top: 0;
            height: 100vh;
        }
        .header-title {
            text-align: center;
            h3 {

            }
        }
        .menu-selections {
            display: flex;
            align-items: center;
            .selection {
                margin-right: 15px;
                border: 1px solid #dadada;
                background: #fff;
                padding: 2px 8px;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
                &.active {
                    background: #1976d2;
                    color: #fff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    cursor: default;
                }
            }
        }
        .menu-content {
            border-top: 1px solid #d4d4d4;
            margin-top: 20px;
            padding-top: 25px;
        }
    }
</style>
