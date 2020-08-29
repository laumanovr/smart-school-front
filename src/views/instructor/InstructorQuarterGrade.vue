<template>
	<div class="instructor-quarter-grade">
		<ClassSelectHeader :headTitle="'Итоговые Оценки'" :showClass="true" />

		<div class="instructor-quarter-grade__body">
			<table class="instructor-quarter-grade__table">
				<thead>
					<tr>
						<th>Ф.И.О</th>
						<th><span>I - четверть</span></th>
						<th><span>II - четверть</span></th>
						<th><span class="green">Полугодовая</span></th>
						<th><span>III - четверть</span></th>
						<th><span>IV - четверть</span></th>
						<th><span class="green">Годовая</span></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in 10" :key="item">
						<td class="full-name">1.  Алексей Макаров </td>
						<td>5</td>
						<td>4</td>
						<td>5</td>
						<td>5</td>
						<td>5</td>
						<td>5</td>
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
	components: {ClassSelectHeader}
}
</script>

<style lang="scss" scoped>
	.instructor-quarter-grade {
		padding: 25px;
		font-family: Helvetica,sans-serif;
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

			thead {
				tr {
					border-radius: 4px;
					height: 40px;

					th:first-child {
						font-family: Open Sans,sans-serif;
						font-size: 14px;
						line-height: 119%;
						text-align: center;
						color: #707683;
					}
					th {
						span {
							font-family: Helvetica;
							font-style: normal;
							font-weight: normal;
							background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
							border-radius: 5px;
							display: flex;
							align-items: center;
							justify-content: center;
							height: 40px;
							width: 90%;
							font-size: 12px;
							line-height: 14px;
							letter-spacing: 0.01em;
							color: #FFFFFF;

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
