<template>
    <div class="replace-instructor">
        <PreLoader v-if="isLoading"/>
        <div class="header-title"><h3>Замена учителя на один день</h3></div>

        <v-form ref="replaceForm" class="d-flex justify-center">
            <v-select
                outlined
                label="Старый учитель"
                class="v-select-item"
                :items="allInstructors"
                item-text="fullName"
                item-value="id"
                v-model="replaceObj.refPersonId"
                :rules="requiredField"
                @change="fetchCourseList"
            />
            <v-select
                outlined
                label="Предмет"
                class="v-select-item"
                :items="instrCourses"
                item-text="courseTitle"
                item-value="courseId"
                v-model="replaceObj.courseId"
                :rules="requiredField"
                @change="fetchInstrByCourse"
            />
            <v-select
                outlined
                label="Новый учитель"
                class="v-select-item"
                :items="filteredInstructors"
                item-text="fullName"
                item-value="id"
                v-model="replaceObj.personId"
                :rules="requiredField"
            />
            <v-select
                outlined
                label="Класс"
                class="v-select-item"
                :items="classes"
                item-text="classTitle"
                item-value="classId"
                v-model="replaceObj.classId"
                :rules="requiredField"
                @change="fetchReplaceDates"
            />
            <v-select
                outlined
                label="Заменить на дату"
                class="v-select-item"
                :items="replaceDates"
                item-text="day"
                return-object
                @change="onSelectDate"
            />
            <v-btn color="green replace-btn" @click="submitReplace">Заменить</v-btn>
        </v-form>

        <table class="table">
            <thead>
            <tr>
                <th>Старый учитель</th>
                <th>Предмет</th>
                <th>Новый учитель</th>
                <th>Класс</th>
                <th>Заменяемая дата</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in replacedScheduleList" :key="i">
                <td>{{item.refPersonTitle}}</td>
                <td>{{item.courseTitle}}</td>
                <td>{{item.personTitle}}</td>
                <td>{{item.classTitle}}</td>
                <td>{{item.replacementDate}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import InstructorService from '@/_services/instructor.service';
import {InstructorCourseService} from '@/_services/instructor-course.service'
const instructorCourseService = new InstructorCourseService();
import ScheduleWeekService from '@/_services/schedule-week.service';
import PreLoader from '@/components/preloader/PreLoader';
import StudentCourseService from '@/_services/student-course.service';
import moment from 'moment';

export default {
    components: {
        PreLoader
    },
    data() {
        return {
            isLoading: false,
            requiredField: [v => !!v || 'Обязательное поле'],
            allInstructors: [],
            instrCourses: [],
            filteredInstructors: [],
            classes: [],
            replaceDates: [],
            replacedScheduleList: [],
            replaceObj: {
                allDay: true,
                chronicleId: 0,
                classId: 0,
                courseId: 0,
                personId: 0,
                refPersonId: 0,
                replacementDate: '',
                shiftTimeId: 0,
                replacementHour: 0,
                reason: ''
            }
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
    created() {
        this.replaceObj.chronicleId = this.school.chronicleId;
        this.fetchAllReplacedSchedules();
        this.fetchAllInstructors();
    },
    methods: {
        fetchAllReplacedSchedules() {
          ScheduleWeekService.getAllReplacedSchedule(this.school.id, this.school.chronicleId).then((res) => {
              if (res._embedded) {
                  this.replacedScheduleList = res._embedded.instructorScheduleReplacementResourceList;
              }
          }).catch((err) => {
              this.$toast.error(err)
          })
        },

        fetchAllInstructors() {
            InstructorService.list(0, this.school.id).then((res) => {
                if (res._embedded) {
                    this.allInstructors = res._embedded.instructorResourceList.map((i) => {
                        i.fullName = i.firstName + ' ' + i.lastName;
                        return i;
                    });
                }
            }).catch((err) => {
                this.$toast.error(err)
            });
        },

        fetchCourseList() {
            this.replaceDates = [];
            instructorCourseService.listByInstructor(this.replaceObj.refPersonId).then((res) => {
                this.instrCourses = res._embedded ? res._embedded.instructorCourseResourceList : [];
            }).catch((err) => {
                this.$toast.error(err)
            })
        },

        fetchInstrByCourse(courseId) {
            const course = this.instrCourses.find((item) => item.courseId === courseId);
            InstructorService.list(0, this.school.id, course.courseName).then((res) => {
                if (res._embedded) {
                    this.filteredInstructors = res._embedded.instructorResourceList.map((i) => {
                        i.fullName = i.firstName + ' ' + i.lastName;
                        return i;
                    });
                }
                this.fetchRefInstrClasses();
            }).catch((err) => {
                this.$toast.error(err)
            })
        },

        fetchRefInstrClasses() {
            ScheduleWeekService.getByInstructor(this.replaceObj.refPersonId).then((res) => {
                this.classes = res.map((klass) => {
                    klass.classTitle = klass.classLevel + klass.classLabel;
                    return klass;
                }).filter((item) => item.courseId === this.replaceObj.courseId);
            }).catch((err) => {
                this.$toast.error(err)
            })
        },

        fetchReplaceDates() {
            const request = {
                chronicleId: this.school.chronicleId,
                classId: this.replaceObj.classId,
                courseId: this.replaceObj.courseId,
                instructorId: this.replaceObj.refPersonId
            };
            ScheduleWeekService.getCurrentMonth(new Date().getMonth() + 1, request).then((res) => {
                this.replaceDates = res.map((item) => {
                    item.day = moment(item.day, 'YYYY-MM-DD').format('DD.MM.YYYY');
                    return item;
                });
            }).catch((err) => {
                this.isLoading = false;
                this.$toast.error(err);
            })
        },

        onSelectDate(dateObj) {
            this.replaceObj.replacementDate = dateObj.day;
            this.replaceObj.shiftTimeId = dateObj.shiftTimeId;
        },

        async addInstrCourseToClass() {
            const addCourseObj = {
                chronicleId: this.school.chronicleId,
                classId: this.replaceObj.classId,
                courseId: this.replaceObj.courseId,
                instructorId: this.replaceObj.personId
            };
            try {
                await StudentCourseService.addCourseToClass(addCourseObj);
            } catch (err) {
                this.$toast.error(err);
            }
        },

        submitReplace() {
            if (this.$refs.replaceForm.validate()) {
                this.isLoading = true;
                this.addInstrCourseToClass();
                ScheduleWeekService.replaceForOneDay(this.replaceObj).then(() => {
                    this.fetchAllReplacedSchedules();
                    this.isLoading = false;
                    this.$refs.replaceForm.reset();
                    this.$toast.success('Успешно заменено!');
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast.error(err);
                })
            }
        }
    }
}
</script>

<style lang="scss">
    .replace-instructor {
        margin: 15px 20px 30px;
        .v-select-item {
            margin-right: 10px;
        }
        .input-mask {
            margin: 0;
            input {
                height: 50px;
                border: 1px solid #9E9E9E;
                border-radius: 5px;
            }
        }
        .replace-btn {
            height: 50px !important;
            margin-left: 10px;
            .v-btn__content {
                color: #fff !important;
            }
        }
    }
</style>
