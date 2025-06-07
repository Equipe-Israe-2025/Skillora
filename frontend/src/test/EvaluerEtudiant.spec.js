import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import EvaluerEtudiant from './EvaluerEtudiant.vue'

describe('EvaluerEtudiant.vue', () => {
  let wrapper
  let router

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Configurer le router avec une route pour EvaluerEtudiant
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/evaluer/:id',
          name: 'evaluer-etudiant',
          component: EvaluerEtudiant
        }
      ]
    })

    // Mock DynamicSidebar component
    vi.mock('@/components/DynamicSidebar.vue', () => ({
      default: {
        name: 'DynamicSidebar',
        template: '<div class="sidebar-mock"></div>'
      }
    }))

    // Définir les paramètres de route avant le montage
    router.push('/evaluer/1')

    wrapper = mount(EvaluerEtudiant, {
      global: {
        plugins: [router]
      }
    })
  })

  it('affiche le titre correct', () => {
    expect(wrapper.find('h1').text()).toBe('Evaluation-pairs')
  })

  it('affiche les informations de l\'étudiant', async () => {
    // First wait for router to be ready before mounting
    await router.isReady()
    
    // Then mount the component
    wrapper = mount(EvaluerEtudiant, {
      global: {
        plugins: [router]
      }
    })
    
    // Finally wait for component updates
    await wrapper.vm.$nextTick()
    
    const nomComplet = `${wrapper.vm.etudiant.nom} ${wrapper.vm.etudiant.prenom}`
    expect(nomComplet).toBe('Dupont Alice')
  })

  it('permet de remplir les skills', async () => {
    await router.isReady()
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue(8)
    expect(wrapper.vm.skills.skill1).toBe(8)
  })

  it('permet d\'ajouter un commentaire', async () => {
    await router.isReady()
    const commentaire = 'Très bon travail'
    await wrapper.find('input[type="text"]').setValue(commentaire)
    expect(wrapper.vm.commentaire).toBe(commentaire)
  })

  it('permet de sauvegarder une évaluation', async () => {
    await router.isReady()
    
    // Remplir le formulaire
    await wrapper.find('input[type="number"]').setValue(8)
    await wrapper.find('input[type="text"]').setValue('Bon travail')
    
    // Espionner console.log
    const consoleSpy = vi.spyOn(console, 'log')
    
    // Cliquer sur le bouton de sauvegarde
    await wrapper.find('.save-button').trigger('click')
    
    expect(consoleSpy).toHaveBeenCalled()
  })
})