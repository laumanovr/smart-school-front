<template>
	<div class="dashboard">
		<SuperAdminHeader>
			<template v-slot:title>Министерство Образования Кыргызской Республики</template>
			<template v-slot:userName>Супер Админ</template>
		</SuperAdminHeader>
		<div class="dashboard__container">
			<super-admin-sidebar />
            <div class="dashboard__container__body">
                <router-view></router-view>
            </div>
		</div>
	</div>
</template>

<script>
import SuperAdminSidebar from '@/components/navigations/sidebars/AdminSidebar'
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader'
export default {
  name: 'SuperAdminManage',
  components: { SuperAdminHeader, SuperAdminSidebar },
  computed: {
      userProfile () {
          return this.$store.state.account.profile;
      }
  }
}
</script>

<style lang="scss" scoped>
	.dashboard {
	  background: #f8f8fb;

	  &__container {
	    display: flex;
          height: calc(100vh - 76px);
          &__body {
              width: 100%;
              overflow-y: auto;
          }
	  }
	}
</style>
