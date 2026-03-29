import Link from "next/link";

type PostPreviewProps = {
  title: string;
  description: string;
  date: string;
  slug: string;
  showDate?: boolean;
};

const PostPreview = ({
  title,
  description,
  date,
  slug,
  showDate = false,
}: PostPreviewProps) => {
  const formattedDate = (() => {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? ""
      : parsed.toLocaleDateString("en-US", {
          month: "2-digit",
          year: "numeric",
        });
  })();

  return (
    <Link href={`/blog/${slug}`}>
      <div className="group flex justify-between pb-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base text-foreground transition duration-200 ease-in-out group-hover:text-muted-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {showDate ? (
          <p className="hidden min-w-fit text-sm text-muted-foreground/60 md:block">
            {formattedDate}
          </p>
        ) : null}
      </div>
    </Link>
  );
};

export default PostPreview;
