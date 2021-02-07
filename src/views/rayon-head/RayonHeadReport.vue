<template>
    <div class="rayon-head-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчеты</h3>
        </div>

        <div class="table-content">
            <table class="table bordered">
                <thead>
                <tr>
                    <th class="school">Школа</th>
                    <th>Движение учащихся</th>
                    <th>Качество знаний</th>
                    <th>Ведомость успеваемости</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="school in rayonSchools" :key="school.id">
                    <td class="school">{{ school.name }}</td>
                    <td>
                        <button class="show" @click="getSchoolData(school, 'activity')">Показать</button>
                    </td>
                    <td>
                        <button class="show" @click="getSchoolData(school, 'performance')">Показать</button>
                    </td>
                    <td>
                        <button class="show" @click="getSchoolData(school, 'statement')">Показать</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!--REPORT MODAL-->
        <modal name="report-modal" width="95%" height="95%" class="report-modal">
            <div class="modal-container">
                <div class="close">
                    <button @click="toggleReportModal">Закрыть</button>
                </div>
                <template v-if="reportType == 'activity'">
                    <AllClassActivityReport
                        :allChronicleYears="allChronicleYears"
                        :schoolQuarters="schoolQuarters"
                        :selectedSchool="selectedSchool"
                    />
                </template>
                <template v-if="reportType == 'performance'">
                    <AllClassesQualityReport
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
        </modal>
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
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            AllClassesQualityReport,
            AllClassActivityReport,
            ClassStatementReport,
            PreLoader
        },
        data() {
            return {
                reportType: '',
                isLoading: false,
                selectedSchool: {},
                allChronicleYears: [],
                schoolQuarters: [],
                rayonSchools: [],
                allClasses: [],
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            headRayonId() {
                return this.userProfile.rayons[0];
            }
        },
        created() {
            this.isLoading = true;
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
                schoolService.listPageable(0, '', this.headRayonId, '', 100).then((res) => {
                    if (res._embedded) {
                        this.rayonSchools = res._embedded.schoolResourceList;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            async getSchoolData(school, reportType) {
                this.isLoading = true;
                this.reportType = reportType;
                this.selectedSchool = school;
                await this.getSchoolQuarters();
                if (reportType === 'statement') {
                    await this.getSchoolAllClasses();
                }
                this.toggleReportModal();
            },

            toggleReportModal() {
                this.$modal.toggle('report-modal');
                this.$nextTick(() => {
                    this.isLoading = false;
                });
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
        },

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
        .table-content {
            table {
                font-weight: bold;
                th {
                    position: sticky;
                    top: -1px;
                    background: #fff;
                }
                .school {
                    width: 500px;
                    min-width: 480px;
                    max-width: 500px;
                }
                .show {
                    background: #1976d2;
                    color: #fff;
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-weight: 500;
                }
            }
        }

        .report-modal {
            .modal-container {
                height: 100%;
                overflow-y: auto;
                .close {
                    text-align: right;
                    button {
                        background: #ff4747;
                        border-radius: 4px;
                        padding: 0 5px;
                        color: #fff;
                    }
                }
            }
            // temp
            .student-activity-report-container, .admin-quality-knowledge-container {
                .report-content table.table {
                    width: 100%;
                }
                .print-btn {
                    width: 100%;
                }
            }
            // temp
            .class-statement-container .print-btn {
                width: 100%;
            }
        }
    }
</style>
