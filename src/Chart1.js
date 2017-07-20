import React from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'
import ChartContainer from './ChartContainer'


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
        text: 'Canada: Population by age and sex (2012)',
      },
    },
  })
}

// Data: http://json-stat.com/explorer/#/https%3A%2F%2Fjson-stat.org%2Fsamples%2Fcanada.json
export default () => <ChartContainer
  url="https://json-stat.org/samples/canada.json"
  renderChart={renderChart}
/>
