let constructions = [];
let zoomLevel = 1;
let conflictResults = [];
let protectionZones = [];
let viewBoxX = 0;
let viewBoxY = 0;
let viewBoxWidth = 2500;
let viewBoxHeight = 400;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function init() {
    try {
        console.log('=== 系统初始化开始 ===');
        
        if (!stations || stations.length === 0) {
            console.error('错误：stations数据未加载');
            alert('错误：车站数据未加载，请检查文件路径');
            return;
        }
        
        console.log('车站数据加载成功，共', stations.length, '个车站');
        
        initStationSelects();
        console.log('车站选择器初始化完成');
        
        initZoomAndPan();
        console.log('缩放和平移初始化完成');
        
        fitToContainer();
        console.log('容器适配完成');
        
        drawLineMap();
        console.log('线路图绘制完成');
        
        console.log('=== 系统初始化完成 ===');
    } catch (error) {
        console.error('系统初始化失败:', error);
        alert('系统初始化失败: ' + error.message);
    }
}

function fitToContainer() {
    const svg = document.getElementById('mapSvg');
    const container = svg.parentElement;
    
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;
    
    if (containerWidth === 0 || containerHeight === 0) {
        setTimeout(fitToContainer, 100);
        return;
    }
    
    const originalWidth = 2500;
    const originalHeight = 400;
    
    const scaleX = containerWidth / originalWidth;
    const scaleY = containerHeight / originalHeight;
    
    zoomLevel = Math.min(scaleX, scaleY) * 0.9;
    
    viewBoxWidth = originalWidth / zoomLevel;
    viewBoxHeight = originalHeight / zoomLevel;
    viewBoxX = (originalWidth - viewBoxWidth) / 2;
    viewBoxY = (originalHeight - viewBoxHeight) / 2;
    
    updateViewBox();
}

function initZoomAndPan() {
    const svg = document.getElementById('mapSvg');
    
    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = svg.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const svgX = viewBoxX + (mouseX / rect.width) * viewBoxWidth;
        const svgY = viewBoxY + (mouseY / rect.height) * viewBoxHeight;
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newWidth = viewBoxWidth * delta;
        const newHeight = viewBoxHeight * delta;
        
        const minWidth = 500;
        const maxWidth = 8000;
        
        if (newWidth < minWidth || newWidth > maxWidth) return;
        
        viewBoxX = svgX - (mouseX / rect.width) * newWidth;
        viewBoxY = svgY - (mouseY / rect.height) * newHeight;
        viewBoxWidth = newWidth;
        viewBoxHeight = newHeight;
        zoomLevel = 2500 / viewBoxWidth;
        
        updateViewBox();
    });
    
    svg.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        svg.style.cursor = 'grabbing';
    });
    
    svg.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = svg.getBoundingClientRect();
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        
        viewBoxX -= (deltaX / rect.width) * viewBoxWidth;
        viewBoxY -= (deltaY / rect.height) * viewBoxHeight;
        
        viewBoxX = Math.max(0, Math.min(viewBoxX, 2500 - viewBoxWidth));
        viewBoxY = Math.max(0, Math.min(viewBoxY, 400 - viewBoxHeight));
        
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        updateViewBox();
    });
    
    svg.addEventListener('mouseup', () => {
        isDragging = false;
        svg.style.cursor = 'grab';
    });
    
    svg.addEventListener('mouseleave', () => {
        isDragging = false;
        svg.style.cursor = 'grab';
    });
    
    svg.style.cursor = 'grab';
    
    window.addEventListener('resize', () => {
        fitToContainer();
    });
}

function updateViewBox() {
    const svg = document.getElementById('mapSvg');
    svg.setAttribute('viewBox', `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);
}

let formCount = 1;

function initStationSelects() {
    const startSelects = document.querySelectorAll('.startStation');
    const endSelects = document.querySelectorAll('.endStation');
    
    startSelects.forEach(select => {
        select.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        select.appendChild(emptyOption);
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = station.name;
            select.appendChild(option);
        });
    });
    
    endSelects.forEach(select => {
        select.innerHTML = '';
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = '';
        select.appendChild(emptyOption);
        stations.forEach(station => {
            const option = document.createElement('option');
            option.value = station.id;
            option.textContent = station.name;
            select.appendChild(option);
        });
    });
}

function initSingleFormStationSelects(formIndex) {
    const form = document.getElementById(`constructionForm_${formIndex}`);
    const startSelect = form.querySelector('.startStation');
    const endSelect = form.querySelector('.endStation');
    
    startSelect.innerHTML = '';
    const emptyOption1 = document.createElement('option');
    emptyOption1.value = '';
    emptyOption1.textContent = '';
    startSelect.appendChild(emptyOption1);
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.id;
        option.textContent = station.name;
        startSelect.appendChild(option);
    });
    
    endSelect.innerHTML = '';
    const emptyOption2 = document.createElement('option');
    emptyOption2.value = '';
    emptyOption2.textContent = '';
    endSelect.appendChild(emptyOption2);
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.id;
        option.textContent = station.name;
        endSelect.appendChild(option);
    });
}

function createNewForm() {
    const container = document.getElementById('constructionFormsContainer');
    const newIndex = formCount;
    formCount++;
    
    const formHtml = `
        <div class="construction-form-horizontal" id="constructionForm_${newIndex}">
            <div class="form-header-horizontal">
                <span>作业 #${newIndex + 1}</span>
            </div>
            <div class="form-group-horizontal">
                <div class="form-field-horizontal">
                    <label>作业代码</label>
                    <input type="text" class="constructionCode" placeholder="如: 6A1-30-01">
                </div>
                <div class="form-field-horizontal">
                    <label>作业类型</label>
                    <select class="constructionType">
                        <option value=""></option>
                        <option value="A1_LIVE">A1动车点（接触轨带电）</option>
                        <option value="A1_DEAD">A1动车点（接触轨不带电）</option>
                        <option value="A2_DEAD">A2人工点（接触轨不带电）</option>
                        <option value="A3_LIVE">A3人工点（接触轨带电）</option>
                        <option value="A3_DEAD">A3人工点（接触轨不带电）</option>
                    </select>
                </div>
                <div class="form-field-horizontal station-field">
                    <label>起点站点</label>
                    <div class="station-with-direction-horizontal">
                        <select class="startStation"></select>
                        <div class="direction-buttons-horizontal">
                            <label class="radio-label-horizontal">
                                <input type="radio" name="startDirection_${newIndex}" value="both" checked>
                                <span>上下行</span>
                            </label>
                            <label class="radio-label-horizontal">
                                <input type="radio" name="startDirection_${newIndex}" value="up">
                                <span>上行</span>
                            </label>
                            <label class="radio-label-horizontal">
                                <input type="radio" name="startDirection_${newIndex}" value="down">
                                <span>下行</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="form-field-horizontal station-field">
                    <label>终点站点</label>
                    <div class="station-with-direction-horizontal">
                        <select class="endStation"></select>
                        <div class="direction-buttons-horizontal">
                            <label class="radio-label-horizontal">
                                <input type="radio" name="endDirection_${newIndex}" value="both" checked>
                                <span>上下行</span>
                            </label>
                            <label class="radio-label-horizontal">
                                <input type="radio" name="endDirection_${newIndex}" value="up">
                                <span>上行</span>
                            </label>
                            <label class="radio-label-horizontal">
                                <input type="radio" name="endDirection_${newIndex}" value="down">
                                <span>下行</span>
                            </label>
                        </div>
                    </div>
                </div>
                <button class="confirm-btn-horizontal" onclick="confirmConstruction(${newIndex})">确定</button>
                <button class="add-btn-horizontal" onclick="addConstruction(${newIndex})">添加</button>
                <button class="delete-btn-horizontal" onclick="deleteConstruction(${newIndex})">删除</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHtml);
    
    initSingleFormStationSelects(newIndex);
    
    container.scrollTop = container.scrollHeight;
}

