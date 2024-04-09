module.exports = (championDetail, params) => {
  const info = championDetail.list["championLane"][params.lane ?? Object.keys(championDetail.list["championLane"])[0]]

  let i = 1, r = [];
  while (item = JSON.parse(info["shoesjson"])["" + i++]) {
      const i = {
          "itemIds": item["itemid"].split("&"),
          "winrate": item["winrate"],
          "showrate": item["showrate"]
      }
      r.push(i)
  }

  return r
}