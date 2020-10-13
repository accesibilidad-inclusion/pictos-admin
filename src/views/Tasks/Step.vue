<template>
  <div>
    <v-col cols="12" class="d-flex align-center breadcrumbs">
      <router-link to="/tareas/" class="breadcrumbs__link"><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Tareas</router-link>
      <router-link :to="'/tareas/' + $route.params.task.id" class="breadcrumbs__link"> {{ $route.params.task.title }} </router-link>
      <span v-if="!$route.params.id">Crear paso</span>
      <span v-else>Editar paso</span>
    </v-col>
    <template v-if="preview">
      <v-container>
        <v-row>
          <v-col cols="12 headline">
          {{ step }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div class="preview__pictos blue lighten-5">
              <img v-if="context" :src="context.path + '/' + context.filename" />
              <img v-if="landmark" :src="landmark.path + '/' + landmark.filename" />
              <img v-if="subject" :src="subject.path + '/' + subject.filename" />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-4 d-flex justify-end align-center">
            <v-btn text large color="primary" @click="preview = false" class="mr-3">Volver a editar</v-btn>
            <v-btn outlined large color="primary" @click="saveStep">Aceptar</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-else>
      <ValidationObserver ref="observer">
        <v-form>
          <v-container>
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
          </v-container>
        </v-form>
      </ValidationObserver>
      <div class="slider__container">
        <v-row>
          <v-col cols="12" class="slider__group">
            <h3 class="mb-3">Espacio</h3>
            <v-dialog
              v-model="dialogContext"
              width="1200"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" small text color="primary" class="slider__all">
                  Ver todos
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  Selecciona un pictograma para espacio
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="3" v-for="image in $store.getters.images.filter( i => i.layout == 3)" v-bind:key="image.id">
                      <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': context && image.id == context.id }"  @click="setImage('context', image)" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn text outlined @click="dialogContext = false">Seleccionar pictograma</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <vueper-slides
              class="no-shadow"
              :visible-slides="5"
              :slide-ratio="1 / 8"
              slide-multiple
              arrows-outside
              :gap="2"
              :touchable="false"
              :bullets="false">
              <vueper-slide
                v-for="image in $store.getters.images.filter( i => i.layout == 3)"
                :key="image.id"
                :image="image.path + '/' + image.filename" >
                <template v-slot:content>
                  <div class="vueperslide__content-wrapper" v-bind:class="{ 'active': context && image.id == context.id }"  @click="setImage('context', image)">
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </v-col>
        </v-row>
        <v-row class="mt-7">
          <v-col cols="12" class="slider__group">
            <h3 class="mb-3">Objeto</h3>
            <v-dialog
              v-model="dialogLandmark"
              width="1200"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" small text color="primary" class="slider__all">
                  Ver todos
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  Selecciona un pictograma para objeto
                </v-card-title>
                <v-container class="px-6 py-6">
                  <v-row>
                    <v-col cols="3" v-for="image in $store.getters.images.filter( i => i.layout == 2)" v-bind:key="image.id">
                      <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': landmark && image.id == landmark.id }"  @click="setImage('landmark', image)" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn text outlined @click="dialogLandmark = false">Seleccionar pictograma</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <vueper-slides
              class="no-shadow"
              :visible-slides="5"
              :slide-ratio="1 / 8"
              slide-multiple
              arrows-outside
              :gap="2"
              :touchable="false"
              :bullets="false">
              <vueper-slide
                v-for="image in $store.getters.images.filter( i => i.layout == 2)"
                :key="image.id"
                :image="image.path + '/' + image.filename" >
                <template v-slot:content>
                  <div class="vueperslide__content-wrapper" v-bind:class="{ 'active': landmark && image.id == landmark.id }"  @click="setImage('landmark', image)">
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </v-col>
        </v-row>
        <v-row class="mt-7">
          <v-col cols="12" class="slider__group">
            <h3 class="mb-3">Persona</h3>
            <v-dialog
              v-model="dialogSubject"
              width="1200"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" small text color="primary" class="slider__all">
                  Ver todos
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2" primary-title>
                  Selecciona un pictograma para persona
                </v-card-title>
                <v-container>
                  <v-row>
                    <v-col cols="3" v-for="image in $store.getters.images.filter( i => i.layout == 1)" v-bind:key="image.id">
                      <img class="image__pictogram" :src="image.path + '/' + image.filename" v-bind:class="{ 'active': subject && image.id == subject.id }"  @click="setImage('subject', image)" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-btn text outlined @click="dialogSubject = false">Seleccionar pictograma</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-dialog>
            <vueper-slides
              class="no-shadow"
              :visible-slides="5"
              :slide-ratio="1/8"
              slide-multiple
              arrows-outside
              :gap="2"
              :touchable="false"
              :bullets="false">
              <vueper-slide
                v-for="image in $store.getters.images.filter( i => i.layout == 1)"
                :key="image.id"
                :image="image.path + '/' + image.filename" >
                <template v-slot:content>
                  <div class="vueperslide__content-wrapper" v-bind:class="{ 'active': subject && image.id == subject.id }"  @click="setImage('subject', image)">
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn outlined color="primary" @click="showPreview">Previsualizar</v-btn>
          </v-col>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'
import { required } from 'vee-validate/dist/rules';
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

export default {
  name: 'Step',
  components: { VueperSlides, VueperSlide, ValidationProvider, ValidationObserver, },
  data() {
    return {
      subject: null,
      landmark: null,
      context: null,
      preview: false,
      dialogContext: false,
      dialogLandmark: false,
      dialogSubject: false,
      step: ''
    };
  },
  beforeMount() {
    if(this.$route.params.id) {
      this.$http.get(process.env.VUE_APP_API_DOMAIN + 'api/steps/' + this.$route.params.id).then((response) => {
        console.log(response)
        this.step = response.data.label
        const picto = response.data.pictogram
        if(picto) {
          this.setImage('context', picto.images.find( i => i.layout === 3))
          this.setImage('landmark', picto.images.find( i => i.layout === 2))
          this.setImage('subject', picto.images.find( i => i.layout === 1))
        }
      });
    }
  },
  methods: {
    setImage(type, image) {
      this[type] = image
    },
    showPreview() {
      this.$refs.observer.validate().then( valid => {
        if(valid) {
          this.preview = true
        }
      } )
    },
    saveStep() {
      let images = []
      if(this.subject)
       images.push(this.subject.id)
      if(this.landmark)
       images.push(this.landmark.id)
      if(this.context)
       images.push(this.context.id)

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
          task_id: this.$route.params.task_id
        }).then((response) => {
            this.$router.push('/tareas/'+this.$route.params.task_id);
        });
      }
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
.preview__pictos {
  position: relative;
  height: 700px;
  border: 1px solid #64B5F6;
}
.preview__pictos img {
  position: absolute;
  height: 100%;
  right: 0;
  left: 0;
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
</style>
