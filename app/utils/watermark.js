/*
 * @Author: your name
 * @Date: 2020-12-03 15:09:14
 * @LastEditTime: 2020-12-03 15:10:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /webpack4/app/utils/watermark.js
 */
const watermark = {};
var globalSetting = {};

const option = {
    'childList': true,
    'attributes': true,
    'subtree': true,
    'attributeFilter': ['style'],
    'attributeOldValue': true
};
const recordOldValue = {
    width: 0,
    height: 0
};
const defaultSettings = {
    // 水印总体的id
    watermarkId: 'wm_div_id',
    // 小水印的id前缀
    watermarkPrefix: 'mask_div_id',
    // 水印的内容
    watermarkTxt: '',
    // 水印起始位置x轴坐标
    watermarkX: 20,
    // 水印起始位置Y轴坐标
    watermarkY: 20,
    // 水印行数
    watermarkRows: 0,
    // 水印列数
    watermarkCols: 0,
    // 水印x轴间隔
    watermarkXSpace: 50,
    // 水印y轴间隔
    watermarkYSpace: 50,
    // 水印字体
    watermarkFont: '微软雅黑',
    // 水印字体颜色
    watermarkColor: 'black',
    // 水印字体大小
    watermarkFontsize: '18px',
    // 水印透明度，要求设置在大于等于0.005
    watermarkAlpha: 0.15,
    // 水印宽度
    watermarkWidth: 100,
    // 水印长度
    watermarkHeight: 100,
    // 水印倾斜度数
    watermarkAngle: 15,
    // 水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值
    watermarkParentWidth: 0,
    // 水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值
    watermarkParentHeight: 0,
    // 水印插件挂载的父元素element,不输入则默认挂在body上
    watermarkParentNode: null,
    // monitor 是否监控， true: 不可删除水印; false: 可删水印
    monitor: true,
    // 缩进, 默认偶数行缩进
    watermarkIndentation: 50,
};
// 监听dom是否被移除或者改变属性的回调函数
const callback = function (records) {
    if ((
        globalSetting && records.length === 1)
        || records.length === 1
        && records[0].removedNodes.length >= 1) {
        loadMark(globalSetting);
        return;
    }

    // 监听父节点的尺寸是否发生了变化, 如果发生改变, 则进行重新绘制
    const watermark_parent_element = defaultSettings.watermarkParentNode;
    if (watermark_parent_element) {
        const newWidth = getComputedStyle(watermark_parent_element).getPropertyValue('width');
        const newHeight = getComputedStyle(watermark_parent_element).getPropertyValue('height');
        if (newWidth !== recordOldValue.width || newHeight !== recordOldValue.height) {
            recordOldValue.width = newWidth;
            recordOldValue.height = newHeight;
            loadMark(globalSetting);
        }
    }
};
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
const watermarkDom = new MutationObserver(callback);
/*加载水印*/
const loadMark = function (settings) {
    /*采用配置项替换默认值，作用类似jquery.extend*/
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        var src = arguments[0] || {};
        for (let key in src) {
            if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) {
                continue;
            }
            /*veronic: resolution of watermarkAngle=0 not in force*/
            else if (src[key] || src[key] === 0) {
                defaultSettings[key] = src[key];
            }
        }
    }

    /*如果元素存在则移除*/
    var watermark_element = document.getElementById(defaultSettings.watermarkId);
    watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element);

    /*如果设置水印挂载的父元素的id*/
    const watermark_parent_element = defaultSettings.watermarkParentNode;
    const watermark_hook_element = watermark_parent_element || document.body;

    /*获取页面宽度*/
    // var page_width = Math.max(watermark_hook_element.scrollWidth,watermark_hook_element.clientWidth) - defaultSettings.watermarkWidth/2;
    var page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth);
    /*获取页面最大长度*/
    // var page_height = Math.max(watermark_hook_element.scrollHeight,watermark_hook_element.clientHeight,document.documentElement.clientHeight)-defaultSettings.watermarkHeight/2;
    var page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight);

    var setting = arguments[0] || {};
    var parentEle = watermark_hook_element;

    var page_offsetTop = 0;
    var page_offsetLeft = 0;
    if (setting.watermarkParentWidth || setting.watermarkParentHeight) {
        /*指定父元素同时指定了宽或高*/
        if (parentEle) {
            page_offsetTop = parentEle.offsetTop || 0;
            page_offsetLeft = parentEle.offsetLeft || 0;
            defaultSettings.watermarkX = defaultSettings.watermarkX + page_offsetLeft;
            defaultSettings.watermarkY = defaultSettings.watermarkY + page_offsetTop;
        }
    } else {
        if (parentEle) {
            page_offsetTop = parentEle.offsetTop || 0;
            page_offsetLeft = parentEle.offsetLeft || 0;
        }
    }

    /*创建水印外壳div*/
    var otdiv = document.getElementById(defaultSettings.watermarkId);
    var shadowRoot = null;

    if (!otdiv) {

        otdiv = document.createElement('div');
        /*创建shadow dom*/
        otdiv.id = defaultSettings.watermarkId;
        otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important');
        /*判断浏览器是否支持attachShadow方法*/
        if (typeof otdiv.attachShadow === 'function') {
            /* createShadowRoot Deprecated. Not for use in new websites. Use attachShadow*/
            shadowRoot = otdiv.attachShadow({mode: 'open'});
        } else {
            shadowRoot = otdiv;
        }
        /*将shadow dom随机插入body内的任意位置*/
        var nodeList = watermark_hook_element.children;
        var index = Math.floor(Math.random() * (nodeList.length - 1));
        if (nodeList[index]) {
            watermark_hook_element.insertBefore(otdiv, nodeList[index]);
        } else {
            watermark_hook_element.appendChild(otdiv);
        }
    } else if (otdiv.shadowRoot) {
        shadowRoot = otdiv.shadowRoot;
    }
    /*三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度*/
    defaultSettings.watermarkCols
        = parseInt((
            page_width - defaultSettings.watermarkX)
            / (defaultSettings.watermarkWidth + defaultSettings.watermarkXSpace));
    var temp_watermarkXSpace
        = parseInt((
            page_width - defaultSettings.watermarkX
            - defaultSettings.watermarkWidth * defaultSettings.watermarkCols)
            / (defaultSettings.watermarkCols));
    defaultSettings.watermarkXSpace
        = temp_watermarkXSpace ? defaultSettings.watermarkXSpace : temp_watermarkXSpace;
    var allWatermarkWidth;

    /*三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度*/
    defaultSettings.watermarkRows
        = parseInt((
            page_height - defaultSettings.watermarkY)
            / (defaultSettings.watermarkHeight + defaultSettings.watermarkYSpace));
    var temp_watermarkYSpace
        = parseInt((
            page_height - defaultSettings.watermarkY
            - defaultSettings.watermarkHeight * defaultSettings.watermarkRows)
            / (defaultSettings.watermarkRows));
    defaultSettings.watermarkYSpace
        = temp_watermarkYSpace ? defaultSettings.watermarkYSpace : temp_watermarkYSpace;
    var allWatermarkHeight;

    if (watermark_parent_element) {
        allWatermarkWidth
            = defaultSettings.watermarkX
            + defaultSettings.watermarkWidth * defaultSettings.watermarkCols
            + defaultSettings.watermarkXSpace * (defaultSettings.watermarkCols - 1);
        allWatermarkHeight
            = defaultSettings.watermarkY
            + defaultSettings.watermarkHeight * defaultSettings.watermarkRows
            + defaultSettings.watermarkYSpace * (defaultSettings.watermarkRows - 1);
    } else {
        allWatermarkWidth
            = page_offsetLeft + defaultSettings.watermarkX
            + defaultSettings.watermarkWidth * defaultSettings.watermarkCols
            + defaultSettings.watermarkXSpace * (defaultSettings.watermarkCols - 1);
        allWatermarkHeight
            = page_offsetTop + defaultSettings.watermarkY
            + defaultSettings.watermarkHeight * defaultSettings.watermarkRows
            + defaultSettings.watermarkYSpace * (defaultSettings.watermarkRows - 1);
    }

    var x;
    var y;
    for (var i = 0; i < defaultSettings.watermarkRows; i++) {
        if (watermark_parent_element) {
            // y = i === 0 ? defaultSettings.watermarkY : page_offsetTop + defaultSettings.watermarkY + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermarkYSpace + defaultSettings.watermarkHeight) * (i-1);
            y = page_offsetTop
                + defaultSettings.watermarkY
                + (page_height - allWatermarkHeight) / 2
                + (defaultSettings.watermarkYSpace + defaultSettings.watermarkHeight) * i;
        } else {
            // y = i === 0 ? defaultSettings.watermarkY : defaultSettings.watermarkY + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermarkYSpace + defaultSettings.watermarkHeight) * (i-1);
            y = defaultSettings.watermarkY
                + (page_height - allWatermarkHeight) / 2
                + (defaultSettings.watermarkYSpace + defaultSettings.watermarkHeight) * i;
        }
        for (var j = 0; j <= defaultSettings.watermarkCols; j++) {
            if (watermark_parent_element) {
                x = page_offsetLeft
                    + defaultSettings.watermarkX
                    + (page_width - allWatermarkWidth) / 2
                    + (defaultSettings.watermarkWidth + defaultSettings.watermarkXSpace) * j;
            } else {
                x = defaultSettings.watermarkX
                    + (page_width - allWatermarkWidth) / 2
                    + (defaultSettings.watermarkWidth + defaultSettings.watermarkXSpace) * (j - 1);
            }
            // 奇数行缩进
            // 因为默认 第一列 / 第一行 开始就会计算间距, 所以缩进要计算后的 x 减去设置 or 默认的缩进距离
            if (i % 2 !== 0) {
                x = x - defaultSettings.watermarkIndentation;
            }
            var mask_div = document.createElement('div');
            // var oText=document.createTextNode(defaultSettings.watermarkTxt);
            // mask_div.appendChild(oText);
            mask_div.innerHTML = defaultSettings.watermarkTxt;
            /*设置水印相关属性start*/
            mask_div.id = defaultSettings.watermarkPrefix + i + j;
            // 设置水印位置
            mask_div.style.left = x + 'px';
            mask_div.style.top = y + 'px';
            /*设置水印div倾斜显示*/
            mask_div.style.webkitTransform = 'rotate(-' + defaultSettings.watermarkAngle + 'deg)';
            mask_div.style.MozTransform = 'rotate(-' + defaultSettings.watermarkAngle + 'deg)';
            mask_div.style.msTransform = 'rotate(-' + defaultSettings.watermarkAngle + 'deg)';
            mask_div.style.OTransform = 'rotate(-' + defaultSettings.watermarkAngle + 'deg)';
            mask_div.style.transform = 'rotate(-' + defaultSettings.watermarkAngle + 'deg)';
            mask_div.style.visibility = '';
            mask_div.style.position = 'absolute';
            /*选不中*/

            mask_div.style.overflow = 'hidden';
            mask_div.style.zIndex = '-9999999';
            mask_div.style.opacity = defaultSettings.watermarkAlpha;
            mask_div.style.fontSize = defaultSettings.watermarkFontsize;
            mask_div.style.fontFamily = defaultSettings.watermarkFont;
            mask_div.style.color = defaultSettings.watermarkColor;
            mask_div.style.textAlign = 'center';
            // mask_div.style.width = defaultSettings.watermarkWidth + 'px';
            mask_div.style.whiteSpace = 'nowrap';
            mask_div.style.width = 'auto';
            mask_div.style.height = defaultSettings.watermarkHeight + 'px';
            mask_div.style.display = 'block';
            mask_div.style['-ms-user-select'] = 'none';
            /*设置水印相关属性end*/
            shadowRoot.appendChild(mask_div);
        }
    }

    // monitor 是否监控， true: 不可删除水印; false: 可删水印。
    const minotor = settings.monitor === undefined ? defaultSettings.monitor : settings.monitor;
    if (minotor) {
        watermarkDom.observe(watermark_hook_element, option);
        watermarkDom.observe(document.getElementById(defaultSettings.watermarkId).shadowRoot, option);
    }
};

