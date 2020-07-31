<template>
	<v-form>
		<div class="form-head">
			<span>Добавить Школу</span>
			<img src="../../../assets/images/profile-icon.svg" alt="">
			<button class="profile-edit">
				<img src="../../../assets/images/icons/edit.svg">
			</button>
		</div>
		<div>
			<v-text-field label="Название"></v-text-field>
		</div>
		<div class="spacer">
			<v-text-field label="Email"></v-text-field>
			<v-text-field label="Номер телефона"></v-text-field>
		</div>
		<div>
			<v-text-field label="Адрес"></v-text-field>
		</div>
		<div>
			<v-textarea
					outlined
					name="input-7-4"
					label="Outlined textarea"
					value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
			></v-textarea>
		</div>
		<div>
			<v-select
					:items="items"
					label="Тип Школы"
			></v-select>
		</div>
		<div>
			<v-select
					:items="items"
					label="Язык"
			></v-select>
		</div>
		<div>
			<v-select
					:items="items"
					label="Регион"
			></v-select>
		</div>
		<div>
			<v-select
					:items="items"
					label="Район"
			></v-select>
		</div>
		<div>
			<v-select
					:items="items"
					label="Академический год"
			></v-select>
		</div>
		<div class="form-footer">
			<v-btn color="primary">Сохранить</v-btn>
			<v-btn>Отменить</v-btn>
		</div>
	</v-form>
</template>

<script>
export default {
    name: 'AddSchool'
}
</script>

<style lang="scss" scoped>
	.v-form {
	  background: #FFFFFF;
	  border-radius: 7px;
	  padding: 20px 40px;


	  > div {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;

	    .v-input__v-slot .v-label {
	      color: red !important;
	    }

	    &.spacer {
	      .v-text-field:first-child {
	        margin-right: 20px;
	      }
	    }
	    &.form-head {
	      position: relative;
	      font-weight: normal;
	      font-size: 18px;
	      line-height: 21px;
	      color: #192A3E;

	      .profile-edit {
	        background: #FFFFFF;
	        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
	        width: 24px;
	        height: 24px;
	        border-radius: 50%;
	        position: absolute;
	        right: 0;
	        bottom: 0;

	        img {
	          margin-top: 5px;
	        }
	      }
	    }
	    &.form-footer {
	      justify-content: center;

	      .v-btn:first-child {
	        margin-right: 20px;
	      }
	    }
	  }

}
</style>
