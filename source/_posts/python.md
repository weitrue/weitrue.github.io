---
title: 【Python】基本数据结构和算法
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: Python   # 分类
tags: [Python,ADT]   # 标签
index_img: /images/python/index.jpg
---

How to select datastructures for ADT

1. Dose the data structure provide for the storage requirements as specified by the domain of the ADT?
2. Does the data structure provide the data access and manipulation functionality to fully implement the ADT?
3. Effcient implemention? based on complexity analysis.<!-- more -->

### Strings

```Python
"""
Module Description: 字符串相关
Problem:
Solution：
Date: 2020/2/18 
Author: Wang P
"""

class ReverseString:
    """
    字符数组反转
    """
    def reverse_string(self, x, reverse=False):
        """
        :param x: 字符数组
        :param reverse: 是否之用内置库
        :return:
        """
        if reverse:
            x.reverse()
            return x
        else:
            if not x:
                return
            beg, end = 0, len(x)-1
            while beg < end:
                x[beg], x[end] = x[end], x[beg]
                beg += 1
                end -= 1
            return x


class Palindrome:
    """
    判断字符串是否是回文
    """
    def is_palindrome(self, x):
        if isinstance(x, int) and x < 0:
            return False
        xx = str(x)
        beg, end = 0, len(xx)-1
        while beg < end:
            if xx[beg] == xx[end]:
                beg += 1
                end -= 1
            else:
                return False
        return True


if __name__ == "__main__":
    r = ReverseString()
    print(r.reverse_string(['d', 'h', 's', 'j', 'f'], False))
```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/strings.py

### Array and List

#### array

定长，操作有限，但是节省内存；貌似我的生涯中还没用过，不过python3.5中我试了确实有array类，可以用import array直接导入。

#### list

会预先分配内存，操作丰富，但是耗费内存。用sys.getsizeof做实验可以发现该结构非常类似C++ STL里的vector，是使用最频繁的数据结构。

- list.append: 如果之前没有分配够内存，会重新开辟新区域，然后复制之前的数据，复杂度退化
- list.insert: 会移动被插入区域后所有元素,O(n)
- list.pop: pop不同位置需要的复杂度不同pop(0)是O(1)复杂度,pop()首位O(n)复杂度
- list[]: slice操作copy数据（预留空间）到另一个list

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/array_and_list.py

### Sets and Maps

#### sets ADT

A set is a container that stores a collection of unique values over a given comparable domain in which the stored values have no particular ordering.



#### Maps or Dict ADT

python内部采用hash实现。

```Python
"""
Module Description: 基于collections.OrderedDict实现LRU_cache(最近最少使用缓存算法)
Problem:
Solution：
Date: 2020/2/13 
Author: Wang P
"""
from collections import OrderedDict


class LURCache:
    def __init__(self, capacity=128):
        self._od = OrderedDict()
        self._capacity = capacity

    def get(self, key):
        if key in self._od:
            val = self._od[key]
            self._od.move_to_end(key)
            return val
        else:
            return -1

    def push(self, key, value):
        if key in self._od:
            del self._od[key]
            self._od[key] = value
        else:  # insert
            self._od[key] = value
            if len(self._od) > self._capacity:
                self._od.popitem(last=False)

    def items(self):
        return self._od.items()


if __name__ == "__main__":
    lru_cache = LURCache(3)
    lru_cache.push("1", 1)
    lru_cache.push("2", 2)
    lru_cache.push("3", 3)
    lru_cache.push("4", 4)
    lru_cache.get("2")
    print(lru_cache.items())

```

https://github.com/weitrue/note/blob/master/python/algorithm/collections_examples/lru_cache.py

### Algorithm Analysis

一般使用大O标记法来衡量算法的平均时间复杂度, 1 < log(n) < n < nlog(n) < n^2 < n^3 < a^n。 了解常用数据结构操作的平均时间复杂度有利于使用更高效的数据结构，当然有时候需要在时间和空间上进行衡量，有些操作甚至还会退化，比如list的append操作，如果list空间不够，会去开辟新的空间，操作复杂度退化到O(n)，有时候还需要使用均摊分析(amortized)。

