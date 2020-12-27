<template>
    <div class="director-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Директор</h3>
            <!--<v-btn color="primary" @click="toggleDirectorModal('create', '')">Добавить Директора</v-btn>-->
        </div>

        <SmartTable
            :schools="directorList"
            :total-elements="directorList.length"
            :totalPages="1"
            :page-size="directorList.length"
            :current-page="1"
        >
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Школа</th>
                <th>Логин</th>
                <th></th>
            </template>
            <template v-slot:body="{ item }">
                <td>{{ item.lastName }} {{ item.firstName }} {{item.middleName ? item.middleName : ''}}</td>
                <td>{{ item.schoolTitle }}</td>
                <td>{{ item.username }}</td>
                <td>
                    <!--<EditIcon @click="toggleDirectorModal('edit', item)"/>-->
                </td>
            </template>
        </SmartTable>

        <!--DIRECTOR MODAL-->
        <modal name="director-modal" height="80%">
            <div class="modal-container">
                <v-form ref="form">
                    <h4>{{mode == 'create' ? 'Добавить Директора' : 'Редактировать Директора'}}</h4>
                    <div>
                        <v-text-field :rules="firstLastNameRule" label="Имя" v-model="sendPerson.name"/>
                    </div>
                    <div>
                        <v-text-field :rules="firstLastNameRule" label="Фамилия" v-model="sendPerson.surname"/>
                    </div>
                    <div>
                        <v-text-field :rules="middleNameRule" label="Отчество" v-model="sendPerson.middleName"/>
                    </div>
                    <div>
                        <v-text-field
                            label="ПИН/ИНН"
                            v-model="sendPerson.pin"
                            type="number"
                            counter="14"
                            :rules="required"
                            @input="limitNumbers(sendPerson, 'pin', 14)"
                        />
                    </div>
                    <div>
                        <v-radio-group :mandatory="false" :rules="required" row v-model="sendPerson.gender">
                            <v-radio label="Мужчина" value="MALE"></v-radio>
                            <v-radio label="Женщина" value="FEMALE"></v-radio>
                        </v-radio-group>
                    </div>
                    <div class="input-mask date">
                        <label>Дата рождения</label>
                        <masked-input v-model="sendPerson.dob" mask="11.11.1111" placeholder="ДД.ММ.ГГГГ"/>
                    </div>
                    <div class="spacer">
                        <v-text-field label="Email" v-model="sendPerson.email" :rules="emailRule"/>
                        <v-text-field label="Номер телефона" v-model="sendPerson.phone" type="number"/>
                    </div>
                    <div>
                        <v-autocomplete
                            :items="schools"
                            item-text="name"
                            item-value="id"
                            label="Школа"
                            v-model="sendPerson.schoolId"
                            clearable
                            hide-no-data
                            :loading="isSchoolSearching"
                            :search-input.sync="searchSchool"
                            @change="onSelectSchool"
                            :rules="required"
                        />
                    </div>
                    <div class="btn-actions">
                        <v-btn color="red" @click="toggleDirectorModal">Отмена</v-btn>
                        <v-btn color="green" @click="saveDirector">Сохранить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>
    </div>
</template>

