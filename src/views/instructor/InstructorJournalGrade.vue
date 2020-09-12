<template>
    <div class="journal-grade-container">
        <PreLoader v-if="isLoading"/>
        <ClassSelectHeader
            :headTitle="'Журнал'"
            :showClass="true"
            @classSelected="onChangeClass"
        />

        <div class="grade-content">
            <div class="selects">
                <div class="select-course">
                    <v-select
                        :items="instructorCourses"
                        :item-text="showCourseName"
                        item-value="courseId"
                        label="Предмет"
                        v-model="monthDataRequest.courseId"
                        @change="onChangeCourse"
                    ></v-select>
                </div>
                <div class="select-reason">
                    <v-select
                        :items="gradeReasons"
                        item-text="title"
                        item-value="id"
                        label="Тип оценки"
                        v-model="selectedReasonId"
                    ></v-select>
                </div>
            </div>

            <div class="grade-tables" v-if="studentGrades.length">
                <table class="students bordered">
                    <thead>
                    <tr>
                        <th>
                            <span class="date" v-if="currentMonthDays.length">
                                {{numMonths[currentMonthDays[0].day.slice(3, 5)]}}
                                {{currentMonthDays[0].day.slice(0, 2)}} -
                                {{currentMonthDays[currentMonthDays.length - 1].day.slice(0, 2)}}
                            </span>
                            <PlayArrowIcon class="date-arrow left" @click="filterGradesByMonth('prev')"/>
                            <PlayArrowIcon class="date-arrow" @click="filterGradesByMonth('next')"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="student in studentGrades" :key="student.student.id">
                        <td>{{student.student.surname}} {{ student.student.name }}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="grades bordered" ref="tableGrades">
                    <thead>
                    <tr>
                        <th v-for="day in currentMonthDays" :class="{'disabled': !isAbleDate(day.day)}">
                            {{ day.day.slice(0, 2) }}
                            <div class="lesson">Урок-{{ day.shiftTimeTitle }}</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="student in studentGrades" :key="student.student.id">
                        <template v-for="day in currentMonthDays">
                            <td
                                v-if="getStudentMark(day, student.grades)"
                                :contenteditable="true"
                                @keyup="setGradeMark($event, student, day, getStudentMark(day, student.grades))"
                            >
                                {{ showCurrentMark(getStudentMark(day, student.grades)) }}
                            </td>
                            <td
                                :class="{'disabled': !isAbleDate(day.day)}"
                                :contenteditable="isAbleDate(day.day)"
                                @keyup="setGradeMark($event, student, day)"
                                v-else>
                            </td>
                        </template>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-actions saveGrade" v-if="studentGrades.length">
                <v-btn color="primary" @click="submitSaveGrades">Сохранить</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import GradeService from '@/_services/grade.service';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import moment from 'moment';
    import GradeReasonService from '@/_services/grade-reason.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import PlayArrowIcon from '@/components/icons/PlayArrowIcon';

    export default {
        components: {
            ClassSelectHeader,
            PreLoader,
            PlayArrowIcon
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },

        data() {
            return {
                numMonths: {
                    '04': 'Апрель',
                    '05': 'Май',
                    '06': 'Июнь',
                    '07': 'Июль',
                    '08': 'Август',
                    '09': 'Сентябрь',
                    '10': 'Октябрь',
                    '11': 'Ноябрь',
                    '12': 'Декабрь',
                },
                gradeRequest: {
                    pageRequest: {
                        limit: 100,
                        offset: 0
                    },
                    searchRequest: {
                        chronicleId: 0,
                        instructorId: 0,
                        from: '',
                        to: ''
                    }
                },
                monthDataRequest: {
                    chronicleId: 0,
                    classId: 0,
                    courseId: 0,
                    instructorId: 0,
                    shiftId: null
                },
                isLoading: false,
                step: 0,
                selectedReasonId: '',
                instructorCourses: [],
                currentMonthDays: [],
                studentGrades: [],
                sendGradeDtoList: [],
                gradeReasons: [],
                gradeMonthFrom: new Date().getMonth(),
                gradeMonthTo: new Date().getMonth() + 1,
                scheduleMonthNumber: new Date().getMonth() + 2,
                allCourses: []
            }
        },

        created() {
            this.getInstructorCourses();
        },

        methods: {
            showCourseName(courseObj) {
                return this.$t(`adminCourses.${courseObj.courseCode}`);
            },

            getInstructorCourses() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    if (res.length) {
                        this.instructorCourses = res;
                        this.allCourses = res;
                    }
                })
            },

            filterCourses(selectedClass) {
                this.instructorCourses = this.allCourses.filter((course) =>
                    course.classId === selectedClass.classId
                ).filter((obj, index, selfArr) =>
                    index === selfArr.findIndex((el) =>
                        (el['courseId'] === obj['courseId'])
                ));
                this.monthDataRequest.courseId = this.instructorCourses.length ? this.instructorCourses[0].courseId : 0;
            },

            async onChangeClass(klass) {
                if (!klass) {
                    this.$toast.info('У вас нет классов!');
                    return;
                }
                this.isLoading = true;
                this.monthDataRequest.classId = klass.classId;
                this.monthDataRequest.instructorId = this.userProfile.personId;
                this.monthDataRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.instructorId = this.userProfile.personId;
                this.gradeRequest.searchRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                this.filterCourses(klass);
                await this.fetchInstructorGradeReasons(klass.classLevel);
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
            },

            async onChangeCourse() {
                this.isLoading = true;
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
            },

            fetchStudentGrades() {
                this.studentGrades = [];
                GradeService.getByClassCourseInstructor(
                    this.monthDataRequest.classId,
                    this.monthDataRequest.courseId,
                    this.gradeRequest
                ).then((res) => {
                    this.studentGrades = res.list;
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                })
            },

            fetchCurrentMonthSchedule() {
                ScheduleWeekService.getCurrentMonth(this.scheduleMonthNumber, this.monthDataRequest)
                    .then((res) => {
                        this.currentMonthDays = res.map((item) => {
                            item.day = moment(item.day, 'YYYY-MM-DD').format('DD.MM.YYYY');
                            return item;
                        });
                    }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                })
            },

            fetchInstructorGradeReasons(classLevel) {
                this.gradeReasons = [];
                GradeReasonService.getByInstructor(
                    this.userProfile.personId,
                    classLevel,
                    this.monthDataRequest.courseId
                ).then((res) => {
                    if (res.length) {
                        this.gradeReasons = res;
                        this.selectedReasonId = this.gradeReasons[0].id;
                    }
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                })
            },

            isAbleDate(gradeDate) {
                const formattedGradeDate = moment(gradeDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                const currentDate = moment(new Date()).format('YYYY-MM-DD');
                return formattedGradeDate <= currentDate;
            },

            getStudentMark(dayObj, studentGrades) {
                return studentGrades.find(grade => grade.date === dayObj.day && grade.shiftTimeId === dayObj.shiftTimeId)
            },

            showCurrentMark(grade) {
                return isNaN(grade.mark) ? 'Н' : grade.mark;
            },

            setGradeMark(e, student, day, currentGrade) {
                const inputValue = e.target.innerText = e.target.innerText.trim().slice(0, 1);

                let newGradeObj = {
                    classId: this.monthDataRequest.classId,
                    gradeId: currentGrade ? currentGrade.gradeId : 0,
                    m2mStudentCourseId: student.m2mStudentCourseId,
                    instructorId: this.userProfile.personId,
                    shiftTimeId: day.shiftTimeId,
                    gradeDate: day.day,
                    mark: inputValue,
                    gradeType: !isNaN(inputValue) ? 'GRADE' : 'ATTENDANCE',
                    reasonId: currentGrade ? currentGrade.reasonId : this.selectedReasonId,
                    comment: '',
                    extraMark: '',
                    topicId: ''
                };

                this.sendGradeDtoList.forEach((existGrade, index, selfArr) => {
                    // DELETE FROM LOCAL ARRAY
                    let isExist = existGrade.gradeDate === newGradeObj.gradeDate &&
                        existGrade.shiftTimeId === newGradeObj.shiftTimeId &&
                        existGrade.m2mStudentCourseId === newGradeObj.m2mStudentCourseId;
                    if (isExist) {
                        selfArr.splice(index, 1);
                    }
                });

                if (inputValue.length) {
                    this.sendGradeDtoList.push(newGradeObj);
                } else {
                    if (currentGrade) {
                        // FOR DELETE FROM SERVER
                        newGradeObj.gradeId = currentGrade.gradeId;
                        newGradeObj.mark = 99;
                        this.sendGradeDtoList.push(newGradeObj);
                    }
                }
            },

            filterGradesByMonth(nav) {
                const gradeTable = this.$refs.tableGrades;
                let hasScrollBar = gradeTable.scrollWidth > gradeTable.clientWidth;
                let endOfScroll = gradeTable.scrollWidth - gradeTable.clientWidth;
                if (nav === 'prev') {
                    if (hasScrollBar) {
                        if (this.step) {
                            this.step -= 300;
                            gradeTable.scrollLeft = this.step;
                        } else {
                            this.isLoading = true;
                            this.step = 0;
                            this.scrollPrevMonth();
                            gradeTable.scrollLeft = 0;
                        }
                    } else {
                        this.isLoading = true;
                        this.scrollPrevMonth();
                    }
                } else {
                    if (hasScrollBar) {
                        if (this.step < endOfScroll) {
                            this.step += 300;
                            gradeTable.scrollLeft = this.step;
                        } else {
                            this.isLoading = true;
                            this.step = 0;
                            this.scrollNextMonth();
                            gradeTable.scrollLeft = 0;
                        }
                    } else {
                        this.isLoading = true;
                        this.scrollNextMonth();
                    }
                }
            },

            async scrollNextMonth() {
                this.scheduleMonthNumber += 1;
                this.gradeMonthFrom += 1;
                this.gradeMonthTo += 1;
                this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
            },

            async scrollPrevMonth() {
                this.scheduleMonthNumber -= 1;
                this.gradeMonthFrom -= 1;
                this.gradeMonthTo -= 1;
                this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
            },

            getFirstDateOfMonth() {
                const date = new Date();
                return moment(new Date(date.getFullYear(), this.gradeMonthFrom, 1)).format('DD.MM.YYYY');
            },

            getLastDateOfMonth() {
                const date = new Date();
                return moment(new Date(date.getFullYear(), this.gradeMonthTo, 0)).format('DD.MM.YYYY');
            },

            submitSaveGrades() {
                if (!this.sendGradeDtoList.length) {
                    this.$toast.info('Сначала поставьте оценку');
                    return;
                }
                this.isLoading = true;
                GradeService.createWithArray(this.sendGradeDtoList).then(() => {
                    this.sendGradeDtoList = [];
                    this.$toast.success('Успешно');
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

        }
    }
</script>

<style lang="scss" scoped>
    .journal-grade-container {
        margin: 30px 30px 60px;
        .grade-content {
            .selects {
                display: flex;
                align-items: center;
                margin: 20px 0;
                .select-course {
                    width: 250px;
                }
                .select-reason {
                    width: 250px;
                    margin-left: 20px;
                }
            }
            .grade-tables {
                display: flex;
                table.students {
                    border-top: 0;
                    th {
                        color: #03A9F4;
                        display: flex;
                        align-items: center;
                        border-right: 0;
                        .date {
                            white-space: nowrap;
                        }
                        .date-arrow {
                            border: 1px solid #d1d1d1;
                            transform: translateX(10px);
                            width: 35px;
                            height: 35px;
                            line-height: 32px;
                            &.left {
                                margin: 0 8px;
                            }
                        }
                    }
                    td {
                        white-space: nowrap;
                    }
                }
                table.grades {
                    max-width: 100%;
                    overflow-x: auto;
                    display: inline-block;
                    scroll-behavior: smooth;
                    border-top: 0;
                    &::-webkit-scrollbar {
                        width: 0;
                        height: 0;
                        background: transparent;
                    }
                    &::-webkit-scrollbar-thumb {
                        background-color: rgba(0, 0, 0, 0.3)
                    }
                    th, td {
                        width: 50px;
                        max-width: 50px;
                        min-width: 50px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-align: center;
                    }
                    th {
                        color: #03A9F4;
                        padding: 0;
                        .lesson {
                            font-size: 11px;
                            color: rgba(74, 39, 243, 0.51);
                        }
                    }
                    td {
                        padding: 0 15px;
                        outline: none;
                        &:focus {
                            background: #fafafa;
                            box-shadow: 0 0 20px 0 rgba(74, 39, 243, 0.51);
                        }
                    }
                }
            }

            .saveGrade {
                position: fixed;
                bottom: 15px;
                width: 100%;
            }
            .disabled {
                background: #eaeaea;
            }
        }
    }
</style>
