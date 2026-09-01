import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Meus dados ficam seguros?",
    answer:
      "A APOTHEM é multi-tenant desde o modelo de dados: cada organização e workspace tem isolamento explícito, e a recuperação de conhecimento é ciente de permissões — um agente nunca acessa conteúdo fora do escopo autorizado.",
  },
  {
    question: "A IA pode executar ações sozinha?",
    answer:
      "Ações de risco exigem aprovação humana explícita antes de serem executadas. Um aprovador autorizado vê exatamente o que será feito, com todo o contexto, antes de liberar.",
  },
  {
    question: "Funciona com os sistemas que já uso?",
    answer:
      "A APOTHEM se conecta aos seus sistemas por meio de conexões e ferramentas tipadas. Conectores específicos para o seu stack são desenhados junto com o time de Solutions.",
  },
  {
    question: "Preciso depender de um único provedor de IA?",
    answer:
      "Não. O runtime passa por um gateway multi-modelo: a lógica de negócio não fica acoplada a um provedor específico, e é possível trocar ou combinar modelos sem reescrever agentes.",
  },
  {
    question: "Quanto tempo leva para colocar em produção?",
    answer:
      "Depende do escopo do primeiro caso de uso. Começamos com um piloto único e bem definido, validamos o valor gerado e expandimos a partir daí.",
  },
];

export function Faq() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col divide-y divide-border">
      {FAQ_ITEMS.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium">
            {item.question}
            <ChevronDown
              className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <p className="mt-3 text-sm text-text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
