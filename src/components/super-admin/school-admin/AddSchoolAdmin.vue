<template>
    <div class="add-edit-modal">
        <PreLoader v-if="isLoading"/>
        <template v-if="mainMode == 'main'">
            <v-form @submit.prevent="submit" ref="form">
                <div class="reset-pass" v-if="isEdit" @click="resetPassword('confirm')">Сбросить пароль</div>
                <div class="form-head">
                    <span>{{isEdit ? 'Редактировать' : 'Добавить администратора' }}</span>
                    <img alt="" src="../../../assets/images/profile-icon.svg">
                    <button class="profile-edit">
                        <img src="../../../assets/images/icons/edit.svg">
                    </button>
                </div>
                <div>
                    <v-text-field :rules="firstLastNameRule" label="Имя" v-model="schoolAdmin.name"></v-text-field>
                </div>
                <div>
                    <v-text-field :rules="firstLastNameRule" label="Фамилия" v-model="schoolAdmin.surname"></v-text-field>
                </div>
                <div>
                    <v-text-field :rules="middleNameRule" label="Отчество" v-model="schoolAdmin.middleName"></v-text-field>
                </div>
                <div class="pin-field" v-if="showPinField">
                    <div class="input-mask">
                        <label>ПИН/ИНН</label>
                        <masked-input
                            v-model="schoolAdmin.pin"
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
                    <v-radio-group :mandatory="false" :rules="required" row v-model="schoolAdmin.gender">
                        <v-radio label="Мужчина" value="MALE"></v-radio>
                        <v-radio label="Женщина" value="FEMALE"></v-radio>
                    </v-radio-group>
                </div>

                <div class="input-mask date">
                    <label>Дата рождения</label>
                    <masked-input v-model="schoolAdmin.dob" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ" />
                </div>

                <div class="spacer">
                    <v-text-field label="Email" v-model="schoolAdmin.email" :rules="emailRule"/>
                    <v-text-field label="Номер телефона" v-model="schoolAdmin.phone" type="number"/>
                </div>
                <!--<div>-->
                    <!--<v-text-field label="Адрес" v-model="schoolAdmin.address"></v-text-field>-->
                <!--</div>-->
                <div>
                    <v-autocomplete
                        :items="schools"
                        :rules="required"
                        item-text="name"
                        item-value="id"
                        label="Школа"
                        v-model="schoolAdmin.schoolId"
                        clearable
                        hide-no-data
                        :loading="schoolLoader"
                        :search-input.sync="searchSchool"
                        @change="onSelectSchool"
                    />
                </div>

                <!--<div>-->
                    <!--<v-select-->
                        <!--:items="languages"-->
                        <!--:rules="required"-->
                        <!--item-text="name"-->
                        <!--item-value="id"-->
                        <!--label="Язык"-->
                        <!--v-model="schoolAdmin.languageId"-->
                    <!--&gt;</v-select>-->
                <!--</div>-->
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
                <h4>Сбросить пароль этого админа?</h4>
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
import { limitNumbers } from '@/utils/limit-numbers';
import { PersonService } from '@/_services/person.service';
import { SchoolService } from '@/_services/school.service';
import { LanguageService } from '@/_services/language.service';
import moment from 'moment';
import { RoleService } from '@/_services/role.service';
const roleService = new RoleService();
const languageService = new LanguageService();
const schoolService = new SchoolService();
const personService = new PersonService();
import {userService} from '@/_services/user.service';
import MaskedInput from 'vue-masked-input';
import PreLoader from '@/components/preloader/PreLoader';

