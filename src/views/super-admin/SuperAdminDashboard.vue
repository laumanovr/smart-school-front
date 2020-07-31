<template>
		<div class="dashboard__body">
			<div>
				<img src="../../assets/images/temporary/students.svg" alt="">
				<img src="../../assets/images/temporary/teachers-avg.svg" alt="">
				<img src="../../assets/images/temporary/attendance.svg" alt="">
				<img src="../../assets/images/temporary/homework.svg" alt="">
			</div>
			<div>
				<div>
					<div>
						<img src="../../assets/images/temporary/teacher-active.svg" alt="">
					</div>
					<div>
						<img src="../../assets/images/temporary/lesson-lost.svg" alt="">
						<img src="../../assets/images/temporary/lesson-hours.svg" alt="">
					</div>
				</div>
				<img src="../../assets/images/temporary/std-avg.svg" alt="">
				<img src="../../assets/images/temporary/school-perf.svg" alt="">
			</div>
		</div>
</template>

<script>
export default {
    name: 'SuperAdminManager'
}
</script>

<style lang="scss" scoped>
	.dashboard__body {
	  margin: 20px 0;
	  width: calc(100% - 96px);

	  > div {
	    display: flex;
	    justify-content: space-evenly;
	    margin: 20px 0;
	  }
	  > div:first-child {
	    img {
	      width: 20%;
	    }
	  }
	  > div:last-child {
	    > div {
	      width: 44%;
	      > div:first-child {
	        img {
	          width: 100%;
	        }
	      }
	      div:last-child {
	        display: flex;
	        justify-content: space-between;
	        margin-top: 10px;
	      }
	      img {
	        width: 48%;
	      }
	    }
	    img {
	      width: 20%;
	    }
	  }
	}
</style>
