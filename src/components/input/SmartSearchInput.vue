<template>
    <div class="smart-input">
        <img src="../../assets/images/icons/search.svg" alt="">
        <input @input="$emit('onTyping', $event.target.value)" @keydown.enter="$emit('onEnter', $event.target.value)" type="text" class="smart-input__input" placeholder="Искать">
    </div>
</template>

<script>
export default {
  name: 'SmartSearchInput'
}
</script>

<style lang="scss" scoped>
.smart-input {
    background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    border-radius: 24px;
    position: relative;
    &__input {
        border-radius: 24px;
        height: 32px;
        background: #f8f8fb;
        margin: 1px;
        padding-left: 40px;
        font-weight: 300;
        font-size: 14px;
        line-height: 24px;
        color: #4A27F3;

        &:focus {
            outline: none;
        }
    }
    img {
        position: absolute;
        left: 15px;
        top: 10px;
    }
}
</style>
