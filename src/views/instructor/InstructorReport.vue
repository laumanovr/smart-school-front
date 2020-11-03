<template>
    <div class="instructor-report-container">
        <div class="header-title">
            <h3>Отчеты</h3>
            <v-select
                class="v-select-item"
                :items="reportTypes"
                item-text="title"
                item-value="type"
                @change="changeReport"
            />
        </div>
        <template v-if="reportType == 'performance'">
            <ClassQualityKnowledgeReport
                :instrClasses="instrClasses"
                :allChronicleYears="allChronicleYears"
            />
        </template>
        <template v-if="reportType == 'activity'">
            <StudentActivityReport
                :instrClasses="instrClasses"
                :allChronicleYears="allChronicleYears"
            />
        </template>
    </div>
</template>

<script>
    import ClassQualityKnowledgeReport from '@/components/report/ClassQualityKnowledgeReport';
    import StudentActivityReport from '@/components/report/StudentActivityReport';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();

    export default {
        components: {
            ClassQualityKnowledgeReport,
            StudentActivityReport
        },
        data() {
            return {
                reportType: '',
                instrClasses: [],
                allChronicleYears: [],
                reportTypes: [
                    {title: 'Отчет по движению', type: 'activity'},
                    {title: 'Отчет по качеству знаний', type: 'performance'}
                ]
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        created() {
            this.fetchInstructorClasses();
            this.getAllChronicleYears();
        },
        methods: {
            fetchInstructorClasses() {
                instructorClassService.getByInstructorId(this.userProfile.personId).then((res) => {
                    if (res._embedded) {
                        this.instrClasses = res._embedded.instructorClassResourceList.map((klass) => {
                            klass.classTitle = klass.classLevel + klass.classLabel;
                            return klass;
                        });
                    }
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getAllChronicleYears() {
                chronicleService.list().then((res) => {
                    this.allChronicleYears = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            changeReport(type) {
                this.reportType = type;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-report-container {
        margin: 25px 25px 45px;
        .header-title {
            display: flex;
            align-items: center;
            .v-select-item {
                margin-left: 25px;
            }
        }
    }
</style>
