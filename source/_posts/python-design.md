---
title: 【Python】设计模式
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: [设计模式,Python] # 分类
tags: [设计模式,Python]       # 标签
index_img: /images/python/pydesign/index.png
---

> Patterns mean “I have run out of language.” - Rich Hickey
>
> **Design patterns** are typical solutions to common problemsin software design. Each pattern is like a blueprintthat you can customize to solve a particulardesign problem in your code.<!-- more --> 

### 创建型

#### Method(工厂方法)

执行单独的函数，通过传参提供需要的对象的信息。

```Python
"""
Module Description: 工厂方法
Problem:在工厂方法模式中，我们执行函数，传入一个参数，但不需要知道任何关于对象如何实现以及对象来自哪里的细节
Solution：
Date: 2020/1/8 
Author: Wang P
"""
import json
import xml.etree.ElementTree as etree


class Connector:
    def __init__(self, filepath):
        factory = None
        try:
            factory = self.connector_factory(filepath)
        except ValueError as e:
            print(e)
        self.factory = factory

    def connector_factory(self, filepath):
        if filepath.endswith('json'):
            connector = self.JSONConnector
        elif filepath.endswith('xml'):
            connector = self.XMLConnector
        else:
            raise ValueError('Cannot connect to {}'.format(filepath))
        return connector(filepath)

    class JSONConnector:
        """
        JSON工厂
        """
        def __init__(self, filepath):
            self.data = dict()
            with open(filepath, mode='r', encoding='utf-8') as f:
                self.data = json.load(f)

        @property
        def parsed_data(self):
            return self.data

    class XMLConnector:
        """
        XML工厂
        """
        def __init__(self, filepath):
            self.tree = etree.parse(filepath)

        @property
        def parsed_date(self):
            return self.tree


def main():
    xml_factory = Connector('data/person.xml')
    xml_data = xml_factory.factory.parsed_date
    smiths = xml_data.findall(".//{}[{}='{}']".format('person', 'lastName', 'Smith'))
    print('found: {} persons'.format(len(smiths)))
    for smith in smiths:
        print('first name:{}'.format(smith.find('firstName').text))
        print('last name:{}'.format(smith.find('lastName').text))
    print()
    json_factory = Connector('data/donut.json')
    json_data = json_factory.factory.parsed_data
    print('find: {} donuts. '.format(len(json_data)))
    for donut in json_data:
        print('name:{}'.format(donut['name']))
        print('ppu:{}'.format(donut['ppu']))


if __name__ == "__main__":
    main()

```

#### Abstract Factory(抽象工厂: 解决复杂对象创建问题)

工厂方法适合对象种类较少的情况，如果有多种不同类型对象需要创建，使用抽象工厂模式。

```Python
"""
Module Description: 抽象工厂（实际上一个抽象工厂其实是一组工厂方法，每个工厂方法负责生产不同类型的对象）
Problem:
Solution：
Date: 2020/1/8 
Author: Wang P
"""


class Frog(object):
    """
    游戏角色对象-青蛙
    """
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

    def interact_with(self, obstacle):
        print('{} the Frog encounters {} and {}!'.format(self, obstacle, obstacle.action()))


class Bug(object):
    """
    障碍物对象-虫子
    """
    def __str__(self):
        return 'a bug'

    def action(self):
        return 'eats it'


class FrogWorld(object):
    """
    抽象工厂，负责创建游戏角色与障碍物对象
    make_character()和make_obstacle()动态改变当前激活的工厂
    在静态语言中，抽象工厂是抽象类/接口，具有一些空方法，Python中无须如此
    """
    def __init__(self, name):
        print(self)
        self.player_name = name

    def __str__(self):
        return '\n\n\t------- Frog Word -------'

    def make_character(self):
        return Frog(self.player_name)

    def make_obstacle(self):
        return Bug()


class Wizard(object):
    """
    游戏角色对象-男巫
    """
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return self.name

    def interact_with(self, obstacle):
        print('{} the Wizard battles against {} and {}!'.format(self, obstacle, obstacle.action()))


class Ork(object):
    """
    障碍物对象-怪兽
    """
    def __str__(self):
        return 'an evil ork'

    def action(self):
        return 'kills it'


class WizardWorld(object):
    """
    抽象工厂，负责创建游戏角色与障碍物对象
    make_character()和make_obstacle()动态改变当前激活的工厂
    在静态语言中，抽象工厂是抽象类/接口，具有一些空方法，Python中无须如此
    """
    def __init__(self, name):
        print(self)
        self.player_name = name

    def __str__(self):
        return '\n\n\t------- Wizard Word -------'

    def make_character(self):
        return Wizard(self.player_name)

    def make_obstacle(self):
        return Ork()


class GameEnvironment(object):
    """
    游戏的主入口，接收factory为输入
    """
    def __init__(self, factory):
        self.hero = factory.make_character()
        self.obstacle = factory.make_obstacle()

    def play(self):
        self.hero.interact_with(self.obstacle)


def validate_age(name):
    try:
        age = input("Welcome {}. How old are you? ".format(name))
        age = int(age)
    except ValueError as e:
        print("Age {} is invalid, please try again...".format(age))
        return False, age
    return True, age


def main():
    name = input("Hello. What's your name?")
    valid_input = False
    age = 0
    while not valid_input:
        valid_input, age = validate_age(name)
    game = FrogWorld if age < 18 else WizardWorld
    environment = GameEnvironment(game(name))
    environment.play()


if __name__ == '__main__':
    main()

```

