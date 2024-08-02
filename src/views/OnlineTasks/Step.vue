<template>
  <v-layout v-if="loading" justify-center align-center fill-height>
    <v-progress-circular :size="48" color="primary" indeterminate></v-progress-circular>
  </v-layout>
  <div v-else>
    <v-col cols="12" class="d-flex align-center breadcrumbs">
      <router-link to="/tareas-en-internet/" class="breadcrumbs__link"
        ><v-icon large class="blue--text text--darken-2">mdi-chevron-left</v-icon> Tareas
        Web</router-link
      >
      <router-link :to="'/tareas-en-internet/' + webTask.id" class="breadcrumbs__link">
        {{ webTask.title }}
      </router-link>
      <span v-if="!$route.params.id">Crear paso</span>
      <span v-else>Editar paso</span>
    </v-col>
    <v-row>
      <v-col cols="6">
        <v-container class="sticky-top-2 d-flex flex-column justify-center">
          <div class="container-preview mb-12">
            <v-row align="center" justify="start" class="mt-3">
              <div class="container-img-preview">
                <img
                  id="imgPreview"
                  class="img-preview"
                  :src="img_base64"
                  alt=""
                  :style="hasFocus ? 'opacity:0.5' : ''"
                />
                <img
                  id="imgPreviewFocus"
                  :style="cssVars"
                  class="img-preview-focus"
                  :src="img_base64"
                  alt=""
                />
              </div>
            </v-row>
            <v-row align="center" justify="center" class="mt-3">
              <v-col v-if="action" cols="2">
                <img :src="action.path + '/' + action.filename" class="icon__pictogram" />
              </v-col>
              <v-col :cols="action ? 8 : 12" class="headline font-weight-bold">
                {{ step }}
              </v-col>
            </v-row>
            <v-row class="mt-3" v-if="originalStep">
              <v-col cols="12" class="d-flex justify-space-around">
                <v-btn outlined color="primary" @click="move(previous)" :disabled="edited || !previous">Anterior</v-btn>
                <v-btn outlined color="primary" @click="move(next)" :disabled="edited || !next">Siguiente</v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-3" v-if="originalStep && edited">
              <v-col cols="12" class="d-flex justify-center">
                <v-alert type="warning" prominent dense text outlined>
                  <v-row align="center">
                    <v-col  class="grow">
                      Para poder ir a los otros pasos debes guardar tus cambios.
                    </v-col>
                    <v-col  class="shrink">
                      <v-btn small outlined class="text-capitalize" color="warning" @click="dismiss()">Descartar cambios</v-btn>
                    </v-col>
                  </v-row>
                </v-alert>
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
                <v-col cols="12">
                  <ValidationProvider v-slot="{ errors }" name="Url" rules="required|url">
                    <v-text-field
                      v-model="url"
                      label="Url del paso"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
              <v-row class="align-center">
                <v-col cols="6">
                  <v-file-input
                    accept="image/*"
                    label="Sube una imagen"
                    v-model="image"
                    :clearable="false"
                  ></v-file-input>
                </v-col>
                <v-col cols="3">
                  <v-btn v-if="img_base64" small color="error" @click="clearImage()">
                    Quitar imagen <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="3">
                  <v-checkbox
                    v-if="img_base64"
                    v-model="hasFocus"
                    label="Agregar Foco"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-row v-if="hasFocus">
                <v-col cols="4">
                  <v-subheader class="pl-0">
                    Tamaño del foco
                  </v-subheader>
                  <v-slider v-model="focusSize"></v-slider>
                </v-col>
                <v-col cols="4">
                  <v-subheader class="pl-0">
                    Posición horizontal
                  </v-subheader>
                  <v-slider v-model="xPosition"></v-slider>
                </v-col>
                <v-col cols="4">
                  <v-subheader class="pl-0">
                    Posición vertical
                  </v-subheader>
                  <v-slider v-model="yPosition"></v-slider>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-expansion-panels>
                    <v-expansion-panel>
                      <v-expansion-panel-header
                        v-bind:class="{ 'grey lighten-4': action }"
                        expand-icon="mdi-menu-down"
                        :disable-icon-rotate="action !== null"
                      >
                        <template v-slot:actions v-if="action">
                          <v-icon color="teal">
                            mdi-check
                          </v-icon>
                        </template>
                        Icono
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-container>
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
                                :items="['Trámites', 'Salud', 'Transporte', 'Ocio']"
                                label="Busca por categoria"
                                multiple
                                persistent-hint
                              ></v-select>
                            </v-col>
                          </v-row>
                          <div v-if="!getImages(4).length" class="mt-4">
                            No existen coincidencias con tu búsqueda
                          </div>
                          <v-row>
                            <v-col cols="2" v-for="image in getImages(4)" v-bind:key="image.id">
                              <img
                                class="image__pictogram"
                                :src="image.path + '/' + image.filename"
                                v-bind:class="{ active: action && image.id === action.id }"
                                @click="setImage('action', image)"
                              />
                              <span>{{ image.label }}</span>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="grey--text text--darken-2 pb-2">Detalles del paso</div>
                  <tiptap-vuetify v-model="details" :extensions="extensions" />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </ValidationObserver>
      </v-col>
    </v-row>
    <v-footer fixed>
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn outlined color="primary" @click="saveStep">Guardar paso</v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { required } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";
import WebTask from "../../models/WebTask";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from "tiptap-vuetify";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "El campo {_field_} es obligatorio"
});

