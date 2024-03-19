---
title: 【Go】日志
categories: Middleware
tags: [middleware,log,zap,Go,pkg]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/middleware/log/index.png
banner_img: /images/img/banner.png
---

> <!-- more -->

logger

```go
package logger

import (
	"go.uber.org/zap/zapcore"

	"logger/meta"
)

type Logger interface {
	// Debugf debug log
	Debugf(msg, format string, data ...any)
	// Infof info log
	Infof(msg, format string, data ...any)
	// Warnf warn log
	Warnf(msg, format string, err error, data ...any)
	// Errorf error log
	Errorf(msg, format string, err error, data ...any)
	// Panicf panic log
	Panicf(msg, format string, err error, data ...any)

	// Debug debug log
	Debug(msg string, data ...meta.Field)
	// Info info log
	Info(msg string, data ...meta.Field)
	// Warn warn log
	Warn(msg string, err error, data ...meta.Field)
	// Error error log
	Error(msg string, err error, data ...meta.Field)
	// Panic panic log
	Panic(msg string, err error, data ...meta.Field)
	// Print print log by level
	Print(msg string, level zapcore.Level, err error, data ...meta.Field)
}
```

logger/meta

```go
package meta

// Field key-value
type Field interface {
	Key() string
	Value() interface{}
	meta()
}

type field struct {
	key   string
	value interface{}
}

func (m *field) Key() string {
	return m.key
}

func (m *field) Value() interface{} {
	return m.value
}

func (m *field) meta() {}

// NewField create meat
func NewField(key string, value any) Field {
	return &field{key: key, value: value}
}
```

logger/xzap

```go
package xzap

// Config 配置信息
type Config struct {
	ServiceName string
	Mode        string
	Path        string
	Level       string
	Compress    bool
	KeepDays    int
}
```

```go
package xzap

import (
	"go.uber.org/zap/zapcore"
)

const (
	levelInfo   = "info"
	levelError  = "error"
	levelSevere = "severe"
)

// Option 可选参数
type Option func(*Opt)

type Opt struct {
	level  zapcore.Level
	fields map[string]string
}

// WithField 添加field(s)到日志中
func WithField(key, value string) Option {
	return func(opt *Opt) {
		opt.fields[key] = value
	}
}

func withLogLevel(level string) Option {
	return func(opt *Opt) {
		switch level {
		case levelInfo:
			opt.level = zapcore.InfoLevel
		case levelSevere:
			opt.level = zapcore.WarnLevel
		case levelError:
			opt.level = zapcore.ErrorLevel
		default:
			opt.level = zapcore.DebugLevel
		}
	}
}
```

