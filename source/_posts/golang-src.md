---
title: 【Go】源码
categories: Golang
tags: [Go]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/golang/src/index.png
banner_img: /images/img/banner.png
---

> <!-- more -->

### 基础类型

#### slice

#### Map

#### Channel

##### chansend源码

```flow
s=>start: 开始
op1=>operation: 阻塞 等待被唤醒
op2=>operation: 被唤醒,清理
op3=>operation: 阻 塞
op4=>operation: 发给接收者
op5=>operation: 放入缓冲区
op6=>operation: 唤醒接收者
op7=>operation: 返回
e=>end

cond1=>condition: chan=nil?
cond2=>condition: 有阻塞的接收者?
cond3=>condition: 缓冲没满?

s->cond1
cond1(yes,right)->op3(right)->op7
cond1(no)->cond2
cond2(yes,right)->op4(right)->op6->op7
cond2(no)->cond3
cond3(yes,right)->op5->op7
cond3(no)->op1->op2(right)->op7
op7(right)->e
```

- 是否nil channel，是的话直接阻塞
- 是否有被阻塞的接收者，有的话直接交付数据，返回
- 没有的话，看缓冲区是否满了，没满放入缓冲，返回
- 满了，阻塞，等待接收者唤醒
- 被唤醒，做些清操作

![](/images/golang/chan.send1.png)

![](/images/golang/chan.send2.png)

![](/images/golang/chan.send3.png)

##### chanrecv源码

![](/images/golang/chan.recv1.png)

![](/images/golang/chan.recv2.png)

![](/images/golang/chan.recv3.png)

##### Goroutine泄露与内存逃逸

如果channel使用不当，goroutine被阻塞后没有唤醒会导致goroutine泄露：

- 只发送不接收，发送者阻塞，会导致发送者goroutine泄露
- 只接收不发送，接受者阻塞，会导致接收者goroutine泄露
- 读写nil都会导致goroutine泄露
- 唯一例外的是业务层面上的goroutine长时间运行
- 如果用channel发送指针，那么必然发生内存逃逸

### 原生库

#### context



#### sync

##### sync.Map

{% note success %}

- `read` 只读数据 `readOnly`
- `dirty` 读写数据，操作 `dirty` 需要用 `mu` 进行加锁来保证并发安全
- `misses` 用于统计有多少次读取 `read` 没有命中
- `amended` 用于标记 `read` 和 `dirty` 的数据是否一致

{% endnote %}

![](/images/golang/src/sync.map.png)

{% note success %}

Load

- 先从 `read` 读
- 没有命中，到 `dirty` 读取数据，同时调用 `missLocked()` 增加 `misses`
- 当 `misses` 大于 `len(dirty)` 时（ `read` 和 `dirty` 的数据相差太大)，会将 `dirty` 的数据赋值给 `read`， `dirty` 会被置空

{% endnote %}

```go
func (m *Map) Load(key interface{}) (value interface{}, ok bool) {
    read, _ := m.read.Load().(readOnly)
    e, ok := read.m[key]
    if !ok && read.amended {
        m.mu.Lock()
        read, _ = m.read.Load().(readOnly)
        e, ok = read.m[key]
        if !ok && read.amended {
            e, ok = m.dirty[key]
            m.missLocked()
        }
        m.mu.Unlock()
    }
    if !ok {
        return nil, false
    }
    return e.load()
}
```

```go
func (m *Map) missLocked() {
    m.misses++
    if m.misses < len(m.dirty) {
        return
    }
    m.read.Store(readOnly{m: m.dirty})
    m.dirty = nil
    m.misses = 0
}
```

{% note success %}

Store

- 直接到 `read` 修改数据，修改成功则直接返回
- 如果 `key` 不存在，到 `dirty` 找数据， `dirty` 存在 `key` 则修改，
- 不存在则新增，同时还要将 `read` 中的 `amended` 标记为 true（ `read` 和 `dirty` 的数据已经不一致）

{% endnote %}

