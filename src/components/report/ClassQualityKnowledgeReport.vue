<template>
    <div class="quality-knowledge-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчет по качеству знаний</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="instrClasses"
                item-text="classTitle"
                item-value="classId"
                label="Класс"
                :rules="required"
                v-model="reportObj.classId"
                class="v-select-item"
            />
            <v-select
                :items="allChronicleYears"
                item-text="selectorTitle"
                item-value="id"
                label="Академический год"
                :rules="required"
                v-model="reportObj.chronicleId"
                @change="getSchoolQuarters"
                class="v-select-item year"
            />
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="reportObj.quarterId"
                class="v-select-item"
                @change="setQuarterTitle"
            />
            <v-btn color="primary" @click="fetchQualityKnowledgeReport">Сгенерировать</v-btn>
        </v-form>

        <div class="report-content" ref="report" v-if="showTable">
            <div class="report-title">
                <h3>Отчет <br> по качеству знаний и успеваемости за {{selectedChronicleYear}}, четверть-{{selectedQuarterTitle}}, <br>
                    школы {{school.name}}</h3>
            </div>
            <table class="table bordered report">
                <thead>
                <tr>
                    <th>Класс</th>
                    <th>Число учащихся</th>
                    <th>"5"</th>
                    <th>"4"</th>
                    <th>"3"</th>
                    <th>"2"</th>
                    <th>Качество знаний %</th>
                    <th>Успеваемость %</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{classReport.classLevel + classReport.classLabel}}</td>
                    <td>{{classReport.totalStudentsCount}}</td>
                    <td>{{classReport.totalFive}}</td>
                    <td>{{classReport.totalFour}}</td>
                    <td>{{classReport.totalThree}}</td>
                    <td>{{classReport.totalTwo}}</td>
                    <td>{{countKnowledgeQuality()}} %</td>
                    <td>{{countPerformance()}} %</td>
                </tr>
                </tbody>
            </table>
            <h3 class="director-name">Директор:</h3>
        </div>

        <div class="print-btn" v-if="showTable">
            <v-btn color="primary" @click="printPdf">Экспорт</v-btn>
        </div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                reportObj: {
                    classId: '',
                    quarterId: '',
                    chronicleId: '',
                },
                showTable: false,
                isLoading: false,
                classReport: {},
                instrClasses: [],
                allChronicleYears: [],
                schoolQuarters: [],
                selectedClassTotalStudents: '',
                selectedChronicleYear: '',
                selectedQuarterTitle: ''
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

            getSchoolQuarters(chronicleId) {
                this.selectedChronicleYear = this.allChronicleYears.find((item) => item.id === chronicleId).selectorTitle;
                quarterService.getBySchoolAndChronicle(this.school.id, chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            setQuarterTitle(quatId) {
                this.selectedQuarterTitle = this.schoolQuarters.find(quat => quat.id === quatId).semester;
                this.showTable = false;
            },

            fetchQualityKnowledgeReport() {
                if (this.$refs.form.validate()) {
                    this.isLoading = true;
                    this.showTable = false;
                    AnalyticsService.getStudentPerformance(
                        this.school.id,
                        this.reportObj.chronicleId,
                        this.reportObj.quarterId,
                        this.reportObj.classId
                    ).then((res) => {
                        if (res.length) {
                            this.classReport = res[0];
                            AnalyticsService.getTotalStudentsCount(this.school.id, this.reportObj.classId).then((res) => {
                                this.classReport.totalStudentsCount = res[0].totalStudentCount;
                                const totalStudents = this.classReport.totalStudentsCount;
                                const klass = this.classReport;
                                const total = klass.totalFive + klass.totalFour + klass.totalThree + klass.totalTwo;
                                this.classReport.totalFive = this.countTotal((totalStudents * (klass.totalFive / total)).toFixed(1));
                                this.classReport.totalFour = this.countTotal((totalStudents * (klass.totalFour / total)).toFixed(1));
                                this.classReport.totalThree = this.countTotal((totalStudents * (klass.totalThree / total)).toFixed(1));
                                this.classReport.totalTwo = this.countTotal((totalStudents * (klass.totalTwo / total)).toFixed(1));
                                this.showTable = true;
                                this.isLoading = false;
                            }).catch((err) => {
                                this.$toast.error(err);
                                this.isLoading = false;
                            });
                        } else {
                            this.$toast.info('Ничего не найдено!');
                            this.isLoading = false;
                        }
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            countTotal(number) {
                if (number[2].includes('9')) {
                    return Math.ceil(number);
                } else if (number > 0 && number < 1) {
                    return 1;
                } else if (number >= 1) {
                    return Math.floor(number);
                } else {
                    return 0;
                }
            },

            countKnowledgeQuality() {
                const totalGrades = this.classReport.totalFive + this.classReport.totalFour;
                const result = (totalGrades / this.classReport.totalStudentsCount) * 100;
                return result.toFixed(1);
            },

            countPerformance() {
                const klass = this.classReport;
                const totalGrades = klass.totalFive + klass.totalFour + klass.totalThree + klass.totalTwo;
                const result = (totalGrades / klass.totalStudentsCount) * 100;
                return result.toFixed(1);
            },

            printPdf() {
                this.$refs.report.style.width = '120vh';
                this.$refs.report.style.height = '120vh';
                this.$refs.report.querySelector('.report-title').style.width = '1170px';
                const clonedTable = this.$refs.report.cloneNode(true);
                this.synchronizeCssStyles(this.$refs.report, clonedTable, true);
                clonedTable.style.transform = 'rotate(90deg)';
                clonedTable.style.margin = '0';
                let win = window.open('', '');
                win.document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';
                win.document.body.innerHTML = (clonedTable.outerHTML);
                win.print();
                win.onafterprint = window.navigator.appVersion.includes('Mac') ? () => win.close() : win.close();
                this.$refs.report.style.width = 'auto';
                this.$refs.report.style.height = 'auto';
                this.$refs.report.querySelector('.report-title').style.width = 'auto';
            },

            synchronizeCssStyles(src, destination, recursively) {
                destination.style.cssText = this.getComputedStyleCssText(src);
                if (recursively) {
                    const vSrcElements = src.getElementsByTagName('*');
                    const vDstElements = destination.getElementsByTagName('*');
                    for (let i = vSrcElements.length; i--;) {
                        const vSrcElement = vSrcElements[i];
                        const vDstElement = vDstElements[i];
                        vDstElement.style.cssText = this.getComputedStyleCssText(vSrcElement);
                    }
                }
            },

            getComputedStyleCssText(element) {
                const cssObject = window.getComputedStyle(element);
                const cssAccumulator = [];
                if (cssObject.cssText !== '') {
                    return cssObject.cssText;
                }
                for (let prop in cssObject) {
                    if (typeof cssObject[prop] === 'string') {
                        cssAccumulator.push(prop + ' : ' + cssObject[prop]);
                    }
                }
                return cssAccumulator.join('; ');
            },
        }
    }
</script>

<style lang="scss">
    .quality-knowledge-container {
        .v-select-item {
            max-width: 160px;
            &.year {
                max-width: 175px;
            }
        }
        .report-content {
            text-align: center;
            margin-top: 25px;
            .report-title {
                text-align: center;
            }
            table.report {
                table-layout: fixed;
                width: 1190px;
                margin: 25px auto;
                th, td {
                    padding: 0 8px;
                }
                th {
                    color: #f84c4c;
                    padding: 0 16px;
                }
                td {
                    font-weight: bold;
                    height: 30px;
                }
            }
        }

        .print-btn {
            width: 1190px;
            margin: 30px auto;
            text-align: right;
            .v-btn:not(.v-btn--round).v-size--default {
                height: 30px;
                padding: 0 10px;
            }
            .v-btn__content {
                font-size: 12px;
            }
        }
    }
</style>
