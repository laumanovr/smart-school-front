<template>
<form class="shift">
    <h4>{{mode == 'addShift' ? 'Добавление смены' : 'Редактирование смены'}}</h4>
    <md-field>
        <label>Название смены</label>
        <md-input v-model="shiftObj.name" required />
    </md-field>
    <div class="btn-actions" v-if="mode == 'addShift'">
        <md-button class="md-primary green" @click="createShift" :disabled="!shiftObj.name">Далее</md-button>
        <md-button class="md-primary red" @click="closeModal">Отмена</md-button>
    </div>
</form>
</template>

<script>
    export default {
        props: {
            shiftObj: Object,
            mode: String
        },

        methods: {
            createShift() {
                this.$emit('createShift');
            },
            closeModal() {
                this.$emit('closeModal');
            }
        }
    }
</script>
