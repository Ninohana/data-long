const axios = require('axios')
const vm = require('vm')

const champDetail = vm.createContext({})

module.exports = async (championId) => {
  if (championId == null || isNaN(championId) || championId <= 0) {
    return
  }

  if (champDetail.hasOwnProperty('CHAMPION_DETAIL_' + championId)) {
    return champDetail[`CHAMPION_DETAIL_${championId}`]
  }

  const res = await axios.get(`https://lol.qq.com/act/lbp/common/guides/champDetail/champDetail_${championId}.js`)

  vm.runInContext(res.data, champDetail)

  setTimeout(() => {
    delete champDetail[`CHAMPION_DETAIL_${championId}`]
  }, 43200000)// half a day

  return champDetail[`CHAMPION_DETAIL_${championId}`]
}