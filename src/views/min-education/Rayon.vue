<template>
    <div class="rayon">
        <SuperAdminSchoolHead>
            <template v-slot:title>Район</template>
<!--            <template v-slot:right>-->
<!--                <SmartButton @clicked="isAdd = true">Добавить + </SmartButton>-->
<!--            </template>-->
        </SuperAdminSchoolHead>
        <SmartTable
            :schools="rayon"
            :total-elements="rayon.length"
            :page-size="rayon.length"
            :totalPages="totalPages"
        >
            <template v-slot:head>
                <th>№</th>
                <th>Регион</th>
                <th>Район</th>
<!--                <th><img src="../../../assets/images/icons/plus.svg" alt=""></th>-->
            </template>
            <template slot="body" slot-scope="{item}">
                <td>{{ item.pos }}</td>
                <td>{{ item.regionTitle }}</td>
                <td>{{ item.title }}</td>
            </template>
        </SmartTable>
    </div>
</template>

<script>
import SuperAdminSchoolHead from "@/components/super-admin/schools/SuperAdminSchoolHead";
import SmartTable from "@/components/table/SmartTable";
import { RayonService } from "@/_services/rayon.service";
import SmartButton from "@/components/button/SmartButton";

const rayonService = new RayonService()
export default {
name: "Rayon",
    components: {SmartButton, SmartTable, SuperAdminSchoolHead},
    data () {
        return {
            rayon: [],
            totalPages: 1
        }
    },
    mounted() {
        this.fetchRayon()
    },
    methods: {
        fetchRayon () {
            rayonService.list().then(res => {
//            .sort((a, b) => a.title.localeCompare(b.title))
                this.rayon = res.map((i, index) => {
	                i.pos = index + 1;
	                return i;
                });
            }).catch(err => console.log(err));
        }
    }
}
</script>

<style scoped>

</style>
