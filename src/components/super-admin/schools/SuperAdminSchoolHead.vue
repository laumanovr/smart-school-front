<template>
	<div class="school-admin-school-head">
		<div class="school-admin-school-head__item school-admin-head__title">
			<slot name="title"></slot>
		</div>
		<div class="school-admin-school-head__item">
			<slot name="center"></slot>
		</div>
		<div class="school-admin-school-head__item">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
export default {
  name: 'SuperAdminSchoolHead'
}
</script>
<style lang="scss" scoped>
	* {
      font-family: Helvetica,sans-serif;
      font-style: normal;
	}
	.school-admin-school-head {
	  display: flex;
	  justify-content: space-between;
	  margin: 30px 30px;

	  &__item {
	    display: flex;
	    align-items: center;
          div {
              margin: 0 10px;
          }
	    .v-btn{
	      margin: 0 20px;
	    }
        &.school-admin-head__title {
          font-weight: bold;
          font-size: 28px;
          line-height: 48px;
          color: #333333;
        }
	  }

	}
</style>
