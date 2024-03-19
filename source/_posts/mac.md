---
title: 【Mac】Mac开发环境
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: 备忘录    # 分类
tags: [mac]          # 标签
index_img: /images/mac/index.jpg
---

> 基于XNU[混合内核](https://baike.baidu.com/item/混合内核/4239577)的首个在商用领域成功的[图形用户界面](https://baike.baidu.com/item/图形用户界面/3352324)操作系统，并且很少受到电脑病毒的袭击。<!-- more --> 

### Homebrew

#### 官网:

https://docs.brew.sh/Installation.html

#### gihub源

https://github.com/Homebrew/install

#### homebrew安装

快捷方式(需要使用代理)

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

可能会出现报错

```
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused 
```

根据提示可以知道被raw.githubusercontent.com拒绝访问，打开浏览器访问https://raw.githubusercontent.com也是失败的，所以此时是电脑与https://raw.githubusercontent.com的连接问题：可以考虑ruby的更新源

```shell
查看当前更新源
gem sources -l                // 默认情况下会显示https://rubygems.org/ 该ruby源在墙内，很多内容无法访问到
gem source -a https://gems.ruby-china.com    // 更新更新源为https://gems.ruby-china.com
gem sources --remove https://rubygems.org/   // 删除原更新源
gem sources -l      　　　　　　               // 检测是否成功
```

继续安装

![img](/images/mac/clipboard.png)

`brew -v`检查是否已安装成功

```shell
Homebrew 2.4.0 

Homebrew/homebrew-core (git revision c948b; last commit 2020-06-13)
```

#### 基本用法

基于brew安装的所有软件及其依赖均会安装到目录`/usr/local/Cellar`

##### Brew 帮助信息

```
$ brew help
Example usage:
  brew search [TEXT|/REGEX/]
  brew info [FORMULA...]
  brew install FORMULA...
  brew update
  brew upgrade [FORMULA...]
  brew uninstall FORMULA...
  brew list [FORMULA...]

Troubleshooting:
  brew config
  brew doctor
  brew install --verbose --debug FORMULA

Contributing:
  brew create [URL [--no-fetch]]
  brew edit [FORMULA...]

Further help:
  brew commands
  brew help [COMMAND]
  man brew
  https://docs.brew.sh
```

##### 子命令帮助信息

`brew help [COMMAND]或brew [COMMAND] -h` 用于查看具体某个子命令的帮助信息。

例如，查看`install`命令的帮助详情：

```shell
$ brew install -h
Usage: brew install [options] formula

Install formula. Additional options specific to formula may be appended to
the command.

Unless HOMEBREW_NO_INSTALL_CLEANUP is set, brew cleanup will then be run for
the installed formulae or, every 30 days, for all formulae.

    -d, --debug                      If brewing fails, open an interactive
                                     debugging session with access to IRB or a
                                     shell inside the temporary build directory.
        --env                        If std is passed, use the standard build
                                     environment instead of superenv. If super
                                     is passed, use superenv even if the formula
                                     specifies the standard build environment.
        --ignore-dependencies        An unsupported Homebrew development flag to
                                     skip installing any dependencies of any
                                     kind. If the dependencies are not already
                                     present, the formula will have issues. If
                                     you're not developing Homebrew, consider
                                     adjusting your PATH rather than using this
                                     flag.
        --only-dependencies          Install the dependencies with specified
                                     options but do not install the formula
                                     itself.
        --cc                         Attempt to compile using the specified
                                     compiler, which should be the name of the
                                     compiler's executable, e.g. gcc-7 for GCC
                                     7. In order to use LLVM's clang, specify
                                     llvm_clang. To use the Apple-provided
                                     clang, specify clang. This option will
                                     only accept compilers that are provided by
                                     Homebrew or bundled with macOS. Please do
                                     not file issues if you encounter errors
                                     while using this option.
    -s, --build-from-source          Compile formula from source even if a
                                     bottle is provided. Dependencies will still
                                     be installed from bottles if they are
                                     available.
        --force-bottle               Install from a bottle if it exists for the
                                     current or newest version of macOS, even if
                                     it would not normally be used for
                                     installation.
        --include-test               Install testing dependencies required to
                                     run brew test formula.
        --devel                      If formula defines it, install the
                                     development version.
        --HEAD                       If formula defines it, install the HEAD
                                     version, aka. master, trunk, unstable.
        --fetch-HEAD                 Fetch the upstream repository to detect if
                                     the HEAD installation of the formula is
                                     outdated. Otherwise, the repository's HEAD
                                     will only be checked for updates when a new
                                     stable or development version has been
                                     released.
        --keep-tmp                   Retain the temporary files created during
                                     installation.
        --build-bottle               Prepare the formula for eventual bottling
                                     during installation, skipping any
                                     post-install steps.
        --bottle-arch                Optimise bottles for the specified
                                     architecture rather than the oldest
                                     architecture supported by the version of
                                     macOS the bottles are built on.
    -f, --force                      Install without checking for previously
                                     installed keg-only or non-migrated
                                     versions.
    -v, --verbose                    Print the verification and postinstall
                                     steps.
        --display-times              Print install times for each formula at the
                                     end of the run.
    -i, --interactive                Download and patch formula, then open a
                                     shell. This allows the user to run
                                     ./configure --help and otherwise
                                     determine how to turn the software package
                                     into a Homebrew package.
    -g, --git                        Create a Git repository, useful for
                                     creating patches to the software.
    -h, --help                       Show this message.
```

##### 搜索软件

 `brew search [TEXT|/REGEX/]` 用于搜索软件，支持使用正则表达式进行复杂的搜索。

例如，查询静态博客生成工具hugo：

```shell
$ brew search hugo
==> Formulae
hugo
```

##### 查看软件信息

 `brew info [FORMULA...]` 用于查询软件的详细信息。

例如，查看软件hugo的详细信息：

```shell
$ brew search hugo
==> Formulae
hugo
$ brew info hugo
hugo: stable 0.72.0 (bottled), HEAD
Configurable static site generator
https://gohugo.io/
Not installed
From: https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git/Formula/hugo.rb
==> Dependencies
Build: go ✘
==> Options
--HEAD
	Install HEAD version
==> Analytics
install: 26,782 (30 days), 84,656 (90 days), 287,304 (365 days)
install-on-request: 26,266 (30 days), 82,887 (90 days), 279,634 (365 days)
build-error: 0 (30 days)
```

以上查询所得信息，包含了软件的最新可用版本，本机是否已安装，本机已安装的版本，安装的路径、大小、时间、Tap 源，所依赖的包，以及安装的可选项等详细信息。而这些信息可以帮助我们很方便快捷的了解如何对该软件进行相应的操作。

##### 安装软件包

 `brew install FORMULA... `用于安装一个或多个软件。

例如，安装软件hugo：

```
brew install hugo
```

安装软件命令执行之前，brew 一般会先检查更新 Homebrew 自身及 Tap 源。

##### 更新软件包

 `brew upgrade [FORMULA...]` 用于更新一个或多个软件，不指定软件名则更新所有软件。

##### 卸载软件包

`brew uninstall FORMULA...` 用于卸载指定的一个或多个软件

`brew uninstall --force FORMULA...` 彻底卸载指定软件，包括旧版本

##### 已安装的软件列表

 `brew list` 用于查询本机已安装的软件列表

```shell
$ brew list
apr		gettext		lz4		pcre2		python		sqlite		utf8proc
apr-util	go		mysql-client	perl		python@2	subversion	xz
gdbm		libzip		openssl@1.1	pkg-config	readline	tldr
```

##### 服务管理

 `brew services` 用于方便的管理 brew 安装的软件软件，类似于 Linux 下的 service 命令。

##### 检查可更新的软件列表

 `brew outdated` 可查询有更新版本的软件

```shell
$ brew outdated 
gettext (0.20.1) < 0.20.2_1
go (1.13.8) < 1.14.3
libzip (1.6.1) < 1.7.1
mysql-client (8.0.18) < 8.0.19
openssl@1.1 (1.1.1d) < 1.1.1g
pcre2 (10.34) < 10.35
perl (5.30.1) < 5.30.3
pkg-config (0.29.2) < 0.29.2_3
python (3.7.6_1) < 3.7.7
readline (8.0.1) < 8.0.4
sqlite (3.30.1) < 3.32.1
subversion (1.13.0_1) < 1.14.0_1
utf8proc (2.4.0) < 2.5.0
xz (5.2.4) < 5.2.5
```

##### 清理软件

`brew cleanup -n` 列出需要清理的内容

`brew cleanup` 清理所有的过时软件 

`brew cleanup [FORMULA]` 清理指定软件的过时包

##### 查看配置信息

`brew config` 用于查看 brew 所在环境及相关的配置情况

```shell
$ brew config
HOMEBREW_VERSION: 2.4.0
ORIGIN: https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-drivers.git
HEAD: 28ed0801ed5807e176e62a3ba66e47ec867ec17d
Last commit: 3 days ago
Core tap ORIGIN: https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
Core tap HEAD: c948bc65d13a2bdd43e5ef2ed4196930c731283c
Core tap last commit: 11 hours ago
HOMEBREW_PREFIX: /usr/local
HOMEBREW_BOTTLE_DOMAIN: https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles
HOMEBREW_MAKE_JOBS: 8
CPU: octa-core 64-bit kabylake
Homebrew Ruby: 2.6.3 => /usr/local/Homebrew/Library/Homebrew/vendor/portable-ruby/2.6.3_1/bin/ruby
Clang: 11.0 build 1103
Git: 2.24.1 => /Library/Developer/CommandLineTools/usr/bin/git
Curl: 7.64.1 => /usr/bin/curl
Java: 1.8.0_212
macOS: 10.15.4-x86_64
CLT: 1103.0.32.29
Xcode: N/A
```

##### 诊断问题

 `brew doctor` 诊断当前 brew 存在哪些问题，并给出解决方案

##### 仓库管理

`brew tap` 已安装的仓库列表

`brew tap [--full] user/repo [URL]` 添加仓库

`brew untap tap` 移除仓库

```shell
$ brew tap
homebrew/cask
homebrew/cask-drivers
homebrew/cask-fonts
homebrew/core
homebrew/services
tldr-pages/tldr
```

#### 镜像源

清华大学开源软件镜像站

[Homebrew 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)

```shell
# 查看 brew.git 当前源
$ cd "$(brew --repo)" && git remote -v
origin    https://github.com/Homebrew/brew.git (fetch)
origin    https://github.com/Homebrew/brew.git (push)

# 查看 homebrew-core.git 当前源
$ cd "$(brew --repo homebrew/core)" && git remote -v
origin    https://github.com/Homebrew/homebrew-core.git (fetch)
origin    https://github.com/Homebrew/homebrew-core.git (push)
# 更新
git fetch --unshallow 

# 查看 homebrew-core.git 当前源
$ cd "$(brew --repo homebrew/cask)" && git remote -v
origin	  https://github.com/homebrew/homebrew-cask.git (fetch)
origin	  https://github.com/homebrew/homebrew-cask.git (push)
# 更新
git fetch --unshallow 

# 替换现有上游
# 以下针对 mac OS 系统上的 Homebrew
git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git
git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git
git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git
git -C "$(brew --repo homebrew/cask-fonts)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-fonts.git
git -C "$(brew --repo homebrew/cask-drivers)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask-drivers.git
# 更换后测试工作是否正常
brew update

# 替换为阿里源
# 修改 brew.git 为阿里源
git -C "$(brew --repo)" remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git
# 修改 homebrew-core.git 为阿里源
git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git
git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-cask.git

# 替换为中科大源
# 替换各个源
git -C "$(brew --repo)" remote set-url origin https://mirrors.ustc.edu.cn/brew.git
git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

# 复原
# 以下针对 mac OS 系统上的 Homebrew
git -C "$(brew --repo homebrew/core)" remote set-url origin https://github.com/Homebrew/homebrew-core.git
git -C "$(brew --repo homebrew/cask)" remote set-url origin https://github.com/Homebrew/homebrew-cask.git
git -C "$(brew --repo homebrew/cask-fonts)" remote set-url origin https://github.com/Homebrew/homebrew-cask-fonts.git
git -C "$(brew --repo homebrew/cask-drivers)" remote set-url origin https://github.com/Homebrew/homebrew-cask-drivers.git
# 更换后测试工作是否正常
brew update
```

[Homebrew-bottles 镜像使用帮助](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew-bottles/)

```shell
# 临时替换
export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles

# 长期替换
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile

# 阿里源
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.aliyun.com/homebrew/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile

# 中科大
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
```

### 开发配置

#### Vim

参考[vim环境设置](https://weitrue.github.io/2021/01/10/vim/)

#### Iterm2

官网下载包安装：[http://iterm2.com/](https://link.zhihu.com/?target=https%3A//links.jianshu.com/go%3Fto%3Dhttp%3A%2F%2Fiterm2.com%2F)

使用Homwbrew安装：

```shell
brew install iterm2  
```

##### 主题设置

打开iTerm2 -> Preferences，然后`Profiles ---> Colors -> Color Presets -> solarized Dark` 

如果未安装solarized，[https://github.com/altercation/solarized](https://github.com/altercation/solarized)下载solarized，然后`Profiles ---> Colors -> Color Presets ->Import`选择刚刚解压的`solarized->iterm2-colors-solarized->Solarized Dark.itermcolors`文件，导入成功，最后选择Solarized Dark。

![](/images/mac/item_theme.png)

##### 字体设置

###### 安装Homebrew-Cask

```shell
brew tap homebrew/cask  // 添加 Github 上的 homebrew/cask 库
brew install brew-cask  // 安装 brew-cask
```

安装字体

```shell
brew tap homebrew/fonts 
brew install font-hack-nerd-font --cask  # 安装字体
```

打开iTerm2 -> Preferences，然后`Profiles ---> Text---> Font`选择字体

![](/images/mac/item_font.png)

#### oh-my-zsh

```shell
# 安裝 oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 安裝 powerlevel10k

```shell
# 下载并安装 powerlevel10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/custom/themes/powerlevel10k

echo 'source ~/.oh-my-zsh/custom/themes/powerlevel10k/powerlevel10k.zsh-theme' >>! ~/.zshrc
# 命令行设置
p10k configure
# (进入编辑配置) ~/.zshrc (zsh的配置)
vim ~/.zshrc
# (进入编辑配置) ~/.p10k.zsh (powerlevel10k 的配置)
vim ~/.p10k.zsh
```

![](/images/mac/powerlevel10.png)

#### tldr

```shell
brew install tldr
```

#### zsh-syntax-highlighting

```shell
brew install zsh-syntax-highlighting
vim ~/.zshrc
source /{zsh-syntax-highlighting安装位置share目录下}/zsh-syntax-highlighting.zsh

另一种方式
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
编辑vim ~/.zshrc文件，找到plugins配置，增加zsh-syntax-highlighting插件
```

![](/images/mac/zsh.png)

### Python环境

#### virtualenv

##### 安装virtualenv环境

```shell
pip install virtualenv
#检查是否安装成功
virtualenv --version
```

##### 创建以及使用虚拟环境

###### 创建时指定位置方式

```shell
# 创建python3环境
virtualenv -p python3 ~/Projects/PythonEnv/py3_normal/
# 进入虚拟环境
cd ~/Projects/PythonEnv/py3_normal/bin
source activate
# 退出环境
deactivate
```

###### 虚拟环境管理器方式

```shell
# 安装虚拟环境管理器
pip install virtualenvwrapper
# 配置虚拟环境管理器环境-添加配置
vim ~/.bash_profile

WORKON_HOME=~/Projects/PythonEnv
PROJECT_HOME=~/Projects/MyPython
export WORKON_HOME
export PROJECT_HOME
VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python3
source /usr/local/bin/virtualenvwrapper.sh
#保存-生效配置
source ~/.bash_profile

# 创建虚拟环境
## 创建python2的虚拟环境
mkvirtualenv <虚拟环境名>
## 创建python3的虚拟环境
mkvirtualenv -p python3 <虚拟环境名>
# 进入/切换虚拟环境
workon <虚拟环境名>
# 退出虚拟环境
deactivate

# 其他命令
lsvirtualenv   # 查看虚拟环境列表
lssitepackages # 查看当前环境中安装的那些包（启动虚拟环境后）
rmvirtualenv   # 虚拟环境名 删除虚拟环境
```

#### Anaconda or Miniconda

##### 安装

清华大学开源软件镜像站 https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/

```shell
# Download
wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda-3.4.2-MacOSX-x86_64.sh
# Install
bash Miniconda-3.4.2-MacOSX-x86_64.sh
# Activate
source .bashrc
```

##### 创建以及使用虚拟环境 

```shell
- Create a new environment, installing named packages into it:
    conda create --name environment_name python=2.7 matplotlib

- List all environments:
    conda info --envs

- Load or unload an environment:
    conda activate|deactivate environment_name

- Delete an environment (remove all packages):
    conda remove --name environment_name --all

- Search conda channels for a package by name:
    conda search package_name

- Install packages into the current environment:
    conda install python=3.4 numpy

- List currently installed packages in current environment:
    conda list

- Delete unused packages and caches:
    conda clean --all
```

#### Python pip 配置国内源[pip install Read timed out]

##### **【方式一】临时生效**

```
# 在安装时加上镜像源
pip install <库名> -i https://pypi.douban.com/simple/ --trusted-host pypi.douban.compyth
```

##### **【方式二】永久指定**

###### 国内源列表（推荐用阿里云的）

阿里云`http://mirrors.aliyun.com/pypi/simple/`

中国科技大学 `https://pypi.mirrors.ustc.edu.cn/simple/`

豆瓣 (douban) `https://pypi.douban.com/simple/`

清华大学 `https://pypi.tuna.tsinghua.edu.cn/simple/`

中国科学技术大学 `http://pypi.mirrors.ustc.edu.cn/simple/`

###### home目录下创建文件

```shell
mkdir .pip	# 在家目录下创建一个.pip目录
~ cd pip
~ touch pip.conf # 创建一个pip配置文件
# 写入配置
[global]
index-url = http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host = mirrors.aliyun.com
```

#### 更新Python版本后,命令行下pip 命令报错

电脑中Python3由3.7更新到3.9后，在命令行下使用`pip list`报以下错误

```
zsh: /usr/local/bin/pip: bad interpreter: /usr/local/opt/python/bin/python3.7: no such file or directory
```

但是命令`pip3 list`可以正常使用，这是需要考虑`pip`指向的python设置是否正确

```zsh
# 查看pip命令配置文件
which pip
/usr/local/bin/pip
# 查看pip3命令配置文件
/usr/local/bin/pip3
```

对比发现/usr/local/bin/pip指向的python版本时3.7，/usr/local/bin/pip3指向的是正确的。因此，将/usr/local/bin/pip指向python版本的配置修改成/usr/local/bin/pip3指向的配置。



### Go开发

#### brew安装

```shell
~ brew install go
# 安装指定 go 版本
~ brew install go@<version>
```

默认安装一个 go 的最新版本，也可安装指定版本。

##### Brew 切换 Go 版本

###### 【方式一】brew link

安装新的版本

```shell
~ brew install go@<version>
```

移除原有的 go 版本软链

```shell
~ brew unlink go
```

指定新的版本软链

```shell
~ brew link go@<version>
```

###### 【方式二】brew switch

使用 `brew info go` 命令你可以看到当前的 go 可以切换的版本。

```bash
~ brew switch go <version1>
Cleaning /usr/local/Cellar/go/<version1>
Cleaning /usr/local/Cellar/go/<version2>
0 links created for /usr/local/Cellar/go/<version1>
```

创建了零个连接，就代表着没有成功的将 go 版本指向你所需要的版本下，问题是什么呢？现将 go 版本切回 go <version2>，你会发现可以切换并正常使用：

```bash
~ brew switch go <version2>
Cleaning /usr/local/Cellar/go/<version1>
Cleaning /usr/local/Cellar/go/<version2>
3 links created for /usr/local/Cellar/go/<version2>

~ go version
go version go<version2> darwin/amd64
```

定位这个原因你需要看看为什么没有未给 go <version1> 版本创建软连接，首先要找一下 go 默认安装的位置，使用 `go env` 查看安装目录：

```shell
/usr/local/Cellar/go/
```

进入到目录之后在 go 目录下只有刚才默认安装的 <version2> 版本，并没有自己安装的版本，退出父级目录看到了下载的 go@<version1>版本，由于软连接连接的是上方的路径，需要将这个目录移动至 go 目录下：

```bash
// 打开默认目录
cd /usr/local/Cellar/go/
// 退出目录
cd ..
// 移动目录至 go 目录下
mv go@<version1> go/
// 重要！！！ 重命名文件夹
mv go@<version1> <version1>
```

接下来使用切换命令 `brew switch go <version>` 就可以切换环境了。

##### brew 报错 "fatal: Could not resolve HEAD to a revision"

[解决方法](https://www.jianshu.com/p/b2de788c3c6d)

### Catalina升级Sur Big遇到的坑

#### Homebrew

##### brew报错：`initialize': Version value must be a string; got a NilClass () (TypeError)

```Python
brew list
Traceback (most recent call last):
    11: from /usr/local/Homebrew/Library/Homebrew/brew.rb:23:in `<main>'
    10: from /usr/local/Homebrew/Library/Homebrew/brew.rb:23:in `require_relative'
     9: from /usr/local/Homebrew/Library/Homebrew/global.rb:29:in `<top (required)>'
     8: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/rubygems/core_ext/kernel_require.rb:54:in `require'
     7: from /System/Library/Frameworks/Ruby.framework/Versions/2.6/usr/lib/ruby/2.6.0/rubygems/core_ext/kernel_require.rb:54:in `require'
     6: from /usr/local/Homebrew/Library/Homebrew/os.rb:3:in `<top (required)>'
     5: from /usr/local/Homebrew/Library/Homebrew/os.rb:21:in `<module:OS>'
     4: from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:58:in `prerelease?'
     3: from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:24:in `version'
     2: from /usr/local/Homebrew/Library/Homebrew/os/mac.rb:24:in `new'
     1: from /usr/local/Homebrew/Library/Homebrew/os/mac/version.rb:26:in `initialize'
/usr/local/Homebrew/Library/Homebrew/version.rb:368:in `initialize': Version value must be a string; got a NilClass () (TypeError)
```

根据Traceback信息可以发现/usr/local/Homebrew/Library/Homebrew/os/mac/version.rb中报错,vim打开该文件

```Python
vim /usr/local/Homebrew/Library/Homebrew/os/mac/version.rb
# typed: true
# frozen_string_literal: true

require "hardware"
require "version"

module OS
  module Mac
    # A macOS version.
    #
    # @api private
    class Version < ::Version
      SYMBOLS = 
        catalina:    "10.15",
        mojave:      "10.14",
        high_sierra: "10.13",
        sierra:      "10.12",
        el_capitan:  "10.11",
        yosemite:    "10.10",
      }.freeze

      def self.from_symbol(sym)
        str = SYMBOLS.fetch(sym) { raise MacOSVersionError, sym }
        new(str)
      end

      def initialize(value)
        super(value)

        raise MacOSVersionError, value unless value.match?(/\A1\d+(?:\.\d+){0,2}\Z/)
```

从代码中可以看出,该版本的Homebrew不支持Sur Big系统,于是解决方案是更新Homebrew

```bash
brew update-reset
```

结果,brew没了,命令输入brew报错

```bash
zsh:brew: command not found
```

无奈只能重新安装

但是这次就没有那么幸运,ruby源已更换成国内的

使用科学上网,也无法访问https://raw.githubusercontent.com

于是只能另寻方法,Google上找到.bash脚本

桌面创建.bash文件

```
vim /Desktop/brew_install.sh
```

脚本内容

```bash
#!/bin/bash
set -u

# First check if the OS is Linux.
if [[ "$(uname)" = "Linux" ]]; then
  HOMEBREW_ON_LINUX=1
fi

# Check if macOS is ARM
if [[ "$(uname -m)" = "arm64" ]] && [[ "$(uname)" = "Darwin" ]]; then
  HOMEBREW_APPLE_SILICON=1
fi

# On macOS, this script installs to /usr/local only.
# On Linux, it installs to /home/linuxbrew/.linuxbrew if you have sudo access
# and ~/.linuxbrew otherwise.
# To install elsewhere (which is unsupported)
# you can untar https://github.com/Homebrew/brew/tarball/master
# anywhere you like.
if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
  HOMEBREW_PREFIX="/usr/local"
  HOMEBREW_REPOSITORY="/usr/local/Homebrew"
  HOMEBREW_CACHE="${HOME}/Library/Caches/Homebrew"

  STAT="stat -f"
  CHOWN="/usr/sbin/chown"
  CHGRP="/usr/bin/chgrp"
  GROUP="admin"
  TOUCH="/usr/bin/touch"
else
  HOMEBREW_PREFIX_DEFAULT="/home/linuxbrew/.linuxbrew"
  HOMEBREW_CACHE="${HOME}/.cache/Homebrew"

  STAT="stat --printf"
  CHOWN="/bin/chown"
  CHGRP="/bin/chgrp"
  GROUP="$(id -gn)"
  TOUCH="/bin/touch"
fi
BREW_REPO="https://github.com/Homebrew/brew"

# TODO: bump version when new macOS is released
MACOS_LATEST_SUPPORTED="10.15"
# TODO: bump version when new macOS is released
MACOS_OLDEST_SUPPORTED="10.13"

# For Homebrew on Linux
REQUIRED_RUBY_VERSION=2.6  # https://github.com/Homebrew/brew/pull/6556
REQUIRED_GLIBC_VERSION=2.13  # https://docs.brew.sh/Homebrew-on-Linux#requirements

# no analytics during installation
export HOMEBREW_NO_ANALYTICS_THIS_RUN=1
export HOMEBREW_NO_ANALYTICS_MESSAGE_OUTPUT=1

# string formatters
if [[ -t 1 ]]; then
  tty_escape() { printf "\033[%sm" "$1"; }
else
  tty_escape() { :; }
fi
tty_mkbold() { tty_escape "1;$1"; }
tty_underline="$(tty_escape "4;39")"
tty_blue="$(tty_mkbold 34)"
tty_red="$(tty_mkbold 31)"
tty_bold="$(tty_mkbold 39)"
tty_reset="$(tty_escape 0)"

have_sudo_access() {
  local -a args
  if [[ -n "${SUDO_ASKPASS-}" ]]; then
    args=("-A")
  fi

  if [[ -z "${HAVE_SUDO_ACCESS-}" ]]; then
    if [[ -n "${args[*]-}" ]]; then
      /usr/bin/sudo "${args[@]}" -l mkdir &>/dev/null
    else
      /usr/bin/sudo -l mkdir &>/dev/null
    fi
    HAVE_SUDO_ACCESS="$?"
  fi

  if [[ -z "${HOMEBREW_ON_LINUX-}" ]] && [[ "$HAVE_SUDO_ACCESS" -ne 0 ]]; then
    abort "Need sudo access on macOS (e.g. the user $USER to be an Administrator)!"
  fi

  return "$HAVE_SUDO_ACCESS"
}

shell_join() {
  local arg
  printf "%s" "$1"
  shift
  for arg in "$@"; do
    printf " "
    printf "%s" "${arg// /\ }"
  done
}

chomp() {
  printf "%s" "${1/"$'\n'"/}"
}

ohai() {
  printf "${tty_blue}==>${tty_bold} %s${tty_reset}\n" "$(shell_join "$@")"
}

warn() {
  printf "${tty_red}Warning${tty_reset}: %s\n" "$(chomp "$1")"
}

abort() {
  printf "%s\n" "$1"
  exit 1
}

execute() {
  if ! "$@"; then
    abort "$(printf "Failed during: %s" "$(shell_join "$@")")"
  fi
}

execute_sudo() {
  local -a args=("$@")
  if [[ -n "${SUDO_ASKPASS-}" ]]; then
    args=("-A" "${args[@]}")
  fi
  if have_sudo_access; then
    ohai "/usr/bin/sudo" "${args[@]}"
    execute "/usr/bin/sudo" "${args[@]}"
  else
    ohai "${args[@]}"
    execute "${args[@]}"
  fi
}

getc() {
  local save_state
  save_state=$(/bin/stty -g)
  /bin/stty raw -echo
  IFS= read -r -n 1 -d '' "$@"
  /bin/stty "$save_state"
}

wait_for_user() {
  local c
  echo
  echo "Press RETURN to continue or any other key to abort"
  getc c
  # we test for \r and \n because some stuff does \r instead
  if ! [[ "$c" == $'\r' || "$c" == $'\n' ]]; then
    exit 1
  fi
}

major_minor() {
  echo "${1%%.*}.$(x="${1#*.}"; echo "${x%%.*}")"
}

if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
  macos_version="$(major_minor "$(/usr/bin/sw_vers -productVersion)")"
fi

version_gt() {
  [[ "${1%.*}" -gt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -gt "${2#*.}" ]]
}
version_ge() {
  [[ "${1%.*}" -gt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -ge "${2#*.}" ]]
}
version_lt() {
  [[ "${1%.*}" -lt "${2%.*}" ]] || [[ "${1%.*}" -eq "${2%.*}" && "${1#*.}" -lt "${2#*.}" ]]
}

should_install_git() {
  if [[ $(command -v git) ]]; then
    return 1
  fi
}

should_install_command_line_tools() {
  if [[ -n "${HOMEBREW_ON_LINUX-}" ]]; then
    return 1
  fi

  if [[ -n "${HOMEBREW_APPLE_SILICON-}" ]]; then
    return 1;
  fi

  if version_gt "$macos_version" "10.13"; then
    ! [[ -e "/Library/Developer/CommandLineTools/usr/bin/git" ]]
  else
    ! [[ -e "/Library/Developer/CommandLineTools/usr/bin/git" ]] ||
      ! [[ -e "/usr/include/iconv.h" ]]
  fi
}

get_permission() {
  $STAT "%A" "$1"
}

user_only_chmod() {
  [[ -d "$1" ]] && [[ "$(get_permission "$1")" != "755" ]]
}

exists_but_not_writable() {
  [[ -e "$1" ]] && ! [[ -r "$1" && -w "$1" && -x "$1" ]]
}

get_owner() {
  $STAT "%u" "$1"
}

file_not_owned() {
  [[ "$(get_owner "$1")" != "$(id -u)" ]]
}

get_group() {
  $STAT "%g" "$1"
}

file_not_grpowned() {
  [[ " $(id -G "$USER") " != *" $(get_group "$1") "*  ]]
}

# Please sync with 'test_ruby()' in 'Library/Homebrew/utils/ruby.sh' from Homebrew/brew repository.
test_ruby () {
  if [[ ! -x $1 ]]
  then
    return 1
  fi

  "$1" --enable-frozen-string-literal --disable=gems,did_you_mean,rubyopt -rrubygems -e \
    "abort if Gem::Version.new(RUBY_VERSION.to_s.dup).to_s.split('.').first(2) != \
              Gem::Version.new('$REQUIRED_RUBY_VERSION').to_s.split('.').first(2)" 2>/dev/null
}

no_usable_ruby() {
  local ruby_exec
  IFS=$'\n' # Do word splitting on new lines only
  for ruby_exec in $(which -a ruby); do
    if test_ruby "$ruby_exec"; then
      return 1
    fi
  done
  IFS=$' \t\n' # Restore IFS to its default value
  return 0
}

outdated_glibc() {
  local glibc_version
  glibc_version=$(ldd --version | head -n1 | grep -o '[0-9.]*$' | grep -o '^[0-9]\+\.[0-9]\+')
  version_lt "$glibc_version" "$REQUIRED_GLIBC_VERSION"
}

if [[ -n "${HOMEBREW_ON_LINUX-}" ]] && no_usable_ruby && outdated_glibc
then
    abort "$(cat <<-EOFABORT
    Homebrew requires Ruby $REQUIRED_RUBY_VERSION which was not found on your system.
    Homebrew portable Ruby requires Glibc version $REQUIRED_GLIBC_VERSION or newer,
    and your Glibc version is too old.
    See ${tty_underline}https://docs.brew.sh/Homebrew-on-Linux#requirements${tty_reset}
    Install Ruby $REQUIRED_RUBY_VERSION and add its location to your PATH.
    EOFABORT
    )"
fi

# USER isn't always set so provide a fall back for the installer and subprocesses.
if [[ -z "${USER-}" ]]; then
  USER="$(chomp "$(id -un)")"
  export USER
fi

# Invalidate sudo timestamp before exiting (if it wasn't active before).
if ! /usr/bin/sudo -n -v 2>/dev/null; then
  trap '/usr/bin/sudo -k' EXIT
fi

# Things can fail later if `pwd` doesn't exist.
# Also sudo prints a warning message for no good reason
cd "/usr" || exit 1

####################################################################### script
if should_install_git; then
    abort "$(cat <<EOABORT
You must install Git before installing Homebrew. See:
  ${tty_underline}https://docs.brew.sh/Installation${tty_reset}
EOABORT
)"
fi

if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
 have_sudo_access
else
  if [[ -n "${CI-}" ]] || [[ -w "$HOMEBREW_PREFIX_DEFAULT" ]] || [[ -w "/home/linuxbrew" ]] || [[ -w "/home" ]]; then
    HOMEBREW_PREFIX="$HOMEBREW_PREFIX_DEFAULT"
  else
    trap exit SIGINT
    if [[ $(/usr/bin/sudo -n -l mkdir 2>&1) != *"mkdir"* ]]; then
      ohai "Select the Homebrew installation directory"
      echo "- ${tty_bold}Enter your password${tty_reset} to install to ${tty_underline}${HOMEBREW_PREFIX_DEFAULT}${tty_reset} (${tty_bold}recommended${tty_reset})"
      echo "- ${tty_bold}Press Control-D${tty_reset} to install to ${tty_underline}$HOME/.linuxbrew${tty_reset}"
      echo "- ${tty_bold}Press Control-C${tty_reset} to cancel installation"
    fi
    if have_sudo_access; then
      HOMEBREW_PREFIX="$HOMEBREW_PREFIX_DEFAULT"
    else
      HOMEBREW_PREFIX="$HOME/.linuxbrew"
    fi
    trap - SIGINT
  fi
  HOMEBREW_REPOSITORY="${HOMEBREW_PREFIX}/Homebrew"
fi

if [[ "$UID" == "0" ]]; then
  abort "Don't run this as root!"
elif [[ -d "$HOMEBREW_PREFIX" && ! -x "$HOMEBREW_PREFIX" ]]; then
  abort "$(cat <<EOABORT
The Homebrew prefix, ${HOMEBREW_PREFIX}, exists but is not searchable. If this is
not intentional, please restore the default permissions and try running the
installer again:
    sudo chmod 775 ${HOMEBREW_PREFIX}
EOABORT
)"
fi

if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
  if version_lt "$macos_version" "10.7"; then
    abort "$(cat <<EOABORT
Your Mac OS X version is too old. See:
  ${tty_underline}https://github.com/mistydemeo/tigerbrew${tty_reset}
EOABORT
)"
  elif version_lt "$macos_version" "10.9"; then
    abort "Your OS X version is too old"
  elif version_gt "$macos_version" "$MACOS_LATEST_SUPPORTED" || \
    version_lt "$macos_version" "$MACOS_OLDEST_SUPPORTED"; then
    who="We"
    what=""
    if version_gt "$macos_version" "$MACOS_LATEST_SUPPORTED"; then
      what="pre-release version"
    else
      who+=" (and Apple)"
      what="old version"
    fi
    ohai "You are using macOS ${macos_version}."
    ohai "${who} do not provide support for this ${what}."

    echo "$(cat <<EOS
This installation may not succeed.
After installation, you will encounter build failures with some formulae.
Please create pull requests instead of asking for help on Homebrew\'s GitHub,
Discourse, Twitter or IRC. You are responsible for resolving any issues you
experience while you are running this ${what}.
EOS
)
"
  fi
fi

ohai "This script will install:"
echo "${HOMEBREW_PREFIX}/bin/brew"
echo "${HOMEBREW_PREFIX}/share/doc/homebrew"
echo "${HOMEBREW_PREFIX}/share/man/man1/brew.1"
echo "${HOMEBREW_PREFIX}/share/zsh/site-functions/_brew"
echo "${HOMEBREW_PREFIX}/etc/bash_completion.d/brew"
echo "${HOMEBREW_REPOSITORY}"

# Keep relatively in sync with
# https://github.com/Homebrew/brew/blob/master/Library/Homebrew/keg.rb
directories=(bin etc include lib sbin share opt var
             Frameworks
             etc/bash_completion.d lib/pkgconfig
             share/aclocal share/doc share/info share/locale share/man
             share/man/man1 share/man/man2 share/man/man3 share/man/man4
             share/man/man5 share/man/man6 share/man/man7 share/man/man8
             var/log var/homebrew var/homebrew/linked
             bin/brew)
group_chmods=()
for dir in "${directories[@]}"; do
  if exists_but_not_writable "${HOMEBREW_PREFIX}/${dir}"; then
    group_chmods+=("${HOMEBREW_PREFIX}/${dir}")
  fi
done

# zsh refuses to read from these directories if group writable
directories=(share/zsh share/zsh/site-functions)
zsh_dirs=()
for dir in "${directories[@]}"; do
  zsh_dirs+=("${HOMEBREW_PREFIX}/${dir}")
done

directories=(bin etc include lib sbin share var opt
             share/zsh share/zsh/site-functions
             var/homebrew var/homebrew/linked
             Cellar Caskroom Homebrew Frameworks)
mkdirs=()
for dir in "${directories[@]}"; do
  if ! [[ -d "${HOMEBREW_PREFIX}/${dir}" ]]; then
    mkdirs+=("${HOMEBREW_PREFIX}/${dir}")
  fi
done

user_chmods=()
if [[ "${#zsh_dirs[@]}" -gt 0 ]]; then
  for dir in "${zsh_dirs[@]}"; do
    if user_only_chmod "${dir}"; then
      user_chmods+=("${dir}")
    fi
  done
fi

chmods=()
if [[ "${#group_chmods[@]}" -gt 0 ]]; then
  chmods+=("${group_chmods[@]}")
fi
if [[ "${#user_chmods[@]}" -gt 0 ]]; then
  chmods+=("${user_chmods[@]}")
fi

chowns=()
chgrps=()
if [[ "${#chmods[@]}" -gt 0 ]]; then
  for dir in "${chmods[@]}"; do
    if file_not_owned "${dir}"; then
      chowns+=("${dir}")
    fi
    if file_not_grpowned "${dir}"; then
      chgrps+=("${dir}")
    fi
  done
fi

if [[ "${#group_chmods[@]}" -gt 0 ]]; then
  ohai "The following existing directories will be made group writable:"
  printf "%s\n" "${group_chmods[@]}"
fi
if [[ "${#user_chmods[@]}" -gt 0 ]]; then
  ohai "The following existing directories will be made writable by user only:"
  printf "%s\n" "${user_chmods[@]}"
fi
if [[ "${#chowns[@]}" -gt 0 ]]; then
  ohai "The following existing directories will have their owner set to ${tty_underline}${USER}${tty_reset}:"
  printf "%s\n" "${chowns[@]}"
fi
if [[ "${#chgrps[@]}" -gt 0 ]]; then
  ohai "The following existing directories will have their group set to ${tty_underline}${GROUP}${tty_reset}:"
  printf "%s\n" "${chgrps[@]}"
fi
if [[ "${#mkdirs[@]}" -gt 0 ]]; then
  ohai "The following new directories will be created:"
  printf "%s\n" "${mkdirs[@]}"
fi

if should_install_command_line_tools; then
  ohai "The Xcode Command Line Tools will be installed."
fi

if [[ -t 0 && -z "${CI-}" ]]; then
  wait_for_user
fi

if [[ -d "${HOMEBREW_PREFIX}" ]]; then
  if [[ "${#chmods[@]}" -gt 0 ]]; then
    execute_sudo "/bin/chmod" "u+rwx" "${chmods[@]}"
  fi
  if [[ "${#group_chmods[@]}" -gt 0 ]]; then
    execute_sudo "/bin/chmod" "g+rwx" "${group_chmods[@]}"
  fi
  if [[ "${#user_chmods[@]}" -gt 0 ]]; then
    execute_sudo "/bin/chmod" "755" "${user_chmods[@]}"
  fi
  if [[ "${#chowns[@]}" -gt 0 ]]; then
    execute_sudo "$CHOWN" "$USER" "${chowns[@]}"
  fi
  if [[ "${#chgrps[@]}" -gt 0 ]]; then
    execute_sudo "$CHGRP" "$GROUP" "${chgrps[@]}"
  fi
else
  execute_sudo "/bin/mkdir" "-p" "${HOMEBREW_PREFIX}"
  if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
    execute_sudo "$CHOWN" "root:wheel" "${HOMEBREW_PREFIX}"
  else
    execute_sudo "$CHOWN" "$USER:$GROUP" "${HOMEBREW_PREFIX}"
  fi
fi

if [[ "${#mkdirs[@]}" -gt 0 ]]; then
  execute_sudo "/bin/mkdir" "-p" "${mkdirs[@]}"
  execute_sudo "/bin/chmod" "g+rwx" "${mkdirs[@]}"
  execute_sudo "$CHOWN" "$USER" "${mkdirs[@]}"
  execute_sudo "$CHGRP" "$GROUP" "${mkdirs[@]}"
fi

if ! [[ -d "${HOMEBREW_CACHE}" ]]; then
  if [[ -z "${HOMEBREW_ON_LINUX-}" ]]; then
    execute_sudo "/bin/mkdir" "-p" "${HOMEBREW_CACHE}"
  else
    execute "/bin/mkdir" "-p" "${HOMEBREW_CACHE}"
  fi
fi
if exists_but_not_writable "${HOMEBREW_CACHE}"; then
  execute_sudo "/bin/chmod" "g+rwx" "${HOMEBREW_CACHE}"
fi
if file_not_owned "${HOMEBREW_CACHE}"; then
  execute_sudo "$CHOWN" "$USER" "${HOMEBREW_CACHE}"
fi
if file_not_grpowned "${HOMEBREW_CACHE}"; then
  execute_sudo "$CHGRP" "$GROUP" "${HOMEBREW_CACHE}"
fi
if [[ -d "${HOMEBREW_CACHE}" ]]; then
  execute "$TOUCH" "${HOMEBREW_CACHE}/.cleaned"
fi

if should_install_command_line_tools && version_ge "$macos_version" "10.13"; then
  ohai "Searching online for the Command Line Tools"
  # This temporary file prompts the 'softwareupdate' utility to list the Command Line Tools
  clt_placeholder="/tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress"
  execute_sudo "$TOUCH" "$clt_placeholder"

  clt_label_command="/usr/sbin/softwareupdate -l |
                      grep -B 1 -E 'Command Line Tools' |
                      awk -F'*' '/^ *\\*/ {print \$2}' |
                      sed -e 's/^ *Label: //' -e 's/^ *//' |
                      sort -V |
                      tail -n1"
  clt_label="$(chomp "$(/bin/bash -c "$clt_label_command")")"

  if [[ -n "$clt_label" ]]; then
    ohai "Installing $clt_label"
    execute_sudo "/usr/sbin/softwareupdate" "-i" "$clt_label"
    execute_sudo "/bin/rm" "-f" "$clt_placeholder"
    execute_sudo "/usr/bin/xcode-select" "--switch" "/Library/Developer/CommandLineTools"
  fi
fi

# Headless install may have failed, so fallback to original 'xcode-select' method
if should_install_command_line_tools && test -t 0; then
  ohai "Installing the Command Line Tools (expect a GUI popup):"
  execute_sudo "/usr/bin/xcode-select" "--install"
  echo "Press any key when the installation has completed."
  getc
  execute_sudo "/usr/bin/xcode-select" "--switch" "/Library/Developer/CommandLineTools"
fi

if [[ -z "${HOMEBREW_ON_LINUX-}" ]] && ! output="$(/usr/bin/xcrun clang 2>&1)" && [[ "$output" == *"license"* ]]; then
  abort "$(cat <<EOABORT
You have not agreed to the Xcode license.
Before running the installer again please agree to the license by opening
Xcode.app or running:
    sudo xcodebuild -license
EOABORT
)"
fi

ohai "Downloading and installing Homebrew..."
(
  cd "${HOMEBREW_REPOSITORY}" >/dev/null || return

  # we do it in four steps to avoid merge errors when reinstalling
  execute "git" "init" "-q"

  # "git remote add" will fail if the remote is defined in the global config
  execute "git" "config" "remote.origin.url" "${BREW_REPO}"
  execute "git" "config" "remote.origin.fetch" "+refs/heads/*:refs/remotes/origin/*"

  # ensure we don't munge line endings on checkout
  execute "git" "config" "core.autocrlf" "false"

  execute "git" "fetch" "origin" "--force"
  execute "git" "fetch" "origin" "--tags" "--force"

  execute "git" "reset" "--hard" "origin/master"

  execute "ln" "-sf" "${HOMEBREW_REPOSITORY}/bin/brew" "${HOMEBREW_PREFIX}/bin/brew"

  execute "${HOMEBREW_PREFIX}/bin/brew" "update" "--force"
) || exit 1

if [[ ":${PATH}:" != *":${HOMEBREW_PREFIX}/bin:"* ]]; then
  warn "${HOMEBREW_PREFIX}/bin is not in your PATH."
fi

ohai "Installation successful!"
echo

# Use the shell's audible bell.
if [[ -t 1 ]]; then
  printf "\a"
fi

# Use an extra newline and bold to avoid this being missed.
ohai "Homebrew has enabled anonymous aggregate formulae and cask analytics."
echo "$(cat <<EOS
${tty_bold}Read the analytics documentation (and how to opt-out) here:
  ${tty_underline}https://docs.brew.sh/Analytics${tty_reset}
No analytics data has been sent yet (or will be during this \`install\` run).
EOS
)
"

ohai "Homebrew is run entirely by unpaid volunteers. Please consider donating:"
echo "$(cat <<EOS
  ${tty_underline}https://github.com/Homebrew/brew#donations${tty_reset}
EOS
)
"

(
  cd "${HOMEBREW_REPOSITORY}" >/dev/null || return
  execute "git" "config" "--replace-all" "homebrew.analyticsmessage" "true"
  execute "git" "config" "--replace-all" "homebrew.caskanalyticsmessage" "true"
) || exit 1

ohai "Next steps:"
echo "- Run \`brew help\` to get started"
echo "- Further documentation: "
echo "    ${tty_underline}https://docs.brew.sh${tty_reset}"

if [[ -n "${HOMEBREW_ON_LINUX-}" ]]; then
  case "$SHELL" in
    */bash*)
      if [[ -r "$HOME/.bash_profile" ]]; then
        shell_profile="$HOME/.bash_profile"
      else
        shell_profile="$HOME/.profile"
      fi
      ;;
    */zsh*)
      shell_profile="$HOME/.zprofile"
      ;;
    *)
      shell_profile="$HOME/.profile"
      ;;
  esac

  cat <<EOS
- Install the Homebrew dependencies if you have sudo access:
  ${tty_bold}Debian, Ubuntu, etc.${tty_reset}
    sudo apt-get install build-essential
  ${tty_bold}Fedora, Red Hat, CentOS, etc.${tty_reset}
    sudo yum groupinstall 'Development Tools'
  See ${tty_underline}https://docs.brew.sh/linux${tty_reset} for more information.
- Configure Homebrew in your ${tty_underline}${shell_profile}${tty_reset} by running
    echo 'eval \$(${HOMEBREW_PREFIX}/bin/brew shellenv)' >> ${shell_profile}
- Add Homebrew to your ${tty_bold}PATH${tty_reset}
    eval \$(${HOMEBREW_PREFIX}/bin/brew shellenv)
- We recommend that you install GCC by running:
    brew install gcc

EOS
fi
```

执行前,需要给改脚本赋权限

```bash
sudo chmod -R 777 brew_install.sh

./brew_install.sh
```

等待安装成功(中间有过两次失败,主要原因是原来安装的Homebrew没有卸载干净)

#### VMware Fusion 

##### 物理内存不足，无法使用配置的设置开启虚拟机

原来的VMware Fusion 版本是11

![](/images/mac/vmfusion_11.png)

Google后发现12可以用,于是下载了VMware Fusion安装,亲测可用

##### 无法将“Ethernet0”连接到虚拟网络“/dev/vmnet8”。

VMware Fusion升级到12后，过了几天打开虚拟机时，发现“Ethernet0”连接到虚拟网络“/dev/vmnet8”

谷歌了好久后发现

```zsh
sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist && sudo killall -9 configd
```

解决方式来源：

https://communities.vmware.com/t5/VMware-Fusion-Discussions/No-Ethernet-Connection-VMware-Fusion-12-macOS-Big-Sur-Beta-6/m-p/2303833#M140209

另外，当苹果电脑共享wifi时，也会造成这个结果。所以共享网络也需要关闭。

### 命令行查看保存的密码

#### security find-generic-password -ga "wifi名称"

![](/images/mac/wifi.png)

### Mac使用wireshark抓包无法选择网卡

[解决方法](https://www.jianshu.com/p/23f54c8a6eff)