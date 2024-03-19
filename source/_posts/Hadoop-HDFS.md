---
title: 【Hadoop】HDFS:分布式文件系统
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 大数据    # 分类
tags: [Hadoop,大数据] # 标签
index_img: /images/bdata/hadoop-hdfs/index.jpg
---

>  HDFS is the primary distributed storage used by Hadoop applications. A HDFS cluster primarily consists of a NameNode that manages the file system metadata and DataNodes that store the actual data. The HDFS Architecture Guide describes HDFS in detail. This user guide primarily deals with the interaction of users and administrators with HDFS clusters. The HDFS architecture diagram depicts basic interactions among NameNode, the DataNodes, and the clients. Clients contact NameNode for file metadata or file modifications and perform actual file I/O directly with the DataNodes.<!-- more --> 

### 大数据全链路架构

数据在生产环境中的流向及处理流程

![](/images/bdata/hadoop-hdfs/image-20190629152840146.png)

### 大数据主流框架

1 第一代大数据框架: 各自为战

![](/images/bdata/hadoop-hdfs/image-20190629153348534.png)

2 第二代大数据计算框架

![](/images/bdata/hadoop-hdfs/image-20190629153652036.png)

3 第三代大数据计算框架 Flink

![](/images/bdata/hadoop-hdfs/image-20190629153835100.png)

###  Hadoop的架构模块

<div align=center>
  <img src="/images/bdata/hadoop-hdfs/image-20200414134203318.png" alt="image-20200414134203318" style="zoom:50%;align: center"/>
</div>



- Hadoop由三个模块组成：***分布式***存储HDFS、分布式计算MapReduce、资源调度引擎Yarn

<div align="center">
  <img src="/images/bdata/hadoop-hdfs/image-20200414134230170.png" alt="image-20200414134230170" style="zoom: 33%;align: center"/>
</div>



```
- HDFS模块：
  -  namenode：主节点，主要负责集群的管理以及元数据信息管理
  -  datanode：从节点，主要负责存储用户数据
  -  secondaryNameNode：辅助namenode管理元数据信息，以及元数据信息的冷备份
- Yarn模块：
  - ResourceManager：主节点，主要负责资源分配
  - NodeManager：从节点，主要负责执行任务
```

###  HDFS功能模块

#### hdfs的架构

##### 文件分块存储&3副本

![](/images/bdata/hadoop-hdfs/block3.gif)



![](/images/bdata/hadoop-hdfs/image-20200414151438737.png)

- 保存文件到HDFS时，会先默认按***128M***的大小对文件进行切分；效果如上图
  - 数据以block块的形式进统一存储管理，每个block块默认最多可以存储128M的文件。
  - 如果有一个文件大小为1KB，也是要占用一个block块，但是实际占用磁盘空间还是1KB大小，类似于有一个水桶可以装128斤的水，但是我只装了1斤的水，那么我的水桶里面水的重量就是1斤，而不是128斤

- 每个block块的元数据大小大概为150字节

- 所有的文件都是以block块的方式存放在HDFS文件系统当中，在hadoop1当中，文件的block块默认大小是64M，hadoop2当中，文件的block块大小默认是128M，block块的大小可以通过hdfs-site.xml当中的配置文件进行指定

```xml
    <property>
        <name>dfs.block.size</name>
        <value>块大小 以字节为单位</value><!-- 只写数值就可以 -->
    </property>
```

- 为了保证block块的安全性，也就是数据的安全性，在hadoop2当中，文件默认保存***三个副本***，我们可以更改副本数以提高数据的安全性

- 在hdfs-site.xml当中修改以下配置属性，即可更改文件的副本数

```xml
    <property>
          <name>dfs.replication</name>
          <value>3</value>
    </property>
```

##### 抽象成数据块的好处

1. 一个文件有可能大于集群中任意一个磁盘 
   10T*3/128 = xxx块 2T，2T，2T 文件方式存—–>多个block块，这些block块属于一个文件

2. 使用块抽象而不是文件可以简化存储子系统

   hdfs将所有的文件全部抽象成为block块来进行存储，不管文件大小，全部一视同仁都是以block块的形式进行存储，方便我们的分布式文件系统对文件的管理

3. 块非常适合用于数据备份进而提供数据容错能力和可用性

##### HDFS架构

![](/images/bdata/hadoop-hdfs/image-20200416160250256.png)

- HDFS集群包括，NameNode和DataNode以及Secondary Namenode。
  - NameNode负责管理整个文件系统的元数据，以及每一个路径（文件）所对应的数据块信息。
  - DataNode 负责管理用户的文件数据块，每一个数据块都可以在多个datanode上存储多个副本。
  - Secondary NameNode用来监控HDFS状态的辅助后台程序，每隔一段时间获取HDFS元数据的快照。最主要作用是辅助namenode管理元数据信息
- NameNode与Datanode的总结概述

![](/images/bdata/hadoop-hdfs/image-20200416160339310.png)

