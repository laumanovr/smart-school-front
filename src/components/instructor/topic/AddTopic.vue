<template>
	<div class="add-topic">
		<div class="add-topic__title">
			{{ $t('add_topic') }}
		</div>
		<v-form ref="form" @submit.prevent="submit">
			<div class="add-topic__item">
				<v-text-field outlined label="" :rules="required"></v-text-field>
			</div>
			<div class="add-topic__item">
				<v-textarea
					outlined
					name="input-7-4"
					:label="$t('common.description')"
					value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
				></v-textarea>
			</div>
			<div class="add-topic__item">
				<v-select
					:items="classLevels"
					:label="$t('_class')"
				></v-select>
			</div>
			<div class="add-topic__item">
				<v-select
					:items="classLevels"
					:label="$t('course')"
				></v-select>
			</div>
			<div class="add-topic__item">
				<v-menu
					v-model="menu2"
					:close-on-content-click="false"
					:nudge-right="40"
					transition="scale-transition"
					offset-y
					min-width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="startDate"
							:label="$t('topics.startDate')"
							prepend-icon="event"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker v-model="startDate" @input="menu2 = false"></v-date-picker>
				</v-menu>
				<v-menu
					v-model="menu1"
					:close-on-content-click="false"
					:nudge-right="40"
					transition="scale-transition"
					offset-y
					min-width="290px"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="endDate"
							:label="$t('topics.endDate')"
							prepend-icon="event"
							readonly
							v-bind="attrs"
							v-on="on"
						></v-text-field>
					</template>
					<v-date-picker v-model="endDate" @input="menu1 = false"></v-date-picker>
				</v-menu>
			</div>
		</v-form>
	</div>
</template>

<script>
import moment from 'moment'
export default {
	name: "AddTopic",
	data () {
		return {
			required: [
				v => !!v || this.$t('required')
			],
			classLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().format('YYYY-MM-DD'),
			menu2: false,
			menu1: false
		}
	},
	methods: {
		submit () {
			if (this.$refs.form.validate()) {
				console.log('ok')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.add-topic {
		background: #FFFFFF;
		border-radius: 7px;
		padding: 20px 40px;
		font-family: Helvetica;
		font-style: normal;

		&__title {
			font-weight: normal;
			font-size: 18px;
			line-height: 21px;
			color: #192A3E;
			margin: 10px 0 20px;
		}
		&__item {
			margin: 10px 0;
			display: flex;
		}
	}
</style>
