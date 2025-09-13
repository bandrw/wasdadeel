export const requestClipboardReadAccess = async () => {
    const state = await navigator.permissions
        .query({name: 'clipboard-read' as PermissionName})
        .then((result) => result.state);
    return state === 'granted' || state === 'prompt';
};

export const getClipboardItemsAsDataTransfer = async (): Promise<DataTransfer> => {
    const dataTransfer = new DataTransfer();

    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
            const blob = await clipboardItem.getType(type);
            if (blob !== null) {
                const data = await blob.text();
                dataTransfer.items.add(data, type);
            }
        }
    }

    return dataTransfer;
};

export const fallbackCopyTextToClipboard = (text: string, styled?: boolean) => {
    const textArea = document.createElement('textarea');
    if (styled) {
        textArea.innerHTML = text;
    } else {
        textArea.value = text;
    }

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error(err);
    }

    document.body.removeChild(textArea);
};

export const copyToClipboard = async ({textHtml, textPlain}: {textHtml?: string; textPlain: string}) => {
    if (navigator.clipboard) {
        const htmlType = 'text/html';
        const plainType = 'text/plain';

        const data = new ClipboardItem({
            [plainType]: new Blob([textPlain], {type: plainType}),
            ...(textHtml !== undefined ? {[htmlType]: new Blob([textHtml], {type: htmlType})} : {}),
        });
        await navigator.clipboard.write([data]);
    } else {
        fallbackCopyTextToClipboard(textPlain);
    }
};
