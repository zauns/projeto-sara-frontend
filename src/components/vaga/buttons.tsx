'use client';

interface ActionButtonsProps {
  jobId: string;
}

export function ActionButtons({ jobId }: ActionButtonsProps) {
  const handleApply = () => {
    // TODO: Implementar chamada à API
  };

  const handleSave = () => {
    // TODO: Implementar chamada à API
  };

  return (
    <div className="flex gap-4 pt-6 sticky bottom-0 bg-white/95 backdrop-blur-sm pb-4">
      <button
        onClick={handleApply}
        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Candidatar-se
      </button>
      <button
        onClick={handleSave}
        className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Salvar vaga
      </button>
    </div>
  );
}