---
title: 【Hadoop】Mac下开发环境配置
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 大数据    # 分类
tags: [Hadoop,大数据,mac,Java]  # 标签
index_img: /images/bdata/hadoop-dev-env/index.jpg
---

> <!-- more -->

### hdfs的java API开发环境准备

#### 修改hosts文件

- mac下修改hosts文件

  文件所在位置`/etc/hosts`

  将虚拟机中/etc/hosts文件一下内容，添加到以上hosts文件末尾

```
192.168.51.100 node01.hadoop.com node01
192.168.51.110 node02.hadoop.com node02
192.168.51.120 node03.hadoop.com node03
```

#### 安装jdk

拷贝集群环境下的jdk到本地

```
#添加以下配置内容，配置jdk环境变量
export JAVA_HOME=/weitrue/install/jdk1.8.0_141
export PATH=$PATH:$JAVA_HOME/binCopy
```

让修改马上生效

```
source /etc/profile
```

#### mac下hadoop环境配置

拷贝集群环境下`hadoop-2.6.0-cdh5.14.2`目录文件到本地，配置环境变量

![](/images/bdata/hadoop-dev-env/hadoop.png)

#### 安装maven

##### maven是什么？

Apache Maven是一个软件项目管理和理解工具。基于项目对象模型（POM）的概念，Maven可以从一个中心信息管理项目的构建，报告和文档。

##### 安装

解压安装包`apache-maven-3.6.1-bin.zip`到安装目录

编辑`.bash_profile`，新增maven环境配置

![](/images/bdata/hadoop-dev-env/maven.png)

###### maven的仓库

- 创建maven工程后，maven会自动的去本地仓库查看时候有所需的jar包，如果没有的话，默认去中央仓库，将jar包下载到本地；以后如果再次使用此jar时，就直接使用本地仓库的jar即可

- 此过程是maven自动完成的

- 本地仓库：

  ![](/images/bdata/hadoop-dev-env/repo.png)

- 私服仓库：就是我们自己搭建的一个远程仓库

- 中央仓库：是官方或者第三方提供的仓库

###### settings文件

- 声明文件规范

```xml
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
```

- 本地仓库路径

`<localRepository>/path/to/local/repo</localRepository>`

- Maven是否需要和用户交互以获得输入。如果Maven需要和用户交互以获得输入，则设置成true，反之则应为false。默认为true 

`<interactiveMode>true</interactiveMode>`

- 表示Maven是否需要在离线模式下运行。如果构建系统需要在离线模式下运行，则为true，默认为false。当由于网络设置原因或者安全因素，构建服务器不能连接远程仓库的时候，该配置就十分有用 

`<offline>false</offline>`

- 当插件的组织Id（groupId）没有显式提供时，供搜寻插件组织Id（groupId）的列表。该元素包含一个pluginGroup元素列表，每个子元素包含了一个组织Id（groupId）。

`pluginGroups`

- 为仓库列表配置的下载镜像列表 

`mirrors`

###### pom文件

```
<modelVersion>4.0.0</modelVersion>     项目的模板版本

<groupId>com.hadoop</groupId>         可以用这个来标识公司

<artifactId>TestFlume</artifactId>     可以标识工程的作用

<packaging>jar</packaging>             指定打包类型       

<version>1.0-SNAPSHOT</version>        制定项目版本

<dependencies>...</dependencies>       项目的依赖关系

<build></build>                        构建项目的信息
```

总项目/ pom.xml 总项目的pom配置文件 

子项目1/ pom.xml 子项目1的pom文件 

子项目2/ pom.xml 子项目2的pom文件 

###### maven简单的命令

mvn clean 

mvn clean package

mvn install:install-file -Dfile=junit-3.8.2.jar -DgroupId=junit -DartifactId=junit -Dversion=3.8.2 -Dpackaging=jar

如果依赖下载有问题，需要自己添加依赖包进仓库，不要复制粘贴，要用 mvn install这个命令将jar包打进仓库

##### 安装idea



