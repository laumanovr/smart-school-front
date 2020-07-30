<template>
	<div class="dashboard">
		<SuperAdminHeader></SuperAdminHeader>
		<super-admin-sidebar />
		<div class="dashboard__body"></div>
	</div>
</template>

<script>
import SuperAdminSidebar from '@/components/navigations/sidebars/SuperAdminSidebar';
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
	}
</style>
