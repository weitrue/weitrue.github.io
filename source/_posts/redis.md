---
title: 【数据库】Redis学习笔记
comments: false        # 是否可评论
toc: true              # 是否显示文章目录
categories: Datebase   # 分类
tags: [Datebase,Redis] # 标签
index_img: /images/db/redis/top.png
---

> Remote DictIOnary Server（远程数据服务），是一个基于内存且支持持久化的高性能 key-value 数据库<!-- more -->

![](/images/db/redis/top.png)

### Redis安装

#### 单机版redis环境安装

环境准备:

  系统：centos7 

##### 下载redis安装包

node01服务器执行以下命令下载redis安装包

~~~zsh
cd /weitrue/soft
wget http://download.redis.io/releases/redis-6.0.1.tar.gz
~~~

#####  解压redis压缩包到指定目录

~~~zsh
#node01执行以下命令进行解压redis
cd /weitrue/soft
tar -zxvf redis-6.0.1.tar.gz -C ../install/
~~~

##### 安装C程序运行环境

node01执行以下命令安装C程序运行环境

~~~shell
su root
yum -y install gcc-c++
# 查看gcc版本是否在5.3以上，centos7.6默认安装4.8.5
gcc -v
# 升级gcc到5.3及以上,如下：
#升级到gcc 9.3：
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils

scl enable devtoolset-9 bash
需要注意的是scl命令启用只是临时的，退出shell或重启就会恢复原系统gcc版本。
如果要长期使用gcc 9.3的话：

echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile
#这样退出shell重新打开就是新版的gcc了
~~~

##### 安装较新版本的tcl

下载安装较新版本的tcl

###### 使用压缩包进行安装（不推荐）

~~~shell
#node01执行以下命令下载tcl安装包
cd /weitrue/soft
wget http://downloads.sourceforge.net/tcl/tcl8.6.1-src.tar.gz
#解压tcl
tar -zxvf tcl8.6.1-src.tar.gz -C ../install/
#进入指定目录
cd ../install/tcl8.6.1/unix/
./configure
make  && make  install
~~~

###### 在线安装tcl（墙裂推荐）

node01执行以下命令在线安装tcl

~~~shell
sudo yum  -y  install  tcl
~~~

##### 进行编译redis

~~~shell
# node01执行以下命令进行编译：
cd /weitrue/install/redis-6.0.1/
# make MALLOC=libc   或者使用命令  make  进行编译
make test && make install
~~~

##### 修改redis配置文件

~~~shell
# node01执行以下命令修改redis配置文件
cd /weitrue/install/redis-6.0.1/
mkdir -p /weitrue/install/redis-6.0.1/logs
mkdir -p /weitrue/install/redis-6.0.1/redisdata
vim redis.conf
bind node01
daemonize yes
pidfile /weitrue/install/redis-6.0.1/redis_6379.pid
logfile "/weitrue/install/redis-6.0.1/logs/redis.log"
dir /weitrue/install/redis-6.0.1/redisdata
~~~

`daemonize yes`: redis采用的是单进程多线程的模式。
当redis.conf中选项daemonize设置成yes时，代表开启守护进程模式。在该模式下，redis会在后台运行，并将进程pid号写入至redis.conf选项pidfile设置的文件中，此时redis将一直运行，除非手动kill该进程。
`daemonize no`: 当daemonize选项设置成no时，当前界面将进入redis的命令行界面，exit强制退出或者关闭连接工具(putty,xshell等)都会导致redis进程退出。

##### 启动redis

node01执行以下命令启动redis

~~~shell
cd  /weitrue/install/redis-6.0.1
src/redis-server  redis.conf
# 查看进程
ps aux|grep redis
或者
ps -ef | grep redis | grep -v "grep"  # 加上| grep -v "grep"，是指不看grep进程
~~~

##### 连接redis客户端

node01执行以下命令连接redis客户端

~~~shell
cd /weitrue/install/redis-6.0.1
src/redis-cli -h node01
~~~

#### redis的操作命令

~~~shell
#检测redis服务是否启动
PING
#设置key、value
SET KEY_NAME VALUE
#删除
del key
#获取key是否存在
exists key
#获取key的类型
type key
#为key改名
rename key newkey
renamenx key newkey
#切换数据库
select index
#退出客户端
quit
~~~

### **redis的数据类型**

Redis支持的常用5种数据类型指的是value类型，分别为：**字符串String、列表List、哈希Hash、集合Set、有序集合Zset**，但是Redis后续又丰富了几种数据类型分别是Bitmaps、HyperLogLogs、GEO。

 由于Redis是基于标准C写的，只有最基础的数据类型，因此Redis为了满足对外使用的5种数据类型，开发了属于自己**独有的一套基础数据结构**，使用这些数据结构来实现5种数据类型。

Redis为了平衡空间和时间效率，针对value的具体类型在底层会采用不同的数据结构来实现，其中哈希表和压缩列表是复用比较多的数据结构，如下图展示了对外数据类型和底层数据结构之间的映射关系：

![](/images/db/redis/wps4.jpg)

从图中可以看到ziplist压缩列表可以作为Zset、Set、List三种数据类型的底层实现，看来很强大，压缩列表是一种为了节约内存而开发的且经过特殊编码之后的连续内存块顺序型数据结构，底层结构还是比较复杂的。

#### redis当中各种数据类型的操作

redis自身是一个Map，其中所有的数据都是采用key : value 的形式存储

![](/images/db/redis/image-20200529015634835.png)

#### 字符串

```
存储的数据：单个数据，最简单的数据存储类型，也是最常用的数据存储类型
存储数据的格式：一个存储空间保存一个数据
存储内容：通常使用字符串，如果字符串以整数的形式展示，可以作为数字操作使用
```

![](/images/db/redis/image-20200529020001463.png)

下表列出了常用的 redis 字符串命令

```shell
1.SET key value: 设置指定`key`的值,O(1)。示例：`SET hello world`

2.GET key:获取指定`key`的值,O(1)。示例：`GET hello`

3.GETRANGE key start end:返回`key`中字符串值的子字符,包含end。示例：`GETRANGE hello 0 3`

4.GETSET key value:将给定`key`的值设为`value`，并返回`key`的旧值(old value)。示例：`GETSET hello world2`

5.MGET key1 [key2...]:获取所有(一个或多个)给定`key`的值。示例：`MGET hello world`

6.SETEX key seconds value:将值`value`关联到`key`，并将`key`的过期时间设为 seconds (以秒为单位)。示例：`SETEX hello 10 world3`

7.SETNX key value: 只有在`key`不存在时设置`key`的值。示例：`SETNX weitrue 1`

8.SETRANGE key offset value: 用 value 参数覆写给定 key 所储存的字符串值，从偏移量`offset`开始。示例：`SETRANGE weitrue 0 helloredis`

9.STRLEN key: 返回`key所储存的字符串值的长度,O(1)。示例：`STRLEN weitrue`

10.MSET key value [key value ...]:同时设置一个或多个`key-value`对，原子操作。示例：`MSET weitrue2 weitruevalue2 weitrue3 weitruevalue3`

11.MSETNX key value [key value ...]:同时设置一个或多个`key-value`对，当且仅当所有给定 key 都不存在。示例：`MSETNX weitrue4 weitruevalue4 weitrue5 weitruevalue5`

12.PSETEX key milliseconds value:这个命令和 SETEX 命令相似，但它以毫秒为单位设置`key`的生存时间，而不是像`SETEX`命令那样，以秒为单位。示例：`PSETEX weitrue6 6000 weitrue6value`

13.INCR key:将 key 中储存的数字值增一, 可用于分布式id等。示例：`set weitrue 1`,`INCR weitrue`,`GET weitrue` 

14.INCRBY key increment:将`key`所储存的值加上给定的增量值（increment）。示例：`INCRBY weitrue 2`, `get weitrue`

15.INCRBYFLOAT key increment: 将`key`所储存的值加上给定的浮点增量值（increment）。示例：`INCRBYFLOAT weitrue 0.8`

16.DECR key:将`key`中储存的数字值减一。示例：`set weitrue 1`, `DECR weitrue`, `GET weitrue`

17.DECRBY key: `key`所储存的值减去给定的减量值（decrement） 。示例：`DECRBY weitrue 3`

18.APPEND key value: 如果`key`已经存在并且是一个字符串， APPEND 命令将指定的`value`追加到该`key`原来值（value）的末尾。示例：`APPEND weitrue hello`
```

#### 对key的操作

下表给出了与 Redis 键相关的基本命令：

- `dbsize`：计算key的总数，O(1)

```shell
DEL key: 该命令用于在`key`存在时删除`key`。示例：`del weitrue`