```go
func (m *Map) Store(key, value interface{}) {
    read, _ := m.read.Load().(readOnly)
    if e, ok := read.m[key]; ok && e.tryStore(&value) {
        return
    }

    m.mu.Lock()
    read, _ = m.read.Load().(readOnly)
    if e, ok := read.m[key]; ok {
        if e.unexpungeLocked() {
            m.dirty[key] = e
        }
        e.storeLocked(&value)
    } else if e, ok := m.dirty[key]; ok {
        e.storeLocked(&value)
    } else {
        if !read.amended {
            m.dirtyLocked()
            m.read.Store(readOnly{m: read.m, amended: true})
        }
        m.dirty[key] = newEntry(value)
    }
    m.mu.Unlock()
}
```

{% note success %}

Range

-  `Range` 会保证 `read` 和 `dirty` 是数据同步的
- 回调函数返回 false 会导致迭代中断

{% endnote %}

```go
func (m *Map) Range(f func(key, value interface{}) bool) {
    read, _ := m.read.Load().(readOnly)
    if read.amended {
        m.mu.Lock()
        read, _ = m.read.Load().(readOnly)
        if read.amended {
            read = readOnly{m: m.dirty}
            m.read.Store(read)
            m.dirty = nil
            m.misses = 0
        }
        m.mu.Unlock()
    }

    for k, e := range read.m {
        v, ok := e.load()
        if !ok {
            continue
        }
        if !f(k, v) {
            break
        }
    }
}
```

{% note success %}

Delete

- `延迟删除`的机制，
- 首先到 查找`read` 是否存在 `key`，如果存在则执行 `entry.delete` 进行软删除，通过 CAS 将指针 `entry.p (存放数据的指针)` 置为 nil，减少锁开销提高并发性能。
-  `read` 找不到 `key` 且 `amended` 为 true 才会通过 `delete` 进行硬删除，这个阶段是会加锁的。

{% endnote %}

```go
func (m *Map) Delete(key interface{}) {
    m.LoadAndDelete(key)
}

func (m *Map) LoadAndDelete(key interface{}) (value interface{}, loaded bool) {
    read, _ := m.read.Load().(readOnly)
    e, ok := read.m[key]
    if !ok && read.amended {
        m.mu.Lock()
        read, _ = m.read.Load().(readOnly)
        e, ok = read.m[key]
        if !ok && read.amended {
            e, ok = m.dirty[key]
            delete(m.dirty, key)
            m.missLocked()
        }
        m.mu.Unlock()
    }
    if ok {
        return e.delete()
    }
    return nil, false
}

func (e *entry) delete() (value interface{}, ok bool) {
    for {
        p := atomic.LoadPointer(&e.p)
        if p == nil || p == expunged {
            return nil, false
        }
        if atomic.CompareAndSwapPointer(&e.p, p, nil) {
            return *(*interface{})(p), true
        }
    }
}
```

##### sync.Mutex && sync.RWMutex

{% note success %}

- state用来控制锁状态的核心。
- sema处理沉睡/唤醒的信号量
  - runtime_SemacquireMutex：sema加1并且挂起goroutine
  - runtime_Semrelease：sema减1并唤起sema上等待的一个goroutine
- 总体流程
  1. 先进性一个人*CAS操作*。如果锁空闲，并且没有其他协程竞争，便直接成功。
  2. 否则自旋几次，如果成功，不用加入队列。
  3. 否则加入队列
  4. 从队列中被唤醒
     - 正常模式：和新来的协程一起竞争锁，但是大概率失败（等待队列中的协程等待时间***超过1ms***,锁会变成饥饿模式）
     - 饥饿模式：肯定拿到锁
- 可以基于RWMutex实现double-check
  - 加读锁先检查一遍
  - 释放读锁
  - 加写锁
  - 在检查一遍

{% endnote %}

