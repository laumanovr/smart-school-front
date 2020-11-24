<template>
    <div class="dashboard__body">
        <PreLoader v-if="isLoading"/>
        <!--<div>-->
        <!--<div>-->
        <!--<div>-->
        <!--<img src="../../assets/images/temporary/teacher-active.svg" alt="">-->
        <!--</div>-->
        <!--<div>-->
        <!--<img src="../../assets/images/temporary/lesson-lost.svg" alt="">-->
        <!--<img src="../../assets/images/temporary/lesson-hours.svg" alt="">-->
        <!--</div>-->
        <!--</div>-->
        <!--<img src="../../assets/images/temporary/std-avg.svg" alt="">-->
        <!--<img src="../../assets/images/temporary/school-perf.svg" alt="">-->
        <!--</div>-->

        <div class="header-title">
            <h3>Аналитика</h3>
        </div>

        <div class="total-quantity" v-if="currentSchool.schoolId">
            <div class="total-block teachers">
                <img src="../../assets/images/vector-quantity.svg" alt="">
                <span class="text">Кол-во учителей</span>
                <span class="numbers">{{ currentSchool.totalInstructors }}</span>
            </div>
            <div class="total-block students">
                <img src="../../assets/images/vector-quantity.svg" alt="">
                <span class="text">Кол-во учеников</span>
                <span class="numbers">{{ currentSchool.totalStudents }}</span>
            </div>
        </div>

        <div class="select-track-data">
            <div class="date-picker">
                <v-menu
                    v-model="showPickerStart"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="trackObj.startDate"
                            label="От"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            v-on="on"/>
                    </template>
                    <v-date-picker v-model="dateStart" @input="onSelectTrackDate('showPickerStart')"></v-date-picker>
                </v-menu>
            </div>
            <div class="date-picker">
                <v-menu
                    v-model="showPickerEnd"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="trackObj.endDate"
                            label="До"
                            prepend-icon="event"
                            readonly
                            v-bind="attrs"
                            v-on="on"/>
                    </template>
                    <v-date-picker v-model="dateEnd" @input="onSelectTrackDate('showPickerEnd')"></v-date-picker>
                </v-menu>
            </div>
            <v-select
                :items="roles"
                :item-text="getRoleName"
                item-value="id"
                label="Роль"
                :rules="required"
                v-model="trackObj.roleId"
            />
            <v-btn color="primary" @click="getAnalytics">Показать</v-btn>
        </div>

        <div class="role-title" v-if="currentRole">
            <h3>{{ $t(`roles.${currentRole}`) }}</h3>
        </div>

        <!--TABLE CONTENT-->
        <table class="analytics table bordered">
            <thead>
            <tr>
                <th>№</th>
                <th>Ф.И.О</th>
                <th>Заходит в систему (кол-во)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user, i) in currentSchool.active" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.count }}</td>
            </tr>
            </tbody>
        </table>

        <div class="empty-data" v-if="!currentSchool.active">Ничего нет</div>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import moment from 'moment';
    import {RoleService} from '@/_services/role.service';
    const roleService = new RoleService();
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        name: 'SuperAdminDashboard',
        components: {
            PreLoader
        },

        data() {
            return {
                required: [v => !!v || this.$t('required')],
                trackObj: {
                    startDate: '',
                    endDate: moment().format('DD.MM.YYYY'),
                    roleId: '',
                },
                showPickerStart: false,
                showPickerEnd: false,
                isLoading: false,
                dateStart: '',
                dateEnd: moment().format('YYYY-MM-DD'),
                currentRole: '',
                roles: [],
                currentSchool: {
                    active: []
                }
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
            this.setPreviousMonth();
            this.fetchAllRoles();
        },

        methods: {
            setPreviousMonth() {
                const dateMonthAgo = new Date().setMonth(new Date().getMonth() - 1);
                this.trackObj.startDate = moment(dateMonthAgo).format('DD.MM.YYYY');
                this.dateStart = moment(dateMonthAgo).format('YYYY-MM-DD');
            },

            fetchAllRoles() {
                const activeRoles = ['ROLE_INSTRUCTOR', 'ROLE_STUDENT'];
                roleService.listPageable().then((res) => {
                    res.forEach((roleObj) => {
                        if (activeRoles.includes(roleObj.code)) {
                            this.roles.push(roleObj);
                        }
                    });
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            onSelectTrackDate(picker) {
                this.trackObj.startDate = moment(this.dateStart, 'YYYY-MM-DD').format('DD.MM.YYYY');
                this.trackObj.endDate = moment(this.dateEnd, 'YYYY-MM-DD').format('DD.MM.YYYY');
                this[picker] = false;
            },

            getRoleName(roleObj) {
                if (roleObj.code) {
                    return this.$t(`roles.${roleObj.code}`);
                }
            },

            getAnalytics() {
                if (!this.trackObj.roleId) {
                    this.$toast.info('Выберите роль');
                    return;
                }
                this.isLoading = true;
                this.currentRole = this.roles.find((role) => role.id === this.trackObj.roleId).code;
                this.currentSchool.active = null;

                AnalyticsService.userTrackPage(
                    `${this.trackObj.startDate} 24:00`,
                    `${this.trackObj.endDate} 24:00`,
                    this.trackObj.roleId,
                    this.school.id
                ).then((res) => {
                    if (res.length && res[0].active && res[0].active.length) {
                        this.currentSchool = Object.assign({}, res[0], {
                            active: res[0].active.sort((a, b) => b.count - a.count)
                        });
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },
        },

    }
</script>

<style lang="scss" scoped>
    .dashboard__body {
        margin: 30px;
        .header-title {
            margin-bottom: 15px;
        }

        .total-quantity {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 35px;
            .total-block {
                position: relative;
                .text {
                    position: absolute;
                    white-space: nowrap;
                    right: 30px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .numbers {
                    position: absolute;
                    left: 26px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 60px;
                    text-align: center;
                }
                &.teachers {
                    margin-right: 20px;
                }
                &.students {
                }
                img {
                    border-radius: 10px;
                }
            }
        }

        .select-track-data {
            display: flex;
            align-items: center;
            justify-content: center;
            .date-picker {
                max-width: 180px;
                margin-right: 15px;
            }
            .v-select {
                max-width: 210px;
                margin-right: 15px;
            }
            .school-select {
                display: flex;
                align-items: center;
                margin-right: 20px;
                .v-select {
                    margin-right: 5px;
                    max-width: 200px;
                }
            }
        }

        .role-title {
            text-align: center;
            h3 {
                color: #1890f0;
            }
        }

        table.analytics {
            max-width: 1024px;
            margin: 30px auto 0;
            th {
                white-space: nowrap;
            }
            th, td {
                font-weight: bold;
            }
        }

        .empty-data {
            width: 1024px;
            margin: 15px auto 0;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
        }

        /*> div {*/
        /*display: flex;*/
        /*justify-content: space-evenly;*/
        /*margin: 20px 0;*/
        /*}*/
        /*> div:first-child {*/
        /*img {*/
        /*width: 20%;*/
        /*}*/
        /*}*/
        /*> div:last-child {*/
        /*> div {*/
        /*width: 44%;*/
        /*> div:first-child {*/
        /*img {*/
        /*width: 100%;*/
        /*}*/
        /*}*/
        /*div:last-child {*/
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*margin-top: 10px;*/
        /*}*/
        /*img {*/
        /*width: 48%;*/
        /*}*/
        /*}*/
        /*img {*/
        /*width: 20%;*/
        /*}*/
        /*}*/
    }
</style>
