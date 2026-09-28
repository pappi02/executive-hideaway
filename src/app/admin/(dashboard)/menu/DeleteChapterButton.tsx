import { deleteChapter } from "./actions";

export function DeleteChapterButton({ chapterId }: { chapterId: string }) {
  return (
    <form action={deleteChapter}>
      <input type="hidden" name="id" value={chapterId} />
      <button
        type="submit"
        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600/70 hover:text-red-600"
      >
        Delete chapter
      </button>
    </form>
  );
}
