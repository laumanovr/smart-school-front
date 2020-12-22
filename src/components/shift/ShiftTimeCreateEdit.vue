<template>
    <div class="shift-time-container">
        <h4>{{mode == 'addShiftTime' ? 'Добавьте время уроков' : 'Время уроков'}}</h4>
        <div class="add-shift-time">
            <v-btn color="primary" @click="addShiftTimeToArray">Добавить</v-btn>
        </div>

        <div class="empty-fields" v-show="isEmptyFields">Некоторые поля не заполнены!</div>

        <div class="shift-time-list">
            <div class="shift-time" v-for="(shtime, i) in shiftTimeList" :key="shtime.id">
                <div class="lesson">
                    <label>Урок №</label>
                    <div class="el">
                        <input type="number" v-model="shtime.name">
                    </div>
                </div>
                <div class="time">
                    <label>От</label>
                    <div class="el">
                        <timeselector
                            :ref="'timeStart'+i"
                            v-model="shtime.timeStart"
                            :interval="{m: 5}"
                            @selectedMinute="closeTimePicker('timeStart'+i)"
                        />
                    </div>
                </div>
                <div class="time">
                    <label>До</label>
                    <div class="el">
                        <timeselector
                            :ref="'timeEnd'+i"
                            v-model="shtime.timeEnd"
                            :interval="{m: 5}"
                            @selectedMinute="closeTimePicker('timeEnd'+i)"
                        />
                    </div>
                </div>
                <DeleteIcon class="delete" @click="deleteShiftTime(shtime)" v-if="!shtime.archived"/>
                <span v-if="shtime.archived" class="reserved">привязан</span>
            </div>
        </div>

        <div class="btn-actions" v-if="mode == 'addShiftTime' && shiftTimeList.length">
            <v-btn color="red" @click="closeModal">Отмена</v-btn>
            <v-btn color="green" @click="saveShiftTime">Сохранить</v-btn>
        </div>
        <div class="btn-actions" v-if="mode == 'addShiftTime' && !shiftTimeList.length">
            <v-btn color="red" @click="closeModal">Отмена</v-btn>
        </div>
    </div>
</template>

<script>
    import Timeselector from 'vue-timeselector';
    import DeleteIcon from '@/components/icons/DeleteIcon';

    export default {
        props: {
            shiftTimeList: Array,
            mode: String
        },
        components: {
            Timeselector,
            DeleteIcon
        },

        data() {
            return {
                isEmptyFields: false
            }
        },

        methods: {
            addShiftTimeToArray() {
                this.$emit('addShiftTimeArray');
            },

            saveShiftTime() {
                if (this.shiftTimeList.some(item => !item.name)) {
                    this.isEmptyFields = true;
                    return;
                }
                this.$emit('saveShiftTimes');
            },

            deleteShiftTime(shiftTime) {
                this.$emit('removeShiftTime', shiftTime);
            },

            closeModal() {
                this.$emit('closeModal');
            },

            closeTimePicker(timePicker) {
                this.$refs[timePicker][0].close();
            },
        }
    }
</script>

<style lang="scss">
    .add-shift-time {
        text-align: right;
    }

    .empty-fields {
        text-align: center;
        color: #ff1717;
        font-weight: bold;
        font-size: 16px;
    }

    .shift-time-list {
        width: 100%;
        margin-top: 25px;
        min-height: 40vh;
        max-height: 40vh;
        overflow-y: scroll;
        &::-webkit-scrollbar {
            width: 3px;
            height: 2px;
            background: transparent;
        }
        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3)
        }
        .shift-time {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #d2d2d2;
            padding-bottom: 15px;
            margin-bottom: 15px;
            .lesson, .time {
                margin-right: 20px;
                width: 30%;
                label {
                    color: #9E9E9E;
                    font-size: 12px;
                    margin-left: 3px;
                }
                .el {
                    border: 1px solid #9E9E9E;
                    border-radius: 5px;
                }
                input {
                    width: 100%;
                    height: 28px;
                    padding-left: 10px;
                }
            }
            .delete {
                transform: translate(-10px, 10px);
                margin-left: 5px;
            }
            .reserved {
                transform: translateY(8px);
                font-size: 11px;
            }
        }
    }
</style>
