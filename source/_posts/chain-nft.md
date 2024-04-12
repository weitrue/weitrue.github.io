---
title: 【区块链】NFT
categories: 区块链
tags: [区块链,NFT]
comments: false
toc: true
sticky: 0
math: true
mermaid: true
hide: false
index_img: /images/chain/chain-nft/index.jpg
banner_img: /images/img/banner.png
---

> <!-- more -->

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

### 合约



### 默克尔树(Merkle)

```go
package merkle

import (
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"hash"
)

// Content represents the data that is stored and verified by the tree. A type that
// implements this interface can be used as an item in the tree.
type Content interface {
	CalculateHash() ([]byte, error)
	Equals(other Content) (bool, error)
}

// MerkleTree is the container for the tree. It holds a pointer to the root of the tree,
// a list of pointers to the leaf nodes, and the merkle root.
type MerkleTree struct {
	Root         *Node
	merkleRoot   []byte
	Leafs        []*Node
	hashStrategy func() hash.Hash
}

// Node represents a node, root, or leaf in the tree. It stores pointers to its immediate
// relationships, a hash, the content stored if it is a leaf, and other metadata.
type Node struct {
	Tree   *MerkleTree
	Parent *Node
	Left   *Node
	Right  *Node
	leaf   bool
	dup    bool
	Hash   []byte
	C      Content
}

// verifyNode walks down the tree until hitting a leaf, calculating the hash at each level
// and returning the resulting hash of Node n.
func (n *Node) verifyNode() ([]byte, error) {
	if n.leaf {
		return n.C.CalculateHash()
	}
	rightBytes, err := n.Right.verifyNode()
	if err != nil {
		return nil, err
	}

	leftBytes, err := n.Left.verifyNode()
	if err != nil {
		return nil, err
	}

	h := n.Tree.hashStrategy()
	if _, err := h.Write(append(leftBytes, rightBytes...)); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
}

// calculateNodeHash is a helper function that calculates the hash of the node.
func (n *Node) calculateNodeHash() ([]byte, error) {
	if n.leaf {
		return n.C.CalculateHash()
	}

	h := n.Tree.hashStrategy()
	if _, err := h.Write(append(n.Left.Hash, n.Right.Hash...)); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
}

// NewTree creates a new Merkle Tree using the content cs.
func NewTree(cs []Content) (*MerkleTree, error) {
	defaultHashStrategy := sha256.New
	t := &MerkleTree{
		hashStrategy: defaultHashStrategy,
	}
	root, leafs, err := buildWithContent(cs, t)
	if err != nil {
		return nil, err
	}
	t.Root = root
	t.Leafs = leafs
	t.merkleRoot = root.Hash
	return t, nil
}

// NewTreeWithHashStrategy creates a new Merkle Tree using the content cs using the provided hash
// strategy. Note that the hash type used in the type that implements the Content interface must
// match the hash type profided to the tree.
func NewTreeWithHashStrategy(cs []Content, hashStrategy func() hash.Hash) (*MerkleTree, error) {
	t := &MerkleTree{
		hashStrategy: hashStrategy,
	}
	root, leafs, err := buildWithContent(cs, t)
	if err != nil {
		return nil, err
	}
	t.Root = root
	t.Leafs = leafs
	t.merkleRoot = root.Hash
	return t, nil
}

// GetMerklePath GetMerklePath: Get Merkle path and indexes(left leaf or right leaf)
func (m *MerkleTree) GetMerklePath(content Content) ([][]byte, []int64, error) {
	for _, current := range m.Leafs {
		ok, err := current.C.Equals(content)
		if err != nil {
			return nil, nil, err
		}

		if ok {
			currentParent := current.Parent
			var merklePath [][]byte
			var index []int64
			for currentParent != nil {
				if bytes.Equal(currentParent.Left.Hash, current.Hash) {
					merklePath = append(merklePath, currentParent.Right.Hash)
					index = append(index, 1) // right leaf
				} else {
					merklePath = append(merklePath, currentParent.Left.Hash)
					index = append(index, 0) // left leaf
				}
				current = currentParent
				currentParent = currentParent.Parent
			}
			return merklePath, index, nil
		}
	}
	return nil, nil, nil
}

// buildWithContent is a helper function that for a given set of Contents, generates a
// corresponding tree and returns the root node, a list of leaf nodes, and a possible error.
// Returns an error if cs contains no Contents.
func buildWithContent(cs []Content, t *MerkleTree) (*Node, []*Node, error) {
	if len(cs) == 0 {
		return nil, nil, errors.New("error: cannot construct tree with no content")
	}
	var leafs []*Node
	for _, c := range cs {
		hash, err := c.CalculateHash()
		if err != nil {
			return nil, nil, err
		}

		leafs = append(leafs, &Node{
			Hash: hash,
			C:    c,
			leaf: true,
			Tree: t,
		})
	}
	if len(leafs)%2 == 1 {
		duplicate := &Node{
			Hash: leafs[len(leafs)-1].Hash,
			C:    leafs[len(leafs)-1].C,
			leaf: true,
			dup:  true,
			Tree: t,
		}
		leafs = append(leafs, duplicate)
	}
	root, err := buildIntermediate(leafs, t)
	if err != nil {
		return nil, nil, err
	}

	return root, leafs, nil
}

// buildIntermediate is a helper function that for a given list of leaf nodes, constructs
// the intermediate and root levels of the tree. Returns the resulting root node of the tree.
func buildIntermediate(nl []*Node, t *MerkleTree) (*Node, error) {
	var nodes []*Node
	for i := 0; i < len(nl); i += 2 {
		h := t.hashStrategy()
		var left, right int = i, i + 1
		if i+1 == len(nl) {
			right = i
		}
		if string(nl[left].Hash) > string(nl[right].Hash) {
			left, right = right, left
		}
		chash := append(nl[left].Hash, nl[right].Hash...)
		if _, err := h.Write(chash); err != nil {
			return nil, err
		}
		n := &Node{
			Left:  nl[left],
			Right: nl[right],
			Hash:  h.Sum(nil),
			Tree:  t,
		}
		nodes = append(nodes, n)
		nl[left].Parent = n
		nl[right].Parent = n
		if len(nl) == 2 {
			return n, nil
		}
	}
	return buildIntermediate(nodes, t)
}

// MerkleRoot returns the unverified Merkle Root (hash of the root node) of the tree.
func (m *MerkleTree) MerkleRoot() []byte {
	return m.merkleRoot
}

// RebuildTree is a helper function that will rebuild the tree reusing only the content that
// it holds in the leaves.
func (m *MerkleTree) RebuildTree() error {
	var cs []Content
	for _, c := range m.Leafs {
		cs = append(cs, c.C)
	}
	root, leafs, err := buildWithContent(cs, m)
	if err != nil {
		return err
	}
	m.Root = root
	m.Leafs = leafs
	m.merkleRoot = root.Hash
	return nil
}

// RebuildTreeWith replaces the content of the tree and does a complete rebuild; while the root of
// the tree will be replaced the MerkleTree completely survives this operation. Returns an error if the
// list of content cs contains no entries.
func (m *MerkleTree) RebuildTreeWith(cs []Content) error {
	root, leafs, err := buildWithContent(cs, m)
	if err != nil {
		return err
	}
	m.Root = root
	m.Leafs = leafs
	m.merkleRoot = root.Hash
	return nil
}

// VerifyTree verify tree validates the hashes at each level of the tree and returns true if the
// resulting hash at the root of the tree matches the resulting root hash; returns false otherwise.
func (m *MerkleTree) VerifyTree() (bool, error) {
	calculatedMerkleRoot, err := m.Root.verifyNode()
	if err != nil {
		return false, err
	}

	if bytes.Compare(m.merkleRoot, calculatedMerkleRoot) == 0 {
		return true, nil
	}
	return false, nil
}

// VerifyContent indicates whether a given content is in the tree and the hashes are valid for that content.
// Returns true if the expected Merkle Root is equivalent to the Merkle root calculated on the critical path
// for a given content. Returns true if valid and false otherwise.
func (m *MerkleTree) VerifyContent(content Content) (bool, error) {
	for _, l := range m.Leafs {
		ok, err := l.C.Equals(content)
		if err != nil {
			return false, err
		}

		if ok {
			currentParent := l.Parent
			for currentParent != nil {
				h := m.hashStrategy()
				rightBytes, err := currentParent.Right.calculateNodeHash()
				if err != nil {
					return false, err
				}

				leftBytes, err := currentParent.Left.calculateNodeHash()
				if err != nil {
					return false, err
				}

				if _, err := h.Write(append(leftBytes, rightBytes...)); err != nil {
					return false, err
				}
				if bytes.Compare(h.Sum(nil), currentParent.Hash) != 0 {
					return false, nil
				}
				currentParent = currentParent.Parent
			}
			return true, nil
		}
	}
	return false, nil
}

// String returns a string representation of the node.
func (n *Node) String() string {
	return fmt.Sprintf("%t %t %v %s", n.leaf, n.dup, n.Hash, n.C)
}

// String returns a string representation of the tree. Only leaf nodes are included
// in the output.
func (m *MerkleTree) String() string {
	s := ""
	for _, l := range m.Leafs {
		s += fmt.Sprint(l)
		s += "\n"
	}
	return s
}
```

