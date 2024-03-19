---
title: 【LeetCode】树结构相关
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 算法      # 分类
tags: [LeetCode,Java,Go,Python,scala] # 标签
index_img: /images/algorithm/lt-tree/index.jpg
---

### <!-- more--> 数结构相关与递归

####  **二叉树（Binary-Tree）与经典问题**

##### 二叉树的基本操作

###### [144. 二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

给你二叉树的根节点 `root` ，返回它节点值的 **前序** 遍历。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_1.jpg)

```
输入：root = [1,null,2,3]
输出：[1,2,3]
```

**示例 2：**

```
输入：root = []
输出：[]
```

**示例 3：**

```
输入：root = [1]
输出：[1]
```

**示例 4：**

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_5.jpg)

```
输入：root = [1,2]
输出：[1,2]
```

**示例 5：**

![](https://assets.leetcode.com/uploads/2020/09/15/inorder_4.jpg)

```
输入：root = [1,null,2]
输出：[1,2]
```

**提示：**

- 树中节点数目在范围 `[0, 100]` 内
- `-100 <= Node.val <= 100`

```Java
package com.weitrue.leetcode.editor.cn;


import java.util.ArrayList;
import java.util.List;

public class BinaryTreePreorderTraversal{
    public static void main(String[] args){
        Solution s = new BinaryTreePreorderTraversal().new Solution();
    }
    
    // Given the root of a binary tree, return the preorder traversal of its nodes' values.
    //
    // Example 1:
    // Input: root = [1,null,2,3]
    // Output: [1,2,3]
    //
    // Example 2:
    // Input: root = []
    // Output: []
    //
    // Example 3:
    // Input: root = [1]
    // Output: [1]
    //
    // Example 4:
    // Input: root = [1,2]
    // Output: [1,2]
    //
    // Example 5:
    // Input: root = [1,null,2]
    // Output: [1,2]
    //
    // Constraints:
    // The number of nodes in the tree is in the range [0, 100].
    // -100 <= Node.val <= 100
    //
    // Follow up: Recursive solution is trivial, could you do it iteratively?
    // Related Topics 栈 树
    // 👍 549 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for a binary tree node.
     */
      public class TreeNode {
          int val;
          TreeNode left;
          TreeNode right;
          TreeNode() {}
          TreeNode(int val) { this.val = val; }
          TreeNode(int val, TreeNode left, TreeNode right) {
              this.val = val;
              this.left = left;
              this.right = right;
          }
     }
    class Solution {

          List<Integer> ret = new ArrayList<>();
          public List<Integer> preorderTraversal(TreeNode root) {
              preOrder(root);
              return ret;
          }

          public void preOrder(TreeNode root) {
              if (root != null) {
                  ret.add(root.val);
                  preOrder(root.left);
                  preOrder(root.right);
              }
          }
    }
//leetcode submit region end(Prohibit modification and deletion)

}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 var ret []int

func preorderTraversal(root *TreeNode) []int {
    ret = make([]int, 0)
    preOrder(root)
    return ret
}

func preOrder(root *TreeNode) {
    if root == nil {
        return
    }
    ret = append(ret, root.Val)
    preOrder(root.Left)
    preOrder(root.Right)
}
```

```Python
"""
Module Description: 144-二叉树的前序遍历
Solution：
Author: Wang P
Problem:# 给你二叉树的根节点 root ，返回它节点值的 前序 遍历。 
        #  示例 1：
        # 输入：root = [1,null,2,3]
        # 输出：[1,2,3]
        #  示例 2：
        # 输入：root = []
        # 输出：[]
        #  示例 3：
        # 输入：root = [1]
        # 输出：[1]
        #  示例 4：
        # 输入：root = [1,2]
        # 输出：[1,2]
        #  示例 5：
        # 输入：root = [1,null,2]
        # 输出：[1,2]
        #
        #  提示：
        #  树中节点数目在范围 [0, 100] 内
        #  -100 <= Node.val <= 100
        #
        #  进阶：递归算法很简单，你可以通过迭代算法完成吗？
        #  Related Topics 栈 树
        #  👍 549 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.
from typing import List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:

    def __init__(self):
        self.ret = []

    def preorderTraversal(self, root: TreeNode) -> List[int]:
        self.pre_order(root)
        return self.ret

    def pre_order(self, root: TreeNode):
        if not root:
            return
        self.ret.append(root.val)
        self.pre_order(root.left)
        self.pre_order(root.right)

```

###### [589. N 叉树的前序遍历](https://leetcode-cn.com/problems/n-ary-tree-preorder-traversal/)

给定一个 N 叉树，返回其节点值的 **前序遍历** 。

N 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 `null` 分隔（请参见示例）。

**进阶：**

递归法很简单，你可以使用迭代法完成此题吗?

**示例 1：**

![](https://assets.leetcode.com/uploads/2018/10/12/narytreeexample.png)

```shell
输入：root = [1,null,3,2,4,null,5,6]
输出：[1,3,5,6,2,4]
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2019/11/08/sample_4_964.png)

```
输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
输出：[1,2,3,6,7,11,14,4,8,12,5,9,13,10]
```

**提示：**

- N 叉树的高度小于或等于 `1000`
- 节点总数在范围 `[0, 10^4]` 内

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.ArrayList;
import java.util.List;

public class NAryTreePreorderTraversal{
    public static void main(String[] args){
        Solution s = new NAryTreePreorderTraversal().new Solution();
    }
    
    // Given the root of an n-ary tree, return the preorder traversal of its nodes' values.
    // Nary-Tree input serialization is represented in their level order traversal.
    //Each group of children is separated by the null value (See examples)
    // Example 1:
    //Input: root = [1,null,3,2,4,null,5,6]
    //Output: [1,3,5,6,2,4]
    // Example 2:
    //Input: root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null
    //,12,null,13,null,null,14]
    //Output: [1,2,3,6,7,11,14,4,8,12,5,9,13,10]
    //
    // Constraints:
    // The number of nodes in the tree is in the range [0, 104].
    // 0 <= Node.val <= 104
    // The height of the n-ary tree is less than or equal to 1000.
    //
    // Follow up: Recursive solution is trivial, could you do it iteratively?
    // Related Topics 树
    // 👍 152 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    // Definition for a Node.
    class Node {
        public int val;
        public List<Node> children;

        public Node() {}

        public Node(int _val) {
            val = _val;
        }

        public Node(int _val, List<Node> _children) {
            val = _val;
            children = _children;
        }
    }

    class Solution {
        List<Integer> ret = new ArrayList<>();

        public List<Integer> preorder(Node root) {
            preOrder(root);
            return ret;
        }

        public void preOrder(Node root) {
            if (root != null) {
                ret.add(root.val);
                for (Node n: root.children) {
                    preOrder(n);
                }
            }
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

```Go
/**
 * Definition for a Node.
 * type Node struct {
 *     Val int
 *     Children []*Node
 * }
 */

var ret []int
func preorder(root *Node) []int {
    ret = make([]int, 0)
    preOrder(root)
    return ret
}

func preOrder(root *Node) {
    if root == nil {
        return
    }
    ret = append(ret, root.Val)
    for _, c := range root.Children {
        preOrder(c)
    }
}
```

```Python
"""
Module Description: 589-N 叉树的前序遍历
Solution：
Author: Wang P
Problem:# 给定一个 N 叉树，返回其节点值的 前序遍历 。 
        #  N 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 null 分隔（请参见示例）。
        #  进阶：
        #  递归法很简单，你可以使用迭代法完成此题吗?
        #  示例 1：
        # 输入：root = [1,null,3,2,4,null,5,6]
        # 输出：[1,3,5,6,2,4]
        # 示例 2：
        # 输入：root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,
        # null,13,null,null,14]
        # 输出：[1,2,3,6,7,11,14,4,8,12,5,9,13,10]
        #  提示：
        #  N 叉树的高度小于或等于 1000
        #  节点总数在范围 [0, 10^4] 内
        #  Related Topics 树
        #  👍 152 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
from typing import List

"""
# Definition for a Node.
"""
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children

class Solution:

    def __init__(self):
        self.ret = []

    def preorder(self, root: 'Node') -> List[int]:
        self.pre_order(root)
        return self.ret

    def pre_order(self, root: 'Node'):
        if not root:
            return
        self.ret.append(root.val)
        for c in root.children:
            self.pre_order(c)
        
# leetcode submit region end(Prohibit modification and deletion)
```

###### [226. 翻转二叉树](https://leetcode-cn.com/problems/invert-binary-tree/)

翻转一棵二叉树。

**示例：**

输入：

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

输出：

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

**备注:**
这个问题是受到 [Max Howell ](https://twitter.com/mxcl)的 [原问题](https://twitter.com/mxcl/status/608682016205344768) 启发的 ：

> 谷歌：我们90％的工程师使用您编写的软件(Homebrew)，但是您却无法在面试时在白板上写出翻转二叉树这道题，这太糟糕了。

```Java
package com.weitrue.leetcode.editor.cn;

public class InvertBinaryTree{
    public static void main(String[] args){
        Solution s = new InvertBinaryTree().new Solution();
    }
    
    // Given the root of a binary tree, invert the tree, and return its root.
    // Example 1:
    //Input: root = [4,2,7,1,3,6,9]
    //Output: [4,7,2,9,6,3,1]
    // Example 2:
    //Input: root = [2,1,3]
    //Output: [2,3,1]
    // Example 3:
    //Input: root = []
    //Output: []
    //
    // Constraints:
    // The number of nodes in the tree is in the range [0, 100].
    // -100 <= Node.val <= 100
    //
    // Related Topics 树
    // 👍 807 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for a binary tree node.
 */

    public class TreeNode {
         int val;
         TreeNode left;
         TreeNode right;
         TreeNode() {}
         TreeNode(int val) { this.val = val; }
         TreeNode(int val, TreeNode left, TreeNode right) {
             this.val = val;
             this.left = left;
             this.right = right;
         }
     }

    class Solution {
        public TreeNode invertTree(TreeNode root) {
            if (root == null) {
                return null;
            }
            invertTree(root.left);
            invertTree(root.right);
            TreeNode temp = root.left;
            root.left = root.right;
            root.right = temp;
            return root;
        }
    }
//leetcode submit region end(Prohibit modification and deletion)

}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    invertTree(root.Left)
    invertTree(root.Right)
    root.Left, root.Right = root.Right, root.Left 
    return root
}
```

```Python
"""
Module Description: 226-翻转二叉树
Solution：
Author: Wang P
Problem:# 翻转一棵二叉树。 
        #  示例：
        #  输入：
        #       4
        #    /   \
        #   2     7
        #  / \   / \
        # 1   3 6   9
        #  输出：
        #       4
        #    /   \
        #   7     2
        #  / \   / \
        # 9   6 3   1
        #  备注:
        # 这个问题是受到 Max Howell 的 原问题 启发的 ：
        #
        #  谷歌：我们90％的工程师使用您编写的软件(Homebrew)，但是您却无法在面试时在白板上写出翻转二叉树这道题，这太糟糕了。
        #  Related Topics 树
        #  👍 807 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def invertTree(self, root: TreeNode) -> TreeNode:
        if not root:
            return None
        self.invertTree(root.left)
        self.invertTree(root.right)
        root.left, root.right = root.right, root.left
        return root
# leetcode submit region end(Prohibit modification and deletion)
```

###### [剑指 Offer 32 - II. 从上到下打印二叉树 II](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。

例如:
给定二叉树: `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

返回其层次遍历结果：

```
[
  [3],
  [9,20],
  [15,7]
]
```

**提示：**

1. `节点总数 <= 1000`

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.ArrayList;
import java.util.List;

public class CongShangDaoXiaDaYinErChaShuIiLcof{
    public static void main(String[] args){
        Solution s = new CongShangDaoXiaDaYinErChaShuIiLcof().new Solution();
    }
    
    //English description is not available for the problem. Please switch to Chinese
    //. Related Topics 树 广度优先搜索
    // 👍 95 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for a binary tree node.
     */
    public class TreeNode {
         int val;
         TreeNode left;
         TreeNode right;
         TreeNode(int x) { val = x; }
    }

    class Solution {

        List<List<Integer>> liiRet = new ArrayList<>();
        public List<List<Integer>> levelOrder(TreeNode root) {

            signKLevel(root, 0);
            return liiRet;
        }

        public void signKLevel(TreeNode root, int k) {
            if (root != null) {
                if (liiRet.size() == k) {
                    liiRet.add(new ArrayList<>());
                }
                liiRet.get(k).add(root.val);
                signKLevel(root.left, k+1);
                signKLevel(root.right, k+1);
            }
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)
}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
var ret [][]int
func levelOrder(root *TreeNode) [][]int {
    // write code here
    ret = make([][]int, 0)
    if root == nil {
        return ret
    }
    ret = append(ret, []int{})
    travelTree(root, 0)
    return ret
}

func travelTree(root *TreeNode, k int) {
    if root == nil {
        return 
    }
    if len(ret) == k {
        ret = append(ret, []int{})
    }
    ret[k] = append(ret[k], root.Val)
    travelTree(root.Left, k+1)
    travelTree(root.Right, k+1)
}
```

```Python
"""
Module Description: 剑指 Offer 32 - II-从上到下打印二叉树 II
Solution：
Date: 2021-04-03 12:10:11
Author: Wang P
Problem:# 从上到下按层打印二叉树，同一层的节点按从左到右的顺序打印，每一层打印到一行。 
        #  例如:
        # 给定二叉树: [3,9,20,null,null,15,7],
        #      3
        #    / \
        #   9  20
        #     /  \
        #    15   7
        #  返回其层次遍历结果：
        #  [
        #   [3],
        #   [9,20],
        #   [15,7]
        # ]
        #  提示：
        #  节点总数 <= 1000
        #  注意：本题与主站 102 题相同：https://leetcode-cn.com/problems/binary-tree-level-order-traversal/
        #  Related Topics 树 广度优先搜索
        #  👍 95 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.
from typing import List


class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None


class Solution:
    def __init__(self):
        self.lii_ret = []

    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        self.sign_k_level(root, 0)
        return self.lii_ret

    def sign_k_level(self, root: TreeNode, k: int):
        if not root:
            return

        if len(self.lii_ret) == k:
            self.lii_ret.append([])

        self.lii_ret[k].append(root.val)
        self.sign_k_level(root.left, k+1)
        self.sign_k_level(root.right, k+1)

# leetcode submit region end(Prohibit modification and deletion)
```

###### [107. 二叉树的层序遍历 II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)

给定一个二叉树，返回其节点值自底向上的层序遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历）

例如：
给定二叉树 `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

返回其自底向上的层序遍历为：

```
[
  [15,7],
  [9,20],
  [3]
]
```

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.ArrayList;
import java.util.List;

public class BinaryTreeLevelOrderTraversalIi{
    public static void main(String[] args){
        Solution s = new BinaryTreeLevelOrderTraversalIi().new Solution();
    }
    
    //Given the root of a binary tree, return the bottom-up level order traversal of its nodes' values. (i.e., from left to right, level by level from leaf to root).
    // Example 1:
    //Input: root = [3,9,20,null,null,15,7]
    //Output: [[15,7],[9,20],[3]]
    // Example 2:
    //Input: root = [1]
    //Output: [[1]]
    // Example 3:
    //Input: root = []
    //Output: []
    //
    // Constraints:
    // The number of nodes in the tree is in the range [0, 2000].
    // -1000 <= Node.val <= 1000
    //
    // Related Topics 树 广度优先搜索
    // 👍 423 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for a binary tree node.
     */
    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }

    class Solution {

        List<List<Integer>> liiRet = new ArrayList<>();
        public List<List<Integer>> levelOrderBottom(TreeNode root) {
            signKLevel(root, 0);
            for (int i = 0, j=liiRet.size()-1; i < j; i++, j--) {
                List<Integer> tmp = liiRet.get(i);
                liiRet.set(i, liiRet.get(j));
                liiRet.set(j, tmp);
            }
            return liiRet;
        }

        public void signKLevel(TreeNode root, int k) {

            if (root != null) {
                if (liiRet.size() == k) {
                    liiRet.add(new ArrayList<>());
                }
                liiRet.get(k).add(root.val);
                signKLevel(root.left, k+1);
                signKLevel(root.right, k+1);
            }
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)
}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
 var ret [][]int

func levelOrderBottom(root *TreeNode) [][]int {
    ret = make([][]int, 0)
    if root == nil {
        return ret
    }
    travelTree(root, 0)
    for i, j := 0, len(ret) - 1; i < j; i,j = i+1, j-1 {
        ret[i], ret[j] = ret[j], ret[i]
    }
    return ret
}

func travelTree(root *TreeNode, k int) {
    if root == nil {
        return 
    }
    if len(ret) == k {
        ret = append(ret, []int{})
    }
    ret[k] = append(ret[k], root.Val)
    travelTree(root.Left, k+1)
    travelTree(root.Right, k+1)
}
```

```Python
"""
Module Description: 107-二叉树的层序遍历 II
Solution：
Date: 2021-04-03 12:32:50
Author: Wang P
Problem:# 给定一个二叉树，返回其节点值自底向上的层序遍历。 （即按从叶子节点所在层到根节点所在的层，逐层从左向右遍历） 
        #  例如：
        # 给定二叉树 [3,9,20,null,null,15,7],
        #     3
        #    / \
        #   9  20
        #     /  \
        #    15   7
        #  返回其自底向上的层序遍历为：
        # [
        #   [15,7],
        #   [9,20],
        #   [3]
        # ]
        #
        #  Related Topics 树 广度优先搜索
        #  👍 423 👎 0

"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.
from typing import List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:

    def __init__(self):
        self.lii_ret = []

    def sign_k_level(self, root: TreeNode, k: int):
        if not root:
            return

        if len(self.lii_ret) == k:
            self.lii_ret.append([])

        self.lii_ret[k].append(root.val)
        self.sign_k_level(root.left, k + 1)
        self.sign_k_level(root.right, k + 1)

    def levelOrderBottom(self, root: TreeNode) -> List[List[int]]:
        self.sign_k_level(root, 0)
        self.lii_ret.reverse()
        return self.lii_ret
# leetcode submit region end(Prohibit modification and deletion)
```

###### [103. 二叉树的锯齿形层序遍历](https://leetcode-cn.com/problems/binary-tree-zigzag-level-order-traversal/)

给定一个二叉树，返回其节点值的锯齿形层序遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。

例如：
给定二叉树 `[3,9,20,null,null,15,7]`,

```
    3
   / \
  9  20
    /  \
   15   7
```

返回锯齿形层序遍历如下：

```
[
  [3],
  [20,9],
  [15,7]
]
```

```Java
package com.weitrue.leetcode.editor.cn;

import java.util.ArrayList;
import java.util.List;

public class BinaryTreeZigzagLevelOrderTraversal{
    public static void main(String[] args){
        Solution s = new BinaryTreeZigzagLevelOrderTraversal().new Solution();
    }
    
    //Given the root of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).
    // Example 1:
    //Input: root = [3,9,20,null,null,15,7]
    //Output: [[3],[20,9],[15,7]]
    // Example 2:
    //Input: root = [1]
    //Output: [[1]]
    // Example 3:
    //Input: root = []
    //Output: []
    //
    // Constraints:
    // The number of nodes in the tree is in the range [0, 2000].
    // -100 <= Node.val <= 100
    //
    // Related Topics 栈 树 广度优先搜索
    // 👍 424 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
/**
 * Definition for a binary tree node.
 */
public class TreeNode {
     int val;
     TreeNode left;
     TreeNode right;
     TreeNode() {}
     TreeNode(int val) { this.val = val; }
     TreeNode(int val, TreeNode left, TreeNode right) {
         this.val = val;
         this.left = left;
         this.right = right;
     }
 }

class Solution {

    List<List<Integer>> liiRet = new ArrayList<>();
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        signKLevel(root, 0);
        for (int k = 0; k < liiRet.size(); k++) {
            if (k%2 == 1) {

                for (int i = 0, j=liiRet.get(k).size()-1; i < j; i++, j--) {
                    int tmp = liiRet.get(k).get(i);
                    liiRet.get(k).set(i, liiRet.get(k).get(j));
                    liiRet.get(k).set(j, tmp);
                }
            }
        }
        return liiRet;
    }

    public void signKLevel(TreeNode root, int k) {

        if (root != null) {
            if (liiRet.size() == k) {
                liiRet.add(new ArrayList<>());
            }
            liiRet.get(k).add(root.val);
            signKLevel(root.left, k+1);
            signKLevel(root.right, k+1);
        }
    }
}
//leetcode submit region end(Prohibit modification and deletion)

}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */

var ret [][]int

func zigzagLevelOrder(root *TreeNode) [][]int {
    // write code here
    ret = make([][]int, 0)
    if root == nil {
        return ret
    }
    ret = append(ret, []int{})
    travelTree(root, 0)
    for i, v := range ret {
        if i% 2 == 1 {
            for j, k := 0, len(v)-1; j<k; j, k = j+1, k-1 {
                v[j], v[k] = v[k], v[j]
            }
        }
    }
    return ret
}

func travelTree(root *TreeNode, k int) {
    if root == nil {
        return 
    }
    if len(ret) == k {
        ret = append(ret, []int{})
    }
    ret[k] = append(ret[k], root.Val)
    travelTree(root.Left, k+1)
    travelTree(root.Right, k+1)
}
```

```Python
"""
Module Description: 103-二叉树的锯齿形层序遍历
Solution：
Author: Wang P
Problem:# 给定一个二叉树，返回其节点值的锯齿形层序遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。 
        #  例如：
        # 给定二叉树 [3,9,20,null,null,15,7],
        #     3
        #    / \
        #   9  20
        #     /  \
        #    15   7
        #  返回锯齿形层序遍历如下：
        # [
        #   [3],
        #   [20,9],
        #   [15,7]
        # ]
        #
        #  Related Topics 栈 树 广度优先搜索
        #  👍 424 👎 0

        """
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.
from typing import List


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:

    def __init__(self):
        self.lii_ret = []

    def sign_k_level(self, root: TreeNode, k: int):
        if not root:
            return

        if len(self.lii_ret) == k:
            self.lii_ret.append([])

        self.lii_ret[k].append(root.val)
        self.sign_k_level(root.left, k + 1)
        self.sign_k_level(root.right, k + 1)

    def zigzagLevelOrder(self, root: TreeNode) -> List[List[int]]:
        self.sign_k_level(root, 0)
        for i in range(0, len(self.lii_ret)):
            if i % 2 == 1:
                self.lii_ret[i].reverse()
        return self.lii_ret

# leetcode submit region end(Prohibit modification and deletion)
```

##### 二叉树的进阶操作

###### [110. 平衡二叉树](https://leetcode-cn.com/problems/balanced-binary-tree/)

给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：

> 一个二叉树*每个节点* 的左右两个子树的高度差的绝对值不超过 1 。

**示例 1：**

![](https://assets.leetcode.com/uploads/2020/10/06/balance_1.jpg)

```
输入：root = [3,9,20,null,null,15,7]
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2020/10/06/balance_2.jpg)

```
输入：root = [1,2,2,3,3,null,null,4,4]
输出：false
```

**示例 3：**

```
输入：root = []
输出：true
```

**提示：**

- 树中的节点数在范围 `[0, 5000]` 内
- `-104 <= Node.val <= 104`

```Java
package com.weitrue.leetcode.editor.cn;

public class BalancedBinaryTree{
    public static void main(String[] args){
        Solution s = new BalancedBinaryTree().new Solution();
    }
    
    //Given a binary tree, determine if it is height-balanced.
    // For this problem, a height-balanced binary tree is defined as:
    // a binary tree in which the left and right subtrees of every node differ in height by no more than 1.
    // Example 1:
    //Input: root = [3,9,20,null,null,15,7]
    //Output: true
    // Example 2:
    //Input: root = [1,2,2,3,3,null,null,4,4]
    //Output: false
    // Example 3:
    //Input: root = []
    //Output: true
    // Constraints:
    // The number of nodes in the tree is in the range [0, 5000].
    // -104 <= Node.val <= 104
    //
    // Related Topics 树 深度优先搜索 递归
    // 👍 652 👎 0
 
    //leetcode submit region begin(Prohibit modification and deletion)
    /**
     * Definition for a binary tree node.
     *
     */

    public class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;
        TreeNode() {}
        TreeNode(int val) { this.val = val; }
        TreeNode(int val, TreeNode left, TreeNode right) {
            this.val = val;
            this.left = left;
            this.right = right;
        }
    }
    class Solution {
        public boolean isBalanced(TreeNode root) {
            return getTreeHeight(root) >= 0;
        }

        public int getTreeHeight(TreeNode root) {
            if (root == null) {
                return 0;
            }
            int l = getTreeHeight(root.left);
            int r = getTreeHeight(root.right);
            if (l < 0 || r < 0 || Math.abs(l-r) > 1) {
                return -1;
            }
            return Math.max(l, r) + 1;
        }
    }
    //leetcode submit region end(Prohibit modification and deletion)

}
```

```Go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func isBalanced(root *TreeNode) bool {
	return treeHeight(root) >= 0
}

func treeHeight(root *TreeNode) int {
	if root == nil {
		return 0
	}
	l := treeHeight(root.Left)
	r := treeHeight(root.Right)

	if l < 0 || r < 0 || math.Abs(float64(l-r)) > 1 {
		return -1
	}
	return int(math.Max(float64(l), float64(r))) + 1
}
```

```Python
"""
Module Description: 110-平衡二叉树
Solution：
Author: Wang P
Problem:# 给定一个二叉树，判断它是否是高度平衡的二叉树。 
        #  本题中，一棵高度平衡二叉树定义为：
        #  一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。
        #  示例 1：
        # 输入：root = [3,9,20,null,null,15,7]
        # 输出：true
        #  示例 2：
        # 输入：root = [1,2,2,3,3,null,null,4,4]
        # 输出：false
        #  示例 3：
        # 输入：root = []
        # 输出：true
        #
        #  提示：
        #  树中的节点数在范围 [0, 5000] 内
        #  -104 <= Node.val <= 104
        #
        #  Related Topics 树 深度优先搜索 递归
        #  👍 652 👎 0
"""
# leetcode submit region begin(Prohibit modification and deletion)
# Definition for a binary tree node.


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


class Solution:
    def isBalanced(self, root: TreeNode) -> bool:
        return self.get_tree_height(root) >= 0

    def get_tree_height(self, root: TreeNode) -> int:
        if not root:
            return 0

        l, r = self.get_tree_height(root.left), self.get_tree_height(root.right)
        if l < 0 or r < 0 or abs(l-r) > 1:
            return -1
        return max(l, r) + 1
# leetcode submit region end(Prohibit modification and deletion)
```

###### [112. 路径总和](https://leetcode-cn.com/problems/path-sum/)

给你二叉树的根节点 root 和一个表示目标和的整数 targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。

**叶子节点** 是指没有子节点的节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsum1.jpg)

