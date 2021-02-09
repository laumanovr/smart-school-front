<template>
    <div class="modal-container">
        <PreLoader v-if="isLoading"/>
        <div class="lesson-day">{{objDay[sendScheduleObj.weekDay]}} - {{'Урок ' + selectedShiftTime.name}}</div>
        <v-form ref="scheduleForm" v-if="!classViewSchedule">
            <template v-if="!isArchiveMode">
                <div class="form-data">
                    <div class="main">
                        <div class="teacher-title">{{ teacherTitleCourse }}</div>
                        <template v-if="dataObj.mode == 'create' || dataObj.mode == 'edit'">
                            <h4>{{dataObj.mode == 'create' ? 'Добавить расписание' : 'Редактировать расписание' }}</h4>
                            <div class="delete-schedule" v-if="dataObj.mode == 'edit'">
                                <span class="archive" @click="isArchiveMode=true">Отправить в архив</span>
                                <DeleteIcon @click="removeSchedule"/>
                            </div>
                            <div class="content">
                                <v-select
                                    :items="classes"
                                    :rules="required"
                                    item-text="classTitle"
                                    item-value="id"
                                    label="Выбрать класс"
                                    v-model="sendScheduleObj.classId"
                                    @change="changeClass"
                                />
                                <div class="checkboxes" v-if="sendScheduleObj.classId">
                                    <label for="group" class="is-group">
                                        <span>Группа</span>
                                        <input
                                            id="group"
                                            type="checkbox"
                                            v-model="sendScheduleObj.grouped"
                                            @change="getSelectedClassStudents"
                                        >
                                    </label>
                                    <div class="replace-btn">
                                        <label for="replace-s">
                                            <input id="replace-s" type="checkbox" v-model="sendScheduleObj.replace">
                                            Замена учителя
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="select-student" v-if="sendScheduleObj.grouped">
                        <v-text-field :rules="required" label="Название группы" v-model="sendScheduleObj.groupTitle"/>
                        <div class="student" v-for="student in students" :key="student.id">
                            <label :for="student.id">
                                <input
                                    :id="student.id"
                                    type="checkbox"
                                    v-model="student.checked"
                                    @change="deleteStudentCourse($event, student)"
                                >
                                <span>{{ student.fullName }}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="btn-actions">
                    <v-btn color="red" @click="$emit('close')">Отмена</v-btn>
                    <v-btn color="green" @click="onSave">Сохранить</v-btn>
                </div>
            </template>
            <div class="confirm-archive" v-if="isArchiveMode">
                <h4>Архивировать все расписания по данному классу, предмету и учителю?</h4>
                <div class="btn-actions">
                    <v-btn color="red" @click="isArchiveMode=false">Отмена</v-btn>
                    <v-btn color="green" @click="archiveSchedule">Да</v-btn>
                </div>
            </div>
        </v-form>

        <!--CLASS VIEW-->
        <v-form ref="scheduleForm" v-if="classViewSchedule">
            <h4>{{mode == 'create' ? 'Добавить предмет' : 'Редактировать' }}</h4>
            <div class="delete-schedule" v-if="mode == 'edit'">
                <span></span>
                <DeleteIcon @click="removeSchedule"/>
            </div>
            <v-autocomplete
                :items="allTeachers"
                :rules="required"
                :item-text="getTeacherAndCourseName"
                item-value="id"
                label="Предмет"
                v-model="sendScheduleObj.instrCourseId"
                @change="onSelectScheduleCourse"
            />
            <div class="replace-btn">
                <label for="replace">
                    <input id="replace" type="checkbox" v-model="sendScheduleObj.replace">
                    Замена учителя
                </label>
            </div>
            <div class="btn-actions">
                <v-btn color="red" @click="$emit('close')">Отмена</v-btn>
                <v-btn color="green" @click="onSave" :disabled="!sendScheduleObj.instrCourseId">Сохранить</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script>
    import DeleteIcon from '@/components/icons/DeleteIcon';
    import PreLoader from '@/components/preloader/PreLoader';
    import StudentCourseService from '@/_services/student-course.service';
    import {StudentService} from '@/_services/student.service';
    const studentService = new StudentService();
    import ScheduleWeekService from '@/_services/schedule-week.service';

    export default {
        props: {
            mode: String,
            objDay: Object,
            sendScheduleObj: Object,
            selectedShiftTime: Object,
            classes: Array,
            classViewSchedule: Boolean,
            allTeachers: Array,
            teacherTitleCourse: String
        },
        components: {
            DeleteIcon,
            PreLoader
        },
        data() {
            return {
                langObj: {
                    ru: 'courseTitle',
                    kg: 'courseTitleKG',
                    en: 'courseCode',
                },
                required: [v => !!v || 'Обязательное поле'],
                isLoading: false,
                dataObj: {
                    mode: this.mode,
                },
                students: [],
                studentCourseBatchArr: [],
                studentCourseRequest: {
                    chronicleId: 0,
                    classId: 0,
                    courseId: 0,
                    instructorId: 0
                },
                isArchiveMode: false
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
        async created() {
            if (!this.classViewSchedule && this.mode === 'edit' && this.sendScheduleObj.grouped) {
                this.getSavedStudentCourses();
            }
        },
        methods: {
            getTeacherAndCourseName(teacher) {
                return teacher[this.langObj[this.currentLang]] + ' - ' + teacher.instructorTitle;
            },

            onSelectScheduleCourse(instrCourseId) {
                const instrCourseObj = this.allTeachers.find((instrCourse) => instrCourse.id === instrCourseId);
                this.sendScheduleObj.instructorId = instrCourseObj.instructorId;
                this.sendScheduleObj.courseId = instrCourseObj.courseId;
                this.sendScheduleObj.courseCode = instrCourseObj.courseCode;
                this.sendScheduleObj.courseTitle = instrCourseObj.courseTitle;
                this.sendScheduleObj.courseTitleKG = instrCourseObj.courseTitleKG;
            },

            onSave() {
                if (this.$refs.scheduleForm.validate()) {
                    this.isLoading = true;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$emit('close', {type: 'save', mode: this.dataObj.mode});
                            this.submitSaveStudentCourse();
                        }, 10)
                    });
                }
            },

            removeSchedule() {
                this.isLoading = true;
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$emit('close', {type: 'delete', scheduleId: this.sendScheduleObj.id});
                    }, 10);
                });
            },

            //
            changeClass() {
                this.sendScheduleObj.groupTitle = '';
                this.sendScheduleObj.grouped = false;
                this.students = [];
            },

            getSelectedClassStudents(e) {
                if (e.currentTarget.checked) {
                    this.getSavedStudentCourses();
                }
            },

            fetchClassStudents() {
                this.isLoading = true;
                studentService.getByClass(this.sendScheduleObj.classId).then((res) => {
                    this.students = res.map((student) => {
                        student.fullName = student.surname + ' ' + student.name;
                        return student;
                    });
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            async getSavedStudentCourses() {
                await this.fetchClassStudents();
                this.isLoading = true;
                this.studentCourseRequest.classId = this.sendScheduleObj.classId;
                this.studentCourseRequest.instructorId = this.sendScheduleObj.instructorId;
                this.studentCourseRequest.courseId = this.sendScheduleObj.courseId;
                this.studentCourseRequest.chronicleId = this.school.chronicleId;
                setTimeout(() => {
                    StudentCourseService.getListInterfaceByClass(this.studentCourseRequest).then((res) => {
                        res.forEach((studentCourse) => {
                            this.students = this.students.map((student) => {
                                if (studentCourse.studentId === student.id) {
                                    student.checked = true;
                                    student.originChecked = true;
                                    student.studentCourseId = studentCourse.id;
                                }
                                return student;
                            });
                        });
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                });
            },

            async submitSaveStudentCourse() {
                this.studentCourseBatchArr = [];
                if (this.sendScheduleObj.grouped) {
                    this.students.filter((i) => i.checked).forEach((student) => {
                        const studentCourse = {
                            archived: false,
                            chronicleId: this.school.chronicleId,
                            classId: student.classId,
                            courseId: this.sendScheduleObj.courseId,
                            instructorId: this.sendScheduleObj.instructorId,
                            studentId: student.id
                        };
                        this.studentCourseBatchArr.push(studentCourse);
                    });
                    if (this.studentCourseBatchArr.length) {
                        try {
                            await StudentCourseService.createBatch(this.studentCourseBatchArr);
                        }
                        catch (err) {
                            this.$toast.error(err);
                        }
                    }
                }
            },

            deleteStudentCourse(e, student) {
                if (!e.currentTarget.checked && student.originChecked) {
                    StudentCourseService.removeStudCourse(student.studentCourseId).then(() => {
                        student.originChecked = false;
                    });
                }
            },

            archiveSchedule() {
                this.isLoading = true;
                const archiveObj = {
                    classId: this.sendScheduleObj.classId,
                    courseId: this.sendScheduleObj.courseId,
                    instructorId: this.sendScheduleObj.instructorId,
                    replaceDate: new Date().toLocaleDateString('ru')
                };
                ScheduleWeekService.archiveSchedules(archiveObj).then(() => {
                    this.$emit('close', {archiveData: archiveObj});
                    this.$toast.success('Успешно отправлены в архив!');
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            }

        }
    }
</script>

<style lang="scss">
    .modal-container {
        max-height: 550px;
        overflow-y: auto;
        .form-data {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            .main {
                min-width: 400px;
            }
            .select-student {
                min-width: 350px;
                max-height: 300px;
                overflow-y: auto;
                margin-left: 15px;
                padding-left: 15px;
                border-left: 1px solid #b7b7b7;
                .student {
                    border-bottom: 1px solid #c3c3c3;
                    padding: 5px 0;
                    label {
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                    }
                    span {
                        margin-left: 8px;
                        font-size: 17px;
                        width: 90%;
                        display: inline-block;
                        white-space: nowrap;
                        overflow-x: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
            .checkboxes {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
        .lesson-day {
            text-align: center;
            font-weight: bold;
        }
        .teacher-title {
            text-align: center;
            font-weight: bold;
            margin: 10px 0;
        }
        .delete-schedule {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0;
            .archive {
                background: #ff0000;
                color: #fff;
                padding: 3px 5px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
            }
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
                text-align: center;
            }
        }
        .group-info {
            text-align: center;
            font-size: 18px;
        }
        .is-group {
            display: flex;
            align-items: center;
            cursor: pointer;
            span {
                margin-right: 5px;
                color: #7b7b7b;
            }
        }
        .btn-actions {
            flex-wrap: wrap;
            button {
                &.green {
                    background: #07980d !important;
                }
                &.red {
                    background: #da1507 !important;
                }
                &.primary {
                    background: #1976d2 !important;
                }
            }
            .close {
                margin-top: 10px;
            }
        }
        .v-select__selections {
            height: 40px;
            overflow: hidden;
        }
        .replace-btn {
            text-align: right;
            label {
                border: 1px solid #024377;
                padding: 3px 5px;
                border-radius: 4px;
                color: #024377;
                cursor: pointer;
                font-size: 14px;
                input {
                    margin-right: 4px;
                    transform: translateY(1px);
                }
            }
        }
    }
</style>
