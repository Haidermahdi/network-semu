import { NetworkNode, NetworkLink, SimulationScenario, MacTableEntry, RoutingTableEntry, ArpTableEntry } from '../types';

export const INITIAL_NETWORK_NODES: NetworkNode[] = [
  // LAN 1 (Subnet: 192.168.1.0/24)
  {
    id: 'host-a',
    name: 'Host A (كمبيوتر أحمد)',
    arName: 'حاسوب أحمد (المصدر)',
    type: 'host',
    ip: '192.168.1.10',
    mac: 'AA:AA:AA:11:11:11',
    subnet: '255.255.255.0',
    defaultGateway: '192.168.1.1',
    x: 10,
    y: 28,
    status: 'idle',
    ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/1' }]
  },
  {
    id: 'host-b',
    name: 'Host B (كمبيوتر سارة)',
    arName: 'حاسوب سارة (نفس الشبكة)',
    type: 'host',
    ip: '192.168.1.20',
    mac: 'BB:BB:BB:22:22:22',
    subnet: '255.255.255.0',
    defaultGateway: '192.168.1.1',
    x: 10,
    y: 72,
    status: 'idle',
    ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/2' }]
  },
  {
    id: 'switch-1',
    name: 'Switch 1 (سويتش الدور الأول)',
    arName: 'سويتش الدور 1 (Layer 2)',
    type: 'switch',
    ip: '192.168.1.2 (Mgmt)',
    mac: '55:55:55:00:00:01',
    subnet: '255.255.255.0',
    x: 28,
    y: 50,
    status: 'idle',
    ports: [
      { portNumber: 1, connectedTo: 'host-a', label: 'Fa0/1' },
      { portNumber: 2, connectedTo: 'host-b', label: 'Fa0/2' },
      { portNumber: 24, connectedTo: 'router-1', label: 'Gi0/1' }
    ]
  },
  {
    id: 'router-1',
    name: 'Router 1 (راوتر البوابة)',
    arName: 'راوتر البوابة (Gateway - Layer 3)',
    type: 'router',
    ip: '192.168.1.1 (LAN) | 203.0.113.1 (WAN)',
    mac: 'R1:R1:R1:11:11:11 (LAN) | R1:WW:WW:11:11:11 (WAN)',
    subnet: '255.255.255.0 (LAN) | 255.255.255.252 (WAN)',
    x: 50,
    y: 50,
    status: 'idle',
    ports: [
      { portNumber: 'Gi0/0', connectedTo: 'switch-1', label: 'LAN (192.168.1.1)' },
      { portNumber: 'Serial0/1', connectedTo: 'router-2', label: 'WAN (203.0.113.1)' }
    ],
    activeInterfaces: {
      'Gi0/0': { ip: '192.168.1.1', mac: 'R1:R1:R1:11:11:11', subnet: '192.168.1.0/24' },
      'Serial0/1': { ip: '203.0.113.1', mac: 'R1:WW:WW:11:11:11', subnet: '203.0.113.0/30' }
    }
  },
  {
    id: 'router-2',
    name: 'Router 2 (راوتر مركز البيانات)',
    arName: 'راوتر السحابة (Data Center)',
    type: 'router',
    ip: '203.0.113.2 (WAN) | 10.0.0.1 (LAN2)',
    mac: 'R2:WW:WW:22:22:22 (WAN) | R2:R2:R2:22:22:22 (LAN2)',
    subnet: '255.255.255.252 (WAN) | 255.255.255.0 (LAN2)',
    x: 72,
    y: 50,
    status: 'idle',
    ports: [
      { portNumber: 'Serial0/1', connectedTo: 'router-1', label: 'WAN (203.0.113.2)' },
      { portNumber: 'Gi0/0', connectedTo: 'switch-2', label: 'LAN2 (10.0.0.1)' }
    ],
    activeInterfaces: {
      'Serial0/1': { ip: '203.0.113.2', mac: 'R2:WW:WW:22:22:22', subnet: '203.0.113.0/30' },
      'Gi0/0': { ip: '10.0.0.1', mac: 'R2:R2:R2:22:22:22', subnet: '10.0.0.0/24' }
    }
  },
  {
    id: 'switch-2',
    name: 'Switch 2 (سويتش السيرفرات)',
    arName: 'سويتش السيرفرات (Layer 2)',
    type: 'switch',
    ip: '10.0.0.2 (Mgmt)',
    mac: '66:66:66:00:00:02',
    subnet: '255.255.255.0',
    x: 85,
    y: 50,
    status: 'idle',
    ports: [
      { portNumber: 24, connectedTo: 'router-2', label: 'Gi0/1' },
      { portNumber: 1, connectedTo: 'server-1', label: 'Fa0/1' }
    ]
  },
  {
    id: 'server-1',
    name: 'Cloud Web Server (موقع جوجل / يوتيوب)',
    arName: 'سيرفر الويب البعيد (Target Server)',
    type: 'server',
    ip: '10.0.0.80',
    mac: 'CC:CC:CC:88:88:88',
    subnet: '255.255.255.0',
    defaultGateway: '10.0.0.1',
    x: 93,
    y: 50,
    status: 'idle',
    ports: [{ portNumber: 'eth0', connectedTo: 'switch-2', label: 'Fa0/1' }]
  }
];

export const NETWORK_LINKS: NetworkLink[] = [
  { id: 'l1', fromId: 'host-a', toId: 'switch-1', fromPort: 'Fa0', toPort: 'Fa0/1', type: 'copper', bandwidth: '1 Gbps', isActive: true },
  { id: 'l2', fromId: 'host-b', toId: 'switch-1', fromPort: 'Fa0', toPort: 'Fa0/2', type: 'copper', bandwidth: '1 Gbps', isActive: true },
  { id: 'l3', fromId: 'switch-1', toId: 'router-1', fromPort: 'Gi0/1', toPort: 'Gi0/0', type: 'copper', bandwidth: '1 Gbps', isActive: true },
  { id: 'l4', fromId: 'router-1', toId: 'router-2', fromPort: 'Ser0/1', toPort: 'Ser0/1', type: 'fiber', bandwidth: '10 Gbps (WAN / Internet)', isActive: true },
  { id: 'l5', fromId: 'router-2', toId: 'switch-2', fromPort: 'Gi0/0', toPort: 'Gi0/1', type: 'copper', bandwidth: '1 Gbps', isActive: true },
  { id: 'l6', fromId: 'switch-2', toId: 'server-1', fromPort: 'Fa0/1', toPort: 'eth0', type: 'copper', bandwidth: '10 Gbps', isActive: true }
];

export const INITIAL_MAC_TABLE_SWITCH1: MacTableEntry[] = [
  { vlan: 1, macAddress: 'AA:AA:AA:11:11:11', type: 'DYNAMIC', port: 'Fa0/1', ageSeconds: 12 },
  { vlan: 1, macAddress: 'BB:BB:BB:22:22:22', type: 'DYNAMIC', port: 'Fa0/2', ageSeconds: 45 },
  { vlan: 1, macAddress: 'R1:R1:R1:11:11:11', type: 'DYNAMIC', port: 'Gi0/1', ageSeconds: 5 }
];

export const INITIAL_ROUTING_TABLE_ROUTER1: RoutingTableEntry[] = [
  { destinationNetwork: '192.168.1.0', subnetMask: '255.255.255.0', nextHopIp: 'Directly Connected', interface: 'GigabitEthernet0/0', metric: 0, protocol: 'C' },
  { destinationNetwork: '203.0.113.0', subnetMask: '255.255.255.252', nextHopIp: 'Directly Connected', interface: 'Serial0/1', metric: 0, protocol: 'C' },
  { destinationNetwork: '10.0.0.0', subnetMask: '255.255.255.0', nextHopIp: '203.0.113.2', interface: 'Serial0/1', metric: 1, protocol: 'O' },
  { destinationNetwork: '0.0.0.0', subnetMask: '0.0.0.0', nextHopIp: '203.0.113.2 (Default Route)', interface: 'Serial0/1', metric: 1, protocol: 'S' }
];

export const INITIAL_ARP_CACHE_HOST_A: ArpTableEntry[] = [
  { ipAddress: '192.168.1.1', macAddress: 'R1:R1:R1:11:11:11', type: 'Dynamic', interface: 'eth0' },
  { ipAddress: '192.168.1.20', macAddress: 'BB:BB:BB:22:22:22', type: 'Dynamic', interface: 'eth0' }
];