DUMP key: 序列化给定`key`，并返回被序列化的值。示例：`DUMP key`
EXISTS key: 检查给定 key 是否存在。示例：`exists weitrue`

EXPIRE key seconds: 为给定`key`设置过期时间，以秒计。示例：`expire weitrue 5`

PEXPIRE key milliseconds: 设置`key`的过期时间以毫秒计。示例：`PEXPIRE set2 3000000`

KEYS pattern: 查找所有符合给定模式(pattern)的`key`。示例：`keys *`

PERSIST key: 移除`key`的过期时间，`key`将持久保持。示例：`persist set2`

PTTL key: 以毫秒为单位返回`key`的剩余的过期时间。示例：`pttl  set2`

TTL key: 以秒为单位，返回给定`key`的剩余生存时间(TTL, time to live)。示例：`ttl set2`

RANDOMKEY: 从当前数据库中随机返回一个`key`。示例： `randomkey`

RENAME key newkey: 修改`key`的名称示例：`rename set5 set8`

RENAMENX key newkey: 仅当`newkey`不存在时，将`key`改名为`newkey`。示例：`renamenx  set8 set10`

TYPE key: 返回`key`所储存的值的类型。示例：`type  set10`
```

#### hash列表的操作

~~~
Redis hash 是一个string类型的field和value的映射表，hash特别适合用于存储对象。
Redis 中每个 hash 可以存储 232 - 1 键值对（40多亿）
~~~

下表列出了 redis hash 基本的相关命令：

```shell
HSET key field value: 将哈希表 `key` 中的字段 `field` 的值设为 `value` 。示例：`HSET key1 field1 value1`

HSETNX key field value: 只有在字段 `field` 不存在时，设置哈希表字段的值。示例：`HSETNX key1 field2 value2`

HMSET key field1 value1 [field2 value2 ...]: 同时将多个`field-value`(域-值)对设置到哈希表`key`中, O(n)。示例：`HMSET key1 field3 value3 field4 value4`

HEXISTS key field: 查看哈希表`key`中，指定的字段是否存在。示例：`HEXISTS key1 field4HEXISTS key1 field6`

HGET key field: 获取存储在哈希表中指定字段的值。示例：`HGET key1 field4`

HGETALL key: 获取在哈希表中指定 `key` 的所有字段和值。示例：`HGETALL key1`

HKEYS key: 获取所有哈希表中的字段。示例：`HKEYS key1`

HLEN key: 获取哈希表中字段的数量。示例：`HLEN key1`

HMGET key field1 [field2 ...]: 获取所有给定字段的值, O(n)。示例：`HMGET key1 field1 field2`

HINCRBY key field increment: 为哈希表`key`中的指定字段的整数值加上增量`increment`。示例：`HSET key2 field1 1HINCRBY key2 field1 1HGET key2 field1`

HINCRBYFLOAT key field increment: 为哈希表`key`中的指定字段的浮点数值加上增量`increment`。示例：`HINCRBYFLOAT key2 field1 0.8`

HVALS key: 获取哈希表中所有值。示例：`HVALS key1`

HDEL key field1 [field2 ...]: 删除一个或多个哈希表字段。示例：`HDEL key1 field1	HVALS key1`
```

 ~~~shell
node01:6379> HSET app:mytest1 test1 "123"
OK
node01:6379> HGET app:mytest test1
"123"
 ~~~

#### list列表的操作

 ~~~
Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）

一个列表最多可以包含 232 - 1 个元素 (4294967295, 每个列表超过40亿个元素)。
 ~~~

下表列出了列表相关的基本命令:

```shell
LPUSH key value1 [value2]: 将一个或多个值插入到列表头部。示例：`LPUSH list1 value1 value2`

LRANGE key start stop: 查看list当中指定范围（包含stop）的数据。示例：`LRANGE list1 0 -1`

LPUSHX key value: 将一个值插入到已存在的列表头部。示例：`LPUSHX list1 value3` `LINDEX list1 0`

RPUSH key value1 [value2]: 在列表中添加一个或多个值。示例：`RPUSH list1 value4 value5` `LRANGE list1 0 -1`

RPUSHX key value: 为已存在的列表添加值。示例：`RPUSHX list1 value6`

LINSERT key BEFORE|AFTER pivot value: 在列表的元素前或者后插入元素。示例：
`LINSERT list1 BEFORE value3 beforevalue3`

LINDEX key index: 通过索引获取列表中的元素, O(n)。示例：`LINDEX list1 0`

LSET key index value: 通过索引设置列表元素的值, O(n)。示例：`LSET list1 0 hello`

LLEN key: 获取列表长度。示例：`LLEN list1`

LPOP key: 移出并获取列表的第一个元素。示例：`LPOP list1`

RPOP key: 移除列表的最后一个元素，返回值为移除的元素。示例：`RPOP list1`

BLPOP key1 [key2 ...] timeout: 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。示例：`BLPOP list1 2000`

BRPOP key1 [key2 ...] timeout: 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。示例：`BRPOP list1 2000`

RPOPLPUSH source destination: 移除列表的最后一个元素，并将该元素添加到另一个列表并返回。示例：`RPOPLPUSH list1 list2`

BRPOPLPUSH source destination timeout: 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。示例：`BRPOPLPUSH list1 list2 2000`

LTRIM key start stop: 对一个列表进行修剪(trim)，就是说，让列表只保留指定区间内的元素，不在指定区间之内的元素都将被删除。示例：`LTRIM list1 0 2`

DEL key1 key2: 删除指定key的列表。示例：`DEL list2`
```

```
Tips:
LPUSH + LPOP = STACK
LPUSH + RPOP = QUEUE
LPUSH + LTRIM = 固定大小集合或者LRU
LPUSH + BRPOP = 消息队列
```

#### set集合

 ~~~
redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。

Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。

集合中最大的成员数为 232 - 1 (4294967295, 每个集合可存储40多亿个成员)。
 ~~~

下表列出了 Redis 集合基本命令：

```shell
SADD key member1 [member2 ...]: 向集合添加一个或多个成员。示例：`SADD set1 setvalue1 setvalue2`

SMEMBERS key: 返回集合中的所有成员。示例：`SMEMBERS set1`

SCARD key: 获取集合的成员数。示例：`SCARD set1`

SDIFF key1 [key2 ...]: 返回给定所有集合的差集。示例：`SADD set2 setvalue2 setvalue3SDIFF set1 set2`

SDIFFSTORE destkey key1 [key2 ...]: 返回给定所有集合的差集并存储在 destkey 中。示例：`SDIFFSTORE set3 set1 set2`

SINTER key1 [key2 ...]: 返回给定所有集合的交集。示例：`SINTER set1 set2`

SINTERSTORE destkey key1 [key2 ...]: 返回给定所有集合的交集并存储在`destkey`中。示例：`SINTERSTORE set4 set1 set2`

SISMEMBER key member: 判断 member 元素是否是集合`key`的成员。示例：`SISMEMBER set1 setvalue1`

SMOVE sourcekey destkey member: 将`member`元素从`sourcekey`集合移动到`destkey`集合。示例：`SMOVE set1 set2 setvalue1`

SPOP key: 移除并返回集合中的一个随机元素。示例：`SPOP set2`

SRANDMEMBER key [count ...]: 返回集合中一个或多个随机数。示例：`SRANDMEMBER set2 2`

SREM key member1 [member2 ...]: 移除集合中一个或多个成员。示例：`SREM set2 setvalue1`

SUNION key1 [key2 ...]: 返回所有给定集合的并集。示例：`SUNION set1 set2`

SUNIONSTORE destkey key1 [key2 ...]: 所有给定集合的并集存储在`destkey`集合中。示例：`SUNIONSTORE set5 set1 set2`
```

#### zset集合

下表列出了 redis 有序集合的基本命令:

```shell
ZADD key score1 member1 [score2 member2 ...]: 向有序集合添加一个或多个成员，或者更新已存在成员的分数。例如：`ADD zset1 90 ze1`

ZCARD key: 获取有序集合的成员数。例如：`zcard zset1`

ZCOUNT key min max: 计算在有序集合中指定区间分数的成员数。例如：`zcount zset1 90 91`

ZINCRBY key increment member: 有序集合中对指定成员的分数加上增量`increment`。例如：`zincrby zset1 1 ze1`

ZINTERSTORE destkey numkeys key [key ...]: 计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 destkey 中。例如：`ZINTERSTORE destkey 1 zset1`

