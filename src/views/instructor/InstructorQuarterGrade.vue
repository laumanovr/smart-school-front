<template>
    <div class="instructor-quarter-grade">
        <PreLoader v-if="isLoading"/>

        <ClassSelectHeader
            :headTitle="$t('quarter_grade')"
            :showClass="true"
            @classSelected="onSelectKlass"
            @allClasses="fetchInstructorCourses"
        />

        <v-select
            class="v-select-item"
            :items="instructorCourses"
            :item-text="showCourseName"
            item-value="courseId"
            :label="$t('courses')"
            v-model="requestObj.courseId"
            @change="onChangeCourse"
        />

        <div class="instructor-quarter-grade__body">
            <table class="instructor-quarter-grade__table" v-if="studentQuarterGrades.length">
                <thead>
                <tr>
                    <th>{{ $t('full_name') }}</th>
                    <th v-for="quarter in schoolQuarters">
                        <span class="blue">{{quarterTitle[quarter.semester]}} - {{ $t('quarter') }}</span>
                    </th>
                    <th v-if="showGosExam"><span class="blue">Гос.экзамен</span></th>
                    <th><span class="blue">Итог.оценка</span></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(student, i) in studentQuarterGrades" :key="i">
                    <td class="full-name">{{i + 1}}. {{student.studentTitle}}</td>
                    <template v-for="quarter in schoolQuarters">
                        <td
                            v-if="getQuarterGrade(quarter, student.grades)"
                            @keyup="setQuarterGrade($event, quarter, student, getQuarterGrade(quarter, student.grades))"
                            :contenteditable="true"
                        >
                            {{ getQuarterGrade(quarter, student.grades).mark }}
                        </td>
                        <td
                            @keyup="setQuarterGrade($event, quarter, student)"
                            :contenteditable="true"
                            v-else>
                        </td>
                    </template>
                    <td :contenteditable="true" v-if="showGosExam"></td>
                    <td :contenteditable="true"></td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-actions saveGrade" v-if="studentQuarterGrades.length">
            <v-btn color="primary" @click="submitQuarterGrades">Сохранить</v-btn>
        </div>
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import QuarterGradeService from '@/_services/quarter-grade.service';
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        name: 'InstructorQuarterGrade',
        components: {ClassSelectHeader, PreLoader},
        data() {
            return {
                langObj: {
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                quarterTitle: {
                    '1': 'I',
                    '2': 'II',
                    '3': 'III',
                    '4': 'IV',
                },
                requestObj: {
                    classId: '',
                    courseId: '',
                },
                sendQuarterGradeObj: {
                    chronicleId: 0,
                    classId: 0,
                    instructorId: 0,
                    students: []
                },
                schoolQuarters: [],
                instructorCourses: [],
                allCourses: [],
                studentQuarterGrades: [],
                isLoading: false,
                showGosExam: false,
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0]
            },
            currentLang() {
                return this.$root.$i18n.locale;
            }
        },

        created() {
            this.isLoading = true;
            this.sendQuarterGradeObj.instructorId = this.userProfile.personId;
            this.sendQuarterGradeObj.chronicleId = this.school.chronicleId;
            this.fetchSchoolQuarters();
        },

        methods: {
            fetchStudentQuarterGrades() {
                this.studentQuarterGrades = [];
                this.sendQuarterGradeObj.students = [];
                this.isLoading = true;
                QuarterGradeService.getStudentsQuarterGrades(
                    this.requestObj.classId,
                    this.requestObj.courseId,
                    this.school.chronicleId,
                    this.userProfile.personId
                ).then((res) => {
                    this.studentQuarterGrades = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            onSelectKlass(selectedClass) {
                if (!selectedClass) {
                    this.$toast.info('У вас нет классов!');
                    this.isLoading = false;
                    return;
                }
                this.requestObj.classId = selectedClass.classId;
                this.sendQuarterGradeObj.classId = selectedClass.classId;
                this.filterCourses(selectedClass);
                const classLevel = selectedClass.classLevel;
                this.showGosExam = classLevel.includes('9') || classLevel.includes('11');
            },

            filterCourses(selectedClass) {
                this.instructorCourses = this.allCourses.filter((course) => course.classId === selectedClass.classId);
                this.requestObj.courseId = this.instructorCourses.length ? this.instructorCourses[0].courseId : 0;
                if (this.requestObj.courseId) {
                    this.fetchStudentQuarterGrades();
                } else {
                    this.studentQuarterGrades = [];
                    this.isLoading = false;
                }
            },

            onChangeCourse() {
                this.fetchStudentQuarterGrades()
            },

            getQuarterGrade(currentQuarter, studentQuarterGrades) {
                return studentQuarterGrades.find((quarterGrade) => quarterGrade.quarterId === currentQuarter.id);
            },

            setQuarterGrade(e, quarter, student, currentQGrade) {
                if (isNaN(Number(e.target.innerText))) {
                    e.target.innerText = '';
                    this.sendQuarterGradeObj.students = [];
                    return;
                }
                let inputValue = e.target.innerText = e.target.innerText.trim().slice(0, 1);
                if (inputValue.length) {
                    if (inputValue < 2) {
                        inputValue = e.target.innerText = '2';
                    } else if (inputValue > 5) {
                        inputValue = e.target.innerText = '5';
                    }
                }

                const newQuarterGradeObj = {
                    quarterId: quarter.id,
                    studentTitle: student.studentTitle,
                    m2mStudentCourseId: student.m2mStudentCourseId,
                    mark: inputValue,
                    gradeType: "QUARTER_GRADE",
                    gradeId: currentQGrade ? currentQGrade.gradeId : 0,
                    comment: ''
                };

                this.sendQuarterGradeObj.students.forEach((existQGrade, i, selfArr) => {
                    // DELETE FROM LOCAL ARRAY
                    let isExist = existQGrade.quarterId === newQuarterGradeObj.quarterId &&
                        existQGrade.studentTitle === newQuarterGradeObj.studentTitle &&
                        existQGrade.m2mStudentCourseId === newQuarterGradeObj.m2mStudentCourseId;
                    if (isExist) {
                        selfArr.splice(i, 1);
                    }
                });

                if (inputValue.length) {
                    this.sendQuarterGradeObj.students.push(newQuarterGradeObj);
                } else {
                    if (currentQGrade) {
                        // FOR DELETE FROM SERVER
                        newQuarterGradeObj.mark = 99;
                        this.sendQuarterGradeObj.students.push(newQuarterGradeObj);
                    }
                }
                this.setCaretToEnd(e.target);
                console.log(this.sendQuarterGradeObj.students);
            },

            setCaretToEnd(target) {
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(target);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
                target.focus();
                range.detach();
            },

            showCourseName(courseObj) {
                return courseObj[this.langObj[this.currentLang]];
            },

            fetchSchoolQuarters() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchInstructorCourses(allClasses) {
                this.instructorCourses = allClasses;
                this.allCourses = allClasses;
            },

            submitQuarterGrades() {
                if (!this.sendQuarterGradeObj.students.length) {
                    this.$toast.info('Сначала поставьте оценку!');
                    return;
                }
                this.isLoading = true;
                QuarterGradeService.createWithArray(this.sendQuarterGradeObj).then(() => {
                    this.sendQuarterGradeObj.students = [];
                    this.$toast.success('Успешно!');
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-quarter-grade {
        padding: 25px;
        font-family: Helvetica, sans-serif;

        .saveGrade {
            position: fixed;
            bottom: 15px;
            width: 100%;
        }

        .v-select-item {
            margin: 25px 0;
        }

        &__body {
            margin: 20px 0 45px;
        }

        &__table {
            background: #FFFFFF;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
            border-radius: 4px;

            th, td {
                &:not(:first-child) {
                    max-width: 150px;
                    overflow: hidden;
                    white-space: nowrap;
                }

                &:nth-child(2), &:nth-child(3) {
                    background: rgba(74, 39, 243, 0.1);
                    border-right: 10px solid #fff;
                    width: 150px;
                }

                &:nth-child(4) {
                    background: rgba(0, 217, 95, 0.1);
                    border-right: 10px solid #fff;
                    width: 150px;
                }
                &:nth-child(5) {
                    background: rgba(0, 217, 95, 0.1);
                    border-right: 10px solid #fff;
                    width: 150px;
                }
                &:nth-child(6) {
                    border-right: 10px solid #fff;
                    background: rgb(6 205 198 / 10%);
                    width: 150px;
                }
                &:nth-child(7) {
                    background: #ccd6ff;
                    width: 150px;
                }
            }

            thead {
                tr {
                    border-radius: 4px;
                    height: 40px;

                    th:first-child {
                        font-family: Open Sans, sans-serif;
                        font-size: 14px;
                        line-height: 119%;
                        text-align: center;
                        color: #707683;
                    }

                    th {
                        span {
                            border-radius: 5px;
                            height: 40px;
                            font-size: 14px;
                            line-height: 14px;
                            font-weight: bold;

                            &.blue {
                                background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                letter-spacing: 0.01em;
                                color: #FFFFFF;
                            }

                            &.green {
                                background: #00D95F;
                            }
                        }
                    }
                }
            }

            tr {
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                height: 64px;

                td:not(:first-child) {
                    text-align: center;
                    font-size: 18px;
                    line-height: 21px;
                    letter-spacing: 0.01em;
                    color: #323C47;
                }

                .full-name {
                    min-width: 250px;
                    padding: 0 25px;
                    font-size: 14px;
                    line-height: 16px;
                    letter-spacing: 0.01em;
                    color: #323C47;
                }
            }

            tbody {
                tr {
                    &:hover {
                        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
                    }
                }
            }
        }
    }
</style>
