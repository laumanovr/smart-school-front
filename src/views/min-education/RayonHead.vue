<template>
    <div class="rayon-head-container">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>Районо</h3>
            <!--<v-btn color="primary" @click="openRayonHeadModal('add', '')">Добавить Районо</v-btn>-->
        </div>

        <div class="select-filter-block">
            <div class="select-clear-block">
                <v-select
                    :items="currentRegions"
                    item-text="title"
                    item-value="id"
                    v-model="filterRegionId"
                    label="Регион"
                    @change="fetchRayonsByRegion"
                />
            </div>
            <div class="select-clear-block">
                <v-select
                    :items="filteredRayons"
                    item-text="title"
                    item-value="id"
                    v-model="filterRayonId"
                    label="Район"
                    clearable
                />
            </div>
            <v-btn color="primary" @click="fetchAllRayonHeads">Фильтр</v-btn>
        </div>

        <SmartTable
            :schools="rayonHeads"
            :total-elements="rayonHeads.length"
            :totalPages="1"
            :page-size="rayonHeads.length"
            :current-page="1"
        >
            <template v-slot:head>
                <th>Ф.И.О</th>
                <th>Район</th>
                <th>Логин/Пароль</th>
                <th></th>
            </template>
            <template v-slot:body="{ item }">
                <td>{{ item.userLastName }} {{ item.userFirstName }}</td>
                <td>{{ item.rayonTitle }}</td>
                <td>{{ item.username }}</td>
                <td>
                    <!--<EditIcon @click="openRayonHeadModal('edit', item)"/>-->
                </td>
            </template>
        </SmartTable>

        <!--MODAL FOR CREATE EDIT RAYON-HEAD-->
        <modal name="rayon-head-modal" height="auto">
            <div class="modal-container">
                <h3 class="modal-title">{{mode == 'add' ? 'Добавить Районо' : 'Редактировать Районо'}}</h3>
                <v-form ref="form">
                    <v-text-field label="Имя" v-model="sendUserObj.name" :rules="required"/>
                    <v-text-field label="Фамилия" v-model="sendUserObj.surname" :rules="required"/>
                    <v-select
                        :items="currentRegions"
                        item-text="title"
                        item-value="id"
                        label="Регион"
                        v-model="regionId"
                        @change="fetchRayonsByRegion"
                    />
                    <v-select
                        :rules="required"
                        :items="filteredRayons"
                        item-text="title"
                        item-value="id"
                        label="Район"
                        v-model="sendRayonHeadObj.rayonId"
                    />
                </v-form>
                <div class="btn-actions">
                    <v-btn color="red" @click="closeRayHeadModal">Отмена</v-btn>
                    <v-btn color="green" @click="submit">Сохранить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import {userService} from '@/_services/user.service';
    import RayonHeadService from '@/_services/rayon-head.service';
    import {RoleService} from '@/_services/role.service';
    const roleService = new RoleService();
    import {RayonService} from '@/_services/rayon.service';
    const rayonService = new RayonService();
    import SmartTable from '@/components/table/SmartTable';
    import EditIcon from '@/components/icons/EditIcon';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            SmartTable,
            EditIcon,
            PreLoader
        },
        data() {
            return {
                required: [v => !!v || 'Обязательное поле'],
                sendUserObj: {
                    name: '',
                    surname: '',
                    roles: [],
                    enabled: true,
                    email: '',
                    username: '',
                    password: '',
                },
                sendRayonHeadObj: {
                    rank: '',
                    rayonId: '',
                    userId: 0
                },
                isLoading: false,
                mode: '',
                regionId: '',
                filterRayonId: '',
                filterRegionId: '',
                rayonHeads: [],
                allRoles: [],
                filteredRayons: []
            }
        },
        computed: {
            currentRegions() {
                return this.$store.state.location.regions;
            },
        },
        created() {
            this.fetchAllRayonHeads();
            this.fetchAllRoles();
        },
        methods: {
            fetchAllRayonHeads() {
                this.isLoading = true;
                RayonHeadService.getAllRayonHeads(this.filterRegionId, this.filterRayonId).then((res) => {
                    this.rayonHeads = res;
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            fetchAllRoles() {
                roleService.listPageable().then((res) => {
                    this.allRoles = res;
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            async openRayonHeadModal(mode, rayHead) {
                this.mode = mode;
                if (mode === 'add') {
                    this.sendUserObj.name = '';
                    this.sendUserObj.surname = '';
                    this.regionId = '';
                    this.sendRayonHeadObj.rayonId = '';
                } else {
                    await this.fetchRayonById(rayHead.rayonId);
                    this.sendUserObj.name = rayHead.userFirstName;
                    this.sendUserObj.surname = rayHead.userLastName;
                    this.sendUserObj.id = rayHead.userId;
                    this.sendRayonHeadObj.rayonId = rayHead.rayonId;
                    this.sendRayonHeadObj.id = rayHead.id;
                    this.sendRayonHeadObj.userId = rayHead.userId;
                }
                this.$modal.show('rayon-head-modal');
            },

            closeRayHeadModal() {
                this.$modal.hide('rayon-head-modal');
            },

            fetchRayonsByRegion(regionId) {
                rayonService.listByRegion(regionId).then((res) => {
                    this.filteredRayons = res;
                }).catch((err) => {
                    this.$toast.error(err);
                });
            },

            fetchRayonById(rayonId) {
                rayonService.getById(rayonId).then((res) => {
                    this.regionId = res.region.id;
                    this.fetchRayonsByRegion(this.regionId);
                }).catch((err) => {
                    this.$toast.error(err);
                })
            },

            submit() {
                if (this.$refs.form.validate()) {
                    this.isLoading = true;
                    this.sendUserObj.roles = this.allRoles.filter(i => i.code === 'ROLE_RAYON_HEADER').map(i => i.id);
                    if (this.mode === 'add') {
                        userService.registerUser(this.sendUserObj).then((res) => {
                            this.sendRayonHeadObj.userId = res.user.id;
                            RayonHeadService.createHeadRayon(this.sendRayonHeadObj).then(() => {
                                this.fetchAllRayonHeads();
                                this.$toast.success('Успешно создано!');
                                this.closeRayHeadModal();
                            }).catch((err) => {
                                this.$toast.error(err);
                                this.isLoading = false;
                            })
                        }).catch((err) => {
                            this.$toast.error(err);
                            this.isLoading = false;
                        })
                    } else {
                        userService.updateUser(this.sendUserObj).then(() => {
                            RayonHeadService.updateHeadRayon(this.sendRayonHeadObj).then(() => {
                                this.fetchAllRayonHeads();
                                this.$toast.success('Успешно обновлено!');
                                this.closeRayHeadModal();
                            }).catch((err) => {
                                this.$toast.error(err);
                                this.isLoading = false;
                            })
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

<style lang="scss" scoped>
    .rayon-head-container {
        margin: 35px 30px 40px;
        .header-title {
            display: flex;
            justify-content: space-between;
            margin: 15px 0 35px;
        }
        .modal-title {
            text-align: center;
            margin-bottom: 20px;
        }
    }
    .select-filter-block .v-select {
        max-width: 220px;
    }
</style>
