// JS navbar-section
function initNavbarSection() {
  const root = document.querySelector(".navbar-section");
  if (!root) return;
  const links = root.querySelectorAll(".nav-link");
  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    links.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }
  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  // Scroll to center of section on nav-link click
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Zamknij menu mobilne jeśli otwarte
      const hamburger = document.querySelector(".hamburger-icon");
      const overlay = document.querySelector(".mobile-nav-overlay");
      if (hamburger && overlay && overlay.classList.contains("active")) {
        hamburger.classList.remove("active");
        overlay.classList.add("hiding");
        document.body.classList.remove("no-scroll");
        setTimeout(() => {
          overlay.classList.remove("active");
          overlay.classList.remove("hiding");
        }, 600);
      }

      const navbar = document.querySelector(".navbar-container");
      navbar.classList.add("disable-auto-hide");
      setTimeout(() => {
        navbar.classList.remove("disable-auto-hide");
        navbar.classList.remove("hide-navbar");
      }, 1000);
      const section = document.getElementById(link.dataset.section);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const targetScroll = sectionTop - (window.innerHeight / 2) + (sectionHeight / 2);
        
        window.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar-container");
  setTimeout(() => {
    navbar.classList.remove("start-show-navbar");
    navbar.classList.remove("hide-navbar");
  }, 2850);


  const hamburger = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".mobile-nav-overlay");

hamburger.addEventListener("click", () => {
  if (overlay.classList.contains("active")) {
    overlay.classList.add("hiding");
    hamburger.classList.remove("active");
    document.body.classList.remove("no-scroll");

    setTimeout(() => {
      overlay.classList.remove("active");
      overlay.classList.remove("hiding");
    }, 600);
  } else {
    overlay.classList.add("active");
    hamburger.classList.add("active");
    document.body.classList.add("no-scroll");
  }
});

let lastScrollTop = window.scrollY;
let ticking = false;

function handleNavbarVisibility() {
  const currentScroll = window.scrollY;
  const navbar = document.querySelector(".navbar-container");

  if (currentScroll > lastScrollTop + 5 && currentScroll > 60) {
    navbar.classList.add("hide-navbar");
  } else if (currentScroll < lastScrollTop - 5) {
    navbar.classList.remove("hide-navbar");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(handleNavbarVisibility);
    ticking = true;
  }
});

});

document.addEventListener("DOMContentLoaded", () => {
  initNavbarSection();
});
// JS navbar-section

// JS slider-section & card-section

document.addEventListener("DOMContentLoaded", () => {
  initSliderSection();
  initCardSection();
  
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  document.body.style.overflow = 'hidden';
  
  const intro = document.querySelector("#intro-animation");
  if (intro) {
    setTimeout(() => {
      intro.style.display = "none";
      intro.style.pointerEvents = "none";
      intro.style.zIndex = "-1";
      document.body.classList.add("fade-in-ready");
      document.body.style.overflow = '';
    }, 2600);
  }
});

