<template>
    <div class="super-admin-schools">
        <SuperAdminSchoolHead @addSchool="onAddSchool">
            <template v-slot:title>Школы</template>
            <template v-slot:center>
                <SmartButton @clicked="onAddSchool">Добавить Школу +</SmartButton>
                <SmartSearchInput></SmartSearchInput>
            </template>
            <template v-slot:right>
                <SmartBtn2>Распечатать</SmartBtn2>
                <SmartBtn2>Экспорт</SmartBtn2>
            </template>
        </SuperAdminSchoolHead>
        <SmartTable :schools="schools">
            <template v-slot:firstItem>
                <SmartSelect>Область
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
                <SmartSelect>Район
                    <v-icon>$chevronDown</v-icon>
                </SmartSelect>
            </template>
            <template v-slot:head>
                <th>Название</th>
                <th>Электронная Почта</th>
                <th>Номер телефона</th>
                <!--				<th>Адрес</th>-->
                <th>Тип Школы</th>
                <th>Язык</th>
                <th>Район</th>
                <th><img alt="" src="../../assets/images/icons/plus.svg"></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ schoolTypes[item.schoolType] }}</td>
                <td>{{ item.language }}</td>
                <td>{{ item.rayonTitle }}</td>
                <td><img alt="" src="../../assets/images/icons/pen.svg"></td>
            </template>
        </SmartTable>
        <v-dialog
            id="add-form"
            v-model="isAddSchool"
            width="546"
        >
            <AddSchool @close="onCLoseModal">

            </AddSchool>
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

const schoolService = new SchoolService()

export default {
    name: 'Schools',
    components: {SmartSelect, SmartBtn2, SmartButton, SmartSearchInput, AddSchool, SuperAdminSchoolHead, SmartTable},
    data: () => ({
        isAddSchool: false,
        schools: [],
        schoolTypes: {
            PUBLIC: 'Государственный',
            PRIVATE: 'Частный'
        },
    }),
    mounted() {
        this.fetchSchools()
    },
    methods: {
        onAddSchool() {
            this.isAddSchool = true
        },
        fetchSchools() {
            schoolService.listPageable(0).then(res => {
                if (res._embedded) {
                    this.schools = res._embedded.schoolResourceList
                } else this.schools = []
            }).catch(err => {
                console.log(err)
            })
        },
        onCLoseModal() {
            this.isAddSchool = false
            this.fetchSchools()
        }
    }
}
</script>

<style lang="scss" scoped>
.super-admin-schools {
}
</style>
