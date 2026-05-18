/**
 * 微信公众号编辑器 - 核心逻辑
 * 包含编辑器初始化、模板切换、预览同步、微信格式转换等功能
 */

// 全局变量
let quill = null;
let currentTemplate = 'classicBlue';
let updateTimeout = null;

// ==================== 初始化 ====================

/**
 * 页面加载完成后初始化编辑器
 */
document.addEventListener('DOMContentLoaded', function() {
    initQuillEditor();
    initTemplateSelector();
    initActionButtons();
    initAutoSave();
    initComponentPanel();
    updateTime();
    setInterval(updateTime, 1000);
    
    // 尝试恢复上次使用的模板
    const savedTemplate = restoreTemplateFromStorage();
    if (savedTemplate !== currentTemplate) {
        switchTemplate(savedTemplate);
    }
});

/**
 * 初始化 Quill 富文本编辑器
 */
function initQuillEditor() {
    // 注册微信组件自定义Blot（在创建Quill实例之前注册）
    const BlockEmbed = Quill.import('blots/block/embed');

    class WechatComponentBlot extends BlockEmbed {
        static create(value) {
            const node = super.create();
            if (typeof value === 'object' && value !== null) {
                node.innerHTML = value.html;
                node.dataset.componentId = value.componentId || '';
                node.dataset.fieldValues = JSON.stringify(value.fieldValues || {});
                node.dataset.componentColor = value.color || '#1a73e8';
            } else {
                node.innerHTML = value;
            }
            node.setAttribute('contenteditable', 'false');
            node.classList.add('wechat-component');
            return node;
        }
        
        static value(node) {
            const componentId = node.dataset.componentId;
            if (componentId) {
                return {
                    html: node.innerHTML,
                    componentId: componentId,
                    fieldValues: node.dataset.fieldValues ? JSON.parse(node.dataset.fieldValues) : {},
                    color: node.dataset.componentColor || '#1a73e8'
                };
            }
            return node.innerHTML;
        }
    }

    WechatComponentBlot.blotName = 'wechat-component';
    WechatComponentBlot.tagName = 'div';
    WechatComponentBlot.className = 'wechat-component';

    Quill.register(WechatComponentBlot);

    // 定义自定义工具栏
    const toolbarOptions = [
        // 标题
        [{ 'header': [1, 2, 3, false] }],
        // 字体
        [{ 'font': [] }],
        // 字号
        [{ 'size': ['small', false, 'large', 'huge'] }],
        // 加粗、斜体、下划线、删除线
        ['bold', 'italic', 'underline', 'strike'],
        // 颜色、背景色
        [{ 'color': [] }, { 'background': [] }],
        // 对齐方式
        [{ 'align': [] }],
        // 引用
        ['blockquote'],
        // 列表
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // 缩进
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        // 链接、图片
        ['link', 'image'],
        // 分割线
        ['clean']
    ];

    // 初始化 Quill
    quill = new Quill('#editor', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow',
        placeholder: '在这里开始创作你的文章...'
    });

    // 内容变化时同步到预览区
    quill.on('text-change', function() {
        syncToPreview();
    });

    // === 组件交互：点击选中、双击编辑、Delete删除 ===
    // 点击组件选中
    quill.root.addEventListener('mousedown', function(e) {
        const component = e.target.closest('.wechat-component');
        if (component) {
            e.preventDefault();
            document.querySelectorAll('.wechat-component.selected').forEach(c => c.classList.remove('selected'));
            component.classList.add('selected');
        } else {
            document.querySelectorAll('.wechat-component.selected').forEach(c => c.classList.remove('selected'));
        }
    });

    // 双击组件打开编辑弹窗
    quill.root.addEventListener('dblclick', function(e) {
        const component = e.target.closest('.wechat-component');
        if (component && component.dataset.componentId) {
            editComponent(component);
        }
    });

    // Delete/Backspace删除选中组件
    quill.root.addEventListener('keydown', function(e) {
        const selected = document.querySelector('.wechat-component.selected');
        if (!selected) return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
            e.preventDefault();
            e.stopPropagation();
            const blot = Quill.find(selected);
            if (blot) {
                blot.remove();
                syncToPreview();
                showToast('组件已删除', 'success');
            }
        }
    });

    // 设置初始内容示例
    setInitialContent();
}

/**
 * 设置初始示例内容
 */
function setInitialContent() {
    const initialContent = `
        <h1>欢迎使用微信文章编辑器</h1>
        <p>这是一个简洁高效的在线微信公众号文章编辑器，支持多种精美模板，一键复制即可在微信中使用。</p>
        <h2>核心功能</h2>
        <p>编辑器提供了丰富的排版功能，让你的文章更加精美：</p>
        <ul>
            <li><strong>富文本编辑</strong> - 支持标题、加粗、斜体、颜色等常用格式</li>
            <li><strong>多种模板</strong> - 内置5套精美模板，一键切换风格</li>
            <li><strong>手机预览</strong> - 实时预览手机端显示效果</li>
            <li><strong>微信兼容</strong> - 一键复制，格式完美保留</li>
        </ul>
        <blockquote>提示：复制到微信后，格式会完整保留，可直接发布。</blockquote>
        <h3>开始使用</h3>
        <p>现在就开始创作你的第一篇文章吧！选择喜欢的模板，编辑内容，预览效果，然后一键复制到微信公众号后台。</p>
    `;
    quill.root.innerHTML = initialContent;
    syncToPreview();
}

