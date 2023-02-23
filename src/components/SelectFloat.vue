<template>
    <el-dialog :title="title" :visible.sync="visible" width="500">
        <div class="select-header">
            <el-input placeholder="输入查找" v-model="name" class="selected">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-select v-model="select" placeholder="请选择单位">
                <el-option v-for="(item) in selectDept" :key="item"
                           :label="item" :value="item"></el-option>
            </el-select>
        </div>

    </el-dialog>
</template>

<script>
    import {selectDept} from '../common/appdata'
    export default {
        name: "SelectFloat",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '人员选择'
            },
            callback: Function,
        },
        data: function () {
            return {
                name: '',
                select: '全部',
                selectDept
            }
        }
    }
</script>

<style scoped>
    .select-header{
        display: flex;
        justify-content: space-between;
    }
    .selected{
        width: 250px;
    }
</style>