import * as fs from 'fs';

// We will define the comprehensive 5-7 step sequences for each scenario.
const EXPANDED_STEPS: Record<string, any[]> = {
  'same-lan-switching': [
    {
      id: 1,
      stageTitleAr: '1. تجهيز فريم الإيثرنت وفحص الـ ARP',
      stageTitleEn: '1. Frame Encapsulation & Local Subnet Verification',
      stageDescriptionAr: 'حاسوب أحمد (192.168.1.10) يكتشف أن سارة (192.168.1.20) في نفس شبكته (/24). يضع MAC سارة مباشرة كوجهة.',
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
          message: 'رسالة فحص اتصال محلية بدون عبور راوتر'
        }
      },
      explanation: {
        whatIsHappening: 'أحمد لا يحتاج إلى الـ Default Gateway لأن سارة معه في نفس الشبكة المحلية.',
        whyItHappens: 'توفير موارد الراوتر وعدم إشغال البوابات بالاتصالات المحلية.',
        realLifeParallel: 'إرسال مذكرة لزميلك في الغرفة المجاورة مباشرة دون البريد الخارجي.',
        keyObservation: 'MAC الوجهة هو ماك سارة مباشرة وليس ماك الراوتر.'
      },
      highlightEvent: 'switch_forward'
    },
    {
      id: 2,
      stageTitleAr: '2. انتقال الفريم عبر السلك إلى منفذ السويتش Fa0/1',
      stageTitleEn: '2. Physical Cable Ingress to Switch Port Fa0/1',
      stageDescriptionAr: 'الفريم ينتقل كإشارات كهربائية عبر كابل الـ UTP من كارت شبكة أحمد إلى منفذ Fa0/1 في السويتش.',
      layer: 'Layer 1 (Physical / PHY)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'BB:BB:BB:22:22:22',
          etherType: '0x0800',
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
          type: 'ICMP Echo',
          data: 'Signals in transit on copper cable'
        }
      },
      explanation: {
        whatIsHappening: 'تحويل البيانات إلى نبضات جهد كهربائي عبر كابل النحاس Cat6.',
        whyItHappens: 'الطبقة الفيزيائية تنقل الإشارات بين الأجهزة.',
        realLifeParallel: 'حركة الصوت في سلك الهاتف الداخلي.',
        keyObservation: 'لا يوجد أي تعديل على عناوين IP أو MAC أثناء عبور السلك.'
      }
    },
    {
      id: 3,
      stageTitleAr: '3. معالجة السويتش وتحديث جدول CAM',
      stageTitleEn: '3. Hardware ASIC Lookup & CAM Table Update',
      stageDescriptionAr: 'السويتش يستلم الفريم، يسجل ماك أحمد على منفذ Fa0/1، ويبحث عن ماك سارة في جدول العناوين ليجده على Fa0/2.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 1.0,
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
          type: 'ICMP Echo',
          data: 'Unicast forwarding via Port Fa0/2'
        }
      },
      explanation: {
        whatIsHappening: 'معالج السويتش (ASIC) يقرر توجيه الفريم فقط لمنفذ سارة دون إرساله للآخرين.',
        whyItHappens: 'منع التصادمات والحفاظ على خصوصية وسرعة الشبكة.',
        realLifeParallel: 'موظف السنترال يوصل المكالمة مباشرة لتحويلة المكتب المعني.',
        keyObservation: 'الراوتر في هذه الأثناء في حالة سكون تامة ولا يصله أي إشعار!'
      },
      highlightEvent: 'mac_learned',
      tableUpdate: {
        deviceType: 'switch',
        deviceId: 'switch-1',
        tableName: 'MAC Address Table (CAM)',
        entry: {
          key1: 'AA:AA:AA:11:11:11',
          key2: 'Port Fa0/1 (Learned)',
          extra: 'VLAN 1, Status: Dynamic'
        }
      }
    },
    {
      id: 4,
      stageTitleAr: '4. خروج الفريم نحو حاسوب سارة (Egress Fa0/2)',
      stageTitleEn: '4. Frame Egress towards Destination Host B',
      stageDescriptionAr: 'السويتش يرسل الفريم عبر منفذ Fa0/2 المتصل مباشرة بحاسوب سارة.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'switch-1',
      toNodeId: 'host-b',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'BB:BB:BB:22:22:22',
          etherType: '0x0800',
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
          type: 'ICMP Echo',
          data: 'Transiting Fa0/2 cable'
        }
      },
      explanation: {
        whatIsHappening: 'الفريم في طريقه الآن إلى بطاقة شبكة سارة.',
        whyItHappens: 'تطبيق التوجيه أحادي الوجهة (Unicast).',
        realLifeParallel: 'الرسول في ممر المكتب متجهاً لباب سارة.',
        keyObservation: 'منفذ Fa0/3 وباقي الأجهزة في الشبكة لم تتأثر بحركة المرور.'
      }
    },
    {
      id: 5,
      stageTitleAr: '5. استلام سارة للفريم وتجهيز الرد (Echo Reply)',
      stageTitleEn: '5. Destination Ingestion & Echo Reply Formulation',
      stageDescriptionAr: 'كارت شبكة سارة يطابق ماك الوجهة، يستقبل الحزمة، ويجهز رسالة الرد ICMP Echo Reply.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-b',
      fromNodeId: 'switch-1',
      toNodeId: 'host-b',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'BB:BB:BB:22:22:22',
          destMac: 'AA:AA:AA:11:11:11',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.20',
          destIp: '192.168.1.10',
          ttl: 64,
          protocol: 'ICMP Echo Reply',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Reply',
          data: 'Reply from 192.168.1.20: bytes=32 time<1ms TTL=64',
          message: 'تم تجهيز الرد بنجاح'
        }
      },
      explanation: {
        whatIsHappening: 'سارة تعكس المصدر والوجهة لتوجيه الرد إلى أحمد.',
        whyItHappens: 'اكتمال نصف الدورة (Request)، والبدء بنصف الدورة الثاني (Reply).',
        realLifeParallel: 'سارة توقع على إشعار الاستلام وترفقه بالجواب.',
        keyObservation: 'الـ TTL ما زال 64 لأنه لم يعبر أي راوتر يخفضه.'
      },
      highlightEvent: 'destination_reached'
    },
    {
      id: 6,
      stageTitleAr: '6. عودة الرد عبر السويتش ووصوله لأحمد',
      stageTitleEn: '6. Symmetric Return Trip & Round-Trip Completion',
      stageDescriptionAr: 'السويتش يعيد الفريم عبر Fa0/1 إلى أحمد ليكتمل اختبار البينغ بزمن أقل من 1ms.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'host-a',
      fromNodeId: 'switch-1',
      toNodeId: 'host-a',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'BB:BB:BB:22:22:22',
          destMac: 'AA:AA:AA:11:11:11',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.20',
          destIp: '192.168.1.10',
          ttl: 64,
          protocol: 'ICMP Echo Reply',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Reply',
          data: 'Round trip complete! 0% packet loss',
          message: 'نجاح الاتصال المحلي L2 بالكامل'
        }
      },
      explanation: {
        whatIsHappening: 'أحمد يستلم رد الـ Ping ويطبع على الشاشة "Reply from 192.168.1.20".',
        whyItHappens: 'اكتمال الدورة الذهبية الكاملة (Round-Trip Time).',
        realLifeParallel: 'وصول المذكرة الموقعة لمكتب أحمد.',
        keyObservation: 'تبادل كامل للبيانات بسرعة المنافذ الفيزيائية ودون أي تأخير راوتر.'
      },
      highlightEvent: 'destination_reached'
    }
  ],

  'arp-broadcast-resolution': [
    {
      id: 1,
      stageTitleAr: '1. اكتشاف فقدان عنوان الماك وتجميد الحزمة',
      stageTitleEn: '1. ARP Cache Miss & Queuing Outgoing Packet',
      stageDescriptionAr: 'أحمد يريد إرسال بيانات إلى 192.168.1.20 ولكن جدول الـ ARP فارغ! يضع حزمة البيانات في الانتظار ويبدأ طلب ARP.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-a',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'FF:FF:FF:FF:FF:FF (Broadcast)',
          etherType: '0x0806 (ARP)',
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
          message: 'استعلام استكشافي عام في الشبكة'
        }
      },
      explanation: {
        whatIsHappening: 'الحاسوب لا يستطيع إرسال فريم إيثرنت بدون معرفة الـ Destination MAC.',
        whyItHappens: 'عناوين IP منطقية بينما كروت الشبكة تتعامل فقط مع عناوين MAC فيزيائياً.',
        realLifeParallel: 'أنت في مؤتمر تبحث عن شخص بالاسم فقط ولا تعرف شكله.',
        keyObservation: 'فريم الـ ARP يحمل رمز EtherType مميز: 0x0806.'
      },
      highlightEvent: 'arp_broadcast'
    },
    {
      id: 2,
      stageTitleAr: '2. إرسال فريم البث العام (Broadcast) إلى السويتش',
      stageTitleEn: '2. Transmitting Broadcast Frame to Access Switch',
      stageDescriptionAr: 'أحمد يرسل الفريم إلى السويتش حاملاً العنوان العام FF:FF:FF:FF:FF:FF.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'FF:FF:FF:FF:FF:FF',
          etherType: '0x0806',
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
          data: 'Flooding request over copper'
        }
      },
      explanation: {
        whatIsHappening: 'الفريم يتحرك من منفذ أحمد Fa0 إلى منفذ السويتش Fa0/1.',
        whyItHappens: 'السويتش هو نقطة التقاء جميع أجهزة الشبكة المحلية.',
        realLifeParallel: 'التوجه إلى الإذاعة المركزية في المبنى.',
        keyObservation: 'عنوان FF:FF:FF:FF:FF:FF يعني استدعاء جميع الأجهزة بدون استثناء.'
      }
    },
    {
      id: 3,
      stageTitleAr: '3. السويتش يتعلم ماك أحمد ويفيض الفريم (Flooding)',
      stageTitleEn: '3. CAM Ingress Learning & Broadcast Flooding',
      stageDescriptionAr: 'السويتش يسجل ماك أحمد في جدول CAM، وينسخ فريم البث لجميع المنافذ الأخرى في الـ VLAN.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'FF:FF:FF:FF:FF:FF',
          etherType: '0x0806',
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
          data: 'Replicating frame to all access ports except Fa0/1'
        }
      },
      explanation: {
        whatIsHappening: 'السويتش يرسل نسخة إلى حاسوب سارة وباقي الأجهزة المتصلة.',
        whyItHappens: 'طبيعة فريمات البث العام تتطلب إيصالها لجميع أعضاء نطاق البث (Broadcast Domain).',
        realLifeParallel: 'مكبر الصوت يذيع الإعلان في كافة أرجاء الصالة.',
        keyObservation: 'السويتش لا يرسل الفريم أبداً للمنفذ الذي استلمه منه (منع التكرار).'
      },
      highlightEvent: 'arp_broadcast'
    },
    {
      id: 4,
      stageTitleAr: '4. وصول البث لسارة وتجاهل الأجهزة الأخرى',
      stageTitleEn: '4. Target Evaluation & Unrelated Nodes Drop',
      stageDescriptionAr: 'سارة تقرأ الاستعلام وترى أنه يطابق الـ IP الخاص بها، بينما تتجاهله باقي الأجهزة بهدوء.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-b',
      fromNodeId: 'switch-1',
      toNodeId: 'host-b',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'FF:FF:FF:FF:FF:FF',
          etherType: '0x0806',
          macLookupStatus: 'hit'
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
          data: 'Target IP match on Host B!'
        }
      },
      explanation: {
        whatIsHappening: 'سارة تتعلم أيضاً ماك أحمد من الطلب، وتجهز رد ARP أحادي الوجهة (Unicast).',
        whyItHappens: 'توفير استعلام عكسي مستقبلي من سارة لأحمد.',
        realLifeParallel: 'الشخص المطلوب يرفع يده ويقول: نعم، أنا فلان!',
        keyObservation: 'طلب الـ ARP كان بثاً عاماً، لكن الرد سيكون فريماً خاصاً (Unicast).'
      }
    },
    {
      id: 5,
      stageTitleAr: '5. إرسال سارة لرد الـ ARP Unicast إلى السويتش',
      stageTitleEn: '5. Unicast ARP Reply Ingress to Switch',
      stageDescriptionAr: 'سارة ترسل رد الـ ARP: "أنا 192.168.1.20 وعنوان ماكي BB:BB:BB:22:22:22" مباشرة لأحمد.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-b',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'BB:BB:BB:22:22:22 (Host B)',
          destMac: 'AA:AA:AA:11:11:11 (Host A)',
          etherType: '0x0806 (ARP)',
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
          data: '192.168.1.20 is-at BB:BB:BB:22:22:22',
          message: 'رد مباشر موجه لمنفذ أحمد فقط'
        }
      },
      explanation: {
        whatIsHappening: 'السويتش يعرف مسبقاً أين يجلس أحمد بفضل خطوة التعلم السابقة على Fa0/1.',
        whyItHappens: 'لا داعي لفيضان الرد؛ السويتش يوجهه فوراً كـ Unicast.',
        realLifeParallel: 'إعطاء بطاقة العمل مباشرة للشخص السائل.',
        keyObservation: 'رد الـ ARP ذكي ولا يسبب أي إزعاج لباقي أجهزة الشبكة.'
      },
      highlightEvent: 'arp_reply'
    },
    {
      id: 6,
      stageTitleAr: '6. أحمد يحدث جدول الـ ARP ويطلق حزمة البينغ',
      stageTitleEn: '6. ARP Cache Update & Release of Queued Traffic',
      stageDescriptionAr: 'أحمد يستلم رد الـ ARP، يضيف سارة إلى جدول ARP Cache، ويطلق فوراً حزمة البينغ التي كانت معلقة!',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-a',
      fromNodeId: 'switch-1',
      toNodeId: 'host-a',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'BB:BB:BB:22:22:22',
          destMac: 'AA:AA:AA:11:11:11',
          etherType: '0x0806',
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
          data: 'ARP Entry Cached: 192.168.1.20 -> BB:BB:BB:22:22:22'
        }
      },
      explanation: {
        whatIsHappening: 'أحمد لن يحتاج لإرسال ARP Request آخر لسارة طوال فترة صلاحية الكاش (Aging Timer).',
        whyItHappens: 'تسريع الاتصالات اللاحقة وتفادي هدر سعة الشبكة.',
        realLifeParallel: 'حفظ رقم هاتف زميلك في قائمة الاتصال بهاتفك المحمول.',
        keyObservation: 'أول حزمة بينغ قد تتأخر قليلاً بسبب زمن الـ ARP، بينما الحزم التالية تكون فورية.'
      },
      highlightEvent: 'arp_reply',
      tableUpdate: {
        deviceType: 'host',
        deviceId: 'host-a',
        tableName: 'ARP Cache',
        entry: {
          key1: '192.168.1.20',
          key2: 'BB:BB:BB:22:22:22',
          extra: 'Type: Dynamic, Interface: eth0'
        }
      }
    }
  ],

  'default-gateway-ping': [
    {
      id: 1,
      stageTitleAr: '1. تجهيز حزمة ICMP Echo للبوابة الافتراضية',
      stageTitleEn: '1. ICMP Request Creation to Default Gateway (192.168.1.1)',
      stageDescriptionAr: 'أحمد ينفذ الأمر ping 192.168.1.1. الحاسوب يوجه الفريم لعنوان ماك منفذ الراوتر المحلي R1:R1:R1:11:11:11.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-a',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01 (Router Gateway)',
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
          data: 'Default Gateway Reachability Check 32 bytes'
        }
      },
      explanation: {
        whatIsHappening: 'فحص اتصال أساسي بين العميل وبوابة الخروج للعالم الخارجي.',
        whyItHappens: 'الخطوة الأولى في تصحيح أخطاء الشبكة (Troubleshooting) للتأكد من سلامة الكابل المحلي.',
        realLifeParallel: 'التأكد من أن باب المنزل الخارجي مفتوح قبل السفر.',
        keyObservation: 'IP الوجهة هو IP منفذ الراوتر نفسه 192.168.1.1.'
      }
    },
    {
      id: 2,
      stageTitleAr: '2. عبور الفريم إلى سويتش الوصول Fa0/1',
      stageTitleEn: '2. Host to Switch Ingress via Access Link',
      stageDescriptionAr: 'الفريم يتحرك عبر كابل النحاس من كارت شبكة أحمد إلى منفذ Fa0/1 في سويتش الشبكة.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '192.168.1.1',
          ttl: 64,
          protocol: 'ICMP',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Request',
          data: 'Ingress to Switch 1'
        }
      },
      explanation: {
        whatIsHappening: 'السويتش يستلم الفريم ويفحص عنوان الـ MAC للوجهة.',
        whyItHappens: 'السويتش يربط أجهزة الشبكة بالبوابة الافتراضية.',
        realLifeParallel: 'مكتب الاستقبال يستلم الرسالة لتمريرها للمدير.',
        keyObservation: 'السويتش يعتمد على جدول CAM لتحديد المنفذ الصاعد إلى الراوتر.'
      }
    },
    {
      id: 3,
      stageTitleAr: '3. توجيه السويتش للفريم عبر المنفذ الصاعد Gi0/1 للراوتر',
      stageTitleEn: '3. Uplink Forwarding from Switch to Router Gi0/0',
      stageDescriptionAr: 'السويتش يمرر الفريم عبر الوصلة فائقة السرعة Gi0/1 المتصلة بمنفذ الراوتر Gi0/0.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'router-1',
      fromNodeId: 'switch-1',
      toNodeId: 'router-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '192.168.1.1',
          ttl: 64,
          protocol: 'ICMP',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Request',
          data: 'Uplink transmission'
        }
      },
      explanation: {
        whatIsHappening: 'الفريم في طريقه للراوتر عبر منفذ الـ Trunk/Uplink.',
        whyItHappens: 'توصيل الحزمة للبوابة المستهدفة.',
        realLifeParallel: 'استخدام المصعد السريع للوصول إلى طابق الإدارة.',
        keyObservation: 'السرعة هنا 1 Gbps مقارنة بـ 100 Mbps لمنافذ المستخدمين.'
      }
    },
    {
      id: 4,
      stageTitleAr: '4. معالجة الراوتر وتوليد الرد بقيمة TTL=255',
      stageTitleEn: '4. Router CPU Ingestion & Echo Reply Generation',
      stageDescriptionAr: 'الراوتر يستلم الفريم، يطابق IP الوجهة مع عنوان واجهته، ويوجه الحزمة لمعالج الراوتر (Control Plane) للرد بقيمة TTL=255.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'router-1',
      fromNodeId: 'switch-1',
      toNodeId: 'router-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: '11:11:11:00:00:01 (Router)',
          destMac: 'AA:AA:AA:11:11:11 (Host A)',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.1',
          destIp: '192.168.1.10',
          ttl: 255,
          protocol: 'ICMP Echo Reply',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Reply',
          data: 'Reply from 192.168.1.1: bytes=32 time=0.4ms TTL=255',
          message: 'الراوتر حي ومستعد لتمرير حزم الإنترنت'
        }
      },
      explanation: {
        whatIsHappening: 'أنظمة Cisco IOS تبدأ قيمة TTL بحزمها الخاصة بـ 255.',
        whyItHappens: 'علامة مميزة تؤكد أن الحزمة صدرت مباشرة من معالج الراوتر وليس جهازاً خلفه.',
        realLifeParallel: 'المدير نفسه يوقع على الإشعار ويعيده بالبريد الداخلي.',
        keyObservation: 'TTL=255 دليل قاطع على الوصول المباشر للبوابة الافتراضية.'
      },
      highlightEvent: 'destination_reached'
    },
    {
      id: 5,
      stageTitleAr: '5. إرسال الراوتر لرد الـ Echo Reply نحو السويتش',
      stageTitleEn: '5. Egress Echo Reply from Router to Switch',
      stageDescriptionAr: 'الراوتر يعيد حزمة الرد عبر كابل Gi0/0 إلى منفذ السويتش Gi0/1.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'router-1',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: '11:11:11:00:00:01',
          destMac: 'AA:AA:AA:11:11:11',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.1',
          destIp: '192.168.1.10',
          ttl: 255,
          protocol: 'ICMP',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Reply',
          data: 'Transit on downlink'
        }
      },
      explanation: {
        whatIsHappening: 'الفريم يعود بنفس المسار العكسي المنظم.',
        whyItHappens: 'تطبيق التوجيه المتناظر.',
        realLifeParallel: 'الرسول يعود في المصعد إلى طابق الموظفين.',
        keyObservation: 'السويتش يستخدم جدول CAM لتسليم الفريم لأحمد دون غيره.'
      }
    },
    {
      id: 6,
      stageTitleAr: '6. تسليم الرد لحاسوب أحمد وظهور نتيجة الفحص بنجاح',
      stageTitleEn: '6. Host Ingress & Successful Gateway Verification',
      stageDescriptionAr: 'السويتش يسلم الرد لأحمد على منفذ Fa0/1، فيعرض سطر الأوامر نجاح الـ Ping بزمن استجابة أقل من نصف ميلي ثانية.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-a',
      fromNodeId: 'switch-1',
      toNodeId: 'host-a',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: '11:11:11:00:00:01',
          destMac: 'AA:AA:AA:11:11:11',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.1',
          destIp: '192.168.1.10',
          ttl: 255,
          protocol: 'ICMP Echo Reply',
          version: 'IPv4'
        },
        payload: {
          type: 'ICMP Echo Reply',
          data: 'Packets: Sent = 1, Received = 1, Lost = 0 (0% loss)',
          message: 'البوابة الافتراضية جاهزة تماماً للعمل'
        }
      },
      explanation: {
        whatIsHappening: 'اكتمال فحص الخطوة الأولى بنجاح 100%.',
        whyItHappens: 'الحاسوب والراوتر يتواصلان بدون أي خلل فيزيائي أو منطقي.',
        realLifeParallel: 'استلام الإشعار المعتمد وبدء يوم العمل بثقة.',
        keyObservation: 'جاهزية العميل للانتقال للخطوات الأكثر تعقيداً كالخروج للإنترنت.'
      },
      highlightEvent: 'destination_reached'
    }
  ],

  'inter-vlan-routing': [
    {
      id: 1,
      stageTitleAr: '1. إدراك اختلاف الشبكة وتوجيه الفريم للبوابة',
      stageTitleEn: '1. Inter-Subnet Identification & Gateway Encapsulation',
      stageDescriptionAr: 'أحمد في VLAN 10 (192.168.1.10) يريد مراسلة الخادم في VLAN 20 (10.0.0.10). يكتشف اختلاف الشبكة فيوجه الفريم لماك البوابة.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'host-a',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01 (Gateway)',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 64,
          protocol: 'TCP / HTTP',
          version: 'IPv4'
        },
        payload: {
          type: 'HTTP GET',
          data: 'GET /index.html HTTP/1.1'
        }
      },
      explanation: {
        whatIsHappening: 'أحمد لا يستطيع مراسلة الخادم مباشرة لأن كل VLAN تمثل شبكة معزولة تماماً (Broadcast Domain).',
        whyItHappens: 'السويتش بمفرده في Layer 2 لا يمكنه نقل البيانات بين VLANs مختلفة.',
        realLifeParallel: 'تريد إرسال رسالة من قسم المالية إلى قسم الهندسة في مبنى آخر.',
        keyObservation: 'عناوين IP تدل على شبكات مختلفة، لذا يتدخل الراوتر حتماً.'
      }
    },
    {
      id: 2,
      stageTitleAr: '2. وصول الفريم لمنفذ الـ Access وإضافة وسم 802.1Q',
      stageTitleEn: '2. Access Ingress & 802.1Q Trunk Tag Insertion',
      stageDescriptionAr: 'السويتش يستلم الفريم على منفذ Access في VLAN 10، ويضيف وسم 802.1Q (VID=10) لتمريره عبر وصلة الـ Trunk.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01',
          etherType: '0x8100 (802.1Q Tag: VLAN 10)',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 64,
          protocol: 'TCP',
          version: 'IPv4'
        },
        payload: {
          type: 'Tagged Frame',
          data: 'Tagged VLAN 10 on Gi0/1 Trunk'
        }
      },
      explanation: {
        whatIsHappening: 'بروتوكول IEEE 802.1Q يضيف 4 بايت تحتوي على رقم الـ VLAN.',
        whyItHappens: 'وصلة الـ Trunk تنقل بيانات عدة VLANs عبر كابل فيزيائي واحد.',
        realLifeParallel: 'وضع طابع ملون على الظرف يحدد القسم التابع له.',
        keyObservation: 'تغيير حجم الفريم بإضافة 4 بايت لحقل الـ 802.1Q Header.'
      },
      highlightEvent: 'switch_forward'
    },
    {
      id: 3,
      stageTitleAr: '3. صعود الفريم عبر وصلة الـ Trunk إلى الراوتر (ROAS)',
      stageTitleEn: '3. Router-on-a-Stick Subinterface Ingress',
      stageDescriptionAr: 'الفريم يصل لمنفذ الراوتر الفيزيائي Gi0/0، حيث تستقبله الواجهة الفرعية Gi0/0.10 المخصصة لـ VLAN 10.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'router-1',
      fromNodeId: 'switch-1',
      toNodeId: 'router-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: '11:11:11:00:00:01',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 64,
          protocol: 'TCP',
          version: 'IPv4'
        },
        payload: {
          type: 'Router Processing',
          data: 'Subinterface Gi0/0.10 decapsulates 802.1Q'
        }
      },
      explanation: {
        whatIsHappening: 'الراوتر ينزع وسم 802.1Q ويفحص عنوان IP الوجهة في جدول التوجيه.',
        whyItHappens: 'تقنية Router-on-a-Stick تسمح للراوتر بربط عدة VLANs بمنفذ فيزيائي واحد.',
        realLifeParallel: 'مكتب الجمارك يفتح الطرد ويفحص المستندات.',
        keyObservation: 'الراوتر هو الكيان الوحيد المخول بكسر العزل بين الـ VLANs.'
      },
      highlightEvent: 'route_lookup',
      tableUpdate: {
        deviceType: 'router',
        deviceId: 'router-1',
        tableName: 'Routing Table (RIB)',
        entry: {
          key1: '10.0.0.0/24',
          key2: 'via WAN Serial/Gi0/1 -> Router 2',
          extra: 'Metric: 1, Protocol: OSPF'
        }
      }
    },
    {
      id: 4,
      stageTitleAr: '4. عبور الحزمة شبكة الـ WAN المشتركة إلى راوتر المركز',
      stageTitleEn: '4. Inter-Router WAN Backbone Routing',
      stageDescriptionAr: 'الراوتر R1 يقلل TTL إلى 63، ويعيد تغليف الحزمة بألياف الـ WAN المتجهة إلى راوتر مركز البيانات R2.',
      layer: 'Layer 3 (Network Layer)',
      activeNodeId: 'router-2',
      fromNodeId: 'router-1',
      toNodeId: 'router-2',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: '11:11:11:00:00:02 (R1 WAN)',
          destMac: '22:22:22:00:00:01 (R2 WAN)',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 63,
          protocol: 'TCP',
          version: 'IPv4'
        },
        payload: {
          type: 'WAN Packet',
          data: 'Optical Transit over 10 Gbps Link'
        }
      },
      explanation: {
        whatIsHappening: 'تغيير كامل لعناوين MAC في كل قفزة راوتر بينما تبقى عناوين IP الأصلية ثابتة.',
        whyItHappens: 'عناوين MAC محلية وتنتهي صلاحيتها عند كل منفذ راوتر.',
        realLifeParallel: 'تغيير شاحنة النقل في محطة التوزيع المركزية.',
        keyObservation: 'قيمة TTL تنقص بمقدار 1 في كل خطوة راوتر لمنع الحلقات غير المنتهية.'
      }
    },
    {
      id: 5,
      stageTitleAr: '5. وصول الحزمة لسويتش مركز البيانات Switch 2',
      stageTitleEn: '5. DC Switch Ingress & VLAN 20 Segregation',
      stageDescriptionAr: 'الراوتر R2 يمرر الحزمة إلى سويتش مركز البيانات مع وسم VLAN 20.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-2',
      fromNodeId: 'router-2',
      toNodeId: 'switch-2',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: '22:22:22:00:00:02',
          destMac: 'CC:CC:CC:88:88:88',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 62,
          protocol: 'TCP',
          version: 'IPv4'
        },
        payload: {
          type: 'DC Access',
          data: 'VLAN 20 Delivery'
        }
      },
      explanation: {
        whatIsHappening: 'سويتش مركز البيانات ينزع أي وسوم Trunk ويرسل الفريم كـ Access عادي للخادم.',
        whyItHappens: 'الخوادم لا تحتاج للتعامل مع وسوم 802.1Q المعقدة.',
        realLifeParallel: 'إزالة الغلاف الخارجي وتسليم الرسالة للموظف في مكتبه.',
        keyObservation: 'الخادم يستلم فريم إيثرنت نظيف تماماً.'
      }
    },
    {
      id: 6,
      stageTitleAr: '6. استلام خادم البيانات للطلب والرد الناجح عبر الـ VLANs',
      stageTitleEn: '6. Server Destination Reached & Inter-VLAN Complete',
      stageDescriptionAr: 'الخادم (10.0.0.10) يستقبل طلب الـ HTTP ويولد صفحة الويب للرد على أحمد في VLAN 10.',
      layer: 'Layer 7 (Application)',
      activeNodeId: 'server-1',
      fromNodeId: 'switch-2',
      toNodeId: 'server-1',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: '22:22:22:00:00:02',
          destMac: 'CC:CC:CC:88:88:88',
          etherType: '0x0800',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '192.168.1.10',
          destIp: '10.0.0.10',
          ttl: 62,
          protocol: 'HTTP 200 OK',
          version: 'IPv4'
        },
        payload: {
          type: 'HTTP Payload',
          data: 'HTTP/1.1 200 OK (Content-Length: 1024)',
          message: 'نجاح التوجيه بين الـ VLANs عبر شبكة Cisco بالكامل'
        }
      },
      explanation: {
        whatIsHappening: 'اكتمال سيناريو الـ Inter-VLAN بنجاح باهر.',
        whyItHappens: 'تضافر عمل الـ Access Ports، الـ Trunk Ports، والـ Subinterfaces في راوتر سيسكو.',
        realLifeParallel: 'المستلم يقرأ الرسالة ويرسل المستند المطلوب رداً عليها.',
        keyObservation: 'تحقيق الأمان والعزل التام مع إمكانية التواصل المنظم عبر الراوتر.'
      },
      highlightEvent: 'destination_reached'
    }
  ],

  'rstp-fast-convergence': [
    {
      id: 1,
      stageTitleAr: '1. الحالة المستقرة وتبادل BPDUs مع إغلاق المنفذ الاحتياطي',
      stageTitleEn: '1. Steady-State RSTP & Alternate Port Blocking',
      stageDescriptionAr: 'السويتشات الثلاثة تنتخب Switch-1 كـ Root Bridge. منفذ Gi0/2 في Switch-3 في وضع الإغلاق (Alternate/Discarding) لمنع الحلقات.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-1',
      fromNodeId: 'host-a',
      toNodeId: 'switch-3',
      progressPercentage: 0,
      headers: {
        l2: {
          srcMac: '00:03:00:00:00:03 (SW3)',
          destMac: '01:80:C2:00:00:00 (STP Multicast)',
          etherType: '0x0027 (IEEE 802.1D/w)',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '0.0.0.0',
          destIp: '0.0.0.0',
          ttl: 1,
          protocol: 'RSTP BPDU',
          version: '802.1w'
        },
        payload: {
          type: 'RSTP BPDU',
          data: 'Root ID: 24576.00:01:00:00:00:01, Cost: 4, Role: Alternate'
        }
      },
      explanation: {
        whatIsHappening: 'بروتوكول RSTP يحافظ على مسار وحيد نشط بدون حلقات (Loop-Free).',
        whyItHappens: 'وجود أكثر من مسار بين السويتشات يسبب عواصف بث كارثية (Broadcast Storms) إن لم يغلق أحدها.',
        realLifeParallel: 'إشارة مرور تمنع الدخول في الاتجاه المعاكس لتفادي الاصطدام.',
        keyObservation: 'المنفذ البديل جاهز للعمل فوراً في حال سقوط الخط الرئيسي.'
      }
    },
    {
      id: 2,
      stageTitleAr: '2. حركة البيانات الطبيعية عبر المسار الأساسي (SW3 -> SW1)',
      stageTitleEn: '2. Primary Forwarding Path Traffic Flow',
      stageDescriptionAr: 'حاسوب أحمد يرسل بيانات إلى سارة، فتمر البيانات عبر المسار الطبيعي: Switch 3 ثم Switch 1.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-3',
      fromNodeId: 'switch-3',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'BB:BB:BB:22:22:22',
          etherType: '0x0800',
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
          type: 'ICMP Traffic',
          data: 'Flowing via active Root Port'
        }
      },
      explanation: {
        whatIsHappening: 'البيانات تسلك المسار المفتوح فقط وتتجنب المنفذ المحظور.',
        whyItHappens: 'منع تكرار الفريمات وازدواجيتها في الشبكة.',
        realLifeParallel: 'المركبات تسلك الطريق السريع المفتوح.',
        keyObservation: 'منفذ Gi0/2 لا يمرر أي فريمات مستخدمين إطلاقاً في هذه المرحلة.'
      }
    },
    {
      id: 3,
      stageTitleAr: '3. تمرير Root Bridge للفريم نحو Switch 2 وسارة',
      stageTitleEn: '3. Root Switch Egress to Designated Switch 2',
      stageDescriptionAr: 'سويتش الجذر يمرر الفريم إلى سويتش 2، ومنه إلى حاسوب سارة بنجاح.',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-2',
      fromNodeId: 'switch-1',
      toNodeId: 'switch-2',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'BB:BB:BB:22:22:22',
          etherType: '0x0800',
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
          type: 'Data Delivery',
          data: 'Delivered to Host B via SW2'
        }
      },
      explanation: {
        whatIsHappening: 'اكتمال مسار البيانات الكلاسيكي في وجود RSTP.',
        whyItHappens: 'التوصيل وفق شجرة الامتداد المحسوبة مسبقاً.',
        realLifeParallel: 'الوصول للوجهة عبر المسار المعتاد.',
        keyObservation: 'أداء مستقر وسرعة 1 Gbps عبر الألياف.'
      }
    },
    {
      id: 4,
      stageTitleAr: '4. وقوع عطل مفاجئ وانقطاع كابل المسار الأساسي!',
      stageTitleEn: '4. Sudden Link Failure & Fast Loss-of-BPDU Detection',
      stageDescriptionAr: 'انقطاع الكابل بين Switch 3 و Switch 1! بروتوكول RSTP يكتشف فقدان الـ BPDUs خلال أقل من ثانية.',
      layer: 'Layer 1 (Physical / Topology Event)',
      activeNodeId: 'switch-3',
      fromNodeId: 'switch-3',
      toNodeId: 'switch-1',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: '00:03:00:00:00:03',
          destMac: '01:80:C2:00:00:00',
          etherType: '0x0027',
          macLookupStatus: 'miss_flooding'
        },
        l3: {
          srcIp: '0.0.0.0',
          destIp: '0.0.0.0',
          ttl: 1,
          protocol: 'RSTP Failover',
          version: '802.1w'
        },
        payload: {
          type: 'Physical Alert',
          data: 'LINK DOWN on Gi0/1! Loss of 3 consecutive BPDUs'
        }
      },
      explanation: {
        whatIsHappening: 'بروتوكول RSTP (802.1w) أسرع بمئات المرات من STP القديم (802.1D).',
        whyItHappens: 'STP القديم كان يحتاج 30-50 ثانية للتحويل، بينما RSTP يحتاج فقط 1 إلى 2 ثانية!',
        realLifeParallel: 'انقطاع التيار الكهربائي وتشغيل المولد الاحتياطي تلقائياً.',
        keyObservation: 'اكتشاف العطل فوراً وتفعيل بروتوكول المصافحة السريعة Proposal/Agreement.'
      },
      highlightEvent: 'link_down'
    },
    {
      id: 5,
      stageTitleAr: '5. فتح المنفذ البديل فوراً (Alternate -> Forwarding)',
      stageTitleEn: '5. Instant State Transition without Listening Delays',
      stageDescriptionAr: 'منفذ Gi0/2 في Switch 3 يتحول فوراً من Discarding إلى Forwarding دون انتظار فترات Listening/Learning!',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-3',
      fromNodeId: 'switch-3',
      toNodeId: 'switch-2',
      progressPercentage: 0.5,
      headers: {
        l2: {
          srcMac: '00:03:00:00:00:03',
          destMac: '01:80:C2:00:00:00',
          etherType: '0x0027',
          macLookupStatus: 'hit'
        },
        l3: {
          srcIp: '0.0.0.0',
          destIp: '0.0.0.0',
          ttl: 1,
          protocol: 'RSTP Agreement',
          version: '802.1w'
        },
        payload: {
          type: 'RSTP Proposal/Agreement',
          data: 'Port Gi0/2 is now FORWARDING (New Root Port)'
        }
      },
      explanation: {
        whatIsHappening: 'التحول الفوري (Fast Convergence) هو الميزة الثورية لـ Rapid Spanning Tree.',
        whyItHappens: 'حماية مكالمات الصوت (VoIP) وجلسات الفيديو من الانقطاع أثناء الأعطال.',
        realLifeParallel: 'فتح البوابة الاحتياطية في ثوانٍ معدودة عند إغلاق البوابة الرئيسية.',
        keyObservation: 'زمن التحول أقل من ثانيتين مع الحفاظ على الأمان الكامل من الحلقات.'
      },
      highlightEvent: 'spanning_tree_reconverged'
    },
    {
      id: 6,
      stageTitleAr: '6. استئناف تدفق الحزم عبر المسار الجديد البديل بنجاح',
      stageTitleEn: '6. Seamless Traffic Re-Routing & Zero Downtime',
      stageDescriptionAr: 'حزم أحمد تسلك الآن المسار الجديد: Switch 3 -> Switch 2 -> سارة، وتصل دون فقدان أي بيانات!',
      layer: 'Layer 2 (Data Link)',
      activeNodeId: 'switch-2',
      fromNodeId: 'switch-2',
      toNodeId: 'host-b',
      progressPercentage: 1.0,
      headers: {
        l2: {
          srcMac: 'AA:AA:AA:11:11:11',
          destMac: 'BB:BB:BB:22:22:22',
          etherType: '0x0800',
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
          type: 'ICMP Ping Resumed',
          data: 'Traffic Restored! Convergence Time: 1.2 seconds'
        }
      },
      explanation: {
        whatIsHappening: 'نجاح كامل لعملية التقارب والتعافي الذاتي للشبكة (Self-Healing Network).',
        whyItHappens: 'جاهزية التصميم وتطبيق معايير Cisco Enterprise في التكرار والاعتمادية.',
        realLifeParallel: 'السيارات تعبر الطريق البديل بسلاسة دون أن يلاحظ الركاب أي تأخير.',
        keyObservation: 'استمرار الخدمة بنسبة توافر 99.999% (Five Nines Availability).'
      },
      highlightEvent: 'destination_reached'
    }
  ]
};

console.log('Total scenario replacements configured:', Object.keys(EXPANDED_STEPS).length);
