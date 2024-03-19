---
title: 【Go】缓存与分布式锁
comments: false      # 是否可评论
toc: true            # 是否显示文章目录
categories: Golang   # 分类
tags: [Go,Cache,Lock]# 标签 
math: true           # 启动公式加载渲染
mermaid: true        # 启动流程图渲染
index_img: /images/golang/gopher-learn.png
---

> <!-- more -->

### 缓存

#### 本地缓存

```go
package cache

import (
	"context"
	"errors"
	"time"
)

var (
	errKeyNotFound      = errors.New("cache: key 不存在")
	errOverCapacity     = errors.New("cache: 超过缓存最大容量")
	errFailedToSetCache = errors.New("cache: 设置键值对失败")
	errCacheClosed      = errors.New("cache: 已经被关闭")
	errKeyExpired       = errors.New("cache: 缓存失效")
)

type Cache interface {
	Get(ctx context.Context, key string) (any, error)
	Set(ctx context.Context, key string, val any, expiration time.Duration) error
	Delete(ctx context.Context, key string) error
	LoadAndDelete(ctx context.Context, key string) (any, error)
  Close(ctx context.Context) error
}

type item struct {
	val      any
	deadline time.Time
}

func (i *item) deadlineBefore(t time.Time) bool {
	return !i.deadline.IsZero() && i.deadline.Before(t)
}
```

```go
package cache

import (
	"context"
	"sync"
	"time"
)

type LocalCache struct {
	lock          sync.RWMutex
	data          map[string]*item
	close         chan struct{}
	closed        bool
	onEvicted     OnEvict
	cycleInterval time.Duration
}

type ParamCacheOption func(*LocalCache)
type OnEvict func(key string, val any)

func WithCycleInterval(interval time.Duration) ParamCacheOption {
	return func(cache *LocalCache) {
		cache.cycleInterval = interval
	}
}

func WithOnEvict(onEvict OnEvict) ParamCacheOption {
	return func(cache *LocalCache) {
		cache.onEvicted = onEvict
	}
}

func NewLocalCache(opts ...ParamCacheOption) Cache {
	lc := &LocalCache{
		lock:          sync.RWMutex{},
		data:          make(map[string]*item),
		close:         make(chan struct{}), // 初始化,否则调用 close 会阻塞掉
		cycleInterval: 10 * time.Second,
	}

	for _, opt := range opts {
		opt(lc)
	}

	lc.checkCycle()

	return lc
}

func (c *LocalCache) checkCycle() {
	go func() {
		ticker := time.NewTicker(c.cycleInterval)
		for {
			select {
			case now := <-ticker.C:
				for key, val := range c.data {
					func() {
						c.lock.Lock()
						defer c.lock.Unlock()
						if !val.deadline.IsZero() && val.deadline.Before(now) {
							c.delete(key)
						}
					}()
				}
			case <-c.close:
				close(c.close)
				return
			}
		}
	}()
}

func (c *LocalCache) delete(key string) {
	val, ok := c.data[key]
	if ok {
		delete(c.data, key)
		if c.onEvicted != nil {
			c.onEvicted(key, val.val)
		}

	}
}

func (c *LocalCache) Get(ctx context.Context, key string) (any, error) {
	c.lock.RLock()
	if c.closed {
		return nil, errCacheClosed
	}

	val, ok := c.data[key]
	c.lock.RUnlock()
	if !ok {
		return nil, errKeyNotFound
	}

	now := time.Now()
	// 别的 goroutine 设置值了
	if val.deadlineBefore(now) {
		c.lock.Lock()
		defer c.lock.Unlock()

		if c.closed {
			return nil, errCacheClosed
		}

		val, ok = c.data[key]
		if !ok {
			return nil, errKeyNotFound
		}

		if val.deadlineBefore(now) {
			c.delete(key)
			return nil, errKeyExpired
		}

	}

	return val.val, nil
}

func (c *LocalCache) Set(ctx context.Context, key string, val any, expiration time.Duration) error {
	c.lock.Lock()
	defer c.lock.Unlock()

	if c.closed {
		return errCacheClosed
	}

	var deadline time.Time
	if expiration > 0 {
		deadline = time.Now().Add(expiration)
	}

	c.data[key] = &item{
		val:      val,
		deadline: deadline,
	}

	return nil
}

func (c *LocalCache) Delete(ctx context.Context, key string) error {
	c.lock.Lock()
	defer c.lock.Unlock()
	if c.closed {
		return errCacheClosed
	}

	c.delete(key)

	return nil
}

func (c *LocalCache) Close(ctx context.Context) error {
	c.lock.Lock()
	defer c.lock.Unlock()
  
  if c.closed {
		return errCacheClosed
	}

	c.closed = true
	c.close <- struct{}{}
	if c.onEvicted != nil {
		for key, val := range c.data {
			c.onEvicted(key, val.val)
		}
	}

	c.data = nil

	return nil
}

func (c *LocalCache) LoadAndDelete(ctx context.Context, key string) (any, error) {
	c.lock.Lock()
	defer c.lock.Unlock()

	if c.closed {
		return nil, errCacheClosed
	}

	val, ok := c.data[key]
	if !ok {
		return nil, errKeyNotFound
	}

	c.delete(key)

	return val.val, nil
}
```

