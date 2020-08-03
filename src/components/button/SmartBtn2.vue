<template>
    <div class="smart-btn-container">
        <button>
            <slot>Button</slot>
        </button>
    </div>
</template>

<script>
export default {
  name: 'SmartBtn2'
}
</script>

<style lang="scss" scoped>
.smart-btn-container {
    background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    border-radius: 24px;

    button {
        height: 32px;
        margin: 1px;
        padding: 0 15px;
        background: #f8f8fb;
        border-radius: 24px;
        font-weight: 300;
        font-size: 14px;
        line-height: 24px;
        color: #4A27F3;
        display: flex;
        align-items: center;
        img {
            margin-left: 5px;
        }
        &:hover {
            background: rgba(#f8f8fb, 0.9);
        }
        &:focus {
            outline: none;
            border: 0.5px solid #4A27F3;
        }
    }
}
</style>
