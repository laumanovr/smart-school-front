<template>
    <span class="edit-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/edit-icon.svg" alt="Редактировать">
    </span>
</template>

<style lang="scss" scoped>
    .edit-icon {
        display: inline-block;
        cursor: pointer;
        margin-right: 10px;
        width: 26px;
        min-width: 26px;
        height: 26px;
        img {
            background: #03A9F4;
            border-radius: 50px;
            padding: 3px;
            width: 100%;
            height: 100%;
        }
    }
</style>
