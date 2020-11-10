<template>
	<div class="students-container">
		<pre-loader v-if="isLoading"></pre-loader>
		<SuperAdminSchoolHead>
			<template v-slot:title>Ученики</template>
			<template v-slot:center>
				<SmartSearchInput :searchObj="search" :searchField="'query'"/>
                <button class="search-btn" @click="searchStudents">Поиск</button>
			</template>
			<template v-slot:right>
				<SmartBtn2 @onClick="isAddFile = true">
					Импорт <img alt="" src="../../assets/images/icons/import.svg" style="padding-bottom: 5px">
				</SmartBtn2>
				<ExcelJs :file-name="exportName" :headers="exportHeaders" :rows="exportRows"></ExcelJs>
				<SmartBtn2 @onClick="downloadTemplate">
					Загрузить шаблон <img alt="" src="../../assets/images/icons/download.svg">
				</SmartBtn2>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable
			:current-page="currentPage"
			:page-size="pageSize"
			:schools="students"
			:total-elements="totalElements"
			:totalPages="totalPages"
			menu="Students"
			@deleteStudents="onMassDelete"
			@leftClick="onLeftClick"
			@rightClick="onRightClick"
		>
			<template v-slot:firstItem>
                <div class="filter-class">
                    <v-select
                        :items="filterClasses"
                        item-text="classTitle"
                        item-value="id"
                        v-model="selectedClassId"
                        label="Фильтр по классам"
                        class="select-class"
                        :class="{'no-border': selectedFilterClass}"
                        @change="filterByClass"
                    ></v-select>
                    <SmartButton @clicked="onAddStudent">
                        Добавить ученика <img alt="" src="../../assets/images/icons/add-user.svg">
                    </SmartButton>
				    <SmartButton @clicked="openDeleteCourseModal">
                        Отвязать предмет
                    </SmartButton>
                    <SmartButton @clicked="openRefreshClassCourseModal">
                        Обновить уроки
                    </SmartButton>
                </div>
			</template>
			<template v-slot:head>
				<th class="top-th"><input v-model="isSelectAll" type="checkbox" @click="selectAll"></th>
				<th>№</th>
				<th>Ф.И.О</th>
				<th>Класс</th>
				<th>Пол</th>
				<th>Дата рождения</th>
				<th></th>
				<th></th>
				<th></th>
			</template>

			<template v-slot:body="{ item }">
				<td><input v-model="item.checked" type="checkbox" @change="onSelect(item)"></td>
				<td>{{ item.index + 1 }}</td>
				<td>{{ item.surname }} {{ item.name }}</td>
				<td>{{ item.classTitle }}</td>
				<td>{{ item.gender === 0 ? 'М' : 'Ж' }}</td>
				<td>{{ formatDOB(item.dateOfBirth) }}</td>
				<td>
					<InfoIcon @click="showDetailInfo(item.id)"/>
				</td>
				<td><img alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg"
				         @click="onEditStudent(item)"></td>
				<td><img alt="" class="clickable-icons"
				         src="../../assets/images/icons/trash.svg" @click="onDeleteStudent(item)"></td>
			</template>
		</SmartTable>
		<v-dialog v-if="isAddStudentModal" id="add-form" v-model="isAddStudentModal" width="546">
			<v-form ref="studentForm" @submit.prevent="submitStudent">
				<div class="form-head">
					<span><h2>{{isStudentEdit ? 'Редактировать ученика' : 'Добавить ученика'}}</h2></span>
					<img alt="" src="../../assets/images/profile-icon.svg">
					<button class="profile-edit">
						<img src="../../assets/images/icons/edit.svg">
					</button>
				</div>

				<div>
					<v-text-field v-model="studentObj.name" :rules="required" label="Имя"></v-text-field>
					<v-text-field v-model="studentObj.surname" :rules="required" label="Фамилия"></v-text-field>
					<v-text-field v-model="studentObj.middleName" :rules="required" label="Отчество"></v-text-field>
                    <v-text-field
                        label="ПИН/ИНН"
                        v-model="studentObj.pin"
                        type="number"
                        counter="14"
                        :rules="required"
                        @input="limitNumbers(studentObj, 'pin', 14)"
                    />
				</div>

				<div>
					<v-radio-group v-model="studentObj.gender" :mandatory="false" :rules="required" row>
						<v-radio label="М" value="MALE"></v-radio>
						<v-radio label="Ж" value="FEMALE"></v-radio>
					</v-radio-group>
					<v-menu
						v-model="menu2"
						:close-on-content-click="false"
						:nudge-right="40"
						min-width="290px"
						offset-y
						transition="scale-transition"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								v-model="studentObj.dateOfBirth"
								v-bind="attrs"
								v-on="on"
								label="Дата рождения"
								readonly
							></v-text-field>
						</template>
						<v-date-picker v-model="birthday" @input="onSelectDOB"></v-date-picker>
					</v-menu>
				</div>

				<div>
					<v-select
						v-model="studentObj.classId"
						:items="classes"
						:rules="required"
						item-text="classTitle"
						item-value="id"
						label="Класс"
					>
					</v-select>
				</div>

				<div class="spacer">
					<v-text-field v-model="studentObj.phone" label="Номер телефона" type="number"></v-text-field>
				</div>

				<div>
					<v-text-field v-model="parentPersonObj.name" label="Имя родителя"></v-text-field>
				</div>

				<div>
					<v-text-field v-model="parentPersonObj.phone" label="Телефон родителя" type="number"></v-text-field>
				</div>

				<div class="form-footer">
                    <div class="btn-actions">
					    <v-btn color="red" @click="isAddStudentModal=false">Отменить</v-btn>
                        <v-btn color="green" type="submit">Сохранить</v-btn>
                    </div>
				</div>
			</v-form>
		</v-dialog>
		<v-dialog
			v-model="isDeleting"
			max-width="450"
		>
			<DeletePopup @accept="deleteStudent" @cancel="isDeleting = false"></DeletePopup>
		</v-dialog>
		<v-dialog
			v-model="isMassDeleting"
			max-width="450"
		>
			<DeletePopup @accept="massDelete" @cancel="isMassDeleting = false"></DeletePopup>
		</v-dialog>
		<v-dialog v-if="isAddFile" id="add-file" v-model="isAddFile" width="546">
			<ImportFile @submit="onSubmit"></ImportFile>
		</v-dialog>

        <!--STUDENT DETAIL MODAL-->
		<v-dialog v-model="showDetailModal" width="546">
			<v-form>
				<div class="form-head head-title">
					<h2>Полная информация</h2>
				</div>
				<v-text-field :value="studentDetail.username" label="Логин/Пароль ученика" readonly outlined type="text"/>
				<v-text-field :value="`${studentDetail.surname} ${studentDetail.name} ${studentDetail.middleName || ''}`" label="ФИО" readonly outlined type="text"/>
				<v-text-field :value="studentDetail.phone" label="Телефон" readonly outlined type="text"/>
				<v-text-field
                    :value="studentDetail.parents.length ? studentDetail.parents[0].parentTitle : ''"
				    label="Имя родителя"
				    readonly outlined type="text"
                />
                <v-text-field
                    :value="studentDetail.parents.length ? studentDetail.parents[0].parentUsername : ''"
                    label="Логин/Пароль родителя"
                    readonly outlined type="text"
                />
                <div class="course-titles">
                    <div class="label">Предметы</div>
                    <span v-for="course in studentDetail.courses">
                        {{ course[langObj[currentLang]] }},
                    </span>
                </div>
                <div class="btn-actions">
				    <v-btn color="primary" @click="showDetailModal = false">Закрыть</v-btn>
                </div>
			</v-form>
		</v-dialog>

		<!--DELETE COURSE MODAL-->
        <modal name="course-modal" width="500px" height="420px" class="add-course-modal">
            <div class="modal-container">
                <h4>Отвязать предмет</h4>
                <div>
                    <v-select
                        v-model="studentCourseCreate.classId"
                        :items="students"
                        item-text="classTitle"
                        item-value="classId"
                        label="Класс"
                        @change="onSelectClass"
                    />
                </div>
                <div class="added-courses">
                    <h4>Добавленные:</h4>
                    <div class="course" v-for="(course, i) in studentDetail.courses">
                        <span class="course-title">
                            {{course[langObj[currentLang]] + ' - ' + course.personTitle}}
                        </span>
                        <TrashIcon @click="deleteCourseFromClass(course, i)"/>
                    </div>
                </div>
            </div>
        </modal>

        <!--REFRESH COURSE MODAL-->
        <modal name="refresh-course-modal" width="500px">
            <div class="modal-container">
                <h4>Обновить уроки класса из расписания</h4>
                <v-form ref="form">
                    <v-select
                        :items="students"
                        label="Класс"
                        item-text="classTitle"
                        item-value="classId"
                        v-model="refreshClass.classId"
                        :rules="required"
                    />
                    <div class="btn-actions">
                        <v-btn color="red" @click="closeRefreshCourseModal">Отмена</v-btn>
                        <v-btn color="green" @click="submitRefreshClassCourse">Обновить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>
	</div>
