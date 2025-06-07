import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProfileCard from './ProfileCard.vue'

describe('ProfileCard.vue', () => {
  const mockStudent = {
    username: 'John Doe',
    cin: 'AB123456',
    phone: '0612345678',
    address: '123 Rue Example',
    birthDate: '1990-01-01',
    group: 'Groupe A'
  }

  it('affiche le titre correct', () => {
    const wrapper = mount(ProfileCard, {
      props: {
        student: mockStudent,
        isLoaded: true
      }
    })
    expect(wrapper.find('h2').text()).toBe('Informations personnelles')
  })

  it('affiche les informations de l\'étudiant quand isLoaded est true', () => {
    const wrapper = mount(ProfileCard, {
      props: {
        student: mockStudent,
        isLoaded: true
      }
    })

    const infoElements = wrapper.findAll('.col-right p')
    expect(infoElements[0].text()).toBe(mockStudent.username)
    expect(infoElements[1].text()).toBe(mockStudent.cin)
    expect(infoElements[2].text()).toBe(mockStudent.phone)
    expect(infoElements[3].text()).toBe(mockStudent.address)
    expect(infoElements[4].text()).toBe(mockStudent.birthDate)
    expect(infoElements[5].text()).toBe(mockStudent.group)
  })

  it('n\'affiche pas les informations quand isLoaded est false', () => {
    const wrapper = mount(ProfileCard, {
      props: {
        student: mockStudent,
        isLoaded: false
      }
    })

    const infoElements = wrapper.findAll('.col-right p')
    expect(infoElements.length).toBe(0)
  })

  it('n\'affiche pas les champs vides même si isLoaded est true', () => {
    const incompleteStudent = {
      username: 'John Doe',
      cin: '',
      phone: null,
      address: undefined,
      birthDate: '1990-01-01',
      group: 'Groupe A'
    }

    const wrapper = mount(ProfileCard, {
      props: {
        student: incompleteStudent,
        isLoaded: true
      }
    })

    const infoElements = wrapper.findAll('.col-right p')
    expect(infoElements.length).toBe(3) // username, birthDate et group sont définis
  })

  it('valide les props required', () => {
    const wrapper = mount(ProfileCard, {
      props: {
        student: mockStudent,
        isLoaded: true
      }
    })

    expect(wrapper.vm.$props.student).toBeDefined()
    expect(wrapper.vm.$props.isLoaded).toBeDefined()
  })
})