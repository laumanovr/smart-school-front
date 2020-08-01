<template>
	<div class="school-admin-classes">
		<SuperAdminSchoolHead>
			<template v-slot:title>Teachers</template>
			<template v-slot:center>
				<v-btn color="primary" depressed rounded @click="onAddAdmin">Add Teacher + </v-btn>
				<v-text-field
						label="Искать"
						required
				></v-text-field>
			</template>
			<template v-slot:right>
				<v-btn depressed rounded>Import</v-btn>
				<v-btn depressed rounded>Export</v-btn>
				<v-btn depressed rounded>Download template</v-btn>
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
				v-model="isAddUser"
				width="546"
				id="add-form"
		>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
export default {
    name: 'Classes',
	components: { SuperAdminSchoolHead, SmartTable },
	data: () => ({
		users: [],
		isAddUser: false,
	}),
	methods: {
        onCloseModal () {}
	}
}
</script>

<style lang="scss" scoped>
.school-admin-classes {
  width: calc(100% - 96px);
}
</style>