```go
import (
	"errors"
	"fmt"

	"github.com/ethereum/go-ethereum/common/hexutil"
	"golang.org/x/crypto/sha3"
)

type Address string

// CalculateHash hashes the values of a TestContent
func (s Address) CalculateHash() ([]byte, error) {
	hx, e := hexutil.Decode(string(s))
	if e != nil {
		return []byte{}, e
	}
	h := sha3.NewLegacyKeccak256()
	if _, err := h.Write(hx); err != nil {
		return nil, err
	}

	return h.Sum(nil), nil
}

// Equals tests for equality of two Contents
func (s Address) Equals(other Content) (bool, error) {
	return s == other.(Address), nil
}

func GetProof(address string, addresses []string) ([]string, error) {
	t, err := buildTree(addresses)
	if err != nil {
		return nil, err
	}
	path, _, err := t.GetMerklePath(Address(address))
	if err != nil {
		return []string{}, err
	}
	ret := make([]string, 0)
	for _, v := range path {
		ret = append(ret, fmt.Sprintf("0x%x", v))
	}
	return ret, nil
}

func GetRoot(addresses []string) (string, error) {
	t, err := buildTree(addresses)
	if err != nil {
		return "", err
	}

	root := t.MerkleRoot()

	return fmt.Sprintf("0x%x", root), nil
}

func buildTree(addresses []string) (*MerkleTree, error) {
	if len(addresses) == 0 {
		return nil, errors.New("no length")
	}

	if len(addresses) > 100000 {
		return nil, errors.New("size too large")
	}

	var list []Content
	for _, v := range addresses {
		list = append(list, Address(v))
	}

	t, err := NewTreeWithHashStrategy(list, sha3.NewLegacyKeccak256)
	if err != nil {
		return t, err
	}

	return t, nil
}
```

