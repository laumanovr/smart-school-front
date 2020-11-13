<template>
    <div class="student-activity-report-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчет по движению учащихся</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="requestData.quarterId"
                class="v-select-item"
                @change="setDataTitle"
            />
            <v-btn color="primary" @click="findClassActivityReport">Показать</v-btn>
        </v-form>

        <div class="report-content" ref="report" v-if="showTable">
            <div class="report-title">
                <h3>
                    Отчет <br> по движению учащихся за {{selectedChronicleYear}}, четверть-{{selectedQuarterTitle}}, <br>
                    школы {{school.name}}
                </h3>
            </div>
            <table class="table bordered">
                <thead>
                <tr>
                    <th>Классы</th>
                    <th>Класс компл.</th>
                    <th>Учащиеся на начало четверти</th>
                    <th>Учащиеся на конец четверти</th>
                    <th>Прибывшие</th>
                    <th>Выбывшие</th>
                    <th>Город</th>
                    <th>Село</th>
                    <th>Республика</th>
                    <th>СНГ</th>
                    <th>За рубеж</th>
                    <th>Другие причины</th>
                    <th>Работают</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="classActivity in activityReports">
                    <td>{{ classActivity.classLevel }}</td>
                    <td>{{ classActivity.classComplect }}</td>
                    <td>{{ classActivity.initial }}</td>
                    <td>{{ classActivity.final }}</td>
                    <td>{{ classActivity.comeCount }}</td>
                    <td>{{ classActivity.leaveCount }}</td>
                    <td>{{ classActivity.leaveCityCount }}</td>
                    <td>{{ classActivity.leaveVillageCount }}</td>
                    <td>{{ classActivity.leaveRegionCount }}</td>
                    <td>{{ classActivity.leaveCisCount }}</td>
                    <td>{{ classActivity.leaveAbroadCount }}</td>
                    <td>{{ classActivity.leaveOtherCount }}</td>
                    <td>{{ classActivity.leaveWorkCount }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="print-btn" v-if="showTable">
            <v-btn color="primary" @click="exportPdf">Экспорт</v-btn>
        </div>
    </div>
</template>

<script>
    import PreLoader from '@/components/preloader/PreLoader';
    import AnalyticsService from '@/_services/analytics.service';

    export default {
        components: {
            PreLoader
        },
        props: {
            allChronicleYears: Array,
            schoolQuarters: Array,
            selectedSchool: Object
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                requestData: {
                    quarterId: ''
                },
                showTable: false,
                isLoading: false,
                activityReports: [],
                selectedChronicleYear: '',
                selectedQuarterTitle: '',
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools ? this.userProfile.schools[0] : this.selectedSchool;
            }
        },
        methods: {
            setDataTitle(quatId) {
                this.selectedQuarterTitle = this.schoolQuarters.find(quat => quat.id === quatId).semester;
                this.selectedChronicleYear = this.allChronicleYears.find((item) => item.id === this.school.chronicleId).selectorTitle;
                this.showTable = false;
            },

            findClassActivityReport() {
                this.activityReports = [];
                if (this.$refs.form.validate()) {
                    this.isLoading = true;
                    this.showTable = false;
                    AnalyticsService.getClassActivityList(
                        this.school.id,
                        this.school.chronicleId,
                        this.requestData.quarterId,
                    ).then((res) => {
                        if (res.length) {
                            Object.entries(res.reduce((obj, el) => {
                                obj[el.classLevel] = [...obj[el.classLevel] || [], el];
                                return obj;
                            }, {})).forEach((item) => {
                                const classObj = {
                                    classLevel: item[0],
                                    classComplect: item[1].length,
                                    initial: 0,
                                    final: 0,
                                    comeCount: 0,
                                    leaveCount: 0,
                                    leaveCityCount: 0,
                                    leaveVillageCount: 0,
                                    leaveRegionCount: 0,
                                    leaveCisCount: 0,
                                    leaveAbroadCount: 0,
                                    leaveOtherCount: 0,
                                    leaveWorkCount: 0
                                };
                                item[1].forEach((klass) => {
                                    classObj.initial += klass.initial;
                                    classObj.final += klass.final;
                                    classObj.comeCount += klass.comeCount;
                                    classObj.leaveCount += klass.leaveCount;
                                    classObj.leaveCityCount += klass.leaveCityCount;
                                    classObj.leaveVillageCount += klass.leaveVillageCount;
                                    classObj.leaveRegionCount += klass.leaveRegionCount;
                                    classObj.leaveCisCount += klass.leaveCisCount;
                                    classObj.leaveAbroadCount += klass.leaveAbroadCount;
                                    classObj.leaveOtherCount += klass.leaveOtherCount;
                                    classObj.leaveWorkCount += klass.leaveWorkCount;
                                });
                                this.activityReports.push(classObj);
                            });
                            this.showTable = true;
                        } else {
                            this.$toast.info('Ничего не найдено!');
                        }
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
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
    .student-activity-report-container {
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
            table.table {
                table-layout: fixed;
                width: 1190px;
                margin: 25px auto;
                th, td {
                    padding: 0 0;
                    text-align: center;
                }
                th {
                    color: #f84c4c;
                }
                td {
                    font-weight: bold;
                    height: 40px;
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
