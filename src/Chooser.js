import React from 'react'
import {observer} from 'mobx-react'
import { Form, Dropdown } from 'semantic-ui-react'

import { DATA_SOURCES } from './stores/index'


const Radio = observer(({store, label, value}) => <Form.Radio
  label={label}
  value={value}
  checked={store.dataSource === value}
  onChange={(e, {value}) => store.setDataSource(value)}
/>)


const Chooser = observer(({store}) => {
  return <div>
    <Form.Group inline>
      <label>Data source</label>
      <Radio store={store} label='Statistics Norway' value={DATA_SOURCES.statisticNorway} />
      <Radio store={store} label='JSON-stat URL' value={DATA_SOURCES.jsonstatUrl} />
      {/*<Radio store={store} label='JSON-stat file' value={DATA_SOURCES.jsonstatFile} />*/}
      {/*<Radio store={store} label='CSV file' value={DATA_SOURCES.csvFile} />*/}
    </Form.Group>

    {store.dataSource === DATA_SOURCES.statisticNorway && <div>
      <label>Norway datasets
        <select size="15" style={{width: 500}}>
          {store.getSortedNorwayDataSets().map((set, idx) => <option key={idx} onClick={() => store.setSelectedNorwayDataSet(set.id)}>{set.title}</option>)}
        </select>
      </label>
      <button onClick={() => store.addTab({dataSet: {jsonstatUrl: store.getNorwayUrl()}})}>Create new chart</button>
    </div>}

    {store.dataSource === DATA_SOURCES.jsonstatUrl && <div>
      <label>JSON-stat URL
        <input type="text" value={store.jsonstatUrl} onChange={(e) => store.setjsonstatUrl(e.target.value)}/>
      </label>
      <button onClick={() => store.addTab({dataSet: {jsonstatUrl: store.jsonstatUrl}})}>Create new chart</button>
    </div>}


  </div>
})

export default Chooser
