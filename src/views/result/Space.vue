<template>
  <div style="display: flex;flex-direction: column">
    <div class="filter">
      <label>日期选择</label>
      <el-date-picker
          v-model="date"
          type="date"
          value-format="yyyy/M/d"
          format="yyyy 年 MM 月 d 日"
          :picker-options="pickerOptions"
          placeholder="选择日期">
      </el-date-picker>
      <el-select v-model="emotion">
        <el-option :value="String(index)" :label="emotion"
                   v-for="(emotion,index) in emotions" :key="emotion">{{emotion}}</el-option>
      </el-select>
      <el-button @click="query">查询</el-button>
      <el-button type="success" @click="exportExcel">导出数据</el-button>
    </div>
    <div style="display: flex">
      <div id="space"></div>
      <div id="gauge"></div>
    </div>
  </div>
</template>

<script>
  import echarts from "echarts";
  import china from 'echarts/map/json/china.json'
  import {mapGetters} from "vuex";
  import dayjs from "dayjs";
  import ExportJsonExcel from "js-export-excel";
  // require('./china')
  echarts.registerMap('china', china)

  export default {
    name: 'Space',
    data() {
      return {
        data:  [
          {
          name: "南海诸岛",
          value: 0
          },
          {
            name: '北京',
            value: 54
          },
          {
            name: '天津',
            value: 13
          },
          {
            name: '上海',
            value: 40
          },
          {
            name: '重庆',
            value: 75
          },
          {
            name: '河北',
            value: 13
          },
          {
            name: '河南',
            value: 83
          },
          {
            name: '云南',
            value: 11
          },
          {
            name: '辽宁',
            value: 19
          },
          {
            name: '黑龙江',
            value: 15
          },
          {
            name: '湖南',
            value: 69
          },
          {
            name: '安徽',
            value: 60
          },
          {
            name: '山东',
            value: 39
          },
          {
            name: '新疆',
            value: 4
          },
          {
            name: '江苏',
            value: 31
          },
          {
            name: '浙江',
            value: 104
          },
          {
            name: '江西',
            value: 36
          },
          {
            name: '湖北',
            value: 1052
          },
          {
            name: '广西',
            value: 33
          },
          {
            name: '甘肃',
            value: 7
          },
          {
            name: '山西',
            value: 9
          },
          {
            name: '内蒙古',
            value: 7
          },
          {
            name: '陕西',
            value: 22
          },
          {
            name: '吉林',
            value: 4
          },
          {
            name: '福建',
            value: 18
          },
          {
            name: '贵州',
            value: 5
          },
          {
            name: '广东',
            value: 98
          },
          {
            name: '青海',
            value: 1
          },
          {
            name: '西藏',
            value: 0
          },
          {
            name: '四川',
            value: 44
          },
          {
            name: '宁夏',
            value: 4
          },
          {
            name: '海南',
            value: 22
          },
          {
            name: '台湾',
            value: 3
          },
          {
            name: '香港',
            value: 5
          },
          {
            name: '澳门',
            value: 5
          }
        ],
        date: '2020/1/28',
        pickerOptions: {
          disabledDate(time) {
            return dayjs(time).isBefore('2020/1/28') || dayjs(time).isAfter('2020/2/29');
          },
        },
        emotions: ['冷静','积极','焦虑','恐惧','愤怒(质疑)'],
        emotion: '0'
      }
    },
    computed: {
      ...mapGetters([
        'taskData'
      ])
    },
    mounted() {
      this.initChart(this.date, this.emotion)
      this.initGauge(this.date, this.emotion)
    },
    methods: {
      handlePieData(date, emotion){
        const result = {}
        const datas = this.taskData
        for (let i = 1; i < datas.length; i++) {
          const item = datas[i]
          const isToday = item['field4'].includes(date)
          if (isToday && item['field2'] === emotion) {
            let area = result[item['field5']]
            if (area !== undefined) {
              result[item['field5']] += 1
            } else {
              result[item['field5']] = 0
            }
          }
        }
        return result
      },
      handleMapData(){

      },
      initChart(date, emotion) {
        const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
        const countData = this.handlePieData(date, emotion)
        const data = Object.keys(countData).map((province, index)=> {
          return {
            name: province,
            value: countData[province]
          }
        })
        const chart = echarts.init(document.getElementById('space'));
        const option = {
          tooltip: {
            // triggerOn: "click",
            formatter: function(e, t, n) {
              return e.seriesName + "<br />" + e.name + "：" + e.value
            }
          },
          backgroundColor: '#fff',
          visualMap: {
            min: 0,
            max: 1000,
            left: 26,
            bottom: 40,
            showLabel: !0,
            text: ["高", "低"],
            pieces: [{
              gt: 200,
              label: "> 200 ",
              color: "#7f1100"
            }, {
              gte: 100,
              lte: 200,
              label: "100 - 200 ",
              color: "#ff5428"
            }, {
              gte: 50,
              lt: 100,
              label: "50 - 100",
              color: "#ff8c71"
            }, {
              gt: 1,
              lt: 50,
              label: "1 - 50",
              color: "#ffd768"
            }, {
              value: 0,
              color: "#ffffff"
            }],
            show: !0
          },
          geo: {
            map: "china",
            roam: !1,
            scaleLimit: {
              min: 1,
              max: 2
            },
            zoom: 1.23,
            top: 120,
            label: {
              normal: {
                show: !0,
                fontSize: "14",
                color: "rgba(0,0,0,0.7)"
              }
            },
            itemStyle: {
              normal: {
                //shadowBlur: 50,
                //shadowColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: "rgba(0, 0, 0, 0.2)"
              },
              emphasis: {
                areaColor: "#f2d5ad",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                borderWidth: 0
              }
            }
          },
          series: [{
            name: "情绪指数",
            type: "map",
            geoIndex: 0,
            data: data
          }]
        };
        chart.setOption(option);
      },
      initGauge(date, emotion){
        const chart = echarts.init(document.getElementById('gauge'));
        const countData = this.handlePieData(date, emotion)
        const data = Object.keys(countData).map((province, index)=> {
          return {
            name: province,
            value: countData[province]
          }
        })
        const count = data.reduce((cur, pre)=>{
          return cur + pre.value
        }, 0)
        const average = count / data.length
        console.log(average);
        var datas = {
          value: average,
          title: "全国平均情绪指数",
          type: 1,
          radiusType: 1
        };

        var fontColor = "#ff5428";
        var seriesName = "";
        let noramlSize = 12;
        let state = "";
        let center = ["50%", "70%"];
        let wqradius,
          nqradius,
          kdradius;

        wqradius = "100%";
        nqradius = "90%";
        kdradius = "90%";
        const colors = ['#37a2da','#32c5e9','#9fe6b8','#ffdb5c','#ff9f7f','#fb7293','#e7bcf3','#8378ea']

        let wqColor = "rgba(80, 152, 237,0.9)";
        let nqColor = [
          [datas.value / 10, "#ff5428"],
          [1, "#e6e6e6"]
        ]

        const option = {
          title: {
            show: true,
            x: "center",
            bottom: "0%",
            text: datas.title,
            textStyle: {
              fontWeight: "700",
              fontSize: 16,
              color: fontColor
            }
          },
          tooltip: {
            show: false
          },
          series: [{
            name: "刻度文字",
            type: "gauge",
            radius: kdradius,
            center: center,
            startAngle: 180,
            endAngle: 0,
            z: 7,
            splitNumber: 10,
            min: 0,
            max: 100,
            axisTick: {
              show: true,
              lineStyle: {
                color: "#ffffff",
                width: 1
              },
              length: 8,
              splitNumber: 3
            },
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 25,
                opacity: 0
              }
            },
            axisLabel: {
              fontSize: noramlSize,
              color: fontColor,
              formatter: function(v) {
                var str = '';
                console.log(v);
                switch (v) {
                  case 0:
                    str = '0';
                    break;
                  case 10:
                    str = '低';
                    break;
                  case 50:
                    str = '中';
                    break;
                  case 90:
                    str = '高';
                    break;
                  case 100:
                    str = '100';
                    break;
                }
                return str;
              },
            },
            pointer: {
              show: false
            },
            detail: {
              show: false
            }
          },
            {
              name: "指针",
              type: "gauge",
              z: 9,
              radius: "90%",
              startAngle: 180,
              endAngle: 0,
              center: center,
              axisLine: {
                lineStyle: {
                  width: 0
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: false
              },
              axisLabel: {
                show: false
              },
              min: 0,
              max: 100,
              pointer: {
                show: true,
                width: 10,
                length: "60%"
              },
              itemStyle: {
                normal: {
                  color: wqColor
                }
              },
              detail: {
                show: true,
                offsetCenter: [0, "40%"],
                formatter: function(v) {
                  return "{value|" + (average.toFixed(2)) + "} ";
                },
                rich: {
                  value: {
                    fontSize: 25,
                    lineHeight: 10,
                    color: "#ff5428",
                    fontWeight: "700"
                  },
                  company: {
                    fontSize: 16,
                    lineHeight: 20,
                    color: "#ff5428"
                  }
                }
              },
              data: [datas.value]
            },
            {
              name: "内层盘",
              type: "gauge",
              z: 6,
              radius: nqradius,
              startAngle: 180,
              endAngle: 0,
              center: center,
              axisLine: {
                lineStyle: {
                  color: nqColor,
                  width: 25,
                  opacity: 0.9
                }
              },
              splitNumber: 6,
              min: 0,
              max: 5,
              axisTick: {
                show: false
              },

              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },

              detail: {
                show: 0
              }
            }
          ]
        };
        chart.setOption(option);
      },
      query(){
        console.log(this.date, this.emotion);
        this.initChart(this.date, this.emotion)
        this.initGauge(this.date, this.emotion)
      },
      exportExcel(){
        const sheetData = []
        const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
        const countData = this.handlePieData(this.date, this.emotion)
        const count = Object.values(countData).reduce((cur, pre)=>{
          return cur + pre
        }, 0)
        const provinces = Object.keys(countData)
        for (let j = 0; j < 2; j++) {
          sheetData[j] = []
          for (let i = 0; i < provinces.length; i++) {
            if (j === 0) {
              sheetData[j][i + 1] = countData[provinces[i]]
            } else {
              const rate = ((countData[provinces[i]] / count)*100).toFixed(2)
              sheetData[j][i + 1] = `${rate}%`
            }
          }
        }

        console.log(sheetData);
        const option = {}
        option.fileName = this.date+emotions[this.emotion]

        option.datas = [
          {
            sheetData: sheetData,
            sheetHeader: provinces,
            // columnWidths: provinces.map(v=>10)
          }
        ]
        const toExcel = new ExportJsonExcel(option) // new
        toExcel.saveExcel() // 保存
      }
    },
  }
</script>

<style lang="scss" scoped>
  #space {
    width: 800px;
    height: 700px;
  }
  #gauge{
    width: 400px;
    height: 300px;
  }
  .filter{

  }
</style>
