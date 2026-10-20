<#--This is a simple, generated example for testing purposes. It is recommended to create a HTML when implementing-->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
            crossorigin="anonymous"></script>
    <title>Public Task - Form Submission Example</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f4f7f6;
        }

        #formio {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .formio-component input, .formio-component select, .formio-component textarea, .formio-component button {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            margin-bottom: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .formio-component button {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        .formio-component button:hover {
            background-color: #0056b3;
        }

        /* Form.io's own wording is collapsed rather than removed, so it stays there for a screen reader. */
        .formio-component-file .fileSelector {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 140px;
            padding: 24px;
            border: 2px dashed #adb5bd;
            border-radius: 8px;
            background-color: #fbfcfc;
            cursor: pointer;
            font-size: 0;
        }

        .formio-component-file .fileSelector::after {
            content: 'Click here to upload a file';
            font-size: 1rem;
            color: #495057;
        }

        .formio-component-file .fileSelector:hover,
        .formio-component-file .fileSelector.drop-target {
            border-color: #007bff;
            background-color: #f0f7ff;
        }

        /* Form.io emits Bootstrap 4's .sr-only, which Bootstrap 5 renamed and no longer styles. */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* Form.io draws both remove buttons as an empty Font Awesome <i>; this page loads no icon font. */
        .formio-component-file [ref="removeLink"],
        .formio-component-file [ref="fileStatusRemove"] {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 4px;
            cursor: pointer;
            color: #b02a37;
            font-style: normal;
        }

        .formio-component-file [ref="removeLink"]::before,
        .formio-component-file [ref="fileStatusRemove"]::before {
            content: '\2715';
            font-size: 1rem;
            line-height: 1;
        }

        .formio-component-file [ref="removeLink"]:hover,
        .formio-component-file [ref="fileStatusRemove"]:hover,
        .formio-component-file [ref="removeLink"]:focus,
        .formio-component-file [ref="fileStatusRemove"]:focus {
            background-color: #f8d7da;
        }

        /* A refused file was not added, so everything but the reason and its dismiss button is collapsed. */
        .formio-component-file .file:has(.alert-danger) {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            padding: 10px 12px;
            border-radius: 8px;
            background-color: #f8d7da;
            color: #842029;
        }

        .formio-component-file .file:has(.alert-danger) > .row {
            margin: 0;
        }

        /* The reason, which names the type the file turned out to be. */
        .formio-component-file .file:has(.alert-danger) > .row:last-child {
            order: 1;
            flex: 1 1 auto;
            min-width: 0;
        }

        /* The line Form.io puts the name and size on. Only the remove button inside it is kept. */
        .formio-component-file .file:has(.alert-danger) > .row:first-child {
            order: 2;
            flex: 0 0 auto;
        }

        .formio-component-file .file:has(.alert-danger) .fileName {
            flex: 0 0 auto;
            width: auto;
            max-width: none;
            padding: 0;
            font-size: 0;
        }

        .formio-component-file .file:has(.alert-danger) .fileSize {
            display: none;
        }

        .formio-component-file .file:has(.alert-danger) .col-sm-12 {
            padding: 0;
        }

        .formio-component-file .file:has(.alert-danger) .alert {
            margin: 0;
            padding: 0;
            border: 0;
            background: none;
            color: inherit;
        }

        .formio-component-file .file:has(.alert-danger) [ref="fileStatusRemove"] {
            color: #842029;
        }

        .formio-component-file .file:has(.alert-danger) [ref="fileStatusRemove"]:hover,
        .formio-component-file .file:has(.alert-danger) [ref="fileStatusRemove"]:focus {
            background-color: #f1aeb5;
        }

        /* Until a file has been added the list is a column heading and nothing else. */
        .formio-component-file .list-group:not(:has(.list-group-item:not(.list-group-header))) {
            display: none;
        }
    </style>
</head>
<body>
<div id="form" class="d-block"></div>
<div id="result" class="d-none"></div>
<#--
    The form definition is emitted as a data block instead of as a JavaScript literal, so that its content is never
    parsed as script. HTML escaping would be the wrong escaping here - the content of a script element is raw text,
    where entities are not decoded - so the value is marked as no_esc and encoded for this context instead: in JSON a
    '<' can only occur inside a string literal, where "\u003C" means exactly the same thing. Replacing every '<'
    therefore keeps the JSON intact while removing every sequence ("</script", "<!--") that the HTML parser acts on.
-->
<script id="form-io-form" type="application/json">${form_io_form?replace("<", "\\u003C")?no_esc}</script>
<#-- Pinned and hash-checked: the styling and handlers below are written against this version's markup. -->
<script src="https://cdn.form.io/formiojs/4.21.2/formio.full.min.js"
        integrity="sha384-Q+yRyzKADqNS06v+pmu7ctHtGiKGZgFIz5vOZURxbwrsVjKXKLIw/3f6h2a7UURH"
        crossorigin="anonymous"></script>
