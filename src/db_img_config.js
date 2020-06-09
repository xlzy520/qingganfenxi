export default {
  dbName: "lzy",                          // *数据库名称
  version: 1.0,                                 // 数据库版本号（默认为当前时间戳）
  tables: [                                   // *数据库的表，即ObjectStore
    {
      tableName: "task",                 // *表名
      option: { keyPath: "id" },          // 表配置，即ObjectStore配置，此处指明主键为id
      indexs: [                           // 数据库索引（建议加上索引）
        {
          key: "id",                  // *索引名
          option:{                    // 索引配置，此处表示该字段不允许重复
            unique: true
          }
        },
        {
          key: "name"
        },
        {
          key: "status"
        },
        {
          key: 'date'
        }
      ]
    },
    {
      tableName: "data",                 // *表名
      option: { keyPath: "id" },          // 表配置，即ObjectStore配置，此处指明主键为id
      indexs: [                           // 数据库索引（建议加上索引）
        {
          key: "name",                  // *索引名
          option:{                    // 索引配置，此处表示该字段不允许重复
            unique: true
          }
        },
        {
          key: "url"
        },
        {
          key: "width"
        },
        {
          key: "height"
        },
        {
          key: 'date'
        }
      ]
    },
  ]
};
