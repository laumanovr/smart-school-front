<template>
    <div class="admin-report-container">
        <div class="header-title">
            <h3>Отчеты</h3>
            <v-select
                class="v-select-item"
                placeholder="Выбрать"
                :items="reportTypes"
                item-text="title"
                item-value="type"
                @change="changeReport"
            />
        </div>
        <template v-if="reportType == 'performance'">
            <AllClassesQualityReport
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
            />
        </template>
        <template v-if="reportType == 'activity'">
            <AllClassActivityReport
                :allChronicleYears="allChronicleYears"
                :schoolQuarters="schoolQuarters"
            />
        </template>
    </div>
</template>

<script>
    import AllClassesQualityReport from '@/components/report/AllClassesQualityReport';
    import AllClassActivityReport from '@/components/report/AllClassActivityReport';
    import {ChronicleService} from '@/_services/chronicle.service';
    const chronicleService = new ChronicleService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();

    export default {
        components: {
            AllClassesQualityReport,
            AllClassActivityReport
        },
        data() {
            return {
                reportType: '',
                allChronicleYears: [],
                schoolQuarters: [],
                reportTypes: [
                    {title: 'Отчет по движению', type: 'activity'},
                    {title: 'Отчет по качеству знаний', type: 'performance'}
                ]
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        created() {
            this.getAllChronicleYears();
            this.getSchoolQuarters();
        },
        methods: {
            getAllChronicleYears() {
                chronicleService.list().then((res) => {
                    this.allChronicleYears = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getSchoolQuarters() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            changeReport(type) {
                this.reportType = type;
            }
        }
    }
</script>

<style lang="scss">
    .admin-report-container {
        margin: 25px;
        .header-title {
            display: flex;
            align-items: center;
            .v-select-item {
                margin-left: 25px;
            }
        }
    }
</style>