ZLEXCOUNT key min max: 在有序集合中计算指定字典区间内成员数量。例如：``

ZRANGE key start stop [WITHSCORES]: 通过索引区间返回有序集合指定区间内的成员。例如：`ZRANGE destkey 0 -1`

ZRANGEBYLEX key min max [LIMIT offset count]: 通过字典区间返回有序集合的成员。例如：
node02:15>ZADD myzset 0 a 0 b 0 c 0 d 0 e 0 f 0 g
"7"
node02:15>ZRANGEBYLEX myzset - [c
 1)  "a"
 2)  "b"
 3)  "c"

ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT]: 通过分数返回有序集合指定区间内的成员。例如：`ZRANGEBYSCORE zset1 90 99`

ZRANK key member: 返回有序集合中指定成员的索引。例如：`ZRANK zset1 ze1`

ZREM key member [member ...]: 移除有序集合中的一个或多个成员。例如：`ZREM destkey ze2`

ZREMRANGEBYLEX key min max]: 移除有序集合中给定的字典区间的所有成员。例如：
node02:15>ZRANGE myzset 0 -1
 1)  "d"
 2)  "e"
 3)  "f"
 4)  "g"

ZREMRANGEBYRANK key start stop: 移除有序集合中给定的排名区间的所有成员。例如：
node02:15>ZADD salary 2000 jack 5000 tom 3500 peter
"3"
node02:15>ZREMRANGEBYRANK salary 0 1
"2"

ZREMRANGEBYSCORE key min max: 移除有序集合中给定的分数区间的所有成员。例如：
node02:15>ZREMRANGEBYSCORE salary 1500 3500
"2"
node02:15>ZRANGE salary 0 -1 WITHSCORES
 1)  "tom"
 2)  "5000"

ZREVRANGE key start stop [WITHSCORES]: 返回有序集中指定区间内的成员，通过索引，分数从高到低。例如：
node02:15>ZRANGE salary 0 -1 WITHSCORES
 1)  "jack"
 2)  "2000"
 3)  "peter"
 4)  "3500"
 5)  "tom"
 6)  "5000"
node02:15>ZREVRANGE salary 0 -1 WITHSCORES
 1)  "tom"
 2)  "5000"
 3)  "peter"
 4)  "3500"
 5)  "jack"
 6)  "2000"

ZREVRANGEBYSCORE key max min [WITHSCORES]: 返回有序集中指定分数区间内的成员，分数从高到低排序。例如：
node02:15>ZREVRANGEBYSCORE salary 10000 2000
 1)  "tom"
 2)  "peter"
 3)  "jack"

ZREVRANK key member: 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序。例如：
node02:15>ZREVRANK salary peter
"1"

ZSCORE key member: 返回有序集中，成员的分数值。例如：
node02:15>ZSCORE salary peter
"3500"

ZUNIONSTORE destkey numkeys key [key ...]: 计算给定的一个或多个有序集的并集，并存储在新的 key 中。例如：
node02:15>ZADD zset1 1 "one"
"1"
node02:15>ZADD zset1 2 "two"
"1"
node02:15>ZADD zset2 1 "one"
"1"
node02:15>ZADD zset2 2 "two"
"1"
node02:15>ZADD zset2 3 "three"
"1"
node02:15>ZUNIONSTORE out 2 zset1 zset2 WEIGHTS 2 3
"5"
node02:15>ZRANGE out 0 -1 WITHSCORES
 1)  "one"
 2)  "5"
 3)  "three"
 4)  "9"
 5)  "two"
 6)  "10"
 7)  "ze1"
 8)  "182"
 9)  "ze2"
 10)  "198"

ZSCAN key cursor [MATCH pattern] [COUNT count]: 迭代有序集合中的元素（包括元素成员和元素分值）。例如：
node02:15>ZSCAN out 0 match z*
 1)  "0"
 2)    
 1)   "ze1"
 2)   "182"
 3)   "ze2"
 4)   "198"
```

##### Redis有序集合zset底层怎么实现的

Redis中的set数据结构底层用的是跳表实现的.

跳表是一个随机化的数据结构，实质就是一种可以进行二分查找的有序链表。

跳表在原有的有序链表上面增加了多级索引，通过索引来实现快速查找。

跳表不仅能提高搜索性能，同时也可以提高插入和删除操作的性能。

(1)跳表是可以实现二分查找的有序链表； (2)每个元素插入时随机生成它的level； (3)最低层包含所有的元素； (4)如果一个元素出现在level(x)，那么它肯定出现在x以下的level中； (5)每个索引节点包含两个指针，一个向下，一个向右； (6)跳表查询、插入、删除的时间复杂度为O(log n)，与平衡二叉树接近；

为什么Redis选择使用跳表而不是红黑树来实现有序集合？(O(logN))

首先，我们来分析下Redis的有序集合支持的操作：

- 插入元素
- 删除元素
- 查找元素
- 有序输出所有元素
- 查找区间内所有元素

其中，前4项红黑树都可以完成，且时间复杂度与跳表一致。但是，最后一项，红黑树的效率就没有跳表高了。 在跳表中，要查找区间的元素，我们只要定位到两个区间端点在最低层级的位置，然后按顺序遍历元素就可以了，非常高效。

而红黑树只能定位到端点后，再从首位置开始每次都要查找后继节点，相对来说是比较耗时的。 此外，跳表实现起来很容易且易读，红黑树实现起来相对困难，所以Redis选择使用跳表来实现有序集合。

### 瑞士军刀

#### HyperLogLog

 ~~~shell
Redis 在 2.8.9 版本添加了 HyperLogLog 结构。
Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。
在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。
但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

什么是基数?
比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}, 基数(不重复元素)为5。 基数估计就是在误差可接受的范围内，快速计算基数。
 ~~~

 ~~~shell
Redis HyperLogLog 命令
下表列出了 redis HyperLogLog 的基本命令：

1	PFADD key element [element ...] 
node01:6379>PFADD test 123
添加指定元素到 HyperLogLog 中。
2	PFCOUNT key [key ...] 
node01:6379>PFCOUNT test 
返回给定 HyperLogLog 的基数估算值。
3	PFMERGE destkey sourcekey [sourcekey ...] 
node01:6379>PFCOUNT kbv weitrue kkv   
将多个 HyperLogLog 合并为一个 HyperLogLog
 ~~~

###### 应用

![](/images/db/redis/hyperloglog.png)

 但是，这个统计是不准确的，官方给出错误率为0.81%

#### pipeline

- 1次pipeline(n条命令) = 1次网络事件+n次命令时间.

- pipeline命令 非**原子**原子命令,而原生批量命令**m操作**是原子命令。

  ![](/images/db/redis/pipem.png)

  ![](/images/db/redis/pipeline.png)

- pipeline每次只能坐拥在一个redis节点。

Java代码执行对比

```Java
        Jedis jedis = null;
        // 连接池大小设置
        GenericObjectPoolConfig genericObjectPoolConfig = new GenericObjectPoolConfig();
        JedisPool jedisPool = new JedisPool(genericObjectPoolConfig, "node02", 6379);
        long startTime = System.currentTimeMillis();
        try{
            jedis = jedisPool.getResource();
            for (int i = 0; i <10000 ; i++) {
                jedis.hset("pip_test", "field"+i, "value"+i);
            }
        }catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
        System.out.println(System.currentTimeMillis() - startTime);
        startTime = System.currentTimeMillis();
        // 使用pipeline
				try{
            jedis = jedisPool.getResource();
            for (int i = 0; i < 100; i++) {
                Pipeline pipelined = jedis.pipelined();
                for (int j = i * 100 ; j <(i + 1) * 100 ; j++) {
                    pipelined.hset("pip_test", "field"+j, "value"+j);
                }
                pipelined.syncAndReturnAll();
            }
        }catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (jedis != null) {
                jedis.close();
            }
        }
        System.out.println(System.currentTimeMillis() - startTime);

