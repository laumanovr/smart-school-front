<template>
  <div class="super-admin-sidebar">
	  <div class="super-admin-sidebar__items">
		  <button class="super-admin-sidebar__item active">
			  <img :src="require(`../../../assets/images/icons/setting.svg`)" alt="">
			  test
		  </button>
		  <button
				  class="super-admin-sidebar__item"
		          v-for="(sidebar, index) in sidebars" :key="index"
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
import { superAdminSidebars } from '@/utils/sidebars'

export default {
  name: 'SuperAdminSidebar',
	data: () => ({
		sidebars: superAdminSidebars
	})
}
</script>

<style lang="scss" scoped>
	.super-admin-sidebar {
      width: 96px;
      background: #1D194C;
	  height: calc(100vh - 76px);
	  display: flex;
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
	    margin: 5px auto;
        width: 68px;
        height: 60px;

	    &.active {
          background: linear-gradient(180deg, #4A27F3 -33.33%, #339DFA 66.67%);
          box-shadow: 0px 3.68142px 9.20354px rgba(0, 0, 0, 0.05);
          border-radius: 5px;
	    }
	  }
	}
</style>