```flow
s=>start: Start
op1=>operation: 加入等待队列|past
op2=>operation: 被唤醒
op3=>operation: 拿到锁
e=>end

cond1=>condition: 自旋?
cond2=>condition: 能否继续自旋?
cond3=>condition: 竞争锁?

s->cond1
cond1(no)->cond2
cond1(yes)->op3
cond2(yes,right)->cond1
cond2(no)->op1
op1->op2->cond3
cond3(no,right)->op1
cond3(yes,left)->op3
op3->e
```

![](/images/golang/sync.Mutex.interview.png)

##### sync.Once

{% note success %}

- 利原子操作实现读写锁的double-check

{% endnote %}

![](/images/golang/once.double-check.png)

##### sync.Pool

{% note success %}

PMG调度模型实现的Pool。

- 每个P带有一个poolLocal对象
- 每个poolLocal又一个private和shared
- shared指向的是一个poolChain，poolChain的数据会被别的P偷走
- poolChain是一个链表+ring buffer的双重结构
  - 从总体上看，是一个双链表
  - 从单个节点来说，它指向的是一个ring buffer（后面节点的ring buffer长度是前面节点ring buffer长度的二倍）

{% endnote %}

![](/images/golang/sync.pool.detail.png)

![](/images/golang/src/sync.pool.png)

{% note success %}

sync.Pool.Get

- *private是否可用*，可用直接返回
- 不可用从自己的poolChain里尝试获取
  - 从`head`开始找（当前头指向的是最近创建的ringbuffer）
  - 在ringbuffer队列中从队头往队尾找
- 找不到尝试从别的P里面偷（偷的过程是全局并发的）
  - 偷是从`tail`队尾开始找
- 偷不到，会从victim中找
- victim找不到，会创建新的

{% endnote %}

```go
func (p *Pool) Get() interface{} {
    l, pid := p.pin()
    x := l.private
    l.private = nil
    if x == nil {
        x, _ = l.shared.popHead()
        if x == nil {
            x = p.getSlow(pid)
        }
    }
    runtime_procUnpin()
    if x == nil && p.New != nil {
        x = p.New()
    }
    return x
}
```

{% note success %}

sync.Pool.Put

- private没被占用，直接放private
- 否则放入shared(poolChain)
  - poolChain的HEAD没有创建,就创建一个HEAD,然后穿件一个容量为*8*的ring buffer,把数据丢过去
  - poolChain的HEAD指向的ring buffer没满，数据丢到ring buffer
  - poolChain的HEAD指向的ring buffer满了，创建新节点（2倍容量的ring buffer）,把数据丢过去

{% endnote %}

```go
func (p *Pool) Put(x interface{}) {
    if x == nil {
        return
    }
    l, _ := p.pin()
    if l.private == nil {
        l.private = x
        x = nil
    }
    if x != nil {
        l.shared.pushHead(x)
    }
    runtime_procUnpin()
}
```

![](/images/golang/src/sync.pool.poolchain.png)

{% note success %}

sync.Pool存粹依赖GC 进行淘汰。核心在于locals和victim

- locals会被挪过去变成victim
- victim会被GC时直接回收掉，如果victim里的对象被再次使用，则会被丢到locals

{% endnote %}

![](/images/golang/sync.pool.interview.png)

sync.WaitGroup

{% note success %}

- Add:state1的高32位自增1
- Done:state1的高32位减1,就是Add(-1)
- Wait:state1低32位自增1,同时利用state2和runtime_Semacquire将当前goroutine挂起

{% endnote %}

![](/images/golang/sync.waitgroup.add.png)

#### atomic

##### atomic.Value

原子读写只提供了 `int32`，`int64`，`uint32`，`uint64`，`uintptr` 和 `unsafe.Pointer` 数据类型。

 `atomic.Value` 的零值为 nil，且使用后不允许被拷贝。写入值后 `ifaceWords` 中 `typ` 保存数据类型，`data` 保存值。

```go
// A Value provides an atomic load and store of a consistently typed value.
// The zero value for a Value returns nil from Load.
// Once Store has been called, a Value must not be copied.
//
// A Value must not be copied after first use.
type Value struct {
    v interface{} // ifaceWords
}

type ifaceWords struct {
    typ  unsafe.Pointer
    data unsafe.Pointer
}
```

