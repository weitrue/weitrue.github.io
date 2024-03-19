---
title: 【Go】并发之道
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: Golang   # 分类
tags: [Go]           # 标签
index_img: /images/golang/gopher-inclusion.png
---

> “使用通信来共享内存，而不是通过共享内存来通信” — 通信顺序进程<!-- more -->

### `goroutine`

![](/images/golang/goroutine.png)

#### 协程 `Coroutine`

- *轻量级*线程

- **非抢占式**多任务处理，由协程主动交出控制权
- 编译器/解释器/虚拟机层的多任务
- 多个协程可以在一个或者多个线程上运行

##### 其他语言对协程的支持

`Java`：标准库不支持

`Python`：3.5版本前使用yield关键字

​				 3.5以后， `async def 方法名`实现协程的原生支持

##### 可能切换`goroutine`的事件

- `I/O, Select`
- `channel`
- 等待锁
- 函数调用
- `runtime.Gosched()`
- `.e.g`

```go
import (
	"fmt"
	"time"
)

func Run()  {
	for i := 0; i < 100; i ++ {
		go func(j int) {
			for{
				fmt.Println("go run from", j)
			}
		}(i)
	}
	time.Sleep(time.Minute)
}
```

#### Channel

![](/images/golang/channel.png)

```go
import (
	"fmt"
	"time"
)

func works(id int, c chan int)  {
	// 不断的从channel取
	for  {
		fmt.Printf("channel %d receive %c\n", id, <-c)
	}
}

func workIfNotClose(id int, c chan int)  {
	// 接收方判断channel中有数据就不断的从channel取
	for  {
		n, ok := <-c
		if !ok{
			break
		}
		fmt.Printf("channel %d receive %c\n", id, n)
	}
}

func workIfNotCloseSimple(id int, c chan int)  {
	// 接收方判断channel中有数据就不断的从channel取
	for n := range c{
		fmt.Printf("channel %d receive %c\n", id, n)
	}
}

func createWorks(id int) chan<- int {
	c := make(chan int)
	go works(id, c)
	return c
}

func first()  {
	// 创建channel用例
	var chans [10]chan int
	for  i := 0; i < 10; i++ {
		chans[i] = make(chan int)
		go works(i, chans[i])
	}
	// 往channel放
	for i := 0; i < 10; i++ {
		chans[i] <- 'a' + i
	}
	// 往channel放
	for i := 0; i < 10; i++ {
		chans[i] <- 'A' + i
	}
}

func second()  {
	// 只能发数据  chan<- int 将channel 作为函数返回参数  即 channel也是一等公民
	var chann [10] chan<- int
	for i := 0; i < 10; i++ {
		chann[i] = createWorks(i)
	}

	for i := 0; i < 10; i++ {
		chann[i] <- 'k' + i
	}

	for i := 0; i < 10; i++ {
		chann[i] <- 'K' + i
	}
}

func thirdBufferedChannel() {
	// channel缓冲区   可以放入不大于缓冲区的大小时，可以不用取
	c := make(chan int, 4)
	go works(0, c)
	c <- 'u'
	c <- 'v'
	c <- 'w'
	c <- 'x'
	c <- 'y'
}

func channelClose()  {
	c := make(chan int, 4)
	go workIfNotCloseSimple(0, c)
	c <- 'U'
	c <- 'V'
	c <- 'W'
	close(c)
}

func ChanDemo()  {

	//  channel也是一等公民
	first()
	second()
	fmt.Println("-----------------")
	thirdBufferedChannel()

	channelClose()

	time.Sleep(time.Second)
}


// 输出
channel 7 receive h
channel 9 receive j
channel 8 receive i
channel 5 receive f
channel 3 receive d
channel 6 receive g
channel 4 receive e
channel 2 receive c
channel 1 receive b
channel 0 receive a
channel 0 receive A
-----------------
channel 4 receive E
channel 3 receive D
channel 1 receive B
channel 7 receive H
channel 2 receive C
channel 5 receive F
channel 6 receive G
channel 9 receive J
channel 8 receive I
channel 0 receive k
channel 1 receive l
channel 2 receive m
channel 3 receive n
channel 4 receive o
channel 5 receive p
channel 6 receive q
channel 7 receive r
channel 7 receive R
channel 8 receive s
channel 8 receive S
channel 3 receive N
channel 5 receive P
channel 0 receive K
channel 6 receive Q
channel 9 receive t
channel 9 receive T
channel 2 receive M
channel 4 receive O
channel 1 receive L
-----------------
channel 0 receive u
channel 0 receive v
channel 0 receive w
channel 0 receive x
channel 0 receive y
channel 0 receive U
channel 0 receive V
channel 0 receive W
Exiting.
```

