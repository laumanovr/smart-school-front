<template>
    <div class="rayon">
        <SuperAdminSchoolHead>
            <template v-slot:title>Район</template>
<!--            <template v-slot:right>-->
<!--                <SmartButton @clicked="isAdd = true">Добавить + </SmartButton>-->
<!--            </template>-->
        </SuperAdminSchoolHead>
        <SmartTable :schools="rayon" :total-elements="rayon.length" :page-size="rayon.length">
            <template v-slot:head>
                <th>№</th>
                <th>Название</th>
<!--                <th><img src="../../../assets/images/icons/plus.svg" alt=""></th>-->
            </template>
            <template slot="body" slot-scope="{item}">
                <td>{{ item.pos }}</td>
                <td>{{ item.title }}</td>
<!--                <td><img src="../../../assets/images/icons/pen.svg" alt=""></td>-->
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
        }
    },
    mounted() {
        this.fetchRayon()
    },
    methods: {
        fetchRayon () {
            rayonService.list().then(res => {
                this.rayon = res.map((i, index) => {
                    i.pos = index + 1;
                    return i;
                }).sort((a, b) => a.title.localeCompare(b.title));
            }).catch(err => console.log(err));
        }
    }
}
</script>

<style scoped>

</style>
