<template>
    <div class="detail-container">
        <div class="detail-header">
            <div>会议详情</div>
            <div>
                <slot name="btn-group"></slot>
            </div>
        </div>
        <div class="info-container">
            <div class="detail-info"></div>
            <div class="meeting-member"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DetailContainer"
    }
</script>

<style scoped>

</style>