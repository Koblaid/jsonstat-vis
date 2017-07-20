import React from 'react'
import { Tab } from 'semantic-ui-react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'

import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'


const panes = [
  { menuItem: 'Canada: Population by age and sex', render: () => <Tab.Pane><Chart1 /></Tab.Pane> },
  { menuItem: 'Canada: Sex ratio by age', render: () => <Tab.Pane><Chart2 /></Tab.Pane> },
  { menuItem: 'Norway: Land / Water area by region', render: () => <Tab.Pane><Chart3 /></Tab.Pane> },
]


export default () => {
  return (
    <div className="App">
      <Tab panes={panes} />
    </div>
  )
}
