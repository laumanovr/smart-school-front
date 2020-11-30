<template>
    <div>
        <Navbar/>
        <div class="aboutContent">
            <div class="AboutImgDisplayNone">
                <img src="@/assets/images/landing/AboutsImg.png">
            </div>
            <div class="AboutProject">
                <h3>
                    Проект “Умная Школа”
                </h3>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mi, felis in id lobortis quis dignissim.
                    Ipsum nisl amet mauris risus nec dui enim quisque ut.
                    Feugiat commodo tempor, risus est morbi. Ultricies nec justo a nisl lorem.
                    Cras eu aenean amet, neque in eu montes, sed.
                    In pellentesque porta sapien magna vel egestas aliquam porta sed.
                    Viverra amet cras nulla adipiscing justo, aliquam et posuere dapibus.
                    Consequat egestas est et vitae.
                    Nibh consequat, pharetra varius natoque augue.
                </p>

            </div>
            <div class="Img">
                <img src="@/assets/images/landing/AboutsImg.png">
            </div>
            <img class="aboutComponentsCopyBookImg" src="@/assets/images/landing/aboutComponentsCopyBook.png"/>
        </div>
    </div>
</template>

<script>
    import Navbar from "@/views/landing/Navbar";
    export default {
        name: "aboutProject",
        components: {Navbar},
    }
</script>

<style scoped>
    .aboutContent {
        box-sizing: border-box;
        width: 100%;
        max-width: 1400px;
        padding: 0 50px 0 80px;
        position: relative;
        height: auto;
    }

    .aboutContent .AboutImgDisplayNone {
        display: none;
    }

    .AboutProject {
        margin-top: 3%;
        display: inline-block;
        width: 60%;
        box-sizing: border-box;
    }

    .AboutProject h3 {
        font-style: normal;
        font-weight: 800;
        font-size: 27px;
        line-height: 150%;
        display: flex;
        align-items: center;
        color: #212353;
        margin-bottom: 30px;
    }

    .AboutProject p {
        font-style: normal;
        font-weight: 300;
        font-size: 21px;
        line-height: 160%;
        color: #4B5D68;
    }

    .aboutContent .Img {
        box-sizing: border-box;
        display: inline-block;
        float: right;
        width: 40%;
        padding-left: 5%;
    }

    .aboutContent .aboutComponentsCopyBookImg {
        margin-top: 50px;
        margin-left: -80px;
    }

    @media (max-width: 992px) {
        .AboutProject {
            margin-top: 0;
        }

        .aboutContent .Img {
            margin-top: 10%;
        }
    }

    @media (max-width: 700px) {
        .aboutContent {
            position: relative;
            width: auto;
            height: auto;
        }

        .aboutContent .AboutImgDisplayNone {
            box-sizing: border-box;
            display: block;
            width: 80%;
            padding: 5%;
        }

        .AboutProject {
            display: inline-block;
            width: 100%;
        }

        .aboutContent .Img {
            display: none;
        }
    }

    @media (max-width: 400px) {
        .aboutContent {
            padding: 5%;
            position: relative;
            width: 100%;
            height: auto;
        }

        .aboutContent .AboutImgDisplayNone {
            display: block;
            width: 90%;
        }

        .AboutProject {
            display: inline-block;
            width: 100%;
            padding: 2%;
        }

        .content .Img {
            display: none;
        }
    }
</style>
