<template>
    <div class="school-admin-schedule">
        <SuperAdminSchoolHead>
            <template v-slot:title>
                Расписание
            </template>
            <template v-slot:center>
                <md-button class="md-primary blue">
                    <router-link :to="{name: 'shifts'}">Все смены</router-link>
                </md-button>
            </template>
        </SuperAdminSchoolHead>

        <div class="temp-schedule-image">
            <img src="@/assets/images/schedule-screen.png">
        </div>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    export default {
        components: {
            SuperAdminSchoolHead
        }
    }
</script>

<style lang="scss" scoped>
    .temp-schedule-image {
        width: 1350px;
        margin: 0 auto;
        max-width: 100%;
        img {
            width: 100%;
        }
    }
</style>