// ==================== 模板系统 ====================

/**
 * 初始化模板选择器
 */
function initTemplateSelector() {
    const templateList = getTemplateList();
    const container = document.getElementById('template-list');
    
    container.innerHTML = '';
    
    templateList.forEach(template => {
        const item = document.createElement('div');
        item.className = `template-item ${template.id === currentTemplate ? 'active' : ''}`;
        item.dataset.templateId = template.id;
        item.innerHTML = `
            <span class="template-color" style="background: ${template.colors.primary}"></span>
            <span>${template.name}</span>
        `;
        item.addEventListener('click', () => switchTemplate(template.id));
        container.appendChild(item);
    });
}

/**
 * 切换模板
 * @param {string} templateId - 模板ID
 */
function switchTemplate(templateId) {
    if (templateId === currentTemplate) return;
    
    currentTemplate = templateId;
    
    // 更新选择器状态
    document.querySelectorAll('.template-item').forEach(item => {
        item.classList.toggle('active', item.dataset.templateId === templateId);
    });
    
    // 更新预览区的模板样式
    syncToPreview();
    
    showToast(`已切换到「${TEMPLATES[templateId].name}」模板`);
}

// ==================== 预览同步 ====================

/**
 * 同步编辑器内容到预览区（带防抖）
 */
function syncToPreview() {
    // 防抖处理，避免频繁更新
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    
    updateTimeout = setTimeout(() => {
        updatePreview();
    }, 150);
}

/**
 * 更新预览区内容
 */
function updatePreview() {
    const previewContent = document.getElementById('preview-content');
    if (!previewContent) return;
    
    // 获取编辑器HTML内容
    let editorHTML = quill.root.innerHTML;
    
    // 应用模板样式转换
    const styledHTML = applyTemplateStyles(editorHTML, currentTemplate);
    
    // 设置到预览区
    previewContent.innerHTML = styledHTML;
    
    // 更新预览区的模板类名
    previewContent.className = `preview-content template-${currentTemplate}`;
    
    // 重新绑定链接点击事件（阻止跳转）
    previewContent.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => e.preventDefault());
    });
}

/**
 * 应用模板样式到HTML内容
 * @param {string} html - 原始HTML内容
 * @param {string} templateId - 模板ID
 * @returns {string} 应用样式后的HTML
 */
function applyTemplateStyles(html, templateId) {
    const styles = getTemplateStyles(templateId);
    if (!styles) return html;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 处理各个元素
    processElements(doc.body, styles);
    
    return doc.body.innerHTML;
}

/**
 * 处理元素并应用内联样式
 * @param {Element} container - 容器元素
 * @param {Object} styles - 样式对象
 */
function processElements(container, styles) {
    // 处理h1（跳过组件内部的h1）
    container.querySelectorAll('h1').forEach(el => {
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        applyInlineStyle(el, styles.h1);
    });
    
    // 处理h2（跳过组件内部的h2）
    container.querySelectorAll('h2').forEach(el => {
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        applyInlineStyle(el, styles.h2);
    });
    
    // 处理h3（跳过组件内部的h3）
    container.querySelectorAll('h3').forEach(el => {
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        applyInlineStyle(el, styles.h3);
    });
    
    // 处理p标签（组件内部也应用text-align）
    container.querySelectorAll('p').forEach(el => {
        const parentSection = el.closest('section[style]');
        if (parentSection) {
            // 组件内部的p：只应用text-align，不覆盖其他样式
            if (styles.p) {
                const styleObj = parseStyleString(styles.p);
                if (styleObj.textAlign) {
                    el.style.textAlign = styleObj.textAlign;
                }
            }
            return;
        }
        if (!el.closest('blockquote')) {
            applyInlineStyle(el, styles.p);
        }
    });
    
    // 处理blockquote
    container.querySelectorAll('blockquote').forEach(el => {
        applyInlineStyle(el, styles.blockquote);
        // 处理blockquote内的p
        el.querySelectorAll('p').forEach(p => {
            applyInlineStyle(p, styles.p);
        });
    });
    
    // 处理hr
    container.querySelectorAll('hr').forEach(el => {
        applyInlineStyle(el, styles.hr);
    });
    
    // 处理列表
    container.querySelectorAll('ul').forEach(el => {
        applyInlineStyle(el, styles.ul);
    });
    
    container.querySelectorAll('ol').forEach(el => {
        applyInlineStyle(el, styles.ol);
    });
    
    container.querySelectorAll('li').forEach(el => {
        applyInlineStyle(el, styles.li);
    });
    
    // 处理a标签
    container.querySelectorAll('a').forEach(el => {
        applyInlineStyle(el, styles.a);
    });
    
    // 处理strong标签
    container.querySelectorAll('strong, b').forEach(el => {
        applyInlineStyle(el, styles.strong);
    });
    
    // 处理em标签
    container.querySelectorAll('em, i').forEach(el => {
        el.style.fontStyle = 'italic';
    });
    
    // 处理u标签（下划线）
    container.querySelectorAll('u').forEach(el => {
        el.style.textDecoration = 'underline';
    });
    
    // 处理s/strike标签（删除线）
    container.querySelectorAll('s, strike').forEach(el => {
        el.style.textDecoration = 'line-through';
    });
    
    // 处理图片
    container.querySelectorAll('img').forEach(el => {
        applyInlineStyle(el, styles.img);
        el.style.display = 'block';
    });
}

