import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="home" class="hero">
      <div class="hero-content">
        <h2>Produtos Incríveis</h2>
        <p>Encontre os melhores produtos com qualidade garantida</p>
        <button class="cta-button" (click)="scrollToProdutos()">Ver Produtos</button>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #2563eb, #f59e0b);
      color: white;
      text-align: center;
      padding: 8rem 1rem 4rem;
      margin-top: 80px;
      min-height: 50vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content h2 {
      font-size: 3rem;
      margin-bottom: 1rem;
      animation: fadeInUp 1s ease;
    }

    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      animation: fadeInUp 1s ease 0.2s both;
    }

    .cta-button {
      background: white;
      color: #2563eb;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      animation: fadeInUp 1s ease 0.4s both;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 6rem 1rem 3rem;
      }

      .hero-content h2 {
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .hero-content h2 {
        font-size: 1.75rem;
      }
    }
  `]
})
export class HeroComponent {
  scrollToProdutos(): void {
    const produtosElement = document.getElementById('produtos');
    if (produtosElement) {
      produtosElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
