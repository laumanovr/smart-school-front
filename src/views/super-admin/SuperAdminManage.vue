<template>
	<div class="dashboard">
		<SuperAdminHeader>
			<template v-slot:title>Министерство Образования Кыргызской Республики</template>
			<template v-slot:userName>Супер Админ</template>
		</SuperAdminHeader>
		<div class="dashboard__container">
			<Sidebar :role="'superAdmin'"/>
            <div class="dashboard__container__body">
                <router-view></router-view>
            </div>
		</div>
	</div>
</template>

<script>
import Sidebar from '@/components/navigations/sidebars/Sidebar';
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader';

export default {
  name: 'SuperAdminManage',
  components: { SuperAdminHeader, Sidebar },
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
