<template>
  <div>
    <v-col cols="12" class="sticky-top d-flex align-center breadcrumbs">
      <router-link to="/tareas/" class="breadcrumbs__link"><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Tareas</router-link>
      <router-link :to="'/tareas/' + $route.params.task.id" class="breadcrumbs__link"> {{ $route.params.task.title }} </router-link>
      <span v-if="!$route.params.id">Crear paso</span>
      <span v-else>Editar paso</span>
    </v-col>
    <v-row>
      <v-col cols="6">
        <v-container class="sticky-top-2 d-flex flex-column justify-center">
          <div class="container-preview">
            <span class="subtitle font-weight-bold grey--text text--darken-1 text-uppercase">
              Previsualización
            </span>
            <div class="mt-3 preview__pictos blue lighten-5">
              <img v-if="context" :src="context.path + '/' + context.filename" />
              <img v-if="landmark" :src="landmark.path + '/' + landmark.filename" />
              <img v-if="subject" :src="subject.path + '/' + subject.filename" />
            </div>
            <v-row  align="center" justify="center" class="mt-3">
              <v-col v-if="action" cols="2">
                <img :src="action.path + '/' + action.filename" class="icon__pictogram" />
              </v-col>
              <v-col :cols=" action ? 8 : 12" class="headline font-weight-bold">
                {{ step }}
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
      <v-col cols="6" class="mb-12">
        <ValidationObserver ref="observer">
          <v-form>
            <v-container>
              <span class="subtitle font-weight-bold grey--text text--darken-1 text-uppercase">
                Configuración
              </span>
              <v-row>
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" name="Paso" rules="required">
                    <v-text-field
                        v-model="step"
                        label="Describe el paso"
                        :error-messages="errors"
                        required
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    clearable
                    v-model="filters.text"
                    label="Busca por texto"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    clearable
                    v-model="filters.category"
                    :items="['Trámites','Salud','Transporte','Ocio']"
                    label="Busca por categoria"
                    multiple
                    persistent-hint
                  ></v-select>
                </v-col>
              </v-row>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header v-bind:class="{'grey lighten-4': action}" expand-icon="mdi-menu-down" :disable-icon-rotate="action !== null">
                    <template v-slot:actions v-if="action">
                      <v-icon color="teal">
                        mdi-check
                      </v-icon>
                    </template>
                    Acción
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <div v-if="!getImages(4).length" class="mt-4">
                        No existen coincidencias con tu búsqueda
                      </div>
                      <v-row>
                        <v-col cols="4" v-for="image in getImages(4)" v-bind:key="image.id">
                          <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': action && image.id == action.id }"  @click="setImage('action', image)" />
                          <span>{{ image.label }}</span>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header v-bind:class="{'grey lighten-4': subject}" expand-icon="mdi-menu-down" :disable-icon-rotate="subject !== null">
                    <template v-slot:actions v-if="subject">
                      <v-icon color="teal">
                        mdi-check
                      </v-icon>
                    </template>
                    Persona
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <div v-if="!getImages(1).length" class="mt-4">
                        No existen coincidencias con tu búsqueda
                      </div>
                      <v-row>
                        <v-col cols="4" v-for="image in getImages(1)" v-bind:key="image.id">
                          <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': subject && image.id == subject.id }"  @click="setImage('subject', image)" />
                          <span>{{ image.label }}</span>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header v-bind:class="{'grey lighten-4': landmark}" expand-icon="mdi-menu-down" :disable-icon-rotate="landmark !== null">
                    <template v-slot:actions v-if="landmark">
                      <v-icon color="teal">
                        mdi-check
                      </v-icon>
                    </template>
                    Objeto
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <div v-if="!getImages(2).length" class="mt-4">
                        No existen coincidencias con tu búsqueda
                      </div>
                      <v-row>
                        <v-col cols="4" v-for="image in getImages(2)" v-bind:key="image.id">
                          <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': landmark && image.id == landmark.id }"  @click="setImage('landmark', image)" />
                          <span>{{ image.label }}</span>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header v-bind:class="{'grey lighten-4': context}" expand-icon="mdi-menu-down" :disable-icon-rotate="context !== null">
                    <template v-slot:actions v-if="context">
                      <v-icon color="teal">
                        mdi-check
                      </v-icon>
                    </template>
                    Espacio
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-container>
                      <div v-if="!getImages(3).length" class="mt-4">
                        No existen coincidencias con tu búsqueda
                      </div>
                      <v-row>
                        <v-col cols="4" v-for="image in getImages(3)" v-bind:key="image.id">
                          <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': context && image.id == context.id }"  @click="setImage('context', image)" />
                          <span>{{ image.label }}</span>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-container>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-footer fixed>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn class="mr-5" text color="primary" href="https://forms.gle/QdbvD3CgSrxN9VZS6" target="_blank">Envianos tus comentarios o sugerencias</v-btn>
          <v-btn outlined color="primary" @click="saveStep">Guardar paso</v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { required } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

