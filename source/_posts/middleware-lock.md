---
title: 【Middleware】Lock
categories: Middleware
tags: [Lock,分布式]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/middleware/lock/no.png
banner_img: /images/img/banner.png
---

> 在学习或工作的过程中遇到各种各样的锁的，每种锁因其特性的不同，在适当的场景下能够展现出非常高的效率。<!-- more -->

{% pullquote mindmap mindmap-md %}

- 锁类型
  - 同步资源是否锁住
      - 悲观锁
      - 乐观锁
  - 是否重复获取（一个线程的多个流程能否获取同一把锁）
      - 可重入锁
      - 不可重入锁
  - 获取同步资源失败，是否阻塞
      - 阻塞
      - 不阻塞
          - 自旋锁
          - 适应性自旋锁
  - 多线程并发访问资源
      - 无锁
          - 无需上锁
      - 偏向锁
          - 同一线程多次获取同一资源时，无需上锁，自动获取
      - 轻量级锁
          - 多线程竞争同步资源时，没有获取资源的线程自旋等待锁释放
      - 重量级锁
          - 多线程竞争同步资源时，没有获取资源的线程阻塞等待唤醒
  - 锁公平性（多线程竞争锁是否需要排队）
      - 公平锁
      - 非公平锁
  - 多线程能否共享一把锁
      - 共享锁
      - 排它锁/读写锁

{% endpullquote %}

### 乐观锁 VS 悲观锁



### 可重入锁 VS 非可重入锁

可重入锁又名递归锁，是指在同一个线程在外层方法获取锁的时候，再进入该线程的内层方法会自动获取锁，不会因为之前已经获取过还没释放而阻塞。

下图来自美团技术团队分享

![](/images/middleware/lock/reentrantlock.png)

#### Golang实现可重入锁

根据`Java`中可重入锁的实现，可以总结实现一个可重入锁需要这两点：

- 持有锁的线程
- 统计重入的次数

```go
import (
	"fmt"
	"sync"
)

type RLock struct {
	mutex *sync.Mutex
	cond *sync.Cond
	recursion int32
	id int64
}

func (r *RLock) Lock() {
	id := GetGoroutineID()
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if r.id == id {
		r.recursion ++
		return
	}

	for r.recursion != 0 {
		r.cond.Wait()
	}

	r.id = id
	r.recursion = 1
}

func (r *RLock) Unlock() {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if r.recursion == 0 || r.id != GetGoroutineID() {
		panic(fmt.Sprintf("the wrong call goid: (%d); current_goid: %d; recursion: %d", r.id, GetGoroutineID(), r.recursion))
	}

	r.recursion--
	if r.recursion == 0 {
		r.cond.Signal()
	}
}

func NewRLock() sync.Locker {
	l := &RLock{
		mutex:     new(sync.Mutex),
		recursion: 0,
		id:        0,
	}
	l.cond = sync.NewCond(l.mutex)

	return l
}

```

```go
import (
	"bytes"
	"runtime"
	"strconv"
)

func extractGID(s []byte) int64 {
	s = s[len("goroutine "):]
	s = s[:bytes.IndexByte(s, ' ')]
	gid, _ := strconv.ParseInt(string(s), 10, 64)

	return gid
}

// GetGoroutineID Get returns the id of the current goroutine.
func GetGoroutineID() int64 {
	var buf [64]byte

	return extractGID(buf[:runtime.Stack(buf[:], false)])
}
```



### 自旋锁 VS 适应性自旋锁



### 无锁 VS 偏向锁 VS 轻量级锁 VS 重量级锁



### 公平锁 VS 非公平锁



### 独享锁 VS 共享锁