##### 通过通信来共享内存

```go
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021/2/5 下午5:05
 * Description:
 **/

package goroutines

import (
	"fmt"
)

type Worker struct {
	in chan int
	done chan bool
}

func doWork(id int, w Worker)  {
	// 接收方判断channel中有数据就不断的从channel取
	for n := range w.in{
		fmt.Printf("channel %d receive %c\n", id, n)
		w.done <- true
	}
}

func createWorkers(id int) Worker {
	w := Worker{
		in: make(chan int),
		done: make(chan bool),
	}
	go doWork(id, w)
	return w
}

func communicate()  {
	// 只能发数据  chan<- int 将channel 作为函数返回参数  即 channel也是一等公民
	var works [10]Worker
	for i := 0; i < 10; i++ {
		works[i] = createWorkers(i)
	}

	for i, worker := range works{
		worker.in <- 'a' + i
	}

	for _, worker := range works{
		<- worker.done
	}

	for i, worker := range works{
		worker.in <- 'A' + i
	}

	for _, worker := range works{
		<- worker.done
	}
}


func doWork2(id int, w Worker)  {
	// 接收方判断channel中有数据就不断的从channel取
	for n := range w.in{
		fmt.Printf("channel %d receive %c\n", id, n)
		go func() {
			w.done <- true
		}()
	}
}

func createWorkers2(id int) Worker {
	w := Worker{
		in: make(chan int),
		done: make(chan bool),
	}
	go doWork2(id, w)
	return w
}

func communicateDoneAll()  {
	// 只能发数据  chan<- int 将channel 作为函数返回参数  即 channel也是一等公民
	var worksAll [10]Worker

	for i := 0; i < 10; i++ {
		worksAll[i] = createWorkers2(i)
	}

	for i, worker := range worksAll {
		worker.in <- 'j' + i
	}

	for i, worker := range worksAll {
		worker.in <- 'J' + i
	}

	// 等所有任务都取完 再结束
	for _, worker := range worksAll {
		<- worker.done
		<- worker.done
	}
}

func communicateDemo()  {
	communicate()
	fmt.Println("----------------")
	communicateDoneAll()
}

// 输出
channel 7 receive h
channel 5 receive f
channel 8 receive i
channel 9 receive j
channel 2 receive c
channel 3 receive d
channel 1 receive b
channel 0 receive a
channel 4 receive e
channel 6 receive g
channel 6 receive G
channel 7 receive H
channel 8 receive I
channel 9 receive J
channel 0 receive A
channel 1 receive B
channel 2 receive C
channel 3 receive D
channel 5 receive F
channel 4 receive E
----------------
channel 0 receive j
channel 1 receive k
channel 4 receive n
channel 2 receive l
channel 3 receive m
channel 2 receive L
channel 8 receive r
channel 0 receive J
channel 1 receive K
channel 7 receive q
channel 5 receive o
channel 9 receive s
channel 3 receive M
channel 5 receive O
channel 6 receive p
channel 4 receive N
channel 6 receive P
channel 9 receive S
channel 7 receive Q
channel 8 receive R
```

##### 利用channel遍历树

```go
package goroutines

import "fmt"

type Node struct {
	Value       int
	Left, Right *Node
}

func createNode(value int) *Node {
	return &Node{Value: value}
}

func (node *Node) setValue(value int) {
	// 接收者使用指针才可以改变结构内容
	if node == nil {
		fmt.Println("Setting Value to nil node. Ignored.")
		return
	}
	node.Value = value
}

func (node *Node) print() {
	if node == nil {
		return
	}
	fmt.Print(node.Value, " ")
}

func (node *Node)travelsWithFunc(f func(*Node)) {
	if node == nil {
		return
	}
	node.Left.travelsWithFunc(f)
	f(node)
	node.Right.travelsWithFunc(f)
}

func (node *Node)travelWithChannel() chan *Node{
	c := make(chan *Node)
	go func() {
		node.travelsWithFunc(func(node *Node) {
			c <- node
		})
		close(c)
	}()
	return c
}

func initTree() *Node {
	var root Node
	root = Node{Value: 3}
	root.Left = &Node{}
	root.Right = &Node{5, nil, nil}
	root.Right.Left = new(Node)
	root.Left.Right = createNode(2)
	root.Right.Left.setValue(4)
	return &root
}

func Demo()  {
	t := initTree()

	// 计数
  nodeCount := 0
	t.travelsWithFunc(func(node *Node) {
		nodeCount++
	})
	fmt.Println("Node counts", nodeCount)

	// 树中最大值
  c := t.travelWithChannel()
	maxNode := 0
	// 从channel中取
	for n := range c {
		if maxNode < n.Value {
			maxNode = n.Value
		}
	}
	fmt.Println("Max node:", maxNode)
}
```

