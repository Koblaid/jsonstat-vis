import React from 'react'
import {observer} from 'mobx-react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'



const DataTable = observer(({header, body}) => {
  if(!header || !body){
    return null
  }

  const columns = header.map((name, index) => ({
    Header: name,
    accessor: row => row[index],
    id: index.toString(),
  }))

  return <ReactTable data={body} columns={columns} filterable />
})


export default DataTable
