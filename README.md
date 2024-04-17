[TOC]

# Data LONG

> the Long is the Long, no Dragon

数据龙，基于外部数据提供者的lol英雄作战配置推荐接口。

# 接口说明

> 胜率登场率均为百分数的整数形式，例如67.89%->6789

> 所有请求均为get方式，参数跟在`?`后通过`&`连接
> 
## 符文

| 请求地址 | 描述 | 备注 |
| -- | -- | -- |
| /champion/`championId`/perk | 获取符文配置 | `championId`替换成英雄ID |

| 参数 | 类型 | 必需 | 描述 |
| -- | -- | -- | -- |
| lane | 分路 | 否 | 默认常用路，固定只有`top`、`jungle`、`mid`、`bottom`、`support`其一 |
| count | 数量 | 否 | 默认为5
| order | 排序方法 | 否 | 默认按胜率，可选登场率（`showrate`） |
| by | 升降序 | 否 | 默认降序，可选升序（`desc`） |

```
// 响应
{
    "code": 200,
    "msg": "succ",
    "data": [
        {
            "perkIds": [    // 符文ID
                "8021",     // 主系
                "9111",     // 副系
                "9103",     // 副系
                "8014",     // 主系
                "8234",     // 主系
                "8236",     // 主系
                "5008",     // 小符文
                "5008",     // 小符文
                "5001"      // 小符文
            ],
            "winrate": 5528,// 胜率
            "showrate": 40  // 登场率
        },
        // ...省略部分数据
    ]
}
```
*[ID对应符文名称参考](https://github.com/Ninohana/data-long/wiki/Perk-ID)*

## 出装

| 请求地址 | 描述 | 备注 |
| -- | -- | -- |
| /champion/`championId`/item | 获取英雄出装 | `championId`替换成英雄ID |
| /champion/`championId`/item/core3 | 获取英雄核心三件出装 | `championId`替换成英雄ID |
| /champion/`championId`/item/shoes | 获取英雄鞋子出装 | `championId`替换成英雄ID |

| 参数 | 类型 | 必需 | 描述 |
| -- | -- | -- | -- |
| lane | 分路 | 否 | 默认常用路，固定只有`top`、`jungle`、`mid`、`bottom`、`support`其一 |

```
// 响应
{
    "code": 200,
    "msg": "succ",
    "data": [
        {
            "itemIds": [        // 装备ID
                "1055",
                "2003"
            ],
            "winrate": 4919,    // 胜率
            "showrate": 8783    // 登场率
        },
        // ...省略部分数据
    ]
}
```
## 加点

| 请求地址 | 描述 | 备注 |
| -- | -- | -- |
| /champion/`championId`/skill | 获取加点 | `championId`替换成英雄ID |

| 参数 | 类型 | 必需 | 描述 |
| -- | -- | -- | -- |
| lane | 分路 | 否 | 默认常用路，固定只有`top`、`jungle`、`mid`、`bottom`、`support`其一 |

```
// 响应
{
    "code": 200,
    "msg": "succ",
    "data": [
        {
            "sequence": [       // 加点顺序
                "Q",
                "W",
                "E",
                "Q",
                "Q",
                "R",
                "Q",
                "W",
                "Q",
                "W",
                "R",
                "W",
                "W",
                "E",
                "E"
            ],
            "order": "Q>W>E",   // 加点优先级
            "winrate": "6023",  // 胜率
            "showrate": "9397"  // 登场率
        },
        // ...省略部分数据
    ]
}
```

## BUFF

| 请求地址 | 描述 | 备注 |
| -- | -- | -- |
| /champion/`championId`/buff | 获取各个模式中的buff/debuff | `championId`替换成英雄ID |

```
// 响应
{
    "code": 200,
    "msg": "succ",
    "data": {
        "id": 202,
        "name": "Jhin",              // 英雄名称
        "title": "The Virtuoso",     // 称号
        "stats": {
            "aram": {
                "dmg_dealt": 0.9,    // 伤害变化倍率
                "dmg_taken": 1.05    // 承伤变化倍率
            },
            "urf": {
                "dmg_dealt": 1.05
            }
        }
    }
}
```
暂无更多

# 计划

- 多数据源
- 英雄趋势
- 对位优劣

# 快速开始

克隆本仓库

```bash
git clone https://github.com/Ninohana/data-long.git
```

安装所需依赖（**需要node环境**）

```bash
npm install
```

编译
```bash
npm run build
# 或者
tsc
```

配置环境变量（根目录新建文件`.env`）
```propertity
CACHE_STORAGE="DiskCacheStorage"# 缓存类型，可选DiskCacheStorage、RedisCacheStorage
CACHE_EXPIRE_TIME="5"# 缓存有效期（单位秒）

# 缓存类型选择RedisCacheStorage需要额外配置，需要通过vecel cli获取
# 参考：https://vercel.com/docs/storage/vercel-kv
KV_REST_API_READ_ONLY_TOKEN=""
KV_REST_API_TOKEN=""
KV_REST_API_URL=""
KV_URL=""
```

运行

```bash
npm start
```

访问接口

HTTP    GET

localhost:3000

localhost:3000/champion/202/perk?lane=bottom&order=showrate&by=desc

# 部署

## 通过vercel

需要vercel账户，[免费注册](https://vercel.com)

1. Fork并Clone此项目
2. 安装vercel```npm install -g vercel```
3. 登录vercel账号```vercel login```
4. 在项目根目录执行部署命令```vercel```或用```vercel --prod```直接部署到生产
5. 通过控制台查看结果，如果看到与[Data LONG](http://data-long.vercel.app)相同的页面，即为部署成功
