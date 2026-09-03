# mindbridge-janitor

保留期清理的定时驱动。Cloudflare Pages 不支持 Cron 触发器，因此单独用一个 Worker。

它**不绑定任何数据库**，只调用 `mindbridge-app` 的 `/api/internal/retention`，
保证保留规则只有一份实现。

## 部署

```bash
npx wrangler deploy
npx wrangler secret put INTERNAL_SERVICE_TOKEN   # 必须与 mindbridge-app 一致
```

## 验收

```bash
# 试运行，不删数据
curl -H "Authorization: Bearer $TOKEN" https://mindbridge-app-8j6.pages.dev/api/internal/retention

# 手动触发一次真实清理
curl -H "Authorization: Bearer $TOKEN" https://mindbridge-janitor.<账号子域>.workers.dev
```

Cron 为每日 03:17 UTC。
