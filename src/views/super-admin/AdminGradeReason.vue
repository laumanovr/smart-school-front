<template>
    <div class="admin-grade-reason-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-block">
            <div class="header-title">
                <h3>Типы оценок</h3>
            </div>
            <v-btn color="primary" @click="openGradeReasonModal('create', {})">Добавить</v-btn>
        </div>

        <table class="table bordered reason">
            <thead>
                <tr>
                    <th class="light-purple">№</th>
                    <th>Предмет</th>
                    <th>Название</th>
                    <th class="blue-light"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(reason, i) in allGradeReasons" :key="reason.id">
                    <td class="light-purple">{{ i + 1 }}</td>
                    <td>{{ reason.adminCourse.title }}</td>
                    <td>{{ reason.title }}</td>
                    <td class="blue-light"><EditIcon @click="openGradeReasonModal('update', reason)"/></td>
                </tr>
            </tbody>
        </table>

        <!--MODAL FOR ADD/EDIT GRADE REASON-->
        <modal name="grade-reason-modal" height="auto">
            <div class="modal-container">
                <v-form ref="reasonForm">
                    <h4>{{mode == 'create' ? 'Добавить тип оценки' : 'Редактировать' }}</h4>
                    <v-select
                        :items="adminCourses"
                        item-text="title"
                        item-value="id"
                        label="Предмет"
                        :rules="required"
                        v-model="gradeReasonObj.adminCourseId"
                    />
                    <v-text-field v-model="gradeReasonObj.title" label="Название" :rules="required"/>
                    <div class="btn-actions">
                        <v-btn color="red" @click="hideReasonModal">Отмена</v-btn>
                        <v-btn color="green" @click="submitGradeReason">Сохранить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>
    </div>
</template>

<script>
    import {AdminCourseService} from '@/_services/admin-course.service';
    const adminCourseService = new AdminCourseService();
    import AdminGradeReasonService from '@/_services/admin-grade-reason.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import EditIcon from '@/components/icons/EditIcon';

    export default {
        components: {
            PreLoader,
            EditIcon
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                gradeReasonObj: {
                    adminCourseId: 0,
                    title: '',
                    classLevel: ''
                },
                isLoading: false,
                mode: '',
                adminCourses: [],
                allGradeReasons: []
            }
        },

        created() {
          this.fetchAdminCourses();
          this.fetchAllAdminGradeReasons();
        },

        methods: {
            fetchAllAdminGradeReasons() {
                this.isLoading = true;
                AdminGradeReasonService.getAll().then((res) => {
                    this.allGradeReasons = res.sort((a, b) => a.adminCourse.title.localeCompare(b.adminCourse.title));
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchAdminCourses() {
                adminCourseService.list().then((res) => {
                    this.adminCourses = res;
                })
            },

            openGradeReasonModal(mode, reasonObj) {
                this.mode = mode;
                if (mode === 'create') {
                    this.gradeReasonObj.title ='';
                    this.gradeReasonObj.classLevel = '';
                    this.gradeReasonObj.adminCourseId = '';
                } else {
                    this.gradeReasonObj.title = reasonObj.title;
                    this.gradeReasonObj.classLevel = reasonObj.classLevel;
                    this.gradeReasonObj.adminCourseId = reasonObj.adminCourse.id;
                    this.gradeReasonObj.id = reasonObj.id;
                }
                this.$modal.show('grade-reason-modal');
            },

            hideReasonModal() {
                this.$modal.hide('grade-reason-modal');
            },

            submitGradeReason() {
                if (this.$refs.reasonForm.validate()) {
                    this.isLoading = true;
                    AdminGradeReasonService[this.mode](this.gradeReasonObj).then(() => {
                        this.$toast.success(this.mode === 'create' ? 'Успешно создано!' : 'Успешно обновлено!');
                        this.hideReasonModal();
                        this.fetchAllAdminGradeReasons();
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .admin-grade-reason-container {
        margin: 30px;
        .header-block {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        table.reason {
            max-width: 1060px;
            margin: 0 auto;
        }
    }
</style>
