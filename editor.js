/**
 * 微信公众号编辑器 - 核心逻辑
 * 包含编辑器初始化、模板切换、预览同步、微信格式转换等功能
 */

// 全局变量
let quill = null;
let currentTemplate = 'classicBlue';
let updateTimeout = null;
let currentBgColor = '#ffffff';  // 当前背景色

// 背景色预设
const BG_COLORS = [
    { color: '#ffffff', name: '白色', type: 'light' },
    { color: '#f5f5f5', name: '浅灰', type: 'light' },
    { color: '#faf8f0', name: '米白', type: 'light' },
    { color: '#f0f5ff', name: '浅蓝', type: 'light' },
    { color: '#f0fff0', name: '浅绿', type: 'light' },
    { color: '#fff0f0', name: '浅粉', type: 'light' },
    { color: '#f5f0ff', name: '浅紫', type: 'light' },
    { color: '#fffef0', name: '浅黄', type: 'light' },
    { color: '#333333', name: '深灰', type: 'dark' },
    { color: '#1a1a2e', name: '深蓝', type: 'dark' },
    { color: '#1a2e1a', name: '深绿', type: 'dark' },
    { color: '#1a1a1a', name: '黑色', type: 'dark' }
];

// localStorage keys
const STORAGE_KEY = 'wechat-editor-autosave';
const DRAFTS_KEY = 'wechat-editor-drafts';
const STORAGE_TEMPLATE_KEY = 'wechat-editor-template';
const STORAGE_BG_COLOR_KEY = 'wechat-editor-bgcolor';

let autoSaveTimer = null;
let isContentChanged = false;
let lastSavedContent = '';  // 用于比较内容是否变化

// 文字颜色预设
const TEXT_COLORS = [
    { color: '', name: '默认' },
    { color: '#333333', name: '黑色' },
    { color: '#ffffff', name: '白色' },
    { color: '#e74c3c', name: '红色' },
    { color: '#f39c12', name: '橙色' },
    { color: '#27ae60', name: '绿色' },
    { color: '#2980b9', name: '蓝色' },
    { color: '#8e44ad', name: '紫色' },
    { color: '#95a5a6', name: '灰色' }
];

let currentTextColor = '';  // 当前选中的文字颜色（空字符串表示默认）

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
    initBgColorSelector();  // 初始化背景色选择器
    restoreBgColorFromStorage();  // 恢复保存的背景色
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
                node.dataset.textColor = value.textColor || '';  // 文字颜色
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
                    color: node.dataset.componentColor || '#1a73e8',
                    textColor: node.dataset.textColor || ''  // 文字颜色
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
    
    // 编辑器失焦时保存光标位置
    quill.on('selection-change', function(range) {
        if (range) {
            savedCursorPosition = range.index;
        }
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
    
    // 【修复问题二】初始化编辑器区图片大小调整功能
    initEditorImageResize();
}

/**
 * 初始化编辑器区图片大小调整功能
 * 【修复问题二】点击编辑器中的图片弹出大小调整工具条
 */
function initEditorImageResize() {
    const editorEl = quill.root;
    let activeToolbar = null;
    
    // ESC键退出图片编辑模式
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && activeToolbar) {
            removeEditorImageToolbar();
        }
    });
    
    // 点击其他地方退出图片编辑模式
    document.addEventListener('mousedown', function(e) {
        if (activeToolbar && !activeToolbar.contains(e.target) && !e.target.closest('.editor-image-toolbar')) {
            removeEditorImageToolbar();
        }
    });
    
    // 点击编辑器中的图片
    editorEl.addEventListener('click', function(e) {
        const img = e.target.closest('img');
        if (!img) {
            removeEditorImageToolbar();
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        // 移除之前的工具条
        removeEditorImageToolbar();
        
        // 创建图片工具条
        const toolbar = createEditorImageToolbar(img);
        
        // 定位到图片下方
        positionEditorImageToolbar(img, toolbar);
        
        editorEl.appendChild(toolbar);
        activeToolbar = toolbar;
        
        // 监听滚动和resize以更新工具条位置
        const updatePosition = () => positionEditorImageToolbar(img, toolbar);
        img._updateToolbarPosition = updatePosition;
    });
}

/**
 * 创建编辑器图片工具条
 */
function createEditorImageToolbar(img) {
    const toolbar = document.createElement('div');
    toolbar.className = 'editor-image-toolbar';
    
    // 预设按钮
    const presets = [
        { label: '25%', value: 25 },
        { label: '50%', value: 50 },
        { label: '75%', value: 75 },
        { label: '100%', value: 100 }
    ];
    
    const container = img.parentElement;
    const containerWidth = container.offsetWidth || 677;
    const currentPercent = Math.round((img.offsetWidth / containerWidth) * 100);
    
    presets.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'editor-size-btn' + (Math.abs(currentPercent - preset.value) < 5 ? ' active' : '');
        btn.textContent = preset.label;
        btn.dataset.percent = preset.value;
        
        btn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            setEditorImageWidth(img, preset.value);
            updateEditorToolbarActive(toolbar, preset.value);
        });
        
        toolbar.appendChild(btn);
    });
    
    // 自定义宽度输入
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'editor-size-input-wrapper';
    
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'editor-size-input';
    input.value = currentPercent;
    input.min = 10;
    input.max = 200;
    input.placeholder = '%';
    
    input.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    input.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    input.addEventListener('change', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const percent = parseInt(input.value) || 100;
        setEditorImageWidth(img, percent);
        updateEditorToolbarActive(toolbar, percent);
    });
    
    inputWrapper.appendChild(input);
    toolbar.appendChild(inputWrapper);
    
    // 删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'editor-image-delete-btn';
    deleteBtn.textContent = '🗑';
    deleteBtn.title = '删除图片';
    
    deleteBtn.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    deleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        deleteEditorImage(img);
    });
    
    toolbar.appendChild(deleteBtn);
    
    return toolbar;
}

/**
 * 定位编辑器图片工具条
 */
function positionEditorImageToolbar(img, toolbar) {
    const editorEl = quill.root;
    const imgRect = img.getBoundingClientRect();
    const editorRect = editorEl.getBoundingClientRect();
    
    // 计算相对于编辑器的位置
    const top = img.offsetTop + img.offsetHeight + 4;
    const left = img.offsetLeft;
    
    toolbar.style.top = top + 'px';
    toolbar.style.left = left + 'px';
}

/**
 * 设置编辑器图片宽度
 */
function setEditorImageWidth(img, percent) {
    img.style.width = percent + '%';
    img.style.height = 'auto';
    img.style.maxWidth = 'none';
    
    // 手动同步到预览区
    syncToPreview();
}

/**
 * 更新编辑器工具条活动状态
 */
