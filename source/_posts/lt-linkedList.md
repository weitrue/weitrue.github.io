---

title: 【LeetCode】线性表相关问题
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 算法      # 分类
tags:                #标签
	- LeetCode
	- Java
	- Go
	- Python
	- scala
index_img: /images/algorithm/lt-linkedList/index.jpg
---

> 把所有数据用一根线儿串起来，再存储到物理空间中的数据结构<!-- more-->

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problemset/all/

#### 链表相关

##### 链表访问

###### [141. 环形链表](https://leetcode-cn.com/problems/linked-list-cycle/)

给定一个链表，判断链表中是否有环。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

如果链表中存在环，则返回 true 。 否则，返回 false 。

解题思路

```
1.快慢指针，相遇问题
2.借助哈希（Set）
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-04 17:27:34
 * Description:
 **/
 
package com.weitrue.leetcode.editor.cn;

public class LinkedListCycle{
    public static void main(String[] args){
        Solution s = new LinkedListCycle().new Solution();
    }
    
    //Given head, the head of a linked list, determine if the linked list has a cycl
    //e in it.
    //
    // There is a cycle in a linked list if there is some node in the list that can
    //be reached again by continuously following the next pointer. Internally, pos is
    //used to denote the index of the node that tail's next pointer is connected to. N
    //ote that pos is not passed as a parameter.
    //
    // Return true if there is a cycle in the linked list. Otherwise, return false.
    //
    // Example 1:
    //Input: head = [3,2,0,-4], pos = 1
    //Output: true
    //Explanation: There is a cycle in the linked list, where the tail connects to t
    //he 1st node (0-indexed).
    //
    // Example 2:
    //Input: head = [1,2], pos = 0
    //Output: true
    //Explanation: There is a cycle in the linked list, where the tail connects to t
    //he 0th node.
    //
    // Example 3:
    //Input: head = [1], pos = -1
    //Output: false
    //Explanation: There is no cycle in the linked list.
    //
    // Constraints:
    // The number of the nodes in the list is in the range [0, 104].
    // -105 <= Node.val <= 105
    // pos is -1 or a valid index in the linked-list.
    //
    // Follow up: Can you solve it using O(1) (i.e. constant) memory?
    // Related Topics 链表 双指针
    // 👍 970 👎 0

	  // leetcode submit region begin(Prohibit modification and deletion)
    class ListNode {
        int val;
        ListNode next;
        ListNode(int x) {
            val = x;
            next = null;
        }
    }

    public class Solution {
        public boolean hasCycle(ListNode head) {
            if (head == null ||  head.next == null) {
                return false;
            }
            ListNode p = head, q = head;
            do {
                p = p.next;
                q = q.next.next;
            }
            while (q != null && q.next != null && p != q);
            return p == q;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)
}
```

`Golang`

```golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 11:03:59
 * Description:
 **/
//Given head, the head of a linked list, determine if the linked list has a cycl
//e in it. 
//
// There is a cycle in a linked list if there is some node in the list that can 
//be reached again by continuously following the next pointer. Internally, pos is 
//used to denote the index of the node that tail's next pointer is connected to. N
//ote that pos is not passed as a parameter. 
//
// Return true if there is a cycle in the linked list. Otherwise, return false. 
// 
// Example 1: 
//Input: head = [3,2,0,-4], pos = 1
//Output: true
//Explanation: There is a cycle in the linked list, where the tail connects to t
//he 1st node (0-indexed).
// 
// Example 2: 
//Input: head = [1,2], pos = 0
//Output: true
//Explanation: There is a cycle in the linked list, where the tail connects to t
//he 0th node.
// 
// Example 3: 
//Input: head = [1], pos = -1
//Output: false
//Explanation: There is no cycle in the linked list.
// 
// Constraints: 
// The number of the nodes in the list is in the range [0, 104]. 
// -105 <= Node.val <= 105 
// pos is -1 or a valid index in the linked-list. 
// Follow up: Can you solve it using O(1) (i.e. constant) memory? 
// Related Topics 链表 双指针 
// 👍 971 👎 0

//leetcode submit region begin(Prohibit modification and deletion)
// Definition for singly-linked list.
type ListNode struct {
   Val int
   Next *ListNode
}

func hasCycle(head *ListNode) bool {
	if head == nil || head.Next == nil {
		return false
	}
	p := head.Next
	q := head.Next.Next
	for q != nil && q.Next != nil && p != q{
		p = p.Next
		q = q.Next.Next
	}
    return p == q
}
//leetcode submit region end(Prohibit modification and deletion)
```

`Python`

```Python
"""
Module Description: 141-环形链表
Solution：
Date: 2021-03-05 10:38:59
Author: Wang P
Problem:# 给定一个链表，判断链表中是否有环。 
# 
#  如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的
# 位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。 
# 
#  如果链表中存在环，则返回 true 。 否则，返回 false 。 
# 
#  进阶： 
#  你能用 O(1)（即，常量）内存解决此问题吗？ 
# 
#  示例 1： 
#  输入：head = [3,2,0,-4], pos = 1
# 输出：true
# 解释：链表中有一个环，其尾部连接到第二个节点。
#  
#  示例 2： 
#  输入：head = [1,2], pos = 0
# 输出：true
# 解释：链表中有一个环，其尾部连接到第一个节点。
#  
#  示例 3： 
#  输入：head = [1], pos = -1
# 输出：false
# 解释：链表中没有环。
#  
#  提示：  
#  链表中节点的数目范围是 [0, 104] 
#  -105 <= Node.val <= 105 
#  pos 为 -1 或者链表中的一个 有效索引 。 
#  
#  Related Topics 链表 双指针 
#  👍 971 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.


class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


class Solution:

    def hasCycle(self, head: ListNode) -> bool:
        if not head:
            return False
        p = ListNode(-1)
        p.next = head
        p, q = head, head.next
        while q and q.next:
            p = p.next
            q = q.next.next
            if p == q:
                return True

        return False
        
# leetcode submit region end(Prohibit modification and deletion)

```

###### [142. 环形链表 II](https://leetcode-cn.com/problems/linked-list-cycle-ii/)

给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。

说明：不允许修改给定的链表。

进阶：

你是否可以使用 O(1) 空间解决此题？

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

```示例 1：
输入：head = [3,2,0,-4], pos = 1
输出：返回索引为 1 的链表节点
解释：链表中有一个环，其尾部连接到第二个节点。
```

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test2.png)

```示例 2：
输入：head = [1,2], pos = 0
输出：返回索引为 0 的链表节点
解释：链表中有一个环，其尾部连接到第一个节点。
```

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist_test3.png)

```示例 3：
输入：head = [1], pos = -1
输出：返回 null
解释：链表中没有环。
```

**提示：**

- 链表中节点的数目范围在范围 `[0, 104]` 内
- `-105 <= Node.val <= 105`
- `pos` 的值为 `-1` 或者链表中的一个有效索引



解题思路

```
1.快慢指针，相遇后，head->入环的第一个节点距离=相遇点->入环的第一个节点距离
2.借助哈希（Set）
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-04 19:03:31
 * Description: 142-Linked List Cycle II
 **/
 
package com.weitrue.leetcode.editor.cn;

public class LinkedListCycleIi{
    public static void main(String[] args){
        Solution s = new LinkedListCycleIi().new Solution();
    }
    
    //Given a linked list, return the node where the cycle begins. If there is no cy
    //cle, return null.
    //
    // There is a cycle in a linked list if there is some node in the list that can
    //be reached again by continuously following the next pointer. Internally, pos is
    //used to denote the index of the node that tail's next pointer is connected to. N
    //ote that pos is not passed as a parameter.
    //
    // Notice that you should not modify the linked list.
    //
    // Example 1:
    //Input: head = [3,2,0,-4], pos = 1
    //Output: tail connects to node index 1
    //Explanation: There is a cycle in the linked list, where tail connects to the s
    //econd node.
    //
    // Example 2:
    //Input: head = [1,2], pos = 0
    //Output: tail connects to node index 0
    //Explanation: There is a cycle in the linked list, where tail connects to the f
    //irst node.
    //
    // Example 3:
    //Input: head = [1], pos = -1
    //Output: no cycle
    //Explanation: There is no cycle in the linked list.
    //
    // Constraints:
    // The number of the nodes in the list is in the range [0, 104].
    // -105 <= Node.val <= 105
    // pos is -1 or a valid index in the linked-list.
    //
    // Follow up: Can you solve it using O(1) (i.e. constant) memory?
    // Related Topics 链表 双指针
    // 👍 897 👎 0
 
    // leetcode submit region begin(Prohibit modification and deletion)
     class ListNode {
         int val;
         ListNode next;
         ListNode(int x) {
             val = x;
             next = null;
         }
     }

    public class Solution {
        public ListNode detectCycle(ListNode head) {
            if(head == null || head.next == null){
                return null;
            }
            ListNode p = head, q = head;
            do {
                p = p.next;
                q = q.next.next;
            } while (q != null && q.next != null && p != q);
            if (p != q) {
                return null;
            }
            q = head;
            while (p != q) {
                p = p.next;
                q = q.next;
            }
            return q;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}

```

`Golang`

```golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 11:14:26
 * Description:
 **/
//Given a linked list, return the node where the cycle begins. If there is no cy
//cle, return null. 
//
// There is a cycle in a linked list if there is some node in the list that can 
//be reached again by continuously following the next pointer. Internally, pos is 
//used to denote the index of the node that tail's next pointer is connected to. N
//ote that pos is not passed as a parameter. 
//
// Notice that you should not modify the linked list. 
//
// Example 1: 
//Input: head = [3,2,0,-4], pos = 1
//Output: tail connects to node index 1
//Explanation: There is a cycle in the linked list, where tail connects to the s
//econd node.
// 
// Example 2: 
//Input: head = [1,2], pos = 0
//Output: tail connects to node index 0
//Explanation: There is a cycle in the linked list, where tail connects to the f
//irst node.
// 
// Example 3: 
//Input: head = [1], pos = -1
//Output: no cycle
//Explanation: There is no cycle in the linked list.
// 
// Constraints: 
// The number of the nodes in the list is in the range [0, 104]. 
// -105 <= Node.val <= 105 
// pos is -1 or a valid index in the linked-list. 

// Follow up: Can you solve it using O(1) (i.e. constant) memory? 
// Related Topics 链表 双指针 
// 👍 898 👎 0

//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func detectCycle(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return nil
	}
	p := head.Next
	q := head.Next.Next
	for q != nil && q.Next != nil && p != q{
		q = q.Next.Next
		p = p.Next
	}
	if p != q {
		return nil
	}
	q = head
	for p != q {
		p = p.Next
		q = q.Next
	}
	return q
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 142-环形链表 II
Solution：
Date: 2021-03-05 10:47:28
Author: Wang P
Problem: 给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。
# 
#  为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，po
# s 仅仅是用于标识环的情况，并不会作为参数传递到函数中。 
# 
#  说明：不允许修改给定的链表。 
# 
#  进阶：
#  你是否可以使用 O(1) 空间解决此题？ 
#
#  示例 1：
# 输入：head = [3,2,0,-4], pos = 1
# 输出：返回索引为 1 的链表节点
# 解释：链表中有一个环，其尾部连接到第二个节点。
#
#  示例 2：
# 输入：head = [1,2], pos = 0
# 输出：返回索引为 0 的链表节点
# 解释：链表中有一个环，其尾部连接到第一个节点。
#
#  示例 3：
# 输入：head = [1], pos = -1
# 输出：返回 null
# 解释：链表中没有环。
#
#  提示：
#  链表中节点的数目范围在范围 [0, 104] 内 
#  -105 <= Node.val <= 105 
#  pos 的值为 -1 或者链表中的一个有效索引 
#  
#  Related Topics 链表 双指针 
#  👍 898 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.
#
#
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None


class Solution:
    def detectCycle(self, head: ListNode) -> ListNode:
        if not head or not head.next:
            return None
        p, q = head.next, head.next.next
        while q and q.next and p != q:
            p = p.next
            q = q.next.next
        if p != q:
            return None
        q = head
        while p != q:
            p = p.next
            q = q.next
        return q
        
# leetcode submit region end(Prohibit modification and deletion)

```

###### [202. 快乐数](https://leetcode-cn.com/problems/happy-number/)

编写一个算法来判断一个数 n 是不是快乐数。

「快乐数」定义为：

对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
如果 可以变为  1，那么这个数就是快乐数。
如果 n 是快乐数就返回 true ；不是，则返回 false 。



解题思路

```
1.链表是否有环问题
```

示例 2：

```
输入：19
输出：true
解释：
12 + 92 = 82
82 + 22 = 68
62 + 82 = 100
12 + 02 + 02 = 1
```

示例 2：

```
输入：n = 2
输出：false

提示：
1 <= n <= 231 - 1
```

`Java`

```java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-04 17:56:08
 * Description:
 **/
package com.weitrue.leetcode.editor.cn;

public class HappyNumber{
    public static void main(String[] args){
        Solution s = new HappyNumber().new Solution();
        int sum = 0;
        for (int i=0; i<=100000; i++) {
            if (s.isHappy(i)) {
                sum++;
            }
        }
        System.out.println(sum);
    }

    //Write an algorithm to determine if a number n is happy.
    //
    // A happy number is a number defined by the following process:
    //
    // Starting with any positive integer, replace the number by the sum of the squares of its digits.
    // Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1.
    // Those numbers for which this process ends in 1 are happy.
    //
    // Return true if n is a happy number, and false if not.
    //
    // Example 1:
    //Input: n = 19
    //Output: true
    //Explanation:
    //12 + 92 = 82
    //82 + 22 = 68
    //62 + 82 = 100
    //12 + 02 + 02 = 1
    //
    // Example 2:
    //Input: n = 2
    //Output: false
    //
    // Constraints:
    //
    // 1 <= n <= 231 - 1
    //
    // Related Topics 哈希表 数学
    // 👍 542 👎 0

    //leetcode submit region begin(Prohibit modification and deletion)
    class Solution {
            public int getNext(int n) {
                int x = 0;
                while(n > 0) {
                    x += (n % 10) * (n % 10);
                    n = n / 10;
                }
                return x;
            }

            public boolean isHappy(int n) {
                int p = n, q = n;
                do{
                    p = getNext(p);
                    q = getNext(getNext(q));
                } while (p != q && q!= 1);
                return q == 1;
            }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}

```

`Golang`

```golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 12:56:41
 * Description: //Write an algorithm to determine if a number n is happy.
				//
				// A happy number is a number defined by the following process:
				//
				// Starting with any positive integer, replace the number by the sum of the squa
				//res of its digits.
				// Repeat the process until the number equals 1 (where it will stay), or it loop
				//s endlessly in a cycle which does not include 1.
				// Those numbers for which this process ends in 1 are happy.
				//
				// Return true if n is a happy number, and false if not.
				//
				// Example 1:
				//Input: n = 19
				//Output: true
				//Explanation:
				//12 + 92 = 82
				//82 + 22 = 68
				//62 + 82 = 100
				//12 + 02 + 02 = 1
				//
				// Example 2:
				//Input: n = 2
				//Output: false
				//
				// Constraints:
				// 1 <= n <= 231 - 1
				//
				// Related Topics 哈希表 数学
				// 👍 547 👎 0
 **/

//leetcode submit region begin(Prohibit modification and deletion)
func IsHappy(n int) bool {
	p, q := getNext(n), getNext(getNext(n))
	for p != q && q != 1 {
		p = getNext(p)
		q = getNext(getNext(q))
	}
	return q == 1
}

func getNext(n int) int {
	x := 0
	for n > 0 {
		x += (n % 10) * (n % 10)
		n = n / 10
	}
	return x
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 202-快乐数
Solution：
Date: 2021-03-05 12:02:33
Author: Wang P
Problem:# 编写一个算法来判断一个数 n 是不是快乐数。 
# 
#  「快乐数」定义为： 
#  对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。 
#  然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。 
#  如果 可以变为 1，那么这个数就是快乐数。 
#  如果 n 是快乐数就返回 true ；不是，则返回 false 。 
# 
#  示例 1： 
# 输入：19
# 输出：true
# 解释：
# 12 + 92 = 82
# 82 + 22 = 68
# 62 + 82 = 100
# 12 + 02 + 02 = 1
#  
#  示例 2： 
# 输入：n = 2
# 输出：false
#  
#  提示： 
#  1 <= n <= 231 - 1 
#  
#  Related Topics 哈希表 数学 
#  👍 548 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
import math


class Solution:
    def isHappy(self, n: int) -> bool:
        p, q = n, self.get_next(n)
        while p != q and q != 1:
            p = self.get_next(p)
            q = self.get_next(self.get_next(q))
        return q == 1

    def get_next(self, n: int) -> int:
        x = 0
        while n:
            n, tmp = divmod(n, 10)
            x += (tmp * tmp)
        return x

# leetcode submit region end(Prohibit modification and deletion)
```

