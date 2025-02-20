export const TOOL_NAME_MAPPING = {
    'drill': '드릴',
    'hammer': '해머',
    'wrench': '렌치',
    'spanner': '스패너',
    'cable': '절단기',
    'screw': '스크류 드라이버',
    'plier': '플라이어',
    'screwdriver': '드라이버',
    'nipper': '니퍼',
    'saw': '톱',
    'hexKey': '육각렌치',
    'level': '수평기',
    'tapeMeasure': '테이프 메저',
    'cutter': '절단기',
    'rubberHammer': '고무망치',
    'glueGun': '글루건',
    'solderingIron': '인두기'
};

// 한글 -> 영문 매핑을 위한 역방향 맵 생성
export const REVERSE_TOOL_NAME_MAPPING = Object.entries(TOOL_NAME_MAPPING)
    .reduce((acc, [eng, kor]) => ({
        ...acc,
        [kor]: eng
    }), {});

// 한글 공구 이름을 영문으로 변환
export const getEnglishToolName = (koreanName) => {
    return REVERSE_TOOL_NAME_MAPPING[koreanName] || koreanName;
};

// 공구 목록의 이름을 영문으로 변환
export const convertToolListToEnglish = (tools) => {
    return tools.map(tool => ({
        ...tool,
        name: getEnglishToolName(tool.name)
    }));
};

/**
 * 영문 공구 이름을 한글로 변환
 * @param {string} englishName - 영문 공구 이름
 * @returns {string} 한글 공구 이름 또는 원본 이름
 */
export const getKoreanToolName = (englishName) => {
    return TOOL_NAME_MAPPING[englishName] || englishName;
};

/**
 * 공구 객체의 이름을 한글로 변환
 * @param {Object} tool - 공구 객체
 * @returns {Object} 한글 이름이 적용된 공구 객체
 */
export const convertToolNameToKorean = (tool) => {
    return {
        ...tool,
        name: getKoreanToolName(tool.name)
    };
};

/**
 * 공구 목록의 이름을 한글로 변환
 * @param {Array} tools - 공구 객체 배열
 * @returns {Array} 한글 이름이 적용된 공구 객체 배열
 */
export const convertToolListToKorean = (tools) => {
    return tools.map(convertToolNameToKorean);
};