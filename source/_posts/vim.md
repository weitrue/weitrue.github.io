---
title: 【Mac】vim环境设置
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 备忘录    # 分类
tags:  [vim]         # 标签
index_img: /images/vim/index.png
---

## <!-- more-->开发神器vim工具

![](/images/vim/index.gif)

### 安装MacVim来替代系统自带vim

一般情况下，Mac 自带的Vim不能满足大多的需求，所以选择安装MacVim

通过一下命令可以查看预装vim的信息

```zsh
# 查看预装vim版本
vim --version

# 查看预装vim路径
where vim
```

#### MacVim安装

有两种方式来安装macvim:

1. Github上下载[`macvim.dmg`](https://macvim-dev.github.io/macvim)安装包进行安装
2. 使用[Homebrew](https://brew.sh/)安装【推荐】

brew安装macvim

```zsh
brew install macvim
```

为macvim中的vim创建别名，覆盖掉系统自带的vim，在~/.bash_profile中添加以下命令

```zsh
alias vi=vim
alias vim=mvim
alias mvim='/usr/local/bin/mvim -v'
# 刷新配置文件
source ~/.bash_profile
```

#### MacVim配置

在vim启动过程中，首先将查找配置文件并执行其中的命令，而这些初始化文件一般有vimrc、gvimrc和exrc三种。通过`:version`命令可以查看vim的配置文件信息。

vim的配置文件有全局和用户两种版本，分别存放于`$VIM`和`$HOME`目录中，用户配置文件默认是没有的，必要时由用户自己在`$HOME`目录下创建。可以使用`:echo`命令查看他们的路径，使用`:e`命令进入目录。

```zsh
:echo $VIM
/usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim

:echo $HOME
/Users/wangpeng

# 可以通过:scriptname查看各脚本的加载顺序
:scriptname
/usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/vimrc
  2: ~/.vimrc
  3: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/syntax/syntax.vim
  4: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/syntax/synload.vim
  5: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/syntax/syncolor.vim
  6: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/filetype.vim
  7: ~/.vim/colors/solarized.vim
  8: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/ftoff.vim
  9: ~/.vim/bundle/Vundle.vim/autoload/vundle.vim
 10: ~/.vim/bundle/Vundle.vim/autoload/vundle/config.vim
 11: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/ftplugin.vim
 12: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/indent.vim
 13: ~/.vim/bundle/nerdtree/plugin/NERD_tree.vim
 14: ~/.vim/bundle/nerdtree/autoload/nerdtree.vim
 15: ~/.vim/bundle/nerdtree/lib/nerdtree/path.vim
 16: ~/.vim/bundle/nerdtree/lib/nerdtree/menu_controller.vim
 17: ~/.vim/bundle/nerdtree/lib/nerdtree/menu_item.vim
 18: ~/.vim/bundle/nerdtree/lib/nerdtree/key_map.vim
 19: ~/.vim/bundle/nerdtree/lib/nerdtree/bookmark.vim
 20: ~/.vim/bundle/nerdtree/lib/nerdtree/tree_file_node.vim
 21: ~/.vim/bundle/nerdtree/lib/nerdtree/tree_dir_node.vim
 22: ~/.vim/bundle/nerdtree/lib/nerdtree/opener.vim
 23: ~/.vim/bundle/nerdtree/lib/nerdtree/creator.vim
 24: ~/.vim/bundle/nerdtree/lib/nerdtree/flag_set.vim
 25: ~/.vim/bundle/nerdtree/lib/nerdtree/nerdtree.vim
 26: ~/.vim/bundle/nerdtree/lib/nerdtree/ui.vim
 27: ~/.vim/bundle/nerdtree/lib/nerdtree/event.vim
 28: ~/.vim/bundle/nerdtree/lib/nerdtree/notifier.vim
 29: ~/.vim/bundle/nerdtree/autoload/nerdtree/ui_glue.vim
 30: ~/.vim/bundle/nerdtree/nerdtree_plugin/exec_menuitem.vim
 31: ~/.vim/bundle/nerdtree/nerdtree_plugin/fs_menu.vim
 32: ~/.vim/bundle/nerdtree/nerdtree_plugin/vcs.vim
 33: ~/.vim/bundle/nerdtree-git-plugin/nerdtree_plugin/git_status.vim
 34: ~/.vim/bundle/nerdtree-git-plugin/autoload/gitstatus.vim
 35: ~/.vim/bundle/nerdtree-git-plugin/autoload/gitstatus/log.vim
 36: ~/.vim/bundle/nerdtree-git-plugin/autoload/gitstatus/listener.vim
 37: ~/.vim/bundle/vim-autopep8/plugin/python_autopep8.vim
 38: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/getscriptPlugin.vim
 39: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/gzip.vim
 40: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/logiPat.vim
 41: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/manpager.vim
 42: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/matchparen.vim
 43: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/netrwPlugin.vim
 44: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/rrhelper.vim
 45: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/spellfile.vim
 46: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/tarPlugin.vim
 47: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/tohtml.vim
 48: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/vimballPlugin.vim
 49: /usr/local/Cellar/macvim/8.2-166_1/MacVim.app/Contents/Resources/vim/runtime/plugin/zipPlugin.vim
 50: ~/.vim/bundle/indentLine/after/plugin/indentLine.vim
 51: ~/.vim/bundle/nerdtree/syntax/nerdtree.vim
 52: ~/.vim/bundle/nerdtree-git-plugin/after/syntax/nerdtree.vim
 53: ~/.vim/bundle/nerdtree-git-plugin/autoload/gitstatus/util.vim
 54: ~/.vim/bundle/nerdtree-git-plugin/autoload/gitstatus/job.vim
```

##### 用户配置文件

````zsh
# 切换至用户目录
cd ~
# 使用vim创建并打开.vimrc
vim .vimrc
````

##### 设置主题

```zsh
colorscheme solarized
```

##### 显示帮助为中文

下载[vimdoc](https://sourceforge.net/projects/vimcdoc/?source=typ_redirect)

![](/images/vim/doc.png)

将文件解压到~/.vim/doc，若路径不存在则创建

打开vim执行:helptags ~/.vim/doc

在~/.vimrc中进行配置：

```zsh
set helplang=cn 
if version >= 603
    set helplang=cn
    set encoding=utf-8
endif
```

常见的vim快捷键可以看[这里](https://stackoverflow.com/questions/5400806/what-are-the-most-used-vim-commands-keypresses/5400978#5400978)

##### 字符编码

enc,fenc,fencs,tenc,一般乱码多是因这些参数设置不正确引起：

1. enc，vim内部使用的编码，如buffer，寄存器中的字符串，windows一般是gbk，mac是utf-8
2. fenc，当前打开文件自身的编码，如果enc和fenc不一致，vim会做编码转换，转换成fenc编码保存文件
3. fencs，一个字符编码列表，编码的自动识别就是通过它实现的
4. tenc，终端使用的编码，或者说vim用于屏幕显示时的编码，显示时vim会把内部编码转换为屏幕编码进行输出，默认为enc

```zsh
" 将enc设置为utf-8
set enc=utf-8
```

#### vim插件管理器—Vundle

[Vundle](http://github.com/VundleVim/Vundle.vim) is short for *Vim bundle* and is a [Vim](http://www.vim.org/) plugin manager.

[Vundle](http://github.com/VundleVim/Vundle.vim) allows you to...

- keep track of and [configure](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L126-L233) your plugins right in the `.vimrc`
- [install](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L234-L254) configured plugins (a.k.a. scripts/bundle)
- [update](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L255-L265) configured plugins
- [search](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L266-L295) by name all available [Vim scripts](http://vim-scripts.org/vim/scripts.html)
- [clean](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L303-L318) unused plugins up
- run the above actions in a *single keypress* with [interactive mode](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L319-L360)

[Vundle](http://github.com/VundleVim/Vundle.vim) automatically...

- manages the [runtime path](http://vimdoc.sourceforge.net/htmldoc/options.html#'runtimepath') of your installed scripts
- regenerates [help tags](http://vimdoc.sourceforge.net/htmldoc/helphelp.html#:helptags) after installing and updating

[Vundle](http://github.com/VundleVim/Vundle.vim) is undergoing an [interface change](https://github.com/VundleVim/Vundle.vim/blob/v0.10.2/doc/vundle.txt#L372-L396), please stay up to date to get latest changes.

##### 安装Vundle

```zsh
git clone https://github.com/gmarik/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```

下载Vundle插件管理器，将其放置在Vim编辑器bundles文件夹中。现在，可以通过.vimrc配置文件来管理所有扩展了。

##### 配置Vundle

```zsh
set nocompatible              " required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'gmarik/Vundle.vim'

" Add all your plugins here (note older versions of Vundle used Bundle instead of Plugin)


" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
```

##### 使用Vundle

将想要安装的插件，按照地址填写方法，将地址填写在**vundle#begin**和**vundle#end**之间就可以

运行 :PluginInstall

```zsh
:PluginInstall
```

执行`:PluginInstall`后的截图

![](/images/vim/vundle.png)

##### 移除不需要的插件

1. 编辑.vimrc文件移除的你要移除的插件所对应的plugin那一行
2. 输入命令`:BundleClean`

##### 其他常用命令

```zsh
:BundleList              -列举列表(也就是.vimrc)中配置的所有插件
:BundleInstall          -安装列表中的全部插件
:BundleInstall!         -更新列表中的全部插件
:BundleSearch foo   -查找foo插件
:BundleSearch! foo  -刷新foo插件缓存
:BundleClean           -清除列表中没有的插件
:BundleClean!          -清除列表中没有的插件
```

#### 安装插件—打造IDE

以下均需要在.vimc文件中配置

##### 添加目录树—NERDTree

NERDTree的作用就是列出当前路径的目录树，一般IDE都是有的。可以方便的浏览项目的总体的目录结构和创建删除重命名文件或文件名

###### 安装NERDTree

添加目录树：[nerdtree](https://github.com/preservim/nerdtree)

```bash
Plugin 'scrooloose/nerdtree'  
```

添加git状态图标：[nerdtree-git](https://github.com/Xuyuanp/nerdtree-git-plugin)

```bash
Plugin 'Xuyuanp/nerdtree-git-plugin'  
```

###### 配置NERDTree

```zsh
"使用F3键快速调出和隐藏它
map <F3> :NERDTreeToggle<CR>

let NERDTreeChDirMode=1

"显示书签"
let NERDTreeShowBookmarks=1

"设置忽略文件类型"
let NERDTreeIgnore=['\~$', '\.pyc$', '\.swp$']

"窗口大小"
let NERDTreeWinSize=25

" 修改默认箭头
let g:NERDTreeDirArrowExpandable = '▸'
let g:NERDTreeDirArrowCollapsible = '▾'

"How can I open a NERDTree automatically when vim starts up if no files were specified?
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif

" 打开vim时自动打开NERDTree
autocmd vimenter * NERDTree           

"How can I open NERDTree automatically when vim starts up on opening a directory?
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | endif

" 关闭vim时，如果打开的文件除了NERDTree没有其他文件时，它自动关闭，减少多次按:q!
autocmd bufenter * if (winnr("$") == 1 && exists("b:NERDTree") && b:NERDTree.isTabTree()) | q | endif

" 开发的过程中，我们希望git信息直接在NERDTree中显示出来， 和Eclipse一样，修改的文件和增加的文件都给出相应的标注， 这时需要安装的插件就是 nerdtree-git-plugin,配置信息如下
let g:NERDTreeIndicatorMapCustom = {
    \ "Modified"  : "✹",
    \ "Staged"    : "✚",
    \ "Untracked" : "✭",
    \ "Renamed"   : "➜",
    \ "Unmerged"  : "═",
    \ "Deleted"   : "✖",
    \ "Dirty"     : "✗",
    \ "Clean"     : "✔︎",
    \ "Unknown"   : "?"
    \ }

" 显示行号
let NERDTreeShowLineNumbers=1
let NERDTreeAutoCenter=1

" 在终端启动vim时，共享NERDTree
let g:nerdtree_tabs_open_on_console_startup=1
```

##### 分割布局

不用安装额外插件，只需要在.vimrc设置即可

```zsh
" 指定屏幕上可以进行分割布局的区域
set splitbelow               " 允许在下部分割布局
set splitright               " 允许在右侧分隔布局

" 组合快捷键：
nnoremap <C-J> <C-W><C-J>    " 组合快捷键：- Ctrl-j 切换到下方的分割窗口
nnoremap <C-K> <C-W><C-K>    " 组合快捷键：- Ctrl-k 切换到上方的分割窗口
nnoremap <C-L> <C-W><C-L>    " 组合快捷键：- Ctrl-l 切换到右侧的分割窗口
nnoremap <C-H> <C-W><C-H>    " 组合快捷键：- Ctrl-h 切换到左侧的分割窗口
```

nnoremap将一个组合快捷键映射为另一个快捷键。no部分，指的是在Vim的正常模式（Normal Mode）下，
而不是可视模式下重新映射，更多信息请看[这里](https://stackoverflow.com/questions/3776117/what-is-the-difference-between-the-remap-noremap-nnoremap-and-vnoremap-mapping)

##### Go开发插件—vim-go 

[vim-go](https://github.com/fatih/vim-go) 包含了运行、调试、重命名、增加移除 tag、运行单元测试、静态检查、格式化等非常多的功能。

- 编译使用命令 `:GoBuild`, 安装使用命令 `:GoInstall` or测试使用命令 `:GoTest`. 运行单元测试命令 `:GoTestFunc`).
- 运行当前文件 `:GoRun`.
- 改进了语法突出显示和折叠.
- 调试集成 [`delve`](https://github.com/go-delve/delve) 的程序 `:GoDebugStart`.
- Completion and many other features support via `gopls`.
- formatting on save keeps the cursor position and undo history.
- Go to symbol/declaration with `:GoDef`.
- Look up documentation with `:GoDoc` or `:GoDocBrowser`.
- Easily import packages via `:GoImport`, remove them via `:GoDrop`.
- Precise type-safe renaming of identifiers with `:GoRename`.
- See which code is covered by tests with `:GoCoverage`.
- Add or remove tags on struct fields with `:GoAddTags` and `:GoRemoveTags`.
- Call [`staticcheck`](https://staticcheck.io/) with `:GoMetaLinter` to invoke all possible linters (`golint`, `vet`, `errcheck`, `deadcode`, etc.) and put the result in the quickfix or location list.
- Lint your code with `:GoLint`, run your code through `:GoVet` to catch static errors, or make sure errors are checked with `:GoErrCheck`.
- Advanced source analysis tools utilizing `guru`, such as `:GoImplements`, `:GoCallees`, and `:GoReferrers`.
- ... and many more! Please see [doc/vim-go.txt](https://github.com/fatih/vim-go/blob/master/doc/vim-go.txt) for more information.
- Integration with [`gopls`](https://github.com/golang/tools/blob/master/gopls/README.md).
- The `gopls` instance can be shared with other Vim plugins.
- Vim-go's use of `gopls` can be disabled and alternative tools can be used when desired.
- Integration with [`Tagbar`](https://github.com/preservim/tagbar) via [`gotags`](https://github.com/jstemmer/gotags).
- Integration with [`Ultisnips`](https://github.com/SirVer/ultisnips) and other snippet engines.

##### python代码缩进

代码的正确缩进是至关重要的，我们将从以下几个方面为vim配置代码缩进功能：

1. python代码的自动缩进
2. 遵从[PEP8](https://www.cnblogs.com/ajianbeyourself/p/4377933.html)代码风格标准
3. 自动格式化为PEP8代码

###### **安装插件**

自动缩进有用，但是在某些情况下（比如函数定义有多行的时候），并不总是会达到你想要的效果，尤其是在符合PEP8标准方面。我们可以利用[`indentpython.vim`](https://github.com/vim-scripts/indentpython.vim)插件，来解决这个问题：

```zsh
Plugin 'vim-scripts/indentpython.vim'
```

将python代码自动格式化为符合pep8标准的代码用到[`tell-k/vim-autopep8`](https://github.com/tell-k/vim-autopep8)插件：

```zsh
Plugin 'tell-k/vim-autopep8'
```

要使用`tell-k/vim-autopep8`插件必须先在电脑上安装python的第三方包[`autopep8`](https://pypi.org/project/autopep8/)。但奇怪的是用pip安装时找不到这个包，我们使用`easy-install`来安装，只需要在m某个python环境下安装一次即可，实测在其他环境下也可用：

```zsh
easy_install autopep8
```

###### 配置插件

.vimrc文件中添加下面的配置。这些设置将让Vim中的Tab键就相当于4个标准的空格符，确保每行代码长度不超过80个字符，并且会以unix格式储存文件，避免在推送到Github或分享给其他用户时出现文件转换问题。

```zsh
" 按照PEP8标准来配置vim
au BufNewFile,BufRead *.py set tabstop=4 |set softtabstop=4|set shiftwidth=4|set textwidth=79|set expandtab|set autoindent|set fileformat=unix
```

对于全栈开发，你可以设置针对每种文件类型设置au命令：

```zsh
au BufNewFile,BufRead *.js, *.html, *.css set tabstop=2|set softtabstop=2|set shiftwidth=2
```

下面来配置vim-autopep8

```zsh
" Disable show diff window
let g:autopep8_disable_show_diff=1

" vim-autopep8自1.11版本之后取消了F8快捷键，需要用户自己为:Autopep8设置快捷键：
autocmd FileType python noremap <buffer> <F8> :call Autopep8()<CR>
```

###### 使用插件

在使用macvim编辑`*.py`文件时：

- 代码自动按照PEP8规则进行缩进；
- tap键相当于4个标准空格，每行代码不超过80字符；
- 使用`:Autopep8`命令或者`F8`快捷键自动按照PEP8标准格式化python代码

在使用macvim编辑`*.js`, `*.html`, `*.css`文件时,tap键相当于2个标准空格

##### 添加代码缩进指示线

###### 安装indentline

indentLine是一款缩进指示线，由纯字符实现，效果比较完美

```bash
Plugin 'Yggdroot/indentLine'
```

###### 配置indentline

[`indentLine`](https://github.com/Yggdroot/indentLine)默认是关闭的，因此需要在.vimrc中配置才能看到效果：

```bash
" 支持任意ASCII码，也可以使用特殊字符：¦, ┆, or │ ，但只在utf-8编码下有效
let g:indentLine_char='¦'   

" 使indentline生效
let g:indentLine_enabled = 1    
```

###### 使用indentline

在代码缩进处，自动生成缩进指示线

##### 代码折叠

大多数“现代”集成开发环境（IDE）都提供对方法（methods）或类（classes）进行折叠的手段，只显示类或方法的定义部分，而不是全部的代码。

###### 安装插件

本身不用安装额外插件，但为避免出现超过你所希望的折叠数目，我们推荐[`SimplyFold`](https://github.com/tmhedberg/SimpylFold)来解决这个问题：

```bash
Plugin 'tmhedberg/SimpylFold'
```

###### 配置插件

```bash
" 必须手动输入za来折叠（和取消折叠）
set foldmethod=indent                " 根据每行的缩进开启折叠
set foldlevel=99

" 使用空格键会是更好的选择,所以在你的配置文件中加上这一行命令吧：
nnoremap <space> za

" 希望看到折叠代码的文档字符串？
let g:SimpylFold_docstring_preview=1
```

###### 使用插件

在程序块处会显示折叠线，当光标放于折叠线时，按空格键可以切换在该折叠线处是否折叠。

##### 括号自动补全

[auto-pairs](https://github.com/jiangmiao/auto-pairs)主要功能是括号和引号自动补全，输入左引号和左括号自动补全另外一半,安装好就可以无需额外配置

```bash
Plugin 'jiangmiao/auto-pairs'
```

##### 多行注释

###### 安装插件

```bash
Plugin 'scrooloose/nerdcommenter'
```

###### 配置插件

```xml
" nerdcommenter默认热键<leader>为'\'，这里将热键设置为','
let mapleader=','

" 设置注释快捷键
map <F4> <leader>ci<CR>
```

###### 使用插件

在normal模式下按v并移动光标选择需要注释的行，再按F4就可以为所有选中的行添加注释

### Vim日常

##### 中文乱码

简单粗暴的方法

```shell
vim ~/.vimrc

set fileencodings=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936
set termencoding=utf-8
set encoding=utf-8
```

