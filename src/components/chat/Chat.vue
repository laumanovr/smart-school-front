<template>
    <div class="chat-container">
        <PreLoader v-if="isLoading"/>
        <h3 class="text-center">Сообщения</h3>
        <div class="messaging">
            <div class="inbox_msg">
                <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="recent_heading">
                            <h4>Список</h4>
                        </div>
                        <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input
                                    class="search-bar"
                                    placeholder="Поиск"
                                    v-model="searchQuery"
                                    @keyup.enter="searchUser"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="inbox_chat">
                        <div class="chat_list"
                             v-for="user in users"
                             :key="user.id"
                             :class="{'active_chat': recipientUserId == user.userId}"
                             @click="onSelectUser(user)"
                        >
                            <div class="chat_people">
                                <div class="chat_img"><img src="@/assets/images/icons/profile-icon.svg"></div>
                                <div class="chat_ib">
                                    <h5>{{ user.fullName }} <span class="chat_date">...</span></h5>
                                    <p>...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mesgs">
                    <div class="msg_history" ref="msgHistory">
                        <template v-for="message in messages">
                            <div class="outgoing_msg" v-if="message.authorId == userProfile.user.id">
                                <div class="sent_msg">
                                    <p>{{ message.contents }}</p>
                                    <span class="time_date">{{ message.sentDateTime }}</span>
                                </div>
                            </div>
                            <div class="incoming_msg" v-else>
                                <div class="received_msg">
                                    <div class="received_withd_msg">
                                        <p>{{ message.contents }}</p>
                                        <span class="time_date">{{ message.sentDateTime }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="type_msg">
                        <div class="input_msg_write" v-if="recipientUserId">
                            <input
                                type="text"
                                v-model="inputValue"
                                @keyup.enter="sendMessage"
                                class="write_msg"
                                placeholder="Написать сообщение"
                            />
                            <button class="msg_send_btn" type="button" @click.prevent="sendMessage">
                                <img src="@/assets/images/icons/send-icon.svg">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import WebSocketService from '@/_services/websocket.service';
    import PreLoader from '@/components/preloader/PreLoader';
    import InstructorService from '@/_services/instructor.service';
    import {StudentService} from '@/_services/student.service';
    const studentService = new StudentService();
    import {PersonService} from '@/_services/person.service';
    const personService = new PersonService();
    import {StudentParentService} from '@/_services/student-parent.service';
    const studentParentService = new StudentParentService();

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                userObj: {
                    teacher: 'fetchSchoolTeachers',
                    student: 'fetchSchoolStudents',
                    admin: 'fetchSchoolAdmin',
                    parent: 'fetchSchoolParents'
                },
                recipientUserId: '',
                inputValue: '',
                messages: [],
                users: [],
                allReserveUsers: [],
                searchQuery: '',
                selectedRole: '',
                isLoading: false
            }
        },
        computed: {
            userProfile () {
                return this.$store.state.account.profile;
            },
            school() {
                return this.userProfile.schools ? this.userProfile.schools[0] : '';
            }
        },
        mounted() {
            this.onEventHistoryMessages();
            this.onEventNewMessage();
            this.onEventError();
        },
        beforeDestroy() {
            WebSocketService.disconnectSocket();
        },
        methods: {
            fetchUsers(role, classId) {
                this.searchQuery = '';
                this.isLoading = true;
                this.selectedRole = role;
                this[this.userObj[role]](classId);
            },

            fetchSchoolAdmin() {
                personService.listSchoolAdmins('','', this.school ? this.school.id : '').then((res) => {
                    this.users = res.map((admin) => {
                        admin.fullName = admin.surname+' '+admin.name;
                        return admin;
                    });
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            fetchSchoolTeachers() {
                this.users = [];
                InstructorService.list(0, this.school.id, '', '', this.searchQuery).then((res) => {
                    if (res._embedded) {
                        this.users = res._embedded.instructorResourceList.map((teacher) => {
                            teacher.fullName = teacher.lastName+' '+teacher.firstName;
                            return teacher;
                        }).filter((teacher) => teacher.userId !== this.userProfile.user.id);
                    }
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            fetchSchoolStudents(classId) {
                studentService.getByClass(classId).then((res) => {
                    this.users = res.map((student) => {
                        student.fullName = student.surname+' '+student.name;
                        return student;
                    });
                    this.allReserveUsers = JSON.parse(JSON.stringify(this.users));
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            fetchSchoolParents(classId) {
                studentParentService.getStudentParentList(this.school.id, classId).then((res) => {
                    this.users = res.map((parent) => {
                        parent.fullName = parent.parentTitle;
                        return parent;
                    });
                    this.allReserveUsers = JSON.parse(JSON.stringify(this.users));
                    this.isLoading = false;
                }).catch((err) => {
                    this.$toast.error(err);
                    this.isLoading = false;
                });
            },

            searchUser() {
                if (this.selectedRole === 'teacher') {
                    this.isLoading = true;
                    this.fetchSchoolTeachers();
                } else if (this.selectedRole === 'student' || this.selectedRole === 'parent') {
                    this.users = this.allReserveUsers.filter((user) => user.fullName.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()));
                }
            },

            onSelectUser(selectedUser) {
                this.messages = [];
                this.recipientUserId = selectedUser.userId;
                this.openSocketConnection(this.recipientUserId);
            },

            openSocketConnection(recipientUserId) {
                const usersChannel = {userIdOne: this.userProfile.user.id, userIdTwo: recipientUserId};
                WebSocketService.initChannelConnection(usersChannel);
            },

            sendMessage() {
                this.inputValue = this.inputValue.trim();
                if (this.inputValue.length) {
                    const messageObj = {
                        authorId: this.userProfile.user.id,
                        recipientId: this.recipientUserId,
                        contents: this.inputValue
                    };
                    WebSocketService.sendMsgData(JSON.stringify(messageObj));
                    this.inputValue = '';
                }
            },

            getCurrentTime() {
                return moment().format('hh:mm');
            },

            scrollToBottom() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        if (this.$refs.msgHistory) {
                            this.$refs.msgHistory.scrollTop = this.$refs.msgHistory.scrollHeight;
                        }
                    });
                });
            },

            playSound() {
                const sound = new Audio(require("@/assets/notify-sound.mp3"));
                sound.play();
            },

            onEventHistoryMessages() {
                WebSocketService.eventEmitter.on('oldMessages', (res) => {
                    this.messages = res.messages.reverse().map((msg) => {
                        msg.sentDateTime = msg.sentDate;
                        return msg;
                    });
                    this.scrollToBottom();
                });
            },

            onEventNewMessage() {
                WebSocketService.eventEmitter.on('newMessage', (res) => {
                    const message = JSON.parse(res.message.body);
                    message.sentDateTime = this.getCurrentTime();
                    this.messages.push(message);
                    this.scrollToBottom();
                    this.playSound();
                });
            },

            onEventError() {
                WebSocketService.eventEmitter.on('onError', (err) => {
                    this.$toast.error(err);
                });
            },
        }
    }
</script>

<style lang="scss">
    .chat-container {
        max-width: 1130px;
        margin: 20px auto 0;
    }

    img {
        max-width: 100%;
    }

    .inbox_people {
        background: #fbfbfb none repeat scroll 0 0;
        overflow: hidden;
        width: 40%;
        border-right: 1px solid #c4c4c4;
    }

    .inbox_msg {
        border: 2px solid #969696;
        border-radius: 4px;
        clear: both;
        overflow: hidden;
        display: flex;
    }

    .top_spac {
        margin: 20px 0 0;
    }

    .recent_heading {
        width: 35%;
    }

    .srch_bar {
        display: inline-block;
        text-align: right;
        width: 65%;
    }

    .headind_srch {
        padding: 10px 15px 10px 15px;
        overflow: hidden;
        border-bottom: 1px solid #c4c4c4;
        display: flex;
        align-items: center;
    }

    .recent_heading h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;
    }

    .srch_bar input {
        border-bottom: 1px solid #cdcdcd;
        width: 100%;
        padding: 2px 0 4px 6px;
        background: none;
        outline: none;
    }

    .srch_bar .input-group-addon button {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        padding: 0;
        color: #707070;
        font-size: 18px;
    }

    .srch_bar .input-group-addon {
        margin: 0 0 0 -27px;
    }

    .chat_ib h5 {
        font-size: 15px;
        color: #464646;
        margin: 0 0 8px 0;
    }

    .chat_ib h5 span {
        font-size: 13px;
        float: right;
    }

    .chat_ib p {
        font-size: 14px;
        color: #989898;
        margin: auto
    }

    .chat_img {
        width: 11%;
    }

    .chat_ib {
        padding: 0 0 0 15px;
        width: 88%;
    }

    .chat_people {
        overflow: hidden;
        clear: both;
        display: flex;
        align-items: center;
    }

    .chat_list {
        border-bottom: 1px solid #c4c4c4;
        margin: 0;
        padding: 18px 16px 10px;
        cursor: pointer;
    }

    .inbox_chat {
        height: 75vh;
        overflow-y: auto;
    }

    .active_chat {
        background: #0097bf;
        .chat_ib h5 {
            color: #fff;
        }
    }

    .incoming_msg_img {
        display: inline-block;
        width: 6%;
    }

    .received_msg {
        display: inline-block;
        padding: 0 0 0 10px;
        vertical-align: top;
        width: 92%;
    }

    .received_withd_msg p {
        background: #ebebeb none repeat scroll 0 0;
        border-radius: 3px;
        color: #000;
        font-size: 14px;
        margin: 0;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .time_date {
        color: #747474;
        display: block;
        font-size: 12px;
        margin: 8px 0 0;
    }

    .received_withd_msg {
        width: 50%;
    }

    .mesgs {
        padding: 30px 15px 0 25px;
        width: 60%;
        background: #fff;
    }

    .sent_msg p {
        background: #05728f none repeat scroll 0 0;
        border-radius: 3px;
        font-size: 14px;
        margin: 0;
        color: #fff;
        padding: 5px 10px 5px 12px;
        width: 100%;
    }

    .outgoing_msg {
        overflow: hidden;
        margin: 26px 0 26px;
    }

    .sent_msg {
        float: right;
        width: 50%;
    }

    .input_msg_write input {
        background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
        border: medium none;
        color: #4c4c4c;
        font-size: 15px;
        min-height: 55px;
        width: 90%;
        padding-left: 8px;
        outline: none;
    }

    .type_msg {
        border-top: 1px solid #c4c4c4;
        position: relative;
    }

    .msg_send_btn {
        background: #05728f none repeat scroll 0 0;
        border: medium none;
        border-radius: 50%;
        color: #fff;
        cursor: pointer;
        font-size: 17px;
        height: 33px;
        position: absolute;
        right: 0;
        top: 11px;
        width: 33px;
        outline: none;
        img {
            margin: 5px 0 0 5px;
        }
    }

    .messaging {
        padding: 0 0 50px 0;
    }

    .msg_history {
        height: 70vh;
        overflow-y: auto;
    }
</style>