```go
import (
	"errors"
	"fmt"
	"os"
	"path"
	"sync"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"

	"logger/meta"
)

const (
	debugFilename  = "debug.log"
	accessFilename = "access.log"
	errorFilename  = "error.log"
	severeFilename = "severe.log"

	consoleMode = "console"
	volumeMode  = "volume"

	maxSize   = 30
	maxBackup = 5

	DefaultTimeLayout = "2006-01-02T15:04:05.000Z07"
	DefaultKeepDays   = 7
)

var (
	// ErrLogPathNotSet is an error that indicates the log path is not set.
	ErrLogPathNotSet = errors.New("log path must be set")
	// ErrLogServiceNameNotSet is an error that indicates that the service name is not set.
	ErrLogServiceNameNotSet = errors.New("log service name must be set")

	Logger *ZapLogger

	once sync.Once
)

// ZapLogger zap日志
type ZapLogger struct {
	logger *zap.Logger
	Opt    *Opt
}

// SetUp 初始化zap Logger
func SetUp(c Config, opts ...Option) (*ZapLogger, error) {
	if c.KeepDays == 0 {
		c.KeepDays = DefaultKeepDays
	}

	opt := &Opt{
		fields: make(map[string]string),
	}

	for _, f := range opts {
		if f != nil {
			f(opt)
		}
	}

	if len(c.Path) == 0 {
		return nil, ErrLogPathNotSet
	}

	if len(c.ServiceName) == 0 {
		return nil, ErrLogServiceNameNotSet
	}

	switch c.Mode {
	case consoleMode:
		withLogLevel(c.Level)
		setupWithConsole(opt)
	case volumeMode:
		setupWithFiles(c, opt)
	default:
		setupWithFiles(c, opt)
	}

	return Logger, nil
}

func (zl *ZapLogger) GetLogger() *zap.Logger {
	return zl.logger
}

func (zl *ZapLogger) With(data ...meta.Field) *ZapLogger {
	zl.logger = zl.logger.With(wrapZapMeta(nil, data...)...)
	return zl
}

// Print debug log
func (zl *ZapLogger) Print(msg string, level zapcore.Level, err error, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Check(level, msg).Write(wrapZapMeta(err, data...)...)
}

// Debug debug log
func (zl *ZapLogger) Debug(msg string, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Debug(msg, wrapZapMeta(nil, data...)...)
}

// Info log
func (zl *ZapLogger) Info(msg string, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Info(msg, wrapZapMeta(nil, data...)...)
}

// Warn log
func (zl *ZapLogger) Warn(msg string, err error, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Warn(msg, wrapZapMeta(err, data...)...)
}

// Error error log
func (zl *ZapLogger) Error(msg string, err error, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Error(msg, wrapZapMeta(err, data...)...)
}

// Panic panic log
func (zl *ZapLogger) Panic(msg string, err error, data ...meta.Field) {
	zl.logger.WithOptions(zap.AddCallerSkip(1)).Panic(msg, wrapZapMeta(err, data...)...)
}

// Debugf debug
func (zl *ZapLogger) Debugf(msg, format string, data ...any) {
	zl.Debug(msg, nil, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Infof info
func (zl *ZapLogger) Infof(msg, format string, data ...any) {
	zl.Info(msg, nil, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Warnf warn
func (zl *ZapLogger) Warnf(msg, format string, err error, data ...any) {
	zl.Warn(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Errorf error
func (zl *ZapLogger) Errorf(msg, format string, err error, data ...any) {
	zl.Error(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Panicf panic
func (zl *ZapLogger) Panicf(msg, format string, err error, data ...any) {
	zl.Panic(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// wrapZapMeta wrap meta to zap fields
func wrapZapMeta(err error, metas ...meta.Field) (fields []zap.Field) {
	capacity := len(metas) + 1 // namespace meta
	if err != nil {
		capacity++
	}

	fields = make([]zap.Field, 0, capacity)
	if err != nil {
		fields = append(fields, zap.Error(err))
	}

	for _, m := range metas {
		fields = append(fields, zap.Any(m.Key(), m.Value()))
	}

	return
}

func setupWithConsole(opt *Opt) {
	consoleDebugging := zapcore.Lock(os.Stdout)
	core := zapcore.NewTee(
		zapcore.NewCore(getConsoleEncoder(), consoleDebugging, zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
			return lvl >= opt.level
		})),
	)

	once.Do(func() {
		log := zap.New(core, zap.AddCaller())
		for key, value := range opt.fields {
			log = log.WithOptions(zap.Fields(zapcore.Field{Key: key, Type: zapcore.StringType, String: value}))
		}

		Logger = &ZapLogger{
			logger: log,
			Opt:    opt,
		}
	})

}

func setupWithFiles(c Config, opt *Opt) {
	accessPath := path.Join(c.Path, accessFilename)
	errorPath := path.Join(c.Path, errorFilename)
	severePath := path.Join(c.Path, severeFilename)
	debugPath := path.Join(c.Path, debugFilename)

	errPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl > zapcore.WarnLevel
	})
	warnPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl == zapcore.WarnLevel
	})
	infoPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl == zapcore.InfoLevel
	})
	debugPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl == zapcore.DebugLevel
	})

	core := zapcore.NewTee(
		zapcore.NewCore(getFileEncoder(), getLogWriter(accessPath, maxSize, maxBackup, c.KeepDays, c.Compress), infoPriority),
		zapcore.NewCore(getFileEncoder(), getLogWriter(errorPath, maxSize, maxBackup, c.KeepDays, c.Compress), errPriority),
		zapcore.NewCore(getFileEncoder(), getLogWriter(severePath, maxSize, maxBackup, c.KeepDays, c.Compress), warnPriority),
		zapcore.NewCore(getFileEncoder(), getLogWriter(debugPath, maxSize, maxBackup, c.KeepDays, c.Compress), debugPriority),
	)

	stderr := zapcore.Lock(os.Stderr) // lock for concurrent safe

	once.Do(func() {
		log := zap.New(core, zap.AddCaller(), zap.ErrorOutput(stderr))
		for key, value := range opt.fields {
			log = log.WithOptions(zap.Fields(zapcore.Field{Key: key, Type: zapcore.StringType, String: value}))
		}

		Logger = &ZapLogger{
			logger: log,
			Opt:    opt,
		}
	})
}

func getLogWriter(fileName string, maxSize, maxBackups, maxAge int, isCompress bool) zapcore.WriteSyncer {
	lumberJackLogger := &lumberjack.Logger{
		Filename:   fileName,
		MaxSize:    maxSize,
		MaxBackups: maxBackups,
		MaxAge:     maxAge,
		Compress:   isCompress,
	}

	return zapcore.AddSync(lumberJackLogger)
}

func getFileEncoder() zapcore.Encoder {
	return zapcore.NewJSONEncoder(zapcore.EncoderConfig{
		TimeKey:        "@timestamp",
		LevelKey:       "level",
		NameKey:        "Logger",
		CallerKey:      "caller",
		MessageKey:     "msg",
		StacktraceKey:  "stacktrace",
		EncodeLevel:    zapcore.LowercaseLevelEncoder,  // Level 序列化为小写字符串
		EncodeTime:     TimeEncoder,                    // 记录时间设置为2006-01-02T15:04:05Z07:00
		EncodeDuration: zapcore.SecondsDurationEncoder, //  耗时设置为浮点秒数
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeCaller:   zapcore.ShortCallerEncoder, // 全路径编码器
	})
}

func getConsoleEncoder() zapcore.Encoder {
	encoderConfig := zap.NewDevelopmentEncoderConfig()
	encoderConfig.EncodeTime = TimeEncoder
	encoderConfig.EncodeLevel = zapcore.LowercaseLevelEncoder
	encoderConfig.EncodeDuration = zapcore.SecondsDurationEncoder
	encoderConfig.EncodeCaller = zapcore.ShortCallerEncoder
	return zapcore.NewConsoleEncoder(encoderConfig)
}

// TimeEncoder 设置时间格式化方式
func TimeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	enc.AppendString(t.Format(DefaultTimeLayout))
}
```