export default {
  name: 'AddSchoolAdmin',
  components: {
      MaskedInput,
      PreLoader
  },
  props: {
    role: {
      type: String,
      default: 'ROLE_ADMIN'
    },
    selectedAdmin: Object
  },

  data: () => ({
    emailRule: [
        v => !!v || 'Email обязательный',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным'
    ],
    required: [
        v => !!v || 'поле обязательно для заполнения'
    ],
    firstLastNameRule: [
        v => !!v || 'Обязательное поле',
        v => !/\d/.test(v) || 'Должно быть без цифр'
    ],
    middleNameRule: [
        v => !/\d/.test(v) || 'Должно быть без цифр'
    ],
    schoolAdmin: {
      enabled: true,
      dob: '',
      roles: [],
    },
    menu2: false,
    schools: [],
    languages: [],
    roles: [],
    page: 0,
    mainMode: 'main',
    isLoading: false,
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
    validDatePin: true,
    showPinField: false,
    typingTimer: null,
    isTimerBlocked: false,
    schoolLoader: false,
    searchSchool: '',
  }),

  computed: {
      isEdit() {
          return Object.values(this.selectedAdmin).length > 0;
      }
  },

  mounted() {
    this.fetchSchools();
    this.fetchLanguages();
    this.fetchRoles();
    this.schoolAdmin = this.isEdit ? this.selectedAdmin : this.schoolAdmin;
    if (this.isEdit && this.selectedAdmin.schoolId) {
        schoolService.getById(this.selectedAdmin.schoolId).then((res) => {
            this.schools.push(res);
        });
    }
    this.$nextTick(() => {
        setTimeout(() => {
            this.showPinField = true;
        });
    });
  },

  methods: {
    limitNumbers: limitNumbers,

    checkPin() {
        this.validFirstNum = this.schoolAdmin.pin[0] === '1' || this.schoolAdmin.pin[0] === '2';
        this.validDatePin = moment(this.schoolAdmin.pin.slice(2, 12), 'DD.MM.YYYY', true).isValid() && this.schoolAdmin.pin.slice(13).split('_').length === 1;
        if (this.validDatePin) {
            this.schoolAdmin.dob = this.schoolAdmin.pin.slice(2, 12);
        }
    },

    onSelectSchool() {
        this.isTimerBlocked = true;
        setTimeout(() => {
            this.isTimerBlocked = false;
        }, 2000);
    },

    fetchSchools(searchQuery='') {
        schoolService.listPageable(this.page, '', '', searchQuery).then((res) => {
            if (res._embedded) {
                this.schools = res._embedded.schoolResourceList;
            }
            this.schoolLoader = false;
        }).catch((err) => {
            this.$toast.error(err);
        });
    },

    fetchRoles () {
      roleService.listPageable(0).then(res => {
        this.roles = res
      }).catch(err => console.log(err))
    },

    fetchLanguages () {
      languageService.list().then(res => {
        this.languages = res
      }).catch(err => console.log(err))
    },

    submit() {
        this.checkPin();
        if (this.$refs.form.validate()) {
            if (this.validFirstNum && this.validDatePin) {
                this.isLoading = true;
                this.schoolAdmin.pin = this.schoolAdmin.pin.replaceAll('.', '');
                this.schoolAdmin.roles = this.roles.filter(i => i.code === this.role).map(i => i.id);
                if (this.isEdit) {
                    personService.edit(this.schoolAdmin).then(() => {
                        this.$toast.success('Успешно обновлено!');
                        this.$emit('close');
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                } else {
                    personService.create(this.schoolAdmin).then(() => {
                        this.$toast.success('Успешно создано!');
                        this.$emit('close');
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            }
        }
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
            this.resetUser.id = this.schoolAdmin.userId;
            this.resetUser.surname = this.schoolAdmin.surname;
            this.resetUser.name = this.schoolAdmin.name;
            this.resetUser.languageId = this.schoolAdmin.languageId;
            this.resetUser.password = this.schoolAdmin.username;
            this.resetUser.roles = this.roles.filter(i => i.code === 'ROLE_ADMIN').map(i => i.id);
        }
    }
  },

  watch: {
      searchSchool(inputValue) {
          clearTimeout(this.typingTimer);
          this.typingTimer = null;
          if (!this.isTimerBlocked) {
              this.schoolLoader = true;
              this.typingTimer = setTimeout(() => {
                  this.fetchSchools(inputValue || '');
              }, 1000);
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
