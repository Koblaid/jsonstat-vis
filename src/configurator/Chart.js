import React, {Component} from 'react'
import {observer} from 'mobx-react'
import chartJs from 'chart.js'
import * as utils from '../utils'


const renderChart = (ctx, chartDataSets, labels, chartType) => {
  new chartJs(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: chartDataSets,
    },
    options: {
      responsive: true,
      title:{
        display:true,
        text:'Chart.js Line Chart'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Amount'
          }
        }]
      }
    }
  })
}


const Chart = observer(class Chart extends Component {
  renderChart(){
    const {store} = this.props

    if(!(store.isReadyToRender)){
      console.log('not all fields are selected')
      console.log(store.chartType , store.dataSet.groupDimension , store.dataSet.dataDimension)
      return
    }
    const chartCanvas = this.chartCanvas

    const chartDataSets = store.dataSet.columns.map(column => {
      return {
        label: column.label,
        data: column.data,
        backgroundColor: utils.getNextColor(),
        borderWidth: 1,
        fill: false,
      }
    })
    const labels = store.dataSet.labels

    renderChart(chartCanvas, chartDataSets, labels, store.chartType)
  }

  render(){
    const {store} = this.props

    return <div>
      <label>Chart-Typ
        <select value={store.chartType} onChange={e => store.setChartType(e.target.value)} disabled={!store.dataSet.isLoaded}>
          <option>bar</option>
          <option>horizontalBar</option>
          <option>line</option>
        </select>
      </label>}

      <button onClick={() => this.renderChart()}>Render chart</button>
      <br />
      <canvas ref={canvas => this.chartCanvas = canvas} />
    </div>
  }

})


export default Chart