logger/xlog[context.go]

```go
package xlog

import (
	"context"
	"fmt"

	"go.uber.org/zap/zapcore"

	"logger"
	"logger/meta"
	"logger/xzap"
)

var ctxMarkedKey = &ctxMarker{}

type ctxMarker struct{}

// CtxLogger 日志上下文记录器
type CtxLogger struct {
	logger *xzap.ZapLogger
	fields []meta.Field
}

// WithContext 获取当前上下文日志记录器
func WithContext(ctx context.Context) logger.Logger {
	return newContextLogger(ctx)
}

// ToContext 返回新的上下文并添加日志到上下文用于提取
func ToContext(ctx context.Context, logger *xzap.ZapLogger) context.Context {
	l, ok := ctx.Value(ctxMarkedKey).(*CtxLogger)
	if ok {
		return ctx
	}

	l = &CtxLogger{
		logger: logger,
	}

	return context.WithValue(ctx, ctxMarkedKey, l)
}

// newContextLogger 获取当前上下文日志记录器
func newContextLogger(ctx context.Context) *CtxLogger {
	l, ok := ctx.Value(ctxMarkedKey).(*CtxLogger)
	if !ok || l == nil {
		fmt.Println(xzap.Logger)
		l = &CtxLogger{
			logger: xzap.Logger,
		}
	}

	return l
}

// AddFields 添加zap Field 到日志中
func AddFields(ctx context.Context, fields ...meta.Field) {
	l := newContextLogger(ctx)
	l.fields = append(l.fields, fields...)
}

// extract 提取context log中fields
func (l *CtxLogger) extract() *xzap.ZapLogger {
	return l.logger.With(l.fields...)
}

// Debug debug log
func (l *CtxLogger) Debug(msg string, data ...meta.Field) {
	l.extract().Debug(msg, data...)
}

// Info log
func (l *CtxLogger) Info(msg string, data ...meta.Field) {
	l.extract().Info(msg, data...)
}

// Warn log
func (l *CtxLogger) Warn(msg string, err error, data ...meta.Field) {
	l.extract().Warn(msg, err, data...)
}

// Error error log
func (l *CtxLogger) Error(msg string, err error, data ...meta.Field) {
	l.extract().Error(msg, err, data...)
}

// Print 调用 zap.Logger write
func (l *CtxLogger) Print(msg string, level zapcore.Level, err error, data ...meta.Field) {
	l.extract().Print(msg, level, err, data...)
}

// Panic 调用 zap.Logger Panic
func (l *CtxLogger) Panic(msg string, err error, data ...meta.Field) {
	l.extract().Panic(msg, err, data...)
}

// Debugf debug
func (l *CtxLogger) Debugf(msg, format string, data ...any) {
	l.extract().Debug(msg, nil, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Infof info
func (l *CtxLogger) Infof(msg, format string, data ...any) {
	l.extract().Info(msg, nil, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Warnf warn
func (l *CtxLogger) Warnf(msg, format string, err error, data ...any) {
	l.extract().Warn(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Errorf error
func (l *CtxLogger) Errorf(msg, format string, err error, data ...any) {
	l.extract().Error(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}

// Panicf panic
func (l *CtxLogger) Panicf(msg, format string, err error, data ...any) {
	l.extract().Panic(msg, err, meta.NewField("content", fmt.Sprintf(format, data...)))
}
```

