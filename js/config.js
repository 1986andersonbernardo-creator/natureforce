/* ==========================================================================
   NATURE FORCE — CONFIGURAÇÃO CENTRAL (Landing Page Sênior)
   ========================================================================== */

const NATURE_CONFIG = {
  empresa: {
    nome: 'Nature Force',
    slogan: 'Energia solar que cabe no seu bolso.',
    descricao:
      'Energia solar por assinatura. Economia na sua conta de energia, sem placas e sem obras.',
    email: 'natureforceenergiasolar@gmail.com',
    telefone: '(81) 99660-0664',
    endereco: 'Endereço da sede da Nature Force'
  },

  whatsapp: {
    numero: '5581996600664',
    mensagemPadrao:
      'Olá! Vim pelo site da Nature Force e gostaria de saber mais sobre as soluções disponíveis.'
  },

  redesSociais: {
    linkedin: '#',
    instagram: '#',
    youtube: '#'
  },

  simulador: {
    percentualEconomia: 20, // Desconto estimado (configurável)
    aviso:
      'Simulação estimativa. O desconto e a elegibilidade podem variar conforme região, distribuidora, modalidade e condições aplicáveis.'
  },

  // 4 benefícios premium com ícones Lucide
  beneficios: [
    {
      titulo: 'Até 20% de desconto',
      descricao: 'Economia estimada de até 20%, conforme elegibilidade e condições aplicáveis.',
      icone: 'trending-up',
      iconeHover: 'arrow-up'
    },
    {
      titulo: 'Sem instalação',
      descricao: 'Você não precisa comprar ou instalar painéis no imóvel.',
      icone: 'home',
      iconeHover: 'door-open'
    },
    {
      titulo: 'Sem fidelidade',
      descricao: 'Liberdade para cancelar conforme as condições contratuais.',
      icone: 'lock-open',
      iconeHover: 'lock'
    },
    {
      titulo: 'Sem burocracia',
      descricao: 'Processo simples, digital e sem obras no seu imóvel.',
      icone: 'folder-check',
      iconeHover: 'check'
    }
  ]
};

const NATURE_UTILS = {
  formatBRL(value) {
    return `R$ ${value.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  },

  formatNumber(value) {
    return Math.round(value).toLocaleString('pt-BR');
  },

  getWhatsAppLink(mensagem) {
    const msg = encodeURIComponent(mensagem || NATURE_CONFIG.whatsapp.mensagemPadrao);
    return `https://wa.me/${NATURE_CONFIG.whatsapp.numero}?text=${msg}`;
  }
};