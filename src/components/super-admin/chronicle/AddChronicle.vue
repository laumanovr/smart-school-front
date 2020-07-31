<template>
	<div class="add-chronicle">
		<v-form @submit.prevent="submit" ref="form">
			<div>
				<v-text-field :rules="ruleStartYear" v-model="chronicle.startYear" label="Start year"></v-text-field>
			</div>
			<div>
				<v-text-field :rules="ruleEndYear" v-model="chronicle.endYear" label="End year"></v-text-field>
			</div>
			<div class="form-footer">
				<v-btn type="submit" color="primary">Сохранить</v-btn>
				<v-btn>Отменить</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import { ChronicleService } from '@/_services/chronicle.service'

const chronicleService = new ChronicleService();

export default {
	name: "AddChronicle",
	data: () => ({
		chronicle: { archived: true },
		ruleStartYear: [
            v => !!v || 'Name is required',
		],
        ruleEndYear: [
            v => !!v || 'Name is required',
        ],
	}),
	methods: {
	    submit () {
			if (this.$refs.form.validate()) {
			    chronicleService.create(this.chronicle).then(res => {
                    this.$toast.success('Success message')
                    this.$emit('close');
			    }).catch(err => {
			        console.log(err)
                });
			}
	    }
	}
}
</script>

<style lang="scss" scoped>
	.v-form {
      background: #FFFFFF;
      border-radius: 7px;
      padding: 20px 40px;

	  div {
	    display: flex;
	    justify-content: space-around;
	  }
	}
</style>
