<template>
  <v-card>
    <v-card-title class="font-weight-regular grey lighten-4" primary-title>
      <span>{{ object.form().title }}</span>
    </v-card-title>

    <ValidationObserver ref="observer">
      <v-form>
        <v-container class="px-7">
          <v-row>
            <v-col
              cols="12"
              v-for="(field, index) in object.form().fields"
              v-bind:key="index"
              class="pb-2"
            >
              <div v-if="field.type == 'read'">
                <div class="grey--text text--darken-2">{{ field.label }}</div>
                <div>{{ field.value ? object[field.id][field.value] : object[field.id] }}</div>
              </div>
              <div v-if="field.type == 'iteration'">
                <div v-for="it in object[field.id]" v-bind:key="it.id">
                  <v-text-field v-model="it[field.value]" :label="field.label"></v-text-field>
                </div>
              </div>
              <div v-if="field.type == 'pictograms'" class="pt-3">
                <v-row v-for="it in object[field.id]" v-bind:key="it.id" class="mb-6 mx-1">
                  <v-col cols="6" class="preview__pictos blue lighten-5 pa-0">
                    <img
                      v-for="image in it.pictogram.images"
                      :class="'pictogram__image pictogram__image--layer-' + image.layout"
                      :src="image.path + '/' + image.filename"
                      v-bind:key="image.id"
                    />
                  </v-col>
                  <v-col cols="6" class="d-flex align-center pl-6">{{ it.step.label }}</v-col>
                </v-row>
              </div>
              <GoogleMap
                v-if="field.type == 'map'"
                :position="object[field.id]"
                v-on:update-position="setPosition"
              />
              <ValidationProvider v-slot="{ errors }" :name="field.name" :rules="field.rules">
                <v-text-field
                  v-if="field.type == 'text'"
                  v-model="object[field.id]"
                  :label="field.label"
                  :error-messages="errors"
                  required
                ></v-text-field>
                <div v-if="field.type == 'switch'">
                  <v-switch v-model="object[field.id]" :label="field.label"></v-switch>
                </div>
                <div v-if="field.type == 'wysiwyg' && object['hasPrerequisites']">
                  <div class="grey--text text--darken-2 pb-2">{{ field.label }}</div>
                  <tiptap-vuetify v-model="object[field.id]" :extensions="extensions" />
                  <div
                    v-if="errors.length"
                    class="mt-3 v-messages theme--light error--text"
                    role="alert"
                  >
                    <div class="v-messages__wrapper">
                      <div class="v-messages__message">{{ errors[0] }}</div>
                    </div>
                  </div>
                </div>
                <v-autocomplete
                  v-if="field.type == 'select'"
                  v-model="object[field.id]"
                  :items="getData(field)"
                  :error-messages="errors"
                  hide-no-data
                  hide-selected
                  item-text="name"
                  item-value="id"
                  :label="field.label"
                  return-object
                ></v-autocomplete>
                <v-autocomplete
                  v-if="field.type == 'multiselect' && field.condition"
                  v-model="object[field.id]"
                  :items="$store.getters[field.data]"
                  :error-messages="errors"
                  :label="field.label"
                  chips
                  item-text="name"
                  item-value="id"
                  return-object
                  multiple
                >
                  <template v-slot:selection="data">
                    <v-chip
                      v-bind="data.attrs"
                      :input-value="data.selected"
                      close
                      @click="data.select"
                      @click:close="remove(data.item, field.id)"
                    >
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content v-text="data.item"></v-list-item-content>
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-title v-html="data.item.name"></v-list-item-title>
                        <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </ValidationProvider>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </ValidationObserver>
    <v-divider></v-divider>

    <v-card-actions class="px-5 pb-6 pt-4">
      <v-spacer></v-spacer>
      <div v-for="(action, index) in object.form().actions" :key="index">
        <v-btn text :color="action.color" @click="handleAction(action)">{{ action.label }}</v-btn>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import GoogleMap from "./GoogleMap";
import { required, max } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from "vee-validate";
import axios from "axios";
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

extend("max", {
  ...max,
  message: "El campo {_field_} no puede ser mas largo que {length} caracteres"
});

extend("url", {
  validate: str => {
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

    var pattern = new RegExp(expression);
    return !!pattern.test(str);
  },
  message: "El campo no es una URL valida"
});
extend("unique_email", {
  message: "El campo {_field_} ya esta registrado.",
  validate: (value, args) => {
    return axios
      .post(process.env.VUE_APP_API_DOMAIN + "api/users/email_check", { email: value, id: args })
      .then(exist => {
        return {
          valid: !exist.data
        };
      });
  }
});

export default {
  name: "Form",
  props: ["object"],
  components: {
    ValidationProvider,
    ValidationObserver,
    GoogleMap,
    TiptapVuetify
  },
  data() {
    return {
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
  methods: {
    async handleAction(action) {
      if (
        (this.object["prerequisites"] &&
          this.object["prerequisites"].replace(/(<([^>]+)>)/gi, "") === "") ||
        !this.object["hasPrerequisites"]
      )
        this.object["prerequisites"] = "";
      await this.$refs.observer.validate();
      if (action.confirm) {
        if (confirm(action.confirm)) this[action.callback](action);
      } else {
        this[action.callback](action);
      }
    },
    request(action) {
      if (action.validate) {
        this.$refs.observer.validate().then(valid => {
          if (valid) {
            this.$http[action.method](
              process.env.VUE_APP_API_DOMAIN + action.url,
              this.object
            ).then(response => {
              this.$emit(action.emit);
              this.$refs.observer.reset();
            });
          }
        });
      } else {
        this.$http[action.method](process.env.VUE_APP_API_DOMAIN + action.url, this.object).then(
          response => {
            this.$emit(action.emit);
          }
        );
      }
    },
    cancel(action) {
      this.$emit("cancel");
      this.$refs.observer.reset();
    },
    setPosition(position) {
      this.object.position = position;
    },
    remove(item, id) {
      const index = this.object[id].map(o => o.id).indexOf(item.id);
      if (index >= 0) this.object[id].splice(index, 1);
    },
    getData(field) {
      return field.parent
        ? this.object[field.parent]
          ? this.$store.getters[
              this.object.form().fields.find(f => f.id === field.parent).data
            ].find(p => p.id === this.object[field.parent].id)[field.data]
          : []
        : this.$store.getters[field.data];
    }
  }
};
</script>
<style scoped>
.preview__pictos {
  position: relative;
  height: 180px;
}
.preview__pictos img {
  position: absolute;
  height: 100%;
  right: 0;
  left: 0;
  margin: 0 auto;
  &.pictogram__image--layer-4 {
    max-height: 48px;
    max-width: 48px;
    right: unset;
    left: calc(100% + 25px);
  }
}
</style>
