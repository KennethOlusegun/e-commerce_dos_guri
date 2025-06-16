import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';
import { CepService, EnderecoViaCep } from '../../services/cep.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { CarrinhoItem } from '../../models/carrinho-item.interface';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section id="checkout" class="checkout" [class.hidden]="!exibirCheckout">
      <div class="container">
        <h2>Finalizar Compra</h2>
        <div class="checkout-container">
          <div class="checkout-left">
            <!-- Dados do Cliente -->
            <div class="checkout-section">
              <h3>Dados do Cliente</h3>
              <form [formGroup]="formCliente">
                <div class="form-group">
                  <label for="nome">Nome Completo</label>
                  <input type="text" id="nome" formControlName="nome" required>
                  <span *ngIf="formCliente.get('nome')?.invalid && formCliente.get('nome')?.touched" class="erro">
                    Nome é obrigatório
                  </span>
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" formControlName="email" required>
                  <span *ngIf="formCliente.get('email')?.invalid && formCliente.get('email')?.touched" class="erro">
                    Email válido é obrigatório
                  </span>
                </div>
                <div class="form-group">
                  <label for="telefone">Telefone</label>
                  <input type="tel" id="telefone" formControlName="telefone" required (input)="formatarTelefone($event)">
                  <span *ngIf="formCliente.get('telefone')?.invalid && formCliente.get('telefone')?.touched" class="erro">
                    Telefone é obrigatório
                  </span>
                </div>
                <div class="form-group">
                  <label for="documento">CPF</label>
                  <input type="text" id="documento" formControlName="documento" required (input)="formatarCPF($event)">
                  <span *ngIf="formCliente.get('documento')?.invalid && formCliente.get('documento')?.touched" class="erro">
                    CPF é obrigatório
                  </span>
                </div>
              </form>
            </div>

            <!-- Endereço de Entrega -->
            <div class="checkout-section">
              <h3>Endereço de Entrega</h3>
              <form [formGroup]="formEndereco">
                <div class="form-group">
                  <label for="cep">CEP</label>
                  <input type="text" id="cep" formControlName="cep" required (input)="formatarCEP($event)" (blur)="buscarCEP()">
                  <span *ngIf="formEndereco.get('cep')?.invalid && formEndereco.get('cep')?.touched" class="erro">
                    CEP é obrigatório
                  </span>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="rua">Rua</label>
                    <input type="text" id="rua" formControlName="rua" required>
                  </div>
                  <div class="form-group">
                    <label for="numero">Número</label>
                    <input type="text" id="numero" formControlName="numero" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="complemento">Complemento</label>
                  <input type="text" id="complemento" formControlName="complemento">
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="bairro">Bairro</label>
                    <input type="text" id="bairro" formControlName="bairro" required>
                  </div>
                  <div class="form-group">
                    <label for="cidade">Cidade</label>
                    <input type="text" id="cidade" formControlName="cidade" required>
                  </div>
                </div>
                <div class="form-group">
                  <label for="estado">Estado</label>
                  <input type="text" id="estado" formControlName="estado" required>
                </div>
              </form>
            </div>

            <!-- Pagamento -->
            <div class="checkout-section">
              <h3>Pagamento</h3>
              <div class="payment-methods">
                <h4>Escolha a forma de pagamento:</h4>
                
                <div *ngFor="let metodo of metodosPagamento" 
                     class="payment-method" 
                     [class.selected]="metodoSelecionado === metodo.id"
                     (click)="selecionarMetodoPagamento(metodo.id)">
                  <div class="payment-icon">{{ metodo.icone }}</div>
                  <div class="payment-info">
                    <h5>{{ metodo.nome }}</h5>
                    <p>{{ metodo.descricao }}</p>
                  </div>
                  <div *ngIf="metodo.badge" class="payment-badge">{{ metodo.badge }}</div>
                </div>

                <div id="payment-form-container" *ngIf="metodoSelecionado">
                  <div [ngSwitch]="metodoSelecionado" class="payment-form">
                    <div *ngSwitchCase="'pix'">
                      <h5>Pagamento via PIX</h5>
                      <p>Após confirmar o pedido, você receberá o código PIX para pagamento.</p>
                      <div class="pix-info">
                        <p>✓ Aprovação instantânea</p>
                        <p>✓ Sem taxas adicionais</p>
                        <p>✓ Disponível 24h</p>
                      </div>
                    </div>
                    
                    <div *ngSwitchCase="'credit'">
                      <h5>Dados do Cartão de Crédito</h5>
                      <div class="form-group">
                        <label>Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" (input)="formatarCartao($event)">
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label>Validade</label>
                          <input type="text" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div class="form-group">
                          <label>CVV</label>
                          <input type="text" placeholder="000" maxlength="4">
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Nome no Cartão</label>
                        <input type="text" placeholder="Nome como no cartão">
                      </div>
                      <div class="form-group">
                        <label>Parcelas</label>
                        <select>
                          <option>1x sem juros</option>
                          <option>2x sem juros</option>
                          <option>3x sem juros</option>
                          <option>6x sem juros</option>
                          <option>12x sem juros</option>
                        </select>
                      </div>
                    </div>
                    
                    <div *ngSwitchCase="'debit'">
                      <h5>Dados do Cartão de Débito</h5>
                      <div class="form-group">
                        <label>Número do Cartão</label>
                        <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" (input)="formatarCartao($event)">
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label>Validade</label>
                          <input type="text" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div class="form-group">
                          <label>CVV</label>
                          <input type="text" placeholder="000" maxlength="4">
                        </div>
                      </div>
                      <div class="form-group">
                        <label>Nome no Cartão</label>
                        <input type="text" placeholder="Nome como no cartão">
                      </div>
                    </div>
                    
                    <div *ngSwitchCase="'boleto'">
                      <h5>Pagamento via Boleto</h5>
                      <p>Após confirmar o pedido, você receberá o boleto para pagamento.</p>
                      <div class="boleto-info">
                        <p>✓ Vencimento em 3 dias úteis</p>
                        <p>✓ Sem taxas adicionais</p>
                        <p>✓ Pague em qualquer banco</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="checkout-right">
            <div class="order-summary">
              <h3>Resumo do Pedido</h3>              <div class="checkout-items">
                <div *ngFor="let item of itensCarrinho" class="checkout-item">
                  <img [src]="item.image" [alt]="item.name">
                  <div class="checkout-item-info">
                    <h4>{{ item.name }}</h4>
                    <p>Quantidade: {{ item.quantity }}</p>
                  </div>
                  <div class="checkout-item-price">{{ item.price | currency:'BRL':'symbol':'1.2-2':'pt' }}</div>
                </div>
              </div>
              <div class="order-totals">
                <div class="total-line">
                  <span>Subtotal:</span>
                  <span>{{ formatarMoeda(subtotal) }}</span>
                </div>
                <div class="total-line">
                  <span>Frete:</span>
                  <span>{{ formatarMoeda(frete) }}</span>
                </div>
                <div class="total-line total-final">
                  <span>Total:</span>
                  <span>{{ formatarMoeda(total) }}</span>
                </div>
              </div>
              <div class="checkout-actions">
                <button class="btn-back" (click)="voltarParaCarrinho()">Voltar ao Carrinho</button>
                <button class="btn-pay" [disabled]="!podeProcessarPagamento()" (click)="processarPagamento()">
                  Pagar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .checkout {
      padding: 4rem 0;
      background: #f8fafc;
      min-height: 100vh;
    }

    .checkout.hidden {
      display: none;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .checkout h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: #1f2937;
    }

    .checkout-container {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }

    .checkout-left {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .checkout-section {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .checkout-section h3 {
      margin-bottom: 1.5rem;
      color: #1f2937;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;
    }

    .form-row .form-group {
      margin-bottom: 0;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .erro {
      color: #ef4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      display: block;
    }

    .checkout-right {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .order-summary {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .order-summary h3 {
      margin-bottom: 1.5rem;
      color: #1f2937;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 0.5rem;
    }

    .checkout-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .checkout-item:last-child {
      border-bottom: none;
    }

    .checkout-item img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 8px;
    }

    .checkout-item-info {
      flex: 1;
    }

    .checkout-item-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.9rem;
    }

    .checkout-item-info p {
      margin: 0;
      font-size: 0.8rem;
      color: #64748b;
    }

    .checkout-item-price {
      font-weight: 600;
      color: #2563eb;
    }

    .order-totals {
      margin: 1.5rem 0;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .total-line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .total-final {
      font-size: 1.2rem;
      font-weight: 700;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
      margin-top: 1rem;
    }

    .checkout-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .btn-back {
      background: #64748b;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
      font-weight: 600;
    }

    .btn-back:hover {
      background: #475569;
    }

    .btn-pay {
      background: #f59e0b;
      color: white;
      border: none;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-pay:hover:not(:disabled) {
      background: #d97706;
    }

    .btn-pay:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    /* Métodos de Pagamento */
    .payment-methods h4 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1f2937;
      font-size: 1.2rem;
    }

    .payment-method {
      display: flex;
      align-items: center;
      padding: 1rem;
      margin-bottom: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .payment-method:hover {
      border-color: #2563eb;
    }

    .payment-method.selected {
      border-color: #2563eb;
      background: #f0f9ff;
    }

    .payment-icon {
      font-size: 2rem;
      margin-right: 1rem;
      min-width: 60px;
      text-align: center;
    }

    .payment-info {
      flex: 1;
    }

    .payment-info h5 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      color: #1f2937;
    }

    .payment-info p {
      margin: 0;
      font-size: 0.9rem;
      color: #64748b;
    }

    .payment-badge {
      background: #f59e0b;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .payment-form {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
    }

    .payment-form h5 {
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .pix-info,
    .boleto-info {
      margin-top: 1rem;
    }

    .pix-info p,
    .boleto-info p {
      margin: 0.5rem 0;
      color: #059669;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .checkout-container {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .checkout-right {
        position: static;
      }
      
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .checkout-actions {
        flex-direction: column-reverse;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  exibirCheckout = false;
  itensCarrinho: CarrinhoItem[] = [];
  subtotal = 0;
  frete = 15.00;
  total = 0;
  metodoSelecionado = '';

  formCliente: FormGroup;
  formEndereco: FormGroup;

  metodosPagamento = [
    {
      id: 'pix',
      nome: 'PIX',
      descricao: 'Aprovação instantânea',
      icone: '📱',
      badge: 'Recomendado'
    },
    {
      id: 'credit',
      nome: 'Cartão de Crédito',
      descricao: 'Em até 12x sem juros',
      icone: '💳'
    },
    {
      id: 'debit',
      nome: 'Cartão de Débito',
      descricao: 'Débito à vista',
      icone: '💳'
    },
    {
      id: 'boleto',
      nome: 'Boleto Bancário',
      descricao: 'Vencimento em 3 dias úteis',
      icone: '🧾'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private carrinhoService: CarrinhoService,
    private cepService: CepService,
    private notificacaoService: NotificacaoService
  ) {
    this.formCliente = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      documento: ['', Validators.required]
    });

    this.formEndereco = this.fb.group({
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe(itens => {
      this.itensCarrinho = itens;
      this.subtotal = this.carrinhoService.calcularTotal();
      this.total = this.subtotal + this.frete;
      
      // Mostrar checkout se há itens no carrinho
      this.exibirCheckout = itens.length > 0;
    });
  }

  selecionarMetodoPagamento(metodo: string): void {
    this.metodoSelecionado = metodo;
  }

  buscarCEP(): void {
    const cep = this.formEndereco.get('cep')?.value;
    if (cep && cep.length === 9) {
      this.cepService.buscarCep(cep).subscribe((endereco: EnderecoViaCep) => {
        if (endereco && !endereco.erro) {
          this.formEndereco.patchValue({
            rua: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.localidade,
            estado: endereco.uf
          });
        } else {
          this.notificacaoService.mostrarNotificacao('CEP não encontrado', 'error');
        }
      });
    }
  }

  formatarCEP(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      event.target.value = value;
      this.formEndereco.get('cep')?.setValue(value);
    }
  }

  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = value;
    this.formCliente.get('documento')?.setValue(value);
  }

  formatarTelefone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    event.target.value = value;
    this.formCliente.get('telefone')?.setValue(value);
  }

  formatarCartao(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
  }

  podeProcessarPagamento(): boolean {
    return this.formCliente.valid && 
           this.formEndereco.valid && 
           this.metodoSelecionado !== '' &&
           this.itensCarrinho.length > 0;
  }

  processarPagamento(): void {
    if (!this.podeProcessarPagamento()) {
      this.notificacaoService.mostrarNotificacao('Preencha todos os campos obrigatórios', 'error');
      return;
    }

    this.notificacaoService.mostrarNotificacao('Processando pagamento...', 'info');

    // Simular processamento
    setTimeout(() => {
      const numeroPedido = this.gerarNumeroPedido();
      this.mostrarTelaSuccesso(numeroPedido, this.metodoSelecionado);
    }, 2000);
  }

  gerarNumeroPedido(): string {
    return Date.now().toString();
  }

  mostrarTelaSuccesso(numeroPedido: string, metodoPagamento: string): void {
    const checkoutSection = document.getElementById('checkout');
    if (!checkoutSection) return;

    let paymentInfo = '';
    
    switch (metodoPagamento) {
      case 'pix':
        paymentInfo = `
          <div class="payment-success-info">
            <h4>Código PIX gerado!</h4>
            <p>Use o código abaixo para realizar o pagamento:</p>
            <div class="pix-code">
              <code>00020126580014BR.GOV.BCB.PIX0136${numeroPedido}520400005303986540515.005802BR5925E-Shop6009SAO PAULO62070503***6304</code>
            </div>
            <p>Ou escaneie o QR Code no seu app do banco</p>
          </div>
        `;
        break;
      case 'boleto':
        paymentInfo = `
          <div class="payment-success-info">
            <h4>Boleto gerado!</h4>
            <p>Seu boleto foi gerado com sucesso.</p>
            <p>Código de barras: <strong>03399.65897 12345.678901 23456.789012 3 ${numeroPedido}</strong></p>
            <p>Vencimento: 3 dias úteis</p>
          </div>
        `;
        break;
      default:
        paymentInfo = `
          <div class="payment-success-info">
            <h4>Pagamento aprovado!</h4>
            <p>Sua compra foi processada com sucesso.</p>
          </div>
        `;
    }

    checkoutSection.innerHTML = `
      <div class="container">
        <div class="success-container">
          <div class="success-icon">✅</div>
          <h2>Pedido Realizado com Sucesso!</h2>
          <p>Número do pedido: <strong>#${numeroPedido}</strong></p>
          
          ${paymentInfo}
          
          <div class="success-actions">
            <button class="btn-primary" onclick="window.location.reload()">
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    `;

    // Limpar carrinho
    this.carrinhoService.limparCarrinho();
  }

  voltarParaCarrinho(): void {
    this.exibirCheckout = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatarMoeda(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}