// 输出
12126
165
```

#### bitmap(位图)

redis可以直接操作位

![](/images/db/redis/bitmap-big.png)

```shell
node02:15>set bitkey big
"OK"
node02:15>get bitkey
"big"
node02:15>getbit bitkey 0
"0"
node02:15>getbit bitkey 1
"1"
node02:15>getbit bitkey 2
"1"
node02:15>
```

操作命令：

```shell
setbit key offset value            # 给位图指定索引位置设置值，value只能是0或1
getbit key offset                  # 位图指定索引位置二进制值
bitcount key [start end]           # 获取位图指定范围（start 到 end，单位为字节，不指定的话获取全部）位值为1的个数
bitop op destkey key [key ...]     # 做多个bitmap的and（交集） or（并集） not（非） xor（异或）操作并将结果结果保存在destkey中
bitpos key targetBit [start] [end] # 计算位图指定范围（start 到 end，单位为字节，不指定的话获取全部）第一个便宜量对应位置的值等于targetBit的位置
```

![](/images/db/redis/bitc.png)

![](/images/db/redis/bit2.png)

#### GEO

GEO: 地理信息定位。存储经纬度，计算距离、位置等。

`type getKey = zset`

```shell
# 增加地理位置信息
geoadd key longitude latitude member [longitude latitude member ...]
node02:15>geoadd cities:locations 116.28 39.55 beijing
"1"
node02:15>geoadd cities:locations 117.12 39.08 tianjin
"1"
node02:15>geoadd cities:locations 114.29 38.02 shijiazhuang 118.01 39.38 tangshan
"2"

# 获取地理位置信息
geopos key member [member ...]
node02:15>geopos cities:locations beijing
 1)    
 1)   "116.28000229597091675"
 2)   "39.5500007245470826"

# 计算距离 unit:m(米),km(千米),mi(英里),ft(尺)
geodist key member1 member2 [unit]
node02:15>geodist cities:locations beijing tianjin
"89206.0576"
```

![](/images/db/redis/georadius.png)

### redis的持久化

由于redis是一个内存数据库，所有的数据都是保存在内存当中的，内存当中的数据极易丢失，所以redis的数据持久化就显得尤为重要。

什么是持久化呢?
利用永久性存储介质将数据进行保存，在特定的时间将保存的数据进行恢复的工作机制称为持久化。

为什么要进行持久化?
防止数据的意外丢失，确保数据安全性。

~~~
持久化过程:
1.将当前数据状态进行保存，快照形式，存储数据结果，存储格式简单，关注点在数据
2.将数据的操作过程进行保存，日志形式，存储操作过程，存储格式复杂，关注点在数据的操作过程
~~~

![](/images/db/redis/image-20200528230621178.png)

#### RDB持久化

~~~
Redis会定期保存数据快照至一个rbd文件中，并在启动时自动加载rdb文件，恢复之前保存的数据。
~~~

##### RDB的启动方式

###### save

~~~shell
save
#手动执行一次保存操作
dbfilename dump-端口号.rdb
说明：设置本地数据库文件名，默认值为dump.rdb经验：通常设置为dump-端口号.rdb
dir
说明：设置存储.rdb文件的路径
经验：通常设置成存储空间较大的目录中,目录名称data.
rdbcompression yes
说明：设置存储至本地数据库时是否压缩数据，默认为yes，采用LZF 压缩
经验：通常默认为开启状态，如果设置为no，可以节省CPU 运行时间，但会使存储的文件变大（巨大）
rdbchecksum  yes
说明：设置是否进行RDB文件格式校验，该校验过程在写文件和读文件过程均进行
经验：通常默认为开启状态，如果设置为no，可以节约读写性过程约10%时间消耗，但是存在一定的数据损坏风险
#注意:
save指令的执行会阻塞当前Redis服务器，直到当前RDB过程完成为止，有可能会造成长时间阻塞，线上环境不建议使用
~~~

save的工作原理

![](/images/db/redis/image-20200529114206278.png)

###### bgsave

~~~~shell
bgsave
#手动启动后台保存操作，但不是立即执行
dbfilename dump-端口号.rdb
dir
rdbcompression yes
rdbchecksum yes
stop-writes-on-bgsave-error yes
说明：后台存储过程中如果出现错误现象，是否停止保存操作
经验：通常默认为开启状态
~~~~

![](/images/db/redis/image-20200528232539204.png)

~~~shell
可以在配置文件中配置Redis进行快照保存的时机：
#save [seconds] [changes]
#second：监控时间范围
#changes：监控key的变化量

#意为在[seconds]秒内如果发生了[changes]次数据修改，则进行一次RDB快照保存
~~~

![](/images/db/redis/save&bgsave.png)

###### save自动保存配置

修改redis的配置文件

~~~shell
cd /weitrue/install/redis-6.0.1/
cat clusters/redis.conf
save 900 1
save 300 10
save 60 10000
#save 5 1
dbfilename "dump.rdb" 
dir "/weitrue/install/redis-6.0.1/rdbstro" 
~~~

~~~
前三个选项是redis的配置文件默认自带的存储机制。
表示每隔多少秒，有多少个key发生变化就生成一份dump.rdb文件，作为redis的快照文件。
例如：save  60  10000 表示在60秒内，有10000个key发生变化，就会生成一份redis的快照
第四行表示：每隔五秒钟，有一条数据发生变化都需要重新生成redis的快照，需要自己根据实际情况指定。
第五行dbfilename指定了把内存里的数据库写入本地文件的名称，该文件是进行压缩后的二进制文件；
第六行dir指定了RDB二进制文件存放目录 ；
~~~

![](/images/db/redis/1589191932950.png)

 修改RDB配置

~~~zsh
# 在命令行里进行配置,服务器重启才会生效:
node01:6379> CONFIG GET save 
1) "save"
2) "900 1 300 10 60 10000"
node01:6379> CONFIG SET save "21600 1000"
OK
~~~

注意：

~~~
重新启动redis服务
每次生成新的dump.rdb都会覆盖掉之前的老的快照
~~~

save配置原理

![](/images/db/redis/image-20200528234120923.png)

~~~shell
save配置要根据实际业务情况进行设置，频度过高或过低都会出现性能问题，结果可能是灾难性的save配置中对于second与changes设置通常具有互补对应关系，尽量不要设置成包含性关系save配置启动后执行的是bgsave操作
#save配置:
1.dbfilename dump-端口.rdb
2.dir
3.rdbcompression yes
4.rdbchecksum yes
~~~

##### rdb特殊启动形式

~~~shell
#全量复制
  在主从复制中详细讲解
#服务器运行过程中重启
  debug reload
#关闭服务器时指定保存数据
  shutdown save
默认情况下执行shutdown命令时，自动执行bgsave(如果没有开启AOF持久化功能)
~~~

##### RDB优缺点

~~~
优:
1.RDB是一个紧凑压缩的二进制文件，存储效率较高
2.RDB内部存储的是redis在某个时间点的数据快照，非常适合用于数据备份，全量复制等场景
3.RDB恢复数据的速度要比AOF快很多
4.应用：服务器中每X小时执行bgsave备份，并将RDB文件拷贝到远程机器中，用于灾难恢复。
缺:
1.RDB方式无论是执行指令还是利用配置，无法做到实时持久化，具有较大的可能性丢失数据
2.bgsave指令每次运行要执行fork操作创建子进程，要牺牲掉一些性能
3.Redis的众多版本中未进行RDB文件格式的版本统一，有可能出现各版本服务之间数据格式无法兼容现象
~~~

#### AOF持久化

~~~
   以独立日志的方式记录每次写命令，重启时再重新执行AOF文件中命令达到恢复数据的目的。与RDB相比可以简单描述为改记录数据为记录数据产生的过程.
AOF的主要作用是解决了数据持久化的实时性，目前已经是Redis持久化的主流方式
~~~

##### AOF的读写原理

![](/images/db/redis/image-20200530231955448.png)

##### AOF写数据三种策略

~~~
# always(每次）
  每次写入操作均同步到AOF文件中，数据零误差，性能较低,不建议使用
# everysec（每秒）
  每秒将缓冲区中的指令同步到AOF文件中，数据准确性较高，性能较高,建议使用，也是默认配置
   在系统突然宕机的情况下丢失1秒内的数据
# no（系统控制）
    由操作系统控制每次同步到AOF文件的周期，整体过程不可控
~~~

##### AOF功能开启

~~~shell
#配置
appendonly yes|no                # 是否开启AOF持久化功能，默认为不开启状态
appendfsync  always|everysec|no  # AOF写数据策略
~~~

##### AOF相关配置

~~~shell
cd /weitrue/install/redis-6.0.1
vim redis.conf
appendonly yes
appendfsync everysec    # appendfsync always / appendfsync no

appendfilename filename # AOF持久化文件名，默认文件名未appendonly.aof，建议配置为appendonly-端口号.aof
dir                     # AOF持久化文件保存路径，与RDB持久化文件保持一致即可
~~~

##### AOF重写

~~~shell
随着命令不断写入AOF，文件会越来越大，为了解决这个问题，Redis引入了AOF重写机制压缩文件体积。AOF文件重写是将Redis进程内的数据转化为写命令同步到新AOF文件的过程。简单说就是将对同一个数据的若干条命令执行结果转化成最终结果数据对应的指令进行记录。

#AOF重写作用
降低磁盘占用量，提高磁盘利用率
提高持久化效率，降低持久化写时间，提高IO性能
降低数据恢复用时间，提高数据恢复效率。

#AOF重写规则
  1.进程内已超时的数据不再写入文件
  2.忽略无效指令，重写时使用进程内数据直接生成，这样新的AOF文件只保留最终数据的写入命令
     如del key1、hdelkey2、sremkey3、set key4 111、set key4 222等
  3.对同一数据的多条写命令合并为一条命令
    如lpushlist1 a、lpushlist1 b、lpushlist1 c 可以转化为：lpushlist1 a b c。
    为防止数据量过大造成客户端缓冲区溢出，对list、set、hash、zset等类型，每条指令最多写入64个元素
~~~

###### AOF重写方式

- 手动重写

```shell
bgrewriteaof
```

- 
  自动重写

```shell
auto-aof-rewrite-min-size size
auto-aof-rewrite-percentage percentage
```

###### AOF自动重写方式

```shell
# 自动重写触发条件设置
auto-aof-rewrite-min-size （达到某一内存开始重写）
sizeauto-aof-rewrite-percentage percent   （达到某一%）

