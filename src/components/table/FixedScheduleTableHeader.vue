<template>
    <div class="sticky-head" :class="{'no-scroll': !showScrollArrows}">
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
            <table class="schedule-teacher-course" ref="fixedHead">
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
                    <th style="min-width: 49px">Класс</th>
                </tr>
                </thead>
            </table>
            <table class="class-courses-table" ref="fixedHead">
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
    .sticky-head {
        position: sticky;
        top: 0;
        z-index: 20;
        background: #fff;
        border-radius: 5px 5px 0 0;
        &.no-scroll {
            background: none;
        }
    }
</style>
