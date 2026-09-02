import { WiresharkFrame } from '../types';

export const WIRESHARK_TRACES: Record<string, WiresharkFrame[]> = {
  'ospf-hello': [
    {
      frameNumber: 1,
      timeOffset: '0.000000',
      source: '10.1.1.1',
      destination: '224.0.0.5',
      protocol: 'OSPF',
      length: 82,
      info: 'Hello Packet - Router-ID: 1.1.1.1, Area: 0.0.0.0, Pri: 1, DR: 10.1.1.2, BDR: 10.1.1.3',
      rawHexPreview: '01 00 5e 00 00 05 50 00 00 01 00 01 08 00 45 c0 00 44 00 00 00 00 01 59 7a 3f 0a 01 01 01 e0 00 00 05 02 01 00 2c 01 01 01 01 00 00 00 00 ...',
      layers: [
        {
          layerName: 'Frame 1: 82 bytes on wire (656 bits), 82 bytes captured on interface Gi0/0/0',
          fields: [
            { key: 'Arrival Time', value: 'Sep 1, 2026 10:20:15.142 UTC' },
            { key: 'Frame Number', value: '1' },
            { key: 'Frame Length', value: '82 bytes (656 bits)' },
            { key: 'Capture Length', value: '82 bytes (656 bits)' }
          ]
        },
        {
          layerName: 'Ethernet II, Src: 50:00:00:01:00:01 (Cisco_01:00:01), Dst: 01:00:5e:00:00:05 (IPv4mcast_05)',
          fields: [
            { key: 'Destination', value: '01:00:5e:00:00:05 (IPv4 Multicast AllSPFRouters)', annotationAr: 'عنوان ماك خاص بالبث المتعدد لراوترات OSPF' },
            { key: 'Source', value: '50:00:00:01:00:01 (Cisco Router 1 Gi0/0/0)', annotationAr: 'عنوان الماك الفيزيائي لمنفذ الراوتر المرسل' },
            { key: 'Type', value: 'IPv4 (0x0800)', annotationAr: 'نوع البروتوكول في Layer 3 هو IPv4' }
          ]
        },
        {
          layerName: 'Internet Protocol Version 4, Src: 10.1.1.1, Dst: 224.0.0.5',
          fields: [
            { key: '0100 .... = Version', value: '4' },
            { key: '.... 0101 = Header Length', value: '20 bytes (5)' },
            { key: 'Differentiated Services Field', value: '0xc0 (DSCP: CS6, Precedence: Internetwork Control)', annotationAr: 'أولوية قصوى لحزم التحكم بالشبكة' },
            { key: 'Total Length', value: '68 bytes' },
            { key: 'Time to Live (TTL)', value: '1', annotationAr: 'قيمة الـ TTL هي 1 لمنع خروج حزمة Hello خارج الشبكة المحلية' },
            { key: 'Protocol', value: 'OSPF (89)', annotationAr: 'رقم بروتوكول OSPF في ترويسة IP هو 89' },
            { key: 'Header Checksum', value: '0x7a3f [correct]' },
            { key: 'Source Address', value: '10.1.1.1' },
            { key: 'Destination Address', value: '224.0.0.5 (All OSPF Routers Multicast)' }
          ]
        },
        {
          layerName: 'Open Shortest Path First (OSPFv2) - Hello Packet',
          fields: [
            { key: 'Version', value: '2 (IPv4 OSPF)' },
            { key: 'Message Type', value: 'Hello Packet (1)' },
            { key: 'Packet Length', value: '44 bytes' },
            { key: 'Source OSPF Router ID', value: '1.1.1.1', annotationAr: 'المعرف الفريد للراوتر في شبكة OSPF' },
            { key: 'Area ID', value: '0.0.0.0 (Backbone Area 0)', annotationAr: 'المنطقة الرئيسية Area 0' },
            { key: 'Checksum', value: '0x12b4 [correct]' },
            { key: 'Auth Type', value: 'Null (0)' },
            { key: 'Network Mask', value: '255.255.255.0 (/24)' },
            { key: 'Hello Interval', value: '10 seconds', annotationAr: 'يجب أن يتطابق مع الجار' },
            { key: 'Router Dead Interval', value: '40 seconds (4x Hello)', annotationAr: 'مهلة إعلان موت الجار' },
            { key: 'Designated Router (DR)', value: '10.1.1.2', annotationAr: 'الراوتر المنتخب حالياً كـ DR' },
            { key: 'Backup Designated Router (BDR)', value: '10.1.1.3' },
            { key: 'Active Neighbor ID', value: '2.2.2.2' },
            { key: 'Active Neighbor ID', value: '3.3.3.3' }
          ]
        }
      ]
    }
  ],

  'dot1q-vlan-tag': [
    {
      frameNumber: 2,
      timeOffset: '0.002410',
      source: '00:50:56:a1:20:b4',
      destination: '50:06:04:8c:fa:00',
      protocol: '802.1Q / IPv4',
      length: 102,
      info: 'VLAN 10 Tagged Traffic, Pri: 5 (Voice/Video), Source: 10.10.10.50, Destination: 10.10.20.100',
      rawHexPreview: '50 06 04 8c fa 00 00 50 56 a1 20 b4 81 00 a0 0a 08 00 45 00 00 54 1c 2b 40 00 40 01 e2 15 0a 0a 0a 32 0a 0a 14 64 ...',
      layers: [
        {
          layerName: 'Frame 2: 102 bytes on wire (816 bits) captured on Trunk Port Te1/0/24',
          fields: [
            { key: 'Interface', value: 'TenGigabitEthernet1/0/24 (Trunk Link)' },
            { key: 'Encapsulation', value: 'IEEE 802.1Q Virtual Bridged Local Area Network' }
          ]
        },
        {
          layerName: 'Ethernet II, Src: 00:50:56:a1:20:b4, Dst: 50:06:04:8c:fa:00',
          fields: [
            { key: 'Destination', value: '50:06:04:8c:fa:00 (Gateway Core Router Sub-interface)' },
            { key: 'Source', value: '00:50:56:a1:20:b4 (Engineering Workstation Host-A)' },
            { key: 'Type', value: '802.1Q Virtual LAN (0x8100)', annotationAr: 'يشير إلى وجود ترويسة Dot1Q Tag' }
          ]
        },
        {
          layerName: '802.1Q Virtual LAN, PRI: 5, DEI: 0, ID: 10',
          fields: [
            { key: '101. .... .... .... = Priority (PCP / CoS)', value: '5 (Voice / Expedited Forwarding)', annotationAr: 'أولوية 5 لجودة الخدمة QoS' },
            { key: '...0 .... .... .... = Drop Eligible Indicator (DEI)', value: 'Ineligible (0)' },
            { key: '.... 0000 0000 1010 = VLAN Identifier (VID)', value: '10 (Engineering VLAN)', annotationAr: 'رقم الشبكة الوهمية المستهدفة هو 10' },
            { key: 'Type', value: 'IPv4 (0x0800)', annotationAr: 'البروتوكول الداخلي المغلف' }
          ]
        },
        {
          layerName: 'Internet Protocol Version 4, Src: 10.10.10.50, Dst: 10.10.20.100',
          fields: [
            { key: 'Source Address', value: '10.10.10.50' },
            { key: 'Destination Address', value: '10.10.20.100 (Accounting Server in VLAN 20)' },
            { key: 'Time to Live (TTL)', value: '128' },
            { key: 'Protocol', value: 'ICMP (1)' }
          ]
        }
      ]
    }
  ]
};
