<template>
	<div class="instructor-topic">
		<ClassSelectHeader :headTitle="$t('lessons')" :showClass="true"/>

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
					<td></td>
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
			max-width="450"
			v-model="isDeleting"
		>
			<DeletePopup @cancel="isDeleting = false" @accept="deleteTopic"></DeletePopup>
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
const topicService = new TopicService()
export default {
	name: "InstructorTopic",
	components: {DeletePopup, AddTopic, SmartSelect, SmartButton, SmartSearchInput, SmartTable, ClassSelectHeader},
	data() {
		return {
			totalPages: 1,
			totalElements: 0,
			currentPage: 1,
			isDeleting: false,
			isEdit: false,
			topics: [],
			topic: {},
			isAdd: false,
			courseId: ''
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
				this.currentPage = res.page.number + 1
				if (res._embedded) {
					this.topics = res._embedded.topicResourceList.map((i, index) => {
						i.index = index + 1
						return i
					})
				} else this.topics  =[]
			}).catch(err => console.log(err))
		},
		onCourse (id) {
			this.fetchTopics(0)
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
			}).catch(err => console.log(err))
		},
		onPageChange(val) {
			if (val === 'left') this.currentPage -= 1
			else this.currentPage += 1
			this.fetchTopics(this.currentPage - 1)
		}
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
