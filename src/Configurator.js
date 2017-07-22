import React, {Component} from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'


const prepareData = (dataSet, groupDimension, dataDimension) => {
  const groupedData = utils.groupBy(dataSet, groupDimension, dataDimension)
  console.log(dataSet, groupDimension, dataDimension)
  console.log(groupedData)

  const sortedKeys = Object.keys(groupedData)
  sortedKeys.sort()

  const chartDataSets = _.map(dataSet.Dimension(dataDimension).id, dimensionValue => {
    return {
      label: dataSet.Dimension(dataDimension).Category(dimensionValue).label,
      data: sortedKeys.map(key => groupedData[key].values[dimensionValue]),
      backgroundColor: utils.getNextColor(),
      borderWidth: 1,
      fill: false,
    }
  })
  const labels = sortedKeys.map(key => groupedData[key].label)

  return {chartDataSets, labels}
}


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

const getDimensions = dataSet => dataSet ? dataSet.id : []


export default class Configurator extends Component {
  constructor(){
    super()
    this._refs = {}
    this.state = {}
  }

  loadData(){
    console.log('loaddata')
    utils.getDataSet(this._refs.jsonstatUrlRef.value)
      .then((dataSet) => {
        this.setState({dataSet})
      })
  }

  updateForm(){
    console.log(this)

    this.setState({
      ...this.state,
      chartType: this._refs.chartType.value,
      groupDimension: this._refs.groupProperty.value,
      dataDimension: this._refs.dataDimension.value,
    })

    if(!(this.state.chartType && this.state.groupDimension && this.state.dataDimension)){
      return
    }
    const chartCanvas = this._refs.chartCanvas

    const {chartDataSets, labels} = prepareData(this.state.dataSet, this.state.groupDimension, this.state.dataDimension)
    renderChart(chartCanvas, chartDataSets, labels, this.state.chartType)
  }

  render(){
    const {dataSet, groupDimension} = this.state
    dataSet && console.log(dataSet)
    return <div>

      <label>JSON-stat URL
        <input type="text" ref={el => this._refs.jsonstatUrlRef = el} defaultValue="http://data.ssb.no/api/v0/dataset/85430.json?lang=en"/>
      </label>

      <button onClick={() => this.loadData()}>Load data</button>

      <label>Chart-Typ
        <select onChange={() => this.updateForm()} ref={el => this._refs.chartType = el} disabled={!dataSet}>
          <option>bar</option>
          <option>horizontalBar</option>
          <option>line</option>
        </select>
      </label>}

      <label>Group data by
        <select onChange={() => this.updateForm()} ref={el => this._refs.groupProperty = el} disabled={!dataSet}>
          {getDimensions(dataSet).map((dimension, i) => <option key={i}>{dimension}</option>)}
        </select>
      </label>

      <label>Category label
        <select onChange={() => this.updateForm()} ref={el => this._refs.dataDimension = el} disabled={!groupDimension}>
          {getDimensions(dataSet).map((dimension, i) => <option key={i} disabled={dimension === groupDimension}>{dimension}</option>)}
        </select>
      </label>}

      <canvas ref={canvas => {
                this._refs.chartCanvas = canvas
              }}
      />

    </div>
  }
}
