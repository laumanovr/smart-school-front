<template>
    <div class="shift-container">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title><button class="blue go-back" @click="$router.go(-1)">< Назад</button></template>
            <template v-slot:center><h1>Все смены</h1></template>
            <template v-slot:right>
                <v-btn color="primary" @click="openModal('addShift', {})">
                    Добавить смену
                </v-btn>
            </template>
        </SuperAdminSchoolHead>

        <div class="shift-content">
            <table class="table shift-table">
                <thead>
                    <tr>
                        <th>Название смены</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="shift in allSchoolShifts" :key="shift.id">
                        <td class="shift-name">{{shift.name}}</td>
                        <td>
                            <EditIcon @click="openModal('editAll', shift)" />
                            <DeleteIcon @click="deleteShift(shift.id, false)" />
                        </td>
                    </tr>
                </tbody>
            </table>
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
                        @removeShiftTime="deleteShiftTime"
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
                        @removeShiftTime="deleteShiftTime"
                        @closeModal="closeModal"
                    />
                    <div class="btn-actions">
                        <v-btn color="red" @click="closeModal">Отмена</v-btn>
                        <v-btn color="green" @click="submitUpdateAllShiftAndTimes">Сохранить</v-btn>
                    </div>
                </template>
            </div>
        </modal>

        <!--MODAL FOR DELETE SHIFT-->
        <modal name="delete-shift-modal" height="200px">
            <div class="modal-container">
                <h2>Вы действительно хотите удалить эту смену и все ее уроки?</h2>
                <div class="btn-actions">
                    <v-btn color="primary" @click="$modal.hide('delete-shift-modal')">Отмена</v-btn>
                    <v-btn color="red" @click="deleteShift('', true)">Удалить</v-btn>
                </div>
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
    import EditIcon from '@/components/icons/EditIcon';
    import DeleteIcon from '@/components/icons/DeleteIcon';
    import moment from 'moment';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            SuperAdminSchoolHead,
            ShiftCreateEdit,
            ShiftTimeCreateEdit,
            EditIcon,
            DeleteIcon,
            PreLoader
        },
        data() {
            return {
                isLoading: false,
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
                this.isLoading = true;
                ShiftService.getAllBySchool(this.school.id).then((res) => {
                    this.allSchoolShifts = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            openModal(mode, shift) {
                this.mode = mode;
                this.shiftObj.schoolId = this.school.id;
                if (mode === 'addShift') {
                    this.shiftObj.name = '';
                    this.shiftTimeList = [];
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
                            }).catch((err) => {
                                reject(err);
                                this.$toast.error(err);
                            })
                        })
                    });
                } else {
                    requests = this.shiftTimeList.map((shiftTime) => {
                        return new Promise((resolve, reject) => {
                            ShiftTimeService.update(shiftTime).then((res) => {
                                resolve(res);
                            }).catch((err) => {
                                reject(err);
                                this.$toast.error(err);
                            })
                        })
                    });
                }
                if (requests.length) {
                    const results = await Promise.all(requests);
                    this.fetchSchoolShifts();
                    this.$toast.success('Успешно');
                    this.closeModal();
                } else {
                    this.$toast.info('Добавьте время уроков!');
                }
            },

            getShiftTimesByShift(shiftId) {
                this.shiftTimeList = [];
                ShiftTimeService.getAllByShiftId(shiftId).then((res) => {
                    this.shiftTimeList = res.map((item) => {
                        item.timeStart = new Date(moment(`1970-01-01 ${item.startTime}`));
                        item.timeEnd = new Date(moment(`1970-01-01 ${item.endTime}`));
                        return item;
                    }).sort((a, b) => a.name - b.name);
                }).catch(err => this.$toast.error(err));
            },

            submitUpdateAllShiftAndTimes() {
                ShiftService.update(this.shiftObj).then(() => {
                    this.submitShiftTimes();
                }).catch(err => this.$toast.error(err));
            },

            deleteShift(shiftId, bool) {
                if (bool) {
                    ShiftService.removeShift(this.shiftObj.id).then(() => {
                        this.fetchSchoolShifts();
                        this.$toast.success('Успешно удалено');
                        this.$modal.hide('delete-shift-modal');
                    }).catch(err => this.$toast.error(err));
                } else {
                    this.shiftObj.id = shiftId;
                    this.$modal.show('delete-shift-modal');
                }
            },

            deleteShiftTime(shiftTimeObj) {
                const index = this.shiftTimeList.indexOf(shiftTimeObj);
                if (this.mode === 'addShiftTime') {
                    this.shiftTimeList.splice(index, 1);
                } else if (this.mode === 'editAll') {
                    ShiftTimeService.remove(shiftTimeObj.id).then(() => {
                        this.shiftTimeList.splice(index, 1);
                        this.$toast.success('Успешно удалено');
                    }).catch(err => this.$toast.error(err));
                }
            }
        }
    }
</script>

<style lang="scss">
    .v-btn__content {
        color: #fff;
    }
    .shift-container {
        .go-back {
            font-size: 16px;
            height: 30px;
            line-height: 0;
            padding: 0 5px;
            border-radius: 5px;
            cursor: pointer;
        }
        .shift-table {
            max-width: 1024px;
            margin: 0 auto;
            .shift-name {
                font-weight: bold;
            }
        }
    }
</style>
