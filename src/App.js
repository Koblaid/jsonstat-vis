import React from 'react'
import { Tab, Menu, Label } from 'semantic-ui-react'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import {useStrict} from 'mobx'
import {observer} from 'mobx-react'

import Configurator from './configurator'
import Chart1 from './Chart1'
import Chart2 from './Chart2'
import Chart3 from './Chart3'
import Chart4 from './Chart4'
import Chooser from './Chooser'
import RootStore from './stores'
import * as utils from './utils'


const urlParameter = utils.getParameterByNameFromUrl('json')
const data = urlParameter ? JSON.parse(urlParameter) : {}

const rootStore = new RootStore()
if(urlParameter){
  rootStore.addTab(data)
}

const staticPanes = [
  { menuItem: 'Start', render: () => <Tab.Pane><Chooser store={rootStore}/></Tab.Pane> },
  { menuItem: 'Canada: Population by age and sex', render: () => <Tab.Pane><Chart1 /></Tab.Pane> },
  { menuItem: 'Canada: Sex ratio by age', render: () => <Tab.Pane><Chart2 /></Tab.Pane> },
  { menuItem: 'Norway: Land / Water area by region', render: () => <Tab.Pane><Chart3 /></Tab.Pane> },
  { menuItem: 'Norway: Bankruptcies, ...', render: () => <Tab.Pane><Chart4 /></Tab.Pane> },
]

useStrict(true)


export default observer(() => {
  const panes = staticPanes.concat(rootStore.tabPanel.map((tabId, index) => ({
    menuItem:  <Menu.Item key={index}>Configurator {index}<Label onClick={() => rootStore.removeTab(tabId)}>x</Label></Menu.Item>,
    render: () => <Tab.Pane><Configurator store={rootStore.getTab(tabId)}/></Tab.Pane>
  })))

  return (
    <div className="App">
      <Tab panes={panes} />
    </div>
  )
})
