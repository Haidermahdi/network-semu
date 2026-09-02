import { ProtocolDetail } from '../types';

export const PROTOCOL_DEEP_DIVES: Record<string, ProtocolDetail> = {
  OSPF: {
    id: 'OSPF',
    name: 'Open Shortest Path First (OSPFv2 / OSPFv3)',
    standard: 'RFC 2328 (v2 IPv4) / RFC 5340 (v3 IPv6)',
    layer: 'Layer 3 (Network) - IP Protocol 89',
    adminDistance: 110,
    metricEquation: 'Cost = Reference Bandwidth (Default 100 Mbps) / Interface Bandwidth (bps)',
    algorithm: 'Dijkstra SPF (Shortest Path First) Tree Algorithm',
    packetTypes: [
      { name: 'Type 1: Hello Packet', opcode: '0x01', purposeAr: 'اكتشاف الجيران وتشكيل علاقات الجوار (Adjacency) والحفاظ على نبض الاتصال (Keepalive)', purposeEn: 'Discover neighbors, form adjacencies, and maintain keepalive heartbeat' },
      { name: 'Type 2: Database Description (DBD / DDP)', opcode: '0x02', purposeAr: 'تبادل ملخص ترويسات قاعدة بيانات الـ LSDB للتحقق من المزامنة', purposeEn: 'Exchange LSDB summary headers to verify database synchronization' },
      { name: 'Type 3: Link-State Request (LSR)', opcode: '0x03', purposeAr: 'طلب معلومات تفصيلية عن مسارات أو وصلات محددة تنقص الراوتر', purposeEn: 'Request full LSA details for pieces of missing topology' },
      { name: 'Type 4: Link-State Update (LSU)', opcode: '0x04', purposeAr: 'حزمة نقل وتحديث الـ LSAs (تحتوي على تفاصيل الطوبولوجيا الكاملة)', purposeEn: 'LSA transportation update envelope carrying full topology records' },
      { name: 'Type 5: Link-State Acknowledgment (LSAck)', opcode: '0x05', purposeAr: 'تأكيد استلام وتوثيق موثوق لحزم الـ LSU', purposeEn: 'Explicit reliable acknowledgment for received LSUs' }
    ],
    stateMachine: [
      { state: '1. Down', descAr: 'لم يتم استقبال أي حزمة Hello من الجار حتى الآن.', descEn: 'No Hello packets received from the neighbor yet.', triggerAr: 'إرسال حزمة Hello دورية عبر Multicast 224.0.0.5', triggerEn: 'Periodic Hello sent via 224.0.0.5 multicast' },
      { state: '2. Init', descAr: 'تم استلام Hello من الجار، ولكن Router-ID الخاص بنا لم يظهر بعد في قائمة الجيران المعترف بها.', descEn: 'Neighbor Hello received, but local Router ID is not in neighbor seen list.', triggerAr: 'الجار يقوم بتضمين RID الخاص بنا في حزمة الـ Hello التالية', triggerEn: 'Neighbor adds local RID into its next Hello list' },
      { state: '3. 2-Way', descAr: 'تم تحقيق الاتصال ثنائي الاتجاه. في شبكات الإيثرنت يتم هنا انتخاب الـ DR/BDR.', descEn: 'Bi-directional communication achieved. DR/BDR election occurs on broadcast networks.', triggerAr: 'إذا كانت نقطة لنقطة (P2P) أو بعد انتخاب DR/BDR مع الجار', triggerEn: 'P2P link or DR/BDR election complete' },
      { state: '4. ExStart', descAr: 'التفاوض على علاقة السيد والتابع (Master / Slave) واختيار رقم التسلسل الأولي لحزم الـ DBD.', descEn: 'Master/Slave relationship negotiated and initial sequence number chosen.', triggerAr: 'الراوتر صاحب الـ Router ID الأعلى يصبح Master', triggerEn: 'Router with highest Router ID becomes Master' },
      { state: '5. Exchange', descAr: 'تبادل حزم الـ DBD المحتوية على ملخصات الـ LSAs الموجودة في قاعدة بيانات كل راوتر.', descEn: 'Exchange of DBD packets describing summary of LSDB contents.', triggerAr: 'مقارنة المحتويات وتحديد ما ينقص كل راوتر', triggerEn: 'Compare LSDB summaries and build LSR list' },
      { state: '6. Loading', descAr: 'إرسال حزم LSR لطلب الـ LSAs الكاملة، والرد بحزم LSU مؤكدة بحزم LSAck.', descEn: 'Sending LSRs for missing LSAs, receiving LSUs and acknowledging with LSAcks.', triggerAr: 'اكتمال تحميل وتحديث كافة السجلات المفقودة', triggerEn: 'All requested LSAs received and acknowledged' },
      { state: '7. Full', descAr: 'تطابق كامل ومطلق في قاعدة بيانات الطوبولوجيا (LSDB Identical) بين الجيران واكتمال شجرة SPF.', descEn: 'Full LSDB synchronization; SPF tree calculated and routes installed in RIB.', triggerAr: 'الجوار مكتمل والمسارات جاهزة للحقن في جدول التوجيه', triggerEn: 'Adjacency complete and routes ready for routing table injection' }
    ],
    headerStructure: [
      { field: 'Version', bits: '8 bits', descAr: 'إصدار OSPF (القيمة 2 لـ IPv4 والقيمة 3 لـ IPv6)', descEn: 'OSPF version (2 for IPv4, 3 for IPv6)' },
      { field: 'Type', bits: '8 bits', descAr: 'نوع الحزمة (1=Hello, 2=DBD, 3=LSR, 4=LSU, 5=LSAck)', descEn: 'Packet type code' },
      { field: 'Packet Length', bits: '16 bits', descAr: 'الطول الإجمالي لحزمة OSPF بالبايت بما فيها الترويسة', descEn: 'Total packet length in bytes' },
      { field: 'Router ID (RID)', bits: '32 bits', descAr: 'المعرف الفريد للراوتر بصيغة IPv4', descEn: 'Unique 32-bit router identifier' },
      { field: 'Area ID', bits: '32 bits', descAr: 'معرف المنطقة التابع لها المنفذ (مثل 0.0.0.0 للمنطقة الأساسية Area 0)', descEn: 'Area identifier (e.g. 0.0.0.0 for Backbone)' },
      { field: 'Checksum', bits: '16 bits', descAr: 'التحقق الرياضي من سلامة الترويسة ضد الأخطاء', descEn: 'Header error checksum' },
      { field: 'AuType & Authentication', bits: '64 bits', descAr: 'نوع التوثيق ومفتاح الأمان (Null, Simple Password, MD5, SHA-HMAC)', descEn: 'Authentication type and cryptographic key' }
    ],
    ciscoShowCommands: [
      'show ip ospf neighbor',
      'show ip ospf interface brief',
      'show ip ospf database',
      'show ip route ospf'
    ],
    ciscoConfigSnippet: `router ospf 1
 router-id 1.1.1.1
 auto-cost reference-bandwidth 10000
 network 10.1.1.0 0.0.0.255 area 0
 network 192.168.10.0 0.0.0.255 area 0
 passive-interface GigabitEthernet0/1`,
    keyConceptsAr: [
      { title: 'التقسيم إلى مناطق (Hierarchical Areas)', desc: 'تقسيم الشبكة إلى منطقة رئيسية (Backbone Area 0) ومناطق فرعية لتقليل حجم قاعدة بيانات الـ LSDB وحصر حسابات SPF عند حدوث تقلبات.' },
      { title: 'انتخاب DR و BDR', desc: 'في شبكات البث المتعدد (Broadcast Multiaccess مثل الإيثرنت)، يتم انتخاب Designated Router ليكون الموزع المركزي للـ LSAs لتقليل استهلاك النطاق.' },
      { title: 'معادلة الـ Cost وتعديل المرجع', desc: 'المرجع الافتراضي بسيسكو هو 100Mbps، مما يجعل 100Mbps و 1Gbps و 10Gbps بنفس التكلفة (1). يجب ضبط auto-cost reference-bandwidth 10000 في الشبكات الحديثة.' }
    ],
    keyConceptsEn: [
      { title: 'Hierarchical Area Design', desc: 'Partitioning network into Backbone (Area 0) and non-backbone areas to limit LSDB flooding and contain SPF recomputations.' },
      { title: 'DR/BDR Election', desc: 'Designated Router acts as central clearinghouse on multiaccess broadcast segments, reducing adjacencies from N(N-1)/2 to 2N.' },
      { title: 'Reference Bandwidth Tuning', desc: 'Default 100Mbps reference bandwidth calculates cost 1 for 100M, 1G, and 10G interfaces. Auto-cost reference-bandwidth 10000 fixes this.' }
    ],
    realWorldAnalogyAr: 'يشبه OSPF نظام الملاحة والتوجيه الذكي (GPS مثل Google Maps) لأسطول طائرات شحن دولي: كل طيار لديه خارطة تضاريس كاملة ومفصلة للقارة بأكملها (LSDB)، وعندما يغلق طريق، يتم تعميم إشعار فوري (LSU)، ويعيد كل قائد حساب أسرع مسار رياضي خالي من الازدحام باستخدام خوارزمية ديكسترا.',
    realWorldAnalogyEn: 'OSPF operates like a global GPS air traffic control network: every pilot has an identical topological map of the entire region (LSDB). When a runway closes, an instant alert (LSU) is broadcast, and every router runs Dijkstra SPF to recalculate the shortest loop-free route.'
  },

  EIGRP: {
    id: 'EIGRP',
    name: 'Enhanced Interior Gateway Routing Protocol (EIGRP / Cisco DUAL)',
    standard: 'RFC 7868 (Cisco Open EIGRP Specification)',
    layer: 'Layer 3 (Network) - IP Protocol 88',
    adminDistance: 90,
    metricEquation: 'Metric = 256 * [(10^7 / Min_Bandwidth_kbps) + (Total_Delay_usec / 10)] (When K1=1, K3=1)',
    algorithm: 'DUAL (Diffusing Update Algorithm) لحساب مسارات خالية 100% من الحلقات في أجزاء من الثانية',
    packetTypes: [
      { name: 'Hello', opcode: 'Opcode 5', purposeAr: 'اكتشاف الجيران والحفاظ على نبض الاتصال (يرسل كل 5 ثوانٍ إلى 224.0.0.10)', purposeEn: 'Neighbor discovery and keepalive sent every 5s via 224.0.0.10' },
      { name: 'Update', opcode: 'Opcode 1', purposeAr: 'إرسال معلومات المسارات عند حدوث تغيير طوبولوجي فقط وبشكل موثوق (RTP)', purposeEn: 'Reliable transmission of routing updates only on state change' },
      { name: 'Query', opcode: 'Opcode 3', purposeAr: 'الاستعلام من الجيران عن مسار بديل عند سقوط المسار الأساسي (Successor) وعدم وجود Feasible Successor', purposeEn: 'Query neighbors for alternate route when Successor drops without FS' },
      { name: 'Reply', opcode: 'Opcode 4', purposeAr: 'الرد الموثوق على استعلام الجار بمعلومات المسار المتاح لديه', purposeEn: 'Reliable answer back to neighbor query' },
      { name: 'ACK', opcode: 'Opcode 5 (Unicast)', purposeAr: 'تأكيد استلام موثوق لحزم Update, Query, Reply', purposeEn: 'Unreliable unicast acknowledgment for RTP packets' }
    ],
    stateMachine: [
      { state: '1. Passive (Stable)', descAr: 'المسار مستقر تماماً ولا توجد أي حسابات جارية. يتم توجيه الحزم بأقصى سرعة.', descEn: 'Route is fully operational and stable; no active DUAL recomputation.', triggerAr: 'سقوط المسار الأساسي (Successor Failure)', triggerEn: 'Successor interface goes down' },
      { state: '2. Feasibility Condition Check', descAr: 'فحص فوري للجدول الطوبولوجي: هل يوجد مسار بديل يحقق شرط الجدوى (Reported Distance < Feasible Distance)؟', descEn: 'Evaluate topology table: does any backup satisfy Reported Distance < Feasible Distance?', triggerAr: 'إذا تحقق الشرط يصبح Feasible Successor فوراً (Sub-second convergence)', triggerEn: 'If condition met, install FS immediately with zero packet loss' },
      { state: '3. Active (Querying)', descAr: 'إذا لم يتحقق شرط الجدوى، يتحول المسار إلى Active ويرسل حزم Query لجميع الجيران بحثاً عن طريق بديل.', descEn: 'No valid FS found; route enters Active state and sends Queries to neighbors.', triggerAr: 'بانتظار ردود جميع الجيران بحزم Reply', triggerEn: 'Waiting for Replies from all adjacent peers' },
      { state: '4. Reply Received & Calculated', descAr: 'تم استلام ردود جميع الجيران وتم حساب المسار الجديد الأفضل وتحديث جدول التوجيه.', descEn: 'All neighbor Replies collected; new metric calculated and path chosen.', triggerAr: 'تحديث المسار والعودة للحالة المستقرة', triggerEn: 'Install best route into RIB and return to Passive' },
      { state: '5. SIA (Stuck In Active)', descAr: 'إنذار: أحد الجيران لم يرد على الـ Query خلال مؤقت SIA (افتراضياً 3 دقائق)، مما يؤدي لقطع الجوار معه.', descEn: 'SIA Alarm: Neighbor failed to reply within 3 minutes; teardown adjacency to unblock convergence.', triggerAr: 'انتهاء مؤقت Active Timer دون رد', triggerEn: 'Active timer expiration' }
    ],
    headerStructure: [
      { field: 'Version', bits: '8 bits', descAr: 'إصدار بروتوكول EIGRP (الإصدار 2)', descEn: 'EIGRP Version' },
      { field: 'Opcode', bits: '8 bits', descAr: 'نوع الحزمة (1=Update, 3=Query, 4=Reply, 5=Hello/Ack)', descEn: 'EIGRP Opcode' },
      { field: 'Checksum', bits: '16 bits', descAr: 'فحص سلامة الحزمة', descEn: 'Checksum' },
      { field: 'Flags', bits: '32 bits', descAr: 'علامات التحكم (مثل Init flag في أول Update)', descEn: 'Control flags' },
      { field: 'Sequence', bits: '32 bits', descAr: 'رقم التسلسل الموثوق لبروتوكول RTP', descEn: 'RTP Sequence number' },
      { field: 'ACK Number', bits: '32 bits', descAr: 'رقم تأكيد الاستلام للحزم السابقة', descEn: 'Acknowledgment sequence' },
      { field: 'Autonomous System Number', bits: '32 bits', descAr: 'رقم الـ AS الذي يجب أن يتطابق بين الجيران', descEn: 'EIGRP AS number (must match)' }
    ],
    ciscoShowCommands: [
      'show ip eigrp neighbors',
      'show ip eigrp topology',
      'show ip eigrp interfaces',
      'show ip route eigrp'
    ],
    ciscoConfigSnippet: `router eigrp 100
 metric weights 0 1 0 1 0 0
 network 10.0.0.0 0.255.255.255
 network 192.168.1.0 0.0.0.255
 no auto-summary
 passive-interface GigabitEthernet0/2`,
    keyConceptsAr: [
      { title: 'الـ Successor و الـ Feasible Successor', desc: 'الـ Successor هو المسار الأساسي الأقل تكلفة (FD). الـ Feasible Successor هو مسار احتياطي جاهز للعمل فوراً في جزء من الثانية دون أي حسابات إذا كان RD < FD.' },
      { title: 'موازنة الحمل غير المتساوية (Unequal Cost Load Balancing)', desc: 'EIGRP هو البروتوكول الوحيد القادر على توزيع الحمل عبر مسارات ذات سرعات مختلفة باستخدام أمر variance.' }
    ],
    keyConceptsEn: [
      { title: 'Successor vs Feasible Successor', desc: 'Successor is the primary lowest FD route. Feasible Successor is a pre-calculated loop-free backup installed instantly if Reported Distance < Feasible Distance.' },
      { title: 'Unequal Cost Load Balancing', desc: 'EIGRP uniquely supports traffic sharing across paths with different metrics using the variance multiplier command.' }
    ],
    realWorldAnalogyAr: 'يشبه EIGRP نظام مولد كهربائي احتياطي ذكي في مستشفى: المولد الاحتياطي مبرمج مسبقاً ومتزامن اللحظة مع التيار الرئيسي (Feasible Successor)، فبمجرد انقطاع الكهرباء يشتغل في جزء من الثانية دون أن تشعر الأجهزة الطبية بأي توقف!',
    realWorldAnalogyEn: 'EIGRP operates like an uninterruptible hospital backup generator: the secondary line is pre-warmed and synchronized (Feasible Successor), kicking in within milliseconds of main grid failure with zero downtime.'
  },

  BGP: {
    id: 'BGP',
    name: 'Border Gateway Protocol (BGP-4 / MP-BGP)',
    standard: 'RFC 4271 (BGP-4) / RFC 4760 (Multi-Protocol BGP)',
    layer: 'Layer 7 (Application/Control) - يعمل فوق TCP Port 179',
    adminDistance: 20,
    metricEquation: 'BGP Path Selection: Weight -> Local_Pref -> Originated -> AS_PATH -> Origin -> MED -> eBGP over iBGP -> IGP Metric -> Age -> Router ID',
    algorithm: 'Path Vector Protocol مع إمكانية فرض سياسات التوجيه والتحكم بحركة الإنترنت العالمية',
    packetTypes: [
      { name: 'Open Message', opcode: 'Type 1', purposeAr: 'بدء وتأسيس جلسة BGP والتفاوض على معايير الاتصال (BGP Version, AS Number, Hold Time, BGP Identifier)', purposeEn: 'Initialize BGP session and negotiate BGP version, AS number, and hold time' },
      { name: 'Keepalive Message', opcode: 'Type 4', purposeAr: 'الحفاظ على جلسة الاتصال نشطة (تُرسل افتراضياً كل 60 ثانية مع Hold Time 180s)', purposeEn: 'Periodic keepalive message sent every 60s to maintain session' },
      { name: 'Update Message', opcode: 'Type 2', purposeAr: 'الإعلان عن مسارات جديدة أو سحب مسارات سابقة (Withdrawn Routes) مع سمات المسار Path Attributes', purposeEn: 'Advertise new reachable routes or withdraw dead paths with Path Attributes' },
      { name: 'Notification Message', opcode: 'Type 3', purposeAr: 'إشعار بحدوث خطأ جسيم وإغلاق جلسة BGP على الفور', purposeEn: 'Fatal error notification and immediate BGP session teardown' }
    ],
    stateMachine: [
      { state: '1. Idle', descAr: 'الراوتر يرفض الاتصالات الواردة ويستعد لبدء محاولة الاتصال بـ TCP.', descEn: 'BGP process refuses incoming connections and prepares TCP handshake.', triggerAr: 'بدء محاولة الاتصال بالجار عبر Start Event', triggerEn: 'Manual or automated BGP start event triggered' },
      { state: '2. Connect', descAr: 'الراوتر ينتظر اكتمال مصافحة TCP الثلاثية (TCP 3-Way Handshake على منفذ 179).', descEn: 'Waiting for TCP 3-way handshake on TCP port 179 to complete.', triggerAr: 'نجاح الاتصال يقود إلى OpenSent، والفشل يذهب إلى Active', triggerEn: 'TCP handshake success moves to OpenSent; failure goes to Active' },
      { state: '3. Active', descAr: 'محاولة إعادة إنشاء اتصال TCP مع الجار بعد فشل المحاولة السابقة.', descEn: 'Attempting to re-establish TCP connection with neighbor.', triggerAr: 'إما نجاح الاتصال والانتقال إلى OpenSent أو انتهاء المؤقت والعودة لـ Idle', triggerEn: 'Connect retry timer expiration or success' },
      { state: '4. OpenSent', descAr: 'تم إرسال رسالة BGP Open ونحن بانتظار استلام رسالة Open مطابقة من الجار.', descEn: 'BGP Open message sent; waiting for matching Open from neighbor.', triggerAr: 'استلام Open والتحقق من عدم تعارض معايير AS و Hold Time', triggerEn: 'Receive valid Open message with matching AS and capabilities' },
      { state: '5. OpenConfirm', descAr: 'تم استلام وتأكيد رسالة Open وإرسال Keepalive، بانتظار Keepalive الجار.', descEn: 'Open confirmed, Keepalive sent, waiting for neighbor Keepalive.', triggerAr: 'استلام Keepalive من الجار', triggerEn: 'Neighbor Keepalive received' },
      { state: '6. Established', descAr: 'العلاقة متكاملة تماماً ويمكن تبادل حزم Update وإدارة مسارات الإنترنت الدولية.', descEn: 'BGP peering fully operational; ready to exchange routing updates.', triggerAr: 'جاهز لتبادل مسارات الإنترنت الكاملة', triggerEn: 'Ready to send and receive full Internet routing table' }
    ],
    headerStructure: [
      { field: 'Marker', bits: '16 Bytes (128 bits)', descAr: 'مزامنة وتوثيق الحزم (جميع البتات 1s)', descEn: 'Synchronization marker and security authentication' },
      { field: 'Length', bits: '16 bits', descAr: 'طول حزمة BGP الإجمالي (من 19 إلى 4096 بايت)', descEn: 'Total BGP message length in octets' },
      { field: 'Type', bits: '8 bits', descAr: 'نوع الرسالة (1=Open, 2=Update, 3=Notification, 4=Keepalive)', descEn: 'Message type code' }
    ],
    ciscoShowCommands: [
      'show ip bgp summary',
      'show ip bgp',
      'show ip bgp neighbors',
      'show ip route bgp'
    ],
    ciscoConfigSnippet: `router bgp 65001
 neighbor 198.51.100.2 remote-as 65002
 neighbor 198.51.100.2 description Transit_ISP_Link
 address-family ipv4
  network 203.0.113.0 mask 255.255.255.0
  neighbor 198.51.100.2 activate
  neighbor 198.51.100.2 route-map SET_LOCAL_PREF in`,
    keyConceptsAr: [
      { title: 'eBGP مقابل iBGP', desc: 'eBGP يربط بين أنظمة مستقلة مختلفة (Autonomous Systems) ويغير الـ Next-Hop افتراضياً ويقلل TTL=1. بينما iBGP يعمل داخل نفس الـ AS وتتطلب شبكته Full-Mesh أو Route Reflectors.' },
      { title: 'سمات المسار (BGP Path Attributes)', desc: 'التحكم الدقيق بالمسار عبر AS_PATH لمنع الحلقات، و Local Preference لتفضيل الخروج، و MED لتفضيل الدخول.' }
    ],
    keyConceptsEn: [
      { title: 'eBGP vs iBGP', desc: 'eBGP connects distinct Autonomous Systems with default TTL=1 and Next-Hop rewrite. iBGP runs inside the same AS requiring Full-Mesh or Route Reflectors.' },
      { title: 'BGP Path Attributes', desc: 'Fine-grained policy control via AS_PATH (loop prevention), Local_Pref (outbound exit preference), and MED (inbound entry preference).' }
    ],
    realWorldAnalogyAr: 'يشبه BGP اتفاقيات الطيران والتجارة الدبلوماسية بين الدول المستقلة وسياسات الجمارك والمعاهدات الدولية: كل دولة (AS) تقرر بمفردها أي طائرات يسمح لها بالعبور في مجالها الجوي، وما هي الرسوم والتفضيلات الوطنية المطبقة.',
    realWorldAnalogyEn: 'BGP operates like international diplomatic civil aviation treaties: each sovereign nation (AS) determines transit rights, airspace entry preferences, and custom import/export policies across foreign borders.'
  },

  STP: {
    id: 'STP',
    name: 'Spanning Tree Protocol (IEEE 802.1D / RSTP 802.1w / MSTP 802.1s)',
    standard: 'IEEE 802.1D (STP) / IEEE 802.1w (Rapid STP) / IEEE 802.1s (MSTP)',
    layer: 'Layer 2 (Data Link)',
    metricEquation: 'Path Cost to Root (10M=100, 100M=19, 1G=4, 10G=2)',
    algorithm: 'Spanning Tree Algorithm (STA) لمنع العواصف الإذاعية وحلقات الطبقة الثانية',
    packetTypes: [
      { name: 'Configuration BPDU', opcode: 'Type 0x00', purposeAr: 'تحديد الـ Root Bridge وتوزيع معلومات المسارات وتعيين أدوار المنافذ', purposeEn: 'Root election, path cost calculation, and port role determination' },
      { name: 'Topology Change Notification (TCN) BPDU', opcode: 'Type 0x80', purposeAr: 'إشعار السويتشات بتغير في طوبولوجيا الشبكة لتسريع مسح جدول العناوين (CAM Flush)', purposeEn: 'Notify switches of topology changes to trigger immediate CAM table flush' }
    ],
    stateMachine: [
      { state: '1. Blocking / Discarding', descAr: 'المنفذ يستقبل BPDUs فقط ولا يرسلها، ولا يتعلم عناوين MAC ولا يمرر بيانات المستخدم لمنع الحلقات.', descEn: 'Port receives BPDUs, drops user frames, and avoids MAC learning to prevent loops.', triggerAr: 'بدء مرحلة الاستماع أو البقاء كمنفذ احتياطي', triggerEn: 'Initial state or chosen as Alternate/Backup port' },
      { state: '2. Listening', descAr: 'المنفذ يرسل ويستقبل BPDUs لمعالجة الطوبولوجيا، ولكن لا يتعلم عناوين MAC (مدتها 15 ثانية).', descEn: 'Port processes BPDUs, no MAC learning, no frame forwarding (15s timer).', triggerAr: 'انقضاء مؤقت Forward Delay', triggerEn: 'Forward Delay timer expiration' },
      { state: '3. Learning', descAr: 'المنفذ يتعلم عناوين MAC ويبني جدول الـ CAM لمنع الفيضان الأولي، ولكن لا يمرر البيانات بعد (15 ثانية).', descEn: 'Port learns source MAC addresses into CAM, no forwarding yet (15s timer).', triggerAr: 'انقضاء مؤقت Forward Delay الثاني', triggerEn: 'Second Forward Delay timer expiration' },
      { state: '4. Forwarding', descAr: 'المنفذ يعمل بكامل طاقته التشغيلية: يرسل ويستقبل البيانات ويتعلم عناوين MAC بصورة طبيعية.', descEn: 'Port fully operational: transmits/receives user data and learns MACs.', triggerAr: 'اكتمال الاستقرار التقاربي (Convergence)', triggerEn: 'Full convergence completed' }
    ],
    headerStructure: [
      { field: 'Protocol ID', bits: '16 bits', descAr: 'معرف البروتوكول (0x0000 لـ IEEE STP)', descEn: 'Protocol Identifier (0x0000 for IEEE STP)' },
      { field: 'Version', bits: '8 bits', descAr: 'إصدار STP (0=802.1D, 2=802.1w RSTP, 3=802.1s MST)', descEn: 'Protocol version number' },
      { field: 'BPDU Type', bits: '8 bits', descAr: 'نوع الـ BPDU (0x00 Configuration, 0x80 TCN)', descEn: 'BPDU type flag' },
      { field: 'Root Bridge ID (RBID)', bits: '8 Bytes (64 bits)', descAr: 'معرف الـ Root (Priority 2 Bytes + MAC Address 6 Bytes)', descEn: 'Root Bridge ID (Priority + MAC)' },
      { field: 'Root Path Cost', bits: '32 bits', descAr: 'التكلفة الإجمالية للوصول إلى الـ Root Bridge', descEn: 'Cumulative path cost to Root' },
      { field: 'Sender Bridge ID', bits: '8 Bytes (64 bits)', descAr: 'معرف السويتش الذي أرسل هذه الـ BPDU', descEn: 'Bridge ID of transmitting switch' },
      { field: 'Port ID', bits: '16 bits', descAr: 'معرف المنفذ (Priority + Port Number)', descEn: 'Port priority and number' },
      { field: 'Timers', bits: '6 Bytes', descAr: 'مؤقتات Hello (2s), MaxAge (20s), Forward Delay (15s)', descEn: 'Hello, Max Age, and Forward Delay timers' }
    ],
    ciscoShowCommands: [
      'show spanning-tree',
      'show spanning-tree root',
      'show spanning-tree summary',
      'show spanning-tree interface detail'
    ],
    ciscoConfigSnippet: `spanning-tree mode rapid-pvst
spanning-tree vlan 10,20 root primary
spanning-tree portfast default
spanning-tree bpduguard enable`,
    keyConceptsAr: [
      { title: 'معايير انتخاب الـ Root Bridge', desc: 'السويتش صاحب الـ Bridge ID الأقل على الإطلاق هو الفائز (أقل Bridge Priority ثم أقل MAC Address عند التساوي).' },
      { title: 'أدوار المنافذ (Port Roles)', desc: 'الـ Root Port المنفذ الأقرب للـ Root، والـ Designated Port المنفذ الأفضل على كل رابط، والـ Alternate Port المنفذ المعطل لمنع الحلقات.' }
    ],
    keyConceptsEn: [
      { title: 'Root Bridge Election Criteria', desc: 'Switch with lowest Bridge ID wins (lowest Priority, then lowest MAC address on tie).' },
      { title: 'Port Roles', desc: 'Root Port (closest to Root on non-root bridge), Designated Port (best port on each segment), and Alternate Port (blocked to break loops).' }
    ],
    realWorldAnalogyAr: 'يشبه STP نظام صمامات الأمان الآلية في شبكات الأنابيب المغلقة: إذا كان هناك مسار دائري قد يسبب ارتداداً وانفجاراً في الضغط (Broadcast Storm يدمر الشبكة في ثوانٍ)، يقوم الصمام الذكي بإغلاق أحد المنافذ مؤقتاً وتركه في وضع الاستعداد السريع للفتح فوراً إذا انقطع المسار الأساسي.',
    realWorldAnalogyEn: 'STP acts like automatic pressure safety bypass valves in an industrial pipeline network: when a loop could cause infinite resonance (Broadcast Storm), the smart valve closes one redundant branch, standing by to open instantly on failure.'
  },

  TCP: {
    id: 'TCP',
    name: 'Transmission Control Protocol (TCP 3-Way Handshake & Flow Control)',
    standard: 'RFC 793 / RFC 9293',
    layer: 'Layer 4 (Transport) - Protocol 6',
    adminDistance: 0,
    metricEquation: 'RTT / RTO Estimation & Sliding Window Buffer Size (Bandwidth-Delay Product)',
    algorithm: 'Sliding Window, Jacobson Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit)',
    packetTypes: [
      { name: 'SYN', opcode: 'Flag 0x02', purposeAr: 'طلب بدء الاتصال ومزامنة أرقام التسلسل الأولية (ISN)', purposeEn: 'Synchronize sequence numbers and initiate connection' },
      { name: 'SYN-ACK', opcode: 'Flags 0x12', purposeAr: 'الموافقة على الطلب وإرسال رقم تسلسل السيرفر وتأكيد رقم العميل', purposeEn: 'Acknowledge client SYN and send server sequence number' },
      { name: 'ACK', opcode: 'Flag 0x10', purposeAr: 'تأكيد استلام البيانات بنجاح', purposeEn: 'Acknowledge received segments' },
      { name: 'FIN', opcode: 'Flag 0x01', purposeAr: 'طلب إنهاء الجلسة بلباقة ودون فقدان بيانات', purposeEn: 'Graceful connection termination request' },
      { name: 'RST', opcode: 'Flag 0x04', purposeAr: 'إعادة ضبط أو قطع فوري للاتصال عند رفض المنفذ', purposeEn: 'Immediate connection abort / reset' }
    ],
    stateMachine: [
      { state: '1. CLOSED / LISTEN', descAr: 'السيرفر يستمع على المنفذ المخصص (مثل 80 أو 443) بانتظار اتصالات جديدة.', descEn: 'Server socket is listening for incoming client connection requests.', triggerAr: 'العميل يرسل حزمة SYN', triggerEn: 'Client transmits SYN packet' },
      { state: '2. SYN_SENT', descAr: 'العميل أرسل حزمة SYN وينتظر رد السيرفر بالـ SYN-ACK.', descEn: 'Client sent SYN; waiting for matching SYN-ACK from server.', triggerAr: 'استلام رد السيرفر SYN-ACK', triggerEn: 'Server SYN-ACK received' },
      { state: '3. SYN_RCVD', descAr: 'السيرفر استلم الـ SYN ورد بـ SYN-ACK وينتظر الـ ACK الأخير من العميل.', descEn: 'Server received SYN, replied with SYN-ACK, waiting for final ACK.', triggerAr: 'استلام ACK العميل', triggerEn: 'Final client ACK arrives' },
      { state: '4. ESTABLISHED', descAr: 'الاتصال مكتمل بنجاح ويمكن تبادل البيانات بتدفق موثوق وبأعلى كفاءة.', descEn: 'Connection open; bidirectional reliable data stream in progress.', triggerAr: 'أحد الطرفين يرسل حزمة FIN لإغلاق الاتصال', triggerEn: 'Either endpoint initiates teardown via FIN' },
      { state: '5. FIN_WAIT_1 / CLOSE_WAIT', descAr: 'بدء مراحل الإغلاق الرباعية (4-Way Teardown). الطرف المغلق ينتظر تأكيد الـ FIN.', descEn: 'Teardown initiated; acknowledging active and passive closure states.', triggerAr: 'تبادل حزم الـ ACK والـ FIN بين الطرفين', triggerEn: 'Exchange of remaining ACKs and FINs' },
      { state: '6. TIME_WAIT (2MSL)', descAr: 'الانتظار لمدة ضعفي عمر الحزمة (2x Maximum Segment Lifetime) لضمان عدم وجود حزم ضالة في الشبكة.', descEn: 'Waiting 2xMSL to ensure final ACK was received and old packets flush out.', triggerAr: 'انقضاء المؤقت والعودة لحالة CLOSED', triggerEn: '2MSL timer expiration returning to CLOSED' }
    ],
    headerStructure: [
      { field: 'Source Port', bits: '16 bits', descAr: 'منفذ المصدر العشوائي للجلسة (Ephemeral Port)', descEn: 'Originating port number' },
      { field: 'Destination Port', bits: '16 bits', descAr: 'منفذ الخدمة المستهدفة (مثل 80 HTTP أو 443 HTTPS)', descEn: 'Destination service port' },
      { field: 'Sequence Number', bits: '32 bits', descAr: 'رقم تسلسل البايت الحالي لترتيب البيانات بدقة', descEn: '32-bit sequence tracking number' },
      { field: 'Acknowledgment Number', bits: '32 bits', descAr: 'رقم البايت القادم المتوقع استلامه', descEn: 'Next expected byte sequence' },
      { field: 'Data Offset & Flags', bits: '16 bits', descAr: 'طول الترويسة ورايات التحكم (URG, ACK, PSH, RST, SYN, FIN)', descEn: 'Header length and control flags' },
      { field: 'Window Size', bits: '16 bits', descAr: 'سعة الذاكرة المؤقتة (Buffer) المتبقية للتحكم في التدفق', descEn: 'Flow control sliding window capacity' },
      { field: 'Checksum', bits: '16 bits', descAr: 'التحقق الرياضي الشامل من صحة البيانات والترويسة', descEn: 'Data and header integrity check' }
    ],
    ciscoShowCommands: [
      'show tcp brief',
      'show tcp statistics',
      'show sockets'
    ],
    ciscoConfigSnippet: `ip tcp synwait-time 10
ip tcp window-size 65535
ip tcp path-mtu-discovery`,
    keyConceptsAr: [
      { title: 'المصافحة الثلاثية (3-Way Handshake)', desc: 'تأسيس الاتصال ومزامنة أرقام التسلسل عبر تتابع حزم SYN -> SYN-ACK -> ACK.' },
      { title: 'نافذة التدفق المتزلجة (Sliding Window)', desc: 'تمكين المستقبل من ضبط سرعة الإرسال ديناميكياً لتجنب إغراق ذاكرة التخزين المؤقت.' }
    ],
    keyConceptsEn: [
      { title: '3-Way Handshake', desc: 'Connection establishment via SYN -> SYN-ACK -> ACK synchronizing initial sequence numbers.' },
      { title: 'Sliding Window Flow Control', desc: 'Receiver dynamically advertises buffer space to prevent buffer overrun and dropped segments.' }
    ],
    realWorldAnalogyAr: 'يشبه TCP مكالمة هاتفية رسمية مسجلة وموثقة: ترفع السماعة وتقول "ألو هل تسمعني؟" (SYN)، يرد الآخر "نعم أسمعك، هل تسمعني أنت؟" (SYN-ACK)، فترد "نعم أسمعك بوضوح فلنبدأ الحديث" (ACK). وكل كلمة تقال يتم تأكيد استلامها قبل الانتقال للنقطة التالية.',
    realWorldAnalogyEn: 'TCP operates like a registered diplomatic phone call: Speaker A says "Hello, can you hear me?" (SYN), Speaker B responds "Yes I hear you, can you hear me?" (SYN-ACK), Speaker A confirms "Yes loud and clear, let us proceed" (ACK).'
  },

  ARP: {
    id: 'ARP',
    name: 'Address Resolution Protocol (IPv4 ARP & Gratuitous ARP)',
    standard: 'RFC 826 / RFC 5227',
    layer: 'Layer 2/3 Boundary Protocol - EtherType 0x0806',
    adminDistance: 0,
    metricEquation: 'Direct Hardware Mapping Table (IP to 48-bit MAC Cache)',
    algorithm: 'Broadcast Request Resolution to Unicast Response Mapping',
    packetTypes: [
      { name: 'ARP Request', opcode: '0x0001 (Broadcast)', purposeAr: 'الاستفسار عن عنوان MAC المقابل لعنوان IP معين عبر البث العام FF:FF:FF:FF:FF:FF', purposeEn: 'Broadcast query requesting MAC address for target IPv4 address' },
      { name: 'ARP Reply', opcode: '0x0002 (Unicast)', purposeAr: 'رد الجهاز المستهدف بعنوان الـ MAC الفيزيائي الخاص به مباشرة للمرسل', purposeEn: 'Unicast response delivering target physical MAC address' },
      { name: 'Gratuitous ARP (GARP)', opcode: '0x0001/2', purposeAr: 'إعلان الجهاز عن عنوان الـ IP/MAC الخاص به لتحديث جداول الجيران واكتشاف تضارب الـ IP', purposeEn: 'Self-announcement to update neighbor caches and detect IP address collisions' },
      { name: 'Proxy ARP', opcode: '0x0002', purposeAr: 'رد الراوتر بماك أدرسه نيابة عن جهاز في شبكة أخرى لتسهيل التوجيه', purposeEn: 'Router replies with its own MAC on behalf of remote subnet target' }
    ],
    stateMachine: [
      { state: '1. Cache Empty (Miss)', descAr: 'الجهاز يريد إرسال حزمة لكنه لا يملك عنوان MAC الوجهة في جدول الـ ARP Table.', descEn: 'Outbound IP packet queued; target MAC address missing from local ARP table.', triggerAr: 'بناء حزمة ARP Request وإرسالها كبث عام', triggerEn: 'Construct and broadcast ARP Request' },
      { state: '2. Broadcast In Flight', descAr: 'الفريم ينتشر في جميع منافذ السويتش (Broadcast Domain) ويصل لكل كروت الشبكة بالـ VLAN.', descEn: 'Frame floods across switch broadcast domain to all segment endpoints.', triggerAr: 'كل جهاز يفحص الـ Target IP بحزمته', triggerEn: 'Endpoints inspect Target IP field' },
      { state: '3. Target Identified', descAr: 'الأجهزة غير المعنية تتجاهل الطلب، بينما الجهاز صاحب الـ IP المطابق يجهّز رداً أحادياً.', descEn: 'Non-matching hosts drop request; owner prepares unicast ARP Reply.', triggerAr: 'إرسال ARP Reply محتوياً على MAC الجهاز', triggerEn: 'Transmit unicast ARP Reply' },
      { state: '4. Entry Resolved & Cached', descAr: 'المرسل يستلم الرد، يسجل الربط (IP <-> MAC) في جدول الـ ARP Cache، ويبدأ إرسال البيانات.', descEn: 'Sender caches dynamic MAC mapping and releases buffered data frame.', triggerAr: 'بدء مؤقت الصلاحية (ARP Aging Timer - عادة 4 ساعات في سيسكو)', triggerEn: 'Start dynamic ARP aging timer' },
      { state: '5. Aging & Timeout Flush', descAr: 'إذا لم يتم استخدام السجل لفترة زمنية طويلة، يتم حذفه تلقائياً لتحرير الذاكرة وتفادي العناوين القديمة.', descEn: 'Idle mapping expires and flushes from table to ensure fresh address binding.', triggerAr: 'طلب جديد عند الحاجة لإعادة الاستعلام', triggerEn: 'New outbound packet triggers fresh resolution' }
    ],
    headerStructure: [
      { field: 'Hardware Type (HTYPE)', bits: '16 bits', descAr: 'نوع الشبكة الفيزيائية (1 = Ethernet)', descEn: 'Hardware protocol type (1 = Ethernet)' },
      { field: 'Protocol Type (PTYPE)', bits: '16 bits', descAr: 'بروتوكول الطبقة الثالثة (0x0800 = IPv4)', descEn: 'Internetwork protocol (0x0800 = IPv4)' },
      { field: 'Hardware & Protocol Size', bits: '16 bits', descAr: 'طول عنوان MAC (6 بايت) وعنوان IP (4 بايت)', descEn: 'MAC length (6 octets) and IP length (4 octets)' },
      { field: 'Opcode', bits: '16 bits', descAr: 'رمز العملية (1=Request, 2=Reply, 3=RARP Request, 4=RARP Reply)', descEn: 'Operation code' },
      { field: 'Sender MAC & IP', bits: '10 Bytes', descAr: 'عنوان MAC وعنوان IP للجهاز الذي أرسل الطلب', descEn: 'Originating hardware and logical addresses' },
      { field: 'Target MAC & IP', bits: '10 Bytes', descAr: 'عنوان MAC المستهدف (أصفار في الطلب) وعنوان IP المستهدف', descEn: 'Target hardware and logical addresses' }
    ],
    ciscoShowCommands: [
      'show ip arp',
      'clear ip arp',
      'show mac address-table'
    ],
    ciscoConfigSnippet: `interface GigabitEthernet0/1
 ip proxy-arp
 arp timeout 14400`,
    keyConceptsAr: [
      { title: 'الربط بين المنطقي والفيزيائي', desc: 'تحويل عناوين IP المنطقية (Layer 3) إلى عناوين MAC الفيزيائية (Layer 2) اللازمة لنقل الفريم عبر كابل الشبكة.' },
      { title: 'حماية Dynamic ARP Inspection (DAI)', desc: 'ميزة أمان في السويتش لمنع هجمات التسميم (ARP Poisoning / Man-In-The-Middle) عبر فحص مطابقة العناوين مع جدول DHCP Snooping.' }
    ],
    keyConceptsEn: [
      { title: 'Logical to Physical Binding', desc: 'Resolving Layer 3 IPv4 addresses to Layer 2 48-bit MAC addresses required for Ethernet framing.' },
      { title: 'Dynamic ARP Inspection (DAI)', desc: 'Switch security feature validating ARP replies against DHCP snooping binding table to block ARP poisoning.' }
    ],
    realWorldAnalogyAr: 'يشبه ARP موظفاً ينادي بالميكروفون في صالة مطار مزدحمة: "يا ركاب الرحلة، من منكم هو السيد محمد صاحب الجواز رقم 192.168.1.50؟"، فيسمع الجميع النداء ولكن السيد محمد وحده هو من يتقدم ويبرز بطاقة هويته الشخصية (MAC Address).',
    realWorldAnalogyEn: 'ARP is like an airport gate announcement: "Will passenger Ahmed with ticket 192.168.1.50 please identify himself?", everyone hears the broadcast, but only Ahmed steps up with his physical passport (MAC Address).'
  },

  DHCP: {
    id: 'DHCP',
    name: 'Dynamic Host Configuration Protocol (DHCP DORA & Relay Agent)',
    standard: 'RFC 2131 / RFC 3046 (Option 82)',
    layer: 'Layer 7 (Application) - UDP Ports 67 (Server) & 68 (Client)',
    adminDistance: 0,
    metricEquation: 'IP Pool Lease Time & Subnet Scope Allocation',
    algorithm: 'DORA 4-Way State Handshake with Lease Timers (T1 Renew at 50%, T2 Rebind at 87.5%)',
    packetTypes: [
      { name: 'DHCP Discover', opcode: 'BootRequest', purposeAr: 'بث عام من العميل للبحث عن سيرفر DHCP متاح في الشبكة', purposeEn: 'Client broadcast seeking available DHCP servers' },
      { name: 'DHCP Offer', opcode: 'BootReply', purposeAr: 'عرض من السيرفر يتضمن عنوان IP وقناع الشبكة والافتراضي ومدة الإيجار', purposeEn: 'Server unicast/broadcast offering reserved IP configuration' },
      { name: 'DHCP Request', opcode: 'BootRequest', purposeAr: 'طلب رسمي من العميل لقبول العرض وحجز العنوان رسمياً', purposeEn: 'Client formal request accepting selected offer' },
      { name: 'DHCP ACK', opcode: 'BootReply', purposeAr: 'تأكيد السيرفر النهائي وتفعيل إيجار العنوان وتسجيله في قاعدة البيانات', purposeEn: 'Server final acknowledgment finalizing IP lease' },
      { name: 'DHCP NAK / Release', opcode: 'Control', purposeAr: 'رفض العنوان (NAK) أو تحريره طوعاً عند إيقاف التشغيل (Release)', purposeEn: 'Lease rejection or voluntary lease relinquishment' }
    ],
    stateMachine: [
      { state: '1. Init (Discover)', descAr: 'العميل بلا عنوان IP (0.0.0.0)، يرسل حزمة DHCP Discover كبث عام إلى 255.255.255.255.', descEn: 'Client unconfigured (0.0.0.0) broadcasts Discover to 255.255.255.255:67.', triggerAr: 'استلام السيرفر للطلب وفحص نطاق العناوين (Pool)', triggerEn: 'DHCP server receives broadcast and evaluates address pool' },
      { state: '2. Selecting (Offer)', descAr: 'السيرفرات المتاحة ترد بحزم DHCP Offer مقترحة عنوان IP مؤقت وإعدادات DNS والبوابة.', descEn: 'Servers respond with Offer proposing available IP, gateway, and DNS.', triggerAr: 'العميل يختار العرض الأول ويرسل DHCP Request', triggerEn: 'Client selects first offer and transmits formal Request' },
      { state: '3. Requesting', descAr: 'العميل يرسل DHCP Request يعلن فيه قبوله لعرض سيرفر محدد، مما يتيح للسيرفرات الأخرى تحرير عروضها.', descEn: 'Client broadcasts Request identifying chosen server so others release reserves.', triggerAr: 'السيرفر المختار يعالج الطلب', triggerEn: 'Selected server commits lease record' },
      { state: '4. Bound (ACK)', descAr: 'السيرفر يرسل DHCP ACK. العميل يضبط عنوان الـ IP ويبدأ مؤقت الإيجار (Lease Duration).', descEn: 'Server delivers ACK; client configures NIC and starts lease timers.', triggerAr: 'انقضاء 50% من مدة الإيجار (مؤقت T1)', triggerEn: 'T1 timer expires at 50% lease duration' },
      { state: '5. Renewing (T1 - 50%)', descAr: 'العميل يرسل DHCP Request أحادي (Unicast) لنفس السيرفر لتجديد الإيجار دون انقطاع الخدمة.', descEn: 'Client sends unicast Request to lease-granting server to extend duration.', triggerAr: 'إذا لم يرد السيرفر وانقضى 87.5% (مؤقت T2)', triggerEn: 'If no reply and T2 timer expires at 87.5%' },
      { state: '6. Rebinding (T2 - 87.5%)', descAr: 'العميل يبث DHCP Request كبث عام بحثاً عن أي سيرفر DHCP آخر لتجديد العنوان قبل انتهاء الصلاحية.', descEn: 'Client broadcasts Request to ANY reachable DHCP server to preserve connectivity.', triggerAr: 'انتهاء كامل مدة الإيجار دون تجديد يعيد الجهاز لـ Init', triggerEn: 'Full lease expiration drops IP and returns to Init' }
    ],
    headerStructure: [
      { field: 'Message Type (Op)', bits: '8 bits', descAr: '1 = BootRequest (من العميل), 2 = BootReply (من السيرفر)', descEn: 'Message operation code' },
      { field: 'Transaction ID (XID)', bits: '32 bits', descAr: 'رقم عشوائي لمطابقة طلبات وعروض العميل', descEn: 'Random transaction identifier' },
      { field: 'Client IP (ciaddr)', bits: '32 bits', descAr: 'عنوان الـ IP الحالي للعميل (0.0.0.0 في البداية)', descEn: 'Current client IP address' },
      { field: 'Your IP (yiaddr)', bits: '32 bits', descAr: 'عنوان الـ IP الممنوح للعميل من السيرفر', descEn: 'IP address assigned to client' },
      { field: 'Server IP & Gateway', bits: '64 bits', descAr: 'عناوين سيرفر DHCP والـ Relay Agent', descEn: 'Server and relay agent IP addresses' },
      { field: 'Client Hardware (chaddr)', bits: '16 Bytes', descAr: 'عنوان MAC الفيزيائي لكارت شبكة العميل', descEn: 'Client hardware MAC address' },
      { field: 'Options & Magic Cookie', bits: 'Variable', descAr: 'خيارات التكوين (Subnet Mask, Router Gateway, DNS Servers, Domain Name)', descEn: 'Vendor options (Option 3 Gateway, Option 6 DNS, Option 82 Relay)' }
    ],
    ciscoShowCommands: [
      'show ip dhcp binding',
      'show ip dhcp pool',
      'show ip dhcp server statistics',
      'show ip dhcp snooping'
    ],
    ciscoConfigSnippet: `ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp pool FINANCE_USERS
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8 1.1.1.1
 lease 7`,
    keyConceptsAr: [
      { title: 'دورة حياة الـ DORA الرباعية', desc: 'مراحل الحصول على العنوان: Discover (بث عام) -> Offer (عرض السيرفر) -> Request (طلب العميل) -> Acknowledgment (التأكيد النهائي).' },
      { title: 'وكيل الترحيل (DHCP Relay Agent / IP Helper)', desc: 'تحويل حزم البث العام (Broadcast) إلى حزم أحادية (Unicast) لنقل طلبات DHCP عبر الراوتر إلى خادم مركزي في شبكة أخرى.' }
    ],
    keyConceptsEn: [
      { title: 'DORA 4-Way Handshake', desc: 'Discover (broadcast) -> Offer (server proposal) -> Request (client acceptance) -> ACK (lease confirmation).' },
      { title: 'DHCP Relay Agent (ip helper-address)', desc: 'Converts client UDP broadcasts to unicast to cross routed boundaries to centralized enterprise DHCP servers.' }
    ],
    realWorldAnalogyAr: 'يشبه DHCP مكتب استئجار سيارات في المطار: تصل بدون سيارة (Discover)، يعرض عليك الموظف سيارة متاحة بالمفتاح (Offer)، تقول له "نعم أوافق على هذه السيارة وسأدفع الإيجار" (Request)، فيسلمك المفتاح ويسجل العقد في السجل الرسمي (ACK).',
    realWorldAnalogyEn: 'DHCP operates like an airport car rental desk: you arrive on foot (Discover), the agent presents an available vehicle and rate (Offer), you sign the rental agreement (Request), and the clerk issues keys and stamps the contract (ACK).'
  },

  VXLAN: {
    id: 'VXLAN',
    name: 'Virtual Extensible LAN (VXLAN Overlays & EVPN Data Plane)',
    standard: 'RFC 7348 (VXLAN) / RFC 8365 (BGP-EVPN)',
    layer: 'Layer 2 over Layer 4 UDP Encapsulation (UDP Port 4789)',
    metricEquation: '24-bit VNI (16 Million Segments) over IP Underlay MTU >= 1550 bytes',
    algorithm: 'MAC-in-UDP Overlay Encapsulation with BGP EVPN Control Plane',
    packetTypes: [
      { name: 'VXLAN Encapsulated Frame', opcode: 'UDP 4789', purposeAr: 'تغليف فريم الـ Layer 2 الداخلي بالكامل داخل ترويسة UDP و IP للنقل عبر شبكة الطبقة الثالثة', purposeEn: 'Encapsulate inner L2 Ethernet frame inside outer IP/UDP datagram' },
      { name: 'EVPN Type 2 (MAC/IP Route)', opcode: 'BGP EVPN', purposeAr: 'إعلان عناوين الـ MAC والـ IP للمستخدمين عبر BGP دون الحاجة لفيضان الـ Flooding', purposeEn: 'Control-plane host MAC and IP advertisement suppressing data-plane flooding' },
      { name: 'EVPN Type 3 (Inclusive Multicast)', opcode: 'BGP EVPN', purposeAr: 'تأسيس مسارات النقل للبيانات الموجهة للكل (BUM Traffic Replication)', purposeEn: 'Auto-discovery of VTEPs and multi-destination tunnel mesh' }
    ],
    stateMachine: [
      { state: '1. Ingress VTEP Ingestion', descAr: 'وصول فريم عادي من السيرفر أو المستخدم إلى منفذ السويتش (Access Port / VLAN).', descEn: 'Standard L2 Ethernet frame arrives at access switch interface.', triggerAr: 'مطابقة الـ VLAN مع الـ VNI المخصص', triggerEn: 'VLAN-to-VNI mapping lookup' },
      { state: '2. Header Encapsulation (Encap)', descAr: 'إضافة ترويسة VXLAN (8 بايت تحتوي على VNI 24-bit)، ثم ترويسة UDP منفذ 4789، ثم ترويسة IP الخارجية للمسار.', descEn: 'Prepend VXLAN header (24-bit VNI), outer UDP header (port 4789), and outer IP Underlay header.', triggerAr: 'تحديد عنوان VTEP الوجهة عبر جدول EVPN', triggerEn: 'Destination VTEP resolved in BGP routing table' },
      { state: '3. Underlay Transport (ECMP)', descAr: 'الحزمة تنتقل عبر شبكة الـ Spine-and-Leaf كحزمة IP/UDP عادية باستخدام التوزيع المتساوي ECMP.', descEn: 'Packet routed across Spine-Leaf fabric as regular L3 UDP datagram using ECMP.', triggerAr: 'وصول الحزمة إلى الـ Leaf المقابل (Egress VTEP)', triggerEn: 'Arrival at egress VTEP leaf switch' },
      { state: '4. Egress Decapsulation (Decap)', descAr: 'فك ترويسات الـ IP والـ UDP والـ VXLAN واستخراج فريم الإيثرنت الأصلي الداخلي.', descEn: 'Strip outer IP/UDP/VXLAN headers and retrieve pristine inner L2 frame.', triggerAr: 'تحديد المنفذ المحلي وتمرير الفريم', triggerEn: 'Forward extracted frame to target endpoint interface' }
    ],
    headerStructure: [
      { field: 'VXLAN Flags', bits: '8 bits', descAr: 'رايات التحكم (I-bit = 1 للدلالة على وجود VNI صالح)', descEn: 'Control flags (I-flag set for valid VNI)' },
      { field: 'Reserved Fields', bits: '24 bits', descAr: 'حقول محجوزة للاستخدام المستقبلي', descEn: 'Reserved bits' },
      { field: 'VXLAN Network Identifier (VNI)', bits: '24 bits', descAr: 'معرف الشبكة الافتراضية (يسمح بـ 16,777,216 شبكة معزولة بدلاً من 4096 في VLAN)', descEn: '24-bit Segment ID enabling up to 16M isolated virtual networks' },
      { field: 'Reserved', bits: '8 bits', descAr: 'حقل محجوز تكميلي', descEn: 'Reserved octet' }
    ],
    ciscoShowCommands: [
      'show nve interface detail',
      'show nve peers',
      'show nve vni',
      'show bgp l2vpn evpn'
    ],
    ciscoConfigSnippet: `interface nve1
 no shutdown
 host-reachability protocol bgp
 source-interface Loopback0
 member vni 10010
  suppress-arp
  ingress-replication protocol bgp`,
    keyConceptsAr: [
      { title: 'توسيع نطاق الشبكات (16M VNIs)', desc: 'استبدال قيود VLAN الـ 4094 بـ 16 مليون شبكة مستقلة تتيح عزل المستأجرين في السحابة ومراكز البيانات.' },
      { title: 'التحكم بواسطة BGP EVPN', desc: 'القضاء على ظاهرة الفيضان والـ Flooding وتحويل تعلم عناوين MAC من Data Plane إلى Control Plane آمن وموثوق.' }
    ],
    keyConceptsEn: [
      { title: 'Massive Scalability (16M VNIs)', desc: 'Overcomes legacy 4094 VLAN ceiling, providing 16.7M tenant segments for multi-tenant cloud datacenters.' },
      { title: 'BGP EVPN Control Plane', desc: 'Eliminates flood-and-learn by converting MAC/IP discovery into secure MP-BGP route distribution.' }
    ],
    realWorldAnalogyAr: 'يشبه VXLAN إرسال طرد داخل سيارة شحن دبلوماسية مصفحة: الرسالة الداخلية مكتوبة بلغة محلية عادية (فريم L2)، لكنها توضع داخل صندوق بريد دولي قياسي موثوق (حزمة UDP/IP) تسير على أسرع الطرق السريعة (Underlay) دون أن يعلم السائق محتوى الطرد الداخلي!',
    realWorldAnalogyEn: 'VXLAN operates like diplomatic courier logistics: a local handwritten memo (inner L2 frame) is sealed inside a standardized international postal parcel (outer IP/UDP) and delivered across national expressways (Underlay).'
  },

  LISP: {
    id: 'LISP',
    name: 'Locator/ID Separation Protocol (LISP Control Plane for SD-Access)',
    standard: 'RFC 6830 / RFC 9300',
    layer: 'Layer 3 Routing Architecture & Control Plane (UDP Port 4341 / 4342)',
    metricEquation: 'Endpoint Identifier (EID) mapped to Routing Locator (RLOC) with Priority/Weight',
    algorithm: 'Map-and-Encap Resolution Architecture replacing traditional push routing',
    packetTypes: [
      { name: 'Map-Request', opcode: 'Type 1', purposeAr: 'استعلام من الـ ITR إلى الـ Map-Server عن مكان تواجد الجهاز (RLOC المقابل للـ EID)', purposeEn: 'Query to Map-Server/Map-Resolver requesting RLOC mapping for target EID' },
      { name: 'Map-Reply', opcode: 'Type 2', purposeAr: 'رد موثوق من الـ ETR يوضح عنوان الـ RLOC الحالي للجهاز مع الوزن والأولوية', purposeEn: 'Authoritative reply returning current locator (RLOC) for requested EID' },
      { name: 'Map-Register', opcode: 'Type 3', purposeAr: 'تسجيل الـ ETR لأجهزة المستخدمين التابعة له لدى الـ Map-Server المركزي', purposeEn: 'ETR registers local endpoint identifiers with authoritative Map-Server' }
    ],
    stateMachine: [
      { state: '1. Endpoint Discovery', descAr: 'انضمام جهاز مستخدم جديد (EID) للشبكة وحصوله على IP.', descEn: 'Endpoint connects to edge switch and acquires host IP (EID).', triggerAr: 'السويتش يسجل الجهاز في جدول LISP المحلي', triggerEn: 'Edge switch registers host into LISP table' },
      { state: '2. Map-Registration', descAr: 'الـ Ingress/Egress Tunnel Router (ITR/ETR) يرسل Map-Register مشفر للـ Map-Server.', descEn: 'ETR registers EID-to-RLOC binding with Map-Server.', triggerAr: 'الموافقة وتحديث قاعدة بيانات التعيين (Map-DB)', triggerEn: 'Map-Server confirms and updates mapping database' },
      { state: '3. On-Demand Map-Request', descAr: 'جهاز يريد التحدث مع وجهة غير معروفة. الـ ITR يرسل Map-Request للـ Map-Resolver.', descEn: 'Traffic initiated to remote host; ITR queries Map-Resolver for target RLOC.', triggerAr: 'استلام Map-Reply وبناء نفق التغليف', triggerEn: 'Map-Reply returned and tunnel cache established' },
      { state: '4. Direct Data Encapsulation', descAr: 'البيانات تتدفق مباشرة من RLOC المرسل إلى RLOC المستقبل دون المرور بالـ Map-Server.', descEn: 'Data packets encapsulated (LISP/UDP 4341) and forwarded directly point-to-point.', triggerAr: 'تنقل الجهاز لمبنى آخر (Host Mobility)', triggerEn: 'Endpoint roams to new location triggering Dynamic EID move' }
    ],
    headerStructure: [
      { field: 'LISP Flags (N, L, E, V, I)', bits: '8 bits', descAr: 'رايات التحكم (مثل Echo-Nonce و Instance ID)', descEn: 'Control flags and Instance ID indicator' },
      { field: 'Nonce', bits: '24 bits', descAr: 'رقم عشوائي للتحقق الأمني من الردود ومطابقة الجلسات', descEn: '24-bit random security nonce' },
      { field: 'Instance ID (IID / VRF)', bits: '24 bits', descAr: 'معرف الـ VRF لعزل الشبكات الافتراضية', descEn: '24-bit virtual routing forwarding instance identifier' },
      { field: 'LSB (Locator Status Bits)', bits: '8 bits', descAr: 'حالة الروابط والمحددات النشطة', descEn: 'Locator reachability status bits' }
    ],
    ciscoShowCommands: [
      'show lisp site',
      'show lisp map-cache',
      'show lisp database',
      'show ip lisp'
    ],
    ciscoConfigSnippet: `router lisp
 database-mapping 10.10.10.0/24 192.168.100.1 priority 1 weight 100
 ipv4 map-server
 ipv4 map-resolver
 ipv4 itr
 ipv4 etr`,
    keyConceptsAr: [
      { title: 'فصل الهوية عن الموقع الجغرافي', desc: 'عنوان الـ EID يعبر عن "من أنت"، بينما عنوان الـ RLOC يعبر عن "أين أنت متصل الآن". يسمح بتنقل الأجهزة بحرية دون تغيير IP.' },
      { title: 'نموذج Pull-On-Demand', desc: 'الراوترات تطلب فقط المسارات التي تحتاجها حالياً بدلاً من تخزين ملايين المسارات في الذاكرة.' }
    ],
    keyConceptsEn: [
      { title: 'Identity / Location Separation', desc: 'EID identifies "Who" the host is, while RLOC specifies "Where" it attaches to the topology, enabling seamless mobility.' },
      { title: 'Pull-on-Demand Scaling', desc: 'Routers query mapping servers only for active traffic destinations rather than carrying full Internet topology.' }
    ],
    realWorldAnalogyAr: 'يشبه LISP خدمة شريحة الهاتف مع نظام الـ GPS العالمي: رقم هاتفك (EID) لا يتغير أينما سافرت في العالم، لكن برج الاتصالات الذي تتصل به حالياً (RLOC) يتغير باستمرار، والسنترال المركزي (Map-Server) يعرف فوراً برجك الحالي لتوجيه المكالمة إليك بدقة!',
    realWorldAnalogyEn: 'LISP operates like mobile cellular roaming: your phone number (EID) remains identical everywhere, while the base station tower you are linked to (RLOC) changes dynamically, tracked by the central registry (Map-Server).'
  },

  MPLS_LDP: {
    id: 'MPLS_LDP',
    name: 'Multiprotocol Label Switching & LDP (MPLS LDP / Segment Routing)',
    standard: 'RFC 3031 (MPLS Architecture) / RFC 5036 (LDP Specification)',
    layer: 'Layer 2.5 (Shim Label Header) - TCP/UDP Port 646',
    adminDistance: 0,
    metricEquation: 'Label Forwarding Information Base (LFIB) Ingress Push -> Swap -> Egress Pop (PHP)',
    algorithm: 'Label Switched Path (LSP) Forwarding via Label Distribution Protocol',
    packetTypes: [
      { name: 'LDP Hello', opcode: 'UDP 646', purposeAr: 'اكتشاف أجهزة MPLS المجاورة عبر البث المتعدد 224.0.0.2', purposeEn: 'Discover neighboring LSRs via multicast 224.0.0.2' },
      { name: 'LDP Initialization', opcode: 'TCP 646', purposeAr: 'التفاوض على جلسة LDP ومعايير توزيع التسميات عبر TCP', purposeEn: 'Negotiate LDP session parameters and label distribution mode' },
      { name: 'LDP Label Mapping', opcode: 'TCP 646', purposeAr: 'الإعلان عن التسميات (Labels) المرتبطة بالبادئات والشبكات (FEC)', purposeEn: 'Advertise label-to-FEC bindings between LSR routers' }
    ],
    stateMachine: [
      { state: '1. Non-Existent / Down', descAr: 'المنفذ مهيأ لـ MPLS لكن لم يتم اكتشاف أي جار حتى الآن.', descEn: 'LDP process initialized; awaiting neighbor Hellos.', triggerAr: 'إرسال LDP Hello على UDP 646', triggerEn: 'Transmit periodic LDP Hellos' },
      { state: '2. Initialized', descAr: 'تم اكتشاف الجار وفتح جلسة TCP على المنفذ 646 لبدء التفاوض.', descEn: 'Neighbor discovered; TCP transport session connection open.', triggerAr: 'تبادل حزم LDP Init الرسائل', triggerEn: 'Exchange LDP Initialization messages' },
      { state: '3. Operational', descAr: 'جلسة LDP نشطة ومكتملة، ويتم تبادل حزم Label Mapping وبناء جدول الـ LFIB.', descEn: 'LDP peering operational; label mapping bindings exchanged.', triggerAr: 'بناء مسارات الـ LSP عبر الشبكة', triggerEn: 'Label Switched Paths (LSP) established' }
    ],
    headerStructure: [
      { field: 'MPLS Label Value', bits: '20 bits', descAr: 'قيمة التسمية (من 0 إلى 1,048,575)', descEn: '20-bit label index used for ultra-fast hardware lookups' },
      { field: 'Traffic Class (EXP / TC)', bits: '3 bits', descAr: 'أولوية جودة الخدمة (QoS / DiffServ)', descEn: '3-bit Quality of Service / Class of Service indicator' },
      { field: 'Bottom of Stack (S-bit)', bits: '1 bit', descAr: 'راية أسفل المكدس (1 تعني آخر تسمية، 0 تعني وجود تسميات أخرى مثل MPLS VPN)', descEn: '1-bit Bottom-of-Stack indicator (1=last label, 0=nested inner label)' },
      { field: 'Time to Live (TTL)', bits: '8 bits', descAr: 'عداد منع الحلقات (يتم نسخه من ترويسة IP)', descEn: '8-bit hop limit copied from IP TTL' }
    ],
    ciscoShowCommands: [
      'show mpls ldp neighbor',
      'show mpls forwarding-table',
      'show mpls ldp bindings',
      'show mpls interfaces'
    ],
    ciscoConfigSnippet: `mpls ip
mpls label range 100 1999
interface GigabitEthernet0/0
 mpls ip
 mpls ldp discovery transport-address interface Loopback0`,
    keyConceptsAr: [
      { title: 'التبديل عبر التسميات (Label Swapping)', desc: 'توجيه البيانات في قلب الشبكة (Core LSR) بقراءة تسمية من 20-bit فقط دون النظر لترويسة IP المعقدة.' },
      { title: 'الـ Penultimate Hop Popping (PHP)', desc: 'الراوتر قبل الأخير يقوم بنزع التسمية (Pop Label 3) لتخفيف العبء عن الراوتر النهائي (Egress LER).' }
    ],
    keyConceptsEn: [
      { title: 'Label Swapping Forwarding', desc: 'Core LSR routers switch traffic using simple 20-bit index lookups without consulting full IP routing tables.' },
      { title: 'Penultimate Hop Popping (PHP)', desc: 'Second-to-last router pops outer label (Implicit Null 3) to offload egress router processing.' }
    ],
    realWorldAnalogyAr: 'يشبه MPLS نظام التذاكر الملونة في قطار الملاهي السريع: بدلاً من فحص جواز سفرك وهويتك الكاملة عند كل منعطف (IP Lookup)، يعطيك الموظف في البداية شارة ملونة برقم 50 (Push Label)، وفي كل محطة يبدلها برقم آخر بسرعة البرق (Swap)، حتى المحطة الأخيرة حيث تنزع الشارة (Pop).',
    realWorldAnalogyEn: 'MPLS operates like an express barcode baggage handling system: rather than inspecting full luggage contents at every transit hub, bags get a high-speed barcode sticker (Label Push), swapped between conveyor belts (Swap), and peeled off at destination carousel (Pop).'
  },

  HSRP: {
    id: 'HSRP',
    name: 'Hot Standby Router Protocol (Cisco HSRPv1 / HSRPv2 & VRRP)',
    standard: 'RFC 2281 (HSRPv1) / Cisco Proprietary (v2) / RFC 5798 (VRRPv3)',
    layer: 'Layer 3 First-Hop Redundancy (UDP Port 1985 / 224.0.0.102)',
    adminDistance: 0,
    metricEquation: 'Priority (Default 100) + Preemption + Object Tracking Decrement',
    algorithm: 'Active / Standby Gateway Election with Virtual IP and Virtual MAC Sharing',
    packetTypes: [
      { name: 'HSRP Hello', opcode: 'Opcode 0', purposeAr: 'نبض اتصال دوري (كل 3 ثوانٍ) للحفاظ على حالة الراوتر النشط والاحتياطي', purposeEn: 'Periodic keepalive heartbeat (3s default) maintaining active/standby state' },
      { name: 'HSRP Coup', opcode: 'Opcode 1', purposeAr: 'رسالة انتزاع السيطرة من راوتر جديد ذو أولوية أعلى عند تفعيل Preempt', purposeEn: 'Preemption message seizing Active role when higher priority router comes online' },
      { name: 'HSRP Resign', opcode: 'Opcode 2', purposeAr: 'تنازل الراوتر النشط عن دوره طواعية عند إيقاف التشغيل أو تعطل رابط أساسي', purposeEn: 'Graceful surrender of Active status triggering immediate Standby promotion' }
    ],
    stateMachine: [
      { state: '1. Initial', descAr: 'بدء تشغيل عملية HSRP أو تعديل الإعدادات.', descEn: 'HSRP interface not yet running or undergoing configuration changes.', triggerAr: 'المنفذ يصبح Up ويتم تفعيل HSRP', triggerEn: 'Interface transitions up with HSRP enabled' },
      { state: '2. Listen', descAr: 'الراوتر يستمع لحزم Hello لمعرفة هل يوجد Active و Standby في الشبكة.', descEn: 'Router listens for Hellos to determine if Active/Standby routers already exist.', triggerAr: 'عدم وجود راوتر Standby', triggerEn: 'No Standby router detected' },
      { state: '3. Speak', descAr: 'الراوتر يبدأ إرسال حزم Hello دورية للمشاركة في انتخابات الـ Active/Standby.', descEn: 'Router sends periodic Hellos to participate in active gateway election.', triggerAr: 'انتهاء مؤقت الانتخابات وتحديد الرتب', triggerEn: 'Election timer resolves highest priority' },
      { state: '4. Standby', descAr: 'الراوتر هو المرشح الفوري ليصبح Active إذا سقط الراوتر النشط الحالي.', descEn: 'Router is primary backup monitoring Active router heartbeats.', triggerAr: 'غياب Hello الراوتر النشط لمدة 10 ثوانٍ (Hold Timer)', triggerEn: 'Hold timer (10s) expires without Active Hello' },
      { state: '5. Active', descAr: 'الراوتر مسؤول عن استقبال وتوجيه كافة حزم المستخدمين المرسلة للـ Virtual IP.', descEn: 'Router assumes Virtual IP/MAC ownership and routes all outbound LAN traffic.', triggerAr: 'سقوط الراوتر أو سحب الدور عبر Preempt', triggerEn: 'Link failure or preemption by higher priority peer' }
    ],
    headerStructure: [
      { field: 'Version & OpCode', bits: '8 bits', descAr: 'إصدار HSRP (v1=0x00, v2=0x02) ونوع الرسالة', descEn: 'HSRP version and message type opcode' },
      { field: 'State & IP Version', bits: '8 bits', descAr: 'الحالة الحالية للراوتر المرسل (Active, Standby, Speak)', descEn: 'Transmitting router current state code' },
      { field: 'Group Number', bits: '16 bits', descAr: 'رقم مجموعة HSRP (من 0 إلى 4095 في v2)', descEn: 'HSRP redundancy group identifier' },
      { field: 'Priority', bits: '8 bits', descAr: 'قيمة الأولوية (من 0 إلى 255، الافتراضي 100)', descEn: 'Router election priority (highest wins)' },
      { field: 'Virtual IPv4 / IPv6', bits: '32 / 128 bits', descAr: 'عنوان البوابة الافتراضية المشتركة للأجهزة', descEn: 'Shared Virtual IP address configured as default gateway on hosts' }
    ],
    ciscoShowCommands: [
      'show standby brief',
      'show standby',
      'show standby all'
    ],
    ciscoConfigSnippet: `interface GigabitEthernet0/1
 standby version 2
 standby 10 ip 192.168.1.1
 standby 10 priority 110
 standby 10 preempt
 standby 10 track GigabitEthernet0/0 25`,
    keyConceptsAr: [
      { title: 'البوابة الافتراضية الوهمية (VIP & VMAC)', desc: 'أجهزة المستخدمين تضبط بـ VIP واحد (مثل 192.168.1.1)، ويتشارك الراوتران عنوان MAC وهمي (0000.0C9F.F00A) لتأمين استمرارية الخدمة بنسبة 99.999%.' },
      { title: 'الاستباق وتتبع الروابط (Preempt & Object Tracking)', desc: 'إمكانية تخفيض الأولوية تلقائياً عند انقطاع كابل الإنترنت الخارجي لتسليم القيادة للراوتر البديل فوراً.' }
    ],
    keyConceptsEn: [
      { title: 'Virtual IP & Virtual MAC', desc: 'Hosts configure a single redundant gateway IP, backed by a floating Virtual MAC address for seamless sub-second failover.' },
      { title: 'Preempt & Object Tracking', desc: 'Dynamically decrements local priority when upstream WAN circuits fail, gracefully shifting traffic to surviving router.' }
    ],
    realWorldAnalogyAr: 'يشبه HSRP طاقم طائرة بربان ومساعد طيار أول: الربان (Active) يقود الطائرة ومساعده (Standby) يتابع المؤشرات في صمت، وإذا حدث أي طارئ للربان يتولى المساعد مقود الطائرة في كسر من الثانية دون أن يشعر الركاب بأي اضطراب!',
    realWorldAnalogyEn: 'HSRP operates like an airliner cockpit with Captain and First Officer: the Captain (Active) flies the plane while the First Officer (Standby) monitors telemetry. If the Captain is incapacitated, the First Officer takes controls instantly without passenger disruption.'
  },

  NAT: {
    id: 'NAT',
    name: 'Network Address Translation & Port Address Translation (NAT / PAT)',
    standard: 'RFC 1631 / RFC 3022 / RFC 2663',
    layer: 'Layer 3/4 Boundary Translation',
    adminDistance: 0,
    metricEquation: 'Inside Local : Port <---> Inside Global : Port Mapping Table',
    algorithm: 'Header IP & Layer 4 Port Rewriting with State Table Tracking',
    packetTypes: [
      { name: 'Outbound IP Packet', opcode: 'Client Request', purposeAr: 'تغيير عنوان المصدر الخاص (RFC 1918) إلى عنوان عام Public IP مع رقم منفذ فريد', purposeEn: 'Translate private inside local source IP/Port to routable inside global public IP' },
      { name: 'Inbound Response Packet', opcode: 'Server Reply', purposeAr: 'مطابقة رقم المنفذ في جدول NAT واسترجاع عنوان الجهاز الداخلي الخاص', purposeEn: 'Lookup NAT state table by destination port and rewrite to original private IP' }
    ],
    stateMachine: [
      { state: '1. Outbound Packet Arrival', descAr: 'حزمة قادمة من شبكة LAN خاصة تريد الوصول للإنترنت العام.', descEn: 'Internal private IPv4 host initiates outbound connection toward public Internet.', triggerAr: 'فحص الحزمة عبر قائمة التحكم ACL', triggerEn: 'Match packet against NAT permit ACL' },
      { state: '2. Table Entry Allocation', descAr: 'الراوتر يخصص منفذاً عاماً فريداً ويسجل الربط في جدول NAT Translation Table.', descEn: 'Router allocates unique ephemeral public port and creates dynamic state binding.', triggerAr: 'تعديل ترويسة IP و TCP/UDP وإعادة حساب Checksum', triggerEn: 'Rewrite headers and recalculate checksums' },
      { state: '3. Public Transmission', descAr: 'الحزمة تخرج للإنترنت بعنوان الراوتر العام دون كشف الهيكل الداخلي للمؤسسة.', descEn: 'Packet dispatched across WAN carrying public routable source address.', triggerAr: 'استلام رد السيرفر الخارجي', triggerEn: 'Server reply arrives at router public interface' },
      { state: '4. Inbound Demultiplexing', descAr: 'الراوتر يطابق المنفذ، يعيد كتابة الوجهة لـ Private IP، ويمرر الفريم للجهاز الأصلي.', descEn: 'Router consults NAT table, rewrites destination IP/port to Inside Local, and forwards.', triggerAr: 'انتهاء الجلسة ومسح السجل بعد الخمول', triggerEn: 'TCP FIN/RST or UDP timeout flushes NAT translation entry' }
    ],
    headerStructure: [
      { field: 'Inside Local IP:Port', bits: '48 bits', descAr: 'عنوان IP الداخلي الخاص للجهاز مع رقم المنفذ', descEn: 'Private IP address and source port assigned to internal workstation' },
      { field: 'Inside Global IP:Port', bits: '48 bits', descAr: 'العنوان العام المعتمد على الإنترنت مع المنفذ المحجوز', descEn: 'Public routable IP address and unique translated port on router' },
      { field: 'Outside Global IP:Port', bits: '48 bits', descAr: 'عنوان ومنفذ السيرفر الخارجي على الإنترنت', descEn: 'Public destination web or cloud server address and service port' }
    ],
    ciscoShowCommands: [
      'show ip nat translations',
      'show ip nat statistics',
      'clear ip nat translation *'
    ],
    ciscoConfigSnippet: `ip access-list standard LAN_CLIENTS
 permit 192.168.1.0 0.0.0.255
ip nat inside source list LAN_CLIENTS interface GigabitEthernet0/0 overload
interface GigabitEthernet0/1
 ip nat inside
interface GigabitEthernet0/0
 ip nat outside`,
    keyConceptsAr: [
      { title: 'حفظ مساحة عناوين IPv4 (PAT Overload)', desc: 'تمكين آلاف الأجهزة في المؤسسة من تصفح الإنترنت في نفس الوقت باستخدام عنوان IP عام واحد فقط عبر تمييزهم بأرقام المنافذ.' },
      { title: 'أمان وحماية الشبكة الداخلية', desc: 'إخفاء العناوين الحقيقية للأجهزة الداخلية عن قراصنة الإنترنت ومنع الاتصالات المباشرة غير المصرح بها.' }
    ],
    keyConceptsEn: [
      { title: 'IPv4 Address Conservation (PAT Overload)', desc: 'Enables thousands of enterprise private hosts to share a single public IPv4 address multiplexed by Layer 4 port numbers.' },
      { title: 'Internal Network Obfuscation', desc: 'Hides private topology and device IPs from public Internet reconnaissance.' }
    ],
    realWorldAnalogyAr: 'يشبه NAT سنترال شركة ضخمة بها 5000 موظف: لكل موظف رقم تحويلة داخلية مجانية (Private IP)، ولكن الشركة كلها تملك رقم هاتف رسمي واحد منشور في الجريدة (Public IP). عندما يتصل موظف بالخارج يظهر رقم الشركة، والسنترال يوجه المكالمات الواردة للتحويلة الصحيحة بدقة!',
    realWorldAnalogyEn: 'NAT/PAT is like a corporate telephone switchboard for 5,000 employees: each has an internal extension (Private IP), while the entire company shares one public telephone number (Public IP), with the PBX routing incoming replies to the right desk.'
  },

  ICMPv6_NDP: {
    id: 'ICMPv6_NDP',
    name: 'Neighbor Discovery Protocol & IPv6 SLAAC (ICMPv6 NDP)',
    standard: 'RFC 4861 (NDP) / RFC 4862 (SLAAC)',
    layer: 'Layer 3 Protocol over ICMPv6 (Type 133 to 137)',
    adminDistance: 0,
    metricEquation: 'IPv6 Neighbor Cache (Reachable -> Stale -> Delay -> Probe -> Incomplete)',
    algorithm: 'Solicited-Node Multicast Resolution & Stateless Autoconfiguration (SLAAC)',
    packetTypes: [
      { name: 'Router Solicitation (RS)', opcode: 'Type 133', purposeAr: 'استعلام من الجهاز إلى الراوترات المجاورة ff02::2 لطلب بادئة الشبكة تلقائياً', purposeEn: 'Host query to all-routers multicast ff02::2 requesting prefix configuration' },
      { name: 'Router Advertisement (RA)', opcode: 'Type 134', purposeAr: 'إعلان من الراوتر يتضمن بادئة الـ IPv6 ومعايير SLAAC وقيمة الـ MTU', purposeEn: 'Periodic or solicited router announcement with prefix, flags (A, M, O), and lifetime' },
      { name: 'Neighbor Solicitation (NS)', opcode: 'Type 135', purposeAr: 'طلب عنوان MAC للجهاز المستهدف أو فحص تكرار العنوان (DAD) بدون أي Broadcast', purposeEn: 'Multicast query resolving target MAC address or performing Duplicate Address Detection' },
      { name: 'Neighbor Advertisement (NA)', opcode: 'Type 136', purposeAr: 'رد الجهاز بعنوان الـ MAC الخاص به مباشرة', purposeEn: 'Unicast or solicited response delivering target physical link-layer address' }
    ],
    stateMachine: [
      { state: '1. Incomplete', descAr: 'تم إرسال حزمة Neighbor Solicitation (NS) ونحن بانتظار استلام الـ NA.', descEn: 'Address resolution in progress; NS sent, awaiting matching NA.', triggerAr: 'استلام Neighbor Advertisement مع الـ MAC', triggerEn: 'Receive valid NA frame' },
      { state: '2. Reachable', descAr: 'العنوان تم حله بنجاح والاتصال مؤكد ومستقر خلال فترة الصلاحية.', descEn: 'Neighbor known to be reachable within confirmed reachability timer.', triggerAr: 'انتهاء مؤقت Reachable Timer دون تأكيد إضافي', triggerEn: 'Reachable timer expiration' },
      { state: '3. Stale', descAr: 'مرت فترة زمنية دون إرسال بيانات لهذا الجهاز، السجل موجود لكن يحتاج تحقق عند الحاجة.', descEn: 'Cached mapping entry is old; valid for sending but requires verification if used.', triggerAr: 'إرسال حزمة جديدة للجهاز', triggerEn: 'Outbound packet queued to stale neighbor' },
      { state: '4. Delay / Probe', descAr: 'إرسال حزم NS أحادية للتحقق من أن الجهاز ما زال متواجداً على نفس المنفذ.', descEn: 'Sending unicast NS probes to verify neighbor presence before discarding.', triggerAr: 'استلام الرد والعودة لـ Reachable، أو الحذف التام', triggerEn: 'Positive NA probe confirmation or cache entry eviction' }
    ],
    headerStructure: [
      { field: 'Type', bits: '8 bits', descAr: 'نوع رسالة ICMPv6 (133=RS, 134=RA, 135=NS, 136=NA, 137=Redirect)', descEn: 'ICMPv6 message type identifier' },
      { field: 'Code', bits: '8 bits', descAr: 'الرمز (دائماً 0 في رسائل NDP)', descEn: 'Sub-code field (always 0 for NDP)' },
      { field: 'Checksum', bits: '16 bits', descAr: 'التحقق الرياضي الشامل من صحة حزمة ICMPv6 والترويسة الوهمية', descEn: 'Mandatory IPv6 pseudo-header checksum' },
      { field: 'Target IPv6 Address', bits: '128 bits', descAr: 'عنوان IPv6 المستهدف بالاستعلام أو التأكيد', descEn: '128-bit target IPv6 address undergoing resolution' },
      { field: 'ND Options (SLLA / TLLA)', bits: 'Variable', descAr: 'خيارات الترويسة متضمنة عنوان MAC لكارت الشبكة (Source/Target Link-Layer Address)', descEn: 'Link-layer MAC address options and prefix information blocks' }
    ],
    ciscoShowCommands: [
      'show ipv6 neighbors',
      'show ipv6 interface brief',
      'show ipv6 routers',
      'clear ipv6 neighbors'
    ],
    ciscoConfigSnippet: `ipv6 unicast-routing
interface GigabitEthernet0/1
 ipv6 address 2001:DB8:ACAD:1::1/64
 ipv6 nd prefix 2001:DB8:ACAD:1::/64 2592000 604800
 no ipv6 nd suppress-ra`,
    keyConceptsAr: [
      { title: 'القضاء النهائي على الـ Broadcast', desc: 'IPv6 لا يحتوي على أي حزم بث عام (No Broadcast)، حيث يعتمد NDP على البث المتعدد الذكي Solicited-Node Multicast لتوفير النطاق وحماية الأجهزة.' },
      { title: 'التكوين التلقائي غير المترابط (SLAAC)', desc: 'الأجهزة تولد عناوين IPv6 العالمية الفريدة بنفسها فور توصيل الكابل بمجرد استلام بادئة الشبكة من الراوتر دون الحاجة لسيرفر DHCP!' }
    ],
    keyConceptsEn: [
      { title: 'Complete Broadcast Elimination', desc: 'IPv6 completely deprecates broadcast, utilizing efficient Solicited-Node Multicast groups to resolve MACs.' },
      { title: 'Stateless Autoconfiguration (SLAAC)', desc: 'Hosts automatically construct globally routable IPv6 addresses combining RA network prefixes with EUI-64 or randomized interface IDs.' }
    ],
    realWorldAnalogyAr: 'يشبه NDP فندقاً ذكياً مستقبلياً: بمجرد دخولك الباب، يرسل لك الحساس المركزي إشعاراً برقم الجناح (Router Advertisement)، وجهازك يولد مفتاح غرفتك المشفر تلقائياً (SLAAC)، وعندما تريد مناداة رفيقك ترسل إشارة مشفرة على تردد غرفته المباشر دون إزعاج أي نزيل آخر في الفندق!',
    realWorldAnalogyEn: 'ICMPv6 NDP is like a futuristic smart hotel: the moment you enter, the intercom broadcasts the floor prefix (Router Advertisement), your phone generates your suite key (SLAAC), and you contact other guests via private encrypted channels without disturbing anyone else.'
  }
};