##### 扩展

块缓存

- 通常DataNode从磁盘中读取块，但对于访问频繁的文件，其对应的块可能被显示的缓存在DataNode的内存中，以堆外块缓存的形式存在。默认情况下，一个块仅缓存在一个DataNode的内存中，当然可以针对每个文件配置DataNode的数量。作业调度器通过在缓存块的DataNode上运行任务，可以利用块缓存的优势提高读操作的性能。

  例如： 
   连接（join）操作中使用的一个小的查询表就是块缓存的一个很好的候选。 
   用户或应用通过在缓存池中增加一个cache directive来告诉namenode需要缓存哪些文件及存多久。缓存池（cache pool）是一个拥有管理缓存权限和资源使用的管理性分组

hdfs的文件权限验证

- hdfs的文件权限机制与linux系统的文件权限机制类似

  r:read  w:write x:execute 权限x对于文件表示忽略，对于文件夹表示是否有权限访问其内容

  如果linux系统用户zhangsan使用hadoop命令创建一个文件，那么这个文件在HDFS当中的owner就是zhangsan

  HDFS文件权限的目的，防止好人做错事，而不是阻止坏人做坏事。HDFS相信你告诉我你是谁，你就是谁

#### HDFS的shell命令操作

- HDFS命令有两种风格：
  - hadoop fs开头的
  - hdfs dfs开头的
  - 两种命令均可使用，效果相同

查看hdfs或hadoop子命令的帮助信息，如ls子命令

```shell
hdfs dfs -help ls
hadoop fs -help ls #两个命令等价
```

查看hdfs文件系统中指定目录的文件列表。对比linux命令ls

```shell
hdfs dfs -ls /
hadoop fs -ls /
hdfs dfs -ls -R /
```

在hdfs文件系统中创建文件

```shell
hdfs dfs -touchz /edits.txt
```

向HDFS文件中追加内容

```shell
hadoop fs -appendToFile edit1.xml /edits.txt #将本地磁盘当前目录的edit1.xml内容追加到HDFS根目录 的edits.txt文件
```

查看HDFS文件内容

```shell
hdfs dfs -cat /edits.txt
```

从本地路径上传文件至HDFS

```shell
#用法：hdfs dfs -put /本地路径 /hdfs路径
hdfs dfs -put /linux本地磁盘文件 /hdfs路径文件
hdfs dfs -copyFromLocal /linux本地磁盘文件 /hdfs路径文件  #跟put作用一样
hdfs dfs -moveFromLocal /linux本地磁盘文件 /hdfs路径文件  #跟put作用一样，只不过，源文件被拷贝成功后，会被删除
```

在hdfs文件系统中下载文件

```shell
hdfs dfs -get /hdfs路径 /本地路径
hdfs dfs -copyToLocal /hdfs路径 /本地路径  #根get作用一样
```

在hdfs文件系统中创建目录

```shell
hdfs dfs -mkdir /shell
```

在hdfs文件系统中删除文件

```shell
hdfs dfs -rm /edits.txt
```

在hdfs文件系统中修改文件名称（也可以用来移动文件到目录）

```shell
hdfs dfs -mv /xcall.sh /call.sh
hdfs dfs -mv /call.sh /shell
```

在hdfs中拷贝文件到目录

```shell
hdfs dfs -cp /xrsync.sh /shell
```

递归删除目录

```shell
hdfs dfs -rm -r /shell
```

列出本地文件的内容（默认是hdfs文件系统）

```shell
hdfs dfs -ls file:///home/hadoop/
```

查找文件

```shell
# linux find命令
find . -name 'edit*'
# HDFS find命令
hadoop fs -find / -name part-r-00000 # 在HDFS根目录中，查找part-r-00000文件
```

#### HDFS安全模式

- 安全模式是HDFS所处的一种特殊状态，在这种状态下，文件系统只接受读数据请求，而不接受删除、修改等变更请求。在NameNode主节点启动时，HDFS首先进入安全模式，DataNode在启动的时候会向namenode汇报可用的block等状态，当整个系统达到安全标准时，HDFS自动离开安全模式。如果HDFS出于安全模式下，则文件block不能进行任何的副本复制操作，因此达到最小的副本数量要求是基于datanode启动时的状态来判定的，启动时不会再做任何复制（从而达到最小副本数量要求），hdfs集群刚启动的时候，默认30S钟的时间是出于安全期的，只有过了30S之后，集群脱离了安全期，然后才可以对集群进行操作
- 何时推出安全模式
  - namenode知道集群共多少个block（不考虑副本），假设值是total；
  - namenode启动后，会上报block report，namenode开始累加统计满足最小副本数（默认1）的block个数，假设是num
  - 当num/total > 99.9%时，推出安全模式

```shell
[hadoop@node01 hadoop]$ hdfs dfsadmin -safemode  
Usage: hdfs dfsadmin [-safemode enter | leave | get | wait]
```

#### NameNode和SecondaryNameNode

