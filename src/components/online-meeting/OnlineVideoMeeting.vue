<template>
    <div class="online-video-meeting">
        <PreLoader v-if="isLoading"/>
        <template v-if="showWidget">
            <vue-jitsi-meet
                ref="jitsiRef"
                :domain="jitsiDomain"
                :options="jitsiOptions"
            ></vue-jitsi-meet>
        </template>
    </div>
</template>

<script>
    import { JitsiMeet } from '@mycure/vue-jitsi-meet';
    import PreLoader from '@/components/preloader/PreLoader';

    export default {
        components: {
            VueJitsiMeet: JitsiMeet,
            PreLoader
        },
        props: {
            meetRoomName: String
        },

        data() {
            return {
                jitsiDomain: 'tm.meet.socservice.kg',
                showWidget: false,
                isLoading: false
            }
        },

        computed: {
            userProfile() {
                return this.$store.state.account.profile;
            },

            jitsiOptions() {
                return {
                    roomName: this.meetRoomName,
                    noSSL: false,
                    userInfo: {
                        displayName: this.userProfile.user.lastName + ' ' + this.userProfile.user.firstName,
                    },
                    configOverwrite: {
                        enableNoisyMicDetection: false
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        SHOW_CHROME_EXTENSION_BANNER: false
                    },
                    onload: this.onIFrameLoad
                };
            },
        },

        methods: {
            launchJitsi() {
                this.isLoading = true;
                if (this.showWidget) {
                    this.$refs.jitsiRef.embedJitsiWidget();
                } else {
                    this.showWidget = true;
                }
            },

            onIFrameLoad() {
                this.$refs.jitsiRef.addEventListener('videoConferenceLeft', this.onEndOfVideoCall);
                this.isLoading = false;
            },

            onEndOfVideoCall() {
                this.deleteJitsiWidget();
                this.$emit('endOfVideoCall');
            },

            deleteJitsiWidget() {
                if (this.$refs.jitsiRef) {
                    this.$refs.jitsiRef.removeJitsiWidget();
                }
            }
        },

        beforeDestroy() {
            this.deleteJitsiWidget();
        },
    }
</script>

<style lang="scss" scoped>
    .online-video-meeting {
        height: 75vh;
        width: 1024px;
        margin: 0 auto;
    }
</style>
