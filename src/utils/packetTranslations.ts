import { Language, NetworkNode, SimulationStep, PacketHeaders } from '../types';

/**
 * Strips Arabic annotations from device names or returns dedicated English names
 */
export function getLocalizedNodeName(
  node?: { name?: string; arName?: string; nameEn?: string; id?: string } | null,
  lang: Language = 'ar'
): string {
  if (!node) return '';
  if (lang === 'ar') {
    return node.arName || node.name || '';
  }

  if (node.nameEn) {
    return node.nameEn;
  }

  const raw = node.name || node.arName || '';
  // Remove any Arabic characters and parentheses containing Arabic
  const cleaned = raw.replace(/\([\u0600-\u06FF\s0-9/-]+\)/g, '').trim();
  
  if (cleaned.length > 0) {
    return cleaned;
  }

  // Fallbacks by ID
  if (node.id === 'host-a') return 'Host A (Source Client)';
  if (node.id === 'host-b') return 'Host B (Peer Host)';
  if (node.id === 'host-c') return 'Host C (Workstation)';
  if (node.id === 'switch-1') return 'Switch 1 (Access Layer)';
  if (node.id === 'switch-2') return 'Switch 2 (Distribution)';
  if (node.id === 'switch-3') return 'Switch 3 (Access Switch)';
  if (node.id === 'router-1') return 'Router 1 (Default Gateway)';
  if (node.id === 'router-2') return 'Router 2 (Data Center Gateway)';
  if (node.id === 'server-1') return 'Server 1 (Cloud Web Host)';

  return raw;
}

/**
 * Cleans Arabic annotations inside packet header strings (IPs, MACs, etc.)
 */
export function getLocalizedHeaderString(val: string | undefined, lang: Language = 'ar'): string {
  if (!val) return '';
  if (lang === 'ar') return val;

  return val
    .replace(/كمبيوتر أحمد|حاسوب أحمد/g, 'Host A')
    .replace(/كمبيوتر سارة|حاسوب سارة/g, 'Host B')
    .replace(/سويتش الدور 1|سويتش الدور الأول/g, 'Switch 1')
    .replace(/سويتش السيرفرات/g, 'Switch 2')
    .replace(/راوتر البوابة/g, 'Gateway Router R1')
    .replace(/راوتر السحابة|راوتر مركز البيانات/g, 'Data Center Router R2')
    .replace(/سيرفر جوجل|سيرفر الويب|السيرفر/g, 'Cloud Web Server')
    .replace(/طلب صفحة الويب من السيرفر البعيد/g, 'HTTP GET /index.html Web Request')
    .replace(/رد صفحة الويب/g, 'HTTP 200 OK Web Page Response')
    .replace(/استعلام|طلب/g, 'Request')
    .replace(/رد|استجابة/g, 'Response');
}

/**
 * Step descriptions and architectural exam takeaways in professional English
 */
