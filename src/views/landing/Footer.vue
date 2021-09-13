<template>
    <div class="FooterContent">
        <div class="LandingFooterMenu">
            <div class="footerRow">
                <div class="FooterCols SmartSchoolFooterCols" style="width: 320px">
                    <div class="footerSmartShool">
                        <img src="@/assets/images/landing/LogoSmart.svg" alt="LogoSmart">
                        <span class="SmartSchoolFooter">«Умная Школа»</span>
                    </div>
                    <span class="Contact">
                        <span class="tel">(0312) 98-61-90, 98-61-91</span>
                        <span class="mail">support@infocom.kg</span>
                    </span>
                    <span class="Address">
                        <span>Чокона Валиханова 2 (Чолпон-Атинская)</span>
                        <span>Бишкек, Кыргызстан</span>
                    </span>
                </div>
                <div class="FooterCols">
                    <div class="FooterHeadTheme">О проекте</div>
                    <span class="items">Документы</span>
                </div>
                <div class="FooterCols">
                    <div class="FooterHeadTheme">Возможности</div>
                    <span class="items"><a>Родителям</a></span>
                    <span class="items"><a> Ученикам</a></span>
                    <span class="items"><a> Учителям</a></span>
                    <span class="items"><a>Госорганам</a></span>
                </div>
                <div class="FooterCols">
                    <div class="FooterHeadTheme">Поддержка</div>
                    <span class="items"> <a>Вопросы и ответы</a></span>
                </div>
                <div class="FooterCols">
                    <!--<div class="FooterHeadTheme">Социальные сети</div>-->
                    <!--<span class="icons"><i class="fa fa-facebook rounded-circl fa-2x"></i></span>-->
                    <!--<span class="icons"><i class="fa fa-twitter rounded-circl fa-2x"></i></span>-->
                    <!--<span class="icons"><i class="fa fa-instagram fa-2x" aria-hidden="true"></i></span>-->
                </div>
            </div>
        </div>
        <FooterSmall/>
    </div>
</template>

<script>
    import FooterSmall from "@/views/landing/FooterSmall";
    export default {
        name: "Footer",
        components: {
            FooterSmall
        }
    }
</script>

<style scoped>
    .FooterContent {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        margin: 0;
        padding: 0;
    }

    .LandingFooterMenu {
        margin: 0 50px 10px 90px;
        display: flex;
    }

    .footerRow {
        display: flex;
        justify-content: space-between;
        flex: 1;
        font-size: 18px;
        line-height: 38px;
        box-sizing: border-box;
    }

    .FooterCols {
        box-sizing: border-box;
        float: left;
        margin: 0 5px;
        text-align: left;
    }

    .SmartSchoolFooterCols {
        text-align: left;
        box-sizing: border-box;
    }

    .footerSmartShool {
        float: left;
        display: block;
        height: 120px;
    }

    .footerSmartShool img {
        margin-left: -25px;
    }

    .SmartSchoolFooter {
        height: 36px;
        position: relative;
        top: 35%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
        font-style: normal;
        font-weight: 800;
        font-size: 20px;
        line-height: 160%;
        color: #212353;
    }

    .footerSmartShool img {
        float: left;
        margin-top: 5px;
        position: relative;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    .Contact {
        display: block;
        margin-top: 130px;
        font-size: 16px;
    }

    .Contact span, .Address span {
        display: block;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 180%;
        letter-spacing: 0.01em;
        color: #212353;
    }

    .Address {
        display: block;
        margin-top: 10px;
    }

    .FooterHeadTheme {
        margin-top: 50px;
        margin-bottom: 32px;
        text-align: left;
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 160%;
        color: #212353;
    }

    .items {
        display: block;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 250%;
        text-align: left;
        color: #212353;
    }

    .icons {
        width: 50px;
        display: inline-block;
        border-radius: 50%;
        height: 50px;
        background: #212353;
        opacity: 0.2;
        vertical-align: middle;
        line-height: 60px;
        text-align: center;

    }

    .icons:hover {
        opacity: 0.6;
    }

    .fa {
        color: white;
    }

    @media (max-width: 900px) {
        .FooterHeadTheme {
            margin-top: 50px;
            margin-bottom: 20px;
            text-align: left;
            font-style: normal;
            font-weight: 800;
            font-size: 24px;
            line-height: 160%;
            color: #212353;
        }

        .Contact {
            margin-top: 30px;
        }

        .LandingFooterMenu {
            padding-left: 30%;
        }

        .footerRow {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            padding-left: 2%;
            font-size: 14px;
            line-height: 36px;
            box-sizing: border-box;
        }

        .FooterCols {
            margin-bottom: 2px;
        }

        .items {
            font-size: 22px;
        }

    }

    @media all and (max-width: 700px) {
        .LandingFooterMenu {
            padding-left: 5%;
        }

        .FooterCols {
            display: table;
            width: 48%;
            height: auto;
        }

        .footerRow {
            text-align: center;
        }

        .FooterHeadTheme {
            margin-top: 50px;
            margin-bottom: 15px;
        }
    }

    @media (max-width: 400px) {
        .LandingFooterMenu {
            margin: 0 0 10px 0;
        }
        .LandingFooterMenu {
            padding-left: 5%;
        }
    }
</style>
