// 活动目录逐行取自 prototype/mindbridge-prototype.html，作为演示活动的出厂内容。
// 引导文案属于内容资产，不要用模型生成内容覆盖。

export const ACTIVITIES={
  breathing:{id:'breathing',type:'online',title:'三分钟呼吸着陆法',desc:'用简短的呼吸和觉察，让身体从赶进度的紧绷中暂时退下来。',duration:'3 分钟',form:'线上自助',preLabel:'此刻的紧张程度是多少？',low:'很放松',high:'非常紧张',direction:'down',steps:[['找到一个稳定的姿势','让脚接触地面，肩膀尽量放松。'],['把注意力放回呼吸','缓慢吸气，稍作停留，再比吸气更慢地呼出。'],['觉察一个微小变化','不必要求自己立刻平静，只留意哪个部位稍微松了一点。']]},
  'stretch-video':{id:'stretch-video',type:'online',demoEngine:'video',title:'工间舒展操引导',desc:'跟随屏幕提示完成肩颈、上肢与呼吸收束，让长时间伏案后的身体短暂活动起来。',duration:'5 分钟',form:'线上视频跟练',preLabel:'此刻的身体疲惫程度是多少？',low:'轻松',high:'非常疲惫',direction:'down',steps:[]},
  'value-anchor':{id:'value-anchor',type:'online',demoEngine:'anchor',title:'职业价值锚点练习',desc:'把「职位变化」和「你真正看重的职业价值」分开来看，再落到一个本周可执行的小行动。',duration:'3 分钟',form:'线上引导',preLabel:'此刻你对职业方向的可控感是多少？',low:'完全不可控',high:'很有把握',direction:'up',
    values:[{icon:'📈',label:'成长与学习',desc:'持续提升能力，保持可迁移性'},{icon:'⚖️',label:'自主与平衡',desc:'对时间、节奏和边界保有掌控'},{icon:'💡',label:'影响与价值',desc:'做有意义、能产生真实影响的事'},{icon:'🤝',label:'关系与归属',desc:'在合作中被看见、被接纳'}],
    actions:[{icon:'🧩',label:'拆一个最小学习任务',desc:'选一个 30 分钟内能开始的新技能或资料'},{icon:'🗂️',label:'重新确认本周优先级',desc:'把真正重要的 1–2 件事写下来'},{icon:'💬',label:'发起一次关键对话',desc:'和主管、同伴或导师确认方向与支持'},{icon:'🚧',label:'守住一个工作边界',desc:'拒绝或延后一个非必要任务'}]},
  'return-rhythm':{id:'return-rhythm',type:'online',demoEngine:'steps',title:'返岗节奏重建练习',desc:'在工作、身体变化和家庭照护之间，找到今天可承受的节奏。',duration:'3 分钟',form:'线上引导',preLabel:'此刻你对返岗节奏的可控感是多少？',low:'完全失控',high:'比较从容',direction:'up',steps:[['找到最消耗的角色','此刻最占据精力的，是工作任务、家庭照护，还是对自己的要求？'],['缩小今天的必做清单','只保留真正必须完成的一两件事，其他允许暂缓。'],['选择一个可表达的需要','例如调整会议时间、确认优先级，或向可信任的人提出具体帮助。']]},
  'bodyscan-audio':{id:'bodyscan-audio',type:'online',demoEngine:'bodyscan',title:'工间身体扫描音频',desc:'跟随提示从头到脚逐一觉察身体，把持续伏案的疲惫感落到具体部位。',duration:'5 分钟',form:'线上音频引导',preLabel:'此刻的身体疲惫程度是多少？',low:'轻松',high:'非常疲惫',direction:'down',
    parts:[{icon:'🧠',name:'头顶与面部',hint:'感受头皮和额头的重量，慢慢松开。'},{icon:'🫀',name:'肩颈与胸口',hint:'留意肩膀是否不自觉地耸起，随呼气落下。'},{icon:'🤲',name:'手臂与双手',hint:'感受手指的温度，不需要用力。'},{icon:'🦵',name:'腰背与双腿',hint:'觉察椅子承托身体的地方。'},{icon:'🦶',name:'双脚',hint:'感受双脚踩在地面上的支撑感。'}]},
  'pause-card':{id:'pause-card',type:'online',demoEngine:'choice',title:'情绪暂停提醒卡片',desc:'在情绪和反应之间，先给自己一个可以选择的缓冲。',duration:'1 分钟',form:'线上自助',preLabel:'此刻的烦躁程度是多少？',low:'很平静',high:'非常烦躁',direction:'down',
    choices:[{icon:'🌬️',label:'三次深呼吸',desc:'吸气4秒，屏息4秒，呼气6秒',reflection:'呼吸变慢时，身体会先于情绪安静下来。给自己这三次呼吸的时间。'},{icon:'🔢',label:'默数10个数',desc:'从10倒数到1，给自己一个暂停',reflection:'倒数不是压抑情绪，只是在情绪和行动之间留出一点间隔。'},{icon:'🚶',label:'起身走一走',desc:'离开座位，走30秒再回来',reflection:'离开当下的场景，往往比留在原地更容易平静下来。'}]},
  'gratitude-checkin':{id:'gratitude-checkin',type:'online',demoEngine:'three-good',title:'每日三件好事打卡',desc:'用三条很短的记录，练习把注意力重新放回今天真实发生过的积极信号。',duration:'3 分钟',form:'线上自助',preLabel:'此刻的情绪低落程度是多少？',low:'还不错',high:'非常低落',direction:'down'},
  'pmr-audio':{id:'pmr-audio',type:'online',demoEngine:'bodyscan',title:'渐进式肌肉放松音频',desc:'先收紧、再松开，用身体的对比感卸下持续的紧绷。',duration:'6 分钟',form:'线上音频引导',preLabel:'此刻身体的紧绷程度是多少？',low:'很放松',high:'非常紧绷',direction:'down',
    parts:[{icon:'✋',name:'双手',hint:'握紧拳头4秒，然后突然松开。'},{icon:'💪',name:'手臂',hint:'收紧手臂肌肉，感受紧绷，再完全放下。'},{icon:'😌',name:'面部与肩颈',hint:'皱眉咬紧牙关，再慢慢松开。'},{icon:'🦵',name:'双腿',hint:'绷紧大腿和小腿，再彻底放松。'},{icon:'🌊',name:'全身',hint:'感受收紧与放松之间的差别。'}]},
  'mindful-audio':{id:'mindful-audio',type:'online',demoEngine:'audio',title:'正念音频包',desc:'选一段声音，给独自硬扛的时刻一点陪伴。',duration:'5-12 分钟',form:'线上音频',preLabel:'此刻的孤独感是多少？',low:'很有连接感',high:'非常孤独',direction:'down',
    tracks:[{icon:'🌊',label:'海浪的声音',desc:'5 分钟 · 自然白噪音'},{icon:'🌲',label:'森林漫步',desc:'8 分钟 · 森林环境音'},{icon:'🕯️',label:'烛光冥想',desc:'10 分钟 · 引导式冥想'}]},
  'writing-practice':{id:'writing-practice',type:'online',demoEngine:'journal',title:'情绪书写练习',desc:'把说不出的感受写下来，给情绪一个出口。',duration:'5 分钟',form:'线上自助',preLabel:'此刻的委屈感是多少？',low:'已经好些',high:'非常委屈',direction:'down',
    prompt:'写一写最近让你感到委屈的一件事，不必写得通顺完整。',placeholder:'开始写下你的感受……'},
  'aroma-audio':{id:'aroma-audio',type:'online',demoEngine:'steps',title:'芳香导入音频',desc:'用气味锚定、呼吸和一句边界提示，帮助从高情绪劳动场景切换出来。没有芳香介质时也可以直接完成呼吸与边界提示。',duration:'4 分钟',form:'线上音频引导',preLabel:'此刻工作情绪还黏在身上的程度是多少？',low:'已经切换出来',high:'仍被占据',direction:'down',steps:[['建立一个感官锚点','如果手边有企业提供的芳香卡或香囊，轻闻一次；没有也可以只留意一次自然呼吸。'],['做一次慢呼气','不需要深呼吸，只把呼气稍微放慢，让身体知道这一段工作场景正在结束。'],['划清心理边界','在心里说一句：客户的情绪属于刚才的场景，不需要继续由我带走。']]},
  'mindfulness-group':{id:'mindfulness-group',type:'offline',title:'情绪红绿灯正念工作坊',desc:'通过匿名情绪投票、呼吸着陆和压力拆解，在团体中练习。',duration:'90 分钟',form:'线下工作坊',schedule:'本周五 18:30',location:'星原科技 · 多功能活动室'},
  'identity-group':{id:'identity-group',type:'offline',title:'身份重塑叙事疗愈小组',desc:'面向职业瓶颈、被替代焦虑与价值感下降的小组支持。',duration:'2 小时 × 4 次',form:'深度叙事小组',schedule:'本周四 18:30 · 连续 4 周',location:'星原科技 · 小组室 A'},
  'art-group':{id:'art-group',type:'offline',title:'「心流插花」艺术疗愈',desc:'通过专注创作和非语言表达，暂时放下持续的情绪劳动。',duration:'2 小时',form:'手作体验',schedule:'本周六 14:00',location:'星原科技 · 创意活动室'},
  'return-group':{id:'return-group',type:'offline',title:'孕产返岗同伴支持小组',desc:'围绕角色转换、工作边界与支持需求开展的保密小组。',duration:'90 分钟',form:'线下小组',schedule:'下周三 12:30',location:'星原科技 · 安静会议室'}
};

