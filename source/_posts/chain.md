---
title: 【区块链】学习笔记
comments: false
toc: true
categories: 区块链
tags: [区块链]
index_img: /images/chain/index.jpg
---

> 区块链是一种分布式账本—通过去中心化、去信任方式集体维护一个可靠的分布式账本，是一种在网络成员之间共享、复制和同步的数据库，记录了网络参与者之间的交易。<!-- more -->

### 什么是区块链？

在开发者眼中，区块链可以拆分为几个概念：

**交易**：所有的交互行为（购买、投票、转账）统称为一个交易（Transaction，Tx）

**区块**：在一个特定的时间段内会产生N笔交易，把这些交易打包到一起之后，称之为区块（Block）

**区块链**：区块（Block）以特定的规则链接到一起之后，就称之为区块链（Blockchain）

![](/images/chain/blockchain.png)

#### 交易上链流程

- 第一步：由用户自己创建交易（转账等）
- 第二步：由矿工校验交易，并广播交易
- 第三步：竞争挖矿
- 第四步：矿工A挖矿成功，全网广播
- 第五步：多个矿工对挖矿交易进行确认无误
- 第六步：矿工A获得挖矿奖励，全网同步账本，重复第一步

### 比特币

诞生于2009年，最初是C++实现的，它的功能非常纯粹：就是用来转账的。

