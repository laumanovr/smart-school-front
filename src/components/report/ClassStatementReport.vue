<template>
    <div class="class-statement-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Ведомость успеваемости учащихся</h3>
        </div>

        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="classes"
                item-text="classTitle"
                item-value="classId"
                label="Класс"
                :rules="required"
                v-model="requestObj.classId"
                class="v-select-item"
            />
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                :rules="required"
                v-model="requestObj.quarterId"
                class="v-select-item"
            />
            <v-btn color="primary" @click="findClassStatement">Найти</v-btn>
        </v-form>

        <div class="print-btn" v-if="showTable">
            <v-btn color="primary" @click="exportPdf">Экспорт</v-btn>
        </div>

        <div class="report-content" ref="report" v-if="showTable">
            <div class="report-title">
                <h3>Ведомость успеваемости учащихся</h3>
                <div class="report-info">
                    <div><span class="label">Класс:</span><span class="value">{{selectedClassTitle}}</span></div>
                    <div><span class="label">Школа:</span><span class="value">{{school.name}}</span></div>
                    <div>
                        <span class="label">Класс.руководитель:</span>
                        <span class="value">{{ classInstructor.personTitle }}</span>
                    </div>
                    <div><span class="label">Академ.год:</span><span class="value">{{selectedChronicleYear}}</span>
                    </div>
                    <div><span class="label">Четверть:</span><span class="value">{{selectedQuarterTitle}}</span></div>
                </div>
            </div>
            <table class="table bordered report">
                <thead>
                <tr>
                    <th class="num">№</th>
                    <th class="FIO">Ф.И.О</th>
                    <th v-for="subject in classAllSubjects" class="subject">
                        {{$t(`adminCourses.${subject.courseCode}`)}}
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(student, i) in studentStatements" :key="i">
                    <td class="num">{{i + 1}}</td>
                    <td class="FIO">{{student.studentTitle}}</td>
                    <td v-for="subject in classAllSubjects">
                        {{ getQuarterMark(student.courses, subject) }}
                    </td>
                </tr>
                </tbody>
            </table>

            <table class="table bordered report">
                <tbody>
                <tr v-for="mark in totalGrades">
                    <td class="num"></td>
                    <td class="FIO">"{{mark.grade}}"</td>
                    <td v-for="item in mark.total" class="total-mark">
                        {{item.totalMarks}}
                    </td>
                </tr>
                <tr>
                    <td class="num"></td>
                    <td class="FIO">Качество знаний</td>
                    <td v-for="subject in classAllSubjects" class="total-mark">
                        {{countQuality(subject)}}%
                    </td>
                </tr>
                <tr>
                    <td class="num"></td>
                    <td class="FIO">Успеваемость</td>
                    <td v-for="subject in classAllSubjects" class="total-mark">
                        {{countPerformance(subject)}}%
                    </td>
                </tr>
                </tbody>
            </table>

            <div class="good-students">
                <table class="table bordered report">
                    <thead>
                    <tr>
                        <th class="num">№</th>
                        <th>Отличники</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(student, i) in excellentStudents" :key="i">
                        <td>{{i + 1}}</td>
                        <td>{{student.studentTitle}}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="table bordered report">
                    <thead>
                    <tr>
                        <th class="num">№</th>
                        <th>Ударники</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(student, i) in normalStudents" :key="i">
                        <td>{{i + 1}}</td>
                        <td>{{student.studentTitle}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="instructor-name">Классный руководитель: {{ classInstructor.personTitle }}</h3>
        </div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();

    export default {
        props: {
            allChronicleYears: Array,
            classes: Array,
            schoolQuarters: Array
        },
        components: {
            PreLoader
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                isLoading: false,
                showTable: false,
                studentStatements: [],
                classAllSubjects: [],
                totalGrades: [],
                excellentStudents: [],
                normalStudents: [],
                selectedChronicleYear: '',
                selectedQuarterTitle: '',
                selectedClassTitle: '',
                requestObj: {
                    classId: 0,
                    quarterId: 0
                },
                classInstructor: {}
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
            getInstructorOfClass() {
                instructorClassService.getByClassId(this.requestObj.classId).then((res) => {
                    if (res._embedded) {
                        this.classInstructor = res._embedded.instructorClassResourceList[0];
                    }
                }).catch((err) => {
                    console.log(err);
                })
            },

            getSelectedDataTitles() {
                const klass = this.classes.find(i => i.classId === this.requestObj.classId);
                this.selectedClassTitle = `${klass.classLevel} ${klass.classLabel}`;
                this.selectedQuarterTitle = this.schoolQuarters.find(quat => quat.id === this.requestObj.quarterId).semester;
                this.selectedChronicleYear = this.allChronicleYears.find((item) => item.id === this.school.chronicleId).selectorTitle;
            },

            async findClassStatement() {
                if (this.$refs.form.validate()) {
                    this.showTable = false;
                    this.isLoading = true;
                    this.studentStatements = [];
                    this.getSelectedDataTitles();
                    await this.getInstructorOfClass();
                    AnalyticsService.getClassStatement(
                        this.school.chronicleId,
                        this.requestObj.quarterId,
                        this.requestObj.classId
                    ).then((res) => {
                        if (res.length && res[0].courses.length) {
                            this.studentStatements = res;
                            this.classAllSubjects = res[0].courses.sort((a, b) => b.grades.length - a.grades.length);
                            this.countTotalGrades();
                            this.countExcellentStudents();
                            this.showTable = true;
                        } else {
                            this.$toast.info('Пусто!');
                        }
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            countTotalGrades() {
                this.totalGrades = [];
                const marks = ['5', '4', '3', '2'];
                marks.forEach((mark) => {
                    const gradeObj = {grade: mark, total: []};
                    this.classAllSubjects.forEach((subject) => {
                        let equalObj = {courseId: subject.courseId, totalMarks: 0};
                        this.studentStatements.forEach((student) => {
                            student.courses.forEach((course) => {
                                const equal = course.courseId === subject.courseId &&
                                              course.grades.length && course.grades[0].mark === mark;
                                if (equal) {
                                    equalObj.totalMarks += 1;
                                }
                            })
                        });
                        gradeObj.total.push(equalObj);
                    });
                    this.totalGrades.push(gradeObj);
                });
            },

            countExcellentStudents() {
                this.excellentStudents = [];
                this.normalStudents = [];
                this.studentStatements.forEach((student) => {
                    if (student.courses.filter((course) => course.grades.length).length) {
                        const isExcellent = student.courses
                                            .filter((course) => course.grades.length)
                                            .every((course) => course.grades[0].mark === '5');

                        const hasFour = student.courses
                                        .filter((course) => course.grades.length)
                                        .some((course) => course.grades[0].mark === '4');

                        const noThreeNTwo = student.courses
                                            .filter((course) => course.grades.length)
                                            .every((course) => course.grades[0].mark !== '3' && course.grades[0].mark !== '2');
                        if (isExcellent) {
                            this.excellentStudents.push({studentTitle: student.studentTitle});
                        } else if (hasFour && noThreeNTwo) {
                            this.normalStudents.push({studentTitle: student.studentTitle});
                        }
                    }
                });
            },

            getQuarterMark(studentCourses, subject) {
                const foundObj = studentCourses.find(course => course.courseId === subject.courseId && course.grades.length);
                if (foundObj) {
                    return foundObj.grades.length ? foundObj.grades[0].mark : '';
                }
                return '';
            },

            countQuality(subject) {
                const totalFives = this.totalGrades[0].total.find(item => item.courseId === subject.courseId).totalMarks;
                const totalFours = this.totalGrades[1].total.find(item => item.courseId === subject.courseId).totalMarks;
                const totalPercent = ((totalFives + totalFours) / this.studentStatements.length) * 100;
                return totalPercent.toFixed(1);
            },

            countPerformance(subject) {
                const totalFives = this.totalGrades[0].total.find(item => item.courseId === subject.courseId).totalMarks;
                const totalFours = this.totalGrades[1].total.find(item => item.courseId === subject.courseId).totalMarks;
                const totalThrees = this.totalGrades[2].total.find(item => item.courseId === subject.courseId).totalMarks;
                const totalPercent = ((totalFives + totalFours + totalThrees) / this.studentStatements.length) * 100;
                return totalPercent.toFixed(1);
            },

            exportPdf() {
                this.$refs.report.style.width = this.setDisplaySize();
                this.$refs.report.style.height = this.setDisplaySize();
                this.$refs.report.querySelector('.report-title').style.width = '1170px';
                const clonedTable = this.$refs.report.cloneNode(true);
                this.synchronizeCssStyles(this.$refs.report, clonedTable, true);
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
    .class-statement-container {
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
                .report-info {
                    width: 500px;
                    margin: 0 auto;
                    font-weight: bold;
                    .label, .value {
                        display: inline-block;
                        width: calc(50% - 10px);
                    }
                    .label {
                        text-align: right;
                        margin-right: 10px;
                    }
                    .value {
                        text-align: left;
                        margin-left: 10px;
                    }
                }
            }
            table.report {
                width: auto;
                margin: 25px auto;
                th, td {
                    padding: 0;
                }
                td {
                    font-weight: bold;
                    height: 40px;
                }
                .num {
                    width: 30px;
                    min-width: 30px;
                    max-width: 30px;
                }
                .FIO {
                    width: 240px;
                    min-width: 240px;
                    max-width: 240px;
                }
                .subject {
                    transform: rotate(90deg) translateX(-45px);
                    width: 55px;
                    min-width: 55px;
                    max-width: 55px;
                    height: 170px;
                    text-align: center;
                    white-space: nowrap;
                    &.long-name {
                        width: 76px;
                        white-space: pre-line;
                        transform: rotate(90deg) translateX(-20px);
                    }
                }
                .total-mark {
                    width: 55px;
                    &.long-name {
                        width: 76px;
                    }
                }
            }

            .good-students {
                display: flex;
                justify-content: center;
                width: 1000px;
                margin: 0 auto 25px;
                table {
                    width: 420px;
                    margin: 0;
                    &:first-child {
                        margin-right: 10px;
                    }
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
