<template>
    <div class="school-admin-courses">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Предметы</template>
            <template v-slot:right>
                <!--<SmartSearchInput></SmartSearchInput>-->
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="adminCourses"
            :total-elements="adminCourses.length"
            :page-size="adminCourses.length"
            :totalPages="totalPages"
        >
            <template v-slot:head>
                <th class="top-th"></th>
                <th>На русском</th>
                <th>На кыргызском</th>
                <th>На английском</th>
            </template>

            <template v-slot:body="{ item }">
                <td v-if="item.disable"><input :disabled="item.disable" type="checkbox"></td>
                <td v-else></td>
                <td>{{ item.title }}</td>
                <td>{{ item.courseTitleKG }}</td>
                <td>{{ item.code }}</td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
import SmartTable from '@/components/table/SmartTable';
import {AdminCourseService} from '@/_services/admin-course.service';
import {CourseService} from '@/_services/course.service';
import SmartSearchInput from '@/components/input/SmartSearchInput';
const courseService = new CourseService();
const adminCourseService = new AdminCourseService();
import PreLoader from '@/components/preloader/PreLoader';

export default {
    name: 'SchoolAdminCourses',
    components: {SmartSearchInput, SuperAdminSchoolHead, SmartTable, PreLoader},
    data: () => ({
        isLoading: false,
        items: [],
        adminCourses: [],
        isAddUser: false,
        itemsSelected: 0,
        totalPages: 1
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        }
    },
    created() {
        this.fetchCourses();
    },
    methods: {
        onCloseModal() {
        },
        fetchCourses() {
            this.isLoading = true;
            courseService.listBySchool(this.userProfile.schools[0].id).then((res) => {
                this.items = res;
                return adminCourseService.list();
            }).then((res) => {
                this.adminCourses = res.map(i => {
                   if (this.items.some(it => it.adminCourseId === i.id)) {
                       i.disable = true;
                   }
                   return i;
                }).sort((a, b) => a.title.localeCompare(b.title));
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },
        onSelect(item) {
            this.adminCourses = this.adminCourses.map(i => {
                if (i.id === item.id) i = item
                return i
            })
            this.itemsSelected = this.adminCourses.filter(i => i.checked).length
        },
        async addCourses() {
            if (this.itemsSelected) {
                for (const item of this.adminCourses) {
                    if (item.checked) {
                        const data = {
                            adminCourseId: item.id,
                            archived: false,
                            code: item.code,
                            schoolId: this.userProfile.schools[0].id
                        }
                        await courseService.create(data).then(res => {
                            console.log(res)
                        }).catch(err => console.log(err))
                    }
                }
                this.$toast.success('Успешно создано!')
                this.fetchCourses();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.school-admin-courses {
    margin-bottom: 50px;
}

.top-th {
    width: 60px;
}
</style>
