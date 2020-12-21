<template>
    <div class="quarter-calendar page-space">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>
                <div class="header-title">
                    <h3>Сгенерируйте четверть</h3>
                </div>
            </template>
            <template v-slot:right>
                <v-btn color="primary" @click="generateQuarters">Сгенерировать</v-btn>
            </template>
        </SuperAdminSchoolHead>

        <div class="content-block" v-if="schoolQuarters.length">
            <div class="all-quarters">
                <div class="quarter" v-for="quarter in schoolQuarters" :key="quarter.id">
                    <span class="quarter-name">{{quarterTitle[quarter.semester]}}</span>
                    <div class="date-from">
                        <v-menu
                            v-model="quarter.showPickerFrom"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="quarter.startDate"
                                    label="От"
                                    prepend-icon="event"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"/>
                            </template>
                            <v-date-picker
                                v-model="quarter.dateStart"
                                @input="onSelectQuarterDate(quarter, 'showPickerFrom')"
                            ></v-date-picker>
                        </v-menu>
                    </div>
                    <div>
                        <v-menu
                            v-model="quarter.showPickerTo"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="quarter.endDate"
                                    label="До"
                                    prepend-icon="event"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"/>
                            </template>
                            <v-date-picker
                                v-model="quarter.dateEnd"
                                @input="onSelectQuarterDate(quarter, 'showPickerTo')"
                            ></v-date-picker>
                        </v-menu>
                    </div>
                </div>
            </div>
            <div class="btn-actions">
                <div class="save">
                    <v-btn color="green" @click="submitSave">Сохранить</v-btn>
                </div>
                <div class="next">
                    <router-link :to="{name: 'setInitQuarter'}" class="forward">Далее >></router-link>
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
    import PreLoader from "@/components/preloader/PreLoader";

    export default {
        name: 'quarter',
        components: {
            SuperAdminSchoolHead,
            PreLoader
        },

        data() {
            return {
                isLoading: false,
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
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },

        mounted() {
            this.isLoading = true;
            this.getQuartersBySchool();
            this.$nextTick(() => {
                this.disableOtherElements();
            });
        },

        methods: {
            disableOtherElements() {
                const header = document.querySelector('.super-admin-header');
                const sidebar = document.querySelector('.super-admin-sidebar');
                header.style.filter = 'blur(15px)';
                header.style.pointerEvents = 'none';
                sidebar.style.filter = 'blur(15px)';
                sidebar.style.pointerEvents = 'none';
            },

            getQuartersBySchool() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.map((quarter) => {
                        quarter.dateStart = quarter.startDate;
                        quarter.dateEnd = quarter.endDate;
                        quarter.startDate = moment(quarter.startDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
                        quarter.endDate = moment(quarter.endDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
                        quarter.showPickerFrom = false;
                        quarter.showPickerTo = false;
                        quarter.status = true;
                        return quarter;
                    }).sort((a, b) => a.semester - b.semester);
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            generateQuarters() {
                if (!this.schoolQuarters.length) {
                    this.isLoading = true;
                    quarterService.generateQuarter(this.school.id, this.school.chronicleId).then(() => {
                        this.getQuartersBySchool()
                    }).catch((err) => this.$toast.error(err));
                }
            },

            onSelectQuarterDate(quarter, showPicker) {
                quarter[showPicker] = false;
                quarter.startDate = moment(quarter.dateStart, 'YYYY-MM-DD').format('DD.MM.YYYY');
                quarter.endDate = moment(quarter.dateEnd, 'YYYY-MM-DD').format('DD.MM.YYYY');
            },

            async submitSave() {
                this.isLoading = true;
                const requests = this.schoolQuarters.map((quarter) => {
                    return new Promise((resolve, reject) => {
                        quarterService.edit(quarter).then((res) => {
                            resolve(res);
                        }).catch((err) => {
                            reject(err);
                            this.$toast.error(err);
                            this.isLoading = false;
                        });
                    })
                });
                const results = await Promise.all(requests);
                if (results.length) {
                    this.$toast.success('Успешно!');
                    this.isLoading = false;
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
                .quarter-name, .date-from {
                    margin-right: 20px;
                }
            }
        }
        .btn-actions {
            width: 865px;
            margin: 15px auto;
            justify-content: inherit;
            .save, .next {
                width: 50%;
                text-align: right;
                button {
                    margin: 0;
                    max-width: 125px;
                }
                .forward {
                    background: #3958ff;
                    color: #fff;
                    padding: 7px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                }
            }
        }
    }
</style>
