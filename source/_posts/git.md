---
title: 【备忘录】Git学习笔记
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 备忘录    # 分类
tags: [Git]          # 标签
index_img: /images/git/index.png
---
> a [free and open source](http://git-scm.com/about/free-and-open-source) distributed version control system designed to handle everything from small to very large projects with speed and efficiency.<!-- more --> 

### 常用命令

##### `git config`

```shell
git config --list                               # 查看git所有配置
git config --global --unset user.name           # 删除用户
git config --global --edit                      # 编辑配置文件
git config --system --list                      # 查看系统配置
git config --global --list                      # 查看当前用户（global）配置
git config --local --list                       # 查看当前仓库配置信息
```

##### `git branch` 

创建、重命名、查看、删除项目分支，通过 Git 做项目开发时，一般都是在开发分支中进行，开发完成后合并分支到主干。

```shell
git branch <some_branch>                        # 创建分支
git branch -m <old_branch> <new_branch>         # 重命名分支
git branch -D <some_branch>                     # 删除分支
git branch                                      # 查看本地所有分支
git branch -a                                   # 查看所有分支（本地和远程）
git branch -r                                   # 查看远程版本库上的分支列表，加上 -d 参数可以删除远程版本库上的分支
git branch -vv                                  # 查看带有最后提交id、最近提交原因等信息的本地版本库分支列表
```

##### `git tag`

为项目标记里程碑

```shell
git tag publish/xxx
git push origin publish/xxx
```

当我们完成某个功能需求准备发布上线时，应该将此次完整的项目代码做个标记，并将这个标记好的版本发布到线上，这里我们以 publish/xxx 为标记名并发布，当看到命令行返回如下内容则表示发布成功了。

```shell
Total 0 (delta 0), reused 0 (delta 0)
To https://github.com/xxx/xxx.github.com.git
 * [new tag]         publish/xxx -> publish/xxx
.gitignore
```

##### `git merge`

将其它分支合并到当前分支

```shell
git merge --squash
#将待合并分支上的 commit 合并成一个新的 commit 放入当前分支，适用于待合并分支的提交记录不需要保留的情况

git merge --no-ff
#默认情况下，Git 执行"快进式合并"（fast-farward merge），会直接将 Master 分支指向 Develop 分支，使用 --no-ff 参数后，会执行正常合并，在 Master 分支上生成一个新节点，保证版本演进更清晰。

git merge --no-edit
#在没有冲突的情况下合并，不想手动编辑提交原因，而是用 Git 自动生成的类似 Merge branch 'test'的文字直接提交
```

##### `git stash`

在Git的栈中保存当前修改或删除的工作进度，当你在一个分支里做某项功能开发时，接到通知把昨天已经测试完没问题的代码发布到线上，但这时你已经在这个分支里加入了其它未提交的代码，这个时候就可以把这些未提交的代码存到栈里。

```shell
git stash
#将未提交的文件保存到Git栈中

git stash list
#查看栈中保存的列表

git stash show stash@{0}
#显示栈中其中一条记录

git stash drop stash@{0}
#移除栈中其中一条记录

git stash pop
#从Git栈中检出最新保存的一条记录，并将它从栈中移除

git stash apply stash@{0}
#从Git栈中检出其中一条记录，但不从栈中移除

git stash branch new_banch
#把当前栈中最近一次记录检出并创建一个新分支

git stash clear
#清空栈里的所有记录

git stash create
#为当前修改或删除的文件创建一个自定义的栈并返回一个ID，此时并未真正存储到栈里

git stash store xxxxxx
#将 create 方法里返回的ID放到 store 后面，此时在栈里真正创建了一个记录，但当前修改或删除的文件并未从工作区移除

$ git stash create
09eb9a97ad632d0825be1ece361936d1d0bdb5c7
$ git stash store 09eb9a97ad632d0825be1ece361936d1d0bdb5c7
$ git stash list
stash@{0}: Created via "git stash store"
```

##### `git merge`和`git rebase`

```bash
* 33facc8  (master) Commit 3
|
| * 3b36f32  (second_branch) Detached commit
| |
|/
* 29af11f  Commit 2
|
* 1439f8e  Commit 1
```

当在 `Commit 2` 创建分支 `second_branch` 写代码，并提交了一个 `commit`: `3b36f32`，在这之后，主干有人也提交了代码 `Commit 3`

此时，如何把 `Commit 3` 拉到我们的分支继续开发？

这时候用 `git merge master` 或 `git rebase master` 都能更新 `second_branch`，也许有时候还要处理下冲突。但他们的结果却不相同。

![](/images/git/git-merge-vs-rebase.jpg)

|                     **git merge master**                     | **git rebase master**                                        |
| :----------------------------------------------------------: | ------------------------------------------------------------ |
| 合并 `master` 的记录到分支，合并之后的所有 `commit` 会按提交时间从新到旧排列。 | 当前分支的 `HEAD` 会移动到 master 的结尾，但会变成一个新的 `commit`。 |
|    用 `git log --graph` 查看的话，会有一条**丑陋的**边！     | `git log --graph` 是一条漂亮的直线                           |
|                 保持了所有 `commit` 的连贯性                 | commit` 历史被修改了，`3b36f32` 被修改成了 `a018520          |

######  什么时候用 rebase，什么时候用 merge？

- 用 `merge` 来把分支合并到主干。
- 如果你的分支要跟别人共享，则**不建议**用 `rebase`，因为 `rebase` 会创建不一致的提交历史。
- 如果只有你个人开发推荐使用 `rebase`。
- 如果你想保留完整的提交历史，推荐使用 `merge`，`merge` 保留历史 而 `rebase` 重写历史。
- `rebase` 还可以压缩、简化历史，通过 `git rebase -i` 可以在分支合并到主干前，整理自己分支的提交历史，把很多细碎的 `commit` 整理成一条详细的 `commit`。
- `rebase` 一次只处理一个冲突，`merge` 则一次处理全部冲突。处理冲突 `rebase` 更方便，但如果有很多冲突的话，撤销一个 `rebase` 会比 `merge` 更复杂，`merge` 只需要撤销一次。

##### `git log`

```shell
git log -p                                      # 显示带提交差异对比的历史记录
git log demo.html                               # 显示 demo.html 文件的历史记录
git log --since="2 weeks ago"                   # 显示2周前开始到现在的历史记录，其它时间可以类推
git log --before="2 weeks ago"                  # 显示截止到2周前的历史记录，其它时间可以类推
git log -10                                     # 显示最近10条历史记录
git log f5f630a..HEAD                           # 显示从提交ID f5f630a 到 HEAD 之间的记录，HEAD 可以为空或其它提交ID
git log --pretty=oneline                        # 在一行中输出简短的历史记录
git log --pretty=format:"%h"                    # 格式化输出历史记录
```

Git 用各种 placeholder 来决定各种显示内容，常用的显示如下：

```shell
%H:                                             # commit hash
%h:                                             # 缩短的commit hash
%T:                                             # tree hash
%t:                                             # 缩短的 tree hash
%P:                                             # parent hashes
%p:                                             # 缩短的 parent hashes
%an:                                            # 作者名字
%aN:                                            # mailmap的作者名
%ae:                                            # 作者邮箱
%ad:                                            # 日期 (--date= 制定的格式)
%ar:                                            # 日期, 相对格式(1 day ago)
%cn:                                            # 提交者名字
%ce:                                            # 提交者 email
%cd:                                            # 提交日期 (--date= 制定的格式)
%cr:                                            # 提交日期, 相对格式(1 day ago)
%d:                                             # ref名称
%s:                                             # commit信息标题
%b:                                             # commit信息内容
%n:                                             # 换行
```

#### 如果远端仓库没有与本地仓库关联

```shell
# 本地执行（远端需要创建于本地相同名称的项目）
$ git init
$ git remote add origin https://github.com/xxx/xxx.git
$ git add -A
$ git commit -m "first commit"
$ git push -u origin master
```

#### 切换分支

```shell
git status                                      # 查看git状态  
git branch                                      # 查看git分支  
git checkout feature/new_branch                 # 切换到feature/new_branch分支 
```

#### 提交代码

```shell
git add .                                       # 添加数据到镜像仓库                                             
                                                # 提交单个文件，进入你要提交的文件目录          
                                                # git add <你要提交的文件> 
git commit -m '你要写的注释'                      # 提交到本地镜像仓库
git push -u origin feature/new_branch           # 提交到远程镜像仓库
```

#### 远程分支拉取到本地

```shell
git branch -a                                   # 查询所有分支,包括远程分支 
git checkout -b release remotes/origin/release  # 将远程release分支拉取到本地，并在本地创建release分支
```

绿色是当前所在本地分支，白色是本地分支，红色是远程分支
![](/images/git/git-a.png)

#### 分支代码拉取提交流程

```shell
## 获取主干最新代码 
$ git clone <repo> 
$ git checkout develop                        # 切换到develop分支 
$ git pull                                    # 同步分支 

## 新建一个开发分支my_feature 
$ git checkout -b feature/my_feature  
$ git branch                                  # 确认已切换到当前分支

## 提交代码
$ git add --all 或者 git add .                 # 保存所有的修改变化  
$ git status                                  # 查看发生变动的文件 
$ git commit -m "implement api architecture"  # 编辑备注 
$ git push origin -u feature/my_feature       # 将分支代码push到服务器

## 合并分支feature/my_feature到develop 
$ git checkout develop 
$ git pull                                    # 确保develop分支是最新的 
$ git merge --no-ff feature/my_feature  

# 分支开发过程中，为了减少冲突，尽量要多与主干同步 
$ git fetch origin 
$ git rebase origin/develop 
$ git add .                                   # 解决冲突后add 
$ git rebase --continue

#删除分支 
$ git branch -d feature/my_feature

#取消commit 
$ git reset --hard <commit log>
```

### 动图图解

#### 合并

拥有多个分支是很方便的，这样可以将不同的新修改互相隔离开，而且还能确保你不会意外地向生产代码推送未经许可或破损的代码修改。但一旦这些修改得到了批准许可，我们就需要将其部署到我们的生产分支中！

可将一个分支的修改融入到另一个分支的一种方式是执行 git merge。Git 可执行两种类型的合并：fast-forward 和 no-fast-forward。现在你可能分不清，但我们马上就来看看它们的差异所在。

##### Fast-forward (---ff)

在当前分支相比于我们要合并的分支没有额外的提交（commit）时，可以执行 fast-forward 合并。Git 很懒，首先会尝试执行最简单的选项：fast-forward！这类合并不会创建新的提交，而是会将我们正在合并的分支上的提交直接合并到当前分支。

![](/images/git/image1.gif)

完美！现在，我们在 dev 分支上所做的所有改变都合并到了 master 分支上。那么 no-fast-forward 又是什么意思呢？

##### No-fast-foward (---no-ff)

如果你的当前分支相比于你想要合并的分支没有任何提交，那当然很好，但很遗憾现实情况很少如此！如果我们在当前分支上提交我们想要合并的分支不具备的改变，那么 git 将会执行 no-fast-forward 合并。

使用 no-fast-forward 合并时，Git 会在当前活动分支上创建新的 merging commit。这个提交的父提交（parent commit）即指向这个活动分支，也指向我们想要合并的分支！

![](/images/git/image2.gif)

没什么大不了的，完美的合并！现在，我们在 dev 分支上所做的所有改变都合并到了 master 分支上。

##### 合并冲突

尽管 Git 能够很好地决定如何合并分支以及如何向文件添加修改，但它并不总是能完全自己做决定。当我们想要合并的两个分支的同一文件中的同一行代码上有不同的修改，或者一个分支删除了一个文件而另一个分支修改了这个文件时，Git 就不知道如何取舍了。

在这样的情况下，Git 会询问你想要保留哪种选择？假设在这两个分支中，我们都编辑了 README.md 的第一行。

![](/images/git/image3.png)

如果我们想把 dev 合并到 master，就会出现一个合并冲突：你想要标题是 Hello! 还是 Hey!？

当尝试合并这些分支时，Git 会向你展示冲突出现的位置。我们可以手动移除我们不想保留的修改，保存这些修改，再次添加这个已修改的文件，然后提交这些修改。

![](/images/git/image4.gif)

完成！尽管合并冲突往往很让人厌烦，但这是合理的：Git 不应该瞎猜我们想要保留哪些修改。

#### 变基（Rebasing）

我们刚看到可通过执行 git merge 将一个分支的修改应用到另一个分支。另一种可将一个分支的修改融入到另一个分支的方式是执行 git rebase。

git rebase 会将当前分支的提交复制到指定的分支之上。

![](/images/git/image5.gif)

完美，现在我们在 dev 分支上获取了 master 分支上的所有修改。

变基与合并有一个重大的区别：Git 不会尝试确定要保留或不保留哪些文件。我们执行 rebase 的分支总是含有我们想要保留的最新近的修改！这样我们不会遇到任何合并冲突，而且可以保留一个漂亮的、线性的 Git 历史记录。

上面这个例子展示了在 master 分支上的变基。但是，在更大型的项目中，你通常不需要这样的操作。git rebase 在为复制的提交创建新的 hash 时会修改项目的历史记录。

如果你在开发一个 feature 分支并且 master 分支已经更新过，那么变基就很好用。你可以在你的分支上获取所有更新，这能防止未来出现合并冲突。

#### 交互式变基（Interactive Rebase）

在为提交执行变基之前，我们可以修改它们！我们可以使用交互式变基来完成这一任务。交互式变基在你当前开发的分支上以及想要修改某些提交时会很有用。

在我们正在 rebase 的提交上，我们可以执行以下 6 个动作：

reword：修改提交信息；

edit：修改此提交；

squash：将提交融合到前一个提交中；

fixup：将提交融合到前一个提交中，不保留该提交的日志消息；

exec：在每个提交上运行我们想要 rebase 的命令；

drop：移除该提交。

很棒！这样我们就能完全控制我们的提交了。如果你想要移除一个提交，只需 drop 即可。

![](/images/git/image6.gif)

如果你想把多个提交融合到一起以便得到清晰的提交历史，那也没有问题！

![](/images/git/image7.gif)

交互式变基能为你在 rebase 时提供大量控制，甚至可以控制当前的活动分支。

#### 重置（Resetting）

当我们不想要之前提交的修改时，就会用到这个命令。也许这是一个 WIP 提交或者可能是引入了 bug 的提交，这时候就要执行 git reset。

git reset 能让我们不再使用当前台面上的文件，让我们可以控制 HEAD 应该指向的位置。

##### 软重置

软重置会将 HEAD 移至指定的提交（或与 HEAD 相比的提交的索引），而不会移除该提交之后加入的修改！

假设我们不想保留添加了一个 style.css 文件的提交 9e78i，而且我们也不想保留添加了一个 index.js 文件的提交 035cc。但是，我们确实又想要保留新添加的 style.css 和 index.js 文件！这是软重置的一个完美用例。

![](/images/git/image8.gif)

输入 git status 后，你会看到我们仍然可以访问在之前的提交上做过的所有修改。这很好，这意味着我们可以修复这些文件的内容，之后再重新提交它们！

##### 硬重置

有时候我们并不想保留特定提交引入的修改。不同于软重置，我们应该再也无需访问它们。Git 应该直接将整体状态直接重置到特定提交之前的状态：这甚至包括你在工作目录中和暂存文件上的修改。

![](/images/git/image9.gif)

Git 丢弃了 9e78i 和 035cc 引入的修改，并将状态重置到了 ec5be 的状态。

#### 还原（Reverting）

另一种撤销修改的方法是执行 git revert。通过对特定的提交执行还原操作，我们会创建一个包含已还原修改的新提交。

假设 ec5be 添加了一个 index.js 文件。但之后我们发现其实我们再也不需要由这个提交引入的修改了。那就还原 ec5be 提交吧！

![](/images/git/image10.gif)

完美！提交 9e78i 还原了由提交 ec5be 引入的修改。在撤销特定的提交时，git revert 非常有用，同时也不会修改分支的历史。

#### 拣选（Cherry-picking）

当一个特定分支包含我们的活动分支需要的某个提交时，我们对那个提交执行 cherry-pick！对一个提交执行 cherry-pick 时，我们会在活动分支上创建一个新的提交，其中包含由拣选出来的提交所引入的修改。

假设 dev 分支上的提交 76d12 为 index.js 文件添加了一项修改，而我们希望将其整合到 master 分支中。我们并不想要整个 dev 分支，而只需要这个提交！

![](/images/git/image11.gif)

现在 master 分支包含 76d12 引入的修改了。

#### 取回（Fetching）

如果你有一个远程 Git 分支，比如在 GitHub 上的分支，当远程分支上包含当前分支没有的提交时，可以使用取回。比如当合并了另一个分支或你的同事推送了一个快速修复时。

通过在这个远程分支上执行 git fetch，我们就可在本地获取这些修改。这不会以任何方式影响你的本地分支：fetch 只是单纯地下载新的数据而已。

![](/images/git/image12.gif)

现在我们可以看到自上次推送以来的所有修改了。这些新数据也已经在本地了，我们可以决定用这些新数据做什么了。

#### 拉取（Pulling）

尽管 git fetch 可用于获取某个分支的远程信息，但我们也可以执行 git pull。git pull 实际上是两个命令合成了一个：git fetch 和 git merge。当我们从来源拉取修改时，我们首先是像 git fetch 那样取回所有数据，然后最新的修改会自动合并到本地分支中。

![](/images/git/image13.gif)

很好，我们现在与远程分支完美同步了，并且也有了所有最新的修改！

#### Reflog

每个人都会犯错，但犯错其实没啥！有时候你可能感觉你把 git repo 完全搞坏了，让你想完全删了了事。

git reflog 是一个非常有用的命令，可以展示已经执行过的所有动作的日志。包括合并、重置、还原，基本上包含你对你的分支所做的任何修改。

![](/images/git/image14.gif)

如果你犯了错，你可以根据 reflog 提供的信息通过重置 HEAD 来轻松地重做！

假设我们实际上并不需要合并原有分支。当我们执行 git reflog 命令时，我们可以看到这个 repo 的状态在合并前位于 HEAD@{1}。那我们就执行一次 git reset，将 HEAD 重新指向在 HEAD@{1} 的位置。

![](/images/git/image15.gif)

我们可以看到最新的动作已被推送给 reflog。

###  Octotree: Chrome github 浏览插件 

 可以把 github 项目的目录树结构展示出来 

![](/images/git/octotree_1.jpg)

![](/images/git/octotree_2.jpg)

#### GitHub搜索

 假如，正在做一个python项目，正好要用到一个爬虫处理的框架，关键词就是 **Spider** ，那就可以先试试搜索项目名称里面包含 **Spider** 的项目： 

##### in:name Spider

![](/images/git/git_hub_1.jpg)

##### in:name Spider stars:>3000

如果 需要约束搜索结果的star数大于3000+ 

![](/images/git/github_2.jpg)

##### in:name Spider stars:>3000 forks:>1000

如果需要更小范围, 可以约束fork数 

![](/images/git/github_3.jpg)

##### in:name Spider stars:>3000 forks:>1000 language:python

当然，也可以约束语言

![](/images/git/github_4.jpg)

##### in:readme Spider stars:>3000 forks:>1000 language:python

 如果不确定关键词是否会命中项目名称，那可以通过 **readme** 来搜索 。此时，就需要重新调整 star和fork数 了。

![](/images/git/github_5.jpg)

##### in:description Spider stars:>3000 forks:>1000 language:python

如果，我们想要找的项目，想不到一个英文关键词去描述，怎么办？

这种情况下，我们直接用一种简单粗暴的方式，按照 **description** 的方式来搜索：

![](/images/git/github_6.jpg)

##### Solution

根据开源项目的主要组成部分：

​	◆ name: 项目名

​	◆ description: 项目的简要描述

​	◆ 项目的源码

​	◆ README.md: 项目的详细情况的介绍

```markdown
|      筛选条件       |            备注            |
| ------------------ | ------------------------- |
| in:name xxx        | 按照项目名搜索              ｜
| in:readme xxx      | 按照README搜索             ｜
| in:description xxx | 按照description搜索        ｜
| stars:>xxx         | stars数大于xxx             ｜
| forks:>xxx         | forks数大于xxx             ｜
| language:xxx       | 编程语言是xxx              ｜
| pushed:>YYYY-MM-DD | 最后更新时间大于YYYY-MM-DD  ｜
```

