import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-between">
      <div className="flex flex-col items-left justify-center h-screen ml-[3%] mr-[3%]">
        <Image 
        src="/logo.png" alt="Logo" 
        width={704.29} height={606} />
      </div>
      <div className="bg-[#FFE8A3] h-screen w-[60%] flex flex-col items-right rounded-l-[100px]">
        <div className="flex flex-col justify-center items-center h-screen space-y-[5%]">
          <div className="flex flex-col justify-center items-center gap-y-6">
            <div className="bg-[#8D6E63] w-[569px] h-[103px] rounded-2xl font-['Inter'] text-[48px] text-[#FFFFFF] flex justify-center items-center 
            shadow-md cursor-pointer hover:opacity-90 hover:text-black">
              Customer
            </div>
            <div className="text-[#D64545] font-['Inter'] text-[20px] underline">
              สำหรับลูกค้าที่ต้องการสั่งอาหารในร้าน
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-6">
            <div className="bg-[#C49A6C] w-[569px] h-[103px] rounded-2xl font-['Inter'] text-[48px] text-[#FFFFFF] flex justify-center items-center 
            shadow-md cursor-pointer hover:opacity-90 hover:text-black">
              Owner
            </div>
            <div className="text-[#D64545] font-['Inter'] text-[20px] underline">
              สำหรับร้านคาเฟ่เท่านั้น
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
