<template>
    <div class="announcements-container">
        <SuperAdminSchoolHead>
            <template v-slot:title>Объявления</template>
            <template v-slot:center>
                <SmartSearchInput></SmartSearchInput>
                <SmartButton>
                    Добавить объявление <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
            </template>
        </SuperAdminSchoolHead>

        <SmartTable :schools="announcements">
            <template v-slot:firstItem>
                <SmartSelect>Исходящие <v-icon>$chevronDown</v-icon></SmartSelect>
            </template>
            <template v-slot:head>
                <th>Тема</th>
                <th>Дата</th>
                <th>Автор</th>
                <th></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.theme }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.author }}</td>
                <td><img src="../../assets/images/icons/pen.svg" alt=""></td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import SmartTable from '@/components/table/SmartTable';
    import SmartButton from '@/components/button/SmartButton';
    import SmartSearchInput from '@/components/input/SmartSearchInput';
    import SmartBtn2 from '@/components/button/SmartBtn2';
    import SmartSelect from '@/components/select/SmartSelect';

    export default {
        components: {
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable
        },

        data() {
            return {
                announcements: [
                    {theme: 'Это тема объявлении 1', date: '25.08.2020', author: 'Иван Петров'},
                    {theme: 'Это тема объявлении 2', date: '26.08.2020', author: 'Иван Петров'},
                    {theme: 'Это тема объявлении 3', date: '27.08.2020', author: 'Иван Петров'},
                    {theme: 'Это тема объявлении 4', date: '28.08.2020', author: 'Марина Соколова'},
                ]
            }
        }
    }
</script>
