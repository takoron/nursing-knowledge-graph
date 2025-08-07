// DOM要素
const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const userRole = document.getElementById('userRole');
const addNodeBtn = document.getElementById('addNode');
const addEdgeBtn = document.getElementById('addEdge');
const deleteSelectedBtn = document.getElementById('deleteSelected');
const nodeForm = document.querySelector('.node-form');
const edgeForm = document.querySelector('.edge-form');
const feedback = document.getElementById('feedback');

// 状態変数
let currentImage = null;
let selectedElements = [];
let graphData = {
    nodes: [],
    edges: []
};

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    
    // 標準用語データベースを読み込む
    loadNursingTerminology();
});

// DOM要素と状態変数
let currentSearchType = 'hospital'; // 現在の検索タイプ (hospital, school, region)

// 看護用語データベース
let nursingTerminologies = {};
let currentTerminology = "standard";

// 看護用語の読み込み
function loadNursingTerminology() {
    // 実際の実装では外部データベースやAPIから取得する
    // ここではサンプルデータを使用
    nursingTerminologies = {
        // 標準看護用語（全国共通）
        standard: {
            name: "標準看護用語",
            symptoms: {
                "発熱": { standard: "体温上昇", description: "体温の通常値からの上昇" },
                "頭痛": { standard: "頭部痛", description: "頭部の痛みを伴う不快感" },
                "熱": { standard: "体温上昇", description: "体温の通常値からの上昇" },
                "吐き気": { standard: "悪心", description: "嘔吐したいという感覚" },
                "むくみ": { standard: "浮腫", description: "組織内における体液の蓄積" },
                "息切れ": { standard: "呼吸困難", description: "呼吸に伴う不快感や困難" }
            },
            treatments: {
                "水分補給": { standard: "水分摂取", description: "体内の水分量を維持・増加させる行為" },
                "薬投与": { standard: "薬剤投与", description: "治療を目的とした薬剤の投与" },
                "姿勢変換": { standard: "体位変換", description: "身体の位置や向きを変更する行為" }
            },
            observations: {
                "血圧測定": { standard: "血圧モニタリング", description: "血圧値の測定と経過観察" },
                "体温チェック": { standard: "体温モニタリング", description: "体温の測定と経過観察" }
            }
        },
        
        // 看護学校用語
        school: {
            name: "看護学校用語",
            symptoms: {
                "発熱": { standard: "発熱", description: "体温の上昇によって生じる症状" },
                "頭痛": { standard: "頭痛", description: "頭部に感じる痛み" },
                "胸痛": { standard: "胸部痛", description: "胸部に感じる痛み" },
                "腹痛": { standard: "腹部痛", description: "腹部に感じる痛み" },
                "嘔気": { standard: "嘔気", description: "吐き気" }
            },
            treatments: {
                "包帯法": { standard: "創傷被覆", description: "包帯による創傷の保護" },
                "清拭": { standard: "清拭", description: "体を拭いて清潔を保つケア" },
                "体位変換": { standard: "体位変換", description: "患者の体位を変える援助" },
                "点滴管理": { standard: "輸液管理", description: "点滴による水分・電解質・薬剤の投与管理" }
            },
            observations: {
                "バイタル測定": { standard: "バイタルサイン測定", description: "生体徴候の測定" },
                "食事摂取状況": { standard: "摂食状況観察", description: "患者の食事摂取量や様子の観察" }
            }
        },
        
        // 病院用語
        hospital: {
            name: "病院用語",
            symptoms: {
                "37.5以上": { standard: "微熱", description: "37.5度以上38度未満の体温上昇" },
                "38度以上": { standard: "発熱", description: "38度以上の体温上昇" },
                "喀痰あり": { standard: "喀痰", description: "気道から排出される分泌物" },
                "BP上昇": { standard: "血圧上昇", description: "血圧値の通常範囲からの上昇" },
                "SPO2低下": { standard: "酸素飽和度低下", description: "血中酸素飽和度の低下" }
            },
            treatments: {
                "O2投与": { standard: "酸素投与", description: "酸素の補充投与" },
                "DIV": { standard: "静脈内投与", description: "静脈内に薬剤や輸液を投与" },
                "OP後管理": { standard: "術後管理", description: "手術後の患者ケア" },
                "アセス": { standard: "アセスメント", description: "患者の状態に関する情報収集と分析" }
            },
            observations: {
                "モニタリング": { standard: "生体情報モニタリング", description: "生体情報の継続的な監視" },
                "採血結果確認": { standard: "検査結果評価", description: "血液検査結果の確認と評価" }
            }
        },
        
        // 地域用語
        region: {
            name: "地域用語",
            symptoms: {
                "熱っぽい": { standard: "発熱感", description: "体が熱いと感じる自覚症状" },
                "こわばり": { standard: "筋強直", description: "筋肉が硬くなる状態" },
                "息苦しさ": { standard: "呼吸困難感", description: "呼吸に関する不快感や困難さ" },
                "食欲不振": { standard: "食思不振", description: "食べたいと思う気持ちの減退" }
            },
            treatments: {
                "服薬管理": { standard: "服薬管理", description: "適切な服薬を確実に行うための支援" },
                "入浴介助": { standard: "入浴援助", description: "入浴時の介助" },
                "日常生活指導": { standard: "生活指導", description: "健康増進のための日常生活に関する指導" }
            },
            observations: {
                "生活状況": { standard: "生活状況評価", description: "日常生活の状態や自立度の評価" },
                "家族支援": { standard: "家族支援状況", description: "家族による支援状況の観察と評価" }
            }
        }
    };
    
    // ドロップダウンからの選択を監視
    document.getElementById('terminologySource').addEventListener('change', function() {
        currentTerminology = this.value;
        console.log(`用語辞書を「${nursingTerminologies[currentTerminology].name}」に変更しました`);
        
        // 用語変更時に現在のグラフに対してチェック実行
        if (graphData.nodes.length > 0) {
            const suggestions = findTerminologySuggestions();
            if (suggestions.length > 0) {
                // 提案があれば表示
                displayTerminologySuggestions(suggestions);
            }
        }
    });
    
    console.log("看護用語データベース読み込み完了");
}

