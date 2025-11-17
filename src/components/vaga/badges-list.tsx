interface BadgesListProps {
  tags: string[];
}

export function BadgesList({ tags }: BadgesListProps) {
  return (
    <div className="flex flex-wrap gap-2 py-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}