#### `Select`调度

```go
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021/2/5 上午10:37
 * Description: select
 **/

package goroutines

import (
	"fmt"
	"math/rand"
	"time"
)

type SelectWorker struct {
	id string
	c chan int
}

func (w *SelectWorker) setValue(id string)  {
	w.id = id
}

func selectNotBlock(c1, c2 chan int)  {
	for {
		select {
		case n := <- c1:
			fmt.Printf("receice %d from c1\n", n)
		case n := <-c2:
			fmt.Printf("receice %d from c2\n", n)
		default:
			fmt.Println("not receive anything")
		}
	}
}

func selectBlock(c1, c2 chan int)  {
	for {
		select {
		case n := <- c1:
			fmt.Printf("receice %d from c1\n", n)
		case n := <-c2:
			fmt.Printf("receice %d from c2\n", n)

		}
	}
}

func selectWorkConditionBlock(rw, sw1, sw2 SelectWorker)  {
	var values []int
	id := ""
	endTime := time.After(time.Second * 10)
	tick := time.Tick(time.Second)
	for {
		activeWorker := SelectWorker{
			c:  nil,
		}
		var activeValue int
		if len(values) >0 {
			rw.setValue(id)
			activeWorker = rw
			activeValue = values[0]
		}
		select {
		case n := <-sw1.c:
			id = sw1.id
			values = append(values, n)
		case n := <-sw2.c:
			id = sw2.id
			values = append(values, n)
		case activeWorker.c <- activeValue:
			values = values[1:]
		case <-time.After(time.Millisecond * 600):  // 500毫秒未产生数据
			fmt.Println("程序超时")
		case <- tick:
			fmt.Println("queue len = ", len(values))
		case <- endTime:  // 程序执行到endTime时结束
			fmt.Println("程序执行结束")
			return
		}
	}
}

func generateChannel() chan int{
	c := make(chan int)
	go func() {
		i := 0
		for {
			time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
			c <- i
			i++
		}
	}()
	return c
}

func generateWorkChannel(id string) SelectWorker {
	w := SelectWorker{
		id:id,
		c: make(chan int),
	}
	go func() {
		i := 0
		for {
			time.Sleep(time.Duration(rand.Intn(1000)) * time.Millisecond)
			w.c <- i
			i++
		}
	}()
	return w
}


func selectWorks(id string, rw SelectWorker)  {
	// 不断的从channel取
	for  {
		fmt.Printf("channel %s from %s receive %d\n", id, rw.id, <-rw.c)
		time.Sleep(time.Second)
	}
}

func createSelectWorks(id string) SelectWorker {
	rw := SelectWorker{
		c:  make(chan int),
	}
	go selectWorks(id, rw)
	return rw
}

func channelSelectBlock()  {
	var c1, c2 = generateChannel(), generateChannel()
	selectBlock(c1, c2)
}

func channelSelectWork()  {
	var sw1, sw2 = generateWorkChannel("send worker1"), generateWorkChannel("send worker2")
	rw := createSelectWorks("receive work1")
	selectWorkConditionBlock(rw, sw1, sw2)
}


func selectDemo()  {

	//var c1, c2 chan int
	//selectNotBlock(c1, c2)

	//channelSelectBlock()

	channelSelectWork()
}
```

#### 同步机制

- `WaitGroup`

基于`WaitGroup`实现通信来共享内存

