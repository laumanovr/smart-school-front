<template>
    <v-form @submit.prevent="submit" ref="form">
        <div class="form-head">
            <span>{{isEdit ? 'Редактировать' : 'Добавить администратора' }}</span>
            <img alt="" src="../../../assets/images/profile-icon.svg">
            <button class="profile-edit">
                <img src="../../../assets/images/icons/edit.svg">
            </button>
        </div>
        <div>
            <v-text-field :rules="required" label="Имя" v-model="schoolAdmin.name"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="required" label="Фамилия" v-model="schoolAdmin.surname"></v-text-field>
        </div>
        <div>
            <v-text-field label="Отчество" v-model="schoolAdmin.middleName"></v-text-field>
        </div>
        <div>
            <v-text-field
                label="ПИН/ИНН"
                v-model="schoolAdmin.pin"
                type="number"
                counter="14"
                :rules="required"
                @input="limitNumbers(schoolAdmin, 'pin', 14)"
            />
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
            <v-text-field label="Email" v-model="schoolAdmin.email"></v-text-field>
            <v-text-field label="Номер телефона" v-model="schoolAdmin.phone"></v-text-field>
        </div>
        <div>
            <v-text-field label="Адрес" v-model="schoolAdmin.address"></v-text-field>
        </div>
        <div>
            <v-select
                :items="schools"
                :rules="required"
                item-text="name"
                item-value="id"
                label="Школа"
                v-model="schoolAdmin.schoolId"
                @click="addScrollListenerSchoolSelect"
                @change="removeSchoolSelectScrollListener"
            ></v-select>
        </div>

        <div>
            <v-select
                :items="languages"
                :rules="required"
                item-text="name"
                item-value="id"
                label="Язык"
                v-model="schoolAdmin.languageId"
            ></v-select>
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
import { PersonService } from '@/_services/person.service';
import { SchoolService } from '@/_services/school.service';
import { LanguageService } from '@/_services/language.service';
import moment from 'moment';
import { RoleService } from '@/_services/role.service';
const roleService = new RoleService();
const languageService = new LanguageService();
const schoolService = new SchoolService();
const personService = new PersonService();
import MaskedInput from 'vue-masked-input';

export default {
  name: 'AddSchoolAdmin',
  components: {
      MaskedInput
  },
  props: {
    role: {
      type: String,
      default: 'ROLE_ADMIN'
    },
    selectedAdmin: Object
  },

  data: () => ({
    schoolAdmin: {
      enabled: true,
      dob: '',
      roles: [],
    },
    required: [
      v => !!v || 'поле обязательно для заполнения'
    ],
    menu2: false,
    schools: [],
    languages: [],
    roles: [],
    page: 0
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
  },

  methods: {
    limitNumbers: limitNumbers,

    addScrollListenerSchoolSelect() {
        this.$nextTick(() => {
            const schoolSelect = document.querySelector('.v-menu__content');
            schoolSelect.addEventListener('scroll', this.innerSelectScrollListener);
        })
    },

    innerSelectScrollListener() {
        const schoolSelect = document.querySelector('.v-menu__content');
        let almostEndOfScroll = (schoolSelect.scrollHeight - schoolSelect.clientHeight) - 100;
        if (schoolSelect.scrollTop >= almostEndOfScroll) {
            this.page++;
            this.fetchSchools();
        }
    },

    removeSchoolSelectScrollListener() {
        const schoolSelect = document.querySelector('.v-menu__content');
        if (schoolSelect) {
            schoolSelect.removeEventListener('scroll', this.innerSelectScrollListener);
        }
    },

    fetchSchools() {
        // TODO: need to get schools with region
        schoolService.listPageable(this.page).then((res) => {
            if (res._embedded) {
                res._embedded.schoolResourceList.forEach((school) => {
                    this.schools.push(school)
                });
            } else {
                this.removeSchoolSelectScrollListener();
            }
        }).catch(err => console.log(err))
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

    submit () {
      if (this.$refs.form.validate()) {
        this.schoolAdmin.roles = this.roles.filter(i => i.code === this.role).map(i => i.id);

        if (this.isEdit) {
            personService.edit(this.schoolAdmin).then(() => {
                this.$toast.success('Успешно обновлено!');
                this.$emit('close')
            }).catch((err) => {
                this.$toast.error(err);
            })
        } else {
            personService.create(this.schoolAdmin).then(() => {
                this.$toast.success('Успешно создано!');
                this.$emit('close')
            }).catch((err) => {
                this.$toast.error(err);
            })
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
