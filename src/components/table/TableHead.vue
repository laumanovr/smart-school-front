<template>
	<div class="smart-table__head">
		<div class="smart-table__item">
			<v-select
					:items="[]"
					label="Outlined style"
					dense
					outlined
			></v-select>
			<v-select
					:items="[]"
					label="Outlined style"
					dense
					outlined
			></v-select>
		</div>
		<div class="smart-table__item">
			<span>Показано 1-20 из 36</span>
			<button class="next-prev"><v-icon>$chevronLeft</v-icon></button>
			<button class="next-prev"><v-icon>$chevronRight</v-icon></button>
		</div>
	</div>
</template>

<script>
export default {
name: "TableHead"
}
</script>

<style lang="scss" scoped>
	.smart-table {
      &__head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 95%;
        margin: auto;
      }
      &__item {
        display: flex;
        align-items: center;

        .v-select {
          width: 150px;
          margin-right: 20px;
        }
        span:first-child {
          margin-right: 10px;
          font-size: 14px;
          line-height: 24px;
          color: #333333;
        }
        .next-prev {
          border: 1px solid #C6CBD4;
          box-sizing: border-box;
          border-radius: 2px;
          width: 32px;
          height: 32px;
        }
      }
	}
</style>
