<template>
  <div class="cadre_init">
    <div class="student-card">
        <div class="header">
            <!-- Student Info Card -->
            <div class="info-card">
                <div class="avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="student-info">
                    <p>{{nom}}</p>
                    <p>{{email}}</p>
                </div>
            </div>

            <!-- Result Card -->
            <div class="result-card">
                <p>Résultat:</p>
                <p>4,25/5</p>
                <p>Mention: Bien</p>
            </div>
        </div>

        <!-- Skills Section -->
        <div class="skills" v-for="competence in competences" :key="competence">
            
            <div class="skill-row">
                <div class="skill-item">
                    <div class="skill-value">{{ competence.nom }}</div>
                </div>
                <div class="skill-item">
                    <div class="skill-value">{{competence.note}}/5</div>
                </div>
                <div class="skill-item">
                    <div class="skill-value">{{competence.mention}}</div>
                </div>
            </div>
            
            
            
        </div>
    </div>
</div >
</template>

<script>
export default {
    data(){
        return {
            email:'assaad@gmail.com',
            nom:'El Ayddouni Assaad',
            competences:[
                {nom:'communication',note:4, mention:'bien'},
                {nom:'creativity',note:3, mention:'moyenne'},
                {nom:'coding',note:5, mention:'très bien'},
            ],
            user:''
        }
    },
    // methods:{
    //     async getEtudiant(){
    //         const res=await axios.get('http://localhost:3000/user/'+$route.params.id);
    //         this.user=res.data
    //     }
    // },
    // mounted(){
    //     getEtudiant();
    // }
}
</script>

<style scoped>
    * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        .cadre_init {
            background-color: #f1f5f9;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        .student-card {
            width: 100%;
            max-width: 768px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
            .header {
                flex-direction: row;
            }
        }

        .info-card {
            background-color: #a8e4e0;
            border-radius: 0.5rem;
            padding: 1rem;
            flex: 1;
            display: flex;
            align-items: center;
        }

        .avatar {
            background-color: #d2f0ee;
            border-radius: 50%;
            padding: 0.5rem;
            margin-right: 1rem;
            width: 3rem;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .avatar svg {
            width: 1.5rem;
            height: 1.5rem;
        }

        .student-info p:first-child {
            font-weight: bold;
        }

        .result-card {
            background-color: #a8e4e0;
            border-radius: 0.5rem;
            padding: 1rem;
            min-width: 12rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .result-card p:first-child {
            font-weight: bold;
        }

        .result-card p:nth-child(2) {
            font-size: 1.25rem;
        }

        .skills {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .skill-row {
            background-color: #a8e4e0;
            border-radius: 0.5rem;
            padding: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        @media (min-width: 768px) {
            .skill-row {
                flex-direction: row;
            }
        }

        .skill-item {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .skill-value {
            background-color: white;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;
            width: 100%;
            text-align: center;
        }

        @media (min-width: 768px) {
            .skill-value {
                width: 80%;
            }
        }
</style>
