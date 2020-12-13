<template>
    <div class="instructor-class-container">
        <PreLoader v-if="isLoading"/>
        <ClassSelectHeader :headTitle="'Мои Классы'" :showClass="false" />

        <div class="class-content" v-if="showData">
            <table class="table">
                <thead>
                    <tr>
                        <th class="light-purple">Класс</th>
                        <th>Классный Руководитель</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="klass in instrClasses" :key="klass.id">
                        <td
                            class="light-purple"
                            @click="getClassGrades(klass.classId)"
                            :class="{'active': selectedClassId == klass.classId}"
                        >
                            {{ klass.classLevel + '-' + klass.classLabel }}
                        </td>
                        <td>{{ klass.personTitle }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="selected-class-data">
            <v-select
                class="v-select-item"
                label="Предмет"
                :items="classCourses"
                item-text="courseName"
                item-value="num"
                v-model="selectedCourseObj"
                return-object
                @change="changeCourse"
                v-show="studentGrades.length"
            />
            <div class="grade-tables" v-if="studentGrades.length" ref="gradeTables">
                <table class="students bordered">
                    <thead>
                    <tr>
                        <th ref="monthLabel">
                            <span class="date" v-if="currentMonthDays.length">
                                {{numMonths[currentMonthDays[0].day.slice(3, 5)]}}
                                {{currentMonthDays[0].day.slice(0, 2)}} -
                                {{currentMonthDays[currentMonthDays.length - 1].day.slice(0, 2)}}
                            </span>
                            <PlayArrowIcon class="date-arrow left" @click="filterGradesByMonth('prev', true)"/>
                            <PlayArrowIcon class="date-arrow" @click="filterGradesByMonth('next', true)"/>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(student, i) in studentGrades" :key="student.student.id">
                        <td>
                            <span class="index">{{i+1}}.</span>
                            <span class="name">{{student.student.surname}} {{ student.student.name }}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="grades bordered" ref="tableGrades">
                    <thead>
                    <tr>
                        <th v-for="day in currentMonthDays">
                            {{ day.day.slice(0, 2) }}
                            <div class="lesson">Урок-{{ day.shiftTimeTitle }}</div>
                        </th>
                        <th class="average"><span>-</span><span>x</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="student in studentGrades" :key="student.student.id">
                        <td
                            v-for="day in currentMonthDays"
                            :class="{'absent-95': getStudentGradeObj(day, student.grades).mark == '95'}"
                        >
                            {{ getStudentSpecificMark(day, student.grades) }}
                        </td>
                        <td class="average">{{ student.avgGrade ? student.avgGrade.toFixed(1) : '' }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import PreLoader from "@/components/preloader/PreLoader";
    import PlayArrowIcon from '@/components/icons/PlayArrowIcon';
    import GradeService from '@/_services/grade.service';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import moment from 'moment';

    export default {
        components: {
            ClassSelectHeader,
            PreLoader,
            PlayArrowIcon
        },
        data() {
            return {
                langObj: {
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                numMonths: {
                    '01': 'Январь',
                    '02': 'Февраль',
                    '03': 'Март',
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
                        to: '',
                        quarterId: ''
                    }
                },
                monthDataRequest: {
                    chronicleId: 0,
                    classId: 0,
                    courseId: 0,
                    instructorId: 0,
                    shiftId: null
                },
                step: 0,
                selectedClassId: '',
                selectedCourseObj: {},
                isLoading: false,
                showData: false,
                instrClasses: [],
                currentMonthDays: [],
                studentGrades: [],
                classCourses: [],
                gradeMonthFrom: new Date().getMonth(),
                gradeMonthTo: new Date().getMonth() + 1,
                scheduleMonthNumber: new Date().getMonth() + 1,
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            },
            currentLang() {
                return this.$root.$i18n.locale;
            }
        },

        async created() {
            this.isLoading = true;
            await this.fetchInstructorClasses();
        },

        methods: {
            fetchInstructorClasses() {
                instructorClassService.getByInstructorId(this.userProfile.personId).then((res) => {
                    if (res._embedded) {
                        this.instrClasses = res._embedded.instructorClassResourceList;
                        this.showData = true;
                    }
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            getClassGrades(classId) {
                this.isLoading = true;
                this.selectedClassId = classId;
                ScheduleWeekService.getByClass(classId).then((res) => {
                    if (!res.length) {
                        this.$toast.info('Ничего не найдено!');
                        this.isLoading = false;
                        return;
                    }
                    this.monthDataRequest.classId = this.selectedClassId;
                    this.classCourses = res.filter((obj, index, selfArr) =>
                        index === selfArr.findIndex((el) =>
                            (el['courseId'] === obj['courseId'] && el['instructorId'] === obj['instructorId'])
                        )).map((item, i) => {
                            item.num = i;
                            item.courseName = item[this.langObj[this.currentLang]];
                            return item;
                        });
                    this.selectedCourseObj = this.classCourses[0];
                    this.changeCourse(this.selectedCourseObj);
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            async changeCourse(courseObj) {
                this.monthDataRequest.instructorId = courseObj.instructorId;
                this.monthDataRequest.courseId = courseObj.courseId;
                this.monthDataRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.instructorId = courseObj.instructorId;
                this.gradeRequest.searchRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.quarterId = this.school.quarterId;
                this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
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

            fetchStudentGrades() {
                this.studentGrades = [];
                GradeService.getByClassCourseInstructor(
                    this.monthDataRequest.classId,
                    this.monthDataRequest.courseId,
                    this.gradeRequest
                ).then((res) => {
                    const allExistDays = this.currentMonthDays.map((item) => item.day);
                    this.studentGrades = res.list.map((student) => {
                        student.grades.reverse().map((gradeObj) => {
                            if (!allExistDays.includes(gradeObj.date)) {
                                const isExist = this.currentMonthDays.some((i) => i.day === gradeObj.date);
                                if (!isExist) {
                                    this.currentMonthDays.unshift({
                                        day: gradeObj.date,
                                        archived: true,
                                        shiftTimeId: gradeObj.shiftTimeId
                                    });
                                }
                            }
                            return gradeObj;
                        });
                        return student;
                    });
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                })
            },

            filterGradesByMonth(nav, mainArrow) {
                const gradeTable = this.$refs.tableGrades;
                let hasScrollBar = gradeTable.scrollWidth > gradeTable.clientWidth;
                let endOfScroll = gradeTable.scrollWidth - gradeTable.clientWidth;
                if (nav === 'prev') {
                    if (hasScrollBar) {
                        if (this.step) {
                            this.step -= 300;
                            gradeTable.scrollLeft = this.step;
                        } else {
                            this.step = 0;
                            this.scrollPrevMonth(mainArrow);
                            gradeTable.scrollLeft = 0;
                        }
                    } else {
                        this.scrollPrevMonth(mainArrow);
                    }
                } else {
                    if (hasScrollBar) {
                        if (this.step < endOfScroll) {
                            this.step += 300;
                            gradeTable.scrollLeft = this.step;
                        } else {
                            this.step = 0;
                            this.scrollNextMonth(mainArrow);
                        }
                    } else {
                        this.scrollNextMonth(mainArrow);
                    }
                }
            },

            async scrollNextMonth(mainArrow) {
                if (mainArrow && this.scheduleMonthNumber !== 5) {
                    this.isLoading = true;
                    this.isLastMonth = this.scheduleMonthNumber === 12;
                    this.scheduleMonthNumber = this.isLastMonth ? 1 : this.scheduleMonthNumber + 1;
                    this.gradeMonthFrom = this.isLastMonth ? 0 : this.gradeMonthFrom + 1;
                    this.gradeMonthTo = this.isLastMonth ? 1 : this.gradeMonthTo + 1;
                    this.gradeYear = this.isLastMonth ? this.gradeYear + 1 : this.gradeYear;
                    this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                    this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                    await this.fetchCurrentMonthSchedule();
                    await this.fetchStudentGrades();
                }
            },

            async scrollPrevMonth(mainArrow) {
                if (mainArrow && this.scheduleMonthNumber !== 9) {
                    this.isLoading = true;
                    this.isFirstMonth = this.scheduleMonthNumber === 1;
                    this.scheduleMonthNumber = this.isFirstMonth ? 12 : this.scheduleMonthNumber - 1;
                    this.gradeMonthFrom = this.isFirstMonth ? 11 : this.gradeMonthFrom - 1;
                    this.gradeMonthTo = this.isFirstMonth ? 12 : this.gradeMonthTo - 1;
                    this.gradeYear = this.isFirstMonth ? this.gradeYear - 1 : this.gradeYear;
                    this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                    this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                    await this.fetchCurrentMonthSchedule();
                    await this.fetchStudentGrades();
                }
            },

            getFirstDateOfMonth() {
                const date = new Date();
                return moment(new Date(date.getFullYear(), this.gradeMonthFrom, 1)).format('DD.MM.YYYY');
            },

            getLastDateOfMonth() {
                const date = new Date();
                return moment(new Date(date.getFullYear(), this.gradeMonthTo, 0)).format('DD.MM.YYYY');
            },

            getStudentSpecificMark(dayObj, studentGrades) {
                const grade = studentGrades.find((i) => i.date === dayObj.day && i.shiftTimeId === dayObj.shiftTimeId);
                if (grade) {
                    if (grade.gradeType === 'ATTENDANCE') {
                        return 'Н';
                    } else {
                        if (grade.extraMark) {
                            return `${grade.mark}/${grade.extraMark}`;
                        } else {
                            return grade.mark;
                        }
                    }
                }
                return '';
            },

            getStudentGradeObj(date, studentGrades) {
                const grade = studentGrades.find((i) => i.date === date.day && i.shiftTimeId === date.shiftTimeId);
                return grade ? grade : '';
            },
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-class-container {
        margin: 30px 30px 50px;
        .class-content {
            background: #fff;
            margin-top: 22px;
            td.light-purple {
                cursor: pointer;
                &.active {
                    background: #00BCD4;
                    color: #fff;
                    border: 1px solid;
                }
            }
        }
        .selected-class-data {
            margin-top: 25px;
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
                        line-height: 37px;
                        &.left {
                            margin: 0 8px;
                        }
                    }
                }
                td {
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    border-right: 0;
                    .index {
                        min-width: 20px;
                        text-align: left;
                    }
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
                    cursor: default;
                    &.average {
                        span {
                            &:first-child {
                                display: block;
                                height: 4px;
                                line-height: 4px;
                            }
                            &:last-child {
                                display: block;
                                height: 11px;
                                line-height: 11px;
                            }
                        }
                    }
                    .lesson {
                        font-size: 11px;
                        color: rgba(74, 39, 243, 0.51);
                    }
                }
                td {
                    padding: 0 15px;
                    outline: none;
                    &.absent-95 {
                        color: #fa1504;
                    }
                }
            }
        }
    }
</style>
