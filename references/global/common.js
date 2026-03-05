var CART_COUNT, CART_TOTAL, components, googleTokenClient, HEADER_STICKY_HEIGHT;
window['COMMON_LANG'] = TRANSLATES['common'];
window['BLOCK_JS'] = {};
window['SNIPPET_JS'] = {};
window['components'] = {};
window['HEADER_STICKY_HEIGHT'] = 0;
window['googleTokenClient'] = null;

function getLocale() {
    const lang = LANGUAGE || 'tr';
    const localeMap = {
        ar: 'ar',
        fa: 'fa',
        ku: 'ku',
        kg: 'ky-KG',
        ua: 'uk-UA',
        az: 'az',
        en: 'en-US',
        pt: 'pt-PT', 
        cs: 'cs-CZ',
        el: 'el-GR',
        sl: 'sl-SI',
        ka: 'ka-GE', 
        bs: 'bs-BA',
    };
    if (localeMap[lang]) return localeMap[lang];
    return lang + '-' + lang.toUpperCase();
}

const LoginPageTracking = {
    Callback: {},
    callbackArray: []
};
const SignPageTracking = {
    Callback: () => {}
};
const QuickViewObj = {
    callback: {
        open: []
    }
};
const OrderCallback = {
    address: [],
    payment: [],
    paymentChange: [],
    approve: [],
}
const productLoaderCallback = [];

async function request(method = null, url = null, data = null, accept = null) {
    if (url == null) {
        console.warn('request warn: url null');
        return;
    }

    if (method == null) method = 'GET';
    method = method.toUpperCase();

    const headers = {
        'Accept-Language': LANGUAGE || 'tr',
    };

    if (accept == 'JSON') headers['Accept'] = 'application/json';

    const options = {
        method: method,
        headers: headers,
        body: data
    };
    return fetch(url, options).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json();
        } else {
            return response.text();
        }
    }).then(text => {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }).catch(error => {
        throw error;
    });
}

const LocalApi = {
    get: (key, def = false) => {
        try {
            const obj = JSON.parse(localStorage.getItem(key));
            let now = new Date().getTime();
            if(Number.isNaN(obj.timeout) || obj.timeout < 1000000000) {
                obj.timeout = 1000000000;
            } else if (obj.timeout < 9000000000) {
                obj.timeout = obj.timeout * 1000;
            }
            if (obj.timeout && obj.timeout < now) {
                return def;
            }
            return typeof obj.value !== 'undefined' ? obj.value : def;
        } catch (ex) {
            return def;
        }
    },
    set: (key, val, timeout) => {
        try {
            timeout = Number.parseInt(timeout) > 0 ? timeout : 365 * 24 * 3600;
            let obj = { value: val, timeout: new Date().getTime() + (1000 * timeout) };
            localStorage.setItem(key, JSON.stringify(obj));
            return true;
        } catch (ex) {
            return false;
        }
    },
    remove: key => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (ex) {
            return false;
        }
    }
}

const scrollBehavior = function(href = null, height, trigger = false) {
    const top = height != null && typeof height == 'number' ? height : 0;
    const element = typeof href == 'object' && href != null ? href : (href != null ? document.querySelector(href) : null);
    if (element == null) {
        console.warn('scrollBehavior warn: element null');
        return;
    };

    if (trigger) element.click();

    let elementRect = element.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();

    let topRelativeToBody = elementRect.top - bodyRect.top - top;

    scroll({
        top: topRelativeToBody,
        behavior: "smooth"
    });
}

const loader = function(status = false) {
    if (status == true) {
        document.body.classList.add('is-loading');
    } else {
        document.body.classList.remove('is-loading');
    }
}

const addClass = function(element, cls) {
    cls = cls.split(' ');
    for (let i = 0; i < element.length; i++) {
        element[i].classList.add(...cls);
    }
}

const removeClass = function(element, cls) {
    cls = cls.split(' ');
    for (let i = 0; i < element.length; i++) {
        element[i].classList.remove(...cls);
    }
}

const toggleClass = function(element, cls) {
    cls = cls.split(' ');
    for (let i = 0; i < element.length; i++) {
        cls.map(c => element[i].classList.toggle(c));
    }
}

const getUrlParam = function(key = '', url = document.location) {
    if (key == '') {
        console.warn('getUrlParam warn: key undefined');
        return;
    };

    url = new URL(url);
    const params = url.searchParams;
    return params.get(key);
}

const setUrlParam = function(key = '', value = '' , url = document.location) {
    if (key == '') {
        console.warn('setUrlParam warn: key undefined');
        return;
    };

    url = new URL(url);
    const params = url.searchParams;
    params.set(key, value);
    return url;
}

const deleteUrlParam = function(key = '', url = document.location) {
    if (key == '') {
        console.warn('deleteUrlParam warn: key undefined');
        return;
    };

    url = new URL(url);
    const params = url.searchParams;
    params.delete(key);
    return url;
}

const setCookie = function(cookieName, cookieValue, ExDays) {
    let d = new Date();
    d.setTime(d.getTime() + (ExDays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cookieName + '=' + cookieValue + ';' + expires + ';path=/';
}

const getCookie = function(cookieName) {
    let name = cookieName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

const browser = function() {
    const browserItem = navigator.userAgent;
    if (browserItem.indexOf('Firefox') > -1) {
        return 'Mozilla Firefox';
    } else if (browserItem.indexOf('Opera') > -1 || browserItem.indexOf('OPR') > -1) {
        return 'Opera';
    } else if (browserItem.indexOf('Trident') > -1) {
        return 'Microsoft Internet Explorer';
    } else if (browserItem.indexOf('Edge') > -1) {
        return 'Microsoft Edge';
    } else if (browserItem.indexOf('Chrome') > -1) {
        return 'Google Chrome';
    } else if (browserItem.indexOf('Safari') > -1) {
        return 'Apple Safari';
    } else {
        return 'unknown';
    }
}

const isMobile = function(size = null) {
    if (size == null) size = 1024;
    if ((/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) && window.innerWidth < size) {
        return true;
    } else {
        return false;
    }
}

const getLink = function(param, value, link) {
    let re = new RegExp('[\?\&]' + param + '=', 'g');
    let url = link || window.location.href;
    if (re.test(url)) {
        re = new RegExp('([\?\&]' + param + '=)(.*?)&', 'g');
        if (re.test(url)) {
            url = url.replace(re, '$1' + value + '&');
        } else {
            re = new RegExp('([\?\&]' + param + '=)(.*?)$', 'g');
            url = url.replace(re, '$1' + value);
        }
    } else if (/\?/g.test(url)) {
        url += '&' + param + '=' + value;
    } else {
        url += '?' + param + '=' + value;
    }
    if (value === '') {
        re = new RegExp('([\?\&])' + param + '=[^?&]*&?', 'g');
        url = url.replace(re, '$1');
    }
    url = url.replaceAll(/[?&]$/g, '');
    if (param !== 'pg') url = url.replaceAll(/(\?|\&)pg=\d+/ig, "$1pg=1");
    if (param !== 'ps') url = url.replaceAll(/(\?|\&)ps=\d+/ig, "$1ps=1");
    return url;
}

const evalScripts = async function(content) {
    content = content.replaceAll(/\s+/g, ' ');
    let startRegex = "<\s*script.*?>";
    let finishRegex = "<\s*\/\s*script\s*>";
    let mainRegex = new RegExp(startRegex + ".*?" + finishRegex, "ig");
    let res = content.match(mainRegex) || [];

    let i=0;
    let myscript = '';
    let callbackArr = [];

    for(i=0;i<res.length; i++){
        myscript = res[i].replace(new RegExp(startRegex, "ig"), "").replace(new RegExp(finishRegex, "ig"), "");
        callbackArr.push(myscript);
    }

    for(i=0;i<callbackArr.length; i++){
        try{
            eval(callbackArr[i]);
        }catch(ex){
            console.log(ex);
        }
    };
}

const evalScriptsAdd = function(content, id) {
    content = content.replaceAll(/\s+/g, ' ');
    let startRegex = "<\s*script.*?>";
    let finishRegex = "<\s*\/\s*script\s*>";
    let mainRegex = new RegExp(startRegex + ".*?" + finishRegex, "ig");
    let res = content.match(mainRegex) || [];

    for (let i=0; i<res.length; i++) {
        if (document.querySelector(`#${id}-${i}`)) document.querySelector(`#${id}-${i}`).remove();
        try{
            const parser = new DOMParser();
            const doc = parser.parseFromString(res[i], 'text/html');
            const src = doc.querySelector('script').getAttribute('src');

            const script = document.createElement('script');
            script.id = `${id}-${i}`;
            if (src != undefined) script.src = src;
            script.innerHTML = doc.querySelector('script').innerHTML || '';
            document.body.appendChild(script);
        }catch(ex){
            console.log(ex);
        }
    }
    if (res.length > 0) return true;
}

const scriptAdd = async function(src = null, onload = () => {}, onerror = () => {}, integrity = null) {
    if (src == null) return;

    const beforeScript = document.querySelector(`[src="${src}"]`);
    if (beforeScript) beforeScript.remove();

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    if (integrity != null) {
        script.setAttribute('integrity', integrity);
        script.setAttribute('crossorigin', 'anonymous');
    }
    script.onload = onload;
    script.onerror = onerror;
    document.body.appendChild(script);
}

const setLanguage = async function(value = null, callback = null) {
    if (value == null) {
        console.warn('setLanguage warn: value null');
        return;
    };

    const linkType = document.querySelector('#link_type').value;
    const linkTableId = document.querySelector('#link_table_id').value;

    let link = `/${linkType}/${linkTableId}`;
    try {
        await request('GET', getEndpoint('SET_LANGUAGE', `${value}${link}`)).then(response => {
            if (response.success) {
                if (typeof callback === 'function') {
                    try {
                        callback(response);
                    } catch (error) {}
                } else {
                    if (response.link == '') {
                        (PAGE_ID == 1) ? window.location.href = '/' : window.location.reload();
                    } else {
                        window.location.href = '/' + response.link;
                    }
                }
            } else {
                console.warn(`SET_LANGUAGE error response => ${response}`);
            }
        });
    } catch (error) {
        console.warn(`SET_LANGUAGE error => ${error}`);
    }
}

const setCurrency = async function(value = null, callback = null) {
    if (value == null) {
        console.warn('setCurrency warn: value null');
        return;
    };

    try {
        await request('GET', getEndpoint('SET_CURRENCY', `${value}`)).then(response => {
            if (response == 1) {
                if (typeof callback === 'function') {
                    try {
                        callback(response);
                    } catch (error) {}
                } else {
                    window.location.reload();
                }
            } else {
                console.warn(`SET_CURRENCY error response => ${response}`);
            }
        });
    } catch (error) {
        console.warn(`SET_CURRENCY error => ${error}`);
    }
}

const copyText = function(text = null, msg = null) {
    if (text == null) {
        console.warn('copyText warn: text null');
        return;
    };

    let message = msg == null ? COMMON_LANG?.copied : msg;
    if (message) {
        notify({
            text: message,
        });
    }
    navigator.clipboard.writeText(text);
}

function awaitTimeOut(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const modalClose = function(modal = null, modalObj = null) {
    if (modal != null) {
        if (typeof modal == 'string') modal = document.querySelector(modal);
        if (window.modals) modalObj ? window.modals = window.modals.filter(x => x.id != modalObj.id) : window.modals.pop();
        if (modal) modal.remove();
    } else if (window.modals?.length > 0) {
        const modalObj = window.modals[window.modals.length - 1];
        if (!modalObj) {
            console.warn('modalClose warn: modalObj undefined');
            return;
        };

        const modal = document.querySelector(`#${modalObj.selector}`);
        if (modal) {
            modal.remove();
            window.modals.pop();
        }
    }

    if (window.modals?.length == 0) document.querySelector('body').classList.remove('overflow-hidden', 'modal-active');
}

const modal = async function(options = null) {
    if (options == null) {
        console.warn('modal warn: options null');
        return;
    };

    window['modals'] = window.modals || [];

    const defaults = {
        id: '',
        class: '', /* success danger info */
        width: '580px',
        height: '',
        title: '',
        html: '',
        timeout: null,
        close: true,
        disabledClose: false,
        iconHtml: '',
        alert: false,
        buttons: [
            /* {text: '', href: '', target: '', class: '', event: function() {}, }, */
        ],
        callbacks: {
            open: function() {},
            close: function() {},
        },
    }

    const opt = { ...defaults, ...options };
    if (opt.html == '') {
        console.warn('modal warn: opt.html undefined');
        return;
    };

    document.querySelector('body').classList.add('overflow-hidden', 'modal-active');

    const modal = document.createElement('div');
    modal.counter = window.modals.length + 1;
    modal.id = opt.id ? opt.id : `modal-${modal.counter}`;
    modal.className = `fixed flex inset-0 ${!opt.alert ? 'p-4' : ''} overflow-y-auto overflow-x-hidden bg-black/50 z-[999999996] opacity-0 pointer-events-none scroll-smooth transition-opacity duration-300 ease-out delay-100 ${opt.class} modal`;

    const beforeModal = document.getElementById(modal.id);
    if (beforeModal) modalClose(`#${modal.id}`);

    setTimeout(() => {
        modal.classList.add('opacity-100', 'pointer-events-auto');
    }, 1);

    if (opt.alert && opt.width == '580px') {
        opt.width = '360px';
    }

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'bg-white h-max m-auto max-w-full rounded-custom shadow-xl relative opacity-0 -translate-y-12 transition-transform duration-300 ease-out modal-wrapper';
    modalWrapper.style.width = opt.width.indexOf('px') > 0 ? opt.width : `${opt.width}px`;
    modal.append(modalWrapper);

    if (opt.alert && window.innerWidth < 768) {
        modalWrapper.classList.add('!w-full', 'rounded-b-none', 'mb-0', 'pb-4');
    }

    const modalContainer = document.createElement('div');
    modalContainer.className = `w-full px-6 py-8 overflow-x-auto modal-container`;
    if (opt.height) modalContainer.style.height = opt.height.indexOf('px') > 0 ? opt.height : `${opt.height}px`;
    modalWrapper.append(modalContainer);

    if (!opt.disabledClose && opt.close) {
        const modalCloseBtn = document.createElement('span');
        modalCloseBtn.className = 'absolute end-0 top-0 text-gray-500 z-10 size-8 flex items-center justify-center rounded-custom cursor-pointer hover:text-gray-900 duration-300 modal-close';
        modalCloseBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;
        modalWrapper.append(modalCloseBtn);
        modalCloseBtn.addEventListener('click', removeModal);
    }

    const modalContent = document.createElement('div');
    modalContent.className = `w-full flex items-center gap-4 modal-content ${opt.alert ? 'flex-wrap text-center' : ''}`;
    modalContainer.append(modalContent);

    if (opt.alert) {
        modal.classList.add('modal-alert');
        if (opt.iconHtml) {
            opt.iconHtml = `<div class="size-14 flex items-center justify-center rounded-full ${opt.class.includes('success') ? 'bg-green-100 text-green-500' :
                opt.class.includes('danger') ? 'bg-red-100 text-red-500' :
                opt.class.includes('info') ? 'bg-blue-100 text-blue-500' :
                'bg-light text-primary'
            }">${opt.iconHtml}</div>`;
        } else {
            if (opt.class.includes('success')) {
                opt.iconHtml = `
                    <div class="size-14 flex items-center justify-center rounded-full bg-green-100 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"/>
                        </svg>
                    </div>`;
            } else if (opt.class.includes('danger')) {
                opt.iconHtml = `
                    <div class="size-14 flex items-center justify-center rounded-full bg-red-100 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.553.553 0 0 1-1.1 0z"/>
                        </svg>
                    </div>`;
            } else if (opt.class.includes('info')) {
                opt.iconHtml = `
                    <div class="size-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                        </svg>
                    </div>`;
            }
        }
    }

    if (opt.iconHtml) {
        const modalIcon = document.createElement('div');
        if (opt.alert) {
            modalIcon.className = 'w-full flex items-center justify-center modal-icon';
            modalIcon.innerHTML = opt.iconHtml;
        } else {
            modalIcon.className = `flex shrink-0 size-10 items-center justify-center rounded-full ${
                opt.class.includes('success') ? 'bg-green-500 text-green-100' :
                opt.class.includes('danger') ? 'bg-red-500 text-red-100' :
                opt.class.includes('info') ? 'bg-blue-500 text-blue-100' :
                'bg-light text-primary'
            } modal-icon`;
            modalIcon.innerHTML = opt.iconHtml;
        }

        modalContent.append(modalIcon);
    }

    const modalHtml = document.createElement('div');
    modalHtml.className = 'w-full modal-html';

    if (opt.title) {
        const modalTitle = document.createElement('div');
        modalTitle.className = 'text-base font-semibold leading-6 text-gray-900 mb-2 modal-title';
        modalTitle.innerHTML = opt.title;
        modalHtml.append(modalTitle);
    }

    const modalText = document.createElement('div');
    modalText.className = 'text-sm modal-text';
    modalText.innerHTML = opt.html;

    const iframe = modalText.querySelector('iframe');
    if (iframe?.src.includes('youtube')) {
        let src = iframe.src;
        const params = {
            'autoplay': '1',
            'mute': '1',
            'controls': '1',
            'loop': '1',
            'showinfo': '0',
            'rel': '0'
        };

        Object.keys(params).forEach(key => {
            if (!src.includes(key + '=')) {
                const separator = src.includes('?') ? '&' : '?';
                src += separator + key + '=' + params[key];
            }
        });

        iframe.src = src;
    }

    if (iframe?.src.includes('vimeo')) {
        let src = iframe.src;
        const params = {
            'autoplay': '1',
            'muted': '1',
            'loop': '1',
            'controls': '0',
            'background': '1'
        };

        Object.keys(params).forEach(key => {
            if (!src.includes(key + '=')) {
                const separator = src.includes('?') ? '&' : '?';
                src += separator + key + '=' + params[key];
            }
        });

        iframe.src = src;
    }

    const videoElement = modalText.querySelector('video');
    if (videoElement) {
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        if (!videoElement.hasAttribute('controls')) {
            videoElement.controls = false;
        }
    }
    modalHtml.append(modalText);
    modalContent.append(modalHtml);

    if (opt.buttons.length > 0) {
        const modalButtons = document.createElement('div');
        modalButtons.className = `flex flex-wrap ${opt.alert ? 'justify-center' : 'justify-end'} gap-4 ${opt.alert ? 'mt-6' : 'mt-4'} modal-buttons`;
        opt.buttons.forEach(btn => {
            const button = document.createElement('a');
            button.className = btn.class || '';
            button.innerHTML = btn.text || '';
            button.href = btn.href || 'javascript:void(0)';
            button.target = btn.target || '';
            if (btn.event) {
                button.addEventListener('click', (e) => {
                    try {
                        btn.event(e);
                    } catch (error) {
                        console.error('Button event error:', error);
                    }
                });
            }
            modalButtons.append(button);
        });
        modalContainer.append(modalButtons);
    }

    document.body.append(modal);
    const selectors = modal.querySelectorAll('[data-selector="country"], [data-selector="city"], [data-selector="town"], [data-selector="district"]');
    if (selectors.length > 0) {
        modalContainer.classList.remove('overflow-x-auto');
    }
    await evalScripts(modal.innerHTML);
    await awaitTimeOut(300);
    await components.init();

    modal.addEventListener('mousedown', e => {
        if ((e.button === 0 || e.button === undefined) && !modalWrapper.contains(e.target)) {
            removeModal();
        }
    });

    const modalObj = {
        id: modal.counter,
        selector: modal.id
    };

    window.modals.push(modalObj);

    function removeModal() {
        if (opt.disabledClose) return;
        try {
            modalClose(modal, modalObj);
            opt.callbacks.close?.();
        } catch (error) {
            console.error('Modal close error:', error);
        }
    }

    if (opt.timeout) {
        setTimeout(removeModal, opt.timeout);
    }

    try {
        opt.callbacks.open?.();
    } catch (error) {
        console.error('Modal open callback error:', error);
    }

    setTimeout(() => {
        modalWrapper.classList.remove('opacity-0', '-translate-y-12');
    }, 100);
}

const notify = function(options = null) {
    if (!options) {
        console.warn('notify warn: options null');
        return;
    }

    const defaults = {
        title: '',
        text: '',
        duration: 3500,
        gravity: 'top',    /* top || bottom */
        position: 'right', /* left || right */
        class: 'success',  /* success || danger || info */
        iconHtml: '',
        buttons: [
            /* {text: '', href: '', target: '', class: '', event: function() {}, }, */
        ],
        callback: function(notify) {},
    };

    const opt = { ...defaults, ...options };

    if (!opt.text && !opt.title) {
        console.warn('notify warn: opt.text or opt.title undefined');
        return;
    }

    window.notifies = window.notifies || [];

    const getNotifyClass = (className) => {
        const classes = {
            success: 'border-l-4 border-green-500',
            danger: 'border-l-4 border-red-500',
            info: 'border-l-4 border-blue-500'
        };
        return Object.entries(classes).find(([key]) => className.includes(key))?.[1] || '';
    };

    const createNotifyElement = () => {
        const notify = document.createElement('div');
        notify.counter = window.notifies.length + 1;
        notify.id = `notify-item-${notify.counter}`;

        const isRTL = document.dir === 'rtl';
        const translateClass = isRTL ? '-translate-x-full' : 'translate-x-full';

        notify.className = `
            w-full 
            flex 
            items-center 
            px-3
            py-4 
            rounded-custom
            shadow-lg 
            ${getNotifyClass(opt.class)}
            transform 
            transition-all 
            duration-300 
            ease-out 
            ${translateClass}
            opacity-0
            bg-white
            notify-item
        `;
        return notify;
    };

    const createCloseButton = (removeCallback) => {
        const closeButton = document.createElement('button');
        closeButton.className = 'text-gray-400 hover:text-gray-500 transition-colors duration-200 notify-close';
        closeButton.innerHTML = `
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>`;
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            removeCallback();
        });
        return closeButton;
    };

    const createNotifyButtons = () => {
        let notifyButtons = null;
        if (opt.buttons.length > 0) {
            notifyButtons = document.createElement('div');
            notifyButtons.className = `flex flex-wrap gap-x-2 mt-1 notify-buttons`;
            opt.buttons.forEach(btn => {
                const button = document.createElement('a');
                button.className = btn.class || '';
                button.innerHTML = btn.text || '';
                button.href = btn.href || 'javascript:void(0)';
                button.target = btn.target || '';
                if (btn.event) {
                    button.addEventListener('click', () => {
                        try {
                            btn.event();
                        } catch (error) {
                            console.error('Button event error:', error);
                        }
                    });
                }
                notifyButtons.append(button);
            });
        }
        return notifyButtons;
    }

    const createNotifyContent = (notify, removeCallback) => {
        if (opt.title !== false) {
            opt.title = opt.text;
            opt.text = '';
        }

        if (opt.iconHtml) {
            const icon = document.createElement('span');
            icon.className = 'shrink-0';
            icon.innerHTML = opt.iconHtml;
            notify.appendChild(icon);
        }

        const content = document.createElement('div');
        content.className = 'w-full';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center gap-x-2';

        if (opt.title) {
            const title = document.createElement('p');
            title.className = 'text-sm font-medium text-gray-900 notify-title';
            title.innerHTML = opt.title;
            header.appendChild(title);
        }

        const closeButton = createCloseButton(removeCallback);
        const notifyButtons = createNotifyButtons();

        header.appendChild(closeButton);

        if (opt.text) {
            const text = document.createElement('p');
            text.className = 'mt-1 text-sm text-gray-500 notify-text';
            text.innerHTML = opt.text;
            content.appendChild(text);
        }

        content.appendChild(header);
        if (notifyButtons) content.appendChild(notifyButtons);
        notify.appendChild(content);

        opt.callback(notify);
    };

    const getNotifyWrapper = () => {
        let wrapper = document.querySelector(`#notify-${opt.gravity}-${opt.position}`);
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = `notify-${opt.gravity}-${opt.position}`;

            const isRTL = document.dir === 'rtl';
            const positions = {
                'top-right': isRTL ? 'fixed top-4 left-4' : 'fixed top-4 right-4',
                'top-left': isRTL ? 'fixed top-4 right-4' : 'fixed top-4 left-4',
                'bottom-right': isRTL ? 'fixed bottom-4 left-4' : 'fixed bottom-4 right-4',
                'bottom-left': isRTL ? 'fixed bottom-4 right-4' : 'fixed bottom-4 left-4'
            };

            const position = `${opt.gravity}-${opt.position}`;
            wrapper.className = `
                ${positions[position] || (isRTL ? positions['top-left'] : positions['top-right'])}
                z-[999999999] 
                space-y-2 
                sm:min-w-[320px] 
                sm:max-w-[360px]
                notify
            `;
            document.body.appendChild(wrapper);
        }
        return wrapper;
    };

    const notify = createNotifyElement();
    const wrapper = getNotifyWrapper();

    const removeNotify = () => {
        const isRTL = document.dir === 'rtl';
        const translateClass = isRTL ? '-translate-x-full' : 'translate-x-full';

        notify.classList.remove('translate-x-0', 'opacity-100');
        notify.classList.add(translateClass, 'opacity-0');

        setTimeout(() => {
            notify.remove();
            window.notifies = window.notifies.filter(x => x.id !== notify.id);
            if (!wrapper.innerHTML) wrapper.remove();
        }, 300);
    };

    createNotifyContent(notify, removeNotify);
    wrapper.appendChild(notify);
    window.notifies.push({ id: notify.id });

    setTimeout(() => {
        const isRTL = document.dir === 'rtl';
        const translateClass = isRTL ? '-translate-x-full' : 'translate-x-full';

        notify.classList.remove(translateClass, 'opacity-0');
        notify.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    if (opt.duration > 0) {
        let timeoutId;

        const startTimeout = () => {
            timeoutId = setTimeout(removeNotify, opt.duration);
        };

        notify.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
        });

        notify.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(removeNotify, 2000);
        });

        startTimeout();
    }
};

const drawerClose = function() {
    const drawers = document.querySelectorAll('.drawer.active');
    Array.from(drawers).forEach(drawer => {
        drawer.click();
    });
}

const mask = function(element = null, mask = null, regex = null, max = null) {
    if (element == null || element.mask == 1 || (element.nodeName != 'INPUT' && element.nodeName != 'TEXTAREA')) return;

    if (mask == null) {
        mask = element.dataset.mask || element.type || null;
        if (regex != null) mask = 'custom';
    }

    if (max == null) max = element.dataset.max || null;

    function run(event) {
        let re;
        switch (mask) {
            case 'string':
                re = /[^\p{L}\s\-]/gu;
                break;
            case 'text':
                re = /[^\p{L}\s\-]/gu;
                break;
            case 'number':
                re = /[^0-9]/g;
                break;
            case 'price':
                re = /[^0-9.,]/g;
                break;
            case 'password':
                re = /^\s+|\s+$/;
                break;
            case 'email':
                re = /^\s+|(?:^|\s|,|;|!|:|-|\.|\?)[ğçşüöıĞÇŞÜÖİ?!]/g;
                break;
            case 'block':
                if (regex) re = new RegExp(`[${regex}]`,"g");
            case 'custom':
                if (regex) re = new RegExp(regex, 'g');
                break;
        }

        if (event.type == 'paste') {
            setTimeout(() => {
                const value = event?.target?.value || null;
                if (!re || value == null) return;
                if (re.test(String(value))) event.target.value = event.target.value.replace(re, '');
            }, 10);
        } else if (event.type == 'keypress') {
            let value = event.target.value;
            if (event.target.dataset.toggle == "flag") value = event.target.value.replaceAll(/\D+/g, '');
            if (max != '' && max != null && value.length >= max) event.preventDefault();
            if (re?.test(String(event.key))) event.preventDefault();
        }
    }

    element.addEventListener('paste', event => {
        run(event);
    });

    element.addEventListener('keypress', event => {
        run(event);
    });

    element.mask = 1;    
}

