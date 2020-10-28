<template>
    <div class="admin-report-container">
        <AllClassesQualityReport/>
    </div>
</template>

<script>
    import AllClassesQualityReport from '@/components/report/AllClassesQualityReport';
    export default {
        components: {
            AllClassesQualityReport
        }
    }
</script>

<style lang="scss">
    .admin-report-container {
        margin: 25px;
    }
</style>
