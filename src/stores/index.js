import {extendObservable, action} from 'mobx'
import ChartStore from './ChartStore'
import * as utils from '../utils'


export default class RootStore {
  constructor() {
    extendObservable(this, {
      tabPanel: [],
      tabs: {},
      jsonstatUrl: 'https://json-stat.org/samples/canada.json',

      setjsonstatUrl: action(v => this.jsonstatUrl = v),

      getTab: (tabId) => this.tabs[tabId],

      indexOfTab: tabId => this.tabPanel.indexOf(tabId),

      addTab: action(data => {
        const tabId = utils.uuidv4()
        const chartStore = new ChartStore(data)
        if(chartStore.dataSet.jsonstatUrl){
          chartStore.dataSet.load()
        }
        this.tabs[tabId] = chartStore
        this.tabPanel.push(tabId)
        return tabId
      }),

      removeTab: action(tabId => {
        delete this.tabs[tabId]
        this.tabPanel.splice(this.indexOfTab(tabId), 1)
      })
    })
  }
}