/**
 * 应用内联样式到元素
 * @param {Element} el - DOM元素
 * @param {string} styleString - CSS样式字符串
 */
function applyInlineStyle(el, styleString) {
    if (!styleString) return;
    
    // 解析样式字符串并应用
    const styleObj = parseStyleString(styleString);
    
    for (const [property, value] of Object.entries(styleObj)) {
        el.style[property] = value;
    }
}

/**
 * 解析CSS样式字符串为对象
 * @param {string} styleString - CSS样式字符串
 * @returns {Object} 样式对象
 */
function parseStyleString(styleString) {
    const result = {};
    const declarations = styleString.split(';').filter(s => s.trim());
    
    declarations.forEach(decl => {
        const colonIndex = decl.indexOf(':');
        if (colonIndex > 0) {
            const property = camelCase(decl.substring(0, colonIndex).trim());
            const value = decl.substring(colonIndex + 1).trim();
            result[property] = value;
        }
    });
    
    return result;
}

/**
 * 将CSS属性名转换为驼峰命名
 * @param {string} str - CSS属性名
 * @returns {string} 驼峰命名的属性名
 */
function camelCase(str) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// ==================== 微信格式转换 ====================

/**
 * 将编辑器内容转换为微信兼容的HTML
 * @returns {string} 微信兼容的HTML字符串
 */
function convertToWechatHTML() {
    // 获取编辑器内容
    let html = quill.root.innerHTML;
    
    // 应用当前模板样式
    html = applyTemplateStyles(html, currentTemplate);
    
    // 用section包裹内容（微信会过滤div）
    html = wrapWithSection(html);
    
    // 处理容器样式（只处理section和其直接子元素）
    html = wrapContainerStyles(html);
    
    // 处理图片样式
    html = processImagesForWechat(html);
    
    // 清理不必要的标签和属性
    html = cleanForWechat(html);
    
    return html;
}

/**
 * 用section标签包裹内容
 * @param {string} html - HTML内容
 * @returns {string} 包裹后的HTML
 */
function wrapWithSection(html) {
    // 先提取已有section内容
    const sectionMatch = html.match(/<section[^>]*>([\s\S]*)<\/section>/i);
    if (sectionMatch && !html.includes('<section') && !html.includes('</section>')) {
        // 如果还没有section包裹，则包裹
        const styles = getTemplateStyles(currentTemplate);
        const containerStyle = styles.container.replace(/"/g, "'");
        return `<section style="${containerStyle}">${html}</section>`;
    }
    return html;
}

/**
 * 处理容器的内联样式
 * @param {string} html - HTML内容
 * @returns {string} 处理后的HTML
 */
function wrapContainerStyles(html) {
    const styles = getTemplateStyles(currentTemplate);
    const containerStyle = styles.container;
    
    // 如果已经有section，添加容器样式
    if (html.includes('<section')) {
        html = html.replace(/<section([^>]*)>/i, (match, attrs) => {
            // 如果section已有样式，合并
            if (attrs.includes('style=')) {
                return match;
            }
            return `<section${attrs} style="${containerStyle}">`;
        });
        
        // 如果section没有样式属性
        if (!/<section[^>]*style=/i.test(html)) {
            html = html.replace(/<section>/i, `<section style="${containerStyle}">`);
        }
    }
    
    return html;
}

/**
 * 处理图片样式以适配微信
 * @param {string} html - HTML内容
 * @returns {string} 处理后的HTML
 */
function processImagesForWechat(html) {
    // 使用正则处理图片，确保宽度适配
    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
        // 确保有style属性且包含max-width或width
        if (!attrs.includes('style=')) {
            return `<img${attrs} style="max-width: 100%; height: auto; display: block;">`;
        }
        
        // 确保max-width: 677px
        if (!attrs.includes('max-width')) {
            return `<img${attrs.replace('style="', 'style="max-width: 100%; ')}`;
        }
        
        return match;
    });
    
    return html;
}

/**
 * 清理微信不支持的标签和属性
 * @param {string} html - HTML内容
 * @returns {string} 清理后的HTML
 */
