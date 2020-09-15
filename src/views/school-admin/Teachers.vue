<template>
    <div class="school-admin-teachers">
	    <pre-loader v-if="isLoading"></pre-loader>
        <SuperAdminSchoolHead>
            <template v-slot:title>Учителя</template>
            <template v-slot:center>
                <SmartButton @clicked="onAddAdmin">
                    Добавить Учителя <img alt="" src="../../assets/images/icons/add-user.svg">
                </SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartBtn2 @onClick="isAddFile = true">
                    Импорт <img alt="" src="../../assets/images/icons/import.svg" style="padding-bottom: 5px">
                </SmartBtn2>
                <ExcelJs :rows="exportRows" :file-name="exportName" :headers="exportHeaders"></ExcelJs>
                <SmartBtn2 @onClick="downloadTemplate">
                    Загрузить шаблон <img alt="" src="../../assets/images/icons/download.svg">
                </SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="instructors"
            :total-elements="totalElements"
            :totalPages="totalPages"
            :page-size="pageSize"
            :current-page="currentPage"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
            <template v-slot:firstItem>
                <v-select
                    :items="filterSchoolCourses"
                    item-text="courseTitle"
                    item-value="courseCode"
                    label="Фильтр по предмету"
                    class="select-course"
                    @change="filterByCourse"
                ></v-select>
            </template>
            <template v-slot:head>
	            <th>№</th>
                <th>Ф.И.О</th>
                <th>Предмет</th>
                <th>Логин</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
                <th></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ (currentPage - 1) * 10 + item.index + 1 }}</td>
	            <td>{{ item.lastName+' '+item.firstName+' '+checkMiddleName(item.middleName)}}</td>
                <td class="instr-courses">{{ translateCourses(item.courses) }}</td>
                <td>{{ item.username }}</td>
                <td @click="editUser(item)" class="actions"><img alt="" src="../../assets/images/icons/pen.svg"></td>
                <td><CourseIcon @click="addCourseModal(item)"/></td>
            </template>
        </SmartTable>
        <v-dialog
            v-if="isAddUser"
            id="add-form"
            v-model="isAddUser"
            width="546"
        >
            <AddTeacher :is-edit="isEdit" :user="user" @close="onCloseModal"></AddTeacher>
        </v-dialog>
        <v-dialog v-if="isAddFile" v-model="isAddFile" width="546" id="add-file">
            <ImportFile @submit="onSubmit"></ImportFile>
        </v-dialog>

        <!--ADD COURSE MODAL-->
        <modal name="add-course-modal" height="auto">
            <div class="modal-container">
                <div class="course-content">
                    <div class="added">
                        <h4>Добавленные:</h4>
                        <div class="teacher-courses">
                            <div class="course" v-for="(instrCourse, i) in teacherCourses" :key="i">
                                <span>{{ $t(`adminCourses.${instrCourse.courseName}`) }}</span>
                                <DeleteIcon @click="deleteTeacherCourse(instrCourse.id, i)"/>
                            </div>
                        </div>
                    </div>
                    <div class="add-new">
                        <v-form ref="addCourseForm">
                        <div>
                            <v-select
                                :rules="required"
                                :items="schoolCourses"
                                item-text="courseTitle"
                                item-value="id"
                                label="Добавить предмет"
                                v-model="addTeacherCourse.courseId"
                            >
                            </v-select>
                        </div>
                        <div class="btn-actions">
                            <v-btn color="red" @click="$modal.hide('add-course-modal')">Отмена</v-btn>
                            <v-btn color="green" @click="submitAddTeacherCourse">Сохранить</v-btn>
                        </div>
                        </v-form>
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import {InstructorCourseService} from '@/_services/instructor-course.service'
import AddTeacher from '@/components/teacher/AddTeacher'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartBtn2 from '@/components/button/SmartBtn2'
import SmartSelect from '@/components/select/SmartSelect'
import { PersonService } from "@/_services/person.service";
import moment from 'moment'
import ExcelJs from "@/components/excel-export/ExcelJs";
import ImportFile from "@/components/import-file/ImportFile";
import { FileImportService } from "@/_services/file-import.service";
const fileImportService = new FileImportService();
const personService = new PersonService();
const instructorCourseService = new InstructorCourseService();
import InstructorService from "@/_services/instructor.service";
import PreLoader from "@/components/preloader/PreLoader";
import CourseIcon from '@/components/icons/CourseIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import {CourseService} from '@/_services/course.service';
const courseService = new CourseService();

