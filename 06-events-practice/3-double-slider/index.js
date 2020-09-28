export default class DoubleSlider {
    
    
    
    
    //!!!!!!!!
    //можно не проверять, делал на основе (не копировал все же) готового решения, просто осмысляя
    
    
    
    
    
    element
    subElements = {}
    
    constructor({
                    min = 100,
                    max = 200,
                    formatValue = value => '$' + value,
                    selected = {
                        from: min,
                        to: max
                    }
                } = {}) {
        this.min = min
        this.max = max
        this.formatValue = formatValue
       
        this.selected = selected; //выбранный диапазон
        
        this.render()
    
        
        //events
        const { thumbLeft, thumbRight } = this.subElements
        thumbLeft.addEventListener('pointerdown', event => this.onPointerDown(event))
        thumbRight.addEventListener('pointerdown', event => this.onPointerDown(event))
    }
    
    get template() {
        const { from, to } = this.selected
        
        return `<div class="range-slider">
                  <span data-element="from">${this.formatValue(from)}</span>
                  <div data-element="inner" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress"></span>
                    <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
                    <span data-element="thumbRight" class="range-slider__thumb-right"></span>
                  </div>
                  <span data-element="to">${this.formatValue(to)}</span>
                </div>`
    }
    
    render() {
        const element = document.createElement('div')
        
        element.innerHTML = this.template
        
        this.element = element.firstElementChild
        
        this.subElements = this.getSubElements(element)
        this.update()
    }
    
    getSubElements(element) {
        // эта штука тянется по всем компонентам, берет "основные составляющие куски" компонента и запоминает их
        // чтоб потом перерендерить без querySelector например
        const elements = element.querySelectorAll('[data-element]')
        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement
            return accum
        }, {})
    }
    
    remove() {
        this.element.remove()
    }
    
    destroy() {
        this.remove()
        document.removeEventListener('pointermove', this.onPointerMove)
        document.removeEventListener('pointerup', this.onPointerUp)
    }
    
    update() {
        const rangeTotal = this.max - this.min
        const left = Math.floor((this.selected.from - this.min) / rangeTotal * 100)
        const right = Math.floor((this.max - this.selected.to) / rangeTotal * 100)
        
        //реальное смещение
        this.subElements.progress.style.left = left + '%'
        this.subElements.progress.style.right = right + '%'
        
        this.subElements.thumbLeft.style.left = left + '%'
        this.subElements.thumbRight.style.right = right + '%'
    }
    
    onPointerMove = (event) => {
        event.preventDefault()
        
        //тут логику взял из готового решения, просто её осмыслив
        
        const {
            left: innerLeft,
            right: innerRight,
            width
        } = this.subElements.inner.getBoundingClientRect()
        
        if (this.dragging === this.subElements.thumbLeft) {
            let newLeftValue = (event.clientX - innerLeft + this.shiftX) / width
            
            if (newLeftValue < 0) {
                //при выходе за левую границу принудительно ставим 0, ибо нельзя
                newLeftValue = 0
            }
            newLeftValue *= 100
            let right = parseFloat(this.subElements.thumbRight.style.right)
            
            if (newLeftValue + right > 100) {
                newLeftValue = 100 - right
            }
            
            this.dragging.style.left = this.subElements.progress.style.left = newLeftValue + '%'
            this.subElements.from.innerHTML = this.formatValue(this.getValue().from)
        }
        
        if (this.dragging === this.subElements.thumbRight) {
            let newRightValue = (innerRight - event.clientX - this.shiftX) / width
            
            if (newRightValue < 0) {
                //при выходе за левую границу принудительно ставим 0, ибо нельзя
                //0 это на самом деле 100-0
                newRightValue = 0
            }
            newRightValue *= 100
            
            let left = parseFloat(this.subElements.thumbLeft.style.left)
            
            if (left + newRightValue > 100) {
                newRightValue = 100 - left
            }
            this.dragging.style.right = this.subElements.progress.style.right = newRightValue + '%'
            this.subElements.to.innerHTML = this.formatValue(this.getValue().to)
        }
    }
    
    onPointerUp = () => {
        this.element.classList.remove('range-slider_dragging')
        
        document.removeEventListener('pointermove', this.onPointerMove)
        document.removeEventListener('pointerup', this.onPointerUp)
        
        this.element.dispatchEvent(new CustomEvent('range-select', {
            detail: this.getValue(),
            bubbles: true
        }))
    }
    
    onPointerDown(event) {
        const thumbElem = event.target
        
        event.preventDefault()
        
        const { left, right } = thumbElem.getBoundingClientRect()
        
        if (thumbElem === this.subElements.thumbLeft) {
            this.shiftX = right - event.clientX
        } else {
            this.shiftX = left - event.clientX
        }
        
        //запоминаем элемент который нажали, чтоб его таскать потом
        this.dragging = thumbElem
        this.element.classList.add('range-slider_dragging')
        
        document.addEventListener('pointermove', this.onPointerMove)
        document.addEventListener('pointerup', this.onPointerUp)
    }
    
    getValue() {
        const valueDiff = this.max - this.min
        const { left } = this.subElements.thumbLeft.style
        const { right } = this.subElements.thumbRight.style
        
        const from = Math.round(this.min + parseFloat(left) / 100 * valueDiff)
        const to = Math.round(this.max - parseFloat(right) / 100 * valueDiff)
        
        return { from, to }
    }
}