'use client';
type Props = { projectId: string };

export default function DrawingsUploader({ projectId }: Props) {
  const onChange = async (_e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: upload to storage then save metadata
  };

  return (
    <div className="rounded border p-4">
      <p className="text-sm text-gray-600 mb-2">Project ID: {projectId}</p>
      <input type="file" multiple onChange={onChange} />
      <div className="mt-3 text-sm text-gray-600">Accepted: JPG/PNG/PDF (mock)</div>
    </div>
  );
}
