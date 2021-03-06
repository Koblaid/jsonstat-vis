import React from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'
import ChartContainer from './ChartContainer'


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
        text: 'Norway: Land / Water area by region (2017)'
      },
      legend: {
        display: true
      },
    }
  });
}

// Source: http://data.ssb.no/api/v0/dataset/85430?lang=en
// Data visualization: http://json-stat.com/explorer/#/http%3A%2F%2Fdata.ssb.no%2Fapi%2Fv0%2Fdataset%2F85430.json%3Flang%3Den
export default () => <ChartContainer
  url="http://data.ssb.no/api/v0/dataset/85430.json?lang=en"
  height="1000"
  renderChart={renderChart}
/>
