class Venue {

    constructor() {
        this.id = null
        this.name = ''
        this.service = null
        this.url = ''
        this.position = null
        this.tags_text = ''
        this.tags = []
        this.tasks = []
        this.evaluations = []
        this.visible = 0
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
        this.position = {
            lat: parseFloat(venue.position.lat),
            lng: parseFloat(venue.position.lng)
        }
        this.tags_text = venue.tags.join(', ')
        this.tags = venue.tags
        this.tasks = venue.tasks
        this.evaluations = venue.evaluations
        this.status = venue.status
        this.visible = venue.visible
    }

    form() {
        let form = {
            title: this.status == "Enviado por usuario" ? 'Crear nuevo lugar' : 
            ( this.id ? 'Editar lugar' : 'Agregar nuevo lugar' ),
            fields: [
                {
                    id: 'name',
                    name: 'nombre',
                    label: 'Nombre del lugar',
                    rules: 'required|max:100',
                    type: 'text'
                },
                {
                    id: 'service',
                    name: 'lugar',
                    label: 'Servicio al que pertenece',
                    rules: 'required',
                    type: 'select',
                    data: 'services',
                    textOption: ['name']
                },
                {
                    id: 'position',
                    name: 'ubicacion',
                    label: 'Ubicación',
                    type: 'map'
                },
                {
                    id: 'tags_text',
                    name: 'sinonimos',
                    label: 'Sinónimos de búsqueda (Separados por coma)',
                    rules: '',
                    type: 'text'
                },
            ],
            actions: this.status == "Enviado por usuario" ? [
                {
                    label: 'Eliminar',
                    color: 'error',
                    callback: 'request',
                    url: 'api/venues/delete',
                    method: 'post',
                    confirm: '¿Esta seguro de eliminar este lugar?',
                    emit: 'updated'
                },
                {
                    label: 'Cancelar',
                    color: 'grey',
                    callback: 'cancel',
                },
                {
                    label: 'Crear tarea',
                    color: 'primary',
                    callback: 'request',
                    url: 'api/venues/update',
                    method: 'put',
                    validate: true,
                    emit: 'updated'
                }
            ] : [
                {
                    label: 'Cancelar',
                    color: 'grey',
                    callback: 'cancel',
                },
                {
                    label: this.id ? 'Actualizar lugar' : 'Crear lugar',
                    color: 'primary',
                    callback: 'request',
                    url: this.id ? 'api/venues/update' : 'api/venues/store',
                    method: this.id ? 'put' : 'post',
                    validate: true,
                    emit: 'updated'
                }
            ]
        }
        return form
    }

}

export default Venue
