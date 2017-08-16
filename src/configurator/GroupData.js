import React from 'react'
import {observer} from 'mobx-react'
import { Form, Dropdown } from 'semantic-ui-react'

import DataTable from './DataTable'


const GroupData = observer(({store}) => {
  const {header: groupedTableHeader, body: groupedTableBody} = store.dataSet.getGroupedTable()

  return <Form>
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

    <DataTable header={groupedTableHeader} body={groupedTableBody} />
  </Form>
})


export default GroupData
