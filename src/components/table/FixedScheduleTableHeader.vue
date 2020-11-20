<template>
    <div class="fixed-table-header schedule-content"
         :style="{width: fixedTableWidth+'px'}"
         :class="{'no-arrow': !showScrollArrows}"
    >
        <div class="scroll-arrows" v-show="showScrollArrows">
            <QuadArrowIcon @click="$emit('scrollTable', 'left')" class="left"/>
            <QuadArrowIcon @click="$emit('scrollTable', 'right')"/>
        </div>
        <div class="teacher-course-tables" v-if="!classViewSchedule">
            <table class="teachers">
                <thead>
                <tr>
                    <th :style="{'min-width': teacherLabelWidth+'px'}">Учитель</th>
                    <th :style="{'min-width': courseLabelWidth+'px'}">Предмет</th>
                </tr>
                </thead>
            </table>
            <table class="schedule-teacher-course fixed-header">
                <thead>
                <tr>
                    <th v-for="day in days">
                        <div class="day">{{ day.name }}</div>
                        <div class="shiftTime">
                            <span v-for="time in shiftTimes">{{ time.name }}</span>
                        </div>
                    </th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="class-schedule-tables teacher-course-tables" v-if="classViewSchedule">
            <table class="class-name-table">
                <thead>
                <tr>
                    <th style="min-width: 46px">Класс</th>
                </tr>
                </thead>
            </table>
            <table class="class-courses-table fixed-header">
                <thead>
                <tr>
                    <th v-for="day in days">
                        <div class="day">{{ day.name }}</div>
                        <div class="shiftTime">
                            <span v-for="time in shiftTimes">{{ time.name }}</span>
                        </div>
                    </th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
</template>

<script>
    import QuadArrowIcon from '@/components/icons/QuadArrowIcon';

    export default {
        components: {
            QuadArrowIcon
        },
        props: {
            days: Array,
            shiftTimes: Array,
            fixedTableWidth: Number,
            teacherLabelWidth: Number,
            courseLabelWidth: Number,
            classViewSchedule: Boolean,
            showScrollArrows: Boolean
        }
    }
</script>

<style lang="scss">
    .fixed-table-header {
        background: #fff;
        position: fixed;
        top: 0;
        padding-top: 10px;
        z-index: 997;
        transform: translateY(-100px);
        transition: transform 0.3s ease-out;
        will-change: transform;
        &.show {
            transform: translateY(0);
            transition: transform 0.3s ease-in;
        }
        &.no-arrow {
            padding-top: 20px;
        }
    }
</style>
