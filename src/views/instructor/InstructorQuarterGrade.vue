<template>
	<div class="instructor-quarter-grade">
		<ClassSelectHeader></ClassSelectHeader>
	</div>
</template>

<script>
import ClassSelectHeader from "@/components/instructor/ClassSelectHeader";
export default {
name: "InstructorQuarterGrade",
	components: {ClassSelectHeader}
}
</script>

<style lang="scss" scoped>
	.instructor-quarter-grade {
		padding: 25px;
	}
</style>
