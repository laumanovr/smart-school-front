<template>
    <div class="library-container">
        <SuperAdminSchoolHead>
            <template v-slot:title>Библиотека</template>
        </SuperAdminSchoolHead>

        <SmartTable :schools="libraries">
            <template v-slot:firstItem>
                <SmartSelect>Школа <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Класс <v-icon>$chevronDown</v-icon></SmartSelect>
                <SmartSelect>Предмет <v-icon>$chevronDown</v-icon></SmartSelect>
            </template>
            <template v-slot:head>
                <th>Книга</th>
                <th>Автор</th>
                <th>В резерве</th>
                <th>Дата запроса</th>
                <th>Кол-во</th>
                <th>Не хватает</th>
                <th>Получены</th>
                <th>В пути</th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.book }}</td>
                <td>{{ item.author }}</td>
                <td>{{ item.reserved }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ item.notEnough }}</td>
                <td>{{ item.received }}</td>
                <td>{{ item.onWay }}</td>
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
                libraries: [
                    {
                        book: 'Химия',
                        author: 'Иван Петров',
                        reserved: 12,
                        date: '25.08.2020',
                        quantity: 400,
                        notEnough: 2,
                        received: 3554,
                        onWay: 2559
                    },
                    {
                        book: 'Математика',
                        author: 'Хадижа Жанболотова',
                        reserved: 12,
                        date: '25.08.2020',
                        quantity: 400,
                        notEnough: 2,
                        received: 3554,
                        onWay: 2559
                    },
                    {
                        book: 'География',
                        author: 'Аселя Мухтарова',
                        reserved: 12,
                        date: '25.08.2020',
                        quantity: 400,
                        notEnough: 2,
                        received: 3554,
                        onWay: 2559
                    },
                    {
                        book: 'История',
                        author: 'Любовь Аксенова',
                        reserved: 12,
                        date: '25.08.2020',
                        quantity: 400,
                        notEnough: 2,
                        received: 3554,
                        onWay: 2559
                    },
                ]
            }
        }
    }
</script>
