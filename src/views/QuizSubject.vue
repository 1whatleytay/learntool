<template>
  <div class="mx-auto max-w-4xl p-4 flex flex-col h-screen">
    <div class="border-b py-4 mb-8 font-light flex items-center">
      <div>
        Quiz: {{ subject.name || 'Untitled Subject' }}
      </div>
      <div class="ml-auto font-medium flex items-center">
        <div class="text-green-600 flex items-center ml-4" v-if="state.correct > 0">
          <CheckCircle class="w-4 h-4 text-green-500 mr-2" />
          {{ state.correct }}
        </div>

        <div class="text-red-600 flex items-center ml-4" v-if="state.total - state.correct > 0">
          <XCircle class="w-4 h-4 text-red-500 mr-2" />
          {{ state.total - state.correct }}
        </div>

        <div class="text-blue-600 flex items-center ml-4"  v-if="questionsLeft > 0">
          <QuestionMarkCircle class="w-4 h-4 text-blue-500 mr-2" />
          {{ questionsLeft }}
        </div>
      </div>
    </div>

    <div v-if="state.finish" class="text-center text-gray-700">
      <div class="text-xl">
        <div v-if="state.total === 0">
          {{ subject.name }} Quiz Finished.
        </div>
        <div v-else>
          {{ subject.name }} Quiz Finished With <span class="font-medium">%{{ Math.round(grade * 100) }}.</span>
        </div>
      </div>

      <div class="mt-4 font-light text-base" v-if="subjectIsEmpty">
        <Pencil class="w-6 h-6 text-gray-600 inline" />
        Add notes by hitting the pencil button on the main page.
      </div>

      <div v-else>
        <div class="text-md text-green-700 mt-4">
          <CheckCircle class="w-6 h-6 text-green-500 inline" />
          {{ state.correct }} questions answered correctly.
        </div>

        <div class="text-md text-red-700">
          <XCircle class="w-6 h-6 text-red-500 inline" />
          {{ state.total - state.correct }} questions answered incorrectly.
        </div>

        <div class="text-md text-blue-700" v-if="questionsLeft > 0">
          <QuestionMarkCircle class="w-6 h-6 text-blue-500 inline" />
          {{ questionsLeft }} questions not answered.
        </div>
      </div>

      <router-link to="/subjects">
        <button
          class="text-base bg-gray-200 shadow text-gray-900 rounded w-24 py-2 active:bg-gray-300 active:text-black transition-colors transition-opacity duration-200 mt-8"
        >
          Return
        </button>
      </router-link>
    </div>

    <div class="overflow-y-scroll" v-else>
      <div
        class="font-medium mb-4 flex items-center"
        :class="{
          'text-gray-700': !state.showResults,
          'text-green-500': state.showResults && isAllCorrect,
          'text-red-500': state.showResults && !isAllCorrect
        }"
      >
        <QuestionMarkCircle class="w-6 h-6 text-gray-600 mr-2" v-if="!state.showResults" />
        <CheckCircle class="w-6 h-6 mr-2" v-else-if="isAllCorrect" />
        <XCircle class="w-6 h-6 mr-2" v-else />

        {{ state.current.question }}
        (Select {{ state.current.correct.length === 1 ? 'One' : state.current.correct.length }})
      </div>

      <div
        v-for="(answer, index) of state.current.answers"
        :key="index"
        class="list-disc text-gray-700 my-4 flex items-center font-light"
      >
        <button
          @click="select(index)"
          class="rounded-full border p-2 mx-4 transition-colors duration-200 focus:outline-none focus:border-blue-500"
          :class="{
            'border-white bg-green-300': isSelected(index) && (!state.showResults || isCorrect(answer)),
            'border-white bg-red-300': isSelected(index) && state.showResults && !isCorrect(answer),
            'text-green-900': isSelected(index) && state.showResults && isCorrect(answer),
            'text-red-900': isSelected(index) && state.showResults && !isCorrect(answer),

            'hover:bg-green-100': !isSelected(index),
            'text-green-500': !isSelected(index) && state.showResults && isCorrect(answer)
          }"
        >
          <Check class="w-4 h-4" v-if="!state.showResults || state.current.correct.includes(answer)" />
          <X class="w-4 h-4" v-else />
        </button>
        {{ answer }}
      </div>
    </div>

    <div class="w-full mt-auto border-t py-4 bg-white flex" v-if="!state.finish">
      <button
        class="text-gray-500 hover:underline px-4"
        @click="state.finish = true"
      >
        End Quiz
      </button>

      <div class="ml-auto">
        <button
          class="bg-gray-200 shadow text-gray-900 rounded w-24 py-2 active:bg-gray-300 active:text-black transition-colors transition-opacity duration-200 mr-4"
          :class="{ 'opacity-50 cursor-not-allowed': state.gainedPoints }"
          @click="next(true)"
        >
          Skip
        </button>

        <button
          class="bg-green-200 shadow text-green-900 rounded w-24 py-2 active:bg-green-300 active:text-black transition-colors transition-opacity duration-200"
          :class="{ 'opacity-50 cursor-not-allowed': !isReady }"
          @click="next(false)"
        >
          Check
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import makeQuestion from '@/scripts/question'

