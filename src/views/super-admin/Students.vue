<template>
    <div class="super-admin-students">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Ученики</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :current-page="currentPage"
            :page-size="pageSize"
            :schools="students"
            :total-elements="totalElements"
            :totalPages="totalPages"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
            <template v-slot:firstItem>
                <div class="select-filter-block">
                    <div class="selects">
                        <v-select
                            :items="currentRegions"
                            item-text="title"
                            item-value="id"
                            label="Регион"
                            v-model="filterObj.regionId"
                            @change="fetchRayonsByRegion"
                        />
                        <v-select
                            :items="filteredRayons"
                            item-text="title"
                            item-value="id"
                            label="Район"
                            v-model="filterObj.rayonId"
                            @change="onSelectRayon"
                        />
                        <v-select
                            :items="filteredSchools"
                            item-text="name"
                            item-value="id"
                            label="Школа"
                            v-model="filterObj.schoolId"
                            :menu-props="{contentClass: 'schoolSelect'}"
                            @click="addScrollListenerSchoolSelect"
                            @change="fetchSchoolClasses"
                            @blur="removeSchoolSelectScrollListener"
                        />
                        <v-select
                            :items="classes"
                            item-text="classTitle"
                            item-value="id"
                            label="Класс"
                            v-model="filterObj.classId"
                        />
                    </div>
                    <div class="btn-filter">
                        <v-btn color="primary" @click="filterStudents">Фильтр</v-btn>
                    </div>
                </div>
            </template>
            <template v-slot:head>
                <th>Школа</th>
                <th>Ф.И.О</th>
                <th>Пол</th>
                <th>Класс</th>
<!--                <th>Район</th>-->
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schools[0] ? item.schools[0].name : '' }}</td>
                <td>{{ item.firstName }} {{ item.lastName }}</td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.classTitle }}</td>
<!--                <td>{{ item.schools[0] ? item.schools[0].rayonTitle : '' }}</td>-->
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from "@/components/super-admin/schools/SuperAdminSchoolHead";
import SmartSearchInput from "@/components/input/SmartSearchInput";
import SmartTable from "@/components/table/SmartTable";
import SmartSelect from "@/components/select/SmartSelect";
import {StudentService} from "@/_services/student.service";
const studentService = new StudentService();
import PreLoader from "@/components/preloader/PreLoader";
import { RayonService } from "@/_services/rayon.service";
const rayonService = new RayonService();
import {SchoolService} from '@/_services/school.service';
const schoolService = new SchoolService();
import SchoolClassService from '@/_services/school-class.service';

export default {
    name: "Students",
    components: {SmartSelect, SmartTable, SmartSearchInput, SuperAdminSchoolHead, PreLoader},
    data() {
        return {
            totalPages: 1,
            students: [],
            totalElements: 0,
            pageSize: 20,
            currentPage: 1,
            gender: {
                FEMALE: 'Ж',
                MALE: 'М'
            },
            isLoading: false,
            filterObj: {
                schoolId: '',
                classId: '',
                regionId: '',
                rayonId: ''
            },
            classes: [],
            filteredRayons: [],
            filteredSchools: [],
        }
    },
    computed: {
        currentRegions() {
            return this.$store.state.location.regions;
        }
    },
    mounted() {
        this.fetchStudents(0)
    },
    methods: {
        fetchStudents(page) {
            this.isLoading = true;
            studentService.list(page, this.filterObj.schoolId, this.filterObj.classId).then(res => {
                this.pageSize = res.page.size;
                this.totalElements = res.page.totalElements;
                this.totalPages = res.page.totalPages;
                if (res._embedded) {
                    this.students = res._embedded.studentResourceList;
                }
                this.isLoading = false;
            }).catch(err => console.log(err));
        },

        onLeftClick() {
            this.currentPage--;
            this.fetchStudents(this.currentPage - 1);
        },

        onRightClick() {
            this.currentPage++;
            this.fetchStudents(this.currentPage - 1);
        },

        filterStudents() {
            if (!this.filterObj.schoolId) {
                this.$toast.info('Выберите школу');
                return;
            }
            this.currentPage = 1;
            this.fetchStudents(0);
        },

        fetchSchoolClasses(schoolId) {
            this.filterObj.classId = '';
            this.classes = [];
            SchoolClassService.getAllBySchool(schoolId).then((res) => {
                this.classes = res.map((klass) => {
                    klass.classTitle = `${klass.classLevel} ${klass.classLabel}`;
                    return klass;
                });
            })
        },

        fetchRayonsByRegion(regionId) {
            this.filterObj.schoolId = '';
            this.filterObj.rayonId = '';
            this.filterObj.classId = '';
            this.classes = [];
            this.filteredSchools = [];
            rayonService.listByRegion(regionId).then((res) => {
                this.filteredRayons = res;
            });
        },

        onSelectRayon() {
            this.filteredSchools = [];
            this.classes = [];
            this.filterObj.schoolId = '';
            this.filterObj.classId = '';
            this.schoolPage = 0;
            this.fetchSchoolsByRayon();
        },

        fetchSchoolsByRayon() {
            schoolService.listPageable(
                this.schoolPage,
                this.filterObj.regionId,
                this.filterObj.rayonId
            ).then((res) => {
                if (res._embedded) {
                    res._embedded.schoolResourceList.forEach((school) => {
                        this.filteredSchools.push(school);
                    });
                } else {
                    this.removeSchoolSelectScrollListener();
                }
            })
        },

        addScrollListenerSchoolSelect() {
            console.log('add-scroll');
            this.$nextTick(() => {
                const schoolSelect = document.querySelector('.schoolSelect');
                schoolSelect.addEventListener('scroll', this.innerSelectScrollListener);
            })
        },

        innerSelectScrollListener() {
            console.log('scrolling');
            const schoolSelect = document.querySelector('.schoolSelect');
            let almostEndOfScroll = (schoolSelect.scrollHeight - schoolSelect.clientHeight) - 100;
            if (schoolSelect.scrollTop >= almostEndOfScroll) {
                this.schoolPage++;
                this.fetchSchoolsByRayon();
            }
        },

        removeSchoolSelectScrollListener() {
            const schoolSelect = document.querySelector('.schoolSelect');
            schoolSelect.removeEventListener('scroll', this.innerSelectScrollListener);
        },
    }
}
</script>

<style lang="scss">
.super-admin-students {
    margin-bottom: 50px;
    .select-filter-block {
        .selects {
            display: flex;
            flex-wrap: wrap;
            max-width: 500px;
        }
    }
}
</style>
