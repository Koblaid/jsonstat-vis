import React from 'react'
import {extendObservable, action} from 'mobx'
import { Tab, Form, Dropdown } from 'semantic-ui-react'
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
    <Form>
      <Form.Group inline>
        <Form.Input
          label="JSON-stat URL"
          labelPosition="left"
          value={store.dataSet.jsonstatUrl}
          onChange={(e) => store.dataSet.setjsonStatUrl(e.target.value)}
          width={6}
        />

        <Form.Button onClick={() => store.dataSet.load()}>Load data</Form.Button>
      </Form.Group>

      <Form.Group>
        <Form.Field inline>
          <label>Group data by</label>
          <Dropdown
            selection
            options={store.dataSet.dimensions.map(dim => ({value: dim, text: dim}))}
            value={store.dataSet.groupDimension}
            onChange={(event, data) => store.dataSet.setGroupDimension(data.value)}
            disabled={!store.dataSet.isLoaded}>
          </Dropdown>
        </Form.Field>

        <Form.Field inline>
          <label>Category label</label>
          <Dropdown
            selection
            options={store.dataSet.dimensions.map(dim => ({value: dim, text: dim}))}
            value={store.dataSet.dataDimension}
            onChange={(event, data) => store.dataSet.setDataDimension(data.value)}
            disabled={!store.dataSet.isLoaded}>
          </Dropdown>
        </Form.Field>
      </Form.Group>

      <Form.Group inline>
        <Form.Field>
          <label>URL to share:</label>
          <a href={'?json=' + encodeURIComponent(JSON.stringify(store.toObject()))}>Link</a>
        </Form.Field>
      </Form.Group>
    </Form>



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
