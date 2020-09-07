export default class NotificationMessage {

    static staticElement //сохраняем ссылку на созданный объект
    
    timeoutId = null //свойство покажем явно, для наглядности

    constructor(message, {duration = 2000, type = 'success'} = {}) {
        this.message = message
        this.duration = duration
        this.type = type
        this.makeElement()
    }
    
    cleanStatic(){
        if(NotificationMessage.staticElement) NotificationMessage.staticElement.destroy()
    }

    makeElement() {
        //создаем элемент по шаблону и сохраняем ссылку на его объект в статике
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.template
        this.element = wrapElement.firstElementChild
    
        //удаляем сохраненный в "прошлом" объект перед тем как рендерить текущий
        this.cleanStatic()
        //а затем снова занесём его в статику
        NotificationMessage.staticElement = this
    }

    show(renderToElem = document.body) {
        renderToElem.append(this.element)
        this.timeoutId = setTimeout(this.destroy.bind(this), this.duration)
    }

    destroy(){
        if(this.timeoutObj) clearTimeout(this.timeoutId);
        this.remove()
    }

    remove() {
        this.element.remove()
    }

    get template() {
        return `
            <div class="notification ${this.type}" style="--value:${this.seconds}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>
        `
    }

    get seconds(){
        return Math.round(this.duration / 1000)
    }
}