function updateEditorToolbarActive(toolbar, currentPercent) {
    toolbar.querySelectorAll('.editor-size-btn').forEach(btn => {
        const presetPercent = parseInt(btn.dataset.percent);
        btn.classList.toggle('active', presetPercent === currentPercent);
    });
    
    const input = toolbar.querySelector('.editor-size-input');
    if (input) {
        input.value = currentPercent;
    }
}

/**
 * 移除编辑器图片工具条
 */
function removeEditorImageToolbar() {
    const existingToolbar = document.querySelector('.editor-image-toolbar');
    if (existingToolbar) {
        existingToolbar.remove();
    }
}

/**
 * 删除编辑器中的图片
 */
function deleteEditorImage(img) {
    // 使用Quill的API删除图片
    const blot = Quill.find(img);
    if (blot) {
        blot.remove();
    } else {
        // 备用方案：直接移除DOM元素
        img.remove();
    }
    
    removeEditorImageToolbar();
    syncToPreview();
    showToast('图片已删除', 'success');
}

/**
 * 【保留】预览区图片点击处理（仅用于预览区查看效果，不做调整）
 * 此函数保留但简化，仅用于预览区样式显示
 */
/**
 * 进入图片编辑模式（预览区 - 保留但简化）
 */
function enterImageEditMode(img) {
    // 预览区不再提供调整功能，只显示选中效果
    img.classList.add('preview-image-selected');
}

/**
 * 退出图片编辑模式（预览区）
 */
function exitImageEditMode() {
    document.querySelectorAll('.preview-image-selected').forEach(el => {
        el.classList.remove('preview-image-selected');
    });
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
    
    // 先将Quill的对齐类转换为内联样式（预览区没有Quill的CSS，类名无效）
    editorHTML = convertAlignClassesToInline(editorHTML);
    
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
 * 将Quill的对齐CSS类转换为内联样式
 * 预览区和微信都不识别ql-align-*类，需要转为style
 */
function convertAlignClassesToInline(html) {
    html = html.replace(/class="([^"]*)ql-align-center([^"]*)"/g, (match, before, after) => {
        const cls = (before + after).trim();
        return cls ? `class="${cls}" style="text-align: center;"` : `style="text-align: center;"`;
    });
    html = html.replace(/class="([^"]*)ql-align-right([^"]*)"/g, (match, before, after) => {
        const cls = (before + after).trim();
        return cls ? `class="${cls}" style="text-align: right;"` : `style="text-align: right;"`;
    });
    html = html.replace(/class="([^"]*)ql-align-justify([^"]*)"/g, (match, before, after) => {
        const cls = (before + after).trim();
        return cls ? `class="${cls}" style="text-align: justify;"` : `style="text-align: justify;"`;
    });
    html = html.replace(/class="([^"]*)ql-align-left([^"]*)"/g, (match, before, after) => {
        const cls = (before + after).trim();
        return cls ? `class="${cls}"` : '';
    });
    return html;
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
    // 处理h1（跳过组件内部的h1，保留用户对齐）
    container.querySelectorAll('h1').forEach(el => {
        if (el.closest('.wechat-component')) return;  // 跳过组件内部
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        const savedAlign = el.style.textAlign;
        applyInlineStyle(el, styles.h1);
        if (savedAlign) el.style.textAlign = savedAlign;
    });
    
    // 处理h2（跳过组件内部的h2，保留用户对齐）
    container.querySelectorAll('h2').forEach(el => {
        if (el.closest('.wechat-component')) return;  // 跳过组件内部
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        const savedAlign = el.style.textAlign;
        applyInlineStyle(el, styles.h2);
        if (savedAlign) el.style.textAlign = savedAlign;
    });
    
    // 处理h3（跳过组件内部的h3，保留用户对齐）
    container.querySelectorAll('h3').forEach(el => {
        if (el.closest('.wechat-component')) return;  // 跳过组件内部
        const parentSection = el.closest('section[style]');
        if (parentSection) return;
        const savedAlign = el.style.textAlign;
        applyInlineStyle(el, styles.h3);
        if (savedAlign) el.style.textAlign = savedAlign;
    });
    
    // 处理p标签（保留用户设置的对齐方式）
    container.querySelectorAll('p').forEach(el => {
        if (el.closest('.wechat-component')) return;  // 跳过组件内部
        const parentSection = el.closest('section[style]');
        if (parentSection) {
            // 组件内部p：绝对不从模板覆盖text-align（应继承父section的对齐）
            if (styles.p) {
                const styleObj = parseStyleString(styles.p);
                for (const [property, value] of Object.entries(styleObj)) {
                    if (property !== 'textAlign') {
                        el.style[property] = value;
                    }
                }
            }
            return;
        }
        if (!el.closest('blockquote')) {
            // 非组件p：如果p已有text-align内联样式（来自用户对齐设置），保留
            if (el.style.textAlign) {
                // 保留用户的对齐设置，只应用其他样式
                const styleObj = parseStyleString(styles.p);
                for (const [property, value] of Object.entries(styleObj)) {
                    if (property !== 'textAlign') {
                        el.style[property] = value;
                    }
                }
            } else {
                applyInlineStyle(el, styles.p);
            }
        }
    });
    
    // 处理blockquote（跳过组件内部）
    container.querySelectorAll('blockquote').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.blockquote);
        // 处理blockquote内的p
        el.querySelectorAll('p').forEach(p => {
            if (!p.closest('.wechat-component')) applyInlineStyle(p, styles.p);
        });
    });
    
    // 处理hr（跳过组件内部）
    container.querySelectorAll('hr').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.hr);
    });
    
    // 处理列表（跳过组件内部）
    container.querySelectorAll('ul').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.ul);
    });
    
    container.querySelectorAll('ol').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.ol);
    });
    
    container.querySelectorAll('li').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.li);
    });
    
    // 处理a标签（跳过组件内部）
    container.querySelectorAll('a').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.a);
    });
    
    // 处理strong标签（跳过组件内部）
    container.querySelectorAll('strong, b').forEach(el => {
        if (el.closest('.wechat-component')) return;
        applyInlineStyle(el, styles.strong);
    });
    
    // 处理em标签（跳过组件内部）
    container.querySelectorAll('em, i').forEach(el => {
        if (el.closest('.wechat-component')) return;
        el.style.fontStyle = 'italic';
    });
    
    // 处理u标签（下划线）（跳过组件内部）
    container.querySelectorAll('u').forEach(el => {
        if (el.closest('.wechat-component')) return;
        el.style.textDecoration = 'underline';
    });
    
    // 处理s/strike标签（删除线）（跳过组件内部）
    container.querySelectorAll('s, strike').forEach(el => {
        if (el.closest('.wechat-component')) return;
        el.style.textDecoration = 'line-through';
    });
    
    // 处理图片（跳过组件内部，保留原始尺寸）
    container.querySelectorAll('img').forEach(el => {
        if (el.closest('.wechat-component')) return;
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
    
    // 处理图片样式
    html = processImagesForWechat(html);
    
    // 清理不必要的标签和属性
    html = cleanForWechat(html);
    
    // 最后一步：包裹最外层容器，带背景色
    const styles = getTemplateStyles(currentTemplate);
    const containerStyle = styles.container.replace(/"/g, "'");
    
    // 构建背景色样式
    let bgStyle = '';
    let textColorStyle = '';
    
    // 非默认白色背景时添加背景色
    if (currentBgColor !== '#ffffff') {
        bgStyle = `background-color: ${currentBgColor};`;
        // 深色背景时添加浅色文字
        if (isDarkColor(currentBgColor)) {
            textColorStyle = 'color: #f5f5f5;';
        }
    }
    
    // 用一个最外层 section 包裹所有内容
    html = `<section style="${bgStyle}${textColorStyle}${containerStyle}">${html}</section>`;
    
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
 * 【修复问题一】在导出时移除 style 标签和 class 属性，因为微信不支持
 * @param {string} html - HTML内容
 * @returns {string} 清理后的HTML
 */
function cleanForWechat(html) {
    // 【修复问题一】移除style标签（导出时才移除，让预览区能正确显示）
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
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
    
    // 【修复问题一】移除class属性（导出时才移除，保留section等重要类名用于内联化）
    // 保留 section 标签的class用于内联化
    html = html.replace(/<section\s+class="([^"]*)"([^>]*)>/gi, (match, cls, rest) => {
        // 将section的class转为内联样式（部分保留）
        return `<section${rest}>`;
    });
    // 移除其他所有class属性
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
    
    // 保存草稿按钮
    document.getElementById('save-draft-btn').addEventListener('click', showSaveDraftModal);
    
    // 草稿箱按钮
    document.getElementById('draft-box-btn').addEventListener('click', showDraftBoxModal);
    
    // 复制HTML按钮
    document.getElementById('copy-html-btn').addEventListener('click', copyHTMLToClipboard);
    
    // 导入文章按钮
    document.getElementById('import-article-btn').addEventListener('click', showImportArticleModal);
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
    const hasContent = quill.getText().trim() || quill.root.querySelector('.wechat-component, img');
    if (hasContent && !confirm('确定要清空所有内容吗？此操作将同时清除本地保存的草稿。')) {
        return;
    }
    quill.setText('');
    // 清除本地存储的草稿
    clearDraft();
    showToast('内容已清空');
}

