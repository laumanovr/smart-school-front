<template>
    <span class="delete-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/delete-icon.svg" title="Удалить">
    </span>
</template>

<style lang="scss" scoped>
    .delete-icon {
        display: inline-block;
        cursor: pointer;
        width: 26px;
        min-width: 26px;
        height: 26px;
        img {
            background: #fa1808;
            border-radius: 50px;
            padding: 3px;
            width: 100%;
            height: 100%;
        }
    }
</style>
