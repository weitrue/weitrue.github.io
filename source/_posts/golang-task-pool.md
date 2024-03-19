---
title: 【Go】池化
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: Golang   # 分类
tags: [Go,Task,Pool] # 标签
index_img: /images/golang/gopher-share.png
---

> <!-- more -->

### 任务池



### 连接池

#### Get

- 获取到空闲连接后，需要判断连接是否超时以及失效，超时或者失效，重新从连接池中获取
- 阻塞时，可以加入超时控制，超过一定时间，获取连接失败
- 阻塞时，当有连接归还时，唤醒阻塞的Goroutine

```flow
s=>start: 开始
op1=>operation: 创建连接
op2=>operation: 阻 塞
op3=>operation: 唤 醒
e=>end: 返回连接

cond1=>condition: 有空闲的？
cond2=>condition: 超过最大数量?

s->cond1
cond1(yes,right)->e
cond1(no)->cond2
cond2(no,left)->op1->e
cond2(yes)->op2->op3->e
```



Put

```flow
s=>start: 开始
op1=>operation: 唤醒请求
op2=>operation: 转交连接
op3=>operation: 关闭连接
op4=>operation: 放回队列
e=>end: 结束

cond1=>condition: 有阻塞请求？
cond2=>condition: 超空闲队列满了?

s->cond1
cond1(yes,right)->op1->op2->e
cond1(no)->cond2
cond2(yes,right)->op3->e
cond2(no)->op4->e
```



[silenceper](https://github.com/silenceper/pool)
