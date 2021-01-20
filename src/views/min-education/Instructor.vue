<template>
    <div class="super-admin-instructors">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Учителя</template>
            <template v-slot:center>
                <SmartSearchInput :searchObj="filterObj.searchRequest" :searchField="'query'" @onEnter="searchByFIO"/>
                <button class="search-btn" @click="searchByFIO">Поиск</button>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="instructors"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
            :total-elements="totalElements"
            :totalPages="totalPages"
            :page-size="pageSize"
            :current-page="currentPage"
        >
            <template v-slot:firstItem>
                <div class="select-filter-block">
                    <div class="selects">
                        <div class="select-clear-block region">
                            <v-select
                                :items="currentRegions"
                                item-text="title"
                                item-value="id"
                                label="Регион"
                                v-model="filterObj.searchRequest.regionId"
                                @change="fetchRayonsByRegion"
                            />
                            <TrashIcon @click="clearSelect('region')" v-show="filterObj.searchRequest.regionId"/>
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
                            <TrashIcon @click="clearSelect('rayon')" v-show="filterObj.searchRequest.rayonId"/>
                        </div>

                        <div class="select-clear-block school">
                            <v-select
                                :items="filteredSchools"
                                item-text="name"
                                item-value="id"
                                label="Школа"
                                v-model="filterObj.searchRequest.schoolId"
                                :menu-props="{contentClass: 'schoolSelect'}"
                                @click="addScrollListenerSchoolSelect"
                                @change="removeSchoolSelectScrollListener"
                                @blur="removeSchoolSelectScrollListener"
                            />
                            <TrashIcon @click="filterObj.searchRequest.schoolId=''" v-show="filterObj.searchRequest.schoolId"/>
                        </div>

                        <div class="select-clear-block">
                            <v-select
                                :items="allAdminCourses"
                                item-text="title"
                                item-value="code"
                                label="Предмет"
                                v-model="filterObj.searchRequest.courseCode"
                            />
                            <TrashIcon @click="filterObj.searchRequest.courseCode=''" v-show="filterObj.searchRequest.courseCode"/>
                        </div>
                    </div>
                    <v-btn color="primary" @click="filterTeachers">Фильтр</v-btn>
                </div>
            </template>
            <template v-slot:head>
                <th class="sort" @click="sortBy('school')">Школа</th>
                <th class="sort" @click="sortBy('name')">Ф.И.О</th>
                <th>Предмет</th>
                <th>Пол</th>
                <th>Дата рождения</th>
                <th class="sort" @click="sortBy('rayon')">Район</th>
                <th>Телефон</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.schools[0].name }}</td>
                <td>{{ item.lastName }} {{ item.firstName }}</td>
                <td class="instr-courses">
                    <template v-if="item.courses.length">
                        <span v-for="course in item.courses">{{ course[langObj[currentLang]] }},</span>
                    </template>
                    <span v-else></span>
                </td>
                <td>{{ gender[item.gender] }}</td>
                <td>{{ item.birthDay }}</td>
                <td>{{ item.schools[0].rayonTitle }}</td>
                <td>{{ item.phone }}</td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchoolAdmin from '@/components/super-admin/school-admin/AddSchoolAdmin'
import {PersonService} from '@/_services/person.service'
import SmartButton from '@/components/button/SmartButton'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartSelect from '@/components/select/SmartSelect'
import InstructorService from "@/_services/instructor.service";
import PreLoader from "@/components/preloader/PreLoader";
import { RayonService } from "@/_services/rayon.service";
const rayonService = new RayonService();
import {SchoolService} from '@/_services/school.service';
const schoolService = new SchoolService();
import {AdminCourseService} from '@/_services/admin-course.service';
const adminCourseService = new AdminCourseService();
import TrashIcon from '@/components/icons/TrashIcon';

