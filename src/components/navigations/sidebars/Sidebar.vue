<template>
    <div class="super-admin-sidebar">
        <div class="super-admin-sidebar__items">
            <template v-for="(tab, index) in sidebars">
                <router-link
                    v-if="tab.route"
                    :key="index"
                    :class="{'active' : $route.path === tab.route}"
                    :to="tab.route"
                    class="super-admin-sidebar__item"
                >
                    <img :src="require(`../../../assets/images/icons/${tab.icon}`)">
                    {{ tab.name }}
                </router-link>
                <div class="users" v-if="tab.users" :class="{'expanded': isExpand}">
                    <router-link
                        v-for="innerTab in tab.users"
                        :to="innerTab.route"
                        :key="innerTab.route"
                        class="super-admin-sidebar__item"
                        :class="{'active' : $route.path === innerTab.route}"
                        @click.native="expandTabs(innerTab)"
                    >
                        <img :src="require(`../../../assets/images/icons/${innerTab.icon}`)">
                        {{innerTab.name}}
                    </router-link>
                </div>
            </template>
        </div>
        <div class="super-admin-sidebar__setting">
            <img alt="" src="../../../assets/images/icons/setting.svg">
        </div>
    </div>
</template>

<script>
import Sidebar from '@/utils/sidebars';

export default {
    name: 'Sidebar',
    props: {
        role: String
    },
    data: () => ({
        sidebars: [],
        isExpand: false
    }),
    mounted() {
        this.sidebars = Sidebar[this.role];
    },
    methods: {
        expandTabs(tab) {
            if (tab.route === '#') {
                this.isExpand = !this.isExpand;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-sidebar {
    width: 96px;
    background: #1D194C;
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;

    &__setting {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 64px;
        border-top: 1px solid #494E67;
    }

    &__items {
        margin: 5px 0;
        overflow-y: auto;
        height: 100%;
        &::-webkit-scrollbar {
            width: 3px;
            height: 2px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #339DFA;
        }
    }

    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 11px;
        line-height: 13px;
        letter-spacing: 0.01em;
        color: #FFFFFF;
        margin: 10px 4px;
        padding: 5px;
        min-height: 50px;
        min-width: 60px;
        transition: 1s;
        text-align: center;
        text-decoration: none;

        &.active {
            background: linear-gradient(180deg, #4A27F3 -33.33%, #339DFA 66.67%);
            box-shadow: 0 3.68142px 9.20354px rgba(0, 0, 0, 0.05);
            border-radius: 5px;
        }
	    &:hover {
		    text-decoration: unset;
	    }
    }
    .users {
        max-height: 65px;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        will-change: max-height;
        &.expanded {
            max-height: 310px;
            transition: max-height 0.3s ease-in;
            background: #282552;
        }
    }
}
</style>
