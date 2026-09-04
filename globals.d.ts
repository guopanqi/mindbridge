// 构建期与宿主环境注入的全局，源码里没有声明，类型检查需要知道它们存在。
declare const __BUILD_ID__: string;

interface Window {
  // 钉钉 WebView 由 vendor/dingtalk-auth.js 注入。
  requestDingTalkAuthCode?: (options: { clientId: string; corpId: string }) => Promise<{ code: string }>;
  visualViewport?: VisualViewport;
}
