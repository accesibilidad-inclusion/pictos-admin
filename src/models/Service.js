class Service {

    constructor() {
        this.id = null
        this.name = ''
        this.url = ''
        this.category = ''
        this.venues = []
        this.tags = []
        this.status = ''
    }

    set(service) {
        this.id = service.id
        this.name = service.name
        this.url = service.url
        this.category = service.category
        this.venues = service.venues
        this.tags = service.tags
        this.status = service.status
    }

}

export default Service
