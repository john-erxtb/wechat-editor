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

// ==================== 新增模板（V2版本）===================

/**
 * 模板6：赤金 - 红金色系，庄重大气
 */
TEMPLATES['redGold'] = {
    name: '赤金',
    description: '红金色系，庄重大气，适合政务/党建',
    colors: {
        primary: '#c41e3a',
        secondary: '#d4382e',
        accent: '#fff5f5',
        text: '#333333',
        textLight: '#666666',
        background: '#ffffff',
        border: '#ffd700'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #333333;
            line-height: 1.8;
            font-size: 16px;
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #c41e3a;
            margin: 20px 0 16px;
            text-align: center;
            position: relative;
            padding-bottom: 16px;
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #c41e3a;
            margin: 18px 0 12px;
            padding-left: 16px;
            border-left: 4px solid #ffd700;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #d4382e;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            text-align: justify;
        `,
        blockquote: `
            margin: 16px 0;
            padding: 16px 20px;
            background-color: #fff5f5;
            border-left: 4px solid #c41e3a;
            color: #666666;
            border-radius: 0 8px 8px 0;
        `,
        hr: `
            border: none;
            height: 2px;
            background: linear-gradient(to right, transparent, #ffd700, #c41e3a, #ffd700, transparent);
            margin: 24px 0;
        `,
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
        a: `
            color: #c41e3a;
            text-decoration: none;
            border-bottom: 1px solid #c41e3a;
        `,
        strong: `
            font-weight: 600;
            color: #c41e3a;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
        `
    }
};

/**
 * 模板7：碧海 - 青蓝色系，海洋风格
 */
TEMPLATES['oceanBlue'] = {
    name: '碧海',
    description: '青蓝色系，海洋风格，适合旅游/环保',
    colors: {
        primary: '#0077b6',
        secondary: '#00b4d8',
        accent: '#caf0f8',
        text: '#023e8a',
        textLight: '#0077b6',
        background: '#f0fbff',
        border: '#90e0ef'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #023e8a;
            line-height: 1.9;
            font-size: 16px;
            background: linear-gradient(180deg, #f0fbff 0%, #ffffff 100%);
        `,
        h1: `
            font-size: 26px;
            font-weight: 700;
            color: #0077b6;
            margin: 24px 0 18px;
            text-align: center;
            letter-spacing: 4px;
        `,
        h2: `
            font-size: 20px;
            font-weight: 600;
            color: #00b4d8;
            margin: 20px 0 14px;
            padding-bottom: 8px;
            border-bottom: 2px solid #90e0ef;
        `,
        h3: `
            font-size: 17px;
            font-weight: 600;
            color: #0077b6;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 14px 0;
            line-height: 1.9;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #caf0f8;
            border-left: 4px solid #00b4d8;
            color: #023e8a;
            border-radius: 0 8px 8px 0;
        `,
        hr: `
            border: none;
            height: 2px;
            background: linear-gradient(to right, transparent, #00b4d8, #90e0ef, transparent);
            margin: 28px 0;
        `,
        ul: `
            margin: 14px 0;
            padding-left: 26px;
            list-style-type: circle;
        `,
        ol: `
            margin: 14px 0;
            padding-left: 26px;
            list-style-type: decimal;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
        `,
        a: `
            color: #0077b6;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #00b4d8;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 18px 0;
            box-shadow: 0 4px 12px rgba(0, 119, 182, 0.15);
        `
    }
};

/**
 * 模板8：暗夜 - 深色背景，科技感强
 */
TEMPLATES['darkNight'] = {
    name: '暗夜',
    description: '深色背景，科技感强，适合科技/数码',
    colors: {
        primary: '#00d4ff',
        secondary: '#7c3aed',
        accent: '#1e1e2e',
        text: '#e0e0e0',
        textLight: '#a0a0a0',
        background: '#0f0f1a',
        border: '#2d2d44'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
            color: #e0e0e0;
            line-height: 1.8;
            font-size: 16px;
            background: linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%);
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #00d4ff;
            margin: 24px 0 18px;
            text-align: center;
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #00d4ff;
            margin: 20px 0 14px;
            padding-left: 16px;
            border-left: 3px solid #7c3aed;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #7c3aed;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            color: #cccccc;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: rgba(124, 58, 237, 0.15);
            border-left: 4px solid #7c3aed;
            color: #b0b0b0;
            border-radius: 0 8px 8px 0;
        `,
        hr: `
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, #7c3aed, #00d4ff, transparent);
            margin: 28px 0;
        `,
        ul: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: none;
        `,
        ol: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: none;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
            color: #cccccc;
        `,
        a: `
            color: #00d4ff;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #00d4ff;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 18px 0;
            border: 1px solid #2d2d44;
        `
    }
};

/**
 * 模板9：樱花 - 粉色系，柔美浪漫
 */
TEMPLATES['sakuraPink'] = {
    name: '樱花',
    description: '粉色系，柔美浪漫，适合情感/生活',
    colors: {
        primary: '#e91e8c',
        secondary: '#ff69b4',
        accent: '#fff0f5',
        text: '#4a4a4a',
        textLight: '#888888',
        background: '#fffafc',
        border: '#ffb6c1'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #4a4a4a;
            line-height: 1.9;
            font-size: 16px;
            background: linear-gradient(180deg, #fffafc 0%, #fff5f7 100%);
        `,
        h1: `
            font-size: 26px;
            font-weight: 600;
            color: #e91e8c;
            margin: 24px 0 18px;
            text-align: center;
            letter-spacing: 2px;
        `,
        h2: `
            font-size: 20px;
            font-weight: 600;
            color: #ff69b4;
            margin: 20px 0 14px;
            padding-bottom: 8px;
            border-bottom: 2px dashed #ffb6c1;
        `,
        h3: `
            font-size: 17px;
            font-weight: 500;
            color: #e91e8c;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 14px 0;
            line-height: 1.9;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #fff0f5;
            border-left: 4px solid #ff69b4;
            color: #888888;
            font-style: italic;
            border-radius: 0 12px 12px 0;
        `,
        hr: `
            border: none;
            height: 1px;
            background: repeating-linear-gradient(
                to right,
                #ffb6c1,
                #ffb6c1 8px,
                transparent 8px,
                transparent 16px
            );
            margin: 28px 20px;
        `,
        ul: `
            margin: 14px 0;
            padding-left: 24px;
            list-style-type: square;
        `,
        ol: `
            margin: 14px 0;
            padding-left: 24px;
            list-style-type: cjk-ideographic;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
            color: #666666;
        `,
        a: `
            color: #e91e8c;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #ff69b4;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 18px 0;
            box-shadow: 0 4px 16px rgba(233, 30, 140, 0.15);
        `
    }
};

