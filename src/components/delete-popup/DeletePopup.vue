<template>
        <v-card>
            <v-card-title class="headline">{{ message }}</v-card-title>

            <v-card-actions>
                <v-spacer></v-spacer>

                <div class="btn-actions">
                    <v-btn @click="$emit('cancel')" color="red darken-1">Нет</v-btn>
                    <v-btn @click="$emit('accept')" color="green darken-1">Да</v-btn>
                </div>
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
