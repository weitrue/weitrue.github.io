---
title: 【Go】学习笔记
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: Golang   # 分类
tags: [Go,ADT]       # 标签
index_img: /images/golang/index.jpg
sticky: false   # 文章排序
math: true    # 启动公式加载渲染
mermaid: true # 启动流程图渲染
author: Pony W
---

>  "Go has indeed become the language of cloud infrastructure" - Rob Pike interview<!-- more -->

### 变量

#### var与:=

- :=方式较为简洁，但只能在函数内使用该方式，var方式没有这个限制，var方式定义在汉书外的变量属于包内部的变量
- 函数中以:=方式定义变量为主

#### 内建变量类型

- bool,string
- (u)int, (u)int8, (u)int16, (u)int32, (u)int, uintptr
- byte, rune
- float32, float64, complex64, complex128
- 变量类型写在变量名之后
- 编译器可推测变量类型
- 没有char, 只有rune
- 原生支持复数类型

```golang
package main

import (
	"fmt"
	"math"
	"math/cmplx"
)

func euler()  {
	// 欧拉公式 e^(i*Pi) + 1 = 0
	fmt.Println(cmplx.Exp(1i * math.Pi) + 1)
  fmt.Println(cmplx.Pow(math.E, 1i * math.Pi) + 1)
}

func main() {
	euler()
}

// 打印内容
(0+1.2246467991473515e-16i)
(0+1.2246467991473515e-16i)
```

#### 强制类型转换

go语言需要开发时强制类型转换，不会自动隐式转换

```go
func triangle()  {
	a, b := 3, 4
	var c int 
	c = math.Sqrt(a*a + b*b)                    // 会在编译前idea便提示报错
  c = int(math.Sqrt(float64(a * a + b * b)))  // 正确写法
	fmt.Println(c)
}
```

常量未声明类型，其类型是不确定的（数值可以作各种类型使用）

```go
func consts()  {
	// 强制类型转换
	const a, b = 3, 4
	var c int
	c = int(math.Sqrt(a * a + b * b))    // a * a + b * b 部分可以不用加上强制类型转换
	fmt.Println(c)
}
```

可以利用常量申明枚举类型

```go
func enums()  {
	const (
		golang = iota
		_
		java
		python
		)
	fmt.Println(golang, java, python)
}

// 输出
0 2 3
```

可以以`iota`为基础，生成一系列枚举数

```go
func enums()  {
	const (
		b = 1 << (10 * iota)
		kb
		mb
		gb
		tb
	)
	fmt.Println(b, kb, mb, gb, tb)
}

// 输出
1 1024 1048576 1073741824 1099511627776
```

https://github.com/weitrue/note/blob/master/go/variable.go

### 指针 

指针不能运算

```go
package main

import "fmt"

func main() {
	var a int = 2
	var pa *int = &a
	*pa = 3
	fmt.Println(a)
}

// 运行结果
3
```

参数传递—只有*值传递*一种方式

```go
func swapV(a, b int) {
	b, a = a, b
	fmt.Println("in ", a, b, &a, &b)
}

func swapRN(a, b *int) {
	// 局部变量交换值（地址）
	b, a = a, b
	fmt.Println("in ", a, b, *a, *b)
}

func swapR(a, b *int) {
	// 交换变量值（地址）指向的值
	*b, *a = *a, *b
	fmt.Println("in ", a, b, *a, *b)
}

func pointerSwap()  {
	a, b := 3, 4
	swapV(a, b)
	fmt.Println("out", a, b, &a, &b)

	a, b = 3, 4
	swapRN(&a, &b)
	fmt.Println("out", a, b, &a, &b)

	a, b = 3, 4
	swapR(&a, &b)
	fmt.Println("out", a, b, &a, &b)

}

// 输出
in  4 3 0xc00001e0c8 0xc00001e0d0
out 3 4 0xc00001e0b8 0xc00001e0c0
in  0xc00001e0c0 0xc00001e0b8 4 3
out 3 4 0xc00001e0b8 0xc00001e0c0
in  0xc00001e0b8 0xc00001e0c0 4 3
out 4 3 0xc00001e0b8 0xc00001e0c0
```

https://github.com/weitrue/note/blob/master/go/pointer.go

### 容器

#### 数组

Go 语言的数组有两种不同的创建方式

