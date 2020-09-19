import fetchJson from './utils/fetch-json.js';
import {compareStrings} from '../../02-javascript-data-types/1-sort-strings/index'

const BACKEND_URL = 'https://course-js.javascript.ru'

export default class SortableTable {
    element
    subElements = {}
    defaultSortOrder = 'asc'
    defaultSorting
    
    loading = false
    isSortLocally = false
    step = 20 //по сколько загружать
    start = 1
    end = this.start + this.step
    
    constructor(header, {
        data = [],
        url = '',
        isSortLocally = false,
        sortParam = {
            id    : header.find(item => item.sortable).id,
            order : this.defaultSortOrder
        }
    } = {}) {
        this.isSortLocally = isSortLocally
        this.url = new URL(url, BACKEND_URL)
        this.headerData = header
        this.data = data
        this.defaultSorting = sortParam
        this.data = this.sortData(sortParam.id, sortParam.order, this.data)
        this.render()
    }
    
    
    async render() {
        const {id, order} = this.defaultSorting
        this.element = document.createElement('div')
        this.element.className = 'sortable-table'
    
        this.data = await this.loadData(id, order, this.start, this.end)
    
        this.subElements.header = this.renderHeader()
        this.subElements.body = this.renderBody()
        
        this.element.append(this.subElements.header)
        this.element.append(this.subElements.body)
        
        document.addEventListener('scroll', this.onWindowScroll)
    }
    
    getBodyFromDataWrap(data) {
        this.bodyContainer.innerHTML = this.getBodyFromData(data)
    }
    
    async loadData(
        id,
        order,
        //эти параметры передаются, т.к. есть вызов sortOnServer
        start = this.start,
        end = this.end
    ) {
        //запихивает в объект урла гет параметры, удобно
        this.url.searchParams.set('_sort', id)
        this.url.searchParams.set('_order', order)
        this.url.searchParams.set('_start', start)
        this.url.searchParams.set('_end', end)
        this.makeLoading()
        const data = await fetchJson(this.url)
        this.freeLoading()
        return data
    }
    
    onWindowScroll = async () => {
        const { bottom } = this.element.getBoundingClientRect()
        const { id, order } = this.defaultSorting
        
        if (
            !this.loading &&
            bottom < document.documentElement.clientHeight &&
            !this.isSortLocally
        ) {
            this.start = this.end
            this.end = this.start + this.step
            
            this.loading = true
            
            const loadedData = await this.loadData(id, order, this.start, this.end)
            this
                .appendData(loadedData)
                .updateBody(loadedData)
            this.loading = false
        }
    }
    
    appendData(newData){
        this.data = [...this.data, ...newData]
        return this
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
            if(this.isSortLocally) {
                //нажали сортировать локально
                this.sort(fieldValue, newOrder)
            } else {
                //запрос на сервер с сортировкой уже там
                this.sortOnServer(fieldValue, newOrder, 0, this.step)
            }
        }
    }
    
    renderHeader() {
        this.headerContainer = document.createElement('div')
        this.headerContainer.dataset.element = 'header'
        this.headerContainer.className = 'sortable-table__header sortable-table__row'
        this.headerContainer.innerHTML = this.getHeaderFromData()
        //запомним стрелку, она должна быть одна
        this.subElements.arrow = this.headerContainer.querySelector('.sortable-table__sort-arrow')
        
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
        this.getBodyFromDataWrap(this.data)
        return this.bodyContainer
    }
    
    updateBody(newData){
        //только добавляет новые строки, не рендерит всё
        const wrapper = document.createElement('div')
        wrapper.innerHTML = this.getBodyFromData(newData)
        this.subElements.body.append(...wrapper.childNodes)
    }
    
    getBodyFromData(data) {
        return data.map((rowData) => {
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
        this.data = this.sortData(fieldValue, orderText, this.data)
        this.getBodyFromDataWrap(this.data)
    }
    
    //внезапно тесты потебовали такой метод.... ну ок, добавим :)
    async sortOnServer(id, order, start, end) {
        const data = await this.loadData(id, order, start, end)
        this.getBodyFromDataWrap(data)
    }
    
    sortData(fieldValue, orderText, data) {
        //не мутируем при сортировке, для изменения this.data есть ф-я this.sort
        const sortingData = [...data]
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
    
    makeLoading(){
        this.element.classList.add('sortable-table_loading')
    }
    
    freeLoading(){
        this.element.classList.remove('sortable-table_loading')
    }
    
    remove() {
        for (const [index, subItem] of Object.entries(this.subElements)) {
            subItem.remove()
        }
        this.element.remove()
    }
    
    destroy() {
        document.removeEventListener('scroll', this.onWindowScroll);
        this.remove()
    }
    
}//class end