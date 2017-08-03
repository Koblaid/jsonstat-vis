import React from 'react'
import { Tab, Form, Dropdown } from 'semantic-ui-react'
import {observer} from 'mobx-react'

import ChartStore from '../stores/ChartStore'
import DataTable from './DataTable'
import Chart from './Chart'


const Configurator = observer(({store}) => {
  const {header: rawTableHeader, body: rawTableBody} = store.dataSet.getRawTable()
  const {header: groupedTableHeader, body: groupedTableBody} = store.dataSet.getGroupedTable()

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

      <Form.Group inline>
        <Form.Field>
          <label>DataSet</label>
          <span>{store.dataSet.label}</span>
        </Form.Field>
        <Form.Field>
          <label>Source</label>
          <span>{store.dataSet.source}</span>
        </Form.Field>
        <Form.Field>
          <label>Updated</label>
          <span>{store.dataSet.updated}</span>
        </Form.Field>
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
      { menuItem: 'Raw Data', render: () => <Tab.Pane><DataTable header={rawTableHeader} body={rawTableBody} /></Tab.Pane> },
      { menuItem: 'Grouped Data', render: () => <Tab.Pane><DataTable header={groupedTableHeader} body={groupedTableBody} /></Tab.Pane> },
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

const store = new ChartStore(data);
if(urlParameter){
  store.dataSet.load()
}
export default () => <Configurator store={store} />
