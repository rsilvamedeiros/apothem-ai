# APOTHEM AI — Visão Geral da Arquitetura

**Status:** Baseline inicial de arquitetura  
**Projeto:** APOTHEM AI  
**Domínio principal:** `apothemai.com.br`  
**Repositório principal de frontend:** `apothem-ai`  
**Repositório principal de backend:** `apothem-api`  
**Última atualização:** Agosto de 2026

---

# 1. Objetivo

Este documento define a baseline inicial de arquitetura da APOTHEM AI.

O objetivo é estabelecer direção técnica suficiente antes da implementação, para que o projeto evolua de forma consistente sem obrigar Claude Code, desenvolvedores ou futuros colaboradores a reinterpretarem repetidamente decisões arquiteturais básicas.

A APOTHEM não deve ser tratada apenas como uma aplicação web com funcionalidades de IA.

A plataforma está sendo desenhada como uma **camada de inteligência empresarial** capaz de conectar:

- usuários;
- organizações;
- workspaces;
- conhecimento empresarial;
- sistemas externos;
- APIs;
- bancos de dados;
- modelos de IA;
- ferramentas;
- workflows;
- aprovações humanas;
- execuções de agentes.

A tese central do produto permanece:

> **Compreender → Conectar → Raciocinar → Agir**

A arquitetura deve suportar essa tese desde o início.

---

# 2. Arquitetura de produto em alto nível

Em alto nível, a APOTHEM é composta por diversas camadas lógicas.

```text
                        APOTHEM AI

                            │
                            ▼
                    CAMADA DE EXPERIÊNCIA
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
        Site Institucional             Web App
     apothemai.com.br          app.apothemai.com.br
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                     APOTHEM API
                  api.apothemai.com.br
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
          ▼                 ▼                  ▼
      NÚCLEO DE DOMÍNIO   RUNTIME DE IA      WORKERS
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
            ┌───────────────┼────────────────┐
            │               │                │
            ▼               ▼                ▼
       PostgreSQL        Redis/Queue      Object Storage
        + pgvector
                            │
                            ▼
                    SISTEMAS EXTERNOS
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
     Provedores de IA      APIs            ERP / CRM
```

---

# 3. Estratégia de repositórios

A APOTHEM deve inicialmente utilizar **dois repositórios principais**.

Essa separação é intencional.

## 3.1 `apothem-ai`

Responsável pelas aplicações visíveis ao usuário e pela documentação principal de produto.

```text
apothem-ai/
│
├── apps/
│   ├── site/
│   └── web/
│
├── packages/
│   ├── ui/
│   ├── frontend-config/
│   └── api-client/
│
├── docs/
│
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

Responsabilidades:

- site institucional;
- aplicação SaaS autenticada;
- arquitetura de frontend;
- Design System;
- navegação;
- dashboards;
- Agent Builder;
- interface de Knowledge;
- interface de Connections;
- interface de aprovações;
- monitoramento de execuções;
- client tipado da API;
- documentação de produto.

Deploy:

```text
apps/site
→ apothemai.com.br
```

```text
apps/web
→ app.apothemai.com.br
```

Fornecedor inicial:

**Vercel**

---

# 4. `apothem-api`

O backend deve possuir repositório próprio desde o início.

```text
apothem-api/
│
├── src/
│   ├── modules/
│   ├── common/
│   ├── infrastructure/
│   └── main/
│
├── workers/
├── database/
├── migrations/
├── docs/
├── infra/
│
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

Responsabilidades:

- API;
- orquestração de autenticação;
- autorização;
- organizações;
- workspaces;
- usuários e memberships;
- agentes;
- Agent Runtime;
- AI Gateway;
- Knowledge Engine;
- conectores;
- tools;
- workflows;
- aprovações;
- histórico de execuções;
- uso;
- auditoria;
- acesso ao banco;
- workers em background;
- webhooks;
- integrações.

Deploy:

```text
apothem-api
      ↓
api.apothemai.com.br
```

O backend pode inicialmente utilizar uma plataforma gerenciada de containers como Railway.

A arquitetura não deve depender permanentemente do Railway.

---

# 5. Por que frontend e backend são separados

O backend da APOTHEM possui requisitos operacionais significativamente diferentes do frontend.

O frontend lida principalmente com:

- páginas;
- formulários;
- visualização;
- interações;
- dashboards;
- interfaces de configuração;
- streaming de respostas.

O backend precisa suportar:

