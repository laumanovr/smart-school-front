<template>
    <div class="course-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/courses.svg" title="Добавить предмет">
    </div>
</template>

<style lang="scss" scoped>
    .course-icon {
        display: inline-block;
        cursor: pointer;
        width: 22px;
        min-width: 22px;
        height: 22px;
        img {
            padding: 3px;
            border-radius: 5px;
            background: #90a1ff;
            width: 100%;
            height: 100%;
        }
    }
</style>
