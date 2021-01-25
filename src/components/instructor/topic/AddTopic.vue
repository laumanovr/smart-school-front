<template>
	<div class="add-topic">
		<div class="add-topic__title">
			{{ isEdit ? 'Редактировать' : $t('add_topic') }}
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

            <div class="parallel-checkbox" v-if="!isEdit">
                <label for="checkbox">
                    <input id="checkbox" type="checkbox" @change="addForParallels">
                    <span>Создать для всей параллели</span>
                </label>
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
							v-model="topic.startDate"
							:label="$t('topics.startDate')"
							prepend-icon="event"
							readonly
							v-bind="attrs"
							v-on="on"
                            :rules="required"
						></v-text-field>
					</template>
					<v-date-picker :min="schoolQuarterStart" locale="ru-RU" v-model="startDate" @input="onSelectTopicDate('menu2')"/>
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
							v-model="topic.endDate"
							:label="$t('topics.endDate')"
							prepend-icon="event"
							readonly
							v-bind="attrs"
							v-on="on"
                            :rules="required"
						></v-text-field>
					</template>
					<v-date-picker :min="schoolQuarterStart" locale="ru-RU" v-model="endDate" @input="onSelectTopicDate('menu1')"/>
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
import moment from 'moment';
import { TopicService } from "@/_services/topic.service";
const topicService = new TopicService();

export default {
	name: "AddTopic",
	props: {
		isEdit: { type: Boolean, default: false },
		topic: { type: Object, default: () => {} },
        schoolQuarters: {type: Array},
        selectedClass: Object
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
            selectedDateQuarterId: ''
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile;
		},
        school() {
		    return this.userProfile.schools[0];
        },
        schoolQuarterStart() {
		    return moment(this.school.quarterStart, 'DD.MM.YYYY').format('YYYY-MM-DD');
        }
	},
	mounted() {
		if (this.isEdit) {
			this.startDate = moment(this.topic.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
			this.endDate = moment(this.topic.endDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
		}
    },
	methods: {
        onSelectTopicDate(picker) {
            this.topic.startDate = moment(this.startDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
            this.topic.endDate = moment(this.endDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
            this[picker] = false;
        },

        findQuarterByDate() {
            this.schoolQuarters.forEach((quarter) => {
                if (this.startDate >= quarter.startDate && this.startDate <= quarter.endDate) {
                    this.selectedDateQuarterId = quarter.id;
                }
            });
        },

		submit () {
            this.findQuarterByDate();
			if (this.$refs.form.validate()) {
			    if (this.endDate < this.startDate) {
			        this.$toast.error('Дата окончания не может быть раньше чем начала!');
			        return;
                }
			    this.$emit('loading', true);
				this.topic.personId = this.userProfile.personId;
				this.topic.archived = false;
                this.topic.quarterId = this.selectedDateQuarterId ? this.selectedDateQuarterId : this.school.quarterId;

				if (this.isEdit) {
					topicService.edit(this.topic).then(() => {
						this.$toast.success(this.$t('successMessage'));
						this.$emit('fetch');
						this.$emit('close');
					}).catch((err) => {
					    this.$toast.error(err);
                        this.$emit('loading', false);
                    })
				} else {
					topicService.create(this.topic).then(() => {
						this.$toast.success(this.$t('successMessage'));
						this.$emit('fetch');
						this.$emit('close');
					}).catch((err) => {
                        this.$toast.error(err);
                        this.$emit('loading', false);
                    })
				}
			}
		},

        addForParallels(e) {
            if (e.currentTarget.checked) {
                this.topic.classId = '';
                this.topic.classLevel = this.selectedClass.classLevel;
            } else {
                this.topic.classLevel = '';
                this.topic.classId = this.selectedClass.classId;
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
        .parallel-checkbox {
            margin: -8px 0 20px 0;
            label {
                border: 1px solid #aba9a9;
                padding: 3px 5px;
                border-radius: 4px;
                cursor: pointer;
                input {
                    transform: translateY(1px);
                }
                span {
                    margin-left: 5px;
                    color: #454545;
                    font-size: 14px;
                }
            }
        }
	}
</style>
