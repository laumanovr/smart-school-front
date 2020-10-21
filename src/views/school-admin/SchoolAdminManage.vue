<template>
	<div class="school-admin-manage">
		<SuperAdminHeader>
			<template v-slot:title v-if="userProfile.schools">{{ userProfile.schools[0].name }}</template>
			<template v-slot:userName v-if="userProfile.user">{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
            <template v-slot:roleName>Админ школы</template>
		</SuperAdminHeader>
		<div class="school-admin-manage__container">
			<Sidebar :role="'schoolAdmin'"/>
			<div class="school-admin-manage__body" id="school-admin-manage__body">
                <router-view></router-view>
            </div>
		</div>
	</div>
</template>

<script>
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader';
import Sidebar from '@/components/navigations/sidebars/Sidebar';

export default {
  name: 'SchoolAdminManage',
  components: { Sidebar, SuperAdminHeader },
  computed: {
    userProfile () {
      return this.$store.state.account.profile
    }
  }
}
</script>

<style lang="scss" scoped>
	.school-admin-manage {
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
