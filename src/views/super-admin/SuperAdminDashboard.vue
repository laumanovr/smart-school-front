<template>
    <div class="dashboard__body">
        <PreLoader v-if="isLoading"/>
        <!--<div>-->
        <!--<img src="../../assets/images/temporary/students.svg" alt="">-->
        <!--<img src="../../assets/images/temporary/teachers-avg.svg" alt="">-->
        <!--<img src="../../assets/images/temporary/attendance.svg" alt="">-->
        <!--<img src="../../assets/images/temporary/homework.svg" alt="">-->
        <!--</div>-->
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
                    <v-date-picker :max="dateEnd" locale="ru-RU" v-model="dateStart" @input="onSelectTrackDate('showPickerStart')"></v-date-picker>
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
                    <v-date-picker :max="dateEnd" locale="ru-RU" v-model="dateEnd" @input="onSelectTrackDate('showPickerEnd')"></v-date-picker>
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
            <div class="school-select">
                <v-autocomplete
                    :items="schools"
                    item-text="name"
                    item-value="id"
                    label="Школа"
                    v-model="trackObj.schoolId"
                    clearable
                    hide-no-data
                    :loading="schoolLoader"
                    :search-input.sync="searchSchool"
                    @change="onSelectSchool"
                />
            </div>
            <v-btn color="primary" @click="getAnalytics">Показать</v-btn>
        </div>

        <div class="role-title" v-if="currentRole">
            <h3>{{ $t(`roles.${currentRole}`) }}</h3>
        </div>
        <!--Table Content-->
        <table class="analytics table bordered">
            <thead>
            <tr>
                <th>№</th>
                <th>Школа</th>
                <th>Общее кол-во</th>
                <th>Заходит в систему</th>
                <th>%</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(data, i) in analyticsData" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ data.schoolName }}</td>
                <td>{{ data[getSpecificRoleCount()] }}</td>
                <td>{{ data.active.length }}</td>
                <td>{{ data.inPercent }}%</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import AnalyticsService from '@/_services/analytics.service';
    import moment from 'moment';
    import {RoleService} from '@/_services/role.service';
    const roleService = new RoleService();
    import {SchoolService} from '@/_services/school.service';
    const schoolService = new SchoolService();
    import TrashIcon from '@/components/icons/TrashIcon';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        name: 'SuperAdminDashboard',
        components: {
            TrashIcon,
            PreLoader
        },

        data() {
            return {
                required: [v => !!v || this.$t('required')],
                trackObj: {
                    startDate: '',
                    endDate: moment().format('DD.MM.YYYY'),
                    roleId: '',
                    schoolId: ''
                },
                showPickerStart: false,
                showPickerEnd: false,
                isLoading: false,
                typingTimer: null,
                isTimerBlock: false,
                schoolLoader: false,
                dateStart: '',
                dateEnd: moment().format('YYYY-MM-DD'),
                currentRole: '',
                searchSchool: '',
                roles: [],
                schools: [],
                analyticsData: []
            }
        },

        async created() {
            this.setPreviousMonth();
            await this.fetchAllRoles();
        },

        methods: {
            setPreviousMonth() {
                const dateMonthAgo = new Date().setMonth(new Date().getMonth() - 1);
                this.trackObj.startDate = moment(dateMonthAgo).format('DD.MM.YYYY');
                this.dateStart = moment(dateMonthAgo).format('YYYY-MM-DD');
            },

            fetchAllRoles() {
                const activeRoles = ['ROLE_INSTRUCTOR', 'ROLE_STUDENT', 'ROLE_ADMIN'];
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

            fetchAllSchools(searchQuery = '') {
                schoolService.listPageable(0, '', '', searchQuery).then((res) => {
                    if (res._embedded) {
                        this.schools = res._embedded.schoolResourceList;
                    }
                    this.isLoading = false;
                    this.schoolLoader = false;
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

            getSpecificRoleCount() {
                const rolesObj = {
                    ROLE_INSTRUCTOR: 'totalInstructors',
                    ROLE_STUDENT: 'totalStudents',
                    ROLE_ADMIN: 'totalAdmins'
                };
                return rolesObj[this.currentRole];
            },

            countPercent(uniqueUsers, allUsers) {
                if (allUsers) {
                    const result = (uniqueUsers / allUsers) * 100;
                    return result.toFixed(1);
                }
                return 0;
            },

            getAnalytics() {
                if (this.dateEnd < this.dateStart) {
                    this.$toast.info('Дата окончания не может быть раньше чем начала!');
                    return;
                }
                if (!this.trackObj.roleId) {
                    this.$toast.info('Выберите роль');
                    return;
                }
                this.isLoading = true;
                this.analyticsData = [];
                this.currentRole = this.roles.find((role) => role.id === this.trackObj.roleId).code;

                AnalyticsService.userTrackPage(
                    `${this.trackObj.startDate} 24:00`,
                    `${this.trackObj.endDate} 24:00`,
                     this.trackObj.roleId,
                     this.trackObj.schoolId
                ).then((res) => {
                    this.analyticsData = res.map((school) => {
                        school.totalAdmins = 1;
                        school.totalStudents = !school.totalStudents ? 0 : school.totalStudents;
                        school.active = !school.active ? [] : school.active;
                        school.inPercent = this.countPercent(school.active.length, school[this.getSpecificRoleCount()]);
                        return school;
                    }).sort((a, b) => b.inPercent - a.inPercent);
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            onSelectSchool() {
                this.isTimerBlock = true;
                setTimeout(() => {
                    this.isTimerBlock = false;
                }, 3000)
            },
        },

        watch: {
            searchSchool(inputValue) {
                clearTimeout(this.typingTimer);
                this.typingTimer = null;
                if (!inputValue) {
                    this.schools = [];
                    return;
                }
                if (!this.isTimerBlock) {
                    this.schoolLoader = true;
                    this.typingTimer = setTimeout(() => {
                        this.fetchAllSchools(inputValue);
                    }, 900);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dashboard__body {
        margin: 30px;
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

        /*----------------------------------------------------------*/
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