- tarefas de IA de longa duração;
- processamento em background;
- execuções de agentes;
- ingestão de documentos;
- embeddings;
- workflows;
- tarefas agendadas;
- retries;
- filas;
- webhooks;
- integrações externas;
- secrets;
- bancos de dados;
- trilhas de auditoria.

Por isso, ambas as camadas devem possuir ciclos de deploy independentes.

```text
apothem-ai
     │
     │ HTTPS
     ▼
api.apothemai.com.br
     │
     ▼
apothem-api
```

O frontend é um consumidor da plataforma APOTHEM.

O backend representa o núcleo operacional.

---

# 6. Estratégia de contratos da API

Frontend e backend não devem duplicar tipos manualmente.

O backend deve ser a fonte de verdade.

Fluxo recomendado:

```text
apothem-api
     │
     ▼
Especificação OpenAPI
     │
     ▼
openapi.json
     │
     ▼
Geração de Client
     │
     ▼
apothem-ai/packages/api-client
```

Isso evita divergências como:

```text
frontend/User.ts
backend/User.ts
```

mantidos separadamente.

O client gerado deve fornecer acesso tipado às APIs da APOTHEM.

---

# 7. Estilo arquitetural

O backend deve começar como um **monólito modular**.

Essa é uma decisão importante.

A APOTHEM não deve começar com dezenas de microserviços.

Em vez disso:

```text
                    APOTHEM API

                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
     ▼                   ▼                   ▼
 Identity            Agents             Knowledge
     │                   │                   │
     ▼                   ▼                   ▼
Organizations         Connect               Flow
     │                   │                   │
     ▼                   ▼                   ▼
 Permissions        Approvals             Audit
```

Esses módulos permanecem inicialmente dentro do mesmo backend, mas com fronteiras claras.

No futuro, determinados módulos poderão ser extraídos para serviços independentes quando requisitos operacionais justificarem isso.

Exemplos:

```text
Knowledge ingestion
Agent Runtime
Workflow workers
Connector synchronization
```

podem se tornar serviços independentes futuramente.

---

# 8. Por que não usar microserviços no início

Microserviços introduzem:

- transações distribuídas;
- falhas de rede;
- service discovery;
- múltiplos pipelines;
- mais observabilidade;
- autenticação entre serviços;
- problemas de consistência;
- maior complexidade de debugging.

Esses custos não são justificados durante o MVP.

A arquitetura inicial deve otimizar para:

> **fronteiras fortes sem complexidade distribuída.**

---

# 9. Hierarquia principal do domínio

O modelo organizacional principal deve ser:

```text
Organization
     │
     ├── Members
     ├── Roles
     ├── API Keys
     ├── Usage
     │
     └── Workspaces
             │
             ├── Agents
             ├── Knowledge Bases
             ├── Connections
             ├── Tools
             ├── Workflows
             ├── Conversations
             ├── Runs
             └── Audit Events
```

---

# 10. Organization

Uma Organization representa o principal tenant da APOTHEM.

Exemplos:

```text
Acme Corporation
Banco XYZ
Escritório ABC
```

Responsabilidades no nível da Organization:

- assinatura;
- billing;
- membros;
- roles globais;
- consumo;
- limites;
- políticas de segurança;
- isolamento de tenant.

Todo recurso pertencente ao cliente deve estar direta ou indiretamente associado a uma Organization.

---

# 11. Workspace

Um Workspace é uma fronteira operacional dentro de uma Organization.

Exemplo:

```text
Organization
└── Acme Corporation
    │
    ├── Financeiro
    ├── Jurídico
    ├── Operações
    └── Atendimento
```

Workspaces podem isolar:

- agentes;
- conhecimento;
- conexões;
- workflows;
- conversas;
- usuários;
- permissões.

Um Workspace não precisa necessariamente representar um departamento.

É uma fronteira organizacional flexível.

---

# 12. Modelo de Agent

Agents devem ser versionados.

O sistema deve diferenciar:

```text
Agent
```

de:

```text
AgentVersion
```

Exemplo:

```text
Agent
│
├── id
├── name
├── status
└── currentVersionId
     │
     └── AgentVersion
          ├── instructions
          ├── model policy
          ├── tools
          ├── knowledge
          ├── guardrails
          ├── autonomy policy
          └── configuration
```

Versões publicadas devem ser imutáveis.

Isso permite responder sempre:

> Qual configuração exata produziu esse resultado?

---

# 13. Arquitetura de execução dos Agents

O fluxo de execução deve conceitualmente seguir:

