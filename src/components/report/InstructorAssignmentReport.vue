<template>
    <div class="assignment-report">
        <div class="header-title">
            <h3>Отчет по домашним заданиям</h3>
        </div>
        <v-form class="select-form select-clear-block" ref="form">
            <v-select
                :items="schoolQuarters"
                item-text="semester"
                item-value="id"
                label="Четверть"
                class="v-select-item"
                @change="onSelectQuarter"
            />
            <v-btn color="primary" @click="submitGenerate">Сгенерировать</v-btn>
        </v-form>

        <div class="report-content" v-if="reportAssignData.length">
            <table class="table">
                <thead>
                <tr>
                    <th>Предмет</th>
                    <th>Кол-во ДЗ</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, i) in reportAssignData" :key="i">
                    <td>{{item.courseTitle}}</td>
                    <td>{{item.assignmentCount}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    export default {
        props: {
            schoolQuarters: Array
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        data() {
            return {
                reportAssignData: [],
                startDate: '',
                endDate: ''
            }
        },
        methods: {
            onSelectQuarter(id) {
                const selectedQuarter = this.schoolQuarters.find((quarter) => quarter.id === id);
                this.startDate = new Date(selectedQuarter.startDate).toLocaleDateString('ru');
                this.endDate = new Date(selectedQuarter.endDate).toLocaleDateString('ru');
            },

            submitGenerate() {
                AnalyticsService.fetchInstructorAssignmentReport(this.userProfile.personId, this.startDate, this.endDate).then((res) => {
                    this.reportAssignData = res;
                    console.log(res);
                }).catch(err => {
                    this.$toast.error(err);
                })
            }
        }
    }
</script>
