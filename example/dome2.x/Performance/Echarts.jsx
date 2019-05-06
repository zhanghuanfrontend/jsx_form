import React from 'react';
import echarts from 'echarts';
import './index.less';

export default class EchartsArea extends React.Component {
  constructor() {
    super();
    this.state = {
      reduce: 0
    }
    this.echarts = React.createRef();
  }
  componentWillUnmount() {
    if (this.echarts.current) {
      this.echarts.current.parentNode.removeChild(this.echarts.current);
    }
  }
  // 渲染echarts
  renderEcharts = (data) => {
    const options = {
        legend: {
            data:['普通表单','JSXForm2.x','JSXForm1.x']
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        grid: {
          top: 30,
          left: 40,
          right: 0,
          bottom: 30
        },
        series: [
          {
            data: [],
            type: 'line',
            smooth: true,
            symbol: 'none',
            name: '普通表单'
          },
          {
            data: [],
            type: 'line',
            smooth: true,
            symbol: 'none',
            name: 'JSXForm2.x'
          },
          {
            data: [],
            type: 'line',
            smooth: true,
            symbol: 'none',
            name: 'JSXForm1.x'
          },
        ]
    }
    let total = 0
    data.forEach(item => {
      options.series.forEach((child, idx) => {
        child.data.push(item[idx])
      })
      options.xAxis.data.push(item[3])
      total += (item[2] - item[1]) / item[2]
    })
    this.setState({reduce : total / data.length})
    this.echartsObj = this.echartsObj || echarts.init(this.echarts.current);
    this.echartsObj.setOption(options || {}, true);
  };
  render() {
    const { reduce } = this.state
    return (
        <div className="echats-area">
            <div className="echarts" ref={this.echarts} />
            <div>JSXForm2.x至少平均节省：{Math.round(reduce * 10000) / 100}%</div>
        </div>
    );
  }
}
