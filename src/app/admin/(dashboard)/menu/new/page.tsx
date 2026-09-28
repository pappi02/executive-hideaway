import { createChapter } from "../actions";
import { ChapterForm } from "../ChapterForm";

export default function NewChapterPage() {
  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">New chapter</h1>
      <ChapterForm action={createChapter} submitLabel="Create chapter" backHref="/admin/menu" />
    </div>
  );
}
