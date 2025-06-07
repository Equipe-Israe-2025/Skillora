import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProfileView from './ProfileView.vue'

describe('ProfileView', () => {
  it('affiche le titre "Profil Administrateur"', () => {
    const wrapper = mount(ProfileView)
    expect(wrapper.find('.page-title').text()).toBe('Profil Administrateur')
  })

  it('affiche correctement les informations de l\'administrateur', () => {
    const wrapper = mount(ProfileView)
    const admin = wrapper.vm.admin

    expect(wrapper.find('.profile-name').text()).toBe(`${admin.firstName} ${admin.lastName}`)
    expect(wrapper.find('.profile-role').text()).toBe(admin.role)
    expect(wrapper.find('.info-value').text()).toBe(admin.email)
  })

  it('affiche correctement les initiales dans l\'avatar', () => {
    const wrapper = mount(ProfileView)
    const initials = wrapper.vm.getInitials('Assaad', 'El Ayddouni')
    expect(initials).toBe('AE')
    expect(wrapper.find('.avatar-text').text()).toBe('AE')
  })

  it('ouvre la modal de modification du mot de passe', async () => {
    const wrapper = mount(ProfileView)
    await wrapper.find('.btn-secondary').trigger('click')
    expect(wrapper.vm.showPasswordModal).toBe(true)
  })

  it('ouvre la modal de modification du profil', async () => {
    const wrapper = mount(ProfileView)
    await wrapper.find('.btn-primary').trigger('click')
    expect(wrapper.vm.showProfileModal).toBe(true)
  })

  describe('Validation du formulaire de mot de passe', () => {
    it('valide le formulaire de mot de passe avec des données valides', () => {
      const wrapper = mount(ProfileView)
      wrapper.vm.passwordForm = {
        currentPassword: 'currentPass123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      }
      expect(wrapper.vm.validatePasswordForm()).toBe(true)
      expect(wrapper.vm.passwordErrors).toEqual({})
    })

    it('détecte les erreurs dans le formulaire de mot de passe', () => {
      const wrapper = mount(ProfileView)
      wrapper.vm.passwordForm = {
        currentPassword: '',
        newPassword: 'short',
        confirmPassword: 'different'
      }
      expect(wrapper.vm.validatePasswordForm()).toBe(false)
      expect(Object.keys(wrapper.vm.passwordErrors).length).toBeGreaterThan(0)
    })
  })

  describe('Validation du formulaire de profil', () => {
    it('valide le formulaire de profil avec des données valides', () => {
      const wrapper = mount(ProfileView)
      wrapper.vm.profileForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      }
      expect(wrapper.vm.validateProfileForm()).toBe(true)
      expect(wrapper.vm.profileErrors).toEqual({})
    })

    it('détecte les erreurs dans le formulaire de profil', () => {
      const wrapper = mount(ProfileView)
      wrapper.vm.profileForm = {
        firstName: '',
        lastName: '',
        email: 'invalid-email'
      }
      expect(wrapper.vm.validateProfileForm()).toBe(false)
      expect(Object.keys(wrapper.vm.profileErrors).length).toBeGreaterThan(0)
    })
  })

  it('met à jour le profil avec succès', async () => {
    const wrapper = mount(ProfileView)
    wrapper.vm.profileForm = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }
    await wrapper.vm.updateProfile()
    expect(wrapper.vm.admin.firstName).toBe('John')
    expect(wrapper.vm.admin.lastName).toBe('Doe')
    expect(wrapper.vm.admin.email).toBe('john.doe@example.com')
    expect(wrapper.vm.showSuccessMessage).toBe(true)
  })

  it('valide correctement le format d\'email', () => {
    const wrapper = mount(ProfileView)
    expect(wrapper.vm.validateEmail('test@example.com')).toBe(true)
    expect(wrapper.vm.validateEmail('invalid-email')).toBe(false)
    expect(wrapper.vm.validateEmail('')).toBe(false)
  })
})