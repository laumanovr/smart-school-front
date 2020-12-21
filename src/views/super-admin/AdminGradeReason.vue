<template>
    <div class="admin-grade-reason-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-block">
            <div class="header-title">
                <h3>Типы оценок</h3>
            </div>
            <v-btn color="primary" @click="openGradeReasonModal('create', {})">Добавить</v-btn>
        </div>

        <div class="reason-tables" v-for="(item, i) in allGradeReasons" :key="item.id">
            <div class="course-title"><span>{{ item.courseTitle }}</span></div>
            <table class="table bordered reason">
                <tbody>
                <tr v-for="reason in item.reasons">
                    <td>{{ reason.title }}</td>
                    <td>{{ reason.titleKG }}</td>
                    <td class="blue-light">
                        <EditIcon @click="openGradeReasonModal('update', reason)"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

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
                    <v-text-field v-model="gradeReasonObj.title" label="На русском" :rules="required"/>
                    <v-text-field v-model="gradeReasonObj.titleKG" label="На кыргызском" :rules="required"/>
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
                    titleKG: '',
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
                this.allGradeReasons = [];
                this.isLoading = true;
                AdminGradeReasonService.getAll().then((res) => {
                    Object.entries(res.reduce((obj, el) => {
                        obj[el.adminCourse.id] = [...obj[el.adminCourse.id] || [], el];
                        return obj;
                    }, {})).forEach((item, i) => {
                        const reasonObj = {id: i+1, courseTitle: item[1][0].adminCourse.title, reasons: []};
                        item[1].forEach((reason) => {
                            reasonObj.reasons.push(reason);
                        });
                        this.allGradeReasons.push(reasonObj);
                    });
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
                    this.gradeReasonObj.titleKG = '';
                    this.gradeReasonObj.classLevel = '';
                    this.gradeReasonObj.adminCourseId = '';
                } else {
                    this.gradeReasonObj.title = reasonObj.title;
                    this.gradeReasonObj.titleKG = reasonObj.titleKG;
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
        .reason-tables {
            margin-bottom: 25px;
            .course-title {
                max-width: 1020px;
                margin: 0 auto;
                text-align: center;
                background: #fff;
                border: 1px solid #b5b5b5;
                border-bottom: 0;
                color: #444444;
                span {
                    transform: translateX(-40px);
                    display: inline-block;
                }
            }
            table.reason {
                max-width: 1020px;
                margin: 0 auto;
                td {
                    width: 460px;
                    height: 43px;
                }
                .blue-light {
                    width: 100px;
                }
            }
        }
    }
</style>
