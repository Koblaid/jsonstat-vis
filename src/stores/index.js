import {extendObservable, action} from 'mobx'
import ChartStore from './ChartStore'
import * as utils from '../utils'
import _ from 'lodash'


export const DATA_SOURCES = {
  statisticNorway: 'statisticNorway',
  jsonstatUrl: 'jsonstatUrl',
  jsonstatFile: 'jsonstatFile',
  csvFile: 'csvFile',
}


export default class RootStore {
  constructor() {
    extendObservable(this, {
      tabPanel: [],
      tabs: {},

      dataSource: 'statisticNorway',
      jsonstatUrl: 'https://json-stat.org/samples/canada.json',
      norwayDataSets: [],
      selectedNorwayDataSet: '',

      setjsonstatUrl: action(v => this.jsonstatUrl = v),
      setDataSource: action(v => this.dataSource = v),
      setNorwayDataSets: action(v => this.norwayDataSets = v),
      setSelectedNorwayDataSet: action(v => this.selectedNorwayDataSet = v),

      getSortedNorwayDataSets: () => _.orderBy(this.norwayDataSets, 'title'),

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
      }),

      loadNorwayDataSets: action(() => {
        fetch('http://data.ssb.no/api/v0/dataset/list.json?lang=en')
          .then(res => res.json())
          .then(res => this.setNorwayDataSets(res.datasets))
      }),

      getNorwayUrl: () => this.norwayDataSets.find(set => this.selectedNorwayDataSet === set.id).jsonURI,
    })
  }
}