- 一种是显式的指定数组大小
  - 变量的类型在编译进行到**类型检查**阶段就会被提取出来，随后使用 [`cmd/compile/internal/types.NewArray`](https://draveness.me/golang/tree/cmd/compile/internal/types.NewArray)创建包含数组大小的 [`cmd/compile/internal/types.Array`](https://draveness.me/golang/tree/cmd/compile/internal/types.Array) 结构体。

- 一种是使用 `[...]T` 声明数组
  - Go 语言编译器会在的 [`cmd/compile/internal/gc.typecheckcomplit`](https://draveness.me/golang/tree/cmd/compile/internal/gc.typecheckcomplit) 函数中对该数组的大小进行推导
  - `[...]T` 这种初始化方式也只是 Go 语言为我们提供的一种语法糖，当我们不想计算数组中的元素个数时可以通过这种方法减少一些工作量

```go
func define()  {
	var arr1 [5]int
	arr2 := [3]int{1, 3, 5}
	arr3 := [...]int{2, 4, 6, 8, 10}

	var grid [4][5]bool
	fmt.Println(arr1, arr2, arr3)
	fmt.Println(grid)
}

// 输出
[0 0 0 0 0] [1 3 5] [2 4 6 8 10]
[[false false false false false] [false false false false false] [false false false false false] [false false false false false]]

```

[5]int和[10]int是不同类型

调用func f(arr [10]int)会*拷贝*数组

```go
func printArr(arr [5]int)  {
	arr[0] = 100
	for i, v := range arr {
		fmt.Println(i, v)
	}
}

func arrTest()  {
	var arr1 [5]int
	arr2 := [...]int{2, 4, 6, 8, 10}
	fmt.Println()
	printArr(arr2)
	fmt.Println()
	for i, v := range arr1 {
		fmt.Println(i, v)
	}
}

// 输出
0 100
1 0
2 0
3 0
4 0

0 100
1 4
2 6
3 8
4 10

0 0
1 0
2 0
3 0
4 0
```

若要改变数组的值 需要传入数组的地址，因此go语言一般不使用数组

```go
func printArrR(arr *[5]int)  {
	arr[0] = 100
	for i, v := range arr {
		fmt.Println(i, v)
	}
}

func arrTest()  {
	var arr1 [5]int
	printArrR(&arr1)
	fmt.Println()
	fmt.Println(arr1)
}
// 输出
0 100
1 0
2 0
3 0
4 0

[100 0 0 0 0]
```

https://github.com/weitrue/note/blob/master/go/collections/array.go

#### 切片

- slice可以向后扩展，但不能向前扩展

- s[i]不可超越len(s)，向后扩展不可以超越底层数组cap(s)

```go
func slice() {
	arr := [...]int{1, 2, 3, 4, 5, 6, 7}
	s1 := arr[2: 6]
	fmt.Println(s1)
	s2 := s1[3: 5]
	fmt.Println(s2)
  s3 := s1[3:6]
	fmt.Println(s3)
}
//输出
[3 4 5 6]
[6 7]
panic: runtime error: slice bounds out of range [:6] with capacity 5

goroutine 1 [running]:
main.sliceDefine()
        ~/Projects/golang/src/offer/note/slices.go:20 +0x164
main.main()
        ~/Projects/golang/src/offer/note/ab_test_func.go:28 +0x20

```

![](/images/golang/slice.png)

- 向slice添加元素，如果超越cap，系统会自动分配更大的底层数组

- 由于值传递的原因，必须接收append的返回值`s=append(s, val)`

```go
func sliceAppend() {
	arr := [...]int{1, 2, 3, 4, 5, 6, 7, 8}
	s1 := arr[2: 6]
	fmt.Println(s1, cap(s1), len(s1))
	s2 := s1[3: 5]
	fmt.Println(s2)
	s3 := append(s2, 10)
	s4 := append(s3, 11)
	s5 := append(s4, 12)
	fmt.Println("s3, s4, s5=", s3, s4, s5)
	fmt.Println(arr)
  
  s6 := append(s1, 10)
	s7 := append(s6, 11)
	s8 := append(s7, 12)
	fmt.Println("s6, s7, s8=", s6, s7, s8)
	fmt.Println("cap(s6), cap(s7), cap(s8) =", cap(s6), cap(s7), cap(s8))
	fmt.Println(arr)
}
// 输出
[3 4 5 6] 6 4
[6 7]
s3, s4, s5= [6 7 10] [6 7 10 11] [6 7 10 11 12]
cap(s3), cap(s4), cap(s5) = 3 6 6
[1 2 3 4 5 6 7 10]

s6, s7, s8= [3 4 5 6 10] [3 4 5 6 10 11] [3 4 5 6 10 11 12]
cap(s6), cap(s7), cap(s8) = 6 6 12
[1 2 3 4 5 6 10 11]

```

- Zero value for slice is nil

```go
func sliceDefine() {
	var s []int
	for i :=0; i <10; i++ {
		fmt.Printf("%v, cap(s) = %d, len(s) = %d\n", s, cap(s), len(s))
		s = append(s, 2*i + 1)
	}

	s1 := []int{2, 3, 4}
	fmt.Printf("%v, cap(s1) = %d, len(s1) = %d\n", s1, cap(s1), len(s1))

	s2 := make([]int, 8)
	fmt.Printf("%v, cap(s2) = %d, len(s2) = %d\n", s2, cap(s2), len(s2))

	s3 := make([]int, 8, 32)
	fmt.Printf("%v, cap(s3) = %d, len(s3) = %d\n", s3, cap(s3), len(s3))

	// 拷贝
	copy(s2, s1)
	fmt.Printf("%v, cap(s2) = %d, len(s2) = %d\n", s2, cap(s2), len(s2))

	// 删除 没有内建函数，只能通过截取+append
	s4 := append(s2[:2], s2[3:]...)
	fmt.Printf("%v, cap(s4) = %d, len(s4) = %d\n", s4, cap(s4), len(s4))
}

//输出
[], cap(s) = 0, len(s) = 0
[1], cap(s) = 1, len(s) = 1
[1 3], cap(s) = 2, len(s) = 2
[1 3 5], cap(s) = 4, len(s) = 3
[1 3 5 7], cap(s) = 4, len(s) = 4
[1 3 5 7 9], cap(s) = 8, len(s) = 5
[1 3 5 7 9 11], cap(s) = 8, len(s) = 6
[1 3 5 7 9 11 13], cap(s) = 8, len(s) = 7
[1 3 5 7 9 11 13 15], cap(s) = 8, len(s) = 8
[1 3 5 7 9 11 13 15 17], cap(s) = 16, len(s) = 9
[2 3 4], cap(s1) = 3, len(s1) = 3
[0 0 0 0 0 0 0 0], cap(s2) = 8, len(s2) = 8
[0 0 0 0 0 0 0 0], cap(s3) = 32, len(s3) = 8
[2 3 4 0 0 0 0 0], cap(s2) = 8, len(s2) = 8
[2 3 0 0 0 0 0], cap(s4) = 8, len(s4) = 7
```

https://github.com/weitrue/note/blob/master/go/collections/slices.go

#### Map

- 创建`make(map[type]type)`

- key不存在时，获取value类型的初始值，需要`if value, ok := m[key]; ok {...}` 判断是否存在key

- map使用哈希表，必须可以比较相等

- 除了slice, map,function的内建类型都可以作为map的key,Struct类型不包含上述字段时，也可作为key

```go
func mapDefine()  {
	m := map[int]string{
		1: "aa",
		2: "bb",
	}
	if v, ok := m[3]; ok {
		fmt.Println(v)
	} else {
		panic("key not exists")
	}
}

//输出
panic: key not exists

goroutine 1 [running]:
main.mapDefine()
        /Users/wangpeng/Projects/golang/src/offer/note/maps.go:20 +0x1f6
main.main()
        /Users/wangpeng/Projects/golang/src/offer/note/ab_test_func.go:32 +0x20
```

https://github.com/weitrue/note/blob/master/go/collections/maps.go

#### Rune

字符串在UTF-8编码中，一个中文占三个字节，

```go
func strByte(s string)  {
	if s == "" {
		s = "yes,我喜欢你！"
	}
	for i, ch := range []byte(s) {
		fmt.Printf("(%d, %X)", i, ch)
	}
	fmt.Println()
  for i, ch := range s { // ch is a rune 其实是将s进行utf-8解码，解码后的字符会转成unicode,然后放入rune中
		fmt.Printf("(%d, %X)", i, ch)
	}
	fmt.Println()
  bytes := []byte(s)
	for len(bytes) >0 {
		ch, size := utf8.DecodeRune(bytes)
		bytes = bytes[size:]
		fmt.Printf("%c ", ch)
	}
	fmt.Println()
	for i, ch := range []rune(s) {
		fmt.Printf("(%d, %X)", i, ch)
	}
}

// 输出
(0, 79)(1, 65)(2, 73)(3, 2C)(4, E6)(5, 88)(6, 91)(7, E5)(8, 96)(9, 9C)(10, E6)(11, AC)(12, A2)(13, E4)(14, BD)(15, A0)(16, EF)(17, BC)(18, 81)
(0, 79)(1, 65)(2, 73)(3, 2C)(4, 6211)(7, 559C)(10, 6B22)(13, 4F60)(16, FF01)
y e s , 我 喜 欢 你 ！
(0, 79)(1, 65)(2, 73)(3, 2C)(4, 6211)(5, 559C)(6, 6B22)(7, 4F60)(8, FF01)

```

因此在需要使用rune

```go
/**
 * Version: 1.0.0
 * Description: 获取字符串中不重复字串最大长度
 **/
func maxNoRepeated(s string) int {
  // 仅支持英文字符
	// 字符下标映射
  chNotRepeatIndex := make(map[byte] int)
	// 最长串起始位置
  start := 0
  // 最长串长度
	maxLength := 0
	 for i, ch := range []byte(s) {
	 	if lastI, ok := chNotRepeatIndex[ch]; ok && lastI >= start {
	 		start = lastI + 1
		}
		if i - start + 1 > maxLength {
			maxLength = i - start + 1
		}
		chNotRepeatIndex[ch] = i
	 }
	 return maxLength
}

func maxNoRepeatedChn(s string) int {
  // 通过rune
	chNotRepeatIndex := make(map[rune] int)
	start := 0
	maxLength := 0
	for i, ch := range []rune(s) {
		if lastI, ok := chNotRepeatIndex[ch]; ok && lastI >= start {
			start = lastI + 1
		}
		if i - start + 1 > maxLength {
			maxLength = i - start + 1
		}
		chNotRepeatIndex[ch] = i
	}
	return maxLength
}
```

https://github.com/weitrue/note/blob/master/go/collections/strings.go

### 面向对象

仅*支持封装*，不支持继承和多态

```go
import "fmt"

type Node struct {
	Value       int
	Left, Right *Node
}

func (node Node) Print() {
	fmt.Print(node.Value, " ")
}

func (node *Node) SetValue(value int) {
  // 接收者使用指针才可以改变结构内容
	if node == nil {
		fmt.Println("Setting Value to nil node. Ignored.")
		return
	}
	node.Value = value
}

func (node Node) SetValueNotUpdate(value int) {
  // 值传递 node内容无法改变
	if &node == nil {
		fmt.Println("Setting Value to nil node. Ignored.")
		return
	}
	node.Value = value
}

func CreateNode(value int) *Node {
  // 返回局部变量地址，这样变量会在堆中声明，可以传到外部
	return &Node{Value: value}
}
```

方法有接收者（值/指针接收者），需要改变内容必须使用指针接收者，结构体过大考虑用指针接收者

```go
func main() {
  node := Node{}
	node.Print()
	node.SetValueNotUpdate(10)
	node.Print()
	node.SetValue(10)
	node.Print()
}

// 输出
0 0 10 
```

nil也可以调用方法

```go
func main() {
  var pNode *Node
	pNode.SetValue(30)
}

// 输出
Setting Value to nil node. Ignored.
```

```go
func main() {
  var pNode *Node
	pNode.SetValueNotUpdate(20)
}

// 输出
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x0 pc=0x109d0af]

goroutine 1 [running]:
main.main()
        ～/Projects/golang/src/offer/note/ab_test_func.go:50 +0x1f

```

https://github.com/weitrue/note/blob/master/go/object/tree.go

#### 封装与包

首字母大写:public，首字母小写:private

为结构体定义的方法需要放在一个包下（可以是不同的文件）

扩充系统类型或者自定义类型方式：定义别名和使用组合

```go
type Queue []int

func (q *Queue)Push(val int) error {
	*q = append(*q, val)
	return nil
}

func (q *Queue)Pop() (int,bool) {
	if q.IsEmpty() {
		return 0, false
	}
	head := (*q)[0]
	*q = (*q)[1:]
	return head, true
}

func (q *Queue)IsEmpty() bool {
	return len(*q) == 0
}
```

```go
type Node struct {
	Value       int
	Left, Right *Node
}

type MyNode struct {
	node *Node
}
```

https://github.com/weitrue/note/blob/master/go/object/queue.go

### 接口

#### 鸭子类型 

##### Duck Typing

接口由使用者定义

​	Python的在运行时才能知道被调用的对象是否实现某个方法

​	Java中编译前，调用的对象就必须实现接口所有方法

接口变量自带指针（参数传递也是值传递），因此几乎不需要使用接口指针	

![](/images/golang/interface.png)

```go
// offer/note/interfaces/mock/duck.go
package mock

type Duck struct {
	Name string
}

func (d *Duck) GetName() string {
  // 实现者没有指明实现了哪个接口
	if d.Name != "" {
		return d.Name
	} else {
		return "这是一个鸭子！"
	}
}

// offer/note/interfaces/duckI.go
package interfaces

import "fmt"

type DuckI interface {
  // 使用接口者 定义方法
	GetName() string
}

func FindDuck(d DuckI)  { // 接口变量自带指针
	name := d.GetName()
	fmt.Println(name)
}

// offer/note/main.go
package main

import (
	"offer/note/interfaces"
	"offer/note/interfaces/mock"
)

func main() {
  interfaces.FindDuck(&mock.Duck{})
  interfaces.FindDuck(&mock.Duck{Name:"这是一只假鸭子"})
}


// 输出
这是一个鸭子！
这是一只假鸭子
```

##### 多态

```go
type MemberRights interface {
 Information () string
}

type BronzeMember struct {
 Discount uint8
}

type SilverMember struct {
 Discount uint8
}

type GoldMember struct {
 Discount uint8
}

func (b *BronzeMember) Information () string {
 return fmt.Sprintf("Discount:%d", b.Discount)
}

func (s *SilverMember) Information () string {
 return fmt.Sprintf("Discount:%d", s.Discount)
}

func (g *GoldMember) Information () string {
 return fmt.Sprintf("Discount:%d", g.Discount)
}

func Price (m MemberRights) {
 fmt.Println(m.Information())
}

func main () {
 b := &BronzeMember{Discount: 9}
 Price(b)
 s := &SilverMember{8}
 Price(s)
 g := new(GoldMember)
 g.Discount = 7
 Price(g)
}
```

#### 任何类型

`interface{}`

```go
type Queue []interface{}

func (q *Queue)Push(val interface{}) error {
	*q = append(*q, val)
	return nil
}

func (q *Queue)Pop() (interface{},bool) {
	if q.IsEmpty() {
		return 0, false
	}
	head := (*q)[0]
	*q = (*q)[1:]
	return head, true
}

func (q *Queue)IsEmpty() bool {
	return len(*q) == 0
}

func main(){
  q := interfaces.Queue{}
	_ = q.Push("asd")
	_ = q.Push(123)
	if v, ok := q.Pop(); ok {
		fmt.Println(v)
	}
	if v, ok := q.Pop(); ok {
		fmt.Println(v)
	}
}

// 输出
asd
123
```

#### 组合 

```go
// offer/note/interfaces/animals.go
package animal

import "fmt"

type AnimalsI interface {
	DuckI
	BehaviorI
}

func DuckBehavior(a AnimalsI)  {
	name := a.GetName()
	dark := a.Shout("呱呱乱叫")
	fmt.Println(name, dark)
  fmt.Println(a.String())
}


// offer/note/interfaces/behaviorI.go
package animal

type BehaviorI interface {
	Shout(dark string) string
}


// offer/note/interfaces/duckI.go
package animal

type DuckI interface {
	GetName() string
}


// offer/note/interfaces/mock/duck.go
package mock

type Duck struct {
	name string
	bark string
}

func (d *Duck) GetName() string {
	if d.name != "" {
		return d.name
	} else {
		return "这是一个鸭子"
	}
}

func (d *Duck) Shout(dark string) string {
	if d.bark == ""{
		return "呱呱呱呱的叫"
	}else {
		return dark
	}
}

func (d *Duck) String() string {
	return fmt.Sprintf("Duck: { name = %s, bark = %s }", d.name, d.bark)
}

// 输出
这是一个鸭子 呱呱呱呱的叫
Duck: { name = , bark =  }
```

https://github.com/weitrue/note/tree/master/go/interfaces

#### 常用接口

- `Stringer`相当于toString()

```go
type Stringer interface {
	String() string
}
```

- `Reader`
- `Writer`

```go
// io/io.go

// Reader is the interface that wraps the basic Read method.
//
// Read reads up to len(p) bytes into p. It returns the number of bytes
// read (0 <= n <= len(p)) and any error encountered. Even if Read
// returns n < len(p), it may use all of p as scratch space during the call.
// If some data is available but not len(p) bytes, Read conventionally
// returns what is available instead of waiting for more.
//
// When Read encounters an error or end-of-file condition after
// successfully reading n > 0 bytes, it returns the number of
// bytes read. It may return the (non-nil) error from the same call
// or return the error (and n == 0) from a subsequent call.
// An instance of this general case is that a Reader returning
// a non-zero number of bytes at the end of the input stream may
// return either err == EOF or err == nil. The next Read should
// return 0, EOF.
//
// Callers should always process the n > 0 bytes returned before
// considering the error err. Doing so correctly handles I/O errors
// that happen after reading some bytes and also both of the
// allowed EOF behaviors.
//
// Implementations of Read are discouraged from returning a
// zero byte count with a nil error, except when len(p) == 0.
// Callers should treat a return of 0 and nil as indicating that
// nothing happened; in particular it does not indicate EOF.
//
// Implementations must not retain p.
type Reader interface {
	Read(p []byte) (n int, err error)
}

// Writer is the interface that wraps the basic Write method.
//
// Write writes len(p) bytes from p to the underlying data stream.
// It returns the number of bytes written from p (0 <= n <= len(p))
// and any error encountered that caused the write to stop early.
// Write must return a non-nil error if it returns n < len(p).
// Write must not modify the slice data, even temporarily.
//
// Implementations must not retain p.
type Writer interface {
	Write(p []byte) (n int, err error)
}

// ReadWriter is the interface that groups the basic Read and Write methods.
type ReadWriter interface {
	Reader
	Writer
}
```

### 函数

- 函数可以有多个返回值，并且这些返回值可以起别名（别名多用于简单函数），别名与调用者的申明变量并无关联

```go
package main

import "fmt"

func eval(a, b int, op string) (int, error) {
	switch op {
	case "+":
		return  a + b, nil
	case "-":
		return a - b, nil
	case "*":
		return a * b, nil
	case "/":
		r, _ := div(a, b)
		return r, nil
	default:
		return 0, fmt.Errorf("unsupported operation")
	}
}

func div(a, b int) (q, r int) {
	return a/b, a%b
}
```

- *一等公民* :变量、参数、返回值均可以是函数

```go
package main

import (
	"fmt"
	"math"
	"reflect"
	"runtime"
)
func apply(op func(int, int) float64, a, b int) float64 {
	//
	p := reflect.ValueOf(op).Pointer()
	opName := runtime.FuncForPC(p).Name()
	fmt.Printf("Calling function %s with params (%d, %d)\n", opName, a, b)
	return op(int(a), int(b))
}

func pow(a, b int) float64 {
	return math.Pow(float64(a), float64(b))
}

func main() {
	fmt.Println(apply(pow, 3, 4))

	// 匿名函数方式
	fmt.Println(apply(func(f, f2 int) float64 {
		return math.Pow(float64(f), float64(f2))
	}, 3, 4))
}

// 打印结果
Calling function main.pow with params (3, 4)
81
Calling function main.main.func1 with params (3, 4)
81
```

- 可变参数列表，类似于Python中的*args

```go
func sum(nums ...int) int {
	// 函数可变参数列表
	sum := 0
	for i := range nums {
		sum += nums[i]
	}
	return sum
}
```

https://github.com/weitrue/note/blob/master/go/functions/func.go

#### 闭包

![](/images/golang/func.png)

其中，`func(i int)`中`i`为局部变量，`sum`为自由变量

```go
func adder() func(int) int {
	sum := 0
	return func(i int) int {
		sum += i
		return sum
	}
}

func TestAdder()  {
	a := adder()
	for i := 0; i < 10 ; i++ {
		fmt.Printf("0 + ... + %d = %d \n", i, a(i))
	}
}

// 输出
0 + ... + 0 = 0 
0 + ... + 1 = 1 
0 + ... + 2 = 3 
0 + ... + 3 = 6 
0 + ... + 4 = 10 
0 + ... + 5 = 15 
0 + ... + 6 = 21 
0 + ... + 7 = 28 
0 + ... + 8 = 36 
0 + ... + 9 = 45 


// 正统函数式编程
type iAdder func(int) (int, iAdder)

func iAdd(base int) iAdder {
	return func(v int) (int, iAdder) {
		return base +v, iAdd(base+v)
	}
}

func TestAdder() {
	a2 := iAdd(0)
	var s int
	for i := 1; i <10; i++ {
		s, a2 = a2(i)
		fmt.Printf("0 + ... + %d = %d \n", i, s)
	}
}

// 输出
0 + ... + 1 = 1 
0 + ... + 2 = 3 
0 + ... + 3 = 6 
0 + ... + 4 = 10 
0 + ... + 5 = 15 
0 + ... + 6 = 21 
0 + ... + 7 = 28 
0 + ... + 8 = 36 
0 + ... + 9 = 45 
```

https://github.com/weitrue/note/blob/master/go/functions/closure.go

##### Python中的闭包

Python原生支持闭包

`__closure__`可以查看闭包内容

```Python
def adder():
    s = 0

    def f(v: int):
        nonlocal s
        s += v
        return s

    return f


if __name__ == "__main__":

    a = adder()
    for i in range(10):
        print(i, a(i), a.__closure__)
        
# 输出
0 0 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6290>,)
1 1 (<cell at 0x7f9048e7d3d0: int object at 0x106eb62b0>,)
2 3 (<cell at 0x7f9048e7d3d0: int object at 0x106eb62f0>,)
3 6 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6350>,)
4 10 (<cell at 0x7f9048e7d3d0: int object at 0x106eb63d0>,)
5 15 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6470>,)
6 21 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6530>,)
7 28 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6610>,)
8 36 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6710>,)
9 45 (<cell at 0x7f9048e7d3d0: int object at 0x106eb6830>,)
```

##### Java中的闭包

1.8以后，可以使用Function接口和Lambda表达式可以创建函数对象；

1.8之前，可以使用Lambda表达式或者匿名内部类也可以实现闭包；

```Java
import javax.xml.ws.Holder;
import java.util.function.Function;

public class MyTest {

    final Holder<Integer> sum = new Holder<>(0);

    public  Function<Integer, Integer>testClosure(){
        // 闭包  使用Function接口和Lambda表达式可以创建函数对象
        return (Integer value) -> {
            sum.value += value;
            return sum.value;
        };
    }

    public static void main(String[] args) {
        MyTest mt = new MyTest();
        for (int i=0; i < 10; i++) {
            System.out.println(i +", "+ mt.testClosure().apply(new Integer(i)));
        }
    }
}
```

#### 闭包应用

###### 为函数实现接口



###### 实现函数遍历二叉树



###### 单例模式,限制流量模式

### 文档

`godoc -http :6060`,生成网页文档

![](/images/golang/doc.jpg)

![](/images/golang/doc1.jpg)

`go doc 方法名（包括包名）`,查看方法注释

![](/images/golang/doc2.jpg)

`xxx_test.go`生成示例

```go
func ExampleQueue_Pop() {
	q := Queue{}
	_ = q.Push("asd")
	_ = q.Push(123)
	if v, ok := q.Pop(); ok {
		fmt.Println(v)
	}
	if v, ok := q.Pop(); ok {
		fmt.Println(v)
	}

	//Output:
	//asd
	//123
}
```

![](/images/golang/doc_output.jpg)

### 测试

*表格驱动*测试

```go
func TestMaxNoRepeatedZhn(t *testing.T) {
	tests := []struct{
		s string
		ans int
	}{
		{"a", 1},
		{"yes, 我爱gogogo", 9},
		{"abcadcb", 4},
		{"黑化肥挥发发灰会花飞灰化肥挥发发黑会飞花", 8},
	}

	for _, tt := range tests {
		act := MaxNoRepeatedZhn(tt.s)
		if act != tt.ans {
			t.Errorf("get %d for input %s , but expect %d", act, tt.s, tt.ans)
		}
	}
}

// 输出
=== RUN   TestMaxNoRepeatedZhn
--- PASS: TestMaxNoRepeatedZhn (0.00s)
PASS
```

#### 覆盖测试

`go tool cover`

```shell
Usage of 'go tool cover':
Given a coverage profile produced by 'go test':
        go test -coverprofile=c.out

Open a web browser displaying annotated source code:
        go tool cover -html=c.out    # 常用

Write out an HTML file instead of launching a web browser:
        go tool cover -html=c.out -o coverage.html

Display coverage percentages to stdout for each function:
        go tool cover -func=c.out

Finally, to generate modified source code with coverage annotations
(what go test -cover does):
        go tool cover -mode=set -var=CoverageVariableName program.go

Flags:
  -V    print version and exit
  -func string
        output coverage profile information for each function
  -html string
        generate HTML representation of coverage profile
  -mode string
        coverage mode: set, count, atomic
  -o string
        file for output; default: stdout
  -var string
        name of coverage variable to generate (default "GoCover")

  Only one of -html, -func, or -mode may be set.
```

#### `Benchmark`

```go
func BenchmarkMaxNoRepeatedZhn(b *testing.B) {
	s := "黑化肥挥发发灰会花飞灰化肥挥发发黑会飞花"
	ans := 8

	for i := 0; i < b.N; i++ {
		act := MaxNoRepeatedZhn(s)
		if act != ans {
			b.Errorf("get %d for input %s , but expect %d", act, s, ans)
		}
	}
}


// 输出
goos: darwin
goarch: amd64
pkg: offer/note/collections
BenchmarkMaxNoRepeatedZhn
BenchmarkMaxNoRepeatedZhn-8   	 1097594	      1024 ns/op
PASS
```

https://github.com/weitrue/note/collections/strings_test.go

#### pprof性能测试

```shell
xxx@xxxdeMacBook-Pro  ~/Projects/golang/src/offer/note/collections master ±✚ go test -bench . -cpuprofile cpu.out
goos: darwin
goarch: amd64
pkg: offer/note/collections
BenchmarkMaxNoRepeatedZhn-8      1286594               934 ns/op
PASS
ok      offer/note/collections  2.656s
xxx@xxxdeMacBook-Pro  ~/Projects/golang/src/offer/note/collections master ±✚ go tool pprof cpu.out               
Type: cpu
Time: Mar 2, 2021 at 6:03pm (CST)
Duration: 2.34s, Total samples = 2.05s (87.57%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) web
failed to execute dot. Is Graphviz installed? Error: exec: "dot": executable file not found in $PATH
(pprof) 
```

☞`failed to execute dot. Is Graphviz installed? Error: exec: "dot": executable file not found in $PATH`是因为电脑未安装生成.svg文件的工具`Graphviz`

##### 安装`Graphviz`

```shell
brew install graphviz
xxx@xxxdeMacBook-Pro  ~/Projects/golang/src/github.com  brew install graphviz
Error:
  homebrew-core is a shallow clone.
  homebrew-cask is a shallow clone.
To `brew update`, first run:
  git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core fetch --unshallow
  git -C /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask fetch --unshallow
These commands may take a few minutes to run due to the large size of the repositories.
This restriction has been made on GitHub's request because updating shallow
clones is an extremely expensive operation due to the tree layout and traffic of
Homebrew/homebrew-core and Homebrew/homebrew-cask. We don't do this for you
automatically to avoid repeatedly performing an expensive unshallow operation in
CI systems (which should instead be fixed to not use shallow clones). Sorry for
the inconvenience!
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libpng-1.6.37.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/freetype-2.10.4.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/fontconfig-2.13.1.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/jpeg-9d.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libtiff-4.1.0_1.big_sur.bottle.tar.gz
#########################################                                 58.1%
curl: (56) LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Failed to download resource "libtiff"
Download failed: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libtiff-4.1.0_1.big_sur.bottle.tar.gz
Warning: Bottle installation failed: building from source.
==> Downloading https://download.osgeo.org/libtiff/tiff-4.1.0.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/webp-1.1.0.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gd-2.3.0.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libffi-3.3.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pcre-8.44.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/glib-2.66.2_1.big_sur.bottle.tar.gz
##########                                                                14.5%
curl: (56) LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Failed to download resource "glib"
Download failed: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/glib-2.66.2_1.big_sur.bottle.tar.gz
Warning: Bottle installation failed: building from source.
==> Downloading https://raw.githubusercontent.com/Homebrew/formula-patches/6164294a75541c278f3863b111791376caa3ad26/glib/hardcoded-paths.diff
######################################################################## 100.0%
==> Downloading https://download.gnome.org/sources/glib/2.66/glib-2.66.2.tar.xz
==> Downloading from https://mirrors.ustc.edu.cn/gnome/sources/glib/2.66/glib-2.66.2.tar.xz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/jasper-2.0.22.big_sur.bottle.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/ad3715537b3001b9a8924896e5c4e7eb90b21bb37e7171d964de2008edb13910?response-content-disposition=attachment%3Bfilename%3D%22jasper-2.0.22.big_sur.bo
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/netpbm-10.86.17.big_sur.bottle.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/3540b31b88e9d8fc7288de5dac7b96be6f1c6652c604cfd167113bdf07738ca7?response-content-disposition=attachment%3Bfilename%3D%22netpbm-10.86.17.big_sur.
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gts-0.7.6_2.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/lzo-2.10.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pixman-0.40.0.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/cairo-1.16.0_3.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gdk-pixbuf-2.42.0.big_sur.bottle.tar.gz
==> Downloading from https://d29vzk4ow07wi7.cloudfront.net/1819bb48f7487d522a69c564dca6fe5dff4da658269f067e47edccddfaab9440?response-content-disposition=attachment%3Bfilename%3D%22gdk-pixbuf-2.42.0.big_su
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/fribidi-1.0.10.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pkg-config-0.29.2_3.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gobject-introspection-1.66.1_1.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/graphite2-1.3.14.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/icu4c-67.1.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/harfbuzz-2.7.2.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pango-1.48.0.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/librsvg-2.50.2.big_sur.bottle.tar.gz
#####################                                                     29.6%
curl: (18) transfer closed with 28187304 bytes remaining to read
Error: Failed to download resource "librsvg"
Download failed: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/librsvg-2.50.2.big_sur.bottle.tar.gz
Warning: Bottle installation failed: building from source.
==> Downloading https://download.gnome.org/sources/librsvg/2.50/librsvg-2.50.2.tar.xz
==> Downloading from https://mirrors.ustc.edu.cn/gnome/sources/librsvg/2.50/librsvg-2.50.2.tar.xz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libtool-2.4.6_2.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/graphviz-2.44.1.big_sur.bottle.1.tar.gz
######################################                                    52.9%
curl: (18) transfer closed with 6363689 bytes remaining to read
Error: Failed to download resource "graphviz"
Download failed: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/graphviz-2.44.1.big_sur.bottle.1.tar.gz
Warning: Bottle installation failed: building from source.
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/autoconf-2.69.big_sur.bottle.4.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/automake-1.16.3.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pkg-config-0.29.2_3.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/c393e3a39326eab27929f0f2ce40cb425e78bd8812166e6d835a08a8bf0c5f56--pkg-config-0.29.2_3.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libpng-1.6.37.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/3bd2e2a75fbfc893d9acc20eeafc5274e260ed2ca39483ccbb1450a734bc6775--libpng-1.6.37.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/freetype-2.10.4.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/1399fc577f7998623378e7bb01f8a716a43eff701304059936d592a76d5a4d31--freetype-2.10.4.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/fontconfig-2.13.1.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/3790f4e94c8e7c868307933e3445a1244aadd794adaa6ed5f743533334489f93--fontconfig-2.13.1.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/jpeg-9d.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/7ed5b41c2937740eca747a8077502454971fbbe02cfb5cfbd9b9e7379345d0cd--jpeg-9d.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libtiff-4.1.0_1.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/webp-1.1.0.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/1ae441623b4c63d896b5566300b24c06d772ff9f2676d7c9bd692ff6b8e22edb--webp-1.1.0.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gd-2.3.0.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/d71eed744db212a24cc7f607842253aacf0e1d25cd7891c884ec7ffc969162ac--gd-2.3.0.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libffi-3.3.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/49892306006d42a1f69ae4b36ff44b37c8e7170f6cf73a20e97f10bf9fa10e72--libffi-3.3.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pcre-8.44.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/9998b74590fa558f4c346e9770a62495d4aca8e992d0e883435e3574303ee241--pcre-8.44.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/glib-2.66.2_1.big_sur.bottle.tar.gz
######################################################################## 100.0%
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/jasper-2.0.22.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/86ba13e63264cbcafb0dbec9e35960e2662f9e4bde0306bd52984bf487e6581a--jasper-2.0.22.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/netpbm-10.86.17.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/9f8fa63491038e9bb811b03f09660342641c7f8132169bdb3800631d8d2b189e--netpbm-10.86.17.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gts-0.7.6_2.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/eab94b3870ce0c63232e9a992963c8a32ea53a7efa8a09e639066b40ae0a132b--gts-0.7.6_2.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/lzo-2.10.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/0020e09d8a2c473efa8db2af4b402358f5184578c801c7a7650de6c8bedca06a--lzo-2.10.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pixman-0.40.0.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/ddf94c89d763f2c63c00ce2090ff16d5abd832ca0e1e9beb2245da3cc159ce41--pixman-0.40.0.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/cairo-1.16.0_3.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/8ad096f68fcc70615ff77f14b50eafbed94e4a261c7860dcda41ba25c7d12f52--cairo-1.16.0_3.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gdk-pixbuf-2.42.0.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/fb191d15b537de812241fe664f4149209c4d58ce3fbdd5e98a292fe495420f39--gdk-pixbuf-2.42.0.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/fribidi-1.0.10.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/9013c8a0aeb1d2fee9a999ef14adfb2416fef4e8399d87a65d753d44a586427b--fribidi-1.0.10.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/gobject-introspection-1.66.1_1.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/a7f9a1bcb83a7d322e495d163f15b4b8f4d0c05649eeacfcef2681a23b3eb8dd--gobject-introspection-1.66.1_1.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/graphite2-1.3.14.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/5ce053636ab73845d956142cfd518a21701d3ec972e73367d204b81619b8b845--graphite2-1.3.14.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/icu4c-67.1.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/ddca8d436054c0f9c8c333d2e8dd957ccd3902680baf619e4baed434c9806998--icu4c-67.1.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/harfbuzz-2.7.2.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/1aead0f1ab97b4307a9c487a3191213ff63fd200d5eb9be947a11e8ca78df24a--harfbuzz-2.7.2.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/pango-1.48.0.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/eded163bf136aa7a73e07f22c8b16f3a406bbd849b865246a95ee89ecd60aa4e--pango-1.48.0.big_sur.bottle.tar.gz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/librsvg-2.50.2.big_sur.bottle.tar.gz
###################################################                       71.3%
curl: (18) transfer closed with 11492026 bytes remaining to read
Error: Failed to download resource "librsvg"
Download failed: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/librsvg-2.50.2.big_sur.bottle.tar.gz
Warning: Bottle installation failed: building from source.
==> Downloading https://download.gnome.org/sources/librsvg/2.50/librsvg-2.50.2.tar.xz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/0388827e738392e3705cbb8800e43f279723caf5126ba50c7cd4e1ca5e2af872--librsvg-2.50.2.tar.xz
==> Downloading https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/bottles/libtool-2.4.6_2.big_sur.bottle.tar.gz
Already downloaded: /Users/wangpeng/Library/Caches/Homebrew/downloads/59a8e4e9bff6153b4cb25fda4de99648330e04fefdd7e9c98f92fa4d049a9f30--libtool-2.4.6_2.big_sur.bottle.tar.gz
==> Downloading https://www2.graphviz.org/Packages/stable/portable_source/graphviz-2.44.1.tar.gz
####################                                                      28.5%
######################################################################## 100.0%
==> Installing dependencies for graphviz: autoconf, automake, pkg-config, libpng, freetype, fontconfig, jpeg, libtiff, webp, gd, libffi, pcre, glib, jasper, netpbm, gts, lzo, pixman, cairo, gdk-pixbuf, fribidi, gobject-introspection, graphite2, icu4c, harfbuzz, pango, librsvg and libtool
==> Installing graphviz dependency: autoconf
==> Pouring autoconf-2.69.big_sur.bottle.4.tar.gz
🍺  /usr/local/Cellar/autoconf/2.69: 68 files, 3.0MB
==> Installing graphviz dependency: automake
==> Pouring automake-1.16.3.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/automake/1.16.3: 131 files, 3.4MB
==> Installing graphviz dependency: pkg-config
==> Pouring pkg-config-0.29.2_3.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/pkg-config/0.29.2_3: 11 files, 656.6KB
==> Installing graphviz dependency: libpng
==> Pouring libpng-1.6.37.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/libpng/1.6.37: 27 files, 1.3MB
==> Installing graphviz dependency: freetype
==> Pouring freetype-2.10.4.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/freetype/2.10.4: 64 files, 2.3MB
==> Installing graphviz dependency: fontconfig
==> Pouring fontconfig-2.13.1.big_sur.bottle.tar.gz
==> Regenerating font cache, this may take a while
==> /usr/local/Cellar/fontconfig/2.13.1/bin/fc-cache -frv
🍺  /usr/local/Cellar/fontconfig/2.13.1: 531 files, 3.6MB
==> Installing graphviz dependency: jpeg
==> Pouring jpeg-9d.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/jpeg/9d: 21 files, 953.8KB
==> Installing graphviz dependency: libtiff
==> Pouring libtiff-4.1.0_1.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/libtiff/4.1.0_1: 247 files, 4.2MB
==> Installing graphviz dependency: webp
==> Pouring webp-1.1.0.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/webp/1.1.0: 39 files, 2.4MB
==> Installing graphviz dependency: gd
==> Pouring gd-2.3.0.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/gd/2.3.0: 34 files, 1.4MB
==> Installing graphviz dependency: libffi
==> Pouring libffi-3.3.big_sur.bottle.tar.gz
==> Caveats
libffi is keg-only, which means it was not symlinked into /usr/local,
because macOS already provides this software and installing another version in
parallel can cause all kinds of trouble.

For compilers to find libffi you may need to set:
  export LDFLAGS="-L/usr/local/opt/libffi/lib"
  export CPPFLAGS="-I/usr/local/opt/libffi/include"

For pkg-config to find libffi you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/libffi/lib/pkgconfig"

==> Summary
🍺  /usr/local/Cellar/libffi/3.3: 17 files, 540.2KB
==> Installing graphviz dependency: pcre
==> Pouring pcre-8.44.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/pcre/8.44: 204 files, 5.8MB
==> Installing graphviz dependency: glib
==> Pouring glib-2.66.2_1.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/glib/2.66.2_1: 436 files, 15.5MB
==> Installing graphviz dependency: jasper
==> Pouring jasper-2.0.22.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/jasper/2.0.22: 42 files, 1.5MB
==> Installing graphviz dependency: netpbm
==> Pouring netpbm-10.86.17.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/netpbm/10.86.17: 410 files, 17.7MB
==> Installing graphviz dependency: gts
==> Pouring gts-0.7.6_2.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/gts/0.7.6_2: 27 files, 1.4MB
==> Installing graphviz dependency: lzo
==> Pouring lzo-2.10.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/lzo/2.10: 31 files, 570.7KB
==> Installing graphviz dependency: pixman
==> Pouring pixman-0.40.0.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/pixman/0.40.0: 14 files, 1.3MB
==> Installing graphviz dependency: cairo
==> Pouring cairo-1.16.0_3.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/cairo/1.16.0_3: 119 files, 5.9MB
==> Installing graphviz dependency: gdk-pixbuf
==> Pouring gdk-pixbuf-2.42.0.big_sur.bottle.tar.gz
==> /usr/local/Cellar/gdk-pixbuf/2.42.0/bin/gdk-pixbuf-query-loaders --update-cache
🍺  /usr/local/Cellar/gdk-pixbuf/2.42.0: 149 files, 3.8MB
==> Installing graphviz dependency: fribidi
==> Pouring fribidi-1.0.10.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/fribidi/1.0.10: 67 files, 669.0KB
==> Installing graphviz dependency: gobject-introspection
==> Pouring gobject-introspection-1.66.1_1.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/gobject-introspection/1.66.1_1: 191 files, 12.7MB
==> Installing graphviz dependency: graphite2
==> Pouring graphite2-1.3.14.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/graphite2/1.3.14: 18 files, 291.7KB
==> Installing graphviz dependency: icu4c
==> Pouring icu4c-67.1.big_sur.bottle.tar.gz
==> Caveats
icu4c is keg-only, which means it was not symlinked into /usr/local,
because macOS provides libicucore.dylib (but nothing else).

If you need to have icu4c first in your PATH run:
  echo 'export PATH="/usr/local/opt/icu4c/bin:$PATH"' >> ~/.zshrc
  echo 'export PATH="/usr/local/opt/icu4c/sbin:$PATH"' >> ~/.zshrc

For compilers to find icu4c you may need to set:
  export LDFLAGS="-L/usr/local/opt/icu4c/lib"
  export CPPFLAGS="-I/usr/local/opt/icu4c/include"

For pkg-config to find icu4c you may need to set:
  export PKG_CONFIG_PATH="/usr/local/opt/icu4c/lib/pkgconfig"

==> Summary
🍺  /usr/local/Cellar/icu4c/67.1: 258 files, 71.8MB
==> Installing graphviz dependency: harfbuzz
==> Pouring harfbuzz-2.7.2.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/harfbuzz/2.7.2: 68 files, 6.4MB
==> Installing graphviz dependency: pango
==> Pouring pango-1.48.0.big_sur.bottle.tar.gz
🍺  /usr/local/Cellar/pango/1.48.0: 64 files, 3MB
==> Installing graphviz dependency: librsvg
==> Pouring librsvg-2.50.2.big_sur.bottle.tar.gz
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/3eb605900a29b02eb026199f14474efc43e313ee2b9de389706c795eebdc24f5--librsvg-2.50.2.big_sur.bottle.tar.gz'
Error: Failure while executing; `tar xof /Users/wangpeng/Library/Caches/Homebrew/downloads/3eb605900a29b02eb026199f14474efc43e313ee2b9de389706c795eebdc24f5--librsvg-2.50.2.big_sur.bottle.tar.gz -C /var/folders/zs/2875szcx7jn6lbmqd0jfbprr0000gn/T/d20210302-22554-102pbtw` exited with 1. Here's the output:
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/3eb605900a29b02eb026199f14474efc43e313ee2b9de389706c795eebdc24f5--librsvg-2.50.2.big_sur.bottle.tar.gz'

Warning: Bottle installation failed: building from source.
==> Installing dependencies for librsvg: libssh2 and rust
==> Installing librsvg dependency: libssh2
==> Pouring libssh2-1.9.0_1.big_sur.bottle.tar.gz
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/45db0c196aa97bf6c0a9c6e7787ad2cd0d14d563c03d0f4e0d52392a0f3a1c81--libssh2-1.9.0_1.big_sur.bottle.tar.gz'
Error: Failure while executing; `tar xof /Users/wangpeng/Library/Caches/Homebrew/downloads/45db0c196aa97bf6c0a9c6e7787ad2cd0d14d563c03d0f4e0d52392a0f3a1c81--libssh2-1.9.0_1.big_sur.bottle.tar.gz -C /var/folders/zs/2875szcx7jn6lbmqd0jfbprr0000gn/T/d20210302-22554-qzrgbb` exited with 1. Here's the output:
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/45db0c196aa97bf6c0a9c6e7787ad2cd0d14d563c03d0f4e0d52392a0f3a1c81--libssh2-1.9.0_1.big_sur.bottle.tar.gz'

Warning: Bottle installation failed: building from source.
==> Downloading https://libssh2.org/download/libssh2-1.9.0.tar.gz
######################################################################## 100.0%
==> ./configure --prefix=/usr/local/Cellar/libssh2/1.9.0_1 --disable-examples-build --with-openssl --with-libz --with-libssl-prefix=/usr/local/opt/openssl@1.1
==> make install
🍺  /usr/local/Cellar/libssh2/1.9.0_1: 184 files, 969.9KB, built in 33 seconds
==> Installing librsvg dependency: rust
==> Pouring rust-1.47.0.big_sur.bottle.tar.gz
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/f1482d118ddb120ff152e8f8aa88afa9bebc5674cc42aebca96249cffbdd8bdb--rust-1.47.0.big_sur.bottle.tar.gz'
Error: Failure while executing; `tar xof /Users/wangpeng/Library/Caches/Homebrew/downloads/f1482d118ddb120ff152e8f8aa88afa9bebc5674cc42aebca96249cffbdd8bdb--rust-1.47.0.big_sur.bottle.tar.gz -C /var/folders/zs/2875szcx7jn6lbmqd0jfbprr0000gn/T/d20210302-22554-16tqegl` exited with 1. Here's the output:
tar: Error opening archive: Failed to open '/Users/wangpeng/Library/Caches/Homebrew/downloads/f1482d118ddb120ff152e8f8aa88afa9bebc5674cc42aebca96249cffbdd8bdb--rust-1.47.0.big_sur.bottle.tar.gz'

Warning: Bottle installation failed: building from source.
==> Downloading https://static.rust-lang.org/dist/rustc-1.47.0-src.tar.gz
######################################################################## 100.0%
==> ./configure --prefix=/usr/local/Cellar/rust/1.47.0 --release-channel=stable
==> make
Last 15 lines from /Users/wangpeng/Library/Logs/Homebrew/rust/02.make:
error: failed to get `cc` as a dependency of package `bootstrap v0.0.0 (/private/tmp/rust-20210302-29879-dftrmf/rustc-1.47.0-src/src/bootstrap)`

Caused by:
  failed to fetch `https://github.com/rust-lang/crates.io-index`

Caused by:
  network failure seems to have happened
  if a proxy or similar is necessary `net.git-fetch-with-cli` may help here
  https://doc.rust-lang.org/cargo/reference/config.html#netgit-fetch-with-cli

Caused by:
  http parser error: stream ended at an unexpected time; class=Http (34)
failed to run: /private/tmp/rust-20210302-29879-dftrmf/rustc-1.47.0-src/build/x86_64-apple-darwin/stage0/bin/cargo build --manifest-path /private/tmp/rust-20210302-29879-dftrmf/rustc-1.47.0-src/src/bootstrap/Cargo.toml
Build completed unsuccessfully in 0:33:17
make: *** [all] Error 1

READ THIS: https://docs.brew.sh/Troubleshooting

These open issues may also help:
rust 1.50.0 https://github.com/Homebrew/homebrew-core/pull/70922
Rust-dependent formulae on Apple Silicon - upstream issue tracker https://github.com/Homebrew/homebrew-core/issues/68301
```

### defer/recover在简单web服务应用

代码结构![](/images/golang/web.jpg)

https://github.com/weitrue/note/tree/master/go/web/

### 包管理

#### gopm 获取无法下载的包

`go get -v github.com/gpmgo/gopm`

github地址：https://github.com/gpmgo/gopm

文档路径：https://github.com/gpmgo/docs/tree/master/zh-CN

安装踩坑：

```zsh
github.com/codegangsta/cli: github.com/codegangsta/cli@v1.22.5: parsing go.mod:
		module declares its path as: github.com/urfave/cli
	        but was required as: github.com/codegangsta/cli
	        
```

关闭go mod即可成功安装

### 工具

{% note info %}

[OSV-扫描仪](https://google.github.io/osv-scanner/)

[github](https://github.com/google/osv-scanner)

```shell
- Scan a docker image 扫描基于Debian的docker镜像包:
    osv-scanner -D docker_image_name

- Scan a package lockfile 扫描特定锁定文件:
    osv-scanner -L path/to/lockfile

- Scan an SBOM file 只检查SBOM中依赖项中的漏洞:
    osv-scanner -S path/to/sbom_file

- Scan multiple directories recursively 扫描目录:
    osv-scanner -r directory1 directory2 ...

- Skip scanning git repositories:
    osv-scanner --skip-git -r|-D target

- Output result in JSON format:
    osv-scanner --json -D|-L|-S|-r target
```

{% endnote %}

{% note info %}

[WeChat SDK for Go](https://silenceper.com/blog/201609/go-wechat-sdk/)

{% endnote %}

##### 爬虫相关

- [henrylee2cn/pholcus](https://github.com/henrylee2cn/pholcus)
- [gocrawl](https://github.com/PuerkitoBio/gocrawl)
- [colly](https://github.com/gocolly/colly)
- [hu17889/go_spider](https://github.com/hu17889/go_spider)

##### Middleware

{% note success %}

[bytebufferpool](https://github.com/valyala/bytebufferpool)

- 依托sync.Pool进行了二次封装。
- defaultSize设置每次创建buffer的默认大小,超过maxSize的buffer不会被放回去。
- 分组统计不同大小buffer的使用次数,例如0-64bytes的buffer被使用的次数。
- 引入校准机制,动态计算defaultSize和maxSize。

{% endnote %}

##### 其他

- [二维码生成](https://github.com/skip2/go-qrcode)

- [viper](https://github.com/spf13/viper)
- [CLI applications](https://github.com/spf13/cobra)

### Q&A

{% note warning %}

{% label danger @go http client protocol error: received DATA after END_STREAM%}

received DATA after END_STREAM只会存在于http2协议中,因此需要设置http client中的ForceAttempHTTP2=false。

[解决](https://www.google.com.hk/search?q=go+http+client+protocol+error%3A+received+DATA+after+END_STREAM&ei=gwt2YoaqHKyWseMPkdiP6Aw&ved=0ahUKEwjG97rJ28z3AhUsS2wGHRHsA80Q4dUDCA4&uact=5&oq=go+http+client+protocol+error%3A+received+DATA+after+END_STREAM&gs_lcp=Cgdnd3Mtd2l6EANKBAhBGABKBAhGGABQAFjuOGCcPWgAcAF4AYABlgaIAZkjkgENMC43LjQuMS4wLjIuMZgBAKABAcABAQ&sclient=gws-wiz)

{% endnote %}

{% note warning %}

{% label danger @context canceled%}

增加客户端请求超时时间。

[解决](https://learnku.com/articles/63884)

{% endnote %}

### 面试题

#### 基础语法

Q1 `=` 和 `:=` 的区别？

{% spoiler 答案 %}

`:=` 声明+赋值

`=` 仅赋值

```go
var foo int
foo = 10
// 等价于
foo := 10
```

{% endspoiler %}

Q2 指针的作用?

{% spoiler 答案 %}

指针用来保存变量的地址。

例如

```go
var x =  5
var p *int = &x
fmt.Printf("x = %d",  *p) // x 可以用 *p 访问
```

- `*` 运算符，也称为解引用运算符，用于访问地址中的值。
- `＆`运算符，也称为地址运算符，用于返回变量的地址。

{% endspoiler %}

Q3 Go 允许多个返回值吗？

{% spoiler 答案 %}

允许

```go
func swap(x, y string) (string, string) {
   return y, x
}

func main() {
   a, b := swap("A", "B")
   fmt.Println(a, b) // B A
}
```

{% endspoiler %}

Q4 Go 有异常类型吗？

{% spoiler 答案 %}

Go 没有异常类型，只有错误类型（Error），通常使用返回值来表示异常状态。

```go
f, err := os.Open("test.txt")
if err != nil {
    log.Fatal(err)
}
```

{% endspoiler %}

Q5 什么是协程（Goroutine）

{% spoiler 答案 %}

Goroutine 是与其他函数或方法同时运行的函数或方法。 Goroutines 可以被认为是轻量级的线程。 与线程相比，创建 Goroutine 的开销很小。 Go应用程序同时运行数千个 Goroutine 是非常常见的做法。

{% endspoiler %}

Q6 如何高效地拼接字符串

{% spoiler 答案 %}

Go 语言中，字符串是只读的，也就意味着每次修改操作都会创建一个新的字符串。如果需要拼接多次，应使用 `strings.Builder`，最小化内存拷贝次数。

```go
var str strings.Builder
for i := 0; i < 1000; i++ {
    str.WriteString("a")
}
fmt.Println(str.String())
```

{% endspoiler %}

Q7 什么是 rune 类型

{% spoiler 答案 %}

ASCII 码只需要 7 bit 就可以完整地表示，但只能表示英文字母在内的128个字符，为了表示世界上大部分的文字系统，发明了 Unicode， 它是ASCII的超集，包含世界上书写系统中存在的所有字符，并为每个代码分配一个标准编号（称为Unicode CodePoint），在 Go 语言中称之为 rune，是 int32 类型的别名。

Go 语言中，字符串的底层表示是 byte (8 bit) 序列，而非 rune (32 bit) 序列。例如下面的例子中 `语` 和 `言` 使用 UTF-8 编码后各占 3 个 byte，因此 `len("Go语言")` 等于 8，当然我们也可以将字符串转换为 rune 序列。

```go
fmt.Println(len("Go语言")) // 8
fmt.Println(len([]rune("Go语言"))) // 4
```

{% endspoiler %}

Q8 如何判断 map 中是否包含某个 key ？

{% spoiler 答案 %}

```go
if val, ok := dict["foo"]; ok {
    //do something here
}
```

`dict["foo"]` 有 2 个返回值，val 和 ok，如果 ok 等于 `true`，则说明 dict 包含 key `"foo"`，val 将被赋予 `"foo"` 对应的值。

{% endspoiler %}

Q9 Go 支持默认参数或可选参数吗？

{% spoiler 答案 %}

Go 语言不支持可选参数（python 支持），也不支持方法重载（java支持）。

{% endspoiler %}

Q10 defer 的执行顺序

{% spoiler 答案 %}

- 多个 defer 语句，遵从后进先出(Last In First Out，LIFO)的原则，最后声明的 defer 语句，最先得到执行。
- defer 在 return 语句之后执行，但在函数退出之前，defer 可以修改返回值。

例如：

```go
func test() int {
	i := 0
	defer func() {
		fmt.Println("defer1")
	}()
	defer func() {
		i += 1
		fmt.Println("defer2")
	}()
	return i
}

func main() {
	fmt.Println("return", test())
}
// defer2
// defer1
// return 0
```

这个例子中，可以看到 defer 的执行顺序：后进先出。但是返回值并没有被修改，这是由于 Go 的返回机制决定的，执行 return 语句后，Go 会创建一个临时变量保存返回值，因此，defer 语句修改了局部变量 i，并没有修改返回值。那如果是有名的返回值呢？

```go
func test() (i int) {
	i = 0
	defer func() {
		i += 1
		fmt.Println("defer2")
	}()
	return i
}

func main() {
	fmt.Println("return", test())
}
// defer2
// return 1
```

这个例子中，返回值被修改了。对于有名返回值的函数，执行 return 语句时，并不会再创建临时变量保存，因此，defer 语句修改了 i，即对返回值产生了影响。

{% endspoiler %}

Q11 如何交换 2 个变量的值？

{% spoiler 答案 %}

```go
a, b := "A", "B"
a, b = b, a
fmt.Println(a, b) // B A
```

{% endspoiler %}

Q12 Go 语言 tag 的用处？

{% spoiler 答案 %}

tag 可以理解为 struct 字段的注解，可以用来定义字段的一个或多个属性。框架/工具可以通过反射获取到某个字段定义的属性，采取相应的处理方式。tag 丰富了代码的语义，增强了灵活性。

例如：

```go
package main

import "fmt"
import "encoding/json"

type Stu struct {
	Name string `json:"stu_name"`
	ID   string `json:"stu_id"`
	Age  int    `json:"-"`
}

func main() {
	buf, _ := json.Marshal(Stu{"Tom", "t001", 18})
	fmt.Printf("%s\n", buf)
}
```

这个例子使用 tag 定义了结构体字段与 json 字段的转换关系，Name -> `stu_name`, ID -> `stu_id`，忽略 Age 字段。很方便地实现了 Go 结构体与不同规范的 json 文本之间的转换。

{% endspoiler %}

Q13 如何判断 2 个字符串切片（slice) 是相等的？

{% spoiler 答案 %}

go 语言中可以使用反射 `reflect.DeepEqual(a, b)` 判断 a、b 两个切片是否相等，但是通常不推荐这么做，使用反射非常影响性能。

通常采用的方式如下，遍历比较切片中的每一个元素（注意处理越界的情况）。

```go
func StringSliceEqualBCE(a, b []string) bool {
    if len(a) != len(b) {
        return false
    }

    if (a == nil) != (b == nil) {
        return false
    }

    b = b[:len(a)]
    for i, v := range a {
        if v != b[i] {
            return false
        }
    }

    return true
}
```

{% endspoiler %}

Q14 字符串打印时，`%v` 和 `%+v` 的区别

{% spoiler 答案 %}

`%v` 和 `%+v` 都可以用来打印 struct 的值，区别在于 `%v` 仅打印各个字段的值，`%+v` 还会打印各个字段的名称。

```go
type Stu struct {
	Name string
}

func main() {
	fmt.Printf("%v\n", Stu{"Tom"}) // {Tom}
	fmt.Printf("%+v\n", Stu{"Tom"}) // {Name:Tom}
}
```

但如果结构体定义了 `String()` 方法，`%v` 和 `%+v` 都会调用 `String()` 覆盖默认值。

{% endspoiler %}

Q15 Go 语言中如何表示枚举值(enums)

{% spoiler 答案 %}

通常使用常量(const) 来表示枚举值。

```go
type StuType int32

const (
	Type1 StuType = iota
	Type2
	Type3
	Type4
)

func main() {
	fmt.Println(Type1, Type2, Type3, Type4) // 0, 1, 2, 3
}
```

{% endspoiler %}

Q16 空 struct{} 的用途

{% spoiler 答案 %}

使用空结构体 struct{} 可以节省内存，一般作为占位符使用，表明这里并不需要一个值。

```go
fmt.Println(unsafe.Sizeof(struct{}{})) // 0
```

比如使用 map 表示集合时，只关注 key，value 可以使用 struct{} 作为占位符。如果使用其他类型作为占位符，例如 int，bool，不仅浪费了内存，而且容易引起歧义。

```go
type Set map[string]struct{}

func main() {
	set := make(Set)

	for _, item := range []string{"A", "A", "B", "C"} {
		set[item] = struct{}{}
	}
	fmt.Println(len(set)) // 3
	if _, ok := set["A"]; ok {
		fmt.Println("A exists") // A exists
	}
}
```

再比如，使用信道(channel)控制并发时，我们只是需要一个信号，但并不需要传递值，这个时候，也可以使用 struct{} 代替。

```go
func main() {
	ch := make(chan struct{}, 1)
	go func() {
		<-ch
		// do something
	}()
	ch <- struct{}{}
	// ...
}
```

再比如，声明只包含方法的结构体。

```go
type Lamp struct{}

func (l Lamp) On() {
        println("On")

}
func (l Lamp) Off() {
        println("Off")
}
```

{% endspoiler %}

#### 实现原理

Q1 init() 函数是什么时候执行的？

{% spoiler 答案 %}

`init()` 函数是 Go 程序初始化的一部分。Go 程序初始化先于 main 函数，由 runtime 初始化每个导入的包，初始化顺序不是按照从上到下的导入顺序，而是按照解析的依赖关系，没有依赖的包最先初始化。

每个包首先初始化包作用域的常量和变量（常量优先于变量），然后执行包的 `init()` 函数。同一个包，甚至是同一个源文件可以有多个 `init()` 函数。`init()` 函数没有入参和返回值，不能被其他函数调用，同一个包内多个 `init()` 函数的执行顺序不作保证。

一句话总结： import –> const –> var –> `init()` –> `main()`

示例：

```go
package main

import "fmt"

func init()  {
	fmt.Println("init1:", a)
}

func init()  {
	fmt.Println("init2:", a)
}

var a = 10
const b = 100

func main() {
	fmt.Println("main:", a)
}
// 执行结果
// init1: 10
// init2: 10
// main: 10
```

{% endspoiler %}

Q2 Go 语言的局部变量分配在栈上还是堆上？

{% spoiler 答案 %}

由编译器决定。Go 语言编译器会自动决定把一个变量放在栈还是放在堆，编译器会做逃逸分析(escape analysis)，当发现变量的作用域没有超出函数范围，就可以在栈上，反之则必须分配在堆上。

```go
func foo() *int {
	v := 11
	return &v
}

func main() {
	m := foo()
	println(*m) // 11
}
```

`foo()` 函数中，如果 v 分配在栈上，foo 函数返回时，`&v` 就不存在了，但是这段函数是能够正常运行的。Go 编译器发现 v 的引用脱离了 foo 的作用域，会将其分配在堆上。因此，main 函数中仍能够正常访问该值。

{% endspoiler %}

Q3 2 个 interface 可以比较吗？

{% spoiler 答案 %}

Go 语言中，interface 的内部实现包含了 2 个字段，类型 `T` 和 值 `V`，interface 可以使用 `==` 或 `!=` 比较。2 个 interface 相等有以下 2 种情况

1. 两个 interface 均等于 nil（此时 V 和 T 都处于 unset 状态）
2. 类型 T 相同，且对应的值 V 相等。

看下面的例子：

```go
type Stu struct {
	Name string
}

type StuInt interface{}

func main() {
	var stu1, stu2 StuInt = &Stu{"Tom"}, &Stu{"Tom"}
	var stu3, stu4 StuInt = Stu{"Tom"}, Stu{"Tom"}
	fmt.Println(stu1 == stu2) // false
	fmt.Println(stu3 == stu4) // true
}
```

`stu1` 和 `stu2` 对应的类型是 `*Stu`，值是 Stu 结构体的地址，两个地址不同，因此结果为 false。
`stu3` 和 `stu4` 对应的类型是 `Stu`，值是 Stu 结构体，且各字段相等，因此结果为 true。

{% endspoiler %}

Q4 两个 nil 可能不相等吗？

{% spoiler 答案 %}

可能。

接口(interface) 是对非接口值(例如指针，struct等)的封装，内部实现包含 2 个字段，类型 `T` 和 值 `V`。一个接口等于 nil，当且仅当 T 和 V 处于 unset 状态（T=nil，V is unset）。

- 两个接口值比较时，会先比较 T，再比较 V。
- 接口值与非接口值比较时，会先将非接口值尝试转换为接口值，再比较。

```go
func main() {
	var p *int = nil
	var i interface{} = p
	fmt.Println(i == p) // true
	fmt.Println(p == nil) // true
	fmt.Println(i == nil) // false
}
```

上面这个例子中，将一个 nil 非接口值 p 赋值给接口 i，此时，i 的内部字段为`(T=*int, V=nil)`，i 与 p 作比较时，将 p 转换为接口后再比较，因此 `i == p`，p 与 nil 比较，直接比较值，所以 `p == nil`。

但是当 i 与 nil 比较时，会将 nil 转换为接口 `(T=nil, V=nil)`，与i `(T=*int, V=nil)` 不相等，因此 `i != nil`。因此 V 为 nil ，但 T 不为 nil 的接口不等于 nil。

{% endspoiler %}

Q5 简述 Go 语言GC(垃圾回收)的工作原理

{% spoiler 答案 %}

最常见的垃圾回收算法有标记清除(Mark-Sweep) 和引用计数(Reference Count)，Go 语言采用的是标记清除算法。并在此基础上使用了三色标记法和写屏障技术，提高了效率。

标记清除收集器是跟踪式垃圾收集器，其执行过程可以分成标记（Mark）和清除（Sweep）两个阶段：

- 标记阶段 — 从根对象出发查找并标记堆中所有存活的对象；
- 清除阶段 — 遍历堆中的全部对象，回收未被标记的垃圾对象并将回收的内存加入空闲链表。

标记清除算法的一大问题是在标记期间，需要暂停程序（Stop the world，STW），标记结束之后，用户程序才可以继续执行。为了能够异步执行，减少 STW 的时间，Go 语言采用了三色标记法。

三色标记算法将程序中的对象分成白色、黑色和灰色三类。

- 白色：不确定对象。
- 灰色：存活对象，子对象待处理。
- 黑色：存活对象。

标记开始时，所有对象加入白色集合（这一步需 STW ）。首先将根对象标记为灰色，加入灰色集合，垃圾搜集器取出一个灰色对象，将其标记为黑色，并将其指向的对象标记为灰色，加入灰色集合。重复这个过程，直到灰色集合为空为止，标记阶段结束。那么白色对象即可需要清理的对象，而黑色对象均为根可达的对象，不能被清理。

三色标记法因为多了一个白色的状态来存放不确定对象，所以后续的标记阶段可以并发地执行。当然并发执行的代价是可能会造成一些遗漏，因为那些早先被标记为黑色的对象可能目前已经是不可达的了。所以三色标记法是一个 false negative（假阴性）的算法。

三色标记法并发执行仍存在一个问题，即在 GC 过程中，对象指针发生了改变。比如下面的例子：

```shell
A (黑) -> B (灰) -> C (白) -> D (白)
```

正常情况下，D 对象最终会被标记为黑色，不应被回收。但在标记和用户程序并发执行过程中，用户程序删除了 C 对 D 的引用，而 A 获得了 D 的引用。标记继续进行，D 就没有机会被标记为黑色了（A 已经处理过，这一轮不会再被处理）。

```shell
A (黑) -> B (灰) -> C (白) 
  ↓
 D (白)
```

为了解决这个问题，Go 使用了内存屏障技术，它是在用户程序读取对象、创建新对象以及更新对象指针时执行的一段代码，类似于一个钩子。垃圾收集器使用了写屏障（Write Barrier）技术，当对象新增或更新时，会将其着色为灰色。这样即使与用户程序并发执行，对象的引用发生改变时，垃圾收集器也能正确处理了。

一次完整的 GC 分为四个阶段：

- 1）标记准备(Mark Setup，需 STW)，打开写屏障(Write Barrier)
- 2）使用三色标记法标记（Marking, 并发）
- 3）标记结束(Mark Termination，需 STW)，关闭写屏障。
- 4）清理(Sweeping, 并发)

{% endspoiler %}

Q6 函数返回局部变量的指针是否安全？

{% spoiler 答案 %}

这在 Go 中是安全的，Go 编译器将会对每个局部变量进行逃逸分析。如果发现局部变量的作用域超出该函数，则不会将内存分配在栈上，而是分配在堆上。

{% endspoiler %}

Q7 非接口非接口的任意类型 T() 都能够调用 `*T` 的方法吗？反过来呢？

{% spoiler 答案 %}

- 一个T类型的值可以调用为`*T`类型声明的方法，但是仅当此T的值是可寻址(addressable) 的情况下。编译器在调用指针属主方法前，会自动取此T值的地址。因为不是任何T值都是可寻址的，所以并非任何T值都能够调用为类型`*T`声明的方法。
- 反过来，一个`*T`类型的值可以调用为类型T声明的方法，这是因为解引用指针总是合法的。事实上，你可以认为对于每一个为类型 T 声明的方法，编译器都会为类型`*T`自动隐式声明一个同名和同签名的方法。

哪些值是不可寻址的呢？

- 字符串中的字节；
- map 对象中的元素（slice 对象中的元素是可寻址的，slice的底层是数组）；
- 常量；
- 包级别的函数等。

举一个例子，定义类型 T，并为类型 `*T` 声明一个方法 `hello()`，变量 t1 可以调用该方法，但是常量 t2 调用该方法时，会产生编译错误。

```go
type T string

func (t *T) hello() {
	fmt.Println("hello")
}

func main() {
	var t1 T = "ABC"
	t1.hello() // hello
	const t2 T = "ABC"
	t2.hello() // error: cannot call pointer method on t
}
```

{% endspoiler %}

#### 并发编程

Q1 无缓冲的 channel 和 有缓冲的 channel 的区别？

{% spoiler 答案 %}

对于无缓冲的 channel，发送方将阻塞该信道，直到接收方从该信道接收到数据为止，而接收方也将阻塞该信道，直到发送方将数据发送到该信道中为止。

对于有缓存的 channel，发送方在没有空插槽（缓冲区使用完）的情况下阻塞，而接收方在信道为空的情况下阻塞。

```go
func main() {
	st := time.Now()
	ch := make(chan bool)
	go func ()  {
		time.Sleep(time.Second * 2)
		<-ch
	}()
	ch <- true  // 无缓冲，发送方阻塞直到接收方接收到数据。
	fmt.Printf("cost %.1f s\n", time.Now().Sub(st).Seconds())
	time.Sleep(time.Second * 5)
}
```

```go
func main() {
	st := time.Now()
	ch := make(chan bool, 2)
	go func ()  {
		time.Sleep(time.Second * 2)
		<-ch
	}()
	ch <- true
	ch <- true // 缓冲区为 2，发送方不阻塞，继续往下执行
	fmt.Printf("cost %.1f s\n", time.Now().Sub(st).Seconds()) // cost 0.0 s
	ch <- true // 缓冲区使用完，发送方阻塞，2s 后接收方接收到数据，释放一个插槽，继续往下执行
	fmt.Printf("cost %.1f s\n", time.Now().Sub(st).Seconds()) // cost 2.0 s
	time.Sleep(time.Second * 5)
}
```

{% endspoiler %}

Q2 什么是协程泄露(Goroutine Leak)？

{% spoiler 答案 %}

协程泄露是指协程创建后，长时间得不到释放，并且还在不断地创建新的协程，最终导致内存耗尽，程序崩溃。常见的导致协程泄露的场景有以下几种：

- 缺少接收器，导致发送阻塞

这个例子中，每执行一次 query，则启动1000个协程向信道 ch 发送数字 0，但只接收了一次，导致 999 个协程被阻塞，不能退出。

```go
func query() int {
	ch := make(chan int)
	for i := 0; i < 1000; i++ {
		go func() { ch <- 0 }()
	}
	return <-ch
}

func main() {
	for i := 0; i < 4; i++ {
		query()
		fmt.Printf("goroutines: %d\n", runtime.NumGoroutine())
	}
}
// goroutines: 1001
// goroutines: 2000
// goroutines: 2999
// goroutines: 3998
```

- 缺少发送器，导致接收阻塞

那同样的，如果启动 1000 个协程接收信道的信息，但信道并不会发送那么多次的信息，也会导致接收协程被阻塞，不能退出。

- 死锁(dead lock)

两个或两个以上的协程在执行过程中，由于竞争资源或者由于彼此通信而造成阻塞，这种情况下，也会导致协程被阻塞，不能退出。

- 无限循环(infinite loops)

这个例子中，为了避免网络等问题，采用了无限重试的方式，发送 HTTP 请求，直到获取到数据。那如果 HTTP 服务宕机，永远不可达，导致协程不能退出，发生泄漏。

```go
func request(url string, wg *sync.WaitGroup) {
	i := 0
	for {
		if _, err := http.Get(url); err == nil {
			// write to db
			break
		}
		i++
		if i >= 3 {
			break
		}
		time.Sleep(time.Second)
	}
	wg.Done()
}

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go request(fmt.Sprintf("https://127.0.0.1:8080/%d", i), &wg)
	}
	wg.Wait()
}
```

{% endspoiler %}

Q3 Go 可以限制运行时操作系统线程的数量吗？

{% spoiler 答案 %}

> The GOMAXPROCS variable limits the number of operating system threads that can execute user-level Go code simultaneously. There is no limit to the number of threads that can be blocked in system calls on behalf of Go code; those do not count against the GOMAXPROCS limit.

可以使用环境变量 `GOMAXPROCS` 或 `runtime.GOMAXPROCS(num int)` 设置，例如：

```shell
runtime.GOMAXPROCS(1) // 限制同时执行Go代码的操作系统线程数为 1
```

从官方文档的解释可以看到，`GOMAXPROCS` 限制的是同时执行用户态 Go 代码的操作系统线程的数量，但是对于被系统调用阻塞的线程数量是没有限制的。`GOMAXPROCS` 的默认值等于 CPU 的逻辑核数，同一时间，一个核只能绑定一个线程，然后运行被调度的协程。因此对于 CPU 密集型的任务，若该值过大，例如设置为 CPU 逻辑核数的 2 倍，会增加线程切换的开销，降低性能。对于 I/O 密集型应用，适当地调大该值，可以提高 I/O 吞吐率。

{% endspoiler %}

#### 代码输出

##### 常量与变量

下列代码的输出是：

```go
func main() {
	const (
		a, b = "golang", 100
		d, e
		f bool = true
		g
	)
	fmt.Println(d, e, g)
}
```

{% spoiler 答案 %}

golang 100 true

在同一个 const group 中，如果常量定义与前一行的定义一致，则可以省略类型和值。编译时，会按照前一行的定义自动补全。即等价于

```go
func main() {
	const (
		a, b = "golang", 100
		d, e = "golang", 100
		f bool = true
		g bool = true
	)
	fmt.Println(d, e, g)
}
```

{% endspoiler %}

下列代码的输出是：

```go
func main() {
	const N = 100
	var x int = N

	const M int32 = 100
	var y int = M
	fmt.Println(x, y)
}
```

{% spoiler 答案 %}

编译失败：cannot use M (type int32) as type int in assignment

Go 语言中，常量分为无类型常量和有类型常量两种，`const N = 100`，属于无类型常量，赋值给其他变量时，如果字面量能够转换为对应类型的变量，则赋值成功，例如，`var x int = N`。但是对于有类型的常量 `const M int32 = 100`，赋值给其他变量时，需要类型匹配才能成功，所以显示地类型转换：

```go
var y int = int(M)
```

{% endspoiler %}

下列代码的输出是：

```go
func main() {
	var a int8 = -1
	var b int8 = -128 / a
	fmt.Println(b)
}
```

{% spoiler 答案 %}

-128

int8 能表示的数字的范围是 [-2^7, 2^7-1]，即 [-128, 127]。-128 是无类型常量，转换为 int8，再除以变量 -1，结果为 128，常量除以变量，结果是一个变量。变量转换时允许溢出，符号位变为1，转为补码后恰好等于 -128。

对于有符号整型，最高位是是符号位，计算机用补码表示负数。补码 = 原码取反加一。

例如：

```shell
-1 :  11111111
00000001(原码)    11111110(取反)    11111111(加一)
-128：    
10000000(原码)    01111111(取反)    10000000(加一)

