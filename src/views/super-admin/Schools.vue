<template>
	<div class="super-admin-schools">
		<SuperAdminSchoolHead @addSchool="onAddSchool"></SuperAdminSchoolHead>
		<SmartTable></SmartTable>
		<v-dialog
				v-model="isAddSchool"
				width="546"
				id="add-form"
		>
			<AddSchool></AddSchool>
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
