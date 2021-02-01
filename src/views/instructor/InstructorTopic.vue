<template>
	<div class="instructor-topic">
        <PreLoader v-if="isLoading"/>
		<ClassSelectHeader
            @classSelected="onClassSelect"
            :headTitle="$t('topics.title')"
            :showClass="true"
            @allClasses="fetchInstructorCourses"
        />

		<div class="instructor-topic__body">
			<SmartTable
				:page-size="topics.length"
				:schools="topics"
				:total-elements="totalElements"
				:totalPages="totalPages"
                :current-page="currentPage"
				@leftClick="onPageChange('left')"
				@rightClick="onPageChange('right')"
			>
				<template v-slot:firstItem>
					<v-select
						:items="instructorCourses"
						:item-text="showCourseName"
                        item-value="courseId"
                        :label="$t('courses')"
                        v-model="topic.courseId"
                        @change="onChangeCourse"
					></v-select>
					<SmartButton @clicked="onAddTopic" v-if="topic.courseId">{{ $t('add_topic') }}</SmartButton>
                    <div class="school-admin-school-head__item">
                        <div class="export-custom" v-if="topics.length">
                            <ExcelJs
                                ref="topicExport"
                                :buttonTitle="'Экспорт Тем и ДЗ'"
                                :file-name="exportName"
                                :headers="exportHeaders"
                                :rows="exportRows"
                            />
                            <span class="export-custom-btn" @click="toggleExportModal"></span>
                        </div>
                    </div>
				</template>
				<template v-slot:head>
					<th></th>
                    <th>Четверть</th>
					<th>Дата</th>
					<th>Тема Урока</th>
					<th>Домашнее Задание</th>
					<th></th>
					<th></th>
				</template>

				<template v-slot:body="{ item }">
					<td>{{ item.index }}</td>
                    <td>{{ showTopicQuarter(item.quarterId) + '-четв.' }}</td>
					<td>{{ item.startDate }} - {{ item.endDate }}</td>
					<td>{{ item.title }}</td>
					<td>
						<div class="instructor-topic__assignment">
							<div class="instructor-topic__assignment__content">
								<ul>
									<li
                                        class="instructor-topic__assignment__list"
                                        v-for="assignment in filterAssignments(item.assignments)"
                                        :key="assignment.assigmentId"
                                    >
										<div class="instructor-topic__assignment__item">
											{{ assignment.description ? assignment.description : assignment.title }}
										</div>
										<div class="instructor-topic__assignment__action" v-if="currentQuarterTopic(item.startDate)">
											<img @click="onAssignmentEdit(assignment, item)" class="clickable-icons" src="../../assets/images/icons/pen.svg">
											<img @click="onAssignmentDelete(assignment, item)" class="clickable-icons" src="../../assets/images/icons/trash.svg">
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
							<div class="instructor-topic__assignment__add" @click="onAddAssignment(item)" v-if="currentQuarterTopic(item.startDate)">
								<img src="../../assets/images/icons/plus.svg" alt="">
							</div>
						</div>
					</td>
                    <template>
                        <td><img @click="onTopicEdit(item)" alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg"></td>
                        <td><img @click="onTopicDelete(item)" alt="" class="clickable-icons" src="../../assets/images/icons/trash.svg"></td>
                    </template>
                    <!--<template v-if="currentQuarterTopic(item.startDate)">-->
					    <!--<td><img @click="onTopicEdit(item)" alt="" class="clickable-icons" src="../../assets/images/icons/pen.svg"></td>-->
					    <!--<td><img @click="onTopicDelete(item)" alt="" class="clickable-icons" src="../../assets/images/icons/trash.svg"></td>-->
                    <!--</template>-->
                    <!--<template v-else>-->
                        <!--<td></td>-->
                        <!--<td></td>-->
                    <!--</template>-->
				</template>
			</SmartTable>
		</div>

        <!--Topic Modal-->
		<v-dialog
			max-width="550"
			v-model="showModal"
			v-if="showModal"
		>
			<AddTopic
                :is-edit="isEdit"
                :topic="topic"
                :schoolQuarters="quarters"
                :selectedClass="currentClass"
                :allTeachClasses="allCourses"
                @close="showModal=false"
                @fetch="fetchTopics(0)"
                @loading="showLoader"
            ></AddTopic>
		</v-dialog>

        <!--Assignment Modal-->
		<v-dialog
			max-width="550"
			v-model="showAssignmentModal"
			v-if="showAssignmentModal"
		>
			<AddAssignment
				:is-edit="isEditAssignment"
				:assignment="assignment"
				@close="showAssignmentModal = false"
				@fetch="fetchTopics"
                @loading="showLoader"
			></AddAssignment>
		</v-dialog>

        <!--Delete Topic Modal-->
		<v-dialog
			max-width="450"
			v-model="isDeleting"
		>
			<DeletePopup @cancel="isDeleting = false" @accept="deleteTopic"></DeletePopup>
		</v-dialog>

        <!--Delete Assignment Modal-->
		<v-dialog
			max-width="450"
			v-model="isAssignmentDelete"
		>
			<DeletePopup @cancel="isAssignmentDelete = false" @accept="deleteAssignment"></DeletePopup>
		</v-dialog>

        <modal name="export-modal" width="450px" height="auto">
            <div class="modal-container">
                <h4>Выберите четверть</h4>
                <v-select
                    :items="quarters"
                    item-text="semester"
                    item-value="id"
                    label="Четверть"
                    v-model="selectedQuarterId"
                />
                <div class="btn-actions">
                    <v-btn color="red" @click="toggleExportModal">Отмена</v-btn>
                    <v-btn color="green" @click="filterAndExportTopicsHw">Экспорт</v-btn>
                </div>
            </div>
        </modal>
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
const assignmentService = new AssignmentService();
const topicService = new TopicService();
import PreLoader from "@/components/preloader/PreLoader";
import ScheduleWeekService from '@/_services/schedule-week.service';
import ExcelJs from "@/components/excel-export/ExcelJs";
import {QuarterService} from '@/_services/quarter.service';
const quarterService = new QuarterService();
import moment from 'moment';

