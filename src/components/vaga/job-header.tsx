import Image from 'next/image';

interface JobHeaderProps {
  title: string;
  location: string;
  postedDays: number;
  company: string;
}

export function JobHeader({ title, location, postedDays, company }: JobHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
      
      <p className="text-sm text-gray-500">
        {location} - Anunciada há {postedDays} dias
      </p>

      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Image
            src="/icons/logoSara.png"
            alt={company}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <span className="text-lg font-medium text-gray-900">{company}</span>
      </div>
    </div>
  );
}