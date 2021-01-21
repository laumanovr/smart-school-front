<template>
    <div class="change-profile">
        <PreLoader v-if="isLoading"/>
        <h4>Данные профиля</h4>
        <v-form class="profile-form" ref="profileForm" v-if="isSuperAdminOrRayonHead">
            <v-text-field
                class="name"
                label="Имя"
                v-model="user.name"
                :rules="required"
            />
            <v-text-field
                label="Фамилия"
                v-model="user.surname"
                :rules="required"
            />
            <div class="btn-actions">
                <v-btn color="green" @click="submitProfile">Сохранить</v-btn>
            </div>
        </v-form>

        <!--PERSON PROFILE-->
        <v-form class="profile-form" ref="profileForm" v-if="!isSuperAdminOrRayonHead">
            <v-text-field
                class="name"
                label="Имя"
                v-model="person.name"
                :rules="required"
            />
            <v-text-field
                label="Фамилия"
                v-model="person.surname"
                :rules="required"
            />
            <v-text-field
                label="Отчество"
                v-model="person.middleName"
                :rules="required"
            />
            <div class="input-mask">
                <label>Телефон</label>
                <masked-input
                    v-model="person.phone"
                    mask="\+\996 (111) 111111"
                    placeholder="Телефон"
                    @input="phoneRawVal = arguments[1]"
                />
            </div>
            <div class="btn-actions">
                <v-btn color="green" @click="submitProfile">Сохранить</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script>
    import {RoleService} from '@/_services/role.service'
    const roleService = new RoleService();
    import {userService} from '@/_services/user.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import {PersonService} from '@/_services/person.service';
    const personService = new PersonService();
    import MaskedInput from 'vue-masked-input';

    export default {
        components: {
            PreLoader,
            MaskedInput
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                user: {
                    enabled: true,
                    languageId: 0,
                    name: '',
                    roles: [],
                    surname: ''
                },
                person: {
                    enabled: true,
                    id: 0,
                    name: '',
                    surname: '',
                    middleName: '',
                    phone: '',
                    dob: '',
                    gender: '',
                    languageId: 0,
                    roles: [],
                    schoolId: 0
                },
                allRoles: [],
                isLoading: false,
                phoneRawVal: ''
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools ? this.userProfile.schools[0] : '';
            },
            isSuperAdminOrRayonHead() {
                const role = this.userProfile.role[0].code;
                return role === 'ROLE_SUPER_ADMIN' || role === 'ROLE_RAYON_HEADER';
            }
        },
        created() {
            this.isLoading = true;
            this.fetchAllRoles();
            this.checkUserRole();
        },
        methods: {
            checkUserRole() {
                if (this.isSuperAdminOrRayonHead) {
                    this.user.id = this.userProfile.user.id;
                    this.user.name = this.userProfile.user.firstName;
                    this.user.surname = this.userProfile.user.lastName;
                    this.user.languageId = this.school ? this.school.languageId : '';
                    this.isLoading = false;
                } else {
                    personService.getById(this.userProfile.personId).then((res) => {
                        this.person.id = res.id;
                        this.person.name = res.firstName;
                        this.person.surname = res.lastName;
                        this.person.middleName = res.middleName;
                        this.person.phone = res.phone ? res.phone.replace('+','') : '';
                        this.person.dob = res.dateOfBirth;
                        this.person.gender = res.gender;
                        this.person.schoolId = this.school.id;
                        this.person.languageId = this.school.languageId;
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            fetchAllRoles() {
                roleService.listPageable().then((res) => {
                    this.allRoles = res;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            submitProfile() {
                if (this.$refs.profileForm.validate()) {
                    this.isLoading = true;
                    const role = this.allRoles.filter(i => i.code === this.userProfile.role[0].code).map(i => i.id);
                    if (this.isSuperAdminOrRayonHead) {
                        this.user.roles = role;
                        userService.updateUser(this.user).then(() => {
                            this.userProfile.user.firstName = this.user.name;
                            this.userProfile.user.lastName = this.user.surname;
                            this.$store.dispatch('account/updateProfileData', this.userProfile);
                            this.isLoading = false;
                            this.$toast.success('Успешно изменено!');
                        }).catch((err) => {
                            this.$toast.error(err);
                            this.isLoading = false;
                        })
                    } else {
                        this.person.roles = role;
                        this.person.phone = this.phoneRawVal.replaceAll('_','');
                        personService.edit(this.person).then(() => {
                            this.userProfile.user.firstName = this.person.name;
                            this.userProfile.user.lastName = this.person.surname;
                            this.$store.dispatch('account/updateProfileData', this.userProfile);
                            this.isLoading = false;
                            this.$toast.success('Успешно изменено!');
                        }).catch((err) => {
                            this.$toast.error(err);
                            this.isLoading = false;
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .change-profile {
        background: #fff;
        max-width: 500px;
        margin: 0 auto;
        border: 1px solid #bdb7b7;
        padding: 15px 10px;
        border-radius: 4px;
        .name {
            margin-bottom: 20px;
        }
    }
</style>
