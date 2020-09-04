<template>
    <div class="super-admin-schools">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead @addSchool="onAddSchool">
            <template v-slot:title>Школы</template>
            <template v-slot:center>
                <SmartButton @clicked="onAddSchool">Добавить Школу +</SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <ExcelJs :rows="exportRows" :headers="exportHeaders" :file-name="exportName"></ExcelJs>
                <SmartBtn2>Распечатать</SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="schools"
            :total-elements="totalElements"
            :page-size="pageSize"
            :current-page="currentPage"
            :totalPages="totalPages"
            @leftClick="onLeftClick"
            @rightClick="onRightClick"
        >
            <template v-slot:firstItem>
                <SmartSelect>Область
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
                <SmartSelect>Район
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
            </template>
            <template v-slot:head>
                <th>№</th>
                <th>Название</th>
                <th>Электронная Почта</th>
                <th>Номер телефона</th>
                <!--				<th>Адрес</th>-->
                <th>Тип Школы</th>
                <th>Язык</th>
                <th>Район</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ (currentPage - 1) * 10 + item.index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ schoolTypes[item.schoolType] }}</td>
                <td>{{ lang[item.language] }}</td>
                <td>{{ item.rayonTitle }}</td>
                <td><img class="clickable-icons" @click="onEdit(item)" alt="" src="../../assets/images/icons/pen.svg"></td>
                <td><img class="clickable-icons" @click="onDelete(item)" alt="" src="../../assets/images/icons/trash.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            v-if="isAddSchool"
            id="add-form"
            v-model="isAddSchool"
            width="546"
        >
            <AddSchool @close="onCLoseModal" :edit-school="school" :is-edit="isEdit">

            </AddSchool>
        </v-dialog>
        <v-dialog
            max-width="450"
            v-model="isDeleting"
        >
            <DeletePopup @cancel="isDeleting = false" @accept="deleteSchool"></DeletePopup>
        </v-dialog>
    </div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddSchool from '@/components/super-admin/schools/AddSchool'
import {SchoolService} from '@/_services/school.service'
import SmartSearchInput from '@/components/input/SmartSearchInput'
import SmartButton from '@/components/button/SmartButton'
import SmartBtn2 from '@/components/button/SmartBtn2'
import SmartSelect from '@/components/select/SmartSelect'
import ExcelJs from "@/components/excel-export/ExcelJs";
import DeletePopup from "@/components/delete-popup/DeletePopup";
const schoolService = new SchoolService();
import PreLoader from "@/components/preloader/PreLoader";

export default {
    name: 'Schools',
    components: {
        DeletePopup,
        ExcelJs,
        PreLoader,
        SmartSelect, SmartBtn2, SmartButton, SmartSearchInput, AddSchool, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAddSchool: false,
        schools: [],
        totalElements: 0,
        pageSize: 0,
        currentPage: 1,
        exportRows: [],
        exportHeaders: [],
        exportName: '',
        schoolTypes: {
            PUBLIC: 'Государственный',
            PRIVATE: 'Частный'
        },
        lang: {
            KG: 'КГ',
            RU: 'РУ',
            EN: 'EN'
        },
        school: {},
        isEdit: false,
        isDeleting: false,
        totalPages: 0,
        isLoading: false,
    }),
    mounted() {
        this.fetchSchools(0)
    },
    methods: {
        onAddSchool() {
            this.school = {};
            this.isAddSchool = true
            this.isEdit = false
        },
        fetchSchools(page) {
            this.isLoading = true;
            schoolService.listPageable(page).then(res => {
                this.totalElements = res.page.totalElements;
                this.pageSize = res.page.pageSize;
                this.totalPages = res.page.totalPages;
                this.currentPage = res.page.number + 1
                if (res._embedded) {
                    this.schools = res._embedded.schoolResourceList.map((i, index) => {
                    	i.index = index
	                    return i
                    })
                } else this.schools = []
                this.exportHeaders = ['Название', 'Электронная Почта', 'Номер телефона', 'Тип Школы', 'Язык', 'Район']
                this.exportRows = this.schools.map(i => {
                    return [i.name, i.email, i.phone, this.schoolTypes[i.schoolType], this.lang[i.language], i.rayonTitle];
                });
                this.exportName = 'Умная школа: Школы';
                this.isLoading = false;
            }).catch(err => {
                console.log(err);
                this.isLoading = false;
            })
        },
        onCLoseModal() {
            this.isAddSchool = false;
            this.fetchSchools(this.currentPage - 1);
        },
        onLeftClick () {
            this.currentPage--;
            this.fetchSchools(this.currentPage - 1);
        },
        onRightClick () {
            this.currentPage++;
            this.fetchSchools(this.currentPage - 1);
        },
        onEdit (item) {
            schoolService.getById(item.id).then(res => {
                this.isEdit = true;
                this.school = res;
                this.isAddSchool = true;
            }).catch(err => console.log(err));
        },
        onDelete (item) {
            this.school = item;
            this.isDeleting = true;
        },
        deleteSchool () {
            schoolService._delete(this.school.id).then(res => {
                this.$toast.success('Успешно удалено');
                this.fetchSchools(0)
                this.isDeleting = false;
            }).catch(err => {
                this.isDeleting = false;
                console.log(err)
                this.$toast.error(err);
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-schools {
    margin-bottom: 50px;
}
</style>
