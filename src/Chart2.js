import React from 'react'
import chartJs from 'chart.js'

import * as utils from './utils'
import ChartContainer from './ChartContainer'


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
        text: 'Canada: Sex ratio by age (2012)'
      },
      legend: {
        display: false,
      },
    }
  });
}

// Data: http://json-stat.com/explorer/#/https%3A%2F%2Fjson-stat.org%2Fsamples%2Fcanada.json
export default () => <ChartContainer
  url="https://json-stat.org/samples/canada.json"
  renderChart={renderChart}
/>
