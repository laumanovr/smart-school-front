<template>
    <div class="super-admin-courses">
        <PreLoader v-if="isLoading"/>
        <v-form ref="filterForm">
            <div class="select-filter-block">
                <v-select
                    class="v-select-item"
                    :items="classTypes"
                    item-text="title"
                    item-value="type"
                    label="Классы"
                    :rules="required"
                    v-model="courseFilter.classType"
                />
                <v-select
                    class="v-select-item"
                    :items="languages"
                    item-text="title"
                    item-value="type"
                    label="Язык обучения"
                    :rules="required"
                    v-model="courseFilter.language"
                />
                <v-btn color="primary" @click="filterCourses">Фильтр</v-btn>
            </div>
        </v-form>
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
                <th>На русском</th>
                <th>На кыргызском</th>
                <th>На английском</th>
                <th></th>
                <th></th>
            </template>
            <template slot="body" slot-scope="{item}">
                <td>{{ item.pos }}</td>
                <td>{{ item.title }}</td>
                <td>{{ item.courseTitleKG }}</td>
                <td>{{ item.code }}</td>
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
            <AddCourse
                @close="onCloseModal"
                :is-edit="isEdit"
                :edit-course="course"
                :classTypes="classTypes"
                :languages="languages"
            />
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
const adminCourseService = new AdminCourseService();
import PreLoader from "@/components/preloader/PreLoader";

export default {
    name: 'Courses',
    components: {
        SmartSearchInput,
        CourseMenu, CourseGrid, DeletePopup, SmartButton, AddCourse, SuperAdminSchoolHead, SmartTable, PreLoader},
    data: () => ({
        isLoading: false,
        required: [v => !!v || ''],
        isAdd: false,
        courses: [],
        page: 0,
        totalElements: 0,
        isEdit: false,
        pageSize: 0,
        course: {},
        isDeleting: false,
        isGrid: false,
        allCourses: [],
        classTypes: [
            {title: 'Начальные классы', type: 'JUNIOR'},
            {title: 'Старшие классы', type: 'SENIOR'},
            {title: 'Все', type: 'ALL'}
        ],
        languages: [
            {title: 'Русский', type: 'RUSSIAN'},
            {title: 'Кыргызский', type: 'KYRGYZ'}
        ],
        courseFilter: {
            classType: '',
            language: ''
        }
    }),
    created() {
        this.fetchCourses();
    },
    methods: {
        filterCourses() {
            if (this.$refs.filterForm.validate()) {
                this.courses = this.allCourses.filter((course) =>
                    course.classType === this.courseFilter.classType &&
                    course.languageCode === this.courseFilter.language
                )
            }
        },

        onCloseModal() {
            this.isAdd = false;
            this.fetchCourses();
        },

        onAdd () {
            this.isAdd = true;
            this.isEdit = false;
        },

        fetchCourses() {
            this.isLoading = true;
            adminCourseService.list().then((res) => {
                this.courses = res.map((i, index) => {
                    i.pos = index + 1;
                    return i;
                });
                this.allCourses = this.courses;
                this.totalElements = this.courses.length;
                this.pageSize = this.totalElements;
                this.currentPage = 1;
                if (this.courseFilter.classType && this.courseFilter.language) {
                    // temp
                    this.filterCourses();
                }
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },
        onEdit(item) {
            this.course = item;
            this.isAdd = true;
            this.isEdit = true;
        },
        onDelete (item) {
            this.course = item;
            this.isDeleting = true;
        },
        deleteCourse () {
            adminCourseService._delete(this.course.id).then(res => {
                this.$toast.success('Успешно удалено!');
                this.isDeleting = false
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
    .super-admin-courses {
        margin: 30px;
        .v-select-item {
            max-width: 190px;
        }
    }
    .course-menu-grid {
        margin: 20px 30px;
    }
</style>