function cleanForWechat(html) {
    // 移除Quill的自定义属性
    html = html.replace(/\sclass="ql-align-center"/g, ' style="text-align: center;"');
    html = html.replace(/\sclass="ql-align-right"/g, ' style="text-align: right;"');
    html = html.replace(/\sclass="ql-align-justify"/g, ' style="text-align: justify;"');
    html = html.replace(/\sclass="ql-align-left"/g, '');
    html = html.replace(/\sclass="ql-indent-[0-9]"/g, '');
    html = html.replace(/<p><br><\/p>/g, '<p style="margin: 12px 0;"><br></p>');
    html = html.replace(/<p><\/p>/g, '<p style="margin: 12px 0;"></p>');
    
    // 将div.wechat-component转换为section（微信兼容）
    html = html.replace(/<div[^>]*class="[^"]*wechat-component[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, (match, content) => {
        // 保留content但去掉div标签
        return content;
    });
    
    // 移除wechat-component相关的属性
    html = html.replace(/\scontenteditable="false"/gi, '');
    
    // 移除不支持的标签但保留内容
    html = html.replace(/<\/?(span)[^>]*>/gi, (match, tag) => {
        // 保留一些有用的span（如带样式的）
        if (match.includes('style=') && !match.includes('class=')) {
            return match;
        }
        // 移除无用的span
        if (match === '<span>' || match === '</span>') {
            return '';
        }
        return match;
    });
    
    // 移除font标签
    html = html.replace(/<\/?font[^>]*>/gi, '');
    
    // 移除data-*属性
    html = html.replace(/\sdata-[a-z-]+="[^"]*"/gi, '');
    
    // 移除class属性
    html = html.replace(/\sclass="[^"]*"/gi, '');
    
    // 移除空的style属性
    html = html.replace(/\sstyle=""/gi, '');
    
    // 清理多余的空格和换行
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/>\s+</g, '><');
    
    return html.trim();
}

// ==================== 复制功能 ====================

/**
 * 初始化操作按钮
 */
function initActionButtons() {
    // 复制到微信按钮
    document.getElementById('copy-btn').addEventListener('click', copyToWechat);
    
    // 清空按钮
    document.getElementById('clear-btn').addEventListener('click', clearEditor);
}

/**
 * 复制到微信
 */
async function copyToWechat() {
    try {
        const wechatHTML = convertToWechatHTML();
        
        // 尝试使用 Clipboard API
        if (navigator.clipboard && navigator.clipboard.write) {
            // 创建富文本格式的剪贴板数据
            const blob = new Blob([wechatHTML], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': new Blob([quill.getText()], { type: 'text/plain' })
            });
            
            await navigator.clipboard.write([clipboardItem]);
            showToast('已复制到剪贴板，可直接粘贴到微信！', 'success');
        } else {
            // 降级方案：使用传统方法
            copyUsingExecCommand(wechatHTML);
        }
    } catch (error) {
        console.error('复制失败:', error);
        // 如果富文本复制失败，尝试降级
        try {
            const wechatHTML = convertToWechatHTML();
            copyUsingExecCommand(wechatHTML);
        } catch (e) {
            showToast('复制失败，请手动选中内容复制', 'error');
        }
    }
}

/**
 * 使用 execCommand 复制（降级方案）
 * @param {string} html - 要复制的HTML内容
 */
function copyUsingExecCommand(html) {
    // 创建一个临时的textarea来存储纯文本版本
    const textArea = document.createElement('textarea');
    textArea.value = quill.getText();
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    // 创建一个临时的div来存储HTML版本
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'fixed';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.opacity = '0';
    tempDiv.style.pointerEvents = 'none';
    document.body.appendChild(tempDiv);
    
    // 选中内容
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    
    // 尝试复制
    try {
        document.execCommand('copy');
        showToast('已复制到剪贴板，可直接粘贴到微信！', 'success');
    } catch (e) {
        // 如果execCommand失败，尝试使用老的粘贴板方法
        fallbackCopy(html);
    }
    
    // 清理
    selection.removeAllRanges();
    document.body.removeChild(textArea);
    document.body.removeChild(tempDiv);
}

/**
 * 降级复制方法
 * @param {string} html - 要复制的HTML内容
 */