-1 + 1 = 0
11111111 + 00000001 = 00000000(最高位溢出省略)
-128 + 127 = -1
10000000 + 01111111 = 11111111
```

{% endspoiler %}

下列代码的输出是：

```go
func main() {
	const a int8 = -1
	var b int8 = -128 / a
	fmt.Println(b)
}
```

{% spoiler 答案 %}

编译失败：constant 128 overflows int8

-128 和 a 都是常量，在编译时求值，-128 / a = 128，两个常量相除，结果也是一个常量，常量类型转换时不允许溢出，因而编译失败。

{% endspoiler %}

下面的程序的运行结果是？

```go
func main() {
       i := 1
       j := 2
       i, j = j, i
       fmt.Printf("%d%d\n", i, j)
}
```

{% spoiler 答案 %}

21

{% endspoiler %}

下面的程序的运行结果是？

```go
package main

import "fmt"

func main() {
    var i float64 = 3 / 2
    fmt.Print(i)
}
```

{% spoiler 答案 %}

```shell
1
关键在于 3/2 计算的结果，3、2 这是整型字面值常量。根据 Go 的规则，3/2 结果也是整型，因此是 1，最后会隐式转换为 float64。
```

{% endspoiler %}

下面的程序的运行结果是？

```go
func incr(p *int) int {
        *p++
        return *p
}
func main() {
        v := 1
        incr(&v)
        fmt.Println(v)
}
```

{% spoiler 答案 %}

```shell
2
```

{% endspoiler %}

下面的程序的运行结果是？

```go
func incr(v int) int {
        v++
        return v
}
func main() {
        v := 1
        incr(v)
        fmt.Println(v)
}
```

{% spoiler 答案 %}

```shell
1
```

{% endspoiler %}

##### 作用域

下列代码的输出是：

```go
func main() {
	var err error
	if err == nil {
		err := fmt.Errorf("err")
		fmt.Println(1, err)
	}
	if err != nil {
		fmt.Println(2, err)
	}
}
```

{% spoiler 答案 %}

1 err

`:=` 表示声明并赋值，`=` 表示仅赋值。

变量的作用域是大括号，因此在第一个 if 语句 `if err == nil` 内部重新声明且赋值了与外部变量同名的局部变量 err。对该局部变量的赋值不会影响到外部的 err。因此第二个 if 语句 `if err != nil` 不成立。所以只打印了 `1 err`。

{% endspoiler %}

下面的程序的运行结果是?

```go
func main() {
        x := 1
        {
            x := 2
            fmt.Print(x)
        }
        fmt.Println(x)
}
```

{% spoiler 答案 %}

21

{% endspoiler %}

##### defer 延迟调用

下列代码的输出是：

```go
type T struct{}

