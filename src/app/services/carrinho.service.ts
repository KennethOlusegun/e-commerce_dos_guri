import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarrinhoItem } from '../models/carrinho-item.interface';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private carrinhoSubject = new BehaviorSubject<CarrinhoItem[]>([]);
  public carrinho$ = this.carrinhoSubject.asObservable();

  private itens: CarrinhoItem[] = [];

  constructor() {
    // Carregar carrinho do localStorage se existir
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itens = JSON.parse(carrinhoSalvo);
      this.carrinhoSubject.next(this.itens);
    }
  }
  adicionarProduto(produto: Produto): void {
    const itemExistente = this.itens.find(item => item.id === produto.id);
    
    if (itemExistente) {
      itemExistente.quantity += 1;
    } else {
      this.itens.push({ ...produto, quantity: 1 });
    }
    
    this.atualizarCarrinho();
  }

  removerProduto(produtoId: number): void {
    this.itens = this.itens.filter(item => item.id !== produtoId);
    this.atualizarCarrinho();
  }

  alterarQuantidade(produtoId: number, quantidade: number): void {
    const item = this.itens.find(item => item.id === produtoId);
    if (item) {
      item.quantity = Math.max(1, quantidade);
      if (item.quantity <= 0) {
        this.removerProduto(produtoId);
      } else {
        this.atualizarCarrinho();
      }
    }
  }
  obterItens(): CarrinhoItem[] {
    return this.itens;
  }

  obterQuantidadeTotal(): number {
    return this.itens.reduce((total, item) => total + item.quantity, 0);
  }

  calcularTotal(): number {
    return this.itens.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  calcularSubtotal(): number {
    return this.calcularTotal();
  }

  calcularFrete(): number {
    return 15.00; // Frete fixo por enquanto
  }

  calcularTotalComFrete(): number {
    return this.calcularSubtotal() + this.calcularFrete();
  }

  limparCarrinho(): void {
    this.itens = [];
    this.atualizarCarrinho();
  }

  private atualizarCarrinho(): void {
    this.carrinhoSubject.next(this.itens);
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
  }

  // Método auxiliar para formatar preço
  formatarPreco(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
}
