<template>
  <div>
    <template v-if="preview">
      <div class="container">
        <div class="preview__pictos">
          <img v-if="context" :src="context.path + '/' + context.filename" />
          <img v-if="landmark" :src="landmark.path + '/' + landmark.filename" />
          <img v-if="subject" :src="subject.path + '/' + subject.filename" />
        </div>
        <v-row>
          <v-col cols="12">
            <v-btn text small @click="preview = false">Volver a editar</v-btn>
            <v-btn text outlined @click="saveStep">Aceptar</v-btn>
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-else>
      <div class="slider__container">
        <v-row>
          <v-col cols="12">
            <h3>Espacio</h3>
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
        <v-row>
          <v-col cols="12">
            <h3>Objeto</h3>
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
        <v-row>
          <v-col cols="12">
            <h3>Persona</h3>
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
        <v-row>
          <v-col cols="12">
            <v-btn text outlined @click="preview = true">Previsualizar</v-btn>
          </v-col>
        </v-row>
      </div>
    </template>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from 'vueperslides'
import 'vueperslides/dist/vueperslides.css'

export default {
  name: 'AddStep',
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      subject: null,
      landmark: null,
      context: null,
      preview: false
    };
  },
  mounted() {
  },
  methods: {
    setImage(type, image) {
      this[type] = image
    },
    saveStep() {

    }
  },
};
</script>
<style scoped>
.slider__container {
  width: 90%;
  max-width: 100%;
  margin: auto;
}
.slider__container::v-deep .vueperslide__content-wrapper {
  border: 1px solid lightgray;
  cursor: pointer;
}

.slider__container::v-deep .vueperslide__content-wrapper.active {
  border: 1px solid black;
}
.preview__pictos {
  position: relative;
  height: 700px;
}
.preview__pictos img {
  position: absolute;
  height: 100%;
}
</style>