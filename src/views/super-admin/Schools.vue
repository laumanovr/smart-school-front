<template>
	<div class="super-admin-schools">
		<SuperAdminSchoolHead></SuperAdminSchoolHead>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
export default {
name: "Schools",
    components: { SuperAdminSchoolHead }
}
</script>

<style lang="scss" scoped>
	.super-admin-schools {
      width: calc(100% - 96px);
	}
</style>