```go
package cache

import (
	"context"
	"reflect"
	"testing"
	"time"
)

func TestLocalCache_Get(t *testing.T) {
	type args struct {
		ctx        context.Context
		key        string
		val        string
		sleepTime  time.Duration
		expiration time.Duration
		closed     bool
	}
	tests := []struct {
		name    string
		args    args
		want    any
		wantErr ErrCache
	}{
		{
			name: "Get Cache not expired",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				sleepTime:  time.Millisecond * 10,
				expiration: time.Second * 10,
			},
			want:    "val1",
			wantErr: nil,
		},
		{
			name: "Get Cache expired",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				sleepTime:  time.Second * 2,
				expiration: time.Second * 1,
			},
			want:    nil,
			wantErr: errKeyNotFound,
		},
		{
			name: "Get Cache expired",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				sleepTime:  time.Second * 2,
				expiration: time.Second * 1,
				closed:     true,
			},
			want:    nil,
			wantErr: errCacheClosed,
		},
	}

	c := NewCache(WithCycleInterval(time.Second))
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c.Set(tt.args.ctx, tt.args.key, tt.args.val, tt.args.expiration)
			time.Sleep(tt.args.sleepTime)
			if tt.args.closed {
				c.Close(tt.args.ctx)
			}
			got, err := c.Get(tt.args.ctx, tt.args.key)
			if err != tt.wantErr {
				t.Errorf("Get() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Get() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestLocalCache_Set(t *testing.T) {
	type args struct {
		ctx        context.Context
		key        string
		val        string
		expiration time.Duration
		closed     bool
	}
	tests := []struct {
		name    string
		args    args
		want    any
		wantErr ErrCache
	}{
		{
			name: "Set Cache",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				expiration: time.Second * 10,
			},
			want:    "val1",
			wantErr: nil,
		},
		{
			name: "Set Cache closed",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				closed:     true,
				expiration: time.Second * 10,
			},
			want:    "val1",
			wantErr: errCacheClosed,
		},
	}
	c := NewCache(WithCycleInterval(time.Second))
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.args.closed {
				c.Close(tt.args.ctx)
			}
			err := c.Set(tt.args.ctx, tt.args.key, tt.args.val, tt.args.expiration)
			if err != tt.wantErr {
				t.Errorf("Get() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
		})
	}
}

func TestLocalCache_Delete(t *testing.T) {
	type args struct {
		ctx        context.Context
		key        string
		val        string
		expiration time.Duration
		closed     bool
		unset      bool
	}
	tests := []struct {
		name    string
		args    args
		want    any
		wantErr ErrCache
	}{
		{
			name: "Delete Cache",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				expiration: time.Second * 10,
			},
			wantErr: nil,
		},
		{
			name: "Delete Cache not exist",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				unset:      true,
				expiration: time.Second * 10,
			},
			wantErr: nil,
		},
		{
			name: "Delete Cache closed",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				closed:     true,
				expiration: time.Second * 10,
			},
			wantErr: errCacheClosed,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := NewCache(WithCycleInterval(time.Second))
			if !tt.args.unset {
				c.Set(tt.args.ctx, tt.args.key, tt.args.val, 0)
			}
			if tt.args.closed {
				c.Close(tt.args.ctx)
			}

			err := c.Delete(tt.args.ctx, tt.args.key)
			if err != tt.wantErr {
				t.Errorf("Delete() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
		})
	}
}

func TestLocalCache_LoadAndDelete(t *testing.T) {
	type args struct {
		ctx        context.Context
		key        string
		val        string
		expiration time.Duration
		closed     bool
		unset      bool
	}
	tests := []struct {
		name    string
		args    args
		want    any
		wantErr ErrCache
	}{
		{
			name: "LoadAndDelete Cache",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				expiration: time.Second * 10,
			},
			want:    "val1",
			wantErr: nil,
		},
		{
			name: "LoadAndDelete Cache not exist",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				unset:      true,
				expiration: time.Second * 10,
			},
			want:    nil,
			wantErr: errKeyNotFound,
		},
		{
			name: "Delete Cache closed",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				closed:     true,
				expiration: time.Second * 10,
			},
			want:    nil,
			wantErr: errCacheClosed,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := NewCache(WithCycleInterval(time.Second))
			if !tt.args.unset {
				c.Set(tt.args.ctx, tt.args.key, tt.args.val, 0)
			}
			if tt.args.closed {
				c.Close(tt.args.ctx)
			}

			got, err := c.LoadAndDelete(tt.args.ctx, tt.args.key)
			if err != tt.wantErr {
				t.Errorf("Delete() error = %v, wantErr %v", err, tt.wantErr)
				return
			}

			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("Get() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestLocalCache_Close(t *testing.T) {
	tests := []struct {
		name    string
		key     string
		wantVal string
	}{
		{
			name: "Test close",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c := NewCache()
			err := c.Close(context.Background())
			if err != nil {
				t.Errorf("Close() error = %v", err)
			}
		})
	}
}
```

