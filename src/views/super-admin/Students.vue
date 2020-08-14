<template>
    <div class="super-admin-students">
        <SuperAdminSchoolHead>
            <template v-slot:title>Ученики</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <!--			<template v-slot:right>-->
            <!--                <SmartButton @clicked="onAddAdmin">Добавить Учителя + </SmartButton>-->
            <!--			</template>-->
        </SuperAdminSchoolHead>
        <SmartTable
            :current-page="currentPage"
            :page-size="pageSize"
            :schools="users"
            :total-elements="totalElements"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
            <template v-slot:firstItem>
                <SmartSelect>Школа
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
                <th>Ф.И.О</th>
                <th>Пол</th>
                <th>Класс</th>
                <th>Район</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schools[0] ? item.schools[0].name : '' }}</td>
                <td>{{ item.firstName }} {{ item.lastName }}</td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.classTitle }}</td>
                <td>{{ item.schools[0] ? item.schools[0].rayonTitle : '' }}</td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from "@/components/super-admin/schools/SuperAdminSchoolHead";
import SmartSearchInput from "@/components/input/SmartSearchInput";
import SmartTable from "@/components/table/SmartTable";
import SmartSelect from "@/components/select/SmartSelect";
import {StudentService} from "@/_services/student.service";

const studentService = new StudentService()
export default {
    name: "Students",
    components: {SmartSelect, SmartTable, SmartSearchInput, SuperAdminSchoolHead},
    data() {
        return {
            users: [],
            totalElements: 0,
            pageSize: 20,
            currentPage: 1,
            gender: {
                FEMALE: 'Женщина',
                MALE: 'Мужчина'
            },
        }
    },
    mounted() {
        this.fetchUsers(0)
    },
    methods: {
        fetchUsers(page) {
            studentService.list(page).then(res => {
                this.pageSize = res.page.size;
                this.totalElements = res.page.totalElements;
                if (res._embedded) {
                    this.users = res._embedded.studentResourceList;
                } else this.users = [];
            }).catch(err => console.log(err));
        },
        onLeftClick() {
            this.currentPage--;
            this.fetchUsers(this.currentPage - 1);
        },
        onRightClick() {
            this.currentPage++;
            this.fetchUsers(this.currentPage - 1);
        }
    }
}
</script>

<style scoped>

</style>