<script>
    import {limitNumbers} from '@/utils/limit-numbers';
    import {RoleService} from '@/_services/role.service';
    const roleService = new RoleService();
    import SmartTable from '@/components/table/SmartTable';
    import EditIcon from '@/components/icons/EditIcon';
    import PreLoader from '@/components/preloader/PreLoader';
    import MaskedInput from 'vue-masked-input';
    import {SchoolService} from '@/_services/school.service';
    const schoolService = new SchoolService();
    import {PersonService} from '@/_services/person.service';
    const personService = new PersonService();

    export default {
        components: {
            SmartTable,
            EditIcon,
            PreLoader,
            MaskedInput,
        },
        data() {
            return {
                emailRule: [
                    v => !!v || 'Email обязательный',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email должен быть валидным'
                ],
                firstLastNameRule: [v => !!v || 'Обязательное поле', v => !/\d/.test(v) || 'Должно быть без цифр'],
                middleNameRule: [v => !/\d/.test(v) || 'Должно быть без цифр'],
                required: [v => !!v || 'Обязательное поле'],
                isLoading: false,
                isSchoolSearching: false,
                typingTimer: null,
                isTimerBlock: false,
                mode: '',
                searchSchool: '',
                sendPerson: {
                    enabled: true,
                    name: '',
                    surname: '',
                    middleName: '',
                    pin: '',
                    phone: '',
                    email: '',
                    dob: '',
                    gender: '',
                    roles: [],
                    schoolId: 0
                },
                allRoles: [],
                schools: [],
                directorList: []
            }
        },
        created() {
            this.fetchAllDirectors();
            this.fetchAllSchools();
            this.fetchAllRoles();
        },
        methods: {
            limitNumbers: limitNumbers,

            fetchAllDirectors() {
                this.isLoading = true;
                personService.listPersonByRole('ROLE_DIRECTOR').then((res) => {
                    this.directorList = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchAllSchools(searchValue = '') {
                schoolService.listPageable(0, '', '', searchValue).then((res) => {
                    if (res._embedded) {
                        this.schools = res._embedded.schoolResourceList;
                    }
                    this.isSchoolSearching = false;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            getSchoolById(schoolId) {
                schoolService.getById(schoolId).then((res) => {
                    this.schools.push(res);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchAllRoles() {
                roleService.listPageable().then((res) => {
                    this.allRoles = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            toggleDirectorModal(mode, director) {
                this.mode = mode;
                if (mode === 'create') {
                    this.sendPerson.surname = '';
                    this.sendPerson.name = '';
                    this.sendPerson.middleName = '';
                    this.sendPerson.pin = '';
                    this.sendPerson.phone = '';
                    this.sendPerson.gender = '';
                    this.sendPerson.dob = '';
                    this.sendPerson.email = '';
                    this.sendPerson.schoolId = '';
                } else {
                    this.isLoading = true;
                    personService.getById(director.id).then((res) => {
                        this.getSchoolById(res.schools[0]);
                        this.sendPerson.id = director.id;
                        this.sendPerson.surname = res.lastName;
                        this.sendPerson.name = res.firstName;
                        this.sendPerson.middleName = res.middleName;
                        this.sendPerson.pin = res.pin;
                        this.sendPerson.phone = res.phone ? res.phone.replace('+','') : '';
                        this.sendPerson.gender = res.gender;
                        this.sendPerson.dob = res.dateOfBirth;
                        this.sendPerson.email = res.email;
                        this.sendPerson.schoolId = res.schools[0];
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
                this.$modal.toggle('director-modal');
            },

            saveDirector() {
                if (this.$refs.form.validate()) {
                    if (!this.sendPerson.dob) {
                        return;
                    }
                    this.isLoading = true;
                    this.sendPerson.roles = this.allRoles.filter(i => i.code === 'ROLE_DIRECTOR').map(i => i.id);
                    personService[this.mode](this.sendPerson).then(() => {
                        this.$modal.toggle('director-modal');
                        this.$toast.success(this.mode === 'create' ? 'Успешно создано!' : 'Успешно обновлено!');
                        this.fetchAllDirectors();
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    });
                }
            },

            onSelectSchool() {
                this.isTimerBlock = true;
                setTimeout(() => {
                    this.isTimerBlock = false;
                }, 2000);
            },
        },

        watch: {
            searchSchool(inputValue) {
                clearTimeout(this.typingTimer);
                this.typingTimer = null;
                if (!this.isTimerBlock) {
                    this.isSchoolSearching = true;
                    this.typingTimer = setTimeout(() => {
                        this.fetchAllSchools(inputValue);
                    }, 1000);
                }
            }
        }

    }
</script>

<style lang="scss">
    .director-container {
        margin: 35px 30px 40px;
        .header-title {
            display: flex;
            justify-content: space-between;
            margin: 15px 0 35px;
        }
        .modal-container {
            height: 100%;
            overflow-y: auto;
            .empty {
            }
        }
    }
</style>
