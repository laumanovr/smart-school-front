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
                <SmartSearchInput :searchObj="filterObj.searchRequest" :searchField="'query'" @onEnter="searchStudentByFIO"/>
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
                                v-model="filterObj.searchRequest.regionId"
                                @change="fetchRayonsByRegion"
                            />
                            <TrashIcon @click="filterObj.searchRequest.regionId=''" v-show="filterObj.searchRequest.regionId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="filteredRayons"
                                item-text="title"
                                item-value="id"
                                label="Район"
                                v-model="filterObj.searchRequest.rayonId"
                                @change="onSelectRayon"
                            />
                            <TrashIcon @click="filterObj.searchRequest.rayonId=''" v-show="filterObj.searchRequest.rayonId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="filteredSchools"
                                item-text="name"
                                item-value="id"
                                label="Школа"
                                v-model="filterObj.searchRequest.schoolId"
                                :menu-props="{contentClass: 'schoolSelect'}"
                                @click="addScrollListenerSchoolSelect"
                                @blur="removeSchoolSelectScrollListener"
                            />
                            <TrashIcon @click="filterObj.searchRequest.schoolId=''" v-show="filterObj.searchRequest.schoolId"/>
                        </div>
                        <div class="select-clear-block">
                            <v-select
                                :items="classes"
                                item-text="classLevel"
                                item-value="classLevel"
                                label="Класс"
                                v-model="filterObj.searchRequest.classLevel"
                            />
                            <TrashIcon @click="filterObj.searchRequest.classLevel=''" v-show="filterObj.searchRequest.classLevel"/>
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
                <th>Дата рождения</th>
                <th>Район</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schoolTitle }}</td>
                <td>{{ item.surname }} {{ item.name }}</td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.classTitle }}</td>
                <td>{{ formatDOB(item.dateOfBirth) }}</td>
                <td>{{ item.rayonTitle }}</td>
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
                '1': 'Ж',
                '0': 'М'
            },
            isLoading: false,
            filterObj: {
                pageRequest: {
                    limit: 10,
                    offset: 0
                },
                searchRequest: {
                    classLevel: '',
                    query: '',
                    rayonId: '',
                    regionId: '',
                    schoolId: ''
                }
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
        fetchStudents() {
            this.isLoading = true;
            studentService.getAllStudents(this.filterObj).then((res) => {
                this.pageSize = this.filterObj.pageRequest.limit;
                this.totalElements = res.totalCount;
                this.totalPages = Math.ceil(res.totalCount / this.filterObj.pageRequest.limit);
                this.students = res.list;
                this.isLoading = false;
            }).catch((err) =>  {
                this.$toast.error(err);
                this.isLoading = false;
            });
        },

        exportAllStudents() {
            this.isLoading = true;
            this.filterObj.pageRequest.offset = 0;
            this.filterObj.pageRequest.limit = this.totalElements;
            studentService.getAllStudents(this.filterObj).then((res) => {
                if (res.list.length) {
                    this.exportStudentHeaders = ['Школа', 'Район', 'ФИО', 'Класс', 'Дата Рождения', 'Пол'];
                    this.exportStudentRows = res.list.map((i) => {
                        return [
                            i.schoolTitle,
                            i.rayonTitle,
                            i.surname+' '+i.name,
                            i.classTitle,
                            this.formatDOB(i.dateOfBirth),
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

        formatDOB(date) {
            return moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');
        },

        onLeftClick() {
            this.currentPage--;
            this.filterObj.pageRequest.offset = this.currentPage - 1;
            this.fetchStudents();
        },

        onRightClick() {
            this.currentPage++;
            this.filterObj.pageRequest.offset = this.currentPage - 1;
            this.fetchStudents();
        },

        filterStudents() {
            this.currentPage = 1;
            this.filterObj.searchRequest.query = '';
            this.filterObj.pageRequest.offset = this.currentPage - 1;
            this.fetchStudents();
        },

        fetchRayonsByRegion(regionId) {
            this.filterObj.searchRequest.schoolId = '';
            this.filterObj.searchRequest.rayonId = '';
            this.filteredSchools = [];
            rayonService.listByRegion(regionId).then((res) => {
                this.filteredRayons = res;
            });
        },

        onSelectRayon() {
            this.filteredSchools = [];
            this.filterObj.searchRequest.schoolId = '';
            this.schoolPage = 0;
            this.fetchSchoolsByRayon();
        },

        fetchSchoolsByRayon() {
            schoolService.listPageable(
                this.schoolPage,
                this.filterObj.searchRequest.regionId,
                this.filterObj.searchRequest.rayonId
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
            this.filterObj.searchRequest.schoolId = '';
            this.filterObj.searchRequest.classLevel = '';
            this.filterObj.searchRequest.regionId = '';
            this.filterObj.searchRequest.rayonId = '';
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
