<template>
    <div class="search-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Поиск пользователей</h3>
        </div>

        <div class="select-type">
            <v-select
                class="v-select-item"
                label="Выберите тип поиска"
                :items="types"
                item-text="title"
                item-value="value"
                v-model="searchType"
                @change="changeType"
            />
        </div>

        <div class="search-content">
            <div class="search-user" v-if="searchType == 'generalSearch'">
                <v-form ref="userForm">
                    <v-text-field label="Фамилия" placeholder="Фамилия" v-model="userSearch.lastName" :rules="required"/>
                    <v-text-field label="Имя" placeholder="Имя" v-model="userSearch.firstName"/>
                    <v-btn color="primary" @click="searchUsersByFio">Поиск</v-btn>
                </v-form>
                <table class="table bordered" v-if="foundUsers.length">
                    <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Роль</th>
                        <th>Логин</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="user in foundUsers" :key="user.id">
                        <td>{{ user.lastName + ' ' + user.firstName }}</td>
                        <td>{{ roleObj[user.roleCode] }}</td>
                        <td>{{ user.username }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="search-user" v-if="searchType == 'studentSearch'">
                <v-form ref="studentForm" @submit.prevent="searchStudentsByPin">
                    <v-text-field
                        label="ПИН"
                        placeholder="Введите ПИН ученика"
                        v-model="student.searchPin"
                        :rules="pinRule"
                        type="number"
                        counter="14"
                        @input="limitNumbers(student, 'searchPin', 14)"
                    />
                    <v-btn color="primary" @click="searchStudentsByPin">Поиск</v-btn>
                </v-form>
                <table class="table bordered" v-if="foundStudent.studentDetailDTO">
                    <thead>
                    <tr>
                        <th>ФИО</th>
                        <th>Школа</th>
                        <th>Класс</th>
                        <th>В архиве</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{ foundStudent.studentDetailDTO.surname + ' ' + foundStudent.studentDetailDTO.name }}</td>
                        <td>{{ foundStudent.schools[0].schoolTitle }}</td>
                        <td>{{ foundStudent.studentDetailDTO.classTitle }}</td>
                        <td>{{ foundStudent.studentDetailDTO.archived ? 'Да' : 'Нет' }}</td>
                        <td>
                            <div
                                v-if="foundStudent.studentDetailDTO.archived"
                                class="action-btn extract"
                                @click="activateStudent(true)"
                            >
                                Активировать
                            </div>
                            <div
                                class="action-btn change-school"
                                @click="toggleChangeSchoolModal"
                            >
                                Сменить школу
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
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

        <!--CHANGE SCHOOL MODAL-->
        <modal name="change-school-modal">
            <div class="modal-container">
                <h4>Поменять школу ученика</h4>
                <v-form ref="changeSchoolForm">
                    <v-autocomplete
                        :items="schools"
                        item-text="name"
                        item-value="id"
                        label="Выберите другую школу"
                        v-model="changeSchoolObj.schoolId"
                        clearable
                        hide-no-data
                        :rules="required"
                        :loading="schoolLoader"
                        :search-input.sync="searchSchool"
                        @change="onSelectSchool"
                    />
                    <v-select
                        :items="schoolClasses"
                        item-text="classTitle"
                        item-value="id"
                        label="Выберите класс"
                        :rules="required"
                        v-model="changeSchoolObj.classId"
                    />
                </v-form>
                <div class="btn-actions">
                    <v-btn color="red" @click="toggleChangeSchoolModal">Отмена</v-btn>
                    <v-btn color="green" @click="submitChangeSchool">Сохранить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import {StudentService} from "@/_services/student.service";
    const studentService = new StudentService();
    import {userService} from '@/_services/user.service';
    import {SchoolService} from '@/_services/school.service';
    const schoolService = new SchoolService();
    import PreLoader from '@/components/preloader/PreLoader';
    import {limitNumbers} from '@/utils/limit-numbers';
    import SchoolClassService from '@/_services/school-class.service';

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                student: {
                    searchPin: '',
                },
                userSearch: {
                    firstName: '',
                    lastName: '',
                    middleName: ''
                },
                changeSchoolObj: {
                    active: true,
                    classId: 0,
                    schoolId: 0,
                    studentId: 0,
                    comeBy: '',
                    leaveBy: '',
                    studentMoveType: 'COME'
                },
                studentClassObj: {
                    active: true,
                    chronicleId: 0,
                    classId: 0,
                    studentId: 0
                },
                types: [
                    {title: 'Поиск учеников по ПИН', value: 'studentSearch'},
                    {title: 'Общий поиск по ФИО', value: 'generalSearch'}
                ],
                roleObj: {
                    'ROLE_ADMIN': 'Админ школы',
                    'ROLE_STUDENT': 'Ученик',
                    'ROLE_INSTRUCTOR': 'Учитель',
                    'ROLE_PARENT': 'Родитель',
                    'ROLE_RAYON_HEADER': 'Районо',
                    'ROLE_DIRECTOR': 'Директор',
                    'ROLE_MIN_EDUCATION': 'Минобраз'
                },
                required: [v => !!v || this.$t('required')],
                pinRule: [
                    v => !!v || this.$t('required'),
                    v => ( v && v.length >= 14 ) || 'Должно быть 14 цифр'
                ],
                isLoading: false,
                searchType: '',
                schools: [],
                schoolClasses: [],
                foundUsers: [],
                foundStudent: {},
                selectedSchool: {},
                typingTimer: null,
                isTimerBlocked: false,
                schoolLoader: false,
                searchSchool: '',
            }
        },
        methods: {
            limitNumbers: limitNumbers,

            getAllSchools(searchQuery = '') {
                schoolService.listPageable(0, '', '', searchQuery).then((res) => {
                    if (res._embedded) {
                        this.schools = res._embedded.schoolResourceList;
                    }
                    this.schoolLoader = false;
                });
            },

            onSelectSchool(schoolId) {
                if (schoolId) {
                    this.selectedSchool = this.schools.find((i) => i.id === schoolId);
                    this.isTimerBlocked = true;
                    SchoolClassService.getAllBySchool(schoolId).then((res) => {
                        this.schoolClasses = res.map((klass) => {
                            klass.classTitle = klass.classLevel + klass.classLabel;
                            return klass;
                        });
                    }).catch((err) => {
                        this.$toast.error(err);
                    });
                    setTimeout(() => {
                        this.isTimerBlocked = false;
                    }, 2000);
                }
            },

            changeType() {
                this.foundUsers = [];
                this.foundStudent = {};
                this.student.searchPin = '';
                this.userSearch.lastName = '';
                this.userSearch.firstName = '';
                this.$nextTick(() => {
                    if (this.$refs.studentForm) {
                        this.$refs.studentForm.reset();
                    }
                    if (this.$refs.userForm) {
                        this.$refs.userForm.reset();
                    }
                });
            },

            searchStudentsByPin() {
                if (this.$refs.studentForm.validate()) {
                    this.isLoading = true;
                    studentService.getByPin(this.student.searchPin).then((res) => {
                        this.foundStudent = res;
                        this.isLoading = false;
                        if (!res.studentDetailDTO) {
                            this.$toast.info('Ничего не найдено!');
                        }
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            searchUsersByFio() {
                this.userSearch.lastName = this.userSearch.lastName ? this.userSearch.lastName.trim() : '';
                this.userSearch.firstName = this.userSearch.firstName ? this.userSearch.firstName.trim() : '';
                setTimeout(() => {
                    if (this.$refs.userForm.validate()) {
                        this.isLoading = true;
                        userService.searchUser(this.userSearch).then((res) => {
                            this.foundUsers = res;
                            this.isLoading = false;
                            if (!res.length) {
                                this.$toast.info('Ничего не найдено!');
                            }
                        }).catch((err) => {
                            this.$toast.error(err);
                            this.isLoading = false;
                        });
                    }
                });
            },

            toggleActivateModal() {
                this.$modal.toggle('activate-modal');
            },

            activateStudent(confirm) {
                if (confirm) {
                    this.toggleActivateModal();
                } else {
                    this.isLoading = true;
                    studentService.activate(this.foundStudent.studentDetailDTO.id).then(() => {
                        this.toggleActivateModal();
                        this.searchStudentsByPin();
                        this.$toast.success('Успешно активирован!');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            toggleChangeSchoolModal() {
                this.changeSchoolObj.schoolId = '';
                this.changeSchoolObj.classId = '';
                this.$modal.toggle('change-school-modal');
            },

            submitChangeSchool() {
                if (this.$refs.changeSchoolForm.validate()) {
                    this.isLoading = true;
                    this.changeSchoolObj.studentId = this.foundStudent.studentDetailDTO.id;
                    studentService.changeSchool(this.foundStudent.schools[0].id, this.changeSchoolObj).then((res) => {
                        this.createStudentClassLog();
                        this.searchStudentsByPin();
                        this.toggleChangeSchoolModal();
                        this.$toast.success('Школа успешно заменена!');
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            async createStudentClassLog() {
                this.studentClassObj.studentId = this.changeSchoolObj.studentId;
                this.studentClassObj.classId = this.changeSchoolObj.classId;
                this.studentClassObj.chronicleId = this.selectedSchool.chronicleId;
                await studentService.studentClassCreate(this.studentClassObj);
            }
        },

        watch: {
            searchSchool(inputValue) {
                clearTimeout(this.typingTimer);
                this.typingTimer = null;
                if (!this.isTimerBlocked) {
                    this.schoolLoader = true;
                    this.typingTimer = setTimeout(() => {
                        this.getAllSchools(inputValue || '');
                    }, 1000);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .search-container {
        margin: 20px 20px 60px 20px;
        .v-select-item {
            max-width: 240px;
        }
        .search-user {
            background: #fff;
            padding-top: 15px;
            .v-form {
                display: flex;
                align-items: center;
                justify-content: center;
                .v-text-field {
                    max-width: 250px;
                    margin-right: 10px;
                }
                button {
                    height: 30px;
                }
            }
            table {
                margin-top: 10px;
                td {
                    font-weight: bold;
                }
                .action-btn {
                    font-size: 14px;
                    color: #fff;
                    border-radius: 4px;
                    margin: 6px auto;
                    width: 155px;
                    cursor: pointer;
                    &.extract {
                        background: #0dc301;
                    }
                    &.change-school {
                        background: #2196F3;
                    }
                }
            }
        }
    }
</style>
