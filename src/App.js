import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import chartJs from 'chart.js'
import _ from 'lodash'

import * as utils from './utils'
import Chart1 from './Chart1'


const chart2 = (ctx, dataSet) => {
  // TODO: https://github.com/chartjs/Chart.js/issues/1852

  const groupedData = utils.groupBy(dataSet, 'age', 'sex', {concept: 'POP'}, {age: 'T'})
  const sortedKeys = utils.getSortedKeysByInt(groupedData)
  const data = sortedKeys.map(key => (groupedData[key].values.F / groupedData[key].values.M) - 1)

  const horizontalBarChartData = {
    labels: sortedKeys.map(key => groupedData[key].label),
    datasets: [{

      backgroundColor: 'red',
      borderColor: 'yellow',
      borderWidth: 1,
      data,
    }],
  };

  new chartJs(ctx, {
    type: 'horizontalBar',
    data: horizontalBarChartData,
    options: {
      title: {
        display: true,
        text: 'Sex ratio by age'
      },
      legend: {
        display: false,
      },
    }
  });
}


const chart3 = (ctx, dataSet) => {
  const groupedData = utils.groupBy(dataSet, 'Region', 'Arealtype')
  const sortedKeys = _(groupedData)
    .keys()
    .sortBy(key => dataSet.Dimension('Region').Category(key).label)
    .value()

  const colors = {
    1: utils.chartColors.green,
    2: utils.chartColors.blue,
  }

  const chartDataSets = _.map(['1', '2'], (valueType, index) => {
    return {
      label: dataSet.Dimension('Arealtype').Category(valueType).label,
      data: sortedKeys.map(key => groupedData[key].values[valueType]),
      backgroundColor: colors[index],
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  })


  new chartJs(ctx, {
    type: 'horizontalBar',
    data: {
      labels: sortedKeys.map(key => groupedData[key].label),
      datasets: chartDataSets,
    },
    options: {
      title: {
        display: true,
        text: 'Land / Water area by region'
      },
      legend: {
        display: true
      },
    }
  });
}

class App extends Component {
  componentDidMount() {
    utils.getDataSet('https://json-stat.org/samples/canada.json').then(dataSet => {
      chart2(this.chartCanvas2, dataSet)
    })

    utils.getDataSet('http://data.ssb.no/api/v0/dataset/85430.json?lang=en').then(dataSet => {
      chart3(this.chartCanvas3, dataSet)
    })
  }

  render() {
    return (
      <div className="App">
        <Chart1 />
        <canvas
          ref={canvas => {
            this.chartCanvas2 = canvas
          }}
        />
        <canvas height="1000"
          ref={canvas => {
            this.chartCanvas3 = canvas
          }}
        />
      </div>
    )
  }
}

export default App
