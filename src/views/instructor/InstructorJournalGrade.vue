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

            <div class="other" v-if="studentGrades.length">
                <div class="selected-year">{{gradeYear}}</div>
                <button class="export" @click="exportGradesPdf">Экспорт</button>
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
                        <th
                            v-for="day in currentMonthDays"
                            :class="{'disabled': !isAbleDate(day.day), 'archived': day.archived}"
                        >
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
                            @click="openSetGradeModal(student, day)"
                            :class="{
                                'disabled': !isAbleDate(day.day),
                                'absent-95': getStudentGradeObj(day, student.grades).mark == '95',
                                'archived': day.archived
                            }"
                        >
                            {{ getStudentSpecificMark(day, student.grades) }}
                        </td>
                        <td class="average">{{ student.avgGrade ? student.avgGrade.toFixed(1) : '' }}</td>
                    </tr>
                    </tbody>
                </table>
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
                    item-text="reasonTitle"
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
                    <div class="btn-actions">
                        <button @click="setSelectedGradeMark">{{isDeletable ? 'Изменить' : 'Вставить'}}</button>
                    </div>
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
    import pdfMake from 'pdfmake/build/pdfmake';
    import pdfFonts from 'pdfmake/build/vfs_fonts';
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                reasonLang: {
                    ru: 'title',
                    kg: 'titleKG',
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
                isLoading: false,
                step: 0,
                selectedReasonId: '',
                selectedTopicId: '',
                selectedClassLevel: '',
                instructorCourses: [],
                currentMonthDays: [],
                studentGrades: [],
                gradeReasons: [],
                gradeMonthFrom: new Date().getMonth(),
                gradeMonthTo: new Date().getMonth() + 1,
                scheduleMonthNumber: new Date().getMonth() + 1,
                allCourses: [],
                topics: [],
                selectedStudent: {},
                selectedGradeObj: {},
                selectedClassObj: {},
                selectedCourseObj: {},
                selectedDate: '',
                topicPage: 0,
                showFixedTableHead: false,
                isDeletable: false,
                gradeTablesWidth: 0,
                monthLabelWidth: 0,
                selectedAbsentCode: '',
                selectedMark: '',
                selectedExtraMark: '',
                gradeMode: 'setGrade',
                isLastMonth: false,
                isFirstMonth: false,
                gradeYear: new Date().getFullYear(),
            }
        },

        created() {
            this.gradeRequest.searchRequest.quarterId = this.school.quarterId;
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
                this.selectedClassObj = klass;
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
                this.selectedCourseObj = this.instructorCourses.find(i => i.courseId === this.monthDataRequest.courseId);
                GradeService.getByClassCourseInstructor(
                    this.monthDataRequest.classId,
                    this.monthDataRequest.courseId,
                    this.gradeRequest
                ).then((res) => {
                    const allExistDays = this.currentMonthDays.map((item) => item.day);
                    this.studentGrades = res.list.map((student) => {
                        student.grades.reverse().map((gradeObj) => {
                            if (!allExistDays.includes(gradeObj.date)) {
                                gradeObj.archived = true;
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

            fetchInstructorTopics() {
                this.topics = [];
                topicService.getByInstructor(
                    this.topicPage,
                    this.userProfile.personId,
                    this.monthDataRequest.courseId,
                    this.selectedClassLevel,
                    '',
                    100
                ).then((res) => {
                    if (res._embedded) {
                        this.topics = res._embedded.topicResourceList;
                        topicService.getByInstructor(
                            this.topicPage,
                            this.userProfile.personId,
                            this.monthDataRequest.courseId,
                            '',
                            '',
                            100,
                            this.selectedClassObj.classId
                        ).then((res) => {
                            if (res._embedded) {
                                this.topics = [...this.topics, ...res._embedded.topicResourceList];
                            }
                        })
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
                    this.gradeReasons = res.map((item) => {
                        item.reasonTitle = item[this.reasonLang[this.currentLang]];
                        return item;
                    });
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
                const quarterStartDate = moment(this.school.quarterStart, 'DD.MM.YYYY').format('YYYY-MM-DD');
                const gradeDate = moment(date.day, 'DD.MM.YYYY').format('YYYY-MM-DD');
                if (gradeDate < quarterStartDate) {
                    this.$toast.error('Вы не можете изменить предыдущую четверть!');
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
                this.$modal.hide('set-grade-modal');
                this.submitSaveGrades([newGradeObj]);
            },

            deleteGrade() {
                if (this.selectedGradeObj.gradeId) {
                    this.isLoading = true;
                    this.selectedGradeObj.mark = '99';
                    GradeService.createWithArray([this.selectedGradeObj]).then(() => {
                        this.deleteMarkLocalStudentArr(this.selectedGradeObj);
                        this.$toast.success('Успешно удалено!');
                        this.isLoading = false;
                        this.$modal.hide('set-grade-modal');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            addMarkToLocalStudentArr(newGradeObj) {
                newGradeObj.studentId = this.selectedStudent.student.id;
                newGradeObj.courseId = this.monthDataRequest.courseId;
                newGradeObj.gradeDate = moment(newGradeObj.gradeDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                GradeService.getStudentSpecificGrade(newGradeObj).then((res) => {
                    newGradeObj.gradeId = res[0].id;
                    newGradeObj.gradeDate = newGradeObj.date;
                    this.studentGrades = this.studentGrades.map((student) => {
                        if (student.student.id === this.selectedStudent.student.id) {
                            student.grades.push(newGradeObj);
                        }
                        return student;
                    });
                    this.isLoading = false;
                    this.$toast.success('Успешно');
                    console.log('allStudentsList: ', this.studentGrades);
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                });
            },

            deleteMarkLocalStudentArr(newGradeObj) {
                this.studentGrades.forEach((student) => {
                    if (student.student.id === this.selectedStudent.student.id) {
                        student.grades.forEach((existGrade, index, selfArr) => {
                            const isExist = existGrade.date === newGradeObj.date &&
                                            existGrade.shiftTimeId === newGradeObj.shiftTimeId;
                            if (isExist) {
                                selfArr.splice(index, 1);
                            }
                        });
                    }
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
                return moment(new Date(this.gradeYear, this.gradeMonthFrom, 1)).format('DD.MM.YYYY');
            },

            getLastDateOfMonth() {
                return moment(new Date(this.gradeYear, this.gradeMonthTo, 0)).format('DD.MM.YYYY');
            },

            submitSaveGrades(sendGradeArr) {
                this.isLoading = true;
                GradeService.createWithArray(sendGradeArr).then(() => {
                    this.deleteMarkLocalStudentArr(sendGradeArr[0]);
                    this.addMarkToLocalStudentArr(sendGradeArr[0]);
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            exportGradesPdf() {
                this.isLoading = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        const currentClass = this.selectedClassObj.classLevel + this.selectedClassObj.classLabel;
                        const month = this.numMonths[this.currentMonthDays[0].day.slice(3, 5)];
                        const firstDay = this.currentMonthDays[0].day.slice(0, 2);
                        const lastDay = this.currentMonthDays[this.currentMonthDays.length - 1].day.slice(0, 2);
                        const widths = ['auto', ...this.currentMonthDays.map((i) => 22)];
                        const exportHeaders = [{text: `${month} ${firstDay}-${lastDay}`, style: 'general'}];
                        const exportRowsData = [];
                        this.currentMonthDays.forEach((date) => {
                            exportHeaders.push({text: date.day.slice(0, 2), style: 'general'});
                        });
                        this.studentGrades.forEach((student) => {
                            const studentArr = [{text: `${student.student.surname} ${student.student.name}`, style: 'general'}];
                            this.currentMonthDays.forEach((dateObj) => {
                                const mark = this.getStudentSpecificMark(dateObj, student.grades);
                                studentArr.push({text: mark, style: 'general'});
                            });
                            exportRowsData.push(studentArr)
                        });
                        const docDefinition = {
                            header: [{
                                text: `Оценки ${currentClass} класс, ${this.selectedCourseObj.courseTitle}, школа ${this.school.name}`,
                                style: 'headTitle'
                            }],
                            pageOrientation: 'landscape',
                            pageSize: 'A4',
                            permissions: {
                                printing: 'highResolution',
                                modifying: false,
                                copying: false,
                                annotating: true,
                                fillingForms: true,
                                contentAccessibility: true,
                                documentAssembly: true
                            },
                            content: [{
                                columns: [
                                    { width: '*', text: '' },
                                    {
                                        width: 'auto',
                                        table: {
                                            headerRows: 1,
                                            widths: widths,
                                            body: [exportHeaders, ...exportRowsData],
                                            alignment: 'center'
                                        }
                                    },
                                    { width: '*', text: '' },
                                ]
                            }],
                            styles: {
                                general: {
                                    fontSize: 11,
                                    alignment: 'center',
                                    margin: [0, 0, 0, 0]
                                },
                                headTitle: {
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 13,
                                    margin: [0, 10, 0, 0]
                                },
                            }
                        };
                        pdfMake.createPdf(docDefinition).download(`Оценки ${currentClass} класс, школа ${this.school.name}.pdf`);
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 50);
                    });
                });
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
            .other {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                .selected-year {
                    color: #1976d2;
                }
                button.export {
                    background: #1976d2;
                    color: #fff;
                    padding: 0 8px;
                    border-radius: 4px;
                    outline: none;
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
                        cursor: pointer;
                        &:hover {
                            background: #fafafa;
                            box-shadow: 0 0 20px 0 rgba(74, 39, 243, 0.51);
                        }
                        &.absent-95 {
                            color: #fa1504;
                        }
                        &.average {
                            pointer-events: none;
                        }
                    }
                }
            }

            .disabled {
                background: #eaeaea;
                pointer-events: none;
            }
            .archived {
                pointer-events: none;
                background: #cef9ffe3;
                opacity: 0.5;
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