func (t T) f(n int) T {
	fmt.Print(n)
	return t
}

func main() {
	var t T
	defer t.f(1).f(2)
	fmt.Print(3)
}
```

{% spoiler 答案 %}

132

defer 延迟调用时，需要保存函数指针和参数，因此链式调用的情况下，除了最后一个函数/方法外的函数/方法都会在调用时直接执行。也就是说 `t.f(1)` 直接执行，然后执行 `fmt.Print(3)`，最后函数返回时再执行 `.f(2)`，因此输出是 132。

{% endspoiler %}

下列代码的输出是：

```go
func f(n int) {
	defer fmt.Println(n)
	n += 100
}

func main() {
	f(1)
}
```

{% spoiler 答案 %}

1

打印 1 而不是 101。defer 语句执行时，会将需要延迟调用的函数和参数保存起来，也就是说，执行到 defer 时，参数 n(此时等于1) 已经被保存了。因此后面对 n 的改动并不会影响延迟函数调用的结果。

{% endspoiler %}

下列代码的输出是：

```go
func main() {
	n := 1
	defer func() {
		fmt.Println(n)
	}()
	n += 100
}
```

{% spoiler 答案 %}

101

匿名函数没有通过传参的方式将 n 传入，因此匿名函数内的 n 和函数外部的 n 是同一个，延迟执行时，已经被改变为 101。

{% endspoiler %}

下列代码的输出是：

```go
func main() {
	n := 1
	if n == 1 {
		defer fmt.Println(n)
		n += 100
	}
	fmt.Println(n)
}
```

{% spoiler 答案 %}

```go
101
1
```

先打印 101，再打印 1。defer 的作用域是函数，而不是代码块，因此 if 语句退出时，defer 不会执行，而是等 101 打印后，整个函数返回时，才会执行。

{% endspoiler %}

下面的程序的运行结果是?

```go
for i := 0; i < 5; i++ {
        defer fmt.Printf("%d ", i)
}
```

{% spoiler 答案 %}

```go
4 3 2 1 0
```

{% endspoiler %}

##### 数组与切片

下面的程序的运行结果是?

```go
func main() {
        x := []string{"a", "b", "c"}
        for v := range x {
            fmt.Print(v)
        }
}
```

{% spoiler 答案 %}

```go
012
```

{% endspoiler %}

下面的程序的运行结果是？

```go
func main() {
        x := []string{"a", "b", "c"}
        for _, v := range x {
            fmt.Print(v)
        }
}
```

{% spoiler 答案 %}

```go
abc
```

{% endspoiler %}

下面的程序的运行结果是?

```go
func main() {
    strs := []string{"one", "two", "three"}
		for _, s := range strs {
        go func() {
            time.Sleep(1 * time.Second)
            fmt.Printf("%s ", s)
        }()
    }
    time.Sleep(3 * time.Second)
}
```

{% spoiler 答案 %}

```go
three three three
```

{% endspoiler %}

下面的程序的运行结果是?

```go
func main() {
    strs := []string{"one", "two", "three"}
		for _, s := range strs {
        go func(ss string) {
			      time.Sleep(1 * time.Second)
			      fmt.Printf("%s ", ss)
		    }(s)
    }
    time.Sleep(3 * time.Second)
}
```

{% spoiler 答案 %}

```go
three one two / one two three /...
```

{% endspoiler %}

下面的程序的运行结果是？

```go
package main

