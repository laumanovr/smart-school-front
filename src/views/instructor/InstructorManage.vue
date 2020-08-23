<template>
	<div class="instructor-manage">
		<SuperAdminHeader>
			<template v-if="userProfile.schools" v-slot:title>{{ userProfile.schools[0].name }}</template>
			<template v-slot:userName>{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
		</SuperAdminHeader>
		<div class="instructor-manage__container">
			<AdminSidebar type="instructor"></AdminSidebar>
			<div class="instructor-manage__body">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import SuperAdminHeader from "@/components/navigations/sidebars/SuperAdminHeader";
import AdminSidebar from "@/components/navigations/sidebars/AdminSidebar";

export default {
	name: "InstructorManage",
	components: {AdminSidebar, SuperAdminHeader},
	computed: {
		userProfile() {
			return this.$store.state.account.profile;
		}
	}
}
</script>

<style lang="scss" scoped>
.instructor-manage {
	background: #f8f8fb;

	&__container {
		display: flex;
		height: calc(100vh - 76px);
	}

	&__body {
		width: calc(100% - 96px);
		overflow-y: auto;
	}
}
</style>
