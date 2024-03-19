---
title: 【Go】Etherscan交易详情页面
categories: 爬虫
tags: [crawler,爬虫,chromedp,goquery]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/crawler/index.png
banner_img: /images/img/banner.png
---

### 背景

爬取etherscan交易详情页面的数据。<!--more-->

### 工具选择

#### 页面数据抓取

##### 直接获取

```go
type Client struct {
	*http.Client
}

type TxTransaction struct {
	*network.Client
	proxy  []string
}

func (c *TxTransaction) newClient() *network.Client {
	client := c.Client
	if len(c.proxy) > 0 {
		rand.Seed(time.Now().UnixNano())
		// 随机获取切片中的元素
		randIndex := rand.Intn(len(c.proxy))
		u, _ := url.Parse(c.proxy[randIndex])
		transport := &http.Transport{
			Proxy: http.ProxyURL(u),
		}

		client = &network.Client{
			Client: &http.Client{
				Transport: transport,
			}}
	}

	return client
}

func (c *TxTransaction) crawlDirect(ctx context.Context, txHash string) ([]byte, error) {
	client := c.newClient()
	head := map[string]string{"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"}
	req, err := client.GetRequest(http.MethodGet, fmt.Sprintf("https://etherscan.io/tx/%s", txHash), head, nil)
	if err != nil {
		return nil, err
	}
	resp, body, err := client.GetResponse(req)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != 200 {
		return nil, errors.Errorf("TxTransaction status code: %d, error: %s", resp.StatusCode, resp.Status)
	}

	return body, nil
}
```

##### chromedp

