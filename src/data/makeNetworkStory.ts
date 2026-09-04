import { CurriculumTrack, HumanNetworkStory, StreetCharacter, StreetStoryStep } from '../types';

export type StoryCategoryId =
  | 'switching'
  | 'routing'
  | 'security'
  | 'services'
  | 'cloud_overlay'
  | 'wan_advanced'
  | 'foundations';

export interface StorySpec {
  id: string;
  track: CurriculumTrack;
  category: StoryCategoryId;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  protocolBadge: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  lessonAr: string;
  lessonEn: string;
  summaryAr: string;
  summaryEn: string;
  analogyAr: string;
  analogyEn: string;
  steps: {
    titleAr: string;
    titleEn: string;
    narrativeAr: string;
    narrativeEn: string;
    techAr: string;
    techEn: string;
    eventAr: string;
    eventEn: string;
    payloadAr?: string;
    payloadEn?: string;
    speechAr: [string, string, string?];
    speechEn: [string, string, string?];
  }[];
  cliSnippet?: string;
  ciscoTerm?: string;
}

const ROLE_SET = {
  host: { ar: 'الجهاز المصدر (Host A)', en: 'Source Host A', avatar: 'pedestrian' as const },
  switch: { ar: 'محول الشبكة (Access Switch)', en: 'Access Switch', avatar: 'clerk' as const },
  router: { ar: 'الموجّه / البوابة (Gateway Router)', en: 'Gateway Router', avatar: 'officer' as const },
  peer: { ar: 'الجهاز الوجهة (Host B / Server)', en: 'Destination Host B', avatar: 'student' as const },
};

function buildCharacters(protocol: string): StreetCharacter[] {
  return [
    {
      id: 'char-src',
      nameAr: ROLE_SET.host.ar,
      nameEn: ROLE_SET.host.en,
      roleAr: `مرسل الحزمة — ${protocol}`,
      roleEn: `Packet sender — ${protocol}`,
      avatarRole: ROLE_SET.host.avatar,
      ipAddress: '192.168.10.10',
      macAddress: 'AA:AA:AA:10:10:10',
      xPosition: 15,
      yPosition: 58,
      initialSpeech: 'أبدأ الرحلة الآن!',
      initialSpeechEn: 'I start the journey now!',
      carryingItem: 'IP Packet / Frame',
      carryingItemEn: 'IP Packet / Frame',
      badgeColor: 'bg-emerald-500',
    },
    {
      id: 'char-mid',
      nameAr: ROLE_SET.switch.ar,
      nameEn: ROLE_SET.switch.en,
      roleAr: 'وسيط الطبقة الثانية / التحكم',
      roleEn: 'Layer-2 / control-plane intermediary',
      avatarRole: ROLE_SET.switch.avatar,
      ipAddress: '192.168.10.2',
      macAddress: '55:55:55:00:00:01',
      xPosition: 48,
      yPosition: 42,
      initialSpeech: 'أستقبل وأوجّه وفق القواعد!',
      initialSpeechEn: 'I receive and forward by the rules!',
      carryingItem: 'CAM / Control Decision',
      carryingItemEn: 'CAM / Control Decision',
      badgeColor: 'bg-blue-500',
    },
    {
      id: 'char-dst',
      nameAr: ROLE_SET.peer.ar,
      nameEn: ROLE_SET.peer.en,
      roleAr: 'المستقبل النهائي أو الطرف البعيد',
      roleEn: 'Final receiver or remote peer',
      avatarRole: ROLE_SET.peer.avatar,
      ipAddress: '10.20.30.40',
      macAddress: 'CC:CC:CC:30:30:30',
      xPosition: 82,
      yPosition: 58,
      initialSpeech: 'أنا الوجهة الصحيحة!',
      initialSpeechEn: 'I am the correct destination!',
      carryingItem: 'Application Reply',
      carryingItemEn: 'Application Reply',
      badgeColor: 'bg-cyan-500',
    },
  ];
}

