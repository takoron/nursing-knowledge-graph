// Cytoscape.jsを使用したグラフ可視化
let cy = null;

// グラフ更新
function updateGraph() {
    const container = document.getElementById('graphContainer');
    
    // すでにグラフインスタンスがあれば破棄
    if (cy) {
        cy.destroy();
    }
    
    // Cytoscapeインスタンス作成
    cy = cytoscape({
        container: container,
        elements: convertToElements(),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': getNodeColor,
                    'label': 'data(label)',
                    'color': '#fff',
                    'text-outline-width': 2,
                    'text-outline-color': getNodeColor,
                    'font-size': '12px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'width': '60px',
                    'height': '60px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': getEdgeWidth,
                    'line-color': '#999',
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'target-arrow-color': '#999',
                    'label': 'data(type)',
                    'font-size': '10px',
                    'color': '#777',
                    'text-rotation': 'autorotate',
                    'text-margin-y': -10
                }
            },
            {
                selector: ':selected',
                style: {
                    'border-width': 3,
                    'border-color': '#333',
                    'line-color': '#333',
                    'target-arrow-color': '#333'
                }
            }
        ],
        layout: {
            name: 'cose',
            idealEdgeLength: 100,
            nodeOverlap: 20,
            refresh: 20,
            fit: true,
            padding: 30,
            randomize: false,
            componentSpacing: 100,
            nodeRepulsion: 400000,
            edgeElasticity: 100,
            nestingFactor: 5,
            gravity: 80,
            numIter: 1000,
            initialTemp: 200,
            coolingFactor: 0.95,
            minTemp: 1.0
        },
        wheelSensitivity: 0.3
    });
    
    // イベントリスナー
    cy.on('tap', 'node', function(evt){
        const node = evt.target;
        console.log('Tapped node:', node.id());
    });
    
    cy.on('tap', 'edge', function(evt){
        const edge = evt.target;
        console.log('Tapped edge:', edge.id());
    });
    
    // データベース更新
    updateGraphDatabase();
}

// データ変換: 内部データ形式からCytoscape形式へ
function convertToElements() {
    const elements = [];
    
    // ノード追加
    graphData.nodes.forEach(node => {
        elements.push({
            data: {
                id: node.id,
                label: node.label,
                type: node.type
            }
        });
    });
    
    // エッジ追加
    graphData.edges.forEach(edge => {
        elements.push({
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type,
                weight: edge.weight
            }
        });
    });
    
    return elements;
}

// ノードの色を取得（タイプに基づく）
function getNodeColor(ele) {
    const type = ele.data('type');
    
    switch(type) {
        case 'symptom':
            return '#e74c3c'; // 赤 - 症状
        case 'treatment':
            return '#3498db'; // 青 - 治療
        case 'medication':
            return '#2ecc71'; // 緑 - 薬剤
        case 'observation':
            return '#9b59b6'; // 紫 - 観察
        case 'patient':
            return '#f39c12'; // オレンジ - 患者情報
        default:
            return '#95a5a6'; // グレー - その他
    }
}

// エッジの太さを取得（重みに基づく）
function getEdgeWidth(ele) {
    const weight = ele.data('weight');
    // 重みは1〜10の範囲、線の太さは1〜5pxに変換
    return 1 + (weight / 10) * 4;
}

