<template>
	<div class="super-admin-chronicle">
		<SuperAdminSchoolHead>
			<template v-slot:title>Академический год</template>
			<template v-slot:right>
				<v-btn color="primary" @click="onAdd">Добавить + </v-btn>
			</template>
		</SuperAdminSchoolHead>
		<SmartTable :schools="chronicles">
			<template v-slot:head>
				<th>Year</th>
				<th><img src="../../assets/images/icons/plus.svg" alt=""></th>
			</template>
			<template slot="body" slot-scope="{item}">
				<td>{{ item.selectorTitle }}</td>
				<td><img src="../../assets/images/icons/pen.svg" alt=""></td>
			</template>
		</SmartTable>
		<v-dialog
				v-model="isAdd"
				width="546"
				id="add-form"
		>
			<AddChronicle @close="onCLoseModal"></AddChronicle>
		</v-dialog>
	</div>
</template>

<script>
import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead'
import SmartTable from '@/components/table/SmartTable'
import AddChronicle from '@/components/super-admin/chronicle/AddChronicle'
import { ChronicleService } from '@/_services/chronicle.service'

const chronicleService = new ChronicleService();
export default {
name: "Chronicle",
    components: { AddChronicle, SmartTable, SuperAdminSchoolHead },
	data: () => ({
		isAdd: false,
		chronicles: [],
	}),
	mounted () {
        this.fetchChronicles();
    },
    methods: {
        onAdd () {
            this.isAdd = true;
        },
		fetchChronicles () {
            chronicleService.list().then(res => {
                this.chronicles = res;
            }).catch(err => console.log(err));
		},
        onCLoseModal () {
            this.isAdd = false;
            this.fetchChronicles();
        }
	}
}
</script>

<style lang="scss" scoped>
	.super-admin-chronicle {
	}
</style>
