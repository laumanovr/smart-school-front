<template>
    <div class="video-instruction">
        <PreLoader v-if="isLoading"/>
        <div class="header-title">
            <h3>{{ headTitle }}</h3>
        </div>
        <div class="actions" v-if="role == 'superAdmin'">
            <v-select
                class="v-select-item"
                :items="roles"
                item-text="title"
                item-value="code"
                label="Фильтр по ролям"
                v-model="materialObj.roleCode"
                @change="filterVideoMaterials"
            />
            <v-btn color="primary" @click="openMaterialModal('create', {})">Добавить</v-btn>
        </div>

        <div class="video-material-content">
            <div class="material" v-for="material in videoMaterials" :key="material.id">
                <div class="frame">
                    <iframe
                        width="370" height="200"
                        :src="'https://www.youtube.com/embed/' + material.url + '?rel=0'"
                        frameborder="0" allowfullscreen>
                    </iframe>
                </div>
                <div class="title">{{ material.title }}</div>
                <div class="description">{{ material.description }}</div>
                <div class="buttons" v-if="role == 'superAdmin'">
                    <EditIcon @click="openMaterialModal('update', material)"/>
                    <DeleteIcon @click="deleteMaterial(material.id, true)"/>
                </div>
            </div>
        </div>

        <!--VIDEO MATERIAL MODAL-->
        <modal name="material-modal" height="auto">
            <div class="modal-container">
                <h4>{{mode == 'create' ? 'Добавить инструкцию' : 'Редактировать'}}</h4>
                <v-form ref="materialForm">
                    <v-text-field label="Заголовок" v-model="materialObj.title" :rules="required"/>
                    <v-text-field label="Описание" v-model="materialObj.description"/>
                    <v-text-field label="Ссылка на YouTube" v-model="materialObj.url" :rules="required"/>
                </v-form>
                <div class="btn-actions">
                    <v-btn color="red" @click="closeMaterialModal">Отмена</v-btn>
                    <v-btn color="green" @click="submit">Сохранить</v-btn>
                </div>
            </div>
        </modal>

        <!--DELETE MODAL-->
        <modal name="delete-modal" height="auto">
            <div class="modal-container">
                <h4>Удалить этот материал?</h4>
                <div class="btn-actions">
                    <v-btn color="primary" @click="closeDeleteModal">Отмена</v-btn>
                    <v-btn color="red" @click="deleteMaterial('', '')">Удалить</v-btn>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import PreLoader from '@/components/preloader/PreLoader';
    import VideoMaterialService from '@/_services/video-material.service';
    import EditIcon from '@/components/icons/EditIcon';
    import DeleteIcon from '@/components/icons/DeleteIcon';

    export default {
        components: {
            PreLoader,
            EditIcon,
            DeleteIcon
        },
        props: {
            headTitle: String,
            role: String,
        },
        data() {
            return {
                required: [v => !!v || this.$t('required')],
                isLoading: false,
                roles: [
                    {title: 'Админ школы', code: 'ROLE_ADMIN'},
                    {title: 'Учитель', code: 'ROLE_INSTRUCTOR'},
                    {title: 'Родитель', code: 'ROLE_PARENT'},
                    {title: 'Ученик', code: 'ROLE_STUDENT'},
                ],
                materialObj: {
                    title: '',
                    description: '',
                    url: '',
                    roleCode: ''
                },
                videoMaterials: [],
                mode: ''
            }
        },
        created() {
            this.materialObj.roleCode = this.role === 'superAdmin' ? this.roles[0].code : this.role;
            this.isLoading = true;
            this.filterVideoMaterials();
        },
        methods: {
            filterVideoMaterials() {
                this.isLoading = true;
                VideoMaterialService.getListByRole(this.materialObj.roleCode).then((res) => {
                    this.videoMaterials = res.reverse();
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },

            openMaterialModal(mode, material) {
                this.mode = mode;
                if (mode === 'create') {
                    this.materialObj.title = '';
                    this.materialObj.description = '';
                    this.materialObj.url = '';
                } else {
                    this.materialObj.title = material.title;
                    this.materialObj.description = material.description;
                    this.materialObj.url = material.url;
                    this.materialObj.roleCode = material.roleCode;
                    this.materialObj.id = material.id;
                }
                this.$modal.show('material-modal');
            },

            closeMaterialModal() {
                this.$modal.hide('material-modal');
            },

            submit() {
                if (this.$refs.materialForm.validate()) {
                    this.isLoading = true;
                    VideoMaterialService[this.mode](this.materialObj).then(() => {
                        this.$toast.success(this.mode === 'create' ? 'Успешно добавлено!' : 'Успешно обновлено!');
                        this.isLoading = false;
                        this.closeMaterialModal();
                        this.filterVideoMaterials();
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

            closeDeleteModal() {
                this.$modal.hide('delete-modal');
            },

            deleteMaterial(materialId, confirm) {
                if (confirm) {
                    this.materialObj.id = materialId;
                    this.$modal.show('delete-modal');
                } else {
                    this.isLoading = true;
                    VideoMaterialService.remove(this.materialObj.id).then(() => {
                        this.$toast.success('Успешно удалено!');
                        this.isLoading = false;
                        this.closeDeleteModal();
                        this.filterVideoMaterials();
                    }).catch((err) => {
                        this.$toast.error(err);
                        this.isLoading = false;
                    })
                }
            },

        }
    }
</script>

<style lang="scss">
    .video-instruction {
        margin: 30px 30px 60px;
        .header-title {
            margin-bottom: 35px;
        }
        .actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .video-material-content {
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
            margin-top: 20px;
            .material {
                width: 372px;
                text-align: center;
                margin-right: 20px;
                border: 1px solid #9E9E9E;
                border-radius: 5px;
                padding-bottom: 5px;
                .frame {
                    height: 200px;
                }
                .title, .description {
                    padding: 0 10px 5px;
                }
                .buttons {
                    border-top: 1px solid #9E9EA2;
                    padding-top: 7px;
                }
            }
        }
    }
</style>