function initSliderSection() {
  const root = document.querySelector(".hero-section");
  if (!root) return;

  const track = root.querySelector("#track");
  const dots = root.querySelector("#dots");
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    root.querySelectorAll(".arrow").forEach(arrow => {
      arrow.style.display = "none";
    });
  }

  const cards = track.children;
  const total = cards.length;
  let current = 1;
  const firstReal = 1;
  const lastReal = total - 2;

  const updateSlider = () => {
    const container = root.querySelector('.slider-container');
    const containerWidth = container.offsetWidth;
    const card = cards[current];
    const cardLeftInTrack = card.offsetLeft;
    const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;

    track.style.transform = `translateX(-${translateX}px)`;

    root.querySelectorAll(".arrow.left").forEach(btn => btn.disabled = current === firstReal);
    root.querySelectorAll(".arrow.right").forEach(btn => btn.disabled = current === lastReal);

    root.querySelectorAll(".card").forEach((card, index) => {
      const leftArrow = card.querySelector(".arrow.left");
      const rightArrow = card.querySelector(".arrow.right");

      if (!isTouchDevice) {
        if (index === current) {
          if (leftArrow) leftArrow.style.display = current === firstReal ? "none" : "flex";
          if (rightArrow) rightArrow.style.display = current === lastReal ? "none" : "flex";
        } else {
          if (leftArrow) leftArrow.style.display = "none";
          if (rightArrow) rightArrow.style.display = "none";
        }
      }
    });

    dots.innerHTML = "";
    for (let i = firstReal; i <= lastReal; i++) {
      const dot = document.createElement("div");
      dot.className = "dot" + (i === current ? " active" : "");
      dot.addEventListener("click", () => {
        current = i;
        updateSlider();
      });
      dots.appendChild(dot);
    }
  };

  let lastClickTime = 0;
  const CLICK_DELAY = 500;

  root.querySelectorAll(".card .arrow.left").forEach(btn => {
    btn.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) return;
      lastClickTime = now;
      if (current > firstReal) {
        current--;
        updateSlider();
      }
    });
  });

  root.querySelectorAll(".card .arrow.right").forEach(btn => {
    btn.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastClickTime < CLICK_DELAY) return;
      lastClickTime = now;
      if (current < lastReal) {
        current++;
        updateSlider();
      }
    });
  });

  let autoplayInterval = null;

  const startAutoplay = () => {
    if (window.innerWidth < 991) return;
    if (autoplayInterval !== null) return;
    autoplayInterval = setInterval(() => {
      current = current < lastReal ? current + 1 : firstReal;
      updateSlider();
    }, 10000);
  };

  const stopAutoplay = () => {
    if (autoplayInterval !== null) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };

  function enableTouchSwipe() {
    if (window.innerWidth >= 992) return;

    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: false });

    track.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diffX = startX - currentX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && current < lastReal) {
          current++;
          updateSlider();
        } else if (diffX < 0 && current > firstReal) {
          current--;
          updateSlider();
        }
        isDragging = false;
      }
    }, { passive: false });

    track.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  const container = root.querySelector('.slider-container');
  const containerWidth = container.offsetWidth;
  const card = cards[1];
  const cardLeftInTrack = card.offsetLeft;
  const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;

  track.style.transition = "none";
  track.style.transform = `translateX(-${translateX}px)`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      track.style.transition = "transform 0.5s ease-in-out";
      updateSlider();

      setTimeout(() => {
        root.querySelectorAll(".fade-lock").forEach(el => el.classList.remove("fade-lock"));
        if (window.innerWidth > 991) {
          startAutoplay();
        } else {
          enableTouchSwipe();
        }
      }, 2600);
    });
  });

  const hoverTarget = root;
  if (hoverTarget) {
    hoverTarget.addEventListener("mouseenter", () => stopAutoplay());
    hoverTarget.addEventListener("mouseleave", () => startAutoplay());
  }

  function enableResizeCentering(isActive) {
    const section = root.querySelector(".slider-section");
    const container = root.querySelector(".slider-container");
    const track = root.querySelector(".card-track");

    if (isActive) {
      section.style.margin = "0 auto";
      container.style.margin = "0 auto";
      track.style.margin = "0 auto";
      track.style.transition = "none";
    } else {
      section.style.margin = "";
      container.style.margin = "";
      track.style.margin = "";
      track.style.transition = "transform 0.5s ease-in-out";
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    enableResizeCentering(true);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      enableResizeCentering(false);
      updateSlider();
    }, 300);
  });

  let previousContainerWidth = document.body.offsetWidth;
  setInterval(() => {
    const currentContainerWidth = document.body.offsetWidth;
    if (currentContainerWidth !== previousContainerWidth) {
      const container = root.querySelector('.slider-container');
      const containerWidth = container.offsetWidth;
      const card = cards[current];
      const cardLeftInTrack = card.offsetLeft;
      const translateX = cardLeftInTrack - (containerWidth - card.offsetWidth) / 2;
      track.style.transform = `translateX(-${translateX}px)`;

      requestAnimationFrame(() => {
        updateSlider();
        previousContainerWidth = currentContainerWidth;
      });
    }
  }, 350);
}