ginintercepter

```
package xlog

import (
	"bytes"
	"io"
	"io/ioutil"
	"time"

	"github.com/gin-gonic/gin"

	"logger/meta"
	"logger/xzap"
)

func GinInterceptor(zapLogger *xzap.ZapLogger, msg string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// some evil middlewares modify this values
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		var buf bytes.Buffer
		tee := io.TeeReader(c.Request.Body, &buf)
		requestBody, _ := ioutil.ReadAll(tee)
		c.Request.Body = ioutil.NopCloser(&buf)
		bodyLogWriter := &BodyLogWriter{body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = bodyLogWriter

		start := time.Now()

		c.Next()

		responseBody := bodyLogWriter.body.Bytes()
		// log := WithContext(c.Request.Context())
		if len(c.Errors) > 0 {
			// Append error field if this is an erroneous request.
			for _, e := range c.Errors {
				zapLogger.Error("msg", e)
			}
		} else {
			zapLogger.Info(msg,
				meta.NewField("status", c.Writer.Status()),
				meta.NewField("method", c.Request.Method),
				meta.NewField("function", c.HandlerName()),
				meta.NewField("path", path),
				meta.NewField("query", query),
				meta.NewField("ip", c.ClientIP()),
				meta.NewField("user-agent", c.Request.UserAgent()),
				meta.NewField("token", c.Request.Header.Get("session_id")),
				meta.NewField("content-type", c.Request.Header.Get("Content-Type")),
				meta.NewField("latency", float64(time.Now().Sub(start).Nanoseconds()/1000000.0)),
				meta.NewField("request", string(requestBody)),
				meta.NewField("response", string(responseBody)),
			)
		}
	}
}

type BodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
}

func (w BodyLogWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}
func (w BodyLogWriter) WriteString(s string) (int, error) {
	w.body.WriteString(s)
	return w.ResponseWriter.WriteString(s)
}
```

rpcintercepter

