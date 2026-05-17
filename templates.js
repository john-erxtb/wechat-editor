/**
 * 微信公众号编辑器 - 模板定义
 * 定义5套不同风格的模板，每套包含标题、正文、引用、分割线、列表等样式
 */

const TEMPLATES = {
    /**
     * 模板1：经典蓝 - 商务专业风格
     */
    classicBlue: {
        name: '经典蓝',
        description: '商务专业风格',
        colors: {
            primary: '#1a73e8',
            secondary: '#4285f4',
            accent: '#e8f0fe',
            text: '#202124',
            textLight: '#5f6368',
            background: '#ffffff',
            border: '#dadce0'
        },
        styles: {
            // 内容容器
            container: `
                max-width: 677px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                color: #202124;
                line-height: 1.8;
                font-size: 16px;
            `,
            // 标题样式
            h1: `
                font-size: 28px;
                font-weight: 700;
                color: #1a73e8;
                margin: 20px 0 16px;
                padding-bottom: 12px;
                border-bottom: 2px solid #1a73e8;
                line-height: 1.4;
            `,
            h2: `
                font-size: 22px;
                font-weight: 600;
                color: #1a73e8;
                margin: 18px 0 12px;
                line-height: 1.4;
            `,
            h3: `
                font-size: 18px;
                font-weight: 600;
                color: #4285f4;
                margin: 16px 0 10px;
                line-height: 1.5;
            `,
            // 段落样式
            p: `
                margin: 12px 0;
                line-height: 1.8;
                text-align: justify;
            `,
            // 引用样式
            blockquote: `
                margin: 16px 0;
                padding: 16px 20px;
                background-color: #e8f0fe;
                border-left: 4px solid #1a73e8;
                color: #202124;
                border-radius: 0 8px 8px 0;
            `,
            // 分割线
            hr: `
                border: none;
                height: 1px;
                background: linear-gradient(to right, transparent, #dadce0, transparent);
                margin: 24px 0;
            `,
            // 列表样式
            ul: `
                margin: 12px 0;
                padding-left: 24px;
                list-style-type: disc;
            `,
            ol: `
                margin: 12px 0;
                padding-left: 24px;
                list-style-type: decimal;
            `,
            li: `
                margin: 6px 0;
                line-height: 1.8;
            `,
            // 链接样式
            a: `
                color: #1a73e8;
                text-decoration: none;
                border-bottom: 1px solid #1a73e8;
            `,
            // 强调样式
            strong: `
                font-weight: 600;
                color: #1a73e8;
            `,
            // 图片样式
            img: `
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                margin: 16px 0;
            `
        }
    },

    /**
     * 模板2：素雅绿 - 清新文艺风格
     */
    elegantGreen: {
        name: '素雅绿',
        description: '清新文艺风格',
        colors: {
            primary: '#2e7d32',
            secondary: '#4caf50',
            accent: '#e8f5e9',
            text: '#263238',
            textLight: '#546e7a',
            background: '#fafdf6',
            border: '#c8e6c9'
        },
        styles: {
            container: `
                max-width: 677px;
                margin: 0 auto;
                padding: 20px;
                font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", sans-serif;
                color: #263238;
                line-height: 2;
                font-size: 16px;
            `,
            h1: `
                font-size: 26px;
                font-weight: 600;
                color: #2e7d32;
                margin: 24px 0 18px;
                padding-left: 16px;
                border-left: 4px solid #4caf50;
                line-height: 1.5;
            `,
            h2: `
                font-size: 20px;
                font-weight: 600;
                color: #388e3c;
                margin: 20px 0 14px;
                line-height: 1.5;
            `,
            h3: `
                font-size: 17px;
                font-weight: 500;
                color: #43a047;
                margin: 16px 0 10px;
                line-height: 1.6;
            `,
            p: `
                margin: 14px 0;
                line-height: 2;
                text-indent: 2em;
            `,
            blockquote: `
                margin: 18px 0;
                padding: 14px 18px;
                background-color: #e8f5e9;
                border-left: 3px dashed #4caf50;
                color: #2e7d32;
                font-style: italic;
                border-radius: 4px;
            `,
            hr: `
                border: none;
                height: 2px;
                background: repeating-linear-gradient(
                    90deg,
                    #c8e6c9,
                    #c8e6c9 8px,
                    transparent 8px,
                    transparent 12px
                );
                margin: 28px 0;
            `,
            ul: `
                margin: 14px 0;
                padding-left: 26px;
                list-style-type: none;
            `,
            ol: `
                margin: 14px 0;
                padding-left: 26px;
                list-style-type: cjk-ideographic;
            `,
            li: `
                margin: 8px 0;
                line-height: 2;
                position: relative;
            `,
            a: `
                color: #2e7d32;
                text-decoration: none;
                background: linear-gradient(transparent 60%, #c8e6c9 60%);
            `,
            strong: `
                font-weight: 600;
                color: #2e7d32;
            `,
            img: `
                max-width: 100%;
                height: auto;
                border-radius: 2px;
                margin: 18px 0;
                border: 1px solid #c8e6c9;
            `
        }
    },

    /**
     * 模板3：暖橘 - 温暖活力风格
     */
    warmOrange: {
        name: '暖橘',
        description: '温暖活力风格',
        colors: {
            primary: '#e65100',
            secondary: '#ff6d00',
            accent: '#fff3e0',
            text: '#3e2723',
            textLight: '#5d4037',
            background: '#fffbf5',
            border: '#ffcc80'
        },
        styles: {
            container: `
                max-width: 677px;
                margin: 0 auto;
                padding: 20px;
                font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
                color: #3e2723;
                line-height: 1.9;
                font-size: 16px;
            `,
            h1: `
                font-size: 28px;
                font-weight: 700;
                color: #e65100;
                margin: 22px 0 16px;
                text-align: center;
                line-height: 1.4;
                text-shadow: 1px 1px 2px rgba(230, 81, 0, 0.2);
            `,
            h2: `
                font-size: 21px;
                font-weight: 600;
                color: #f57c00;
                margin: 20px 0 12px;
                padding: 8px 0;
                border-top: 2px dashed #ffcc80;
                border-bottom: 2px dashed #ffcc80;
                line-height: 1.5;
            `,
            h3: `
                font-size: 17px;
                font-weight: 600;
                color: #ff6d00;
                margin: 16px 0 10px;
                line-height: 1.6;
            `,
            p: `
                margin: 12px 0;
                line-height: 1.9;
                text-align: justify;
            `,
            blockquote: `
                margin: 18px 20px;
                padding: 16px 20px;
                background-color: #fff3e0;
                border-left: 5px solid #ff6d00;
                color: #e65100;
                font-size: 15px;
                border-radius: 0 12px 12px 0;
                box-shadow: 2px 2px 8px rgba(255, 109, 0, 0.15);
            `,
            hr: `
                border: none;
                height: 3px;
                background: linear-gradient(to right, #ffcc80, #ff6d00, #ffcc80);
                border-radius: 3px;
                margin: 28px 40px;
            `,
            ul: `
                margin: 14px 0;
                padding-left: 24px;
                list-style-type: square;
            `,
            ol: `
                margin: 14px 0;
                padding-left: 24px;
                list-style-type: decimal;
            `,
            li: `
                margin: 8px 0;
                line-height: 1.8;
                color: #5d4037;
            `,
            a: `
                color: #e65100;
                text-decoration: none;
                font-weight: 500;
            `,
            strong: `
                font-weight: 700;
                color: #e65100;
            `,
            img: `
                max-width: 100%;
                height: auto;
                border-radius: 12px;
                margin: 18px 0;
                box-shadow: 0 4px 12px rgba(230, 81, 0, 0.2);
            `
        }
    },

    /**
     * 模板4：墨韵 - 中国风水墨系
     */
    inkStyle: {
        name: '墨韵',
        description: '中国风水墨系',
        colors: {
            primary: '#212121',
            secondary: '#424242',
            accent: '#faf8f5',
            text: '#212121',
            textLight: '#616161',
            background: '#faf8f5',
            border: '#bdbdbd'
        },
        styles: {
            container: `
                max-width: 677px;
                margin: 0 auto;
                padding: 24px;
                font-family: "Noto Serif SC", "Songti SC", "SimSun", serif;
                color: #212121;
                line-height: 2;
                font-size: 17px;
                background: linear-gradient(180deg, #faf8f5 0%, #f5f2ed 100%);
            `,
            h1: `
                font-size: 30px;
                font-weight: 700;
                color: #212121;
                margin: 28px 0 20px;
                text-align: center;
                letter-spacing: 8px;
                line-height: 1.5;
                position: relative;
            `,
            h2: `
                font-size: 22px;
                font-weight: 600;
                color: #424242;
                margin: 24px 0 16px;
                text-align: center;
                letter-spacing: 4px;
                line-height: 1.6;
            `,
            h3: `
                font-size: 18px;
                font-weight: 500;
                color: #616161;
                margin: 18px 0 12px;
                letter-spacing: 2px;
                line-height: 1.7;
            `,
            p: `
                margin: 16px 0;
                line-height: 2.2;
                text-align: justify;
                text-indent: 2em;
            `,
            blockquote: `
                margin: 22px 30px;
                padding: 18px 24px;
                background-color: rgba(33, 33, 33, 0.03);
                border: 1px solid #e0e0e0;
                border-left: 3px solid #212121;
                color: #424242;
                font-style: normal;
                position: relative;
            `,
            hr: `
                border: none;
                height: 1px;
                background: #bdbdbd;
                margin: 32px 60px;
                position: relative;
            `,
            ul: `
                margin: 16px 0;
                padding-left: 32px;
                list-style-type: none;
            `,
            ol: `
                margin: 16px 0;
                padding-left: 32px;
                list-style-type: none;
            `,
            li: `
                margin: 10px 0;
                line-height: 2;
                text-indent: 2em;
            `,
            a: `
                color: #424242;
                text-decoration: none;
                border-bottom: 1px solid #bdbdbd;
            `,
            strong: `
                font-weight: 700;
                color: #212121;
            `,
            img: `
                max-width: 100%;
                height: auto;
                border-radius: 2px;
                margin: 20px 0;
                border: 1px solid #e0e0e0;
            `
        }
    },

    /**
     * 模板5：极简灰 - 简约现代风格
     */
    minimalGray: {
        name: '极简灰',
        description: '简约现代风格',
        colors: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#f5f5f5',
            text: '#333333',
            textLight: '#757575',
            background: '#ffffff',
            border: '#e0e0e0'
        },
        styles: {
            container: `
                max-width: 677px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
                color: #333333;
                line-height: 1.8;
                font-size: 16px;
            `,
            h1: `
                font-size: 32px;
                font-weight: 700;
                color: #000000;
                margin: 24px 0 20px;
                line-height: 1.3;
                letter-spacing: -0.5px;
            `,
            h2: `
                font-size: 24px;
                font-weight: 600;
                color: #000000;
                margin: 20px 0 14px;
                line-height: 1.4;
                letter-spacing: -0.3px;
            `,
            h3: `
                font-size: 18px;
                font-weight: 600;
                color: #333333;
                margin: 18px 0 12px;
                line-height: 1.5;
            `,
            p: `
                margin: 14px 0;
                line-height: 1.8;
            `,
            blockquote: `
                margin: 20px 0;
                padding: 0;
                border-left: 3px solid #000000;
                color: #757575;
                padding-left: 20px;
                font-size: 15px;
                line-height: 1.7;
            `,
            hr: `
                border: none;
                height: 1px;
                background: #e0e0e0;
                margin: 30px 0;
            `,
            ul: `
                margin: 14px 0;
                padding-left: 22px;
                list-style-type: none;
            `,
            ol: `
                margin: 14px 0;
                padding-left: 22px;
                list-style-type: none;
            `,
            li: `
                margin: 8px 0;
                line-height: 1.8;
                position: relative;
                padding-left: 16px;
            `,
            a: `
                color: #000000;
                text-decoration: none;
                font-weight: 500;
            `,
            strong: `
                font-weight: 600;
            `,
            img: `
                max-width: 100%;
                height: auto;
                margin: 18px 0;
            `
        }
    }
};