##### 链表反转

###### [206. 反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)

反转一个单链表。

示例:

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

进阶:
你可以迭代或递归地反转链表。你能否用两种方法解决这道题？



解题思路

```
1.通过前驱、后继对链表进行反转
2.递归方式
3.借助栈结构
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 17:30:32
 * Description: 206-Reverse Linked List
 **/
 
package com.weitrue.leetcode.editor.cn;

public class ReverseLinkedList{
    public static void main(String[] args){
        Solution s = new ReverseLinkedList().new Solution();
    }
    
    //Given the head of a singly linked list, reverse the list, and return the reversed list.
    //
    // Example 1:
    //Input: head = [1,2,3,4,5]
    //Output: [5,4,3,2,1]
    //
    // Example 2:
    //Input: head = [1,2]
    //Output: [2,1]
    //
    // Example 3:
    //Input: head = []
    //Output: []
    //
    // Constraints:
    // The number of nodes in the list is the range [0, 5000].
    // -5000 <= Node.val <= 5000
    //
    // Follow up: A linked list can be reversed either iteratively or recursively. C
    //ould you implement both?
    // Related Topics 链表
    // 👍 1568 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    class Solution {
        public ListNode reverseList(ListNode head) {
            ListNode pre = null, cur = head, next = null;
            while (cur != null) {
                next = cur.next;
                cur.next = pre;
                pre = cur;
                cur = next;
            }
            return pre;
        }
    }
//leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 17:46:07
 * Description: //Given the head of a singly linked list, reverse the list, and return the reversed list.
				// Example 1:
				//Input: head = [1,2,3,4,5]
				//Output: [5,4,3,2,1]
				//
				// Example 2:
				//Input: head = [1,2]
				//Output: [2,1]
				//
				// Example 3:
				//Input: head = []
				//Output: []
				//
				// Constraints:
				// The number of nodes in the list is the range [0, 5000].
				// -5000 <= Node.val <= 5000
				//
				// Follow up: A linked list can be reversed either iteratively or recursively. C
				//ould you implement both?
				// Related Topics 链表
				// 👍 1568 👎 0
 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
	Val int
	Next *ListNode
}

func reverseList(head *ListNode) *ListNode {
	var pre, cur, next *ListNode = nil, head, nil
	for cur != nil {
		next = cur.Next
		cur.Next = pre
		pre = cur
		cur = next
	}
	return pre
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 206-反转链表
Solution：
Date: 2021-03-05 17:45:14
Author: Wang P
Problem:# 反转一个单链表。 
        #
        #  示例:
        #
        #  输入: 1->2->3->4->5->NULL
        # 输出: 5->4->3->2->1->NULL
        #
        #  进阶:
        # 你可以迭代或递归地反转链表。你能否用两种方法解决这道题？
        #  Related Topics 链表
        #  👍 1568 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        pre, cur, nex = None, head, None
        while cur:
            nex = cur.next
            cur.next = pre
            pre = cur
            cur = nex
        return pre
# leetcode submit region end(Prohibit modification and deletion)

```

###### [92. 反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/)

反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。

说明:
1 ≤ m ≤ n ≤ 链表长度。

示例:

```
输入: 1->2->3->4->5->NULL, m = 2, n = 4
输出: 1->4->3->2->5->NULL
```



解题思路

```
1.先通过虚拟节点找到链表反转部分的头部
2.从反转部分的头部，反转n-m+1个
3.将反转后的部分拼接上
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 19:05:32
 * Description: 92-Reverse Linked List II
 **/
 
package com.weitrue.leetcode.editor.cn;

public class ReverseLinkedListIi{
    public static void main(String[] args){

        Solution s = new ReverseLinkedListIi().new Solution();
        ListNode n5 = new ReverseLinkedListIi().new ListNode(5, null);
        ListNode n4 = new ReverseLinkedListIi().new ListNode(4, n5);
        ListNode n3 = new ReverseLinkedListIi().new ListNode(3, n4);
        ListNode n2 = new ReverseLinkedListIi().new ListNode(2, n3);
        ListNode n1 = new ReverseLinkedListIi().new ListNode(1, n2);
        ListNode n = s.reverseBetween(n1, 2, 4);
        while (n != null && n.val > 0) {
            System.out.print(n.val);
            System.out.print("->");
            n = n.next;
        }
    }
    
    //Given the head of a singly linked list and two integers left and right where left <= right,
    // reverse the nodes of the list from position left to position right, and return the reversed list.
    //
    // Example 1:
    //Input: head = [1,2,3,4,5], left = 2, right = 4
    //Output: [1,4,3,2,5]
    //
    // Example 2:
    //Input: head = [5], left = 1, right = 1
    //Output: [5]
    //
    // Constraints:
    // The number of nodes in the list is n.
    // 1 <= n <= 500
    // -500 <= Node.val <= 500
    // 1 <= left <= right <= n
    //
    //Follow up: Could you do it in one pass? Related Topics 链表
    // 👍 709 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    class Solution {
        public ListNode reverseBetween(ListNode head, int left, int right) {
            // 需要虚拟节点
            ListNode hair = new ListNode(0, head), cur = hair ;
            int n = right - left + 1;
            while (left > 1) {
                cur = cur.next;
                left--;
            }
            cur.next = reverse(cur.next, n);
            return hair.next;
        }

        public ListNode reverse(ListNode head, int x) {
            // 从头节点开始，反转n个节点
            ListNode pre = new ListNode(0), cur = head, next = null;
            while (x > 0) {
                next = cur.next;
                cur.next = pre.next;
                pre.next = cur;
                cur = next;
                x--;
            }
            head.next = cur;
            return pre.next;
        }
      
      	public ListNode reverseN(ListNode head, int n) {
            // 递归方式
            if (n == 1) {
                return head;
            }
            ListNode tail = head.next, p = reverseN(head.next, n-1);
            head.next = tail.next;
            tail.next = head;
            return p;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
package leetcode

/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 19:07:45
 * Description: //Given the head of a singly linked list and two integers left and right where left <= right, reverse
                //the nodes of the list from position left to position right, and return the reversed list.
				//
				// Example 1:
				//Input: head = [1,2,3,4,5], left = 2, right = 4
				//Output: [1,4,3,2,5]
				//
				// Example 2:
				//Input: head = [5], left = 1, right = 1
				//Output: [5]
				//
				// Constraints:
				// The number of nodes in the list is n.
				// 1 <= n <= 500
				// -500 <= Node.val <= 500
				// 1 <= left <= right <= n
				//Follow up: Could you do it in one pass? Related Topics 链表
				// 👍 709 👎 0

 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
	Val int
	Next *ListNode
}

func reverseBetween(head *ListNode, left int, right int) *ListNode {
	hair := &ListNode{Next:head}
	cur := hair
	n := right - left + 1
	for left > 1 {
		cur = cur.Next
		left--
	}
	cur.Next = reverse(cur.Next, n)
	return hair.Next
}

func reverse(head *ListNode, n int) *ListNode {
	pre, next := &ListNode{}, &ListNode{}
	cur := head

	for n > 0 {
		next = cur.Next
		cur.Next = pre.Next
		pre.Next = cur
		cur = next
		n--
	}
	head.Next = cur
	return pre.Next
}

//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 92-反转链表 II
Solution：
Date: 2021-03-05 19:06:58
Author: Wang P
Problem:# 反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。 
        #
        #  说明:
        # 1 ≤ m ≤ n ≤ 链表长度。
        #
        #  示例:
        #
        #  输入: 1->2->3->4->5->NULL, m = 2, n = 4
        # 输出: 1->4->3->2->5->NULL
        #  Related Topics 链表
        #  👍 709 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.

# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next


class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        cur = hair = ListNode(next=head)
        n = right - left + 1
        while left > 1:
            cur = cur.next
            left -= 1

        cur.next = self.reverse(cur.next, n)
        return hair.next

    def reverse(self, head: ListNode, n: int) -> ListNode:
        if not head:
            return None

        pre, cur, nex = ListNode(), head, None
        while n > 0:
            nex = cur.next
            cur.next = pre.next
            pre.next = cur
            cur = nex
            n -= 1
        head.next = cur
        return pre.next
# leetcode submit region end(Prohibit modification and deletion)
```

###### [25. K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/)

给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。

k 是一个正整数，它的值小于或等于链表的长度。

如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

进阶：

你可以设计一个只使用常数额外空间的算法来解决此问题吗？
你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

**示例 1**：

![](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex1.jpg)

```
输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/03/reverse_ex2.jpg)

```
输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
```

**示例 3：**

```
输入：head = [1,2,3,4,5], k = 1
输出：[1,2,3,4,5]
```

**示例 4：**

```
输入：head = [1], k = 1
输出：[1]
```

**提示：**

- 列表中节点的数量在范围 `sz` 内
- `1 <= sz <= 5000`
- `0 <= Node.val <= 1000`
- `1 <= k <= sz`



解题思路

```
将链表分成sz%k链表进行反转，然后拼接末尾部分
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 17:42:34
 * Description: 25-Reverse Nodes in k-Group
 **/
 
package com.weitrue.leetcode.editor.cn;

public class ReverseNodesInKGroup{
    public static void main(String[] args){
        Solution s = new ReverseNodesInKGroup().new Solution();
    }
    
    //Given a linked list, reverse the nodes of a linked list k at a time and return its modified list. 
    //k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is. 
    // Follow up: 
    // Could you solve the problem in O(1) extra memory space? 
    // You may not alter the values in the list's nodes, only nodes itself may be changed. 
 
    // Example 1: 
    //Input: head = [1,2,3,4,5], k = 2
    //Output: [2,1,4,3,5]

    // Example 2: 
    //Input: head = [1,2,3,4,5], k = 3
    //Output: [3,2,1,4,5]

    // Example 3: 
    //Input: head = [1,2,3,4,5], k = 1
    //Output: [1,2,3,4,5]

    // Example 4: 
    //Input: head = [1], k = 1
    //Output: [1]

    // Constraints: 
    // The number of nodes in the list is in the range sz. 
    // 1 <= sz <= 5000 
    // 0 <= Node.val <= 1000 
    // 1 <= k <= sz 
    // 
    // Related Topics 链表 
    // 👍 977 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    class Solution {
        public ListNode reverseKGroup(ListNode head, int k) {
            ListNode hair = new ListNode(0, head), pre = hair, tail = pre;
            while (head != null) {
                //tail = pre;
                for (int i=0; i<k; i++) {
                    tail = tail.next;
                    if (tail == null) {
                        return hair.next;
                    }
                }
                // 反转长度为k的链表，并返回链表的新头尾节点
                ListNode[] ln = reverse(head, tail);
                head = ln[0];
                tail = ln[1];
                pre.next = head;
                pre = tail;
                head = pre.next;
            }

            return hair.next;
        }

        public ListNode[] reverse(ListNode head, ListNode tail){
            ListNode pre = tail.next, cur = head, next = null;

            while (tail != pre) {
                next = cur.next;
                cur.next = pre;
                pre = cur;
                cur = next;
            }

            return new ListNode[]{tail, head};
        }
    }
//leetcode submit region end(Prohibit modification and deletion)
}
```

`Golang`

```Golang
package leetcode

/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-18 18:38:00
 * Description: //Given a linked list, reverse the nodes of a linked list k at a time and return its modified list.
				// k is a positive integer and is less than or equal to the length of the linked
				// list. If the number of nodes is not a multiple of k then left-out nodes, in the
				// end, should remain as it is.
				// Follow up:
				// Could you solve the problem in O(1) extra memory space?
				// You may not alter the values in the list's nodes, only nodes itself may be changed.
				//
				// Example 1:
				//Input: head = [1,2,3,4,5], k = 2
				//Output: [2,1,4,3,5]
				//
				// Example 2:
				//Input: head = [1,2,3,4,5], k = 3
				//Output: [3,2,1,4,5]
				//
				// Example 3:
				//Input: head = [1,2,3,4,5], k = 1
				//Output: [1,2,3,4,5]
				//
				// Example 4:
				//Input: head = [1], k = 1
				//Output: [1]
				//
				// Constraints:
				// The number of nodes in the list is in the range sz.
				// 1 <= sz <= 5000
				// 0 <= Node.val <= 1000
				// 1 <= k <= sz
				// Related Topics 链表
				// 👍 977 👎 0

 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
    Val int
    Next *ListNode
}

func reverseKGroup(head *ListNode, k int) *ListNode {
	hair := &ListNode{Next:head}
	pre, tail := hair, hair
	for head != nil {
		for i := 0; i < k; i++ {
			tail = tail.Next
			if tail == nil {
				return hair.Next
			}
		}

		head, tail = reverseK(head, tail)
		pre.Next = head
		pre = tail
		head = pre.Next
	}
	return hair.Next
}

func reverseK(head, tail *ListNode) (*ListNode, *ListNode) {

	pre, cur, next := tail.Next, head, &ListNode{}
	for pre != tail {
		next = cur.Next
		cur.Next = pre
		pre = cur
		cur = next
	}

	return tail, head
}
//leetcode submit region end(Prohibit modification and deletion)
```

`Python`

```Python
"""
Module Description: 25-K 个一组翻转链表
Solution：
Date: 2021-03-06 18:15:19
Author: Wang P
Problem:# 给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。 
        #  k 是一个正整数，它的值小于或等于链表的长度。
        #  如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。
        #  进阶：
        #  你可以设计一个只使用常数额外空间的算法来解决此问题吗？
        #  你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。
        #
        #  示例 1：
        # 输入：head = [1,2,3,4,5], k = 2
        # 输出：[2,1,4,3,5]
        #
        #  示例 2：
        # 输入：head = [1,2,3,4,5], k = 3
        # 输出：[3,2,1,4,5]
        #
        #  示例 3：
        # 输入：head = [1,2,3,4,5], k = 1
        # 输出：[1,2,3,4,5]
        #
        #  示例 4：
        # 输入：head = [1], k = 1
        # 输出：[1]
        #
        #  提示：
        #  列表中节点的数量在范围 sz 内
        #  1 <= sz <= 5000
        #  0 <= Node.val <= 1000
        #  1 <= k <= sz
        #
        #  Related Topics 链表
        #  👍 977 👎 0
"""

# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        tail = pre = hair = ListNode(next=head)
        while head:
            # tail = pre
            for i in range(0, k):
                tail = tail.next
                if not tail:
                    return hair.next

            head, tail = self.reverse(head, tail)
            pre.next = head
            pre = tail
            head = pre.next

        return hair.next

    def reverse(self, head, tail: ListNode) -> (ListNode, ListNode):
        pre, cur, nex = tail.next, head, None
        while pre != tail:
            nex = cur.next
            cur.next = pre
            pre = cur
            cur = nex

        return tail, head

# leetcode submit region end(Prohibit modification and deletion)
```

###### [61. 旋转链表](https://leetcode-cn.com/problems/rotate-list/)

给定一个链表，旋转链表，将链表每个节点向右移动 *k* 个位置，其中 *k* 是非负数。

**示例 1:**

```
输入: 1->2->3->4->5->NULL, k = 2
输出: 4->5->1->2->3->NULL
解释:
向右旋转 1 步: 5->1->2->3->4->NULL
向右旋转 2 步: 4->5->1->2->3->NULL
```

**示例 2:**

```
输入: 0->1->2->NULL, k = 4
输出: 2->0->1->NULL
解释:
向右旋转 1 步: 2->0->1->NULL
向右旋转 2 步: 1->2->0->NULL
向右旋转 3 步: 0->1->2->NULL
向右旋转 4 步: 2->0->1->NULL
```



解题思路

```
1.先将链表首尾相连并获取链表的长度
2.找到新链表要断开的前一个节点，后继指向null
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:20:15
 * Description: 61-Rotate List
 **/
 
package com.weitrue.leetcode.editor.cn;

