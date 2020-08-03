<template>
	<div class="school-admin-teachers">
		<SuperAdminSchoolHead>
			<template v-slot:title>Teachers</template>
			<template v-slot:center>
				<v-btn color="primary" depressed rounded @click="onAddAdmin">Add Teacher + </v-btn>
				<v-text-field
						label="Искать"
						required
				></v-text-field>
			</template>
			<template v-slot:right>
				<v-btn depressed rounded>Import</v-btn>
				<v-btn depressed rounded>Export</v-btn>
				<v-btn depressed rounded>Download template</v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="users">
			<template v-slot:head>
				<th>Ф.И.О</th>
				<th>Школа</th>
				<th>Район</th>
				<th>Username</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>

			<template v-slot:body="{ item }">
				<td>{{ item.name }} {{ item.surname }} {{ item.middleName }}</td>
				<td>{{ item.schoolTitle }}</td>
				<td>{{ item.rayonTitle }}</td>
				<td>{{ item.username }}</td>
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

const instructorCourseService = new InstructorCourseService()
export default {
    name: 'Teachers',
    components: { AddTeacher, SuperAdminSchoolHead, SmartTable },
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
            this.fetchUsers();
        },
        fetchUsers () {
            instructorCourseService.listBySchool(this.userProfile.schools[0].id, 0).then(res => {
                if (res._embedded) {
                    this.users = res._embedded.instructorCourseResourceList;
                } else this.users = []
            }).catch(err => console.log(err));
        }
    }
}
</script>

<style lang="scss" scoped>
.school-admin-teachers {
}
</style>
