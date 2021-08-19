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
                <div class="pin-field">
                    <div class="input-mask">
                        <label>ПИН/ИНН</label>
                        <masked-input
                            v-model="user.pin"
                            mask="1.11.11.1111.11111"
                            placeholder="0.00.00.0000.00000"
                            @blur.native="checkPin"
                        />
                    </div>
                    <div class="pin-error" v-if="!validFirstNum">1-ая цифра должна быть 1 или 2</div>
                    <div class="pin-error" v-if="!validDatePin">
                        со 2-ой по 9-ый должны быть валидными,
                        а последние 5 цифр произвольные
                    </div>
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

                <div class="gender-select">
                    <v-radio-group :mandatory="false" :rules="required" row v-model="user.gender">
                        <v-radio label="М" value="MALE"></v-radio>
                        <v-radio label="Ж" value="FEMALE"></v-radio>
                    </v-radio-group>
                </div>

                <div class="input-mask date">
                    <label>Дата рождения</label>
                    <masked-input v-model="user.dob" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ" disabled/>
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
        data() {
            return {
                cyrillicRegex: /^[аАбБвВгГдДеЕёЁжЖзЗиИйЙкКлЛмМнНоОпПрРсСтТуУфФхХцЦчЧшШщЩъЪыЫьЬэЭюЮяЯ]+$/,
                required: [
                    v => !!v || 'Input is required'
                ],
                firstLastNameRule: [
                    v => !!v || 'Обязательное поле',
                    v => !/\d/.test(v) || 'Должно быть без цифр',
                    v => this.cyrillicRegex.test(v) || 'Только кириллица'
                ],
                middleNameRule: [
                    v => !/\d/.test(v) || 'Должно быть без цифр',
                    v => this.cyrillicRegex.test(v) || 'Только кириллица'
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
                validFirstNum: true,
                validDatePin: true
            }
        },
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

            checkPin() {
                this.validFirstNum = this.user.pin[0] === '1' || this.user.pin[0] === '2';
                this.validDatePin = moment(this.user.pin.slice(2, 12), 'DD.MM.YYYY', true).isValid() && this.user.pin.slice(13).split('_').length === 1;
                if (this.validDatePin) {
                    this.user.dob = this.user.pin.slice(2, 12);
                }
                if (this.validFirstNum) {
                    this.user.gender = this.user.pin[0] === '1' ? 'FEMALE' : 'MALE';
                    this.$forceUpdate();
                }
            },

            submit() {
                this.checkPin();
                if (this.$refs.form.validate()) {
                    if (this.validFirstNum && this.validDatePin) {
                        this.user.pin = this.user.pin.replaceAll('.', '');
                        this.user.roles = this.roles.filter(i => i.code === 'ROLE_INSTRUCTOR').map(i => i.id);
                        this.user.schoolId = this.userProfile.schools[0].id;
                        if (this.isEdit) {
                            this.personEdit(this.user);
                        } else {
                            this.personCreate(this.user);
                        }
                    }
                }
            },
            personCreate(data) {
                personService.create(data).then((res) => {
                    this.$toast.success('Успешно создано!');
                    this.$emit('close', res.message);
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

    .gender-select {
        pointer-events: none;
    }
</style>
