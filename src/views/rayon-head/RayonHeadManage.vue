<template>
    <div class="rayon-head-manage">
        <SuperAdminHeader>
            <template v-slot:title>{{ fullRayonTitle }}</template>
            <template v-slot:userName v-if="userProfile.user">{{ userProfile.user.firstName }} {{ userProfile.user.lastName }}</template>
            <template v-slot:roleName>Глава Района</template>
        </SuperAdminHeader>
        <div class="rayon-head-manage__container">
            <Sidebar :role="'rayonHead'"/>
            <div class="rayon-head-manage__body" id="rayon-head-manage__body">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import SuperAdminHeader from '@/components/navigations/sidebars/SuperAdminHeader';
    import Sidebar from '@/components/navigations/sidebars/Sidebar';
    import {RayonService} from '@/_services/rayon.service';
    const rayonService = new RayonService();

    export default {
        name: 'SchoolAdminManage',
        components: { Sidebar, SuperAdminHeader },
        data() {
            return {
                fullRayonTitle: ''
            }
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile;
            },
            headRayonId() {
                return this.userProfile.rayons ? this.userProfile.rayons[0] : 0;
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (this.headRayonId) {
                    rayonService.getById(this.headRayonId).then((res) => {
                        this.fullRayonTitle = `${res.title} - ${res.region.title}`;
                    }).catch((err) => {
                        this.$toast.error(err);
                    })
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .rayon-head-manage {
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
