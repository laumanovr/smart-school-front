<template>
	<div class="school-admin-manage">
		<SuperAdminHeader></SuperAdminHeader>
		<div class="school-admin-manage__body">
			<AdminSidebar type="schoolAdmin"></AdminSidebar>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader'
import AdminSidebar from '@/components/navigations/sidebars/AdminSidebar'
export default {
name: "SchoolAdminManage",
    components: { AdminSidebar, SuperAdminHeader }
}
</script>

<style lang="scss" scoped>
	.school-admin-manage {
	  height: 100vh;
      background: #E5E5E5;

	  &__body {
	    display: flex;
	  }
	}
</style>