#### The Builder Pattern(构造模式: 控制复杂对象的构造)

当对象需要多个部分组合起来一步步创建，并且创建和表示分离的时候。可以这么理解，你要买电脑，工厂模式直接返回一个你需要型号的电脑，但是构造模式允许你自定义电脑各种配置类型，组装完成后给你。这个过程可以传入builder从而自定义创建的方式。

```Python
"""
Module Description:建造者设计模式demo
Problem:当需要创建一个由多个部分构成的对象，而且它的构造需要一步接一步的完成；只有当各个部分都创建好，这个对象才算完整
Solution：
Extension:工厂模式与创建者的区别为（1）工厂模式一但个步骤创建对象；创建者以多个步骤创建对象，并且几乎始终会使用一个指挥者。
                              （2）工厂模式下会立即返回一个创建好的对象，建造者仅在客户端代码才显式请求指挥者返回的最终对象
                               例如：假设你想买个电脑，如果决定买一台特定配置的电脑，则使用工厂模式；如果你要购买一台定制的PC，
                               你式指挥者，会向制造商提供指令说明心中理想的电脑规格。
Date: 2020/1/8
Author: Wang P
"""

MINI14 = '1.4GHz Mac Mini'


class AppleFactory:
    class MacMini14:
        def __init__(self):
            self.memory = 4
            self.hdd = 500
            self.gpu = 'Intel HD Graphics 5000'

        def __str__(self):
            info = ('Model: {}'.format(MINI14),
                    'Memory: {}'.format(self.memory),
                    'Hard Disk: {}'.format(self.hdd),
                    'Graphics Card: {}'.format(self.gpu))
            return '\n'.join(info)

    def build_computer(self, model):
        if model == MINI14:
            return self.MacMini14()
        else:
            return "I dont't know how to build {}".format(model)


def apple_computer_use_factory():
    afac = AppleFactory()
    mac_mini = afac.build_computer(MINI14)
    print(mac_mini)


class Computer:
    def __init__(self, serial_number):
        self.serial_number = serial_number
        self.memory = None
        self.hdd = None
        self.gpu = None

    def __str__(self):
        info = ('Serial: {}'.format(self.serial_number),
                'Memory: {}GB'.format(self.memory),
                'Hard Disk: {}GB'.format(self.hdd),
                'Graphics Card: {}'.format(self.gpu))
        return '\n'.join(info)


class ComputerBuilder:
    def __init__(self):
        self.computer = Computer('AI563924')

    def conf_memory(self, amount):
        self.computer.memory = amount

    def conf_hdd(self, amount):
        self.computer.hdd = amount

    def conf_gpu(self, model):
        self.computer.gpu = model


class HardwareEngineer:
    def __init__(self):
        self.builder = None

    def construct_computer(self, memory, hdd, gpu):
        self.builder = ComputerBuilder()
        self.builder.conf_memory(memory)
        self.builder.conf_hdd(hdd)
        self.builder.conf_gpu(gpu)

    @property
    def computer(self):
        return self.builder.computer


def apple_computer_use_builder():
    engineer = HardwareEngineer()
    engineer.construct_computer(memory=8, hdd=500, gpu='GeForce GTX 650 Ti')
    computer = engineer.computer
    print(computer)


if __name__ == '__main__':
    apple_computer_use_builder()
    print('*'*50)
    apple_computer_use_factory()
```



#### 单例模式: 使得一个类最多生成一个实例

(基于元类)单例模式

