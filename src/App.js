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



const groupBy = (dataset, groupDimension, dataDimension, filters, rejects) => {
  let chain = _(dataset.toTable({ type: 'arrobj', content: 'id'}))

  if(!_.isEmpty(filters)){
    chain = chain.filter(filters)
  }

  if(!_.isEmpty(rejects)){
    chain = chain.reject(rejects)
  }

  return chain
    .groupBy(groupDimension)
    .mapValues((value, key) => {
      const values = {}
      for (const obj of value) {
        values[obj[dataDimension]] = obj.value
      }
      return {
        values,
        label: dataset.Dimension(groupDimension).Category(key).label,
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
  const groupedData = groupBy(dataSet, 'age', 'sex', {concept: 'POP'}, {age: 'T'})
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

  const groupedData = groupBy(dataSet, 'age', 'sex', {concept: 'POP'}, {age: 'T'})
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


const chart3 = (ctx, dataSet) => {
  const groupedData = groupBy(dataSet, 'Region', 'Arealtype')
  const sortedKeys = _(groupedData)
    .keys()
    .sortBy(key => dataSet.Dimension('Region').Category(key).label)
    .value()

  const colors = {
    1: chartColors.green,
    2: chartColors.blue,
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
    getDataSet('https://json-stat.org/samples/canada.json').then(dataSet => {
      chart1(this.chartCanvas1, dataSet)
      chart2(this.chartCanvas2, dataSet)
    })

    getDataSet('http://data.ssb.no/api/v0/dataset/85430.json?lang=en').then(dataSet => {
      chart3(this.chartCanvas3, dataSet)
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