```
输入：root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22
输出：true
```

**示例 2：**

![](https://assets.leetcode.com/uploads/2021/01/18/pathsum2.jpg)

```
输入：root = [1,2,3], targetSum = 5
输出：false
```

**示例 3**

```
输入：root = [1,2], targetSum = 0
输出：false
```

**提示：**

- 树中节点的数目在范围 [0, 5000] 内
- -1000 <= Node.val <= 1000
- -1000 <= targetSum <= 1000

```Java

```

```Go

```

```Python

```

###### [105. 从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

根据一棵树的前序遍历与中序遍历构造二叉树。

**注意:**
你可以假设树中没有重复的元素。

例如，给出

```
前序遍历 preorder = [3,9,20,15,7]
中序遍历 inorder = [9,3,15,20,7]
```

返回如下的二叉树：

```
    3
   / \
  9  20
    /  \
   15   7
```

```Java

```

```Go

```

```Python

```

###### [222. 完全二叉树的节点个数](https://leetcode-cn.com/problems/count-complete-tree-nodes/)

给你一棵 完全二叉树 的根节点 root ，求出该树的节点个数。

完全二叉树 的定义如下：在完全二叉树中，除了最底层节点可能没填满外，其余每层节点数都达到最大值，并且最下面一层的节点都集中在该层最左边的若干位置。若最底层为第 h 层，则该层包含 1~ 2^h 个节点。

**示例 1：**

![](https://assets.leetcode.com/uploads/2021/01/14/complete.jpg)

```
输入：root = [1,2,3,4,5,6]
输出：6
```

**示例 2：**

```
输入：root = []
输出：0
```

**示例 3：**

```
输入：root = [1]
输出：1
```

**提示：**

- 树中节点的数目范围是`[0, 5 * 104]`
- `0 <= Node.val <= 5 * 104`
- 题目数据保证输入的树是 **完全二叉树**

```Java

```

```Go

```

```Python

```

###### [剑指 Offer 54. 二叉搜索树的第k大节点](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

给定一棵二叉搜索树，请找出其中第k大的节点。

**示例 1:**

```
输入: root = [3,1,4,null,2], k = 1
   3
  / \
 1   4
  \
   2
输出: 4
```

**示例 2:**

```
输入: root = [5,3,6,2,4,null,null,1], k = 3
       5
      / \
     3   6
    / \
   2   4
  /
 1
输出: 4
```

**限制：**

1 ≤ k ≤ 二叉搜索树元素个数

```Java

```

```Go

```

```Python

```

###### [剑指 Offer 26. 树的子结构](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/)

输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

B是A的子结构， 即 A中有出现和B相同的结构和节点值。

例如:
给定的树 A:

```
     3
    / \
   4   5
  / \
 1   2
```

给定的树 B：

```
   4 
  /
 1
```

返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

**示例 1：**

```
输入：A = [1,2,3], B = [3,1]
输出：false
```

**示例 2：**

```
输入：A = [3,4,5,1,2], B = [4,1]
输出：true
```

**限制：**

```
0 <= 节点个数 <= 10000
```

```Java

```

```Go

```

```Python

```

###### [662. 二叉树最大宽度](https://leetcode-cn.com/problems/maximum-width-of-binary-tree/)

给定一个二叉树，编写一个函数来获取这个树的最大宽度。树的宽度是所有层中的最大宽度。这个二叉树与满二叉树（full binary tree）结构相同，但一些节点为空。

每一层的宽度被定义为两个端点（该层最左和最右的非空节点，两端点间的null节点也计入长度）之间的长度。

**示例 1:**

```
输入: 

           1
         /   \
        3     2
       / \     \  
      5   3     9 

输出: 4
解释: 最大值出现在树的第 3 层，宽度为 4 (5,3,null,9)。
```

**示例 2:**

```
输入: 

          1
         /  
        3    
       / \       
      5   3     

输出: 2
解释: 最大值出现在树的第 3 层，宽度为 2 (5,3)。
```

**示例 3:**

```
输入: 

          1
         / \
        3   2 
       /        
      5      

输出: 2
解释: 最大值出现在树的第 2 层，宽度为 2 (3,2)。
```

**示例 4:**

```
输入: 

          1
         / \
        3   2
       /     \  
      5       9 
     /         \
    6           7
输出: 8
解释: 最大值出现在树的第 4 层，宽度为 8 (6,null,null,null,null,null,null,7)。
```

**注意:** 答案在32位有符号整数的表示范围内。

```Java

```

```Go

```

```Python

```

###### [968. 监控二叉树](https://leetcode-cn.com/problems/binary-tree-cameras/)

给定一个二叉树，我们在树的节点上安装摄像头。

节点上的每个摄影头都可以监视**其父对象、自身及其直接子对象。**

计算监控树的所有节点所需的最小摄像头数量。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/29/bst_cameras_01.png)

```
输入：[0,0,null,0,0]
输出：1
解释：如图所示，一台摄像头足以监控所有节点。
```

**示例 2：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/29/bst_cameras_02.png)

