<template>
    <div class="study-material">
        <SuperAdminSchoolHead>
            <template v-slot:title>Учебные материалы</template>
            <template v-slot:center>
                <v-btn color="blue" @click="toggleAddModal">Добавить</v-btn>
            </template>
        </SuperAdminSchoolHead>

        <table class="table">
            <thead>
            <tr>
                <th>Уровень класса</th>
                <th>Предмет</th>
                <th>Материал</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="material in materials" :key="material.id">
                <td>{{material.classLevel}}</td>
                <td>{{material.courseTitle}}</td>
                <td>{{material.attachmentUrl}}</td>
            </tr>
            </tbody>
        </table>

        <!--MATERIAL MODAL-->
        <modal name="material-modal" height="auto">
            <div class="modal-container">
                <h4>Добавить материал</h4>
                <v-select
                    label="Класс"
                    :items="classLevels"
                    item-text="num"
                    item-value="num"
                    v-model="materialObj.classLevel"
                />
                <v-select
                    label="Предмет"
                    :items="courseList"
                    item-text="courseTitle"
                    item-value="id"
                    v-model="materialObj.courseId"
                />
                <v-file-input
                    chips show-size
                    accept="*"
                    label="Загрузить файл"
                    v-model="materialObj.file"
                />
                <div class="btn-actions">
                    <v-btn color="red" @click="toggleAddModal">Отмена</v-btn>
                    <v-btn color="green" @click="submitCreate">Загрузить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import StudyMaterialService from '@/_services/study-material.service';
    import {CourseService} from '../../_services/course.service';
    const courseService = new CourseService();

    export default {
        components: {
            SuperAdminSchoolHead
        },
        data() {
            return {
                classLevels: [{num: '0'}, {num: 1}, {num: 2}, {num: 3}, {num: 4}, {num: 5}, {num: 6}, {num: 7}, {num: 8}, {num: 9},
                    {num: 10}, {num: 11}],
                materials: [],
                courseList: [],
                materialObj: {
                    classLevel: '',
                    courseId: '',
                    schoolId: '',
                    file: ''
                }
            }
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        created() {
            this.materialObj.schoolId = this.school.id;
            this.getAllMaterials();
            this.getSchoolCourseList();
        },
        methods: {
            getAllMaterials() {
              StudyMaterialService.fetchList(this.school.id).then((res) => {
                  this.materials = res;
              }).catch((err) => {
                  this.$toast.error(err);
              });
            },

            getSchoolCourseList() {
                courseService.listBySchool(this.school.id).then(res => {
                   this.courseList = res;
                });
            },

            toggleAddModal() {
                this.$modal.toggle('material-modal');
            },

            submitCreate() {
                const formData = new FormData();
                Object.entries(this.materialObj).map((item) => formData.append(item[0], item[1]));
                StudyMaterialService.create(formData).then(() => {
                    this.$toast.success('Успешно!');
                    this.toggleAddModal();
                    this.getAllMaterials();
                }).catch((err) => {
                    this.$toast.error(err);
                });
            }
        }
    }
</script>
