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
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="reportObj.quarterId"
                class="v-select-item"
                @change="setDataTitle"
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
            <v-btn color="primary" @click="exportPdf">Экспорт</v-btn>
        </div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            PreLoader
        },
        props: {
            instrClasses: Array,
            allChronicleYears: Array,
            schoolQuarters: Array
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                reportObj: {
                    classId: '',
                    quarterId: '',
                },
                showTable: false,
                isLoading: false,
                classReport: {},
                selectedChronicleYear: '',
                selectedClassTotalStudents: '',
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

        methods: {
            setDataTitle(quatId) {
                this.selectedQuarterTitle = this.schoolQuarters.find(quat => quat.id === quatId).semester;
                this.selectedChronicleYear = this.allChronicleYears.find((item) => item.id === this.school.chronicleId).selectorTitle;
                this.showTable = false;
            },

            fetchQualityKnowledgeReport() {
                if (this.$refs.form.validate()) {
                    this.isLoading = true;
                    this.showTable = false;
                    AnalyticsService.getStudentPerformance(
                        this.school.id,
                        this.school.chronicleId,
                        this.reportObj.quarterId,
                        this.reportObj.classId
                    ).then((res) => {
                        if (res.length) {
                            this.classReport = res.find((klass) => klass.classId === this.reportObj.classId);
                            AnalyticsService.getTotalStudentsCount(this.school.id, this.reportObj.classId).then((res) => {
                                this.classReport.totalStudentsCount = res[0].totalStudentCount;
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

            countKnowledgeQuality() {
                const totalGrades = this.classReport.totalFive + this.classReport.totalFour;
                const result = (totalGrades / this.classReport.totalStudentsCount) * 100;
                return result.toFixed(1);
            },

            countPerformance() {
                const klass = this.classReport;
                const totalGoodStudents = klass.totalStudentsCount - klass.totalTwo;
                const result = (totalGoodStudents / klass.totalStudentsCount) * 100;
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
    .quality-knowledge-container {
        .header-title {
            h3 {
                font-size: 25px;
            }
        }
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
