<template>
	<div class="instructor-topic">
		<ClassSelectHeader @classSelected="onClassSelect" :headTitle="$t('lessons')" :showClass="true"/>

		<div class="instructor-topic__body">
<!--			<div class="instructor-topic__hint">-->
<!--				First of all choose a lesson-->
<!--			</div>-->
			<SmartTable
				:page-size="topics.length"
				:schools="topics"
				:total-elements="totalElements"
				:totalPages="totalPages"
				@leftClick="onPageChange('left')"
				@rightClick="onPageChange('right')"
			>
				<template v-slot:firstItem>
					<v-select
						:items="courses"
						v-model="courseId"
						item-text="courseName"
						item-value="courseId"
						:label="$t('courses')"
						@change="onCourse"
					></v-select>
					<SmartButton @clicked="onAddTopic">{{ $t('add_topic') }}</SmartButton>
					<SmartSearchInput></SmartSearchInput>
				</template>
				<template v-slot:head>
					<th></th>
					<th>Дата</th>
					<th>Тема Урока</th>
					<th>Домашнее Заданее</th>
					<th></th>
					<th></th>
				</template>

				<template v-slot:body="{ item }">
					<td>{{ item.index }}</td>
					<td>{{ item.startDate }} - {{ item.endDate }}</td>
					<td>{{ item.title }}</td>
					<td>
						<div class="instructor-topic__assignment">
							<div class="instructor-topic__assignment__content">
								<ul>
									<li class="instructor-topic__assignment__list" v-for="assignment in item.assignments" :key="assignment.id">
										<div class="instructor-topic__assignment__item">
											{{ assignment.title }}
										</div>
										<div class="instructor-topic__assignment__action">
											<img @click="onAssignmentEdit(assignment, item)" alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg">
											<img @click="onAssignmentDelete(assignment, item)" alt="" class="clickable-icons" src="../../assets/images/icons/trash.svg">
										</div>
									</li>
								</ul>
								<div class="instructor-topic__assignment__pagination">
									<span>
										<i class="fas fa-forward"></i>
									</span>
									<span>
										<i class="fas fa-backward"></i>
									</span>
								</div>
							</div>
							<div class="instructor-topic__assignment__add" @click="onAddAssignment(item)">
								<img src="../../assets/images/icons/plus.svg" alt="">
							</div>
						</div>
					</td>
					<td><img @click="onTopicEdit(item)" alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg"></td>
					<td><img @click="onTopicDelete(item)" alt="" class="clickable-icons" src="../../assets/images/icons/trash.svg"></td>
				</template>
			</SmartTable>
		</div>
		<v-dialog
			max-width="550"
			v-model="isAdd"
			v-if="isAdd"
		>
			<AddTopic :is-edit="isEdit" :edit-topic="topic" @close="isAdd = false" @fetch="fetchTopics(0)"></AddTopic>
		</v-dialog>
		<v-dialog
			max-width="550"
			v-model="isAddAssignment"
			v-if="isAddAssignment"
		>
			<AddAssignment
				:is-edit="isEditAssignment"
				:data="assignmentData"
				:edit-assignment="assignment"
				@close="isAddAssignment = false"
				@fetch="fetchAssignment(0)"
			></AddAssignment>
		</v-dialog>
		<v-dialog
			max-width="450"
			v-model="isDeleting"
		>
			<DeletePopup @cancel="isDeleting = false" @accept="deleteTopic"></DeletePopup>
		</v-dialog>
		<v-dialog
			max-width="450"
			v-model="isAssignmentDelete"
		>
			<DeletePopup @cancel="isAssignmentDelete = false" @accept="deleteAssignment"></DeletePopup>
		</v-dialog>
	</div>
</template>