const format = function(p, d) {
    let decimals = typeof d != 'undefined' ? d : typeof DECIMAL_LENGTH !== 'undefined' ? DECIMAL_LENGTH : 2;
    let n = !Number.isFinite(Number(+p)) ? 0 : +p,
        priceRec = !Number.isFinite(Number(+decimals)) ? 2 : Math.abs(decimals),
        sep = (typeof SEP_THO === 'undefined') ? '.' : SEP_THO,
        dec = (typeof SEP_DEC === 'undefined') ? ',' : SEP_DEC,
        toFixedFix = function(n, priceRec) {
            const k = Math.pow(10, priceRec);
            return '' + Math.round(n * k) / k;
        };
    let s = '';

    s = (priceRec ? toFixedFix(n, priceRec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replaceAll(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < priceRec) {
        s[1] = s[1] || '';
        s[1] += new Array(priceRec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

const vat = function(p, vat) {
    if (p > 0 && p <= 0.0000001) {
        return 0;
    }
    let priceParam = Number.isNaN(Number(p)) ? 0.0 : Number.parseFloat(p);
    let vatParam = Number.isNaN(Number(vat)) > 0 ? 0 : Number.parseInt(vat);
    priceParam = priceParam * (100 + vatParam) / 100;
    return format(priceParam);
}

const priceToFloat = function(p) {
    if (!p) return false;
    p = String(p);
    let price = '';
    if (SEP_THO === ',') {
        price = Number.parseFloat(p.replaceAll(',', ''));
    } else if (SEP_DEC == ",") {
        price = Number.parseFloat(p.replaceAll('.', '').replace(',', '.'));
    } else {
        price = Number.parseFloat(p);
    }
    return price;
}

const triggerEvent = function(element = null, event = null) {
    if (element == null || event == null) {
        console.warn('triggerEvent warn: element or event null');
        return;
    };

    let newEvent;
    if (event == 'mouseenter') {
        newEvent = new MouseEvent(event, {
            bubbles: true,
            cancelable: true,
            view: window
        });
    } else {
        newEvent = new Event(event);
    }

    element.dispatchEvent(newEvent);
}

const outsideClick = function(eventElement, element, onCallback = () => {}) {
    if (eventElement?.outsideEvent == 1 || element?.outsideEvent == 1) return;

    const event = function(e) {
        const target = e.target;
        if (!eventElement?.contains(target) && !element?.contains(target)) onCallback();
    }

    document.addEventListener('click', event);

    if (eventElement) eventElement.outsideEvent = 1;
    if (element) element.outsideEvent = 1;
};

const timeConverter = function(UNIX_timestamp = 0, format = 'd.m.y') {
    let time = Number.parseInt(UNIX_timestamp);
    if(Number.isNaN(time) || time < 1000000000) {
        time = 1000000000;
    } else if (time < 9000000000) {
        time = time * 1000;
    }

    const pad  = s => (s < 10) ? '0' + s : s;
    const date = new Date(time);

    format = format.replaceAll(/y+/ig, date.getFullYear());
    format = format.replaceAll(/d+/ig, pad(date.getDate()));
    format = format.replaceAll(/m+/ig, pad(date.getMonth() + 1));
    format = format.replaceAll(/h+/ig, pad(date.getHours()));
    format = format.replaceAll(/i+/ig, pad(date.getMinutes()));
    format = format.replaceAll(/s+/ig, pad(date.getSeconds()));

    return format;
}

const taxLoader = async function(options = null) {
    let opt = {
        selector: '',
        limit: 15,
        start: 0,
    }

    if (options != null) opt = { ...opt, ...options };

    const element = typeof opt.selector == 'object' ? opt.selector : document.querySelector(opt.selector);
    if (!element) {
        console.warn('taxLoader warn: element undefined');
        return;
    };

    let taxHtml, taxUl, taxSearchWrapper, taxSearch;

    const loadTax = (taxData, taxUl, limit) => {
        for (let i=opt.start; i<limit; i++) {
            const taxItem = document.createElement('li');
            taxItem.id = `tax-item-${taxData[i]}`;
            taxItem.className = 'selection-li';
            taxItem.dataset.value = taxData[i];
            taxItem.innerText = taxData[i];

            taxItem.addEventListener('click', () => {
                element.value = taxItem.dataset.value;
                taxHtml.classList.remove('show');
                taxHtml.style.display = 'none';
            });
            taxUl.append(taxItem);
        }
        opt.start = limit;
    };

    try {
        await request('GET', getEndpoint('TAX_OFFICE_LIST')).then(response => {
            const data = response;
            if ((data !== null || typeof data !== 'undefined')) {
                const taxData = data.toString().split("\n"),
                      collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
                      taxData.sort(collator.compare);

                element.setAttribute('readonly', 'readonly');
                element.classList.add('tax-form');
                element.parentNode.classList.add('selection-dropdown', 'tax-office-dropdown');

                taxHtml = document.createElement('div');
                taxHtml.className = 'selection-list';
                taxHtml.style.display = 'none';

                taxUl = document.createElement('ul');
                taxUl.className = 'selection-ul';

                taxSearchWrapper = document.createElement('div');
                taxSearchWrapper.className = 'selection-search';

                taxSearch = document.createElement('input');
                taxSearch.type = 'search';
                taxSearch.className = 'form-control';
                taxSearch.placeholder = COMMON_LANG?.search;

                taxSearch.addEventListener('keyup', event => {
                    const value = event.target.value,
                          searchString = String(value).toLocaleUpperCase(getLocale()),
                          items = taxUl.querySelectorAll('li');

                    if (searchString != '' && searchString.length >= 2) {
                        opt.limit = taxData.length;
                        loadTax(taxData, taxUl, opt.limit);
                        Array.from(items).forEach(li => {
                            if(String(li.dataset.value).toLocaleUpperCase(getLocale()).indexOf(searchString) > -1) {
                                li.classList.remove('!hidden');
                            } else {
                                li.classList.add('!hidden');
                            }
                        });
                    } else {
                        Array.from(items).forEach(li => {
                            li.classList.remove('!hidden');
                        });
                    }
                });

                let count = 1;
                taxUl.addEventListener('scroll', () => {
                    if (taxUl.scrollTop + taxUl.clientHeight >= taxUl.scrollHeight - 1) {
                        count ++;
                        if (count * opt.limit >= taxData.length) {
                            opt.limit = taxData.length;
                            loadTax(taxData, taxUl, opt.limit);
                            return;
                        } else {
                            loadTax(taxData, taxUl, (count * opt.limit));
                        }
                    }
                });
                loadTax(taxData, taxUl, opt.limit);

                taxSearchWrapper.append(taxSearch);
                taxHtml.append(taxSearchWrapper);
                taxHtml.append(taxUl);
                element.parentNode.insertBefore(taxHtml, element);

                element.addEventListener('focus', () => {
                    taxHtml.classList.add('show');
                    taxHtml.style.display = 'block';
                    taxSearch.value = '';
                    triggerEvent(taxSearch, 'keyup');
                    if (!element.value) taxSearch.focus();
                });
            }
        });
    } catch (error) {
        console.warn(`TAX_OFFICE_LIST error => ${error}`);
    }

    outsideClick(element, taxHtml, function() {
        taxHtml.classList.remove('show');
        taxHtml.style.display = 'none';
    });
}

const stringToObject = function(inputString) {
    let keyValuePairs = inputString.split('&');
    let result = {};
    keyValuePairs.forEach(function(keyValue) {
        let pair = keyValue.split('=');
        result[pair[0]] = pair[1];
    });
    return result;
}

const snippetUri = function(snippet = null, params = {}) {
    if (snippet == null) {
        console.warn('snippetUri warn: snippet undefined');
        return;
    }

    let arrParams = [];
    for(let key in params){
        arrParams.push(`${key}=${params[key]}`);
    }

    let urlParams = '';
    if (arrParams.length) urlParams = `?${arrParams.join('&')}`;
    let snippetUrl = getEndpoint('SNIPPET', `${snippet}${urlParams}`);

    return snippetUrl;
}

const loadSnippet = async function(options){
    if(!options.snippet) {
        console.warn('loadSnippet warn: options.snippet undefined');
        return;
    };

    const defOptions = {
        snippet: options.snippet || "",
        params: options.params || {},
        success: options.success || function(){}
    }

    try {
        await request('GET', snippetUri(defOptions.snippet, defOptions.params)).then(async response => {
            await defOptions.success(response);
        })
    } catch (error) {
        console.warn(`SNIPPET(loadSnippet) ${defOptions.snippet} ${JSON.stringify(defOptions.params)} error => ${error}`);
    }
}

const getOffsetTop = function(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
    }

    return offsetTop;
}

const checkValidity = function(form = null) {
    const formElements = form?.elements || null;   
    if (formElements == null) return;

    form.errorElements = [];
    let status = true;

    const validateMessage = function(el, message) {
        const formItem = el.closest('.form-item');
        if (!formItem) return;

        let elError = formItem.querySelector('.form-error');

        if (!elError) {
            formItem.classList.add('error');
            elError = document.createElement('div');
            elError.className = 'form-error';
            formItem.append(elError);
        }
        if (elError) {
            elError.innerHTML = message;
            form.errorElements.push(el);
        }
    };

    const validate = function(el) {
        let message = '';
        const elTrim = el.value.trim().replaceAll(/\s/g, "");

        if (elTrim == '') {
            message = COMMON_LANG?.form_required;
        } else if (el.type == 'email' && validateEmail(el)) {
            message = COMMON_LANG?.not_email_format;
        } else if (el.type == 'tel' && validatePhone(el)) {
            message = COMMON_LANG?.not_phone_format;
        } else if ((el.type == 'checkbox' || el.type == 'radio') && validateCheckbox(el)) {
            message = COMMON_LANG?.form_required;
        }

        if (message) {
            status = false;
            validateMessage(el, message);
        } else {
            validateRemove(el);
        }
    };

    const validateEmail = function(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email.value).toLowerCase())) return true;
    };

    const validatePhone = function(tel) {
        const re = /^[0-9]{9,15}$/;
        const value = tel.value.replaceAll(/\D+/g, '');
        if (!re.test(String(value))) return true;
    };

    const validateCheckbox = function(input) {
        if (input.type == 'radio') {
            let status = true;

            const name = input.name;
            if (name) {
                const radios = input.form.querySelectorAll(`input[type="radio"][name="${name}"]`);
                Array.from(radios).forEach(radio => {
                    if (radio.checked) status = false;

                    });
            } else if (input.checked) {
                status = false;
            }
            return status;
        } else if (input.type == 'checkbox' && !input.checked) {
            return true;
        }
    };

    const validateRemove = function(el) {
        const formItem = el.closest('.form-item');
        if (!formItem) return;

        formItem.classList.remove('error');

        let elError = formItem.querySelector('.form-error');
        if (elError) {
            elError.remove();
            form.errorElements = form.errorElements.filter(x => x != el);
        }
    }

    const validateHandle = function(el) {
        const element = el.target;
        element.validate = 1;
        if (element.classList.contains('required')) {
            if (element.type == 'radio') {
                const name = element.name;
                if (name) {
                    const radios = element.form.querySelectorAll(`input[type="radio"][name="${name}"]`);
                    Array.from(radios).forEach(radio => {
                        validate(radio);

                        });
                } else {
                    validate(element);
                }
            } else {
                validate(element);
            }
        }
        return;
    }

    Array.from(formElements).forEach(el => {
        if (el.classList.contains('required')) validate(el);
        if (el.validate != 1) el.addEventListener('change', validateHandle);

        });

    if (form.errorElements.length) {
        const errorElement = form.errorElements[0];
        const formItem = errorElement.closest('.form-item');
        if (!formItem) return;

        const offsetTop = getOffsetTop(formItem);
        if (offsetTop == 0) return;

        let el = formItem;
        while (el && el !== document.body) {
            if (el.classList && Array.from(el.classList).some(c => c.includes('sticky')) && !isMobile()) return;
            el = el.parentElement;
        }

        const modal = formItem.closest('.modal');
        if (modal) {
            modal.scrollTo(0, offsetTop - 50);
        } else {
            const header = document.querySelector('.folder-header');
            let scrollHeight = 180;
            if (header) scrollHeight = header.offsetHeight || 0;
            window.scrollTo(0, offsetTop - scrollHeight);
        }
    }

    return status;
}

const popoverAlert = function(options = null) {
    if (options == null) {
        console.warn('popoverAlert warn: options null');
        return;
    };

    const defaults = {
        selector: '',
        message: '',
        scroll: true,
    }

    const opt = { ...defaults, ...options };

    const element = typeof opt.selector == 'object' ? opt.selector : document.querySelector(opt.selector);
    if (!element) {
        console.warn('popoverAlert warn: element undefined');
        return;
    };

    let message = null;
    const formItem = element.closest('.form-item');
    if (formItem) {
        formItem.classList.add('error'); 
        message = formItem.querySelector('.form-error');
        if (!message) {
            message = document.createElement('div');
            message.className = 'form-error';
            formItem.append(message);
        }
    } else {
        message = element.nextElementSibling.contains('.form-error') ? element.nextElementSibling : null;
        if (!message) {
            message = document.createElement('div');
            message.className = 'form-error';
            element.parentNode.insertBefore(message, element.nextSibling);
        }
    }

    message.innerHTML = opt.message;
    if (opt.scroll) {
        const offsetTop = getOffsetTop(formItem);
        if (offsetTop == 0) return;

        let el = formItem;
        while (el && el !== document.body) {
            if (el.classList && Array.from(el.classList).some(c => c.includes('sticky')) && !isMobile()) return;
            el = el.parentElement;
        }

        const modal = formItem.closest('.modal');
        if (modal) {
            modal.scrollTo(0, offsetTop - 50);
        } else {
            const header = document.querySelector('.folder-header');
            let scrollHeight = 180;
            if (header) scrollHeight = header.offsetHeight || 0;
            window.scrollTo(0, offsetTop - scrollHeight - 50);
        }
    }

    const inputHandle = function() {
        popoverAlertHide(formItem);
        formItem.classList.remove('error');
        element.removeEventListener('change', inputHandle);
    };

    element.addEventListener('change', inputHandle);
}

const popoverAlertHide = function(parent = null) {
    if (parent == null) parent = document.body;

    const errorItem = parent.closest('.error');
    if (errorItem) {
        errorItem.classList.remove('error');
        const formErrorItem = errorItem.querySelector('.form-error');
        if (formErrorItem) formErrorItem.remove();
        return;
    }

    const allPopoverAlert = parent.querySelectorAll('.form-error');
    Array.from(allPopoverAlert).forEach(item => {
        item.remove();

        });

    const allPopoverAlertClass = parent.querySelectorAll('.error');
    Array.from(allPopoverAlertClass).forEach(item => {
        item.classList.remove('error');

        });
}

const passwordToggle = function(event = null, input = null) {
    if (event == null || input == null) {
        console.warn('passwordToggle warn: event or input null');
        return;
    };

    const eye = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </svg>
    `;
    const eyeSlash = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>
        </svg>
    `;

    try {
        event.classList.toggle('active');
        event.classList.toggle('text-primary');
        event.innerHTML = event.classList.contains('active') ? eye : eyeSlash;
        input.type = event.classList.contains('active') ? 'text' : 'password';
    } catch (error) {}
}

const messageCount = async function(){
    const messages = document.querySelectorAll('[data-toggle="message-count"]');
    if (messages.length > 0 && MEMBER_INFO.ID > 0) {
        let count = 0;
        try {
            await request('GET', getEndpoint('GET_MESSAGE')).then(response => {
                count = response;
                return;
            })
        } catch (error) {
            console.warn(`GET_MESSAGE error => ${error}`);
        }

        Array.from(messages).forEach(message => {
            if (message.componentMessageCount == 1) return;

            message.innerText = count;
            if (Number.parseFloat(count) == 0) message.style.display = 'none';

            message.componentMessageCount = 1;

            });
    }
}

const formLoader = async function(options) {
    const opt = {
        selector: 'form:last',
        url: '',
        data: null,
        callback: async function() {}
    };

    for (let i in options) {
        opt[i] = options[i];
    }

    const fillFormFields = async (result) => {
        const form = document.querySelector(opt.selector);
        for (const key in result) {
            const value = result[key];

            if (value == null) continue;
            if (form == null) return;

            const input = form.querySelector(`[name="${key}"]`);

            if(input != null) {
                if (input.type === 'radio' || input.type === 'checkbox') {
                    const inputsRadio = form.querySelectorAll(`[name="${key}"]`);
                    Array.from(inputsRadio).forEach(item => {
                        (value == item.value || Number.parseInt(value) === 1) ? item.checked = value : '';

                        });
                } else if (input.type == 'tel' && value.length < 4) {
                    input.value = '';
                } else if(input.value === '' || typeof input.value === 'undefined' || input.value === '-1') {
                    input.value = value;
                }
            }
        }

        await opt.callback(result);
        return;
    };

    if (String(opt.url).trim() == '' && opt.data !== null) {
        await fillFormFields(opt.data);
        return;
    }

    if (String(opt.url).trim() == '') return;

    try {
        await request('GET', opt.url).then(async response => {
            const result = typeof response == 'object' && response != '' ? response : response;
            await fillFormFields(result);
        })
    } catch (error) {
        console.warn(`FormLoader ${opt.url} error => ${error}`);
    }
}

const tsRegion = async function(options) {
    const opt = {
        container: '.regions',
        element: null,
        countryLimit: 1,
        storeLimit: 0,
        regionLimit: null,
        postalcodeInput: null,
        country: {
            selector: '[data-selector="country"]',
            code: '',
            data: [],
            element: null,
            type: 'U',
            default: 'TR'
        },
        state: {
            selector: '[data-selector="state"]',
            value: '',
            code: '',
            data: [],
            element: null,
            type: 'E'
        },
        city: {
            selector: '[data-selector="city"]',
            value: '',
            code: '',
            data: [],
            element: null,
            type: 'S'
        },
        town: {
            selector: '[data-selector="town"]',
            value: '',
            code: '',
            data: [],
            element: null,
            type: 'I'
        },
        district: {
            selector: '[data-selector="district"]',
            value: '',
            code: '',
            data: [],
            element: null,
            type: 'M'
        },
    };

    if (typeof options == "object") {
        for (let i in options) {
            if (typeof options[i] == "object") {
                for (let j in options[i]) {
                    opt[i][j] = options[i][j];
                }
            } else {
                opt[i] = options[i];
            }
        }
    }

    opt.element = document.querySelector(opt.container);
    if (!opt.element) {
        console.warn('tsRegion warn: opt element undefined');
        return;
    };
    opt.postalcodeInput = opt.element.querySelector('[name="post_code"]');


    const setElements = function() {
        const regions = ['country', 'state', 'city', 'town', 'district'];
        Array.from(regions).forEach(region => {
            if (opt[region].element == null && opt[region].selector) {
                opt[region].element = opt.element.querySelector(opt[region].selector);
            }
        });
    }

    const regionStateControl = function(region = '') {
        const element = opt[region].element;
        if (element == null) return true;

        const elementWrapper = element.closest('.form-item') || element.closest('.form-group') || element.closest('.region-dropdown');
        if (elementWrapper == null) return true;

        const country = getCountry(opt.country.code) || {};
        if (country.has_state) {
            elementWrapper.style.display = 'block';
            return false;
        } else {
            elementWrapper.style.display = 'none';
            element.value = '';
            return true;
        }
    }

    const getCountry = (code) => {
        const isItem = Array.from(opt.country.data).find(item => item.code == code);
        if (isItem) {
            isItem.has_state = isItem.has_state == 1;
            return isItem;
        } else {
            return {};
        }
    }

    const getParent = function(region = '') {
        const country = getCountry(opt.country.code) || {};

        if (region == '') return '';
        if (region == 'state') return opt.country.code;
        if (region == 'city') return country.has_state ? opt.state.code : opt.country.code;
        if (region == 'town') return opt.city.code;
        if (region == 'district') return opt.town.code;
        return '';
    }

    const getFormData = function(region = '') {
        const formData = new FormData();
        if (region == '') return formData;

        switch (region) {
            case 'state':
                formData.append('U', opt.country.code);
                break;
            case 'city':
                formData.append('U', opt.country.code);
                formData.append('E', opt.state.code || '');
                break;
            case 'town':
                formData.append('U', opt.country.code);
                formData.append('E', opt.state.code || '');
                formData.append('S', opt.city.code || '');
                break;
            case 'district':
                formData.append('U', opt.country.code);
                formData.append('E', opt.state.code || '');
                formData.append('S', opt.city.code || '');
                formData.append('I', opt.town.code || '');
                break;
        }
        return formData;
    }

    const regionHtml = function(region = '', element = null) {
        if (element == null || element.regionHtml == 1) return;

        if (opt[region].value) element.value = opt[region].value;

        const elementParent = element.parentNode;

        const codeElement = document.createElement('input');
        codeElement.type = 'hidden';
        codeElement.name = element.dataset.target ? element.dataset.target : `${element.name}_code`;
        codeElement.id = `${element.id.replace(element.name, codeElement.name)}`;
        if (opt[region].code) codeElement.value = opt[region].code;
        opt[region].codeElement = codeElement;
        elementParent.insertBefore(codeElement, element);

        const selectionList = document.createElement('div');
        selectionList.className = 'selection-list';
        selectionList.dataset.qa = `${region}-list`;
        selectionList.style.display = 'none';

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'selection-search';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'form-control region-search';
        searchInput.placeholder = COMMON_LANG.search;
        searchInput.dataset.qa = `${region}-search`;
        searchInput.addEventListener('input', e => {
            const value = e.target.value;
            const ul = opt[region].selectionList.querySelector('ul');
            if (!ul) return;

            const items = ul.querySelectorAll('li');
            items.forEach(item => {
                if (item.innerHTML.toLocaleUpperCase(getLocale()).includes(value.toLocaleUpperCase(getLocale()))) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        searchWrapper.appendChild(searchInput);
        selectionList.appendChild(searchWrapper);

        const ul = document.createElement('ul');
        ul.className = 'selection-ul';
        ul.dataset.qa = `${region}-ul`;
        selectionList.appendChild(ul);

        opt[region].selectionList = selectionList;

        const wrapper = document.createElement('div');
        wrapper.className = 'relative selection-dropdown region-dropdown';

        const elementParentNode = elementParent?.parentNode;
        if (elementParentNode) elementParentNode.insertBefore(wrapper, elementParent);

        wrapper.appendChild(elementParent);
        wrapper.appendChild(opt[region].selectionList);

        element.regionHtml = 1;
    }

    const regionSelectionList = function(region) {
        const element = opt[region].element;
        if (element == null) return;

        const codeElement = opt[region].codeElement;
        const selectionList = opt[region].selectionList;

        const ul = selectionList.querySelector('ul');
        if (!ul) return;

        ul.innerHTML = '';
        opt[region].data.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'selection-li';
            li.dataset.code = item.code;
            li.dataset.index = index;
            li.dataset.qa = `${region}-li`;
            if (item.postalcode) li.dataset.postalcode = item.postalcode;
            li.innerHTML = item.title;
            if (item.code == opt[region].code) {
                element.value = item.title;
            }
            li.addEventListener('click', e => {
                opt[region].value = item.title;
                opt[region].code = item.code;
                element.value = item.title;
                if (codeElement) codeElement.value = item.code;
                selectionList.style.display = 'none';
                if (opt.postalcodeInput) {
                    opt.postalcodeInput.value = region == 'district' ? item.postalcode : '';
                }
                regionReset(region);
                regionNext(region);
            });
            ul.appendChild(li);
        });

        if (element.componentRegion == 1) return;
        element.componentRegion = 1;

        element.addEventListener('click', () => {
            if (opt[region].data.length == 0) return;

            selectionList.style.display = 'block';
            selectionList.querySelector('input').value = '';
            selectionList.querySelector('input').dispatchEvent(new Event('input'));
            selectionList.querySelector('input').focus();
            selectionList.querySelector('input').select();
        });

        if (!opt._regionGlobalClickBound) {
            opt._regionGlobalClickBound = 1;
            document.addEventListener('click', e => {
                const regions = ['country', 'state', 'city', 'town', 'district'];
                regions.forEach(r => {
                    const rElement = opt[r]?.element;
                    const rSelectionList = opt[r]?.selectionList;
                    if (!rElement || !rSelectionList) return;
                    if (rSelectionList.style.display != 'block' || opt[r].data.length == 0) return;
                    if (rElement.contains(e.target) || rSelectionList.contains(e.target)) return;
                    rSelectionList.style.display = 'none';
                });
            });
        }
    }

    const regionReset = function(region = '') {
        if (region == '') return;

        let regions = []
        if (region == 'country') regions = ['state', 'city', 'town', 'district'];
        if (region == 'state') regions = ['city', 'town', 'district'];
        if (region == 'city') regions = ['town', 'district'];
        if (region == 'town') regions = ['district'];
        if (region == 'district') regions = [];

        regions.forEach(r => {
            opt[r].code = '';
            opt[r].value = '';
            opt[r].data = [];

            const element = opt[r].element;
            const codeElement = opt[r].codeElement;

            if (codeElement) codeElement.value = '';
            if (element) {
                element.value = '';
                element.readOnly = false;
                element.disabled = false;
                const regionDropdown = element.closest('.region-dropdown');
                if (regionDropdown) regionDropdown.classList.remove('active');
            }
        });
    }

    const regionNext = function(region = '') {
        if (region == '' || region == 'district') return;

        let nextRegion = '';
        if (region == 'country') nextRegion = 'state';
        if (region == 'state') nextRegion = 'city'; 
        if (region == 'city') nextRegion = 'town';
        if (region == 'town') nextRegion = 'district';

        if (nextRegion == '') return;
        regionLoad(nextRegion);
    }

    const regionLoad = async function(region = '') {
        if (region == '') return;

        if (region == 'state' && regionStateControl(region)) {
            regionNext(region);
            return;
        };

        const element = opt[region].element;
        if (element == null) return;

        regionHtml(region, element);

        try {
            element.disabled = true;
            const type = opt[region].type;
            const parent = getParent(region);
            const limit = opt.regionLimit != null ? opt.regionLimit : (opt.countryLimit ? '1' : '0');
            const formData = getFormData(region);
            if (shouldUnlockRegion(region, formData)) {
                element.readOnly = false;
                return;
            }

            const response = await request('POST', getEndpoint('REGION', `${type}/${parent}/${limit}`), formData);
            opt[region].data = response.data || [];

            if (opt[region].selectionList && opt[region].data?.length) {
                element.readOnly = true;
                element.disabled = false;
                element.closest('.region-dropdown').classList.add('active');
                regionSelectionList(region);
                regionNext(region);
            } else {
                element.readOnly = false;
                element.closest('.region-dropdown').classList.remove('active');
            }
        } catch (error) {
            console.warn(`REGION error => ${error}`);
            if (element) {
                element.readOnly = false;
                element.closest('.region-dropdown').classList.remove('active');
            }
        } finally {
            updateRegionDisabled();
        }
    }

    const updateRegionDisabled = function() {
        const country = getCountry(opt.country.code) || {};

        const order = country.has_state ? ['state', 'city', 'town', 'district'] : ['city', 'town', 'district'];
        const setDisabled = (region, value) => {
            const el = opt[region]?.element;
            if (el) el.disabled = value;
        };

        let prevHasData = Array.isArray(opt.country.data) && opt.country.data.length > 0;
        let prevSelected = !!opt.country.code;

        for (let i = 0; i < order.length; i++) {
            const region = order[i];
            if (!opt[region]) continue;

            if (!prevHasData) {
                for (let j = i; j < order.length; j++) {
                    setDisabled(order[j], false);
                }
                return;
            }

            if (prevHasData && !prevSelected) {
                for (let j = i; j < order.length; j++) {
                    setDisabled(order[j], true);
                }
                return;
            }

            setDisabled(region, false);
            prevHasData = Array.isArray(opt[region].data) && opt[region].data.length > 0;
            prevSelected = !!opt[region].code;
        }
    }

    const shouldUnlockRegion = function(region, formData) {
        const country = getCountry(opt.country.code) || {};

        if (region == 'state') return formData.get('U') == '';
        if (region == 'city') return (formData.get('E') == '' && country.has_state) || formData.get('U') == '';
        if (region == 'town') return formData.get('S') == '';
        if (region == 'district') return formData.get('I') == '';
        return false;
    }

    const regionCountryLoad = async function() {
        const element = opt.country.element;

        try {
            const response = await request('GET', getEndpoint('COUNTRY', '1?lang='+LANGUAGE));
            opt.country.data = response.countries || [];
            if (!opt.country.data?.length) {
                if (element) element.value = opt.country.default;
                return;
            };

            if (opt.countryLimit) {
                opt.country.data = Array.from(opt.country.data).filter(x => !MEMBER_INFO.E_COUNTRY || x.code == MEMBER_INFO.E_COUNTRY);
            }

            let cExists = false;
            if (element) {
                Array.from(opt.country.data).forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.code;
                    option.innerHTML = item.title;
                    element.appendChild(option);
                    if (opt.country.code && (item.code == opt.country.code)) cExists = true;
                });
            }

            if (!opt.country.code && !cExists) {
                if (opt.country.data.length == 1) {
                    opt.country.code = opt.country.data[0].code;
                } else if (response.selected && getCountry(response.selected)) {
                    opt.country.code = response.selected;
                } else if (getCountry('TR')) {
                    opt.country.code = 'TR';
                } else if (opt.country.data.length > 0) {
                    opt.country.code = opt.country.data[0].code;
                }
            }

            if (element && (element.value != opt.country.code)) element.value = opt.country.code;
        } catch (error) {
            console.warn(`COUNTRY error => ${error}`);
            if (element) element.value = opt.country.default;
        } finally {
            if (element) {
                element.addEventListener('change', () => {
                    opt.country.code = element.value;
                    regionReset('country');
                    regionNext('country');
                });
            }
            regionNext('country');
        }
    };

    setElements();
    regionCountryLoad();
}

const queryControl = async function() {
    const activationModal = function(activation = null) {
        if (activation == null) {
            console.warn('activationModal warn: activation null');
            return;
        };
        loadSnippet({
            snippet: '_customer-activation-popup',
            params: {
                include: 'customer-register',
                activation: activation,
            },
            success: function(loadRes){
                modal({
                    id: 'modal-customer-activation-popup',
                    width: '480px',
                    html: loadRes,
                });
            }
        });
    };

    const activationType = getUrlParam('activation');
    if (activationType) {
        switch (activationType) {
            case 'newsletter':
                let result = {};
                const token = getUrlParam('token');
                try {
                    await request('POST', getEndpoint('NEWSLETTER_ACTIVATE', token)).then(response => {
                        result = response;
                        if (response.status) {
                            modal({
                                html: response.statusText,
                                width: '480px',
                                alert: true,
                                class: 'success',
                            });
                        }
                    })
                } catch (error) {
                    console.warn(`NEWSLETTER_ACTIVATE error => ${error}`);
                }

                setTimeout(() => {
                    for (let i=0; i < callbacks.customer.subscribe.length; i++){
                        if (typeof callbacks.customer.subscribe[i] === 'function'){
                            try {
                                callbacks.customer.subscribe[i]?.(result);
                            } catch (error) { console.warn(`Customer Other Callback Error => ${error}`); }
                        }
                    }
                }, 1500);
            break;
            case 'membership':
                const memberId = getUrlParam('id'),
                    memberToken = getUrlParam('token');
                try {
                    await request('POST', getEndpoint('ACTIVATE_MEMBERSHIP', `${memberId}/${memberToken}`)).then(response => {
                        if (response.status) {
                            notify({
                                text: COMMON_LANG?.membership_activated,
                            });
                            loginPopup();
                            history.pushState('', '', '/');
                        }
                    });
                } catch (error) {
                    console.warn(`ACTIVATE_MEMBERSHIP error => ${error}`);
                }
            break;
            case 'facebook':
                activationModal('facebook-email');
            break;
            case 'facebookphone':
                activationModal('facebook-phone');
            break;
            case 'googlephone':
                activationModal('google-phone');
            break;
            case 'social':
                activationModal('social');
            break;
        }
    }

    const errorType = getUrlParam('error');
    if (errorType && PAGE_ID == '5' && MEMBER_INFO.ID < 1) {
        const errorMessages = {
            mail_already_registered: {
                message: COMMON_LANG.mail_already_registered || 'Bu e-posta adresiyle kayıt yapılmıştır. Lütfen giriş yapınız.'
            },
            phone_already_registered: {
                message: COMMON_LANG.phone_already_registered || 'Bu telefon numarasıyla kayıt yapılmıştır. Lütfen giriş yapınız.'
            }
        };

        if (errorMessages[errorType]) {
            modal({
                html: errorMessages[errorType].message,
                alert: true,
                class: 'danger'
            });

            const url = new URL(window.location.href);
            url.searchParams.delete('error');
            window.history.replaceState({}, '', url);
        }
    }
}

const passwordStrengthControl = async function() {
    if (Number(MEMBER_INFO.ID) < 1 || typeof MEMBER_INFO.PASSWORD_STRENGTH == 'undefined' || Number(MEMBER_INFO.PASSWORD_STRENGTH)) return;

    loadSnippet({
        snippet: '_customer-password-update',
        params: {
            include: 'customer-register',
        },
        success:  function(loadRes){
            modal({
                id: 'modal-customer-password-update',
                html: loadRes,
                width: '480px',
                close: false,
                disabledClose: true,
            });
        }
    });
}

const loginPasswordChange = async function(formData) {
    await loadSnippet({
        snippet: '_customer-password-change',
        params: {
            include: 'customer-register',
        },
        success: async function(loadRes){
            await modal({
                id: 'modal-customer-password-change',
                width: '480px',
                html: loadRes,
            });
        }
    });

    while (true) {
        if (typeof SNIPPET_JS.CUSTOMER_PASSWORD_CHANGE == 'object') {
            SNIPPET_JS.CUSTOMER_PASSWORD_CHANGE['FORM_DATA'] = formData;
            break;
        } else {
            await awaitTimeOut(1000);
        }
    }
}

const memberKvkkControl = async function() {
    if (typeof ADMIN_USER_FULLNAME != 'undefined' && ADMIN_USER_FULLNAME.trim() != '') return;
    if (MEMBER_INFO.ID == 0 || MEMBER_INFO.KVKK == 1 || SETTINGS.KVKK_REQUIRED != 1) return;

    loadSnippet({
        snippet: '_customer-activation-popup',
        params: {
            include: 'customer-register',
            activation: 'kvkk',
        },
        success: function(loadRes){
            modal({
                id: 'modal-customer-activation-popup',
                width: '480px',
                html: loadRes,
            });
        }
    });
}

const loginPopup = async function(statusText = null) {
    if (MEMBER_INFO.ID > 0) return;
    
    await loadSnippet({
        snippet: 'login-popup',
        params: {
            include: 'customer-login',
        },
        success: function(loadRes){
            modal({
                id: 'modal-login-popup',
                width: '480px',
                html: `${statusText ? `${statusText}` : ''} ${loadRes}`,
            });
        }
    });
};

const Cart = {
    callback: {
        update: null,
        updateAll: null,
        delete: null,
        deleteAll: null,
        load: [],
        add: [],
    },
    storageKey : 'Cart',
    update: async function(sessIndex, count, callback) {
        try {
            await request('GET', getEndpoint('CART_UPDATE', `${sessIndex}/${count}`)).then(response => {
                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(response.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(response.totalQuantity);
                    } catch (err) {}
                }

                Cart.setStorage('update',response,sessIndex);

                for(let i=0; i < callbacks.cart.update.length; i++){
                    if(typeof callbacks.cart.update[i] === 'function'){
                        try {
                            callbacks.cart.update[i]?.(response);
                        } catch (error) { console.log(`Cart Update Callback Error => ${error}`); }
                    }
                }

                if (response.totalQuantity > CART_COUNT) {
                    for(let i=0; i < callbacks.cart.add.length; i++){
                        if(typeof callbacks.cart.add[i] === 'function'){
                            try {
                                callbacks.cart.add[i]?.(response);
                            } catch (error) { console.log(`Cart Add Callback Error => ${error}`); }
                        }
                    }
                } else {
                    for(let i=0; i < callbacks.cart.delete.length; i++){
                        if(typeof callbacks.cart.delete[i] === 'function'){
                            try {
                                callbacks.cart.delete[i]?.(response);
                            } catch (error) { console.log(`Cart Delete Callback Error => ${error}`); }
                        }
                    }
                }

                if (typeof SNIPPET_JS.CART_PREVIEW?.getCart == 'function') {
                    SNIPPET_JS.CART_PREVIEW.getCart();
                }

                if (typeof SNIPPET_JS.CART_DRAWER?.getCart == 'function') {
                    SNIPPET_JS.CART_DRAWER.getCart();
                }

                CART_COUNT = response.totalQuantity;
                CART_TOTAL = response.totalPrice;
                components.cartCountPrice();

                if (typeof callback === 'function') {
                    callback(response);
                    if (typeof Cart.callback.update === 'function') {
                        Cart.callback.update(response);
                    }
                } else {
                    modal({
                        width: '400px',
                        html: response.statusText
                    });
                    setTimeout(function() {
                        window.location.reload();
                    }, 2500);
                }
            })
        } catch (error) {
            console.warn(`CART_UPDATE error => ${error}`);
        }
    },
    updateAll: async function(countList, callback) {
        try {
            const param = typeof countList === 'object' ? countList.join('-') : countList;
            await request('GET', getEndpoint('CART_UPDATE_ALL', `${param}`)).then(response => {
                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(response.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(response.totalQuantity);
                    } catch (err) {}
                }

                for(let i=0; i < callbacks.cart.updateAll.length; i++){
                    if(typeof callbacks.cart.updateAll[i] === 'function'){
                        try {
                            callbacks.cart.updateAll[i]?.(response);
                        } catch (error) { console.log(`Cart UpdateAll Callback Error => ${error}`); }
                    }
                }

                if (typeof callback === 'function') {
                    callback(response);
                    if (typeof Cart.callback.updateAll === 'function') {
                        Cart.callback.updateAll(response);
                    }
                } else {
                    window.location.reload();
                }
            });
        } catch (error) {
            console.warn(`CART_UPDATE_ALL error => ${error}`);
        }
    },
    delete: async function(sessIndex, callback) {
        try {
            await request('GET', getEndpoint('CART_DELETE', `${sessIndex}`)).then(response => {
                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(response.totalQuantity);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(response.totalQuantity);
                    } catch (err) {}
                }

                if (typeof SNIPPET_JS.CART_PREVIEW?.getCart == 'function') {
                    SNIPPET_JS.CART_PREVIEW.getCart();
                }

                if (typeof SNIPPET_JS.CART_DRAWER?.getCart == 'function') {
                    SNIPPET_JS.CART_DRAWER.getCart();
                }

                CART_COUNT = response.totalQuantity;
                CART_TOTAL = response.totalPrice;
                components.cartCountPrice();

                Cart.setStorage('delete',response,sessIndex);

                for(let i=0; i < callbacks.cart.delete.length; i++){
                    if(typeof callbacks.cart.delete[i] === 'function'){
                        try {
                            callbacks.cart.delete[i]?.(response);
                        } catch (error) { console.log(`Cart Delete Callback Error => ${error}`); }
                    }
                }

                if (typeof callback === 'function') {
                    callback(response);
                    if (typeof Cart.callback.delete === 'function') {
                        Cart.callback.delete(response);
                    }
                } else if (typeof window[callback] === 'function') {
                    window[callback](response);
                    if (typeof Cart.callback.delete === 'function') {
                        Cart.callback.delete(response);
                    }
                } else {
                    window.location.reload();
                }
            });
        } catch (error) {
            console.warn(`CART_DELETE error => ${error}`);
        }
    },
    deleteAll: async function(callback) {
        try {
            await request('GET', getEndpoint('CART_DELETE_ALL')).then(response => {
                if (typeof mobileApp !== 'undefined') {
                    try {
                        mobileApp.changedCartCount(0);
                    } catch (err) {}
                }
                if (typeof webkit !== 'undefined') {
                    try {
                        webkit.messageHandlers.callbackHandler.postMessage(0);
                    } catch (err) {}
                }

                CART_COUNT = '0';
                CART_TOTAL = '0,00';
                components.cartCountPrice();

                Cart.setStorage('deleteAll');

                for(let i=0; i < callbacks.cart.deleteAll.length; i++){
                    if(typeof callbacks.cart.deleteAll[i] === 'function'){
                        try {
                            callbacks.cart.deleteAll[i]?.(response);
                        } catch (error) { console.log(`Cart DeleteAll Callback Error => ${error}`); }
                    }
                }

                if (typeof Cart.callback.deleteAll === 'function') {
                    Cart.callback.deleteAll(response);
                }
                if (typeof callback === 'function') {
                    callback(response);
                } else {
                    setTimeout(function() {
                        window.location.reload();
                    }, 750);
                }
            });
        } catch (error) {
            console.warn(`CART_DELETE_ALL error => ${error}`);
        }
    },
    setStorage: async function(action,response,index){
        if(typeof window.localStorage === 'undefined'){
            return false;
        }
        let storage = window.localStorage.getItem(Cart.storageKey);
        if(storage === null){
            storage = {  summary : {   },    items : []  };
        }else{
            storage = JSON.parse(storage);
        }

        switch(action) {
            case 'update':
            case 'add':
                if(response.cartProducts === null){
                    return false;
                }
                storage.items = response.cartProducts;
                storage.summary = { total : response.totalPrice};
                break;

            case 'delete':
                if (storage && storage.items) {
                    if(storage.items.length === 0){
                        return false;
                    }
                    storage.items.splice(index,1);
                    storage.summary.total = response.priceCart;
                    break;
                }

            case 'deleteAll':
                storage.items  = [];
                storage.summary = { total : 0};
                break;
        }

        window.localStorage.setItem(Cart.storageKey,JSON.stringify(storage));
        return true;
    },
    getStorage: function(){
        let storage = window.localStorage.getItem(Cart.storageKey);
        if(storage === null){
            storage = [];
        }else{
            storage = JSON.parse(storage);
        }
        return storage;
    }
}

