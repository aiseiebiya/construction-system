const stations = [
    { id: 1, name: "灵山湾站", km: 23.19569, x: 100, y: 250, powerZone: 1, upY: 300, downY: 200 },
    { id: 2, name: "辛屯站", km: 24.41842, x: 180, y: 250, powerZone: 1, upY: 300, downY: 200 },
    { id: 3, name: "华山站", km: 25.60379, x: 260, y: 250, powerZone: 1, upY: 300, downY: 200 },
    { id: 4, name: "星海滩路站", km: 26.61306, x: 340, y: 250, powerZone: 2, upY: 300, downY: 200 },
    { id: 5, name: "赵家庙（影视产业园）站", km: 28.71642, x: 480, y: 250, powerZone: 2, upY: 300, downY: 200 },
    { id: 6, name: "毛家山（黄海学院）站", km: 29.87684, x: 560, y: 250, powerZone: 2, upY: 300, downY: 200 },
    { id: 7, name: "西门外站", km: 31.07244, x: 650, y: 250, powerZone: 3, upY: 300, downY: 200 },
    { id: 8, name: "北门外站", km: 32.18118, x: 730, y: 250, powerZone: 3, upY: 300, downY: 200 },
    { id: 9, name: "王家港站", km: 34.54285, x: 900, y: 250, powerZone: 3, upY: 300, downY: 200 },
    { id: 10, name: "九顶山站", km: 36.16752, x: 1020, y: 250, powerZone: 4, upY: 300, downY: 200 },
    { id: 11, name: "钱塘江路（青职学院）站", km: 37.73176, x: 1140, y: 250, powerZone: 4, upY: 300, downY: 200 },
    { id: 12, name: "扒山（滨海学院）站", km: 39.16569, x: 1260, y: 250, powerZone: 4, upY: 300, downY: 200 },
    { id: 13, name: "青大附院西海岸院区站", km: 40.05197, x: 1340, y: 250, powerZone: 5, upY: 300, downY: 200 },
    { id: 14, name: "港头站", km: 42.35140, x: 1520, y: 250, powerZone: 5, upY: 300, downY: 200 },
    { id: 15, name: "薛家泊子站", km: 44.14186, x: 1660, y: 250, powerZone: 5, upY: 300, downY: 200 },
    { id: 16, name: "马家楼站", km: 45.72607, x: 1780, y: 250, powerZone: 6, upY: 300, downY: 200 },
    { id: 17, name: "抓马山站", km: 47.42943, x: 1920, y: 250, powerZone: 6, upY: 300, downY: 200 },
    { id: 18, name: "青岛九中（幸福小镇）站", km: 48.76207, x: 2030, y: 250, powerZone: 6, upY: 300, downY: 200 },
    { id: 19, name: "河洛埠（中德生态园）站", km: 50.66735, x: 2180, y: 250, powerZone: 7, upY: 300, downY: 200 },
    { id: 20, name: "山王河（福莱社区）站", km: 51.72273, x: 2270, y: 250, powerZone: 7, upY: 300, downY: 200 },
    { id: 21, name: "横云山路站", km: 53.33817, x: 2400, y: 250, powerZone: 7, upY: 300, downY: 200 }
];

const powerZones = [
    { id: '6B8', name: '6B8', direction: 'up', startKm: 22.805533, endKm: 23.116749 },
    { id: '6B9', name: '6B9', direction: 'up', startKm: 23.126847, endKm: 25.524722 },
    { id: '6B10', name: '6B10', direction: 'up', startKm: 25.534831, endKm: 28.644041 },
    { id: '6B11', name: '6B11', direction: 'up', startKm: 28.654138, endKm: 29.734749 },
    { id: '6B12', name: '6B12', direction: 'up', startKm: 29.744849, endKm: 31.002807 },
    { id: '6B13', name: '6B13', direction: 'up', startKm: 31.013125, endKm: 34.463907 },
    { id: '6B14', name: '6B14', direction: 'up', startKm: 34.474010, endKm: 36.078587 },
    { id: '6B15', name: '6B15', direction: 'up', startKm: 36.088737, endKm: 39.087804 },
    { id: '6B16', name: '6B16', direction: 'up', startKm: 39.097908, endKm: 39.967878 },
    { id: '6B17', name: '6B17', direction: 'up', startKm: 39.977987, endKm: 42.207260 },
    { id: '6B18', name: '6B18', direction: 'up', startKm: 42.217721, endKm: 44.062895 },
    { id: '6B19', name: '6B19', direction: 'up', startKm: 44.073021, endKm: 47.287832 },
    { id: '6B20', name: '6B20', direction: 'up', startKm: 47.298140, endKm: 48.683124 },
    { id: '6B21', name: '6B21', direction: 'up', startKm: 48.693228, endKm: 51.633098 },
    { id: '6B22', name: '6B22', direction: 'up', startKm: 51.643197, endKm: 53.259229 },
    { id: '6B23', name: '6B23', direction: 'up', startKm: 53.269367, endKm: 53.472873 },
    { id: '6A8', name: '6A8', direction: 'down', startKm: 22.805533, endKm: 23.276663 },
    { id: '6A9', name: '6A9', direction: 'down', startKm: 23.290677, endKm: 25.664248 },
    { id: '6A10', name: '6A10', direction: 'down', startKm: 25.674340, endKm: 28.785258 },
    { id: '6A11', name: '6A11', direction: 'down', startKm: 28.795358, endKm: 29.942649 },
    { id: '6A12', name: '6A12', direction: 'down', startKm: 29.952749, endKm: 31.141273 },
    { id: '6A13', name: '6A13', direction: 'down', startKm: 31.151374, endKm: 34.690456 },
    { id: '6A14', name: '6A14', direction: 'down', startKm: 34.700570, endKm: 36.236355 },
    { id: '6A15', name: '6A15', direction: 'down', startKm: 36.246455, endKm: 39.279390 },
    { id: '6A16', name: '6A16', direction: 'down', startKm: 39.289494, endKm: 40.120777 },
    { id: '6A17', name: '6A17', direction: 'down', startKm: 40.130877, endKm: 42.427729 },
    { id: '6A18', name: '6A18', direction: 'down', startKm: 42.437837, endKm: 44.218100 },
    { id: '6A19', name: '6A19', direction: 'down', startKm: 44.228218, endKm: 47.496079 },
    { id: '6A20', name: '6A20', direction: 'down', startKm: 47.507535, endKm: 48.831976 },
    { id: '6A21', name: '6A21', direction: 'down', startKm: 48.842080, endKm: 51.802729 },
    { id: '6A22', name: '6A22', direction: 'down', startKm: 51.812829, endKm: 53.387878 },
    { id: '6A23', name: '6A23', direction: 'down', startKm: 53.397974, endKm: 53.472873 }
];