```text
Usuário / Sistema
      │
      ▼
    Task
      │
      ▼
     Run
      │
      ▼
Resolve AgentVersion
      │
      ▼
Monta contexto da execução
      │
      ├── Instructions
      ├── Contexto do usuário
      ├── Contexto do Workspace
      ├── Histórico da conversa
      ├── Memory
      └── Knowledge
      │
      ▼
Model Router
      │
      ▼
AI Gateway
      │
      ▼
Reasoning
      │
      ▼
Tool Proposal?
   │       │
   │ não   │ sim
   ▼       ▼
Resposta  Valida Tool
            │
            ▼
      Avalia Política
            │
     ┌──────┼─────────┐
     │      │         │
   DENY   ALLOW    APPROVAL
     │      │         │
     ▼      ▼         ▼
   Para   Executa   Aguarda
            │         │
            │     Decisão Humana
            │         │
            └────┬────┘
                 ▼
          Resultado da Tool
                 │
                 ▼
        Continua execução
                 │
                 ▼
             Resposta
                 │
                 ▼
       Trace + Audit + Usage
```

---

# 14. Run

Um Run representa uma tentativa imutável de execução.

Possíveis estados:

```text
queued
running
waiting_for_approval
completed
failed
cancelled
expired
```

Um Run deve armazenar referências como:

```text
id
organization_id
workspace_id
agent_id
agent_version_id
conversation_id
status
started_at
completed_at
trace_id
```

Detalhes de uma execução concluída não devem ser sobrescritos.

---

# 15. Run Steps

Uma execução complexa de Agent é composta por múltiplas etapas.

Exemplo:

```text
Run

01 Context Build
02 Knowledge Retrieval
03 LLM Request
04 Tool Proposal
05 Approval Request
06 Tool Execution
07 LLM Request
08 Final Response
```

Cada etapa relevante deve ser rastreável.

Conceitualmente:

```text
run_steps
```

pode incluir:

```text
type
status
input
output
duration
provider
model
tokens
tool
error
metadata
```

Dados sensíveis devem respeitar políticas de retenção e auditoria.

---

# 16. Arquitetura Multi-model

A APOTHEM não deve ligar Agents diretamente a um único provedor de IA.

Em vez disso:

```text
Agent Runtime
      │
      ▼
Model Router
      │
      ▼
AI Gateway
      │
 ┌────┼─────────────┐
 │    │             │
 ▼    ▼             ▼
OpenAI Anthropic   Google
```

O Agent Runtime interage com uma abstração interna.

Exemplos de operações:

```text
generate()
stream()
embed()
generateStructured()
```

APIs específicas de cada fornecedor ficam encapsuladas nos adapters.

---

# 17. Model Router

O Model Router poderá futuramente escolher fornecedores considerando:

- tarefa;
- qualidade;
- latência;
- custo;
- tamanho de contexto;
- disponibilidade;
- políticas da organização;
- políticas de dados.

Exemplo:

```text
Agent Configuration
Model = AUTO
       │
       ▼
Model Router
       │
       ├── classificação da tarefa
       ├── política
       ├── limite de custo
       └── disponibilidade
       │
       ▼
Modelo selecionado
```

O MVP não precisa de um router extremamente sofisticado.

A arquitetura deve apenas permitir sua evolução.

---

# 18. Arquitetura de Knowledge

Knowledge deve ser um domínio de primeira classe da plataforma.

Não deve ser implementado apenas como uma função auxiliar dentro de Agents.

Conceitualmente:

```text
Knowledge Base
      │
      ├── Knowledge Sources
      │       │
      │       ├── PDF
      │       ├── DOCX
      │       ├── CSV
      │       ├── Website
      │       ├── API
      │       └── Database
      │
      ▼
Ingestion Pipeline
      │
      ▼
Parsing
      │
      ▼
Normalization
      │
      ▼
Chunking
      │
      ▼
Embedding
      │
      ▼
PostgreSQL + pgvector
      │
      ▼
Retrieval
```

---

# 19. Retrieval de conhecimento

Inicialmente pode utilizar:

```text
Semantic Search
+
Metadata Filtering
```

Depois:

```text
Semantic Search
+
Keyword Search
+
Metadata Filtering
+
Reranking
```

passando para:

```text
Hybrid Retrieval
```

Todos os chunks recuperados devem manter metadados da fonte.

Isso permitirá que a APOTHEM apresente citações.

---

# 20. Arquitetura do Connect

Connections representam credenciais e configurações de sistemas externos.

Exemplos:

