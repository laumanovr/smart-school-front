<template>
	<div class="super-admin-schools">
		<SuperAdminSchoolHead @addSchool="onAddSchool">
			<template v-slot:title>Школы</template>
			<template v-slot:center>
				<v-btn color="primary" depressed rounded @click="onAddSchool">Добавить Школу + </v-btn>
				<v-text-field
						label="Искать"
						required
				></v-text-field>
			</template>
			<template v-slot:right>
				<v-btn  depressed rounded>Распечатать</v-btn>
				<v-btn depressed rounded>Экспорт</v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable>
			<template v-slot:head>
				<th>Электронная Почта</th>
				<th>Телефон</th>
				<th>Админ</th>
				<th>Админ</th>
				<th>Админ</th>
				<th>Админ</th>
				<th>Админ</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>

			<template v-slot:body>
				<tr v-for="item in 10" :key="item">
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td>lindsey.stroud@gmail.com</td>
					<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
				</tr>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAddSchool"
				width="546"
				id="add-form"
		>
			<AddSchool>

			</AddSchool>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchool from '@/components/super-admin/schools/AddSchool'
export default {
name: "Schools",
    components: { AddSchool, SuperAdminSchoolHead, SmartTable },
	data: () => ({
        isAddSchool: false
	}),
	methods: {
        onAddSchool (){
            this.isAddSchool = true;
        }
	}
}
</script>

<style lang="scss" scoped>
	.super-admin-schools {
      width: calc(100% - 96px);
	}
</style>
