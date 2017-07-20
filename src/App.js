import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import jsonstat from 'jsonstat'
import chartJs from 'chart.js'
import _ from 'lodash'


const x = () => {
  return fetch('https://json-stat.org/samples/canada.json')
    .then(res => res.json())
    .then(jsonDoc => {
      const j = jsonstat(jsonDoc)
      const d = j.Dataset(0)


      const a1 = _(d.toTable({ type: 'arrobj', content: 'id'}))
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

      const sortedKeys = obj => _(a1)
        .keys()
        .map(age => parseInt(age, 10) || age)
        .sortBy()
        .value()


      const result = j.Dataset(0).toTable({ type: 'arrobj', content: 'id', by: 'age', prefix: 'data_' })
      return result
    })
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

const chart1 = (ctx, data) => {
  console.log(ctx)
  const dataSets = Object
    .values(data)
    .filter(d => d.concept === 'POP' && d.age !== 'T')

  const preparedDatasets = {}
  for (const set of dataSets) {
    console.log('set', set)

    /* Shape of `set`:
     {
     country: 'CA',
     year: '2012',
     ...
     data_T: 17309.1,
     data_4: 988.7,
     data_9: 955,
     data_14: 964.7,
     data_19: 1108.2,
     ...
     data_79: 418.9,
     data_84: 303.6,
     data_89: 164.1,
     data_older: 73.2,
     }
     */
    const values = _(set)
      // Drop keys which are not values
      .pickBy((value, key) => key.startsWith('data_') && key !== 'data_T')
      // Convert to array of [key, value] arrays
      .toPairs()
      // Sort array by the integer extracted from the first element
      .sortBy(pair => parseInt(pair[0].replace('data_', ''), 10))
      // We only need the value
      .map(pair => pair[1])
      .value()
    // console.log('values', values)

    preparedDatasets[set.sex] = values
  }

  const labels = _(data[0])
    .keys()
    .filter(v => v.startsWith('data_') && v !== 'data_T' && v !== 'data_older')
    .map(v => parseInt(v.replace('data_', ''), 10))
    .sortBy()
    .map(v => `Age ${v}`)
    .value()
  labels.push('Older')


  const chartDataSets = _.map(preparedDatasets, (value, key) => {
    return {
      label: key,
      data: value,
      backgroundColor: getNextColor(),
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    }
  })

  console.log(chartDataSets, labels)
  new chartJs(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: chartDataSets,
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              // beginAtZero: true,
            },
          },
        ],
      },
    },
  })
}

const chart2 = (ctx) => {
  // TODO: https://github.com/chartjs/Chart.js/issues/1852

  var horizontalBarChartData = {
    labels: ['Age 4', 'Age 9', 'Age 14', 'Age 19', 'Age 24', 'Age 29', 'Age 34', 'Age 39', 'Age 44', 'Age 49', 'Age 54', 'Age 59', 'Age 64', 'Age 69', 'Age 74', 'Age 79', 'Age 84', 'Age 89', 'Older'],
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: 'red',
      borderColor: 'yellow',
      borderWidth: 1,
      data: [
        1, -2, 3, -1, 5, 7,
      ]
    }]

  };
  new chartJs(ctx, {
    type: 'horizontalBar',
    data: horizontalBarChartData,
    options: {
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        rectangle: {
          borderWidth: 2,
        }
      },
      responsive: true,
      // legend: {
      //   position: 'right',
      // },
      title: {
        display: true,
        text: 'Chart.js Horizontal Bar Chart'
      }
    }
  });
}

class App extends Component {
  componentDidMount() {
    x().then(data => {
      chart1(this.chartCanvas1, data)
      chart2(this.chartCanvas2, data)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
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
