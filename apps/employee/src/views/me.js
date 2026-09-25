import { api, ApiError } from '../api.js';
import { cached, refresh } from '../store.js';
import { BUILD_ID } from '../build-id.js';
import { clear, closeSheet, confirmSheet, el, openSheet, timeAgo, toast } from '../dom.js';

export const CONTEXT_LABELS = {
  none: '未选择',
  highIntensity: '高强度岗位员工',
  manager: '中基层管理者',
  newcomer: '新入职员工',
  returner: '女性返岗员工',
  techTransition: '面临技术焦虑 / 转型',
  crossCulture: '跨文化 / 国际员工',
};

let root;
let state = { contextTag: 'none' };
let data = {
  resources: [], retentionDays: 180, appointments: [], healerReferralEnabled: false, consents: [], authorizations: [],
};
let hydrated = false;
let entryChannel = 'dingtalk';
// 内部测试期间员工端不再显示原文研究告知，该标记仅保留作兼容，后端导出仍以
// organization_capabilities 为准。参与者知情由线下方式覆盖。

export function setPrivacyEntryChannel(channel, _transcriptEnabled = false) {
  entryChannel = channel === 'beta_web' ? 'beta_web' : 'dingtalk';
}

// 标签平铺在一级页面，等于把「面临技术焦虑/转型」这类身份常驻在屏幕上，
// 每次进来提醒一遍自己被归了哪一类，还可能被旁边的人瞥见。
// 只显示当前值，选择放进弹层。
function contextRow(reload) {
  return el('div', { class: 'context-row' }, [
    el('span', { class: 'context-pill', text: CONTEXT_LABELS[state.contextTag] || '未选择' }),
    el('button', {
      class: 'link', text: '修改', attrs: { type: 'button' },
      on: { click: () => openSheet('选择你的处境', [
        el('p', { class: 'panel-sub', text: '选填，仅用于调整助手的回应方式，不影响风险判定。' }),
        contextPicker(reload),
      ]) },
    }),
  ]);
}

function contextPicker(reload) {
  return el('div', { class: 'chip-row' }, Object.entries(CONTEXT_LABELS).map(([tag, label]) => el('button', {
    class: `chip${state.contextTag === tag ? ' on' : ''}`,
    text: label,
    attrs: { type: 'button', 'aria-pressed': state.contextTag === tag },
    on: {
      click: async () => {
        try {
          await api.setContext(tag);
          state.contextTag = tag;
          closeSheet();
          reload(true);
          toast('已更新，仅影响回应的措辞，不改变风险判定。');
        } catch {
          toast('更新失败，请稍后再试。');
        }
      },
    },
  })));
}

// 二次授权请求：疗愈师想看对话上下文时，只有员工本人在这里点同意才会放行。
function authorizationPanel(reload) {
  const pending = data.authorizations.filter((r) => r.status === 'pending');
  if (!pending.length) return null;
  return el('section', { class: 'panel urgent' }, [
    el('h2', { text: '心理疗愈师申请查阅倾诉记录' }),
    el('p', { class: 'panel-sub', text: '拒绝不影响继续使用，疗愈师仍可在不查阅原文的情况下提供支持。' }),
    ...pending.map((item) => el('div', { class: 'auth-request' }, [
      el('p', { class: 'auth-reason', text: item.reason }),
      el('p', { class: 'res-meta', text: `个案 ${item.caseCode} · ${timeAgo(item.at)}` }),
      el('div', { class: 'card-actions' }, [
        el('button', {
          class: 'primary small', text: '同意查看', attrs: { type: 'button' },
          on: {
            click: async () => {
              try { await api.decideAuthorization(item.id, true); toast('已同意，可随时在此撤销。'); reload(true); }
              catch { toast('操作失败，请稍后再试。'); }
            },
          },
        }),
        el('button', {
          class: 'secondary small', text: '不同意', attrs: { type: 'button' },
          on: {
            click: async () => {
              try { await api.decideAuthorization(item.id, false); toast('已拒绝。'); reload(true); }
              catch { toast('操作失败，请稍后再试。'); }
            },
          },
        }),
      ]),
    ])),
  ]);
}

const STATUS_LABEL = {
  requested: '等待响应',
  claimed: '处理中',
  active: '疗愈师正在跟进',
  done: '已结束',
  closed: '已结束',
  cancelled: '已取消',
};

