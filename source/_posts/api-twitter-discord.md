---
title: 【API】Twitter与Discord
categories: API
tags: [api, twitter, discord]
comments: false
toc: true
sticky: false
math: true
mermaid: true
hide: false
index_img: /images/middleware/api/index.png
banner_img: /images/img/banner.png
---

> <!-- more -->

### Twitter

Twitter接口文档：https://developer.twitter.com/en/portal/products

Twitter ID and username converter：https://tweeterid.com/

```shell
1.获取某用户的被关注用户总数：
GET /2/users/by/username/{username}?user.fields=public_metrics
```

![](/images/middleware/api/twitter1.png)

[^1]:  [How to get the Twitter followers count using Twitter API (in 2022)](https://stackoverflow.com/questions/70779246/how-to-get-the-twitter-followers-count-using-twitter-api-in-2022)
[^2]: [https://dev.to/twitterdev/getting-the-follower-count-from-twitter-api-v2-4jh6](https://dev.to/twitterdev/getting-the-follower-count-from-twitter-api-v2-4jh6)

### Discord

接口文档：https://discord.com/developers/applications

**需求：**

1. 获取某Server的总人数：GET /invites/{invite.code} ?with_count=true

2. 判断该用户是否在某Server内：GET users/@me/guilds/{guild.id}/member

3. 获取该用户在某Server内的角色：GET users/@me/guilds/{guild.id}/member

[QPS](https://discord.com/developers/docs/topics/rate-limits#global-rate-limit)：50/s

#### Discord获取用户信息实现：

**1.** 新建APP

访问[应用程序页面](https://discord.com/developers/applications)，单击New Application来设置新应用，并在弹窗中输入应用的名称。

![](/images/middleware/api/discord1.png)

**2.** 设置API身份验证

*这里使用**OAuth2**对用户进行身份验证；*

获取Client ID、Client Secret和重定向URL并保存，图中重定向URL仅用于测试。

![](/images/middleware/api/discord2.png)

这里的重定向URL之后可以设置成我们业务相关的链接，用于保存用户授权给应用的权限code

**3.** 生成应用授权链接

在我们利用DiscordAPI获取某用户相关的discord信息前，用户必须将权限授权给我们的应用程序。因此，这里需要生成授权链接。

![](/images/middleware/api/discord3.png)

根据需求，这里授权范围仅需要选择identify、guilds、guilds members read，并选择刚才设置的重定向URL。最后拷贝生成的授权URL，并在浏览器中打开，会出现以下界面。

![](/images/middleware/api/discord4.png)

从上面的页面单击授权会将用户重定向到我们在上一步中指定的重定向 URL。但是，URL 中会有一些额外的查询字符串。如果授权成功，URL 应该看起来像这样链接：

```shell
http://localhost/discord/redirect?code=lMBUR80fgEpTS9w3umTJRMaB5XzKZ9
```

记下code参数的值，这是y3pnUdjLc0jWebnyK0zwwbbRaaiXki用于上述示例的。另请注意，此值对于每个会话都是唯一的。在下一步中，我们将使用code来检索用户授权token。

**4.** 为用户请求授权令牌

为了获得授权令牌，我们需要向以下端点发出 HTTP 请求：https://discord.com/api/oauth2/token。将上一步获得的code生成访问token。本示例使用 Postman 发出所有请求，以下是请求的配置：

**Request type:** POST, **Content-type:** x-www-form-urlencoded **Body:**

•     client_id: "第二步获得的ClientID"

•     client_secret: "第二步获得的ClientSecret"

•     grant_type: "authorization_code"

•     code: ""第三步获得的code"

•     redirect_uri: "http://localhost/discord/redirect"

参考Postman请求如图：

![](/images/middleware/api/discord5.png)

如果请求成功，会获得如下响应，接下来则可以利用access_token调用第三步授权范围内的API来获取用户的相关信息，实现需求内容。

```json
 {
    "access_token": "z4HhmDy5ghijpIRL1YFzhCeVFabcdef",
    "expires_in": 604800,
    "refresh_token": "5luvWWWACKJmsQS3HJUcYew5oxyzk",
    "scope": "guilds.members.read guilds identify",
    "token_type": "Bearer"
}
```

**5.** 调用示例

![](/images/middleware/api/discord6.png)

设置授权token，发送如下请求，可获取授权用户加入的所有服务器信息。

![](/images/middleware/api/discord7.png)

[^3]: [https://discordapi.com/unofficial/comparison.html](https://discordapi.com/unofficial/comparison.html)
[^4]: [https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html](https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)

