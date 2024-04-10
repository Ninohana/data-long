module.exports = async (providers, params) => {
  const championDetail = await providers[0].supply(params.id)
  const info = championDetail["championLane"][params.lane ?? Object.keys(championDetail["championLane"])[0]]

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