// 画像からノードとエッジを自動検出する機能
function detectFromImage(imageData) {
    console.log('画像解析開始...');
    
    // 実際の実装ではここで画像解析APIを呼び出すか
    // 機械学習モデルを使用して画像内のテキストや要素を認識する
    
    // 看護知識データベース（模擬）
    // 実際の実装では、これは外部データベースから取得する
    const nursingKnowledgeBase = {
        symptoms: [
            { label: '発熱', related: ['解熱剤投与', '水分補給', 'バイタルサイン測定'] },
            { label: '嘔吐', related: ['制吐剤投与', '水分補給', '食事指導'] },
            { label: '呼吸困難', related: ['酸素投与', '体位変換', '呼吸音聴取'] },
            { label: '頭痛', related: ['鎮痛剤投与', '環境調整', '神経学的観察'] },
            { label: '血圧上昇', related: ['降圧剤投与', '安静', '食事指導'] },
            { label: '下痢', related: ['整腸剤投与', '水分補給', '食事指導'] },
            { label: '倦怠感', related: ['休息', '活動調整', '栄養摂取'] },
            { label: '皮膚発赤', related: ['軟膏塗布', '体位変換', '清潔ケア'] }
        ],
        treatments: [
            { label: '解熱剤投与', type: 'medication' },
            { label: '酸素投与', type: 'treatment' },
            { label: '水分補給', type: 'treatment' },
            { label: '体位変換', type: 'treatment' },
            { label: '鎮痛剤投与', type: 'medication' },
            { label: '食事指導', type: 'observation' },
            { label: 'バイタルサイン測定', type: 'observation' },
            { label: '呼吸音聴取', type: 'observation' }
        ]
    };
    
    // 看護アセスメント例（患者A）- 画像から抽出したと仮定
    const patientData = {
        id: 'patient_A',
        label: '患者A（60歳男性）',
        type: 'patient',
        conditions: ['発熱', '呼吸困難', '頭痛']
    };
    
    // 抽出したデータからグラフを構築
    const detectedData = {
        nodes: [],
        edges: []
    };
    
    // 患者ノードを追加
    detectedData.nodes.push({
        id: patientData.id,
        label: patientData.label,
        type: 'patient'
    });
    
    // 症状ノードを追加
    patientData.conditions.forEach((condition, index) => {
        const nodeId = 'symptom_' + index;
        detectedData.nodes.push({
            id: nodeId,
            label: condition,
            type: 'symptom'
        });
        
        // 患者と症状の間にエッジを追加
        detectedData.edges.push({
            id: 'e_patient_' + index,
            source: patientData.id,
            target: nodeId,
            type: 'has',
            weight: 10
        });
        
        // 知識データベースから関連する治療や観察を検索
        const symptomInfo = nursingKnowledgeBase.symptoms.find(s => s.label === condition);
        if (symptomInfo) {
            symptomInfo.related.forEach((relatedItem, relIndex) => {
                // 関連する治療や観察項目を探す
                const treatment = nursingKnowledgeBase.treatments.find(t => t.label === relatedItem);
                if (treatment) {
                    // 既にノードが存在するかチェック
                    let treatmentNodeId = '';
                    const existingNode = detectedData.nodes.find(n => n.label === relatedItem);
                    
                    if (existingNode) {
                        treatmentNodeId = existingNode.id;
                    } else {
                        treatmentNodeId = 'treatment_' + index + '_' + relIndex;
                        detectedData.nodes.push({
                            id: treatmentNodeId,
                            label: relatedItem,
                            type: treatment.type || 'treatment'
                        });
                    }
                    
                    // エッジを追加（重み付けはランダム）
                    const relationTypes = ['treats', 'requires', 'improves', 'observes'];
                    const randomType = relationTypes[Math.floor(Math.random() * relationTypes.length)];
                    const randomWeight = Math.floor(Math.random() * 5) + 5; // 5-10の範囲
                    
                    // 症状と治療間のエッジを追加
                    detectedData.edges.push({
                        id: 'e_' + nodeId + '_' + treatmentNodeId,
                        source: nodeId,
                        target: treatmentNodeId,
                        type: randomType,
                        weight: randomWeight
                    });
                }
            });
        }
    });
    
    // 共通の治療法間の関連性を追加
    // 例：酸素投与と呼吸音聴取の関連付け
    const oxygenNode = detectedData.nodes.find(n => n.label === '酸素投与');
    const respiratoryNode = detectedData.nodes.find(n => n.label === '呼吸音聴取');
    
    if (oxygenNode && respiratoryNode) {
        detectedData.edges.push({
            id: 'e_related_1',
            source: oxygenNode.id,
            target: respiratoryNode.id,
            type: 'requires',
            weight: 9
        });
    }
    
    // より複雑な知識グラフのための追加関連性
    // 実際の実装では、これは看護知識ベースから導出される
    
    console.log('画像解析完了: ' + detectedData.nodes.length + 'ノードと' + 
                detectedData.edges.length + 'エッジを検出');
    
    return detectedData;
}

// グラフをJSONとしてエクスポート
function exportGraph() {
    return JSON.stringify(graphData, null, 2);
}

// JSONからグラフをインポート
function importGraph(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        if (data.nodes && data.edges) {
            graphData = data;
            updateGraph();
            return true;
        }
        return false;
    } catch (e) {
        console.error('グラフのインポートに失敗しました:', e);
        return false;
    }
}

// グラフデータを読み込み
function loadGraphData() {
    const savedData = localStorage.getItem('nursingGraphData');
    if (savedData) {
        try {
            return importGraph(savedData);
        } catch (e) {
            console.error('保存されたグラフデータの読み込みに失敗しました:', e);
            return false;
        }
    }
    return false;
}

// 用語の標準化を視覚的に表示
function highlightNonStandardTerms() {
    if (!cy) return;
    
    // 標準用語でないノードをハイライト
    graphData.nodes.forEach(node => {
        const cyNode = cy.$(`#${node.id}`);
        
        if (cyNode.length === 0) return;
        
        let isStandard = true;
        
        if (node.type === 'symptom') {
            const match = checkSymptomTerminology(node.label);
            isStandard = match && match.standard === node.label;
        } else if (node.type === 'treatment' || node.type === 'medication') {
            const match = checkTreatmentTerminology(node.label);
            isStandard = match && match.standard === node.label;
        } else if (node.type === 'observation') {
            const match = checkObservationTerminology(node.label);
            isStandard = match && match.standard === node.label;
        }
        
        if (!isStandard) {
            cyNode.style({
                'border-width': 3,
                'border-color': '#e74c3c',
                'border-style': 'dashed'
            });
        } else {
            cyNode.style({
                'border-width': 0
            });
        }
    });
}