```go
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021/2/5 下午5:37
 * Description: 基于WaitGroup实现通信来共享内存
 **/

package goroutines

import (
	"fmt"
	"sync"
)

type WorkerWG struct {
	in chan int
	wg *sync.WaitGroup
}

func doWorkWaitDone(id int, w WorkerWG)  {
	// 接收方判断channel中有数据就不断的从channel取
	for n := range w.in{
		fmt.Printf("channel %d receive %c\n", id, n)
		w.wg.Done()
	}
}

func createWaitDoneWorkers(id int, wg *sync.WaitGroup) WorkerWG {
	w := WorkerWG{
		in: make(chan int),
		wg: wg,
	}
	go doWorkWaitDone(id, w)
	return w
}

func communicateWaitDone()  {
	// 只能发数据  chan<- int 将channel 作为函数返回参数  即 channel也是一等公民
	var works [10]WorkerWG
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		works[i] = createWaitDoneWorkers(i, &wg)
	}

	//wg.Add(20)

	for i, worker := range works{
		worker.in <- 'a' + i
		wg.Add(1)
	}

	for i, worker := range works{
		worker.in <- 'A' + i
		wg.Add(1)
	}

	wg.Wait()
}


type WorkerWG2 struct {
	in chan int
	done func()  // 函数式编程
}

// WorkerWG封装
func doWorkWaitDone2(id int, w WorkerWG2)  {
	// 接收方判断channel中有数据就不断的从channel取
	for n := range w.in{
		fmt.Printf("channel %d receive %c\n", id, n)
		w.done()
	}
}

func createWaitDoneWorkers2(id int, wg *sync.WaitGroup) WorkerWG2 {
	w := WorkerWG2{
		in: make(chan int),
		done: func() {
			wg.Done()
		},
	}
	go doWorkWaitDone2(id, w)
	return w
}

func communicateWaitDone2()  {
	// 只能发数据  chan<- int 将channel 作为函数返回参数  即 channel也是一等公民
	var works [10]WorkerWG2
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		works[i] = createWaitDoneWorkers2(i, &wg)
	}

	wg.Add(20)
	for i, worker := range works{
		worker.in <- 'a' + i
		//wg.Add(1)
	}
	for i, worker := range works{
		worker.in <- 'A' + i
		//wg.Add(1)
	}
	wg.Wait()
}

// 输出
channel 7 receive h
channel 5 receive f
channel 6 receive g
channel 0 receive a
channel 8 receive i
channel 1 receive b
channel 3 receive d
channel 2 receive c
channel 4 receive e
channel 9 receive j
channel 9 receive J
channel 3 receive D
channel 0 receive A
channel 5 receive F
channel 2 receive C
channel 4 receive E
channel 6 receive G
channel 1 receive B
channel 7 receive H
channel 8 receive I
channel 9 receive j
channel 6 receive g
channel 8 receive i
channel 4 receive e
channel 0 receive a
channel 0 receive A
channel 2 receive c
channel 3 receive d
channel 5 receive f
channel 1 receive b
channel 1 receive B
channel 7 receive h
channel 7 receive H
channel 3 receive D
channel 5 receive F
channel 4 receive E
channel 6 receive G
channel 9 receive J
channel 2 receive C
channel 8 receive I
```

- `Mutux`

```go
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021/2/5 下午2:34
 * Description:
 **/

package goroutines

import (
	"fmt"
	"sync"
	"time"
)

type AtomicInt struct {
	value int
	lock sync.Mutex
}

func (a *AtomicInt) increase()  {
	fmt.Println("safe Increase")
	func(){
		//a.lock.Lock()
		//defer a.lock.Unlock()
		a.value++
	}()
}

func (a *AtomicInt) get() int {
	//a.lock.Lock()
	//defer a.lock.Unlock()
	return a.value
}

func AtomicDemo()  {
	 i := AtomicInt{}
	 i.increase()
	 go func() {
	 	i.increase()
	 }()
	time.Sleep(time.Millisecond)
	 fmt.Println(i.get())
}


// 输出
xxx@xxxdeMacBook-Pro  ~/Projects/golang/src/offer/note   master ±✚  go run -race main.go
safe Increase
safe Increase
==================
WARNING: DATA RACE
Read at 0x00c000134010 by main goroutine:
  offer/note/goroutines.(*AtomicInt).get()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:33 +0xab
  offer/note/goroutines.AtomicDemo()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:43 +0xb4
  main.main()
      /Users/wangpeng/Projects/golang/src/offer/note/main.go:75 +0x2f

Previous write at 0x00c000134010 by goroutine 7:
  offer/note/goroutines.(*AtomicInt).increase.func1()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:26 +0xbd
  offer/note/goroutines.(*AtomicInt).increase()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:27 +0x9e
  offer/note/goroutines.AtomicDemo.func1()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:40 +0x38

Goroutine 7 (finished) created at:
  offer/note/goroutines.AtomicDemo()
      /Users/wangpeng/Projects/golang/src/offer/note/goroutines/atomic.go:39 +0x90
  main.main()
      /Users/wangpeng/Projects/golang/src/offer/note/main.go:75 +0x2f
==================
2
Found 1 data race(s)
exit status 66
```

