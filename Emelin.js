// Menu hamburger functionality
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (!hamburger.contains(event.target) && !navLinks.contains(event.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });
});

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryImages = document.querySelectorAll('.gallery img');
  let currentImageIndex = 0;
  
  // Open lightbox when clicking on gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      currentImageIndex = index;
      openLightbox(this.src, this.alt);
    });
  });
  
  // Open lightbox function
  function openLightbox(src, alt) {
    lightbox.style.display = 'block';
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  // Close lightbox function
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
  
  // Close lightbox when clicking on close button
  lightboxClose.addEventListener('click', closeLightbox);
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Navigate to previous image
  lightboxPrev.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  });
  
  // Navigate to next image
  lightboxNext.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', function(event) {
    if (lightbox.style.display === 'block') {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        lightboxPrev.click();
      } else if (event.key === 'ArrowRight') {
        lightboxNext.click();
      }
    }
  });
  
  // Touch gestures for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  lightboxImage.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
  });
  
  lightboxImage.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        lightboxNext.click();
      } else {
        // Swipe right - previous image
        lightboxPrev.click();
      }
    }
  }
});

// Devis Form Functionality
document.addEventListener('DOMContentLoaded', function() {
  const devisForm = document.getElementById('devisForm');
  const surfaceInput = document.getElementById('surface');
  const servicesCheckboxes = document.querySelectorAll('input[name="services"]');
  const budgetMinDisplay = document.getElementById('budget-min');
  const budgetMaxDisplay = document.getElementById('budget-max');
  const fileInput = document.getElementById('photos');
  const filePreview = document.getElementById('file-preview');
  const formMessage = document.getElementById('form-message');
  
  // Prix par m² pour chaque service (en FCFA)
  const prixServices = {
    enduit: { min: 2000, max: 3500 },
    peinture_tyrolienne: { min: 2500, max: 4000 },
    graffiato: { min: 3000, max: 5000 },
    decoration: { min: 3500, max: 6000 },
    peinture_simple: { min: 1500, max: 2500 }
  };
  
  // Calcul du budget en temps réel
  function calculerBudget() {
    const surface = parseFloat(surfaceInput.value) || 0;
    const selectedServices = Array.from(servicesCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    if (surface === 0 || selectedServices.length === 0) {
      budgetMinDisplay.textContent = '0';
      budgetMaxDisplay.textContent = '0';
      return;
    }
    
    let totalMin = 0;
    let totalMax = 0;
    
    selectedServices.forEach(service => {
      if (prixServices[service]) {
        totalMin += prixServices[service].min * surface;
        totalMax += prixServices[service].max * surface;
      }
    });
    
    budgetMinDisplay.textContent = totalMin.toLocaleString('fr-FR');
    budgetMaxDisplay.textContent = totalMax.toLocaleString('fr-FR');
  }
  
  // Écouteurs d'événements pour le calcul
  surfaceInput.addEventListener('input', calculerBudget);
  servicesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', calculerBudget);
  });
  
  // Gestion de l'upload de photos
  let uploadedFiles = [];
  
  fileInput.addEventListener('change', function(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadedFiles.push(file);
        displayImagePreview(file);
      }
    });
  });
  
  function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const previewItem = document.createElement('div');
      previewItem.className = 'file-preview-item';
      
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = file.name;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-file';
      removeBtn.innerHTML = '×';
      removeBtn.onclick = function() {
        previewItem.remove();
        uploadedFiles = uploadedFiles.filter(f => f !== file);
      };
      
      previewItem.appendChild(img);
      previewItem.appendChild(removeBtn);
      filePreview.appendChild(previewItem);
    };
    reader.readAsDataURL(file);
  }
  
  // Validation du formulaire
  devisForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Réinitialiser les messages
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    // Validation des champs obligatoires
    const nom = document.getElementById('nom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const selectedServices = Array.from(servicesCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    const errors = [];
    
    if (!nom) errors.push('Le nom est obligatoire');
    if (!telephone) errors.push('Le téléphone est obligatoire');
    if (!surfaceInput.value || surfaceInput.value <= 0) errors.push('La surface doit être supérieure à 0');
    if (selectedServices.length === 0) errors.push('Veuillez sélectionner au moins un service');
    
    // Validation du téléphone (format togolais)
    const phoneRegex = /^(\+228)?[0-9]{8}$/;
    if (telephone && !phoneRegex.test(telephone.replace(/\s/g, ''))) {
      errors.push('Le format du téléphone n\'est pas valide (ex: +228 98769662)');
    }
    
    if (errors.length > 0) {
      showMessage(errors.join('<br>'), 'error');
      return;
    }
    
    // Préparation des données du formulaire
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('telephone', telephone);
    formData.append('email', document.getElementById('email').value);
    formData.append('services', selectedServices.join(', '));
    formData.append('surface', surfaceInput.value);
    formData.append('type_batiment', document.getElementById('type_batiment').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('delai', document.getElementById('delai').value);
    formData.append('budget_min', budgetMinDisplay.textContent);
    formData.append('budget_max', budgetMaxDisplay.textContent);
    
    // Ajout des photos
    uploadedFiles.forEach(file => {
      formData.append('photos[]', file);
    });
    
    // Simulation d'envoi (à remplacer par votre logique d'envoi réelle)
    submitForm(formData);
  });
  
  function showMessage(message, type) {
    formMessage.innerHTML = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Auto-masquage après 5 secondes pour les messages de succès
    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }
  
  function submitForm(formData) {
    // Afficher un message de chargement
    const submitBtn = devisForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '📤 Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simulation d'envoi (remplacer par votre appel API réel)
    setTimeout(() => {
      // Message de succès
      showMessage('✅ Votre demande de devis a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.', 'success');
      
      // Réinitialiser le formulaire
      devisForm.reset();
      filePreview.innerHTML = '';
      uploadedFiles = [];
      calculerBudget();
      
      // Restaurer le bouton
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      
      // Optionnel: Redirection vers WhatsApp
      setTimeout(() => {
        const nom = document.getElementById('nom').value;
        const surface = document.getElementById('surface').value;
        const services = Array.from(servicesCheckboxes)
          .filter(cb => cb.checked)
          .map(cb => cb.nextElementSibling.textContent)
          .join(', ');
        
        const whatsappMessage = `Bonjour EMELIN HOUSE DESIGN,\n\nJe viens de remplir le formulaire de devis sur votre site :\n\nNom: ${nom}\nSurface: ${surface}m²\nServices: ${services}\n\nJe souhaiterais recevoir plus d'informations.`;
        
        window.open(`https://wa.me/22898769662?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      }, 2000);
      
    }, 2000);
  }
  
  // Initialisation
  calculerBudget();
});

// Advanced Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-left, .animate-fade-in-right, .animate-slide-in-top, .animate-slide-in-bottom, .animate-scale-in, .animate-bounce-in');
  const parallaxElements = document.querySelectorAll('.animate-parallax');
  
  // Intersection Observer pour les animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observer tous les éléments animés
  animatedElements.forEach(element => {
    observer.observe(element);
  });
  
  // Effet de parallaxe
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    parallaxElements.forEach(element => {
      element.style.transform = `translateY(${rate}px)`;
    });
  }
  
  // Throttling pour performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
      setTimeout(() => { ticking = false; }, 100);
    }
  }
  
  window.addEventListener('scroll', requestTick);
  
  // Animation des compteurs (si ajoutés plus tard)
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toLocaleString('fr-FR');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start).toLocaleString('fr-FR');
      }
    }, 16);
  }
  
  // Initialiser les compteurs si présents
  document.querySelectorAll('[data-counter]').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-counter'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counter, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
  
  // Animation de la barre de navigation au scroll
  const nav = document.querySelector('nav');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Animation des cartes au survol
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Animation des images de la galerie au survol
  document.querySelectorAll('.gallery img').forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.08) rotate(1deg)';
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1.05) rotate(0deg)';
      this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
    });
  });
  
  // Animation des vidéos au survol
  document.querySelectorAll('.video-item').forEach(video => {
    video.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.03)';
      this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    });
    
    video.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    });
  });
  
  // Animation du bouton WhatsApp
  const whatsappBtn = document.querySelector('.whatsapp');
  let whatsappInterval;
  
  function pulseWhatsApp() {
    whatsappBtn.style.transform = 'scale(1.2) rotate(10deg)';
    setTimeout(() => {
      whatsappBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  }
  
  whatsappBtn.addEventListener('mouseenter', () => {
    whatsappInterval = setInterval(pulseWhatsApp, 1000);
    pulseWhatsApp();
  });
  
  whatsappBtn.addEventListener('mouseleave', () => {
    clearInterval(whatsappInterval);
    whatsappBtn.style.transform = 'scale(1) rotate(0deg)';
  });
  
  // Performance optimization
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculer les positions si nécessaire
      observer.disconnect();
      animatedElements.forEach(element => {
        observer.observe(element);
      });
    }, 250);
  });
});

// Animation simple au scroll (conservé pour compatibilité)
window.addEventListener("scroll", () => {
  document.querySelectorAll(".card").forEach(card => {
    if (card.getBoundingClientRect().top < window.innerHeight) {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }
  });
});