public class RotateList{
    public static void main(String[] args){

        Solution s = new RotateList().new Solution();
        ListNode n5 = new RotateList().new ListNode(5, null);
        ListNode n4 = new RotateList().new ListNode(4, n5);
        ListNode n3 = new RotateList().new ListNode(3, n4);
        ListNode n2 = new RotateList().new ListNode(2, n3);
        ListNode n1 = new RotateList().new ListNode(1, n2);
        ListNode n = s.rotateRight(n1, 2);

        while (n != null) {
            System.out.print(n.val);
            System.out.print("->");
            n = n.next;
        }
    }
    
    //Given the head of a linked list, rotate the list to the right by k places. 
    //
    // Example 1:
    //Input: head = [1,2,3,4,5], k = 2
    //Output: [4,5,1,2,3]
    //
    // Example 2:
    //Input: head = [0,1,2], k = 4
    //Output: [2,0,1]
    //
    // Constraints:
    // The number of nodes in the list is in the range [0, 500].
    // -100 <= Node.val <= 100
    // 0 <= k <= 2 * 109
    //
    // Related Topics 链表 双指针
    // 👍 444 👎 0

    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
     public class ListNode {
         int val;
         ListNode next;
         ListNode() {}
         ListNode(int val) { this.val = val; }
         ListNode(int val, ListNode next) { this.val = val; this.next = next; }
     }

    class Solution {
        public ListNode rotateRight(ListNode head, int k) {
            if (head == null || head.next == null) {
                return head;
            }
            int length = 1;
            ListNode oldTail = head;
            while (oldTail.next != null) {
                oldTail = oldTail.next;
                length++;
            }
            oldTail.next = head;
            ListNode newTail = head;
            for (int i = 0; i < length - (k % length) - 1; i++){
                newTail = newTail.next;
            }
            ListNode newHead = newTail.next;
            newTail.next = null;
            return newHead;
        }

    }
    //leetcode submit region end(Prohibit modification and deletion)
}
```

`Golang`

```Golang
package leetcode

/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:26:17
 * Description:  Given the head of a linked list, rotate the list to the right by k places.

				 Example 1:
				Input: head = [1,2,3,4,5], k = 2
				Output: [4,5,1,2,3]

				 Example 2:
				Input: head = [0,1,2], k = 4
				Output: [2,0,1]

				 Constraints:
				 The number of nodes in the list is in the range [0, 500].
				 -100 <= Node.val <= 100
				 0 <= k <= 2 * 109

				 Related Topics 链表 双指针
				 👍 444 👎 0
 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func rotateRight(head *ListNode, k int) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	oldTail := head
	length := 1
	for oldTail.Next != nil {
		oldTail = oldTail.Next
		length++
	}
	oldTail.Next = head
	newTail := head
	for i := 0; i < length - k%length -1; i++ {
		newTail = newTail.Next
	}
	head = newTail.Next
	newTail.Next = nil
	return head
}
//leetcode submit region end(Prohibit modification and deletion)
```

`Python`

```Python
"""
Module Description: 61-旋转链表
Solution：
Date: 2021-03-06 20:23:59
Author: Wang P
Problem:  给定一个链表，旋转链表，将链表每个节点向右移动 k 个位置，其中 k 是非负数。

          示例 1:
          输入: 1->2->3->4->5->NULL, k = 2
         输出: 4->5->1->2->3->NULL
         解释:
         向右旋转 1 步: 5->1->2->3->4->NULL
         向右旋转 2 步: 4->5->1->2->3->NULL

          示例 2:
          输入: 0->1->2->NULL, k = 4
         输出: 2->0->1->NULL
         解释:
         向右旋转 1 步: 2->0->1->NULL
         向右旋转 2 步: 1->2->0->NULL
         向右旋转 3 步: 0->1->2->NULL
         向右旋转 4 步: 2->0->1->NULL
          Related Topics 链表 双指针
          👍 444 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:

    def rotateRight(self, head: ListNode, k: int) -> ListNode:
        if not head or not head.next:
            return head

        old_tail = head
        length = 1
        while old_tail.next:
            old_tail = old_tail.next
            length += 1

        old_tail.next = head

        new_tail = head
        for i in range(0, length - (k % length) - 1):
            new_tail = new_tail.next

        head = new_tail.next
        new_tail.next = None

        return head

# leetcode submit region end(Prohibit modification and deletion)

```

###### [24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)

给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

**你不能只是单纯的改变节点内部的值**，而是需要实际的进行节点交换。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/03/swap_ex1.jpg)

```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**示例 2：**

```
输入：head = []
输出：[]
```

**示例 3：**

```
输入：head = [1]
输出：[1]
```

**提示：**

- 链表中节点的数目在范围 `[0, 100]` 内
- `0 <= Node.val <= 100`

**进阶：**你能在不修改链表节点值的情况下解决这个问题吗?（也就是说，仅修改节点本身。）



解题思路

```
K个一组反转中 K等于2
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:22:33
 * Description: 24-Swap Nodes in Pairs
 **/
 
package com.weitrue.leetcode.editor.cn;

public class SwapNodesInPairs{
    public static void main(String[] args){
        Solution s = new SwapNodesInPairs().new Solution();

    }
    
    //Given a linked list, swap every two adjacent nodes and return its head. 
    //
    // Example 1:
    //Input: head = [1,2,3,4]
    //Output: [2,1,4,3]
    //
    // Example 2:
    //Input: head = []
    //Output: []
    //
    // Example 3:
    //Input: head = [1]
    //Output: [1]
    //
    // Constraints:
    // The number of nodes in the list is in the range [0, 100].
    // 0 <= Node.val <= 100
    //Follow up: Can you solve the problem without modifying the values in the list'
    //s nodes? (i.e., Only nodes themselves may be changed.) Related Topics 递归 链表
    // 👍 859 👎 0

        //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
		public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
     }

    class Solution {
        public ListNode swapPairs(ListNode head) {
            ListNode hair = new ListNode(0, head), pre = hair, tail = pre;
            while (head != null) {
                for (int i=0; i<2; i++) {
                    tail = tail.next;
                    if (tail == null) {
                        return hair.next;
                    }
                }
                // 反转长度为k的链表，并返回链表的新头尾节点
                ListNode[] ln = reverse(head, tail);
                head = ln[0];
                tail = ln[1];
                pre.next = head;
                pre = tail;
                head = pre.next;
            }

            return hair.next;
        }

        public ListNode[] reverse(ListNode head, ListNode tail){
            ListNode pre = tail.next, cur = head, next = null;

            while (tail != pre) {
                next = cur.next;
                cur.next = pre;
                pre = cur;
                cur = next;
            }

            return new ListNode[]{tail, head};
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:26:56
 * Description:  Given a linked list, swap every two adjacent nodes and return its head.

				 Example 1:
				Input: head = [1,2,3,4]
				Output: [2,1,4,3]

				 Example 2:
				Input: head = []
				Output: []

				 Example 3:
				Input: head = [1]
				Output: [1]

				 Constraints:
				 The number of nodes in the list is in the range [0, 100].
				 0 <= Node.val <= 100

				Follow up: Can you solve the problem without modifying the values in the list'
				s nodes? (i.e., Only nodes themselves may be changed.) Related Topics 递归 链表
				 👍 859 👎 0
 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func swapPairs(head *ListNode) *ListNode {
	hair := &ListNode{Next:head}
	pre, tail := hair, hair
	for head != nil {
		for i := 0; i < 2; i++ {
			tail = tail.Next
			if tail == nil {
				return hair.Next
			}
		}

		head, tail = reverseN(head, tail)
		pre.Next = head
		pre = tail
		head = pre.Next
	}
	return hair.Next
}

func reverseN(head, tail *ListNode) (*ListNode, *ListNode) {

	pre, cur, next := tail.Next, head, &ListNode{}
	for pre != tail {
		next = cur.Next
		cur.Next = pre
		pre = cur
		cur = next
	}

	return tail, head
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 24-两两交换链表中的节点
Solution：
Date: 2021-03-06 20:25:15
Author: Wang P
Problem:  给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。
          你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

          示例 1：
         输入：head = [1,2,3,4]
         输出：[2,1,4,3]

          示例 2：
         输入：head = []
         输出：[]

          示例 3：
         输入：head = [1]
         输出：[1]

          提示：
          链表中节点的数目在范围 [0, 100] 内
          0 <= Node.val <= 100
          进阶：你能在不修改链表节点值的情况下解决这个问题吗?（也就是说，仅修改节点本身。）
          Related Topics 递归 链表
          👍 859 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:

    def swapPairs(self, head: ListNode) -> ListNode:
        tail = pre = hair = ListNode(next=head)
        while head:
            # tail = pre
            for i in range(0, 2):
                tail = tail.next
                if not tail:
                    return hair.next

            head, tail = self.reverse(head, tail)
            pre.next = head
            pre = tail
            head = pre.next

        return hair.next

    def reverse(self, head, tail: ListNode) -> (ListNode, ListNode):
        pre, cur, nex = tail.next, head, None
        while pre != tail:
            nex = cur.next
            cur.next = pre
            pre = cur
            cur = nex

        return tail, head
# leetcode submit region end(Prohibit modification and deletion)
```

##### 链表节点删除

###### [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/)

给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

进阶：你能尝试使用一趟扫描实现吗？

示例 1：

```
输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]
```


示例 2：

```
输入：head = [1], n = 1
输出：[]
```

示例 3：

```
输入：head = [1,2], n = 1
输出：[1]
```


提示：

```
链表中结点的数目为 sz
1 <= sz <= 30
0 <= Node.val <= 100
1 <= n <= sz
```



解题思路

```
快慢指针
1.快指针先行N步；
2.慢指针与快指针开始同时走，快指针走到头，慢指针走到第N个节点的前驱
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 12:54:46
 * Description: 19-Remove Nth Node From End of List
 **/
 
package com.weitrue.leetcode.editor.cn;

public class RemoveNthNodeFromEndOfList{
    public static void main(String[] args){
        Solution s = new RemoveNthNodeFromEndOfList().new Solution();
    }
    
    //Given the head of a linked list, remove the nth node from the end of the list 
    //and return its head.
    //
    // Follow up: Could you do this in one pass?
    //
    // Example 1:
    //Input: head = [1,2,3,4,5], n = 2
    //Output: [1,2,3,5]
    //
    // Example 2:
    //Input: head = [1], n = 1
    //Output: []
    //
    // Example 3:
    //Input: head = [1,2], n = 1
    //Output: [1]

    // Constraints:
    // The number of nodes in the list is sz.
    // 1 <= sz <= 30
    // 0 <= Node.val <= 100
    // 1 <= n <= sz
    //
    // Related Topics 链表 双指针
    // 👍 1264 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
     public class ListNode {
         int val;
         ListNode next;
         ListNode() {}
         ListNode(int val) { this.val = val; }
         ListNode(int val, ListNode next) { this.val = val; this.next = next; }
     }

    class Solution {
        public ListNode removeNthFromEnd(ListNode head, int n) {
            ListNode hair = new ListNode(0, head), fast = head, slow = hair;
            while (n > 0){
                fast = fast.next;
                n--;
            }

            while (fast != null) {
                fast = fast.next;
                slow = slow.next;
            }
            slow.next = slow.next.next;
            return hair.next;
        }
}
//leetcode submit region end(Prohibit modification and deletion)

}

```

`Golang`

```Golang
package leetcode

/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 13:43:33
 * Description:
 **/
//Given the head of a linked list, remove the nth node from the end of the list 
//and return its head. 
//
// Follow up: Could you do this in one pass? 
//
// Example 1:
//Input: head = [1,2,3,4,5], n = 2
//Output: [1,2,3,5]
//
// Example 2:
//Input: head = [1], n = 1
//Output: []
//
// Example 3:
//Input: head = [1,2], n = 1
//Output: [1]

// Constraints:
// The number of nodes in the list is sz. 
// 1 <= sz <= 30 
// 0 <= Node.val <= 100 
// 1 <= n <= sz 
// 
// Related Topics 链表 双指针 
// 👍 1264 👎 0

//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
	Val int
	Next *ListNode
}


func removeNthFromEnd(head *ListNode, n int) *ListNode {
	hair := &ListNode{Next:head}
	fast, slow := head, hair
	for n > 0 {
		fast = fast.Next
		n--
	}
	for fast != nil {
		fast = fast.Next
		slow = slow.Next
	}
	slow.Next = slow.Next.Next
	return hair.Next
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 19-删除链表的倒数第 N 个结点
Solution：
Date: 2021-03-05 13:39:13
Author: Wang P
Problem:# 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。 
        #
        #  进阶：你能尝试使用一趟扫描实现吗？

        #  示例 1：
        # 输入：head = [1,2,3,4,5], n = 2
        # 输出：[1,2,3,5]
        #
        #  示例 2：
        # 输入：head = [1], n = 1
        # 输出：[]
        #
        #  示例 3：
        # 输入：head = [1,2], n = 1
        # 输出：[1]
        #
        #  提示：
        #  链表中结点的数目为 sz
        #  1 <= sz <= 30
        #  0 <= Node.val <= 100
        #  1 <= n <= sz
        #
        #  Related Topics 链表 双指针
        #  👍 1264 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        hair = ListNode(next=head)
        slow, fast = hair, head;
        while n > 0:
            fast = fast.next
            n -= 1

        while fast:
            fast = fast.next
            slow = slow.next

        slow.next = slow.next.next
        return hair.next
# leetcode submit region end(Prohibit modification and deletion)

```

###### [83. 删除排序链表中的重复元素](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/)

给定一个**排序**链表，删除所有重复的元素，使得每个元素只出现一次。

示例 1:

```
输入: 1->1->2
输出: 1->2
```

示例 2:

```
输入: 1->1->2->3->3
输出: 1->2->3
```



解题思路

```
排序链表
某节点与下一个节点值相等则删除
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 13:48:45
 * Description: 83-Remove Duplicates from Sorted List
 **/
 
package com.weitrue.leetcode.editor.cn;

public class RemoveDuplicatesFromSortedList{
    public static void main(String[] args){
        Solution s = new RemoveDuplicatesFromSortedList().new Solution();
    }
    
    //Given the head of a sorted linked list, delete all duplicates such that each e
    //lement appears only once. Return the linked list sorted as well. 

    // Example 1: 
    //Input: head = [1,1,2]
    //Output: [1,2]

    // Example 2: 
    //Input: head = [1,1,2,3,3]
    //Output: [1,2,3]

    // Constraints: 
    // The number of nodes in the list is in the range [0, 300]. 
    // -100 <= Node.val <= 100 
    // The list is guaranteed to be sorted in ascending order. 
    // 
    // Related Topics 链表 
    // 👍 488 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    class Solution {
        public ListNode deleteDuplicates(ListNode head) {
            if(head == null) {
                return null;
            }
            ListNode fast = head.next, slow = head;
            while (fast != null) {
                if (fast.val == slow.val) {
                    slow.next = fast.next;
                    fast = slow.next;
                }else {
                    fast = fast.next;
                    slow = slow.next;
                }
            }
            return head;
        }
}
//leetcode submit region end(Prohibit modification and deletion)

}

```

`Golang`

```Golang
package leetcode

/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 13:50:35
 * Description: //Given the head of a sorted linked list, delete all duplicates such that each e
				//lement appears only once. Return the linked list sorted as well.
				//
				// Example 1:
				//Input: head = [1,1,2]
				//Output: [1,2]
				//
				// Example 2:
				//Input: head = [1,1,2,3,3]
				//Output: [1,2,3]
				//
				// Constraints:
				// The number of nodes in the list is in the range [0, 300].
				// -100 <= Node.val <= 100
				// The list is guaranteed to be sorted in ascending order.
				//
				// Related Topics 链表
				// 👍 488 👎 0
 **/


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
	Val int
	Next *ListNode
}

func deleteDuplicates(head *ListNode) *ListNode {
	cur := head
	for cur != nil && cur.Next != nil {
		if cur.Val == cur.Next.Val {
			cur.Next = cur.Next.Next
		}else {
			cur = cur.Next
		}
	}
	return head
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 83-删除排序链表中的重复元素
Solution：
Date: 2021-03-05 13:50:26
Author: Wang P
Problem:# 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。 
        #
        #  示例 1:
        #
        #  输入: 1->1->2
        # 输出: 1->2
        #
        #
        #  示例 2:
        #
        #  输入: 1->1->2->3->3
        # 输出: 1->2->3
        #  Related Topics 链表
        #  👍 488 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        if not head:
            return None
        fast, slow = head.next, head

        while fast:
            if fast.val == slow.val:
                slow.next = fast.next
                fast = slow.next
            else:
                fast = fast.next
                slow = slow.next

        return head
# leetcode submit region end(Prohibit modification and deletion)

```

###### [82. 删除排序链表中的重复元素 II](https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list-ii/)

给定一个排序链表，删除所有含有重复数字的节点，只保留原始链表中 *没有重复出现* 的数字。

**示例 1:**

```
输入: 1->2->3->3->4->4->5
输出: 1->2->5
```

**示例 2:**

```
输入: 1->1->1->2->3
输出: 2->3
```



解题思路

```

```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 13:50:14
 * Description: 82-Remove Duplicates from Sorted List II
 **/
 
package com.weitrue.leetcode.editor.cn;

public class RemoveDuplicatesFromSortedListIi{
    public static void main(String[] args){
        Solution s = new RemoveDuplicatesFromSortedListIi().new Solution();
    }
    
    //Given the head of a sorted linked list, delete all nodes that have duplicate numbers, 
    //leaving only distinct numbers from the original list. Return the linked
    //list sorted as well.
    //
    // Example 1:
    //Input: head = [1,2,3,3,4,4,5]
    //Output: [1,2,5]
    //
    // Example 2:
    //Input: head = [1,1,1,2,3]
    //Output: [2,3]
    //
    // Constraints:
    // The number of nodes in the list is in the range [0, 300].
    // -100 <= Node.val <= 100
    // The list is guaranteed to be sorted in ascending order.
    //
    // Related Topics 链表
    // 👍 469 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
    }

    class Solution {
        public ListNode deleteDuplicates(ListNode head) {
            ListNode hair = new ListNode(0, head), fast = head, slow = hair;
            while (fast != null) {
                while (fast.next != null && fast.val == fast.next.val) {
                    fast = fast.next;
                }
                if (slow.next == fast) {
                    slow = slow.next;
                }else {
                    slow.next = fast.next;
                }
                fast = fast.next;
            }
            return hair.next;
        }
    }
//leetcode submit region end(Prohibit modification and deletion)

}

```

`Golang`

```Golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-05 13:50:38
 * Description: //Given the head of a sorted linked list, delete all nodes that have duplicate n
				//umbers, leaving only distinct numbers from the original list. Return the linked
				//list sorted as well.
				// Example 1:
				//Input: head = [1,2,3,3,4,4,5]
				//Output: [1,2,5]
				//
				// Example 2:
				//Input: head = [1,1,1,2,3]
				//Output: [2,3]
				//
				// Constraints:
				// The number of nodes in the list is in the range [0, 300].
				// -100 <= Node.val <= 100
				// The list is guaranteed to be sorted in ascending order.
				//
				// Related Topics 链表
				// 👍 469 👎 0
 **/

//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 */
type ListNode struct {
	Val int
	Next *ListNode
}

func deleteDuplicates(head *ListNode) *ListNode {
		hair := &ListNode{Next: head}
		fast, slow := head, hair
		for fast != nil {
			for fast.Next != nil && fast.Val == fast.Next.Val {
				fast = fast.Next
			}
			if slow.Next == fast{
				slow = slow.Next
			} else {
				slow.Next = fast.Next
			}
			fast = fast.Next
		}
		return hair.Next
}
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 82-删除排序链表中的重复元素 II
Solution：
Date: 2021-03-05 13:50:50
Author: Wang P
Problem:# 给定一个排序链表，删除所有含有重复数字的节点，只保留原始链表中 没有重复出现 的数字。
        #  示例 1:
        #  输入: 1->2->3->3->4->4->5
        # 输出: 1->2->5
        #  示例 2:
        #  输入: 1->1->1->2->3
        # 输出: 2->3
        #  Related Topics 链表
        #  👍 469 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def deleteDuplicates(self, head: ListNode) -> ListNode:
        hair, fast = ListNode(next=head), head
        slow = hair
        while fast:
            while fast.next and fast.val == fast.next.val:
                fast = fast.next
            if slow.next == fast:
                slow = slow.next
            else:
                slow.next = fast.next
            fast = fast.next

        return hair.next
# leetcode submit region end(Prohibit modification and deletion)

```

##### 经典面试题

###### [86. 分隔链表](https://leetcode-cn.com/problems/partition-list/)

给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。

你应当 保留 两个分区中每个节点的初始相对位置。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/04/partition.jpg)

```
输入：head = [1,4,3,2,5,2], x = 3
输出：[1,2,2,4,3,5]
```

**示例 2：**

```
输入：head = [2,1], x = 2
输出：[1,2]
```

**提示：**

- 链表中节点的数目在范围 `[0, 200]` 内
- `-100 <= Node.val <= 100`
- `-200 <= x <= 200`



解题思路

```
准备两个虚拟头指针 一个用于连接小于 x 的节点，一个用于连接大于或等于x的节点，然后将两个链表连接即可
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:29:46
 * Description: 86-Partition List
 **/
 
package com.weitrue.leetcode.editor.cn;

public class PartitionList{
    public static void main(String[] args){
        Solution s = new PartitionList().new Solution();
    }
    
    // Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.
    // You should preserve the original relative order of the nodes in each of the two partitions.
    //
    // Example 1:
    //Input: head = [1,4,3,2,5,2], x = 3
    //Output: [1,2,2,4,3,5]
    //
    // Example 2:
    //Input: head = [2,1], x = 2
    //Output: [1,2]
    //
    // Constraints:
    // The number of nodes in the list is in the range [0, 200].
    // -100 <= Node.val <= 100
    // -200 <= x <= 200
    //
    // Related Topics 链表 双指针
    // 👍 378 👎 0

    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for singly-linked list.
     */
    public class ListNode {
        int val;
        ListNode next;
        ListNode() {}
        ListNode(int val) { this.val = val; }
        ListNode(int val, ListNode next) { this.val = val; this.next = next; }
     }

    class Solution {
        public ListNode partition(ListNode head, int x) {
            ListNode less = new ListNode(0, head), greater = new ListNode(0, head);
            ListNode curLess = less, curGreater = greater;
            while (head != null) {
                if (head.val < x) {
                    curLess.next = head;
                    curLess = curLess.next;
                } else {
                    curGreater.next = head;
                    curGreater = curGreater.next;
                }
                head = head.next;
            }
            curGreater.next = null;
            curLess.next = greater.next;
            return less.next;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:37:43
 * Description: Given the head of a linked list and a value x, partition it such that all nodes less than x come before nodes greater than or equal to x.
				You should preserve the original relative order of the nodes in each of the two partitions.
				Example 1:
				Input: head = [1,4,3,2,5,2], x = 3
				Output: [1,2,2,4,3,5]

				Example 2:
				Input: head = [2,1], x = 2
				Output: [1,2]

				Constraints:
				 The number of nodes in the list is in the range [0, 200].
				 -100 <= Node.val <= 100
				 -200 <= x <= 200

				 Related Topics 链表 双指针
				 👍 378 👎 0
 **/
//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

func partition(head *ListNode, x int) *ListNode {
	lesser, greater := &ListNode{Next:head}, &ListNode{Next:head}
	less, great := lesser, greater
	for head != nil {
		if head.Val < x {
			less.Next = head
			less = less.Next
		} else {
			great.Next = head
			great = great.Next
		}
		head = head.Next
	}
	great.Next = nil
	less.Next = greater.Next

	return lesser.Next
}
//leetcode submit region end(Prohibit modification and deletion)
```

`Python`

```Python
"""
Module Description: 86-分隔链表
Solution：
Date: 2021-03-06 20:33:40
Author: Wang P
Problem:  给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。
          你应当 保留 两个分区中每个节点的初始相对位置。

          示例 1：
         输入：head = [1,4,3,2,5,2], x = 3
         输出：[1,2,2,4,3,5]

          示例 2：
         输入：head = [2,1], x = 2
         输出：[1,2]

          提示：
          链表中节点的数目在范围 [0, 200] 内
          -100 <= Node.val <= 100
          -200 <= x <= 200

          Related Topics 链表 双指针
          👍 378 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for singly-linked list.


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:

    def partition(self, head: ListNode, x: int) -> ListNode:
        lesser, greater = ListNode(next=head), ListNode(next=head)
        less, great = lesser, greater
        while head:
            if head.val < x:
                less.next = head
                less = less.next
            else:
                great.next = head
                great = great.next

            head = head.next

        great.next = None
        less.next = greater.next

        return lesser.next

