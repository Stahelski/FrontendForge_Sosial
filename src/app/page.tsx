"use client";

import type { JSX } from "react";
import { useEffect } from "react";

export default function Home(): JSX.Element {
  useEffect(() => {
    const particlesContainer = document.getElementById("particles");
    if (particlesContainer && particlesContainer.childElementCount === 0) {
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 20 + "s";
        particle.style.animationDuration = Math.random() * 10 + 15 + "s";
        particlesContainer.appendChild(particle);
      }
    }

    const header = document.getElementById("header");
    const onScroll = () => {
      if (!header) return;
      if (window.scrollY > 100) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);

    // Progress bar animation
    const progressEl = document.getElementById("progressBar");
    const progressSection = document.querySelector(".progress-section");
    let progressObserver: IntersectionObserver | null = null;
    if (progressEl && progressSection) {
      progressObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              progressEl.classList.add("animate");
            }
          });
        },
        { threshold: 0.5 }
      );
      progressObserver.observe(progressSection);
    }

    // Scroll animations
    const animatedEls = document.querySelectorAll(".animate-on-scroll");
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animated");
        });
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );
    animatedEls.forEach((el) => scrollObserver.observe(el));

    // Stagger effects
    document
      .querySelectorAll<HTMLElement>(".timeline-item")
      .forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
      });
    document
      .querySelectorAll<HTMLElement>(".feature-card")
      .forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
      });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (progressObserver && progressSection) {
        progressObserver.unobserve(progressSection);
      }
      animatedEls.forEach((el) => scrollObserver.unobserve(el));
    };
  }, []);

  return (
    <main className="ff-root min-h-screen">
      {/* Background and particles */}
      <div className="cosmic-bg" />
      <div className="particles" id="particles" />

      {/* Header */}
      <header id="header">
        <nav className="container">
          <div className="logo">Frontend Forge</div>
          <ul className="nav-links">
            <li>
              <span>Hjem</span>
            </li>
            <li>
              <span>Status</span>
            </li>
            <li>
              <span>Visjon</span>
            </li>
            <li>
              <span>Fremtid</span>
            </li>
            <li>
              <span>Kontakt</span>
            </li>
            <li>
              <button type="button" className="nav-cta">
                Følg utviklingen
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="hjem">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">MVP i arbeid</div>
            <h1>Frontend Forge</h1>
            <div className="hero-subtitle">
              En sosial plattform for webutviklere og ‑designere
            </div>
            <p>
              Frontend Forge er en sosial plattform for webutviklere og
              ‑designere. Opprett profil, lagre og del prosjekter, få
              tilbakemeldinger med likes og kommentarer, delta i forum – og vis
              fram porteføljen offentlig for arbeidsgivere. Første versjon
              fokuserer på det essensielle; mer kommer etter MVP.
            </p>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary">
                Se status
              </button>
              <button type="button" className="btn btn-secondary">
                Les visjonen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="status-section" id="status">
        <div className="container">
          <div className="status-container">
            <div className="status-text animate-on-scroll">
              <h2>Grunnmuren legges</h2>
              <h3>MVP under utvikling</h3>
              <p>
                Fokus i første versjon er klart: profiler og porteføljer,
                prosjekter med deling, likes og kommentarer, samt et enkelt
                forum for samtaler. Dette skaper et solid fundament –
                profesjonelt, men laget for kreative mennesker som vil forme en
                digital framtid sammen.
              </p>
              <div className="progress-section">
                <div className="progress-label">
                  <span>Foundation Progress</span>
                  <span>10%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" id="progressBar" />
                </div>
              </div>
              <p>
                Dette er ikke bare en plattform - det er en foundation for
                fremtidens kreative kodere. En base hvor innovasjon møter
                samarbeid, hvor individuelle visjoner blir til kollektiv kraft.
              </p>
            </div>
            <div className="status-visual animate-on-scroll">
              <div className="foundation-grid">
                <div className="grid-nodes">
                  <div className="node" />
                  <div className="node" />
                  <div className="node" />
                  <div className="node" />
                  <div className="node" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="visjon">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Hva blir med i MVP</h2>
            <p>
              Kjernefunksjoner ved første lansering. Flere muligheter legges til
              etter MVP.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                {" "}
                <img
                  src="/Profil-Portjefølje.png"
                  alt="Profile icon"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Profiler og porteføljer</h3>
              <p>
                Offentlige profilsider og porteføljer du kan dele med
                arbeidsgivere.
              </p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                {" "}
                <img
                  src="/Deling.png"
                  alt="Share icon"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Prosjekter og deling</h3>
              <p>
                Lagre, tagge og del prosjekter. Presenter arbeidet ditt
                strukturert.
              </p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                {" "}
                <img
                  src="/Like.png"
                  alt="Likes icon"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Likes og kommentarer</h3>
              <p>Gi og få tilbakemeldinger. Bygg bedre prosjekter sammen.</p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <img
                  src="/Forum.png"
                  alt="Forum icon"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Forum og samtaler</h3>
              <p>
                Delta i faglige diskusjoner og del kunnskap på tvers av nivåer.
              </p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <img
                  src="/Group.png"
                  alt="Team work icon"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Team og samarbeid (etter MVP)</h3>
              <p>
                Mer struktur for samarbeid, roller og arbeidsflyt i neste faser.
              </p>
            </div>
            <div className="feature-card animate-on-scroll">
              <div className="feature-icon">
                <img
                  src="/Rute.png"
                  alt="Road icone"
                  className="h-9 lg:h-11 text-sm text-amber-50"
                ></img>
              </div>
              <h3>Veikart og videreutvikling</h3>
              <p>
                Mentorprogram, intelligent matching og flere fellesskapsverktøy
                er planlagt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline" id="fremtid">
        <div className="container">
          <div className="timeline-content">
            <h2>Veikart</h2>
            <div className="timeline-subtitle">Plan for Frontend Forge</div>
            <div className="timeline-items">
              <div className="timeline-item animate-on-scroll">
                <div className="timeline-phase">MVP</div>
                <h3>Kjerneplattform</h3>
                <p>Profiler, prosjekter, likes, kommentarer og forum.</p>
              </div>
              <div className="timeline-item animate-on-scroll">
                <div className="timeline-phase">Community</div>
                <h3>Fellesskap og moderering</h3>
                <p>Bedre profiler, grupper og fellesskapsverktøy.</p>
              </div>
              <div className="timeline-item animate-on-scroll">
                <div className="timeline-phase">Intelligence</div>
                <h3>Intelligent matching</h3>
                <p>Forslag til prosjekter, personer og innhold (AI).</p>
              </div>
              <div className="timeline-item animate-on-scroll">
                <div className="timeline-phase">Scale</div>
                <h3>Samarbeid i skala</h3>
                <p>
                  Teamfunksjoner, arbeidsflyt og portefølje for arbeidsgivere.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontakt">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Frontend Forge</h3>
              <p>
                En profesjonell plattform for kreative fagfolk. Bygger et sted
                der idéer, kode og design møtes.
              </p>
            </div>
            <div className="footer-section">
              <h3>Foundation</h3>
              <span>Architecture Documentation</span>
              <span>Development Roadmap</span>
              <span>Research Papers</span>
              <span>Foundation Principles</span>
            </div>
            <div className="footer-section">
              <h3>Community</h3>
              <span>Join the Foundation</span>
              <span>Developer Network</span>
              <span>Knowledge Base</span>
              <span>Mentorship Program</span>
            </div>
            <div className="footer-section">
              <h3>Contact</h3>
              <span>foundation@frontendforge.dev</span>
              <span>Research Council</span>
              <span>Partner Inquiries</span>
              <span>Foundation Charter</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; 2024 Frontend Forge Foundation. Shaping the digital future
              across generations.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
