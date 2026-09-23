// 公开网页和钉钉工作台共用一个地址。浏览器里打不开钉钉免登，
// 没有邀请时要告诉对方去找邀请链接，而不是让人改去工作台。
export function bareEntryCode(userAgent) {
  return /DingTalk/i.test(userAgent || '') ? null : 'INVITE_REQUIRED';
}
