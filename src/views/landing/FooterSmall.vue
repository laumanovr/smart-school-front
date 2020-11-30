<template>
    <div class="footerContent">
        <div class="footerr">
            <div class="UpdateDate">
                <p>© 2020. Все права защищены.</p>
            </div>
            <div class="SocService">
                <p class="">Проект “Умная Школа” <span class="spanbr"/>осуществлен ГП “Соцсервис” при ГКИТиС КР</p>
            </div>
            <div class="SocServiceImg">
                <img src="@/assets/images/landing/socservice.svg">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FooterSmall"
    }
</script>

<style scoped>
    .footerContent {
        width: 100%;
        margin: 0;
        position: absolute;
        padding: 0;
    }

    .footerr {
        box-sizing: border-box;
        margin-top: 200px;
        min-height: 110px;
        width: 100%;
        text-align: center;
        background: linear-gradient(180deg, #4A27F3 0%, #339DFA 100%);
    }

    .UpdateDate {
        padding-top: 30px;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        text-align: right;
        letter-spacing: 0.01em;
        color: #F2F2F2;
        float: left;
        width: 20%;
    }

    .SocService {
        display: inline;
        float: left;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        padding-top: 30px;
        text-align: right;
        padding-left: 5%;
        letter-spacing: 0.01em;
        color: #F2F2F2;
        width: 50%;
    }

    .SocServiceImg {
        display: inline-block;
        float: right;
        height: 100px;
    }

    .spanbr {
        display: none;
    }

    @media (max-width: 960px) {
        .SocService {
            text-align: right;
            width: 50%;
        }
    }

    @media all and (max-width: 700px) {
        .SocService p {
            width: 40%;
            text-align: left;
        }
    }

    @media all and (max-width: 445px) {
        .SocServiceImg {
        }

        .UpdateDate {
            display: block;
            text-align: center;
            width: 55%;
            padding-top: 10px;
        }

        .SocService {
            text-align: center;
            width: 60%;
            padding-top: 10px;

        }

        .spanbr {
            display: none;
        }
    }
</style>
