// Fail closed: the former INSERT OR REPLACE seed can overwrite HR configuration.
console.error('旧活动 seed 已停用。请运行 node scripts/import-activities.mjs --check；然后 --local 或 --remote 预览，确认后加 --apply 导入。');
process.exitCode = 1;
