const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('.btn');
const formCatAdd = document.querySelector('#popup-form-add');

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');


// сериализация формы
function serializeForm(elements) {
    const formData = {};

    elements.forEach(input => {
        if(input.type === 'submit' || input.type === 'button' ) {return}
        if(input.type === 'checkbox') {
            formData[input.name] = input.checked;
            console.log(input.checked)
        }
        if(input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    })
    return formData;
}

// 
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];// получаем поля(ключи) из псевдомассива
    const formData = serializeForm(elementsFormCat); //получаем данные из формы 

    const newElement = new Card(formData, '#card-template', handleClickCatImage);
    cardsContainer.prepend(newElement.getElement());

    popupAdd.close()
}
// связываем классы и открываем большую картинку при клике по котику
function handleClickCatImage(dataSrc){
    popupImage.open(dataSrc)
}


// обработка события отправки формы submit

formCatAdd.addEventListener('submit', handleFormAddCat)

btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open()
})

// вызываем экземпляр класса на каждом элементе массива
cats.forEach(catData => {
    const newElement = new Card(catData, '#card-template', handleClickCatImage);
    cardsContainer.append(newElement.getElement())
})
popupAdd.setEventListener();
popupImage.setEventListener();



// const template = document.querySelector('#card-template');
// const newCatElement = template.content.querySelector('.card');
// cardsContainer.append(newCatElement) // методы append/prepend добавляют только 1 элемент
// cardsContainer.append(newCatElement.cloneNode(true)) //клонируем ноду и добавляем на страницу несколько элементов. Аргумент 'true' позволяет скопировать не только верхний уровень, но и все дочерние элементы







