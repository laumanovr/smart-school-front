<template>
    <div class="course-menu">
        <div class="course-menu__body">
            <div class="course-menu__item clickable-icons" :class="{ 'active' : !isGrid }" @click="$emit('onChange', false)">
                <img alt="" src="../../../assets/images/icons/list.svg">
            </div>
            <div class="course-menu__item clickable-icons" :class="{ 'active' : isGrid }" @click="$emit('onChange', true)">
                <img alt="" src="../../../assets/images/icons/grid.svg">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CourseMenu",
    props: {
        isGrid: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style lang="scss" scoped>
    .course-menu {
        display: flex;
        &__body {
            margin: 0 0 0 auto;
            display: flex;
        }
        &__item {
            padding: 10px;

            &.active {
                background: rgba(187, 223, 255, 0.56);
                box-shadow: 0px 3.68142px 9.20354px rgba(0, 0, 0, 0.05);
                border-radius: 5px;
            }
        }
    }
</style>
