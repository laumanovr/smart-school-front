<template>
	<div class="instructor-dashboard">
        <PreLoader v-if="isLoading"/>
		<div class="instructor-dashboard__schedule">
            <div class="today-block">
                <h3>Уроки на сегодня</h3>
                <div class="date">
                    <span>{{ objDay[getTodayName()] }}</span><span>{{ todayDate }}</span>
                </div>
            </div>
            <div class="class-schedules">
                <div class="schedule" v-for="schedule in instructorSchedules" :key="schedule.id">
                    <div class="time">
                        <div class="lesson-num">{{schedule.shiftTimeName}}</div>
                        <div class="times">
                            <div class="start-time">{{ schedule.startTime.slice(0, 5) }}</div>
                            <div class="end-time">{{ schedule.endTime.slice(0, 5) }}</div>
                        </div>
                    </div>
                    <div class="class-course">
                        <div class="course-name">{{ schedule[langObj[currentLang]] }}</div>
                        <div class="class-name">{{ schedule.classLevel+' '+schedule.classLabel }}</div>
                    </div>
                </div>
            </div>
		</div>

		<div class="instructor-dashboard__analytics">
			<div class="select-class">
                <h4>Аналитика</h4>
                <div class="filter">
                    <v-select
                        label="Четверть"
                        :items="quarters"
                        item-text="semester"
                        item-value="id"
                        v-model="selectedQuarterId"
                    />
                    <v-select
                        class="klass"
                        label="Мой класс"
                        :items="instrClasses"
                        item-text="classTitle"
                        item-value="classId"
                        v-model="selectedClassId"
                    />
                    <v-btn color="primary" @click="fetchClassPerformance">Показать</v-btn>
                </div>
			</div>
			<div class="class-performance">
                <table class="table bordered">
                    <thead>
                    <tr>
                        <th>Предмет</th>
                        <th class="avg-grade">Оценка</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in classPerformances" :key="i">
                        <td>{{ item.courseTitle }}</td>
                        <td class="avg-grade">{{ item.averageGrade.toFixed(1) }}</td>
                    </tr>
                    </tbody>
                </table>
			</div>
		</div>
	</div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import PreLoader from '@/components/preloader/PreLoader';
    import moment from 'moment';

export default {
	name: "InstructorDashboard",
    components: {
        PreLoader
    },
    data() {
	    return {
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
            isLoading: false,
            todayDate: '',
            selectedQuarterId: '',
            selectedClassId: '',
            instructorSchedules: [],
            quarters: [],
            instrClasses: [],
            classPerformances: []
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
        this.todayDate = moment().format('DD.MM.YYYY');
        this.fetchTodayInstructorSchedule();
        this.fetchSchoolQuarters();
        this.fetchInstrClasses();
    },
    methods: {
	    fetchTodayInstructorSchedule() {
	        ScheduleWeekService.getByInstructor(this.userProfile.personId, this.getTodayName()).then((res) => {
                this.instructorSchedules = res.sort((a, b) => a.shiftTimeName - b.shiftTimeName);
                this.isLoading = false;
            }).catch((err) => {
	            this.$toast.error(err);
                this.isLoading = false;
            });
        },

        fetchSchoolQuarters() {
            quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                this.quarters = res.sort((a, b) => a.semester - b.semester);
            });
        },

        fetchInstrClasses() {
            instructorClassService.getByInstructorId(this.userProfile.personId).then((res) => {
                if (res._embedded) {
                    this.instrClasses = res._embedded.instructorClassResourceList.map((klass) => {
                        klass.classTitle = klass.classLevel + klass.classLabel;
                        return klass;
                    });
                }
            });
        },

        getTodayName() {
            const date = new Date();
            return date.toLocaleDateString("EN-EN", { weekday: 'long' }).toUpperCase();
        },

	    fetchClassPerformance() {
	        if (!this.selectedClassId || !this.selectedQuarterId) {
	            this.$toast.info('Выберите четверть и класс!');
	            return;
            }
            this.isLoading = true;
	        AnalyticsService.getClassPerformance(this.selectedClassId, this.selectedQuarterId).then((res) => {
                this.classPerformances = res;
                this.isLoading = false;
            }).catch((err) => {
	            this.$toast.error(err);
	            this.isLoading = false;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
	.instructor-dashboard {
		display: flex;
        justify-content: space-between;
        margin: 30px 30px 65px;
        &__schedule {
            width: calc(50% - 15px);
            background: #fff;
            padding: 20px 0;
            border-radius: 8px;
            .today-block {
                display: flex;
                justify-content: space-between;
                padding: 10px 10px 20px;
                span:first-child {
                    margin-right: 10px;
                }
                .date {
                    font-weight: bold;
                }
            }
            .class-schedules {
                .schedule {
                    display: flex;
                    align-items: center;
                    margin: 15px 20px;
                    padding: 10px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 15px 0 rgba(50, 50, 50, 0.57);
                    .time {
                        display: flex;
                        width: calc(18% - 20px);
                        margin: 0 10px;
                        .lesson-num {
                            background: #ff367a;
                            width: 25%;
                            text-align: center;
                            padding-top: 15px;
                            border-radius: 4px 0 0 4px;
                            color: #fff;
                            border-right: 1px solid;
                        }
                        .times {
                            background: #ff367a;
                            color: #fff;
                            font-weight: bold;
                            text-align: center;
                            border-radius: 0 4px 4px 0;
                            width: 75%;
                            padding: 5px 0;
                        }
                    }
                    .class-course {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: calc(82% - 20px);
                        margin: 0 10px;
                        .class-name {
                            background: #2196F3;
                            color: #fff;
                            font-weight: bold;
                            padding: 5px;
                            border-radius: 4px;
                        }
                    }
                }
            }
        }
		&__analytics {
            width: calc(50% - 15px);
            background: #fff;
            border-radius: 8px;
            padding: 10px 15px;
            .select-class {
                .filter {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .v-select {
                        max-width: 120px;
                        &.klass {
                            margin: 0 15px;
                        }
                    }
                    button {
                        height: 30px;
                    }
                }
            }
            .class-performance {
                table {
                    td, th {
                        height: 40px;
                        padding: 0;
                        &.avg-grade {
                            width: 65px;
                            max-width: 65px;
                        }
                    }
                }
            }
		}
	}
</style>
