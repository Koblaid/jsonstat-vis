import React, {Component} from 'react'
import _ from 'lodash'
import { Tab, Table } from 'semantic-ui-react'
import {observer} from 'mobx-react'
import {extendObservable} from 'mobx'
import chartJs from 'chart.js'

import * as utils from './utils'


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


class DataSet {
  constructor(){
    extendObservable(this, {
      ds: undefined,
      groupDimension: '',
      dataDimension: '',

      get isLoaded(){
        return Boolean(this.ds)
      },

      get dimensions () {
        return this.ds ? this.ds.id : []
      },

      get groupedData(){
        return utils.groupBy(this.ds, this.groupDimension, this.dataDimension)
      },

      get sortedKeys(){
        const sortedKeys = Object.keys(this.groupedData)
        sortedKeys.sort()
        return sortedKeys
      },

      get labels(){
        return this.sortedKeys.map(key => this.groupedData[key].label)
      },

      get columns(){
        return _.map(this.ds.Dimension(this.dataDimension).id, dimensionValue => {
          return {
            label: this.ds.Dimension(this.dataDimension).Category(dimensionValue).label,
            data: this.sortedKeys.map(key => this.groupedData[key].values[dimensionValue]),
          }
        })
      },

      getTable(){
        if(!this.ds || !this.groupDimension || !this.dataDimension){
          return {}
        }
        const columnIds = this.ds.Dimension(this.dataDimension).id
        const header = [''].concat(_.map(columnIds, dimensionValue => {
          return this.ds.Dimension(this.dataDimension).Category(dimensionValue).label || dimensionValue
        }))

        const body = this.sortedKeys.map(key => {
          return [this.groupedData[key].label].concat(
            columnIds.map(colId => this.groupedData[key].values[colId])
          )
        })

        return {
          header,
          body,
        }
      }
    })
  }
}


class Store {
  constructor(){
    extendObservable(this, {
      jsonstatUrl: 'http://data.ssb.no/api/v0/dataset/85430.json?lang=en',
      dataSet: new DataSet(),
      chartType: 'bar',
      get isReadyToRender(){
        return store.chartType && this.dataSet.groupDimension && store.dataSet.dataDimension
      },
    })
  }
}


const DataTable = observer(({store}) => {
  const {header, body} = store.getTable()
  if(!header || !body){
    return null
  }

  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          {header.map((colHeader, index) => <Table.HeaderCell key={index}>{colHeader}</Table.HeaderCell>)}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {body.map((row, index1) => {
          return <Table.Row key={index1}>
              {row.map((column, index2) => <Table.Cell key={index2}>{column}</Table.Cell>)}
          </Table.Row>
        })}
      </Table.Body>
    </Table>
  )
})


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
    return <div>
      <label>Chart-Typ
        <select value={store.chartType} onChange={e => store.chartType = e.target.value} disabled={!store.dataSet.isLoaded}>
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
        store.dataSet.ds = dataSet
      })
  }



  render(){
    const {store} = this.props

    return <div>

      <label>JSON-stat URL
        <input type="text" value={store.jsonstatUrl} onChange={(e) => store.jsonstatUrl = e.target.value}/>
      </label>

      <button onClick={() => this.loadData()}>Load data</button>

      <label>Group data by
        <select value={store.dataSet.groupDimension} onChange={e => store.dataSet.groupDimension = e.target.value} disabled={!store.dataSet.isLoaded}>
          {store.dataSet.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
        </select>
      </label>

      <label>Category label
        <select value={store.dataSet.dataDimension} onChange={e => store.dataSet.dataDimension = e.target.value} disabled={!store.dataSet.isLoaded}>
          {store.dataSet.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
        </select>
      </label>}

      <Tab panes={[
        { menuItem: 'Data', render: () => <Tab.Pane><DataTable store={store.dataSet}/></Tab.Pane> },
        { menuItem: 'Chart', render: () => <Tab.Pane><Chart store={store} /></Tab.Pane> },
      ]} />

    </div>
  }
})


const store = new Store();
export default () => <Configurator store={store} />
