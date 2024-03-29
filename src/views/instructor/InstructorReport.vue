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
                :instrClasses="teachClasses"
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
        <template v-if="reportType == 'attendance'">
            <ClassAttendanceReport
                :allChronicleYears="allChronicleYears"
                :classes="instrClasses"
                :schoolQuarters="schoolQuarters"
            />
        </template>
        <template v-if="reportType === 'assignment'">
            <InstructorAssignmentReport
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
    import ClassAttendanceReport from '@/components/report/ClassAttendanceReport';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import InstructorAssignmentReport from '@/components/report/InstructorAssignmentReport';

    export default {
        components: {
            ClassQualityKnowledgeReport,
            StudentActivityReport,
            ClassStatementReport,
            ClassAttendanceReport,
            InstructorAssignmentReport
        },
        data() {
            return {
                langObj: {
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                reportType: '',
                instrClasses: [],
                teachClasses: [],
                allChronicleYears: [],
                schoolQuarters: [],
                reportTypes: [
                    {title: 'Отчет по движению', type: 'activity'},
                    {title: 'Отчет по качеству знаний', type: 'performance'},
                    {title: 'Ведомость успеваемости', type: 'statement'},
                    {title: 'Отчет посещаемости', type: 'attendance'},
                    {title: 'Отчет по ДЗ', type: 'assignment'}
                ]
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            },
            currentLang() {
                return this.$root.$i18n.locale;
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
                    this.getInstrTeachClasses();
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getInstrTeachClasses() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    this.teachClasses = res.map((item) => {
                        item.classTitle = `${item.classLevel}${item.classLabel} - ` + item[this.langObj[this.currentLang]];
                        return item;
                    }).sort((a, b) => a.classLevel - b.classLevel);
                    this.teachClasses = [...this.instrClasses, ...this.teachClasses];
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
