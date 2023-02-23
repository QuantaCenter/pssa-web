<template>
    <!--用于父级路由 临时保存子页面信息-->
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
</template>

<script lang="ts">
    export default {
        name: "SubPageContainer"
    }
</script>

<style scoped>

</style>