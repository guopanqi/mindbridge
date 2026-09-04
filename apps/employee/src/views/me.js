import { api, ApiError } from '../api.js';
import { BUILD_ID } from '../build-id.js';
import { clear, closeSheet, el, openSheet, timeAgo, toast } from '../dom.js';

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
  resources: [], retentionDays: 180, appointments: [], consents: [], authorizations: [],
};
let onClearChat = async () => {};

// 标签平铺在一级页面，等于把「面临技术焦虑/转型」这类身份常驻在屏幕上，
// 每次进来提醒一遍自己被归了哪一类，还可能被旁边的人瞥见。
// 只显示当前值，选择放进弹层。
function contextRow(reload) {
  return el('div', { class: 'context-row' }, [
    el('span', { class: 'context-pill', text: CONTEXT_LABELS[state.contextTag] || '未选择' }),
    el('button', {
      class: 'link', text: '修改', attrs: { type: 'button' },
      on: { click: () => openSheet('选择你的处境', [
        el('p', { class: 'panel-sub', text: '选填。仅用于调整助手沟通时的侧重点，不影响安全评估机制。' }),
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
          reload();
          toast('已更新。这只影响回应的措辞，不会改变风险判定。');
        } catch {
          toast('更新没有成功，请稍后再试。');
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
    el('p', { class: 'panel-sub', text: '不同意也不会影响你继续使用，疗愈师仍然可以在不查阅原文的情况下为你提供支持。' }),
    ...pending.map((item) => el('div', { class: 'auth-request' }, [
      el('p', { class: 'auth-reason', text: item.reason }),
      el('p', { class: 'res-meta', text: `个案 ${item.caseCode} · ${timeAgo(item.at)}` }),
      el('div', { class: 'card-actions' }, [
        el('button', {
          class: 'primary small', text: '同意查看', attrs: { type: 'button' },
          on: {
            click: async () => {
              try { await api.decideAuthorization(item.id, true); toast('已同意。你随时可以在这里撤销后续请求。'); reload(); }
              catch { toast('操作没有成功，请稍后再试。'); }
            },
          },
        }),
        el('button', {
          class: 'secondary small', text: '不同意', attrs: { type: 'button' },
          on: {
            click: async () => {
              try { await api.decideAuthorization(item.id, false); toast('已拒绝。'); reload(); }
              catch { toast('操作没有成功，请稍后再试。'); }
            },
          },
        }),
      ]),
    ])),
  ]);
}

const STATUS_LABEL = {
  requested: '已提交 · 等待疗愈师接单',
  claimed: '疗愈师已接单',
  active: '疗愈师正在跟进',
  done: '已闭环',
  closed: '已结束',
  cancelled: '已取消',
};

function appointmentPanel(reload) {
  const hasOpenAppointment = data.appointments.some((item) => ['requested', 'claimed', 'active'].includes(item.status));
  return el('section', { class: 'panel' }, [
    el('h2', { text: '我的预约' }),
    el('p', { class: 'panel-sub', text: '疗愈师只会看到个案编号和风险级别，看不到你是谁。要查看你的对话内容，必须单独征求你同意。' }),
    data.appointments.length
      ? el('ul', { class: 'apt-list' }, data.appointments.map((item) => el('li', {}, [
        el('div', {}, [
          el('span', { class: 'apt-code', text: item.caseCode }),
          el('span', { class: 'apt-status', text: STATUS_LABEL[item.status] || item.status }),
        ]),
        el('span', { class: 'res-meta', text: timeAgo(item.at) }),
        item.status !== 'cancelled' ? el('button', {
          class: 'link danger', text: '取消', attrs: { type: 'button' },
          on: {
            click: async () => {
              if (!window.confirm('确定取消本次预约吗？已授权的对话查阅权限将一并同步撤销。')) return;
              try { await api.cancelAppointment(item.id); reload(); } catch { toast('取消没有成功。'); }
            },
          },
        }) : null,
      ])))
      : el('p', { class: 'empty', text: '还没有预约。' }),
    !hasOpenAppointment ? el('button', {
      class: 'secondary', text: '我想预约一位疗愈师', attrs: { type: 'button' },
      on: {
        click: async (event) => {
          const button = event.currentTarget;
          button.disabled = true;
          try {
            const result = await api.requestAppointment({ riskLevel: 'yellow', shareContext: false });
            toast(`已提交，个案编号 ${result.caseCode}。`);
            reload();
          } catch (error) {
            button.disabled = false;
            toast(error instanceof ApiError && error.userMessage ? error.userMessage : '提交没有成功。');
          }
        },
      },
    }) : el('p', { class: 'panel-sub', text: '你已有一条未结束的预约，可以在上方查看进度。这次服务结束或取消后可以再次预约。' }),
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
    el('p', { class: 'panel-sub', text: '默认全部关闭。开启后随时可以撤销，撤销立即生效。' }),
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
        status.textContent = '处理中…';
        try {
          await api.setConsent(item.scope, wanted);
          toast(wanted ? '已授权。' : '已撤销。');
          reload();
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
                ? '网络中断，但这次修改已经生效。'
                : '网络中断，这次修改没有生效，请重试。');
              reload();
            } catch {
              toast('网络中断，暂时无法确认这次修改是否生效。请稍后回到这里查看当前状态。');
            }
            return;
          }
          status.textContent = '';
          box.disabled = false;
          toast('设置没有成功，请稍后再试。');
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
  return [
    el('p', { text: '你的钉钉姓名与工号不会进入系统。登录仅用于确认在职，在此之后，你全程只代表一个随机的匿名代号。' }),
    el('p', { text: '你在树洞里的倾诉与广场发帖均经加密保存，除你之外无人能直接翻看。你也可以随时在「我的」里一键清空记录。' }),
    el('p', { text: '公司与 HR 只能看到多人汇总的宏观走势，看不到任何对话原文；若预约心理疗愈师，也必须经你本人主动同意，对方才能查阅相关内容。' }),
    el('p', { class: 'build-id', text: `版本 ${BUILD_ID}` }),
  ];
}

export function renderMe(container, options = {}) {
  root = container;
  if (options.onClearChat) onClearChat = options.onClearChat;
}

export async function loadMe() {
  const reload = () => void loadMe();
  try {
    const [me, history, appointments, consents, authorizations] = await Promise.all([
      api.me(), api.history(), api.appointments(), api.consents(), api.authorizations(),
    ]);
    state.contextTag = me.contextTag;
    data = {
      ...history,
      appointments: appointments.appointments,
      consents: consents.consents,
      authorizations: authorizations.requests,
    };
  } catch (error) {
    if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') throw error;
    toast('部分信息暂时读不出来。');
  }
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
      el('h2', { text: '你的数据' }),
      el('p', { class: 'panel-sub', text: `倾诉原文默认保留 ${body.retentionDays} 天，到期自动删除。你也可以随时在这里全部清空。` }),
      el('button', {
        class: 'secondary', text: '清空我的倾诉记录', attrs: { type: 'button' },
        on: {
          click: async () => {
            if (!window.confirm('清空后无法恢复。预约和授权不会被一起删除，可以在上面单独取消。确定吗？')) return;
            try {
              await onClearChat();
              toast('已清空。');
              reload();
            } catch {
              toast('清空没有成功，请稍后再试。');
            }
          },
        },
      }),
      el('button', {
        class: 'ghost wide', text: '查看数据与隐私说明', attrs: { type: 'button' },
        on: { click: () => openSheet('关于你的隐私与数据', privacyNodes()) },
      }),
    ]),
  ].filter(Boolean));
}

export const privacySheet = () => openSheet('关于你的隐私与数据', privacyNodes());
