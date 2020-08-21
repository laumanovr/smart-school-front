<template>
    <div class="shift-container">
        <SuperAdminSchoolHead>
            <template v-slot:title>Все смены</template>
            <template v-slot:right>
                <md-button class="md-primary md-raised" @click="openModal('addShift', {})">
                    Добавить смену
                </md-button>
            </template>
        </SuperAdminSchoolHead>

        <div class="shift-content">
            <md-table class="shift-table">
                <md-table-row>
                    <md-table-head>Название смены</md-table-head>
                    <md-table-head></md-table-head>
                    <md-table-head></md-table-head>
                    <md-table-head></md-table-head>
                </md-table-row>

                <md-table-row v-for="shift in allSchoolShifts" :key="shift.id">
                    <md-table-cell>{{shift.name}}</md-table-cell>
                    <md-table-cell></md-table-cell>
                    <md-table-cell></md-table-cell>
                    <md-table-cell>
                        <i class="material-icons edit" @click="openModal('editAll', shift)">edit</i>
                        <i class="material-icons delete">close</i>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>

        <!--MODAL FOR SHIFT AND SHIFT-TIME-->
        <modal name="shift-modal" height="auto" :clickToClose="false">
            <div class="modal-container">
                <template v-if="mode == 'addShift'">
                    <ShiftCreateEdit
                        :shiftObj="shiftObj"
                        :mode="mode"
                        @createShift="submitCreateShift"
                        @closeModal="closeModal"
                    />
                </template>
                <template v-if="mode == 'addShiftTime'">
                    <ShiftTimeCreateEdit
                        :mode="mode"
                        :shiftTimeList="shiftTimeList"
                        @addShiftTimeArray="prepareShiftTime"
                        @saveShiftTimes="submitShiftTimes"
                        @closeModal="closeModal"
                    />
                </template>

                <template v-if="mode == 'editAll'">
                    <ShiftCreateEdit
                        :shiftObj="shiftObj"
                        :mode="mode"
                        @createShift="submitCreateShift"
                        @closeModal="closeModal"
                    />
                    <ShiftTimeCreateEdit
                        :mode="mode"
                        :shiftTimeList="shiftTimeList"
                        @addShiftTimeArray="prepareShiftTime"
                        @saveShiftTimes="submitShiftTimes"
                        @closeModal="closeModal"
                    />
                    <div class="btn-actions">
                        <md-button class="md-primary green" @click="submitUpdateAllShiftAndTimes">Сохранить</md-button>
                        <md-button class="md-primary red" @click="closeModal">Отмена</md-button>
                    </div>
                </template>
            </div>
        </modal>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import ShiftService from '@/_services/shift.service';
    import ShiftTimeService from '@/_services/shift-time.service';
    import ShiftCreateEdit from '@/components/shift/ShiftCreateEdit';
    import ShiftTimeCreateEdit from '@/components/shift/ShiftTimeCreateEdit';
    import moment from 'moment';

    export default {
        components: {
            SuperAdminSchoolHead,
            ShiftCreateEdit,
            ShiftTimeCreateEdit
        },
        data() {
            return {
                shiftObj: {
                    name: '',
                    schoolId: ''
                },
                allSchoolShifts: [],
                shiftTimeList: [],
                mode: '',
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

        created() {
            this.fetchSchoolShifts();
        },

        methods: {
            fetchSchoolShifts() {
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    this.allSchoolShifts = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            openModal(mode, shift) {
                this.mode = mode;
                this.shiftObj.schoolId = this.school.id;
                if (mode === 'addShift') {
                    this.shiftObj.name = '';
                } else {
                    this.shiftObj.name = shift.name;
                    this.shiftObj.id = shift.id;
                    this.getShiftTimesByShift(shift.id);
                }
                this.$modal.show('shift-modal');
            },

            closeModal() {
                this.$modal.hide('shift-modal');
            },

            submitCreateShift() {
                ShiftService.create(this.shiftObj).then((res) => {
                    this.mode = 'addShiftTime';
                    this.shiftObj.id = parseInt(res.message);
                    this.fetchSchoolShifts();
                }).catch(err => this.$toast.error(err));
            },

            prepareShiftTime() {
                const shiftTimeObj = {
                    name: this.shiftTimeList.length + 1,
                    startTime: '08:00',
                    endTime: '09:00',
                    timeStart: new Date(),
                    timeEnd: new Date(),
                    shiftId: this.shiftObj.id,
                    schoolId: this.school.id,
                };
                if (this.mode === 'addShiftTime') {
                    this.shiftTimeList.push(shiftTimeObj);
                } else {
                    ShiftTimeService.create(shiftTimeObj).then((res) => {
                        shiftTimeObj.id = parseInt(res.message);
                        this.shiftTimeList.push(shiftTimeObj);
                    })
                }
            },

            async submitShiftTimes() {
                let requests;
                this.shiftTimeList = this.shiftTimeList.map((shiftTime) => {
                    shiftTime.startTime = moment(shiftTime.timeStart).format('HH:mm');
                    shiftTime.endTime = moment(shiftTime.timeEnd).format('HH:mm');
                    shiftTime.schoolId = this.school.id;
                    return shiftTime;
                });

                if (this.mode === 'addShiftTime') {
                    requests = this.shiftTimeList.map((shiftTime) => {
                        return new Promise((resolve, reject) => {
                            ShiftTimeService.create(shiftTime).then((res) => {
                                resolve(res);
                            }).catch(err => reject(err))
                        })
                    });
                } else {
                    requests = this.shiftTimeList.map((shiftTime) => {
                        return new Promise((resolve, reject) => {
                            ShiftTimeService.update(shiftTime).then((res) => {
                                resolve(res);
                            }).catch(err => reject(err))
                        })
                    });
                }
                const results = await Promise.all(requests);
                if (results[0].success) {
                    this.fetchSchoolShifts();
                    this.$toast.success('Успешно');
                    this.closeModal();
                }
            },

            getShiftTimesByShift(shiftId) {
                ShiftTimeService.getAllByShiftId(shiftId).then((res) => {
                    this.shiftTimeList = res.map((item) => {
                        item.timeStart = new Date(moment(`1970-01-01 ${item.startTime.join(':')}`));
                        item.timeEnd = new Date(moment(`1970-01-01 ${item.endTime.join(':')}`));
                        return item;
                    }).sort((a, b) => a.name - b.name);
                }).catch(err => this.$toast.error(err));
            },

            submitUpdateAllShiftAndTimes() {
                ShiftService.update(this.shiftObj).then(() => {
                    this.submitShiftTimes();
                }).catch(err => this.$toast.error(err));
            }
        }
    }
</script>

<style lang="scss">
    .shift-container {
        .shift-table {
            max-width: 1024px;
            margin: 0 auto;
            .md-table-head-label {
                color: #2196f3;
                font-size: 17px;
            }
            .md-table-cell {
                font-size: 17px;
            }
            .edit {
                color: #2196f3;
                cursor: pointer;
                margin-right: 15px;
            }
            .delete {
                color: red;
                cursor: pointer;
            }
        }
    }
</style>
