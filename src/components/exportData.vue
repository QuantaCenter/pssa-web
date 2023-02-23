<template>
  <el-button
    class="normal-btn"
    size="mini"
    @click.native.prevent="exportExcel"
  >
    导出为Excel表格
  </el-button>
</template>

<script>
  import XLSX from 'xlsx';
  export default {
    name: "exportData",
    props:{
      headOption: {
        type: Array,
        default: []
      },
      dataList: {
        type: Array,
        default: []
      },
      name: {
        type: String,
        default: 'default'
      },
      titles: {
        type: Array,
        default: []
      },
      type: {
        type: String,
        default: '1'
      }
    },
    data() {
      return {

      }
    },
    methods: {
      exportExcel() {
        //console.log(this.header)
        if(this.dataList.length === 0){
          this.$message.warning('目前还没有数据无法导出');
          return ;
        }
        //console.log(this.filename.length);
        let filename = "";
        if(this.type === '1'){
          filename = `报名情况-${new Date().getTime()}`;
        }else{
          filename =`出勤情况-${new Date().getTime()}`;
        }

        if(this.name.length > 30){
          this.name = this.name.slice(0, 30);
          this.$message.info('因活动名过长，导出时会删减')
        }
        const ws = this.createWs(this.dataList, this.headOption, this.titles);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, this.name);
        XLSX.writeFile(wb,  filename + ".xlsx")
      },
      createWs(data, fields, titles) {
        const ws = XLSX.utils.json_to_sheet(data, {
          header: fields
        });
        const range = XLSX.utils.decode_range(ws['!ref']);
        //console.log(range);
        //console.log(ws)
        for(let c = range.s.c; c <= range.e.c; c++){
          const header = XLSX.utils.encode_col(c) + '1';
          //console.log(header);
          //console.log(ws[header]);
          ws[header].v = titles[ c ];
        }
        return ws;
      }
    }
  }
</script>

<style scoped>

</style>
