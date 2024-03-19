---
title: 【区块链与元宇宙】学习笔记
comments: false
toc: true
categories: 区块链与元宇宙
tags: [区块链]
index_img: /images/chain/index.jpg
---

> 区块链是一种分布式账本—通过去中心化、去信任方式集体维护一个可靠的分布式账本，是一种在网络成员之间共享、复制和同步的数据库，记录了网络参与者之间的交易。<!-- more -->

### 共识算法

#### POW

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

