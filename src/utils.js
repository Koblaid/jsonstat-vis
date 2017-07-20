import _ from 'lodash'


export const getSortedKeysByInt = obj => _(obj)
  .keys()
  .map(v => parseInt(v, 10) || v)
  .sortBy()
  .value()



export const groupBy = (dataset, groupDimension, dataDimension, filters, rejects) => {
  let chain = _(dataset.toTable({ type: 'arrobj', content: 'id'}))

  if(!_.isEmpty(filters)){
    chain = chain.filter(filters)
  }

  if(!_.isEmpty(rejects)){
    chain = chain.reject(rejects)
  }

  return chain
    .groupBy(groupDimension)
    .mapValues((value, key) => {
      const values = {}
      for (const obj of value) {
        values[obj[dataDimension]] = obj.value
      }
      return {
        values,
        label: dataset.Dimension(groupDimension).Category(key).label,
      }
    })
    .value()
}
