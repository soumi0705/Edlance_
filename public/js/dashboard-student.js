/*
Tesseract.recognize(
    'https://tesseract.projectnaptha.com/img/eng_bw.png',
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  })

*/
//Team-Nuvs

function ocr(img) {

    var reader = new FileReader()
    reader.readAsDataURL(img)
    console.log(reader);
    reader.onload = function(e) {
        Tesseract.recognize(
                e.target.result,
                'eng', { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                console.log(text);
                buttonAsk.disable = true
                textareaQuestion.placeholder = "Post Your Question!"

                return textareaQuestion.value = text

            })
            // console.log(e.target.result);
    }

}

const textareaQuestion = document.querySelector('#textareaQuestion')
const buttonAsk = document.querySelector('#buttonAsk')
const imageButton = document.querySelector('#imageButton')
const inputUpload = document.querySelector("#inputUpload")
imageButton.addEventListener('click', (event) => {
    buttonAsk.disable = true
    console.log("image btn");
    inputUpload.click()
    inputUpload.addEventListener('change', (e) => {
        textareaQuestion.placeholder = "loading..."
        ocr(inputUpload.files[0])
    })
})