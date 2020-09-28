export default class SortableList {
    element
    pointerClickOffset = {
        x: null,
        y: null
    }
    stubElement // элемент заглушка которая на заднем фоне тягается
    
    
    constructor({
                    items = []
                } = {}) {
        this.items = items
        
        this.render()
        
        this.element.addEventListener('pointerdown', event => {
            this.onPointerDown(event)
        })
    }
    
    render() {
        this.element = document.createElement('ul')
        this.addInititalItems()
        this.element.className = 'sortable-list'
    }
    
    addInititalItems() {
        for (let item of this.items) {
            //идем по всем предложенным итемам и проставляем им драгэйбл класс
            item.classList.add('sortable-list__item')
        }
        this.element.append(...this.items)
    }
    
    onPointerDown(event) {
        if (event.button !== 0) {
            return false
        }
        event.preventDefault()
        
        const thisItemElement = event.target.closest('.sortable-list__item')
        
        if (!thisItemElement) return false
        
        if (event.target.closest('[data-grab-handle]')) {
            this.startDrag(thisItemElement, event.clientX, event.clientY)
        }
        
        if (event.target.closest('[data-delete-handle]')) {
            thisItemElement.remove()
        }
    }
    
    setDragElementCoordinates(clientX, clientY) {
        this.draggingElem.style.left = clientX - this.pointerClickOffset.x + 'px';
        this.draggingElem.style.top = clientY - this.pointerClickOffset.y + 'px';
    }
    
    startDrag(elem, clientX, clientY) {
        
        //вычислим индекс с котрого тащим
        this.elementInitialIndex = [...this.element.children].indexOf(elem)
        
        this.draggingElem = elem
        
        //запомним смещение на кликнутом элементе, а то будет не под тем место, куда кликнули
        this.pointerClickOffset = {
            x: clientX - elem.getBoundingClientRect().x,
            y: clientY - elem.getBoundingClientRect().y
        }
        
        elem.style.width = elem.offsetWidth + 'px'
        elem.style.height = elem.offsetHeight + 'px'
        elem.classList.add('sortable-list__item_dragging')
    
        //создаём элемент-заглушку
        this.createStubElement(elem)
        
        elem.after(this.stubElement)
        this.element.append(elem)
        
        this.setDragElementCoordinates(clientX, clientY)
        
        document.addEventListener('pointermove', this.onDragging)
        document.addEventListener('pointerup', this.stopDrag)
    }
    
    stopDrag = () => {
        this.draggingElem.classList.remove('sortable-list__item_dragging')
        
        //вычисляем индекс заглушки, чтоб на его место пихнуть перетаскиваемый
        const stubIndex = [...this.element.children].indexOf(this.stubElement)
    
        this.draggingElem.style.left = ''
        this.draggingElem.style.top = ''
        this.draggingElem.style.width = ''
        this.draggingElem.style.height = ''
        this.stubElement.replaceWith(this.draggingElem)
        
        
        if (stubIndex !== this.elementInitialIndex) {
            this.element.dispatchEvent(new CustomEvent('sortable-list-reorder', {
                    bubbles: true,
                    details: {
                        from: this.elementInitialIndex,
                        to  : stubIndex
                    }
                }
            ))
        }
        
        document.removeEventListener('pointermove', this.onDragging)
        document.removeEventListener('pointerup', this.stopDrag)
        
        // после всех манипуляций удаляем заглушку
        this.removeStubElement()
        this.draggingElem = null
    }
    
    onDragging = (event) => {
        this.setDragElementCoordinates(event.clientX, event.clientY)
        
        
        //логика взята из готового решения
        
        
        const {firstElementChild, children} = this.element
        const {top: firstElementTop} = firstElementChild.getBoundingClientRect()
        const {bottom} = this.element.getBoundingClientRect()
        
        if (event.clientY < firstElementTop) {
            //всегда оставляем на 0 позиции, если выше
            this.moveStubAt(0)
        } else if (event.clientY > bottom) {
            // ... на последней позиции, если ниже
            this.moveStubAt(children.length)
        } else {
            for (let i = 0; i < children.length; i++) {
                const thisElem = children[i]
                if (thisElem !== this.draggingElem) {
                    const {top, bottom} = thisElem.getBoundingClientRect()
                    const {offsetHeight} = thisElem
                    
                    if (event.clientY > top && event.clientY < bottom) {
                        if (event.clientY < top + offsetHeight / 2) {
                            this.moveStubAt(i)
                            break
                        } else {
                            this.moveStubAt(i + 1)
                            break
                        }
                    }
                }
            }
        }
    }
    
    moveStubAt(index) {
        if (this.element.children[index] !== this.stubElement) {
            this.element.insertBefore(this.stubElement, this.element.children[index])
        }
    }
    
    createStubElement(dragElem) {
        this.stubElement = document.createElement('li')
        this.stubElement.className = 'sortable-list__placeholder'
        this.stubElement.style.width = dragElem.style.width
        this.stubElement.style.height = dragElem.style.height
        
    }
    
    removeStubElement() {
        this.stubElement.remove()
    }
    
    remove() {
        this.element.remove()
    }
    
    destroy() {
        document.removeEventListener('pointermove', this.onDragging)
        document.removeEventListener('pointerup', this.stopDrag)
        this.remove()
    }
}