```go
import (
	"context"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"errcode"
	"logger/meta"
)

// Option 可选参数
type Option func(*option)

type option struct {
	shouldLog           Decider
	codeFunc            ErrorToCode
	levelFunc           CodeToLevel
	durationFunc        DurationToField
	messageFunc         MessageProducer
	recoveryHandlerFunc RecoveryHandlerFuncContext
}

func WithDecider(decider Decider) Option {
	return func(opt *option) {
		opt.shouldLog = decider
	}
}

// Decider 决策器 定义抑制拦截器日志的规则
type Decider func(methodName string, err error) bool

func WithErrorToCode(err ErrorToCode) Option {
	return func(opt *option) {
		opt.codeFunc = err
	}
}

// ErrorToCode 定义error 映射 code
type ErrorToCode func(err error) uint32

func WithCodeToLevel(code CodeToLevel) Option {
	return func(opt *option) {
		opt.levelFunc = code
	}
}

// CodeToLevel rpc返回码与zap日志级别映射
type CodeToLevel func(code uint32) zapcore.Level

func WithDurationToField(duration DurationToField) Option {
	return func(opt *option) {
		opt.durationFunc = duration
	}
}

// DurationToField 生成日志持续时间
type DurationToField func(duration time.Duration) meta.Field

func WithMessageProducer(producer MessageProducer) Option {
	return func(opt *option) {
		opt.messageFunc = producer
	}
}

// MessageProducer 生成日志消息
type MessageProducer func(ctx context.Context, msg string, level zapcore.Level, err error, data ...meta.Field)

func WithRecoveryHandlerFuncContext(recovery RecoveryHandlerFuncContext) Option {
	return func(opt *option) {
		opt.recoveryHandlerFunc = recovery
	}
}

// RecoveryHandlerFuncContext 将recovery以error形式返回 上下文可以用于提取请求的元数据和上下文
type RecoveryHandlerFuncContext func(ctx context.Context, p any) (err error)

var defaultOptions = &option{
	levelFunc:           DefaultCodeToLevel,
	shouldLog:           DefaultDeciderMethod,
	codeFunc:            DefaultErrorToCode,
	durationFunc:        DefaultDurationToField,
	messageFunc:         DefaultMessageProducer,
	recoveryHandlerFunc: DefaultRecoveryHandlerFunc,
}

// DefaultCodeToLevel 根据RPC服务端返回码返回zap日志级别
func DefaultCodeToLevel(code uint32) zapcore.Level {
	switch codes.Code(code) {
	case codes.OK:
		return zap.InfoLevel
	case codes.Canceled:
		return zap.InfoLevel
	case codes.Unknown:
		return zap.ErrorLevel
	case codes.InvalidArgument:
		return zap.InfoLevel
	case codes.DeadlineExceeded:
		return zap.WarnLevel
	case codes.NotFound:
		return zap.InfoLevel
	case codes.AlreadyExists:
		return zap.InfoLevel
	case codes.PermissionDenied:
		return zap.WarnLevel
	case codes.Unauthenticated:
		return zap.InfoLevel // unauthenticated requests can happen
	case codes.ResourceExhausted:
		return zap.WarnLevel
	case codes.FailedPrecondition:
		return zap.WarnLevel
	case codes.Aborted:
		return zap.WarnLevel
	case codes.OutOfRange:
		return zap.WarnLevel
	case codes.Unimplemented:
		return zap.ErrorLevel
	case codes.Internal:
		return zap.ErrorLevel
	case codes.Unavailable:
		return zap.WarnLevel
	case codes.DataLoss:
		return zap.ErrorLevel
	default:
		if code >= 7000 {
			return zap.InfoLevel
		}

		return zap.ErrorLevel
	}
}

// DefaultClientCodeToLevel 根据RPC客户端返回码返回zap日志级别
func DefaultClientCodeToLevel(code uint32) zapcore.Level {
	switch codes.Code(code) {
	case codes.OK:
		return zap.DebugLevel
	case codes.Canceled:
		return zap.DebugLevel
	case codes.Unknown:
		return zap.InfoLevel
	case codes.InvalidArgument:
		return zap.DebugLevel
	case codes.DeadlineExceeded:
		return zap.InfoLevel
	case codes.NotFound:
		return zap.DebugLevel
	case codes.AlreadyExists:
		return zap.DebugLevel
	case codes.PermissionDenied:
		return zap.InfoLevel
	case codes.Unauthenticated:
		return zap.InfoLevel // unauthenticated requests can happen
	case codes.ResourceExhausted:
		return zap.DebugLevel
	case codes.FailedPrecondition:
		return zap.DebugLevel
	case codes.Aborted:
		return zap.DebugLevel
	case codes.OutOfRange:
		return zap.DebugLevel
	case codes.Unimplemented:
		return zap.WarnLevel
	case codes.Internal:
		return zap.WarnLevel
	case codes.Unavailable:
		return zap.WarnLevel
	case codes.DataLoss:
		return zap.WarnLevel
	default:
		if code >= 7000 {
			return zap.InfoLevel
		}

		return zap.InfoLevel
	}
}

// DefaultDeciderMethod 决策器是否记录日志的默认实现，默认是记录日志
func DefaultDeciderMethod(methodName string, err error) bool {
	return true
}

// DefaultErrorToCode error映射code
func DefaultErrorToCode(err error) uint32 {
	if err == nil {
		return uint32(codes.OK)
	}

	switch e := err.(type) {
	case interface{ GRPCStatus() *status.Status }:
		return uint32(status.Code(err))
	case *errcode.Err:
		return e.Code()
	default:
		return uint32(codes.Unknown)
	}
}

// DefaultDurationToField 请求持续时间转换为Zap字段
var DefaultDurationToField = DurationToTimeMillisField

// DurationToTimeMillisField 持续时间转换为毫秒并使用key[time_ms]
func DurationToTimeMillisField(duration time.Duration) meta.Field {
	return meta.NewField("grpc.duration", durationToMilliseconds(duration))
}

// durationToMilliseconds 时间转换为毫秒级别
func durationToMilliseconds(duration time.Duration) float32 {
	return float32(duration.Nanoseconds()/1000) / 1000
}

// DefaultMessageProducer 写日志
func DefaultMessageProducer(ctx context.Context, msg string, level zapcore.Level, err error, data ...meta.Field) {
	// 重新从上下文提取日志
	WithContext(ctx).Print(msg, level, err, data...)
}

// DefaultRecoveryHandlerFunc 恐慌默认处理
func DefaultRecoveryHandlerFunc(ctx context.Context, p any) (err error) {
	err = status.Errorf(codes.Internal, "%v", p)
	WithContext(ctx).Panic("panic", err)

	return err
}
```