function appointmentPanel(reload) {
  const hasOpenAppointment = data.appointments.some((item) => ['requested', 'claimed', 'active'].includes(item.status));
  return el('section', { class: 'panel' }, [
    el('h2', { text: '我的预约' }),
    el('p', { class: 'panel-sub', text: '疗愈师仅能看到个案编号与风险级别，看不到你的身份；查阅对话内容需另行征得你的同意。' }),
    data.appointments.length
      ? el('ul', { class: 'apt-list' }, data.appointments.map((item) => el('li', {}, [
        el('div', {}, [
          el('span', { class: 'apt-code', text: item.caseCode }),
          el('span', { class: 'apt-status', text: STATUS_LABEL[item.status] || '状态待确认' }),
        ]),
        el('span', { class: 'res-meta', text: timeAgo(item.at) }),
        ['requested', 'claimed', 'active'].includes(item.status) ? el('button', {
          class: 'link danger', text: '取消', attrs: { type: 'button' },
          on: {
            click: async () => {
              if (!await confirmSheet('取消本次预约？', '已授权的对话查阅权限将一并撤销。', { confirmLabel: '取消预约', cancelLabel: '保留' })) return;
              try { await api.cancelAppointment(item.id); reload(true); } catch { toast('取消失败，请稍后再试。'); }
            },
          },
        }) : null,
      ])))
      : el('p', { class: 'empty', text: data.healerReferralEnabled ? '暂无预约。' : '疗愈师预约暂未开放。' }),
    data.healerReferralEnabled && !hasOpenAppointment ? el('button', {
      class: 'secondary', text: '我想预约一位疗愈师', attrs: { type: 'button' },
      on: {
        click: async (event) => {
          const button = event.currentTarget;
          button.disabled = true;
          try {
            const result = await api.requestAppointment({ riskLevel: 'red', shareContext: false });
            toast(`已提交，个案编号 ${result.caseCode}。`);
            reload(true);
          } catch (error) {
            button.disabled = false;
            toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交失败，请稍后再试。');
          }
        },
      },
    }) : el('p', { class: 'panel-sub', text: '本次预约结束后，可再次预约。' }),
  ]);
}

// 授权开关是这个产品里风险最高的一个控件：它决定疗愈师能不能看到对话原文。
// 因此这里不做乐观更新——服务端确认之前，界面上的状态一律保持原样。
//
// 特别是超时：超时不是失败的证明，服务端可能已经写入。此时既不能显示成功，
// 也不能本地取反假装没生效，唯一如实的做法是回服务端拿一次真实值。
function consentPanel(reload) {
  return el('section', { class: 'panel' }, [
    el('h2', { text: '我的授权' }),
    el('p', { class: 'panel-sub', text: '默认全部关闭，可随时开启或撤销，撤销立即生效。' }),
    el('div', { class: 'consent-list' }, data.consents.map((item) => {
      const box = el('input', { attrs: { type: 'checkbox' } });
      box.checked = item.granted;
      const status = el('span', { class: 'consent-status', text: '' });

      box.addEventListener('change', async () => {
        const wanted = box.checked;
        // 浏览器已经先把勾选框翻过去了。先扳回服务端已知的值：
        // 在拿到确认之前，界面不能替服务端宣布结果。
        box.checked = item.granted;
        box.disabled = true;
        status.textContent = '处理中';
        try {
          await api.setConsent(item.scope, wanted);
          toast(wanted ? '已授权。' : '已撤销。');
          reload(true);
        } catch (error) {
          const code = error instanceof ApiError ? error.code : '';
          if (code === 'SERVER_TIMEOUT' || code === 'NETWORK_ERROR') {
            // 结果未知：不猜，去服务端读回真实值再显示。
            status.textContent = '';
            box.disabled = false;
            try {
              const fresh = await api.consents();
              data.consents = fresh.consents;
              const current = fresh.consents.find((c) => c.scope === item.scope);
              toast(current && current.granted === wanted
                ? '网络异常，但本次修改已生效。'
                : '网络异常，本次修改未生效，请重试。');
              reload(true);
            } catch {
              toast('网络异常，修改是否生效暂时无法确认，请稍后回来查看当前状态。');
            }
            return;
          }
          status.textContent = '';
          box.disabled = false;
          toast('设置失败，请稍后再试。');
        }
      });

      return el('label', { class: 'consent-row' }, [
        el('span', { text: item.label }),
        status,
        box,
      ]);
    })),
  ]);
}

