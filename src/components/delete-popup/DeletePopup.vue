<template>
    <v-dialog
        max-width="450"
        v-model="isDelete"
    >
        <v-card>
            <v-card-title class="headline">Вы уверены, что хотите удалить?</v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    @click="$emit('cancel')"
                    color="green darken-1"
                    text
                >
                    Нет
                </v-btn>

                <v-btn
                    @click="$emit('accept')"
                    color="red darken-1"
                    text
                >
                    Да
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "DeletePopup",
    props: {
        isDeleting: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        isDelete () {
            return this.isDeleting
        }
    }
}
</script>

<style scoped>

</style>
