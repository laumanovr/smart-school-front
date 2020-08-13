<template>
    <div class="quarter-calendar page-space">
        <SuperAdminSchoolHead>
            <template v-slot:title>
                <div class="header-title">
                    <h3>Четверть</h3>
                </div>
            </template>
            <template v-slot:right>
                <md-button class="md-primary md-raised" @click="generateQuarters">Сгенерировать</md-button>
            </template>
        </SuperAdminSchoolHead>

        <div class="content-block">
            <div class="all-quarters">
                <div class="quarter" v-for="quarter in schoolQuarters" :key="quarter.id">
                    <span>{{quarterTitle[quarter.semester]}}</span>
                    <span>
                        <md-datepicker v-model="quarter.startDate" md-immediately />
                    </span>
                    <span>
                        <md-datepicker v-model="quarter.endDate" md-immediately />
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import moment from 'moment';

    export default {
        name: 'quarter',
        components: {
            SuperAdminSchoolHead
        },

        data() {
            return {
                quarterTitle: {
                  '1': 'I четверть',
                  '2': 'II четверть',
                  '3': 'III четверть',
                  '4': 'IV четверть',
                },
                schoolQuarters: []
            }
        },

        computed: {
            userProfile () {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },

        mounted() {
            this.getQuartersBySchool();
        },

        methods: {
            getQuartersBySchool() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.map((quarter) => {
                        quarter.startDate = new Date(quarter.startDate);
                        quarter.endDate = new Date(quarter.endDate);
                        return quarter;
                    });
                }).catch((err) => this.$toast.error(err.message));
            },

            generateQuarters() {
                if (!this.schoolQuarters.length) {
                    quarterService.generateQuarter(this.school.id, this.school.chronicleId).then(() => {
                        this.getQuartersBySchool()
                    }).catch((err) => this.$toast.error(err.message));
                }
            },


        }

    }
</script>

<style lang="scss" scoped>
    .quarter-calendar {
            .all-quarters {
                background: #fff;
                width: 865px;
                margin: 0 auto;
                padding: 20px;
                border-radius: 8px;
                .quarter {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span {
                        display: inline-block;
                        margin-right: 20px;
                    }
                }
            }
    }

</style>
