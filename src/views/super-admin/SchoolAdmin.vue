<template>
    <div class="super-admin-instructors">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Администратор</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartButton @clicked="onAddAdmin">Добавить администратора +</SmartButton>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="users" :total-elements="users.length" :totalPages="totalPages" :page-size="users.length">
            <template v-slot:firstItem>
                <div>
                    <div class="select-filter-block">
                        <div class="select-actions">
                            <div class="select-clear-block">
                                <v-select
                                    :items="currentRegions"
                                    item-text="title"
                                    item-value="id"
                                    label="Регион"
                                    v-model="filterObj.regionId"
                                    @change="fetchRayonsByRegion"
                                />
                                <TrashIcon @click="clearSelect('region')" v-show="filterObj.regionId"/>
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
                                <TrashIcon @click="clearSelect('rayon')" v-show="filterObj.rayonId"/>
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
                                    @change="removeSchoolSelectScrollListener"
                                    @blur="removeSchoolSelectScrollListener"
                                />
                                <TrashIcon @click="filterObj.schoolId=''" v-show="filterObj.schoolId"/>
                            </div>
                        </div>
                        <v-btn color="primary" @click="filterSchoolAdmins">Фильтр</v-btn>
                    </div>
                </div>
            </template>
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Школа</th>
                <th>Район</th>
                <th>Логин</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.surname }} {{ item.name }} {{ item.middleName }}</td>
                <td>{{ item.schoolTitle }}</td>
                <td>{{ item.rayonTitle }}</td>
                <td>{{ item.username }}</td>
                <td><img class="clickable-icons" @click="onEdit(item)" alt="" src="../../assets/images/icons/pen.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            id="add-form"
            v-model="isAddAdmin"
            width="546"
        >
            <AddSchoolAdmin @close="onCloseModal"></AddSchoolAdmin>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
import SmartTable from '@/components/table/SmartTable';
import AddSchoolAdmin from '@/components/super-admin/school-admin/AddSchoolAdmin';
import {PersonService} from '@/_services/person.service';
import SmartButton from '@/components/button/SmartButton';
import SmartSearchInput from '@/components/input/SmartSearchInput';
import SmartSelect from '@/components/select/SmartSelect';
const personService = new PersonService();
import PreLoader from "@/components/preloader/PreLoader";
import { RayonService } from "@/_services/rayon.service";
const rayonService = new RayonService();
import {SchoolService} from '@/_services/school.service';
const schoolService = new SchoolService();
import TrashIcon from '@/components/icons/TrashIcon';

export default {
    name: 'Instructors',
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
        isAddAdmin: false,
        users: [],
	    isEdit: false,
	    user: {},
        totalPages: 1,
        isLoading: false,
        schoolPage: 0,
        filterObj: {
            regionId: '',
            rayonId: '',
            schoolId: ''
        },
        filteredRayons: [],
        filteredSchools: [],
    }),
    computed: {
        currentRegions() {
            return this.$store.state.location.regions;
        }
    },
    mounted() {
        this.fetchSchoolAdmins()
    },
    methods: {
        onAddAdmin() {
            this.isAddAdmin = true;
        },

        onCloseModal() {
            this.isAddAdmin = false;
            this.fetchSchoolAdmins()
        },

        fetchSchoolAdmins() {
            this.isLoading = true;
            personService.list(this.filterObj.regionId, this.filterObj.rayonId, this.filterObj.schoolId).then(res => {
                this.users = res;
                this.isLoading = false;
            }).catch(err => console.log(err))
        },

        fetchRayonsByRegion(regionId) {
            this.filteredSchools = [];
            this.filterObj.schoolId = '';
            this.filterObj.rayonId = '';
            rayonService.listByRegion(regionId).then((res) => {
                this.filteredRayons = res;
            });
        },

        onSelectRayon() {
            this.filteredSchools = [];
            this.schoolPage = 0;
            this.filterObj.schoolId = '';
            this.fetchSchoolsByRayon();
        },

        fetchSchoolsByRayon() {
            schoolService.listPageable(this.schoolPage, this.filterObj.regionId, this.filterObj.rayonId).then((res) => {
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

        filterSchoolAdmins() {
            this.fetchSchoolAdmins();
        },

        clearSelect(selectName) {
            if (selectName === 'region') {
                this.filterObj.regionId = '';
                this.filterObj.rayonId = '';
                this.filterObj.schoolId = '';
            } else {
                this.filterObj.rayonId = '';
                this.filterObj.schoolId = '';
            }
        },

        onEdit(item) {
            personService.getById(item.id).then(res => {
	            this.isEdit = false
	            this.user = {
	            	name: res.firstName,
		            surname: res.lastName,
		            middleName: res.middleName,
		            dob: res.dateOfBirth,
		            gender: res.gender,
		            email: res.email,
		            phone: res.phone,
	            }
            }).catch(err => console.log(err))
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-instructors {
    margin-bottom: 50px;
    .select-actions {
        display: flex;
        align-items: center;
    }
    .v-select {
        max-width: 210px;
    }
    .showAll {
        text-align: center;
        button {
            border: 1px solid #9E9E9E;
            padding: 2px 5px;
            background: #fafafa;
            border-radius: 4px;
            color: #353434;
        }
    }
}
</style>