<script>
    const formContainer = document.getElementById('form');
    const resultContainer = document.getElementById('result');
    const formJson = JSON.parse(document.getElementById('form-io-form').textContent);

    <#-- js_string, not the default HTML escaping: these values sit in JavaScript string literals. -->
    const attachmentUrl = '${public_task_attachment_url?js_string?no_esc}';
    const maxAttachmentSizeInBytes = ${max_attachment_size_in_bytes?c};

    // Upload target from this closure, not the component: the definition must not redirect the file.
    function publicTaskStorage(formio) {
        return {
            title: 'Public task',
            name: 'publicTask',
            uploadFile: function (file, fileName, dir, progressCallback, url, options, fileKey,
                                  groupPermissions, groupId, abortCallback) {
                if (file.size > maxAttachmentSizeInBytes) {
                    return Promise.reject('This file is larger than the maximum of ' + maxAttachmentSizeInBytes + ' bytes');
                }
                // Which field this file was chosen in; put in the component by the server.
                const componentKey = options && options.componentKey;
                return new Promise(function (resolve, reject) {
                    const request = new XMLHttpRequest();
                    if (typeof progressCallback === 'function') {
                        request.upload.onprogress = progressCallback;
                    }
                    if (typeof abortCallback === 'function') {
                        abortCallback(function () {
                            request.abort();
                        });
                    }
                    request.onload = function () {
                        if (request.status >= 200 && request.status < 300) {
                            try {
                                // The response is the value this file takes in the submission.
                                resolve(JSON.parse(request.responseText));
                            } catch (e) {
                                reject('The upload could not be processed');
                            }
                        } else {
                            reject(request.responseText || 'The file could not be uploaded');
                        }
                    };
                    request.onerror = function () {
                        reject('The file could not be uploaded');
                    };
                    request.onabort = function () {
                        reject('The upload was cancelled');
                    };
                    const body = new FormData();
                    body.append('file', file, fileName);
                    if (typeof componentKey === 'string') {
                        body.append('componentKey', componentKey);
                    }
                    request.open('POST', attachmentUrl);
                    request.send(body);
                });
            },
            // Nothing is served back, so there is nothing to download or delete.
            downloadFile: function (file) {
                return Promise.resolve(file);
            },
            deleteFile: function () {
                return Promise.resolve();
            }
        };
    }

    Formio.Providers.addProvider('storage', 'publicTask', publicTaskStorage);

    // Form.io binds only to the drop area, so events anywhere in the field are forwarded to it.
    const UPLOAD_FIELD = '.formio-component-file';
    const DROP_AREA = '.fileSelector';
    // Added files and the row a failed upload leaves behind; both carry their own remove button.
    const FILE_LIST = '.list-group, .file';

    // The upload field the event happened in, or null when it is not accepting files: full, or read only.
    function uploadFieldFor(event) {
        if (!(event.target instanceof Element)) {
            return null;
        }
        const field = event.target.closest(UPLOAD_FIELD);
        return field && field.querySelector(DROP_AREA) ? field : null;
    }

    formContainer.addEventListener('click', function (event) {
        const field = uploadFieldFor(event);
        // The browse link must not be forwarded to itself.
        if (!field || event.target.closest(FILE_LIST) || event.target.closest('[ref="fileBrowse"]')) {
            return;
        }
        const browse = field.querySelector('[ref="fileBrowse"]');
        if (browse) {
            event.preventDefault();
            browse.click();
        }
    });

    ['dragover', 'dragleave', 'drop'].forEach(function (type) {
        formContainer.addEventListener(type, function (event) {
            const field = uploadFieldFor(event);
            // Form.io already sees the drop area itself, including the drop re-dispatched onto it below.
            if (!field || event.target.closest(DROP_AREA)) {
                return;
            }
            event.preventDefault();
            const dropArea = field.querySelector(DROP_AREA);
            dropArea.classList.toggle('drop-target', type === 'dragover');
            if (type === 'drop') {
                dropArea.dispatchEvent(
                    new DragEvent('drop', {dataTransfer: event.dataTransfer, bubbles: false})
                );
            }
        });
    });

    Formio.createForm(formContainer, formJson).then(function (form) {
        form.on('submit', function (submission) {
            console.debug('Form submitted', submission);
            <#-- js_string, not the default HTML escaping: this value sits in a JavaScript string literal. -->
            fetch('${public_task_url?js_string?no_esc}', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission.data)
            })
                .then(async response => {
                    console.debug('Response', response);
                    // get response body
                    const data = await response.text();
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = data || response.status;
                        return Promise.reject(error);
                    }
                    // hide form
                    formContainer.classList.remove('d-block');
                    formContainer.classList.add('d-none');
                    // show submission result
                    resultContainer.innerHTML = data;
                    resultContainer.classList.remove('d-none');
                    resultContainer.classList.add('d-block');
                })
                .catch(error => {
                    console.error('Error:', error)
                });
            // Prevent the default form submission behavior
            return false;
        });
    });
</script>
</body>
</html>
