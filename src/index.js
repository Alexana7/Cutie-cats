import { PopupWithImage } from "./popup-image.js";
import { Popup } from "./popup.js";
import { api } from "./api.js";
import { Card } from "./card.js"


const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('#add');
const btnOpenPopupLogin = document.querySelector('#login');
const COOKIE_EXPIRES = 7;
const MAX_LIVE_STORAGE = 10;

const formCatAdd = document.querySelector('#popup-form-add');
const formLogin = document.querySelector('#popup-form-login');
const isAuth = Cookies.get('email');

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');
const popupLogin = new Popup('popup-login');


// сериализация формы
function serializeForm(elements) {
    const formData = {};

    elements.forEach(input => {
        if(input.type === 'submit' || input.type === 'button' ) return;
        if(input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if(input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    })
    return formData;
}

// создание карточки кота

function createCat(dataCat)  {
    const newElement = new Card(dataCat, '#card-template', handleClickCatImage);
    cardsContainer.prepend(newElement.getElement());
}

// создание карточки
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];// получаем поля(ключи) из псевдомассива
    const formData = serializeForm(elementsFormCat); //получаем данные из формы 

    api.addNewCat(formData)
        .then(function() {
            createCat(formData);
            updateLocalStorage(formData, {type: 'ADD_CAT'});
            popupAdd.close();
            })
        .catch(function(err){
            console.log(err)
        })    
}
// связываем классы и открываем большую картинку при клике по котику
function handleClickCatImage(dataSrc){
    popupImage.open(dataSrc);
}

// обработка формы авторизации

function handleFormLogin(e){
    e.preventDefault();
    const elementFormLogin = [...formLogin.elements];// получаем поля(ключи) из псевдомассива
    const formData = serializeForm(elementFormLogin); //получаем данные из формы 
    Cookies.set('email', formData.email, {expires: COOKIE_EXPIRES});
    btnOpenPopup.classList.remove('visually-hidden');
    btnOpenPopupLogin.classList.add('visually-hidden');
    popupLogin.close();
} 


btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open()
});
btnOpenPopupLogin.addEventListener('click', (e) => {
    e.preventDefault();
    popupLogin.open()
});


// оптимизация запросов к серверу
function setDataRefresh(minute, key) {
    const setTime = new Date(new Date().getTime() + minute*60000);
    localStorage.setItem(key, setTime);
    return setTime;
}
function updateLocalStorage(data, action) {
    const oldStorage = JSON.parse(localStorage.getItem('cats'));
    
    switch (action.type) {
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(oldStorage));
            return;    
        case 'ALL_CATS':
            setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
            localStorage.setItem('cats', JSON.stringify(data));
            return; 
        default:
            break;       
    }
}
// обновляем локальное хранилище
function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getExpiresTime = localStorage.getItem('catsRefresh')

    if(localData && localData.length && new Date() < new Date(getExpiresTime)){
        localData.forEach((catData) => {
        createCat(catData);
    });
    } else {        
        api.getAllCats()
            .then(dataCats => {
            // вызываем экземпляр класса на каждом элементе массива, рендеринг карточек
                dataCats.forEach((catData) => {
                    createCat(catData);
                });
                updateLocalStorage(dataCats, {type: 'ALL_CATS'});
            })
            .catch(function(err) {
                console.log(err);
            })
    }
}
// обработка события отправки формы submit
formCatAdd.addEventListener('submit', handleFormAddCat);
formLogin.addEventListener('submit', handleFormLogin);

if(!isAuth) {
    popupLogin.open();
    btnOpenPopup.classList.add('visually-hidden');
} else {
    btnOpenPopupLogin.classList.add('visually-hidden');
}

popupAdd.setEventListener();
popupImage.setEventListener();
popupLogin.setEventListener();

checkLocalStorage();









