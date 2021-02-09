<template>
    <div class="school-admin-schedule">
        <PreLoader v-if="isLoading" />
        <SuperAdminSchoolHead>
            <template v-slot:title>
                Расписание
            </template>
            <template v-slot:center>
                <div class="shift-actions">
                    <div class="select-shift">
                        <v-select
                            :items="allShifts"
                            item-text="name"
                            item-value="id"
                            v-model="selectedShiftId"
                            label="Выбрать смену"
                            @change="onSelectShift"
                        ></v-select>
                    </div>
                    <router-link :to="{name: 'shifts'}">
                        <v-btn color="primary">
                            Все смены
                        </v-btn>
                    </router-link>
                </div>
            </template>
        </SuperAdminSchoolHead>

        <div class="schedule-content" v-if="shiftTimes.length" ref="schedule">
            <div class="other-actions">
                <div class="main-btn">
                    <div class="switch-filter">
                        <v-switch label="Учитель/Класс" v-model="classViewSchedule"/>
                    </div>
                </div>
                <div class="print-btn">
                    <v-btn color="primary" @click="downloadPdf">Скачать(PDF)</v-btn>
                </div>
            </div>

            <!--FIXED TABLE HEADER-->
            <FixedScheduleTableHeader
                ref="fixedTable"
                :days="days"
                :shiftTimes="shiftTimes"
                :teacherLabelWidth="teacherLabelWidth"
                :courseLabelWidth="courseLabelWidth"
                :classViewSchedule="classViewSchedule"
                :showScrollArrows="showScrollArrows"
                @scrollTable="scrollTable"
            />
            <div class="teacher-course-tables" v-if="!classViewSchedule" ref="teacherTable">
                <table class="teachers">
                    <!--<thead>-->
                    <!--<tr>-->
                        <!--<th ref="teacherLabel">Учитель</th>-->
                        <!--<th ref="courseLabel">Предмет</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <tbody>
                    <tr v-for="teacher in allTeachers" :key="teacher.id">
                        <td class="teacher-name" :class="{'same': !teacher.teacherName}" ref="teacherLabel">
                            <span v-if="teacher.teacherName" :class="{'space': teacher.several}">{{teacher.teacherName}}</span>
                            <span class="empty" v-else>-</span>
                        </td>
                        <td class="course-name" ref="courseLabel">{{ teacher[langObj[currentLang]] }}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="schedule-teacher-course" ref="scheduleTable">
                    <!--<thead>-->
                    <!--<tr>-->
                        <!--<th v-for="day in days">-->
                            <!--<div class="day">{{ day.name }}</div>-->
                            <!--<div class="shiftTime">-->
                                <!--<span v-for="time in shiftTimes">{{ time.name }}</span>-->
                            <!--</div>-->
                        <!--</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <tbody>
                    <tr v-for="teacher in allTeachers" :key="teacher.id">
                        <td class="days" v-for="day in days">
                            <div class="classes">
                                <template v-for="time in shiftTimes">
                                    <span
                                        v-if="getSpecificSchedule(day.day, time.id, teacher).length"
                                        class="hasClass"
                                        :class="{'group-color': getSpecificSchedule(day.day, time.id, teacher)[0].grouped}"
                                        @click="openScheduleModal(
                                            'edit', day.day, time.id, teacher,
                                            getSpecificSchedule(day.day, time.id, teacher)
                                            )"
                                    >
                                     {{ getSpecificSchedule(day.day, time.id, teacher)[0].classTitle.replace(' ', '') }}
                                    </span>

                                    <span
                                        class="noClass"
                                        @click="openScheduleModal('create', day.day, time.id, teacher)"
                                        v-else
                                    >
                                    </span>
                                </template>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <!--FILTERED SCHEDULE BY CLASSES-->
            <div class="class-schedule-tables teacher-course-tables" v-if="classViewSchedule" ref="classTable">
                <table class="class-name-table">
                    <!--<thead>-->
                    <!--<tr>-->
                        <!--<th>Класс</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <tbody>
                    <tr v-for="klass in classes" :key="klass.id">
                        <td class="className teacher-name">
                            <span>{{klass.classLevel + ' ' + klass.classLabel}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="class-courses-table" ref="scheduleTable">
                    <!--<thead>-->
                    <!--<tr>-->
                        <!--<th v-for="day in days">-->
                            <!--<div class="day">{{ day.name }}</div>-->
                            <!--<div class="shiftTime">-->
                                <!--<span v-for="time in shiftTimes">{{ time.name }}</span>-->
                            <!--</div>-->
                        <!--</th>-->
                    <!--</tr>-->
                    <!--</thead>-->
                    <tbody>
                    <tr v-for="klass in classes" :key="klass.id">
                        <td class="days" v-for="day in days">
                            <div class="classes">
                                <template v-for="time in shiftTimes">
                                    <span
                                        v-if="getSpecificCourseSchedule(day.day, time.id, klass)"
                                        class="courseCode"
                                        @click="openCourseScheduleModal(
                                            'edit', day.day, time.id, klass,
                                            getSpecificCourseSchedule(day.day, time.id, klass)
                                            )"
                                    >
                                    {{ getSpecificCourseSchedule(day.day, time.id, klass)[langObj[currentLang]].slice(0,4) }}
                                    </span>
                                    <span
                                        class="noClass"
                                        @click="openCourseScheduleModal('create', day.day, time.id, klass)"
                                        v-else
                                    >
                                    </span>
                                </template>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import ShiftService from '@/_services/shift.service';
    import ShiftTimeService from '@/_services/shift-time.service';
    import SchoolClassService from '@/_services/school-class.service';
    import {InstructorCourseService} from '@/_services/instructor-course.service';
    const instructorCourseService = new InstructorCourseService();
    import QuadArrowIcon from '@/components/icons/QuadArrowIcon';
    import DeleteIcon from '@/components/icons/DeleteIcon';
    import * as moment from 'moment';
    import PreLoader from '@/components/preloader/PreLoader';
    import FixedScheduleTableHeader from '@/components/table/FixedScheduleTableHeader';
    import TeacherScheduleModal from '@/components/schedule/TeacherScheduleModal';
    import pdfMake from 'pdfmake/build/pdfmake';
    import pdfFonts from 'pdfmake/build/vfs_fonts';
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    export default {
        components: {
            SuperAdminSchoolHead,
            QuadArrowIcon,
            DeleteIcon,
            PreLoader,
            FixedScheduleTableHeader
        },
        data() {
            return {
                isLoading: false,
                required: [v => !!v || 'Обязательное поле'],
                sendScheduleObj: {
                    chronicleId: 0,
                    classId: 0,
                    courseId: 0,
                    instructorId: 0,
                    shiftTimeId: 0,
                    weekDay: '',
                    groupTitle: '',
                    grouped: false,
                    archived: false,
                    replace: false,
                    replaceDate: '',
                    instrCourseId: ''
                },
                langObj: {
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                objDay: {
                    MONDAY: 'Понедельник',
                    TUESDAY: 'Вторник',
                    WEDNESDAY: 'Среда',
                    THURSDAY: 'Четверг',
                    FRIDAY: 'Пятница',
                    SATURDAY: 'Суббота'
                },
                objNumDays: {
                    '1': 'MONDAY',
                    '2': 'TUESDAY',
                    '3': 'WEDNESDAY',
                    '4': 'THURSDAY',
                    '5': 'FRIDAY',
                    '6': 'SATURDAY',
                },
                days: [
                    {day: 'MONDAY', name: 'Понедельник'},
                    {day: 'TUESDAY', name: 'Вторник'},
                    {day: 'WEDNESDAY', name: 'Среда'},
                    {day: 'THURSDAY', name: 'Четверг'},
                    {day: 'FRIDAY', name: 'Пятница'},
                    {day: 'SATURDAY', name: 'Суббота'},
                ],
                mode: '',
                classViewSchedule: false,
                showFixedHeader: false,
                showScrollArrows: true,
                manualScroll: true,
                currentShiftId: '',
                selectedShiftTime: {},
                classes: [],
                allSchedules: [],
                allShifts: [],
                shiftTimes: [],
                allTeachers: [],
                teacherLabelWidth: 0,
                courseLabelWidth: 0,
                selectedShiftId: 0
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            },
            currentLang() {
                return this.$root.$i18n.locale;
            }
        },

        created() {
            this.isLoading = true;
            this.getAllSchoolInstructors();
            this.getAllSchoolShifts();
        },

        beforeDestroy() {
            if (this.$refs.scheduleTable) {
                this.$refs.scheduleTable.removeEventListener('scroll', this.horizontalScheduleScrollListener);
            }
        },

        methods: {
            async onSelectShift(shiftId) {
                this.isLoading = true;
                this.currentShiftId = shiftId;
                await this.getAllSchoolClasses();
                await this.getShiftTimesByShiftId();
                await this.fetchScheduleData();
            },

            getAllSchoolInstructors() {
                instructorCourseService.getAllWithoutPagination(this.school.id).then((res) => {
                    if (res.length) {
                        Object.entries(res.map((item, index) => ({...item, id: index + 1})).reduce((obj, el) => {
                            obj[el.instructorId] = [...obj[el.instructorId] || [], el];
                            return obj;
                        }, {})).forEach((item) => {
                            item[1][0].teacherName = item[1][0].instructorTitle;
                            item[1][0].several = item[1].length > 1;
                            item[1].forEach((instrCourse) => {
                                this.allTeachers.push(instrCourse);
                            })
                        });
                    }
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchScheduleData() {
                this.allSchedules = [];
                ScheduleWeekService.getAllBySchoolAndShift(this.school.id, this.currentShiftId).then((res) => {
                    this.allSchedules = res.map((schedule) => {
                        schedule.classTitle = schedule.classLevel + schedule.classLabel;
                        schedule.weekDay = this.objNumDays[schedule.weekDay];
                        return schedule;
                    });
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (this.$refs.scheduleTable) {
                                this.$refs.scheduleTable.addEventListener('scroll', this.horizontalScheduleScrollListener);
                                this.showScrollArrows = this.$refs.scheduleTable.scrollWidth > this.$refs.scheduleTable.clientWidth;
                                if (!this.classViewSchedule) {
                                    this.teacherLabelWidth = this.$refs.teacherLabel[0].offsetWidth;
                                    this.courseLabelWidth = this.$refs.courseLabel[0].offsetWidth;
                                }
                            }
                            this.isLoading = false;
                        }, 20);
                    });
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            getAllSchoolShifts() {
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    this.allShifts = res;
                    if (res.length) {
                        this.selectedShiftId = res[0].id;
                        this.onSelectShift(this.selectedShiftId);
                    } else {
                        this.isLoading = false;
                    }
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            getAllSchoolClasses() {
                SchoolClassService.getAllBySchool(this.school.id).then((res) => {
                    this.classes = res.map((klass) => {
                        klass.classTitle = klass.classLevel + klass.classLabel;
                        return klass;
                    });
                }).catch(err => this.$toast.error(err));
            },

            getShiftTimesByShiftId() {
                ShiftTimeService.getAllByShiftId(this.currentShiftId).then((res) => {
                    this.shiftTimes = res.sort((a, b) => a.name - b.name);
                }).catch(err => this.$toast.error(err));
            },

            getSpecificSchedule(day, timeId, teacher) {
                return this.allSchedules.filter(schedule =>
                    schedule.weekDay === day &&
                    schedule.shiftTimeId === timeId &&
                    schedule.instructorId === teacher.instructorId &&
                    schedule.courseId === teacher.courseId
                );
            },

            scrollTable(nav) {
                this.manualScroll = false;
                const scheduleTable = this.$refs.scheduleTable;
                const fixedHeadTable = this.$refs.fixedTable.$refs.fixedHead;
                if (nav === 'right') {
                    scheduleTable.scrollLeft = scheduleTable.scrollWidth - scheduleTable.clientWidth;
                    fixedHeadTable.scrollLeft = scheduleTable.scrollWidth - scheduleTable.clientWidth;
                } else {
                    scheduleTable.scrollLeft = 0;
                    fixedHeadTable.scrollLeft = 0;
                }
                setTimeout(() => {
                    this.manualScroll = true;
                }, 450)
            },

            horizontalScheduleScrollListener() {
                if (this.manualScroll) {
                    const fixedTableHeader = this.$refs.fixedTable.$refs.fixedHead;
                    fixedTableHeader.scrollLeft = this.$refs.scheduleTable.scrollLeft;
                }
            },

            openScheduleModal(mode, day, timeId, teacher, schedules) {
                this.mode = mode;
                this.selectedShiftTime = this.shiftTimes.find((time) => time.id === timeId);
                this.sendScheduleObj.chronicleId = this.school.chronicleId;
                this.sendScheduleObj.weekDay = day;
                this.sendScheduleObj.shiftTimeId = timeId;
                this.sendScheduleObj.instructorId = teacher.instructorId;
                this.sendScheduleObj.courseId = teacher.courseId;
                if (mode === 'create') {
                    this.sendScheduleObj.classId = '';
                    this.sendScheduleObj.grouped = false;
                    this.sendScheduleObj.groupTitle = '';
                    this.sendScheduleObj.replace = false;
                } else {
                    this.sendScheduleObj.chronicleId = this.school.chronicleId;
                    this.sendScheduleObj.weekDay = schedules[0].weekDay;
                    this.sendScheduleObj.shiftTimeId = schedules[0].shiftTimeId;
                    this.sendScheduleObj.instructorId = schedules[0].instructorId;
                    this.sendScheduleObj.courseId = schedules[0].courseId;
                    this.sendScheduleObj.classId = schedules[0].classId;
                    this.sendScheduleObj.grouped = schedules[0].grouped;
                    this.sendScheduleObj.groupTitle = schedules[0].groupTitle;
                    this.sendScheduleObj.replace = schedules[0].replace;
                    this.sendScheduleObj.id = schedules[0].id;
                    this.mode = 'edit';
                }
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$modal.show(
                            TeacherScheduleModal,
                            {
                                mode: this.mode,
                                objDay: this.objDay,
                                sendScheduleObj: this.sendScheduleObj,
                                selectedShiftTime: this.selectedShiftTime,
                                classes: this.classes,
                                classViewSchedule: this.classViewSchedule,
                                teacherTitleCourse: teacher.instructorTitle +'-'+ teacher.courseTitle
                            },
                            {height: 'auto', width: '800px'},
                            {'before-close': this.onScheduleModalAction}
                        )
                    }, 30)
                })
            },

            onScheduleModalAction(event) {
                if (event.params) {
                    if (event.params.type) {
                        this.mode = event.params.mode;
                        if (event.params.type === 'save') {
                            this.submit();
                        } else {
                            this.removeSchedule(event.params.scheduleId);
                        }
                    }
                    if (event.params.archiveData) {
                        this.allSchedules = this.allSchedules.filter((item) => {
                            const equal = item.instructorId === event.params.archiveData.instructorId &&
                                          item.courseId === event.params.archiveData.courseId &&
                                          item.classId === event.params.archiveData.classId;
                            if (!equal) {
                                return item;
                            }
                        });
                    }
                }
            },

            submit() {
                const createModes = ['create', 'addGroupClass'];
                if (createModes.includes(this.mode)) {
                    this.submitCreateSchedule();
                } else {
                    this.submitUpdateSchedule();
                }
            },

            submitCreateSchedule() {
                this.isLoading = true;
                ScheduleWeekService.create(this.sendScheduleObj).then((res) => {
                    let scheduleObj = JSON.parse(JSON.stringify(this.sendScheduleObj));
                    scheduleObj.id = res.id;
                    scheduleObj.classTitle = res.classTitle;
                    scheduleObj.courseCode = res.courseCode;
                    scheduleObj.courseTitle = res.courseTitle;
                    scheduleObj.courseTitleKG = res.courseTitleKG;
                    this.allSchedules.push(scheduleObj);
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.success('Успешно добавлено!');
                        }, 30);
                    });
                }).catch((err) => {
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.error(err);
                        }, 30);
                    });
                })
            },

            submitUpdateSchedule() {
                this.isLoading = true;
                const newClass = this.classes.find((klass) => klass.id === this.sendScheduleObj.classId);
                ScheduleWeekService.update(this.sendScheduleObj).then(() => {
                    this.allSchedules = this.allSchedules.map((schedule) => {
                        if (schedule.id === this.sendScheduleObj.id) {
                            schedule.classId = newClass.id;
                            schedule.grouped = this.sendScheduleObj.grouped;
                            schedule.groupTitle = this.sendScheduleObj.groupTitle;
                            schedule.classTitle = `${newClass.classLevel} ${newClass.classLabel}`;
                            if (this.classViewSchedule) {
                                schedule.instructorId = this.sendScheduleObj.instructorId;
                                schedule.courseId = this.sendScheduleObj.courseId;
                                schedule.courseCode = this.sendScheduleObj.courseCode;
                                schedule.courseTitle = this.sendScheduleObj.courseTitle;
                                schedule.courseTitleKG = this.sendScheduleObj.courseTitleKG;
                            }
                        }
                        return schedule;
                    });
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.success('Успешно обновлено!');
                        }, 30);
                    });
                }).catch((err) => {
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.error(err);
                        }, 30);
                    });
                })
            },

            removeSchedule(scheduleId) {
                this.isLoading = true;
                ScheduleWeekService.deleteSchedule(scheduleId).then(() => {
                    this.allSchedules.forEach((schedule, i, selfArr) => {
                        if (schedule.id === this.sendScheduleObj.id) {
                            selfArr.splice(i, 1);
                        }
                    });
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.success('Успешно удалено!');
                        }, 30);
                    });
                }).catch((err) => {
                    this.isLoading = false;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$toast.error(err);
                        }, 30);
                    });
                })
            },

            //Filter by class functions

            getSpecificCourseSchedule(day, timeId, klass) {
                return this.allSchedules.find((schedule) =>
                    schedule.weekDay === day &&
                    schedule.shiftTimeId === timeId &&
                    schedule.classId === klass.id
                );
            },

            openCourseScheduleModal(mode, day, timeId, klass, schedule) {
                this.mode = mode;
                this.selectedShiftTime = this.shiftTimes.find((time) => time.id === timeId);
                this.sendScheduleObj.chronicleId = this.school.chronicleId;
                this.sendScheduleObj.weekDay = day;
                this.sendScheduleObj.shiftTimeId = timeId;
                this.sendScheduleObj.classId = klass.id;
                if (mode === 'create') {
                    this.sendScheduleObj.instrCourseId = '';
                    this.sendScheduleObj.replace = false;
                } else {
                    this.sendScheduleObj.grouped = schedule.grouped;
                    this.sendScheduleObj.groupTitle = schedule.groupTitle;
                    this.sendScheduleObj.replace = schedule.replace;
                    this.sendScheduleObj.id = schedule.id;
                    const instrCours = this.allTeachers.find((teacher) =>
                        teacher.instructorId === schedule.instructorId &&
                        teacher.courseId === schedule.courseId
                    );
                    this.sendScheduleObj.instrCourseId = instrCours ? instrCours.id : '';
                }
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$modal.show(
                            TeacherScheduleModal,
                            {
                                mode: this.mode,
                                objDay: this.objDay,
                                sendScheduleObj: this.sendScheduleObj,
                                selectedShiftTime: this.selectedShiftTime,
                                allTeachers: this.allTeachers,
                                classViewSchedule: this.classViewSchedule
                            },
                            {height: 'auto', width: '450px'},
                            {'before-close': this.onScheduleModalAction}
                        );
                    }, 30);
                });
            },

            downloadPdf() {
                if (this.classViewSchedule) {
                    this.downloadClassSchedulePdf();
                } else {
                    this.downloadTeacherSchedulePdf();
                }
            },

            downloadTeacherSchedulePdf() {
                this.isLoading = true;
                const width = this.shiftTimes.map((time) => 12);
                const exportScheduleData = [];
                this.allTeachers.forEach((teacher) => {
                    const currentScheduleArr = [];
                    currentScheduleArr.push({text: teacher.instructorTitle, style: 'general'});
                    currentScheduleArr.push({text: teacher[this.langObj[this.currentLang]], style: 'general'});
                    this.days.forEach((day) => {
                        let daySchedules = [];
                        this.shiftTimes.forEach((time) => {
                            const schedules = this.getSpecificSchedule(day.day, time.id, teacher);
                            const foundSchedule = schedules.length ? schedules[0].classTitle : '';
                            daySchedules.push({
                                text: foundSchedule,
                                style: 'general',
                                border: [false, false, true, false]
                            });
                        });
                        currentScheduleArr.push([{
                            table: {
                                widths: width,
                                body: [daySchedules]
                            }
                        }]);
                    });
                    exportScheduleData.push(currentScheduleArr);
                });

                const docDefinition = {
                    header: [{text: `Недельное расписание школы ${this.school.name}`, style: 'headTitle'}],
                    pageOrientation: 'landscape',
                    pageSize: 'A3',
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
                        table: {
                            headerRows: 2,
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                [
                                    '',
                                    '',
                                    {text: 'Понедельник', style: 'general'},
                                    {text: 'Вторник', style: 'general'},
                                    {text: 'Среда', style: 'general'},
                                    {text: 'Четверг', style: 'general'},
                                    {text: 'Пятница', style: 'general'},
                                    {text: 'Суббота', style: 'general'}
                                ],
                                [
                                    {text: 'Учитель', style: 'general'},
                                    {text: 'Предмет', style: 'general'},
                                    this.exportShiftTimes(12),
                                    this.exportShiftTimes(12),
                                    this.exportShiftTimes(12),
                                    this.exportShiftTimes(12),
                                    this.exportShiftTimes(12),
                                    this.exportShiftTimes(12)
                                ],
                            ]
                        }
                    }],
                    styles: {
                        general: {
                            fontSize: 7,
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
                docDefinition.content[0].table.body = [...docDefinition.content[0].table.body, ...exportScheduleData];
                setTimeout(() => {
                    pdfMake.createPdf(docDefinition).download(`Расписание школы ${this.school.name}.pdf`);
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 50);
                }, 100);
            },

            downloadClassSchedulePdf() {
                this.isLoading = true;
                const width = this.shiftTimes.map((time) => 16);
                const exportScheduleData = [];
                this.classes.forEach((klass) => {
                    const currentScheduleArr = [];
                    currentScheduleArr.push({text: klass.classLevel+klass.classLabel, style: 'general'});
                    this.days.forEach((day) => {
                        let daySchedules = [];
                        this.shiftTimes.forEach((time) => {
                            const schedule = this.getSpecificCourseSchedule(day.day, time.id, klass);
                            const foundSchedule = schedule ? schedule[this.langObj[this.currentLang]].slice(0,3) : '';
                            daySchedules.push({
                                text: foundSchedule,
                                style: 'general',
                                border: [false, false, true, false]
                            });
                        });
                        currentScheduleArr.push([{
                            table: {
                                widths: width,
                                body: [daySchedules]
                            }
                        }]);
                    });
                    exportScheduleData.push(currentScheduleArr);
                });

                const docDefinition = {
                    header: [{text: `Недельное расписание школы ${this.school.name}`, style: 'headTitle'}],
                    pageOrientation: 'landscape',
                    pageSize: 'A3',
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
                        table: {
                            headerRows: 2,
                            widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                [
                                    '',
                                    {text: 'Понедельник', style: 'general'},
                                    {text: 'Вторник', style: 'general'},
                                    {text: 'Среда', style: 'general'},
                                    {text: 'Четверг', style: 'general'},
                                    {text: 'Пятница', style: 'general'},
                                    {text: 'Суббота', style: 'general'}
                                ],
                                [
                                    {text: 'Класс', style: 'general'},
                                    this.exportShiftTimes(16),
                                    this.exportShiftTimes(16),
                                    this.exportShiftTimes(16),
                                    this.exportShiftTimes(16),
                                    this.exportShiftTimes(16),
                                    this.exportShiftTimes(16)
                                ],
                            ]
                        }
                    }],
                    styles: {
                        general: {
                            fontSize: 7,
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
                docDefinition.content[0].table.body = [...docDefinition.content[0].table.body, ...exportScheduleData];
                setTimeout(() => {
                    pdfMake.createPdf(docDefinition).download(`Расписание(класс-вид) школы ${this.school.name}.pdf`);
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 50);
                }, 100);
            },

            exportShiftTimes(num) {
                const data = [];
                const width = this.shiftTimes.map((time) => num);
                this.shiftTimes.forEach((time) => {
                    data.push({text: time.name, style: 'general', border: [false, false, true, false]});
                });
                return [{
                    table: {
                        widths: width,
                        body: [data]
                    },
                }]
            },

        }
    }
