<template>
	<div class="super-admin-instructors">
		<SuperAdminSchoolHead>
			<template v-slot:title>Учителя</template>
			<template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
			</template>
<!--			<template v-slot:right>-->
<!--                <SmartButton @clicked="onAddAdmin">Добавить Учителя + </SmartButton>-->
<!--			</template>-->
		</SuperAdminSchoolHead>
		<SmartTable :schools="users">
            <template v-slot:firstItem>
                <SmartSelect>Предмет <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Район <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Пол <v-icon>$chevronDown</v-icon></SmartSelect>
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
				<td>1-май орто мектеби</td>
				<td>Физика</td>
				<td>Кадижа Жанболотова</td>
                <td>Ж</td>
                <td>19.03.1988</td>
				<td>Карасуу району</td>
				<td>0777114676</td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAddAdmin"
				width="546"
				id="add-form"
		>
			<AddSchoolAdmin role="ROLE_INSTRUCTOR" @close="onCloseModal"></AddSchoolAdmin>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchoolAdmin from '@/components/super-admin/school-admin/AddSchoolAdmin'
import { PersonService } from '@/_services/person.service'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartSelect from '@/components/select/SmartSelect'

const personService = new PersonService()
export default {
  name: 'Instructor',
  components: { SmartSelect, SmartSearchInput, SmartButton, SuperAdminSchoolHead, SmartTable, AddSchoolAdmin },
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
      this.fetchUsers()
    },
    fetchUsers () {
      personService.list().then(res => {
        this.users = res
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
	.super-admin-instructors {
	}
</style>
