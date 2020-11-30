<template>
    <div class="MainPage">
        <Navbar/>
        <div class="section1">
            <div class="col-6">
                <img class="col-6-img" src="@/assets/images/landing/Classroom1.png" alt="Classroom Blackboard">
                <div>
                    <span class="SmartSchoolSpan">
                        <span class="SmartSchoolSpanBold">“Умная Школа”</span>
                         - единая платформа <span class="spanbr"></span>
                        для учителей, родителей и школьников.
                    </span>
                    <p class="Sm">“Умная Школа” предоставляет удобные сервисы <span class="spanbr"/> и приложение,
                        которые доступны 24 часа в сутки,<span class="spanbr"/> 7 дней в неделю, 365 дней в году!</p>
                </div>
                <div>
                    <router-link :to="{name:'about'}">
                        <button class="LearnMore">
                            Узнать больше
                        </button>
                    </router-link>
                </div>
            </div>
            <div class="col-6-visible">
                <img src="@/assets/images/landing/Classroom1.png">
            </div>
        </div>

        <div class="section2">
            <div class="img_math ">
                <img src="@/assets/images/landing/book_math.png">
            </div>
            <div class="SmartSchool">
                <div class="classroom">
                    <img src="@/assets/images/landing/KidsStudyingfromHome1.png" alt="KidsStudyingfromHome1">
                </div>
                <div class="SmartSchoolThis">
                    <span class="SmartSchoolThisIs">“Умная Школа” - это:</span>
                    <ul class="SmartSchoolThisdiv">
                        <li>современное электронное обучение</li>
                        <li>круглосуточный доступ к расписанию уроков,<br/> журналу и домашним заданиям 24/7</li>
                        <li>прямая связь с учителями, родителями и <br/> школьниками</li>
                        <li>детальная статистика школ и отчеты</li>
                        <li>удобное приложение доступное с любого<br/> устройства</li>
                    </ul>

                </div>
            </div>
            <div class="img_globe">
                <img src="@/assets/images/landing/globus.png">
            </div>
        </div>

        <div class="section3">
            <h1>Возможности</h1>
            <img class="img_mackBook" src="@/assets/images/landing/Notebook.png"/>
            <MainOpportunities/>
            <img class="img_bag" src="@/assets/images/landing/bag.png">
        </div>

        <div class="section4">
            <div class="box">
            </div>
            <div class="PhoneContent">
                <h3>
                    Скачайте наше приложение!
                </h3>
                <p>
                    Использование “Умная Школа” безопасно, удобно и доступно каждому!
                </p>
                <img src="@/assets/images/landing/phone.png" alt="phone">
            </div>
        </div>
        <div class="section5">
            <div class="AppButtons">
                <button class="buttonAStore">
                    <span>
                      <img class="AStoreDisplayBlockLogo" src="@/assets/images/landing/AppStore.svg" alt="AppStore">
                       <img class="AStoreDisplayNoneLogo" src="@/assets/images/landing/appStorrWhiteLogo.png" alt="googlePlay">
                    </span>
                    <span class="spanStore"><span> Доступно в <span class="AStoreSpan">App Store</span></span></span>
                </button>

                <button class="buttonGplay">
                    <span>
                      <img class="playMarketDisplayBlockLogo" src="@/assets/images/landing/googlePlay.svg" alt="googlePlay">
                        <img class="playMarketDisplayNoneLogo" src="@/assets/images/landing/playMarketWhitelogo.png"
                             alt="googlePlay">
                    </span>
                    <span class="spanStore"><span> Доступно в <span class="AStoreSpan">Google Play</span></span></span>
                </button>
            </div>
            <div>
                <div class="UserandCount">
                    <span class="UserCount">1K+</span>
                    <span class="User">Школ</span>
                </div>
                <div class="UserandCount">
                    <span class="UserCount">  21K+</span>
                    <span class="User">Родителей</span>
                </div>
                <div class="UserandCount">
                    <span class="UserCount">  16K+</span>
                    <span class="User">Учителей</span>
                </div>
                <div class="UserandCount">
                    <span class="UserCount">  100K+</span>
                    <span class="User">Скачиваний</span>
                </div>
            </div>
            <img class="Flower1" src="@/assets/images/landing/Flower1.png" alt="Flower2">
            <img class="Flower2" src="@/assets/images/landing/Flower1.svg" alt="Flower1">
            <div class=Flowers>
            </div>
            <div class="EndContent"></div>
        </div>
        <Footer/>
    </div>
