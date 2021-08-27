<template>
    <button @click="$emit('clicked')" class="smart-btn">
        <slot>Button</slot>
    </button>
</template>

<script>
export default {
  name: 'SmartButton'
}
</script>

<style lang="scss" scoped>
.smart-btn {
    background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    border-radius: 24px;
    padding: 7px 12px;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
    font-family: Helvetica,sans-serif;
    color: #FFFFFF;
    &:active, &:focus {
        border-radius: 24px;
        outline: none;
        border: 1px solid #4A27F3;
    }
}
</style>
