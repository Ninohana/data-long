module.exports = async (providers, params) => {
    const championDetail = await providers[0].supply(params.id)

    const info = championDetail['championLane'][params.lane ?? Object.keys(championDetail.championLane)[0]]

    let i = 1, r = [];
    while (item = JSON.parse(info["perkdetail"])["" + i++]) {
        Object.keys(item).forEach(i => {
            const j = {
                "perkIds": item[i]["perk"].split("&"),
                "winrate": item[i]["winrate"],
                "showrate": item[i]["showrate"]
            }
            r.push(j)
        })

        if (r.length >= [params.count || 5])
            break
    }

    return r.sort((a, b) => {

        if (params.order == 'showrate') {
            a = a.showrate
            b = b.showrate
        } else {
            a = a.winrate
            b = b.winrate
        }

        return params.by == 'desc' ? a - b : b - a
    })
}