<template>
<div class="school-admin-classes">
    <SuperAdminSchoolHead>
        <template v-slot:title>Классы</template>
        <template v-slot:center>
            <SmartButton @clicked="onAddClass">
                Добавить класс <img src="../../assets/images/icons/add-user.svg" alt="">
            </SmartButton>
            <SmartSearchInput></SmartSearchInput>
        </template>
    </SuperAdminSchoolHead>
    <SmartTable :schools="classes" :total-elements="classes.length" :page-size="classes.length" :totalPages="totalPages">
        <template v-slot:firstItem>
            <v-select
                :items="classInstructors"
                item-text="personTitle"
                item-value="personId"
                label="Фильтр по учителю"
                class="select-teacher"
                @change="filterByInstructor"
            ></v-select>
        </template>
        <template v-slot:head>
            <th>Класс</th>
            <th>Буква</th>
            <th>Классный руководитель</th>
            <th>Язык</th>
            <th></th>
            <th></th>
        </template>

        <template v-slot:body="{ item }">
            <td>{{ item.classLevel }}</td>
            <td>{{ item.classLabel }}</td>
            <td>{{ item.personTitle }}</td>
            <td>{{ getLanguageName(item.languageId) }}</td>
            <td><img @click="editCLass(item)" class="clickable-icons" src="../../assets/images/icons/pen.svg" alt=""></td>
            <td><img @click="onDeleteClass(item)" class="clickable-icons" src="../../assets/images/icons/trash.svg" alt=""></td>
        </template>
    </SmartTable>

    <v-dialog
        v-model="isAddClassModal"
        width="546"
        id="add-form"
    >
        <v-form @submit.prevent="submitClass" ref="classForm">
            <div class="form-head">
                <span><h2>{{isEditClass ? 'Редактировать класс' : 'Добавить класс'}}</h2></span>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="classLevels"
                    item-text="num"
                    item-value="num"
                    label="Класс"
                    v-model="sendObj.classLevel"
                ></v-select>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="classLabels"
                    item-text="label"
                    item-value="label"
                    label="Буква"
                    v-model="sendObj.classLabel"
                ></v-select>
            </div>
            <div>
                <v-select
                    :rules="required"
                    :items="languages"
                    item-text="name"
                    item-value="id"
                    label="Язык"
                    v-model="sendObj.languageId"
                ></v-select>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="teachers"
                    item-text="instructorTitle"
                    item-value="instructorId"
                    label="Классный руководитель"
                    v-model="instrClassObj.personId"
                ></v-select>
            </div>

            <div class="form-footer">
                <div class="btn-actions">
                    <v-btn type="submit" color="primary">Сохранить</v-btn>
                    <v-btn color="red" @click="isAddClassModal=false">Отменить</v-btn>
                </div>
            </div>
        </v-form>
    </v-dialog>
    <v-dialog
        max-width="450"
        v-model="isDeleting"
    >
        <DeletePopup @cancel="isDeleting = false" @accept="deleteClass"></DeletePopup>
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
    import SchoolClassService from '@/_services/school-class.service';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    import DeletePopup from "@/components/delete-popup/DeletePopup";
    const instructorClassService = new InstructorClassService();

    export default {
        components: {
            DeletePopup,
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable
        },
        data() {
            return {
                required: [
                    v => !!v || 'Input is required',
                ],
                sendObj: {
                    classLabel: '',
                    classLevel: 0,
                    languageId: 0,
                    schoolId: 0
                },
                isDeleting: false,
                instrClassObj: {
                    archived: true,
                    chronicleId: 0,
                    classId: 0,
                    personId: 0
                },
                isAddClassModal: false,
                isEditClass: false,
                classes: [],
                classLevels: [
                    {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9}, {num: 10},
                    {num: 11},
                ],
                classLabels: [
                    {label: 'А'}, {label: 'Б'}, {label: 'В'}, {label: 'Г'}, {label: 'Д'}, {label: 'Е'}, {label: 'Ё'}, {label: 'Ж'},
                ],
                languages: [],
                teachers: [],
                classInstructors: [],
                allClasses: [],
                totalPages: 1
            }
        },

        computed: {
            userProfile () {
                return this.$store.state.account.profile
            }
        },

        created() {
            this.sendObj.languageId = this.userProfile.schools[0].languageId;
            this.instrClassObj.chronicleId = this.userProfile.schools[0].chronicleId;
            this.fetchLanguages();
            this.fetchTeachers();
            this.fetchAllClasses();
        },

        methods: {
            fetchAllClasses() {
                instructorClassService.getAllClasses(this.userProfile.schools[0].id).then((res) => {
                    this.classes = res;
                    this.allClasses = res;
                    this.classInstructors = JSON.parse(JSON.stringify(res));
                    this.classInstructors.unshift({personId: 0, personTitle: 'Показать все'});
                })
            },

            filterByInstructor(instructorId) {
                if (instructorId) {
                    this.classes = this.allClasses.filter((klass) => klass.personId === instructorId);
                } else {
                    this.classes = this.allClasses;
                }
            },

            onAddClass () {
                this.isAddClassModal = true;
                this.isEditClass = false;
                this.sendObj.classLabel = '';
                this.sendObj.classLevel = '';
                this.sendObj.languageId = '';
                this.instrClassObj.personId = '';
                if (this.$refs.classForm) {
                    this.$refs.classForm.reset();
                }
            },

            editCLass (item) {
                this.sendObj.classLabel = item.classLabel;
                this.sendObj.classLevel = item.classLevel;
                this.sendObj.languageId = item.languageId;
                this.sendObj.schoolId = item.schoolId;
                this.sendObj.id = item.classId;
                this.instrClassObj.personId = item.personId;
                this.isAddClassModal = true;
                this.isEditClass = true;
            },

            onDeleteClass (item) {
                this.sendObj = item;
                this.isDeleting = true;
            },

            deleteClass () {
                if (this.sendObj.id) {
                    instructorClassService._delete(this.sendObj.id).then(() => {
                        this.deleteSchoolClass();
                    }).catch(err => {
                        this.$toast.error(err);
                    });
                } else {
                    this.deleteSchoolClass();
                }
            },

            async deleteSchoolClass() {
                await SchoolClassService._delete(this.sendObj.classId).then(() => {
                    this.isDeleting = false;
                    this.$toast.success('Успешно');
                    this.fetchAllClasses();
                }).catch((err) => {
                    this.$toast.error(err);
                });
            },

            fetchLanguages() {
                languageService.list().then(res => {
                    this.languages = res;
                }).catch(err => console.log(err))
            },

            getLanguageName(langId) {
                if (langId && this.languages.length) {
                    return this.languages.find(lang => lang.id === langId).name;
                }
            },

            fetchTeachers () {
                instructorCourseService.listBySchool(this.userProfile.schools[0].id, 0).then(res => {
                    if (res._embedded) {
                        this.teachers = res._embedded.instructorCourseResourceList;
                    }
                }).catch(err => console.log(err))
            },

            submitClass() {
                if (!this.$refs.classForm.validate()) {
                    return;
                }
                this.sendObj.schoolId = this.userProfile.schools[0].id;
                if (this.isEditClass) {
                    SchoolClassService.update(this.sendObj).then(res => {
                        return instructorClassService.getByClassId(this.sendObj.id);
                    }).then(res => {
                        let resource = []
                        this.instrClassObj.classId = this.sendObj.id;
                        this.instrClassObj.chronicleId = this.userProfile.schools[0].chronicleId;
                        if (res._embedded) {
                            resource = res._embedded.instructorClassResourceList[0];
                            this.instrClassObj.id = resource.id;
                            instructorClassService.update(this.instrClassObj).then(res => {
                                this.isAddClassModal = false;
                                this.fetchAllClasses();
                                this.$toast.success('Успешно');
                            }).catch(err => console.log(err));
                        } else {
                            instructorClassService.create(this.instrClassObj).then((res) => {
                                this.isAddClassModal = false;
                                this.fetchAllClasses();
                                this.$toast.success('Успешно');
                            })
                        }
                    }).catch(err => console.log(err));
                } else
                    SchoolClassService.create(this.sendObj).then((res) => {
                        SchoolClassService.getAllBySchool(this.userProfile.schools[0].id).then((res) => {
                            let klassId = res.find(klass => klass.classLabel === this.sendObj.classLabel && parseInt(klass.classLevel) === this.sendObj.classLevel).id
                            this.instrClassObj.classId = klassId;
                            instructorClassService.create(this.instrClassObj).then((res) => {
                                this.isAddClassModal = false;
                                this.fetchAllClasses();
                                this.$toast.success('Успешно');
                            })
                        })
                    }).catch((err) => {
                        console.log(err);
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .school-admin-classes {
        margin-bottom: 50px;
        .select-teacher {
            max-width: 250px;
        }
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
</style>
