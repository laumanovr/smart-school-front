<template>
    <div class="students-container">
        <SuperAdminSchoolHead>
            <template v-slot:title>Студенты</template>
            <template v-slot:center>
                <SmartButton @clicked="isAddStudentModal = true">
                    Добавить ученика <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartBtn2>
                    Импорт <img style="padding-bottom: 5px" src="../../assets/images/icons/import.svg" alt="">
                </SmartBtn2>
                <ExcelJs :rows="exportRows" :file-name="exportName" :headers="exportHeaders"></ExcelJs>
                <SmartBtn2>
                    Загрузить шаблон <img src="../../assets/images/icons/download.svg" alt="">
                </SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="students">
            <template v-slot:firstItem>
                <SmartSelect>Класс <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Буква <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Пол <v-icon>$chevronDown</v-icon></SmartSelect>
            </template>
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Класс</th>
                <!--<th>ID</th>-->
                <th>Пол</th>
                <th>Дата рождения</th>
                <th>Имя Родителя</th>
                <th>Логин</th>
                <!--<th>Телефон Родителя</th>-->
                <th></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.name }}</td>
                <td>{{ item.classTitle }}</td>
                <td>{{ item.gender === 1 ? 'М' : 'Ж' }}</td>
                <td>{{ item.dateOfBirth }}</td>
                <td></td>
                <td></td>
                <td><img src="../../assets/images/icons/pen.svg" alt=""></td>
            </template>
        </SmartTable>
        <v-dialog v-model="isAddStudentModal" width="546" id="add-form">
            <v-form @submit.prevent="submitStudent" ref="form">
                <div class="form-head">
                    <span>Добавить ученика</span>
                    <img src="../../assets/images/profile-icon.svg" alt="">
                    <button class="profile-edit">
                        <img src="../../assets/images/icons/edit.svg">
                    </button>
                </div>

                <div>
                    <v-text-field v-model="studentObj.name" :rules="required" label="ФИО"></v-text-field>
                </div>

                <div>
                    <v-radio-group v-model="studentObj.gender" :rules="required" :mandatory="false" row>
                        <v-radio label="М" value="MALE"></v-radio>
                        <v-radio label="Ж" value="FEMALE"></v-radio>
                    </v-radio-group>
                    <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="birthday"
                                label="Дата рождения"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker v-model="birthday" @input="menu2 = false"></v-date-picker>
                    </v-menu>
                </div>

                <div>
                    <v-select
                        :rules="required"
                        :items="classes"
                        item-text="classTitle"
                        item-value="classId"
                        label="Класс"
                        v-model="studentObj.classId"
                    >
                    </v-select>
                </div>

                <div class="spacer">
                    <v-text-field v-model="studentObj.phone" label="Номер телефона"></v-text-field>
                </div>

                <div>
                    <v-text-field  label="Имя родителя" v-model="parentPersonObj.name"></v-text-field>
                </div>

                <div>
                    <v-text-field  label="Телефон родителя" v-model="parentPersonObj.phone"></v-text-field>
                </div>

                <div class="form-footer">
                    <v-btn type="submit" color="primary">Сохранить</v-btn>
                    <v-btn @click="isAddStudentModal=false">Отменить</v-btn>
                </div>
            </v-form>
        </v-dialog>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import SmartTable from '@/components/table/SmartTable';
    import SmartButton from '@/components/button/SmartButton';
    import SmartSearchInput from '@/components/input/SmartSearchInput';
    import SmartBtn2 from '@/components/button/SmartBtn2';
    import SmartSelect from '@/components/select/SmartSelect';
    import { LanguageService } from '@/_services/language.service';
    const languageService = new LanguageService();
    import { InstructorCourseService } from '@/_services/instructor-course.service'
    const instructorCourseService = new InstructorCourseService();
    import {SchoolClassService} from '@/_services/school-class.service';
    const schoolClassService = new SchoolClassService();
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import {StudentService} from '@/_services/student.service';
    const studentService = new StudentService();
    import moment from 'moment';
    import { RoleService } from '@/_services/role.service'
    const roleService = new RoleService();
    import {StudentClassService} from '@/_services/student-class.service';
    const studentClassService = new StudentClassService();
    import {PersonService} from '@/_services/person.service';
    const personService = new PersonService();
    import {StudentParentService} from '@/_services/student-parent.service';
    import ExcelJs from "@/components/excel-export/ExcelJs";
    const studentParentService = new StudentParentService();

    export default {
        components: {
            ExcelJs,
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable
        },

        data() {
            return {
                studentObj: {
                    address: '',
                    avatar: '',
                    chronicleYearId: 1,
                    classId: 0,
                    comeBy: '',
                    dateOfBirth: '',
                    email: '',
                    enabled: true,
                    gender: '',
                    languageId: '',
                    leaveBy: '',
                    middleName: '',
                    name: '',
                    nationality: '',
                    password: '',
                    phone: '',
                    pin: '',
                    schoolId: 0,
                    surname: '',
                    username: '',
                    roles: [
                        0
                    ],
                },
                studentClassObj: {
                    active: true,
                    chronicleId: 1,
                    classId: 0,
                    studentId: 0
                },
                parentPersonObj: {
                    address: '',
                    avatar: '',
                    dob: '05.05.1980',
                    email: '',
                    enabled: true,
                    gender: 'MALE',
                    job: '',
                    jobPlace: '',
                    languageId: 0,
                    middleName: '',
                    name: '',
                    password: '',
                    phone: '',
                    roles: [],
                    schoolId: 0,
                    surname: '',
                    username: ''
                },
                students: [],
                classes: [],
                required: [v => !!v || 'Input is required'],
                isAddStudentModal: false,
                roles: [],
                languages: [],
                birthday: '2000-2-11',
                menu2: false,
                exportHeaders: [],
                exportRows: [],
                exportName: ''
            }
        },

        computed: {
            userProfile () {
                return this.$store.state.account.profile
            }
        },

        created() {
            this.studentObj.languageId = this.userProfile.schools[0].languageId;
            this.parentPersonObj.languageId = this.userProfile.schools[0].languageId;
            this.parentPersonObj.schoolId = this.userProfile.schools[0].id;
            this.studentObj.chronicleYearId = this.userProfile.schools[0].chronicleId;
            this.studentClassObj.chronicleId = this.userProfile.schools[0].chronicleId;
            this.fetchAllClasses();
            this.fetchRoles();
            this.fetchStudents();
        },

        methods: {
            fetchStudents() {
                studentService.getAllBySchool(this.userProfile.schools[0].id).then((res) => {
                    this.students = res;
                    this.exportHeaders = ['Ф.И.О', 'Класс', 'Пол', 'Дата рождения', 'Имя Родителя', 'Логин'];
                    this.exportRows = this.students.map(i => {
                        return [`${i.name} ${i.surname}`, i.classTitle, i.gender === 1 ? 'М' : 'Ж', i.dateOfBirth, '', ''];
                    });
                    this.exportName = 'Умная школа: Студенты'
                })
            },

            fetchRoles () {
                roleService.listPageable(0).then(res => {
                    this.roles = res;
                }).catch(err => console.log(err));
            },

            fetchAllClasses() {
                instructorClassService.getAllClasses(this.userProfile.schools[0].id).then((res) => {
                    this.classes = res
                })
            },

            submitStudent() {
                this.studentObj.schoolId = this.userProfile.schools[0].id;
                this.studentObj.dateOfBirth = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY');
                this.studentObj.roles = this.roles.filter(i => i.code === 'ROLE_STUDENT').map(i => i.id);
                studentService.create(this.studentObj).then((res) => {
                    let studentId = parseInt(res.message);
                    this.studentClassObj.classId = this.studentObj.classId;
                    this.studentClassObj.studentId = studentId;

                    studentClassService.create(this.studentClassObj).then((res) => {
                        this.fetchStudents();
                        this.isAddStudentModal = false;
                        this.$toast.success('Success message');
                    });

                    this.parentPersonObj.roles = this.roles.filter(i => i.code === 'ROLE_PARENT').map(i => i.id);
                    personService.create(this.parentPersonObj).then((res) => {
                        const studentParent = {
                            personId: parseInt(res.message),
                            parentalType: 'FATHER',
                            studentId: this.studentClassObj.studentId
                        };
                        studentParentService.create(studentParent).then((res) => {
                            console.log(res.message);
                        }).catch(err => {
                            console.log(err);
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .v-form {
        background: #FFFFFF;
        border-radius: 7px;
        padding: 20px 40px;

        > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;

            .v-input--radio-group {
                margin-right: 20px;
            }

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
            &.spacer {
                .v-text-field:first-child {
                    margin-right: 20px;
                }
            }
        }
    }
</style>
