interface PostHeaderProps {
  title: string;
  readTime: string;
  date: string;
}

const PostHeader = ({ title, readTime, date }: PostHeaderProps) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between gap-4 pb-8 align-middle">
        <div>
          <h1 className="pb-1.5 font-display text-xl font-semibold text-neutral-700">
            {title}
          </h1>
          <h3 className="whitespace-pre text-sm text-neutral-400">
            {date} <span className={`text-[red] `}>•</span>
            {"  "}
            <span className="italic">{readTime}</span>
          </h3>
        </div>
      </div>
    </>
  );
};

export default PostHeader;
