<template>
  <div class="app-container">
    <header>
      <h1>Page D'evaluation</h1>
    </header>
    
    <main>
      <div class="content-container">
        <!-- Users List -->
        <div class="users-container">
          <h2>Users</h2>
          <ul class="users-list">
            <li 
              v-for="user in users" 
              :key="user.id" 
              @click="selectUser(user)"
              :class="{ 'selected': selectedUser && selectedUser.id === user.id }"
            >
              <div class="avatar">{{ user.name.charAt(0) }}</div>
              <span>{{ user.name }}</span>
            </li>
          </ul>
        </div>

        <!-- Skills Evaluation -->
        <div class="skills-container" v-if="selectedUser">
          <h2>les competences de {{ selectedUser.name }}</h2>
          <div class="skills-list">
            <div 
              v-for="skill in selectedUser.skills" 
              :key="skill.id" 
              class="skill-item"
            >
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-rating">
                <div class="rating-stars">
                  <span 
                    v-for="n in 5" 
                    :key="n" 
                    class="star"
                    :class="{ 'filled': n <= skill.rating }"
                    @click="rateSkill(skill, n)"
                  >★</span>
                </div>
                <span class="rating-value">{{ skill.rating }}/5</span>
              </div>
            </div>
          </div>
          <div class="submit-container" v-if="selectedUser">
            <button 
              class="submit-button" 
              :disabled="!hasRatedSkills()" 
              @click="submitEvaluation"
            >
              Submit Evaluation
            </button>
            <p class="submission-message" v-if="submissionStatus">{{ submissionStatus }}</p>
          </div>
        </div>
        
        <div class="placeholder" v-else>
          <p>Select a user to evaluate their skills</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      selectedUser: null,
      users: [],
      submissionStatus: ''
    };
  },
  methods: {
    async getData(){
      const res=await axios.get('http://localhost:3000/tuteurs/'+this.$route.params.id);
      this.users=res.data;
      
    },
    selectUser(user) {
      this.selectedUser = user;
    },
    async rateSkill(skill, rating) {
      skill.rating = rating;
    },
    hasRatedSkills() {
      if (!this.selectedUser) return false;
      return this.selectedUser.skills.some(skill => skill.rating > 0);
    },
    async submitEvaluation() {
      
      await axios.patch("http://localhost:3000/evaluations/"+this.selectedUser.id,{
       skills:this.selectedUser.skills
      })
      this.submissionStatus = `Evaluation for ${this.selectedUser.name} has been submitted successfully!`;
      setTimeout(() => {
        this.submissionStatus = '';
      }, 3000);
      // Here you would typically send the data to a server
    },
  },
  mounted(){
    this.getData();
  },
  updated(){
    this.getData();
  }
};
</script>

<style>
:root {
  --primary-color: #89CEC5;
  --primary-dark: #6ab5ac;
  --primary-light: #a7dbd5;
  --text-color: #333;
  --background-color: #f5f5f5;
  --card-color: #fff;
  --border-color: #ddd;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 24px;
  font-weight: bold;
}

h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: var(--primary-dark);
}

.content-container {
  display: flex;
  gap: 20px;
}

.users-container, .skills-container, .placeholder {
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.users-container {
  flex: 1;
  max-width: 300px;
}

.skills-container, .placeholder {
  flex: 2;
  min-height: 400px;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-style: italic;
}

.users-list {
  list-style: none;
}

.users-list li {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid var(--border-color);
}

.users-list li:hover {
  background-color: var(--primary-light);
}

.users-list li.selected {
  background-color: var(--primary-color);
  color: white;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-dark);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background-color: #f9f9f9;
}

.skill-name {
  font-weight: bold;
}

.skill-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-stars {
  display: flex;
}

.star {
  font-size: 24px;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s;
}

.star:hover, .star.filled {
  color: gold;
}

.rating-value {
  font-weight: bold;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .users-container {
    max-width: 100%;
  }
}

.submit-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submission-message {
  margin-top: 10px;
  font-weight: bold;
  color: var(--primary-dark);
}
</style>
