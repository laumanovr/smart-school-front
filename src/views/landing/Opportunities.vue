<template>
    <div class="content">
        <Navbar/>
        <img class="Notebook2" src="@/assets/images/landing/Notebook2.png">
        <MainOpportunities/>
    </div>
</template>

<script>
    import Navbar from "@/views/landing/Navbar";
    import MainOpportunities from "@/views/landing/MainOpportunities";

    export default {
        name: "Opportunities",
        components: {
            MainOpportunities,
            Navbar,
        }
    }
</script>

<style scoped>
    .content {
        margin: 0;
        height: auto;
        box-sizing: border-box;
    }

    .Notebook2 {
        margin-top: 40px;
        display: block;
        margin-left: -110px;
        float: right;
        position: relative;
    }
</style>