export default {
  name: 'Step',
  components: { ValidationProvider, ValidationObserver, },
  data() {
    return {
      subject: null,
      landmark: null,
      context: null,
      action: null,
      step: '',
      filters: {
        text: null,
        category: null
      }
    };
  },
  beforeMount() {
    if(!this.$route.params.task) {
      this.$router.push('/tareas/');
    }
    this.$store.dispatch("setImages");
    if(this.$route.params.id) {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/steps/' + this.$route.params.id).then((response) => {
        this.step = response.data.label
        const picto = response.data.pictogram
        if(picto) {
          this.setImage('action', picto.images.find( i => i.layout === 4))
          this.setImage('context', picto.images.find( i => i.layout === 3))
          this.setImage('landmark', picto.images.find( i => i.layout === 2))
          this.setImage('subject', picto.images.find( i => i.layout === 1))
        }
      });
    }
  },
  methods: {
    getImages(layout) {
      let images = this.$store.getters.images.filter( i => i.layout == layout);
      if(this.filters.category?.length) {
        images = images.filter( i => i.categories.some( c => this.filters.category.includes(c) ) );
      }
      if(this.filters.text) {
        images = images.filter( i => i.label.toLowerCase().includes(this.filters.text.toLowerCase()) || i.tags.some( t => t.toLowerCase().includes(this.filters.text.toLowerCase()) ) );
      }
      return images;
    },
    setImage(type, image) {
      if(this[type] && this[type].id === image.id)
        this[type] = null;
      else
        this[type] = image
    },
    saveStep() {
      this.$refs.observer.validate().then( valid => {
        if(valid) {
          let images = []
          if(this.subject)
          images.push(this.subject.id)
          if(this.landmark)
          images.push(this.landmark.id)
          if(this.context)
          images.push(this.context.id)
          if(this.action)
          images.push(this.action.id)

          if(this.$route.params.id) {
            this.$http.put(process.env.VUE_APP_API_DOMAIN + 'api/steps/update', {
              images: images,
              label: this.step,
              id: this.$route.params.id
            }).then((response) => {
                this.$router.go(-1);
            });
          } else {
            this.$http.post(process.env.VUE_APP_API_DOMAIN + 'api/steps/store', {
              images: images,
              label: this.step,
              task_id: this.$route.params.task.id
            }).then((response) => {
                this.$router.push('/tareas/'+this.$route.params.task.id);
            });
          }
        }
      } )
    }
  },
};
</script>
<style lang="scss" scoped>
.slider__container {
  width: 90%;
  max-width: 100%;
  margin: auto;
}
.slider__container::v-deep .vueperslide__content-wrapper, .image__pictogram {
  border: 1px solid lightgray;
  cursor: pointer;
  max-width: 200px;
}

.slider__container::v-deep .vueperslide__content-wrapper.active, .image__pictogram.active {
  position: relative;
  border: 2px solid rgba(25, 117, 210, .6);
  transition: 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.slider__container::v-deep  .vueperslides__arrows--outside .vueperslides__arrow--prev {
  left: -2.8em;
}
.slider__container::v-deep  .vueperslides__arrows--outside .vueperslides__arrow--next {
  right: -2.8em;
}
.slider__container::v-deep  .vueperslides__arrow svg {
  width: 2em;
  padding: 0.5rem;
}
.container-preview {
  position: relative;
  width: 520px;
  margin: 0 auto;
}
.preview__pictos {
  position: relative;
  height: 400px;
  width: 520px;
  border: 1px solid lightgray;
}
.preview__pictos-action {
  position: relative;
  height: 200px;
  width: 200px;
  border: 1px solid lightgray;
}
.preview__pictos img,
.preview__pictos-action img {
  position: absolute;
  height: 100%;
  margin: 0 auto;
}
.slider__group {
  position: relative;
}
.slider__all {
  position: absolute;
  right: 12px;
  top: 12px;
}
.breadcrumbs {
    font-size: 1.5rem;
}
.breadcrumbs__link {
  text-decoration: none;
  &:after {
    content: '/';
    padding: 0 0.5rem;
    color: gray;
  }
}
.sticky-top {
    position: sticky;
    top: 5rem;
}
.sticky-top-2 {
    position: sticky;
    top: 9.3rem;
}
.subtitle {
  font-size: 0.9rem !important;
  letter-spacing: 0.166em;
}
.icon__pictogram {
  max-width: 70px;
}
</style>
