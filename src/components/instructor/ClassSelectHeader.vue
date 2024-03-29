<template>
	<div class="class-select-header">
		<div class="class-select-header__title">{{ headTitle }}</div>
		<div class="class-select-header__classes">
			<button
				v-for="item in classes"
				:key="item.id"
				:class="{'active': item.id === clas.id, 'replaced': item.isAllDay}"
				class="class-select-header__item"
				@click="onClassClick(item)"
			>
				{{ item.classLevel }}-{{ item.classLabel }}
			</button>
		</div>
	</div>
</template>

<script>
import ScheduleWeekService from "@/_services/schedule-week.service";
import {mapActions} from 'vuex'

export default {
	name: "ClassSelectHeader",
	props: {
		headTitle: String,
		showClass: Boolean
	},
	data() {
		return {
			classes: [],
			clas: {}
		}
	},
	computed: {
		userProfile() {
			return this.$store.state.account.profile
		}
	},
	created() {
		if (this.showClass) {
			this.fetchScheduleWeek(this.userProfile.personId).then((res) => {
			    ScheduleWeekService.getReplacedByInstructor(this.userProfile.personId).then((data) => {
                    const replaced = data._embedded ? data._embedded.instructorScheduleReplacementResourceList : [];
                    replaced.forEach((item) => {
                       item.classLevel = item.classTitle.split(" ")[0];
                       item.classLabel = item.classTitle.split(" ")[1];
                    });
                    this.classes = [...res, ...replaced].filter((obj, index, selfArr) =>
                        index === selfArr.findIndex((el) =>
                            (el['classId'] === obj['classId'])
                        )).sort((a, b) => a.classLevel - b.classLevel);
                    this.onClassClick(this.classes[0]);
                    this.$emit('allClasses', [...res, ...replaced]);
                }).catch((err) => {
                   this.$toast.error(err);
                });
			});
		}
	},
	methods: {
		...mapActions('scheduleWeek', ['fetchScheduleWeek']),
		onClassClick(item) {
			this.clas = item;
			this.$emit('classSelected', this.clas);
		}
	}
}
</script>

<style lang="scss" scoped>
.class-select-header {
	font-family: Helvetica;
	font-style: normal;
	background: #FFFFFF;
	min-height: 67px;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
	border-radius: 4px;
	display: flex;
	align-items: center;

	&__title {
		font-weight: bold;
		font-size: 20px;
		line-height: 48px;
		color: #333333;
		margin: 0 20px;
		flex: 1;
	}

	&__classes {
		flex: 3;
		display: flex;
		justify-content: center;
        flex-wrap: wrap;
	}

	&__item {
		font-weight: normal;
		font-size: 14px;
		line-height: 16px;
		letter-spacing: 0.01em;
		color: #707683;
		margin: 0 5px;
		padding: 15px 8px;
        white-space: nowrap;
		&:hover {
			background: rgba(#339DFA, 0.2);
			border-radius: 5px;
		}
        &.replaced {
            background: #efefef;
            border-radius: 15px;
        }
        &.active {
            background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
            border-radius: 5px;
            font-size: 18px;
            line-height: 21px;
            letter-spacing: 0.01em;
            color: #FFFFFF;
        }
	}
}
</style>
