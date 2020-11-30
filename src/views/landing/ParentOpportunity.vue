<template>
    <div>
        <Navbar/>
        <div class="contentt">
            <div class="sectionn">
                <div>
                    <img class="ScienceDisplayNone" src="@/assets/images/landing/BacktoSchool1.svg" alt="BacktoSchool1">
                    <div class="scinImgx">
                        <img src="@/assets/images/landing/BacktoSchool1.svg" alt="BacktoSchool1">
                    </div>
                    <img class="boxx" src="@/assets/images/landing/parentBigBox.png">
                    <div class="boxdivx">
                        <h3>
                            Для Родителей
                        </h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Mi, felis in id lobortis quis dignissim.
                            Ipsum nisl amet mauris risus nec dui enim quisque ut.
                            Feugiat commodo tempor, risus est morbi.
                            Ultricies nec justo a nisl lorem.
                            Cras eu aenean amet, neque in eu montes, sed.
                            In pellentesque porta sapien magna vel egestas aliquam porta sed.
                            Viverra amet cras nulla adipiscing justo, aliquam et posuere dapibus.
                            Consequat egestas est et vitae.
                            Nibh consequat, pharetra varius natoque augue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Navbar from "@/views/landing/Navbar";

    export default {
        name: "ParentOpportunity",
        components: {Navbar}
    }
</script>

<style scoped>
    .contentt {
        width: 100%;
        max-width: 1600px;
        margin: 0;
        height: auto;
    }

    .sectionn {
        box-sizing: border-box;
        margin: 0 0 0 80px;
        position: relative;
        max-width: 1520px;
        height: auto;
    }

    .boxx {
        box-sizing: border-box;
        margin: 0 5% 5% 2%;
        display: inline-block;
        position: absolute;
        min-height: 500px;
        width: 90%;
        background-repeat: no-repeat;
    }

    .scinImgx {
        position: absolute;
        width: 35%;
        height: auto;
        top: 80px;
        float: left;
        display: inline-block;
    }

    .ScienceDisplayNone {
        display: none;
    }

    .boxdivx {
        width: 55%;
        float: left;
        margin-left: 32%;
        margin-top: 5%;
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        height: auto;
    }

    .boxdivx p {
        font-style: normal;
        font-weight: 300;
        font-size: 22px;
        line-height: 160%;
        color: #4B5D68;
    }

    .boxdivx h3 {
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 130%;
        align-items: center;
        color: #212353;
        margin-bottom: 29px;
    }

    @media (max-width: 960px) {
        .contentt {
            width: 100%;
            max-width: 960px;
        }

        .sectionn {
            box-sizing: border-box;
            margin: 0 50px 0 50px;
            position: relative;
            max-width: 960px;
            height: auto;
        }

        .boxx {
            box-sizing: border-box;
            margin: 0;
            display: inline-block;
            position: absolute;
            min-height: 500px;
            width: 100%;
            background-repeat: no-repeat;
        }

        .boxdivx {
            width: 65%;
            margin-left: 37%;
            margin-top: 5%;
            padding-right: 2%;
        }

        .boxdivx p {
            font-size: 20px;
            line-height: 150%;
        }

        .boxdivx h3 {
            font-size: 22px;
        }

    }

    @media (max-width: 700px) {
        .contentt {
            width: 100%;
            max-width: 700px;
        }

        .sectionn {
            box-sizing: border-box;
            margin: 20px;
            max-width: 700px;

        }

        .scinImgx {
            width: 40%;
            margin-left: -20px;
        }

        .boxdivx {
            width: 55%;
            margin-left: 38%;
            margin-top: 5%;
        }

        .boxdivx p {
            font-size: 16px;
            line-height: 140%;
        }

        .boxdivx h3 {
            font-size: 20px;
        }

    }

    @media (max-width: 400px) {
        .contentt {
            width: 100%;
            max-width: 400px;
        }

        .sectionn {
            box-sizing: border-box;
            margin: 20px;
            max-width: 400px;

        }

        .ScienceDisplayNone {
            display: block;
            width: 80%;
            margin-left: 10%;
            margin-right: 10%;
        }

        .boxx {
            display: none;
        }

        .scinImgx {
            display: none;

        }

        .boxdivx {
            width: 80%;
            margin-left: 10%;
            margin-right: 10%;
        }

        .boxdivx p {
            font-size: 16px;
            line-height: 130%;
        }

        .boxdivx h3 {
            font-size: 20px;
        }

    }
</style>
