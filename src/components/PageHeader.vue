<template>
    <div class="page-header">
        <h3>{{title}}</h3>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "PageHeader",
        props: {
            title: String,
        }
    }
</script>

<style scoped>
    .page-header{
        background: #fff;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 100;
    }
</style>