```text
Google Workspace
Microsoft 365
HubSpot
Salesforce
PostgreSQL
REST API
SAP
TOTVS
```

Uma Connection não deve definir automaticamente tudo o que um Agent pode executar.

Em vez disso:

```text
Connection
    │
    └── disponibiliza
          │
          ▼
        Tools
```

Exemplo:

```text
HubSpot Connection

Tools:
- get_contact
- search_contacts
- create_contact
- update_deal
```

---

# 21. Tools

Tools representam operações executáveis disponíveis para Agents ou Workflows.

Exemplo:

```text
Tool
├── name
├── description
├── input schema
├── output schema
├── risk
├── permissions
└── executor
```

Exemplos:

```text
search_documents
query_database
send_email
create_invoice
update_customer
create_ticket
```

Tools devem usar contratos estruturados de entrada e saída.

Execuções free-form devem ser evitadas sempre que possível.

---

# 22. Autorização de Tools

O fato de um Agent visualizar uma Tool não significa que ele possa executar qualquer operação.

A execução deve considerar:

```text
Permissão do Usuário
        +
Permissão do Agent
        +
Política do Workspace
        +
Política da Tool
        +
Risco da ação
```

Exemplo:

```text
Financial Agent
      │
      ├── read_transactions → permitido
      ├── create_report → permitido
      └── transfer_money → requer aprovação
```

---

# 23. Human-in-the-Loop

A aprovação humana deve fazer parte da arquitetura desde o início.

Modelo sugerido:

```text
Nível 0
Somente leitura

Nível 1
Recomendar

Nível 2
Preparar

Nível 3
Executar após aprovação

Nível 4
Autônomo dentro de limites
```

Uma aprovação pode depender de:

- Agent;
- Tool;
- ação;
- valor;
- Workspace;
- usuário;
- Organization;
- nível de risco.

---

# 24. Ciclo de aprovação

```text
Agent
 │
 ▼
Tool Proposal
 │
 ▼
Policy Engine
 │
 ▼
Approval Required
 │
 ▼
Approval Request
 │
 ▼
Human
 │
 ├── Approve
 │
 └── Reject
 │
 ▼
Execution / Cancellation
 │
 ▼
Audit
```

Decisões de aprovação devem se tornar registros imutáveis de auditoria.

---

# 25. Arquitetura de Workflow

Apothem Flow deverá futuramente fornecer orquestração de processos.

Conceito:

```text
Trigger
  │
  ▼
Node
  │
  ▼
Agent
  │
  ▼
Condition
  │
 ┌┴──────────┐
 │           │
 ▼           ▼
Tool      Approval
 │           │
 └─────┬─────┘
       ▼
      End
```

Possíveis tipos de Node:

```text
Trigger
Agent
Tool
Condition
Transform
Approval
Delay
Webhook
HTTP
Loop
```

O MVP não deve tentar implementar inicialmente um editor visual completo de workflows.

Mas Flow deve continuar existindo como domínio próprio.

---

# 26. Arquitetura de banco

Banco inicial:

```text
PostgreSQL
+
pgvector
```

Fornecedor gerenciado inicial:

```text
Neon
```

PostgreSQL permanece como system of record.

A aplicação não deve depender de lógica específica do Neon.

---

# 27. Grupos iniciais de entidades

Uma organização preliminar do banco:

```text
IDENTITY

users
organizations
memberships
workspaces
workspace_members
roles
permissions
```

```text
AGENTS

agents
agent_versions
agent_tool_bindings
agent_knowledge_bindings
```

```text
KNOWLEDGE

knowledge_bases
knowledge_sources
documents
document_chunks
embeddings
```

```text
CONNECT

connections
connection_credentials
tools
tool_bindings
```

```text
EXECUTION

conversations
messages
runs
run_steps
tool_executions
approval_requests
```

```text
FLOW

workflows
workflow_versions
workflow_runs
```

```text
CONTROL

audit_events
usage_records
api_keys
webhooks
```

---

# 28. Multi-tenancy

A APOTHEM deve nascer tenant-aware desde o primeiro schema.

Toda entidade pertencente a um tenant deve ser rastreável até:

```text
organization_id
```

e frequentemente:

```text
workspace_id
```

Exemplo:

```text
organizations
       │
       ▼
workspaces
       │
       ├── agents
       ├── knowledge_bases
       ├── connections
       └── workflows
```

Fronteiras de tenant não podem depender apenas de filtros do frontend.

A autorização deve ocorrer na API e na camada de acesso a dados.

---

