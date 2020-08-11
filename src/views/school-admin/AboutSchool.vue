<template>
    <div class="about-container">
        <SuperAdminSchoolHead>
            <template v-slot:title>О школе</template>
        </SuperAdminSchoolHead>

        <div class="school-info">
            <div class="form-head">
                <span>Инфо школы</span>
            </div>

            <div>
                <v-text-field v-model="schoolObj.name" :rules="required" label="Полное название"></v-text-field>
            </div>

                <div>
                    <v-select
                        :rules="required"
                        :items="[]"
                        item-text=""
                        item-value=""
                        label="Четверть"
                        v-model="schoolObj.quarter"
                    >
                    </v-select>
                </div>

            <div class="spacer">
                <v-text-field v-model="schoolObj.phoneNumber" label="Номер телефона"></v-text-field>
            </div>

            <div>
                <v-text-field  label="Email" v-model="schoolObj.email"></v-text-field>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="['Частная', 'Государственная']"
                    item-text=""
                    item-value=""
                    label="Тип организации"
                    v-model="schoolObj.type"
                >
                </v-select>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="allRegions"
                    item-text="title"
                    item-value="id"
                    label="Область"
                    @change="fetchRayons"
                >
                </v-select>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="allRayons"
                    item-text="title"
                    item-value="id"
                    label="Район"
                    v-model="schoolObj.rayon"
                >
                </v-select>
            </div>

            <div class="form-footer">
                <v-btn color="primary">Сохранить</v-btn>
                <v-btn>Отменить</v-btn>
            </div>

        </div>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import SmartTable from '@/components/table/SmartTable';
    import SmartButton from '@/components/button/SmartButton';
    import SmartSearchInput from '@/components/input/SmartSearchInput';
    import SmartBtn2 from '@/components/button/SmartBtn2';
    import SmartSelect from '@/components/select/SmartSelect';
    import { LanguageService } from '@/_services/language.service';
    const languageService = new LanguageService();
    import {SchoolClassService} from '@/_services/school-class.service';
    const schoolClassService = new SchoolClassService();
    import moment from 'moment';
    import { RoleService } from '@/_services/role.service'
    const roleService = new RoleService();
    import { RegionService } from '@/_services/region.service';
    const regionService = new RegionService();
    import { RayonService } from '@/_services/rayon.service';
    const rayonService = new RayonService();

    export default {
        name: 'AboutSchool',
        components: {
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable
        },

        data() {
            return {
                required: [v => !!v || 'Input is required'],
                schoolObj: {
                    name: '',
                    quarter: '',
                    phoneNumber: '',
                    email: '',
                    type: '',
                    rayon: '',
                    region: '',
                },
                allRegions: [],
                allRayons: []

            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            }
        },

        created() {
            this.schoolObj.name = this.userProfile.schools[0].name;
            this.schoolObj.quarter = 0;
            this.schoolObj.phoneNumber = 0;
            this.schoolObj.email = '';
            this.schoolObj.type = '';
            this.schoolObj.rayon = '';
            this.schoolObj.region = '';

            this.fetchRegions();
            this.fetchRayons();
        },

        methods: {
            fetchRegions() {
                regionService.list(0).then(res => {
                    this.allRegions = res.content
                }).catch(err => console.log(err))
            },
            fetchRayons(id) {
                rayonService.listByRegion(id).then(res => {
                    this.allRayons = res
                }).catch(err => console.log(err))
            },
        }
    }
</script>

<style lang="scss">
    .about-container {
        width: 1000px;
        margin: 0 auto;

        .school-info {
            background: #fff;
            padding: 15px;

            .form-footer {
                text-align: center;
                button {
                    margin-right: 15px;
                }
            }
        }
    }
</style>
