import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import InscriptionView from './InscriptionView.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('InscriptionView.vue', () => {
  let wrapper
  let pinia
  let router

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    wrapper = mount(InscriptionView, {
      global: {
        plugins: [router, pinia]
      }
    })
  })

  beforeEach(() => {
    wrapper = mount(InscriptionView)
    // Mock des méthodes
    wrapper.vm.editUser = vi.fn()
    wrapper.vm.confirmDeleteUser = vi.fn()
  })

  it('devrait afficher le titre correct', () => {
    expect(wrapper.find('.page-title').text()).toBe('Gestion des Utilisateurs')
  })

  it('devrait avoir une barre de recherche fonctionnelle', async () => {
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('test')
    expect(wrapper.vm.searchQuery).toBe('test')
  })

  it('devrait afficher le bouton d\'ajout d\'utilisateur', () => {
    const addButton = wrapper.find('.btn-primary')
    expect(addButton.exists()).toBe(true)
    expect(addButton.text()).toContain('Nouvel utilisateur')
  })

  it('devrait changer d\'onglet actif', async () => {
    const tabs = wrapper.findAll('.tab')
    await tabs[1].trigger('click')
    expect(wrapper.vm.activeTab).not.toBe('student')
  })

  it('devrait filtrer les utilisateurs selon la recherche', async () => {
    await wrapper.setData({
      users: [
        { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean@test.com', studentId: '12345', level: 'L3' },
        { id: 2, firstName: 'Marie', lastName: 'Martin', email: 'marie@test.com', studentId: '67890', level: 'M1' }
      ],
      searchQuery: 'Jean'
    })

    expect(wrapper.vm.filteredUsers.length).toBe(1)
    expect(wrapper.vm.filteredUsers[0].firstName).toBe('Jean')
  })

  it('devrait afficher le message "aucun résultat" quand la recherche ne donne rien', async () => {
    await wrapper.setData({
      users: [],
      searchQuery: 'test'
    })

    const noResults = wrapper.find('.no-results-text')
    expect(noResults.exists()).toBe(true)
    expect(noResults.text()).toContain('Aucun')
  })

  it('devrait appeler la méthode editUser lors du clic sur le bouton modifier', async () => {
    const user = { id: 1, firstName: 'Jean', lastName: 'Dupont' }
    await wrapper.setData({
      users: [user]
    })

    const editButton = wrapper.find('.action-btn.edit')
    await editButton.trigger('click')
    
    expect(wrapper.vm.editUser).toHaveBeenCalledWith(user)
  })

  it('devrait appeler la méthode confirmDeleteUser lors du clic sur le bouton supprimer', async () => {
    const user = { id: 1, firstName: 'Jean', lastName: 'Dupont' }
    await wrapper.setData({
      users: [user]
    })

    const deleteButton = wrapper.find('.action-btn.delete')
    await deleteButton.trigger('click')
    
    expect(wrapper.vm.confirmDeleteUser).toHaveBeenCalledWith(user)
  })
})