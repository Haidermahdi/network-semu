import { NetworkTopology } from '../types';
import { INITIAL_NETWORK_NODES, NETWORK_LINKS } from './networkData';

export const NETWORK_TOPOLOGIES: NetworkTopology[] = [
  // 1. Enterprise End-to-End & WAN Core
  {
    id: 'enterprise-wan',
    titleAr: 'الشبكة المؤسسية الكبرى (Enterprise WAN Core)',
    titleEn: 'Enterprise End-to-End & WAN Transit Core',
    categoryAr: 'الشبكات الموسعة والربط المؤسسي',
    descriptionAr: 'مخطط شامل يحاكي شبكة مؤسسية كاملة: شبكة محلية LAN (VLAN 10)، وراوتر البوابة، وقلب شبكة WAN بروتوكول OSPF Area 0، وراوتر مركز البيانات، ومزرعة السيرفرات (VLAN 20).',
    descriptionEn: 'Full enterprise topology: campus LAN (VLAN 10), gateway router, WAN core (OSPF Area 0), data-center router, and server farm (VLAN 20).',
    badgeAr: 'CCNA/CCNP Core',
    badgeEn: 'CCNA/CCNP Core',
    iconName: 'Globe',
    defaultScenarioId: 'cross-network-journey',
    supportedScenarioIds: [
      'cross-network-journey',
      'inter-vlan-routing',
      'default-gateway-ping',
      'wan-failover-redundancy',
      'ipv6-slaac-ndp-discovery'
    ],
    featuresAr: ['VLAN 10 Access LAN', 'OSPF Area 0 WAN Core', 'VLAN 20 Server Farm', 'Inter-VLAN 802.1Q'],
    zones: [
      {
        id: 'zone-lan1',
        titleAr: 'VLAN 10 Engineering (LAN)',
        subtitleAr: 'Layer 2 Switched Domain',
        ipRange: '192.168.1.0/24',
        x: '1.5%',
        y: '8%',
        width: '33%',
        height: '84%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-wan',
        titleAr: 'OSPF Area 0 WAN Core',
        subtitleAr: 'High-Speed Optical WAN Transit Backbone',
        ipRange: '203.0.113.0/30',
        x: '36%',
        y: '14%',
        width: '36%',
        height: '72%',
        borderColor: 'border-indigo-500/20',
        bgColor: 'bg-indigo-950/10',
        textColor: 'text-indigo-300',
        badgeBg: 'border-indigo-500/30 text-indigo-300',
        pulseColor: 'bg-indigo-400'
      },
      {
        id: 'zone-lan2',
        titleAr: 'VLAN 20 Servers: 10.0.0.0/24',
        subtitleAr: 'Enterprise Server Farm & Cloud DC',
        ipRange: '10.0.0.0/24',
        x: '73.5%',
        y: '8%',
        width: '25%',
        height: '84%',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-950/10',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/30 text-purple-300',
        pulseColor: 'bg-purple-400'
      }
    ],
    nodes: INITIAL_NETWORK_NODES,
    links: NETWORK_LINKS
  },

  // 2. Local Campus Switching & ARP Laboratory
  {
    id: 'local-switching-arp',
    titleAr: 'الشبكة المحلية ومختبر ARP (Campus LAN & Switching)',
    titleEn: 'Local Campus LAN & ARP Resolution Lab',
    categoryAr: 'سويتشينغ الطبقة الثانية (Layer 2 Switching)',
    descriptionAr: 'مخطط مخصص لدراسة حركة الفريمات داخل نفس الشبكة المحلية: سويتش مركزي Cisco Catalyst يربط أجهزة المستخدمين وخادم الملفات المحلي، مع توضيح فحص جدول CAM وعملية بث واستجابة ARP.',
    descriptionEn: 'Local campus LAN lab: a Cisco Catalyst switch interconnects user hosts and a local file server, highlighting CAM learning and ARP request/reply.',
    badgeAr: 'L2 Local Domain',
    badgeEn: 'L2 Local Domain',
    iconName: 'Network',
    defaultScenarioId: 'arp-broadcast-resolution',
    supportedScenarioIds: ['arp-broadcast-resolution', 'same-lan-switching'],
    featuresAr: ['نطاق بث موحد (Broadcast Domain)', 'سويتش Cisco Catalyst 2960', 'اكتشاف العناوين الديناميكي CAM', 'بث ARP Broadcast'],
    zones: [
      {
        id: 'zone-campus-lan',
        titleAr: 'VLAN 10 Campus Engineering LAN',
        subtitleAr: 'Single Broadcast Domain & High-Speed L2 CAM Switching',
        ipRange: '192.168.1.0/24',
        x: '3%',
        y: '8%',
        width: '94%',
        height: '84%',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-950/10',
        textColor: 'text-emerald-300',
        badgeBg: 'border-emerald-500/30 text-emerald-300',
        pulseColor: 'bg-emerald-400'
      }
    ],
    nodes: [
      {
        id: 'host-a',
        name: 'Host A (كمبيوتر أحمد)',
        arName: 'حاسوب أحمد (المصدر)',
        type: 'host',
        ip: '192.168.1.10',
        mac: 'AA:AA:AA:11:11:11',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 18,
        y: 28,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/1' }]
      },
      {
        id: 'host-b',
        name: 'Host B (كمبيوتر سارة)',
        arName: 'حاسوب سارة (الهدف المطلوب)',
        type: 'host',
        ip: '192.168.1.20',
        mac: 'BB:BB:BB:22:22:22',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 18,
        y: 72,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/2' }]
      },
      {
        id: 'switch-1',
        name: 'Switch 1 (سويتش الدور الأول)',
        arName: 'سويتش الدور المركزي (Catalyst 2960)',
        type: 'switch',
        ip: '192.168.1.2 (Mgmt)',
        mac: '55:55:55:00:00:01',
        subnet: '255.255.255.0',
        x: 50,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 1, connectedTo: 'host-a', label: 'Fa0/1' },
          { portNumber: 2, connectedTo: 'host-b', label: 'Fa0/2' },
          { portNumber: 3, connectedTo: 'host-c', label: 'Fa0/3' },
          { portNumber: 24, connectedTo: 'server-1', label: 'Fa0/24' }
        ]
      },
      {
        id: 'host-c',
        name: 'Host C (كمبيوتر خالد)',
        arName: 'حاسوب خالد (يتجاهل الـ ARP)',
        type: 'host',
        ip: '192.168.1.30',
        mac: 'CC:CC:CC:33:33:33',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 82,
        y: 28,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/3' }]
      },
      {
        id: 'server-1',
        name: 'Local File Server (سيرفر الملفات)',
        arName: 'سيرفر الملفات والطابعة المحلية',
        type: 'server',
        ip: '192.168.1.50',
        mac: 'DD:DD:DD:44:44:44',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 82,
        y: 72,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/24' }]
      }
    ],
    links: [
      {
        id: 'link-ha-sw',
        fromId: 'host-a',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '100 Mbps',
        fromPort: 'eth0',
        toPort: 'Fa0/1'
      },
      {
        id: 'link-hb-sw',
        fromId: 'host-b',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '100 Mbps',
        fromPort: 'eth0',
        toPort: 'Fa0/2'
      },
      {
        id: 'link-hc-sw',
        fromId: 'host-c',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '100 Mbps',
        fromPort: 'eth0',
        toPort: 'Fa0/3'
      },
      {
        id: 'link-srv-sw',
        fromId: 'server-1',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'eth0',
        toPort: 'Fa0/24'
      }
    ]
  },

  // 3. STP / RSTP Redundant Loop Triangle
  {
    id: 'stp-triangle',
    titleAr: 'مثلث شجرة الامتداد (STP / RSTP Redundant Loop)',
    titleEn: 'Spanning Tree Protocol Redundant Loop Triangle',
    categoryAr: 'حماية وحلقات الطبقة الثانية (STP & RSTP)',
    descriptionAr: 'المخطط القياسي المعتمد في شهادات CCNA/CCNP: مثلث سويتشات ثلاثي بمسارات مكررة، يوضح انتخاب الـ Root Bridge وتحديد المنافذ المفتوحة (Designated/Root) وحجب المنفذ المكرر (Alternate/BLK) لمنع عاصفة البث اللانهائية.',
    descriptionEn: 'CCNA/CCNP standard redundant switch triangle: Root Bridge election, Designated/Root forwarding ports, and Alternate/BLK blocking to prevent broadcast storms.',
    badgeAr: 'Loop-Free 802.1D/w',
    badgeEn: 'Loop-Free 802.1D/w',
    iconName: 'ShieldCheck',
    defaultScenarioId: 'stp-loop-prevention',
    supportedScenarioIds: ['stp-loop-prevention', 'rstp-fast-convergence'],
    featuresAr: ['Root Bridge (Priority 24576)', 'Alternate/Blocked Port', 'BPDU Multicast Exchange', 'Zero Broadcast Storm'],
    zones: [
      {
        id: 'zone-root-bridge',
        titleAr: 'STP Root Bridge Control Plane',
        subtitleAr: 'Priority 24576 (MAC 00:01:00:00:00:01) - Master Timing Authority',
        ipRange: 'Bridge ID: 24576.0001',
        x: '25%',
        y: '6%',
        width: '50%',
        height: '35%',
        borderColor: 'border-amber-500/30',
        bgColor: 'bg-amber-950/10',
        textColor: 'text-amber-300',
        badgeBg: 'border-amber-500/40 text-amber-300',
        pulseColor: 'bg-amber-400'
      },
      {
        id: 'zone-blocked-segment',
        titleAr: 'Blocked Loop Segment (Alternate/BLK)',
        subtitleAr: 'Port Gi0/2 Discarding to prevent Loop',
        ipRange: 'Status: BLOCKING',
        x: '4%',
        y: '46%',
        width: '44%',
        height: '48%',
        borderColor: 'border-rose-500/20',
        bgColor: 'bg-rose-950/10',
        textColor: 'text-rose-300',
        badgeBg: 'border-rose-500/30 text-rose-300',
        pulseColor: 'bg-rose-400'
      },
      {
        id: 'zone-fwd-segment',
        titleAr: 'Active Forwarding Segment (DP / RP)',
        subtitleAr: 'Ports in Forwarding State',
        ipRange: 'Status: FORWARDING',
        x: '52%',
        y: '46%',
        width: '44%',
        height: '48%',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-950/10',
        textColor: 'text-emerald-300',
        badgeBg: 'border-emerald-500/30 text-emerald-300',
        pulseColor: 'bg-emerald-400'
      }
    ],
    nodes: [
      {
        id: 'switch-1',
        name: 'Switch 1 (Root Bridge)',
        arName: 'سويتش الجذر (Root Bridge - Priority 24576)',
        type: 'switch',
        ip: '192.168.1.1 (Root)',
        mac: '00:01:00:00:00:01',
        subnet: '255.255.255.0',
        x: 50,
        y: 22,
        status: 'root',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'switch-3', label: 'DP (Fwd)' },
          { portNumber: 'Gi0/2', connectedTo: 'switch-2', label: 'DP (Fwd)' }
        ]
      },
      {
        id: 'switch-3',
        name: 'Switch 3 (Access Switch)',
        arName: 'سويتش الوصول (SW-3 - Blocked Port)',
        type: 'switch',
        ip: '192.168.1.3',
        mac: '00:03:00:00:00:03',
        subnet: '255.255.255.0',
        x: 25,
        y: 66,
        status: 'blocked',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'switch-1', label: 'RP (Root Port)' },
          { portNumber: 'Gi0/2', connectedTo: 'switch-2', label: 'BLK (Alternate Port)' },
          { portNumber: 'Fa0/1', connectedTo: 'host-a', label: 'Access' }
        ]
      },
      {
        id: 'switch-2',
        name: 'Switch 2 (Designated Switch)',
        arName: 'سويتش التوزيع (SW-2 - Designated)',
        type: 'switch',
        ip: '192.168.1.2',
        mac: '00:02:00:00:00:02',
        subnet: '255.255.255.0',
        x: 75,
        y: 66,
        status: 'forwarding',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'switch-1', label: 'RP (Root Port)' },
          { portNumber: 'Gi0/2', connectedTo: 'switch-3', label: 'DP (Forwarding)' },
          { portNumber: 'Fa0/24', connectedTo: 'server-1', label: 'Access' }
        ]
      },
      {
        id: 'host-a',
        name: 'Host A (كمبيوتر المهندس)',
        arName: 'حاسوب الموظف (المصدر)',
        type: 'host',
        ip: '192.168.1.10',
        mac: 'AA:AA:AA:11:11:11',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 10,
        y: 82,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-3', label: 'Fa0/1' }]
      },
      {
        id: 'server-1',
        name: 'Core Server (خادم الشركة)',
        arName: 'خادم الشركة وقاعدة البيانات',
        type: 'server',
        ip: '192.168.1.100',
        mac: 'CC:CC:CC:88:88:88',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 90,
        y: 82,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-2', label: 'Fa0/24' }]
      },
      {
        id: 'host-b',
        name: 'Host B (كمبيوتر سارة)',
        arName: 'حاسوب الوجهة (سارة)',
        type: 'host',
        ip: '192.168.1.20',
        mac: 'BB:BB:BB:22:22:22',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.1',
        x: 92,
        y: 66,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-2', label: 'Fa0/2' }]
      }
    ],
    links: [
      {
        id: 'link-sw1-sw3',
        fromId: 'switch-1',
        toId: 'switch-3',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Gi0/1 (DP)',
        toPort: 'Gi0/1 (RP)',
        status: 'forwarding'
      },
      {
        id: 'link-sw1-sw2',
        fromId: 'switch-1',
        toId: 'switch-2',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Gi0/2 (DP)',
        toPort: 'Gi0/1 (RP)',
        status: 'forwarding'
      },
      {
        id: 'link-sw3-sw2-blocked',
        fromId: 'switch-3',
        toId: 'switch-2',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Gi0/2 (BLK)',
        toPort: 'Gi0/2 (DP)',
        status: 'blocked' // Blocked port to break loop!
      },
      {
        id: 'link-ha-sw3',
        fromId: 'host-a',
        toId: 'switch-3',
        type: 'copper',
        bandwidth: '100 Mbps',
        fromPort: 'eth0',
        toPort: 'Fa0/1',
        status: 'forwarding'
      },
      {
        id: 'link-sw2-srv',
        fromId: 'switch-2',
        toId: 'server-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Fa0/24',
        toPort: 'eth0',
        status: 'forwarding'
      },
      {
        id: 'link-sw2-hostb',
        fromId: 'switch-2',
        toId: 'host-b',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Fa0/2',
        toPort: 'eth0',
        status: 'forwarding'
      }
    ]
  },

  // 4. HSRP First-Hop Redundancy (FHRP)
  {
    id: 'hsrp-redundancy',
    titleAr: 'البوابات المزدوجة والتكرار (HSRP Active / Standby)',
    titleEn: 'First-Hop Redundancy Protocol (HSRP / VRRP)',
    categoryAr: 'التكرار والجاهزية العالية (High Availability)',
    descriptionAr: 'مخطط التكرار عالي الجاهزية (FHRP): راوتران (Active و Standby) يشتركان في بوابة افتراضية وهمية (VIP: 192.168.1.254). عند تعطل الراوتر الأول، يتحول الثاني فوراً وبشكل تلقائي دون أي انقطاع للمستخدمين.',
    descriptionEn: 'FHRP high-availability design: Active and Standby routers share VIP 192.168.1.254. If Active fails, Standby takes over automatically with minimal user disruption.',
    badgeAr: 'HSRP VIP 192.168.1.254',
    badgeEn: 'HSRP VIP 192.168.1.254',
    iconName: 'Layers',
    defaultScenarioId: 'hsrp-gateway-failover',
    supportedScenarioIds: ['hsrp-gateway-failover'],
    featuresAr: ['Virtual IP (VIP 192.168.1.254)', 'Active Router (Priority 110)', 'Standby Router (Priority 90)', 'Seamless Sub-Second Failover'],
    zones: [
      {
        id: 'zone-hsrp-clients',
        titleAr: 'LAN Clients (VIP Gateway)',
        subtitleAr: 'Default Gateway configured to VIP 192.168.1.254',
        ipRange: 'Subnet: 192.168.1.0/24',
        x: '2%',
        y: '10%',
        width: '38%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-hsrp-cluster',
        titleAr: 'HSRP Redundancy Group 1',
        subtitleAr: 'Virtual MAC: 0000.0c07.ac01 (Active/Standby Pair)',
        ipRange: 'VIP: 192.168.1.254',
        x: '43%',
        y: '8%',
        width: '32%',
        height: '84%',
        borderColor: 'border-amber-500/20',
        bgColor: 'bg-amber-950/10',
        textColor: 'text-amber-300',
        badgeBg: 'border-amber-500/30 text-amber-300',
        pulseColor: 'bg-amber-400'
      },
      {
        id: 'zone-hsrp-wan',
        titleAr: 'Internet / Cloud Backbone',
        subtitleAr: 'Dual-Homed WAN Transit to Global Internet',
        ipRange: 'WAN: 8.8.8.8 / Internet',
        x: '78%',
        y: '10%',
        width: '20%',
        height: '80%',
        borderColor: 'border-indigo-500/20',
        bgColor: 'bg-indigo-950/10',
        textColor: 'text-indigo-300',
        badgeBg: 'border-indigo-500/30 text-indigo-300',
        pulseColor: 'bg-indigo-400'
      }
    ],
    nodes: [
      {
        id: 'host-a',
        name: 'Host A (كمبيوتر العميل)',
        arName: 'حاسوب الموظف (بوابته 192.168.1.254)',
        type: 'host',
        ip: '192.168.1.50',
        mac: 'AA:AA:AA:11:11:11',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.1.254',
        x: 12,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/1' }]
      },
      {
        id: 'switch-1',
        name: 'Switch 1 (Access Switch)',
        arName: 'سويتش التوزيع الداخلي',
        type: 'switch',
        ip: '192.168.1.10 (Mgmt)',
        mac: '55:55:55:00:00:01',
        subnet: '255.255.255.0',
        x: 30,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 1, connectedTo: 'host-a', label: 'Fa0/1' },
          { portNumber: 23, connectedTo: 'router-1', label: 'Gi0/1' },
          { portNumber: 24, connectedTo: 'router-2', label: 'Gi0/2' }
        ]
      },
      {
        id: 'router-1',
        name: 'Router 1 (HSRP Active)',
        arName: 'راوتر R1 الأساسي (Active - Priority 110)',
        type: 'router',
        ip: '192.168.1.2 | VIP: 192.168.1.254',
        mac: '00:00:0C:07:AC:01 (vMAC)',
        subnet: '255.255.255.0',
        x: 58,
        y: 28,
        status: 'active',
        ports: [
          { portNumber: 'Gi0/0', connectedTo: 'switch-1', label: 'LAN (192.168.1.2)' },
          { portNumber: 'Gi0/1', connectedTo: 'server-1', label: 'WAN (Primary)' }
        ]
      },
      {
        id: 'router-2',
        name: 'Router 2 (HSRP Standby)',
        arName: 'راوتر R2 الاحتياطي (Standby - Priority 90)',
        type: 'router',
        ip: '192.168.1.3 | VIP: 192.168.1.254',
        mac: 'R2:R2:R2:22:22:22',
        subnet: '255.255.255.0',
        x: 58,
        y: 72,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/0', connectedTo: 'switch-1', label: 'LAN (192.168.1.3)' },
          { portNumber: 'Gi0/1', connectedTo: 'server-1', label: 'WAN (Backup)' }
        ]
      },
      {
        id: 'server-1',
        name: 'Cloud / Internet Target',
        arName: 'سحابة الإنترنت والخوادم الخارجية',
        type: 'server',
        ip: '8.8.8.8 (Google DNS)',
        mac: 'CC:CC:CC:88:88:88',
        subnet: '255.255.255.0',
        x: 88,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'WAN1', connectedTo: 'router-1', label: 'Uplink 1' },
          { portNumber: 'WAN2', connectedTo: 'router-2', label: 'Uplink 2' }
        ]
      }
    ],
    links: [
      {
        id: 'link-ha-sw',
        fromId: 'host-a',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'eth0',
        toPort: 'Fa0/1'
      },
      {
        id: 'link-sw-r1',
        fromId: 'switch-1',
        toId: 'router-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Gi0/1',
        toPort: 'Gi0/0',
        status: 'forwarding'
      },
      {
        id: 'link-sw-r2',
        fromId: 'switch-1',
        toId: 'router-2',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'Gi0/2',
        toPort: 'Gi0/0',
        status: 'forwarding'
      },
      {
        id: 'link-r1-wan',
        fromId: 'router-1',
        toId: 'server-1',
        type: 'fiber',
        bandwidth: '10 Gbps',
        fromPort: 'Gi0/1',
        toPort: 'WAN1',
        status: 'forwarding'
      },
      {
        id: 'link-r2-wan',
        fromId: 'router-2',
        toId: 'server-1',
        type: 'fiber',
        bandwidth: '10 Gbps',
        fromPort: 'Gi0/1',
        toPort: 'WAN2',
        status: 'forwarding'
      }
    ]
  },

  // 5. Site-to-Site IPsec VPN & Security Tunnel
  {
    id: 'ipsec-vpn',
    titleAr: 'نفق التشفير وحماية الفروع (Site-to-Site IPsec VPN)',
    titleEn: 'IPsec Site-to-Site Cryptographic Tunnel & NAT',
    categoryAr: 'أمن الشبكات والتشفير (Network Security & VPN)',
    descriptionAr: 'مخطط يربط فرع الشركة الإقليمي (Dubai Branch) بالمقر الرئيسي (Riyadh HQ) عبر نفق تشفير آمن IPsec ESP يمر فوق شبكة الإنترنت العامة غير الموثوقة مع ترجمة العناوين NAT/PAT.',
    descriptionEn: 'Site-to-site design linking Dubai Branch to Riyadh HQ over an IPsec ESP tunnel across the untrusted Internet, combined with NAT/PAT.',
    badgeAr: 'IPsec ESP 256-bit',
    badgeEn: 'IPsec ESP 256-bit',
    iconName: 'Shield',
    defaultScenarioId: 'ipsec-vpn-tunnel',
    supportedScenarioIds: ['ipsec-vpn-tunnel', 'enterprise-nat-pat'],
    featuresAr: ['Private Branch LAN (192.168.20.0/24)', 'Untrusted Internet WAN', 'Private HQ Datacenter (10.0.0.0/24)', 'ESP Crypto Tunnel'],
    zones: [
      {
        id: 'zone-branch-office',
        titleAr: 'Dubai Branch Office (Private)',
        subtitleAr: 'Internal Corporate Subnet',
        ipRange: '192.168.20.0/24',
        x: '2%',
        y: '10%',
        width: '28%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-public-internet',
        titleAr: 'Public Untrusted Internet (WAN)',
        subtitleAr: 'Active Encrypted IPsec Tunnel (ESP / IKEv2)',
        ipRange: 'Transit: 203.0.113.0/24',
        x: '33%',
        y: '12%',
        width: '34%',
        height: '76%',
        borderColor: 'border-purple-500/30',
        bgColor: 'bg-purple-950/15',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/40 text-purple-300',
        pulseColor: 'bg-purple-400'
      },
      {
        id: 'zone-hq-datacenter',
        titleAr: 'Riyadh Corporate HQ (Secure DC)',
        subtitleAr: 'High-Security Financial Server Farm',
        ipRange: '10.0.0.0/24',
        x: '70%',
        y: '10%',
        width: '28%',
        height: '80%',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-950/10',
        textColor: 'text-emerald-300',
        badgeBg: 'border-emerald-500/30 text-emerald-300',
        pulseColor: 'bg-emerald-400'
      }
    ],
    nodes: [
      {
        id: 'host-a',
        name: 'Branch PC (كمبيوتر الفرع)',
        arName: 'حاسوب فرع دبي (192.168.20.10)',
        type: 'host',
        ip: '192.168.20.10',
        mac: 'AA:AA:AA:11:11:11',
        subnet: '255.255.255.0',
        defaultGateway: '192.168.20.1',
        x: 12,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'router-1', label: 'LAN' }]
      },
      {
        id: 'router-1',
        name: 'Branch Gateway / ASA',
        arName: 'بوابة وجدار ناري الفرع (Crypto Peer 1)',
        type: 'router',
        ip: '192.168.20.1 (LAN) | 203.0.113.10 (WAN)',
        mac: 'R1:R1:R1:11:11:11',
        subnet: '255.255.255.0',
        x: 30,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/0', connectedTo: 'host-a', label: 'LAN (192.168.20.1)' },
          { portNumber: 'Gi0/1', connectedTo: 'router-2', label: 'VPN Tunnel (203.0.113.10)' }
        ]
      },
      {
        id: 'router-2',
        name: 'HQ Gateway / ASA Firewall',
        arName: 'بوابة المقر وجدار الحماية (Crypto Peer 2)',
        type: 'router',
        ip: '198.51.100.1 (WAN) | 10.0.0.1 (LAN)',
        mac: 'R2:R2:R2:22:22:22',
        subnet: '255.255.255.0',
        x: 70,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-1', label: 'VPN Tunnel (198.51.100.1)' },
          { portNumber: 'Gi0/0', connectedTo: 'server-1', label: 'LAN (10.0.0.1)' }
        ]
      },
      {
        id: 'server-1',
        name: 'HQ Financial DB (سيرفر المقر)',
        arName: 'سيرفر الحسابات وقاعدة البيانات المشفرة',
        type: 'server',
        ip: '10.0.0.80',
        mac: 'CC:CC:CC:88:88:88',
        subnet: '255.255.255.0',
        defaultGateway: '10.0.0.1',
        x: 88,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'router-2', label: 'LAN' }]
      }
    ],
    links: [
      {
        id: 'link-ha-r1',
        fromId: 'host-a',
        toId: 'router-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'eth0',
        toPort: 'Gi0/0'
      },
      {
        id: 'link-r1-r2-vpn',
        fromId: 'router-1',
        toId: 'router-2',
        type: 'tunnel', // Special IPsec Tunnel!
        bandwidth: 'IPsec AES-GCM 256',
        fromPort: 'Tunnel0 (203.0.113.10)',
        toPort: 'Tunnel0 (198.51.100.1)'
      },
      {
        id: 'link-r2-srv',
        fromId: 'router-2',
        toId: 'server-1',
        type: 'copper',
        bandwidth: '10 Gbps',
        fromPort: 'Gi0/0',
        toPort: 'eth0'
      }
    ]
  },

  // 6. Global eBGP Multi-AS Peering
  {
    id: 'bgp-multias',
    titleAr: 'التوجيه العالمي والأنظمة المستقلة (Global eBGP Peering)',
    titleEn: 'Border Gateway Protocol (eBGP Multi-AS Transit)',
    categoryAr: 'توجيه الإنترنت العالمي (Global Internet Routing)',
    descriptionAr: 'مخطط العمود الفقري للإنترنت: تبادل مسارات الشبكات بين أنظمة مستقلة Autonomous Systems (AS 65100 للمؤسسة، AS 65200 لمزود الإنترنت العالمي، AS 65300 لسحابة جوجل) باستخدام بروتوكول BGP وقائمة AS-Path لمنع الحلقات.',
    descriptionEn: 'Internet backbone peering: route exchange between AS 65100 (enterprise), AS 65200 (global ISP), and AS 65300 (cloud) using BGP AS-Path loop prevention.',
    badgeAr: 'eBGP AS-Path Engine',
    badgeEn: 'eBGP AS-Path Engine',
    iconName: 'Cpu',
    defaultScenarioId: 'bgp-ebgp-peering',
    supportedScenarioIds: ['bgp-ebgp-peering'],
    featuresAr: ['Autonomous System AS 65100', 'Tier-1 Transit AS 65200', 'Cloud DC AS 65300', 'AS-Path Attribute Filter'],
    zones: [
      {
        id: 'zone-as-enterprise',
        titleAr: 'Autonomous System AS 65100',
        subtitleAr: 'Enterprise Customer AS (Border Gateway)',
        ipRange: 'Prefix: 198.51.100.0/24',
        x: '2%',
        y: '10%',
        width: '30%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-as-isp',
        titleAr: 'Autonomous System AS 65200',
        subtitleAr: 'Global Tier-1 Transit Provider Backbone',
        ipRange: 'Transit Core: 203.0.113.0/30',
        x: '35%',
        y: '10%',
        width: '30%',
        height: '80%',
        borderColor: 'border-indigo-500/20',
        bgColor: 'bg-indigo-950/10',
        textColor: 'text-indigo-300',
        badgeBg: 'border-indigo-500/30 text-indigo-300',
        pulseColor: 'bg-indigo-400'
      },
      {
        id: 'zone-as-cloud',
        titleAr: 'Autonomous System AS 65300',
        subtitleAr: 'Global Cloud Content Provider (Google / AWS DC)',
        ipRange: 'Prefix: 8.8.8.0/24',
        x: '68%',
        y: '10%',
        width: '30%',
        height: '80%',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-950/10',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/30 text-purple-300',
        pulseColor: 'bg-purple-400'
      }
    ],
    nodes: [
      {
        id: 'router-1',
        name: 'Enterprise Edge Router (AS 65100)',
        arName: 'راوتر المؤسسة الحدودي (AS 65100)',
        type: 'router',
        ip: '203.0.113.1 (eBGP Peer)',
        mac: 'R1:BGP:00:11:11:11',
        subnet: '255.255.255.252',
        x: 20,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'Gi0/1', connectedTo: 'router-2', label: 'eBGP Peer (AS 65200)' }]
      },
      {
        id: 'router-2',
        name: 'Tier-1 ISP Core (AS 65200)',
        arName: 'راوتر مزود الإنترنت العالمي (AS 65200)',
        type: 'router',
        ip: '203.0.113.2 (eBGP Peer)',
        mac: 'R2:BGP:00:22:22:22',
        subnet: '255.255.255.252',
        x: 50,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-1', label: 'Peer AS 65100' },
          { portNumber: 'Gi0/2', connectedTo: 'server-1', label: 'Peer AS 65300' }
        ]
      },
      {
        id: 'server-1',
        name: 'Cloud DC Border (AS 65300)',
        arName: 'راوتر ومحتوى السحابة العالمية (AS 65300)',
        type: 'server',
        ip: '8.8.8.8 (Anycast BGP)',
        mac: 'GG:BGP:00:88:88:88',
        subnet: '255.255.255.0',
        x: 82,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'Gi0/1', connectedTo: 'router-2', label: 'eBGP Peer (AS 65200)' }]
      }
    ],
    links: [
      {
        id: 'link-bgp-as1-as2',
        fromId: 'router-1',
        toId: 'router-2',
        type: 'fiber',
        bandwidth: '100 Gbps BGP Transit',
        fromPort: 'Gi0/1 (TCP 179)',
        toPort: 'Gi0/1 (TCP 179)'
      },
      {
        id: 'link-bgp-as2-as3',
        fromId: 'router-2',
        toId: 'server-1',
        type: 'fiber',
        bandwidth: '100 Gbps Optical',
        fromPort: 'Gi0/2 (TCP 179)',
        toPort: 'Gi0/1 (TCP 179)'
      }
    ]
  },

  // 7. LACP EtherChannel Port-Channel
  {
    id: 'lacp-etherchannel',
    titleAr: 'دمج الروابط ومضاعفة السرعة (LACP EtherChannel)',
    titleEn: 'Link Aggregation Control Protocol (802.3ad Port-Channel)',
    categoryAr: 'سويتشينغ الطبقة الثانية ومضاعفة النطاق',
    descriptionAr: 'مخطط تجميع الوصلات الفيزيائية في وصلة منطقية واحدة (Port-Channel 1) بسرعة مضاعفة 2 Gbps باستخدام بروتوكول LACP لمنع حجب STP وتوزيع الأحمال بالتساوي.',
    descriptionEn: 'Physical link aggregation into Port-Channel 1 at 2 Gbps using LACP — prevents STP blocking of parallel links and balances load across members.',
    badgeAr: 'LACP 2 Gbps Bundle',
    badgeEn: 'LACP 2 Gbps Bundle',
    iconName: 'Zap',
    defaultScenarioId: 'lacp-etherchannel-bundle',
    supportedScenarioIds: ['lacp-etherchannel-bundle'],
    featuresAr: ['Port-Channel 1 Bundle', 'Dual Physical Links (Gi0/1 + Gi0/2)', 'LACPDU Active Negotiation', 'Load Balancing by IP Hash'],
    zones: [
      {
        id: 'zone-client-segment',
        titleAr: 'Client Access Segment',
        subtitleAr: 'Workstations connecting to Access Layer',
        ipRange: '192.168.1.0/24',
        x: '2%',
        y: '10%',
        width: '26%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-lacp-bundle',
        titleAr: 'LACP Port-Channel 1 (2 Gbps Aggregate)',
        subtitleAr: 'Dual Link Bundle: Gi0/1 + Gi0/2 treated as 1 Logical Trunk by STP',
        ipRange: 'Bandwidth: 2000 Mbps',
        x: '31%',
        y: '8%',
        width: '38%',
        height: '84%',
        borderColor: 'border-amber-500/25',
        bgColor: 'bg-amber-950/10',
        textColor: 'text-amber-300',
        badgeBg: 'border-amber-500/30 text-amber-300',
        pulseColor: 'bg-amber-400'
      },
      {
        id: 'zone-server-segment',
        titleAr: 'High-Throughput Datacenter Farm',
        subtitleAr: 'Enterprise Servers requiring maximum throughput',
        ipRange: '10.0.0.0/24',
        x: '72%',
        y: '10%',
        width: '26%',
        height: '80%',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-950/10',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/30 text-purple-300',
        pulseColor: 'bg-purple-400'
      }
    ],
    nodes: [
      {
        id: 'host-a',
        name: 'Workstation Host',
        arName: 'حاسوب المهندس (192.168.1.10)',
        type: 'host',
        ip: '192.168.1.10',
        mac: 'AA:AA:AA:11:11:11',
        subnet: '255.255.255.0',
        x: 12,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-1', label: 'Fa0/1' }]
      },
      {
        id: 'switch-1',
        name: 'Distribution Switch 1',
        arName: 'سويتش الدور 1 (Catalyst 3850 - Po1)',
        type: 'switch',
        ip: '192.168.1.2 (Mgmt)',
        mac: '55:55:55:00:00:01',
        subnet: '255.255.255.0',
        x: 35,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Fa0/1', connectedTo: 'host-a', label: 'Fa0/1' },
          { portNumber: 'Gi0/1', connectedTo: 'switch-2', label: 'Po1 [Gi0/1]' },
          { portNumber: 'Gi0/2', connectedTo: 'switch-2', label: 'Po1 [Gi0/2]' }
        ]
      },
      {
        id: 'switch-2',
        name: 'Core Switch 2',
        arName: 'سويتش المركز 2 (Catalyst 3850 - Po1)',
        type: 'switch',
        ip: '10.0.0.2 (Mgmt)',
        mac: '66:66:66:00:00:02',
        subnet: '255.255.255.0',
        x: 65,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'switch-1', label: 'Po1 [Gi0/1]' },
          { portNumber: 'Gi0/2', connectedTo: 'switch-1', label: 'Po1 [Gi0/2]' },
          { portNumber: 'Gi0/24', connectedTo: 'server-1', label: '10G Trunk' }
        ]
      },
      {
        id: 'server-1',
        name: 'Data Center Storage',
        arName: 'خادم مركز البيانات فائق السرعة',
        type: 'server',
        ip: '10.0.0.80',
        mac: 'CC:CC:CC:88:88:88',
        subnet: '255.255.255.0',
        x: 88,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'switch-2', label: 'Gi0/24' }]
      }
    ],
    links: [
      {
        id: 'link-ha-sw1',
        fromId: 'host-a',
        toId: 'switch-1',
        type: 'copper',
        bandwidth: '1 Gbps',
        fromPort: 'eth0',
        toPort: 'Fa0/1'
      },
      {
        id: 'link-sw1-sw2-bundle',
        fromId: 'switch-1',
        toId: 'switch-2',
        type: 'bundle', // EtherChannel Bundle Link!
        bandwidth: '2 Gbps (Port-Channel 1)',
        fromPort: 'Po1 (Gi0/1+Gi0/2)',
        toPort: 'Po1 (Gi0/1+Gi0/2)'
      },
      {
        id: 'link-sw2-srv',
        fromId: 'switch-2',
        toId: 'server-1',
        type: 'fiber',
        bandwidth: '10 Gbps',
        fromPort: 'Gi0/24',
        toPort: 'eth0'
      }
    ]
  },

  // 8. MPLS L3VPN Provider Core
  {
    id: 'mpls-provider-core',
    titleAr: 'شبكات مزودي الخدمة وتوجيه الملصقات (MPLS L3VPN)',
    titleEn: 'Multiprotocol Label Switching (MPLS L3VPN & PHP)',
    categoryAr: 'شبكات مزودي الخدمة (Service Provider Core)',
    descriptionAr: 'مخطط قلب شبكات مزودي الخدمة العالمية: عميل الموقع الأول (CE-1) يرسل حزمة IP عادية، يحقن راوتر الحافة (PE-1) ملصقين (Transport + VPN Label)، ثم يقوم راوتر القلب (P Router) بالتبديل السريع ونزع الملصق (PHP) قبل التسليم لموقع المقر (CE-2).',
    descriptionEn: 'Service-provider MPLS core: CE-1 sends a plain IP packet; PE-1 imposes Transport + VPN labels; P routers label-switch and PHP before delivery to CE-2.',
    badgeAr: 'MPLS 2-Label Stacking',
    badgeEn: 'MPLS 2-Label Stacking',
    iconName: 'Server',
    defaultScenarioId: 'mpls-l3vpn-label-switch',
    supportedScenarioIds: ['mpls-l3vpn-label-switch'],
    featuresAr: ['Customer Edge (CE) IP Only', 'Provider Edge (PE) Label Stacking', 'P Router Fast Label Swap', 'Penultimate Hop Popping (PHP)'],
    zones: [
      {
        id: 'zone-mpls-site-a',
        titleAr: 'Customer Site A (Branch VRF)',
        subtitleAr: 'Private Corporate Branch Site (CE-1)',
        ipRange: 'VRF Red: 10.1.0.0/24',
        x: '2%',
        y: '10%',
        width: '26%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-mpls-core',
        titleAr: 'MPLS Service Provider Core Backbone',
        subtitleAr: 'Label Switched Path (LSP) with 2-Label Stacking & PHP',
        ipRange: 'MPLS Transport: 203.0.113.0/24',
        x: '30%',
        y: '8%',
        width: '40%',
        height: '84%',
        borderColor: 'border-amber-500/25',
        bgColor: 'bg-amber-950/10',
        textColor: 'text-amber-300',
        badgeBg: 'border-amber-500/30 text-amber-300',
        pulseColor: 'bg-amber-400'
      },
      {
        id: 'zone-mpls-site-b',
        titleAr: 'Customer Site B (HQ VRF)',
        subtitleAr: 'Private Corporate HQ Datacenter (CE-2)',
        ipRange: 'VRF Red: 10.2.0.0/24',
        x: '72%',
        y: '10%',
        width: '26%',
        height: '80%',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-950/10',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/30 text-purple-300',
        pulseColor: 'bg-purple-400'
      }
    ],
    nodes: [
      {
        id: 'router-1',
        name: 'Provider Edge 1 (PE-1 Ingress)',
        arName: 'راوتر الحافة المدخل (PE-1 - يحقن الملصقات)',
        type: 'router',
        ip: '203.0.113.1 | VRF Red',
        mac: 'PE:01:PE:01:01:01',
        subnet: '255.255.255.0',
        x: 25,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-2', label: 'MPLS Core (LSP)' }
        ]
      },
      {
        id: 'router-2',
        name: 'Provider Edge 2 (PE-2 Egress)',
        arName: 'راوتر الحافة المخرج (PE-2 - يزيل ملصق VPN)',
        type: 'router',
        ip: '203.0.113.2 | VRF Red',
        mac: 'PE:02:PE:02:02:02',
        subnet: '255.255.255.0',
        x: 65,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-1', label: 'MPLS Core (PHP)' },
          { portNumber: 'Gi0/2', connectedTo: 'server-1', label: 'CE-2 Link' }
        ]
      },
      {
        id: 'server-1',
        name: 'Customer HQ Server (CE-2)',
        arName: 'خادم المقر الرئيسي للعميل (CE-2)',
        type: 'server',
        ip: '10.0.0.80',
        mac: 'CC:CC:CC:88:88:88',
        subnet: '255.255.255.0',
        x: 88,
        y: 50,
        status: 'idle',
        ports: [{ portNumber: 'eth0', connectedTo: 'router-2', label: 'Native IP' }]
      }
    ],
    links: [
      {
        id: 'link-mpls-pe1-pe2',
        fromId: 'router-1',
        toId: 'router-2',
        type: 'fiber',
        bandwidth: '100 Gbps MPLS LSP',
        fromPort: 'Gi0/1 (Labels 204/102)',
        toPort: 'Gi0/1 (PHP Pop)'
      },
      {
        id: 'link-mpls-pe2-ce2',
        fromId: 'router-2',
        toId: 'server-1',
        type: 'copper',
        bandwidth: '10 Gbps Native IP',
        fromPort: 'Gi0/2',
        toPort: 'eth0'
      }
    ]
  },

  // 9. EIGRP DUAL Convergence & Feasible Successor
  {
    id: 'eigrp-dual',
    titleAr: 'مسارات EIGRP البديلة والتعافي الفوري (EIGRP DUAL)',
    titleEn: 'EIGRP Diffusing Update Algorithm (DUAL Convergence)',
    categoryAr: 'التوجيه المتقدم والتعافي اللحظي',
    descriptionAr: 'مخطط خوارزمية DUAL لسيسكو: الراوتر R1 يحسب المسار الأفضل (Successor عبر الفايبر السريع) ويحدد مساراً احتياطياً فورياً (Feasible Successor يحقق شرط الأمان RD < FD). عند انقطاع المسار الأول، يتم التحويل للبديل في صفر ثانية دون تشغيل خوارزميات بطيئة.',
    descriptionEn: 'Cisco DUAL algorithm: R1 computes Successor (best fiber path) and a Feasible Successor (RD < FD). If the primary fails, failover is immediate without slow recomputation.',
    badgeAr: 'EIGRP DUAL Sub-Second',
    badgeEn: 'EIGRP DUAL Sub-Second',
    iconName: 'Radio',
    defaultScenarioId: 'eigrp-dual-convergence',
    supportedScenarioIds: ['eigrp-dual-convergence'],
    featuresAr: ['Successor Route (FD = 30720)', 'Feasible Successor (RD = 28160 < FD)', 'Sub-Second Convergence', 'Zero Query Delay'],
    zones: [
      {
        id: 'zone-eigrp-source',
        titleAr: 'EIGRP AS 100 Source',
        subtitleAr: 'Source Network Segment',
        ipRange: '192.168.1.0/24',
        x: '2%',
        y: '10%',
        width: '28%',
        height: '80%',
        borderColor: 'border-cyan-500/20',
        bgColor: 'bg-cyan-950/10',
        textColor: 'text-cyan-300',
        badgeBg: 'border-cyan-500/30 text-cyan-300',
        pulseColor: 'bg-cyan-400'
      },
      {
        id: 'zone-eigrp-dual-paths',
        titleAr: 'EIGRP DUAL Metric Matrix (Fast vs Feasible)',
        subtitleAr: 'Primary Successor (Top) vs Feasible Successor Backup (Bottom)',
        ipRange: 'Metric Calculation: K1, K3',
        x: '32%',
        y: '8%',
        width: '40%',
        height: '84%',
        borderColor: 'border-emerald-500/25',
        bgColor: 'bg-emerald-950/10',
        textColor: 'text-emerald-300',
        badgeBg: 'border-emerald-500/30 text-emerald-300',
        pulseColor: 'bg-emerald-400'
      },
      {
        id: 'zone-eigrp-dest',
        titleAr: 'Destination Network Segment',
        subtitleAr: 'Target Datacenter',
        ipRange: '10.0.0.0/24',
        x: '74%',
        y: '10%',
        width: '24%',
        height: '80%',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-950/10',
        textColor: 'text-purple-300',
        badgeBg: 'border-purple-500/30 text-purple-300',
        pulseColor: 'bg-purple-400'
      }
    ],
    nodes: [
      {
        id: 'router-1',
        name: 'Router 1 (R1 Source)',
        arName: 'راوتر المصدر (R1 - يملك جدول الطوبولوجيا)',
        type: 'router',
        ip: '192.168.1.1 (AS 100)',
        mac: 'R1:EI:GR:01:01:01',
        subnet: '255.255.255.0',
        x: 22,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-2', label: 'Primary (FD 30720)' },
          { portNumber: 'Gi0/2', connectedTo: 'router-2', label: 'Backup (RD 28160)' }
        ]
      },
      {
        id: 'router-2',
        name: 'Router 2 (R2 Destination)',
        arName: 'راوتر الوجهة (R2 - Target Network)',
        type: 'router',
        ip: '10.0.0.1 (AS 100)',
        mac: 'R2:EI:GR:02:02:02',
        subnet: '255.255.255.0',
        x: 75,
        y: 50,
        status: 'idle',
        ports: [
          { portNumber: 'Gi0/1', connectedTo: 'router-1', label: 'Primary' },
          { portNumber: 'Gi0/2', connectedTo: 'router-1', label: 'Backup' }
        ]
      }
    ],
    links: [
      {
        id: 'link-eigrp-primary',
        fromId: 'router-1',
        toId: 'router-2',
        type: 'fiber',
        bandwidth: '10 Gbps (Successor - FD 30720)',
        fromPort: 'Gi0/1 (Fiber 10G)',
        toPort: 'Gi0/1',
        status: 'forwarding'
      },
      {
        id: 'link-eigrp-backup',
        fromId: 'router-1',
        toId: 'router-2',
        type: 'copper',
        bandwidth: '1 Gbps (Feasible Successor - RD 28160)',
        fromPort: 'Gi0/2 (Copper 1G)',
        toPort: 'Gi0/2',
        status: 'alternate'
      }
    ]
  }
];

export const getTopologyForScenario = (scenarioId: string): NetworkTopology => {
  const matched = NETWORK_TOPOLOGIES.find(top => top.supportedScenarioIds.includes(scenarioId));
  return matched || NETWORK_TOPOLOGIES[0];
};
