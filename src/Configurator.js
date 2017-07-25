import React, {Component} from 'react'
import _ from 'lodash'
import {observer} from 'mobx-react'
import {extendObservable} from 'mobx'
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


class Store {
  constructor(){
    extendObservable(this, {
      jsonstatUrl: 'http://data.ssb.no/api/v0/dataset/85430.json?lang=en',
      dataSet: undefined,
      chartType: 'bar',
      groupDimension: '',
      dataDimension: '',
      get dimensions () {
        return this.dataSet ? this.dataSet.id : []
      }
    })
  }
}


const Configurator = observer(class Configurator extends Component {
  constructor(){
    super()
    this._refs = {}
    this.state = {}
  }

  loadData(){
    const {store} = this.props
    utils.getDataSet(store.jsonstatUrl)
      .then((dataSet) => {
        store.dataSet = dataSet
      })
  }

  renderChart(){
    const {store} = this.props
    console.log(store)

    if(!(store.chartType && store.groupDimension && store.dataDimension)){
      console.log('not all fields are selected')
      console.log(store.chartType , store.groupDimension , store.dataDimension)
      return
    }
    const chartCanvas = this._refs.chartCanvas

    const {chartDataSets, labels} = prepareData(store.dataSet, store.groupDimension, store.dataDimension)
    renderChart(chartCanvas, chartDataSets, labels, store.chartType)
  }

  render(){
    const {store} = this.props

    return <div>

      <label>JSON-stat URL
        <input type="text" value={store.jsonstatUrl} onChange={(e) => store.jsonstatUrl = e.target.value}/>
      </label>

      <button onClick={() => this.loadData()}>Load data</button>

      <label>Chart-Typ
        <select value={store.chartType} onChange={e => store.chartType = e.target.value} disabled={!store.dataSet}>
          <option>bar</option>
          <option>horizontalBar</option>
          <option>line</option>
        </select>
      </label>}

      <label>Group data by
        <select value={store.groupDimension} onChange={e => store.groupDimension = e.target.value} disabled={!store.dataSet}>
          {store.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
        </select>
      </label>

      <label>Category label
        <select value={store.dataDimension} onChange={e => store.dataDimension = e.target.value} disabled={!store.dataSet}>
          {store.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
        </select>
      </label>}

      <button onClick={() => this.renderChart()}>Render chart</button>
      <br />
      <canvas ref={canvas => {
                this._refs.chartCanvas = canvas
              }}
      />

    </div>
  }
})


const store = new Store();
export default () => <Configurator store={store} />