{% note success %}

Store

- 不能保存 nil
- `Store`固定类型，后续操作必须使用相同的数据类型，否则会 panic
- 首次 `Store` 会调用 `runtime_procPin()` 禁止当前 P 被抢占，然后 CAS 抢占乐观锁 ，将 `typ` 修改为中间值 `unsafe.Pointer(^uintptr(0))`
-  `if uintptr(typ) == ^uintptr(0)`  == `true`则表示还在抢占锁中，抢到锁就会修改 `typ` 和 `data`

{% endnote %}

```go
// Store sets the value of the Value to x.
// All calls to Store for a given Value must use values of the same concrete type.
// Store of an inconsistent type panics, as does Store(nil).
func (v *Value) Store(x interface{}) {
    if x == nil {
        panic("sync/atomic: store of nil value into Value")
    }
    vp := (*ifaceWords)(unsafe.Pointer(v))
    xp := (*ifaceWords)(unsafe.Pointer(&x))
    for {
        typ := LoadPointer(&vp.typ)
        if typ == nil {
            // Attempt to start first store.
            // Disable preemption so that other goroutines can use
            // active spin wait to wait for completion; and so that
            // GC does not see the fake type accidentally.
            runtime_procPin()
            if !CompareAndSwapPointer(&vp.typ, nil, unsafe.Pointer(^uintptr(0))) {
                runtime_procUnpin()
                continue
            }
            // Complete first store.
            StorePointer(&vp.data, xp.data)
            StorePointer(&vp.typ, xp.typ)
            runtime_procUnpin()
            return
        }
        if uintptr(typ) == ^uintptr(0) {
            // First store in progress. Wait.
            // Since we disable preemption around the first store,
            // we can wait with active spinning.
            continue
        }
        if typ != xp.typ {
            panic("sync/atomic: store of inconsistently typed value into Value")
        }
        StorePointer(&vp.data, xp.data)
        return
    }
}
```

{% note success %}

Load

- ifaceWords未写入,返回nil

{% endnote %}

```go
func (v *Value) Load() (x interface{}) {
    vp := (*ifaceWords)(unsafe.Pointer(v))
    typ := LoadPointer(&vp.typ)
    if typ == nil || uintptr(typ) == ^uintptr(0) {
        // First store not yet completed.
        return nil
    }
    data := LoadPointer(&vp.data)
    xp := (*ifaceWords)(unsafe.Pointer(&x))
    xp.typ = typ
    xp.data = data
    return
}
```

#### reflect

reflect.ValueOf: 用于操作值，部分值可以被反射修改

reflect.TypeOf: 用于操作类信息，只能读取（可以通过reflect.Value得到）

reflect.Kind: 用于判断类型

```go
import (
	"errors"
	"reflect"
	"testing"

	"github.com/stretchr/testify/assert"
)

func IteratorFields(val any) (map[string]any, error) {
	if val == nil {
		return nil, errors.New("val is nil")
	}

	typeOf := reflect.TypeOf(val)
	valueOf := reflect.ValueOf(val)
	res := make(map[string]any)
	for typeOf.Kind() == reflect.Pointer {
		typeOf = typeOf.Elem()
		valueOf = valueOf.Elem()
	}
	switch typeOf.Kind() {
	case reflect.Struct:
	default:
		return nil, errors.New("unsupported type")
	}
	numField := typeOf.NumField()
	for i := 0; i < numField; i++ {
		field := typeOf.Field(i)
		res[field.Name] = valueOf.Field(i).Interface()
	}

	return res, nil
}

func TestIteratorFields(t *testing.T) {
	cases := []struct {
		name   string
		val    any
		expect map[string]any
		e      error
	}{
		{
			name: "user",
			val:  struct{ Name string }{Name: "tom"},
			expect: map[string]any{
				"Name": "tom",
			},
			e: nil,
		},
		{
			name:   "nil",
			val:    nil,
			expect: nil,
			e:      errors.New("val is nil"),
		},
		{
			name: "pointer",
			val:  &struct{ Name string }{Name: "pony"},
			expect: map[string]any{
				"Name": "pony",
			},
			e: nil,
		},
		{
			name:   "unsupported",
			val:    1,
			expect: nil,
			e:      errors.New("unsupported type"),
		},
		{
			name:   "unsupported",
			val:    "",
			expect: nil,
			e:      errors.New("unsupported type"),
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			res, err := IteratorFields(c.val)
			if err != nil {
				assert.Equal(t, c.e, err)
				return
			}

			assert.Equal(t, c.expect, res)
		})

	}
}
```

