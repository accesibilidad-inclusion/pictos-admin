<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>Servicios</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-btn to="services/create" color="primary">
          <v-icon>mdi-plus</v-icon> Agregar nuevo servicio
        </v-btn>
      </v-col>
      <v-col cols="2">
        <!--<v-autocomplete
          v-model="select"
          :loading="loading"
          :items="items"
          :search-input.sync="search"
          cache-items
          class="mx-4"
          flat
          hide-no-data
          hide-details
          label="What state are you from?"
          solo-inverted
        ></v-autocomplete>-->
        <v-autocomplete
          append-icon="mdi-magnify"
          placeholder="Buscar"
          cache-items
        >
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="entries"
          @click:row="showService"
        ></v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Services',
  components: { },
  methods: {
    showService(item, args) {
      console.log(item, args);
      // navegar a la vista de elemento
    },
  },
  beforeMount() {
    console.log('beforeMount: manda petición a la API');
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
          text: 'Transporte',
          value: 'category',
        },
        {
          text: 'Estado',
          value: 'status',
        },
      ],
      entries: [
        {
          id: 1,
          name: 'Metro de Valparaíso',
          category: 'Transporte',
          places: 13,
          status: 'Borrador',
        },
      ],
    };
  },
};
</script>
