<template>
    <div class="modal-container">
        <PreLoader v-if="isLoading"/>
        <div class="lesson-day">{{objDay[sendScheduleObj.weekDay]}} - {{'Урок ' + selectedShiftTime.name}}</div>
        <v-form ref="scheduleForm" v-if="!classViewSchedule">
            <template v-if="dataObj.mode == 'create' || dataObj.mode == 'edit'">
                <h4>{{dataObj.mode == 'create' ? 'Добавить расписание' : 'Редактировать расписание' }}</h4>
                <div class="delete-schedule" v-if="dataObj.mode == 'edit'">
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
                    ></v-select>

                    <div class="with-group">
                        <label for="group" class="is-group">
                            <span>Группа</span>
                            <input id="group" type="checkbox" v-model="sendScheduleObj.grouped">
                        </label>
                        <template v-if="sendScheduleObj.grouped">
                            <v-text-field :rules="required" label="Название" v-model="sendScheduleObj.groupTitle"/>
                        </template>
                        <div
                            class="add-group-class"
                            v-if="sendScheduleObj.grouped && dataObj.originGrouped && dataObj.mode == 'edit' && dataObj.showAddGroup"
                            @click="addGroupScheduleMode"
                        >
                            Добавить класс к группе
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="dataObj.mode == 'addGroupClass'">
                <h4>Добавить класс к группе: {{sendScheduleObj.groupTitle}}</h4>
                <div class="content">
                    <v-select
                        :items="classes"
                        :rules="required"
                        item-text="classTitle"
                        item-value="id"
                        label="Выбрать класс"
                        v-model="sendScheduleObj.classId"
                    ></v-select>
                </div>
            </template>

            <template v-if="dataObj.mode == 'groupedClasses'">
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
                        <v-btn class="close" color="red" @click="$emit('close')">Отмена</v-btn>
                    </div>
                </div>
            </template>

            <div class="btn-actions" v-if="dataObj.mode != 'groupedClasses'">
                <v-btn color="red" @click="$emit('close')">Отмена</v-btn>
                <v-btn color="green" @click="onSave">Сохранить</v-btn>
            </div>
        </v-form>

        <!--CLASS VIEW-->
        <v-form ref="scheduleForm" v-if="classViewSchedule">
            <h4>{{mode == 'create' ? 'Добавить предмет' : 'Редактировать' }}</h4>
            <div class="delete-schedule" v-if="mode == 'edit'">
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

    export default {
        props: {
            mode: String,
            objDay: Object,
            sendScheduleObj: Object,
            selectedShiftTime: Object,
            classes: Array,
            groupedSchedules: Array,
            originGrouped: Boolean,
            showAddGroup: Boolean,
            classViewSchedule: Boolean,
            allTeachers: Array
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
                    originGrouped: this.originGrouped,
                    showAddGroup: this.showAddGroup
                }
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
        methods: {
            addGroupScheduleMode() {
                this.dataObj.mode = 'addGroupClass';
                this.sendScheduleObj.classId = '';
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
                this.dataObj.mode = 'edit';
                this.dataObj.showAddGroup = showAddGroup;
                this.dataObj.originGrouped = schedule.grouped;
            },

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
        }
    }
</script>

<style lang="scss">
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
    }
</style>
