<template>
  <div class="mx-auto max-w-4xl p-4">
    <div class="font-light text-4xl mb-4">
      Subjects
    </div>

    <div class="flex flex-wrap justify-around">
      <router-link
        v-for="(subject, index) of subjects"
        tag="button"
        :to="`/subjects/${index}/quiz`"
        :key="index"
        class="w-48 h-48 border rounded-lg mb-4 mr-4 flex flex-wrap items-start overflow-hidden relative group"
      >
        <router-link
          tag="button"
          :to="`/subjects/${index}/edit`"
          class="opacity-0 transition-opacity duration-200 group-hover:opacity-100 rounded-full border p-2 top-0 mx-4 mt-6 right-0 absolute"
        >
          <Pencil class="w-4 h-4" />
        </router-link>

        <div class="w-full h-2" :class="[`bg-${subject.tint}`]" />
        <div class="text-3xl text-gray-700 flex items-end text-left p-4 w-full h-full">
          {{ subject.name || 'Untitled Subject' }}
        </div>
      </router-link>

      <button
        @click="routeNew"
        class="w-48 h-48 flex flex-wrap items-center justify-center border rounded-lg mb-4 mr-4"
      >
        <div class="font-light text-gray-700 text-lg">
          <Plus class="w-8 h-8 text-gray-700 mx-auto mb-1" />
          New Subject
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import Plus from 'heroicons/outline/plus.svg'
import Pencil from 'heroicons/outline/pencil.svg'

export default {
  name: 'Home',

  components: { Plus, Pencil },

  setup() {
    const store = useStore()
    const router = useRouter()

    return {
      routeNew() {
        store.commit('subjectMakeNew')

        router.push({
          path: `/subjects/${store.state.subjects.length - 1}/edit`
        })
      },

      subjects: store.state.subjects
    }
  }
}
</script>