function initCardSection() {
  const root = document.querySelector(".card-section");
  if (!root) return;

  const track = root.querySelector(".card-track");
  const leftArrow = root.querySelector(".cs-arrow.left");
  const rightArrow = root.querySelector(".cs-arrow.right");
  const cards = track.querySelectorAll(".card");
  const container = root.querySelector(".card-container");
  const maxIndex = cards.length - 3;
  let currentIndex = 0;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    root.querySelectorAll('.cs-arrow').forEach(arrow => {
      arrow.style.display = 'none';
    });
    root.querySelectorAll('.card').forEach(card => {
      card.classList.add('no-hover');
    });
  }

  const getScrollAmount = () => {
    const card = track.querySelector(".card");
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  const isDesktop = () => window.innerWidth >= 992;

  const centerCard = (index) => {
    const card = cards[index];
    const offset = card.offsetLeft;
    track.style.transform = `translateX(-${offset}px)`;
  };

  leftArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex > 0) currentIndex--;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex < maxIndex) currentIndex++;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    }
  });

  if (isDesktop()) {
    centerCard(currentIndex);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDesktop()) {
        currentIndex = 0;
        centerCard(currentIndex);
      }
    }, 300);
  });

  setTimeout(() => {
    root.querySelectorAll('.fade-in-item').forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }, 3000);

  root.querySelectorAll('.card-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;

      card.classList.toggle('expanded');
      const media = card.querySelector('.card-media');
      if (card.classList.contains('expanded')) {
        media.style.backgroundColor = 'white';
        media.style.backgroundImage = "url('https://source.unsplash.com/400x400/?barber,style')";
        media.style.backgroundSize = 'cover';
        media.style.backgroundPosition = 'center';
      } else {
        media.style.backgroundColor = '';
        media.style.backgroundImage = '';
      }
      card.classList.toggle('no-hover');

      const mainBtn = card.querySelector('.card-main-row .card-button');
      if (mainBtn && mainBtn.textContent.trim() === 'więcej') {
        mainBtn.textContent = 'mniej';
        mainBtn.style.backgroundColor = 'transparent';
        mainBtn.style.border = '1px solid var(--neutral-white)';
        mainBtn.style.color = 'white';
      } else if (mainBtn) {
        mainBtn.textContent = 'więcej';
        mainBtn.style.backgroundColor = 'var(--neutral-white)';
        mainBtn.style.border = 'none';
        mainBtn.style.color = 'black';
      }
    });
  });
}

// JS inclusion-section

document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".metamorphosis-title");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          title.classList.add("animate-in");
        }, 100);
        observer.unobserve(title);
      }
    },
    {
      threshold: 0.1,
    }
  );
  observer.observe(title);
});

document.addEventListener("DOMContentLoaded", () => {
const title2 = document.querySelector(".metamorphosis-title-2");
const observer10 = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        title2.classList.add("animate-in");
      }, 100);
      observer10.unobserve(title2);
    }
  },
  {
    threshold: 0.1,
  }
);
  observer10.observe(title2);
});

// JS inclusion-section

// JS animation-section-1

 document.addEventListener("DOMContentLoaded", () => {
  const animatedSection1 = document.querySelector(".animated-section-1");
  if (!animatedSection1) return;

  const cards = animatedSection1.querySelectorAll(".service-card");
  cards[0].classList.add("active");
  const cardsGhost = animatedSection1.querySelectorAll(".service-card-ghost");
  const rotatedWrapper = animatedSection1.querySelector(".rotated-wrapper")
  let activeIndex = 0;


  const observer2 = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        rotatedWrapper.classList.remove("hidden");
        setTimeout(() => {
          cardsGhost.forEach(card => card.classList.add("fade-in-item-as1"));
          setInterval(() => {
            cards.forEach(card => card.classList.remove("active"));
            cards[activeIndex].classList.add("active");
            activeIndex = (activeIndex + 1) % cards.length;
          }, 3500);
        }, 100);
        observer2.unobserve(animatedSection1);
      }
    },
    { threshold: 0.2 }
  );

  observer2.observe(animatedSection1);
});

