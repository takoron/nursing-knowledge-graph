// 体のマッピング処理用スクリプト

// 状態変数
let selectedBodyPart = null;
let bodyMappings = {};
let treatmentsDatabase = [];
let currentMappingId = null;

// DOM要素取得
const bodyMap = document.getElementById('bodyMap');
const mappingForm = document.getElementById('mappingForm');
const selectedBodyPartText = document.getElementById('selectedBodyPart').querySelector('span');
const treatmentSelect = document.getElementById('treatmentSelect');
const treatmentNote = document.getElementById('treatmentNote');
const applyMappingBtn = document.getElementById('applyMapping');
const cancelMappingBtn = document.getElementById('cancelMapping');
const removeMappingBtn = document.getElementById('removeMappingBtn');
const treatmentList = document.getElementById('treatmentList');
const mappedItems = document.getElementById('mappedItems');
const importFromGraphBtn = document.getElementById('importFromGraph');
const importModal = document.getElementById('importModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const importTreatmentList = document.getElementById('importTreatmentList');
const importSelectedBtn = document.getElementById('importSelected');
const addNewTreatmentBtn = document.getElementById('addNewTreatment');
const newTreatmentForm = document.getElementById('newTreatmentForm');
const newTreatmentName = document.getElementById('newTreatmentName');
const newTreatmentType = document.getElementById('newTreatmentType');
const newTreatmentDesc = document.getElementById('newTreatmentDesc');
const saveMappingBtn = document.getElementById('saveMapping');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initBodyMapEvents();
    loadTreatmentsDatabase();
    loadSavedMappings();
    initFormEvents();
});

// 体のマップイベントを初期化
function initBodyMapEvents() {
    // 体の各部位にクリックイベントを設定
    const bodyParts = bodyMap.querySelectorAll('ellipse, rect, path');
    bodyParts.forEach(part => {
        part.addEventListener('click', function() {
            selectBodyPart(this);
        });
    });
}

// フォームイベントを初期化
function initFormEvents() {
    // 適用ボタン
    applyMappingBtn.addEventListener('click', function() {
        applyMapping();
    });
    
    // キャンセルボタン
    cancelMappingBtn.addEventListener('click', function() {
        cancelMapping();
    });
    
    // 削除ボタン
    removeMappingBtn.addEventListener('click', function() {
        removeMapping();
    });
    
    // 知識グラフからインポートボタン
    importFromGraphBtn.addEventListener('click', function() {
        openImportModal();
    });
    
    // モーダルを閉じるボタン
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });
    
    // インポート選択ボタン
    importSelectedBtn.addEventListener('click', function() {
        importSelectedTreatments();
    });
    
    // 新規処置追加ボタン
    addNewTreatmentBtn.addEventListener('click', function() {
        toggleNewTreatmentForm();
    });
    
    // マッピング保存ボタン
    saveMappingBtn.addEventListener('click', function() {
        saveAllMappings();
    });
}

// 体の部位を選択
function selectBodyPart(part) {
    // 既に選択されている部位の選択を解除
    const selectedParts = bodyMap.querySelectorAll('.selected');
    selectedParts.forEach(selected => {
        selected.classList.remove('selected');
    });
    
    // 新しい部位を選択状態に
    part.classList.add('selected');
    selectedBodyPart = part.id;
    selectedBodyPartText.textContent = part.getAttribute('data-name');
    
    // マッピングフォームを表示
    mappingForm.classList.remove('hidden');
    
    // 既存のマッピングがあるか確認
    const existingMapping = getExistingMapping(selectedBodyPart);
    if (existingMapping) {
        // 既存のマッピングデータを表示
        currentMappingId = existingMapping.id;
        treatmentSelect.value = existingMapping.treatmentId;
        treatmentNote.value = existingMapping.note || '';
        removeMappingBtn.classList.remove('hidden');
    } else {
        // 新規マッピング
        currentMappingId = null;
        treatmentSelect.value = '';
        treatmentNote.value = '';
        removeMappingBtn.classList.add('hidden');
    }
}