/**
 * Build a complete bilingual HumanNetworkStory from a compact curriculum spec.
 */
export function makeNetworkStory(spec: StorySpec): HumanNetworkStory {
  const characters = buildCharacters(spec.protocolBadge);
  const [src, mid, dst] = characters;

  const difficultyAr =
    spec.difficulty === 'Beginner'
      ? 'مبتدئ (Beginner)'
      : spec.difficulty === 'Intermediate'
      ? 'متوسط (Intermediate)'
      : spec.difficulty === 'Advanced'
      ? 'متقدم (Advanced)'
      : 'خبير (Expert)';

  const steps: StreetStoryStep[] = spec.steps.map((s, idx) => {
    const from = idx === 0 ? src.id : idx === 1 ? mid.id : mid.id;
    const to = idx === 0 ? mid.id : idx === 1 ? dst.id : dst.id;
    const active = idx === 0 ? src.id : idx === 1 ? mid.id : dst.id;
    return {
      stepNumber: idx + 1,
      titleAr: s.titleAr,
      titleEn: s.titleEn,
      storyNarrativeAr: s.narrativeAr,
      storyNarrativeEn: s.narrativeEn,
      technicalAnalogyAr: s.techAr,
      technicalAnalogyEn: s.techEn,
      ciscoProtocolTerm: spec.ciscoTerm || spec.protocolBadge,
      ciscoCommandSnippet: spec.cliSnippet || `Router# show running-config | section ${spec.protocolBadge.split(' ')[0]}`,
      activeCharacterId: active,
      fromCharacterId: from,
      toCharacterId: to,
      payloadType: spec.protocolBadge.split('(')[0].trim(),
      payloadContentAr: s.payloadAr || s.eventAr,
      payloadContentEn: s.payloadEn || s.eventEn,
      l2Src: src.macAddress,
      l2Dest: idx === 0 ? 'FF:FF:FF:FF:FF:FF' : dst.macAddress,
      l3Src: src.ipAddress,
      l3Dest: dst.ipAddress,
      ttlRemaining: 64 - idx,
      packetPositionPercent: 20 + idx * 30,
      speechBubbles: {
        [src.id]: s.speechAr[0],
        [mid.id]: s.speechAr[1],
        [dst.id]: s.speechAr[2] || s.speechAr[1],
      },
      speechBubblesEn: {
        [src.id]: s.speechEn[0],
        [mid.id]: s.speechEn[1],
        [dst.id]: s.speechEn[2] || s.speechEn[1],
      },
      highlightedEventAr: s.eventAr,
      highlightedEventEn: s.eventEn,
    };
  });

  return {
    id: spec.id,
    track: spec.track,
    category: spec.category,
    categoryAr:
      spec.category === 'switching'
        ? 'التبديل (L2)'
        : spec.category === 'routing'
        ? 'التوجيه (L3)'
        : spec.category === 'security'
        ? 'الأمن'
        : spec.category === 'services'
        ? 'الخدمات'
        : spec.category === 'cloud_overlay'
        ? 'السحابة / DC'
        : spec.category === 'wan_advanced'
        ? 'WAN متقدم'
        : 'الأسس',
    titleAr: spec.titleAr,
    titleEn: spec.titleEn,
    subtitleAr: spec.subtitleAr,
    subtitleEn: spec.subtitleEn,
    protocolBadge: spec.protocolBadge,
    difficulty: difficultyAr,
    difficultyEn: spec.difficulty,
    coverIcon: 'Compass',
    sceneTheme: 'office_gate',
    storySummaryAr: spec.summaryAr,
    storySummaryEn: spec.summaryEn,
    realWorldScenarioDescriptionAr: spec.analogyAr,
    realWorldScenarioDescriptionEn: spec.analogyEn,
    ciscoCoreLessonAr: spec.lessonAr,
    ciscoCoreLessonEn: spec.lessonEn,
    characters,
    steps,
  };
}
