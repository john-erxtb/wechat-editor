/**
 * 微信公众号编辑器 - 组件库
 * 包含各类可插入的排版组件，支持颜色自定义
 */

// 组件库定义
const COMPONENTS = {
    // ========== A. 段落卡片容器 ==========
    card: {
        name: '卡片容器',
        icon: '📦',
        items: [
            {
                id: 'card-white-shadow',
                name: '圆角白底卡片',
                icon: '◻️',
                description: '带阴影的白色圆角卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' }
                ],
                getHtml: (color, fields) => `<section style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 16px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.08); border: 1px solid #f0f0f0;">
<p style="margin: 0; line-height: 1.8;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`
            },
            {
                id: 'card-color-bg',
                name: '彩色背景卡片',
                icon: '🟧',
                description: '带彩色背景的卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'bgColor', label: '卡片底色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="background-color: ${bgColor}15; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid ${color};">
<p style="margin: 0; line-height: 1.8; color: #333333;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`;
                }
            },
            {
                id: 'card-dashed',
                name: '虚线边框卡片',
                icon: '〰️',
                description: '虚线边框的卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'borderColor', label: '边框颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const borderColor = fields.borderColor === 'inherit' ? color : fields.borderColor;
                    return `<section style="background-color: #ffffff; border-radius: 4px; padding: 20px; margin: 16px 0; border: 2px dashed ${borderColor};">
<p style="margin: 0; line-height: 1.8;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`;
                }
            },
            {
                id: 'card-left-bar',
                name: '左色条卡片',
                icon: '▌',
                description: '左侧有彩色竖条的卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'barColor', label: '色条颜色', type: 'color', default: 'inherit' },
                    { key: 'bgColor', label: '底色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const barColor = fields.barColor === 'inherit' ? color : fields.barColor;
                    const bgColor = fields.bgColor === 'inherit' ? '#ffffff' : fields.bgColor;
                    return `<section style="background-color: ${bgColor}; border-radius: 4px; padding: 20px; margin: 16px 0; border-left: 4px solid ${barColor}; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
<p style="margin: 0; line-height: 1.8;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`;
                }
            },
            {
                id: 'card-double-border',
                name: '双线边框卡片',
                icon: '⬜',
                description: '双线边框的卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'borderColor', label: '边框颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const borderColor = fields.borderColor === 'inherit' ? color : fields.borderColor;
                    return `<section style="background-color: #fafafa; padding: 20px; margin: 16px 0; border: 1px solid ${borderColor}; border-radius: 4px; box-shadow: inset 0 0 0 3px #ffffff, inset 0 0 0 4px ${borderColor};">
<p style="margin: 0; line-height: 1.8;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`;
                }
            },
            {
                id: 'card-header',
                name: '带标题栏卡片',
                icon: '📋',
                description: '顶部有标题栏的卡片',
                getFields: () => [
                    { key: 'title', label: '卡片标题', type: 'text', default: '卡片标题' },
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'headerBgColor', label: '标题栏颜色', type: 'color', default: 'inherit' },
                    { key: 'bodyBgColor', label: '内容区底色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const headerBgColor = fields.headerBgColor === 'inherit' ? color : fields.headerBgColor;
                    const bodyBgColor = fields.bodyBgColor === 'inherit' ? '#ffffff' : fields.bodyBgColor;
                    return `<section style="background-color: #ffffff; border-radius: 8px; margin: 16px 0; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
<section style="background-color: ${headerBgColor}; padding: 12px 20px;">
<p style="margin: 0; color: #ffffff; font-weight: 600; font-size: 16px;">${fields.title || '卡片标题'}</p>
</section>
<section style="background-color: ${bodyBgColor}; padding: 20px;">
<p style="margin: 0; line-height: 1.8;">${fields.content || '在这里输入卡片内容...'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'card-gradient',
                name: '渐变背景卡片',
                icon: '🌈',
                description: '渐变背景的卡片',
                getFields: () => [
                    { key: 'content', label: '卡片内容', type: 'textarea', default: '在这里输入卡片内容...' },
                    { key: 'gradientStart', label: '渐变起始色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const gradientColor = fields.gradientStart === 'inherit' ? color : fields.gradientStart;
                    return `<section style="background: linear-gradient(135deg, ${gradientColor}20 0%, ${gradientColor}05 100%); border-radius: 12px; padding: 24px; margin: 16px 0; border: 1px solid ${gradientColor}30;">
<p style="margin: 0; line-height: 1.8; color: #333333;">${fields.content || '在这里输入卡片内容...'}</p>
</section>`;
                }
            }
        ]
    },

    // ========== B. 标题装饰 ==========
    title: {
        name: '标题装饰',
        icon: '✏️',
        items: [
            {
                id: 'title-left-bar',
                name: '左竖线标题',
                icon: '▎',
                description: '左侧竖线装饰的标题',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'barColor', label: '竖线颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const barColor = fields.barColor === 'inherit' ? color : fields.barColor;
                    return `<section style="margin: 20px 0;">
<section style="display: inline-block; border-left: 4px solid ${barColor}; padding-left: 12px;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'title-bottom-line',
                name: '底边线标题',
                icon: '—',
                description: '底部彩色线条装饰',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'lineColor', label: '底边线颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
<section style="width: 60px; height: 3px; background-color: ${lineColor}; border-radius: 2px;"></section>
</section>`;
                }
            },
            {
                id: 'title-center-line',
                name: '居中装饰线标题',
                icon: '＝',
                description: '—— 标题 —— 格式',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'lineColor', label: '装饰线颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0; text-align: center;">
<section style="display: flex; align-items: center; justify-content: center; gap: 12px;">
<section style="width: 40px; height: 1px; background-color: ${lineColor};"></section>
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
<section style="width: 40px; height: 1px; background-color: ${lineColor};"></section>
</section>
</section>`;
                }
            },
            {
                id: 'title-number-circle',
                name: '编号圆圈标题',
                icon: '①',
                description: '带数字圆圈的标题',
                getFields: () => [
                    { key: 'number', label: '编号数字', type: 'text', default: '1' },
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'circleColor', label: '圆圈颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const circleColor = fields.circleColor === 'inherit' ? color : fields.circleColor;
                    return `<section style="margin: 20px 0; display: flex; align-items: center; gap: 12px;">
<section style="width: 36px; height: 36px; background-color: ${circleColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
<p style="margin: 0; color: #ffffff; font-weight: 700; font-size: 16px;">${fields.number || '1'}</p>
</section>
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-icon',
                name: '带图标标题',
                icon: '◆',
                description: '带装饰符号的标题',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' }
                ],
                getHtml: (color, fields) => `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;"><span style="color: ${color}; margin-right: 8px;">◆</span>${fields.title || '标题文字'}</p>
</section>`
            },
            {
                id: 'title-bg-color',
                name: '背景色标题',
                icon: '🖌',
                description: '带背景色的标题',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '背景色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4; background-color: ${bgColor}; padding: 10px 16px; border-radius: 4px; display: inline-block;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-double-line',
                name: '双横线标题',
                icon: '≡',
                description: '上下双线夹标题',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'lineColor', label: '横线颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0; text-align: center;">
<section style="height: 1px; background-color: ${lineColor}; margin-bottom: 12px;"></section>
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4; padding: 0 20px; display: inline-block;">${fields.title || '标题文字'}</p>
<section style="height: 1px; background-color: ${lineColor}; margin-top: 12px;"></section>
</section>`;
                }
            },
            {
                id: 'title-gradient',
                name: '渐变底色标题',
                icon: '🌅',
                description: '渐变背景标题',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'gradientStart', label: '渐变起始色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const gradientColor = fields.gradientStart === 'inherit' ? color : fields.gradientStart;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4; background: linear-gradient(90deg, ${gradientColor}, transparent); padding: 10px 20px; border-radius: 4px;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-left-right',
                name: '左右分布标题',
                icon: '⇿',
                description: '标题在左，横线在右',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'lineColor', label: '横线颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 20px 0; display: flex; align-items: center;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4; flex-shrink: 0;">${fields.title || '标题文字'}</p>
<section style="flex: 1; height: 2px; background: linear-gradient(to right, ${lineColor}, transparent); margin-left: 16px;"></section>
</section>`;
                }
            },
            // ========== 不规则底色标题组件 ==========
            {
                id: 'title-highlighter',
                name: '荧光笔标题',
                icon: '🖍',
                description: '半透明荧光笔效果，像用荧光笔划过',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '荧光笔颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.5; background-color: ${bgColor}40; padding: 6px 14px; border-radius: 4px; display: inline;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-brush-round',
                name: '不规则圆角色块',
                icon: '🔲',
                description: '四个角半径差异大的有机不规则色块',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '色块颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4; background-color: ${bgColor}; padding: 12px 18px; border-radius: 4px 28px 6px 24px; display: inline-block;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-offset-bg',
                name: '偏移底色标题',
                icon: '🎨',
                description: '色块偏移的文字叠放效果，手绘感',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '底色色块颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0;">
<section style="background-color: ${bgColor}; padding: 10px 16px; border-radius: 4px; display: inline-block; margin-left: 6px; margin-top: 4px;"></section>
<section style="margin-top: -44px; margin-left: 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'title-brush-dot',
                name: '色块+圆点标题',
                icon: '⭕',
                description: '不规则色块配右上角装饰圆点',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '色块颜色', type: 'color', default: 'inherit' },
                    { key: 'dotColor', label: '圆点颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    const dotColor = fields.dotColor === 'inherit' ? '#FFD700' : fields.dotColor;
                    return `<section style="margin: 20px 0; position: relative; display: inline-block;">
<section style="background-color: ${bgColor}; padding: 12px 24px 12px 14px; border-radius: 4px 6px 6px 4px; display: inline-block;"></section>
<section style="position: absolute; top: 8px; right: 8px; width: 10px; height: 10px; background-color: ${dotColor}; border-radius: 50%;"></section>
<section style="margin-top: -44px; margin-left: 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'title-brush-gradient',
                name: '渐变笔刷标题',
                icon: '🌈',
                description: '渐变底色模拟笔刷浓淡变化',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'gradientStart', label: '渐变起始色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const gradientColor = fields.gradientStart === 'inherit' ? color : fields.gradientStart;
                    return `<section style="margin: 20px 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4; background: linear-gradient(135deg, ${gradientColor} 0%, ${gradientColor}60 100%); padding: 10px 16px; border-radius: 4px 8px 12px 6px;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-sticker',
                name: '倾斜贴纸标题',
                icon: '📌',
                description: '微微倾斜的便利贴风格',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '贴纸颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0; transform: rotate(-1deg); display: inline-block;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4; background-color: ${bgColor}; padding: 12px 20px; border-radius: 2px;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-multi-bar',
                name: '多层色条标题',
                icon: '▤',
                description: '多层色条叠加，手绘层次感',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '色条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0;">
<section style="background-color: ${bgColor}60; padding: 8px 14px; border-radius: 4px; margin-left: 2px; margin-top: 2px; display: inline-block;"></section>
<section style="background-color: ${bgColor}; padding: 8px 14px; border-radius: 4px; display: inline-block; margin-left: -52px; margin-top: 0;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'title-slant-tag',
                name: '斜角标签标题',
                icon: '🏷',
                description: '一侧斜切角的手撕标签风格',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '标签颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0; display: inline-flex;">
<section style="background-color: ${bgColor}; padding: 10px 16px; border-radius: 0 12px 12px 0; border-left: 16px solid transparent; box-shadow: -8px 0 0 0 ${bgColor};">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>
</section>`;
                }
            },
            {
                id: 'title-wide-band',
                name: '宽色带标题',
                icon: '➖',
                description: '宽色带横贯，文字居中',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'bgColor', label: '色带颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const bgColor = fields.bgColor === 'inherit' ? color : fields.bgColor;
                    return `<section style="margin: 20px 0; text-align: center;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4; background-color: ${bgColor}30; padding: 14px 40px; border-radius: 6px 20px 20px 6px; display: inline-block;">${fields.title || '标题文字'}</p>
</section>`;
                }
            },
            {
                id: 'title-sketch-frame',
                name: '手绘框标题',
                icon: '✒',
                description: '模拟手绘边框线的标题框',
                getFields: () => [
                    { key: 'title', label: '标题文字', type: 'text', default: '标题文字' },
                    { key: 'borderColor', label: '边框颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const borderColor = fields.borderColor === 'inherit' ? color : fields.borderColor;
                    return `<section style="margin: 20px 0; padding: 12px 16px; border: 2px solid ${borderColor}; border-radius: 8px; border-top-width: 3px; border-left-style: dashed; opacity: 0.85;">
<p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333; line-height: 1.4;">${fields.title || '标题文字'}</p>
</section>`;
                }
            }
        ]
    },

    // ========== C. 分割线 ==========
    divider: {
        name: '分割线',
        icon: '➖',
        items: [
            {
                id: 'divider-solid',
                name: '细实线',
                icon: '─',
                description: '普通细实线',
                getFields: () => [
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0;">
<section style="height: 1px; background-color: ${lineColor}; opacity: 0.5;"></section>
</section>`;
                }
            },
            {
                id: 'divider-dashed',
                name: '虚线',
                icon: '┅',
                description: '虚线分割',
                getFields: () => [
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0;">
<section style="height: 1px; background: repeating-linear-gradient(to right, ${lineColor} 0px, ${lineColor} 6px, transparent 6px, transparent 10px);"></section>
</section>`;
                }
            },
            {
                id: 'divider-gradient',
                name: '渐变线',
                icon: '梯度',
                description: '透明-彩色-透明渐变线',
                getFields: () => [
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0;">
<section style="height: 2px; background: linear-gradient(to right, transparent, ${lineColor}, transparent); border-radius: 1px;"></section>
</section>`;
                }
            },
            {
                id: 'divider-icon',
                name: '带图标分割线',
                icon: '◆',
                description: '中间带装饰符号',
                getFields: () => [
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0; text-align: center;">
<section style="display: flex; align-items: center; justify-content: center; gap: 16px;">
<section style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, ${lineColor}50);"></section>
<p style="margin: 0; color: ${lineColor}; font-size: 14px;">◆</p>
<section style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, ${lineColor}50);"></section>
</section>
</section>`;
                }
            },
            {
                id: 'divider-text',
                name: '带文字分割线',
                icon: '文字',
                description: '—— 文字 —— 格式',
                getFields: () => [
                    { key: 'text', label: '分割线文字', type: 'text', default: '分割文字' },
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0; text-align: center;">
<section style="display: flex; align-items: center; justify-content: center; gap: 12px;">
<section style="flex: 1; height: 1px; background-color: ${lineColor}; opacity: 0.3;"></section>
<p style="margin: 0; color: ${lineColor}; font-size: 14px; opacity: 0.7;">${fields.text || '分割文字'}</p>
<section style="flex: 1; height: 1px; background-color: ${lineColor}; opacity: 0.3;"></section>
</section>
</section>`;
                }
            },
            {
                id: 'divider-double',
                name: '双线分割线',
                icon: '＝',
                description: '双线分割',
                getFields: () => [
                    { key: 'lineColor', label: '线条颜色', type: 'color', default: 'inherit' }
                ],
                getHtml: (color, fields) => {
                    const lineColor = fields.lineColor === 'inherit' ? color : fields.lineColor;
                    return `<section style="margin: 24px 0;">
<section style="height: 1px; background-color: ${lineColor}; opacity: 0.8; margin-bottom: 4px;"></section>
<section style="height: 1px; background-color: ${lineColor}; opacity: 0.4;"></section>
</section>`;
                }
            },
            {
                id: 'divider-dot',
                name: '点状分割线',
                icon: '•',
                description: '点状分割线',
                getFields: () => [],
                getHtml: (color) => `<section style="margin: 24px 0; text-align: center; line-height: 1;">
<p style="margin: 0; color: ${color}; opacity: 0.4; letter-spacing: 12px; font-size: 10px; display: inline-block;">• • • • • • • • •</p>
</section>`
            }
        ]
    },

    // ========== D. 引用/提示框 ==========
    quote: {
        name: '引用/提示',
        icon: '💬',
        items: [
            {
                id: 'quote-left-bar',
                name: '左色条引用',
                icon: '▎',
                description: '经典左色条引用样式',
                getFields: () => [
                    { key: 'content', label: '引用内容', type: 'textarea', default: '在这里输入引用内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #f9f9f9; border-left: 4px solid ${color};">
<p style="margin: 0; line-height: 1.8; color: #666666; font-style: italic;">${fields.content || '在这里输入引用内容...'}</p>
</section>`
            },
            {
                id: 'quote-quotation',
                name: '双引号引用',
                icon: '❝',
                description: '带大引号装饰',
                getFields: () => [
                    { key: 'content', label: '引用内容', type: 'textarea', default: '在这里输入引用内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 20px 24px; background-color: #ffffff; position: relative;">
<p style="margin: 0 0 0 24px; font-size: 28px; color: ${color}; line-height: 1; position: absolute; top: 12px; left: 12px; font-family: serif;">❝</p>
<p style="margin: 0; line-height: 1.8; color: #333333; padding-left: 20px;">${fields.content || '在这里输入引用内容...'}</p>
</section>`
            },
            {
                id: 'quote-rounded',
                name: '圆角引用框',
                icon: '◝',
                description: '圆角边框引用框',
                getFields: () => [
                    { key: 'content', label: '引用内容', type: 'textarea', default: '在这里输入引用内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #ffffff; border: 2px solid ${color}; border-radius: 8px;">
<p style="margin: 0; line-height: 1.8; color: #333333;">${fields.content || '在这里输入引用内容...'}</p>
</section>`
            },
            {
                id: 'quote-notice',
                name: '提示框-注意',
                icon: '⚠️',
                description: '黄色注意提示框',
                getFields: () => [
                    { key: 'content', label: '提示内容', type: 'textarea', default: '在这里输入提示内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #fff8e1; border-radius: 8px; border-left: 4px solid #ffc107;">
<section style="display: flex; align-items: flex-start; gap: 12px;">
<section style="font-size: 20px; flex-shrink: 0;">⚠️</section>
<section>
<p style="margin: 0 0 8px 0; font-weight: 600; color: #f57c00; font-size: 16px;">注意</p>
<p style="margin: 0; line-height: 1.7; color: #333333;">${fields.content || '在这里输入提示内容...'}</p>
</section>
</section>
</section>`
            },
            {
                id: 'quote-info',
                name: '提示框-提示',
                icon: '💡',
                description: '蓝色信息提示框',
                getFields: () => [
                    { key: 'content', label: '提示内容', type: 'textarea', default: '在这里输入提示内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
<section style="display: flex; align-items: flex-start; gap: 12px;">
<section style="font-size: 20px; flex-shrink: 0;">💡</section>
<section>
<p style="margin: 0 0 8px 0; font-weight: 600; color: #1976d2; font-size: 16px;">提示</p>
<p style="margin: 0; line-height: 1.7; color: #333333;">${fields.content || '在这里输入提示内容...'}</p>
</section>
</section>
</section>`
            },
            {
                id: 'quote-warning',
                name: '提示框-警告',
                icon: '🚫',
                description: '红色警告提示框',
                getFields: () => [
                    { key: 'content', label: '警告内容', type: 'textarea', default: '在这里输入警告内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #ffebee; border-radius: 8px; border-left: 4px solid #f44336;">
<section style="display: flex; align-items: flex-start; gap: 12px;">
<section style="font-size: 20px; flex-shrink: 0;">🚫</section>
<section>
<p style="margin: 0 0 8px 0; font-weight: 600; color: #d32f2f; font-size: 16px;">警告</p>
<p style="margin: 0; line-height: 1.7; color: #333333;">${fields.content || '在这里输入警告内容...'}</p>
</section>
</section>
</section>`
            },
            {
                id: 'quote-success',
                name: '提示框-成功',
                icon: '✅',
                description: '绿色成功提示框',
                getFields: () => [
                    { key: 'content', label: '成功内容', type: 'textarea', default: '在这里输入成功内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 16px 20px; background-color: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;">
<section style="display: flex; align-items: flex-start; gap: 12px;">
<section style="font-size: 20px; flex-shrink: 0;">✅</section>
<section>
<p style="margin: 0 0 8px 0; font-weight: 600; color: #388e3c; font-size: 16px;">成功</p>
<p style="margin: 0; line-height: 1.7; color: #333333;">${fields.content || '在这里输入成功内容...'}</p>
</section>
</section>
</section>`
            },
            {
                id: 'quote-icon',
                name: '带图标引用框',
                icon: '❖',
                description: '带装饰图标的引用',
                getFields: () => [
                    { key: 'content', label: '引用内容', type: 'textarea', default: '在这里输入引用内容...' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; padding: 20px; background: linear-gradient(135deg, ${color}10 0%, #ffffff 100%); border-radius: 8px; border: 1px solid ${color}30;">
<p style="margin: 0 0 12px 0; color: ${color}; font-size: 24px; text-align: center;">❖</p>
<p style="margin: 0; line-height: 1.8; color: #333333; text-align: center;">${fields.content || '在这里输入引用内容...'}</p>
</section>`
            }
        ]
    },

    // ========== F. 其他元素 ==========
    other: {
        name: '其他元素',
        icon: '✨',
        items: [
            {
                id: 'other-center-text',
                name: '居中文字',
                icon: '居中',
                description: '带装饰的居中文字',
                getFields: () => [
                    { key: 'content', label: '文字内容', type: 'textarea', default: '居中显示的文字内容' }
                ],
                getHtml: (color, fields) => `<section style="margin: 20px 0; text-align: center;">
<p style="margin: 0; font-size: 16px; color: #333333; line-height: 1.8; letter-spacing: 2px;">${fields.content || '居中显示的文字内容'}</p>
</section>`
            },
            {
                id: 'other-author',
                name: '作者署名区',
                icon: '✍',
                description: '文章署名区域',
                getFields: () => [
                    { key: 'author', label: '作者名', type: 'text', default: '作者名' },
                    { key: 'date', label: '日期', type: 'text', default: 'XXXX年XX月XX日' }
                ],
                getHtml: (color, fields) => `<section style="margin: 24px 0; text-align: right; padding: 16px 0; border-top: 1px solid #eeeeee;">
<section style="display: inline-block;">
<p style="margin: 0 0 4px 0; font-size: 14px; color: #999999;">文 / ${fields.author || '作者名'}</p>
<p style="margin: 0; font-size: 12px; color: #bbbbbb;">${fields.date || 'XXXX年XX月XX日'}</p>
</section>
</section>`
            },
            {
                id: 'other-qrcode',
                name: '插入图片',
                icon: '🖼',
                description: '插入一张图片（输入图片URL）',
                getFields: () => [
                    { key: 'imageUrl', label: '图片地址（URL）', type: 'text', default: '' }
                ],
                getHtml: (color, fields) => {
                    const url = (fields.imageUrl || '').trim();
                    if (url) {
                        return `<section style="margin: 16px 0; text-align: center;"><img src="${url}" style="max-width: 100%; height: auto; border-radius: 4px;" alt="图片"></section>`;
                    }
                    return `<section style="margin: 24px auto; text-align: center; max-width: 200px;">
<section style="width: 160px; height: 160px; background-color: #f5f5f5; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
<p style="margin: 0; color: #999; font-size: 14px;">请输入图片地址</p>
</section>
</section>`;
                }
            },
            {
                id: 'other-sticker',
                name: '表情包/贴纸区',
                icon: '😊',
                description: '装饰性表情展示',
                getFields: () => [
                    { key: 'emoji', label: '表情符号（可输入多个）', type: 'text', default: '🎉 ✨ 👍 💪' }
                ],
                getHtml: (color, fields) => `<section style="margin: 20px 0; text-align: center;">
<p style="margin: 0; font-size: 48px; line-height: 1;">${fields.emoji || '🎉 ✨ 👍 💪'}</p>
</section>`
            },
            {
                id: 'other-highlight',
                name: '高亮文字块',
                icon: '🖍',
                description: '荧光笔效果文字',
                getFields: () => [
                    { key: 'normalText', label: '普通文字', type: 'text', default: '这是一段普通文字。' },
                    { key: 'highlightText', label: '高亮文字', type: 'text', default: '这里是高亮显示的文字' },
                    { key: 'afterText', label: '高亮后文字', type: 'text', default: '，继续普通文字。' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0;">
<p style="margin: 0; font-size: 16px; line-height: 2; color: #333333;">
${fields.normalText || '这是一段普通文字。'}<span style="background: linear-gradient(transparent 60%, ${color}60 60%); padding: 0 4px;">${fields.highlightText || '这里是高亮显示的文字'}</span>${fields.afterText || '，继续普通文字。'}
</p>
</section>`
            },
            {
                id: 'other-callout',
                name: '呼出气泡',
                icon: '💭',
                description: '对话气泡样式',
                getFields: () => [
                    { key: 'leftMsg', label: '左侧消息', type: 'text', default: '这是左边发出的消息气泡' },
                    { key: 'rightMsg', label: '右侧消息', type: 'text', default: '这是右边发出的回复气泡' }
                ],
                getHtml: (color, fields) => `<section style="margin: 16px 0; display: flex; flex-direction: column; gap: 12px;">
<section style="align-self: flex-start; max-width: 80%; background-color: #f0f2f5; border-radius: 12px; padding: 12px 16px; position: relative;">
<p style="margin: 0; font-size: 15px; line-height: 1.6; color: #333333;">${fields.leftMsg || '这是左边发出的消息气泡'}</p>
</section>
<section style="align-self: flex-end; max-width: 80%; background-color: ${color}; border-radius: 12px; padding: 12px 16px;">
<p style="margin: 0; font-size: 15px; line-height: 1.6; color: #ffffff;">${fields.rightMsg || '这是右边发出的回复气泡'}</p>
</section>
</section>`
            }
        ]
    }
};

// 预设颜色数组
const PRESET_COLORS = [
    '#1a73e8', // 蓝色
    '#ea4335', // 红色
    '#fbbc04', // 黄色
    '#34a853', // 绿色
    '#ff6d01', // 橙色
    '#9334e6', // 紫色
    '#e91e63', // 粉色
    '#00bcd4', // 青色
    '#607d8b', // 蓝灰色
    '#795548', // 棕色
    '#333333', // 深灰
    '#666666'  // 中灰
];

// 获取当前模板的主色调
function getCurrentThemeColor() {
    if (typeof TEMPLATES !== 'undefined' && TEMPLATES[currentTemplate]) {
        return TEMPLATES[currentTemplate].colors.primary;
    }
    return '#1a73e8'; // 默认蓝色
}

// 获取组件分类列表
function getComponentCategories() {
    return Object.entries(COMPONENTS).map(([key, category]) => ({
        id: key,
        name: category.name,
        icon: category.icon,
        count: category.items.length
    }));
}

// 获取指定分类的所有组件
function getComponentsByCategory(categoryId) {
    const category = COMPONENTS[categoryId];
    if (!category) return [];
    return category.items;
}

// 生成组件预览HTML
function getComponentPreview(item, color, fields = {}) {
    try {
        // 使用用户输入的fields生成预览，如果没有则使用默认值
        const defaultFields = {};
        if (item.getFields) {
            item.getFields().forEach(field => {
                defaultFields[field.key] = field.default;
            });
        }
        // 合并默认值和用户输入
        const mergedFields = { ...defaultFields, ...fields };
        return item.getHtml(color, mergedFields);
    } catch (e) {
        console.error('组件渲染失败:', e);
        return '<p>组件渲染失败</p>';
    }
}

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { COMPONENTS, PRESET_COLORS, getCurrentThemeColor, getComponentCategories, getComponentsByCategory, getComponentPreview };
}