export const STEP_TRANSLATIONS_EN: Record<string, { description: string; takeaway: string; title?: string }> = {
  // Scenario 1: cross-network-journey
  'cross-network-journey-1': {
    title: 'Local Subnet Determination & Encapsulation',
    description: 'Host A performs a bitwise AND operation between destination IP (10.0.0.80) and its subnet mask. Recognizing the target is in a remote network, it encapsulates the IP packet into an Ethernet frame addressed to its configured Default Gateway (192.168.1.1).',
    takeaway: 'Notice: Destination IP remains 10.0.0.80 (End-to-End Server), but Destination MAC is set to local Gateway Router 1 (Hop-by-Hop)!'
  },
  'cross-network-journey-2': {
    title: 'Layer 2 Switch Ingress & CAM Forwarding',
    description: 'Switch 1 receives the frame on port Fa0/1. It examines the Source MAC (AA:11) and learns it into its CAM table, then looks up the Destination MAC (R1 Gateway) and forwards the frame out port Gi0/1 without altering packet contents.',
    takeaway: 'Standard Layer 2 switches never modify MAC or IP headers; they switch frames unmodified at hardware line rate.'
  },
  'cross-network-journey-3': {
    title: 'Gateway L3 Decapsulation & Route Lookup',
    description: 'Router 1 de-encapsulates the Ethernet frame upon arrival on Gi0/0. It inspects the destination IP (10.0.0.80) in its Routing Information Base (RIB), decrements TTL by 1, recomputes IPv4 checksum, and determines egress interface Serial0/1.',
    takeaway: 'Routers strip the Layer 2 Ethernet header, rewrite new Layer 2 framing for the outgoing medium, and decrement TTL.'
  },
  'cross-network-journey-4': {
    title: 'High-Speed WAN Transit via Optical Core',
    description: 'The IP packet traverses the WAN optical link. In a point-to-point transit link or HDLC/PPP/Ethernet serial segment, data reaches the Data Center Router 2.',
    takeaway: 'Across WAN transit links, Layer 3 IP addressing remains end-to-end constant while Layer 2 encapsulation adapts to the link type.'
  },
  'cross-network-journey-5': {
    title: 'Destination Gateway Route Resolution & ARP',
    description: 'Router 2 receives the packet on Serial0/1. It consults its routing table for 10.0.0.0/24, finds it directly connected on Gi0/0, checks its local ARP cache for Server 1 MAC, and encapsulates with Server 1 destination MAC.',
    takeaway: 'If the target MAC is already cached in ARP, the router encapsulates immediately without generating an ARP broadcast.'
  },
  'cross-network-journey-6': {
    title: 'Final Switch Delivery to Server',
    description: 'Switch 2 receives the frame from Router 2 on Gi0/1 and forwards it directly out port Fa0/1 to Server 1 based on its hardware CAM table.',
    takeaway: 'The destination server receives the HTTP request with the original source IP intact (192.168.1.10) to formulate its reply.'
  },

  // Scenario 2: same-lan-switching
  'same-lan-switching-1': {
    title: 'Local Destination Check (Same Subnet)',
    description: 'Host A determines that destination 192.168.1.20 is within the same local subnet (192.168.1.0/24). No router gateway is required; Host A will deliver the frame directly to Host B.',
    takeaway: 'When source and destination share the same subnet, traffic stays completely within the local Layer 2 broadcast domain.'
  },
  'same-lan-switching-2': {
    title: 'Switch CAM Learning & Unicast Forwarding',
    description: 'Switch 1 receives the frame on port Fa0/1, learns Host A MAC address, looks up Host B MAC in its CAM table, and forwards the frame out port Fa0/2.',
    takeaway: 'Switches build CAM tables by inspecting Source MAC addresses on ingress and forward based on Destination MAC.'
  },
  'same-lan-switching-3': {
    title: 'Host B Frame Receipt & Processing',
    description: 'Host B NIC detects its own MAC address in the frame header, strips Layer 2 framing, and passes the payload to its local network stack.',
    takeaway: 'End hosts process unicast frames matching their hardware MAC address or broadcast frames (FF:FF:FF:FF:FF:FF).'
  },

  // Scenario 3: arp-broadcast-resolution
  'arp-broadcast-resolution-1': {
    title: 'ARP Cache Miss & Broadcast Request',
    description: 'Host A needs to send data to 192.168.1.20 but lacks its MAC address in the local ARP cache. It broadcasts an ARP Request (FF:FF:FF:FF:FF:FF): "Who has 192.168.1.20? Tell 192.168.1.10".',
    takeaway: 'ARP requests are broadcast (Layer 2 all-Fs) because the sender does not yet know the destination physical address.'
  },
  'arp-broadcast-resolution-2': {
    title: 'Switch Broadcast Flooding',
    description: 'Switch 1 receives the broadcast frame on Fa0/1. Because the destination is FF:FF:FF:FF:FF:FF, it floods the frame out all ports in VLAN 1 except the receiving port.',
    takeaway: 'Switches flood broadcast and unknown unicast frames out every port in the active VLAN.'
  },
  'arp-broadcast-resolution-3': {
    title: 'Host B Unicast ARP Reply',
    description: 'Host B matches its own IP address, updates its local ARP table with Host A mapping, and sends a unicast ARP Reply directly back to Host A MAC.',
    takeaway: 'Unlike ARP requests which are broadcast, ARP replies are unicast directly to the requester.'
  },
  'arp-broadcast-resolution-4': {
    title: 'ARP Cache Populated & Transmission Resumed',
    description: 'Host A receives the ARP reply, records 192.168.1.20 -> BB:BB:BB:22:22:22 in its ARP cache, and proceeds to transmit queued data frames.',
    takeaway: 'ARP entries expire after a cache timeout (typically 2-4 minutes in OS, 4 hours on Cisco routers).'
  }
};

