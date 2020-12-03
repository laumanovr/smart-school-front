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
                    v-model="selectedShiftId"
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
                        <td>
                            <div>{{ time.name }}.</div>
                            <div>{{ time.startTime.slice(0,5)+' - '+time.endTime.slice(0,5) }}</div>
                        </td>
                        <td v-for="day in days" :key="day.day">
                            <div class="lesson" v-if="getSpecificClassSchedule(day.day, time.id).length">
                                <div v-for="klass in getSpecificClassSchedule(day.day, time.id)">
                                    {{ klass.classLevel + klass.classLabel + ' - ' + klass[langObj[currentLang]] }}
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
            },
            currentLang() {
                return this.$root.$i18n.locale;
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
                langObj: {
                    RU: 'courseTitle',
                    KG: 'courseTitleKG',
                    EN: 'courseCode',
                },
                showTable: false,
                isLoading: false,
                teacherSchedules: [],
                shifts: [],
                shiftTimes: [],
                selectedShiftId: ''
            }
        },

        created() {
            this.isLoading = true;
            this.fetchAllSchoolShifts();
        },

        methods: {
            fetchAllSchoolShifts() {
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    if (res.length) {
                        this.shifts = res;
                        this.fetchInstructorSchedule();
                    } else {
                        this.isLoading = false;
                    }
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchInstructorSchedule() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    this.teacherSchedules = res;

                    const instrUniqueShiftIds = res.filter((obj, index, selfArr) =>
                        index === selfArr.findIndex((el) =>
                            (el['shiftId'] === obj['shiftId'])
                        )).map((shiftObj) => shiftObj.shiftId);

                    this.shifts.forEach((item, i, selfArr) => {
                        if (!instrUniqueShiftIds.includes(item.id)) {
                            selfArr.splice(i, 1);
                        }
                    });

                    this.selectedShiftId = this.shifts[0].id;
                    this.fetchShiftTimes(this.selectedShiftId);
                    console.log(this.shifts);
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchShiftTimes(shiftId) {
                this.isLoading = true;
                this.showTable = false;
                ShiftTimeService.getAllByShiftId(shiftId).then((res) => {
                    this.shiftTimes = res.sort((a, b) => a.name - b.name);
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
