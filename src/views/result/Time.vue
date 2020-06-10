<template>
  <div class="chart-content">
    <div class="left">
      <el-button type="success" @click="exportExcel">导出数据</el-button>

      <div id="wordcloud"></div>
      <div id="bar"></div>

    </div>
    <div class="right">
      <label>日期选择</label>
      <el-date-picker
          v-model="date"
          type="date"
          value-format="yyyy/M/d"
          @change="changeDate"
          format="yyyy 年 MM 月 d 日"
          :picker-options="pickerOptions"
          placeholder="选择日期">
      </el-date-picker>
      <div id="pie"></div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import {mapGetters} from "vuex";
  import dayjs from 'dayjs'
  import ExportJsonExcel from 'js-export-excel'

  require('echarts-wordcloud');
  export default {
    name: 'Time',
    data() {
      return {
        chart: null,
        data: [],
        date: '2020/1/28',
        pickerOptions: {
          disabledDate(time) {
            return dayjs(time).isBefore('2020/1/28') || dayjs(time).isAfter('2020/2/29');
          },
        }
      }
    },
    computed: {
      ...mapGetters([
        'taskData'
      ])
    },
    mounted() {
      this.initChartPie('2020/1/28')
      this.initChartBar()
      this.fetchWordCloudData().then(() => {
        this.initChartWordCloud();
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      changeDate(value){
        this.initChartPie(value)
      },
      initChartWordCloud() {
        this.chart = echarts.init(document.getElementById('wordcloud'));
        const option = {
          title: {
            text: '话题',
            x: 'center',
            textStyle: {
              fontSize: 30,
              color: '#333'
            }
          },
          backgroundColor: "#fff",
          tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
          },
          series: [
            {
              type: "wordCloud",
              //用来调整词之间的距离
              gridSize: 6,
              //用来调整字的大小范围
              // Text size range which the value in data will be mapped to.
              // Default to have minimum 12px and maximum 60px size.
              sizeRange: [14, 60],
              // Text rotation range and step in degree. Text will be rotated randomly in range [-90,                                                                             90] by rotationStep 45
              //用来调整词的旋转方向，，[0,0]--代表着没有角度，也就是词为水平方向，需要设置角度参考注释内容
              // rotationRange: [-45, 0, 45, 90],
              // rotationRange: [ 0,90],
              rotationRange: [0, 0],
              //随机生成字体颜色
              textStyle: {
                normal: {
                  color: function () {
                    return (
                      "rgb(" +
                      Math.round(Math.random() * 255) +
                      ", " +
                      Math.round(Math.random() * 255) +
                      ", " +
                      Math.round(Math.random() * 255) +
                      ")"
                    );
                  }
                }
              },
              //位置相关设置
              // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
              // Default to be put in the center and has 75% x 80% size.
              left: "center",
              top: "center",
              right: null,
              bottom: null,
              width: "75%",
              height: "80%",
              //数据
              data: this.data,
              animation: false,
              animationDurationUpdate: 2000
            },
          ],
          animation: false,
          animationDurationUpdate: 2000
        };
        this.chart.setOption(option);
      },
      fetchWordCloudData() {
        return fetch('./word.json').then(res=>res.json()).then(res=>{
          this.data = res.map((v, index)=>{
            let temp = {}
            for (const vKey in v) {
              temp = {
                name: vKey,
                value: v[vKey]
              }
            }
            return temp
          })
        })
      },
      handlePieData(date){
        const result = {}
        const datas = this.taskData
        for (let i = 1; i < datas.length; i++) {
          const item = datas[i]
          const isToday = item['field4'].includes(date)
          if (isToday) {
            let itemCount = result[item['field2']]
            if (itemCount !== undefined) {
              result[item['field2']] += 1
            } else {
              result[item['field2']] = 0
            }
          }
        }
        return result
      },
      initChartPie(date) {
        const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
        const countData = this.handlePieData(date)
        const data = emotions.map((emotion, index)=> {
          return {
            name: emotion,
            value: countData[index]
          }
        })
        this.chart = echarts.init(document.getElementById('pie'));
        const option = {
          color: ['#37a2da','#32c5e9','#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3','#8378ea'],
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show : true,

          },
          legend: {
            type:"scroll",
            orient: 'vertical',
            left:'10%',
            align:'left',
            top:'middle',
            textStyle: {
              color:'#8C8C8C'
            },
            height:150
          },
          series : [
            {
              name:'情感成分分析',
              type:'pie',
              radius : [0, 150],
              data: data
            }
          ]
        };

        this.chart.setOption(option);
      },
      initChartBar() {
        const data = [
          [],
        ];
        const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
        const colors = ['#37a2da','#32c5e9','#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3','#8378ea']
        for (let i = 0; i < 32; i++) {
          const date = dayjs('2020/1/28').add(i, 'day').format('YYYY/M/D')
          const countData = this.handlePieData(date)
          emotions.forEach((emotion, index)=> {
            data[0].push([date, emotion, countData[index]])
          })
        }

        const option = {
          backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#f7f8fa'
          }, {
            offset: 1,
            color: '#cdd0d5'
          }]),
          title: {
          },
          legend: {
          },
          tooltip : {
            trigger: 'item',
            formatter: "{c}"
          },
          xAxis: {
            type: 'time',
            name:'',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            boundaryGap: ['20%', '20%'],
            nameTextStyle: {
              fontSize:16,
              padding: [70, 0, 0,-90 ]    // 四个数字分别为上右下左与原位置距离
            }
          },
          yAxis: {
            type: 'category',
            name:'',
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            nameTextStyle: {
              fontSize:16,
              padding: [0, 0, 0,70 ]    // 四个数字分别为上右下左与原位置距离
            },
            scale: true
          },
          series: [{
            data: data[0],
            type: 'scatter',
            symbolSize: function (data) {
              return data[2] / 25;
            },
            label: {
              show:false,
              normal: {
                show: false,
                formatter: function (param) {
                  return param.data[2];
                },
                position: 'inside'
              }
            },
            itemStyle: {
              show:true,
              shadowBlur: 100,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: function (param) {
                const index = emotions.findIndex(f=> f===param.name)
                return new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: colors[index]
                }, {
                  offset: 1,
                  color: colors[index+1]
                }])
              }
            }
          }]
        };
        this.chart = echarts.init(document.getElementById('bar'));

        this.chart.setOption(option);
      },
      exportExcel(){
        const sheetData = []
        const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
        for (let i = 0; i < 32; i++) {
          const date = dayjs('2020/1/28').add(i, 'day').format('YYYY/M/D')
          const countData = this.handlePieData(date)
          const count = Object.values(countData).reduce((cur, pre)=>{
            return cur + pre
          }, 0)
          sheetData[i] = []
          emotions.forEach((emotion, index)=> {
            sheetData[i][0] = date
            const rate = ((countData[index] / count)*100).toFixed(2)
            sheetData[i][index + 1] = countData[index]+`(${rate}%)`
          })
        }
        console.log(sheetData);
        const option = {}
        option.fileName = 'excel'

        option.datas = [
          {
            sheetData: sheetData,
            sheetHeader: ['日期','冷静','积极','焦虑','恐惧','愤怒(质疑)'],
            columnWidths: [18, 18]
          }
        ]
        const toExcel = new ExportJsonExcel(option) // new
        toExcel.saveExcel() // 保存
      }
    },
  }
</script>

<style lang="scss" scoped>
  .chart-content{
    display: flex;
    overflow: auto;
    .left{
      display: flex;
      flex-direction: column;
    }
    .right{
      text-align: center;
      .el-date-editor{
        margin-top: 10px;
      }
    }
  }
  #wordcloud {
    width: 800px;
    height: 400px;
  }
  #pie{
    width: 800px;
    height: 400px;
  }
  #bar{
    width: 900px;
    height: 400px;
  }
</style>
