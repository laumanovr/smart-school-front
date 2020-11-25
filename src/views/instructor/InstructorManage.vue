<template>
	<div class="instructor-manage">
		<SuperAdminHeader>
			<template v-if="userProfile.schools" v-slot:title>{{ userProfile.schools[0].name }}</template>
			<template v-if="userProfile.user" v-slot:userName>{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
            <template v-slot:roleName>Учитель</template>
		</SuperAdminHeader>
		<div class="instructor-manage__container">
			<Sidebar :role="'instructor'"/>
			<div class="instructor-manage__body">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script>
import SuperAdminHeader from "@/components/navigations/sidebars/SuperAdminHeader";
import Sidebar from "@/components/navigations/sidebars/Sidebar";

export default {
	name: "InstructorManage",
	components: {Sidebar, SuperAdminHeader},
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
		/*height: calc(100vh - 76px);*/
	}

	&__body {
        width: calc(100% - 100px);
        margin-left: 100px;
        min-height: 88vh;
        overflow-x: auto;
		/*width: calc(100% - 96px);*/
		/*overflow-y: auto;*/
	}
    .super-admin-sidebar {
        /**/
        position: fixed;
        top: 0;
        height: 100vh;
    }
}
</style>
