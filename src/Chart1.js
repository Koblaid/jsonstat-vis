import React, { Component } from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'


const renderChart = (ctx, dataSet) => {
  const groupedData = utils.groupBy(dataSet, 'age', 'sex', {concept: 'POP'}, {age: 'T'})
  const sortedKeys = utils.getSortedKeysByInt(groupedData)

  const chartDataSets = _.map(['T', 'F', 'M'], sex => {
    return {
      label: dataSet.Dimension('sex').Category(sex).label,
      data: sortedKeys.map(key => groupedData[key].values[sex]),
      backgroundColor: utils.getNextColor(),
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  })

  new chartJs(ctx, {
    type: 'bar',
    data: {
      labels: sortedKeys.map(key => groupedData[key].label),
      datasets: chartDataSets,
    },
    options: {
      title: {
        display: true,
        text: 'Population by age and sex',
      },
    },
  })
}


export default class Chart1 extends Component {
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