### Searching 

python内置了in操作符和bisect二分操作模块实现查找。

```python
"""
Module Description: 二分查找算法
Problem:
Solution：
Date: 2020/1/20 
Author: Wang P
"""


def binary_search(arr, target):
    n = len(arr)
    left = 0
    right = n - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        elif arr[mid] > target:
            right = mid - 1
        else:
            print(f"index: {mid}, value:{arr[mid]}")
            return True
    return False


if __name__ == "__main__":
    l = [1, 3, 4, 5, 6, 7, 8]
    binary_search(l, 8)
```

https://github.com/weitrue/note/blob/master/python/algorithm/search/binary_search.py

### Sorting

python内置了sorted方法来实现排序操作。

```Python
"""
Module Description: 冒泡排序
Problem:
Solution：
Date: 2020/3/23 
Author: Wang P
"""
import random


class BubbleSort:

    def bubble_sort(self, arr):
        """
        冒泡排序
        :param arr:
        :return:
        """
        n = len(arr)
        for i in range(n):
            for j in range(n-i-1):
                if arr[j] > arr[j+1]:
                    arr[j], arr[j+1] = arr[j+1], arr[j]


if __name__ == "__main__":
    list_a = [random.randint(0, 8) for _ in range(10)]
    print(list_a)
    bs = BubbleSort()
    bs.bubble_sort(list_a)
    print(list_a)
```

```Python
"""
Module Description: 归并排序算法-分治法
Problem:
Solution：
Date: 2020/2/15 
Author: Wang P
"""


class MergeSort:

    def merge_sort(self, arr):
        """
        分治法分三步走，要注意出口
        :param arr:
        :return:
        """
        # 递归出口
        if len(arr) <= 1:
            return arr
        else:
            mid = int(len(arr)/2)
            left_half = self.merge_sort(arr[:mid])
            right_half = self.merge_sort(arr[mid:])
            return self.merge_sorted_list(left_half, right_half)

    def merge_sorted_list(self, list_a, list_b):
        """
        合并两个有序序列
        :param list_a:
        :param list_b:
        :return:
        """
        length_a = len(list_a)
        length_b = len(list_b)
        a = b = 0
        new_list = []
        while a < length_a and b < length_b:
            if list_a[a] < list_b[b]:
                new_list.append(list_a[a])
                a += 1
            else:
                new_list.append(list_b[b])
                b += 1
        if a < length_a:
            new_list.extend(list_a[a:])
        if b < length_b:
            new_list.extend(list_b[b:])
        return new_list


if __name__ == "__main__":
    import random
    ms = MergeSort()
    ll = list(range(10))
    random.shuffle(ll)
    print(ll)
    ll = ms.merge_sort(ll)
    print(ll)

```

```Python
"""
Module Description: 快速排序算法-分治法
Problem:
Solution：Partition:选择基准分割数组为两个字数组，小于基准和大于基准
         对两个字数组分别快排
         合并结果
Date: 2020/2/15 
Author: Wang P
"""
import random
import pysnooper  # 调试神器


class QuickSort:

    @pysnooper.snoop()
    def quick_sort(self, arr):
        if len(arr) < 2:
            return arr
        pivot_index = 0  # 第一个数作为pivot
        pivot = arr[pivot_index]
        less_part = [i for i in arr[pivot_index+1:] if i < pivot]
        great_part = [i for i in arr[pivot_index+1:] if i >= pivot]
        return self.quick_sort(less_part) + [pivot] + self.quick_sort(great_part)


if __name__ == "__main__":
    qs = QuickSort()
    ll = list(range(10))
    random.shuffle(ll)
    print(ll)
    ll = qs.quick_sort(ll)
    print(ll)
```

