<template>
    <div class="replace-instructor">
        <div class="header-title"><h3>Замена учителей</h3></div>

        <div class="d-flex justify-center">
            <v-select
                outlined
                label="Предмет"
                class="v-select-item"
                :items="courses"
                item-text="courseTitle"
                item-value="courseTitle"
                v-model="replaceObj.courseTitle"
            />
            <v-select
                outlined
                label="Старый учитель"
                class="v-select-item"
                :items="instructors"
                item-text="fullName"
                item-value="fullName"
                v-model="replaceObj.teacherOne"
            />
            <v-select
                outlined
                label="Новый учитель"
                class="v-select-item"
                :items="instructors"
                item-text="fullName"
                item-value="fullName"
                v-model="replaceObj.teacherTwo"
            />
            <div class="input-mask date">
                <masked-input v-model="replaceObj.replaceDate" mask="11.11.1111" placeholder="Дата замены" />
            </div>
            <v-btn color="green replace-btn" @click="submitReplace">Заменить</v-btn>
        </div>

        <table class="table">
            <thead>
            <tr>
                <th>Предмет</th>
                <th>Старый учитель</th>
                <th>Новый учитель</th>
                <th>Дата замены</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in replacedData" :key="i">
                <td>{{item.courseTitle}}</td>
                <td>{{item.teacherOne}}</td>
                <td>{{item.teacherTwo}}</td>
                <td>{{item.replaceDate}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import InstructorService from "@/_services/instructor.service";
    import {CourseService} from '@/_services/course.service';
    const courseService = new CourseService();
    import MaskedInput from 'vue-masked-input';

    export default {
        components: {
            MaskedInput
        },
        data() {
          return {
              instructors: [],
              replacedData: [],
              courses: [],
              replaceObj: {
                  courseTitle: '',
                  teacherOne: '',
                  teacherTwo: '',
                  replaceDate: ''
              }
          }
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        created() {
            this.fetchAllInstructors();
            this.fetchCourseList();
            const data = JSON.parse(window.localStorage.getItem('replacedData'));
            this.replacedData = data ? data : [];
        },
        methods: {
            fetchAllInstructors() {
                InstructorService.list(0, this.school.id).then((res) => {
                    this.instructors = res._embedded.instructorResourceList.map((i) => {
                        i.fullName = i.firstName + ' ' + i.lastName;
                        return i;
                    });
                });
            },

            fetchCourseList() {
                courseService.listBySchool(this.school.id).then((res) => {
                    this.courses = res;
                    console.log(this.courses);
                });
            },

            submitReplace() {
                this.replacedData.push(this.replaceObj);
                window.localStorage.setItem('replacedData', JSON.stringify(this.replacedData));
                this.replaceObj = {};
            }
        }
    }
</script>

<style lang="scss">
    .replace-instructor {
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
