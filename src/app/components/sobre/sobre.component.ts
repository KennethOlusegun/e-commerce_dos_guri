import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sobre" class="sobre">
      <div class="container">
        <h2>Sobre Nós</h2>
        <p>Somos uma empresa dedicada a oferecer produtos de qualidade com o melhor atendimento ao cliente.</p>
        <p>Nossa missão é proporcionar uma experiência de compra excepcional, com produtos cuidadosamente selecionados e entrega rápida.</p>
      </div>
    </section>
  `,
  styles: [`
    .sobre {
      padding: 4rem 0;
      text-align: center;
      background: #ffffff;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .sobre h2 {
      margin-bottom: 2rem;
      font-size: 2.5rem;
      color: #1f2937;
    }

    .sobre p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #64748b;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .sobre h2 {
        font-size: 2rem;
      }
      
      .sobre p {
        font-size: 1rem;
      }
    }
  `]
})
export class SobreComponent {
}
