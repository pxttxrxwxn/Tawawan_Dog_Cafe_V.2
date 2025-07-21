import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-between">
      <div className="flex flex-col items-left justify-center h-screen m-[0,5%,0]">
        <Image 
        src="/logo.png" alt="Logo" 
        width={704.29} height={606} />
      </div>
      <div className="bg-[#FFE8A3] h-screen w-[60%] flex flex-col items-right rounded-l-[100px]">
        <div className="flex flex-col justify-center items-center h-screen space-y-6">
          <div className="bg-[#8D6E63] w-[569px] h-[103px] rounded-2xl text-[48px] text-white flex justify-center items-center 
          shadow-md cursor-pointer hover:opacity-90">
            Customer
          </div>

          <div className="bg-[#C49A6C] w-[569px] h-[103px] rounded-2xl text-[48px] text-white flex justify-center items-center 
          shadow-md cursor-pointer hover:opacity-90">
            Owner
          </div>
        </div>
      </div>
    </div>
  );
}
