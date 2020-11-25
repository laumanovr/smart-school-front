<template>
    <div>
        <PreLoader v-if="isLoading"/>
        <v-form @submit.prevent="$emit('submit', importData)" ref="importForm">
            <v-switch
                v-model="importData.isIsouMode"
                label="ИСОУ формат"
            ></v-switch>
            <div>
                <v-file-input
                    :rules="required"
                    v-model="importData.file"
                    chips show-size
                    accept=".xlsx, .xls, .csv"
                    label="Выберите файл"
                    @change="checkFileFormat"
                />
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
    </div>
</template>

<script>
import SmartBtn2 from "@/components/button/SmartBtn2";
import { ChronicleService } from "@/_services/chronicle.service";
import { LanguageService } from "@/_services/language.service";
const languageService = new LanguageService();
const chronicleService = new ChronicleService();
import readXlsxFile from 'read-excel-file';
import moment from 'moment';
import PreLoader from "@/components/preloader/PreLoader";

export default {
    name: "ImportFile",
    components: {SmartBtn2, PreLoader},
    props: {
        type: String
    },
    data () {
        return {
            file: null,
            required: [
                v => !!v || 'поле обязательно для заполнения'
            ],
            years: [],
            languages: [],
            importData: {
                file: null
            },
            isLoading: false
        }
    },
    mounted() {
        this.fetchYears();
        this.fetchLanguages();
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
        },
        checkFileFormat() {
            if (this.type === 'teachers') {
                this.checkTeachersExcel();
            } else {
                this.checkStudentsExcel();
            }
        },
        checkTeachersExcel() {
            this.isLoading = true;
            this.$nextTick(() => {
                readXlsxFile(this.importData.file).then((rows) => {
                    const valid = rows.slice(2).every((item) => moment(item[5]).isValid());
                    if (!valid) {
                        this.$toast.error(
                            'Даты рождения у некоторых не правильный, проверьте',
                            {duration: 6000}
                        );
                        this.importData.file = null;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                });
            })
        },
        checkStudentsExcel() {
            this.isLoading = true;
            this.$nextTick(() => {
                readXlsxFile(this.importData.file).then((rows) => {
                    const items = rows.slice(2);
                    const validDob = items.every((item) => moment(item[7]).isValid());
                    if (!validDob) {
                        this.$toast.error(
                            'Даты рождения у некоторых не правильный, проверьте',
                            {duration: 6000}
                        );
                        this.importData.file = null;
                    }
                    const validClassLetter = items.every((item) => item[5] === item[5].toUpperCase());
                    if (!validClassLetter) {
                        this.$toast.error(
                            'Укажите буквы классов с большой буквы, у всех!',
                            {duration: 6000}
                        );
                        this.importData.file = null;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.isLoading = false;
                });
            });
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
