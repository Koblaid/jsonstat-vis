import React from 'react'
import {observer} from 'mobx-react'
import { Table } from 'semantic-ui-react'

const DataTable = observer(({store}) => {
  const {header, body} = store.getTable()
  if(!header || !body){
    return null
  }

  return (
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          {header.map((colHeader, index) => <Table.HeaderCell key={index}>{colHeader}</Table.HeaderCell>)}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {body.map((row, index1) => {
          return <Table.Row key={index1}>
            {row.map((column, index2) => <Table.Cell key={index2}>{column}</Table.Cell>)}
          </Table.Row>
        })}
      </Table.Body>
    </Table>
  )
})


export default DataTable
