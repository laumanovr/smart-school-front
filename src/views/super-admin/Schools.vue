<template>
	<div class="super-admin-schools">
		<SuperAdminSchoolHead></SuperAdminSchoolHead>
		<SmartTable></SmartTable>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
export default {
name: "Schools",
    components: { SuperAdminSchoolHead, SmartTable }
}
</script>

<style lang="scss" scoped>
	.super-admin-schools {
      width: calc(100% - 96px);
	}
</style>
