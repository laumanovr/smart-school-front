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

        <div class="schedule-content" v-if="showContent && shiftTimes.length" ref="schedule">
            <div class="other-actions">
                <div class="main-btn">
                    <div class="switch-filter">
                        <v-switch label="Учитель/Класс" v-model="classViewSchedule"/>
                    </div>
                    <div class="scroll-arrows" v-show="showScrollArrows">
                        <QuadArrowIcon class="left" @click="scrollTable('left')"/>
                        <QuadArrowIcon @click="scrollTable('right')"/>
                    </div>
                </div>
                <div class="print-btn">
                    <v-btn color="primary" @click="exportPdf">Экспорт</v-btn>
                </div>
            </div>
            <h2 class="export-title">Недельное расписание школы {{school.name}}</h2>

            <div class="teacher-course-tables" v-if="!classViewSchedule" ref="teacherTable">
                <table class="teachers">
                    <thead>
                    <tr>
                        <th ref="teacherLabel">Учитель</th>
                        <th ref="courseLabel">Предмет</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="teacher in allTeachers" :key="teacher.id">
                        <td class="teacher-name" :class="{'same': !teacher.teacherName}">
                            <span v-if="teacher.teacherName" :class="{'space': teacher.several}">{{teacher.teacherName}}</span>
                            <span class="empty" v-else>-</span>
                        </td>
                        <td class="course-name">{{ teacher[langObj[currentLang]] }}</td>
                    </tr>
                    </tbody>
                </table>
                <table class="schedule-teacher-course" ref="scheduleTable">
                    <thead>
                    <tr>
                        <th v-for="day in days">
                            <div class="day">{{ day.name }}</div>
                            <div class="shiftTime">
                                <span v-for="time in shiftTimes">{{ time.name }}</span>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="teacher in allTeachers" :key="teacher.id">
                        <td class="days" v-for="day in days">
                            <div class="classes">
                                <template v-for="time in shiftTimes">
                                    <span
                                        class="hasClass"
                                        :class="{'group-color': getSpecificSchedule(day.day, time.id, teacher).length > 1}"
                                        v-if="getSpecificSchedule(day.day, time.id, teacher).length"
                                        @click="openScheduleModal(
                                            'edit', day.day, time.id, teacher,
                                            getSpecificSchedule(day.day, time.id, teacher))"
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
                    <thead>
                    <tr>
                        <th>Класс</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="klass in classes" :key="klass.id">
                        <td class="className teacher-name">
                            <span>{{klass.classLevel + ' ' + klass.classLabel}}</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="class-courses-table" ref="scheduleTable">
                    <thead>
                    <tr>
                        <th v-for="day in days">
                            <div class="day">{{ day.name }}</div>
                            <div class="shiftTime">
                                <span v-for="time in shiftTimes">{{ time.name }}</span>
                            </div>
                        </th>
                    </tr>
                    </thead>
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

        <!--TEACHER COURSE SCHEDULE MODAL CREATE EDIT DELETE-->
        <modal name="schedule-modal" width="440px" height="auto">
            <div class="modal-container">
                <div class="lesson-day">{{objDay[sendScheduleObj.weekDay]}} - {{'Урок ' + selectedShiftTime.name}}</div>
                <v-form ref="scheduleForm">
                    <template v-if="mode == 'create' || mode == 'edit'">
                        <h4>{{mode == 'create' ? 'Добавить расписание' : 'Редактировать расписание' }}</h4>
                        <div class="delete-schedule" v-if="mode == 'edit'">
                            <DeleteIcon @click="removeSchedule" />
                        </div>
                        <div class="content">
                            <v-select
                                :items="classes"
                                :rules="required"
                                :item-text="getFullClassTitle"
                                item-value="id"
                                label="Выбрать класс"
                                v-model="sendScheduleObj.classId"
                            ></v-select>

                            <div class="with-group">
                                <v-switch label="Группа" v-model="sendScheduleObj.grouped"/>
                                <template v-if="sendScheduleObj.grouped">
                                    <v-text-field :rules="required" label="Название" v-model="sendScheduleObj.groupTitle"/>
                                </template>
                                <div
                                    class="add-group-class"
                                    v-if="sendScheduleObj.grouped && originGrouped && mode == 'edit' && showAddGroup"
                                    @click="addGroupScheduleMode"
                                >
                                    Добавить класс к группе
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-if="mode == 'addGroupClass'">
                        <h4>Добавить класс к группе: {{sendScheduleObj.groupTitle}}</h4>
                        <div class="content">
                            <v-select
                                :items="classes"
                                :rules="required"
                                :item-text="getFullClassTitle"
                                item-value="id"
                                label="Выбрать класс"
                                v-model="sendScheduleObj.classId"
                            ></v-select>
                        </div>
                    </template>

                    <template v-if="mode == 'groupedClasses'">
                        <div class="content">
                            <div class="group-info">Группа: {{groupedSchedules[0].groupTitle}}</div>
                            <div class="group-info">Классы:</div>
                            <div class="groups">
                                <div
                                    class="group"
                                    v-for="schedule in groupedSchedules"
                                    :key="schedule.id"
                                    @click="editScheduleMode(schedule, false)"
                                >
                                    {{schedule.classTitle}}
                                </div>
                            </div>
                            <div class="btn-actions">
                                <v-btn color="primary" @click="addGroupScheduleMode">
                                    Добавить еще класс к этой группе
                                </v-btn>
                            </div>
                        </div>
                    </template>

                    <div class="btn-actions" v-if="mode != 'groupedClasses'">
                        <v-btn color="red" @click="closeModal">Отмена</v-btn>
                        <v-btn color="green" @click="submit">Сохранить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>

        <!--CLASS VIEW SCHEDULE MODAL-->
        <modal name="class-view-schedule-modal" width="450px">
            <div class="modal-container">
                <div class="lesson-day">{{objDay[sendScheduleObj.weekDay]}} - {{'Урок ' + selectedShiftTime.name}}</div>
                <h4>{{mode == 'create' ? 'Добавить предмет' : 'Редактировать' }}</h4>
                <div class="delete-schedule" v-if="mode == 'edit'">
                    <DeleteIcon @click="removeSchedule" />
                </div>
                <v-form ref="scheduleForm">
                    <v-autocomplete
                        :items="allTeachers"
                        :rules="required"
                        :item-text="getTeacherAndCourseName"
                        item-value="id"
                        label="Предмет"
                        v-model="sendScheduleObj.instrCourseId"
                        @change="onSelectScheduleCourse"
                    />
                    <div class="btn-actions">
                        <v-btn color="red" @click="closeClassViewModal">Отмена</v-btn>
                        <v-btn color="green" @click="submit" :disabled="!sendScheduleObj.instrCourseId">Сохранить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>

        <!--FIXED TABLE HEADER-->
        <FixedScheduleTableHeader
            ref="fixedTable"
            :days="days"
            :shiftTimes="shiftTimes"
            :fixedTableWidth="fixedTableWidth"
            :teacherLabelWidth="teacherLabelWidth"
            :courseLabelWidth="courseLabelWidth"
            :classViewSchedule="classViewSchedule"
            :showScrollArrows="showScrollArrows"
            @scrollTable="scrollTable"
            :class="{'show': showFixedHeader}"
        />
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
                    instrCourseId: ''
                },
                langObj: {
                    RU: 'courseTitle',
                    KG: 'courseTitleKG',
                    EN: 'courseCode',
                },
                objDay: {
                    MONDAY: 'Понедельник',
                    TUESDAY: 'Вторник',
                    WEDNESDAY: 'Среда',
                    THURSDAY: 'Четверг',
                    FRIDAY: 'Пятница',
                    SATURDAY: 'Суббота'
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
                showAddGroup: false,
                showContent: false,
                originGrouped: false,
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
                groupedSchedules: [],
                fixedTableWidth: 0,
                teacherLabelWidth: 0,
                courseLabelWidth: 0
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
            this.getAllSchoolInstructors();
            this.getAllSchoolShifts();
        },

        mounted() {
            window.addEventListener('scroll', this.verticalScrollListener);
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.verticalScrollListener);
            if (this.$refs.scheduleTable) {
                this.$refs.scheduleTable.removeEventListener('scroll', this.horizontalScheduleScrollListener);
            }
        },

        methods: {
            async onSelectShift(shiftId) {
                this.isLoading = true;
                this.currentShiftId = shiftId;
                this.showContent = false;
                await this.getAllSchoolClasses();
                await this.getShiftTimesByShiftId();
                await this.fetchScheduleData();
            },

            getTeacherAndCourseName(teacher) {
                return teacher[this.langObj[this.currentLang]] + ' - ' + teacher.instructorTitle;
            },

            getFullClassTitle(klass) {
                return klass.classLevel + klass.classLabel;
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
                })
            },

            fetchScheduleData() {
                ScheduleWeekService.getAllBySchoolAndShift(this.school.id, this.currentShiftId).then((res) => {
                    this.allSchedules = res;
                    this.showContent = true;
                    this.isLoading = false;
                    this.$nextTick(() => {
                        this.showScrollArrows = this.$refs.scheduleTable.scrollWidth > this.$refs.scheduleTable.clientWidth;
                        this.$refs.scheduleTable.addEventListener('scroll', this.horizontalScheduleScrollListener);
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
                        this.onSelectShift(res[0].id);
                    }
                }).catch(err => this.$toast.error(err));
            },

            getAllSchoolClasses() {
                SchoolClassService.getAllBySchool(this.school.id).then((res) => {
                    this.classes = res;
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
                const fixedTableHeader = this.$refs.fixedTable.$el.querySelector('.fixed-header');
                if (nav === 'right') {
                    scheduleTable.scrollLeft = scheduleTable.scrollWidth - scheduleTable.clientWidth;
                    fixedTableHeader.scrollLeft = scheduleTable.scrollWidth - scheduleTable.clientWidth;
                } else {
                    scheduleTable.scrollLeft = 0;
                    fixedTableHeader.scrollLeft = 0;
                }
                setTimeout(() => {
                    this.manualScroll = true;
                }, 450)
            },

            verticalScrollListener() {
                if (this.mainTable()) {
                    if (window.scrollY >= this.mainTable().offsetTop) {
                        this.showFixedHeader = true;
                        this.fixedTableWidth = this.mainTable().offsetWidth;
                        if (this.$refs.teacherTable) {
                            this.teacherLabelWidth = this.$refs.teacherLabel.offsetWidth;
                            this.courseLabelWidth = this.$refs.courseLabel.offsetWidth;
                        }
                    } else {
                        this.showFixedHeader = false;
                    }
                }
            },

            mainTable() {
                return this.classViewSchedule ? this.$refs.classTable : this.$refs.teacherTable;
            },

            horizontalScheduleScrollListener() {
                if (this.manualScroll) {
                    const fixedTableHeader = this.$refs.fixedTable.$el.querySelector('.fixed-header');
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
                } else {
                    if (schedules.length > 1) {
                        this.sendScheduleObj.groupTitle = schedules[0].groupTitle;
                        this.sendScheduleObj.grouped = schedules[0].grouped;
                        this.groupedSchedules = schedules;
                        this.mode = 'groupedClasses';
                    } else {
                        this.editScheduleMode(schedules[0], true);
                    }
                }
                this.$modal.show('schedule-modal');
            },

            editScheduleMode(schedule, showAddGroup) {
                this.sendScheduleObj.chronicleId = this.school.chronicleId;
                this.sendScheduleObj.weekDay = schedule.weekDay;
                this.sendScheduleObj.shiftTimeId = schedule.shiftTimeId;
                this.sendScheduleObj.instructorId = schedule.instructorId;
                this.sendScheduleObj.courseId = schedule.courseId;
                this.sendScheduleObj.classId = schedule.classId;
                this.sendScheduleObj.grouped = schedule.grouped;
                this.sendScheduleObj.groupTitle = schedule.groupTitle;
                this.sendScheduleObj.id = schedule.id;
                this.mode = 'edit';
                this.showAddGroup = showAddGroup;
                this.originGrouped = schedule.grouped;
            },

            addGroupScheduleMode() {
                this.mode = 'addGroupClass';
                this.sendScheduleObj.classId = '';
            },

            closeModal() {
                this.$modal.hide('schedule-modal');
            },

            submit() {
                if (this.$refs.scheduleForm.validate()) {
                    const createModes = ['create', 'addGroupClass'];
                    if (createModes.includes(this.mode)) {
                        this.submitCreateSchedule();
                    } else {
                        this.submitUpdateSchedule();
                    }
                }
            },

            submitCreateSchedule() {
                this.isLoading = true;
                ScheduleWeekService.create(this.sendScheduleObj).then((res) => {
                    let scheduleObj = JSON.parse(JSON.stringify(this.sendScheduleObj));
                    scheduleObj.classTitle = res.classTitle;
                    scheduleObj.courseCode = res.courseCode;
                    scheduleObj.id = res.id;
                    this.allSchedules.push(scheduleObj);
                    this.closeModal();
                    this.closeClassViewModal();
                    this.$toast.success('Успешно добавлено!');
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
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
                            }
                        }
                        return schedule;
                    });
                    this.closeModal();
                    this.closeClassViewModal();
                    this.$toast.success('Успешно обновлено!');
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            removeSchedule() {
                this.isLoading = true;
                ScheduleWeekService.deleteSchedule(this.sendScheduleObj.id).then(() => {
                    this.allSchedules.forEach((schedule, i, selfArr) => {
                        if (schedule.id === this.sendScheduleObj.id) {
                            selfArr.splice(i, 1);
                        }
                    });
                    this.closeModal();
                    this.closeClassViewModal();
                    this.$toast.success('Успешно удалено!');
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
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
                } else {
                    this.sendScheduleObj.grouped = schedule.grouped;
                    this.sendScheduleObj.groupTitle = schedule.groupTitle;
                    this.sendScheduleObj.id = schedule.id;
                    const instrCours = this.allTeachers.find((teacher) =>
                        teacher.instructorId === schedule.instructorId &&
                        teacher.courseId === schedule.courseId
                    );
                    this.sendScheduleObj.instrCourseId = instrCours ? instrCours.id : '';
                }
                this.$modal.show('class-view-schedule-modal');
            },

            closeClassViewModal() {
                this.$modal.hide('class-view-schedule-modal');
            },

            onSelectScheduleCourse(instrCourseId) {
                const instrCourseObj = this.allTeachers.find((instrCourse) => instrCourse.id === instrCourseId);
                this.sendScheduleObj.instructorId = instrCourseObj.instructorId;
                this.sendScheduleObj.courseId = instrCourseObj.courseId;
                this.sendScheduleObj.courseCode = instrCourseObj.courseCode;
            },

            exportPdf() {
                this.$refs.schedule.style.width = this.setDisplaySize();
                this.$refs.schedule.style.height = this.setDisplaySize();
                const clonedData = this.$refs.schedule.cloneNode(true);
                this.synchronizeCssStyles(this.$refs.schedule, clonedData, true);
                clonedData.querySelector('.schedule-teacher-course').style.overflow = 'visible';
                clonedData.querySelector('.export-title').style.display = 'block';
                clonedData.querySelector('.other-actions').remove();
                clonedData.style.margin = '0';
                let win = window.open('', '');
                win.document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';
                win.document.body.innerHTML = (clonedData.outerHTML);
                win.print();
                win.onafterprint = window.navigator.appVersion.includes('Mac') ? () => win.close() : win.close();
                this.$refs.schedule.style.width = 'auto';
                this.$refs.schedule.style.height = 'auto';
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
                if (cssObject.cssText !== ''){
                    return cssObject.cssText;
                }
                for (let prop in cssObject){
                    if (typeof cssObject[prop] === 'string'){
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
            &.fixed-table-header {
                margin: 0 27px;
                .scroll-arrows {
                    margin: 0;
                }
            }
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
                .left {
                    transform: rotate(180deg) translateY(7px);
                }
            }
        }

        .modal-container {
            .lesson-day {
                text-align: center;
                font-weight: bold;
            }
            .delete-schedule {
                transform: translateY(-20px);
                text-align: right;
            }
            .add-group-class {
                border: 1px solid;
                display: inline-block;
                color: #045ea5;
                padding: 1px 5px;
                border-radius: 5px;
                cursor: pointer;
                transform: translateY(-15px);
                background: #f8f8f8;
            }
            .groups {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 15px 0 20px;
                .group {
                    color: #fff;
                    font-size: 16px;
                    padding: 2px 5px;
                    border-radius: 5px;
                    margin-right: 15px;
                    background: #2196F3;
                    cursor: pointer;
                }
            }
            .group-info {
                text-align: center;
                font-size: 18px;
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
