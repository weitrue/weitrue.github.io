---
title: 【Go】数据库编程与ORM
categories: Golang
tags: [Go]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/golang/orm/index.png
banner_img: /images/img/banner.png
---

> <!-- more -->

#### 初始化

##### Open



#### 增删改查

##### 增删改

- Exec或者ExecContext
- ExecContext可以控制超时

##### 查询

- QueryRow和QueryRowContext查询单行数据
- Query和QueryContext查询多行数据
- Rows迭代器设计，for rows.Next()
- Row没有记录返回sql.ErrNoRow,Rows没有记录不会err

##### 自定义Json数据字段

- 字段自定义对象实现"database/sql/driver"包下Valuer interface的Value() (Value, error)方法，保存数据时可以在sql传参时不需要序列化
- 字段自定义对象实现"database/sql"包下Scanner interface的Scan(src any) error方法，查询数据时实现直接映射到对象

```go
import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
)

// JsonColumn 代表存储字段的 json 类型
// 主要用于没有提供默认 json 类型的数据库
// T 可以是结构体，也可以是切片或者 map
// 一切可以被 json 库所处理的类型都能被用作 T
type JsonColumn[T any] struct {
	Val   T
	Valid bool
}

// Value 返回一个 json 串。类型是 []byte
func (j JsonColumn[T]) Value() (driver.Value, error) {
	if !j.Valid {
		return nil, nil
	}
	return json.Marshal(j.Val)
}

// Scan 将 src 转化为对象
// src 的类型必须是 []byte, *[]byte, string, sql.RawBytes, *sql.RawBytes 之一
func (j *JsonColumn[T]) Scan(src any) error {
	var bs []byte
	switch val := src.(type) {
	case []byte:
		bs = val
	case *[]byte:
		bs = *val
	case string:
		bs = []byte(val)
	case sql.RawBytes:
		bs = val
	case *sql.RawBytes:
		bs = *val
	default:
		return fmt.Errorf("ekit：JsonColumn.Scan 不支持 src 类型 %v", src)
	}

	if err := json.Unmarshal(bs, &j.Val); err != nil {
		return err
	}
	j.Valid = true
	return nil
}
```

##### 事务

###### 隔离级别

- 序列化
- 可重复度
- 已提交读
- 未提交读



