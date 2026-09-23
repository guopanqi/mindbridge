-- 新写入的建议正文改为密文。content_key_version 为空的旧行仍是迁移前的明文。
ALTER TABLE suggestions ADD COLUMN content_key_version TEXT;
