<template>
    <span class="play-arrow-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/play-icon.svg">
    </span>
</template>



<style lang="scss" scoped>
    .play-arrow-icon {
        display: inline-block;
        cursor: pointer;
        &.left {
            img {
                transform: rotate(180deg);
            }
        }
    }
</style>
