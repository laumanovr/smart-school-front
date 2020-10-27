<template>
    <div class="instructor-report-container">
        <ClassQualityKnowledgeReport/>
    </div>
</template>

<script>
    import ClassQualityKnowledgeReport from '@/components/report/ClassQualityKnowledgeReport';
    export default {
        components: {
            ClassQualityKnowledgeReport
        }
    }
</script>

<style lang="scss" scoped>
.instructor-report-container {
    margin: 25px;
}
</style>
