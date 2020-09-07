<template>
        <v-card>
            <v-card-title class="headline">{{ message }}</v-card-title>

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
</template>

<script>
export default {
    name: "DeletePopup",
	props: { message: { type: String, default: 'Вы уверены, что хотите удалить?' } }
}
</script>

<style scoped>

</style>
