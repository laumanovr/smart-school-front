<template>
	<div class="director-manage">
		<SuperAdminHeader>
			<template v-slot:title v-if="userProfile.schools">{{ userProfile.schools[0].name }}</template>
			<template v-slot:userName v-if="userProfile.user">{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
            <template v-slot:roleName>Директор школы</template>
		</SuperAdminHeader>
		<div class="director-manage__container">
			<Sidebar :role="'director'"/>
			<div class="director-manage__body" id="director-manage__body">
                <router-view></router-view>
            </div>
		</div>
	</div>
</template>

<script>
import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader';
import Sidebar from '@/components/navigations/sidebars/Sidebar';

export default {
  components: { Sidebar, SuperAdminHeader },
  computed: {
    userProfile () {
      return this.$store.state.account.profile
    }
  }
}
</script>

<style lang="scss">
    .director-manage {
        background: #f8f8fb;

        &__container {
            display: flex;
        }
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
</style>