import (
    "fmt"
)

func main() {
    v := [...]int{1: 2, 3: 4}
    fmt.Println(len(v))
}
```

{% spoiler 答案 %}

```go
4
除了 map，array(slice) 初始化时也是可以指定索引的。该题有一个索引 3，根据数组的特点，必然有小于 3 的所有也存在，上题中，v 的值是：[0, 2, 0, 4]
```

{% endspoiler %}

下面的程序的运行结果是？

```go
type Slice []int
func NewSlice() Slice {
         return make(Slice, 0)
}
func (s* Slice) Add(elem int) *Slice {
         *s = append(*s, elem)
         fmt.Print(elem)
         return s
}
func main() {
         s := NewSlice()
         defer s.Add(1).Add(2)
         s.Add(3)
}
```

{% spoiler 答案 %}

```go
132
```

{% endspoiler %}

#### 选择题

1.下面属于关键字的是（）

A. func

B. def

C. struct

D. class​

{% spoiler 答案 %}

AC

{% endspoiler %}

2.定义一个包内全局字符串变量，下面语法正确的是 （）

A. var str string

B. str := “”

C. str = “”

D. var str = “”

{% spoiler 答案 %}

AD

{% endspoiler %}

3.通过指针变量 p 访问其成员变量 name，下面语法正确的是（）

A. p.name

B. (*p).name

C. (&p).name

D. p->name

{% spoiler 答案 %}

AB

{% endspoiler %}

4.关于接口和类的说法，下面说法正确的是（）

A. 一个类只需要实现了接口要求的所有函数，我们就说这个类实现了该接口

B. 实现类的时候，只需要关心自己应该提供哪些方法，不用再纠结接口需要拆得多细才合理

C. 类实现接口时，需要导入接口所在的包

D. 接口由使用方按自身需求来定义，使用方无需关心是否有其他模块定义过类似的接口

{% spoiler 答案 %}

ABD

{% endspoiler %}

5.关于字符串连接，下面语法正确的是（）

A. str := ‘abc’ + ‘123’

B. str := “abc” + “123”

C. str ：= ‘123’ + “abc”

D. fmt.Sprintf(“abc%d”, 123)

{% spoiler 答案 %}

BD

{% endspoiler %}

6.关于协程，下面说法正确是（）

A. 协程和线程都可以实现程序的并发执行

B. 线程比协程更轻量级

C. 协程不存在死锁问题

D. 通过channel来进行协程间的通信

{% spoiler 答案 %}

AD

{% endspoiler %}

7.关于init函数，下面说法正确的是（）

A. 一个包中，可以包含多个init函数

B. 程序编译时，先执行导入包的init函数，再执行本包内的init函数

C. main包中，不能有init函数

D. init函数可以被其他函数调用

{% spoiler 答案 %}

AB

{% endspoiler %}

8.关于循环语句，下面说法正确的有（）

A. 循环语句既支持for关键字，也支持while和do-while

B. 关键字for的基本使用方法与C/C++中没有任何差异

C. for循环支持continue和break来控制循环，但是它提供了一个更高级的break，可以选择中断哪一个循环

D. for循环不支持以逗号为间隔的多个赋值语句，必须使用平行赋值的方式来初始化多个变量

{% spoiler 答案 %}

CD

{% endspoiler %}

9.对于函数定义：

```go
func add(args ...int) int {
        sum := 0
        for _, arg := range args {
            sum += arg
        }
        return sum
}
```

下面对add函数调用正确的是（）

 A. add(1, 2)

 B. add(1, 3, 7)

 C. add([]int{1, 2})

 D. add([]int{1, 3, 7}...)

{% spoiler 答案 %}

ABD

{% endspoiler %}

10.关于类型转化，下面语法正确的是（）

A. 

```go
type MyInt int
var i int = 1
var j MyInt = i
```

B.

```GO
type MyInt int
var i int = 1
var j MyInt = (MyInt)i
```

C.

```go
type MyInt int
var i int = 1
var j MyInt = MyInt(i)
```

D.

```go
type MyInt int
var i int = 1
var j MyInt = i.(MyInt)   // Invalid type assertion: i.(MyInt) (non-interface type int on left)
```

{% spoiler 答案 %}

C

{% endspoiler %}

11.关于局部变量的初始化，下面正确的使用方式是（）

A. var i int = 10

B. var i = 10

C. i := 10

D. i = 10

{% spoiler 答案 %}

ABC

{% endspoiler %}

12.关于const常量定义，下面正确的使用方式是（）

A.

```go
const Pi float64 = 3.14159265358979323846
const zero = 0.0
```

B.

```go
const (
        size int64 = 1024
        eof = -1
)
```

C.

```go
const (
        ERR_ELEM_EXIST error = errors.New("element already exists")
        ERR_ELEM_NT_EXIST error = errors.New("element not exists")
) // Const initializer 'errors.New("element already exists")' is not a constant
```

D.

```go
const u, v float32 = 0, 3
const a, b, c = 3, 4, "foo"
```

{% spoiler 答案 %}

ABD

{% endspoiler %}

13.关于布尔变量b的赋值，下面错误的用法是（）

A. `b = true`

B. `b = 1     //  Cannot use '1' (type untyped int) as type bool in assignment`

