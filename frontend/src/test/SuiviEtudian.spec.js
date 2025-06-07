import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import SuiviEtudiant from './SuiviEtudiant.vue'
import Chart from 'chart.js/auto'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Mock des dépendances externes
vi.mock('chart.js/auto')
vi.mock('html2canvas')
vi.mock('jspdf')
vi.mock('@/components/DynamicSidebar.vue', () => ({
  default: {
    name: 'DynamicSidebar',
    template: '<div class="sidebar-mock"></div>'
  }
}))

describe('SuiviEtudiant', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SuiviEtudiant)
  })

  it('affiche le titre "Suivi de l\'étudiant"', () => {
    expect(wrapper.find('h1').text()).toBe('Suivi de l\'étudiant')
  })

  it('affiche la liste des compétences par défaut', () => {
    const competenceList = wrapper.find('.competence-list')
    expect(competenceList.exists()).toBe(true)
    expect(wrapper.find('.competence-detail').exists()).toBe(false)
  })

  it('affiche le bon nombre de compétences', () => {
    const competenceItems = wrapper.findAll('.competence-item')
    expect(competenceItems.length).toBe(4)
  })

  it('affiche les noms des compétences correctement', () => {
    const competenceItems = wrapper.findAll('.competence-item')
    const competenceNames = competenceItems.map(item => item.text())
    expect(competenceNames).toContain('Compétence 1')
    expect(competenceNames).toContain('Compétence 2')
    expect(competenceNames).toContain('Compétence 3')
    expect(competenceNames).toContain('Compétence 4')
  })

  it('sélectionne une compétence et affiche ses détails', async () => {
    const firstCompetence = wrapper.find('.competence-item')
    await firstCompetence.trigger('click')

    expect(wrapper.find('.competence-list').exists()).toBe(false)
    expect(wrapper.find('.competence-detail').exists()).toBe(true)
    expect(wrapper.find('.competence-detail h3').text()).toBe('Compétence 1')
    expect(wrapper.find('.competence-detail p').text()).toContain('4/5')
  })

  it('retourne à la liste des compétences quand on clique sur le bouton retour', async () => {
    // Sélectionner d'abord une compétence
    await wrapper.find('.competence-item').trigger('click')
    // Cliquer sur le bouton retour
    await wrapper.find('.back-button').trigger('click')

    expect(wrapper.find('.competence-list').exists()).toBe(true)
    expect(wrapper.find('.competence-detail').exists()).toBe(false)
  })

  it('initialise le graphique lors de la sélection d\'une compétence', async () => {
    const mockChart = vi.fn()
    Chart.mockImplementation(mockChart)

    await wrapper.find('.competence-item').trigger('click')

    expect(Chart).toHaveBeenCalled()
    expect(mockChart).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        type: 'line',
        data: expect.objectContaining({
          labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
          datasets: expect.arrayContaining([
            expect.objectContaining({
              data: [3, 4, 4, 5]
            })
          ])
        })
      })
    )
  })

  it('télécharge le rapport PDF quand on clique sur le bouton', async () => {
    const mockHtml2Canvas = vi.fn().mockResolvedValue({
      toDataURL: () => 'mock-url'
    })
    html2canvas.mockImplementation(mockHtml2Canvas)

    const mockJsPDF = {
      addImage: vi.fn(),
      save: vi.fn()
    }
    jsPDF.mockImplementation(() => mockJsPDF)

    // Sélectionner une compétence d'abord
    await wrapper.find('.competence-item').trigger('click')
    // Cliquer sur le bouton de téléchargement
    await wrapper.find('.download-button').trigger('click')

    expect(html2canvas).toHaveBeenCalled()
    expect(mockJsPDF.addImage).toHaveBeenCalled()
    expect(mockJsPDF.save).toHaveBeenCalledWith('rapport-Compétence 1.pdf')
  })
})