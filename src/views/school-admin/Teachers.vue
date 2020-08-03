<template>
	<div class="school-admin-teachers">
		<SuperAdminSchoolHead>
			<template v-slot:title>Teachers</template>
			<template v-slot:center>
                <SmartButton @clicked="onAddAdmin">
                    Добавить Учителя <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
                <SmartSearchInput></SmartSearchInput>
			</template>
			<template v-slot:right>
				<SmartBtn2>
                    Import <img style="padding-bottom: 5px" src="../../assets/images/icons/import.svg" alt="">
                </SmartBtn2>
				<SmartBtn2>
                    Export <img src="../../assets/images/icons/export.svg" alt="">
                </SmartBtn2>
				<SmartBtn2>
                    Download Template <img src="../../assets/images/icons/download.svg" alt="">
                </SmartBtn2>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="users">
            <template v-slot:firstItem>
                <SmartSelect>Предмет <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Район <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Пол <v-icon>$chevronDown</v-icon></SmartSelect>
            </template>
			<template v-slot:head>
				<th>Ф.И.О</th>
				<th>Предмет</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>

			<template v-slot:body="{ item }">
				<td>{{ item.instructorTitle }}</td>
				<td>{{ item.courseName }}</td>
				<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAddAdmin"
				width="546"
				id="add-form"
		>
			<AddTeacher @close="onCloseModal"></AddTeacher>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import { InstructorCourseService } from '@/_services/instructor-course.service'
import AddTeacher from '@/components/teacher/AddTeacher'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartBtn2 from '@/components/button/SmartBtn2'
import SmartSelect from '@/components/select/SmartSelect'

const instructorCourseService = new InstructorCourseService()
export default {
  name: 'Teachers',
  components: { SmartSelect, SmartBtn2, SmartSearchInput, SmartButton, AddTeacher, SuperAdminSchoolHead, SmartTable },
  data: () => ({
    isAddAdmin: false,
    users: []
  }),
  computed: {
    userProfile () {
      return this.$store.state.account.profile
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    onAddAdmin () {
      this.isAddAdmin = true
    },
    onCloseModal () {
      this.isAddAdmin = false
      this.fetchUsers()
    },
    fetchUsers () {
      instructorCourseService.listBySchool(this.userProfile.schools[0].id, 0).then(res => {
        if (res._embedded) {
          this.users = res._embedded.instructorCourseResourceList
        } else this.users = []
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
