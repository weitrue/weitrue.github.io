---
title: 【Python】Windows下基于Django构建与开发在线学习项目
comments: false     # 是否可评论
toc: true           # 是否显示文章目录
categories:  Python # 分类
tags: [Python,Django,Windows] # 标签
index_img: /images/python/django-web/index.jpg
---
基于`Django2.2.6` `Python3.7`开发的入门级Web服务《supe-wa慕课小站》 <!-- more --> 

### 项目创建

**1.安装第三方库Django**

![](/images/python/django-web/1.png)

**2.pycharm创建Django项目**

![](/images/python/django-web/2.png)

### 数据库环境与资源层设置

**3.安装mysql第三方库**

![](/images/python/django-web/3.png)

**4.配置mysql数据库环境**

![](/images/python/django-web/4.png)

**5.生成django默认数据表**

tool -->Run manage.py task

```
makemigrations 

migrate
```

![](/images/python/django-web/5.png)

查看数据表，会发现生成了django的数据表

![](/images/python/django-web/5-1.png)

**6.创建一个app**

startapp user

![](/images/python/django-web/6-1.png)

项目目录下会生成

![](/images/python/django-web/6-2.png)

**7.自定义user表**

Django生成的user表

- id: 主键, password 密码, last_login Django自动记录用户最后登录时间,。
- is_superuser 表明用户是否是超级用户(后台管理会用到)。
- username 用户名字段不要随便改动, email 邮箱,
- is_staff 表示是否是员工(后台管理会用到)。
- is_active 用户是否是激活状态, date_joined 注册时间。

这些往往不能满足我们自身的需求，因此需要自定义user表，在user下的models.py文件添加代码

```python
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser

class TbUser(AbstractUser):
    nickname = models.CharField(null=True, max_length=50, verbose_name='昵称',)
    birthday = models.DateField(null=True, verbose_name='生日')
    gender = models.IntegerField(choices=((1, '男'), (0, '女')), verbose_name='性别', default=1)
    address = models.CharField(null=True, max_length=200, verbose_name='地址')
    phone = models.CharField(null=True, blank=True, max_length=11, verbose_name='手机')
    head = models.ImageField(upload_to='image/%Y/%m', max_length=100, verbose_name='头像', default='image/default_m.png') # 注意这里的head使用ImageField，需要安装依赖库pip install pillow

    class Meta:
        db_table = 'tb_user'
        verbose_name = '用户信息'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.username
```

修改settings.py文件

![](/images/python/django-web/7-1.png)

在这里，def __str__(self)：方法在python3.x版本使用，用于后台展示样式是显示的是用户名。保存后，使用django敏玲重新生成表

tool -->Run manage.py task

```
makemigrations user 
migrate user
```

创建后台管理用户

```
createsuperuser
```

填写用户名、邮箱和密码

![](/images/python/django-web/7-2.png)

可以查看到数据库中新增一条数据

![](/images/python/django-web/7-3.png)

这样就可以登录后台管理页面了

### 后台集成

**8.集成xadmin组件**

python3.x无法直接使用安装包

```
pip install git+git://github.com/sshwsfc/xadmin.git@django2
```

或者访问`https://github.com/sshwsfc/xadmin/tree/django2 `，

或`git clone -b django2  https://github.com/sshwsfc/xadmin.git `将xadmin目录下文件拷贝到项目下

![](/images/python/django-web/8-1.png)

在settings.py文件下添加相应配置

![](/images/python/django-web/8-2.png)

把urls中默认admin指向Xadmin

```python
# 导入 xadmin，替换admin
import xadmin
urlpatterns = [
    path('xadmin/', xadmin.site.urls),, # django2中也可以是 url(r'^xadmin/', xadmin.site.urls)
]
```

点击Tools 菜单下 Run manage.py Task

```
makemigrations 
migrate
```

访问http://127.0.0.1/admin/

![](/images/python/django-web/8-3.png)

新建user/adminx.py，进行app model注册：

```python
# 创建xadmin的全局管理器并与view绑定。
class BaseSetting(object):
    # 开启主题功能
    enable_themes = True
    use_bootswatch = True


# xadmin 全局配置参数信息设置
class GlobalSettings(object):
    site_title = "supe-wa慕课小站"
    site_footer = "supe-wa慕课小站|后台管理系统"
    # 收起菜单
    menu_style = "accordion"
    # 自定义导航楼目录
    def get_site_menu(self):
        return (
            {'title': '课程信息管理', 'menus': (
                {'title': '课程信息管理', 'url': self.get_model_url(TbCourse, 'changelist')},
                {'title': '章节信息管理', 'url': self.get_model_url(TbCourseLesson, 'changelist')},
                {'title': '视频信息管理', 'url': self.get_model_url(TbCourseVideo, 'changelist')},
                {'title': '课程资源管理', 'url': self.get_model_url(TbCourseResource, 'changelist')},
                {'title': '课程评论管理', 'url': self.get_model_url(TbCourseComment, 'changelist')},
            )},
            {'title': '机构信息管理', 'menus': (
                {'title': '城市信息管理', 'url': self.get_model_url(TcCityDict, 'changelist')},
                {'title': '机构信息管理', 'url': self.get_model_url(TbOrg, 'changelist')},
                {'title': '机构讲师管理', 'url': self.get_model_url(TbOrgTeacher, 'changelist')},
            )},
            {'title': '用户信息管理', 'menus': (
                {'title': '用户信息管理', 'url': self.get_model_url(TbUser, 'changelist')},
                {'title': '用户验证管理', 'url': self.get_model_url(TbEmailVerifyRecord, 'changelist')},
                {'title': '用户课程管理', 'url': self.get_model_url(TbUserCourse, 'changelist')},
                {'title': '用户收藏管理', 'url': self.get_model_url(TbUserFavorite, 'changelist')},
                {'title': '用户消息管理', 'url': self.get_model_url(TbUserMessage, 'changelist')},
            )},

            {'title': '系统信息管理', 'menus': (
                {'title': '用户咨询', 'url': self.get_model_url(TbUserAsk, 'changelist')},
                {'title': '首页轮播', 'url': self.get_model_url(TcBanner, 'changelist')},
                {'title': '用户分组', 'url': self.get_model_url(Group, 'changelist')},
                {'title': '用户权限', 'url': self.get_model_url(Permission, 'changelist')},
                {'title': '日志记录', 'url': self.get_model_url(Log, 'changelist')},
            )},)
            
# 将全局配置管理与view绑定注册
xadmin.site.register(views.CommAdminView, GlobalSettings)
xadmin.site.register(views.BaseAdminView, BaseSetting)
```

登录后

![](/images/python/django-web/8-4.png)

