<template>
	<div class="dashboard">
		<SuperAdminHeader>
			<template v-slot:title>Министерство Образования Кыргызской Республики</template>
			<template v-slot:userName>Министр</template>
		</SuperAdminHeader>
		<div class="dashboard__container">
			<Sidebar :role="'minEducation'"/>
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
            &__body {
                width: calc(100% - 100px);
                margin-left: 100px;
                min-height: 88vh;
            }
            .super-admin-sidebar {
                position: fixed;
                top: 0;
                height: 100vh;
            }
        }
    }
</style>
