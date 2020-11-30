<template>
    <div class="OpportunitiesContent">
        <div class="MainOpportunities">
            <div class="box">
                <div class="box1">
                    <img class="box1-img" src="@/assets/images/landing/Science1.svg" alt="Science1">
                </div>
                <div class="box21">
                    <img class="ScienceImg" src="@/assets/images/landing/teacherSmallBox.svg">
                    <div class="TeacherOppotunityTextBox">
                        <img class="teacherEllipse ellipse" src="@/assets/images/landing/teacherEllipse.png">
                        <h3>
                            Для учителей
                        </h3>
                        <p>
                            Управляйте своими уроками и группами учащихся. Наблюдайте за
                            успеваемостью и оценивайте их работы простым и быстрым способом.
                        </p>
                        <button class="opportunityLearnMoreButton">
                            <router-link :to="{name:'teacherOpportunity'}">
                                <a>Узнать больше</a>
                                <img src="@/assets/images/landing/next.svg" alt="next ">
                            </router-link>
                        </button>
                    </div>
                </div>
            </div>
            <div class="box">
                <div>
                    <div class="box1">
                        <img class="box1-img" src="@/assets/images/landing/GosOr.png" alt="Science1">
                    </div>
                    <div class="box21">
                        <img class="ScienceImg" src="@/assets/images/landing/teacherSmallBox.svg">

                        <div class="TeacherOppotunityTextBox">
                            <h3>
                                Для госорганов
                            </h3>
                            <p>
                                Отслеживайте и анализируйте деятельность школ,
                                получайте детальные отчеты и будьте в курсе всего 24/7.
                            </p>
                            <img class="gosEllipse ellipse" src="@/assets/images/landing/gosEllipse.png">
                            <button class="opportunityLearnMoreButton">
                                <router-link :to="{name:'gosOpportunity'}">
                                    <a>Узнать больше</a>
                                    <img src="@/assets/images/landing/next.svg" alt="next ">
                                </router-link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box">
                <div>
                    <div class="box1">
                        <img class="box1-img" src="@/assets/images/landing/BacktoSchool1.svg" alt="Science1">
                    </div>
                    <div class="box21">
                        <img class="ScienceImg" src="@/assets/images/landing/teacherSmallBox.svg">

                        <div class="TeacherOppotunityTextBox">
                            <img class="parentEllipse ellipse" src="@/assets/images/landing/parentEllipse.png">
                            <h3>
                                Для родителей
                            </h3>
                            <p>
                                Отслеживайте успеваемость и посещаемость вашего ребенка
                                в школе легким и удобном способом.
                            </p>
                            <button class="opportunityLearnMoreButton">
                                <router-link :to="{name:'parentOpportunity'}">
                                    <a>Узнать больше</a>
                                    <img src="@/assets/images/landing/next.svg" alt="next ">
                                </router-link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box">
                <div>
                    <div class="box1">
                        <img class="box1-img" src="@/assets/images/landing/Grades1.svg" alt="Science1">
                    </div>
                    <div class="box21">
                        <img class="ScienceImg" src="@/assets/images/landing/teacherSmallBox.svg">

                        <div class="TeacherOppotunityTextBox">
                            <h3>
                                Для учеников
                            </h3>
                            <p>
                                Посещай занятия, выполняй домашние задания вовремя, веди записи, получай отзывы от учителей и преуспевай в учебе.</p>
                            <img class="studentEllipse ellipse" src="@/assets/images/landing/studentEllipse.png">

                            <button class="opportunityLearnMoreButton">
                                <router-link :to="{name:'studentOpportunity'}">
                                    <a>Узнать больше</a>
                                    <img src="@/assets/images/landing/next.svg" alt="next ">
                                </router-link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img class="copybook" src="@/assets/images/landing/copybook.png">
    </div>
</template>

<script>
    export default {
        name: "MainOpportunities",
        components: {}
    }
</script>