/**
 * 模板10：田园 - 暖黄棕色系，质朴温馨
 */
TEMPLATES['countryside'] = {
    name: '田园',
    description: '暖黄棕色系，质朴温馨，适合美食/乡村',
    colors: {
        primary: '#8b5a2b',
        secondary: '#cd853f',
        accent: '#fff8dc',
        text: '#5d4037',
        textLight: '#8d6e63',
        background: '#fdfaf0',
        border: '#deb887'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #5d4037;
            line-height: 1.9;
            font-size: 16px;
            background: #fdfaf0;
        `,
        h1: `
            font-size: 28px;
            font-weight: 600;
            color: #8b5a2b;
            margin: 24px 0 18px;
            text-align: center;
            font-family: "STKaiti", "KaiTi", serif;
        `,
        h2: `
            font-size: 21px;
            font-weight: 600;
            color: #cd853f;
            margin: 20px 0 14px;
            padding-bottom: 8px;
            border-bottom: 2px solid #deb887;
        `,
        h3: `
            font-size: 17px;
            font-weight: 500;
            color: #8b5a2b;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 14px 0;
            line-height: 2;
            text-indent: 2em;
        `,
        blockquote: `
            margin: 18px 20px;
            padding: 16px 20px;
            background-color: #fff8dc;
            border-left: 4px solid #cd853f;
            color: #8d6e63;
            border-radius: 0 8px 8px 0;
        `,
        hr: `
            border: none;
            height: 1px;
            background: #deb887;
            margin: 28px 40px;
        `,
        ul: `
            margin: 14px 0;
            padding-left: 26px;
            list-style-type: disc;
        `,
        ol: `
            margin: 14px 0;
            padding-left: 26px;
            list-style-type: decimal;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
        `,
        a: `
            color: #8b5a2b;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #cd853f;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 18px 0;
            border: 1px solid #deb887;
        `
    }
};

/**
 * 模板11：科技紫 - 紫色渐变，未来感
 */
TEMPLATES['techPurple'] = {
    name: '科技紫',
    description: '紫色渐变，未来感，适合AI/科技',
    colors: {
        primary: '#9333ea',
        secondary: '#c084fc',
        accent: '#f3e8ff',
        text: '#1e1b4b',
        textLight: '#6b7280',
        background: '#faf5ff',
        border: '#a855f7'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
            color: #1e1b4b;
            line-height: 1.8;
            font-size: 16px;
            background: linear-gradient(180deg, #faf5ff 0%, #f5f3ff 100%);
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #9333ea;
            margin: 24px 0 18px;
            text-align: center;
            background: linear-gradient(90deg, #9333ea, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #9333ea;
            margin: 20px 0 14px;
            padding-left: 16px;
            border-left: 4px solid #c084fc;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #a855f7;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #f3e8ff;
            border-left: 4px solid #9333ea;
            color: #6b7280;
            border-radius: 0 12px 12px 0;
        `,
        hr: `
            border: none;
            height: 2px;
            background: linear-gradient(to right, transparent, #9333ea, #c084fc, transparent);
            margin: 28px 0;
        `,
        ul: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: none;
        `,
        ol: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: decimal;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
        `,
        a: `
            color: #9333ea;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #a855f7;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 18px 0;
            box-shadow: 0 4px 20px rgba(147, 51, 234, 0.2);
        `
    }
};

