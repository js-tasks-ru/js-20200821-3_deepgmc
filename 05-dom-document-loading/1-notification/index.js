export default class NotificationMessage {

    static staticElement

    timeoutObj

    constructor(message, {duration = 2000, type = 'success'}) {
        this.message = message
        this.duration = duration
        this.type = type
        this.makeElement()
    }

    makeElement() {
        const wrapElement = document.createElement('div')
        wrapElement.innerHTML = this.template
        this.element = wrapElement.firstElementChild
        if(NotificationMessage.staticElement)       NotificationMessage.staticElement.remove()
        NotificationMessage.staticElement = wrapElement.firstElementChild
    }

    show(renderToElem = document.body) {
        renderToElem.append(this.element)
        this.timeoutObj = setTimeout(this.destroy.bind(this), this.duration)
    }

    destroy(){
        console.log('destroy');
        NotificationMessage.staticElement.remove()
        NotificationMessage.staticElement = null
        this.remove()
        this.timeoutObj.clearInterval()
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