C. `b = bool(1)   //Cannot convert expression of type int to type bool `

D. `b = (1 == 2)`

{% spoiler 答案 %}

BC

{% endspoiler %}

14.下面的程序的运行结果是（）

```go
func main() {
        if (true) {
            defer fmt.Printf("1")
        } else {
            defer fmt.Printf("2")
        }
        fmt.Printf("3")
}
```

A. 321

B. 32

C. 31

D. 13

{% spoiler 答案 %}

C

{% endspoiler %}

15.关于switch语句，下面说法正确的有（）

A. 条件表达式必须为常量或者整数

B. 单个case中，可以出现多个结果选项

C. 需要用break来明确退出一个case

D. 只有在case中明确添加fallthrough关键字，才会继续执行紧跟的下一个case

{% spoiler 答案 %}

BD

{% endspoiler %}

16.golang中没有隐藏的this指针，这句话的含义是（）

A. 方法施加的对象显式传递，没有被隐藏起来

B. golang沿袭了传统面向对象编程中的诸多概念，比如继承、虚函数和构造函数

C. golang的面向对象表达更直观，对于面向过程只是换了一种语法形式来表达

D. 方法施加的对象不需要非得是指针，也不用非得叫this

{% spoiler 答案 %}

ACD

{% endspoiler %}

