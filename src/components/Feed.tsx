import { prisma } from "@/lib/prisma";
import Post from "./Post";

const Feed = async () => {
  const posts = await prisma.post.findMany();
  return (
    <div className="">
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