```go
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021/2/5 下午2:34
 * Description:
 **/

package goroutines

import (
	"fmt"
	"sync"
	"time"
)

type AtomicInt struct {
	value int
	lock sync.Mutex
}

func (a *AtomicInt) increase()  {
	fmt.Println("safe Increase")
	func(){
		a.lock.Lock()
		defer a.lock.Unlock()
		a.value++
	}()
}

func (a *AtomicInt) get() int {
	a.lock.Lock()
	defer a.lock.Unlock()
	return a.value
}

func AtomicDemo()  {
	 i := AtomicInt{}
	 i.increase()
	 go func() {
	 	i.increase()
	 }()
	time.Sleep(time.Millisecond)
	 fmt.Println(i.get())
}


// 输出
xxx@xxxdeMacBook-Pro  ~/Projects/golang/src/offer/note   master ±✚  go run -race main.go
safe Increase
safe Increase
2
```

- `Cond`

#### `atomic`

Go 是一种擅长并发的语言，正确保护对共享资源的访问以防止竞争条件变得极其重要。此类资源可能包括可即时更新的配置（例如功能标志）、内部状态（例如断路器状态）等。

##### 竞态条件

```go
import (
	"fmt"
	"sort"
	"sync"
	"testing"
)

func TestAtomicCondition(t *testing.T) {
	for i := 0; i < 10;  i++ {
		traceCondition()
	}
}

func traceCondition() {
	var s = make([]int, 0)

	wg := sync.WaitGroup{}

	// 10 goroutines 并行修改 slice
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			s = append(s, i)
		}(i)
	}

	wg.Wait()

	sort.Ints(s)
	fmt.Println(s)
}


// 输出
=== RUN   TestAtomicCondition
[0 3 4 5]
[0 7]
[0 1 2 3 4 5 6 7 8 9]
[0 1 3 8 9]
[0 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
--- PASS: TestAtomicCondition (0.00s)
PASS
```

为什么响应切片中会出现不是`[0 1 2 3 4 5 6 7 8 9]`的情况？

这是因为切片的内容 `s` 在加载和修改之间发生了变化，导致程序覆盖了一些结果。这种特殊的竞态条件是由数据竞争引起的，在这种情况下，多个 goroutine 尝试同时访问特定的共享变量，并且这些 goroutine 中的至少一个尝试修改它。

如果你使用 `-race` 标志执行测试，go 甚至会告诉你存在数据竞争并帮助你准确定位：

```shell
go test atomic_test.go -race
==================
WARNING: DATA RACE
Read at 0x00c00008e008 by goroutine 10:
  runtime.growslice()
      /usr/local/Cellar/go/1.17.2/libexec/src/runtime/slice.go:162 +0x0
  command-line-arguments.raceCondition.func1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:33 +0xec
  command-line-arguments.raceCondition·dwrap·1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:34 +0x47

Previous write at 0x00c00008e008 by goroutine 8:
  command-line-arguments.raceCondition.func1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:33 +0x110
  command-line-arguments.raceCondition·dwrap·1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:34 +0x47

Goroutine 10 (running) created at:
  command-line-arguments.raceCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:31 +0xc5
  command-line-arguments.TestAtomicCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:19 +0x2b
  testing.tRunner()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1259 +0x22f
  testing.(*T).Run·dwrap·21()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1306 +0x47

Goroutine 8 (finished) created at:
  command-line-arguments.raceCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:31 +0xc5
  command-line-arguments.TestAtomicCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:19 +0x2b
  testing.tRunner()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1259 +0x22f
  testing.(*T).Run·dwrap·21()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1306 +0x47
==================
==================
WARNING: DATA RACE
Read at 0x00c000132060 by goroutine 9:
  command-line-arguments.raceCondition.func1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:33 +0xb4
  command-line-arguments.raceCondition·dwrap·1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:34 +0x47

Previous write at 0x00c000132060 by goroutine 8:
  command-line-arguments.raceCondition.func1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:33 +0x136
  command-line-arguments.raceCondition·dwrap·1()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:34 +0x47

Goroutine 9 (running) created at:
  command-line-arguments.raceCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:31 +0xc5
  command-line-arguments.TestAtomicCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:19 +0x2b
  testing.tRunner()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1259 +0x22f
  testing.(*T).Run·dwrap·21()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1306 +0x47

Goroutine 8 (finished) created at:
  command-line-arguments.raceCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:31 +0xc5
  command-line-arguments.TestAtomicCondition()
      /Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:19 +0x2b
  testing.tRunner()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1259 +0x22f
  testing.(*T).Run·dwrap·21()
      /usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1306 +0x47
==================
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 5 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
--- FAIL: TestAtomicCondition (0.01s)
    testing.go:1152: race detected during execution of test
FAIL
FAIL	command-line-arguments	0.165s
FAIL
```

