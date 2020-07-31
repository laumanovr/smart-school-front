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
				<v-btn depressed rounded>Распечатать</v-btn>
				<v-btn depressed rounded>Экспорт</v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="schools">
			<template v-slot:head>
				<th>Название</th>
				<th>Электронная Почта</th>
				<th>Номер телефона</th>
<!--				<th>Адрес</th>-->
				<th>Тип Школы</th>
				<th>Язык</th>
				<th>Район</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>

			<template v-slot:body="{ item }">
				<td>{{ item.name }}</td>
				<td>{{ item.email }}</td>
				<td>{{ item.phone }}</td>
				<td>{{ item.rayonTitle }}</td>
				<td>{{ item.schoolType }}</td>
				<td>{{ item.language }}</td>
				<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAddSchool"
				width="546"
				id="add-form"
		>
			<AddSchool @close="onCLoseModal">

			</AddSchool>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchool from '@/components/super-admin/schools/AddSchool'
import { SchoolService } from '@/_services/school.service'

const schoolService = new SchoolService()

export default {
name: "Schools",
    components: { AddSchool, SuperAdminSchoolHead, SmartTable },
	data: () => ({
        isAddSchool: false,
		schools: [],
	}),
	mounted () {
        this.fetchSchools();
    },
    methods: {
        onAddSchool (){
            this.isAddSchool = true;
        },
		fetchSchools () {
			schoolService.listPageable(0).then(res => {
			    if (res._embedded) {
                    this.schools = res._embedded.schoolResourceList;
			    } else this.schools = [];
			}).catch(err => {
			    console.log(err);
            });
		},
        onCLoseModal () {
            this.isAddSchool = false;
            this.fetchSchools();
        }
	}
}
</script>

<style lang="scss" scoped>
	.super-admin-schools {
      width: calc(100% - 96px);
	}
</style>