// 処置データベースを読み込み
function loadTreatmentsDatabase() {
    // サンプルデータ (実際にはローカルストレージや知識グラフから取得)
    treatmentsDatabase = [
        { id: 't1', name: '点滴', type: 'treatment', description: '静脈内に液体を注入する処置' },
        { id: 't2', name: '包帯交換', type: 'treatment', description: '傷口の包帯を新しいものに交換する処置' },
        { id: 't3', name: '消毒', type: 'treatment', description: '傷口や皮膚の消毒を行う処置' },
        { id: 't4', name: '血圧測定', type: 'observation', description: '血圧を測定する観察' },
        { id: 't5', name: '体温測定', type: 'observation', description: '体温を測定する観察' },
        { id: 't6', name: '解熱剤', type: 'medication', description: '発熱を抑える薬剤' },
        { id: 't7', name: '鎮痛剤', type: 'medication', description: '痛みを緩和する薬剤' }
    ];
    
    // セレクトボックスに処置オプションを追加
    treatmentSelect.innerHTML = '<option value="">処置を選択...</option>';
    treatmentsDatabase.forEach(treatment => {
        const option = document.createElement('option');
        option.value = treatment.id;
        option.textContent = `${treatment.name} (${getTypeLabel(treatment.type)})`;
        treatmentSelect.appendChild(option);
    });
}

// 種類のラベルを取得
function getTypeLabel(type) {
    switch(type) {
        case 'treatment': return '治療';
        case 'medication': return '薬剤';
        case 'observation': return '観察';
        default: return '不明';
    }
}

// 種類のスタイルクラスを取得
function getTypeClass(type) {
    switch(type) {
        case 'treatment': return 'type-treatment';
        case 'medication': return 'type-medication';
        case 'observation': return 'type-observation';
        default: return '';
    }
}

// 保存されたマッピングを読み込む
function loadSavedMappings() {
    // ローカルストレージから読み込み（実際の実装）
    const savedMappings = localStorage.getItem('bodyMappings');
    if (savedMappings) {
        bodyMappings = JSON.parse(savedMappings);
        
        // マッピングを画面に表示
        renderAllMappings();
    } else {
        // サンプルデータ（初回表示用）
        bodyMappings = {
            'chest': { id: 'm1', bodyPart: 'chest', treatmentId: 't1', note: '6時間ごとに確認' },
            'leftArm': { id: 'm2', bodyPart: 'leftArm', treatmentId: 't2', note: '傷口に異常なし' },
            'head': { id: 'm3', bodyPart: 'head', treatmentId: 't5', note: '熱が下がってきている' }
        };
        
        // マッピングを画面に表示
        renderAllMappings();
    }
}

// すべてのマッピングを画面に表示
function renderAllMappings() {
    // マップされたアイテム表示をクリア
    mappedItems.innerHTML = '';
    
    // マッピングリストをクリア
    treatmentList.innerHTML = '';
    
    // マッピングが空の場合
    if (Object.keys(bodyMappings).length === 0) {
        treatmentList.innerHTML = '<div class="empty-message">まだ処置がマッピングされていません</div>';
        return;
    }
    
    // マップされた各部位にマーカーを表示
    let index = 1;
    for (const bodyPart in bodyMappings) {
        const mapping = bodyMappings[bodyPart];
        const treatment = getTreatmentById(mapping.treatmentId);
        
        if (treatment) {
            // 体の部位にマッピングされたクラスを追加
            const bodyPartElement = document.getElementById(bodyPart);
            if (bodyPartElement) {
                bodyPartElement.classList.add('mapped');
            }
            
            // マーカーを作成
            createMarkerForBodyPart(bodyPart, index);
            
            // リストに追加
            createTreatmentListItem(mapping, treatment, index);
            
            index++;
        }
    }
}

// 体の部位にマーカーを作成
function createMarkerForBodyPart(bodyPart, index) {
    const bodyPartElement = document.getElementById(bodyPart);
    if (!bodyPartElement) return;
    
    // SVG要素の位置を取得
    const bbox = bodyPartElement.getBBox();
    const svgElement = document.getElementById('bodyMap');
    const svgRect = svgElement.getBoundingClientRect();
    
    // マーカーの位置を計算（体の部位の中心に配置）
    const x = bbox.x + (bbox.width / 2);
    const y = bbox.y + (bbox.height / 2);
    
    // マーカー要素を作成
    const marker = document.createElement('div');
    marker.className = 'mapped-marker';
    marker.textContent = index;
    marker.style.left = `${x / svgElement.viewBox.baseVal.width * 100}%`;
    marker.style.top = `${y / svgElement.viewBox.baseVal.height * 100}%`;
    
    // マーカークリック時のイベント
    marker.addEventListener('click', function() {
        selectBodyPart(bodyPartElement);
    });
    
    mappedItems.appendChild(marker);
}