```
输入：[0,0,null,0,null,0,null,null,0]
输出：2
解释：需要至少两个摄像头来监视树的所有节点。 上图显示了摄像头放置的有效位置之一。
```

**提示：**

1. 给定树的节点数的范围是 `[1, 1000]`。
2. 每个节点的值都是 0。

```Java

```

```Go

```

```Python

```



#### **堆（Heap）与优先队列**

> 维护集合最值

##### 基础应用

###### [剑指 Offer 40. 最小的k个数](https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/)

输入整数数组 `arr` ，找出其中最小的 `k` 个数。例如，输入4、5、1、6、2、7、3、8这8个数字，则最小的4个数字是1、2、3、4。

**示例 1：**

```
输入：arr = [3,2,1], k = 2
输出：[1,2] 或者 [2,1]
```

**示例 2：**

```
输入：arr = [0,1,2,1], k = 1
输出：[0]
```

**限制：**

- `0 <= k <= arr.length <= 10000`
- `0 <= arr[i] <= 10000`

```
大顶堆堆顶为k个数的最大的
遍历数组，入堆 如果入堆后堆的大小大于k，出堆
```



```Java

```

```Go

```

```Python

```

###### [1046. 最后一块石头的重量](https://leetcode-cn.com/problems/last-stone-weight/)