const addToCart = async function(opt = {}) {
    let defaults = {
        productId: 0,
        variantId: 0,
        quantity: 0,
        buyNow: 0,
        relatedProductId: '',
        multi: false,
        multiItem: null,
        personalizationPid: [],
        modal: true,
    };

    opt = { ...defaults, ...opt };

    const formData = new FormData();

    if(Array.isArray(opt.productId) && opt.productId.length > 1) {
        opt.productId.forEach(item => {
            formData.append('productId[]', item);
        });
    } else {
        opt.multi = false;
        formData.append('productId', opt.productId);
    }

    if(Array.isArray(opt.variantId) && opt.variantId.length > 1) {
        opt.variantId.forEach(item => {
            formData.append('variantId[]', item);
        });
    } else {
        formData.append('variantId', opt.variantId);
    }

    if(Array.isArray(opt.quantity) && opt.quantity.length > 1) {
        opt.quantity.forEach(item => {
            formData.append('quantity[]', item);
        });
    } else {
        formData.append('quantity', opt.quantity);
    }

    if (opt.relatedProductId) {
        opt.relatedProductId = opt.relatedProductId.split('-');
        opt.relatedProductId = opt.relatedProductId.join(':');
    }

    if(Array.isArray(opt.relatedProductId) && opt.relatedProductId.length > 0) {
        opt.relatedProductId.forEach(item => {
            formData.append('relatedProductId[]', item);
        });
    } else {
        formData.append('relatedProductId', opt.relatedProductId);
    }

    const productSubscribe = document.querySelector(`[data-toggle="product-subscribe-${opt.productId}"]`);
    if (productSubscribe?.value) {
        formData.append('subscribe', 1);
        formData.append('subscribeFrequency', productSubscribe.value);
    }

    const productNote = document.querySelector(`[data-toggle="product-note-${opt.productId}"]`);
    if (productNote?.value) {
        formData.append('orderNotes', productNote.value);
    }

    if (typeof BLOCK_JS.PERSONALIZATION != 'undefined' && BLOCK_JS.PERSONALIZATION[opt.productId]) {
        const appPersonalization = BLOCK_JS.PERSONALIZATION[opt.productId];
        if (!await appPersonalization.setData()) return;

        const data = {
            form_id: appPersonalization.FORM_DATA.form_id,
            product_id: opt.productId,
            sub_product_id: opt.variantId,
            data: appPersonalization.FORM_DATA.data,
        }
        formData.append(`formData[${opt.productId}]`, JSON.stringify(data));
    }

    formData.append('csrfToken', CART_CSRF_TOKEN);

    const variantModal = (response) => {
        if (document.querySelector('#modal-cart-popup-variant')) {
            notify({
                text: COMMON_LANG?.variant_notify ?? response.statusText,
                class: 'danger',
            });
            return;
        }

        if (opt.relatedProductId) {
            opt.relatedProductId = opt.relatedProductId.split(':');
            opt.relatedProductId = opt.relatedProductId.join('-');
        }
        loadSnippet({
            snippet: 'cart-popup-variant',
            params: {
                include: 'cart',
                PRODUCT_ID: opt.productId,
                QUANTITY: opt.quantity,
                RELATED_PRODUCT_ID: opt.relatedProductId,
            },
            success: function(loadRes){
                modal({
                    id: 'modal-cart-popup-variant',
                    width: '380px',
                    html: loadRes,
                });
            }
        });
    }

    const cartModal = () => {
        if (opt.modal == false) return;

        if (opt.relatedProductId) {
            opt.relatedProductId = opt.relatedProductId.split(':');
            opt.relatedProductId = opt.relatedProductId.join('-');
        }
        loadSnippet({
            snippet: 'cart-popup',
            params: {
                include: 'cart',
                product: (Array.isArray(opt.productId) && opt.productId.length > 1) ? opt.productId.join('-') : opt.productId,
                multi: (Array.isArray(opt.productId) && opt.productId.length > 1) ? true : false,
                relatedProductId : opt.relatedProductId
            },
            success: function(loadRes){
                modalClose('#modal-cart-popup');
                modalClose('#modal-cart-popup-variant');
                modal({
                    id: 'modal-cart-popup',
                    width: '580px',
                    html: loadRes,
                });
            }
        });
        if (PAGE_ID == 30 && BLOCK_JS?.CART?.load && typeof BLOCK_JS?.CART?.load == 'function') BLOCK_JS.CART.load();
    };

    try {
        await request('POST', getEndpoint('ADD_TO_CART'), formData).then(response => {
            if (response?.statusCode == 'EOC0001') {
                modal({
                    html: `
                        <div>
                            <div>${response.statusText || COMMON_LANG?.cart_change_warning}</div>
                            <div class="text-xs text-gray-500 mt-2">${COMMON_LANG?.redirect_to_payment_page}</div>
                        </div>
                    `,
                    class: 'info',
                    alert: true,
                    buttons: [
                        {
                            text: COMMON_LANG?.go_to_payment,
                            href: '/' + PAGE_LINK.ORDER,
                            class: 'btn btn-primary !text-xs !h-10',
                        }
                    ],
                    callbacks: {
                        close: function() {
                            window.location.href = '/' + PAGE_LINK.ORDER;
                        }
                    }
                });

                setTimeout(() => {
                    window.location.href = '/' + PAGE_LINK.ORDER;
                }, 3000);
                return;
            }

            if (response.status > 0 || (Array.isArray(response) && response[0].status > 0)) {
                CART_COUNT = Array.isArray(response) ? response[response.length - 1].totalQuantity : response.totalQuantity;
                CART_TOTAL = Array.isArray(response) ? response[response.length - 1].totalPrice : response.totalPrice;
                components.cartCountPrice();

                Cart.setStorage('add', response);

                for(let i=0; i < callbacks.cart.add.length; i++){
                    if(typeof callbacks.cart.add[i] === 'function'){
                        try {
                            callbacks.cart.add[i]?.(response);
                        } catch (error) { console.log(`Cart Add Callback Error => ${error}`); }
                    }
                }

                for (let i = 0; i < Cart.callback.add.length; i++) {
                    if (typeof Cart.callback.add[i] === 'function') {
                        try {
                            Cart.callback.add[i]?.(response);
                        } catch (error) { console.warn(`Shopping basket adding Callback error => ${error}`) }
                    }
                }
            }

            if (opt.multi) {
                const errorMessage = [];
                for(let i=0; i<response.length; i++) {
                    const that = response[i];
                    if(that.status < 1) {
                        errorMessage.push(that);
                    }
                    else {
                        opt.multiItem = that;
                    }
                }

                if (opt.multiItem != null) {
                    switch (opt.multiItem.status) {
                        case 1:
                            opt.multi = false;
                            cartModal();
                            break;
                        case 2:
                            window.location.href = opt.multiItem.url;
                            break;
                        case 3:
                            opt.multi = false;
                            cartModal();
                            break;
                    }
                    opt.multiItem = null;
                }
                if (errorMessage.length > 0) {
                    let errorHtml = '';
                    errorMessage.forEach(msg => {
                        if (msg.url && msg.title) {
                            errorHtml += `<p>${msg.statusText} : <a href="/${msg.url}" class="underline" target="_blank">${msg.title}</a></p>`;
                        } else {
                            errorHtml += `<p>${msg.statusText}</p>`;
                        }
                    });
                    setTimeout(() => {
                        notify({
                            text: errorHtml,
                            class: 'danger',
                            duration: 2400,
                        });
                    }, 500);
                }
            } else {
                switch (response.status) {
                    case -1:
                        if (response.url != '') {
                            if ((PAGE_TYPE !== 'product' || document.getElementById('product-id')?.value != opt.productId) && !document.querySelector('#popup-variant')) {
                                variantModal(response);
                            } else if (PAGE_TYPE === 'product' && document.getElementById('product-id')?.value === opt.productId) {
                                const variantNotify = document.querySelector('[data-toggle="variant-notify"]');
                                if (variantNotify) {
                                    variantNotify.classList.remove('hidden');
                                    scrollBehavior(variantNotify, 200);
                                    variantNotify.querySelector('button').addEventListener('click', e => {
                                        variantNotify.classList.add('hidden');
                                    });
                                } else {
                                    notify({
                                        text: COMMON_LANG?.variant_notify ?? response.statusText,
                                        class: 'danger',
                                        duration: 2400,
                                    });
                                }
                            } else {
                                window.location.href = '/' + response.url;
                            }
                            return false;
                        }
                        break;
                    case 0:
                        if (response.personalization_error && PAGE_TYPE !== 'product' && response.url) {
                            window.location.href = '/' + response.url;
                            return false;
                        }
                        notify({
                            text: response.statusText || COMMON_LANG?.no_product_added,
                            class: 'danger',
                            duration: 2400,
                        });
                        break;
                    case -2:
                        loadSnippet({
                            snippet: 'customer-address-store',
                            params: {
                                include: 'customer-address',
                                productId: opt.productId,
                                variantId: opt.variantId,
                                quantity: opt.quantity,
                                buyNow : opt.buyNow
                            },
                            success: function(loadRes){
                                modal({
                                    id: 'modal-customer-address-store',
                                    html: loadRes,
                                });
                            }
                        });
                        break;
                    case 1:
                        if (opt.buyNow == 0) {
                            modalClose('#modal-cart-popup-variant');
                            if (components.cartPreview.element) components.cartPreview.previewShow(true);
                            if (components.cartDrawer.element) components.cartDrawer.element.click();
                        } else {
                            window.location.href = '/' + PAGE_LINK.CART;
                        }
                        break;
                    case 2:
                        window.location.href = response.url;
                        break;
                    case 3:
                        if (opt.buyNow == 0) {
                            cartModal();
                        } else {
                            window.location.href = '/' + PAGE_LINK.CART;
                        }
                        break;
                    case 4: 
                        if (opt.buyNow == 0) {
                            modalClose('#modal-cart-popup-variant');
                            notify({
                                text: `<div>${response.statusText}</div><a href="/${PAGE_LINK.CART}" class="text-green-500 font-semibold underline">${COMMON_LANG?.go_to_cart}</a>`,
                                duration: 5000,
                            });
                        } else {
                            window.location.href = '/' + PAGE_LINK.CART;
                        }
                    default:
                        break;
                }
            }

            const products = document.querySelectorAll('input[data-toggle="multi-select"]:checked');
            Array.from(products).map(item => item.checked = false);
        });
    } catch (error) {
        console.warn(`ADD_TO_CART error => ${error}`);
    }
}

const productLoader = async function() {
    const loaderItem = document.querySelector('[data-toggle="product-loader"]');
    if (!loaderItem) return;

    const options = {
        id: loaderItem.dataset.id || null,
        target: loaderItem.dataset.target || null,
        product: loaderItem.dataset.item || null,
        page: Number(getUrlParam('ps') || 1),
        scrollUp: false,
    };

    if (options.id === null || options.target === null || options.product === null) {
        console.warn('productLoader warn: options.id || options.target || options.product null');
        return;
    };

    const relationId = document.querySelector(options.target)?.closest('[data-block-id]')?.dataset.blockId || 0;
    if (!relationId) return;

    let scrollDown = true;
    let scrollUp = true;
    let scrollY;

    if (getUrlParam('ps') && Number(getUrlParam('ps')) > 1 && SETTINGS.DYNAMIC_LOADING_SHOW_BUTTON && history.scrollRestoration) history.scrollRestoration = 'manual';
    window.pushstateloaded = false;

    const paginationPushState = (key, title, url) => {
        window.pushstateloaded = true;
        if (window.history && window.history.pushState) window.history.replaceState(key, title, url);
        return;
    };

    const addClassProduct = async (products) => {
        products[0].dataset.page = options.page;
        products[products.length - 1].dataset.page = options.page;

        Array.from(products).forEach((product, index) => {
            product.dataset.index = `${options.page}-${index}`;

            product.addEventListener('click', e => {
                let setProduct = {
                    category: window.location.pathname,
                    product: product.dataset.index,
                };
                if (setProduct.product) setCookie('productIndex', JSON.stringify(setProduct));
            });

            });
    };

    const appendProduct = async (result, prepend = false) => {
        const domParser = new DOMParser();
        const resultElm = domParser.parseFromString(result, "text/html");
        const products = resultElm.documentElement.querySelectorAll(options.product);

        if (products.length == 0) return;

        for(let i=0; i<products.length; i++) {
            if (prepend == false) {
                await document.querySelector(options.target).append(products[i]);
            } else {
                await document.querySelector(options.target).prepend(products[(products.length - 1) - i]);
            }
        }

        if (prepend != false) {
            scrollY = products[products.length - 1].offsetTop + products[products.length - 1].offsetHeight;
            window.scrollTo(0, scrollY);
            window.onscroll = function() { window.scrollTo(0, scrollY); };
        }

        await components.init();

        for(let i=0; i < callbacks.product.dynamicLoader.length; i++){
            if(typeof callbacks.product.dynamicLoader[i] === 'function'){
                try {
                    const regex = /PRODUCT_DATA\.push\(JSON\.parse\('([^']+)'\)\);/g;
                    const matches = [];

                    for (const match of result.matchAll(regex)) {
                        let jsonData = eval("'" + match[1] + "'");
                        matches.push(JSON.parse(jsonData));
                    }
                    callbacks.product.dynamicLoader[i]?.(matches);
                } catch (error) { console.log(`Product Dynamic Loader Callback Error => ${error}`); }
            }
        }

        addClassProduct(products);
        if (SETTINGS.DYNAMIC_LOADING_SHOW_BUTTON) window.onscroll = null;
        setTimeout(() => {
            prepend == false ? scrollDown = true : scrollUp = true;
        }, 300);
    };

    const getProduct = async (page, prepend = false) => {
        options.page = prepend == false ? Number(page) + 1 : Number(page) - 1;
        if (options.page < 1) return;

        const products = document.querySelectorAll(`${options.target} ${options.product}[data-page="${options.page}"]`);
        if (products.length > 0) return;

        loader(true);
        prepend == false ? scrollDown = false : scrollUp = false;

        let params = getLink('link', window.location.pathname.replaceAll(/^\//ig, ''));
        params = getLink('ps', '', params);
        params = getLink('pg', options.page, params);
        params = params.split('?')[1] || '';

        const endPoint = getEndpoint('BLOCK_PAGE', `${relationId}/products?${params}`);
        try {
            await request('GET', endPoint).then(async response => {
                if (response) await appendProduct(response, prepend);
            });
        } catch (error) {
            console.warn(`PRODUCT_LOADER error => ${error}`);
        } finally {
            loader();
        }
    };

    let lastScrollTop = 0;
    const runScroll = async () => {
        const { clientHeight } = document.documentElement,
                  pageProducts = document.querySelectorAll(`${options.target} ${options.product}[data-page]`);

        if (pageProducts.length == 0) return;

        pageProducts.forEach(async (product) => {
            const productRect = product.getBoundingClientRect();
            const diff = productRect.height > window.innerHeight ? productRect.height / 2 : 0;
            if (productRect.top >= 0 && (productRect.bottom - diff <= window.innerHeight) && getUrlParam('ps') != product.dataset.page) {
                if (product.dataset.page == 1) {
                    paginationPushState('pagination', `Page ${product.dataset.page}`, getLink('ps', ''));
                } else {
                    paginationPushState('pagination', `Page ${product.dataset.page}`, getLink('ps', product.dataset.page));
                }
            }
        });

        const products = document.querySelectorAll(`${options.target} ${options.product}[data-page="${getUrlParam('ps') || 1}"]`),
            firstProduct = products[0].getBoundingClientRect(), 
            lastProduct = products[1] ? products[1].getBoundingClientRect() : products[0].getBoundingClientRect();

        let currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        if (currentScrollTop > lastScrollTop) {
            if (((lastProduct.height / 2) + lastProduct.top) < clientHeight && scrollDown == true) getProduct(getUrlParam('ps') || 1);
        } else if (currentScrollTop < lastScrollTop) {
            if (firstProduct.top > 0 && (firstProduct.bottom  / 2) < clientHeight && options.scrollUp == true && scrollUp == true) getProduct(getUrlParam('ps') || 1, true);
        }
        lastScrollTop = currentScrollTop;
    };

    const products = document.querySelectorAll(`${options.target} ${options.product}`);
    if (products.length > 0) await addClassProduct(products);

    if (getUrlParam('ps') && Number(getUrlParam('ps')) > 1 && SETTINGS.DYNAMIC_LOADING_SHOW_BUTTON) {
        const loadBtn = document.createElement('div');
        loadBtn.className = 'w-full text-center mb-4 product-loader-btn';
        loadBtn.innerHTML = `<button id="product-loader-btn-${options.id}" class="btn btn-primary" data-qa="load-more-button">${COMMON_LANG?.load_more_products}</button>`;
        document.querySelector(options.target).parentNode.prepend(loadBtn);

        const getProductIdCookie = getCookie('productIndex');
        setCookie('productIndex', '');

        if (getProductIdCookie) {
            const getProductId = JSON.parse(getProductIdCookie);
            if (getProductId?.category == window.location.pathname && getProductId?.product) {
                const product = document.querySelector(`${options.target} ${options.product}[data-index="${getProductId.product}"]`);
                const otherProduct = document.querySelector(`${options.target} ${options.product}`);

                let scrollY = 0;
                if (product) {
                    scrollY = product.offsetTop - 100;
                } else if (otherProduct) {
                    scrollY = otherProduct.offsetTop - 100;
                }

                window.scrollTo(0, scrollY);
            }
        }

        loadBtn.querySelector(`#product-loader-btn-${options.id}`).addEventListener('click', () => {
            document.documentElement.style.scrollBehavior = 'revert';
            loadBtn.remove();
            options.scrollUp = true;
            getProduct(getUrlParam('ps'), true);
        });
    }

    window.addEventListener('scroll', runScroll);
    document.body.addEventListener('touchend', runScroll, false);
};

const refererStorage = {
    hasLocal: 'localStorage' in window && window['localStorage'] !== null,
    addItem: function() {
        if (this.hasLocal) {
            this.addItemStorage();
        } else {
            this.addItemCookie();
        }
    },
    hasQueryString: function() {
        let ref = document.referrer || "";
        if (ref == '') {
            return false;
        }
        let a = document.createElement('a');
        a.href = ref;
        let q = '';
        let queryString = a.search;
        let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split('=');
            if (pair[0] == 'q') {
                q = pair[1];
            }
        }
        return q != '';
    },
    addItemStorage: function() {
        let cReferrer = localStorage.getItem('cReferrer');
        let items = [];
        if (cReferrer !== null) {
            let obj = {};
            try {
                obj = JSON.parse(cReferrer);
            } catch (err) {
            }
            if (typeof obj.schedule != "undefined" && Date.now() < obj.schedule && !this.hasQueryString()) {
                return;
            }
            items = obj.items || [];
        }
        items.push({ time: Number.parseInt(Date.now() / 1000), uri: document.referrer, page: window.location.href });
        this.setItems(items);
    },
    addItemCookie: function() {
        try {
            let cReferrer = getCookie('cReferrer');
        } catch (err) {
            return;
        }
        let items = [];
        if (cReferrer !== null) {
            let obj = {};
            try {
                obj = JSON.parse(cReferrer);
            } catch (err) {
            }
            if (typeof obj.schedule != "undefined" && Date.now() < obj.schedule && !this.hasQueryString()) {
                return;
            }
            items = obj.items || [];
        }
        items.push({ time: Number.parseInt(Date.now() / 1000), uri: document.referrer });
        this.setItems(items);
    },
    getObj: function() {
        let cReferrer = null;
        let cReferrerObj = {};
        if (this.hasLocal) {
            cReferrer = localStorage.getItem('cReferrer');
        } else {
            try {
                cReferrer = getCookie('cReferrer');
            } catch (err) {}
        }
        try {
            cReferrerObj = JSON.parse(cReferrer);
        } catch (err) {}
        return cReferrerObj;
    },
    getItems: function() {
        return this.getObj().items || [];
    },
    setItems: function(items) {
        let obj = {
            schedule: Date.now() + (24 * 60 * 60 * 1000),
            items: items || []
        };
        this.save(obj);
    },
    save: function(sObj) {
        if (this.hasLocal) {
            this.saveStorage(sObj);
        } else {
            this.saveCookie(sObj);
        }
    },
    saveStorage: function(sObj) {
        localStorage.setItem('cReferrer', JSON.stringify(sObj));
    },
    saveCookie: function(sObj) {
        try {
            setCookie('cReferrer', JSON.stringify(sObj), { path: '/', expires: 30 });
        } catch (err) {}
    }
}

const desingMode = async function (mode = 0) {
    let newMode = Number.parseInt(mode) ? '0' : '1';

    await request('GET', getEndpoint('MOD_DESIGNER', `${newMode}`)).then(response => {
        if (response.status) window.location.reload();
    }).catch(error => {
        console.warn(`mod-designer error => ${error}`);
    });
}

const getPluginsPopup = async function() {
    const cookieName = 't-plugins-popup';
    if (PAGE_ID != 1
        || typeof SETTINGS.PLUGINS_POPUP == 'undefined'
        || SETTINGS.PLUGINS_POPUP?.IS_ACTIVE != 1
        || SETTINGS.PLUGINS_POPUP?.CONTENT == ''
        || getCookie(cookieName)) return;

    modal({
        id: 'plugins-popup',
        html: SETTINGS.PLUGINS_POPUP.CONTENT,
        width: 'auto',
        callbacks: {
            open: function() {},
            close: function() {
                setCookie(cookieName, '1', 1);
            },
        },
    });
}

const getInfluencerBar = async () => {
    loadSnippet({
        snippet: '_influencer-bar-popup',
        params: {
            include: '_influencer-bar',
        },
        success: function (loadRes) {
            modal({
                id: 'influencer-bar-popup',
                html: loadRes,
                width: '520px',
            });
        }
    });
}

const onPageReady = function() {
    if (typeof ON_PAGE_READY == 'undefined') return;
    for (let i = 0; i < ON_PAGE_READY.length; i++) {
        if (typeof ON_PAGE_READY[i] == 'function') {
            try {
                ON_PAGE_READY[i]();
            } catch (ex) {
                console.error(ex);
            }
        }
    }
}

const lazyLoadedBg = async function(img) {
    const loadedBg = function(image) {        
        const imgPos = image.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        const isOnView = imgPos.bottom >= 0 && imgPos.right >= 0 &&
            imgPos.top <= viewportHeight && imgPos.left <= viewportWidth;

        const style = image.dataset.style;
        if (isOnView && style) {
            image.setAttribute('style', style);
            image.classList.remove('style-load');
            image.classList.add('style-loaded');
            image.removeAttribute('data-style');
            image.componentLoadedBg = 1;
        }
        return;
    }

    if (img.dataset?.style) {
        loadedBg(img);
        return;
    }

    const images = document.querySelectorAll('[data-style]');
    Array.from(images).forEach(img => {
        if (img.componentLoadedBg == 1) return;
        loadedBg(img);
    });
}

const getCaptcha = async function(form = null, response = null) {
    if (form.captcha == 1) return;
    if (form == null || response == null) {
        console.warn('getCaptcha warn: form or response null');
        return;
    };

    const field = response.field || response.key || '';
    let isCaptcha = false;
    isCaptcha = field == 'security_code' || field == 'g-recaptcha-response';

    if (!isCaptcha) {
        return;
    };

    const formCaptcha = form.querySelector('[data-toggle="captcha"]');
    if (!formCaptcha) {
        console.warn('getCaptcha warn: [data-toggle="captcha"] undefined');
        return;
    };

    const key = formCaptcha.dataset.key;
    if (!key) {
        console.warn('getCaptcha warn: key or sitekey undefined');
        return;
    };

    const url = getEndpoint('CAPTCHA', `${key}`);
    try {
        await request('GET', url).then(async response => {
            formCaptcha.innerHTML = response;
            formCaptcha.parentNode.insertBefore(formCaptcha.content.cloneNode(true), formCaptcha);
            formCaptcha.remove();
        });

        if (typeof grecaptcha == 'undefined' && field == 'g-recaptcha-response') {
            await new Promise(resolve => {
                const script = document.createElement('script');
                script.src = 'https://www.google.com/recaptcha/api.js';
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
                script.onload = () => {
                    const checkRecaptcha = () => {
                        if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
                            resolve();
                        } else {
                            setTimeout(checkRecaptcha, 100);
                        }
                    };
                    checkRecaptcha();
                };
            });
        }

    } catch (error) {
        console.warn(`CAPTCHA(getCaptcha) ${url} error => ${error}`);
    } finally {
        form.captcha = 1;
        const recaptcha = form.querySelector('[data-toggle="google-recaptcha"]');
        if (recaptcha && typeof grecaptcha !== 'undefined' && grecaptcha.render) {
            const widgetId = grecaptcha.render(recaptcha, {'sitekey': recaptcha.dataset.sitekey});
            recaptcha.dataset.captchaId = widgetId;
        }

        if (field == 'security_code') {
            const captcha = form.querySelector('[name="security_code"]');
            if (captcha) captcha.focus();
        }
        components.init();
    }
}

