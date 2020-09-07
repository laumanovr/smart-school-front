<template>
    <div class="super-admin-instructors">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Учителя</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <!--			<template v-slot:right>-->
            <!--                <SmartButton @clicked="onAddAdmin">Добавить Учителя + </SmartButton>-->
            <!--			</template>-->
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="users"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
            :total-elements="totalElements"
            :totalPages="totalPages"
            :page-size="pageSize"
            :current-page="currentPage"
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
                <th>Школа</th>
                <th>Предмет</th>
                <th>Ф.И.О</th>
                <th>Пол</th>
                <th>Дата рождения</th>
                <th>Район</th>
                <th>Телефон</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schools[0].name }}</td>
                <!--<td>{{ showCourses(item.courses) }}</td>-->
                <td class="instr-courses">
                    <template v-if="item.courses.length">
                        <span v-for="courseCode in item.courses">{{$t(`adminCourses.${courseCode}`)}},</span>
                    </template>
                    <span v-else></span>
                </td>
                <td>{{ item.firstName }} {{ item.lastName }}</td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.birthDay }}</td>
                <td>{{ item.schools[0].rayonTitle }}</td>
                <td>{{ item.phone }}</td>
            </template>
        </SmartTable>
        <v-dialog
            id="add-form"
            v-model="isAddAdmin"
            width="546"
        >
            <AddSchoolAdmin @close="onCloseModal" role="ROLE_INSTRUCTOR"></AddSchoolAdmin>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchoolAdmin from '@/components/super-admin/school-admin/AddSchoolAdmin'
import {PersonService} from '@/_services/person.service'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartSelect from '@/components/select/SmartSelect'
import {InstructorService} from "@/_services/instructor.service";
const instructorService = new InstructorService();
const personService = new PersonService();
import PreLoader from "@/components/preloader/PreLoader";

export default {
    name: 'Instructor',
    components: {SmartSelect, SmartSearchInput, SmartButton, SuperAdminSchoolHead, SmartTable, AddSchoolAdmin, PreLoader},
    data: () => ({
        isAddAdmin: false,
        users: [],
        gender: {
            FEMALE: 'Ж',
            MALE: 'М'
        },
        totalElements: 0,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
        isLoading: false,
    }),
    mounted() {
        this.fetchUsers(0);
    },
    methods: {
        onAddAdmin() {
            this.isAddAdmin = true
        },
        onCloseModal() {
            this.isAddAdmin = false
            this.fetchUsers()
        },
        fetchUsers(page) {
            this.isLoading = true;
            instructorService.list(page).then(res => {
                this.pageSize = res.page.size;
                this.totalElements = res.page.totalElements;
                this.totalPages = res.page.totalPages;
                if (res._embedded) {
                    this.users = res._embedded.instructorResourceList;
                } else this.users = [];
                this.isLoading = false;
            }).catch(err => console.log(err))
        },
        onLeftClick () {
            this.currentPage--;
            this.fetchUsers(this.currentPage - 1);
        },
        onRightClick () {
            this.currentPage++;
            this.fetchUsers(this.currentPage - 1);
        },
        showCourses (courses) {
            let c = '';
            if (courses && courses.length) {
                courses.forEach((i, index) => {
                    if (index !== courses.length - 1) c += i + ', ';
                    else c += i;
                })
            }
            return c;
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-instructors {
    margin-bottom: 50px;
    .instr-courses {
        span {
            margin-right: 5px;
        }
    }
}
</style>