</template>

<script>
import { limitNumbers } from '@/utils/limit-numbers';
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
import {RoleService} from '@/_services/role.service'
const roleService = new RoleService();
import {StudentClassService} from '@/_services/student-class.service';
const studentClassService = new StudentClassService();
import {PersonService} from '@/_services/person.service';
const personService = new PersonService();
import {StudentParentService} from '@/_services/student-parent.service';
import ExcelJs from "@/components/excel-export/ExcelJs";
import ImportFile from "@/components/import-file/ImportFile";
const studentParentService = new StudentParentService();
import {FileImportService} from "@/_services/file-import.service";
import DeletePopup from "@/components/delete-popup/DeletePopup";
const fileImportService = new FileImportService();
import SchoolClassService from '@/_services/school-class.service';
import PreLoader from "@/components/preloader/PreLoader";
import {InstructorCourseService} from '@/_services/instructor-course.service';
const instructorCourseService = new InstructorCourseService();
import StudentCourseService from '@/_services/student-course.service';
import InfoIcon from '@/components/icons/InfoIcon';
import ScheduleWeekService from '@/_services/schedule-week.service';
import TrashIcon from '@/components/icons/TrashIcon';

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
		InfoIcon,
        TrashIcon
	},

	data() {
		return {
            langObj: {
                RU: 'courseTitle',
                KG: 'courseTitleKG',
                EN: 'courseCode',
            },
			isAddFile: false,
			isMassDeleting: false,
			isSelectAll: false,
			studentObj: {
				address: '',
				avatar: '',
				chronicleYearId: 1,
				classId: 0,
				comeBy: '',
				dateOfBirth: '11.02.2000',
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
            allStudents: [],
			classes: [],
			required: [v => !!v || 'Input is required'],
			isAddStudentModal: false,
			isStudentEdit: false,
			roles: [],
			languages: [],
			birthday: '2000-02-11',
			menu2: false,
			exportHeaders: [],
			exportRows: [],
			exportName: '',
			currentPage: 1,
			totalElements: 0,
			pageSize: 0,
			isDeleting: false,
			showDetailModal: false,
			studentDetail: {
			    courses: [],
                parents: []
            },
			instrCourseObj: {},
            studentCourseCreate: {
                chronicleId: 0,
                classId: 0,
                courseId: 0,
                instructorId: 0
            },
			isLoading: false,
			totalPages: 1,
            filterClasses: [],
            selectedFilterClass: false,
            selectedClassId: '',
            search: {
			    query: ''
            },
            refreshClass: {
                schoolId: 0,
                chronicleId: 0,
                classId: 0
            }
		}
	},

	computed: {
		userProfile() {
			return this.$store.state.account.profile
		},
        school() {
            return this.userProfile.schools[0]
        },
        currentLang() {
            return this.$root.$i18n.locale;
        }
	},

	created() {
		this.studentObj.languageId = this.school.languageId;
		this.parentPersonObj.languageId = this.school.languageId;
		this.parentPersonObj.schoolId = this.school.id;
		this.studentObj.chronicleYearId = this.school.chronicleId;
		this.studentClassObj.chronicleId = this.school.chronicleId;
		this.refreshClass.schoolId = this.school.id;
        this.refreshClass.chronicleId = this.school.chronicleId;
		this.fetchAllClasses();
		this.fetchRoles();
		this.fetchStudents(true);
	},

	methods: {
        limitNumbers: limitNumbers,

        async fetchStudents(refreshAll) {
            this.isLoading = true;
            studentService.getAllBySchool(this.userProfile.schools[0].id, this.search.query).then((res) => {
                if (refreshAll) {
                    this.allStudents = JSON.parse(JSON.stringify(res));
                }
                this.students = res;
                this.students = this.students.map((student, i) => ({...student, index: i}));
                this.totalElements = this.students.length;
                this.pageSize = this.students.length;
                this.isLoading = false;
                this.prepareExport();
                if (this.selectedClassId) {
                    this.filterByClass(this.selectedClassId);
                }
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },

        filterByClass(klassId) {
            this.search.query = '';
            this.selectedFilterClass = true;
            if (klassId) {
                this.students = this.allStudents.filter((student) => student.classId === klassId);
                this.students = this.students.map((student, i) => ({...student, index: i}));
                this.totalElements = this.students.length;
                this.prepareExport();
            } else {
                this.students = this.allStudents;
                this.students = this.students.map((student, i) => ({...student, index: i}));
                this.totalElements = this.students.length;
                this.prepareExport();
            }
        },

        searchStudents() {
            this.selectedClassId = '';
            this.fetchStudents(false);
        },

        prepareExport() {
            this.exportHeaders = ['Ф.И.О', 'Класс', 'Пол', 'Дата рождения', 'Логин/Пароль'];
            this.exportRows = this.students.map(i => {
                return [`${i.surname} ${i.name}`, i.classTitle, i.gender === 1 ? 'М' : 'Ж', i.dateOfBirth, i.username];
            });
            this.exportName = 'Умная школа: Ученики';
        },

        formatDOB(date) {
            return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
        },

        onSelectDOB() {
            this.menu2 = false;
            this.studentObj.dateOfBirth = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY');
        },

		selectAll() {
			this.students = this.students.map(i => {
				i.checked = !this.isSelectAll
				return i
			})
		},

        onMassDelete() {
            this.isMassDeleting = true
        },

		massDelete() {
			const ids = this.students.filter(i => i.checked).map(i => i.id);
			this.isLoading = true;
			studentService.massDelete(ids).then(res => {
				this.$toast.success('Успешно!');
				this.isSelectAll = false;
				this.fetchStudents(true);
				this.isMassDeleting = false;
				this.isLoading = false
			}).catch(err => {
			    this.$toast.error(err);
				this.isLoading = false
			})
		},

		onSelect(item) {
			//  this.students = this.students.map(i => {
			// 	if (i.id === item.id) i.checked = item.checked
			//     return i
			// })
		},

		showDetailInfo(studentId) {
            this.isLoading = true;
			studentService.getDetails(studentId).then((res) => {
				this.studentDetail = res;
		        this.getStudentCourses(studentId);
                this.showDetailModal = true;
			}).catch(err => {
                this.$toast.error(err);
                this.isLoading = false;
            })
		},

        async getStudentCourses(studentId) {
            await StudentCourseService.getByStudentIdAndChronicle(studentId, this.school.chronicleId).then((res) => {
                this.studentDetail.courses = res;
                this.isLoading = false;
            }).catch(err => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },

        onSelectClass(classId) {
            this.isLoading = true;
		    const studentId = this.students.find((student) => student.classId === classId).id;
            this.getStudentCourses(studentId);
        },

		openDeleteCourseModal() {
			this.instrCourseObj = {};
            this.studentDetail.courses = [];
			this.studentCourseCreate.classId = '';
            this.$modal.show('course-modal');
		},

        deleteCourseFromClass(courseObj, index) {
            this.isLoading = true;
            const removeClassCourse = {
                classId: courseObj.classId,
                instructorCourseDtos: [{
                    archived: true,
                    courseId: courseObj.courseId,
                    personId: courseObj.instructorId,
                    schoolId: this.userProfile.schools[0].id
                }],
                yearId: this.userProfile.schools[0].chronicleId
            };
            StudentCourseService.deleteWithArray(removeClassCourse).then(() => {
                this.studentDetail.courses.splice(index, 1);
                this.$toast.success('Удалено!');
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            });
        },

        openRefreshClassCourseModal() {
            this.refreshClass.classId = '';
            this.$modal.show('refresh-course-modal');
        },

        submitRefreshClassCourse() {
            if (this.$refs.form.validate()) {
                this.isLoading = true;
                StudentCourseService.refreshScheduleCourses(this.refreshClass).then(() => {
                    this.$toast.success('Успешно обновлено!');
                    this.isLoading = false;
                    this.closeRefreshCourseModal();
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            }
        },

        closeRefreshCourseModal() {
            this.$modal.hide('refresh-course-modal');
        },

		downloadTemplate() {
			const a = document.createElement('a');
			a.download = 'Шаблон импорта Учеников.xlsx'
			a.href = '/docs/Шаблон_Окуучу.xlsx'
			a.click()
		},

		onDeleteStudent(item) {
			this.studentObj = item;
			this.isDeleting = true
		},

		deleteStudent() {
			studentService._delete(this.studentObj.id).then(res => {
				this.isDeleting = false;
				this.$toast.success('Успешно');
				this.fetchStudents(true)
			}).catch(err => {
				this.$toast.error(err);
				this.isDeleting = false
			})
		},

		onAddStudent() {
			this.isAddStudentModal = true;
			this.isStudentEdit = false;
			this.studentObj = {};
		},

		onEditStudent(item) {
            this.isLoading = true;
			studentService.getDetails(item.id).then(res => {
                this.studentObj.id = item.id;
                this.studentObj.classId = item.classId;
                this.studentObj.name = item.name;
                this.studentObj.surname = item.surname;
                this.studentObj.middleName = item.middleName;
                this.studentObj.dateOfBirth = res.dateOfBirth;
                this.birthday = moment(res.dateOfBirth, 'DD.MM.YYYY').format('YYYY-MM-DD');
                this.studentObj.gender = item.gender === 0 ? 'MALE' : 'FEMALE';
				this.studentObj.phone = res.phone ? res.phone.replace('+', '') : '';
                this.studentObj.pin = res.pin;
                this.parentPersonObj.name = res.parents && res.parents.length ? res.parents[0].parentTitle : '';
                this.isAddStudentModal = true;
                this.isStudentEdit = true;
                this.isLoading = false;
            }).catch(err => {
                this.isLoading = false;
                this.$toast.error(err);
            })
		},

		fetchRoles() {
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
                this.filterClasses = JSON.parse(JSON.stringify(this.classes));
                this.filterClasses.unshift({id: 0, classTitle: 'Показать все'});
			})
		},

		submitStudent() {
		    if (!this.$refs.studentForm.validate()) {
		        return;
            }
            this.search.query = '';
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
					this.isAddStudentModal = false
					this.fetchStudents(true)

					studentClassService.getByStudent(d.id).then(res => {
						this.studentClassObj.classId = this.studentObj.classId;
						this.studentClassObj.studentId = this.studentObj.id;
						if (res.length) {
							this.studentClassObj.id = res[0].id
							return studentClassService.edit(this.studentClassObj)
						} else {
							return studentClassService.create(this.studentClassObj)
						}
					}).then(res => {
						this.parentPersonObj.roles = this.roles.filter(i => i.code === 'ROLE_PARENT').map(i => i.id);
						return studentParentService.getByStudent(this.studentObj.id)
					}).then(res => {
						if (res._embedded) {
							this.parentPersonObj.id = res._embedded.studentParentResourceList[0].parentId
							return personService.edit(this.parentPersonObj)
						} else {
							return personService.create(this.parentPersonObj).then(res => {
								const studentParent = {
									personId: parseInt(res.message),
									parentalType: 'FATHER',
									studentId: this.studentClassObj.studentId
								};
								return studentParentService.create(studentParent)
							}).catch(err => console.log(err))
						}
					}).then(res => {
						this.$toast.success('Успешно!');
					}).catch(err => console.log(err))
				}).catch(err => console.log(err));
			} else
				studentService.create(this.studentObj).then((res) => {
					let studentId = parseInt(res.message);
					this.studentClassObj.classId = this.studentObj.classId;
					this.studentClassObj.studentId = studentId;

					 studentClassService.create(this.studentClassObj).then((res) => {
						this.fetchStudents(true);
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

		onLeftClick() {
//			this.currentPage--;
//			this.fetchStudents(this.currentPage - 1);
		},
		onRightClick() {
//			this.currentPage++;
//			this.fetchStudents(this.currentPage - 1);
		},
		onSubmit(data) {
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
					this.fetchStudents(true);
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
					this.fetchStudents(true);
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
.students-container {
	margin-bottom: 50px;
    .filter-class {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .select-class {
            max-width: 185px;
            margin-right: 20px;
            .v-select__slot {
                border: 1px solid #9E9E9E;
                border-bottom: 0;
                .v-label {
                    padding: 0 8px;
                }
            }
            &.no-border {
                .v-select__slot {
                    border: 0;
                }
            }
        }
        .smart-btn {
            margin-left: 20px;
        }
    }

    .add-course-modal {
        .modal-container {
            height: 100%;
            overflow-y: auto;
            .added-courses {
                .course {
                    display: flex;
                    align-items: center;
                    &:not(:last-child) {
                        border-bottom: 1px solid #c7c6c6;
                        padding: 5px 0;
                    }
                    .course-title {
                        width: 92%;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}

.course-titles {
    .label {
        font-size: 13px;
        color: #838080;
    }
}

.head-title {
    margin-bottom: 20px;
}

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
