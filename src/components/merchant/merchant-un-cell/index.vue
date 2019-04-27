<template>
    <cell class="cell">
        <div class="section" @click="handleClick(merchant_item)">
            <image class="headshot" :src="src_default"></image>
            <div class="content1">
                <div class="content-title">
                    <text class="title">{{merchant_item.mercCnm || '' }}</text>
                </div>
                <text class="time-txt">{{merchant_item.time | filterTime}}</text>
            </div>
        </div>
    </cell>
</template>
<script>
    import source                   from 'utils/source.util'
    import FormatUtil               from 'utils/format.util'
    export default {
        props:{
            merchant_item: {default: {}},
            src_default: {default: source('person.png')}
        },
        filters: {
            filterTime (value) {
                return value ? FormatUtil.date('yyyy-MM-dd hh:mm', new Date(value)) : '';
            }
        },
        methods: {
            handleClick (item) {
                this.$emit('click', item);
            },
        }
    }
</script>
<style>
    cell {
        height: 140px;
        width: 750px;
        background-color: #ffffff;
        border-bottom-width: 1px;
        border-bottom-color: #e5e5e5;
    }
    .section {
        height: 140px;
        width: 750px;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .section-panel:active {
        background-color: #e5e5e5;
    }
    .headshot {
        margin-left: 30px;
        margin-top: 11px;
        width: 98px;
        height: 98px;
        border-radius: 49px;
    }
    .content1 {
        margin-left: 30px;
        flex-direction: column;
        width: 590px;
        height: 140px;
    }
    .content-title{
        flex-direction: row;
        width: 400px;
        height:40px;
        margin-top: 40px;
    }
    .title {
        font-size:28px;
        color:#5a5d62;
        text-align: left;
    }
    .wechatAuditStatus{
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .alipayAuditStatus {
        width: 30px;
        height: 30px;
        margin-left: 20px;
    }
    .time-txt {
        font-size:22px;
        color:#888888;;
        text-align:left;
    }
    .type{
        position: absolute;
        top: 40px;
        right: 30px;
        width: 200px;
    }
    .txt-time {
        text-align: right;
        font-size: 30px;
        color: #596d7a;
        width: 200px;
    }
</style>
