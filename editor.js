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
    updateTime();
    setInterval(updateTime, 1000);
});

/**
 * 初始化 Quill 富文本编辑器
 */
function initQuillEditor() {
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
    // 处理h1
    container.querySelectorAll('h1').forEach(el => {
        applyInlineStyle(el, styles.h1);
    });
    
    // 处理h2
    container.querySelectorAll('h2').forEach(el => {
        applyInlineStyle(el, styles.h2);
    });
    
    // 处理h3
    container.querySelectorAll('h3').forEach(el => {
        applyInlineStyle(el, styles.h3);
    });
    
    // 处理p标签（但排除已处理容器的子元素）
    container.querySelectorAll('p').forEach(el => {
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
    if (quill.getText().trim() && !confirm('确定要清空所有内容吗？')) {
        return;
    }
    quill.setText('');
    showToast('内容已清空');
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