后面发现，有些数据是`js`动态生成的，于是换成[chromedp](https://github.com/chromedp/chromedp)动态抓取数据。`chromedp`是一种以更快、更简单的方式来驱动浏览器支持 Go 中的[Chrome DevTools 协议](https://chromedevtools.github.io/devtools-protocol/)，而无需外部依赖。

```go
func (c *TxTransaction) crawlByChromeDp(ctx context.Context, txHash string) ([]byte, error) {
	rand.Seed(time.Now().UnixNano())
	randIndex := rand.Intn(len(c.proxy))
	opts := []chromedp.ExecAllocatorOption{
		chromedp.Flag("headless", true), // 本地调试阶段,可以设置为false 服务器上一定要设置为true
		chromedp.WindowSize(1600, 1024),
		chromedp.UserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"),
		chromedp.ProxyServer(c.proxy[randIndex]),
	}
	opts = append(chromedp.DefaultExecAllocatorOptions[:], opts...)

	allocCtx, cancel := chromedp.NewExecAllocator(ctx, opts...)
	defer cancel()
	// 创建一个新的 Chrome 实例
	chromeCtx, cancel := chromedp.NewContext(allocCtx,
		chromedp.WithLogf(log.Printf),
	)
	defer cancel()

	// chromeCtx, cancel = context.WithTimeout(chromeCtx, 10*time.Second)
	// defer cancel()

	// 访问目标网页
	err := chromedp.Run(chromeCtx,
		chromedp.Navigate(fmt.Sprintf("https://etherscan.io/tx/%s", txHash)),
		chromedp.WaitVisible("#content", chromedp.ByID),
	)
	if err != nil {
		return nil, errors.Wrap(err, "chromedp.WaitVisible(#content, chromedp.ByID)")
	}

	err = chromedp.Run(chromeCtx,
		chromedp.Click("#ContentPlaceHolder1_collapsedLink", chromedp.ByID),
	)
	if err != nil {
		return nil, errors.Wrap(err, "Click(#ContentPlaceHolder1_collapsedLink, chromedp.ByID)")
	}

	nodes := make([]*cdp.Node, 0)
	err = chromedp.Run(chromeCtx, chromedp.Nodes("#ContentPlaceHolder1_btnDecodetab", &nodes, chromedp.ByID))
	if err != nil {
		return nil, errors.Wrap(err, "chromedp.Nodes(#ContentPlaceHolder1_btnDecodetab, &nodes, chromedp.ByID)")
	}

	if len(nodes) > 0 {
		// 向上滚动页面 200 像素的距离
		err = chromedp.Run(chromeCtx,
			chromedp.EvaluateAsDevTools(`window.scrollBy(0, 200);`, nil))
		if err != nil {
			return nil, errors.Wrap(err, "chromedp.EvaluateAsDevTools(`window.scrollBy(0, 200);`, nil)")
		}

		// 模拟点击事件
		err = chromedp.Run(chromeCtx,
			chromedp.Sleep(1*time.Second),
			chromedp.Click("#ContentPlaceHolder1_btnDecodetab", chromedp.ByID),
		)
		if err != nil {
			return nil, errors.Wrap(err, "chromedp.Click(#ContentPlaceHolder1_btnDecodetab, chromedp.ByID)")
		}

		err = chromedp.Run(chromeCtx,
			chromedp.WaitVisible("#inputDecode", chromedp.ByID),
		)

		if err != nil {
			return nil, errors.Wrap(err, "chromedp.WaitVisible(#inputDecode, chromedp.ByID)")
		}
	}

	// 解析页面并查找目标数据
	var html string
	err = chromedp.Run(chromeCtx,
		chromedp.OuterHTML("html", &html, chromedp.ByQuery),
		chromedp.Sleep(1*time.Second),
	)

	return []byte(html), err
}
```

##### 镜像

[chromedp/headless-shell](https://hub.docker.com/r/chromedp/headless-shell/)

#### 页面解析

##### goquery

[goquery](https://github.com/PuerkitoBio/goquery)为Go 语言带来了类似jQuery 语法的工具包。它基于 Go 的[net/html 包](https://pkg.go.dev/golang.org/x/net/html)和 CSS 选择器包[cascadia](https://github.com/andybalholm/cascadia)。在语法方面，它尽可能接近 jQuery，尽可能使用相同的函数名称。

因为 net/html 解析器需要 UTF-8 编码，所以 goquery 也是如此。处理非 UTF8 html 页面，可参阅[wiki](https://github.com/PuerkitoBio/goquery/wiki/Tips-and-tricks)。

页面数据解析

```go
type TxDetail struct {
	TransactionNote   string            `json:"TransactionNote,omitempty"`
	TxnType           string            `json:"TxnType"`
	From              string            `json:"From"`
	To                string            `json:"To,omitempty"`
	InteractedWith    string            `json:"InteractedWith,omitempty"`
	Value             string            `json:"Value"`
	Status            string            `json:"Status"`
	TransactionAction string            `json:"Transaction Action,omitempty"`
	ERC20Transfer     string            `json:"ERC20Transfer,omitempty"`
	ERC721Transfer    string            `json:"ERC721Transfer,omitempty"`
	ERC1155Transfer   string            `json:"ERC1155Transfer,omitempty"`
	TransactionFee    string            `json:"TransactionFee"`
	Gas               string            `json:"Gas"`
	InputData         string            `json:"InputData"`
	Nonce             string            `json:"Nonce"`
	PositionInBlock   string            `json:"PositionInBlock"`
	TimeStamp         string            `json:"TimeStamp,omitempty"`
	ContractName      string            `json:"Contract name,omitempty"`
	ETHTransfer       string            `json:"ETHTransfer,omitempty"`
	Labels            map[string]string `json:"Labels"`
	FunctionPrototype string            `json:"FunctionPrototype,omitempty"`
}

func (c *TxTransaction) wash(ctx context.Context, data io.Reader) (TxDetail, int64, error) {
	doc, err := goquery.NewDocumentFromReader(data)
	if err != nil {
		return TxDetail{}, 0, err
	}

	txType := TxTransfer
	doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-3").Each(func(i int, s *goquery.Selection) {
		key := s.Text()
		key = strings.ReplaceAll(key, "\n", "")
		key = strings.TrimLeft(key, " ")
		key = strings.TrimRight(key, " ")
		if strings.EqualFold(key, tot) {
			doc.Find("i.far").Each(func(j int, ss *goquery.Selection) {
				if val, ok := ss.Attr("aria-label"); ok && strings.Contains(val, "Contract") {
					txType = TxContract
				}
			})

			if txType == TxContract {
				doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-9").Each(func(k int, ss *goquery.Selection) {
					if strings.Contains(ss.Text(), "Created") {
						txType = TxContractCreated
					}
				})
			}
		}

		if strings.EqualFold(key, to) {
			txType = TxContract
		}
	})

	keyTmp := make(map[int]string)
	doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-3").Each(func(i int, s *goquery.Selection) {
		key := s.Text()
		key = strings.ReplaceAll(key, "\n", "")
		key = strings.TrimLeft(key, " ")
		key = strings.TrimRight(key, " ")
		if index, ok := KeyMap[key]; ok && index > 0 {
			keyTmp[i] = key
		}

		if strings.Contains(key, erc20) || strings.Contains(key, erc721) || strings.Contains(key, erc1155) {
			v := strings.Split(key, ":")
			if len(v) == 2 {
				key = strings.TrimRight(v[0], " ") + ":"

			}
			keyTmp[i] = key
		}
	})

	result := TxDetail{}
	labelMap := make(map[string]string)
	switch txType {
	case TxTransfer:
		doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-9").Each(func(i int, s *goquery.Selection) {
			val := s.Text()
			if key, ok := keyTmp[i]; ok {
				// 1.status
				if strings.EqualFold(key, status) {
					result.Status = val
				}

				// 3.Timestamp
				if strings.EqualFold(key, timestamp) {
					result.TimeStamp = c.getTimestamp(val)
				}

				// 6.From
				if strings.EqualFold(key, from) {
					result.From = c.getFrom(val)
				}

				// 7.To
				if strings.EqualFold(key, tot) {
					toVal, _ := c.getInteractedWithTo(val)
					result.To = toVal
				}

				// 9.Value
				if strings.EqualFold(key, value) {
					result.Value = c.getValueOrTransactionFee(val)
				}

				// 10.TxTransaction Fee
				if strings.EqualFold(key, transactionFee) {
					result.TransactionFee = c.getValueOrTransactionFee(val)
				}

				// 11.Gas Limit & Usage by Txn
				if strings.EqualFold(key, gas) {
					result.Gas = c.getGas(val)
				}

				if strings.EqualFold(key, otherAttributes) {
					v := strings.Split(val, "\n")
					for _, kv := range v {
						if len(kv) > 0 {
							kAndV := strings.Split(kv, ":")
							if len(kAndV) == 2 {
								vv := kAndV[1]
								index := strings.Index(vv, "(")
								if index > 0 {
									vv = vv[:index]
								}

								vv = strings.TrimSpace(vv)
								if strings.Contains(kAndV[0], "Txn Type") {
									result.TxnType = vv
								}
								if strings.Contains(kAndV[0], "Nonce") {
									result.Nonce = vv
								}
								if strings.Contains(kAndV[0], "Position In Block") {
									result.PositionInBlock = vv
								}
							}
						}
					}
				}

			}
		})

		// 15.Input
		inputData := doc.Find("#ContentPlaceHolder1_maintable").Find("#inputdata").Text()
		if strings.HasPrefix(inputData, "0x") && len(inputData) > 2 {
			inputBytes, err := hex.DecodeString(inputData[2:])
			if err == nil {
				inputString := string(inputBytes)
				if utf8.ValidString(inputString) {
					inputData = inputString
					result.InputData = inputData
				}
			}
		}
	case TxContract:
		doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-9").Each(func(i int, s *goquery.Selection) {
			val := s.Text()
			if key, ok := keyTmp[i]; ok {
				// 1.status
				if strings.EqualFold(key, status) {
					result.Status = val
				}

				// 3.Timestamp
				if strings.EqualFold(key, timestamp) {
					result.TimeStamp = c.getTimestamp(val)
				}

				// 4.TxTransaction Action
				if strings.EqualFold(key, transactionAction) {
					result.TransactionAction = c.getTransactionAction(val)
				}

				// 6.From
				if strings.EqualFold(key, from) {
					result.From = c.getFrom(val)
					label := c.getLabels(val)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}

				// 7.To
				if strings.EqualFold(key, to) {
					toVal, ethTransfer := c.getInteractedWithTo(val)
					result.InteractedWith = toVal

					label := c.getLabels(toVal)
					for _, addr := range label {
						labelMap[addr] = ""
					}

					if ethTransfer != "" {
						result.ETHTransfer = ethTransfer
					}

					label = c.getLabels(ethTransfer)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}

				if strings.EqualFold(key, tot) {
					toVal, _ := c.getInteractedWithTo(val)
					result.To = toVal

					label := c.getLabels(toVal)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}

				// 8.ERC-20/721/1155
				if strings.EqualFold(key, erc20) {
					result.ERC20Transfer = c.getERC20(val)

					label := c.getLabels(val)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}
				if strings.Contains(key, erc721) {
					result.ERC721Transfer = c.getERC721(val)

					label := c.getLabels(val)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}
				if strings.Contains(key, erc1155) {
					result.ERC1155Transfer = c.getERC1155(val)

					label := c.getLabels(val)
					for _, addr := range label {
						labelMap[addr] = ""
					}
				}

				// 9.Value
				if strings.EqualFold(key, value) {
					result.Value = c.getValueOrTransactionFee(val)
				}

				// 10.TxTransaction Fee
				if strings.EqualFold(key, transactionFee) {
					result.TransactionFee = c.getValueOrTransactionFee(val)
				}

				// 11.Gas Limit & Usage by Txn
				if strings.EqualFold(key, gas) {
					result.Gas = c.getGas(val)
				}

				if strings.EqualFold(key, otherAttributes) {
					v := strings.Split(val, "\n")
					for _, kv := range v {
						if len(kv) > 0 {
							kAndV := strings.Split(kv, ":")
							if len(kAndV) == 2 {
								vv := kAndV[1]
								index := strings.Index(vv, "(")
								if index > 0 {
									vv = vv[:index]
								}

								vv = strings.TrimSpace(vv)
								if strings.Contains(kAndV[0], "Txn Type") {
									result.TxnType = vv
								}
								if strings.Contains(kAndV[0], "Nonce") {
									result.Nonce = vv
								}
								if strings.Contains(kAndV[0], "Position In Block") {
									result.PositionInBlock = vv
								}
							}
						}
					}
				}

			}
		})
		// 15.Input
		inputOrigin := doc.Find("#ContentPlaceHolder1_maintable").Find("#inputdata").Text()
		split := strings.Split(inputOrigin, "\n")
		if len(split) > 0 && (strings.Contains(inputOrigin, "Function") || strings.Contains(inputOrigin, "MethodID")) {
			inputDecode := ""
			for _, v := range split {
				if strings.Contains(v, "Function") || strings.Contains(v, "MethodID") {
					inputDecode += v + "\n"
				}
			}

			doc.Find("#ContentPlaceHolder1_maintable").Find("#inputDecode").Find("table").Find("tr").Each(func(i int, s *goquery.Selection) {
				if len(s.Text()) > 0 {
					s.Find("th,td").Each(func(j int, td *goquery.Selection) {
						if j > 0 {
							inputDecode += td.Text() + " "
						}
					})
					inputDecode += "\n"
				}
			})

			if len(inputDecode) > 0 {
				inputDecode = strings.TrimRight(inputDecode, "\n")
				result.InputData = inputDecode
			}
		} else {
			inputOrigin = strings.TrimLeft(inputOrigin, "\n")
			inputOrigin = strings.TrimRight(inputOrigin, "\n")
			if len(inputOrigin) > 0 {
				result.InputData = inputOrigin
			}
		}

		label := c.getLabels(result.InputData)
		for _, addr := range label {
			labelMap[addr] = ""
		}

		// TxnType
		doc.Find(".container-xxl").Each(func(i int, s *goquery.Selection) {
			text := s.Text()
			if strings.Contains(text, "Transaction Details") {
				s.Find(".mt-2").Each(func(j int, sm *goquery.Selection) {
					if j == 0 {
						sm.Find(".text-truncate").Each(func(k int, ss *goquery.Selection) {
							result.TransactionNote = result.TransactionNote + fmt.Sprintf("%s;", ss.Text())
						})
					}
				})
			}
		})

		if len(labelMap) > 0 {
			result.Labels = labelMap
		}
	case TxContractCreated:
		doc.Find("#ContentPlaceHolder1_maintable").Find(".col-md-9").Each(func(i int, s *goquery.Selection) {
			val := s.Text()
			if key, ok := keyTmp[i]; ok {
				// 1.status
				if strings.EqualFold(key, status) {
					result.Status = val
				}

				// 3.Timestamp
				if strings.EqualFold(key, timestamp) {
					result.TimeStamp = c.getTimestamp(val)
				}

				// 6.From
				if strings.EqualFold(key, from) {
					result.From = c.getFrom(val)
				}

				// 7.To
				if strings.EqualFold(key, tot) {
					result.To = c.getToCreatedContract(val)
				}

				// 9.Value
				if strings.EqualFold(key, value) {
					result.Value = c.getValueOrTransactionFee(val)
				}

				// 10.TxTransaction Fee
				if strings.EqualFold(key, transactionFee) {
					result.TransactionFee = c.getValueOrTransactionFee(val)
				}

				// 11.Gas Limit & Usage by Txn
				if strings.EqualFold(key, gas) {
					result.Gas = c.getGas(val)
				}

				if strings.EqualFold(key, otherAttributes) {
					v := strings.Split(val, "\n")
					for _, kv := range v {
						if len(kv) > 0 {
							kAndV := strings.Split(kv, ":")
							if len(kAndV) == 2 {
								vv := kAndV[1]
								index := strings.Index(vv, "(")
								if index > 0 {
									vv = vv[:index]
								}

								vv = strings.TrimSpace(vv)
								if strings.Contains(kAndV[0], "Txn Type") {
									result.TxnType = vv
								}
								if strings.Contains(kAndV[0], "Nonce") {
									result.Nonce = vv
								}
								if strings.Contains(kAndV[0], "Position In Block") {
									result.PositionInBlock = vv
								}
							}
						}
					}
				}
			}
		})
	}

	return result, int64(txType), nil
}
```

