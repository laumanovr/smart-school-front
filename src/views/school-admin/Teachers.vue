<template>
    <div class="school-admin-teachers">
        <SuperAdminSchoolHead>
            <template v-slot:title>Учителя</template>
            <template v-slot:center>
                <SmartButton @clicked="onAddAdmin">
                    Добавить Учителя <img alt="" src="../../assets/images/icons/add-user.svg">
                </SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartBtn2>
                    Импорт <img alt="" src="../../assets/images/icons/import.svg" style="padding-bottom: 5px">
                </SmartBtn2>
                <SmartBtn2>
                    Экспорт <img alt="" src="../../assets/images/icons/export.svg">
                </SmartBtn2>
                <SmartBtn2>
                    Загрузить шаблон <img alt="" src="../../assets/images/icons/download.svg">
                </SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="users">
            <template v-slot:firstItem>
                <SmartSelect>Предмет
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
                <SmartSelect>Район
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
                <SmartSelect>Пол
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
            </template>
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Предмет</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.instructorTitle }}</td>
                <td>{{ item.courseName }}</td>
                <td @click="editUser(item)" class="actions"><img alt="" src="../../assets/images/icons/pen.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            v-if="isAddUser"
            id="add-form"
            v-model="isAddUser"
            width="546"
        >
            <AddTeacher :is-edit="isEdit" :user="user" @close="onCloseModal"></AddTeacher>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import {InstructorCourseService} from '@/_services/instructor-course.service'
import AddTeacher from '@/components/teacher/AddTeacher'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartBtn2 from '@/components/button/SmartBtn2'
import SmartSelect from '@/components/select/SmartSelect'
import {userService} from "@/_services/user.service";
import { PersonService } from "@/_services/person.service";
import moment from 'moment'

const personService = new PersonService()
const instructorCourseService = new InstructorCourseService()
export default {
    name: 'Teachers',
    components: {SmartSelect, SmartBtn2, SmartSearchInput, SmartButton, AddTeacher, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAddUser: false,
        users: [],
        user: {},
        isEdit: false
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        }
    },
    mounted() {
        this.fetchUsers()
    },
    methods: {
        onAddAdmin() {
            this.isAddUser = true
            this.isEdit = false
            this.user = {};
        },
        onCloseModal() {
            this.isAddUser = false
            this.fetchUsers()
        },
        fetchUsers() {
            instructorCourseService.listBySchool(this.userProfile.schools[0].id, 0).then(res => {
                if (res._embedded) {
                    this.users = res._embedded.instructorCourseResourceList
                } else this.users = []
            }).catch(err => console.log(err))
        },
        editUser(item) {
            personService.getById(item.instructorId).then(res => {
                this.user = {
                    id: res.id,
                    name: res.firstName,
                    surname: res.lastName,
                    middleName: res.middleName,
                    gender: res.gender,
                    phone: res.phone,
                    courseId: item.courseId,
                    birthday: moment(res.dateOfBirth, 'DD.MM.YYYY').format('YYYY-MM-DD')
                }
                this.isAddUser = true;
                this.isEdit = true;
            }).catch(err => console.log(err));
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
