<template>
	<div class="smart-table">
		<TableHead></TableHead>
		<div class="smart-table__body">
			<table class="smart-table__table">
				<thead>
					<tr>
						<slot name="head"></slot>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in schools" :key="index">
						<slot name="body" v-bind:item="item">
							{{ item.name }}
						</slot>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
import TableHead from '@/components/table/TableHead'
export default {
	name: "SmartTable",
	props: {
	    schools: {
	        type: Array,
		    default () {
	            return [];
		    }
	    }
	},
    components: { TableHead }
}
</script>

<style lang="scss" scoped>
	.smart-table {
	  &__body {
	    height: 70vh;
	    overflow-y: auto;
	  }
		&__table {
		  width: 95%;
		  margin: auto;
          background: linear-gradient(180deg, rgba(74, 39, 243, 0.1) 0%, rgba(51, 157, 250, 0.1) 100%);
		  border-top-left-radius: 4px;
		  border-top-right-radius: 4px;
		  text-align: center;
          border-collapse: collapse;

		  tbody {
            tr:hover {
              box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
            }
		  }
		  tr:first-child {
		    border-top: none;
		  }
		  th {
            font-size: 15px;
            line-height: 17px;
            letter-spacing: 0.01em;
            color: #339DFA;
		  }
		  td {
            font-size: 14px;
            line-height: 16px;
            letter-spacing: 0.01em;
            color: #707683;
		  }
		  tr {
            border: 1px solid rgba(0,0,0,0.1);

		    th:nth-child(odd), td:nth-child(odd) {
              background: #FFFFFF;
		    }
		  }

		  th, td {
		    padding: 15px 5px;
            //border-bottom: 1px solid rgba(0,0,0,0.1);
            //border-right: 1px solid rgba(0,0,0,0.1);
		  }
		  td:hover {
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
		  }
		  td:last-child {
		    border-right: none;
		  }
		  tr:last-child {
		    td {
		      border-bottom: none;
		    }
		  }
		}
	}
</style>
