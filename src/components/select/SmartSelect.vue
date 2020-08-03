<template>
    <div class="smart-select">
        <slot>Select</slot>
    </div>
</template>

<script>
export default {
  name: 'SmartSelect'
}
</script>

<style lang="scss" scoped>
.smart-select {
    height: 32px;
    border: 1px solid #C6CBD4;
    box-sizing: border-box;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 0 2px 0 10px;
    font-family: Avenir,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    color: #333333;

    &.active {
        border: 1px solid #339DFA;
        color: #339DFA;
    }
}
</style>
