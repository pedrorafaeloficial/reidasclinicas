
import { Review, FAQ, Clinica } from './types';

export const REVIEWS: Review[] = [
  { id: 1, nome: "Dr. Ricardo Silva", cargo: "Comprador de Clínica Odontológica", avatar: "https://picsum.photos/100/100?random=1", rating: 5, comentario: "O Rei das Clínicas conseguiu uma redução de 15% no valor de fechamento. Excelente negociação!" },
  { id: 2, nome: "Dra. Maria Oliveira", cargo: "Dermatologista", avatar: "https://picsum.photos/100/100?random=2", rating: 5, comentario: "Processo extremamente transparente. Comprei minha segunda unidade em tempo recorde." },
  { id: 3, nome: "Carlos Eduardo", cargo: "Investidor", avatar: "https://picsum.photos/100/100?random=3", rating: 5, comentario: "A análise de faturamento que eles entregam é o que me deu segurança para investir." },
  { id: 4, nome: "Dra. Ana Paula", cargo: "Ginecologista", avatar: "https://picsum.photos/100/100?random=4", rating: 5, comentario: "O suporte jurídico durante a transferência foi impecável. Recomendo fortemente." },
  { id: 5, nome: "Marcos Vinicius", cargo: "Empresário", avatar: "https://picsum.photos/100/100?random=5", rating: 4, comentario: "Negociação justa e ágil. Encontrei exatamente o que procurava em SP." },
  { id: 6, nome: "Dr. Sergio Fontes", cargo: "Cardiologista", avatar: "https://picsum.photos/100/100?random=6", rating: 5, comentario: "Fiquei surpreso com o desconto que conseguiram. O ROI da minha clínica está altíssimo." },
  { id: 7, nome: "Juliana Mendes", cargo: "Gestora Hospitalar", avatar: "https://picsum.photos/100/100?random=7", rating: 5, comentario: "A curadoria de clínicas é de alto nível. Economizei meses de busca." },
  { id: 8, nome: "Dr. Paulo Guedes", cargo: "Ortopedista", avatar: "https://picsum.photos/100/100?random=8", rating: 5, comentario: "Atendimento personalizado. O Rei realmente entende do mercado de saúde no Brasil." },
  { id: 9, nome: "Fernanda Lima", cargo: "Fisioterapeuta", avatar: "https://picsum.photos/100/100?random=9", rating: 5, comentario: "Realizei o sonho da clínica própria com condições de parcelamento que eu não achava possível." },
  { id: 10, nome: "Roberto Almeida", cargo: "Investidor de Franquias", avatar: "https://picsum.photos/100/100?random=10", rating: 4, comentario: "Profissionalismo do início ao fim. O melhor marketplace do setor." },
  { id: 11, nome: "Dra. Beatriz Luz", cargo: "Oftalmologista", avatar: "https://picsum.photos/100/100?random=11", rating: 5, comentario: "Vender e comprar com eles é garantia de não ter dor de cabeça." },
  { id: 12, nome: "Dr. Henrique Vaz", cargo: "Clínico Geral", avatar: "https://picsum.photos/100/100?random=12", rating: 5, comentario: "A equipe de negociação é agressiva no bom sentido. Conseguiram o melhor preço do mercado." },
];

export const FAQS: FAQ[] = [
  { pergunta: "Como funciona o processo de compra?", resposta: "Você escolhe a clínica no catálogo, nossa equipe faz a análise de viabilidade e conduzimos toda a negociação de preço e termos contratuais." },
  { pergunta: "As informações de faturamento são verificadas?", resposta: "Sim! Exigimos auditoria prévia e comprovação de extratos para garantir que o que está sendo vendido é real." },
  { pergunta: "Vocês cuidam da parte jurídica?", resposta: "Contamos com parceiros especializados em direito médico para garantir que a transferência de CNPJ e licenças seja feita sem riscos." },
  { pergunta: "Qual a comissão do Rei das Clínicas?", resposta: "Trabalhamos com taxas variáveis dependendo do tamanho da operação, sempre focadas no sucesso do fechamento." }
];

export const INITIAL_CLINICS: Clinica[] = [];

export const CONTACT_WHATSAPP = "11919618710";
export const CONTACT_WHATSAPP_FORMATTED = "11 91961-8710";
export const WHATSAPP_MESSAGE = encodeURIComponent("Olá vim do site e quero mais informações sobre as clinicas!");