```Python
"""
Module Description: 拓扑排序
Problem: 对应于该图的拓扑排序,每一个有向无环图都至少存在一种拓扑排序
Solution：
Date: 2020/3/23 
Author: Wang P
"""
import pysnooper
from typing import Mapping


class TopologicalSort:

    @pysnooper.snoop()  # pysnooper 调试神器
    def topological_sort(self, graph: Mapping):
        # in_degrees = {'a'： 0, 'b'： 0, 'c'： 0, 'd'： 0, 'e'： 0, 'f'： 0}
        in_degrees = dict((u, 0) for u in graph)
        for u in graph:
            for v in graph[u]:  # 根据键找出值也就是下级节点
                in_degrees[v] += 1  # 对获取到的下级节点的入度加 1
        # 循环结束之后的结果： {'a'： 0, 'b'： 1, 'c'： 1, 'd'： 2, 'e'： 1, 'f'： 4}
        Q = [u for u in graph if in_degrees[u] == 0]  # 入度为 0 的节点
        in_degrees_zero = []
        while Q:
            u = Q.pop()  # 默认从最后一个移除
            in_degrees_zero.append(u)  # 存储入度为 0 的节点
            for v in graph[u]:
                in_degrees[v] -= 1  # 删除入度为 0 的节点，以及移除其指向
                if in_degrees[v] == 0:
                    Q.append(v)
        return in_degrees_zero


if __name__ == '__main__':
    # 用字典的键值表示图的节点之间的关系，键当前节点。值是后续节点。
    graph_dict = {
        'a': 'bf',  # 表示 a 指向 b 和 f
        'b': 'cdf',
        'c': 'd',
        'd': 'ef',
        'e': 'f',
        'f': ''
    }
    ts = TopologicalSort()
    t = ts.topological_sort(graph_dict)
    print(t)

```

https://github.com/weitrue/note/tree/master/python/algorithm/sort

### Linked Structure

list是最常用的数据结构，但是list在中间增减元素的时候效率会很低，这时候linked list会更适合，缺点就是获取元素的平均时间复杂度变成了O(n)。

