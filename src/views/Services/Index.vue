<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Servicios</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-dialog
          v-model="dialog"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" color="primary">
              <v-icon>mdi-plus</v-icon> Agregar nuevo servicio
            </v-btn>
          </template>

          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
            Agregar nuevo servicio
            </v-card-title>

            <ValidationObserver ref="observer">
              <v-form>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <ValidationProvider v-slot="{ errors }" name="Nombre" rules="required|max:100">
                        <v-text-field
                          v-model="newName"
                          label="Nombre del servicio"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <ValidationProvider v-slot="{ errors }" name="Categoria" rules="required">
                        <v-autocomplete
                          v-model="newCategory"
                          :items="categories"
                          :error-messages="errors"
                          hide-no-data
                          hide-selected
                          item-text="name"
                          item-value="id"
                          label="Categoria"
                          return-object
                        ></v-autocomplete>
                      </ValidationProvider>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        v-model="newTags"
                        label="Sinónimos de búsqueda (Separados por coma)"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </ValidationObserver>
            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="grey"
                text
                @click="closeModal"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="addService"
              >
                Crear servicio
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col cols="2">
        <v-autocomplete
          append-icon="mdi-magnify"
          placeholder="Buscar"
          cache-items
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-layout v-if="!entries" justify-center>
      <v-progress-circular
        :size="70"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-layout>
    <v-row v-else>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="entries"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td><router-link :to="'/servicios/'+item.id">{{ item.name }}</router-link></td>
                <td>{{ item.category }}</td>
                <td>{{ item.count_venues }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </template>
      </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';
import { required, max } from 'vee-validate/dist/rules';
import {
  extend, ValidationObserver, ValidationProvider, setInteractionMode,
} from 'vee-validate';

setInteractionMode('eager');

extend('required', {
  ...required,
  message: 'El campo {_field_} es obligatorio',
});

extend('max', {
  ...max,
  message: 'El campo {_field_} no puede ser mas largo que {length} caracteres',
});


export default {
  name: 'Services',
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  beforeMount() {
    axios.get('http://pictos-backend.lo/api/services').then((response) => {
      this.entries = response.data;
    });
    axios.get('http://pictos-backend.lo/api/categories/list').then((response) => {
      this.categories = response.data;
    });
  },
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
          align: 'start',
        },
        {
          text: 'Servicio',
          value: 'name',
        },
        {
          text: 'Categoría',
          value: 'category',
        },
        {
          text: 'Cantidad de lugares',
          value: 'count_venues',
        },
        {
          text: 'Estado',
          value: 'status',
        },
      ],
      entries: null,
      pagination: {},
      dialog: false,
      newName: '',
      newCategory: null,
      newTags: '',
      categories: [],
    };
  },
  methods: {
    addService() {
      this.$refs.observer.validate();
      axios.post('http://pictos-backend.lo/api/services/store', {
        name: this.newName,
        category_id: this.newCategory.id,
        tags: this.newTags,
      }).then((response) => {
        axios.get('http://pictos-backend.lo/api/services').then((response) => {
          this.entries = response.data;
        });
        this.dialog = false;
        this.newName = '';
        this.newCategory = null;
        this.newTags = '';
        this.$refs.observer.reset();
      });
    },
    closeModal() {
      this.dialog = false;
      this.$refs.observer.reset();
      this.newName = '';
      this.newCategory = null;
      this.newTags = '';
    },
  },
};
</script>
