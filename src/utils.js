import _ from 'lodash'
import jsonstat from 'jsonstat'


export const chartColors = {
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
export const getNextColor = () => {
  const color = chartColors[chartColorsOrder[currentColorIndex % _.size(chartColors)]]
  currentColorIndex += 1
  return color
}


export const getDataSet = uri => {
  return fetch(uri)
    .then(res => res.json())
    .then(jsonDoc => {
      const j = jsonstat(jsonDoc)
      const d = j.Dataset(0)
      return d
    })
}


export const getSortedKeysByInt = obj => _(obj)
  .keys()
  .map(v => parseInt(v, 10) || v)
  .sortBy()
  .value()



export const groupBy = (dataset, groupDimension, dataDimension, filters, rejects) => {
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
        label: dataset.Dimension(groupDimension) && dataset.Dimension(groupDimension).Category(key).label,
      }
    })
    .value()
}


// https://stackoverflow.com/a/901144/4287172
export const getParameterByNameFromUrl = (name, url) => {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&") // eslint-disable-line no-useless-escape
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}


// https://stackoverflow.com/a/2117523/4287172
export const uuidv4 = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) // eslint-disable-line no-mixed-operators
  )
}
