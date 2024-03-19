---
title: 整理golang基础知识及linux、后端开发相关资料
layout: 混沌日记
banner_img: /images/img/bookstack.jpg
---

### Golang

#### 数据类型

##### slice

{% note success %}

[Reslice](https://mp.weixin.qq.com/s/H3UzcKX2-Q4ywD_RJvMmEA)

{% endnote %}

##### map

{% note success %}

{% endnote %}

##### struct

{% note success %}

{% endnote %}

##### channel

{% note success %}

[底层原理](https://mp.weixin.qq.com/s/tj02XI9L1dSKrUsy5E2OWg)

{% endnote %}

##### interface

{% note success %}

[煎鱼-面试题](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzUxMDI4MDc1NA==&action=getalbum&album_id=1751854579329056768&scene=173&from_msgid=2247489686&from_itemidx=1&count=3&nolastread=1#wechat_redirect)

[煎鱼-gRPC](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&album_id=1383472721040064512&__biz=MzUxMDI4MDc1NA==#wechat_redirect)

[煎鱼-Gin](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&album_id=1383459655464337409&__biz=MzUxMDI4MDc1NA==#wechat_redirect)

[设计模式](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzUzNTY5MzU2MA==&action=getalbum&album_id=2531498848431669249&scene=173&from_msgid=2247497560&from_itemidx=1&count=3&nolastread=1#wechat_redirect)

[并发编程](https://mp.weixin.qq.com/mp/homepage?__biz=MzUzNTY5MzU2MA==&hid=5&sn=30c2bc7579f99f335712e389cdeafae9&scene=18#wechat_redirect)

[Docker](https://mp.weixin.qq.com/mp/homepage?__biz=MzUzNTY5MzU2MA==&hid=4&sn=50e7262b2287824c4367086e672c8496&scene=18#wechat_redirect)

[技术文章摘抄](https://learn.lianglianglee.com/)

{% endnote %}

#### 内存分配

{% note success %}

[分配器](https://mp.weixin.qq.com/s/TO_lmlFbVDgFmns9s_mMzw)

[内存管理分析](https://mp.weixin.qq.com/s/rydO2JK-r8JjG9v_Uy7gXg)

[变量分配到哪里](https://mp.weixin.qq.com/s/bZ06N2Cvl5HFxhDMMX1ReA)

[内存逃逸](https://mp.weixin.qq.com/s/MepbrrSlGVhNrEkTQhfhhQ)

[本地内存](https://mp.weixin.qq.com/s/lAE7im2NSZm-I_7BdVlFng)

{% endnote %}

#### 调度器

##### goroutine

{% note success %}

[goroutine 泄露](https://mp.weixin.qq.com/s/5q5eIMDHz35ycTBTkB33JQ)

[性能分析](https://mp.weixin.qq.com/s/zEtK5uAd40vD-hcWrQDsmw)

{% endnote %}

##### G-P-M 模型

{% note success %}

{% endnote %}

![](/bookstack/img/gpm.png)

##### 垃圾回收

{% note success %}

[Go垃圾回收、三色标记原理](https://mp.weixin.qq.com/s/srY28v3U-hDr_brV4_BWww)

[白话Go的垃圾回收原理](https://mp.weixin.qq.com/s/s8_RWA_D-I03AnBZNF9utg)

[码农翻身|漫画](https://mp.weixin.qq.com/s/FQ25hro703sSNYTp-vfAwg)

{% endnote %}

#### 并发模型

{% note success %}

[流水线模型](https://mp.weixin.qq.com/s/IuGaKbQvW7z1KsoMhB8mgg)

[golang 5种原子操作](https://juejin.cn/post/7010590496204521485?utm_source=gold_browser_extension)

[sync.pool](https://mp.weixin.qq.com/s/6EuVw5rw7WdolZx_WWnr-Q)

{% endnote %}

#### 单元测试

{% note success %}

[腾讯技术工程|详解](https://mp.weixin.qq.com/s/eAptnygPQcQ5Ex8-6l0byA)

[腾讯技术工程|手把手教你如何进行 Golang 单元测试](https://mp.weixin.qq.com/s/N5wby-aWWEPc7mHN_lN3lQ)

[阿里技术|压测](https://www.instana.com/blog/practical-golang-benchmarks/)

[误区与实践](https://mp.weixin.qq.com/s/k8WNWpCIVl4xTmP3TQ_gxQ)

[最佳实践](https://mp.weixin.qq.com/s/DbKXka598YVDJHSFCcQOSQ)

[Go Test小技巧](https://mp.weixin.qq.com/s/y3UKaLD40A7C89GkGq7GKQ)

{% endnote %}

#### 调试进阶

{% note success %}

[golang 调试分析的高阶技巧](https://mp.weixin.qq.com/s/j0ZWlctxzx_yNhJb__hciA)

[如何保留 Go 程序崩溃现场](https://mp.weixin.qq.com/s/RktnMydDtOZFwEFLLYzlCA)

{% endnote %}

#### 设计规范

{% note success %}

[option设计](https://mp.weixin.qq.com/s/mzI8-KoRBhH-fGdfcyqI-w)

{% endnote %}

#### 开源库

{% note success %}

##### [go-zero](https://github.com/zeromicro/go-zero/blob/master/readme-cn.md)

`go-zero`一款企业框架，我们可以从中学习到值得借鉴的的设计；它集成了`web`和`rpc`框架，是在`20`年由好未来开源的一款微服务框架，由于`go-zero`项目还是比较大的，最好带着目的性去学习，比如我想了解微服务注册与发现的原理实现、自适应负载均衡算法原理与实现。

[Go-Zero 是如何追踪请求链路](https://mp.weixin.qq.com/s/MlJRr3UZqRADyi15sHwPVA)

{% endnote %}

{% note primary %}

##### [jupiter](http://jupiter.douyu.com/jupiter/)

`Jupiter` 是斗鱼开源的一套微服务治理框架，提供丰富的后台功能，管理应用的资源、配置，应用的性能、配置等可视化。

{% endnote %}

{% note primary %}

##### [zinx](https://github.com/aceld/zinx)

`zinx`是一个基于`Go`语言开发的`TCP`长连接服务器框架，其可以应用在游戏领域或其他长连接领域；我们可以学习`zinx`框架的设计思路，他有完整的视频教程和文档，通过这个我们可以完全理解如何设计一个轻量级并发服务器。

文档地址：https://www.kancloud.cn/aceld/zinx

视频地址：https://www.bilibili.com/video/av71067087

{% endnote %}

{% note primary %}

##### [go-nsq](https://github.com/nsqio/go-nsq)

`NSQ`是一个基于Go语言的分布式实时消息平台，可用于大规模系统中的实时消息服务，并且每天能够处理数亿级别的消息，其设计目标是为在分布式环境下运行的去中心化服务提供一个强大的基础架构。

学习地址：https://cloud.tencent.com/developer/article/1735996

{% endnote %}

{% note primary %}

##### [Tidb](https://github.com/pingcap/tidb)

`Tidb`是`NewSQL`行业中的代表性产品，由`PingCAP`公司自主设计、研发的开源分布式关系型数据库，兼容MySQL 5.7 协议和 MySQL 生态等重要特性。目前很多公司都在使用`Tidb`，解决了关系型数据库、弹性扩展以及全球分布的问题。`Tidb`采用`Go`语言开发`SQL`层，下边的分布式存储引擎使用`rust`语言，使用`Tidb`具有以下优势：

- 支持弹性的扩缩容；
- 支持 SQL，兼容大多数 MySQL 的语法，在大多数场景下可以直接替换 MySQL；
- 默认支持高可用，自动进行数据修复和故障转移；
- 支持 ACID 事务；

文档地址：https://docs.pingcap.com/zh/tidb/stable

{% endnote %}

{% note primary %}

##### [kubernetes](https://github.com/kubernetes/kubernetes)

`Kubernetes` 是一个可移植的、可扩展的开源平台，用于管理容器化的工作负载和服务，可促进声明式配置和自动化。`Kubernetes` 拥有一个庞大且快速增长的生态系统；`Kubernetes`由于是`Go`语言编写，可以从源码开始学习，配合着官方文档，仔细专研一番。

官网文档：https://kubernetes.io/docs/home/

中文文档：https://kubernetes.io/zh/docs/concepts/overview/what-is-kubernetes/

{% endnote %}

{% note primary %}

##### [Prometheus](https://github.com/prometheus/prometheus)

`Prometheus` 是`Cloud Native Computing Foundation` 的一个项目，是一个系统和服务监控系统。它以给定的时间间隔从配置的目标收集指标，评估规则表达式，显示结果，并可以在观察到指定条件时触发警报。

文档地址：https://prometheus.io/blog/

中文文档：https://yunlzheng.gitbook.io/prometheus-book/

{% endnote %}

{% note primary %}

##### [Zinc](https://github.com/prabhatsharma/zinc)

`Zinc` 是一个全文索引的搜索引擎。它是` Elasticsearch` 的轻量级替代品，可以在不到 100 MB 的` RAM` 中运行。它使用 `bluge `作为底层索引库。

而且，`Zinc` 使用 Vue 打造了一个比 `Elasticsearch` 更简单、更易于操作的界面。

Zinc 主要有如下特性：

- 提供全文索引功能
- 单个二进制文件即可安装、运行，支持多平台。这得益于 Go 语言
- 用 Vue 编写的用于查询数据的 Web UI
- 与 Elasticsearch 兼容的数据获取 API（单记录和批量 API）
- 开箱即用的身份验证
- Schema less - 无需预先定义 schema，同一索引中的不同文档可以有不同的字段

{% endnote %}

### linux

### 网络知识

### 数据库
