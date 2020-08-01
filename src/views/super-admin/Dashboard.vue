<template>
	<div class="dashboard">
		<SuperAdminHeader>
			<template v-slot:title>Министерство Образования Кыргызской Республики</template>
			<template v-slot:userName>Азамат Жеенбеков</template>
		</SuperAdminHeader>
		<div class="dashboard__container">
			<super-admin-sidebar />
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import SuperAdminSidebar from '@/components/navigations/sidebars/AdminSidebar';
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader'
export default {
	name: 'Dashboard',
	components: { SuperAdminHeader, SuperAdminSidebar },
	data () {
		return {
			das: ''
		};
	}
};
</script>

<style lang="scss" scoped>
	.dashboard {
	  height: 100vh;
	  background: #E5E5E5;

	  &__container {
	    display: flex;
	  }
	}
</style>
