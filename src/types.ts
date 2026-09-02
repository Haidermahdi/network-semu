export type Language = 'ar' | 'en';

export type CurriculumTrack = 'ccna' | 'ccnp' | 'ccie';

export type ProtocolType =
  | 'OSPF'
  | 'EIGRP'
  | 'BGP'
  | 'RIP'
  | 'STP'
  | 'RSTP'
  | '802.1Q'
  | 'LACP'
  | 'ARP'
  | 'ICMP'
  | 'STATIC'
  | 'MPLS'
  | 'MPLS_LDP'
  | 'VXLAN'
  | 'LISP'
  | 'NAT'
  | 'HSRP'
  | 'TCP'
  | 'DHCP'
  | 'IPsec_IKEv2'
  | 'ICMPv6_NDP';

export interface OfficialReference {
  title: string;
  type: 'RFC' | 'Cisco OCG' | 'Cisco Whitepaper' | 'IEEE Standard' | 'Cisco Validated Design' | 'Cisco Press' | 'Cisco DevNet' | 'Cisco Configuration Guide';
  code: string;
  citation: string;
}

export interface CiscoCliCommand {
  command: string;
  deviceType: 'router' | 'switch' | 'l3switch';
  deviceName: string;
  mode: 'user' | 'priv' | 'config' | 'config-if' | 'config-router';
  output: string;
  explanationAr: string;
  explanationEn?: string;
  category: string;
}

export interface ProtocolDetail {
  id: ProtocolType;
  name: string;
  standard: string; // e.g. RFC 2328, IEEE 802.1w
  layer: string;
  adminDistance?: number;
  metricEquation?: string;
  algorithm: string; // e.g. Dijkstra SPF, DUAL, Bellman-Ford
  packetTypes: { name: string; opcode?: string; purposeAr: string; purposeEn?: string }[];
  stateMachine?: { state: string; descAr: string; descEn?: string; triggerAr: string; triggerEn?: string }[];
  headerStructure: { field: string; bits: number | string; descAr: string; descEn?: string }[];
  ciscoShowCommands: string[];
  ciscoConfigSnippet: string;
  keyConceptsAr: { title: string; desc: string }[];
  keyConceptsEn?: { title: string; desc: string }[];
  realWorldAnalogyAr: string;
  realWorldAnalogyEn?: string;
}

export interface BookChapterPage {
  pageNumber: number;
  chapterTitleAr: string;
  chapterTitleEn: string;
  badgeAr: string;
  badgeEn?: string;
  estimatedReadTime: string;
  contentMarkdownAr: string;
  contentMarkdownEn?: string;
  keyTakeawaysAr?: string[];
  keyTakeawaysEn?: string[];
  ciscoTipAr?: string;
  ciscoTipEn?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  track: CurriculumTrack;
  joinedDate: string;
  completedTopicIds: string[];
  bookmarkedTopicIds: string[];
  readPagesRecord: Record<string, number[]>; // topicId -> array of completed page numbers
  studyStreakDays: number;
  personalNotes: Record<string, string>; // topicId -> note
}

export interface CurriculumTopic {
  id: string;
  titleAr: string;
  titleEn: string;
  level: 'CCNA' | 'CCNP' | 'CCIE' | 'CCIE Foundation';
  track: CurriculumTrack;
  ciscoBlueprintRef: string; // e.g. "CCNA 200-301 §3.2" or "ENCOR 350-401 §1.4" or "CCIE EI v1.1 §2.1"
  officialReferences: OfficialReference[];
  summaryAr?: string;
  summaryEn?: string;
  contentMarkdownAr: string;
  contentMarkdownEn?: string;
  bookPages?: BookChapterPage[];
  technicalHighlights: string[];
  technicalHighlightsEn?: string[];
  ciscoCliOutputs: CiscoCliCommand[];
  protocolDetails?: ProtocolDetail[];
  realWorldAnalogy: {
    titleAr: string;
    titleEn?: string;
    storyAr: string;
    storyEn?: string;
    mappingTable: { realLife: string; networkTech: string; ciscoTerm: string }[];
  };
}

export interface CurriculumSection {
  id: string;
  track: CurriculumTrack;
  trackTitleAr: string;
  trackTitleEn: string;
  examCode: string; // "200-301 CCNA", "350-401 ENCOR / 300-410 ENARSI", "CCIE EI v1.1"
  unitNumber: number;
  unitTitleAr: string;
  unitTitleEn: string;
  moduleBadge: string;
  summaryAr: string;
  summaryEn?: string;
  officialDomain: string; // Cisco Blueprint Domain name
  topics: CurriculumTopic[];
}

