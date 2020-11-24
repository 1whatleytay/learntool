import { createRouter, createWebHistory } from 'vue-router'

import Subjects from '@/views/Subjects'
import EditSubject from '@/views/EditSubject'
import QuizSubject from '@/views/QuizSubject'

const routes = [
  {
    path: '/subjects',
    name: 'Subjects',
    component: Subjects
  },
  {
    path: '/subjects/:id/edit',
    name: 'EditSubject',
    component: EditSubject
  },
  {
    path: '/subjects/:id:/quiz',
    name: 'QuizSubject',
    component: QuizSubject
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