import Pencil from 'heroicons/outline/pencil.svg'

import X from 'heroicons/outline/x.svg'
import Check from 'heroicons/outline/check.svg'
import XCircle from 'heroicons/outline/x-circle.svg'
import CheckCircle from 'heroicons/outline/check-circle.svg'
import QuestionMarkCircle from 'heroicons/outline/question-mark-circle.svg'

export default {
  name: 'QuizSubject',

  components: { Pencil, X, Check, XCircle, CheckCircle, QuestionMarkCircle },

  setup() {
    const route = useRoute()
    const store = useStore()

    const numQuestions = route.query.questions || 10

    const index = route.params.id
    const subject = store.state.subjects[index]

    const subjectIsEmpty = computed(() => !Object.keys(subject.definitions).length)

    const state = reactive({
      current: subjectIsEmpty.value ? null : makeQuestion(subject.definitions),
      selected: [],

      showResults: false,
      gainedPoints: false,

      correct: 0,
      total: 0,

      finish: subjectIsEmpty.value
    })

    const grade = computed(() => state.correct / state.total)
    const isReady = computed(() => state.selected.length === state.current.correct.length)
    const isAllCorrect = computed(() => state.selected
      .map(x => state.current.answers[x])
      .filter(x => state.current.correct.includes(x))
      .length === state.current.correct.length
    )
    const questionsLeft = computed(() => numQuestions - state.total)

    return {
      next(skip) {
        if (skip ? state.gainedPoints : !isReady.value) {
          return
        }

        if (!state.showResults) {
          if (!skip) {
            if (isAllCorrect.value) {
              state.correct++
            }

            state.total++

            state.gainedPoints = true
          }

          state.showResults = true
        } else {
          if (questionsLeft.value <= 0) {
            state.finish = true
          } else {
            state.current = makeQuestion(subject.definitions)
            state.selected = []
            state.gainedPoints = false
            state.showResults = false
          }
        }
      },

      select(index) {
        if (state.showResults) {
          return
        }

        const i = state.selected.indexOf(index)

        if (i !== -1) {
          state.selected.splice(i, 1)
        } else {
          if (state.selected.length >= state.current.correct.length) {
            state.selected.splice(0, 1)
          }
          state.selected.push(index)
        }
      },

      isSelected(index) {
        return state.selected.includes(index)
      },

      isCorrect(answer) {
        return state.current.correct.includes(answer)
      },

      grade,
      isReady,
      isAllCorrect,
      questionsLeft,
      subjectIsEmpty,

      subject,

      state
    }
  }
}
</script>
