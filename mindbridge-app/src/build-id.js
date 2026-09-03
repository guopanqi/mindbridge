// __BUILD_ID__ 由 scripts/build-app.mjs 在打包时注入。
export const BUILD_ID = typeof __BUILD_ID__ === 'undefined' ? 'dev' : __BUILD_ID__;