```Python
"""
Module Description: 链表 
Problem:
Solution：
Date: 2020/2/16 
Author: Wang P
"""


class ListNode:
    def __init__(self, val):
        self.val = val
        self.next = None


class DeleteNode:
    """
    链表中删除一个节点（已知要删除的节点，不知链表的head）
    思路：将要删除的链表节点node的值修改为node.next的值
         node.next指向node.next.next
         这样相当于删除了node节点
    """
    def __init__(self, node_list=None, node=None):
        if node_list and isinstance(node_list, list):
            self._head = ListNode(node_list[0])
            cur_index = self._head
            for i in range(1, len(node_list)):
                if cur_index.val == node:
                    self._node = cur_index
                cur_index.next = ListNode(node_list[i])
                cur_index = cur_index.next
        else:
            self._head = None
            self._node = None

    @staticmethod
    def delete_node_in_a_linked_list(node):
        next_node = node.next
        next_next_node = node.next.next
        node.val = next_node.val
        node.next = next_next_node

    def traversal(self):
        cur = self._head
        link_list = []
        while cur:
            link_list.append(cur.val)
            cur = cur.next
        print(link_list)


class MergeLinkedList:
    """
    合并两个有序链表
    思路：新建一个链表root，将list_one, list_two遍历，按大小放入root
    """
    def __init__(self, list_one=None, list_two=None):
        if list_one and isinstance(list_one, list) and list_two and isinstance(list_two, list):
            self.list_one = ListNode(list_one[0])
            cur_index = self.list_one
            for i in range(1, len(list_one)):
                cur_index.next = ListNode(list_one[i])
                cur_index = cur_index.next
            self.list_two = ListNode(list_two[0])
            cur_index = self.list_two
            for i in range(1, len(list_two)):
                cur_index.next = ListNode(list_two[i])
                cur_index = cur_index.next
        else:
            self.list_one = None
            self.list_two = None
        self._head = None

    def merge_linked_list(self):
        one_cur_val = self.list_one
        two_cur_val = self.list_two
        self._head = ListNode(None)
        cur = self._head
        while one_cur_val and two_cur_val:
            if one_cur_val.val < two_cur_val.val:
                node = ListNode(one_cur_val.val)
                one_cur_val = one_cur_val.next
            else:
                node = ListNode(two_cur_val.val)
                two_cur_val = two_cur_val.next
            cur.next = node
            cur = node
        cur.next = one_cur_val or two_cur_val

    def traversal(self):
        cur = self._head.next
        link_list = []
        while cur:
            link_list.append(cur.val)
            cur = cur.next
        print(link_list)


class ReverseLinkList:
    """
    单链表反转
    """
    def __init__(self, head=None):
        """链表的头部"""
        self._head = head

    def add(self, val: int):
        """
        给链表添加元素
        ：param val： 传过来的数字
        ：return：
        """
        # 创建一个节点
        node = ListNode(val)
        if self._head is None:
            self._head = node
        else:
            cur = self._head
            while cur.next is not None:
                cur = cur.next  # 移动游标
            cur.next = node  # 如果 next 后面没了证明以及到最后一个节点了

    def traversal(self):
        if not self._head:
            return
        cur = self._head
        link_list = []
        while cur:
            link_list.append(cur.val)
            cur = cur.next
        print(link_list)

    def size(self):
        """
        获取链表的大小
        ：return：
        """
        count = 0
        if self._head is None:
            return count
        else:
            cur = self._head
            while cur is not None:
                count += 1
                cur = cur.next
            return count

    def reverse_link(self):
        """
        单链表反转
        思路：
        让 cur.next 先断开即指向 none，指向设定 pre 游标指向断开的元素，然后
        cur.next 指向断开的元素，再把开始 self._head 再最后一个元素的时候.
        ：return：
        """
        if self._head is None or self.size() == 1:
            return
        else:
            pre = None
            cur = self._head
            while cur is not None:
                post = cur.next
                cur.next = pre
                pre = cur
                cur = post
            self._head = pre  # 逆向后的头节点


class LinkListIntersectionNode:
		"""
		两个链表的的交叉节点
		"""
    def get_intersection_node(self, headA, headB):
        """
        cur1、cur2，2 个指针的初始位置是链表 headA、headB 头结点，cur1、cur2 两个指针一直往后遍历。
        直到 cur1 指针走到链表的末尾，然后 cur1 指向 headB；
        直到 cur2 指针走到链表的末尾，然后 cur2 指向 headA；
        然后再继续遍历；
        每次 cur1、cur2 指向 None，则将 cur1、cur2 分别指向 headB、headA。
        循环的次数越多，cur1、cur2 的距离越接近，直到 cur1 等于 cur2。则是两个链表的相交点。
        ：tye head1, head1： ListNode
        ：rtye： ListNode
        """
        if headA is not None and headB is not None:
            cur1, cur2 = headA, headB

            while cur1 != cur2:
                cur1 = cur1.next if cur1 is not None else headA
                cur2 = cur2.next if cur2 is not None else headB

            return cur1


if __name__ == "__main__":
    dn = DeleteNode([5, 3, 1, 9], 3)
    dn.traversal()
    dn.delete_node_in_a_linked_list(dn._node)
    dn.traversal()

    mn = MergeLinkedList([1, 3, 5], [1, 2, 4, 7])
    mn.merge_linked_list()
    mn.traversal()

    r_link = ReverseLinkList()
    r_link.add(3)
    r_link.add(5)
    r_link.add(6)
    r_link.add(7)
    r_link.add(8)
    print("对链表进行遍历")
    r_link.traversal()
    print(f"size：{r_link.size()}")
    print("对链表进行逆向操作之后")
    r_link.reverse_link()
    r_link.traversal()

```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/link_list_cases.py

