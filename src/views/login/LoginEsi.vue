<template>
    <div class="esia">
        <PreLoader v-if="isLoading"/>
        <h4>ESIA</h4>
        <!--<button @click="fetchUserInfo">get-user</button>-->
    </div>
</template>

<script>
    import PreLoader from '@/components/preloader/PreLoader';
    import EsiaService from '@/_services/esia.service';

    export default {
        components: {
            PreLoader
        },
        data() {
            return {
                isLoading: false,
            }
        },
        created() {
            EsiaService.getAccessToken(this.$route.query.code).then((res) => {
                debugger
                this.fetchUserInfo(res.access_token)
            })
        },
        methods: {
            fetchUserInfo(token) {
                EsiaService.getUserInfo(token).then((res) => {
                    debugger
                })
            }
        }
    }
</script>
