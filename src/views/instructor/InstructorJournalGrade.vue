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
            </div>

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
                        <th v-for="day in currentMonthDays" :class="{'disabled': !isAbleDate(day.day)}">
                            {{ day.day.slice(0, 2) }}
                            <div class="lesson">Урок-{{ day.shiftTimeTitle }}</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="student in studentGrades" :key="student.student.id">
                        <td
                            v-for="day in currentMonthDays"
                            @click="openSetGradeModal(student, day)"
                            :class="{
                                'disabled': !isAbleDate(day.day),
                                'absent-95': getStudentGradeObj(day, student.grades).mark == '95'
                            }"
                        >
                            {{ getStudentSpecificMark(day, student.grades) }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="btn-actions saveGrade" v-if="studentGrades.length">
                <v-btn color="primary" @click="submitSaveGrades">Сохранить</v-btn>
            </div>
        </div>

        <!--MODAL FOR SETTING GRADE-->
        <modal name="set-grade-modal" class="grade-modal" width="355px" height="auto">
            <div class="modal-container">
                <template v-if="gradeMode == 'setGrade'">
                <DeleteIcon class="delete-grade" @click="gradeMode='deleteGrade'" v-show="isDeletable"/>
                <h4 class="header">{{selectedDate.day}}</h4>
                <h4 class="header" v-if="selectedStudent.student">
                    {{selectedStudent.student.surname + ' ' + selectedStudent.student.name}}
                </h4>
                <v-select
                    class="v-select-item"
                    :items="gradeReasons"
                    item-text="title"
                    item-value="id"
                    label="Тип оценки"
                    v-model="selectedReasonId"
                />
                <v-select
                    class="v-select-item"
                    :items="topics"
                    item-text="title"
                    item-value="id"
                    label="Тема"
                    v-model="selectedTopicId"
                />
                <div class="mark-grades">
                    <v-radio-group v-model="selectedAbsentCode" @change="selectedMark=''; selectedExtraMark=''">
                        <v-radio
                            v-for="item in absents"
                            :key="item.code"
                            :label="item.title"
                            :value="item.code"
                            :class="{'absent95': item.code == 95}"
                        />
                    </v-radio-group>
                    <div class="main-marks">
                        <span>Оценка: </span>
                        <span
                            v-for="mark in [2, 3, 4, 5]"
                            v-model="selectedMark"
                            class="mark"
                            :class="{'selected': mark == selectedMark}"
                            @click="selectedMark=mark; selectedAbsentCode=''"
                        >
                            {{ mark }}
                        </span>
                    </div>
                    <div class="extra-marks" v-show="selectedMark">
                        <span>Доп.оценка: </span>
                        <span
                            v-for="mark in [2, 3, 4, 5]"
                            v-model="selectedExtraMark"
                            class="mark"
                            :class="{'selected': mark == selectedExtraMark}"
                            @click="selectedExtraMark=mark; selectedAbsentCode=''"
                        >
                            {{ mark }}
                        </span>
                    </div>
                    <div class="btn-actions"><button @click="setSelectedGradeMark">Вставить</button></div>
                </div>
                </template>
                <template v-if="gradeMode == 'deleteGrade'">
                    <h4>Удалить?</h4>
                    <div class="btn-actions">
                        <v-btn color="primary" @click="gradeMode='setGrade'">Отмена</v-btn>
                        <v-btn color="red" @click="deleteGrade">Удалить</v-btn>
                    </div>
                </template>
            </div>
        </modal>

        <!--Fixed-Grade-Table-Head-->
        <FixedGradeTableHead
            ref="fixedTableHead"
            :currentMonthDays="currentMonthDays"
            :gradeTablesWidth="gradeTablesWidth"
            :monthLabelWidth="monthLabelWidth"
            @navigateByMonth="filterGradesByMonth"
            :class="{'show': showFixedTableHead}"
        />
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import GradeService from '@/_services/grade.service';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import moment from 'moment';
    import AdminGradeReasonService from '@/_services/admin-grade-reason.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import PlayArrowIcon from '@/components/icons/PlayArrowIcon';
    import {TopicService} from "@/_services/topic.service";
    const topicService = new TopicService();
    import FixedGradeTableHead from '@/components/table/FixedGradeTableHead';
    import DeleteIcon from '@/components/icons/DeleteIcon';

    export default {
        components: {
            ClassSelectHeader,
            PreLoader,
            PlayArrowIcon,
            FixedGradeTableHead,
            DeleteIcon
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

        data() {
            return {
                absents: [
                    {title: 'Отсутствовал(-а) уважительно', code: '92'},
                    {title: 'Отсутствовал(-а) неуважительно', code: '95'},
                ],
                langObj: {
                    RU: 'courseTitle',
                    KG: 'courseTitleKG',
                    EN: 'courseCode',
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
                selectedTopicId: '',
                selectedClassLevel: '',
                instructorCourses: [],
                currentMonthDays: [],
                studentGrades: [],
                sendGradeDtoList: [],
                gradeReasons: [],
                gradeMonthFrom: new Date().getMonth(),
                gradeMonthTo: new Date().getMonth() + 1,
                scheduleMonthNumber: new Date().getMonth() + 1,
                allCourses: [],
                topics: [],
                selectedStudent: {},
                selectedGradeObj: {},
                selectedDate: '',
                topicPage: 0,
                showFixedTableHead: false,
                isDeletable: false,
                gradeTablesWidth: 0,
                monthLabelWidth: 0,
                selectedAbsentCode: '',
                selectedMark: '',
                selectedExtraMark: '',
                gradeMode: 'setGrade'
            }
        },

        created() {
            this.getInstructorCourses();
            window.addEventListener('scroll', this.scrollGradesListener);
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.scrollGradesListener);
        },

        methods: {
            scrollGradesListener() {
                if (this.$refs.gradeTables) {
                    if (window.scrollY >= this.$refs.gradeTables.offsetTop) {
                        const fixedTableHead = this.$refs.fixedTableHead.$el.querySelector('.fixed-head');
                        this.gradeTablesWidth = this.$refs.gradeTables.offsetWidth;
                        this.monthLabelWidth = this.$refs.monthLabel.offsetWidth;
                        fixedTableHead.scrollLeft = this.step;
                        this.showFixedTableHead = true;
                    } else {
                        this.showFixedTableHead = false;
                    }
                }
            },

            showCourseName(courseObj) {
                return courseObj[this.langObj[this.currentLang]];
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
                if (this.monthDataRequest.courseId) {
                    this.fetchInstructorTopics();
                    this.fetchGradeReasons(this.instructorCourses[0].adminCourseId);
                }
            },

            async onChangeClass(klass) {
                if (!klass) {
                    this.$toast.info('У вас нет классов!');
                    return;
                }
                this.isLoading = true;
                this.selectedClassLevel = klass.classLevel;
                this.monthDataRequest.classId = klass.classId;
                this.monthDataRequest.instructorId = this.userProfile.personId;
                this.monthDataRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.instructorId = this.userProfile.personId;
                this.gradeRequest.searchRequest.chronicleId = this.school.chronicleId;
                this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                this.filterCourses(klass);
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
            },

            async onChangeCourse() {
                this.isLoading = true;
                const adminCourseId = this.instructorCourses.find(course => course.courseId === this.monthDataRequest.courseId).adminCourseId;
                await this.fetchCurrentMonthSchedule();
                await this.fetchStudentGrades();
                await this.fetchInstructorTopics();
                await this.fetchGradeReasons(adminCourseId);
            },

            fetchStudentGrades() {
                this.studentGrades = [];
                this.sendGradeDtoList = [];
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

            fetchInstructorTopics() {
                this.topics = [];
                topicService.getByInstructor(
                    this.topicPage,
                    this.userProfile.personId,
                    this.monthDataRequest.courseId,
                    this.selectedClassLevel,
                    this.school.quarterId,
                    100
                ).then((res) => {
                    if (res._embedded) {
                        this.topics = res._embedded.topicResourceList;
                    }
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

            fetchGradeReasons(adminCourseId) {
                AdminGradeReasonService.getByAdminCourse(adminCourseId).then((res) => {
                    this.gradeReasons = res;
                })
            },

            isAbleDate(gradeDate) {
                const formattedGradeDate = moment(gradeDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                const currentDate = moment(new Date()).format('YYYY-MM-DD');
                return formattedGradeDate <= currentDate;
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

            openSetGradeModal(student, date) {
                const today = new Date();
                const monthAgoDate = moment(today.setDate(today.getDate() - 30)).format('YYYY-MM-DD');
                const gradeDate = moment(date.day, 'DD.MM.YYYY').format('YYYY-MM-DD');
                if (monthAgoDate > gradeDate) {
                    this.$toast.info('Слишком старые даты нельзя менять!');
                    return;
                }
                this.gradeMode = 'setGrade';
                this.selectedStudent = student;
                this.selectedDate = date;
                this.selectedGradeObj = this.getStudentGradeObj(date, student.grades);
                if (this.selectedGradeObj) {
                    this.isDeletable = true;
                    this.selectedReasonId = this.selectedGradeObj.reasonId;
                    this.selectedTopicId = this.selectedGradeObj.topicId;
                    if (this.selectedGradeObj.gradeType === 'GRADE') {
                        this.selectedMark = this.selectedGradeObj.mark;
                        this.selectedExtraMark = this.selectedGradeObj.extraMark;
                        this.selectedAbsentCode = '';
                    } else {
                        this.selectedAbsentCode = this.selectedGradeObj.mark;
                        this.selectedMark = '';
                        this.selectedExtraMark = '';
                    }
                } else {
                    this.isDeletable = false;
                    this.selectedMark = '';
                    this.selectedExtraMark = '';
                    this.selectedAbsentCode = '';
                }
                this.$modal.show('set-grade-modal');
            },

            setSelectedGradeMark() {
                if (!this.selectedReasonId || !this.selectedTopicId) {
                    this.$toast.info('Выберите тип оценки и Тему!');
                    return;
                }
                if (!this.selectedMark && !this.selectedAbsentCode) {
                    this.$toast.info('Выберите оценку!');
                    return;
                }
                const newGradeObj = {
                    classId: this.monthDataRequest.classId,
                    gradeId: this.selectedGradeObj && this.selectedGradeObj.gradeId ? this.selectedGradeObj.gradeId : 0,
                    m2mStudentCourseId: this.selectedStudent.m2mStudentCourseId,
                    instructorId: this.userProfile.personId,
                    shiftTimeId: this.selectedDate.shiftTimeId,
                    gradeDate: this.selectedDate.day,
                    date: this.selectedDate.day,
                    mark: this.selectedMark ? this.selectedMark : this.selectedAbsentCode,
                    gradeType: this.selectedMark ? 'GRADE' : 'ATTENDANCE',
                    reasonId: this.selectedReasonId,
                    topicId: this.selectedTopicId,
                    extraMark: this.selectedExtraMark,
                    comment: ''
                };
                this.deleteMarkFromSendArray(newGradeObj, true);
                this.deleteMarkFromLocalStudentArr(newGradeObj, true);
                this.$modal.hide('set-grade-modal');
            },

            deleteGrade() {
                if (this.selectedGradeObj.gradeId) {
                    this.isLoading = true;
                    this.selectedGradeObj.mark = '99';
                    GradeService.createWithArray([this.selectedGradeObj]).then(() => {
                        this.deleteMarkFromLocalStudentArr(this.selectedGradeObj, false);
                        this.$toast.success('Успешно удалено!');
                        this.isLoading = false;
                        this.$modal.hide('set-grade-modal');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                } else {
                    this.deleteMarkFromLocalStudentArr(this.selectedGradeObj, false);
                    this.$modal.hide('set-grade-modal');
                }
                this.deleteMarkFromSendArray(this.selectedGradeObj, false);
            },

            deleteMarkFromSendArray(newGradeObj, addMode) {
                // DELETE FROM SEND ARRAY
                this.sendGradeDtoList.forEach((existGrade, index, selfArr) => {
                    const isExist = existGrade.gradeDate === newGradeObj.gradeDate &&
                        existGrade.shiftTimeId === newGradeObj.shiftTimeId &&
                        existGrade.m2mStudentCourseId === newGradeObj.m2mStudentCourseId;
                    if (isExist) {
                        selfArr.splice(index, 1);
                    }
                });
                if (addMode) {
                    this.sendGradeDtoList.push(newGradeObj);
                }
                console.log('sendGradeDtoList: ', this.sendGradeDtoList);
            },

            deleteMarkFromLocalStudentArr(newGradeObj, addMode) {
                // DELETE GRADE FROM EXIST STUDENT ARRAY
                this.studentGrades = this.studentGrades.map((student) => {
                    if (student.student.id === this.selectedStudent.student.id) {
                        student.grades.forEach((existGrade, index, selfArr) => {
                            const isExist = existGrade.date === newGradeObj.date &&
                                            existGrade.shiftTimeId === newGradeObj.shiftTimeId;
                            if (isExist) {
                                selfArr.splice(index, 1);
                            }
                        });
                        if (addMode) {
                            student.grades.push(newGradeObj);
                        }
                    }
                    return student;
                });
                console.log('allStudentsList: ', this.studentGrades);
            },

            filterGradesByMonth(nav, mainArrow) {
                const fixedTableHead = this.$refs.fixedTableHead.$el.querySelector('.fixed-head');
                const gradeTable = this.$refs.tableGrades;
                let hasScrollBar = gradeTable.scrollWidth > gradeTable.clientWidth;
                let endOfScroll = gradeTable.scrollWidth - gradeTable.clientWidth;
                if (nav === 'prev') {
                    if (hasScrollBar) {
                        if (this.step) {
                            this.step -= 300;
                            gradeTable.scrollLeft = this.step;
                            fixedTableHead.scrollLeft = this.step;
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
                            fixedTableHead.scrollLeft = this.step;
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
                if (mainArrow) {
                    this.isLoading = true;
                    this.scheduleMonthNumber += 1;
                    this.gradeMonthFrom += 1;
                    this.gradeMonthTo += 1;
                    this.gradeRequest.searchRequest.from = this.getFirstDateOfMonth();
                    this.gradeRequest.searchRequest.to = this.getLastDateOfMonth();
                    await this.fetchCurrentMonthSchedule();
                    await this.fetchStudentGrades();
                }
            },

            async scrollPrevMonth(mainArrow) {
                if (mainArrow) {
                    this.isLoading = true;
                    this.scheduleMonthNumber -= 1;
                    this.gradeMonthFrom -= 1;
                    this.gradeMonthTo -= 1;
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

            submitSaveGrades() {
                if (!this.sendGradeDtoList.length) {
                    this.$toast.info('Сначала поставьте оценку');
                    return;
                }
                this.isLoading = true;
                GradeService.createWithArray(this.sendGradeDtoList).then(() => {
                    this.sendGradeDtoList = [];
                    this.$toast.success('Успешно');
                    this.fetchStudentGrades();
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

        }
    }
</script>

<style lang="scss">
    .journal-grade-container {
        margin: 30px 30px 60px;
        .grade-content {
            .selects {
                display: flex;
                align-items: center;
                margin: 20px 0;
                .select-course, .select-topic {
                    max-width: 220px;
                }
                .select-reason {
                    max-width: 220px;
                    margin: 0 20px;
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
                        .name {

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
                        .lesson {
                            font-size: 11px;
                            color: rgba(74, 39, 243, 0.51);
                        }
                    }
                    td {
                        padding: 0 15px;
                        outline: none;
                        cursor: pointer;
                        &:hover {
                            background: #fafafa;
                            box-shadow: 0 0 20px 0 rgba(74, 39, 243, 0.51);
                        }
                        &.absent-95 {
                            color: #fa1504;
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
                pointer-events: none;
            }
        }

        .grade-modal {
            color: #045290;
            .modal-container {
                position: relative;
            }
            .delete-grade {
                position: absolute;
                top: 15px;
                right: 15px;
            }
            .header {
                color: #045290;
                &:first-child{
                    margin-bottom: 0;
                }
            }
            .v-select-item {
                margin: 0 auto;
            }
            .mark-grades {
                width: 285px;
                margin: 0 auto;
                .main-marks, .extra-marks {
                    margin-bottom: 15px;
                    span {
                        display: inline-block;
                        &.mark {
                            border: 1px solid;
                            padding: 2px 10px;
                            border-radius: 4px;
                            margin: 0 5px;
                            cursor: pointer;
                            font-weight: bold;
                        }
                        &.selected {
                            color: #fff;
                            background: #00BCD4;
                            border-color: #00BCD4;
                            cursor: default;
                        }
                    }
                }
                .btn-actions {
                    button {
                        background: #60c964;
                        color: #fff;
                        border-radius: 4px;
                        padding: 2px 8px;
                    }
                }
            }
            .theme--light.v-label {
                color: #045290;
            }
            .absent95 {
                .theme--light.v-label {
                    color: #9C27B0;
                }
            }
        }
    }
</style>
