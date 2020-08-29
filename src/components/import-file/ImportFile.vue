<template>
        <v-form @submit.prevent="$emit('submit', importData)" ref="form">
	        <v-switch
		        v-model="importData.isIsouMode"
		        label="ИСОУ формат"
	        ></v-switch>
            <div>
                <v-file-input :rules="required" v-model="importData.file" chips show-size accept=".xlsx, .xls, .csv" label="Выберите файл"></v-file-input>
            </div>
            <div>
                <v-select
                    :items="years"
                    :rules="required"
                    item-text="selectorTitle"
                    item-value="id"
                    label="Академический год"
                    v-model="importData.chronicleId"
                ></v-select>
            </div>
            <div>
                <v-select
                    :items="languages"
                    :rules="required"
                    item-text="name"
                    item-value="id"
                    label="Язык"
                    v-model="importData.languageId"
                ></v-select>
            </div>
            <div>
                <v-btn color="primary" type="submit">Сохранить</v-btn>
            </div>
        </v-form>
</template>

<script>
import SmartBtn2 from "@/components/button/SmartBtn2";
import { ChronicleService } from "@/_services/chronicle.service";
import { LanguageService } from "@/_services/language.service";

const languageService = new LanguageService()
const chronicleService = new ChronicleService()
export default {
    name: "ImportFile",
    components: {SmartBtn2},
    data () {
        return {
            file: null,
            required: [
                v => !!v || 'поле обязательно для заполнения'
            ],
            years: [],
            languages: [],
            importData: {},
        }
    },
    mounted() {
        this.fetchYears()
        this.fetchLanguages()
    },
    methods: {
        fetchYears () {
            chronicleService.list().then(res => {
                this.years = res;
            }).catch(err => console.log(err));
        },
        fetchLanguages () {
            languageService.list().then(res => {
                this.languages = res;
            }).catch(err => console.log(err));
        }
    }
}
</script>

<style lang="scss" scoped>
    .v-form {
        background: #FFFFFF;
        border-radius: 7px;
        padding: 20px 40px;
    }
</style>