export default {
  name: "OnlineStep",
  components: { ValidationProvider, ValidationObserver, TiptapVuetify },
  data() {
    return {
      webTask: new WebTask(),
      image: null,
      img_base64: null,
      hasFocus: false,
      focusSize: 50,
      xPosition: 50,
      yPosition: 50,
      action: null,
      details: "",
      url: "",
      step: "",
      originalStep: null,
      filters: {
        text: null,
        category: null
      },
      loading: true,
      extensions: [
        History,
        Blockquote,
        Link,
        Underline,
        Strike,
        Italic,
        ListItem,
        BulletList,
        OrderedList,
        [
          Heading,
          {
            options: {
              levels: [1, 2, 3]
            }
          }
        ],
        Bold,
        Code,
        HorizontalRule,
        Paragraph,
        HardBreak
      ]
    };
  },
  watch: {
    image: function(newVal, oldVal) {
      if (newVal) {
        this.createBase64Image(newVal);
      } else {
        this.img_base64 = null;
      }
    }
  },
  async created() {
    await this.$store.dispatch("setImages");
    let response = await this.$http.get(
      process.env.VUE_APP_API_DOMAIN + "api/online_tasks/" + this.$route.params.online_task_id
    );
    const webTask = {...response.data};
    webTask.web_steps = webTask.steps;
    this.webTask.set(webTask);
    if (this.$route.params.id) {
      response = await this.$http.get(
        process.env.VUE_APP_API_DOMAIN + "api/online_steps/" + this.$route.params.id
      );
      this.originalStep = response.data;
      this.step = response.data.label;
      this.url = response.data.url;
      this.details = response.data.details;
      this.img_base64 = response.data.screenshot_url
        ? process.env.VUE_APP_API_DOMAIN + response.data.screenshot_url
        : null;
      if (response.data.focus_size) {
        this.hasFocus = true;
        this.focusSize = response.data.focus_size;
        this.xPosition = response.data.focus_x;
        this.yPosition = response.data.focus_y;
      }
      const picto = response.data.image_id;
      if (picto) {
        this.setImage(
          "action",
          this.$store.getters.images.filter(i => i.layout == 4).find(i => i.id == picto)
        );
      }
    }
    this.loading = false;
  },
  computed: {
    previous() {
      if (this.currentIndex === 0) {
        return false;
      } else {
        return this.webTask.web_steps[this.currentIndex - 1].id;
      }
    },
    next() {
      if (this.currentIndex === this.webTask.web_steps.length - 1) {
        return false;
      } else {
        return this.webTask.web_steps[this.currentIndex + 1].id;
      }
    },
    currentIndex() {
      return this.webTask.web_steps.findIndex(s => s.id === this.originalStep.id);
    },
    cssVars() {
      return {
        "--size-clip": this.focusSize + "%",
        "--x-position": this.xPosition + "%",
        "--y-position": this.yPosition + "%"
      };
    },
    edited() {
      if (this.originalStep) {
        const dirtyLabel = this.originalStep.label !== this.step;
        const dirtyUrl = this.originalStep.url !== this.url;
        const dirtyDetails = this.originalStep.details !== this.details;
        const dirtyImage = (!!this.originalStep.screenshot_url && process.env.VUE_APP_API_DOMAIN + this.originalStep.screenshot_url !== this.img_base64) || (!this.originalStep.screenshot_url && !!this.img_base64);
        const dirtyFocusSize = this.originalStep.focus_size !== this.focusSize && this.hasFocus;
        const dirtyXPosition = this.originalStep.focus_x !== this.xPosition && this.hasFocus;
        const dirtyYPosition = this.originalStep.focus_y !== this.yPosition && this.hasFocus;
        const dirtyHasFocus = !!this.originalStep.focus_size !== this.hasFocus;
        const dirtyAction = (this.originalStep.image_id && (!this.action || this.originalStep.image_id !== this.action.id)) || (!this.originalStep.image_id && !!this.action);
        return (
          dirtyLabel ||
          dirtyUrl ||
          dirtyDetails ||
          dirtyImage ||
          dirtyFocusSize ||
          dirtyXPosition ||
          dirtyYPosition ||
          dirtyHasFocus ||
          dirtyAction
        );
      }
      return false;
    },
  },
  methods: {
    createBase64Image(FileObject) {
      const reader = new FileReader();
      reader.onload = event => {
        this.img_base64 = event.target.result;
      };
      reader.readAsDataURL(FileObject);
    },
    getImages(layout) {
      let images = this.$store.getters.images.filter(i => i.layout == layout);
      if (this.filters.category?.length) {
        images = images.filter(i => i.categories.some(c => this.filters.category.includes(c)));
      }
      if (this.filters.text) {
        images = images.filter(
          i =>
            i.label.toLowerCase().includes(this.filters.text.toLowerCase()) ||
            i.tags.some(t => t.toLowerCase().includes(this.filters.text.toLowerCase()))
        );
      }
      return images;
    },
    setImage(type, image) {
      if (this[type] && this[type].id === image.id) this[type] = null;
      else this[type] = image;
    },
    move(step) {
      this.$router.push({
        path: "/tareas-en-internet/" + this.webTask.id + "/paso/" + step
      });
    },
    dismiss() {
      if (this.originalStep) {
        this.step = this.originalStep.label;
        this.url = this.originalStep.url;
        this.details = this.originalStep.details;
        if(!!this.originalStep.screenshot_url && process.env.VUE_APP_API_DOMAIN + this.originalStep.screenshot_url !== this.img_base64) {
          this.img_base64 = process.env.VUE_APP_API_DOMAIN + this.originalStep.screenshot_url;
        }
        if(!this.originalStep.screenshot_url && !!this.img_base64){
          this.img_base64 = null;
        }
        this.focusSize = this.originalStep.focus_size ?? 50;
        this.xPosition = this.originalStep.focus_x ?? 50;
        this.yPosition = this.originalStep.focus_y ?? 50;
        this.hasFocus = !!this.originalStep.focus_size;
        if(this.originalStep.image_id && (!this.action || this.originalStep.image_id !== this.action.id)) {
          this.setImage('action', this.$store.getters.images.filter(i => i.layout == 4).find( i => i.id === this.originalStep.image_id));
        }
        if(!this.originalStep.image_id && !!this.action) {
          this.setImage('action', this.$store.getters.images.filter(i => i.layout == 4).find( i => i.id === this.action.id));
        }
      }
    },
    saveStep() {
      this.$refs.observer.validate().then(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.$http
              .put(process.env.VUE_APP_API_DOMAIN + "api/online_steps/update", {
                image: this.action?.id,
                screenshot: this.img_base64,
                label: this.step,
                url: this.url,
                focus_size: this.hasFocus ? this.focusSize : null,
                focus_x: this.hasFocus ? this.xPosition : null,
                focus_y: this.hasFocus ? this.yPosition : null,
                details: this.details,
                id: this.$route.params.id
              })
              .then(response => {
                this.originalStep = response.data;
                this.img_base64 = response.data.screenshot_url
                  ? process.env.VUE_APP_API_DOMAIN + response.data.screenshot_url
                  : null;
                this.$toast.success("Este paso ha sido actualizado");
              });
          } else {
            this.$http
              .post(process.env.VUE_APP_API_DOMAIN + "api/online_steps/store", {
                image: this.action?.id,
                screenshot: this.img_base64,
                label: this.step,
                url: this.url,
                focus_size: this.hasFocus ? this.focusSize : null,
                focus_x: this.hasFocus ? this.xPosition : null,
                focus_y: this.hasFocus ? this.yPosition : null,
                details: this.details,
                online_task_id: this.$route.params.online_task_id
              })
              .then(response => {
                this.$toast.success("El paso ha sido creado");
                this.$router.push({
                  path: "/tareas-en-internet/" + this.webTask.id
                });
              });
          }
        }
      });
    },
    clearImage() {
      this.image = null;
      this.img_base64 = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.slider__container {
  width: 90%;
  max-width: 100%;
  margin: auto;
}
.slider__container::v-deep .vueperslide__content-wrapper,
.image__pictogram {
  border: 1px solid lightgray;
  cursor: pointer;
  max-width: 100%;
}

.slider__container::v-deep .vueperslide__content-wrapper.active,
.image__pictogram.active {
  position: relative;
  border: 2px solid rgba(25, 117, 210, 0.6);
  transition: 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.slider__container::v-deep .vueperslides__arrows--outside .vueperslides__arrow--prev {
  left: -2.8em;
}
.slider__container::v-deep .vueperslides__arrows--outside .vueperslides__arrow--next {
  right: -2.8em;
}
.slider__container::v-deep .vueperslides__arrow svg {
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
    content: "/";
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

.img-preview-focus {
  position: absolute;
  -webkit-clip-path: circle(var(--size-clip) at var(--x-position) var(--y-position));
  clip-path: circle(var(--size-clip) at var(--x-position) var(--y-position));
  max-width: 600px;
  left: -12px;
}
.img-preview {
  max-width: 600px;
  vertical-align: middle;
}
.container-img-preview {
  background-color: black;
}
</style>
