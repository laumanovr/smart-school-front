<template>
    <div class="instructor-schedule-container">
        <PreLoader v-if="isLoading"/>
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
                                    {{ klass.classLevel + klass.classLabel + ' - ' + $t(`adminCourses.${klass.courseCode}`) }}
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
    import PreLoader from "@/components/preloader/PreLoader";

    export default {
        components: {
            ClassSelectHeader,
            PreLoader
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
                isLoading: false,
                teacherSchedules: [],
                shifts: [],
                shiftTimes: [],
            }
        },

        created() {
            this.fetchAllSchoolShifts();
        },

        methods: {
            fetchAllSchoolShifts() {
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    this.shifts = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchShiftTimes(shiftId) {
                this.isLoading = true;
                ShiftTimeService.getAllByShiftId(shiftId).then((res) => {
                    this.shiftTimes = res.sort((a, b) => a.name - b.name);
                    this.fetchInstructorSchedule();
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchInstructorSchedule() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    this.teacherSchedules = res;
                    this.showTable = true;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
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