</script>

<style lang="scss">
    body {
        scroll-behavior: smooth;
    }
    .school-admin-schedule {
        .shift-actions {
            display: flex;
            align-items: center;
            .select-shift {
                margin-right: 30px;
            }
        }
        .schedule-content {
            margin: 27px;
            .other-actions {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
                .main-btn {
                    display: flex;
                    align-items: center;
                }
            }
            .teacher-course-tables {
                display: flex;
                align-items: center;
                justify-content: center;
                table.teachers, table.class-name-table {
                    background: #fff;
                    border-bottom: 1px solid rgba(#707070, 0.8);
                    tr {
                        th {
                            border: 1px solid rgba(#707070, 0.8);
                            height: 49px;
                            min-width: 49px;
                            max-width: 49px;
                            width: 49px;
                            text-align: center;
                            color: #5e5e5e;
                        }
                        td {
                            border-top: 1px solid rgba(#707070, 0.8);
                            border-left: 1px solid rgba(#707070, 0.8);
                            border-right: 1px solid rgba(#707070, 0.8);
                            font-size: 14px;
                            &.className {
                                min-width: 49px;
                            }
                            &.teacher-name {
                                text-align: center;
                                span {
                                    display: inline-block;
                                    padding: 5px 8px;
                                    white-space: nowrap;
                                    height: 30px;
                                    &.space {
                                        transform: translateY(15px);
                                    }
                                    &.empty {
                                        color: transparent;
                                    }
                                }
                            }
                            &.course-name {
                                padding: 0 8px;
                                white-space: nowrap;
                                text-align: center;
                            }
                            &.same {
                                border-top-color: transparent;
                            }
                        }
                    }
                }
                table.schedule-teacher-course, table.class-courses-table {
                    border-top: 0;
                    border-left: 0;
                    border-bottom: 0;
                    max-width: 100%;
                    overflow-x: auto;
                    display: inline-block;
                    scroll-behavior: smooth;
                    background: #fff;
                    &::-webkit-scrollbar {
                        width: 0;
                        height: 0;
                        background: transparent;
                    }
                    &::-webkit-scrollbar-thumb {
                        background-color: rgba(0, 0, 0, 0.3)
                    }
                    tr {
                        th {
                            border: 1px solid rgba(#707070, 0.8);
                            border-right: 2px solid rgba(#707070, 0.8);
                            min-height: 49px;
                            .day {
                                text-align: center;
                                color: #5e5e5e;
                            }
                            .shiftTime {
                                display: flex;
                                span {
                                    display: inline-block;
                                    text-align: center;
                                    width: 32px;
                                    color: #5e5e5e;
                                    &:not(:last-child) {
                                        border-right: 1px solid rgba(#707070, 0.8);
                                    }
                                }
                            }
                        }
                        td {
                            border: 1px solid rgba(#707070, 0.8);
                            border-right: 2px solid rgba(#707070, 0.8);
                            &.days {
                                line-height: 0;
                                .classes {
                                    display: flex;
                                    span {
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        width: 32px;
                                        height: 30px;
                                        font-size: 15px;
                                        cursor: pointer;
                                        &:not(:last-child) {
                                            border-right: 1px solid rgba(#707070, 0.8);
                                        }
                                        &.noCourse {
                                            cursor: default;
                                        }
                                        &.courseCode {
                                            font-size: 11px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .group-color {
                background: #009688;
                color: #fff;
            }
            .scroll-arrows {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 70px;
                padding-top: 10px;
                .left {
                    transform: rotate(180deg) translateY(7px);
                }
            }
        }

        .export-title {
            display: none;
            text-align: center;
            margin: 20px 0 35px;
            text-transform: uppercase;
        }
        .print-btn {
            text-align: right;
            margin-left: 70px;
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
