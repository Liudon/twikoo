# Twikoo 2.0.7 + Jev Netlify 验证

本分支基于官方 `2.0.7` tag，仅加入 Jev 反垃圾支持和验证用 Netlify 入口，不依赖 npm 上发布的 `twikoo-netlify@2.0.7`。

## Netlify 项目

新建一个独立的 Netlify Project：

- Repository: `Liudon/twikoo`
- Branch: `test/jev-netlify-2.0.7`
- Base directory: 留空
- Build command / Publish directory / Functions directory: 使用仓库中的 `netlify.toml`

不要复用生产站的 MongoDB。至少使用一个独立数据库名，例如：

```text
MONGODB_URI=mongodb+srv://.../twikoo-jev-test
```

在 Netlify UI 增加：

```text
AWS_LAMBDA_JS_RUNTIME=nodejs22.x
```

源码仓库的 2.0.7 monorepo 构建工具链要求 Node 26，因此 `netlify.toml` 用 Node 26 完成依赖安装和打包；函数运行时单独固定为 Node 22，以贴近现有生产环境。

## 打开验证页

部署成功后访问：

```text
https://<your-netlify-site>.netlify.app/test.html
```

构建时会先编译 `twikoo-netlify` 及其 workspace 依赖，再生成本分支的 `packages/client/dist/twikoo.min.js`。Netlify Function 使用编译后的适配器，测试页面使用编译后的客户端，因此后端和管理端都包含 Jev 改动；页面把当前 Netlify Site 根地址作为 `envId`。

首次进入管理面板后，在「反垃圾」中配置：

```text
JEV_API_KEY=<your key>
JEV_API_ENDPOINT=https://api.typesafe.ai/v1/systemone
JEV_MODEL=jev-latest
JEV_SPAM_THRESHOLD=0.9
```

首次验证建议清空：

```text
QCLOUD_SECRET_ID
QCLOUD_SECRET_KEY
AKISMET_KEY
LLM_API_KEY
```

这样可以确保实际走 Jev。

## 建议用例

正常评论：

```text
文章写得不错，这个 CORS 问题我之前也遇到过。
```

明显广告：

```text
专业网站建设、SEO 优化，价格优惠，联系 example.com
```

软广告：

```text
正文：文章写得很好！
昵称：SEO Agency
网址：https://example-seo.com
```

Netlify Function 日志应出现类似：

```text
Jev 判定为 SPAM (score=0.9342, threshold=0.9, model="...")
```

或：

```text
Jev 判定为 HAM (score=0.1837, threshold=0.9, model="...")
```

Jev 请求失败或返回格式异常时，`postCheckSpam` 沿用 Twikoo 的失败放行策略，不会把评论误标为垃圾。

## 优先级验证

同时配置：

```text
JEV_API_KEY
LLM_API_KEY
```

发表评论后应只看到 Jev 检测日志，验证当前互斥顺序：

```text
Tencent TMS → Akismet → Jev → LLM
```