### Advanced Linked Lists

#### Doubly Linked List

双链表，每个节点多了个prev指向前一个节点。双链表可以用来编写文本编辑器的buffer。



#### 循环链表

利用循环双端链表我们可以实现一个经典的缓存失效算法，lru：

```Python
class Node(object):
  
    def __init__(self, prev=None, next=None, key=None, value=None):
        self.prev, self.next, self.key, self.value = prev, next, key, value
        
       
class CircularDoubleLinkedList(object):
  
    def __init__(self):
        node = Node()
        node.prev, node.next = node, node
        self.rootnode = node
        
    def headnode(self):
        return self.rootnode.next
      
    def tailnode(self):
        return self.rootnode.prev
      
    def remove(self, node):
        if node is self.rootnode:
            return
        else:
            node.prev.next = node.next
            node.next.prev = node.prev
            
    def append(self, node):
        tailnode = self.tailnode()
        tailnode.next = node
        node.next = self.rootnode
        self.rootnode.prev = node
        
        
class LRUCache(object):
  
    def __init__(self, maxsize=16):
        self.maxsize = maxsize
        self.cache = {}
        self.access = CircularDoubleLinkedList()
        self.isfull = len(self.cache) >= self.maxsize
        
    def __call__(self, func):
        def wrapper(n):
            cachenode = self.cache.get(n)
            if cachenode is not None:  # hit
                self.access.remove(cachenode)
                self.access.append(cachenode)
                return cachenode.value
            else:  # miss
                value = func(n)
                if not self.isfull:
                    tailnode = self.access.tailnode()
                    newnode = Node(tailnode, self.access.rootnode, n, value)
                    self.access.append(newnode)
                    self.cache[n] = newnode
                    self.isfull = len(self.cache) >= self.maxsize
                    return value
                else:  # full
                    lru_node = self.access.headnode()
                    del self.cache[lru_node.key]
                    self.access.remove(lru_node)
                    tailnode = self.access.tailnode()
                    newnode = Node(tailnode, self.access.rootnode, n, value)
                    self.access.append(newnode)
                    self.cache[n] = newnode
                return value
        return wrapper
      
      
@LRUCache()
def fib(n):
    if n <= 2:
        return 1
    else:
        return fib(n - 1) + fib(n - 2)
      
      
for i in range(1, 10):
    print(fib(i))
    
    
# 输出
1
1
2
3
5
8
13
21
34
```



### Stacks

栈，一种后进先出的数据结构。

