<template>
    <v-form @submit.prevent="submit" ref="form">
        <div class="form-head">
            <span v-if="!isEdit">Добавить Школу</span>
            <span v-else>Редактировать Школу</span>
            <img alt="" src="../../../assets/images/profile-icon.svg">
            <button class="profile-edit">
                <img src="../../../assets/images/icons/edit.svg">
            </button>
        </div>
        <div>
            <v-text-field :rules="ruleName" label="Название" v-model="school.name"></v-text-field>
        </div>
        <div class="spacer">
            <v-text-field label="Email" v-model="school.email"></v-text-field>
            <v-text-field type="number" label="Номер телефона" v-model="school.phone"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="ruleName" label="Адрес" v-model="school.address"></v-text-field>
        </div>
        <div>
            <v-textarea
                label="Описание"
                name="input-7-4"
                outlined
                v-model="school.description"
                value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
            ></v-textarea>
        </div>
        <div>
            <v-select
                :items="schoolTypes"
                :rules="ruleName"
                item-text="title"
                item-value="val"
                label="Тип Школы"
                v-model="school.schoolType"
            ></v-select>
        </div>
        <div>
            <v-select
                :items="languages"
                :rules="ruleName"
                item-text="name"
                item-value="id"
                label="Язык"
                v-model="school.languageId"
            ></v-select>
        </div>
        <div>
            <v-select
                :items="regions"
                @change="fetchRayons"
                item-text="title"
                item-value="id"
                label="Регион"
                v-model="school.regionId"
            ></v-select>
        </div>
        <div>
            <v-select
                :items="rayons"
                :rules="ruleName"
                item-text="title"
                item-value="id"
                label="Район"
                v-model="school.rayonId"
            ></v-select>
        </div>
        <div>
            <v-select
                :items="chronicles"
                :rules="ruleName"
                item-text="selectorTitle"
                item-value="id"
                label="Академический год"
                v-model="school.chronicleYearId"
            ></v-select>
        </div>
        <div class="form-footer">
            <v-btn color="primary" type="submit">Сохранить</v-btn>
            <v-btn @click="$emit('close')">Отменить</v-btn>
        </div>
    </v-form>
</template>

<script>
import {LanguageService} from '@/_services/language.service'
import {RegionService} from '@/_services/region.service'
import {RayonService} from '@/_services/rayon.service'
import {ChronicleService} from '@/_services/chronicle.service'
import {SchoolService} from '@/_services/school.service'
import {QuarterService} from "@/_services/quarter.service";

const quarterService = new QuarterService();
const schoolService = new SchoolService()
const chronicleService = new ChronicleService()
const rayonService = new RayonService()
const regionService = new RegionService()
const languageService = new LanguageService()

export default {
    name: 'AddSchool',
    props: {
        editSchool: {
            type: Object,
            default() {
                return {};
            }
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        school: {},
        schoolTypes: [
            {
                val: 'PUBLIC',
                title: 'Государственный'
            },
            {
                val: 'PRIVATE',
                title: 'Частный'
            }
        ],
        languages: [],
        regions: [],
        rayons: [],
        chronicles: [],
        ruleName: [
            v => !!v || 'поле обязательно для заполнения'
        ]
    }),
    mounted() {
        if (this.isEdit) {
            this.school = {
                id: this.editSchool.id,
                address: this.editSchool.address,
                avatar: this.editSchool.avatar,
                chronicleYearId: this.editSchool.chronicleId,
                description: this.editSchool.description,
                email: this.editSchool.email,
                languageId: this.editSchool.languageId,
                name: this.editSchool.name,
                phone: this.editSchool.phone,
                rayonId: this.editSchool.rayonId,
                regionId: this.editSchool.regionId,
                schoolType: this.editSchool.schoolType
            };
            this.fetchRayons(this.school.regionId);
        }
        this.fetchLanguage()
        this.fetchRegions()
        this.fetchChronicles()
    },
    methods: {
        fetchLanguage() {
            languageService.list().then(res => {
                this.languages = res
            }).catch(err => console.log(err))
        },
        fetchRegions() {
            regionService.list(0).then(res => {
                this.regions = res.content
            }).catch(err => console.log(err))
        },
        fetchRayons(id) {
            rayonService.listByRegion(id).then(res => {
                this.rayons = res
            }).catch(err => console.log(err))
        },
        fetchChronicles() {
            chronicleService.list().then(res => {
                this.chronicles = res
            }).catch(err => console.log(err))
        },
        submit() {
            if (this.$refs.form.validate()) {
                if (this.isEdit) {
                    schoolService.update(this.school).then(res => {
                        this.$toast.success('Successfully updated!')
                        this.school = {}
                        this.$emit('close')
                    }).catch(err => console.log(err))
                } else {
                    schoolService.create(this.school).then(res => {
                        this.$toast.success('Successfully created!')
                        this.school = {}
                        this.$emit('close')
                    }).catch(err => console.log(err))
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.v-form {
    background: #FFFFFF;
    border-radius: 7px;
    padding: 20px 40px;

    > div.form-head {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .v-input__v-slot .v-label {
            color: red !important;
        }

        &.spacer {
            .v-text-field:first-child {
                margin-right: 20px;
            }
        }

        &.form-head {
            position: relative;
            font-weight: normal;
            font-size: 18px;
            line-height: 21px;
            color: #192A3E;

            .profile-edit {
                background: #FFFFFF;
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.08);
                width: 24px;
                height: 24px;
                border-radius: 50%;
                position: absolute;
                right: 0;
                bottom: 0;

                img {
                    margin-top: 5px;
                }
            }
        }

        &.form-footer {
            justify-content: center;

            .v-btn:first-child {
                margin-right: 20px;
            }
        }
    }

}
</style>
