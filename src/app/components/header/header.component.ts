import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho.service';
import { CarrinhoItem } from '../../models/carrinho-item.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <nav class="navbar">
        <div class="nav-container">
          <h1 class="logo">E-Shop</h1>
          <ul class="nav-menu" [class.active]="menuAberto">
            <li><a href="#home" (click)="fecharMenu(); scrollTo('home')">Início</a></li>
            <li><a href="#produtos" (click)="fecharMenu(); scrollTo('produtos')">Produtos</a></li>
            <li><a href="#sobre" (click)="fecharMenu(); scrollTo('sobre')">Sobre</a></li>
          </ul>
          
          <div class="nav-actions">
            <button class="carrinho-btn" (click)="toggleCarrinho()" aria-label="Abrir carrinho">
              🛒 <span class="carrinho-count">{{ quantidadeItens }}</span>
            </button>
            <button class="nav-toggle" [class.active]="menuAberto" (click)="toggleMenu()" aria-label="Abrir menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <!-- Modal do Carrinho -->
      <div class="carrinho-modal" [style.display]="carrinhoAberto ? 'flex' : 'none'" (click)="fecharCarrinhoSeClicouFora($event)">
        <div class="carrinho-content" (click)="$event.stopPropagation()">
          <div class="carrinho-header">
            <h3>Seu Carrinho</h3>
            <button class="fechar-carrinho" (click)="toggleCarrinho()">×</button>
          </div>
          <div class="carrinho-body">
            <div id="carrinho-items">
              <div *ngIf="itensCarrinho.length === 0" class="carrinho-vazio">
                <p>Seu carrinho está vazio</p>
              </div>              <div *ngFor="let item of itensCarrinho" class="carrinho-item">
                <img [src]="item.image" [alt]="item.name" loading="lazy">
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.price | currency:'BRL':'symbol':'1.2-2':'pt' }}</p>
                </div>
                <div class="item-controls">
                  <button (click)="alterarQuantidade(item.id, item.quantity - 1)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button (click)="alterarQuantidade(item.id, item.quantity + 1)">+</button>
                </div>
                <button class="remover-item" (click)="removerItem(item.id)">🗑️</button>
              </div>
            </div>
          </div>
          <div class="carrinho-footer" *ngIf="itensCarrinho.length > 0">
            <div class="carrinho-total">
              <strong>Total: {{ formatarMoeda(total) }}</strong>
            </div>
            <button class="btn-finalizar" (click)="finalizarCompra()">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
    }

    .navbar {
      padding: 1rem 0;
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .logo {
      color: #2563eb;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      text-decoration: none;
      color: #1f2937;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .nav-menu a:hover {
      color: #2563eb;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .carrinho-btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .carrinho-btn:hover {
      background: #1d4ed8;
    }

    .carrinho-count {
      background: #f59e0b;
      color: white;
      border-radius: 50%;
      padding: 0.2rem 0.5rem;
      font-size: 0.8rem;
      min-width: 20px;
      text-align: center;
    }

    .nav-toggle {
      display: none;
      background: none;
      border: none;
      flex-direction: column;
      cursor: pointer;
      padding: 0.5rem;
    }

    .nav-toggle span {
      width: 25px;
      height: 3px;
      background: #1f2937;
      margin: 3px 0;
      transition: all 0.3s ease;
    }

    .nav-toggle.active span:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }

    /* Modal do Carrinho */
    .carrinho-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2000;
      justify-content: center;
      align-items: center;
    }

    .carrinho-content {
      background: white;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .carrinho-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .carrinho-header h3 {
      margin: 0;
    }

    .fechar-carrinho {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #64748b;
    }

    .carrinho-body {
      padding: 1rem;
      min-height: 200px;
    }

    .carrinho-vazio {
      text-align: center;
      color: #64748b;
      padding: 2rem;
    }

    .carrinho-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .carrinho-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .item-info {
      flex: 1;
    }

    .item-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
    }

    .item-info p {
      margin: 0;
      color: #2563eb;
      font-weight: 600;
    }

    .item-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .item-controls button {
      background: #2563eb;
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
    }

    .item-controls span {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }

    .remover-item {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .carrinho-footer {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      background: #f8fafc;
    }

    .carrinho-total {
      margin-bottom: 1rem;
      text-align: center;
      font-size: 1.2rem;
    }

    .btn-finalizar {
      width: 100%;
      background: #f59e0b;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-finalizar:hover {
      background: #d97706;
    }

    /* Responsivo */
    @media (max-width: 768px) {
      .nav-menu {
        position: fixed;
        left: -100%;
        top: 70px;
        flex-direction: column;
        background-color: #ffffff;
        width: 100%;
        text-align: center;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 2rem 0;
      }

      .nav-menu.active {
        left: 0;
      }

      .nav-toggle {
        display: flex;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  menuAberto = false;
  carrinhoAberto = false;
  itensCarrinho: CarrinhoItem[] = [];
  quantidadeItens = 0;
  total = 0;

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.itensCarrinho = itens;
      this.quantidadeItens = this.carrinhoService.obterQuantidadeTotal();
      this.total = this.carrinhoService.calcularTotal();
    });
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  toggleCarrinho(): void {
    this.carrinhoAberto = !this.carrinhoAberto;
  }

  fecharCarrinhoSeClicouFora(event: Event): void {
    if (event.target === event.currentTarget) {
      this.carrinhoAberto = false;
    }
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  alterarQuantidade(id: number, novaQuantidade: number): void {
    this.carrinhoService.alterarQuantidade(id, novaQuantidade);
  }

  removerItem(id: number): void {
    this.carrinhoService.removerProduto(id);
  }

  finalizarCompra(): void {
    this.carrinhoAberto = false;
    this.scrollTo('checkout');
  }

  formatarMoeda(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