```go
package xlog

import (
	"bytes"
	"context"
	"fmt"
	"io"

	"github.com/golang/protobuf/jsonpb"
	"github.com/golang/protobuf/proto"
	"go.uber.org/zap/zapcore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"logger/meta"
)

var (
	// JsonPbMarshaller 序列化protobuf消息
	JsonPbMarshaller JsonPbMarshaler = &jsonpb.Marshaler{}
)

// JsonPbMarshaler 序列化protobuf消息
type JsonPbMarshaler interface {
	Marshal(out io.Writer, pb proto.Message) error
}

type protoMessageObject struct {
	pb proto.Message
}

// MarshalLogObject 序列化成日志对象
func (j *protoMessageObject) MarshalLogObject(oe zapcore.ObjectEncoder) error {
	return oe.AddReflected("content", j)
}

// MarshalJSON 序列化成json
func (j *protoMessageObject) MarshalJSON() ([]byte, error) {
	b := &bytes.Buffer{}
	if err := JsonPbMarshaller.Marshal(b, j.pb); err != nil {
		return nil, fmt.Errorf("jsonpb serializer failed: %v", err)
	}

	return b.Bytes(), nil
}

// protoMessageToFields 将message序列化成json，并写入存储
func protoMessageToFields(pbMsg any, key string) []meta.Field {
	var fields []meta.Field
	if p, ok := pbMsg.(proto.Message); ok {
		fields = append(fields, meta.NewField(key, &protoMessageObject{pb: p}))
	}

	return fields
}

func recoverFrom(ctx context.Context, p any, r RecoveryHandlerFuncContext) error {
	if r == nil {
		return status.Errorf(codes.Internal, "%v", p)
	}
	return r(ctx, p)
}
```

