export function Home() {
  return (
    <div className="flex flex-col items-center justify-start p-4">
      <div className="text-center mt-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Simulação de Declaração de Imposto de Renda</h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
          Entenda como funciona a declaração de imposto de renda, quem deve fazer e como podemos te ajudar a simplificar esse processo.
        </p>
      </div>
      <div className="p-8 rounded-lg shadow-lg max-w-4xl mt-12">
        <h2 className="text-3xl font-bold mb-6">O que é?</h2>
        <p className="text-lg mb-6">
          A declaração de imposto de renda é um documento que deve ser enviado anualmente à Receita Federal, informando os rendimentos e despesas do ano anterior.
        </p>
        <h2 className="text-3xl font-bold mb-6">Como funciona?</h2>
        <p className="text-lg mb-6">
          Nosso sistema permite que você simule a sua declaração de imposto de renda, ajudando a entender melhor o processo e a evitar erros comuns.
        </p>
        <h2 className="text-3xl font-bold mb-6">Quem deve fazer?</h2>
        <p className="text-lg">
          Todas as pessoas físicas que tiveram rendimentos tributáveis acima de um determinado valor no ano anterior devem fazer a declaração de imposto de renda.
        </p>
      </div>
    </div>
  );
}