// 機関検索モーダルを開く
function openInstitutionSearchModal() {
    document.getElementById('institutionSearchModal').classList.remove('hidden');
    setActiveSearchTab(document.getElementById('hospitalTabBtn'), 'hospital');
    document.getElementById('institutionSearchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
}

// アクティブな検索タブを設定
function setActiveSearchTab(tabBtn, type) {
    // すべてのタブからアクティブクラスを削除
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // 選択したタブをアクティブに
    tabBtn.classList.add('active');
    currentSearchType = type;
    
    // 検索プレースホルダーを更新
    const searchInput = document.getElementById('institutionSearchInput');
    switch(type) {
        case 'hospital':
            searchInput.placeholder = '病院名で検索...';
            break;
        case 'school':
            searchInput.placeholder = '看護学校名で検索...';
            break;
        case 'region':
            searchInput.placeholder = '地域名で検索...';
            break;
    }
}

// 機関検索を実行
function performInstitutionSearch() {
    const searchTerm = document.getElementById('institutionSearchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '<div class="no-results">検索語は2文字以上入力してください</div>';
        return;
    }
    
    let results = [];
    
    // 検索タイプに基づいて検索
    switch(currentSearchType) {
        case 'hospital':
            results = hospitalDatabase.filter(h => 
                h.name.toLowerCase().includes(searchTerm) || 
                h.address.toLowerCase().includes(searchTerm)
            );
            break;
        case 'school':
            results = nursingSchoolDatabase.filter(s => 
                s.name.toLowerCase().includes(searchTerm) || 
                s.address.toLowerCase().includes(searchTerm)
            );
            break;
        case 'region':
            results = regionDatabase.filter(r => 
                r.name.toLowerCase().includes(searchTerm)
            );
            break;
    }
    
    // 結果を表示
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">該当する結果はありませんでした</div>';
    } else {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            if (currentSearchType === 'hospital') {
                resultItem.innerHTML = `
                    <div class="result-name">${result.name}</div>
                    <div class="result-address">${result.address} (${result.type})</div>
                `;
            } else if (currentSearchType === 'school') {
                resultItem.innerHTML = `
                    <div class="result-name">${result.name}</div>
                    <div class="result-address">${result.address}</div>
                `;
            } else if (currentSearchType === 'region') {
                resultItem.innerHTML = `
                    <div class="result-name">${result.name}</div>
                    <div class="result-address">人口: ${result.population} / 病院数: ${result.hospitals}</div>
                `;
            }
            
            // 結果をクリックしたときの処理
            resultItem.addEventListener('click', function() {
                selectInstitution(result, currentSearchType);
                document.getElementById('institutionSearchModal').classList.add('hidden');
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }
}

// 機関を選択
function selectInstitution(institution, type) {
    selectedInstitution = institution;
    selectedInstitutionType = type;
    
    // 表示を更新
    document.getElementById('selectedInstitution').textContent = institution.name;
    
    // 選択した機関に基づいて用語を更新
    updateTerminologyBasedOnSelection();
    
    // 用語ばらつきをチェック
    checkTerminology();
    
    generateFeedback('INSTITUTION_CHANGE');
}

// 用語のばらつきを視覚化
function visualizeTerminologyVariation() {
    const modal = document.getElementById('terminologyCompareModal');
    modal.classList.remove('hidden');
    
    const compareBase = document.getElementById('compareBaseSelect').value;
    const chartContainer = document.getElementById('comparisonChart');
    
    // 既存のチャートを破棄
    while (chartContainer.firstChild) {
        chartContainer.removeChild(chartContainer.firstChild);
    }
    
    // キャンバスを作成
    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);
    
    // データ準備
    const variationData = prepareTerminologyVariationData();
    
    // グラフを作成
    new Chart(canvas, {
        type: 'bar',
        data: variationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '標準との差異率 (%)'
                    },
                    max: 100
                },
                x: {
                    title: {
                        display: true,
                        text: '地域'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '自治体ごとの看護用語ばらつき'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `差異率: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    // 凡例を追加
    const legend = document.getElementById('comparisonLegend');
    legend.innerHTML = `
        <div class="legend-title">地域ごとの用語ばらつき統計:</div>
        <div class="legend-items">
            <div class="legend-item">
                <span class="legend-color" style="background-color:rgba(28, 69, 135, 0.7)"></span>
                <span>差異率が高いほど標準用語と異なる表現が多いことを示します</span>
            </div>
        </div>
    `;
}

// イベントリスナー設定
function initEventListeners() {
    // 画像アップロード
    imageUpload.addEventListener('change', handleImageUpload);
    
    // ノード追加
    addNodeBtn.addEventListener('click', () => {
        nodeForm.classList.remove('hidden');
        edgeForm.classList.add('hidden');
    });
    
    // エッジ追加
    addEdgeBtn.addEventListener('click', () => {
        if (graphData.nodes.length < 2) {
            alert('エッジを作成するには少なくとも2つのノードが必要です。');
            return;
        }
        
        edgeForm.classList.remove('hidden');
        nodeForm.classList.add('hidden');
        
        // ノードリストを更新
        updateNodeSelects();
    });
    
    // 選択削除
    deleteSelectedBtn.addEventListener('click', deleteSelected);
    
    // ノードフォーム操作
    document.getElementById('saveNode').addEventListener('click', saveNode);
    document.getElementById('cancelNode').addEventListener('click', () => {
        nodeForm.classList.add('hidden');
    });
    
    // エッジフォーム操作
    document.getElementById('saveEdge').addEventListener('click', saveEdge);
    document.getElementById('cancelEdge').addEventListener('click', () => {
        edgeForm.classList.add('hidden');
    });
    
    // 重みスライダー
    document.getElementById('edgeWeight').addEventListener('input', function() {
        document.getElementById('weightValue').textContent = this.value;
    });
    
    // ユーザーロール変更
    userRole.addEventListener('change', () => {
        generateFeedback();
    });
    
    // グラフ保存
    document.getElementById('saveGraph').addEventListener('click', saveGraphData);
    
    // グラフエクスポート
    document.getElementById('exportGraph').addEventListener('click', exportGraphData);
    
    // 用語チェック
    document.getElementById('checkTerminology').addEventListener('click', checkTerminology);
    
    // 全ての提案を適用
    document.getElementById('applyAllSuggestions').addEventListener('click', applyAllTerminologySuggestions);
    
    // 用語セクションを閉じる
    document.getElementById('closeTerminology').addEventListener('click', () => {
        document.getElementById('terminologySection').classList.add('hidden');
    });
    
    // 用語フィルタボタン
    document.getElementById('switchToStandard').addEventListener('click', function() {
        switchTerminology('standard');
        highlightActiveButton(this);
    });
    
    document.getElementById('switchToSchool').addEventListener('click', function() {
        switchTerminology('school');
        highlightActiveButton(this);
    });
    
    document.getElementById('switchToHospital').addEventListener('click', function() {
        switchTerminology('hospital');
        highlightActiveButton(this);
    });
    
    document.getElementById('switchToRegion').addEventListener('click', function() {
        switchTerminology('region');
        highlightActiveButton(this);
    });
    
    // 機関選択ボタン
    document.getElementById('institutionSelectBtn').addEventListener('click', openInstitutionSearchModal);
    
    // 機関検索モーダル関連
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // 検索タブボタン
    document.getElementById('hospitalTabBtn').addEventListener('click', function() {
        setActiveSearchTab(this, 'hospital');
    });
    
    document.getElementById('schoolTabBtn').addEventListener('click', function() {
        setActiveSearchTab(this, 'school');
    });
    
    document.getElementById('regionTabBtn').addEventListener('click', function() {
        setActiveSearchTab(this, 'region');
    });
    
    // 検索ボタン
    document.getElementById('searchBtn').addEventListener('click', performInstitutionSearch);
    
    // 比較ボタン
    document.getElementById('compareBtn').addEventListener('click', visualizeTerminologyVariation);
}

// 画像アップロード処理
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        currentImage = event.target.result;
        displayImage(currentImage);
        resetGraph();
        
        // 画像解析して自動でノードとエッジを抽出
        const detectedData = detectFromImage(currentImage);
        if (detectedData) {
            graphData = detectedData;
            updateGraph();
            
            // 自動解析用のフィードバック
            generateFeedback('AUTO_DETECT');
        } else {
            generateFeedback('IMAGE_UPLOAD');
        }
    };
    reader.readAsDataURL(file);
}

// 画像表示
function displayImage(src) {
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = src;
    preview.appendChild(img);
}

// ノードセレクトボックス更新
function updateNodeSelects() {
    const sourceSelect = document.getElementById('edgeSource');
    const targetSelect = document.getElementById('edgeTarget');
    
    // リセット
    sourceSelect.innerHTML = '';
    targetSelect.innerHTML = '';
    
    // ノードを追加
    graphData.nodes.forEach(node => {
        const sourceOption = document.createElement('option');
        sourceOption.value = node.id;
        sourceOption.textContent = node.label;
        
        const targetOption = document.createElement('option');
        targetOption.value = node.id;
        targetOption.textContent = node.label;
        
        sourceSelect.appendChild(sourceOption);
        targetSelect.appendChild(targetOption);
    });
}

// ノード保存
function saveNode() {
    const label = document.getElementById('nodeLabel').value.trim();
    const type = document.getElementById('nodeType').value;
    
    if (!label) {
        alert('ノードのラベルを入力してください。');
        return;
    }
    
    const nodeId = 'n' + Date.now();
    const newNode = {
        id: nodeId,
        label: label,
        type: type
    };
    
    graphData.nodes.push(newNode);
    updateGraph();
    nodeForm.classList.add('hidden');
    document.getElementById('nodeLabel').value = '';
    
    generateFeedback('NODE_ADD');
}

// エッジ保存
function saveEdge() {
    const source = document.getElementById('edgeSource').value;
    const target = document.getElementById('edgeTarget').value;
    const type = document.getElementById('edgeType').value;
    const weight = parseInt(document.getElementById('edgeWeight').value);
    
    if (source === target) {
        alert('始点と終点に同じノードは選択できません。');
        return;
    }
    
    // 重複チェック
    const isDuplicate = graphData.edges.some(edge => 
        edge.source === source && edge.target === target
    );
    
    if (isDuplicate) {
        alert('同じノード間に複数のエッジは追加できません。');
        return;
    }
    
    const edgeId = 'e' + Date.now();
    const newEdge = {
        id: edgeId,
        source: source,
        target: target,
        type: type,
        weight: weight
    };
    
    graphData.edges.push(newEdge);
    updateGraph();
    edgeForm.classList.add('hidden');
    
    generateFeedback('EDGE_ADD');
}

// 選択要素削除
function deleteSelected() {
    if (!cy) return;
    
    const selectedNodes = cy.$('node:selected');
    const selectedEdges = cy.$('edge:selected');
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
        alert('削除する要素を選択してください。');
        return;
    }
    
    // ノード削除（関連するエッジも削除）
    selectedNodes.forEach(node => {
        const nodeId = node.id();
        
        // グラフデータからノードを削除
        graphData.nodes = graphData.nodes.filter(n => n.id !== nodeId);
        
        // 関連するエッジを削除
        graphData.edges = graphData.edges.filter(e => 
            e.source !== nodeId && e.target !== nodeId
        );
    });
    
    // エッジ削除
    selectedEdges.forEach(edge => {
        const edgeId = edge.id();
        graphData.edges = graphData.edges.filter(e => e.id !== edgeId);
    });
    
    updateGraph();
    generateFeedback('DELETE');
}

// フィードバック生成
function generateFeedback(action = null) {
    const role = userRole.value;
    const isStudent = role === 'student';
    
    if (graphData.nodes.length === 0) {
        feedback.innerHTML = '<p class="empty-feedback">グラフを編集するとフィードバックが表示されます。</p>';
        return;
    }
    
    let messages = [];
    
    // アクションに基づくフィードバック
    if (action === 'AUTO_DETECT') {
        messages.push(isStudent ? 
            '画像を分析して自動的にノードとエッジを抽出しました。これらの要素は適切ですか？必要に応じて編集してみましょう。' : 
            '画像から患者データを自動抽出しました。抽出された情報を確認し、臨床的知見に基づいて調整してください。');
        
        // ノード数に応じたアドバイス
        if (graphData.nodes.length > 4) {
            messages.push(isStudent ?
                '多くの要素が検出されました。それぞれの関連性を確認し、優先度の高いものに注目しましょう。' :
                '複数の要素が抽出されました。優先して介入すべき要素を特定し、ケアの焦点を明確にしてください。');
        }
    } else if (action === 'IMAGE_UPLOAD') {
        messages.push(isStudent ? 
            '素晴らしい、画像をアップロードしましたね。次はこの画像から観察できる要素をノードとして追加してみましょう。' :
            '画像を確認しました。この患者さんの状態を正確にグラフ化していきましょう。');
    } else if (action === 'NODE_ADD') {
        const latestNode = graphData.nodes[graphData.nodes.length - 1];
        
        if (latestNode.type === 'symptom') {
            messages.push(isStudent ? 
                `${latestNode.label}という症状を追加しましたね。この症状の原因や関連する治療法についても考えてみましょう。` :
                `${latestNode.label}を追加されました。この症状に関連する観察ポイントも追加するとよいでしょう。`);
        } else if (latestNode.type === 'treatment') {
            messages.push(isStudent ? 
                `治療法「${latestNode.label}」を追加しました。この治療がどの症状に対して効果があるか関連付けてみましょう。` :
                `${latestNode.label}を治療として記録しました。この治療の評価指標も考慮されるとより良いでしょう。`);
        }
    } else if (action === 'EDGE_ADD') {
        messages.push(isStudent ? 
            '関係性を追加しました。この関係の強さは適切ですか？症状と治療の関係を考える際は、エビデンスに基づいた判断が大切です。' :
            '関係性を設定されました。この関連付けは臨床での経験に基づいていますか？他に考慮すべき要素はないでしょうか。');
    } else if (action === 'DELETE') {
        messages.push(isStudent ? 
            '要素を削除しました。アセスメントを見直すことも学習の大切な過程です。' :
            '要素を削除されました。看護計画を再構築することで、より適切なケアにつながることもあります。');
    } else if (action === 'SAVE') {
        messages.push(isStudent ? 
            'グラフデータを保存しました。あなたの学習の成果が記録されています。' :
            'グラフデータが保存されました。看護知識の蓄積に貢献いただきありがとうございます。');
    } else if (action === 'TERMINOLOGY_UPDATE') {
        messages.push(isStudent ? 
            '看護用語を標準化しました。正確な専門用語を使用することは、看護師として重要なスキルです。' :
            '用語を標準化していただきありがとうございます。統一された専門用語の使用は、看護記録の質を向上させます。');
    } else if (action === 'TERMINOLOGY_UPDATE_ALL') {
        messages.push(isStudent ? 
            '全ての用語を標準化しました。これにより、あなたの看護記録は他の医療従事者に正確に伝わりやすくなります。' :
            '全ての用語を標準化していただきありがとうございます。統一された用語体系は看護の科学的基盤を強化します。');
    } else if (action === 'INSTITUTION_CHANGE') {
        if (selectedInstitution) {
            if (selectedInstitutionType === 'hospital') {
                messages.push(isStudent ? 
                    `${selectedInstitution.name}の用語辞書を適用しました。実際の臨床現場で使用されている用語を学ぶことは重要です。` :
                    `${selectedInstitution.name}の用語辞書を適用しました。所属施設の共通言語を使用することで、チーム内の伝達が円滑になります。`);
            } else if (selectedInstitutionType === 'school') {
                messages.push(isStudent ? 
                    `${selectedInstitution.name}の用語辞書を適用しました。教育機関の標準に沿った用語を学びましょう。` :
                    `${selectedInstitution.name}の用語辞書を適用しました。教育的観点からの用語体系を参考にしてください。`);
            } else if (selectedInstitutionType === 'region') {
                messages.push(isStudent ? 
                    `${selectedInstitution.name}の用語辞書を適用しました。地域特有の表現を理解することは、地域医療で重要です。` :
                    `${selectedInstitution.name}の用語辞書を適用しました。地域のケア提供においては、地域特有の用語理解が重要です。`);
            }
        }
    }
    
    // グラフ構造に基づくフィードバック
    if (graphData.nodes.length > 0 && graphData.edges.length === 0) {
        messages.push(isStudent ? 
            'ノードを追加できていますね。次はノード間の関係性（エッジ）を追加してみましょう。関係性を示すことで看護アセスメントが明確になります。' :
            'いくつかの要素を特定されました。これらの要素間の関連性を追加することで、より包括的な看護計画が立案できるでしょう。');
    }
    
    if (graphData.nodes.length >= 5 && graphData.edges.length >= 3) {
        const hasPatientNode = graphData.nodes.some(node => node.type === 'patient');
        
        if (!hasPatientNode) {
            messages.push(isStudent ? 
                '看護では患者さん自身の情報（年齢、性別、既往歴など）も重要な要素です。患者情報のノードも追加してみましょう。' :
                '患者さんの基本情報を追加すると、より個別性のあるアセスメントになります。患者中心のケアを意識しましょう。');
        }
    }
    
    // ナイチンゲール風のアドバイス
    const nightingaleAdvice = [
        '看護とは、新鮮な空気、陽光、暖かさ、清潔さ、静けさを適切に整え、それらを活かして用いること。そして食事の適切な選択と管理により、生命力の消耗を最小にすることである。',
        '観察なくして看護はありません。データを集め、分析することで真の看護が始まるのです。',
        '第一に、患者に害を与えないこと。看護は常に患者の立場に立って考えるべきです。',
        '看護師は患者の体だけでなく心も癒す存在です。全人的なケアを心がけましょう。',
        '統計は物事を理解するための重要な手段です。あなたのグラフ化する努力は看護の発展に貢献しています。'
    ];
    
    if (Math.random() < 0.3) {
        // 30%の確率でナイチンゲール名言を追加
        messages.push(`<strong>ナイチンゲールの言葉：</strong> "${nightingaleAdvice[Math.floor(Math.random() * nightingaleAdvice.length)]}"`);
    }
    
    // フィードバック表示
    if (messages.length > 0) {
        feedback.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('');
    } else {
        feedback.innerHTML = '<p>グラフの分析を続けています。さらに要素を追加すると、より具体的なフィードバックができます。</p>';
    }
}

// グラフをリセット
function resetGraph() {
    graphData = {
        nodes: [],
        edges: []
    };
    updateGraph();
}

// グラフデータを保存
function saveGraphData() {
    // ローカルストレージに保存
    localStorage.setItem('nursingGraphData', JSON.stringify(graphData));
    alert('グラフデータが保存されました。');
    generateFeedback('SAVE');
}

// グラフデータをエクスポート
function exportGraphData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(graphData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "nursing_knowledge_graph.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// 用語のチェック
function checkTerminology() {
    const suggestions = findTerminologySuggestions();
    
    // 提案を表示（提案がない場合でもセクションを表示）
    displayTerminologySuggestions(suggestions);
    
    // 初期状態で標準用語ボタンをアクティブに
    highlightActiveButton(document.getElementById('switchToStandard'));
}

// 用語辞書の切り替え
function switchTerminology(terminologyType) {
    currentTerminology = terminologyType;
    
    // セレクトボックスの値も更新
    document.getElementById('terminologySource').value = terminologyType;
    
    // 新しい用語辞書に基づいて提案を更新
    const suggestions = findTerminologySuggestions();
    displayTerminologySuggestions(suggestions);
    
    console.log(`用語辞書を「${nursingTerminologies[currentTerminology].name}」に変更しました`);
}

// アクティブなボタンをハイライト
function highlightActiveButton(activeButton) {
    // すべてのボタンからアクティブクラスを削除
    const buttons = document.querySelectorAll('.terminology-filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // 選択されたボタンにアクティブクラスを追加
    activeButton.classList.add('active');
}

// 標準用語との差異を検出
function findTerminologySuggestions() {
    const suggestions = [];
    
    // ノードの用語をチェック
    graphData.nodes.forEach(node => {
        if (node.type === 'symptom') {
            const match = checkSymptomTerminology(node.label);
            if (match && match.standard !== node.label) {
                suggestions.push({
                    nodeId: node.id,
                    originalTerm: node.label,
                    suggestedTerm: match.standard,
                    description: match.description,
                    type: 'symptom'
                });
            }
        } else if (node.type === 'treatment' || node.type === 'medication') {
            const match = checkTreatmentTerminology(node.label);
            if (match && match.standard !== node.label) {
                suggestions.push({
                    nodeId: node.id,
                    originalTerm: node.label,
                    suggestedTerm: match.standard,
                    description: match.description,
                    type: 'treatment'
                });
            }
        } else if (node.type === 'observation') {
            const match = checkObservationTerminology(node.label);
            if (match && match.standard !== node.label) {
                suggestions.push({
                    nodeId: node.id,
                    originalTerm: node.label,
                    suggestedTerm: match.standard,
                    description: match.description,
                    type: 'observation'
                });
            }
        }
    });
    
    return suggestions;
}

// 症状用語のチェック
function checkSymptomTerminology(term) {
    const terminology = nursingTerminologies[currentTerminology];
    
    // 完全一致
    if (terminology.symptoms[term]) {
        return terminology.symptoms[term];
    }
    
    // 部分一致
    for (const [key, value] of Object.entries(terminology.symptoms)) {
        if (term.includes(key) || key.includes(term)) {
            return value;
        }
    }
    
    // 現在の用語集に見つからなかった場合、標準用語でも検索
    if (currentTerminology !== 'standard') {
        const standardTerminology = nursingTerminologies['standard'];
        if (standardTerminology.symptoms[term]) {
            return standardTerminology.symptoms[term];
        }
        
        for (const [key, value] of Object.entries(standardTerminology.symptoms)) {
            if (term.includes(key) || key.includes(term)) {
                return value;
            }
        }
    }
    
    return null;
}

// 治療用語のチェック
function checkTreatmentTerminology(term) {
    const terminology = nursingTerminologies[currentTerminology];
    
    // 完全一致
    if (terminology.treatments[term]) {
        return terminology.treatments[term];
    }
    
    // 部分一致
    for (const [key, value] of Object.entries(terminology.treatments)) {
        if (term.includes(key) || key.includes(term)) {
            return value;
        }
    }
    
    // 現在の用語集に見つからなかった場合、標準用語でも検索
    if (currentTerminology !== 'standard') {
        const standardTerminology = nursingTerminologies['standard'];
        if (standardTerminology.treatments[term]) {
            return standardTerminology.treatments[term];
        }
        
        for (const [key, value] of Object.entries(standardTerminology.treatments)) {
            if (term.includes(key) || key.includes(term)) {
                return value;
            }
        }
    }
    
    return null;
}

// 観察用語のチェック
function checkObservationTerminology(term) {
    const terminology = nursingTerminologies[currentTerminology];
    
    // 完全一致
    if (terminology.observations[term]) {
        return terminology.observations[term];
    }
    
    // 部分一致
    for (const [key, value] of Object.entries(terminology.observations)) {
        if (term.includes(key) || key.includes(term)) {
            return value;
        }
    }
    
    // 現在の用語集に見つからなかった場合、標準用語でも検索
    if (currentTerminology !== 'standard') {
        const standardTerminology = nursingTerminologies['standard'];
        if (standardTerminology.observations[term]) {
            return standardTerminology.observations[term];
        }
        
        for (const [key, value] of Object.entries(standardTerminology.observations)) {
            if (term.includes(key) || key.includes(term)) {
                return value;
            }
        }
    }
    
    return null;
}

// 用語提案を表示
function displayTerminologySuggestions(suggestions) {
    const container = document.getElementById('terminologySuggestions');
    container.innerHTML = '';
    
    // 辞書情報を表示
    const dictionaryInfo = document.createElement('div');
    dictionaryInfo.className = 'dictionary-info';
    dictionaryInfo.innerHTML = `
        <p class="dictionary-name">現在の用語辞書: <strong>${nursingTerminologies[currentTerminology].name}</strong></p>
    `;
    container.appendChild(dictionaryInfo);
    
    if (suggestions.length === 0) {
        const noSuggestions = document.createElement('div');
        noSuggestions.className = 'no-suggestions';
        noSuggestions.innerHTML = '<p>この辞書において修正が必要な用語はありません。</p>';
        container.appendChild(noSuggestions);
    } else {
        suggestions.forEach((suggestion, index) => {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'term-suggestion';
            suggestionEl.innerHTML = `
                <div class="term-suggestion-header">
                    <span class="term-original">${suggestion.originalTerm}</span>
                    <span class="term-suggestion-arrow">→</span>
                    <span class="term-suggested">${suggestion.suggestedTerm}</span>
                </div>
                <div class="term-suggestion-description">
                    <p>${suggestion.description}</p>
                    <p class="term-source">${nursingTerminologies[currentTerminology].name}の標準用語</p>
                </div>
                <div class="term-suggestion-action">
                    <button class="apply-suggestion" data-index="${index}">この提案を適用</button>
                </div>
            `;
            
            container.appendChild(suggestionEl);
            
            // 提案を適用するイベントリスナー
            suggestionEl.querySelector('.apply-suggestion').addEventListener('click', function() {
                applyTerminologySuggestion(suggestion);
                this.disabled = true;
                this.textContent = '適用済み';
            });
        });
    }
    
    document.getElementById('terminologySection').classList.remove('hidden');
}

// 1つの用語提案を適用
function applyTerminologySuggestion(suggestion) {
    // ノードのラベルを更新
    const node = graphData.nodes.find(n => n.id === suggestion.nodeId);
    if (node) {
        node.label = suggestion.suggestedTerm;
        
        // グラフを更新
        updateGraph();
        generateFeedback('TERMINOLOGY_UPDATE');
        
        // ノードリストを更新（エッジ用）
        updateNodeSelects();
    }
}

// すべての用語提案を適用
function applyAllTerminologySuggestions() {
    const suggestions = findTerminologySuggestions();
    
    if (suggestions.length === 0) {
        return;
    }
    
    // すべての提案を適用
    suggestions.forEach(suggestion => {
        applyTerminologySuggestion(suggestion);
    });
    
    // 提案セクションを閉じる
    document.getElementById('terminologySection').classList.add('hidden');
    
    // フィードバック更新
    generateFeedback('TERMINOLOGY_UPDATE_ALL');
}

// データベースへの変更を模倣
function updateGraphDatabase() {
    console.log('グラフデータベース更新:', graphData);
    // 実際のデータベース更新はここに実装
    
    // 保存されていない変更がある場合の通知
    document.getElementById('saveGraph').style.backgroundColor = '#e74c3c';
    setTimeout(() => {
        document.getElementById('saveGraph').style.backgroundColor = '';
    }, 2000);
}