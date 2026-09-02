import { CurriculumSection, CurriculumTrack } from '../types';
import { CCNA_CURRICULUM_MODULES } from './ciscoCcnaCurriculum';
import { CCNP_CURRICULUM_MODULES } from './ciscoCcnpCurriculum';
import { CCIE_CURRICULUM_MODULES } from './ciscoCcieCurriculum';
import { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

export { CCNA_CURRICULUM_MODULES } from './ciscoCcnaCurriculum';
export { CCNP_CURRICULUM_MODULES } from './ciscoCcnpCurriculum';
export { CCIE_CURRICULUM_MODULES } from './ciscoCcieCurriculum';
export { PROTOCOL_DEEP_DIVES } from './protocolDeepDives';

// Combine all tracks
export const ALL_CURRICULUM_SECTIONS: CurriculumSection[] = [
  ...CCNA_CURRICULUM_MODULES,
  ...CCNP_CURRICULUM_MODULES,
  ...CCIE_CURRICULUM_MODULES
];

export const ALL_CURRICULUM_TRACKS: Record<CurriculumTrack, {
  trackId: CurriculumTrack;
  titleAr: string;
  titleEn: string;
  examCode: string;
  badge: string;
  levelBadgeAr: string;
  levelBadgeEn: string;
  blueprintRef: string;
  descriptionAr: string;
  descriptionEn: string;
  officialDomainsCount: number;
  sections: CurriculumSection[];
}> = {
  ccna: {
    trackId: 'ccna',
    titleAr: 'مسار سيسكو CCNA R&S (200-301)',
    titleEn: 'Cisco CCNA 200-301 Track',
    examCode: '200-301 CCNA',
    badge: 'Associate Level',
    levelBadgeAr: 'المستوى التأسيسي المعتمد (Associate)',
    levelBadgeEn: 'Certified Associate Level',
    blueprintRef: 'Cisco Official Blueprint 200-301 v1.1',
    descriptionAr: 'المنهج الكامل والشامل لشهادة سيسكو CCNA: يغطي كافة النطاقات الستة الرسمية من أساسيات TCP/IP و Subnetting، إلى تبديل L2 و VLANs و STP، والتوجيه بـ OSPF، وخدمات الشبكة والأمان والبرمجة.',
    descriptionEn: 'The full official Cisco CCNA blueprint curriculum covering all 6 domains: Network Fundamentals, Network Access, IP Connectivity, IP Services, Security Fundamentals, and Automation.',
    officialDomainsCount: 6,
    sections: CCNA_CURRICULUM_MODULES
  },
  ccnp: {
    trackId: 'ccnp',
    titleAr: 'مسار سيسكو CCNP Enterprise (ENCOR & ENARSI)',
    titleEn: 'Cisco CCNP Enterprise Track (350-401 & 300-410)',
    examCode: '350-401 ENCOR / 300-410 ENARSI',
    badge: 'Professional Level',
    levelBadgeAr: 'المستوى الاحترافي المتقدم (Professional)',
    levelBadgeEn: 'Certified Professional Level',
    blueprintRef: 'Cisco ENCOR 350-401 & ENARSI 300-410 Blueprint',
    descriptionAr: 'المنهج الاحترافي لشبكات المؤسسات الكبرى: يغطي أشجار Spanning Tree المتعددة (MSTP)، و OSPF المتقدم للمناطق المتعددة، و EIGRP Named Mode، و BGP، وإعادة التوزيع المحمية بالـ Route Tags، وتقنيات الـ Overlays.',
    descriptionEn: 'Advanced Enterprise networking: Multiple Spanning Tree (MSTP), Multi-Area OSPF LSA 1-7, EIGRP Named Mode, BGP path engineering, mutual redistribution with route-tagging, and overlays.',
    officialDomainsCount: 6,
    sections: CCNP_CURRICULUM_MODULES
  },
  ccie: {
    trackId: 'ccie',
    titleAr: 'مسار خبير سيسكو CCIE Enterprise Infrastructure (v1.1)',
    titleEn: 'Cisco CCIE Enterprise Infrastructure v1.1 Track',
    examCode: 'CCIE EI v1.1 Lab & Written',
    badge: 'Expert Level',
    levelBadgeAr: 'المستوى القيادي الأعلى (Expert)',
    levelBadgeEn: 'Certified Expert Level',
    blueprintRef: 'Cisco CCIE Enterprise Infrastructure v1.1 Blueprint',
    descriptionAr: 'المنهج المتقدم لأعلى شهادة في هندسة الشبكات: توجيه النواة المزدوج Dual-Stack، و BGP ORR والمجتمعات الموسعة، و Segment Routing مع TI-LFA، و Cisco SD-Access مع LISP و VXLAN و SGT، والتشخيص المعمق للـ TAC.',
    descriptionEn: 'The definitive blueprint for Cisco highest certification: Dual-Stack Core Routing, BGP-ORR, Segment Routing with sub-50ms TI-LFA, Cisco SD-Access fabric (LISP/VXLAN/SGT), and expert TAC diagnostics.',
    officialDomainsCount: 5,
    sections: CCIE_CURRICULUM_MODULES
  }
};