reflect.FuncInfo

```go
type FuncInfo struct {
	Name   string
	In     []reflect.Type
	Out    []reflect.Type
	Result []any
}

func IteratorFuncInfo(val any) (map[string]*FuncInfo, error) {
	if val == nil {
		return nil, errors.New("val is nil")
	}

	typeOf := reflect.TypeOf(val)
	if typeOf.Kind() != reflect.Struct && typeOf.Kind() != reflect.Ptr {
		return nil, errors.New("unsupported type")
	}

	num := typeOf.NumMethod()
	result := make(map[string]*FuncInfo, num)
	for i := 0; i < num; i++ {
		f := typeOf.Method(i)
		numIn := f.Type.NumIn()

		in := make([]reflect.Type, 0, f.Type.NumIn())
		for j := 0; j < numIn; j++ {
			in = append(in, f.Type.In(j))
		}

		out := make([]reflect.Type, 0, f.Type.NumOut())
		numOut := f.Type.NumOut()
		for j := 0; j < numOut; j++ {
			out = append(out, f.Type.Out(j))
		}

		callVals := f.Func.Call([]reflect.Value{reflect.ValueOf(val)})
		calRes := make([]any, 0, len(callVals))
		for _, value := range callVals {
			calRes = append(calRes, value.Interface())
		}

		result[f.Name] = &FuncInfo{
			Name:   f.Name,
			In:     in,
			Out:    out,
			Result: calRes,
		}
	}

	return result, nil
}

type Order struct {
	buyer  int64
	seller int64
}

func (o Order) GetBuyer() int64 {
	return o.buyer
}

type User struct {
	age int64
}

func (o *User) GetAge() int64 {
	return o.age
}

func TestIteratorFuncInfo(t *testing.T) {
	cases := []struct {
		name   string
		val    any
		expect map[string]*FuncInfo
		e      error
	}{
		{
			name:   "nil",
			val:    nil,
			expect: nil,
			e:      errors.New("val is nil"),
		},
		{
			name: "struct",
			val: Order{
				buyer: 10,
			},
			expect: map[string]*FuncInfo{
				"GetBuyer": {
					Name:   "GetBuyer",
					In:     []reflect.Type{reflect.TypeOf(Order{})},
					Out:    []reflect.Type{reflect.TypeOf(int64(0))},
					Result: []any{int64(10)},
				},
			},
			e: nil,
		},
		{
			name: "struct type but input pointer",
			val: &Order{
				buyer: 10,
			},
			expect: map[string]*FuncInfo{
				"GetBuyer": {
					Name:   "GetBuyer",
					In:     []reflect.Type{reflect.TypeOf(&Order{})},
					Out:    []reflect.Type{reflect.TypeOf(int64(0))},
					Result: []any{int64(10)},
				},
			},
			e: nil,
		},
		{
			name: "pointer",
			val: &User{
				age: 1,
			},
			expect: map[string]*FuncInfo{
				"GetAge": {
					Name:   "GetAge",
					In:     []reflect.Type{reflect.TypeOf(&User{})},
					Out:    []reflect.Type{reflect.TypeOf(int64(0))},
					Result: []any{int64(1)},
				},
			},
			e: nil,
		},
		{
			name: "pointer but input struct",
			val: User{
				age: 1,
			},
			expect: map[string]*FuncInfo{
				"GetAge": {
					Name:   "GetAge",
					In:     []reflect.Type{reflect.TypeOf(User{})},
					Out:    []reflect.Type{reflect.TypeOf(int64(0))},
					Result: []any{int64(1)},
          // expected: map[string]*reflectx.FuncInfo{"GetAge":(*reflectx.FuncInfo)(0xc000094480)}
        	// actual  : map[string]*reflectx.FuncInfo{}
				},
			},
			e: nil,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			res, err := IteratorFuncInfo(c.val)
			if err != nil {
				assert.Equal(t, c.e, err)
				return
			}

			assert.Equal(t, c.expect, res)
		})

	}
}
```