##### namenode与secondaryName

- NameNode主要负责集群当中的元数据信息管理，而且元数据信息需要经常随机访问，因为元数据信息必须高效的检索，那么如何保证namenode快速检索呢？？元数据信息保存在哪里能够快速检索呢？？如何保证元数据的持久安全呢？？

- 为了保证元数据信息的快速检索，那么我们就必须将元数据存放在内存当中，因为在内存当中元数据信息能够最快速的检索，那么随着元数据信息的增多（每个block块大概占用150字节的元数据信息），内存的消耗也会越来越多。

- 如果所有的元数据信息都存放内存，服务器断电，内存当中所有数据都消失，为了保证元数据的安全持久，元数据信息必须做可靠的持久化，在hadoop当中为了持久化存储元数据信息，将所有的元数据信息保存在了FSImage文件当中，那么FSImage随着时间推移，必然越来越膨胀，FSImage的操作变得越来越难，为了解决元数据信息的增删改，hadoop当中还引入了元数据操作日志edits文件，edits文件记录了客户端操作元数据的信息，随着时间的推移，edits信息也会越来越大，为了解决edits文件膨胀的问题，hadoop当中引入了secondaryNamenode来专门做fsimage与edits文件的合并

![](/images/bdata/hadoop-hdfs/checkpoint.gif)

##### namenode工作机制

（1）第一次启动namenode格式化后，创建fsimage和edits文件。如果不是第一次启动，直接加载编辑日志和镜像文件到内存。

（2）客户端对元数据进行增删改的请求

（3）namenode记录操作日志，更新滚动日志。

（4）namenode在内存中对数据进行增删改查

##### Secondary NameNode工作

（1）Secondary NameNode询问namenode是否需要checkpoint。直接带回namenode是否检查结果。

（2）Secondary NameNode请求执行checkpoint。

（3）namenode滚动正在写的edits日志

（4）将滚动前的编辑日志和镜像文件拷贝到Secondary NameNode

（5）Secondary NameNode加载编辑日志和镜像文件到内存，并合并。

（6）生成新的镜像文件fsimage.chkpoint

（7） 拷贝fsimage.chkpoint到namenode

（8）namenode将fsimage.chkpoint重新命名成fsimage

##### FSImage与edits详解

- 所有的元数据信息都保存在了FsImage与Eidts文件当中，这两个文件就记录了所有的数据的元数据信息，元数据信息的保存目录配置在了hdfs-site.xml当中

```xml
<property>
  <name>dfs.namenode.name.dir</name>
  <value>file:///weitrue/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas</value>
</property>
<property>
   <name>dfs.namenode.edits.dir</name>
   <value>file:///weitrue/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits</value>
</property>
```

- 客户端对hdfs进行写文件时会首先被记录在edits文件中。

  edits修改时元数据也会更新。

  每次hdfs更新时edits先更新后客户端才会看到最新信息。

  fsimage:是namenode中关于元数据的镜像，一般称为检查点。

  一般开始时对namenode的操作都放在edits中，为什么不放在fsimage中呢？

  因为fsimage是namenode的完整的镜像，内容很大，如果每次都加载到内存的话生成树状拓扑结构，这是非常耗内存和CPU。

  fsimage内容包含了namenode管理下的所有datanode中文件及文件block及block所在的datanode的元数据信息。随着edits内容增大，就需要在一定时间点和fsimage合并。

##### FSimage文件当中的文件信息查看

- 官方查看文档

  [http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.2/hadoop-project-dist/hadoop-hdfs/HdfsImageViewer.html](http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.0/hadoop-project-dist/hadoop-hdfs/HdfsImageViewer.html)

- 使用命令 hdfs oiv 

```shell
cd  /weitrue/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas/current
hdfs oiv -i fsimage_0000000000000000864 -p XML -o hello.xml
```

##### edits当中的文件信息查看

- 官方查看文档

  [http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.2/hadoop-project-dist/hadoop-hdfs/HdfsEditsViewer.html](http://archive.cloudera.com/cdh5/cdh/5/hadoop-2.6.0-cdh5.14.0/hadoop-project-dist/hadoop-hdfs/HdfsEditsViewer.html)

- 查看命令 hdfs oev

```shell
cd /weitrue/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/dfs/nn/edits
hdfs oev -i edits_0000000000000000865-0000000000000000866 -o myedit.xml -p XML
```

##### secondarynameNode如何辅助管理FSImage与Edits文件

##### namenode元数据信息多目录配置

- 为了保证元数据的安全性，我们一般都是先确定好我们的磁盘挂载目录，将元数据的磁盘做RAID1

  namenode的本地目录可以配置成多个，且每个目录存放内容相同，增加了可靠性。

- 具体配置如下：

  hdfs-site.xml

```xml
<property>
   <name>dfs.namenode.name.dir</name>
   <value>file:///weitrue/install/hadoop-2.6.0-cdh5.14.2/hadoopDatas/namenodeDatas</value>
</property>
```