##### 并发控制

保护对这些共享资源的访问通常涉及常见的内存同步机制，例如通道或互斥锁。

这是将竞态条件调整为使用互斥锁的相同测试用例：

```go
import (
	"fmt"
	"sort"
	"sync"
	"testing"
)

func TestAtomicCondition(t *testing.T) {
	for i := 0; i < 10;  i++ {
		raceConditionLock()
	}
}

func raceConditionLock() {
	var s = make([]int, 0)

	wg := sync.WaitGroup{}
	m := sync.Mutex{}

	// 10 goroutines 并行修改 slice
	for i := 0; i < 10; i++ {
		m.Lock()
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			defer m.Unlock()
			s = append(s, i)
		}(i)
	}

	wg.Wait()

	sort.Ints(s)
	fmt.Println(s)
}


// 输出
=== RUN   TestAtomicCondition
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
--- PASS: TestAtomicCondition (0.00s)
PASS
```

每个 goroutine 仅在没有其他人执行时才读写切片。如果第二个 goroutine 同时尝试获取锁，它必须等到前一个 goroutine 完成（即直到它解锁）。

然而，对于高吞吐量系统，性能变得非常重要，因此减少锁争用（即一个进程或线程试图获取另一个进程或线程持有的锁的情况）变得更加重要。执行此操作的最基本方法之一是使用读写锁 ( `sync.RWMutex`) 而不是标准 `sync.Mutex`，但是 Go 还提供了一些原子内存原语即 `atomic` 包。

##### 原子

Go 的 atomic 包提供了用于实现同步算法的低级原子内存原语。

```go
import (
	"fmt"
	"sort"
	"sync"
	"sync/atomic"
	"testing"
)

func TestAtomicCondition(t *testing.T) {
	for i := 0; i < 10;  i++ {
		raceConditionAtomic()
	}
}

func raceConditionAtomic() {
	var s = atomic.Value{}
	s.Store([]int{})

	wg := sync.WaitGroup{}

	// 10 goroutines 并行修改 slice
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			s1 := s.Load().([]int)
			s.Store(append(s1, i))
		}(i)
	}

	wg.Wait()

	s1 := s.Load().([]int)
	sort.Ints(s1)
	fmt.Println(s1)
}

// 输出
=== RUN   TestAtomicCondition
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 1 2 4 5 6 7 8 9]
[1 2 3 4 5 6 7 8 9]
[0 1 2 3 4 5 6 7 8 9]
[0 2 3 4 5 6 9]
--- PASS: TestAtomicCondition (0.00s)
PASS
```

虽然`s.Load`与`s.Store`分别为原子操作，但整个过程并非原子，因此还会存在竞态条件。但是当涉及到可以使用Read-copy-update[^1]模式管理的共享资源时，它非常出色。在这种技术中，我们通过引用获取当前值，当我们想要更新它时，我们不修改原始值，而是替换指针（因此没有人访问另一个线程可能访问的相同资源）。另外，atomic原子操作很快，因为它们依赖于原子 CPU 指令而不是依赖外部锁。使用互斥锁时，每次获得锁时，goroutine 都会短暂暂停或中断，这种阻塞占使用互斥锁所花费时间的很大一部分。

##### 常见例子

当共享资源时，某些操作只能使用互斥锁来解决，atomic 无法解决所有问题，常用于 map 作为内存缓存。

```go
package cache

type Cache interface {
	Del(key string)
	Keys() []string
}

type IntCache interface {
	Cache
	// Get 缓存中value为int 
	Get(key string) (int64, bool)
	Set(key string, val int64)
	Add(key string, delta int64) int64
}
```

