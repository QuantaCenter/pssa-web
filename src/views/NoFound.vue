<template>
    <div class="bg-page">
        <div class="tips">
            您要访问的页面并不存在哦！即将放回上一页
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class NoFound extends Vue{
        mounted(){
            let timer = setTimeout(() => {
                this.$router.back()
            }, 2000)

            this.$once('hook:beforeDestroy', function () {
                clearTimeout(timer)
            })
        }

    }
</script>

<style scoped>
    .tips{
        color: #004593;
        font-size: 1.5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        -webkit-transform: translate3d(-50%, -50%, 0);
        -moz-transform: translate3d(-50%, -50%, 0);
        -ms-transform: translate3d(-50%, -50%, 0);
        -o-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
    }
</style>