```Python
# -*- coding:utf-8 -*-
"""
Module Description:(基于元类)单例模式
Problem:
Solution:
Date: 2020/1/6 
Author: Wang P
"""


class Singleton(type):

    def __init__(cls, *args, **kwargs):
        print("__init__ {}".format(cls.__name__))
        cls.__instance = None
        super().__init__(*args, **kwargs)

    def __call__(cls, *args, **kwargs):
        if cls.__instance is None:
            print("__call__ {}".format(cls.__name__))
            cls.__instance = super(Singleton, cls).__call__(*args, **kwargs)
        return cls.__instance


class Instance(metaclass=Singleton):
    def __init__(self, name):
        self.name = name


if __name__ == "__main__":
    i1 = Instance('zhang san')
    i2 = Instance('li si')
    print(i1 is i2)
```

通过new函数实现简单的单例模式

```Python
"""
Module Description: 通过new函数实现简单的单例模式
Problem:
Solution：
Date: 2020/1/20 
Author: Wang P
"""


class Singleton:
    def __new__(cls, name, *args, **kwargs):
        if not hasattr(cls, '_instance'):
            cls._instance = super().__new__(cls, *args, **kwargs)
        print("__call__ {}".format(cls.__class__))
        return cls._instance

    def __init__(self, name):
        print("__init__ {}".format(self.__str__()))
        super().__init__()
        self.name = name


if __name__ == '__main__':
    ins1 = Singleton('zhang san')
    ins2 = Singleton('li si')
    print(id(ins1), id(ins2))
    print(ins1.name)
    print(ins2.name)

```

装饰器实现

```Python
"""
Module Description: 通过装饰器方式实现单例模式
Problem:
Solution：
Date: 2020/2/20 
Author: Wang P
"""


# 装饰器实现
def singleton(class_):
    instances = {}

    def getinstance(*args, **kwargs):
        if class_ not in instances:
            instances[class_] = class_(*args, **kwargs)
        return instances[class_]

    return getinstance


@singleton
class MyClass:
    pass


if __name__ == "__main__":
    i1 = MyClass()
    i2 = MyClass()
    print(i1 is i2)
```



#### The Prototype Pattern(原型模式:解决对象拷贝问题)



### 行为型

#### The Observer Pattern(观察者模式：用来处理多个对象之间的发布订阅问题)

```Python
# -*- coding:utf-8 -*-
"""
Module Description: 
Date: 2019/12/13 
Author: Wang P
"""


class WaterHeater(object):
    """
    热水器：战胜寒冬的有利武器
    """
    def __init__(self):
        self.__observers = []
        self.__temperature = 25

    def getTemperature(self):
        return self.__temperature

    def setTemperature(self, temperature):
        self.__temperature = temperature
        print("current temperature is:", self.__temperature)
        self.notifies()

    def addObserver(self, observer):
        self.__observers.append(observer)

    def notifies(self):
        for o in self.__observers:
            o.update(self)


class Observer(object):
    """
    洗澡模式和饮用模式的父类
    """
    def update(self, waterHeater):
        pass


class WashingMode(Observer):
    """该模式用于洗澡用"""

    def update(self, waterHeater):
        if 50 <= waterHeater.getTemperature() < 70:
            print("水已烧好，温度正好！可以用来洗澡了。")


class DrinkingMode(Observer):
    """该模式用于饮用"""

    def update(self, waterHeater):
        if waterHeater.getTemperature() >= 100:
            print("水已烧开！可以用来饮用了。")


def test_water_heater():
    heater = WaterHeater()
    washing_obser = WashingMode()
    drinking_obser = DrinkingMode()
    heater.addObserver(washing_obser)
    heater.addObserver(drinking_obser)
    heater.setTemperature(40)
    heater.setTemperature(60)
    heater.setTemperature(100)


if __name__ == "__main__":
    test_water_heater()
```



#### The State Pattern(状态模式：实现有限状态机)



#### The Strategy Pattern(策略模式：动态选择算法策略)



#### The Chain of Responsibility Pattern (责任链模式:创建链式对象用来接收广播消息)



#### The Command Pattern(命令模式：用来给应用添加Undo操作)



#### The Interpreter Pattern(解释器模式：用来实现Domain Specific Language(DSL))



#### The Template Pattern(模板模式：抽象出算法公共部分从而实现代码复用)



### 结构性

#### The Adapter Pattern(适配器模式: 解决接口不兼容问题)



#### The Decorator Pattern(装饰器模式： 无需子类化实现扩展对象功能问题)



#### The Facade Pattern(外观模式: 简化复杂对象的访问问题)



#### The Flyweight Pattern(享元模式: 实现对象复用从而改善资源使用)



#### The Model-View-Controller Pattern(mvc模式：解耦展示逻辑和业务逻辑)



#### The Proxy Pattern(代理模式：通过一层间接保护层实现更安全的接口访问）





