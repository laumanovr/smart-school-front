<template>
    <div class="super-admin-instructors">
        <SuperAdminSchoolHead>
            <template v-slot:title>Администратор</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartButton @clicked="onAddAdmin">Добавить администратора +</SmartButton>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="users" :total-elements="users.length" :totalPages="totalPages" :page-size="users.length">
            <template v-slot:firstItem>
                <SmartSelect>Область
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
                <SmartSelect>Район
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
            </template>
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Школа</th>
                <th>Район</th>
                <th>Логин</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.name }} {{ item.surname }} {{ item.middleName }}</td>
                <td>{{ item.schoolTitle }}</td>
                <td>{{ item.rayonTitle }}</td>
                <td>{{ item.username }}</td>
                <td><img class="clickable-icons" @click="onEdit(item)" alt="" src="../../assets/images/icons/pen.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            id="add-form"
            v-model="isAddAdmin"
            width="546"
        >
            <AddSchoolAdmin @close="onCloseModal"></AddSchoolAdmin>
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

const personService = new PersonService()

export default {
    name: 'Instructors',
    components: {SmartSelect, SmartSearchInput, SmartButton, SuperAdminSchoolHead, SmartTable, AddSchoolAdmin},
    data: () => ({
        isAddAdmin: false,
        users: [],
	    isEdit: false,
	    user: {},
        totalPages: 1
    }),
    mounted() {
        this.fetchUsers()
    },
    methods: {
        onAddAdmin() {
            this.isAddAdmin = true
        },
        onCloseModal() {
            this.isAddAdmin = false
            this.fetchUsers()
        },
        fetchUsers() {
            personService.list().then(res => {
                this.users = res
            }).catch(err => console.log(err))
        },
        onEdit(item) {
            personService.getById(item.id).then(res => {
	            this.isEdit = false
	            this.user = {
	            	name: res.firstName,
		            surname: res.lastName,
		            middleName: res.middleName,
		            dob: res.dateOfBirth,
		            gender: res.gender,
		            email: res.email,
		            phone: res.phone,
	            }
            }).catch(err => console.log(err))
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-instructors {
    margin-bottom: 50px;
}
</style>
