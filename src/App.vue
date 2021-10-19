<template>
  <div id="app">
    <router-view/>

    <NoteEditForm v-if="show" />
  </div>
</template>

<script>
import NoteEditForm from '@/components/NoteEditForm';

export default {
  name: 'App',
  components: {
    NoteEditForm
  },
  computed: {
    show() {
      return this.$store.state.noteEditFormShow;
    },
  }
}
</script>

