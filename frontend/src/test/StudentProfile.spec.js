import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StudentProfile from './StudentProfile.vue'

describe('StudentProfile.vue', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Mock des composants
    vi.mock('@/components/DynamicSidebar.vue', () => ({
      default: {
        name: 'DynamicSidebar',
        template: '<div class="sidebar-mock"></div>'
      }
    }))

    vi.mock('./ProfileCard.vue', () => ({
      default: {
        name: 'ProfileCard',
        template: '<div class="profile-card-mock"></div>',
        props: ['student']
      }
    }))

    // Mock de setTimeout
    vi.useFakeTimers()

    wrapper = mount(StudentProfile)
  })

  it('affiche le titre correct', () => {
    expect(wrapper.find('h1').text()).toBe('Profil Étudiant')
  })

  it('affiche le message de chargement initialement', () => {
    expect(wrapper.find('.text-gray-500').text()).toBe('Chargement des informations...')
    expect(wrapper.find('.profile-card-mock').exists()).toBe(false)
  })

  it('charge les données et affiche ProfileCard après le délai', async () => {
    expect(wrapper.vm.isLoaded).toBe(false)
    
    // Avance le temps de 1 seconde
    await vi.advanceTimersByTime(1000)
    
    expect(wrapper.vm.isLoaded).toBe(true)
    expect(wrapper.find('.profile-card-mock').exists()).toBe(true)
    expect(wrapper.vm.student).toEqual({
      username: 'Username',
      cin: 'G400887',
      phone: '06**75**74',
      address: 'Boukhalef, Tanger',
      birthDate: '12/09/1993',
      group: 'Ginf1'
    })
  })

  it('passe les bonnes props à ProfileCard après chargement', async () => {
    await vi.advanceTimersByTime(1000)
    
    const profileCard = wrapper.findComponent({ name: 'ProfileCard' })
    expect(profileCard.props('student')).toEqual(wrapper.vm.student)
  })
})