```go
package xlog

import (
	"context"
	"path"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/peer"

	"jwt"
	"logger/meta"
	"logger/xzap"
)

var (

	// GrpcSystemField 日志系统域
	GrpcSystemField = meta.NewField("system", "grpc")

	// ServerField 服务端日志
	ServerField = meta.NewField("span.kind", "server")
)

// PayloadUnaryServerInterceptor 一元服务器拦截器，用于记录服务端请求和响应
func PayloadUnaryServerInterceptor(zapLogger *xzap.ZapLogger, opts ...Option) grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (_ interface{}, err error) {
		o := evaluateServerOpt(opts...)
		startTime := time.Now()
		newCtx := newServerLoggerCaller(ctx, zapLogger, info.FullMethod, startTime)
		defer func() {
			if r := recover(); r != nil {
				err = recoverFrom(newCtx, r, o.recoveryHandlerFunc)
			}
		}()

		resp, err := handler(newCtx, req)
		if !o.shouldLog(info.FullMethod, err) {
			return resp, err
		}

		meta := protoMessageToFields(req, "grpc.request")
		if err == nil {
			meta = append(meta, protoMessageToFields(resp, "grpc.response")...)
		}
		code := o.codeFunc(err)
		level := o.levelFunc(code)
		meta = append(meta, o.durationFunc(time.Since(startTime)))
		o.messageFunc(newCtx, "info", level, err, meta...)

		return resp, err
	}
}

// PayloadStreamServerInterceptor 流拦截器，用于记录服务端请求和响应
func PayloadStreamServerInterceptor(zapLogger *xzap.ZapLogger, opts ...Option) grpc.StreamServerInterceptor {
	return func(srv interface{}, stream grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) (err error) {
		o := evaluateServerOpt(opts...)
		startTime := time.Now()
		ctx := newServerLoggerCaller(stream.Context(), zapLogger, info.FullMethod, startTime)
		wrapped := &wrappedServerStream{ServerStream: stream, wrappedContext: ctx}
		defer func() {
			if r := recover(); r != nil {
				err = recoverFrom(stream.Context(), r, o.recoveryHandlerFunc)
			}
		}()

		err = handler(srv, wrapped)
		if !o.shouldLog(info.FullMethod, err) {
			return err
		}

		code := o.codeFunc(err)
		level := o.levelFunc(code)
		o.messageFunc(ctx, "info", level, err, o.durationFunc(time.Since(startTime)))

		return err
	}
}

func evaluateServerOpt(opts ...Option) *option {
	optCopy := &option{}
	*optCopy = *defaultOptions
	for _, o := range opts {
		o(optCopy)
	}

	return optCopy
}

func newServerLoggerCaller(ctx context.Context, zapLogger *xzap.ZapLogger, methodString string, start time.Time) context.Context {
	var fields []meta.Field
	fields = append(fields, meta.NewField("grpc.start_time", start.Format(xzap.DefaultTimeLayout)))
	if d, ok := ctx.Deadline(); ok {
		fields = append(fields, meta.NewField("grpc.request.deadline", d.Format(xzap.DefaultTimeLayout)))
	}

	if p, ok := peer.FromContext(ctx); ok {
		fields = append(fields, meta.NewField("grpc.address", p.Addr.String()))
	}

	// tr, ok := ctx.Value(tracespec.TracingKey).(tracespec.Trace)
	// if ok {
	// 	fields = append(fields, meta.NewField("trace", tr.TraceId()))
	// 	fields = append(fields, meta.NewField("span", tr.SpanId()))
	// }

	token, ok := jwt.FromContext(ctx)
	if ok {
		fields = append(fields, meta.NewField("user_id", token.UserId))
	}

	return ToContext(ctx, zapLogger.With(append(fields, serverCallFields(methodString)...)...))
}

func serverCallFields(methodString string) []meta.Field {
	service := path.Dir(methodString)[1:]
	method := path.Base(methodString)
	return []meta.Field{
		GrpcSystemField,
		ServerField,
		meta.NewField("grpc.service", service),
		meta.NewField("grpc.method", method),
	}
}

// wrappedServerStream 包装后的服务端流对象
type wrappedServerStream struct {
	grpc.ServerStream
	wrappedContext context.Context
}

// SendMsg 发送消息
func (l *wrappedServerStream) SendMsg(m interface{}) error {
	err := l.ServerStream.SendMsg(m)
	if err == nil {
		AddFields(l.Context(), protoMessageToFields(m, "grpc.response")...)
	}

	return err
}

// RecvMsg 接收消息
func (l *wrappedServerStream) RecvMsg(m interface{}) error {
	err := l.ServerStream.RecvMsg(m)
	if err == nil {
		AddFields(l.Context(), protoMessageToFields(m, "grpc.request")...)
	}

	return err
}

// Context 返回封装的上下文
func (l *wrappedServerStream) Context() context.Context {
	return l.wrappedContext
}
```

