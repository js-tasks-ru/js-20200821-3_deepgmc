export default class RangePicker {
    element = null
    subElements = {}
    selectingFrom = true//что начинаем выбирать
    selected = {
        from: new Date(),
        to: new Date
    }
    cellClass = 'rangepicker__cell'
    daysText = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    
    constructor({
        from = new Date(),
        to = new Date()
    } = {}){
        this.selected = {from, to}
        this.startDateFrom = new Date(from)
        this.render()
    
        //events
        const {input, selector} = this.subElements
        document.addEventListener('click', this.onDocumentClick, true)
        input.addEventListener('click', this.toggleSelector)
        selector.addEventListener('click', this.onSelectorClick)
    }
    
    render(){
        const wrapper = document.createElement('div')
        wrapper.innerHTML = this.template
        this.element = wrapper.firstElementChild
        this.subElements = this.getSubElements(this.element)
    }
    
    get template(){
        //шаблон кнопки и контейнер для окна
        return `
        <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
              <span data-element="from">${this.formatDateValue(this.selected.from)}</span> -
              <span data-element="to">${this.formatDateValue(this.selected.to)}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector"></div>
        </div>
        `;
    }
    
    renderPicker(){
        const renderDateFrom = new Date(this.startDateFrom)
        const renderDateTo = new Date(this.startDateFrom)
    
        renderDateTo.setMonth(renderDateTo.getMonth() + 1)
        
        const {selector} = this.subElements
        selector.innerHTML = `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.renderCalendar(renderDateFrom)}
            ${this.renderCalendar(renderDateTo)}
        `;
        selector.querySelector('.rangepicker__selector-control-left').addEventListener('click', this.goLeft)
        selector.querySelector('.rangepicker__selector-control-right').addEventListener('click', this.goRight)
        
        this.renderHighlight()
    }
    
    renderCalendar(showDate){
        //рендер одного календаря (из двух)
        const date = new Date(showDate)
        
        //логика вычисления смещения дней взята из готового решения
        const getIndex = (dayIndex) => {
            const index = dayIndex === 0 ? 6 : (dayIndex - 1)
            return index + 3
        }
        date.setDate(1)//устанавливает день месяца
        
        const month = date.toLocaleString('ru', {month: 'long'})
        const showMonth = showDate.getMonth()
        
        const cells = []
        
        let template =
            `
            <div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                  <time datetime="${month}">${month}</time>
                </div>
                <div class="rangepicker__day-of-week">
                    ${this.daysText.map( day => `<div>${day}</div>`).join('')}
                </div>
                <div class="rangepicker__date-grid">
            `;
        
        //добавляем ЦССом пробел дней НЕ в текущем месяце
        cells.push(
                `
                <button type="button" class="${this.cellClass}"
                    data-value="${date.toISOString()}"
                    style="--start-from: ${getIndex(date.getDay())}"
                >
                    ${date.getDate()}
                </button>
            `
        );
        
        date.setDate(2)
        
        while(date.getMonth() === showMonth){
            cells.push(`
                <button type="button"
                    class="${this.cellClass}"
                    data-value="${date.toISOString()}"
                >
                    ${date.getDate()}
                </button>
            `);
            date.setDate(date.getDate() + 1)
        }
    
        //всего 1 конкатенация строк, должно быть ок
        return template + cells.join('') + '</div></div>'
    }
    
    onSelectorClick = (e) => {
        if(e.target.classList.contains('rangepicker__cell')){
            this.rangePickerCellClick(e.target)
        }
    }
    
    rangePickerCellClick(target){
        const {value} = target.dataset
        if(value){
            const dateValue = new Date(value)
            if(this.selectingFrom){
                this.selected = {
                    from: dateValue,
                    to: null
                }
                this.selectingFrom = false
                this.renderHighlight()
            } else {
                if(dateValue > this.selected.from){
                    this.selected.to = dateValue
                } else {
                    this.selected.to = this.selected.from
                    this.selected.from = dateValue
                }
                this.selectingFrom = true
                this.renderHighlight()
            }
            if(this.selected.from && this.selected.to){
                this.dispatchChooseDate()
                this.closePicker()
                this.subElements.from.innerHTML = this.formatDateValue(this.selected.from)
                this.subElements.to.innerHTML = this.formatDateValue(this.selected.to)
            }
        }
    }
    
    renderHighlight(){
        const {from, to} = this.selected
        
        for (const cell of this.element.querySelectorAll('.rangepicker__cell')){
            const {value} = cell.dataset
            const cellDate = new Date(value)
            
            //идем по всем ячейкам и убираем все классы выделения выбранного
            cell.classList.remove('rangepicker__selected-from')
            cell.classList.remove('rangepicker__selected-between')
            cell.classList.remove('rangepicker__selected-to')
            
            // а затем вновь их выставляем по условию
            if(from && value === from.toISOString()){
                cell.classList.add('rangepicker__selected-from')
            } else if(to && value === to.toISOString()){
                cell.classList.add('rangepicker__selected-to')
            } else if(from && to && cellDate >= from && cellDate <= to){
                cell.classList.add('rangepicker__selected-between')
            }
        }
        if(from){
            const selectedFromElement = this.element.querySelector(`[data-value="${from.toISOString()}"]`)
            if(selectedFromElement){
                selectedFromElement.closest('.rangepicker__cell').classList.add('rangepicker__selected-from')
            }
        }
        if(to){
            const selectedToElement = this.element.querySelector(`[data-value="${to.toISOString()}"]`)
            if(selectedToElement){
                selectedToElement.closest('.rangepicker__cell').classList.add('rangepicker__selected-to')
            }
        }
        
    }
    
    dispatchChooseDate(){
        //выкидываем событие, что дата сменилась, другие будут его хватать, брать из детэйла даты и перерендериваться
        this.element.dispatchEvent(new CustomEvent('date-select'), {
            bubbles: true,
            detail: this.selected
        })
    }
    
    goLeft = () => {
        this.startDateFrom.setMonth(this.startDateFrom.getMonth() - 1)
        this.renderPicker()
    }
    
    goRight = () => {
        this.startDateFrom.setMonth(this.startDateFrom.getMonth() + 1)
        this.renderPicker()
    }
    
    closePicker(){
        this.element.classList.remove('rangepicker_open')
    }
    
    formatDateValue(value){
        return value.toLocaleString('ru', {dateStyle: 'short'})
    }
    
    getSubElements(element) {
        return [...element.querySelectorAll('[data-element]')]
            .reduce((result, elem) => {
                result[elem.dataset.element] = elem
                return result
            }, {})
    }
    
    toggleSelector = () => {
        this.element.classList.toggle('rangepicker_open')
        //toggle тож самое что вот это:
        // const pickerOpenClass = 'rangepicker_open'
        // if(this.element.classLis.contains(pickerOpenClass)){
        //     this.element.classList.remove(pickerOpenClass)
        // } else {
        //     this.element.classList.add(pickerOpenClass)
        // }
        this.renderPicker()
    }
    
    onDocumentClick = (e) => {
        //закрываем пикер при клике на документе
        if(
            //у класс листа и элементов есть похожие методы определения вхождения
            this.element.classList.contains('rangepicker_open') &&
            !this.element.contains(e.target)
        ){
            this.closePicker()
        }
    }
    
    remove() {
        this.element.remove()
    }
    
    destroy() {
        document.removeEventListener('scroll', this.onWindowScroll);
        this.remove()
    }
}