# 29. Autenticação e autorização

Autenticação responde:

> Quem é você?

Autorização responde:

> O que você pode fazer?

Esses conceitos devem permanecer separados.

RBAC inicial pode conter:

```text
Organization Owner
Organization Admin
Workspace Admin
Member
Viewer
```

Mas a autorização deve futuramente avaliar capabilities.

Exemplos:

```text
agent:create
agent:update
agent:run
knowledge:read
knowledge:write
connection:manage
approval:decide
audit:read
```

---

# 30. Regras de acesso aos dados

O acesso ao banco não deve ignorar contexto de tenant.

Fluxo preferencial:

```text
Request
  │
  ▼
Authentication
  │
  ▼
Organization Context
  │
  ▼
Workspace Context
  │
  ▼
Authorization
  │
  ▼
Service
  │
  ▼
Repository
  │
  ▼
Database
```

Isso torna isolamento de tenant parte explícita de cada operação.

---

# 31. Processamento em background

Operações lentas ou sujeitas a retries não devem necessariamente permanecer dentro da requisição HTTP.

Exemplos:

```text
Document ingestion
Embedding generation
Agent execution
Workflow processing
Connector synchronization
Large imports
Report generation
```

Arquitetura:

```text
API
 │
 ▼
Job
 │
 ▼
Queue
 │
 ▼
Worker
 │
 ▼
Result
```

A API pode retornar:

```text
202 Accepted
```

junto de um identificador da execução.

O frontend pode usar:

- polling;
- Server-Sent Events;
- WebSockets;

conforme a necessidade.

---

# 32. Queue

Redis + BullMQ é uma implementação inicial razoável quando workloads em background forem necessários.

Filas possíveis:

```text
agent.run
knowledge.ingest
knowledge.embed
connector.sync
workflow.execute
tool.execute
```

A implementação da fila deve permanecer atrás de abstrações.

---

# 33. Object Storage

Arquivos grandes não devem ser armazenados diretamente no PostgreSQL.

Utilizar Object Storage.

Arquitetura:

```text
Browser
   │
   ▼
Upload
   │
   ▼
Object Storage
   │
   ├── PDF
   ├── DOCX
   ├── XLSX
   └── outros
   │
   ▼
Metadata
   │
   ▼
PostgreSQL
```

Possíveis fornecedores iniciais:

- Cloudflare R2;
- Vercel Blob;
- serviço compatível com S3.

Longo prazo:

- AWS S3.

---

# 34. Baseline de infraestrutura

Infraestrutura inicial:

```text
Frontend
Vercel

Backend
Managed container runtime
Inicialmente Railway

Database
Neon PostgreSQL

Vector
pgvector

Redis
Upstash / managed Redis quando necessário

Storage
S3-compatible Object Storage

AI
OpenAI / Anthropic / Google

DNS
apothemai.com.br
```

---

# 35. Domínios de produção

```text
apothemai.com.br
```

Site institucional.

```text
app.apothemai.com.br
```

Plataforma autenticada.

```text
api.apothemai.com.br
```

Backend API.

```text
docs.apothemai.com.br
```

Documentação.

```text
status.apothemai.com.br
```

Status da plataforma.

---

# 36. Domínios de staging

Recomendado:

```text
staging.apothemai.com.br
app.staging.apothemai.com.br
api.staging.apothemai.com.br
```

Dados de produção e staging devem permanecer isolados.

---

# 37. Desenvolvimento local

O backend deve funcionar localmente sem obrigar desenvolvedores a reproduzir a infraestrutura completa da cloud.

Dependências locais recomendadas:

```text
Docker Compose

├── PostgreSQL
├── Redis
└── MinIO
```

APIs externas de IA podem continuar sendo utilizadas remotamente.

O objetivo é chegar a:

```bash
docker compose up -d
```

seguido da inicialização das aplicações.

---

# 38. Repositório de infraestrutura

Um repositório separado de infraestrutura **não é necessário inicialmente**.

Configurações de deploy e infraestrutura local permanecem no repositório correspondente.

Exemplo:

```text
apothem-api/
└── infra/
    ├── docker/
    ├── railway/
    └── scripts/
```

No futuro, quando a APOTHEM possuir infraestrutura relevante em AWS/Terraform, criar:

```text
apothem-infrastructure
```

Possíveis conteúdos:

```text
Terraform
AWS Accounts
IAM
VPC
ECS
RDS
Redis
S3
SQS
EventBridge
CloudFront
WAF
Secrets Manager
Monitoring
```