// 処置リストアイテムを作成
function createTreatmentListItem(mapping, treatment, index) {
    const item = document.createElement('div');
    item.className = 'treatment-item';
    
    const bodyPartName = document.getElementById(mapping.bodyPart).getAttribute('data-name');
    
    item.innerHTML = `
        <div class="treatment-item-title">
            <span class="treatment-index">${index}</span> ${treatment.name}
            <span class="treatment-item-type ${getTypeClass(treatment.type)}">${getTypeLabel(treatment.type)}</span>
        </div>
        <div class="treatment-item-location">${bodyPartName}</div>
        ${mapping.note ? `<div class="treatment-item-note">${mapping.note}</div>` : ''}
    `;
    
    // アイテムクリック時のイベント
    item.addEventListener('click', function() {
        selectBodyPart(document.getElementById(mapping.bodyPart));
    });
    
    treatmentList.appendChild(item);
}

// 処置IDから処置情報を取得
function getTreatmentById(id) {
    return treatmentsDatabase.find(t => t.id === id);
}

// 既存のマッピングを取得
function getExistingMapping(bodyPart) {
    return bodyMappings[bodyPart];
}

// マッピングを適用
function applyMapping() {
    if (!selectedBodyPart) return;
    
    // 新規処置のフォームが表示されている場合は、新規処置を追加する
    if (!newTreatmentForm.classList.contains('hidden')) {
        // バリデーション
        if (!newTreatmentName.value.trim()) {
            alert('処置名を入力してください');
            return;
        }
        
        // 新規処置を追加
        const newTreatmentId = 'custom_' + Date.now();
        const newTreatment = {
            id: newTreatmentId,
            name: newTreatmentName.value.trim(),
            type: newTreatmentType.value,
            description: newTreatmentDesc.value.trim()
        };
        
        treatmentsDatabase.push(newTreatment);
        
        // セレクトボックスに追加
        const option = document.createElement('option');
        option.value = newTreatment.id;
        option.textContent = `${newTreatment.name} (${getTypeLabel(newTreatment.type)})`;
        treatmentSelect.appendChild(option);
        
        // セレクトボックスで選択
        treatmentSelect.value = newTreatmentId;
        
        // フォームを非表示に
        newTreatmentForm.classList.add('hidden');
        newTreatmentName.value = '';
        newTreatmentDesc.value = '';
    }
    
    // 選択した処置が未選択の場合
    if (!treatmentSelect.value) {
        alert('処置を選択してください');
        return;
    }
    
    // マッピングデータを作成
    const mappingId = currentMappingId || 'map_' + Date.now();
    const mappingData = {
        id: mappingId,
        bodyPart: selectedBodyPart,
        treatmentId: treatmentSelect.value,
        note: treatmentNote.value.trim()
    };
    
    // マッピングを保存
    bodyMappings[selectedBodyPart] = mappingData;
    
    // マッピングを再描画
    renderAllMappings();
    
    // フォームをクリア
    cancelMapping();
    
    // ローカルストレージに保存
    saveAllMappings();
}

// マッピングをキャンセル
function cancelMapping() {
    // 選択を解除
    const selectedParts = bodyMap.querySelectorAll('.selected');
    selectedParts.forEach(selected => {
        selected.classList.remove('selected');
    });
    
    // フォームを非表示
    mappingForm.classList.add('hidden');
    newTreatmentForm.classList.add('hidden');
    selectedBodyPart = null;
    currentMappingId = null;
}

// マッピングを削除
function removeMapping() {
    if (!selectedBodyPart || !bodyMappings[selectedBodyPart]) return;
    
    // マッピングを削除
    delete bodyMappings[selectedBodyPart];
    
    // 体の部位から「マップ済み」クラスを削除
    const bodyPartElement = document.getElementById(selectedBodyPart);
    if (bodyPartElement) {
        bodyPartElement.classList.remove('mapped');
    }
    
    // マッピングを再描画
    renderAllMappings();
    
    // フォームをクリア
    cancelMapping();
    
    // ローカルストレージに保存
    saveAllMappings();
}