export default {
	name: "InstructorTopic",
	components: {
		AddAssignment,
        PreLoader,
		DeletePopup,
        AddTopic,
        SmartSelect,
        SmartButton,
        SmartSearchInput,
        SmartTable,
        ClassSelectHeader,
        ExcelJs
    },
	data() {
		return {
            langObj: {
                ru: 'courseTitle',
                kg: 'courseTitleKG',
                en: 'courseCode',
            },
			totalPages: 1,
			totalElements: 0,
			currentPage: 1,
			isDeleting: false,
			isAssignmentDelete: false,
			isEdit: false,
			topics: [],
            instructorCourses: [],
            allCourses: [],
			topic: {
                classLevel: '',
                classId: '',
                courseId: '',
                quarterId: ''
            },
			showModal: false,
			showAssignmentModal: false,
			isEditAssignment: false,
			assignment: {},
			currentClass: {},
            isLoading: false,
            exportHeaders: [],
            exportRows: [],
            quarters: [],
            exportTopics: [],
            exportName: '',
            selectedQuarterId: '',
            totalElemNum: 0
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile;
		},
        school() {
            return this.userProfile.schools[0]
        },
        currentLang() {
            return this.$root.$i18n.locale;
        }
	},

    created() {
        this.isLoading = true;
	    this.getSchoolQuarters();
    },

	methods: {
	    getSchoolQuarters() {
	        quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
	            this.quarters = res.sort((a, b) => a.semester - b.semester);
            });
        },

        fetchInstructorCourses(allClasses) {
            this.instructorCourses = allClasses;
            this.allCourses = allClasses;
        },

        showTopicQuarter(quarterId) {
	        if (quarterId) {
                return this.quarters.find((item) => item.id === quarterId).semester;
            }
            return '';
        },

        currentQuarterTopic(topicStartDate) {
	        const startDate = moment(topicStartDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
	        const schoolQuarterStart = moment(this.school.quarterStart, 'DD.MM.YYYY').format('YYYY-MM-DD');
	        return startDate >= schoolQuarterStart;
        },

        onClassSelect(selectedClass) {
            if (!selectedClass) {
                this.$toast.info('У вас нет классов!');
                this.isLoading = false;
                return;
            }
            this.currentClass = selectedClass;
            this.topic.classId = selectedClass.classId;
            this.filterCourses(selectedClass);
        },

        filterCourses(selectedClass) {
            this.instructorCourses = this.allCourses.filter((course) =>
                course.classId === selectedClass.classId
            ).filter((obj, index, selfArr) =>
                index === selfArr.findIndex((el) =>
                    (el['courseId'] === obj['courseId'])
                ));
            this.topic.courseId = this.instructorCourses.length ? this.instructorCourses[0].courseId : 0;
            if (this.topic.courseId) {
                this.fetchTopics();
            } else {
                this.topics = [];
                this.isLoading = false;
            }
        },

        onChangeCourse() {
            this.fetchTopics();
        },

		fetchTopics(page = 0, nav) {
	        if (nav === 'left' && page) {
                this.totalElemNum -= this.topics.length;
            }
		    this.isLoading = true;
            this.topics = [];
			topicService.getByInstructor(
			    page,
                this.userProfile.personId,
                this.topic.courseId,
                this.currentClass.classLevel,
                '',
                30
            ).then((res) => {
                this.totalElements = res.page.totalElements;
                this.totalPages = res.page.totalPages;
				if (res._embedded) {
                    this.topics = res._embedded.topicResourceList.map((topic, i) => ({...topic, index: i + 1}));
                }
                this.fetchClassUniqueTopics(page, nav);
			}).catch((err) => {
			    this.$toast.error(err);
			    this.isLoading = false;
            })
		},

        fetchClassUniqueTopics(page, nav) {
            topicService.getByInstructor(
                page,
                this.userProfile.personId,
                this.topic.courseId,
                '',
                '',
                30,
                this.currentClass.classId
            ).then((res) => {
                this.totalPages += res.page.totalPages;
                this.totalElements += res.page.totalElements;
                this.currentPage = res.page.number + 1;
                if (!res.page.number) {
                    this.totalElemNum = 0;
                }
                if (res._embedded) {
                    const mergedTopics = [...res._embedded.topicResourceList, ...this.topics];
                    if (nav === 'left' && res.page.number) {
                        this.totalElemNum -= mergedTopics.length;
                    }
                    this.topics = mergedTopics.sort((a, b) => {
                        const aStartDate = moment(a.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                        const bStartDate = moment(b.startDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
                        return new Date(bStartDate) - new Date(aStartDate);
                    }).map((topic, i) => ({...topic, index: this.totalElemNum += 1}));
                }
                this.isLoading = false;
            }).catch((err) => {
                this.$toast.error(err);
                this.isLoading = false;
            })
        },

        filterAssignments(assignments) {
	        if (assignments) {
                const filteredHws = assignments.filter((assign) => assign.classId === this.currentClass.classId);
                return filteredHws.length ? filteredHws : assignments;
            }
        },

        toggleExportModal() {
            this.$modal.toggle('export-modal')
        },

        filterAndExportTopicsHw() {
            if (this.selectedQuarterId) {
                this.isLoading = true;
                topicService.getByInstructor(
                    0,
                    this.userProfile.personId,
                    this.topic.courseId,
                    this.currentClass.classLevel,
                    this.selectedQuarterId,
                    500
                ).then((res) => {
                    if (res._embedded) {
                        this.exportTopics = res._embedded.topicResourceList;
                    }
                    this.exportName = `Темы и ДЗ, ${this.currentClass.classLevel}${this.currentClass.classLabel}-класса`;
                    this.exportHeaders = ['Дата', 'Тема', 'Домашние задания'];
                    topicService.getByInstructor(
                        0,
                        this.userProfile.personId,
                        this.topic.courseId,
                        '',
                        this.selectedQuarterId,
                        500,
                        this.currentClass.classId
                    ).then((res) => {
                        if (res._embedded) {
                            this.exportTopics = [...res._embedded.topicResourceList, ...this.exportTopics];
                        }
                        this.exportRows = this.exportTopics.map((topic) => {
                            return [`${topic.startDate}-${topic.endDate}`, topic.title, this.prepareAssignments(topic.assignments)];
                        });
                        this.$refs.topicExport.isExport = true;
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.isLoading = false;
                                this.toggleExportModal();
                                this.$refs.topicExport.exportExcel();
                            });
                        });
                    });
                });
            }
        },

        prepareAssignments(assignments) {
            return assignments.map((item) => item.title).join(', ');
        },

        showCourseName(courseObj) {
            return courseObj[this.langObj[this.currentLang]];
        },

        onPageChange(nav) {
            nav === 'left' ? this.currentPage -= 1 : this.currentPage += 1;
            this.fetchTopics(this.currentPage - 1, nav);
        },