```Python
"""
Module Description: 基队列实现栈
Problem:
Solution：基于collections.deque实现栈
          基于 2 个队列实现
          基于 1 个队列实现
Date: 2020/2/15 
Author: Wang P
"""
from collections import deque
from queue import Queue


class Stack:
    def __init__(self):
        self.items = deque()

    def push(self, val):
        self.items.append(val)

    def top(self):
        return self.items[-1]

    def pop(self):
        return self.items.pop()

    def empty(self):
        return len(self.items) == 0


class MyStack:
    """
    使用 2 个队列实现
    """
    def __init__(self):
        """
        初始化
        """
        # q1 作为进栈出栈，q2 作为中转站
        self.q1 = Queue()
        self.q2 = Queue()

    def push(self, x):
        """
        入栈
        ：type x： int
        ：rtype： void
        """
        self.q1.put(x)

    def pop(self):
        """
        出栈
        ：rtype： int
        """
        while self.q1.qsize() > 1:
            self.q2.put(self.q1.get())  # 将 q1 中除尾元素外的所有元素转到 q2 中
        if self.q1.qsize() == 1:
            res = self.q1.get()  # 弹出 q1 的最后一个元素
            self.q1, self.q2 = self.q2, self.q1  # 交换 q1,q2
            return res

    def top(self):
        """
        栈顶
        ：rtype： int
        """
        while self.q1.qsize() > 1:
            self.q2.put(self.q1.get())  # 将 q1 中除尾元素外的所有元素转到 q2 中
        if self.q1.qsize() == 1:
            res = self.q1.get()  # 弹出 q1 的最后一个元素
            self.q2.put(res)  # 与 pop 唯一不同的是需要将 q1 最后一个元素保存到 q2 中
            self.q1, self.q2 = self.q2, self.q1  # 交换 q1,q2
            return res

    def empty(self):
        """
        判断是否为空
        ：rtype： bool
        """
        return not bool(self.q1.qsize() + self.q2.qsize())  # 为空返回 True，不为空返回 False


class MyStack2(object):
    """
    使用 1 个队列实现
    """
    def __init__(self):
        """
        初始化
        """
        self.sq1 = Queue()

    def push(self, x):
        """
        入栈
        ：type x： int
        ：rtype： void
        """
        self.sq1.put(x)

    def pop(self):
        """
        出栈
        ：rtype： int
        """
        count = self.sq1.qsize()
        if count == 0:
            return False
        while count > 1:
            x = self.sq1.get()
            self.sq1.put(x)
            count -= 1
        return self.sq1.get()

    def top(self):
        """
        Get the top element.
        ：rtype： int
        """
        count = self.sq1.qsize()
        if count == 0:
            return False
        while count:
            x = self.sq1.get()
            self.sq1.put(x)
            count -= 1
        return x

    def empty(self):
        """
        Returns whether the stack is empty.
        ：rtype： bool
        """
        return self.sq1.empty()


if __name__ == '__main__':
    obj = MyStack2()
    obj.push(1)
    obj.push(3)
    print(obj.pop())
    obj.push(4)
    print(obj.pop())
    print(obj.pop())
    print(obj.empty())
```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/stack_cases.py

### Queues

队列也是经常使用的数据结构，比如发送消息等，celery可以使用redis提供的list实现消息队列。

```Python
"""
Module Description: 基于collections.deque实现队列
                    基于栈实现队列
Problem:
Solution：
Date: 2020/2/15 
Author: Wang P
"""
from collections import deque
from examples.example_0x_cases.algorithm.data_structure.stack_cases import Stack


class Queue:
    def __init__(self):
        self.items = deque()

    def push(self, val):
        self.items.append(val)

    def pop(self):
        return self.items.popleft()

    def empty(self):
        return len(self.items) == 0


class QueueByStack:
    def __init__(self):
        self.stack_one = Stack()
        self.stack_two = Stack()

    def push(self, val):
        self.stack_one.push(val)

    def pop(self):
        if self.stack_two.empty():
            if self.stack_one.empty():
                return 'nil'
            while not self.stack_one.empty():
                self.stack_two.push(self.stack_one.pop())
        return self.stack_two.pop()

    def peek(self):
        if self.stack_two.empty():
            if self.stack_one.empty():
                return 'nil'
            while not self.stack_one.empty():
                self.stack_two.push(self.stack_one.pop())
        return self.stack_two.top()

    def empty(self):
        return self.stack_two


if __name__ == "__main__":
    qu = QueueByStack()
    qu.push(1)
    qu.push(2)
    qu.push(3)
    print(qu.pop())
    print(qu.peek())
    print(qu.pop())
    print(qu.pop())
    print(qu.pop())

```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/queue_cases.py

## Binary Tree

二叉树，每个节点做多只有两个子节点

