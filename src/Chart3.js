import React, { Component } from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'


const renderChart = (ctx, dataSet) => {
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


export default class Chart3 extends Component {
  componentDidMount() {
    utils.getDataSet('http://data.ssb.no/api/v0/dataset/85430.json?lang=en').then(dataSet => {
      renderChart(this.chartCanvas, dataSet)
    })
  }

  render() {
    return (
      <canvas height="1000"
        ref={canvas => {
          this.chartCanvas = canvas
        }}
      />
    )
  }
}