#### 控制缓存内存

##### 限制缓存key数量

```go
package cache

import (
	"context"
	"sync/atomic"
	"time"
)

type MaxCntCache struct {
	*LocalCache
  mutex  sync.Mutex
	cnt    int32
	maxCnt int32
}

func NewMaxCntCache(c *LocalCache, maxCnt int32) Cache {
	mc := &MaxCntCache{
		LocalCache: c,
		maxCnt:     maxCnt,
	}

	origin := c.onEvicted
	c.onEvicted = func(key string, val any) {
		atomic.AddInt32(&mc.cnt, -1)
		if origin != nil {
			origin(key, val)
		}
	}

	return mc
}

func (c *MaxCntCache) Set(ctx context.Context, key string, val any, expiration time.Duration) error {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	_, err := c.LocalCache.Get(ctx, key)
	if err != nil && err != errKeyNotFound {
		return err
	}

	if err == errKeyNotFound {
		cnt := atomic.AddInt32(&c.cnt, 1)
		if cnt > c.maxCnt {
			atomic.AddInt32(&c.cnt, -1)
			return errOverCapacity
		}
	}
}
```

```go
package cache

import (
	"context"
	"testing"
	"time"
)

func TestMaxCntCache_Set(t *testing.T) {
	type args struct {
		ctx        context.Context
		key        string
		val        string
		expiration time.Duration
		closed     bool
		maxCnt     int32
	}
	tests := []struct {
		name    string
		args    args
		wantErr ErrCache
	}{
		{
			name: "Set Cache",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				expiration: time.Second * 10,
				maxCnt:     100,
			},
			wantErr: nil,
		},
		{
			name: "Set Cache closed",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				closed:     true,
				expiration: time.Second * 10,
				maxCnt:     100,
			},
			wantErr: errCacheClosed,
		},
		{
			name: "Set Cache over capacity",
			args: args{
				ctx:        context.Background(),
				key:        "key1",
				val:        "val1",
				closed:     true,
				expiration: time.Second * 10,
				maxCnt:     0,
			},
			wantErr: errOverCapacity,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cc := NewLocalCache(WithCycleInterval(time.Second))
			c := NewMaxCntCache(cc, tt.args.maxCnt)
			if tt.args.closed {
				c.Close(tt.args.ctx)
			}
			err := c.Set(tt.args.ctx, tt.args.key, tt.args.val, tt.args.expiration)
			if err != tt.wantErr {
				t.Errorf("Get() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
		})
	}
}
```

##### 限制内存

##### 缓存淘汰

#### 缓存模式

##### cache-aside

- 把cache当作普通数据源

- 更新cache和DB都依赖开发者自己写代码
  - 业务代码决策是否从DB取数据
  - **同步**或者**异步**读取并写入数据
  - 采用singleflight

![](/images/golang/cache/cache-aside.png)

<center>同步读取数据到缓存</center>

![](/images/golang/cache/cache-aside-1.png)

<center>异步存数据到缓存</center>

![](/images/golang/cache/cache-aside-2.png)

<center>异步读取数据到缓存</center>

如果并发情况下，可能会引起数据不一致问题

![](/images/golang/cache/cache-aside-q.png)

##### read-through

- 业务代码从缓存中读取数据，cache不命中是读取数据
  - cache决策是否从DB读取数据
  - **同步**或者**异步**读取并写入数据
  - 采用singleflight
- 写数据时，业务代码需要自己写DB和cache

![](/images/golang/cache/read-through.png)

<center>同步读取数据到缓存</center>

![](/images/golang/cache/read-through-1.png)

<center>异步存数据到缓存</center>

![](/images/golang/cache/read-through-2.png)

<center>异步读取数据到缓存（一般不会用）</center>

##### write-through

- 业务代码数据只写cache，cache自己更新DB
  - cache决定**同步**或者**异步**写到DB或者cache
  - cache决定先写DB还是cache,一般先写DB
- 业务代码读取未命中，需要手动从DB获取并写入缓存

![](/images/golang/cache/write-through.png)

<center>同步写数据</center>

![](/images/golang/cache/write-through-1.png)

<center>异步写数据到缓存</center>

![](/images/golang/cache/write-through-2.png)