<script>
import ClassSelectHeader from "@/components/instructor/ClassSelectHeader";
import SmartTable from "@/components/table/SmartTable";
import SmartSearchInput from "@/components/input/SmartSearchInput";
import SmartButton from "@/components/button/SmartButton";
import {TopicService} from "@/_services/topic.service";
import SmartSelect from "@/components/select/SmartSelect";
import AddTopic from "@/components/instructor/topic/AddTopic";
import DeletePopup from "@/components/delete-popup/DeletePopup";
import AddAssignment from '@/components/instructor/assignment/AddAssignment'
import { AssignmentService } from '@/_services/assignment.service'
const assignmentService = new AssignmentService()
const topicService = new TopicService()
export default {
	name: "InstructorTopic",
	components: {
		AddAssignment,
		DeletePopup, AddTopic, SmartSelect, SmartButton, SmartSearchInput, SmartTable, ClassSelectHeader},
	data() {
		return {
			totalPages: 1,
			totalElements: 0,
			currentPage: 1,
			isDeleting: false,
			isAssignmentDelete: false,
			isEdit: false,
			topics: [],
			topic: {},
			isAdd: false,
			courseId: '',
			isAddAssignment: false,
			isEditAssignment: false,
			assignment: {},
			currentClass: {},
			assignmentData: {}
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
	methods: {
		fetchTopics(page) {
			topicService.getByInstructor(this.userProfile.personId, this.courseId, page).then(res => {
				this.totalPages = res.page.totalPages
				this.totalElements = res.page.totalElements
				let topics = []
				this.currentPage = res.page.number + 1
				if (res._embedded) {
					topics = res._embedded.topicResourceList.map((i, index) => {
						i.index = index + 1
						return i
					})
				} else topics  =[]
				this.fetchAssignments(topics)
			}).catch(err => console.log(err))
		},
		onClassSelect (_class) {
			this.currentClass = _class
		},
		async fetchAssignments (topics) {
			for (const topic of topics) {
				await assignmentService.getByTopic(topic.id).then(res => {
					if (res._embedded) {
						topic.assignments = res._embedded.assignmentResourceList
					} else topic.assignments = []
					topic.totalElements = res.page.totalElements
					topic.totalPages = res.page.totalPages
					topic.currentPage = res.page.number + 1
				}).catch(err => console.log(err))
			}
			this.topics = topics
		},
		onCourse (id) {
			this.fetchTopics(0)
		},
		onAssignmentEdit (assignment, topic) {
			this.assignment = {
				id: assignment.id,
				title: assignment.title,
				description: assignment.description,
				deadline: assignment.deadline,
				courseId: this.courseId,
				classId: this.currentClass.classId,
				instructorId: this.userProfile.personId
			}
			this.isAddAssignment = true
			this.isEditAssignment = true
		},
		onAssignmentDelete (assignment, item) {
			this.topic = item
			this.assignment = assignment
			this.isAssignmentDelete = true
		},
		onTopicEdit (item) {
			topicService.getById(item.id).then(res => {
				this.topic = res
				this.isAdd = true
				this.isEdit = true
			}).catch(err => console.log(err))
		},
		onTopicDelete (item) {
			this.topic = item
			this.isDeleting = true
		},
		onAddTopic () {
			this.isEdit = false
			this.isAdd = true
		},
		deleteTopic () {
			topicService._delete(this.topic.id).then(res => {
				this.$toast.success(this.$t('successMessage'))
				this.isDeleting = false
				this.fetchTopics(0)
			}).catch(err => {
				console.log(err)
			})
		},
		onPageChange(val) {
			if (val === 'left') this.currentPage -= 1
			else this.currentPage += 1
			this.fetchTopics(this.currentPage - 1)
		},
		onAddAssignment(item) {
			this.topic = item
			this.assignmentData = {
				topicId: item.id,
				classId: this.currentClass.classId,
				courseId: this.courseId
			}
			this.isAddAssignment = true
		},
		fetchAssignment () {
			assignmentService.getByTopic(this.topic.id).then(res => {
				let assignments = []
				if (res._embedded) {
					assignments = res._embedded.assignmentResourceList
				} else assignments = []
				this.topics = this.topics.map(i => {
					if (i.id === this.topic.id) {
						this.topic.totalElements = res.page.totalElements
						this.topic.totalPages = res.page.totalPages
						this.topic.currentPage = res.page.number + 1
						this.topic.assignments = assignments
					}
					return i
				})
			})
		},
		deleteAssignment() {
			assignmentService._delete(this.assignment.id).then(res => {
				this.$toast.success(this.$t('successMessage'))
				this.isAssignmentDelete = false
				this.fetchAssignment()
			}).catch(err => {
				console.log(err)
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.instructor-topic {
	font-family: Helvetica, sans-serif;
	font-style: normal;
	font-weight: normal;
	.class-select-header {
		margin: 25px;
	}
	&__body {
		margin: 20px 0;

		.smart-btn {
			margin: 0 10px;
		}
	}

	&__assignment {
		display: flex;
		justify-content: space-between;

		&__content {
			flex: 1.8;
		}
		&__add {
			flex: 0.2;
			cursor: pointer;
		}
		&__list {
			display: flex;
			justify-content: space-between;
		}
	}

	&__hint {
		margin: 10px 25px;
		font-weight: 300;
		font-size: 14px;
		line-height: 16px;
		letter-spacing: 0.01em;
		color: #333333;
	}
}
</style>