这里有老外录制的**[视频](https://youtu.be/_160oMzblY8)**和**[网站](https://andersbrownworth.com/blockchain)**

#### 共识算法

##### POW（工作量证明）

![](/images/chain/pow.png)

```go
package block

import (
	"bytes"
	"crypto/sha256"
	"strconv"
	"time"
)

type Block struct {
	Timestamp int64
	Data      []byte
	PreHash   []byte
	Hash      []byte
	Nonce     int
}

func (b *Block) SetHash()  {
	timestamp := []byte(strconv.FormatInt(b.Timestamp, 10))
	header := bytes.Join([][]byte{b.PreHash, b.Data, timestamp}, []byte{})
	hash := sha256.Sum256(header)
	b.Hash = hash[:]
}

func NewBlock(data string, preHash []byte) *Block {
	block := &Block{
		Timestamp: time.Now().Unix(),
		Data:      []byte(data),
		PreHash:   preHash,
	}

	return block
}
```

```go
package pow

import (
	"bytes"
	"crypto/sha256"
	"fmt"
	"math"
	"math/big"

	"blockchain/block"
)

const (
	// targetBit 区块挖矿难度 24位0
	targetBit = 24
	maxNonce  = math.MaxInt64
)

// ProofOfWork POW
type ProofOfWork struct {
	block  *block.Block
	target *big.Int
}

// NewProofOfWork POW对象
func NewProofOfWork(b *block.Block) *ProofOfWork {
	target := big.NewInt(1)
	target.Lsh(target, uint(256-targetBit)) // 将1往左偏移256-targetBit位
	pow := &ProofOfWork{b, target}

	return pow
}

func NewPOWBlock(data string, preHash []byte) *block.Block {
	b := block.NewBlock(data, preHash)
	pow := NewProofOfWork(b)
	nonce, hash := pow.Run()
	b.Hash = hash[:]
	b.Nonce = nonce

	return b
}

// prepareData 封装块数据
func (pow *ProofOfWork) prepareData(nonce int) []byte {
	data := bytes.Join([][]byte{
		pow.block.PreHash,
		pow.block.Data,
		IntToHex(pow.block.Timestamp),
		IntToHex(int64(targetBit)),
		IntToHex(int64(nonce)),
	}, []byte{})

	return data
}

func (pow *ProofOfWork) Run() (int, []byte) {
	var hashInt big.Int
	var hash [32]byte
	nonce := 0
	for nonce < maxNonce {
		data := pow.prepareData(nonce)
		hash = sha256.Sum256(data)
		hashInt.SetBytes(hash[:])
		if hashInt.Cmp(pow.target) == -1 {
			break
		}

		nonce++
	}

	return nonce, hash[:]
}

func (pow *ProofOfWork) Validate() bool {
	var hashInt big.Int
	data := pow.prepareData(pow.block.Nonce)
	hash := sha256.Sum256(data)
	hashInt.SetBytes(hash[:])

	return hashInt.Cmp(pow.target) == -1
}

func IntToHex(val int64) []byte {
	return []byte(fmt.Sprintf("%X", val))
}
```

```go
package blockchain

import (
	"blockchain/block"
	"blockchain/pow"
)

type Blockchain struct {
	blocks    []*block.Block
	consensus string
}

func (bc *Blockchain) AddBlock(data string) {
	preBlock := bc.blocks[len(bc.blocks)-1]
	newBlock := pow.NewPOWBlock(data, preBlock.Hash)
	bc.blocks = append(bc.blocks, newBlock)
}

func NewGenesisBlock() *block.Block {
	return pow.NewPOWBlock("Genesis Block", []byte{})
}

func NewBlockchain() *Blockchain {
	return &Blockchain{blocks: []*block.Block{NewGenesisBlock()}}
}

```

```go
package blockchain

import (
	"fmt"
	"strconv"
	"testing"

	"blockchain/pow"
)

func TestNewBlockchain(t *testing.T) {
	bc := NewBlockchain()
	bc.AddBlock("second b")
	for _, b := range bc.blocks {
		p := pow.NewProofOfWork(b)
		fmt.Printf("Pre hash: %x\n", b.PreHash)
		fmt.Printf("Data: %s\n", b.Data)
		fmt.Printf("Hash: %x\n", b.Hash)
		fmt.Printf("Pow: %s\n", strconv.FormatBool(p.Validate()))
		fmt.Println()
	}
}
```

### 以太坊

弥补了比特币无法二次开发的问题，极大的推动了区块链的进程，让区块链逐步走进了大众视野，时至今日，以太坊已经成为继比特币之后，全球市值第二大的区块链项目，也拥有最大的开发者社区。

以太坊网络可以理解为一个世界型计算机，它永远不会宕机，因为有成千上万台独立计算机在运行着。只要运行它的客户端（全节点版本），就是其中一员（称之为矿工）。任何链上程序（称为智能合约）最终都会被矿工打包执行，全网同步。

#### 智能合约

专门为以太坊设计的新语言：**solidity**，使用solidity开发的程序，在区块链上就叫做：**智能合约**（Smart Contract）。

这些程序：

- 一旦部署就不会消失，因为区块链的账本数据永远存在（这类似于合约）
- 一旦被触发就会按照既定逻辑执行，无人能够作恶（这类似于智能）

围绕以太坊的开发，诞生了新的开发架构**Dapp**，这种架构**没有专门的后台**，它的**区块链网络就是底层系统**：如以太坊网络、BSC网络等。

#### Dapp架构

一个最简单的Dapp应用可以直接描述如下，称为：**V1版本架构**

![](/images/chain/dapp-v1.png)

V1：我们可以看到，此时浏览器多了一个`钱包模块`，钱包是打开区块链的身份钥匙🔑，整个区块链上世界都是建立在密码学之上的（非对称加密，不懂也罢），而图中蓝色部分就是区块链网络，我们的程序就运行在其中，它既是后端服务，也是数据库。我们的前端直接与区块链网络进行交互，包括：

- 读数据（读取区块链账本数据），免费的
- 写数据（向区块链网络提交数据，永久保存，此时需要矿工打包执行），付费的（这点记住即可，后续语言学习中，陆续会讲解）

V2：随着区块链网络生态的发展，人们渐渐发现了优化空间，即我们可以将读操作预先存储到一个服务器中，然后前端直接从中获取数据，这既可以保证系统安全，又可以提高效率，因此**subgraph**（捕捉链上事件，链下存储，支持逻辑处理）这个基建得到飞速发展，图中橘黄色部分。称之为：**V2版本架构**

![](/images/chain/dapp-v2.png)

V3：当然，如果业务过于复杂，与链上合约交互的部分，我们可以独立封装出来，让前端专注于展示，合约专注于逻辑，所以引入了SDK，这部分专门处理和链上合约打交道的所有逻辑，并做相应的业务处理，时刻准备喂给前端，此时我们称为：**V3版本架构**

![](/images/chain/dapp-v3.png)

V4：再后来，区块链存储项目也陆续诞生，其中最为人知的便是：ipfs，它是一个致力于大文件存储的项目，最近很火的nft项目中，所有的图片都是要上传到ipfs上，从而节约以太坊网络费用，所以此时的设计更改如下，我们称之为：**V4版本架构**

![](/images/chain/dapp-v4.png)

### 学习资源

1. 数字僵尸游戏（新手村语法）：https://cryptozombies.io/ ，适合新手从0到1体验编程乐趣，https://cryptozombies.io/en/course/
2. 语法学习（资深语法）：https://solidity-by-example.org/ ，本教程部分代码来源于此，增加了详细补充等。
3. web3全栈课程（大拿视频）：https://www.bilibili.com/video/BV1Ca411n7ta?vd_source=42fe91bf6d16ec8841b22ea520184d76 ，这个最近很出名
4. 找solidity漏洞练习（高手级）：https://ethernaut.openzeppelin.com/ 
5. 找defi漏洞练习（专业级）：https://www.damnvulnerabledefi.xyz/ 
6. defi专业知识（defi Mooc）：https://www.youtube.com/channel/UCB67PxhB5LAWEbI4etQS7aw/playlists?view=50&sort=dd&shelf_id=4 
7. 区块链科普：https://www.youtube.com/c/Finematics ，非常优质的UP主