function privacyNodes() {
  if (entryChannel === 'beta_web') return [
    el('p', { text: '邀请制公开测试，不要求姓名、手机号或微信授权。同一浏览器以随机代号记录使用，清除浏览器数据或更换设备后无法找回原身份；邀请链接仅作入场凭证，不核验企业员工身份。' }),
    el('p', { text: '聊天仅对你本人可见。同组织的参与者可见你发布的广场内容。请勿输入本人或他人的姓名、联系方式等可识别信息。' }),
    el('p', { text: '数据始终匿名。我们不会获取你的个人信息，仅使用匿名操作记录改进产品。' }),
    el('p', { text: '同一浏览器打开其他组织的邀请链接会切换组织，各组织身份相互独立；用原链接可回到原身份，不重复占用名额。' }),
    el('p', { text: '倾诉原文默认保留 180 天，到期分批删除。预约疗愈师、分享聊天上下文均需你另行授权。' }),
    el('p', { class: 'build-id', text: `版本 ${BUILD_ID}` }),
  ];
  return [
    el('p', { text: '钉钉姓名与工号不会进入系统，登录仅用于确认在职身份，此后你仅以随机匿名代号使用。' }),
    el('p', { text: '聊天仅对你本人可见；同企业成员可见你发布的广场内容。数据始终匿名，我们不会获取你的个人信息，仅使用匿名操作记录改进产品。' }),
    el('p', { text: '公司与 HR 仅能看到多人汇总统计，看不到个人轨迹与对话原文；预约疗愈师后，对方查阅相关内容须经你本人同意。倾诉原文默认保留 180 天。' }),
    el('p', { class: 'build-id', text: `版本 ${BUILD_ID}` }),
  ];
}

function openFeedback() {
  let selected = '';
  const reasons = ['功能不好用', '回复不合适', '内容没帮助', '有改进建议'];
  const options = el('div', { class: 'feedback-quick-options' }, reasons.map((reason) => el('button', {
    class: 'secondary small', text: reason, attrs: { type: 'button', 'aria-pressed': 'false' },
    on: { click: (event) => {
      selected = selected === reason ? '' : reason;
      for (const button of options.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.textContent === selected));
      event.currentTarget.blur();
    } },
  })));
  const box = el('textarea', {
    attrs: {
      maxlength: '470',
      rows: '5',
      placeholder: '使用中遇到的问题或建议可直接写，无需留姓名或联系方式。',
      'aria-label': '反馈内容',
    },
  });
  const send = el('button', { class: 'primary', text: '提交反馈', attrs: { type: 'button' } });
  send.addEventListener('click', async () => {
    const text = box.value.trim();
    if (!text && !selected) {
      toast('请选择一项或填写内容。');
      return;
    }
    send.disabled = true;
    try {
      await api.submitSuggestion([selected, text].filter(Boolean).join('：'));
      closeSheet();
      toast('已收到，谢谢。');
    } catch (error) {
      send.disabled = false;
      toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交失败，请稍后再试。');
    }
  });
  openSheet('反馈建议', [
    el('p', { text: '提交给产品团队，全程匿名，仅用于改进产品。' }),
    el('p', { text: '选一项即可提交，也可以补充说明。' }),
    options,
    box,
    send,
  ]);
}

export function renderMe(container) {
  root = container;
}

export async function loadMe(force = false) {
  const reload = (mutated = false) => void loadMe(mutated);
  // 有缓存就先画出来，网络回来再重画一次；不要让人对着空白等一个来回。
  const snapshot = cached();
  if (snapshot) {
    apply(snapshot);
    hydrated = true;
  }
  if (hydrated) paint(reload);
  try {
    apply(await refresh(force));
    hydrated = true;
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    toast('部分信息暂时无法加载。');
  }
  paint(reload);
}

function apply(body) {
  state.contextTag = body.me.contextTag;
  data = {
    resources: body.resources,
    retentionDays: body.retentionDays,
    appointments: body.appointments,
    healerReferralEnabled: body.healerReferralEnabled === true,
    consents: body.consents,
    authorizations: body.authorizations,
  };
}

function paint(reload) {
  const body = data;

  // append(null) 会插入字面量 "null" 文本节点，这里必须过滤。
  clear(root).append(...[
    authorizationPanel(reload),
    el('section', { class: 'panel' }, [
      el('h2', { text: '我的处境标签' }),
      contextRow(reload),
    ]),
    appointmentPanel(reload),
    consentPanel(reload),
    el('section', { class: 'panel' }, [
      el('h2', { text: '反馈建议' }),
      el('p', { class: 'panel-sub', text: '使用中的问题或建议，欢迎写在这里。' }),
      el('button', {
        class: 'secondary', text: '写一条反馈', attrs: { type: 'button' },
        on: { click: () => openFeedback() },
      }),
    ]),
    el('section', { class: 'panel' }, [
      el('h2', { text: '你的数据' }),
      el('p', { class: 'panel-sub', text: `倾诉原文默认保留 ${body.retentionDays} 天，到期自动删除，全程匿名。` }),
      el('button', {
        class: 'ghost wide', text: '查看数据与隐私说明', attrs: { type: 'button' },
        on: { click: () => openSheet('关于你的隐私与数据', privacyNodes()) },
      }),
    ]),
  ].filter(Boolean));
}

export const privacySheet = () => openSheet('关于你的隐私与数据', privacyNodes());