export interface WiresharkPacketLayer {
  layerName: string;
  fields: { key: string; value: string; hex?: string; annotationAr?: string }[];
}

export interface WiresharkFrame {
  frameNumber: number;
  timeOffset: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  layers: WiresharkPacketLayer[];
  rawHexPreview?: string;
}

export interface EnterpriseDevice {
  id: string;
  hostname: string;
  model: string;
  type: 'router' | 'switch' | 'l3switch' | 'server' | 'host';
  mgmtIp: string;
  roleAr: string;
  x: number;
  y: number;
  interfaces: {
    name: string;
    ip?: string;
    mac: string;
    vlan?: number;
    mode?: 'access' | 'trunk' | 'routed';
    status: 'up' | 'down';
    connectedToDevice?: string;
    connectedToInterface?: string;
    ospfArea?: number;
    ospfCost?: number;
    stpRole?: 'Root' | 'Designated' | 'Alternate' | 'Disabled';
    stpState?: 'Forwarding' | 'Blocking' | 'Learning';
  }[];
  activeProtocols: ProtocolType[];
}

export interface TopologyLink {
  id: string;
  fromDevice: string;
  fromInterface: string;
  toDevice: string;
  toInterface: string;
  mediaType: '1000Base-T Copper' | '10GBase-LR Fiber' | 'Serial HDLC';
  bandwidth: string;
  isTrunk?: boolean;
  allowedVlans?: string;
  ospfArea?: number;
  etherChannelId?: number;
}

// -------------------------------------------------------------
// Interactive Simulation & Live State Models
// -------------------------------------------------------------

export interface MacTableEntry {
  vlan?: number;
  mac?: string;
  macAddress?: string;
  type?: 'DYNAMIC' | 'STATIC' | string;
  port?: string;
  lastUpdated?: string;
  ageSeconds?: number;
}

export interface RoutingTableEntry {
  code?: 'C' | 'S' | 'O' | 'D' | 'B' | 'L' | string;
  prefix?: string;
  destinationNetwork?: string;
  subnetMask?: string;
  adminDistance?: number;
  metric?: number;
  nextHop?: string;
  nextHopIp?: string;
  interface?: string;
  protocol?: string;
}

export interface ArpTableEntry {
  ip?: string;
  ipAddress?: string;
  mac?: string;
  macAddress?: string;
  type?: string;
  interface?: string;
  ageMinutes?: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  arName: string;
  type: 'host' | 'switch' | 'router' | 'server';
  ip: string;
  mac: string;
  subnetMask?: string;
  subnet?: string;
  status?: string;
  ports?: (string | { portNumber: string | number; connectedTo?: string; label?: string })[];
  activeInterfaces?: any;
  defaultGateway?: string;
  x: number; // percentage on canvas (0-100)
  y: number; // percentage on canvas (0-100)
  zone?: 'LAN 1' | 'WAN' | 'LAN 2' | string;
  macTable?: MacTableEntry[];
  routingTable?: RoutingTableEntry[];
  arpTable?: ArpTableEntry[];
}

export interface NetworkLink {
  id: string;
  fromId: string;
  toId: string;
  type: 'copper' | 'fiber';
  label?: string;
  fromPort?: string;
  toPort?: string;
  bandwidth?: string;
  isActive?: boolean;
}

export interface PacketHeaders {
  l2: {
    srcMac: string;
    destMac: string;
    etherType: string;
    vlanId?: number;
    fcs?: string;
    macLookupStatus?: string;
  };
  l3: {
    srcIp: string;
    destIp: string;
    ttl: number;
    protocol: string;
    version?: string;
  };
  payload: {
    type: string;
    data?: string;
    message?: string;
  };
}

