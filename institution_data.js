// 機関データベース（模擬データ）
// 実際の実装では、厚労省APIなどを使用して病院データを取得します

// 病院データ
const hospitalDatabase = [
    { id: "h1", name: "東京大学医学部附属病院", address: "東京都文京区本郷7-3-1", region: "関東", type: "大学病院" },
    { id: "h2", name: "大阪大学医学部附属病院", address: "大阪府吹田市山田丘2-15", region: "関西", type: "大学病院" },
    { id: "h3", name: "国立がん研究センター中央病院", address: "東京都中央区築地5-1-1", region: "関東", type: "専門病院" },
    { id: "h4", name: "聖路加国際病院", address: "東京都中央区明石町9-1", region: "関東", type: "総合病院" },
    { id: "h5", name: "慶應義塾大学病院", address: "東京都新宿区信濃町35", region: "関東", type: "大学病院" },
    { id: "h6", name: "北海道大学病院", address: "北海道札幌市北区北14条西5", region: "北海道", type: "大学病院" },
    { id: "h7", name: "東北大学病院", address: "宮城県仙台市青葉区星陵町1-1", region: "東北", type: "大学病院" },
    { id: "h8", name: "名古屋大学医学部附属病院", address: "愛知県名古屋市昭和区鶴舞町65", region: "中部", type: "大学病院" },
    { id: "h9", name: "九州大学病院", address: "福岡県福岡市東区馬出3-1-1", region: "九州", type: "大学病院" },
    { id: "h10", name: "神戸市立医療センター中央市民病院", address: "兵庫県神戸市中央区港島南町2-1-1", region: "関西", type: "総合病院" }
];

// 看護学校データ
const nursingSchoolDatabase = [
    { id: "s1", name: "東京大学医学部附属看護学校", address: "東京都文京区本郷7-3-1", region: "関東" },
    { id: "s2", name: "大阪大学医学部保健学科", address: "大阪府吹田市山田丘1-7", region: "関西" },
    { id: "s3", name: "聖路加国際大学看護学部", address: "東京都中央区明石町10-1", region: "関東" },
    { id: "s4", name: "日本赤十字看護大学", address: "東京都渋谷区広尾4-1-3", region: "関東" },
    { id: "s5", name: "北海道大学医学部保健学科", address: "北海道札幌市北区北12条西5", region: "北海道" },
    { id: "s6", name: "東北大学医学部保健学科", address: "宮城県仙台市青葉区星陵町2-1", region: "東北" },
    { id: "s7", name: "名古屋大学医学部保健学科", address: "愛知県名古屋市東区大幸南1-1-20", region: "中部" },
    { id: "s8", name: "九州大学医学部保健学科", address: "福岡県福岡市東区馬出3-1-1", region: "九州" }
];

// 自治体データ
const regionDatabase = [
    { id: "r1", name: "北海道", population: "約500万人", hospitals: 566 },
    { id: "r2", name: "東北地方", population: "約850万人", hospitals: 647 },
    { id: "r3", name: "関東地方", population: "約4,400万人", hospitals: 2356 },
    { id: "r4", name: "中部地方", population: "約2,100万人", hospitals: 1128 },
    { id: "r5", name: "関西地方", population: "約2,000万人", hospitals: 1037 },
    { id: "r6", name: "中国地方", population: "約700万人", hospitals: 532 },
    { id: "r7", name: "四国地方", population: "約360万人", hospitals: 321 },
    { id: "r8", name: "九州・沖縄地方", population: "約1,400万人", hospitals: 908 }
];

// 各地域の特有の用語バリエーション（例）
const regionalTerminologyVariations = {
    "北海道": {
        "発熱": "高温",
        "浮腫": "むくみ",
        "呼吸困難": "呼吸苦しさ",
        "水分摂取": "水分補給",
    },
    "東北地方": {
        "発熱": "熱あり",
        "頭部痛": "頭痛み",
        "呼吸困難": "息苦しさ",
    },
    "関東地方": {
        // 標準に近い用語が多い
    },
    "中部地方": {
        "浮腫": "腫れ",
        "悪心": "胸やけ",
    },
    "関西地方": {
        "発熱": "熱出てる",
        "悪心": "胸悪い",
        "体位変換": "向き変え",
    },
    "中国地方": {
        "浮腫": "むくれ",
        "体温上昇": "熱上がり",
    },
    "四国地方": {
        "頭部痛": "頭重い",
    },
    "九州・沖縄地方": {
        "発熱": "熱出し",
        "呼吸困難": "息詰まり",
        "体位変換": "寝返り",
    }
};

