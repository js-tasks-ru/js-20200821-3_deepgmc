export default class ColumnChart {
    element
    graphValue = 'def'
    graphLabel = 'def'
    graphHref = 'def'
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
    
    getValue(){
        return this.graphValue
    }
    
    render() {
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.getTpl()
        this.element = wrapElement.firstElementChild
    }
    
    getTpl(){
        return `<div class="${this.data.length > 0 ? 'column-chart' : 'column-chart_loading'}">
          <div class="column-chart__title">
            ${this.label}
            ${this.link}
          </div>
          <div class="column-chart__container">
            <div class="column-chart__header">${this.getValue()}</div>
            <div class="column-chart__chart">
              ${this.getChartLines()}
            </div>
          </div>
        </div>`
    }
    
    getChartLines() {
        if (this.data.length === 0) return '<img src="charts-skeleton.svg" />'
    
        const bars = []
        const maxGraphValue = Math.max(...this.data)
        this.data.forEach((thisValue) => {
            const height = parseInt(this.chartHeight / maxGraphValue * thisValue, 10)
            const percent = Math.round(thisValue / maxGraphValue * 100)
            bars.push(`<div style="--value: ${height}" data-tooltip="${percent}%"></div>`)
        })
    
        return bars.join('')
    }
    
    destroy() {
        this.element.remove()
    }
    
    remove(){
        this.destroy()
    }
    
    update(newData) {
        this.data = newData
        this.render()
    }
}
