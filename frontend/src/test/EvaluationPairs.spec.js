import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import EvaluationPairs from '../Etudiant/EvaluationPairs.vue'

describe('EvaluationPairs.vue', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(EvaluationPairs)
  })

  it('affiche la liste des groupes', () => {
    const rows = wrapper.findAll('.group-list tbody tr')
    expect(rows.length).toBe(5)
    expect(rows[0].text()).toContain('Groupe A')
  })

  it('affiche les étudiants du groupe sélectionné', async () => {
    await wrapper.findAll('.group-list tbody tr')[0].trigger('click')

    const studentRows = wrapper.findAll('.student-list tbody tr')
    expect(wrapper.vm.selectedGroup).toBe(1)
    expect(studentRows.length).toBe(5)
    expect(studentRows[0].text()).toContain('Dupont')
  })

  it('affiche le formulaire d\'évaluation après sélection d\'un étudiant', async () => {
    await wrapper.findAll('.group-list tbody tr')[0].trigger('click')
    await wrapper.findAll('.student-list tbody tr')[0].trigger('click')

    expect(wrapper.find('.evaluation-form').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toContain('Dupont Alice')
  })

  it('remplit les notes/commentaires et sauvegarde', async () => {
    await wrapper.findAll('.group-list tbody tr')[0].trigger('click')
    await wrapper.findAll('.student-list tbody tr')[0].trigger('click')

    const noteInput = wrapper.findAll('input[type="number"]')[0]
    const commentInput = wrapper.findAll('input[type="text"]')[0]

    await noteInput.setValue(18)
    await commentInput.setValue('Très bon travail')

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const logMock = vi.spyOn(console, 'log').mockImplementation(() => {})

    await wrapper.find('button.save-button').trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Évaluation enregistrée pour Dupont')
    // Update the expectation to match the actual implementation
    expect(logMock).toHaveBeenCalledWith('Évaluation de', {
      id: 1,
      nom: 'Dupont',
      prenom: 'Alice'
    })
    // Add expectation for the second log call
    expect(logMock).toHaveBeenCalledWith('Détails:', [
      { label: 'compétance1', note: 18, commentaire: 'Très bon travail' },
      { label: 'compétance2', note: '', commentaire: '' },
      { label: 'compétance3', note: '', commentaire: '' },
      { label: 'compétance4', note: '', commentaire: '' }
    ])
    // Check that selectedEtudiant is reset after logging
    expect(wrapper.vm.selectedEtudiant).toBe(null)

    alertMock.mockRestore()
    logMock.mockRestore()
  })
})
