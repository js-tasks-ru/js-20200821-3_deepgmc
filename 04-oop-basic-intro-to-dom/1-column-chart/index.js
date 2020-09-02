export default class ColumnChart {
    element
    
    constructor({
                    data = [],
                    label = '',
                    href = '',
                    value = null
                }) {
        this.data = data
        this.label = label
        this.href = href
        this.value = value
        this.render()
    }
    
    render() {
        const wrap_element = document.createElement('div')
        wrap_element.innerHTML = this.tpl
        this.element = wrap_element.firstElementChild
    }
    
    tpl = `<div class="column-chart">
              <div class="column-chart__title">
                Total orders
                ${this.link}
              </div>
              <div class="column-chart__container">
                <div class="column-chart__header">344</div>
                <div class="column-chart__chart">
                  <div style="--value:28" data-tooltip="<div><small>15 янв. 2020 г.</small></div><strong>11</strong>"></div>
                  <div style="--value:28" data-tooltip="<div><small>16 янв. 2020 г.</small></div><strong>11</strong>"></div>
                  <div style="--value:23" data-tooltip="<div><small>17 янв. 2020 г.</small></div><strong>9</strong>"></div>
                  <div style="--value:7" data-tooltip="<div><small>18 янв. 2020 г.</small></div><strong>3</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>19 янв. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:36" data-tooltip="<div><small>20 янв. 2020 г.</small></div><strong>14</strong>"></div>
                  <div style="--value:39" data-tooltip="<div><small>21 янв. 2020 г.</small></div><strong>15</strong>"></div>
                  <div style="--value:7" data-tooltip="<div><small>22 янв. 2020 г.</small></div><strong>3</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>23 янв. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:42" data-tooltip="<div><small>24 янв. 2020 г.</small></div><strong>16</strong>"></div>
                  <div style="--value:42" data-tooltip="<div><small>25 янв. 2020 г.</small></div><strong>16</strong>"></div>
                  <div style="--value:7" data-tooltip="<div><small>26 янв. 2020 г.</small></div><strong>3</strong>"></div>
                  <div style="--value:31" data-tooltip="<div><small>27 янв. 2020 г.</small></div><strong>12</strong>"></div>
                  <div style="--value:39" data-tooltip="<div><small>28 янв. 2020 г.</small></div><strong>15</strong>"></div>
                  <div style="--value:36" data-tooltip="<div><small>29 янв. 2020 г.</small></div><strong>14</strong>"></div>
                  <div style="--value:18" data-tooltip="<div><small>30 янв. 2020 г.</small></div><strong>7</strong>"></div>
                  <div style="--value:15" data-tooltip="<div><small>31 янв. 2020 г.</small></div><strong>6</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>1 февр. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>2 февр. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:36" data-tooltip="<div><small>3 февр. 2020 г.</small></div><strong>14</strong>"></div>
                  <div style="--value:5" data-tooltip="<div><small>4 февр. 2020 г.</small></div><strong>2</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>5 февр. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:42" data-tooltip="<div><small>6 февр. 2020 г.</small></div><strong>16</strong>"></div>
                  <div style="--value:44" data-tooltip="<div><small>7 февр. 2020 г.</small></div><strong>17</strong>"></div>
                  <div style="--value:5" data-tooltip="<div><small>8 февр. 2020 г.</small></div><strong>2</strong>"></div>
                  <div style="--value:42" data-tooltip="<div><small>9 февр. 2020 г.</small></div><strong>16</strong>"></div>
                  <div style="--value:50" data-tooltip="<div><small>10 февр. 2020 г.</small></div><strong>19</strong>"></div>
                  <div style="--value:34" data-tooltip="<div><small>11 февр. 2020 г.</small></div><strong>13</strong>"></div>
                  <div style="--value:15" data-tooltip="<div><small>12 февр. 2020 г.</small></div><strong>6</strong>"></div>
                  <div style="--value:50" data-tooltip="<div><small>13 февр. 2020 г.</small></div><strong>19</strong>" class=""></div>
                </div>
              </div>
            </div>`
    
    get link(){
        return '<a href="' + this.href + '">Link text</a>'
    }
    
    remove() {
        this.element.remove()
    }
    
    update() {
        this.data = 'new data'
        this.render()
    }
}
