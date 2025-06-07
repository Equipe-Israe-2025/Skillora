import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import CompetenceView from './CompetenceView.vue'

describe('CompetenceView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CompetenceView)
  })

  it('devrait initialiser les données correctement', () => {
    expect(wrapper.vm.title).toBe('')
    expect(wrapper.vm.description).toBe('')
    expect(wrapper.vm.indice).toBe(-1)
    expect(wrapper.vm.saveMode).toBe(false)
    expect(wrapper.vm.inputVide).toBe(false)
    expect(wrapper.vm.competences).toEqual([])
  })

  it('devrait ajouter une nouvelle compétence', async () => {
    // Préparer les données de test
    await wrapper.setData({
      title: 'Vue.js',
      description: 'Framework JavaScript progressif'
    })

    // Simuler le clic sur le bouton d'ajout
    await wrapper.find('.add-button').trigger('click')

    // Vérifier que la compétence a été ajoutée
    expect(wrapper.vm.competences).toHaveLength(1)
    expect(wrapper.vm.competences[0]).toEqual({
      title: 'Vue.js',
      description: 'Framework JavaScript progressif'
    })

    // Vérifier que les champs sont réinitialisés
    expect(wrapper.vm.title).toBe('')
    expect(wrapper.vm.description).toBe('')
  })

  it('devrait afficher un message d\'erreur si les champs sont vides', async () => {
    // Simuler le clic sur le bouton d'ajout avec des champs vides
    await wrapper.find('.add-button').trigger('click')

    // Vérifier que le message d'erreur est affiché
    expect(wrapper.vm.inputVide).toBe(true)
    expect(wrapper.text()).toContain('les champs doit être remplis')
  })

  it('devrait supprimer une compétence', async () => {
    // Ajouter une compétence
    await wrapper.setData({
      competences: [{
        title: 'Vue.js',
        description: 'Framework JavaScript progressif'
      }]
    })

    // Simuler le clic sur le bouton de suppression
    await wrapper.find('.delete-button').trigger('click')

    // Vérifier que la compétence a été supprimée
    expect(wrapper.vm.competences).toHaveLength(0)
  })

  it('devrait modifier une compétence', async () => {
    // Ajouter une compétence initiale
    await wrapper.setData({
      competences: [{
        title: 'Vue.js',
        description: 'Framework JavaScript progressif'
      }]
    })

    // Simuler le clic sur le bouton de modification
    await wrapper.find('.edit-button').trigger('click')

    // Vérifier que le mode modification est activé
    expect(wrapper.vm.saveMode).toBe(true)
    expect(wrapper.vm.title).toBe('Vue.js')
    expect(wrapper.vm.description).toBe('Framework JavaScript progressif')

    // Modifier les valeurs
    await wrapper.setData({
      title: 'Vue.js 3',
      description: 'Framework JavaScript moderne'
    })

    // Sauvegarder les modifications
    await wrapper.find('.add-button').trigger('click')

    // Vérifier que la compétence a été modifiée
    expect(wrapper.vm.competences[0]).toEqual({
      title: 'Vue.js 3',
      description: 'Framework JavaScript moderne'
    })
    expect(wrapper.vm.saveMode).toBe(false)
  })
})