export default {
    name: 'Teachers',
    components: {
	    PreLoader,
        ImportFile,
        ExcelJs,
        CourseIcon,
        DeleteIcon,
        SmartSelect, SmartBtn2, SmartSearchInput, SmartButton, AddTeacher, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        required: [v => !!v || 'Обязательное поле'],
        isAddUser: false,
        instructors: [],
        user: {},
        isEdit: false,
        exportName: '',
        exportRows: [],
        exportHeaders: [],
        isAddFile: false,
        totalElements: 0,
        pageSize: 0,
        currentPage: 1,
	    isLoading: false,
        schoolCourses: [],
        allSchoolCourses: [],
        filterSchoolCourses: [],
        teacherCourses: [],
        totalPages: 1,
        addTeacherCourse: {
            archived: false,
            courseId: 0,
            personId: 0,
            schoolId: 0
        },
        selectedCourseCode: ''
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        },
        school() {
            return this.userProfile.schools[0];
        }
    },
    async mounted() {
        this.addTeacherCourse.schoolId = this.userProfile.schools[0].id;
        this.fetchInstructors();
        this.fetchSchoolCourses();
    },
    methods: {
        fetchInstructors(page = 0, size = 10) {
            this.isLoading = true;
            this.instructors = [];
            InstructorService.list(page, this.school.id, this.selectedCourseCode, size).then((res) => {
                this.totalPages = res.page.totalPages;
                this.totalElements = res.page.totalElements;
                this.pageSize = res.page.size;
                this.currentPage = res.page.number + 1;
                if (res._embedded) {
                    this.instructors = res._embedded.instructorResourceList.map((teacher, i) => ({...teacher, index: i}));
                }
                this.exportHeaders = [
                    'Ф.И.О',
                    'Предмет',
                    'Логин/Пароль'
                ];
                this.exportRows = this.instructors.map((i) => {
                    return [
                        i.lastName+' '+i.firstName+' '+this.checkMiddleName(i.middleName),
                        this.translateCourses(i.courses),
                        i.username
                    ];
                });
                this.exportName = 'Умная школа: Учителя';
                this.isLoading = false;
                console.log(this.currentPage);
            }).catch(err => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },

        filterByCourse(courseCode) {
            if (courseCode) {
                this.selectedCourseCode = courseCode;
                this.fetchInstructors(0);
            } else {
                this.currentPage = 1;
                this.selectedCourseCode = '';
                this.fetchInstructors(0, 1000);
            }
        },

        translateCourses(courses) {
            const translatedArr = [];
            courses.forEach((course) => {
                translatedArr.push(this.$t(`adminCourses.${course}`))
            });
            return translatedArr.join(', ');
        },

        checkMiddleName(middleName) {
            return middleName ? middleName : '';
        },

        fetchSchoolCourses() {
            courseService.listBySchool(this.userProfile.schools[0].id).then((res) => {
                this.schoolCourses = res;
                this.allSchoolCourses = res;
                this.filterSchoolCourses = JSON.parse(JSON.stringify(res.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle))));
                this.filterSchoolCourses.unshift({courseTitle: 'Показать все', courseCode: ''})
            });
        },

        onAddAdmin() {
            this.isAddUser = true;
            this.isEdit = false;
            this.user = {};
        },
        onCloseModal() {
            this.isAddUser = false;
            this.fetchInstructors()
        },
        downloadTemplate () {
            const a = document.createElement('a');
            a.download = 'Шаблон импорта учителя.xlsx';
            a.href = '/docs/Шаблон_Мугалим.xlsx';
            a.click()
        },

        editUser(item) {
            personService.getById(item.id).then(res => {
                this.user = {
                    id: res.id,
                    name: res.firstName,
                    surname: res.lastName,
                    middleName: res.middleName,
                    gender: res.gender,
                    phone: res.phone,
                    courseId: item.courseId,
                    birthday: moment(res.dateOfBirth, 'DD.MM.YYYY').format('YYYY-MM-DD')
                }
                this.isAddUser = true;
                this.isEdit = true;
            }).catch(err => console.log(err));
        },
        onSubmit (data) {
        	this.isLoading = true
            const d = {
                languageId: data.languageId,
                chronicleId: data.chronicleId,
                file: data.file,
                schoolId: this.userProfile.schools[0].id
            };
            if (data.isIsouMode) {
	            fileImportService.importIsouInstructor(d).then(res => {
		            this.$toast.success('Успешно!')
		            this.isAddFile = false;
		            this.fetchInstructors();
		            this.isLoading = false
	            }).catch(err => {
		            this.isLoading = false
	            	console.log(err)
	            });
            } else {
	            fileImportService.importInstructor(d).then(res => {
		            this.$toast.success('Успешно!')
		            this.isAddFile = false;
		            this.fetchInstructors();
		            this.isLoading = false
	            }).catch(err => {
		            this.isLoading = false
	            	console.log(err)
	            });
            }
        },
        onLeftClick () {
            this.currentPage--;
            this.fetchInstructors(this.currentPage - 1);
        },
        onRightClick () {
            this.currentPage++;
            this.fetchInstructors(this.currentPage - 1);
        },

        addCourseModal(instructor) {
            this.isLoading = true;
            this.addTeacherCourse.courseId = '';
            this.addTeacherCourse.personId = instructor.id;
            this.schoolCourses = this.allSchoolCourses;
            instructorCourseService.listByInstructor(instructor.id).then((res) => {
                this.teacherCourses = res._embedded ? res._embedded.instructorCourseResourceList : [];
                if (this.teacherCourses.length) {
                    const existCourses = this.teacherCourses.map(course => course.courseId);
                    existCourses.forEach((existCourseId) => {
                        this.schoolCourses = this.schoolCourses.filter(course => course.id !== existCourseId);
                    });
                }
                this.isLoading = false;
                this.$modal.show('add-course-modal');
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            });
        },

        submitAddTeacherCourse() {
            if (this.$refs.addCourseForm.validate()) {
                this.isLoading = true;
                instructorCourseService.create(this.addTeacherCourse).then(() => {
                    this.fetchInstructors();
                    this.isLoading = false;
                    this.$toast.success('Успешно добавлено!');
                    this.$modal.hide('add-course-modal');
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            }
        },

        deleteTeacherCourse(instrCourseId, index) {
            this.isLoading = true;
            instructorCourseService._delete(instrCourseId).then(() => {
                this.isLoading = false;
                this.teacherCourses.splice(index, 1);
                this.$toast.success('Успешно удалено!');
                this.fetchInstructors();
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            });
        }
    }
}
</script>

<style lang="scss">
    .school-admin-teachers {
        margin-bottom: 50px;
        .select-course {
            max-width: 185px;
        }
        .v-btn__content {
            color: #fff;
        }
        .instr-courses {
            span {
                margin-right: 5px;
            }
        }
        .modal-container {
            .course-content {
                display: flex;
                align-items: center;
                justify-content: center;
                .added {
                    border-right: 2px solid #9E9E9E;
                    margin-right: 20px;
                    padding-right: 20px;
                    min-width: 45%;
                }
                .add-new {
                    min-width: 55%;
                }

                .teacher-courses {
                    text-align: center;
                    transform: translateY(-10px);
                    .course {
                        margin-bottom: 8px;
                    }
                    .delete-icon {
                        width: 22px;
                        min-width:  22px;
                        height: 22px;
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>