---

# 39. Topologia futura de repositórios

No longo prazo, a organização GitHub da APOTHEM poderá evoluir para:

```text
apothem-ai
```

Frontend, produto e Design System.

```text
apothem-api
```

Backend e runtime.

```text
apothem-infrastructure
```

Infraestrutura de cloud.

```text
apothem-sdk
```

SDKs públicos.

```text
apothem-docs
```

Documentação externa para desenvolvedores.

Nem todos devem ser criados agora.

Inicialmente:

```text
apothem-ai
apothem-api
```

são suficientes.

---

# 40. Arquitetura de observabilidade

Toda execução importante deve futuramente possuir um trace identifier.

Exemplo:

```text
Request
traceId = abc123
    │
    ▼
API
    │
    ▼
Agent Run
    │
    ▼
Knowledge Retrieval
    │
    ▼
LLM Call
    │
    ▼
Tool Execution
    │
    ▼
Database
    │
    ▼
Audit
```

A observabilidade deve cobrir:

### Aplicação

- requisições HTTP;
- erros;
- latência;
- queries;
- workers;
- falhas de fila.

### IA

- modelo;
- provider;
- prompt;
- latência;
- input tokens;
- output tokens;
- tool calls;
- retrieval;
- retries;
- falhas.

### Negócio

- runs;
- approvals;
- usage;
- organizations;
- utilização de Knowledge.

---

# 41. Uso e custos

Toda chamada de IA deverá futuramente produzir informações de uso.

Exemplo:

```text
organizationId
workspaceId
agentId
runId
provider
model
inputTokens
outputTokens
embeddingTokens
estimatedCost
timestamp
```

Isso será necessário para:

- controle de custos;
- quotas;
- planos;
- proteção contra abuso;
- billing futuro.

---

# 42. Princípios de segurança

Segurança deve fazer parte da arquitetura.

## Least privilege

Agents recebem apenas as permissões necessárias.

## Tenant isolation

Dados de uma Organization nunca podem vazar para outra.

## Secret isolation

Credenciais externas não devem ser armazenadas como registros plaintext comuns.

## Auditability

Ações importantes devem gerar eventos imutáveis de auditoria.

## Human approval

Ações de risco podem exigir aprovação humana.

## Encryption

Dados devem ser protegidos em trânsito e em repouso.

---

# 43. Credenciais

A APOTHEM futuramente armazenará credenciais relacionadas a:

- APIs;
- databases;
- SaaS;
- OAuth;
- service accounts.

Essas credenciais exigem estratégia específica.

Conceitualmente:

```text
Connection
    │
    ▼
Credential Reference
    │
    ▼
Encrypted Secret Storage
```

Registros da aplicação devem evitar expor credenciais em texto puro.

Uma migração futura para:

```text
AWS Secrets Manager
Vault
Cloud Provider KMS
```

deve continuar possível.

---

# 44. Arquitetura API-first

A APOTHEM deve ser projetada para que sua aplicação web seja apenas um consumidor da API.

```text
                  APOTHEM API

            ┌──────────┼───────────┐
            │          │           │
            ▼          ▼           ▼
          Web        SDK        Customer
          App                    Systems
```

Isso habilita:

- white-label;
- SDK;
- integrações externas;
- embedded agents;
- plataformas de clientes.

---

# 45. APIs internas e públicas

Nem todo endpoint interno deve automaticamente se tornar público.

Conceitualmente:

```text
Internal API
    │
    ├── operações administrativas
    ├── operações do web app
    └── runtime interno
```

e:

```text
Public API
    │
    ├── agents
    ├── knowledge
    ├── runs
    └── capacidades selecionadas
```

A API pública deve possuir:

- versionamento explícito;
- API keys;
- scopes;
- rate limits;
- idempotência;
- contratos estáveis.

---

# 46. Arquitetura orientada a eventos

A APOTHEM deverá gradualmente introduzir domain/application events.

Exemplos:

```text
agent.created
agent.published
agent.run.started
agent.run.completed

knowledge.source.created
knowledge.source.ingested

approval.requested
approval.approved
approval.rejected

connection.created
connector.sync.completed
```

Inicialmente esses eventos podem permanecer dentro do monólito modular.

Posteriormente podem ser publicados em infraestrutura externa.

---

# 47. Regras de dependência

Módulos devem se comunicar através de interfaces explícitas.

Evitar:

```text
AgentService
alterando diretamente
tabelas do Knowledge
```

Preferir:

```text
Agent Module
      │
      ▼
Knowledge Service Interface
      │
      ▼
Knowledge Module
```

Isso facilita extração futura.

---

# 48. Proposta de módulos do backend

Estrutura inicial:

```text
src/modules/

├── identity/
├── organizations/
├── workspaces/
├── authorization/
├── agents/
├── conversations/
├── runs/
├── models/
├── knowledge/
├── connections/
├── tools/
├── approvals/
├── workflows/
├── audit/
├── usage/
└── webhooks/
```

Infraestrutura de apoio:

```text
src/infrastructure/

├── database/
├── queue/
├── storage/
├── ai/
├── secrets/
├── telemetry/
└── http/
```

---

# 49. Arquitetura interna de módulo

Exemplo:

```text
agents/
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   └── events/
│
├── application/
│   ├── commands/
│   ├── queries/
│   └── services/
│
├── infrastructure/
│   ├── repositories/
│   └── adapters/
│
└── presentation/
    └── http/
```

Isso é uma direção, não uma obrigação de criar centenas de arquivos prematuramente.

O objetivo é clareza arquitetural, não burocracia.

---

# 50. Arquitetura de frontend

O frontend também deve utilizar fronteiras orientadas por domínio.

Exemplo:

```text
apps/web/src/

├── app/
├── features/
│   ├── organizations/
│   ├── workspaces/
│   ├── agents/
│   ├── knowledge/
│   ├── connections/
│   ├── approvals/
│   └── runs/
│
├── components/
├── lib/
└── styles/
```

Evitar um único diretório global contendo centenas de componentes não relacionados.

---

# 51. Responsabilidades do frontend

O frontend deve possuir:

- apresentação;
- navegação;
- interação;
- optimistic UX;
- forms;
- estado local da interface;
- visualização de streaming.

O frontend não deve possuir:

- políticas de autorização;
- isolamento de tenant;
- regras empresariais críticas;
- Agent Runtime;
- regras de escolha de modelo;
- billing rules.

Essas responsabilidades pertencem ao backend.

---

# 52. Independência de deploy

Frontend e backend devem poder ser implantados independentemente.

Exemplo:

```text
Frontend release
v1.12.0

Backend release
v1.8.3
```

Compatibilidade da API deve permitir que essas versões coexistam.

Breaking changes não devem ser implantadas sem coordenação.

---

# 53. Caminho de evolução

Evolução esperada:

```text
FASE 1

Frontend
Backend Modular Monolith
PostgreSQL
Basic AI Gateway
```

↓

```text
FASE 2

Workers
Redis
Knowledge ingestion
pgvector
```

↓

```text
FASE 3

Tools
Approvals
Connector framework
```

↓

```text
FASE 4

Workflow Engine
Scheduled Jobs
Advanced Observability
```

↓

```text
FASE 5

Selective Service Extraction
Enterprise Infrastructure
AWS/Terraform
```

---

# 54. O que não implementar primeiro

Não começar construindo:

- microserviços;
- Kubernetes;
- workflow builder completo;
- marketplace;
- infraestrutura white-label;
- billing sofisticado;
- dezenas de conectores;
- multi-agent swarms;
- model routing altamente sofisticado.

Primeiro provar:

```text
Organization
     ↓
Workspace
     ↓
Agent
     ↓
Agent Version
     ↓
Knowledge
     ↓
Conversation
     ↓
Run
     ↓
LLM
     ↓
Result
```

Depois:

```text
Tool
 ↓
Approval
 ↓
Execution
```

Isso comprova a tese central.

---

# 55. Sequência inicial de implementação do backend

Ordem recomendada:

```text
01 Repository Bootstrap
```

Node.js / TypeScript, lint, testes e environments.

```text
02 Database
```

PostgreSQL, migrations e camada de acesso.

```text
03 Identity
```

Users e autenticação.

```text
04 Organizations
```

Organizations e memberships.

```text
05 Workspaces
```

Fronteiras de Workspace.

```text
06 Authorization
```

RBAC e permissions.

```text
07 Agents
```

Agent e AgentVersion.

```text
08 AI Gateway
```

Abstração inicial dos providers.

```text
09 Conversations
```

Conversation e Messages.

```text
10 Runs
```

Lifecycle de execução.

```text
11 Knowledge
```

Upload, ingestion, embeddings e retrieval.

```text
12 Tools
```

Definições estruturadas de Tools.

```text
13 Approval Engine
```

Human-in-the-loop.

```text
14 Workers
```

Execuções assíncronas.

```text
15 Observability
```

