import React from "react";
import Link from "next/link";

const levels = [
  {
    color: "#C8E6C9", // 綠色
    group: "1-3",
    title: "新手階（1~3級）",
    intro: "球齡一年內，對於規則、場地、發力皆不熟悉",
    levels: [
      { level: 1, description: "剛接觸羽球學會比賽規則，並懂得比賽禮儀" },
      { level: 2, description: "在中場距離中高球來回10拍，發球有一半以上成功率" },
      { level: 3, description: "定點有一半可以打到2/3場後，發球有九成以上成功率" },
    ]
  },
  {
    color: "#F8BBD0", // 粉紅色
    group: "4-7",
    title: "初階 / 初中階（4~7級）",
    intro: "球齡1~5年，一般雙打團之初階或中下程度，略懂基本腳步，能完成殺球、切球等基本技術",
    levels: [
      { level: 4, description: "清楚正確握拍法。長球穿定點可以打到後場，女生可以打到中後場，高壓基本準佳；反手明顯劣勢" },
      { level: 5, description: "清楚正確握拍法，略懂基本腳步。基本球路在非受迫時有一定的表現" },
      { level: 6, description: "清楚正確握拍法、略懂基本腳步，並懂得基本輪轉，尚不熟練。已開始會殺球及切球，非受迫時移動長切可至中後場" },
      { level: 7, description: "殺球、切球或長球不論是回動或移動，成功率及穩定性有上成以上。已有基本中步能力，但無穩定" },
    ]
  },
  {
    color: "#FFF59D", // 黃色
    group: "8-9",
    title: "中階（8~9級）",
    intro: "球齡5~10年，具備基本戰術概念與中等攻防穩定性，一般雙打團之中階程度",
    levels: [
      { level: 8, description: "有基本戰術及打點，熟悉輪轉概念，切殺長吊有七成以上準確性。防守有些進步，但遇高手仍無招架" },
      { level: 9, description: "切殺長吊中有三種球路有六成以上準確性及質量，發力及力道已有強度，防守要有一定程度的變化及穩定性" },
    ]
  },
  {
    color: "#81D4FA", // 藍色
    group: "10-12",
    title: "中進階（10~12級）",
    intro: "球齡10年以上，球路變化靈活、穩定、具策略性並能控球得分",
    levels: [
      { level: 10, description: "輪轉概念熟悉並能活化運用，策略性戰略及打點皆能有效得分" },
      { level: 11, description: "切殺長吊皆具準確性，發力及速度，策略搭配、輕鬆完成任各種球路，防守具反壓能力" },
      { level: 12, description: "有高速接位及靈敏地位反應變速，殺切吊都是有高強度及路性，常有一擊必殺的球路" },
    ]
  },
  {
    color: "#F4F4F4", // 淺灰
    group: "13-15",
    title: "高階（13~15級）",
    intro: "校隊前段、體保、社會甲組等，具備完整技術與戰略組織能力",
    levels: [
      { level: 13, description: "各種球路都穩定熟練，防守無死角，球速快質量高，戰略組織、爆發力都屬上等" },
      { level: 14, description: "校隊前段、體保等級球員" },
      { level: 15, description: "社會甲組等級，球感優異、全面" },
    ]
  },
  {
    color: "#000000", // 黑底
    textColor: "#ffffff", // 白字
    group: "16-18",
    title: "職業級（16~18級）",
    intro: "甲組、國家代表選手，各種球路與戰術、步法已爐火純青，並具個人風格",
    levels: [
      { level: 16, description: "各種球路、戰術、步法已爐火純青，且發展出個人獨特球風風格" },
      { level: 17, description: "甲組選手、國家代表選手" },
      { level: 18, description: "國際頂尖水準" },
    ]
  },
];

export default function BadmintonLevels() {
  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center">台灣羽球推廣協會羽球程度分級</h1>
      <div className="rounded-2xl p-6 border border-gray-300 shadow-xl hover:shadow-2xl hover:brightness-95 hover:scale-[1.01] transition-all duration-300"
>
        {levels.map((group, index) => (
          <Link href={`/levels/${group.group}`} key={index}>
          <div
            className="rounded-2xl overflow-hidden p-6 border border-gray-300 shadow-xl hover:shadow-2xl hover:brightness-95 hover:scale-[1.01] transition-all duration-300"
            style={{
              backgroundColor: group.color,
              color: group.textColor || 'black'
            }}
          >
              <h2 className="text-2xl font-bold mb-2">{group.title}</h2>
              <p className="text-base mb-3">{group.intro}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-inherit">
                {group.levels.map((item) => (
                  <li key={item.level}>
                    <strong>{item.level}級：</strong>{item.description}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
