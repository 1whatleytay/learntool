import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import parseArrow from '@/scripts/arrow'

const colors = [
  'red-300',
  'yellow-300',
  'orange-300',
  'green-300',
  'teal-300',
  'purple-300',
  'pink-300',
]

export default createStore({
  state: {
    subjects: [
      { name: 'Economics', tint: 'red-300', notes: '', definitions: { } },
      { name: 'Chemistry', tint: 'orange-300', notes: '', definitions: { } },
      { name: 'Accounting', tint: 'purple-300', notes: '', definitions: { } }
    ]
  },

  mutations: {
    subjectMakeNew(state) {
      state.subjects.push({
        name: '',
        tint: colors[Math.floor(Math.random() * colors.length)],
        notes: '',
        definitions: { }
      })
    },

    subjectEditName(state, { index, name }) {
      state.subjects[index].name = name
    },

    subjectEditNotes(state, { index, notes }) {
      state.subjects[index].notes = notes
      state.subjects[index].definitions = parseArrow(notes)
    }
  },

  actions: {
  },

  modules: {
  },

  plugins: [createPersistedState()]
})
