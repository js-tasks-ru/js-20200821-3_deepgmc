import {compareStrings} from '../../02-javascript-data-types/1-sort-strings/index'
export default class SortableTable {
    element
    subElements = {}
    defaultSortOrder = 'asc'
    
    //сохраняем, т.к. эти данные нужны при рендере стрелки в первый раз
    defaultSorting
    
    constructor(header, {
            data = [],
            sortParam = {
                id   : header.find(item => item.sortable).id,
                order: this.defaultSortOrder
            }
        } = {}) {
            this.headerData = header
            this.data = data
            this.defaultSorting = sortParam
            this.data = this.sortData(sortParam.id, sortParam.order)
            this.render()
    }
    
    onSortClick = (event) => {
        const arrowCell = event.target.closest('[data-sortable="true"]')
        if(arrowCell){
            //если в кликнутой ячейке есть иконка стрелки
            const fieldValue = arrowCell.dataset.id
            const orderText = arrowCell.dataset.order
            
            //меняем порядок сортировки на обратный (значок стрелки меняется "сам" - цссом, его менять руками не надо)
            const newOrder = ((prevOrder) => {
                const obj = {
                    desc: 'asc',
                    asc : 'desc'
                }
                return obj[prevOrder]
            })(orderText)
            const arrow = arrowCell.querySelector('.sortable-table__sort-arrow')
            arrowCell.dataset.order = newOrder
            if(!arrow){
                //если иконки не было - вырежем ее с предыдущего места и вставим сюда
                arrowCell.append(this.subElements.arrow)
            }
            this.sort(fieldValue, newOrder)
        }
    }
    
    render() {
        this.element = document.createElement('div')
        this.element.className = 'sortable-table'
        this.subElements.header = this.renderHeader()
        this.subElements.body = this.renderBody()
        this.element.append(this.subElements.header)
        this.element.append(this.subElements.body)
    }
    
    renderHeader() {
        this.headerContainer = document.createElement('div')
        this.headerContainer.dataset.element = 'header'
        this.headerContainer.className = 'sortable-table__header sortable-table__row'
        this.headerContainer.innerHTML = this.getHeaderFromData()
        //запомним стрелку, она должна быть одна
        this.subElements.arrow = this.headerContainer.querySelector('.sortable-table__sort-arrow')
        
        // не стал выносить в отдельную функцию initEventListeners потому что этот ивент касается только шапки таблицы
        // а в теории, возможны случаи когда таблица будет рендериться без шапки
        // правильный ли в этом случае ход мыслей?
        this.headerContainer.addEventListener('pointerdown', this.onSortClick)
        
        return this.headerContainer
    }
    
    getHeaderFromData() {
        return this.headerData.map((headerItem) => {
                const arrowHtml = `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`
                return `
                <div class="sortable-table__cell" data-order="${this.defaultSortOrder}" data-id="${headerItem.id}" data-sortable="${headerItem.sortable}">
                    <span>${headerItem.title}</span>
                    ${(headerItem.sortable && headerItem.id === this.defaultSorting.id) ? arrowHtml : ''}
                </div>
            `
            })
            .join('')
    }
    
    renderBody() {
        this.bodyContainer = document.createElement('div')
        this.bodyContainer.dataset.element = 'body'
        this.bodyContainer.className = 'sortable-table__body'
        this.getBodyFromDataWrap()
        return this.bodyContainer
    }
    
    getBodyFromDataWrap() {
        this.bodyContainer.innerHTML = this.getBodyFromData()
    }
    
    getBodyFromData() {
        return this.data.map((rowData) => {
                return `<div class="sortable-table__row">${this.getRow(rowData)}</div>`;
            })
            .join('')
    }
    
    getRow(rowData) {
        return this.headerData.map((headerItem) => {
                switch (headerItem.id) {
                    case 'images':
                        return headerItem.template(rowData.images)
                    default:
                        return this.getCellItem(rowData, headerItem.id)
                }
            })
            .join('')
    }
    
    getCellItem(rowItem, cellDataId) {
        return `<div class=sortable-table__cell>${rowItem[cellDataId]}</div>`
    }
    
    //SORTING and so on
    sort(fieldValue, orderText) {
        this.data = this.sortData(fieldValue, orderText)
        this.getBodyFromDataWrap()
    }
    
    sortData(fieldValue, orderText) {
        //не мутируем при сортировке, для изменения this.data есть ф-я this.sort
        const sortingData = [...this.data]
        const sortObj = {
            asc : 1,
            desc: -1
        }
        const column = this.headerData.find(item => item.id === fieldValue)
        const {sortType, customSorting} = column
        return sortingData.sort((a, b) => {
            switch (sortType) {
                case 'number':
                    return sortObj[orderText] * (a[fieldValue] - b[fieldValue])
                case 'string':
                    return compareStrings(a[fieldValue], b[fieldValue], orderText)
                case 'custom':
                    return sortObj[orderText] * customSorting(a, b)
                default:
                    return sortObj[orderText] * (a[fieldValue] - b[fieldValue])
            }
        })
    }
    
    
    remove() {
        for (const [index, subItem] of Object.entries(this.subElements)) {
            subItem.remove()
        }
        this.element.remove()
    }
    
    destroy() {
        this.remove()
    }
    
}//class end