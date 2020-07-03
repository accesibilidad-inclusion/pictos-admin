class Venue {

    constructor() {
        this.id = null
        this.name = ''
        this.service = {
            'id': null,
            'name': ''
        }
        this.url = ''
        this.lat = 0
        this.long = 0
        this.tags_text = ''
        this.tags = []
        this.tasks = []
        this.status = ''
    }

    set(venue) {
        this.id = venue.id
        this.name = venue.name
        this.service = {
            'id': venue.service.id,
            'name': venue.service.name
        }
        this.url = venue.url
        this.lat = 0
        this.long = 0
        this.tags_text = venue.tags.join(', ')
        this.tags = venue.tags
        this.tasks = venue.tasks
        this.status = venue.status
    }

    form() {
        return [
            {
                id: 'name',
                prefix: 'el',
                name: 'nombre',
                label: 'Nombre del lugar',
                rules: 'required|max:100',
                type: 'text'
            },
            {
                id: 'service',
                prefix: 'el',
                name: 'lugar',
                label: 'Servicio al que pertenece',
                rules: 'required',
                type: 'select',
                data: 'services',
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

export default Venue