```Python
"""
Module Description: 二叉树的遍历：前序、中序、后序、层次遍历
                    二叉树的反转
Problem:
Solution：
Date: 2020/2/16 
Author: Wang P
"""


class TreeNode:
    def __init__(self, val, left, right):
        self.val, self.left, self.right = val, left, right


class BinTreeTravel:
    def __init__(self, node_list=None):
        if node_list and isinstance(node_list, list):
            tree_node_list = []
            for i in range(len(node_list)):
                tree_node_list.append(TreeNode(node_list[i], None, None))
            for i in range(0, len(node_list)):
                if i * 2 + 1 <= len(tree_node_list) - 1 and i * 2 + 2 <= len(tree_node_list) - 1:
                    tree_node_list[i].left = tree_node_list[i * 2 + 1]
                    tree_node_list[i].right = tree_node_list[i * 2 + 2]
                elif i * 2 + 1 <= len(tree_node_list) - 1 < i * 2 + 2:
                    tree_node_list[i].left = tree_node_list[i * 2 + 1]
                else:
                    break
            self.root = tree_node_list[0]

    def pre_order_travel(self, sub_tree):
        """
        先序遍历
        :param sub_tree:
        :return:
        """
        if sub_tree:
            print(sub_tree.val)
            self.pre_order_travel(sub_tree.left)
            self.pre_order_travel(sub_tree.right)

    def in_order_travel(self, sub_tree):
        """
        中序遍历
        :param sub_tree:
        :return:
        """
        if sub_tree:
            self.in_order_travel(sub_tree.left)
            print(sub_tree.val)
            self.in_order_travel(sub_tree.right)

    def post_order_travel(self, sub_tree):
        """
        后序遍历
        :param sub_tree:
        :return:
        """
        if sub_tree:
            self.post_order_travel(sub_tree.left)
            self.post_order_travel(sub_tree.right)
            print(sub_tree.val)

    def level_order_travel(self, root):
        """
        层次遍历
        :param root:
        :return: list[list[int]]
        """
        if not root:
            print([])
            return
        cur_nodes = [root]
        next_nodes = []
        print([i.val for i in cur_nodes])
        while cur_nodes or next_nodes:
            for node in cur_nodes:
                if node.left:
                    next_nodes.append(node.left)
                if node.right:
                    next_nodes.append(node.right)
            if next_nodes:
                print([i.val for i in next_nodes])
            cur_nodes = next_nodes
            next_nodes = []


class ReverseBinaryTree:
    """
    反转二叉树
               1                         1
            3     4                   4     3
         5   7  8   9      =>       9  8  7   5
      10                                        10
    """

    def __init__(self, node_list=None):
        if node_list and isinstance(node_list, list):
            tree_node_list = []
            for i in range(len(node_list)):
                tree_node_list.append(TreeNode(node_list[i], None, None))
            for i in range(0, len(node_list)):
                if i * 2 + 1 <= len(tree_node_list) - 1 and i * 2 + 2 <= len(tree_node_list) - 1:
                    tree_node_list[i].left = tree_node_list[i * 2 + 1]
                    tree_node_list[i].right = tree_node_list[i * 2 + 2]
                elif i * 2 + 1 <= len(tree_node_list) - 1 < i * 2 + 2:
                    tree_node_list[i].left = tree_node_list[i * 2 + 1]
                else:
                    break
            self.root = tree_node_list[0]

    def reverse_tree(self, root):
        if root and root.left and root.right:
            root.left, root.right = root.right, root.left
            self.reverse_tree(root.left)
            self.reverse_tree(root.right)
        self.root = root


class FindTreeKthSmallest:
    """
    二叉搜索树中第 K 小的元素
    二叉搜索树按照中序遍历的顺序打印出来正好就是排序好的顺序。所以对其遍历一个节点就进行计数，计数达到 k 的时候就结束。
    """
    count = 0
    node_val = 0

    def kth_smallest(self, root: TreeNode, k):
        """
        ：type root： TreeNode
        ：type k： int
        ：rtype： int
        """
        self.dfs(root, k)
        return self.node_val

    def dfs(self, node: TreeNode, k):
        if not node:
            return
        self.dfs(node.left, k)
        self.count = self.count + 1
        if self.count == k:
            self.node_val = node.val
            # 将该节点的左右子树置为 None,来结束递归，减少时间复杂度
            node.left = None
            node.right = None
        self.dfs(node.right, k)


if __name__ == "__main__":
    bt = BinTreeTravel([1, 3, 4, 5, 7, 8, 9, 10])
    bt.pre_order_travel(bt.root)
    bt.in_order_travel(bt.root)
    bt.post_order_travel(bt.root)
    bt.level_order_travel(bt.root)
    print("#################################################")
    it = ReverseBinaryTree()
    it.reverse_tree(bt.root)
    bt.pre_order_travel(bt.root)

```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/tree_cases.py

