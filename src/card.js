export class Card {
    #data;
    #selectorTemplate;
    #element;
    #handleClickCatImage;

    #getTemplate(){
        const template = document.querySelector(this.#selectorTemplate).content.querySelector('.card');
        return template;
    }
    constructor(data, selectorTemplate, handleClickCatImage){
        this.#data = data;
        this.#selectorTemplate = selectorTemplate;
        this.#handleClickCatImage = handleClickCatImage;
    }
    getElement(){
        this.#element = this.#getTemplate().cloneNode(true); //наполняет карточку
        const cardTitleElement = this.#element.querySelector('.card__name');
        const cardImageElement = this.#element.querySelector('.card__img');
        const cardLikeElement = this.#element.querySelector('.card__like');

        cardTitleElement.textContent = this.#data.name;
        cardImageElement.src = this.#data.image;

        // удаляет like, усли favorite: false
        if(!this.#data.favorite) {
            cardLikeElement.remove()
        }
        
        cardImageElement.addEventListener('click', () => {
            this.#handleClickCatImage(this.#data.image);
        })

        return this.#element
    }
}
