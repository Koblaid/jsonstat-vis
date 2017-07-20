import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import jsonstat from 'jsonstat'
import chartJs from 'chart.js'
import _ from 'lodash'




const getDataSet = uri => {
  return fetch(uri)
    .then(res => res.json())
    .then(jsonDoc => {
      const j = jsonstat(jsonDoc)
      const d = j.Dataset(0)
      return d
    })
}

const getSortedKeys = obj => _(obj)
  .keys()
  .map(age => parseInt(age, 10) || age)
  .sortBy()
  .value()


const groupByAge = d => {
  return _(d.toTable({ type: 'arrobj', content: 'id'}))
    .filter({concept: 'POP'})
    .reject({age: 'T'})
    .groupBy('age')
    .mapValues((value, key) => {
      const values = {}
      for (const obj of value) {
        values[obj.sex] = obj.value
      }
      return {
        values,
        label: d.Dimension('age').Category(key).label,
      }
    })
    .value()
}


const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}

const chartColorsOrder = Object.keys(chartColors)
let currentColorIndex = 0
const getNextColor = () => {
  const color = chartColors[chartColorsOrder[currentColorIndex]]
  currentColorIndex += 1
  return color
}

const chart1 = (ctx, dataSet) => {
  const groupedData = groupByAge(dataSet)
  const sortedKeys = getSortedKeys(groupedData)

  const chartDataSets = _.map(['T', 'F', 'M'], sex => {
    return {
      label: dataSet.Dimension('sex').Category(sex).label,
      data: sortedKeys.map(key => groupedData[key].values[sex]),
      backgroundColor: getNextColor(),
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

const chart2 = (ctx, dataSet) => {
  // TODO: https://github.com/chartjs/Chart.js/issues/1852

  const groupedData = groupByAge(dataSet)
  const sortedKeys = getSortedKeys(groupedData)
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

class App extends Component {
  componentDidMount() {
    getDataSet('https://json-stat.org/samples/canada.json').then(dataSet => {
      chart1(this.chartCanvas1, dataSet)
      chart2(this.chartCanvas2, dataSet)
    })
  }

  render() {
    return (
      <div className="App">
        <canvas
          ref={canvas => {
            this.chartCanvas1 = canvas
          }}
        />
        <canvas
          ref={canvas => {
            this.chartCanvas2 = canvas
          }}
        />
      </div>
    )
  }
}

export default App