// Complete Detailed Scenarios
export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'cross-network-journey',
    titleAr: 'رحلة الحزمة الكبرى: إرسال طلب من جهازك إلى سيرفر سحابي بعيد',
    titleEn: 'End-to-End Packet Journey (Cross-Subnet Routing)',
    badge: 'السويتشينغ + الراوتينغ معاً',
    difficulty: 'complex',
    difficultyAr: 'مستوى متوسط / معقد (Intermediate)',
    category: 'end_to_end',
    categoryAr: 'عابر للشبكات والراوترات',
    descriptionAr: 'حاسوب أحمد (192.168.1.10) يطلب صفحة ويب من سيرفر جوجل (10.0.0.80). شاهد سحر التغليف (Encapsulation) وتغيّر الماك أدرس في كل قفزة مع بقاء الـ IP ثابتاً!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'HTTP',
    steps: [
      {
        id: 1,
        stageTitleAr: 'المرحلة 1: قرار الحاسوب (هل الهدف محلي أم خارجي؟)',
        stageTitleEn: 'Local Subnet Calculation & Encapsulation',
        stageDescriptionAr: 'يقوم حاسوب أحمد بعمل عملية ANDing بين عنوان IP الهدف (10.0.0.80) وقناع الشبكة. يكتشف أن الهدف في شبكة أخرى تماماً! لذلك يقرر إرسال الحزمة إلى البوابة الافتراضية (Default Gateway: 192.168.1.1).',
        layer: 'Layer 3 (Network)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 0,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11 (Host A)',
            destMac: 'R1:R1:R1:11:11:11 (Router 1 Gateway)',
            etherType: '0x0800 (IPv4)',
            fcs: '0x3F8A (OK)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10 (Host A)',
            destIp: '10.0.0.80 (Server)',
            ttl: 64,
            protocol: 'TCP (Port 80/HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html HTTP/1.1',
            message: 'طلب صفحة الويب من السيرفر البعيد'
          }
        },
        explanation: {
          whatIsHappening: 'يقوم الحاسوب بتغليف حزمة IP داخل فريم إيثرنت، موجهاً الماك أدرس نحو الراوتر (بوابة الخروج).',
          whyItHappens: 'الحاسوب لا يستطيع الوصول للماك أدرس الخاص بسيرفر جوجل البعيد، لذلك يسلم الطرد إلى ساعي البريد المحلي (الراوتر).',
          realLifeParallel: 'أنت تريد إرسال رسالة إلى صديق في طوكيو؛ تكتب على المظروف الداخلي عنوان صديقك في طوكيو، لكنك تسلم الرسالة باليد إلى مكتب البريد في حيك!',
          keyObservation: 'لاحظ: IP الوجهة هو 10.0.0.80 (طوكيو)، لكن MAC الوجهة هو ماك الراوتر المحلي 192.168.1.1!'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: 'المرحلة 2: السويتش المحلي يفحص الفريم ويوجهه (Layer 2 Switching)',
        stageTitleEn: 'Switching to Gateway via MAC Table (CAM)',
        stageDescriptionAr: 'يستقبل سويتش الدور 1 الفريم على المنفذ Fa0/1. يقرأ الـ Source MAC ويتعلم مكانه في جدول CAM، ثم يقرأ Destination MAC ويجد أنه موجه للمنفذ Gi0/1 (منفذ الراوتر).',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'switch-1',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'R1:R1:R1:11:11:11 (Port Gi0/1)',
            etherType: '0x0800',
            fcs: '0x3F8A (OK)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 64,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش ينظر فقط إلى MAC الوجهة. لا يفتح ولا يفحص عنوان IP على الإطلاق!',
          whyItHappens: 'السويتش جهاز من الطبقة الثانية (Layer 2)، مهمته الوحيدة سرعة تمرير الفريمات عبر منافذه الفيزيائية اعتماداً على جدول MAC.',
          realLifeParallel: 'موظف الاستقبال في المبنى يرى أن الرسالة متجهة إلى صندوق البريد الصادر، فيضعها فوراً في سلة البريد الصادر دون قراءة محتوى الرسالة.',
          keyObservation: 'السويتش لا يغير أي بايت في الفريم أو الحزمة؛ يمررها كما هي بسرعة البرق.'
        },
        highlightEvent: 'mac_learned',
        tableUpdate: {
          deviceType: 'switch',
          deviceId: 'switch-1',
          tableName: 'MAC Address Table (CAM)',
          entry: {
            key1: 'AA:AA:AA:11:11:11',
            key2: 'Port Fa0/1 (Learned)',
            extra: 'VLAN 1, Age: 0s'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: 'المرحلة 3: راوتر البوابة يفحص التوجيه وينقص TTL (Layer 3 Routing)',
        stageTitleEn: 'Router 1 Decapsulation, Route Lookup & TTL Decrement',
        stageDescriptionAr: 'يستلم الراوتر 1 الفريم. يرى أن MAC الوجهة يطابقه، فيقوم بفك التغليف (Decapsulation) وحذف فريم الإيثرنت القديم. ينظر إلى IP الوجهة (10.0.0.80) ويبحث في جدول التوجيه (Routing Table). ينقص قيمة TTL من 64 إلى 63 لحماية الشبكة من الحلقات اللانهائية!',
        layer: 'Layer 3 (Network)',
        activeNodeId: 'router-1',
        fromNodeId: 'switch-1',
        toNodeId: 'router-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11 (Router 1 WAN)',
            destMac: 'R2:WW:WW:22:22:22 (Router 2 WAN)',
            etherType: '0x0800',
            fcs: '0x99A1',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10 (لم يتغير!)',
            destIp: '10.0.0.80 (لم يتغير!)',
            ttl: 63, // Decremented!
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر استبدل غلاف الطبقة الثانية بالكامل (MAC Address جديد للشبكة الواسعة WAN)، وأنقص الـ TTL بواحد، ووجه الحزمة عبر منفذ Serial0/1.',
          whyItHappens: 'بروتوكولات الطبقة الثانية محلية لكل وصلة فقط (Hop-by-Hop)، بينما IP عالمي يمتد من البداية للنهاية (End-to-End).',
          realLifeParallel: 'مركز التوزيع البريدي يستلم الطرد المحلي، يمزق الكيس البلاستيكي الداخلي، يضع طابع الشحن الدولي، ويسلمه لطائرة الشحن المتجهة إلى طوكيو.',
          keyObservation: '🔥 أهم قاعدة في الشبكات: الـ IP يبقى ثابتاً من المصدر للنهاية، بينما الـ MAC يتغير في كل راوتر يقابله!'
        },
        highlightEvent: 'mac_rewrite',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'Routing Table (FIB)',
          entry: {
            key1: '10.0.0.0/24',
            key2: 'via 203.0.113.2',
            extra: 'Next-Hop Interface: Serial0/1'
          }
        }
      },
      {
        id: 4,
        stageTitleAr: 'المرحلة 4: عبور الإنترنت والشبكة الواسعة (WAN Transit to Cloud DC)',
        stageTitleEn: 'WAN Optical Transmission to Core Cloud Router',
        stageDescriptionAr: 'تنتقل الحزمة عبر كابلات الألياف الضوئية عالية السرعة بين الراوتر 1 والراوتر 2 (مركز بيانات السحابة). الحزمة تحمل معرفات القفزة بين الراوترين.',
        layer: 'Layer 3 (Network)',
        activeNodeId: 'router-2',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            fcs: '0x99A1',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 63,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html'
          }
        },
        explanation: {
          whatIsHappening: 'الحزمة تصل إلى راوتر مركز البيانات (Router 2).',
          whyItHappens: 'الراوتر 2 هو المسؤول عن شبكة الخوادم 10.0.0.0/24.',
          realLifeParallel: 'طائرة الشحن تهبط في مطار طوكيو الدولي وتسلم الحاويات إلى مركز التوزيع الإقليمي هناك.',
          keyObservation: 'البيانات قطعت آلاف الكيلومترات دون أن تفقد هويتها الأصلية بفضل عنوان IP المصدر والهدف.'
        },
        highlightEvent: 'router_lookup'
      },
      {
        id: 5,
        stageTitleAr: 'المرحلة 5: راوتر السحابة يفك التغليف ويعيد التوجيه للسيرفر (L3 Decapsulation & L2 Re-framing)',
        stageTitleEn: 'Router 2 Local Routing & Layer 2 ARP Encapsulation',
        stageDescriptionAr: 'الراوتر 2 يستلم الفريم، يحذف غلاف الـ WAN، ينقص الـ TTL إلى 62. يرى أن IP الوجهة (10.0.0.80) متصل مباشرة بشبكته المحلية Gi0/0. يغلف الحزمة في فريم إيثرنت جديد حيث MAC الوجهة هو ماك السيرفر الحقيقي (CC:CC:CC:88:88:88)!',
        layer: 'Layer 3 (Network)',
        activeNodeId: 'router-2',
        fromNodeId: 'router-2',
        toNodeId: 'switch-2',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R2:R2:R2:22:22:22 (Router 2 LAN)',
            destMac: 'CC:CC:CC:88:88:88 (Server Target MAC)',
            etherType: '0x0800',
            fcs: '0x77B2',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 62, // Decremented again!
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر 2 فحص جدول الـ ARP الخاص به لمعرفة MAC السيرفر 10.0.0.80 ثم جهز فريم إيثرنت جديد وسلمه للسويتش 2.',
          whyItHappens: 'لأن السيرفر موجود في نفس شبكة LAN المحلية للراوتر 2، يتم التسليم مباشرة عبر Layer 2.',
          realLifeParallel: 'ساعي البريد في طوكيو يضع الطرد في دراجته النارية ويتحرك نحو عنوان الشركة المطلوب.',
          keyObservation: 'تغير الـ MAC مرة أخرى! أصبح المصدر هو راوتر 2 والهدف هو السيرفر.'
        },
        highlightEvent: 'ttl_decrement'
      },
      {
        id: 6,
        stageTitleAr: 'المرحلة 6: سويتش السيرفرات يسلم الفريم إلى السيرفر (Switch 2 Local Delivery)',
        stageTitleEn: 'Switch 2 Forwarding to Final Destination Server',
        stageDescriptionAr: 'يستقبل السويتش 2 الفريم، يفحص جدول CAM، يرى أن MAC الوجهة (CC:CC:CC:88:88:88) موجود على المنفذ Fa0/1، فيمرر الفريم مباشرة إلى السيرفر دون إزعاجه لأي جهاز آخر.',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'switch-2',
        fromNodeId: 'switch-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R2:R2:R2:22:22:22',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800',
            fcs: '0x77B2',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 62,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'GET /index.html',
            message: 'وصل الطلب بنجاح للسيرفر!'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش 2 يرسل الفريم بدقة للمنفذ الوحيد المتصل بالسيرفر.',
          whyItHappens: 'توفير الباندويث ومنع التصادم (Collision Domain Isolation).',
          realLifeParallel: 'موظف الاستقبال في شركة طوكيو يسلم الطرد مباشرة إلى مكتب المبرمج المعني.',
          keyObservation: 'السويتش يعمل بسرعة عتادية (Hardware ASIC) فائقة دون استهلاك معالجة L3.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 7,
        stageTitleAr: 'المرحلة 7: السيرفر يستقبل الطلب ويعالجه (Server Processing & Response Ready)',
        stageTitleEn: 'Server Application Decapsulation & HTTP 200 Response',
        stageDescriptionAr: 'يستلم السيرفر الفريم: 1. يتحقق من صحة FCS (لا أخطاء)، 2. يزيل غلاف الإيثرنت، 3. يتحقق من IP الوجهة، 4. يسلم البيانات لبرنامج Nginx/Apache على المنفذ 80، 5. يجهز الرد HTTP 200 OK للعودة لأحمد!',
        layer: 'Layer 7 (Application)',
        activeNodeId: 'server-1',
        fromNodeId: 'server-1',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'CC:CC:CC:88:88:88',
            destMac: 'R2:R2:R2:22:22:22',
            etherType: '0x0800',
            fcs: '0x1111',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '10.0.0.80 (Server)',
            destIp: '192.168.1.10 (Host A)',
            ttl: 64,
            protocol: 'TCP (HTTP Response)',
            version: 'IPv4'
          },
          payload: {
            type: 'HTTP Request',
            data: 'HTTP/1.1 200 OK [<html>Welcome to Google Cloud</html>]',
            message: 'تم استقبال الطلب وتجهيز صفحة الويب للعودة!'
          }
        },
        explanation: {
          whatIsHappening: 'السيرفر أكمل قراءة الحزمة ويقوم الآن بعكس المصدر والوجهة لإرسال رد الويب.',
          whyItHappens: 'الاتصال في الشبكات ثنائي الاتجاه (Full-Duplex Request/Response).',
          realLifeParallel: 'المهندس في طوكيو يقرأ الرسالة ويكتب رداً ويضعه في مظروف جديد موجه لأحمد.',
          keyObservation: 'الرحلة تكتمل في بضع أجزاء من الألف من الثانية (Milliseconds) عبر العالم!'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'same-lan-switching',
    titleAr: 'السويتشينغ داخل نفس الشبكة المحلية (Host A -> Host B)',
    titleEn: 'Same Subnet Layer 2 Switching',
    badge: 'سويتشينغ نقي (L2 Only)',
    difficulty: 'simple',
    difficultyAr: 'مستوى بسيط (Simple / Beginner)',
    category: 'switching',
    categoryAr: 'تبديل محلي (Layer 2)',
    descriptionAr: 'حاسوب أحمد يريد التحدث مع حاسوب سارة في نفس الغرفة (192.168.1.0/24). شاهد كيف يتعامل السويتش مع الفريم دون الحاجة للراوتر نهائياً!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'host-b',
    packetType: 'ICMP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. اكتشاف الشبكة المحلية وتجهيز الفريم',
        stageTitleEn: 'Local Subnet Match & Direct MAC Addressing',
        stageDescriptionAr: 'حاسوب أحمد يرى أن IP سارة (192.168.1.20) في نفس شبكته (192.168.1.0/24). يبحث في جدول الـ ARP الداخلي ويجد ماك سارة (BB:BB:BB:22:22:22) مباشرة.',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 0,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11 (Host A)',
            destMac: 'BB:BB:BB:22:22:22 (Host B)',
            etherType: '0x0800',
            fcs: '0x22AB',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 64,
            protocol: 'ICMP (Ping)',
            version: 'IPv4'
          },
          payload: {
            type: 'ICMP Echo (Ping)',
            data: 'PING Echo Request (32 bytes data)',
            message: 'رسالة فحص اتصال بين أحمد وسارة'
          }
        },
        explanation: {
          whatIsHappening: 'أحمد لا يحتاج إلى الـ Default Gateway لأن سارة معه في نفس الحي/الشبكة.',
          whyItHappens: 'توفير الموارد وعدم إشغال الراوتر بالاتصالات المحلية.',
          realLifeParallel: 'تريد إعطاء مذكرة لزميلك في المكتب المجاور؛ لا ترسلها عبر البريد الدولي، بل تذهب إليه مباشرة!',
          keyObservation: 'MAC الوجهة هو ماك سارة مباشرة، وليس ماك الراوتر.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. السويتش يتعلم ويفحص جدول CAM',
        stageTitleEn: 'MAC Learning & Hardware Unicast Forwarding',
        stageDescriptionAr: 'السويتش يستلم الفريم على المنفذ 1. يحدث جدول CAM: (ماك أحمد موجود في المنفذ 1). يبحث عن ماك سارة في الجدول، يجده على المنفذ 2، فيرسل الفريم فقط إلى المنفذ 2.',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'switch-1',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'BB:BB:BB:22:22:22',
            etherType: '0x0800',
            fcs: '0x22AB',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 64,
            protocol: 'ICMP',
            version: 'IPv4'
          },
          payload: {
            type: 'ICMP Echo (Ping)',
            data: 'PING'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش لا يرسل الفريم إلى الراوتر ولا يزعج باقي المنافذ (Unicast).',
          whyItHappens: 'السويتش يعرف مسبقاً على أي منفذ تجلس سارة بفضل جدول عناوين الـ MAC.',
          realLifeParallel: 'موظف السنترال الداخلي يوصل المكالمة فوراً لتحويلة المكتب رقم 2.',
          keyObservation: 'الراوتر في هذه الحالة نائم تماماً ولا يعلم بوجود هذا الاتصال!'
        },
        highlightEvent: 'mac_learned',
        tableUpdate: {
          deviceType: 'switch',
          deviceId: 'switch-1',
          tableName: 'MAC Address Table (CAM)',
          entry: {
            key1: 'BB:BB:BB:22:22:22',
            key2: 'Port Fa0/2 (Forwarded)',
            extra: 'Status: Active Forward'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. وصول الفريم لسارة واستقبال الـ Ping',
        stageTitleEn: 'Host B Packet Ingestion & Reply Generation',
        stageDescriptionAr: 'يصل الفريم لحاسوب سارة على المنفذ Fa0/2. كارت الشبكة يطابق MAC الوجهة مع ماكها الخاص، فيقبل الفريم ويرد بـ ICMP Echo Reply.',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'host-b',
        fromNodeId: 'switch-1',
        toNodeId: 'host-b',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'BB:BB:BB:22:22:22',
            etherType: '0x0800',
            fcs: '0x22AB',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 64,
            protocol: 'ICMP Echo Reply',
            version: 'IPv4'
          },
          payload: {
            type: 'ICMP Echo (Ping)',
            data: 'PING Reply: bytes=32 time<1ms TTL=64',
            message: 'تم تبادل البينغ بنجاح في أقل من ميلي ثانية!'
          }
        },
        explanation: {
          whatIsHappening: 'سارة استلمت الرسالة وسترد بنفس المسار العكسي.',
          whyItHappens: 'اكتمال دورة فحص الاتصال (Ping Successful).',
          realLifeParallel: 'سارة تأخذ المذكرة وترد عليها "تم الاستلام شكراً لك".',
          keyObservation: 'زمن التأخير (Latency) أقل من 1ms لأن الاتصال لم يعبر أي راوتر.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'arp-broadcast-resolution',
    titleAr: 'كيف يعمل بروتوكول ARP؟ (البحث عن الماك المجهول)',
    titleEn: 'ARP Protocol Broadcast & Resolution',
    badge: 'البث والتعلم (Broadcast)',
    difficulty: 'simple',
    difficultyAr: 'مستوى بسيط (Simple / Beginner)',
    category: 'arp',
    categoryAr: 'بروتوكولات الاكتشاف (ARP)',
    descriptionAr: 'حاسوب أحمد يعرف IP سارة (192.168.1.20) لكنه يجهل عنوان الـ MAC الخاص بها! شاهد كيف يصرخ في الشبكة: "من يملك هذا الـ IP؟" وكيف يتعلم الجميع.',
    sourceNodeId: 'host-a',
    destinationNodeId: 'host-b',
    packetType: 'ARP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. إرسال طلب ARP بصيغة البث العام (Broadcast Frame)',
        stageTitleEn: 'ARP Request Broadcast (FF:FF:FF:FF:FF:FF)',
        stageDescriptionAr: 'أحمد يضع عنوان الماك للهدف: FF:FF:FF:FF:FF:FF (البث العام للجميع). نص الرسالة: "أنا 192.168.1.10، من يملك 192.168.1.20؟ أخبرني بالماك الخاص بك!"',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'FF:FF:FF:FF:FF:FF (Broadcast)',
            etherType: '0x0806 (ARP)',
            fcs: '0x0000',
            macLookupStatus: 'broadcast'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 1,
            protocol: 'ARP Request',
            version: 'ARP'
          },
          payload: {
            type: 'ARP Request',
            data: 'Who has 192.168.1.20? Tell 192.168.1.10',
            message: 'نداء عام في الشبكة للتعرف على الماك أدرس'
          }
        },
        explanation: {
          whatIsHappening: 'أحمد لا يستطيع إرسال فريم إيثرنت بدون MAC وجهة، لذلك يستعين ببروتوكول ARP لحل اللغز.',
          whyItHappens: 'كروت الشبكة لا تفهم عناوين IP مباشرة فيزيائياً؛ تحتاج لعنوان الـ MAC.',
          realLifeParallel: 'أنت في قاعة كبيرة تعرف أن اسم الطبيب "دكتور خالد" لكنك لا تعرف شكله؛ تنادي في الميكروفون: "من هو دكتور خالد؟"',
          keyObservation: 'عنوان FF:FF:FF:FF:FF:FF يعني "يا كل من يسمعني على هذا السويتش، افتح هذا الفريم!"'
        },
        highlightEvent: 'arp_broadcast'
      },
      {
        id: 2,
        stageTitleAr: '2. السويتش يفيض الفريم على كل المنافذ (Flooding)',
        stageTitleEn: 'Switch Floods Broadcast to All Ports in VLAN',
        stageDescriptionAr: 'يستقبل السويتش فريم البث، فيقوم بنسخه وإرساله لجميع المنافذ (حاسوب سارة + راوتر البوابة) ما عدا المنفذ الذي دخل منه الفريم!',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'host-b',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'FF:FF:FF:FF:FF:FF',
            etherType: '0x0806',
            fcs: '0x0000',
            macLookupStatus: 'miss_flooding'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 1,
            protocol: 'ARP',
            version: 'ARP'
          },
          payload: {
            type: 'ARP Request',
            data: 'Flooding to Fa0/2 and Gi0/1'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر يستلم الفريم، يقرأ: "هل أنت 192.168.1.20؟" يرى أنه 192.168.1.1 فيتجاهل الرسالة بهدوء (Drop). بينما سارة تجد أن الـ IP يطابقها!',
          whyItHappens: 'هذا ما يُسمى بنطاق البث (Broadcast Domain)؛ كل الأجهزة المتصلة بالسويتش تسمع النداء.',
          realLifeParallel: 'الجميع في القاعة يسمعون النداء، لكن فقط دكتور خالد يرفع يده، بينما البقية يكملون عملهم.',
          keyObservation: 'الراوتر يمنع بث الـ Broadcast من العبور إلى الشبكات الأخرى؛ يحصر البث داخل الشبكة المحلية فقط!'
        },
        highlightEvent: 'arp_broadcast'
      },
      {
        id: 3,
        stageTitleAr: '3. سارة ترد بالماك الخاص بها في رسالة خاصة (ARP Reply Unicast)',
        stageTitleEn: 'Host B Unicast ARP Reply & Cache Update',
        stageDescriptionAr: 'سارة ترسل رد ARP مباشر لأحمد: "أنا 192.168.1.20 وعنوان الماك الخاص بي هو BB:BB:BB:22:22:22". الرد هو Unicast مباشر لأحمد عبر السويتش.',
        layer: 'Layer 2 (Data Link)',
        activeNodeId: 'host-b',
        fromNodeId: 'host-b',
        toNodeId: 'host-a',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'BB:BB:BB:22:22:22 (Sara)',
            destMac: 'AA:AA:AA:11:11:11 (Ahmed)',
            etherType: '0x0806 (ARP)',
            fcs: '0x0000',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.20',
            destIp: '192.168.1.10',
            ttl: 1,
            protocol: 'ARP Reply',
            version: 'ARP'
          },
          payload: {
            type: 'ARP Reply',
            data: '192.168.1.20 is at BB:BB:BB:22:22:22',
            message: 'تم حفظ الماك في جدول الـ ARP Cache'
          }
        },
        explanation: {
          whatIsHappening: 'أحمد يستلم الرد، ويحفظ في ذاكرته (ARP Table): 192.168.1.20 -> BB:BB:BB:22:22:22 لمدة محددة (ARP Cache Timeout).',
          whyItHappens: 'حتى لا يضطر للصراخ والبث العام في كل مرة يريد إرسال رسالة لسارة في المستقبل.',
          realLifeParallel: 'دكتور خالد يأتي إليك ويعطيك بطاقة عمله برقم مكتبه، فتحفظها في مفكرتك.',
          keyObservation: 'طلب الـ ARP هو Broadcast، بينما رد الـ ARP هو Unicast ذكي ومباشر.'
        },
        highlightEvent: 'arp_reply',
        tableUpdate: {
          deviceType: 'host',
          deviceId: 'host-a',
          tableName: 'ARP Cache',
          entry: {
            key1: '192.168.1.20',
            key2: 'BB:BB:BB:22:22:22',
            extra: 'Type: Dynamic (Cached)'
          }
        }
      }
    ]
  },
  {
    id: 'default-gateway-ping',
    titleAr: 'فحص الاتصال بالبوابة الافتراضية (Host A -> Default Gateway Ping)',
    titleEn: 'Default Gateway Reachability & L2-to-L3 Handshake',
    badge: 'بسيط / أساسي (Simple)',
    difficulty: 'simple',
    difficultyAr: 'مستوى بسيط (Simple / Beginner)',
    category: 'end_to_end',
    categoryAr: 'فحص الاتصال الأساسي',
    descriptionAr: 'اختبار جاهزية البوابة الافتراضية للراوتر 192.168.1.1 والتأكد من صحة كابلات الشبكة وإعدادات الـ IP والـ ARP قبل الخروج للإنترنت.',
    sourceNodeId: 'host-a',
    destinationNodeId: 'router-1',
    packetType: 'ICMP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. إرسال طلب ICMP Echo للبوابة الافتراضية',
        stageTitleEn: 'Host A sends ICMP Echo to 192.168.1.1',
        stageDescriptionAr: 'أحمد يكتب الأمر ping 192.168.1.1. الحاسوب يوجه الفريم مباشرة إلى MAC منفذ الراوتر R1:R1:R1:11:11:11.',
        layer: 'Layer 3 (ICMP over L2)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 0.3,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'R1:R1:R1:11:11:11 (Router Gateway)',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.1',
            ttl: 64,
            protocol: 'ICMP (Ping)',
            version: 'IPv4'
          },
          payload: {
            type: 'ICMP Echo Request',
            data: 'Ping Default Gateway 32 bytes'
          }
        },
        explanation: {
          whatIsHappening: 'الحاسوب يفحص هل الراوتر متصل ومستجيب للطلبات.',
          whyItHappens: 'أول خطوة أساسية في استكشاف الأخطاء (Troubleshooting) هي التأكد من وصول الحزمة للبوابة.',
          realLifeParallel: 'تتصل بمكتب الاستقبال في البناية لتتأكد من فتح باب العمارة الخارجي.',
          keyObservation: 'IP الوجهة يطابق IP الراوتر المحلي مباشرة.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. الراوتر يستجيب ويرد بـ ICMP Echo Reply (255)',
        stageTitleEn: 'Router 1 Process ICMP & Sends Reply',
        stageDescriptionAr: 'الراوتر يستلم الفريم، يرى أن الـ IP يطابق منفذه Gi0/0، فيعالج الـ Ping داخل وحدة المعالجة ويرسل الرد فوراً (TTL=255).',
        layer: 'Layer 3 (ICMP Reply)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'host-a',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:R1:R1:11:11:11',
            destMac: 'AA:AA:AA:11:11:11',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.1',
            destIp: '192.168.1.10',
            ttl: 255,
            protocol: 'ICMP Reply',
            version: 'IPv4'
          },
          payload: {
            type: 'ICMP Echo Reply',
            data: 'Reply from 192.168.1.1: bytes=32 time<1ms TTL=255'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر أثبت جاهزيته للعمل وأعاد الرد لأحمد بنجاح.',
          whyItHappens: 'أنظمة Cisco IOS ترسل ردود الـ ICMP الخاصة بها بقيمة TTL افتراضية 255.',
          realLifeParallel: 'موظف الاستقبال يرد: "نعم الباب مفتوح والشارع سالك!".',
          keyObservation: 'قيمة TTL=255 تكشف أن الرد صادر مباشرة من معالج الراوتر وليس جهازاً وسيطاً.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'inter-vlan-routing',
    titleAr: 'توجيه البيانات بين الـ VLANs المختلفة (Inter-VLAN Routing & 802.1Q)',
    titleEn: 'Inter-VLAN Routing (Router-on-a-Stick & 802.1Q Trunk)',
    badge: 'معقد / متقدم (Complex)',
    difficulty: 'complex',
    difficultyAr: 'مستوى متوسط / معقد (Intermediate)',
    category: 'switching',
    categoryAr: 'شبكات الـ VLAN والترانك',
    descriptionAr: 'حاسوب الهندسة (VLAN 10) يحتاج للتحدث مع حاسوب المبيعات (VLAN 20). السويتش يعزل البث بينهما، فيعبر الفريم كابل الـ Trunk عبر 802.1Q Tag إلى الراوتر ليقوم بالتوجيه بين الشبكات الفرعية!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'host-b',
    packetType: '802.1Q Dot1Q',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. فريم VLAN 10 يخرج موسوماً بـ 802.1Q Tag عبر الـ Trunk',
        stageTitleEn: 'VLAN 10 Tagging (802.1Q 4-byte header insertion)',
        stageDescriptionAr: 'حاسوب الهندسة يرسل لحاسوب المبيعات. السويتش يضيف وسم 802.1Q Tag (VLAN ID = 10) ويرسله عبر منفذ الـ Trunk Gi0/1 إلى الراوتر.',
        layer: 'Layer 2 (802.1Q Trunk)',
        activeNodeId: 'switch-1',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 0.4,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'R1:R1:R1:11:11:11',
            etherType: '0x8100 (802.1Q Tagged)',
            vlanId: 10,
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.10.10 (VLAN 10)',
            destIp: '192.168.20.20 (VLAN 20)',
            ttl: 64,
            protocol: 'TCP Data',
            version: 'IPv4'
          },
          payload: {
            type: 'Inter-VLAN Packet',
            data: 'VLAN 10 to VLAN 20 Data'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش يضع بطاقة 802.1Q برقم الـ VLAN حتى يعلم الراوتر أي منفذ وهمي (Sub-interface) يستقبل الحزمة.',
          whyItHappens: 'بدون الراوتر لا يمكن لأي جهاز في VLAN 10 أن يتحدث مع VLAN 20.',
          realLifeParallel: 'وضع شريط بلون معين على الحقيبة لمعرفة القسم التابعة له في المطار.',
          keyObservation: 'ترويسة 802.1Q تضيف 4 بايتات إضافية للفريم تحدد معرف الـ VLAN.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. الراوتر يوجه الفريم بين الـ Sub-interfaces (Gi0/0.10 -> Gi0/0.20)',
        stageTitleEn: 'Sub-interface Decapsulation & Re-Tagging to VLAN 20',
        stageDescriptionAr: 'راوتر 1 يستلم الفريم على Gi0/0.10، يفك وسم VLAN 10، يفحص جدول التوجيه، يجد أن الوجهة في Gi0/0.20، فيضع وسم VLAN ID = 20 ويعيد إرسال الفريم عبر نفس الكابل الفيزيائي (Router-on-a-Stick)!',
        layer: 'Layer 3 (Inter-VLAN Routing)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'switch-1',
        progressPercentage: 0.8,
        headers: {
          l2: {
            srcMac: 'R1:R1:R1:11:11:11',
            destMac: 'BB:BB:BB:22:22:22',
            etherType: '0x8100 (802.1Q Tagged)',
            vlanId: 20,
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.10.10',
            destIp: '192.168.20.20',
            ttl: 63,
            protocol: 'TCP Data',
            version: 'IPv4'
          },
          payload: {
            type: 'Inter-VLAN Routed Response',
            data: 'Forwarded to VLAN 20 Sub-interface'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر قام بالتوجيه بين شبكتين وهميتين عبر كابل فيزيائي واحد باستخدام الـ Sub-interfaces.',
          whyItHappens: 'توفير كابلات ومنافذ الراوتر الباهظة الثمن.',
          realLifeParallel: 'موظف الاستعلامات يختم الورقة بنقلها من قسم الهندسة إلى قسم المبيعات.',
          keyObservation: 'الفريم دخل وخرج من نفس المنفذ الفيزيائي للراوتر، لكن برقم VLAN مختلف!'
        },
        highlightEvent: 'routing_hop'
      },
      {
        id: 3,
        stageTitleAr: '3. السويتش يزيل الوسم (Untag) ويسلم الفريم لحاسوب المبيعات',
        stageTitleEn: 'Switch Strips 802.1Q Tag & Access Port Delivery',
        stageDescriptionAr: 'السويتش يستلم الفريم الموسوم بـ VLAN 20، يبحث في جدول الـ CAM فيجده على المنفذ Access Fa0/2، يزيل وسم الـ 802.1Q Tag تماماً ويسلمه لسارة كفريم إيثرنت عادي.',
        layer: 'Layer 2 (Access Port Forwarding)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'host-b',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:R1:R1:11:11:11',
            destMac: 'BB:BB:BB:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.10.10',
            destIp: '192.168.20.20',
            ttl: 63,
            protocol: 'TCP Data',
            version: 'IPv4'
          },
          payload: {
            type: 'Delivered Data',
            data: 'Inter-VLAN Connection Successful'
          }
        },
        explanation: {
          whatIsHappening: 'أجهزة المستخدمين لا تفهم وسوم 802.1Q لذلك يزيلها السويتش قبل خروج الفريم من منفذ الـ Access.',
          whyItHappens: 'معايير IEEE 802.1Q تشترط أن تكون منافذ الـ Access Port غير موسومة (Untagged).',
          realLifeParallel: 'إزالة ملصق الشحن الخارجي قبل تسليم الهدية للعميل.',
          keyObservation: 'تم الاتصال بين شبكتين مختلفتين تماماً بنجاح وأمان.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'wan-failover-redundancy',
    titleAr: 'انقطاع رابط الـ WAN والتحويل للمسار البديل (Enterprise Failover & OSPF Re-Route)',
    titleEn: 'Enterprise Redundant WAN Link Failure & Fast OSPF Re-Convergence',
    badge: 'معقد جداً (Very Complex)',
    difficulty: 'very_complex',
    difficultyAr: 'مستوى متقدم جداً للمؤسسات (Very Complex / CCIE Enterprise)',
    category: 'failover',
    categoryAr: 'التعافي ومسارات الطوارئ',
    descriptionAr: 'سيناريو طوارئ حقيقي في مراكز البيانات: أثناء إرسال بيانات حساسة، ينقطع كابل الفايبر الأساسي (Primary WAN Serial0/1). شاهد كيف تكتشف الراوترات الفشل في أجزاء من الثانية، وتبدل جدول التوجيه إلى مسار الطوارئ الاحتياطي (Backup WAN Path) دون توقف الخدمة!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'OSPF Failover Data',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. انقطاع الرابط الأساسي وإرسال إشعار التغيير (LSU Topology Change)',
        stageTitleEn: 'Primary WAN Link Down & OSPF LSU Generation',
        stageDescriptionAr: 'انقطع كابل الفايبر الرئيسي بين R1 و R2. يكتشف R1 توقف نبضات الـ Keepalive فوراً، فيرسل حزمة Link-State Update (LSU Type 4) إلى جميع المنافذ المتبقية معلناً موت المسار الأساسي.',
        layer: 'Layer 3 (Routing Failover)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-1',
        progressPercentage: 0.2,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: '01:00:5E:00:00:05 (OSPF Multicast)',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1',
            destIp: '224.0.0.5 (All OSPF Routers)',
            ttl: 1,
            protocol: 'OSPF LSU (Link-State Update)',
            version: 'IPv4'
          },
          payload: {
            type: 'OSPF LSU',
            data: 'Link 203.0.113.0/30 is DOWN! Re-calculating SPF tree.',
            message: 'إنذار طوارئ: انقطاع المسار الرئيسي للـ WAN'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر يعلن فوراً عن تغيير الطوبولوجيا لبدء حساب المسار الاحتياطي.',
          whyItHappens: 'تجنب رمي الحزم في الثقب الأسود (Blackholing) عند تعطل أحد الكابلات.',
          realLifeParallel: 'إشارة لاسلكية من برج المراقبة تعلن إغلاق الطريق السريع بسبب صيانة طارئة وتوجيه الحركة للطريق الدائري.',
          keyObservation: 'بروتوكول OSPF يستجيب في زمن قياسي (Fast Convergence) مقارنة بـ RIP القديم.'
        },
        highlightEvent: 'routing_hop'
      },
      {
        id: 2,
        stageTitleAr: '2. إعادة تشغيل خوارزمية ديكسترا والتحويل لمسار النسخ الاحتياطي (Backup Link)',
        stageTitleEn: 'Dijkstra SPF Recalculation & Routing Table Injection',
        stageDescriptionAr: 'يقوم الراوتر R1 بحساب شجرة SPF جديدة، فيجد مسار الـ Backup الاحتياطي عبر شبكة الأقمار الصناعية / 5G WAN (203.0.114.2). يحدث جدول التوجيه فوراً ويحول الحزم للمسار الجديد!',
        layer: 'Layer 3 (Routing Table Update)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.6,
        headers: {
          l2: {
            srcMac: 'R1:BK:BK:11:11:11 (Backup Interface)',
            destMac: 'R2:BK:BK:22:22:22 (Backup Interface)',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10 (Host A)',
            destIp: '10.0.0.80 (Server)',
            ttl: 63,
            protocol: 'TCP Data Stream',
            version: 'IPv4'
          },
          payload: {
            type: 'Re-routed Payload',
            data: 'Active Data Stream on Backup WAN Link (Cost 20)'
          }
        },
        explanation: {
          whatIsHappening: 'الحزم أصبحت تسلك مسار الطوارئ دون أن يشعر المستخدم بأي انقطاع في الاتصال.',
          whyItHappens: 'مبدأ الوفرة العالية (High Availability & Enterprise Redundancy).',
          realLifeParallel: 'السيارة تنتقل فوراً إلى الطريق الدائري البديل وتصل لوجهتها بأمان.',
          keyObservation: 'جدول الـ Routing Table استبدل Next-Hop في أقل من 50 ميلي ثانية.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'Routing Table (Failover Route)',
          entry: {
            key1: '10.0.0.0/24 via 203.0.114.2',
            key2: 'Backup Serial0/2 [110/20]',
            extra: 'OSPF Re-converged'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. وصول الحزمة للسيرفر بنجاح عبر المسار الاحتياطي',
        stageTitleEn: 'Datacenter Ingestion via Redundant Path',
        stageDescriptionAr: 'يستقبل R2 الحزمة على منفذ الـ Backup، يمررها لسويتش السيرفرات، وتصل البيانات كاملة لسيرفر جوجل دون فقدان أي بايت.',
        layer: 'Layer 7 (Reliable Enterprise Transit)',
        activeNodeId: 'server-1',
        fromNodeId: 'router-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R2:R2:R2:22:22:22',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 62,
            protocol: 'TCP Enterprise Stream',
            version: 'IPv4'
          },
          payload: {
            type: 'Mission Critical Data',
            data: 'Transaction Committed Successfully via Redundant Path'
          }
        },
        explanation: {
          whatIsHappening: 'تم اختبار سيناريو الطوارئ المعقد بنجاح وتفادي كارثة انقطاع الشبكة.',
          whyItHappens: 'التصميم الهندسي المزدوج (Dual-Homed Enterprise Architecture).',
          realLifeParallel: 'المستشفى يستمر بالعمل عبر مولدات الطاقة الاحتياطية عند انقطاع الكهرباء العمومية.',
          keyObservation: 'توافر الخدمة 99.999% (Five Nines Availability) تحقق بفضل OSPF Failover.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'stp-loop-prevention',
    titleAr: 'منع الحلقات اللانهائية والتعافي السريع (STP Loop Prevention & Fast Convergence)',
    titleEn: 'Spanning Tree Protocol (IEEE 802.1w Rapid STP Loop Prevention & Convergence)',
    badge: 'معقد جداً (Very Complex)',
    difficulty: 'very_complex',
    difficultyAr: 'مستوى متقدم جداً للمؤسسات (Very Complex / CCIE Enterprise)',
    category: 'switching',
    categoryAr: 'حماية الطبقة الثانية من الانهيار',
    descriptionAr: 'وجود كابلين بين سويتشين يوفر الأمان لكنه يخلق حلقة قاتلة (Layer 2 Switching Loop) قد تدمر الشبكة بعاصفة إذاعية (Broadcast Storm) في 3 ثوانٍ! شاهد كيف يحجب STP أحد المنافذ (Blocking)، وكيف يفتحه فوراً عند انقطاع الكابل الأساسي.',
    sourceNodeId: 'host-a',
    destinationNodeId: 'host-b',
    packetType: 'STP BPDU',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. تبادل رسائل BPDU وحجب المنفذ المكرر لمنع اللوب (Blocking State)',
        stageTitleEn: 'BPDU Transmission & Alternate Port Blocking (Loop Prevention)',
        stageDescriptionAr: 'السويتشات تتبادل إطارات الـ BPDU كل ثانيتين. السويتش يكتشف مساراً دائرياً، فيقوم بروتوكول STP بحجب المنفذ Fa0/24 وتحويله إلى Alternate Blocking Port ليمنع ارتداد الفريمات.',
        layer: 'Layer 2 (STP Loop Suppression)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'switch-1',
        progressPercentage: 0.3,
        headers: {
          l2: {
            srcMac: '55:55:55:00:00:01',
            destMac: '01:80:C2:00:00:00 (STP Multicast)',
            etherType: '0x0026 (LLC STP)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: 'L2 Control Plane',
            destIp: 'Bridge Protocol Multicast',
            ttl: 1,
            protocol: 'STP Config BPDU',
            version: '802.1D/w'
          },
          payload: {
            type: 'STP Configuration BPDU',
            data: 'Root ID: 32768.5555.0000.0001 | Port Gi0/2: ALTERNATE (BLOCKING)'
          }
        },
        explanation: {
          whatIsHappening: 'المنفذ الاحتياطي أصبح معطلاً برمجياً عن نقل بيانات المستخدمين، لكنه يستمر باستقبال الـ BPDUs ليبقى متأهباً.',
          whyItHappens: 'في الطبقة الثانية لا يوجد TTL، وإذا لم يحجب المنفذ ستدور الفريمات إلى ما لا نهاية ويتوقف السويتش.',
          realLifeParallel: 'صمام أمان مغلق في شبكة مياه يمنع رجوع السوائل وتفجير الأنابيب.',
          keyObservation: 'المنفذ المحجوب يمنع اللوب ويحافظ على سلامة جدول الـ CAM.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. انقطاع الكابل الأساسي وانتقال المنفذ المحجوب إلى حالة التمرير (Forwarding)',
        stageTitleEn: 'Topology Change Notification (TCN) & Rapid Port Unblock',
        stageDescriptionAr: 'عند انقطاع الكابل الرئيسي، يستشعر بروتوكول RSTP ذلك فوراً، ويرسل Topology Change Notification (TCN)، وينقل المنفذ البديل مباشرة إلى حالة الـ Forwarding في جزء من الثانية!',
        layer: 'Layer 2 (Rapid Convergence)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'host-b',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: '55:55:55:00:00:01',
            destMac: 'BB:BB:BB:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.20',
            ttl: 64,
            protocol: 'ICMP Data',
            version: 'IPv4'
          },
          payload: {
            type: 'Data Traffic Restored',
            data: 'Port State: FORWARDING (RSTP Fast Convergence < 100ms)'
          }
        },
        explanation: {
          whatIsHappening: 'تم استعادة المسار الاحتياطي وتمرير البيانات دون أي انقطاع في الشبكة.',
          whyItHappens: 'بروتوكول Rapid STP (802.1w) يقوم بالتحويل المباشر في أجزاء من الثانية بدلاً من 30-50 ثانية في STP القديم.',
          realLifeParallel: 'فتح بوابة الطوارئ فور إغلاق البوابة الرئيسية لمرور المسافرين بسلاسة.',
          keyObservation: 'جدول الـ CAM تم مسحه وتحديثه فوراً عبر إشعار الـ TCN.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'enterprise-nat-pat',
    titleAr: 'ترجمة العناوين العامة والخاصة (Enterprise NAT / PAT & Port Overload)',
    titleEn: 'Enterprise NAT / PAT (Inside Local to Inside Global Translation)',
    badge: 'معقد جداً (Very Complex)',
    difficulty: 'very_complex',
    difficultyAr: 'مستوى متقدم جداً للمؤسسات (Very Complex / CCIE Enterprise)',
    category: 'security',
    categoryAr: 'الأمان وترجمة العناوين (NAT)',
    descriptionAr: 'حاسوب الموظف يملك IP خاص محجوب (192.168.1.10) غير قابل للتوجيه في الإنترنت العام (RFC 1918). شاهد كيف يقوم راوتر البوابة باستبدال العنوان بالـ Public IP الخارجي (203.0.113.1) وتخصيص منفذ فريد في جدول الـ NAT ثم عكس العملية عند الرد!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'NAT Translated TCP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. خروج الحزمة بعنوان خاص غير معترف به عالمياً (Inside Local)',
        stageTitleEn: 'Outbound Packet with RFC 1918 Private IP (192.168.1.10:49152)',
        stageDescriptionAr: 'حاسوب أحمد ينشئ جلسة TCP متجهة للإنترنت بمصدر 192.168.1.10 ومنفذ 49152. هذا الـ IP خاص ولا يمكن لراوترات الإنترنت توجيهه.',
        layer: 'Layer 3 (Private Subnet)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 0.3,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'R1:R1:R1:11:11:11',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10:49152 (Inside Local Private)',
            destIp: '10.0.0.80:80 (Inside Global Web)',
            ttl: 64,
            protocol: 'TCP SYN',
            version: 'IPv4'
          },
          payload: {
            type: 'TCP Session Request',
            data: 'HTTP Request from Private Workstation'
          }
        },
        explanation: {
          whatIsHappening: 'الحزمة تتجه للبوابة ليتم تطبيق سياسة الـ NAT Overload عليها.',
          whyItHappens: 'حماية الأجهزة الداخلية وتوفير عناوين الـ IPv4 العامة.',
          realLifeParallel: 'موظف يطلب من سنترال الشركة إجراء مكالمة خارجية برقم الشركة العام الموحد.',
          keyObservation: 'الراوتر هو الوحيد المخول بترجمة العناوين عند الحد الفاصل بين الشبكة والإنترنت.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. الراوتر يترجم العنوان ويسجل المنفذ في جدول الـ NAT Table (Inside Global)',
        stageTitleEn: 'NAT PAT Overload Translation (IP & Port Mapping)',
        stageDescriptionAr: 'راوتر 1 يستبدل 192.168.1.10:49152 بـ 203.0.113.1:10050، ويسجل المطابقة في جدول الـ NAT Translations، ثم يرسل الحزمة عبر خط الـ WAN بعنوانه العام الرسمي.',
        layer: 'Layer 3 (NAT Translation Engine)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'server-1',
        progressPercentage: 0.8,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1:10050 (Inside Global Public)',
            destIp: '10.0.0.80:80',
            ttl: 63,
            protocol: 'TCP SYN Translated',
            version: 'IPv4'
          },
          payload: {
            type: 'NAT Forwarded Packet',
            data: 'Translated Outbound Connection'
          }
        },
        explanation: {
          whatIsHappening: 'الإنترنت يرى فقط العنوان العام للراوتر (203.0.113.1) ولا يعلم شيئاً عن عنوان أحمد الداخلي.',
          whyItHappens: 'توفير حماية وأمان (Security Masking) بالإضافة للحفاظ على العناوين.',
          realLifeParallel: 'مندوب العلاقات العامة يمثل الشركة بهويته الرسمية دون الكشف عن تفاصيل الموظفين بالداخل.',
          keyObservation: 'جدول الـ NAT Table يحتوي الآن على قيد نشط: 192.168.1.10:49152 <-> 203.0.113.1:10050.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'NAT Translation Table (PAT)',
          entry: {
            key1: 'tcp 203.0.113.1:10050',
            key2: '192.168.1.10:49152',
            extra: 'State: Active Translation'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. عودة الرد وعكس الترجمة لحاسوب الموظف (De-NAT Inbound Lookup)',
        stageTitleEn: 'Inbound Return Packet Matching & De-Translation',
        stageDescriptionAr: 'سيرفر الويب يرد على 203.0.113.1:10050. الراوتر يبحث في جدول الـ NAT، يطابق المنفذ 10050 فيجد أنه يعود لأحمد (192.168.1.10:49152)، فيعكس الترجمة ويسلم الرد لأحمد بنجاح!',
        layer: 'Layer 7 (NAT Complete Cycle)',
        activeNodeId: 'host-a',
        fromNodeId: 'router-1',
        toNodeId: 'host-a',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:R1:R1:11:11:11',
            destMac: 'AA:AA:AA:11:11:11',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '10.0.0.80:80',
            destIp: '192.168.1.10:49152',
            ttl: 62,
            protocol: 'TCP SYN-ACK',
            version: 'IPv4'
          },
          payload: {
            type: 'NAT Response Received',
            data: 'HTTP Response de-translated and delivered to Private Host'
          }
        },
        explanation: {
          whatIsHappening: 'اكتملت دورة الـ NAT بنجاح وتم تسليم البيانات للجهاز الداخلي بأعلى درجات الأمان.',
          whyItHappens: 'الراوتر يحتفظ بجدول الجلسات المؤقت ويحذفه تلقائياً عند إغلاق اتصال الـ TCP.',
          realLifeParallel: 'موظف السنترال يحول المكالمة الواردة إلى تحويلة مكتب أحمد المباشرة.',
          keyObservation: 'هكذا تتصل ملايين الأجهزة بالإنترنت يومياً عبر عنوان IP عام واحد في المنزل أو الشركة!'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'bgp-ebgp-peering',
    titleAr: 'تبادل مسارات الإنترنت العالمية عبر BGP بين الأنظمة المستقلة (eBGP AS-Path)',
    titleEn: 'Border Gateway Protocol (eBGP) Inter-AS Route Exchange',
    badge: 'CCNP / CCIE Enterprise',
    difficulty: 'expert',
    difficultyAr: 'مستوى خبير (Expert / CCIE)',
    category: 'routing',
    categoryAr: 'توجيه الإنترنت المتقدم (BGP)',
    descriptionAr: 'مزود الخدمة الأول (AS 65001) يتبادل مسارات الإنترنت العالمية مع مزود الخدمة الثاني (AS 65002) عبر جلسة TCP Port 179 موثوقة مع فحص سمات AS_PATH و Next-Hop.',
    sourceNodeId: 'router-1',
    destinationNodeId: 'router-2',
    packetType: 'BGP Update',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. تأسيس جلسة TCP Port 179 وتبادل رسائل BGP OPEN',
        stageTitleEn: 'BGP TCP 3-Way Handshake & OPEN Message Negotiation',
        stageDescriptionAr: 'الراوتر R1 (AS 65001) يبدأ جلسة TCP على المنفذ 179 نحو R2 (AS 65002). بعد نجاح المصافحة، يرسل رسالة BGP OPEN تتضمن رقم الـ AS الخاص به ومؤقت الـ Hold Time (180s).',
        layer: 'Layer 7 (BGP Application over TCP)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.3,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1:179',
            destIp: '203.0.113.2:179',
            ttl: 1, // eBGP multihop defaults to TTL 1
            protocol: 'TCP (Port 179)',
            version: 'IPv4'
          },
          payload: {
            type: 'BGP OPEN Message',
            data: 'Version: 4, My AS: 65001, Hold Time: 180, BGP Identifier: 192.168.1.1',
            message: 'تفاوض معايير الجلسة بين الأنظمة المستقلة'
          }
        },
        explanation: {
          whatIsHappening: 'BGP يعتمد على TCP Port 179 لضمان وصول التحديثات بدون الحاجة لبروتوكول موثوقية خاص به.',
          whyItHappens: 'الراوترات بين الدول تحتاج جلسة آمنة ومستقرة تدوم لشهور وسنوات دون انقطاع.',
          realLifeParallel: 'سفير دولة يقدم أوراق اعتماده الرسمية ووثائق السفارة لوزارة خارجية الدولة المجاورة.',
          keyObservation: 'قيمة TTL=1 افتراضياً في eBGP لحماية الراوترات من الهجمات البعيدة ما لم يتم تفعيل ebgp-multihop.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'BGP Neighbor Table',
          entry: {
            key1: 'Neighbor: 203.0.113.2',
            key2: 'Remote AS: 65002',
            extra: 'State: OpenSent -> OpenConfirm'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. إعلان المسارات العالمية عبر BGP UPDATE مع خاصية AS_PATH',
        stageTitleEn: 'BGP UPDATE Advertisement & AS_PATH Attribute Prepended',
        stageDescriptionAr: 'الراوتر R1 يعلن عن بادئة الشبكة 192.168.1.0/24 للراوتر R2، ويضيف رقم الـ AS الخاص به (65001) في مقدمة سمة AS_PATH لمنع الحلقات.',
        layer: 'Layer 7 (BGP Path Vector)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.7,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1:179',
            destIp: '203.0.113.2:179',
            ttl: 1,
            protocol: 'TCP (Port 179)',
            version: 'IPv4'
          },
          payload: {
            type: 'BGP UPDATE',
            data: 'NLRI: 192.168.1.0/24 | Path Attributes: ORIGIN=IGP, AS_PATH=[65001], NEXT_HOP=203.0.113.1',
            message: 'إعلان مسار الشبكة إلى مزود الخدمة المجاور'
          }
        },
        explanation: {
          whatIsHappening: 'R1 يخبر R2: "إذا أردت الوصول لشبكة 192.168.1.0/24، أرسل البيانات لي عبر AS 65001".',
          whyItHappens: 'تسمح سمة AS_PATH لكل راوتر بمعرفة المسار الكامل وتجنب الحلقات (Loop Prevention).',
          realLifeParallel: 'ختم جواز السفر في كل مطار؛ إذا وجد المطار ختمه الخاص مسبقاً يرفض الدخول لمنع الدوران اللانهائي!',
          keyObservation: 'BGP هو بروتوكول Path Vector وليس Link-State، فهو يرى العالم كمجموعة أرقام AS.'
        },
        highlightEvent: 'routing_hop'
      },
      {
        id: 3,
        stageTitleAr: '3. تثبيت المسار في جدول الـ BGP Table وجدول التوجيه الرئيسي (BGP -> RIB)',
        stageTitleEn: 'BGP Best Path Selection & RIB Installation (AD=20 for eBGP)',
        stageDescriptionAr: 'الراوتر R2 يفحص خوارزمية أفضل مسار في BGP (Weight -> Local Pref -> AS_PATH -> MED). المسار صالح ويفوز ليتم تثبيته في جدول التوجيه بقيمة Admin Distance = 20.',
        layer: 'Layer 3 (Routing Information Base)',
        activeNodeId: 'router-2',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1:179',
            destIp: '203.0.113.2:179',
            ttl: 1,
            protocol: 'BGP KEEPALIVE',
            version: 'IPv4'
          },
          payload: {
            type: 'BGP KEEPALIVE & Routing Update',
            data: 'Network: 192.168.1.0/24 via 203.0.113.1 [AD: 20 / Metric: 0]',
            message: 'تم تثبيت مسار الإنترنت العالمي في جدول التوجيه!'
          }
        },
        explanation: {
          whatIsHappening: 'أصبح راوتر السحابة R2 قادراً على توجيه أي حزمة إنترنت قادمة نحو شبكة الشركة 192.168.1.0/24.',
          whyItHappens: 'بروتوكول eBGP يمتلك Admin Distance = 20، مما يجعله مفضلاً على معظم البروتوكولات الأخرى.',
          realLifeParallel: 'تحديث خارطة الملاحة الجوية الدولية بإضافة مسار جوي جديد معتمد رسمياً بين العاصمتين.',
          keyObservation: 'تكتمل الجلسة بإرسال رسائل BGP Keepalive كل 60 ثانية للحفاظ على استقرار الجلسة.'
        },
        highlightEvent: 'destination_reached',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-2',
          tableName: 'IP Routing Table (BGP Route)',
          entry: {
            key1: 'B 192.168.1.0/24 [20/0]',
            key2: 'via 203.0.113.1, Serial0/1',
            extra: 'AS-Path: 65001'
          }
        }
      }
    ]
  },
  {
    id: 'ipsec-vpn-tunnel',
    titleAr: 'تشفير وحماية البيانات عبر نفق IPsec Site-to-Site (ESP Encryption)',
    titleEn: 'IPsec Site-to-Site VPN Tunneling (IKEv2 & AES-256 ESP)',
    badge: 'الأمان والشبكات الافتراضية (Security)',
    difficulty: 'expert',
    difficultyAr: 'مستوى خبير (Expert / CCNP Security)',
    category: 'end_to_end',
    categoryAr: 'أنفاق التشفير الآمنة (IPsec VPN)',
    descriptionAr: 'حاسوب الفرع يرسل ملفاً سرياً إلى السيرفر الرئيسي. الراوتر يقوم بتشفير الحزمة بالكامل بخوارزمية AES-256 وتغليفها داخل ترويسة ESP لمنع التنصت والتلاعب في الإنترنت العام!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'IPsec ESP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. مطابقة حركة المرور المثيرة للاهتمام (Interesting Traffic Match)',
        stageTitleEn: 'ACL Match: 192.168.1.0/24 to 10.0.0.0/24',
        stageDescriptionAr: 'حاسوب أحمد يرسل حزمة نصية عادية غير مشفرة نحو 10.0.0.80. راوتر الفرع R1 يفحص الـ Crypto Access-List ويجد أن الحزمة مطابقة لشرط التشفير الإجباري!',
        layer: 'Layer 3 (Crypto Policy Inspection)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 0.25,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'R1:R1:R1:11:11:11',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 64,
            protocol: 'TCP (Port 445 / SMB File)',
            version: 'IPv4'
          },
          payload: {
            type: 'Confidential Document Payload',
            data: 'Salary_Report_2026.pdf (Cleartext Payload before Encryption)',
            message: 'ملف سري بحاجة إلى حماية أثناء العبور عبر الإنترنت'
          }
        },
        explanation: {
          whatIsHappening: 'الحزمة تخرج من جهاز المستخدم نقية وعادية، لكن الراوتر يتعرف عليها كمحتوى مشفر مخصص للنفق.',
          whyItHappens: 'توفير التشفير على مستوى البوابة (Gateway-to-Gateway) دون إرهاق أجهزة المستخدمين.',
          realLifeParallel: 'موظف يكتب رسالة سرية ويسلمها لفرع الشركة الداخلي لتقوم بوضعها في حقيبة دبلوماسية مصفحة.',
          keyObservation: 'قائمة التحكم بالوصول (Crypto ACL) هي الزناد (Trigger) الذي يشغل نفق الـ IPsec.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. تشفير الحمولة وإضافة ترويسة ESP جديدة (ESP Tunnel Mode)',
        stageTitleEn: 'AES-256-GCM Encryption & New Public Outer IP Header Added',
        stageDescriptionAr: 'راوتر R1 يشفر حزمة IP الأصلية بالكامل باستخدام مفتاح SA المشترك، ويضيف ترويسة IPsec ESP (Protocol 50)، ثم يضع ترويسة IP عامة جديدة (203.0.113.1 -> 203.0.113.2).',
        layer: 'Layer 3 (IPsec ESP Protocol 50)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.65,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1 (Outer Public Gateway IP)',
            destIp: '203.0.113.2 (Outer Public Remote Peer)',
            ttl: 63,
            protocol: 'ESP (IP Protocol 50)',
            version: 'IPv4'
          },
          payload: {
            type: 'Encrypted ESP Ciphertext + HMAC-SHA256 Auth Tag',
            data: '0x9E7A31BCF8201... [AES-256 Encrypted Payload: Original IPs 192.168.1.10 -> 10.0.0.80 Hidden!]',
            message: 'الحزمة مشفرة تماماً ولا يمكن لأي متطفل في الإنترنت قراءة محتواها أو معرفة الـ IPs الداخلية!'
          }
        },
        explanation: {
          whatIsHappening: 'حزمة الـ IP الأصلية وعناوينها الداخلية أصبحت مخفية تماماً داخل التشفير العسكري.',
          whyItHappens: 'وضع النفق (Tunnel Mode) يضمن السرية التامة (Confidentiality) وسلامة البيانات (Integrity).',
          realLifeParallel: 'سيارة مصفحة تنقل الأموال في شوارع المدينة العامة؛ لا أحد في الشارع يرى ما بداخلها.',
          keyObservation: 'ترويسة ESP تحتوي على SPI (Security Parameter Index) ورقم تسلسلي لمنع هجمات إعادة الإرسال (Anti-Replay).'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'IPsec Security Association (SA)',
          entry: {
            key1: 'Tunnel Peer: 203.0.113.2',
            key2: 'Transform: AES-256-GCM / SHA256',
            extra: 'Packets Encrypted: +1'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. فك التشفير في الطرف المستلم وتسليم الملف للسيرفر (Decapsulation & Delivery)',
        stageTitleEn: 'R2 Inbound Decryption, Anti-Replay Check & Internal Delivery',
        stageDescriptionAr: 'راوتر R2 يستقبل حزمة ESP، يتحقق من توقيع HMAC، ويفك تشفير AES باستخدام مفتاح الـ SA، ثم يستخرج حزمة IP الأصلية ويسلمها عبر سويتش السيرفرات إلى سيرفر الملفات بأمان تام!',
        layer: 'Layer 7 (Plaintext Application Delivery)',
        activeNodeId: 'server-1',
        fromNodeId: 'router-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R2:R2:R2:22:22:22',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 62,
            protocol: 'TCP (Port 445)',
            version: 'IPv4'
          },
          payload: {
            type: 'Decrypted Original File Payload',
            data: 'Salary_Report_2026.pdf (Decrypted and Validated Successfully)',
            message: 'تم تسليم الملف للسيرفر بنجاح وأمان تام!'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر الثاني أعاد الحزمة إلى شكلها الأصلي وسلمها للسيرفر الداخلي.',
          whyItHappens: 'السيرفر لا يعلم أن الحزمة كانت مشفرة عبر الإنترنت؛ يراها وكأنها قادمة من نفس المبنى!',
          realLifeParallel: 'موظف الاستقبال في المقر الرئيسي يفتح الحقيبة الدبلوماسية بالمفتاح ويسلم الملف لمدير الحسابات.',
          keyObservation: 'هكذا تضمن الشركات الكبرى ربط مئات الفروع حول العالم بأمان عبر الإنترنت العام.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'hsrp-gateway-failover',
    titleAr: 'توفير التكرار والجاهزية العالية للبوابة الافتراضية (HSRP Active / Standby Failover)',
    titleEn: 'Hot Standby Router Protocol (HSRP) High Availability & Virtual MAC Failover',
    badge: 'الجاهزية العالية (High Availability)',
    difficulty: 'intermediate',
    difficultyAr: 'مستوى متوسط (Intermediate / CCNP)',
    category: 'routing',
    categoryAr: 'بروتوكولات البوابة الافتراضية (FHRP)',
    descriptionAr: 'راوتران يشتركان في عنوان IP افتراضي (192.168.1.1) وعنوان Virtual MAC (0000.0c07.ac01). عند انقطاع الراوتر النشط (Active)، يستلم الراوتر الاحتياطي (Standby) التوجيه فوراً دون انقطاع اتصال المستخدمين!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'HSRP Hello / Failover',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. حاسوب الموظف يوجه البيانات للعنوان الافتراضي (Virtual IP / MAC)',
        stageTitleEn: 'Host A Arp for Virtual Gateway 192.168.1.1 -> 0000.0c07.ac01',
        stageDescriptionAr: 'حاسوب أحمد مضبوط على البوابة الافتراضية 192.168.1.1. يرسل الفريم إلى عنوان الـ Virtual MAC الخاص بمجموعة HSRP (0000.0c07.ac01) التي يخدمها حالياً الراوتر النشط R1 (Priority 110).',
        layer: 'Layer 2 (HSRP Virtual MAC Addressing)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 0.3,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: '0000.0c07.ac01 (HSRP Group 1 Virtual MAC)',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 64,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'User Data Payload',
            data: 'GET /cloud-service HTTP/1.1'
          }
        },
        explanation: {
          whatIsHappening: 'أحمد لا يوجه لحساب راوتر فيزيائي محدد، بل يوجه للكيان الوهمي (Virtual Gateway).',
          whyItHappens: 'إذا تعطل الراوتر الفيزيائي لا يضطر مهندس الشبكة لتغيير إعدادات آلاف الأجهزة يدوياً.',
          realLifeParallel: 'الاتصال برقم الطوارئ الموحد 911؛ يجيبك الموظف الأول المتاح دون أن تعرف اسمه الشخصي.',
          keyObservation: 'صيغة HSRP v1 MAC هي دائماً: 0000.0c07.acXX حيث XX هو رقم المجموعة بنظام Hex.'
        },
        highlightEvent: 'switch_forward',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'HSRP Group 1 Status',
          entry: {
            key1: 'Virtual IP: 192.168.1.1',
            key2: 'State: Active (Priority 110)',
            extra: 'Virtual MAC: 0000.0c07.ac01'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. انقطاع كابل الراوتر النشط وغياب نبضات HSRP Hello',
        stageTitleEn: 'Active Router Failure & Holddown Timer Expiration (10s)',
        stageDescriptionAr: 'ينقطع الخط الفيزيائي للراوتر النشط R1. يتوقف R1 عن إرسال رسائل HSRP Hello الدورية إلى 224.0.0.2 (Port UDP 1985). ينقضي مؤقت Holddown (10 ثوانٍ) لدى الراوتر الاحتياطي R2.',
        layer: 'Layer 7 (HSRP State Machine)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.6,
        headers: {
          l2: {
            srcMac: 'R2:WW:WW:22:22:22',
            destMac: '01:00:5E:00:00:02 (Multicast)',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.254 (Standby Router Physical IP)',
            destIp: '224.0.0.2 (All Routers Multicast)',
            ttl: 1,
            protocol: 'UDP Port 1985 (HSRP Coup/Hello)',
            version: 'IPv4'
          },
          payload: {
            type: 'HSRP State Change: Standby -> Active',
            data: 'State: ACTIVE, Priority: 100, Group: 1, Virtual IP: 192.168.1.1',
            message: 'الراوتر الاحتياطي يعلن نفسه راوتراً نشطاً جديداً للشبكة!'
          }
        },
        explanation: {
          whatIsHappening: 'R2 اكتشف سقوط R1 بعد 3 نبضات مفقودة، فقرر استلام القيادة فوراً.',
          whyItHappens: 'منع توقف أعمال الشركة وضمان عدم فقدان الاتصال بالإنترنت.',
          realLifeParallel: 'طيار مساعد يمسك بمقود الطائرة فوراً عند إغماء الطيار الرئيسي دون أن يشعر الركاب بأي اهتزاز.',
          keyObservation: 'HSRP يرسل Hello كل 3 ثوانٍ مع Hold time 10 ثوانٍ افتراضياً.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-2',
          tableName: 'HSRP Group 1 Status',
          entry: {
            key1: 'Virtual IP: 192.168.1.1',
            key2: 'State: Active (Promoted!)',
            extra: 'Sending Gratuitous ARP for 0000.0c07.ac01'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. الراوتر الاحتياطي يرسل Gratuitous ARP ويستلم كل حركة المرور بسلاسة',
        stageTitleEn: 'Gratuitous ARP (GARP) Broadcast & Zero-Downtime Traffic Redirection',
        stageDescriptionAr: 'الراوتر R2 يرسل فريم Gratuitous ARP للسويتش ليحدث جدول CAM بأن الـ Virtual MAC (0000.0c07.ac01) انتقل لمنفذه. حاسوب أحمد يستمر بإرسال البيانات لتصل للسيرفر بدون أي انقطاع!',
        layer: 'Layer 2 / Layer 3 (High Availability Complete)',
        activeNodeId: 'router-2',
        fromNodeId: 'router-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: '0000.0c07.ac01',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 63,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'Continuous Active Stream',
            data: 'HTTP Traffic routed seamlessly via Standby Router (Now Active)',
            message: 'تم تجاوز العطل بنجاح بدون توقف أي برنامج في الشركة!'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش حدث منفذ الـ Virtual MAC في الملي ثانية الأولى، وتدفقت البيانات بشكل طبيعي.',
          whyItHappens: 'بروتوكول GARP يوجه السويتش لتحديث جدول المنافذ فوراً دون انتظار انقضاء وقت الـ MAC Aging.',
          realLifeParallel: 'تحويل مسار حركة المرور لشارع بديل مجهز مسبقاً بإشارات ضوئية فورية.',
          keyObservation: 'الحاسوب لم يغير أي إعداد (لم يغير IP ولا MAC البوابة) وتم تجاوز العطل الشامل!'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'eigrp-dual-convergence',
    titleAr: 'حساب المسارات الفوري وخوارزمية DUAL في بروتوكول EIGRP',
    titleEn: 'EIGRP DUAL Convergence & Feasible Successor Instant Switchover',
    badge: 'CCNP Enterprise Core',
    difficulty: 'complex',
    difficultyAr: 'مستوى متقدم (Advanced / CCNP)',
    category: 'routing',
    categoryAr: 'توجيه سيسكو المتقدم (EIGRP DUAL)',
    descriptionAr: 'حساب التكلفة المركبة (Composite Metric) والتحقق من شرط الجدوى (Feasibility Condition: AD < FD) لاختيار المسار الاحتياطي الفوري (Feasible Successor) بدون وقت تأخير!',
    sourceNodeId: 'router-1',
    destinationNodeId: 'router-2',
    packetType: 'EIGRP Update',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. تبادل رسائل EIGRP Hello واكتشاف الجار عبر 224.0.0.10',
        stageTitleEn: 'EIGRP Multicast Hello & RTP (Reliable Transport Protocol) Handshake',
        stageDescriptionAr: 'الراوتر R1 يرسل حزمة EIGRP Hello إلى عنوان الملتي كاست 224.0.0.10 (IP Protocol 88). يطابق معايير K-Values و AS Number مع R2 ويؤسس علاقة الجوار (Adjacency).',
        layer: 'Layer 3 (EIGRP Protocol 88)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.35,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: '01:00:5E:00:00:0A',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1',
            destIp: '224.0.0.10 (EIGRP All Routers Multicast)',
            ttl: 2,
            protocol: 'EIGRP (IP Protocol 88)',
            version: 'IPv4'
          },
          payload: {
            type: 'EIGRP Hello Packet',
            data: 'AS: 100, K-Values: [K1=1, K2=0, K3=1, K4=0, K5=0], Hold Time: 15s',
            message: 'اكتشاف ومطابقة معايير الجوار لـ EIGRP'
          }
        },
        explanation: {
          whatIsHappening: 'EIGRP يعمل مباشرة فوق بروتوكول IP برقم 88 ويستخدم بروتوكول نقل موثوق خاص به (RTP).',
          whyItHappens: 'توفير سرعة فائقة في معالجة التحديثات دون طبقة TCP/UDP إضافية.',
          realLifeParallel: 'اثنان من مأموري الشحن يتبادلان التحية ويتأكدان من تطابق دفاتر الرموز الرسمية.',
          keyObservation: 'يجب تطابق رقم الـ AS وقيم الـ K-Values بين الراوترين وإلا لن تتكون علاقة الجوار.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'EIGRP Neighbor Table',
          entry: {
            key1: 'Neighbor: 203.0.113.2',
            key2: 'Interface: Serial0/1',
            extra: 'SRTT: 12ms, RTO: 200ms'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. حساب معادلة المترك واختيار الـ Successor و Feasible Successor',
        stageTitleEn: 'Composite Metric Calculation: 256 * (10^7/MinBW + TotalDelay/10)',
        stageDescriptionAr: 'الراوتر يفحص المسارات لشبكة 10.0.0.0/24: المسار الرئيسي FD=30720 عبر Serial0/1 (Successor). المسار البديل AD=28160. بما أن AD (28160) < FD (30720)، يتحقق شرط الجدوى ويصبح Feasible Successor جاهزاً فوراً!',
        layer: 'Layer 3 (DUAL Finite State Machine)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.75,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '203.0.113.1',
            destIp: '203.0.113.2',
            ttl: 2,
            protocol: 'EIGRP (IP Protocol 88)',
            version: 'IPv4'
          },
          payload: {
            type: 'EIGRP DUAL Topology Evaluation',
            data: 'Primary Path: FD=30720 (Successor) | Backup Path: Reported Distance=28160 (Feasible Successor Qualified)',
            message: 'تحقق شرط الجدوى (FC: RD < FD) واختيار مسار بديل بدون حسابات إضافية'
          }
        },
        explanation: {
          whatIsHappening: 'خوارزمية DUAL تضمن عدم وجود أي حلقة (Loop-Free) في المسار الاحتياطي قبل استخدامه.',
          whyItHappens: 'تسمح لـ EIGRP بالتحويل للمسار البديل في أقل من 50 ميلي ثانية (Sub-second Convergence).',
          realLifeParallel: 'سائق سيارة يرى أن الطريق الفرعي أقصر ويضمن عدم وجود سد في نهايته، فيحفظه في باله كخطة طوارئ.',
          keyObservation: 'إذا تحقق شرط الجدوى لا يحتاج الراوتر لإرسال استفسارات (EIGRP Queries) لجميع الجيران.'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'EIGRP Topology Table',
          entry: {
            key1: '10.0.0.0/24 (Successors: 1, FD: 30720)',
            key2: 'via 203.0.113.2 (30720/28160), Serial0/1',
            extra: 'State: PASSIVE (Stable)'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. تثبيت مسار EIGRP في جدول التوجيه بقيمة Admin Distance = 90',
        stageTitleEn: 'EIGRP Route Installed in Routing Table (D 10.0.0.0/24 [90/30720])',
        stageDescriptionAr: 'المسار يثبت في جدول الـ IP Routing برمز D (مأخوذ من خوارزمية DUAL) وقيمة Admin Distance = 90 وتكلفة Metric = 30720.',
        layer: 'Layer 3 (IP Routing Table FIB)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 64,
            protocol: 'TCP / IP Forwarded',
            version: 'IPv4'
          },
          payload: {
            type: 'Forwarded Traffic via EIGRP Route',
            data: 'Packet forwarded seamlessly via optimized EIGRP metric path',
            message: 'تم توجيه البيانات بأعلى كفاءة عبر أفضل مسار محسوب'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر يستخدم أفضل مسار فاز في خوارزمية DUAL لتمرير البيانات الحقيقية.',
          whyItHappens: 'EIGRP يتميز بدمج مزايا Link-State ومزايا Distance-Vector (Advanced Distance Vector).',
          realLifeParallel: 'شاحنات البضائع تنطلق عبر أسرع طريق معبد متاح مع الاستعداد الفوري للمنعطف البديل.',
          keyObservation: 'رمز EIGRP في جدول التوجيه هو D لأن حرف E محجوز مسبقاً لـ EGP.'
        },
        highlightEvent: 'destination_reached',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'IP Routing Table (EIGRP)',
          entry: {
            key1: 'D 10.0.0.0/24 [90/30720]',
            key2: 'via 203.0.113.2, 00:15:32, Serial0/1',
            extra: 'Next-Hop: 203.0.113.2'
          }
        }
      }
    ]
  },
  {
    id: 'mpls-l3vpn-label-switch',
    titleAr: 'توجيه الحزم السحابي عبر ملصقات MPLS L3VPN (2-Label Stacking & PHP)',
    titleEn: 'MPLS L3VPN Multi-Protocol Label Switching (VPN Label + Transport Label)',
    badge: 'CCIE Enterprise Core / Service Provider',
    difficulty: 'expert',
    difficultyAr: 'مستوى خبير (CCIE Expert)',
    category: 'routing',
    categoryAr: 'شبكات مزودي الخدمة (MPLS Core)',
    descriptionAr: 'حزم بيانات عميل معزولة في جدول VRF خاص تعبر شبكة مزود الخدمة باستخدام ملصقين (Outer Transport LDP Label + Inner VPN BGP Label) وتقنية Penultimate Hop Popping (PHP).',
    sourceNodeId: 'host-a',
    destinationNodeId: 'server-1',
    packetType: 'MPLS Shim Header',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. راوتر الدخول (Ingress PE) يضيف ملصق الـ VPN وملصق النقل (Push 2 Labels)',
        stageTitleEn: 'Ingress PE VRF Lookup & Label Imposition (Outer LDP 1005 + Inner VPN 201)',
        stageDescriptionAr: 'يستقبل راوتر PE1 الحزمة من العميل في جدول VRF-A. يطابق مسار MP-BGP ويضيف ملصق الـ VPN الداخلي (201) لتمييز العميل، ثم يضيف ملصق النقل الخارجي LDP (1005) لتوجيه الحزمة عبر قلب الشبكة.',
        layer: 'Layer 2.5 (MPLS Shim Header)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.35,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x8847 (MPLS Unicast)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10 (Client Customer Subnet)',
            destIp: '10.0.0.80 (Remote Site Server)',
            ttl: 64,
            protocol: 'TCP / HTTP',
            version: 'IPv4'
          },
          payload: {
            type: 'MPLS Label Stack [Outer: 1005, Inner: 201]',
            data: 'Outer Label: 1005 (LDP Transport to PE2) | Inner Label: 201 (VPNv4 Route Distinguisher RD 65000:1)',
            message: 'إضافة ملصقات MPLS للتوجيه السريع في قلب شبكة مزود الخدمة'
          }
        },
        explanation: {
          whatIsHappening: 'الراوتر أضاف ترويسة MPLS بطول 4 بايت لكل ملصق بين الطبقة 2 والطبقة 3 (Layer 2.5).',
          whyItHappens: 'عزل شبكات آلاف العملاء عن بعضهم وتوجيه الحزم بدون فحص جداول IP الضخمة.',
          realLifeParallel: 'وضع حقيبة العميل داخل صندوق شحن مرمز بملصق بوابة الطائرة وملصق هوية العميل السرية.',
          keyObservation: 'EtherType في إطار الإيثرنت يتحول من 0x0800 (IPv4) إلى 0x8847 (MPLS Unicast).'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'MPLS LFIB (Label Forwarding)',
          entry: {
            key1: 'Prefix: 10.0.0.0/24 (VRF-A)',
            key2: 'Out Label: [1005, 201]',
            extra: 'Next-Hop: 203.0.113.2'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. راوتر قلب الشبكة ينزع الملصق الخارجي (Penultimate Hop Popping - PHP)',
        stageTitleEn: 'Core P Router PHP: Pop Outer Label (Implicit Null 3) to offload Egress PE',
        stageDescriptionAr: 'راوتر قلب الشبكة يقرأ الملصق الخارجي فقط في عتاد الـ ASIC. يرى أن الملصق المطلوب هو Implicit Null 3، فيقوم بحذف الملصق الخارجي (Pop) ويرسل الحزمة بملصق الـ VPN الداخلي فقط نحو راوتر الخروج PE2.',
        layer: 'Layer 2.5 (MPLS PHP Popping)',
        activeNodeId: 'router-2',
        fromNodeId: 'router-1',
        toNodeId: 'router-2',
        progressPercentage: 0.75,
        headers: {
          l2: {
            srcMac: 'R1:WW:WW:11:11:11',
            destMac: 'R2:WW:WW:22:22:22',
            etherType: '0x8847',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 63,
            protocol: 'TCP / HTTP',
            version: 'IPv4'
          },
          payload: {
            type: 'MPLS Single Label [Inner: 201]',
            data: 'Outer transport label popped via PHP! Inner VPN label 201 remains for VRF-A demultiplexing.',
            message: 'حذف الملصق الخارجي لتخفيف معالجة راوتر الخروج النهائي'
          }
        },
        explanation: {
          whatIsHappening: 'تقنية PHP تجعل راوتر الخروج يقوم ببحث واحد فقط في جدول VRF بدلاً من بحثين متتاليين.',
          whyItHappens: 'تحسين أداء وسرعة راوترات الحافة في شبكات مزودي الخدمة (Service Providers).',
          realLifeParallel: 'عامل المطار يزيل بطاقة الشحن الجوي الخارجية قبل تسليم الحقيبة لباب صالة الوصول.',
          keyObservation: 'قيمة الملصق 3 محجوزة في المعايير العالمية لـ Implicit Null.'
        },
        highlightEvent: 'routing_hop'
      },
      {
        id: 3,
        stageTitleAr: '3. راوتر الخروج (Egress PE) يطابق ملصق VPN-201 ويسلم الحزمة لموقع العميل',
        stageTitleEn: 'Egress PE VRF Demux & Native IPv4 Delivery to Customer Site',
        stageDescriptionAr: 'راوتر PE2 يقرأ الملصق 201، يوجه الحزمة فوراً لجدول VRF-A، يزيل ملصق MPLS بالكامل ويعيد الحزمة إلى IPv4 نقي، ثم يسلمها لسيرفر العميل في الموقع البعيد!',
        layer: 'Layer 3 (Native IPv4 VRF Forwarding)',
        activeNodeId: 'server-1',
        fromNodeId: 'router-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'R2:R2:R2:22:22:22',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800 (Pure IPv4 Restored)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 62,
            protocol: 'TCP (HTTP)',
            version: 'IPv4'
          },
          payload: {
            type: 'Native Customer IP Packet Delivered',
            data: 'HTTP Request delivered seamlessly across private MPLS L3VPN cloud',
            message: 'تم تسليم البيانات للفرع الآخر بأقصى سرعة وأمان تام'
          }
        },
        explanation: {
          whatIsHappening: 'الحزمة عبرت قارة بأكملها عبر MPLS وخرجت للعميل وكأنهما متصلان بسلك مباشر.',
          whyItHappens: 'توفير خدمات الربط الشبكي المؤسسي للشركات متعددة الفروع (Enterprise MPLS WAN).',
          realLifeParallel: 'العميل يستلم حقيبته الخاصة في صالة الوصول دون أن يعرف تفاصيل طائرات الشحن التي نقلتها.',
          keyObservation: 'العميل يمكنه استخدام أي نطاق IP يريده حتى لو تكرر مع عميل آخر، بفضل جداول الـ VRF المعزولة.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'stp-loop-prevention',
    titleAr: 'منع الحلقات اللانهائية وعواصف البث عبر بروتوكول STP (802.1D / RSTP)',
    titleEn: 'Spanning Tree Protocol (STP) Root Bridge Election & Loop Blocking',
    badge: 'CCNA Switching Core',
    difficulty: 'intermediate',
    difficultyAr: 'مستوى متوسط (Intermediate / CCNA)',
    category: 'switching',
    categoryAr: 'حماية الطبقة الثانية (STP & Loop Prevention)',
    descriptionAr: 'عند وجود وصلات مكررة (Redundant Links) بين السويتشات، بروتوكول STP يتبادل رسائل BPDU لانتخاب السويتش الأب (Root Bridge) وحجب المنفذ المكرر (Blocking) لمنع عاصفة البث القاتلة (Broadcast Storm).',
    sourceNodeId: 'host-a',
    destinationNodeId: 'switch-1',
    packetType: 'STP BPDU',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. تبادل رسائل BPDU وانتخاب السويتش الأب (Root Bridge Election)',
        stageTitleEn: 'STP Configuration BPDU Exchange (Bridge Priority + Base MAC)',
        stageDescriptionAr: 'السويتشات تتبادل رسائل BPDU كل ثانيتين إلى عنوان الملتي كاست 01:80:C2:00:00:00. يفوز السويتش صاحب أقل Bridge ID (Priority 4096 + MAC) ليصبح هو الـ Root Bridge الرسمي للشبكة.',
        layer: 'Layer 2 (STP IEEE 802.1D)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'switch-2',
        progressPercentage: 0.35,
        headers: {
          l2: {
            srcMac: '55:55:55:00:00:01 (Switch 1)',
            destMac: '01:80:C2:00:00:00 (IEEE 802.1D BPDU Multicast)',
            etherType: '0x0026 (LLC Length)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '0.0.0.0 (Layer 2 Pure Frame)',
            destIp: '0.0.0.0',
            ttl: 0,
            protocol: 'STP BPDU (Protocol ID 0x0000)',
            version: 'N/A'
          },
          payload: {
            type: 'STP Config BPDU',
            data: 'Root Bridge ID: 4096.5555.5500.0001, Root Path Cost: 0, Port ID: 128.1, Hello: 2s, MaxAge: 20s, FwdDelay: 15s',
            message: 'انتخاب السويتش الأب وحساب تكاليف المنافذ'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش 1 يمتلك أولوية Priority = 4096 (أقل من الافتراضي 32768) لذلك تم اختياره كـ Root Bridge.',
          whyItHappens: 'تحديد نقطة مركزية خالية من الحلقات (Tree Topology) لحساب أقصر المسارات.',
          realLifeParallel: 'انتخاب عمدة المدينة ليكون المرجع الأعلى لتنظيم حركة السير في كل التقاطعات.',
          keyObservation: 'جميع منافذ الـ Root Bridge تكون دائماً في حالة Designated Port (Forwarding).'
        },
        highlightEvent: 'switch_forward',
        tableUpdate: {
          deviceType: 'switch',
          deviceId: 'switch-1',
          tableName: 'Spanning Tree Topology (VLAN 1)',
          entry: {
            key1: 'Root ID: 4096.5555.5500.0001 (This bridge is the root)',
            key2: 'Hello Time: 2 sec, Max Age: 20 sec',
            extra: 'Forward Delay: 15 sec'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. حجب المنفذ المكرر ووضعه في حالة Blocking لمنع الحلقات',
        stageTitleEn: 'Alternate / Blocking Port Transition to break physical switching loop',
        stageDescriptionAr: 'السويتش 2 يكتشف وجود مسارين متوازيين نحو الـ Root Bridge. المنفذ Gi0/1 صاحب التكلفة الأقل يصبح Root Port (Forwarding)، والمنفذ المكرر Gi0/2 يوضع في حالة Blocking لمنع الدوران اللانهائي!',
        layer: 'Layer 2 (Port State Machine)',
        activeNodeId: 'switch-2',
        fromNodeId: 'switch-1',
        toNodeId: 'switch-2',
        progressPercentage: 0.75,
        headers: {
          l2: {
            srcMac: '66:66:66:00:00:02 (Switch 2)',
            destMac: '01:80:C2:00:00:00',
            etherType: '0x0026',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '0.0.0.0',
            destIp: '0.0.0.0',
            ttl: 0,
            protocol: 'STP Port State Transition',
            version: 'N/A'
          },
          payload: {
            type: 'STP Port Status Update',
            data: 'Port Gi0/1: ROOT (FWD) | Port Gi0/2: ALTERNATE (BLK - Loop Blocked!)',
            message: 'تم كسر الحلقة الفيزيائية بنجاح ومنع تدمير الشبكة'
          }
        },
        explanation: {
          whatIsHappening: 'المنفذ المحجوب (Blocking) لا يمرر أي بيانات عادية ولا يتعلم ماك أدرس، لكنه يستمع لرسائل BPDU فقط.',
          whyItHappens: 'لو لم يتم حجب هذا المنفذ لتكررت فريمات الـ Broadcast ملايين المرات في ثانية واحدة وانهار المعالج.',
          realLifeParallel: 'وضع حاجز مروري أحمر على المخرج الدائري الثاني لتوجيه جميع السيارات في مسار آمن باتجاه واحد.',
          keyObservation: 'في حال انقطاع الكابل الأول، ينتقل المنفذ المحجوب تلقائياً إلى Forwarding خلال 30-50 ثانية (أو 1 ثانية في RSTP).'
        },
        highlightEvent: 'mac_learned',
        tableUpdate: {
          deviceType: 'switch',
          deviceId: 'switch-2',
          tableName: 'STP Interface Roles',
          entry: {
            key1: 'Gi0/1: Root Port (Forwarding, Cost: 4)',
            key2: 'Gi0/2: Alternate Port (Blocking, Discarding)',
            extra: 'Protection: Loop-Free State Active'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. تدفق بيانات المستخدم بأمان واستقرار تام في شبكة شجرية نقية',
        stageTitleEn: 'Stable Unicast & Broadcast Traffic Flow without Broadcast Storms',
        stageDescriptionAr: 'حاسوب أحمد يرسل فريم بث عام (Broadcast). الفريم يصل لجميع الأجهزة دون أن يدور في حلقة مفرغة، وتعمل الشبكة بأعلى درجات الاستقرار والموثوقية.',
        layer: 'Layer 2 (Stable Data Forwarding)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'switch-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: 'FF:FF:FF:FF:FF:FF',
            etherType: '0x0806 (ARP)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '192.168.1.255',
            ttl: 64,
            protocol: 'ARP Broadcast',
            version: 'IPv4'
          },
          payload: {
            type: 'Protected Broadcast Delivery',
            data: 'ARP Request delivered safely across Spanning Tree topology with 0 duplicate packets',
            message: 'تم تسليم البث لمرة واحدة فقط بنجاح تام وبدون تكرار'
          }
        },
        explanation: {
          whatIsHappening: 'الشبكة محمية بالكامل من عواصف البث مع الحفاظ على وجود كابل احتياطي جاهز للعمل عند الطوارئ.',
          whyItHappens: 'توفير التكرار الفيزيائي (Physical Redundancy) مع منع الحلقات المنطقية (Logical Loop-Free).',
          realLifeParallel: 'المدينة تمتلك جسراً احتياطياً مغلقاً بصيانة فورية يفتح في ثانية إذا حدث طارئ للجسر الرئيسي.',
          keyObservation: 'هذا هو المبدأ الأساسي الذي تقوم عليه كافة مراكز البيانات وشبكات الشركات في العالم.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'lacp-etherchannel-bundle',
    titleAr: 'دمج الكابلات ومضاعفة السرعة عبر بروتوكول LACP (802.3ad EtherChannel)',
    titleEn: 'Link Aggregation Control Protocol (LACP) PortChannel Bundling',
    badge: 'CCNP Switching & Data Center',
    difficulty: 'intermediate',
    difficultyAr: 'مستوى متوسط (Intermediate / CCNP)',
    category: 'switching',
    categoryAr: 'تجميع الوصلات (EtherChannel / LACP)',
    descriptionAr: 'دمج منفذين فيزيائيين (Gi0/1 + Gi0/2) في منفذ منطقي واحد (Port-Channel 1) عبر بروتوكول LACP القياسي لمضاعفة السرعة إلى 2 Gbps وتوزيع الأحمال ومنع حجب المنافذ بواسطة STP.',
    sourceNodeId: 'switch-1',
    destinationNodeId: 'switch-2',
    packetType: 'LACP 802.3ad',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. تفاوض LACP عبر منافذ Gigabit المتعددة (LACP Active Mode)',
        stageTitleEn: 'LACPDU Exchange to Negotiate Port-Channel Membership (Actor / Partner)',
        stageDescriptionAr: 'السويتش 1 يرسل حزم LACPDU عبر المنفذين Gi0/1 و Gi0/2 إلى عنوان الملتي كاست 01:80:C2:00:00:02. يتفاوض مع السويتش 2 للتحقق من تطابق السرعة (1Gbps)، والـ Duplex (Full)، ونوع الـ Trunk.',
        layer: 'Layer 2 (IEEE 802.3ad / 802.1AX)',
        activeNodeId: 'switch-1',
        fromNodeId: 'switch-1',
        toNodeId: 'switch-2',
        progressPercentage: 0.4,
        headers: {
          l2: {
            srcMac: '55:55:55:00:00:01',
            destMac: '01:80:C2:00:00:02 (Slow Protocols Multicast)',
            etherType: '0x8809 (LACP Slow Protocol)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '0.0.0.0',
            destIp: '0.0.0.0',
            ttl: 0,
            protocol: 'LACP Control Protocol',
            version: 'N/A'
          },
          payload: {
            type: 'LACPDU Negotiation Packet',
            data: 'Actor System ID: 32768.5555.5500.0001, Actor Port: Gi0/1 (Key 1), State: [Activity, Aggregation, Synchronization, Collecting, Distributing]',
            message: 'التفاوض على ضم المنفذين إلى الحزمة المنطقية'
          }
        },
        explanation: {
          whatIsHappening: 'السويتشات تتأكد من سلامة وتطابق إعدادات جميع الأسلاك قبل دمجها لتفادي أي عطل.',
          whyItHappens: 'منع تكوين حلقات في حال اختلاف إعدادات أحد المنافذ.',
          realLifeParallel: 'ربط حبلين متينين معاً لرفع حمولة مضاعفة مع التأكد من تساوي طول وقوة الحبلين.',
          keyObservation: 'نمط LACP Active يرسل حزم تفاوض دورية، بينما نمط Passive يستمع فقط.'
        },
        highlightEvent: 'switch_forward',
        tableUpdate: {
          deviceType: 'switch',
          deviceId: 'switch-1',
          tableName: 'EtherChannel Status',
          entry: {
            key1: 'Group 1: Port-channel 1 (SU - In Use)',
            key2: 'Protocol: LACP',
            extra: 'Ports: Gi0/1(P), Gi0/2(P) - Bandwidth: 2000 Mbps'
          }
        }
      },
      {
        id: 2,
        stageTitleAr: '2. دمج المنافذ في Port-Channel 1 منطقي واحد بسرعة 2 Gbps',
        stageTitleEn: 'Logical Port-Channel 1 Created & STP Sees 1 Single Virtual Link',
        stageDescriptionAr: 'تنجح المفاوضات ويتم إنشاء المنفذ المنطقي Po1. بروتوكول STP يرى الآن كابلاً واحداً فائق السرعة (2 Gbps)، وبالتالي لا يقوم بحجب أي من الكابلين، وتستفيد الشبكة من كامل السعة!',
        layer: 'Layer 2 (Port-Channel Virtual Interface)',
        activeNodeId: 'switch-2',
        fromNodeId: 'switch-1',
        toNodeId: 'switch-2',
        progressPercentage: 0.8,
        headers: {
          l2: {
            srcMac: '55:55:55:00:00:01',
            destMac: '66:66:66:00:00:02',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 64,
            protocol: 'TCP Data Stream (Load Balanced)',
            version: 'IPv4'
          },
          payload: {
            type: 'Port-Channel Data Frame',
            data: 'Traffic mapped to Gi0/1 using Source-Destination IP Hash Load Balancing Algorithm',
            message: 'توزيع حركة المرور على الكابلات باستخدام خوارزمية الهاش'
          }
        },
        explanation: {
          whatIsHappening: 'السويتش يوزع الحزم بين الكابلين اعتماداً على عناوين IP أو MAC لمنع إعادة ترتيب الحزم (Out of Order).',
          whyItHappens: 'مضاعفة الباندويث وتوفير مسار احتياطي فوري إذا انقطع أحد الكابلين دون فقدان أي حزمة.',
          realLifeParallel: 'فتح مسارين سريعين متوازيين على الطريق السريع، مع توجيه الشاحنات بالتساوي بين المسارين.',
          keyObservation: 'لو انقطع أحد الكابلين، تهبط السرعة إلى 1 Gbps وتستمر الشبكة في العمل بدون أي انقطاع ثانية واحدة!'
        },
        highlightEvent: 'mac_learned'
      },
      {
        id: 3,
        stageTitleAr: '3. نقل البيانات بأعلى سرعة وتحقيق توازن الأحمال والموثوقية العالية',
        stageTitleEn: 'High Throughput Data Forwarding with Instant Cable Cut Protection',
        stageDescriptionAr: 'تدفق بيانات الموظفين يعبر الـ Port-Channel 1 بأقصى سرعة 2 Gbps مع حماية كاملة ضد انقطاع أي كابل، مما يمنح مراكز البيانات كفاءة استثنائية.',
        layer: 'Layer 2 / Layer 3 (High Bandwidth Transport)',
        activeNodeId: 'server-1',
        fromNodeId: 'switch-2',
        toNodeId: 'server-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: '66:66:66:00:00:02',
            destMac: 'CC:CC:CC:88:88:88',
            etherType: '0x0800',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '192.168.1.10',
            destIp: '10.0.0.80',
            ttl: 63,
            protocol: 'TCP (Full Speed 2Gbps)',
            version: 'IPv4'
          },
          payload: {
            type: 'Aggregated Data Stream Delivery',
            data: 'HTTP Stream delivered with maximum bandwidth and zero bottleneck delay',
            message: 'تم تسليم البيانات بنجاح عبر مسار الـ EtherChannel المدمج'
          }
        },
        explanation: {
          whatIsHappening: 'اكتملت عملية التجميع بنجاح واستفاد الاتصال من السعة الكاملة.',
          whyItHappens: 'تلبية متطلبات التطبيقات الحديثة والسيرفرات الضخمة في مراكز البيانات.',
          realLifeParallel: 'استخدام أنبوبي مياه متجاورين في نفس المضخة لضخ ضعف كمية المياه في نفس الوقت.',
          keyObservation: 'LACP هو بروتوكول قياسي عالمي مفتوح (IEEE 802.3ad) متوافق مع كافة الشركات وليس سيسكو فقط.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  },
  {
    id: 'ipv6-slaac-ndp-discovery',
    titleAr: 'التكوين التلقائي واكتشاف الجيران في الجيل السادس (IPv6 SLAAC & ICMPv6 NDP)',
    titleEn: 'IPv6 SLAAC Autoconfiguration & NDP Neighbor Discovery (No Broadcast!)',
    badge: 'IPv6 Next Generation',
    difficulty: 'intermediate',
    difficultyAr: 'مستوى متوسط (Intermediate / CCNA)',
    category: 'end_to_end',
    categoryAr: 'بروتوكولات الجيل السادس (IPv6 NDP)',
    descriptionAr: 'الحاسوب المنضم لشبكة IPv6 يرسل Router Solicitation (RS) ويستلم بادئة الشبكة من الراوتر عبر Router Advertisement (RA)، ثم يولد عنوانه تلقائياً (SLAAC) ويكتشف ماك الأجهزة عبر ICMPv6 NDP بدون أي Broadcast!',
    sourceNodeId: 'host-a',
    destinationNodeId: 'router-1',
    packetType: 'ICMPv6 NDP',
    steps: [
      {
        id: 1,
        stageTitleAr: '1. الحاسوب يطلب بادئة الشبكة عبر Router Solicitation (RS)',
        stageTitleEn: 'Host sends ICMPv6 Type 133 Router Solicitation to FF02::2 (All Routers)',
        stageDescriptionAr: 'حاسوب أحمد ينشئ عنوان Link-Local (FE80::) ثم يرسل حزمة ICMPv6 Router Solicitation إلى عنوان الملتي كاست الخاص بالراوترات FF02::2 ليطلب معايير الشبكة.',
        layer: 'Layer 3 (ICMPv6 Next Header 58)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 0.35,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: '33:33:00:00:00:02 (IPv6 All Routers Multicast MAC)',
            etherType: '0x86DD (IPv6)',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: 'fe80::aaaa:aaff:fe11:1111 (Host Link-Local)',
            destIp: 'ff02::2 (All IPv6 Routers Scope)',
            ttl: 255,
            protocol: 'ICMPv6 (Type 133 - Router Solicitation)',
            version: 'IPv6'
          },
          payload: {
            type: 'ICMPv6 RS Message',
            data: 'Options: Source Link-Layer Address (AA:AA:AA:11:11:11)',
            message: 'طلب بادئة شبكة IPv6 تلقائياً بدون الحاجة لسيرفر DHCP'
          }
        },
        explanation: {
          whatIsHappening: 'في IPv6 لا يوجد Broadcast إطلاقاً؛ يتم توجيه الطلب فقط للراوترات عبر Multicast مخصص.',
          whyItHappens: 'توفير استهلاك طاقة المعالجات في كل أجهزة الشبكة الأخرى التي لا تهتم بهذا الطلب.',
          realLifeParallel: 'طالب يدخل مبنى الكلية ويسأل مكتب الإرشاد المباشر: "ما هي الشعبة والقاعة المخصصة؟".',
          keyObservation: 'EtherType في الفريم هو 0x86DD المخصص لـ IPv6 بدلاً من 0x0800 لـ IPv4.'
        },
        highlightEvent: 'switch_forward'
      },
      {
        id: 2,
        stageTitleAr: '2. الراوتر يرد بـ Router Advertisement (RA) متضمناً بادئة الشبكة 2001:DB8:ACAD:1::/64',
        stageTitleEn: 'Router Advertisement (Type 134) with SLAAC Prefix & Default Gateway Info',
        stageDescriptionAr: 'الراوتر R1 يستجيب فوراً بحزمة ICMPv6 Router Advertisement (Type 134) معلناً بادئة الشبكة (2001:db8:acad:1::/64) وقيمة الـ MTU والبوابة الافتراضية.',
        layer: 'Layer 3 (ICMPv6 SLAAC Announcement)',
        activeNodeId: 'router-1',
        fromNodeId: 'router-1',
        toNodeId: 'host-a',
        progressPercentage: 0.7,
        headers: {
          l2: {
            srcMac: 'R1:R1:R1:11:11:11',
            destMac: '33:33:00:00:00:01 (All IPv6 Nodes Multicast)',
            etherType: '0x86DD',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: 'fe80::r1r1:r1ff:fe11:1111 (Router Link-Local Gateway)',
            destIp: 'ff02::1 (All IPv6 Nodes Multicast)',
            ttl: 255,
            protocol: 'ICMPv6 (Type 134 - Router Advertisement)',
            version: 'IPv6'
          },
          payload: {
            type: 'ICMPv6 RA Message',
            data: 'Prefix: 2001:db8:acad:1::/64, Valid Lifetime: 2592000s, Preferred: 604800s, Flags: [Autonomous A=1, Managed M=0, Other O=0]',
            message: 'إعلان معايير التكوين التلقائي لجميع أجهزة الشبكة'
          }
        },
        explanation: {
          whatIsHappening: 'حاسوب أحمد يستلم البادئة ويولد عنوانه العالمي 2001:db8:acad:1:aaaa:aaff:fe11:1111 تلقائياً (SLAAC).',
          whyItHappens: 'القضاء التام على صعوبة إعدادات الـ IP وتمكين مليارات أجهزة إنترنت الأشياء (IoT) من الاتصال فوراً.',
          realLifeParallel: 'موظف الإرشاد يعلن: "كود الحي هو 2001-أكاديمية، وكل شخص يدمج رقم هويته ليحصل على رمزه البريدي".',
          keyObservation: 'علم A=1 يخبر الجهاز بتوليد العنوان بنفسه (Stateless)، بينما M=1 يوجهه لسيرفر DHCPv6 (Stateful).'
        },
        highlightEvent: 'routing_hop',
        tableUpdate: {
          deviceType: 'router',
          deviceId: 'router-1',
          tableName: 'IPv6 Interface Neighbors',
          entry: {
            key1: 'fe80::aaaa:aaff:fe11:1111',
            key2: 'MAC: AA:AA:AA:11:11:11',
            extra: 'State: REACHABLE (Gi0/0)'
          }
        }
      },
      {
        id: 3,
        stageTitleAr: '3. فحص تكرار العنوان (DAD) وحل عناوين MAC عبر Neighbor Solicitation (NS / NA)',
        stageTitleEn: 'Duplicate Address Detection (DAD) & Neighbor Solicitation (Type 135/136)',
        stageDescriptionAr: 'الحاسوب يفحص خلو العنوان من التكرار عبر DAD، ثم عندما يريد مراسلة جهاز آخر يرسل Neighbor Solicitation (NS) للعنوان المستهدف ليستلم Neighbor Advertisement (NA) متضمناً الـ MAC بدون أي Broadcast!',
        layer: 'Layer 3 (ICMPv6 NDP Complete)',
        activeNodeId: 'host-a',
        fromNodeId: 'host-a',
        toNodeId: 'router-1',
        progressPercentage: 1,
        headers: {
          l2: {
            srcMac: 'AA:AA:AA:11:11:11',
            destMac: '33:33:FF:11:11:11 (Solicited-Node Multicast MAC)',
            etherType: '0x86DD',
            macLookupStatus: 'hit'
          },
          l3: {
            srcIp: '2001:db8:acad:1:aaaa:aaff:fe11:1111 (Global Unicast IP)',
            destIp: '2001:db8:acad:1::1 (Gateway IPv6)',
            ttl: 255,
            protocol: 'ICMPv6 Neighbor Discovery',
            version: 'IPv6'
          },
          payload: {
            type: 'ICMPv6 Echo Request over IPv6',
            data: 'PING6 2001:db8:acad:1::1 64 bytes - IPv6 Native Connectivity Active',
            message: 'اتصال IPv6 كامل ومستقر بدون أي بث عام (Broadcast-Free)'
          }
        },
        explanation: {
          whatIsHappening: 'بروتوكول NDP استبدل بروتوكول ARP القديم بالكامل بطريقة عصرية تعتمد على Solicited-Node Multicast.',
          whyItHappens: 'توفير حماية وأداء فائق لشبكات الجيل القادم وتوسيع نطاق العناوين إلى 340 أنديسليون عنوان.',
          realLifeParallel: 'إرسال رسالة نصية مشفرة مباشرة إلى هاتف الشخص المعني بدلاً من المناداة في مكبرات الصوت العامة.',
          keyObservation: 'أجهزة IPv6 تنشئ جدول IPv6 Neighbor Table كبديل متطور لجدول ARP Table.'
        },
        highlightEvent: 'destination_reached'
      }
    ]
  }
];

