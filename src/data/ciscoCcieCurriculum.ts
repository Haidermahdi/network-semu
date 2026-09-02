import { CurriculumSection } from '../types';
import { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

export const CCIE_CURRICULUM_MODULES: CurriculumSection[] = [
  // =========================================================================
  // DOMAIN 1.0: NETWORK INFRASTRUCTURE & ADVANCED CORE (30% of CCIE Lab)
  // =========================================================================
  {
    id: 'ccie-unit-1-network-infrastructure',
    track: 'ccie',
    trackTitleAr: 'منهج سيسكو CCIE Enterprise Infrastructure',
    trackTitleEn: 'Cisco CCIE Enterprise Infrastructure Track (v1.1 Blueprint)',
    examCode: 'CCIE Enterprise Lab & Practical Exam (v1.1)',
    unitNumber: 1,
    unitTitleAr: 'الوحدة 1: البنية التحتية المتقدمة والتوجيه فائق التعقيد (Complex Core & Multicast)',
    unitTitleEn: 'Unit 1: Advanced Network Infrastructure: Multi-Protocol BGP, IS-IS Fabric & Anycast RP Multicast',
    moduleBadge: 'CCIE Domain 1.0',
    officialDomain: '1.0 Network Infrastructure (30% of CCIE Lab Blueprint)',
    summaryAr: 'المستوى الخبير: هندسة توجيه BGP المعقد مع Route Reflectors و Confederation، تشغيل IS-IS كـ Underlay، التوجيه بالبث المتعدد PIM-SM مع Anycast-RP بـ MSDP، وأتمتة الأحداث بالراوتر بـ Embedded Event Manager (EEM).',
    summaryEn: 'Expert-level design and troubleshooting: Multi-Protocol BGP Route Reflector clusters and AS Confederations, Intermediate System to Intermediate System (IS-IS) fabric underlays, IP Multicast PIM Sparse Mode with Anycast-RP using MSDP, and on-box Cisco Embedded Event Manager (EEM) automation.',
    topics: [
      {
        id: 'ccie-topic-1-1-mp-bgp-route-reflectors-confederations',
        track: 'ccie',
        titleAr: '1.1 هندسة BGP واسعة النطاق (BGP Route Reflectors, Confederations & Path Vector Scalability)',
        titleEn: '1.1 Large-Scale BGP Architecture: Route Reflector Clusters, AS Confederations & Loop Prevention',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §1.2 & §1.3',
        officialReferences: [
          { title: 'RFC 4456 - BGP Route Reflection: An Alternative to Full Mesh IBGP', type: 'RFC', code: 'RFC 4456', citation: 'IETF Route Reflector Standard' },
          { title: 'RFC 5065 - Autonomous System Confederations for BGP', type: 'RFC', code: 'RFC 5065', citation: 'IETF BGP Confederation Specification' },
          { title: 'Cisco Press CCIE Enterprise Infrastructure Foundation', type: 'Cisco Press', code: 'ISBN: 978-0137320301', citation: 'Mastering Enterprise Core Routing' }
        ],
        summaryAr: 'كسر قيود الـ Full-Mesh في شبكات الـ Tier-1 العالمية: تشريح عمل Route Reflector (RR) مع سمات \`ORIGINATOR_ID\` و \`CLUSTER_LIST\` لمنع الحلقات، وهندسة تكتلات الـ BGP Confederations (Sub-ASs).',
        summaryEn: 'Scaling enterprise transit backbones beyond full-mesh iBGP constraints: Route Reflector client-to-nonclient forwarding rules, loop-prevention attributes (CLUSTER_LIST, ORIGINATOR_ID), and BGP Confederation design.',
        contentMarkdownAr: `### 1. لماذا نحتاج Route Reflectors في شبكات الـ Enterprise الكبرى؟
- في بروتوكول iBGP، تتطلب قاعدة **iBGP Split-Horizon** عمل شبكة Full-Mesh بين كافة الراوترات (إذا كان لديك 100 راوتر، تحتاج $$\\frac{N(N-1)}{2} = \\frac{100 \\times 99}{2} = 4950$$ جلسة اتصال BGP!).
- **حل Route Reflector:** راوتر مركزي يسمح بإعادة إعلان مسارات الـ iBGP لعملائه (Clients) وللراوترات الأخرى (Non-Clients) وفق قواعد أمان دقيقة.

---

### 2. قواعد تمرير الحزم في Route Reflector:
1. **مسار قادم من EBGP Peer:** يعلن للجميع (Clients + Non-Clients).
2. **مسار قادم من RR Client:** يعلن للجميع (Clients + Non-Clients).
3. **مسار قادم من Non-Client:** يعلن فقط للـ **Clients** (لا يمرر لـ Non-Clients لمنع الحلقات).

---

### 3. آليات منع الحلقات في بيئات Route Reflection:
- **ORIGINATOR_ID (RFC 4456):** يحمل عنوان BGP Router ID للراوتر الأصلي الذي أعلن المسار. إذا استلم الراوتر مساراً يحمل الـ Router ID الخاص به، يسقطه فوراً!
- **CLUSTER_LIST (RFC 4456):** يسجل أرقام الـ Cluster IDs لكافة راوترات الـ RR التي عبرها المسار. إذا استلم RR مساراً يحتوي Cluster ID خاص به، يتجاهله لمنع تدوير المسارات بين الـ RRs المتعددة.`,
        contentMarkdownEn: `### 1. Route Reflector Forwarding Matrix:
- Route from **EBGP Peer** -> Advertised to Clients & Non-Clients.
- Route from **Client Peer** -> Advertised to Clients & Non-Clients.
- Route from **Non-Client Peer** -> Advertised to **Clients ONLY**.

### 2. Cisco CCIE Route Reflector & Cluster Configuration:
\`\`\`cisco
router bgp 65000
 bgp router-id 1.1.1.1
 bgp cluster-id 10.0.0.1
 neighbor 10.10.10.2 remote-as 65000
 neighbor 10.10.10.2 route-reflector-client
 neighbor 10.10.10.3 remote-as 65000
 neighbor 10.10.10.3 route-reflector-client
 neighbor 10.20.20.1 remote-as 65000
 ! (10.20.20.1 is standard Non-Client peer)
\`\`\``,
        technicalHighlights: [
          'في تصميم الـ High Availability لشبكات الـ CCIE، يتم وضع جهازي Route Reflector في نفس الـ Cluster مع إعطائهما نفس الـ bgp cluster-id لتقليل حجم الـ BGP Table المكرر.',
          'تقنية BGP Confederation تقسم الـ AS الكبير إلى عدة Private Sub-Autonomous Systems (مثل 64512 و 64513) وتظهر للعالم الخارجي كـ Single AS.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip bgp 172.16.100.0/24',
            deviceType: 'router',
            deviceName: 'R1-CORE-RR01',
            mode: 'priv',
            category: 'BGP Route Reflection Detail',
            explanationAr: 'عرض تفاصيل المسار الممرر عبر Route Reflector والتحقق من سمات Originator ID وقائمة Cluster List.',
            explanationEn: 'Displays detailed BGP table entry highlighting Originator ID and Cluster List loop prevention attributes.',
            output: `BGP routing table entry for 172.16.100.0/24, version 892
Paths: (1 available, best #1, table default)
  Not advertised to any peer
  Local
    10.10.10.2 (metric 20) from 10.10.10.2 (10.10.10.2)
      Origin IGP, metric 0, localpref 100, valid, internal, best
      Originator: 10.10.10.2, Cluster list: 10.0.0.1, 10.0.0.2`
          }
        ],
        protocolDetails: [PROTOCOL_DEEP_DIVES.BGP],
        realWorldAnalogy: {
          titleAr: 'المذيع الرئيسي في المؤتمر الصحفي مقابل التحدث الفردي',
          titleEn: 'Main Press Conference Anchor vs Individual One-on-One Talks',
          storyAr: 'شبكة Full-Mesh تشبه 100 صحفي يحاول كل واحد منهم التحدث مع الـ 99 الآخرين شخصياً في نفس الوقت (فوضى عارمة). أما Route Reflector فهو مذيع المؤتمر الواقف على المنصة بميكروفون: عندما يتكلم أحد الصحفيين (Client)، ينقل المذيع صوته للقاعة بأكملها فوراً.',
          storyEn: 'Full-mesh iBGP is 100 journalists trying to whisper to all other 99 people individually. Route Reflection is the podium anchor with a master microphone: whenever an accredited reporter (Client) speaks, the anchor broadcasts the announcement across the entire press auditorium.',
          mappingTable: [
            { realLife: 'المذيع الواقف على المنصة المركزية', networkTech: 'BGP Route Reflector Server', ciscoTerm: 'route-reflector-client' },
            { realLife: 'بطاقة الصحفي الذي يحق له التحدث', networkTech: 'RR Client Peer', ciscoTerm: 'neighbor route-reflector-client' },
            { realLife: 'ختم الميكروفون لمنع ارتداد الصوت والصفير', networkTech: 'Originator ID & Cluster List', ciscoTerm: 'bgp cluster-id' }
          ]
        }
      },
      {
        id: 'ccie-topic-1-2-enterprise-multicast-pim-sm-anycast-rp',
        track: 'ccie',
        titleAr: '1.2 التوجيه بالبث المتعدد PIM Sparse Mode وهندسة Anycast RP بـ MSDP',
        titleEn: '1.2 Enterprise IP Multicast: PIM-SM (*,G) vs (S,G) Trees, Anycast-RP & MSDP Peering',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §1.4 & §1.5',
        officialReferences: [
          { title: 'RFC 7761 - Protocol Independent Multicast - Sparse Mode (PIM-SM)', type: 'RFC', code: 'RFC 7761', citation: 'IETF PIM-SM Standard Specification' },
          { title: 'RFC 3618 - Multicast Source Discovery Protocol (MSDP)', type: 'RFC', code: 'RFC 3618', citation: 'IETF MSDP Anycast-RP Inter-Domain Protocol' },
          { title: 'Cisco Press Developing IP Multicast Networks', type: 'Cisco Press', code: 'ISBN: 978-1578700776', citation: 'Enterprise Multicast Architecture' }
        ],
        summaryAr: 'تشغيل تطبيقات التداول المالي والبث الحي: شجرة المشاركة Shared Tree (*,G)، شجرة المصدر Shortest Path Tree (S,G)، آلية فحص مسار العودة RPF Check، وتوزيع أحمال الـ Rendezvous Point عبر Anycast-RP باستخدام بروتوكول MSDP.',
        summaryEn: 'High-throughput multicast transport: Shared Tree (*,G) to Source Tree (S,G) SPT Switchover mechanics, Reverse Path Forwarding (RPF) failure remediation, and resilient Anycast-RP deployment with MSDP mesh.',
        contentMarkdownAr: `### 1. دورة حياة بث الـ Multicast في بروتوكول PIM Sparse Mode (PIM-SM):
1. **انضمام المستقبل (Receiver Join):** الجهاز يرسل رسالة \`IGMP Membership Report\` لطلب قناة (مثل \`239.1.1.1\`).
2. **بناء شجرة المشاركة (*,G) Shared Tree:** الراوتر المحلي يرسل رسالة \`PIM Join (*,G)\` باتجاه نقطة الالتقاء المركزية **Rendezvous Point (RP)**.
3. **تسجيل المصدر (Source Registration):** عندما يبدأ المصدر بالبث، يرسل راوتر المصدر الحزم مغلفة داخل رسائل \`PIM Register\` كـ Unicast للـ RP.
4. **التبديل إلى المسار الأقصر (SPT Switchover):** فور استلام أول حزمة، يقوم راوتر المستقبل بطلب مسار مباشر فائق السرعة باتجاه المصدر وبناء شجرة \`(S,G) Shortest Path Tree\` وتجاوز الـ RP تماماً!

---

### 2. فحص مسار العودة (Reverse Path Forwarding - RPF Check):
- لا يقبل الراوتر حزمة Multicast إلا إذا وصلت على المنفذ الذي يستخدمه جدول التوجيه Unicast للوصول إلى عنوان المصدر. إذا فشل الفحص، تسقط الحزمة فوراً لمنع الحلقات اللانهائية.

---

### 3. بنية Anycast-RP مع بروتوكول MSDP:
- إعطاء عدة راوترات RP نفس عنوان الـ Loopback IP (مثل \`10.255.255.255/32\`).
- تستخدم راوترات الشبكة أقرب RP لها بناءً على تكلفة الـ IGP.
- تتبادل راوترات الـ RP معلومات المصادر النشطة عبر رسائل **MSDP Source Active (SA)** لبناء منظومة فائقة التوفرية بدون نقطة فشل مفردة (No Single Point of Failure).`,
        contentMarkdownEn: `### 1. PIM-SM SPT Switchover Lifecycle:
- Step 1: Receiver sends IGMP Report -> Router sends \`(*,G)\` Join toward RP.
- Step 2: Source sends Multicast -> First-hop router encapsulates into \`PIM Register\` to RP.
- Step 3: Last-hop router triggers SPT Switchover -> Installs direct \`(S,G)\` hardware entry and prunes \`(*,G)\`.

### 2. Cisco CCIE Anycast-RP with MSDP Configuration:
\`\`\`cisco
ip multicast-routing
!
interface Loopback0
 ip address 10.255.255.255 255.255.255.255
 ip pim sparse-mode
!
ip pim rp-address 10.255.255.255
!
! MSDP Peering between redundant RPs
ip msdp peer 10.0.0.2 connect-source Loopback1
ip msdp originator-id Loopback1
\`\`\``,
        technicalHighlights: [
          'فشل فحص الـ RPF Check هو السبب الأول في 90% من مشاكل انقطاع الـ Multicast في المعامل الحية، ويتم كشفه بأمر show ip rpf <Source_IP>.',
          'بروتوكول PIM SSM (Source Specific Multicast) يستخدم نطاق 232.0.0.0/8 ويلغي الحاجة لوجود RP نهائياً لأن المستقبل يحدد عنوان المصدر مسبقاً عبر IGMPv3.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip mroute 239.1.1.1',
            deviceType: 'router',
            deviceName: 'R1-CORE-MCAST',
            mode: 'priv',
            category: 'Multicast Routing Table',
            explanationAr: 'عرض جدول توجيه الـ Multicast، وشجرة المشاركة (*,G)، وشجرة المسار الأقصر المباشرة (S,G) والمنافذ الخارجة OIL.',
            explanationEn: 'Displays IP multicast routing table displaying shared tree (*,G), shortest path tree (S,G), and Outgoing Interface List (OIL).',
            output: `(*, 239.1.1.1), 00:15:30/00:02:45, RP 10.255.255.255, flags: S
  Incoming interface: GigabitEthernet0/0/0, RPF nbr 10.1.1.2
  Outgoing interface list:
    GigabitEthernet0/0/1, Forward/Sparse, 00:15:30/00:02:45

(192.168.10.50, 239.1.1.1), 00:04:12/00:02:18, flags: T
  Incoming interface: GigabitEthernet0/0/2, RPF nbr 10.2.2.1
  Outgoing interface list:
    GigabitEthernet0/0/1, Forward/Sparse, 00:04:12/00:02:18`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'مكتب استقبال البث الإذاعي وتوزيع الترددات الحية',
          titleEn: 'Central Radio Relay Station with Anycast Transmitters',
          storyAr: 'الـ Rendezvous Point (RP) يشبه برج الإذاعة المركزي: عندما تبدأ فرقة موسيقية بالعزف (المصدر)، ترسل شريط التسجيل للبرج، ويقوم البرج ببثه لمن يستمع للمذياع. وفور أن يتعرف المستمع على تردد الفرقة المباشر، يوجه جهاز الاستقبال مباشرة نحو الفرقة (SPT Switchover) ليسمع الصوت بأنقى جودة وبدون تأخير البرج.',
          storyEn: 'The Multicast RP is like a central radio relay station: when a musician starts playing (Source), they register with the central station so listeners (Receivers) tuning in can hear. Once the listeners have the musician\'s exact transmitter channel, they lock antennas directly to the stage (SPT Switchover).',
          mappingTable: [
            { realLife: 'برج الإذاعة المركزي المرجعي المشترك', networkTech: 'PIM-SM Rendezvous Point (RP)', ciscoTerm: 'ip pim rp-address' },
            { realLife: 'توجيه الهوائي المباشر نحو مسرح العزف', networkTech: 'Shortest Path Tree (S,G) Switchover', ciscoTerm: 'ip pim spt-threshold 0' },
            { realLife: 'أبراج البث المتطابقة في المدن المختلفة', networkTech: 'Anycast-RP with MSDP Synchronization', ciscoTerm: 'ip msdp peer' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 2.0: SOFTWARE DEFINED INFRASTRUCTURE (25% of CCIE Lab)
  // =========================================================================
  {
    id: 'ccie-unit-2-software-defined-infrastructure',
    track: 'ccie',
    trackTitleAr: 'منهج سيسكو CCIE Enterprise Infrastructure',
    trackTitleEn: 'Cisco CCIE Enterprise Infrastructure Track (v1.1 Blueprint)',
    examCode: 'CCIE Enterprise Lab & Practical Exam (v1.1)',
    unitNumber: 2,
    unitTitleAr: 'الوحدة 2: البنية البرمجية المتقدمة Cisco SD-Access و SD-WAN (SDA Fabric & SGTs)',
    unitTitleEn: 'Unit 2: Software-Defined Infrastructure: Cisco SD-Access Fabric (LISP, VXLAN, TrustSec) & Advanced SD-WAN',
    moduleBadge: 'CCIE Domain 2.0',
    officialDomain: '2.0 Software-Defined Infrastructure (25% of CCIE Lab Blueprint)',
    summaryAr: 'هندسة نسيج Cisco SD-Access: فصل المعرف عن الموقع ببروتوكول LISP، تغليف مستوى البيانات بـ VXLAN، التجزئة الثنائية بـ Security Group Tags (SGT) و CTS Matrix، وبوابات Anycast Gateway مع Fusion Routers.',
    summaryEn: 'Deep-dive engineering of Cisco SD-Access fabric: Control Plane (LISP Map-Server/Map-Resolver), Data Plane (VXLAN encap with SGT embedding), Policy Plane (Cisco TrustSec / ISE), Anycast Default Gateways, and External Border / Fusion Router peering.',
    topics: [
      {
        id: 'ccie-topic-2-1-cisco-sd-access-fabric-architecture',
        track: 'ccie',
        titleAr: '2.1 نسيج Cisco SD-Access (LISP Control Plane, VXLAN Data Plane & Cisco TrustSec SGTs)',
        titleEn: '2.1 Cisco SD-Access Architecture: LISP Mapping, VXLAN Encapsulation, Anycast GW & TrustSec Matrix',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §2.1 & §2.2',
        officialReferences: [
          { title: 'RFC 6830 - Locator/ID Separation Protocol (LISP)', type: 'RFC', code: 'RFC 6830', citation: 'IETF LISP Base Standard' },
          { title: 'RFC 7348 - Virtual eXtensible Local Area Network (VXLAN)', type: 'RFC', code: 'RFC 7348', citation: 'IETF VXLAN Encapsulation Standard' },
          { title: 'Cisco Press Software-Defined Access (SDA)', type: 'Cisco Press', code: 'ISBN: 978-1587147050', citation: 'Deploying SDA Fabrics in Enterprise' }
        ],
        summaryAr: 'بنية الجيل القادم لشبكات الـ Campus: كيف يلغي SD-Access مشاكل الـ Spanning Tree والـ VLANs عبر نسيج Routed Underlay (IS-IS)، واستعلامات LISP MS/MR لتتبع حركة المستخدمين، وتغليف حزم الـ VXLAN مع وسم SGT لحفظ الأمان.',
        summaryEn: 'Complete decomposition of Cisco SD-Access Campus Fabric: Fabric Edge, Fabric Border (Internal/External), Fabric Control Plane (LISP MS/MR), Anycast Layer 3 Gateway on all edge nodes, and Group-Based Policy enforcement.',
        contentMarkdownAr: `### 1. مستويات نسيج Cisco SD-Access الثلاثة:
1. **Control Plane (LISP - Locator/ID Separation Protocol):**
   - يفصل بين **هوية الجهاز (Endpoint Identifier - EID)** مثل عنوان IP الخاص باللابتوب، وبين **موقع الجهاز في الشبكة (Routing Locator - RLOC)** وهو عنوان الـ Loopback الخاص بسويتش الـ Fabric Edge.
   - يستبدل إعلانات التوجيه الكثيفة بنظام استعلام سريع يشبه الـ DNS (Map-Request / Map-Reply).
2. **Data Plane (VXLAN with SGT Header):**
   - يغلف فريمات الطبقة الثانية بالكامل داخل حزم UDP على المنفذ **4789**.
   - يضيف ترويسة **VXLAN-GPO** تحتوي على رقم الـ Virtual Network (VNI) ورقم وسم الأمان **Security Group Tag (SGT)** من 16-bit.
3. **Policy Plane (Cisco TrustSec & Cisco ISE):**
   - تطبيق التجزئة المبنية على الهوية (Identity-Based Microsegmentation) عبر مصفوفة CTS Matrix بغض النظر عن عنوان IP المستخدم أو مكانه الفيزيائي!

---

### 2. مكونات نسيج الـ Fabric Nodes:
- **Fabric Edge Node:** السويتش المتصل بالمستخدمين. يحتوي على **Anycast Default Gateway** (نفس عنوان IP والـ MAC موجود على كافة السويتشات في آن واحد لتسهيل التنقل اللحظي Seamless Mobility).
- **Fabric Control Plane Node:** خادم الـ LISP Map-Server / Map-Resolver (MS/MR) الذي يحفظ قاعدة بيانات مواقع كافة الـ EIDs.
- **Fabric Border Node (Border Router):** يربط نسيج الـ SDA بالشبكات الخارجية (WAN, Internet, Data Center) ويمرر الترافيك لراوتر الـ Fusion.`,
        contentMarkdownEn: `### 1. SD-Access Architecture:
- **Control Plane:** LISP MS/MR tracks EID-to-RLOC mappings.
- **Data Plane:** VXLAN encapsulation encapsulates original frame with VNI and SGT.
- **Policy Plane:** Cisco ISE enforces SGT Group-Based Access Control Lists (SGACL).

### 2. Fabric Edge Verification Commands:
\`\`\`cisco
show device-tracking database
show lisp instance-id 4099 ipv4 server
show access-session
\`\`\``,
        technicalHighlights: [
          'تقنية Anycast Gateway في SD-Access تتيح للمستخدم التحرك بين 50 مبنى بنفس عنوان الـ IP والـ Default Gateway دون أن ينقطع اتصال VPN أو مكالمة Webex ثانية واحدة!',
          'وسوم الأمان SGT تلغي الحاجة لكتابة آلاف الأسطر المعقدة في الـ IP ACLs وتستبدلها بسياسة بسيطة: (SGT 10 Developers -> SGT 20 Production DB = Permit 443 Only).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show lisp instance-id 4099 ipv4 server',
            deviceType: 'l3switch',
            deviceName: 'CAT9K-FABRIC-MSMR',
            mode: 'priv',
            category: 'LISP Fabric Database',
            explanationAr: 'عرض قاعدة بيانات LISP في الـ Control Plane Node ومطابقة عناوين الـ EID للعملاء مع عناوين الـ RLOC للسويتشات.',
            explanationEn: 'Displays LISP Map-Server registration table mapping endpoint IP addresses (EID) to switch fabric loopbacks (RLOC).',
            output: `LISP Site Registration Information
* = site-name unavailable
Site Name      Last      Up     Who Last             EID Prefix
               Register         Registered           
SITE_HQ        00:00:12  yes    10.255.0.11:4342     192.168.10.45/32 (RLOC: 10.255.0.11)
SITE_HQ        00:00:08  yes    10.255.0.12:4342     192.168.10.46/32 (RLOC: 10.255.0.12)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'نظام حجز الفنادق العالمي وبطاقة الغرفة الذكية',
          titleEn: 'Global Hotel Keycard Registry and Room Locator Database',
          storyAr: 'الـ EID هو رقم هاتفك المحمول (هويتك الثابتة أينما ذهبت). والـ RLOC هو رقم الغرفة التي تسكن فيها اليوم. خادم LISP MS/MR هو موظف الاستقبال الذي يسجل: "النزيل صاحب الرقم X موجود الآن في الغرفة Y". عندما يريد صديقك إرسال رسالة لك، يسأل موظف الاستقبال فيوجه الرسالة فوراً إلى باب غرفتك الحالية.',
          storyEn: 'Your Endpoint ID (EID) is your passport number (who you are permanently). The RLOC is your current hotel room number. LISP MS/MR is the concierge desk registering your room checkout and checkin, ensuring incoming mail is routed directly to whatever hotel suite you currently occupy.',
          mappingTable: [
            { realLife: 'رقم جواز السفر الثابت للشخص', networkTech: 'Endpoint Identifier (EID)', ciscoTerm: 'Host /32 EID' },
            { realLife: 'عنوان الفندق والغرفة الحالية', networkTech: 'Routing Locator (RLOC)', ciscoTerm: 'Fabric Edge Loopback RLOC' },
            { realLife: 'مكتب الاستعلامات المركزي للفندق', networkTech: 'LISP Map-Server / Map-Resolver', ciscoTerm: 'Control Plane Node (MS/MR)' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 3.0: TRANSPORT TECHNOLOGIES & SEGMENT ROUTING (15% of CCIE Lab)
  // =========================================================================
  {
    id: 'ccie-unit-3-transport-segment-routing',
    track: 'ccie',
    trackTitleAr: 'منهج سيسكو CCIE Enterprise Infrastructure',
    trackTitleEn: 'Cisco CCIE Enterprise Infrastructure Track (v1.1 Blueprint)',
    examCode: 'CCIE Enterprise Lab & Practical Exam (v1.1)',
    unitNumber: 3,
    unitTitleAr: 'الوحدة 3: تقنيات النقل الحديثة والتوجيه المقطعي (Segment Routing & MPLS-TE)',
    unitTitleEn: 'Unit 3: Transport Technologies: Segment Routing (SR-MPLS / SRv6), Prefix/Adj-SIDs & Traffic Engineering',
    moduleBadge: 'CCIE Domain 3.0',
    officialDomain: '3.0 Transport Technologies (15% of CCIE Lab Blueprint)',
    summaryAr: 'ثورة هندسة المرور في شبكات النواقل: الانتقال من LDP/RSVP-TE المعقد إلى Segment Routing (SR-MPLS & SRv6)، تشريح معرفات المقاطع Prefix-SID و Adjacency-SID، وحساب مسارات TI-LFA للتعافي في أقل من 50ms.',
    summaryEn: 'Next-generation transport engineering: Eliminating LDP and RSVP-TE signaling using Source Routing architecture via Segment Routing (SR-MPLS / SRv6), Global Prefix-SIDs, Local Adjacency-SIDs, and Topology Independent Loop-Free Alternate (TI-LFA) sub-50ms protection.',
    topics: [
      {
        id: 'ccie-topic-3-1-segment-routing-srmpls-tilfa',
        track: 'ccie',
        titleAr: '3.1 التوجيه المقطعي Segment Routing (SR-MPLS, SIDs & TI-LFA Fast Reroute)',
        titleEn: '3.1 Segment Routing Fundamentals: Source Routing, Segment Types (Prefix-SID, Adj-SID) & TI-LFA',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §3.1 & §3.2',
        officialReferences: [
          { title: 'RFC 8402 - Segment Routing Architecture', type: 'RFC', code: 'RFC 8402', citation: 'IETF Segment Routing Standard Specification' },
          { title: 'RFC 8660 - Segment Routing with the MPLS Data Plane', type: 'RFC', code: 'RFC 8660', citation: 'IETF SR-MPLS Data Plane' },
          { title: 'Cisco Press Segment Routing Part 1 & Part 2', type: 'Cisco Press', code: 'ISBN: 978-1587144769', citation: 'Building Modern SR Networks' }
        ],
        summaryAr: 'المفهوم الثوري لـ Source Routing: تشفير مسار الحزمة بالكامل داخل ترويسة الحزمة عند نقطة الانطلاق (Ingress PE) دون حفظ أي حالة في راوترات المنتصف، وتحقيق حماية 100% ضد انقطاع الروابط بـ Topology Independent LFA.',
        summaryEn: 'Deconstructing Segment Routing architecture: Source Routing paradigm, SRGB (Segment Routing Global Block), Prefix-SID vs Adjacency-SID allocation, IS-IS/OSPF SR extensions, and deterministic TI-LFA sub-50ms failover.',
        contentMarkdownAr: `### 1. لماذا استبدل Segment Routing بروتوكولات LDP و RSVP-TE القديمة؟
- في شبكات MPLS التقليدية، كان كل راوتر في المسار يضطر لتشغيل بروتوكول LDP لتوزيع الليبلات، وبروتوكول RSVP-TE لحجز الباندويث، مما ينشئ ملايين حالات الـ State في قلب الشبكة (Core Scalability Bottleneck).
- **حل Segment Routing (SR):** الراوتر الأول فقط (Ingress PE) هو الذي يضع قائمة التعليمات (Segment List / Label Stack) على رأس الحزمة، وتمر الحزمة عبر راوترات الـ Core كتعليمات مقروءة دون الحاجة لحفظ أي حالة في القلب!

---

### 2. أنواع معرفات المقاطع (Segment Identifiers - SIDs):
1. **Prefix-SID (Global SID):** رقم ليبل عالمي فريد يمثل عقدة معينة (مثال: الراوتر 1 له Prefix-SID = 16001). يوزع عبر إضافات بروتوكول IGP (OSPF/IS-IS) مباشرة دون LDP!
2. **Adjacency-SID (Local SID):** ليبل محلي يمثل رابطاً فيزيائياً محدداً بين راوترين (مثال: الرابط المتجه للمنفذ Gi0/1 يحمل SID 24001).
3. **Binding-SID (BSID):** يمثل مسار هندسة مرور كامل (SR-TE Policy) لدمج مسارات معقدة في ليبل واحد.

---

### 3. تقنية التعافي الفوري (Topology Independent Loop-Free Alternate - TI-LFA):
- توفر حماية بديلة بنسبة **100%** ضد سقوط أي رابط أو عقدة في أي طوبولوجيا شبكية.
- تحسب المسار البديل وتجهزه في عتاد الـ ASIC مسبقاً، ويتم التحويل إليه في **أقل من 50 مللي ثانية (Sub-50ms Failover)** فور انقطاع الرابط الأساسي!`,
        contentMarkdownEn: `### 1. Segment Routing Building Blocks:
- **SRGB (Segment Routing Global Block):** Default 16000 to 23999.
- **Prefix-SID:** Global locator advertised via IS-IS/OSPF.
- **Adj-SID:** Locally significant interface hop.
- **TI-LFA:** Pre-calculated backup loop-free path guarantees 100% coverage < 50ms.

### 2. Cisco IOS-XR / XE Segment Routing Configuration:
\`\`\`cisco
segment-routing mpls
!
router isis 1
 net 49.0001.0000.0000.0001.00
 segment-routing mpls
 segment-routing prefix-sid index 1
 fast-reroute ti-lfa level-2
\`\`\``,
        technicalHighlights: [
          'في تقنية SRv6 (Segment Routing over IPv6 Data Plane)، يتم استبدال ليبلات الـ MPLS بعناوين IPv6 عادية بطول 128-bit داخل ترويسة Segment Routing Header (SRH - RFC 8754).',
          'ميزة TI-LFA تضمن مساراً خالياً من الحلقات (Post-Convergence Path) حتى في الطوبولوجيات المعقدة مثل شبكات الحلقات المزدوجة (Ring Topologies).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show isis segment-routing prefix-sid-map',
            deviceType: 'router',
            deviceName: 'R1-SR-CORE',
            mode: 'priv',
            category: 'Segment Routing Table',
            explanationAr: 'عرض جدول ربط عناوين الـ Loopback بأرقام الـ Prefix-SIDs والـ Label المخصص في نطاق SRGB.',
            explanationEn: 'Displays IS-IS Segment Routing prefix SID database and mapped MPLS label values.',
            output: `IS-IS 1 Prefix-SID Map:
Prefix                SID Type    Index    Label (SRGB: 16000-23999)
10.255.0.1/32         Absolute    1        16001
10.255.0.2/32         Absolute    2        16002
10.255.0.3/32         Absolute    3        16003`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'تذكرة قطار الترانزيت المطبوعة مسبقاً بمحطات التوقف',
          titleEn: 'Single Pre-Printed Express Train Transit Ticket with Turnstiles',
          storyAr: 'في الطريقة القديمة (LDP/RSVP)، كان المسافر يضطر للوقوف في شباك تذاكر كل محطة ترانزيت ليشتري تذكرة للمحطة التالية (بطيء ومستهلك للموارد). أما في Segment Routing، يطبع المسافر في محطة الانطلاق تذكرة واحدة عليها باركود يحتوي كامل محطات رحلته: (محطة 1 -> محطة 4 -> محطة 9)، ويمر عبر بوابات القطار في ثوانٍ دون التوقف في أي شباك!',
          storyEn: 'Traditional MPLS required passengers to queue at ticket booths at every intermediate city to negotiate onward travel. Segment Routing prints a complete itinerary barcode at the departure station listing all transit waypoints (Prefix-SIDs), allowing turnstiles to scan and route the traveler instantly.',
          mappingTable: [
            { realLife: 'محطة الانطلاق التي تطبع كامل مسار الرحلة', networkTech: 'SR Ingress PE Router', ciscoTerm: 'Headend Policy Router' },
            { realLife: 'الباركود الذي يحمل قائمة المحطات بالتسلسل', networkTech: 'SR-MPLS Label Stack / SID List', ciscoTerm: 'Segment List' },
            { realLife: 'بوابات القطار الإلكترونية التي تقرأ الباركود', networkTech: 'Transit Core Routers (P Routers)', ciscoTerm: 'SR Forwarding Engine' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 4.0: INFRASTRUCTURE SECURITY & ASSURANCE (15% of CCIE Lab)
  // =========================================================================
  {
    id: 'ccie-unit-4-security-services',
    track: 'ccie',
    trackTitleAr: 'منهج سيسكو CCIE Enterprise Infrastructure',
    trackTitleEn: 'Cisco CCIE Enterprise Infrastructure Track (v1.1 Blueprint)',
    examCode: 'CCIE Enterprise Lab & Practical Exam (v1.1)',
    unitNumber: 4,
    unitTitleAr: 'الوحدة 4: خدمات الأمان المؤسسية المتقدمة وجودة الخدمة (802.1X, MACsec & Advanced QoS)',
    unitTitleEn: 'Unit 4: Advanced Security & Services: 802.1X Dynamic Auth, MACsec (802.1AE) & MQC Hierarchical QoS',
    moduleBadge: 'CCIE Domain 4.0',
    officialDomain: '4.0 Security & Network Services (15% of CCIE Lab Blueprint)',
    summaryAr: 'تأمين الشبكات الصفرية (Zero-Trust Access): مصادقة الأجهزة بـ IEEE 802.1X مع Cisco ISE و MAB، تشفير الروابط الفيزيائية بسرعة العتاد بـ MACsec (IEEE 802.1AE 256-bit)، وهيكلية جودة الخدمة الهرمية Hierarchical QoS (HQoS).',
    summaryEn: 'Enterprise Zero-Trust defense: Port-based authentication with IEEE 802.1X and MAC Authentication Bypass (MAB), line-rate Layer 2 encryption with MACsec (802.1AE 128/256-bit with MKA), and 3-level Hierarchical QoS (HQoS) traffic scheduling.',
    topics: [
      {
        id: 'ccie-topic-4-1-8021x-macsec-layer2-encryption',
        track: 'ccie',
        titleAr: '4.1 مصادقة الأجهزة 802.1X وتشفير الروابط العتادي MACsec (IEEE 802.1AE)',
        titleEn: '4.1 Zero-Trust Layer 2 Defense: IEEE 802.1X Authentication, MAB, MKA & MACsec Link Encryption',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §4.1 & §4.2',
        officialReferences: [
          { title: 'IEEE 802.1AE-2018 - Media Access Control (MAC) Security', type: 'IEEE Standard', code: 'IEEE 802.1AE', citation: 'MACsec Line-Rate Encryption Specification' },
          { title: 'IEEE 802.1X-2020 - Port-Based Network Access Control', type: 'IEEE Standard', code: 'IEEE 802.1X', citation: 'EAP Authentication Framework' },
          { title: 'Cisco Press Network Access Control with Cisco ISE', type: 'Cisco Press', code: 'ISBN: 978-1587144462', citation: 'Identity Services Engine Architecture' }
        ],
        summaryAr: 'منع اختراق المنافذ والتنصت على كوابل الألياف: مصادقة المستخدمين بـ 802.1X / EAP-TLS، واستخدام MAC Authentication Bypass (MAB) لطابعات وإنترنت الأشياء، وتشفير كافة الفريمات بسرعة 100Gbps عتادياً بـ MACsec مع بروتوكول تبادل المفاتيح MKA.',
        summaryEn: 'Hardening enterprise campus edges: IEEE 802.1X Extensible Authentication Protocol (EAP-TLS/PEAP), MAC Authentication Bypass fallback, and line-rate hardware frame encryption with IEEE 802.1AE MACsec using MACsec Key Agreement (MKA).',
        contentMarkdownAr: `### 1. أركان مصادقة الـ 802.1X الثلاثة:
1. **Supplicant (العميل):** البرنامج أو نظام التشغيل على جهاز المستخدم (Windows/macOS/Linux) الذي يرسل طلب المصادقة.
2. **Authenticator (الموثق):** سويتش الوصول (Access Switch) الذي يتحكم بفتح المنفذ أو إغلاقه.
3. **Authentication Server (خادم المصادقة):** خادم **Cisco ISE** الذي يفحص الشهادات الرقمية أو بيانات الدخول في Active Directory ويرسل أمر فتح المنفذ (RADIUS Access-Accept) مع رقم الـ VLAN ووسم الـ SGT المناسب.

---

### 2. تشفير الطبقة الثانية العتادي MACsec (IEEE 802.1AE):
- بينما يشفر IPsec الطبقة الثالثة فقط، يقوم **MACsec** بتشفير فريم الطبقة الثانية بالكامل (من بعد ترويسة MAC وحتى الـ Payload) باستخدام خوارزميات **AES-GCM-128 / AES-GCM-256**.
- ينفذ التشفير داخل رقاقات السويتش العتادية (Line-Rate Crypto ASICs) بدون أي تأخير (Zero-Latency) عبر روابط 10G/40G/100G.
- بروتوكول **MACsec Key Agreement (MKA)** يدير توليد وتبديل مفاتيح التشفير تلقائياً وبأمان فائق.`,
        contentMarkdownEn: `### 1. 802.1X & MACsec Mechanics:
- **802.1X:** Port remains unauthorized until EAP-TLS/PEAP exchange succeeds with Cisco ISE.
- **MACsec (802.1AE):** Point-to-point line-rate hardware encryption preventing fiber wiretapping.
- **MKA:** Negotiates Security Association Keys (SAK) between switches.

### 2. Cisco Switch 802.1X & MACsec Configuration:
\`\`\`cisco
mka policy MKA_SECURE_POL
 key-server priority 1
 macsec-cipher-suite gcm-aes-256
!
interface TenGigabitEthernet1/0/1
 authentication host-mode multi-domain
 authentication port-control auto
 dot1x pae authenticator
 macsec
 mka pre-shared-key key-chain MACSEC_KEYS
\`\`\``,
        technicalHighlights: [
          'نمط multi-auth في 802.1X يسمح بتوصيل عدة أجهزة كمبيوتر خلف هاتف IP واحد مع فحص ومصادقة كل جهاز بشكل مستقل تماماً.',
          'تقنية MACsec WAN تتيح تشفير روابط الـ Dark Fiber و Metro Ethernet بين الفروع ومراكز البيانات دون التأثير على سرعة نقل البيانات.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show mka sessions',
            deviceType: 'l3switch',
            deviceName: 'CAT9500-UPLINK',
            mode: 'priv',
            category: 'MACsec Encryption Session',
            explanationAr: 'عرض جلسة تشفير MACsec النشطة ونوع التشفير AES-256 وحالة تبادل المفاتيح بـ MKA.',
            explanationEn: 'Displays active MKA session parameters, peer MAC, key server status, and negotiated MACsec cipher.',
            output: `Interface   Local-TxSCI          Policy-Name       Inherited  Key-Server
-------------------------------------------------------------------------
Te1/0/1     0050.5684.a101/0001  MKA_SECURE_POL    NO         YES

Session Summary:
  Status: SECURED
  Peer MAC: 0050.5684.a102
  Cipher Suite: GCM-AES-256
  Transmitted Encrypted Packets: 451,890,230
  Received Decrypted Packets: 412,094,110`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'الحقيبة الدبلوماسية المدرعة ذات القفل الإلكتروني المشفر',
          titleEn: 'Armored Diplomatic Pouch with Tamper-Proof Electronic Lock',
          storyAr: 'بروتوكول 802.1X هو حارس السفارة الذي يفحص جواز سفرك قبل فتح البوابة الخارجية. أما MACsec فهو الحقيبة الدبلوماسية المدرعة المصفحة بالكامل: حتى لو تمكن جاسوس من اعتراض كابل الألياف الضوئية في الشارع (Fiber Tapping)، فلن يرى سوى كتل مشفرة بـ AES-256 يستحيل فكها!',
          storyEn: '802.1X is the security guard validating credentials before unlocking the facility gate. MACsec is an armored titanium diplomatic pouch: even if a spy taps the underground fiber optic cable, all intercepted signals appear as unbreakable AES-256 encrypted noise.',
          mappingTable: [
            { realLife: 'فحص الهوية والجواز عند بوابة المنشأة', networkTech: 'IEEE 802.1X Port Authentication', ciscoTerm: 'authentication port-control auto' },
            { realLife: 'الحقيبة الدبلوماسية المصفحة بالكامل', networkTech: 'MACsec (IEEE 802.1AE Link Encryption)', ciscoTerm: 'macsec-cipher-suite gcm-aes-256' },
            { realLife: 'المفتاح الدبلوماسي اليومي المشترك المتغير', networkTech: 'MKA Key Agreement Protocol', ciscoTerm: 'mka pre-shared-key' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 5.0: INFRASTRUCTURE AUTOMATION & PROGRAMMABILITY (15% of CCIE Lab)
  // =========================================================================
  {
    id: 'ccie-unit-5-automation-programmability',
    track: 'ccie',
    trackTitleAr: 'منهج سيسكو CCIE Enterprise Infrastructure',
    trackTitleEn: 'Cisco CCIE Enterprise Infrastructure Track (v1.1 Blueprint)',
    examCode: 'CCIE Enterprise Lab & Practical Exam (v1.1)',
    unitNumber: 5,
    unitTitleAr: 'الوحدة 5: أتمتة الشبكات المتقدمة والبث القياسي (pyATS, gNMI Telemetry & GitOps)',
    unitTitleEn: 'Unit 5: Automation & Programmability: Cisco pyATS/Genie, Model-Driven Telemetry (gNMI/gRPC) & GitOps',
    moduleBadge: 'CCIE Domain 5.0',
    officialDomain: '5.0 Automation & Programmability (15% of CCIE Lab Blueprint)',
    summaryAr: 'الأتمتة الهندسية المتقدمة: اختبار الشبكات آلياً بـ Cisco pyATS و Genie Parsers، واستبدال استعلامات SNMP بـ Model-Driven Telemetry (gNMI/gRPC Streaming)، وإدارة الشبكات كأكواد برمجية (GitOps & Ansible Infrastructure-as-Code).',
    summaryEn: 'Expert test automation and streaming telemetry: Python testing frameworks with Cisco pyATS/Genie, Model-Driven Streaming Telemetry (gNMI/gRPC, NETCONF dial-in/dial-out), and Infrastructure-as-Code (IaC) CI/CD deployment pipelines.',
    topics: [
      {
        id: 'ccie-topic-5-1-pyats-genie-testbed-automation',
        track: 'ccie',
        titleAr: '5.1 أتمتة الفحص والتحقق من الشبكات باستخدام Cisco pyATS و Genie Parsers',
        titleEn: '5.1 Automated Network Testing: Cisco pyATS Framework, Genie Parsers & Model-Driven Telemetry (gNMI)',
        level: 'CCIE',
        ciscoBlueprintRef: 'CCIE v1.1 Blueprint §5.1 & §5.2',
        officialReferences: [
          { title: 'Cisco DevNet pyATS Documentation & Guide', type: 'Cisco DevNet', code: 'Cisco pyATS v24.x', citation: 'Enterprise Test Automation Framework' },
          { title: 'RFC 8528 - YANG Schema Mount & Streaming Telemetry', type: 'RFC', code: 'RFC 8528', citation: 'IETF Model-Driven Telemetry Architecture' },
          { title: 'Cisco Press Network Programmability and Automation', type: 'Cisco Press', code: 'ISBN: 978-1587145148', citation: 'Automating Enterprise Infrastructure' }
        ],
        summaryAr: 'تحويل مخرجات أوامر سيسكو النصية إلى كائنات Python برمجية منظمة: كيفية استخدام مكتبة pyATS لربط مئات الأجهزة عبر Testbed YAML، ومقارنة لقطات الشبكة (Genie Diff) لاكتشاف أي تغيير أو فقدان مسارات قبل وبعد عمليات الصيانة آلياً.',
        summaryEn: 'Eliminating manual CLI post-checks: Utilizing Cisco pyATS and Genie to parse unstructured CLI outputs into structured Python dictionaries, performing automated regression testing, and verifying network operational state diffs in CI/CD pipelines.',
        contentMarkdownAr: `### 1. لماذا يعتبر Cisco pyATS المعيار الذهبي لاختبارات مهندسي الـ CCIE؟
- طورته شركة سيسكو داخلياً لاختبار كافة أنظمة التشغيل (IOS-XE, IOS-XR, NX-OS) قبل إطلاقها، ثم جعلته مفتوح المصدر (Open Source).
- **ملف الـ Testbed (YAML):** يصف كافة أجهزة الشبكة، وعناوين الإدارة، وبروتوكولات الاتصال (SSH/Telnet)، وبيانات الاعتماد.
- **محرك Genie Parsers:** يحول أي أمر سيسكو نصي (مثل \`show ip route\` أو \`show ip ospf neighbor\`) إلى **Python Dictionary / JSON** منظم في جزء من الثانية!

---

### 2. ميزة مقارنة لقطات الشبكة (Genie Diff / Snapshot):
1. قبل إجراء الصيانة، يشغل المهندس أمر \`genie learn ospf --testbed testbed.yaml --output pre_maint\`.
2. يقوم المهندس بتحديث برمجيات الراوتر أو تبديل الكابلات.
3. يشغل المهندس أمر \`genie learn ospf --testbed testbed.yaml --output post_maint\`.
4. يشغل أمر المقارنة الآلي: \`genie diff pre_maint post_maint\`. يظهر التقرير في ثوانٍ أي راوتر OSPF مفقود أو أي بادئة اختفت بلون أحمر بارز!

---

### 3. البث القياسي المعتمد على النماذج (Model-Driven Streaming Telemetry):
- استبدال تقنية SNMP Polling القديمة البطيئة التي تسأل الجهاز كل 5 دقائق بنظام **Streaming Telemetry**.
- يقوم الراوتر بضخ آلاف قراءات العدادات واستخدام المعالج وحالة المنافذ عبر قنوات **gRPC / gNMI** فوراً في أجزاء من الثانية بمجرد حدوث أي تغيير!`,
        contentMarkdownEn: `### 1. Cisco pyATS & Genie Capabilities:
- Parses unstructured CLI text into structured JSON/dict data structures.
- Automated Snapshot & Diff: \`genie diff pre_snapshot post_snapshot\` to pinpoint state regressions.

### 2. Python pyATS Automation Script Example:
\`\`\`python
from pyats.topology import loader
from genie.testbed import load

# 1. Load Testbed
testbed = load('testbed.yaml')
router = testbed.devices['R1-CORE']
router.connect()

# 2. Parse Routing Table to Structured Dict
parsed_routes = router.parse('show ip route')
print(f"Total active routes: {len(parsed_routes['vrf']['default']['address_family']['ipv4']['routes'])}")

# 3. Assert OSPF Neighbors
parsed_ospf = router.parse('show ip ospf neighbor')
neighbors = parsed_ospf['interfaces']['GigabitEthernet0/0/0']['neighbors']
assert '2.2.2.2' in neighbors, "CRITICAL: OSPF Neighbor 2.2.2.2 is DOWN!"
print("Automated Health Check: PASSED")
\`\`\``,
        technicalHighlights: [
          'مكتبة pyATS مدمجة بالكامل مع أدوات الـ CI/CD مثل GitHub Actions و GitLab لتنفيذ اختبارات قبول الشبكة (Network Acceptance Tests) تلقائياً قبل دمج التغييرات.',
          'بروتوكول gNMI (gRPC Network Management Interface) يوفر عمليات Get و Set و Subscribe الموحدة عبر كافة الشركات المصنعة باستخدام نماذج OpenConfig YANG.'
        ],
        ciscoCliOutputs: [
          {
            command: 'pyats run job network_health_check_job.py --testbed-file testbed.yaml',
            deviceType: 'router',
            deviceName: 'DEVOPS-RUNNER',
            mode: 'priv',
            category: 'pyATS Automated Test Run',
            explanationAr: 'تشغيل وظيفة اختبار صحة الشبكة الآلية عبر pyATS وطباعة نتائج فحص بروتوكولات OSPF و BGP والمنافذ.',
            explanationEn: 'Executes automated pyATS test suite verifying Layer 2 trunking, OSPF adjacencies, and BGP routing state across 50 devices.',
            output: `+------------------------------------------------------------------------------+
| pyATS Testbed Execution Summary: network_health_check_job                    |
+------------------------------------------------------------------------------+
Total Testcases Executed : 15
Passed                   : 15 (100%)
Failed                   : 0
Aborted                  : 0

Detailed Results:
  - Verify_OSPF_Adjacencies_All_Devices .................... PASSED
  - Verify_BGP_Peer_Established_State ...................... PASSED
  - Verify_Interface_Zero_Packet_Errors .................... PASSED
  - Verify_BGP_Prefix_Count_Threshold ...................... PASSED`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'الفحص الميكانيكي الآلي بالكمبيوتر لسيارات الفورمولا 1',
          titleEn: 'Formula 1 Computerized Diagnostic Rig and Real-Time Telemetry',
          storyAr: 'الفحص اليدوي القديم يشبه ميكانيكياً يفحص براغي السيارة بيده واحداً تلو الآخر (CLI Manual Checks). أما pyATS و Streaming Telemetry فهما مثل الحواسيب العملاقة في حلبة الفورمولا 1: ترتبط بالسيارة وتقرأ آلاف الحساسات في جزء من الثانية، وتصدر تقريراً فورياً بسلامة المحرك ومستوى الزيت والإطارات قبل انطلاق السباق.',
          storyEn: 'Manual CLI debugging is a mechanic tapping tire bolts by hand. pyATS and Streaming Telemetry represent Formula 1 telemetry sensors streaming thousands of engine diagnostics per millisecond to racing engineers, automatically verifying mechanical readiness before green lights flash.',
          mappingTable: [
            { realLife: 'ملف مواصفات أسطول سيارات السباق بالكامل', networkTech: 'pyATS Testbed YAML Configuration', ciscoTerm: 'testbed.yaml' },
            { realLife: 'المترجم الآلي الذي يقرأ إشارات الحساسات', networkTech: 'Genie Parser (Text to JSON Engine)', ciscoTerm: 'device.parse()' },
            { realLife: 'المقارنة الفورية لحالة المحرك قبل وبعد التعديل', networkTech: 'Genie Snapshot & Diff Verification', ciscoTerm: 'genie diff' }
          ]
        }
      }
    ]
  }
];
