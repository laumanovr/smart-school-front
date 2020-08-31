<template>
    <div class="super-admin-courses">
        <SuperAdminSchoolHead>
            <template v-slot:title>Предметы</template>
            <template v-slot:right>
                <SmartSearchInput @onTyping="onSearch"></SmartSearchInput>
                <SmartButton @clicked="onAdd">Добавить +</SmartButton>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable v-if="!isGrid" :schools="courses" :total-elements="totalElements" :page-size="pageSize">
            <template v-slot:table-head-right>
                <CourseMenu :is-grid="isGrid" @onChange="onMenuChange"></CourseMenu>
            </template>
            <template v-slot:head>
                <th>№</th>
                <th>Название</th>
                <th>Описание</th>
                <th></th>
                <th></th>
            </template>
            <template slot="body" slot-scope="{item}">
                <td>{{ item.pos }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
                <td>
                    <img @click="onEdit(item)" class="clickable-icons" alt="" src="../../assets/images/icons/edit-green.svg">
                </td>
                <td>
                    <img @click="onDelete(item)" class="clickable-icons" alt="" src="../../assets/images/icons/trash.svg">
                </td>
            </template>
        </SmartTable>
        <template v-else>
            <CourseMenu class="course-menu-grid" :is-grid="isGrid" @onChange="onMenuChange"></CourseMenu>
            <CourseGrid :courses="courses" @onEdit="onEdit" @onDelete="onDelete"></CourseGrid>
        </template>
        <v-dialog
            v-if="isAdd"
            id="add-form"
            v-model="isAdd"
            width="546"
        >
            <AddCourse @close="onCloseModal" :is-edit="isEdit" :edit-course="course"></AddCourse>
        </v-dialog>
        <v-dialog
            max-width="450"
            v-model="isDeleting"
        >
            <DeletePopup @cancel="isDeleting = false" @accept="deleteCourse"></DeletePopup>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddCourse from '@/components/super-admin/courses/AddCourse'
import {AdminCourseService} from '@/_services/admin-course.service'
import SmartButton from '@/components/button/SmartButton'
import DeletePopup from "@/components/delete-popup/DeletePopup";
import CourseGrid from "@/components/super-admin/courses/CourseGrid";
import CourseMenu from "@/components/super-admin/courses/CourseMenu";
import SmartSearchInput from "@/components/input/SmartSearchInput";

const adminCourseService = new AdminCourseService()

export default {
    name: 'Courses',
    components: {
        SmartSearchInput,
        CourseMenu, CourseGrid, DeletePopup, SmartButton, AddCourse, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAdd: false,
        courses: [],
        page: 0,
        totalElements: 0,
        isEdit: false,
        pageSize: 0,
        course: {},
        isDeleting: false,
        isGrid: true,
        allCourses: []
    }),
    mounted() {
        this.fetchCourses()
    },
    methods: {
        onCloseModal() {
            this.isAdd = false
            this.fetchCourses()
        },
        onAdd () {
            this.isAdd = true
            this.isEdit = false;
        },
        fetchCourses() {
            adminCourseService.list().then(res => {
                this.courses = res.map((i, index) => {
                    i.pos = index + 1;
                    return i;
                })
                this.allCourses = this.courses;
                this.totalElements = this.courses.length;
                this.pageSize = this.totalElements;
                this.currentPage = 1;
            }).catch(err => console.log(err))
        },
        onEdit(item) {
            adminCourseService.getById(item.id).then(res => {
                this.course = res;
                this.isAdd = true;
                this.isEdit = true;
            }).catch(err => console.log(err));
        },
        onDelete (item) {
            this.course = item;
            this.isDeleting = true;
        },
        deleteCourse () {
            adminCourseService._delete(this.course.id).then(res => {
                this.$toast.success('Успешно удалено!');
                this.fetchCourses();
            }).catch(err => {
                console.log(err);
                this.isDeleting = false;
                this.$toast.error(err);
            });
        },
        onMenuChange (val) {
            this.isGrid = val;
        },
        onSearch (val) {
            if (val) {
                this.courses = this.allCourses.filter(i => i.title.toLowerCase().includes(val.toLowerCase()))
            } else this.courses = this.allCourses;
        }
    }
}
</script>

<style lang="scss" scoped>
    .course-menu-grid {
        margin: 20px 30px;
    }
</style>
