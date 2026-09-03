import { CurriculumSection } from '../types';
import { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

export const CCNA_CURRICULUM_MODULES: CurriculumSection[] = [
  // =========================================================================
  // DOMAIN 1.0: NETWORK FUNDAMENTALS (20% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-1-network-fundamentals',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 1,
    unitTitleAr: 'الوحدة 1: أساسيات وبنية الشبكات (Network Fundamentals)',
    unitTitleEn: 'Unit 1: Network Fundamentals & OSI/TCP-IP Architecture',
    moduleBadge: 'CCNA Domain 1.0',
    officialDomain: '1.0 Network Fundamentals (20% of Exam)',
    summaryAr: 'شرح معمق للطبقات السبع OSI، ونموذج TCP/IP، وهندسة فريم الإيثرنت، وحسابات الـ Subnetting و VLSM، والمقارنة بين بروتوكولي TCP و UDP والبنى المعمارية للشبكات.',
    summaryEn: 'Deep dive into OSI 7-Layer model, TCP/IP stack, Ethernet II framing, IPv4 Subnetting & VLSM, IPv6 addressing, physical cabling, and transport protocol mechanics (TCP vs UDP).',
    topics: [
      {
        id: 'ccna-topic-1-1-osi-tcpip-model',
        track: 'ccna',
        titleAr: '1.1 تشريح نموذجي OSI و TCP/IP ودورة حياة تغليف البيانات (Encapsulation)',
        titleEn: '1.1 OSI 7-Layer Model, TCP/IP Suite & Data Encapsulation Lifecycle',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.1 & §1.2',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'ISBN: 978-0135792735', citation: 'Chapter 1: Introduction to TCP/IP Networking (Wendell Odom)' },
          { title: 'RFC 791 - Internet Protocol Specification', type: 'RFC', code: 'RFC 791', citation: 'DARPA Internet Program Protocol Specification' },
          { title: 'RFC 793 - Transmission Control Protocol', type: 'RFC', code: 'RFC 793', citation: 'IETF Transmission Control Protocol Specification' }
        ],
        summaryAr: 'تحليل دقيق لكيفية تغليف البيانات (Encapsulation) وفك التغليف (Decapsulation) عبر طبقات البروتوكول مع عناوين الـ MAC والـ IP وأرقام المنافذ Port Numbers.',
        summaryEn: 'Detailed analysis of PDU encapsulation (Data -> Segment -> Packet -> Frame -> Bits) and decapsulation across network endpoints.',
        contentMarkdownAr: `### 1. دورة حياة تغليف البيانات (PDU Lifecycle & Encapsulation):
عند إرسال بيانات من تطبيق (مثل متصفح الويب عبر HTTP/HTTPS):
1. **الطبقة 7، 6، 5 (Application/Presentation/Session):** توليد **Data Stream**.
2. **الطبقة 4 (Transport Layer):** تقسيم البيانات وإضافة ترويسة TCP/UDP تحتوي على **Source Port** و **Destination Port** (الوحدة تسمى **Segment**).
3. **الطبقة 3 (Network Layer):** إضافة ترويسة IP تحتوي على **Source IP** و **Destination IP** و **TTL** (الوحدة تسمى **Packet**).
4. **الطبقة 2 (Data Link Layer):** إضافة ترويسة Ethernet تحتوي على **Source MAC** و **Destination MAC** و **EtherType** وتذييل **FCS/CRC** (الوحدة تسمى **Frame**).
5. **الطبقة 1 (Physical Layer):** تحويل الفريم إلى نبضات كهربائية أو ضوئية أو موجات لاسلكية (الوحدة تسمى **Bits**).

---

### 2. مقارنة النماذج المعيارية (OSI Model vs TCP/IP Suite):
- **OSI Model (7 Layers):** نموذج مرجعي أكاديمي صارم (Physical, Data Link, Network, Transport, Session, Presentation, Application).
- **TCP/IP Model (4/5 Layers):** النموذج العملي الفعلي لشبكة الإنترنت (Network Access, Internet, Transport, Application).`,
        contentMarkdownEn: `### 1. PDU Encapsulation & Decapsulation Mechanics:
When an application generates payload:
1. **Layers 7, 6, 5 (Application):** Raw data stream produced.
2. **Layer 4 (Transport):** Encapsulates payload with L4 header (Source & Destination Ports, Sequence numbers) -> **Segment**.
3. **Layer 3 (Network):** Adds L3 IP header (Source IP, Destination IP, TTL, Protocol ID) -> **Packet**.
4. **Layer 2 (Data Link):** Encapsulates packet with L2 Ethernet header (Source MAC, Destination MAC, EtherType) and Trailer (FCS/CRC-32) -> **Frame**.
5. **Layer 1 (Physical):** Encodes frame into optical, electrical, or RF signals -> **Bits**.`,
        technicalHighlights: [
          'عناوين IP تمثل المسار الكلي الشامل (End-to-End)، بينما عناوين MAC تتغير عند كل قفزة راوتر (Hop-by-Hop).',
          'ترويسة TCP حجمها الأدنى 20 بايت وتضمن الوصول الموثوق، بينما ترويسة UDP حجمها 8 بايت وتوفر أقصى سرعة.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show protocols',
            deviceType: 'router',
            deviceName: 'R1-GATEWAY',
            mode: 'priv',
            category: 'Interface & Protocol Status',
            explanationAr: 'عرض البروتوكولات المفعلة وعناوين الـ IP وأقنعة الشبكات الفرعية على كل واجهة.',
            explanationEn: 'Displays global active protocols, interface IP addresses and subnet masks.',
            output: `Global values:
  Internet Protocol routing is enabled
GigabitEthernet0/0/0 is up, line protocol is up
  Internet address is 192.168.1.1/24
GigabitEthernet0/0/1 is up, line protocol is up
  Internet address is 10.0.0.1/30`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'مستند الشركة والمظاريف الدبلوماسية المتعددة',
          titleEn: 'Corporate Letters Inside Diplomatic Envelopes',
          storyAr: 'تخيل خطاباً سرياً: يوضع الخطاب داخل مظروف مكتوب عليه اسم القسم (Layer 4 Port)، ثم يوضع في صندوق بريد البريد السريع الدولي مع عنوان المدينة والشارع (Layer 3 IP)، ثم يوضع الصندوق داخل شاحنة نقل خاصة تملك لوحة ترخيص لنقله إلى المطار (Layer 2 MAC).',
          storyEn: 'A business document is placed in an internal folder labeled with department number (L4 Port), put inside an international courier box with street address (L3 IP), and loaded onto a delivery van with physical license plate (L2 MAC).',
          mappingTable: [
            { realLife: 'محتوى الرسالة الأصلية', networkTech: 'Application Payload (Data)', ciscoTerm: 'Data Payload' },
            { realLife: 'رقم المكتب أو القسم الداخلي', networkTech: 'TCP/UDP Port Number', ciscoTerm: 'L4 Port (e.g. 80, 443, 53)' },
            { realLife: 'عنوان المبنى والمدينة الدولي', networkTech: 'IPv4 / IPv6 Address', ciscoTerm: 'L3 Network Address' },
            { realLife: 'لوحة ترخيص شاحنة النقل الحالية', networkTech: 'MAC Address (Layer 2)', ciscoTerm: 'Ethernet Source/Dest MAC' }
          ]
        }
      },
      {
        id: 'ccna-topic-1-2-ipv4-subnetting-vlsm',
        track: 'ccna',
        titleAr: '1.2 تقسيم الشبكات المتقدم (IPv4 Subnetting, VLSM & CIDR)',
        titleEn: '1.2 IPv4 Addressing, Variable Length Subnet Masking (VLSM) & CIDR',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.6 & §1.7',
        officialReferences: [
          { title: 'RFC 1878 - Variable Length Subnet Table For IPv4', type: 'RFC', code: 'RFC 1878', citation: 'Internet Engineering Task Force Subnetting Tables' },
          { title: 'Cisco Validated Design: IP Addressing Best Practices', type: 'Cisco Validated Design', code: 'CVD-IP-PLAN', citation: 'Hierarchical Enterprise IP Addressing Design' }
        ],
        summaryAr: 'إتقان حسابات الـ Subnetting و VLSM و CIDR مع استخراج Network ID و Broadcast IP والمدى الصالح للأجهزة (Usable Host Range).',
        summaryEn: 'Mastering binary/decimal IP calculations, custom subnet masking, and Variable Length Subnet Masking (VLSM) efficiency.',
        contentMarkdownAr: `### 1. القواعد الرياضية لتقسيم الشبكات (Subnetting Math):
- **عدد الشبكات الفرعية الناتجة:** $2^s$ (حيث $s$ هو عدد البتات المستعارة من قسم الـ Host).
- **عدد الأجهزة الصالحة في كل شبكة:** $2^h - 2$ (حيث $h$ هو عدد البتات المتبقية لقسم الـ Host، ونطرح 2 لعنوان الشبكة Network ID وعنوان البث Broadcast IP).
- **الرقم السحري (Magic Number / Block Size):** $256 - \\text{قيمة البايت المعدل في قناع الشبكة}$.

---

### 2. جدول تحويل الأقنعة الشهيرة (CIDR Notation):
| البادئة (CIDR) | قناع الشبكة (Subnet Mask) | الرقم السحري (Block Size) | الأجهزة الصالحة (Usable Hosts) |
| :--- | :--- | :--- | :--- |
| **/24** | \`255.255.255.0\` | 1 | 254 |
| **/26** | \`255.255.255.192\` | 64 | 62 |
| **/28** | \`255.255.255.240\` | 16 | 14 |
| **/30** | \`255.255.255.252\` | 4 | 2 (لوصلات P2P المباشرة) |
| **/32** | \`255.255.255.255\` | 1 | 1 (Host Route / Loopback) |`,
        contentMarkdownEn: `### 1. Mathematical Formulas for Subnetting:
- **Number of subnets:** $2^s$ (where $s$ = borrowed host bits).
- **Usable hosts per subnet:** $2^h - 2$ (where $h$ = remaining host bits, subtracting 2 for Network ID and Broadcast).
- **Magic Number (Block Size increment):** $256 - \\text{modified octet value}$.`,
        technicalHighlights: [
          'تقنية VLSM تمنع هدر عناوين الـ IPv4 عبر تخصيص أقنعة تناسب الحجم الدقيق لكل قسم في المؤسسة.',
          'عنوان الشبكة (Network ID) جميع بتات الـ Host فيه أصفار، وعنوان البث (Broadcast) جميع بتات الـ Host فيه آحاد.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip route connected',
            deviceType: 'router',
            deviceName: 'R1-HQ-CORE',
            mode: 'priv',
            category: 'Routing Subnets',
            explanationAr: 'عرض الشبكات الفرعية المتصلة مباشرة وأقنعتها المحسوبة بـ VLSM.',
            explanationEn: 'Displays directly connected subnets and their calculated VLSM prefixes.',
            output: `      10.0.0.0/8 is variably subnetted, 4 subnets, 3 masks
C        10.10.0.0/25 is directly connected, GigabitEthernet0/0/0
C        10.10.0.128/26 is directly connected, GigabitEthernet0/0/1
C        10.10.0.192/30 is directly connected, Serial0/1/0
L        10.10.0.193/32 is directly connected, Serial0/1/0`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'تقسيم قطعة أرض كبرى إلى أحياء ومنازل',
          titleEn: 'Subdividing Land Parcels Into Municipal Lots',
          storyAr: 'يشبه تقسيم الـ IP تقطيع قطعة أرض كبرى: الحي الكبير للمصانع يحتاج مساحة كبرى (قناع /24)، بينما المكاتب الصغيرة تخصص لها قطع صغيرة (قناع /28)، ورابط الحراسة بين البوابتين يحتاج ممراً لشخصين فقط (قناع /30).',
          storyEn: 'Subnetting is like subdividing a large tract of land: large industrial plants get spacious sectors (/24), regional branch offices get medium lots (/26), and a private security gate link gets a 2-person walkway (/30).',
          mappingTable: [
            { realLife: 'قطعة الأرض الكلية غير المقسمة', networkTech: 'Classful Major Network (/16 or /8)', ciscoTerm: 'Major Network' },
            { realLife: 'رقم الحي وبوابة الدخول العامة', networkTech: 'Network ID (First IP in range)', ciscoTerm: 'Subnet ID' },
            { realLife: 'مكبر الصوت الخاص بإنذار كامل الحي', networkTech: 'Directed Broadcast IP (Last IP)', ciscoTerm: 'Subnet Broadcast' },
            { realLife: 'المنازل المأهولة بالسكان داخل الحي', networkTech: 'Usable Host IP Range', ciscoTerm: 'Usable Host Range' }
          ]
        }
      },
      {
        id: 'ccna-topic-1-3-ipv6-addressing-architecture',
        track: 'ccna',
        titleAr: '1.3 معمارية العنونة بـ IPv6 والأنواع (Global Unicast, Link-Local, EUI-64)',
        titleEn: '1.3 IPv6 Addressing Architecture, Types (GUA, ULA, Link-Local) & EUI-64 Format',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.8, §1.9 & §1.10',
        officialReferences: [
          { title: 'RFC 4291 - IP Version 6 Addressing Architecture', type: 'RFC', code: 'RFC 4291', citation: 'IETF IPv6 Addressing Architecture' },
          { title: 'RFC 4862 - IPv6 Stateless Address Autoconfiguration', type: 'RFC', code: 'RFC 4862', citation: 'SLAAC Mechanism' }
        ],
        summaryAr: 'دراسة بنية عنوان IPv6 المكون من 128 بت (32 خانة ست عشرية)، وقواعد الاختصار، والأنواع: Global Unicast (2000::/3)، Unique Local (FC00::/7)، و Link-Local (FE80::/10)، والتوليد الذاتي EUI-64.',
        summaryEn: 'Dissection of 128-bit IPv6 address structure, zero-compression rules, address scopes (GUA, ULA, Link-Local), and EUI-64 modified MAC calculation.',
        contentMarkdownAr: `### 1. بنية عنوان الـ IPv6 (128 Bits / 16 Bytes):
يكتب في 8 مجموعات ست عشرية (Hextets) مفصولة بنقطتين (\`:\`):
- **قواعد الاختصار (Compression Rules):**
  1. حذف الأصفار البادئة (Leading Zeros) في أي مجموعة (\`0042\` تصبح \`42\`).
  2. استبدال مجموعة متتالية من الأصفار بـ \`::\` (تستخدم **مرة واحدة فقط** في العنوان لتجنب الغموض).

---

### 2. تصنيف نطاقات عناوين IPv6:
- **Global Unicast Address (GUA):** يبدأ بـ \`2000::/3\` (عناوين عامة موجهة عالمياً على الإنترنت مثل IPv4 Public).
- **Unique Local Address (ULA):** يبدأ بـ \`FC00::/7\` أو \`FD00::/8\` (عناوين داخلية للمؤسسة مثل RFC 1918 Private).
- **Link-Local Address:** يبدأ بـ \`FE80::/10\` (عنوان اتصالات محلي على نفس الكابل فقط، لا يوجه عبر الراوترات).
- **Multicast Address:** يبدأ بـ \`FF00::/8\` (استبدل الـ Broadcast في IPv6).

---

### 3. آلية EUI-64 لحساب معرف الجهاز (Interface ID):
1. أخذ عنوان MAC المكون من 48 بت (مثال: \`00:11:22:33:44:55\`).
2. إقحام \`FF:FE\` في المنتصف ليصبح 64 بت (\`00:11:22:FF:FE:33:44:55\`).
3. قلب البت السابع (Universal/Local bit) من البايت الأول (\`00\` الثنائية \`00000000\` تصبح \`00000010\` أي \`02\`).`,
        contentMarkdownEn: `### 1. IPv6 Address Architecture & Compression:
- 128 bits represented in 8 hextets of 4 hexadecimal digits.
- Rule 1: Omit leading zeros in any hextet.
- Rule 2: Compress contiguous blocks of zeros with \`::\` once per address.

### 2. Cisco IPv6 Configuration:
\`\`\`cisco
ipv6 unicast-routing
interface GigabitEthernet0/0/0
 ipv6 address 2001:db8:acad:1::1/64
 ipv6 address fe80::1 link-local
 ipv6 address autoconfig
\`\`\``,
        technicalHighlights: [
          'IPv6 يلغي تماماً مفهوم البث العام (Broadcast) ويستبدله بالبث الموجه المتعدد (Multicast) و Anycast.',
          'كل منفذ راوتر مفعل عليه IPv6 يملك حتماً عنوان Link-Local يبدأ بـ FE80 ويستخدم كـ Next-Hop في بروتوكولات التوجيه.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ipv6 interface brief',
            deviceType: 'router',
            deviceName: 'R1-HQ-IPV6',
            mode: 'priv',
            category: 'IPv6 Interfaces',
            explanationAr: 'عرض عناوين الـ IPv6 العامة وعناوين الـ Link-Local على كافة منافذ الراوتر.',
            explanationEn: 'Displays summary status of IPv6 addresses assigned to interfaces.',
            output: `GigabitEthernet0/0/0   [up/up]
    FE80::1
    2001:DB8:ACAD:1::1
GigabitEthernet0/0/1   [up/up]
    FE80::1
    2001:DB8:ACAD:2::1`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'أرقام الحسابات البنكية الدولية IBAN',
          titleEn: 'International Bank Account Numbers (IBAN)',
          storyAr: 'مثلما وفر رقم الـ IBAN فضاءً رقمياً هائلاً يحتوي على رمز الدولة والبنك ورقم الحساب لمنع أي تشابه عالمي، فإن IPv6 يوفر 340 أنديسيليون عنوان بحيث يمكن إعطاء عنوان IP فريد لكل ذرة رمل على وجه الأرض.',
          storyEn: 'Just as the IBAN banking system created a universally structured identifier preventing account collisions globally, IPv6 provides 340 undecillion addresses ensuring an infinite addressing space.',
          mappingTable: [
            { realLife: 'رمز الدولة والبنك في الـ IBAN', networkTech: 'Global Routing Prefix (First 48 bits)', ciscoTerm: 'Global Routing Prefix' },
            { realLife: 'رقم الفرع التابع للبنك', networkTech: 'Subnet ID (16 bits)', ciscoTerm: 'Subnet ID' },
            { realLife: 'رقم الحساب الشخصي للعميل', networkTech: 'Interface ID (64 bits)', ciscoTerm: 'Interface ID (EUI-64)' }
          ]
        }
      },
      {
        id: 'ccna-topic-1-4-enterprise-topologies-architectures',
        track: 'ccna',
        titleAr: '1.4 الهياكل الطوبولوجية للشبكات وتصاميم المؤسسات (2-Tier, 3-Tier, Spine-Leaf)',
        titleEn: '1.4 Network Topologies, 2-Tier Collapsed Core, 3-Tier Enterprise & Spine-Leaf Architectures',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.2 & §1.4',
        officialReferences: [
          { title: 'Cisco Validated Design: Enterprise Campus 3-Tier Architecture', type: 'Cisco Validated Design', code: 'CVD-CAMPUS-3TIER', citation: 'High-Availability Campus Network Design' },
          { title: 'Cisco Data Center Spine-Leaf Architecture Whitepaper', type: 'Cisco Whitepaper', code: 'DC-SPINE-LEAF-2022', citation: 'Clos Network Topologies for Modern Data Centers' }
        ],
        summaryAr: 'مقارنة معمارية مفصلة بين التصميم الهرمي ثلاثي الطبقات (Core, Distribution, Access)، وتصميم النواة المدمجة (Collapsed Core / 2-Tier)، وتصميم مراكز البيانات Spine-Leaf (Clos Architecture).',
        summaryEn: 'Architectural comparison between Traditional 3-Tier Hierarchical Campus, 2-Tier Collapsed Core, and Modern Data Center Spine-Leaf fabrics.',
        contentMarkdownAr: `### 1. التصميم الهرمي ثلاثي الطبقات (Cisco 3-Tier Campus Design):
1. **Access Layer (طبقة الوصول):** تربط الأجهزة الطرفية (PCs, APs, IP Phones) بالشبكة، وتطبق سياسات المنافذ (Port Security, PoE, 802.1X).
2. **Distribution Layer (طبقة التوزيع):** تجمع سويتشات الـ Access، وتطبق التوجيه بين الشبكات الوهمية (Inter-VLAN Routing)، وسياسات الأمان (ACLs)، وتلخيص المسارات.
3. **Core Layer (طبقة النواة / Backbone):** نقل حركة البيانات بين مباني المؤسسة ومراكز البيانات بأقصى سرعة ممكنة دون معالجة الحزم أو الفلترة المعقدة.

---

### 2. تصميم النواة المدمجة (2-Tier Collapsed Core):
- دمج طبقتي الـ Core والـ Distribution في سويتشات مدمجة واحدة لتقليل التكلفة في الفروع المتوسطة والصغيرة.

---

### 3. تصميم مراكز البيانات (Spine-Leaf Architecture):
- كل سويتش طرفي (Leaf Switch) يتصل بجميع سويتشات النواة (Spine Switches).
- يضمن مسافة قفزة واحدة ثابتة (Predictable 1-Hop Latency) لحركة المرور الأفقية (East-West Traffic) بين الخوادم.`,
        contentMarkdownEn: `### 1. Hierarchical Network Models:
- **Core Layer:** High-speed switching backbone with zero packet manipulation.
- **Distribution Layer:** Policy-based connectivity, boundary routing, ACL enforcement, and summarization.
- **Access Layer:** Workgroup client connectivity, QoS tagging, and port security.

### 2. Spine-Leaf Clos Fabric:
- Eliminates STP blocking in data centers using ECMP Layer 3 routed uplinks.
- Constant latency between any two leaf nodes.`,
        technicalHighlights: [
          'في تصميم Spine-Leaf، لا تتصل سويتشات الـ Leaf ببعضها أبداً، ولا تتصل سويتشات الـ Spine ببعضها أبداً.',
          'الطبقة الهرمية تسهل عزل المشاكل (Fault Isolation) وتوسيع الشبكة دون تعطيل الخدمات الحالية.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show cdp neighbors detail',
            deviceType: 'switch',
            deviceName: 'SW-DIST-01',
            mode: 'priv',
            category: 'Topology Discovery',
            explanationAr: 'اكتشاف الأجهزة المجاورة من سويتشات الوصول وسويتشات النواة لتحديد موقع الجهاز في الهرمية.',
            explanationEn: 'Displays detailed CDP discovery records identifying upstream Core and downstream Access nodes.',
            output: `Device ID: SW-CORE-01.corp.cisco
Entry address(es): 
  IP address: 10.255.255.1
Platform: cisco Catalyst 9500,  Capabilities: Router Switch 
Interface: GigabitEthernet1/0/24,  Port ID (outgoing port): GigabitEthernet1/0/1`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'شبكة الطرق السريعة والشوارع الفرعية في المدن',
          titleEn: 'Municipal Roadway Hierarchy: Local, Arterial & Expressways',
          storyAr: 'شوارع الأحياء السكنية الضيقة (Access Layer) تصب في شوارع فرعية منظمة بإشارات مرور (Distribution Layer)، والتي تنقلك إلى الطريق السريع المفتوح بدون أي إشارات لنقلك بسرعة قصوى بين المدن (Core Layer).',
          storyEn: 'Local neighborhood streets (Access) feed into arterial avenues with traffic lights (Distribution), which route vehicles onto high-speed multi-lane bypass expressways with no traffic stops (Core).',
          mappingTable: [
            { realLife: 'شارع الحي السكني والبيوت المتصلة به', networkTech: 'Access Layer (PoE Switches)', ciscoTerm: 'Access Layer Switch' },
            { realLife: 'الميدان المنظم للإشارات بين الأحياء', networkTech: 'Distribution Layer (L3 Routing/ACLs)', ciscoTerm: 'Distribution Layer' },
            { realLife: 'الطريق السريع فائق السرعة بين المدن', networkTech: 'Core Layer (High-Speed Backbone)', ciscoTerm: 'Core Layer' }
          ]
        }
      },
      {
        id: 'ccna-topic-1-5-physical-infrastructure-cabling',
        track: 'ccna',
        titleAr: '1.5 البنية الفيزيائية والكوابل (UTP Cat6/6a, Fiber Optic SMF/MMF, SFP Transceivers)',
        titleEn: '1.5 Physical Layer Infrastructure: Copper Cabling, Optical Fiber (SMF vs MMF) & Transceivers',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.3',
        officialReferences: [
          { title: 'TIA/EIA-568 - Commercial Building Telecommunications Cabling Standard', type: 'IEEE Standard', code: 'TIA-568.2-D', citation: 'Balanced Twisted-Pair Telecommunications Cabling' },
          { title: 'IEEE 802.3 - Ethernet Standard for Optical Interfaces', type: 'IEEE Standard', code: 'IEEE 802.3ba', citation: '40Gb/s and 100Gb/s Ethernet Physical Layer' }
        ],
        summaryAr: 'أنواع وسائط النقل الفيزيائية: الفروقات بين كوابل النحاس المزدوجة الملتوية (UTP/STP Cat5e/6/6a)، وألياف الزجاج أحادية النمط (SMF) ومتعددة النمط (MMF)، ووحدات الإرسال والاستقبال SFP/SFP+.',
        summaryEn: 'Comparison of physical layer transmission media: Twisted-pair copper (UTP Cat5e/6/6a), Single-Mode vs Multi-Mode Fiber optics, and SFP/SFP+/QSFP transceiver optics.',
        contentMarkdownAr: `### 1. كوابل النحاس المزدوجة الملتوية (Twisted-Pair Copper):
- **Cat 5e:** سرعة تصل إلى 1 Gbps حتى مسافة 100 متر (تردد 100 MHz).
- **Cat 6:** سرعة 1 Gbps حتى 100 متر، و 10 Gbps حتى 55 متراً (تردد 250 MHz).
- **Cat 6a:** سرعة 10 Gbps كاملة حتى 100 متر مع تدريع فائق ضد التداخل الكهرومغناطيسي (Alien Crosstalk) (تردد 500 MHz).
- **ترتيب الأسلاك (T568A vs T568B):** كابل مستقيم (Straight-through) يربط أجهزة مختلفة، وكابل متقاطع (Crossover) يربط أجهزة متطابقة (يدعم اليوم تلقائياً بـ Auto-MDIX).

---

### 2. كوابل الألياف الضوئية (Fiber Optics):
| المعيار | Single-Mode Fiber (SMF) | Multi-Mode Fiber (MMF) |
| :--- | :--- | :--- |
| **قطر النواة الزجاجية** | صغير جداً (9 ميكرون) | كبير (50 أو 62.5 ميكرون) |
| **مصدر الضوء** | ليزر دقيق (Laser) | ضوء LED أو VCSEL |
| **المسافة المدعومة** | مسافات طويلة جداً (تصل إلى 10km - 40km) | مسافات قصيرة داخل المبنى (تصل إلى 300m - 500m) |
| **التكلفة** | كوابل أرخص، محولات SFP أغلى | كوابل أغلى قليلاً، محولات SFP أرخص |`,
        contentMarkdownEn: `### 1. Copper Cabling Standards:
- **UTP Max Segment Length:** 100 meters (328 feet).
- **Cat6a:** Supports 10GBASE-T up to full 100m distance.

### 2. Optical Fiber Types:
- **Single-Mode Fiber (SMF - 9µm core):** Uses laser transmitter; supports long haul campus/WAN runs up to 40km.
- **Multi-Mode Fiber (MMF - 50/62.5µm core):** Uses LED/VCSEL; supports modal dispersion limited runs up to 500m.`,
        technicalHighlights: [
          'أقصى طول مسموح به لكابل النحاس الإيثرنت (Cat5e/6/6a) هو 100 متر (90 متر كابل ثابت + 10 أمتار Patch Cords).',
          'ميزة Auto-MDIX في سويتشات سيسكو تعكس خطوط الإرسال والاستقبال تلقائياً دون الحاجة لكوابل Crossover.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show interfaces transceiver detail',
            deviceType: 'switch',
            deviceName: 'SW-CORE-01',
            mode: 'priv',
            category: 'Optics Diagnostics',
            explanationAr: 'فحص قوة الإشارة الضوئية المستقبلة والمرسلة على وحدة الـ SFP في المنفذ الضوئي.',
            explanationEn: 'Displays Digital Optical Monitoring (DOM) power levels for optical transceivers.',
            output: `ITU Channel not supported (Ethernet 10GBASE-LR)
Transceiver Optical Power Status:
Port       Temp(C)  Voltage(V)  Bias(mA)  Tx Power(dBm)  Rx Power(dBm)
---------  -------  ----------  --------  -------------  -------------
Te1/0/1    34.2     3.31        32.4      -2.10          -3.45 (Optimal)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'ممر الماراثون الفردي مقابل نفق المترو الواسع',
          titleEn: 'Laser Beam Corridor vs Multi-Reflection Hall of Mirrors',
          storyAr: 'الألياف أحادية النمط (SMF) تشبه شعاع ليزر مستقيم يمر في أنبوب فائق الدقة دون أن يصطدم بالجدران فيصل لمدن بعيدة. أما الألياف متعددة النمط (MMF) فتشبه ضوءاً ينعكس على جدران نفق واسع، مما يجعله يتشتت بعد مسافة قصيرة.',
          storyEn: 'Single-mode fiber is a single high-intensity laser pulse traveling in a straight line through a microscopic tunnel. Multi-mode fiber is multiple light rays bouncing off the inner glass reflective walls, leading to modal dispersion over long distances.',
          mappingTable: [
            { realLife: 'شعاع الليزر المستقيم فائق الدقة', networkTech: 'Single-Mode Fiber (SMF 9µm)', ciscoTerm: '10GBASE-LR / 100GBASE-ER' },
            { realLife: 'الضوء المنعكس على مرايا النفق', networkTech: 'Multi-Mode Fiber (MMF 50µm)', ciscoTerm: '10GBASE-SR / SFP-10G-SR' }
          ]
        }
      },
      {
        id: 'ccna-topic-1-6-transport-layer-tcp-udp',
        track: 'ccna',
        titleAr: '1.6 بروتوكولات طبقة النقل (TCP 3-Way Handshake vs UDP Low-Latency)',
        titleEn: '1.6 Transport Layer Mechanics: TCP Connection Lifecycle, Flow Control & UDP Performance',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §1.5',
        officialReferences: [
          { title: 'RFC 793 - Transmission Control Protocol Specification', type: 'RFC', code: 'RFC 793', citation: 'IETF DARPA Internet Program' },
          { title: 'RFC 768 - User Datagram Protocol', type: 'RFC', code: 'RFC 768', citation: 'IETF UDP Specification' }
        ],
        summaryAr: 'المقارنة الهندسية الشاملة بين بروتوكول TCP الموثوق المصافح بثلاث خطوات (SYN, SYN-ACK, ACK) وبروتوكول UDP فائق السرعة، مع شرح آليات التحكم بالتدفق (Sliding Window) وإعادة الإرسال.',
        summaryEn: 'Deep architectural comparison between connection-oriented reliable TCP (3-way handshake, windowing, retransmission) and connectionless UDP for voice and real-time streaming.',
        contentMarkdownAr: `### 1. المصافحة الثلاثية في TCP (3-Way Handshake):
1. **Host A -> Host B (SYN):** يرسل العميل حزمة SYN مع رقم تسلسل أولي عشوائي (\`Seq = 100\`).
2. **Host B -> Host A (SYN-ACK):** يرد الخادم بحزمة SYN مع رقم تسلسله الخاص (\`Seq = 300\`) وتأكيد استلام (\`Ack = 101\`).
3. **Host A -> Host B (ACK):** يرسل العميل تأكيد الاستلام النهائي (\`Ack = 301\`)، وتبدأ جلسة نقل البيانات الموثوقة.

---

### 2. ميزات بروتوكول TCP:
- **Ordered Delivery (الترتيب الموثوق):** استخدام أرقام التسلسل Sequence Numbers لإعادة تجميع الحزم بالترتيب الصحيح.
- **Flow Control (التحكم بالتدفق):** استخدام نافذة الاستقبال (TCP Window Size) لإبلاغ المرسل بحجم الذاكرة المتاحة لديه لمنع إغراق الجهاز المستلم.
- **Error Recovery (التعافي من الأخطاء):** إعادة إرسال الحزم المفقودة تلقائياً (Retransmission).

---

### 3. متى نستخدم UDP؟
- في التطبيقات الحساسة للتأخير (Delay-Sensitive) مثل الصوت عبر الإنترنت (VoIP / SIP)، ومكالمات الفيديو (Zoom / Teams)، واستعلامات DNS والـ DHCP.`,
        contentMarkdownEn: `### 1. TCP 3-Way Handshake:
- **Step 1:** Client sends \`SYN\` (ISN = X).
- **Step 2:** Server responds with \`SYN-ACK\` (ISN = Y, ACK = X+1).
- **Step 3:** Client acknowledges with \`ACK\` (ACK = Y+1). Connection ESTABLISHED.

### 2. Comparison Matrix:
| Feature | TCP (RFC 793) | UDP (RFC 768) |
| :--- | :--- | :--- |
| **Connection** | Connection-Oriented | Connectionless |
| **Header Size** | 20 to 60 Bytes | Fixed 8 Bytes |
| **Reliability** | Guaranteed (ACKs & Retransmit) | Best-Effort |
| **Speed** | Moderate (Overhead) | Maximum (Low Latency) |`,
        technicalHighlights: [
          'ترويسة TCP تحتوي على 6 رايات تحكم أساسية: SYN, ACK, FIN, RST, PSH, URG.',
          'بروتوكول UDP لا يملك أي آلية لتأكيد الاستلام أو إعادة الترتيب، ويترك هذه المهمة لتطبيق الطبقة السابعة إذا لزم الأمر.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show tcp brief',
            deviceType: 'router',
            deviceName: 'R1-HQ-GATEWAY',
            mode: 'priv',
            category: 'Active TCP Sockets',
            explanationAr: 'عرض الجلسات النشطة لبروتوكول TCP وأرقام المنافذ المحلية والبعيدة وحالة الاتصال (ESTABLISHED).',
            explanationEn: 'Displays active local and remote TCP socket states on the Cisco device.',
            output: `TCB       Local Address               Foreign Address             (state)
7F8A10    192.168.1.1.22              192.168.1.100.51432         ESTABLISHED
7F8B90    0.0.0.0.80                  0.0.0.0.0                   LISTEN`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'المكالمة الهاتفية المؤكدة مقابل البث الإذاعي المباشر',
          titleEn: 'Registered Postal Receipt vs Live FM Radio Broadcast',
          storyAr: 'بروتوكول TCP يشبه إرسال طرد بالبريد المسجل مع إشعار استلام موقع: إذا لم يوقع المستلم، يعيد البريد إرسال الطرد حتى يتأكد من وصوله. بينما UDP يشبه مذيع الراديو في البث المباشر: يتكلم بسرعة وإذا انقطع صوت ثانية واحدة لا يعيد قراءتها بل يستمر في البث.',
          storyEn: 'TCP is like sending registered mail with signed delivery receipts: every parcel must be explicitly verified. UDP is like a live FM radio station broadcasting music: packets fly continuously without waiting to verify if any listener missed a beat.',
          mappingTable: [
            { realLife: 'توقيع إيصال استلام الطرد المسجل', networkTech: 'TCP ACK (Acknowledgment)', ciscoTerm: 'TCP ACK' },
            { realLife: 'حجم صندوق البريد المتاح لاستقبال الطرود', networkTech: 'TCP Window Size', ciscoTerm: 'Window Size Flow Control' },
            { realLife: 'البث المباشر المفتوح دون انتظار المستمعين', networkTech: 'UDP Datagram Stream', ciscoTerm: 'UDP Best-Effort Delivery' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 2.0: NETWORK ACCESS (20% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-2-network-access-l2',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 2,
    unitTitleAr: 'الوحدة 2: الوصول للشبكة وتبديل الطبقة الثانية (Network Access & Switching)',
    unitTitleEn: 'Unit 2: Network Access, VLANs, 802.1Q Trunks, STP & Wireless',
    moduleBadge: 'CCNA Domain 2.0',
    officialDomain: '2.0 Network Access (20% of Exam)',
    summaryAr: 'بناء شبكات الـ VLANs، والروابط المشتركة 802.1Q Trunks، والتوجيه بين الشبكات الوهمية Router-on-a-Stick، وتجميع المنافذ عبر EtherChannel LACP، وبروتوكولات STP/RSTP، وبنية الشبكات اللاسلكية Cisco WLC.',
    summaryEn: 'Building VLAN topologies, 802.1Q trunking, Inter-VLAN routing (ROAS & SVI), link aggregation via LACP, STP loop prevention, and Cisco Centralized WLC wireless architectures.',
    topics: [
      {
        id: 'ccna-topic-2-1-vlans-8021q-trunking',
        track: 'ccna',
        titleAr: '2.1 هندسة الشبكات الوهمية VLANs وترويسة الوسم IEEE 802.1Q',
        titleEn: '2.1 VLAN Segmentation, IEEE 802.1Q Tagging & Trunking Mechanics',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.1 & §2.2',
        officialReferences: [
          { title: 'IEEE 802.1Q - Bridges and Bridged Networks: Virtual Bridged LANs', type: 'IEEE Standard', code: 'IEEE 802.1Q-2018', citation: 'Standard for Virtual Bridged Local Area Networks' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 8', citation: 'Implementing Ethernet Virtual LANs' }
        ],
        summaryAr: 'تشريح ترويسة 802.1Q بحجم 4 بايت، وعزل نطاقات البث Broadcast Domains، وإدارة الـ Native VLAN وتأمينها ضد هجمات VLAN Hopping.',
        summaryEn: 'Dissection of the 4-byte 802.1Q tag, broadcast domain isolation, native VLAN security, and DTP negotiation.',
        contentMarkdownAr: `### 1. تشريح ترويسة الوسم IEEE 802.1Q (4 Bytes / 32 bits):
عند عبور الفريم رابط **Trunk**، يضاف وسم 802.1Q بين Source MAC و EtherType:
- **TPID (16 bits):** القيمة \`0x8100\` للتعريف بأن الفريم موسوم.
- **PCP / CoS (3 bits):** أولوية جودة الخدمة (QoS) من 0 إلى 7.
- **DEI (1 bit):** مؤشر إمكانية إسقاط الفريم عند حدوث اختناق.
- **VLAN ID (12 bits):** رقم الـ VLAN الفعلية (نطاق من 1 إلى 4094).

---

### 2. أوضاع منافذ السويتش (Switchport Modes):
- **Access Port:** ينتمي لـ VLAN واحدة فقط وينزع الوسم قبل إرسال الفريم للكمبيوتر.
- **Trunk Port:** ينقل بيانات عدة VLANs ويحافظ على وسوم 802.1Q.
- **Native VLAN:** الـ VLAN الوحيدة التي تعبر كابل الـ Trunk بدون وسم (Untagged). الافتراضي في سيسكو VLAN 1، وأفضل ممارسة أمنية هي تغييرها لـ VLAN 999 غير مستخدمة.`,
        contentMarkdownEn: `### 1. IEEE 802.1Q 4-Byte Tag Dissection:
- **Tag Protocol Identifier (TPID - 16 bits):** Fixed to \`0x8100\` identifying 802.1Q frame.
- **Priority Code Point (PCP - 3 bits):** Layer 2 Class of Service (CoS) marking (0-7).
- **VLAN Identifier (VID - 12 bits):** Supports 4094 usable VLANs.`,
        technicalHighlights: [
          'الـ VLAN تعزل نطاق البث (Broadcast Domain) مما يرفع كفاءة الأداء والأمان داخل الشبكة المحلية.',
          'أمر switchport nonegotiate يعطل بروتوكول DTP لمنع هجمات التبديل التلقائي للـ Trunk.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show interfaces trunk',
            deviceType: 'switch',
            deviceName: 'SW-DIST-01',
            mode: 'priv',
            category: 'Trunk Status',
            explanationAr: 'التحقق من حالة كوابل الـ Trunk والـ VLANs المسموح بعبورها.',
            explanationEn: 'Displays operational trunk status and allowed active VLANs on the link.',
            output: `Port        Mode             Encapsulation  Status        Native vlan
Gi1/0/24    on               802.1q         trunking      999

Port        Vlans allowed on trunk
Gi1/0/24    10,20,30,999`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'بطاقات الترانزيت الملونة في خطوط الشحن المشتركة',
          titleEn: 'Color-Coded Shipping Badges in Shared Transit Tunnel',
          storyAr: 'تخيل نفق نقل مشترك يمرر طرود عدة شركات مختلفة: لتجنب اختلاط الطرود، يلصق السويتش بطاقة ملونة برقم القسم (802.1Q Tag) على كل طرد قبل دخوله النفق، وعند مخرج النفق يقرأ السويتش الآخر البطاقة، ينزعها، ويسلم الطرد للقسم المعني فقط.',
          storyEn: 'In a shared corporate conveyor tunnel, packages from finance, engineering, and HR are tagged with color-coded transit barcodes (802.1Q tags). The receiving switch strips the tag before placing the package on the department desk.',
          mappingTable: [
            { realLife: 'البطاقة الملونة الملصقة على الطرد بالنفق', networkTech: '802.1Q VLAN Tag (4 Bytes)', ciscoTerm: 'Dot1Q Encapsulation' },
            { realLife: 'النفق المخصص لنقل طرود جميع الشركات', networkTech: 'Trunk Link', ciscoTerm: 'Switchport Mode Trunk' },
            { realLife: 'صناديق قسم معين معزولة داخل مكتبها', networkTech: 'Access Port / Single VLAN', ciscoTerm: 'Switchport Mode Access' }
          ]
        }
      },
      {
        id: 'ccna-topic-2-2-inter-vlan-routing',
        track: 'ccna',
        titleAr: '2.2 التوجيه بين الشبكات الوهمية (Router-on-a-Stick vs Multilayer Switch SVI)',
        titleEn: '2.2 Inter-VLAN Routing Architecture (Router-on-a-Stick Sub-interfaces vs Layer 3 Switch SVIs)',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.3',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 9', citation: 'Implementing Inter-VLAN Routing' },
          { title: 'Cisco Validated Design: Campus Inter-VLAN Architecture', type: 'Cisco Validated Design', code: 'CVD-L3-SWITCHING', citation: 'Switched Virtual Interface (SVI) Performance Design' }
        ],
        summaryAr: 'كيف تتواصل الـ VLANs المعزولة؟ مقارنة بين تقنية Router-on-a-Stick باستخدام المنافذ الفرعية (Sub-interfaces) والتبديل بالطبقة الثالثة عبر واجهات SVI (Switched Virtual Interfaces).',
        summaryEn: 'Detailed engineering comparison between legacy Router-on-a-Stick (802.1Q subinterfaces) and line-rate hardware Layer 3 Switched Virtual Interfaces (SVIs).',
        contentMarkdownAr: `### 1. تقنية Router-on-a-Stick (ROAS):
- استخدام كابل فيزيائي واحد (Trunk) متصل بين السويتش ومنفذ الراوتر.
- إنشاء منافذ فرعية وهمية (Sub-interfaces) في الراوتر لكل VLAN مع أمر التغليف:
\`\`\`cisco
interface GigabitEthernet0/0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
!
interface GigabitEthernet0/0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
\`\`\`

---

### 2. التوجيه عبر سويتش الطبقة الثالثة (Layer 3 Switch SVI):
- أسرع بكثير لأن التوجيه يتم على مستوى رقاقات السويتش المادية (Hardware ASIC Line Rate) دون خروج الحزم من السويتش:
\`\`\`cisco
ip routing
!
interface Vlan10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
interface Vlan20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
\`\`\``,
        contentMarkdownEn: `### 1. Router-on-a-Stick (ROAS):
- Utilizes 802.1Q subinterfaces on a single physical routed trunk interface.
- Limited by single physical interface bandwidth.

### 2. Layer 3 Switch SVI (Switched Virtual Interface):
- Line-rate ASIC hardware routing between VLANs inside switch fabric.
- Requires \`ip routing\` globally enabled.`,
        technicalHighlights: [
          'واجهة الـ SVI لا تعمل (تكون Down) إلا إذا كانت الـ VLAN موجودة ومفعلة وهناك منفذ فيزيائي واحد على الأقل نشط (Up) ينتمي لتلك الـ VLAN.',
          'التبديل عبر SVI يلغي عنق الزجاجة (Bottleneck) الذي يسببه كابل الـ Trunk في طريقة ROAS.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip interface brief | include Vlan',
            deviceType: 'l3switch',
            deviceName: 'SW-CORE-L3',
            mode: 'priv',
            category: 'SVI Status',
            explanationAr: 'عرض حالة واجهات الـ SVI الافتراضية وعناوين الـ IP الخاصة ببوابات الـ VLANs.',
            explanationEn: 'Displays operational status of Switched Virtual Interfaces (SVIs).',
            output: `Vlan10                 192.168.10.1    YES manual up                    up      
Vlan20                 192.168.20.1    YES manual up                    up      
Vlan99                 10.255.99.1     YES manual up                    up`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'المصعد المركزي بين أدوار ناطحة السحاب',
          titleEn: 'Central Express Elevator Between Skyscraper Floors',
          storyAr: 'إذا كان كل دور في المبنى يمثل قسماً معزولاً (VLAN 10 و VLAN 20)، فإن واجهة الـ SVI تشبه مصعداً داخلياً سريعاً ينقلك مباشرة بين الأدوار دون الحاجة للخروج إلى الشارع وسؤال شرطي المرور الخارجي (الراوتر).',
          storyEn: 'If each building floor is an isolated office (VLAN 10 and VLAN 20), an SVI acts like a high-speed internal elevator transferring staff directly between floors without leaving the building to consult an outside traffic policeman.',
          mappingTable: [
            { realLife: 'أدوار المبنى المعزولة عن بعضها', networkTech: 'VLANs (Broadcast Domains)', ciscoTerm: 'VLAN IDs' },
            { realLife: 'المصعد الداخلي السريع بين الأدوار', networkTech: 'Layer 3 SVI (Hardware Routing)', ciscoTerm: 'interface Vlan X' }
          ]
        }
      },
      {
        id: 'ccna-topic-2-3-spanning-tree-rstp',
        track: 'ccna',
        titleAr: '2.3 بروتوكول منع الحلقات Spanning Tree (802.1D STP vs 802.1w Rapid-PVST+)',
        titleEn: '2.3 Spanning Tree Protocols: 802.1D STP, 802.1w Rapid PVST+, Root Bridge Election & BPDU Guard',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.5',
        officialReferences: [
          { title: 'IEEE 802.1w - Rapid Spanning Tree Protocol', type: 'IEEE Standard', code: 'IEEE 802.1w-2001', citation: 'Rapid Reconfiguration of Spanning Tree' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 9 & 10', citation: 'Implementing STP and Rapid PVST+' }
        ],
        summaryAr: 'منع العواصف الإذاعية وحلقات الطبقة الثانية: خوارزمية انتخاب الـ Root Bridge، أدوار المنافذ (Root, Designated, Alternate)، وحماية المنافذ بـ PortFast و BPDU Guard.',
        summaryEn: 'Layer 2 loop prevention, BPDU frame propagation, Root Bridge selection math, port states, and edge hardening with PortFast & BPDU Guard.',
        contentMarkdownAr: `### 1. لماذا نحتاج Spanning Tree Protocol (STP)؟
في شبكات الإيثرنت، الفريمات لا تحتوي على عداد TTL (Time To Live). إذا وُجد رابط احتياطي حلقي، فإن فريم البث (Broadcast) سيدور إلى الأبد مسبباً **عاصفة إذاعية (Broadcast Storm)** تسقط السويتشات في ثوانٍ معدودة.

---

### 2. خوارزمية انتخاب الـ Root Bridge:
السويتش صاحب **أصغر معرف جسر (Lowest Bridge ID - BID)** يصبح الـ Root Bridge:
$$\\text{Bridge ID} = \\text{Bridge Priority (2 Bytes)} + \\text{System ID Extension (VLAN ID)} + \\text{Switch Base MAC (6 Bytes)}$$
- الأولوية الافتراضية بسيسكو: \`32768\`.
- لتعيين سويتش كـ Root: \`spanning-tree vlan 10 priority 4096\` أو \`spanning-tree vlan 10 root primary\`.

---

### 3. أدوار المنافذ (Port Roles):
1. **Root Port (RP):** المنفذ صاحب أقل تكلفة (Lowest Path Cost) باتجاه الـ Root Bridge (منفذ واحد لكل سويتش غير الـ Root).
2. **Designated Port (DP):** المنفذ الذي يرسل الـ BPDUs على قطاع الكابل (جميع منافذ الـ Root Bridge هي DPs وفي حالة Forwarding).
3. **Alternate / Blocking Port (AP):** المنفذ الاحتياطي المحظور الذي يوضع في حالة منع لكسر الحلقة.`,
        contentMarkdownEn: `### 1. Spanning Tree Architecture:
- Eliminates Layer 2 loops and broadcast storms.
- Lowest Bridge ID (Priority + MAC) becomes Root Bridge.

### 2. Rapid PVST+ (802.1w) Convergence:
- Transitions ports in milliseconds using Proposal/Agreement handshake.
- Edge ports bypass listening/learning states via **PortFast**.
- **BPDU Guard** err-disables port immediately if an unauthorized switch BPDU is detected.`,
        technicalHighlights: [
          'بروتوكول RSTP (802.1w) يقلص زمن التقارب من 50 ثانية في STP القديم إلى أقل من ثانية واحدة (Sub-second).',
          'ميزة PortFast تفعل فقط على منافذ الأجهزة الطرفية (PCs, Printers) ولا تفعل أبداً على كوابل الـ Trunks بين السويتشات.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show spanning-tree vlan 10',
            deviceType: 'switch',
            deviceName: 'SW-ACCESS-01',
            mode: 'priv',
            category: 'STP Status',
            explanationAr: 'التحقق من حالة الـ Root Bridge وأدوار المنافذ (Root Port و Alternate Blocked Port).',
            explanationEn: 'Displays STP instance details, root bridge BID, and port roles/states.',
            output: `VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586 (Priority 24576 + sys-id-ext 10)
             Address     001e.49b0.1200
             Cost        4
             Port        1 (GigabitEthernet1/0/1)
  
Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Root FWD 4         128.1    P2p 
Gi1/0/2             Altn BLK 4         128.2    P2p (Blocked Backup)
Gi1/0/3             Desg FWD 19        128.3    P2p Edge (PortFast)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'شرطي المرور والحاجز المؤقت عند الدوار المزدحم',
          titleEn: 'Traffic Police and Dynamic Roadblock at Circular Junction',
          storyAr: 'لتجنب تصادم السيارات في دوار مغلق، يضع شرطي المرور حاجزاً أحمر مؤقتاً على أحد المنافذ الاحتياطية (Blocking Port). وإذا تعطل الطريق الرئيسي، يرفع الشرطي الحاجز فوراً ليسمح بمرور السيارات في المسار البديل.',
          storyEn: 'To prevent gridlock collisions in a circular roundabout, traffic police lower a barrier arm across one redundant access lane (Blocked Port). If the primary bridge collapses, the barrier lifts instantly to re-route traffic.',
          mappingTable: [
            { realLife: 'الحاجز الأحمر الذي يغلق الطريق الاحتياطي', networkTech: 'STP Alternate Blocking Port', ciscoTerm: 'Port State: Blocking / Discarding' },
            { realLife: 'إشارات المرور الدورية التي يرسلها الشرطي', networkTech: 'BPDU Frames (Bridge Protocol Data Units)', ciscoTerm: 'Hello BPDU (every 2s)' }
          ]
        }
      },
      {
        id: 'ccna-topic-2-4-etherchannel-lacp-pagp',
        track: 'ccna',
        titleAr: '2.4 تجميع الروابط والدمج الفيزيائي عبر EtherChannel (LACP vs PAgP)',
        titleEn: '2.4 Link Aggregation via EtherChannel (IEEE 802.3ad LACP vs Cisco PAgP)',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.4',
        officialReferences: [
          { title: 'IEEE 802.3ad / 802.1AX - Link Aggregation Control Protocol', type: 'IEEE Standard', code: 'IEEE 802.1AX-2020', citation: 'Link Aggregation for Ethernet Interfaces' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 10', citation: 'RSTP and EtherChannel Configuration' }
        ],
        summaryAr: 'دمج ما يصل إلى 8 منافذ فيزيائية في منفذ منطقي واحد (Port-Channel) لمضاعفة النطاق وتأمين التكرارية دون أن يقوم STP بحظرها.',
        summaryEn: 'Bundling up to 8 active physical links into a single logical Port-Channel to scale bandwidth and provide sub-second failover.',
        contentMarkdownAr: `### 1. فوائد تقنية الـ EtherChannel:
1. **توسيع النطاق الترددي (Bandwidth Scaling):** دمج حتى 8 روابط نشطة (Active Links) لتشكيل رابط منطقي فائق السرعة (مثل $8 \\times 1\\text{Gbps} = 8\\text{Gbps}$).
2. **تجنب حظر Spanning Tree:** يعامل STP واجهة الـ Port-Channel كرابط منطقي واحد، فلا يقوم بحظر أي كابل من الكوابل المجمعة.
3. **التعافي اللحظي من الفشل (Instant Failover):** عند انقطاع أحد الكوابل الفيزيائية، تنتقل حركة المرور فوراً للكوابل المتبقية دون أي إعادة حسابات لـ STP.

---

### 2. مقارنة بروتوكولات التفاوض:
- **LACP (IEEE 802.3ad / 802.1AX):** المعيار المفتوح العالمي (أوضاع: \`active\` و \`passive\`).
- **PAgP (Cisco Proprietary):** بروتوكول سيسكو الخاص (أوضاع: \`desirable\` و \`auto\`).
- **Static Manual:** نمط التجميع اليدوي دون تفاوض (\`mode on\`).`,
        contentMarkdownEn: `### 1. EtherChannel Architectural Highlights:
- Combines up to 8 active physical links into one logical interface.
- Prevents STP from blocking redundant links between switches.
- Balances traffic based on hashing algorithm (Source MAC, Destination MAC, IP, or L4 Port).

### 2. Cisco LACP Configuration Example:
\`\`\`cisco
interface range GigabitEthernet1/0/1 - 2
 channel-group 1 mode active
!
interface Port-channel1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
\`\`\``,
        technicalHighlights: [
          'يجب أن تتطابق جميع منافذ الـ EtherChannel في السرعة، نمط الـ Duplex، والـ VLAN المسموح بها، ونوع الـ Trunking.',
          'توزيع الحمل (Load Balancing) يتم عبر خوارزمية Hash رياضية ولا يوزع الحزم بالتناوب الدائري (Round-Robin) للحفاظ على تسلسل حزم الـ TCP.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show etherchannel summary',
            deviceType: 'switch',
            deviceName: 'SW-CORE-01',
            mode: 'priv',
            category: 'EtherChannel Status',
            explanationAr: 'التحقق من حالة الـ Port-Channel وبروتوكول LACP والمنافذ المجمعة برمز (P) في الـ Bundle.',
            explanationEn: 'Displays aggregated channel groups, active protocol (LACP/PAgP), and bundled member ports (P).',
            output: `Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi1/0/1(P)    Gi1/0/2(P)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'الطريق السريع متعدد الحارات المفتوح بالكامل',
          titleEn: 'Multi-Lane Express Highway with Dynamic Merging',
          storyAr: 'إذا كان لديك جسران منفصلان، تمنعك شرطة المرور من استخدام الجسر الثاني خوفاً من الحوادث (STP Blocking). تقنية EtherChannel تدمج الجسرين في طريق سريع موحد واسع بحارتين، فإذا تعطلت حارة تسير السيارات في الحارة الأخرى دون توقف حركة المرور لحظة واحدة.',
          storyEn: 'Instead of traffic police closing the second bridge to prevent circular collisions, EtherChannel unifies two parallel lanes into a synchronized expressway with load distribution and zero-downtime resilience.',
          mappingTable: [
            { realLife: 'حارات الطريق السريع المجمعة', networkTech: 'Physical Member Interfaces', ciscoTerm: 'Channel-Group Members' },
            { realLife: 'اسم الطريق السريع الموحد على الخريطة', networkTech: 'Logical Port-Channel Interface', ciscoTerm: 'interface Port-channel 1' }
          ]
        }
      },
      {
        id: 'ccna-topic-2-5-discovery-protocols-cdp-lldp',
        track: 'ccna',
        titleAr: '2.5 بروتوكولات اكتشاف الجيران الطوبولوجية (Cisco CDP vs IEEE LLDP)',
        titleEn: '2.5 Layer 2 Topology Discovery Protocols: Cisco Discovery Protocol (CDP) & IEEE LLDP',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.6',
        officialReferences: [
          { title: 'IEEE 802.1AB - Link Layer Discovery Protocol (LLDP)', type: 'IEEE Standard', code: 'IEEE 802.1AB-2016', citation: 'Station and Media Access Control Connectivity Discovery' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 11', citation: 'Managing Network Devices and Discovery' }
        ],
        summaryAr: 'اكتشاف الأجهزة المتصلة مباشرة على مستوى الطبقة الثانية (Layer 2) دون الحاجة لعناوين IP: معرفة نوع الجهاز، نظام التشغيل IOS، المنفذ المتصل، وقدرات الـ PoE.',
        summaryEn: 'Layer 2 neighbor discovery mechanisms across multi-vendor networks: inspecting platform capabilities, native VLAN mismatch detection, and PoE power negotiation via LLDP-MED.',
        contentMarkdownAr: `### 1. مقارنة بروتوكولي الاكتشاف:
- **CDP (Cisco Discovery Protocol):** بروتوكول خاص بسيسكو (Proprietary)، يعمل افتراضياً على كافة أجهزة سيسكو، يرسل إعلانات كل 60 ثانية مع مؤقت احتجاز 180 ثانية.
- **LLDP (Link Layer Discovery Protocol - IEEE 802.1AB):** معيار مفتوح عالمي لجميع الشركات (HP, Juniper, Dell, Cisco)، يرسل كل 30 ثانية مع مؤقت احتجاز 120 ثانية.

---

### 2. أهمية بروتوكولات الاكتشاف في التشغيل:
1. **رسم الخرائط الطوبولوجية التلقائية:** معرفة أي كابل موصول في أي منفذ بدقة.
2. **اكتشاف أخطاء التكوين:** تنبيه مهندس الشبكة فوراً إذا كان هناك عدم تطابق في الـ Native VLAN أو سرعة المنفذ (Duplex Mismatch).
3. **التفاوض على الطاقة الذكية (LLDP-MED / PoE):** يخبر هاتف الـ IP السويتش بكمية الطاقة الدقيقة بالواط (Watts) التي يحتاجها للتشغيل.`,
        contentMarkdownEn: `### 1. CDP vs LLDP Parameters:
- **CDP:** Proprietary, enabled by default, 60s update / 180s holdtime.
- **LLDP:** Open standard (IEEE 802.1AB), 30s update / 120s holdtime.

### 2. Cisco LLDP Configuration:
\`\`\`cisco
lldp run
!
interface GigabitEthernet1/0/1
 lldp transmit
 lldp receive
\`\`\``,
        technicalHighlights: [
          'يجب تعطيل CDP و LLDP على المنافذ المتصلة بالإنترنت أو الأجهزة غير الموثوقة لمنع تسريب معلومات الطوبولوجيا (Information Gathering).',
          'بروتوكول LLDP-MED مخصص لاكتشاف وهندسة هواتف الصوت IP Phones وأجهزة الـ IoT.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show cdp neighbors',
            deviceType: 'switch',
            deviceName: 'SW-ACCESS-01',
            mode: 'priv',
            category: 'Neighbor Discovery',
            explanationAr: 'عرض قائمة الأجهزة المجاورة المتصلة مباشرة ومنافذ الاتصال ونوع وطراز الجهاز.',
            explanationEn: 'Displays table of directly connected neighboring Cisco devices and local/remote port IDs.',
            output: `Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
R1-GATEWAY       Gig 1/0/24        165              R B   ISR4331   Gig 0/0/0
SEP001122334455  Gig 1/0/5         142              H P   IP Phone  Port 1`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'بطاقة العمل والتعارف المتبادلة بين الموظفين',
          titleEn: 'Business Card Exchange Across Office Cubicles',
          storyAr: 'يشبه CDP بطاقة تعريف مهنية يعطيها جهاز سيسكو لجاره المباشر يقول فيها: "أنا سويتش موديل 9300، متصل بك عبر المنفذ 24، وأعمل بنظام IOS-XE"، فيسجل الجار هذه البيانات في دليله دون الحاجة للاتصال بالإنترنت.',
          storyEn: 'CDP is like two professionals shaking hands across desks and exchanging business cards: stating their name, department role, and physical desk port number so both know who is sitting opposite.',
          mappingTable: [
            { realLife: 'بطاقة العمل الرسمية المحتوية على المسمى والوظيفة', networkTech: 'CDP/LLDP Advertisement Packet', ciscoTerm: 'CDP TLVs (Type-Length-Value)' },
            { realLife: 'دليل هواتف الشركة المحلي', networkTech: 'CDP Neighbor Table', ciscoTerm: 'show cdp neighbors' }
          ]
        }
      },
      {
        id: 'ccna-topic-2-6-cisco-wireless-architectures',
        track: 'ccna',
        titleAr: '2.6 معماريات الشبكات اللاسلكية المؤسسية (Cisco WLC, Split-MAC & CAPWAP)',
        titleEn: '2.6 Cisco Wireless LAN Architectures: Centralized WLC, Split-MAC, CAPWAP Tunnels & AP Modes',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §2.7 & §2.8',
        officialReferences: [
          { title: 'RFC 5415 - Control And Provisioning of Wireless Access Points (CAPWAP)', type: 'RFC', code: 'RFC 5415', citation: 'IETF CAPWAP Protocol Base Specification' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 26', citation: 'Cisco Wireless Architectures' }
        ],
        summaryAr: 'بنية الشبكات اللاسلكية الحديثة: الفرق بين نقاط الوصول المستقلة (Autonomous AP) والمدارة مركزياً (Lightweight AP)، وتوزيع المهام بـ Split-MAC، وأنفاق CAPWAP.',
        summaryEn: 'Centralized enterprise wireless architectures: Autonomous AP vs Lightweight AP (LAP), Split-MAC division of labor, CAPWAP control and data tunneling, and AP operating modes.',
        contentMarkdownAr: `### 1. مقارنة معماريات الـ Wireless:
- **Autonomous APs (Standalone):** كل نقطة وصول تبرمج وتدار بشكل منفرد ومستقل، مما يجعل إدارة مئات النقاط في مبنى جامعي أو مستشفى أمراً مستحيلاً.
- **Centralized / Lightweight APs (Cisco WLC):** تدار كافة نقاط الوصول مركزياً بواسطة وحدة تحكم لاسلكية **Wireless LAN Controller (WLC)** عبر نفق **CAPWAP**.

---

### 2. مفهوم الـ Split-MAC Architecture:
تقسيم مهام الطبقة الثانية بين نقطة الوصول (AP) ووحدة التحكم (WLC):
- **مهام الـ AP المحلية (Real-Time 802.11):** تشفير الفريمات، منارات الإشارة (Beacons & Probes)، والتفاوض الراديوي السريع.
- **مهام الـ WLC المركزية (Management Plane):** مصادقة المستخدمين (802.1X / RADIUS)، التبديل بين الـ APs (Roaming)، إدارة الترددات الراديوية (RRM)، وسياسات الأمان و الـ QoS.

---

### 3. أنفاق بروتوكول CAPWAP (RFC 5415):
1. **CAPWAP Control Tunnel (UDP Port 5246):** نفق مشفر بـ DTLS لنقل أوامر التحكم والإدارة.
2. **CAPWAP Data Tunnel (UDP Port 5247):** نفق لتمرير بيانات ترافيك المستخدمين من الـ AP إلى الـ WLC.`,
        contentMarkdownEn: `### 1. Split-MAC Functional Split:
- **Lightweight AP Functions:** Beacon generation, probe responses, frame queuing, and real-time encryption.
- **Centralized WLC Functions:** 802.1X authentication, dynamic channel assignment (RRM), Fast Roaming, and policy enforcement.

### 2. CAPWAP Ports:
- Control: UDP 5246 (DTLS encrypted).
- Data: UDP 5247.`,
        technicalHighlights: [
          'أوضاع تشغيل الـ AP: وضع Local (الخدمة العادية)، وضع FlexConnect (للفروع التي تواصل العمل حتى عند انقطاع الاتصال بالـ WLC)، ووضع Sniffer (لالتقاط الحزم اللاسلكية لتحليلها بـ Wireshark).',
          'تقنية Cisco CleanAir تكتشف التداخلات اللاسلكية غير المتعلقة بالواي فاي (مثل أفران الميكروويف وكاميرات المراقبة اللاسلكية) وتغير القناة تلقائياً.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ap summary',
            deviceType: 'l3switch',
            deviceName: 'WLC-CORE-9800',
            mode: 'priv',
            category: 'Wireless AP Status',
            explanationAr: 'عرض نقاط الوصول المتصلة بوحدة التحكم اللاسلكية WLC وحالة نفق الـ CAPWAP.',
            explanationEn: 'Displays inventory of connected Lightweight APs and CAPWAP registration states.',
            output: `Number of APs: 48
AP Name          Slots  AP Model             Ethernet MAC    IP Address     Port  State
---------------------------------------------------------------------------------------
AP-FLOOR1-NORTH  2      AIR-AP3802I-E-K9     0022.bdd0.1100  10.10.100.12   1     Registered
AP-FLOOR1-SOUTH  2      AIR-AP3802I-E-K9     0022.bdd0.1120  10.10.100.13   1     Registered`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'برج المراقبة في المطار وأسطول الطائرات',
          titleEn: 'Airport Air Traffic Control Tower and Aircraft Fleet',
          storyAr: 'الـ APs تشبه الطائرات التي تطير وتحمل الركاب (البيانات اللاسلكية)، بينما الـ WLC يشبه برج المراقبة المركزي الذي يوجه كافة الطائرات، يحدد مدارج الهبوط، ينسق الترددات، ويضمن عدم حدوث أي تصادم في الجو.',
          storyEn: 'Lightweight APs are like individual airplanes handling passenger boarding locally, while the WLC is the central air traffic control tower coordinating flight paths, radio frequencies, and runway assignments across the airspace.',
          mappingTable: [
            { realLife: 'الطائرة التي تنقل الركاب محلياً', networkTech: 'Lightweight Access Point (LAP)', ciscoTerm: 'Cisco Catalyst AP' },
            { realLife: 'برج المراقبة المركزي للمطار بأكمله', networkTech: 'Wireless LAN Controller (WLC)', ciscoTerm: 'Cisco Catalyst 9800 WLC' },
            { realLife: 'موجات الراديو اللاسلكية المشفرة مع البرج', networkTech: 'CAPWAP Control & Data Tunnels', ciscoTerm: 'CAPWAP Tunnel (UDP 5246/5247)' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 3.0: IP CONNECTIVITY (25% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-3-ip-connectivity-routing',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 3,
    unitTitleAr: 'الوحدة 3: توجيه حزم البيانات وربط الـ IP (IP Connectivity & Routing)',
    unitTitleEn: 'Unit 3: IP Connectivity, Routing Engine, Static Routes & Single-Area OSPFv2',
    moduleBadge: 'CCNA Domain 3.0',
    officialDomain: '3.0 IP Connectivity (25% of Exam)',
    summaryAr: 'بنية جدول التوجيه RIB و FIB، ومبدأ التطابق الأطول للبادئة، والمسارات الثابتة Static & Default Routes، وبروتوكول OSPFv2 للمنطقة الواحدة، وتكرارية البوابة الافتراضية بـ HSRP.',
    summaryEn: 'Routing information table (RIB), Longest Prefix Match principle, floating static routes, Single-Area OSPFv2 configuration & First Hop Redundancy Protocols (HSRP).',
    topics: [
      {
        id: 'ccna-topic-3-1-routing-concepts-static',
        track: 'ccna',
        titleAr: '3.1 مفاهيم التوجيه ومبدأ Longest Prefix Match والمسارات الثابتة',
        titleEn: '3.1 Routing Engine Mechanics, Longest Prefix Match & Static Routing',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §3.1, §3.2 & §3.3',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 1', type: 'Cisco OCG', code: 'Chapter 14', citation: 'Configuring IPv4 Static Routing' },
          { title: 'RFC 1812 - Requirements for IP Version 4 Routers', type: 'RFC', code: 'RFC 1812', citation: 'Forwarding and Routing Table Lookup Logic' }
        ],
        summaryAr: 'كيف يقرر الراوتر توجيه الحزمة؟ تحليل مبدأ التطابق الأطول للبادئة، ومصفوفة المسافة الإدارية، وضبط المسارات الثابتة الاحتياطية Floating Static Routes.',
        summaryEn: 'How routers make forwarding decisions using Longest Prefix Match, Administrative Distance comparison, and floating static backup routes.',
        contentMarkdownAr: `### 1. قاعدة التوجيه الذهبية (Longest Prefix Match):
عند وصول حزمة IP، يبحث الراوتر في جدول التوجيه:
- يختار دائماً المسار ذو **القناع الأكثر تحديداً والأطول (Longest Subnet Mask)** بصرف النظر عن مصدر البروتوكول!
- مثال: مسار \`/24\` يفوز دائماً على مسار \`/16\` لنفس الوجهة.

---

### 2. أنواع المسارات الثابتة (Static Routes):
1. **Standard Static Route:** توجيه حركة مرور لشبكة محددة (\`ip route 10.1.1.0 255.255.255.0 192.168.12.2\`).
2. **Default Route (مسار الملاذ الأخير):** توجيه أي حزمة غير معروفة إلى بوابة الإنترنت (\`ip route 0.0.0.0 0.0.0.0 203.0.113.1\`).
3. **Floating Static Route:** مسار احتياطي يُعطى مسافة إدارية أعلى (مثل AD 150) ليعمل فقط عند سقوط مسار OSPF أو المسار الرئيسي.`,
        contentMarkdownEn: `### 1. Longest Prefix Match Rule:
Router evaluates destination IP and selects route entry with longest subnet mask match in routing table (RIB), regardless of Administrative Distance.

### 2. Floating Static Route Configuration:
\`\`\`cisco
! Primary Route via ISP 1
ip route 0.0.0.0 0.0.0.0 198.51.100.1
! Floating Backup Route via ISP 2 (AD 150)
ip route 0.0.0.0 0.0.0.0 203.0.113.1 150
\`\`\``,
        technicalHighlights: [
          'المسافة الإدارية (AD) للمسار المتصل مباشرة هي 0، والمسار الثابت هي 1، و OSPF هي 110.',
          'الراوتر ينقص قيمة عداد TTL بمقدار 1 ويعيد حساب Checksum الترويسة قبل إخراج الحزمة.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip route',
            deviceType: 'router',
            deviceName: 'R1-EDGE-GW',
            mode: 'priv',
            category: 'Routing Table',
            explanationAr: 'عرض جدول التوجيه مع رموز البروتوكولات (C متصل، S ثابت، O مسار OSPF).',
            explanationEn: 'Displays global IP routing table showing route codes, AD/Metric, and next-hop interfaces.',
            output: `Gateway of last resort is 198.51.100.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 198.51.100.1
C     192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
O     172.16.1.0/24 [110/20] via 10.1.1.2, 00:32:15, GigabitEthernet0/0/1`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'دليل مكاتب البريد والرمز البريدي الدقيق',
          titleEn: 'Postal Sorting Office and Exact Zip Codes',
          storyAr: 'إذا أرسلت رسالة عليها رمز بريدي عام (المدينة: 10000) ورمز بريدي دقيق للشارع (10115)، فإن موظف البريد يفرز الرسالة بناءً على الرمز الأكثر تحديداً (Longest Prefix Match).',
          storyEn: 'Mail sorting algorithms route letters using the most specific postal code available. Default routing acts like the international outbound shipping bin for unlisted foreign destinations.',
          mappingTable: [
            { realLife: 'الرمز البريدي الدقيق للحي والشارع', networkTech: 'Specific Subnet Route (/24)', ciscoTerm: 'Longest Prefix Match' },
            { realLife: 'صندوق البريد الدولي للوجهات غير المدرجة', networkTech: 'Default Route 0.0.0.0/0', ciscoTerm: 'Gateway of Last Resort' }
          ]
        }
      },
      {
        id: 'ccna-topic-3-2-single-area-ospfv2',
        track: 'ccna',
        titleAr: '3.2 بروتوكول التوجيه الديناميكي OSPFv2 للمنطقة الواحدة (Single-Area OSPF)',
        titleEn: '3.2 Single-Area OSPFv2 Routing: Neighbor Adjacencies, DR/BDR Election & Cost Tuning',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §3.4',
        officialReferences: [
          { title: 'RFC 2328 - OSPF Version 2 Specification', type: 'RFC', code: 'RFC 2328', citation: 'IETF Link-State Routing Protocol Specification' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 2', type: 'Cisco OCG', code: 'Chapter 20', citation: 'Configuring Single-Area OSPFv2' }
        ],
        summaryAr: 'بناء شبكات OSPFv2: مراحل تشكيل الجوار (Down إلى Full)، حساب خوارزمية ديكسترا SPF، انتخاب راوتر الـ DR/BDR، والمنافذ الصامتة Passive Interfaces.',
        summaryEn: 'OSPFv2 protocol mechanics: Neighbor state machine transitions, DR/BDR election on broadcast networks, reference bandwidth cost tuning, and passive interfaces.',
        contentMarkdownAr: `### 1. شروط تشكيل الجوار في OSPF (Neighbor Requirements):
يجب أن تتطابق العناصر التالية بدقة بين الراوترين لتكتمل علاقة الجوار:
1. **Area ID:** رقم المنطقة (مثل Area 0).
2. **Subnet & Subnet Mask:** نفس الشبكة الفرعية وقناعها على الواجهة المتصلة.
3. **Hello & Dead Timers:** مؤقتات التحية (افتراضياً 10 ثوانٍ Hello و 40 ثانية Dead).
4. **Authentication:** نوع كلمة المرور والهاش الأمني (إذا كان مفعلاً).
5. **MTU:** حجم حزمة الـ MTU القصوى (افتراضياً 1500 بايت).

---

### 2. انتخاب DR و BDR:
- في شبكات الإيثرنت (Broadcast Multi-access)، الراوتر صاحب **أعلى Priority (من 0 إلى 255)** يصبح الـ Designated Router (DR).
- إذا تساوت الأولوية، يفوز الراوتر صاحب **أعلى Router ID**.
- القيمة \`0\` تعني أن الراوتر لن يشارك في الانتخابات أبداً (DROther).`,
        contentMarkdownEn: `### 1. OSPF Adjacency Requirements:
- Matching Area ID.
- Matching Subnet & Subnet Mask.
- Matching Hello/Dead Timers.
- Unique Router IDs.
- Matching MTU settings.

### 2. Cisco OSPF Configuration:
\`\`\`cisco
router ospf 1
 router-id 1.1.1.1
 auto-cost reference-bandwidth 10000
 network 192.168.1.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
 passive-interface GigabitEthernet0/0/1
\`\`\``,
        technicalHighlights: [
          'أمر passive-interface يمنع إرسال واستقبال حزم Hello على المنافذ المتصلة بالمستخدمين لرفع الأمان وتقليل استهلاك الشبكة.',
          'المرجع الافتراضي لحساب الـ Cost في سيسكو هو 100Mbps، ويجب تعديله بـ auto-cost reference-bandwidth 10000 في الشبكات الحديثة.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip ospf neighbor',
            deviceType: 'router',
            deviceName: 'R1-CORE-OSPF',
            mode: 'priv',
            category: 'OSPF Neighbors',
            explanationAr: 'التحقق من اكتمال حالة الجوار (FULL/DR أو FULL/BDR) وعناوين الـ IP للراوترات المجاورة.',
            explanationEn: 'Displays OSPF neighbor adjacency table, states, and DR/BDR roles.',
            output: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/BDR        00:00:36    10.0.0.2        GigabitEthernet0/0/0
3.3.3.3           1   FULL/DR         00:00:38    10.0.0.3        GigabitEthernet0/0/0`
          }
        ],
        protocolDetails: [PROTOCOL_DEEP_DIVES.OSPF],
        realWorldAnalogy: {
          titleAr: 'اجتماع منسقي الشحن وخريطة الملاحة الموحدة',
          titleEn: 'Logistics Coordinators Sharing Identical Road Maps',
          storyAr: 'يشبه OSPF فريقاً من قباطنة السفن في حوض ميناء: ينتخبون قبطاناً رئيسياً (DR) ليكون المنسق، ويتبادلون تفاصيل أي تعديل في خرائط الموانئ البحرية، بحيث يملك كل قبطان نفس الخريطة الملاحية المحدثة للرحلة بأكملها.',
          storyEn: 'OSPF operates like a fleet of ship captains: electing a lead harbor master (DR) to coordinate route updates, ensuring every vessel possesses an identical topological ocean map.',
          mappingTable: [
            { realLife: 'القبطان المنسق المنتخب للميناء', networkTech: 'Designated Router (DR)', ciscoTerm: 'OSPF DR' },
            { realLife: 'خارطة التضاريس البحرية الكاملة الموحدة', networkTech: 'Link-State Database (LSDB)', ciscoTerm: 'show ip ospf database' }
          ]
        }
      },
      {
        id: 'ccna-topic-3-3-first-hop-redundancy-hsrp',
        track: 'ccna',
        titleAr: '3.3 تكرارية البوابة الافتراضية الأولى (HSRP Virtual IP & VRRP Redundancy)',
        titleEn: '3.3 First Hop Redundancy Protocols (FHRP): Cisco HSRP, Virtual MAC & VRRP Preemption',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §3.5',
        officialReferences: [
          { title: 'RFC 2281 - Cisco Hot Standby Router Protocol (HSRP)', type: 'RFC', code: 'RFC 2281', citation: 'Cisco Systems HSRP Specification' },
          { title: 'RFC 5798 - Virtual Router Redundancy Protocol (VRRPv3)', type: 'RFC', code: 'RFC 5798', citation: 'VRRP for IPv4 and IPv6' }
        ],
        summaryAr: 'حماية أجهزة المستخدمين من انقطاع البوابة الافتراضية Default Gateway عبر عنوان IP وهمي (Virtual IP) وعنوان MAC وهمي يتشارك فيه راوتران (Active و Standby) مع ميزة Preemption.',
        summaryEn: 'High availability at the access edge using HSRP: Active/Standby router negotiation, Virtual MAC address derivation, priority preemption, and Gratuitous ARP.',
        contentMarkdownAr: `### 1. كيف يعمل بروتوكول HSRP (Hot Standby Router Protocol)؟
- يتم ضبط راوترين أو سويتشين L3 لمشاركة **عنوان IP وهمي (Virtual IP)** مثل \`192.168.1.1\`.
- تضبط أجهزة الكمبيوتر بوابتها الافتراضية على هذا العنوان الوهمي.
- **الراوتر النشط (Active Router):** يعالج حركة البيانات ويرد على طلبات الـ ARP بعنوان الـ MAC الوهمي (\`0000.0c07.acXX\` في HSRPv1 و \`0000.0c9f.fXXX\` في HSRPv2).
- **الراوتر الاحتياطي (Standby Router):** يراقب نبضات التحية (Hello Packets كل 3 ثوانٍ). إذا سقط الراوتر النشط خلال 10 ثوانٍ، يستلم الراوتر الاحتياطي الـ Virtual IP/MAC فوراً ويرسل **Gratuitous ARP** لتحديث جداول السويتشات!

---

### 2. ميزة الاسترداد الفوري (Preemption):
- افتراضياً، إذا عاد الراوتر الأساسي للعمل، لن يستعيد دوره كـ Active إلا إذا تم تفعيل أمر:
\`\`\`cisco
standby 1 preempt
\`\`\``,
        contentMarkdownEn: `### 1. HSRP Mechanics:
- Active router forwards traffic directed to Virtual IP.
- Standby router listens to periodic hellos (every 3s / 10s hold).
- Virtual MAC format HSRPv1: \`0000.0c07.ac<Group_Hex>\`.
- Virtual MAC format HSRPv2: \`0000.0c9f.f<Group_Hex>\`.

### 2. Cisco HSRP Configuration:
\`\`\`cisco
interface GigabitEthernet0/0/0
 ip address 192.168.1.2 255.255.255.0
 standby 1 ip 192.168.1.1
 standby 1 priority 110
 standby 1 preempt
\`\`\``,
        technicalHighlights: [
          'الراوتر صاحب الأولوية الأعلى (Default Priority 100) يصبح هو الـ Active Router.',
          'بروتوكول VRRP (RFC 5798) هو المعيار المفتوح المقابل لـ HSRP، ويسمح بتعيين عنوان IP حقيقي للراوتر كعنوان وهمي (Virtual IP Owner).'
        ],
        ciscoCliOutputs: [
          {
            command: 'show standby brief',
            deviceType: 'router',
            deviceName: 'R1-ACTIVE-GW',
            mode: 'priv',
            category: 'FHRP Status',
            explanationAr: 'التحقق من حالة HSRP وكون الراوتر Active مع عنوان الـ Virtual IP والأولوية.',
            explanationEn: 'Displays summary of HSRP group states, priority, and virtual gateway IP.',
            output: `                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State   Active          Standby         Virtual IP
Gi0/0/0     1    110 P Active  local           192.168.1.3     192.168.1.1`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'طبيب الطوارئ والبديل الفوري في غرفة العمليات',
          titleEn: 'Surgeon On-Call with Instant Emergency Backup',
          storyAr: 'تخيل غرفة طوارئ فيها طبيبان: الطبيب الأول (Active) يجري الفحص بينما الطبيب الثاني (Standby) يرتدي الزي الطبي ويقف بجانبه. إذا شعر الطبيب الأول بالإغماء، يتدخل الطبيب الثاني في نفس الثانية ليكمل العملية دون أن يشعر المريض بأي انقطاع.',
          storyEn: 'HSRP is like an emergency surgery team: the primary surgeon handles the operation while the backup surgeon stands scrubbed next to them. If the primary doctor steps away, the standby surgeon seamlessly takes over without pausing the operation.',
          mappingTable: [
            { realLife: 'الطبيب المناوب الأساسي في الغرفة', networkTech: 'HSRP Active Router', ciscoTerm: 'Active State' },
            { realLife: 'الطبيب المساعد الجاهز للتدخل فوراً', networkTech: 'HSRP Standby Router', ciscoTerm: 'Standby State' },
            { realLife: 'رقم هاتف الطوارئ الموحد الذي يتصل به المرضى', networkTech: 'Virtual IP & Virtual MAC', ciscoTerm: 'Virtual Gateway' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 4.0: IP SERVICES (10% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-4-ip-services',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 4,
    unitTitleAr: 'الوحدة 4: خدمات الشبكة المتقدمة وإدارة الـ IP (IP Services & Management)',
    unitTitleEn: 'Unit 4: IP Services: NAT/PAT, DHCP, NTP, SNMP, Syslog & QoS Fundamentals',
    moduleBadge: 'CCNA Domain 4.0',
    officialDomain: '4.0 IP Services (10% of Exam)',
    summaryAr: 'تحويل العناوين NAT و PAT Overload، وخوادم وتوزيع الـ DHCP DORA، ومزامنة التوقيت NTP، والمراقبة بـ SNMP و Syslog، ومبادئ جودة الخدمة QoS.',
    summaryEn: 'Comprehensive configuration of NAT/PAT Overload, DHCP client/server/relay operations, NTP clock synchronization, SNMPv3, Syslog severities, and QoS classification & marking.',
    topics: [
      {
        id: 'ccna-topic-4-1-nat-pat-overload',
        track: 'ccna',
        titleAr: '4.1 ترجمة عناوين الشبكة NAT والترجمة عبر المنافذ PAT (NAT Overload)',
        titleEn: '4.1 Network Address Translation (Static & Dynamic NAT) & Port Address Translation (PAT)',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §4.1',
        officialReferences: [
          { title: 'RFC 3022 - Traditional IP Network Address Translator (Traditional NAT)', type: 'RFC', code: 'RFC 3022', citation: 'IETF NAT Specification' },
          { title: 'RFC 1918 - Address Allocation for Private Internets', type: 'RFC', code: 'RFC 1918', citation: 'Private IPv4 Address Space Definitions' }
        ],
        summaryAr: 'حل معضلة استنزاف عناوين IPv4: التمييز بين Inside Local و Inside Global و Outside Global، وتطبيق PAT Overload لمشاركة آلاف الأجهزة على IP عام واحد.',
        summaryEn: 'Architectural breakdown of Inside Local vs Inside Global NAT terminology, static 1-to-1 NAT for DMZ servers, and many-to-1 PAT port multiplexing.',
        contentMarkdownAr: `### 1. مصطلحات NAT الأربعة المعتمدة من سيسكو:
- **Inside Local:** عنوان الـ IP الداخلي الخاص بالجهاز (Private IP من RFC 1918 مثل \`192.168.1.50\`).
- **Inside Global:** عنوان الـ IP العام الذي يظهر به الجهاز الداخلي على شبكة الإنترنت (Public IP مثل \`203.0.113.5\`).
- **Outside Local:** عنوان الجهاز الخارجي كما تراه الشبكة الداخلية.
- **Outside Global:** عنوان الجهاز الخارجي الحقيقي على شبكة الإنترنت (مثل خادم الويب \`8.8.8.8\`).

---

### 2. أنواع الـ NAT:
1. **Static NAT (1-to-1):** ربط IP داخلي خاص بـ IP خارجي عام ثابت (يستخدم لسيرفرات الـ DMZ كالبريد والويب).
2. **Dynamic NAT (Pool):** مشاركة مجموعة عناوين عامة بالتتابع (أول من يطلب يأخذ IP).
3. **PAT / NAT Overload (Many-to-1):** مشاركة آلاف الأجهزة على عنوان IP عام واحد عبر تخصيص رقم منفذ فريد (L4 Port Number) لكل جلسة اتصال.`,
        contentMarkdownEn: `### 1. Cisco NAT Terminology Matrix:
- **Inside Local:** Real private IP assigned on internal host.
- **Inside Global:** Public IP representing internal host on the Internet.
- **Outside Global:** Real public IP of external server.

### 2. Cisco PAT Overload Configuration:
\`\`\`cisco
interface GigabitEthernet0/0/0
 ip nat inside
!
interface GigabitEthernet0/0/1
 ip nat outside
!
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface GigabitEthernet0/0/1 overload
\`\`\``,
        technicalHighlights: [
          'تقنية PAT تدعم نظرياً حتى 65,535 جلسة اتصال متزامنة لكل عنوان IP عام بفضل منافذ الطبقة الرابعة.',
          'الراوتر ينشئ جدول ترجمة ديناميكي (NAT Translation Table) يحفظ فيه الربط بين الـ IP الداخلي والمنفذ المخصص.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip nat translations',
            deviceType: 'router',
            deviceName: 'R1-BORDER-NAT',
            mode: 'priv',
            category: 'NAT Translation Table',
            explanationAr: 'عرض جدول ترجمة الـ NAT النشط والمنافذ المترجمة للجلسات المتزامنة.',
            explanationEn: 'Displays active NAT/PAT translation sessions mapping Inside Local to Inside Global sockets.',
            output: `Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.1:51234  192.168.1.15:49152 198.51.100.2:80    198.51.100.2:80
udp 203.0.113.1:51235  192.168.1.20:5353  8.8.8.8:53         8.8.8.8:53`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'سنترال الفندق وموظف الاستقبال بالتحويلات الداخلية',
          titleEn: 'Hotel Central Switchboard and Extension Lines',
          storyAr: 'الفندق يملك رقماً هاتفياً عاماً واحداً مسجلاً في الدليل (Inside Global IP)، ولكن بداخله 500 غرفة برقم تحويلة داخلية (Inside Local IP). عندما يتصل نزيل بالخارج، يخرج الاتصال برقم الفندق العام مع تدوين رقم التحويلة لإعادة توجيه الرد للغرفة الصحيحة (PAT Port Translation).',
          storyEn: 'A luxury hotel has one public telephone number (Inside Global). Inside are 500 guest rooms (Inside Local). When a guest calls out, the hotel switchboard appends an internal extension record so return calls are routed directly to the correct room.',
          mappingTable: [
            { realLife: 'رقم الغرفة والتحويلة الداخلية للنزيل', networkTech: 'Inside Local IP & Port', ciscoTerm: 'Inside Local Socket' },
            { realLife: 'رقم هاتف الفندق الموحد أمام العالم', networkTech: 'Inside Global Public IP', ciscoTerm: 'Inside Global IP' },
            { realLife: 'سجل تحويلات المكالمات عند موظف الاستقبال', networkTech: 'NAT Translation Table', ciscoTerm: 'NAT Translation Table' }
          ]
        }
      },
      {
        id: 'ccna-topic-4-2-dhcpv4-dhcpv6-relay',
        track: 'ccna',
        titleAr: '4.2 التوزيع الديناميكي للعناوين DHCPv4 و DHCPv6 ووكيل الترحيل (DHCP Relay)',
        titleEn: '4.2 DHCPv4 & DHCPv6 Operations: DORA 4-Way Handshake, Address Pools & DHCP Relay Agent',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §4.2 & §4.3',
        officialReferences: [
          { title: 'RFC 2131 - Dynamic Host Configuration Protocol', type: 'RFC', code: 'RFC 2131', citation: 'IETF DHCPv4 Standard' },
          { title: 'RFC 8415 - Dynamic Host Configuration Protocol for IPv6 (DHCPv6)', type: 'RFC', code: 'RFC 8415', citation: 'DHCPv6 Specification' }
        ],
        summaryAr: 'تشريح مصافحة الـ DORA (Discover, Offer, Request, Acknowledge)، وإعداد راوتر سيسكو كخادم DHCP، وتجاوز حاجز الراوتر عبر وكيل الترحيل `ip helper-address`.',
        summaryEn: 'Detailed dissection of the DHCP DORA process, excluded address reservations, and configuring DHCP Relay Agents to forward UDP broadcast discovery across routed boundaries.',
        contentMarkdownAr: `### 1. مصافحة الـ DHCP DORA الرباعية:
1. **Discover (Host -> Broadcast):** العميل يرسل بحثاً عاماً عن خادم DHCP (\`UDP 67/68\`).
2. **Offer (Server -> Unicast/Broadcast):** الخادم يقترح عنوان IP مع قناع وبوابة وفترة تأجير (Lease Time).
3. **Request (Host -> Broadcast):** العميل يقبل العرض رسمياً ويبلغ كافة السيرفرات الأخرى بأنه أخذ هذا العنوان.
4. **Acknowledge (Server -> Unicast/Broadcast):** الخادم يؤكد الحجز ويسجل العنوان في قاعدة بياناته.

---

### 2. وكيل الترحيل (DHCP Relay Agent / IP Helper Address):
بما أن حزمة الـ DHCP Discover هي Broadcast، فإن الراوتر يسقطها افتراضياً ولا يمررها.
- **الحل:** نضع أمر \`ip helper-address <DHCP_Server_IP>\` على منفذ الراوتر المتصل بالمستخدمين لتحويل حزمة الـ Broadcast إلى **Unicast** وإرسالها لخادم الـ DHCP في السيرفر روم!`,
        contentMarkdownEn: `### 1. DHCP DORA Lifecycle:
- **Discover:** Client broadcasts request (\`0.0.0.0:68\` -> \`255.255.255.255:67\`).
- **Offer:** Server offers available IP.
- **Request:** Client formally requests the offered configuration.
- **ACK:** Server commits binding lease.

### 2. Cisco DHCP Server & Helper Configuration:
\`\`\`cisco
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp pool ENGINEERING_LAN
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8 1.1.1.1
!
interface GigabitEthernet0/0/0
 ip helper-address 10.255.0.50
\`\`\``,
        technicalHighlights: [
          'أمر ip dhcp excluded-address يجب كتابته دائماً لحجز عناوين البوابات والطابعات والسيرفرات الثابتة لمنع حدوث IP Conflict.',
          'أمر ip helper-address يقوم بترحيل 8 بروتوكولات UDP افتراضياً تشمل DHCP, DNS, TFTP, NTP, و TACACS.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ip dhcp binding',
            deviceType: 'router',
            deviceName: 'R1-DHCP-SERVER',
            mode: 'priv',
            category: 'DHCP Leases',
            explanationAr: 'عرض جدول عناوين الـ IP المؤجرة للأجهزة وعناوين الـ MAC الخاصة بها وتاريخ انتهاء الحجز.',
            explanationEn: 'Displays active DHCP database leases and client hardware MAC addresses.',
            output: `IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.10.15    0100.5079.6668.00       Sep 02 2026 10:30 AM    Automatic
192.168.10.16    0100.1122.3344.55       Sep 02 2026 10:45 AM    Automatic`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'مكتب تسجيل واستلام بطاقات الهوية في المؤتمر',
          titleEn: 'Conference Registration Desk Handing Guest Badges',
          storyAr: 'الضيف الجديد يدخل المؤتمر ويسأل في صالة الاستقبال بصوت عالٍ: "أين مكتب التسجيل؟" (Discover)، يرد الموظف: "لدينا شارة رقم 42 باسمك" (Offer)، يقول الضيف: "نعم أريد الشارة 42" (Request)، فيسلمها الموظف ويسجل اسمه في السجل الرسمي (ACK).',
          storyEn: 'A conference attendee walks into the hall announcing they need a badge (Discover). Registration offers Badge #42 (Offer). The guest agrees to take #42 (Request), and the clerk marks Badge #42 active in the guest book (ACK).',
          mappingTable: [
            { realLife: 'سؤال الضيف في الردهة عن التسجيل', networkTech: 'DHCP Discover Broadcast', ciscoTerm: 'DHCP Discover' },
            { realLife: 'عرض الموظف للبطاقة المتاحة', networkTech: 'DHCP Offer Packet', ciscoTerm: 'DHCP Offer' },
            { realLife: 'سجل الحجوزات والبطاقات النشطة', networkTech: 'DHCP Binding Database', ciscoTerm: 'show ip dhcp binding' }
          ]
        }
      },
      {
        id: 'ccna-topic-4-3-network-management-snmp-syslog-ntp',
        track: 'ccna',
        titleAr: '4.3 إدارة ومراقبة الشبكة (NTP Stratum, SNMPv3 Security & Syslog Levels)',
        titleEn: '4.3 Network Management: NTP Stratum Clocking, SNMPv3 Encryption & Syslog Severity Levels',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §4.4, §4.5 & §4.6',
        officialReferences: [
          { title: 'RFC 5905 - Network Time Protocol Version 4', type: 'RFC', code: 'RFC 5905', citation: 'IETF NTPv4 Specification' },
          { title: 'RFC 3414 - User-based Security Model (USM) for SNMPv3', type: 'RFC', code: 'RFC 3414', citation: 'SNMPv3 Authentication and Privacy' },
          { title: 'RFC 5424 - The Syslog Protocol', type: 'RFC', code: 'RFC 5424', citation: 'IETF Syslog Protocol Specification' }
        ],
        summaryAr: 'ركائز إدارة ومراقبة الشبكة: مزامنة الوقت بـ NTP لحفظ مصداقية السجلات الجنائية، مستويات أمان SNMPv3 (authPriv)، ومستويات خطورة سجلات الأحداث Syslog (من 0 Emergency إلى 7 Debugging).',
        summaryEn: 'Enterprise monitoring infrastructure: NTP stratum hierarchy, SNMPv3 USM security model (noAuthNoPriv, authNoPriv, authPriv), and the 8 Syslog severity levels.',
        contentMarkdownAr: `### 1. مستويات خطورة سجلات الأحداث Syslog (0 to 7):
احفظها بالجملة الشهيرة: *"Every Administrator Should Mail Daily Only Nice Compliments"*
- **0 - Emergency:** انهيار كامل للنظام (System unusable).
- **1 - Alert:** يتطلب تدخلاً فورياً (Immediate action needed).
- **2 - Critical:** حالة حرجة جداً (Critical condition).
- **3 - Error:** رسائل أخطاء عادية (Error condition).
- **4 - Warning:** تحذيرات عن سلوك غير طبيعي (Warning condition).
- **5 - Notification:** أحداث تشغيلية طبيعية مثل صعود منفذ (Normal interface UP/DOWN).
- **6 - Informational:** رسائل إرشادية وتأكيدات أوامر.
- **7 - Debugging:** أعلى مستوى تفصيلي لتحليل المشاكل الحية (يستهلك المعالج بشدة).

---

### 2. مستويات أمان بروتوكول SNMPv3:
1. **noAuthNoPriv:** بدون كلمة مرور وبدون تشفير (غير آمن).
2. **authNoPriv:** مصادقة بكلمة مرور مشفرة (SHA/MD5) ولكن بيانات المراقبة غير مشفرة.
3. **authPriv (الأعلى أماناً):** مصادقة وتشفير كامل للبيانات باستخدام AES-128/256.`,
        contentMarkdownEn: `### 1. Syslog Severity Levels:
- 0: Emergencies | 1: Alerts | 2: Critical | 3: Errors
- 4: Warnings | 5: Notifications | 6: Informational | 7: Debugging

### 2. Cisco Management Configuration:
\`\`\`cisco
ntp server 203.0.113.10
!
logging host 10.255.0.100
logging trap warnings
service timestamps log datetime msec
!
snmp-server group SECURE_GROUP v3 priv
snmp-server user ADMIN_USER SECURE_GROUP v3 auth sha MyPass123 priv aes 128 MyEnc123
\`\`\``,
        technicalHighlights: [
          'خدمة service timestamps log datetime msec تضمن تسجيل الوقت بالمللي ثانية لتتبع الهجمات السيبرانية بدقة.',
          'بروتوكول NTP يستخدم مفهوم الـ Stratum (من 1 إلى 15)، حيث Stratum 1 متصل مباشرة بساعة ذرية أو قمر صناعي GPS.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show ntp status',
            deviceType: 'router',
            deviceName: 'R1-HQ-CORE',
            mode: 'priv',
            category: 'NTP Synchronization',
            explanationAr: 'التحقق من تزامن ساعة الراوتر مع الخادم المرجعي ورقم الـ Stratum ومستوى الدقة.',
            explanationEn: 'Displays NTP synchronization state, reference clock, and stratum level.',
            output: `Clock is synchronized, stratum 2, reference is 203.0.113.10
nominal freq is 250.0000 Hz, actual freq is 249.9998 Hz, precision is 2**18
reference time is E8D2A145.6B2C9100 (10:15:33.418 UTC Tue Sep 1 2026)
clock offset is 1.4250 msec, root delay is 14.21 msec`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'ساعة بيغ بن وبرج المراقبة مع دفتر الحوادث الرسمي',
          titleEn: 'Big Ben Standard Clock and Official Police Incident Log',
          storyAr: 'بروتوكول NTP هو الساعة المركزية الموحدة في مبنى القيادة، وSyslog هو دفتر الأحداث الذي يدون فيه الحارس أي تحرك مع ختم الوقت الدقيق، وSNMP هو كاميرا المراقبة الحية التي ترسل تقارير فورية للمدير العام عند حدوث أي طارئ.',
          storyEn: 'NTP is the master atomic clock synchronizing every department clock, Syslog is the official guard logbook timestamping every door opening, and SNMP is the telemetry sensor network alerting headquarters on high temperature or power faults.',
          mappingTable: [
            { realLife: 'الساعة الذرية المرجعية الموحدة للجميع', networkTech: 'NTP Stratum 1 Reference Clock', ciscoTerm: 'ntp server' },
            { realLife: 'سجل حوادث الأمن والسلامة المصنف حسب الخطورة', networkTech: 'Syslog Logging Buffer & Host', ciscoTerm: 'logging trap' },
            { realLife: 'المستشعر الذكي الذي يبلغ المشرف عند الخطر', networkTech: 'SNMP Trap / Inform', ciscoTerm: 'snmp-server enable traps' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 5.0: SECURITY FUNDAMENTALS (15% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-5-security-fundamentals',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 5,
    unitTitleAr: 'الوحدة 5: أسس أمان الشبكات وحماية الطبقة الثانية (Security Fundamentals & L2 Defense)',
    unitTitleEn: 'Unit 5: Security Fundamentals, AAA, Port Security, DHCP Snooping, DAI & ACLs',
    moduleBadge: 'CCNA Domain 5.0',
    officialDomain: '5.0 Security Fundamentals (15% of Exam)',
    summaryAr: 'تأمين الشبكة والبنية التحتية: نماذج AAA (RADIUS/TACACS+)، حماية منافذ السويتش Port Security، إحباط هجمات DHCP Snooping و DAI، وقوائم التحكم بالوصول ACLs.',
    summaryEn: 'Hardening enterprise access layer with Port Security, DHCP Snooping, Dynamic ARP Inspection (DAI), IP Source Guard, Standard/Extended ACLs, and AAA framework.',
    topics: [
      {
        id: 'ccna-topic-5-1-layer-2-security-mitigation',
        track: 'ccna',
        titleAr: '5.1 تأمين الطبقة الثانية (Port Security, DHCP Snooping & Dynamic ARP Inspection)',
        titleEn: '5.1 Layer 2 Security Hardening: Port Security, DHCP Snooping, DAI & IP Source Guard',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §5.6, §5.7 & §5.8',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 2', type: 'Cisco OCG', code: 'Chapter 6', citation: 'Implementing Switch Port Security' },
          { title: 'Cisco Validated Design: Layer 2 Security Best Practices', type: 'Cisco Validated Design', code: 'CVD-SEC-L2', citation: 'Mitigating DHCP Starvation and ARP Poisoning' }
        ],
        summaryAr: 'الدفاع ضد أشهر هجمات السويتشات: تقييد عناوين MAC بـ Port Security، إحباط هجمات Rogue DHCP Server بـ DHCP Snooping، ومنع هجمات التجسس Man-in-the-Middle بـ Dynamic ARP Inspection (DAI).',
        summaryEn: 'Comprehensive protection against MAC flooding, DHCP starvation, rogue DHCP servers, and ARP spoofing via Port Security, Snooping, and DAI validation.',
        contentMarkdownAr: `### 1. حماية المنافذ (Port Security):
- تحديد عدد عناوين الـ MAC المسموح بها على المنفذ (مثل ماك واحد فقط للموظف).
- **أوضاع المخالفة (Violation Modes):**
  1. **Protect:** إسقاط فريمات المهاجم بصمت دون تسجيل أو إغلاق المنفذ.
  2. **Restrict:** إسقاط الفريمات، زيادة عداد المخالفات، وإرسال تنبيه Syslog / SNMP Trap.
  3. **Shutdown (الافتراضي بسيسكو):** إغلاق المنفذ فوراً ووضعه في حالة \`err-disabled\`.

---

### 2. ميزة DHCP Snooping:
- تصنيف منافذ السويتش إلى **Trusted** (منافذ السيرفرات والـ Uplinks الموثوقة) و **Untrusted** (منافذ المستخدمين العاديين).
- إذا حاول مهاجم على منفذ Untrusted إرسال حزمة DHCP Offer كخادم وهمي (Rogue DHCP)، يسقط السويتش الحزمة فوراً!
- يبني السويتش جدولاً أمنياً يسمى **DHCP Snooping Binding Database** يسجل فيه (MAC, IP, VLAN, Interface).

---

### 3. فحص الـ ARP الديناميكي (Dynamic ARP Inspection - DAI):
- يفحص كل حزمة ARP تمر عبر السويتش ويقارنها بقاعدة بيانات الـ DHCP Snooping Binding Table.
- يمنع هجمات التسمم والتجسس (ARP Spoofing / Man-In-The-Middle).`,
        contentMarkdownEn: `### 1. Port Security Violation Modes:
- **Shutdown:** Default mode; err-disables port immediately upon MAC violation.
- **Restrict:** Drops violating traffic, generates Syslog/SNMP alert, increments counter.
- **Protect:** Drops violating traffic silently.

### 2. Layer 2 Security Configuration:
\`\`\`cisco
! 1. Port Security
interface GigabitEthernet1/0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security mac-address sticky
 switchport port-security violation restrict
!
! 2. DHCP Snooping & DAI
ip dhcp snooping
ip dhcp snooping vlan 10
ip arp inspection vlan 10
!
interface GigabitEthernet1/0/24
 ip dhcp snooping trust
 ip arp inspection trust
\`\`\``,
        technicalHighlights: [
          'خيار switchport port-security mac-address sticky يتعلم عنوان MAC تلقائياً ويحفظه في ملف الـ running-config.',
          'تقنية IP Source Guard (IPSG) تعتمد على DHCP Snooping لمنع تزوير عناوين الـ IP (IP Spoofing) على مستوى منافذ الوصول.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show port-security interface GigabitEthernet1/0/1',
            deviceType: 'switch',
            deviceName: 'SW-SEC-ACCESS',
            mode: 'priv',
            category: 'Port Security State',
            explanationAr: 'عرض حالة أمان المنفذ، والماك أدرس المثبت، وعدد المخالفات المسجلة.',
            explanationEn: 'Displays Port Security status, sticky MAC addresses learned, and violation counters.',
            output: `Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Restrict
Maximum MAC Addresses      : 2
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 0050.7966.6800:10
Security Violation Count   : 0`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'بطاقة الباب الذكية ومكتب الاستقبال الأمني بالبوابة',
          titleEn: 'Biometric Door Lock and Identity Validation Gate',
          storyAr: 'حماية المنفذ تشبه القفل البيومتري على باب الغرفة: يسمح فقط لحامل البطاقة المصرح له بالدخول. وإذا حاول شخص آخر إدخال بطاقة غريبة، ينطلق جرس الإنذار ويغلق الباب بالكامل (Shutdown Violation).',
          storyEn: 'Port Security is like a biometric smart lock keyed to one employee fingerprint. If an unrecognized visitor plugs into the desk socket, the system trips an alarm and locks the physical door.',
          mappingTable: [
            { realLife: 'القفل البيومتري المخصص لموظف واحد', networkTech: 'Port Security Sticky MAC', ciscoTerm: 'switchport port-security' },
            { realLife: 'ضابط الأمن الذي يدقق هوية الزوار في السجل', networkTech: 'Dynamic ARP Inspection (DAI)', ciscoTerm: 'ip arp inspection' },
            { realLife: 'إغلاق الباب بالمفتاح عند محاولة التسلل', networkTech: 'Err-Disabled Port State', ciscoTerm: 'err-disable recovery' }
          ]
        }
      },
      {
        id: 'ccna-topic-5-2-ipv4-acls-standard-extended',
        track: 'ccna',
        titleAr: '5.2 قوائم التحكم بالوصول (Standard vs Extended IPv4 Access Lists & Wildcard Masking)',
        titleEn: '5.2 IPv4 Access Control Lists (ACLs): Standard vs Extended Rules & Wildcard Mask Calculation',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §5.4 & §5.5',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 2', type: 'Cisco OCG', code: 'Chapter 2', citation: 'Basic IPv4 Access Control Lists' },
          { title: 'RFC 5174 - Access Control Lists in Network Infrastructure', type: 'RFC', code: 'RFC 5174', citation: 'Packet Filtering Paradigms' }
        ],
        summaryAr: 'فلترة حركة البيانات وحماية الخوادم: الفرق بين Standard ACLs و Extended ACLs، حساب قناع البدل (Wildcard Mask)، وقاعدة الـ Implicit Deny في نهاية كل قائمة.',
        summaryEn: 'Packet filtering rules: Standard ACLs (source IP only) placed close to destination vs Extended ACLs (protocol, source, destination, ports) placed close to source.',
        contentMarkdownAr: `### 1. المقارنة بين قوائم Standard و Extended ACLs:
| الميزة | Standard ACL | Extended ACL |
| :--- | :--- | :--- |
| **النطاق الرقمي القديم** | 1 - 99 و 1300 - 1999 | 100 - 199 Exhibition و 2000 - 2699 |
| **عناصر الفحص** | **Source IP Address فقط** | Source IP, Destination IP, Protocol (TCP/UDP/ICMP), Port Numbers |
| **موضع التطبيق المثالي** | **الأقرب إلى الوجهة (Close to Destination)** | **الأقرب إلى المصدر (Close to Source)** لتوفير الباندويث |

---

### 2. حساب قناع البدل (Wildcard Mask):
قناع البدل هو المعكوس الثنائي لقناع الشبكة:
$\\text{Wildcard Mask} = 255.255.255.255 - \\text{Subnet Mask}$
- لقناع \`255.255.255.0\` (/24) -> قناع البدل هو \`0.0.0.255\`.
- لقناع \`255.255.255.255\` (Host واحد) -> قناع البدل هو \`0.0.0.0\` (أو استخدام كلمة \`host\`).
- لجميع العناوين (Any) -> قناع البدل هو \`255.255.255.255\` (أو استخدام كلمة \`any\`).

---

### 3. قاعدة الرفض الضمني (Implicit Deny Any Any):
في نهاية كل قائمة ACL توجد قاعدة غير مرئية تسقط أي حزمة لم تطابق الشروط السابقة.`,
        contentMarkdownEn: `### 1. Standard vs Extended ACL Rules:
- **Standard ACL:** Filters based solely on Source IPv4 address.
- **Extended ACL:** Filters on Source IP, Destination IP, Protocol, and Layer 4 Port (e.g. eq 80, eq 443).

### 2. Cisco Named Extended ACL Configuration:
\`\`\`cisco
ip access-list extended BLOCK_UNSECURE_WEB
 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443
 deny tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 80
 permit ip any any
!
interface GigabitEthernet0/0/0
 ip access-group BLOCK_UNSECURE_WEB in
\`\`\``,
        technicalHighlights: [
          'قوائم الـ ACL تفحص القواعد بالترتيب من الأعلى إلى الأسفل (Top-to-Bottom)، وعند أول تطابق يتم تطبيق الإجراء وتتوقف المعالجة.',
          'أمر show access-lists يعرض عداد الحزم المتطابقة (Match Counter) لكل سطر في القائمة للتحقق من فعاليتها.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show access-lists BLOCK_UNSECURE_WEB',
            deviceType: 'router',
            deviceName: 'R1-FIREWALL-GW',
            mode: 'priv',
            category: 'ACL Hit Counters',
            explanationAr: 'عرض أسطر قائمة التحكم بالوصول وعدد الحزم المسموح بها والممنوعة (Matches).',
            explanationEn: 'Displays configured ACL rules and dynamic packet hit counters.',
            output: `Extended IP access list BLOCK_UNSECURE_WEB
    10 permit tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq 443 (1420 matches)
    20 deny tcp 192.168.10.0 0.0.0.255 host 10.0.0.50 eq www (85 matches)
    30 permit ip any any (29310 matches)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'قائمة المدعوين عند باب الحفل الخاص',
          titleEn: 'Security Bouncer Checking VIP Guestlist at Event Entry',
          storyAr: 'حارس الأمن عند بوابة الحفل يقرأ بطاقات الزوار بالترتيب: إذا كان اسمك مصرحاً له بالدخول يدخلك فوراً، وإذا كان اسمك ممنوعاً يطردك، وإذا انتهت القائمة ولم يجد اسمك فإن القاعدة الضمنية هي منع أي شخص غير مسجل في القائمة من الدخول.',
          storyEn: 'An ACL is like a nightclub bouncer reading an entry guest list: top to bottom inspection. If your invitation is validated, you pass. If you reach the end of the paper without a match, the unwritten implicit rule forbids entry.',
          mappingTable: [
            { realLife: 'أسطر قائمة المدعوين بالترتيب', networkTech: 'Access Control Entries (ACEs)', ciscoTerm: 'permit / deny lines' },
            { realLife: 'القاعدة الافتراضية لمنع أي شخص غير مدرج', networkTech: 'Implicit Deny All at ACL End', ciscoTerm: 'deny ip any any' },
            { realLife: 'تطبيق القائمة عند الباب الخارجي للحديقة', networkTech: 'Inbound / Outbound Interface Filter', ciscoTerm: 'ip access-group in/out' }
          ]
        }
      }
    ]
  },

  // =========================================================================
  // DOMAIN 6.0: AUTOMATION AND PROGRAMMABILITY (10% of CCNA 200-301 Exam)
  // =========================================================================
  {
    id: 'ccna-unit-6-automation-programmability',
    track: 'ccna',
    trackTitleAr: 'منهج سيسكو CCNA R&S',
    trackTitleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    unitNumber: 6,
    unitTitleAr: 'الوحدة 6: أتمتة الشبكات والبرمجة (Automation, REST APIs & Controller Architectures)',
    unitTitleEn: 'Unit 6: Network Automation, Controllers (Catalyst Center), REST APIs, JSON & Ansible',
    moduleBadge: 'CCNA Domain 6.0',
    officialDomain: '6.0 Automation and Programmability (10% of Exam)',
    summaryAr: 'التحول نحو الشبكات المعرفة برمجياً (SDN): المقارنة بين الشبكات التقليدية ووحدات التحكم المركزية Cisco DNA Center / Catalyst Center، وهندسة واجهات REST APIs، وتنسيقات البيانات JSON/YAML، وأدوات إدارة الإعدادات Ansible.',
    summaryEn: 'Modern network programmability: Traditional CLI vs Controller-based networking (Cisco Catalyst Center/DNA-C), REST API fundamentals (CRUD, HTTP status codes), JSON encoding, and configuration management tools.',
    topics: [
      {
        id: 'ccna-topic-6-1-controller-architectures-sdn',
        track: 'ccna',
        titleAr: '6.1 الشبكات المعرفة برمجياً والمعمارية القائمة على المتحكمات (Cisco Catalyst Center / DNA-C)',
        titleEn: '6.1 Controller-Based Networking, Control vs Data Planes & Cisco Catalyst Center (DNA-C)',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §6.1, §6.2 & §6.3',
        officialReferences: [
          { title: 'Cisco Press CCNA 200-301 OCG Volume 2', type: 'Cisco OCG', code: 'Chapter 18', citation: 'Introduction to Controller-Based Networking' },
          { title: 'Cisco Catalyst Center Architecture Whitepaper', type: 'Cisco Whitepaper', code: 'CVD-CATALYST-CENTER', citation: 'Intent-Based Networking and Network Automation' }
        ],
        summaryAr: 'فصل طبقة التحكم (Control Plane) عن طبقة تمرير البيانات (Data Plane): مقارنة التكوين اليدوي عبر CLI بالأتمتة المركزية القائمة على النوايا (Intent-Based Networking) عبر واجهات Southbound و Northbound APIs.',
        summaryEn: 'Decoupling Control Plane from Data Plane, Southbound APIs (NETCONF, RESTCONF, OpenFlow) vs Northbound APIs (REST), and Intent-Based Networking.',
        contentMarkdownAr: `### 1. مستويات الشبكة الثلاثة (Network Planes):
1. **Data Plane (مستوى البيانات):** تمرير وتحويل الفريمات وحزم البيانات بسرعة المعالجة المادية للرقاقات (Hardware ASICs) بناءً على جداول الـ MAC و FIB.
2. **Control Plane (مستوى التحكم):** اتخاذ قرارات التوجيه وتبادل معلومات البروتوكولات (OSPF, BGP, STP, ARP) لبناء جداول التوجيه.
3. **Management Plane (مستوى الإدارة):** إدارة الجهاز ومراقبته (SSH, Telnet, SNMP, HTTPS, Syslog).

---

### 2. المعمارية المعتمدة على المتحكم (SDN / Cisco Catalyst Center):
- يتم نقل وظائف الـ Control Plane و Management Plane إلى **متحكم مركزي ذكي (Centralized SDN Controller)**.
- **Southbound APIs:** البروتوكولات التي يتحدث بها المتحكم مع السويتشات والراوترات في الأسفل (مثل NETCONF, RESTCONF, gRPC).
- **Northbound APIs:** واجهات REST APIs التي تتيح للمبرمجين وتطبيقات الأعمال التواصل مع المتحكم وبرمجة الشبكة بالكامل بلغة Python!`,
        contentMarkdownEn: `### 1. Network Plane Separation:
- **Data Plane:** Line-rate packet switching (ASICs, FIB, TCAM).
- **Control Plane:** Routing table calculation and protocol state engines (OSPF, BGP, STP).
- **Management Plane:** Configuration interface (SSH, SNMP, Web GUI).

### 2. Controller Architecture:
- **Southbound APIs:** Controller -> Network Devices (NETCONF, RESTCONF).
- **Northbound APIs:** Applications -> Controller (RESTful JSON APIs).`,
        technicalHighlights: [
          'الشبكات القائمة على النوايا (Intent-Based Networking) تترجم رغبة مدير الشبكة (مثال: عزل قسم الضيوف) تلقائياً إلى آلاف الأوامر المطبقة عبر كافة الأجهزة في ثوانٍ.',
          'متحكم Cisco Catalyst Center يوفر ميزة Network Assurance لمراقبة صحة الشبكة والتنبؤ بالمشاكل قبل وقوعها باستخدام الذكاء الاصطناعي.'
        ],
        ciscoCliOutputs: [
          {
            command: 'show netconf-yang status',
            deviceType: 'router',
            deviceName: 'R1-PROG-ROUTER',
            mode: 'priv',
            category: 'NETCONF Programmability',
            explanationAr: 'التحقق من تفعيل واجهة NETCONF البرمجية وجلسات التواصل مع متحكم الشبكة المركزي.',
            explanationEn: 'Displays operational state of NETCONF-YANG programmable management subsystem.',
            output: `netconf-yang: ENABLED
netconf-yang ssh port: 830
netconf status: Active and listening
Active sessions: 1 (Connected to Cisco Catalyst Center 10.255.0.10)`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'برج الإرشاد الآلي للقطارات مقابل قيادة كل قطار يدوياً',
          titleEn: 'Central Railway Dispatch Computer vs Manual Station Switches',
          storyAr: 'في السكك الحديدية القديمة، كان عامل التحويلة يقف عند كل مفترق سكة ليغير المسار يدوياً (Traditional CLI). في النظام الحديث، يجلس المراقب في برج التحكم المركزي ويضغط على الشاشة لبرمجة مسار 500 قطار بضغطة زر واحدة (SDN Controller).',
          storyEn: 'Traditional networking is a railway worker manually flipping mechanical track switches at every junction. Controller-based networking is a centralized digital dispatch center that programs and aligns thousands of railway switches simultaneously through computerized APIs.',
          mappingTable: [
            { realLife: 'قضبان السكة التي تسير فوقها عربات القطار', networkTech: 'Data Plane (Line-rate Switching)', ciscoTerm: 'Hardware Forwarding (FIB)' },
            { realLife: 'حاسوب برج المراقبة المركزي للسكك', networkTech: 'SDN Central Controller', ciscoTerm: 'Cisco Catalyst Center / DNA-C' },
            { realLife: 'كابلات الإشارات الممتدة إلى المحولات', networkTech: 'Southbound APIs (NETCONF/RESTCONF)', ciscoTerm: 'Southbound Protocols' }
          ]
        }
      },
      {
        id: 'ccna-topic-6-2-rest-apis-json-data-encoding',
        track: 'ccna',
        titleAr: '6.2 واجهات البرمجة REST APIs وتنسيق البيانات بـ JSON و YAML',
        titleEn: '6.2 RESTful APIs, HTTP Verbs (GET, POST, PUT, DELETE), Status Codes & JSON/YAML Data Formats',
        level: 'CCNA',
        ciscoBlueprintRef: 'CCNA 200-301 §6.4 & §6.5',
        officialReferences: [
          { title: 'RFC 8259 - The JavaScript Object Notation (JSON) Data Interchange Format', type: 'RFC', code: 'RFC 8259', citation: 'IETF JSON Standard' },
          { title: 'Cisco Press CCNA 200-301 OCG Volume 2', type: 'Cisco OCG', code: 'Chapter 19', citation: 'Understanding REST APIs and Data Encoding' }
        ],
        summaryAr: 'لغة التواصل في عصر أتمتة الشبكات: بنية طلبات REST API، أفعال HTTP Verbs، رموز الاستجابة HTTP Status Codes (200 OK, 201 Created, 404, 500)، وتحليل ملفات البيانات بتنسيق JSON و YAML.',
        summaryEn: 'Dissecting RESTful API architecture: CRUD operations mapped to HTTP verbs (GET, POST, PUT, DELETE), HTTP status codes, and structural syntax of JSON vs YAML data objects.',
        contentMarkdownAr: `### 1. أفعال الـ HTTP Verbs وعمليات الـ CRUD:
| عملية البيانات (CRUD) | فعل الـ HTTP (REST Verb) | الوظيفة في أتمتة الشبكات |
| :--- | :--- | :--- |
| **Create** | **POST** | إنشاء تكوين جديد (مثل إضافة VLAN جديدة للسويتش). |
| **Read** | **GET** | قراءة واسترجاع معلومات من الراوتر (مثل جلب جدول التوجيه). |
| **Update** | **PUT / PATCH** | تعديل أو استبدال تكوين موجود (تغيير IP أو وصف منفذ). |
| **Delete** | **DELETE** | حذف عنصر من الشبكة (مثل حذف مسار ثابت أو VLAN). |

---

### 2. أشهر رموز الاستجابة (HTTP Status Codes):
- **2xx (Success):** \`200 OK\` (تم بنجاح)، \`201 Created\` (تم إنشاء العنصر بنجاح).
- **3xx (Redirection):** إعادة توجيه الطلب إلى مسار آخر.
- **4xx (Client Error):** \`400 Bad Request\` (صيغة الطلب خاطئة)، \`401 Unauthorized\` (خطأ في تسجيل الدخول)، \`404 Not Found\` (العنصر غير موجود).
- **5xx (Server Error):** \`500 Internal Server Error\` (عطل في خادم المتحكم).

---

### 3. تشريح بيانات الـ JSON في الشبكات:
\`\`\`json
{
  "cisco-ios-xe:interface": {
    "name": "GigabitEthernet0/0/1",
    "description": "Uplink to Core Switch",
    "enabled": true,
    "ip-address": "192.168.1.1",
    "subnet-mask": "255.255.255.0",
    "vlans": [10, 20, 30]
  }
}
\`\`\``,
        contentMarkdownEn: `### 1. HTTP Methods & REST Mapping:
- **GET:** Retrieve resource representation.
- **POST:** Create new resource.
- **PUT / PATCH:** Full or partial update of resource.
- **DELETE:** Remove resource.

### 2. HTTP Status Code Categories:
- **200 OK / 201 Created:** Successful execution.
- **400 Bad Request / 401 Unauthorized / 404 Not Found:** Client-side error.
- **500 Internal Server Error:** Server-side failure.`,
        technicalHighlights: [
          'تنسيق JSON يعتمد على أزواج المفاتيح والقيم (Key-Value Pairs) ومصفوفات العناصر المحصورة بين أقواس مربعة \`[ ]\` وأقواس معقوفة \`{ }\`.',
          'واجهات REST APIs عديمة الحالة (Stateless)، أي أن كل طلب HTTP مستقل بذاته ويحمل كامل معلومات التوثيق والتوكن في ترويسة الطلب (Authorization Header).'
        ],
        ciscoCliOutputs: [
          {
            command: 'curl -k -X GET "https://10.255.0.10/dna/intent/api/v1/network-device" -H "X-Auth-Token: eyJhbGciOi..."',
            deviceType: 'router',
            deviceName: 'CATALYST-CENTER-REST',
            mode: 'priv',
            category: 'REST API Request',
            explanationAr: 'إرسال طلب HTTP GET إلى متحكم الشبكة لاسترجاع قائمة كافة السويتشات بصيغة JSON برمجية.',
            explanationEn: 'Executes REST API GET call against Cisco Catalyst Center retrieving device inventory payload.',
            output: `{
  "response": [
    {
      "hostname": "SW-ACCESS-01",
      "managementIpAddress": "10.10.100.1",
      "platformId": "C9300-48P",
      "reachabilityStatus": "Reachable",
      "upTime": "45 days, 12 hours"
    }
  ],
  "version": "1.0"
}`
          }
        ],
        realWorldAnalogy: {
          titleAr: 'قائمة الطعام القياسية ونادل المطعم المحترف',
          titleEn: 'Standard Restaurant Menu and Waiter Service Protocol',
          storyAr: 'واجهة REST API تشبه نادل المطعم: قائمة الطعام المكتوبة بلغة موحدة هي الـ API Schema، والزبون يرسل طلباً محدداً (GET لطلب الفاتورة، POST لطلب وجبة جديدة)، ويعود النادل بطبق منسق على صينية قياسية تفهمها في أي مكان بالعالم (JSON Payload).',
          storyEn: 'A REST API is like ordering food at a restaurant: the menu is the API documentation, your order is the HTTP request (POST a new order, GET the bill), and the waiter brings back the food in a standardized formatted tray (JSON data payload).',
          mappingTable: [
            { realLife: 'قائمة الطعام المطبوعة بالأسعار والخيارات', networkTech: 'REST API Documentation / Swagger Schema', ciscoTerm: 'REST API Endpoint' },
            { realLife: 'طلب وجبة جديدة من المطبخ', networkTech: 'HTTP POST Request', ciscoTerm: 'HTTP POST' },
            { realLife: 'الصينية المنسقة التي تقدم الوجبة', networkTech: 'JSON Formatted Payload', ciscoTerm: 'JSON Data Structure' }
          ]
        }
      }
    ]
  }
];