有一堆石头，每块石头的重量都是正整数。

每一回合，从中选出两块 **最重的** 石头，然后将它们一起粉碎。假设石头的重量分别为 x 和 y，且 x <= y。那么粉碎的可能结果如下：

- 如果 x == y，那么两块石头都会被完全粉碎；
- 如果 x != y，那么重量为 x 的石头将会完全粉碎，而重量为 y 的石头新重量为 y-x。

最后，最多只会剩下一块石头。返回此石头的重量。如果没有石头剩下，就返回 `0`。

**示例：**

```
输入：[2,7,4,1,8,1]
输出：1
解释：
先选出 7 和 8，得到 1，所以数组转换为 [2,4,1,1,1]，
再选出 2 和 4，得到 2，所以数组转换为 [2,1,1,1]，
接着是 2 和 1，得到 1，所以数组转换为 [1,1,1]，
最后选出 1 和 1，得到 0，最终数组转换为 [1]，这就是最后剩下那块石头的重量。
```

**提示：**

- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 1000`

```
大顶堆
```



```Java

```

```Go

```

```Python

```

###### [703. 数据流中的第 K 大元素](https://leetcode-cn.com/problems/kth-largest-element-in-a-stream/)

设计一个找到数据流中第 `k` 大元素的类`（class）`。注意是排序后的第 `k` 大元素，不是第 `k` 个不同的元素。

请实现 `KthLargest` 类：

- `KthLargest(int k, int[] nums)` 使用整数 k 和整数流 `nums `初始化对象。
- `int add(int val) `将 val 插入数据流 `nums `后，返回当前数据流中第 `k` 大的元素。

**示例：**

```
输入：
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
输出：
[null, 4, 5, 5, 8, 8]

