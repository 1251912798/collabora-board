import Image from "next/image";
export const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={70}
        height={70}
        className="animate-pulse duration-700"
      />
      <span className="ml-2 animate-pulse duration-700 text-sm">
        马上就好...
      </span>
    </div>
  );
};
