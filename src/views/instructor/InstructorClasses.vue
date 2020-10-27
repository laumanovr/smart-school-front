<template>
    <div class="instructor-class-container">
        <PreLoader v-if="isLoading"/>
        <ClassSelectHeader :headTitle="'Мои Классы'" :showClass="false" />

        <div class="class-content" v-if="showData">
            <table class="table">
                <thead>
                    <tr>
                        <th class="light-purple">Класс</th>
                        <th>Классный Руководитель</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="klass in instrClasses" :key="klass.id">
                        <td class="light-purple">{{ klass.classLevel + '-' + klass.classLabel }}</td>
                        <td>{{ klass.personTitle }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import ClassSelectHeader from '@/components/instructor/ClassSelectHeader';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();
    import PreLoader from "@/components/preloader/PreLoader";

    export default {
        components: {
            ClassSelectHeader,
            PreLoader
        },
        data() {
            return {
                isLoading: false,
                showData: false,
                instrClasses: [],
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile
            }
        },

        async created() {
            this.isLoading = true;
            await this.fetchInstructorClasses();
        },

        methods: {
            fetchInstructorClasses() {
                instructorClassService.getByInstructorId(this.userProfile.personId).then((res) => {
                    if (res._embedded) {
                        this.instrClasses = res._embedded.instructorClassResourceList;
                        this.showData = true;
                    }
                    this.isLoading = false;
                }).catch(err => {
                    this.$toast.error(err);
                    this.isLoading = false;
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .instructor-class-container {
        margin: 30px;
        .class-content {
            background: #fff;
            margin-top: 22px;
        }
    }
</style>
