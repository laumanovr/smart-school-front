<template>
    <div class="students-container">
	    <pre-loader v-if="isLoading"></pre-loader>
        <SuperAdminSchoolHead>
            <template v-slot:title>Ученики</template>
            <template v-slot:center>
                <SmartButton @clicked="onAddStudent">
                    Добавить ученика <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartBtn2 @onClick="isAddFile = true">
                    Импорт <img style="padding-bottom: 5px" src="../../assets/images/icons/import.svg" alt="">
                </SmartBtn2>
                <ExcelJs :rows="exportRows" :file-name="exportName" :headers="exportHeaders"></ExcelJs>
                <SmartBtn2 @onClick="downloadTemplate">
                    Загрузить шаблон <img src="../../assets/images/icons/download.svg" alt="">
                </SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="students"
            :total-elements="totalElements"
            :page-size="pageSize"
            :current-page="currentPage"
            menu="Students"
            @deleteStudents="onMassDelete"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
            <template v-slot:firstItem>
                <SmartSelect>Класс <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Буква <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Пол <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartButton @clicked="openAddCourseModal">Добавить предмет</SmartButton>
            </template>
            <template v-slot:head>
	            <th class="top-th"><input type="checkbox" v-model="isSelectAll" @click="selectAll"></th>
	            <th>ID</th>
                <th>Ф.И.О</th>
                <th>Класс</th>
                <th>Пол</th>
                <th>Дата рождения</th>
                <th></th>
                <th></th>
                <th></th>
            </template>

            <template v-slot:body="{ item }">
	            <td><input type="checkbox"  @change="onSelect(item)" v-model="item.checked"></td>
	            <td>{{ item.index + 1 }}</td>
                <td>{{ item.name }} {{ item.surname }}</td>
                <td>{{ item.classTitle }}</td>
                <td>{{ item.gender === 0 ? 'М' : 'Ж' }}</td>
                <td>{{ item.dateOfBirth }}</td>
                <td><InfoIcon @click="showDetailInfo(item.id)"/></td>
                <td><img class="clickable-icons" @click="onEditStudent(item)" src="../../assets/images/icons/pen.svg" alt=""></td>
                <td><img class="clickable-icons" @click="onDeleteStudent(item)" src="../../assets/images/icons/trash.svg" alt=""></td>
            </template>
        </SmartTable>
        <v-dialog v-if="isAddStudentModal" v-model="isAddStudentModal" width="546" id="add-form">
            <v-form @submit.prevent="submitStudent" ref="form">
                <div class="form-head">
                    <span v-if="!isStudentEdit">Добавить ученика</span>
                    <span v-else>Редактировать ученика</span>
                    <img src="../../assets/images/profile-icon.svg" alt="">
                    <button class="profile-edit">
                        <img src="../../assets/images/icons/edit.svg">
                    </button>
                </div>

                <div>
                    <v-text-field v-model="studentObj.name" :rules="required" label="Имя"></v-text-field>
                    <v-text-field v-model="studentObj.surname" :rules="required" label="Фамилия"></v-text-field>
                    <v-text-field v-model="studentObj.middleName" :rules="required" label="Отчество"></v-text-field>
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
                        item-value="id"
                        label="Класс"
                        v-model="studentObj.classId"
                    >
                    </v-select>
                </div>

                <div class="spacer">
                    <v-text-field type="number" v-model="studentObj.phone" label="Номер телефона"></v-text-field>
                </div>

                <div>
                    <v-text-field  label="Имя родителя" v-model="parentPersonObj.name"></v-text-field>
                </div>

                <div>
                    <v-text-field type="number" label="Телефон родителя" v-model="parentPersonObj.phone"></v-text-field>
                </div>

                <div class="form-footer">
                    <v-btn type="submit" color="primary">Сохранить</v-btn>
                    <v-btn @click="isAddStudentModal=false">Отменить</v-btn>
                </div>
            </v-form>
        </v-dialog>
        <v-dialog
            max-width="450"
            v-model="isDeleting"
        >
            <DeletePopup @cancel="isDeleting = false" @accept="deleteStudent"></DeletePopup>
        </v-dialog>
	    <v-dialog
		    max-width="450"
		    v-model="isMassDeleting"
	    >
		    <DeletePopup @cancel="isMassDeleting = false" @accept="massDelete"></DeletePopup>
	    </v-dialog>
        <v-dialog v-if="isAddFile" v-model="isAddFile" width="546" id="add-file">
            <ImportFile @submit="onSubmit"></ImportFile>
        </v-dialog>

        <v-dialog v-model="showDetailModal" width="546">
            <v-form>
                <div class="form-head">
                    <h2>Полная информация</h2>
                </div>
                <v-text-field type="text" label="Логин и Пароль" v-model="studentDetail.username" readonly/>
                <v-text-field type="text" label="Имя" v-model="studentDetail.name" readonly/>
                <v-text-field type="text" label="Фамилия" v-model="studentDetail.surname" readonly/>
                <v-text-field type="text" label="Телефон" v-model="studentDetail.phone" readonly/>
                <template v-for="course in studentDetail.courses">
                    <v-text-field type="text" label="Предмет" :value="course.courseName + '-' + course.instructorTitle" readonly/>
                </template>
                <v-text-field type="text" label="Имя родителя" readonly/>
                <v-btn @click="showDetailModal = false" color="primary">Закрыть</v-btn>
            </v-form>
        </v-dialog>

        <!--ADD COURSE MODAL-->
        <modal name="course-modal">
            <div class="modal-container">
            <h4>Добавить предмет</h4>
            <div>
                <v-select
                    :rules="required"
                    :items="students"
                    item-text="classTitle"
                    item-value="classId"
                    label="Класс"
                    v-model="studentObj.classId"
                >
                </v-select>
            </div>
            <div>
                <v-select
                    :rules="required"
                    :items="instrCourses"
                    :item-text="showCourseName"
                    label="Предмет"
                    v-model="instrCourseObj"
                    return-object
                >
                </v-select>
            </div>
                <div class="btn-actions">
                    <v-btn color="primary" @click="submitAddCourseToStudents">Сохранить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import SmartTable from '@/components/table/SmartTable';
    import SmartButton from '@/components/button/SmartButton';
    import SmartSearchInput from '@/components/input/SmartSearchInput';
    import SmartBtn2 from '@/components/button/SmartBtn2';
    import SmartSelect from '@/components/select/SmartSelect';
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
    import ImportFile from "@/components/import-file/ImportFile";
    const studentParentService = new StudentParentService();
    import { FileImportService } from "@/_services/file-import.service";
    import DeletePopup from "@/components/delete-popup/DeletePopup";
    const fileImportService = new FileImportService();
    import SchoolClassService from '@/_services/school-class.service';
    import PreLoader from "@/components/preloader/PreLoader";
    import {InstructorCourseService} from '@/_services/instructor-course.service';
    const instructorCourseService = new InstructorCourseService();
    import StudentCourseService from '@/_services/student-course.service';
    import {AdminCourseService} from '@/_services/admin-course.service';
    const adminCourseService = new AdminCourseService();
    import InfoIcon from '@/components/icons/InfoIcon';

    export default {
        components: {
	        PreLoader,
            DeletePopup,
            ImportFile,
            ExcelJs,
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable,
            InfoIcon
        },

        data() {
            return {
                isAddFile: false,
	            isMassDeleting: false,
	            isSelectAll: false,
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
                    middleName: 'middleName',
                    name: '',
                    password: '',
                    phone: '',
                    roles: [],
                    schoolId: 0,
                    surname: 'surname',
                    username: ''
                },
                students: [],
                classes: [],
                required: [v => !!v || 'Input is required'],
                isAddStudentModal: false,
                isStudentEdit: false,
                roles: [],
                languages: [],
                birthday: '2000-2-11',
                menu2: false,
                exportHeaders: [],
                exportRows: [],
                exportName: '',
                currentPage: 1,
                totalElements: 0,
                pageSize: 0,
                isDeleting: false,
                showDetailModal: false,
                studentDetail: {},
                instrCourses: [],
                instrCourseObj: {},
                sendStudentCourses: [],
	            isLoading: false,
                allAdminCourses: []
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
            this.fetchAllAdminCourses();
            this.fetchAllClasses();
            this.fetchRoles();
            this.fetchStudents();
            this.fetchInstructorCourses();
        },

        methods: {
            fetchAllAdminCourses() {
                adminCourseService.list().then((res) => {
                    this.allAdminCourses = res;
                })
            },
            showCourseName(obj) {
                if (obj.courseName) {
                    return this.allAdminCourses.find(course => course.code === obj.courseName).title;
                }
            },

	        onMassDelete () {
	            this.isMassDeleting = true
	        },
            fetchStudents() {
                studentService.getAllBySchool(this.userProfile.schools[0].id).then((res) => {
                    this.totalElements = res.length;
                    this.pageSize = res.length
                    this.students = res.map((i, ind) => {
                    	i.index = ind
	                    return i
                    });
                    this.exportHeaders = ['Ф.И.О', 'Класс', 'Пол', 'Дата рождения', 'Имя Родителя', 'Логин'];
                    this.exportRows = this.students.map(i => {
                        return [`${i.name} ${i.surname}`, i.classTitle, i.gender === 1 ? 'М' : 'Ж', i.dateOfBirth, '', ''];
                    });
                    this.exportName = 'Умная школа: Ученики'
                })
            },

	        selectAll () {
		        this.students = this.students.map(i => {
			        i.checked = !this.isSelectAll
			        return i
		        })
	        },

	        massDelete () {
	        	const ids = this.students.filter(i => i.checked).map(i => i.id)
				this.isLoading = true
		        studentService.massDelete(ids).then(res => {
					this.$toast.success('Успешно!')
			        this.fetchStudents()
			        this.isMassDeleting = false
		        	this.isLoading = false
				}).catch(err => {
			        console.log(err)
			        this.isLoading = false
		        })
	        },

	        onSelect (item) {
            	//  this.students = this.students.map(i => {
                // 	if (i.id === item.id) i.checked = item.checked
	            //     return i
                // })
	        },

            showDetailInfo(studentId) {
                studentService.getDetails(studentId).then((res) => {
                    this.studentDetail = res;
                    StudentCourseService.getByStudentId(studentId).then((res) => {
                        this.studentDetail.courses = res;
                        this.showDetailModal = true;
                    }).catch(err => this.$toast.error(err));
                }).catch(err => this.$toast.error(err));
            },

            openAddCourseModal() {
                this.instrCourseObj = {};
                this.studentObj.classId = '';
                this.sendStudentCourses = [];
                this.$modal.show('course-modal');
            },

            fetchInstructorCourses() {
                instructorCourseService.listBySchool(this.userProfile.schools[0].id).then((res) => {
                    if (res._embedded) {
                        this.instrCourses = res._embedded.instructorCourseResourceList
                    }
                })
            },

            submitAddCourseToStudents() {
                this.students.filter(student => student.classId === this.studentObj.classId).forEach((student) => {
                    let studentCourse = {
                        archived: false,
                        chronicleId: this.studentObj.chronicleYearId,
                        classId: this.studentObj.classId,
                        courseId: this.instrCourseObj.courseId,
                        instructorId: this.instrCourseObj.instructorId,
                        studentId: student.id
                    };
                    this.sendStudentCourses.push(studentCourse)
                });
                StudentCourseService.createBatch(this.sendStudentCourses).then(() => {
                    this.$modal.hide('course-modal');
                    this.$toast.success('Успешно добавлены');
                }).catch(err => this.$toast.error(err));
            },

            downloadTemplate () {
                const a = document.createElement('a');
                a.download = 'Шаблон импорта Учеников.xlsx'
                a.href = '/docs/Шаблон_Окуучу.xlsx'
                a.click()
            },

            onDeleteStudent(item) {
                this.studentObj = item;
                this.isDeleting = true
            },

            deleteStudent () {
                studentService._delete(this.studentObj.id).then(res => {
                    this.isDeleting = false
                    this.$toast.success('Успешно')
                    this.fetchStudents()
                }).catch(err => {
                    console.log(err);
                    this.$toast.error(err);
                    this.isDeleting = false
                })
            },

            onAddStudent () {
                this.isAddStudentModal = true;
                this.isStudentEdit = false;
                this.studentObj = {};
            },

            onEditStudent(item) {
                this.studentObj.classId = item.classId;
                this.studentObj.name = item.name;
                this.studentObj.surname = item.surname;
                this.studentObj.id = item.id;
                this.studentObj.gender = item.gender === 0 ? 'MALE' : 'FEMALE';
                this.isAddStudentModal = true
                this.isStudentEdit = true
            },

            fetchRoles () {
                roleService.listPageable(0).then(res => {
                    this.roles = res;
                }).catch(err => console.log(err));
            },

            fetchAllClasses() {
                SchoolClassService.getAllBySchool(this.userProfile.schools[0].id).then((res) => {
                    this.classes = res.map(i => {
                        i.classTitle = `${i.classLevel} ${i.classLabel}`;
                        return i;
                    });
                })
            },

            submitStudent() {
                this.studentObj.schoolId = this.userProfile.schools[0].id;
                this.studentObj.chronicleYearId = this.userProfile.schools[0].chronicleId;
                this.studentObj.dateOfBirth = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY');
                this.studentObj.roles = this.roles.filter(i => i.code === 'ROLE_STUDENT').map(i => i.id);
                const d = {
                	classId: this.studentObj.classId,
	                dateOfBirth: this.studentObj.dateOfBirth,
	                name: this.studentObj.name,
	                surname: this.studentObj.surname,
	                middleName: this.studentObj.middleName,
	                gender: this.studentObj.gender,
	                id: this.studentObj.id
                }
                if (this.isStudentEdit) {
                    studentService.edit(d).then(res => {
                        this.$toast.success('Успешно')
                        this.isAddStudentModal = false
                        this.fetchStudents()
                    }).catch(err => console.log(err));
                } else
                    studentService.create(this.studentObj).then((res) => {
                    let studentId = parseInt(res.message);
                    this.studentClassObj.classId = this.studentObj.classId;
                    this.studentClassObj.studentId = studentId;

                    studentClassService.create(this.studentClassObj).then((res) => {
                        this.fetchStudents();
                        this.isAddStudentModal = false;
                        this.$toast.success('Успешно');
                    }).catch(err => {
                        this.$toast.error(err);
                        console.log(err);
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
                            this.$toast.error(err);
                            console.log(err);
                        })
                    }).catch(err => {
                        this.$toast.error(err);
                        console.log(err);
                    })
                })
            },

            onLeftClick () {
                this.currentPage--;
                this.fetchStudents(this.currentPage - 1);
            },
            onRightClick () {
                this.currentPage++;
                this.fetchStudents(this.currentPage - 1);
            },
            onSubmit (data) {
            	this.isLoading = true
                const d = {
                    chronicleId: data.chronicleId,
                    languageId: data.languageId,
                    file: data.file,
                    schoolId: this.userProfile.schools[0].id
                };
                if (data.isIsouMode) {
	                fileImportService.importIsouStudent(d).then(res => {
		                this.$toast.success('Успешно!')
		                this.isAddFile = false;
		                this.fetchStudents();
		                this.isLoading = false
	                }).catch(err => {
		                this.isLoading = false
		                this.$toast.error(err)
	                	console.log(err)
	                });
                } else {
	                fileImportService.importStudent(d).then(res => {
		                this.$toast.success('Успешно!')
		                this.isAddFile = false;
		                this.fetchStudents();
		                this.isLoading = false
	                }).catch(err => {
		                this.$toast.error(err)
		                this.isLoading = false
	                	console.log(err)
	                });
                }
            }
        }
    }
</script>

<style lang="scss">
    .v-form {
        background: #FFFFFF;
        border-radius: 7px;
        padding: 20px 40px;

        > div.form-head {
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
    .top-th {
	    width: 60px;
    }
</style>
