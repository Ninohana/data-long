module.exports = (championDetail, params) => {
  const info = championDetail.list["championLane"][params.lane ?? Object.keys(championDetail.list["championLane"])[0]]

  let i = 1, r = [];
  while (item = JSON.parse(info["skilljson"])["" + i++]) {
    const i = {
      "sequence": item["sks"]["1"]["sk"].replaceAll("1", "Q").replaceAll("2", "W").replaceAll("3", "E").replaceAll("4", "R").split("&"),
      "order": item["qwe"].replaceAll("&", ">").replaceAll("1", "Q").replaceAll("2", "W").replaceAll("3", "E").replaceAll("4", "R"),
      "winrate": item["qwe_w"],
      "showrate": item["qwe_s"]
    }
    r.push(i)
  }

  return r
}

/**
{
  qwe: '1&2&3',
  qwe_s: '9397',
  qwe_w: '6023',
  sks: {
    '1': { sk: '1&2&3&1&1&4&1&2&1&2&4&2&2&3&3', sk_s: '4671', sk_w: '5951' },
    '2': { sk: '2&1&3&1&1&4&1&2&1&2&4&2&2&3&3', sk_s: '2179', sk_w: '5944' },
    '3': { sk: '1&2&1&3&1&4&1&2&1&2&4&2&2&3&3', sk_s: '922', sk_w: '6459' },
    '4': { sk: '2&1&1&3&1&4&1&2&1&2&4&2&2&3&3', sk_s: '314', sk_w: '6667' },
    '5': { sk: '1&2&3&1&1&4&1&3&1&2&4&2&2&2&3', sk_s: '114', sk_w: '7071' }
  }
}
{
  qwe: '1&3&2',
  qwe_s: '529',
  qwe_w: '6109',
  sks: {
    '1': { sk: '1&2&3&1&1&4&1&3&1&3&4&3&3&2&2', sk_s: '106', sk_w: '7283' },
    '2': { sk: '2&1&3&1&1&4&1&3&1&3&4&3&3&2&2', sk_s: '49', sk_w: '4884' },
    '3': { sk: '1&2&3&1&1&4&1&2&1&3&4&3&3&3&2', sk_s: '16', sk_w: '3571' },
    '4': { sk: '1&2&3&1&1&4&1&3&1&3&4&2&2&2&2', sk_s: '15', sk_w: '6923' },
    '5': { sk: '1&3&2&1&1&4&1&3&1&3&4&3&3&2&2', sk_s: '15', sk_w: '6154' }
  }
}
*/