const captchaReset = async function(form = null) {
    if (form == null) {
        console.warn('captchaReset warn: element null');
        return;
    };

    try {
        const captchaToggle = form.querySelector('[data-toggle="captcha-toggle"]');
        if (captchaToggle) captchaToggle.click();

        const captcha = form.querySelector('[name="security_code"]');
        if (captcha) captcha.value = '';

        const recaptcha = form.querySelector('[data-toggle="google-recaptcha"]');
        if (recaptcha && typeof grecaptcha != 'undefined') {
            const widgetId = recaptcha.dataset.captchaId;
            if (widgetId) {
                grecaptcha.reset(Number.parseInt(widgetId));
            } else {
                grecaptcha.reset();
            }
        }
    } catch (error) {}
}

const appMobile = function() {
    const element = document.querySelector('[data-toggle="mobile-app"]');
    if (!isMobile() || !element || PAGE_ID != 1) return;

    if (getCookie('mobileApp') == 1) {
        element.remove();
        return;
    } else {
        element.removeAttribute('hidden');
    }

    const downloadElement = document.querySelector('[data-toggle="mobile-app-download"]');
    if (downloadElement) {
        const MobileAppRedirect = element.querySelector('[name="MobileAppRedirect"]')?.value || '',
            AppMarketLink = element.querySelector('[name="AppMarketLink"]')?.value || '',
            OpenAppLink = element.querySelector('[name="OpenAppLink"]')?.value || '';

        let storeUrl;
        if (MobileAppRedirect == 'ios') {
            storeUrl = `https://itunes.apple.com/app/id${AppMarketLink}`;
        } else if (MobileAppRedirect == 'android') {
            storeUrl = `market://details?id=${AppMarketLink}`;
        }
        if (!storeUrl) {
            console.warn('appMobile warn: storeUrl undefined');
            return;
        };

        const meta = document.createElement('meta');
        meta.name = 'apple-itunes-app';
        meta.content = `app-id=${AppMarketLink}, affiliate-data=myAffiliateData, app-argument=${OpenAppLink}://`;
        document.head.append(meta);

        downloadElement.addEventListener('click', e => {
            document.location.href = storeUrl;
        });
    }

    const hiddenElement = document.querySelector('[data-toggle="mobile-app-hidden"]');
    if (hiddenElement && element) {
        hiddenElement.addEventListener('click', e => {
            element.remove();
            setCookie('mobileApp', 1);
        });
    }
}

const moneyExchange = function(price, from, to) {
    let k = from + '_TO_' + to;

    if (typeof RATE === 'object' && typeof RATE[k] !== 'undefined') {
        return price * RATE[k];
    } else {
        return price;
    }
}

const fastClone = function(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (obj instanceof Array) return obj.map(item => fastClone(item));

    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = fastClone(obj[key]);
        }
    }
    return cloned;
}

const productItemScope = function(productItem, selectors, multiple = false) {
    if (!productItem || !selectors) return null;

    const selectorList = selectors
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => `${s}:not(:scope [data-toggle="product"] ${s})`)
        .join(', ');

    if (!selectorList) return null;

    return multiple
        ? productItem.querySelectorAll(`:scope ${selectorList}`)
        : productItem.querySelector(`:scope ${selectorList}`);
};

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

const createSlider = function(element, index) {
    const id = element.dataset.id || element.closest('[data-block-id]')?.dataset.blockId || index;
    const BLOCK_SETTING = Array.from(BLOCKS).find(x => x.ID == id) || {};
    const slider = element.querySelector('[data-swiper]');
    const thumbSlider = element.querySelector('[data-swiper-thumb]');
    const callback = element.dataset.callback;

    const defaultSetting = {
        slider: { perview: {}, margin: {}, grid: {} },
        thumbSlider: { perview: {}, margin: {}, grid: {} },
    };

    function applyDatasetConfig(element, type, target) {
        const datasetValue = element?.dataset[type];
        if (!datasetValue) return;

        datasetValue.replaceAll(/\s+/g, "").split(",").forEach(item => {
            const [key, value] = item.split(":");
            if (key && value) {
                target[type][key.trim()] = Number(value);
            }
        });
    }

    function defaultSettingFn(type) {
        applyDatasetConfig(slider, type, defaultSetting.slider);
        applyDatasetConfig(thumbSlider, type, defaultSetting.thumbSlider);
    }

    ['perview', 'margin', 'grid'].forEach(defaultSettingFn);
    const breakpointsConfig = {0: 'xs',640: 'sm',768: 'md',1024: 'lg',1280: 'xl',1440: 'xxl'};

    function resolveValue(settingKey, size, fallbackSizes, defaultVal, target, name) {
        const blockVal = BLOCK_SETTING?.SETTING?.[settingKey]?.[size.toUpperCase()];
        if (blockVal && blockVal != '0' && name == 'slider') return Number.parseFloat(blockVal);

        for (const fb of fallbackSizes) {
            const val = target?.[settingKey.toLowerCase()]?.[fb];
            if (val && val != '0') return Number.parseFloat(val);
        }

        return defaultVal;
    }

    function buildBreakpoints(target, name) {
        const breakpoints = {};

        for (const [bp, size] of Object.entries(breakpointsConfig)) {
            const fallbackSizes = Object.values(breakpointsConfig)
            .slice(0, Object.values(breakpointsConfig).indexOf(size) + 1)
            .reverse();

            breakpoints[bp] = {
                slidesPerView: resolveValue('PERVIEW', size, fallbackSizes, 'auto', target, name),
                slidesPerGroup: BLOCK_SETTING?.SETTING?.LOOP
                    ? 1
                    : Math.floor(resolveValue('PERVIEW', size, fallbackSizes, 1, target, name)),
                spaceBetween: resolveValue('MARGIN', size, fallbackSizes, 0, target, name),
                grid: {
                    rows: resolveValue('GRID', size, fallbackSizes, 1, target, name),
                },
            };
        }

        return breakpoints;
    }

    const sliderBreakpoints = buildBreakpoints(defaultSetting.slider, 'slider');
    const thumbSliderBreakpoints = buildBreakpoints(defaultSetting.thumbSlider, 'thumbSlider');

    const swiperNoScope = function(selectors) {
        if (!selectors) return null;

        const selectorList = selectors
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => `${s}:not(:scope [data-toggle="slider"] ${s})`)
            .join(', ');

        if (!selectorList) return null;

        return element.querySelector(`:scope ${selectorList}`);
    };

    const nextEls = swiperNoScope('.swiper-button-next');
    const prevEls = swiperNoScope('.swiper-button-prev');
    const pagEls  = swiperNoScope('.swiper-pagination');
    const scrollbarEls = swiperNoScope('.swiper-scrollbar');

    if (BLOCK_SETTING?.SETTING?.PAGINATION_TYPE == 'progress') BLOCK_SETTING.SETTING.PAGINATION_TYPE = 'progressbar';

    let sliderDatasetDirection = slider?.dataset?.direction;
    if (slider?.dataset?.directionMobile && isMobile(768)) sliderDatasetDirection = slider?.dataset?.directionMobile;

    let thumbSliderDatasetDirection = thumbSlider?.dataset?.direction;
    if (thumbSlider?.dataset?.directionMobile && isMobile(768)) thumbSliderDatasetDirection = thumbSlider?.dataset?.directionMobile;

    BLOCK_JS[`SLIDER-${id}`] = {
        options: {
            direction: BLOCK_SETTING?.SETTING?.DIRECTION || sliderDatasetDirection || 'horizontal',
            loop: BLOCK_SETTING?.SETTING?.LOOP || slider?.dataset?.loop || false,
            initialSlide: Number.parseFloat(BLOCK_SETTING?.SETTING?.INITIAL_SLIDE) || Number.parseFloat(slider?.dataset?.initialSlide) || 0,
            centeredSlides: BLOCK_SETTING?.SETTING?.CENTER || slider?.dataset?.center || false,
            speed: Number.parseFloat(BLOCK_SETTING?.SETTING?.SPEED) || Number.parseFloat(slider?.dataset?.speed) || 500,
            effect: BLOCK_SETTING?.SETTING?.EFFECT || slider?.dataset?.effect || 'slide',                  
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: [0, 0, -400],
                },
                next: {
                    translate: ['100%', 0, 0],
                },
            },
            navigation: {
                nextEl: nextEls,
                prevEl: prevEls,
            },
            pagination: {
                el: pagEls,
                type: BLOCK_SETTING?.SETTING?.PAGINATION_TYPE || 'bullets',
                clickable: true,
            },
            thumbs: {
                swiper: thumbSlider ?? '',
            },
            scrollbar: {
                el: scrollbarEls,
                hide: true
            },
            grid:{
                fill: 'row',
            },
            breakpoints: sliderBreakpoints,
            lazy: true,
        },
        thumbOptions: {
            direction: thumbSliderDatasetDirection || 'horizontal',
            watchSlidesProgress: true,
            lazy: {
                loadPrevNext: true
            },
            breakpoints: thumbSliderBreakpoints,
        },
        init: function() {
            const self = this;

            if ((BLOCK_SETTING?.SETTING?.AUTOPLAY && BLOCK_SETTING?.SETTING?.AUTOPLAY != 0) || (slider?.dataset?.autoplay && slider?.dataset?.autoplay != 0)) {
                self.options['autoplay'] = {
                    delay: (BLOCK_SETTING?.SETTING?.AUTOPLAY || slider?.dataset?.autoplay) + '000'
                }
            }

            if (thumbSlider) {
                thumbSlider.swiper?.destroy();
                new Swiper(thumbSlider, {
                    ...self.thumbOptions
                });
            } else {
                self.thumbOptions = {};
            }

            slider.swiper?.destroy();
            new Swiper(slider, {
                ...self.options
            });
            slider.swiper.slideTo(0, false,false);
        }
    }

    BLOCK_JS[`SLIDER-${id}`]['element'] = element;
    BLOCK_JS[`SLIDER-${id}`]['slider'] = slider;
    BLOCK_JS[`SLIDER-${id}`]['thumbSlider'] = thumbSlider;
    BLOCK_JS[`SLIDER-${id}`]['blockId'] = id;

    try {
        BLOCK_JS[`SLIDER-${id}`].init();
    } catch (error) {}

    if(typeof window[callback] == 'function'){
        try {
            window[callback](BLOCK_JS[`SLIDER-${id}`]);
            console.log('%c 🔄 Callback Hatırlatma ', 'background: #ff9800; color: white; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 3px;', 
                `${callback} fonksiyonu çalıştı! ⚠️ Options veya thumbOptions değişikliklerinden sonra init() çağrılmalı`);
        } catch (error) {}
    }

};

const showOutStock = async function(element) {
    if (element.nodeName != 'TEMPLATE' || element.componentOutStock == 1) return;
    element.componentOutStock = 1;

    const url = element.dataset.url;
    if (!url) return;

    try {
        await request('GET', url).then(response => {
            const elementClasses = Array.from(element.classList);
            const responseWrapper = document.createElement('div');
            responseWrapper.innerHTML = response;
            responseWrapper.querySelectorAll('script').forEach(script => script.remove());
            responseWrapper.querySelector('[data-toggle="show-out-stock"]').classList.add(...elementClasses);
            element.innerHTML = responseWrapper.innerHTML;
            element.parentNode.insertBefore(element.content.cloneNode(true), element);
            element.remove();
        });
    } catch (error) {
        console.warn(`OUT_STOCK error => ${error}`);
    } finally {
        components.init();
    }
}

