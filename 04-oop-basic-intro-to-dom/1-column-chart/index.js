export default class ColumnChart {
    element
    chartHeight = 50 // высота в пикселях из цсс
    
    constructor({data = [], label = '', href = '', value = null} = {}) {
        this.data = data
        this.graphHref = href
        this.graphValue = value
        this.graphLabel = label
        this.render()
    }
    
    get link(){
        return '<a class="column-chart__link" href="' + this.href + '">View all</a>'
    }
    
    get href(){
        return this.graphHref
    }
    
    get label(){
        return this.graphLabel
    }
    
    get value(){
        return this.graphValue
    }
    
    render() {
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.tpl
        this.element = wrapElement.firstElementChild
        
        //запоминаем "внутренности", чтобы потом быстро к ним обращаться и обновлять содержимое
        this.subElements = this.getSubElements(this.element)
    }
    
    get tpl(){
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
    
    getChartLines(data) {
        if (data.length === 0) return '<img src="charts-skeleton.svg" />'
        const maxGraphValue = Math.max(...data)
        return this.data.map((thisValue) => {
                const height = parseInt(this.chartHeight / maxGraphValue * thisValue, 10)
                const percent = Math.round(thisValue / maxGraphValue * 100)
                return `<div style="--value: ${height}" data-tooltip="${percent}%"></div>`
            })
            .join('')
    }
    
    getSubElements(element){
        return [...element.querySelectorAll('[data-element]')]
            .reduce((result, elem) => {
                result[elem.dataset.element] = elem
                return result
            }, {})
    }
    
    update(newData) {
        this.data = newData
        this.subElements.body.innerHTML = this.getChartLines(newData)
        
        //переделал апдейт с рендера, на замену "внутренностей"
        //this.render()
    }
    
    
    destroy() {
        this.remove()
        this.element = null
        this.subElements = {}
    }
    
    remove(){
        this.element.remove()
    }
}