function fallbackCopy(html) {
    // 创建一个带样式的隐藏元素
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 677px;
        background: white;
        padding: 20px;
    `;
    
    document.body.appendChild(container);
    
    try {
        const range = document.createRange();
        range.selectNodeContents(container);
        
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        
        document.execCommand('copy');
        showToast('已复制到剪贴板！', 'success');
    } catch (e) {
        showToast('复制失败，请手动复制内容', 'error');
    } finally {
        document.body.removeChild(container);
        window.getSelection().removeAllRanges();
    }
}

/**
 * 清空编辑器
 */
function clearEditor() {
    if (quill.getText().trim() && !confirm('确定要清空所有内容吗？此操作将同时清除本地保存的草稿。')) {
        return;
    }
    quill.setText('');
    // 清除本地存储的草稿
    clearDraft();
    showToast('内容已清空');
}

// ==================== 本地自动保存 ====================

const STORAGE_KEY = 'wechat_editor_draft';
const STORAGE_TEMPLATE_KEY = 'wechat_editor_template';
let autoSaveTimer = null;
let isContentChanged = false;

/**
 * 初始化自动保存
 */
function initAutoSave() {
    // 检查是否有草稿
    checkDraft();
    
    // 监听内容变化
    quill.on('text-change', function() {
        isContentChanged = true;
        updateSaveStatus('unsaved');
        
        // 防抖自动保存
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        autoSaveTimer = setTimeout(() => {
            saveDraft();
        }, 30000); // 30秒后自动保存
    });
    
    // 监听模板变化
    const originalSwitchTemplate = window.switchTemplate;
    window.switchTemplate = function(templateId) {
        originalSwitchTemplate(templateId);
        saveTemplateToStorage(templateId);
    };
    
    // 页面离开前保存
    window.addEventListener('beforeunload', function(e) {
        if (isContentChanged) {
            saveDraft();
        }
    });
    
    // 定期保存检查（每10秒检查一次是否需要保存）
    setInterval(() => {
        if (isContentChanged) {
            saveDraft();
        }
    }, 10000);
}

/**
 * 保存草稿到本地存储
 */
function saveDraft() {
    try {
        updateSaveStatus('saving');
        
        const content = quill.root.innerHTML;
        const text = quill.getText();
        
        // 不保存空白内容
        if (!text.trim()) {
            return;
        }
        
        const draft = {
            content: content,
            template: currentTemplate,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        isContentChanged = false;
        
        setTimeout(() => {
            updateSaveStatus('saved');
        }, 500);
    } catch (e) {
        console.error('保存草稿失败:', e);
        updateSaveStatus('error');
    }
}

/**
 * 保存当前模板到存储
 */
function saveTemplateToStorage(templateId) {
    try {
        localStorage.setItem(STORAGE_TEMPLATE_KEY, templateId);
    } catch (e) {
        console.error('保存模板失败:', e);
    }
}

/**
 * 从存储恢复模板
 */
function restoreTemplateFromStorage() {
    try {
        const savedTemplate = localStorage.getItem(STORAGE_TEMPLATE_KEY);
        if (savedTemplate && TEMPLATES[savedTemplate]) {
            return savedTemplate;
        }
    } catch (e) {
        console.error('恢复模板失败:', e);
    }
    return 'classicBlue';
}

/**
 * 检查并提示恢复草稿
 */
function checkDraft() {
    try {
        const savedDraft = localStorage.getItem(STORAGE_KEY);
        if (!savedDraft) return;
        
        const draft = JSON.parse(savedDraft);
        if (!draft.content || !draft.template) return;
        
        // 显示恢复提示
        showDraftRecovery(draft);
    } catch (e) {
        console.error('检查草稿失败:', e);
    }
}

/**
 * 显示草稿恢复提示
 */
function showDraftRecovery(draft) {
    // 创建恢复提示框
    const recoveryEl = document.createElement('div');
    recoveryEl.className = 'draft-recovery';
    recoveryEl.innerHTML = `
        <span class="draft-recovery-text">📄 发现上次编辑的草稿，是否恢复？</span>
        <div class="draft-recovery-actions">
            <button class="btn-draft-discard" id="discard-draft">丢弃</button>
            <button class="btn-draft-recover" id="recover-draft">恢复</button>
        </div>
    `;
    document.body.appendChild(recoveryEl);
    
    // 显示动画
    requestAnimationFrame(() => {
        recoveryEl.classList.add('show');
    });
    
    // 恢复按钮
    document.getElementById('recover-draft').addEventListener('click', function() {
        recoverDraft(draft);
        recoveryEl.classList.remove('show');
        setTimeout(() => recoveryEl.remove(), 300);
    });
    
    // 丢弃按钮
    document.getElementById('discard-draft').addEventListener('click', function() {
        clearDraft();
        recoveryEl.classList.remove('show');
        setTimeout(() => recoveryEl.remove(), 300);
    });
}

/**
 * 恢复草稿
 */
function recoverDraft(draft) {
    // 恢复模板
    if (TEMPLATES[draft.template]) {
        currentTemplate = draft.template;
        initTemplateSelector();
    }
    
    // 恢复内容
    quill.root.innerHTML = draft.content;
    syncToPreview();
    
    showToast('草稿已恢复', 'success');
}

/**
 * 清除草稿
 */
function clearDraft() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        isContentChanged = false;
    } catch (e) {
        console.error('清除草稿失败:', e);
    }
}

/**
 * 更新保存状态显示
 */
function updateSaveStatus(status) {
    const statusEl = document.getElementById('save-status');
    if (!statusEl) return;
    
    const dot = statusEl.querySelector('.save-dot');
    const text = statusEl.querySelector('.save-text');
    
    statusEl.classList.remove('saving', 'unsaved');
    
    switch (status) {
        case 'saving':
            statusEl.classList.add('saving');
            text.textContent = '保存中...';
            break;
        case 'saved':
            text.textContent = '已保存';
            break;
        case 'unsaved':
            statusEl.classList.add('unsaved');
            text.textContent = '未保存';
            break;
        default:
            text.textContent = '已保存';
    }
}

// ==================== 组件面板 ====================

let currentCategory = 'card';
let currentColor = '#1a73e8';
let savedCursorPosition = null;   // 保存光标位置（用于在指定位置插入组件）
let editingComponentElement = null; // 正在编辑的组件DOM元素（null表示新建）

/**
 * 初始化组件面板
 */
function initComponentPanel() {
    // 初始化颜色选择器
    initColorPicker();
    
    // 初始化分类Tab
    initComponentTabs();
    
    // 初始化组件列表
    renderComponentList();
    
    // 初始化预览弹窗
    initPreviewModal();
}

/**
 * 初始化颜色选择器
 */
function initColorPicker() {
    const picker = document.getElementById('component-color-picker');
    if (!picker) return;
    
    // 从当前模板获取主题色
    currentColor = getCurrentThemeColor();
    
    // 渲染颜色色块
    picker.innerHTML = PRESET_COLORS.map(color => `
        <span class="color-swatch ${color === currentColor ? 'active' : ''}" 
              data-color="${color}"
              style="background-color: ${color}; color: ${color};">
        </span>
    `).join('');
    
    // 绑定点击事件
    picker.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            picker.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.dataset.color;
            renderComponentList();
        });
    });
}

/**
 * 初始化组件分类Tab
 */
function initComponentTabs() {
    const tabsContainer = document.getElementById('component-tabs');
    if (!tabsContainer) return;
    
    const categories = getComponentCategories();
    
    tabsContainer.innerHTML = categories.map(cat => `
        <span class="component-tab ${cat.id === currentCategory ? 'active' : ''}" 
              data-category="${cat.id}">
            ${cat.icon} ${cat.name}
        </span>
    `).join('');
    
    // 绑定点击事件
    tabsContainer.querySelectorAll('.component-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            tabsContainer.querySelectorAll('.component-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderComponentList();
        });
    });
}

/**
 * 渲染组件列表
 */
function renderComponentList() {
    const listContainer = document.getElementById('component-list');
    if (!listContainer) return;
    
    const components = getComponentsByCategory(currentCategory);
    
    listContainer.innerHTML = components.map(item => `
        <div class="component-item" data-component-id="${item.id}">
            <div class="component-item-icon">${item.icon}</div>
            <div class="component-item-name">${item.name}</div>
            <div class="component-item-desc">${item.description}</div>
        </div>
    `).join('');
    
    // 绑定点击事件
    listContainer.querySelectorAll('.component-item').forEach(item => {
        item.addEventListener('click', function() {
            const componentId = this.dataset.componentId;
            showComponentPreview(componentId);
        });
    });
}

// ==================== 组件预览和插入 ====================

let currentPreviewComponent = null;

/**
 * 显示组件预览弹窗
 * @param {string} componentId - 组件ID
 * @param {Object} [initialValues] - 编辑模式时的初始值
 * @param {string} [initialColor] - 编辑模式时的初始颜色
 */
function showComponentPreview(componentId, initialValues, initialColor) {
    const components = getComponentsByCategory(currentCategory);
    const component = components.find(c => c.id === componentId);
    
    if (!component) return;
    
    currentPreviewComponent = component;
    
    // 新建模式：保存当前光标位置
    if (!initialValues) {
        editingComponentElement = null;
        const selection = quill.getSelection();
        savedCursorPosition = selection ? selection.index : quill.getLength() - 1;
    }
    
    // 编辑模式：使用传入的颜色
    if (initialColor) {
        currentColor = initialColor;
    }
    
    // 创建弹窗
    let modal = document.querySelector('.component-preview-modal');
    if (!modal) {
        modal = createPreviewModal();
        document.body.appendChild(modal);
    }
    
    // 填充标题（区分新建/编辑）
    const headerTitle = modal.querySelector('.component-preview-header h4');
    headerTitle.textContent = initialValues ? '编辑组件 - ' + component.name : component.name;
    
    // 更新按钮文字
    const insertBtn = modal.querySelector('.btn-insert');
    insertBtn.textContent = initialValues ? '更新组件' : '插入到编辑器';
    
    // 获取组件字段定义
    const fields = component.getFields ? component.getFields() : [];
    
    // 渲染输入区域
    const inputContainer = modal.querySelector('.input-fields-container');
    if (fields.length === 0) {
        inputContainer.innerHTML = '<div class="no-input-hint">此组件无需输入内容</div>';
    } else {
        inputContainer.innerHTML = fields.map(field => {
            const val = initialValues && initialValues[field.key] !== undefined ? initialValues[field.key] : field.default;
            if (field.type === 'textarea') {
                return `
                    <div class="input-field-group">
                        <label for="field-${field.key}">${field.label}</label>
                        <textarea id="field-${field.key}" data-key="${field.key}" placeholder="${field.default}">${val}</textarea>
                    </div>
                `;
            } else {
                return `
                    <div class="input-field-group">
                        <label for="field-${field.key}">${field.label}</label>
                        <input type="text" id="field-${field.key}" data-key="${field.key}" value="${val}" placeholder="${field.default}">
                    </div>
                `;
            }
        }).join('');
        
        // 绑定实时更新事件
        inputContainer.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', updateModalPreview);
        });
    }
    
    // 初始渲染预览
    updateModalPreview();
    
    // 显示弹窗
    modal.classList.add('show');
}

/**
 * 更新弹窗中的预览
 */
function updateModalPreview() {
    const modal = document.querySelector('.component-preview-modal');
    if (!modal) return;
    
    const previewArea = modal.querySelector('.preview-render');
    if (!previewArea) return;
    
    // 收集用户输入的值
    const fieldValues = {};
    modal.querySelectorAll('.input-fields-container input, .input-fields-container textarea').forEach(input => {
        const key = input.dataset.key;
        const value = input.value;
        fieldValues[key] = value;
    });
    
    // 使用当前颜色和用户输入生成预览HTML
    const previewHtml = getComponentPreview(currentPreviewComponent, currentColor, fieldValues);
    previewArea.innerHTML = previewHtml;
}

/**
 * 创建预览弹窗DOM
 */
function createPreviewModal() {
    const modal = document.createElement('div');
    modal.className = 'component-preview-modal';
    modal.innerHTML = `
        <div class="component-preview-content">
            <div class="component-preview-header">
                <h4>组件预览</h4>
                <button class="component-preview-close">×</button>
            </div>
            <div class="component-preview-body">
                <div class="component-input-area">
                    <div class="input-fields-container"></div>
                </div>
                <div class="component-preview-area">
                    <div class="preview-label">预览效果</div>
                    <div class="preview-render"></div>
                </div>
            </div>
            <div class="component-preview-actions">
                <button class="btn-preview">取消</button>
                <button class="btn-insert">插入到编辑器</button>
            </div>
        </div>
    `;
    
    // 关闭按钮
    modal.querySelector('.component-preview-close').addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // 取消按钮
    modal.querySelector('.btn-preview').addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // 插入按钮（区分新建/编辑模式）
    modal.querySelector('.btn-insert').addEventListener('click', () => {
        if (editingComponentElement) {
            updateComponent();
        } else {
            insertComponent();
        }
        modal.classList.remove('show');
    });
    
    // 点击背景关闭（使用mousedown/mouseup组合避免输入框选择文字误触）
    let modalMouseDownTarget = null;
    modal.addEventListener('mousedown', (e) => {
        modalMouseDownTarget = e.target;
    });
    modal.addEventListener('mouseup', (e) => {
        if (e.target === modal && modalMouseDownTarget === modal) {
            modal.classList.remove('show');
        }
        modalMouseDownTarget = null;
    });
    
    return modal;
}

/**
 * 初始化预览弹窗（备用）
 */
function initPreviewModal() {
    // 弹窗会在首次需要时动态创建
}

/**
 * 处理字段值：textarea中的换行转为<br>
 */
function processFieldValues(fields, fieldValues) {
    const processed = {};
    for (const key in fieldValues) {
        const field = fields.find(f => f.key === key);
        if (field && field.type === 'textarea' && fieldValues[key]) {
            processed[key] = fieldValues[key].replace(/\n/g, '<br>');
        } else {
            processed[key] = fieldValues[key];
        }
    }
    return processed;
}

/**
 * 在所有分类中查找组件定义
 */
function findComponentById(componentId) {
    const categories = getComponentCategories();
    for (const cat of categories) {
        const components = getComponentsByCategory(cat.id);
        const found = components.find(c => c.id === componentId);
        if (found) return found;
    }
    return null;
}

/**
 * 插入组件到编辑器
 */
function insertComponent() {
    if (!currentPreviewComponent) return;
    
    try {
        // 收集用户输入的值
        const modal = document.querySelector('.component-preview-modal');
        const fieldValues = {};
        
        if (modal) {
            modal.querySelectorAll('.input-fields-container input, .input-fields-container textarea').forEach(input => {
                const key = input.dataset.key;
                const value = input.value;
                fieldValues[key] = value;
            });
        }
        
        // 处理textarea换行
        const fields = currentPreviewComponent.getFields ? currentPreviewComponent.getFields() : [];
        const processedValues = processFieldValues(fields, fieldValues);
        
        // 使用用户输入生成HTML
        const html = currentPreviewComponent.getHtml(currentColor, processedValues);
        
        // 使用保存的光标位置（而非默认末尾）
        let insertIndex = savedCursorPosition !== null ? savedCursorPosition : quill.getLength() - 1;
        
        // 使用Quill API插入自定义Blot（携带元数据）
        quill.insertEmbed(insertIndex, 'wechat-component', {
            html: html,
            componentId: currentPreviewComponent.id,
            fieldValues: fieldValues,
            color: currentColor
        }, 'user');
        
        // 将光标移到组件后面
        quill.setSelection(insertIndex + 1, 0);
        
        // 同步预览
        syncToPreview();
        
        showToast(`「${currentPreviewComponent.name}」已插入`, 'success');
    } catch (e) {
        console.error('插入组件失败:', e);
        showToast('插入失败，请重试', 'error');
    }
    
    savedCursorPosition = null;
}

/**
 * 编辑已有组件（双击触发）
 */
function editComponent(componentEl) {
    const componentId = componentEl.dataset.componentId;
    const fieldValues = componentEl.dataset.fieldValues ? JSON.parse(componentEl.dataset.fieldValues) : {};
    const color = componentEl.dataset.componentColor || '#1a73e8';
    
    if (!componentId) {
        showToast('无法识别此组件类型', 'error');
        return;
    }
    
    // 在所有分类中查找组件
    const component = findComponentById(componentId);
    if (!component) {
        showToast('未找到组件定义', 'error');
        return;
    }
    
    // 标记为编辑模式
    editingComponentElement = componentEl;
    currentPreviewComponent = component;
    
    // 打开编辑弹窗（传入初始值）
    showComponentEditModal(component, fieldValues, color);
}

/**
 * 显示编辑弹窗（复用预览弹窗结构，预填值）
 */
function showComponentEditModal(component, fieldValues, color) {
    currentColor = color;
    
    // 创建弹窗
    let modal = document.querySelector('.component-preview-modal');
    if (!modal) {
        modal = createPreviewModal();
        document.body.appendChild(modal);
    }
    
    // 填充标题
    const headerTitle = modal.querySelector('.component-preview-header h4');
    headerTitle.textContent = '编辑组件 - ' + component.name;
    
    // 获取组件字段定义
    const fields = component.getFields ? component.getFields() : [];
    
    // 渲染输入区域（预填值）
    const inputContainer = modal.querySelector('.input-fields-container');
    if (fields.length === 0) {
        inputContainer.innerHTML = '<div class="no-input-hint">此组件无需输入内容</div>';
    } else {
        inputContainer.innerHTML = fields.map(field => {
            const val = fieldValues[field.key] !== undefined ? fieldValues[field.key] : field.default;
            if (field.type === 'textarea') {
                return `
                    <div class="input-field-group">
                        <label for="field-${field.key}">${field.label}</label>
                        <textarea id="field-${field.key}" data-key="${field.key}" placeholder="${field.default}">${val}</textarea>
                    </div>
                `;
            } else {
                return `
                    <div class="input-field-group">
                        <label for="field-${field.key}">${field.label}</label>
                        <input type="text" id="field-${field.key}" data-key="${field.key}" value="${val}" placeholder="${field.default}">
                    </div>
                `;
            }
        }).join('');
        
        inputContainer.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', updateModalPreview);
        });
    }
    
    // 初始渲染预览
    updateModalPreview();
    
    // 显示弹窗
    modal.classList.add('show');
}

/**
 * 更新已有组件（编辑模式保存时触发）
 */
function updateComponent() {
    if (!currentPreviewComponent || !editingComponentElement) return;
    
    try {
        const modal = document.querySelector('.component-preview-modal');
        const fieldValues = {};
        
        if (modal) {
            modal.querySelectorAll('.input-fields-container input, .input-fields-container textarea').forEach(input => {
                fieldValues[input.dataset.key] = input.value;
            });
        }
        
        // 处理textarea换行
        const fields = currentPreviewComponent.getFields ? currentPreviewComponent.getFields() : [];
        const processedValues = processFieldValues(fields, fieldValues);
        
        // 生成新HTML
        const html = currentPreviewComponent.getHtml(currentColor, processedValues);
        
        // 就地更新组件DOM
        editingComponentElement.innerHTML = html;
        editingComponentElement.dataset.componentId = currentPreviewComponent.id;
        editingComponentElement.dataset.fieldValues = JSON.stringify(fieldValues);
        editingComponentElement.dataset.componentColor = currentColor;
        
        // 同步预览
        syncToPreview();
        
        showToast('组件已更新', 'success');
    } catch (e) {
        console.error('更新组件失败:', e);
        showToast('更新失败，请重试', 'error');
    }
    
    editingComponentElement = null;
}

// ==================== 工具函数 ====================

/**
 * 显示Toast提示
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 (success/error/info)
 */
function showToast(message, type = 'info') {
    // 移除已有的toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // 3秒后自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 更新状态栏时间
 */
function updateTime() {
    const timeEl = document.querySelector('.status-time');
    if (timeEl) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}`;
    }
}

// ==================== 导出函数供测试使用 ====================
if (typeof window !== 'undefined') {
    window.WechatEditor = {
        getQuill: () => quill,
        getCurrentTemplate: () => currentTemplate,
        convertToWechatHTML,
        copyToWechat,
        switchTemplate
    };
}