### Heap

二叉树最直接的一个应用就是实现堆。堆就是一颗完全二叉树，最大堆的非叶子节点的值都比孩子大，最小堆的非叶子结点的值都比孩子小。 python内置了heapq模块帮助我们实现堆操作，比如用内置的heapq模块实现个堆排序

```Python
"""
Module Description: 获取大量元素中 top-n 大个元素，固定内存
Problem:
Solution：
Date: 2020/2/16 
Author: Wang P
"""
import heapq


class TopN:
    """
    先放入元素前n个建立小顶堆
    迭代剩余元素：
        如果当前元素小于堆顶元素，跳过该元素
        否则退换堆顶元素为当前元素，并重新调整堆
    """
    def __init__(self, iterable, n):
        self.min_heap = []
        self.capacity = n
        self.iterable = iterable

    def push(self, val):
        if len(self.min_heap) >= self.capacity:
            min_val = self.min_heap[0]
            if val < min_val:  # 可以省略
                pass
            else:
                heapq.heapreplace(self.min_heap, val)  # 返回并且pop堆顶最小值，推入心得val并调整堆
        else:
            heapq.heapreplace(self.min_heap, val)  # 前n个元素直接放入堆中

    def get_top_n(self):
        for val in self.iterable:
            self.push(val)
        return self.min_heap

```

https://github.com/weitrue/note/blob/master/python/algorithm/data_structure/heap_cases.py

### Hash Tables

基于比较的搜索（线性搜索，有序数组的二分搜索）最好的时间复杂度只能达到O(logn)，利用hash可以实现O(1)查找，python内置dict的实现方式就是hash，你会发现dict的key必须要是实现了 `__hash__` 和 `__eq__` 方法的。

Hashing: hashing is the process of mapping a search a key to a limited range of array indeices with the goal of providing direct access to the keys.

hash方法有个hash函数用来给key计算一个hash值，作为数组下标，放到该下标对应的槽中。当不同key根据hash函数计算得到的下标相同时，就出现了冲突。解决冲突有很多方式，比如让每个槽成为链表，每次冲突以后放到该槽链表的尾部，但是查询时间就会退化，不再是O(1)。还有一种探查方式，当key的槽冲突时候，就会根据一种计算方式去寻找下一个空的槽存放，探查方式有线性探查，二次方探查法等，cpython解释器使用的是二次方探查法。还有一个问题就是当python使用的槽数量大于预分配的2/3时候，会重新分配内存并拷贝以前的数据，所以有时候dict的add操作代价还是比较高的，牺牲空间但是可以始终保证O(1)的查询效率。如果有大量的数据，建议还是使用bloomfilter或者redis提供的HyperLogLog。

如果感兴趣，可以看看这篇文章，介绍c解释器如何实现的python dict对象：[Python dictionary implementation](http://www.laurentluce.com/posts/python-dictionary-implementation/)。我们使用Python来实现一个类似的hash结构。



### Recursion

递归函数：Recursion is a process for solving problems by subdividing a larger problem into smaller cases of the problem itself and then solving the smaller, more trivial parts.

Properties of Recursion: 使用stack解决的问题都能用递归解决

- A recursive solution must contain a base case; 递归出口，代表最小子问题(n == 0退出打印)
- A recursive solution must contain a recursive case; 可以分解的子问题
- A recursive solution must make progress toward the base case. 递减n使得n像递归出口靠近

Tail Recursion: occurs when a function includes a single recursive call as the last statement of the function. In this case, a stack is not needed to store values to te used upon the return of the recursive call and thus a solution can be implemented using a iterative loop instead.