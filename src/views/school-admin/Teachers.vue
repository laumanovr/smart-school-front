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
                <SmartBtn2 @onClick="isAddFile = true">
                    Импорт <img alt="" src="../../assets/images/icons/import.svg" style="padding-bottom: 5px">
                </SmartBtn2>
                <ExcelJs :rows="exportRows" :file-name="exportName" :headers="exportHeaders"></ExcelJs>
                <SmartBtn2 @onClick="downloadTemplate">
                    Загрузить шаблон <img alt="" src="../../assets/images/icons/download.svg">
                </SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="users"
            :total-elements="totalElements"
            :page-size="pageSize"
            :current-page="currentPage"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
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
	            <th>ID</th>
                <th>Ф.И.О</th>
                <th>Предмет</th>
<!--                <th>Логин</th>-->
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ (currentPage - 1) * 10 + item.index + 1 }}</td>
	            <td>{{ item.firstName+' '+item.lastName }}</td>
                <td>{{ item.courses.join(', ') }}</td>
<!--                <td>{{ item.username }}</td>-->
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
        <v-dialog v-if="isAddFile" v-model="isAddFile" width="546" id="add-file">
            <ImportFile @submit="onSubmit"></ImportFile>
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
import { PersonService } from "@/_services/person.service";
import moment from 'moment'
import ExcelJs from "@/components/excel-export/ExcelJs";
import ImportFile from "@/components/import-file/ImportFile";
import { FileImportService } from "@/_services/file-import.service";
const fileImportService = new FileImportService();
const personService = new PersonService();
const instructorCourseService = new InstructorCourseService();
import {AdminCourseService} from '@/_services/admin-course.service';
const adminCourseService = new AdminCourseService();
import InstructorService from "@/_services/instructor.service";
export default {
    name: 'Teachers',
    components: {
        ImportFile,
        ExcelJs,
        SmartSelect, SmartBtn2, SmartSearchInput, SmartButton, AddTeacher, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAddUser: false,
        users: [],
        user: {},
        isEdit: false,
        exportName: '',
        exportRows: [],
        exportHeaders: [],
        isAddFile: false,
        totalElements: 0,
        pageSize: 0,
        currentPage: 1,
        allAdminCourses: []
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        }
    },
    async mounted() {
        await this.fetchAllAdminCourses();
        this.fetchUsers();
    },
    methods: {
        fetchAllAdminCourses() {
            adminCourseService.list().then((res) => {
                this.allAdminCourses = res;
            })
        },
        showCourseName(code) {
            if (code) {
                return this.allAdminCourses.find(course => course.code === code).title;
            }
        },
        onAddAdmin() {
            this.isAddUser = true
            this.isEdit = false
            this.user = {};
        },
        onCloseModal() {
            this.isAddUser = false
            this.fetchUsers()
        },
        downloadTemplate () {
            const a = document.createElement('a');
            a.download = 'Шаблон импорта учителя.xlsx'
            a.href = '/docs/Шаблон_Мугалим.xlsx'
            a.click()
        },
        fetchUsers(page = 0) {
            InstructorService.list(page, this.userProfile.schools[0].id).then(res => {
                this.totalElements = res.page.totalElements
                this.pageSize = res.page.size
                if (res._embedded) {
                    this.users = res._embedded.instructorResourceList.map((i, ind) => {
                    	i.index = ind
	                    return i
                    })
                } else this.users = [];
                this.exportHeaders = ['Ф.И.О', 'Предмет'];
                this.exportRows = this.users.map(i => {
                    return [i.firstName+' '+i.lastName, i.courses.join(', ')];
                });
                this.exportName = 'Умная школа: Учителя'
            }).catch(err => console.log(err))
        },
        editUser(item) {
            personService.getById(item.id).then(res => {
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
        },
        onSubmit (data) {
            const d = {
                languageId: data.languageId,
                chronicleId: data.chronicleId,
                file: data.file,
                schoolId: this.userProfile.schools[0].id
            };
            fileImportService.importInstructor(d).then(res => {
                this.$toast.success('Successfully imported!')
                this.isAddFile = false;
                this.fetchUsers();
            }).catch(err => console.log(err));
        },
        onLeftClick () {
            this.currentPage--;
            this.fetchUsers(this.currentPage - 1);
        },
        onRightClick () {
            this.currentPage++;
            this.fetchUsers(this.currentPage - 1);
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
