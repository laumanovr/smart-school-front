<template>
    <v-form @submit.prevent="submit" ref="form">
        <div class="form-head">
            <span v-if="!isEdit"><h3>Добавить учителя</h3></span>
            <span v-else>Редактировать учителя</span>
            <img alt="" src="../../assets/images/profile-icon.svg">
            <button class="profile-edit">
                <img src="../../assets/images/icons/edit.svg">
            </button>
        </div>
        <div>
            <v-text-field :rules="firstLastNameRule" label="Имя" v-model="user.name"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="firstLastNameRule" label="Фамилия" v-model="user.surname"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="middleNameRule" label="Отчество" v-model="user.middleName"></v-text-field>
        </div>
        <div>
            <v-text-field
                label="ПИН/ИНН"
                v-model="user.pin"
                type="number"
                counter="14"
                :rules="required"
                @input="limitNumbers(user, 'pin', 14)"
            />
        </div>
        <div>
            <v-radio-group :mandatory="false" :rules="required" row v-model="user.gender">
                <v-radio label="М" value="MALE"></v-radio>
                <v-radio label="Ж" value="FEMALE"></v-radio>
            </v-radio-group>
        </div>

        <div class="input-mask date">
            <label>Дата рождения</label>
            <masked-input v-model="user.dob" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ" />
        </div>

        <div class="spacer">
            <v-text-field label="Номер телефона" v-model="user.phone"></v-text-field>
        </div>

        <div class="form-footer">
            <div class="btn-actions">
                <v-btn color="red" @click="$emit('close')">Отменить</v-btn>
                <v-btn color="green" type="submit">Сохранить</v-btn>
            </div>
        </div>
    </v-form>
</template>

<script>
import { limitNumbers } from '@/utils/limit-numbers';
import {PersonService} from '@/_services/person.service';
import moment from 'moment';
import {RoleService} from '@/_services/role.service';
import {LanguageService} from '@/_services/language.service';
const languageService = new LanguageService();
const roleService = new RoleService();
const personService = new PersonService();
import MaskedInput from 'vue-masked-input';

export default {
    name: 'AddTeacher',
    components: {
        MaskedInput
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        required: [
            v => !!v || 'Input is required'
        ],
        firstLastNameRule: [
            v => !!v || 'Обязательное поле',
            v => !/\d/.test(v) || 'Должно быть без цифр'
        ],
        middleNameRule: [
            v => !/\d/.test(v) || 'Должно быть без цифр'
        ],
        roles: [],
        languages: [],
        menu2: false,
    }),
    computed: {
        userProfile() {
            return this.$store.state.account.profile
        },
    },
    mounted() {
        this.fetchRoles();
        this.fetchLanguages();
    },
    methods: {
        limitNumbers: limitNumbers,

        fetchRoles() {
            roleService.listPageable(0).then(res => {
                this.roles = res
            }).catch(err => console.log(err))
        },
        fetchLanguages() {
            languageService.list().then(res => {
                this.languages = res
            }).catch(err => console.log(err))
        },

        submit() {
            if (this.$refs.form.validate()) {
                this.user.roles = this.roles.filter(i => i.code === 'ROLE_INSTRUCTOR').map(i => i.id);
                this.user.schoolId = this.userProfile.schools[0].id;
                if (this.isEdit) {
                    this.personEdit(this.user)
                } else {
                    this.personCreate(this.user)
                }
            }
        },
        personCreate(data) {
            personService.create(data).then(res => {
                this.$toast.success('Успешно создано!');
                this.$emit('close');
            }).catch(err => this.$toast.error(err));
        },
        personEdit(data) {
            personService.edit(data).then(res => {
                this.$toast.success('Успешно обновлено!');
                this.$emit('close');
            }).catch(err => this.$toast.error(err));
        },
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
        position: relative;

        .v-input--radio-group {
            margin-right: 20px;
        }

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

        &.spacer {
            .v-text-field:first-child {
                margin-right: 20px;
            }
        }
    }
}
</style>
