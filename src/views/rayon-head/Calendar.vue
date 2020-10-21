<template>
    <div class="calendar">
        <calendar-view></calendar-view>
    </div>
</template>

<script>
    import calendarView from '@/components/super-admin/calendar/Calendar'
    export default {
        name: "Calendar",
        components: { calendarView }
    }
</script>

<style lang="scss" scoped>
    .calendar {
        margin-top: 20px;
    }
</style>
