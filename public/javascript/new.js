/*jshint esversion: 8 */
let editor
let saveButton = document.getElementById('saveArticle')

ClassicEditor
    .create(document.querySelector('.editor'), {
        toolbar: {
            items: [
                'heading',
                '|',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'alignment',
                '|',
                'indent',
                'outdent',
                '|',
                'horizontalLine',
                'imageUpload',
                'blockQuote',
                'code',
                'codeBlock',
                '|',
                'fontFamily',
                'fontSize',
                'fontColor',
                'fontBackgroundColor',
                'removeFormat',
                '|',
                'insertTable',
                'highlight',
                'MathType',
                'ChemType',
                '|',
                'undo',
                'redo'
            ]
        },
        language: 'en',
        image: {
            toolbar: [
                'imageTextAlternative',
                'imageStyle:full',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells',
                'tableCellProperties',
                'tableProperties'
            ]
        },
        licenseKey: '',

    })
    .then(newEditor => {
        editor = newEditor
    })
    .catch(error => {
        console.error('Oops, something gone wrong!')
        console.error('Please, report the following error in the https://github.com/ckeditor/ckeditor5 with the build id and the error stack trace:')
        console.warn('Build id: hn4qw6vrrbar-3qtv8qgxalyr')
        console.error(error)
    })

saveButton.addEventListener('click', () => {
    const idRegExp = /[A-Za-z0-9]+/
    const titleRegExp = /^<h1>(&nbsp;|\s)+<\/h1>/
    let editorData = {}
    editorData.content = editor.getData()
    if (editorData.content.length != 0 && titleRegExp.test(editorData.content) == false) {
        saveButton.disabled = true
        let tmp = document.createElement("DIV")
        tmp.innerHTML = editorData.content
        editorData.preview = (tmp.textContent || tmp.innerText).substr(0, 1024)
        editorData.title = tmp.querySelector('h1').textContent

        let xhr = new XMLHttpRequest()
        let url = ""
        xhr.open("POST", url, true)
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (idRegExp.test(xhr.responseText)) {
                    window.location.replace(window.location.href.replace('new', '') + '/' + xhr.responseText)
                }
            }
        }
        let stringData = JSON.stringify(editorData)
        xhr.send(stringData)
    } else {
        document.getElementById('error').style.display = 'inline'
        document.getElementById('error').style.color = 'red'
    }
})