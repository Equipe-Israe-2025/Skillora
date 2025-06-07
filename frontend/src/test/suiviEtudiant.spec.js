import { mount } from '@vue/test-utils'
import SuiviEtudiant from './suiviEtudiant.vue'
import { describe, it, expect } from 'vitest'

describe('SuiviEtudiant', () => {
    const wrapper = mount(SuiviEtudiant)

    it('affiche les informations de l\'étudiant correctement', () => {
        expect(wrapper.find('.student-info p').text()).toBe('El Ayddouni Assaad')
        expect(wrapper.findAll('.student-info p')[1].text()).toBe('assaad@gmail.com')
    })

    it('affiche le résultat global', () => {
        const resultCard = wrapper.find('.result-card')
        expect(resultCard.findAll('p')[1].text()).toBe('4,25/5')
        expect(resultCard.findAll('p')[2].text()).toBe('Mention: Bien')
    })

    it('affiche la liste des compétences', () => {
        const skills = wrapper.findAll('.skill-row')
        expect(skills).toHaveLength(3)
    })

    it('affiche correctement les détails de chaque compétence', () => {
        const skills = wrapper.findAll('.skill-row')
        
        // Vérifier la première compétence
        const firstSkill = skills[0]
        expect(firstSkill.findAll('.skill-value')[0].text()).toBe('communication')
        expect(firstSkill.findAll('.skill-value')[1].text()).toBe('4/5')
        expect(firstSkill.findAll('.skill-value')[2].text()).toBe('bien')

        // Vérifier la deuxième compétence
        const secondSkill = skills[1]
        expect(secondSkill.findAll('.skill-value')[0].text()).toBe('creativity')
        expect(secondSkill.findAll('.skill-value')[1].text()).toBe('3/5')
        expect(secondSkill.findAll('.skill-value')[2].text()).toBe('moyenne')

        // Vérifier la troisième compétence
        const thirdSkill = skills[2]
        expect(thirdSkill.findAll('.skill-value')[0].text()).toBe('coding')
        expect(thirdSkill.findAll('.skill-value')[1].text()).toBe('5/5')
        expect(thirdSkill.findAll('.skill-value')[2].text()).toBe('très bien')
    })

    it('vérifie la présence de l\'avatar', () => {
        expect(wrapper.find('.avatar svg').exists()).toBe(true)
    })

    it('vérifie le style responsive', () => {
        expect(wrapper.find('.student-card').classes()).toContain('student-card')
        expect(wrapper.find('.header').classes()).toContain('header')
        expect(wrapper.find('.skills').classes()).toContain('skills')
    })
})