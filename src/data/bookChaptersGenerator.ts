import { CurriculumTopic, BookChapterPage, DiagramData } from '../types';
import { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

/**
 * High-fidelity generator for comprehensive, textbook-grade book chapters.
 * Each chapter includes exhaustive theoretical explanations, RFC standards,
 * mathematical equations, hardware ASIC behavior, and interactive diagrams/schematics.
 */
export function generateRichBookChapters(topic: CurriculumTopic): BookChapterPage[] {
  // If the topic already has bespoke handwritten bookPages, return them
  if (topic.bookPages && topic.bookPages.length >= 5) {
    return topic.bookPages;
  }

  const titleLower = (topic.titleAr + ' ' + topic.titleEn + ' ' + topic.id).toLowerCase();
  const protocolKey = Object.keys(PROTOCOL_DEEP_DIVES).find(k => 
    titleLower.includes(k.toLowerCase()) || 
    (topic.protocolDetails && topic.protocolDetails.some(p => p.id === k))
  );
  const protoDetail = protocolKey ? PROTOCOL_DEEP_DIVES[protocolKey] : undefined;

  // Synthesize custom diagrams based on domain
  const { topologyDiagram, headerDiagram, flowDiagram, campusTopologyDiagram } = synthesizeDiagramsForTopic(topic, protoDetail);

  const pages: BookChapterPage[] = [];

  // =========================================================================
  // CHAPTER 1: ARCHITECTURAL FOUNDATIONS & RFC STANDARDS
  // =========================================================================
  pages.push({
    pageNumber: 1,
    chapterTitleAr: 'الفصل 1: البنية التأسيسية والمعايير العالمية القياسية (Architectural Foundations & Standards)',
    chapterTitleEn: 'Chapter 1: Architectural Foundations & Global Standards',
    badgeAr: 'الأسس والنظريات المعمارية',
    badgeEn: 'Foundations & Architecture',
    estimatedReadTime: '7 دقائق',
    pageCategory: 'architecture',
    diagram: topologyDiagram,
    contentMarkdownAr: `### 🏛️ البنية التأسيسية للموضوع: ${topic.titleAr}
**المرجع المعتمد في سيسكو:** \`${topic.ciscoBlueprintRef}\`  
**المستوى الهندسي:** \`${topic.level}\` | **المسار:** \`${topic.track.toUpperCase()}\`

---

### 1.1 السياق الهندسي وموقع التقنية في مكدس الشبكات (Stack Placement):
تعتبر هذه التقنية ركيزة هندسية لا غنى عنها في تصميم الشبكات المؤسسية الحديثة (Cisco Enterprise Campus & Data Center Architectures). لا يمكن بناء بنية تحتية مستقرة وعالية التوافرية دون استيعاب القواعد الحاكمة لهذا المفهوم:
- **المستوى المعماري:** تعمل التقنية على ضبط حركة المرور بين طبقات النماذج المعيارية (OSI 7-Layer Model & TCP/IP Suite).
- **الهدف التشغيلي:** تحقيق أقصى معدلات الإنتاجية (Throughput)، وتقليل زمن التراجع والتأخير (Latency & Jitter)، ومنع حدوث الحلقات التكرارية والانهيار التقني (Loop Prevention & Fault Isolation).
- **التوافقية المعيارية:** تم توثيق المعايير القياسية الحاكمة من قِبل منظمات المعايير الدولية (IETF و IEEE) لضمان العمل التوافقي بين مختلف الشركات المصنعة (Multi-Vendor Interoperability).

---

### 1.2 المحتوى العلمي الشامل والأساس النظري:
${topic.contentMarkdownAr}

---

### 1.3 المتطلبات الصارمة ومبادئ التصميم (Design Principles):
1. **الفصل بين مستويات التشغيل:** يجب التفريق الدقيق بين **مستوى التحكم (Control Plane)** المسؤول عن اتخاذ القرارات وحساب المسارات، و**مستوى البيانات (Data Plane)** المسؤول عن نقل الفريمات والحزم بسرعة المعالجة المادية المباشرة (Line Rate).
2. **التوافرية العالية (High Availability):** تصميم الروابط بنظام التكرار المزدوج (Dual-Homing) لمنع وجود أي نقطة فشل مفردة (Single Point of Failure - SPOF).
3. **المرونة والنمو المستقبلي (Scalability):** دعم التوسع الشبكي دون الحاجة لإعادة هندسة البنية التحتية من الصفر.`,
    keyTakeawaysAr: [
      `استيعاب موقع التقنية الدقيق في منهج ${topic.level} وسياقها العملي في امتحانات سيسكو.`,
      'فهم الفرق الجوهري بين مستويات معالجة الحزم (Control Plane vs Data Plane).',
      'إدراك دور المعايير الدولية (RFCs & IEEE) في تحقيق التوافقية الشاملة بين الأجهزة.'
    ],
    ciscoTipAr: 'في امتحانات سيسكو الرسمية، ركز دائماً على السبب المعماري (Architectural Reason) لاختيار تقنية معينة بدلاً من البدائل، وليس فقط طريقة كتابة الأوامر.',
    interactiveCheck: {
      questionAr: `ما هو الهدف المعماري الأسمى لتطبيق ${topic.titleAr} في الشبكات المؤسسية؟`,
      optionsAr: [
        'تحقيق استقرار تشغيلي ومنع الحلقات وتوفير مسارات بديلة بأقصى سرعة معالجة فورية.',
        'إيقاف عمل المنافذ تلقائياً عند زيادة عدد المستخدمين.',
        'تحويل شبكة الإيثرنت بالكامل إلى اتصالات تسلسلية Serial.',
        'إلغاء الحاجة لوجود عناوين IP في الشبكة.'
      ],
      correctIndex: 0,
      explanationAr: 'الهدف المعماري الأساسي هو ضمان استقرار الشبكة وتوفير التوافرية العالية ونقل الحزم بسرعة المعالجة المادية الفائقة للرقاقات دون أخطاء.'
    }
  });

  // =========================================================================
  // CHAPTER 2: EXACT BIT-LEVEL HEADER DISSECTION & HARDWARE PIPELINE
  // =========================================================================
  pages.push({
    pageNumber: 2,
    chapterTitleAr: 'الفصل 2: التشريح الدقيق للترويسة ومحركات المعالجة المباشرة (Bit-Level Header & ASIC Pipeline)',
    chapterTitleEn: 'Chapter 2: Bit-Level Header Dissection & ASIC Pipeline',
    badgeAr: 'التشريح بالبتات والرقاقات المادية',
    badgeEn: 'Bit Dissection & ASICs',
    estimatedReadTime: '8 دقائق',
    pageCategory: 'headers',
    diagram: headerDiagram,
    contentMarkdownAr: `### 🔬 التشريح الرياضي والفيزيائي للبيانات
في هذا الفصل نغوص إلى مستوى البتات (Bits & Bytes) داخل كروت الشبكة ومصفوفات التبديل الإلكترونية (Switch Fabric & ASICs).

---

### 2.1 كيف تعالج رقاقات سيسكو المادية الترويسات (Hardware ASIC Processing)?
تعتمد سيسكو في محولاتها (Catalyst 9000 Series مع معالجات UADP ASIC) وموجهاتها (ASR / ISR مع محركات QuantumFlow) على خطوط أنابيب متوازية:
1. **الاستقبال والتأكد الفيزيائي (Ingress Parsing):** قراءة البايتات الأولى من الإطار وفحص مجموع التحقق الدوري (CRC-32 / FCS).
2. **البحث في ذاكرة TCAM فائقة السرعة (Ternary CAM Lookup):** تنفيذ عمليات المقارنة للعناوين وقوائم التحكم (ACLs) وسياسات جودة الخدمة (QoS) في دورة ساعة معالجة واحدة (Single Clock Cycle) في أجزاء من النانو ثانية.
3. **تعديل الترويسة (Header Rewrite):** تخفيض قيمة الـ TTL بمقدار 1، وإعادة حساب مجموع التحقق، وتحديث عناوين الماك الفيزيائية (Source & Dest MAC).
4. **التمرير نحو منفذ الإخراج (Egress Queuing & Buffering):** توجيه الحزمة مباشرة دون المرور على المعالج العام للموجه (Control CPU).

---

### 2.2 جدول الحقول التفصيلية للترويسة (Official Header Specification):
${protoDetail ? `
| اسم الحقل في الترويسة | الحجم بالبتات | الوظيفة الهندسية والمعيارية |
| :--- | :--- | :--- |
${protoDetail.headerStructure.map(h => `| **${h.field}** | \`${h.bits}\` | ${h.descAr} |`).join('\n')}
` : `
| الحقل | الحجم | الوظيفة |
| :--- | :--- | :--- |
| **Preamble & SFD** | 8 Bytes | مزامنة التردد الكهربائي والإشعار ببدء الفريم |
| **Destination Address** | 6 Bytes (48 Bits) | عنوان الماك الفيزيائي للوجهة القادمة |
| **Source Address** | 6 Bytes (48 Bits) | عنوان الماك الفيزيائي للمرسل |
| **EtherType / Length** | 2 Bytes (16 Bits) | تحديد البروتوكول المحمول (IPv4: 0x0800, ARP: 0x0806) |
| **Payload Data** | 46 - 1500 Bytes | البيانات المحمولة من الطبقة العليا (L3 Packet) |
| **FCS (CRC-32)** | 4 Bytes (32 Bits) | فحص سلامة البيانات من التشويش الكهرومغناطيسي |
`}

---

### 2.3 القواعد الرياضية والحسابية (Mathematical Equations):
- **حساب زمن الإرسال (Serialization Delay):** $\\text{Delay} = \\frac{\\text{Packet Size (bits)}}{\\text{Bandwidth (bps)}}$
- **حساب معدل نقل الإطارات القصوى (Wire Speed PPS):** $\\text{PPS} = \\frac{\\text{Interface Speed}}{\\text{Frame Size} + 20\\text{ Bytes Overhead}}$`,
    keyTakeawaysAr: [
      'فهم كيفية تخزين الترويسات ومقارنتها داخل ذاكرة الـ TCAM بالسرعة القصوى للشبكة.',
      'معرفة أحجام الحقول بالبتات ووظيفة كل حقل في ترويسة البروتوكول.',
      'التمييز بين الترويسات الثابتة والمتحولة (Fixed vs Variable Headers).'
    ],
    ciscoTipAr: 'ركز في الامتحان على حقول الـ Flags والأطوال المحجوزة، وتذكر أن الترويسات التي لا تنقسم على 32 بت تتطلب حقول حشو (Padding).',
    interactiveCheck: {
      questionAr: 'ما هي الذاكرة الخاصة التي تستخدمها أجهزة سيسكو لمقارنة الترويسات وقواعد التوجيه في دورة معالجة واحدة؟',
      optionsAr: [
        'ذاكرة TCAM (Ternary Content Addressable Memory)',
        'القرص الصلب الميكانيكي HDD',
        'ذاكرة الفلاش Bootflash فقط',
        'شريحة الـ BIOS القديمة'
      ],
      correctIndex: 0,
      explanationAr: 'تستخدم سيسكو ذاكرة TCAM للبحث المتوازي فائق السرعة بسرعة ملايين الحزم في الثانية.'
    }
  });

  // =========================================================================
  // CHAPTER 3: OPERATIONAL EXCHANGE MECHANICS & SEQUENCE FLOW
  // =========================================================================
  pages.push({
    pageNumber: 3,
    chapterTitleAr: 'الفصل 3: آليات التبادل التشغيلي وتدفق الحزم التتابعي (Operational Exchange & Sequence Flow)',
    chapterTitleEn: 'Chapter 3: Operational Exchange Mechanics & Sequence Flow',
    badgeAr: 'التشغيل وتبادل الحزم',
    badgeEn: 'Exchange & Mechanics',
    estimatedReadTime: '8 دقائق',
    pageCategory: 'protocols',
    diagram: flowDiagram,
    contentMarkdownAr: `### 🔄 دورة العمل التشغيلية والمحادثة البروتوكولية (Protocol Conversation)
لا تعمل بروتوكولات الشبكات بمعزل عن بعضها، بل عبر سلسلة دقيقة من الخطوات والرسائل التبادلية المحكومة بمؤقتات زمنية صارمة (Timers & Finite State Machines).

---

### 3.1 مراحل الحوار الهندسي خطوة بخطوة:
${protoDetail && protoDetail.stateMachine ? `
#### 🚥 آلة الحالات الرسمية (Protocol State Machine):
${protoDetail.stateMachine.map(s => `1. **حالة ${s.state}:** ${s.descAr}
   - *الشرط والمحفز للانتقال (Trigger):* \`${s.triggerAr}\``).join('\n\n')}
` : `
1. **مرحلة الاكتشاف والتعارف (Discovery Phase):** إرسال رسائل استكشاف دورية (Hello / Solicitation) للتعرف على الأجهزة المجاورة.
2. **مرحلة التفاوض ومزامنة المعايير (Negotiation & Handshake):** التحقق من تطابق الخيارات (Timers, MTU, Authentication, Capabilities).
3. **مرحلة تبادل البيانات الهيكلية (Database Exchange):** نقل سجلات التوجيه أو جداول العناوين عبر قنوات موثوقة.
4. **مرحلة الاستقرار وحفظ نبض الاتصال (Steady State & Keepalive):** تبادل نبضات خفيفة للتأكد من استمرار عمل الرابط، وإشعار فوري عند انقطاعه.
`}

---

### 3.2 أنواع الحزم والرسائل المتبادلة (Protocol Packet Types):
${protoDetail && protoDetail.packetTypes ? `
${protoDetail.packetTypes.map(p => `- ✉️ **${p.name}** ${p.opcode ? `(\`${p.opcode}\`)` : ''}: ${p.purposeAr}`).join('\n')}
` : `
- ✉️ **حزم الاستكشاف (Hello / Discovery):** تستخدم لتأسيس العلاقة والتأكد من بقاء الجار حياً.
- ✉️ **حزم التحديث (Update / Advertisement):** تحمل التغييرات الطوبولوجية الجديدة فقط (Incremental Updates).
- ✉️ **حزم التأكيد (Acknowledgment):** تضمن استلام الرسائل المهمة دون فقدانها عبر الشبكة.
`}

---

### 3.3 دور المؤقتات الزمنية (Timers) وتأثيرها على سرعة التقارب:
- **Hello Timer:** الفاصل الزمني لإرسال نبضات التحقق (الافتراضي عادة 1s أو 5s أو 10s).
- **Dead / Hold Timer:** المهلة القصوى قبل إعلان سقوط الجار رسمياً وإعادة احتساب المسارات (عادة 3 إلى 4 أضعاف زمن Hello).
- **Sub-Second BFD (Bidirectional Forwarding Detection):** تقنية سيسكو الحديثة لاكتشاف سقوط الروابط في زمن يقل عن 50 ميلي ثانية.`,
    keyTakeawaysAr: [
      'فهم مراحل المحادثة البروتوكولية وكيفية تشكل علاقات الجوار المستقرة.',
      'معرفة أسباب فشل التوافق (مثل اختلاف المؤقتات أو تباين قيم MTU).',
      'إدراك أهمية تقنية BFD في تسريع اكتشاف الأعطال إلى مستوى أجزاء من الثانية.'
    ],
    ciscoTipAr: 'في أسئلة السيناريوهات، إذا كان الجوار عالقاً في مرحلة معينة (مثل ExStart في OSPF)، فالسبب الأول عالمياً هو عدم تطابق حجم الـ MTU بين المنفذين!',
    interactiveCheck: {
      questionAr: 'ماذا يحدث في بروتوكولات التوجيه إذا اختلف زمن الـ Hello أو Dead Timer بين راوترين على نفس الوصلة؟',
      optionsAr: [
        'تفشل علاقة الجوار ولن يتمكن الراوتران من تشكيل Adjacency.',
        'يقوم الراوتر الأسرع بفرض توقيته تلقائياً على الآخر.',
        'تتحول الشبكة تلقائياً إلى بروتوكول RIP القديم.',
        'لا تأثير لذلك وستعمل الشبكة بشكل طبيعي.'
      ],
      correctIndex: 0,
      explanationAr: 'تتطلب معايير سيسكو الرسمية تطابقاً صارماً في مؤقتات Hello و Dead لتأسيس علاقة جوار مستقرة.'
    }
  });

  // =========================================================================
  // CHAPTER 4: ENTERPRISE TOPOLOGY DESIGN & REDUNDANCY
  // =========================================================================
  pages.push({
    pageNumber: 4,
    chapterTitleAr: 'الفصل 4: المخطط الهيكلي الطوبولوجي وتوزيع النطاقات (Enterprise Topology & Redundancy Design)',
    chapterTitleEn: 'Chapter 4: Enterprise Campus & Data Center Topology Design',
    badgeAr: 'التصميم الطوبولوجي المؤسسي',
    badgeEn: 'Enterprise Design',
    estimatedReadTime: '7 دقائق',
    pageCategory: 'topologies',
    diagram: campusTopologyDiagram,
    contentMarkdownAr: `### 🌐 الهندسة الطوبولوجية في بيئات الشركات ومراكز البيانات
الشبكات الحقيقية ليست مجرد أجهزة معزولة، بل تصاميم معمارية منظمة وفق أدلة سيسكو المعتمدة (Cisco Validated Designs - CVD).

---

### 4.1 نموذج سيسكو الهرمي الكلاسيكي (Three-Tier Hierarchical Model):
1. **طبقة النواة (Core Layer):** مهمتها التوجيه فائق السرعة بين المباني ومراكز البيانات دون تطبيق فلاتر أو سياسات تعطل الأداء.
2. **طبقة التوزيع (Distribution Layer):** تطبيق سياسات التوجيه، عزل الـ Broadcast Domains عبر VLANs، التوجيه بين الشبكات (Inter-VLAN)، وتطبيق الـ ACLs والـ QoS.
3. **طبقة الوصول (Access Layer):** ربط أجهزة المستخدمين وخوادم الحافة، تطبيق أمان المنافذ (Port Security و 802.1X)، وتغذية هواتف الـ IP وكاميرات المراقبة بالطاقة عبر الشبكة (PoE).

---

### 4.2 نموذج Spine-and-Leaf في مراكز البيانات الحديثة (Data Center Fabric):
- في مراكز البيانات الحديثة التي تعتمد على تقنيات مثل VXLAN و EVPN، يستبدل النموذج الهرمي بنموذج **Spine-Leaf**.
- كل محول Leaf متصل بجميع محولات الـ Spine، مما يضمن أن حركة المرور من أي خادم إلى خادم آخر تستغرق قفزة واحدة فقط (Predictable Ultra-Low Latency - East-West Traffic).

---

### 4.3 تقنيات التكرار والتوافرية العالية (Redundancy Mechanisms):
- **EtherChannel / LACP (802.3ad):** دمج عدة روابط فيزيائية في رابط منطقي واحد لمضاعفة السرعة وتوفير حماية من انقطاع الكابلات.
- **FHRP (HSRP / VRRP):** بروتوكولات حماية البوابة الافتراضية لضمان عدم انقطاع الإنترنت عند سقوط الراوتر الأساسي.
- **Dual-Homed Uplinks:** تزويد كل محول access بمسارين صاعدين نحو محولي توزيع مستقلين.`,
    keyTakeawaysAr: [
      'فهم الفروق المعمارية بين تصميم الـ Three-Tier الكلاسيكي وتصميم الـ Spine-Leaf الحديث.',
      'معرفة وظيفة كل طبقة في هرمية سيسكو ولماذا لا تطبق الفلاتر في الـ Core.',
      'تطبيق مبادئ التكرار لمنع انقطاع الخدمات الحساسة داخل الشركات.'
    ],
    ciscoTipAr: 'في أسئلة التصميم المعتمدة (Cisco Enterprise Architecture)، ركز دائماً على موضع تجميع الـ Default Gateways والـ Routing Policies في طبقة الـ Distribution.',
    interactiveCheck: {
      questionAr: 'في النموذج الهرمي لشبكات سيسكو، أين يفضل تطبيق سياسات التوجيه وقوائم التحكم ACLs؟',
      optionsAr: [
        'في طبقة التوزيع (Distribution Layer)',
        'في طبقة النواة فائقة السرعة (Core Layer)',
        'على كابلات الألياف الضوئية الخارجية فقط',
        'لا يتم تطبيقها إطلاقاً'
      ],
      correctIndex: 0,
      explanationAr: 'طبقة التوزيع هي الطبقة المخصصة لفرض السياسات وتجميع المسارات وقوائم الوصول، بينما تركز النواة Core على سرعة التمرير القصوى.'
    }
  });

  // =========================================================================
  // CHAPTER 5: ADVANCED CISCO IOS-XE CLI & VERIFICATION COMMANDS
  // =========================================================================
  pages.push({
    pageNumber: 5,
    chapterTitleAr: 'الفصل 5: التكوين العملي المتقدم في بيئات Cisco IOS-XE وأوامر التحقق الذهبية',
    chapterTitleEn: 'Chapter 5: Advanced Cisco IOS-XE Configuration & Verification Commands',
    badgeAr: 'التطبيق العملي والشاشات',
    badgeEn: 'Cisco CLI & Labs',
    estimatedReadTime: '9 دقائق',
    pageCategory: 'cli',
    contentMarkdownAr: `### 💻 الهندسة التنفيذية في بيئات Cisco IOS / IOS-XE
في هذا الفصل ندخل إلى صلب العمل اليومي لمهندس سيسكو: كتابة التكوينات النموذجية الخالية من الأخطاء وتحليل مخرجات جداول التشغيل الحية.

---

### 5.1 سيناريو التكوين النموذجي الشامل (Production-Grade Configuration):
\`\`\`cisco
! =====================================================
! Cisco IOS-XE Production Hardened Configuration
! =====================================================
hostname Core-R1
service password-encryption
no ip domain-lookup
ip routing

! 1. ضبط الواجهات الأساسية
interface GigabitEthernet0/0/1
 description UPLINK-TO-DIST-SW1
 ip address 10.1.10.1 255.255.255.252
 no shutdown
 negotiation auto
 carrier-delay msec 50

! 2. تفعيل البروتوكول مع تحسين المؤقتات والأمان
${protoDetail ? protoDetail.ciscoConfigSnippet : `router ospf 1
 router-id 1.1.1.1
 auto-cost reference-bandwidth 100000
 network 10.1.10.0 0.0.0.3 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/0/1`}
\`\`\`

---

### 5.2 الأوامر التشخيصية الذهبية ومخرجاتها (Golden Verification Commands):
${topic.ciscoCliOutputs && topic.ciscoCliOutputs.length > 0 ? `
${topic.ciscoCliOutputs.map(cmd => `
#### 🖥️ أمر التحقق: \`${cmd.command}\`
\`\`\`cisco
${cmd.deviceName}(${cmd.mode})# ${cmd.command}
${cmd.output}
\`\`\`
> **🔍 التحليل الهندسي والملاحظات الفنية:**  
> ${cmd.explanationAr}
`).join('\n\n')}
` : `
#### 🖥️ أمر التحقق: \`show ip route\`
\`\`\`cisco
Core-R1# show ip route
Gateway of last resort is 10.1.10.2 to network 0.0.0.0

      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.1.10.0/30 is directly connected, GigabitEthernet0/0/1
L        10.1.10.1/32 is directly connected, GigabitEthernet0/0/1
O        192.168.10.0/24 [110/2] via 10.1.10.2, 00:14:22, GigabitEthernet0/0/1
\`\`\`
> **🔍 التحليل الهندسي والملاحظات الفنية:**  
> نلاحظ وجود الحرف O الذي يدل على مسار تم تعلمه عبر OSPF، مع قيمة المسافة الإدارية [110] وقيمة التكلفة المترية [2].
`}

---

### 5.3 أفضل الممارسات الأمنية لسيسكو (Security Hardening):
- حظر واجهات المستخدمين عبر الأمر \`passive-interface default\` لمنع استقبال حزم التوجيه الخبيثة من أجهزة غير موثوقة.
- تفعيل التشفير والتوقيع الرقمي (Cryptographic Authentication مثل SHA-256 أو MD5) على كافة الرسائل التبادلية.
- استخدام قوائم التحكم بالوصول (CoPP - Control Plane Policing) لحماية معالج الراوتر من هجمات حجب الخدمة (DoS Attacks).`,
    keyTakeawaysAr: [
      'إتقان كتابة وتطبيق التكوينات الهندسية بأسلوب سيسكو القياسي الصارم.',
      'القدرة على قراءة وتفسير مخرجات أوامر show المتقدمة واستخراج الإحصائيات.',
      'تطبيق مبادئ الحماية وتأمين مستوى التحكم عبر passive-interface و CoPP.'
    ],
    ciscoTipAr: 'في أسئلة المختبرات بامتحان سيسكو (Performance-Based Lab Items)، لن يتم طلب أوامر show صراحة، لكنها أداتك الوحيدة للتحقق من أن حلك يعمل 100%!',
    interactiveCheck: {
      questionAr: 'ما هي الفائدة الأمنية من تفعيل passive-interface على واجهات الشبكة المتصلة بأجهزة الموظفين؟',
      optionsAr: [
        'منع إرسال حزم التوجيه نحو أجهزة المستخدمين لحماية الشبكة وتوفير استهلاك البيانات.',
        'إيقاف الإنترنت عن الموظفين نهائياً أثناء ساعات العمل.',
        'تسريع شحن بطاريات الحواسيب المحمولة.',
        'تحويل كروت الشبكة إلى وضع الصامت دون أسلاك.'
      ],
      correctIndex: 0,
      explanationAr: 'أمر passive-interface يمنع إرسال واستقبال حزم التوجيه على المنافذ الطرفية، مما يمنع حقن مسارات مزيفة أو التنصت على طوبولوجيا الشبكة.'
    }
  });

  // =========================================================================
  // CHAPTER 6: TROUBLESHOOTING & CISCO TAC METHODOLOGY
  // =========================================================================
  pages.push({
    pageNumber: 6,
    chapterTitleAr: 'الفصل 6: استكشاف الأعطال وتشخيصات دعم سيسكو TAC (Troubleshooting & TAC Diagnostics)',
    chapterTitleEn: 'Chapter 6: Troubleshooting & Cisco TAC Diagnostics',
    badgeAr: 'استكشاف الأعطال المعقدة',
    badgeEn: 'TAC Troubleshooting',
    estimatedReadTime: '8 دقائق',
    pageCategory: 'troubleshooting',
    contentMarkdownAr: `### 🛠️ منهجية مركز المساعدة التقني في سيسكو (Cisco TAC Methodology)
يمثل استكشاف الأعطال أكثر من 40% من متطلبات امتحان سيسكو والعمل الواقعي لمهندس الشبكات المحترف.

---

### 6.1 مصفوفة الأعطال الأكثر شيوعاً والحلول الجذرية (Root Cause Matrix):
| العرض الملاحظ (Symptom) | السبب الجذري المحتمل (Root Cause) | الإجراء التصحيحي الموصى به (TAC Resolution) |
| :--- | :--- | :--- |
| **انقطاع الجوار بعد تكوينه مباشرة (Flapping)** | عدم تطابق في الـ MTU أو تباين في إعدادات المؤقتات (Timers) | التحقق من \`ip mtu\` و \`show ip ospf interface\` وتوحيد القيم |
| **المسارات تظهر وتختفي بشكل متكرر (Route Flapping)** | تذبذب في الكابل الفيزيائي أو ازدحام شديد على الرابط | فحص \`show interfaces\` لمراقبة عدادات الـ CRC Errors و Drops |
| **فشل تشكل الـ Adjacency وبقاؤها في وضع 2-Way** | طبيعة شبكة الـ Broadcast multi-access بين راوترات عادية غير DR | هذا سلوك طبيعي بين الـ DROther routers وليس عطلاً! |
| **إسقاط الحزم عند حجم معين (Black Hole / DF Bit)** | حجم حزمة البيانات أكبر من الـ MTU مع وجود علم Don't Fragment | تفعيل \`ip mtu\` و \`ip tcp adjust-mss 1452\` على واجهات الأنفاق |
| **تكرار عنوان الـ Router-ID بين جهازين** | تم استنساخ التكوين دون تغيير معرف الراوتر اليدوي | تعيين \`router-id\` فريد لكل جهاز وإعادة تشغيل العملية |

---

### 6.2 التسلسل المنطقي لاستكشاف الأعطال (Layered Approach):
1. **الطبقة الفيزيائية (Layer 1):** فحص إشارات الضوء، حالة الكابلات، ومصابيح المنافذ (\`show interfaces status\`).
2. **طبقة ربط البيانات (Layer 2):** فحص الـ Speed & Duplex، إعدادات الـ VLAN، وحالة منافذ الـ STP (\`show spanning-tree\`).
3. **طبقة الشبكة (Layer 3):** فحص صحة عناوين الـ IP وأقنعة الشبكة، وجدول التوجيه (\`show ip route\`).
4. **طبقة التوجيه المتقدمة (Routing Control Plane):** فحص جداول الجيران وتفاصيل البروتوكول (\`show ip [protocol] neighbor\`).

---

### 6.3 التحذيرات الصارمة عند استخدام أوامر الـ Debug:
- **تحذير خطير:** لا تقم أبداً بكتابة \`debug all\` في بيئة إنتاجية حية (Production Network)، لأن ذلك قد يؤدي إلى شلل تام لمعالج الموجه (100% CPU Utilization).
- **الممارسة الآمنة:** استخدم دائماً قوائم وصول شرطية (Conditional Debugging) مثل:
\`\`\`cisco
Router# debug condition interface GigabitEthernet0/0/1
Router# debug ip packet 101 detail
\`\`\``,
    keyTakeawaysAr: [
      'استخدام منهجية عزل الطبقات لحل المشكلات المعقدة بأقل وقت ممكن.',
      'معرفة الفروق الدقيقة بين الأعطال الحقيقية والسلوكيات المعيارية الطبيعية.',
      'تجنب المخاطر الكارثية لأوامر debug في شبكات الإنتاج الحية.'
    ],
    ciscoTipAr: 'في أسئلة استكشاف الأخطاء، إذا كان كل شيء يبدو صحيحاً لكن الحزم تسقط في الأنفاق أو الـ VPN، فالسبب بنسبة 90% هو مشكلة الـ MTU و MSS!',
    interactiveCheck: {
      questionAr: 'لماذا يحذر مهندسو سيسكو بشدة من تنفيذ أمر debug all على راوتر يعمل في بيئة حقيقية؟',
      optionsAr: [
        'لأنه يولد ملايين السجلات في الثانية مما يشغل المعالج بنسبة 100% ويسقط الراوتر.',
        'لأنه يقوم بمسح ملف الـ startup-config فوراً.',
        'لأنه يغير لغة النظام من الإنجليزية إلى الصينية.',
        'لأنه يقوم بإطفاء مزود الطاقة الفيزيائي.'
      ],
      correctIndex: 0,
      explanationAr: 'أمر debug all يطبع كل حدث في الراوتر دون فلاتر، مما يسبب استهلاكاً كاملاً للمعالج CPU وانهيار الجهاز.'
    }
  });

  // =========================================================================
  // CHAPTER 7: DEEP ENGINEERING COMPARISONS & PRODUCTION TRADE-OFFS
  // =========================================================================
  pages.push({
    pageNumber: 7,
    chapterTitleAr: 'الفصل 7: المقارنات الهندسية الشاملة وحالات الاستخدام المؤسسي (Engineering Comparisons & Trade-offs)',
    chapterTitleEn: 'Chapter 7: Engineering Comparisons & Production Trade-offs',
    badgeAr: 'المقارنات والبدائل الهندسية',
    badgeEn: 'Trade-offs & Comparisons',
    estimatedReadTime: '7 دقائق',
    pageCategory: 'comparisons',
    contentMarkdownAr: `### ⚖️ اتخاذ القرار الهندسي والمفاضلة بين الحلول (Engineering Decision Making)
المهندس البارع لا يعرف فقط كيف يشغل تقنية معينة، بل يفهم متى يختارها ومتى يتجنبها لصالح حلول أخرى أكثر ملاءمة.

---

### 7.1 جدول المفاضلة والمقارنة الشاملة:
| الخاصية والمعيار | التقنية الحالية (${topic.titleAr}) | البديل الكلاسيكي | البديل المستقبلي المتقدم |
| :--- | :--- | :--- | :--- |
| **المعايير الدولية** | معايير قياسية مفتوحة (IETF / IEEE) | بروتوكولات احتكارية قديمة | بروتوكولات مبرمجة بالبرمجيات (SDN / Cloud) |
| **سرعة التقارب (Convergence)** | سرعة عالية (أجزاء من الثانية إلى ثوانٍ) | بطيئة جداً (30 إلى 50 ثانية) | شبه فورية بأجزاء من الميلي ثانية (Sub-50ms) |
| **استهلاك الموارد (CPU/RAM)** | معتدل إلى مرتفع حسب حجم الشبكة | خفيف جداً | مدار عبر وحدات تحكم مركزية Controllers |
| **التعقيد التشغيلي** | يحتاج مهندساً حاصلاً على شهادات سيسكو | بسيط جداً وبدائي | مؤتمت بالكامل عبر Python و APIs و Netconf |
| **دعم البيئات السحابية** | مدعوم على أجهزة سيسكو الفعلية والافتراضية | غير متوافق مع الشبكات السحابية | مصمم أصلاً للـ Multi-Cloud و Datacenter Fabrics |

---

### 7.2 حالات الاستخدام الواقعية (Real-World Use Cases):
1. **الشركات والمؤسسات الكبرى (Enterprise Campus):** حيث توجد فروع متعددة ومئات المحولات والمستخدمين، مما يتطلب تقسيماً هرمياً وتكراراً موثوقاً.
2. **القطاع المصرفي والمالي (Banking & Finance):** حيث لا يمكن التسامح مع فقدان أي حزمة وتعتبر كل ميلي ثانية تأخير خسارة مالية.
3. **مزودو خدمات الإنترنت والاتصالات (Service Providers):** حيث يتم توجيه ملايين المسارات الدولية عبر بروتوكولات مثل BGP و MPLS.`,
    keyTakeawaysAr: [
      'القدرة على اختيار الحل المناسب بناءً على متطلبات العمل وميزانية الأجهزة والمعدات.',
      'مقارنة المعايير المفتوحة بالحلول الاحتكارية وفهم انعكاسها على التكلفة.',
      'الربط بين التقنيات الكلاسيكية والتحول الرقمي نحو الشبكات المعرفة برمجياً (SDN).'
    ],
    ciscoTipAr: 'في أسئلة امتحانات سيسكو، لا توجد إجابة واحدة صحيحة في الفراغ؛ الإجابة الأفضل تعتمد دائماً على القيود المذكورة في نص المسألة (Constraints)!',
    interactiveCheck: {
      questionAr: 'ما هو المعيار الأهم عند المفاضلة بين البروتوكولات في الشبكات المصرفية الحساسة؟',
      optionsAr: [
        'سرعة التقارب العالية والقدرة على توفير مسارات بديلة دون انقطاع الجلسات.',
        'رخص سعر كابلات الإيثرنت فقط.',
        'أن يكون لون واجهة الراوتر الخارجي أزرق.',
        'إلغاء كلمات المرور لتسهيل وصول الجميع.'
      ],
      correctIndex: 0,
      explanationAr: 'في البيئات المصرفية، يعد استقرار المسارات وسرعة التعافي الفوري من الأعطال (Sub-second convergence) المعيار الأهم عالمياً.'
    }
  });

  // =========================================================================
  // CHAPTER 8: EXAM BLUEPRINT MASTERY & SNEAKY TRAPS
  // =========================================================================
  pages.push({
    pageNumber: 8,
    chapterTitleAr: 'الفصل 8: استراتيجيات اجتياز امتحان سيسكو والأسئلة الحرجة (Cisco Exam Secrets & Critical Traps)',
    chapterTitleEn: 'Chapter 8: Official Cisco Exam Secrets & Critical Pitfalls',
    badgeAr: 'أسرار وفخاخ الامتحان',
    badgeEn: 'Exam Secrets & Traps',
    estimatedReadTime: '6 دقائق',
    pageCategory: 'exam',
    contentMarkdownAr: `### 🎯 دليل التفوق واجتياز امتحان سيسكو الرسمي
نقدم هنا خلاصة أسرار امتحانات سيسكو الدولية (${topic.level}) والنقاط الحساسة التي يتعمد واضعو الأسئلة اختبار الطلاب فيها.

---

### 8.1 الفخاخ الامتحانية الشائعة (Common Sneaky Exam Traps):
1. **فخ الكلمات الاستثنائية:** انتبه لكلمات مثل: \`EXCEPT\`، \`NOT\`، \`LEAST\`، \`MUST\` في نص السؤال، فغالباً ما تقلب الإجابة المطلوبة بالكامل.
2. **فخ ترتيب قائمة التوجيه (Longest Prefix Match):** الراوتر يختار دائماً المسار الأكثر تحديداً (أطول قناع شبكة /32 ثم /28 ثم /24) بغض النظر عن المسافة الإدارية (AD) أو التكلفة المترية!
3. **فخ العناوين الافتراضية المحجوزة:** لا يمكن إعطاء عنوان الشبكة (Network ID) أو عنوان البث العام (Broadcast IP) لأي جهاز طرفي.
4. **فخ حالة المنفذ الفيزيائية مقابل المنطقية:** منفذ حالته \`up/down\` يعني أن الإشارة الفيزيائية موجودة ولكن هناك خطأ في البروتوكول (Line Protocol Down مثل عدم تطابق Framing أو عدم وجود Keepalive).

---

### 8.2 ورقة التذكير السريع بالأرقام الثابتة (Cheat Sheet Matrix):
${topic.technicalHighlights && topic.technicalHighlights.length > 0 ? `
${topic.technicalHighlights.map(h => `- 📌 **${h}**`).join('\n')}
` : `
- 📌 **المسافة الإدارية (Administrative Distance):** Connected = 0, Static = 1, EIGRP = 90, OSPF = 110, BGP External = 20, BGP Internal = 200.
- 📌 **مجال الـ VLANs:** النطاق العادي من 1 إلى 1005 (1 محجوز افتراضياً، 1002-1005 Token Ring)، والنطاق الموسع من 1006 إلى 4094.
- 📌 **أقصى وحدة نقل (MTU):** القيمة الافتراضية للإيثرنت هي 1500 بايت بدون ترويسة الـ L2.
`}

---

### 8.3 نصائح سيسكو الذهبية في إدارة وقت الاختبار:
- الاختبار يحتوي عادة على ما بين 95 إلى 105 أسئلة في غضون 120 دقيقة (أو 140 دقيقة لغير المتحدثين الأصليين بالإنجليزية).
- لا تقضِ أكثر من دقيقة ونصف في أي سؤال اختيارات متعددة حتى يتبقى لك متسع من الوقت لأسئلة المعامل التطبيقية (Performance Lab Simlets).
- اقرأ المخرجات المعروضة في شاشات الـ CLI بعناية قبل التسرع في الإجابة.`,
    keyTakeawaysAr: [
      'استيعاب أساليب واضعي الامتحانات وتجنب الوقوع في فخاخ الكلمات الاستثنائية.',
      'حفظ جدول المسافات الإدارية والأرقام الثابتة عن ظهر قلب.',
      'إدارة وقت الاختبار باحترافية وضمان إنجاز أسئلة المعامل التطبيقية.'
    ],
    ciscoTipAr: 'تذكر دائماً قاعدة الذهب في سيسكو: Longest Match دائماً يتفوق على Administrative Distance، و AD دائماً يتفوق على Metric!',
    interactiveCheck: {
      questionAr: 'إذا وجد الراوتر مسارين لنفس الوجهة: الأول 192.168.1.0/24 عبر EIGRP (AD=90) والآخر 192.168.1.128/25 عبر OSPF (AD=110)، فأي مسار سيختاره لحزمة موجهة إلى 192.168.1.130؟',
      optionsAr: [
        'مسار OSPF /25 لأنه صاحب القناع الأطول (Longest Prefix Match /25).',
        'مسار EIGRP لأنه صاحب المسافة الإدارية الأقل 90.',
        'سيسقط الحزمة لعدم تطابق البروتوكولات.',
        'سيرسل نصف الحزم عبر كل مسار بالتناوب.'
      ],
      correctIndex: 0,
      explanationAr: 'قاعدة Longest Prefix Match تعلو فوق كل شيء آخر؛ القناع الأطول /25 يفوز أولاً قبل النظر إلى الـ Administrative Distance أو المترك.'
    }
  });

  return pages;
}

/**
 * Helper to synthesize rich diagram datasets tailored to the topic
 */
function synthesizeDiagramsForTopic(topic: CurriculumTopic, protoDetail?: any) {
  const title = (topic.titleAr + ' ' + topic.titleEn + ' ' + topic.id).toLowerCase();

  // 1. TOPOLOGY DIAGRAM
  let topologyDiagram: DiagramData;
  if (title.includes('ospf') || title.includes('routing')) {
    topologyDiagram = {
      id: 'diag-ospf-multi-area',
      type: 'topology',
      titleAr: 'طوبولوجيا OSPF المتعددة المناطق والمسارات التكرارية (Multi-Area Hierarchy)',
      titleEn: 'OSPF Multi-Area Topology & Redundancy',
      captionAr: 'مخطط يوضح المنطقة الرئيسية Backbone Area 0 والمنطقة الفرعية Area 1 مع موجهات ABR و ASBR.',
      nodes: [
        { id: 'r1', label: 'R1-Core', subLabel: 'ABR Router', role: 'router', x: 25, y: 35, ip: '10.0.0.1', area: 'Area 0 / Area 1', status: 'active' },
        { id: 'r2', label: 'R2-Backbone', subLabel: 'Area 0 Core', role: 'router', x: 50, y: 25, ip: '10.0.0.2', area: 'Area 0 (Backbone)', status: 'root' },
        { id: 'r3', label: 'R3-ASBR', subLabel: 'External Gateway', role: 'router', x: 75, y: 35, ip: '10.0.0.3', area: 'Area 0 / External', status: 'active' },
        { id: 'sw1', label: 'SW-Dist1', subLabel: 'Area 1 Switch', role: 'l3switch', x: 25, y: 70, ip: '192.168.1.1', area: 'Area 1', status: 'forwarding' },
        { id: 'cloud', label: 'Internet / ISP', subLabel: 'Autonomous System', role: 'cloud', x: 75, y: 75, ip: '203.0.113.1', asNumber: 'AS 65000' },
      ],
      links: [
        { from: 'r1', to: 'r2', label: '10 Gbps (Area 0)', status: 'forwarding' },
        { from: 'r2', to: 'r3', label: '10 Gbps (Area 0)', status: 'forwarding' },
        { from: 'r1', to: 'sw1', label: 'Gigabit (Area 1)', status: 'forwarding' },
        { from: 'r3', to: 'cloud', label: 'BGP Link / E-BGP', style: 'dashed', status: 'forwarding' },
      ]
    };
  } else if (title.includes('stp') || title.includes('switch') || title.includes('vlan')) {
    topologyDiagram = {
      id: 'diag-stp-redundant-triangle',
      type: 'topology',
      titleAr: 'طوبولوجيا التبديل المقاومة للأعطال ومواقع منافذ STP (Root Bridge & Blocking)',
      titleEn: 'Redundant Switched Triangle & STP Port States',
      captionAr: 'مخطط يوضح انتخاب الـ Root Bridge والمنافذ المحظورة (Blocked) لمنع الحلقات التكرارية.',
      nodes: [
        { id: 'sw-root', label: 'SW-Root', subLabel: 'Priority 24576', role: 'switch', x: 50, y: 25, mac: '0001.0001.0001', status: 'root' },
        { id: 'sw-sec', label: 'SW-Secondary', subLabel: 'Priority 28672', role: 'switch', x: 25, y: 65, mac: '0002.0002.0002', status: 'forwarding' },
        { id: 'sw-acc', label: 'SW-Access', subLabel: 'Priority 32768', role: 'switch', x: 75, y: 65, mac: '0003.0003.0003', status: 'blocked' },
        { id: 'host-a', label: 'Host-A', subLabel: 'VLAN 10', role: 'host', x: 25, y: 90, ip: '192.168.10.10', vlan: 10 },
        { id: 'host-b', label: 'Host-B', subLabel: 'VLAN 10', role: 'host', x: 75, y: 90, ip: '192.168.10.20', vlan: 10 },
      ],
      links: [
        { from: 'sw-root', to: 'sw-sec', label: 'Trunk (Root Port)', status: 'forwarding' },
        { from: 'sw-root', to: 'sw-acc', label: 'Trunk (Root Port)', status: 'forwarding' },
        { from: 'sw-sec', to: 'sw-acc', label: 'Trunk (BLOCKED Port)', status: 'blocked' },
        { from: 'sw-sec', to: 'host-a', label: 'Access Fa0/1', status: 'forwarding' },
        { from: 'sw-acc', to: 'host-b', label: 'Access Fa0/2', status: 'forwarding' },
      ]
    };
  } else if (title.includes('bgp')) {
    topologyDiagram = {
      id: 'diag-bgp-as-peering',
      type: 'topology',
      titleAr: 'طوبولوجيا التوجيه بين الأنظمة المستقلة (eBGP & iBGP Peering Architecture)',
      titleEn: 'BGP Autonomous Systems Architecture',
      captionAr: 'مخطط اتصال شبكات الأنظمة المستقلة عبر eBGP و iBGP مع موجهات الـ Route Reflectors.',
      nodes: [
        { id: 'as1-r1', label: 'R1-Edge', subLabel: 'AS 65001 Edge', role: 'router', x: 25, y: 40, ip: '198.51.100.1', asNumber: 'AS 65001' },
        { id: 'as1-r2', label: 'R2-Core', subLabel: 'iBGP Peer', role: 'router', x: 25, y: 75, ip: '10.1.1.2', asNumber: 'AS 65001' },
        { id: 'as2-r1', label: 'R3-Edge', subLabel: 'AS 65002 Edge', role: 'router', x: 75, y: 40, ip: '198.51.100.2', asNumber: 'AS 65002' },
        { id: 'as2-r2', label: 'R4-Core', subLabel: 'iBGP Peer', role: 'router', x: 75, y: 75, ip: '10.2.1.2', asNumber: 'AS 65002' },
      ],
      links: [
        { from: 'as1-r1', to: 'as2-r1', label: 'eBGP Peering (Public Link)', status: 'forwarding' },
        { from: 'as1-r1', to: 'as1-r2', label: 'iBGP Mesh (Internal)', style: 'dashed', status: 'forwarding' },
        { from: 'as2-r1', to: 'as2-r2', label: 'iBGP Mesh (Internal)', style: 'dashed', status: 'forwarding' },
      ]
    };
  } else {
    // Standard Enterprise Architecture Diagram
    topologyDiagram = {
      id: 'diag-standard-enterprise',
      type: 'topology',
      titleAr: `المخطط الهيكلي الطوبولوجي المعتمد لموضوع: ${topic.titleAr}`,
      titleEn: 'Enterprise Network Architecture Topology',
      captionAr: 'بنية الربط المعمارية للشبكة المؤسسية المعتمدة وفق معايير سيسكو الرسمية.',
      nodes: [
        { id: 'core-r1', label: 'Core-Router', subLabel: 'L3 Backbone', role: 'router', x: 50, y: 25, ip: '10.0.0.1', status: 'root' },
        { id: 'dist-sw1', label: 'Dist-Switch1', subLabel: 'Distribution L3', role: 'l3switch', x: 30, y: 55, ip: '192.168.10.1', status: 'forwarding' },
        { id: 'dist-sw2', label: 'Dist-Switch2', subLabel: 'Distribution L3', role: 'l3switch', x: 70, y: 55, ip: '192.168.20.1', status: 'forwarding' },
        { id: 'acc-sw1', label: 'Access-SW1', subLabel: 'Edge Access', role: 'switch', x: 30, y: 80, ip: '192.168.10.2' },
        { id: 'server1', label: 'App-Server', subLabel: 'Data Center', role: 'server', x: 70, y: 80, ip: '192.168.20.50' },
      ],
      links: [
        { from: 'core-r1', to: 'dist-sw1', label: '10 Gbps Trunk', status: 'forwarding' },
        { from: 'core-r1', to: 'dist-sw2', label: '10 Gbps Trunk', status: 'forwarding' },
        { from: 'dist-sw1', to: 'dist-sw2', label: 'Cross-Link LACP', style: 'dashed', status: 'forwarding' },
        { from: 'dist-sw1', to: 'acc-sw1', label: '1 Gbps Link', status: 'forwarding' },
        { from: 'dist-sw2', to: 'server1', label: '10 Gbps SAN', status: 'forwarding' },
      ]
    };
  }

  // 2. HEADER DISSECTION DIAGRAM
  let headerDiagram: DiagramData;
  if (protoDetail && protoDetail.headerStructure && protoDetail.headerStructure.length > 0) {
    headerDiagram = {
      id: `diag-header-${protoDetail.id}`,
      type: 'header',
      titleAr: `تشريح حقول ترويسة ${protoDetail.name} بالبتات (Bit-Level Breakdown)`,
      titleEn: `${protoDetail.name} Packet Header Dissection`,
      captionAr: `التفصيل الدقيق لحقول الترويسة وأحجامها بالبتات والمعايير الرسمية (${protoDetail.standard}).`,
      headerFields: protoDetail.headerStructure.map((h: any, idx: number) => ({
        name: h.field,
        bits: h.bits,
        byteOffset: `${idx * 4}`,
        descAr: h.descAr,
        descEn: h.descEn,
        exampleValue: idx === 0 ? '0x02' : idx === 1 ? '0x01' : '0x0000'
      }))
    };
  } else if (title.includes('tcp') || title.includes('transport')) {
    headerDiagram = {
      id: 'diag-header-tcp',
      type: 'header',
      titleAr: 'تشريح ترويسة بروتوكول TCP الرسمية (20-60 بايت) وفق RFC 793',
      titleEn: 'Transmission Control Protocol (TCP) Header Dissection',
      captionAr: 'حقول ترويسة النقل الموثوق بالبتات متضمنة أرقام التسلسل ومصفوفة الأعلام (Control Flags).',
      headerFields: [
        { name: 'Source Port', bits: '16 bits', byteOffset: '0-1', descAr: 'رقم المنفذ للمرسل (Ephemeral Port)', exampleValue: '54321' },
        { name: 'Destination Port', bits: '16 bits', byteOffset: '2-3', descAr: 'رقم المنفذ للخدمة المستهدفة (HTTP=80, HTTPS=443)', exampleValue: '443' },
        { name: 'Sequence Number', bits: '32 bits', byteOffset: '4-7', descAr: 'الرقم التسلسلي للبايت الأول في الحزمة لترتيب البيانات', exampleValue: '0x38AF12B0' },
        { name: 'Acknowledgment Number', bits: '32 bits', byteOffset: '8-11', descAr: 'رقم البايت التالي المتوقع استلامه لتأكيد الوصول', exampleValue: '0x38AF12B1' },
        { name: 'Data Offset (Header Length)', bits: '4 bits', byteOffset: '12', descAr: 'طول الترويسة بوحدات كلمات 32-بت (عادة 5=20 بايت)', exampleValue: '5 (20 Bytes)' },
        { name: 'Reserved', bits: '3 bits', byteOffset: '12', descAr: 'حقول محجوزة للتطوير المستقبلي (يجب أن تكون أصفاراً)', exampleValue: '000' },
        { name: 'Flags (SYN, ACK, FIN, RST, PSH, URG)', bits: '9 bits', byteOffset: '12-13', descAr: 'أعلام التحكم لإدارة الاتصال والمصافحة الثلاثية', exampleValue: '0x012 (SYN, ACK)' },
        { name: 'Window Size', bits: '16 bits', byteOffset: '14-15', descAr: 'حجم نافذة الاستقبال المتبقية للتحكم في التدفق (Flow Control)', exampleValue: '65535' },
        { name: 'Checksum', bits: '16 bits', byteOffset: '16-17', descAr: 'مجموع التحقق الرياضي للترويسة والبيانات والترويسة الوهمية', exampleValue: '0x7E3A' },
        { name: 'Urgent Pointer', bits: '16 bits', byteOffset: '18-19', descAr: 'إشارة إلى موضع البيانات العاجلة عند تفعيل علم URG', exampleValue: '0x0000' },
      ]
    };
  } else {
    // Default IPv4 / Ethernet Frame Header
    headerDiagram = {
      id: 'diag-header-ipv4',
      type: 'header',
      titleAr: 'تشريح ترويسة حزمة IPv4 الرسمية (20 بايت) وفق RFC 791',
      titleEn: 'Internet Protocol v4 (IPv4) Packet Header Dissection',
      captionAr: 'تشريح حقول الترويسة الرئيسية المسؤولة عن التوجيه والتجزئة وتتبع القفزات.',
      headerFields: [
        { name: 'Version', bits: '4 bits', byteOffset: '0', descAr: 'إصدار بروتوكول الإنترنت (القيمة 4 لـ IPv4)', exampleValue: '4' },
        { name: 'IHL (Header Length)', bits: '4 bits', byteOffset: '0', descAr: 'طول الترويسة بكلمات 32-بت (القيمة 5 = 20 بايت)', exampleValue: '5' },
        { name: 'DSCP / ToS', bits: '8 bits', byteOffset: '1', descAr: 'تصنيف جودة الخدمة وأولوية الحزم (Differentiated Services)', exampleValue: '0x00' },
        { name: 'Total Length', bits: '16 bits', byteOffset: '2-3', descAr: 'الطول الإجمالي للحزمة بالبايت (الترويسة + البيانات)', exampleValue: '1500' },
        { name: 'Identification', bits: '16 bits', byteOffset: '4-5', descAr: 'معرف فريد لتجميع شظايا الحزمة عند التجزئة', exampleValue: '0x1C4A' },
        { name: 'Flags (DF, MF)', bits: '3 bits', byteOffset: '6', descAr: 'أعلام التجزئة (Don\'t Fragment / More Fragments)', exampleValue: '010 (DF=1)' },
        { name: 'Fragment Offset', bits: '13 bits', byteOffset: '6-7', descAr: 'موضع الشظية الحالية نسبة إلى بداية الحزمة الأصلية', exampleValue: '0' },
        { name: 'TTL (Time to Live)', bits: '8 bits', byteOffset: '8', descAr: 'عداد القفزات؛ ينخفض بمقدار 1 عند كل راوتر لمنع الدوران اللانهائي', exampleValue: '64' },
        { name: 'Protocol', bits: '8 bits', byteOffset: '9', descAr: 'بروتوكول الطبقة الرابعة المحمول (6=TCP, 17=UDP, 89=OSPF)', exampleValue: '6 (TCP)' },
        { name: 'Header Checksum', bits: '16 bits', byteOffset: '10-11', descAr: 'التحقق الرياضي من سلامة حقول ترويسة الـ IP فقط', exampleValue: '0x9B12' },
        { name: 'Source IP Address', bits: '32 bits', byteOffset: '12-15', descAr: 'عنوان الإنترنت للجهاز المصدري المنشئ للحزمة', exampleValue: '192.168.1.10' },
        { name: 'Destination IP Address', bits: '32 bits', byteOffset: '16-19', descAr: 'عنوان الإنترنت للهدف النهائي للحزمة', exampleValue: '10.0.0.50' },
      ]
    };
  }

  // 3. SEQUENCE FLOW DIAGRAM
  let flowDiagram: DiagramData;
  if (title.includes('tcp')) {
    flowDiagram = {
      id: 'diag-flow-tcp-handshake',
      type: 'flow',
      titleAr: 'المخطط التتابعي للمصافحة الثلاثية في TCP (3-Way Handshake)',
      titleEn: 'TCP 3-Way Handshake & Connection Teardown Sequence',
      captionAr: 'تبادل حزم SYN و SYN-ACK و ACK لتأسيس الاتصال ومزامنة الأرقام التسلسلية.',
      sequenceSteps: [
        { step: 1, fromNode: 'Client', toNode: 'Server', protocolPacket: 'SYN (Seq=1000)', labelAr: 'طلب بدء الاتصال (Synchronize)', detailsAr: 'يرسل العميل حزمة برقم تسلسلي أولي ISN=1000 مع طلب فتح قناة موثوقة.' },
        { step: 2, fromNode: 'Server', toNode: 'Client', protocolPacket: 'SYN-ACK (Seq=5000, Ack=1001)', labelAr: 'قبول وتأكيد الاتصال والمزامنة العكسية', detailsAr: 'الخادم يوافق برقم تأكيد Ack=1001 ويرسل رقمه التسلسلي الخاص Seq=5000.' },
        { step: 3, fromNode: 'Client', toNode: 'Server', protocolPacket: 'ACK (Seq=1001, Ack=5001)', labelAr: 'التأكيد النهائي وتأسيس الاتصال رسمياً', detailsAr: 'العميل يؤكد استلام موافقة الخادم؛ يصبح الاتصال في وضع ESTABLISHED وتبدأ البيانات.' },
        { step: 4, fromNode: 'Client', toNode: 'Server', protocolPacket: 'DATA (HTTP Request GET /)', labelAr: 'بدء نقل البيانات المحمولة', detailsAr: 'إرسال أول بايت من طلب الويب الحقيقي داخل القناة الموثوقة المؤسسة.' },
      ]
    };
  } else if (title.includes('ospf')) {
    flowDiagram = {
      id: 'diag-flow-ospf-adjacency',
      type: 'flow',
      titleAr: 'المخطط التتابعي لتأسيس علاقة الجوار في OSPF (Adjacency Formation Flow)',
      titleEn: 'OSPF Adjacency Exchange Sequence Flow',
      captionAr: 'التسلسل الزمني للرسائل من لحظة اكتشاف الجار عبر Hello حتى الوصول لوضع FULL.',
      sequenceSteps: [
        { step: 1, fromNode: 'Router-A', toNode: 'Router-B', protocolPacket: 'Hello (Multicast 224.0.0.5)', labelAr: 'إرسال نبضة Hello الأولى (حالة Init)', detailsAr: 'الراوتر A يعلن عن وجوده ويرسل قائمة الجيران التي يعرفها (فارغة حالياً).' },
        { step: 2, fromNode: 'Router-B', toNode: 'Router-A', protocolPacket: 'Hello (Neighbors: Router-A)', labelAr: 'الرد بنبضة Hello متضمنة معرف الجار (حالة 2-Way)', detailsAr: 'الراوتر B يرد ويضمن معرف Router-A في قائمته، مما يحقق الاتصال الثنائي.' },
        { step: 3, fromNode: 'Router-A', toNode: 'Router-B', protocolPacket: 'DBD (ExStart: Master/Slave)', labelAr: 'التفاوض على السيد والتابع (ExStart State)', detailsAr: 'تحديد من يبدأ تبادل ملخصات قاعدة البيانات واختيار رقم التسلسل الأولي.' },
        { step: 4, fromNode: 'Router-B', toNode: 'Router-A', protocolPacket: 'DBD (Exchange: LSA Summaries)', labelAr: 'تبادل ملخصات الـ LSDB (Exchange State)', detailsAr: 'إرسال ترويسات كافة الـ LSAs الموجودة لمقارنة ما ينقص كل طرف.' },
        { step: 5, fromNode: 'Router-A', toNode: 'Router-B', protocolPacket: 'LSR (Link-State Request)', labelAr: 'طلب السجلات المفقودة (Loading State)', detailsAr: 'طلب تفاصيل المسارات التي لا يملكها الراوتر A.' },
        { step: 6, fromNode: 'Router-B', toNode: 'Router-A', protocolPacket: 'LSU + LSAck (Update & Ack)', labelAr: 'إرسال التفاصيل واكتمال التزامن (FULL State)', detailsAr: 'تحديث كامل وتطابق تام في قاعدة البيانات بين الراوترين؛ اكتمال الجوار.' },
      ]
    };
  } else {
    flowDiagram = {
      id: 'diag-flow-generic',
      type: 'flow',
      titleAr: `المخطط التتابعي للتبادل والمعالجة: ${topic.titleAr}`,
      titleEn: 'Protocol Exchange & Processing Sequence Flow',
      captionAr: 'المراحل التتابعية لتبادل الرسائل وتحديث جداول التوجيه والتبديل.',
      sequenceSteps: [
        { step: 1, fromNode: 'Endpoint-A', toNode: 'Switch-Gateway', protocolPacket: 'Control Request / Discovery', labelAr: 'مرحلة الاستكشاف والطلب الأولي', detailsAr: 'إرسال طلب الاستكشاف للتعرف على معالم المسار وتسجيل العناوين الأولية.' },
        { step: 2, fromNode: 'Switch-Gateway', toNode: 'Destination-Node', protocolPacket: 'Policy & Forwarding Check', labelAr: 'فحص القواعد والتمرير عبر الشبكة', detailsAr: 'السويتش أو الراوتر يطابق الحزمة مع جداول TCAM لتحديد المنفذ المناسب.' },
        { step: 3, fromNode: 'Destination-Node', toNode: 'Endpoint-A', protocolPacket: 'Direct Response / Confirmation', labelAr: 'الرد الموثوق وإكمال حلقة الاتصال', detailsAr: 'استلام الرد وتحديث جداول الـ Cache المحلية لضمان استقرار الاتصالات القادمة.' },
      ]
    };
  }

  // 4. CAMPUS ENTERPRISE TOPOLOGY
  const campusTopologyDiagram: DiagramData = {
    id: 'diag-campus-hierarchical-core',
    type: 'topology',
    titleAr: 'المخطط المعماري المؤسسي ثلاثي الطبقات (Cisco 3-Tier Campus)',
    titleEn: 'Cisco Enterprise 3-Tier Campus Architecture',
    captionAr: 'الهيكل المعياري لتوزيع النطاقات: Core فائق السرعة، Distribution للسياسات، و Access للمستخدمين.',
    nodes: [
      { id: 'c1', label: 'Core-SW1', subLabel: 'High-Speed Backbone', role: 'switch', x: 35, y: 20, ip: '10.254.0.1', status: 'root' },
      { id: 'c2', label: 'Core-SW2', subLabel: 'High-Speed Backbone', role: 'switch', x: 65, y: 20, ip: '10.254.0.2', status: 'root' },
      { id: 'd1', label: 'Dist-SW1', subLabel: 'Policy / Inter-VLAN', role: 'l3switch', x: 25, y: 50, ip: '10.1.0.1', status: 'forwarding' },
      { id: 'd2', label: 'Dist-SW2', subLabel: 'Policy / Inter-VLAN', role: 'l3switch', x: 75, y: 50, ip: '10.2.0.1', status: 'forwarding' },
      { id: 'a1', label: 'Access-SW1', subLabel: 'User Closets (PoE)', role: 'switch', x: 20, y: 80, vlan: 10 },
      { id: 'a2', label: 'Access-SW2', subLabel: 'User Closets (PoE)', role: 'switch', x: 50, y: 80, vlan: 20 },
      { id: 'a3', label: 'Access-SW3', subLabel: 'Servers & Storage', role: 'switch', x: 80, y: 80, vlan: 30 },
    ],
    links: [
      { from: 'c1', to: 'c2', label: '40G EtherChannel', status: 'forwarding' },
      { from: 'c1', to: 'd1', label: '10G Fiber', status: 'forwarding' },
      { from: 'c1', to: 'd2', label: '10G Fiber', status: 'forwarding' },
      { from: 'c2', to: 'd1', label: '10G Fiber', status: 'forwarding' },
      { from: 'c2', to: 'd2', label: '10G Fiber', status: 'forwarding' },
      { from: 'd1', to: 'a1', label: '1G Trunk', status: 'forwarding' },
      { from: 'd1', to: 'a2', label: '1G Trunk', status: 'forwarding' },
      { from: 'd2', to: 'a2', label: '1G Trunk (Backup)', style: 'dashed', status: 'forwarding' },
      { from: 'd2', to: 'a3', label: '10G Server Uplink', status: 'forwarding' },
    ]
  };

  return {
    topologyDiagram,
    headerDiagram,
    flowDiagram,
    campusTopologyDiagram
  };
}
