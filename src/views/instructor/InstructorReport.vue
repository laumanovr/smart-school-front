<template>
    <div class="instructor-report-container">
        <div class="header-title">
            <h3>Отчеты</h3>
            <v-select
                class="v-select-item"
                placeholder="Выбрать"
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
                :schoolQuarters="schoolQuarters"
            />
        </template>
        <template v-if="reportType == 'activity'">
            <StudentActivityReport
                :instrClasses="instrClasses"
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
            />
        </template>
        <template v-if="reportType == 'statement'">
            <ClassStatementReport
                :allChronicleYears="allChronicleYears"
                :classes="instrClasses"
                :schoolQuarters="schoolQuarters"
            />
        </template>
    </div>
</template>

<script>
    import ClassQualityKnowledgeReport from '@/components/report/ClassQualityKnowledgeReport';
    import StudentActivityReport from '@/components/report/StudentActivityReport';
    import ClassStatementReport from '@/components/report/ClassStatementReport';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();

    export default {
        components: {
            ClassQualityKnowledgeReport,
            StudentActivityReport,
            ClassStatementReport
        },
        data() {
            return {
                reportType: '',
                instrClasses: [],
                allChronicleYears: [],
                schoolQuarters: [],
                reportTypes: [
                    {title: 'Отчет по движению', type: 'activity'},
                    {title: 'Отчет по качеству знаний', type: 'performance'},
                    {title: 'Ведомость успеваемости', type: 'statement'}
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
            this.getSchoolQuarters();
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

            getSchoolQuarters() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
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