function drawLineMap() {
    const lineLayer = document.getElementById('lineLayer');
    const stationLayer = document.getElementById('stationLayer');
    const backgroundLayer = document.getElementById('backgroundLayer');
    
    lineLayer.innerHTML = '';
    stationLayer.innerHTML = '';
    backgroundLayer.innerHTML = '';
    
    drawBackground();
    drawLine();
    drawStations();
    drawPowerZones();
}

function drawBackground() {
    const bgLayer = document.getElementById('backgroundLayer');
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '2500');
    rect.setAttribute('height', '400');
    rect.setAttribute('fill', '#f0f4f8');
    bgLayer.appendChild(rect);
    
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('stroke', '#ddd');
    gridGroup.setAttribute('stroke-width', '0.5');
    
    for (let i = 0; i <= 2500; i += 100) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', i);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', i);
        line.setAttribute('y2', 400);
        gridGroup.appendChild(line);
    }
    
    for (let i = 0; i <= 400; i += 50) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', 0);
        line.setAttribute('y1', i);
        line.setAttribute('x2', 2500);
        line.setAttribute('y2', i);
        gridGroup.appendChild(line);
    }
    
    bgLayer.appendChild(gridGroup);
    
    const upLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    upLabel.setAttribute('x', 50);
    upLabel.setAttribute('y', 350);
    upLabel.setAttribute('font-size', '14');
    upLabel.setAttribute('font-weight', 'bold');
    upLabel.setAttribute('fill', '#0066cc');
    upLabel.textContent = '上行 (灵山湾 → 横云山路)';
    bgLayer.appendChild(upLabel);
    
    const downLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    downLabel.setAttribute('x', 50);
    downLabel.setAttribute('y', 150);
    downLabel.setAttribute('font-size', '14');
    downLabel.setAttribute('font-weight', 'bold');
    downLabel.setAttribute('fill', '#cc6600');
    downLabel.textContent = '下行 (横云山路 → 灵山湾)';
    bgLayer.appendChild(downLabel);
}

function getPowerZoneColor(zoneName) {
    const zoneColors = {
        '6A8': '#FF6B6B', '6B8': '#FF6B6B',
        '6A9': '#4ECDC4', '6B9': '#4ECDC4',
        '6A10': '#45B7D1', '6B10': '#45B7D1',
        '6A11': '#96CEB4', '6B11': '#96CEB4',
        '6A12': '#FECA57', '6B12': '#FECA57',
        '6A13': '#FF9FF3', '6B13': '#FF9FF3',
        '6A14': '#54A0FF', '6B14': '#54A0FF',
        '6A15': '#5F27CD', '6B15': '#5F27CD',
        '6A16': '#00D2D3', '6B16': '#00D2D3',
        '6A17': '#FF6B6B', '6B17': '#FF6B6B',
        '6A18': '#1DD1A1', '6B18': '#1DD1A1',
        '6A19': '#F368E0', '6B19': '#F368E0',
        '6A20': '#FF9F43', '6B20': '#FF9F43',
        '6A21': '#00CEC9', '6B21': '#00CEC9',
        '6A22': '#6C5CE7', '6B22': '#6C5CE7',
        '6A23': '#FD79A8', '6B23': '#FD79A8'
    };
    
    return zoneColors[zoneName] || '#ddd';
}

function drawPowerZones() {
    const bgLayer = document.getElementById('backgroundLayer');
    
    const upZones = powerZones.filter(z => z.direction === 'up');
    const downZones = powerZones.filter(z => z.direction === 'down');
    
    upZones.forEach(zone => {
        drawSinglePowerZone(zone, bgLayer, true);
    });
    
    downZones.forEach(zone => {
        drawSinglePowerZone(zone, bgLayer, false);
    });
}

