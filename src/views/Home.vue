<template>
  <div>
    <!-- Search Box -->
    <SearchBox v-if="!notesLoading && !notesError && notes.length > 0" />

    <!-- Loading indicators -->
    <div v-if="notesLoading" class="note-grid">
      <LoadingNoteCard v-for="(card, index) in 10" :key="index"  />
    </div>

    <!-- Error Message -->
    <div v-else-if="notesError" class="notes-loading-error">
      <h1>Server Error!</h1>
      <h3>Please Try Again Later!</h3>
    </div>

    <!-- Notes -->
    <NoteGrid v-else-if="notes.length > 0" :notes="notes" />

    <!-- If there is no note -->
    <div v-else class="notes-completed-icon">
      <span class="material-icons">task</span>
    </div>

    <!-- Load More Notes Button -->
    <button v-if="!notesLoading && !notesError && notes.length > 0 && moreNoteButtonShow" @click="loadMoreNotes" class="more-button">
      <span class="material-icons">more_horiz</span>
    </button>

    <!-- Note Add Button -->
    <NoteAddButton @click.native="showNoteEditForm()" />

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import NoteGrid from '@/components/NoteGrid';
import LoadingNoteCard from '@/components/LoadingNoteCard';
import NoteAddButton from '@/components/NoteAddButton';
import SearchBox from '@/components/SearchBox';

export default {
  name: 'Home',
  components: {
    NoteGrid,
    LoadingNoteCard,
    NoteAddButton,
    SearchBox
  },
  computed: {
    ...mapState([
      'notes',
      'notesError',
      'notesLoading',
      'moreNoteButtonShow'
    ]),
  },
  mounted() {
    this.fetchNotes(null);
  },
  methods: {
    ...mapActions([
      'fetchNotes',
      'fetchAndAddToNotes',
      'notesNextPage'
    ]),
    loadMoreNotes() {
      // Next page (offset = page * limit)
      this.notesNextPage();
      // Fetch notes and add note list
      this.fetchAndAddToNotes();
    },
    showNoteEditForm() {
      this.$store.dispatch('toggleNoteEditForm', null);
    }
  },
}
</script>

<style scoped>
.notes-loading-error {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    color: #fff;
    gap: 1rem;
    text-align: center;
    justify-content: center;
}

.notes-completed-icon {
    text-align: center;
    position: fixed;
    top: 50%;
    left: 50%;
}
    .notes-completed-icon span {
        font-size: 72px;
        color: #03e503;
    }

.more-button {
    padding: 1rem;
    border-radius: 5px;
    display: block;
    width: 10rem;
    margin: 1rem auto;
    cursor: pointer;
}
    .more-button:hover {
        opacity: .6;
    }

    .more-button span {
        font-size: 48px;
    }
</style>
