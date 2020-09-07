<template>
    <v-form @submit.prevent="submit" ref="form">
        <div class="form-head">
            <span v-if="!isEdit"><h3>Добавить учителя</h3></span>
            <span v-else>Редактировать учителя</span>
            <img alt="" src="../../assets/images/profile-icon.svg">
            <button class="profile-edit">
                <img src="../../assets/images/icons/edit.svg">
            </button>
        </div>
        <div>
            <v-text-field :rules="required" label="Имя" v-model="user.name"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="required" label="Фамилия" v-model="user.surname"></v-text-field>
        </div>
        <div>
            <v-text-field label="Отчество" v-model="user.middleName"></v-text-field>
        </div>
        <div>
            <v-radio-group :mandatory="false" :rules="required" row v-model="user.gender">
                <v-radio label="М" value="MALE"></v-radio>
                <v-radio label="Ж" value="FEMALE"></v-radio>
            </v-radio-group>
            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                min-width="290px"
                offset-y
                transition="scale-transition"
                v-model="menu2"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        label="Дата рождения"
                        readonly
                        v-bind="attrs"
                        v-model="birthday"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker @input="menu2 = false" v-model="birthday"></v-date-picker>
            </v-menu>
        </div>
        <div class="spacer">
            <v-text-field label="Номер телефона" v-model="user.phone"></v-text-field>
        </div>
        <div>
            <v-select
                :items="courses"
                :rules="required"
                item-text="courseTitle"
                item-value="id"
                label="Предметы"
                v-model="user.courseId"
            ></v-select>
        </div>
        <div class="form-footer">
            <div class="btn-actions">
                <v-btn color="primary" type="submit">Сохранить</v-btn>
                <v-btn color="red" @click="$emit('close')">Отменить</v-btn>
            </div>
        </div>
    </v-form>
</template>

<script>
import {PersonService} from '@/_services/person.service'
import moment from 'moment'
import {RoleService} from '@/_services/role.service'
import {LanguageService} from '@/_services/language.service'
import {CourseService} from '@/_services/course.service'
import {InstructorCourseService} from '@/_services/instructor-course.service'

const instructorCourseService = new InstructorCourseService()
const courseService = new CourseService()
const languageService = new LanguageService()
const roleService = new RoleService()
const personService = new PersonService()

export default {
    name: 'AddTeacher',
    props: {
        user: {
            type: Object,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        birthday: '1970-2-11',
        roles: [],
        languages: [],
        required: [
            v => !!v || 'Input is required'
        ],
        menu2: false,
        courses: [],
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        },
        birthDay() {
            return moment(this.user.birthday).isValid() ? this.user.birthday : '1970-2-11';
        },
    },
    mounted() {
        this.fetchRoles()
        this.fetchLanguages()
        this.fetchCourses()
    },
    methods: {
        fetchRoles() {
            roleService.listPageable(0).then(res => {
                this.roles = res
            }).catch(err => console.log(err))
        },
        fetchLanguages() {
            languageService.list().then(res => {
                this.languages = res
            }).catch(err => console.log(err))
        },
        fetchCourses() {
            courseService.listBySchool(this.userProfile.schools[0].id).then(res => {
                this.courses = res
            }).catch(err => console.log(err))
        },
        submit() {
            if (this.$refs.form.validate()) {
                this.user.roles = this.roles.filter(i => i.code === 'ROLE_INSTRUCTOR').map(i => i.id)
                this.user.dob = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY')
                this.user.schoolId = this.userProfile.schools[0].id
                if (this.isEdit) {
                    this.personEdit(this.user)
                } else {
                    this.personCreate(this.user)
                }
            }
        },
        personCreate(data) {
            personService.create(data).then(res => {
                if (res.success) {
                    const courseData = {
                        archived: false,
                        courseId: this.user.courseId,
                        personId: res.message,
                        schoolId: this.userProfile.schools[0].id
                    }
                    this.courseCreate(courseData)
                } else {
                    this.$toast.error(res.message)
                }
            }).catch(err => console.log(err))
        },
        personEdit(data) {
            personService.edit(data).then(res => {
                if (res.success) {
                    const courseData = {
                        archived: false,
                        courseId: this.user.courseId,
                        personId: data.id,
                        schoolId: this.userProfile.schools[0].id
                    }
                    this.courseEdit(courseData)
                } else {
                    this.$toast.error(res.message)
                }
            }).catch(err => console.log(err))
        },
        courseCreate(data) {
            instructorCourseService.create(data).then(res => {
                this.$toast.success('Успешно создано!')
                this.$emit('close')
            }).catch(err => console.log(err))
        },
        courseEdit(data) {
            instructorCourseService.listByInstructor(data.personId).then(res => {
                if (res._embedded) {
                    data.id = res._embedded.instructorCourseResourceList[0].id;
                    return instructorCourseService.edit(data);
                } else {
                    return instructorCourseService.create(data);
                }
            }).then(res => {
                this.$toast.success('Успешно обновлено!')
                this.$emit('close')
            }).catch(err => console.log(err))
        }
    }
}
</script>

<style lang="scss" scoped>
.v-form {
    background: #FFFFFF;
    border-radius: 7px;
    padding: 20px 40px;

    > div.form-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;

        .v-input--radio-group {
            margin-right: 20px;
        }

        .profile-edit {
            background: #FFFFFF;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            position: absolute;
            right: 0;
            bottom: 0;

            img {
                margin-top: 5px;
            }
        }

        &.spacer {
            .v-text-field:first-child {
                margin-right: 20px;
            }
        }
    }
}
</style>