function drawSinglePowerZone(zone, layer, isUp) {
    const startPos = kmToPosition(zone.startKm, zone.direction);
    const endPos = kmToPosition(zone.endKm, zone.direction);
    
    const lineY = startPos.y;
    
    let bgColor = getPowerZoneColor(zone.name);
    let powerStatus = 'neutral';
    
    const constructionInZone = constructions.find(c => 
        c.direction === zone.direction && c.startKm < zone.endKm && c.endKm > zone.startKm
    );
    
    if (constructionInZone) {
        powerStatus = constructionInZone.info.powerStatus;
        bgColor = powerStatus === 'live' ? '#90EE90' : '#FFE4B5';
    }
    
    const rectY = isUp ? lineY + 20 : lineY - 32;
    const rectHeight = 12;
    
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', Math.min(startPos.x, endPos.x));
    rect.setAttribute('y', rectY);
    rect.setAttribute('width', Math.abs(endPos.x - startPos.x));
    rect.setAttribute('height', rectHeight);
    rect.setAttribute('fill', bgColor);
    rect.setAttribute('opacity', powerStatus === 'neutral' ? '0.4' : '0.6');
    rect.setAttribute('stroke', powerStatus === 'neutral' ? bgColor : (powerStatus === 'live' ? '#28a745' : '#dc3545'));
    rect.setAttribute('stroke-width', powerStatus === 'neutral' ? '1' : '2');
    layer.appendChild(rect);
    
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (startPos.x + endPos.x) / 2);
    label.setAttribute('y', rectY + rectHeight / 2);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '9');
    label.setAttribute('fill', '#333');
    label.setAttribute('font-weight', 'bold');
    label.setAttribute('dominant-baseline', 'middle');
    label.textContent = zone.name;
    layer.appendChild(label);
    
    if (powerStatus !== 'neutral') {
        const powerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        powerLabel.setAttribute('x', (startPos.x + endPos.x) / 2);
        powerLabel.setAttribute('y', rectY + rectHeight + 12);
        powerLabel.setAttribute('text-anchor', 'middle');
        powerLabel.setAttribute('font-size', '8');
        powerLabel.setAttribute('fill', powerStatus === 'live' ? '#28a745' : '#dc3545');
        powerLabel.setAttribute('font-weight', 'bold');
        powerLabel.textContent = powerStatus === 'live' ? '带电' : '不带电';
        layer.appendChild(powerLabel);
    }
}

function drawLine() {
    const lineLayer = document.getElementById('lineLayer');
    
    lineSegments.forEach(segment => {
        const fromStation = stations.find(s => s.id === segment.from);
        const toStation = stations.find(s => s.id === segment.to);
        
        if (!fromStation || !toStation) return;
        
        if (segment.curve) {
            const upMidX = (fromStation.x + toStation.x) / 2;
            const upMidY = Math.min(fromStation.upY, toStation.upY) - 30;
            const upPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            upPath.setAttribute('d', `M ${fromStation.upY ? fromStation.x : fromStation.x} ${fromStation.upY ? fromStation.upY : fromStation.y} Q ${upMidX} ${upMidY} ${toStation.upY ? toStation.x : toStation.x} ${toStation.upY ? toStation.upY : toStation.y}`);
            upPath.setAttribute('stroke', '#0066cc');
            upPath.setAttribute('stroke-width', '4');
            upPath.setAttribute('fill', 'none');
            upPath.setAttribute('stroke-linecap', 'round');
            lineLayer.appendChild(upPath);
            
            const downMidX = (fromStation.x + toStation.x) / 2;
            const downMidY = Math.max(fromStation.downY, toStation.downY) + 30;
            const downPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            downPath.setAttribute('d', `M ${fromStation.downY ? fromStation.x : fromStation.x} ${fromStation.downY ? fromStation.downY : fromStation.y} Q ${downMidX} ${downMidY} ${toStation.downY ? toStation.x : toStation.x} ${toStation.downY ? toStation.downY : toStation.y}`);
            downPath.setAttribute('stroke', '#cc6600');
            downPath.setAttribute('stroke-width', '4');
            downPath.setAttribute('fill', 'none');
            downPath.setAttribute('stroke-linecap', 'round');
            lineLayer.appendChild(downPath);
        } else {
            const upLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            upLine.setAttribute('x1', fromStation.x);
            upLine.setAttribute('y1', fromStation.upY);
            upLine.setAttribute('x2', toStation.x);
            upLine.setAttribute('y2', toStation.upY);
            upLine.setAttribute('stroke', '#0066cc');
            upLine.setAttribute('stroke-width', '4');
            upLine.setAttribute('stroke-linecap', 'round');
            lineLayer.appendChild(upLine);
            
            const downLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            downLine.setAttribute('x1', fromStation.x);
            downLine.setAttribute('y1', fromStation.downY);
            downLine.setAttribute('x2', toStation.x);
            downLine.setAttribute('y2', toStation.downY);
            downLine.setAttribute('stroke', '#cc6600');
            downLine.setAttribute('stroke-width', '4');
            downLine.setAttribute('stroke-linecap', 'round');
            lineLayer.appendChild(downLine);
        }
    });
}

