<template>
    <span class="delete-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/trash.svg" alt="Удалить">
    </span>
</template>

<style lang="scss" scoped>
    .delete-icon {
        display: inline-block;
        cursor: pointer;
        width: 16px;
        min-width: 16px;
        height: 16px;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>