解释：
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3);   // return 4
kthLargest.add(5);   // return 5
kthLargest.add(10);  // return 5
kthLargest.add(9);   // return 8
kthLargest.add(4);   // return 8
```

**提示：**

- `1 <= k <= 10^4`
- `0 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `-10^4 <= val <= 10^4`
- 最多调用 add 方法` 10^4` 次
- 题目数据保证，在查找第 k 大元素时，数组中至少有 k 个元素

```
小顶堆堆顶为k个数的最大的
```



```Java

```

```Go

```

```Python

```

###### [215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

在未排序的数组中找到第 **k** 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

**示例 1:**

```
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
```

**示例 2:**

```
输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
```

**说明:**

你可以假设 k 总是有效的，且 1 ≤ k ≤ 数组的长度。

```Java

```

```Go

```

```Python

```

###### [373. 查找和最小的K对数字](https://leetcode-cn.com/problems/find-k-pairs-with-smallest-sums/)

给定两个以升序排列的整形数组 nums1 和 nums2, 以及一个整数 k。

定义一对值 (u,v)，其中第一个元素来自 nums1，第二个元素来自 nums2。

找到和最小的 k 对数字 (u1,v1), (u2,v2) ... (uk,vk)。

**示例 1:**

```
输入: nums1 = [1,7,11], nums2 = [2,4,6], k = 3
输出: [1,2],[1,4],[1,6]
解释: 返回序列中的前 3 对数：
     [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]
```

