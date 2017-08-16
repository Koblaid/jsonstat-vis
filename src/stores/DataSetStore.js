import * as utils from '../utils'
import _ from 'lodash'
import {extendObservable, action} from 'mobx'


export default class DataSetStore {
  constructor(data = {}){
    extendObservable(this, {
      ds: undefined,
      jsonstatUrl: data.jsonstatUrl,
      groupDimension: data.groupDimension || '',
      dataDimension: data.dataDimension || '',

      setDataSet: action(v => this.ds = v),
      setGroupDimension: action(v => this.groupDimension = v),
      setDataDimension: action(v => this.dataDimension = v),

      toObject(){
        return {
          jsonstatUrl: this.jsonstatUrl,
          groupDimension: this.groupDimension,
          dataDimension: this.dataDimension,
        }
      },

      get isLoaded(){
        return Boolean(this.ds)
      },

      get label(){
        return this.ds && this.ds.label
      },

      get source(){
        return this.ds && this.ds.source
      },

      get updated(){
        return this.ds && this.ds.updated
      },

      get dimensions () {
        return this.ds ? this.ds.id : []
      },

      get groupedData(){
        return utils.groupBy(this.ds, this.groupDimension, this.dataDimension)
      },

      get sortedKeys(){
        const sortedKeys = Object.keys(this.groupedData)
        sortedKeys.sort()
        return sortedKeys
      },

      get labels(){
        return this.sortedKeys.map(key => this.groupedData[key].label)
      },

      get columns(){
        return _.map(this.ds.Dimension(this.dataDimension).id, dimensionValue => {
          return {
            label: this.ds.Dimension(this.dataDimension).Category(dimensionValue).label,
            data: this.sortedKeys.map(key => this.groupedData[key].values[dimensionValue]),
          }
        })
      },

      load(){
        utils.getDataSet(this.jsonstatUrl)
          .then((dataSet) => {
            this.setDataSet(dataSet)
          })
      },

      getRawTable(){
        if(!this.ds){
          return {}
        }
        const header = this.ds.id.concat('value')
        const body = this.ds.toTable({ type: 'arrobj'}).map(row => {
          return header.map(colName => row[colName])
        })
        return {header, body}
      },

      getGroupedTable(){
        if(!this.ds || !this.groupDimension || !this.dataDimension || this.groupDimension === this.dataDimension){
          return {}
        }
        const columnIds = this.ds.Dimension(this.dataDimension).id
        const header = [''].concat(_.map(columnIds, dimensionValue => {
          return this.ds.Dimension(this.dataDimension).Category(dimensionValue).label || dimensionValue
        }))

        const body = this.sortedKeys.map(key => {
          return [this.groupedData[key].label].concat(
            columnIds.map(colId => this.groupedData[key].values[colId])
          )
        })

        return {
          header,
          body,
        }
      }
    })
  }
}

