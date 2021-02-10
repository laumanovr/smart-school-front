<template>
    <div class="archive-users-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Архивные пользователи</h3>
        </div>
        <div class="select-type">
            <v-select
                class="v-select-item"
                label="Выберите роль"
                :items="roles"
                item-text="title"
                item-value="role"
                v-model="archiveRole"
                @change="changeRole"
            />
        </div>
        <div class="table-content" v-if="archiveStudents.length">
            <table class="table bordered">
                <thead>
                <tr>
                    <th>№</th>
                    <th>ФИО</th>
                    <th>Класс</th>
                    <th>Дата рождения</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(student, i) in archiveStudents" :key="student.id">
                    <td>{{ i + 1 }}</td>
                    <td>{{ student.surname +' '+ student.name }}</td>
                    <td>{{ student.classTitle }}</td>
                    <td>{{ formatDOB(student.dateOfBirth) }}</td>
                    <td><button class="activate" @click="activateStudent(true, student)">Активировать</button></td>
                </tr>
                </tbody>
            </table>
        </div>

        <!--ACTIVATE MODAL-->
        <modal name="activate-modal" height="auto">
            <div class="modal-container">
                <h4>Активировать этого ученика?</h4>
                <div class="btn-actions">
                    <v-btn color="red" @click="toggleActivateModal">Отмена</v-btn>
                    <v-btn color="green" @click="activateStudent(false)">Активировать</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import {StudentService} from '@/_services/student.service';
    const studentService = new StudentService();
    import PreLoader from '@/components/preloader/PreLoader';
    import moment from 'moment';

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                isLoading: false,
                archiveRole: '',
                selectedStudent: {},
                archiveStudents: [],
                archiveTeachers: [],
                roles: [
                    {title: 'Архивные ученики', role: 'student'},
                ]
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            },
            currentLang() {
                return this.$root.$i18n.locale;
            }
        },
        mounted() {
            this.archiveRole = 'student';
            this.changeRole(this.archiveRole);
        },
        methods: {
            changeRole(role) {
                if (role === 'student') {
                    this.fetchArchiveStudents();
                }
            },

            formatDOB(date) {
                return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
            },

            fetchArchiveStudents() {
                this.isLoading = true;
                studentService.getAllBySchool(this.school.id, '', true).then((res) => {
                    this.archiveStudents = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            toggleActivateModal() {
                this.$modal.toggle('activate-modal');
            },

            activateStudent(confirm, student) {
                if (confirm) {
                    this.selectedStudent = student;
                    this.toggleActivateModal();
                } else {
                    this.isLoading = true;
                    studentService.activate(this.selectedStudent.id).then(() => {
                        this.changeRole(this.archiveRole);
                        this.toggleActivateModal();
                        this.$toast.success('Успешно активирован!');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },
        }

    }
</script>

<style lang="scss">
    .archive-users-container {
        margin: 20px 20px 60px 20px;
        .activate {
            font-size: 14px;
            color: #fff;
            border-radius: 4px;
            margin: 6px auto;
            width: 155px;
            cursor: pointer;
            background: #4caf50;
        }
        .table-content {
            table {
                font-weight: bold;
            }
        }
    }
</style>
