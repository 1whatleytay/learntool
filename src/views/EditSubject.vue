<template>
  <div class="mx-auto max-w-4xl p-4">
    <div class="font-light text-4xl mb-4 flex items-center">
      Edit Subject

      <router-link to="/subjects" class="ml-auto text-blue-500 hover:underline text-sm">
        Back
      </router-link>
    </div>

    <div class="text-xs text-gray-500 mt-4 mb-2">
      Subject Info
    </div>
    <div class="flex items-center">
      <input
        type="text"
        v-model="name"
        class="px-4 py-2 text-gray-700 w-full border rounded"
        placeholder="Untitled Subject"
      />

      <button class="w-8 h-8 rounded-lg ml-2" :class="[ `bg-${subject.tint}` ]" />
    </div>

    <div class="text-xs text-gray-500 mt-4 mb-2">
      Add Notes
    </div>
    <textarea
      class="w-full border rounded p-4 font-mono text-xs"
      rows="5"
      v-model="notes"
      placeholder="Paste notes here..."
    />

    <div v-if="hasGeneratedNotes">
      <div class="text-xs text-gray-500 mt-4 mb-2 pb-2 border-b border-red-500 text-red-700">
        Generated Notes
      </div>

      <div
        v-for="(definitions, name) of subject.definitions"
        :key="name"
        class="border rounded px-4 py-2 text-lg text-gray-700 my-4"
      >
        {{ name }}

        <ul class="pl-6">
          <li
            v-for="(definition, index) of definitions"
            :key="index"
            class="my-2 text-sm list-disc"
          >
            {{ definition }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import { computed } from 'vue'

export default {
  name: 'NewSubject',

  setup() {
    const store = useStore()
    const route = useRoute()

    const index = route.params.id
    const subject = store.state.subjects[index]

    return {
      subject: subject,

      name: computed({
        get() { return subject.name },
        set(name) { store.commit('subjectEditName', { index, name }) }
      }),

      notes: computed({
        get() { return subject.notes },
        set(notes) { store.commit('subjectEditNotes', { index, notes }) }
      }),

      hasGeneratedNotes: computed(() => Object.keys(subject.definitions).length)
    }
  }
}
</script>
