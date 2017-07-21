import React from 'react'
import _ from 'lodash'
import chartJs from 'chart.js'

import * as utils from './utils'
import ChartContainer from './ChartContainer'


const renderChart = (ctx, dataSet) => {
  const groupedData = utils.groupBy(dataSet, 'Tid', 'ContentsCode')
  console.log(groupedData)
  const sortedKeys = Object.keys(groupedData)
  sortedKeys.sort()

  const chartDataSets = _.map(['Foretakkonk', 'Personligkonk', 'Tvalg', 'Tvang2', 'Tinglystutlegg'], contents => {
    return {
      label: dataSet.Dimension('ContentsCode').Category(contents).label,
      data: sortedKeys.map(key => groupedData[key].values[contents]),
      backgroundColor: utils.getNextColor(),
      borderWidth: 1,
      fill: false,
    }
  })

  new chartJs(ctx, {
    type: 'line',
    data: {
      labels: sortedKeys.map(key => groupedData[key].label),
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

// Data: http://json-stat.com/explorer/#/https%3A%2F%2Fjson-stat.org%2Fsamples%2Fcanada.json
export default () => <ChartContainer
  url="http://data.ssb.no/api/v0/dataset/95265.json?lang=en"
  renderChart={renderChart}
/>


// Source: http://data.ssb.no/api/v0/dataset/95265?lang=en
// Data visualization: http://json-stat.com/explorer/#/http%3A%2F%2Fdata.ssb.no%2Fapi%2Fv0%2Fdataset%2F95265.json%3Flang%3Den
