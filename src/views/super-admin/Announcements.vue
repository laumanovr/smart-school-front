<template>
    <div class="super-admin-announcements-container">
        <PreLoader v-if="isLoading"/>
        <SuperAdminSchoolHead>
            <template v-slot:title>Объявления</template>
            <template v-slot:center>
                <!--<SmartSearchInput></SmartSearchInput>-->
                <SmartButton @clicked="openAnnouncementModal('create', {})">
                    Добавить объявление <img src="../../assets/images/icons/add-user.svg" alt="">
                </SmartButton>
            </template>
        </SuperAdminSchoolHead>

        <div class="select-filter-block">
            <v-select
                class="v-select-item"
                label="Роль"
                :items="roles"
                item-value="code"
                item-text="title"
                v-model="announceObj.roleType"
                @change="fetchAnnouncements"
            />
        </div>

        <SmartTable
            :schools="announcements"
            :current-page="currentPage"
            :page-size="announcements.length"
            :total-elements="totalElements"
            :totalPages="totalPages"
            @leftClick="onPageChange('left')"
            @rightClick="onPageChange('right')"
        >
            <template v-slot:head>
                <th>Заголовок</th>
                <th>Описание</th>
                <th></th>
            </template>

            <template v-slot:body="{ item }">
                <td>{{ item.title }}</td>
                <td>{{ item.content }}</td>
                <td>
                    <img
                        src="../../assets/images/icons/pen.svg"
                        class="edit-icon"
                        @click="openAnnouncementModal('update', item)"
                    >
                    <TrashIcon @click="deleteItem(item, true)"/>
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
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                roles: [
                    {title: 'Админ школы', code: 'ADMIN'},
                ],
                announceObj: {
                    bySuperAdmin: true,
                    classId: '',
                    content: '',
                    roleType: '',
                    schoolId: '',
                    title: '',
                    userId: 0
                },
                mode: '',
                isLoading: false,
                announcements: [],
                totalPages: 1,
                totalElements: 0,
                currentPage: 1,
            }
        },
        computed: {
            userProfile() {
                return this.$store.state.account.profile
            },
        },
        created() {
            this.announceObj.userId = this.userProfile.user.id;
            this.announceObj.roleType = this.roles[0].code;
            this.fetchAnnouncements();
        },
        methods: {
            fetchAnnouncements(page = 0) {
                this.isLoading = true;
                this.announcements = [];
                AnnouncementService.getAllAnnouncementsByRole(this.announceObj.roleType, page).then((res) => {
                    if (res._embedded) {
                        this.announcements = res._embedded.announcementResourceList;
                        this.totalPages = res.page.totalPages;
                        this.totalElements = res.page.totalElements;
                        this.currentPage = res.page.number + 1;
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            openAnnouncementModal(mode, announce) {
                this.mode = mode;
                if (mode === 'create') {
                    this.announceObj.title = '';
                    this.announceObj.content = '';
                } else {
                    this.announceObj.title = announce.title;
                    this.announceObj.content = announce.content;
                    this.announceObj.userId = this.userProfile.user.id;
                    this.announceObj.id = announce.id;
                }
                this.$modal.show('announce-modal');
            },

            closeModal() {
                this.$modal.hide('announce-modal');
            },

            onPageChange(nav) {
                nav === 'left' ? this.currentPage -= 1 : this.currentPage += 1;
                this.fetchAnnouncements(this.currentPage - 1);
            },

            submitSave() {
                if (this.$refs.announceForm.validate()) {
                    this.isLoading = true;
                    AnnouncementService[this.mode](this.announceObj).then(() => {
                        this.isLoading = false;
                        this.$toast.success('Успешно!');
                        this.closeModal();
                        this.fetchAnnouncements(this.currentPage - 1);
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
    .super-admin-announcements-container {
        .select-filter-block {
            margin-left: 30px;
            .v-select {
                max-width: 150px;
            }
        }
        .edit-icon {
            cursor: pointer;
        }
    }
</style>
