import React from 'react'
import { Tab, Form } from 'semantic-ui-react'
import {observer} from 'mobx-react'

import DataTable from './DataTable'
import Chart from './Chart'
import GroupData from './GroupData'


const Configurator = observer(({store}) => {
  const {header: rawTableHeader, body: rawTableBody} = store.dataSet.getRawTable()

  return <div>
    <Form>
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



      <Form.Group inline>
        <Form.Field>
          <label>URL to share:</label>
          <a href={'?json=' + encodeURIComponent(JSON.stringify(store.toObject()))}>Link</a>
        </Form.Field>
      </Form.Group>
    </Form>



    <Tab panes={[
      { menuItem: 'Raw Data', render: () => <Tab.Pane><DataTable header={rawTableHeader} body={rawTableBody} /></Tab.Pane> },
      { menuItem: 'Grouped Data', render: () => <Tab.Pane><GroupData store={store} /> </Tab.Pane> },
      { menuItem: 'Chart', render: () => <Tab.Pane><Chart store={store} /></Tab.Pane> },
    ]} />

  </div>
})


export default Configurator
