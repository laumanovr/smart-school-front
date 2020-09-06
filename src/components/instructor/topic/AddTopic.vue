<template>
	<div class="add-topic">
		<div class="add-topic__title">
			{{ $t('add_topic') }}
		</div>
		<v-form ref="form" @submit.prevent="submit">
			<div class="add-topic__item">
				<v-text-field v-model="topic.title" outlined :label="$t('topics.topicTitle')" :rules="required"></v-text-field>
			</div>
			<div class="add-topic__item">
				<v-textarea
					v-model="topic.description"
					outlined
					name="input-7-4"
					:label="$t('common.description')"
				></v-textarea>
			</div>
			<div class="add-topic__item">
				<v-select
					:rules="required"
					v-model="topic.classLevel"
					:items="classLevels"
					:label="$t('_class')"
				></v-select>
				<v-select
					:rules="required"
					v-model="topic.quarterId"
					:items="quarters"
					item-value="id"
					item-text="semester"
					:label="$t('quarter')"
				></v-select>
			</div>
			<div class="add-topic__item">
				<v-select
					:rules="required"
					v-model="topic.courseId"
					:items="courses"
					item-text="courseName"
					item-value="courseId"
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
			<div class="add-topic__footer">
				<v-btn @click="$emit('close')">{{ $t('cancel') }}</v-btn>
				<v-btn type="submit" color="blue">{{ $t('save') }}</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import moment from 'moment'
import { QuarterService } from "@/_services/quarter.service";
import { TopicService } from "@/_services/topic.service";

const topicService = new TopicService()
const quarterService = new QuarterService()
export default {
	name: "AddTopic",
	props: {
		isEdit: { type: Boolean, default: false },
		editTopic: { type: Object, default: () => {} }
	},
	data () {
		return {
			required: [
				v => !!v || this.$t('required')
			],
			classLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().format('YYYY-MM-DD'),
			menu2: false,
			menu1: false,
			quarters: [],
			topic: {}
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile
		},
		courses () {
			return this.$store.getters["scheduleWeek/getCourses"].map(i => {
				i.courseName = this.$t(`adminCourses.${i.courseCode}`)
				return i
			})
		}
	},
	mounted() {
		if (this.isEdit) {
			this.topic = this.editTopic
			this.startDate = moment(this.editTopic.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
			this.endDate = moment(this.editTopic.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
		}
		this.fetchQuarters()
	},
	methods: {
		fetchQuarters () {
			quarterService.getBySchoolAndChronicle(this.userProfile.schools[0].id, this.userProfile.schools[0].chronicleId).then(res => {
				this.quarters = res
			}).catch(err => console.log(err))
		},
		submit () {
			if (this.$refs.form.validate()) {
				this.topic.parentId = null
				this.topic.personId = this.userProfile.personId
				this.topic.archived = false
				this.topic.startDate = moment(this.startDate, 'YYYY-MM-DD').format('DD.MM.YYYY')
				this.topic.endDate = moment(this.endDate, 'YYYY-MM-DD').format('DD.MM.YYYY')

				if (this.isEdit) {
					topicService.edit(this.topic).then(res => {
						this.$toast.success(this.$t('successMessage'))
						this.$emit('fetch')
						this.$emit('close')
					}).catch(err => console.log(err))
				} else {
					topicService.create(this.topic).then(res => {
						this.$toast.success(this.$t('successMessage'))
						this.$emit('fetch')
						this.$emit('close')
					}).catch(err => console.log(err))
				}
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

			.v-select {
				margin-right: 10px;
			}
		}
		&__footer {
			display: flex;
			justify-content: flex-end;
			.v-btn {
				&:last-child {
					color: #f5f5f5;
					margin-left: 10px;
				}
			}
		}
	}
</style>
