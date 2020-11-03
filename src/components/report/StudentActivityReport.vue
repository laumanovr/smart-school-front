<template>
    <div class="student-activity-report-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Отчет по движению учащихся</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="instrClasses"
                item-text="classTitle"
                item-value="classId"
                label="Класс"
                :rules="required"
                v-model="classActivityObj.classId"
                class="v-select-item"
            />
            <v-select
                :items="allChronicleYears"
                item-text="selectorTitle"
                item-value="id"
                label="Академический год"
                :rules="required"
                v-model="classActivityObj.chronicleId"
                @change="getSchoolQuarters"
                class="v-select-item year"
            />
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="classActivityObj.quarterId"
                class="v-select-item"
                @change="setQuarterTitle"
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
                    <th>Класс</th>
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
                <tr>
                    <td>{{ selectedClassTitle }}</td>
                    <td contenteditable="true" @keydown="setValue($event, 'qinitial')">{{classActivityObj.qinitial}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'qfinal')">{{classActivityObj.qfinal}}</td>
                    <td contenteditable="true" @keydown="setValue($event, 'comeCount')">{{classActivityObj.comeCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveCount')">
                        {{classActivityObj.leaveCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveCityCount')">
                        {{classActivityObj.leaveCityCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveVillageCount')">
                        {{classActivityObj.leaveVillageCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveRegionCount')">
                        {{classActivityObj.leaveRegionCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveCisCount')">
                        {{classActivityObj.leaveCisCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveAbroadCount')">
                        {{classActivityObj.leaveAbroadCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveOtherCount')">
                        {{classActivityObj.leaveOtherCount}}
                    </td>
                    <td contenteditable="true" @keydown="setValue($event, 'leaveWorkCount')">
                        {{classActivityObj.leaveWorkCount}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-actions" v-if="showTable">
            <div class="save-btn">
                <v-btn color="green" @click="submitSaveReport">Сохранить</v-btn>
            </div>
            <div class="export">
                <v-btn class="print-btn" color="primary" @click="exportPdf">Экспорт</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import PreLoader from '@/components/preloader/PreLoader';
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import AnalyticsService from '@/_services/analytics.service';

    export default {
        components: {
            PreLoader
        },
        props: {
            instrClasses: Array,
            allChronicleYears: Array,
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                classActivityObj: {
                    classId: 0,
                    chronicleId: 0,
                    quarterId: 0,
                    qinitial: 0,
                    qfinal: 0,
                    comeCount: 0,
                    leaveCount: 0,
                    leaveCityCount: 0,
                    leaveVillageCount: 0,
                    leaveRegionCount: 0,
                    leaveCisCount: 0,
                    leaveAbroadCount: 0,
                    leaveOtherCount: 0,
                    leaveWorkCount: 0
                },
                showTable: false,
                isLoading: false,
                schoolQuarters: [],
                selectedClassTitle: '',
                selectedChronicleYear: '',
                selectedQuarterTitle: '',
                mode: ''
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

            findClassActivityReport() {
                if (this.$refs.form.validate()) {
                    const klass = this.instrClasses.find(i => i.classId === this.classActivityObj.classId);
                    this.selectedClassTitle = `${klass.classLevel} ${klass.classLabel}`;
                    this.clearClassData();
                    this.isLoading = true;
                    this.showTable = false;
                    AnalyticsService.getClassActivityList(
                        this.school.id,
                        this.classActivityObj.chronicleId,
                        this.classActivityObj.quarterId,
                        this.classActivityObj.classId
                    ).then((res) => {
                        if (res.length) {
                            const foundClass = Object.assign({}, res[0], {
                                qinitial: res[0].initial,
                                qfinal: res[0].final
                            });
                            for (let key in foundClass) {
                                if (foundClass.hasOwnProperty(key) && this.classActivityObj.hasOwnProperty(key)) {
                                    this.classActivityObj[key] = foundClass[key];
                                }
                            }
                            this.classActivityObj.id = foundClass.id;
                            this.mode = 'edit';
                        }
                        this.isLoading = false;
                        this.showTable = true;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            clearClassData() {
                this.mode = 'add';
                const keys = ['chronicleId', 'quarterId', 'classId'];
                for (let key in this.classActivityObj) {
                    if (this.classActivityObj.hasOwnProperty(key) && !keys.includes(key)) {
                        this.classActivityObj[key] = 0;
                    }
                }
            },

            setValue(e, field) {
                setTimeout(() => {
                    if (isNaN(Number(e.target.innerText))) {
                        e.target.innerText = '';
                        this.classActivityObj[field] = '';
                        return;
                    }
                    this.classActivityObj[field] = e.target.innerText;
                }, 10)
            },

            submitSaveReport() {
                this.isLoading = true;
                if (this.mode === 'add') {
                    AnalyticsService.createClassActivity(this.classActivityObj).then(() => {
                        this.isLoading = false;
                        this.$toast.success('Успешно создано!');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                } else {
                    AnalyticsService.updateClassActivity(this.classActivityObj).then(() => {
                        this.isLoading = false;
                        this.$toast.success('Успешно обновлено!');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
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
                    padding: 0 8px;
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

        .btn-actions {
            width: 1190px;
            margin: 0 auto;
            .save-btn {
                width: 60%;
                text-align: right;
            }
            .export {
                width: 40%;
                text-align: right;
                button {
                    margin: 0;
                }
            }
        }

        .print-btn {
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