/**
 * 模板12：学术 - 深蓝+米白，严谨正式
 */
TEMPLATES['academic'] = {
    name: '学术',
    description: '深蓝+米白，严谨正式，适合教育/学术',
    colors: {
        primary: '#1e3a5f',
        secondary: '#2c5282',
        accent: '#ebf4ff',
        text: '#2d3748',
        textLight: '#718096',
        background: '#f7f9fc',
        border: '#a0aec0'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 24px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #2d3748;
            line-height: 1.9;
            font-size: 16px;
            background: #f7f9fc;
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #1e3a5f;
            margin: 28px 0 20px;
            text-align: center;
            border-bottom: 3px double #2c5282;
            padding-bottom: 12px;
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #1e3a5f;
            margin: 24px 0 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #a0aec0;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #2c5282;
            margin: 20px 0 12px;
        `,
        p: `
            margin: 14px 0;
            line-height: 2;
            text-indent: 2em;
        `,
        blockquote: `
            margin: 20px 30px;
            padding: 14px 18px;
            background-color: #ebf4ff;
            border-left: 4px solid #2c5282;
            color: #4a5568;
            font-style: normal;
        `,
        hr: `
            border: none;
            height: 2px;
            background: #a0aec0;
            margin: 32px 60px;
        `,
        ul: `
            margin: 14px 0;
            padding-left: 28px;
            list-style-type: disc;
        `,
        ol: `
            margin: 14px 0;
            padding-left: 28px;
            list-style-type: decimal;
        `,
        li: `
            margin: 10px 0;
            line-height: 1.8;
        `,
        a: `
            color: #2c5282;
            text-decoration: none;
            border-bottom: 1px solid #2c5282;
        `,
        strong: `
            font-weight: 600;
            color: #1e3a5f;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 2px;
            margin: 20px 0;
            border: 1px solid #e2e8f0;
        `
    }
};

/**
 * 模板13：节日红 - 红色系，喜庆
 */
TEMPLATES['festivalRed'] = {
    name: '节日红',
    description: '红色系，喜庆，适合节日/庆典',
    colors: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#fef2f2',
        text: '#7f1d1d',
        textLight: '#b91c1c',
        background: '#fffafa',
        border: '#fca5a5'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #7f1d1d;
            line-height: 1.8;
            font-size: 16px;
            background: linear-gradient(180deg, #fffafa 0%, #fef2f2 100%);
        `,
        h1: `
            font-size: 30px;
            font-weight: 700;
            color: #dc2626;
            margin: 24px 0 20px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(220, 38, 38, 0.2);
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #ef4444;
            margin: 20px 0 14px;
            text-align: center;
            padding: 8px 0;
            border-top: 2px solid #fca5a5;
            border-bottom: 2px solid #fca5a5;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #dc2626;
            margin: 16px 0 10px;
            padding-left: 12px;
            border-left: 4px solid #ef4444;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #fef2f2;
            border-left: 5px solid #dc2626;
            color: #b91c1c;
            border-radius: 0 12px 12px 0;
        `,
        hr: `
            border: none;
            height: 3px;
            background: linear-gradient(to right, #fca5a5, #ef4444, #dc2626, #ef4444, #fca5a5);
            border-radius: 3px;
            margin: 28px 30px;
        `,
        ul: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: square;
        `,
        ol: `
            margin: 12px 0;
            padding-left: 24px;
            list-style-type: decimal;
        `,
        li: `
            margin: 8px 0;
            line-height: 1.8;
        `,
        a: `
            color: #dc2626;
            text-decoration: none;
            font-weight: 500;
        `,
        strong: `
            font-weight: 700;
            color: #dc2626;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 18px 0;
            box-shadow: 0 4px 16px rgba(220, 38, 38, 0.2);
        `
    }
};

/**
 * 模板14：森林 - 深绿色系，沉稳自然
 */
TEMPLATES['forestGreen'] = {
    name: '森林',
    description: '深绿色系，沉稳自然，适合企业/品牌',
    colors: {
        primary: '#166534',
        secondary: '#22c55e',
        accent: '#f0fdf4',
        text: '#14532d',
        textLight: '#166534',
        background: '#fafcf9',
        border: '#86efac'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif;
            color: #14532d;
            line-height: 1.8;
            font-size: 16px;
            background: linear-gradient(180deg, #fafcf9 0%, #f0fdf4 100%);
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #166534;
            margin: 24px 0 18px;
            text-align: center;
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #22c55e;
            margin: 20px 0 14px;
            padding-bottom: 10px;
            border-bottom: 2px solid #86efac;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #166534;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #f0fdf4;
            border-left: 4px solid #22c55e;
            color: #166534;
            border-radius: 0 8px 8px 0;
        `,
        hr: `
            border: none;
            height: 2px;
            background: linear-gradient(to right, transparent, #22c55e, #86efac, transparent);
            margin: 28px 40px;
        `,
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
        a: `
            color: #166534;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #22c55e;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 18px 0;
        `
    }
};

