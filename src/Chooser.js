import React from 'react'
import {observer} from 'mobx-react'


const Chooser = observer(({store}) => {
  return <div>
    <label>JSON-stat URL
      <input type="text" value={store.jsonstatUrl} onChange={(e) => store.setjsonstatUrl(e.target.value)}/>
    </label>

    <button onClick={() => store.addTab({dataSet: {jsonstatUrl: store.jsonstatUrl}})}>Create new chart</button>
  </div>
})

export default Chooser
