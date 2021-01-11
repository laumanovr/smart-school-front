<template>
    <div class="school-admin-chat">
        <div class="select-chat-users">
            <v-select
                class="v-select-item"
                item-text="title"
                item-value="role"
                :items="roles"
                v-model="selectedTab"
                @change="showUsers"
            />
            <v-select
                class="v-select-item"
                item-text="classTitle"
                item-value="id"
                :items="classes"
                v-model="selectedClassId"
                @change="showUsersByClass"
                v-if="selectedTab != 'teacher'"
            />
        </div>
        <Chat ref="chat"/>
    </div>
</template>

<script>
    import Chat from '@/components/chat/Chat';
    import SchoolClassService from '@/_services/school-class.service';

    export default {
        components: {
            Chat,
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        data() {
            return {
                roles: [
                    {role: 'teacher', title: 'Учителя'},
                    {role: 'student', title: 'Ученики'},
                    {role: 'parent', title: 'Родители'},
                ],
                classes: [],
                selectedTab: '',
                selectedClassId: ''
            }
        },
        mounted() {
            this.getSchoolClasses();
            this.showUsers('teacher');
        },
        methods: {
            showUsers(role) {
                this.selectedTab = role;
                this.selectedClassId = '';
                this.$refs.chat.selectedRole = role;
                this.$refs.chat.recipientUserId = '';
                this.$refs.chat.users = [];
                this.$refs.chat.messages = [];
                this.$refs.chat.allReserveUsers = [];
                if (role === 'teacher') {
                    this.$refs.chat.fetchUsers(this.selectedTab);
                }
            },

            showUsersByClass(classId) {
                this.$refs.chat.fetchUsers(this.selectedTab, classId);
            },

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
        }
    }
</script>

<style lang="scss">

</style>
