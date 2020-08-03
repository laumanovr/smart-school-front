<template>
  <div class="super-admin-sidebar">
	  <div class="super-admin-sidebar__items">
		  <button
				  class="super-admin-sidebar__item"
				  v-for="(sidebar, index) in sidebars" :key="index"
				  :class="{ 'active' : $route.path === sidebar.route }"
				  @click="$router.push(sidebar.route)"
		  >
			  <img :src="require(`../../../assets/images/icons/${sidebar.icon}`)" alt="">
			  {{  sidebar.name  }}
		  </button>
	  </div>
	  <div class="super-admin-sidebar__setting">
		  <img src="../../../assets/images/icons/setting.svg" alt="">
	  </div>
  </div>
</template>

<script>
import { superAdminSidebars, schoolAdminSidebars } from '@/utils/sidebars'

export default {
  name: 'AdminSidebar',
	props: {
        type: {
            type: String,
	        default: 'superAdmin'
        }
	},
	data: () => ({
		sidebars: ''
	}),
	mounted () {
      if (this.type === 'superAdmin') this.sidebars = superAdminSidebars;
      else this.sidebars = schoolAdminSidebars;
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
	    margin: 20px auto;
          overflow-y: auto;
          height: 100%;
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
	    margin: 10px auto;
	    padding: 5px;
	    min-height: 50px;
	    min-width: 60px;

	    &.active {
          background: linear-gradient(180deg, #4A27F3 -33.33%, #339DFA 66.67%);
          box-shadow: 0px 3.68142px 9.20354px rgba(0, 0, 0, 0.05);
          border-radius: 5px;
	    }
	  }
	}
</style>