// ==================== 本地自动保存（增强版） ====================

/**
 * 初始化自动保存
 */
function initAutoSave() {
    // 监听内容变化
    quill.on('text-change', function() {
        const currentContent = quill.root.innerHTML;
        isContentChanged = (currentContent !== lastSavedContent);
        
        if (isContentChanged) {
            updateSaveStatus('unsaved');
        }
        
        // 防抖自动保存（1秒无操作后保存）
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        autoSaveTimer = setTimeout(() => {
            if (quill.getText().trim()) {
                autoSaveContent();
            }
        }, 1000); // 1秒防抖
    });
    
    // 页面加载时恢复自动保存的内容
    restoreAutoSave();
    
    // 监听模板变化
    const originalSwitchTemplate = window.switchTemplate;
    window.switchTemplate = function(templateId) {
        originalSwitchTemplate(templateId);
        saveTemplateToStorage(templateId);
    };
    
    // 页面离开前保存
    window.addEventListener('beforeunload', function(e) {
        if (isContentChanged) {
            autoSaveContent();
        }
    });
}

/**
 * 自动保存当前内容到localStorage
 */
function autoSaveContent() {
    try {
        updateSaveStatus('saving');
        
        const content = quill.root.innerHTML;
        const previewContent = document.getElementById('preview-content');
        const previewHtml = previewContent ? previewContent.innerHTML : '';
        
        // 不保存空白内容（同时检查纯文本和组件内容，因为BlockEmbed组件不算文本）
        const hasContent = quill.getText().trim() || quill.root.querySelector('.wechat-component, img');
        if (!hasContent) {
            updateSaveStatus('saved');
            return;
        }
        
        const saveData = {
            content: content,
            previewHtml: previewHtml,
            template: currentTemplate,
            bgColor: currentBgColor,  // 保存背景色
            timestamp: Date.now()
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        lastSavedContent = content;
        isContentChanged = false;
        
        updateSaveStatus('saved');
    } catch (e) {
        console.error('自动保存失败:', e);
        updateSaveStatus('error');
        // 检查是否是存储空间不足
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            showToast('存储空间不足，请清理草稿箱', 'error');
        }
    }
}

/**
 * 从localStorage恢复自动保存的内容
 */
function restoreAutoSave() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        if (!data.content || !data.template) return;
        
        // 恢复模板
        if (TEMPLATES[data.template]) {
            currentTemplate = data.template;
            initTemplateSelector();
        }
        
        // 恢复背景色
        if (data.bgColor) {
            currentBgColor = data.bgColor;
            updatePreviewBgColor();
            updateBgColorPickerUI(data.bgColor);
        }
        
        // 恢复内容
        quill.root.innerHTML = data.content;
        lastSavedContent = data.content;
        
        // 更新预览
        syncToPreview();
        
        updateSaveStatus('saved');
    } catch (e) {
        console.error('恢复自动保存失败:', e);
    }
}

/**
 * 保存当前内容到草稿箱
 * 优化：移除previewHtml，只保存必要字段
 * @param {string} name - 草稿名称
 */
function saveToDraftBox(name) {
    try {
        const content = quill.root.innerHTML;
        
        // 不保存空白内容（同时检查纯文本和组件内容，因为BlockEmbed组件不算文本）
        const hasContent = quill.getText().trim() || quill.root.querySelector('.wechat-component, img');
        if (!hasContent) {
            showToast('编辑器内容为空，无法保存', 'error');
            return false;
        }
        
        // 获取现有草稿列表
        let drafts = [];
        const existingDrafts = localStorage.getItem(DRAFTS_KEY);
        if (existingDrafts) {
            try {
                drafts = JSON.parse(existingDrafts);
            } catch (e) {
                drafts = [];
            }
        }
        
        // 生成新草稿 - 只保存必要字段，减少存储占用
        const newDraft = {
            id: generateUUID(),
            name: name || formatDateTime(new Date()),
            content: content,
            template: currentTemplate,
            timestamp: Date.now()
        };
        
        drafts.unshift(newDraft); // 添加到列表开头
        
        // 保存到localStorage
        try {
            localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
            
            // 背景色单独保存（草稿不需要重复存）
            try {
                localStorage.setItem(STORAGE_BG_COLOR_KEY, currentBgColor);
            } catch (e) {
                // 忽略
            }
            
            showToast(`「${newDraft.name}」已保存到草稿箱`, 'success');
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                showToast('草稿箱存储空间不足，请清理部分草稿', 'error');
            } else {
                throw e;
            }
            return false;
        }
    } catch (e) {
        console.error('保存草稿失败:', e);
        showToast('保存草稿失败，请重试', 'error');
        return false;
    }
}

