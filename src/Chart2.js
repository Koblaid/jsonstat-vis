import React, { Component } from 'react'
import chartJs from 'chart.js'

import * as utils from './utils'


const renderChart = (ctx, dataSet) => {
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


export default class Chart2 extends Component {
  componentDidMount() {
    utils.getDataSet('https://json-stat.org/samples/canada.json').then(dataSet => {
      renderChart(this.chartCanvas, dataSet)
    })
  }

  render() {
    return (
      <canvas
        ref={canvas => {
          this.chartCanvas = canvas
        }}
      />
    )
  }
}