#### unsafe

```go
func Test(t *testing.T)  {

	// 任何类型的指针值都可以转换为Pointer // unsafe.Pointer(&a1)
	// Pointer可以转换为任何类型的指针值 // (*float32)(unsafe.Pointer(numPointer))
	// uintptr可以转换为 Pointer // unsafe.Pointer(uintptr(nPointer) + + unsafe.Sizeof(&a) * 3)
	// Pointer可以转换为 uintptr // uintptr(unsafe.Pointer(numPointer))
	// uintptr 是一个整数类型，它足够大，可以存储. 只有将Pointer转换成uintptr才能进行指针的相关操作

	var a int32 = 10
	tt := unsafe.Sizeof(a)
	fmt.Println(tt)  // 4

	var ab int64 = 10
	fmt.Println(unsafe.Sizeof(ab))  // 8

	var abc int = 10
	fmt.Println(unsafe.Sizeof(abc))  // 8

	var b string = "test"
	fmt.Println(unsafe.Sizeof(b))   // 16 Sizeof(string)占计算string header的大小, struct string { *str uint8; len int;}

	var bc string = "test-test-test-test-test-test-test-test-test-test-test-test-test-test"
	fmt.Println(unsafe.Sizeof(bc))  // 16 Sizeof(string)占计算string header的大小, struct string { *str uint8; len int;}

	type aa struct {
		B bool
		C uint64
	}
	c := aa{}
	fmt.Println(unsafe.Sizeof(c))  // 16 涉及到内存对齐的问题
	// 返回结构体中某个字段的偏移量, 这个字段必须是structValue.field形式. 也就是返回结构体变量的开始位置到那个字段的开始位置之间字节数.
	fmt.Println(unsafe.Offsetof(c.B), unsafe.Offsetof(c.C)) // 0 8

	fmt.Println(unsafe.Sizeof(bool(true)))           // 1

	type bb struct {
		B *bool
	}
	c1 := bb{}
	fmt.Println(unsafe.Sizeof(c1)) // 指针占8个字节(64位机器)

	// 内存对齐
	// 就是为了加快内存的存取速度, 用空间换时间的做法
	fmt.Printf("bool: %d\n", unsafe.Alignof(bool(true)))           // 1
	fmt.Printf("int32: %d\n", unsafe.Alignof(int32(0)))            // 4
	fmt.Printf("int8: %d\n", unsafe.Alignof(int8(0)))              // 1
	fmt.Printf("int64: %d\n", unsafe.Alignof(int64(0)))            // 8
	fmt.Printf("byte: %d\n", unsafe.Alignof(byte(0)))              // 1
	fmt.Printf("string: %d\n", unsafe.Alignof(string("true")))     // 8
	fmt.Printf("map: %d\n", unsafe.Alignof(map[string]string{}))   // 8

	// 对齐规则
	// 1.结构体的成员变量，第一个成员变量的偏移量为 0。往后的每个成员变量的对齐值必须为编译器默认对齐长度（#pragma pack(n)）或当前成员变量类型的长度（unsafe.Sizeof），取最小值作为当前类型的对齐值。其偏移量必须为对齐值的整数倍
	// 2.结构体本身，对齐值必须为编译器默认对齐长度（#pragma pack(n)）或结构体的所有成员变量类型中的最大长度，取最大数的最小整数倍作为对齐值
	// 3.结合以上两点，可得知若编译器默认对齐长度（#pragma pack(n)）超过结构体内成员变量的类型最大长度时，默认对齐长度是没有任何意义的
	type Part1 struct {
		a bool
		b int32
		c int8
		d int64
		e byte
	}
	part := Part1{}
	fmt.Printf("Part1 Size: %d, align: %d\n", unsafe.Sizeof(part), unsafe.Alignof(part))   // 32 8

	type Part2 struct {
		a bool
		e byte
		c int8
		b int32
		d int64
	}
	par2 := Part2{}
	fmt.Printf("Part1 Size: %d, align: %d\n", unsafe.Sizeof(par2), unsafe.Alignof(par2))   // 16 8
}

func TestApply(t *testing.T) {
	// Float64的bits
	var f float64 = 0.1
	fmt.Println(*(*uint64)(unsafe.Pointer(&f)))  // 4591870180066957722

	// 计算偏移量
	type aa struct {
		B bool
		C uint64
	}
	c := aa{}
	fmt.Println(c)  // {false 0}
	aac := (*uint64)(unsafe.Pointer(uintptr(unsafe.Pointer(&c)) + unsafe.Offsetof(c.C)))
	*aac = 10
	fmt.Println(c)  // {false 10}
}
```