components = {
    menuHover: function() {
        const element = document.querySelector('[data-toggle="menu"]');
        if (!element) return;
        if (element.componentMenuHover == 1) return;

        let time;

        setTimeout(() => {
            if (element.matches(':hover')) {
                element.classList.add('active');
            }
        }, 250);

        element.addEventListener('mouseenter', () => {
            time = setTimeout(() => {
                if (!element.classList.contains('active')) element.classList.add('active');
            }, 250);
        });

        element.addEventListener('mouseleave', () => {
            element.classList.remove('active');
            clearTimeout(time);
        });

        element.addEventListener('click', () => {
            if (element.classList.contains('active')) {
                element.classList.remove('active');
                clearTimeout(time);
            }
            return;
        });

        element.componentMenuHover = 1;
    },
    liveSearch: function() {
        const liveSearchs = document.querySelectorAll('[data-toggle="live-search"]');        
        Array.from(liveSearchs).forEach(search => {
            if (search.componentLiveSearch == 1) return;

            const id = search.closest('[data-block-id]')?.dataset.blockId;
            if (!id) {
                console.warn('liveSearch warn: id (data-block-id) undefined');
                return;
            };

            BLOCK_JS[`LIVE_SEARCH`] = Vue.createApp({
                data() {
                    return {
                        live_data: {},
                        input : PAGE_ID == 12 ? getUrlParam('q') : '',
                        limit: 3,
                        licence: search.dataset.licence || 0,
                        timer: null,
                        categories: [],
                        CURRENCY: CURRENCY,
                        t: TRANSLATES['header'],
                    }
                },
                methods: {
                    getCategories() {
                        const self = this;

                        const isCategory = search.querySelector('[name="category"]');
                        if (!isCategory) return;

                        try {
                            request('GET', getEndpoint('CATEGORY')).then(response => {
                                self.categories = response;
                            });
                        } catch (error) {
                            console.warn(`CATEGORY error => ${error}`);
                        }
                    },
                    search() {
                        const self = this;
                        self.timer = setTimeout(() => {                            
                            try {
                                request('POST', getEndpoint('SEARCH_PRODUCT', encodeURI(self.input))).then(response => {
                                    self.live_data['products'] = response.data;
                                });
                            } catch (error) {
                                console.warn(`SEARCH_PRODUCT error => ${error}`);
                            }
                        }, 250);
                    },
                    searchAll() {
                        const self = this;
                        self.timer = setTimeout(() => {
                            try {
                                request('GET', getEndpoint('SEARCH_ALL', self.input)).then(response => {
                                    self.live_data = response;
                                });
                            } catch (error) {
                                console.warn(`SEARCH_ALL error => ${error}`);
                            }
                        }, 250);
                    },
                    update(value = null) {
                        const self = this;

                        if (value == null) value = self.input;
                        clearTimeout(self.timer);
                        if (value.length >= self.limit) {
                            self.licence == 1 ? self.searchAll() : self.search();
                        } else {
                            self.live_data = {};
                        }
                    },
                    submitForm() {
                        if (search.nodeName == 'FORM') search.submit();
                    }
                },
                watch: {
                    'input'(value) {
                        const self = this;
                        self.update(value);
                    },
                    'live_data'(value) {
                        const self = this;
                        const header = document.querySelector('header');
                        if (!header) return;

                        if ((value.categories?.length || value.brands?.length || value.products?.length) && self.input.length > 3) {
                            header.classList.add('live-search-active');
                        } else {
                            header.classList.remove('live-search-active');
                        }
                    }
                },
                mounted() {
                    const self = this;
                    outsideClick(search, null, function() {
                        self.live_data = {};
                        return;
                    });
                    self.getCategories();
                },
            }).mount(search);

            search.componentLiveSearch = 1;
        });
    },
    slider: function() {
        const sliders = document.querySelectorAll('[data-toggle="slider"]');
        Array.from(sliders).forEach((element, index) => {
            if (element.componentSlider == 1) return;

            createSlider(element, index);

            element.componentSlider = 1;
        });
    },
    lightGallery: {
        create: function(gallery, options = {}) {
            if (!gallery) return;

            const lgId = gallery.getAttribute('lg-uid');
            if (lgId && lgData && lgData[lgId]) {
                lgData[lgId].prevScrollTop = window.scrollY;
                lgData[lgId].destroy(true);
            }

            const selector = gallery.querySelectorAll('.gallery-selector');
            let defaultOpt = {
                actualSize: false,
                download: false,
                thumbnail: true,
                toggleThumb: false,
                thumbContHeight: 8,
                thumbWidth: 8,
                videoMaxWidth: '800px',
                zoom: false,
                selector: selector.length ? '.gallery-selector' : '',
            }

            options = { ...defaultOpt, ...options };
            lightGallery(gallery, options);

            let galleryItems = gallery.querySelectorAll('a');
            if (selector.length) galleryItems = gallery.querySelectorAll('.gallery-selector');
            Array.from(galleryItems).forEach(item => {
                item.addEventListener('click', e => {
                    e.preventDefault();
                });
            });
        },
        init: function() {
            const lightGalleries = document.querySelectorAll('[data-toggle="light-gallery"], [data-toggle="product-gallery"]');
            Array.from(lightGalleries).forEach(gallery => {
                if (gallery.componentlightGallery == 1) return;

                setTimeout(() => {
                    components.lightGallery.create(gallery);
                }, 100);

                gallery.componentlightGallery = 1;
            });
        }
    },
    dropdown: function() {
        let button = null, body = null;

        const hide = function() {    
            if (button == null || body == null) return;

            if (button && typeof button.dataset.callback === 'string' && typeof window[button.dataset.callback] === 'function') {
                try {
                    window[button.dataset.callback](button, body);
                } catch (error) {}
            }

            button.classList.remove('active');
            body.classList.remove('active');
            document.removeEventListener('click', toggle);
        }

        const toggle = function(e) {
            const event = e.target;

            if (body == null) return;

            if (['A', 'BUTTON'].includes(event.nodeName)) {
                hide();
            } else if (body.contains(event)) {
                return;
            }

            hide();
            return;
        }

        const dropdowns = document.querySelectorAll('[data-toggle="dropdown"]');
        Array.from(dropdowns).forEach((dropdown, index) => {
            if (dropdown.componentDropdown == 1) return;

            const event = dropdown.dataset.event;
            if (event == 'hover' && !isMobile()) return;

            dropdown.addEventListener('click', e => {
                if (e.target.href || e.target.closest('a') && event != 'hover') e.preventDefault();
                if (button != dropdown && document.querySelector('[data-toggle="dropdown"].active')) hide();

                button = dropdown;

                body = document.querySelector(dropdown.dataset.dropdown) || document.querySelector(`#${dropdown.dataset.dropdown}`) || document.querySelector(`.${dropdown.dataset.dropdown}`);
                if (!body) return;

                if (button.classList.contains('active')) {
                    hide();
                    return;
                }

                button.classList.add('active');
                body.classList.add('active');

                setTimeout(() => {
                    document.addEventListener('click', toggle);
                    return;
                }, 100);
            });

            dropdown.componentDropdown = 1;
        });

    },
    language: function() {
        const languages = document.querySelectorAll('[data-toggle="language"]');
        Array.from(languages).forEach((language) => {
            if (language.componentLanguage == 1) return;

            let event = 'click';
            if (language.nodeName == 'SELECT') event = 'change';

            language.addEventListener(event, e => {
                if (e.target.href || e.target.closest('a')) e.target.preventDefault();
                let value = language.dataset.language;
                if (language.nodeName == 'SELECT') value = language.value;
                if (!value || value == LANGUAGE) return;

                const callback = language.dataset.callback || '';

                setLanguage(value, callback);
                return;
            });

            language.componentLanguage = 1;
        });

        if (typeof CSRF_COOKIE != 'undefined' && CSRF_COOKIE) {
            const languageCache = document.querySelectorAll('[data-cache="language"]');
            Array.from(languageCache).forEach(item => {
                item.innerText = LANGUAGE;
            });
        }
    },
    currency: function() {
        const currencies = document.querySelectorAll('[data-toggle="currency"]');
        Array.from(currencies).forEach((currency) => {
            if (currency.componentCurrency == 1) return;

            let event = 'click';
            if (currency.nodeName == 'SELECT') event = 'change';

            currency.addEventListener(event, e => {
                if (e.target.href || e.target.closest('a')) e.target.preventDefault();

                let value = currency.dataset.currency;
                if (currency.nodeName == 'SELECT') value = currency.value;
                if (!value || value == currency) return;

                const callback = currency.dataset.callback || '';

                setCurrency(value, callback);
                return;
            });

            currency.componentCurrency = 1;
        });

        if (typeof CSRF_COOKIE != 'undefined' && CSRF_COOKIE) {
            const currencyCache = document.querySelectorAll('[data-cache="currency"]');
            Array.from(currencyCache).forEach(item => {
                item.innerText = CURRENCY;
            });
        }
    },
    popup: function() {
        const popups = document.querySelectorAll('[data-toggle="popup"]');
        Array.from(popups).forEach((popup, index) => {
            if (popup.componentPopup == 1) return;

            popup.addEventListener('click', async e => {
                e.preventDefault();

                popup.classList.add('disabled');
                const isMemberRequired = popup.dataset.memberRequired;
                if (isMemberRequired == 1 && MEMBER_INFO.ID <= 0) {
                    await loginPopup();
                    popup.classList.remove('disabled');
                    return;
                }

                const options = {
                    id: popup.dataset.id,
                    class: popup.dataset.class,
                    width: popup.dataset.width,
                    title: popup.dataset.title,
                    html: popup.dataset.html,
                    timeout: popup.dataset.timeout,
                    disabledClose: popup.dataset.disabledClose,
                    url: popup.dataset.url,
                    property: popup.dataset.property,
                }

                let opt = {};
                for (let key in options) {
                    if (options[key] != undefined && options[key] != '') opt[key] = options[key];
                }

                if (opt.url) {
                    try {
                        await request('GET', opt.url).then(response => {
                            opt.title = opt.title && response[opt.title] ? response[opt.title] : opt.title;
                            opt.html  = opt.property ? getNestedValue(response, opt.property) : response;
                        });
                    } catch (error) {
                        console.warn(`popup ${opt.url} error => ${error}`);
                    }
                } else if (opt.html) {
                    try {
                        const htmlElement = popup.querySelector(opt.html) ?? document.querySelector(opt.html);
                        if (htmlElement) {
                            opt.html = htmlElement.value ?? htmlElement.innerHTML ?? '';
                        }
                    } catch (error) {
                        console.warn(`popup error => ${error}`);
                    }
                }

                await modal(opt);
                popup.classList.remove('disabled');
                return;
            });

            popup.componentPopup = 1;
        });
    },
    tabs: function() {
        const tabs = document.querySelectorAll('[data-toggle="tab"]');
        Array.from(tabs).forEach((tab, index) => {
            const buttons = tab.querySelectorAll('[data-tab-target]');
            Array.from(buttons).forEach((btn, index) => {
                if (btn.componentTabs == 1) return;

                btn.addEventListener('click', async e => {
                    const url = btn.dataset.url;
                    const property = btn.dataset.property;
                    const callback = btn.dataset.callback;
                    const group = btn.dataset.tabGroup;

                    let result = null;
                    if (url && !btn.classList.contains('loaded')) {
                        try {
                            await request('GET', url).then(response => {
                                result = property ? getNestedValue(response, property) : response;
                                return;
                            });
                        } catch (error) {
                            console.warn(`tabs loaded error => ${error}`);
                        }
                    }

                    Array.from(buttons).forEach(item => {
                        const id = item.dataset.tabTarget;
                        if (!id) return;

                        const target = tab.querySelector(id);
                        if (!target) {
                            console.warn('tabs warn: target undefined');
                            return;
                        };

                        const contentId = item.dataset.tabContent;
                        const content = tab.querySelector(contentId);

                        if (group && item.dataset.tabGroup != group) return;

                        if (item == btn) {
                            if (result != null) {
                                if (content) {
                                    content.innerHTML = result;
                                    evalScripts(content.innerHTML);
                                } else {
                                    target.innerHTML = result;
                                    evalScripts(target.innerHTML);
                                }
                                components.init();
                                btn.classList.add('loaded');

                                if(typeof window[callback] == 'function'){
                                    try {
                                        window[callback](btn, target, tab);
                                    } catch (error) {}
                                }
                            }
                            item.classList.add('active');
                            target.classList.add('active');
                            target.classList.remove('hidden');
                            setTimeout(() => {
                                target.classList.add('tab-loaded');
                            }, 200);
                        } else {
                            item.classList.remove('active');
                            target.classList.remove('active');
                            target.classList.add('hidden');
                            target.classList.remove('tab-loaded');
                        }
                    });

                });
                if (btn.classList.contains('active')) btn.classList.add('tab-loaded');
                if (btn.classList.contains('active') && btn.dataset.url) btn.click();

                btn.componentTabs = 1;
            });
        });
    },
    accordion: function () {
        const accordions = document.querySelectorAll('[data-toggle="accordion"]');
        Array.from(accordions).forEach((accordion, index) => {
            const type = accordion.dataset.type;
            const buttons = accordion.querySelectorAll('[data-accordion-target]');

            if (type == 'dropdown') {
                accordion.activeDropdown = null;
                accordion.activeDropdownTarget = null;

                document.addEventListener('click', e => {
                    if (accordion.activeDropdown && accordion.activeDropdownTarget) {
                        if (!accordion.activeDropdown.contains(e.target) && !accordion.activeDropdownTarget.contains(e.target)) {
                            accordion.activeDropdown.classList.remove('active');
                            accordion.activeDropdownTarget.classList.remove('active');
                            accordion.activeDropdownTarget.classList.add('hidden');
                            accordion.activeDropdown = null;
                            accordion.activeDropdownTarget = null;
                        }
                    }
                    return;
                });
            }

            Array.from(buttons).forEach((btn, index) => {
                if (btn.componentAccordion == 1) return;

                if (btn.dataset.accordionMobile && isMobile()) {
                    btn.classList.remove('active');
                    const id = btn.dataset.accordionTarget;
                    const target = accordion.querySelector(id);
                    if (!target) return;
                    target.classList.remove('active');
                    target.classList.add('hidden');
                }

                btn.addEventListener('click', async e => {
                    e.preventDefault();

                    if (btn.dataset.accordionMobile && !btn.dataset.accordionDesktop && !isMobile()) return;

                    const url = btn.dataset.url;
                    const property = btn.dataset.property;
                    const callback = btn.dataset.callback;

                    let result = null;
                    if (url && !btn.classList.contains('loaded')) {
                        try {
                            await request('GET', url).then(response => {
                                result = property ? getNestedValue(response, property) : response;
                                return;
                            });
                        } catch (error) {
                            console.warn(`accordion loaded error => ${error}`);
                        }
                    }

                    Array.from(buttons).forEach(item => {
                        const id = item.dataset.accordionTarget;
                        if (!id) return;

                        const target = accordion.querySelector(id);
                        if (!target) return;

                        const contentId = item.dataset.accordionContent;
                        const content = accordion.querySelector(contentId);

                        if (item == btn) {
                            if (item.classList.contains('active')) {
                                item.classList.remove('active');
                                target.classList.remove('active');
                                target.classList.add('hidden');
                            } else {
                                if (result != null) {
                                    if (content) {
                                        content.innerHTML = result;
                                        evalScripts(content.innerHTML);
                                    } else {
                                        target.innerHTML = result;
                                        evalScripts(target.innerHTML);
                                    }
                                    components.init();
                                    btn.classList.add('loaded');

                                    if(typeof window[callback] == 'function'){
                                        try {
                                            window[callback](btn, target, accordion);
                                        } catch (error) {}
                                    }
                                }

                                item.classList.add('active');
                                target.classList.add('active');
                                target.classList.remove('hidden');
                            }

                            if (type == 'dropdown') {
                                accordion.activeDropdown = btn;
                                accordion.activeDropdownTarget = target;
                            }
                        } else if (type == 'toggle' || type == 'dropdown') {
                            item.classList.remove('active');
                            target.classList.remove('active');
                            target.classList.add('hidden');
                        }
                    });

                });
                if (btn.classList.contains('active') && btn.dataset.url) btn.click();

                btn.componentAccordion = 1;
            });

        });
    },
    drawer: function() {
        const drawers = document.querySelectorAll('[data-toggle="drawer"]');
        Array.from(drawers).forEach(btn => {
            if (btn.componentDrawer == 1) return;

            const selector = btn.dataset.drawerTarget;
            if (!selector) return;

            const drawer = document.querySelector(selector);
            if (!drawer) return;

            const drawerCloseBtns = drawer.querySelectorAll('[data-drawer-close]');
            if (drawerCloseBtns.length > 0) {
                Array.from(drawerCloseBtns).forEach(item => {
                    const closeSelector = item.dataset.drawerTarget;
                    item.addEventListener('click', e => {

                        e.preventDefault();
                        if (closeSelector) {
                            const drawer = document.querySelector(closeSelector);
                            if (!drawer) return;

                            if (!drawer.closest('.drawer')) document.body.classList.remove('drawer-active');
                            drawer.classList.remove('active');
                        } else {
                            document.body.classList.remove('drawer-active');
                            drawer.classList.remove('active');
                        }
                    });
                });
            }

            const url = btn.dataset.url;
            const property = btn.dataset.property;
            const callback = btn.dataset.callback;

            btn.addEventListener('click', async e => {
                e.preventDefault();

                const isMemberRequired = btn.dataset.memberRequired;
                if (isMemberRequired == 1 && MEMBER_INFO.ID <= 0) {
                    await loginPopup();
                    return;
                }

                if (url && !btn.classList.contains('loaded')) {
                    try {
                        await request('GET', url).then(response => {
                            const result = property ? getNestedValue(response, property) : response;
                            drawer.querySelector('.drawer-container').innerHTML = result;
                            evalScripts(drawer.innerHTML);
                            components.init();
                            btn.classList.add('loaded');
                        });
                    } catch (error) {
                        console.warn(`drawer loaded error => ${error}`);
                    }
                }

                document.body.classList.add('drawer-active');
                drawer.classList.add('active');

                if(typeof window[callback] == 'function'){
                    try {
                        window[callback](btn, drawer);
                    } catch (error) {
                        console.warn(`drawer callback error => ${error}`);
                    }
                }

                if (btn.drawer != 1) {
                    drawer.addEventListener('click', e => {
                        btn.drawer = 1;
                        if (e.target == drawer && drawer.contains(e.target)) {
                            document.body.classList.remove('drawer-active');
                            const drawers = document.querySelectorAll('.drawer.active');
                            drawers.forEach(drawer => {
                                drawer.classList.remove('active');
                            });
                        }
                        return;
                    });
                }
            });

            btn.componentDrawer = 1;
        });
    },
    tooltip: function() {
        const tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
        let activeTooltip = null;

        Array.from(tooltips).forEach(tooltip => {
            if (tooltip.componentTooltip == 1) return;

            const tooltipTitle = tooltip.dataset.title;
            if (!tooltipTitle) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'tooltip-wrapper fixed z-[999999997] max-w-72';

            const element = document.createElement('div');
            element.className = 'tooltip block text-xs bg-black/90 text-white rounded py-1 px-3';
            element.innerHTML = tooltipTitle;

            const tooltipPos = tooltip.dataset.position;

            const arrow = document.createElement('div');
            const arrowBaseClass = 'absolute size-2 rotate-45';
            arrow.className = `${arrowBaseClass} start-1/2 -translate-x-1/2 rtl:translate-x-1/2`;
            element.append(arrow);
            wrapper.appendChild(element);

            const createTooltip = function(e) {
                if (!isMobile()) e.stopPropagation();

                if (activeTooltip && activeTooltip !== wrapper) {
                    removeTooltip(activeTooltip);
                }

                if (document.body.contains(wrapper)) return;

                document.body.appendChild(wrapper);
                activeTooltip = wrapper;

                const rect = tooltip.getBoundingClientRect();
                let x_pos = rect.left;
                let y_pos = rect.top;

                if (tooltipPos == 'bottom') {
                    arrow.className = `${arrowBaseClass} start-1/2 top-0 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2`;
                    x_pos = x_pos + (tooltip.offsetWidth / 2) - (element.offsetWidth / 2);
                    y_pos = rect.bottom + 8;
                } else if (tooltipPos == 'right') {
                    arrow.className = `${arrowBaseClass} start-0 top-1/2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2`;
                    x_pos = rect.right + 8;
                    y_pos = rect.top + (rect.height / 2) - (element.offsetHeight / 2);
                } else if (tooltipPos == 'left') {
                    arrow.className = `${arrowBaseClass} end-0 top-1/2 translate-x-1/2 rtl:-translate-x-1/2 -translate-y-1/2`;
                    x_pos = rect.left - element.offsetWidth - 8;
                    y_pos = rect.top + (rect.height / 2) - (element.offsetHeight / 2);
                } else { /* top (default) */
                    x_pos = x_pos + (tooltip.offsetWidth / 2) - (element.offsetWidth / 2);
                    y_pos = rect.top - element.offsetHeight - 8;
                }

                const viewportWidth = window.innerWidth;
                const tooltipWidth = element.offsetWidth;
                const padding = 8;

                if (x_pos + tooltipWidth > viewportWidth - padding) {
                    x_pos = viewportWidth - tooltipWidth - padding;
                }
                if (x_pos < padding) {
                    x_pos = padding;
                }

                wrapper.style.left = `${x_pos}px`;
                wrapper.style.top = `${y_pos}px`;

                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
            };

            const removeTooltip = function(tooltipElement) {
                if (tooltipElement) {
                    tooltipElement.remove();
                }
            };

            element.style.transition = 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out';
            element.style.opacity = '0';
            element.style.transform = 'scale(0.9)';

            if (isMobile()) {
                tooltip.addEventListener('click', createTooltip);
                outsideClick(tooltip, null, () => {
                    setTimeout(() => removeTooltip(wrapper), 100);
                });
            } else {
                tooltip.addEventListener('mouseenter', createTooltip);
                tooltip.addEventListener('mouseleave', () => {
                    setTimeout(() => removeTooltip(wrapper), 100);
                });
            }

            document.addEventListener('scroll', () => {
                if (activeTooltip === wrapper) {
                    removeTooltip(wrapper);
                }
                return;
            }, { passive: true });

            tooltip.componentTooltip = 1;
        });
    },
    copyText: function() {
        const copyTexts = document.querySelectorAll('[data-toggle="copy"]');
        Array.from(copyTexts).forEach(copy => {
            if (copy.componentCopyText == 1) return;

            copy.addEventListener('click', e => {
                const text = copy.dataset.copyText;
                if (!text) return;

                copyText(text, copy.dataset.message || null);
                return;
            });

            copy.componentCopyText = 1;
        });
    },
    share:function(){
        const shareButtons = document.querySelectorAll('[data-toggle="share"]');
        Array.from(shareButtons).forEach(shareBtn => {
            if (shareBtn.componentShare == 1 ) return;
            shareBtn.addEventListener('click', function (e) {
                const title = encodeURIComponent(this.dataset.title);
                const image = encodeURIComponent(this.dataset.image);
                const link = encodeURIComponent(this.dataset.url);

                console.log(title, image, link);
                if (isMobile() && navigator.share) {
                    navigator.share({
                        title: this.dataset.title || 'Share',
                        text: this.dataset.text || 'share',
                        url: this.dataset.url || window.location.href,
                    })
                } else if (title && image && link) {
                    loadSnippet({
                        snippet: '_share-popup',
                        params: {
                            include: 'common',
                            link: link,
                            image: image,
                            title: title,
                        },
                        success: function (loadRes) {
                            modal({
                                id: 'modal-share',
                                html: loadRes,
                                width: 'auto',
                            });
                            return;
                        }
                    });
                }
            });

            shareBtn.componentShare = 1;
        });
    },
    mask: function() {
        const masks = document.querySelectorAll('[data-toggle="mask"], input[type="password"], input[type="email"], input[name="name"], input[name="surname"], input[name="fullname"], input[name="firstname"], input[name="lastname"], [name="identity_number"]');

        Array.from(masks).forEach(element => {
            if (element.componentMask == 1) return;

            if (element.name == 'identity_number') {
                mask(element, 'number', null, 11);
            } else {
                mask(element);
            }

            element.componentMask = 1;
        });
    },
    sticky: function() {
        const stickies = document.querySelectorAll('[data-toggle="sticky"]');
        Array.from(stickies).forEach(sticky => {
            if (sticky.componentSticky == 1) return;

            const isMobileDevice = isMobile();
            const mobileOnly = sticky.dataset.mobile === 'true';
            const desktopOnly = sticky.dataset.desktop === 'true';
            const device = sticky.dataset.device;
            if ((mobileOnly || device === 'mobile') && !isMobileDevice) return;
            if ((desktopOnly || device === 'desktop') && isMobileDevice) return;

            const positionClass = sticky.dataset.class || sticky.dataset.stickyClass || 'top-0 fixed z-50';
            const classes = `${positionClass} sticky-active`.split(' ');
            const downClasses = 'sticky-down';
            const upClasses = 'sticky-up';
            const shipHeight = sticky.hasAttribute('skip-height');

            let stickyH = 0;
            let gap = 0;
            let direction = 0;
            let ticking = false;

            const wrapper = document.createElement('div');
            wrapper.className = 'w-full sticky-wrapper';
            sticky.parentNode.replaceChild(wrapper, sticky);
            wrapper.appendChild(sticky);

            const measure = () => {
                stickyH = sticky.offsetHeight;
                const triggerSelector = sticky.dataset.stickyAfter;
                const triggerEl = triggerSelector ? document.querySelector(triggerSelector) : null;
                if (triggerEl) {
                    const rect = triggerEl.getBoundingClientRect();
                    gap = rect.top + window.scrollY + rect.height;
                } else {
                    gap = wrapper.getBoundingClientRect().top + window.scrollY;
                }
            };

            measure();

            if (document.fonts) {
                document.fonts.ready.then(measure);
            }

            window.addEventListener('resize', measure);

            const handleScroll = () => {
                const scrollY = window.scrollY;

                if (sticky.closest('header')) {
                    HEADER_STICKY_HEIGHT = stickyH;
                }

                if (scrollY > gap) {
                    if (!shipHeight) wrapper.style.height = `${stickyH}px`;
                    sticky.classList.add(...classes);
                } else {
                    if (!shipHeight) wrapper.style.height = null;
                    sticky.classList.remove(...classes, downClasses, upClasses);
                }

                if (scrollY > gap + stickyH) {
                    if (direction < scrollY) {
                        sticky.classList.add(downClasses);
                        sticky.classList.remove(upClasses);
                    } else if (direction > scrollY) {
                        sticky.classList.remove(downClasses);
                        sticky.classList.add(upClasses);
                    }
                    direction = scrollY;
                }
            };

            handleScroll();

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                        return;
                    });
                    ticking = true;
                }
            });

            sticky.componentSticky = 1;
        });
    },
    flagMask: function() {
        const flags = document.querySelectorAll('[data-toggle="flag"]');
        Array.from(flags).forEach(flag => {
            if (flag.componentFlagMask == 1 || flag.closest('[v-cloak]')) return;

            try {
                FLAG_MASK(flag);
            } catch (error) { console.log(error) }

            flag.componentFlagMask = 1;
        });
    },
    taxLoader: function() {
        if (LANGUAGE != 'tr') return;
        const taxes = document.querySelectorAll('[data-toggle="tax-list"]');
        Array.from(taxes).forEach(tax => {
            if (tax.componentTaxLoader == 1) return;

            try {
                const opt = {
                    selector: tax,
                }
                taxLoader(opt);
            } catch (error) { console.log(error) }

            tax.componentTaxLoader = 1;
        });
    },
    passwordDifficulty: function() {
        const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
        const passwords = document.querySelectorAll('[data-toggle="password-difficulty"]');
        Array.from(passwords).forEach(pass => {
            if (pass.componentPasswordDifficulty == 1) return;

            try {
                const selector = pass.dataset.selector;
                const selectorElement = document.querySelector(selector);
                if (!selectorElement) return;

                const title = selectorElement.querySelector('[data-toggle="password-difficulty-title"]');
                const progressbar = selectorElement.querySelector('[data-toggle="password-difficulty-progressbar"]');
                if (!title || !progressbar) return;

                const setDifficulty = (value) => {
                    let difficulty = 0;
                    if (value.length) {
                        if (value.length >= 8) difficulty++;
                        if (/[a-z]/.test(value)) difficulty++;
                        if (/[A-Z]/.test(value)) difficulty++;
                        if (/\d/.test(value)) difficulty++;
                        if (/[.#?!@$%^&*-]/.test(value)) difficulty++;
                    }

                    if (difficulty > 0) {
                        selectorElement.style.display = '';
                    } else {
                        selectorElement.style.display = 'none';
                    }

                    if (difficulty < 5) {
                        title.innerHTML = COMMON_LANG.weak_password;
                        title.classList.remove(`text-green-500`);
                        title.classList.add(`text-red-500`);
                    } else {
                        title.innerHTML = COMMON_LANG.strong_password;
                        title.classList.remove(`text-red-500`);
                        title.classList.add(`text-green-500`);
                    }

                    colors.forEach(color => {
                        progressbar.classList.remove(`bg-${color}-500`);
                    });

                    const afterColor = colors[difficulty - 1];
                    if (afterColor) {
                        progressbar.classList.add(`bg-${afterColor}-500`);
                    }

                    progressbar.style.width = `${difficulty * 20}%`;
                    pass.dataset.difficulty = difficulty;
                };

                pass.addEventListener('input', e => {
                    setDifficulty(pass.value);
                    return;
                });

                setDifficulty(pass.value);
            } catch (error) { console.log(error) }

            pass.componentPasswordDifficulty = 1;
        });
    },
    passwordToggle: function() {
        const passwords = document.querySelectorAll('[data-toggle="password-toggle"]');
        Array.from(passwords).forEach(pass => {
            if (pass.componentPasswordToggle == 1) return;

            try {
                const selector = pass.dataset.selector;
                if (!document.querySelector(selector)) return;

                pass.addEventListener('click', e => {
                    e.preventDefault();
                    passwordToggle(pass, document.querySelector(selector));
                    return;
                });
            } catch (error) { console.log(error) }

            pass.componentPasswordToggle = 1;
        });
    },
    captchaToggle: function() {
        const captchas = document.querySelectorAll('[data-toggle="captcha-toggle"]');
        Array.from(captchas).forEach(captcha => {
            if (captcha.componentCaptchaToggle == 1) return;

            try {
                const selector = captcha.dataset.selector;
                const element = document.querySelector(selector);
                if (!element) return;

                captcha.addEventListener('click', e => {
                    e.preventDefault();
                    element.setAttribute('src', `/SecCode.php?${new Date().getTime()}`);
                    return;
                });
            } catch (error) { console.log(error) }

            captcha.componentCaptchaToggle = 1;
        });
    },
    countDown: function() {
        const countDowns = document.querySelectorAll('[data-toggle="count-down"]');
        Array.from(countDowns).forEach(count => {
            if (count.componentCountDown == 1) return;

            let timer = count.dataset.timer;
            let targetDate;

            if (timer.includes('.')) {
                /* dd.mm.yyyy format */
                const [day, month, year] = timer.split('.');
                targetDate = new Date(year, month-1, day, 0, 0, 0);
            } else if (timer.includes(',')) {
                /* yyyy,mm,dd,hh,mm,ss format */
                const [year, month, day, hour, minute, second] = timer.split(',');
                targetDate = new Date(year, month-1, day, hour || 0, minute || 0, second || 0);
            } else {
                console.warn('Invalid date format');
                return;
            }

            const x = setInterval(function() {
                const now = new Date();
                const amount = targetDate - now;
                if (amount < 0) {
                    clearInterval(x);
                    return;
                }
                const days = Math.floor(amount / (1000 * 60 * 60 * 24)),
                      hours = Math.floor((amount % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                      minutes = Math.floor((amount % (1000 * 60 * 60)) / (1000 * 60)),
                      seconds = Math.floor((amount % (1000 * 60)) / 1000);

                const formattedHours = hours < 10 ? '0' + hours : hours,
                      formattedMinutes = minutes < 10 ? '0' + minutes : minutes,
                      formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

                if (count.querySelector('.day')) count.querySelector('.day').innerHTML = days;
                if (count.querySelector('.hour')) count.querySelector('.hour').innerHTML = formattedHours;
                if (count.querySelector('.minute')) count.querySelector('.minute').innerHTML = formattedMinutes;
                if (count.querySelector('.second')) count.querySelector('.second').innerHTML = formattedSeconds;
                return;
            }, 1000);

            count.componentCountDown = 1;
        });
    },
    formSubmit: function() {
        const formSubmits = document.querySelectorAll('[data-toggle="form-submit"]');
        Array.from(formSubmits).forEach(form => {
            if (form.tagName.toLowerCase() !== 'form') return;

            if (form.componentFormSubmit == 1) return;

            form.addEventListener('submit', async e => {
                e.stopPropagation();
                e.preventDefault();

                popoverAlertHide(form);
                if (!checkValidity(form)) return;

                const formData = new FormData(form);

                let endpoint = '';
                if (form.dataset.endpoint) {
                    let splitEndpoint = form.dataset.endpoint.split(',');
                    if (splitEndpoint.length > 1) {
                        endpoint = getEndpoint(splitEndpoint[0].trim(), splitEndpoint[1].trim());
                    } else {
                        endpoint = getEndpoint(splitEndpoint[0].trim());
                    }
                } else if (form.action) {
                    endpoint = form.action;
                }
                if (!endpoint) return;

                const method = (form.method).toUpperCase() || 'POST';

                const recaptchaResponse = formData.get('g-recaptcha-response');
                if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');

                const iso = formData.get('iso_code');
                if (iso) {
                    const phone = form.querySelector('[type="tel"]');
                    if (phone?.dataset.key) formData.set('iso_code', phone.dataset.key.toLowerCase());
                }

                const statusText = formData.get('status_text');
                if (statusText) formData.delete('status_text');

                const submitButton = e.submitter;
                if (submitButton) submitButton.setAttribute('disabled', 'true');

                try {
                    await request(method, endpoint, formData).then(async response => {
                        if (typeof window[form.dataset.callback] === 'function') {
                            try {
                                window[form.dataset.callback]?.(response);
                            } catch (error) {}

                            await getCaptcha(form, response);
                            return;
                        }

                        if (response.status || response.success) {
                            modalClose();
                            modal({
                                html: response.statusText || response.message || statusText || COMMON_LANG?.send_success,
                                width: '480px',
                                alert: true,
                                class: 'success',
                            });
                            form.reset();
                        } else {
                            await getCaptcha(form, response);

                            const field = response.field || response.key || '';
                            let selector = form.querySelector(`[name="${field == 'g-recaptcha-response' ? 'security_code' : field}"]`);
                            if (selector) {
                                popoverAlert({
                                    selector: selector,
                                    message: response.statusText || response.message || COMMON_LANG?.form_required,
                                });
                            } else {
                                notify({
                                    text: response.statusText || response.message || COMMON_LANG?.send_error,
                                    class: 'danger',
                                });
                            }
                        }
                    });
                } catch (error) {
                    console.warn(`formSubmit error => ${error}`);
                } finally {
                    await captchaReset(form);
                    if (submitButton) submitButton.removeAttribute('disabled');
                }
            });

            form.componentFormSubmit = 1;
        });
    },
    getRelated() {
        if (isMobile()) return;

        const relateds = document.querySelectorAll('[data-toggle="product-card-related"]');
        Array.from(relateds).forEach(related => {
            if (related.componentGetRelated == 1) return;

            const productItem = related.closest('[data-toggle="product"]');
            if (!productItem) {
                console.warn('getRelated warn: productItem undefined');
                return;
            };

            const productId = productItem.dataset.id;
            if (!productId) {
                console.warn('getRelated warn: productId undefined');
                return;
            };

            const RELATED_PRODUCT_COUNT = related.dataset?.count || 4;

            const relatedId = related.dataset.relatedId || 1;
            let hoverTimeout;

            related.addEventListener('mouseenter', () => {
                if (related.classList.contains('related-loaded')) return;

                hoverTimeout = setTimeout(async () => {
                    productItem.classList.add('opacity-50');
                    related.classList.add('pointer-events-none');

                     related['relatedApp'] = Vue.createApp({
                        data() {
                            return {
                                PRODUCTS: [],
                                PRODUCT_COUNT: RELATED_PRODUCT_COUNT,
                                t: TRANSLATES['product-list']
                            }
                        },
                        methods: {
                            async getProductRelated() {
                                const self = this;
                                try {
                                    await request('GET', getEndpoint('PRODUCT_RELATED', `${productId}/${relatedId}`)).then(response => {
                                        if (!response.PRODUCTS?.length) {
                                            console.warn('getRelated warn: PRODUCT_RELATED PRODUCTS length');
                                            return;
                                        }

                                        self.PRODUCTS = response.PRODUCTS;
                                    });
                                } catch (error) {
                                    console.warn(`PRODUCT_RELATED error => ${error}`);
                                } finally {
                                    related.classList.add('related-loaded');
                                    productItem.classList.remove('opacity-50');
                                    related.classList.remove('pointer-events-none');
                                }
                            }
                        },
                        async mounted() {
                            const self = this;

                            await self.getProductRelated();
                            related.classList.add('related-first-loaded');

                            setTimeout(() => {
                                related.classList.remove('related-first-loaded');
                            }, 1500);
                        }
                    }).mount(related);
                }, 300);
            });

            related.addEventListener('mouseleave', () => {
                if (related.classList.contains('related-loaded')) return;
                clearTimeout(hoverTimeout);
            });

            related.componentGetRelated = 1;
        });
        return;
    },
    catalog: {
        get: function(catalog, productItem, productId, catalogCode, productData = null) {
            let interval;
            let speed = 250;

            function startAutoSlide(swiper, direction) {
              interval = setInterval(() => {
                if (direction === 'next') {
                  swiper.slideNext();
                } else if (direction === 'prev') {
                  swiper.slidePrev();
                }
              }, speed);
            }

            function stopAutoSlide() {
              clearInterval(interval);
            }

            catalog['catalogApp'] = Vue.createApp({
                data() {
                    return {
                        ATTRIBUTES: [],
                        t: TRANSLATES['product-list']
                    }
                },
                methods: {
                    async getAttribute(product_id = null, product = true) {
                        if (product_id == null) return;
                        const self = this;

                        if (catalog[`PRODUCT_ATTRIBUTES_${product_id}`]) {
                            self.ATTRIBUTES = fastClone(catalog[`PRODUCT_ATTRIBUTES_${product_id}`]);
                            Array.from(self.ATTRIBUTES).forEach(item => {
                                const selectedOption = item.OPTIONS.find(opt => opt.SELECTED === true);
                                if (selectedOption) {
                                    item['SELECT_ID'] = selectedOption.ID;
                                    item['SELECT_NAME'] = selectedOption.NAME;
                                    if (self.ATTRIBUTES.CATALOG_VIEW == 'select' || self.ATTRIBUTES.CATALOG_VIEW == '') item['SELECT_SEARCH'] = item['SELECT_NAME'];
                                }
                            });
                        } else {
                            const formData = new FormData();
                            formData.append('product_id', product_id);
                            formData.append('with_image', '1');

                            try {
                                await request('POST', getEndpoint('CATALOG_ATTRIBUTES'), formData).then(response => {
                                    if (!response?.length) {
                                        console.warn('productCardCatalog warn: CATALOG_ATTRIBUTES length');
                                        return;
                                    };
                                    self.ATTRIBUTES = response;

                                    Array.from(self.ATTRIBUTES).forEach(item => {
                                        item.OPTIONS = item.OPTIONS.filter(opt => opt.PRODUCT_ID != null);
                                        const selectedOption = item.OPTIONS.find(opt => opt.SELECTED === true);
                                        if (selectedOption) {
                                            item['SELECT_ID'] = selectedOption.ID;
                                            item['SELECT_NAME'] = selectedOption.NAME;
                                            if (item.CATALOG_VIEW == 'select' || item.CATALOG_VIEW == '') item['SELECT_SEARCH'] = item['SELECT_NAME'];
                                        }
                                    });
                                    catalog[`PRODUCT_ATTRIBUTES_${product_id}`] = fastClone(self.ATTRIBUTES);
                                });
                            } catch (error) {
                                console.warn(`CATALOG_ATTRIBUTES error => ${error}`);
                            }
                        }

                        if (product == null) {
                            catalog.ATTRIBUTES = fastClone(self.ATTRIBUTES);
                            self.getProductProperties();
                        }

                        setTimeout(() => {
                            self.slideAttribute();
                        }, 50);

                        productItem.classList.remove('catalog-opacity');
                        catalog.classList.remove('pointer-events-none');
                        catalog.classList.add('catalog-loaded');
                        return;
                    },
                    setAttribute(attribute = null, option = null) {
                        const self = this;

                        if (option.target?.value) option = Array.from(attribute.OPTIONS).find(x => x.ID == option.target.value);
                        if (attribute == null || option == null) return;
                        if (attribute['SELECT_ID'] == option.ID) return;

                        Array.from(attribute.OPTIONS).map(x => x.SELECTED = x.ID == option.ID ? true : false);
                        attribute['SELECT_ID'] = option.ID;
                        attribute['SELECT_NAME'] = option.NAME;
                        if (attribute.CATALOG_VIEW == 'select' || attribute.CATALOG_VIEW == '') {
                            attribute['SELECT_SEARCH'] = attribute['SELECT_NAME'];
                            attribute.IS_OPEN = false;
                            Array.from(attribute.OPTIONS).forEach(item => {
                                item['HIDDEN'] = false;
                            });
                        }

                        catalog.ATTRIBUTES = fastClone(self.ATTRIBUTES);

                        self.getProductProperties(option);
                        return;
                    },
                    async getProductProperties(option = null) {
                        const self = this;
                        let catalogProductId = '';

                        const formData = new FormData();
                        formData.append('catalog_code', catalogCode);
                        Array.from(self.ATTRIBUTES).forEach((item, index) => {
                            if (item.SELECT_ID) {
                                catalogProductId += `${item.GROUP_ID}_${item.SELECT_ID}`;
                                formData.append(`attribute[${index}][id]`, item.GROUP_ID);
                                formData.append(`attribute[${index}][option_id]`, item.SELECT_ID);
                            }
                        });

                        if (catalog[`PRODUCT_DATA_${catalogProductId}`]) {
                            const PRODUCT = catalog[`PRODUCT_DATA_${catalogProductId}`];
                            await self.setProductData(PRODUCT);
                            await self.getAttribute(PRODUCT.ID);
                            return;
                        }

                        try {
                            productItem.classList.add('catalog-opacity');
                            catalog.classList.add('pointer-events-none');

                            await request('POST', getEndpoint('CATALOG_GET_PRODUCT'), formData).then(async response => {
                                if (response?.length) {
                                    const PRODUCT = response[0];
                                    if (PRODUCT?.ID) {
                                        catalog[`PRODUCT_DATA_${catalogProductId}`] = PRODUCT;
                                        await self.setProductData(PRODUCT);
                                        await self.getAttribute(PRODUCT.ID);
                                    } else {
                                        await self.getAttribute(option.PRODUCT_ID, null);
                                    }
                                }
                            });
                        } catch (error) {
                            console.warn(`CATALOG_GET_PRODUCT error => ${error}`);
                        } finally {
                            productItem.classList.remove('catalog-opacity');
                            catalog.classList.remove('pointer-events-none');
                        }
                    },
                    async setProductData(P = null) {
                        if (P == null) return;
                        productItem.dataset.id = P.ID;

                        const productItemData = productItemScope(productItem, `
                            [data-toggle="product-title"], 
                            [data-toggle="product-url"], 
                            [data-toggle="price-sell"], 
                            [data-toggle="price-sell-vat"], 
                            [data-toggle="price-not-discounted"], 
                            [data-toggle="price-not-discounted-vat"], 
                            [data-toggle="discount-percent"], 
                            [data-toggle="price-numeric1"]`, true);

                        Array.from(productItemData).forEach(item => {
                            if (item.dataset.toggle == 'product-title') item.innerText = P.TITLE;
                            if (item.dataset.toggle == 'product-url') item.href = P.URL;

                            if (item.dataset.toggle == 'price-sell') item.innerText = format(P.PRICE_SELL);
                            if (item.dataset.toggle == 'price-sell-vat') item.innerText = vat(P.PRICE_SELL, P.VAT);
                            if (item.dataset.toggle == 'price-not-discounted') item.innerText = format(P.PRICE_NOT_DISCOUNTED);
                            if (item.dataset.toggle == 'price-not-discounted-vat') item.innerText = vat(P.PRICE_NOT_DISCOUNTED, P.VAT);
                            if (item.dataset.toggle == 'discount-percent') item.innerText = P.DISCOUNT_PERCENT;
                            if (item.dataset.toggle == 'price-numeric1' && P.NUMERIC1) item.innerText = vat(P.PRICE_SELL - (P.PRICE_SELL * P.NUMERIC1 / 100), P.VAT);
                        });

                        const discountItems = productItemScope(productItem, `
                            [data-toggle="discount-percent"], 
                            [data-toggle="price-not-discounted"], 
                            [data-toggle="price-not-discounted-vat"], 
                            [data-toggle="price-numeric1"]`, true);

                        Array.from(discountItems).forEach(item => {
                            if (P.IS_DISPLAY_DISCOUNTED_ACTIVE && P.DISCOUNT_PERCENT > 0) {
                                if (item.closest('[data-toggle="price-control"]')) item.closest('[data-toggle="price-control"]').classList.remove('!hidden', 'hidden');
                            } else {
                                if (item.closest('[data-toggle="price-control"]')) item.closest('[data-toggle="price-control"]').classList.add('!hidden', 'hidden');
                            }
                        });

                        const productItemImages = productItemScope(productItem, '[data-toggle="product-image"]', true);
                        if (productItemImages?.length) {
                            for (let i = 0; i < productItemImages.length; i++ ) {
                                productItemImages[i].src = P.IMAGE_LIST[i]?.MEDIUM || P.IMAGE_LIST[0]?.MEDIUM || '';
                            }
                        }
                        return;
                    },
                    async slideAttribute() {
                        const catalogSliders = catalog.querySelectorAll('.swiper');
                        Array.from(catalogSliders).forEach(item => {
                            if (item.slider == 1) {
                                item['swiperData'].update();
                                return;
                            }

                            const nextEl = item.querySelector('.swiper-button-next');
                            const prevEl = item.querySelector('.swiper-button-prev');

                            if (item.eventCleanup) {
                                item.eventCleanup();
                            }

                            item['swiperData'] = new Swiper(item, {
                                slidesPerView: 'auto',
                                spaceBetween: 4,
                                navigation: {
                                    nextEl: nextEl,
                                    prevEl: prevEl
                                },
                            });

                            const nextDownHandler = () => startAutoSlide(item['swiperData'], 'next');
                            const prevDownHandler = () => startAutoSlide(item['swiperData'], 'prev');
                            const stopHandler = stopAutoSlide;

                            nextEl.addEventListener('mousedown', nextDownHandler);
                            nextEl.addEventListener('mouseup', stopHandler);
                            nextEl.addEventListener('mouseleave', stopHandler);

                            prevEl.addEventListener('mousedown', prevDownHandler);
                            prevEl.addEventListener('mouseup', stopHandler);
                            prevEl.addEventListener('mouseleave', stopHandler);

                            item.eventCleanup = () => {
                                nextEl.removeEventListener('mousedown', nextDownHandler);
                                nextEl.removeEventListener('mouseup', stopHandler);
                                nextEl.removeEventListener('mouseleave', stopHandler);
                                prevEl.removeEventListener('mousedown', prevDownHandler);
                                prevEl.removeEventListener('mouseup', stopHandler);
                                prevEl.removeEventListener('mouseleave', stopHandler);
                            };

                            item.slider = 1;
                        });
                    },
                    parentClass(element) {
                        let currentElement = element;

                        while (currentElement && currentElement.dataset.toggle != 'product') {
                            currentElement.classList.add('catalog-parent-element');
                            currentElement = currentElement.parentElement;
                        }
                    }
                },
                async mounted() {
                    const self = this;
                    self.parentClass(catalog);

                    catalog.cleanupCatalog = () => {
                        const swipers = catalog.querySelectorAll('.swiper');
                        swipers.forEach(item => {
                            if (item.swiperData) {
                                item.swiperData.destroy(true, true);
                                item.swiperData = null;
                            }
                            if (item.eventCleanup) {
                                item.eventCleanup();
                                item.eventCleanup = null;
                            }
                            item.slider = 0;
                        });

                        if (catalog.catalogApp) {
                            catalog.catalogApp.unmount();
                            catalog.catalogApp = null;
                        }

                        delete catalog[`PRODUCT_ATTRIBUTES_${productId}`];
                        delete catalog.ATTRIBUTES;
                    };

                    if (productData) {
                        catalog[`PRODUCT_ATTRIBUTES_${productId}`] = productData.ATTRIBUTES;
                    }
                    await self.getAttribute(productId);
                    if (productData) return;

                    catalog.classList.add('catalog-first-loaded');

                    setTimeout(() => {
                        catalog.classList.remove('catalog-first-loaded');
                    }, 1500);
                },
                beforeUnmount() {
                    if (catalog.cleanupCatalog) {
                        catalog.cleanupCatalog();
                    }
                    return;
                }
            }).mount(catalog);
        },
        autoLoad: async function() {
            const catalogAutoLoads = document.querySelectorAll('[data-toggle="product-card-catalog"][data-auto-load="1"]:not(.catalog-loaded)');
            if (!catalogAutoLoads.length) return;

            const catalogAutoLoadIds = [];
            Array.from(catalogAutoLoads).forEach(catalog => {
                if (catalog.componentCatalog == 1) return;

                const productId = catalog.dataset.product;
                if (!productId) {
                    console.warn('productCardCatalog warn: productId undefined');
                    return;
                };

                catalogAutoLoadIds.push(productId);
                catalog.componentCatalog = 1;
            });

            if (!catalogAutoLoadIds.length) return;

            const formData = new FormData();
            formData.append('product_ids', catalogAutoLoadIds.join(','));
            formData.append('with_image', '1');

            loader(true);
            try {
                const response = await request('POST', getEndpoint('CATALOG_ATTRIBUTES_BY_PRODUCT_IDS'), formData);
                if (!response.length) return;

                Array.from(catalogAutoLoads).forEach(catalog => {
                    const productItem = catalog.closest('[data-toggle="product"]');
                    if (!productItem) {
                        console.warn('productCardCatalog warn: productItem undefined');
                        return;
                    };

                    const productId = catalog.dataset.product;
                    if (!productId) {
                        console.warn('productCardCatalog warn: productId undefined');
                        return;
                    };

                    const catalogCode = catalog.dataset.catalogCode;
                    if (!catalogCode) {
                        console.warn('productCardCatalog warn: catalogCode undefined');
                        return;
                    };

                    const isCatalogActive = catalog.querySelector('[data-toggle="is-catalog-active"]');
                    if (!isCatalogActive?.value) return;

                    const productData = response.find(item => item.PRODUCT_ID == productId);
                    if (!productData?.ATTRIBUTES?.length) return;

                    Array.from(productData.ATTRIBUTES).forEach(item => {
                        if (!item.OPTIONS?.length) return;
                        item.OPTIONS = item.OPTIONS.filter(opt => opt.PRODUCT_ID != null);
                    });

                    components.catalog.get(catalog, productItem, productId, catalogCode, productData);
                });
            } catch (error) {
                console.warn(`CATALOG_ATTRIBUTES_BY_PRODUCT_IDS error => ${error}`);
            } finally {
                loader(false);
            }
            return;
        },
        init: function() {
            components.catalog.autoLoad();

            if (isMobile()) return;

            const catalogs = document.querySelectorAll('[data-toggle="product-card-catalog"]:not([data-auto-load="1"])');
            Array.from(catalogs).forEach(catalog => {
                if (catalog.componentCatalog == 1) return;

                const productItem = catalog.closest('[data-toggle="product"]');
                if (!productItem) {
                    console.warn('productCardCatalog warn: productItem undefined');
                    return;
                };

                const productId = catalog.dataset.product;
                if (!productId) {
                    console.warn('productCardCatalog warn: productId undefined');
                    return;
                };

                const catalogCode = catalog.dataset.catalogCode;
                if (!catalogCode) {
                    console.warn('productCardCatalog warn: catalogCode undefined');
                    return;
                };

                const isCatalogActive = catalog.querySelector('[data-toggle="is-catalog-active"]');
                if (!isCatalogActive?.value) return;

                let hoverTimeout;
                catalog.addEventListener('mouseenter', () => {
                    if (catalog.classList.contains('catalog-loaded') || catalog.catalogApp) return;

                    hoverTimeout = setTimeout(async () => {
                        productItem.classList.add('catalog-opacity');
                        catalog.classList.add('pointer-events-none');

                        components.catalog.get(catalog, productItem, productId, catalogCode);
                    }, 300);
                });

                catalog.addEventListener('mouseleave', () => {
                    if (catalog.classList.contains('catalog-loaded')) return;
                    clearTimeout(hoverTimeout);
                });

                catalog.componentCatalog = 1;
            });
        }
    },
    variant: {
        set: {
            price: function(variantItem, productItem, variantData, variant) {
                if (!variantData) return;

                if (PAGE_TYPE === 'product' && productItem.id == 'product-detail') {
                    PRODUCT_DATA[0].subproduct_code = variantData.WS_CODE;
                    PRODUCT_DATA[0].subproduct_id = variantData.ID;
                }

                const price = Number.parseFloat(variantData.PRICE);
                const priceNotDiscounted = Number.parseFloat(variantData.PRICE_NOT_DISCOUNTED);
                let discountPercent = (((price - priceNotDiscounted) / priceNotDiscounted) * 100);
                const moneyOrderPercent = (1 + variantData.MONEY_ORDER_PERCENT / 100) * price;
                const priceVat = variantData.VAT;

                const priceItems = productItemScope(productItem, `
                    [data-toggle="price-sell"], 
                    [data-toggle="price-sell-vat"], 
                    [data-toggle="price-not-discounted"], 
                    [data-toggle="price-not-discounted-vat"], 
                    [data-toggle="price-money-order"], 
                    [data-toggle="price-money-order-vat"], [data-toggle="price-numeric1"]`, true);
                Array.from(priceItems).forEach(item => {
                    if (item.dataset.toggle == 'price-sell') item.innerText = format(price);
                    if (item.dataset.toggle == 'price-sell-vat') item.innerText = vat(price, priceVat);
                    if (item.dataset.toggle == 'price-not-discounted') item.innerText = format(priceNotDiscounted);
                    if (item.dataset.toggle == 'price-not-discounted-vat') item.innerText = vat(priceNotDiscounted, priceVat);
                    if (item.dataset.toggle == 'price-money-order') item.innerText = format(moneyOrderPercent);
                    if (item.dataset.toggle == 'price-money-order-vat') item.innerText = vat(moneyOrderPercent, priceVat);
                    if (item.dataset.toggle == 'price-numeric1' && item.dataset.percent) item.innerText = vat(price - (price * item.dataset.percent / 100), priceVat);
                    item.dataset.price = priceToFloat(item.innerText);
                });

                if (discountPercent < 0) discountPercent = discountPercent * -1;
                const discountItems = productItemScope(productItem, `
                    [data-toggle="discount-percent"], 
                    [data-toggle="price-not-discounted"], 
                    [data-toggle="price-not-discounted-vat"]`, true);
                Array.from(discountItems).forEach(item => {
                    if (discountPercent <= 0) {
                        if (item.closest('[data-toggle="price-control"]')) item.closest('[data-toggle="price-control"]').classList.add('!hidden', 'hidden');
                    } else {
                        if (item.closest('[data-toggle="price-control"]')) item.closest('[data-toggle="price-control"]').classList.remove('!hidden', 'hidden');
                        if (item.dataset.toggle == 'discount-percent') item.innerText = discountPercent.toFixed();
                    }
                });

                const multipleDiscounts = productItemScope(productItem, '[data-toggle="product-multiple"]', true);
                Array.from(multipleDiscounts).forEach(item => {
                    const priceMultiple = item.querySelector('[data-toggle="price-multiple"]');
                    if (!priceMultiple) return;

                    const percent = item.dataset.percent;
                    const isVat = item.dataset.vat;
                    const lastPrice = (price - (price * percent/100));

                    if (isVat) {
                        priceMultiple.innerText = vat(lastPrice, priceVat);
                    } else {
                        priceMultiple.innerText = format(lastPrice);
                    }
                });
                if (multipleDiscounts.length) components.multipleDiscount.setTotal();

                components.multiSelect.set(variantItem);

                if (typeof BLOCK_JS.PERSONALIZATION != 'undefined') {
                    if (BLOCK_JS.PERSONALIZATION[productItem.dataset.id]) {
                        const appPersonalization = BLOCK_JS.PERSONALIZATION[productItem.dataset.id] || {};
                        if (typeof appPersonalization?.setPrice == 'function') {
                            appPersonalization.setPrice();
                        }
                    }
                }

                if (typeof SNIPPET_JS.PRODUCT_INSTALLMENT != 'undefined') {
                    if (typeof SNIPPET_JS.PRODUCT_INSTALLMENT.reload == 'function') SNIPPET_JS.PRODUCT_INSTALLMENT.reload();
                }

                if (variant) {
                    try {
                        window[variant.dataset.callback]?.(variantItem, variantData);
                    } catch (error) {
                        console.warn(`${variant.dataset.callback} error => ${error}`);
                    }
                }
                return;
            },
            other: function(variantItem, productItem, variantData) {
                if (!variantData) return;

                const codeItems = productItemScope(productItem, `
                    [data-toggle="product-code"], 
                    [data-toggle="supplier-product-code"], 
                    [data-toggle="barcode"]`, true);
                Array.from(codeItems).forEach(item => {
                    let code = item.dataset.code || '';
                    if (item.dataset.toggle == 'product-code') item.innerText = variantData.WS_CODE ? variantData.WS_CODE : code;
                    if (item.dataset.toggle == 'supplier-product-code') item.innerText = variantData.CODE ? variantData.CODE : code;
                    if (item.dataset.toggle == 'barcode') item.innerText = variantData.BARCODE ? variantData.BARCODE : code;
                });

                let status = variantData.STOCK > 0 ? true : false;
                if (typeof SETTINGS.NEGATIVE_STOCK !== 'undefined' && SETTINGS.NEGATIVE_STOCK == 1) status = true;

                const stockItems = productItemScope(productItem, `
                    [data-toggle="show-in-stock"], 
                    [data-toggle="show-out-stock"]`, true);
                Array.from(stockItems).map(async item => {
                    if (status) {
                        if (item.dataset.toggle == 'show-in-stock') item.classList.remove('hidden');
                        if (item.dataset.toggle == 'show-out-stock') item.classList.add('hidden');
                    } else {
                        if (item.dataset.toggle == 'show-in-stock') item.classList.add('hidden');
                        if (item.dataset.toggle == 'show-out-stock') {
                            showOutStock(item);
                            item.classList.remove('hidden');
                        }
                    }
                    return;
                });

                const productId = productItem?.dataset?.id ?? 0;
                if (PAGE_TYPE === 'product' && document.getElementById('product-id')?.value === productId) {
                    const relatedProducts = document.querySelectorAll(`[data-toggle="product-related-id"][data-related-id="${productId}"]`);
                    Array.from(relatedProducts).forEach(related => {
                        if (related.value == `${productId}:${variantData.ID}`) return;
                        related.value = `${productId}:${variantData.ID}`;
                    });
                }
                return;
            },
            variantDataSet: function(variantItem, productItem, status = true) {
                const codeItems = productItemScope(productItem, `
                    [data-toggle="variant-one-active"], 
                    [data-toggle="variant-two-active"]`, true);
                Array.from(codeItems).forEach(item => {
                    if (item.dataset.toggle == 'variant-one-active' && variantItem.closest('[data-toggle="variant-one"]')) item.innerText = status ? variantItem.dataset.type ?? '' : '';
                    if (item.dataset.toggle == 'variant-two-active' && variantItem.closest('[data-toggle="variant-two"]')) item.innerText = status ? variantItem.dataset.type ?? '' : '';
                });
            },
            images: function(variantItem, productItem) {
                const id = variantItem.dataset.id;
                if (!id) return;

                const subOne = productItemScope(productItem, '[data-toggle="variant-one"]');
                const subTwo = productItemScope(productItem, '[data-toggle="variant-two"]');
                const variantSub = variantItem.closest('[data-toggle="variant-one"]') ? subOne : subTwo;

                const productImages = productItemScope(productItem, '[data-toggle="product-image"]', true);
                const defaultImages = productItemScope(productItem, `[data-toggle="product-image"][data-id="0"]`, true);
                const variantImages = productItemScope(productItem, `[data-toggle="product-image"][data-id="${id}"]`, true);

                if (variantSub == subTwo && !variantImages.length) return;

                if (productItem.variantStatus == id) return;
                productItem.variantStatus = id;

                Array.from(productImages).forEach(item => {
                    const classes = item.classList;
                    Array.from(classes).forEach(cls => {
                        if (cls.startsWith('swiper-')) item.classList.remove(cls);
                    });

                    item.classList.add('!hidden');
                    item.classList.remove('gallery-selector');

                    let variantId = '';
                    if (variantImages.length) {
                        variantId = id;
                    } else if (defaultImages.length) {
                        variantId = 0;
                    } else {
                        variantId = item.dataset.id;
                    }

                    if (item.dataset.id == variantId) {
                        item.classList.remove('!hidden');
                        item.classList.add('gallery-selector');
                        if (item.closest('.swiper')?.swiper) item.classList.add('swiper-slide');
                    }
                });

                setTimeout(() => {
                    const imageGalleries = document.querySelectorAll('[data-toggle="product-gallery"]');
                    if (imageGalleries.length) {
                        Array.from(imageGalleries).forEach(gallery => {
                            try {
                                components.lightGallery.create(gallery);
                            } catch (error) {}
                        });
                    }

                    if (BLOCK_JS.PRODUCT_DETAIL?.imageSlider) {
                        try {
                            BLOCK_JS.PRODUCT_DETAIL.imageSlider.init();
                        } catch (error) {}
                    }
                    return;
                }, 100);
                return;
            },
            product: function(productItem, id) {
                productItem.dataset.variantId = id || 0;

                if (productItem.dataset.variantId == 0) {
                    const stockItems = productItemScope(productItem, `
                        [data-toggle="show-in-stock"], 
                        [data-toggle="show-out-stock"]`, true);
                    Array.from(stockItems).forEach(item => {
                        if (item.dataset.toggle == 'show-in-stock') item.classList.remove('hidden');
                        if (item.dataset.toggle == 'show-out-stock') item.classList.add('hidden');
                    });
                }
                /*
                    const productLinks = productItemScope(productItem, '[data-toggle="product-url"]', true);
                    Array.from(productLinks).map(p => {
                        if (p.href) p.href = setUrlParam('variant', productItem.dataset.variantId, p.href);
                    });

                    if (PAGE_TYPE === 'product' && document.getElementById('product-id')?.value === productItem.dataset.id) {
                        let url = setUrlParam('variant', productItem.dataset.variantId);
                        if (productItem.dataset.variantId == 0) url = deleteUrlParam('variant');
                        window.history.replaceState('product', null, url);
                    }
                */
            },
        },
        change: async function(variantItem, productItem, variant) {
            const self = this;

            const data = {
                'ID': variantItem.dataset.subproductId,
                'TYPE_ID': variantItem.dataset.id,
                'TYPE': variantItem.dataset.type,
                'CODE': variantItem.dataset.code,
                'TYPE_COLOR_CODE': variantItem.dataset.colorCode,
                'PRICE': variantItem.dataset.price,
                'STOCK': variantItem.dataset.stock,
                'IN_STOCK': variantItem.dataset.instock,
                'BARCODE': variantItem.dataset.barcode,
                'MONEY_ORDER_PERCENT': variantItem.dataset.mop,
                'VAT': variantItem.dataset.vat,
                'PRICE_NOT_DISCOUNTED': variantItem.dataset.notDiscounted,
                'WS_CODE': variantItem.dataset.wscode,
                'WEIGHT': variantItem.dataset.weight,
                'ADDITIONAL_INFO': variantItem.dataset.additional || '',
            };

            self.set.price(variantItem, productItem, data, variant);
            self.set.other(variantItem, productItem, data);
            self.set.product(productItem, data.ID || 0);
        },
        trigger: function(variantItem) {
            setTimeout(() => {
                if (variantItem.nodeName === 'OPTION') {
                    const select = variantItem.closest('select');
                    if (variantItem.value !== '0') {
                        select.value = variantItem.value;
                        triggerEvent(select, 'change');
                    }
                } else {
                    variantItem.click();
                }
                return;
            }, 1);
        },
        async getVariantData(productItem, variants) {
            try {
                const variantId = getUrlParam('variant');
                const productId = productItem.dataset.id;
                if (!productId || !variantId) return;

                const response = await request('GET', getEndpoint('GET_VARIANT_INFO', `${productId}/${variantId}`));
                Array.from(variants).forEach(item => {
                    let subId = '';
                    if (item.closest('[data-toggle="variant-one"]')) {
                        subId = response.TurId1;
                    } else if (item.closest('[data-toggle="variant-two"]')) {
                        subId = response.TurId2;
                    }

                    if (item.nodeName == 'SELECT') {
                        item.querySelectorAll('option').forEach(option => {
                            option.classList.remove('active');
                            if (option.dataset.id == subId) option.classList.add('active');
                        });
                    } else {
                        item.classList.remove('active');
                        if (item.dataset.id == subId) item.classList.add('active');
                    }
                });
            } catch (error) {
                console.warn(`GET_VARIANT_INFO error => ${error}`);
            }
        },
        init: async function() {
            const self = this;

            const productItems = document.querySelectorAll('[data-toggle="product"]');
            Array.from(productItems).map(async productItem => {
                if (productItem.componentVariant == 1) return;
                productItem.componentVariant = 1;

                const variants = productItem.querySelectorAll('[data-toggle="variant"]');
                if (!variants.length) return;

                const subOne = productItemScope(productItem, '[data-toggle="variant-one"]');
                const subTwo = productItemScope(productItem, '[data-toggle="variant-two"]');
                if (!subOne && !subTwo) return;

                const getParamsVariant = getUrlParam('variant');
                if (PAGE_TYPE === 'product' && productItem.id == 'product-detail' && !productItem.getVariantData) {
                    productItem.getVariantData = true;
                    await self.getVariantData(productItem, variants);
                }

                Array.from(variants).map(async variant => {
                    if (variant.componentVariant == 1) return;
                    variant.componentVariant = 1;

                    let event = 'click';
                    if(variant.nodeName == 'SELECT') event = 'change';

                    const variantItem = variant.nodeName == 'SELECT' ? variant.options[variant.options.selectedIndex] : variant;

                    variant.addEventListener(event, async e => {
                        e.preventDefault();

                        const variantItem = variant.nodeName == 'SELECT' ? variant.options[variant.options.selectedIndex] : variant;
                        const variantSub = variantItem.closest('[data-toggle="variant-one"]') ? subOne : subTwo;
                        const variantOtherSub = variantSub == subOne ? subTwo : subOne;

                        const variantData = {
                            subId: variantItem.dataset.id,
                            proId: variantItem.dataset.pid
                        }

                        Array.from(variantSub.querySelectorAll('[data-toggle="variant"]:not(select), select[data-toggle="variant"] option')).forEach(item => {
                            item.classList.remove('active');
                        });

                        if (!variantItem.classList.contains('!hidden')) {
                            variantItem.classList.add('active');
                        }

                        const variantNotify = productItemScope(productItem, '[data-toggle="variant-notify"]');
                        if (variantNotify) variantNotify.classList.add('hidden');

                        if (variantItem.nodeName == 'OPTION' && (variantItem.value == '0' || variantItem.value == '')) {
                            productItem.dataset.variantId = '0';
                            self.set.variantDataSet(variantItem, productItem, false);

                            const stockItems = productItemScope(productItem, `
                                [data-toggle="show-in-stock"], 
                                [data-toggle="show-out-stock"]`, true);
                            Array.from(stockItems).forEach(item => {
                                if (item.dataset.toggle == 'show-in-stock') item.classList.remove('hidden');
                                if (item.dataset.toggle == 'show-out-stock') item.classList.add('hidden');
                            });
                            return;
                        }
                        if (!variantData.subId || !variantData.proId) return;

                        self.set.images(variantItem, productItem);
                        self.set.variantDataSet(variantItem, productItem);

                        if (variantOtherSub) {
                            const subOneItems = subOne.querySelectorAll('[data-toggle="variant"]:not(select), select[data-toggle="variant"] option[data-id]');
                            if (subOneItems?.length == 1 && variantSub.dataset.toggle == "variant-two") await self.change(variantItem, productItem, variant);
                            if (subOneItems.length > 1) {
                                const variantTypeList = variantSub.dataset.toggle == "variant-one" ? 'get-variant2-list' : 'get-variant1-list';

                                try {
                                    await request('GET', getEndpoint('VARIANT', `${variantTypeList}/${variantData.proId}/${variantData.subId}`)).then(response => {
                                        const data = response.VARIANT2_LIST ?? response.VARIANT1_LIST;
                                        const variantItems = variantOtherSub.querySelectorAll('[data-toggle="variant"]:not(select), select[data-toggle="variant"] option');

                                        Array.from(variantItems).forEach(item => {
                                            if(item.nodeName == 'OPTION' && (item.value == '0' || item.value == '')) {
                                                return
                                            };

                                            if (variantSub.dataset.toggle == "variant-one") item.classList.add('!hidden');
                                            item.classList.add('passive');

                                            const subData = Array.from(data).find(x => x.TYPE_ID == item.dataset.id);
                                            if (subData) {
                                                if (subData.STOCK > 0) {
                                                    item.classList.remove('passive');
                                                    if (item.nodeName == 'OPTION' && item.dataset.type) item.innerText = item.dataset.type;
                                                } else {
                                                    if (item.nodeName == 'OPTION' && item.dataset.type) item.innerText = `${item.dataset.type} (${COMMON_LANG.out_of_stock || 'Tükendi'})`;
                                                }
                                                item.classList.remove('!hidden');
                                            }
                                        });

                                        const variantSelected = variantOtherSub.querySelector('.active');
                                        if (variantSelected) {
                                            if (variantSelected.classList.contains('!hidden')) {
                                                variantSelected.classList.remove('active');
                                                self.set.variantDataSet(variantSelected, productItem, false);
                                            }

                                            const subId = variantSelected.dataset.id;
                                            const newData = Array.from(data).find(x => x.TYPE_ID == subId);
                                            const variantId = newData ? newData.ID : '0';

                                            if (!newData?.ID) {
                                                const variantSelect = variantOtherSub.querySelector('select[data-toggle="variant"]');
                                                if (variantSelect) {
                                                    variantSelect.value = '0';
                                                    triggerEvent(variantSelect, 'change');
                                                }
                                            }

                                            self.set.price(variantItem, productItem, newData, variant);
                                            self.set.other(variantItem, productItem, newData);

                                            self.set.product(productItem, variantId || 0);
                                        } else {
                                            window[variant.dataset.callback]?.(variantItem, data);
                                        }
                                    });
                                } catch (error) {
                                    console.warn(`VARIANT error => ${error}`);
                                }
                            }
                        } else {
                            await self.change(variantItem, productItem, variant);
                        }

                        if (productItem['selectVariant'] || getParamsVariant) return;
                        const errorClasses = ['passive', '!hidden', 'hidden'];
                        let subElement = variantSub;

                        if (((variantSub == subOne) && (variantOtherSub && variantOtherSub['selectVariant'])) || (!variantOtherSub && variantSub['selectVariant'])) {
                            if ((variantSub == subOne) && (variantOtherSub && variantOtherSub['selectVariant'])) subElement = variantOtherSub;

                            const otherItems = subElement.querySelectorAll('[data-toggle="variant"]:not(select), select[data-toggle="variant"] option[data-type]');
                            const activeItem = Array.from(otherItems).find(item => item.classList.contains('active'));
                            if (activeItem) {
                                const hasErrorClass = errorClasses.some(errorClass => activeItem.classList.contains(errorClass));

                                if (hasErrorClass) {
                                    const validItem = Array.from(otherItems).find(item => 
                                        !item.classList.contains('active') && 
                                        !errorClasses.some(errorClass => item.classList.contains(errorClass))
                                    );

                                    if (validItem) {
                                        activeItem.classList.remove('active');
                                        validItem.classList.add('active');
                                        self.trigger(validItem);
                                    }
                                }
                            }
                            productItem['selectVariant'] = true;
                        }
                        return;
                    });

                    if (variant.nodeName == 'SELECT') {
                        variant.querySelectorAll('option').forEach(option => {
                            if (option.classList.contains('active')) {
                                variant.value = option.value;
                                self.trigger(option);
                                if (subOne) subOne['selectVariant'] = true;
                                if (subTwo) subTwo['selectVariant'] = true;
                            }

                            if (option.dataset.type) {
                                const stock = Number(option.dataset.stock);
                                if (stock <= 0) {
                                    option.innerText = `${option.dataset.type} (${COMMON_LANG.out_of_stock || 'Tükendi'})`;
                                } else {
                                    option.innerText = option.dataset.type;
                                }
                            }
                        });
                    } else {
                        if (variantItem.classList.contains('active')) {
                            self.trigger(variant);
                            if (subOne) subOne['selectVariant'] = true;
                            if (subTwo) subTwo['selectVariant'] = true;
                        }
                    }
                });
            });
        }
    },
    favourite: {
        STORAGE_KEY: "favorite_products",
        SESSION_KEY: "favorites_fetched",
        SESSION_SERVER: "server_favorites",
        LIST_API_URL: "/srv/service/profile/get-shopping-list",
        ADD_API_URL: "/srv/service/profile/add-to-fav-list",
        REMOVE_API_URL: "/srv/service/profile/delete-shopping-products-by-product-id",
        maxChanges: 10,
        updateTimeout: null,
        debounceTimeout: null,
        syncFavorites: false,
        async add(ids = null, message = false) {
            const self = this;
            if (MEMBER_INFO.ID <= 0) {
                await loginPopup();
                return;
            }

            if (ids == null) ids = [];
            if (!Array.isArray(ids)) ids = [ids];
            if (ids.length === 0) return;

            let favorites = self.getFavorites();
            let changed = false;
            const callback = this.callback;

            ids.forEach(productId => {
                if (!favorites.includes(productId)) {
                    favorites.push(productId);
                    callback(productId, 'add');
                    changed = true;
                }
            });

            if (changed) {
                await self.setFavorites(favorites);
                await self.sendUpdates(message);
                self.set();
            }
        },
        async remove(ids = null, message = false) {
            const self = this;
            if (MEMBER_INFO.ID <= 0) {
                await loginPopup();
                return;
            }

            if (ids == null) ids = [];
            if (!Array.isArray(ids)) ids = [ids];
            if (ids.length === 0) return;

            let favorites = self.getFavorites();
            let changed = false;
            const callback = this.callback;

            ids.forEach(productId => {
                if (favorites.includes(productId)) {
                    favorites.splice(favorites.indexOf(productId), 1);
                    callback(productId, 'remove');
                    changed = true;
                }
            });

            if (changed) {
                await self.setFavorites(favorites);
                await self.sendUpdates(message);
                self.set();
            }
        },
        getFavorites() {
            const self = this;
            return JSON.parse(localStorage.getItem(self.STORAGE_KEY)) || [];
        },
        async setFavorites(favorites) {
            const self = this;

            localStorage.setItem(self.STORAGE_KEY, JSON.stringify(favorites));

            const favouriteCount = document.querySelectorAll('[data-toggle="favourite-count"]');
            Array.from(favouriteCount).forEach(item => {
                item.innerText = favorites.length || '';
            });
        },
        fetchFavorites() {
            const self = this;

            if (MEMBER_INFO.ID <= 0) {
                localStorage.removeItem(self.STORAGE_KEY);
                sessionStorage.removeItem(self.SESSION_KEY);
                sessionStorage.removeItem(self.SESSION_SERVER);
                return;
            }

            if (sessionStorage.getItem(self.SESSION_KEY) && localStorage.getItem(self.STORAGE_KEY)) {
                self.sendUpdates();
                return;
            }

            request('GET', self.LIST_API_URL)
                .then(response => {
                    let apiFavorites = response?.CATEGORIES?.[0]?.PRODUCTS?.map(p => p.ID) || [];

                    self.setFavorites(apiFavorites);
                    sessionStorage.setItem(self.SESSION_SERVER, JSON.stringify(apiFavorites));
                    sessionStorage.setItem(self.SESSION_KEY, "true");

                    self.sendUpdates(false, apiFavorites);
                    self.set();
                })
                .catch(error => {
                    console.error("API hatası:", error);
                    return;
                });
        },
        async set() {
            const self = this;

            const favorites = self.getFavorites();

            const favouriteCount = document.querySelectorAll('[data-toggle="favourite-count"]');
            Array.from(favouriteCount).forEach(item => {
                item.innerText = favorites.length || '';
            });

            const allFavButtons = document.querySelectorAll('[data-toggle="favourite"]');
            allFavButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            favorites.forEach(productId => {    
                const favButtons = document.querySelectorAll(`[data-toggle="product"][data-id="${productId}"] [data-toggle="favourite"]`);
                favButtons.forEach(btn => {
                    btn.classList.add('active');
                });
            });
        },
        toggleFavorite(productId) {
            const self = this;

            let favorites = self.getFavorites();
            const index = favorites.indexOf(productId);
            const callback = this.callback;

            const products = document.querySelectorAll(`[data-toggle="product"][data-id="${productId}"] [data-toggle="favourite"]`);            
            if (index === -1) {
                favorites.push(productId);
                products.forEach(fav => {
                    fav.classList.add('active');
                });
                callback(productId, 'add');
            } else {
                favorites.splice(index, 1);
                products.forEach(fav => {
                    fav.classList.remove('active');
                });
                callback(productId, 'remove');
            }

            self.setFavorites(favorites);
            self.scheduleUpdate();
        },
        debounceToggleFavorite(productId) {
            const self = this;

            clearTimeout(self.debounceTimeout);
            self.debounceTimeout = setTimeout(() => {

                if (!localStorage.getItem(self.STORAGE_KEY)) {
                    self.fetchFavorites().then(() => {
                        self.toggleFavorite(productId);
                    });
                    return;
                }

                self.toggleFavorite(productId);
            }, 500);
        },
        async scheduleUpdate() {
            const self = this;

            if (self.updateTimeout) clearTimeout(self.updateTimeout);

            let storedFavorites = self.getFavorites();
            let serverFavorites = JSON.parse(sessionStorage.getItem(self.SESSION_SERVER)) || [];

            let toAdd = storedFavorites.filter(id => !serverFavorites.includes(id));
            let toRemove = serverFavorites.filter(id => !storedFavorites.includes(id));

            if (toAdd.length + toRemove.length > self.maxChanges) {
                self.sendUpdates();
                return;
            }

            self.updateTimeout = setTimeout(() => {
                self.sendUpdates();
            }, 10000);
        },
        async sendUpdates(message = false, localFavorites = []) {
            const self = this;
            if (self.syncFavorites) return;
            self.syncFavorites = true;

            let storedFavorites = localFavorites.length > 0 ? localFavorites : self.getFavorites();
            let serverFavorites = JSON.parse(sessionStorage.getItem(self.SESSION_SERVER)) || [];

            let toAdd = storedFavorites.filter(id => !serverFavorites.includes(id));
            let toRemove = serverFavorites.filter(id => !storedFavorites.includes(id));

            let sent = true;

            const sendSync = async (url, data, isAdd = true) => {
                try {
                    if (message && isAdd) {
                        try {
                            let response = await request('POST', url, data);
                            if (response.status) {
                                if (message == true) {
                                    notify({
                                        text: COMMON_LANG?.added_fav_success
                                    });
                                }
                            }

                            return response.status;
                        } catch (error) {
                            console.error("Veri gönderme hatası:", error);
                            return false;
                        }
                    } else if (navigator.sendBeacon) {
                        return navigator.sendBeacon(url, data);
                    } else {
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', url, false);
                        try {
                            xhr.send(data);
                            return xhr.status === 200;
                        } catch (error) {
                            console.error("Veri gönderme hatası:", error);
                            return false;
                        }
                    }
                } catch (error) {
                    console.error("sendSync işlemi sırasında hata:", error);
                    return false;
                }
            };

            const processUpdates = async () => {
                try {
                    if (toAdd.length > 0) {
                        const body = new FormData();
                        toAdd.forEach(id => {
                            body.append('ids[]', id + '-0');
                        });
                        body.append('fetch', true);
                        body.append('cat_id', 1);
                        const addResult = await sendSync(self.ADD_API_URL, body, true);
                        sent = sent && addResult;
                    }

                    if (toRemove.length > 0) {
                        const body = new FormData();
                        toRemove.forEach(id => {
                            body.append('products[]', id);
                        });
                        const removeResult = await sendSync(self.REMOVE_API_URL, body, false);
                        sent = sent && removeResult;
                    }

                    if (sent) {
                        sessionStorage.setItem(self.SESSION_SERVER, JSON.stringify(storedFavorites));
                        if (localFavorites.length > 0) {
                            self.setFavorites(localFavorites);
                            self.set();
                        }
                    }
                } catch (error) {
                    console.error("Favori güncellemesi sırasında hata:", error);
                } finally {
                    self.syncFavorites = false;
                }
            };

            processUpdates();
        },
        handleOnline() {
            const self = this;
            self.sendUpdates();
        },
        handlePageLeave() {
            const self = this;
            self.sendUpdates();
        },
        click: function(id) {
            const self = this;

            if (!id) {
                console.log('favourite click id undefined');
                return;
            }
            self.debounceToggleFavorite(id);
        },
        callback: function(id, type) {
            const product = Array.from(PRODUCT_DATA).find(p => p.id == id);
            if (product) {
                const returnData = [{
                    data: {
                        code: product.code,
                        id: product.id,
                        name: product.name,
                        currency: product.currency,
                        category_id: product.category_id,
                        category_name: product.category,
                        category_path: product.category_path,
                        brand: product.brand,
                        price: product.total_sale_price
                    },
                    status: 1
                }];

                if (type == 'add') {
                    for(let i=0; i < callbacks.product.wishList.add.length; i++){
                        if(typeof callbacks.product.wishList.add[i] === 'function'){
                            try {
                                callbacks.product.wishList.add[i]?.(returnData);
                            } catch (error) { console.log(`Product Wishlist Add Callback Error => ${error}`); }
                        }
                    }

                    for(let i=0; i < callbacks.product.favourite.add.length; i++){
                        if(typeof callbacks.product.favourite.add[i] === 'function'){
                            try {
                                callbacks.product.favourite.add[i]?.(id);
                            } catch (error) { console.log(`Products Favourite Add Callback Error => ${error}`); }
                        }
                    }
                } else {
                    for(let i=0; i < callbacks.product.wishList.remove.length; i++){
                        if(typeof callbacks.product.wishList.remove[i] === 'function'){
                            try {
                                callbacks.product.wishList.remove[i]?.(returnData);
                            } catch (error) { console.log(`Product Wishlist Remove Callback Error => ${error}`); }
                        }
                    }

                    for(let i=0; i < callbacks.product.favourite.remove.length; i++){
                        if(typeof callbacks.product.favourite.remove[i] === 'function'){
                            try {
                                callbacks.product.favourite.remove[i]?.(id);
                            } catch (error) { console.log(`Products Favourite Remove Callback Error => ${error}`); }
                        }
                    }
                }
            }
        },
        init() {
            const self = this;

            self.fetchFavorites();
            self.set();

            if (MEMBER_INFO.ID > 0) {
                window.addEventListener("online", () => self.handleOnline());

                const boundHandlePageLeave = self.handlePageLeave.bind(self);

                window.addEventListener("beforeunload", boundHandlePageLeave);
                window.addEventListener("unload", boundHandlePageLeave);
                window.addEventListener("pagehide", boundHandlePageLeave);
                window.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === 'hidden') {
                        boundHandlePageLeave();
                    }
                    return;
                });
            }

            const favourites = document.querySelectorAll('[data-toggle="favourite"]');
            Array.from(favourites).forEach(fav => {
                if (fav.componentFavourite == 1) return;

                fav.addEventListener('click', async e => {
                    e.preventDefault();

                    fav.classList.add('disabled');
                    if (MEMBER_INFO.ID <= 0) {
                        await loginPopup();
                        fav.classList.remove('disabled');
                        return;
                    }

                    const product = fav.closest('[data-toggle="product"]');
                    if (!product) {
                        console.log(`favourite Product undefined`);
                        return;
                    }

                    const productId = product.dataset.id;
                    if (!productId) {
                        console.log(`favourite Product Id undefined => data-id=?`);
                        return;
                    }

                    self.click(productId);
                    fav.classList.remove('disabled');
                    return;
                });

                fav.componentFavourite = 1;
            });
        }
    },
    collection: function() {
        const collections = document.querySelectorAll('[data-toggle="collection"]');
        Array.from(collections).forEach(btn => {
            if (btn.componentCollection == 1) return;

            btn.addEventListener('click', e => {
                if (MEMBER_INFO.ID <= 0) {
                    loginPopup();
                    return;
                }

                const productItem = btn.closest('[data-toggle="product"]');
                if (!productItem) return;

                const productId = productItem.dataset.id || 0;
                const variantId = productItem.dataset.variantId || 0;

                loadSnippet({
                    snippet: '_shopping-list-popup',
                    params: {
                        include: 'shopping-list',
                        PRODUCT_ID: productId,
                        VARIANT_ID: variantId
                    },
                    success: function(loadRes){
                        modal({
                            id: `modal-shopping-list-popup`,
                            width: '480px',
                            html: loadRes,
                        });
                    }
                });
            });

            btn.componentCollection = 1;
        });
    },
    compare: {
        compareList: [],
        add: function(productId) {
            const self = this;

            let status;
            const isActive = Array.from(self.compareList).find(x => x == productId) || false;

            if (!isActive && self.compareList.length == 4) {
                status = 3;
            } else {
                if (isActive) {
                    status = 2;
                } else {
                    self.compareList.push(productId);
                    LocalApi.set('compare', self.compareList);
                    const products = document.querySelectorAll(`[data-toggle="product"][data-id="${productId}"]`);
                    Array.from(products).forEach(item => item.querySelector('[data-toggle="compare"]')?.classList.add('active'));
                    status = 1;
                }
            }

            if (self.compareList.length == 1) {
                notify({
                    text: COMMON_LANG?.compare_min_desc,
                    class: 'info',
                });
                return;
            }

            loadSnippet({
                snippet: '_product-compare',
                params: {
                    include: 'product-list',
                    PRODUCT_IDS: self.compareList.join('-'),
                    ADD_PRODUCT_ID: productId,
                    STATUS: status
                },
                success:  function(loadRes){
                    modal({
                        id: 'modal-product-compare',
                        width: '991px',
                        html: loadRes,
                    });
                    return;
                }
            });
            return;
        },
        remove: async function(productId) {
            const self = this;
            self.compareList = self.compareList.filter(x => x != productId);
            LocalApi.set('compare', self.compareList);

            const products = document.querySelectorAll(`[data-toggle="product"][data-id="${productId}"]`);
            Array.from(products).forEach(item => item.querySelector('[data-toggle="compare"]')?.classList.remove('active'));
            return;
        }, 
        get: function() {
            const self = this;

            self.compareList = LocalApi.get('compare') || [];
            Array.from(self.compareList).forEach(item => {
                const products = document.querySelectorAll(`[data-toggle="product"][data-id="${item}"]`);
                Array.from(products).forEach(item => item.querySelector('[data-toggle="compare"]')?.classList.add('active'));
            });
        },
        init: function() {
            const self = this;

            const compares = document.querySelectorAll('[data-toggle="compare"]');
            Array.from(compares).forEach(compare => {
                if (compare.componentCompare == 1) return;

                compare.addEventListener('click', e => {
                    e.preventDefault();

                    const product = compare.closest('[data-toggle="product"]');
                    if (!product) {
                        console.log(`compare Product undefined`);
                        return;
                    }

                    const productId = product.dataset.id;
                    if (!productId) {
                        console.log(`compare Product Id undefined => data-id=?`);
                        return;
                    }

                    if (getCookie('compare') != 1) {
                        setCookie('compare', 1);
                        self.compareList = [];
                        LocalApi.set('compare', self.compareList);
                    }
                    self.compareList = LocalApi.get('compare') || [];
                    const isCompareAdd = self.compareList.find(x => x == productId);
                    isCompareAdd ? self.remove(productId, compare) : self.add(productId, compare);
                    return;
                });

                compare.componentCompare = 1;
            });

            if (getCookie('compare') == 1) self.get();
        }
    },
    outStock: function() {
        const outStocks = document.querySelectorAll('[data-toggle="show-out-stock"]');
        Array.from(outStocks).forEach(outStock => {
            const stockStatus = outStock.dataset.stockStatus;
            if (stockStatus == 1) return;

            showOutStock(outStock);
        });
    },
    stockAlarm: {
        remove: function(removeAlarm = []) {
            const formData = new FormData();
            formData.append('products[]', removeAlarm);

            try {
                request('POST', getEndpoint('REMOVE_ALARM'), formData).then(response => {
                    return;
                });
            } catch (error) {
                console.warn(`REMOVE_ALARM error => ${error}`);
            }
        },
        init: function() {
            const stockAlarms = document.querySelectorAll('[data-toggle="stock-alarm"]');
            Array.from(stockAlarms).forEach(alarm => {
                if (alarm.componentStockAlarm == 1) return;

                alarm.addEventListener('click', async e => {
                    if (MEMBER_INFO.ID <= 0) {
                        await loginPopup();
                        return;
                    }

                    const productItem = alarm.closest('[data-toggle="product"]');
                    if (!productItem) return;

                    const productId = productItem.dataset.id;
                    const variantId = productItem.dataset.variantId || 0;
                    if (!productId) return;

                    alarm.classList.add('disabled');
                    await modal({
                        id: 'modal-stock-alarm-list-adding-warning',
                        html: COMMON_LANG?.stock_alarm_list_adding_warning,
                        width: 'auto',
                        alert: true,
                        buttons: [
                            {
                                text: COMMON_LANG?.stock_alarm_yes, href: 'javascript:void(0)', class: 'btn btn-primary !h-10', event: async function() {
                                    modalClose();
                                    try {
                                        await request('GET', getEndpoint('ADD_STOCK_ALARM', `${productId}-${variantId}`)).then(response => {
                                            modal({
                                                id: 'modal-stock-alarm-list-adding-success',
                                                html: response.statusText || COMMON_LANG?.added_stock_alarm_success,
                                                width: '480px',
                                                alert: true,
                                                class: 'success',
                                            });

                                            for(let i=0; i < callbacks.product.stockAlarm.length; i++){
                                                if(typeof callbacks.product.stockAlarm[i] === 'function'){
                                                    try {
                                                        callbacks.product.stockAlarm[i]?.(response, productId);
                                                    } catch (error) { console.log(`Stock Alarm List Add Callback Error => ${error}`); }
                                                }
                                            }
                                        });
                                    } catch (error) {
                                        console.warn(`ADD_STOCK_ALARM error => ${error}`);
                                    }
                                }, 
                            },
                        ],
                    });
                    alarm.classList.remove('disabled');
                });

                alarm.componentStockAlarm = 1;
            });
        }
    },
    priceAlarm: {
        remove: function(removeAlarm = []) {
            const formData = new FormData();
            formData.append('products[]', removeAlarm);

            try {
                request('POST', getEndpoint('REMOVE_ALARM'), formData).then(response => {
                    return;
                });
            } catch (error) {
                console.warn(`REMOVE_ALARM error => ${error}`);
            }
        },
        init: function() {
            const priceAlarms = document.querySelectorAll('[data-toggle="price-alarm"]');
            Array.from(priceAlarms).forEach(alarm => {
                if (alarm.componentPriceAlarm == 1) return;

                alarm.addEventListener('click', async e => {
                    if (MEMBER_INFO.ID <= 0) {
                        await loginPopup();
                        alarm.classList.remove('disabled');
                        return;
                    }

                    const productItem = alarm.closest('[data-toggle="product"]');
                    if (!productItem) return;

                    const productId = productItem.dataset.id;
                    const variantId = productItem.dataset.variantId || 0;

                    if (!productId) return;

                    const formData = new FormData();
                    formData.append('productId', productId);
                    formData.append('variantId', variantId);

                    alarm.classList.add('disabled');
                    await modal({
                        html: COMMON_LANG?.price_alarm_list_adding_warning,
                        width: 'auto',
                        alert: true,
                        buttons: [
                            {
                                text: COMMON_LANG?.price_alarm_yes, href: 'javascript:void(0)', class: 'btn btn-primary !h-10', event: async function() {
                                    modalClose();
                                    try {
                                        await request('POST', getEndpoint('ADD_PRICE_ALARM'), formData).then(response => {
                                            modal({
                                                html: response.message || response.statusText || COMMON_LANG?.added_price_alarm_success,
                                                width: '480px',
                                                alert: true,
                                                class: 'success',
                                            });

                                            for(let i=0; i < callbacks.product.priceAlarm.length; i++){
                                                if(typeof callbacks.product.priceAlarm[i] === 'function'){
                                                    try {
                                                        callbacks.product.priceAlarm[i]?.(response, productId);
                                                    } catch (error) { console.log(`Price Alarm List Add Callback Error => ${error}`); }
                                                }
                                            }
                                        });
                                    } catch (error) {
                                        console.warn(`ADD_PRICE_ALARM error => ${error}`);
                                    }
                                }, 
                            },
                        ],
                    });
                    alarm.classList.remove('disabled');
                });

                alarm.componentPriceAlarm = 1;
            });
        }
    },
    multipleDiscount: {
        elements: [],
        active: null,
        value: null,
        productItem: null,
        multipleTotals: [],
        setTotal: function() {
            const multipleDiscount = components.multipleDiscount;

            multipleDiscount.multipleTotals = document.querySelectorAll('[data-toggle="product-multiple-total"]');
            Array.from(multipleDiscount.multipleTotals).forEach(item => {
                item.classList.add('hidden');
                item.innerHTML = '';
            });

            if (!multipleDiscount.active || !multipleDiscount.value) return;

            const priceElement = multipleDiscount.active.querySelector('[data-toggle="price-multiple"]');
            if (!priceElement) return;

            const price = priceToFloat(priceElement.innerHTML?.trim());
            if (Number.isNaN(Number(price)) || price <= 0) return;

            const totalPrice = price * multipleDiscount.value;

            const callback = multipleDiscount.active.dataset?.callback;
            if (callback) {
                if (typeof window[callback] === 'function') {
                    try {
                        window[callback](multipleDiscount.active, multipleDiscount.value, price, totalPrice);
                    } catch (error) { console.log(`Multiple Discount Set Total Callback Error => ${error}`); }
                }
            }

            Array.from(multipleDiscount.multipleTotals).forEach(item => {
                item.classList.remove('hidden');
                item.innerHTML = format(totalPrice) + ' <span>' + (item.dataset?.currency || CURRENCY || 'TL') + '</span>';
            });
            return;
        },
        set: function(input) {
            const multipleDiscount = components.multipleDiscount;
            if (!multipleDiscount.elements.length) return;

            const productItem = input.closest('[data-toggle="product"]');
            if (productItem != multipleDiscount.productItem) return;

            multipleDiscount.active = null;

            Array.from(multipleDiscount.elements).forEach(multiple => {
                multiple.classList.remove('active');

                const value = input.value;
                const min = multiple.dataset?.min || 0;
                const max = multiple.dataset?.max || 0;

                if (Number.parseFloat(min) <= Number.parseFloat(value) && Number.parseFloat(max) >= value) {
                    multipleDiscount.active = multiple;
                    multiple.classList.add('active');
                    multipleDiscount.value = value;
                }
            });

            components.multipleDiscount.setTotal();
        },
        init: function() {
            const multipleDiscount = components.multipleDiscount;
            multipleDiscount.elements = document.querySelectorAll('[data-toggle="product-multiple"]');

            Array.from(multipleDiscount.elements).forEach(multiple => {
                if (multiple.componentMultipleDiscount == 1) return;

                if (!multipleDiscount.productItem) multipleDiscount.productItem = multiple.closest('[data-toggle="product"]');
                if (!multipleDiscount.productItem) return;

                multiple.addEventListener('click', e => {
                    e.preventDefault();

                    const productQty = productItemScope(multipleDiscount.productItem, multipleDiscount.productItem.dataset?.count);
                    if (!productQty) return;

                    const min = multiple.dataset?.min;
                    if (min) productQty.value = min;

                    multipleDiscount.set(productQty);
                    return;
                });

                multiple.componentMultipleDiscount = 1;
            });
        }
    },
    qty: function() {
        const qtys = document.querySelectorAll('[data-toggle="qty"]');
        Array.from(qtys).forEach(qty => {
            if (qty.componentQty == 1) return;

            const input = qty.querySelector('input[type="number"]');
            if (!input) return;

            const decreaseBtn = qty.querySelector('.decrease');
            const increaseBtn = qty.querySelector('.increase');

            const qtyCallback = function(count, oldCount, qty, inc) {
                const cb = qty.dataset.callback;
                if (typeof cb !== 'undefined' && count != oldCount) {
                    if (typeof window[cb] === 'function') {
                        try {
                            window[cb](count, oldCount, qty, inc);
                        } catch (error) {}
                    } else if (typeof cb === 'string') {
                        let method = cb.replace(' ', '');
                        method = cb.split('.');
                        if (method.length < 2) return;

                        let methodApp = window;
                        for (let i = 0; i < method.length; i++) {
                            methodApp = methodApp[method[i]];
                            if (typeof methodApp === 'undefined') break;
                        }

                        if (typeof methodApp == 'function') {
                           try {
                                methodApp(count, oldCount, qty, inc);
                           } catch (error) {}
                        }
                    }
                }
            }

            const calculate = function(inc, decimal) {
                let oldCount = Number.parseFloat(input.value);
                let count = oldCount;

                let minCount = input.min || input.dataset.min || 1;
                let maxCount = input.max || input.dataset.max;

                if (inc != 'INPUT') {
                    count += inc;
                    if (Number.parseFloat(minCount) > Number.parseFloat(count) || (maxCount != '' && Number.parseFloat(count) > Number.parseFloat(maxCount))) return;
                } else {
                    if (maxCount != '' && Number.parseFloat(count) > Number.parseFloat(maxCount)) {
                        count = Number.parseFloat(maxCount);
                    }
                    oldCount = qty.inputOldCount;
                }

                if (!Number.isInteger(count)) count = Number.parseFloat(count.toFixed(decimal));
                if (Number.isNaN(count) || count === undefined) return;
                input.value = count;

                qtyCallback(count, oldCount, qty, inc);
                try {
                    components.multipleDiscount.set(input);
                    components.multiSelect.set(qty);
                } catch (error) {}

                qty.inputLastCount = count;
            }

            const calculateBlur = function(inc, decimal) {
                const value = input.value;
                if (Number.isNaN(value) || value === undefined || value == '') input.value = qty.inputLastCount || input.min || input.dataset.min || 1;
            }

            const increment = qty.dataset.increment ? qty.dataset.increment : input.step || '1';
            const decimal = increment.indexOf('.') > -1 ? increment.replaceAll(/^.*?\./g, '').trim().length : 0;

            if (decreaseBtn) decreaseBtn.addEventListener('click', () => calculate(increment ? Number.parseFloat(`-${increment}`) : -1, decimal));
            if (increaseBtn) increaseBtn.addEventListener('click', () => calculate(increment ? Number.parseFloat(increment) : 1, decimal));

            input.addEventListener('focus', () => {
                qty.inputOldCount = Number.parseFloat(input.value);
                qty.inputLastCount = qty.inputOldCount;
                return;
            });
            input.addEventListener('blur', () => calculateBlur('INPUT', decimal));
            input.addEventListener('input', () => calculate('INPUT', decimal));

            components.multipleDiscount.set(input);

            qty.componentQty = 1;
        });
    },
    addToCart: function() {
        const cartButtons = document.querySelectorAll('[data-toggle="add-to-cart"]');
        Array.from(cartButtons).forEach(btn => {
            if (btn.componentAddToCart == 1) return;

            btn.addEventListener('click', async e => {
                const productItem = btn.closest('[data-toggle="product"]');
                if (!productItem) return;

                btn.classList.add('disabled');

                let productQty = productItemScope(productItem, productItem.dataset?.count);
                if (!productQty) productQty = productItemScope(productItem, productItem.dataset?.count);

                const opt = {
                    productId: productItem.dataset.id || 0,
                    variantId: productItem.dataset.variantId || 0,
                    quantity: productQty?.value || 1,
                    buyNow: btn.dataset.buy || 0,
                }

                const productRelated = productItemScope(productItem, '[data-toggle="product-related-id"]');
                if (productRelated) {
                    const productRelatedId = productRelated.dataset.relatedId || 0;
                    const productVariantId = productRelated.dataset.variantId || 0;
                    opt['relatedProductId'] = productRelated.value && productRelated.value != 0 ? productRelated.value : `${productRelatedId}:0`;
                    opt['variantId'] = productVariantId;
                }

                await addToCart(opt);
                setTimeout(() => {
                    btn.classList.remove('disabled');
                }, 1500);
            });

            btn.componentAddToCart = 1;
        });
    },
    cartPreview: {
        element: '',
        createElement: '',
        hoverTimeout: '',
        cartCount: CART_COUNT || 0,
        create: async function(step = null) {
            const cartPreview = components.cartPreview;

            if (step == 1) {
                cartPreview.createElement = document.createElement('div');
                cartPreview.createElement.id = 'cart-preview-app';
                cartPreview.createElement.classList.add('hidden', 'fixed', 'z-[9999]');
                document.body.append(cartPreview.createElement);
                return;
            }

            if (step == 2) {
                if (cartPreview.element.classList.contains('cart-preview-loaded')) return;
                const snippetUrl = cartPreview.element.dataset.url || snippetUri('cart-preview', {'include':'cart'});
                try {
                    await request('GET', snippetUrl).then(async response => {
                        if (!response) return;
                        if (response.statusCode == 'EOC0001') {
                            window.location.href = '/' + PAGE_LINK.CART;
                            return;
                        };

                        cartPreview.createElement.innerHTML = response;
                        await evalScripts(cartPreview.createElement.innerHTML);
                    });
                } catch (error) {
                    console.warn(`cartPreview warn: ${snippetUrl} => ${error}`);
                } finally {
                    cartPreview.element.classList.add('cart-preview-loaded');
                }
            }
        },
        setPosition: async function() {
            const cartPreview = components.cartPreview;
            const getElement = cartPreview.element;
            const setElement = cartPreview.createElement;

            const elementRect = getElement.getBoundingClientRect();
            const posY = elementRect.top + elementRect.height;
            const posX = document.dir == 'rtl' ? elementRect.left : document.body.offsetWidth - elementRect.right;

            setElement.style.top = `${posY}px`;
            setElement.style.right = `${posX}px`;
            if (document.dir == 'rtl') {
                setElement.style.right = '';
                setElement.style.left = `${posX}px`;
            }
        },
        async previewShow(auto = null) {
            const cartPreview = components.cartPreview;
            if (isMobile()) return;

            await cartPreview.setPosition();

            if (typeof SNIPPET_JS.CART_PREVIEW?.getCart == 'function' && cartPreview.cartCount != CART_COUNT) {
                SNIPPET_JS.CART_PREVIEW.getCart();
            }

            if (auto) {
                await cartPreview.create(2);
                cartPreview.createElement.classList.add('no-hidden');
                cartPreview.autoHiddenTimeout = setTimeout(() => {
                    cartPreview.previewHidden();
                }, 2000);
            }

            cartPreview.cartCount = CART_COUNT;
            cartPreview.createElement.classList.remove('hidden');
        },
        previewHidden() {
            const cartPreview = components.cartPreview;
            if (isMobile()) return;

            cartPreview.createElement.classList.remove('no-hidden');
            cartPreview.createElement.classList.add('hidden');
        },
        init: async function() {
            const cartPreview = this;

            if (!cartPreview.element) cartPreview.element = document.querySelector('[data-toggle="cart-preview"]');
            if (!cartPreview.element || isMobile() || cartPreview.element.componentCartPreview == 1) return;
            cartPreview.element.componentCartPreview = 1;

            await cartPreview.create(1);

            cartPreview.element.addEventListener('mouseenter', async () => {
                if (!CART_COUNT) return;
                await cartPreview.create(2);

                cartPreview.hoverTimeout = setTimeout(async () => {
                    cartPreview.createElement.classList.remove('no-hidden');
                    clearTimeout(cartPreview.autoHiddenTimeout);
                    cartPreview.previewShow();
                }, 1);
            });

            cartPreview.createElement.addEventListener('mouseenter', async () => {
                cartPreview.createElement.classList.remove('no-hidden');
                clearTimeout(cartPreview.autoHiddenTimeout);
            });

            document.addEventListener('mousemove', e => {
                const event = e.target;
                if (cartPreview.element.contains(event) || cartPreview.createElement.contains(event) || cartPreview.createElement.classList.contains('no-hidden')) {
                    return
                };

                clearTimeout(cartPreview.hoverTimeout);
                cartPreview.previewHidden();
            });
        }
    },
    cartDrawer: {
        element: '',
        createElement: '',
        snippetUrl: '',
        getCartDrawer: async function(cartDrawer) {
            if (cartDrawer.loaded) return;
            cartDrawer.loaded = true;

            cartDrawer.createElement = document.createElement('div');
            cartDrawer.snippetUrl = cartDrawer.element.dataset.url || snippetUri('cart-drawer', {'include':'cart'});
            cartDrawer.element.removeAttribute('data-url');

            try {
                await request('GET', cartDrawer.snippetUrl).then(async response => {
                    if (!response) return;
                    if (response.statusCode == 'EOC0001') {
                        window.location.href = '/' + PAGE_LINK.CART;
                        return;
                    };

                    cartDrawer.createElement.id = 'cart-drawer-app';
                    cartDrawer.createElement.innerHTML = response;

                    document.body.append(cartDrawer.createElement);
                    await evalScripts(cartDrawer.createElement.innerHTML);
                });
            } catch (error) {
                console.warn(`cartDrawer warn: ${cartDrawer.snippetUrl} => ${error}`);
            } finally {
                cartDrawer.element.dataset.toggle = 'drawer';

                const drawerTarget = cartDrawer.createElement.querySelector('.drawer');
                if (drawerTarget) {
                    drawerTarget.id = 'cart-drawer-wrapper';
                    cartDrawer.element.dataset.drawerTarget = '#cart-drawer-wrapper';
                }

                setTimeout(() => {
                    const callback = function() {
                        const newElement = document.querySelector('[data-drawer-target="#cart-drawer-wrapper"]');
                        triggerEvent(newElement, 'click');
                    }
                    components.init(callback);
                }, 50);
            }
        },
        init: function() {
            const cartDrawer = this;

            if (!cartDrawer.element) cartDrawer.element = document.querySelector('[data-toggle="cart-drawer"]');
            if (!cartDrawer.element || cartDrawer.element.componentCartDrawer == 1) return;

            cartDrawer.element.addEventListener('click', async e => {
                e.preventDefault();

                await cartDrawer.getCartDrawer(cartDrawer);

                if (typeof SNIPPET_JS.CART_DRAWER?.getCart == 'function') {
                    SNIPPET_JS.CART_DRAWER.getCart();
                    return;
                }
            });

            cartDrawer.element.componentCartDrawer = 1;
        }
    },
    cartCountPrice: function() {
        const counts = document.querySelectorAll('[data-toggle="cart-count"]');
        const prices = document.querySelectorAll('[data-toggle="cart-price"]');

        Array.from(counts).forEach(item => {
            if (CART_COUNT > 99) CART_COUNT = '99+';
            item.innerText = CART_COUNT || '';
        });
        Array.from(prices).forEach(item => {
            const total = typeof CART_TOTAL === 'string' ? priceToFloat(CART_TOTAL) : CART_TOTAL;
            item.innerHTML = total > 0 ? `${format(total)} <span>${CURRENCY}</span>` : '';
        });
        return;
    },
    multiAddtoCart: function() {
        const cartButtons = document.querySelectorAll('[data-toggle="multi-select-add"]');
        Array.from(cartButtons).forEach(btn => {
            if (btn.componentMultiAddtoCart == 1) return;

            callbacks.cart.add.push(function(response) {
                if (typeof btn.dataset.callback === 'string' && typeof window[btn.dataset.callback] === 'function') {
                    try {
                        window[btn.dataset.callback](response);
                    } catch (error) {}
                }
            });

            btn.addEventListener('click', async e => {
                btn.classList.add('disabled');
                const products = document.querySelectorAll('input[data-toggle="multi-select"]:checked');
                if (products.length == 0) {
                    notify({
                        text: COMMON_LANG?.no_products_selected,
                        class: 'danger',
                    });
                    btn.classList.remove('disabled');
                    return;
                }

                const pids = [], 
                      variants = [],
                      quantities = [];

                Array.from(products).forEach(item => {
                    const productItem = item.closest('[data-toggle="product"]');
                    if (!productItem) return;

                    let productQty = productItemScope(productItem, item.dataset?.count);
                    if (!productQty) productQty = productItemScope(productItem, productItem.dataset?.count);

                    const id = productItem.dataset.id || 0;
                    const variant = productItem.dataset.variantId || 0;
                    const quantity = productQty?.value || 1;

                    pids.push(id);
                    variants.push(variant);
                    quantities.push(quantity);
                });

                const opt = {
                    productId: pids,
                    variantId: variants,
                    quantity: quantities,
                    multi: true,
                }

                await addToCart(opt);
                components.multiSelect.multiSelectedItems = [];
                const multiCount = document.querySelector('[data-toggle="multi-select-count"]');
                const multiTotal = document.querySelector('[data-toggle="multi-select-total"]');
                const multiNotDiscountTotal = document.querySelector('[data-toggle="multi-select-not-discount-total"]');


                if (multiCount) multiCount.innerText = format(0);
                if (multiTotal) multiTotal.innerText = format(0);
                if (multiNotDiscountTotal) multiNotDiscountTotal.innerText = format(0);
                btn.classList.remove('disabled');
                return;
            });

            btn.componentMultiAddtoCart = 1;
        });
    },
    multiSelect: {
        multiSelectItems: [],
        multiSelectedItems: [],
        set: function(btn = null) {
            if (btn == null) return;

            const self = this;

            const productItem = btn.closest('[data-toggle="product"]');
            if (!productItem) return;

            if (btn.dataset.toggle == 'multi-select') {
                const isCheck = btn.checked;
                if (isCheck && !self.multiSelectedItems.includes(productItem)) {
                    self.multiSelectedItems.push(productItem);
                } else if (!isCheck && self.multiSelectedItems.includes(productItem)) {
                    self.multiSelectedItems = self.multiSelectedItems.filter(x => x != productItem);
                }
            }

            let notDiscountTotal = 0;
            let priceTotal = 0;

            Array.from(self.multiSelectedItems).forEach(item => {
                const priceSell = item.querySelector('[data-toggle="price-sell"]') || item.querySelector('[data-toggle="price-sell-vat"]');
                const count = item.querySelector(item.dataset.count)?.value || 1;

                let price = 0;
                if (priceSell) price = priceToFloat(priceSell.innerText);

                priceTotal += price * count;

                const priceNotDiscounted = item.querySelector('[data-toggle="price-not-discounted"]') || item.querySelector('[data-toggle="price-not-discounted-vat"]');
                if (priceNotDiscounted && !priceNotDiscounted.closest('[data-toggle="price-control"]')?.classList.contains('hidden')) {
                    price = priceToFloat(priceNotDiscounted.innerText);
                }

                notDiscountTotal += price * count;
            });

            const multiCount = document.querySelector('[data-toggle="multi-select-count"]');
            const multiTotal = document.querySelector('[data-toggle="multi-select-total"]');
            const multiNotDiscountTotal = document.querySelector('[data-toggle="multi-select-not-discount-total"]');


            if (multiCount) multiCount.innerText = self.multiSelectedItems.length || 0;
            if (multiTotal) multiTotal.innerText = format(priceTotal);
            if (multiNotDiscountTotal) multiNotDiscountTotal.innerText = format(notDiscountTotal);

            if (multiNotDiscountTotal) {
                if (priceTotal < notDiscountTotal) {
                    if (multiNotDiscountTotal.closest('[data-toggle="price-control"]')) multiNotDiscountTotal.closest('[data-toggle="price-control"]').classList.remove('!hidden', 'hidden');
                    multiNotDiscountTotal.style.display = 'block';
                } else {
                    if (multiNotDiscountTotal.closest('[data-toggle="price-control"]')) multiNotDiscountTotal.closest('[data-toggle="price-control"]').classList.add('!hidden', 'hidden');
                    multiNotDiscountTotal.style.display = 'none';
                }
            }

            const callbackBtn = productItemScope(productItem, '[data-toggle="multi-select"]');
            if (callbackBtn) {
                if (typeof callbackBtn.dataset.callback === 'string' && typeof window[callbackBtn.dataset.callback] === 'function') {
                    try {
                        window[callbackBtn.dataset.callback](priceTotal, notDiscountTotal, btn, self.multiSelectItems, self.multiSelectedItems);
                    } catch (error) {}
                    return;
                }
            }
            return;
        },
        init: function() {
            const self = this;

            self.multiSelectItems = [];

            self.multiSelectItems = document.querySelectorAll('[data-toggle="multi-select"]');
            Array.from(self.multiSelectItems).forEach(btn => {
                if (btn.componentMultiSelect == 1) return;

                const productItem = btn.closest('[data-toggle="product"]');
                if (!productItem) return;

                btn.addEventListener('change', e => {
                    self.set(btn);
                    return;
                });

                self.set(btn);
                btn.componentMultiSelect = 1;
            });
        }
    },
    memberName() {
        const members = document.querySelectorAll('[data-toggle="member-name"]');
        if (members.length > 0 && MEMBER_INFO.ID > 0) {
            Array.from(members).forEach(member => {
                if (member.componentMemberName == 1) return;

                member.innerText = `${MEMBER_INFO.FIRST_NAME} ${MEMBER_INFO.LAST_NAME}`;

                member.componentMemberName = 1;
            });
        }
    },
    newsletter: function() {
        const newsletters = document.querySelectorAll('[data-toggle="newsletter"]');
        Array.from(newsletters).forEach(form => {
            if (form.tagName.toLowerCase() !== 'form') return;

            if (form.componentNewsletter == 1) return;

            form.addEventListener('submit', async e => {
                e.stopPropagation();
                e.preventDefault();

                popoverAlertHide(form);
                if (!checkValidity(form)) return;

                const callback = form.dataset.callback;
                const formData = new FormData(form);

                const submitButton = e.submitter;
                if (submitButton) submitButton.setAttribute('disabled', 'true');

                try {
                    await request('POST', getEndpoint('NEWSLETTER'), formData).then(async response => {
                        if (typeof callback === 'function') {
                            try {
                                callback(response);
                                return;
                            } catch (error) {}
                        }

                        if (callback) return;

                        if (response.status) {
                            modal({
                                html: response.statusText,
                                width: '480px',
                                alert: true,
                                class: 'success',
                                iconHtml: `
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"/>
                                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686Z"/>
                                    </svg>
                                `,
                            });

                            for (let i=0; i < callbacks.customer.subscribe.length; i++){
                                if (typeof callbacks.customer.subscribe[i] === 'function'){
                                    try {
                                        callbacks.customer.subscribe[i]?.(response);
                                    } catch (error) { console.warn(`Customer Other Callback Error => ${error}`); }
                                }
                            }

                            form.reset();
                        } else {
                            popoverAlert({
                                selector: form.querySelector(`#${response.key}`) || form.querySelector('[name="email"]'),
                                message: response.statusText,
                            });
                        }
                    });
                } catch (error) {
                    console.warn(`NEWSLETTER error => ${error}`);
                } finally {
                    if (submitButton) submitButton.removeAttribute('disabled');
                }

                return;
            });

            form.componentNewsletter = 1;
        });
    },
    fastRegister: function() {
        const fastRegisters = document.querySelectorAll('[data-toggle="fast-register"]');
        Array.from(fastRegisters).forEach(form => {
            if (form.componentFastRegister == 1) return;
            if (form.tagName.toLowerCase() !== 'form') return;

            const notifys = form.querySelector('[name="notifys"]');
            const mail_notify = form.querySelector('[name="mail_notify"]');
            const sms_notify = form.querySelector('[name="sms_notify"]');
            const phone_notify = form.querySelector('[name="phone_notify"]');
            if (notifys) {
                notifys.addEventListener('change', e => {
                    if (mail_notify) mail_notify.checked = notifys.checked;
                    if (sms_notify) sms_notify.checked = notifys.checked;
                    if (phone_notify) phone_notify.checked = notifys.checked;
                });
            }

            form.addEventListener('submit', async e => {
                e.stopPropagation();
                e.preventDefault();

                popoverAlertHide(form);
                if (!checkValidity(form)) return;

                const formData = new FormData(form);
                const recaptchaResponse = formData.get('g-recaptcha-response');
                if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');                

                const phone = form.querySelector('[type="tel"]');
                if (phone?.dataset.key) formData.set('iso_code', phone.dataset.key.toLowerCase());

                formData.delete('notifys');

                const submitButton = e.submitter;
                if (submitButton) submitButton.setAttribute('disabled', 'true');

                loader(true);
                try {
                    await request('POST', getEndpoint('FAST_REGISTER'), formData).then(async response => {
                        if (response.status == 1) {
                            let url = response.url;
                            window.location.href = url;
                        } else {
                            await getCaptcha(form, response);

                            const field = response.field || response.key || '';
                            let selector = form.querySelector(`[name="${field == 'g-recaptcha-response' ? 'security_code' : field}"]`);
                            if (!response.statusText) return;
                            if (selector) {
                                popoverAlert({
                                    selector: selector,
                                    message: response.statusText,
                                });
                            } else {
                                notify({
                                    text: response.statusText,
                                    class: 'danger',
                                });
                            }
                        }
                    });
                } catch (error) {
                    console.warn(`FAST_REGISTER error => ${error}`);
                } finally {
                    await captchaReset(form);
                    if (submitButton) submitButton.removeAttribute('disabled');
                    loader();
                }
                return;
            });

            form.componentFastRegister = 1;
        });
    },
    login: function() {
        const logins = document.querySelectorAll('[data-toggle="login"]');
        Array.from(logins).forEach(form => {
            if (form.componentLogin == 1) return;
            if (form.tagName.toLowerCase() !== 'form') return;

            form.addEventListener('submit', async e => {
                e.stopPropagation();
                e.preventDefault();

                popoverAlertHide(form);

                const callback = form.dataset.callback;
                const formData = new FormData(form);

                let type = formData.get('type');

                const password = formData.get('password');
                let value = '';
                if (type == 'phone') {
                    value = formData.get('phone');
                    value = value.replaceAll(/\D/g, '');
                } else {
                    type = 'email';
                    value = formData.get('email');
                }

                if (value?.trim() == '' || password?.trim() == '') {
                    let selector = null;
                    if (value?.trim() == '') {
                        selector = form.querySelector(`[name="${type}"]`);
                    } else if (password?.trim() == '') {
                        selector = form.querySelector(`[name="password"]`);
                    }

                    if (selector) {
                        popoverAlert({
                            selector: selector,
                            message: COMMON_LANG?.form_required
                        });
                    }
                    return;
                }

                const recaptchaResponse = formData.get('g-recaptcha-response');
                if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');

                const popupLogin = formData.get('popup');

                formData.delete('email');
                formData.delete('phone');
                formData.delete('type');
                formData.delete('popup');

                const submitButton = e.submitter;
                if (submitButton) submitButton.setAttribute('disabled', 'true');

                const passwordData = {
                    'type': type,
                    'username': encodeURI(value),
                    'old_password': formData.get('password')
                }

                loader(true);
                try {
                    await request('POST', getEndpoint('LOGIN', `${type}/${encodeURI(value)}`), formData).then(async response => {
                        if (response.password_change) {
                            await loginPasswordChange(passwordData);
                            return;
                        }

                        if (response.status == 1) {
                            for(let i=0; i < callbacks.customer.login.length; i++){
                                if(typeof callbacks.customer.login[i] === 'function'){
                                    try {
                                        callbacks.customer.login[i]?.(response);
                                    } catch (error) { console.log(`Customer Login Callback Error => ${error}`); }
                                }
                            }
                        }

                        if (typeof callback === 'function') {
                            try {
                                callback(response);
                            } catch (error) {}
                        }

                        if (callback) return;

                        if (response.status == 1) {
                            if (response.statusText) {
                                notify({
                                    text: response.statusText,
                                });
                            }

                            if (popupLogin == 1 || PAGE_ID == '91') {
                                location.reload();
                                return;
                            }

                            let url = response.url;
                            if (PAGE_ID == '64') url = '/' + PAGE_LINK.ORDER;
                            if (form.dataset.successUrl) url = form.dataset.successUrl;
                            window.location.href = url;
                        } else {
                            await getCaptcha(form, response);

                            const field = response.field || response.key || '';
                            let selector = form.querySelector(`[name="${field == 'g-recaptcha-response' ? 'security_code' : field}"]`);
                            if (!response.statusText) return;
                            if (selector) {
                                popoverAlert({
                                    selector: selector,
                                    message: response.statusText,
                                });
                            } else {
                                notify({
                                    text: response.statusText,
                                    class: 'danger',
                                });
                            }
                        }
                    });
                } catch (error) {
                    console.warn(`LOGIN error => ${error}`);
                } finally {
                    await captchaReset(form);
                    if (submitButton) submitButton.removeAttribute('disabled');
                    setTimeout(() => {
                        loader();
                    }, 500);
                }
            });

            form.componentLogin = 1;
        });
    },
    otpLogin: {
        loginOtpPopup: async function(phone, ttl) {
            if (MEMBER_INFO.ID > 0) return;

            const modalLogin = document.querySelector('#modal-login-popup');
            if (modalLogin) {
                modalClose('#modal-login-popup');
            }

            await loadSnippet({
                snippet: '_login-otp-popup',
                params: {
                    include: 'customer-login',
                    phone: phone,
                    ttl: ttl,
                },
                success: function(loadRes){
                    modal({
                        id: 'modal-login-otp-popup',
                        width: '480px',
                        html: loadRes,
                    });
                    return;
                }
            });
        },
        getCode: async function(phone, formData) {
            const response = await request('POST', getEndpoint('OTP_REQUEST', `${phone}`), formData);
            return response;
        },
        otpRequest: async function() {
            const otpLogins = document.querySelectorAll('[data-toggle="otp-login"]');
            Array.from(otpLogins).forEach(form => {
                if (form.componentOtpLogin == 1) return;
                if (form.tagName.toLowerCase() !== 'form') return;

                form.addEventListener('submit', async e => {
                    e.stopPropagation();
                    e.preventDefault();

                    popoverAlertHide(form);

                    const formData = new FormData(form);

                    let phone = formData.get('otp');
                    phone = phone?.replaceAll(/\D/g, '');

                    if (phone?.trim() == '') {
                        const selector = form.querySelector(`[name="otp"]`);
                        if (selector) {
                            popoverAlert({
                                selector: selector,
                                message: COMMON_LANG?.form_required
                            });
                        }
                        return;
                    }

                    const recaptchaResponse = formData.get('g-recaptcha-response');
                    if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');

                    formData.delete('otp');

                    const submitButton = e.submitter;
                    if (submitButton) submitButton.setAttribute('disabled', 'true');
                    loader(true);

                    try {
                        const response = await components.otpLogin.getCode(phone, formData);
                        if (response.status == 1) {
                            if (response.statusText) {
                                notify({
                                    text: response.statusText,
                                });

                                await components.otpLogin.loginOtpPopup(phone, response.ttl || 120);
                            }
                        } else {
                            if (response.ttl) {
                                await components.otpLogin.loginOtpPopup(phone, response.ttl || 120);
                                return;
                            }

                            await getCaptcha(form, response);

                            const field = response.field || response.key || '';
                            let selector = form.querySelector(`[name="${field == 'g-recaptcha-response' ? 'security_code' : field}"]`);
                            if (!response.statusText) return;
                            if (selector) {
                                popoverAlert({
                                    selector: selector,
                                    message: response.statusText,
                                });
                            } else {
                                notify({
                                    text: response.statusText,
                                    class: 'danger',
                                });
                            }
                        }
                    } catch (error) {
                        console.warn(`OTP_REQUEST error => ${error}`);
                    } finally {
                        await captchaReset(form);
                        if (submitButton) submitButton.removeAttribute('disabled');
                        setTimeout(() => {
                            loader();
                            return;
                        }, 500);
                    }
                });

                form.componentOtpLogin = 1;
            });
        },
        otpValidate: async function() {
            const otpLogins = document.querySelectorAll('[data-toggle="otp-validate"]');
            Array.from(otpLogins).forEach(form => {
                if (form.componentOtpLogin == 1) return;
                if (form.tagName.toLowerCase() !== 'form') return;

                form.addEventListener('submit', async e => {
                    e.stopPropagation();
                    e.preventDefault();

                    popoverAlertHide(form);

                    const formData = new FormData(form);

                    let phone = formData.get('phone');
                    phone = phone?.replaceAll(/\D/g, '');

                    if (phone?.trim() == '') {
                        const selector = form.querySelector(`[name="phone"]`);
                        if (selector) {
                            popoverAlert({
                                selector: selector,
                                message: COMMON_LANG?.form_required
                            });
                        }
                        return;
                    }

                    const otp = formData.get('otp');
                    if (otp?.trim() == '' || otp?.length != 6 || form['otpControl'] == otp) {
                        return;
                    }

                    const recaptchaResponse = formData.get('g-recaptcha-response');
                    if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');

                    formData.delete('phone');
                    formData.delete('type');

                    const submitButton = e.submitter;
                    if (submitButton) submitButton.setAttribute('disabled', 'true');
                    loader(true);

                    try {
                        const response = await request('POST', getEndpoint('OTP_VALIDATE', `${phone}`), formData);
                        if (response.status == 1) {
                            if (PAGE_ID == '64' || PAGE_ID == '91') {
                                window.location.href = '/' + PAGE_LINK.ORDER;
                            } else if (PAGE_ID == 5) {
                                window.location.href = '/';
                            } else {
                                window.location.reload();
                            }
                        } else {
                            await getCaptcha(form, response);

                            const field = response.field || response.key || '';
                            let isCaptcha = false;
                            isCaptcha = field == 'security_code' || field == 'g-recaptcha-response';
                            if (!isCaptcha) form['otpControl'] = otp;

                            let selector = form.querySelector(`[name="${field == 'g-recaptcha-response' ? 'security_code' : field}"]`);
                            if (!response.statusText) return;
                            if (selector) {
                                popoverAlert({
                                    selector: selector,
                                    message: response.statusText,
                                });
                            } else {
                                notify({
                                    text: response.statusText,
                                    class: 'danger',
                                });
                            }
                        }
                    } catch (error) {
                        console.warn(`OTP_VALIDATE error => ${error}`);
                    } finally {
                        await captchaReset(form);
                        if (submitButton) submitButton.removeAttribute('disabled');
                        setTimeout(() => {
                            loader();
                        }, 500);
                    }
                });

                form.componentOtpLogin = 1;
            });
        },
        init: function() {
            components.otpLogin.otpRequest();
            components.otpLogin.otpValidate();
            return;
        }
    },
    nomembership: function() {
        const nomemberships = document.querySelectorAll('[data-toggle="nomembership"]');
        Array.from(nomemberships).forEach(form => {
            if (form.componentNomembership == 1) return;

            form.addEventListener('submit', async e => {
                e.stopPropagation();
                e.preventDefault();

                popoverAlertHide(form);

                const formData = new FormData(form);

                const recaptchaResponse = formData.get('g-recaptcha-response');
                if (recaptchaResponse != null && typeof grecaptcha !== 'undefined') formData.delete('security_code');

                const submitButton = e.submitter;
                if (submitButton) submitButton.setAttribute('disabled', 'true');

                loader(true);
                try {
                    await request('POST', getEndpoint('LOGIN_SHOPPING'), formData).then(async response => {
                        if (response.success) {
                            let url = response.url || '/' + PAGE_LINK.ORDER;
                            window.location.href = url;

                            for(let i=0; i < callbacks.customer.login.length; i++){
                                if(typeof callbacks.customer.login[i] === 'function'){
                                    try {
                                        callbacks.customer.login[i]?.(response);
                                    } catch (error) { console.log(`Customer Login Callback Error => ${error}`); }
                                }
                            }
                            if (typeof LoginPageTracking !== 'undefined') {
                                if(typeof LoginPageTracking.Callback === 'function'){
                                    try {
                                        LoginPageTracking.Callback(response);
                                    } catch (error) { console.log(`Customer Login LoginPageTracking Callback Error => ${error}`); }
                                }
                                for(let i = 0; i < LoginPageTracking.callbackArray.length; i++){
                                    if(typeof LoginPageTracking.callbackArray[i] === 'function'){
                                        try {
                                            LoginPageTracking.callbackArray[i]?.(response);
                                        } catch (error) { console.log(`Customer Login LoginPageTracking.callbackArray Callback Error => ${error}`); }
                                    }
                                }
                            }
                        } else if (response.message) {
                            await getCaptcha(form, response);

                            notify({
                                text: response.message,
                                class: 'danger',
                            });
                        }
                    });
                } catch (error) {
                    console.warn(`LOGIN_SHOPPING error => ${error}`);
                } finally {
                    await captchaReset(form);
                    if (submitButton) submitButton.removeAttribute('disabled');
                    loader();
                }
            });

            form.componentNomembership = 1;
        });
    },
    socialLogin: {
        getGoogleTokenClient: function() {
            try {
                if (googleTokenClient == null) {
                    googleTokenClient = google.accounts.oauth2.initTokenClient({
                        client_id: GOOGLE_CLIENT_ID,
                        scope: 'openid email profile',
                        callback: (response) => {
                            if (response.access_token) {
                                location.href = location.origin + `/srv/service/social/google/login?code=${response.access_token}`;
                            } else {
                                console.warn('Google Sign-In error:', response);
                            }
                            return;
                        },
                    });
                }
                googleTokenClient?.requestAccessToken();
            } catch (error) {
                console.warn('Google Sign-In error:', error);
            }
        },
        init: function() {
            const socials = document.querySelectorAll('[data-toggle="social-login"]');
            Array.from(socials).forEach(social => {
                if (social.componentSocialLogin == 1) return;

                social.addEventListener('click', e => {
                    e.preventDefault();

                    const platform = social.dataset.platform;
                    if (platform == 'facebook') {
                        window.location.href = getEndpoint('FACEBOOK_LOGIN');
                        return;
                    } else if (platform == 'google') {
                        components.socialLogin.getGoogleTokenClient();
                        return;
                    } else if (platform == 'apple') {
                        window.location.href = getEndpoint('APPLE_LOGIN');
                        return;
                    } else {
                        console.warn('platform undefined');
                    }
                    return;
                });

                social.componentSocialLogin = 1;
            });
        }
    },
    logout: function() {
        const logouts = document.querySelectorAll('[data-toggle="logout"]');
        Array.from(logouts).forEach(logout => {
            if (logout.componentLogout == 1) return;

            logout.addEventListener('click', e => {
                e.preventDefault();
                try {
                    request('GET', getEndpoint('LOGOUT')).then(response => {
                        window.location.href = '/';
                    });
                } catch (error) {
                    console.warn(`LOGOUT error => ${error}`);
                }
                return;
            });

            logout.componentLogout = 1;
        });
    },
    isRequired: function() {
        const requireds = document.querySelectorAll('.required');
        setTimeout(() => {
            Array.from(requireds).forEach(required => {
                if (required.componentIsRequired == 1) return;

                const placeholder = required.getAttribute('placeholder');
                if (placeholder) required.placeholder = placeholder + ' *';

                const formLabel = required.nextElementSibling;
                if (formLabel?.classList.contains('form-label')) {
                    formLabel.innerHTML = `${formLabel.innerHTML} <span class="form-required">&nbsp;*</span>`;
                }
                required.componentIsRequired = 1;
            });
        }, 250);
    },
    personalization: {},
    imageMap: function() {
        const imageMaps = document.querySelectorAll(`[data-toggle="image-map"]`);
        Array.from(imageMaps).forEach(map => {
            if (map.componentImageMap == 1) return;

            map.addEventListener('click', function (e) {
                let xPercent = Math.round((e.offsetX / this.clientWidth) * 100);
                let yPercent = Math.round((e.offsetY / this.clientHeight) * 100);
                let copyText = `${xPercent}|${yPercent}`;
                copyText(copyText, `${copyText} ${COMMON_LANG?.copied}`);
                return;
            });

            map.componentImageMap = 1;
        });
    },
    lazyLoadedBg: function() {
        const images = document.querySelectorAll('[data-style]');
        Array.from(images).forEach(img => {    
            lazyLoadedBg(img);
        });
        return;
    },
    productLink: function() {
        const products = document.querySelectorAll('[data-toggle="product-url"]');
        Array.from(products).forEach((p, index) => {
            if (p.componentProductLink == 1) return;

            for(let i=0; i < callbacks.product.click.length; i++){
                if(typeof callbacks.product.click[i] === 'function'){
                    try {
                        callbacks.product.click[i]?.(index, p);
                    } catch (error) { console.warn(`Product Click Callback Error => ${error}`); }
                    return;
                }
            }

            p.componentProductLink = 1;
        });    
    },
    addClass: function() {
        const addClasses = document.querySelectorAll('[data-toggle="add-class"]');
        Array.from(addClasses).forEach(cls => {
            if (cls.componentAddClass == 1) return;

            const elements = cls.dataset.elements;
            const classNames = cls.dataset.class;
            if (!elements || !classNames) return;

            const trimElements = elements.trim();
            const arrElements = trimElements.split(/\s*,\s*/);

            if (!arrElements.length) return;

            cls.addEventListener('click', e => {
                Array.from(arrElements).forEach(item => {
                    item = document.querySelectorAll(item);
                    addClass(item, classNames);
                });
            });

            cls.componentAddClass = 1;
        });
    },
    removeClass: function() {
        const removeClasses = document.querySelectorAll('[data-toggle="remove-class"]');
        Array.from(removeClasses).forEach(cls => {
            if (cls.componentRemoveClass == 1) return;

            const elements = cls.dataset.elements;
            const classNames = cls.dataset.class;
            if (!elements || !classNames) return;

            const trimElements = elements.trim();
            const arrElements = trimElements.split(/\s*,\s*/);

            if (!arrElements.length) return;

            cls.addEventListener('click', e => {
                Array.from(arrElements).forEach(item => {
                    item = document.querySelectorAll(item);
                    removeClass(item, classNames);
                });
            });

            cls.componentRemoveClass = 1;
        });
    },
    toggleClass: function() {
        const toggleClasses = document.querySelectorAll('[data-toggle="toggle-class"]');
        Array.from(toggleClasses).forEach(cls => {
            if (cls.componentToggleClass == 1) return;

            const elements = cls.dataset.elements;
            const classNames = cls.dataset.class;
            if (!elements || !classNames) return;

            const trimElements = elements.trim();
            const arrElements = trimElements.split(/\s*,\s*/);

            if (!arrElements.length) return;

            cls.addEventListener('click', e => {
                Array.from(arrElements).forEach(item => {
                    item = document.querySelectorAll(item);
                    toggleClass(item, classNames);
                });
            });

            cls.componentToggleClass = 1;
        });
    },
    readMore: function() {
        const readMores = document.querySelectorAll('[data-toggle="read-more"]');
        Array.from(readMores).forEach(element => {
            if (element.componentReadMore == 1) return;
            element.componentReadMore = 1;

            const height = Number.parseFloat(element.dataset.height) || 150;
            if (element.scrollHeight <= height) return;

            const moreText = element.dataset.moreText || COMMON_LANG.read_more;
            const lessText = element.dataset.lessText || COMMON_LANG.less_more;

            element.style.maxHeight = 'none';
            element.style.height = 'auto';

            const content = document.createElement('div');
            content.style.maxHeight = `${height}px`;
            content.style.overflow = 'hidden';
            content.style.position = 'relative';
            content.style.transition = 'max-height 0.3s ease-in-out';
            content.dataset.qa = 'read-more-content';
            content.innerHTML = element.innerHTML;
            element.innerHTML = '';
            element.appendChild(content);

            const overlay = document.createElement('div');
            overlay.innerHTML = '...';
            overlay.className = 'shadow-[inset_0_-30px_20px_0px_rgba(255,255,255,1)] absolute start-0 end-0 bottom-0 h-14 pointer-events-none flex items-end';
            overlay.dataset.qa = 'read-more-overlay';
            content.appendChild(overlay);

            const button = document.createElement('button');
            button.className = 'font-semibold underline mt-4';
            button.textContent = moreText;
            button.dataset.qa = 'read-more-button';
            button.addEventListener('click', function() {
                element.classList.toggle('active');
                if (element.classList.contains('active')) {
                    content.style.maxHeight = '5000px';
                    overlay.style.display = 'none';
                    button.textContent = lessText;
                } else {
                    content.style.maxHeight = `${height}px`;
                    overlay.style.display = 'flex';
                    button.textContent = moreText;

                    if (element.offsetTop + window.scrollY > window.innerHeight) {
                        setTimeout(() => {
                            scroll({
                                top: element.offsetTop - HEADER_STICKY_HEIGHT - 100,
                                behavior: "smooth"
                            });
                        }, 100);
                    }
                }
            });
            element.appendChild(button);
        });
    },
    setupImageTracking: {
        SETUP_IMAGE_TIMEOUT: 7000,
        isSvg(src) {
            if (!src) return true;
            return (
                src.endsWith('.svg') ||
                src.includes('.svg?') ||
                src.startsWith('data:image/svg')
            );
        },
        triggerFallback(img, src) {
            if (img.dataset.fallbackProcessed) return;
            img.dataset.fallbackProcessed = 'true';

            const fallbackSrc = src.replace(/(?:https?:)?\/\/[^/]+/i, `${location.protocol}//${location.hostname}`);

            if (img.dataset.src) {
                img.dataset.src = fallbackSrc;
                setTimeout(() => {
                    if (img.src != fallbackSrc) img.src = fallbackSrc;
                }, 100);
            } else {
                img.src = fallbackSrc;
            }

            const imgPicture = img.closest('picture');
            if (imgPicture) {
                const imgSource = imgPicture.querySelector('source');
                if (imgSource) {
                    const srcset = imgSource.srcset;
                    const fallbackSrcset = srcset.replace(/(?:https?:)?\/\/[^/]+/i, `${location.protocol}//${location.hostname}`);
                    imgSource.srcset = fallbackSrcset;
                }
            }
        },
        trackImage(img, src) {
            if (window.location.hostname === 'local.tsoft.biz') return;
            if (!src || !src.includes('witcdn.') || components.setupImageTracking.isSvg(src)) return;

            const timer = setTimeout(() => {
                if (!img.complete || img.naturalWidth === 0) {
                    components.setupImageTracking.triggerFallback(img, src);
                }
            }, components.setupImageTracking.SETUP_IMAGE_TIMEOUT);

            img.addEventListener('load', () => {
                if (img.naturalWidth === 0) {
                    components.setupImageTracking.triggerFallback(img, src);
                }
                clearTimeout(timer);
            }, { once: true });

            img.addEventListener('error', () => {
                components.setupImageTracking.triggerFallback(img, src);
                clearTimeout(timer);
            }, { once: true });

            if (img.complete && img.naturalWidth === 0) {
                clearTimeout(timer);
                components.setupImageTracking.triggerFallback(img, src);
            }
        },
        init() {
            document.querySelectorAll('img').forEach(img => {
                const src = img.src;
                const dataSrc = img.dataset.src;

                if (dataSrc || img.classList.contains('lazyload')) return;
                components.setupImageTracking.trackImage(img, src);
            });
        }
    },
    sort: function() {
        const sorts = document.querySelectorAll('[data-toggle="sort"]');
        Array.from(sorts).forEach(sort => {
            if (sort.componentSort == 1) return;
            sort.componentSort = 1;

            let event = 'click';
            if (sort.tagName == 'SELECT') event = 'change';

            sort.addEventListener(event, e => {
                e.preventDefault();
                const sortValue = sort.dataset.sort ?? sort.value ?? '0';
                window.location.href = getLink('sort', sortValue == '0' ? '' : sortValue);
                return;
            });
        });
    },
    layout: function() {
        const layouts = document.querySelectorAll('[data-toggle="layout"]');
        Array.from(layouts).forEach(layout => {
            if (layout.componentLayout == 1) return;
            layout.componentLayout = 1;

            let event = 'click';
            if (layout.tagName == 'SELECT') event = 'change';

            layout.addEventListener(event, e => {
                e.preventDefault();
                const layoutValue = layout.dataset.layout ?? layout.value ?? '';
                if (layoutValue == '') return;

                setCookie('selected_layout', layoutValue);
                location.reload();
            });
        });
    },
    videoPlay: {
        play: function(embed) {
            /* YouTube */
            if (embed.src.includes('youtube.com')) {
                if (!embed.src.includes('autoplay=1')) {
                    embed.src += (embed.src.includes('?') ? '&' : '?') + 'autoplay=1&mute=1&controls=0&loop=1&showinfo=0&rel=0';
                }
            }
            /* Vimeo */
            else if (embed.src.includes('vimeo.com')) {
                if (!embed.src.includes('autoplay=1')) {
                    embed.src += (embed.src.includes('?') ? '&' : '?') + 'autoplay=1&muted=1&controls=0&background=1&loop=1';
                }
            }
            /* HTML5 */
            else if (embed.tagName.toLowerCase() === 'video') {
                embed.muted = true;
                embed.controls = false;
                embed.loop = true;
                embed.play();
            }
            return;
        },
        init: function() {
            const videos = document.querySelectorAll('[data-toggle="video-play"]');
            Array.from(videos).forEach(video => {
                if (video.componentVideoPlay == 1) return;
                video.componentVideoPlay = 1;

                const targetEmbed = video.dataset.targetEmbed;
                if (!targetEmbed) return;

                const videoEmbedEl = video.querySelector(targetEmbed);
                if (!videoEmbedEl) return;

                const embed = videoEmbedEl?.querySelector('iframe') || videoEmbedEl?.querySelector('video');
                if (!embed) return;

                const targetButton = video.dataset.targetButton;
                if (targetButton) {
                    const videoButtonEl = video.querySelector(targetButton);
                    if (videoButtonEl) {
                        videoButtonEl.addEventListener('click', e => {
                            e.preventDefault();
                            video.classList.add('active');
                            components.videoPlay.play(embed);
                        });
                    }
                } else {
                    components.videoPlay.play(embed);
                }
            });
        }
    },
    callbacks: [],
    init: function(callback) {
        setTimeout(() => {
            for (let i in components) {
                if (i == 'init') {
                    if (callback && typeof callback == 'function') callback();
                    return;
                };

                if (typeof components[i] == 'function') {
                    components[i]();
                } else if (typeof components[i].init == 'function') {
                    components[i].init();
                } else if (i == 'callbacks') {
                    for (let j in components.callbacks) {
                        if (typeof components.callbacks[j] == 'function') {
                            components.callbacks[j]();
                        }
                    }
                }
            }
        }, 1);
    },
}

