import React from 'react'
import {extendObservable, action} from 'mobx'
import { Tab } from 'semantic-ui-react'
import {observer} from 'mobx-react'

import DataSet from './dataSet'
import DataTable from './DataTable'
import Chart from './Chart'


class Store {
  constructor(data = {}){
    extendObservable(this, {
      dataSet: new DataSet(data.dataSet),
      setChartType: action(v => this.chartType = v),
      chartType: data.chartType || 'bar',
      get isReadyToRender(){
        return this.chartType && this.dataSet.groupDimension && this.dataSet.dataDimension
      },

      toObject(){
        return {
          chartType: this.chartType,
          dataSet: this.dataSet.toObject(),
        }
      },
    })
  }
}


const Configurator = observer(({store}) => {
  return <div>
    <label>JSON-stat URL
      <input type="text" value={store.dataSet.jsonstatUrl} onChange={(e) => store.dataSet.setjsonStatUrl(e.target.value)}/>
    </label>

    <button onClick={() => store.dataSet.load()}>Load data</button>

    <label>Group data by
      <select value={store.dataSet.groupDimension} onChange={e => store.dataSet.setGroupDimension(e.target.value)} disabled={!store.dataSet.isLoaded}>
        {store.dataSet.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
      </select>
    </label>

    <label>Category label
      <select value={store.dataSet.dataDimension} onChange={e => store.dataSet.setDataDimension(e.target.value)} disabled={!store.dataSet.isLoaded}>
        {store.dataSet.dimensions.map((dimension, i) => <option key={i}>{dimension}</option>)}
      </select>
    </label>}

    <br />

    <a href={'?json=' + encodeURIComponent(JSON.stringify(store.toObject()))}>Link</a>

    <Tab panes={[
      { menuItem: 'Data', render: () => <Tab.Pane><DataTable store={store.dataSet}/></Tab.Pane> },
      { menuItem: 'Chart', render: () => <Tab.Pane><Chart store={store} /></Tab.Pane> },
    ]} />

  </div>
})


// https://stackoverflow.com/a/901144/4287172
function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[\[\]]/g, "\\$&")
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}


const urlParameter = getParameterByName('json')
const data = urlParameter ? JSON.parse(urlParameter) : {}

const store = new Store(data);
if(urlParameter){
  store.dataSet.load()
}
export default () => <Configurator store={store} />
