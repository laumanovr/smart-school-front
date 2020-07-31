<template>
	<div class="school-admin-school-head">
		<div class="school-admin-school-head__item title">Школы</div>
		<div class="school-admin-school-head__item">
			<v-btn depressed rounded>Добавить Школу + </v-btn>
			<v-text-field
					label="Искать"
					required
			></v-text-field>
		</div>
		<div class="school-admin-school-head__item">
			<v-btn  depressed rounded>Распечатать</v-btn>
			<v-btn depressed rounded>Экспорт</v-btn>
		</div>
	</div>
</template>

<script>
export default {
	name: "SuperAdminSchoolHead"
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

	    .v-btn{
	      margin: 0 20px;
	    }


	    &.title {
          font-weight: bold;
          font-size: 28px;
          line-height: 48px;
          color: #333333;
	    }

	  }
	}
</style>