```go
package integer

import (
	"sync"
	"sync/atomic"

	"github.com/weitrue/Seckill/infrastructure/stores/cache"
)

type intCache struct {
	sync.RWMutex
	data map[string]*int64 // 整数指针，方便原子操作
}

func NewIntCache() cache.IntCache {
	return &intCache{
		data: make(map[string]*int64),
	}
}

func (c *intCache) getPtr(key string) *int64 {
	c.RLock()
	defer c.RUnlock()
	valPtr, _ := c.data[key]
	return valPtr
}

func (c *intCache) Get(key string) (int64, bool) {
	if valPtr := c.getPtr(key); valPtr != nil {
		return atomic.LoadInt64(valPtr), true
	} else {
		return 0, false
	}

}

func (c *intCache) Set(key string, val int64) {
	if valPtr := c.getPtr(key); valPtr != nil {
		// 指针存在，使用原子操作
		atomic.StoreInt64(valPtr, val)
	} else {
		valPtr = new(int64)
		*valPtr = val
		c.Lock()
		defer c.Unlock()
		c.data[key] = valPtr
	}
}
```

```go
package integer

import (
	"os"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/weitrue/Seckill/infrastructure/stores/cache"
)

func initKeys(b *testing.B) []string {
	var keys = make([]string, 0)
	maxKeyStr := os.Getenv("maxKey")
	maxKey, _ := strconv.Atoi(maxKeyStr)
	if maxKey <= 0 {
		maxKey = b.N
	}
	for i := 0; i < maxKey; i++ {
		keys = append(keys, strconv.Itoa(i))
	}
	return keys
}

func initIntCache(b *testing.B, c cache.IntCache, keys []string) {
	l := len(keys)
	for i := 0; i < b.N; i++ {
		c.Set(keys[i%l], int64(i))
	}
}

// Set
func BenchmarkIntCache_Set(b *testing.B) {
	keys := initKeys(b)
	c := NewIntCache()

	b.ReportAllocs()
	b.StartTimer()
	initIntCache(b, c, keys)
	b.StopTimer()
}

// Get
func BenchmarkIntCache_Get(b *testing.B) {
	keys := initKeys(b)
	c := NewIntCache()
	initIntCache(b, c, keys)
	l := len(keys)

	b.ReportAllocs()
	b.StartTimer()
	for i := 0; i < b.N; i++ {
		c.Get(keys[i%l])
	}
	b.StopTimer()
}

// 
goos: darwin
goarch: amd64
cpu: Intel(R) Core(TM) i5-8279U CPU @ 2.40GHz
BenchmarkIntCache_Get
BenchmarkIntCache_Get-8   	 1963155	       663.3 ns/op	     230 B/op	       2 allocs/op
BenchmarkIntCache_Set
BenchmarkIntCache_Set-8   	 2321728	       489.7 ns/op	     215 B/op	       2 allocs/op
```

```go
package int

import (
	"sync/atomic"

	"github.com/weitrue/Seckill/infrastructure/stores/cache"
)

type integerCache struct {
	data atomic.Value
}

func NewIntegerCache() cache.IntCache {
	ic := &integerCache{}
	ic.data.Store(make(map[string]*int64))
	return ic
}

func (i *integerCache) getPtr(key string) *int64 {
	valPtr, _ := i.data.Load().(map[string]*int64)[key]
	return valPtr
}

func (i *integerCache) Get(key string) (int64, bool) {
	if valPtr := i.getPtr(key); valPtr != nil {
		return *valPtr, true
	} else {
		return 0, false
	}
}

func (i *integerCache) Set(key string, val int64) {
	oldMap := i.data.Load().(map[string]*int64)
	newMap := make(map[string]*int64, len(oldMap)+1)
	for k, v := range oldMap {
		newMap[k] = v
	}
	newMap[key] = &val
	i.data.Store(newMap)
}
```

