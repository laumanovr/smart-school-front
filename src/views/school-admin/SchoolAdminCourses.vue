<template>
    <div class="school-admin-courses">
        <SuperAdminSchoolHead>
            <template v-slot:title>Предметы</template>
            <template v-slot:right>
                <SmartSearchInput></SmartSearchInput>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="adminCourses" @addCourses="addCourses">
            <template v-slot:head>
                <th class="top-th">
                    <input type="checkbox">
                </th>
                <th>Название</th>
                <th>Описание</th>
            </template>

            <template v-slot:body="{ item }">
                <td><input :disabled="item.disable" @change="onSelect(item)" type="checkbox" v-model="item.checked"></td>
                <td>{{ item.title }}</td>
                <td>{{ item.description }}</td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import {AdminCourseService} from '@/_services/admin-course.service'
import {CourseService} from '@/_services/course.service'
import SmartSearchInput from '@/components/input/SmartSearchInput'

const courseService = new CourseService()
const adminCourseService = new AdminCourseService()

export default {
    name: 'SchoolAdminCourses',
    components: {SmartSearchInput, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        items: [],
        adminCourses: [],
        isAddUser: false,
        itemsSelected: 0
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        }
    },
    mounted() {
        this.fetchCourses()
    },
    methods: {
        onCloseModal() {
        },
        fetchCourses() {
            courseService.listBySchool(this.userProfile.schools[0].id).then(res => {
                this.items = res;
                return adminCourseService.list();
            }).then(res => {
                this.adminCourses = res.map(i => {
                   if (this.items.some(it => it.adminCourseId === i.id)) {
                       i.disable = true;
                   }
                   return i;
                });
            }).catch(err => console.log(err))
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
                this.$toast.success('Successfully added!')
                this.fetchCourses();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.school-admin-courses {
}

.top-th {
    width: 60px;
}
</style>
