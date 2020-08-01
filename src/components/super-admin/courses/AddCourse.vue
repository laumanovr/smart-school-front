<template>
	<v-form @submit.prevent="submit" ref="form">
		<div>
			<v-text-field :rules="required" v-model="course.title" label="Title"></v-text-field>
		</div>
		<div>
			<v-text-field :rules="required" v-model="course.code" label="Code"></v-text-field>
		</div>
		<div>
			<v-textarea
					v-model="course.description"
					outlined
					name="input-7-4"
					label="Description"
			></v-textarea>
		</div>
		<div class="form-footer">
			<v-btn type="submit" color="primary">Сохранить</v-btn>
			<v-btn>Отменить</v-btn>
		</div>
	</v-form>
</template>

<script>
import { AdminCourseService } from '@/_services/admin-course.service'

const adminCourseService = new AdminCourseService();

export default {
	name: "AddCourse",
	data: () => ({
		required: [
            v => !!v || 'Name is required',
		],
		course: {}
	}),
	methods: {
	    submit () {
			adminCourseService.create(this.course).then(res => {
			    this.$toast.success('Successfully created');
			    this.$emit('close');
			}).catch(err => console.log(err));
	    }
	}
}
</script>

<style lang="scss" scoped>
	.v-form {
	  background: #FFFFFF;
	  border-radius: 7px;
	  padding: 20px 40px;

	  div {
	    display: flex;
	    justify-content: space-around;
	  }
	}
</style>
