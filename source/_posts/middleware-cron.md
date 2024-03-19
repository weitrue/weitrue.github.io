---
title: 【Go】定时任务
categories: Middleware
tags: [cron,linux,middleware]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/middleware/cron/index.png
banner_img: /images/img/banner.png
author: Pony W
---

> <!-- more -->

crons.go

```go
package crons

import (
	"fmt"

	"github.com/pkg/errors"
	"github.com/robfig/cron/v3"
)

const (
	Second = "Second"
	Minute = "Minute"
)

type Job interface {
	cron.Job
	Frequency() string
}

type CronManage struct {
	cron *cron.Cron
}

func NewCronManage(mode string) (*CronManage, error) {
	var c *cron.Cron
	switch mode {
	case Second:
		c = cron.New(cron.WithSeconds(), cron.WithLogger(NewLogger()))
	case Minute:
		c = cron.New(cron.WithLogger(NewLogger()))
	default:
		return nil, errors.New(fmt.Sprintf("err mode, unsupported mode %s", mode))
	}

	return &CronManage{
		cron: c,
	}, nil
}

func (m *CronManage) Register(job ...Job) (int, error) {
	msg := ""
	count := 0
	for i, j := range job {
		_, err := m.cron.AddJob(j.Frequency(), j)
		if err != nil {
			msg += fmt.Sprintf("%d:%v ", i, err)
		}
	}

	if len(msg) > 0 {
		return len(job) - count, errors.New(fmt.Sprintf("Register exsit err, err:%s", msg))
	}

	return len(job) - count, nil
}

func (m *CronManage) RegisterFunc(frequency string, cmd func()) (int, error) {
	count, err := m.cron.AddFunc(frequency, cmd)
	if err != nil {
		return 0, err
	}

	return int(count), nil
}

func (m *CronManage) Start() {
	m.cron.Start()
}

func (m *CronManage) Stop() {
	m.cron.Stop()
}

func (m *CronManage) Entries() []cron.Entry {
	return m.cron.Entries()
}
```

logger.go

```go
package crons

import (
	"context"

	"github.com/robfig/cron/v3"

	"logger/meta"
	"logger/xlog"
)

type Logger struct{}

// NewLogger 新建日志记录器
func NewLogger() cron.Logger {
	return &Logger{}
}

func (l Logger) Info(msg string, keysAndValues ...interface{}) {
	metas := make([]meta.Field, 0)
	for i := 0; i+1 < len(keysAndValues); {
		metas = append(metas, meta.NewField(keysAndValues[i].(string), keysAndValues[i+1]))
		i = i + 2
	}

	xlog.WithContext(context.Background()).Info(msg, metas...)
}

func (l Logger) Error(err error, msg string, keysAndValues ...interface{}) {
	metas := make([]meta.Field, 0)
	for i := 0; i+1 < len(keysAndValues); {
		metas = append(metas, meta.NewField(keysAndValues[i].(string), keysAndValues[i+1]))
		i = i + 2
	}

	xlog.WithContext(context.Background()).Error(msg, err, metas...)
}
```

```go
type TestCase struct{}

func (TestCase) Frequency() string {
	return "* * * * * *" // Every second
}

func (TestCase) Run() {
	log.Println("Test Crontab", time.Now().Unix())
}

func TestCron(t *testing.T) {
	CronManger, err := NewCronManage(Second)
	assert.Nil(t, err)
	t1 := TestCase{}
	_, err = CronManger.RegisterFunc(t1.Frequency(), t1.Run)
	assert.Nil(t, err)

	go CronManger.Start()
	log.Println("Cron started success")
	time.Sleep(10 * time.Second)
}

func init() {
	_, _ = xzap.SetUp(xzap.Config{
		ServiceName: "cron",
		Mode:        "file",
		Path:        "logs/cron",
		Level:       "info",
		Compress:    false,
		KeepDays:    7,
	})
}
```



[^1]: [cronexpr](https://github.com/gorhill/cronexpr)
