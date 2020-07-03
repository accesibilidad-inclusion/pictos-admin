class Task {

    constructor() {
        this.id = null
        this.title = ''
        this.venue = {
            'id': null,
            'name': ''
        }
        this.service = {
            'id': null,
            'name': ''
        }
        this.url = ''
        this.tags_text = ''
        this.tags = []
        this.steps = []
        this.status = ''
    }

    set(task) {
        this.id = task.id
        this.title = task.title
        this.service = {
            'id': task.service.id,
            'name': task.service.name
        }
        this.venue = {
            'id': task.venue.id,
            'name': task.venue.name
        }
        this.url = task.url
        this.tags_text = task.tags.join(', ')
        this.tags = task.tags
        this.steps = task.steps
        this.status = task.status
    }

    form() {
        return [
            {
                id: 'title',
                prefix: 'el',
                name: 'titulo',
                label: 'Titulo de la tarea',
                rules: 'required|max:500',
                type: 'text'
            },
            {
                id: 'venue',
                prefix: 'el',
                name: 'lugar',
                label: 'Lugar al que pertenece',
                rules: 'required',
                type: 'select',
                data: 'venues',
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

export default Task
