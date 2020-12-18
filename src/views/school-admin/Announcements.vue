<template>
    <div class="announcements-container">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Объявления</template>
            <template v-slot:center>
                <!--<SmartSearchInput></SmartSearchInput>-->
                <SmartButton @clicked="openAnnouncementModal('create', {})" v-show="messageType == 'sent'">
                    Добавить объявление <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
            </template>
        </SuperAdminSchoolHead>

        <div class="select-filter-block">
            <v-select
                class="v-select-item"
                label="Тип"
                :items="types"
                item-value="type"
                item-text="title"
                v-model="messageType"
                @change="fetchAdminAnnouncements"
            />
            <template v-if="messageType == 'sent'">
                <v-select
                    class="v-select-item"
                    label="Роль"
                    :items="roles"
                    item-value="code"
                    item-text="title"
                    v-model="announceObj.roleType"
                    @change="changeRole"
                />
                <v-select
                    label="Класс"
                    :items="classes"
                    item-text="classTitle"
                    item-value="id"
                    v-model="announceObj.classId"
                    v-show="announceObj.roleType == 'STUDENT' || announceObj.roleType == 'PARENT'"
                    @change="fetchAnnouncements"
                />
            </template>
        </div>

        <SmartTable
            :schools="announcements"
            :current-page="1"
            :page-size="announcements.length"
            :total-elements="announcements.length"
            :totalPages="1"
        >
            <template v-slot:head>
                <th>Заголовок</th>
                <th>Описание</th>
                <th>Автор</th>
                <th></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.title }}</td>
                <td>{{ item.content }}</td>
                <td>{{ item.bySuperAdmin ? 'Супер-админ' : item.userTitle }}</td>
                <td>
                    <template v-if="messageType == 'sent' && userProfile.user.id === item.userId">
                        <img
                            src="../../assets/images/icons/pen.svg"
                            class="edit-icon"
                            @click="openAnnouncementModal('update', item)"
                        >
                        <TrashIcon @click="deleteItem(item, true)"/>
                    </template>
                </td>
            </template>
        </SmartTable>

        <!--ANNOUNCEMENT MODAL-->
        <modal name="announce-modal" height="auto">
            <div class="modal-container">
                <h4>{{ mode == 'create' ? 'Добавить объявление' : 'Редактировать' }}</h4>
                <v-form ref="announceForm">
                    <v-text-field :rules="required" label="Заголовок" v-model="announceObj.title"/>
                    <v-text-field :rules="required" label="Описание" v-model="announceObj.content"/>
                    <div class="btn-actions">
                        <v-btn color="red" @click="closeModal">Отмена</v-btn>
                        <v-btn color="green" @click="submitSave">Сохранить</v-btn>
                    </div>
                </v-form>
            </div>
        </modal>

        <!--DELETE MODAL-->
        <modal name="delete-modal" width="500" height="165">
            <div class="modal-container">
                <h4>Удалить?</h4>
                <div class="btn-actions">
                    <v-btn color="primary" @click="toggleDeleteModal">Отмена</v-btn>
                    <v-btn color="red" @click="deleteItem('','')">Удалить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import SuperAdminSchoolHead from '@/components/super-admin/schools/SuperAdminSchoolHead';
    import SmartTable from '@/components/table/SmartTable';
    import SmartButton from '@/components/button/SmartButton';
    import SmartSearchInput from '@/components/input/SmartSearchInput';
    import SmartBtn2 from '@/components/button/SmartBtn2';
    import SmartSelect from '@/components/select/SmartSelect';
    import SchoolClassService from '@/_services/school-class.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import AnnouncementService from '@/_services/announcement.service';
    import TrashIcon from '@/components/icons/TrashIcon';

    export default {
        components: {
            SmartSelect,
            SmartBtn2,
            SmartSearchInput,
            SmartButton,
            SuperAdminSchoolHead,
            SmartTable,
            PreLoader,
            TrashIcon
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                types: [
                    {title: 'Исходящие', type: 'sent'},
                    {title: 'Входящие', type: 'inbox'},
                ],
                roles: [
                    {title: 'Учитель', code: 'INSTRUCTOR'},
                    {title: 'Ученик', code: 'STUDENT'},
                    {title: 'Родитель', code: 'PARENT'},
                ],
                announceObj: {
                    bySuperAdmin: false,
                    classId: '',
                    content: '',
                    roleType: '',
                    schoolId: 0,
                    title: '',
                    userId: 0
                },
                messageType: '',
                mode: '',
                isLoading: false,
                classes: [],
                announcements: []
            }
        },
        created() {
            this.isLoading = true;
            this.announceObj.schoolId = this.school.id;
            this.announceObj.userId = this.userProfile.user.id;
            this.announceObj.roleType = this.roles[0].code;
            this.messageType = 'inbox';
            this.getSchoolClasses();
            this.fetchAdminAnnouncements(this.messageType);
        },
        methods: {
            getSchoolClasses() {
                SchoolClassService.getAllBySchool(this.school.id).then((res) => {
                    this.classes = res.map((klass) => {
                        klass.classTitle = klass.classLevel + klass.classLabel;
                        return klass;
                    });
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            fetchAnnouncements() {
                this.isLoading = true;
                AnnouncementService.getSchoolAnnouncements(
                    this.school.id,
                    this.announceObj.roleType,
                    this.announceObj.classId
                ).then((res) => {
                    console.log(res);
                    this.announcements = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchAdminAnnouncements(type) {
                this.announcements = [];
                if (type === 'inbox') {
                    this.isLoading = true;
                    this.announceObj.roleType = '';
                    AnnouncementService.getAllAnnouncementsByRole('ADMIN').then((res) => {
                        if (res._embedded) {
                            this.announcements = res._embedded.announcementResourceList;
                        }
                        this.isLoading = false;
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            changeRole() {
                this.announceObj.classId = '';
                if (this.announceObj.roleType === 'INSTRUCTOR') {
                    this.fetchAnnouncements();
                }
            },

            openAnnouncementModal(mode, announce) {
                if (mode === 'create' && this.announceObj.roleType !== 'INSTRUCTOR' && !this.announceObj.classId) {
                    this.$toast.info('Выберите класс!');
                    return;
                }
                this.mode = mode;
                if (mode === 'create') {
                    this.announceObj.title = '';
                    this.announceObj.content = '';
                } else {
                    this.announceObj.title = announce.title;
                    this.announceObj.content = announce.content;
                    this.announceObj.userId = announce.userId;
                    this.announceObj.id = announce.id;
                }
                this.$modal.show('announce-modal');
            },

            closeModal() {
                this.$modal.hide('announce-modal');
            },

            submitSave() {
                if (this.$refs.announceForm.validate()) {
                    this.isLoading = true;
                    AnnouncementService[this.mode](this.announceObj).then(() => {
                        this.isLoading = false;
                        this.$toast.success('Успешно!');
                        this.closeModal();
                        this.fetchAnnouncements();
                    }).catch((err) => {
                        this.isLoading = false;
                        this.$toast.error(err);
                    })
                }
            },

            deleteItem(announce, confirm) {
                if (confirm) {
                    this.announceObj.id = announce.id;
                    this.toggleDeleteModal();
                } else {
                    this.isLoading = true;
                    AnnouncementService.remove(this.announceObj.id).then(() => {
                        this.toggleDeleteModal();
                        this.$toast.success('Успешно удалено!');
                        this.fetchAnnouncements();
                    }).catch((err) => {
                        this.isLoading = false;
                        this.$toast.error(err);
                    })
                }
            },

            toggleDeleteModal() {
                this.$modal.toggle('delete-modal');
            }
        }
    }
</script>

<style lang="scss">
    .announcements-container {
        .select-filter-block {
            margin-left: 30px;
            .v-select {
                max-width: 150px;
            }
        }
        .edit-icon {
            cursor: pointer;
        }
        .delete-icon {
            margin-left: 5px;
        }
    }
</style>
