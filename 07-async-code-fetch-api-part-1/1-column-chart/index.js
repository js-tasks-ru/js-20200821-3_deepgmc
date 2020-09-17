import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
    element
    chartHeight = 50 // высота в пикселях из цсс
    
    constructor({
                    data = [],
                    label = '',
                    url = '',
                    value = null,
                    range = {
                        from: new Date(),
                        to  : new Date()
                    },
                    formatHeading = (data) => data
    } = {}) {
        this.data            = data
        this.graphHref       = new URL(url, 'https://course-js.javascript.ru')
        this.graphValue      = value
        this.graphLabel      = label
        this.formatHeading   = formatHeading
        this.range           = range
        
        this.render()
        this.loadData(this.range.from, this.range.to)
    }
    
    
    
    
    async loadData(from, to) {
        this.makeLoading()
        this.graphHref.searchParams.set('from', from.toISOString())
        this.graphHref.searchParams.set('to', to.toISOString())
        
        const loadedData = await fetchJson(this.graphHref)
        
        this.setRange(from, to)
        
        if (loadedData && Object.values(loadedData).length) {
            this.subElements.header.textContent = ''
            this.subElements.body.innerHTML = ''
            this.subElements.header.textContent = this.formatHeading(Object.values(loadedData).reduce((accum, item) => (accum + item), 0))
            this.subElements.body.innerHTML = this.getChartLines(loadedData)
        }
    
        this.freeLoading()
    }
    
    setRange(from, to){
        this.range.from = from
        this.range.to = to
    }
    
    async update(from, to) {
        return await this.loadData(from, to)
    }
    
    render() {
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.tpl
        this.element = wrapElement.firstElementChild
        this.subElements = this.getSubElements(this.element)
    }
    
    getChartLines(data) {
        const maxGraphValue = Math.max(...Object.values(data))
        return Object.entries(data).map(([key, thisValue]) => {
            const height = parseInt(this.chartHeight / maxGraphValue * thisValue, 10)
            const percent = Math.round(thisValue / maxGraphValue * 100)
            const tooltip = `
                <span>
                    <small>${key.toLocaleString('default', {dateStyle: 'medium'})}</small>
                    <br>
                    <strong>${percent}%</strong>
                </span>`
            return `<div style="--value: ${height}" data-tooltip="${tooltip}"></div>`
        }).join('')
    }
    
    get tpl() {
        return `<div class="${this.data.length ? 'column-chart' : 'column-chart_loading'}">
          <div class="column-chart__title">
            ${this.label}
            ${this.link}
          </div>
          <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
                ${this.value}
            </div>
            <div data-element="body" class="column-chart__chart">
              ${this.getChartLines(this.data)}
            </div>
          </div>
        </div>`
    }
    
    getSubElements(element) {
        return [...element.querySelectorAll('[data-element]')]
            .reduce((result, elem) => {
                result[elem.dataset.element] = elem
                return result
            }, {})
    }
    
    get link() {
        return '<a class="column-chart__link" href="' + this.href + '">View all</a>'
    }
    
    get href() {
        return this.graphHref
    }
    
    get label() {
        return this.graphLabel
    }
    
    get value() {
        return this.graphValue
    }
    
    makeLoading(){
        this.element.classList.add('column-chart_loading')
    }
    
    freeLoading(){
        this.element.classList.remove('column-chart_loading')
    }
    
    destroy() {
        this.remove()
        this.subElements = {}
    }
    
    remove() {
        this.element.remove()
    }
}
