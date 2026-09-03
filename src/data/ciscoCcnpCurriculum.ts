import { CurriculumSection } from '../types';
import { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

export const CCNP_CURRICULUM_MODULES: CurriculumSection[] = [
  // =========================================================================
  // UNIT 1: DUAL-STACK ENTERPRISE ARCHITECTURE & HIGH AVAILABILITY (ENCOR 1.0)
  // =========================================================================
  {
    id: 'ccnp-unit-1-architecture-ha',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '350-401 ENCOR',
    unitNumber: 1,
    unitTitleAr: 'الوحدة 1: معمارية المؤسسات المتقدمة وتوفرية الأنظمة العالية (Architecture & HA)',
    unitTitleEn: 'Unit 1: Dual-Stack Architecture, Hardware Forwarding (CEF/TCAM) & High Availability',
    moduleBadge: 'ENCOR Domain 1.0',
    officialDomain: '1.0 Architecture & High Availability (15% of Exam)',
    summaryAr: 'بنية التوجيه فائق السرعة عبر الرقاقات المادية Cisco Express Forwarding (CEF)، جداول الـ TCAM والـ FIB، تقنيات التبديل الحي الفوري Stateful Switchover (SSO) و Non-Stop Forwarding (NSF)، والافتراضية بـ StackWise Virtual.',
    summaryEn: 'Dissection of Cisco Express Forwarding (CEF), FIB and Adjacency tables, TCAM hardware lookup architecture, Stateful Switchover (SSO), NSF, and StackWise Virtual chassis clustering.',
    topics: [
      {
        id: 'ccnp-topic-1-1-cef-tcam-hardware-forwarding',
        track: 'ccnp',
        titleAr: '1.1 بنية التمرير فائق السرعة عبر الرقاقات المادية (Cisco CEF, FIB, Adjacency Table & TCAM)',
        titleEn: '1.1 Hardware Forwarding Engines: Cisco Express Forwarding (CEF), FIB, Adjacency & TCAM',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §1.1 & §1.2',
        officialReferences: [
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'ISBN: 978-1587145230', citation: 'Chapter 2: Forwarding Architectures and High Availability' },
          { title: 'Cisco Whitepaper: Understanding CEF and TCAM Allocation', type: 'Cisco Whitepaper', code: 'WP-CEF-TCAM-2023', citation: 'Hardware Switching Architecture on Catalyst 9000' }
        ],
        summaryAr: 'تحليل الفرق الجذري بين Process Switching و Fast Switching و Cisco Express Forwarding (CEF)، وكيف تخزن جداول الـ FIB والـ Adjacency في رقاقات الـ TCAM لمعالجة ملايين الحزم في الثانية (Line-Rate).',
        summaryEn: 'Deep architectural dive into Control Plane vs Data Plane hardware separation: FIB, Adjacency Table, CEF Polarisation, and Ternary Content Addressable Memory (TCAM) operation.',
        contentMarkdownAr: `### 1. تطور محركات التوجيه في سيسكو (Switching Evolution):
1. **Process Switching (الأبطأ):** كل حزمة منفردة تذهب للمعالج الرئيسي (CPU)، الذي يقوم بفك الترويسة واستشارة الـ Routing Table وإعادة حساب الـ Checksum.
2. **Fast Switching (Route-Once, Switch-Many):** أول حزمة تعالج بالمعالج، ثم تخزن النتيجة في Route Cache لتمرير باقي حزم نفس الجلسة بالـ ASIC.
3. **Cisco Express Forwarding - CEF (المعيار الحديث):** معالجة مادية 100% مبنية مسبقاً عبر الرقاقات الإلكترونية (Pre-computed Hardware Tables) دون انتظار وصول أي حزمة!

---

### 2. بنية جداول الـ CEF:
- **Forwarding Information Base (FIB):** نسخة طبق الأصل من الـ Routing Table ولكنها منظمة كشجرة بحث ثنائية سريعة جداً (mtree) ومحسوبة مسبقاً في رقاقات السويتش المادية.
- **Adjacency Table:** يحفظ ترويسات الطبقة الثانية (Layer 2 MAC Rewrite Headers) لكافة الأجهزة المتصلة المجاورة دون الحاجة لطلب ARP عند وصول الحزمة.
- **TCAM (Ternary Content Addressable Memory):** ذاكرة إلكترونية فائقة السرعة تبحث عن 3 قيم (\`0\` و \`1\` و \`Don't Care X\`) وتنفذ قرارات الـ ACLs والـ QoS والتوجيه في نبضة ساعة واحدة (Single Clock Cycle)!`,
        contentMarkdownEn: `### 1. CEF Architecture:
- **FIB (Forwarding Information Base):** Derived from RIB; pre-compiled for ASIC lookup.
- **Adjacency Table:** Derived from ARP table; holds pre-built Layer 2 rewrite headers.
- **TCAM:** Evaluates routing prefixes, ACLs, and QoS in a single clock cycle.

### 2. CEF Commands:
\`\`\`cisco
ip cef
show ip cef 192.168.10.50 detail
show ip adjacency detail
show platform hardware fed switch active fwd-asic tcam utilization
\`\`\``,
        technicalHighlights: [
          'عند تعطيل CEF أو حدوث ظروف خاصة (مثل حزم IP Options أو MTU Exceeded)، تسقط الحزمة إلى المعالج (Punt to CPU / Glean Adjacency).',
          'تقنية CEF Polarization قد تحدث عند استخدام خوارزميات Hash متطابقة عبر مسارات متعددة، ويتم علاجها بـ ip cef load-sharing algorithm include-ports.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip cef 10.10.10.1 detail',
            deviceType: 'l3switch',
            deviceName: 'CAT9500-CORE-01',
            mode: 'priv',
            category: 'CEF FIB Lookup',
            explanationAr: 'عرض مدخل جدول الـ FIB الدقيق والعنوان التالي وترويسة الـ MAC المحسوبة مسبقاً في Adjacency Table.',
            explanationEn: 'Displays hardware FIB resolution and Layer 2 rewrite string derived from the Adjacency table.',
            output: `10.10.10.0/24, epoch 2, flags [rib defined prefix]
  recursive via 172.16.1.2
    nexthop 172.16.1.2 GigabitEthernet1/0/1 label 10024-(local:10018)
      Hardware Adjacency: 00505684A10200505684A1010800`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'جواز السفر الإلكتروني ببوابة المطار الآلية',
          titleEn: 'Biometric E-Gate Passport Scanner vs Manual Customs Officer',
          storyAr: 'الـ Process Switching يشبه ضابط جمارك يفحص جواز السفر صفحة صفحة ويسألك عن رحلتك (بطيء). أما الـ CEF فيشبه البوابة الإلكترونية البيومترية الذكية: تقرأ بصمتك وتقارنها بقاعدة بيانات مادية مبرمجة مسبقاً داخل الرقاقات وتفتح البوابة في جزء من الثانية (Line-Rate).',
          storyEn: 'Process switching is a customs border officer manually inspecting each page of every passport. CEF is an automated biometric e-gate that reads your microchip and opens the turnstile in milliseconds using pre-indexed hardware databases.',
          mappingTable: [
            { realLife: 'قاعدة بيانات البوابة الذكية المحسوبة مسبقاً', networkTech: 'CEF Forwarding Information Base (FIB)', ciscoTerm: 'show ip cef' },
            { realLife: 'البصمة المسجلة المربوطة بالوجه مباشرة', networkTech: 'Adjacency Table (L2 MAC Cache)', ciscoTerm: 'show adjacency' },
            { realLife: 'الحاسوب فائق السرعة داخل البوابة', networkTech: 'TCAM ASIC Silicon Engine', ciscoTerm: 'TCAM Hardware' }
          ]
        }
      },
      {
        id: 'ccnp-topic-1-2-high-availability-sso-nsf-stackwise',
        track: 'ccnp',
        titleAr: '1.2 التوفرية العالية واستمرارية الأعمال (SSO, NSF & Cisco StackWise Virtual)',
        titleEn: '1.2 High Availability: Stateful Switchover (SSO), Non-Stop Forwarding (NSF) & StackWise Virtual',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §1.3 & §1.4',
        officialReferences: [
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'Chapter 2', citation: 'High Availability and Redundancy Architecture' },
          { title: 'Cisco Catalyst 9000 StackWise Virtual Configuration Guide', type: 'Cisco Configuration Guide', code: 'C9K-SWV-2024', citation: 'Clustering and Dual-Supervisor Resiliency' }
        ],
        summaryAr: 'منع انقطاع الخدمات في مراكز البيانات: مواءمة معالجي التوجيه (Dual Supervisors) عبر Stateful Switchover (SSO)، والحفاظ على تمرير البيانات أثناء إعادة تشغيل البروتوكول عبر Non-Stop Forwarding (NSF)، ودمج هيكلين في هيكل منطقي واحد بـ StackWise Virtual.',
        summaryEn: 'Enterprise chassis resiliency: Stateful Switchover (SSO) memory synchronization, Non-Stop Forwarding (NSF) graceful restart, and StackWise Virtual dual-chassis clustering over 100G 40G StackWise Virtual Links (SVL).',
        contentMarkdownAr: `### 1. تقنية التبديل مع الحفاظ على الحالة (Stateful Switchover - SSO):
- في أجهزة الشاسيه المزدوجة (Dual Supervisors مثل Catalyst 9600):
- **Active Supervisor:** يدير الشبكة بالكامل ويحدث الـ FIB.
- **Standby Supervisor (Hot Standby):** ينسخ كافة الجلسات وحالة البروتوكولات والـ MAC Table والـ ARP باستمرار في الذاكرة الحية.
- عند تعطل المعالج النشط، يستلم المعالج الاحتياطي الإدارة في **أقل من 50 مللي ثانية (Sub-50ms)** دون قطع أي جلسة اتصال أو اتصال هاتف VoIP!

---

### 2. التوجيه المستمر بدون توقف (Non-Stop Forwarding - NSF / Graceful Restart):
- عندما ينهار معالج الـ Control Plane، تستمر رقاقات الـ Data Plane (ASICs) المادية في تمرير الحزم بناءً على جدول الـ FIB الحالي دون توقف.
- يطلب الراوتر من جيرانه (OSPF/BGP/IS-IS) في رسائل الـ Graceful Restart عدم قطع علاقة الجوار حتى يعيد بناء جدول التوجيه بهدوء.

---

### 3. بنية Cisco StackWise Virtual (SVL):
- دمج سويتشين منفصلين تماماً (مثل سويتشين Catalyst 9500) عبر كوابل ألياف ضوئية فائقة السرعة (StackWise Virtual Link - SVL) ليظهرا كـ سويتش واحد منطقي له Single Control Plane وعنوان IP إدارة واحد.
- استخدام رابط **Dual-Active Detection (DAD)** لمنع ظاهرة Split-Brain الكارثية.`,
        contentMarkdownEn: `### 1. SSO & NSF Redundancy:
- **SSO:** Synchronizes running-state and protocol sessions between active and standby supervisors.
- **NSF (Graceful Restart):** Data plane continues forwarding during control plane switchover while neighbors hold routing state.

### 2. Cisco Redundancy Configuration:
\`\`\`cisco
redundancy
 mode sso
!
router ospf 1
 nsf cisco
!
! StackWise Virtual Setup
stackwise-virtual
 domain 10
!
interface TenGigabitEthernet1/0/48
 stackwise-virtual link 1
!
interface GigabitEthernet1/0/47
 stackwise-virtual dual-active-detection
\`\`\``,
        technicalHighlights: [
          'تقنية StackWise Virtual تلغي الحاجة لبروتوكولات STP و FHRP (HSRP/VRRP) في طبقة التوزيع لأن كلا السويتشين يعملان كـ Active-Active عبر Multi-chassis EtherChannel (MEC).',
          'رابط الـ DAD ضروري لاكتشاف انقطاع كابل الـ SVL الرئيسي، وإذا انقطع يضع السويتش الثانوي منافذه في حالة Recovery لمنع ازدواجية العناوين.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show redundancy',
            deviceType: 'l3switch',
            deviceName: 'CAT9600-CORE',
            mode: 'priv',
            category: 'Supervisor Redundancy',
            explanationAr: 'التحقق من حالة المواءمة الكاملة بين المعالج النشط والمعالج الاحتياطي Hot Standby بنمط SSO.',
            explanationEn: 'Displays operational state of dual supervisors and SSO memory sync status.',
            output: `Redundant System Information :
------------------------------
       Available system uptime = 180 days, 14 hours
Switchovers system experienced = 0
              Standby sub-mode = Fast
                   Configured  = Stateful Switchover (SSO)
                     Operating = Stateful Switchover (SSO)
                Maintenance Mode = Disabled

Peer (Slot: 2) Information :
----------------------------
         Operating sub-mode = Stateful Switchover (SSO)
                Current State = STANDBY HOT`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'مساعد الطيار في قمرة القيادة والتحكم المزدوج',
          titleEn: 'Airplane Co-Pilot in Cockpit with Dual-Yoke Synchronization',
          storyAr: 'تقنية SSO تشبه الطيار ومساعده في قمرة القيادة: يمسك الاثنان بمقود الطائرة في نفس الوقت، ومساعد الطيار يرى كافة العدادات والمسار لحظة بلحظة. إذا أغمي على القبطان، يستلم المساعد المقود في نفس الثانية دون أن تهتز الطائرة شبراً واحداً (Sub-50ms Failover).',
          storyEn: 'SSO and NSF are like a synchronized dual-cockpit airline system: both pilot and copilot have their hands on linked controls with identical flight instruments. If the pilot loses consciousness, the copilot takes control instantaneously without passenger awareness.',
          mappingTable: [
            { realLife: 'القبطان الذي يقود الطائرة حالياً', networkTech: 'Active Supervisor Engine', ciscoTerm: 'Supervisor Slot 1 (ACTIVE)' },
            { realLife: 'مساعد الطيار الممسك بالمقود في نفس اللحظة', networkTech: 'Hot Standby Supervisor', ciscoTerm: 'Supervisor Slot 2 (STANDBY HOT)' },
            { realLife: 'استمرار الطيران بالقصور الذاتي أثناء استلام المقود', networkTech: 'Non-Stop Forwarding (NSF Data Plane)', ciscoTerm: 'NSF / Graceful Restart' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // UNIT 2: ADVANCED LAYER 2 SWITCHING (ENCOR 2.0)
  // =========================================================================
  {
    id: 'ccnp-unit-2-advanced-switching',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '350-401 ENCOR',
    unitNumber: 2,
    unitTitleAr: 'الوحدة 2: تبديل الطبقة الثانية المتقدم (Advanced Layer 2 & Multiple Spanning Tree)',
    unitTitleEn: 'Unit 2: Advanced L2 Switching, MSTP (802.1s), Private VLANs & Spanning Tree Protection',
    moduleBadge: 'ENCOR Domain 2.0',
    officialDomain: '2.0 Advanced Switching & Protection (15% of Exam)',
    summaryAr: 'هندسة الـ Multiple Spanning Tree Protocol (MSTP IEEE 802.1s)، وعزل الأجهزة بـ Private VLANs (Isolated, Community, Promiscuous)، وحماية الـ STP بـ Root Guard و Loop Guard و UDLD.',
    summaryEn: 'Deep implementation of IEEE 802.1s MSTP instance mapping, Private VLAN port isolation architecture, and advanced Layer 2 hardening toolkits (Root Guard, Loop Guard, BPDU Filter, and UDLD).',
    topics: [
      {
        id: 'ccnp-topic-2-1-multiple-spanning-tree-mstp',
        track: 'ccnp',
        titleAr: '2.1 بروتوكول الشجرة الممتدة المتعددة MSTP (IEEE 802.1s) وهندسة الـ Instances',
        titleEn: '2.1 Multiple Spanning Tree Protocol (MSTP IEEE 802.1s), MST Regions & CIST Architecture',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §2.1 & §2.2',
        officialReferences: [
          { title: 'IEEE 802.1Q-2018 - Multiple Spanning Tree Protocol', type: 'IEEE Standard', code: 'IEEE 802.1s Clause', citation: 'MSTP Region and Instance Architecture' },
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'Chapter 3', citation: 'Advanced Spanning Tree Protocols' }
        ],
        summaryAr: 'حل معضلة استهلاك المعالج في PVST+: تجميع مئات الـ VLANs في نسخ شجرة محدودة (MST Instances)، وتعريف الـ MST Regions، وتوزيع الحمل (Load Balancing) بين الـ Trunks بكفاءة.',
        summaryEn: 'Optimizing STP CPU overhead by grouping thousands of VLANs into deterministic MST instances (MSTI) mapped to Common and Internal Spanning Tree (CIST) boundaries.',
        contentMarkdownAr: `### 1. لماذا نحتاج MSTP (IEEE 802.1s)؟
- في بروتوكول Cisco PVST+، إذا كان لديك 500 VLAN، فإن السويتش ينشئ 500 عملية STP منفصلة ويرسل 500 BPDU كل ثانيتين، مما يستنزف معالج السويتش والذاكرة.
- **حل MSTP:** تجميع الـ VLANs في عدد قليل من الـ Instances (مثال: Instance 1 للـ VLANs الفردية، و Instance 2 للـ VLANs الزوجية).

---

### 2. شروط تطابق منطقة الـ MST Region:
لكي تعتبر السويتشات في نفس الـ MST Region وتتبادل الـ M-BPDUs، يجب أن تتطابق العناصر الثلاثة التالية **حرفياً**:
1. **Region Configuration Name:** اسم المنطقة (حساس لحالة الأحرف).
2. **Revision Number:** رقم المراجعة (قيمة من 0 إلى 65535).
3. **VLAN-to-Instance Mapping Hash:** جدول ربط الـ VLANs بالـ Instances (يحسب داخلياً بـ MD5 Digest).

---

### 3. بنية الـ CIST والـ IST:
- **Instance 0 (IST - Internal Spanning Tree):** النسخة الافتراضية المسؤولة عن تبادل الـ BPDUs مع العالم الخارجي والتعامل مع سويتشات PVST+ القديمة.`,
        contentMarkdownEn: `### 1. MSTP Advantages:
- Scales to thousands of VLANs using minimal instances (e.g., 2 instances instead of 1000 PVST trees).
- IEEE standard (multi-vendor interoperability).

### 2. Cisco MST Configuration:
\`\`\`cisco
spanning-tree mode mst
!
spanning-tree mst configuration
 name CORP_MST_REGION
 revision 10
 instance 1 vlan 1-500
 instance 2 vlan 501-1000
!
! Root Bridge tuning per Instance
spanning-tree mst 1 root primary
spanning-tree mst 2 root secondary
\`\`\``,
        technicalHighlights: [
          'تغيير أي تعيين VLAN إلى Instance يغير قيمة الـ MD5 Digest للمنطقة مما قد يفصل السويتش عن منطقته مؤقتاً.',
          'الـ MSTP متوافق بالكامل مع RSTP من حيث سرعة التقارب اللحظية (Sub-second Convergence).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show spanning-tree mst configuration',
            deviceType: 'l3switch',
            deviceName: 'CAT9500-DIST-01',
            mode: 'priv',
            category: 'MST Configuration',
            explanationAr: 'عرض اسم منطقة الـ MST ورقم الـ Revision وقيمة الـ MD5 Digest وجدول توزيع الـ VLANs.',
            explanationEn: 'Displays current MST region parameters and computed configuration digest MD5.',
            output: `Name      [CORP_MST_REGION]
Revision  10  Instances configured 3

Digest   : 0x9D4E2F11AA34BC890254EE71A912D8C3

Instance  Vlans mapped
--------  ---------------------------------------------------------------------
0         1001-4094
1         1-500
2         501-1000`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'حافلات النقل الجماعي للركاب بدلاً من سيارة لكل مواطن',
          titleEn: 'Public Transit Buses for Commuters vs Individual Taxis',
          storyAr: 'بروتوكول PVST+ يشبه توفير سيارة أجرة خاصة لكل مواطن (VLAN) مما يسبب ازدحاماً مرورياً خانقاً. أما MSTP فيشبه تسيير حافلتين كبيرتين: الحافلة 1 تنقل ركاب الأحياء الشمالية (VLAN 1-500)، والحافلة 2 تنقل ركاب الأحياء الجنوبية (VLAN 501-1000).',
          storyEn: 'PVST+ gives every single traveler (VLAN) their own private taxi, overloading the highway. MSTP provisions two organized high-capacity double-decker buses (MST Instances) carrying entire district populations along optimized routes.',
          mappingTable: [
            { realLife: 'تسيير حافلة واحدة لنقل مئات الركاب', networkTech: 'MST Instance (MSTI)', ciscoTerm: 'spanning-tree mst instance X' },
            { realLife: 'نطاق شركة النقل الموحدة للمدينة', networkTech: 'MST Region Name & Revision', ciscoTerm: 'spanning-tree mst configuration' }
          ]
        }
      },
      {
        id: 'ccnp-topic-2-2-private-vlans-stp-toolkit',
        track: 'ccnp',
        titleAr: '2.2 الشبكات الخاصة Private VLANs ومجموعة أدوات حماية الـ STP المتقدمة',
        titleEn: '2.2 Private VLANs (PVLAN) & STP Hardening: Root Guard, Loop Guard, BPDU Filter & UDLD',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §2.3 & §2.4',
        officialReferences: [
          { title: 'RFC 5517 - Cisco Systems Private VLANs: Scalable Security in Shared Subnets', type: 'RFC', code: 'RFC 5517', citation: 'IETF Private VLAN Specification' },
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'Chapter 4', citation: 'Securing Layer 2 Topologies' }
        ],
        summaryAr: 'عزل الخوادم والمستخدمين داخل نفس الـ Subnet عبر Private VLANs (Primary, Isolated, Community, Promiscuous)، وحماية هيكلية Spanning Tree عبر Root Guard و Loop Guard و UniDirectional Link Detection (UDLD).',
        summaryEn: 'Zero-trust Layer 2 isolation using Private VLAN types (Promiscuous, Community, Isolated) and STP topology stability with Root Guard, Loop Guard, and UDLD fiber fault detection.',
        contentMarkdownAr: `### 1. أنواع منافذ و شبكات الـ Private VLANs (PVLAN):
1. **Primary VLAN:** الـ VLAN الرئيسية الحاملة لحركة المرور الإجمالية والـ Gateway.
2. **Secondary Isolated VLAN:** المنافذ المعزولة (Isolated Ports) لا تستطيع التحدث مع بعضها إطلاقاً ولا مع منافذ Community، وتتحدث فقط مع الـ Promiscuous Port (بوابة الراوتر/الجدار الناري).
3. **Secondary Community VLAN:** المنافذ داخل نفس الـ Community تستطيع التحدث مع بعضها ومع الـ Promiscuous Port، ولكن معزولة عن باقي الـ Communities.
4. **Promiscuous Port:** المنفذ المتصل بالراوتر أو السيرفر المشترك، يستطيع التحدث مع كافة المنافذ المعزولة والـ Community.

---

### 2. أدوات حماية الـ Spanning Tree المتقدمة:
- **Root Guard:** يوضع على منافذ السويتش التي لا يجب أن تتصل بـ Root Bridge إطلاقاً. إذا وصل BPDU أعلى أولوية، يوضع المنفذ في حالة \`root-inconsistent\` فوراً لحماية عرش الـ Root!
- **Loop Guard:** يمنع تحول المنافذ الاحتياطية (Alternate/Blocking) إلى Forwarding عند انقطاع وصول الـ BPDUs فجأة بسبب خطأ برمجي، واضعاً المنفذ في \`loop-inconsistent\`.
- **UDLD (UniDirectional Link Detection):** يكتشف انقطاع أحد خطوط كابل الألياف الضوئية المزدوج (Rx/Tx) ويغلق المنفذ لمنع تشكل حلقات أحادية الاتجاه.`,
        contentMarkdownEn: `### 1. Private VLAN Port Types:
- **Promiscuous:** Communicates with all ports.
- **Isolated:** Cannot communicate with any other isolated port on same subnet.
- **Community:** Communicates only with peers in same community and promiscuous gateway.

### 2. Cisco PVLAN & Guard Configuration:
\`\`\`cisco
! PVLAN Setup
vlan 100
 private-vlan primary
 private-vlan association 101,102
vlan 101
 private-vlan isolated
!
interface GigabitEthernet1/0/1
 switchport mode private-vlan host
 switchport private-vlan host-association 100 101
!
! STP Protection
interface GigabitEthernet1/0/24
 spanning-tree guard root
 udld port aggressive
\`\`\``,
        technicalHighlights: [
          'تقنية Private VLANs توفر أمان Zero-Trust في مراكز البيانات والفنادق وتمنع هجمات Lateral Movement بين الخوادم المصابة.',
          'بروتوكول UDLD في النمط Aggressive يرسل 8 تحقيقات سريعة، وإذا لم يستلم رداً يضع المنفذ في حالة err-disabled فوراً.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show vlan private-vlan',
            deviceType: 'l3switch',
            deviceName: 'CAT9300-ACCESS',
            mode: 'priv',
            category: 'Private VLAN Mapping',
            explanationAr: 'عرض جدول ربط الـ Primary VLAN مع الـ Isolated والـ Community VLANs ومنافذها المرتبطة.',
            explanationEn: 'Displays configured Private VLAN associations and assigned physical switchports.',
            output: `Primary  Secondary  Type             Ports
-------  ---------  ---------------  -------------------------------------------
100      101        isolated         Gi1/0/1, Gi1/0/2, Gi1/0/3
100      102        community        Gi1/0/5, Gi1/0/6
100      -          primary          Gi1/0/24 (Promiscuous)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'غرف نزلاء الفندق وبوابة الاستقبال المشتركة',
          titleEn: 'Hotel Guest Rooms and Shared Front Desk Concierge',
          storyAr: 'في الفندق (Private VLAN)، لا يستطيع أي نزيل في غرفته فتح باب غرفة نزيل آخر أو التحدث معه (Isolated Ports)، ولكن يستطيع كل نزيل الاتصال بمكتب الاستقبال وطلب الخدمات (Promiscuous Port).',
          storyEn: 'In a hotel, guests in isolated rooms cannot open each other\'s doors or converse (Isolated Ports), yet every guest has a direct phone line to the front desk concierge (Promiscuous Port) to order amenities.',
          mappingTable: [
            { realLife: 'غرف النزلاء المعزولة عن بعضها بالكامل', networkTech: 'Isolated Secondary VLAN', ciscoTerm: 'private-vlan isolated' },
            { realLife: 'شقق المجموعات السياحية التي تتحدث مع بعضها فقط', networkTech: 'Community Secondary VLAN', ciscoTerm: 'private-vlan community' },
            { realLife: 'مكتب الاستقبال الرئيسي الذي يخدم كافة النزلاء', networkTech: 'Promiscuous Port (Gateway)', ciscoTerm: 'switchport mode private-vlan promiscuous' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // UNIT 3: ADVANCED ENTERPRISE ROUTING (ENARSI 1.0)
  // =========================================================================
  {
    id: 'ccnp-unit-3-advanced-routing-enarsi',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '300-410 ENARSI',
    unitNumber: 3,
    unitTitleAr: 'الوحدة 3: التوجيه المتقدم وهندسة المسارات (Advanced OSPF, EIGRP, BGP & Redistribution)',
    unitTitleEn: 'Unit 3: Advanced Routing: Multi-Area OSPFv3, EIGRP Named Mode, BGP Path Selection & Redistribution',
    moduleBadge: 'ENARSI Domain 1.0',
    officialDomain: '1.0 Advanced Routing Technologies (35% of Exam)',
    summaryAr: 'دراسة شاملة لـ OSPF LSA Types (1-7)، والمناطق الخاصة Stub/NSSA، و EIGRP Named Mode بـ Wide Metrics 64-bit، وخوارزمية اختيار مسار BGP المكونة من 13 خطوة، وإعادة التوزيع مع منع الحلقات بـ Route Tagging.',
    summaryEn: 'Mastery of OSPF LSA Types 1 through 7, Stub/NSSA areas, EIGRP Named Mode 64-bit wide metrics, BGP 13-step best path algorithm, BGP communities, and multi-protocol route redistribution with route tagging.',
    topics: [
      {
        id: 'ccnp-topic-3-1-multi-area-ospf-lsa-types',
        track: 'ccnp',
        titleAr: '3.1 بروتوكول OSPF متعدد المناطق وتشريح رسائل الـ LSAs (Types 1-7) والمناطق الخاصة',
        titleEn: '3.1 Multi-Area OSPF Architecture, LSA Types 1 to 7 & Special Area Types (Stub, Totally Stubby, NSSA)',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENARSI 300-410 §1.1 & §1.2',
        officialReferences: [
          { title: 'RFC 2328 - OSPF Version 2 Specification', type: 'RFC', code: 'RFC 2328', citation: 'Link-State Database Structure and LSA Types' },
          { title: 'RFC 3101 - The OSPF Not-So-Stubby Area (NSSA) Option', type: 'RFC', code: 'RFC 3101', citation: 'Type-7 to Type-5 LSA Translation' },
          { title: 'Cisco Press CCNP Enterprise Advanced Routing ENARSI 300-410 OCG', type: 'Cisco OCG', code: 'ISBN: 978-1587145254', citation: 'Chapter 2 & 3: Advanced OSPF Concepts' }
        ],
        summaryAr: 'تشريح كافة أنواع رسائل الـ LSA في OSPF، والفروقات بين راوترات الـ ABR والـ ASBR، وتخفيف حجم قاعدة البيانات LSDB عبر المناطق الخاصة (Stub, Totally Stubby, NSSA, Totally NSSA).',
        summaryEn: 'Deep architectural dissection of LSA Types 1 through 7, Area Border Routers (ABR), Autonomous System Boundary Routers (ASBR), and database optimization with Special Area types.',
        contentMarkdownAr: `### 1. تشريح أنواع رسائل الـ LSA السبعة (LSA Types):
- **Type 1 (Router LSA):** يولدها كل راوتر لوصف منافذه وروابطه وتكلفة مساراته داخل نفس المنطقة (لا تعبر الـ ABR).
- **Type 2 (Network LSA):** يولدها راوتر الـ DR في شبكات الـ Multi-access لوصف الراوترات المتصلة بنفس السويتش.
- **Type 3 (Summary LSA):** يولدها راوتر الـ ABR لتلخيص وإعلان شبكات منطقة إلى منطقة أخرى (Inter-Area Routes).
- **Type 4 (ASBR Summary LSA):** يولدها راوتر الـ ABR لإبلاغ المناطق الأخرى بمكان وتكلفة الوصول لراوتر الـ ASBR.
- **Type 5 (AS External LSA):** يولدها راوتر الـ ASBR للإعلان عن شبكات تمت إعادة توزيعها من بروتوكول خارجي (مثل BGP/EIGRP).
- **Type 7 (NSSA External LSA):** رسالة خارجية تولد داخل منطقة NSSA فقط، ويقوم الـ ABR بتحويلها إلى Type 5 عند نقلها للمنطقة 0 (Type-7 to Type-5 Translation).

---

### 2. جدول مقارنة المناطق الخاصة (Special Area Types):
| نوع المنطقة | يسمح بـ Type 1 & 2 | يسمح بـ Type 3 (IA) | يحظر Type 5 (External) | يسمح بـ Type 7 (NSSA) | المسار الافتراضي التلقائي |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Standard Area** | نعم | نعم | لا (يسمح) | لا | لا |
| **Stub Area** | نعم | نعم | **نعم (محظور)** | لا | يولد ABR مسار Type 3 Default |
| **Totally Stubby** | نعم | **نعم (محظور)** | **نعم (محظور)** | لا | يولد ABR مسار Type 3 Default |
| **NSSA** | نعم | نعم | **نعم (محظور)** | **نعم (يسمح)** | يحتاج أمر \`default-information-originate\` |
| **Totally NSSA** | نعم | **نعم (محظور)** | **نعم (محظور)** | **نعم (يسمح)** | يولد ABR مسار Type 3 Default |`,
        contentMarkdownEn: `### 1. OSPF LSA Types Hierarchy:
- **LSA 1:** Router LSA (Intra-Area).
- **LSA 2:** Network LSA (DR Generated).
- **LSA 3:** Summary LSA (Inter-Area via ABR).
- **LSA 4:** ASBR Summary LSA (Points to ASBR).
- **LSA 5:** AS External LSA (Redistributed routes via ASBR).
- **LSA 7:** NSSA External LSA (Translated to LSA 5 by ABR).

### 2. Cisco OSPF Special Area Configuration:
\`\`\`cisco
! On Area 1 Routers (Stub)
router ospf 1
 area 1 stub
!
! On ABR Router (Totally Stubby)
router ospf 1
 area 1 stub no-summary
\`\`\``,
        technicalHighlights: [
          'المناطق الخاصة تحمي الراوترات الضعيفة في الفروع من انهيار الذاكرة عند حدوث اهتزاز مسارات خارجية (External Route Flapping).',
          'الوصلات الافتراضية (Virtual Links) تستخدم لربط منطقة منفصلة بمنطقة Backbone Area 0 عبر منطقة عبور (Transit Area).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip ospf database',
            deviceType: 'router',
            deviceName: 'R1-ABR-EDGE',
            mode: 'priv',
            category: 'OSPF Database',
            explanationAr: 'عرض قاعدة بيانات الـ LSDB وتصنيف رسائل الـ LSAs حسب أنواعها (Router, Summary, External).',
            explanationEn: 'Displays OSPF link-state database cataloging active LSAs by type and advertising router ID.',
            output: `            OSPF Router with ID (1.1.1.1) (Process ID 1)

                Router Link States (Area 0)
Link ID         ADV Router      Age         Seq#       Checksum Link count
1.1.1.1         1.1.1.1         452         0x80000004 0x004A12 2
2.2.2.2         2.2.2.2         410         0x80000003 0x0089A1 2

                Summary Net Link States (Area 0)
Link ID         ADV Router      Age         Seq#       Checksum
10.10.0.0       1.1.1.1         320         0x80000002 0x001B90

                Type-5 AS External Link States
Link ID         ADV Router      Age         Seq#       Checksum Tag
192.168.100.0   3.3.3.3         180         0x80000001 0x00C411 0`
          }
        ],
        protocolDetails: [PROTOCOL_DEEP_DIVES.OSPF],
        realWorldAnalogy: {
          titleAr: 'سفارات الدول ونظام الحقائب الدبلوماسية الملخصة',
          titleEn: 'National Embassies and Consolidated Diplomatic Briefings',
          storyAr: 'الـ LSAs تشبه تقارير السفارات: السفير المحلي يكتب تقريراً مفصلاً عن مدينته (Type 1)، ثم يرسله لراوتر الـ ABR (السفارة المركزية) الذي يختصر المئات من التقارير في برقية دبلوماسية واحدة موجزة (Type 3 Summary) ليرسلها إلى العاصمة (Area 0).',
          storyEn: 'Inside a provincial territory, field agents write detailed internal status memos (LSA 1). The regional embassy director (ABR) consolidates these thousands of memos into a 1-page summary telegram (LSA 3) dispatched to national headquarters (Area 0).',
          mappingTable: [
            { realLife: 'التقرير الداخلي التفصيلي للمدينة', networkTech: 'Type 1 Router LSA', ciscoTerm: 'Router Link States' },
            { realLife: 'البرقية الدبلوماسية الموجزة بين المقاطعات', networkTech: 'Type 3 Summary LSA', ciscoTerm: 'Summary Net Link States' },
            { realLife: 'التقرير الاستخباري القادم من دولة أجنبية', networkTech: 'Type 5 External LSA', ciscoTerm: 'Type-5 AS External' }
          ]
        }
      },
      {
        id: 'ccnp-topic-3-2-advanced-bgp-path-selection',
        track: 'ccnp',
        titleAr: '3.2 بروتوكول البوابة الحدودية BGP وهندسة خوارزمية اختيار المسار الأفضل',
        titleEn: '3.2 Enterprise BGP Architecture, 13-Step Best Path Algorithm & Traffic Engineering',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENARSI 300-410 §1.5, §1.6 & §1.7',
        officialReferences: [
          { title: 'RFC 4271 - A Border Gateway Protocol 4 (BGP-4)', type: 'RFC', code: 'RFC 4271', citation: 'IETF BGP-4 Base Protocol Standard' },
          { title: 'Cisco Press CCNP Enterprise Advanced Routing ENARSI 300-410 OCG', type: 'Cisco OCG', code: 'Chapter 10 & 11', citation: 'BGP Path Attributes and Selection' }
        ],
        summaryAr: 'تشريح بروتوكول الإنترنت العالمي BGP: أنواع سمات المسار (Well-Known vs Optional)، خوارزمية اختيار المسار الأفضل المكونة من 13 خطوة (Weight, Local_Pref, AS-Path, Origin, MED)، وهندسة التحكم بحركة الترافيك الصادر والوارد.',
        summaryEn: 'Deep analysis of BGP path attributes, loop prevention via AS-Path, eBGP vs iBGP split-horizon, Route Reflectors, and the complete 13-step BGP Best Path decision tree for deterministic traffic engineering.',
        contentMarkdownAr: `### 1. خوارزمية اختيار مسار BGP الأفضل (BGP Best Path Algorithm):
احفظها بالجملة الشهيرة: *"We Love Oranges As Oranges Mean Pure Refreshment"*
1. **Weight (Cisco Proprietary):** أعلى وزن يفوز (افتراضياً 32768 للمسارات المحلية و 0 للمسارات الأخرى، محلي بالراوتر فقط).
2. **Local Preference (RFC Standard):** أعلى Local_Pref يفوز (افتراضياً 100، يمرر داخل كامل الـ AS للتحكم بالترافيك **الصادر Outbound**).
3. **Originate Locally:** تفضيل المسارات المولدة محلياً (\`network\` أو \`redistribute\`) على المسارات المجمعة بـ aggregate-address.
4. **AS-Path Length:** أقصر مسار AS-Path يفوز (يمكن التلاعب به بـ AS-Path Prepending للتحكم بالترافيك **الوارد Inbound**).
5. **Origin Code:** تفضيل \`IGP (i)\` على \`EGP (e)\` على \`Incomplete (?)\`.
6. **MED (Multi-Exit Discriminator):** أقل قيمة MED تفوز (يستخدم لتوجيه الـ AS المجاور عبر أي منفذ يدخل شبكتنا).
7. **eBGP over iBGP:** تفضيل مسارات eBGP القادمة من خارج المؤسسة على مسارات iBGP الداخلية.
8. **Lowest IGP Metric to BGP Next-Hop:** أقل تكلفة للوصول لعنوان الـ Next-Hop في الـ IGP الداخلي (OSPF/EIGRP).
9. **BGP Multipath:** التحقق من إمكانية توزيع الحمل إذا كان مفعلاً (\`maximum-paths\`).
10. **Lowest Router ID / Lowest Neighbor IP:** أقدم مسار، ثم أصغر Router ID لكسر التعادل نهائياً.`,
        contentMarkdownEn: `### 1. BGP Best Path Decision Tree:
1. Highest **Weight** (Cisco local).
2. Highest **LOCAL_PREF** (AS-wide outbound tuning).
3. Locally originated routes.
4. Shortest **AS_PATH** (Inbound tuning via prepending).
5. Lowest **Origin** code (\`IGP < EGP < Incomplete\`).
6. Lowest **MED** (Metric).
7. **eBGP** over **iBGP**.
8. Lowest IGP metric to Next-Hop.
9. Lowest Router ID.

### 2. Cisco BGP Policy Engineering:
\`\`\`cisco
router bgp 65001
 neighbor 203.0.113.2 remote-as 65002
 neighbor 203.0.113.2 route-map PREFER_ISP1_IN in
 neighbor 203.0.113.2 route-map INFLUENCE_ISP1_OUT out
!
route-map PREFER_ISP1_IN permit 10
 set local-preference 200
!
route-map INFLUENCE_ISP1_OUT permit 10
 set as-path prepend 65001 65001 65001
\`\`\``,
        technicalHighlights: [
          'قاعدة iBGP Split-Horizon تمنع راوتر الـ iBGP من تمرير مسار تعلمه من جار iBGP إلى جار iBGP آخر، ويتم حلها بـ Route Reflectors (RFC 4456).',
          'خاصية BGP Community تتيح وسم المسارات بأرقام معيارية (مثل No-Export و No-Advertise) لتطبيق سياسات موحدة لدى مزودي الخدمة.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip bgp 10.0.0.0/8',
            deviceType: 'router',
            deviceName: 'R1-BGP-CORE',
            mode: 'priv',
            category: 'BGP Path Evaluation',
            explanationAr: 'عرض كافة المسارات المرشحة للبادئة مع رمز المسار الفائز المختار (>) وسمات الـ Local_Pref والـ AS-Path.',
            explanationEn: 'Displays all candidate BGP path entries, metric attributes, and selected best path indicator (>).',
            output: `BGP routing table entry for 10.0.0.0/8, version 14
Paths: (2 available, best #1, table default)
  Advertised to update-groups:
     1         
  65002 65003
    203.0.113.2 from 203.0.113.2 (203.0.113.2)
      Origin IGP, metric 0, localpref 200, weight 0, valid, external, best
      Community: 65001:100
  65004 65003
    198.51.100.2 from 198.51.100.2 (198.51.100.2)
      Origin IGP, metric 0, localpref 100, weight 0, valid, external`
          }
        ],
        protocolDetails: [PROTOCOL_DEEP_DIVES.BGP],
        realWorldAnalogy: {
          titleAr: 'اختيار مسار رحلة الطيران التجاري بين القارات',
          titleEn: 'Selecting International Flight Itinerary Across Airline Alliances',
          storyAr: 'خوارزمية BGP تشبه موقع حجز الطيران: أولاً يفضل شركة الطيران التي يملك معها نقاط ولاء عالية (Local_Pref)، ثم يختار الرحلة ذات أقل عدد محطات ترانزيت (Shortest AS-Path)، وإذا تساوت يقارن سعر التذكرة (MED)، وأخيراً يختار الرحلة المباشرة المتاحة فوراً.',
          storyEn: 'BGP path selection is like booking an international flight: first preferring airlines where you hold elite status (Local_Pref), then choosing flights with fewest country layovers (AS-Path), comparing fuel surcharges (MED), and settling on the direct non-stop booking.',
          mappingTable: [
            { realLife: 'تفضيل شركة الطيران المفضلة للمؤسسة بالكامل', networkTech: 'BGP Local Preference (Default 100)', ciscoTerm: 'set local-preference' },
            { realLife: 'عدد الدول ومحطات التوقف التي تعبرها الطائرة', networkTech: 'BGP AS-Path Attribute', ciscoTerm: 'set as-path prepend' },
            { realLife: 'المسار الفائز المعتمد والمطبوع على التذكرة', networkTech: 'BGP Best Route (> marker)', ciscoTerm: 'BGP Best Path' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // UNIT 4: OVERLAY TECHNOLOGIES & ENTERPRISE VPNS (ENCOR / ENARSI 2.0)
  // =========================================================================
  {
    id: 'ccnp-unit-4-overlays-vpns',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '350-401 ENCOR',
    unitNumber: 4,
    unitTitleAr: 'الوحدة 4: شبكات التراكب والشبكات الافتراضية الخاصة (Overlays, DMVPN, VXLAN & MPLS L3VPN)',
    unitTitleEn: 'Unit 4: Overlay Technologies: DMVPN Phase 1/2/3, IPsec VTI, VXLAN & MPLS L3VPNs',
    moduleBadge: 'ENCOR Domain 4.0',
    officialDomain: '4.0 Overlay & VPN Technologies (15% of Exam)',
    summaryAr: 'بناء شبكات الـ VPN المؤسسية: تقنية DMVPN Phase 3 مع بروتوكول NHRP وأنفاق mGRE، تشفير IPsec IKEv2 عبر Virtual Tunnel Interfaces، وتغليف VXLAN، وشبكات المزودين MPLS L3VPN (VRF & MP-BGP).',
    summaryEn: 'Deep architectural deployment of Dynamic Multipoint VPN (DMVPN Phase 3 NHRP shortcuts), IPsec IKEv2 Virtual Tunnel Interfaces, Data Center VXLAN overlays, and Service Provider MPLS L3VPNs (VRF Lite, MP-BGP VPNv4, and LDP).',
    topics: [
      {
        id: 'ccnp-topic-4-1-dmvpn-phase3-nhrp',
        track: 'ccnp',
        titleAr: '4.1 الشبكات الخاصة الديناميكية متعددة النقاط DMVPN Phase 3 وبروتوكول NHRP',
        titleEn: '4.1 Dynamic Multipoint VPN (DMVPN Phase 1, 2 & 3), mGRE Tunnels & NHRP Shortcuts',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENARSI 300-410 §2.1 & §2.2',
        officialReferences: [
          { title: 'RFC 2332 - NBMA Next Hop Resolution Protocol (NHRP)', type: 'RFC', code: 'RFC 2332', citation: 'IETF NHRP Specification' },
          { title: 'Cisco Press CCNP Enterprise Advanced Routing ENARSI 300-410 OCG', type: 'Cisco OCG', code: 'Chapter 14', citation: 'DMVPN and IPsec Architecture' }
        ],
        summaryAr: 'ربط مئات الفروع دون الحاجة لضبط أنفاق يدوية ثابتة: الفروقات الجوهرية بين DMVPN Phase 1 و Phase 2 و Phase 3، وكيف يؤمن بروتوكول NHRP مع أنفاق mGRE إمكانية الاتصال المباشر الديناميكي (Spoke-to-Spoke Tunnels).',
        summaryEn: 'Dissecting DMVPN Phase 3 architecture: Next Hop Resolution Protocol (NHRP) redirect and shortcut mechanics, multipoint GRE (mGRE) interfaces, and dynamic Spoke-to-Spoke direct on-demand tunnel generation.',
        contentMarkdownAr: `### 1. تطور أطوار تقنية الـ DMVPN (Phases 1, 2, 3):
- **Phase 1 (Hub-and-Spoke Only):** كل فرع يفتح نفق GRE نقطة لنقطة باتجاه الـ Hub المركزي. جميع الترافيك بين الفروع يمر إجبارياً عبر الـ Hub مما يسبب عنق زجاجة وتأخيراً مضاعفاً.
- **Phase 2 (Spoke-to-Spoke Direct):** تستخدم الفروع أنفاق mGRE، ويتم الحفاظ على عنوان Next-Hop الأصلي في جدول التوجيه لتفتح الفروع أنفاقاً مباشرة بين بعضها.
- **Phase 3 (المعيار المعتمد مع NHRP Redirect & Shortcut):**
  1. الفرع A يرسل الحزمة للـ Hub.
  2. يكتشف الـ Hub أن الحزمة ستخرج من نفس واجهة الـ mGRE باتجاه الفرع B، فيرسل للفرع A رسالة **NHRP Redirect**.
  3. يرسل الفرع A طلب **NHRP Resolution Request** لمعرفة الـ Public IP الحقيقي للفرع B.
  4. يبني الفرعان نفق IPsec مباشر بينهما فوراً (**NHRP Shortcut**) وتمر البيانات مباشرة دون المرور بالـ Hub!

---

### 2. المكونات الأربعة لشبكة الـ DMVPN:
1. **Multipoint GRE (mGRE):** واجهة نفق واحدة تستقبل وترسل لمئات العناوين العامة ديناميكياً.
2. **NHRP (Next Hop Resolution Protocol):** سجل هاتف مركزي يربط بين الـ Private Tunnel IP والـ Public NBMA IP.
3. **IPsec Crypto Profile:** تشفير كافة أنفاق الـ mGRE بـ AES-256 و SHA-2.
4. **Dynamic Routing Protocol:** تشغيل EIGRP أو BGP عبر أنفاق الـ DMVPN.`,
        contentMarkdownEn: `### 1. DMVPN Phase 3 Highlights:
- **NHRP Redirect:** Hub detects sub-optimal Spoke-to-Spoke transit and instructs source Spoke to resolve destination directly.
- **NHRP Shortcut:** Spoke installs dynamic CEFT route pointing directly to remote Spoke NBMA address.

### 2. Cisco DMVPN Hub & Spoke Configuration:
\`\`\`cisco
! Hub Configuration
interface Tunnel0
 ip address 172.16.0.1 255.255.255.0
 ip nhrp network-id 1
 ip nhrp redirect
 tunnel source GigabitEthernet0/0/0
 tunnel mode gre multipoint
 tunnel protection ipsec profile DMVPN_IPSEC_PROF
!
! Spoke Configuration
interface Tunnel0
 ip address 172.16.0.10 255.255.255.0
 ip nhrp network-id 1
 ip nhrp shortcut
 ip nhrp nhs 172.16.0.1 nbma 203.0.113.1 multicast
 tunnel source GigabitEthernet0/0/0
 tunnel mode gre multipoint
 tunnel protection ipsec profile DMVPN_IPSEC_PROF
\`\`\``,
        technicalHighlights: [
          'أمر ip nhrp redirect يكتب على الـ Hub، بينما أمر ip nhrp shortcut يكتب على كافة فروع الـ Spokes في Phase 3.',
          'الـ DMVPN تقلل استهلاك المعالج بنسبة 80% مقارنة بشبكات Full-Mesh IPsec التقليدية.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip nhrp dynamic',
            deviceType: 'router',
            deviceName: 'R1-DMVPN-HUB',
            mode: 'priv',
            category: 'NHRP Database',
            explanationAr: 'عرض جدول تسجيل الـ NHRP الديناميكي وعناوين الـ IP الخاصة والـ NBMA العامة للفروع المتصلة.',
            explanationEn: 'Displays dynamic NHRP mapping cache between tunnel IP and public NBMA transport addresses.',
            output: `172.16.0.10/32 via 172.16.0.10
   Tunnel0 created 00:45:12, expire 01:54:48
   Type: dynamic, Flags: unique registered used
   NBMA address: 198.51.100.50
172.16.0.20/32 via 172.16.0.20
   Tunnel0 created 00:12:30, expire 01:47:30
   Type: dynamic, Flags: unique registered used
   NBMA address: 203.0.113.88`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'تطبيق التوصيل الذكي والمكالمة المباشرة بين العميل والسائق',
          titleEn: 'Ride-Hailing App Matching Passengers Directly with Nearby Drivers',
          storyAr: 'في الطريقة القديمة (Phase 1)، يذهب العميل لمقر شركة التاكسي ليركب سيارة. في Phase 3، يقوم خادم الشركة المركزي (Hub / NHRP) بتزويد العميل والسائق برقم هاتف بعضهما مباشرة (Redirect & Shortcut)، فيلتقيان ويتم المشوار مباشرة دون أن تمر السيارة بمقر الشركة.',
          storyEn: 'In Phase 1, all passengers must travel to central taxi dispatch to meet drivers. In Phase 3, the dispatch app sends the driver\'s direct phone number to the passenger (NHRP Shortcut), allowing them to meet on the direct cross-street.',
          mappingTable: [
            { realLife: 'خادم تطبيق التوصيل المركزي المنظم', networkTech: 'DMVPN Hub & NHRP Server (NHS)', ciscoTerm: 'ip nhrp redirect' },
            { realLife: 'رقم الهاتف المباشر للاتصال بالسائق', networkTech: 'NHRP Resolution Mapping', ciscoTerm: 'ip nhrp shortcut' },
            { realLife: 'المسار السريع المباشر بين العميل والسائق', networkTech: 'Spoke-to-Spoke Dynamic mGRE Tunnel', ciscoTerm: 'Dynamic IPsec SA' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // UNIT 5: INFRASTRUCTURE SECURITY & ASSURANCE (ENCOR / ENARSI 3.0)
  // =========================================================================
  {
    id: 'ccnp-unit-5-security-assurance',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '350-401 ENCOR',
    unitNumber: 5,
    unitTitleAr: 'الوحدة 5: أمان البنية التحتية وضمان جودة الشبكة (Security, CoPP & Network Assurance)',
    unitTitleEn: 'Unit 5: Infrastructure Security, Control Plane Policing (CoPP), Cisco TrustSec & Telemetry',
    moduleBadge: 'ENCOR Domain 5.0',
    officialDomain: '5.0 Infrastructure Security & Telemetry (20% of Exam)',
    summaryAr: 'حماية معالج الراوتر من هجمات DoS بـ Control Plane Policing (CoPP)، وتطبيق التجزئة الأمنية بـ Cisco TrustSec ووسوم الأمان Security Group Tags (SGT)، والمراقبة بـ Flexible NetFlow و IP SLA و DNA Center Assurance.',
    summaryEn: 'Hardening router Route Processor via Control Plane Policing (CoPP), identity-based segmentation using Cisco TrustSec Security Group Tags (SGTs), and network telemetry with Flexible NetFlow, IP SLA, and Catalyst Center Assurance.',
    topics: [
      {
        id: 'ccnp-topic-5-1-control-plane-policing-copp',
        track: 'ccnp',
        titleAr: '5.1 حماية مستوى التحكم في الراوتر عبر Control Plane Policing (CoPP)',
        titleEn: '5.1 Infrastructure Hardening: Control Plane Policing (CoPP) & Management Plane Protection',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §5.1 & §5.2',
        officialReferences: [
          { title: 'RFC 6192 - Protecting the Router Control Plane', type: 'RFC', code: 'RFC 6192', citation: 'IETF Control Plane Protection Architecture' },
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'Chapter 17', citation: 'Device and Control Plane Hardening' }
        ],
        summaryAr: 'منع إسقاط الراوترات عبر هجمات حجب الخدمة (DoS): تطبيق سياسات MQC QoS على مستوى معالج الراوتر (Control Plane Interface) لتقييد وتحديد معدل حزم بروتوكولات الإدارة والـ OSPF والـ BGP وإسقاط الفيضانات الخبيثة.',
        summaryEn: 'Protecting the Route Processor (CPU) from volumetric flooding and DoS attacks using Modular QoS CLI (MQC) filters applied directly to the control-plane interface.',
        contentMarkdownAr: `### 1. لماذا تعتبر حماية الـ Control Plane مسألة حياة أو موت للشبكة؟
- عندما يرسل مهاجم ملايين طلبات ICMP Ping أو جلسات SSH وهمية أو حزم BGP مزورة، يضطر السويتش إلى تحويل كل هذه الحزم لمعالج الراوتر (Punt to CPU).
- إذا وصل استهلاك المعالج إلى 100%، يتوقف الراوتر عن الرد على نبضات التحية (OSPF/BGP Hellos)، فتنهار علاقات الجوار وتسقط شبكة المؤسسة بالكامل!

---

### 2. هندسة تطبيق سياسة الـ CoPP:
نستخدم هيكلية MQC (Modular QoS CLI) في ثلاث خطوات:
1. **Class-Map (التصنيف):** تصنيف الحزم الحساسة (مثل OSPF, BGP, SSH, SNMP, ICMP).
2. **Policy-Map (تحديد السرعة):** تحديد سقف أقصى للباندويث (Policing) لكل فئة (مثال: حزم OSPF تعطى 100kbps مع أولوية قصوى، وحزم ICMP تقيد بـ 8kbps، وما زاد يتم إسقاطه فوراً).
3. **Service-Policy (التطبيق على المعالج):** تطبيق السياسة تحت واجهة الـ \`control-plane\`.`,
        contentMarkdownEn: `### 1. Control Plane Architecture:
- Rate-limits punted traffic reaching CPU to prevent DoS collapse.
- Uses MQC (Class-Map -> Policy-Map -> Service-Policy on \`control-plane\`).

### 2. Cisco CoPP Configuration:
\`\`\`cisco
ip access-list extended ACL_ROUTING_PROTOCOLS
 permit ospf any any
 permit tcp any eq bgp any
!
class-map match-all CM_CRITICAL_ROUTING
 match access-group name ACL_ROUTING_PROTOCOLS
!
policy-map COPP_POLICY
 class CM_CRITICAL_ROUTING
  police 1000000 conform-action transmit exceed-action drop
 class class-default
  police 8000 conform-action transmit exceed-action drop
!
control-plane
 service-policy input COPP_POLICY
\`\`\``,
        technicalHighlights: [
          'أمر control-plane host يسمح بتطبيق سياسات مخصصة للحزم الموجهة لعناوين الراوتر الفيزيائية فقط (Management Plane Protection - MPP).',
          'ميزة CoPP تنفذ عبر رقاقات السويتش المادية (Hardware Rate Limiter) قبل أن تلمس الحزمة الخبيثة المعالج المركزي نهائياً.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show policy-map control-plane',
            deviceType: 'router',
            deviceName: 'R1-CORE-POLICED',
            mode: 'priv',
            category: 'CoPP Enforcement',
            explanationAr: 'عرض عدادات الحزم المسموح بمرورها لمعالج الراوتر والحزم الخبيثة التي تم إسقاطها بـ CoPP.',
            explanationEn: 'Displays live packet match rates, conforming traffic, and dropped packets at the Route Processor.',
            output: ` Control Plane 

  Service-policy input: COPP_POLICY

    Class-map: CM_CRITICAL_ROUTING (match-all)
      142055 packets, 18467150 bytes
      5 minute offered rate 12000 bps, drop rate 0000 bps
      Match: access-group name ACL_ROUTING_PROTOCOLS
      police:
          cir 1000000 bps, bc 31250 bytes
        conformed 142055 pkts, 18467150 bytes; actions:
          transmit
        exceeded 0 pkts, 0 bytes; actions:
          drop 

    Class-map: class-default (match-any)
      582910 packets, 42510200 bytes
      police:
          cir 8000 bps, bc 1500 bytes
        conformed 8910 pkts; actions: transmit
        exceeded 574000 pkts; actions: drop (Flooding Dropped)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'الحرس الشخصي عند باب مكتب الرئيس التنفيذي',
          titleEn: 'Executive Bodyguard Filtering Visitors to the CEO Office',
          storyAr: 'معالج الراوتر (CPU) يشبه الرئيس التنفيذي للشركة: لا يستقبل كل من يطرق الباب بنفسه. تقنية CoPP هي الحارس الشخصي الواقف عند الباب: يسمح بمرور أعضاء مجلس الإدارة (OSPF/BGP) بسرعة، ويسمح لرسائل البريد بالمرور بمعدل 5 رسائل في الدقيقة (SSH)، ويطرد أي متطفل يحاول إغراق المكتب فوراً (Drop).',
          storyEn: 'The router CPU is like the CEO of a multinational corporation. CoPP is the executive bodyguard outside their office: immediately ushering in vice presidents (OSPF/BGP), metered access for delivery couriers (SSH), and instantly discarding unsolicited sales brochures.',
          mappingTable: [
            { realLife: 'الرئيس التنفيذي المشغول بقرارات الشركة', networkTech: 'Route Processor (Router CPU)', ciscoTerm: 'control-plane' },
            { realLife: 'الحارس الشخصي الذي يدقق الزوار', networkTech: 'CoPP Hardware Rate-Limiter', ciscoTerm: 'service-policy input' },
            { realLife: 'قائمة بطاقات الدخول المصرح بها للمسؤولين', networkTech: 'MQC Class-Map Match Rules', ciscoTerm: 'class-map match-all' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // UNIT 6: NETWORK AUTOMATION & CISCO SD-WAN (ENCOR 4.0)
  // =========================================================================
  {
    id: 'ccnp-unit-6-sdwan-automation',
    track: 'ccnp',
    trackTitleAr: 'منهج سيسكو CCNP Enterprise',
    trackTitleEn: 'Cisco CCNP Enterprise Track (ENCOR 350-401 & ENARSI 300-410)',
    examCode: '350-401 ENCOR',
    unitNumber: 6,
    unitTitleAr: 'الوحدة 6: شبكات الـ SD-WAN وأتمتة بايثون المتقدمة (Cisco SD-WAN & Programmability)',
    unitTitleEn: 'Unit 6: Cisco SD-WAN (vSmart, vManage, OMP), NETCONF/YANG & Python Netmiko/pyATS',
    moduleBadge: 'ENCOR Domain 6.0',
    officialDomain: '6.0 Automation & SD-WAN Technologies (15% of Exam)',
    summaryAr: 'معمارية شبكات Cisco SD-WAN (vManage, vSmart, vBond, vEdge/cEdge)، بروتوكول Overlay Management Protocol (OMP)، نمذجة البيانات بـ YANG Models، وأتمتة الشبكات باستخدام Python Netmiko و Cisco pyATS.',
    summaryEn: 'Enterprise software-defined WAN architecture: Planes separation (vManage, vSmart, vBond, cEdge/vEdge), Overlay Management Protocol (OMP), YANG data modeling, NETCONF/RESTCONF, and automated Python testing with pyATS/Genie.',
    topics: [
      {
        id: 'ccnp-topic-6-1-cisco-sdwan-architecture-omp',
        track: 'ccnp',
        titleAr: '6.1 معمارية شبكات Cisco SD-WAN وبروتوكول إدارة التراكب OMP',
        titleEn: '6.1 Cisco SD-WAN Fabric: Control (vSmart), Management (vManage), Orchestration (vBond) & OMP',
        level: 'CCNP',
        ciscoBlueprintRef: 'ENCOR 350-401 §1.5 & §1.6',
        officialReferences: [
          { title: 'Cisco Press CCNP Enterprise Core ENCOR 350-401 OCG', type: 'Cisco OCG', code: 'Chapter 24', citation: 'Cisco SD-WAN Architecture and Operation' },
          { title: 'Cisco SD-WAN Design Guide (CVD)', type: 'Cisco Validated Design', code: 'CVD-SDWAN-2023', citation: 'Enterprise SD-WAN Deployment Principles' }
        ],
        summaryAr: 'التحول الثوري في شبكات الـ WAN: تفكيك متحكمات SD-WAN الأربعة (vManage للوحة التحكم، vSmart للعقل المركزي والتوجيه، vBond للمصادقة وتخطي NAT، و vEdge/cEdge لنقل البيانات)، وتبادل المسارات عبر بروتوكول Overlay Management Protocol (OMP).',
        summaryEn: 'Deep architectural dive into Cisco Catalyst SD-WAN: Management Plane (vManage), Control Plane (vSmart), Orchestration (vBond), Data Plane (cEdge/vEdge), Zero-Touch Provisioning (ZTP), and OMP route/policy distribution.',
        contentMarkdownAr: `### 1. مستويات ومكونات شبكة Cisco SD-WAN الأربعة:
1. **Orchestration Plane (vBond Validator):** بوابة المصادقة الأولى. يقوم بتوثيق شهادات الأمان (Certificates / Whitelist)، وحل معضلة الـ NAT Traversal، وتوجيه الراوتر نحو الـ vManage والـ vSmart.
2. **Management Plane (vManage NMS):** الواجهة الرسومية المركزية الموحدة (Single Pane of Glass). تتيح تصميم القوالب (Feature/CLI Templates)، وسياسات الأمان والتوجيه، وترقية البرمجيات بضغطة زر.
3. **Control Plane (vSmart Controller):** العقل المدبر للشبكة. ينشئ ويحسب طوبولوجيا الـ Fabric، ويوزع سياسات التوجيه والأمان ومفاتيح تشفير IPsec عبر بروتوكول OMP.
4. **Data Plane (vEdge / cEdge WAN Routers):** راوترات الفروع ومراكز البيانات المسؤولة عن تمرير الحزم عبر أنفاق IPsec مشفرة تلقائياً.

---

### 2. بروتوكول إدارة التراكب (Overlay Management Protocol - OMP):
- بروتوكول يعمل عبر أنفاق TLS/DTLS بين راوترات الفروع ومتحكم الـ vSmart.
- يوزع ثلاثة أنواع من المعلومات:
  1. **OMP Routes:** شبكات الـ LAN الداخلية للفروع.
  2. **TLOC Routes (Transport Locations):** معلومات نقاط الاتصال الفيزيائية (System IP, Color مثل mpls/biz-internet, Encapsulation مثل IPsec/GRE).
  3. **Service Routes & Encryption Keys:** مفاتيح تشفير الـ IPsec لتبادلها بين الراوترات دون الحاجة لـ IKE negotiation يدوي!`,
        contentMarkdownEn: `### 1. SD-WAN Controller Roles:
- **vBond:** Orchestration, authentication, NAT traversal.
- **vManage:** Centralized GUI, configuration templates, Day-0 to Day-N operations.
- **vSmart:** Control plane engine; advertises OMP routes and encryption policies.
- **cEdge / vEdge:** Data plane forwarder; builds dynamic full-mesh/hub-spoke IPsec fabric.

### 2. Cisco SD-WAN Verification CLI:
\`\`\`cisco
show sdwan control connections
show sdwan omp routes
show sdwan bfd sessions
\`\`\``,
        technicalHighlights: [
          'خاصية Zero-Touch Provisioning (ZTP) تتيح توصيل الراوتر بالكهرباء والإنترنت في أي فرع بالعالم ليقوم بتحميل إعداداته وشهاداته تلقائياً دون تدخل أي مهندس.',
          'بروتوكول BFD (Bidirectional Forwarding Detection) يعمل باستمرار عبر كافة أنفاق الـ IPsec لقياس زمن التأخير (Latency) وفقدان الحزم (Packet Loss) وتطبيق Application-Aware Routing (AAR).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show sdwan control connections',
            deviceType: 'router',
            deviceName: 'cEdge-BRANCH-01',
            mode: 'priv',
            category: 'SD-WAN Control Status',
            explanationAr: 'عرض حالة جلسات الاتصال المشفرة بـ TLS/DTLS مع متحكمات vSmart و vManage و vBond.',
            explanationEn: 'Displays active DTLS/TLS control plane connections between edge router and SD-WAN controllers.',
            output: `PEER    PEER             PEER            SITE        DOMAIN  PEER                                    
TYPE    PROTOCOL  PORT   SYSTEM IP       ID          ID      PRIVATE IP       STATE
-----------------------------------------------------------------------------------------
vbond   dtls      12346  10.255.0.1      0           0       203.0.113.10     up
vmanage dtls      12346  10.255.0.2      1           1       10.255.0.2       up
vsmart  tls       23456  10.255.0.3      1           1       10.255.0.3       up`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'سفارة التأشيرات وإدارة الملاحة الجوية الدولية',
          titleEn: 'Consular Visa Verification, Flight Control Tower, and Aircraft',
          storyAr: 'الـ vBond هو ضابط الجوازات الذي يتأكد من سلامة تأشيرتك وهوية طائرتك. الـ vSmart هو برج المراقبة الجوية الذي يحدد مسار الرحلات في الجو. الـ vManage هو مكتب إدارة المطار وشاشات التذاكر. والراوترات (Edges) هي الطائرات التي تنقل الركاب عبر الممرات الجوية المشفرة.',
          storyEn: 'vBond is the immigration officer validating security clearance at the gate. vSmart is the master air-traffic controller coordinating high-altitude flight routes. vManage is the central airport scheduling console, and the cEdge routers are the aircraft carrying passengers across the airspace.',
          mappingTable: [
            { realLife: 'ضابط الجوازات الذي يفحص الهوية والتأشيرة', networkTech: 'vBond Orchestrator', ciscoTerm: 'vBond Validator' },
            { realLife: 'برج المراقبة الجوية الذي يوجه الطائرات', networkTech: 'vSmart Controller (OMP Control Plane)', ciscoTerm: 'vSmart Controller' },
            { realLife: 'شاشات وجداول إدارة المطار المركزية', networkTech: 'vManage Management Console', ciscoTerm: 'Cisco Catalyst SD-WAN Manager' },
            { realLife: 'أسطول الطائرات التي تنقل الركاب', networkTech: 'cEdge / vEdge Data Plane', ciscoTerm: 'WAN Edge Router' }
          ]
        }
      }
    ]
  }
];
