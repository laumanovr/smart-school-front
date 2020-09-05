<template>
	<div class="instructor-quarter-grade">
		<ClassSelectHeader :show-class="true" :headTitle="$t('quarter_grade')" :showClass="true"/>

		<div class="instructor-quarter-grade__body">
			<table class="instructor-quarter-grade__table">
				<thead>
				<tr>
					<th>{{ $t('full_name') }}</th>
					<th><span class="blue">I - {{ $t('quarter') }}</span></th>
					<th><span class="blue">II - {{ $t('quarter') }}</span></th>
					<th><span class="green">{{ $t('half_year') }}</span></th>
					<th><span class="blue">III - {{ $t('quarter') }}</span></th>
					<th><span class="blue">IV - {{ $t('quarter') }}</span></th>
					<th><span class="green">{{ $t('yearly') }}</span></th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="item in 10" :key="item">
					<td class="full-name">1. Алексей Макаров</td>
					<td><span>5</span></td>
					<td><span>5</span></td>
					<td><span>5</span></td>
					<td><span>5</span></td>
					<td><span>5</span></td>
					<td><span>5</span></td>
				</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import ClassSelectHeader from "@/components/instructor/ClassSelectHeader";
export default {
	name: "InstructorQuarterGrade",
	components: {ClassSelectHeader},
	data () {
		return {
			classes: []
		}
	},
	computed: {
		userProfile () {
			return this.$store.state.account.profile
		}
	},
	mounted() {
	},
	methods: {

	}
}
</script>

<style lang="scss" scoped>
.instructor-quarter-grade {
	padding: 25px;
	font-family: Helvetica, sans-serif;
	font-style: normal;
	font-weight: normal;

	&__body {
		margin: 20px 0;
	}

	&__table {
		background: #FFFFFF;
		width: 100%;
		box-shadow: 0px 6px 18px rgba(0, 0, 0, 0.06);
		border-radius: 4px;

		th, td {
			padding: 0 10px;

			span {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 90%;
				height: 64px;
				margin: auto;
			}

			&:not(:nth-child(4)):not(:nth-child(1)):not(:last-child) {
				span {
					background: rgba(74, 39, 243, 0.1);
				}
			}

			&:nth-child(4), &:last-child {
				span {
					background: rgba(0, 217, 95, 0.1);
				}
			}
		}

		thead {
			tr {
				border-radius: 4px;
				height: 40px;

				th:first-child {
					font-family: Open Sans, sans-serif;
					font-size: 14px;
					line-height: 119%;
					text-align: center;
					color: #707683;
				}

				th {
					span {
						border-radius: 5px;
						height: 40px;
						font-family: Helvetica;
						font-style: normal;
						font-weight: normal;
						font-size: 12px;
						line-height: 14px;

						&.blue {
							background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
							display: flex;
							align-items: center;
							justify-content: center;
							letter-spacing: 0.01em;
							color: #FFFFFF;
						}

						&.green {
							background: #00D95F;
						}
					}
				}
			}
		}

		tr {
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			height: 64px;

			td:not(:first-child) {
				text-align: center;
				font-size: 18px;
				line-height: 21px;
				letter-spacing: 0.01em;
				color: #323C47;
			}

			.full-name {
				padding-left: 30px;
				width: 300px;
				font-size: 14px;
				line-height: 16px;
				letter-spacing: 0.01em;
				color: #323C47;
			}
		}

		tbody {
			tr {
				&:hover {
					box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
				}
			}
		}
	}
}
</style>