/**
 * 从草稿箱加载草稿
 * @param {string} draftId - 草稿ID
 */
function loadDraft(draftId) {
    try {
        const drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
        const draft = drafts.find(d => d.id === draftId);
        
        if (!draft) {
            showToast('未找到该草稿', 'error');
            return false;
        }
        
        // 恢复模板
        if (TEMPLATES[draft.template]) {
            currentTemplate = draft.template;
            initTemplateSelector();
        }
        
        // 恢复背景色
        if (draft.bgColor) {
            currentBgColor = draft.bgColor;
            updatePreviewBgColor();
            updateBgColorPickerUI(draft.bgColor);
        } else {
            // 默认为白色
            currentBgColor = '#ffffff';
            updatePreviewBgColor();
            updateBgColorPickerUI('#ffffff');
        }
        
        // 恢复内容
        quill.root.innerHTML = draft.content;
        lastSavedContent = draft.content;
        
        // 更新预览
        syncToPreview();
        
        showToast(`「${draft.name}」已加载`, 'success');
        return true;
    } catch (e) {
        console.error('加载草稿失败:', e);
        showToast('加载草稿失败，请重试', 'error');
        return false;
    }
}

/**
 * 从草稿箱删除草稿
 * @param {string} draftId - 草稿ID
 */
function deleteDraft(draftId) {
    try {
        let drafts = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
        const draftIndex = drafts.findIndex(d => d.id === draftId);
        
        if (draftIndex === -1) {
            showToast('未找到该草稿', 'error');
            return false;
        }
        
        const draftName = drafts[draftIndex].name;
        drafts.splice(draftIndex, 1);
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
        
        showToast(`「${draftName}」已删除`, 'success');
        return true;
    } catch (e) {
        console.error('删除草稿失败:', e);
        showToast('删除草稿失败，请重试', 'error');
        return false;
    }
}

/**
 * 获取草稿箱列表
 * @returns {Array} 草稿列表
 */
function getDrafts() {
    try {
        return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

/**
 * 复制HTML到剪贴板（用于导出）
 */
async function copyHTMLToClipboard() {
    try {
        const wechatHTML = convertToWechatHTML();
        
        // 使用 Clipboard API
        if (navigator.clipboard && navigator.clipboard.write) {
            const blob = new Blob([wechatHTML], { type: 'text/html' });
            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': new Blob([quill.getText()], { type: 'text/plain' })
            });
            
            await navigator.clipboard.write([clipboardItem]);
            showToast('HTML已复制到剪贴板，可直接粘贴到微信公众号后台', 'success');
        } else {
            // 降级方案
            copyUsingExecCommand(wechatHTML);
        }
    } catch (error) {
        console.error('复制失败:', error);
        try {
            const wechatHTML = convertToWechatHTML();
            copyUsingExecCommand(wechatHTML);
        } catch (e) {
            showToast('复制失败，请手动选中内容复制', 'error');
        }
    }
}

// ==================== 草稿箱模态框 ====================

/**
 * 显示保存草稿弹窗
 */