// 病院独自の用語（例）
const hospitalTerminologyVariations = {
    "h1": { // 東京大学医学部附属病院
        "体温上昇": "BT↑",
        "血圧モニタリング": "BP観察",
    },
    "h3": { // 国立がん研究センター中央病院
        "悪心": "N",
        "体温上昇": "発熱",
        "呼吸困難": "DOE",
    },
    "h6": { // 北海道大学病院
        "浮腫": "浮腫み",
        "体温上昇": "発熱あり",
    },
    "h9": { // 九州大学病院
        "体温上昇": "高熱",
        "呼吸困難": "呼吸苦",
    }
};

// 学校独自の用語（例）
const schoolTerminologyVariations = {
    "s1": { // 東京大学医学部附属看護学校
        "体温上昇": "発熱",
        "呼吸困難": "呼吸困難感",
    },
    "s3": { // 聖路加国際大学看護学部
        "浮腫": "浮腫（むくみ）",
        "体位変換": "体位変換（ポジショニング）",
    },
    "s5": { // 北海道大学医学部保健学科
        "体温上昇": "体温上昇（発熱）",
        "頭部痛": "頭痛"
    }
};

// 用語のばらつきを計算
function calculateTerminologyVariation(baseTerminology, targetTerminology) {
    let variations = {};
    let total = 0;
    let different = 0;
    
    // 症状用語の比較
    Object.keys(baseTerminology.symptoms).forEach(key => {
        total++;
        const baseStandard = baseTerminology.symptoms[key].standard;
        const targetTerm = findMatchingTerm(key, targetTerminology.symptoms);
        
        if (targetTerm && targetTerm.standard !== baseStandard) {
            different++;
            if (!variations["symptoms"]) variations["symptoms"] = [];
            variations["symptoms"].push({
                original: key,
                baseStandard: baseStandard,
                targetStandard: targetTerm.standard
            });
        }
    });
    
    // 治療用語の比較
    Object.keys(baseTerminology.treatments).forEach(key => {
        total++;
        const baseStandard = baseTerminology.treatments[key].standard;
        const targetTerm = findMatchingTerm(key, targetTerminology.treatments);
        
        if (targetTerm && targetTerm.standard !== baseStandard) {
            different++;
            if (!variations["treatments"]) variations["treatments"] = [];
            variations["treatments"].push({
                original: key,
                baseStandard: baseStandard,
                targetStandard: targetTerm.standard
            });
        }
    });
    
    // 観察用語の比較
    Object.keys(baseTerminology.observations).forEach(key => {
        total++;
        const baseStandard = baseTerminology.observations[key].standard;
        const targetTerm = findMatchingTerm(key, targetTerminology.observations);
        
        if (targetTerm && targetTerm.standard !== baseStandard) {
            different++;
            if (!variations["observations"]) variations["observations"] = [];
            variations["observations"].push({
                original: key,
                baseStandard: baseStandard,
                targetStandard: targetTerm.standard
            });
        }
    });
    
    return {
        variations: variations,
        variationRate: total > 0 ? (different / total) * 100 : 0
    };
}

// 対応する用語を検索
function findMatchingTerm(key, terminology) {
    if (terminology[key]) return terminology[key];
    
    for (const [termKey, termValue] of Object.entries(terminology)) {
        if (termKey.includes(key) || key.includes(termKey)) {
            return termValue;
        }
    }
    
    return null;
}

// 所属機関と地域の選択状況
let selectedInstitution = null;
let selectedInstitutionType = null; // hospital, school, region

