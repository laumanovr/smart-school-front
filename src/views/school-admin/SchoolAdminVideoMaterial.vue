<template>
    <div class="school-admin-video-material">
        <VideoInstruction
            :headTitle="'Видео инструкции по Умной Школе для админа'"
            :role="'ROLE_ADMIN'"
        />
    </div>
</template>

<script>
    import VideoInstruction from '@/components/video-instruction/VideoInstruction';
    export default {
        components: {
            VideoInstruction
        }
    }
</script>
