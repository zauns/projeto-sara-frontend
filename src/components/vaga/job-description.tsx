interface JobDescriptionProps {
  content: string;
}

export function JobDescription({ content }: JobDescriptionProps) {
  // Processa os negritos do markdown simples
  const processContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={idx} className="font-semibold text-gray-900 mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      return (
        <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Descrição da vaga</h2>
      <div className="text-gray-700 whitespace-pre-wrap">
        {processContent(content)}
      </div>
    </section>
  );
}