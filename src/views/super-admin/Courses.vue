<template>
    <div class="super-admin-courses">
        <SuperAdminSchoolHead>
            <template v-slot:title>Предметы</template>
            <template v-slot:right>
                <SmartButton @clicked="isAdd = true">Добавить +</SmartButton>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="courses" :total-elements="totalElements" :page-size="pageSize">
            <template v-slot:head>
                <th>№</th>
                <th>Название</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>
            <template slot="body" slot-scope="{item}">
                <td>{{ item.pos }}</td>
                <td>{{ item.title }}</td>
                <td><img alt="" src="../../assets/images/icons/pen.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            id="add-form"
            v-model="isAdd"
            width="546"
        >
            <AddCourse @close="onCloseModal"></AddCourse>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddCourse from '@/components/super-admin/courses/AddCourse'
import {AdminCourseService} from '@/_services/admin-course.service'
import SmartButton from '@/components/button/SmartButton'

const adminCourseService = new AdminCourseService()

export default {
    name: 'Courses',
    components: {SmartButton, AddCourse, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAdd: false,
        courses: [],
        page: 0,
        totalElements: 0,
        pageSize: 0
    }),
    mounted() {
        this.fetchCourses()
    },
    methods: {
        onCloseModal() {
            this.isAdd = false
            this.fetchCourses()
        },
        fetchCourses() {
            adminCourseService.list().then(res => {
                this.courses = res.map((i, index) => {
                    i.pos = index + 1;
                    return i;
                })
                this.totalElements = this.courses.length;
                this.pageSize = this.totalElements;
                this.currentPage = 1;
            }).catch(err => console.log(err))
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-courses {
}
</style>
