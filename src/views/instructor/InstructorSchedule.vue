<template>
    <div class="instructor-schedule-container">
        <ClassSelectHeader :headTitle="'Мои Расписания'" :showClass="false" />

        <div class="schedule-content">
            <div class="select-shift">
                <v-select
                    :items="shifts"
                    item-text="name"
                    item-value="id"
                    label="Выбрать смену"
                    @change="fetchShiftTimes"
                ></v-select>
            </div>

            <table class="table bordered" v-if="showTable">
                <thead>
                    <tr>
                        <th>Урок</th>
                        <th v-for="day in days" :key="day.day">{{ day.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="time in shiftTimes" :key="time.id">
                        <td>{{ time.name }}</td>
                        <td v-for="day in days" :key="day.day">
                            <div class="lesson" v-if="getSpecificClassSchedule(day.day, time.id).length">
                                <div v-for="klass in getSpecificClassSchedule(day.day, time.id)">
                                    {{ klass.classLevel + klass.classLabel + ' - ' + showCourseName(klass.courseCode) }}
                                </div>
                            </div>
                            <div class="lesson" v-else></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import ShiftService from '@/_services/shift.service';
    import ShiftTimeService from '@/_services/shift-time.service';
    import {AdminCourseService} from '@/_services/admin-course.service';
    const adminCourseService = new AdminCourseService();

    export default {
        components: {
            ClassSelectHeader
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            }
        },

        data() {
            return {
                days: [
                    {day: 1, name: 'Понедельник'},
                    {day: 2, name: 'Вторник'},
                    {day: 3, name: 'Среда'},
                    {day: 4, name: 'Четверг'},
                    {day: 5, name: 'Пятница'},
                    {day: 6, name: 'Суббота'},
                ],
                showTable: false,
                teacherSchedules: [],
                shifts: [],
                shiftTimes: [],
                allAdminCourses: []
            }
        },

        created() {
            this.fetchAllSchoolShifts();
            this.fetchAllAdminCourses();
        },

        methods: {
            fetchAllAdminCourses() {
                adminCourseService.list().then((res) => {
                    this.allAdminCourses = res;
                })
            },

            showCourseName(code) {
                const course = this.allAdminCourses.find(course => course.code === code);
                return course ? course.title : '';
            },

            fetchAllSchoolShifts() {
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    this.shifts = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchShiftTimes(shiftId) {
                ShiftTimeService.getAllByShiftId(shiftId).then((res) => {
                    this.shiftTimes = res.sort((a, b) => a.name - b.name);
                    this.fetchInstructorSchedule();
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchInstructorSchedule() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    this.teacherSchedules = res;
                    console.log(res);
                    this.showTable = true;
                })
            },

            getSpecificClassSchedule(day, timeId) {
                return this.teacherSchedules.filter(schedule => schedule.weekDay === day && schedule.shiftTimeId === timeId)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-schedule-container {
        margin: 30px;
        .schedule-content {
            margin-top: 25px;
            .select-shift {
                width: 270px;
                margin: 0 auto 25px;
            }
        }
    }
</style>
