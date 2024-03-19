---
title: 【Go】设计模式
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: [设计模式,Golang] # 分类
tags: [Go,设计模式]           # 标签
index_img: /images/golang/gopher-build.png
---

> **Design patterns** are typical solutions to common problemsin software design. Each pattern is like a blueprintthat you can customize to solve a particulardesign problem in your code.<!-- more --> 

### 创建型

#### Method(工厂方法)

执行单独的函数，通过传参提供需要的对象的信息。



#### Abstract Factory(抽象工厂: 解决复杂对象创建问题)

工厂方法适合对象种类较少的情况，如果有多种不同类型对象需要创建，使用抽象工厂模式。



#### The Builder Pattern(构造模式: 控制复杂对象的构造)

当对象需要多个部分组合起来一步步创建，并且创建和表示分离的时候。可以这么理解，你要买电脑，工厂模式直接返回一个你需要型号的电脑，但是构造模式允许你自定义电脑各种配置类型，组装完成后给你。这个过程可以传入builder从而自定义创建的方式。



#### 单例模式: 使得一个类最多生成一个实例

装饰器实现



#### The Prototype Pattern(原型模式:解决对象拷贝问题)



### 行为型

#### The Observer Pattern(观察者模式：用来处理多个对象之间的发布订阅问题)



#### The State Pattern(状态模式：实现有限状态机)



#### The Strategy Pattern(策略模式：动态选择算法策略)



#### The Chain of Responsibility Pattern (责任链模式:创建链式对象用来接收广播消息)



#### The Command Pattern(命令模式：用来给应用添加Undo操作)



#### The Interpreter Pattern(解释器模式：用来实现Domain Specific Language(DSL))



#### The Template Pattern(模板模式：抽象出算法公共部分从而实现代码复用)



### 结构性

#### The Adapter Pattern(适配器模式: 解决接口不兼容问题)



#### The Decorator Pattern(装饰器模式： 无需子类化实现扩展对象功能问题)

```go
```



#### The Facade Pattern(外观模式: 简化复杂对象的访问问题)



#### The Flyweight Pattern(享元模式: 实现对象复用从而改善资源使用)



#### The Model-View-Controller Pattern(mvc模式：解耦展示逻辑和业务逻辑)



#### The Proxy Pattern(代理模式：通过一层间接保护层实现更安全的接口访问）



