<template>
	<div class="super-admin-courses">
		<SuperAdminSchoolHead>
			<template v-slot:title>Предметы</template>
			<template v-slot:right>
				<v-btn color="primary" @click="isAdd = true">Добавить + </v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="courses">
			<template v-slot:head>
				<th>Title</th>
				<th>Code</th>
				<th>Description</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>
			<template slot="body" slot-scope="{item}">
				<td>{{ item.title }}</td>
				<td>{{ item.code }}</td>
				<td>{{ item.description }}</td>
				<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAdd"
				width="546"
				id="add-form"
		>
			<AddCourse @close="onCloseModal"></AddCourse>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddCourse from '@/components/super-admin/courses/AddCourse'
import { AdminCourseService } from '@/_services/admin-course.service'

const adminCourseService = new AdminCourseService()

export default {
	name: "Courses",
	components: { AddCourse, SuperAdminSchoolHead, SmartTable },
	data: () => ({
		isAdd: false,
		courses: []
	}),
	mounted () {
	    this.fetchCourses()
    },
    methods: {
        onCloseModal () {
            this.isAdd = false
	        this.fetchCourses()
        },
		fetchCourses () {
            adminCourseService.list().then(res => {
                this.courses = res;
            }).catch(err => console.log(err));
		}
	}
}
</script>

<style lang="scss" scoped>
	.super-admin-courses {
	}
</style>
