
export interface Clinica {
  id: string;
  nome: string;
  localizacao: string;
  preco: number;
  faturamentoMensal: number;
  descricao: string;
  imagem: string;
  especialidades: string[];
}

export interface Review {
  id: number;
  nome: string;
  cargo: string;
  comentario: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  pergunta: string;
  resposta: string;
}