# leetcode submit region end(Prohibit modification and deletion)

```



###### [138. 复制带随机指针的链表](https://leetcode-cn.com/problems/copy-list-with-random-pointer/)

给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。

构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random 指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。**复制链表中的指针都不应指向原链表中的节点 。**

例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random --> y 。

返回复制链表的头节点。

用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：

val：一个表示 Node.val 的整数。
random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为  null 。
你的代码 只 接受原链表的头节点 head 作为传入参数。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e1.png)

```
输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]
```

**示例 2：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e2.png)

```
输入：head = [[1,1],[2,1]]
输出：[[1,1],[2,1]]
```

**示例 3：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/01/09/e3.png)

**示例 4：**

```
输入：head = []
输出：[]
解释：给定的链表为空（空指针），因此返回 null。
```

**提示：**

- `0 <= n <= 1000`
- `-10000 <= Node.val <= 10000`
- `Node.random` 为空（null）或指向链表中的节点。



解题思路

```
三轮：
1.原始链表每个节点后插入该节点的复制节点（1->2->3 => 1->1'->2->2'->3-3'）
2.修正新节点的random值
3.将1->1'->2->2'->3-3'拆分成1->2->3  1'->2'->3'
```

`Java`

```Java
/*
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-06 20:31:24
 * Description: 138-Copy List with Random Pointer
 **/
 
package com.weitrue.leetcode.editor.cn;

public class CopyListWithRandomPointer{
    public static void main(String[] args){
        Solution s = new CopyListWithRandomPointer().new Solution();
    }
    
    //A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.
    //
    // Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corre
    //sponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original li
    //st and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.
    //
    // For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.
    //
    // Return the head of the copied linked list.
    //
    // The linked list is represented in the input/output as a list of n nodes. Each node is represented as a pair of [val, random_index] where:
    //
    // val: an integer representing Node.val
    // random_index: the index of the node (range from 0 to n-1) that the random pointer points to, or null if it does not point to any node.
    //
    // Your code will only be given the head of the original linked list.
    //
    // Example 1:
    //Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
    //Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]
    //
    // Example 2:
    //Input: head = [[1,1],[2,1]]
    //Output: [[1,1],[2,1]]
    //
    // Example 3:
    //Input: head = [[3,null],[3,0],[3,null]]
    //Output: [[3,null],[3,0],[3,null]]
    //
    // Example 4:
    //Input: head = []
    //Output: []
    //Explanation: The given linked list is empty (null pointer), so return null.
    //
    // Constraints:
    // 0 <= n <= 1000
    // -10000 <= Node.val <= 10000
    // Node.random is null or is pointing to some node in the linked list.
    //
    // Related Topics 哈希表 链表
    // 👍 519 👎 0

    //leetcode submit region begin(Prohibit modification and deletion)
    /*
    // Definition for a Node.

    */
    class Node {
        int val;
        Node next;
        Node random;

        public Node(int val) {
            this.val = val;
            this.next = null;
            this.random = null;
        }
    }