# 自动重写触发比对参数（运行指令info Persistence获取具体信息) 
aof_current_size  （设置内存）
aof_base_size      （基础尺寸）
```

##### AOF工作流程

![](/images/db/redis/image-20200531004807324.png)

##### AOF重写流程

![](/images/db/redis/image-20200531004404062.png)

##### AOF优点：

~~~
1、 最安全，在启用appendfsync always时，任何已写入的数据都不会丢失，使用在启用appendfsync everysec也至多只会丢失1秒的数据

2、 AOF文件在发生断电等问题时也不会损坏，即使出现了某条日志只写入了一半的情况，也可以使用redis-check-aof工具轻松修复。

3、 AOF文件易读，可修改，在进行了某些错误的数据清除操作后，只要AOF文件没有rewrite，就可以把AOF文件备份出来，把错误的命令删除，然后恢复数据。
~~~

##### AOF的缺点：

~~~
1、 AOF文件通常比RDB文件更大

2、 性能消耗比RDB高

3、 数据恢复速度比RDB慢

Redis的数据持久化工作本身就会带来延迟，需要根据数据的安全级别和性能要求制定合理的持久化策略：

AOF + fsync always的设置虽然能够绝对确保数据安全，但每个操作都会触发一次fsync，会对Redis的性能有比较明显的影响

AOF + fsync every second是比较好的折中方案，每秒fsync一次

AOF + fsync never会提供AOF持久化方案下的最优性能使用RDB持久化通常会提供比使用AOF更高的性能，但需要注意RDB的策略配置


每一次RDB快照和AOF Rewrite都需要Redis主进程进行fork操作。fork操作本身可能会产生较高的耗时，与CPU和Redis占用的内存大小有关。根据具体的情况合理配置RDB快照和AOF Rewrite时机，避免过于频繁的fork带来的延迟

Redis在fork子进程时需要将内存分页表拷贝至子进程，以占用了24GB内存的Redis实例为例，共需要拷贝24GB / 4kB * 8 = 48MB的数据。在使用单Xeon 2.27Ghz的物理机上，这一fork操作耗时216ms。
~~~

#### RDB与AOF

![](/images/db/redis/rdb&aof.png)

#### fork

- 同步操作
  
- 虽然fork同步操作是非常快的，但是如果需要同步的数据量过大(比如超过20G)，fork就会阻塞redis主进程。
  
- 与内存量息息相关
  
- 内存越大，fork同步数据耗时越长，当然也跟服务器有关，服务器有物理机，也有虚拟机。
  
- info:latest_fork_usec
  - 使用此命令可以查看持久化花费的时间，如果持久化时间过长，就会造成卡顿。
  - 例如：如果redis此时QPS上万，此时redis正在持久化，而且持久化时间比较长（1s或者10几秒），此时就会严重阻塞redis。

  ```shell
  node02:0>info Stats
  "# Stats
  total_connections_received:5
  total_commands_processed:13
  instantaneous_ops_per_sec:0
  total_net_input_bytes:346
  total_net_output_bytes:7191
  instantaneous_input_kbps:0.00
  instantaneous_output_kbps:0.00
  rejected_connections:0
  sync_full:0
  sync_partial_ok:0
  sync_partial_err:0
  expired_keys:0
  evicted_keys:0
  keyspace_hits:0
  keyspace_misses:0
  pubsub_channels:0
  pubsub_patterns:0
  latest_fork_usec:0   # <-------
  migrate_cached_sockets:0
  "
  
  node02:0>info
  "# Server
  redis_version:3.2.8
  redis_git_sha1:00000000
  redis_git_dirty:0
  redis_build_id:3a7af52404e97f38
  redis_mode:standalone
  os:Linux 3.10.0-957.el7.x86_64 x86_64
  arch_bits:64
  multiplexing_api:epoll
  gcc_version:4.8.5
  process_id:26189
  run_id:2cf1aa7e1893ae1b5427ae9e1963e30e10716673
  tcp_port:6379
  uptime_in_seconds:122
  uptime_in_days:0
  hz:10
  lru_clock:6488420
  executable:/weitrue/install/redis-6.0.1/src/redis-server
  config_file:/weitrue/install/redis-6.0.1/redis.conf
  
  # Clients
  connected_clients:2
  client_longest_output_list:0
  client_biggest_input_buf:0
  blocked_clients:0
  
  # Memory
  used_memory:2168928
  used_memory_human:2.07M
  used_memory_rss:4009984
  used_memory_rss_human:3.82M
  used_memory_peak:2201664
  used_memory_peak_human:2.10M
  total_system_memory:1907941376
  total_system_memory_human:1.78G
  used_memory_lua:37888
  used_memory_lua_human:37.00K
  maxmemory:0
  maxmemory_human:0B
  maxmemory_policy:noeviction
  mem_fragmentation_ratio:1.85
  mem_allocator:libc
  
  # Persistence
  loading:0
  rdb_changes_since_last_save:0
  rdb_bgsave_in_progress:0
  rdb_last_save_time:1617101034
  rdb_last_bgsave_status:ok
  rdb_last_bgsave_time_sec:-1
  rdb_current_bgsave_time_sec:-1
  aof_enabled:0
  aof_rewrite_in_progress:0
  aof_rewrite_scheduled:0
  aof_last_rewrite_time_sec:-1
  aof_current_rewrite_time_sec:-1
  aof_last_bgrewrite_status:ok
  aof_last_write_status:ok
  
  # Stats
  total_connections_received:5
  total_commands_processed:11
  instantaneous_ops_per_sec:0
  total_net_input_bytes:298
  total_net_output_bytes:4947
  instantaneous_input_kbps:0.00
  instantaneous_output_kbps:0.00
  rejected_connections:0
  sync_full:0
  sync_partial_ok:0
  sync_partial_err:0
  expired_keys:0
  evicted_keys:0
  keyspace_hits:0
  keyspace_misses:0
  pubsub_channels:0
  pubsub_patterns:0
  latest_fork_usec:0
  migrate_cached_sockets:0
  
  # Replication
  role:master
  connected_slaves:0
  master_repl_offset:0
  repl_backlog_active:0
  repl_backlog_size:1048576
  repl_backlog_first_byte_offset:0
  repl_backlog_histlen:0
  
  # CPU
  used_cpu_sys:0.18
  used_cpu_user:0.11
  used_cpu_sys_children:0.00
  used_cpu_user_children:0.00
  
  # Cluster
  cluster_enabled:0
  
  # Keyspace
  db0:keys=79,expires=0,avg_ttl=0
  db15:keys=12,expires=0,avg_ttl=0
  "
  ```

##### 改善fork

![](/images/db/redis/improve-fork.png)

### Redis 发布订阅

![](/images/db/redis/pub-sub.png)

~~~
Redis 的发布与订阅功能可以让用户将消息同时发送给多个客户端。 
这个功能由几个不同的角色 协作组成： 
1.发布者（publisher）：发布消息的客户端。 
2.频道（channel）：构建在服务器内部，负责接收发布者发送的消息，并将消息转发给频道的订阅者。 
3.模式（pattern）：构建在服务器内部，负责对频道进行匹配，当被匹配的频道接到消息时，模式也会 
将消息转发给模式的订阅者。 
4.订阅者（subscriber）：通过订阅频道或者模式来获取消息的客户端。每个频道或者模式都可以有任 意多个订阅者(仅能获得开始订阅以后的消息，订阅前的消息无法获得)。
~~~

##### 订阅命令

 ~~~shell
#订阅频道
SUBSCRIBE channel [channel ...]
订阅给定的一个或多个频道。
node02:15>SUBSCRIBE wo
Switch to Pub/Sub mode. Close console tab to stop listen for messages.
 1)  "subscribe"
 2)  "wo"
 3)  "1"
 1)  "message"
 2)  "wo"
 3)  "hello"
 1)  "message"
 2)  "wo"
 3)  "test"
 ~~~

###### 消息发布

~~~shell
node02:15>PUBLISH wo hello
"1"
~~~

###### 订阅多个

~~~shell
通配符*
redis> PSUBSCRIBE new*
~~~

###### 消息发布

~~~shell
redis>PUBLISH new1 hello
~~~

###### 列出指定频道订阅着数量

```shell
redis> PUBSUB numsub [channel...]
```

### Redis 事务

~~~
Redis 的事务功能允许用户将多个命令包裹起来，然后一次性地、按 顺序地执行被包裹的所有命令。
在事务执行的过程中，服务器不会中断事务而改去执行其他命令请求，只有在事务包裹的所有命令都
被执行完毕之后，服务器才会去处理其他命令请求。
~~~

#### 事务命令

~~~
为了避免遇上以上所说的情况， 我们需要用到 Redis 的事务功能， 通过事务， 我们可以让 Redis 
一次性地执行多个命令， 并且确保事务中的命令要么就全部都 执行，要么就一个都不执行。
~~~

**事务命令**：                                                     作用： 

MULTI                                                             开始一个新的事务。    

DISCARD                                                         放弃事务。

EXEC                                                                 执行事务中的所有命令。

**开始事务**

~~~shell
MULTI
开始一个事务。 
在这个命令执行之后，客户端发送的所有针对数据库或者数据库键的命令都不会被立即执行，而是被放
入到一个事务队列里面，并返回 QUEUED 表示命令已入队。
redis> MULTI # 开始一个事务
OK
redis> SET msg "hello world" # 将这个 SET 命令放入事务队列
QUEUED
~~~

**放弃事务：**

~~~shell
DISCARD
取消事务，放弃执行事务队列中的所有命令。
 redis> MULTI
 OK
 redis> SET msg "hello world"
 QUEUED
 redis> DISCARD # 事务已被取消
 OK
~~~

**执行事务**

~~~shell
EXEC
按照命令被入队到事务队列中的顺序，执行事务队列中的所有命令。
redis> MULTI 
OK
redis> SET msg "hello world"
QUEUED
redis> SET msg "hello world"
QUEUED
redis> EXEC
~~~

### Redis 安全

我们可以通过 redis 的配置文件设置密码参数，这样客户端连接到 redis 服务就需要密码验证，这样可以让你的 redis 服务更安全。 

~~~shell
实例
我们可以通过以下命令查看是否设置了密码验证：
127.0.0.1:6379> CONFIG get requirepass
1) "requirepass"
2) ""
默认情况下 requirepass 参数是空的，这就意味着你无需通过密码验证就可以连接到 redis 服务。
你可以通过以下命令来修改该参数：
127.0.0.1:6379> CONFIG set requirepass "weitrue"
OK
127.0.0.1:6379> CONFIG get requirepass
1) "requirepass"
2) "weitrue"
~~~

设置密码后，客户端连接 redis 服务就需要密码验证，否则无法执行命令。

~~~shell
语法
AUTH 命令基本语法格式如下：
127.0.0.1:6379> AUTH password
实例
127.0.0.1:6379> AUTH "weitrue"
OK
~~~

取消密码 —重启服务

~~~
AUTH命令跟其他redis命令一样，是没有加密的；阻止不了攻击者在网络上窃取你的密码；
~~~

### Redis 性能测试

Redis 性能测试是通过同时执行多个命令实现的。

~~~shell
语法
redis 性能测试的基本命令如下：

redis-benchmark [option] [option value]
注意：该命令是在 redis 的目录下执行的，而不是 redis 客户端的内部指令。

实例
以下实例同时执行 10000 个请求来检测性能：

[hadoop@node02 redis-6.0.1]$ src/redis-benchmark  -h node02 -p 6379  -n 10000 -q
PING_INLINE: 72992.70 requests per second
PING_BULK: 70921.98 requests per second
SET: 66666.66 requests per second
GET: 73529.41 requests per second
INCR: 75187.97 requests per second
LPUSH: 68493.15 requests per second
RPUSH: 76923.08 requests per second
LPOP: 74626.87 requests per second
RPOP: 75757.58 requests per second
SADD: 76335.88 requests per second
SPOP: 76923.08 requests per second
LPUSH (needed to benchmark LRANGE): 75757.58 requests per second
LRANGE_100 (first 100 elements): 40983.61 requests per second
LRANGE_300 (first 300 elements): 19120.46 requests per second
LRANGE_500 (first 450 elements): 13605.44 requests per second
LRANGE_600 (first 600 elements): 10672.36 requests per second
MSET (10 keys): 59880.24 requests per second
~~~

~~~
redis 性能测试工具可选参数如下所示：
序号	选项	描述	                                 默认值
1	-h	指定服务器主机名	                     127.0.0.1
2	-p	指定服务器端口	                            6379
3	-s	指定服务器 socket	
4	-c	指定并发连接数	                             50
5	-n	指定请求数	                             10000
6	-d	以字节的形式指定 SET/GET 值的数据大小	         2
7	-k	1=keep alive 0=reconnect	              1
8	-r	SET/GET/INCR 使用随机 key, SADD 使用随机值	
9	-P	通过管道传输 <numreq> 请求	                 1
10	-q	强制退出 redis。仅显示 query/sec 值	
11	--csv	以 CSV 格式输出	
12	-l	生成循环，永久执行测试	
13	-t	仅运行以逗号分隔的测试命令列表。	
14	-I	Idle 模式。仅打开 N 个 idle 连接并等待。
~~~

~~~~shell
#以下实例使用了多个参数来测试 redis 性能：

[hadoop@node02 redis-6.0.1]$ src/redis-benchmark -h node02 -p 6379 -t set,lpush -n 10000 -q
SET: 68493.15 requests per second
LPUSH: 67114.09 requests per second
以上实例中主机为 node01，端口号为 6379，执行的命令为 set,lpush，请求数为 10000，通过 -q 参数让结果只显示每秒执行的请求数。
~~~~

### redis的三种集群方式：

#### 主从复制架构

在Redis中，
`SLAVEOF  命令或者设置`slaveof 选项，让一个服务器去复制（replicate）另一个服务器，被复制的服务器为主服务器（master），而对主服务器进行复制的服务器则被称为从服务器（slave）。
`SLAVEOF no one`命令取消成为从节点。

![](/images/db/redis/image-20200526181040434.png)

![](/images/db/redis/image-20200526181105914.png)

![](/images/db/redis/image-20200527001642571.png)

##### 作用

- 读写分离:master写,slave读。
- 负载均衡:由slave分担master负载,并根据需求,改变slave的数量,通过多个从节点读取负载。
- 故障恢复:当master出现问题的时候,由slave提供服务,实现快速恢复。
- 数据冗余:实时备份。

##### 工作原理

~~~
三阶段:
 1.建立连接
 2.数据同步
 3.命令传播阶段
~~~

![](/images/db/redis/image-20200526191458864.png)

![](/images/db/redis/image-20200527001702103.png)

##### 配置

使用主从复制这种模式，实现node01作为主节点，node02与node03作为从节点，并且将node01所有的数据全部都同步到node02与node03服务器

第一步: 将node01上的redis拷贝到node02和node03上

~~~shell
scp -r /weitrue/install/redis-6.0.1/ node02:/weitrue/install/
scp -r /weitrue/install/redis-6.0.1/ node03:/weitrue/instal/
~~~

第二步：node02与node03服务器安装redis

~~~shell
# node02与node03服务器修改redis配置文件
# node02服务器修改配置文件命令如下
#执行以下命令修改redis配置文件
cd /weitrue/install/redis-6.0.1/
mkdir -p /weitrue/install/redis-6.0.1/logs
mkdir -p /weitrue/install/redis-6.0.1/redisdata
vim redis.conf
bind node02
daemonize yes
pidfile /weitrue/install/redis-6.0.1/redis_6379.pid
logfile "/weitrue/install/redis-6.0.1/logs/redis.log"
dir /weitrue/install/redis-6.0.1/redisdata
slaveof node01 6379
# node03服务器修改配置文件命令如下
#执行以下命令修改redis配置文件
cd /weitrue/install/redis-6.0.1/
mkdir -p /weitrue/install/redis-6.0.1/logs
mkdir -p /weitrue/install/redis-6.0.1/redisdata
vim redis.conf
bind node03
daemonize yes
pidfile /var/run/redis_6379.pid
logfile "/weitrue/install/redis-6.0.1/logs/redis.log"
dir /weitrue/install/redis-6.0.1/redisdata
slaveof node01 6379
~~~

第三步、启动node02与node03机器的redis服务

~~~shell
#node02执行以下命令启动redis服务
cd  /weitrue/install/redis-6.0.1/
src/redis-server  redis.conf
#ode03执行以下命令启动redis服
cd  /weitrue/install/redis-6.0.1/
src/redis-server  redis.conf
~~~

启动成功便可以实现redis的主从复制，node01可以读写操作，node02与node03只支持读取操作。

~~~shell
#注意:务必关掉防火墙
#连接node01
src/redis-cli -h node01
set weitrue 1234
#连接node02
src/redis-cli -h node02
get weitrue
#查看集群信息
info
#主从断开连接
slaveof no one
~~~

#### redis当中的Sentinel架构 

~~~
Sentinel（哨兵）是Redis 的高可用性解决方案：由一个或多个Sentinel 实例 组成的Sentinel 系统可以监视任意多个主服务器，以及这些主服务器属下的所有从服务器，并在被监视的主服务器进入下线状态时，自动将下线主服务器属下的某个从服务器升级为新的主服务器。
~~~

![](/images/db/redis/image-20200527141509519.png)

![](/images/db/redis/image-20200527141538252.png)

作用:

~~~
 监控:不断的检查master和slave是否正常运行.master存活检测,master与slave运行情况检测.

 通知:当被监控的服务器出现问题时,向其他的(哨兵间或者客户端)发送通知.

自动故障转移:断开master与slave连接,选取一个slave作为master,将其他的slave连接到新的master,并告知客户端新的服务器地址.
注意:哨兵通常也是一台服务器,但不提供服务,通常的哨兵配置为积数.
~~~

配置:

第一步：三台机器修改哨兵配置文件

~~~
#三台机器执行以下命令修改redis的哨兵配置文件
cd /weitrue/install/redis-6.0.1
vim sentinel.conf
# 配置监听的主服务器，这里sentinel monitor代表监控，mymaster代表服务器的名称，可以自定义，192.168.11.128代表监控的主服务器，6379代表端口，2代表只有两个或两个以上的哨兵认为主服务器不可用的时候，才会进行failover操作。
#修改bind配置，每台机器修改为自己对应的主机名
bind node01  
#配置sentinel服务后台运行
daemonize yes
#修改三台机器监控的主节点，现在主节点是node01服务器
sentinel monitor mymaster 192.168.8.100 6379 2
# sentinel monitor代表监控，mymaster是服务名称,可以自定义;node01 代表监控的主服务器;6379代表端口,2代表只有两个或两个以上的哨兵认为主服务器不可用的时候，才会进行failover操作。
~~~

第二步：三台机器启动哨兵服务

~~~shell
#三台机器执行以下命令启动哨兵服务
cd /weitrue/install/redis-6.0.1/
src/redis-sentinel sentinel.conf 
~~~

第三步：node01服务器杀死redis服务进程

~~~
使用kill  -9命令杀死redis服务进程，模拟redis故障宕机情况
过一段时间之后，就会在node02与node03服务器选择一台服务器来切换为主节点 
~~~

原理:

![](/images/db/redis/image-20200527175422937.png)

![](/images/db/redis/image-20200527181408612.png)

![](/images/db/redis/image-20200527182135500.png)

![](/images/db/redis/image-20200527184045802.png)

#### redis集群

```
Redis 集群是一个提供在多个Redis节点之间共享数据的程序集。