function showSaveDraftModal() {
    // 创建弹窗
    let modal = document.querySelector('.save-draft-modal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'draft-modal-overlay';
    modal.innerHTML = `
        <div class="draft-modal-content">
            <div class="draft-modal-header">
                <h4>保存草稿</h4>
                <button class="draft-modal-close">×</button>
            </div>
            <div class="draft-modal-body">
                <label for="draft-name-input">草稿名称</label>
                <input type="text" id="draft-name-input" placeholder="${formatDateTime(new Date())}" autocomplete="off">
            </div>
            <div class="draft-modal-footer">
                <button class="btn-preview draft-modal-cancel">取消</button>
                <button class="btn-save-draft">保存</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 显示动画
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    // 聚焦输入框
    const input = modal.querySelector('#draft-name-input');
    setTimeout(() => input.focus(), 100);
    
    // 关闭按钮
    modal.querySelector('.draft-modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.draft-modal-cancel').addEventListener('click', () => closeModal(modal));
    
    // 保存按钮
    modal.querySelector('.btn-save-draft').addEventListener('click', () => {
        const name = input.value.trim() || formatDateTime(new Date());
        if (saveToDraftBox(name)) {
            closeModal(modal);
        }
    });
    
    // 回车保存
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const name = input.value.trim() || formatDateTime(new Date());
            if (saveToDraftBox(name)) {
                closeModal(modal);
            }
        }
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

/**
 * 显示草稿箱弹窗
 */
function showDraftBoxModal() {
    const drafts = getDrafts();
    
    // 创建弹窗
    let modal = document.querySelector('.draft-box-modal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'draft-modal-overlay draft-box-modal';
    
    let draftsHtml = '';
    if (drafts.length === 0) {
        draftsHtml = '<div class="draft-box-empty">草稿箱为空</div>';
    } else {
        draftsHtml = drafts.map(draft => {
            const preview = stripHtml(draft.content).substring(0, 50);
            const date = formatDateTime(new Date(draft.timestamp));
            return `
                <div class="draft-item" data-id="${draft.id}">
                    <div class="draft-item-info">
                        <div class="draft-item-name">${escapeHtml(draft.name)}</div>
                        <div class="draft-item-meta">
                            <span>${date}</span>
                            <span class="draft-item-preview">${escapeHtml(preview)}${preview.length >= 50 ? '...' : ''}</span>
                        </div>
                    </div>
                    <div class="draft-item-actions">
                        <button class="btn-draft-load">加载</button>
                        <button class="btn-draft-delete">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.innerHTML = `
        <div class="draft-modal-content draft-box-content">
            <div class="draft-modal-header">
                <h4>草稿箱 (${drafts.length})</h4>
                <button class="draft-modal-close">×</button>
            </div>
            <div class="draft-box-list">
                ${draftsHtml}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 显示动画
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    // 关闭按钮
    modal.querySelector('.draft-modal-close').addEventListener('click', () => closeModal(modal));
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // 绑定加载和删除按钮事件
    modal.querySelectorAll('.btn-draft-load').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const draftId = e.target.closest('.draft-item').dataset.id;
            if (loadDraft(draftId)) {
                closeModal(modal);
            }
        });
    });
    
    modal.querySelectorAll('.btn-draft-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const draftId = e.target.closest('.draft-item').dataset.id;
            const draftItem = e.target.closest('.draft-item');
            const draftName = draftItem.querySelector('.draft-item-name').textContent;
            
            // 显示确认删除提示
            showDeleteConfirmModal(draftId, draftName, () => {
                if (deleteDraft(draftId)) {
                    // 刷新草稿箱
                    const newDrafts = getDrafts();
                    const listContainer = modal.querySelector('.draft-box-list');
                    if (newDrafts.length === 0) {
                        listContainer.innerHTML = '<div class="draft-box-empty">草稿箱为空</div>';
                    } else {
                        // 重新渲染（移除被删除的项）
                        draftItem.remove();
                        // 更新标题计数
                        modal.querySelector('.draft-modal-header h4').textContent = `草稿箱 (${newDrafts.length})`;
                    }
                }
            });
        });
    });
}

/**
 * 显示删除确认弹窗
 */
function showDeleteConfirmModal(draftId, draftName, onConfirm) {
    let modal = document.querySelector('.delete-confirm-modal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'draft-modal-overlay delete-confirm-modal';
    modal.innerHTML = `
        <div class="draft-modal-content delete-confirm-content">
            <div class="draft-modal-header">
                <h4>确认删除</h4>
                <button class="draft-modal-close">×</button>
            </div>
            <div class="draft-modal-body">
                <p>确定要删除草稿「${escapeHtml(draftName)}」吗？此操作不可恢复。</p>
            </div>
            <div class="draft-modal-footer">
                <button class="btn-preview delete-confirm-cancel">取消</button>
                <button class="btn-delete-confirm">删除</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    modal.querySelector('.draft-modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.delete-confirm-cancel').addEventListener('click', () => closeModal(modal));
    
    modal.querySelector('.btn-delete-confirm').addEventListener('click', () => {
        closeModal(modal);
        onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

/**
 * 关闭弹窗
 */
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// ==================== 工具函数 ====================

/**
 * 生成UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm
 */
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 去除HTML标签
 */
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

/**
 * HTML转义
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
 * 清除草稿（兼容旧版本）
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

// ==================== 背景色选择器 ====================

/**
 * 初始化背景色选择器
 */
function initBgColorSelector() {
    const picker = document.getElementById('bg-color-picker');
    const customInput = document.getElementById('bg-color-custom-input');
    const resetBtn = document.getElementById('reset-bg-btn');
    
    if (!picker) return;
    
    // 渲染背景色色块
    picker.innerHTML = BG_COLORS.map(item => `
        <span class="bg-color-swatch ${item.type} ${item.color === currentBgColor ? 'active' : ''}" 
              data-color="${item.color}"
              style="background-color: ${item.color};"
              title="${item.name}">
        </span>
    `).join('');
    
    // 绑定点击事件
    picker.querySelectorAll('.bg-color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            const color = this.dataset.color;
            setBgColor(color);
        });
    });
    
    // 自定义颜色输入
    if (customInput) {
        customInput.addEventListener('input', function() {
            setBgColor(this.value);
        });
        
        customInput.addEventListener('change', function() {
            // 更新选择器UI
            updateBgColorPickerUI(this.value);
        });
    }
    
    // 重置按钮
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            setBgColor('#ffffff');
        });
    }
}

/**
 * 设置背景色
 * @param {string} color - 颜色值
 */
function setBgColor(color) {
    currentBgColor = color;
    
    // 更新选择器UI
    updateBgColorPickerUI(color);
    
    // 更新预览区背景色
    updatePreviewBgColor();
    
    // 保存到localStorage
    saveBgColorToStorage();
    
    // 同步更新预览
    syncToPreview();
}

/**
 * 更新背景色选择器UI
 * @param {string} color - 当前颜色值
 */
function updateBgColorPickerUI(color) {
    const picker = document.getElementById('bg-color-picker');
    const customInput = document.getElementById('bg-color-custom-input');
    
    if (picker) {
        picker.querySelectorAll('.bg-color-swatch').forEach(swatch => {
            swatch.classList.toggle('active', swatch.dataset.color === color);
        });
    }
    
    if (customInput) {
        customInput.value = color;
    }
}

/**
 * 更新预览区背景色
 */
function updatePreviewBgColor() {
    const wrapper = document.querySelector('.preview-content-wrapper');
    if (wrapper) {
        wrapper.style.backgroundColor = currentBgColor;
    }
}

/**
 * 保存背景色到localStorage
 */
function saveBgColorToStorage() {
    try {
        localStorage.setItem(STORAGE_BG_COLOR_KEY, currentBgColor);
    } catch (e) {
        console.error('保存背景色失败:', e);
    }
}

/**
 * 从localStorage恢复背景色
 */
function restoreBgColorFromStorage() {
    try {
        const savedColor = localStorage.getItem(STORAGE_BG_COLOR_KEY);
        if (savedColor) {
            currentBgColor = savedColor;
            updatePreviewBgColor();
            updateBgColorPickerUI(savedColor);
        }
    } catch (e) {
        console.error('恢复背景色失败:', e);
    }
}

/**
 * 判断颜色是否为深色（需要浅色文字）
 * @param {string} color - 颜色值（十六进制）
 * @returns {boolean} 是否为深色
 */
function isDarkColor(color) {
    // 移除 # 号
    color = color.replace('#', '');
    
    // 转换为 RGB
    let r, g, b;
    if (color.length === 3) {
        r = parseInt(color[0] + color[0], 16);
        g = parseInt(color[1] + color[1], 16);
        b = parseInt(color[2] + color[2], 16);
    } else if (color.length === 6) {
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
    } else {
        return false;
    }
    
    // 计算亮度（使用标准的相对亮度公式）
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 亮度低于 128 视为深色
    return brightness < 128;
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
            
            // 如果有选中的组件，更新其颜色
            const selectedComp = document.querySelector('.wechat-component.selected');
            if (selectedComp && selectedComp.dataset.componentId) {
                updateComponentColor(selectedComp, currentColor);
            }
            
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
        // 优先用selection-change已保存的位置，避免getSelection返回null时覆盖
        const selection = quill.getSelection();
        if (selection) {
            savedCursorPosition = selection.index;
        }
        // 如果savedCursorPosition还没设置过，则用末尾
        if (savedCursorPosition === null) {
            savedCursorPosition = quill.getLength() - 1;
        }
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
    let previewHtml = getComponentPreview(currentPreviewComponent, currentColor, fieldValues);
    
    // 应用文字颜色
    if (currentTextColor) {
        previewHtml = applyTextColorToHtml(previewHtml, currentTextColor);
    }
    
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
                    <div class="text-color-picker-wrapper">
                        <label>文字颜色</label>
                        <div class="text-color-picker">
                            ${TEXT_COLORS.map(c => `
                                <span class="text-color-swatch ${c.color === '' ? 'default' : ''} ${c.color === currentTextColor ? 'active' : ''}" 
                                      data-color="${c.color}"
                                      style="${c.color ? 'background-color: ' + c.color + '; color: ' + c.color + ';' : ''}"
                                      title="${c.name}">
                                    ${c.color === '' ? '默认' : ''}
                                </span>
                            `).join('')}
                            <input type="color" class="text-color-custom" value="${currentTextColor || '#333333'}" title="自定义颜色">
                        </div>
                    </div>
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
    
    // 绑定文字颜色选择事件
    bindTextColorEvents(modal);
    
    return modal;
}

