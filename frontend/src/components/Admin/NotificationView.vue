<template>
  <div class="message-container">
    <h1 class="page-title">Messages</h1>
    
    <!-- Messages list -->
    <div class="message-list">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        class="message-card"
      >
        <!-- Message content -->
        <div class="message-content">
          <div class="message-header">
            <div class="avatar">
              {{ message.sender.charAt(0).toUpperCase() }}
            </div>
            <div class="message-info">
              <div class="message-meta">
                <h3 class="sender-name">{{ message.sender }}</h3>
                <span class="timestamp">{{ formatTime(message.time) }}</span>
              </div>
              <p class="message-text">{{ message.content }}</p>
            </div>
          </div>
          
          <!-- Replies -->
          <!-- <div v-if="message.replies && message.replies.length > 0" class="replies-container">
            <div v-for="(reply, replyIndex) in message.replies" :key="replyIndex" class="reply-card">
              <div class="reply-header">
                <div class="reply-avatar">
                  {{ reply.sender.charAt(0).toUpperCase() }}
                </div>
                <div class="reply-info">
                  <div class="reply-meta">
                    <span class="reply-sender">{{ reply.sender }}</span>
                    <span class="reply-timestamp">{{ formatTime(reply.time) }}</span>
                  </div>
                  <p class="reply-text">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div> -->
          
          <!-- Reply form - always visible -->
          <div class="reply-form-container">
            <div class="reply-form">
              <div class="reply-avatar">
                Y
              </div>
              <div class="reply-input-container">
                <textarea 
                  v-model="message.replyText" 
                  class="reply-input"
                  placeholder="Reply to this message..."
                  rows="1"
                ></textarea>
                <div class="reply-button-container">
                  <button 
                    @click="submitReply(index)" 
                    class="reply-button"
                    :disabled="!message.replyText.trim()"
                    :class="{'button-disabled': !message.replyText.trim()}"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add new message form -->
    <!-- <div class="new-message-section">
      <h2 class="section-title">New Message</h2>
      <div class="new-message-form">
        <div class="form-group">
          <label class="form-label">Your Name</label>
          <input 
            type="text" 
            v-model="newMessage.sender" 
            class="form-input"
            placeholder="Enter your name"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea 
            v-model="newMessage.content" 
            class="form-textarea"
            placeholder="Type your message here..."
            rows="3"
          ></textarea>
        </div>
        <div class="form-actions">
          <button 
            @click="addMessage" 
            class="send-button"
            :disabled="!newMessage.sender.trim() || !newMessage.content.trim()"
            :class="{'button-disabled': !newMessage.sender.trim() || !newMessage.content.trim()}"
          >
            Send Message
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script >

export default {
  data(){
    return{
      messages:[{
    sender: 'Admin',
    content: 'Welcome to the KILLORA platform! We\'re excited to have you join us.',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    replies: [
      {
        sender: 'John',
        content: 'Thank you! I\'m looking forward to using the platform.',
        time: new Date(Date.now() - 1000 * 60 * 25) // 25 minutes ago
      }
    ],
    replyText: ''
  },
  {
    sender: 'Sarah Johnson',
    content: 'I\'ve added you to the Marketing Team group. Please check your dashboard for more information.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    replies: [],
    replyText: ''
  },
  {
    sender: 'Training Department',
    content: 'Your Project Management skill evaluation is due this Friday. Please complete it as soon as possible.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    replies: [
      {
        sender: 'System',
        content: 'Reminder: Please complete your evaluation by the end of this week.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
      },
      {
        sender: 'You',
        content: 'I will complete it tomorrow.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ],
    replyText: ''
  }]
    }
  },
  methods:{
    // async getNotification(){
    //   const res=await axios.get('http://localhost:3000/notification');
    //   this.messages=res.data
    // },
    formatTime(time) {
  const now = new Date()
  const diff = now - time
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
},
submitReply(index) {
  const message = this.messages[index]
  
  if (!message.replyText.trim()) return
  
  // Initialize replies array if it doesn't exist
  if (!message.replies) {
    message.replies = []
  }
  /*axios.post("localhost:8080/api/solution/",{sender: 'You',
    content: message.replyText.trim(),
    time: new Date()})*/
  // Add the new reply
  message.replies.push({
    sender: 'You',
    content: message.replyText.trim(),
    time: new Date()
  })
  
  // Clear the reply form
  message.replyText = ''
},
// addMessage() {
//   if (!newMessage.value.sender.trim() || !newMessage.value.content.trim()) return
  
//   messages.value.unshift({
//     sender: newMessage.value.sender,
//     content: newMessage.value.content,
//     time: new Date(),
//     replies: [],
//     replyText: ''
//   })
  
//   // Clear the form
//   newMessage.value.sender = ''
//   newMessage.value.content = ''
// }

  }
  // ,mounted(){
  //   getNotification();
  // }
}


// New message form
// const newMessage = ref({
//   sender: '',
//   content: ''
// })

// Format time to relative format (e.g., "2 hours ago")

// Submit a reply to a message


// Add a new message

</script>

<style>
/* Base styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f9f9f9;
}

/* Container styles */
.message-container {
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
}

/* Typography */
.page-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
}

/* Message list */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Message card */
.message-card {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.message-content {
  padding: 16px;
}

/* Message header */
.message-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #a8e0d9;
  color: #3a7a70;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 16px;
}

.message-info {
  flex: 1;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sender-name {
  font-weight: 500;
  font-size: 16px;
}

.timestamp {
  font-size: 12px;
  color: #888;
}

.message-text {
  margin-top: 4px;
  color: #444;
}

/* Replies */
.replies-container {
  margin-left: 48px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

.reply-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.reply-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.reply-info {
  flex: 1;
}

.reply-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-sender {
  font-size: 14px;
  font-weight: 500;
}

.reply-timestamp {
  font-size: 12px;
  color: #888;
}

.reply-text {
  margin-top: 4px;
  font-size: 14px;
  color: #444;
}

/* Reply form */
.reply-form-container {
  margin-top: 12px;
  margin-left: 48px;
}

.reply-form {
  display: flex;
  gap: 8px;
}

.reply-input-container {
  flex: 1;
}

.reply-input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
}

.reply-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.reply-button {
  padding: 4px 12px;
  font-size: 14px;
  background-color: #3a7a70;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.reply-button:hover {
  background-color: #2c5c55;
}

/* New message section */
.new-message-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.new-message-form {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 16px;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #444;
  margin-bottom: 4px;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
}

.form-textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.send-button {
  padding: 8px 16px;
  background-color: #3a7a70;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.send-button:hover {
  background-color: #2c5c55;
}

/* Disabled state */
.button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-disabled:hover {
  background-color: #3a7a70;
}
</style>