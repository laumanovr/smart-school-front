<template>
	<div class="school-admin-courses">
		<SuperAdminSchoolHead>
			<template v-slot:title>Courses</template>
			<template v-slot:right>
				<v-text-field
						label="Искать"
						required
				></v-text-field>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="adminCourses" @addCourses="addCourses">
			<template v-slot:head>
					<th class="top-th">
						<input type="checkbox">
					</th>
					<th>Название</th>
					<th>Описание</th>
<!--					<th></th>-->
<!--					<th></th>-->
			</template>

			<template v-slot:body="{ item }">
				<td><input @change="onSelect(item)" v-model="item.checked" type="checkbox"></td>
				<td>{{ item.title }}</td>
				<td>{{ item.description }}</td>
<!--				<td class="top-th"><img src="../../assets/images/icons/edit-green.svg" alt=""></td>-->
<!--				<td class="top-th"><img src="../../assets/images/icons/trash.svg" alt=""></td>-->
			</template>
		</SmartTable>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import { AdminCourseService } from '@/_services/admin-course.service'
import { CourseService } from '@/_services/course.service'

const courseService = new CourseService()
const adminCourseService = new AdminCourseService()

export default {
    name: 'SchoolAdminCourses',
    components: { SuperAdminSchoolHead, SmartTable },
    data: () => ({
        items: [],
	    adminCourses: [],
        isAddUser: false,
	    itemsSelected: 0
    }),
	computed: {
        userProfile () {
            return this.$store.state.account.profile
        }
	},
	mounted () {
        this.fetchCourses();
        this.fetchAdminCourses()
    },
    methods: {
        onCloseModal () {},
	    fetchAdminCourses () {
			adminCourseService.list().then(res => {
			    this.adminCourses = res;
			}).catch(err => console.log(err));
	    },
	    fetchCourses () {
            courseService.listBySchool(this.userProfile.schools[0].id).then(res => {
                this.items = res;
            }).catch(err => console.log(err));
	    },
        onSelect(item) {
            this.adminCourses = this.adminCourses.map(i => {
                if (i.id === item.id) i = item;
                return i;
	        });
            this.itemsSelected = this.adminCourses.filter(i => i.checked).length;
        },
	    addCourses () {
            if (this.itemsSelected) {
                this.adminCourses.filter(i => i.checked).forEach(async item => {
                   const data = {
                       adminCourseId: item.id,
	                   archived: true,
	                   code: item.code,
	                   schoolId: this.userProfile.schools[0].id
                   };
                    await courseService.create(data).then(res => {
                       console.log(res);
                   }).catch(err => console.log(err))
                });
                console.log('after all');
            }
	    }
    }
}
</script>

<style lang="scss" scoped>
.school-admin-courses {
  width: calc(100% - 96px);
}
.top-th {
  width: 60px;
}
</style>