```go
import (
	"reflect"
	"testing"
)

func TestGetRoot(t *testing.T) {
	type args struct {
		addresses []string
	}
	tests := []struct {
		name    string
		args    args
		want    string
		wantErr error
	}{
		{
			name: "OK",
			args: args{
				addresses: []string{
					"0xe01511d7333A18e969758BBdC9C7f50CcF30160A",
					"0x62d17DE1fbDF36597F12F19717C39985A921426e",
					"0x6F702345360D6D8533d2362eC834bf5f1aB63910",
				},
			},
			want:    "0x9593ef2d207a3738fb385a662acab9077e8ea343fa0867400bbfa5539350b46c",
			wantErr: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetRoot(tt.args.addresses)
			if err != tt.wantErr {
				t.Errorf("GetRoot() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("GetRoot() got = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestGetProof(t *testing.T) {
	type args struct {
		address   string
		addresses []string
	}
	tests := []struct {
		name    string
		args    args
		want    []string
		wantErr error
	}{
		{
			name: "OK",
			args: args{
				addresses: []string{
					"0xe01511d7333A18e969758BBdC9C7f50CcF30160A",
					"0x62d17DE1fbDF36597F12F19717C39985A921426e",
					"0x6F702345360D6D8533d2362eC834bf5f1aB63910",
				},
				address: "0xe01511d7333A18e969758BBdC9C7f50CcF30160A",
			},
			want: []string{
				"0xea3a488603068aaf2632f108365edcd62563e193024c6af02b498c8b9b9a2120",
				"0x28d889ab829c62f3fddd900df2440f7766be4278537d601a0d6a5949963f5374",
			},
			wantErr: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := GetProof(tt.args.address, tt.args.addresses)
			if err != tt.wantErr {
				t.Errorf("GetProof() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("GetProof() got = %v, want %v", got, tt.want)
			}
		})
	}
}
```

### 空投