//      TOPICS
        onAddTopic() {
            this.topic.title = '';
            this.topic.description = '';
            this.topic.startDate = '';
            this.topic.endDate = '';
            this.topic.classLevel = '';
            this.isEdit = false;
            this.showModal = true;
        },

        onTopicEdit (topic) {
            this.topic.id = topic.id;
            this.topic.classLevel = topic.classLevel ? topic.classLevel : '';
            this.topic.classId = topic.classId ? topic.classId : '';
            this.topic.courseId = topic.courseId;
            this.topic.quarterId = topic.quarterId;
            this.topic.title = topic.title;
            this.topic.description = topic.description;
            this.topic.startDate = topic.startDate;
            this.topic.endDate = topic.endDate;
            this.showModal = true;
            this.isEdit = true;
        },

        onTopicDelete (topic) {
            this.topic.id = topic.id;
            this.isDeleting = true;
        },

        deleteTopic() {
            topicService._delete(this.topic.id).then(() => {
                this.$toast.success(this.$t('successMessage'));
                this.isDeleting = false;
                this.fetchTopics(0)
            }).catch((err) => {
                this.$toast.error(err);
            })
        },


//        ASSIGNMENTS
        showLoader(bool) {
            this.isLoading = bool;
        },

		onAddAssignment(topic) {
			this.assignment = {
				topicId: topic.id,
                courseId: this.topic.courseId,
                classId: this.currentClass.classId,
                instructorId: this.userProfile.personId,
                topicDate: topic.endDate
			};
            this.isEditAssignment = false;
			this.showAssignmentModal = true;
		},

        onAssignmentEdit(assignment, topic) {
	        assignmentService.getById(assignment.assigmentId).then((res) => {
                this.assignment = {
                    id: assignment.assigmentId,
                    title: res.title,
                    description: res.description ? res.description : res.title,
                    deadline: res.deadline,
                    courseId: res.courseId,
                    classId: res.classId,
                    instructorId: this.userProfile.personId,
                    topicId: res.topicId,
                    attachmentList: res.attachmentList,
                    topicDate: topic.endDate
                };
                this.isEditAssignment = true;
                this.showAssignmentModal = true;
            }).catch((err) => {
	            this.$toast.error(err);
            });
        },

        onAssignmentDelete (assignment, item) {
            this.assignment = assignment;
            this.isAssignmentDelete = true;
        },

		deleteAssignment() {
			assignmentService._delete(this.assignment.assigmentId).then(() => {
				this.$toast.success(this.$t('successMessage'));
				this.isAssignmentDelete = false;
                this.fetchTopics();
			}).catch(err => {
				this.$toast.error(err);
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
			margin: 0 30px 0 10px;
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