/**
 * 初始化预览弹窗（备用）
 */
function initPreviewModal() {
    // 弹窗会在首次需要时动态创建
}

/**
 * 绑定文字颜色选择事件
 * @param {HTMLElement} modal - 弹窗元素
 */
function bindTextColorEvents(modal) {
    const textColorPicker = modal.querySelector('.text-color-picker');
    if (!textColorPicker) return;
    
    textColorPicker.querySelectorAll('.text-color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            textColorPicker.querySelectorAll('.text-color-swatch').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            currentTextColor = this.dataset.color;
            
            // 更新自定义颜色输入框
            const customInput = textColorPicker.querySelector('.text-color-custom');
            if (customInput && currentTextColor) {
                customInput.value = currentTextColor;
            }
            
            // 更新预览
            updateModalPreview();
        });
    });
    
    // 自定义颜色输入
    const customInput = textColorPicker.querySelector('.text-color-custom');
    if (customInput) {
        customInput.addEventListener('input', function() {
            textColorPicker.querySelectorAll('.text-color-swatch').forEach(s => s.classList.remove('active'));
            currentTextColor = this.value;
            updateModalPreview();
        });
    }
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
 * 应用文字颜色到HTML内容（给p和span标签添加color样式）
 * @param {string} html - 原始HTML
 * @param {string} color - 颜色值
 * @returns {string} 应用颜色后的HTML
 */
function applyTextColorToHtml(html, color) {
    if (!color) return html;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 给所有p标签添加文字颜色
    doc.querySelectorAll('p').forEach(el => {
        el.style.color = color;
    });
    
    // 给所有span标签添加文字颜色
    doc.querySelectorAll('span').forEach(el => {
        el.style.color = color;
    });
    
    return doc.body.innerHTML;
}

/**
 * 更新选中组件的颜色
 */
function updateComponentColor(componentEl, newColor) {
    const componentId = componentEl.dataset.componentId;
    const fieldValues = componentEl.dataset.fieldValues ? JSON.parse(componentEl.dataset.fieldValues) : {};
    
    const component = findComponentById(componentId);
    if (!component) return;
    
    const fields = component.getFields ? component.getFields() : [];
    const processedValues = processFieldValues(fields, fieldValues);
    const html = component.getHtml(newColor, processedValues);
    
    componentEl.innerHTML = html;
    componentEl.dataset.componentColor = newColor;
    
    syncToPreview();
    showToast('组件颜色已更新', 'success');
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
        let html = currentPreviewComponent.getHtml(currentColor, processedValues);
        
        // 应用文字颜色
        if (currentTextColor) {
            html = applyTextColorToHtml(html, currentTextColor);
        }
        
        // 使用保存的光标位置（而非默认末尾）
        let insertIndex = savedCursorPosition !== null ? savedCursorPosition : quill.getLength() - 1;
        
        // 使用Quill API插入自定义Blot（携带元数据）
        quill.insertEmbed(insertIndex, 'wechat-component', {
            html: html,
            componentId: currentPreviewComponent.id,
            fieldValues: fieldValues,
            color: currentColor,
            textColor: currentTextColor || ''  // 保存文字颜色
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
    // 重置文字颜色
    currentTextColor = '';
}

/**
 * 编辑已有组件（双击触发）
 */
function editComponent(componentEl) {
    const componentId = componentEl.dataset.componentId;
    const fieldValues = componentEl.dataset.fieldValues ? JSON.parse(componentEl.dataset.fieldValues) : {};
    const color = componentEl.dataset.componentColor || '#1a73e8';
    const textColor = componentEl.dataset.textColor || '';  // 读取已保存的文字颜色
    
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
    
    // 打开编辑弹窗（传入初始值，包含文字颜色）
    showComponentEditModal(component, fieldValues, color, textColor);
}

/**
 * 显示编辑弹窗（复用预览弹窗结构，预填值）
 */
function showComponentEditModal(component, fieldValues, color, textColor) {
    currentColor = color;
    currentTextColor = textColor || '';  // 恢复已保存的文字颜色
    
    // 创建弹窗
    let modal = document.querySelector('.component-preview-modal');
    if (!modal) {
        modal = createPreviewModal();
        document.body.appendChild(modal);
    } else {
        // 弹窗已存在，需要重新生成文字颜色选择器以更新 currentTextColor
        const textColorWrapper = modal.querySelector('.text-color-picker-wrapper');
        if (textColorWrapper) {
            textColorWrapper.innerHTML = `
                <label>文字颜色</label>
                <div class="text-color-picker">
                    ${TEXT_COLORS.map(c => `
                        <span class="text-color-swatch ${c.color === '' ? 'default' : ''} ${c.color === currentTextColor ? 'active' : ''}" 
                              data-color="${c.color}"
                              style="${c.color ? 'background-color: ' + c.color + '; color: ' + c.color + ';' : ''}"
                              title="${c.name}">
                            ${c.color === '' ? '默认' : ''}
                        </span>
                    `).join('')}
                    <input type="color" class="text-color-custom" value="${currentTextColor || '#333333'}" title="自定义颜色">
                </div>
            `;
            // 重新绑定事件
            bindTextColorEvents(modal);
        }
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
        let html = currentPreviewComponent.getHtml(currentColor, processedValues);
        
        // 应用文字颜色
        if (currentTextColor) {
            html = applyTextColorToHtml(html, currentTextColor);
        }
        
        // 就地更新组件DOM
        editingComponentElement.innerHTML = html;
        editingComponentElement.dataset.componentId = currentPreviewComponent.id;
        editingComponentElement.dataset.fieldValues = JSON.stringify(fieldValues);
        editingComponentElement.dataset.componentColor = currentColor;
        editingComponentElement.dataset.textColor = currentTextColor || '';  // 保存文字颜色
        
        // 同步预览
        syncToPreview();
        
        showToast('组件已更新', 'success');
    } catch (e) {
        console.error('更新组件失败:', e);
        showToast('更新失败，请重试', 'error');
    }
    
    editingComponentElement = null;
    // 重置文字颜色
    currentTextColor = '';
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

// ==================== 导入公众号文章功能 ====================

/**
 * CORS代理列表
 */
const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
];

/**
 * 显示导入文章弹窗
 */
function showImportArticleModal() {
    // 创建弹窗
    let modal = document.querySelector('.import-article-modal');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'import-modal-overlay';
    modal.innerHTML = `
        <div class="import-modal-content">
            <div class="import-modal-header">
                <h4>📥 导入公众号文章</h4>
                <button class="import-modal-close">×</button>
            </div>
            
            <!-- Tab切换 -->
            <div class="import-tabs">
                <button class="import-tab active" data-tab="auto">自动导入</button>
                <button class="import-tab" data-tab="manual">手动导入</button>
            </div>
            
            <!-- 自动导入面板 -->
            <div class="import-panel active" id="auto-import-panel">
                <div class="import-hint">
                    <p>📌 请确保文章是公开可访问的微信公众号文章链接</p>
                    <p class="import-hint-small">例如：https://mp.weixin.qq.com/s/xxxxx</p>
                </div>
                <div class="import-url-input-wrapper">
                    <input type="text" id="import-url-input" placeholder="粘贴公众号文章链接" autocomplete="off">
                </div>
                <div class="import-actions">
                    <button class="btn-import-cancel">取消</button>
                    <button class="btn-import-start">开始导入</button>
                </div>
                <div class="import-loading" style="display: none;">
                    <div class="import-spinner"></div>
                    <span>正在抓取文章...</span>
                </div>
                <div class="import-error" style="display: none;"></div>
            </div>
            
            <!-- 手动导入面板 -->
            <div class="import-panel" id="manual-import-panel">
                <div class="import-hint">
                    <p>🔧 如果自动导入失败，可以使用手动方式：</p>
                    <ol class="import-steps">
                        <li>在浏览器中打开要导入的文章</li>
                        <li>右键选择「查看网页源代码」或按 Ctrl+U</li>
                        <li>全选复制所有内容（Ctrl+A → Ctrl+C）</li>
                        <li>粘贴到下方文本框中</li>
                    </ol>
                </div>
                <div class="import-source-wrapper">
                    <textarea id="import-source-input" placeholder="在这里粘贴网页源代码..."></textarea>
                </div>
                <div class="import-actions">
                    <button class="btn-import-cancel">取消</button>
                    <button class="btn-import-manual">解析导入</button>
                </div>
                <div class="import-loading" style="display: none;">
                    <div class="import-spinner"></div>
                    <span>正在解析...</span>
                </div>
                <div class="import-error" style="display: none;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 显示动画
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    // 关闭按钮
    modal.querySelector('.import-modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelectorAll('.btn-import-cancel').forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    // Tab切换
    modal.querySelectorAll('.import-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            modal.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.import-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            modal.querySelector(`#${tabName}-import-panel`).classList.add('active');
        });
    });
    
    // 自动导入按钮
    modal.querySelector('.btn-import-start').addEventListener('click', () => {
        const url = modal.querySelector('#import-url-input').value.trim();
        if (!url) {
            showImportError(modal, '请输入文章链接');
            return;
        }
        if (!isWechatArticleUrl(url)) {
            showImportError(modal, '请输入正确的公众号文章链接');
            return;
        }
        importArticleFromUrl(url, modal);
    });
    
    // 自动导入回车事件
    modal.querySelector('#import-url-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const url = modal.querySelector('#import-url-input').value.trim();
            if (url && isWechatArticleUrl(url)) {
                importArticleFromUrl(url, modal);
            }
        }
    });
    
    // 手动导入按钮
    modal.querySelector('.btn-import-manual').addEventListener('click', () => {
        const source = modal.querySelector('#import-source-input').value.trim();
        if (!source) {
            showImportError(modal, '请粘贴网页源代码');
            return;
        }
        importArticleFromSource(source, modal);
    });
}