    class Solution {
        public Node copyRandomList(Node head) {
            if (head ==  null) {
                return null;
            }
            Node cur = head;
            while (cur != null) {
                Node n = new Node(cur.val);
                n.next = cur.next;
                cur.next = n;
                cur = n.next;
            }

            cur = head;
            while (cur != null) {
                cur.next.random = (cur.random != null) ? cur.random.next : null;
                cur = cur.next.next;
            }
            cur = head;
            Node newNode = head.next, next = newNode;

            while (cur != null) {
                cur.next = cur.next.next;
                next.next = next.next != null ? next.next.next: null;
                cur = cur.next;
                next = next.next;
            }
            return newNode;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
package leetcode
/**
 * Author: Wang P
 * Version: 1.0.0
 * Date: 2021-03-18 20:37:49
 * Description: A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.

				Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corre
				sponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original li
				st and copied list represent the same list state. None of the pointers in the new list should point to nodes in the original list.

				For example, if there are two nodes X and Y in the original list, where X.random --> Y, then for the corresponding two nodes x and y in the copied list, x.random --> y.

				Return the head of the copied linked list.

				The linked list is represented in the input/output as a list of n nodes. Each node is represented as a pair of [val, random_index] where:

				val: an integer representing Node.val
				random_index: the index of the node (range from 0 to n-1) that the random pointer points to, or null if it does not point to any node.

				Your code will only be given the head of the original linked list.

				Example 1:
				Input: head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
				Output: [[7,null],[13,0],[11,4],[10,2],[1,0]]

				Example 2:
				Input: head = [[1,1],[2,1]]
				Output: [[1,1],[2,1]]

				Example 3:
				Input: head = [[3,null],[3,0],[3,null]]
				Output: [[3,null],[3,0],[3,null]]

				Example 4:
				Input: head = []
				Output: []
				Explanation: The given linked list is empty (null pointer), so return null.

				Constraints:
				0 <= n <= 1000
				-10000 <= Node.val <= 10000
				Node.random is null or is pointing to some node in the linked list.

				Related Topics 哈希表 链表
				👍 519 👎 0
 **/


//leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for a Node.
 */
type Node struct {
	Val int
   Next *Node
   Random *Node
}


func copyRandomList(head *Node) *Node {
	if head == nil {
		return nil
	}
	cur := head
	for cur != nil {
		n := &Node{Val:cur.Val, Next:cur.Next}
		cur.Next = n
		cur = n.Next
	}
  
	cur = head
	for cur != nil && cur.Next != nil {
		if cur.Random != nil {
			cur.Next.Random = cur.Random.Next
		}else {
			cur.Next.Random = nil
		}
		cur = cur.Next.Next
	}
  
	cur = head
	newNode, next := head.Next, head.Next
	for cur != nil && cur.Next != nil {
		cur.Next = cur.Next.Next
		if next.Next != nil {
			next.Next = next.Next.Next
		}else {
			next.Next = nil
		}
		cur = cur.Next
		next = next.Next
	}
	return newNode
}
//leetcode submit region end(Prohibit modification and deletion)
```

`Python`

```Python
"""
Module Description: 138-复制带随机指针的链表
Solution：
Date: 2021-03-06 20:33:56
Author: Wang P
Problem:  给你一个长度为 n 的链表，每个节点包含一个额外增加的随机指针 random ，该指针可以指向链表中的任何节点或空节点。
          构造这个链表的 深拷贝。 深拷贝应该正好由 n 个 全新 节点组成，其中每个新节点的值都设为其对应的原节点的值。新节点的 next 指针和 random
         指针也都应指向复制链表中的新节点，并使原链表和复制链表中的这些指针能够表示相同的链表状态。复制链表中的指针都不应指向原链表中的节点 。
          例如，如果原链表中有 X 和 Y 两个节点，其中 X.random --> Y 。那么在复制链表中对应的两个节点 x 和 y ，同样有 x.random--> y 。
          返回复制链表的头节点。
          用一个由 n 个节点组成的链表来表示输入/输出中的链表。每个节点用一个 [val, random_index] 表示：
          val：一个表示 Node.val 的整数。
          random_index：随机指针指向的节点索引（范围从 0 到 n-1）；如果不指向任何节点，则为 null 。
          你的代码 只 接受原链表的头节点 head 作为传入参数。

          示例 1：
         输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
         输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]

          示例 2：
         输入：head = [[1,1],[2,1]]
         输出：[[1,1],[2,1]]

          示例 3：
         输入：head = [[3,null],[3,0],[3,null]]
         输出：[[3,null],[3,0],[3,null]]

          示例 4：

         输入：head = []
         输出：[]
         解释：给定的链表为空（空指针），因此返回 null。

          提示：
          0 <= n <= 1000
          -10000 <= Node.val <= 10000
          Node.random 为空（null）或指向链表中的节点。

          Related Topics 哈希表 链表
          👍 519 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
"""
# Definition for a Node.
"""


# class Node:
#     def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
#         self.val = int(x)
#         self.next = next
#         self.random = random


class Solution:
    def copyRandomList(self, head: 'Node') -> 'Node':
        if not head:
            return None

        cur = head
        while cur:
            n = Node(x=cur.val, next=cur.next)
            cur.next = n
            cur = n.next

        cur = head
        while cur and cur.next:
            cur.next.random = cur.random.next if cur.random else None
            cur = cur.next.next

        cur = head
        new_node = nex = head.next
        while cur and nex:
            cur.next = cur.next.next
            nex.next = nex.next.next if nex.next else None
            cur = cur.next
            nex = nex.next

        return new_node
        
# leetcode submit region end(Prohibit modification and deletion)
```

#### 线程池与任务队列

##### 简单队列设计

```Java

```

```go
package array

type Queue []interface {}

func (q *Queue)push(v interface{}) error {
  // 入队
	*q = append(*q, v)
	return nil
}

func (q *Queue)pop() (interface{}, bool) {
  // 出队
	if q.isEmpty() {
		return nil, false
	}
	head := (*q)[0]
	*q = (*q)[1:]
	return head, true
}

func (q *Queue)isEmpty() bool {
  // 队列判空
	return len(*q) == 0
}
```

```Python

```

###### [622. 设计循环队列](https://leetcode-cn.com/problems/design-circular-queue/)

设计你的循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。

循环队列的一个好处是我们可以利用这个队列之前用过的空间。在一个普通队列里，一旦一个队列满了，我们就不能插入下一个元素，即使在队列前面仍有空间。但是使用循环队列，我们能使用这些空间去存储新的值。

`(tail-front)`

你的实现应该支持如下操作：

- MyCircularQueue(k): 构造器，设置队列长度为 k 。
- Front: 从队首获取元素。如果队列为空，返回 -1 。
- Rear: 获取队尾元素。如果队列为空，返回 -1 。
- enQueue(value): 向循环队列插入一个元素。如果成功插入则返回真。
  deQueue(): 从循环队列中删除一个元素。如果成功删除则返回真。
  isEmpty(): 检查循环队列是否为空。
  isFull(): 检查循环队列是否已满。



解题思路

```
基于数组实现
基于链表实现
```

`Java`

```Java
package com.weitrue.leetcode.editor.cn;

public class DesignCircularQueue{
    public static void main(String[] args){
        Solution s = new DesignCircularQueue().new Solution();
    }
 
    //leetcode submit region begin(Prohibit modification and deletion)
    class MyCircularQueue {
            private int[] queue;
            private int capacity, front, rear, count;

        public MyCircularQueue(int k) {
            queue = new int[k];
            capacity = k;
            count = 0;
            front = 0;
            rear = 0;
        }

        public boolean enQueue(int value) {
            if (isFull()) return false;
            queue[rear++] = value;
            rear %= capacity;
            count++;
            return true;
        }

        public boolean deQueue() {
            if (isEmpty()) return false;
            front = (front + 1) % capacity;
            count--;
            return true;
        }

        public int Front() {
            if (isEmpty()) return -1;
            return queue[front];
        }

        public int Rear() {
            if (isEmpty()) return -1;
            return queue[(rear-1+capacity)%capacity];
        }

        public boolean isEmpty() {
            return count == 0;
        }

        public boolean isFull() {
            return count == capacity;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
type MyCircularQueue struct {
	queue []int
	capacity int
	count int
	front int
	rear int
}


func Constructor(k int) MyCircularQueue {
	return MyCircularQueue{
		queue:make([]int, k),
		capacity:k,
	}
}


func (this *MyCircularQueue) EnQueue(value int) bool {
	if this.IsFull() { return false}
	this.queue[this.rear] = value
	this.rear = (this.rear + 1) % this.capacity
	this.count++
	return true
}


func (this *MyCircularQueue) DeQueue() bool {
	if this.IsEmpty(){ return false}
	this.front = (this.front + 1) % this.capacity
	this.count--
	return true
}


func (this *MyCircularQueue) Front() int {
	if this.IsEmpty() { return -1}
	return this.queue[this.front]
}


func (this *MyCircularQueue) Rear() int {
	if this.IsEmpty() { return -1}
	return this.queue[(this.rear - 1 + this.capacity)%this.capacity]
}


func (this *MyCircularQueue) IsEmpty() bool {
	return this.count == 0
}


func (this *MyCircularQueue) IsFull() bool {
	return this.count == this.capacity
}
```

`Python`

```Python
"""
Module Description: 622-设计循环队列
Solution：
Author: Wang P
Problem:# 设计你的循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。
        #  循环队列的一个好处是我们可以利用这个队列之前用过的空间。在一个普通队列里，一旦一个队列满了，我们就不能插入下一个元素，即使在队列前面仍有空间。但是使用循环队列，我们能使用这些空间去存储新的值。
        #
        #  你的实现应该支持如下操作：
        #
        #  MyCircularQueue(k): 构造器，设置队列长度为 k 。
        #  Front: 从队首获取元素。如果队列为空，返回 -1 。
        #  Rear: 获取队尾元素。如果队列为空，返回 -1 。
        #  enQueue(value): 向循环队列插入一个元素。如果成功插入则返回真。
        #  deQueue(): 从循环队列中删除一个元素。如果成功删除则返回真。
        #  isEmpty(): 检查循环队列是否为空。
        #  isFull(): 检查循环队列是否已满。
        #
        #  示例：
        #  MyCircularQueue circularQueue = new MyCircularQueue(3); // 设置长度为 3
        # circularQueue.enQueue(1);  // 返回 true
        # circularQueue.enQueue(2);  // 返回 true
        # circularQueue.enQueue(3);  // 返回 true
        # circularQueue.enQueue(4);  // 返回 false，队列已满
        # circularQueue.Rear();  // 返回 3
        # circularQueue.isFull();  // 返回 true
        # circularQueue.deQueue();  // 返回 true
        # circularQueue.enQueue(4);  // 返回 true
        # circularQueue.Rear();  // 返回 4
        #
        #  提示：
        #  所有的值都在 0 至 1000 的范围内；
        #  操作数将在 1 至 1000 的范围内；
        #  请不要使用内置的队列库。
        #
        #  Related Topics 设计 队列
        #  👍 180 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)


class MyCircularQueue:

    def __init__(self, k: int):
        self.queue = []
        self.capacity = k
        self.count = 0
        self.front = 0
        self.rear = 0
        for i in range(0, k):
            self.queue.append(-1)

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        self.queue[self.rear] = value
        self.rear = (self.rear + 1) % self.capacity
        self.count += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False

        self.front = (self.front + 1) % self.capacity
        self.count -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.queue[self.front]

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.queue[(self.rear - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull(self) -> bool:
        return self.count == self.capacity

# leetcode submit region end(Prohibit modification and deletion)

```

**链表方式**

```Java
   // 链表方式实现
    class Node {
        int val;
        Node next;

        public Node(int val) {
            this.val = val;
        }
    }

    class CircularQueue {
        private Node head, tail;
        private int count, capacity;

        public CircularQueue(int k) {
            capacity = k;
        }

        public boolean enQueue(int value) {
            if (isFull()) return false;
            Node node = new Node(value);
            if (count == 0) {
                head = node;
                tail = node;
            }else{
                tail.next = node;
                tail = tail.next;
            }
            count++;
            return true;
        }

        public boolean deQueue() {
            if (isEmpty()) return false;
            head = head.next;
            if (count == 1) tail = head;
            count--;
            return true;
        }

        public int Front() {
            return head.val;
        }

        public int Rear() {
            return tail.val;
        }

        public boolean isEmpty() {
            return count == 0;
        }

        public boolean isFull() {
            return count == capacity;
        }
    }
```

```Go
type ListNode struct {
	Val  int
	Next *ListNode
}

type CircularQueue struct {
	capacity int
	count    int
	head     *ListNode
	tail     *ListNode
}

func NewCircularQueue(k int) CircularQueue {
	return CircularQueue{
		capacity:k,
	}
}

func (this *CircularQueue) EnQueue(value int) bool {
	if this.IsFull() { return false}
	node := ListNode{Val: value}
	if this.count == 0 {
		this.head = &node
		this.tail = &node
	} else {
		this.tail.Next = &node
		this.tail = this.tail.Next
	}
	this.count++
	return true
}

func (this *CircularQueue) DeQueue() bool {
	if this.IsEmpty(){ return false}
	this.head = this.head.Next
	if this.count == 1 {
		this.tail = this.head
	}
	this.count--
	return true
}

func (this *CircularQueue) Front() int {
	if this.IsEmpty() { return -1}
	return this.head.Val
}

func (this *CircularQueue) Rear() int {
	if this.IsEmpty() {return -1}
	return this.tail.Val
}

func (this *CircularQueue) IsEmpty() bool {
	return this.count == 0
}

func (this *CircularQueue) IsFull() bool {
	return this.count == this.capacity
}

```

```Python
class Node:
    def __init__(self, value: int):
        self.val = value
        self.next_node = None
        

class CircularQueue:

    def __init__(self, k: int):
        self.capacity = k
        self.count = 0
        self.head = None
        self.tail = None

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        node = Node(value)
        if self.count == 0:
            self.head = self.tail = node
        else:
            self.tail.next_node = node
            self.tail = self.tail.next_node
        self.count += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False

        self.head = self.head.next_node
        if self.count == 1:
            self.tail = self.head
        self.count -= 1
        return True

    def Front(self) -> int:
        return -1 if self.isEmpty() else self.head.val

    def Rear(self) -> int:
        return -1 if self.isEmpty() else self.tail.val

    def isEmpty(self) -> bool:
        return self.count == 0

    def isFull(self) -> bool:
        return self.count == self.capacity
```

###### [641. 设计循环双端队列](https://leetcode-cn.com/problems/design-circular-deque/)

设计实现双端队列。
你的实现需要支持以下操作：

- `MyCircularDeque(k)`：构造函数,双端队列的大小为k。
- `insertFront()`：将一个元素添加到双端队列头部。 如果操作成功返回 true。
- `insertLast()`：将一个元素添加到双端队列尾部。如果操作成功返回 true。
- `deleteFront()`：从双端队列头部删除一个元素。 如果操作成功返回 true。
- `deleteLast()`：从双端队列尾部删除一个元素。如果操作成功返回 true。
- `getFront()`：从双端队列头部获得一个元素。如果双端队列为空，返回 -1。
- `getRear()`：获得双端队列的最后一个元素。 如果双端队列为空，返回 -1。
- `isEmpty()`：检查双端队列是否为空。
- `isFull()`：检查双端队列是否满了。

**示例：**

```Java
MyCircularDeque circularDeque = new MycircularDeque(3); // 设置容量大小为3
circularDeque.insertLast(1);			        // 返回 true
circularDeque.insertLast(2);			        // 返回 true
circularDeque.insertFront(3);			        // 返回 true
circularDeque.insertFront(4);			        // 已经满了，返回 false
circularDeque.getRear();  				// 返回 2
circularDeque.isFull();				        // 返回 true
circularDeque.deleteLast();			        // 返回 true
circularDeque.insertFront(4);			        // 返回 true
circularDeque.getFront();				// 返回 4
```

**提示：**

- 所有值的范围为 [1, 1000]
- 操作次数的范围为 [1, 1000]
- 请不要使用内置的双端队列库。

解题思路

```

```

`Java`

```Java
package com.weitrue.leetcode.editor.cn;

public class DesignCircularDeque{
    public static void main(String[] args){
        MyCircularDeque s = new DesignCircularDeque().new MyCircularDeque(3);
        s.insertLast(1); // return True
        s.insertLast(2); // return True
        s.insertLast(3); // return True
        s.insertLast(4); // return False
        s.getRear();     // return 3
        s.isFull();   // return True
        s.deleteLast();  // return True
        s.insertFront(4); // return True
        s.getFront();     // return 4
    }
    
    //Design your implementation of the circular double-ended queue (deque). 
    // Your implementation should support following operations:
    //
    // MyCircularDeque(k): Constructor, set the size of the deque to be k.
    // insertFront(): Adds an item at the front of Deque. Return true if the operation is successful.
    // insertLast(): Adds an item at the rear of Deque. Return true if the operationis successful.
    // deleteFront(): Deletes an item from the front of Deque. Return true if the operation is successful.
    // deleteLast(): Deletes an item from the rear of Deque. Return true if the operation is successful.
    // getFront(): Gets the front item from the Deque. If the deque is empty, return-1.
    // getRear(): Gets the last item from Deque. If the deque is empty, return -1.
    // isEmpty(): Checks whether Deque is empty or not.
    // isFull(): Checks whether Deque is full or not.
    //
    // Example:
    //MyCircularDeque circularDeque = new MycircularDeque(3); // set the size to be
    //3
    //circularDeque.insertLast(1);			// return true
    //circularDeque.insertLast(2);			// return true
    //circularDeque.insertFront(3);			// return true
    //circularDeque.insertFront(4);			// return false, the queue is full
    //circularDeque.getRear();  			// return 2
    //circularDeque.isFull();				// return true
    //circularDeque.deleteLast();			// return true
    //circularDeque.insertFront(4);			// return true
    //circularDeque.getFront();			// return 4
    //
    // Note:
    // All values will be in the range of [0, 1000].
    // The number of operations will be in the range of [1, 1000].
    // Please do not use the built-in Deque library.
    //
    // Related Topics 设计 队列
    // 👍 77 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    class MyCircularDeque {

        private int[] queue;
        private int capacity, front, rear, count;

        /** Initialize your data structure here. Set the size of the deque to be k. */
        public MyCircularDeque(int k) {
            queue = new int[k];
            capacity = k;
            count = 0;
            front = 0;
            rear = 0;
        }

        /** Adds an item at the front of Deque. Return true if the operation is successful. */
        public boolean insertFront(int value) {
            if (isFull()) return false;
            front = (front -1 + capacity) % capacity;
            queue[front] = value;
            count++;
            return true;
        }

        /** Adds an item at the rear of Deque. Return true if the operation is successful. */
        public boolean insertLast(int value) {
            if (isFull()) return false;
            queue[rear++] = value;
            rear %= capacity;
            count++;
            return true;
        }

        /** Deletes an item from the front of Deque. Return true if the operation is successful. */
        public boolean deleteFront() {
            if (isEmpty()) return false;
            front = (front + 1) % capacity;
            count--;
            return true;
        }

        /** Deletes an item from the rear of Deque. Return true if the operation is successful. */
        public boolean deleteLast() {
            if (isEmpty()) return false;
            rear = (rear -1 + capacity) % capacity;
            count--;
            return true;
        }

        /** Get the front item from the deque. */
        public int getFront() {
            if (isEmpty()) return -1;
            return queue[front];
        }

        /** Get the last item from the deque. */
        public int getRear() {
            if (isEmpty()) return -1;
            return queue[(rear-1+capacity)%capacity];
        }

        /** Checks whether the circular deque is empty or not. */
        public boolean isEmpty() {
            return count == 0;
        }

        /** Checks whether the circular deque is full or not. */
        public boolean isFull() {
            return count == capacity;
        }
    }

    /**
     * Your MyCircularDeque object will be instantiated and called as such:
     * MyCircularDeque obj = new MyCircularDeque(k);
     * boolean param_1 = obj.insertFront(value);
     * boolean param_2 = obj.insertLast(value);
     * boolean param_3 = obj.deleteFront();
     * boolean param_4 = obj.deleteLast();
     * int param_5 = obj.getFront();
     * int param_6 = obj.getRear();
     * boolean param_7 = obj.isEmpty();
     * boolean param_8 = obj.isFull();
     */
    //leetcode submit region end(Prohibit modification and deletion)

}
```

`Golang`

```Golang
type MyCircularDeque struct {
	queue []int
	front int
	rear int
	capacity int
	count int
}

/** Initialize your data structure here. Set the size of the deque to be k. */
func Constructor(k int) MyCircularDeque {
	return MyCircularDeque{
		queue:    make([]int, k),
		capacity: k,
	}
}

/** Adds an item at the front of Deque. Return true if the operation is successful. */
func (this *MyCircularDeque) InsertFront(value int) bool {
	if this.IsFull() {
		return false
	}
	this.front = (this.front - 1 + this.capacity) % this.capacity
	this.queue[this.front] = value
	this.count += 1
	return true
}

/** Adds an item at the rear of Deque. Return true if the operation is successful. */
func (this *MyCircularDeque) InsertLast(value int) bool {
	if this.IsFull() {
		return false
	}
	this.queue[this.rear] = value
	this.rear = (this.rear +1) % this.capacity
	this.count += 1
	return true
}

/** Deletes an item from the front of Deque. Return true if the operation is successful. */
func (this *MyCircularDeque) DeleteFront() bool {
	if this.IsEmpty() {
		return false
	}
	this.front = (this.front +1) % this.capacity
	this.count -= 1
	return true
}

/** Deletes an item from the rear of Deque. Return true if the operation is successful. */
func (this *MyCircularDeque) DeleteLast() bool {
	if this.IsEmpty() {
		return false
	}
	this.rear = (this.rear - 1 + this.capacity) % this.capacity
	this.count -= 1
	return true
}

/** Get the front item from the deque. */
func (this *MyCircularDeque) GetFront() int {
	if this.IsEmpty() {
		return -1
	}
	return this.queue[this.front]
}

/** Get the last item from the deque. */
func (this *MyCircularDeque) GetRear() int {
	if this.IsEmpty() {
		return -1
	}
	return this.queue[(this.rear-1+this.capacity)%this.capacity]
}

/** Checks whether the circular deque is empty or not. */
func (this *MyCircularDeque) IsEmpty() bool {
	return this.count == 0
}

/** Checks whether the circular deque is full or not. */
func (this *MyCircularDeque) IsFull() bool {
	return this.count == this.capacity
}
```

`Python`

```Python
"""
Module Description: 641-设计循环双端队列
Solution：
Author: Wang P
Problem:# 设计实现双端队列。 
        # 你的实现需要支持以下操作：
        #  MyCircularDeque(k)：构造函数,双端队列的大小为k。
        #  insertFront()：将一个元素添加到双端队列头部。 如果操作成功返回 true。
        #  insertLast()：将一个元素添加到双端队列尾部。如果操作成功返回 true。
        #  deleteFront()：从双端队列头部删除一个元素。 如果操作成功返回 true。
        #  deleteLast()：从双端队列尾部删除一个元素。如果操作成功返回 true。
        #  getFront()：从双端队列头部获得一个元素。如果双端队列为空，返回 -1。
        #  getRear()：获得双端队列的最后一个元素。 如果双端队列为空，返回 -1。
        #  isEmpty()：检查双端队列是否为空。
        #  isFull()：检查双端队列是否满了。
        #  示例：
        #  MyCircularDeque circularDeque = new MycircularDeque(3); // 设置容量大小为3
        # circularDeque.insertLast(1);			        // 返回 true
        # circularDeque.insertLast(2);			        // 返回 true
        # circularDeque.insertFront(3);			        // 返回 true
        # circularDeque.insertFront(4);			        // 已经满了，返回 false
        # circularDeque.getRear();  				        // 返回 2
        # circularDeque.isFull();				            // 返回 true
        # circularDeque.deleteLast();			          // 返回 true
        # circularDeque.insertFront(4);			        // 返回 true
        # circularDeque.getFront();				          // 返回 4
        #  
        #  提示：
        #  所有值的范围为 [1, 1000]
        #  操作次数的范围为 [1, 1000]
        #  请不要使用内置的双端队列库。
        #
        #  Related Topics 设计 队列
        #  👍 77 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)


class MyCircularDeque:

    def __init__(self, k: int):
        """
        Initialize your data structure here. Set the size of the deque to be k.
        """
        self.queue = []
        self.capacity = k
        self.count = 0
        self.front = 0
        self.rear = 0
        for i in range(0, k):
            self.queue.append(-1)

    def insertFront(self, value: int) -> bool:
        """
        Adds an item at the front of Deque. Return true if the operation is successful.
        """
        if self.isFull():
            return False
        self.front = (self.front - 1 + self.capacity) % self.capacity
        self.queue[self.front] = value
        self.count += 1
        return True

    def insertLast(self, value: int) -> bool:
        """
        Adds an item at the rear of Deque. Return true if the operation is successful.
        """
        if self.isFull():
            return False
        self.queue[self.rear] = value
        self.rear = (self.rear + 1) % self.capacity
        self.count += 1
        return True

    def deleteFront(self) -> bool:
        """
        Deletes an item from the front of Deque. Return true if the operation is successful.
        """
        if self.isEmpty():
            return False

        self.front = (self.front + 1) % self.capacity
        self.count -= 1
        return True

    def deleteLast(self) -> bool:
        """
        Deletes an item from the rear of Deque. Return true if the operation is successful.
        """
        if self.isEmpty():
            return False

        self.rear = (self.rear - 1 + self.capacity) % self.capacity
        self.count -= 1
        return True

    def getFront(self) -> int:
        """
        Get the front item from the deque.
        """
        return -1 if self.isEmpty() else self.queue[self.front]

    def getRear(self) -> int:
        """
        Get the last item from the deque.
        """
        return -1 if self.isEmpty() else self.queue[(self.rear - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        """
        Checks whether the circular deque is empty or not.
        """
        return self.count == 0

    def isFull(self) -> bool:
        """
        Checks whether the circular deque is full or not.
        """
        return self.count == self.capacity

    # Your MyCircularDeque object will be instantiated and called as such:
    # obj = MyCircularDeque(k)
    # param_1 = obj.insertFront(value)
    # param_2 = obj.insertLast(value)
    # param_3 = obj.deleteFront()
    # param_4 = obj.deleteLast()
    # param_5 = obj.getFront()
    # param_6 = obj.getRear()
    # param_7 = obj.isEmpty()
    # param_8 = obj.isFull()
    # leetcode submit region end(Prohibit modification and deletion)

```

###### [1670. 设计前中后队列](https://leetcode-cn.com/problems/design-front-middle-back-queue/)

请你设计一个队列，支持在前，中，后三个位置的 `push` 和 `pop` 操作。

请你完成 `FrontMiddleBack` 类：

- `FrontMiddleBack()` 初始化队列。
- `void pushFront(int val) `将`val`添加到队列的**最前面**。
- `void pushMiddle(int val) `将`val`添加到队列的**正中间**。
- `void pushBack(int val) `将`val`添加到队里的**最后面**。
- `int popFront() `将**最前面**的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
- `int popMiddle() `将**正中间**的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
- `int popBack() `将**最后面**的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。

请注意当有**两个**中间位置的时候，选择靠前面的位置进行操作。比方说：

将 6 添加到 `[1, 2, 3, 4, 5] `的中间位置，结果数组为` [1, 2, 6, 3, 4, 5] `。
从 `[1, 2, 3, 4, 5, 6] `的中间位置弹出元素，返回`3`，数组变为` [1, 2, 4, 5, 6] `。

**示例 1：**

```Java
输入：
["FrontMiddleBackQueue", "pushFront", "pushBack", "pushMiddle", "pushMiddle", "popFront", "popMiddle", "popMiddle", "popBack", "popFront"]
[[], [1], [2], [3], [4], [], [], [], [], []]
输出：
[null, null, null, null, null, 1, 3, 4, 2, -1]

解释：
FrontMiddleBackQueue q = new FrontMiddleBackQueue();
q.pushFront(1);   // [1]
q.pushBack(2);    // [1, 2]
q.pushMiddle(3);  // [1, 3, 2]
q.pushMiddle(4);  // [1, 4, 3, 2]
q.popFront();     // 返回 1 -> [4, 3, 2]
q.popMiddle();    // 返回 3 -> [4, 2]
q.popMiddle();    // 返回 4 -> [2]
q.popBack();      // 返回 2 -> []
q.popFront();     // 返回 -1 -> [] （队列为空）

```

**提示：**

- `1 <= val <= 109`
- 最多调用 1000 次 `pushFront`， `pushMiddle`， `pushBack`， `popFront`， `popMiddle` 和 `popBack `。



解题思路

```
两个双端队列
```

`Java`

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.Deque;
import java.util.LinkedList;

public class DesignFrontMiddleBackQueue{
    public static void main(String[] args){
        FrontMiddleBackQueue s = new DesignFrontMiddleBackQueue().new FrontMiddleBackQueue();
    }
    
    //Design a queue that supports push and pop operations in the front, middle, and back.
    // Implement the FrontMiddleBack class:
    //
    // FrontMiddleBack() Initializes the queue.
    // void pushFront(int val) Adds val to the front of the queue.
    // void pushMiddle(int val) Adds val to the middle of the queue.
    // void pushBack(int val) Adds val to the back of the queue.
    // int popFront() Removes the front element of the queue and returns it. If the queue is empty, return -1.
    // int popMiddle() Removes the middle element of the queue and returns it. If the queue is empty, return -1.
    // int popBack() Removes the back element of the queue and returns it. If the queue is empty, return -1.
    //
    // Notice that when there are two middle position choices, the operation is performed on the frontmost middle position choice. For example:
    //
    // Pushing 6 into the middle of [1, 2, 3, 4, 5] results in [1, 2, 6, 3, 4, 5].
    // Popping the middle from [1, 2, 3, 4, 5, 6] returns 3 and results in [1, 2, 4, 5, 6].
    //
    // Example 1:
    //
    //Input:
    //["FrontMiddleBackQueue", "pushFront", "pushBack", "pushMiddle", "pushMiddle",
    //"popFront", "popMiddle", "popMiddle", "popBack", "popFront"]
    //[[], [1], [2], [3], [4], [], [], [], [], []]
    //Output:
    //[null, null, null, null, null, 1, 3, 4, 2, -1]
    //
    //Explanation:
    //FrontMiddleBackQueue q = new FrontMiddleBackQueue();
    //q.pushFront(1);   // [1]
    //q.pushBack(2);    // [1, 2]
    //q.pushMiddle(3);  // [1, 3, 2]
    //q.pushMiddle(4);  // [1, 4, 3, 2]
    //q.popFront();     // return 1 -> [4, 3, 2]
    //q.popMiddle();    // return 3 -> [4, 2]
    //q.popMiddle();    // return 4 -> [2]
    //q.popBack();      // return 2 -> []
    //q.popFront();     // return -1 -> [] (The queue is empty)
    //
    // Constraints:
    // 1 <= val <= 109
    // At most 1000 calls will be made to pushFront, pushMiddle, pushBack, popFront,
    // popMiddle, and popBack.
    //
    // Related Topics 设计 链表
    // 👍 6 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    class FrontMiddleBackQueue {
        private Deque<Integer> left;
        private Deque<Integer> right;

        public FrontMiddleBackQueue() {
            left = new LinkedList<>();
            right = new LinkedList<>();
        }

        public void pushFront(int val) {
            left.addFirst(val);
            balanceQueue();
        }

        public void pushMiddle(int val) {
            if (left.size() > right.size()) {
                right.addFirst(left.pollLast());
            }
            left.addLast(val);
        }

        public void pushBack(int val) {
            right.addLast(val);
            balanceQueue();
        }

        public int popFront() {
            if (left.size() + right.size() == 0) {
                return -1;
            }
            Integer v;
            if (left.size() == 0) {
                v = right.pollFirst();
            }else {
                v= left.pollFirst();
            }
            balanceQueue();
            return v == null ? -1: v;
        }

        public int popMiddle() {
            if (left.size() + right.size() == 0) {
                return -1;
            }
            Integer v = left.pollLast();
            balanceQueue();
            return v == null ? -1: v;
        }

        public int popBack() {
            if (left.size() + right.size() == 0) {
                return -1;
            }
            Integer v;
            if (right.size() == 0) {
                v = left.pollLast();
            } else {
                v = right.pollLast();
            }
            balanceQueue();
            return v == null ? -1: v;
        }

        private void balanceQueue() {
            if (left.size() - right.size() >=2) {
                right.addFirst(left.pollLast());
            }
            if (left.size() < right.size()) {
                left.addLast(right.pollFirst());
            }
        }
    }
    /**
     * Your FrontMiddleBackQueue object will be instantiated and called as such:
     * FrontMiddleBackQueue obj = new FrontMiddleBackQueue();
     * obj.pushFront(val);
     * obj.pushMiddle(val);
     * obj.pushBack(val);
     * int param_4 = obj.popFront();
     * int param_5 = obj.popMiddle();
     * int param_6 = obj.popBack();
     */
    //leetcode submit region end(Prohibit modification and deletion)
}
```

`Golang`

```Golang
package leetcode

//leetcode submit region begin(Prohibit modification and deletion)

// 双向链表分装
type DNode struct {
	val int
	pre *DNode
	next *DNode
}

func (d *DNode) insertPre(value int) {
	node := &DNode{
		val: value,
		pre:d.pre,
		next: d,
	}
	if d.pre != nil {
		d.pre.next = node
	}
	d.pre = node
}

func (d *DNode) insertNext(value int) {
	node := &DNode{
		val:  value,
		pre:  d,
		next: d.next,
	}
	if d.next != nil {
		d.next.pre = node
	}
	d.next = node
}

func (d *DNode) deletePre() {
	if d.pre == nil {
		return
	}
	d.pre = d.pre.pre
	if d.pre != nil {
		d.pre.next = d
	}
}

func (d *DNode) deleteNext()  {
	if d.next == nil {
		return
	}
	d.next = d.next.next
	if d.next != nil {
		d.next.pre = d
	}
}

func (d *DNode) printNode()  {
	h := d
	for h != nil {
		fmt.Print(h.val, "->")
		h = h.next
	}
}

type CircularDeque struct {
	front *DNode
	rear *DNode
	count int
}

func NewCircularDeque() CircularDeque {
	return CircularDeque{
		front:nil,
		rear:nil,
	}
}

func (c *CircularDeque)pushPre(value int) bool {
	if c.count == 0 {
		node := &DNode{
			val:  value,
		}
		c.front = node
		c.rear = node
	} else {
		c.front.insertPre(value)
		c.front = c.front.pre
	}
	c.count += 1
	return true
}

func (c *CircularDeque)pushTail(value int) bool {
	if c.count == 0 {
		node := &DNode{
			val:  value,
		}
		c.front = node
		c.rear = node
	} else {
		c.rear.insertNext(value)
		c.rear = c.rear.next
	}
	c.count += 1
	return true
}

func (c *CircularDeque)popFront() int {
	if c.isEmpty() {return -1}
	v := c.front.val
	if c.count == 1 {
		c.front = nil
		c.rear = nil
	}else{
		c.front = c.front.next
		c.front.deletePre()
	}
	c.count -= 1
	return v
}

func (c *CircularDeque)popTail() int {
	if c.isEmpty() {return -1}
	v := c.rear.val
	if c.count == 1 {
		c.front = nil
		c.rear = nil
	}else{
		c.rear = c.rear.pre
		c.rear.deleteNext()
	}
	c.count -= 1
	return v
}

func (c *CircularDeque)isEmpty() bool {
	return c.count == 0
}


type FrontMiddleBackQueue struct {
	lQueue CircularDeque
	rQueue CircularDeque
}

func Constructor() FrontMiddleBackQueue {
	return FrontMiddleBackQueue{
		lQueue: NewCircularDeque(),
		rQueue: NewCircularDeque(),
	}
}

func (this *FrontMiddleBackQueue) PushFront(val int)  {
	this.lQueue.pushPre(val)
	this.formatQueue()
}

func (this *FrontMiddleBackQueue) PushMiddle(val int)  {
	// 插入中间需要先平衡
  if this.lQueue.count > this.rQueue.count {
		this.rQueue.pushPre(this.lQueue.popTail())
	}
	this.lQueue.pushTail(val)

}

func (this *FrontMiddleBackQueue) PushBack(val int)  {
	this.rQueue.pushTail(val)
	this.formatQueue()
}

func (this *FrontMiddleBackQueue) PopFront() int {
	v := -1
	if this.isEmpty() {
		return v
	}
	if this.lQueue.count == 0 {
		v = this.rQueue.popFront()
	} else {
		v = this.lQueue.popFront()
	}
	this.formatQueue()

	return v
}

func (this *FrontMiddleBackQueue) PopMiddle() int {
	v := -1
	if this.isEmpty() {
		return v
	}
	v = this.lQueue.popTail()
	this.formatQueue()

	return v
}

func (this *FrontMiddleBackQueue) PopBack() int {
	v := -1
	if this.isEmpty() {
		return v
	}
	if this.rQueue.count == 0 {
		v = this.lQueue.popTail()
	} else {
		v = this.rQueue.popTail()
	}
	this.formatQueue()

	return v
}

func(this *FrontMiddleBackQueue) isEmpty () bool {
	return this.lQueue.count + this.rQueue.count == 0
}

func (this *FrontMiddleBackQueue) formatQueue() {
	if this.lQueue.count < this.rQueue.count {
		this.lQueue.pushTail(this.rQueue.popFront())
	}
	if this.lQueue.count - this.rQueue.count >= 2 {
		this.rQueue.pushPre(this.lQueue.popTail())

	}
}

/**
 * Your FrontMiddleBackQueue object will be instantiated and called as such:
 * obj := Constructor();
 * obj.PushFront(val);
 * obj.PushMiddle(val);
 * obj.PushBack(val);
 * param_4 := obj.PopFront();
 * param_5 := obj.PopMiddle();
 * param_6 := obj.PopBack();
 */
//leetcode submit region end(Prohibit modification and deletion)

```

`Python`

```Python
"""
Module Description: 1670-设计前中后队列
Solution：
Author: Wang P
Problem:# 请你设计一个队列，支持在前，中，后三个位置的 push 和 pop 操作。 
        #  请你完成 FrontMiddleBack 类：
        #  FrontMiddleBack() 初始化队列。
        #  void pushFront(int val) 将 val 添加到队列的 最前面 。
        #  void pushMiddle(int val) 将 val 添加到队列的 正中间 。
        #  void pushBack(int val) 将 val 添加到队里的 最后面 。
        #  int popFront() 将 最前面 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
        #  int popMiddle() 将 正中间 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
        #  int popBack() 将 最后面 的元素从队列中删除并返回值，如果删除之前队列为空，那么返回 -1 。
        #  请注意当有 两个 中间位置的时候，选择靠前面的位置进行操作。比方说：
        #
        #  将 6 添加到 [1, 2, 3, 4, 5] 的中间位置，结果数组为 [1, 2, 6, 3, 4, 5] 。
        #  从 [1, 2, 3, 4, 5, 6] 的中间位置弹出元素，返回 3 ，数组变为 [1, 2, 4, 5, 6] 。
        #
        #  示例 1：
        # 输入：
        # ["FrontMiddleBackQueue", "pushFront", "pushBack", "pushMiddle", "pushMiddle",
        # "popFront", "popMiddle", "popMiddle", "popBack", "popFront"]
        # [[], [1], [2], [3], [4], [], [], [], [], []]
        # 输出：
        # [null, null, null, null, null, 1, 3, 4, 2, -1]
        #
        # 解释：
        # FrontMiddleBackQueue q = new FrontMiddleBackQueue();
        # q.pushFront(1);   // [1]
        # q.pushBack(2);    // [1, 2]
        # q.pushMiddle(3);  // [1, 3, 2]
        # q.pushMiddle(4);  // [1, 4, 3, 2]
        # q.popFront();     // 返回 1 -> [4, 3, 2]
        # q.popMiddle();    // 返回 3 -> [4, 2]
        # q.popMiddle();    // 返回 4 -> [2]
        # q.popBack();      // 返回 2 -> []
        # q.popFront();     // 返回 -1 -> [] （队列为空）
        #
        #  提示：
        #  1 <= val <= 109
        #  最多调用 1000 次 pushFront， pushMiddle， pushBack， popFront， popMiddle 和 popBack 。
        #
        #  Related Topics 设计 链表
        #  👍 6 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
from collections import deque


class FrontMiddleBackQueue:

    def __init__(self):
        self.left = deque()
        self.right = deque()

    def pushFront(self, val: int) -> None:
        self.left.appendleft(val)
        self.balance_queue()

    def pushMiddle(self, val: int) -> None:
        if len(self.left) > len(self.right):
            self.right.appendleft(self.left.pop())
        self.left.append(val)

    def pushBack(self, val: int) -> None:
        self.right.append(val)
        self.balance_queue()

    def popFront(self) -> int:
        v = -1
        if len(self.left) + len(self.right) == 0:
            return v
        v = self.left.popleft()
        self.balance_queue()
        return v

    def popMiddle(self) -> int:
        v = -1
        if len(self.left) + len(self.right) == 0:
            return v
        v = self.left.pop()
        self.balance_queue()
        return v

    def popBack(self) -> int:
        v = -1
        if len(self.left) + len(self.right) == 0:
            return v
        if len(self.right) == 0:
            v = self.left.pop()
        else:
            v = self.right.pop()
        self.balance_queue()
        return v

    def balance_queue(self):
        if len(self.left) - len(self.right) >= 2:
            self.right.appendleft(self.left.pop())
        else:
            if len(self.left) < len(self.right):
                self.left.append(self.right.popleft())

    # Your FrontMiddleBackQueue object will be instantiated and called as such:
    # obj = FrontMiddleBackQueue()
    # obj.pushFront(val)
    # obj.pushMiddle(val)
    # obj.pushBack(val)
    # param_4 = obj.popFront()
    # param_5 = obj.popMiddle()
    # param_6 = obj.popBack()
    # leetcode submit region end(Prohibit modification and deletion)


if __name__ == "__main__":
    obj = FrontMiddleBackQueue()
    obj.pushFront(1)
    obj.pushMiddle(2)
    obj.pushBack(3)
    print(obj.popFront())
    print(obj.popMiddle())
    print(obj.popBack())

```

###### [933. 最近的请求次数](https://leetcode-cn.com/problems/number-of-recent-calls/)

写一个 `RecentCounter `类来计算特定时间范围内最近的请求。

请你实现` RecentCounter `类：

- `RecentCounter() `初始化计数器，请求数为 0 。
- `int ping(int t) `在时间` t `添加一个新请求，其中 `t` 表示以毫秒为单位的某个时间，并返回过去 `3000` 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在`[t-3000, t]`内发生的请求数。
  保证 每次对`ping`的调用都使用比之前更大的`t`值。

**示例：**

```Java
输入：
["RecentCounter", "ping", "ping", "ping", "ping"]
[[], [1], [100], [3001], [3002]]
输出：
[null, 1, 2, 3, 3]

解释：
RecentCounter recentCounter = new RecentCounter();
recentCounter.ping(1);     // requests = [1]，范围是 [-2999,1]，返回 1
recentCounter.ping(100);   // requests = [1, 100]，范围是 [-2900,100]，返回 2
recentCounter.ping(3001);  // requests = [1, 100, 3001]，范围是 [1,3001]，返回 3
recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002]，范围是 [2,3002]，返回 3
```

**提示：**

- `1 <= t <= 10^9`
- 保证每次对 `ping` 调用所使用的 `t` 值都 **严格递增**
- 至多调用 `ping` 方法 `10^4` 次



解题思路

```
队列实现
  入队时，对手请求时间<当前-3000，出队
  队列中的元素数量即是`[t-3000, t]`内发生的请求数
```

`Java`

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.Deque;
import java.util.LinkedList;

public class NumberOfRecentCalls{
    public static void main(String[] args){
        Solution s = new NumberOfRecentCalls().new Solution();
    }
    
    //You have a RecentCounter class which counts the number of recent requests with in a certain time frame.
    // Implement the RecentCounter class:
    // RecentCounter() Initializes the counter with zero recent requests.
    // int ping(int t) Adds a new request at time t, where t represents some time in milliseconds, and returns the number
    // of requests that has happened in the past 3000 milliseconds (including the new request). Specifically, return the
    // number of requests that have happened in the inclusive range [t - 3000, t].
    //
    // It is guaranteed that every call to ping uses a strictly larger value of t than the previous call.
    //
    // Example 1:
    //Input
    //["RecentCounter", "ping", "ping", "ping", "ping"]
    //[[], [1], [100], [3001], [3002]]
    //Output
    //[null, 1, 2, 3, 3]
    //
    //Explanation
    //RecentCounter recentCounter = new RecentCounter();
    //recentCounter.ping(1);     // requests = [1], range is [-2999,1], return 1
    //recentCounter.ping(100);   // requests = [1, 100], range is [-2900,100], return 2
    //recentCounter.ping(3001);  // requests = [1, 100, 3001], range is [1,3001], return 3
    //recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002], range is [2,3002], return 3
    // Constraints:
    // 1 <= t <= 109
    // Each test case will call ping with strictly increasing values of t.
    // At most 104 calls will be made to ping.
    //
    // Related Topics 队列
    // 👍 82 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    class RecentCounter {
        private Deque<Integer> deque = new LinkedList();

        public RecentCounter() {

        }

        public int ping(int t) {
            deque.add(t);
            while (deque.peek() < t-3000) {
                deque.poll();
            }
            return deque.size();
        }
    }

    /**
     * Your RecentCounter object will be instantiated and called as such:
     * RecentCounter obj = new RecentCounter();
     * int param_1 = obj.ping(t);
     */
    //leetcode submit region end(Prohibit modification and deletion)
}
```

`Golang`

```Golang
type RecentCounter struct {
	queue Queue
}


func Constructor() RecentCounter {
	return RecentCounter{
		queue: make([]int, 0),
	}
}

func (this *RecentCounter) Ping(t int) int {
	this.queue.push(t)
	for this.queue.peek() < t-3000 {
		this.queue.pop()
	}
	return len(this.queue)
}

type Queue []int

func (q *Queue)push(v int) error {
	*q = append(*q, v)
	return nil
}

func (q *Queue)pop() int {
	if q.isEmpty() {
		return -1
	}
	head := (*q)[0]
	*q = (*q)[1:]
	return head
}

func (q *Queue)peek() int {
	if q.isEmpty() {
		return -1
	}
	return (*q)[0]
}

func (q *Queue)isEmpty() bool {
	return len(*q) == 0
}
```

`Python`

```Python
"""
Module Description: 933-最近的请求次数
Solution：
Author: Wang P
Problem:# 写一个 RecentCounter 类来计算特定时间范围内最近的请求。 
        #  请你实现 RecentCounter 类：
        #
        #  RecentCounter() 初始化计数器，请求数为 0 。
        #  int ping(int t) 在时间 t 添加一个新请求，其中 t 表示以毫秒为单位的某个时间，并返回过去 3000 毫秒内发生的所有请求数（包括新请求）。确切地说，返回在 [t-3000, t] 内发生的请求数。
        #  保证 每次对 ping 的调用都使用比之前更大的 t 值。
        #  示例：
        # 输入：
        # ["RecentCounter", "ping", "ping", "ping", "ping"]
        # [[], [1], [100], [3001], [3002]]
        # 输出：
        # [null, 1, 2, 3, 3]
        #
        # 解释：
        # RecentCounter recentCounter = new RecentCounter();
        # recentCounter.ping(1);     // requests = [1]，范围是 [-2999,1]，返回 1
        # recentCounter.ping(100);   // requests = [1, 100]，范围是 [-2900,100]，返回 2
        # recentCounter.ping(3001);  // requests = [1, 100, 3001]，范围是 [1,3001]，返回 3
        # recentCounter.ping(3002);  // requests = [1, 100, 3001, 3002]，范围是 [2,3002]，返回 3
        #  提示：
        #  1 <= t <= 109
        #  保证每次对 ping 调用所使用的 t 值都 严格递增
        #  至多调用 ping 方法 104 次
        #
        #  Related Topics 队列
        #  👍 82 👎 0
        """
# leetcode submit region begin(Prohibit modification and deletion)


class RecentCounter:

    def __init__(self):
        self.queue = []

    def ping(self, t: int) -> int:
        self.push(t)
        while self.peek() < t - 3000:
            self.pop()
        return self.size()

    def push(self, t: int):
        self.queue.append(t)

    def pop(self):
        if self.is_empty():
            return -1
        t = self.queue[0]
        self.queue = self.queue[1:]
        return t

    def peek(self):
        if self.is_empty():
            return -1
        return self.queue[0]

    def is_empty(self):
        return len(self.queue) == 0

    def size(self):
        return len(self.queue)
```

###### [621. 任务调度器](https://leetcode-cn.com/problems/task-scheduler/)

给你一个用字符数组 tasks 表示的 CPU 需要执行的任务列表。其中每个字母表示一种不同种类的任务。任务可以以任意顺序执行，并且每个任务都可以在 1 个单位时间内执行完。在任何一个单位时间，CPU 可以完成一个任务，或者处于待命状态。

然而，两个 相同种类 的任务之间必须有长度为整数 n 的冷却时间，因此至少有连续 n 个单位时间内 CPU 在执行不同的任务，或者在待命状态。

你需要计算完成所有任务所需要的 最短时间 。

**示例 1：**

```
输入：tasks = ["A","A","A","B","B","B"], n = 2
输出：8
解释：A -> B -> (待命) -> A -> B -> (待命) -> A -> B
     在本示例中，两个相同类型任务之间必须间隔长度为 n = 2 的冷却时间，而执行一个任务只需要一个单位时间，所以中间出现了（待命）状态。
```

**示例 2：**

```
输入：tasks = ["A","A","A","B","B","B"], n = 0
输出：6
解释：在这种情况下，任何大小为 6 的排列都可以满足要求，因为 n = 0
["A","A","A","B","B","B"]
["A","B","A","B","A","B"]
["B","B","B","A","A","A"]
...
诸如此类
```

**示例 3：**

```
输入：tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2
输出：16
解释：一种可能的解决方案是：
     A -> B -> C -> A -> D -> E -> A -> F -> G -> A -> (待命) -> (待命) -> A -> (待命) -> (待命) -> A
```

**提示：**

- `1 <= task.length <= 104`
- `tasks[i]` 是大写英文字母
- `n` 的取值范围为 `[0, 100]`



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

###### [面试题 17.09. 第 k 个数](https://leetcode-cn.com/problems/get-kth-magic-number-lcci/)

有些数的素因子只有 3，5，7，请设计一个算法找出第 k 个数。注意，不是必须有这些素因子，而是必须不包含其他的素因子。例如，前几个数按顺序应该是 1，3，5，7，9，15，21。

**示例 1:**

```
输入: k = 5

输出: 9
```



解题思路

```
智力题
   熟悉数字规则即可
```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

###### [859. 亲密字符串](https://leetcode-cn.com/problems/buddy-strings/)

给定两个由小写字母构成的字符串 A 和 B ，只要我们可以通过交换 A 中的两个字母得到与 B 相等的结果，就返回 true ；否则返回 false 。

交换字母的定义是取两个下标 i 和 j （下标从 0 开始），只要` i!=j `就交换` A[i] `和`A[j] `处的字符。例如，在 `"abcd"` 中交换下标 0 和下标 2 的元素可以生成 `"cbad" `。

**示例 1：**

```
输入： A = "ab", B = "ba"
输出： true
解释： 你可以交换 A[0] = 'a' 和 A[1] = 'b' 生成 "ba"，此时 A 和 B 相等。
```

**示例 2：**

```
输入： A = "ab", B = "ab"
输出： false
解释： 你只能交换 A[0] = 'a' 和 A[1] = 'b' 生成 "ba"，此时 A 和 B 不相等。
```

**示例 3：**

```
输入： A = "aa", B = "aa"
输出： true
解释： 你可以交换 A[0] = 'a' 和 A[1] = 'a' 生成 "aa"，此时 A 和 B 相等。
```

**示例 4：**

```
输入： A = "aaaaaaabc", B = "aaaaaaacb"
输出： true
```

**示例 5：**

```
输入： A = "", B = "aa"
输出： false
```

**提示：**

1. `0 <= A.length <= 20000`
2. `0 <= B.length <= 20000`
3. `A` 和 `B` 仅由小写字母构成。



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

###### [860. 柠檬水找零](https://leetcode-cn.com/problems/lemonade-change/)

在柠檬水摊上，每一杯柠檬水的售价为 5 美元。

顾客排队购买你的产品，（按账单 bills 支付的顺序）一次购买一杯。

每位顾客只买一杯柠檬水，然后向你付 5 美元、10 美元或 20 美元。你必须给每个顾客正确找零，也就是说净交易是每位顾客向你支付 5 美元。

注意，一开始你手头没有任何零钱。

如果你能给每位顾客正确找零，返回 true ，否则返回 false 。

**示例 1：**

```
输入：[5,5,5,10,20]
输出：true
解释：
前 3 位顾客那里，我们按顺序收取 3 张 5 美元的钞票。
第 4 位顾客那里，我们收取一张 10 美元的钞票，并返还 5 美元。
第 5 位顾客那里，我们找还一张 10 美元的钞票和一张 5 美元的钞票。
由于所有客户都得到了正确的找零，所以我们输出 true。
```

**示例 2：**

```
输入：[5,5,10]
输出：true
```

**示例 3：**

```
输入：[10,10]
输出：false
```

**示例 4：**

```
输入：[5,5,10,10,20]
输出：false
解释：
前 2 位顾客那里，我们按顺序收取 2 张 5 美元的钞票。
对于接下来的 2 位顾客，我们收取一张 10 美元的钞票，然后返还 5 美元。
对于最后一位顾客，我们无法退回 15 美元，因为我们现在只有两张 10 美元的钞票。
由于不是每位顾客都得到了正确的找零，所以答案是 false。
```

**提示：**

- `0 <= bills.length <= 10000`
- `bills[i]` 不是 `5` 就是 `10` 或是 `20` 



解题思路

```
贪心算法
```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

###### [969. 煎饼排序](https://leetcode-cn.com/problems/pancake-sorting/)

给你一个整数数组`arr`，请使用**煎饼翻转**完成对数组的排序。

一次煎饼翻转的执行过程如下：

- 选择一个整数`k`，`1 <= k <= arr.length`
- 反转子数组 `arr[0...k-1]`（**下标从 0 开始**）

例如，`arr = [3,2,1,4]`，选择`k = 3`进行一次煎饼翻转，反转子数组`[3,2,1]`，得到`arr = [1,2,3,4]`。

以数组形式返回能使`arr`有序的煎饼翻转操作所对应的`k`值序列。任何将数组排序且翻转次数在`10 * arr.length`范围内的有效答案都将被判断为正确。

**示例 1：**

```
输入：[3,2,4,1]
输出：[4,2,4,3]
解释：
我们执行 4 次煎饼翻转，k 值分别为 4，2，4，和 3。
初始状态 arr = [3, 2, 4, 1]
第一次翻转后（k = 4）：arr = [1, 4, 2, 3]
第二次翻转后（k = 2）：arr = [4, 1, 2, 3]
第三次翻转后（k = 4）：arr = [3, 2, 1, 4]
第四次翻转后（k = 3）：arr = [1, 2, 3, 4]，此时已完成排序。 
```

**示例 1：**

```
输入：[1,2,3]
输出：[]
解释：
输入已经排序，因此不需要翻转任何内容。
请注意，其他可能的答案，如 [3，3] ，也将被判断为正确。
```

提示：

- `1 <= arr.length <= 100`
- `1 <= arr[i] <= arr.length`
- `arr`中的所有整数互不相同（即`arr`是从`1`到`arr.length`整数的一个排列）



解题思路

```
984132657 排序
```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



#### 递归与栈（Stack）：解决表达式求值

##### 基础知识

栈适合解决什么问题？

处理一种具有完全包含关系的问题。

##### 栈结构基础应用

###### [227. 基本计算器 II](https://leetcode-cn.com/problems/basic-calculator-ii/)

给你一个字符串表达式 `s` ，请你实现一个基本计算器来计算并返回它的值。

整数除法仅保留整数部分。

**示例 1：**

```
输入：s = "3+2*2"
输出：7
```

**示例 2：**

```
输入：s = " 3/2 "
输出：1
```

**示例 3：**

```
输入：s = " 3+5 / 2 "
输出：5
```



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [面试题 03.04. 化栈为队](https://leetcode-cn.com/problems/implement-queue-using-stacks-lcci/)

实现一个MyQueue类，该类用两个栈来实现一个队列。

**示例：**

```
MyQueue queue = new MyQueue();

queue.push(1);
queue.push(2);
queue.peek();  // 返回 1
queue.pop();   // 返回 1
queue.empty(); // 返回 false
```

**说明：**

- 你只能使用标准的栈操作 -- 也就是只有 `push to top`, `peek/pop from top`, `size` 和 `is empty` 操作是合法的。
- 你所使用的语言也许不支持栈。你可以使用 list 或者 deque（双端队列）来模拟一个栈，只要是标准的栈操作即可。
- 假设所有操作都是有效的 （例如，一个空的队列不会调用 pop 或者 peek 操作）。

解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [682. 棒球比赛](https://leetcode-cn.com/problems/baseball-game/)

你现在是一场采用特殊赛制棒球比赛的记录员。这场比赛由若干回合组成，过去几回合的得分可能会影响以后几回合的得分。

比赛开始时，记录是空白的。你会得到一个记录操作的字符串列表 `ops`，其中 `ops[i]` 是你需要记录的第 `i` 项操作，`ops` 遵循下述规则：

1. 整数 `x` - 表示本回合新获得分数 `x`
2. `"+"` - 表示本回合新获得的得分是前两次得分的总和。题目数据保证记录此操作时前面总是存在两个有效的分数。
3. `"D"` - 表示本回合新获得的得分是前一次得分的两倍。题目数据保证记录此操作时前面总是存在一个有效的分数。
4. `"C"` - 表示前一次得分无效，将其从记录中移除。题目数据保证记录此操作时前面总是存在一个有效的分数。

请你返回记录中所有得分的总和。

**示例 1：**

```
输入：ops = ["5","2","C","D","+"]
输出：30
解释：
"5" - 记录加 5 ，记录现在是 [5]
"2" - 记录加 2 ，记录现在是 [5, 2]
"C" - 使前一次得分的记录无效并将其移除，记录现在是 [5].
"D" - 记录加 2 * 5 = 10 ，记录现在是 [5, 10].
"+" - 记录加 5 + 10 = 15 ，记录现在是 [5, 10, 15].
所有得分的总和 5 + 10 + 15 = 30
```

**示例 2：**

```
输入：ops = ["5","-2","4","C","D","9","+","+"]
输出：27
解释：
"5" - 记录加 5 ，记录现在是 [5]
"-2" - 记录加 -2 ，记录现在是 [5, -2]
"4" - 记录加 4 ，记录现在是 [5, -2, 4]
"C" - 使前一次得分的记录无效并将其移除，记录现在是 [5, -2]
"D" - 记录加 2 * -2 = -4 ，记录现在是 [5, -2, -4]
"9" - 记录加 9 ，记录现在是 [5, -2, -4, 9]
"+" - 记录加 -4 + 9 = 5 ，记录现在是 [5, -2, -4, 9, 5]
"+" - 记录加 9 + 5 = 14 ，记录现在是 [5, -2, -4, 9, 5, 14]
所有得分的总和 5 + -2 + -4 + 9 + 5 + 14 = 27
```

**示例 3：**

```
输入：ops = ["1"]
输出：1
```

**提示：**

- `1 <= ops.length <= 1000`
- `ops[i]` 为 `"C"`、`"D"`、`"+"`，或者一个表示整数的字符串。整数范围是 `[-3 * 10^4, 3 * 10^4]`
- 对于 `"+"` 操作，题目数据保证记录此操作时前面总是存在两个有效的分数
- 对于 `"C"` 和 `"D"` 操作，题目数据保证记录此操作时前面总是存在一个有效的分数



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [844. 比较含退格的字符串](https://leetcode-cn.com/problems/backspace-string-compare/)

给定 `S` 和 `T` 两个字符串，当它们分别被输入到空白的文本编辑器后，判断二者是否相等，并返回结果。 `#` 代表退格字符。

**注意：**如果对空文本输入退格字符，文本继续为空。

**示例 1：**

```
输入：S = "ab#c", T = "ad#c"
输出：true
解释：S 和 T 都会变成 “ac”。
```

**示例 2：**

```
输入：S = "ab##", T = "c#d#"
输出：true
解释：S 和 T 都会变成 “”。
```

**示例 3：**

```
输入：S = "a##c", T = "#a#c"
输出：true
解释：S 和 T 都会变成 “c”。
```

**示例 4：**

```
输入：S = "a#c", T = "b"
输出：false
解释：S 会变成 “c”，但 T 仍然是 “b”。
```

**提示：**

- `1 <= S.length <= 200`
- `1 <= T.length <= 200`
- `S` 和 `T` 只含有小写字母以及字符 `'#'`。

**进阶：**

- 你可以用 `O(N)` 的时间复杂度和 `O(1)` 的空间复杂度解决该问题吗？



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [946. 验证栈序列](https://leetcode-cn.com/problems/validate-stack-sequences/)

给定 pushed 和 popped 两个序列，每个序列中的 值都不重复，只有当它们可能是在最初空栈上进行的推入 push 和弹出 pop 操作序列的结果时，返回 true；否则，返回 false 。

**示例 1：**

```
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
输出：true
解释：我们可以按以下顺序执行：
push(1), push(2), push(3), push(4), pop() -> 4,
push(5), pop() -> 5, pop() -> 3, pop() -> 2, pop() -> 1
```

**示例 2：**

```
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
输出：false
解释：1 不能在 2 之前弹出。
```

提示：

`0 <= pushed.length == popped.length <= 1000`
`0 <= pushed[i], popped[i] < 1000`
`pushed` 是 `popped `的排列。



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

###### 

##### 栈结构扩展应用

###### [20. 有效的括号](https://leetcode-cn.com/problems/valid-parentheses/)

给定一个只包括 `'('，')'，'{'，'}'，'['，']' `的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。

**示例 1：**

```
输入：s = "()"
输出：true
```

**示例 2：**

```
输入：s = "()[]{}"
输出：true
```

**示例 3：**

```
输入：s = "(]"
输出：false
```

**示例 4：**

```
输入：s = "([)]"
输出：false
```

**示例 5：**

```
输入：s = "{[]}"
输出：true
```

**提示：**

- `1 <= s.length <= 104`
- `s` 仅由括号 `'()[]{}'` 组成



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [1021. 删除最外层的括号](https://leetcode-cn.com/problems/remove-outermost-parentheses/)

有效括号字符串为空 `("")`、`"(" + A + ")"` 或 `A + B`，其中 `A` 和 `B` 都是有效的括号字符串，`+` 代表字符串的连接。例如，`""`，`"()"`，`"(())()"` 和 `"(()(()))"` 都是有效的括号字符串。

如果有效字符串 `S` 非空，且不存在将其拆分为 `S = A+B` 的方法，我们称其为**原语（primitive）**，其中 `A` 和 `B` 都是非空有效括号字符串。

给出一个非空有效字符串 `S`，考虑将其进行原语化分解，使得：`S = P_1 + P_2 + ... + P_k`，其中 `P_i` 是有效括号字符串原语。

对 `S` 进行原语化分解，删除分解中每个原语字符串的最外层括号，返回 `S`。

**示例 1：**

```
输入："(()())(())"
输出："()()()"
解释：
输入字符串为 "(()())(())"，原语化分解得到 "(()())" + "(())"，
删除每个部分中的最外层括号后得到 "()()" + "()" = "()()()"。
```

**示例 2：**

```
输入："(()())(())(()(()))"
输出："()()()()(())"
解释：
输入字符串为 "(()())(())(()(()))"，原语化分解得到 "(()())" + "(())" + "(()(()))"，
删除每个部分中的最外层括号后得到 "()()" + "()" + "()(())" = "()()()()(())"。
```

**示例 3：**

```
输入："()()"
输出：""
解释：
输入字符串为 "()()"，原语化分解得到 "()" + "()"，
删除每个部分中的最外层括号后得到 "" + "" = ""。
```

**提示：**

1. `S.length <= 10000`
2. `S[i]` 为 `"("` 或 `")"`
3. `S` 是一个有效括号字符串



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [1249. 移除无效的括号](https://leetcode-cn.com/problems/minimum-remove-to-make-valid-parentheses/)

给你一个由 `'('`、`')'` 和小写字母组成的字符串 `s`。

你需要从字符串中删除最少数目的 `'('` 或者 `')'` （可以删除任意位置的括号)，使得剩下的「括号字符串」有效。

请返回任意一个合法字符串。

有效「括号字符串」应当符合以下 **任意一条** 要求:

- 空字符串或只包含小写字母的字符串
- 可以被写作 `AB`（`A` 连接 `B`）的字符串，其中 `A` 和 `B` 都是有效「括号字符串」
- 可以被写作 `(A)` 的字符串，其中 `A` 是一个有效的「括号字符串」

**示例 1：**

```
输入：s = "lee(t(c)o)de)"
输出："lee(t(c)o)de"
解释："lee(t(co)de)" , "lee(t(c)ode)" 也是一个可行答案。
```

**示例 2：**

```
输入：s = "a)b(c)d"
输出："ab(c)d"
```

**示例 3：**

```
输入：s = "))(("
输出：""
解释：空字符串也是有效的
```

**示例 4：**

```
输入：s = "(a(b(c)d)"
输出："a(b(c)d)"
```

**提示：**

- `1 <= s.length <= 10^5`
- `s[i]` 可能是 `'('`、`')'` 或英文小写字母



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [145. 二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/)

给定一个二叉树，返回它的 *后序* 遍历。

**示例:**

```
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 

输出: [3,2,1]
```

**进阶:** 递归算法很简单，你可以通过迭代算法完成吗？



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [331. 验证二叉树的前序序列化](https://leetcode-cn.com/problems/verify-preorder-serialization-of-a-binary-tree/)

序列化二叉树的一种方法是使用前序遍历。当我们遇到一个非空节点时，我们可以记录下这个节点的值。如果它是一个空节点，我们可以使用一个标记值记录，例如 `#`。

```
     _9_
    /   \
   3     2
  / \   / \
 4   1  #  6
/ \ / \   / \
# # # #   # #
```

例如，上面的二叉树可以被序列化为字符串 `"9,3,4,#,#,1,#,#,2,#,6,#,#"`，其中 `#` 代表一个空节点。

给定一串以逗号分隔的序列，验证它是否是正确的二叉树的前序序列化。编写一个在不重构树的条件下的可行算法。

每个以逗号分隔的字符或为一个整数或为一个表示 null 指针的` '#' `。

你可以认为输入格式总是有效的，例如它永远不会包含两个连续的逗号，比如` "1,,3" `。

**示例 1:**

```
输入: "9,3,4,#,#,1,#,#,2,#,6,#,#"
输出: true
```

**示例 2:**

```
输入: "1,#"
输出: false
```

**示例 3:**

```
输入: "9,#,#,1"
输出: false
```



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```



###### [636. 函数的独占时间](https://leetcode-cn.com/problems/exclusive-time-of-functions/)

给出一个非抢占单线程CPU的 **n** 个函数运行日志，找到函数的独占时间。

每个函数都有一个唯一的 Id，从 **0** 到 **n-1**，函数可能会递归调用或者被其他函数调用。

日志是具有以下格式的字符串：`function_id：start_or_end：timestamp。`例如：`"0:start:0"` 表示函数 0 从 0 时刻开始运行。`"0:end:0"` 表示函数 0 在 0 时刻结束。

函数的独占时间定义是在该方法中花费的时间，调用其他函数花费的时间不算该函数的独占时间。你需要根据函数的 Id 有序地返回每个函数的独占时间。

**示例 1:**

```
输入:
n = 2
logs = 
["0:start:0",
 "1:start:2",
 "1:end:5",
 "0:end:6"]
输出:[3, 4]
说明：
函数 0 在时刻 0 开始，在执行了  2个时间单位结束于时刻 1。
现在函数 0 调用函数 1，函数 1 在时刻 2 开始，执行 4 个时间单位后结束于时刻 5。
函数 0 再次在时刻 6 开始执行，并在时刻 6 结束运行，从而执行了 1 个时间单位。
所以函数 0 总共的执行了 2 +1 =3 个时间单位，函数 1 总共执行了 4 个时间单位。
```

说明：

1. 输入的日志会根据时间戳排序，而不是根据日志Id排序。
2. 你的输出会根据函数Id排序，也就意味着你的输出数组中序号为 0 的元素相当于函数 0 的执行时间。
3. 两个函数不会在同时开始或结束。
4. 函数允许被递归调用，直到运行结束。
5. 1 <= n <= 100



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```

##### 

###### [1124. 表现良好的最长时间段](https://leetcode-cn.com/problems/longest-well-performing-interval/)

给你一份工作时间表 `hours`，上面记录着某一位员工每天的工作小时数。

我们认为当员工一天中的工作小时数大于 `8` 小时的时候，那么这一天就是「**劳累的一天**」。

所谓「表现良好的时间段」，意味在这段时间内，「劳累的天数」是严格 **大于**「不劳累的天数」。

请你返回「表现良好时间段」的最大长度。

**示例 1：**

```
输入：hours = [9,9,6,0,6,6,9]
输出：3
解释：最长的表现良好时间段是 [9,9,6]。
```

**提示：**

- `1 <= hours.length <= 10000`
- `0 <= hours[i] <= 16`



解题思路

```

```

`Java`

```Java

```

`Golang`

```Golang

```

`Python`

```Python

```
