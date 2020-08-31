<template>
    <div class="instructor-class-container">
        <PreLoader v-if="isLoading"/>
        <ClassSelectHeader :headTitle="'Мои Классы'" :showClass="false" />

        <div class="class-content" v-if="showData">
            <table class="table">
                <thead>
                    <tr>
                        <th class="light-purple">Класс</th>
                        <th>Классный Руководитель</th>
                        <th class="light-purple">Предмет</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="klass in instrClasses" :key="klass.id">
                        <td class="light-purple">{{ klass.classLevel + '-' + klass.classLabel }}</td>
                        <td>{{ getInstructorName(klass.classId) }}</td>
                        <td class="light-purple">{{ getCourseName(klass.courseCode) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import ScheduleWeekService from '@/_services/schedule-week.service';
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {AdminCourseService} from '@/_services/admin-course.service';
    const adminCourseService = new AdminCourseService();
    import PreLoader from "@/components/preloader/PreLoader";

    export default {
        components: {
            ClassSelectHeader,
            PreLoader
        },
        data() {
            return {
                isLoading: false,
                showData: false,
                instrClasses: [],
                allSchoolClasses: [],
                allAdminCourses: []
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            }
        },

        async created() {
            this.isLoading = true;
            await this.fetchAllSchoolClasses();
            await this.fetchAllAdminCourses();
            await this.fetchInstructorClasses();
        },

        methods: {
            fetchInstructorClasses() {
                ScheduleWeekService.getByInstructor(this.userProfile.personId).then((res) => {
                    this.instrClasses = res.filter((obj, index, selfArr) =>
                        index === selfArr.findIndex((el) =>
                            (el['classId'] === obj['classId'])
                        ));
                    this.showData = true;
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchAllSchoolClasses() {
                instructorClassService.getAllClasses(this.userProfile.schools[0].id).then((res) => {
                    this.allSchoolClasses = res;
                })
            },

            getInstructorName(klassId) {
                const teacher = this.allSchoolClasses.find(klass => klass.classId === klassId);
                return teacher ? teacher.personTitle : '';
            },

            fetchAllAdminCourses() {
                adminCourseService.list().then((res) => {
                    this.allAdminCourses = res;
                })
            },

            getCourseName(code) {
                const course = this.allAdminCourses.find(course => course.code === code);
                return course ? course.title : '';
            },
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-class-container {
        margin: 30px;
        .class-content {
            background: #fff;
            margin-top: 22px;
        }
    }
</style>