// 移除水印
const removeMark = function () {
    /*采用配置项替换默认值，作用类似jquery.extend*/
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        let src = arguments[0] || {};
        for (let key in src) {
            if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) {
                continue;
            }
            /*veronic: resolution of watermarkAngle=0 not in force*/
            else if (src[key] || src[key] === 0) {
                defaultSettings[key] = src[key];
            }
        }
    }

    // 移除水印
    const watermark_element = document.getElementById(defaultSettings.watermarkId);
    const _parentElement = watermark_element.parentNode;
    _parentElement.removeChild(watermark_element);
    // :ambulance: remove()
    // minotor 这个配置有些冗余
    // 如果用 MutationObserver 来监听dom变化防止删除水印
    // remove() 方法里用 MutationObserver 的 disconnect() 解除监听即可
    watermarkDom.disconnect();
};

// 初始化水印，添加load和resize事件
watermark.init = function (settings) {
    globalSetting = settings;
    loadMark(settings);
    window.addEventListener('onload', function () {
        loadMark(settings);
    });
    window.addEventListener('resize', function () {
        loadMark(settings);
    });
};

/*手动加载水印*/
watermark.load = function (settings) {
    globalSetting = settings;
    loadMark(settings);
};

/*手动移除水印*/
watermark.remove = function () {
    removeMark();
};


export default watermark;