function drawStations() {
    const stationLayer = document.getElementById('stationLayer');
    
    for (let i = 0; i < stations.length; i++) {
        const station = stations[i];
        const stationLengthKm = 0.118;
        const startPos = kmToPosition(station.km - stationLengthKm / 2, 'up');
        const endPos = kmToPosition(station.km + stationLengthKm / 2, 'up');
        const stationWidthPx = Math.abs(endPos.x - startPos.x);
        const stationHeightPx = 30;
        
        const upStationRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        upStationRect.setAttribute('x', station.x - stationWidthPx / 2);
        upStationRect.setAttribute('y', station.upY - stationHeightPx / 2);
        upStationRect.setAttribute('width', stationWidthPx);
        upStationRect.setAttribute('height', stationHeightPx);
        upStationRect.setAttribute('fill', '#0066cc');
        upStationRect.setAttribute('opacity', '0.2');
        upStationRect.setAttribute('stroke', '#0066cc');
        upStationRect.setAttribute('stroke-width', '2');
        stationLayer.appendChild(upStationRect);
        
        const upCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        upCircle.setAttribute('cx', station.x);
        upCircle.setAttribute('cy', station.upY);
        upCircle.setAttribute('r', '8');
        upCircle.setAttribute('fill', '#ffffff');
        upCircle.setAttribute('stroke', '#0066cc');
        upCircle.setAttribute('stroke-width', '2');
        stationLayer.appendChild(upCircle);
        
        const upInnerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        upInnerCircle.setAttribute('cx', station.x);
        upInnerCircle.setAttribute('cy', station.upY);
        upInnerCircle.setAttribute('r', '4');
        upInnerCircle.setAttribute('fill', '#0066cc');
        stationLayer.appendChild(upInnerCircle);
        
        const downStationRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        downStationRect.setAttribute('x', station.x - stationWidthPx / 2);
        downStationRect.setAttribute('y', station.downY - stationHeightPx / 2);
        downStationRect.setAttribute('width', stationWidthPx);
        downStationRect.setAttribute('height', stationHeightPx);
        downStationRect.setAttribute('fill', '#cc6600');
        downStationRect.setAttribute('opacity', '0.2');
        downStationRect.setAttribute('stroke', '#cc6600');
        downStationRect.setAttribute('stroke-width', '2');
        stationLayer.appendChild(downStationRect);
        
        const downCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        downCircle.setAttribute('cx', station.x);
        downCircle.setAttribute('cy', station.downY);
        downCircle.setAttribute('r', '8');
        downCircle.setAttribute('fill', '#ffffff');
        downCircle.setAttribute('stroke', '#cc6600');
        downCircle.setAttribute('stroke-width', '2');
        stationLayer.appendChild(downCircle);
        
        const downInnerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        downInnerCircle.setAttribute('cx', station.x);
        downInnerCircle.setAttribute('cy', station.downY);
        downInnerCircle.setAttribute('r', '4');
        downInnerCircle.setAttribute('fill', '#cc6600');
        stationLayer.appendChild(downInnerCircle);
        
        const midY = (station.upY + station.downY) / 2;
        
        const prevStation = i > 0 ? stations[i - 1] : null;
        const nextStation = i < stations.length - 1 ? stations[i + 1] : null;
        
        const prevDistance = prevStation ? station.x - prevStation.x : Infinity;
        const nextDistance = nextStation ? nextStation.x - station.x : Infinity;
        const minDistance = Math.min(prevDistance, nextDistance);
        
        const stationName = station.name;
        const nameLength = stationName.length;
        const estimatedWidth = nameLength * 10;
        const needsVertical = minDistance < estimatedWidth + 20;
        
        if (needsVertical || nameLength > 8) {
            const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const chars = stationName.split('');
            const charSpacing = 12;
            const startY = midY - (chars.length - 1) * charSpacing / 2;
            
            chars.forEach((char, idx) => {
                const charText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                charText.setAttribute('x', station.x);
                charText.setAttribute('y', startY + idx * charSpacing);
                charText.setAttribute('text-anchor', 'middle');
                charText.setAttribute('font-size', '9');
                charText.setAttribute('fill', '#333');
                charText.setAttribute('font-weight', 'bold');
                charText.setAttribute('dominant-baseline', 'middle');
                charText.textContent = char;
                textGroup.appendChild(charText);
            });
            
            stationLayer.appendChild(textGroup);
            
            const kmText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            kmText.setAttribute('x', station.x);
            kmText.setAttribute('y', midY + (chars.length * charSpacing / 2) + 20);
            kmText.setAttribute('text-anchor', 'middle');
            kmText.setAttribute('font-size', '7');
            kmText.setAttribute('fill', '#666');
            kmText.textContent = `K${station.km.toFixed(3)}`;
            stationLayer.appendChild(kmText);
        } else {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', station.x);
            text.setAttribute('y', midY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '10');
            text.setAttribute('fill', '#333');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('dominant-baseline', 'middle');
            text.textContent = stationName;
            stationLayer.appendChild(text);
            
            const kmText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            kmText.setAttribute('x', station.x);
            kmText.setAttribute('y', midY + 20);
            kmText.setAttribute('text-anchor', 'middle');
            kmText.setAttribute('font-size', '8');
            kmText.setAttribute('fill', '#666');
            kmText.textContent = `K${station.km.toFixed(3)}`;
            stationLayer.appendChild(kmText);
        }
    }
}

function getConstructionColor(type) {
    const colors = {
        A1_LIVE: '#28a745',
        A1_DEAD: '#dc3545',
        A2_LIVE: '#ffc107',
        A2_DEAD: '#fd7e14',
        A3_LIVE: '#6f42c1',
        A3_DEAD: '#e83e8c'
    };
    return colors[type] || '#007bff';
}

function getProtectionColor(powerStatus) {
    return powerStatus === 'live' ? '#90EE90' : '#FFE4B5';
}

function kmToPosition(km, direction = 'up') {
    for (let i = 0; i < stations.length - 1; i++) {
        const current = stations[i];
        const next = stations[i + 1];
        
        if (km >= current.km && km <= next.km) {
            const ratio = (km - current.km) / (next.km - current.km);
            const x = current.x + (next.x - current.x) * ratio;
            const y = direction === 'up' ? 
                (current.upY + (next.upY - current.upY) * ratio) : 
                (current.downY + (next.downY - current.downY) * ratio);
            return { x, y };
        }
    }
    
    if (km <= stations[0].km) {
        return { x: stations[0].x, y: direction === 'up' ? stations[0].upY : stations[0].downY };
    }
    const last = stations[stations.length - 1];
    return { x: last.x, y: direction === 'up' ? last.upY : last.downY };
}

function getPowerZoneForKm(km, direction = 'up') {
    for (let i = 0; i < powerZones.length; i++) {
        const zone = powerZones[i];
        if (zone.direction === direction && km >= zone.startKm && km <= zone.endKm) {
            return zone.id;
        }
    }
    return direction === 'up' ? '6B23' : '6A23';
}

