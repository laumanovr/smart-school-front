<template>
    <div class="super-admin-students">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Ученики</template>
            <template v-slot:right>
                <div class="export-custom">
                    <ExcelJs
                        ref="exportStudents"
                        :buttonTitle="'Экспорт Учеников'"
                        :file-name="'Все ученики'"
                        :headers="exportStudentHeaders"
                        :rows="exportStudentRows"
                    />
                    <span class="export-custom-btn" @click="exportAllStudents"></span>
                </div>
            </template>
            <template v-slot:center>
                <SmartSearchInput :searchObj="filterObj" :searchField="'query'" @onEnter="searchStudentByFIO"/>
                <button class="search-btn" @click="searchStudentByFIO">Поиск</button>
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
                        <div class="select-clear-block">
                            <v-select
                                :items="currentRegions"
                                item-text="title"
                                item-value="id"
                                label="Регион"
                                v-model="filterObj.regionId"
                                @change="fetchRayonsByRegion"
                            />
                            <TrashIcon @click="filterObj.regionId=''" v-show="filterObj.regionId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="filteredRayons"
                                item-text="title"
                                item-value="id"
                                label="Район"
                                v-model="filterObj.rayonId"
                                @change="onSelectRayon"
                            />
                            <TrashIcon @click="filterObj.rayonId=''" v-show="filterObj.rayonId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="filteredSchools"
                                item-text="name"
                                item-value="id"
                                label="Школа"
                                v-model="filterObj.schoolId"
                                :menu-props="{contentClass: 'schoolSelect'}"
                                @click="addScrollListenerSchoolSelect"
                                @blur="removeSchoolSelectScrollListener"
                            />
                            <TrashIcon @click="filterObj.schoolId=''" v-show="filterObj.schoolId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="classes"
                                item-text="classLevel"
                                item-value="classLevel"
                                label="Класс"
                                v-model="filterObj.classLevel"
                            />
                            <TrashIcon @click="filterObj.classLevel=''" v-show="filterObj.classLevel"/>
                        </div>
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
                <th>Район</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schools[0] ? item.schools[0].name : '' }}</td>
                <td>{{ item.lastName }} {{ item.firstName }}</td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.classTitle }}</td>
                <td>{{ item.schools[0] ? item.schools[0].rayonTitle : '' }}</td>
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
import TrashIcon from '@/components/icons/TrashIcon';
import ExcelJs from "@/components/excel-export/ExcelJs";
import moment from 'moment';

export default {
    name: "Students",
    components: {
        SmartSelect,
        SmartTable,
        SmartSearchInput,
        SuperAdminSchoolHead,
        PreLoader,
        TrashIcon,
        ExcelJs
    },
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
                classLevel: '',
                regionId: '',
                rayonId: '',
                query: ''
            },
            classes: [],
            filteredRayons: [],
            filteredSchools: [],
            exportStudentHeaders: [],
            exportStudentRows: [],
        }
    },
    computed: {
        currentRegions() {
            return this.$store.state.location.regions;
        }
    },
    mounted() {
        this.fetchStudents(0);
        this.classes = [
            {classLevel: 1}, {classLevel: 2}, {classLevel: 3}, {classLevel: 4}, {classLevel: 5}, {classLevel: 6},
            {classLevel: 7}, {classLevel: 8}, {classLevel: 9}, {classLevel: 10}, {classLevel: 11},
        ];
    },
    methods: {
        fetchStudents(page) {
            this.isLoading = true;
            this.students = [];
            studentService.list(
                page,
                this.filterObj.schoolId,
                this.filterObj.classLevel,
                this.filterObj.regionId,
                this.filterObj.rayonId,
                this.filterObj.query
            ).then((res) => {
                this.pageSize = res.page.size;
                this.totalElements = res.page.totalElements;
                this.totalPages = res.page.totalPages;
                if (res._embedded) {
                    this.students = res._embedded.studentResourceList.sort((a, b) => a.schools[0].id - b.schools[0].id);
                }
                this.isLoading = false;
            }).catch(err => console.log(err));
        },

        exportAllStudents() {
            this.isLoading = true;
            const filterObj = {
                classId: '',
                classLevel: this.filterObj.classLevel,
                rayonId: this.filterObj.rayonId,
                regionId: this.filterObj.regionId,
                schoolId: this.filterObj.schoolId,
            };
            studentService.getAbsolutelyAll(filterObj).then((res) => {
                if (res.length) {
                    this.exportStudentHeaders = ['Школа', 'Район', 'ФИО', 'Класс', 'Дата Рождения', 'Пол'];
                    this.exportStudentRows = res.map((i) => {
                        return [
                            i.schoolTitle,
                            i.rayonTitle,
                            i.surname+' '+i.name,
                            i.classTitle,
                            moment(i.dateOfBirth, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                            i.gender ? 'Ж' : 'М'
                        ];
                    });
                    this.$refs.exportStudents.isExport = true;
                }
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            });
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
            this.filterObj.query = '';
            this.currentPage = 1;
            this.fetchStudents(0);
        },

        fetchRayonsByRegion(regionId) {
            this.filterObj.schoolId = '';
            this.filterObj.rayonId = '';
            this.filteredSchools = [];
            rayonService.listByRegion(regionId).then((res) => {
                this.filteredRayons = res;
            });
        },

        onSelectRayon() {
            this.filteredSchools = [];
            this.filterObj.schoolId = '';
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

        searchStudentByFIO() {
            this.filterObj.schoolId = '';
            this.filterObj.classLevel = '';
            this.filterObj.regionId = '';
            this.filterObj.rayonId = '';
            this.currentPage = 1;
            this.fetchStudents(0);
        },

        addScrollListenerSchoolSelect() {
            this.$nextTick(() => {
                const schoolSelect = document.querySelector('.schoolSelect');
                schoolSelect.addEventListener('scroll', this.innerSelectScrollListener);
            })
        },

        innerSelectScrollListener() {
            const schoolSelect = document.querySelector('.schoolSelect');
            let almostEndOfScroll = (schoolSelect.scrollHeight - schoolSelect.clientHeight) - 100;
            if (schoolSelect.scrollTop >= almostEndOfScroll) {
                this.schoolPage++;
                this.fetchSchoolsByRayon();
            }
        },

        removeSchoolSelectScrollListener() {
            const schoolSelect = document.querySelector('.schoolSelect');
            if (schoolSelect) {
                schoolSelect.removeEventListener('scroll', this.innerSelectScrollListener);
            }
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
            max-width: 540px;
        }
    }
}
</style>