document.addEventListener("DOMContentLoaded", () => {
  const animatedSection1 = document.querySelector(".animated-section-1");
  const mobileSwitcher = document.querySelector(".mobile-card-switcher");
  const mobileTabs = document.querySelectorAll(".mobile-card-switcher .tab-btn");
  const mobileCards = document.querySelectorAll(".mobile-card-switcher .mobile-card");

  let activeMobile = 0;
  let autoSwitchInterval;

  const setMobileActive = (index) => {
    mobileTabs.forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
    });
    mobileCards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  };

  mobileTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      clearInterval(autoSwitchInterval);
      activeMobile = parseInt(tab.dataset.index);
      setMobileActive(activeMobile);
    });
  });

  const observer3 = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        mobileSwitcher.classList.remove("hidden");
        setTimeout(() => {
          setMobileActive(activeMobile);
          autoSwitchInterval = setInterval(() => {
            activeMobile = (activeMobile + 1) % mobileCards.length;
            setMobileActive(activeMobile);
          }, 3500);
        }, 100);
        observer3.unobserve(animatedSection1);
      }
    },
    { threshold: 0.2 }
  );

  observer3.observe(animatedSection1);
});

// JS animated-section-1

// JS animation-section-2
const sectionAS2 = document.querySelector('.animated-section-2');

if (sectionAS2) {
  for (let i = 1; i <= 9; i++) {
    fetch(`./media/animation-section-2/svg/${i}.svg`)
      .then(response => response.text())
      .then(data => {
        const container = sectionAS2.querySelector(`#svg-placeholder-${i}`);
        if (container) {
          container.innerHTML = data;
          const svg = container.querySelector('svg');
          if (svg) {
            svg.classList.add('icon-svg');
            svg.setAttribute('fill', 'currentColor');
          }
        }
      })
      .catch(error => {
        console.error(`Błąd ładowania SVG ${i}:`, error);
      });
  }

  for (let i = 1; i <= 9; i++) {
    const dupId = `svg-placeholder-${i}-dup`;
    fetch(`./media/animation-section-2/svg/${i}.svg`)
      .then(response => response.text())
      .then(data => {
        const container = sectionAS2.querySelector(`#${dupId}`);
        if (container) {
          container.innerHTML = data;
          const svg = container.querySelector('svg');
          if (svg) {
            svg.classList.add('icon-svg');
            svg.setAttribute('fill', 'currentColor');
          }
        }
      });
  }
}
// JS animation-section-2

// JS content-section

document.addEventListener("DOMContentLoaded", () => {
  const contentTitle = document.querySelector(".content-for-animate");
  const observer4 = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          contentTitle.classList.add("content-animate-in");
        }, 100);
        observer4.unobserve(contentTitle);
      }
    },
    {
      threshold: 0.1,
    }
  );
  observer4.observe(contentTitle);
});

// JS content-section

// JS card-section-2

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".card-section-2");
  const track = root.querySelector(".card-track");
  const leftArrow = root.querySelector(".cs-arrow.left");
  const rightArrow = root.querySelector(".cs-arrow.right");
  const cards = track.querySelectorAll(".card");
  const container = root.querySelector(".card-container");
  const maxIndex = cards.length - 3;
  let currentIndex = 0;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    root.querySelectorAll('.cs-arrow').forEach(arrow => {
      arrow.style.display = 'none';
    });
    root.querySelectorAll('.card').forEach(card => {
      card.classList.add('no-hover');
    });
  }

  const getScrollAmount = () => {
    const card = track.querySelector(".card");
    const gap = parseInt(window.getComputedStyle(track).gap) || 0;
    return card.offsetWidth + gap;
  };

  const isDesktop = () => window.innerWidth >= 992;

  const centerCard = (index) => {
    const card = cards[index];
    const offset = card.offsetLeft;
    track.style.transform = `translateX(-${offset}px)`;
  };

  leftArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex > 0) currentIndex--;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    }
  });

  rightArrow.addEventListener("click", () => {
    if (isDesktop()) {
      if (currentIndex < maxIndex) currentIndex++;
      centerCard(currentIndex);
    } else {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    }
  });

  if (isDesktop()) {
    centerCard(currentIndex);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isDesktop()) {
        currentIndex = 0;
        centerCard(currentIndex);
      }
    }, 300);
  });

  const fadeInItems = root.querySelectorAll('.fade-in-item');
  const observer5 = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        fadeInItems.forEach(el => {
          el.style.animationPlayState = 'running';
        });
        observer5.unobserve(entry.target);
      }
    },
    {
      threshold: 0.1,
    }
  );
  fadeInItems.forEach(item => {
    observer5.observe(item);
  });
});


