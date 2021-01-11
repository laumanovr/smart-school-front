<template>
    <div class="instructor-chat">
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
                item-value="classId"
                :items="classes"
                v-model="selectedClassId"
                @change="showUsersByClass"
                v-if="selectedTab == 'student' || selectedTab == 'parent'"
            />
        </div>
        <Chat ref="chat"/>
    </div>
</template>

<script>
    import Chat from '@/components/chat/Chat';
    import {InstructorClassService} from '@/_services/instructor-class.service';
    const instructorClassService = new InstructorClassService();

    export default {
        components: {
            Chat
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile
            },
            school() {
                return this.userProfile.schools[0];
            }
        },
        data() {
            return {
                roles: [
                    {role: 'teacher', title: 'Учителя'},
                    {role: 'admin', title: 'Админ школы'},
                    {role: 'student', title: 'Ученики'},
                    {role: 'parent', title: 'Родители'},
                ],
                classes: [],
                selectedTab: '',
                selectedClassId: ''
            }
        },
        mounted() {
            this.getInstrClasses();
            this.showUsers('teacher');
        },
        methods: {
            showUsers(role) {
                this.selectedClassId = '';
                this.selectedTab = role;
                this.$refs.chat.users = [];
                this.$refs.chat.recipientUserId = '';
                if (role === 'teacher' || role === 'admin') {
                    this.$refs.chat.fetchUsers(this.selectedTab);
                }
            },

            showUsersByClass(classId) {
                this.$refs.chat.fetchUsers(this.selectedTab, classId);
            },

            getInstrClasses() {
                instructorClassService.getByInstructorId(this.userProfile.personId).then((res) => {
                    if (res._embedded) {
                        this.classes = res._embedded.instructorClassResourceList.map((klass) => {
                            klass.classTitle = klass.classLevel + klass.classLabel;
                            return klass;
                        });
                    }
                })
            }
        }
    }
</script>