/**
 * Returns localized step fields with fallback to original values
 */
export function getLocalizedStep(step: SimulationStep, scenarioId: string, stepIndex: number, lang: Language = 'ar') {
  if (lang === 'ar') {
    return {
      title: step.stageTitleAr || step.titleAr || `المرحلة ${step.id || stepIndex + 1}`,
      description: step.stageDescriptionAr || (typeof step.explanation === 'object' ? step.explanation?.whatIsHappening : '') || '',
      takeaway: typeof step.explanation === 'object' ? (step.explanation?.keyObservation || step.explanation?.whatIsHappening || '') : (step.explanation || ''),
      payloadSummary: step.headers?.payload?.summary || step.headers?.payload?.message || step.headers?.payload?.data || ''
    };
  }

  // English Mode
  const key = `${scenarioId}-${step.id || stepIndex + 1}`;
  const translated = STEP_TRANSLATIONS_EN[key];

  let title = step.stageTitleEn || step.titleEn || translated?.title;
  if (!title) {
    if (step.highlightEvent === 'mac_rewrite') title = 'Gateway L3 Decapsulation & MAC Rewrite';
    else if (step.highlightEvent === 'ttl_decrement') title = 'TTL Decrement & Routing Lookup';
    else if (step.highlightEvent === 'arp_broadcast') title = 'ARP Resolution Broadcast & Cache Miss';
    else if (step.highlightEvent === 'mac_learned') title = 'CAM Table Learning & Port Forwarding';
    else if (step.highlightEvent === 'destination_reached') title = 'Final Packet Delivery to Destination';
    else title = `Simulation Step ${step.id || stepIndex + 1}`;
  }

  let description = step.stageDescriptionEn || translated?.description;
  if (!description) {
    if (typeof step.explanation === 'object' && step.explanation?.whatIsHappeningEn) {
      description = step.explanation.whatIsHappeningEn;
    } else if (step.stageDescriptionAr) {
      // Fallback clean English description derived from technical fields
      description = `Packet transferred from node ${step.fromNodeId.toUpperCase()} to ${step.toNodeId.toUpperCase()} via ${step.layer || 'Network Layer'} with protocol ${step.headers?.l3?.protocol || 'IPv4'}.`;
    } else {
      description = 'Packet processing and header examination at current network node.';
    }
  }

  let takeaway = translated?.takeaway;
  if (!takeaway) {
    if (typeof step.explanation === 'object' && step.explanation?.keyObservationEn) {
      takeaway = step.explanation.keyObservationEn;
    } else {
      if (step.highlightEvent === 'mac_rewrite') {
        takeaway = 'Core Exam Rule: Layer 2 MAC addresses are rewritten at every Layer 3 router hop, while Layer 3 IP addresses remain constant end-to-end.';
      } else if (step.highlightEvent === 'ttl_decrement') {
        takeaway = 'Routers decrement TTL by 1 before forwarding. If TTL reaches 0, the packet is dropped and ICMP Time Exceeded (Type 11) is returned.';
      } else if (step.highlightEvent === 'arp_broadcast') {
        takeaway = 'ARP broadcasts are confined to the local broadcast domain; routers do not forward Layer 2 broadcast frames across subnets.';
      } else if (step.highlightEvent === 'mac_learned') {
        takeaway = 'Switches populate CAM tables dynamically using Source MAC addresses on incoming frames, forwarding based on Destination MAC.';
      } else {
        takeaway = 'End-to-end IP connectivity requires proper Layer 2 frame encapsulation and correct default gateway configuration.';
      }
    }
  }

  let payloadSummary = step.headers?.payload?.summary || step.headers?.payload?.message || step.headers?.payload?.data || '';
  payloadSummary = getLocalizedHeaderString(payloadSummary, 'en');

  return {
    title,
    description,
    takeaway,
    payloadSummary
  };
}