function addConstruction(formIndex) {
    const form = document.getElementById(`constructionForm_${formIndex}`);
    
    const code = form.querySelector('.constructionCode').value.trim();
    const type = form.querySelector('.constructionType').value;
    const startDirection = form.querySelector(`input[name="startDirection_${formIndex}"]:checked`).value;
    const endDirection = form.querySelector(`input[name="endDirection_${formIndex}"]:checked`).value;
    const startStationId = parseInt(form.querySelector('.startStation').value);
    const endStationId = parseInt(form.querySelector('.endStation').value);
    
    if (!code) {
        alert('请输入作业代码');
        return;
    }
    
    if (!type) {
        alert('请选择作业类型');
        return;
    }
    
    if (!startStationId) {
        alert('请选择起点站点');
        return;
    }
    
    if (!endStationId) {
        alert('请选择终点站点');
        return;
    }
    
    if (startStationId >= endStationId) {
        alert('起点站点必须在终点站点之前');
        return;
    }
    
    const startStation = stations.find(s => s.id === startStationId);
    const endStation = stations.find(s => s.id === endStationId);
    
    const startKm = startStation.km;
    const endKm = endStation.km;
    
    if (startKm >= endKm) {
        alert('施工起点不能超过施工终点');
        return;
    }
    
    let directions = [];
    if (startDirection === 'both' && endDirection === 'both') {
        directions = ['up', 'down'];
    } else if (startDirection === 'both') {
        directions = [endDirection];
    } else if (endDirection === 'both') {
        directions = [startDirection];
    } else if (startDirection === endDirection) {
        directions = [startDirection];
    } else {
        alert('起点和终点的行车方向必须一致');
        return;
    }
    
    directions.forEach(dir => {
        const startPowerZone = getPowerZoneForKm(startKm, dir);
        const endPowerZone = getPowerZoneForKm(endKm, dir);
        
        const originalDirection = startDirection === 'both' && endDirection === 'both' ? 'both' : 
                                  startDirection === 'both' ? endDirection : 
                                  endDirection === 'both' ? startDirection : startDirection;
        
        const construction = {
            id: Date.now() + Math.random(),
            formIndex,
            code,
            type,
            direction: dir,
            originalDirection: originalDirection,
            startStationId,
            endStationId,
            startKm,
            endKm,
            startPowerZone,
            endPowerZone,
            info: constructionTypes[type]
        };
        
        constructions.push(construction);
    });
    
    createNewForm();
}

function confirmConstruction(formIndex) {
    const form = document.getElementById(`constructionForm_${formIndex}`);
    
    const code = form.querySelector('.constructionCode').value.trim();
    const type = form.querySelector('.constructionType').value;
    const startDirection = form.querySelector(`input[name="startDirection_${formIndex}"]:checked`).value;
    const endDirection = form.querySelector(`input[name="endDirection_${formIndex}"]:checked`).value;
    const startStationId = parseInt(form.querySelector('.startStation').value);
    const endStationId = parseInt(form.querySelector('.endStation').value);
    
    if (!code) {
        alert('请输入作业代码');
        return;
    }
    
    if (!type) {
        alert('请选择作业类型');
        return;
    }
    
    if (!startStationId) {
        alert('请选择起点站点');
        return;
    }
    
    if (!endStationId) {
        alert('请选择终点站点');
        return;
    }
    
    if (startStationId >= endStationId) {
        alert('起点站点必须在终点站点之前');
        return;
    }
    
    const startStation = stations.find(s => s.id === startStationId);
    const endStation = stations.find(s => s.id === endStationId);
    
    const startKm = startStation.km;
    const endKm = endStation.km;
    
    if (startKm >= endKm) {
        alert('施工起点不能超过施工终点');
        return;
    }
    
    let directions = [];
    if (startDirection === 'both' && endDirection === 'both') {
        directions = ['up', 'down'];
    } else if (startDirection === 'both') {
        directions = [endDirection];
    } else if (endDirection === 'both') {
        directions = [startDirection];
    } else if (startDirection === endDirection) {
        directions = [startDirection];
    } else {
        alert('起点和终点的行车方向必须一致');
        return;
    }
    
    constructions = constructions.filter(c => c.formIndex !== formIndex);
    
    directions.forEach(dir => {
        const startPowerZone = getPowerZoneForKm(startKm, dir);
        const endPowerZone = getPowerZoneForKm(endKm, dir);
        
        const originalDirection = startDirection === 'both' && endDirection === 'both' ? 'both' : 
                                  startDirection === 'both' ? endDirection : 
                                  endDirection === 'both' ? startDirection : startDirection;
        
        const construction = {
            id: Date.now() + Math.random(),
            formIndex,
            code,
            type,
            direction: dir,
            originalDirection: originalDirection,
            startStationId,
            endStationId,
            startKm,
            endKm,
            startPowerZone,
            endPowerZone,
            info: constructionTypes[type]
        };
        
        constructions.push(construction);
    });
    
    calculateProtectionZones();
    drawConstructions();
    checkConflicts();
}

function removeConstruction(id) {
    constructions = constructions.filter(c => c.id !== id);
    calculateProtectionZones();
    drawConstructions();
    checkConflicts();
}

function deleteConstruction(formIndex) {
    constructions = constructions.filter(c => c.formIndex !== formIndex);
    
    if (formIndex === 0) {
        const form = document.getElementById(`constructionForm_${formIndex}`);
        form.querySelector('.constructionCode').value = '';
        form.querySelector('.constructionType').value = '';
        form.querySelector('.startStation').value = '';
        form.querySelector('.endStation').value = '';
        form.querySelector(`input[name="startDirection_${formIndex}"][value="both"]`).checked = true;
        form.querySelector(`input[name="endDirection_${formIndex}"][value="both"]`).checked = true;
    } else {
        const form = document.getElementById(`constructionForm_${formIndex}`);
        form.remove();
    }
    
    calculateProtectionZones();
    drawConstructions();
    checkConflicts();
}

function calculateProtectionZones() {
    protectionZones = [];
    
    const stationLengthKm = 0.118;
    
    if (constructions.length >= 2) {
        const directions = ['up', 'down'];
        
        directions.forEach(dir => {
            const dirConstructions = constructions.filter(c => c.direction === dir);
            
            if (dirConstructions.length < 2) {
                return;
            }
            
            dirConstructions.sort((a, b) => a.startKm - b.startKm);
            
            for (let i = 0; i < dirConstructions.length - 1; i++) {
                for (let j = i + 1; j < dirConstructions.length; j++) {
                    const c1 = dirConstructions[i];
                    const c2 = dirConstructions[j];
                    
                    if (c2.startKm <= c1.endKm) {
                        continue;
                    }
                    
                    const ruleKey = getRuleKey(c1.type, c2.type);
                    const rule = protectionRules[ruleKey];
                    
                    if (!rule) {
                        continue;
                    }
                    
                    rule.rules.forEach(r => {
                        const targetConstruction = (r.side === 'A1_LIVE' && c2.type === 'A1_LIVE' && c1.type !== 'A1_LIVE') ? c2 : 
                                                 (r.side === 'A1_DEAD' && c2.type === 'A1_DEAD' && c1.type !== 'A1_DEAD') ? c2 : c1;
                        const otherConstruction = targetConstruction === c1 ? c2 : c1;
                        const isTargetC1 = targetConstruction === c1;
                        
                        if (!isTargetC1 && (r.side === 'A1_LIVE' || r.side === 'A1_DEAD')) {
                            addProtectionZone(dir, r, targetConstruction, otherConstruction, c1, c2, stationLengthKm, false);
                        } else if (r.side === 'both' || r.side === c1.type) {
                            addProtectionZone(dir, r, c1, c2, c1, c2, stationLengthKm, true);
                        }
                        
                        if (r.side === 'both' || (r.side === 'A1_LIVE' && c2.type === 'A1_LIVE') || (r.side === 'A1_DEAD' && c2.type === 'A1_DEAD')) {
                            addProtectionZone(dir, r, c2, c1, c1, c2, stationLengthKm, false);
                        }
                    });
                }
            }
        });
    }
    
    addOppositeDirectionProtectionZones();
    
    protectionZones = mergeSharedProtectionZones(protectionZones);
}

