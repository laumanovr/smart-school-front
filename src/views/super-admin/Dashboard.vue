<template>
	<div>
		<SuperAdminHeader></SuperAdminHeader>
		<super-admin-sidebar />
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

<style scoped>

</style>
