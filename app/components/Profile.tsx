import { MicroCMSImage } from "microcms-js-sdk";
import Image from "next/image";
import Title from "./Title";

type Props = {
  description: string;
  image?: MicroCMSImage;
};

const Profile: React.FC<Props> = ({ description, image }) => {
  return (
    <div>
      <Title title="Profile" />
      <div className="flex justify-center items-center flex-col sm:flex-row">
        <Image
          className="rounded-full mx-5"
          src={image?.url || "/profile.jpg"}
          alt="profile"
          width={200}
          height={200}
        />
        <article className="mt-5 mx-5" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
};

export default Profile;
