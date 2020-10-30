<template>
    <div class="admin-quality-knowledge-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчет по качеству знаний</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
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
                <h3>
                    Отчет <br> по качеству знаний и успеваемости за {{selectedChronicleYear}}, четверть-{{selectedQuarterTitle}}, <br>
                    школы {{school.name}}
                </h3>
            </div>
            <table class="table bordered report">
                <thead>
                <tr>
                    <th>Классы</th>
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
                <tr v-for="klass in classReports" :key="klass.classLevel">
                    <td>{{klass.classLevel}}</td>
                    <td>{{klass.totalStudentCount}}</td>
                    <td>{{klass.totalFive}}</td>
                    <td>{{klass.totalFour}}</td>
                    <td>{{klass.totalThree}}</td>
                    <td>{{klass.totalTwo}}</td>
                    <td>{{countKnowledgeQuality(klass)}} %</td>
                    <td>{{countPerformance(klass)}} %</td>
                </tr>
                </tbody>
            </table>
            <h3 class="director-name">Директор:</h3>
        </div>

        <div class="print-btn" v-if="showTable">
            <v-btn color="primary" @click="exportPdf">Экспорт</v-btn>
        </div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
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
                    quarterId: '',
                    chronicleId: '',
                },
                showTable: false,
                isLoading: false,
                allReports: [],
                classReports: [],
                allChronicleYears: [],
                schoolQuarters: [],
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
            this.getAllChronicleYears();
        },

        methods: {
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
                    ).then((res) => {
                        if (res.length) {
                            this.allReports = res;
                            const requests = this.allReports.map((item) => {
                                return new Promise((resolve, reject) => {
                                    AnalyticsService.getTotalStudentsCount(this.school.id, item.classId).then((res) => {
                                        resolve(res[0]);
                                    }).catch((err) => {
                                        reject(err);
                                    });
                                })
                            });
                            Promise.all(requests).then((results) => {
                                this.allReports = this.allReports.map((klass, index) => {
                                    klass.totalStudentCount = results[index].totalStudentCount;
                                    return klass;
                                });
                                Object.entries(this.allReports.reduce((obj, el) => {
                                    obj[el.classLevel] = [...obj[el.classLevel] || [], el];
                                    return obj;
                                }, {})).forEach((item) => {
                                    const classObj = {
                                        classLevel: item[0],
                                        totalFive: 0,
                                        totalFour: 0,
                                        totalThree: 0,
                                        totalTwo: 0,
                                        totalStudentCount: 0
                                    };
                                    item[1].forEach((klass) => {
                                        classObj.totalFive += klass.totalFive;
                                        classObj.totalFour += klass.totalFour;
                                        classObj.totalThree += klass.totalThree;
                                        classObj.totalTwo += klass.totalTwo;
                                        classObj.totalStudentCount += klass.totalStudentCount;
                                    });
                                    this.classReports.push(classObj)
                                });
//                                this.classReports = this.classReports.map((klass) => {
//                                    const totalStudents = klass.totalStudentCount;
//                                    const totalMarks = klass.totalFive + klass.totalFour + klass.totalThree + klass.totalTwo;
//                                    klass.totalFive = this.countTotal((totalStudents * (klass.totalFive / totalMarks)).toFixed(1));
//                                    klass.totalFour = this.countTotal((totalStudents * (klass.totalFour / totalMarks)).toFixed(1));
//                                    klass.totalThree = this.countTotal((totalStudents * (klass.totalThree / totalMarks)).toFixed(1));
//                                    klass.totalTwo = this.countTotal((totalStudents * (klass.totalTwo / totalMarks)).toFixed(1));
//                                    //
//                                    const totalGrades = klass.totalFive + klass.totalFour + klass.totalThree + klass.totalTwo;
//                                    if (totalGrades < totalStudents) {
//                                        klass.totalFive++
//                                    }
//                                    return klass;
//                                });
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
                if (number[2].includes('8')) {
                    return Math.ceil(number);
                } else if (number > 0 && number < 1) {
                    return 1;
                } else if (number >= 1) {
                    return Math.floor(number);
                } else {
                    return 0;
                }
            },

            countKnowledgeQuality(klass) {
                const totalGrades = klass.totalFive + klass.totalFour;
                const result = (totalGrades / klass.totalStudentCount) * 100;
                return result.toFixed(1);
            },

            countPerformance(klass) {
                const totalGrades = klass.totalFive + klass.totalFour + klass.totalThree + klass.totalTwo;
                const result = (totalGrades / klass.totalStudentCount) * 100;
                return result.toFixed(1);
            },

            exportPdf() {
                this.$refs.report.style.width = this.setDisplaySize();
                this.$refs.report.style.height = this.setDisplaySize();
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

            setDisplaySize() {
                return window.innerWidth <= 1366 ? '110vh' : '80vh';
            }
        }
    }
</script>

<style lang="scss">
    .admin-quality-knowledge-container {
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
