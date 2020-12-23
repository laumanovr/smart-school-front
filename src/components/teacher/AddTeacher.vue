<template>
    <div class="add-edit-modal">
        <PreLoader v-if="isLoading"/>
        <template v-if="mainMode == 'main'">
            <v-form @submit.prevent="submit" ref="form">
                <div class="reset-pass" v-if="isEdit" @click="resetPassword('confirm')">Сбросить пароль</div>
                <div class="form-head">
                    <span v-if="!isEdit"><h3>Добавить учителя</h3></span>
                    <span v-else><h3>Редактировать учителя</h3></span>
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
                    <masked-input v-model="user.dob" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ"/>
                </div>

                <div class="spacer">
                    <v-text-field label="Номер телефона" v-model="user.phone" type="number"/>
                </div>

                <div class="form-footer">
                    <div class="btn-actions">
                        <v-btn color="red" @click="$emit('close')">Отменить</v-btn>
                        <v-btn color="green" type="submit">Сохранить</v-btn>
                    </div>
                </div>
            </v-form>
        </template>

        <!--RESET PASSWORD-->
        <div class="modal-container" v-if="mainMode == 'reset'">
            <template v-if="resetPassMode == 'confirm'">
                <h4>Сбросить пароль этого учителя?</h4>
                <div class="btn-actions">
                    <v-btn color="red" @click="$emit('hide')">Отмена</v-btn>
                    <v-btn color="green" @click="resetPassword('submit')">Сбросить</v-btn>
                </div>
            </template>
            <template v-if="resetPassMode == 'success'">
                <h4>Пароль успешно сброшен <br> на такой же как логин!</h4>
                <div class="btn-actions">
                    <v-btn color="primary" @click="$emit('hide')">Закрыть</v-btn>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {limitNumbers} from '@/utils/limit-numbers';
    import {PersonService} from '@/_services/person.service';
    import moment from 'moment';
    import {RoleService} from '@/_services/role.service';
    const roleService = new RoleService();
    import {LanguageService} from '@/_services/language.service';
    const languageService = new LanguageService();
    const personService = new PersonService();
    import MaskedInput from 'vue-masked-input';
    import {userService} from '@/_services/user.service';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        name: 'AddTeacher',
        components: {
            MaskedInput,
            PreLoader
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
            isLoading: false,
            mainMode: 'main',
            resetUser: {
                enabled: true,
                languageId: 0,
                name: '',
                password: '',
                roles: [],
                surname: ''
            },
            resetPassMode: '',
        }),
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
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

            resetPassword(mode) {
                if (mode === 'submit') {
                    this.isLoading = true;
                    userService.updateUser(this.resetUser).then(() => {
                        this.resetPassMode = 'success';
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                } else {
                    this.mainMode = 'reset';
                    this.resetPassMode = mode;
                    this.resetUser.id = this.user.userId;
                    this.resetUser.surname = this.user.surname;
                    this.resetUser.name = this.user.name;
                    this.resetUser.languageId = this.school.languageId;
                    this.resetUser.password = this.user.username;
                    this.resetUser.roles = this.roles.filter(i => i.code === 'ROLE_INSTRUCTOR').map(i => i.id);
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

    .reset-pass {
        background: #eee;
        display: inline-block;
        padding: 2px 5px;
        border-radius: 5px;
        color: #656565;
        cursor: pointer;
    }
</style>
