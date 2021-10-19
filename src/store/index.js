import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import constants from '../constants';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes: [],
    notesLoading: true,
    addedNotesLoading: false,
    notesError: null,
    noteEditFormShow: false,
    selectedNoteColor: null,
    selectedNote: null,
    notesPageLimit: 20,
    notesCurrentPage: 1,
    moreNoteButtonShow: true,
    searchFinished: true,
  },
  mutations: {
    setNotes: (state, payload) => state.notes = payload,
    addNotesToStart: (state, payload) => {
      if (state.notes.length > 0)
        state.notes.splice(0, 0, ...payload);
      else {
        state.notes.push(...payload);
      }
    },
    addNotesToEnd: (state, payload) => {
        state.notes.push(...payload);
    },
    changeNote: (state, payload) => {
      const arr = [...state.notes];
      arr[arr.findIndex(f => f.id == payload.id)] = payload;
      state.notes = arr;
    },
    removeNote: (state, payload) => {
      const arr = [...state.notes];
      const noteIndex = arr.findIndex(f => f.id == payload);
      arr.splice(noteIndex, 1);
      state.notes = arr;
    },
    setNotesLoading: (state, payload) => state.notesLoading = payload,
    setSearchFinished: (state, payload) => state.searchFinished = payload,
    setAddedNotesLoading: (state, payload) => state.addedNotesLoading = payload,
    setNotesError: (state, payload) => state.notesError = payload,
    setNoteEditFormShow: (state, payload) => state.noteEditFormShow = payload,
    setSelectedNoteColor: (state, payload) => state.selectedNoteColor = payload,
    setSelectedNote: (state, payload) => state.selectedNote = payload,
    setNotesCurrentPage: (state, payload) => state.notesCurrentPage = payload,
    setMoreNoteButtonShow: (state, payload) => state.moreNoteButtonShow = payload,
  },
  actions: {
    fetchNotes({ commit, state }, searchStr = null) {
      if (!searchStr)
        commit('setNotesLoading', true);
      else
        commit('setSearchFinished', false);

      axios.get(constants.baseUrl + constants.endpoints.note + (searchStr ? `?like=${searchStr}` : `?page=1&limit=${state.notesPageLimit}`))
        .then(response => {
          if (response.status == 200) {
            commit('setNotes', response.data);
            commit('setMoreNoteButtonShow', response.data.length == state.notesPageLimit);
            commit('setNotesCurrentPage', 1);
          }
          else {
            commit('setMoreNoteButtonShow', false);
          }
        })
        .catch(error => commit('setNotesError', error))
        .finally(() => {
          commit('setNotesLoading', false);
          commit('setSearchFinished', true);
        });
    },
    fetchAndAddToNotes({ commit, state }) {
      commit('setAddedNotesLoading', true);
      
      axios.get(constants.baseUrl + constants.endpoints.note + `?page=${state.notesCurrentPage}&limit=${state.notesPageLimit}`)
        .then(response => {
          if (response.status == 200) {
            commit('addNotesToEnd', response.data);
            commit('setMoreNoteButtonShow', response.data.length == state.notesPageLimit);
          }
          else
            commit('setMoreNoteButtonShow', false);
        })
        .catch(error => commit('setNotesError', error))
        .finally(() => commit('setAddedNotesLoading', false));
    },
    toggleNoteEditForm({ commit, state }, note) {
      commit('setNoteEditFormShow', !state.noteEditFormShow);

      if (note) {
        commit('setSelectedNote', note);
      } else {
        commit('setSelectedNote', null);
      }
    },
    notesNextPage({ commit, state }) {
      commit('setNotesCurrentPage', state.notesCurrentPage + 1);
    }
  },
  modules: {
  }
})
