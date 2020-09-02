<template>
    <span class="info-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/info-icon.svg" alt="Инфо">
    </span>
</template>

<style lang="scss" scoped>
    .info-icon {
        display: inline-block;
        cursor: pointer;
        width: 26px;
        min-width: 26px;
        height: 26px;
        img {
            background: #03A9F4;
            border-radius: 50px;
            width: 100%;
            height: 100%;
        }
    }
</style>