/**
 * 获取模板列表（用于UI显示）
 * @returns {Array} 模板数组
 */
function getTemplateList() {
    return Object.entries(TEMPLATES).map(([key, template]) => ({
        id: key,
        name: template.name,
        description: template.description,
        colors: template.colors
    }));
}

/**
 * 获取指定模板的完整样式
 * @param {string} templateId - 模板ID
 * @returns {Object|null} 模板样式对象
 */
function getTemplateStyles(templateId) {
    const template = TEMPLATES[templateId];
    if (!template) return null;
    return template.styles;
}

/**
 * 获取模板的CSS字符串（用于预览）
 * @param {string} templateId - 模板ID
 * @returns {string} CSS样式字符串
 */
function getTemplateCSS(templateId) {
    const styles = getTemplateStyles(templateId);
    if (!styles) return '';

    return `
        .preview-content h1 { ${styles.h1} }
        .preview-content h2 { ${styles.h2} }
        .preview-content h3 { ${styles.h3} }
        .preview-content p { ${styles.p} }
        .preview-content blockquote { ${styles.blockquote} }
        .preview-content hr { ${styles.hr} }
        .preview-content ul { ${styles.ul} }
        .preview-content ol { ${styles.ol} }
        .preview-content li { ${styles.li} }
        .preview-content a { ${styles.a} }
        .preview-content strong { ${styles.strong} }
        .preview-content img { ${styles.img} }
    `;
}

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEMPLATES, getTemplateList, getTemplateStyles, getTemplateCSS };
}
