<template>
    <span class="quad-arrow-icon" @click="$emit('click')">
        <img src="@/assets/images/icons/fwd-icon.svg">
    </span>
</template>

<style lang="scss" scoped>
    .quad-arrow-icon {
        display: inline-block;
        cursor: pointer;
        margin: 0 6px;
        img {
            background: #03A9F4;
            border-radius: 6px;
            padding: 3px 6px;
        }
    }
</style>