export interface SimulationStep {
  id?: string | number;
  stepNumber?: number;
  stageTitleAr?: string;
  stageTitleEn?: string;
  stageDescriptionAr?: string;
  layer?: string;
  highlightEvent?: string;
  explanation?: string | {
    whatIsHappening?: string;
    whyItHappens?: string;
    realLifeParallel?: string;
    keyObservation?: string;
  };
  titleAr?: string;
  titleEn?: string;
  fromNodeId: string;
  toNodeId: string;
  activeNodeId: string;
  actionAr?: string;
  technicalDetailsAr?: string;
  realWorldMetaphorAr?: string;
  layerHighlight?: 'L2' | 'L3' | 'ARP' | 'APP' | string;
  headers: PacketHeaders;
  tableUpdate?: {
    deviceType?: string;
    deviceId?: string;
    tableName?: string;
    entry?: {
      key1?: string;
      key2?: string;
      extra?: string;
    };
  };
  macTableUpdates?: { nodeId: string; entry: MacTableEntry }[];
  arpTableUpdates?: { nodeId: string; entry: ArpTableEntry }[];
  routingTableUpdates?: { nodeId: string; entry: RoutingTableEntry }[];
  progressPercentage: number;
}

export interface SimulationScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  badge?: string;
  difficulty?: 'simple' | 'complex' | 'very_complex' | 'intermediate' | 'expert';
  difficultyAr?: string;
  category?: 'switching' | 'routing' | 'arp' | 'end_to_end' | 'failover' | 'security' | string;
  categoryAr?: string;
  descriptionAr: string;
  realWorldAnalogyAr?: string;
  sourceNodeId: string;
  destNodeId?: string;
  destinationNodeId?: string;
  packetType?: string;
  steps: SimulationStep[];
}

// -------------------------------------------------------------
// Human Street & Real-Life Protocol Stories
// -------------------------------------------------------------

export interface StreetCharacter {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn?: string;
  avatarRole: 'pedestrian' | 'courier' | 'officer' | 'guard' | 'driver' | 'chef' | 'clerk' | 'student' | 'businessman' | 'policeman';
  ipAddress: string;
  macAddress: string;
  xPosition: number; // percentage in street scene 0-100
  yPosition: number; // percentage in street scene
  initialSpeech?: string;
  initialSpeechEn?: string;
  carryingItem?: string;
  carryingItemEn?: string;
  badgeColor?: string;
}

export interface StreetStoryStep {
  stepNumber: number;
  titleAr: string;
  titleEn?: string;
  storyNarrativeAr: string;
  storyNarrativeEn?: string;
  technicalAnalogyAr: string;
  technicalAnalogyEn?: string;
  ciscoProtocolTerm: string;
  ciscoCommandSnippet?: string;
  activeCharacterId: string;
  fromCharacterId: string;
  toCharacterId: string;
  payloadType: string;
  payloadContentAr: string;
  payloadContentEn?: string;
  l2Src: string;
  l2Dest: string;
  l3Src: string;
  l3Dest: string;
  ttlRemaining?: number;
  packetPositionPercent: number; // 0 to 100 on street
  speechBubbles: Record<string, string>;
  speechBubblesEn?: Record<string, string>;
  highlightedEventAr: string;
  highlightedEventEn?: string;
}

export interface HumanNetworkStory {
  id: string;
  track?: CurriculumTrack;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn?: string;
  protocolBadge: string;
  difficulty: 'مبتدئ (Beginner)' | 'متوسط (Intermediate)' | 'متقدم (Advanced)' | 'خبير (Expert)' | string;
  difficultyEn?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;
  coverIcon: string;
  sceneTheme: 'busy_market' | 'border_highway' | 'traffic_circle' | 'smart_delivery' | 'office_gate' | 'cozy_cafe' | 'airport' | 'airport_terminal' | 'embassy' | 'container_port' | 'public_avenue' | string;
  characters: StreetCharacter[];
  storySummaryAr: string;
  storySummaryEn?: string;
  realWorldScenarioDescriptionAr: string;
  realWorldScenarioDescriptionEn?: string;
  ciscoCoreLessonAr: string;
  ciscoCoreLessonEn?: string;
  steps: StreetStoryStep[];
}

export interface SlideData {
  id: string;
  number: number;
  category: 'foundation' | 'switching' | 'routing' | 'arp' | 'end_to_end' | 'comparison' | 'interactive_lab' | 'quiz' | string;
  categoryAr: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  realWorldMetaphor: {
    titleAr: string;
    iconName: string;
    storyAr: string;
    lessonAr: string;
    comparison: { realWorld: string; networkWorld: string }[];
  };
  keyConcepts: {
    title: string;
    term: string;
    desc: string;
    color: string;
  }[];
  interactiveScenarioId: string;
  takeawayMessage: string;
}
