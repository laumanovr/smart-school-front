<template>
    <div class="super-admin-video-material">
        <VideoInstruction
            :headTitle="'Видео материалы'"
            :role="'minEducation'"
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
