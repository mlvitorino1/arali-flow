import type { Metadata } from "next"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListChecks,
  MessageSquareText,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Página Inicial",
  description: "Visão geral do Arali Flow",
}

const metrics = [
  {
    label: "Projetos acompanhados",
    value: "12",
    detail: "+2 novos esta semana",
    icon: FolderKanban,
    tone: "text-terracota",
  },
  {
    label: "Minhas tasks",
    value: "8",
    detail: "3 precisam de atenção",
    icon: ListChecks,
    tone: "text-vinho-light",
  },
  {
    label: "Revisões pendentes",
    value: "4",
    detail: "Lapidação e esquadro",
    icon: CheckCircle2,
    tone: "text-success",
  },
]

const feedItems = [
  {
    os: "OS12513",
    title: "Avançou para Encaixe",
    meta: "há 2 horas · Equipe Comercial",
    status: "em andamento",
  },
  {
    os: "OS12512",
    title: "Recebeu revisão de proposta",
    meta: "há 4 horas · Bianca",
    status: "revisão",
  },
  {
    os: "OS12509",
    title: "Aguardando validação do gestor",
    meta: "há 6 horas · PCP",
    status: "atenção",
  },
]

const notices = [
  {
    title: "Reunião de alinhamento",
    description: "Hoje às 15:00 com Comercial e PCP.",
    icon: MessageSquareText,
    className: "border-vinho/25 bg-vinho/10 text-vinho dark:text-terracota",
  },
  {
    title: "Atraso crítico",
    description: "OS12509 excedeu o tempo estimado na fase de esquadro.",
    icon: AlertTriangle,
    className: "border-danger/30 bg-danger/10 text-danger",
  },
]

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 border-b border-border pb-6 md:flex-row md:items-end">
        <div className="max-w-2xl space-y-2">
          <p className="font-montserrat text-xs font-semibold uppercase text-terracota">
            Fundação Risca
          </p>
          <h1 className="font-montserrat text-3xl font-semibold tracking-normal text-text-1 md:text-4xl">
            Olá, Marcus.
          </h1>
          <p className="text-sm leading-6 text-text-2 md:text-base">
            Aqui está o painel inicial para acompanhar rotina, alertas e os
            próximos encaixes do Arali Flow.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="gap-2">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Ver agenda
          </Button>
          <Button className="gap-2 shadow-md">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nova OS
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="hover:bg-surface-2">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-3">
              <div className="space-y-1">
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className={`pt-1 text-4xl ${metric.tone}`}>
                  {metric.value}
                </CardTitle>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface-1">
                <metric.icon
                  className={`h-5 w-5 ${metric.tone}`}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs font-medium text-text-3">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <Card className="hover:bg-surface-2">
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Movimentações recentes</CardTitle>
              <CardDescription>Feed do time fixado no topo.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-text-2">
              Feed
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {feedItems.map((item) => (
                <div
                  key={item.os}
                  className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <div className="w-fit rounded-md border border-vinho/25 bg-vinho/10 px-2.5 py-1 font-mono text-xs font-medium text-vinho dark:border-terracota/25 dark:bg-terracota/10 dark:text-terracota">
                    {item.os}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text-1">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-text-3">{item.meta}</p>
                  </div>
                  <span className="w-fit rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs font-medium text-text-2">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="hover:bg-surface-2">
            <CardHeader>
              <CardTitle>Avisos importantes</CardTitle>
              <CardDescription>Lembretes para o dia.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {notices.map((notice) => (
                <div
                  key={notice.title}
                  className={`rounded-lg border p-4 ${notice.className}`}
                >
                  <div className="flex gap-3">
                    <notice.icon
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="font-montserrat text-sm font-semibold">
                        {notice.title}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-text-2">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-terracota/30 bg-terracota/10 hover:bg-terracota/10">
            <CardHeader>
              <CardTitle className="text-lg">Próximo checkpoint</CardTitle>
              <CardDescription>
                Validar shell, login e navegação mobile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-text-2">Semana 01 · Risca</p>
                <span className="rounded-md border border-terracota/30 bg-bg px-2.5 py-1 font-mono text-xs text-terracota">
                  ativo
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
