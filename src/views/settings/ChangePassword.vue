<template>
    <div class="change-password">
        <PreLoader v-if="isLoading"/>
        <h4>Смена пароля</h4>
        <v-form class="passw-form" ref="passwForm">
            <v-text-field
                class="new-pass"
                label="Новый пароль"
                placeholder="Введите новый пароль"
                v-model="user.password"
                type="password"
                :rules="required"
            />
            <v-text-field
                label="Повторите новый пароль"
                placeholder="Еще раз введите новый пароль"
                v-model="checkPassword"
                type="password"
                :rules="required"
            />
            <div class="btn-actions">
                <v-btn color="green" @click="submitPassword">Сохранить</v-btn>
            </div>
        </v-form>
    </div>
</template>

<script>
    import {RoleService} from '@/_services/role.service'
    const roleService = new RoleService();
    import {userService} from '@/_services/user.service';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                user: {
                    enabled: true,
                    languageId: 0,
                    name: '',
                    password: '',
                    roles: [],
                    surname: ''
                },
                checkPassword: '',
                allRoles: [],
                isLoading: false,
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools ? this.userProfile.schools[0] : '';
            }
        },
        created() {
            this.isLoading = true;
            this.fetchAllRoles();
            this.user.id = this.userProfile.user.id;
            this.user.name = this.userProfile.user.firstName;
            this.user.surname = this.userProfile.user.lastName;
            this.user.languageId = this.school ? this.school.languageId : '';
        },
        methods: {
            fetchAllRoles() {
                if (!this.allRoles.length) {
                    roleService.listPageable().then((res) => {
                        this.allRoles = res;
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            submitPassword() {
                if (this.$refs.passwForm.validate()) {
                    if (this.user.password !== this.checkPassword) {
                        this.$toast.error('Пароли не совпадают!');
                        return;
                    }
                    this.isLoading = true;
                    this.user.roles = this.allRoles.filter(i => i.code === this.userProfile.role[0].code).map(i => i.id);
                    userService.updateUser(this.user).then(() => {
                        this.$refs.passwForm.reset();
                        this.isLoading = false;
                        this.$toast.success('Успешно изменено!');
                    }).catch((err) => {
                        this.isLoading = false;
                        this.$toast.error(err);
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .change-password {
        background: #fff;
        max-width: 500px;
        margin: 0 auto;
        border: 1px solid #bdb7b7;
        padding: 15px 10px;
        border-radius: 4px;
        .new-pass {
            margin-bottom: 20px;
        }
    }
</style>
