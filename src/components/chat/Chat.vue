<template>
    <div class="chat-container">
        <h3 class=" text-center">Сообщения</h3>
        <div class="messaging">
            <div class="inbox_msg">
                <div class="inbox_people">
                    <div class="headind_srch">
                        <div class="recent_heading">
                            <h4>Список</h4>
                        </div>
                        <div class="srch_bar">
                            <div class="stylish-input-group">
                                <input type="text" class="search-bar" placeholder="Поиск">
                                <span class="input-group-addon">
                                    <button type="button"> <i class="fa fa-search" aria-hidden="true"></i></button>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="inbox_chat">
                        <div class="chat_list active_chat">
                            <div class="chat_people">
                                <div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"></div>
                                <div class="chat_ib">
                                    <h5>Иван Иванов <span class="chat_date">Dec 25</span></h5>
                                    <p>Добрый день, как ваши дела?.</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat_list">
                            <div class="chat_people">
                                <div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"></div>
                                <div class="chat_ib">
                                    <h5>Эльдияр Кененсаров <span class="chat_date">Dec 25</span></h5>
                                    <p>Добрый день, как ваши дела?.</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat_list">
                            <div class="chat_people">
                                <div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"></div>
                                <div class="chat_ib">
                                    <h5>Айбек Баратов <span class="chat_date">Dec 25</span></h5>
                                    <p>Добрый день, как ваши дела?.</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat_list">
                            <div class="chat_people">
                                <div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"
                                                           alt="sunil"></div>
                                <div class="chat_ib">
                                    <h5>Аселя Мухтарова <span class="chat_date">Dec 25</span></h5>
                                    <p>Добрый день, как ваши дела?.</p>
                                </div>
                            </div>
                        </div>
                        <div class="chat_list">
                            <div class="chat_people">
                                <div class="chat_img"><img src="https://ptetutorials.com/images/user-profile.png"
                                                           alt="sunil"></div>
                                <div class="chat_ib">
                                    <h5>Айгуль Урматова <span class="chat_date">Dec 25</span></h5>
                                    <p>Добрый день, как ваши дела?.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mesgs">
                    <div class="msg_history">
                        <div class="incoming_msg">
                            <div class="incoming_msg_img"><img src="https://ptetutorials.com/images/user-profile.png"
                                                               alt="sunil"></div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>Тестирую отправку сообщения</p>
                                    <span class="time_date"> 11:01 AM</span></div>
                            </div>
                        </div>
                        <div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>Вижу твои сообщения дошли</p>
                                <span class="time_date"> 11:01 AM</span></div>
                        </div>

                        <div class="outgoing_msg" v-for="msg in messages">
                            <div class="sent_msg">
                                <p>{{ msg }}</p>
                                <span class="time_date">{{ getCurrentTime() }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="type_msg">
                        <div class="input_msg_write">
                            <input type="text" v-model="inputValue" @keyup.enter="sendMessage" class="write_msg"
                                   placeholder="Написать сообщение"/>
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

    export default {
        data() {
            return {
                inputValue: '',
                messages: []
            }
        },
        methods: {
            sendMessage() {
                if (this.inputValue.length) {
                    this.messages.push(this.inputValue);
                    this.inputValue = '';
                }
            },

            getCurrentTime() {
                return moment().format('hh:mm');
            }
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
        float: left;
        overflow: hidden;
        width: 40%;
        border-right: 1px solid #c4c4c4;
    }

    .inbox_msg {
        border: 2px solid #969696;
        border-radius: 4px;
        clear: both;
        overflow: hidden;
    }

    .top_spac {
        margin: 20px 0 0;
    }

    .recent_heading {
        float: left;
        width: 40%;
    }

    .srch_bar {
        display: inline-block;
        text-align: right;
        width: 60%;
    }

    .headind_srch {
        padding: 10px 29px 10px 20px;
        overflow: hidden;
        border-bottom: 1px solid #c4c4c4;
    }

    .recent_heading h4 {
        color: #05728f;
        font-size: 21px;
        margin: auto;
    }

    .srch_bar input {
        border: 1px solid #cdcdcd;
        border-width: 0 0 1px 0;
        width: 80%;
        padding: 2px 0 4px 6px;
        background: none;
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
        float: left;
        width: 11%;
    }

    .chat_ib {
        float: left;
        padding: 0 0 0 15px;
        width: 88%;
    }

    .chat_people {
        overflow: hidden;
        clear: both;
    }

    .chat_list {
        border-bottom: 1px solid #c4c4c4;
        margin: 0;
        padding: 18px 16px 10px;
    }

    .inbox_chat {
        height: 550px;
        overflow-y: auto;
    }

    .active_chat {
        background: #ebebeb;
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
        color: #646464;
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
        width: 57%;
    }

    .mesgs {
        float: left;
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
        width: 46%;
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
        height: 516px;
        overflow-y: auto;
    }
</style>