function addProtectionZone(dir, r, targetConstruction, otherConstruction, c1, c2, stationLengthKm, isC1End) {
    const isShared = r.side === 'both';
    
    if (r.minSize === 'power_zone') {
        const dirPowerZones = powerZones.filter(z => z.direction === dir).sort((a, b) => a.startKm - b.startKm);
        
        const stationId = isC1End ? targetConstruction.endStationId : targetConstruction.startStationId;
        const targetStation = stations.find(s => s.id === stationId);
        const stationKm = targetStation.km;
        
        let stationZone = null;
        for (let k = 0; k < dirPowerZones.length; k++) {
            const zone = dirPowerZones[k];
            if (stationKm >= zone.startKm && stationKm <= zone.endKm) {
                stationZone = zone;
                break;
            }
        }
        
        if (stationZone) {
            const currentZoneIndex = dirPowerZones.findIndex(z => z.id === stationZone.id);
            const protectZone = isC1End ? 
                (currentZoneIndex < dirPowerZones.length - 1 ? dirPowerZones[currentZoneIndex + 1] : null) :
                (currentZoneIndex > 0 ? dirPowerZones[currentZoneIndex - 1] : null);
            
            if (protectZone) {
                protectionZones.push({
                    id: `${c1.id}-${c2.id}-${isC1End ? 'left' : 'right'}-${dir}`,
                    type: 'protection',
                    direction: dir,
                    constructionId1: targetConstruction.id,
                    constructionId2: isShared ? otherConstruction.id : null,
                    startKm: protectZone.startKm,
                    endKm: protectZone.endKm,
                    startStation: null,
                    endStation: null,
                    powerStatus: r.powerStatus,
                    description: isShared ? `${c1.code}与${c2.code}共用防护区域(${protectZone.id})` : `${targetConstruction.code}的防护区域(${protectZone.id})`
                });
            }
        }
    } else {
        const stationIndex = stations.findIndex(s => s.id === (isC1End ? targetConstruction.endStationId : targetConstruction.startStationId));
        const nextIndex = isC1End ? stationIndex + 1 : stationIndex - 1;
        
        if (nextIndex >= 0 && nextIndex < stations.length) {
            const targetStation = stations.find(s => s.id === (isC1End ? targetConstruction.endStationId : targetConstruction.startStationId));
            const nextStation = stations[nextIndex];
            
            const protectStartKm = isC1End ? targetStation.km + stationLengthKm / 2 : nextStation.km - stationLengthKm / 2;
            const protectEndKm = isC1End ? nextStation.km + stationLengthKm / 2 : targetStation.km - stationLengthKm / 2;
            
            protectionZones.push({
                id: `${c1.id}-${c2.id}-${isC1End ? 'left' : 'right'}-${dir}`,
                type: 'protection',
                direction: dir,
                constructionId1: targetConstruction.id,
                constructionId2: isShared ? otherConstruction.id : null,
                startKm: protectStartKm,
                endKm: protectEndKm,
                startStation: isC1End ? targetConstruction.endStationId : nextStation.id,
                endStation: isC1End ? nextStation.id : targetConstruction.startStationId,
                powerStatus: r.powerStatus,
                description: isShared ? `${c1.code}与${c2.code}共用防护区域` : `${targetConstruction.code}的防护区域`
            });
        }
    }
}

function addOppositeDirectionProtectionZones() {
    const a1Constructions = constructions.filter(c => c.type.startsWith('A1_'));
    
    a1Constructions.forEach(c => {
        if (c.originalDirection !== 'both') {
            const oppositeDir = c.direction === 'up' ? 'down' : 'up';
            
            const oppositePowerZones = powerZones.filter(z => z.direction === oppositeDir).sort((a, b) => a.startKm - b.startKm);
            
            const cStartKm = c.startKm;
            const cEndKm = c.endKm;
            
            for (let k = 0; k < oppositePowerZones.length; k++) {
                const zone = oppositePowerZones[k];
                if (cStartKm < zone.endKm && cEndKm > zone.startKm) {
                    protectionZones.push({
                        id: `${c.id}-opposite-${oppositeDir}-${zone.id}`,
                        type: 'protection',
                        direction: oppositeDir,
                        constructionId1: c.id,
                        constructionId2: null,
                        startKm: zone.startKm,
                        endKm: zone.endKm,
                        startStation: null,
                        endStation: null,
                        powerStatus: c.info.powerStatus,
                        description: `${c.code}对应${oppositeDir}方向的防护区域(${zone.id})`
                    });
                }
            }
        }
    });
}