#### os/signal

每个平台的信号定义或许有些不同。下面列出了POSIX中定义的信号。 Linux 使用34-64信号用作实时系统中。

##### **在POSIX.1-1990标准中定义的信号列表**

```go
// Signals
const (
	SIGABRT   = Signal(0x6)
	SIGALRM   = Signal(0xe)
	SIGBUS    = Signal(0xa)
	SIGCHLD   = Signal(0x14)
	SIGCONT   = Signal(0x13)
	SIGEMT    = Signal(0x7)
	SIGFPE    = Signal(0x8)
	SIGHUP    = Signal(0x1)
	SIGILL    = Signal(0x4)
	SIGINFO   = Signal(0x1d)
	SIGINT    = Signal(0x2)
	SIGIO     = Signal(0x17)
	SIGIOT    = Signal(0x6)
	SIGKILL   = Signal(0x9)
	SIGPIPE   = Signal(0xd)
	SIGPROF   = Signal(0x1b)
	SIGQUIT   = Signal(0x3)
	SIGSEGV   = Signal(0xb)
	SIGSTOP   = Signal(0x11)
	SIGSYS    = Signal(0xc)
	SIGTERM   = Signal(0xf)
	SIGTRAP   = Signal(0x5)
	SIGTSTP   = Signal(0x12)
	SIGTTIN   = Signal(0x15)
	SIGTTOU   = Signal(0x16)
	SIGURG    = Signal(0x10)
	SIGUSR1   = Signal(0x1e)
	SIGUSR2   = Signal(0x1f)
	SIGVTALRM = Signal(0x1a)
	SIGWINCH  = Signal(0x1c)
	SIGXCPU   = Signal(0x18)
	SIGXFSZ   = Signal(0x19)
)
// Signal table
var signals = [...]string{
	1:  "hangup",                     // 终端控制进程结束(终端连接断开)
	2:  "interrupt",                  // 用户发送INTR字符(Ctrl+C)触发
	3:  "quit",                       // 用户发送QUIT字符(Ctrl+/)触发
	4:  "illegal instruction",        // 非法指令(程序错误、试图执行数据段、栈溢出等)
	5:  "trace/BPT trap",             // Trap指令触发(如断点，在调试器中使用)
	6:  "abort trap",                 // 调用abort函数触发
	7:  "EMT trap",
	8:  "floating point exception",   // 算术运行错误(浮点运算错误、除数为零等)
	9:  "killed",                     // 无条件结束程序(不能被捕获、阻塞或忽略)
	10: "bus error",                  // 非法地址(内存地址对齐错误)
	11: "segmentation fault",         // 无效内存引用(试图访问不属于自己的内存空间、对只读内存空间进行写操作)
	12: "bad system call",
	13: "broken pipe",                // 消息管道损坏(FIFO/Socket通信时，管道未打开而进行写操作)
	14: "alarm clock",                // 时钟定时信号
	15: "terminated",                 // 结束程序(可以被捕获、阻塞或忽略)
	16: "urgent I/O condition",       // 
	17: "suspended (signal)",
	18: "suspended",
	19: "continued",
	20: "child exited",
	21: "stopped (tty input)",
	22: "stopped (tty output)",
	23: "I/O possible",
	24: "cputime limit exceeded",
	25: "filesize limit exceeded",
	26: "virtual timer expired",
	27: "profiling timer expired",
	28: "window size changes",
	29: "information request",
	30: "user defined signal 1",
	31: "user defined signal 2",
}
```