Redis 集群并不支持同时处理多个键的 Redis 命令，因为这需要在多个节点间移动数据，这样会降低redis集群的性能，在高负载的情况下可能会导致不可预料的错误。

Redis 集群通过分区来提供一定程度的可用性，即使集群中有一部分节点失效或者无法进行通讯， 集群也可以继续处理命令请求。

 Redis 集群的优势:

1.缓存永不宕机：启动集群，永远让集群的一部分起作用。主节点失效了子节点能迅速改变角色成为主节点，整个集群的部分节点失败或者不可达的情况下能够继续处理命令；

2.迅速恢复数据：持久化数据，能在宕机后迅速解决数据丢失的问题；

3.Redis可以使用所有机器的内存，变相扩展性能；

4.使Redis的计算能力通过简单地增加服务器得到成倍提升,Redis的网络带宽也会随着计算机和网卡的增加而成倍增长；

5.Redis集群没有中心节点，不会因为某个节点成为整个集群的性能瓶颈;
6.异步处理数据，实现快速读写。 
```

![](/images/db/redis/image-20200524161751571.png)

##### 集群数据存储设计及通信原理

```
redis集群数据存储设计
```

![](/images/db/redis/image-20200524162113663.png)

~~~
redis集群通信原理  
~~~

![](/images/db/redis/1590146339566.png)

##### redis集群环境搭建

```
由于redis集群当中最少需要三个主节点，每个主节点，最少需要一个对应的从节点，所以搭建redis集群最少需要三主三从的配置，因此redis集群最少需要6台redis的实例。我们这里用node01通过配置6个端口，实现redis集群的环境搭建
```

###### node01服务器解压redis压缩包

```
#node01执行以下命令重新解压redis压缩包到/weitrue路径下
cd /weitrue/soft/
tar -zxvf redis-6.0.1.tar.gz -C ../instal/
```

###### 安装redis必须依赖环境并进行编译

```
#node01执行以下命令安装redis的依赖环境
su root
yum -y install gcc-c++ tcl
# 查看gcc版本是否在5.3以上，centos7.6默认安装4.8.5
gcc -v
# 升级gcc到5.3及以上,如下：
升级到gcc 9.3：
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils
scl enable devtoolset-9 bash
需要注意的是scl命令启用只是临时的，退出shell或重启就会恢复原系统gcc版本。
如果要长期使用gcc 9.3的话：

