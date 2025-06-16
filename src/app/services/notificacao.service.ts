import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {
  mostrarNotificacao(mensagem: string, tipo: 'success' | 'error' | 'info' = 'success'): void {
    // Remover notificação existente
    const notificacaoExistente = document.querySelector('.notificacao');
    if (notificacaoExistente) {
      notificacaoExistente.remove();
    }
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    // Adicionar estilos inline para garantir que funcione
    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.obterCorFundo(tipo)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      max-width: 400px;
      font-weight: 500;
    `;
    
    document.body.appendChild(notificacao);
    
    // Mostrar notificação
    setTimeout(() => {
      notificacao.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
      notificacao.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notificacao.parentNode) {
          notificacao.remove();
        }
      }, 300);
    }, 3000);
  }

  private obterCorFundo(tipo: string): string {
    switch (tipo) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#10b981';
    }
  }
}