/**
 * 显示导入错误
 */
function showImportError(modal, message) {
    const errorEl = modal.querySelector('.import-error');
    const loadingEl = modal.querySelector('.import-loading');
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/**
 * 隐藏导入错误
 */
function hideImportError(modal) {
    const errorEl = modal.querySelector('.import-error');
    if (errorEl) errorEl.style.display = 'none';
}

/**
 * 显示加载状态
 */
function showImportLoading(modal) {
    const loadingEl = modal.querySelector('.import-loading');
    if (loadingEl) {
        loadingEl.style.display = 'flex';
    }
    hideImportError(modal);
    // 禁用按钮
    modal.querySelectorAll('.btn-import-start, .btn-import-manual').forEach(btn => {
        btn.disabled = true;
    });
}

/**
 * 隐藏加载状态
 */
function hideImportLoading(modal) {
    const loadingEl = modal.querySelector('.import-loading');
    if (loadingEl) {
        loadingEl.style.display = 'none';
    }
    // 启用按钮
    modal.querySelectorAll('.btn-import-start, .btn-import-manual').forEach(btn => {
        btn.disabled = false;
    });
}

/**
 * 检查是否为微信公众号文章链接
 */
function isWechatArticleUrl(url) {
    return url.includes('mp.weixin.qq.com') && (url.includes('/s/') || url.includes('/news/'));
}

/**
 * 从URL导入文章
 */
async function importArticleFromUrl(url, modal) {
    showImportLoading(modal);
    
    let success = false;
    let lastError = null;
    
    // 尝试使用多个CORS代理
    for (const proxyBase of CORS_PROXIES) {
        try {
            const proxyUrl = proxyBase + encodeURIComponent(url);
            const response = await fetch(proxyUrl, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const html = await response.text();
            
            if (html && html.length > 1000) {
                const result = extractArticleContent(html);
                if (result) {
                    importArticleContent(result, modal);
                    success = true;
                    break;
                }
            }
        } catch (error) {
            lastError = error;
            console.log(`代理 ${proxyBase} 失败:`, error);
        }
    }
    
    if (!success) {
        // 所有代理都失败，提示使用手动导入
        hideImportLoading(modal);
        showImportError(modal, '自动抓取失败，请尝试手动导入方式');
        
        // 切换到手动导入Tab
        setTimeout(() => {
            modal.querySelectorAll('.import-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.import-panel').forEach(p => p.classList.remove('active'));
            modal.querySelector('[data-tab="manual"]').classList.add('active');
            modal.querySelector('#manual-import-panel').classList.add('active');
        }, 1500);
    }
}

/**
 * 从源代码导入文章
 */
function importArticleFromSource(source, modal) {
    showImportLoading(modal);
    
    try {
        const result = extractArticleContent(source);
        if (result) {
            importArticleContent(result, modal);
        } else {
            hideImportLoading(modal);
            showImportError(modal, '无法解析文章内容，请确认源代码是否正确');
        }
    } catch (error) {
        hideImportLoading(modal);
        showImportError(modal, '解析失败：' + error.message);
    }
}

/**
 * CSS 样式内联化函数
 * 将 <style> 标签中的 CSS 类样式应用到对应元素的内联 style 上
 * @param {Document} doc - DOM文档对象
 * @returns {Document} 处理后的文档对象
 */
function inlineCssStyles(doc) {
    // 获取所有style标签中的CSS规则
    const styleSheets = doc.querySelectorAll('style');
    const cssRules = [];
    
    styleSheets.forEach(sheet => {
        try {
            // 解析CSS文本
            const text = sheet.textContent;
            // 简单解析CSS规则：选择器 { 属性: 值; ... }
            const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
            let match;
            while ((match = ruleRegex.exec(text)) !== null) {
                const selector = match[1].trim();
                const properties = match[2].trim();
                // 只处理简单的类选择器、ID选择器和标签选择器
                if (selector.startsWith('.') || selector.startsWith('#') || /^[a-z][a-z0-9]*$/i.test(selector)) {
                    cssRules.push({ selector, properties });
                }
            }
        } catch(e) {
            console.log('解析CSS样式失败:', e);
        }
    });
    
    // 将CSS规则应用到元素上
    cssRules.forEach(({ selector, properties }) => {
        try {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
                const existingStyle = el.getAttribute('style') || '';
                // 避免重复添加相同属性
                if (!existingStyle.includes(properties.split(':')[0].trim())) {
                    el.setAttribute('style', existingStyle + properties + ';');
                }
            });
        } catch(e) {
            // 忽略无效的选择器
        }
    });
    
    return doc;
}

