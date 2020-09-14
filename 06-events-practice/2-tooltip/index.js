class Tooltip {
    
    static singleTooltip
    
    element
    tooltipText
    pointerOffset = 10
    
    constructor() {
        if(Tooltip.singleTooltip){
            return Tooltip.singleTooltip
        }
        Tooltip.singleTooltip = this
    }
    
    initialize() {
        document.addEventListener('pointerover', this.onPointerOver)
        document.addEventListener('pointerout', this.onPointerOut)
    }
    
    onPointerOver = (event) => {
        
        //closest для того, чтобы смотреть и на элементы-обертки, а не только сам элемент
        const tooltipParent = event.target.closest('[data-tooltip]')
        
        if(tooltipParent){
            this.tooltipText = tooltipParent.dataset.tooltip
            this.render()
            this.moveTooltip(event)
            document.addEventListener('pointermove', this.onPointerMove)
        }
    }
    
    onPointerMove = (event) => {
        this.moveTooltip(event)
    }
    
    onPointerOut = () => {
        this.removeTooltip()
    }
    
    moveTooltip(event) {
        this.element.style.left = (event.clientX + this.pointerOffset) + 'px'
        this.element.style.top = (event.clientY + this.pointerOffset) + 'px'
    }
    
    render() {
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.template
        this.element = wrapElement.firstElementChild
        document.body.append(this.element)
    }
    
    get template() {
        return `<div class="tooltip">${this.tooltipText}</div>`
    }
    
    removeTooltip() {
        if(this.element){
            this.element.remove()
            //вместе с элементом убираем эвент на документе
            //сказали так правильнее, но думаю вариант без убирания ивента
            //и проверкой внутри колбэка ивента тоже имеет место быть
            document.removeEventListener('pointermove', this.onPointerMove)
        }
    }
    
    destroy(){
        this.remove()
    }
    
    remove() {
        this.removeTooltip()
    }
}

const tooltip = new Tooltip()

export default tooltip
