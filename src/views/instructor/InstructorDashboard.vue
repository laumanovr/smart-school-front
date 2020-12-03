<template>
	<div class="instructor-dashboard">
		<!--<div class="instructor-dashboard__schedule">-->
			<!--<img src="../../assets/images/temporary/instructor-schedule.svg">-->
		<!--</div>-->
		<!--<div class="instructor-dashboard__stat stat">-->
			<!--<div class="stat__my-class">-->
				<!--<img alt="" src="../../assets/images/temporary/my-class-chart.svg">-->
			<!--</div>-->
			<!--<div class="stat__students">-->
				<!--<img src="../../assets/images/temporary/student-stats.svg" alt="">-->
			<!--</div>-->
		<!--</div>-->
	</div>
</template>

<script>
export default {
	name: "InstructorDashboard",
    beforeCreate() {
	    this.$router.push('/instructor/journal-grade');
    }
}
</script>

<style lang="scss" scoped>
	.instructor-dashboard {
		display: flex;

		&__stat {

		}
	}
</style>