```go
package int

import (
	"os"
	"strconv"
	"testing"

	"github.com/weitrue/Seckill/infrastructure/stores/cache"
)

func initKeys(b *testing.B) []string {
	var keys = make([]string, 0)
	maxKeyStr := os.Getenv("maxKey")
	maxKey, _ := strconv.Atoi(maxKeyStr)
	if maxKey <= 0 {
		maxKey = b.N
	}
	for i := 0; i < maxKey; i++ {
		keys = append(keys, strconv.Itoa(i))
	}
	return keys
}

func initIntCache(b *testing.B, c cache.IntCache, keys []string) {
	l := len(keys)
	for i := 0; i < b.N; i++ {
		c.Set(keys[i%l], int64(i))
	}
}

// Set
func BenchmarkIntCache_Set(b *testing.B) {
	keys := initKeys(b)
	c := NewIntegerCache()
	b.ReportAllocs()
	b.StartTimer()
	initIntCache(b, c, keys)
	b.StopTimer()
}

// Get
func BenchmarkIntCache_Get(b *testing.B) {
	keys := initKeys(b)
	c := NewIntegerCache()
	initIntCache(b, c, keys)
	l := len(keys)

	b.ReportAllocs()
	b.StartTimer()
	for i := 0; i < b.N; i++ {
		c.Get(keys[i%l])
	}
	b.StopTimer()
}

// 
goos: darwin
goarch: amd64
cpu: Intel(R) Core(TM) i5-8279U CPU @ 2.40GHz
BenchmarkIntCache_Get
BenchmarkIntCache_Get-8   	   10000	    322438 ns/op	  257816 B/op	      16 allocs/op
BenchmarkIntCache_Set
BenchmarkIntCache_Set-8   	   10000	    312548 ns/op	  257814 B/op	      16 allocs/op
```

##### 注意事项

Go 的文档[^2]警告了 atomic 包的潜在误用：

```shell
这些函数需要非常小心才能正确使用。除了特殊的低级应用程序，同步最好使用通道或 sync 包的工具来完成。通过通信共享内存；不要通过共享内存进行通信。
```

开始使用 atomic 包时，可能会遇到的第一个问题是：

```go
panic: sync/atomic: store of inconsistently typed value into Value
```

使用 `atomic.Store`，确保每次调用方法时都存储完全相同的类型很重要。这听起来很容易，但通常并不像听起来那么简单：

```go
type CustomError struct {
	Code    int
	Message string
}

func (e CustomError) Error() string {
	return fmt.Sprintf("%d: %s", e.Code, e.Message)
}

func InternalServerError(msg string) error {
	return CustomError{Code: 500, Message: msg}
}

func TestAtomicType(t *testing.T) {
	var (
		err1 error = fmt.Errorf("error happened")
		err2 error = InternalServerError("another error happened")
	)

	errVal := atomic.Value{}
	errVal.Store(err1)
	errVal.Store(err2)
}


//
panic: sync/atomic: store of inconsistently typed value into Value [recovered]
	panic: sync/atomic: store of inconsistently typed value into Value

goroutine 18 [running]:
testing.tRunner.func1.2({0x10f1b00, 0x1137cb0})
	/usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1209 +0x24e
testing.tRunner.func1()
	/usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1212 +0x218
panic({0x10f1b00, 0x1137cb0})
	/usr/local/Cellar/go/1.17.2/libexec/src/runtime/panic.go:1038 +0x215
sync/atomic.(*Value).Store(0xc000096530, {0x10ff160, 0xc0000b2060})
	/usr/local/Cellar/go/1.17.2/libexec/src/sync/atomic/value.go:77 +0xd8
offer/notes/awesomego.TestAtomicType(0x0)
	/Users/wangpeng/Projects/golang/src/offer/notes/awesomego/atomic_test.go:111 +0xd8
testing.tRunner(0xc000083520, 0x11195e8)
	/usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1259 +0x102
created by testing.(*T).Run
	/usr/local/Cellar/go/1.17.2/libexec/src/testing/testing.go:1306 +0x35a
```

两个值都是 `error` 类型是不够的，因为它们只是实现了错误接口。它们的具体类型仍然不同，因此 atomic 不喜欢它。

竞态条件很糟糕，应该保护对共享资源的访问。但由于锁争用而趋于缓慢，对于某些读取-复制-更新模式有意义的情况（这往往是动态配置之类的东西，例如特性标志、日志级别或 map 或结构体，一次填充例如通过 JSON 解析等），尤其是当读取次数比写入次数多时，atomic 通常不应用于其他用例（例如，随时间增长的变量，如缓存），并且该特性的使用需要非常小心。

[^1]: [Read-copy-update](https://en.wikipedia.org/wiki/Read-copy-update)
[^2]: [文档](https://pkg.go.dev/sync/atomic)
