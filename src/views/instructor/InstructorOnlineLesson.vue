<template>
    <div class="instructor-video-meeting">
        <div class="header-title">
            <h3>Онлайн урок</h3>
        </div>

        <v-form class="lesson-form" ref="lessonForm">
            <v-select
                :items="classes"
                item-text="classTitle"
                item-value="classId"
                label="Класс"
                :rules="required"
                v-model="lesson.classId"
                @change="filterCoursesByClass"
            />
            <v-select
                :items="filteredCourses"
                item-text="courseTitle"
                item-value="courseId"
                label="Предмет"
                :rules="required"
                v-model="lesson.courseId"
            />
            <v-btn color="primary" @click="openVideoLesson" :disabled="isDisabled">Запустить</v-btn>
        </v-form>

        <div class="video-container">
            <OnlineVideoMeeting
                :meetRoomName="jitsiRoomName"
                @endOfVideoCall="videoCallEnd"
                ref="videoMeeting"
            />
        </div>
    </div>
</template>

<script>
    import OnlineVideoMeeting from '@/components/online-meeting/OnlineVideoMeeting';
    import ScheduleWeekService from '@/_services/schedule-week.service';

    export default {
        components: {
            OnlineVideoMeeting
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            currentLang() {
                return this.$root.$i18n.locale;
            }
        },

        data() {
            return {
                langObj: {
                    RU: 'courseTitle',
                    KG: 'courseTitleKG',
                    EN: 'courseCode',
                },
                required: [v => !!v || 'Обязательное поле'],
                jitsiRoomName: '',
                lesson: {
                    classId: '',
                    courseId: ''
                },
                classes: [],
                filteredCourses: [],
                allData: [],
                isDisabled: false
            }
        },

        created() {
            this.fetchInstructorClassCourses();
        },

        methods: {
            fetchInstructorClassCourses() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    if (res.length) {
                        this.allData = res.map((item) => {
                            item.classTitle = `${item.classLevel} ${item.classLabel}`;
                            item.courseTitle = item[this.langObj[this.currentLang]];
                            return item;
                        });
                        this.classes = this.allData.filter((obj, index, selfArr) =>
                            index === selfArr.findIndex((el) =>
                                (el['classId'] === obj['classId'])
                            ));
                    }
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            filterCoursesByClass(selectedClassId) {
                this.filteredCourses = this.allData.filter((course) =>
                    course.classId === selectedClassId
                ).filter((obj, index, selfArr) =>
                    index === selfArr.findIndex((el) =>
                        (el['courseId'] === obj['courseId'])
                ));
            },

            openVideoLesson() {
                if (this.$refs.lessonForm.validate()) {
                    this.jitsiRoomName = `${this.userProfile.personId}-${this.lesson.classId}-${this.lesson.courseId}-ds`;
                    this.$refs.videoMeeting.launchJitsi();
                    this.isDisabled = true;
                }
            },

            videoCallEnd() {
                this.isDisabled = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-video-meeting {
        margin: 30px 30px 70px;
        .lesson-form {
            display: flex;
            align-items: center;
            max-width: 600px;
            margin-bottom: 20px;
            .v-select {
                margin-right: 20px;
            }
        }
    }
</style>
