import React, { Component } from 'react'

import * as utils from './utils'


export default class ChartContainer extends Component {
  componentDidMount() {
    const {renderChart, url} = this.props
    utils.getDataSet(url).then(dataSet => {
      renderChart(this.chartCanvas, dataSet)
    })
  }

  render() {
    const {height} = this.props
    return (
      <canvas height={height}
              ref={canvas => {
                this.chartCanvas = canvas
              }}
      />
    )
  }
}
