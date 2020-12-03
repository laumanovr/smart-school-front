<template>
    <div class="instructor-video-material">
        <VideoInstruction
            :headTitle="'Видео инструкции по Умной Школе для учителя'"
            :role="'ROLE_INSTRUCTOR'"
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
