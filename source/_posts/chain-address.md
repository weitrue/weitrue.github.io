---
title: 【区块链】Address
categories: 区块链
tags: [地址,EoA,CA,合约,区块链]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/img/updating.jpg
banner_img: /images/img/banner.png
---

> <!-- more -->

### EoA



### CA

#### Proxy

#### Token

#### NFT

#### Swap

### EIP55

```go
import (
	"encoding/hex"
	"errors"
	"strconv"
	"strings"

	"golang.org/x/crypto/sha3"
)

func ToCheckSumAddress(address string) (string, error) {
	if address == "" {
		return "", errors.New("empty address")
	}

	if strings.HasPrefix(address, "0x") {
		address = address[2:]
	}

	bytes, err := hex.DecodeString(address)
	if err != nil {
		return "", err
	}

	hash := calculateKeccak256([]byte(strings.ToLower(address)))
	result := "0x"
	for i, b := range bytes {
		result += checksumByte(b>>4, hash[i]>>4)
		result += checksumByte(b&0xF, hash[i]&0xF)
	}

	return result, nil
}

func checksumByte(addr, hash byte) string {
	result := strconv.FormatUint(uint64(addr), 16)
	if hash >= 8 {
		return strings.ToUpper(result)
	} else {
		return result
	}
}

func calculateKeccak256(addr []byte) []byte {
	hash := sha3.NewLegacyKeccak256()
	hash.Write(addr)
	return hash.Sum(nil)
}
```

```go
func TestToCheckSumAddress(t *testing.T) {
	cases := []string{
		"0xe01511d7333A18e969758BBdC9C7f50CcF30160A",
		"0x62d17DE1fbDF36597F12F19717C39985A921426e",
		"0x6F702345360D6D8533d2362eC834bf5f1aB63910",
	}
	for _, c := range cases {
		t.Run(c, func(t *testing.T) {
			res, err := ToCheckSumAddress(strings.ToLower(c))
			assert.Nil(t, err)
			assert.Equal(t, res, c)
		})
	}
}
```

