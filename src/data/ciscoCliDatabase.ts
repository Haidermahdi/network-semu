export interface CliCommandResponse {
  output: string;
  nextPromptMode?: 'user' | 'priv' | 'config' | 'config-if' | 'config-router';
  explanationAr?: string;
  explanationEn?: string;
}

export const CISCO_CLI_RESPONSES: Record<string, Record<string, CliCommandResponse>> = {
  'R1-CORE-ROUTER': {
    'show ip route': {
      output: `Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area 
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2, m - OMP
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, U - per-user static route
       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP
       a - application route
       + - replicated route, % - next hop override, p - overrides from PfR

Gateway of last resort is 198.51.100.1 to network 0.0.0.0

      10.0.0.0/8 is variably subnetted, 6 subnets, 2 masks
C        10.1.1.0/24 is directly connected, GigabitEthernet0/0/0
L        10.1.1.1/32 is directly connected, GigabitEthernet0/0/0
O        10.1.2.0/24 [110/20] via 10.1.1.2, 00:32:15, GigabitEthernet0/0/0
O IA     10.2.0.0/16 [110/35] via 10.1.1.2, 00:32:15, GigabitEthernet0/0/0
C        192.168.10.0/24 is directly connected, GigabitEthernet0/0/1
L        192.168.10.1/32 is directly connected, GigabitEthernet0/0/1
B*    0.0.0.0/0 [20/0] via 198.51.100.1, 04:12:44`,
      explanationAr: 'جدول التوجيه للراوتر: يوضح الشبكات المتصلة مباشرة (C/L)، ومسارات OSPF الداخلية وخارج المنطقة (O / O IA)، ومسار BGP الافتراضي (B*).',
      explanationEn: 'Router routing table: displays directly connected subnets (C/L), internal & inter-area OSPF routes (O / O IA), and the BGP default gateway (B*).'
    },
    'show ip ospf neighbor': {
      output: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/DR         00:00:34    10.1.1.2        GigabitEthernet0/0/0
3.3.3.3           1   FULL/BDR        00:00:37    10.1.1.3        GigabitEthernet0/0/0`,
      explanationAr: 'علاقة جوار OSPF كاملة (FULL) مع الـ Designated Router (DR) والـ Backup DR (BDR).',
      explanationEn: 'Full OSPF adjacency (FULL) established with the Designated Router (DR) and Backup DR (BDR).'
    },
    'show ip ospf interface brief': {
      output: `Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C
Gi0/0/0      1     0               10.1.1.1/24        1     DROTH 2/2
Gi0/0/1      1     0               192.168.10.1/24    1     P2P   0/0
Lo0          1     0               1.1.1.1/32         1     LOOP  0/0`,
      explanationAr: 'ملخص منافذ OSPF والتكلفة (Cost) والمنطقة (Area) وحالة كل منفذ.',
      explanationEn: 'OSPF interface summary showing link cost, area ID, interface state, and neighbor counts.'
    },
    'show ip bgp summary': {
      output: `BGP router identifier 1.1.1.1, local AS number 65001
BGP table version is 18, main routing table version 18
2 network entries using 496 bytes of memory
4 path entries using 544 bytes of memory
2 BGP path attribute cache entries using 416 bytes of memory
BGP using 1456 total bytes of memory
BGP activity 2/0 prefixes, 4/0 paths, scan interval 60 secs

Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
198.51.100.1    4        65002     284     285       18    0    0 04:12:44        8
10.1.1.2        4        65001     142     142       18    0    0 02:11:10        4`,
      explanationAr: 'حالة جلسات BGP: جلسة eBGP مع AS 65002 وجلسة iBGP داخلية مع AS 65001 في حالة Established وتستقبل البادئات بنجاح.',
      explanationEn: 'BGP session status: Established eBGP peer with AS 65002 and internal iBGP peer with AS 65001 actively receiving prefixes.'
    },
    'show ip protocols': {
      output: `*** IP Routing is NSF aware ***

Routing Protocol is "ospf 1"
  Outgoing update filter list for all interfaces is not set
  Incoming update filter list for all interfaces is not set
  Router ID 1.1.1.1
  Number of areas in this router is 1. 1 normal 0 stub 0 nssa
  Maximum path: 4
  Routing for Networks:
    10.1.1.0 0.0.0.255 area 0
    192.168.10.0 0.0.0.255 area 0
  Passive Interface(s):
    GigabitEthernet0/0/1
  Routing Information Sources:
    Gateway         Distance      Last Update
    2.2.2.2              110      00:34:10
  Distance: (default is 110)`,
      explanationAr: 'البروتوكولات النشطة على الراوتر والـ Router-ID والمسافة الإدارية وشبكات OSPF المعلنة.',
      explanationEn: 'Active routing protocol parameters, Router-ID, administrative distance (110), and advertised network subnets.'
    },
    'show arp': {
      output: `Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  10.1.1.1                -   5000.0001.0001  ARPA   GigabitEthernet0/0/0
Internet  10.1.1.2               12   5000.0002.0001  ARPA   GigabitEthernet0/0/0
Internet  192.168.10.1            -   5000.0001.0002  ARPA   GigabitEthernet0/0/1
Internet  192.168.10.50          4    0050.56a1.20b4  ARPA   GigabitEthernet0/0/1`,
      explanationAr: 'جدول الـ ARP Cache في الراوتر لربط عناوين الـ IP بعناوين الـ MAC الخاصة بالأجهزة المتصلة.',
      explanationEn: 'Router ARP cache mapping IPv4 addresses to Layer 2 MAC addresses for connected hosts and neighbors.'
    },
    'ping 10.1.2.50': {
      output: `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.1.2.50, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
      explanationAr: 'اختبار الاتصال ببروتوكول ICMP Echo Request / Reply ونجاح 5 حزم من أصل 5.',
      explanationEn: 'ICMP Echo Request/Reply reachability test succeeding with 100% response rate (5/5).'
    },
    'traceroute 8.8.8.8': {
      output: `Type escape sequence to abort.
Tracing the route to 8.8.8.8

  1 198.51.100.1 2 msec 1 msec 2 msec (ISP Gateway)
  2 203.0.113.45 8 msec 7 msec 9 msec (Tier-1 Transit)
  3 142.250.160.1 12 msec 11 msec 12 msec (Google Backbone)
  4 8.8.8.8 14 msec 13 msec 14 msec`,
      explanationAr: 'تتبع مسار الحزم عبر القفزات وتناقص الـ TTL عند كل راوتر حتى الوصول للوجهة النهائية.',
      explanationEn: 'Hop-by-hop packet trace showing TTL decrements at each transit router to the public destination.'
    }
  },

  'SW-DIST-01': {
    'show mac address-table': {
      output: `          Mac Address Table
-------------------------------------------

Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  10    0050.56a1.20b4    DYNAMIC     Gi1/0/1
  10    0050.56a1.33c8    DYNAMIC     Gi1/0/2
  20    000c.29fb.11e2    DYNAMIC     Gi1/0/3
  99    5006.048c.fa00    DYNAMIC     Te1/0/24
Total Mac Addresses for this module: 4`,
      explanationAr: 'جدول الـ CAM الذي يتعلم منه السويتش عناوين الماك والمنافذ والـ VLANs المقابلة.',
      explanationEn: 'Switch CAM (Content Addressable Memory) table showing dynamically learned MACs, associated VLANs, and physical ingress ports.'
    },
    'show spanning-tree': {
      output: `VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586 (Priority 24576 + sys-id-ext 10)
             Address     0019.e855.9600
             Cost        4
             Port        24 (TenGigabitEthernet1/0/24)
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778 (Priority 32768 + sys-id-ext 10)
             Address     0019.e866.4200
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi1/0/1             Desg FWD 4         128.1    P2p Edge (PortFast)
Gi1/0/2             Desg FWD 4         128.2    P2p Edge (PortFast)
Gi1/0/3             Desg FWD 4         128.3    P2p Edge (PortFast)
Te1/0/24            Root FWD 2         128.24   P2p
Te1/0/25            Altn BLK 2         128.25   P2p (STP Loop Prevention Block)`,
      explanationAr: 'حالة الـ Spanning-Tree: توضيح منفذ الـ Root Port ومنفذ الحظر (Altn BLK) لمنع الحلقات.',
      explanationEn: 'RSTP status showing Root Bridge election, designated forwarding ports, and alternate blocking port (Altn BLK) preventing Layer 2 loops.'
    },
    'show vlan brief': {
      output: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi1/0/4, Gi1/0/5, Gi1/0/6
10   ENGINEERING                      active    Gi1/0/1, Gi1/0/2
20   ACCOUNTING                       active    Gi1/0/3
30   MANAGEMENT                       active    
99   NATIVE_UNUSED                    active    
1002 fddi-default                     act/unsup 
1003 token-ring-default               act/unsup`,
      explanationAr: 'قاعدة بيانات الـ VLANs في السويتش وتوزيع المنافذ الفيزيائية على الشبكات الوهمية.',
      explanationEn: 'Switch VLAN database detailing assigned names, operational status, and physical member access ports.'
    },
    'show interfaces trunk': {
      output: `Port        Mode             Encapsulation  Status        Native vlan
Te1/0/24    on               802.1q         trunking      99
Te1/0/25    on               802.1q         trunking      99

Port        Vlans allowed on trunk
Te1/0/24    1-4094
Te1/0/25    1-4094

Port        Vlans allowed and active in management domain
Te1/0/24    1,10,20,30,99
Te1/0/25    1,10,20,30,99

Port        Vlans in spanning tree forwarding state and not pruned
Te1/0/24    1,10,20,30,99
Te1/0/25    none`,
      explanationAr: 'تفاصيل كابلات الـ Trunk ونوع التغليف (Dot1Q) والـ Native VLAN والـ VLANs المسموح بها.',
      explanationEn: 'Trunk link details: 802.1Q encapsulation, Native VLAN 99, and STP active forwarding VLAN lists.'
    },
    'show etherchannel summary': {
      output: `Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use      f - failed to allocate aggregator

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Te1/0/24(P) Te1/0/25(P)`,
      explanationAr: 'حالة تجميع المنافذ عبر LACP: تجميع منفذين بسرعة 10G في قناة واحدة (Port-Channel 1) بسعة 20Gbps.',
      explanationEn: 'LACP Port-Channel aggregation: bundling two 10G interfaces into a resilient 20Gbps logical channel (Po1).'
    },
    'show port-security': {
      output: `Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Security Action
                (Count)        (Count)          (Count)
---------------------------------------------------------------------------
Gi1/0/1              1              1                  0         Shutdown
Gi1/0/2              1              1                  0         Shutdown
Gi1/0/3              2              1                  0         Restrict
---------------------------------------------------------------------------
Total Addresses in System (excluding static entries) : 3`,
      explanationAr: 'مراقبة أمان المنافذ ضد هجمات الـ MAC Flooding والإغلاق التلقائي عند التعدي.',
      explanationEn: 'Port Security status protecting against MAC flooding with automated shutdown violation actions.'
    }
  }
};
