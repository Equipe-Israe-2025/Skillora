import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import NotificationView from './NotificationView.vue'

describe('NotificationView', () => {
  it('affiche le titre "Messages"', () => {
    const wrapper = mount(NotificationView)
    expect(wrapper.find('.page-title').text()).toBe('Messages')
  })

  it('affiche la liste des messages', () => {
    const wrapper = mount(NotificationView)
    const messageCards = wrapper.findAll('.message-card')
    expect(messageCards.length).toBe(3) // Vérifie qu'il y a 3 messages par défaut
  })

  it('affiche correctement les détails du message', () => {
    const wrapper = mount(NotificationView)
    const firstMessage = wrapper.find('.message-card')
    
    expect(firstMessage.find('.sender-name').text()).toBe('Admin')
    expect(firstMessage.find('.message-text').text()).toContain('Welcome to the KILLORA platform')
  })

  it('formate correctement le temps', () => {
    const wrapper = mount(NotificationView)
    const formatTime = wrapper.vm.formatTime
    
    const now = new Date()
    const thirtyMinutesAgo = new Date(now - 1000 * 60 * 30)
    const twoHoursAgo = new Date(now - 1000 * 60 * 60 * 2)
    const twoDaysAgo = new Date(now - 1000 * 60 * 60 * 24 * 2)
    
    expect(formatTime(thirtyMinutesAgo)).toMatch(/30 minutes ago/)
    expect(formatTime(twoHoursAgo)).toMatch(/2 hours ago/)
    expect(formatTime(twoDaysAgo)).toMatch(/2 days ago/)
  })

  it('permet de saisir une réponse', async () => {
    const wrapper = mount(NotificationView)
    const firstMessage = wrapper.find('.message-card')
    const replyInput = firstMessage.find('.reply-input')
    
    await replyInput.setValue('Test reply')
    expect(wrapper.vm.messages[0].replyText).toBe('Test reply')
  })

  it('désactive le bouton de réponse quand le texte est vide', () => {
    const wrapper = mount(NotificationView)
    const replyButton = wrapper.find('.reply-button')
    
    expect(replyButton.classes()).toContain('button-disabled')
    expect(replyButton.attributes('disabled')).toBeDefined()
  })

  it('ajoute une nouvelle réponse au message', async () => {
    const wrapper = mount(NotificationView)
    const firstMessage = wrapper.find('.message-card')
    const replyInput = firstMessage.find('.reply-input')
    const replyButton = firstMessage.find('.reply-button')
    
    await replyInput.setValue('New test reply')
    await replyButton.trigger('click')
    
    // Vérifie que la réponse a été ajoutée
    expect(wrapper.vm.messages[0].replies[wrapper.vm.messages[0].replies.length - 1].content).toBe('New test reply')
    // Vérifie que le champ de réponse a été vidé
    expect(wrapper.vm.messages[0].replyText).toBe('')
  })
})