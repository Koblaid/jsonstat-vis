import React from 'react'
import {extendObservable, action} from 'mobx'
import { Tab } from 'semantic-ui-react'
import {observer} from 'mobx-react'

import DataSet from './dataSet'
import DataTable from './DataTable'
import Chart from './Chart'


class Store {
  constructor(){
    extendObservable(this, {
      dataSet: new DataSet(),
      setChartType: action(v => this.chartType = v),
      chartType: 'bar',
      get isReadyToRender(){
        return store.chartType && this.dataSet.groupDimension && store.dataSet.dataDimension
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

    <Tab panes={[
      { menuItem: 'Data', render: () => <Tab.Pane><DataTable store={store.dataSet}/></Tab.Pane> },
      { menuItem: 'Chart', render: () => <Tab.Pane><Chart store={store} /></Tab.Pane> },
    ]} />

  </div>
})



const store = new Store();
export default () => <Configurator store={store} />
