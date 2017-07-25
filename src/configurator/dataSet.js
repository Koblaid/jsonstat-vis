import * as utils from '../utils'
import _ from 'lodash'
import {extendObservable, action} from 'mobx'


export default class DataSet {
  constructor(){
    extendObservable(this, {
      ds: undefined,
      jsonstatUrl: 'http://data.ssb.no/api/v0/dataset/85430.json?lang=en',
      groupDimension: '',
      dataDimension: '',

      setjsonStatUrl: action(v => this.jsonstatUrl = v),
      setDataSet: action(v => this.ds = v),
      setGroupDimension: action(v => this.groupDimension = v),
      setDataDimension: action(v => this.dataDimension = v),

      get isLoaded(){
        return Boolean(this.ds)
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

      getTable(){
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