// JS card-section

// JS map-section
document.addEventListener("DOMContentLoaded", () => {
  const contentTitleMap = document.querySelector(".map-content-for-animate");
  const observer8 = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          contentTitleMap.classList.add("content-animate-in");
        }, 100);
        observer8.unobserve(contentTitleMap);
      }
    },
    {
      threshold: 0.1,
    }
  );
  observer8.observe(contentTitleMap);
});

// Expand/Collapse map feature (updated)
document.addEventListener("DOMContentLoaded", () => {
  const expandBtn = document.querySelector('.map-button:first-child');
  const mapLeft = document.querySelector('.map-section .two-col .left');
  const mapRight = document.querySelector('.map-section .two-col .right');
  const mapExpand = document.querySelector('.cardexpanded .card');
  const collapseBtn = mapRight.querySelector('.collapse-button');
  const mapContent = mapLeft.querySelector('.map-content-for-animate');

  let expanded = false;

  expandBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!expanded) {
      const currentWidth = mapContent.offsetWidth + "px";
      mapContent.style.minWidth = currentWidth;

      mapLeft.classList.add("hidden");
      mapLeft.style.width = "0";
      mapRight.style.width = "100%";
      mapExpand.classList.add("expanded");
      collapseBtn.style.opacity = "1";
      collapseBtn.style.pointerEvents = "auto";
      expanded = true;
    } else {
      mapLeft.classList.remove("hidden");
      requestAnimationFrame(() => {
        mapLeft.style.width = "40%";
        mapRight.style.width = "60%";
      });
      mapExpand.classList.remove("expanded");
      collapseBtn.style.opacity = "0";
      collapseBtn.style.pointerEvents = "none";
      // Remove min-width so .map-content-for-animate adapts to parent again with delay
      setTimeout(() => {
        mapContent.style.removeProperty("min-width");
      }, 1000);
      expanded = false;
    }
  });

  collapseBtn.addEventListener("click", () => {
    mapLeft.classList.remove("hidden");
    requestAnimationFrame(() => {
      mapLeft.style.width = "40%";
      mapRight.style.width = "60%";
    });
    mapExpand.classList.remove("expanded");
    collapseBtn.style.opacity = "0";
    collapseBtn.style.pointerEvents = "none";
    // Remove min-width so .map-content-for-animate adapts to parent again with delay
    setTimeout(() => {
      mapContent.style.removeProperty("min-width");
    }, 1000);
    expanded = false;
  });
});

// Animacja dla .map-content-for-animate.mobile na mobile/tablet
document.addEventListener("DOMContentLoaded", () => {
  const contentTitleMapMobile = document.querySelector(".map-content-for-animate.mobile");
  if (contentTitleMapMobile) {
    const observer9 = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const elements = contentTitleMapMobile.querySelectorAll("h2, p, .map-buttons");
          elements.forEach(el => {
            el.classList.add("content-animate-in");
          });
          observer9.unobserve(contentTitleMapMobile);
        }
      },
      { threshold: 0.1 }
    );
    observer9.observe(contentTitleMapMobile);
  }
});
// JS map-section