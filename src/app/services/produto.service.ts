import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { Produto } from '../models/produto.model';
import { CarrinhoItem } from '../models/carrinho-item.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = environment.apiUrl;
  
  // Produtos mock como fallback
  private produtosMock: Produto[] = [
    {
      id: 1,
      name: "Smartphone Pro",
      price: 1299.00,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
      description: "Smartphone com câmera profissional",
      category: "Eletrônicos",
      brand: "TechCorp",
      stock: 50,
      isActive: true
    },
    {
      id: 2,
      name: "Laptop Gaming",
      price: 2499.00,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
      description: "Laptop para jogos e trabalho",
      category: "Eletrônicos",
      brand: "GameMax",
      stock: 25,
      isActive: true
    },
    {
      id: 3,
      name: "Fone Bluetooth",
      price: 299.00,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      description: "Fone sem fio com cancelamento de ruído",
      category: "Acessórios",
      brand: "SoundTech",
      stock: 100,
      isActive: true
    },
    {
      id: 4,
      name: "Smartwatch",
      price: 599.00,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      description: "Relógio inteligente com GPS",
      category: "Wearables",
      brand: "FitTech",
      stock: 75,
      isActive: true
    },
    {
      id: 5,
      name: "Tablet Pro",
      price: 1899.00,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
      description: "Tablet profissional para criatividade",
      category: "Eletrônicos",
      brand: "ViewMax",
      stock: 30,
      isActive: true
    },
    {
      id: 6,
      name: "Camera DSLR",
      price: 3299.00,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300",
      description: "Câmera profissional para fotografia",
      category: "Fotografia",
      brand: "PhotoPro",
      stock: 15,
      isActive: true
    }
  ];

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/products`).pipe(
      catchError(() => {
        console.warn('Backend não disponível, usando dados mock');
        return of(this.produtosMock);
      })
    );
  }

  getProdutoPorId(id: number): Observable<Produto | undefined> {
    return this.http.get<Produto>(`${this.apiUrl}/products/${id}`).pipe(
      catchError(() => {
        console.warn('Backend não disponível, usando dados mock');
        const produto = this.produtosMock.find(p => p.id === id);
        return of(produto);
      })
    );
  }

  buscarProdutos(termo: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/products/search?q=${termo}`).pipe(
      catchError(() => {
        console.warn('Backend não disponível, usando dados mock');
        const produtosFiltrados = this.produtosMock.filter(produto =>
          produto.name.toLowerCase().includes(termo.toLowerCase()) ||
          produto.description?.toLowerCase().includes(termo.toLowerCase())
        );
        return of(produtosFiltrados);
      })
    );
  }

  getProdutosPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/products/category/${categoria}`).pipe(
      catchError(() => {
        console.warn('Backend não disponível, usando dados mock');
        const produtosFiltrados = this.produtosMock.filter(produto =>
          produto.category?.toLowerCase() === categoria.toLowerCase()
        );
        return of(produtosFiltrados);
      })
    );
  }

  // Método auxiliar para formatar preço
  formatarPreco(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }
}