const onMessageEvents = () => {
    const isAllowedOrigin = (origin) => {
        const ALLOWED_BASE_DOMAINS = ['paneltsoft.com', 'tsoftpanel.com'];

        try {
            const url = new URL(origin);
            return ALLOWED_BASE_DOMAINS.some(d =>url.hostname === d || url.hostname.endsWith(`.${d}`));
        } catch {
            return false;
        }
    }

    window.addEventListener('message', function(m) {
        if (!isAllowedOrigin(m.origin)) return;

        try {
            let resp = JSON.parse(m.data);
            if (!resp.action || !resp.value) {
                return false
            }
            switch(resp.action) {
                case  'scroll':
                    document.getElementById(resp.value).scrollIntoView({behaviour: "smooth",block : "start"});
                    break;
                default :
                    break;
            }
        } catch(e) {
            return false;
        }
    })
}

document.addEventListener('lazyloaded', e => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;

    const src = img.dataset.src;
    setTimeout(() => {
        components.setupImageTracking.trackImage(img, src);
    }, 100);
});

document.addEventListener('DOMContentLoaded', async function() {
    if (PAGE_ID == 1) appMobile();
    await components.init();
    await productLoader();
    getPluginsPopup();
    await messageCount();
    await queryControl();
    await memberKvkkControl();
    await passwordStrengthControl();
    onPageReady();

    window.addEventListener('scroll', lazyLoadedBg, false);
    refererStorage.addItem();

    onMessageEvents();
});