<style scoped>
    .OpportunitiesContent {
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .MainOpportunities {
        width: 90%;
        max-width: 1400px;
        margin-left: auto;
        margin-right: auto;
    }

    .OpportunitiesContent p {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 160%;
        color: #4B5D68;
    }

    .TeacherOppotunityTextBox button {
        position: absolute;
        bottom: 20%;
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 160%;
        display: flex;
        align-items: center;
        letter-spacing: 0.005em;
        border: none;
        background: none;
        color: #212353;
    }

    button img {
        padding-left: 10px;
    }

    .box1 {
        box-sizing: border-box;
        width: 45%;
        display: inline-block;
        min-height: 360px;;
        text-align: center;
        clear: both;
        margin-right: 2px;
    }

    .box button:hover {
        background: none;
        color: #1a0c63;
    }

    .TeacherOppotunityTextBox {
        width: 90%;
        height: 100%;
        left: 0;
        top: 0;
        margin-left: 10%;
        box-sizing: border-box;
        position: absolute;
        padding: 15% 10% 0 20%;
        text-align: left;
    }

    .box21 .ScienceImg {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .box21 {
        width: 80%;
        height: 100%;
        margin-left: -21%;
        max-height: 360px;
        max-width: 432px;
        display: inline;
        position: absolute;
        box-sizing: border-box;
        text-align: center;
        clear: both;
    }

    .teacherEllipse {
        margin-top: -15%;
        float: right;
        margin-right: 45%;
    }

    .ellipse {
        display: block;
    }

    .gosEllipse {
        float: right;
    }

    .parentEllipse, .studentEllipse {
        float: right;
        margin-top: -7%;
    }

    .studentEllipse {
        margin-top: 8%;
    }

    .box {
        display: inline-block;
        width: 49%;
        position: relative;
        margin: 0 2px 50px 0;
        height: auto;
        box-sizing: border-box;
    }

    .box1-img {
        padding-top: 25px;
        width: 280px;
        height: 300px;
    }

    .OpportunitiesContent h3 {
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 130%;
        margin-bottom: 20px;
        align-items: center;

        color: #212353;
    }

    .OpportunitiesContent .copybook {
        margin-top: -50px;
    }

    .copyBook2 {
        margin-top: 250px;
        float: right;
    }

    .opportunityLearnMoreButton a {
        text-decoration: none;
        color: #212353;
    }

    .opportunityLearnMoreButton {
        transition: color .2s;
    }

    .opportunityLearnMoreButton:hover a {
        color: #031cf8;
    }

    @media (max-width: 700px) {
        .box {
            display: block;
            width: 100%;
        }

        .TeacherOppotunityTextBox .ellipse {
            display: block;
        }

        .box1-img {
            padding-top: 50px;
            width: 85%;
            height: 60%;
        }

        .box21 {
            background-repeat: no-repeat;
            width: 100%;
            height: 358px;
        }

        .box21 {
            margin-left: -25%;
            width: 100%;
        }

        .MainOpportunities {
            margin: 50px 0 0 0;
            position: relative;

        }

        .OpportunitiesContent p {
            font-size: 14px;
            line-height: 150%;
        }

        .TeacherOppotunityTextBox button {
            bottom: 22%;

            font-size: 14px;
            line-height: 150%;
        }

        .TeacherOppotunityTextBox {
            width: 80% !important;
            margin-left: 15%;
            height: 100%;
            padding: 15% 5% 0 20% !important;
        }

        .box21 {
            width: 75%;
            height: 100%;
            margin-left: -25%;

        }

        .MainOpportunities {
            width: 100%;
            max-width: 700px;
        }

        .box {
            display: block;
            width: 100%;
        }

        .OpportunitiesContent h3 {
            font-size: 20px;
            margin-bottom: 10px;
            padding-top: 10px;
        }

    }

    @media (max-width: 400px) {
        .box {
            display: block;
            width: 100%;
            margin: 0 2px 0 0;
            height: auto;
        }

        .box1-img {
            padding-top: 100px;
        }

        .box21 {
            background-repeat: no-repeat;
            width: 100%;

        }

        .box21 img {
            display: none;
        }

        .MainOpportunities {
            margin: 50px 0 0 0;
            position: relative;
        }

        .OpportunitiesContent p {
            font-size: 14px;
            line-height: 130%;
        }

        .TeacherOppotunityTextBox button {
            bottom: 22%;
            font-size: 14px;
            line-height: 130%;
        }

        .TeacherOppotunityTextBox {
            width: 100%;
            margin-left: 25%;
            padding: 10% 15% 0 40%;

        }

        .box21 {
            width: 100%;
            height: 100%;
            margin-left: -50%;

        }

        .MainOpportunities {
            width: 100%;
            max-width: 700px;
        }

        .box {
            display: block;
            width: 100%;
        }

        .OpportunitiesContent h3 {
            font-size: 20px;
            margin-bottom: 10px;
            padding-top: 10px;
        }
    }

    @media screen and (max-width: 960px) {
        .MainOpportunities {
            width: 100%;
            max-width: 700px;
        }

        .TeacherOppotunityTextBox {
            width: 90%;
            height: 90%;
            padding: 25% 8% 0 20%;
        }

        .OpportunitiesContent h3 {
            font-size: 22px;
            line-height: 130%;
            margin-bottom: 10px;
            color: #212353;
        }

        .OpportunitiesContent p {
            font-size: 14px;
            line-height: 130%;
        }

        .TeacherOppotunityTextBox button {
            bottom: 15%;
            font-size: 14px;
            line-height: 130%;
        }

        .ellipse {
            display: none;
        }
    }
</style>
