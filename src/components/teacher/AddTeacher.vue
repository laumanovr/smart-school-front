<template>
	<v-form @submit.prevent="submit" ref="form">
		<div class="form-head">
			<span>Add Teacher</span>
			<img src="../../assets/images/profile-icon.svg" alt="">
			<button class="profile-edit">
				<img src="../../assets/images/icons/edit.svg">
			</button>
		</div>
		<div>
			<v-text-field v-model="user.name" :rules="required" label="Name"></v-text-field>
		</div>
		<div>
			<v-text-field v-model="user.surname" :rules="required" label="Surname"></v-text-field>
		</div>
		<div>
			<v-text-field v-model="user.middleName" label="Middle Name"></v-text-field>
		</div>
		<div>
			<v-radio-group v-model="user.gender" :rules="required" :mandatory="false" row>
				<v-radio label="Male" value="MALE"></v-radio>
				<v-radio label="Female" value="FEMALE"></v-radio>
			</v-radio-group>
			<v-menu
					v-model="menu2"
					:close-on-content-click="false"
					:nudge-right="40"
					transition="scale-transition"
					offset-y
					min-width="290px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
							v-model="birthday"
							label="Birthday"
							readonly
							v-bind="attrs"
							v-on="on"
					></v-text-field>
				</template>
				<v-date-picker v-model="birthday" @input="menu2 = false"></v-date-picker>
			</v-menu>
		</div>
		<div class="spacer">
			<v-text-field v-model="user.phone" label="Номер телефона"></v-text-field>
		</div>
		<div>
			<v-select
					:rules="required"
					:items="courses"
					item-text="name"
					item-value="id"
					label="Courses"
					v-model="courseId"
			></v-select>
		</div>
		<div class="form-footer">
			<v-btn type="submit" color="primary">Сохранить</v-btn>
			<v-btn>Отменить</v-btn>
		</div>
	</v-form>
</template>

<script>
import { PersonService } from '@/_services/person.service'
import moment from 'moment'
import { RoleService } from '@/_services/role.service'
import { LanguageService } from '@/_services/language.service'
import { CourseService } from '@/_services/course.service'
import { InstructorCourseService } from '@/_services/instructor-course.service'

const instructorCourseService = new InstructorCourseService()
const courseService = new CourseService()
const languageService = new LanguageService()
const roleService = new RoleService()
const personService = new PersonService()

export default {
	name: "AddTeacher",
	data: () => ({
		roles: [],
		languages: [],
		user: {},
        birthday: '1970-2-11',
        required: [
            v => !!v || 'Input is required',
        ],
		menu2: false,
		courses: [],
		courseId: ''
	}),
	computed: {
	    userProfile () {
	        return this.$store.state.account.profile
	    }
	},
	mounted () {
	    this.fetchRoles()
		this.fetchLanguages()
		this.fetchCourses()
    },
    methods: {
        fetchRoles () {
            roleService.listPageable(0).then(res => {
                this.roles = res;
            }).catch(err => console.log(err));
        },
        fetchLanguages () {
            languageService.list().then(res => {
                this.languages = res;
            }).catch(err => console.log(err));
        },
	    fetchCourses () {
            courseService.listBySchool(this.userProfile.schools[0].id).then(res => {
                this.courses = res;
            }).catch(err => console.log(err));
	    },
        submit () {
            if (this.$refs.form.validate()) {
                this.user.roles = this.roles.filter(i => i.code === 'ROLE_INSTRUCTOR').map(i => i.id);
                this.user.dob = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY');
                this.user.schoolId = this.userProfile.schools[0].id;
                personService.create(this.user).then(res => {
                    if (res.success) {
                        this.courseCreate()
                    } else {
                        this.$toast.error(res.message);
                    }
                }).catch(err => console.log(err));
            }
        },
	    courseCreate (personId) {
            const data = {
                archived: true,
	            courseId: this.courseId,
	            personId: personId,
	            schoolId: this.userProfile.schools[0].id
            };
			instructorCourseService.create(data).then(res => {
                this.$toast.success('Successfully created!')
                this.$emit('close');
			}).catch(err => console.log(err));
	    }
	}
}
</script>

<style lang="scss" scoped>
.v-form {
  background: #FFFFFF;
  border-radius: 7px;
  padding: 20px 40px;

  > div {
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
