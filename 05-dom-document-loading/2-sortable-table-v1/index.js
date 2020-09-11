import {compareStrings} from '../../02-javascript-data-types/1-sort-strings/index'
export default class SortableTable {
    element
    subElements = {}
    
    constructor(header, {data = {}} = {}) {
        this.headerData = header
        this.data = data
        this.render()
    }
    
    render(){
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
        return this.headerContainer
    }
    
    getHeaderFromData(){
        return this.headerData.map((headerItem) => {
            const arrowHtml = `<span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>`
            return `
                <div class="sortable-table__cell" data-id="${headerItem.id}" data-sortable="${headerItem.sortable}">
                    <span>${headerItem.title}</span>
                    ${headerItem.sortable ? arrowHtml : ''}
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
    
    getBodyFromDataWrap(){
        this.bodyContainer.innerHTML = this.getBodyFromData()
    }
    
    getBodyFromData(){
        return this.data.map((rowData) => {
                return `<div class="sortable-table__row">${this.getRow(rowData)}</div>`;
            })
            .join('')
    }
    
    getRow(rowData){
        return this.headerData.map((headerItem) => {
            switch(headerItem.id){
                case 'images':
                    return headerItem.template(rowData.images)
                default:
                    return this.getCellItem(rowData, headerItem.id)
            }
        })
        .join('')
    }
    
    getCellItem(rowItem, cellDataId){
        return `<div class=sortable-table__cell>${rowItem[cellDataId]}</div>`
    }
    
    //SORTING and so on
    sort(fieldValue, orderText) {
        const column = this.headerData.find(item => item.id === fieldValue)
        const {sortType, customSorting} = column
        const direction = orderText === 'asc' ? 1 : -1

        this.data.sort((a, b) => {
            switch (sortType) {
                case 'number':
                    return direction * (a[fieldValue] - b[fieldValue])
                case 'string':
                    return compareStrings(a[fieldValue], b[fieldValue], orderText)
                case 'custom':
                    //customSorting - это как я понял, на будущее сделано, ок
                    return direction * customSorting(a, b)
                default:
                    return direction * (a[fieldValue] - b[fieldValue])
            }
        })
    
        this.getBodyFromDataWrap()
    }
    
    remove() {
        for(const [index, subItem] of Object.entries(this.subElements)) {
            subItem.remove()
        }
        this.element.remove()
    }
    
    destroy() {
        this.remove()
    }
    
}//class end