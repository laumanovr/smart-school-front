<template>
    <div class="rayon-head-container">
        <div class="header-title">
            <h3>Отчеты</h3>
            <v-select
                class="v-select-item school"
                placeholder="Школа"
                :items="rayonSchools"
                item-text="name"
                :return-object="true"
                @change="getSchoolData"
            />
            <v-select
                v-if="showSelectReport"
                class="v-select-item"
                placeholder="Отчет"
                :items="reportTypes"
                item-text="title"
                item-value="type"
                v-model="reportType"
            />
        </div>
        <template v-if="reportType == 'performance'">
            <AllClassesQualityReport
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
                :selectedSchool="selectedSchool"
            />
        </template>
        <template v-if="reportType == 'activity'">
            <AllClassActivityReport
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
                :selectedSchool="selectedSchool"
            />
        </template>
        <template v-if="reportType == 'statement'">
            <ClassStatementReport
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
                :classes="allClasses"
                :selectedSchool="selectedSchool"
            />
        </template>
    </div>
</template>

<script>
    import AllClassesQualityReport from '@/components/report/AllClassesQualityReport';
    import AllClassActivityReport from '@/components/report/AllClassActivityReport';
    import ClassStatementReport from '@/components/report/ClassStatementReport';
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import SchoolClassService from '@/_services/school-class.service';
    import {SchoolService} from '@/_services/school.service';
    const schoolService = new SchoolService();

    export default {
        components: {
            AllClassesQualityReport,
            AllClassActivityReport,
            ClassStatementReport
        },
        data() {
            return {
                reportType: '',
                showSelectReport: false,
                selectedSchool: {},
                allChronicleYears: [],
                schoolQuarters: [],
                rayonSchools: [],
                allClasses: [],
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
            headRayonId() {
                return this.userProfile.rayons[0];
            }
        },
        created() {
            this.getAllChronicleYears();
            this.getRayonSchools();
        },
        methods: {
            getAllChronicleYears() {
                chronicleService.list().then((res) => {
                    this.allChronicleYears = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getRayonSchools() {
                schoolService.listPageable(0, '', this.headRayonId).then((res) => {
                    if (res._embedded) {
                        this.rayonSchools = res._embedded.schoolResourceList;
                    }
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getSchoolData(school) {
                this.selectedSchool = school;
                this.getSchoolQuarters();
                this.getSchoolAllClasses();
                this.reportType = '';
                this.showSelectReport = true;
            },

            getSchoolQuarters() {
                quarterService.getBySchoolAndChronicle(this.selectedSchool.id, this.selectedSchool.chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getSchoolAllClasses() {
                SchoolClassService.getAllBySchool(this.selectedSchool.id).then((res) => {
                    this.allClasses = res.map((klass) => {
                        klass.classTitle = klass.classLevel + klass.classLabel;
                        klass.classId = klass.id;
                        return klass;
                    });
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },
        }
    }
</script>

<style lang="scss">
    .rayon-head-container {
        margin: 30px 30px 40px;
        .header-title {
            display: flex;
            align-items: center;
            .v-select-item {
                margin: 0;
                max-width: 170px;
                &.school {
                    margin: 0 20px;
                }
            }
        }
    }
</style>