const lineSegments = [
    { from: 1, to: 2, curve: false },
    { from: 2, to: 3, curve: false },
    { from: 3, to: 4, curve: false },
    { from: 4, to: 5, curve: true },
    { from: 5, to: 6, curve: false },
    { from: 6, to: 7, curve: false },
    { from: 7, to: 8, curve: false },
    { from: 8, to: 9, curve: true },
    { from: 9, to: 10, curve: false },
    { from: 10, to: 11, curve: false },
    { from: 11, to: 12, curve: false },
    { from: 12, to: 13, curve: false },
    { from: 13, to: 14, curve: true },
    { from: 14, to: 15, curve: false },
    { from: 15, to: 16, curve: false },
    { from: 16, to: 17, curve: false },
    { from: 17, to: 18, curve: false },
    { from: 18, to: 19, curve: true },
    { from: 19, to: 20, curve: false },
    { from: 20, to: 21, curve: true }
];

const constructionTypes = {
    A1_LIVE: { 
        code: "A1", 
        name: "A1接触轨带电", 
        description: "动车点-接触轨带电",
        powerStatus: "live"
    },
    A1_DEAD: { 
        code: "A1", 
        name: "A1接触轨不带电", 
        description: "动车点-接触轨不带电",
        powerStatus: "dead"
    },
    A2_LIVE: { 
        code: "A2", 
        name: "A2接触轨带电", 
        description: "人工点-接触轨带电",
        powerStatus: "live"
    },
    A2_DEAD: { 
        code: "A2", 
        name: "A2接触轨不带电", 
        description: "人工点-接触轨不带电",
        powerStatus: "dead"
    },
    A3_LIVE: { 
        code: "A3", 
        name: "A3接触轨带电", 
        description: "人工点-接触轨带电",
        powerStatus: "live"
    },
    A3_DEAD: { 
        code: "A3", 
        name: "A3接触轨不带电", 
        description: "人工点-接触轨不带电",
        powerStatus: "dead"
    }
};

const protectionRules = {
    A1_LIVE_A1_DEAD: {
        description: "A1带电与A1停电之间",
        rules: [
            { side: "A1_LIVE", count: 1, powerStatus: "dead", minSize: "power_zone" }
        ]
    },
    A1_LIVE_A1_LIVE: {
        description: "两个A1带电之间",
        rules: [
            { side: "both", count: 1, powerStatus: "live", minSize: "station_interval" }
        ]
    },
    A1_DEAD_A1_DEAD: {
        description: "两个A1停电之间",
        rules: [
            { side: "both", count: 1, powerStatus: "dead", minSize: "station_interval" }
        ]
    },
    A1_DEAD_A2: {
        description: "A1停电与A2之间",
        rules: [
            { side: "A1_DEAD", count: 1, powerStatus: "dead", minSize: "station_interval" }
        ]
    },
    A1_LIVE_A2: {
        description: "A1带电与A2之间",
        rules: [
            { side: "A1_LIVE", count: 1, powerStatus: "dead", minSize: "power_zone" }
        ]
    },
    A1_LIVE_A3_LIVE: {
        description: "A1带电与A3带电之间",
        rules: [
            { side: "A1_LIVE", count: 1, powerStatus: "live", minSize: "station_interval" }
        ]
    },
    A1_LIVE_A3_DEAD: {
        description: "A1带电与A3停电之间",
        rules: [
            { side: "A1_LIVE", count: 1, powerStatus: "dead", minSize: "power_zone" }
        ]
    },
    A1_DEAD_A3_LIVE: {
        description: "A1停电与A3带电之间",
        rules: [
            { side: "A1_DEAD", count: 1, powerStatus: "dead", minSize: "power_zone" }
        ]
    },
    A1_DEAD_A3_DEAD: {
        description: "A1停电与A3停电之间",
        rules: [
            { side: "A1_DEAD", count: 1, powerStatus: "dead", minSize: "station_interval" }
        ]
    }
};

const redLightRules = {
    A1_LIVE: { needRedLight: true, position: "alignment_marker", offset: 3 },
    A1_DEAD: { needRedLight: true, position: "alignment_marker", offset: 3 },
    A2_LIVE: { needRedLight: false, position: "alignment_marker", offset: 3 },
    A2_DEAD: { needRedLight: false, position: "alignment_marker", offset: 3 },
    A3_LIVE: { needRedLight: false, position: "alignment_marker", offset: 3 },
    A3_DEAD: { needRedLight: false, position: "alignment_marker", offset: 3 }
};