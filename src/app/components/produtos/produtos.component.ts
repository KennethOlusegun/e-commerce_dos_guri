import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="produtos" class="produtos">
      <div class="container">
        <h2>Nossos Produtos</h2>
        
        <div *ngIf="carregando" class="loading">
          <p>Carregando produtos...</p>
        </div>

        <div class="produtos-grid" *ngIf="!carregando">
          <div 
            *ngFor="let produto of produtos; let i = index" 
            class="produto-card"
            [style.animation-delay.s]="i * 0.1"
          >            <img [src]="produto.image" [alt]="produto.name" loading="lazy">
            <h3>{{ produto.name }}</h3>
            <p class="descricao">{{ produto.description }}</p>
            <p class="preco">{{ formatarPreco(produto.price) }}</p>
            <button class="btn-comprar" (click)="adicionarAoCarrinho(produto)">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .produtos {
      padding: 4rem 0;
      background: #f8fafc;
      min-height: 50vh;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .produtos h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: #1f2937;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
      font-size: 1.2rem;
      color: #64748b;
    }

    .loading p {
      margin: 0;
    }

    .produtos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
      justify-items: center;
    }

    .produto-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease forwards;
      max-width: 300px;
      width: 100%;
    }

    .produto-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .produto-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .produto-card h3 {
      margin-bottom: 0.5rem;
      color: #1f2937;
      font-size: 1.1rem;
    }

    .produto-card .descricao {
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 1rem;
      line-height: 1.4;
    }

    .produto-card .preco {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 1rem;
    }

    .btn-comprar {
      width: 100%;
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-comprar:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-comprar:active {
      transform: translateY(0);
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
      .produtos-grid {
        grid-template-columns: 1fr;
        padding: 0;
      }
      
      .produto-card {
        max-width: 100%;
      }
    }
  `]
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  carregando = true;

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.carregando = false;
        this.notificacaoService.mostrarNotificacao('Erro ao carregar produtos', 'error');
      }
    });
  }

  adicionarAoCarrinho(produto: Produto): void {
    this.carrinhoService.adicionarProduto(produto);
    this.notificacaoService.mostrarNotificacao(`${produto.name} adicionado ao carrinho!`, 'success');
  }

  formatarPreco(price: number): string {
    return this.produtoService.formatarPreco(price);
  }
}
