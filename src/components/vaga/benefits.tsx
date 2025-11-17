import { Calendar, Briefcase, Activity, Car } from 'lucide-react';

interface BenefitsListProps {
  benefits: {
    icon: 'calendar' | 'luggage' | 'activity' | 'car';
    text: string;
  }[];
}

const iconMap = {
  calendar: Calendar,
  luggage: Briefcase,
  activity: Activity,
  car: Car,
};

export function BenefitsList({ benefits }: BenefitsListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Benefícios</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, idx) => {
          const Icon = iconMap[benefit.icon];
          return (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-700 text-sm leading-relaxed pt-2">
                {benefit.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}