17.golang中的引用类型包括（）

A. 数组切片

B. map

C. channel

D. interface

{% spoiler 答案 %}

ABCD

{% endspoiler %}

18.golang中的指针运算包括（）

A. 可以对指针进行自增或自减运算

B. 可以通过“&”取指针的地址

C. 可以通过“*”取指针指向的数据

D. 可以对指针进行下标运算

{% spoiler 答案 %}

BC

{% endspoiler %}

19.关于main函数（可执行程序的执行起点），下面说法正确的是（）

A. main函数不能带参数

B. main函数不能定义返回值

C. main函数所在的包必须为main包

D. main函数中可以使用flag包来获取和解析命令行参数

{% spoiler 答案 %}

ABCD

{% endspoiler %}

20.下面赋值正确的是（）

A. var x = nil

B. var x interface{} = nil

C. var x string = nil

D. var x error = nil

{% spoiler 答案 %}

BD

{% endspoiler %}

21.关于整型切片的初始化，下面正确的是（）

A. s := make([]int)

B. s := make([]int, 0)

C. s := make([]int, 5, 10)

D. s := []int{1, 2, 3, 4, 5}

{% spoiler 答案 %}

BCD

{% endspoiler %}

22.从切片中删除一个元素，下面的算法实现正确的是（）

