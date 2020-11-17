<template>
    <div class="admin-course-container">
        <PreLoader v-if="isLoading"/>

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
import PreLoader from '@/components/preloader/PreLoader';

export default {
	name: "AddCourse",
    components: {
        PreLoader
    },
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
    },
	data: () => ({
		required: [v => !!v || 'поле обязательно для заполнения'],
        isLoading: false,
		course: {
            title: '',
            code: '',
            courseTitleKG: '',
            classType: '',
        }
	}),
    mounted() {
	    if (this.isEdit) this.course = {
            id: this.editCourse.id,
            title: this.editCourse.title,
            code: this.editCourse.code,
            courseTitleKG: this.editCourse.courseTitleKG,
            classType: this.editCourse.classType,
        }
    },
    methods: {
	    submit () {
            if (this.$refs.form.validate()) {
                this.isLoading = true;
	            if (this.isEdit) {
                    adminCourseService.edit(this.course).then(() => {
                        this.$toast.success('Успешно обновлено');
                        this.$emit('close');
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                } else {
                    adminCourseService.create(this.course).then(() => {
                        this.$toast.success('Успешно создано');
                        this.$emit('close');
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
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