**示例 2:**

```
输入: nums1 = [1,1,2], nums2 = [1,2,3], k = 2
输出: [1,1],[1,1]
解释: 返回序列中的前 2 对数：
     [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]
```

**示例 3:**

```
输入: nums1 = [1,2], nums2 = [3], k = 3 
输出: [1,3],[2,3]
解释: 也可能序列中所有的数对都被返回:[1,3],[2,3]
```

```Java

```

```Go

```

```Python

```

##### 进阶应用

###### [692. 前K个高频单词](https://leetcode-cn.com/problems/top-k-frequent-words/)

给一非空的单词列表，返回前 *k* 个出现次数最多的单词。

返回的答案应该按单词出现频率由高到低排序。如果不同的单词有相同出现频率，按字母顺序排序。

**示例 1：**

```
输入: ["i", "love", "leetcode", "i", "love", "coding"], k = 2
输出: ["i", "love"]
解析: "i" 和 "love" 为出现次数最多的两个单词，均为2次。
    注意，按字母顺序 "i" 在 "love" 之前。
```

**示例 2：**

```
输入: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], k = 4
输出: ["the", "is", "sunny", "day"]
解析: "the", "is", "sunny" 和 "day" 是出现次数最多的四个单词，
    出现次数依次为 4, 3, 2 和 1 次。
```