A.

```go
func (s *Slice)Remove(value interface{}) error {
        for i, v := range *s {
            if isEqual(value, v) {
                if i== len(*s) - 1 {
                    *s = (*s)[:i]
                }else {
                    *s = append((*s)[:i],(*s)[i + 2:]...)
                }
                return nil
            }
        }
        return ERR_ELEM_NT_EXIST
}
```

B.

```go
func (s *Slice)Remove(value interface{}) error {
        for i, v := range *s {
            if isEqual(value, v) {
                *s = append((*s)[:i],(*s)[i + 1:])
                return nil
            }
        }
        return ERR_ELEM_NT_EXIST
}
```

C.

```go
func (s *Slice)Remove(value interface{}) error {
        for i, v := range *s {
            if isEqual(value, v) {
                delete(*s, v)
                return nil
            }
        }
        return ERR_ELEM_NT_EXIST
}
```

D.

```go
func (s *Slice)Remove(value interface{}) error {
        for i, v := range *s {
            if isEqual(value, v) {
                *s = append((*s)[:i],(*s)[i + 1:]...)
                return nil
            }
        }
        return ERR_ELEM_NT_EXIST
}
```

{% spoiler 答案 %}

D

{% endspoiler %}

23.关于变量的自增和自减操作，下面语句正确的是（）

A.

```go
i := 1
i++
```

B.

```go
i := 1
j = i++      // ',', ';', new line or '}' expected, got '++'
```

C.

```go
i := 1
++i
```

D.

```go
i := 1
i--
```

{% spoiler 答案 %}

AD

{% endspoiler %}

24.关于函数声明，下面语法错误的是（）

A. func f(a, b int) (value int, err error)

B. func f(a int, b int) (value int, err error)

C. func f(a, b int) (value int, error)

D. func f(a int, b int) (int, int, error)

{% spoiler 答案 %}

C

{% endspoiler %}

25.如果Add函数的调用代码为：

```go
func main() {
    var a Integer = 1
    var b Integer = 2
    var i interface{} = &a
    sum := i.(*Integer).Add(b)
    fmt.Println(sum)
}
```

则Add函数定义正确的是（）

A.

```go
type Integer int
func (a Integer) Add(b Integer) Integer {
        return a + b
}
```

B.

```go
type Integer int
func (a Integer) Add(b *Integer) Integer {
        return a + *b
}
```

C.

```go
type Integer int
func (a *Integer) Add(b Integer) Integer {
        return *a + b
}
```

D.

```go
type Integer int
func (a *Integer) Add(b *Integer) Integer {
        return *a + *b
}
```

{% spoiler 答案 %}

AC

{% endspoiler %}

26.如果Add函数的调用代码为：

```go
func main() {
        var a Integer = 1
        var b Integer = 2
        var i interface{} = a
        sum := i.(Integer).Add(b)
        fmt.Println(sum)
}
```

则Add函数定义正确的是（）

A.

```go
type Integer int
func (a Integer) Add(b Integer) Integer {
        return a + b
}
```

B.

```go
type Integer int
func (a Integer) Add(b *Integer) Integer {
        return a + *b
}
```

C.

```go
type Integer int
func (a *Integer) Add(b Integer) Integer {
        return *a + b
}
```

D.

```go
type Integer int
func (a *Integer) Add(b *Integer) Integer {
        return *a + *b
}
```

{% spoiler 答案 %}

AC

{% endspoiler %}

27.关于GetPodAction定义，下面赋值正确的是（）

```go
type Fragment interface {
        Exec(transInfo *TransInfo) error
}
type GetPodAction struct {
}
func (g GetPodAction) Exec(transInfo *TransInfo) error {
        ...
        return nil
}
```

A. var fragment Fragment = new(GetPodAction)

B. var fragment Fragment = GetPodAction

C. var fragment Fragment = &GetPodAction{}

D. var fragment Fragment = GetPodAction{}

{% spoiler 答案 %}

ACD

{% endspoiler %}

28.关于GoMock，下面说法正确的是（）

A. GoMock可以对interface打桩

B. GoMock可以对类的成员函数打桩

C. GoMock可以对函数打桩

D. GoMock打桩后的依赖注入可以通过GoStub完成

{% spoiler 答案 %}

AD

{% endspoiler %}

29.关于接口，下面说法正确的是（）

A. 只要两个接口拥有相同的方法列表（次序不同不要紧），那么它们就是等价的，可以相互赋值

B. 如果接口A的方法列表是接口B的方法列表的子集，那么接口B可以赋值给接口A

C. 接口查询是否成功，要在运行期才能够确定

D. 接口赋值是否可行，要在运行期才能够确定

{% spoiler 答案 %}

ABC

{% endspoiler %}

30.关于channel，下面语法正确的是（）

A. var ch chan int

B. ch := make(chan int)

C. <- ch

D. ch <-

{% spoiler 答案 %}

ABC

{% endspoiler %}

31.关于同步锁，下面说法正确的是（）

A. 当一个goroutine获得了Mutex后，其他goroutine就只能乖乖的等待，除非该goroutine释放这个Mutex

B. RWMutex在读锁占用的情况下，会阻止写，但不阻止读

C. RWMutex在写锁占用情况下，会阻止任何其他goroutine（无论读和写）进来，整个锁相当于由该goroutine独占

D. Lock()操作需要保证有Unlock()或RUnlock()调用与之对应

{% spoiler 答案 %}

ABC

{% endspoiler %}

32.golang中大多数数据类型都可以转化为有效的JSON文本，下面几种类型除外（）

A. 指针

B. channel

C. complex

D. 函数

{% spoiler 答案 %}

BCD

{% endspoiler %}

33.关于go vendor，下面说法正确的是（）

A. 基本思路是将引用的外部包的源代码放在当前工程的vendor目录下面

B. 编译go代码会优先从vendor目录先寻找依赖包

C. 可以指定引用某个特定版本的外部包

D. 有了vendor目录后，打包当前的工程代码到其他机器的$GOPATH/src下都可以通过编译

{% spoiler 答案 %}

ABD

{% endspoiler %}

34.flag是bool型变量，下面if表达式符合编码规范的是（）

A. if flag == 1

B. if flag

C. if flag == false

D. if !flag

{% spoiler 答案 %}

BD

{% endspoiler %}

35.value是整型变量，下面if表达式符合编码规范的是（）

A. if value == 0

B. if value

C. if value != 0

D. if !value

{% spoiler 答案 %}

AC

{% endspoiler %}

[流程图](https://www.kancloud.cn/yanshandou/kam2/598850)