</template>

<script>
    import MainOpportunities from "@/views/landing/MainOpportunities";
    import Navbar from "@/views/landing/Navbar";
    import Footer from "@/views/landing/Footer";

    export default {
        name: "MainPage",
        components: {
            Navbar,
            MainOpportunities,
            Footer,
        }
    }
</script>


<style scoped>
    .MainPage {
        width: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .section3 h1 {
        font-style: normal;
        font-weight: 800;
        font-size: 40px;
        line-height: 130%;
        justify-content: center;
        display: flex;
        align-items: center;
        text-align: center;
        color: #212353;
    }

    .section3 {
        margin: 185px 0 50px 0;
    }

    .section3 .img_mackBook {
        margin-top: -60px;
        margin-bottom: -66px;
    }

    .section1 {
        box-sizing: border-box;
        width: 100%;
        padding: 0 80px 0 80px;
    }

    .section1 .col-6 {
        width: 50%;
        font-style: normal;
        display: inline-block;
        padding-top: 5%;
    }

    .section1 .col-6-visible {
        width: 50%;
        font-style: normal;
        display: inline-block;
        float: right;
    }

    .section1 .col-6-img {
        display: none;
    }

    .section1 .spanbr {
        display: block;
    }

    .section1 .Sm {
        font-style: normal;
        font-weight: 300;
        font-size: 21px;
        line-height: 160%;
        margin-top: 37px;
        color: #4B5D68;
    }

    .SmartSchoolSpan {
        font-weight: 500;
        font-size: 27px;
        display: inline-block;
        line-height: 150%;
        width: 100%;
        align-items: center;
        color: #212353;
    }

    .col-8 span {
        display: inline-block;
    }

    .SmartSchoolSpanBold {
        font-weight: bold;
        display: inline-block;
        font-size: 27px;
        line-height: 150%;
        /* or 40px */

        align-items: center;
        color: #212353;
    }

    .col-8 h4 {
        font-weight: 500;
        font-size: 27px;
        line-height: 150%;
        /* or 40px */
        display: flex;
        align-items: center;
        color: #212353;
    }

    .col-8 p {
        font-weight: 300;
        font-size: 21px;
        line-height: 160%;
        color: #4B5D68;
    }

    .LearnMore {
        width: 243px;
        height: 51px;
        margin-top: 70px;
        border: none;
        border-radius: 50px;
        color: #FFFFFF;
        font-weight: bold;
        font-size: 16px;
        background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    }

    .LearnMore:hover {
        transform: scale(1.05);
        will-change: transform;
        border: 1px solid #167ce9;
        background: transparent !important;
        color: #167ce9;
        cursor: pointer;
    }

    .LearnMore:hover a {
        text-decoration: none;
        color: #FFFFFF;
    }

    .LearnMore:hover a {
        color: #167ce9;
    }

    /*section2 Smart school this is... part*/
    .section2 {
        width: 100%;
        height: auto;
        box-sizing: border-box;
        padding: 200px 80px 0 80px;
    }

    .img_math {
        margin-left: -80px;
        margin-bottom: -80px;
        opacity: 0.3;
        transform: rotate(9.75deg);
        padding-bottom: 0;
    }

    .section2 .img_globe {
        float: right;
        margin-top: -70px;

    }

    .section2 .SmartSchool {
        width: 90%;
        box-sizing: border-box;
        min-height: 560px;;
        position: relative;
        border-radius: 50px;
        background: #D5D6FD;
    }

    .classroom {
        box-sizing: border-box;
        padding-top: 50px;
        display: inline-block;
        width: 45%;
        margin: 0;
    }

    @media (max-width: 1200px) {
        .section1 .col-6 {
            padding-top: 0;
        }

        .section2 .SmartSchool {
            width: 100%;
        }

        .SmartSchoolThisIs {
            padding-top: 20px;

        }
    }

    @media (max-width: 992px) {
        .section1 .col-6 {
            padding-top: 0;
        }

        .section1 .col-6-visible {
            margin-top: 10%;
        }

        .section2 {
            padding: 200px 40px 0 40px;
        }

        .section2 .SmartSchool {
            width: 100%;
        }

        .classroom {
            width: 50%;

        }

        .section2 .SmartSchoolThis {
            box-sizing: border-box;
            width: 50%;

            padding: 0 2% 0 5%;
        }

        .SmartSchoolThis ul li {

            padding-bottom: 25px;

            line-height: 130%;
        }

        .SmartSchoolThisIs {
            padding-top: 20px;
            padding-bottom: 0;
            font-size: 30px;
            line-height: 150%;

        }
    }

    .SmartSchoolThis {
        box-sizing: border-box;
        padding: 0 5% 0 5%;
        text-align: left;
        position: relative;
        width: 55%;
        display: inline-block;
        margin-bottom: 2%;
    }

    .SmartSchoolThisIs {
        padding-bottom: 30px;
        font-style: normal;
        font-weight: 800;
        font-size: 33px;
        line-height: 160%;
        display: flex;
        align-items: center;
        color: #212353;

    }

    .SmartSchoolThis ul {
        margin-left: 20px;
        list-style: none;
    }

    .SmartSchoolThis ul li:before {
        content: "\2022";
        color: white;
        font-size: 40px;
        display: inline-block;
        width: 45px;
        margin-left: -45px;
        vertical-align: middle;
    }

    .SmartSchoolThis ul li {
        text-align: left;
        padding-bottom: 35px;
        color: #4B5D68;
        font-weight: 500;
        font-size: 20px;
        line-height: 160%;
    }

    .section4 {
        width: 100%;
        position: relative;
    }

    .section4 .box {
        width: 100%;
        margin: 0;
        height: 729px;
        background-image: url('/src/assets/images/landing/PhoneBox.png');
        border-radius: 54px;
    }

    .PhoneContent {
        margin-top: -729px;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    }

    .PhoneContent h3 {
        font-style: normal;
        font-weight: 800;
        font-size: 36px;
        line-height: 160%;
        padding: 170px 0 0 113px;
        text-align: left;
        color: #212353;
    }

    .PhoneContent p {
        font-style: normal;
        font-weight: normal;
        font-size: 21px;
        line-height: 160%;
        padding: 45px 0 91px 80px;
        text-align: left;
        color: #000000;
    }

    .section5 {
        margin: 97px 0 50px 0;
        text-align: center;
    }

    .buttonAStore {
        border: none;
        border-radius: 15px 15px;
        width: 212px;
        height: 70px;
        background: linear-gradient(180deg, #4a27f3 0%, #339DFA 100%);
        box-shadow: 0 5px 5px rgba(75, 93, 104, 0.1);
        text-align: left;
        padding: 2px 0 3px 18px;
        display: inline-block;
        cursor: pointer;

    }

    .buttonAStore:hover {
        background: linear-gradient(180deg, #16caf8 0%, #02f8f1 100%);

    }

    .AStoreDisplayNoneLogo {
        display: none;
    }

    .buttonAStore:hover .AStoreDisplayNoneLogo {
        display: none;
    }

    .buttonAStore .buttonGplay img {
        display: inline;
    }

    .section5 .AStoreSpan {
        font-weight: bold;
        display: block;
        text-align: center;
    }

    .spanStore {
        padding-top: 5px;
        position: absolute;
    }

    .buttonGplay {
        border: 1px solid black;
        border-color: #4A27F3;
        border-radius: 15px 15px;
        margin-left: 18px;
        width: 212.39px;
        height: 70px;
        background: none;
        box-shadow: 0px 5px 5px rgba(75, 93, 104, 0.1);
        text-align: left;
        padding: 2px 0px 3px 18px;
        display: inline-block;
        cursor: pointer;

    }

    .playMarketDisplayNoneLogo {
        display: none;
    }

    .buttonGplay:hover {
        background: linear-gradient(180deg, #16caf8 0%, #02f8f1 100%);
        border: none;

    }

    .buttonGplay:hover .playMarketDisplayNoneLogo {
        display: block;
    }

    .buttonGplay:hover .playMarketDisplayBlockLogo {
        display: none;
    }

    .buttonGplay:hover span {
        color: #F5F5F5;
    }

    span {
        margin-right: 15px;
        display: inline-block;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 119%;
        /* or 21px */
        color: #F5F5F5;
    }

    .buttonGplay span {
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 119%;
        color: #212353;
    }

    .UserandCount {
        width: 184px;
        height: 100px;
        display: inline-block;
        margin: 110px 40px;
    }

    .UserCount {
        display: block;
        width: 184px;
        height: 52px;
        text-align: center;
        font-style: normal;
        font-weight: 900;
        font-size: 40px;
        line-height: 160%;
        color: #4A27F3;
    }

    .User {
        display: block;
        width: 184px;
        height: 34px;
        font-style: normal;
        font-weight: normal;
        font-size: 21px;
        line-height: 160%;
        text-align: center;
        color: #000000;
        padding-top: 14px;
    }

    .EndContent {
        margin-top: 30px;
        width: 100%;
        height: 2px;
        background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
        opacity: 0.2;

    }

    .Flower1 {
        margin-top: -255px;
        float: left;
    }

    .Flower2 {
        margin-top: -480px;
        display: inline;
        float: right;
    }

    .img_bag {
        float: right;
        margin-top: -150px;

    }

    @media (max-width: 400px) {
        /*sectin1*/
        .SmartSchoolSpan {
            font-weight: 500;
            font-size: 23px;
            line-height: 140%;
            width: 100%;
            text-align: justify-all;
            color: #212353;
        }

        .SmartSchoolSpan .spanbr {
            display: none
        }

        .section4 {
            width: 100%;
            margin: 0;

        }

        .section1 {
            width: 100%;
        }

        /*  sectin2 */
        .section2 {

            width: 100%;
            padding-top: 150px;

        }

        .SmartSchoolThisIs {

            font-size: 25px;
            line-height: 150%;

        }

        .img_math {
            opacity: 0.3;
            margin-top: -105px !important;
            float: left;
            transform: rotate(9.75deg);
            padding-bottom: 0;
        }

        .section2 ul {
            margin-left: 0;
            margin-right: 45px;
        }

        .section2 ul li:before {
            font-size: 40px;

            margin-left: -25px;
        }

        .section2 ul li {
            font-weight: 500;
            font-size: 20px;
            line-height: 25px;
            width: 100%;
            text-align: left;
            padding-bottom: 35px;
            color: #4B5D68;
        }

        /* end sectin2 */
        .section3 .img_mackBook {
            margin-top: 0;
            margin-left: -40px;
            margin-bottom: -100px;
        }

        .img_bag {
            float: right;
            margin-top: -150px;
            margin-right: 0;
        }

        .PhoneContent {
            padding: 20px 20px;
        }

        .PhoneContent h3 {

            padding-left: 50px;
            text-align: left;
            color: #212353;
        }

        .buttonGplay {

            margin-left: 0;
            display: inline-block;
        }
    }

    @media (max-width: 700px) {
        .section1 {
            padding-right: 50px;
        }

        .section1 .col-6 {
            position: relative;
            font-style: normal;
            display: block;
            width: 100%;
            text-align: center;
        }

        .section1 .col-6-img {
            margin: 20px auto;
            width: 300px;
            display: block;

        }

        .section1 .col-6-visible {
            display: none;
        }

        .section1 .spanbr {
            display: inline;
        }

        .section1 .Sm {
            text-align: center;
        }

        .section2 {

            width: 95%;
            padding: 4%;
            padding-top: 150px;
        }

        .section2 .SmartSchool {
            box-sizing: border-box;
        }

        .section2 .classroom {
            width: 90%;
        }

        .section2 .SmartSchoolThis {
            width: 100%;
            padding: 10%;

        }

        .SmartSchoolThisIs {
            padding-bottom: 40px;
            color: #212353;

        }

        .section2 .img_math {
            opacity: 0.3;
            margin-top: -105px !important;
            float: left;
            transform: rotate(9.75deg);
            padding-bottom: 0;

        }

        .section2 ul {
            margin-left: 0;
            margin-right: 45px;
        }

        .section2 ul li:before {
            font-size: 40px;
            display: inline-block;
            text-align: justify;
            width: 25px;
            margin-left: -25px;
        }

        .section2 ul li {
            font-weight: 500;
            font-size: 20px;
            line-height: 27px;
            width: 100%;
            text-align: left;
            padding-bottom: 35px;
            color: #4B5D68;
        }

        .section2 .img_globe {
            float: right;
            margin-top: -70px;

        }

        /*  end section2  */
        .UserandCount {
            width: 184px;
            height: 100px;
            display: inline-block;
            margin: 40px 40px !important;
        }

        .buttonAStore {
            margin-bottom: 50px;
            display: inline-block;
        }

        .buttonGplay {

            margin-left: 18px;
            display: inline-block;
        }

        .section3 .img_mackBook {
            margin-top: 0;
            margin-left: -40px;
            margin-bottom: -100px;

        }
    }

    @media (max-width: 428px) {
        .buttonGplay {
            margin-left: 0;
            display: inline;
        }
    }

</style>