function getRuleKey(type1, type2) {
    const types = [type1, type2].sort();
    
    if (types.includes('A1_LIVE') && types.includes('A1_DEAD')) {
        return 'A1_LIVE_A1_DEAD';
    }
    if (types[0] === 'A1_LIVE' && types[1] === 'A1_LIVE') {
        return 'A1_LIVE_A1_LIVE';
    }
    if (types[0] === 'A1_DEAD' && types[1] === 'A1_DEAD') {
        return 'A1_DEAD_A1_DEAD';
    }
    if (types.includes('A1_DEAD') && types.some(t => t.startsWith('A2'))) {
        return 'A1_DEAD_A2';
    }
    if (types.includes('A1_LIVE') && types.some(t => t.startsWith('A2'))) {
        return 'A1_LIVE_A2';
    }
    if (types.includes('A1_LIVE') && types.includes('A3_LIVE')) {
        return 'A1_LIVE_A3_LIVE';
    }
    if (types.includes('A1_LIVE') && types.includes('A3_DEAD')) {
        return 'A1_LIVE_A3_DEAD';
    }
    if (types.includes('A1_DEAD') && types.includes('A3_LIVE')) {
        return 'A1_DEAD_A3_LIVE';
    }
    if (types.includes('A1_DEAD') && types.includes('A3_DEAD')) {
        return 'A1_DEAD_A3_DEAD';
    }
    
    return null;
}

function mergeSharedProtectionZones(zones) {
    return zones;
}

function drawConstructions() {
    const constructionLayer = document.getElementById('constructionLayer');
    const protectionLayer = document.getElementById('protectionLayer');
    const redLightLayer = document.getElementById('redLightLayer');
    
    constructionLayer.innerHTML = '';
    protectionLayer.innerHTML = '';
    redLightLayer.innerHTML = '';
    
    constructions.forEach(construction => {
        const startPos = kmToPosition(construction.startKm, construction.direction);
        const endPos = kmToPosition(construction.endKm, construction.direction);
        
        const color = getConstructionColor(construction.type);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startPos.x);
        line.setAttribute('y1', startPos.y);
        line.setAttribute('x2', endPos.x);
        line.setAttribute('y2', endPos.y);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '12');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '0.7');
        constructionLayer.appendChild(line);
        
        const highlightLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        highlightLine.setAttribute('x1', startPos.x);
        highlightLine.setAttribute('y1', startPos.y);
        highlightLine.setAttribute('x2', endPos.x);
        highlightLine.setAttribute('y2', endPos.y);
        highlightLine.setAttribute('stroke', color);
        highlightLine.setAttribute('stroke-width', '6');
        highlightLine.setAttribute('stroke-linecap', 'round');
        constructionLayer.appendChild(highlightLine);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2 - 35;
        label.setAttribute('x', midX);
        label.setAttribute('y', midY);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', color);
        label.textContent = construction.code;
        constructionLayer.appendChild(label);
        
        const powerLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        powerLabel.setAttribute('x', midX);
        powerLabel.setAttribute('y', midY - 20);
        powerLabel.setAttribute('text-anchor', 'middle');
        powerLabel.setAttribute('font-size', '10');
        powerLabel.setAttribute('fill', construction.info.powerStatus === 'live' ? '#28a745' : '#dc3545');
        powerLabel.textContent = construction.info.powerStatus === 'live' ? '接触轨带电' : '接触轨不带电';
        constructionLayer.appendChild(powerLabel);
    });
    
    drawProtectionZones();
    drawRedLights();
}

function drawProtectionZones() {
    const protectionLayer = document.getElementById('protectionLayer');
    
    protectionZones.forEach(zone => {
        const startPos = kmToPosition(zone.startKm, zone.direction);
        const endPos = kmToPosition(zone.endKm, zone.direction);
        
        const color = getProtectionColor(zone.powerStatus);
        const isUp = zone.direction === 'up';
        const lineY = startPos.y;
        
        const rectY = isUp ? lineY + 20 : lineY - 32;
        const rectHeight = 12;
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const minX = Math.min(startPos.x, endPos.x);
        const width = Math.abs(endPos.x - startPos.x);
        
        rect.setAttribute('x', minX);
        rect.setAttribute('y', rectY);
        rect.setAttribute('width', width);
        rect.setAttribute('height', rectHeight);
        rect.setAttribute('fill', color);
        rect.setAttribute('opacity', '0.6');
        protectionLayer.appendChild(rect);
        
        const border = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        border.setAttribute('x', minX);
        border.setAttribute('y', rectY);
        border.setAttribute('width', width);
        border.setAttribute('height', rectHeight);
        border.setAttribute('fill', 'none');
        border.setAttribute('stroke', '#ff0000');
        border.setAttribute('stroke-width', '2');
        border.setAttribute('stroke-dasharray', '8,4');
        border.setAttribute('stroke-linecap', 'butt');
        protectionLayer.appendChild(border);
        
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const midX = (startPos.x + endPos.x) / 2;
        label.setAttribute('x', midX);
        label.setAttribute('y', rectY + rectHeight / 2);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '9');
        label.setAttribute('fill', '#dc3545');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('dominant-baseline', 'middle');
        label.textContent = `防护${zone.powerStatus === 'live' ? '(带电)' : '(不带电)'}`;
        protectionLayer.appendChild(label);
        
        if (zone.shared) {
            const sharedLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            sharedLabel.setAttribute('x', midX);
            sharedLabel.setAttribute('y', rectY + rectHeight + 10);
            sharedLabel.setAttribute('text-anchor', 'middle');
            sharedLabel.setAttribute('font-size', '8');
            sharedLabel.setAttribute('fill', '#dc3545');
            sharedLabel.textContent = '共用';
            protectionLayer.appendChild(sharedLabel);
        }
    });
}

function drawRedLights() {
    const redLightLayer = document.getElementById('redLightLayer');
    redLightLayer.innerHTML = '';
    
    const directions = ['up', 'down'];
    
    directions.forEach(dir => {
        const dirConstructions = constructions.filter(c => c.direction === dir);
        
        if (dirConstructions.length === 0) {
            return;
        }
        
        dirConstructions.forEach(construction => {
            const rules = redLightRules[construction.type];
            
            if (!rules || !rules.needRedLight) {
                return;
            }
            
            const otherConstructions = dirConstructions.filter(c => c.id !== construction.id);
            
            let needRedLight = true;
            
            otherConstructions.forEach(other => {
                if (other.startKm < construction.endKm && other.endKm > construction.startKm) {
                    needRedLight = false;
                }
            });
            
            if (!needRedLight) {
                return;
            }
            
            const startPos = kmToPosition(construction.startKm, dir);
            const endPos = kmToPosition(construction.endKm, dir);
            
            const redLightStart = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            redLightStart.setAttribute('cx', startPos.x);
            redLightStart.setAttribute('cy', dir === 'up' ? startPos.y + 15 : startPos.y - 15);
            redLightStart.setAttribute('r', '6');
            redLightStart.setAttribute('fill', '#ff0000');
            redLightStart.setAttribute('stroke', '#ffffff');
            redLightStart.setAttribute('stroke-width', '2');
            redLightStart.setAttribute('filter', 'url(#glow)');
            redLightLayer.appendChild(redLightStart);
            
            const redLightEnd = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            redLightEnd.setAttribute('cx', endPos.x);
            redLightEnd.setAttribute('cy', dir === 'up' ? endPos.y + 15 : endPos.y - 15);
            redLightEnd.setAttribute('r', '6');
            redLightEnd.setAttribute('fill', '#ff0000');
            redLightEnd.setAttribute('stroke', '#ffffff');
            redLightEnd.setAttribute('stroke-width', '2');
            redLightEnd.setAttribute('filter', 'url(#glow)');
            redLightLayer.appendChild(redLightEnd);
        });
    });
}

