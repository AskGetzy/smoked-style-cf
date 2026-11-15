import { listCategories, photoUrl } from "@/lib/products";
import { requireStaff } from "@/lib/session";
import { addCategory, updateCategory } from "./actions";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const user = await requireStaff();
  const canEdit = user.role !== "staff";
  const { saved, error } = await searchParams;
  const categories = await listCategories();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Categories</h1>
      <p className="text-sm text-ink-soft">
        These are the tiles under &ldquo;Shop by the cut&rdquo; on the homepage. Pick a photo, edit the small caption, or change the order
        (lowest number first). JPG, PNG, WEBP or HEIC, up to 8 MB. Square photos look best.
      </p>
      {saved && <p className="bg-ok/15 px-3 py-2 text-sm text-ok">Saved &ldquo;{saved}&rdquo;.</p>}
      {error && <p className="bg-ember/15 px-3 py-2 text-sm text-ember">{error}</p>}

      <ul className="space-y-4">
        {categories.map((c) => (
          <li key={c.id} className="card">
            <form action={updateCategory} className="flex flex-wrap items-start gap-4 p-4">
              <input type="hidden" name="id" value={c.id} />
              <div className="stripe-dark h-28 w-28 shrink-0 overflow-hidden border-2 border-charcoal">
                {c.photo_key ? (
                  <img src={photoUrl(c.photo_key)} alt={c.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-end p-2 font-label text-[11px] uppercase tracking-widest text-[#9c8f80]">No photo</span>
                )}
              </div>
              <div className="grid min-w-0 flex-1 basis-64 gap-3 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor={`name-${c.id}`}>Name</label>
                  <input id={`name-${c.id}`} name="name" defaultValue={c.name} required className="field" disabled={!canEdit} />
                </div>
                <div>
                  <label className="label" htmlFor={`note-${c.id}`}>Caption</label>
                  <input id={`note-${c.id}`} name="note" defaultValue={c.note} maxLength={40} className="field" disabled={!canEdit} />
                </div>
                <div>
                  <label className="label" htmlFor={`photo-${c.id}`}>{c.photo_key ? "Replace photo" : "Add photo"}</label>
                  <input id={`photo-${c.id}`} name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="field" disabled={!canEdit} />
                  {c.photo_key && canEdit && (
                    <label className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                      <input type="checkbox" name="remove_photo" value="1" /> Remove photo
                    </label>
                  )}
                </div>
                <div>
                  <label className="label" htmlFor={`sort-${c.id}`}>Order</label>
                  <input id={`sort-${c.id}`} name="sort_order" type="number" defaultValue={c.sort_order} className="field" disabled={!canEdit} />
                </div>
              </div>
              {canEdit && <button className="btn-primary self-end">Save</button>}
            </form>
          </li>
        ))}
      </ul>

      {canEdit && (
        <form action={addCategory} className="card flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-0 flex-1 basis-56">
            <label className="label" htmlFor="new-name">New category</label>
            <input id="new-name" name="name" placeholder="e.g. Sides" required className="field" />
          </div>
          <button className="btn-ghost">+ Add category</button>
        </form>
      )}
    </div>
  );
}
