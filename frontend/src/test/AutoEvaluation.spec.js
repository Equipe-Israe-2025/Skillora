import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AutoEvaluation from '../Etudiant/AutoEvaluation.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('AutoEvaluation.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Setup mock router
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })

    // Mock DynamicSidebar component
    vi.mock('../DynamicSidebar.vue', () => ({
      default: {
        name: 'DynamicSidebar',
        template: '<div class="sidebar-mock"></div>'
      }
    }))
  })
  it('affiche les bonnes lignes de compétences', () => {
    const wrapper = mount(AutoEvaluation)

    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(4)
    expect(rows[0].text()).toContain('compétance1')
    expect(rows[1].text()).toContain('compétance2')
  })

  it('modifie les valeurs des inputs', async () => {
    const wrapper = mount(AutoEvaluation)
    const firstNoteInput = wrapper.findAll('input[type="number"]')[0]
    const firstCommentInput = wrapper.findAll('input[type="text"]')[0]

    await firstNoteInput.setValue(15)
    await firstCommentInput.setValue("Très bien")

    expect(wrapper.vm.evaluations[0].note).toBe(15)
    expect(wrapper.vm.evaluations[0].commentaire).toBe("Très bien")
  })

  it('appelle saveEvaluations et affiche une alerte', async () => {
    const wrapper = mount(AutoEvaluation)

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const logMock = vi.spyOn(console, 'log').mockImplementation(() => {})

    await wrapper.find('button.save-button').trigger('click')

    expect(alertMock).toHaveBeenCalledWith("Évaluation enregistrée !")
    expect(logMock).toHaveBeenCalledWith("Évaluations enregistrées :", wrapper.vm.evaluations)

    alertMock.mockRestore()
    logMock.mockRestore()
  })
})