echo "source /opt/rh/devtoolset-9/enable" >>/etc/profile
#这样退出shell重新打开就是新版的gcc了
#对redis进行编译
cd /weitrue/redis-6.0.1
make && make install
```

###### 创建redis不同实例的配置文件夹

创建文件夹，并将redis的配置文件拷贝到以下这些目录

```
#node01:
cd /weitrue/install/redis-6.0.1
mkdir -p /weitrue/install/redis-6.0.1/clusters/7001
mkdir -p /weitrue/install/redis-6.0.1/clusters/7002
mkdir -p /weitrue/install/redis-6.0.1/clusters/7003
mkdir -p /weitrue/install/redis-6.0.1/clusters/7004
mkdir -p /weitrue/install/redis-6.0.1/clusters/7005
mkdir -p /weitrue/install/redis-6.0.1/clusters/7006
```

###### 修改redis的六个配置文件

```
#node01执行以下命令修改redis的配置文件
mkdir -p /weitrue/install/redis-6.0.1/logs
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7001
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7002
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7003
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7004
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7005
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7006
```

分别修改6个配置文件

```java
vim  /weitrue/install/redis-6.0.1/redis.conf
bind node01
port 7001                                 //默认ip为127.0.0.1 需要改为其他节点机器可访问的ip 
cluster-enabled yes                       //开启集群把注释#去掉
cluster-config-file nodes-7001.conf      //集群的配置  配置文件首次启动自动生成 7001,7002,7003
cluster-node-timeout 5000                 //请求超时  默认15秒，可自行设置
appendonly yes                           //aof日志开启  有需要就开启，它会每次写操作都记录一条日志
daemonize yes
pidfile /var/run/redis_7001.pid
logfile "/weitrue/install/redis-6.0.1/logs/7001.log"
dir /weitrue/install/redis-6.0.1/redisdata/7001

```

```
注意：port：对应的每台机器的端口号，
    第一台是：port 7001
    第二台：port  7002
    ....
    第六台：port 7006
    
    第一台： cluster-config-file nodes-7001.conf
    ....  
    第六台：cluster-config-file nodes-7006.conf
    
    第一台： dir /weitrue/install/redis-6.0.1/redisdata/7001
    .... 
    第六台：dir /weitrue/install/redis-6.0.1/redisdata/7006