**注意：**

1. 假定 *k* 总为有效值， 1 ≤ *k* ≤ 集合元素数。
2. 输入的单词均由小写字母组成。

```Java

```

```Go

```

```Python

```

###### [剑指 Offer 41. 数据流中的中位数](https://leetcode-cn.com/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/)

如何得到一个数据流中的中位数？如果从数据流中读出奇数个数值，那么中位数就是所有数值排序之后位于中间的数值。如果从数据流中读出偶数个数值，那么中位数就是所有数值排序之后中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

**示例 1：**

```
输入：
["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
[[],[1],[2],[],[3],[]]
输出：[null,null,null,1.50000,null,2.00000]
```

**示例 2：**

```
输入：
["MedianFinder","addNum","findMedian","addNum","findMedian"]
[[],[2],[],[3],[]]
输出：[null,null,2.00000,null,2.50000]
```

###### [295. 数据流的中位数](https://leetcode-cn.com/problems/find-median-from-data-stream/)

中位数是有序列表中间的数。如果列表长度是偶数，中位数则是中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

**示例：**

```
addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3) 
findMedian() -> 2
```

进阶:

- 如果数据流中所有整数都在 0 到 100 范围内，你将如何优化你的算法？
- 如果数据流中 99% 的整数都在 0 到 100 范围内，你将如何优化你的算法？

```
两个堆
```



```Java

```

```Go

```

```Python

```

###### [355. 设计推特](https://leetcode-cn.com/problems/design-twitter/)

设计一个简化版的推特(Twitter)，可以让用户实现发送推文，关注/取消关注其他用户，能够看见关注人（包括自己）的最近十条推文。你的设计需要支持以下的几个功能

- `postTweet(userId, tweetId)`: 创建一条新的推文
- `getNewsFeed(userId)`: 检索最近的十条推文。每个推文都必须是由此用户关注的人或者是用户自己发出的。推文必须按照时间顺序由最近的开始排序。
- `follow(followerId, followeeId)`: 关注一个用户
- `unfollow(followerId, followeeId)`: 取消关注一个用户

**示例:**

```
Twitter twitter = new Twitter();

// 用户1发送了一条新推文 (用户id = 1, 推文id = 5).
twitter.postTweet(1, 5);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
twitter.getNewsFeed(1);

// 用户1关注了用户2.
twitter.follow(1, 2);

// 用户2发送了一个新推文 (推文id = 6).
twitter.postTweet(2, 6);

// 用户1的获取推文应当返回一个列表，其中包含两个推文，id分别为 -> [6, 5].
// 推文id6应当在推文id5之前，因为它是在5之后发送的.
twitter.getNewsFeed(1);

// 用户1取消关注了用户2.
twitter.unfollow(1, 2);

// 用户1的获取推文应当返回一个列表，其中包含一个id为5的推文.
// 因为用户1已经不再关注用户2.
twitter.getNewsFeed(1);
```

```Java

```

```Go

```

```Python

```

###### [面试题 17.20. 连续中值](https://leetcode-cn.com/problems/continuous-median-lcci/)

随机产生数字并传递给一个方法。你能否完成这个方法，在每次产生新值时，寻找当前所有值的中间值（中位数）并保存。

中位数是有序列表中间的数。如果列表长度是偶数，中位数则是中间两个数的平均值。

例如，

[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- void addNum(int num) - 从数据流中添加一个整数到数据结构中。
- double findMedian() - 返回目前所有元素的中位数。

**示例：**

 ```
addNum(1)
addNum(2)
findMedian() -> 1.5
addNum(3) 
findMedian() -> 2
 ```

```Java

```

```Go

```

```Python

```

###### [1801. 积压订单中的订单总数](https://leetcode-cn.com/problems/number-of-orders-in-the-backlog/)

给你一个二维整数数组 `orders` ，其中每个 `orders[i] = [pricei, amounti, orderTypei] `表示有 `amounti `笔类型为 `orderTypei `、价格为` pricei` 的订单。

订单类型 `orderTypei` 可以分为两种：

- `0` 表示这是一批采购订单 `buy`
- `1` 表示这是一批销售订单 `sell`

注意，orders[i] 表示一批共计 amounti 笔的独立订单，这些订单的价格和类型相同。对于所有有效的 i ，由 orders[i] 表示的所有订单提交时间均早于 orders[i+1] 表示的所有订单。

存在由未执行订单组成的 **积压订单** 。积压订单最初是空的。提交订单时，会发生以下情况：

- 如果该订单是一笔采购订单 buy ，则可以查看积压订单中价格 最低 的销售订单 sell 。如果该销售订单 sell 的价格 低于或等于 当前采购订单 buy 的价格，则匹配并执行这两笔订单，并将销售订单 sell 从积压订单中删除。否则，采购订单 buy 将会添加到积压订单中。
- 反之亦然，如果该订单是一笔销售订单 sell ，则可以查看积压订单中价格 最高 的采购订单 buy 。如果该采购订单 buy 的价格 高于或等于 当前销售订单 sell 的价格，则匹配并执行这两笔订单，并将采购订单 buy 从积压订单中删除。否则，销售订单 sell 将会添加到积压订单中。

输入所有订单后，返回积压订单中的 **订单总数** 。由于数字可能很大，所以需要返回对 `109 + 7` 取余的结果。

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/03/21/ex1.png)

