<template>
	<div class="instructor-topic">
		<ClassSelectHeader :headTitle="$t('lessons')" :showClass="true"/>

		<div class="instructor-topic__body">
			<SmartTable :page-size="topics.length" :schools="topics" :total-elements="topics.length"
			            :totalPages="totalPages">
				<template v-slot:firstItem>
					<v-select
						:items="courses"
						:label="$t('courses')"
					></v-select>
				</template>
				<template v-slot:table-head-right>
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
					<td>1</td>
					<td>{{ item.classLevel }}</td>
					<td>{{ item.classLabel }}</td>
					<td>{{ item.personTitle }}</td>
					<td><img alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg"></td>
					<td><img alt="" class="clickable-icons" src="../../assets/images/icons/trash.svg"></td>
				</template>
			</SmartTable>
		</div>
		<v-dialog
			max-width="550"
			v-model="isAdd"
		>
			<AddTopic></AddTopic>
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

const topicService = new TopicService()
export default {
	name: "InstructorTopic",
	components: {AddTopic, SmartSelect, SmartButton, SmartSearchInput, SmartTable, ClassSelectHeader},
	data() {
		return {
			totalPages: 1,
			topics: [],
			courses: [],
			isAdd: false
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile
		}
	},
	methods: {
		fetchTopics() {
			topicService.getByInstructor(this.userProfile.user.id).then(res => {
				this.topics = res
			}).catch(err => console.log(err))
		},
		onAddTopic () {
			this.isAdd = true
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
	}
}
</style>