function checkConflicts() {
    conflictResults = [];
    
    if (constructions.length >= 2) {
        for (let i = 0; i < constructions.length; i++) {
            for (let j = i + 1; j < constructions.length; j++) {
                const c1 = constructions[i];
                const c2 = constructions[j];
                
                if (c1.formIndex === c2.formIndex) {
                    continue;
                }
                
                if (c1.direction !== c2.direction) {
                    continue;
                }
                
                if (c1.endKm <= c2.startKm || c2.endKm <= c1.startKm) {
                    continue;
                }
                
                const codes = [c1.code, c2.code].sort();
                const key = `${codes[0]}-${codes[1]}`;
                
                if (conflictResults.some(r => r.key === key)) {
                    continue;
                }
                
                conflictResults.push({
                    key,
                    type: 'construction',
                    message: `${c1.code}与${c2.code}施工区域冲突`
                });
            }
        }
    }
    
    protectionZones.forEach(zone => {
        constructions.forEach(construction => {
            if (construction.id === zone.constructionId1 || construction.id === zone.constructionId2) {
                return;
            }
            
            if (construction.direction !== zone.direction) {
                return;
            }
            
            if (construction.endKm <= zone.startKm || construction.startKm >= zone.endKm) {
                return;
            }
            
            const codes = [construction.code, zone.description].sort();
            const key = `protection-${codes[0]}-${codes[1]}`;
            
            if (conflictResults.some(r => r.key === key)) {
                return;
            }
            
            conflictResults.push({
                key,
                type: 'protection',
                message: `${construction.code}的施工区域与${zone.description}冲突`
            });
        });
    });
    
    protectionZones.forEach((zone1, i) => {
        protectionZones.slice(i + 1).forEach(zone2 => {
            if (zone1.direction !== zone2.direction) {
                return;
            }
            
            if (zone1.endKm <= zone2.startKm || zone2.endKm <= zone1.startKm) {
                return;
            }
            
            if (zone1.constructionId1 === zone2.constructionId1 && 
                zone1.constructionId2 === zone2.constructionId2) {
                return;
            }
            
            const codes = [zone1.description, zone2.description].sort();
            const key = `protection-zone-${codes[0]}-${codes[1]}`;
            
            if (conflictResults.some(r => r.key === key)) {
                return;
            }
            
            conflictResults.push({
                key,
                type: 'protection_zone',
                message: `${zone1.description}与${zone2.description}冲突`
            });
        });
    });
    
    const a1DeadConstructions = constructions.filter(c => c.type === 'A1_DEAD');
    
    if (a1DeadConstructions.length >= 2) {
        for (let i = 0; i < a1DeadConstructions.length; i++) {
            for (let j = i + 1; j < a1DeadConstructions.length; j++) {
                const c1 = a1DeadConstructions[i];
                const c2 = a1DeadConstructions[j];
                
                if (c1.direction !== c2.direction) {
                    continue;
                }
                
                const gapKm = Math.abs(c2.startKm - c1.endKm);
                
                if (gapKm <= 0.118 * 2) {
                    const codes = [c1.code, c2.code].sort();
                    const key = `distance-${codes[0]}-${codes[1]}`;
                    
                    if (conflictResults.some(r => r.key === key)) {
                        continue;
                    }
                    
                    conflictResults.push({
                        key,
                        type: 'distance',
                        message: `${c1.code}与${c2.code}之间防护距离不足`
                    });
                }
            }
        }
    }
    
    displayConflicts();
}

function displayConflicts() {
    const conflictResult = document.getElementById('conflictResult');
    
    if (conflictResults.length === 0) {
        conflictResult.textContent = '未检测到冲突';
        conflictResult.className = 'conflict-result no-conflict';
    } else {
        conflictResult.innerHTML = conflictResults.map(r => `<p>${r.message}</p>`).join('');
        conflictResult.className = 'conflict-result has-conflict';
    }
}

function canShareProtectionZone(c1, c2) {
    if (!c1.type.startsWith('A1_') || !c2.type.startsWith('A1_')) {
        return false;
    }
    
    if (c1.type !== c2.type) {
        return false;
    }
    
    const distance = Math.abs(c2.startKm - c1.endKm);
    
    return distance <= 1.5;
}

function exportToPDF() {
    const mapContainer = document.querySelector('.right-panel');
    
    html2canvas(mapContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        if (window.showSaveFilePicker) {
            window.showSaveFilePicker({
                suggestedName: `分段施工预想图_${timestamp}.pdf`,
                types: [{
                    description: 'PDF文件',
                    accept: { 'application/pdf': ['.pdf'] }
                }]
            }).then(handle => {
                return handle.createWritable();
            }).then(writable => {
                return writable.write(pdf.output('blob'));
            }).then(() => {
                console.log('PDF导出成功');
            }).catch(err => {
                console.error('PDF导出失败:', err);
                pdf.save(`分段施工预想图_${timestamp}.pdf`);
            });
        } else {
            pdf.save(`分段施工预想图_${timestamp}.pdf`);
        }
    }).catch(err => {
        console.error('截图失败:', err);
        alert('导出PDF失败，请重试');
    });
}

window.addEventListener('DOMContentLoaded', init);