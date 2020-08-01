<template>
	<div class="school-admin-manage">
		<SuperAdminHeader>
			<template v-slot:title>{{ userProfile.schools[0].name }}</template>
			<template v-slot:userName>{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
		</SuperAdminHeader>
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
    components: { AdminSidebar, SuperAdminHeader },
	computed: {
        userProfile () {
            return this.$store.state.account.profile
        }
	}
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
