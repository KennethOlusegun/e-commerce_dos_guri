import { CarrinhoItem } from './carrinho-item.interface';

export interface Produto {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
  stock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormCliente {
  nome: string;
  email: string;
  telefone: string;
  documento: string;
}

export interface FormEndereco {
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Pedido {
  numero: string;
  itens: CarrinhoItem[];
  cliente: FormCliente;
  endereco: FormEndereco;
  metodoPagamento: string;
  total: number;
}
