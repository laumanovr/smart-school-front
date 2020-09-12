<template>
	<div class="add-assignment">
		<div class="add-assignment__title">
			{{ isEdit ? $t('topics.editAssignment') : $t('topics.addAssignment') }}
		</div>
		<v-form ref="form" @submit.prevent="submit">
			<div class="add-assignment__item">
				<v-text-field v-model="assignment.title" :label="$t('topics.assignment')" :rules="required" outlined></v-text-field>
			</div>
			<div class="add-topic__item">
				<v-textarea
					v-model="assignment.description"
					:label="$t('common.description')"
					name="input-7-4"
					outlined
				></v-textarea>
			</div>
<!--			<div class="add-topic__item">-->
<!--				<v-select-->
<!--					v-model="assignment.classId"-->
<!--					:items="classes"-->
<!--					:label="$t('_class')"-->
<!--					:rules="required"-->
<!--					item-text="title"-->
<!--					item-value="classId"-->
<!--				></v-select>-->
<!--			</div>-->
<!--			<div class="add-topic__item">-->
<!--				<v-select-->
<!--					v-model="assignment.courseId"-->
<!--					:items="courses"-->
<!--					:label="$t('course')"-->
<!--					:rules="required"-->
<!--					item-text="courseName"-->
<!--					item-value="courseId"-->
<!--				></v-select>-->
<!--			</div>-->
			<div class="add-topic__item">
				<v-menu
					v-model="menu2"
					:close-on-content-click="false"
					:nudge-right="40"
					min-width="290px"
					offset-y
					transition="scale-transition"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-text-field
							v-model="deadline"
							v-bind="attrs"
							v-on="on"
							:label="$t('topics.deadline')"
							prepend-icon="event"
							readonly
						></v-text-field>
					</template>
					<v-date-picker v-model="deadline" @input="menu2 = false"></v-date-picker>
				</v-menu>
			</div>
			<div class="add-assignment__footer">
				<v-btn @click="$emit('close')">{{ $t('cancel') }}</v-btn>
				<v-btn color="blue" type="submit">{{ $t('save') }}</v-btn>
			</div>
		</v-form>
	</div>
</template>

<script>
import moment from 'moment'
import { AssignmentService } from '@/_services/assignment.service'

const assignmentService = new AssignmentService()
export default {
	name: 'AddAssignment',
	props: {
		data: { type: Object, default: () => {} },
		isEdit: { type: Boolean, default: false },
		editAssignment: { type: Object, default: () => {} }
	},
	data () {
		return {
			assignment: {},
			required: [
				v => !!v || this.$t('required')
			],
			menu2: false,
			deadline: moment().format('YYYY-MM-DD'),
		}
	},
	computed: {
		courses () {
			return this.$store.getters["scheduleWeek/getCourses"].map(i => {
				i.courseName = this.$t(`adminCourses.${i.courseCode}`)
				return i
			})
		},
		userProfile() {
			return this.$store.state.account.profile
		},
		classes () {
			return this.$store.getters['scheduleWeek/getClasses'].map(i => {
				i.title = `${i.classLevel}${i.classLabel}`
				return i
			})
		}
	},
	mounted () {
		if (this.isEdit) {
			this.assignment = this.editAssignment
			this.deadline = moment(this.editAssignment.deadline, 'DD.MM.YYYY').format('YYYY-MM-DD')
		}
	},
	methods: {
		submit () {
			if (this.$refs.form.validate()) {
				this.assignment.instructorId = this.userProfile.personId
				this.assignment.topicId = this.data.topicId
				this.assignment.courseId = this.data.courseId
				this.assignment.classId = this.data.classId
				this.assignment.deadline = moment(this.deadline, 'YYYY-MM-DD').format('DD.MM.YYYY')
				if (this.isEdit) {
					assignmentService.edit(this.assignment).then(res => {
						this.$toast.success(this.$t('successMessage'))
						this.$emit('close')
						this.$emit('fetch')
					}).catch(err => console.log(err))
				} else {
					assignmentService.create(this.assignment).then(res => {
						this.$toast.success(this.$t('successMessage'))
						this.$emit('close')
						this.$emit('fetch')
					}).catch(err => console.log(err))
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.add-assignment {
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
