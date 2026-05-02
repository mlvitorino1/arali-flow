import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Página Inicial",
  description: "Visão geral do Arali Flow",
}

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight font-montserrat text-text-1">
            Olá, Marcus!
          </h1>
          <p className="text-text-2 mt-1 text-sm">
            Aqui está o resumo das suas atividades de hoje.
          </p>
        </div>
        <Button className="shadow-md h-10">Nova Ordem de Serviço</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Projetos em Andamento</CardDescription>
            <CardTitle className="text-4xl text-terracota pt-1">12</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-text-3 font-medium">+2 novos esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tarefas Pendentes</CardDescription>
            <CardTitle className="text-4xl text-vinho-light pt-1">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-text-3 font-medium">3 atrasadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revisões Aguardando</CardDescription>
            <CardTitle className="text-4xl pt-1">4</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-text-3 font-medium">No setor de lapidação</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Últimas Movimentações</CardTitle>
            <CardDescription>Feed recente do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 bg-surface-3 rounded-full mr-4 flex items-center justify-center border border-border shrink-0">
                    <span className="text-[10px] font-montserrat font-medium text-text-2">OS</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none text-text-1">OS1251{i} avançou para Encaixe</p>
                    <p className="text-sm text-text-3">Há {i * 2} horas por Equipe A</p>
                  </div>
                  <div className="ml-auto font-mono text-sm text-terracota hover:text-terra-light transition-colors cursor-pointer">
                    Visualizar
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Avisos Importantes</CardTitle>
            <CardDescription>Lembretes do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-md bg-vinho/10 border border-vinho/25 transition-colors hover:bg-vinho/15 cursor-pointer">
              <h4 className="font-montserrat text-sm font-semibold text-vinho dark:text-terracota">Reunião de Alinhamento</h4>
              <p className="text-sm mt-1 text-text-2">Hoje às 15:00 na sala principal.</p>
            </div>
            <div className="p-4 rounded-md bg-terracota/10 border border-terracota/30 transition-colors hover:bg-terracota/15 cursor-pointer">
              <h4 className="font-montserrat text-sm font-semibold text-terracota">Atraso Crítico</h4>
              <p className="text-sm mt-1 text-text-2">A OS12509 excedeu o tempo estimado na fase de esquadro.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
