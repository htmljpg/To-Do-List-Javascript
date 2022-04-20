import $ from '../base';

$.alert = function(options) {
    return new Promise((resolve) => {
        const modal = $.modal({
            modalName: 'alert',
            title: options.title,
            width: '400px',
            closable: false,
            content: options.content,
            onClose() {
                modal.destroy();
            },
            footerButtons: [
                {text: 'OK', type: 'primary', handler() {
                    modal.close();
                    resolve();
                }},
            ]
        });

        setTimeout(() => {
            modal.open();
        }, 100);
    });
}