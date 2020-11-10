<template>
    <div class="admin-course-container">
        <v-form @submit.prevent="submit" ref="form">
            <h3>{{isEdit ? 'Редактировать предмет' : 'Добавить предмет'}}</h3>
            <div>
                <v-text-field :rules="required" v-model="course.title" label="На русском"/>
            </div>
            <div>
                <v-text-field :rules="required" v-model.trim="course.courseTitleKG" label="На кыргызском"/>
            </div>
            <div>
                <v-text-field :rules="required" v-model.trim="course.code" label="На английском"/>
            </div>
            <v-select
                :items="classTypes"
                item-text="title"
                item-value="type"
                label="Классы"
                v-model="course.classType"
            />
            <v-select
                :items="languages"
                item-text="title"
                item-value="type"
                label="Язык обучения"
                v-model="course.languageCode"
            />
            <div class="form-footer">
                <div class="btn-actions">
                    <v-btn color="red" @click="$emit('close')">Отменить</v-btn>
                    <v-btn type="submit" color="green">Сохранить</v-btn>
                </div>
            </div>
        </v-form>
    </div>
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
        },
        classTypes: Array,
        languages: Array
    },
	data: () => ({
		required: [
            v => !!v || 'поле обязательно для заполнения',
		],
		course: {
            title: '',
            code: '',
            courseTitleKG: '',
            classType: '',
            languageCode: ''
        }
	}),
    mounted() {
	    if (this.isEdit) this.course = {
            id: this.editCourse.id,
            title: this.editCourse.title,
            code: this.editCourse.code,
            courseTitleKG: this.editCourse.courseTitleKG,
            classType: this.editCourse.classType,
            languageCode: this.editCourse.languageCode
        }
    },
    methods: {
	    submit () {
            if (this.$refs.form.validate()) {
	            if (this.isEdit) {
                    adminCourseService.edit(this.course).then(() => {
                        this.$toast.success('Успешно обновлено');
                        this.$emit('close');
                    }).catch((err) => {
                        this.$toast.error(err);
                    });
                } else {
                    adminCourseService.create(this.course).then(() => {
                        this.$toast.success('Успешно создано');
                        this.$emit('close');
                    }).catch((err) => {
                        this.$toast.error(err);
                    });
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

	  div.form-head {
	    display: flex;
	    justify-content: space-around;
	  }
	}
</style>
