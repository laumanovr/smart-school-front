<template>
    <div class="smart-input">
        <img src="../../assets/images/icons/search.svg" alt="">
        <input
            v-model="searchObj[searchField]"
            @input="$emit('onTyping', $event.target.value)"
            @keyup.enter="$emit('onEnter', $event.target.value)"
            type="text" class="smart-input__input" placeholder="Введите имя..."
        />
    </div>
</template>

<script>
export default {
  name: 'SmartSearchInput',
    props: {
      searchObj: {
          type: Object,
          default: () => {
              return {field: ''}
          }
      },
      searchField: {
          type: String,
          default: 'field'
      }
    }
}
</script>

<style lang="scss" scoped>
.smart-input {
    background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    border-radius: 24px;
    position: relative;
	height: 34px;
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
