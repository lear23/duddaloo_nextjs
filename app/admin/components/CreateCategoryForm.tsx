// app/admin/components/CreateCategoryForm.tsx
"use client";

import { useActionState, useRef, useEffect } from "react";
import { createCategory } from "../actions/createCategory";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Creating..." : "Add Category"}
    </button>
  );
}

export default function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategory, {
    success: false,
    error: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state?.error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm bg-green-50 p-2 rounded">
          ✅ Category created!
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Category Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Posters"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Slug (optional)
        </label>
        <input
          type="text"
          name="slug"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="auto-generated from name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Optional description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          📏 Tamaños disponibles (opcional)
        </label>
        <input
          type="text"
          name="sizes"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., XS, S, M, L, XL (separados por comas)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si esta categoría tiene variaciones de tamaño, ingresalas aquí. Dejar
          en blanco si no aplica (ej: Libros).
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
