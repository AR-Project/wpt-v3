import { useDeleteCategory } from "../api/hooks";

type Props = {
  categories: {
    id: string;
    name: string;
    sortOrder: number | null;
  }[]
}

export function CategoryList({ categories }: Props) {
  const deleteMutation = useDeleteCategory()


  return (
    <div>{categories.map((c) => (<div key={c.id}>
      {c.name}
      <button type='button' onClick={() => deleteMutation.mutate({ id: c.id })}>❌</button>
    </div>))}</div>
  )
}