##### **kill pid 与 kill -9 pid的区别**

kill pid的作用是向进程号为pid的进程发送SIGTERM（这是kill默认发送的信号），该信号是一个结束进程的信号且可以被应用程序捕获。若应用程序没有捕获并响应该信号的逻辑代码，则该信号的默认动作是kill掉进程。这是终止指定进程的推荐做法。

`kill -9 pid` 则是向进程号为pid的进程发送 SIGKILL（该信号的编号为9），从本文上面的说明可知，SIGKILL既不能被应用程序捕获，也不能被阻塞或忽略，其动作是立即结束指定进程。通俗地说，应用程序根本无法“感知”SIGKILL信号，它在完全无准备的情况下，就被收到SIGKILL信号的操作系统给干掉了，显然，在这种“暴力”情况下，应用程序完全没有释放当前占用资源的机会。事实上，SIGKILL信号是直接发给init进程的，它收到该信号后，负责终止pid指定的进程。在某些情况下（如进程已经hang死，无法响应正常信号），就可以使用 `kill -9` 来结束进程。

##### **应用程序如何优雅退出?**

Linux Server端的应用程序经常会长时间运行，在运行过程中，可能申请了很多系统资源，也可能保存了很多状态，在这些场景下，我们希望进程在退出前，可以释放资源或将当前状态dump到磁盘上或打印一些重要的日志，也就是希望进程优雅退出（exit gracefully）。

##### Go中的Signal发送和处理

- golang中对信号的处理主要使用os/signal包中的两个方法：
- notify方法用来监听收到的信号
- stop方法用来取消监听

监听全部信号

```go
package main

import (
	"fmt"
	"os"
	"os/signal"
)

// 监听全部信号
func main() {
	c := make(chan os.Signal)
	// 监听所有信号
	signal.Notify(c)
	fmt.Println("启动了程序")
	s := <-c
	fmt.Println("收到信号:", s)
}
```

监听指定信号

```go
package main

import (
	"fmt"
	"os"
	"os/signal"
)
// 监听指定信号
func main() {
	c := make(chan os.Signal)
	// 监听指定信号
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGUSR1, syscall.SIGUSR2)
	fmt.Println("启动了程序")
	s := <-c
	fmt.Println("收到信号:", s)
}
```

优雅退出go守护进程

```go
package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// 优雅退出go守护进程
func main() {
	// 信号通知chan
	onSignal := make(chan os.Signal)
	// 优雅退出
	// 监听指定信号 ctrl+c 结束程序(可以被捕获、阻塞或忽略)
	signal.Notify(onSignal, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT, syscall.SIGUSR1, syscall.SIGUSR2)
	go func() {
		select {
		case sig := <-onSignal:
			switch sig {
			case syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM:
				fmt.Println("退出:", sig)
				ExitFunc()
			case syscall.SIGUSR1:
				fmt.Println("usr1", sig)
			case syscall.SIGUSR2:
				fmt.Println("usr2", sig)
			default:
				fmt.Println("其他信号:", sig)
			}
		}
	}()
	fmt.Println("启动了程序")
	sum := 0
	for {
		sum++
		fmt.Println("休眠了:", sum, "秒")
		time.Sleep(1 * time.Second)
	}
}

func ExitFunc() {
	fmt.Println("开始退出...")
	fmt.Println("执行清理...")
	fmt.Println("结束退出...")
	os.Exit(0)
}
```

