type Props = { title: string; subtitle?: string; right?: React.ReactNode };
export default function PageHeader({ title, subtitle, right }: Props) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