<center>异步写数据</center>

##### write-back

- 写操作时直接写缓存，读操作时也是直接读缓存
- 缓存过期时，将缓存数据写入DB（onEvicted回调，刷新数据到DB）
- 数据可能会丢失（缓存过期刷数据到DB之前,缓存宕机）

![](/images/golang/cache/write-back.png)

##### refresh-ahead

- 依赖cdc
- cache或者cannel这一类的工具监听数据变更后，更新数据到缓存
- 读数据cache未命中时，还是需要刷新缓存，也存在并发问题

![](/images/golang/cache/refresh-ahead.png)

#### Redis缓存

```go
package cache

import (
	"context"
	"strings"
	"time"

	_ "github.com/golang/mock/mockgen/model"
	"github.com/pkg/errors"
	"github.com/redis/go-redis/v9"
)

type RedisCache struct {
	client redis.Cmdable
}

func NewRedisClient(addr string) (client redis.Cmdable) {
	return redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "",
		DB:       0,
	})
}

func NewRedisCache(client redis.Cmdable) *RedisCache {
	return &RedisCache{
		client: client,
	}
}

func (c *RedisCache) Get(ctx context.Context, key string) (any, error) {

	return c.client.Get(ctx, key).Result()
}

func (c *RedisCache) Set(ctx context.Context, key string, val any, expiration time.Duration) error {
	msg, err := c.client.Set(ctx, key, val, expiration).Result()
	if err != nil {
		return err
	}

	if strings.ToLower(msg) != "ok" {
		return errors.Wrapf(err, "返回信息 %s", msg)
	}

	return nil
}

func (c *RedisCache) Delete(ctx context.Context, key string) error {
	_, err := c.client.Del(ctx, key).Result()
	return err
}

func (c *RedisCache) LoadAndDelete(ctx context.Context, key string) (any, error) {
	return c.client.GetDel(ctx, key).Result()
}

func (c *RedisCache) Close(ctx context.Context) error {
	return nil
}
```

生成redis_mock.go文件

```shell
go install github.com/golang/mock/mockgen@v1.6.0
mockgen -package=mocks -destination=mocks/redis_cmdable.mock.go github.com/redis/go-redis/v9 Cmdable
```

```go
package cache

import (
	"context"
	"reflect"
	"testing"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/redis/go-redis/v9"
	"github.com/stretchr/testify/assert"

	"offer/pkg/cache/mocks"
)

func TestRedisCache_Set(t *testing.T) {
	controller := gomock.NewController(t)
	defer controller.Finish()
	testCases := []struct {
		name       string
		mock       func() redis.Cmdable
		key        string
		val        string
		expiration time.Duration
		wantErr    error
	}{
		{
			name: "OK",
			mock: func() redis.Cmdable {
				cmdable := mocks.NewMockCmdable(controller)
				cmd := redis.NewStatusCmd(context.Background())
				cmd.SetVal("OK")
				cmdable.EXPECT().Set(gomock.Any(), "key1", "val1", 30*time.Second).Return(cmd)
				return cmdable
			},
			key:        "key1",
			val:        "val1",
			expiration: 30 * time.Second,
			wantErr:    nil,
		},
	}

	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			rc := NewRedisCache(c.mock())
			err := rc.Set(context.Background(), c.key, c.val, c.expiration)
			assert.Equal(t, c.wantErr, err)
		})
	}
}

func TestRedisCache_Get(t *testing.T) {
	controller := gomock.NewController(t)
	defer controller.Finish()
	testCases := []struct {
		name    string
		mock    func() redis.Cmdable
		key     string
		want    any
		wantErr error
	}{
		{
			name: "OK",
			mock: func() redis.Cmdable {
				cmdable := mocks.NewMockCmdable(controller)
				cmd := redis.NewStringCmd(context.Background())
				cmd.SetVal("val1")
				cmdable.EXPECT().Get(gomock.Any(), "key1").Return(cmd)
				return cmdable
			},
			key:     "key1",
			want:    "val1",
			wantErr: nil,
		},
	}
	for _, c := range testCases {
		t.Run(c.name, func(t *testing.T) {
			ctx := context.Background()
			rc := NewRedisCache(c.mock())
			got, err := rc.Get(ctx, c.key)
			if c.wantErr != err {
				t.Errorf("Get() error = %v, wantErr %v", err, c.wantErr)
				return
			}
			if !reflect.DeepEqual(got, c.want) {
				t.Errorf("Get() got = %v, want %v", got, c.want)
			}
		})
	}
}
```

#### 缓存异常

##### 穿透

cache没有，DB也没有

##### 击穿

并发请求同一个缓存数据，cache没有，DB压力大

##### 雪崩

cache出现了错误，不能正常工作了，所有的请求都会达到DB

### 分布式锁

#### Redis分布式锁