// 選択した機関に基づいて用語を更新
function updateTerminologyBasedOnSelection() {
    if (!selectedInstitution) return;
    
    // 現在の用語辞書を取得
    let currentDictionary = nursingTerminologies[currentTerminology];
    
    // 選択した機関タイプに基づいて用語辞書を更新
    if (selectedInstitutionType === 'hospital') {
        const hospital = hospitalDatabase.find(h => h.id === selectedInstitution.id);
        if (hospital) {
            // 地域固有の用語バリエーションを適用
            applyRegionalVariations(currentDictionary, hospital.region);
            
            // 病院固有の用語バリエーションを適用
            if (hospitalTerminologyVariations[hospital.id]) {
                applyInstitutionVariations(currentDictionary, hospitalTerminologyVariations[hospital.id]);
            }
        }
    } 
    else if (selectedInstitutionType === 'school') {
        const school = nursingSchoolDatabase.find(s => s.id === selectedInstitution.id);
        if (school) {
            // 地域固有の用語バリエーションを適用
            applyRegionalVariations(currentDictionary, school.region);
            
            // 学校固有の用語バリエーションを適用
            if (schoolTerminologyVariations[school.id]) {
                applyInstitutionVariations(currentDictionary, schoolTerminologyVariations[school.id]);
            }
        }
    }
    else if (selectedInstitutionType === 'region') {
        // 地域固有の用語バリエーションを適用
        applyRegionalVariations(currentDictionary, selectedInstitution.name);
    }
    
    console.log(`${selectedInstitution.name}の用語で更新しました`);
}

// 地域固有の用語バリエーションを適用
function applyRegionalVariations(dictionary, region) {
    const variations = regionalTerminologyVariations[region];
    if (!variations) return;
    
    // 各用語カテゴリーに地域バリエーションを適用
    for (const [term, variation] of Object.entries(variations)) {
        // 症状、治療、観察カテゴリーを検索
        applyVariationToCategory(dictionary.symptoms, term, variation);
        applyVariationToCategory(dictionary.treatments, term, variation);
        applyVariationToCategory(dictionary.observations, term, variation);
    }
}

// 機関固有の用語バリエーションを適用
function applyInstitutionVariations(dictionary, variations) {
    if (!variations) return;
    
    // 各用語カテゴリーに機関バリエーションを適用
    for (const [term, variation] of Object.entries(variations)) {
        // 症状、治療、観察カテゴリーを検索
        applyVariationToCategory(dictionary.symptoms, term, variation);
        applyVariationToCategory(dictionary.treatments, term, variation);
        applyVariationToCategory(dictionary.observations, term, variation);
    }
}

// カテゴリー内の用語に変異を適用
function applyVariationToCategory(category, term, variation) {
    // 完全一致
    if (category[term]) {
        category[term].standard = variation;
        return;
    }
    
    // 部分一致
    for (const [key, value] of Object.entries(category)) {
        if (key.includes(term) || term.includes(key) || 
            value.standard.includes(term) || term.includes(value.standard)) {
            category[key].standard = variation;
            return;
        }
    }
}

// 地域間の用語ばらつきを視覚化するデータを準備
function prepareTerminologyVariationData() {
    const baseTerminology = nursingTerminologies.standard;
    const variationData = {
        labels: [],
        datasets: [{
            label: '標準用語との差異率 (%)',
            data: [],
            backgroundColor: 'rgba(28, 69, 135, 0.7)',
            borderColor: 'rgba(28, 69, 135, 1)',
            borderWidth: 1
        }]
    };
    
    // 地域ごとの差異率を計算
    regionDatabase.forEach(region => {
        // 各地域の用語辞書を作成（標準用語をクローンして地域差分を適用）
        const regionDict = JSON.parse(JSON.stringify(nursingTerminologies.standard));
        applyRegionalVariations(regionDict, region.name);
        
        // 標準用語との差異を計算
        const variation = calculateTerminologyVariation(baseTerminology, regionDict);
        
        variationData.labels.push(region.name);
        variationData.datasets[0].data.push(Math.round(variation.variationRate * 10) / 10);
    });
    
    return variationData;
}