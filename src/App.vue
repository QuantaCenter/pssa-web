<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    .bg-page{
        background: url("./assets/bg.png") no-repeat;
        background-size: cover;
        width: 100%;
        height: 100vh;
    }
</style>
