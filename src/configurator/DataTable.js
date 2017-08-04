import React from 'react'
import {observer} from 'mobx-react'
import { Grid } from 'react-virtualized'


const DataTable = observer(({header, body}) => {
  if(!header || !body){
    return null
  }

  const rows = [header].concat(body)


  const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
    const content = rows[rowIndex][columnIndex]
    return (
      <div key={key} style={style}>
        {rowIndex ? <span>{content}</span> : <strong>{content}</strong>}
      </div>
    )
  }


  return (
    <Grid
      cellRenderer={cellRenderer}
      columnCount={rows[0].length}
      columnWidth={100}
      height={600}
      rowCount={rows.length}
      rowHeight={30}
      width={1000}
    />
  )
})


export default DataTable
