<template>
    <div class="instructor-grade-reason">
        <ClassSelectHeader
            :headTitle="'Типы оценок'"
            :showClass="true"
            @sendData="getInstructorClasses"
            @classSelected="onChangeClass"
        />
        <div class="header-title">
            <v-btn color="primary" @click="openGradeReasonModal('create', {})">Добавить</v-btn>
        </div>

        <table class="table bordered reason" v-if="gradeReasons.length">
            <thead>
                <tr>
                    <th>Название</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="reason in gradeReasons" :key="reason.id">
                    <td>{{ reason.title }}</td>
                    <td>
                        <span class="material-icons edit" @click="openGradeReasonModal('edit', reason)">edit</span>
                        <span class="material-icons delete"></span>
                    </td>
                </tr>
            </tbody>
        </table>

        <!--GRADE REASON MODAL-->
        <modal name="grade-reason-modal">
            <div class="modal-container">
                <h4>{{mode == 'create' ? 'Добавить тип' : 'Редактировать'}}</h4>
                <div>
                    <v-text-field v-model="gradeReasonObj.title" :rules="required" label="Название"/>
                </div>
                <div class="btn-actions">
                    <v-btn color="red" @click="closeReasonModal">Отмена</v-btn>
                    <v-btn color="green" @click="submitSaveReason">Сохранить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import GradeReasonService from '@/_services/grade-reason.service';
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';

    export default {
        components: {
            ClassSelectHeader
        },
        data() {
            return {
                required: [v => !!v || 'Обязательное поле'],
                mode: '',
                gradeReasonObj: {
                    classLevel: 0,
                    courseId: 0,
                    personId: 0,
                    title: ''
                },
                instrClasses: [],
                gradeReasons: [],
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            }
        },

        methods: {
            getInstructorClasses(classes) {
                this.instrClasses = classes;
                this.gradeReasonObj.classLevel = this.instrClasses[0].classLevel;
                this.gradeReasonObj.courseId = this.instrClasses[0].courseId;
                this.gradeReasonObj.personId = this.userProfile.personId;
                this.fetchInstructorGradeReasons();
            },

            fetchInstructorGradeReasons() {
                GradeReasonService.getByInstructor(
                    this.userProfile.personId,
                    this.gradeReasonObj.classLevel,
                    this.gradeReasonObj.courseId
                ).then((res) => {
                    this.gradeReasons = res;
                })
            },

            onChangeClass(klass) {
                this.gradeReasonObj.classLevel = klass.classLevel;
                this.gradeReasonObj.courseId = klass.courseId;
                this.fetchInstructorGradeReasons();
            },

            openGradeReasonModal(mode, reasonObj) {
                this.mode = mode;
                if (mode === 'create') {
                    this.gradeReasonObj.title = '';
                } else {
                    this.gradeReasonObj.title = reasonObj.title;
                    this.gradeReasonObj.id = reasonObj.id;
                }
                this.$modal.show('grade-reason-modal');
            },

            closeReasonModal() {
                this.$modal.hide('grade-reason-modal');
            },

            submitSaveReason() {
                if (this.mode === 'create') {
                    GradeReasonService.create(this.gradeReasonObj).then(() => {
                        this.closeReasonModal();
                        this.$toast.success('Успешно');
                        this.fetchInstructorGradeReasons();
                    }).catch((err) => {
                        this.$toast.error(err);
                    })
                } else {
                    GradeReasonService.update(this.gradeReasonObj).then(() => {
                        this.closeReasonModal();
                        this.$toast.success('Успешно');
                        this.fetchInstructorGradeReasons();
                    }).catch((err) => {
                        this.$toast.error(err);
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .instructor-grade-reason {
        margin: 30px;
        .v-btn__content {
            color: #fff;
        }
        table.reason {
            width: 60%;
            margin: 0 auto;
            th,td {
                padding: 0;
            }
            .edit {
                color: #03A9F4;
                margin-right: 15px;
                cursor: pointer;
            }
            .delete {
                color: red;
                cursor: pointer;
            }
        }
    }
</style>