export default {
    name: 'Instructor',
    components: {
        SmartSelect,
        SmartSearchInput,
        SmartButton,
        SuperAdminSchoolHead,
        SmartTable,
        AddSchoolAdmin,
        PreLoader,
        TrashIcon
    },
    data: () => ({
        langObj: {
            ru: 'courseTitle',
            kg: 'courseTitleKG',
            en: 'courseCode',
        },
        isAddAdmin: false,
        instructors: [],
        gender: {
            FEMALE: 'Ж',
            MALE: 'М'
        },
        totalElements: 0,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
        isLoading: false,
        schoolPage: 0,
        filteredRayons: [],
        filteredSchools: [],
        allAdminCourses: [],
        filterObj: {
            pageRequest: {
                limit: 10,
                offset: 0
            },
            searchRequest: {
                query: '',
                regionId: '',
                rayonId: '',
                schoolId: '',
                courseCode: '',
                sortByLastname: false,
                sortByRayon: false,
                sortBySchool: true
            }
        }
    }),

    computed: {
        currentRegions() {
            return this.$store.state.location.regions;
        },
        currentLang() {
            return this.$root.$i18n.locale;
        }
    },
    mounted() {
        this.fetchTeachers();
        this.fetchAllAdminCourses();
    },
    methods: {
        fetchTeachers() {
            this.instructors = [];
            this.isLoading = true;
            InstructorService.responseList(this.filterObj).then(res => {
                this.totalElements = res.totalCount;
                this.totalPages = Math.ceil(this.totalElements / 10);
                if (res.list.length) {
                    this.instructors = res.list;
                }
                this.isLoading = false;
            }).catch(err => console.log(err))
        },

        fetchRayonsByRegion(regionId) {
            this.filteredSchools = [];
            this.filterObj.searchRequest.schoolId = '';
            this.filterObj.searchRequest.rayonId = '';
            rayonService.listByRegion(regionId).then((res) => {
                this.filteredRayons = res;
            });
        },

        onSelectRayon() {
            this.schoolPage = 0;
            this.filteredSchools = [];
            this.filterObj.searchRequest.schoolId = '';
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

        filterTeachers() {
            this.currentPage = 1;
            this.filterObj.pageRequest.offset = 0;
            this.filterObj.searchRequest.query = '';
            this.fetchTeachers();
        },

        fetchAllAdminCourses() {
            adminCourseService.list().then((res) => {
                this.allAdminCourses = res;
            })
        },

        sortBy(column) {
            if (column === 'school') {
                this.filterObj.searchRequest.sortBySchool = true;
                this.filterObj.searchRequest.sortByLastname = false;
                this.filterObj.searchRequest.sortByRayon = false;
            } else if (column === 'name') {
                this.filterObj.searchRequest.sortBySchool = false;
                this.filterObj.searchRequest.sortByLastname = true;
                this.filterObj.searchRequest.sortByRayon = false;
            } else {
                this.filterObj.searchRequest.sortBySchool = false;
                this.filterObj.searchRequest.sortByLastname = false;
                this.filterObj.searchRequest.sortByRayon = true;
            }
            this.fetchTeachers();
        },

        clearSelect(selectName) {
            if (selectName === 'region') {
                this.filterObj.searchRequest.regionId = '';
                this.filterObj.searchRequest.rayonId = '';
                this.filterObj.searchRequest.schoolId = '';
                this.filterObj.searchRequest.courseCode = '';
            } else {
               this.filterObj.searchRequest.rayonId = '';
               this.filterObj.searchRequest.schoolId = '';
            }
        },

        searchByFIO() {
            this.filterObj.searchRequest.regionId = '';
            this.filterObj.searchRequest.rayonId = '';
            this.filterObj.searchRequest.schoolId = '';
            this.filterObj.searchRequest.courseCode = '';
            this.filterObj.pageRequest.offset = 0;
            this.currentPage = 1;
            this.fetchTeachers();
        },

        onAddAdmin() {
            this.isAddAdmin = true
        },
        onCloseModal() {
            this.isAddAdmin = false;
            this.filterObj.pageRequest.offset = 0;
            this.fetchTeachers()
        },

        onLeftClick () {
            this.currentPage--;
            this.filterObj.pageRequest.offset -= 10;
            this.fetchTeachers();
        },
        onRightClick () {
            this.currentPage++;
            this.filterObj.pageRequest.offset += 10;
            this.fetchTeachers();
        },
        showCourses (courses) {
            let c = '';
            if (courses && courses.length) {
                courses.forEach((i, index) => {
                    if (index !== courses.length - 1) c += i + ', ';
                    else c += i;
                })
            }
            return c;
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-instructors {
    margin-bottom: 50px;
    .selects {
        display: flex;
        flex-wrap: wrap;
        max-width: 540px;
        .region,.school {
            margin-right: 20px;
        }
    }
    .v-select {
        max-width: 220px;
    }
    .instr-courses {
        span {
            margin-right: 5px;
        }
    }
    th.sort {
        cursor: pointer;
    }
}
</style>
