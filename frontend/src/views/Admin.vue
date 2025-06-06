<template>
    <div class="app-container">
      <div class="sidebar">
        <div class="logo-container">
          <div class="logo">
            <!-- <span class="logo-letter">S</span>
            <div class="logo-text">ILLORA</div>
            <div class="logo-subtext">PROFESSIONAL TRAINING CENTER</div> -->
            <img src="../assets/logo_sidebar.png" >
          </div>
        </div>
        
        <nav class="nav-menu">
          <router-link to="/admin/profile" class="nav-item" active-class="active">
            <div class="nav-icon">
              <img src="../assets/profile.png" >
            </div>
            <span class="nav-text">Profile</span>
          </router-link>
          
          <router-link to="/admin/inscription" class="nav-item" active-class="active">
            <div class="nav-icon">
              <img src="../assets/inscription.png" >
            </div>
            <span class="nav-text">Inscription</span>
          </router-link>
          
          <router-link to="/admin/competences" class="nav-item" active-class="active">
            <div class="nav-icon">
              <img src="../assets/competence.png" >
            </div>
            <span class="nav-text">Compétence</span>
          </router-link>
          
          <router-link to="/admin/notifications" class="nav-item" active-class="active">
            <div class="nav-icon">
            <img src="../assets/notification.png" >
            </div>
            <span class="nav-text">Notification</span>
          </router-link>
          
        </nav>
      </div>
      
      <div class="content">
        <router-view />
      </div>
    </div>
  </template>
  
  
  
  <style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }
  
  .app-container {
    display: flex;
    min-height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    background-color: #a8e4e0;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    position: fixed; /* Make sidebar fixed */
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 100; /* Ensure sidebar stays above other content */
    overflow-y: auto; /* Allow scrolling if sidebar content is too tall */
  }
  
  .logo-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #a8e4e0;
  }
  
  .logo {
    width: 120px;
    height: 120px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .logo-letter {
    color: #5eccc3;
    font-size: 36px;
    font-weight: bold;
  }
  
  .logo-text {
    color: #5eccc3;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
  }
  
  .logo-subtext {
    color: #5eccc3;
    font-size: 6px;
    text-align: center;
    max-width: 90px;
    margin-top: 2px;
  }
  
  .nav-menu {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  
  .nav-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background-color: #D9D9D9;
    color: #333;
    box-shadow: rgba(0, 0, 0, 0.372) 3px 3px ;
    text-decoration: none;
    margin-bottom: 5px;
    transition: background-color 0.3s;
    position: relative;
  }
  
  .nav-item:hover {
    background-color: rgba(94, 204, 195, 0.3);
  }
  
  .nav-item.active {
    background-color: #5eccc3;
    color: white;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }
  
  .nav-text {
    font-size: 16px;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
    margin-left: 250px; /* Add margin equal to sidebar width */
    min-height: 100vh;
  }
  </style>