```

###### 启动redis进程

node01执行以下命令来启动redis集群

```
cd /weitrue/redis-6.0.1
src/redis-server clusters/7001/redis.conf
src/redis-server clusters/7002/redis.conf
src/redis-server clusters/7003/redis.conf
src/redis-server clusters/7004/redis.conf
src/redis-server clusters/7005/redis.conf
src/redis-server clusters/7006/redis.conf
```

###### 创建redis集群

node01执行以下命令创建redis集群

~~~
cd /weitrue/install/redis-6.0.1

src/redis-cli --cluster create 192.168.8.100:7001 192.168.8.100:7002 192.168.8.100:7003 192.168.8.100:7004 192.168.8.100:7005 192.168.8.100:7006 --cluster-replicas 1
~~~

注意：如果创建cluster集群出现以下这个错误

![](/images/db/redis/2.png)



那么我们需要清空所有redis节点的所有数据

执行以下命令连接到各个redis节点，然后清空数据

```
示例：
[root@node01 redis-6.0.1]# src/redis-cli  -h node01 -c -p 7001
node01:7001> flushall 
OK
node01:7001> cluster reset
OK
node01:7001> quit
#依次执行6台机器
```

重新创建redis集群

```
src/redis-cli --cluster create 192.168.8.100:7001 192.168.8.100:7002 192.168.8.100:7003 192.168.8.100:7004 192.168.8.100:7005 192.168.8.100:7006 --cluster-replicas 1
```

###### 连接redis客户端

node01执行以下命令连接redis客户端

```
cd /weitrue/redis-6.0.1
src/redis-cli  -h node01 -c -p 7001
```

##### redis集群管理

添加一个新节点作为主节点

启动新节点的redis服务，然后添加到集群当中去

~~~shell
#1.创建文件夹
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7007
mkdir -p /weitrue/install/redis-6.0.1/redisdata/7008
mkdir -p /weitrue/install/redis-6.0.1/clusters/7007
mkdir -p /weitrue/install/redis-6.0.1/clusters/7008
#2.修改redis.conf
vim /weitrue/install/redis-6.0.1/clusters/7007/redis.conf
vim /weitrue/install/redis-6.0.1/clusters/7008/redis.conf
~~~

```shell
#启动服务
src/redis-server clusters/7007/redis.conf
#添加服务
src/redis-cli --cluster add-node 192.168.8.100:7007 192.168.8.100:7001
#解释:
192.168.8.100:7007 #服务器ip:端口;
192.168.8.100:7001 #集群中任意一台ip:端口
```

~~~shell
#查看信息
src/redis-cli --cluster info 192.168.8.100:7001
~~~

~~~shell
#检测集群
src/redis-cli --cluster check 192.168.8.100:7007 
~~~

```shell
#重新分片
#命令格式
src/redis-cli --cluster reshard --from <node-id> --to <node-id> --slots <number of slots> --yes <host>:<port>
#实例:
src/redis-cli --cluster reshard 192.168.8.100:7001
#解释:
192.168.8.100:7001 #集群中任务一个节点
#下面代表需要输入参数的提示
1.How many slots do you want to move (from 1 to 16384)?4096　　　　 
#拿出4096个hash 槽
2.What is the receiving node ID? c5e0da48f335c46a2ec199faa99b830f537dd8a0 
#7007服务所在的节点的id值
3.Source node #1: all 
#从当前所有master服务器获取hash槽
4.Do you want to proceed with the proposed reshard plan (yes/no)?yes　
# 同意以上配置
```

~~~shell
#查看集群信息
src/redis-cli --cluster info 192.168.8.100:7001
~~~

~~~shell
#添加slave角色到集群里
#启动7008服务
src/redis-server clusters/7008/redis.conf
#添加副本
src/redis-cli --cluster add-node  --cluster-slave 192.168.8.100:7008 192.168.8.100:7001
#解释
192.168.8.100:7008 #从服务器ip:端口;
192.168.8.100:7001 #集群中任意一台ip:端口
~~~

~~~shell
#删除某一节点redis服务
src/redis-cli --cluster del-node 192.168.8.100:7008 4bf2fc80931392c248a7ae359bd1bf540872c688
~~~

### Redis击穿、穿透、雪崩、预热

####    缓存穿透

~~~
问题:
Redis服务器命中率随时间逐步降低
~~~

~~~
缓存穿透的概念很简单，用户想要查询一个数据，发现redis内存数据库没有，也就是缓存没有命中，于是向持久层数据库查询。发现也没有，于是本次查询失败。当用户很多的时候，缓存都没有命中，于是都去请求了持久层数据库。这会给持久层数据库造成很大的压力，这时候就相当于出现了缓存穿透。

这里需要注意和缓存击穿的区别，缓存击穿，是指一个key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。

为了避免缓存穿透其实有很多种解决方案。下面介绍几种。

1.1 白名单策略:
1.1.1
  将id放在bitmaps中,id作为bitmaps的offset
1.1.2 布隆过滤器:
那这个布隆过滤器是如何解决redis中的缓存穿透呢？很简单首先也是对所有可能查询的参数以hash形式存储，当用户想要查询的时候，使用布隆过滤器发现不在集合中，就直接丢弃，不再对持久层查询。
~~~

1.2 缓存空对象

~~~
当存储层不命中后，即使返回的空对象也将其缓存起来，同时会设置一个过期时间，之后再访问这个数据将会从缓存中获取，保护了后端数据源；注意设置key的过期时间.
~~~

![](/images/db/redis/1589366209279.png)

~~~
但是这种方法会存在一个问题：

即使对空值设置了过期时间，还是会存在缓存层和存储层的数据会有一段时间窗口的不一致，这对于需要保持一致性的业务会有影响。
~~~

1.3 实施监控

~~~
监控命中率(业务正常范围时,通常会有一个波动值),根据不同的情况,设置黑名单.
~~~

#### 缓存雪崩

~~~
缓存雪崩是指，缓存层出现了错误，不能正常工作了。于是所有的请求都会达到存储层，存储层的调用量会暴增，造成存储层也会挂掉的情况。经常出现的情况是408,500的错误页面.
~~~

![](/images/db/redis/1589366273686.png)

~~~
2、解决方案

（1）redis高可用

这个思想的含义是，既然redis有可能挂掉，那我多增设几台redis，这样一台挂掉之后其他的还可以继续工作，其实就是搭建的集群。

（2）限流降级

这个解决方案的思想是，在缓存失效后，通过加锁或者队列来控制读数据库写缓存的线程数量。比如对某个key只允许一个线程查询数据和写缓存，其他线程等待。

（3）数据预热

 在即将发生大并发访问前手动触发加载缓存不同的key，设置不同的过期时间，让缓存失效的时间点尽量均匀。
~~~

#### 缓存击穿

~~~
  缓存击穿是在高并发的条件下读取缓存数据，多用户同时请求同一个缓存数据，如果缓存中没有这条数据，那么这些用户又会同时去数据库中查询这条数据，浪费了系统资源，有悖于缓存数据的初衷，严重的话可能会造成服务器宕机的风险。
  解决方案：
   1）.使用同步锁 synchronized 关键字，修饰在获取缓存的方法里面，保证在多用户同时请求条件下，只有第一个进入的线程去判断是否要查询数据库并存入缓存，其他线程只需在第一个线程结束后，从缓存中读取数据即可，无需再查询数据库。
上面是对缓存穿透的再次优化，加入线程同步锁 以及 双重检查锁.
双重检查锁：1.避免当缓存数据没有失效时，其他线程排队等待。
          2.当第一个线程从数据库中获取到数据并存入缓存中时，其他线程直接从缓存获取数据即可。
2)不设置缓存时间，由后台创建定时任务去维护这部分缓存数据。这种方法请求时直接从缓存中获取数据，无需再判断是否从数据库中获取，定时任务也可在请求较少的时间段分批更新缓存数据。
    当然代码量、代码复杂度增大，分批更新代表需要多个定时任务去维护缓存数据，同时更新有可能会造成缓存雪崩的情况。
~~~

#### 数据预热

    缓存预热:
      提前将相关的缓存数据直接加载到缓存系统,避免用户在请求的时候,先查询数据库,然后再将数据缓存的问题.
    
    问题:
     1.主从之间数据吞吐量大
     2.数据同步操作频度高
    方案:
     1.统计访问频度较高的热点数据,比如直接写个缓存刷新页面，上线时手工操作下
     2.数据量不大，可以在项目启动的时候自动进行加载
     3.定时刷新缓存