Tracing, usage e custos.

---

# 56. Sequência inicial de implementação do frontend

```text
01 Application Shell
02 Authentication
03 Organization Selector
04 Workspace Selector
05 Dashboard
06 Agents List
07 Agent Builder
08 Agent Details
09 Agent Chat
10 Knowledge
11 Connections
12 Runs
13 Approvals
14 Settings
```

A interface deve acompanhar capacidades reais do backend.

---

# 57. Direção tecnológica atual

Frontend:

```text
Next.js
React
TypeScript
```

Backend:

```text
Node.js
TypeScript
```

Banco:

```text
PostgreSQL
pgvector
```

Queues:

```text
Redis
BullMQ
```

Infra local:

```text
Docker Compose
```

IA:

```text
OpenAI
Anthropic
Google

via APOTHEM AI Gateway
```

---

# 58. Resumo das decisões arquiteturais

| Tema | Decisão |
|---|---|
| Repositório frontend | `apothem-ai` |
| Repositório backend | `apothem-api` |
| Repositório de infraestrutura | Não inicialmente |
| Deploy frontend | Vercel |
| Deploy backend | Managed container runtime |
| Domínio da API | `api.apothemai.com.br` |
| Banco | PostgreSQL |
| Vector | pgvector |
| Arquitetura backend | Monólito modular |
| Background | Workers |
| Queue | Redis/BullMQ quando necessário |
| Storage | Compatível com S3 |
| Estratégia IA | Multi-model |
| Acesso a IA | AI Gateway central |
| API | API-first |
| Contratos | OpenAPI |
| Multi-tenancy | Organization + Workspace |
| Configuração de Agents | Versionada |
| Controle de risco | Human-in-the-loop |
| Auth | Authentication + RBAC/permissions |
| Knowledge | Domínio de primeira classe |
| Infraestrutura | Managed-first e portável |

---

# 59. Princípios arquiteturais não negociáveis

Os seguintes itens devem ser tratados como baseline até alteração formal através de ADR.

1. **APOTHEM é multi-tenant.**
2. **Isolamento de tenants é garantido no servidor.**
3. **Agents são versionados.**
4. **Execuções concluídas permanecem rastreáveis.**
5. **Providers de IA são acessados através de abstrações.**
6. **Lógica específica de provider não deve se espalhar pelo domínio.**
7. **Tools utilizam contratos estruturados.**
8. **Ações de alto risco podem exigir aprovação humana.**
9. **Knowledge é um domínio da plataforma.**
10. **Frontend não controla segurança ou regras empresariais.**
11. **Frontend e backend possuem deploy independente.**
12. **Backend nasce como monólito modular.**
13. **Microserviços só aparecem quando houver justificativa operacional.**
14. **PostgreSQL é o system of record inicial.**
15. **Providers de infraestrutura são detalhes substituíveis.**
16. **Uso e custos de IA devem ser mensuráveis por tenant e Run.**
17. **Toda operação importante deve ser auditável.**
18. **A arquitetura API-first deve permitir consumidores externos.**

---

# 60. North Star arquitetural

A APOTHEM deve evoluir para:

```text
                    BUSINESS

                       │
        ┌──────────────┼──────────────┐
        │              │              │
      DATA          SYSTEMS        KNOWLEDGE
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
                  APOTHEM AI

                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Agents       Knowledge      Flow
          │            │            │
          └────────────┼────────────┘
                       │
                  Connect / Tools
                       │
                       ▼
                    ACTION
                       │
                       ▼
               Human Governance
```

A APOTHEM não é simplesmente o modelo de IA.

Ela é a camada de:

- orquestração;
- contexto;
- permissões;
- conhecimento;
- execução;
- governança;

entre inteligência e operações empresariais reais.

---

# 61. Declaração final de arquitetura

A arquitetura inicial busca equilibrar duas prioridades:

**construir rapidamente**

sem sacrificar:

**uma fundação capaz de evoluir para uma plataforma enterprise.**

Por isso, a APOTHEM começa com:

```text
2 repositórios
+
backend modular
+
infraestrutura gerenciada
+
PostgreSQL
+
abstração multi-model
+
forte isolamento de tenants
+
Agents versionados
+
execuções auditáveis
+
ações controladas por aprovação humana
```

em vez de adotar prematuramente uma arquitetura distribuída complexa.

A arquitetura deve se tornar mais complexa apenas quando o próprio produto demonstrar que essa complexidade é necessária.

**APOTHEM AI**  
**Intelligence at the core.**