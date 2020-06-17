class Service {

    constructor() {
        this.id = null
        this.name = ''
        this.url = ''
        this.category = ''
        this.category_id = null
        this.venues = []
        this.tags_text = ''
        this.tags = []
        this.status = ''
    }

    set(service) {
        this.id = service.id
        this.name = service.name
        this.url = service.url
        this.category_id = service.category_id
        this.category = service.category
        this.venues = service.venues
        this.tags_text = service.tags
        this.tags = service.tags
        this.status = service.status
    }

    form() {
        return [
            {
                id: 'name',
                prefix: 'el',
                name: 'nombre',
                label: 'Nombre del servicio',
                rules: 'required|max:100',
                type: 'text'
            },
            {
                id: 'category_id',
                prefix: 'la',
                name: 'categoria',
                label: 'Categoria',
                rules: 'required',
                type: 'select',
                data: 'categories',
                textOption: ['name']
            },
            {
                id: 'tags_text',
                prefix: 'los',
                name: 'sinonimos',
                label: 'Sinónimos de búsqueda (Separados por coma)',
                rules: '',
                type: 'text'
            }
        ]
    }

}

export default Service
