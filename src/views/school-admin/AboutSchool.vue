<template>
    <div class="about-container">
        <SuperAdminSchoolHead>
            <template v-slot:center><h1>О школе</h1></template>
        </SuperAdminSchoolHead>

        <div class="school-info">
            <div class="form-head">
                <span>Инфо школы</span>
            </div>

            <div>
                <v-text-field v-model="schoolObj.name" :rules="required" label="Полное название"></v-text-field>
            </div>

            <div>
                <v-text-field v-model="schoolObj.pin" :rules="required" label="Пин школы" type="number"></v-text-field>
            </div>

                <div>
                    <v-select
                        :rules="required"
                        :items="schoolQuarters"
                        item-text="semester"
                        item-value="id"
                        label="Четверть"
                        v-model="schoolObj.quarterId"
                    >
                    </v-select>
                </div>

            <div class="spacer">
                <div class="input-mask">
                    <label>Телефон</label>
                    <masked-input
                        v-model="schoolObj.phone"
                        mask="\0\(111)111111"
                        placeholder="0(555)123456"
                    />
                </div>
            </div>

            <div>
                <v-text-field label="Email" v-model="schoolObj.email" :rules="emailRules"/>
            </div>

            <div>
                <v-select
                    :rules="required"
                    :items="schoolTypes"
                    item-text="text"
                    item-value="value"
                    label="Тип организации"
                    v-model="schoolObj.schoolType"
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
                    v-model="schoolObj.regionId"
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
                    v-model="schoolObj.rayonId"
                >
                </v-select>
            </div>

            <div class="form-footer">
                <v-btn color="primary" @click="updateSchoolInfo">Сохранить</v-btn>
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
    import moment from 'moment';
    import { RegionService } from '@/_services/region.service';
    const regionService = new RegionService();
    import { RayonService } from '@/_services/rayon.service';
    const rayonService = new RayonService();
    import {QuarterService} from '@/_services/quarter.service';
    const quarterService = new QuarterService();
    import {SchoolService} from '@/_services/school.service';
    const schoolService = new SchoolService();
    import MaskedInput from 'vue-masked-input';

    export default {
        name: 'AboutSchool',
        components: {
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable,
            MaskedInput
        },

        data() {
            return {
                required: [v => !!v || 'Обязательное поле'],
                emailRules: [v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным'],
                schoolObj: {
                    address: '',
                    avatar: '',
                    chronicleYearId: 0,
                    description: '',
                    email: '',
                    languageId: 0,
                    name: '',
                    phone: '',
                    rayonId: 0,
                    schoolType: '',
                    quarterId: ''
                },
                allRegions: [],
                allRayons: [],
                schoolQuarters: [],
                schoolTypes: [
                    {value: 'PRIVATE', text: 'Частная'},
                    {value: 'PUBLIC', text: 'Государственная'},
                    {value: 'MUNICIPALITY', text: 'Муниципальный'}
                ]
            }
        },

        computed: {
            userProfile () {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },

        created() {
            this.fetchRegions();
            this.fetchRayons();
            this.getQuartersBySchool();
            this.getRayonById();
        },

        mounted() {
            this.schoolObj.languageId = this.school.languageId;
            this.schoolObj.chronicleYearId = this.school.chronicleId;
            this.schoolObj.chronicleId = this.school.chronicleId;
            this.schoolObj.name = this.school.name;
            this.schoolObj.quarterId = this.school.quarterId;
            this.schoolObj.phone = this.school.phone;
            this.schoolObj.email = this.school.email;
            this.schoolObj.schoolType = this.school.schoolType;
            this.schoolObj.rayonId = this.school.rayonId;
            this.schoolObj.pin = this.school.pin;
            this.schoolObj.id = this.school.id;
        },

        methods: {
            getQuartersBySchool() {
                quarterService.getBySchoolAndChronicle(this.school.id, this.school.chronicleId).then((res) => {
                    this.schoolQuarters = res.sort((a, b) => a.semester - b.semester);
                }).catch((err) => this.$toast.error(err.message));
            },

            fetchRegions() {
                regionService.list(0).then(res => {
                    this.allRegions = res.content;
                }).catch(err => console.log(err))
            },

            fetchRayons(id) {
                if (id) {
                    rayonService.listByRegion(id).then(res => {
                        this.allRayons = res
                    }).catch(err => console.log(err))
                }
            },

            getRayonById() {
                rayonService.getById(this.school.rayonId).then((res) => {
                    this.fetchRayons(res.region.id);
                    this.schoolObj.regionId = res.region.id;
                })
            },

            updateSchoolInfo() {
                this.userProfile.schools[0] = this.schoolObj;
                this.schoolObj.phone = this.schoolObj.phone.slice(1).replace(/[(_)]/g, '');
                schoolService.update(this.schoolObj).then(() => {
                    this.$toast.success('Успешно');
                    this.$store.dispatch('account/updateProfileData', this.userProfile);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            }
        },
    }
</script>

<style lang="scss">
    .about-container {
        width: 65%;
        margin: 0 auto 50px;

        .school-info {
            background: #fff;
            padding: 15px;
            border: 2px solid #03A9F4;

            .form-footer {
                text-align: center;
                button {
                    margin-right: 15px;
                }
            }
        }
    }
</style>
