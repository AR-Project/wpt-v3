import { useForm } from "@tanstack/react-form"
import { createCategorySchema } from "@wpt/backend/shared"
import { useCreateCategory } from "../api/hooks"
import type { SubmitEventHandler } from "react"


export default function CreateCategoryForm() {
  const { mutate, isPending } = useCreateCategory()
  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: createCategorySchema },
    onSubmit: ({ value }) => {
      mutate(value)
      form.reset()
    }
  })

  const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }

  return (
    <form
      onSubmit={onSubmit}
    >

      <form.Field name="name">
        {(field) => (
          <div className="mb-2">
            <input
              id={field.name}
              name={field.name}
              placeholder="Category name..."
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="border border-black/10 p-1"
              aria-invalid={!field.state.meta.isValid}
              aria-describedby={`${field.name}-error`}
            />
            {/* display validation errors (Zod -> field.state.meta.errors) */}
            {!field.state.meta.isValid && (
              <div id={`${field.name}-error`} role="alert" className="text-rose-500">
                {field.state.meta.errors.map((e) => e?.message).join(",")}
              </div>
            )}
          </div>
        )}
      </form.Field>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={isPending} className='disabled:text-red-600'>Create</button>
        <button type="button" onClick={() => form.reset()}>
          Clear
        </button>
      </div>
    </form>

  )
}
