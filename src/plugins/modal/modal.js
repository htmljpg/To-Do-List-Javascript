import $ from '../base';

Element.prototype.appendAfter = function(element) {
    element.parentNode.insertBefore(this, element.nextSibling);
};

function noop() {};

function _footerCreateModal(buttons = []) {
    if (buttons.length === 0) {
        return document.createElement('div');
    }

    const wrap = document.createElement('div');
    wrap.classList.add('modal-footer');

    buttons.forEach(btn => {
        const $btn = document.createElement('button');
        $btn.textContent = btn.text;
        $btn.classList.add('btn');
        $btn.classList.add(`btn-${btn.type || 'secondary'}`);
        $btn.onclick = btn.handler || noop;
        btn.submitForm ? $btn.setAttribute('form', btn.submitForm) : '';

        wrap.appendChild($btn);
    });

    return wrap;
}

function _creatModal({ title, closable, content, width, footerButtons }) {
    const DEFAULT_WIDTH = '200px';
    const modal = document.createElement('div');
    modal.classList.add('vmodal');
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-overlay">
            <div class="modal-wrapper" data-close="true">
                <div class="modal-window" style="width: ${width || DEFAULT_WIDTH};">
                    <div class="modal-header">
                        <span class="modal-title">${title || 'Modal title'}</span>
                        ${closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
                    </div>
                    <div class="modal-body" data-content>
                        ${content || ''}
                    </div>
                </div>
            </div>
        </div>
    `);

    const footer = _footerCreateModal(footerButtons);
    footer.appendAfter(modal.querySelector('[data-content]'));

    document.body.appendChild(modal);
    return modal;
}

$.modal = function(options) {
    const ANIMATION_SPEED = 200;
    const $modal = _creatModal(options);
    let closing = false;
    let destroyed = false;
    
    let footerBtnOKHandler = new Function;
    if (options.modalName === 'alert' && options.footerButtons.type === 'primary') {
        footerBtnOKHandler = options[footerButtons][handler];
    }

    console.log('options', options);
    
    

    const modal = {
        open() {
            if (destroyed) {
                return console.log('Modal is destroyed');
            }
            !closing && $modal.classList.add('open');
            return true;
        },
        close() {
            $modal.classList.remove('open');
            $modal.classList.add('hide');
            closing = true;

            setTimeout(() => {
                $modal.classList.remove('hide');
                closing = false;
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
            }, ANIMATION_SPEED);
            return true;
        }
    };

    const listener = event => {
        if (event.target.dataset.close === 'true') {
            modal.close();
            footerBtnOKHandler();
        }
    }

    $modal.addEventListener('click', listener);

    return Object.assign(modal, {
        destroy() {
            $modal.remove();
            $modal.removeEventListener('click', listener);
            destroyed = true;
        },
        setContent(html) {
            $modal.querySelector('[data-content]').innerHTML = html;
        }
    });
};