// すべてのマッピングを保存
function saveAllMappings() {
    // ローカルストレージに保存
    localStorage.setItem('bodyMappings', JSON.stringify(bodyMappings));
    
    // 知識グラフとの連携（実際の実装ではサーバーに送信するなど）
    console.log('マッピングを保存しました', bodyMappings);
    
    alert('マッピングを保存しました');
}

// インポートモーダルを開く
function openImportModal() {
    importModal.classList.remove('hidden');
    
    // 知識グラフからデータを取得
    loadDataFromKnowledgeGraph();
}

// 知識グラフからデータを読み込む
function loadDataFromKnowledgeGraph() {
    // ローカルストレージから知識グラフデータを読み込み（実際の実装）
    const graphData = localStorage.getItem('nursingGraphData');
    
    if (graphData) {
        try {
            const parsedData = JSON.parse(graphData);
            
            // インポートリストをクリア
            importTreatmentList.innerHTML = '';
            
            // ノードをリストに追加
            if (parsedData.nodes && parsedData.nodes.length > 0) {
                parsedData.nodes.forEach(node => {
                    if (node.type === 'treatment' || node.type === 'medication' || node.type === 'observation') {
                        // 既に処置リストにある項目は除外
                        const existingTreatment = treatmentsDatabase.find(t => 
                            t.name.toLowerCase() === node.label.toLowerCase()
                        );
                        
                        if (!existingTreatment) {
                            addItemToImportList(node);
                        }
                    }
                });
            }
            
            // リストが空の場合
            if (importTreatmentList.children.length === 0) {
                importTreatmentList.innerHTML = '<div class="empty-message">インポート可能な項目がありません</div>';
            }
        } catch (e) {
            console.error('知識グラフデータの読み込みエラー:', e);
            importTreatmentList.innerHTML = '<div class="empty-message">データの読み込みに失敗しました</div>';
        }
    } else {
        importTreatmentList.innerHTML = '<div class="empty-message">知識グラフデータが見つかりませんでした</div>';
    }
}

// インポートリストにアイテムを追加
function addItemToImportList(node) {
    const item = document.createElement('div');
    item.className = 'import-item';
    
    item.innerHTML = `
        <input type="checkbox" name="import" value="${node.id}">
        <span>${node.label}</span>
        <span class="import-item-type ${getTypeClass(node.type)}">${getTypeLabel(node.type)}</span>
    `;
    
    importTreatmentList.appendChild(item);
}

// 選択した項目をインポート
function importSelectedTreatments() {
    const checkedItems = document.querySelectorAll('#importTreatmentList input[type="checkbox"]:checked');
    
    if (checkedItems.length === 0) {
        alert('インポートする項目を選択してください');
        return;
    }
    
    // 知識グラフからデータを取得
    const graphData = localStorage.getItem('nursingGraphData');
    
    if (!graphData) {
        alert('知識グラフデータが見つかりません');
        return;
    }
    
    try {
        const parsedData = JSON.parse(graphData);
        
        // 選択した項目を処置データベースに追加
        checkedItems.forEach(checkbox => {
            const nodeId = checkbox.value;
            const node = parsedData.nodes.find(n => n.id === nodeId);
            
            if (node) {
                const newTreatment = {
                    id: 'graph_' + nodeId,
                    name: node.label,
                    type: node.type,
                    description: `知識グラフからインポート: ${node.label}`
                };
                
                treatmentsDatabase.push(newTreatment);
                
                // セレクトボックスに追加
                const option = document.createElement('option');
                option.value = newTreatment.id;
                option.textContent = `${newTreatment.name} (${getTypeLabel(newTreatment.type)})`;
                treatmentSelect.appendChild(option);
            }
        });
        
        // モーダルを閉じる
        importModal.classList.add('hidden');
        
        alert(`${checkedItems.length}個のアイテムをインポートしました`);
    } catch (e) {
        console.error('インポートエラー:', e);
        alert('インポート中にエラーが発生しました');
    }
}

// 新規処置フォームの表示/非表示を切り替え
function toggleNewTreatmentForm() {
    newTreatmentForm.classList.toggle('hidden');
    
    if (!newTreatmentForm.classList.contains('hidden')) {
        newTreatmentName.focus();
    }
}