<template>
	<div class="add-assignment">
		<div class="add-assignment__title">
			{{ isEdit ? $t('topics.editAssignment') : $t('topics.addAssignment') }}
		</div>
		<v-form ref="form" @submit.prevent="submit">
			<div class="add-assignment__item">
				<v-text-field v-model="assignment.title" :label="$t('topics.assignment')" :rules="required" outlined></v-text-field>
			</div>
            <div v-if="!isEdit">
                <v-file-input
                    v-model="assignment.files"
                    chips show-size
                    accept="*"
                    label="Прикрепить файл"
                />
            </div>
            <div v-if="isEdit && !assignment.attachmentList.length">
                <v-file-input
                    chips show-size
                    accept="*"
                    label="Прикрепить файл"
                    @change="sendFile"
                />
            </div>

            <div class="attach-file" v-if="isEdit && assignment.attachmentList.length">
                <v-text-field v-model="assignment.attachmentList[0].originalFilename" readonly label="Файл"/>
                <span class="download" @click="downloadFile">СКАЧАТЬ</span>
            </div>

			<div class="add-topic__item">
				<v-textarea
					v-model="assignment.description"
					:label="$t('common.description')"
					name="input-7-4"
					outlined
				></v-textarea>
			</div>
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
							v-model="assignment.deadline"
							v-bind="attrs"
							v-on="on"
							:label="$t('topics.deadline')"
							prepend-icon="event"
							readonly
						></v-text-field>
					</template>
					<v-date-picker locale="ru-RU" :min="assignment.topicDate" v-model="deadline" @input="onSelectDeadline"></v-date-picker>
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
import moment from 'moment';
import { AssignmentService } from '@/_services/assignment.service';
const assignmentService = new AssignmentService();
import FileService from '@/_services/file.service';

export default {
	name: 'AddAssignment',
	props: {
		isEdit: { type: Boolean, default: false },
		assignment: { type: Object, default: () => {} }
	},
	data () {
		return {
			required: [
				v => !!v || this.$t('required')
			],
			menu2: false,
			deadline: moment().format('YYYY-MM-DD'),
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile
		},
		classes () {
			return this.$store.getters['scheduleWeek/getClasses'].map(i => {
				i.title = `${i.classLevel}${i.classLabel}`;
				return i;
			})
		}
	},

	mounted () {
		if (this.isEdit) {
			this.deadline = moment(this.assignment.deadline, 'DD.MM.YYYY').format('YYYY-MM-DD')
		} else {
		    this.deadline = moment().format('YYYY-MM-DD');
        }
        this.assignment.topicDate = moment(this.assignment.topicDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
    },

	methods: {
	    onSelectDeadline() {
            this.assignment.deadline = moment(this.deadline, 'YYYY-MM-DD').format('DD.MM.YYYY');
            this.menu2 = false;
        },

		submit() {
			if (this.$refs.form.validate()) {
			    this.$emit('loading', true);
                this.assignment.chronicleId = this.userProfile.schools[0].chronicleId;
				if (this.isEdit) {
				    delete this.assignment.attachmentList;
					assignmentService.edit(this.assignment).then(() => {
						this.$toast.success(this.$t('successMessage'));
						this.$emit('close');
						this.$emit('fetch');
					}).catch((err) => {
					    this.$toast.error(err);
                        this.$emit('loading', false);
                    })
				} else {
					assignmentService.create(this.assignment).then(() => {
						this.$toast.success(this.$t('successMessage'));
						this.$emit('close');
						this.$emit('fetch');
					}).catch((err) => {
                        this.$toast.error(err);
                        this.$emit('loading', false);
                    })
				}
			}
		},

        sendFile(file) {
            this.$emit('loading', true);
            assignmentService.attachFile(this.assignment.id, file).then(() => {
                this.$emit('loading', false);
            }).catch((err) => {
                this.$toast.error(err);
                this.$emit('loading', false);
            })
        },

        downloadFile() {
            this.$emit('loading', true);
            const fileName = this.assignment.attachmentList[0].fileLocation;
            FileService.downloadFile(fileName).then((res) => res.blob()).then((blob) => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName.replace(' ', '');
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(link.href);
                link.remove();
                this.$emit('loading', false);
            }).catch((err) => {
                this.$toast.error(err);
                this.$emit('loading', false);
            })
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

        .attach-file {
            position: relative;
            .download {
                display: none;
                position: absolute;
                top: 15px;
                left: 0;
                right: 0;
                text-align: center;
                background: #80808054;
                cursor: pointer;
                color: #1111f7;
            }
            &:hover {
                .download {
                    display: block;
                }
                .v-text-field {
                    opacity: 0.5;
                }
            }
        }
	}
</style>