```go
package xlog

import (
	"context"
	"path"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/peer"

	"jwt"
	"logger/meta"
	"logger/xzap"
)

var (
	// ClientField 客户端日志
	ClientField = meta.NewField("span.kind", "client")
)

// PayloadUnaryClientInterceptor 一元拦截器，用于记录客户端端请求和响应
func PayloadUnaryClientInterceptor(zapLogger *xzap.ZapLogger, options ...Option) grpc.UnaryClientInterceptor {
	return func(ctx context.Context, method string, req, resp interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) (err error) {
		o := evaluateClientOpt(options...)
		startTime := time.Now()
		newCtx := newClientLoggerCaller(ctx, zapLogger, method, startTime)
		defer func() {
			if r := recover(); r != nil {
				err = recoverFrom(newCtx, r, o.recoveryHandlerFunc)
			}
		}()

		err = invoker(newCtx, method, req, resp, cc, opts...)
		if !o.shouldLog(method, err) {
			return err
		}

		fields := protoMessageToFields(req, "grpc.request")
		if err == nil {
			fields = append(fields, protoMessageToFields(resp, "grpc.response")...)
		}

		code := o.codeFunc(err)
		level := o.levelFunc(code)
		o.messageFunc(newCtx, "info", level, err, o.durationFunc(time.Since(startTime)))

		return err
	}
}

// PayloadStreamClientInterceptor 流拦截器，用于记录客户端请求和响应
func PayloadStreamClientInterceptor(zapLogger *xzap.ZapLogger, options ...Option) grpc.StreamClientInterceptor {
	return func(ctx context.Context, desc *grpc.StreamDesc, cc *grpc.ClientConn, method string, streamer grpc.Streamer, opts ...grpc.CallOption) (_ grpc.ClientStream, err error) {
		o := evaluateClientOpt(options...)
		startTime := time.Now()
		newCtx := newClientLoggerCaller(ctx, zapLogger, method, startTime)
		defer func() {
			if r := recover(); r != nil {
				err = recoverFrom(newCtx, r, o.recoveryHandlerFunc)
			}
		}()

		clientStream, err := streamer(newCtx, desc, cc, method, opts...)
		if !o.shouldLog(method, err) {
			if err != nil {
				return nil, err
			}

			return &wrappedClientStream{
				ClientStream:   clientStream,
				wrappedContext: newCtx,
			}, err
		}

		code := o.codeFunc(err)
		level := o.levelFunc(code)
		o.messageFunc(newCtx, "info", level, err, o.durationFunc(time.Since(startTime)))

		return &wrappedClientStream{
			ClientStream:   clientStream,
			wrappedContext: newCtx,
		}, nil
	}
}

func evaluateClientOpt(opts ...Option) *option {
	optCopy := &option{}
	*optCopy = *defaultOptions
	optCopy.levelFunc = DefaultClientCodeToLevel
	for _, o := range opts {
		o(optCopy)
	}
	return optCopy
}

func newClientLoggerCaller(ctx context.Context, logger *xzap.ZapLogger, methodString string, start time.Time) context.Context {
	var fields []meta.Field
	fields = append(fields, meta.NewField("grpc.start_time", start.Format(xzap.DefaultTimeLayout)))
	if d, ok := ctx.Deadline(); ok {
		fields = append(fields, meta.NewField("grpc.request.deadline", d.Format(xzap.DefaultTimeLayout)))
	}

	if p, ok := peer.FromContext(ctx); ok {
		fields = append(fields, meta.NewField("grpc.address", p.Addr.String()))
	}

	// tr, ok := ctx.Value(tracespec.TracingKey).(tracespec.Trace)
	// if ok {
	// 	fields = append(fields, meta.NewField("trace", tr.TraceId()))
	// 	fields = append(fields, meta.NewField("span", tr.SpanId()))
	// }

	token, ok := jwt.FromContext(ctx)
	if ok {
		fields = append(fields, meta.NewField("user_id", token.UserId))
	}

	return ToContext(ctx, logger.With(append(fields, clientLoggerFields(methodString)...)...))
}

func clientLoggerFields(methodString string) []meta.Field {
	service := path.Dir(methodString)[1:]
	method := path.Base(methodString)
	return []meta.Field{
		GrpcSystemField,
		ClientField,
		meta.NewField("grpc.service", service),
		meta.NewField("grpc.method", method),
	}
}

// wrappedClientStream 包装后的客户端流对象
type wrappedClientStream struct {
	grpc.ClientStream
	wrappedContext context.Context
}

// SendMsg 发送消息
func (l *wrappedClientStream) SendMsg(m interface{}) error {
	err := l.ClientStream.SendMsg(m)
	if err == nil {
		AddFields(l.Context(), protoMessageToFields(m, "grpc.request")...)
	}

	return err
}

// RecvMsg 接收消息
func (l *wrappedClientStream) RecvMsg(m interface{}) error {
	err := l.ClientStream.RecvMsg(m)
	if err == nil {
		AddFields(l.Context(), protoMessageToFields(m, "grpc.response")...)
	}

	return err
}

// Context 返回封装的上下文, 用于覆盖 grpc.ServerStream.Context()
func (l *wrappedClientStream) Context() context.Context {
	return l.wrappedContext
}
```



