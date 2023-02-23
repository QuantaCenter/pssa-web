<template>
    <div class="meeting-item">
        <img src="../assets/item.png" class="meeting-cover"/>
        <div class="meeting-name">
            <!--会议名-->
            {{item.name}}
        </div>
        <div class="status-box">

            <el-tag
                    v-for="item in statusList"
                    :key="item.label"
                    :type="item.type"
                    effect="plain">
                {{ item.label }}
            </el-tag>
        </div>
        <div class="info-box">
            <!--其它名称-->
            <div>
                <div class="info-item">
                    <i class="el-icon-price-tag"></i>
                    <span>{{item.level}}</span>
                </div>
                <div class="info-item">
                    <i class="el-icon-s-custom"></i>
                    <span>{{item.category}}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <i class="el-icon-s-data"></i>
                    <span>{{item.score}}学时</span>
                </div>
                <div class="info-item">
                    <i class="el-icon-location-outline"></i>
                    <span>{{item.position}}</span>
                </div>
            </div>
        </div>
        <div class="button-info-item">
            <i class="el-icon-time"></i>
            <span class="time">{{item.starttime}} 至 {{item.endtime}}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {MeetingState} from "../common/appdata";
    interface StatusItem{
        label: string;
        type: string;
    }
    export default {
        name: 'MeetingItem',
        props: {
            item: Object,
            itemType: {
                type: Number,
                default: 0
            },
        },
        computed: {
            statusList: function (this: Vue): Array<StatusItem> {
                let item = (this as any).item
                let type = item.type as any
                let state = item.state as any
                let itemType = (this as any).itemType
                let statusList: Array<StatusItem> = []
                if(parseInt(type) === 1){
                    statusList.push({
                        label: '必修',
                        type: 'danger'
                    })
                }else{
                    statusList.push({
                        label: '选修',
                        type: 'primary'
                    })
                }
                if(itemType == 1){
                    switch (state) {
                        case 0: statusList.push({
                            label: '未审核',
                            type: 'info'
                        }); break;
                        case 1: statusList.push({
                            label: '审核通过',
                            type: 'success'
                        }); break;
                        case 2: statusList.push({
                            label: '审核不通过',
                            type: 'danger'
                        }); break;
                    }
                }else{
                    switch (state) {
                        case 1: statusList.push({
                            label: (MeetingState as any)[state],
                            type: 'info'
                        }); break;
                        case 2: statusList.push({
                            label: (MeetingState as any)[state],
                            type: 'success'
                        }); break;
                        case 3: statusList.push({
                            label: (MeetingState as any)[state],
                            type: 'danger'
                        }); break;
                    }
                }
                return statusList
            }
        }
    }
</script>

<style scoped>
    .meeting-item{
        display: flex;
        flex-direction: column;
        width: 25rem;
        background: #fff;
        cursor: pointer;
    }

    .meeting-cover{
        width: 25rem;
        height: 12rem;
    }

    .meeting-name{
        margin: 5px 10px;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow:hidden;
        text-align: left;
        font-size: 1.4rem;
        font-weight: bold;
    }

    .status-box{
        text-align: right;
        padding: 0 10px;
    }

    .status-box>*{
        margin: 0 5px;
    }

    .info-box{
        display: flex;
        margin: 5px 10px 0;
    }

    .info-box>*{
        width: 50%;
    }

    .info-item{
        margin: 5px 0;
        font-size: 1.2rem;
        text-align: left;
    }

    .button-info-item>i, .info-item>i{
        color: #00488A;
        vertical-align: top;
    }

    .info-item>span{
        display: inline-block;
        margin-left: 5px;
        font-size: 1rem;
        text-overflow: ellipsis;
        white-space:nowrap;
        overflow:hidden;
        width: 150px;
        color: #666;
    }

    .button-info-item{
        margin: 5px 10px;
        font-size: 1.2rem;
        text-align: left;
    }

    .button-info-item>span{
        display: inline-block;
        margin-left: 5px;
        font-size: 1rem;
        color: #666;
    }
</style>