-- 推荐记录要能说明「为什么推给你」：理由在推荐当时就固定下来，
-- 不在展示时重新推断，否则事后改配置会让历史推荐显示出从未发生过的理由。
ALTER TABLE resource_events ADD COLUMN offer_reason TEXT;