/**
 * 模板15：日出 - 橙黄渐变，活力朝气
 */
TEMPLATES['sunrise'] = {
    name: '日出',
    description: '橙黄渐变，活力朝气，适合运动/青年',
    colors: {
        primary: '#ea580c',
        secondary: '#f59e0b',
        accent: '#fffbeb',
        text: '#78350f',
        textLight: '#92400e',
        background: '#fffbf0',
        border: '#fcd34d'
    },
    styles: {
        container: `
            max-width: 677px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
            color: #78350f;
            line-height: 1.8;
            font-size: 16px;
            background: linear-gradient(180deg, #fffbf0 0%, #fffbeb 100%);
        `,
        h1: `
            font-size: 28px;
            font-weight: 700;
            color: #ea580c;
            margin: 24px 0 18px;
            text-align: center;
            background: linear-gradient(90deg, #f59e0b, #ea580c);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `,
        h2: `
            font-size: 22px;
            font-weight: 600;
            color: #ea580c;
            margin: 20px 0 14px;
            padding-left: 16px;
            border-left: 4px solid #f59e0b;
        `,
        h3: `
            font-size: 18px;
            font-weight: 600;
            color: #f59e0b;
            margin: 16px 0 10px;
        `,
        p: `
            margin: 12px 0;
            line-height: 1.8;
            text-align: justify;
        `,
        blockquote: `
            margin: 18px 0;
            padding: 16px 20px;
            background-color: #fffbeb;
            border-left: 4px solid #f59e0b;
            color: #92400e;
            border-radius: 0 12px 12px 0;
        `,
        hr: `
            border: none;
            height: 3px;
            background: linear-gradient(to right, #fcd34d, #f59e0b, #ea580c, #f59e0b, #fcd34d);
            border-radius: 3px;
            margin: 28px 0;
        `,
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
        a: `
            color: #ea580c;
            text-decoration: none;
        `,
        strong: `
            font-weight: 600;
            color: #ea580c;
        `,
        img: `
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 18px 0;
            box-shadow: 0 4px 16px rgba(234, 88, 12, 0.2);
        `
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