/**
 * 提取文章内容
 */
function extractArticleContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 查找正文内容容器
    let contentEl = doc.querySelector('#js_content') || 
                    doc.querySelector('.rich_media_content') ||
                    doc.querySelector('[id="js_content"]');
    
    if (!contentEl) {
        return null;
    }
    
    // 【修复问题一】在移除 <style> 标签之前，先将 CSS 类样式内联化
    inlineCssStyles(doc);
    
    // 获取正文HTML
    let contentHtml = contentEl.innerHTML;
    
    // 处理懒加载图片：将 data-src 转为 src
    contentHtml = contentHtml.replace(/data-src="([^"]+)"/g, (match, url) => {
        return `src="${url}" data-src="${url}"`;
    });
    
    // 处理 data-original 等其他懒加载属性
    contentHtml = contentHtml.replace(/data-original="([^"]+)"/g, (match, url) => {
        return `src="${url}" data-original="${url}"`;
    });
    
    // 清理不需要的元素
    contentHtml = cleanImportedContent(contentHtml);
    
    // 【修复问题一】保留标题的HTML结构（不只是纯文本）
    let title = '';
    let titleHtml = '';
    const titleEl = doc.querySelector('#activity-name') || 
                    doc.querySelector('.rich_media_title h1') ||
                    doc.querySelector('h1');
    if (titleEl) {
        title = titleEl.textContent.trim();
        // 获取标题的 outerHTML 以保留样式
        titleHtml = titleEl.outerHTML;
    }
    
    return {
        html: contentHtml,
        title: title,
        titleHtml: titleHtml
    };
}

/**
 * 清理导入的内容
 * 【重要】保留 style 标签和 class 属性，让预览区能正确显示样式
 * 导出时再进行CSS内联化和清理
 */
function cleanImportedContent(html) {
    // 移除script标签（安全性）
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // 【修复问题一】不再移除style标签，保留导入文章的样式
    // html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // 移除svg动画等（可能影响渲染）
    html = html.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
    
    // 移除微信交互元素（关注按钮、分享按钮等）
    html = html.replace(/<div[^>]*class="[^"]*(?:follow|share|like|comment)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    
    // 移除data-src但src为空的img标签
    html = html.replace(/<img([^>]*)src="[^"]*"/gi, (match, attrs) => {
        if (attrs.includes('data-src') && !attrs.includes('src="http')) {
            return '';
        }
        return match;
    });
    
    // 【修复问题二】正确处理图片尺寸：保留已有尺寸信息
    html = html.replace(/<img([^>]*)>/gi, (match, attrs) => {
        // 检查图片是否已有明确的宽度或高度设置
        const hasWidth = /(^|\s)width\s*:/i.test(attrs) || /(^|\s)width\s*=/i.test(attrs);
        const hasHeight = /(^|\s)height\s*:/i.test(attrs) || /(^|\s)height\s*=/i.test(attrs);
        const hasWidthAttr = /\swidth\s*=\s*["']?\d/i.test(attrs);
        const hasHeightAttr = /\sheight\s*=\s*["']?\d/i.test(attrs);
        
        // 如果已有明确的尺寸设置，保留原样
        if ((hasWidth || hasWidthAttr) && !attrs.includes('max-width: 100%') && !attrs.includes('max-width:100%')) {
            return match;
        }
        
        // 如果没有明确的尺寸设置，添加默认的响应式样式
        if (!hasWidth && !hasWidthAttr) {
            // 检查是否已有style属性
            if (attrs.includes('style=')) {
                // 追加样式
                return match.replace(/style="([^"]*)"/, 'style="$1max-width: 100%; height: auto;"');
            } else {
                // 添加style属性
                return `<img${attrs} style="max-width: 100%; height: auto;">`;
            }
        }
        
        return match;
    });
    
    // 【修复问题一】不再移除class属性，保留样式引用
    // html = html.replace(/\sclass="[^"]*"/gi, (match) => {
    //     if (match.includes('section')) {
    //         return match;
    //     }
    //     return '';
    // });
    
    // 清理多余的空白
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/>\s+</g, '><');
    
    return html.trim();
}

/**
 * 将提取的内容导入编辑器
 * 【修复问题一】使用 WechatComponentBlot 方式插入，避免 Quill 过滤样式
 */
function importArticleContent(result, modal) {
    // 关闭弹窗
    closeModal(modal);
    
    // 【修复问题一】将文章HTML作为组件插入，避免 Quill 过滤样式
    const componentValue = {
        html: result.html,
        componentId: 'imported-article',
        fieldValues: {},
        color: '#1a73e8'
    };
    
    // 在光标位置或编辑器末尾插入组件
    const cursorPos = savedCursorPosition || quill.getLength() - 1;
    quill.insertEmbed(cursorPos, 'wechat-component', componentValue, Quill.sources.USER);
    quill.setSelection(cursorPos + 1, 0);
    
    // 更新预览
    syncToPreview();
    
    // 显示成功提示
    if (result.title) {
        showToast(`「${result.title}」已导入`, 'success');
    } else {
        showToast('文章已导入成功', 'success');
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
