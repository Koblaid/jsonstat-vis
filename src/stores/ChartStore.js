import {extendObservable, action} from 'mobx'
import DataSetStore from './DataSetStore'


export default class ChartStore {
  constructor(data = {}){
    extendObservable(this, {
      dataSet: new DataSetStore(data.dataSet),
      setChartType: action(v => this.chartType = v),
      chartType: data.chartType || 'bar',
      get isReadyToRender(){
        return this.chartType && this.dataSet.groupDimension && this.dataSet.dataDimension
      },

      toObject(){
        return {
          chartType: this.chartType,
          dataSet: this.dataSet.toObject(),
        }
      },
    })
  }
}