```
输入：orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0]]
输出：6
解释：输入订单后会发生下述情况：
- 提交 5 笔采购订单，价格为 10 。没有销售订单，所以这 5 笔订单添加到积压订单中。
- 提交 2 笔销售订单，价格为 15 。没有采购订单的价格大于或等于 15 ，所以这 2 笔订单添加到积压订单中。
- 提交 1 笔销售订单，价格为 25 。没有采购订单的价格大于或等于 25 ，所以这 1 笔订单添加到积压订单中。
- 提交 4 笔采购订单，价格为 30 。前 2 笔采购订单与价格最低（价格为 15）的 2 笔销售订单匹配，从积压订单中删除这 2 笔销售订单。第 3 笔采购订单与价格最低的 1 笔销售订单匹配，销售订单价格为 25 ，从积压订单中删除这 1 笔销售订单。积压订单中不存在更多销售订单，所以第 4 笔采购订单需要添加到积压订单中。
最终，积压订单中有 5 笔价格为 10 的采购订单，和 1 笔价格为 30 的采购订单。所以积压订单中的订单总数为 6 。
```

**示例 1：**

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2021/03/21/ex2.png)

```
输入：orders = [[7,1000000000,1],[15,3,0],[5,999999995,0],[5,1,1]]
输出：999999984
解释：输入订单后会发生下述情况：
- 提交 109 笔销售订单，价格为 7 。没有采购订单，所以这 109 笔订单添加到积压订单中。
- 提交 3 笔采购订单，价格为 15 。这些采购订单与价格最低（价格为 7 ）的 3 笔销售订单匹配，从积压订单中删除这 3 笔销售订单。
- 提交 999999995 笔采购订单，价格为 5 。销售订单的最低价为 7 ，所以这 999999995 笔订单添加到积压订单中。
- 提交 1 笔销售订单，价格为 5 。这笔销售订单与价格最高（价格为 5 ）的 1 笔采购订单匹配，从积压订单中删除这 1 笔采购订单。
最终，积压订单中有 (1000000000-3) 笔价格为 7 的销售订单，和 (999999995-1) 笔价格为 5 的采购订单。所以积压订单中的订单总数为 1999999991 ，等于 999999984 % (109 + 7) 。
```

提示：

- `1 <= orders.length <= 10^5`
- `orders[i].length == 3`
- `1 <= pricei, amounti <= 10^9`
- `orderTypei 为 0 或 1`

```Java

```

```Go

```

```Python

```

##### 智力题

###### [264. 丑数 II](https://leetcode-cn.com/problems/ugly-number-ii/)

编写一个程序，找出第 `n` 个丑数。

丑数就是质因数只包含 `2, 3, 5` 的**正整数**。

**示例:**

```
输入: n = 10
输出: 12
解释: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12 是前 10 个丑数。
```

**说明:** 

1. `1` 是丑数。
2. `n` **不超过**1690。

```Java

```

```Go

```

```Python

```

###### [313. 超级丑数](https://leetcode-cn.com/problems/super-ugly-number/)

编写一段程序来查找第 `*n*` 个超级丑数。

超级丑数是指其所有质因数都是长度为 `k` 的质数列表 `primes` 中的正整数。

**示例:**

```
输入: n = 12, primes = [2,7,13,19]
输出: 32 
解释: 给定长度为 4 的质数列表 primes = [2,7,13,19]，前 12 个超级丑数序列为：[1,2,4,7,8,13,14,16,19,26,28,32] 。
```

说明:

- 1 是任何给定 primes 的超级丑数。
-  给定 primes 中的数字以升序排列。
- 0 < k ≤ 100, 0 < n ≤ 10^6, 0 < primes[i] < 1000 。
- 第 n 个超级丑数确保在 32 位有符整数范围内。

```Java

```

```Go

```

```Python

```

###### [1753. 移除石子的最大得分](https://leetcode-cn.com/problems/maximum-score-from-removing-stones/)

你正在玩一个单人游戏，面前放置着大小分别为 `a`、`b` 和 `c` 的 **三堆** 石子。

每回合你都要从两个 **不同的非空堆** 中取出一颗石子，并在得分上加 `1` 分。当存在 **两个或更多** 的空堆时，游戏停止。

给你三个整数 `a` 、`b` 和 `c` ，返回可以得到的 **最大分数** 。

**示例 1：**

```
输入：a = 2, b = 4, c = 6
输出：6
解释：石子起始状态是 (2, 4, 6) ，最优的一组操作是：
- 从第一和第三堆取，石子状态现在是 (1, 4, 5)
- 从第一和第三堆取，石子状态现在是 (0, 4, 4)
- 从第二和第三堆取，石子状态现在是 (0, 3, 3)
- 从第二和第三堆取，石子状态现在是 (0, 2, 2)
- 从第二和第三堆取，石子状态现在是 (0, 1, 1)
- 从第二和第三堆取，石子状态现在是 (0, 0, 0)
总分：6 分 。
```

**示例 2：**

```
输入：a = 4, b = 4, c = 6
输出：7
解释：石子起始状态是 (4, 4, 6) ，最优的一组操作是：
- 从第一和第二堆取，石子状态现在是 (3, 3, 6)
- 从第一和第三堆取，石子状态现在是 (2, 3, 5)
- 从第一和第三堆取，石子状态现在是 (1, 3, 4)
- 从第一和第三堆取，石子状态现在是 (0, 3, 3)
- 从第二和第三堆取，石子状态现在是 (0, 2, 2)
- 从第二和第三堆取，石子状态现在是 (0, 1, 1)
- 从第二和第三堆取，石子状态现在是 (0, 0, 0)
总分：7 分 。

```

**示例 3：**

```
输入：a = 1, b = 8, c = 8
输出：8
解释：最优的一组操作是连续从第二和第三堆取 8 回合，直到将它们取空。
注意，由于第二和第三堆已经空了，游戏结束，不能继续从第一堆中取石子。
```

**提示：**

- `1 <= a, b, c <= 10^5`

```Java

```

```Go

```

```Python

```

#### **并查集（Union-find）及经典问题**



