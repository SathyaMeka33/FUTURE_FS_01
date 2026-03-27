# 🚀 Sathya's Dynamic Portfolio

A modern, fully responsive portfolio website showcasing projects, skills, and professional achievements. Built with clean HTML, CSS, and JavaScript—deployed live on Netlify.

[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)](https://netlify.com/)
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [Deployment](#-deployment)
- [Contact](#-contact)
- [License](#-license)

---

## 🌐 Live Demo

✨ **[Visit Live Portfolio](https://sathyastack.netlify.app/)** - See it in action!

---

## 📖 Overview

This portfolio website is a **modern, static website** built to showcase professional work, skills, and achievements. It combines a beautiful, responsive frontend with smooth animations and clean design principles.

Perfect for:
- 👨‍💻 Software developers and engineers
- 📊 Data scientists and analysts
- 🎨 Designers and creative professionals
- 🚀 Students and fresh graduates

Features:
- ✨ Stunning visual design with smooth animations
- 📱 Fully responsive on all devices (mobile, tablet, desktop)
- ⚡ Fast-loading static website
- 🎯 SEO-friendly structure
- 🌙 Dark/Light theme toggle
- 🎭 Smooth page transitions and interactions

---

## ✨ Features

### Frontend Features
- 🎨 **Modern Responsive Design** - Looks perfect on desktop, tablet, and mobile devices
- ✍️ **Typing Text Animation** - Engaging hero section with animated typewriter effect
- 🌙 **Dark/Light Theme Toggle** - User preference-based theme switching
- 📜 **Smooth Scroll Progress** - Visual indicator of scroll position
- 🎭 **Smooth Animations & Transitions** - CSS3 animations and page transitions
- 🎯 **Scroll-to-Top Button** - Easy navigation back to top
- 💬 **Contact Form** - Integrated email and WhatsApp contact options
- 📱 **Mobile Optimized** - Perfect performance on all screen sizes

### Content Sections
- 👤 **About** - Professional bio and personal information
- 💼 **Projects** - Showcase your best work with descriptions and links
- 🎓 **Skills** - Technical skills with proficiency levels
- 🏆 **Achievements** - Awards, recognitions, and milestones
- 📜 **Certifications** - Professional certifications and courses
- 💻 **Coding Profiles** - Links to LeetCode, GitHub, HackerRank, etc.
- 📞 **Contact** - Multiple ways to get in touch

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Styling with animations and responsive design
- **JavaScript** - Interactive features and DOM manipulation
- **Fonts** - Google Fonts (Cormorant Garamond, Bebas Neue, DM Sans)

### Deployment
- **Netlify** - Fast, reliable static site hosting
- **Git** - Version control

---

## 📸 Screenshots

### Mobile View
![Mobile Hero](/media/screenshots/mobile-hero.png?raw=true "Mobile Hero Section")
![Mobile Portfolio](/media/screenshots/mobile-portfolio.png?raw=true "Mobile Portfolio")

### Desktop View
![Desktop Hero](/media/screenshots/desktop-hero.png?raw=true "Desktop Hero Section")
![Desktop Projects](/media/screenshots/desktop-projects.png?raw=true "Desktop Projects")
![Desktop Skills](/media/screenshots/desktop-skills.png?raw=true "Desktop Skills")

*Note: Screenshots folder to be added - replace image paths with actual screenshots*

---

## 📁 Project Structure

```
sathya-portfolio/
│
├── index.html              # Home/landing page
├── about.html              # About section
├── projects.html           # Portfolio projects
├── skills.html             # Technical skills
├── achievements.html       # Achievements & awards
├── certifications.html     # Professional certifications
├── contact.html            # Contact page
├── change-log.txt          # Version history
├── README.md               # This file
│
├── static/                 # Static resources
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   ├── js/
│   │   └── script.js      # JavaScript functionality
│   └── images/            # General images & icons
│
└── media/                  # Media assets
    ├── about/             # About section images
    ├── achievements/      # Achievement images
    ├── certifications/    # Certification documents
    ├── projects/          # Project screenshots
    ├── skills/            # Skill icons
    └── screenshots/       # README screenshots
```

---

## 📦 Installation

### Prerequisites
- Git
- A code editor (VS Code, Sublime Text, etc.)
- Modern web browser

### Step 1: Clone the Repository

```bash
git clone https://github.com/SathyaMeka33/sathya-portfolio.git
cd sathya-portfolio
```

### Step 2: Open Locally

```bash
# Simply open index.html in your browser
# Or use a live server (VS Code Live Server extension recommended)
```

### Step 3: Edit Content

Open HTML files in your code editor and update:
- Personal information
- Project details
- Skills and achievements
- Contact information

---

## 🚀 Usage

### Updating Content

1. **Edit HTML Files**
   - Open any `.html` file in your code editor
   - Update content directly in the HTML
   - Save changes

2. **Add Projects**
   - Open `projects.html`
   - Add new project cards with title, description, and links
   - Include project images in `media/projects/` folder

3. **Update Skills**
   - Edit `skills.html`
   - Edit skill icons in `media/skills/`
   - Update proficiency levels

4. **Add Achievements**
   - Open `achievements.html`
   - Add achievement details
   - Upload achievement images

5. **Update Contact**
   - Edit contact form in `contact.html`
   - Update email and WhatsApp links

---

## 🌐 Deployment on Netlify

### Method 1: Connect GitHub Repository

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Netlify**
   - Go to [Netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Click "Deploy site"

3. **Configure Domain** (Optional)
   - Go to Site settings
   - Change site name
   - Add custom domain if desired

### Method 2: Drag & Drop

1. **Prepare Files**
   - Ensure all HTML, CSS, JS, and media files are organized

2. **Deploy**
   - Go to [Netlify.com](https://netlify.com)
   - Drag and drop your project folder
   - Site goes live instantly!

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📞 Contact

**Sathya Narayana Meka**

- 🌐 **Portfolio**: [sathyastack.netlify.app](https://sathyastack.netlify.app)
- 💻 **GitHub**: [github.com/SathyaMeka33](https://github.com/SathyaMeka33)
- 💼 **LinkedIn**: [linkedin.com/in/mekasathya](https://linkedin.com/in/mekasathya)
- 📧 **Email**: [innovativeden0@gmail.com](mailto:innovativeden0@gmail.com)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to use this template for your personal portfolio!

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Fork the project
- Create feature branches
- Submit pull requests
- Report issues

---

## 🙏 Acknowledgments

- Fonts from [Google Fonts](https://fonts.google.com/)
- Icons and inspiration from modern portfolio designs
- Hosted on [Netlify](https://netlify.com/)

---

## 📋 Changelog

See [change-log.txt](change-log.txt) for detailed version history and updates.

---

**Made with ❤️ by Sathya Narayana Meka**

⭐ If you find this useful, please leave a star on GitHub!

