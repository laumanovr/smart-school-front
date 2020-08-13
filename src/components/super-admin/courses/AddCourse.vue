<template>
	<v-form @submit.prevent="submit" ref="form">
		<div>
			<v-text-field :rules="required" v-model="course.title" label="Название"></v-text-field>
		</div>
		<div>
			<v-text-field :rules="required" v-model="course.code" label="Код"></v-text-field>
		</div>
		<div>
			<v-textarea
					v-model="course.description"
					outlined
					name="input-7-4"
					label="Описание"
			></v-textarea>
		</div>
		<div class="form-footer">
			<v-btn type="submit" color="primary">Сохранить</v-btn>
			<v-btn @click="$emit('close')">Отменить</v-btn>
		</div>
	</v-form>
</template>

<script>
import { AdminCourseService } from '@/_services/admin-course.service'

const adminCourseService = new AdminCourseService();

export default {
	name: "AddCourse",
    props: {
	    isEdit: {
	        type: Boolean,
            default: false
        },
        editCourse: {
	        type: Object,
            default: {}
        }
    },
	data: () => ({
		required: [
            v => !!v || 'поле обязательно для заполнения',
		],
		course: {}
	}),
    mounted() {
	    if (this.isEdit) this.course = {
	        code: this.editCourse.code,
            description: this.editCourse.description,
            title: this.editCourse.title,
            id: this.editCourse.id
        };
    },
    methods: {
	    submit () {
	        if (this.$refs.form.validate()) {
	            if (this.isEdit) {
                    adminCourseService.edit(this.course).then(res => {
                        this.$toast.success('Successfully updated');
                        this.$emit('close');
                    }).catch(err => console.log(err));
                } else {
                    adminCourseService.create(this.course).then(res => {
                        this.$toast.success('Successfully created');
                        this.$emit('close');
                    }).catch(err => console.log(err));
                }
            }
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
