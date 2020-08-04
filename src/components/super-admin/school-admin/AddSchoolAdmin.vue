<template>
    <v-form @submit.prevent="submit" ref="form">
        <div class="form-head">
            <span>Add School Admin</span>
            <img alt="" src="../../../assets/images/profile-icon.svg">
            <button class="profile-edit">
                <img src="../../../assets/images/icons/edit.svg">
            </button>
        </div>
        <div>
            <v-text-field :rules="required" label="Name" v-model="schoolAdmin.name"></v-text-field>
        </div>
        <div>
            <v-text-field :rules="required" label="Surname" v-model="schoolAdmin.surname"></v-text-field>
        </div>
        <div>
            <v-text-field label="Middle Name" v-model="schoolAdmin.middleName"></v-text-field>
        </div>
        <div>
            <v-radio-group :mandatory="false" :rules="required" row v-model="schoolAdmin.gender">
                <v-radio label="Male" value="MALE"></v-radio>
                <v-radio label="Female" value="FEMALE"></v-radio>
            </v-radio-group>
            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                min-width="290px"
                offset-y
                transition="scale-transition"
                v-model="menu2"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        label="Birthday"
                        readonly
                        v-bind="attrs"
                        v-model="birthday"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker @input="menu2 = false" v-model="birthday"></v-date-picker>
            </v-menu>
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
                label="Schools"
                v-model="schoolAdmin.schoolId"
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
            <v-btn color="primary" type="submit">Сохранить</v-btn>
            <v-btn>Отменить</v-btn>
        </div>
    </v-form>
</template>

<script>
import { PersonService } from '@/_services/person.service'
import { SchoolService } from '@/_services/school.service'
import { LanguageService } from '@/_services/language.service'
import moment from 'moment'
import { RoleService } from '@/_services/role.service'

const roleService = new RoleService()
const languageService = new LanguageService()
const schoolService = new SchoolService()
const personService = new PersonService()

export default {
  name: 'AddSchoolAdmin',
  props: {
    role: {
      type: String,
      default: 'ROLE_ADMIN'
    }
  },
  data: () => ({
    schoolAdmin: {
      enabled: true,
      roles: []
    },
    birthday: '1970-2-11',
    required: [
      v => !!v || 'Input is required'
    ],
    menu2: false,
    schools: [],
    languages: [],
    roles: []
  }),
  mounted () {
    this.fetchSchools()
    this.fetchLanguages()
    this.fetchRoles()
  },
  methods: {
    fetchSchools () {
      // TODO: need to get schools with region
      schoolService.listPageable(0).then(res => {
        if (res._embedded) {
          this.schools = res._embedded.schoolResourceList
        } else this.schools = []
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
        this.schoolAdmin.roles = this.roles.filter(i => i.code === this.role).map(i => i.id)
        this.schoolAdmin.dob = moment(this.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY')
        personService.create(this.schoolAdmin).then(res => {
          this.$toast.success('Successfully created!')
          this.$emit('close')
        }).catch(err => console.log(err))
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

    > div {
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
