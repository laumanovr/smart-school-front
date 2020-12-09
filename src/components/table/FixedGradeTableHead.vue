<template>
    <div class="grade-content fixed-grade-table-head" :style="{width: gradeTablesWidth+'px'}">
        <div class="grade-tables">
            <table class="students bordered">
                <thead>
                <tr>
                    <th :style="{width: monthLabelWidth+'px'}" class="nav-arrows">
                        <span class="date"></span>
                        <PlayArrowIcon class="date-arrow left" @click="$emit('navigateByMonth', 'prev')"/>
                        <PlayArrowIcon class="date-arrow" @click="$emit('navigateByMonth', 'next')"/>
                    </th>
                </tr>
                </thead>
            </table>
            <table class="grades bordered fixed-head">
                <thead>
                <tr>
                    <th v-for="day in currentMonthDays" :class="{'disabled': !isAbleDate(day.day)}">
                        {{ day.day.slice(0, 2) }}
                        <div class="lesson">Урок-{{ day.shiftTimeTitle }}</div>
                    </th>
                    <th class="average"><span>-</span><span>x</span></th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
</template>

<script>
    import PlayArrowIcon from '@/components/icons/PlayArrowIcon';
    import moment from 'moment';

    export default {
        components: {
            PlayArrowIcon
        },
        props: {
            currentMonthDays: Array,
            gradeTablesWidth: Number,
            monthLabelWidth: Number
        },
        methods: {
            isAbleDate(gradeDate) {
                const formattedGradeDate = moment(gradeDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                const currentDate = moment(new Date()).format('YYYY-MM-DD');
                return formattedGradeDate <= currentDate;
            },
        }
    }
</script>

<style lang="scss">
    .fixed-grade-table-head {
        position: fixed;
        top: 0;
        z-index: 997;
        transform: translateY(-60px);
        will-change: transform;
        transition: transform 0.2s ease-out;
        &.show {
            transform: translateY(0);
            transition: transform 0.2s ease-in;
        }
        .nav-arrows {
            justify-content: center;
        }
    }
</style>
