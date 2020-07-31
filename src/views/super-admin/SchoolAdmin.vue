<template>
	<div class="super-admin-instructors">
		<SuperAdminSchoolHead>
			<template v-slot:title>School Admin</template>
			<template v-slot:center>
				<v-text-field
						label="Искать"
						required
				></v-text-field>
			</template>
			<template v-slot:right>
				<v-btn color="primary" depressed rounded @click="onAddAdmin">Add School Admin + </v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="users">
			<template v-slot:head>
				<th>Ф.И.О</th>
				<th>Школа</th>
				<th>Район</th>
				<th>Username</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>

			<template v-slot:body="{ item }">
				<td>{{ item.name }} {{ item.surname }} {{ item.middleName }}</td>
				<td>{{ item.schoolTitle }}</td>
				<td>{{ item.rayonTitle }}</td>
				<td>{{ item.username }}</td>
				<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAddAdmin"
				width="546"
				id="add-form"
		>
			<AddSchoolAdmin @close="onCloseModal"></AddSchoolAdmin>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchoolAdmin from '@/components/super-admin/school-admin/AddSchoolAdmin'
import { PersonService } from '@/_services/person.service'

const personService = new PersonService();

export default {
	name: "Instructors",
	components: { SuperAdminSchoolHead, SmartTable, AddSchoolAdmin },
	data: () => ({
		isAddAdmin: false,
		users: []
	}),
	mounted () {
	    this.fetchUsers()
    },
    methods: {
	    onAddAdmin () {
			this.isAddAdmin = true
	    },
        onCloseModal () {
	        this.isAddAdmin = false
	        this.fetchUsers();
        },
		fetchUsers () {
			personService.list().then(res => {
			    this.users = res;
			}).catch(err => console.log(err));
		}
	}
}
</script>

<style lang="scss" scoped>
	.super-admin-instructors {
	  width: calc(100% - 96px);
	}
</style>
